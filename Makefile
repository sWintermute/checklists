#!/usr/bin/make

include .env

SHELL = /bin/sh
CURRENT_UID := $(shell id -u):$(shell id -g)

export CURRENT_UID

up:
	docker-compose up -d
prod-up:
	docker-compose -f docker-compose-prod.yml up -d
upb:
	docker-compose up -d --force-recreate --build
prod-upb:
	docker-compose -f docker-compose-prod.yml up -d --force-recreate --build --remove-orphans
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
	docker exec -it /checklists_backend_dev python3 manage.py makemigrations
su:
	docker exec -it /checklists_backend_dev python3 manage.py createsuperuser
prod-su:
	docker exec -it /checklists_backend python3 manage.py createsuperuser
dump:
	docker exec -it /checklists_backend_dev python3 manage.py dumpdata -o $(filter-out $@,$(MAKECMDGOALS))
prod-dump:
	docker exec -it /checklists_backend python3 manage.py dumpdata -o $(filter-out $@,$(MAKECMDGOALS))
load:
	docker exec -it /checklists_backend_dev python3 manage.py loaddata $(filter-out $@,$(MAKECMDGOALS))
prod-load:
	docker exec -it /checklists_backend python3 manage.py loaddata $(filter-out $@,$(MAKECMDGOALS))
%:
	@: