FROM alpine:3.10
ENV PYTHONUNBUFFERED 1

RUN apk add --no-cache python3 postgresql-libs

RUN mkdir -p /app
WORKDIR /app

COPY Pipfile Pipfile.lock /app/
RUN apk add --no-cache --virtual .build-deps python3-dev gcc musl-dev postgresql-dev && \
 pip3 install --disable-pip-version-check --no-cache-dir pipenv gunicorn meinheld && \
 pipenv install --system --deploy --ignore-pipfile && \
 apk --purge del .build-deps

EXPOSE 8000

ENTRYPOINT ["./docker-entrypoint.sh"]
