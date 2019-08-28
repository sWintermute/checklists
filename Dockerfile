FROM python:3.7

RUN mkdir -p /app
WORKDIR /app

COPY Pipfile /app/
RUN pip install pipenv
RUN pipenv lock
RUN pipenv install --system

COPY . /app

EXPOSE 8000

CMD ["gunicorn", "--chdir", "checklists", "--bind", ":8000", "checklists.wsgi:application"]

