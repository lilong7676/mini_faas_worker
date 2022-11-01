// worker
export async function handler(request) {
  const json = JSON.stringify({ hello: 123 });
  return new Response(json, {
    headers: { 'content-type': 'application/json' },
  });
}
