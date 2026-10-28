(() => {
  if (!['www.bilibili.com', 'player.bilibili.com'].includes(location.hostname)) return;
  const port = chrome.runtime.connect({ name: 'timeecho-bilibili' });
  let focus = null;
  const visible = el => !!(el?.getClientRects().length) && getComputedStyle(el).visibility !== 'hidden' && !el.disabled;
  const controls = () => [...document.querySelectorAll('a[href],button,input:not([type="hidden"]),[role="button"],[tabindex]:not([tabindex="-1"])')].filter(visible);
  const label = el => (el?.getAttribute('aria-label') || el?.getAttribute('title') || el?.innerText || el?.textContent || el?.tagName || '页面').trim().slice(0, 48);
  const media = () => [...document.querySelectorAll('video')].find(el => el.getClientRects().length && el.readyState > 0);
  function mark(el) {
    document.querySelectorAll('[data-timeecho-focus="true"]').forEach(node => { node.removeAttribute('data-timeecho-focus'); node.style.outline = ''; node.style.outlineOffset = ''; });
    focus = el || null;
    if (focus) { focus.dataset.timeechoFocus = 'true'; focus.style.outline = '3px solid #f2b875'; focus.style.outlineOffset = '3px'; focus.focus({ preventScroll: true }); focus.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
    return focus ? `已选中：${label(focus)}` : '已清除页面焦点';
  }
  function move(dir) {
    const list = controls();
    if (!list.length) return '当前页面没有可选控件';
    if (!focus || !list.includes(focus)) return mark(dir === -1 ? list.at(-1) : list[0]);
    const from = focus.getBoundingClientRect(), cx = from.left + from.width / 2, cy = from.top + from.height / 2;
    const candidates = list.filter(el => el !== focus).map(el => { const r = el.getBoundingClientRect(), dx = r.left+r.width/2-cx, dy = r.top+r.height/2-cy; const forward = dir === 'UP' ? -dy : dir === 'DOWN' ? dy : dir === 'LEFT' ? -dx : dx; const cross = Math.abs(dir==='UP'||dir==='DOWN' ? dx : dy); return { el, forward, score: forward + cross*2 }; }).filter(x => x.forward > 2).sort((a,b)=>a.score-b.score);
    if (candidates.length) return mark(candidates[0].el);
    if (dir==='UP'||dir==='DOWN') { scrollBy({top:dir==='UP'?-innerHeight*.7:innerHeight*.7,behavior:'smooth'}); return dir==='UP'?'向上滚动页面':'向下滚动页面'; }
    return '已到控件边界';
  }
  function state() { const v=media(); return { title:document.title, focus:label(focus), playing:!!v&&!v.paused, progress:v?.currentTime||0, duration:v?.duration||0, volume:v?Math.round(v.volume*100):undefined, scrollY, hasVideo:!!v }; }
  async function dispatch(command) {
    const v=media();
    if (command==='NAV_UP'||command==='NAV_DOWN') return move(command.slice(4));
    if (command==='NAV_LEFT'||command==='NAV_RIGHT') return move(command.slice(4));
    if (command==='NEXT_ITEM'||command==='PREV_ITEM') { const list=controls(),i=list.indexOf(focus); return mark(list[Math.max(0,Math.min(list.length-1,i<0?0:i+(command==='NEXT_ITEM'?1:-1)))]); }
    if (command==='PAGE_UP'||command==='PAGE_DOWN') { scrollBy({top:command==='PAGE_UP'?-innerHeight*.75:innerHeight*.75,behavior:'smooth'}); return command==='PAGE_UP'?'向上翻页':'向下翻页'; }
    if (command==='CONFIRM') { if(!focus||!controls().includes(focus)) return move(1); focus.click(); return `已打开：${label(focus)}`; }
    if (command==='BACK') { if(focus&&document.activeElement===focus) return mark(null); if(history.length>1){history.back();return '返回上一页';} return '已在 Bilibili 首页'; }
    if (command==='HOME') { if(location.pathname!=='/'){location.href='https://www.bilibili.com/';return '返回 Bilibili 首页';} scrollTo({top:0,behavior:'smooth'});return '回到页面顶部'; }
    if (command==='PLAY_PAUSE') { if(!v)return '当前页面还没有打开视频，请先选择一个视频'; if(v.paused){try{await v.play();return '视频正在播放';}catch{return '浏览器阻止自动播放，请点击 B 站播放器的播放键';}}v.pause();return '视频已暂停'; }
    if (command==='SEEK_FORWARD'||command==='SEEK_BACK') { if(!v)return '当前页面还没有打开视频'; v.currentTime=Math.max(0,Math.min(v.duration||Infinity,v.currentTime+(command==='SEEK_FORWARD'?5:-5))); return command==='SEEK_FORWARD'?'视频前进 5 秒':'视频回退 5 秒'; }
    if (command==='VOLUME_UP'||command==='VOLUME_DOWN') { if(!v)return '当前页面还没有打开视频';v.volume=Math.max(0,Math.min(1,v.volume+(command==='VOLUME_UP'?.05:-.05)));return `音量 ${Math.round(v.volume*100)}%`; }
    if (command==='STANDBY') { document.querySelectorAll('video').forEach(x=>x.pause());return '已暂停页面视频'; }
    if(command==='WAKE')return '已唤醒，请按播放继续';
    return 'Bilibili 当前页面不支持此操作';
  }
  port.onMessage.addListener(async message => {
    if (message?.type==='COMMAND') { let detail,ok=true; try{detail=await dispatch(message.command);}catch(error){ok=false;detail='操作失败：'+String(error?.message||error);} port.postMessage({type:'RESULT',id:message.id,ok,detail,state:state()}); }
    if (message?.type==='PING') port.postMessage({type:'STATE',state:state()});
  });
  port.postMessage({type:'STATE',state:state()});
  setInterval(()=>port.postMessage({type:'STATE',state:state()}),1000);
})();
