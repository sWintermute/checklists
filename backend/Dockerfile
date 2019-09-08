FROM python:3.7-alpine3.9

RUN mkdir -p /app
WORKDIR /app

COPY Pipfile Pipfile.lock /app/

RUN \
 apk add --no-cache postgresql-libs && \
 apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev && \
 pip install pipenv gunicorn meinheld && \
 pipenv install --system --deploy --ignore-pipfile && \
 apk --purge del .build-deps

EXPOSE 8000

ENTRYPOINT ["./docker-entrypoint.sh"]
