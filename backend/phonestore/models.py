from django.db import models
from django.utils import timezone

# 🔹 Catégories
CATEGORY_CHOICES = [
    ('phone_sale', 'Vente téléphone'),
    ('accessory', 'Accessoire'),
    ('repair', 'Réparation'),
    ('other', 'Autre'),
]

TYPE_CHOICES = [
    ('income', 'Income'),
    ('expense', 'Expense'),
]


class Transaction(models.Model):
    amount = models.FloatField()
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    description = models.CharField(max_length=255, null=True, blank=True)
    date = models.DateTimeField(default=timezone.now)   # ✅ modifié

    def __str__(self):
        return f"{self.type} - {self.amount}"


class Debt(models.Model):
    name = models.CharField(max_length=100)
    amount = models.FloatField()
    date = models.DateTimeField(default=timezone.now)   # ✅ modifié
    paid = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} - {self.amount}"