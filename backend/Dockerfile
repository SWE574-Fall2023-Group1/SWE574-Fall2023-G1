FROM python:3.11-slim-buster

LABEL maintainer="SWE 574 - Fall 2023 - Group 1"

ENV PYTHONUNBUFFERED=1

WORKDIR /backend

COPY requirements.txt .

RUN : \
    && apt-get update -y \
    && export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -y --no-install-recommends \
        binutils libproj-dev gdal-bin \
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/* \
    && pip install --no-cache-dir -r requirements.txt \
    && :

COPY manage.py .

COPY backend/ ./backend

COPY user/ ./user

EXPOSE 8000



CMD python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8000
