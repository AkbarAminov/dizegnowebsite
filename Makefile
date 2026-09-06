# Local development through Docker (node:22-alpine + postgres:16-alpine).
# `make up` is all you need. Every setting lives in .env (see .env.example).

-include .env
APP_PORT ?= 3000

COMPOSE := docker compose --project-directory . -f docker/compose.yml
APP     := $(COMPOSE) exec app

.DEFAULT_GOAL := help

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

env: ## Create .env from .env.example (with a random AUTH_SECRET) if missing
	@test -f .env || { cp .env.example .env; \
		sed -i.bak "s|^AUTH_SECRET=.*|AUTH_SECRET=$$(openssl rand -base64 32)|" .env && rm .env.bak; \
		echo "Created .env — edit ADMIN_EMAIL / ADMIN_PASSWORD"; }

up: env ## Start the database and the dev server (installs deps, applies migrations)
	$(COMPOSE) up -d
	@echo "App: http://localhost:$(APP_PORT)  Admin: http://localhost:$(APP_PORT)/admin  (make logs to follow)"

down: ## Stop containers (data is kept)
	$(COMPOSE) down

restart: ## Restart the app container
	$(COMPOSE) restart app

logs: ## Follow app logs
	$(COMPOSE) logs -f app

ps: ## Show container status
	$(COMPOSE) ps

shell: ## Open a shell inside the app container
	$(APP) sh

seed: ## Insert demo projects (safe to re-run)
	$(APP) npm run db:seed

migrate: ## Create/apply a migration after editing prisma/schema.prisma (make migrate name=add_field)
	$(APP) npx prisma migrate dev $(if $(name),--name $(name),)

studio: ## Open Prisma Studio at http://localhost:5555
	$(COMPOSE) exec -p 5555:5555 app npx prisma studio --hostname 0.0.0.0

psql: ## Open a psql session
	$(COMPOSE) exec db sh -c 'psql -U "$$POSTGRES_USER" -d "$$POSTGRES_DB"'

lint: ## ESLint
	$(APP) npm run lint

typecheck: ## TypeScript check
	$(APP) npm run typecheck

build: ## Production build (inside the container)
	$(APP) npm run build

check: lint typecheck ## Lint + typecheck

clean: ## Stop containers and delete all volumes (database, node_modules, .next)
	$(COMPOSE) down -v --remove-orphans

.PHONY: help env up down restart logs ps shell seed migrate studio psql lint typecheck build check clean
