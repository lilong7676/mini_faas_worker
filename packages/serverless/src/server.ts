/*
 * 函数路由服务
 * @Author: lilonglong
 * @Date: 2022-10-28 22:47:22
 * @Last Modified by: lilonglong
 * @Last Modified time: 2023-03-14 11:29:21
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';

import routes from './routes';

const fastify = Fastify({
  logger: true,
});

const IS_DEV = process.env.NODE_ENV === 'development';

export default async function startServer(port: number) {
  await fastify.register(cors);

  fastify.register(routes, {
    prefix: IS_DEV ? '' : '/mini_faas_worker/serverless',
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
