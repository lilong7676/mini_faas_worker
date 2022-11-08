async function readdir(...args) {
  // @ts-expect-error $0 is not defined
  const result = await $0.apply(undefined, ['readdir', ...args], {
    result: { promise: true, copy: true },
    arguments: { copy: true },
  });
  return result;
}

async function readFile(...args) {
  // @ts-expect-error $0 is not defined
  const result = await $0.apply(undefined, ['readFile', ...args], {
    result: { promise: true, copy: true },
    arguments: { copy: true },
  });
  return result;
}

// Object.keys(require('fs').promises)
// [
//   'access',   'copyFile',  'cp',
//   'open',     'opendir',   'rename',
//   'truncate', 'rm',        'rmdir',
//   'mkdir',    'readdir',   'readlink',
//   'symlink',  'lstat',     'stat',
//   'link',     'unlink',    'chmod',
//   'lchmod',   'lchown',    'chown',
//   'utimes',   'lutimes',   'realpath',
//   'mkdtemp',  'writeFile', 'appendFile',
//   'readFile', 'watch',     'constants'
// ]

const fs = {
  readdir,
  readFile,
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.fs = fs;
