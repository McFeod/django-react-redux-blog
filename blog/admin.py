from django.contrib import admin

from blog.models import Comment, Article

admin.site.register(Article)
admin.site.register(Comment)
