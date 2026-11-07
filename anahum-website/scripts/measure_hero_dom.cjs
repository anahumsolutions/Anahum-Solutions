const http = require('http');
const { spawn } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const viewports = [
  { name: '1920x992', w: 1920, h: 992 },
  { name: '1366x768', w: 1366, h: 768 },
  { name: '1024x1366', w: 1024, h: 1366 },
  { name: '390x844', w: 390, h: 844 },
];

async function measureViewport(vp, port) {
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--window-size=${vp.w},${vp.h}`,
    '--disable-gpu',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  try {
    const tab = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/json`, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const list = JSON.parse(data);
            const pageTab = list.find(t => t.type === 'page') || list[0];
            resolve(pageTab);
          } catch(e) { reject(e); }
        });
      }).on('error', reject);
    });

    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let id = 1;
    function sendCommand(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        const handler = (evt) => {
          const resp = JSON.parse(evt.data);
          if (resp.id === msgId) {
            ws.removeEventListener('message', handler);
            if (resp.error) reject(resp.error);
            else resolve(resp.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    function waitForEvent(eventName) {
      return new Promise(resolve => {
        const handler = (evt) => {
          const msg = JSON.parse(evt.data);
          if (msg.method === eventName) {
            ws.removeEventListener('message', handler);
            resolve(msg.params);
          }
        };
        ws.addEventListener('message', handler);
      });
    }

    await sendCommand('Page.enable');
    const navPromise = waitForEvent('Page.loadEventFired');
    await sendCommand('Page.navigate', { url: 'http://localhost:4173/' });
    await navPromise;
    await new Promise(r => setTimeout(r, 1000));

    const evalExpression = `(() => {
      const stage = document.querySelector('.hero__stage');
      const stageRect = stage.getBoundingClientRect();
      const hero = document.getElementById('hero');
      const heroRect = hero.getBoundingClientRect();
      
      // Effective stage unit u in px:
      // In CSS: min(100cqw / 1354, 100svh / 977)
      // When stage maintains aspect ratio:
      const u = stageRect.height / 977.0;

      const navPill = document.querySelector('.hero__nav-pill');
      const logo = document.querySelector('.hero__logo');
      const rightPill = document.querySelector('.hero__nav-pill--cta');
      const headline = document.querySelector('.hero__title');
      const btn1 = document.querySelector('.hero__btn--primary');
      const btn2 = document.querySelector('.hero__btn--secondary');

      const nodes = Array.from(document.querySelectorAll('.hero__node')).map((n, i) => {
        const r = n.getBoundingClientRect();
        return {
          index: i + 1,
          left_u: Number(((r.left - stageRect.left) / u).toFixed(1)),
          top_u: Number(((r.top - stageRect.top) / u).toFixed(1)),
          width_u: Number((r.width / u).toFixed(1)),
          height_u: Number((r.height / u).toFixed(1))
        };
      });

      return {
        viewport: { innerWidth: window.innerWidth, innerHeight: window.innerHeight },
        hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth,
        u_px: Number(u.toFixed(4)),
        stage: {
          width_px: Number(stageRect.width.toFixed(1)),
          height_px: Number(stageRect.height.toFixed(1)),
          width_u: Number((stageRect.width / u).toFixed(1)),
          height_u: Number((stageRect.height / u).toFixed(1))
        },
        logoWidth_px: logo ? Number(logo.getBoundingClientRect().width.toFixed(1)) : 0,
        nodes: nodes
      };
    })()`;

    const res = await sendCommand('Runtime.evaluate', {
      expression: evalExpression,
      returnByValue: true
    });

    ws.close();
    chrome.kill();
    return res.result.value;
  } catch (err) {
    chrome.kill();
    return { error: err.message };
  }
}

async function runAll() {
  console.log('=== MULTI-VIEWPORT VERIFICATION GATES ===');
  for (let i = 0; i < viewports.length; i++) {
    const vp = viewports[i];
    const data = await measureViewport(vp, 9225 + i);
    console.log(`\n--- Viewport ${vp.name} (${vp.w}x${vp.h}) ---`);
    console.log(JSON.stringify(data, null, 2));
  }
}

runAll();
