from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from datetime import datetime
from django.utils import timezone
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from .models import Transaction, Debt
from .serializers import TransactionSerializer, DebtSerializer


# 🔹 HOME (AJOUT IMPORTANT POUR "/")
@api_view(['GET'])
@permission_classes([AllowAny])
def home(request):
    return Response({
        "message": "API Django fonctionne 🚀",
        "routes": {
            "admin": "/admin/",
            "api": "/api/",
            "login": "/login/",
            "register": "/register/"
        }
    })


# 🔹 CRUD Transactions (sécurisé)
class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]


# 🔹 CRUD Dettes (sécurisé)
class DebtViewSet(viewsets.ModelViewSet):
    queryset = Debt.objects.all()
    serializer_class = DebtSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]


# 🔹 RAPPORT
@api_view(['GET'])
@permission_classes([IsAuthenticated])   # Protégé par token
def report(request):
    start = request.GET.get('start')
    end = request.GET.get('end')

    transactions = Transaction.objects.all()

    if start and end:
        transactions = transactions.filter(date__range=[start, end])

    income = sum(t.amount for t in transactions if t.type == 'income')
    expense = sum(t.amount for t in transactions if t.type == 'expense')

    return Response({
        "income": income,
        "expense": expense,
        "balance": income - expense
    })


# 🔹 Dashboard
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    transactions = Transaction.objects.all()

    total_income = sum(t.amount for t in transactions if t.type == 'income')
    total_expense = sum(t.amount for t in transactions if t.type == 'expense')
    balance = total_income - total_expense

    alerts = []
    if total_expense > total_income:
        alerts.append("⚠️ Dépenses supérieures aux revenus")
    if balance < 0:
        alerts.append("🚨 Trésorerie négative !")

    today = timezone.now().date()
    daily_transactions = transactions.filter(date__date=today)
    daily_income = sum(t.amount for t in daily_transactions if t.type == 'income')
    daily_expense = sum(t.amount for t in daily_transactions if t.type == 'expense')
    daily_balance = daily_income - daily_expense

    now = timezone.now()
    monthly_transactions = transactions.filter(date__gte=now.replace(day=1), date__lte=now)
    monthly_income = sum(t.amount for t in monthly_transactions if t.type == 'income')
    monthly_expense = sum(t.amount for t in monthly_transactions if t.type == 'expense')
    monthly_balance = monthly_income - monthly_expense

    debts = Debt.objects.all()
    total_debt = sum(d.amount for d in debts if not d.paid)

    return Response({
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance,
        "daily_income": daily_income,
        "daily_expense": daily_expense,
        "daily_balance": daily_balance,
        "monthly_income": monthly_income,
        "monthly_expense": monthly_expense,
        "monthly_balance": monthly_balance,
        "total_debt": total_debt,
        "alerts": alerts
    })


# 🔹 LOGIN
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({"error": "Champs requis"}, status=400)

    user = authenticate(username=username, password=password)
    if user is not None:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key})
    else:
        return Response({"error": "Identifiants invalides"}, status=400)


# 🔹 REGISTER
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({"error": "Champs requis"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Utilisateur existe déjà"}, status=400)

    user = User.objects.create_user(username=username, password=password)
    token = Token.objects.create(user=user)
    return Response({"token": token.key})