/*
 * 云函数调试服务
 * @Author: lilonglong
 * @Date: 2023-01-17 23:26:39
 * @Last Modified by: lilonglong
 * @Last Modified time: 2023-02-13 11:56:34
 */
import type { FastifyInstance } from 'fastify';
import type { SocketStream } from '@fastify/websocket';
import type Protocol from 'devtools-protocol';
import Redis from 'ioredis';
import {
  ServerlessEventEnum,
  ServerlessFuncLogEventParams,
} from '@mini_faas_worker/common';
import { Deployment } from '@mini_faas_worker/types';
import { v4 as uuidv4 } from 'uuid';
import fetch from 'node-fetch';

// FIXME: 临时存储 deploymentId 与 debuggerId 的映射关系
const debuggerIdDeploymentIdMap = new Map<string, string>();
const debuggerIdSocketMap = new Map<string, SocketStream>();

interface DevtoolsClientRequest<T = any> {
  id: number;
  method: string;
  params: T;
}

interface DebuggerReponse<T = any> {
  id: number;
  result: T;
}

interface IQuery_DeploymentDetail {
  deploymentId: string;
}

// temp mock
function generateConsoleApiCalledEvent(logLevel: string, logArgs: any[]) {
  const consoleType =
    logLevel as unknown as Protocol.Runtime.ConsoleAPICalledEventType;

  const argsArr = logArgs.map(args => {
    const type = typeof args;

    const obj: Protocol.Runtime.RemoteObject = {
      type,
      value: args,
    };
    if (type === 'number') {
      obj.description = args.toString();
    }
    return obj;
  });

  const event: Protocol.Runtime.ConsoleAPICalledEvent = {
    type: consoleType,
    args: argsArr,
    // args: [
    //   { type: 'string', value: 'count' },
    //   { type: 'number', value: 0, description: '0' },
    // ],
    executionContextId: 1,
    timestamp: Date.now(),
    // stackTrace: {
    //   callFrames: [
    //     {
    //       functionName: '',
    //       scriptId: '79',
    //       url: 'file:///Users/lilonglong/Desktop/long_git/chrome-devtools-analysis/for-inspect.js',
    //       lineNumber: 1,
    //       columnNumber: 8,
    //     },
    //   ],
    // },
  };

  return {
    method: 'Runtime.consoleAPICalled',
    params: event,
  };
}

/**
 * 订阅 redis 消息
 * @param {Redis} redis
 */
function initRedisPubsub() {
  const redis = new Redis();
  redis.subscribe(ServerlessEventEnum.FuncLogEvent, (err, count) => {
    if (err) {
      console.error('redis pubsub error', err);
    }
  });

  redis.on('message', (channel, message) => {
    console.log(`gateway redis: Received ${message} from ${channel}`);
    try {
      /** serverless 函数打印日志事件 */
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
      }
    } catch (error) {
      console.error('gateway debugger-service error:', error);
    }
  });
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
  initRedisPubsub();

  /**
   * devtools websocket 服务
   */
  fastify.get(
    '/debugger/:debuggerSessionId',
    {
      websocket: true,
    },
    (connection, req) => {
      console.log('--------req.params', req.params);

      // 拿到 debuggerSessionId
      const { debuggerSessionId } = req.params as { debuggerSessionId: string };
      if (!debuggerSessionId) {
        connection.socket.close();
      }

      debuggerIdSocketMap.set(debuggerSessionId, connection);

      connection.socket.on('message', async message => {
        console.log('gateway debbuger receive message:', message.toString());
        try {
          const messageObj = JSON.parse(
            message.toString()
          ) as DevtoolsClientRequest;
          // 直接返回空数据即可
          const resp: DebuggerReponse = {
            id: messageObj.id,
            result: {},
          };
          connection.socket.send(JSON.stringify(resp));
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

      const deployment = await fetch(
        `http://localhost:3005/findDeploymentById?deploymentId=${deploymentId}`,
        {
          method: 'GET',
        }
      ).then(res => res.json as unknown as Deployment);

      const debuggerSessionId = uuidv4();
      // FIXME 临时方案
      debuggerIdDeploymentIdMap.set(debuggerSessionId, deployment.id);
      return { debuggerSessionId };
    }
  );
}
