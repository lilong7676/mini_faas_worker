<!--
 * @Author: Longlong Li lilong7676@outlook.com
 * @Date: 2022-11-07 10:05:06
 * @LastEditors: Longlong Li lilong7676@outlook.com
 * @LastEditTime: 2022-11-23 10:52:42
 * @FilePath: /mini_faas_worker/README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
Try implement a FaaS Worker based on V8 Isolate.

*Refer to the [Lagon](https://github.com/lagonapp/lagon) implementation and thank them for their efforts.*

## ⚠️请使用nodejs 16版本及以上运行此 demo

### 运行 cli demo
```bash
$ pnpm install && pnpm run build && cd examples/reply-with-json && node ../../packages/cli/dist dev index.ts
```

### 运行完整 website demo
```bash
$ pnpm install && pnpm dev # 然后打开 http://localhost:3000/
```

运行截图：
![function list](https://raw.githubusercontent.com/lilong7676/Picture/master/blog/image/20221123105139.png)

![function detail](https://raw.githubusercontent.com/lilong7676/Picture/master/blog/image/20221123105221.png)

![function preview](https://raw.githubusercontent.com/lilong7676/Picture/master/blog/image/20221123105254.png)

![fucntion preview](https://raw.githubusercontent.com/lilong7676/Picture/master/blog/image/20221123105418.png)
