#! /usr/bin/env sh

echo Migrating
python manage.py migrate

echo Collect static
python manage.py collectstatic --noinput

echo Starting Gunicorn.
exec gunicorn checklists.wsgi:application \
  --name checklists \
  --bind 0.0.0.0:8000 \
  --workers 3 \
  "$@"


