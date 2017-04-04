from django.db import models

from django.conf import settings
from django.utils import timezone


class BlogItem(models.Model):
    """
    Base class for articles and comments
    """
    author = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name='автор')
    created_at = models.DateTimeField(default=timezone.now, verbose_name='время создания')
    content = models.TextField(verbose_name='текст')

    class Meta:
        abstract = True


class Article(BlogItem):
    header = models.TextField(verbose_name='название статьи')

    def __str__(self):
        return '{}: {}'.format(
            self.author.get_full_name() or self.author.username, self.header[:50])

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'статья'
        verbose_name_plural = 'статьи'


class Comment(BlogItem):
    article = models.ForeignKey(Article, verbose_name='статья')
    parent_comment = models.ForeignKey(
        'self', verbose_name='начальный комментарий', null=True, blank=True,
        related_name='children')

    # fields for quick search
    max_unfold_comment = models.ForeignKey(
        'self', related_name='thread_comments', null=True, blank=True,
        verbose_name='последний полгружаемый по умолчанию комментарий в треде')
    level = models.IntegerField(verbose_name='уровень вложенности', null=True, blank=True)

    def __str__(self):
        return '{}: {}'.format(
            self.author.get_full_name() or self.author.username, self.content[:50])

    class Meta:
        verbose_name = 'комментарий'
        verbose_name_plural = 'комментарии'

    def save_level(self):
        """
        Calculates and saves nesting level of comment
        """
        if self.level is None:
            self.level = self.parent_comment.level + 1 if self.parent_comment else 1
            self.save()

    def save_unfold_comment(self):
        """
        Calculates and saves id of latest comment in current comment thread, 
        which is unfold by default
        """
        if self.max_unfold_comment is None:
            self.max_unfold_comment = self.parent_comment.max_unfold_comment \
                if self.level > settings.BLOG_FOLD_LEVEL else self
            self.save()

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        self.save_level()
        super().save(force_insert, force_update, using, update_fields)
        self.save_unfold_comment()

