from django.contrib import admin
from django.urls import path, include

# --- Список URL-маршрутов проекта ---
# `urlpatterns` - это основной список URL-маршрутов для всего Django-проекта.
# Django будет проверять запрошенные URL по этим шаблонам по порядку.
urlpatterns = [
    # Маршрут для административного интерфейса Django.
    # По умолчанию доступен по адресу /admin/.
    path('admin/', admin.site.urls),

    # Маршрут для API, связанного с приложением `algorithms`.
    # Все URL-адреса, начинающиеся с \'api/\', будут переданы для дальнейшей обработки
    # в файл `urls.py` приложения `algorithms` (т.е., `algorithms.urls`).
    # Пространство имен \'algorithms\' (определенное в `algorithms/urls.py`)
    # будет использоваться для этих вложенных URL.
    path('api/', include('algorithms.urls')),
]