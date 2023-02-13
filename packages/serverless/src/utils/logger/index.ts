/*
 * 记录函数产生的日志
 * @Author: lilonglong
 * @Date: 2022-11-09 22:22:35
 * @Last Modified by: lilonglong
 * @Last Modified time: 2023-02-13 14:42:59
 */
import path from 'path';
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, label, printf } = format;

const myFormat = printf(
  ({ level, message, label, timestamp, deploymentId }) => {
    return `${timestamp} [${label} ${deploymentId}] ${level}: ${message}`;
  }
);

const funcLogDir = path.resolve(process.cwd(), '.logs', '.funcLogs');

export const logger = createLogger({
  format: combine(label({ label: 'deploymentId:' }), timestamp(), myFormat),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'func.log', dirname: funcLogDir }),
  ],
});
