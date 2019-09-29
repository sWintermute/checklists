FROM alpine:3.10
ARG DEBUG

ENV PYTHONUNBUFFERED 1

RUN mkdir -p /app
WORKDIR /app

COPY Pipfile Pipfile.lock /app/
RUN apk add --no-cache python3 postgresql-libs jpeg && \
 ln -s python3 /usr/bin/python && \
 apk add --no-cache --virtual .build-deps python3-dev gcc musl-dev postgresql-dev jpeg-dev zlib-dev && \
 pip3 install --disable-pip-version-check --no-cache-dir pipenv gunicorn meinheld && \
 if [[ "$DEBUG" == "TRUE" ]] || [[ "$DEBUG" == "True" ]] || [[ "$DEBUG" == "1" ]]; then \
  echo "Install with DEV packages"; \
  pipenv install --dev --system --deploy --ignore-pipfile; \
 else \
  echo "Install only PROD packages"; \
  pipenv install --system --deploy --ignore-pipfile; \
 fi && \
 pip3 uninstall pipenv virtualenv virtualenv-clone certifi pip setuptools -y && \
 apk --purge del .build-deps && \
 rm -rf /root/.cache && \
 rm -rf /root/.local

EXPOSE 8000

ENTRYPOINT ["./docker-entrypoint.sh"]
