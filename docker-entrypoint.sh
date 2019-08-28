#! /usr/bin/env sh

echo Make migrations
python manage.py makemigrations

echo Migrating
python manage.py migrate

echo Collect static
python manage.py collectstatic --noinput

# Prepare log files and start outputting logs to stdout
#touch ./logs/gunicorn.log
#chmod 777 ./logs/gunicorn.log
#touch ./logs/access.log
#chmod 777 ./logs/access.log
#tail -n 0 -f /srv/logs/*.log &

# Start Gunicorn processes
echo Starting Gunicorn.
exec gunicorn checklists.wsgi:application \
  --name checklists \
  --bind 0.0.0.0:8000 \
  --workers 3 \
  "$@"
#  --log-level=info \
#  --log-file=/srv/logs/gunicorn.log \
#  --access-logfile=/srv/logs/access.log \


