import path from 'path';
import Redis from 'ioredis';
import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import ws from '@fastify/websocket';
import FastifyStatic from '@fastify/static';

import { GatewayPort, getRedisConfig } from '@mini_faas_worker/common';

import { prisma } from './prisma';

import { startDebuggerService } from './debuggerService';

import deploymentRoutes from './deployment.route';

const IS_DEV = process.env.NODE_ENV === 'development';

const redisConfig = getRedisConfig();
const redis = new Redis(redisConfig.port, redisConfig.host);

const fastify: FastifyInstance = Fastify({
  logger: true,
});
fastify.register(cors);
fastify.register(ws, { options: { maxPayload: 1048576 } });
fastify.register(multipart);

fastify.register(deploymentRoutes, {
  redis,
  prisma,
  prefix: IS_DEV ? undefined : '/mini_faas_worker/gateway',
});
fastify.register(startDebuggerService, {
  prefix: IS_DEV ? undefined : '/mini_faas_worker/gateway/ws',
});

/**
 * serve devtools front_end 静态文件
 */
fastify.register(FastifyStatic, {
  root: path.join(process.cwd(), '../../public/front_end'),
  prefix: IS_DEV ? '/front_end' : '/mini_faas_worker/gateway/front_end',
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: GatewayPort, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
};
start();
