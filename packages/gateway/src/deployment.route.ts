import { FastifyInstance } from 'fastify';
import { MultipartValue } from '@fastify/multipart';
import Redis from 'ioredis';
import { pipeline } from 'node:stream';
import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient, Deployment } from '@prisma/client';

const OSSPath = '.fakeOSS';
interface IBody_CreateFunction {
  name: string;
}

interface IQuery_FunctionDetail {
  id: string;
}

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

  /**
   * 保存并部署函数
   * 先创建部署信息到数据库，根据部署id保存文件到 OSS 上
   */
  fastify.post('/saveAndDeployFunction', async request => {
    const data = await request.file();
    const funcIdField = data?.fields.funcId as MultipartValue<string>;
    const funcId = funcIdField.value;

    let deploymentResult: Deployment;

    if (data?.file) {
      // 创建 deployment 信息, 拿到部署 id
      try {
        const existedDeployment = await prisma.deployment.findFirstOrThrow({
          where: {
            functionId: funcId,
          },
        });
        deploymentResult = await prisma.deployment.update({
          where: {
            id: existedDeployment.id,
          },
          data: {
            functionId: funcId,
          },
        });
      } catch (error) {
        // 如果没有部署过，则创建新部署信息
        deploymentResult = await prisma.deployment.create({
          data: {
            functionId: funcId,
          },
        });
      }

      if (deploymentResult) {
        const deploymentId = deploymentResult.id;

        // 根据部署 id 保存函数文件到 OSS
        const funcDir = path.join(process.cwd(), OSSPath, deploymentId);
        const funcFullPath = path.join(funcDir, data.filename);
        await new Promise<void>((resolve, reject) => {
          fs.promises.mkdir(funcDir, { recursive: true }).then(() => {
            pipeline(data.file, fs.createWriteStream(funcFullPath), err => {
              if (err) {
                reject(err);
              }
              resolve();
            });
          });
        });

        // 通知 serverless 服务有新部署
        await redis.publish('deploy', JSON.stringify(deploymentResult));

        return deploymentResult;
      }
    }

    throw new Error('saveAndDeployFunction error');
  });

  /**
   * 获取所有部署信息
   */
  fastify.get('/listDeployments', async () => {
    return prisma.deployment.findMany();
  });

  /**
   * 获取部署的代码
   */
  fastify.get<{ Querystring: { deploymentId: string } }>(
    '/getDeploymentCode',
    async request => {
      const { deploymentId } = request.query;
      const funcDir = path.join(process.cwd(), OSSPath, deploymentId);
      const funcFullPath = path.join(funcDir, 'index.js');
      const code = await fs.promises.readFile(funcFullPath, 'utf8');
      return { code };
    }
  );
}
