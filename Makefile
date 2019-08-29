include .env
up:
	docker-compose up -d
upb:
	docker-compose up -d --force-recreate --build
down:
	docker-compose down
db:
	export PGPASSWORD=${POSTGRES_PASSWORD}; docker exec -it /checklists_postgres_db psql -U $(POSTGRES_USER) ${POSTGRES_DB}
sh:
	docker exec -it /checklists_backend /bin/sh
migrations:
	docker exec -it /checklists_backend python manage.py makemigrations
superuser:
	docker exec -it /checklists_backend python manage.py createsuperuser