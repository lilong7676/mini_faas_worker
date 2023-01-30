/*
 * 监听来自 master 进程的函数部署消息，并启动函数路由服务
 * @Author: lilonglong
 * @Date: 2022-10-25 22:54:47
 * @Last Modified by: lilonglong
 * @Last Modified time: 2023-01-28 15:17:14
 */

import { Deployment } from '@mini_faas_worker/types';
import process from 'node:process';
import startServer from 'src/server';
import { fetchAndSaveOSSFile } from 'src/utils/oss';
import { deploymentCache } from 'src/utils/deployments';

const serverPort = 3006;
const serverHostUrl = `localhost:${serverPort}`;

function handleDeployments(deployments: Deployment[]) {
  // 拉取所有部署的函数信息到本地
  Promise.all(
    deployments.map(deployment => {
      const { id } = deployment;
      const deploymentHost = `${serverHostUrl}/${id}`;
      // 更新 deploymentCache
      deploymentCache.set(deploymentHost, deployment);

      // 下载函数文件到本地
      return fetchAndSaveOSSFile(id);
    })
  ).then(() => {
    console.log('setup all deployments done!');
  });
}

export default async function worker() {
  // 通知 master 已就绪
  process.send?.({ cmd: 'ok' });

  // worker 进程监听来自 master 的消息
  process.on('message', (message: { msg: string; data: unknown }) => {
    console.log('worker received message', message);
    const { msg, data } = message;

    switch (msg) {
      case 'deployments': {
        handleDeployments(data as Deployment[]);
        break;
      }
      case 'undeploy': {
        // TODO
        break;
      }
      default:
        break;
    }
  });

  // 启动函数路由服务
  startServer(serverPort);
}
