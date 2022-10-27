import Redis from 'ioredis';
import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { PrismaClient } from '@prisma/client';
import deploymentRoutes from './deployment.route';

const prisma = new PrismaClient();

const redis = new Redis();

const fastify: FastifyInstance = Fastify({
  logger: true,
});
await fastify.register(cors);
await fastify.register(multipart);

fastify.register(deploymentRoutes, { redis, prisma });

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
