export interface ResponseInit {
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
  url?: string;
}

export class Response {
  body: string | Uint8Array;
  headers: Record<string, string>;
  ok: boolean;
  status: number;
  statusText: string;
  url: string;

  constructor(body: string | Uint8Array, options?: ResponseInit) {
    this.body = body;

    if (options?.headers) {
      this.headers = options.headers;
    }

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
      throw new Error('Cannot read text from Uint8Array');
    }

    return JSON.parse(this.body);
  }
}
