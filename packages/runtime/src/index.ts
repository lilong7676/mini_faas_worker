export type HandlerRequest = {
  input: string;
  options: {
    method: string;
    headers: Record<string, string | string[] | undefined>;
    body?: string;
  };
};

export { getIsolate } from './isolate';
