const json = JSON.stringify({
  message: 'Hello World!',
});

export async function handler(request: any) {
  // 临时模拟 setTimeout
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const fetchResult = fetch('https://www.bing.com');
  return fetchResult;
}
