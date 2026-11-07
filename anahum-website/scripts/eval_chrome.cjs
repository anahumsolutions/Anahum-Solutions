const http = require('http');
const { spawn } = require('child_process');

console.log('Testing browser environment...');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--disable-gpu',
  'http://localhost:4173/'
]);

setTimeout(async () => {
  try {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const tabs = JSON.parse(data);
        console.log('Opened tabs:', tabs.length);
        if (tabs[0]) {
          console.log('Page URL:', tabs[0].url);
        }
        chrome.kill();
      });
    });
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}, 2000);
