/* Generic DOM adapter: no calls into a page-specific content API. */
(() => {
 const session=new URLSearchParams(location.search).get('session')||'',storageKey='timeecho-web-trail-'+session;
 const pageURL=new URL(location.href);pageURL.hash='';const url=pageURL.href;
 let trail=[];try{trail=JSON.parse(sessionStorage.getItem(storageKey)||'[]');}catch{}
 if(trail.at(-1)?.url!==url)trail.push({url,scroll:0});
 sessionStorage.setItem(storageKey,JSON.stringify(trail));
 let focus=null,reading=true,editing=false,epoch=Date.now(),bridge,toastTimer,navigating=false;
 const visible=el=>!el.disabled&&!el.closest('[hidden],[inert],[aria-hidden="true"]')&&el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden';
 const items=()=>[...document.querySelectorAll('a[href],button,input:not([type=hidden]):not([type=file]),select,textarea,summary,[tabindex]:not([tabindex="-1"])')].filter(visible);
 function saveScroll(){if(navigating)return;trail[trail.length-1].scroll=scrollY;sessionStorage.setItem(storageKey,JSON.stringify(trail));}
 function notice(text){let el=document.getElementById('webRemoteToast');if(!el){el=document.createElement('div');el.id='webRemoteToast';el.setAttribute('role','status');document.body.append(el);}el.textContent=text;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.remove(),1800);return text;}
 function mark(el){document.querySelectorAll('.remote-focus').forEach(x=>x.classList.remove('remote-focus'));focus=el;reading=false;editing=false;if(el){el.classList.add('remote-focus');el.focus({preventScroll:true});el.scrollIntoView({block:'nearest',inline:'nearest'});}return notice('选中：'+label(el));}
 function label(el){return el?(el.getAttribute('aria-label')||el.getAttribute('placeholder')||el.textContent.trim()||el.tagName).slice(0,55):'正文阅读';}
 function sequential(delta){const list=items();if(!list.length)return notice('当前页面无可操作控件');const i=list.indexOf(focus);return mark(list[Math.max(0,Math.min(list.length-1,i<0?(delta>0?0:list.length-1):i+delta))]);}
 function scrollPage(delta){reading=true;focus?.classList.remove('remote-focus');focus=null;editing=false;window.scrollBy({top:delta*innerHeight*.7,behavior:'instant'});return notice(delta>0?'向下阅读':'向上阅读');}
 function direction(dir){
  if(reading||!focus){if(dir==='UP'||dir==='DOWN')return scrollPage(dir==='UP'?-1:1);return sequential(dir==='LEFT'?-1:1);}
  const r=focus.getBoundingClientRect(),cx=r.x+r.width/2,cy=r.y+r.height/2;
  const candidates=items().filter(el=>el!==focus).map(el=>{const q=el.getBoundingClientRect(),dx=q.x+q.width/2-cx,dy=q.y+q.height/2-cy;const forward={UP:-dy,DOWN:dy,LEFT:-dx,RIGHT:dx}[dir],cross=Math.abs(['UP','DOWN'].includes(dir)?dx:dy);return {el,forward,score:forward+cross*2.5};}).filter(x=>x.forward>4).sort((a,b)=>a.score-b.score);
  if(candidates.length)return mark(candidates[0].el);if(dir==='UP'||dir==='DOWN')return scrollPage(dir==='UP'?-1:1);return notice('已到控件边界');
 }
 function home(){navigating=true;sessionStorage.removeItem(storageKey);location.assign('index.html?session='+encodeURIComponent(session));return '返回网页首页';}
 function back(){if(editing){editing=false;focus?.blur();reading=true;return notice('退出文字输入，回到阅读');}if(trail.length>1){trail.pop();const previous=trail.at(-1);sessionStorage.setItem(storageKey,JSON.stringify(trail));sessionStorage.setItem(storageKey+'-restore',String(previous.scroll));navigating=true;location.replace(previous.url);return '返回上一页';}reading=true;focus?.classList.remove('remote-focus');focus=null;return notice('已在网页首页');}
 async function dispatch(type){
  if(type==='NEXT_ITEM'||type==='PREV_ITEM')return sequential(type==='NEXT_ITEM'?1:-1);
  if(type.startsWith('NAV_'))return direction(type.slice(4));
  if(type==='PAGE_UP'||type==='PAGE_DOWN')return scrollPage(type==='PAGE_UP'?-1:1);
  if(type==='FIRST_LINK')return mark(items()[0]);
  if(type==='CONFIRM'){
   if(!focus||!visible(focus))return mark(items()[0]);
   if(focus.matches('input:not([type=checkbox]):not([type=radio]),textarea')){editing=true;focus.focus();return notice('已进入文字输入，请用键盘输入；返回退出');}
   if(focus.matches('select')){focus.selectedIndex=(focus.selectedIndex+1)%focus.options.length;focus.dispatchEvent(new Event('change',{bubbles:true}));return notice('选择：'+focus.options[focus.selectedIndex].text);}
   focus.click();return notice('已执行：'+label(focus));
  }
  if(type==='BACK')return back();if(type==='HOME'||type==='RESET')return home();
  if(type==='PLAY_PAUSE'){const media=[...document.querySelectorAll('video,audio')].find(el=>!el.paused)||document.querySelector('video,audio');if(!media)return notice('当前网页没有音视频');if(media.paused)await media.play();else media.pause();return notice(media.paused?'已暂停':'正在播放');}
  if(type==='VOLUME_UP'||type==='VOLUME_DOWN'){const media=document.querySelectorAll('video,audio');if(!media.length)return notice('当前网页没有可调音频');media.forEach(el=>el.volume=Math.max(0,Math.min(1,el.volume+(type==='VOLUME_UP'?.05:-.05))));return notice('已调整网页音频音量');}
  if(type==='SCAN')return notice('模拟读到网页入口，保留当前页面');if(type==='STANDBY'){document.querySelectorAll('video,audio').forEach(el=>el.pause());return '演示待机';}if(type==='WAKE')return notice('继续浏览网页');return notice('当前网页不支持此操作');
 }
 // Keep the bridge session on same-origin navigation; never append it to external links.
 document.addEventListener('click',event=>{const a=event.target.closest('a[href]');if(!a)return;const next=new URL(a.href,location.href);if(next.origin!==location.origin)return;if(a.hash==='#top'){event.preventDefault();scrollTo({top:0,behavior:'instant'});return;}saveScroll();next.searchParams.set('session',session);a.href=next.href;},true);
 addEventListener('pagehide',saveScroll);
 const restore=sessionStorage.getItem(storageKey+'-restore');if(restore!==null){sessionStorage.removeItem(storageKey+'-restore');requestAnimationFrame(()=>scrollTo({top:Number(restore),behavior:'instant'}));}
 bridge=SceneHost.mount({scene:'web',dispatch,state:()=>({epoch,mode:'web',modeLabel:editing?'网页 · 输入模式':'普通网页 · '+(reading?'阅读':'选择'),title:document.title,index:Math.max(0,items().indexOf(focus)),total:items().length,focus:label(focus),positionLabel:'阅读 '+Math.round(scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)*100)+'%',progress:scrollY}),cleanup:()=>document.querySelectorAll('audio,video').forEach(el=>el.pause())});
})();
