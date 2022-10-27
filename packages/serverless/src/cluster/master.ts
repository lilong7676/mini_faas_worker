import cluster from 'node:cluster';
import os from 'node:os';
import Redis from 'ioredis';
import fetch from 'node-fetch';
import { Deployment } from '@mini_faas_worker/types';

import { fetchAndSaveOSSFile } from 'src/utils';

const IS_DEV = process.env.NODE_ENV !== 'production';

function initRedisPubsub() {
  const redis = new Redis();

  // 订阅 redis 消息
  redis.subscribe('deploy', (err, count) => {
    if (err) {
      console.error('redis pubsub error', err);
    }
  });

  redis.on('message', (channel, message) => {
    console.log(`Received ${message} from ${channel}`);
    if (channel === 'deploy') {
      const deployment: Deployment = JSON.parse(message);
      // 更新部署信息
      const { id } = deployment;
      fetchAndSaveOSSFile(id);
    }
  });
}

// 拉取所有部署的函数信息到本地
async function setupDeployments() {
  const response = await fetch('http://localhost:3005/listDeployments');
  const allDeployments = (await response.json()) as Deployment[];
  Promise.all(
    allDeployments.map(({ id }) => {
      return fetchAndSaveOSSFile(id);
    })
  ).then(() => {
    console.log('setup all deployments done!');
  });
}

/**
 * main
 */
export default async function master() {
  const workersNum = IS_DEV ? 1 : os.cpus().length;

  for (let i = 0; i < workersNum; i++) {
    cluster.fork();
  }

  for (const id in cluster.workers) {
    cluster.workers[id]?.on('message', ({ cmd }) => {
      if (cmd === 'ok') {
        console.log('forked child started!');
      }
    });
  }

  initRedisPubsub();
  setupDeployments();
}
