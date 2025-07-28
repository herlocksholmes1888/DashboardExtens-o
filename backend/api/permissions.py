from rest_framework.permissions import BasePermission

class IsEnfermeiro(BasePermission):
    """
    Permissão customizada para permitir acesso apenas a usuários 
    no grupo 'Enfermeiros'.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        return request.user.groups.filter(name='Enfermeiros').exists()