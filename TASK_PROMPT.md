网关同事甩过来一份半成品转发器：线上有人用换行往 Header 里塞 Host/X-Forwarded-For，还有 Connection 里点名 hop-by-hop 头被一路传到上游。你把这个浏览器里能点的小实验室补完，别用 Docker。

你要做的：
1) 打开 index.html（npm start 或 python3 -m http.server 8811 --directory .），左日志右控制；起来成功 #status=ready。
2) 实现 src/headerGuard.js：`sanitizeHeaderName(name)` / `sanitizeHeaderValue(value)` 必须拒绝 CR/LF/NUL 与空名；`assertNoCRLF(s)` 有脏字符就抛错。
3) 实现 src/hopByHop.js：`isHopByHop(name, connectionHeader)`——标准 hop-by-hop（Connection/Keep-Alive/Proxy-Authenticate/Proxy-Authorization/TE/Trailer/Transfer-Encoding/Upgrade）以及 Connection 里点名的自定义头都要识别（大小写不敏感）。
4) 实现 src/proxyBuild.js：`buildUpstreamHeaders(rawHeaders)` 清洗名字/值，丢掉 hop-by-hop，返回 `{ok: Record<string,string>, blocked:[{name,reason}]}`；同名头后者覆盖前者。
5) src/engine.js + src/ui/controls.js：Load fixtures/raw-headers.json → Inspect → Export JSON；#stats 给出 kept/blocked。
6) 别改弱 tests/*.test.js，原生 ESM。分多次短命令写文件，写完就 npm test，红了接着修到绿。
