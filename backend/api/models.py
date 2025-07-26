from django.db import models
from django.core.validators import RegexValidator
from django.utils import timezone

class Paciente(models.Model):
    """Modelo para representar um paciente do asilo"""
    
    SEXO_CHOICES = [
        ('M', 'Masculino'),
        ('F', 'Feminino'),
        ('O', 'Outro'),
    ]
    
    nome_completo = models.CharField(
        max_length=200,
        verbose_name="Nome Completo",
        help_text="Nome completo do paciente"
    )
    
    cpf = models.CharField(
        max_length=14,
        unique=True,
        validators=[RegexValidator(
            regex=r'^\d{3}\.\d{3}\.\d{3}-\d{2}$',
            message='CPF deve estar no formato XXX.XXX.XXX-XX'
        )],
        verbose_name="CPF",
        help_text="CPF no formato XXX.XXX.XXX-XX"
    )
    
    data_nascimento = models.DateField(
        verbose_name="Data de Nascimento",
        help_text="Data de nascimento do paciente"
    )
    
    sexo = models.CharField(
        max_length=1,
        choices=SEXO_CHOICES,
        verbose_name="Sexo"
    )
    
    telefone_contato = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name="Telefone de Contato",
        help_text="Telefone para contato de emergência"
    )
    
    endereco = models.TextField(
        blank=True,
        null=True,
        verbose_name="Endereço",
        help_text="Endereço completo do paciente ou responsável"
    )
    
    observacoes_medicas = models.TextField(
        blank=True,
        null=True,
        verbose_name="Observações Médicas",
        help_text="Observações importantes sobre o estado de saúde do paciente"
    )
    
    data_admissao = models.DateTimeField(
        default=timezone.now,
        verbose_name="Data de Admissão",
        help_text="Data e hora de admissão no asilo"
    )
    
    ativo = models.BooleanField(
        default=True,
        verbose_name="Ativo",
        help_text="Indica se o paciente ainda está no asilo"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Paciente"
        verbose_name_plural = "Pacientes"
        ordering = ['nome_completo']
    
    def __str__(self):
        return f"{self.nome_completo} - CPF: {self.cpf}"
    
    @property
    def idade(self):
        """Calcula a idade do paciente"""
        from datetime import date
        today = date.today()
        return today.year - self.data_nascimento.year - (
            (today.month, today.day) < (self.data_nascimento.month, self.data_nascimento.day)
        )


class Medicamento(models.Model):
    """Modelo para representar um medicamento"""
    
    TIPO_CHOICES = [
        ('comprimido', 'Comprimido'),
        ('capsula', 'Cápsula'),
        ('liquido', 'Líquido'),
        ('injecao', 'Injeção'),
        ('pomada', 'Pomada'),
        ('gotas', 'Gotas'),
        ('spray', 'Spray'),
        ('outro', 'Outro'),
    ]
    
    nome = models.CharField(
        max_length=200,
        verbose_name="Nome do Medicamento",
        help_text="Nome comercial ou genérico do medicamento"
    )
    
    principio_ativo = models.CharField(
        max_length=200,
        verbose_name="Princípio Ativo",
        help_text="Substância ativa do medicamento"
    )
    
    concentracao = models.CharField(
        max_length=100,
        verbose_name="Concentração",
        help_text="Concentração do medicamento (ex: 500mg, 10ml)"
    )
    
    tipo = models.CharField(
        max_length=20,
        choices=TIPO_CHOICES,
        verbose_name="Tipo",
        help_text="Forma farmacêutica do medicamento"
    )
    
    fabricante = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        verbose_name="Fabricante",
        help_text="Laboratório fabricante do medicamento"
    )
    
    descricao = models.TextField(
        blank=True,
        null=True,
        verbose_name="Descrição",
        help_text="Descrição adicional do medicamento"
    )
    
    ativo = models.BooleanField(
        default=True,
        verbose_name="Ativo",
        help_text="Indica se o medicamento está disponível para prescrição"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Medicamento"
        verbose_name_plural = "Medicamentos"
        ordering = ['nome']
    
    def __str__(self):
        return f"{self.nome} - {self.concentracao}"


class PrescricaoMedicamento(models.Model):
    """Modelo para representar a prescrição de medicamentos para pacientes"""
    
    STATUS_CHOICES = [
        ('ativo', 'Ativo'),
        ('suspenso', 'Suspenso'),
        ('finalizado', 'Finalizado'),
    ]
    
    FREQUENCIA_CHOICES = [
        ('1x_dia', '1x ao dia'),
        ('2x_dia', '2x ao dia'),
        ('3x_dia', '3x ao dia'),
        ('4x_dia', '4x ao dia'),
        ('6x_dia', '6x ao dia'),
        ('8x_dia', '8x ao dia'),
        ('12h', 'A cada 12 horas'),
        ('8h', 'A cada 8 horas'),
        ('6h', 'A cada 6 horas'),
        ('4h', 'A cada 4 horas'),
        ('sos', 'Se necessário (SOS)'),
        ('personalizada', 'Frequência personalizada'),
    ]
    
    paciente = models.ForeignKey(
        Paciente,
        on_delete=models.CASCADE,
        related_name='prescricoes',
        verbose_name="Paciente"
    )
    
    medicamento = models.ForeignKey(
        Medicamento,
        on_delete=models.CASCADE,
        related_name='prescricoes',
        verbose_name="Medicamento"
    )
    
    dosagem = models.CharField(
        max_length=100,
        verbose_name="Dosagem",
        help_text="Dosagem prescrita (ex: 1 comprimido, 5ml)"
    )
    
    frequencia = models.CharField(
        max_length=20,
        choices=FREQUENCIA_CHOICES,
        verbose_name="Frequência",
        help_text="Frequência de administração"
    )
    
    frequencia_personalizada = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        verbose_name="Frequência Personalizada",
        help_text="Descrição da frequência quando selecionada 'personalizada'"
    )
    
    horarios_administracao = models.JSONField(
        blank=True,
        null=True,
        verbose_name="Horários de Administração",
        help_text="Lista de horários para administração (formato JSON)"
    )
    
    data_inicio = models.DateField(
        verbose_name="Data de Início",
        help_text="Data de início do tratamento"
    )
    
    data_fim = models.DateField(
        blank=True,
        null=True,
        verbose_name="Data de Fim",
        help_text="Data de fim do tratamento (se aplicável)"
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='ativo',
        verbose_name="Status"
    )
    
    observacoes = models.TextField(
        blank=True,
        null=True,
        verbose_name="Observações",
        help_text="Observações sobre a prescrição"
    )
    
    medico_responsavel = models.CharField(
        max_length=200,
        verbose_name="Médico Responsável",
        help_text="Nome do médico que prescreveu o medicamento"
    )
    
    enfermeiro_cadastro = models.CharField(
        max_length=200,
        verbose_name="Enfermeiro Responsável",
        help_text="Nome do enfermeiro que cadastrou a prescrição"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Prescrição de Medicamento"
        verbose_name_plural = "Prescrições de Medicamentos"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.paciente.nome_completo} - {self.medicamento.nome} ({self.dosagem})"
    
    @property
    def tratamento_ativo(self):
        """Verifica se o tratamento ainda está ativo"""
        if self.status != 'ativo':
            return False
        if self.data_fim and self.data_fim < timezone.now().date():
            return False
        return True


class RegistroAdministracao(models.Model):
    """Modelo para registrar a administração de medicamentos"""
    
    STATUS_CHOICES = [
        ('administrado', 'Administrado'),
        ('nao_administrado', 'Não Administrado'),
        ('recusado', 'Recusado pelo Paciente'),
    ]
    
    prescricao = models.ForeignKey(
        PrescricaoMedicamento,
        on_delete=models.CASCADE,
        related_name='registros_administracao',
        verbose_name="Prescrição"
    )
    
    data_hora_prevista = models.DateTimeField(
        verbose_name="Data/Hora Prevista",
        help_text="Data e hora prevista para administração"
    )
    
    data_hora_administracao = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name="Data/Hora de Administração",
        help_text="Data e hora real da administração"
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='administrado',
        verbose_name="Status"
    )
    
    observacoes = models.TextField(
        blank=True,
        null=True,
        verbose_name="Observações",
        help_text="Observações sobre a administração"
    )
    
    enfermeiro_responsavel = models.CharField(
        max_length=200,
        verbose_name="Enfermeiro Responsável",
        help_text="Nome do enfermeiro que administrou o medicamento"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Registro de Administração"
        verbose_name_plural = "Registros de Administração"
        ordering = ['-data_hora_prevista']
    
    def __str__(self):
        return f"{self.prescricao} - {self.data_hora_prevista.strftime('%d/%m/%Y %H:%M')}"