"""Portfolio content. Every visitor-facing text exists in English and French (`*_en`, `*_fr`)."""
from django.db import models


class Profile(models.Model):
    """Singleton: the person the portfolio is about."""

    name = models.CharField(max_length=120)
    full_name = models.CharField(max_length=160)
    headline_en = models.CharField(max_length=200)
    headline_fr = models.CharField(max_length=200)
    tagline_en = models.TextField()
    tagline_fr = models.TextField()
    bio_en = models.TextField()
    bio_fr = models.TextField()
    location_en = models.CharField(max_length=120)
    location_fr = models.CharField(max_length=120, blank=True)
    origin_en = models.CharField(max_length=120)
    origin_fr = models.CharField(max_length=120, blank=True)
    email = models.EmailField()
    github = models.URLField()
    linkedin = models.URLField(blank=True)
    # Path of a CV PDF under frontend/public, e.g. /cv-noe-soulama.pdf. Empty hides the download button.
    cv_url = models.CharField(max_length=200, blank=True)
    # [{"value_en": "1st / 49", "value_fr": "1er / 49", "label_en": "...", "label_fr": "...", "tone": "gold"}]
    stats = models.JSONField(default=list, blank=True)
    # [{"en": "...", "fr": "..."}]
    interests = models.JSONField(default=list, blank=True)
    languages = models.JSONField(default=list, blank=True)

    def __str__(self) -> str:
        return self.name


class Project(models.Model):
    class Kind(models.TextChoices):
        RESEARCH = "research", "Research"
        SYSTEM = "system", "System"
        LEARNING = "learning", "Learning"

    class Status(models.TextChoices):
        LIVE = "live", "Live, in use"
        DEMO = "demo", "Live demo"
        STUDY = "study", "Study"
        BUILT = "built", "Built"
        NOT_LAUNCHED = "not_launched", "Not launched yet"

    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=160)
    kind = models.CharField(max_length=16, choices=Kind.choices)
    status = models.CharField(max_length=16, choices=Status.choices)
    priority = models.PositiveSmallIntegerField(help_text="1 = shown first")
    featured = models.BooleanField(default=False)
    year = models.PositiveSmallIntegerField(null=True, blank=True)
    summary_en = models.TextField()
    summary_fr = models.TextField()
    result_en = models.TextField(blank=True)
    result_fr = models.TextField(blank=True)
    limit_en = models.TextField(blank=True)
    limit_fr = models.TextField(blank=True)
    role_en = models.CharField(max_length=240, blank=True)
    role_fr = models.CharField(max_length=240, blank=True)
    stack = models.JSONField(default=list, blank=True)
    # [{"type": "pair", "label_en", "label_fr", "before", "after", "unit", "max"}]
    # [{"type": "series", "label_en", "label_fr", "unit", "max", "points": [{"x", "y"}]}]
    metrics = models.JSONField(default=list, blank=True)
    # Path under frontend/public (a real screenshot or one of the repository's own result figures)
    image = models.CharField(max_length=200, blank=True)
    image_fit = models.CharField(max_length=8, default="cover", help_text="cover for screenshots, contain for figures")
    image_alt_en = models.CharField(max_length=300, blank=True)
    image_alt_fr = models.CharField(max_length=300, blank=True)
    repo_url = models.URLField(blank=True, help_text="Only public repositories")
    demo_url = models.URLField(blank=True)
    code_is_private = models.BooleanField(default=False)

    class Meta:
        ordering = ["priority", "title"]

    def __str__(self) -> str:
        return self.title


class Article(models.Model):
    """A short technical report about one piece of research. The body is a list of typed blocks."""

    slug = models.SlugField(unique=True)
    project_slug = models.SlugField(blank=True, help_text="Project this article reports on")
    priority = models.PositiveSmallIntegerField(help_text="1 = shown first")
    date = models.CharField(max_length=7, help_text="YYYY-MM")
    reading_minutes = models.PositiveSmallIntegerField(default=3)
    repo_url = models.URLField(blank=True)
    title_en = models.CharField(max_length=200)
    title_fr = models.CharField(max_length=200)
    subtitle_en = models.TextField()
    subtitle_fr = models.TextField()
    # [{"type": "p"|"h2"|"list"|"callout"|"table"|"figure", "<field>_en": ..., "<field>_fr": ...}]
    blocks = models.JSONField(default=list)

    class Meta:
        ordering = ["priority", "-date"]

    def __str__(self) -> str:
        return self.title_en


class Experience(models.Model):
    class Kind(models.TextChoices):
        COMPANY = "company", "Company"
        COMMUNITY = "community", "Community"
        LEADERSHIP = "leadership", "Leadership"

    org = models.CharField(max_length=160)
    kind = models.CharField(max_length=16, choices=Kind.choices)
    role_en = models.CharField(max_length=200)
    role_fr = models.CharField(max_length=200)
    place_en = models.CharField(max_length=120, blank=True)
    place_fr = models.CharField(max_length=120, blank=True)
    start = models.CharField(max_length=20, help_text="Free text, e.g. 2026 or Sept 2025")
    end = models.CharField(max_length=20, blank=True, help_text="Empty = ongoing")
    description_en = models.TextField()
    description_fr = models.TextField()
    order = models.PositiveSmallIntegerField(default=100)

    class Meta:
        ordering = ["order", "-id"]

    def __str__(self) -> str:
        return f"{self.role_en} - {self.org}"


class Achievement(models.Model):
    class Kind(models.TextChoices):
        AWARD = "award", "Award"
        ACADEMIC = "academic", "Academic"
        CERTIFICATE = "certificate", "Certificate"

    kind = models.CharField(max_length=16, choices=Kind.choices)
    title_en = models.CharField(max_length=200)
    title_fr = models.CharField(max_length=200)
    rank_en = models.CharField(max_length=40, blank=True, help_text="e.g. 1st, 2nd")
    rank_fr = models.CharField(max_length=40, blank=True, help_text="e.g. 1re, 2e")
    event_en = models.CharField(max_length=240, blank=True)
    event_fr = models.CharField(max_length=240, blank=True)
    year = models.PositiveSmallIntegerField(null=True, blank=True)
    detail_en = models.TextField(blank=True)
    detail_fr = models.TextField(blank=True)
    order = models.PositiveSmallIntegerField(default=100)

    class Meta:
        ordering = ["order", "-year"]

    def __str__(self) -> str:
        return self.title_en


class SkillGroup(models.Model):
    key = models.SlugField(unique=True)
    name_en = models.CharField(max_length=120)
    name_fr = models.CharField(max_length=120)
    items = models.JSONField(default=list)
    proof_en = models.CharField(max_length=300, blank=True)
    proof_fr = models.CharField(max_length=300, blank=True)
    order = models.PositiveSmallIntegerField(default=100)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return self.name_en


class ContactMessage(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    message = models.TextField(max_length=2000)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.name} <{self.email}>"
