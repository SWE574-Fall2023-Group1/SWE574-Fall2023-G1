.PHONY: help

help:
	@echo targets: compose-up, compose-down, env-files

env-files:
ifeq ($(OS),Windows_NT)
	powershell ./hack/env-files.ps1
else
	./hack/env-files.sh
endif

compose-up:
	docker-compose up -d --build

compose-down:
	docker-compose down --remove-orphans
