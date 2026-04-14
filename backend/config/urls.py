from django.contrib import admin
from django.urls import path, include
from phonestore.views import home

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',home),

    # 🔥 UNE SEULE entrée API
    path('api/', include('phonestore.urls')),
]