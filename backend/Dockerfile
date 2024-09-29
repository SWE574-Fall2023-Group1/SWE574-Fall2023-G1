FROM python:3.12-bookworm

LABEL maintainer="SWE 574 - Fall 2023 - Group 1"

ENV PYTHONUNBUFFERED=1

WORKDIR /backend

COPY requirements.txt .

RUN : \
    && apt-get update -qqqy \
    && export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -qqqy --no-install-recommends \
        binutils libproj-dev gdal-bin \
        gcc g++ \
        > /dev/null \
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/* \
    && python -m pip install --no-cache-dir -qU pip \
    && pip install --no-cache-dir -q setuptools==75.1.0 \
    && pip install --no-cache-dir -qr requirements.txt \
    && python -m nltk.downloader punkt averaged_perceptron_tagger wordnet stopwords \
    && :
# Install system dependencies for NLTK and GDAL in the end

COPY manage.py .

COPY backend/ ./backend

COPY user/ ./user

EXPOSE 8000

CMD python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8000
