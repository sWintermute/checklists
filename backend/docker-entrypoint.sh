#! /bin/sh

echo Migrating
python manage.py migrate

echo Collect static
python manage.py collectstatic --noinput


if [[ ${DEBUG} == 'TRUE' ]] || [[ ${DEBUG} == 'True' ]] || [[ ${DEBUG} == '1' ]]
then
  echo Starting debug server...
  exec python manage.py runserver 0.0.0.0:8000
else
    echo Starting Gunicorn...
    exec gunicorn checklists.wsgi:application \
      -k egg:meinheld#gunicorn_worker \
      --name checklists \
      --bind 0.0.0.0:8000 \
      --workers 3 \
      "$@"
fi
