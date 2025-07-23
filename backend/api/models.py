from django.db import models
from django.contrib.auth.models import User

# This is the equivalent of saying 
# class Medicine extends Model
class Medicine(models.Model):
    # This makes it so that the data about the medicine is directly related to a patient
    # If the patient is deleted, so is the medicine related to him
    nurse = models.ForeignKey(User, related_name='meds')
    patient = models.CharField(max_length=100)
    medicine = models.CharField(max_length=50)
    dosage = models.CharField(max_length=5)
    time = models.TimeField()

def __str__(self):
    return f"{self.medicine} for {self.patient.username} at {self.time.strftime('%H:%M')}"