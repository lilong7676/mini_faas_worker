/*
 * 注入到 isolate 中的 fetch
 * @Author: lilonglong
 * @Date: 2022-10-28 22:32:42
 * @Last Modified by: lilonglong
 * @Last Modified time: 2022-10-28 15:51:42
 */
import { RequestInit } from '../bindings/fetch/Request';
import { Response } from '../bindings/fetch/Response';

export async function fetch(resource: string, init: RequestInit) {
  // @ts-expect-error $0 is not defined
  const result = await $0.apply(undefined, [resource, init], {
    result: { promise: true, copy: true },
    arguments: { copy: true },
  });

  return new Response(result.body, result.options);
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.fetch = fetch;
