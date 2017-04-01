from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.auth.views import login, logout

from blog.api import get_api_urls

urlpatterns = [
    url(r'^admin/', admin.site.urls, name='admin'),
    url(r'^api/', include(get_api_urls())),
    url(r'^accounts/login/$', login, name='login'),
    url(r'^accounts/logout/$', logout, name='logout'),
    url(r'^', include('blog.urls', namespace='blog'))
]
