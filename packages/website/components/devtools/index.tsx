/*
 * Chrome Devtools 简单在线调试
 * @Author: lilonglong
 * @Date: 2023-01-16 23:09:20
 * @Last Modified by: lilonglong
 * @Last Modified time: 2023-01-17 16:37:51
 */
import S from './index.module.scss';

interface IProps {
  disableInteraction?: boolean;
}

export default function Devtools(props: IProps) {
  const { disableInteraction } = props;
  const url = 'http://127.0.0.1:8080/devtools_app.html';
  return (
    <div className={S.devtools}>
      <iframe src={url} className={S.ui}></iframe>
      <div className={disableInteraction ? S.modal : S.hide}></div>
    </div>
  );
}
