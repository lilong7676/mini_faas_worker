/*
 * 记录函数产生的日志
 * @Author: lilonglong
 * @Date: 2022-11-09 22:22:35
 * @Last Modified by: lilonglong
 * @Last Modified time: 2023-01-30 11:08:23
 */
import path from 'path';
import { createLogger, format, transports } from 'winston';
import { redis } from 'src/cluster/master';
import { OnFuncLogCallback } from '@mini_faas_worker/types';
import {
  ServerlessEventEnum,
  ServerlessFuncLogEventParams,
} from '@mini_faas_worker/common';

const { combine, timestamp, label, printf } = format;

const myFormat = printf(
  ({ level, message, label, timestamp, deploymentId }) => {
    return `${timestamp} [${label} ${deploymentId}] ${level}: ${message}`;
  }
);

const funcLogDir = path.resolve(process.cwd(), '.logs', '.funcLogs');

const logger = createLogger({
  format: combine(label({ label: 'deploymentId:' }), timestamp(), myFormat),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'func.log', dirname: funcLogDir }),
  ],
});

export const getOnFuncLogHandler = (
  debuggerSessionId?: string
): OnFuncLogCallback => {
  return async (deployment, params) => {
    const { id } = deployment;
    const { logLevel, args } = params;

    logger.log({
      level: logLevel,
      message: args.join(' '),
      deploymentId: id,
    });

    // 将 log 发送到在线调试模块
    try {
      const p: ServerlessFuncLogEventParams = {
        deployment,
        debuggerSessionId,
        logParams: params,
      };
      await redis.publish(ServerlessEventEnum.FuncLogEvent, JSON.stringify(p));
    } catch (error) {
      logger.error(error);
    }
  };
};
