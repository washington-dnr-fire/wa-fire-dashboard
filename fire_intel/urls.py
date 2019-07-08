from django.urls import path
from . import views
from django.views.generic import TemplateView

urlpatterns = [
    path('', views.index, name='index'),
    path('home', views.index, name='home'),
    path('profile', views.profile, name='profile'),
    path('egp_data/<str:layer_type>/<int:layer_id>', views.egp_data, name="egp_data"),
    path('serv-worker.js', (TemplateView.as_view(template_name="serv-worker.js", content_type='application/javascript', )), name='serv-worker.js'),
]