/*
 * 记录函数产生的日志
 * @Author: lilonglong
 * @Date: 2022-11-09 22:22:35
 * @Last Modified by: lilonglong
 * @Last Modified time: 2022-11-09 15:07:50
 */
import path from 'path';
import { createLogger, format, transports } from 'winston';
import { OnFuncLogCallback } from '@mini_faas_worker/types';

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

export const onFuncLog: OnFuncLogCallback = async (deployment, params) => {
  const { id } = deployment;
  const { logLevel, args } = params;

  logger.log({
    level: logLevel,
    message: args.join(' '),
    deploymentId: id,
  });
};
``;
