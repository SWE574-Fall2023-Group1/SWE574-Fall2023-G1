FROM python:3.11

WORKDIR /backend

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY manage.py .

COPY backend/ ./backend

COPY user/ ./user

COPY profile_photos/ ./profile_photos

EXPOSE 8000



CMD python manage.py migrate && python manage.py runserver 0.0.0.0:8000
