(() => {
  if (window !== window.top || !location.pathname.includes('/timeecho-remote-demo/')) return;
  const CHANNEL = 'timeecho-bilibili-bridge-v1';
  let port;
  const pending = new Map();
  function frame() { return document.getElementById('nodeFrame'); }
  function sendToDemo(message) {
    frame()?.contentWindow?.postMessage({ channel: CHANNEL, ...message }, location.origin);
  }
  function connect() {
    try { port = chrome.runtime.connect({ name: 'timeecho-app' }); }
    catch { sendToDemo({ type: 'STATUS', connected: false }); return; }
    port.onMessage.addListener(message => {
      if (message?.type === 'RESULT') {
        const f = pending.get(message.id);
        if (f) { pending.delete(message.id); clearTimeout(f.timer); sendToDemo({ type: 'RESULT', id: message.id, ok: message.ok, detail: message.detail, state: message.state }); }
      } else if (message?.type === 'STATUS') sendToDemo(message);
      else if (message?.type === 'STATE') sendToDemo(message);
    });
    port.onDisconnect.addListener(() => { sendToDemo({ type: 'STATUS', connected: false }); setTimeout(connect, 1000); });
  }
  connect();
  addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== frame()?.contentWindow || event.data?.channel !== CHANNEL) return;
    if (event.data.type === 'STATUS_REQUEST') { if (port) port.postMessage({ type: 'CHECK' }); else sendToDemo({ type: 'STATUS', connected: false }); return; }
    if (event.data.type !== 'COMMAND' || typeof event.data.id !== 'string') return;
    if (!port) { sendToDemo({ type: 'RESULT', id: event.data.id, ok: false, detail: '扩展尚未连接，请刷新页面。' }); return; }
    const id = event.data.id;
    const timer = setTimeout(() => { pending.delete(id); sendToDemo({ type: 'RESULT', id, ok: false, detail: 'Bilibili 未响应，请刷新 B 站页面后重试。' }); }, 2500);
    pending.set(id, { timer });
    port.postMessage({ type: 'COMMAND', id, command: event.data.command });
  });
})();
