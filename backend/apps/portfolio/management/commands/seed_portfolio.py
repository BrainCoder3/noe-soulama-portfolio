"""Load the portfolio content from backend/data/*.json (the single source of truth).

Idempotent: running it twice gives the same database. Records that are no longer in the
JSON files are removed, so the files and the database never drift apart.
"""
import json
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.portfolio import models


def flatten(record: dict) -> dict:
    """{"title": {"en": "a", "fr": "b"}} -> {"title_en": "a", "title_fr": "b"}."""
    flat = {}
    for key, value in record.items():
        if isinstance(value, dict) and set(value) == {"en", "fr"}:
            flat[f"{key}_en"] = value["en"]
            flat[f"{key}_fr"] = value["fr"]
        else:
            flat[key] = value
    return flat


def load(directory: Path, name: str):
    path = directory / name
    if not path.exists():
        raise CommandError(f"Missing seed file: {path}")
    return json.loads(path.read_text(encoding="utf-8"))


class Command(BaseCommand):
    help = "Load or refresh portfolio content from backend/data/*.json"

    @transaction.atomic
    def handle(self, *args, **options):
        directory = Path(settings.SEED_DIR)

        profile = flatten(load(directory, "profile.json"))
        models.Profile.objects.all().delete()
        models.Profile.objects.create(**profile)

        slugs = []
        for record in load(directory, "projects.json"):
            record = flatten(record)
            slug = record.pop("slug")
            slugs.append(slug)
            models.Project.objects.update_or_create(slug=slug, defaults=record)
        models.Project.objects.exclude(slug__in=slugs).delete()

        article_slugs = []
        for record in load(directory, "articles.json"):
            record = flatten(record)
            slug = record.pop("slug")
            article_slugs.append(slug)
            models.Article.objects.update_or_create(slug=slug, defaults=record)
        models.Article.objects.exclude(slug__in=article_slugs).delete()

        models.Experience.objects.all().delete()
        for order, record in enumerate(load(directory, "experience.json"), start=1):
            models.Experience.objects.create(order=order, **flatten(record))

        models.Achievement.objects.all().delete()
        for order, record in enumerate(load(directory, "achievements.json"), start=1):
            models.Achievement.objects.create(order=order, **flatten(record))

        keys = []
        for order, record in enumerate(load(directory, "skills.json"), start=1):
            record = flatten(record)
            key = record.pop("key")
            keys.append(key)
            models.SkillGroup.objects.update_or_create(key=key, defaults={"order": order, **record})
        models.SkillGroup.objects.exclude(key__in=keys).delete()

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded: {models.Project.objects.count()} projects, "
                f"{models.Experience.objects.count()} experiences, "
                f"{models.Achievement.objects.count()} achievements, "
                f"{models.SkillGroup.objects.count()} skill groups."
            )
        )
