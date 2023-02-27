import { OnFuncLogCallback } from '@mini_faas_worker/types';
import {
  ServerlessEventEnum,
  ServerlessFuncLogEventParams,
  ServerlessCDPProcessedResultParams,
  DebuggerEventEnum,
  DebuggerCDPMessageNeedProcessParams,
  DevtoolsClientRequest,
} from '@mini_faas_worker/common';

import Redis from 'ioredis';
import { redis } from '../cluster/master';
import { logger } from '../utils/logger';
import * as objectManager from './manager/objectManager';
import * as Runtime from './domains/runtime';

const domainsSupported = {
  Runtime: {
    ...Runtime,
  },
};

export class DebuggerSession {
  private debuggerSessionId?: string;

  private static isInited = false;

  constructor(debuggerSessionId?: string) {
    this.debuggerSessionId = debuggerSessionId;
    if (!DebuggerSession.isInited) {
      initRedisPubsub();
    }
  }

  public getOnFuncLogHandler(): OnFuncLogCallback {
    return async (deployment, params) => {
      const { id } = deployment;
      const { logLevel, args } = params;
      const debuggerSessionId = this.debuggerSessionId;

      // 如果处于调试模式
      if (debuggerSessionId) {
        const argsProcessed = args.map(arg =>
          objectManager.wrap(arg, { generatePreview: true })
        );

        // 将 log 发送到在线调试模块
        try {
          const msg: ServerlessFuncLogEventParams = {
            deployment,
            debuggerSessionId,
            logParams: { logLevel, args: argsProcessed },
          };
          await redis.publish(
            ServerlessEventEnum.FuncLogEvent,
            JSON.stringify(msg)
          );
        } catch (error) {
          logger.error(error);
        }
      }
    };
  }

  public static async processCDPMethod(cdp: DevtoolsClientRequest) {
    const { id, method, params } = cdp;
    const resultMsg: any = {
      id,
    };
    const [domain, methodName] = method.split('.');
    if (domainsSupported[domain]) {
      try {
        const result =
          (await domainsSupported[domain][methodName](params)) || {};
        resultMsg.result = result;
      } catch (error) {
        if (error instanceof Error) {
          resultMsg.error = {
            message: error.message,
          };
        }
      }
    }
    return resultMsg;
  }
}

const initRedisPubsub = () => {
  const redisSub = new Redis();
  const redisPub = redisSub.duplicate();
  // 订阅 redis 消息
  redisSub.subscribe(DebuggerEventEnum.CDPMessageNeedProcess, (err, count) => {
    if (err) {
      console.error('redis pubsub error', err);
    }
  });

  redisSub.on('message', (channel, message) => {
    console.log(`redis: Received ${message} from ${channel}`);
    if (channel === DebuggerEventEnum.CDPMessageNeedProcess) {
      const { debuggerSessionId, cdp }: DebuggerCDPMessageNeedProcessParams =
        JSON.parse(message);

      DebuggerSession.processCDPMethod(cdp).then(result => {
        const resultMsg: ServerlessCDPProcessedResultParams = {
          debuggerSessionId,
          result,
        };
        redisPub.publish(
          ServerlessEventEnum.CDPProcessedResult,
          JSON.stringify(resultMsg)
        );
      });
    }
  });
};
