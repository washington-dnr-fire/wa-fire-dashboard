from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('home', views.index, name='home'),
    path('profile', views.profile, name='profile'),
    path('egp_data/<int:layer_id>', views.egp_data, name="egp_data"),
]