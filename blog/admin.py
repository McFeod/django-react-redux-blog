from django.contrib import admin
from django.contrib.admin import ModelAdmin

from blog.models import Comment, Article

admin.site.register(Article)


@admin.register(Comment)
class CommentAdmin(ModelAdmin):
    exclude = ['level', 'max_unfold_comment', 'has_children']
