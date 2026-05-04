#!/bin/bash
set -e

STACK_NAME=final_devops_group19
IMAGE_NAME=${DOCKERHUB_USERNAME:-vghuy}/midterm-api
TAG=${1:-latest}

echo "Pulling image $IMAGE_NAME:$TAG ..."
docker pull $IMAGE_NAME:$TAG

echo "Deploying stack $STACK_NAME ..."
TAG=$TAG docker stack deploy -c docker-stack.yml $STACK_NAME --with-registry-auth --prune

echo "Deployment completed!"
docker service ls
docker stack ps $STACK_NAME