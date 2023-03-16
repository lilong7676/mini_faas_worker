/*
 * 监听来自 redis 的函数部署消息，并负责启动 worker 进程
 * 可以把每一个 worker 看成独立的“函数运行服务”
 * @Author: lilonglong
 * @Date: 2022-10-25 22:54:40
 * @Last Modified by: lilonglong
 * @Last Modified time: 2023-03-16 11:04:08
 */

import cluster from 'node:cluster';
import os from 'node:os';
import Redis from 'ioredis';
import fetch from 'node-fetch';
import { Deployment } from '@mini_faas_worker/types';
import {
  GatewayEventEnum,
  GatewayDeployEventParams,
  GatewayPort,
  getRedisConfig,
} from '@mini_faas_worker/common';

import { IS_DEV } from '../utils/constants';
const redisConfig = getRedisConfig();
export const redis = new Redis(redisConfig.port, redisConfig.host);

function initRedisPubsub() {
  // 订阅 redis 消息
  redis.subscribe(GatewayEventEnum.DeployEvent, (err, count) => {
    if (err) {
      console.error('redis pubsub error', err);
    }
  });

  redis.on('message', (channel, message) => {
    console.log(`redis: Received ${message} from ${channel}`);
    if (channel === GatewayEventEnum.DeployEvent) {
      const deployment: GatewayDeployEventParams = JSON.parse(message);
      // 更新部署信息
      for (const id in cluster.workers) {
        cluster.workers[id]?.send({
          msg: 'deployments',
          data: [deployment],
        });
      }
    }
  });
}

// 拉取所有部署的函数信息
const getAllDeployments = async function () {
  const url = IS_DEV
    ? `http://localhost:${GatewayPort}/listDeployments`
    : `https://lilong7676.cn/mini_faas_worker/gateway/listDeployments`;
  console.log('getAllDeployments url', url);

  try {
    const response = await fetch(url);
    const allDeployments = (await response.json()) as Deployment[];
    return allDeployments;
  } catch (error) {
    return new Promise(resolve => {
      console.log('getAllDeployments error', error);
      setTimeout(() => {
        console.log('retry getAllDeployments');
        resolve(getAllDeployments());
      }, 1000);
    });
  }
};

/**
 * main
 */
export default async function master() {
  const allDeployments = await getAllDeployments();

  /**
   * 这里有问题待解决，如果是多核的话，会导致多个 worker 线程同时监听同一个redis广播，导致 CDP 消息重复发送
   */
  // const workersNum = IS_DEV ? 1 : os.cpus().length;
  const workersNum = 1;

  for (let i = 0; i < workersNum; i++) {
    const worker = cluster.fork();
    worker.on('message', ({ cmd }) => {
      if (cmd === 'ok') {
        console.log('worker child started!');
        // 当 worker 线程已就绪，则发送部署信息给 worker
        worker.send({ msg: 'deployments', data: allDeployments });
      }
    });
  }

  initRedisPubsub();
}
