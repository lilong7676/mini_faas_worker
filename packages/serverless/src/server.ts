/*
 * 函数路由服务
 * @Author: lilonglong
 * @Date: 2022-10-28 22:47:22
 * @Last Modified by: lilonglong
 * @Last Modified time: 2023-03-08 16:47:01
 */

import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import fs from 'node:fs';
import path from 'node:path';
import cors from '@fastify/cors';
import { Client as ClientSDK } from '@mini_faas_worker/sdk';
import { MetadataInit } from '@mini_faas_worker/types';
import {
  getDeploymentFromRequest,
  getDeploymentCode,
} from './utils/deployments';
import { DebuggerSession } from './debugger';

const fastify = Fastify({
  logger: true,
});

const IS_DEV = process.env.NODE_ENV === 'development';

export default async function startServer(port: number) {
  await fastify.register(cors);

  const routeHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const debuggerSessionId = request.headers['x-debugger-session-id'] as
      | string
      | undefined;

    const debuggerSession = new DebuggerSession(debuggerSessionId);

    const deployment = getDeploymentFromRequest(request);

    console.log('getDeploymentFromRequest', deployment);

    if (!deployment) {
      reply.status(404).send({ error: '404' });
      return;
    }

    // getDeploymentCode by deploymentId
    const code = await getDeploymentCode(deployment.id);

    // init metadata for function invoke
    const metadataInit: MetadataInit = {
      method: request.method,
      headers: request.headers,
      url: request.url,
      hostname: request.hostname,
      protocol: request.protocol,
    };

    // invoke function through SDK
    const response = await ClientSDK.invokeFunctionWithCode(
      deployment,
      code,
      undefined,
      metadataInit,
      debuggerSession.getOnFuncLogHandler()
    );

    let body = response.body;
    // 如果返回是 Uint8Array，则需要转成 Buffer
    if (body instanceof Uint8Array) {
      body = Buffer.concat([body]);
    }

    reply.status(response.status).headers(response.headers).send(body);
  };

  const prefix = IS_DEV ? '' : '/mini_faas_worker/serverless';

  fastify.get(`${prefix}/trigger/*`, routeHandler);
  fastify.post(`${prefix}/trigger/*`, routeHandler);
  fastify.get(`${prefix}/favicon.ico`, async (request, reply) => {
    const favicon = await fs.promises.readFile(
      path.join('public', 'favicon.ico')
    );

    reply
      .header('cache-control', 'max-age=86400')
      .type('image/x-icon')
      .send(favicon);
  });

  try {
    await fastify.listen({ port, host: '0.0.0.0' });
  } catch (error) {
    if (error) {
      console.error(error);
      process.exit(1);
    }

    console.log(`mini_FaaS_Worker Serverless port: ${port}`);
  }
}
