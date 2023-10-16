from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_str
from django.contrib.auth.tokens import default_token_generator

# ...

def send_password_reset_email(user):
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_str(user.pk))

    email_subject = "Password Reset Requested"
    email_body = (
        f"To reset your password, click the link below:\n\n"
        f"http://localhost:3000/reset-password/{token}/{uid}\n"
    )

    send_mail(
        email_subject,
        email_body,
        "noreply@yourdomain.com",
        [user.email],
    )
