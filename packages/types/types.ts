export interface Func {
  id: string;
  name: string;
  domains: Domain[];
  deployments: Deployment[];
  createdAt: string;
  updatedAt: string;
}

export interface Domain {
  id: string;
  functionId: string;
  domain: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deployment {
  id: string;
  functionId: string;
  trigger: Trigger;
  createdAt: string;
  updatedAt: string;
}

type Trigger = 'http' | 'event';

/**
 * 日志相关
 */
export enum LogLevel {
  info = 'info',
  warn = 'warn',
  error = 'error',
}

export interface LogParams {
  logLevel: LogLevel;
  args: any[];
}

export type OnFuncLogCallback = (
  deployment: Deployment,
  params: LogParams
) => Promise<void>;

/**
 * Function metadataInit
 */
export interface MetadataInit {
  protocol: string;
  hostname: string;
  url: string;
  method: string;
  headers: Record<string, string | string[] | undefined>;
  timeout?: number;
  requestId?: string;
}
