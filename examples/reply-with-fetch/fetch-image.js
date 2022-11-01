// worker
export async function handler(request) {
  const response = await fetch(
    'https://t7.baidu.com/it/u=1595072465,3644073269&fm=193&f=GIF'
  );
  return response;
}
