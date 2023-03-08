import path from 'path';
import Redis from 'ioredis';
import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import ws from '@fastify/websocket';
import FastifyStatic from '@fastify/static';

import {
  GatewayPort,
  ServerHost,
  getRedisConfig,
} from '@mini_faas_worker/common';

import { prisma } from './prisma';

import { startDebuggerService } from './debuggerService';

import deploymentRoutes from './deployment.route';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const redisConfig = getRedisConfig();
const redis = new Redis(redisConfig.port, redisConfig.host);

const fastify: FastifyInstance = Fastify({
  logger: true,
});
fastify.register(cors);
fastify.register(ws, { options: { maxPayload: 1048576 } });
fastify.register(multipart);

fastify.register(deploymentRoutes, { redis, prisma });
fastify.register(startDebuggerService);

/**
 * serve devtools front_end 静态文件
 */
fastify.register(FastifyStatic, {
  root: path.join(__dirname, '../../../public/front_end'),
  prefix: '/front_end',
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: GatewayPort, host: ServerHost });
  } catch (err) {
    fastify.log.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
};
start();
