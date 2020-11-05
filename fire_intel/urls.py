from django.urls import path
from . import views
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.season_end, name='index'),
    path('home', views.index, name='home'),
    path('profile', views.profile, name='profile'),
    path('egp_data/<str:layer_type>/<int:layer_id>', views.egp_data, name="egp_data"),
    path('current_fire_stats', views.current_fire_stats, name="current_fire_stats"),
    path('unsupported-browser', views.unsupported_ie, name='unsupported-browser'),
    path('region/<str:region>', views.region_view, name='region_view'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)