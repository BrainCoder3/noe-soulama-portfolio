from django.contrib import admin

from . import models

admin.site.register(models.Profile)
admin.site.register(models.Experience)
admin.site.register(models.Achievement)
admin.site.register(models.SkillGroup)


@admin.register(models.Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "kind", "status", "priority", "featured")
    list_filter = ("kind", "status", "featured")
    search_fields = ("title", "summary_en")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(models.ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "created_at")
    readonly_fields = ("name", "email", "message", "created_at")
