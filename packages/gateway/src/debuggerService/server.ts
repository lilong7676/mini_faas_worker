/*
 * 云函数调试服务
 * @Author: lilonglong
 * @Date: 2023-01-17 23:26:39
 * @Last Modified by: lilonglong
 * @Last Modified time: 2023-03-03 10:33:22
 */
import type { FastifyInstance } from 'fastify';
import type { SocketStream } from '@fastify/websocket';
import Redis from 'ioredis';
import {
  ServerlessEventEnum,
  ServerlessFuncLogEventParams,
  DevtoolsClientRequest,
  DebuggerEventEnum,
  DebuggerCDPMessageNeedProcessParams,
  ServerlessCDPProcessedResultParams,
} from '@mini_faas_worker/common';
import { Deployment } from '@mini_faas_worker/types';
import { v4 as uuidv4 } from 'uuid';
import fetch from 'node-fetch';

import { generateConsoleApiCalledEvent } from './utils/consoleApiCalledEvent';

import { findDeploymentById } from '../deployment.route';

// 临时方案，建立 debuggerSessionId <--> deploymentId 的映射关系
const debuggerIdDeploymentIdMap = new Map<string, string>();

// 临时方案，建立 debuggerSessionId <--> socketConnection 的映射关系
const debuggerIdSocketMap = new Map<string, SocketStream>();

interface IQuery_DeploymentDetail {
  deploymentId: string;
}

/**
 * 订阅 redis 消息
 * @param {Redis} redis
 */
function initRedisPubsub() {
  const redis = new Redis();
  redis.subscribe(
    ServerlessEventEnum.FuncLogEvent,
    ServerlessEventEnum.CDPProcessedResult,
    (err, count) => {
      if (err) {
        console.error('redis pubsub error', err);
      }
    }
  );

  redis.on('message', (channel, message) => {
    console.log(`gateway redis: Received ${message} from ${channel}`);
    try {
      if (channel === ServerlessEventEnum.FuncLogEvent) {
        const {
          debuggerSessionId,
          logParams: { logLevel, args: logArgs },
        }: ServerlessFuncLogEventParams = JSON.parse(message);

        if (debuggerSessionId) {
          const socketConnection = debuggerIdSocketMap.get(debuggerSessionId);

          if (socketConnection) {
            const consoleEventCDP = generateConsoleApiCalledEvent(
              logLevel,
              logArgs
            );
            socketConnection.socket.send(JSON.stringify(consoleEventCDP));
          }
        }
      } else if (channel === ServerlessEventEnum.CDPProcessedResult) {
        const {
          debuggerSessionId,
          result,
        }: ServerlessCDPProcessedResultParams = JSON.parse(message);
        const socketConnection = debuggerIdSocketMap.get(debuggerSessionId);
        if (socketConnection) {
          socketConnection.socket.send(JSON.stringify(result));
        }
      }
    } catch (error) {
      console.error('gateway debugger-service error:', error);
    }
  });
  return redis.duplicate();
}

/**
 * 云函数调试服务
 * @param {FastifyInstance} fastify
 * @param param1
 */
export default async function startDebuggerSeriviceServer(
  fastify: FastifyInstance
) {
  // 初始化 redis 监听
  const redis = initRedisPubsub();

  /**
   * devtools websocket 服务
   */
  fastify.get(
    '/debugger/:debuggerSessionId',
    {
      websocket: true,
    },
    (connection, req) => {
      // 拿到 debuggerSessionId
      const { debuggerSessionId } = req.params as { debuggerSessionId: string };
      if (!debuggerSessionId) {
        connection.socket.close();
      }

      debuggerIdSocketMap.set(debuggerSessionId, connection);

      connection.socket.on('message', async message => {
        console.log('debbuger service receive message:', message.toString());
        try {
          const messageObj = JSON.parse(
            message.toString()
          ) as DevtoolsClientRequest;
          const messageForRedis: DebuggerCDPMessageNeedProcessParams = {
            debuggerSessionId,
            cdp: messageObj,
          };

          redis.publish(
            DebuggerEventEnum.CDPMessageNeedProcess,
            JSON.stringify(messageForRedis)
          );
        } catch (error) {
          console.error(error);
          // 报错直接关闭 socket
          connection.socket.close();
        }
      });

      connection.socket.on('close', () => {
        console.log(
          'gateway socket on close, debuggerSessionId: ',
          debuggerSessionId
        );
        debuggerIdSocketMap.delete(debuggerSessionId);
      });
    }
  );

  /**
   * 根据 deploymentId 获取临时的 debuggerSessionId
   */
  fastify.get<{ Querystring: IQuery_DeploymentDetail }>(
    '/getDebuggerSession',
    async request => {
      const {
        query: { deploymentId },
      } = request;

      const deployment = await findDeploymentById(deploymentId);

      const debuggerSessionId = uuidv4();
      debuggerIdDeploymentIdMap.set(debuggerSessionId, deployment.id);
      return { debuggerSessionId };
    }
  );
}
