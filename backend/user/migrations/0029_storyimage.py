from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('user', '0028_story_decade_alter_story_date_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='StoryImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='story_images/')),
            ],
        ),
    ]
