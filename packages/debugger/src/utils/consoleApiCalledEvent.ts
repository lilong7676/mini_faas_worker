import type Protocol from 'devtools-protocol';

/**
 * 生产 consoleApiCalledEvent CDP 消息
 */
export function generateConsoleApiCalledEvent(
  logLevel: string,
  logArgs: any[]
) {
  const consoleType =
    logLevel as unknown as Protocol.Runtime.ConsoleAPICalledEventType;

  const event: Protocol.Runtime.ConsoleAPICalledEvent = {
    type: consoleType,
    args: logArgs,
    // args: [
    //   { type: 'string', value: 'count' },
    //   { type: 'number', value: 0, description: '0' },
    // ],
    executionContextId: 1,
    timestamp: Date.now(),
    // stackTrace: {
    //   callFrames: [
    //     {
    //       functionName: '',
    //       scriptId: '79',
    //       url: 'file:///Users/lilonglong/Desktop/long_git/chrome-devtools-analysis/for-inspect.js',
    //       lineNumber: 1,
    //       columnNumber: 8,
    //     },
    //   ],
    // },
  };

  return {
    method: 'Runtime.consoleAPICalled',
    params: event,
  };
}
