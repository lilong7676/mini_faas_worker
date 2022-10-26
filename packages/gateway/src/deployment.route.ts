import { FastifyInstance } from 'fastify';
import Redis from 'ioredis';
import { Prisma, PrismaClient } from '@prisma/client';

interface IBody_CreateFunction {
  name: string;
}

interface IQuery_FunctionDetail {
  id: string;
}

type PrismaDeployment = Prisma.DeploymentCreateInput;

export default async function deploymentRoutes(
  fastify: FastifyInstance,
  { redis, prisma }: { redis: Redis; prisma: PrismaClient }
) {
  /**
   * 创建函数
   */
  fastify.post<{
    Body: IBody_CreateFunction;
  }>('/createFunction', async request => {
    const { name } = request.body;
    const func = await prisma.function.create({
      data: {
        name: name,
      },
    });
    return func;
  });

  /**
   * 获取函数列表
   */
  fastify.get('/listFunction', async () => {
    const functionList = await prisma.function.findMany({
      include: {
        deployments: true,
        domains: true,
      },
    });
    return functionList;
  });

  /**
   * 获取函数详情
   */

  fastify.get<{ Querystring: IQuery_FunctionDetail }>(
    '/functionDetail',
    async request => {
      const { id } = request.query;
      const func = await prisma.function.findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          deployments: true,
          domains: true,
        },
      });
      return func;
    }
  );
}
