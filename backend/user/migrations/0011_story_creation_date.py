# Generated by Django 4.1.7 on 2023-04-15 16:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0010_user_biography_user_followers'),
    ]

    operations = [
        migrations.AddField(
            model_name='story',
            name='creation_date',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]
