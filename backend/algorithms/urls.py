from django.urls import path
from . import views

app_name = 'algorithms'

urlpatterns = [
    path('', views.api_info, name='api-info'),
    path('ford-fulkerson/', views.ford_fulkerson_view, name='ford-fulkerson'),
    path('lcis/', views.lcis_view, name='lcis'),
    path('malgrange_scc/', views.malgrange_scc_view, name='malgrange-scc'),
]