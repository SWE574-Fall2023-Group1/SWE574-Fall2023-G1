# Generated by Django 4.1.7 on 2023-05-25 19:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0027_story_include_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='story',
            name='decade',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='story',
            name='date_type',
            field=models.CharField(choices=[('year_interval', 'Year Interval'), ('year', 'year'), ('normal_date', 'Normal Date'), ('interval_date', 'Interval Date'), ('decade', 'Decade')], default='normal_date', max_length=20),
        ),
    ]
