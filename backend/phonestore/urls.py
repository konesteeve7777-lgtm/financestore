from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    dashboard,
    login,
    register,
    report,              # ✅ AJOUTÉ
    TransactionViewSet,
    DebtViewSet
)

router = DefaultRouter()
router.register(r'transactions', TransactionViewSet)
router.register(r'debts', DebtViewSet)

urlpatterns = [
    # 🔹 API principale
    path('', include(router.urls)),

    # 🔹 Dashboard
    path('dashboard/', dashboard),

    # 🆕 Rapport
    path('report/', report),

    # 🔐 Auth
    path('login/', login),
    path('register/', register),
]