"""Write the whole public content as one JSON file the frontend can read without any API.

The site keeps working even when no backend is running: run this command after editing the
content, commit the resulting file, and the frontend serves it. Output shape is identical to the API.
"""
import json
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from apps.portfolio import models, serializers


class Command(BaseCommand):
    help = "Export profile, projects, experience, achievements and skills to frontend/data/snapshot.json"

    def add_arguments(self, parser):
        parser.add_argument(
            "--output",
            default=str(Path(settings.BASE_DIR).parent / "frontend" / "data" / "snapshot.json"),
            help="Where to write the snapshot (default: frontend/data/snapshot.json)",
        )

    def handle(self, *args, **options):
        profile = models.Profile.objects.first()
        if profile is None:
            raise CommandError("No profile in the database. Run `manage.py seed_portfolio` first.")

        snapshot = {
            "profile": serializers.ProfileSerializer(profile).data,
            "projects": serializers.ProjectSerializer(models.Project.objects.all(), many=True).data,
            "experience": serializers.ExperienceSerializer(models.Experience.objects.all(), many=True).data,
            "achievements": serializers.AchievementSerializer(models.Achievement.objects.all(), many=True).data,
            "skills": serializers.SkillGroupSerializer(models.SkillGroup.objects.all(), many=True).data,
        }

        output = Path(options["output"])
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        self.stdout.write(self.style.SUCCESS(f"Snapshot written to {output} ({len(snapshot['projects'])} projects)."))
