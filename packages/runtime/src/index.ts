import { Readable } from 'stream';

export type HandlerRequest = {
  input: string;
  options: {
    method: string;
    headers: Record<string, string | string[] | undefined>;
    body?: string | Readable;
  };
};

export { getIsolate } from './isolate';
