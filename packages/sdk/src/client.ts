import {
  getIsolate,
  HandlerRequest,
  Response,
} from '@mini_faas_worker/runtime';
import { FUNCTION_DEFAULT_TIMEOUT } from '@mini_faas_worker/common';
import {
  Deployment,
  OnFuncLogCallback,
  MetadataInit,
} from '@mini_faas_worker/types';

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
  return invokeFunctionWithCode(undefined, code, data, metadata);
}

export async function invokeFunctionWithCode(
  deployment: Deployment | undefined,
  code: string,
  data: Buffer | undefined,
  metadata: MetadataInit,
  onFuncLogCallback?: OnFuncLogCallback
): Promise<Response> {
  let body;
  if (data instanceof Buffer) {
    body = data;
  }
  try {
    const runIsolate = await getIsolate(
      deployment,
      code,
      FUNCTION_DEFAULT_TIMEOUT,
      onFuncLogCallback
    );

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

    isolate.dispose();

    return response;
  } catch (error) {
    console.error(
      `An error occured while running the function: ${
        (error as Error).message
      }: ${(error as Error).stack}`
    );
    return new Response('');
  }
}
