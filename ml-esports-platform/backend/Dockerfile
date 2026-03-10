FROM python:3.12-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt
COPY . /app
# Optional: collect static; ignore failure if DEBUG disables it
RUN python manage.py collectstatic --noinput || true
# Railway/Render expect the service to listen on $PORT
CMD ["bash","-lc","gunicorn backend.wsgi --bind 0.0.0.0:${PORT:-8000}"]
