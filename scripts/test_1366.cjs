const { spawn } = require('child_process')
const http = require('http')

async function test1366() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  const port = 9240
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--window-size=1366,768',
    '--disable-gpu',
    'about:blank',
  ])
  await new Promise((r) => setTimeout(r, 1500))
  http.get('http://127.0.0.1:' + port + '/json', (res) => {
    let d = ''
    res.on('data', (c) => (d += c))
    res.on('end', () => {
      const list = JSON.parse(d)
      const ws = new WebSocket(list[0].webSocketDebuggerUrl)
      ws.onopen = async () => {
        let id = 1
        function send(m, p = {}) {
          return new Promise((res) => {
            const mid = id++
            const h = (e) => {
              const r = JSON.parse(e.data)
              if (r.id === mid) {
                ws.removeEventListener('message', h)
                res(r.result)
              }
            }
            ws.addEventListener('message', h)
            ws.send(JSON.stringify({ id: mid, method: m, params: p }))
          })
        }
        await send('Page.enable')
        await send('Page.navigate', { url: 'http://localhost:4173/' })
        await new Promise((r) => setTimeout(r, 1200))
        const evalRes = await send('Runtime.evaluate', {
          expression: `(() => {
            const stage = document.querySelector('.hero__stage');
            const r = stage.getBoundingClientRect();
            const u = r.height / 977.0;
            return {
              innerWidth: window.innerWidth,
              innerHeight: window.innerHeight,
              hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth,
              stageWidth_px: r.width,
              stageHeight_px: r.height,
              stageWidth_u: r.width / u,
              stageHeight_u: r.height / u
            };
          })()`,
          returnByValue: true,
        })
        console.log('1366x768 evaluation:', evalRes.result ? evalRes.result.value : evalRes)
        ws.close()
        chrome.kill()
      }
    })
  })
}
test1366()
