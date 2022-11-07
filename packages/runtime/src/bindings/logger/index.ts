export enum LogLevel {
  log,
  warn,
  error,
}

export interface LogParams {
  logLevel: LogLevel;
  args: any[];
}

export function log({ logLevel, args }: LogParams) {
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
