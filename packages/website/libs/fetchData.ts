/*
 * 简单封装 fetch 常用方法
 * @Author: lilonglong
 * @Date: 2022-10-26 22:02:15
 * @Last Modified by: lilonglong
 * @Last Modified time: 2023-03-08 11:05:23
 */

import { GatewayPort } from '@mini_faas_worker/common';

const IS_DEV = process.env.NODE_ENV !== 'production';

const baseUrl = IS_DEV
  ? `http://localhost:${GatewayPort}`
  : '/mini_faas_worker/gateway';

export async function postData(url = '', data: Record<string, unknown> = {}) {
  // Default options are marked with *
  const response = await fetch(`${baseUrl}${url}`, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    // mode: 'no-cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  const resp = await response.json();
  if (response.ok) {
    return resp; // parses JSON response into native JavaScript objects
  }
  throw new Error(resp.error);
}

export async function postFormData(url = '', data: FormData) {
  const response = await fetch(`${baseUrl}${url}`, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    body: data, // body data type must match "Content-Type" header
  });
  const resp = await response.json();
  if (response.ok) {
    return resp; // parses JSON response into native JavaScript objects
  }
  throw new Error(resp.error);
}

export async function getData(url = '', query: Record<string, string> = {}) {
  const response = await fetch(
    `${baseUrl}${url}?${new URLSearchParams(query)}`,
    {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      // mode: 'no-cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    }
  );
  const resp = await response.json();
  if (response.ok) {
    return resp; // parses JSON response into native JavaScript objects
  }
  throw new Error(resp.error);
}
