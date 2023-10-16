from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from user.models import User


class Command(BaseCommand):
    help = 'Hashes the passwords of all existing users in the database'

    def handle(self, *args, **options):
        users = User.objects.all()
        for user in users:
            if not user.password.startswith('pbkdf2_sha256$'):  # Check if the password is already hashed
                user.password = make_password(user.password)
                user.save()
                self.stdout.write(self.style.SUCCESS(f'Successfully hashed password for user: {user.username}'))
            else:
                self.stdout.write(self.style.WARNING(f'Password for user {user.username} is already hashed.'))
