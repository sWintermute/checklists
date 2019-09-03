include .env
up:
	docker-compose up -d
prod-up:
	docker-compose -f docker-compose-prod.yml up -d
upb:
	docker-compose up -d --force-recreate --build
prod-upb:
	docker-compose -f docker-compose-prod.yml up -d --force-recreate --build
stop:
	docker-compose stop
prod-stop:
	docker-compose -f docker-compose-prod.yml stop
down:
	docker-compose down
prod-down:
	docker-compose -f docker-compose-prod.yml down
db:
	export PGPASSWORD=${POSTGRES_PASSWORD}; docker exec -it /checklists_postgres_db_dev psql -U $(POSTGRES_USER) ${POSTGRES_DB}
prod-db:
	export PGPASSWORD=${POSTGRES_PASSWORD}; docker exec -it /checklists_postgres_db psql -U $(POSTGRES_USER) ${POSTGRES_DB}
sh:
	docker exec -it /checklists_backend_dev /bin/sh
prod-sh:
	docker exec -it /checklists_backend /bin/sh
migrations:
	docker exec -it /checklists_backend_dev python manage.py makemigrations
su:
	docker exec -it /checklists_backend_dev python manage.py createsuperuser
prod-su:
	docker exec -it /checklists_backend python manage.py createsuperuser
