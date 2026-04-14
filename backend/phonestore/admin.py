from django.contrib import admin
from .models import Transaction, Debt

admin.site.register(Transaction)
admin.site.register(Debt)

# Register your models here.
