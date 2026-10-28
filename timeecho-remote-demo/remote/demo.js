(() => {
 'use strict';
 const $=id=>document.getElementById(id),frame=$('nodeFrame'),labels={NEXT_ITEM:'下一件',PREV_ITEM:'上一件',NAV_UP:'向上',NAV_DOWN:'向下',NAV_LEFT:'向左',NAV_RIGHT:'向右',CONFIRM:'确认',BACK:'返回',PLAY_PAUSE:'播放／暂停',VOLUME_UP:'提高音量',VOLUME_DOWN:'降低音量',HOME:'作品首页',MODE_READ:'顺序阅读',MODE_SPACE:'空间观展',MENU:'目录',SCENES:'切换场景',STORY:'作品故事',SCAN:'模拟碰卡',STANDBY:'模拟待机',WAKE:'唤醒',RESET:'重置演示'};
 const scenes={
  node:{name:'NODE',subtitle:'光的重生',src:'node/index.html',hint:'圆环逐件浏览，确认进入；四向选择工具。',note:'NODE 作品接口适配：阅读、展厅、详情与影音。',quick:[['MODE_READ','顺序阅读'],['MODE_SPACE','空间观展'],['MENU','目录'],['SCENES','场景']],voice:[['NEXT_ITEM','下一件'],['MODE_SPACE','进入空间观展'],['STORY','显示／收起故事'],['PLAY_PAUSE','播放／暂停讲解']]},
  ai:{name:'AI MUSIC',subtitle:'台灯下的温柔',src:'ai-music/index.html',hint:'圆环调节进度，确认切换沉浸模式；播放键控制歌曲。',note:'按提供的真实页面适配，保留原始歌曲、封面、背景视频和时间戳歌词。',quick:[['SEEK_BACK','回退 5 秒'],['SEEK_FORWARD','快进 5 秒'],['IMMERSIVE','沉浸模式'],['HOME','回到开头']],voice:[['PLAY_PAUSE','播放／暂停歌曲'],['SEEK_FORWARD','快进 5 秒'],['SEEK_BACK','回退 5 秒'],['IMMERSIVE','切换沉浸模式']]},
  music:{name:'MUSIC PLAYER',subtitle:'音乐播放器',src:'music/index.html',hint:'圆环选曲，确认播放；进入进度模式后环滑快进。',note:'通用音乐播放器，支持本地音频导入。预置为程序合成演示音轨。',quick:[['TRACKS','歌曲列表'],['SEEK_MODE','进度调整'],['NEXT_TRACK','下一首'],['REPEAT','循环模式']],voice:[['PLAY_PAUSE','播放／暂停音乐'],['NEXT_TRACK','下一首'],['SEEK_MODE','调整播放进度'],['TRACKS','回到歌曲列表']]},
  web:{name:'WEB',subtitle:'小红书交互示例',src:'web/index.html',hint:'圆环选择笔记或控件，确认执行；返回关闭详情。',note:'小红书本地交互示例，非官网。支持瀑布流、详情、多图及本地点赞收藏；不连接真实账号。',quick:[['PAGE_UP','向上翻页'],['PAGE_DOWN','向下翻页'],['FIRST_LINK','首个控件'],['HOME','网页首页']],voice:[['PAGE_DOWN','向下翻页'],['FIRST_LINK','选择首个控件'],['BACK','返回上一页'],['HOME','返回网页首页']]}
 };
 Object.assign(labels,{TRACKS:'歌曲列表',SEEK_MODE:'进度调整',NEXT_TRACK:'下一首',REPEAT:'循环模式',PAGE_UP:'向上翻页',PAGE_DOWN:'向下翻页',FIRST_LINK:'首个控件',SEEK_BACK:'回退 5 秒',SEEK_FORWARD:'快进 5 秒',IMMERSIVE:'沉浸模式'});
 let ready=false,seq=0,current=null,lastSend=0,flashTimer,pending=new Map(),count=0,sleep=false,ring=null,actionTime=0,activeScene='node',session='',bootTimer;
 function clearPending(){pending.forEach(p=>clearTimeout(p.timer));pending.clear();ring=null;pad?.classList.remove('dragging');}
 function loadScene(name){
  if(!scenes[name])return;
  if(ready)frame.contentWindow.postMessage({channel:'timeecho-remote-v1',type:'DISPOSE',scene:activeScene,session},location.origin);
  clearPending();ready=false;current=null;activeScene=name;session=crypto.randomUUID();sleep=false;$('sleepOverlay').hidden=true;
  const config=scenes[name];document.body.dataset.experience=name;const address=new URL(location.href);address.searchParams.set('scene',name);history.replaceState(null,'',address);
  document.querySelectorAll('button[data-experience]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.experience===name)));
  $('sceneName').textContent=config.name;$('sceneSubtitle').textContent=config.subtitle;$('sceneHint').textContent=config.hint;$('compatibilityNote').textContent=config.note;$('sourceLink').hidden=!['node','ai'].includes(name);$('sourceLink').href=name==='ai'?'https://nfc-web-pre.iwownow.com/fpm6HLBgDknscUyEy_IxrcdS':'https://nfc-project-demo.iwownow.com/demo/renaissance-journey/index.html';$('sourceLink').textContent=name==='ai'?'原始页面 ↗':'原始作品 ↗';
  $('quickActions').replaceChildren(...config.quick.map(([command,text])=>{const b=document.createElement('button');b.dataset.command=command;b.textContent=text;b.onclick=()=>send(command);return b;}));
  document.querySelector('.voice-options').replaceChildren(...config.voice.map(([command,text])=>{const b=document.createElement('button');b.textContent=text;b.onclick=()=>{$('voiceDialog').close();send(command);};return b;}));
  $('boot').hidden=false;$('retry').hidden=true;$('bootText').textContent='正在准备'+config.subtitle+'…';$('modeLabel').textContent='准备中';$('chapterLabel').textContent=config.subtitle;$('positionLabel').textContent='—';
  feedback('正在切换场景',config.subtitle);frame.title=config.subtitle+'互动页面';frame.src=config.src+'?session='+encodeURIComponent(session);
  clearTimeout(bootTimer);bootTimer=setTimeout(()=>{if(!ready){$('bootText').textContent='页面尚未连接，请重试。';$('retry').hidden=false;}},18000);
 }
 function feedback(title,detail){$('actionLabel').textContent=title;$('actionDetail').textContent=detail;actionTime=Date.now();$('led').classList.add('flash');clearTimeout(flashTimer);flashTimer=setTimeout(()=>$('led').classList.remove('flash'),220);}
 function log(title,detail){count++;$('eventCount').textContent=count;const li=document.createElement('li');li.textContent=`${new Date().toLocaleTimeString('zh-CN',{hour12:false})} ${title} · ${detail}`;$('events').prepend(li);while($('events').children.length>30)$('events').lastChild.remove();}
 function send(type){
  if(!ready){feedback('尚未连接','请等待作品加载完成');return;}
  if(sleep&&!['WAKE','RESET'].includes(type))return;
  const id=++seq,m={channel:'timeecho-remote-v1',type,seq:id,sentAt:Date.now(),epoch:current?.epoch,scene:activeScene,session};
  // HOME/RESET are recovery actions and are safe against an older focus context.
  if(['RESET','HOME','WAKE','STANDBY'].includes(type))delete m.epoch;
  pending.set(id,{type,timer:setTimeout(()=>{if(pending.has(id)){pending.delete(id);feedback('页面暂未响应','请重试，或重置演示');log(labels[type],'响应超时');}},7000)});
  frame.contentWindow.postMessage(m,location.origin);feedback(labels[type]||type,'正在执行…');
 }
 function render(s){current=s;document.body.dataset.mode=s.mode;document.body.dataset.index=String(s.index);document.body.dataset.viewer=String(!!s.viewer);document.body.dataset.panel=s.panel||'';document.body.dataset.story=String(!!s.story);document.body.dataset.volume=String(s.volume);document.body.dataset.playing=String(!!s.playing);document.body.dataset.progress=String(s.progress||0);$('modeLabel').textContent=activeScene==='node'?(s.panel?'面板 · '+({menu:'目录',scenes:'场景',media:'影音',technical:'设置'}[s.panel]||s.panel):s.viewer?'作品欣赏':s.mode==='space'?'空间观展':'顺序阅读'):s.modeLabel||scenes[activeScene].subtitle;$('chapterLabel').textContent=s.title;$('positionLabel').textContent=s.positionLabel||`${String(s.index+1).padStart(2,'0')} / ${s.total}`;if(Date.now()-actionTime>3500)$('actionDetail').textContent=`焦点：${s.focus}${s.volume!==undefined?' · 音量 '+s.volume+'%':''}`;}
 addEventListener('message',e=>{
  const m=e.data;if(e.origin!==location.origin||e.source!==frame.contentWindow||m?.channel!=='timeecho-node-v1'||m.scene!==activeScene||m.session!==session)return;
  if(m.type==='READY'){ready=true;clearTimeout(bootTimer);$('boot').hidden=true;render(m.state);feedback('遥控已连接',scenes[activeScene].hint);}
  if(m.type==='STATE')render(m.state);if(m.type==='NOTICE'){feedback('播放提示',m.detail);log('播放提示',m.detail);}
  if(m.type==='ACK'&&m.status!=='pending'){
   const p=pending.get(m.seq);if(!p)return;clearTimeout(p.timer);pending.delete(m.seq);if(m.state)render(m.state);feedback(labels[p.type],m.detail);log(labels[p.type],m.detail);
   if(p.type==='STANDBY'&&m.status==='executed'){sleep=true;$('sleepOverlay').hidden=false;}
  }
 });
 frame.addEventListener('load',()=>{frame.contentWindow.postMessage({channel:'timeecho-remote-v1',type:'HELLO',scene:activeScene,session},location.origin);});
 $('retry').onclick=()=>loadScene(activeScene);
 document.querySelectorAll('[data-command]').forEach(b=>b.addEventListener('click',()=>{b.classList.add('pressed');setTimeout(()=>b.classList.remove('pressed'),160);send(b.dataset.command);}));
 $('reset').onclick=()=>{sleep=false;$('sleepOverlay').hidden=true;send('RESET');};
 $('wake').onclick=()=>{sleep=false;$('sleepOverlay').hidden=true;send('WAKE');};
 $('scan').onclick=()=>{const captured=session;feedback('正在模拟碰卡','读取当前场景的演示入口');setTimeout(()=>{if(captured===session)send('SCAN');},450);};
 $('voice').onclick=()=>{$('voiceDialog').showModal();};$('closeVoice').onclick=()=>$('voiceDialog').close();
 document.querySelectorAll('button[data-experience]').forEach(b=>b.onclick=()=>loadScene(b.dataset.experience));
 const pad=$('touchpad');
 function point(e){const r=pad.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;return {angle:Math.atan2(y,x),radius:Math.hypot(x,y)/(r.width/2)};}
 pad.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;const p=point(e);if(p.radius<.74)return;e.preventDefault();ring={id:e.pointerId,angle:p.angle,sum:0,epoch:current?.epoch};pad.setPointerCapture(e.pointerId);pad.classList.add('dragging');});
 pad.addEventListener('pointermove',e=>{
  if(!ring||ring.id!==e.pointerId)return;const p=point(e);if(p.radius<.55){ring.angle=p.angle;ring.sum=0;return;}
  let d=p.angle-ring.angle;if(d>Math.PI)d-=Math.PI*2;if(d<-Math.PI)d+=Math.PI*2;ring.angle=p.angle;ring.sum+=d;pad.style.setProperty('--angle',`${p.angle*180/Math.PI+90}deg`);
  const step=Math.PI/5;
  if(Math.abs(ring.sum)>=step&&Date.now()-lastSend>160){if(current?.epoch!==ring.epoch){ring.sum=0;ring.epoch=current?.epoch;}else{send(ring.sum>0?'NEXT_ITEM':'PREV_ITEM');ring.sum=0;lastSend=Date.now();}}
 });
 function endRing(e){if(ring?.id===e.pointerId){ring=null;pad.classList.remove('dragging');}}
 pad.addEventListener('pointerup',endRing);pad.addEventListener('pointercancel',endRing);
 pad.addEventListener('wheel',e=>{e.preventDefault();if(Date.now()-lastSend>190){send(e.deltaY>0?'NEXT_ITEM':'PREV_ITEM');lastSend=Date.now();}},{passive:false});
 addEventListener('keydown',e=>{if($('voiceDialog').open||e.target.closest('input,textarea,select'))return;const map={ArrowLeft:'PREV_ITEM',ArrowRight:'NEXT_ITEM',ArrowUp:'NAV_UP',ArrowDown:'NAV_DOWN',Enter:'CONFIRM',Escape:'BACK',' ':'PLAY_PAUSE',Home:'HOME',m:'MENU'};if(map[e.key]){e.preventDefault();if(!e.repeat||e.key.startsWith('Arrow'))send(map[e.key]);}});
 // Expose only the semantic dispatch for development and future physical input adapters.
 window.TimeEchoDemo={send,getState:()=>current};
 const initial=new URLSearchParams(location.search).get('scene');loadScene(scenes[initial]?initial:'node');
})();
