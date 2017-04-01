from django.conf.urls import url
from .views import BlogIndex, BlogEntry

urlpatterns = [
    url(r'^$', BlogIndex.as_view(), name='index'),
    url(r'^article/(?P<id>\d+)/$', BlogEntry.as_view(), name='article'),
]