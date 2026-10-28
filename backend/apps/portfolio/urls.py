from django.urls import path

from . import views

urlpatterns = [
    path("health/", views.HealthView.as_view()),
    path("profile/", views.ProfileView.as_view()),
    path("projects/", views.ProjectListView.as_view()),
    path("projects/<slug:slug>/", views.ProjectDetailView.as_view()),
    path("articles/", views.ArticleListView.as_view()),
    path("articles/<slug:slug>/", views.ArticleDetailView.as_view()),
    path("experience/", views.ExperienceListView.as_view()),
    path("achievements/", views.AchievementListView.as_view()),
    path("skills/", views.SkillListView.as_view()),
    path("contact/", views.ContactView.as_view()),
]
