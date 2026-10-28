const appPorts = new Map();
const sitePorts = new Map();
const sceneByTab = new Map();
const mediaCommands = new Set(['PLAY_PAUSE', 'SEEK_FORWARD', 'SEEK_BACK', 'VOLUME_UP', 'VOLUME_DOWN', 'STANDBY']);
const rotateCommands = new Set(['ROTATE_FORWARD', 'ROTATE_BACK']);

function tabIdOf(port) { return port.sender?.tab?.id; }
function sendApp(tabId, message) {
  const port = appPorts.get(tabId);
  if (port) { try { port.postMessage(message); } catch { appPorts.delete(tabId); } }
}
function sceneForUrl(url) {
  try {
    const host = new URL(url).hostname;
    if (host === 'sohu.com' || host.endsWith('.sohu.com')) return 'web';
    if (host === 'www.bilibili.com' || host === 'player.bilibili.com') return 'video';
  } catch {}
  return null;
}
function framesFor(tabId, scene) {
  const frames = sitePorts.get(tabId);
  return frames ? [...frames.values()].filter(frame => frame.scene === scene) : [];
}
function mainPageFor(tabId, scene) {
  const frames = framesFor(tabId, scene);
  const preferredHost = scene === 'web' ? 'www.sohu.com' : 'www.bilibili.com';
  return frames
    .sort((a, b) => Number(new URL(b.url).hostname === preferredHost) - Number(new URL(a.url).hostname === preferredHost) || a.frameId - b.frameId)[0] || null;
}
function mediaPageFor(tabId, scene) {
  return framesFor(tabId, scene)
    .filter(frame => frame.state?.hasVideo)
    .sort((a, b) => Number(!!b.state?.hasMedia) - Number(!!a.state?.hasMedia) || Number(new URL(b.url).hostname === 'player.bilibili.com') - Number(new URL(a.url).hostname === 'player.bilibili.com'))[0] || null;
}
function mergedState(tabId, scene) {
  const main = mainPageFor(tabId, scene)?.state;
  const media = mediaPageFor(tabId, scene)?.state;
  if (!main) return media;
  if (!media || mediaPageFor(tabId, scene) === main || main.focusMode !== 'player') return main;
  return { ...main, hasVideo: true, playing: media.playing, progress: media.progress, duration: media.duration, volume: media.volume };
}
function publishStatus(tabId, scene = sceneByTab.get(tabId)) {
  if (scene) sceneByTab.set(tabId, scene);
  sendApp(tabId, { type: 'STATUS', scene, connected: !!(scene && mainPageFor(tabId, scene)) });
  const state = scene && mergedState(tabId, scene);
  if (state) sendApp(tabId, { type: 'STATE', scene, state });
}
function targetFor(tabId, scene, command) {
  const main = mainPageFor(tabId, scene);
  if (!main) return null;
  if (mediaCommands.has(command)) {
    if (command === 'STANDBY') return mediaPageFor(tabId, scene) || main;
    return main.state?.focusMode === 'player' ? (mediaPageFor(tabId, scene) || main) : main;
  }
  if (rotateCommands.has(command) && main.state?.focusMode === 'player') return mediaPageFor(tabId, scene) || main;
  return main;
}

chrome.runtime.onConnect.addListener(port => {
  const tabId = tabIdOf(port);
  if (tabId === undefined) return;
  if (port.name === 'timeecho-app') {
    appPorts.set(tabId, port);
    publishStatus(tabId);
    port.onMessage.addListener(message => {
      if (message?.type === 'CHECK' && ['web', 'video'].includes(message.scene)) {
        publishStatus(tabId, message.scene);
        return;
      }
      if (message?.type !== 'COMMAND' || typeof message.id !== 'string' || !['web', 'video'].includes(message.scene)) return;
      sceneByTab.set(tabId, message.scene);
      const target = targetFor(tabId, message.scene, message.command);
      if (!target) {
        sendApp(tabId, { type: 'RESULT', id: message.id, ok: false, detail: `未连接${message.scene === 'web' ? '搜狐' : 'Bilibili'}页面；请在安装扩展的 Chrome 中刷新演示。` });
        return;
      }
      try { target.port.postMessage({ type: 'COMMAND', id: message.id, scene: message.scene, command: message.command }); }
      catch { sendApp(tabId, { type: 'RESULT', id: message.id, ok: false, detail: '网页连接已断开，请刷新当前场景。' }); }
    });
    port.onDisconnect.addListener(() => {
      if (appPorts.get(tabId) === port) appPorts.delete(tabId);
      sceneByTab.delete(tabId);
    });
    return;
  }
  if (port.name !== 'timeecho-site') return;
  const frameId = port.sender?.frameId ?? 0;
  const frame = { port, frameId, url: port.sender?.url || '', scene: sceneForUrl(port.sender?.url || ''), state: undefined };
  if (!frame.scene) return;
  if (!sitePorts.has(tabId)) sitePorts.set(tabId, new Map());
  sitePorts.get(tabId).set(frameId, frame);
  if (!sceneByTab.has(tabId)) sceneByTab.set(tabId, frame.scene);
  publishStatus(tabId);
  port.onMessage.addListener(message => {
    if (message?.type === 'STATE' && message.state) {
      frame.state = message.state;
      if (!sceneByTab.has(tabId)) sceneByTab.set(tabId, frame.scene);
      if (sceneByTab.get(tabId) === frame.scene) {
        const state = mergedState(tabId, frame.scene);
        if (state) sendApp(tabId, { type: 'STATE', scene: frame.scene, state });
      }
    }
    if (message?.type === 'RESULT') {
      if (message.state) frame.state = message.state;
      if (sceneByTab.get(tabId) === frame.scene) sendApp(tabId, { ...message, state: mergedState(tabId, frame.scene) });
    }
  });
  port.onDisconnect.addListener(() => {
    const frames = sitePorts.get(tabId);
    if (frames?.get(frameId) === frame) frames.delete(frameId);
    if (!frames?.size) sitePorts.delete(tabId);
    publishStatus(tabId);
  });
});
