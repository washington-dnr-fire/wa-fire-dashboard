from django.urls import path
from . import views
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.index, name='index'),
    path('home', views.index, name='home'),
    path('profile', views.profile, name='profile'),
    path('egp_data/<str:layer_type>/<int:layer_id>', views.egp_data, name="egp_data"),
    path('aviation', views.aviation, name='aviation'),
    # disable service worker until figured out
    path('serv-worker.js', (TemplateView.as_view(template_name="serv-worker.js", content_type='application/javascript', )), name='serv-worker.js'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)