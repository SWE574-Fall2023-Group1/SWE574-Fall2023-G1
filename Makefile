.PHONY: help

help:
	@echo "--------------------------------------------------------------------"
	@echo "                           Memories                                 "
	@echo "           web and mobile app for social networking                 "
	@echo "    focusing on sharing past memories with other users worldwide    "
	@echo "--------------------------------------------------------------------"
	@echo "        This Makefile assumes you have Docker and Docker Compose    "
	@echo "--------------------------------------------------------------------"
	@echo "  targets: up, down, env-files, pre-commit, help                    "
	@echo "--------------------------------------------------------------------"
	@echo "    Local system up:                                                "
	@echo "          > make up;                                                "
	@echo "          > make compose-up;                                        "
	@echo "    Local system down:                                              "
	@echo "          > make down;                                              "
	@echo "          > make compose-down;                                      "
	@echo "    Local environment files:                                        "
	@echo "          > make env-files;                                         "
	@echo "    Run pre-commit for all files:                                   "
	@echo "          > make pre-commit;                                        "
	@echo "    Help:                                                           "
	@echo "          > make;                                                   "
	@echo "          > make help;                                              "
	@echo "--------------------------------------------------------------------"

env-files:
ifeq ($(OS),Windows_NT)
	powershell ./hack/env-files.ps1
else
	./hack/env-files.sh
endif

compose-up: env-files
	docker compose up -d --build
	@sleep 5

compose-down: env-files
	docker compose down --remove-orphans

up: compose-up

down: compose-down

pre-commit:
	@pre-commit install
	pre-commit run --all-files

git-stats:
	git log | git shortlog -sne

django-test: up
	docker compose exec -T backend python manage.py test
