from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Paciente, Medicamento, PrescricaoMedicamento, RegistroAdministracao

# Register e Login
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


class PacienteSerializer(serializers.ModelSerializer):
    """Serializer para o modelo Paciente"""
    
    idade = serializers.ReadOnlyField()
    
    class Meta:
        model = Paciente
        fields = [
            'id', 'nome_completo', 'cpf', 'data_nascimento', 'sexo',
            'telefone_contato', 'endereco', 'observacoes_medicas',
            'data_admissao', 'ativo', 'idade', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def validate_cpf(self, value):
        """Validação personalizada para CPF"""
        import re
        if not re.match(r'^\d{3}\.\d{3}\.\d{3}-\d{2}$', value):
            raise serializers.ValidationError(
                "CPF deve estar no formato XXX.XXX.XXX-XX"
            )
        return value


class MedicamentoSerializer(serializers.ModelSerializer):
    """Serializer para o modelo Medicamento"""
    
    class Meta:
        model = Medicamento
        fields = [
            'id', 'nome', 'principio_ativo', 'concentracao', 'tipo',
            'fabricante', 'descricao', 'ativo',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class PrescricaoMedicamentoSerializer(serializers.ModelSerializer):
    """Serializer para o modelo PrescricaoMedicamento"""
    
    paciente_nome = serializers.CharField(source='paciente.nome_completo', read_only=True)
    medicamento_nome = serializers.CharField(source='medicamento.nome', read_only=True)
    medicamento_concentracao = serializers.CharField(source='medicamento.concentracao', read_only=True)
    tratamento_ativo = serializers.ReadOnlyField()
    
    class Meta:
        model = PrescricaoMedicamento
        fields = [
            'id', 'paciente', 'paciente_nome', 'medicamento', 'medicamento_nome',
            'medicamento_concentracao', 'dosagem', 'frequencia', 'frequencia_personalizada',
            'horarios_administracao', 'data_inicio', 'data_fim', 'status',
            'observacoes', 'medico_responsavel', 'enfermeiro_cadastro',
            'tratamento_ativo', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def validate(self, data):
        """Validações personalizadas"""
        if data.get('frequencia') == 'personalizada' and not data.get('frequencia_personalizada'):
            raise serializers.ValidationError(
                "Frequência personalizada deve ser informada quando selecionada."
            )
        
        if data.get('data_fim') and data.get('data_inicio'):
            if data['data_fim'] < data['data_inicio']:
                raise serializers.ValidationError(
                    "Data de fim não pode ser anterior à data de início."
                )
        
        return data


class RegistroAdministracaoSerializer(serializers.ModelSerializer):
    """Serializer para o modelo RegistroAdministracao"""
    
    paciente_nome = serializers.CharField(source='prescricao.paciente.nome_completo', read_only=True)
    medicamento_nome = serializers.CharField(source='prescricao.medicamento.nome', read_only=True)
    dosagem = serializers.CharField(source='prescricao.dosagem', read_only=True)
    
    class Meta:
        model = RegistroAdministracao
        fields = [
            'id', 'prescricao', 'paciente_nome', 'medicamento_nome', 'dosagem',
            'data_hora_prevista', 'data_hora_administracao', 'status',
            'observacoes', 'enfermeiro_responsavel', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class PacienteDetailSerializer(PacienteSerializer):
    """Serializer detalhado para Paciente com prescrições"""
    
    prescricoes = PrescricaoMedicamentoSerializer(many=True, read_only=True)
    
    class Meta(PacienteSerializer.Meta):
        fields = PacienteSerializer.Meta.fields + ['prescricoes']


class PrescricaoDetailSerializer(PrescricaoMedicamentoSerializer):
    """Serializer detalhado para Prescrição com registros de administração"""
    
    registros_administracao = RegistroAdministracaoSerializer(many=True, read_only=True)
    
    class Meta(PrescricaoMedicamentoSerializer.Meta):
        fields = PrescricaoMedicamentoSerializer.Meta.fields + ['registros_administracao']


# Serializers para criação simplificada
class PacienteCreateSerializer(serializers.ModelSerializer):
    """Serializer simplificado para criação de pacientes"""
    
    class Meta:
        model = Paciente
        fields = [
            'nome_completo', 'cpf', 'data_nascimento', 'sexo',
            'telefone_contato', 'endereco', 'observacoes_medicas'
        ]


class MedicamentoCreateSerializer(serializers.ModelSerializer):
    """Serializer simplificado para criação de medicamentos"""
    
    class Meta:
        model = Medicamento
        fields = [
            'nome', 'principio_ativo', 'concentracao', 'tipo',
            'fabricante', 'descricao'
        ]


class PrescricaoCreateSerializer(serializers.ModelSerializer):
    """Serializer simplificado para criação de prescrições"""
    
    class Meta:
        model = PrescricaoMedicamento
        fields = [
            'paciente', 'medicamento', 'dosagem', 'frequencia',
            'frequencia_personalizada', 'horarios_administracao',
            'data_inicio', 'data_fim', 'observacoes',
            'medico_responsavel', 'enfermeiro_cadastro'
        ]

