from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("portfolio", "0002_bilingual_places_ranks_images")]

    operations = [
        migrations.AddField("profile", "cv_url", models.CharField(blank=True, default="", max_length=200), preserve_default=False),
    ]
