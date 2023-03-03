#!/bin/sh

image=mini_faas_worker_compose
container=mini_faas_worker

# 先停止容器运行,再删除容器
docker stop ${container}
docker container rm -f ${container}

# 删除镜像
docker image rm -f $image

docker-compose up -d

echo "docker 部署并运行成功"
echo ${image}
