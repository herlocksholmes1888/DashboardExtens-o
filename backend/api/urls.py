from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MedicamentoViewSet, PacienteViewSet, PrescricaoMedicamentoViewSet

router = DefaultRouter()
router.register(r'medicamentos', MedicamentoViewSet, basename='medicamento')
router.register(r'pacientes', PacienteViewSet, basename='paciente')
router.register(r'prescricoes', PrescricaoMedicamentoViewSet, basename='prescricao')

urlpatterns = [
    path('', include(router.urls)),
]
