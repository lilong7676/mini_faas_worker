/*
 * event 定义相关
 * @Author: lilonglong
 * @Date: 2023-01-29 23:27:20
 * @Last Modified by: lilonglong
 * @Last Modified time: 2023-02-13 16:24:09
 */
import { Deployment, LogParams } from '@mini_faas_worker/types';

/**
 * Serverless redis 广播事件枚举
 */
export enum ServerlessEventEnum {
  /** 函数日志打印事件 */
  FuncLogEvent = 'FuncLogEvent',
  /** CDP消息处理结果事件 */
  CDPProcessedResult = 'CDPProcessedResult',
}

/**
 * Gateway redis 广播事件枚举
 */
export enum GatewayEventEnum {
  /** Gateway 函数部署 事件参数 */
  DeployEvent = 'GatewayDeployEvent',
}

/**
 * Serverless FunctionLogEvent 参数
 */
export interface ServerlessFuncLogEventParams {
  deployment: Deployment;
  logParams: LogParams;
  debuggerSessionId?: string;
}

export interface ServerlessCDPProcessedResultParams {
  debuggerSessionId: string;
  result: any;
}

/**
 * Gateway deploy 事件参数
 */
export type GatewayDeployEventParams = Deployment;

/**
 * 调试服务 redis 广播事件枚举
 */
export enum DebuggerEventEnum {
  /** 处理 CDP 消息 */
  CDPMessageNeedProcess = 'CDPMessageNeedProcess',
}

export interface DebuggerCDPMessageNeedProcessParams {
  debuggerSessionId: string;
  cdp: DevtoolsClientRequest;
}

export interface DevtoolsClientRequest {
  id: number;
  method: string;
  params: unknown;
}
