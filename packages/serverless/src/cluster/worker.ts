import process from 'node:process';

export default async function worker() {
  // 通知 master 已就绪
  process.send?.({ cmd: 'ok' });
}
