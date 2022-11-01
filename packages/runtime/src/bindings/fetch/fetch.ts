import https from 'node:https';
import http from 'node:http';
import { ResponseInit } from './Response';
import { RequestInit } from './Request';

export interface FetchResult {
  body: string | Buffer;
  options: ResponseInit;
}

export async function fetch(
  resource: string,
  init?: RequestInit
): Promise<FetchResult> {
  return new Promise((resolve, reject) => {
    let headers: Record<string, string> = {};

    if (init?.headers) {
      headers = init.headers;
    }

    const request = (resource.startsWith('https') ? https : http).request(
      resource,
      {
        method: init?.method || 'GET',
        headers,
        timeout: 10000,
      },
      response => {
        const data: Uint8Array[] = [];

        response.on('data', (chunk: Uint8Array) => {
          data.push(chunk);
        });

        response.on('end', () => {
          const headers: Record<string, string> = {};

          Object.entries(response.headers).forEach(([key, value]) => {
            if (value && !Array.isArray(value)) {
              headers[key] = value;
            }
          });

          resolve({
            body: Buffer.concat(data),
            options: {
              status: response.statusCode,
              statusText: response.statusMessage,
              headers,
              url: response.url,
            },
          });
        });
      }
    );

    if (init?.body) {
      request.write(init.body);
    }

    request.on('error', reject);
    request.end();
  });
}
