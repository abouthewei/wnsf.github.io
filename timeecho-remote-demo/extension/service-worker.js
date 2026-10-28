const appPorts = new Map();
const biliPorts = new Map();
const mediaCommands = new Set(['PLAY_PAUSE', 'SEEK_FORWARD', 'SEEK_BACK', 'VOLUME_UP', 'VOLUME_DOWN', 'STANDBY']);

function tabIdOf(port) { return port.sender?.tab?.id; }
function sendApp(tabId, message) {
  const port = appPorts.get(tabId);
  if (port) { try { port.postMessage(message); } catch { appPorts.delete(tabId); } }
}
function framesFor(tabId) {
  const frames = biliPorts.get(tabId);
  return frames ? [...frames.values()] : [];
}
function mainPageFor(tabId) {
  return framesFor(tabId).find(frame => frame.url.startsWith('https://www.bilibili.com/')) || null;
}
function mediaPageFor(tabId) {
  return framesFor(tabId)
    .filter(frame => frame.state?.hasVideo)
    .sort((a, b) => Number(b.url.startsWith('https://player.bilibili.com/')) - Number(a.url.startsWith('https://player.bilibili.com/')))[0] || null;
}
function mergedState(tabId) {
  const main = mainPageFor(tabId)?.state;
  const media = mediaPageFor(tabId)?.state;
  if (!main) return media || undefined;
  if (!media) return main;
  return { ...main, hasVideo: true, playing: media.playing, progress: media.progress, duration: media.duration, volume: media.volume };
}
function publishStatus(tabId) {
  sendApp(tabId, { type: 'STATUS', connected: !!mainPageFor(tabId) });
  const state = mergedState(tabId);
  if (state) sendApp(tabId, { type: 'STATE', state });
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
      const target = mediaCommands.has(message.command) ? (mediaPageFor(tabId) || mainPageFor(tabId)) : mainPageFor(tabId);
      if (!target) {
        sendApp(tabId, { type: 'RESULT', id: message.id, ok: false, detail: '未检测到当前标签页的 Bilibili 页面，请刷新场景或重新载入扩展。' });
        return;
      }
      try { target.port.postMessage({ type: 'COMMAND', id: message.id, command: message.command }); }
      catch { sendApp(tabId, { type: 'RESULT', id: message.id, ok: false, detail: 'Bilibili 页面连接已断开。' }); }
    });
    port.onDisconnect.addListener(() => { if (appPorts.get(tabId) === port) appPorts.delete(tabId); });
    return;
  }
  if (port.name === 'timeecho-bilibili') {
    const frameId = port.sender?.frameId ?? 0;
    if (!biliPorts.has(tabId)) biliPorts.set(tabId, new Map());
    const frame = { port, url: port.sender?.url || '', state: undefined };
    biliPorts.get(tabId).set(frameId, frame);
    publishStatus(tabId);
    port.onMessage.addListener(message => {
      if (message?.type === 'STATE' && message.state) {
        frame.state = message.state;
        const state = mergedState(tabId);
        if (state) sendApp(tabId, { type: 'STATE', state });
      }
      if (message?.type === 'RESULT') {
        if (message.state) frame.state = message.state;
        sendApp(tabId, { ...message, state: mergedState(tabId) });
      }
    });
    port.onDisconnect.addListener(() => {
      const frames = biliPorts.get(tabId);
      if (frames?.get(frameId) === frame) frames.delete(frameId);
      if (!frames?.size) biliPorts.delete(tabId);
      publishStatus(tabId);
    });
  }
});
