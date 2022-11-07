/*
 * 注入到 isolate 中的 console.log
 * @Author: lilonglong
 * @Date: 2022-10-28 22:32:42
 * @Last Modified by: lilonglong
 * @Last Modified time: 2022-11-03 15:05:27
 */

function log(...args) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  $0.apply(undefined, [{ logLevel: 0, args }], {
    result: { copy: true },
    arguments: { copy: true },
  });
}

function warn(...args) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  $0.apply(undefined, [{ logLevel: 1, args }], {
    result: { copy: true },
    arguments: { copy: true },
  });
}

function error(...args) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  $0.apply(undefined, [{ logLevel: 2, args }], {
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
