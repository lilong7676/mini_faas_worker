import { Readable } from 'stream';
import { getIsolate, HandlerRequest } from '@mini_faas_worker/runtime';

export interface MetadataInit {
  protocol: string;
  hostname: string;
  url: string;
  method: string;
  headers: Record<string, string | string[] | undefined>;
  timeout?: number;
  requestId?: string;
}

// TODO！
async function getFunctionByName(name: string) {
  return '';
}

export async function invokeFunction(
  name: string,
  data: Buffer | undefined,
  metadata: MetadataInit
) {
  const code = await getFunctionByName(name);
  return invokeFunctionWithCode(code, data, metadata);
}

export async function invokeFunctionWithCode(
  code: string,
  data: Buffer | undefined,
  metadata: MetadataInit
) {
  let body;
  if (data instanceof Buffer) {
    body = data;
  }
  try {
    const runIsolate = await getIsolate(code);

    const handlerRequest: HandlerRequest = {
      input: metadata.protocol + '://' + metadata.hostname + metadata.url,
      options: {
        method: metadata.method,
        headers: metadata.headers,
        body,
      },
    };

    const { response, isolate } = await runIsolate(handlerRequest);

    if (!response) {
      throw new Error('Function did not return a response');
    }

    console.log('response', response);

    // 允许返回 Readable
    if (response instanceof Readable) {
      response.on('end', () => {
        isolate.dispose();
      });
    } else {
      isolate.dispose();
    }

    return response;
  } catch (error) {
    console.error(
      `An error occured while running the function: ${
        (error as Error).message
      }: ${(error as Error).stack}`
    );
  }
}
