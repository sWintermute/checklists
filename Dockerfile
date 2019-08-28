FROM python:3.7-alpine3.9

RUN mkdir -p /app
WORKDIR /app

COPY . /app
RUN pip install pipenv
RUN \
 apk add --no-cache postgresql-libs && \
 apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev && \
 pipenv install --system --deploy --ignore-pipfile && \
 apk --purge del .build-deps

EXPOSE 8000

CMD ["gunicorn", "--chdir", "checklists", "--bind", ":8000", "checklists.wsgi:application"]

