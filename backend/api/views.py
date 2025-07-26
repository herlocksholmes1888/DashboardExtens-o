from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.db import models

from .models import Paciente, Medicamento, PrescricaoMedicamento, RegistroAdministracao
from .serializers import (
    PacienteSerializer, PacienteDetailSerializer, PacienteCreateSerializer,
    MedicamentoSerializer, MedicamentoCreateSerializer,
    PrescricaoMedicamentoSerializer, PrescricaoDetailSerializer, PrescricaoCreateSerializer,
    RegistroAdministracaoSerializer
)


class PacienteViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar pacientes"""
    
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['sexo', 'ativo']
    search_fields = ['nome_completo', 'cpf']
    ordering_fields = ['nome_completo', 'data_nascimento', 'data_admissao']
    ordering = ['nome_completo']
    
    def get_serializer_class(self):
        """Retorna o serializer apropriado baseado na ação"""
        if self.action == 'retrieve':
            return PacienteDetailSerializer
        elif self.action == 'create':
            return PacienteCreateSerializer
        return PacienteSerializer
    
    @action(detail=False, methods=['get'])
    def ativos(self, request):
        """Retorna apenas pacientes ativos"""
        pacientes_ativos = self.queryset.filter(ativo=True)
        serializer = self.get_serializer(pacientes_ativos, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def desativar(self, request, pk=None):
        """Desativa um paciente"""
        paciente = self.get_object()
        paciente.ativo = False
        paciente.save()
        return Response({'status': 'Paciente desativado'})
    
    @action(detail=True, methods=['post'])
    def ativar(self, request, pk=None):
        """Ativa um paciente"""
        paciente = self.get_object()
        paciente.ativo = True
        paciente.save()
        return Response({'status': 'Paciente ativado'})
    
    @action(detail=True, methods=['get'])
    def prescricoes_ativas(self, request, pk=None):
        """Retorna prescrições ativas do paciente"""
        paciente = self.get_object()
        prescricoes = paciente.prescricoes.filter(status='ativo')
        serializer = PrescricaoMedicamentoSerializer(prescricoes, many=True)
        return Response(serializer.data)


class MedicamentoViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar medicamentos"""
    
    queryset = Medicamento.objects.all()
    serializer_class = MedicamentoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tipo', 'ativo', 'fabricante']
    search_fields = ['nome', 'principio_ativo', 'codigo_barras']
    ordering_fields = ['nome', 'principio_ativo', 'fabricante']
    ordering = ['nome']
    
    def get_serializer_class(self):
        """Retorna o serializer apropriado baseado na ação"""
        if self.action == 'create':
            return MedicamentoCreateSerializer
        return MedicamentoSerializer
    
    @action(detail=False, methods=['get'])
    def ativos(self, request):
        """Retorna apenas medicamentos ativos"""
        medicamentos_ativos = self.queryset.filter(ativo=True)
        serializer = self.get_serializer(medicamentos_ativos, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def por_tipo(self, request):
        """Retorna medicamentos agrupados por tipo"""
        tipos = {}
        for medicamento in self.queryset.filter(ativo=True):
            tipo = medicamento.get_tipo_display()
            if tipo not in tipos:
                tipos[tipo] = []
            tipos[tipo].append(MedicamentoSerializer(medicamento).data)
        return Response(tipos)


class PrescricaoMedicamentoViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar prescrições de medicamentos"""
    
    queryset = PrescricaoMedicamento.objects.all()
    serializer_class = PrescricaoMedicamentoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['paciente', 'medicamento', 'status', 'medico_responsavel']
    search_fields = ['paciente__nome_completo', 'medicamento__nome', 'medico_responsavel']
    ordering_fields = ['data_inicio', 'created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Retorna o serializer apropriado baseado na ação"""
        if self.action == 'retrieve':
            return PrescricaoDetailSerializer
        elif self.action == 'create':
            return PrescricaoCreateSerializer
        return PrescricaoMedicamentoSerializer
    
    @action(detail=False, methods=['get'])
    def ativas(self, request):
        """Retorna apenas prescrições ativas"""
        prescricoes_ativas = self.queryset.filter(status='ativo')
        serializer = self.get_serializer(prescricoes_ativas, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def por_paciente(self, request):
        """Retorna prescrições agrupadas por paciente"""
        paciente_id = request.query_params.get('paciente_id')
        if not paciente_id:
            return Response({'error': 'paciente_id é obrigatório'}, status=400)
        
        prescricoes = self.queryset.filter(paciente_id=paciente_id)
        serializer = self.get_serializer(prescricoes, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def suspender(self, request, pk=None):
        """Suspende uma prescrição"""
        prescricao = self.get_object()
        prescricao.status = 'suspenso'
        prescricao.save()
        return Response({'status': 'Prescrição suspensa'})
    
    @action(detail=True, methods=['post'])
    def finalizar(self, request, pk=None):
        """Finaliza uma prescrição"""
        prescricao = self.get_object()
        prescricao.status = 'finalizado'
        prescricao.data_fim = timezone.now().date()
        prescricao.save()
        return Response({'status': 'Prescrição finalizada'})
    
    @action(detail=True, methods=['post'])
    def reativar(self, request, pk=None):
        """Reativa uma prescrição"""
        prescricao = self.get_object()
        prescricao.status = 'ativo'
        prescricao.save()
        return Response({'status': 'Prescrição reativada'})
    
    @action(detail=False, methods=['get'])
    def agenda_hoje(self, request):
        """Retorna agenda de medicamentos para hoje"""
        hoje = timezone.now().date()
        prescricoes_ativas = self.queryset.filter(
            status='ativo',
            data_inicio__lte=hoje
        ).filter(
            models.Q(data_fim__isnull=True) | models.Q(data_fim__gte=hoje)
        )
        
        agenda = []
        for prescricao in prescricoes_ativas:
            if prescricao.horarios_administracao:
                for horario in prescricao.horarios_administracao:
                    agenda.append({
                        'prescricao_id': prescricao.id,
                        'paciente': prescricao.paciente.nome_completo,
                        'medicamento': prescricao.medicamento.nome,
                        'dosagem': prescricao.dosagem,
                        'horario': horario,
                        'administrado': False  # Verificar se já foi administrado
                    })
        
        # Ordenar por horário
        agenda.sort(key=lambda x: x['horario'])
        return Response(agenda)


class RegistroAdministracaoViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar registros de administração"""
    
    queryset = RegistroAdministracao.objects.all()
    serializer_class = RegistroAdministracaoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['prescricao', 'status', 'enfermeiro_responsavel']
    search_fields = ['prescricao__paciente__nome_completo', 'prescricao__medicamento__nome']
    ordering_fields = ['data_hora_prevista', 'data_hora_administracao']
    ordering = ['-data_hora_prevista']
    
    @action(detail=False, methods=['get'])
    def hoje(self, request):
        """Retorna registros de hoje"""
        hoje = timezone.now().date()
        registros_hoje = self.queryset.filter(
            data_hora_prevista__date=hoje
        )
        serializer = self.get_serializer(registros_hoje, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def pendentes(self, request):
        """Retorna registros pendentes de administração"""
        agora = timezone.now()
        registros_pendentes = self.queryset.filter(
            data_hora_prevista__lte=agora,
            status='administrado',
            data_hora_administracao__isnull=True
        )
        serializer = self.get_serializer(registros_pendentes, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def marcar_administrado(self, request, pk=None):
        """Marca um registro como administrado"""
        registro = self.get_object()
        registro.status = 'administrado'
        registro.data_hora_administracao = timezone.now()
        registro.enfermeiro_responsavel = request.data.get('enfermeiro_responsavel', '')
        registro.observacoes = request.data.get('observacoes', '')
        registro.save()
        return Response({'status': 'Medicamento marcado como administrado'})
    
    @action(detail=True, methods=['post'])
    def marcar_nao_administrado(self, request, pk=None):
        """Marca um registro como não administrado"""
        registro = self.get_object()
        registro.status = 'nao_administrado'
        registro.enfermeiro_responsavel = request.data.get('enfermeiro_responsavel', '')
        registro.observacoes = request.data.get('observacoes', '')
        registro.save()
        return Response({'status': 'Medicamento marcado como não administrado'})
    
    @action(detail=True, methods=['post'])
    def marcar_recusado(self, request, pk=None):
        """Marca um registro como recusado pelo paciente"""
        registro = self.get_object()
        registro.status = 'recusado'
        registro.enfermeiro_responsavel = request.data.get('enfermeiro_responsavel', '')
        registro.observacoes = request.data.get('observacoes', '')
        registro.save()
        return Response({'status': 'Medicamento marcado como recusado pelo paciente'})
    