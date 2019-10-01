FROM alpine:3.10 AS build
ARG DEBUG
ENV PYTHONUNBUFFERED 1
RUN mkdir -p /app &&\
 apk add --no-cache python3 postgresql-libs jpeg zlib && \
 ln -s python3 /usr/bin/python && \
 apk add --no-cache --virtual .build-deps python3-dev gcc musl-dev postgresql-dev jpeg-dev zlib-dev && \
 pip3 install --disable-pip-version-check --no-cache-dir pipenv
WORKDIR /app
COPY Pipfile Pipfile.lock /app/

RUN if [[ "$DEBUG" == "TRUE" ]] || [[ "$DEBUG" == "True" ]] || [[ "$DEBUG" == "1" ]]; then \
  echo "Install with DEV packages"; \
  pipenv install --system --deploy --ignore-pipfile --dev; \
  pip3 uninstall pipenv virtualenv virtualenv-clone pip -y; \
 else \
  echo "Install only PROD packages"; \
  pip3 install --disable-pip-version-check --no-cache-dir gunicorn meinheld; \
  pipenv install --system --deploy --ignore-pipfile; \
  pip3 uninstall pipenv virtualenv virtualenv-clone certifi pip -y; \
 fi && \
 apk --purge del .build-deps


FROM scratch AS cleanup
COPY --from=build / /
RUN rm -rf /root/.cache /root/.local \
 /etc/apk/ /usr/share/apk/ /lib/apk/ /sbin/apk \
 /media /usr/lib/terminfo /usr/share/terminfo \
 /usr/lib/python3.7/ensurepip \
 /usr/lib/python3.7/turtledemo /usr/lib/python3.7/turtle.py /usr/lib/python3.7/__pycache__/turtle.* \
 /usr/bin/2to3* /usr/lib/python3.7/lib2to3

RUN rm -rf /usr/lib/python3.7/site-packages/*-info


FROM scratch AS deploy
ARG DEBUG
ENV PYTHONUNBUFFERED 1
ENV DEBUG ${DEBUG}
EXPOSE 8000
COPY --from=cleanup / /
WORKDIR /app
ENTRYPOINT ["./docker-entrypoint.sh"]
