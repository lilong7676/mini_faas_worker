/*
 * event 定义相关
 * @Author: lilonglong
 * @Date: 2023-01-29 23:27:20
 * @Last Modified by: lilonglong
 * @Last Modified time: 2023-01-30 11:08:01
 */
import { Deployment, LogParams } from '@mini_faas_worker/types';

/**
 * Serverless redis 广播事件枚举
 */
export enum ServerlessEventEnum {
  FuncLogEvent = 'FuncLogEvent',
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

/**
 * Gateway deploy 事件参数
 */
export type GatewayDeployEventParams = Deployment;
