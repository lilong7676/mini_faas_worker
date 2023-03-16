export interface ResponseInit {
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
  url?: string;
}

export class Response {
  body: string | Uint8Array;
  headers: Record<string, string>;
  ok = true;
  status = 200;
  statusText = 'OK';
  url: string;

  constructor(body: string | Uint8Array, options?: ResponseInit) {
    this.body = body;

    this.headers = options?.headers || {};

    if (options?.status) {
      this.ok = options.status >= 200 && options.status < 300;
    } else {
      this.ok = true;
    }

    this.status = options?.status || 200;
    this.statusText = options?.statusText || 'OK';
    this.url = options?.url || '';
  }

  async text(): Promise<string> {
    if (this.body instanceof Uint8Array) {
      throw new Error('Cannot read text from Uint8Array');
    }

    return this.body;
  }

  async json<T>(): Promise<T> {
    if (this.body instanceof Uint8Array) {
      /**
       * Converting between strings and ArrayBuffers
       * https://stackoverflow.com/a/72105571/11825450
       */
      const bodyStr = String.fromCharCode(...this.body);
      try {
        const json = JSON.parse(JSON.stringify(bodyStr));

        return json;
      } catch (error) {
        throw new Error('not a json!');
      }
    }

    return JSON.parse(this.body);
  }
}
