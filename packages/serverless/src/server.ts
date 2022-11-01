/*
 * 函数路由服务
 * @Author: lilonglong
 * @Date: 2022-10-28 22:47:22
 * @Last Modified by: lilonglong
 * @Last Modified time: 2022-11-01 15:08:12
 */

import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import fs from 'node:fs';
import path from 'node:path';
import cors from '@fastify/cors';
import { Client as ClientSDK } from '@mini_faas_worker/sdk';
import {
  getDeploymentFromRequest,
  getDeploymentCode,
} from './utils/deployments';

const fastify = Fastify({
  logger: true,
});

export default async function startServer(port: number) {
  await fastify.register(cors);

  const routeHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const deployment = getDeploymentFromRequest(request);

    console.log('getDeploymentFromRequest', deployment);

    if (!deployment) {
      reply.status(404).send({ error: '404' });
      return;
    }

    const code = await getDeploymentCode(deployment.id);
    const response = await ClientSDK.invokeFunctionWithCode(code, undefined, {
      method: request.method,
      headers: request.headers,
      url: request.url,
      hostname: request.hostname,
      protocol: request.protocol,
    });

    const body = response.body;

    reply.status(response.status).headers(response.headers).send(body);
  };

  fastify.get('/*', routeHandler);
  fastify.post('/*', routeHandler);
  fastify.get('/favicon.ico', async (request, reply) => {
    const favicon = await fs.promises.readFile(
      path.join('public', 'favicon.ico')
    );

    reply
      .header('cache-control', 'max-age=86400')
      .type('image/x-icon')
      .send(favicon);
  });

  try {
    await fastify.listen({ port });
  } catch (error) {
    if (error) {
      console.error(error);
      process.exit(1);
    }

    console.log(`mini_FaaS_Worker Serverless port: ${port}`);
  }
}
