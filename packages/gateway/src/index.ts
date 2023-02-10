import path from 'path';
import Redis from 'ioredis';
import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import ws from '@fastify/websocket';
import FastifyStatic from '@fastify/static';
import { PrismaClient } from '@prisma/client';
import deploymentRoutes from './deployment.route';
import debuggerSerivice from './debugger-service';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const redis = new Redis();

const fastify: FastifyInstance = Fastify({
  logger: true,
});
fastify.register(cors);
fastify.register(ws, { options: { maxPayload: 1048576 } });
fastify.register(multipart);

fastify.register(deploymentRoutes, { redis, prisma });
fastify.register(debuggerSerivice, { prisma });

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
    await fastify.listen({ port: 3005 });
  } catch (err) {
    fastify.log.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
};
start();
