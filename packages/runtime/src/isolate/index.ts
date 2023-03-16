import ivm from 'isolated-vm';
import { FUNCTION_DEFAULT_TIMEOUT } from '@mini_faas_worker/common';
import { Deployment, OnFuncLogCallback } from '@mini_faas_worker/types';
import { initRuntime } from './runtime';
import { HandlerRequest } from '..';
import { Response } from 'src/bindings/fetch/Response';

async function createIsolate(
  deployment?: Deployment,
  onFuncLogCallback?: OnFuncLogCallback
) {
  const isolate = new ivm.Isolate({
    memoryLimit: 8,
  });
  const context = await isolate.createContext();

  initRuntime(deployment, context, onFuncLogCallback);

  return {
    isolate,
    context,
  };
}

export async function getIsolate(
  deployment: Deployment | undefined,
  code: string,
  timeout = FUNCTION_DEFAULT_TIMEOUT,
  onFuncLogCallback?: OnFuncLogCallback
) {
  const newCode = `${code}
    async function masterHandler(request) {

      let response = await handler(request);

      // 如果返回的是 ReadableStream, 比如 fetch 返回的就是 ReadableStream
      // if (response.body instanceof ReadableStream) {
      //   response.isReadableStream = 1;
      // } else {
      //   response.isReadableStream = 0;
      // }

      if (!(response instanceof Response)) {
        response = new Response(response);
      }

      return response;
    }

    export { masterHandler };

`;

  const { isolate, context } = await createIsolate(
    deployment,
    onFuncLogCallback
  );
  const { handler, masterHandler } = await getHandler({
    isolate,
    context,
    code: newCode,
  });

  if (!handler || handler.typeof !== 'function') {
    throw new Error('Function did not export a handler function.');
  }

  return async (request: HandlerRequest) => {
    const response = (await masterHandler.apply(undefined, [request], {
      result: { promise: true, copy: true },
      arguments: { copy: true },
      timeout,
    })) as Response;

    return {
      isolate,
      response,
    };
  };
}

async function getHandler({
  isolate,
  context,
  code,
}: {
  isolate: ivm.Isolate;
  context: ivm.Context;
  code: string;
}) {
  const module = await isolate.compileModule(code, {
    filename: 'function-isolate.js',
  });

  await module.instantiate(context, () => {
    throw new Error(
      `Can't import module, you must bundle all your code in a single file.`
    );
  });

  await module.evaluate();

  return {
    handler: await module.namespace.get('handler', { reference: true }),
    masterHandler: await module.namespace.get('masterHandler', {
      reference: true,
    }),
  };
}
