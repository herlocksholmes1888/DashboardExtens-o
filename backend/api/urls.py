from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

from .views import MedicamentoViewSet, PacienteViewSet, PrescricaoMedicamentoViewSet, RegisterView
from django.urls import path, include

router = DefaultRouter()
router.register(r'medicamentos', MedicamentoViewSet, basename='medicamento')
router.register(r'pacientes', PacienteViewSet, basename='paciente')
router.register(r'prescricoes', PrescricaoMedicamentoViewSet, basename='prescricao')

urlpatterns = [
    path('', include(router.urls)),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh')
]
