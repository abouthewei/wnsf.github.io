const appPorts = new Map();
const biliPorts = new Map();

function tabIdOf(port) { return port.sender?.tab?.id; }
function sendApp(tabId, message) {
  const port = appPorts.get(tabId);
  if (port) { try { port.postMessage(message); } catch { appPorts.delete(tabId); } }
}
function biliFor(tabId) {
  const frames = biliPorts.get(tabId);
  return frames?.get(0) || (frames?.size ? [...frames.values()].at(-1) : null);
}
function publishStatus(tabId) {
  sendApp(tabId, { type: 'STATUS', connected: !!biliFor(tabId) });
}

chrome.runtime.onConnect.addListener(port => {
  const tabId = tabIdOf(port);
  if (tabId === undefined) return;
  if (port.name === 'timeecho-app') {
    appPorts.set(tabId, port);
    publishStatus(tabId);
    port.onMessage.addListener(message => {
      if (message?.type === 'CHECK') { publishStatus(tabId); return; }
      if (message?.type !== 'COMMAND' || typeof message.id !== 'string') return;
      const target = biliFor(tabId);
      if (!target) {
        sendApp(tabId, { type: 'RESULT', id: message.id, ok: false, detail: '未检测到当前标签页的 Bilibili 页面，请刷新场景或重新载入扩展。' });
        return;
      }
      try { target.postMessage({ type: 'COMMAND', id: message.id, command: message.command }); }
      catch { sendApp(tabId, { type: 'RESULT', id: message.id, ok: false, detail: 'Bilibili 页面连接已断开。' }); }
    });
    port.onDisconnect.addListener(() => { if (appPorts.get(tabId) === port) appPorts.delete(tabId); });
    return;
  }
  if (port.name === 'timeecho-bilibili') {
    const frameId = port.sender?.frameId ?? 0;
    if (!biliPorts.has(tabId)) biliPorts.set(tabId, new Map());
    biliPorts.get(tabId).set(frameId, port);
    publishStatus(tabId);
    port.onMessage.addListener(message => {
      if (message?.type === 'RESULT' || message?.type === 'STATE') sendApp(tabId, message);
    });
    port.onDisconnect.addListener(() => {
      const frames = biliPorts.get(tabId);
      if (frames?.get(frameId) === port) frames.delete(frameId);
      if (!frames?.size) biliPorts.delete(tabId);
      publishStatus(tabId);
    });
  }
});
