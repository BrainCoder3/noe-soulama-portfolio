from rest_framework import serializers

from . import models


class BilingualSerializer(serializers.ModelSerializer):
    """Folds `<field>_en` / `<field>_fr` columns into `{"<field>": {"en": ..., "fr": ...}}`."""

    bilingual: tuple[str, ...] = ()

    def to_representation(self, instance):
        data = super().to_representation(instance)
        for field in self.bilingual:
            data[field] = {"en": data.pop(f"{field}_en", ""), "fr": data.pop(f"{field}_fr", "")}
        return data


def _fold_label(item: dict) -> dict:
    """Recursively fold every `<k>_en` / `<k>_fr` pair of a JSON record into `{"<k>": {en, fr}}`."""
    folded = {}
    for key, value in item.items():
        if key.endswith("_en") and f"{key[:-3]}_fr" in item:
            folded[key[:-3]] = {"en": value, "fr": item[f"{key[:-3]}_fr"]}
        elif key.endswith("_fr") and f"{key[:-3]}_en" in item:
            continue
        elif isinstance(value, list):
            folded[key] = [_fold_label(v) if isinstance(v, dict) else v for v in value]
        else:
            folded[key] = value
    return folded


class ProfileSerializer(BilingualSerializer):
    bilingual = ("headline", "tagline", "bio")

    class Meta:
        model = models.Profile
        exclude = ["id"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["stats"] = [_fold_label(s) for s in instance.stats]
        return data


class ProjectSerializer(BilingualSerializer):
    bilingual = ("summary", "result", "limit", "role")

    class Meta:
        model = models.Project
        exclude = ["id"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["metrics"] = [_fold_label(m) for m in instance.metrics]
        return data


class ExperienceSerializer(BilingualSerializer):
    bilingual = ("role", "description")

    class Meta:
        model = models.Experience
        exclude = ["id", "order"]


class AchievementSerializer(BilingualSerializer):
    bilingual = ("title", "event", "detail")

    class Meta:
        model = models.Achievement
        exclude = ["id", "order"]


class SkillGroupSerializer(BilingualSerializer):
    bilingual = ("name", "proof")

    class Meta:
        model = models.SkillGroup
        exclude = ["id", "order"]


class ContactSerializer(serializers.ModelSerializer):
    # Honeypot: real visitors never see or fill this field.
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)
    message = serializers.CharField(min_length=10, max_length=2000)

    class Meta:
        model = models.ContactMessage
        fields = ["name", "email", "message", "website"]
