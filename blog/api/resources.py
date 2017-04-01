from django.contrib.auth.models import User
from tastypie.authentication import SessionAuthentication
from tastypie.constants import ALL_WITH_RELATIONS
from tastypie.fields import ToOneField

from blog.api.custom_model_resource import CustomModelResource
from blog.models import Article, Comment


class UserResource(CustomModelResource):
    class Meta:
        resource_name = 'users'
        queryset = User.objects.all()
        fields = ['username', 'first_name', 'last_name', 'id']


class ArticleResource(CustomModelResource):
    author = ToOneField(UserResource, attribute='author', full=True)

    def dehydrate(self, bundle):
        bundle.data['comment_count'] = bundle.obj.comment_set.count()
        return bundle

    class Meta:
        resource_name = 'articles'
        queryset = Article.objects.all()


class CommentResource(CustomModelResource):
    author = ToOneField(UserResource, attribute='author', full=True)

    def dehydrate(self, bundle):
        bundle.data['parent_comment'] = bundle.obj.parent_comment.id if bundle.obj.parent_comment else None
        bundle.data['max_unfold_comment'] = bundle.obj.max_unfold_comment.id
        bundle.data['has_children'] = bundle.obj.children.exists()
        return bundle

    class Meta:
        resource_name = 'comments'
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get']
        authentication = SessionAuthentication()
        queryset = Comment.objects.all()
        filtering = {
            'parent_comment':  ALL_WITH_RELATIONS,
            'level': ALL_WITH_RELATIONS,
            'max_unfold_comment': ALL_WITH_RELATIONS
        }
