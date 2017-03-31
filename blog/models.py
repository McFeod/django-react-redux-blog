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
    parent_comment = models.ForeignKey('self', verbose_name='начальный комментарий', null=True, blank=True)
    text = models.TextField(verbose_name='текст комментария')

    def __str__(self):
        return '{}: {}'.format(self.author.get_full_name(), self.text[:50])

    class Meta:
        verbose_name = 'комментарий'
        verbose_name_plural = 'комментарии'
