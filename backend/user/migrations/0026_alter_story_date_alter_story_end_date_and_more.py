# Generated by Django 4.1.7 on 2023-05-16 16:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0025_delete_content_remove_story_stories_photo_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='story',
            name='date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='story',
            name='end_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='story',
            name='start_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
