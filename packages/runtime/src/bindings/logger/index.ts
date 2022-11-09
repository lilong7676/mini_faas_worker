import { Deployment, LogLevel, LogParams } from '@mini_faas_worker/types';

export function log(
  deployment: Deployment | undefined,
  { logLevel, args }: LogParams
) {
  switch (logLevel) {
    case LogLevel.info:
      return console.log.apply(undefined, args);
    case LogLevel.warn:
      return console.warn.apply(undefined, args);
    case LogLevel.error:
      return console.error.apply(undefined, args);
    default:
      break;
  }
}
