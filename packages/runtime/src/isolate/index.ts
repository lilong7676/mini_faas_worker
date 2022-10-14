import ivm from 'isolated-vm';
import { initRuntime } from './runtime';
import { HandlerRequest } from '..';

async function createIsolate() {
  const isolate = new ivm.Isolate({
    memoryLimit: 128,
  });
  const context = await isolate.createContext();

  initRuntime(context);

  return {
    isolate,
    context,
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

export async function getIsolate(code: string, timeout = 50) {
  console.log('getIsolate with code', code);

  const newCode = `${code}
    async function masterHandler(request) {

      const response = await handler(request);

      return response;
    }

    export { masterHandler };

`;

  const { isolate, context } = await createIsolate();
  const { handler, masterHandler } = await getHandler({
    isolate,
    context,
    code: newCode,
  });

  if (!handler || handler.typeof !== 'function') {
    throw new Error('Function did not export a handler function.');
  }

  return async (request: HandlerRequest) => {
    const response = await masterHandler.apply(undefined, [request], {
      result: { promise: true, copy: true },
      arguments: { copy: true },
      timeout,
    });

    return {
      isolate,
      response,
    };
  };
}
