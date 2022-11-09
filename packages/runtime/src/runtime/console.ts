/*
 * 注入到 isolate 中的 console.log
 * @Author: lilonglong
 * @Date: 2022-10-28 22:32:42
 * @Last Modified by: lilonglong
 * @Last Modified time: 2022-11-09 14:11:21
 */

function log(...args) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  $0.apply(undefined, [{ logLevel: 'info', args }], {
    result: { copy: true },
    arguments: { copy: true },
  });
}

function warn(...args) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  $0.apply(undefined, [{ logLevel: 'warn', args }], {
    result: { copy: true },
    arguments: { copy: true },
  });
}

function error(...args) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  $0.apply(undefined, [{ logLevel: 'error', args }], {
    result: { copy: true },
    arguments: { copy: true },
  });
}

const logger = {
  log,
  warn,
  error,
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.console = logger;
