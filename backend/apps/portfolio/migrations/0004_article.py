from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("portfolio", "0003_profile_cv_url")]

    operations = [
        migrations.CreateModel(
            name="Article",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("slug", models.SlugField(unique=True)),
                ("project_slug", models.SlugField(blank=True, help_text="Project this article reports on")),
                ("priority", models.PositiveSmallIntegerField(help_text="1 = shown first")),
                ("date", models.CharField(help_text="YYYY-MM", max_length=7)),
                ("reading_minutes", models.PositiveSmallIntegerField(default=3)),
                ("repo_url", models.URLField(blank=True)),
                ("title_en", models.CharField(max_length=200)),
                ("title_fr", models.CharField(max_length=200)),
                ("subtitle_en", models.TextField()),
                ("subtitle_fr", models.TextField()),
                ("blocks", models.JSONField(default=list)),
            ],
            options={"ordering": ["priority", "-date"]},
        ),
    ]
