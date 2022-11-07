import { Deployment } from '@mini_faas_worker/types';

export enum LogLevel {
  log,
  warn,
  error,
}

export interface LogParams {
  logLevel: LogLevel;
  args: any[];
}

// TODO 结合 deployment 做日志存储相关
export function log(
  deployment: Deployment | undefined,
  { logLevel, args }: LogParams
) {
  console.log('---runtime log-----, deploymentId', deployment?.id);
  switch (logLevel) {
    case LogLevel.log:
      return console.log.apply(undefined, args);
    case LogLevel.warn:
      return console.warn.apply(undefined, args);
    case LogLevel.error:
      return console.error.apply(undefined, args);
    default:
      break;
  }
}
