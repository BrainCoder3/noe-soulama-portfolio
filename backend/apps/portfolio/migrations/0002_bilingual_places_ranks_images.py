from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("portfolio", "0001_initial")]

    operations = [
        migrations.RenameField("profile", "location", "location_en"),
        migrations.RenameField("profile", "origin", "origin_en"),
        migrations.AddField("profile", "location_fr", models.CharField(blank=True, default="", max_length=120), preserve_default=False),
        migrations.AddField("profile", "origin_fr", models.CharField(blank=True, default="", max_length=120), preserve_default=False),
        migrations.RenameField("experience", "place", "place_en"),
        migrations.AddField("experience", "place_fr", models.CharField(blank=True, default="", max_length=120), preserve_default=False),
        migrations.RenameField("achievement", "rank", "rank_en"),
        migrations.AddField(
            "achievement", "rank_fr", models.CharField(blank=True, default="", help_text="e.g. 1re, 2e", max_length=40), preserve_default=False
        ),
        migrations.AddField("project", "image", models.CharField(blank=True, default="", max_length=200), preserve_default=False),
        migrations.AddField(
            "project",
            "image_fit",
            models.CharField(default="cover", help_text="cover for screenshots, contain for figures", max_length=8),
        ),
        migrations.AddField("project", "image_alt_en", models.CharField(blank=True, default="", max_length=300), preserve_default=False),
        migrations.AddField("project", "image_alt_fr", models.CharField(blank=True, default="", max_length=300), preserve_default=False),
    ]
