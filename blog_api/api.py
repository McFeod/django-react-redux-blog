import json
import locale

from django.forms import model_to_dict
from django.http import HttpResponse
from django.utils.timezone import localtime
from django.views import View
from registration.forms import User

from blog.models import Comment, Article


class CommentApi(View):
    """
    Poor replacement for Tastypie resource
    """
    possible_filters = ['level__gte', 'level__gt', 'level__lte', 'level__lt',
                        'max_unfold_comment', 'article']

    def get(self, request, *args, **kwargs):
        query = Comment.objects
        filters = {key: value for key, value in request.GET.items()
                   if key in self.possible_filters}
        return HttpResponse(self.serialize(query.filter(**filters)))

    def post(self, request, *args, **kwargs):
        data = json.loads(request.body.decode('utf-8'))
        if 'parent_comment' in data and data['parent_comment'] is not None:
            data['parent_comment'] = Comment.objects.get(id=data['parent_comment'])
        data['article'] = Article.objects.get(id=data['article'])
        data['author'] = request.user
        comment = Comment(**data)
        comment.save()
        return HttpResponse(json.dumps(self.get_comment_data(comment), ensure_ascii=False))

    def serialize(self, queryset):
        return json.dumps({
            'objects': list(map(self.get_comment_data, queryset.select_related('author')))
        }, ensure_ascii=False)

    def get_comment_data(self, item):
        data = model_to_dict(item)
        data['author'] = {'username': item.author.username}  # doesn't hit the database (we used select_related before)
        data['created_at'] = self.format_datetime(data['created_at'])
        return data

    def format_datetime(self, data):
        locale.setlocale(locale.LC_ALL, 'ru_RU.UTF-8')
        return localtime(data).strftime('%c')
