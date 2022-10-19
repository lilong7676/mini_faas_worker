const json = JSON.stringify({
  message: 'Hello World!',
});

export async function handler(request: any) {
  // 临时模拟 setTimeout
  function myTimeout(fun, milisecs) {
    const nowT = Date.now();
    while (Date.now() < nowT + milisecs) {
      continue;
    }
    fun();
  }

  return new Promise(resolve => {
    myTimeout(() => {
      resolve(json);
    }, 20);
  });
}
