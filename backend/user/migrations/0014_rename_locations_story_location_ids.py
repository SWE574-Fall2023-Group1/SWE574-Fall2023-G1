# Generated by Django 4.1.7 on 2023-04-15 18:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0013_remove_story_location_id_story_locations'),
    ]

    operations = [
        migrations.RenameField(
            model_name='story',
            old_name='locations',
            new_name='location_ids',
        ),
    ]