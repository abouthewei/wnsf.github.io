/* Semantic remote bridge around the supplied AI music page's actual runtime. */
(() => {
 const time=t=>Number.isFinite(t)?`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`:'0:00';
 let epoch=0,focus=null,bridge,disposed=false;
 const audio=()=>document.querySelector('audio');
 const transition=()=>document.querySelector('[data-testid="music-player-transition"]');
 const silent=()=>transition()?.dataset.mode==='silent';
 function activity(){if(silent())window.onOKBtnPressed?.();}
 const controls=()=>[...document.querySelectorAll('button')].filter(el=>!el.disabled&&!el.closest('[aria-hidden="true"]')&&el.getClientRects().length);
 function select(delta){activity();const list=controls(),i=list.indexOf(focus);focus=list[Math.max(0,Math.min(list.length-1,i<0?(delta>0?0:list.length-1):i+delta))];document.querySelectorAll('.ai-remote-focus').forEach(el=>el.classList.remove('ai-remote-focus'));focus?.classList.add('ai-remote-focus');return '选中：'+(focus?.getAttribute('aria-label')||'播放控制');}
 function roll(delta){activity();if(delta>0)window.onClockwiseRoll?.();else window.onCounterClockwiseRoll?.();return delta>0?'快进，按原页面转动速度调整':'回退，按原页面转动速度调整';}
 async function dispatch(type){
  const media=audio();if(!media)return '歌曲尚未就绪';
  if(type==='NEXT_ITEM'||type==='PREV_ITEM')return roll(type==='NEXT_ITEM'?1:-1);
  if(type==='PLAY_PAUSE'){activity();if(media.paused){try{await media.play();return '正在播放《台灯下的温柔》';}catch{return '浏览器需要启用声音，请点击左侧播放后重试';}}media.pause();return '歌曲已暂停';}
  if(type==='CONFIRM'){if(focus&&controls().includes(focus)){focus.click();return '已执行：'+focus.getAttribute('aria-label');}window.onOKBtnPressed?.();return silent()?'已切换显示模式':'已发送普通／沉浸模式切换';}
  if(type==='NAV_LEFT'||type==='NAV_RIGHT')return select(type==='NAV_LEFT'?-1:1);
  if(type==='NAV_UP'||type==='NAV_DOWN')return select(type==='NAV_UP'?-1:1);
  if(type==='SEEK_FORWARD'||type==='SEEK_BACK'){activity();const label=type==='SEEK_FORWARD'?'快进 5 秒':'回退 5 秒';document.querySelector(`button[aria-label="${label}"]`)?.click();return label;}
  if(type==='IMMERSIVE'){focus=null;window.onOKBtnPressed?.();return '切换普通／沉浸视图';}
  if(type==='BACK'){focus=null;document.querySelectorAll('.ai-remote-focus').forEach(el=>el.classList.remove('ai-remote-focus'));activity();return '回到普通播放视图';}
  if(type==='VOLUME_UP'||type==='VOLUME_DOWN'){media.volume=Math.max(0,Math.min(1,media.volume+(type==='VOLUME_UP'?.05:-.05)));return '音量 '+Math.round(media.volume*100)+'%';}
  if(type==='HOME'||type==='RESET'){activity();media.pause();media.currentTime=0;focus=null;document.querySelectorAll(".ai-remote-focus").forEach(el=>el.classList.remove("ai-remote-focus"));epoch++;if(type==='RESET')media.volume=.5;return '歌曲已回到开头';}
  if(type==='SCAN')return '模拟识别《台灯下的温柔》，保留当前进度';
  if(type==='STANDBY'){media.pause();document.querySelectorAll('video').forEach(el=>el.pause());return 'AI 音乐已暂停，演示待机';}
  if(type==='WAKE'){document.querySelectorAll('video').forEach(el=>el.play().catch(()=>{}));return '已唤醒，按播放继续';}
  return '此歌曲页面不支持该操作';
 }
 const style=document.createElement('style');style.textContent='.ai-remote-focus{outline:2px solid #f8d29c!important;outline-offset:5px!important}';document.head.append(style);
 function init(){if(disposed)return;if(!audio()||typeof window.onClockwiseRoll!=='function'){setTimeout(init,80);return;}audio().volume=.5;
  bridge=SceneHost.mount({scene:'ai',dispatch,state:()=>({epoch,mode:silent()?'ai-immersive':'ai',modeLabel:silent()?'AI 音乐 · 沉浸':'AI 音乐 · 原页面',title:'台灯下的温柔',index:0,total:1,focus:focus?.getAttribute('aria-label')||'真实歌曲播放',volume:Math.round(audio().volume*100),playing:!audio().paused,progress:audio().currentTime,positionLabel:time(audio().currentTime)+' / '+time(audio().duration)}),cleanup:()=>{disposed=true;document.querySelectorAll('audio,video').forEach(el=>el.pause());}});
 }
 init();
})();
