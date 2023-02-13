/*
 * 事件消息代理
 * @Author: lilonglong
 * @Date: 2023-02-13 23:05:46
 * @Last Modified by: lilonglong
 * @Last Modified time: 2023-02-13 14:20:39
 */
import { EventEmitter } from 'node:events';

class EventDelegate extends EventEmitter {
  trigger(method: string, params: any) {
    this.emit(
      'message',
      JSON.stringify({
        method,
        params,
      })
    );
  }
}

export default new EventDelegate();
