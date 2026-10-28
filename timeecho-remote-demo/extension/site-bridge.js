(() => {
  const host = location.hostname;
  const scene = host === 'sohu.com' || host.endsWith('.sohu.com') ? 'web' : ['www.bilibili.com', 'player.bilibili.com'].includes(host) ? 'video' : null;
  if (!scene) return;

  const port = chrome.runtime.connect({ name: 'timeecho-site' });
  const selector = 'a[href],button,input:not([type="hidden"]):not([type="file"]),select,textarea,[role="button"],[tabindex]:not([tabindex="-1"]),video[controls],audio[controls],iframe[src*="player.bilibili.com"],iframe[src*="tv.sohu.com"]';
  const marked = new WeakMap();
  let focus = null;
  let playerModeOverride = null;

  const visible = el => !!el?.getClientRects().length && getComputedStyle(el).visibility !== 'hidden' && getComputedStyle(el).display !== 'none' && !el.disabled;
  const controls = () => [...document.querySelectorAll(selector)].filter(visible);
  const playerFrame = () => [...document.querySelectorAll('iframe[src*="player.bilibili.com"],iframe[src*="tv.sohu.com"]')].find(visible);
  const media = () => [...document.querySelectorAll('video,audio')].find(el => el.getClientRects().length) || null;
  const label = el => (el?.getAttribute('aria-label') || el?.getAttribute('title') || el?.getAttribute('placeholder') || el?.innerText || el?.textContent || el?.tagName || '网页').trim().slice(0, 48);

  function isPlayerElement(el) {
    return !!el && (el.matches('video,audio,iframe[src*="player.bilibili.com"],iframe[src*="tv.sohu.com"]') || !!el.closest('[data-player],.bpx-player-container,.bilibili-player'));
  }
  function playerActive() {
    if (focus) return isPlayerElement(focus);
    if (playerModeOverride !== null) return playerModeOverride;
    if (host === 'player.bilibili.com') return !!media();
    return (scene === 'video' && location.pathname.startsWith('/video/') && !!playerFrame()) || (scene === 'web' && host !== 'www.sohu.com' && !!media());
  }
  function restoreMark(el) {
    const previous = marked.get(el);
    if (!previous) return;
    el.style.outline = previous.outline;
    el.style.outlineOffset = previous.outlineOffset;
    el.removeAttribute('data-timeecho-focus');
    marked.delete(el);
  }
  function mark(el) {
    if (focus) restoreMark(focus);
    focus = el || null;
    if (focus) {
      marked.set(focus, { outline: focus.style.outline, outlineOffset: focus.style.outlineOffset });
      focus.dataset.timeechoFocus = 'true';
      focus.style.outline = '3px solid #f2b875';
      focus.style.outlineOffset = '3px';
      try { focus.focus({ preventScroll: true }); } catch {}
      focus.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      playerModeOverride = null;
    } else if (playerActive()) {
      playerModeOverride = false;
    }
    return focus ? `已选中：${label(focus)}` : '已清除网页焦点';
  }
  function move(direction) {
    const list = controls();
    if (!list.length) return '当前页面没有可选控件';
    if (!focus || !list.includes(focus)) return mark(list[0]);
    const from = focus.getBoundingClientRect(), cx = from.left + from.width / 2, cy = from.top + from.height / 2;
    const candidates = list.filter(el => el !== focus).map(el => {
      const r = el.getBoundingClientRect(), dx = r.left + r.width / 2 - cx, dy = r.top + r.height / 2 - cy;
      const forward = direction === 'UP' ? -dy : direction === 'DOWN' ? dy : direction === 'LEFT' ? -dx : dx;
      const cross = Math.abs(direction === 'UP' || direction === 'DOWN' ? dx : dy);
      return { el, forward, score: forward + cross * 2 };
    }).filter(item => item.forward > 2).sort((a, b) => a.score - b.score);
    return candidates.length ? mark(candidates[0].el) : '已到控件边界';
  }
  function scrollPage(forward) {
    const target = document.scrollingElement;
    const distance = Math.max(240, Math.round((target?.clientHeight || innerHeight) * 0.42));
    if (target) target.scrollBy({ top: forward ? distance : -distance, behavior: 'instant' });
    else window.scrollBy({ top: forward ? distance : -distance, behavior: 'instant' });
    return forward ? '页面向下滚动' : '页面向上滚动';
  }
  function seek(forward) {
    const video = media();
    if (!video) return '播放器尚未加载';
    if (video.readyState < 1) return '播放器正在加载';
    const next = video.currentTime + (forward ? 5 : -5);
    video.currentTime = Math.max(0, Math.min(Number.isFinite(video.duration) ? video.duration : Infinity, next));
    return forward ? '快进 5 秒' : '回退 5 秒';
  }
  function state() {
    const video = media(), active = playerActive(), root = document.scrollingElement;
    const scrollMax = Math.max(1, (root?.scrollHeight || 0) - (root?.clientHeight || innerHeight));
    const progress = video?.currentTime || 0, duration = video?.duration || 0;
    return {
      title: document.title,
      focus: focus ? label(focus) : active ? '视频播放器' : '网页浏览',
      focusMode: active ? 'player' : 'browse',
      playing: !!video && !video.paused,
      progress,
      duration,
      volume: video ? Math.round(video.volume * 100) : 50,
      scrollY: root?.scrollTop || window.scrollY,
      scrollProgress: Math.round(((root?.scrollTop || window.scrollY) / scrollMax) * 100),
      hasMedia: !!video,
      hasVideo: !!video || !!playerFrame() || host === 'player.bilibili.com'
    };
  }
  async function dispatch(command) {
    if (command.startsWith('NAV_')) return move(command.slice(4));
    if (command === 'ROTATE_FORWARD' || command === 'ROTATE_BACK') {
      const forward = command === 'ROTATE_FORWARD';
      return playerActive() ? seek(forward) : scrollPage(forward);
    }
    if (command === 'NEXT_ITEM' || command === 'PREV_ITEM') {
      const list = controls(), index = list.indexOf(focus);
      return list.length ? mark(list[Math.max(0, Math.min(list.length - 1, index < 0 ? 0 : index + (command === 'NEXT_ITEM' ? 1 : -1)))]) : '当前页面没有可选控件';
    }
    if (command === 'PAGE_UP' || command === 'PAGE_DOWN') return scrollPage(command === 'PAGE_DOWN');
    if (command === 'FIRST_LINK') return mark(controls()[0] || null);
    if (command === 'CONFIRM') {
      if (!focus || !controls().includes(focus)) return mark(controls()[0] || null);
      focus.click();
      return `已执行：${label(focus)}`;
    }
    if (command === 'BACK') {
      if (playerActive()) { mark(null); playerModeOverride = false; return '已退出播放器焦点'; }
      if (focus) { mark(null); playerModeOverride = false; return '已清除网页焦点'; }
      if (history.length > 1) { history.back(); return '返回上一页'; }
      return '已在网站首页';
    }
    if (command === 'HOME') {
      const home = scene === 'web' ? 'https://www.sohu.com/' : 'https://www.bilibili.com/';
      if (location.href !== home) location.href = home;
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      return '返回网站首页';
    }
    if (command === 'PLAY_PAUSE') {
      if (!playerActive()) return '请先用方向键选择播放器';
      const video = media();
      if (!video) return '当前页面没有已加载的音视频';
      if (video.paused) { try { await video.play(); return '视频正在播放'; } catch { return '浏览器阻止自动播放，请先点击播放器'; } }
      video.pause();
      return '视频已暂停';
    }
    if (command === 'SEEK_FORWARD' || command === 'SEEK_BACK') return playerActive() ? seek(command === 'SEEK_FORWARD') : '请先用方向键选择播放器';
    if (command === 'VOLUME_UP' || command === 'VOLUME_DOWN') {
      if (!playerActive()) return '请先用方向键选择播放器';
      const video = media();
      if (!video) return '当前页面没有可调音视频';
      video.volume = Math.max(0, Math.min(1, video.volume + (command === 'VOLUME_UP' ? 0.05 : -0.05)));
      return `音量 ${Math.round(video.volume * 100)}%`;
    }
    if (command === 'STANDBY') { document.querySelectorAll('video,audio').forEach(item => item.pause()); return '已暂停页面媒体'; }
    if (command === 'WAKE') return '已唤醒';
    return `${scene === 'web' ? '搜狐' : 'Bilibili'}页面暂不支持此操作`;
  }

  port.onMessage.addListener(async message => {
    if (message?.type !== 'COMMAND' || message.scene !== scene) return;
    let detail, ok = true;
    try { detail = await dispatch(message.command); }
    catch (error) { ok = false; detail = `操作失败：${String(error?.message || error)}`; }
    port.postMessage({ type: 'RESULT', id: message.id, ok, detail, state: state() });
  });
  port.postMessage({ type: 'STATE', state: state() });
  setInterval(() => port.postMessage({ type: 'STATE', state: state() }), 1000);
})();
