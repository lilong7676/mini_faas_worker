#!/bin/bash
echo "stopping mini_faas_worker..."
docker stop mini_faas_worker
echo "mini_faas_worker stopped"

echo "clean docker ..."
docker system prune -a -f
echo "clean docker done"

echo "pull lilong7676/mini_faas_worker:latest"
docker pull lilong7676/mini_faas_worker:latest
echo "pull latest done"

echo "run mini_faas_worker"
docker run --name="mini_faas_worker" -d -p 9100:9100 -p 9101:9101 -p 9102:9102 lilong7676/mini_faas_worker:latest
echo "run mini_faas_worker done"
