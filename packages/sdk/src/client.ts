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

    console.time('-----sdk----- runIsolate');
    const { response, isolate } = await runIsolate(handlerRequest);

    if (!response) {
      isolate.dispose();
      throw new Error('Function did not return a response');
    }
    console.timeEnd('-----sdk----- runIsolate');
    console.log(
      '-----sdk----- runIsolate',
      'ioslate cpuTime',
      isolate.cpuTime,
      `${Number(isolate.cpuTime) / 1000000}ms`
    );
    console.log(
      '-----sdk----- runIsolate',
      'ioslate wallTime',
      isolate.wallTime,
      `${Number(isolate.wallTime) / 1000000}ms`
    );

    /**
     * https://stackoverflow.com/a/47768386/11825450
     */
    const heapStatistics = isolate.getHeapStatisticsSync();
    Object.entries(heapStatistics).forEach(([key, value]) => {
      console.log(
        `-----sdk----- runIsolate ${key}: ${value}B (${value / 1024 / 1024}MB)`
      );
    });

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
