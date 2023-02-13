/*
 * debugger service main
 * @Author: lilonglong
 * @Date: 2023-02-10 23:35:48
 * @Last Modified by: lilonglong
 * @Last Modified time: 2023-02-13 12:51:23
 */
import type { FastifyInstance } from 'fastify';
import startDebuggerSeriviceServer from './server';

export async function startDebuggerService(server: FastifyInstance) {
  startDebuggerSeriviceServer(server);
}
