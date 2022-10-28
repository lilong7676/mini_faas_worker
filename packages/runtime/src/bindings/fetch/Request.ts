export interface RequestInit {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

export class Request {
  method: string;
  headers: Record<string, string>;
  body?: string;
  url: string;

  constructor(input: string, options?: RequestInit) {
    this.method = options?.method || 'GET';

    if (options?.headers) {
      this.headers = options.headers;
    }

    this.body = options?.body;
    this.url = input;
  }

  async text(): Promise<string> {
    return this.body || '';
  }

  async json<T>(): Promise<T> {
    return JSON.parse(this.body || '{}');
  }

  async formData(): Promise<Record<string, string>> {
    // TODO
    return {};
  }
}
