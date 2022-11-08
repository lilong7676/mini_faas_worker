import fs from 'node:fs';
import path from 'node:path';
import ivm from 'isolated-vm';
import { Deployment } from '@mini_faas_worker/types';
import { fetch, FetchResult } from 'src/bindings/fetch/fetch';
import { log, LogParams } from 'src/bindings/logger';
import { RequestInit } from 'src/bindings/fetch/Request';

export async function initRuntime(
  deployment: Deployment | undefined,
  context: ivm.Context
) {
  // Get a Reference{} to the global object within the context.
  const jail = context.global;

  // This makes the global object available in the context as `global`. We use `derefInto()` here
  // because otherwise `global` would actually be a Reference{} object in the new isolate.
  await jail.set('global', jail.derefInto());

  // disable eval in global
  await jail.set('eval', undefined);

  // inject fetch into global
  await mockFetch(context);

  // inject console into global
  await mockConsole(deployment, context);

  // inject fs for demo
  await mockFs(context);
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

async function mockConsole(
  deployment: Deployment | undefined,
  context: ivm.Context
) {
  const { code, filename } = readRuntimeFile('console');
  await context.evalClosure(
    code,
    [
      (args: LogParams) => {
        log(deployment, args);
      },
    ],
    {
      result: { copy: true },
      arguments: { reference: true },
      filename,
    }
  );
}

async function mockFs(context: ivm.Context) {
  const { code, filename } = readRuntimeFile('fs');
  await context.evalClosure(
    code,
    [
      async (method, ...args) => {
        return fs.promises[method].apply(undefined, args);
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
