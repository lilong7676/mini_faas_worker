// worker
export async function handler(request) {
  const json = JSON.stringify({ hello: 123 });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return new Response(json, {
    headers: { 'content-type': 'application/json' },
  });
}
