from django.urls import path
from . import views

# `app_name` определяет пространство имен для URL-маршрутов этого приложения.
# Это позволяет избегать конфликтов имен URL-ов с другими приложениями в проекте
# и использовать, например, `reverse('algorithms:api-info')`.
app_name = 'algorithms'

# `urlpatterns` - это список URL-маршрутов, обрабатываемых этим приложением.
# Каждый элемент списка создается функцией `path()`.
urlpatterns = [
    # Маршрут для корневого URL API этого приложения (например, /api/algorithms/).
    # Он сопоставляется с функцией `views.api_info`.
    # `name='api-info'` задает имя этому маршруту, которое можно использовать для его реверсирования.
    path('', views.api_info, name='api-info'),

    # Маршрут для эндпоинта алгоритма Форда-Фалкерсона (например, /api/algorithms/ford-fulkerson/).
    # Сопоставляется с функцией `views.ford_fulkerson_view`.
    path('ford-fulkerson/', views.ford_fulkerson_view, name='ford-fulkerson'),

    # Маршрут для эндпоинта алгоритма LCIS (например, /api/algorithms/lcis/).
    # Сопоставляется с функцией `views.lcis_view`.
    path('lcis/', views.lcis_view, name='lcis'),

    # Маршрут для эндпоинта алгоритма Мальгранжа (SCC) (например, /api/algorithms/malgrange_scc/).
    # Сопоставляется с функцией `views.malgrange_scc_view`.
    path('malgrange_scc/', views.malgrange_scc_view, name='malgrange-scc'),
]