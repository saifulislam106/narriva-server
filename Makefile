### * Docker Setup for Blog Management * ###
# ─────────────────────────────────────────────────────────────────────────────
COMPOSE_FILE := compose.yml
PROJECT_NAME := narriva_server
SERVICE      := api
IMAGE        := narriva_server:latest
CONTAINER    := narriva_server

# shorthand for docker‐compose
DC := docker compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE)

.PHONY: help up down restart logs ps \
        build push pull remove rebuild \
        shell env prune clean view-*

# ─────────────────────────────────────────────────────────────────────────────
help:
  @echo "📘 Usage:"
  @grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ─────────────────────────────────────────────────────────────────────────────
up: ## Build & start services
  @echo "🚀 Starting containers..."
  @$(DC) up -d

down: ## Stop & remove containers + volumes
  @echo "🛑 Stopping and removing containers..."
  @$(DC) down -v

restart: down up ## Restart all services

logs: ## Tail logs
  @echo "📜 Logs:"
  @$(DC) logs -f

ps: ## Show container status
  @$(DC) ps

# ─────────────────────────────────────────────────────────────────────────────
build: ## Build docker image
  @echo "🔨 Building image..."
  @docker build -t $(IMAGE) .

push: ## Push image to Docker Hub
  docker push $(IMAGE)

pull: ## Pull latest image
  docker pull $(IMAGE)

remove: ## Remove Docker image
  docker rmi $(IMAGE)

rebuild: down build up ## Rebuild everything

# ─────────────────────────────────────────────────────────────────────────────
shell: ## Open shell inside container
  @$(DC) exec $(SERVICE) sh

env: ## Print env file
  @test -f .env && cat .env || echo ".env file not found"

# ─────────────────────────────────────────────────────────────────────────────
prune: ## Prune dangling resources
  @docker system prune -f
  @docker volume prune -f
  @docker container prune -f
  @docker image prune -f
  @docker network prune -f

clean: ## Stop & remove everything related
  -docker stop $(CONTAINER)
  -docker rm $(CONTAINER)
  -docker rmi $(IMAGE)
  make prune-all

# ─────────────────────────────────────────────────────────────────────────────
view-containers: ## List all containers
  docker ps -a

view-running: ## Show running containers
  docker ps

view-images: ## Show Docker images
  docker images

view-volumes: ## Show Docker volumes
  docker volume ls

view-networks: ## Show Docker networks
  docker network ls