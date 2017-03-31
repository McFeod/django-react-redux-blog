from django.db import models

from django.conf import settings


class Article(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name='автор')
    text = models.TextField(verbose_name='текст статьи')
    header = models.TextField(verbose_name='название статьи')

    def __str__(self):
        return '{}: {}'.format(self.author.get_full_name(), self.header[:50])

    class Meta:
        verbose_name = 'статья'
        verbose_name_plural = 'статьи'


class Comment(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name='автор')
    article = models.ForeignKey(Article, verbose_name='статья')
    parent_comment = models.ForeignKey(
        'self', verbose_name='начальный комментарий', null=True, blank=True,
        related_name='children')
    text = models.TextField(verbose_name='текст комментария')
    max_unfold_comment = models.ForeignKey(
        'self', related_name='thread_comments', null=True, blank=True,
        verbose_name='последний полгружаемый по умолчанию комментарий в треде')
    level = models.IntegerField(verbose_name='уровень вложенности', null=True, blank=True)

    def __str__(self):
        return '{}: {}'.format(self.author.get_full_name(), self.text[:50])

    class Meta:
        verbose_name = 'комментарий'
        verbose_name_plural = 'комментарии'

    def save_level(self):
        if self.level is None:
            self.level = self.parent_comment.level + 1 if self.parent_comment else 1
            self.save()

    def save_unfold_comment(self):
        if self.max_unfold_comment is None:
            self.max_unfold_comment = self.parent_comment.max_unfold_comment \
                if self.level > settings.BLOG_FOLD_LEVEL else self
            self.save()

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        self.save_level()
        super().save(force_insert, force_update, using, update_fields)
        self.save_unfold_comment()

