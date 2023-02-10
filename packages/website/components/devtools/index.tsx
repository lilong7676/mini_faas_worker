/*
 * Chrome Devtools 简单在线调试
 * @Author: lilonglong
 * @Date: 2023-01-16 23:09:20
 * @Last Modified by: lilonglong
 * @Last Modified time: 2023-02-10 09:31:03
 */
import S from './index.module.scss';

interface IProps {
  disableInteraction?: boolean;
  debuggerSessionId: string;
}

export default function Devtools(props: IProps) {
  const { debuggerSessionId, disableInteraction } = props;
  const url = `http://127.0.0.1:3005/front_end/devtools_app.html?v8only=true&ws=127.0.0.1:3005/debugger/${debuggerSessionId}`;
  return (
    <div className={S.devtools}>
      <iframe src={url} className={S.ui}></iframe>
      <div className={disableInteraction ? S.modal : S.hide}></div>
    </div>
  );
}
