import fs from 'node:fs';
import path from 'node:path';
import ivm from 'isolated-vm';
import { fetch, FetchResult } from 'src/bindings/fetch/fetch';
import { RequestInit } from 'src/bindings/fetch/Request';

export async function initRuntime(context: ivm.Context) {
  await context.global.set('global', context.global.derefInto());
  await context.global.set('eval', undefined);
  await mockFetch(context);
}

// 注入 fetch
async function mockFetch(context: ivm.Context) {
  const { code, filename } = readRuntimeFile('fetch');
  await context.evalClosure(
    code,
    [
      async (resource: string, init?: RequestInit): Promise<FetchResult> => {
        return fetch(resource, init);
      },
    ],
    {
      result: { promise: true, reference: true },
      arguments: { reference: true },
      filename,
    }
  );
}

function readRuntimeFile(filename: string) {
  const code = fs
    .readFileSync(
      process.env.NODE_ENV === 'test'
        ? path.join(
            process.cwd(),
            'packages/runtime/dist/runtime',
            `${filename}.js`
          )
        : new URL(`runtime/${filename}.js`, import.meta.url)
    )
    .toString('utf-8')
    .replace(/^export((.|\n)*);/gm, ''); // 移除最后的 export {...}

  return {
    filename: `file:///${filename.toLowerCase()}.js`,
    code,
  };
}
