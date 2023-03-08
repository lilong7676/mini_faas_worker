/*
 * Chrome Devtools 简单在线调试
 * @Author: lilonglong
 * @Date: 2023-01-16 23:09:20
 * @Last Modified by: lilonglong
 * @Last Modified time: 2023-03-08 11:05:09
 */

import { GatewayPort } from '@mini_faas_worker/common';
import S from './index.module.scss';

interface IProps {
  disableInteraction?: boolean;
  debuggerSessionId: string;
}

const IS_DEV = process.env.NODE_ENV !== 'production';

export default function Devtools(props: IProps) {
  const { debuggerSessionId, disableInteraction } = props;

  const host = IS_DEV
    ? `http://localhost:${GatewayPort}`
    : `window.location.origin/mini_faas_worker/gateway`;

  const wsUrl = IS_DEV
    ? `ws=localhost:${GatewayPort}`
    : 'wss=lilong7676.cn/mini_faas_worker/gateway/ws';

  const devtoolsPath = `/front_end/devtools_app.html?v8only=true&${wsUrl}/debugger/${debuggerSessionId}`;

  const url = `${host}${devtoolsPath}`;
  return (
    <div className={S.devtools}>
      <iframe src={url} className={S.ui}></iframe>
      <div className={disableInteraction ? S.modal : S.hide}></div>
    </div>
  );
}
