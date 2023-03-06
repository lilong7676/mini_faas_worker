#!/bin/sh

# 删除关闭的容器、无用的数据卷和网络，以及dangling镜像, -a 可以将没有容器使用Docker的镜像都删掉
docker system prune -a -f
