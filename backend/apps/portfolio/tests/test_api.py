import json

from django.core.management import call_command
from django.test import TestCase
from rest_framework.test import APIClient

from apps.portfolio import models

API = "/api/v1"


class SeededTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("seed_portfolio", verbosity=0)

    def setUp(self):
        self.client = APIClient()


class SeedTests(SeededTestCase):
    def test_seed_is_idempotent(self):
        before = (models.Project.objects.count(), models.Achievement.objects.count())
        call_command("seed_portfolio", verbosity=0)
        self.assertEqual(before, (models.Project.objects.count(), models.Achievement.objects.count()))

    def test_every_project_is_bilingual(self):
        for project in models.Project.objects.all():
            self.assertTrue(project.summary_en and project.summary_fr, project.slug)
            self.assertTrue(project.limit_en and project.limit_fr, f"{project.slug} must state its limits")

    def test_public_repos_only(self):
        for project in models.Project.objects.all():
            if project.code_is_private:
                self.assertEqual(project.repo_url, "", f"{project.slug} is private but has a repo link")
            if project.repo_url:
                self.assertTrue(project.repo_url.startswith("https://github.com/BrainCoder3/"))

    def test_images_exist_and_have_alt_text(self):
        from pathlib import Path

        from django.conf import settings

        public = Path(settings.BASE_DIR).parent / "frontend" / "public"
        for project in models.Project.objects.exclude(image=""):
            self.assertTrue((public / project.image.lstrip("/")).is_file(), f"{project.slug}: missing {project.image}")
            self.assertTrue(project.image_alt_en and project.image_alt_fr, f"{project.slug}: image needs alt text")

    def test_french_has_no_english_leftovers(self):
        achievement = models.Achievement.objects.get(rank_en="1st", title_en="Hackathon".replace("Hackathon", "Project contest"))
        self.assertEqual(achievement.rank_fr, "1re")
        for experience in models.Experience.objects.exclude(place_en=""):
            self.assertTrue(experience.place_fr, experience.org)

    def test_priorities_are_unique(self):
        priorities = list(models.Project.objects.values_list("priority", flat=True))
        self.assertEqual(len(priorities), len(set(priorities)))


class ReadEndpointTests(SeededTestCase):
    def test_health(self):
        self.assertEqual(self.client.get(f"{API}/health/").json(), {"status": "ok"})

    def test_profile_is_folded_into_languages(self):
        data = self.client.get(f"{API}/profile/").json()
        self.assertEqual(data["name"], "Noé Soulama")
        self.assertIn("en", data["headline"])
        self.assertIn("fr", data["bio"])
        self.assertEqual(data["stats"][0]["value"], {"en": "1st / 49", "fr": "1er / 49"})
        self.assertEqual(data["location"]["fr"], "Tétouan, Maroc")
        self.assertEqual(set(data["stats"][0]["label"]), {"en", "fr"})

    def test_projects_are_ordered_by_priority(self):
        data = self.client.get(f"{API}/projects/").json()
        self.assertEqual(data[0]["slug"], "robustclip-lite")
        priorities = [p["priority"] for p in data]
        self.assertEqual(priorities, sorted(priorities))

    def test_filters(self):
        research = self.client.get(f"{API}/projects/?kind=research").json()
        self.assertTrue(research and all(p["kind"] == "research" for p in research))
        featured = self.client.get(f"{API}/projects/?featured=1").json()
        self.assertTrue(featured and all(p["featured"] for p in featured))

    def test_project_detail_folds_metrics(self):
        data = self.client.get(f"{API}/projects/whisper-robustness/").json()
        series = data["metrics"][0]
        self.assertEqual(series["type"], "series")
        self.assertEqual(series["points"][0]["x"], {"en": "No noise", "fr": "Sans bruit"})
        pair = self.client.get(f"{API}/projects/robustclip-lite/").json()["metrics"][0]
        self.assertEqual((pair["before"], pair["after"]), (3.9, 8.9))
        self.assertIn("en", pair["label"])

    def test_unknown_project_is_404(self):
        self.assertEqual(self.client.get(f"{API}/projects/nope/").status_code, 404)

    def test_other_collections(self):
        for name in ("experience", "achievements", "skills"):
            response = self.client.get(f"{API}/{name}/")
            self.assertEqual(response.status_code, 200, name)
            self.assertTrue(len(response.json()) > 0, name)

    def test_api_is_read_only_except_contact(self):
        self.assertEqual(self.client.post(f"{API}/projects/", {}).status_code, 405)


class ProfileMissingTests(TestCase):
    def test_profile_404_before_seed(self):
        self.assertEqual(APIClient().get(f"{API}/profile/").status_code, 404)


class ContactTests(TestCase):
    def setUp(self):
        from django.core.cache import cache

        cache.clear()
        self.client = APIClient()
        self.valid = {"name": "Ada", "email": "ada@example.com", "message": "Hello, I like your RobustCLIP work."}

    def post(self, payload):
        return self.client.post(f"{API}/contact/", json.dumps(payload), content_type="application/json")

    def test_valid_message_is_stored(self):
        self.assertEqual(self.post(self.valid).status_code, 201)
        self.assertEqual(models.ContactMessage.objects.count(), 1)

    def test_invalid_email_and_short_message_are_rejected(self):
        self.assertEqual(self.post({**self.valid, "email": "not-an-email"}).status_code, 400)
        self.assertEqual(self.post({**self.valid, "message": "hi"}).status_code, 400)
        self.assertEqual(models.ContactMessage.objects.count(), 0)

    def test_honeypot_looks_accepted_but_stores_nothing(self):
        self.assertEqual(self.post({**self.valid, "website": "http://spam.example"}).status_code, 201)
        self.assertEqual(models.ContactMessage.objects.count(), 0)

    def test_throttle_limits_a_flood(self):
        # The contact scope allows 5 messages per hour per client (see settings).
        codes = [self.post(self.valid).status_code for _ in range(7)]
        self.assertEqual(codes[:5], [201] * 5)
        self.assertEqual(codes[5], 429)


class SnapshotTests(SeededTestCase):
    def test_snapshot_matches_the_api(self):
        import tempfile
        from pathlib import Path

        with tempfile.TemporaryDirectory() as folder:
            target = Path(folder) / "snapshot.json"
            call_command("export_snapshot", output=str(target), verbosity=0)
            snapshot = json.loads(target.read_text(encoding="utf-8"))

        api_projects = self.client.get(f"{API}/projects/").json()
        self.assertEqual(snapshot["projects"], api_projects)
        self.assertEqual(snapshot["profile"], self.client.get(f"{API}/profile/").json())
        self.assertEqual(set(snapshot), {"profile", "projects", "articles", "experience", "achievements", "skills"})
        self.assertEqual(snapshot["articles"], self.client.get(f"{API}/articles/").json())


class ArticleTests(SeededTestCase):
    def test_articles_are_listed_and_bilingual(self):
        data = self.client.get(f"{API}/articles/").json()
        self.assertEqual(len(data), 4)
        for article in data:
            self.assertTrue(article["title"]["en"] and article["title"]["fr"])
            self.assertTrue(article["blocks"], article["slug"])

    def test_every_text_block_exists_in_both_languages(self):
        for article in self.client.get(f"{API}/articles/").json():
            for block in article["blocks"]:
                for key, value in block.items():
                    if isinstance(value, dict) and set(value) == {"en", "fr"}:
                        self.assertEqual(bool(value["en"]), bool(value["fr"]), f"{article['slug']}: {key}")
                        if isinstance(value["en"], list):
                            self.assertEqual(len(value["en"]), len(value["fr"]), f"{article['slug']}: {key}")

    def test_every_article_states_its_limits(self):
        for article in self.client.get(f"{API}/articles/").json():
            headings = [b["text"]["en"] for b in article["blocks"] if b["type"] == "h2"]
            self.assertIn("What this does not show", headings, article["slug"])

    def test_article_figures_exist(self):
        from pathlib import Path

        from django.conf import settings

        public = Path(settings.BASE_DIR).parent / "frontend" / "public"
        for article in self.client.get(f"{API}/articles/").json():
            for block in article["blocks"]:
                if block["type"] == "figure":
                    self.assertTrue((public / block["src"].lstrip("/")).is_file(), block["src"])
                    self.assertTrue(block["alt"]["en"] and block["alt"]["fr"])

    def test_articles_link_to_real_projects(self):
        slugs = set(models.Project.objects.values_list("slug", flat=True))
        for article in self.client.get(f"{API}/articles/").json():
            self.assertIn(article["project_slug"], slugs)

    def test_key_numbers_match_the_repositories(self):
        article = self.client.get(f"{API}/articles/robustclip-noise-robustness/").json()
        text = str(article["blocks"])
        for number in ("3.9", "8.9", "6.0", "10.2", "16.5"):
            self.assertIn(number, text)
        self.assertEqual(self.client.get(f"{API}/articles/nope/").status_code, 404)
