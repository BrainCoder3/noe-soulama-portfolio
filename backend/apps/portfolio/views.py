from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from . import models, serializers


class HealthView(APIView):
    throttle_classes: list = []

    def get(self, request):
        return Response({"status": "ok"})


class ProfileView(APIView):
    def get(self, request):
        profile = models.Profile.objects.first()
        if profile is None:
            return Response({"detail": "Profile not seeded. Run manage.py seed_portfolio."}, status=404)
        return Response(serializers.ProfileSerializer(profile).data)


class ProjectListView(generics.ListAPIView):
    serializer_class = serializers.ProjectSerializer
    pagination_class = None

    def get_queryset(self):
        qs = models.Project.objects.all()
        kind = self.request.query_params.get("kind")
        if kind:
            qs = qs.filter(kind=kind)
        if self.request.query_params.get("featured") in ("1", "true"):
            qs = qs.filter(featured=True)
        return qs


class ProjectDetailView(generics.RetrieveAPIView):
    queryset = models.Project.objects.all()
    serializer_class = serializers.ProjectSerializer
    lookup_field = "slug"


class ExperienceListView(generics.ListAPIView):
    queryset = models.Experience.objects.all()
    serializer_class = serializers.ExperienceSerializer
    pagination_class = None


class AchievementListView(generics.ListAPIView):
    queryset = models.Achievement.objects.all()
    serializer_class = serializers.AchievementSerializer
    pagination_class = None


class SkillListView(generics.ListAPIView):
    queryset = models.SkillGroup.objects.all()
    serializer_class = serializers.SkillGroupSerializer
    pagination_class = None


class ContactView(APIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "contact"

    def post(self, request):
        serializer = serializers.ContactSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if not serializer.validated_data.get("website"):
            models.ContactMessage.objects.create(
                name=serializer.validated_data["name"],
                email=serializer.validated_data["email"],
                message=serializer.validated_data["message"],
            )
        # A filled honeypot gets the same answer, so bots learn nothing.
        return Response({"status": "received"}, status=status.HTTP_201_CREATED)
