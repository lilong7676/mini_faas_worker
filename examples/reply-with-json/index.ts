const json = JSON.stringify({
  message: 'Hello World!',
});

export function handler(request: any) {
  return json;
}
