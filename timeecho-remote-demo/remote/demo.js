(() => {
 'use strict';
 const $=id=>document.getElementById(id),frame=$('nodeFrame'),labels={NEXT_ITEM:'下一件',PREV_ITEM:'上一件',NAV_UP:'向上',NAV_DOWN:'向下',NAV_LEFT:'向左',NAV_RIGHT:'向右',CONFIRM:'确认',BACK:'返回',PLAY_PAUSE:'播放／暂停',VOLUME_UP:'提高音量',VOLUME_DOWN:'降低音量',HOME:'作品首页',MODE_READ:'顺序阅读',MODE_SPACE:'空间观展',MENU:'目录',SCENES:'切换场景',STORY:'作品故事',SCAN:'模拟碰卡',STANDBY:'模拟待机',WAKE:'唤醒',RESET:'重置演示'};
 let ready=false,seq=0,current=null,lastSend=0,flashTimer,pending=new Map(),count=0,sleep=false,ring=null,actionTime=0;
 function feedback(title,detail){$('actionLabel').textContent=title;$('actionDetail').textContent=detail;actionTime=Date.now();$('led').classList.add('flash');clearTimeout(flashTimer);flashTimer=setTimeout(()=>$('led').classList.remove('flash'),220);}
 function log(title,detail){count++;$('eventCount').textContent=count;const li=document.createElement('li');li.textContent=`${new Date().toLocaleTimeString('zh-CN',{hour12:false})} ${title} · ${detail}`;$('events').prepend(li);while($('events').children.length>30)$('events').lastChild.remove();}
 function send(type){
  if(!ready){feedback('尚未连接','请等待作品加载完成');return;}
  if(sleep&&!['WAKE','RESET'].includes(type))return;
  const id=++seq,m={channel:'timeecho-remote-v1',type,seq:id,sentAt:Date.now(),epoch:current?.epoch};
  // HOME/RESET are recovery actions and are safe against an older focus context.
  if(['RESET','HOME','WAKE','STANDBY'].includes(type))delete m.epoch;
  pending.set(id,{type,timer:setTimeout(()=>{if(pending.has(id)){pending.delete(id);feedback('页面暂未响应','请重试，或重置演示');log(labels[type],'响应超时');}},7000)});
  frame.contentWindow.postMessage(m,location.origin);feedback(labels[type]||type,'正在执行…');
 }
 function render(s){current=s;document.body.dataset.mode=s.mode;document.body.dataset.index=String(s.index);document.body.dataset.viewer=String(s.viewer);document.body.dataset.panel=s.panel||'';document.body.dataset.story=String(s.story);document.body.dataset.volume=String(s.volume);document.body.dataset.playing=String(s.playing);$('modeLabel').textContent=s.panel?'面板 · '+({menu:'目录',scenes:'场景',media:'影音',technical:'设置'}[s.panel]||s.panel):s.viewer?'作品欣赏':s.mode==='space'?'空间观展':'顺序阅读';$('chapterLabel').textContent=s.title;$('positionLabel').textContent=`${String(s.index+1).padStart(2,'0')} / ${s.total}`;if(Date.now()-actionTime>3500)$('actionDetail').textContent=`焦点：${s.focus} · 音量 ${s.volume}%`;}
 addEventListener('message',e=>{
  const m=e.data;if(e.origin!==location.origin||e.source!==frame.contentWindow||m?.channel!=='timeecho-node-v1')return;
  if(m.type==='READY'){ready=true;$('boot').hidden=true;render(m.state);feedback('遥控已连接','从圆环滑动开始，按中央 OK 进入作品');}
  if(m.type==='STATE')render(m.state);if(m.type==='NOTICE'){feedback('播放提示',m.detail);log('播放提示',m.detail);}
  if(m.type==='ACK'&&m.status!=='pending'){
   const p=pending.get(m.seq);if(!p)return;clearTimeout(p.timer);pending.delete(m.seq);if(m.state)render(m.state);feedback(labels[p.type],m.detail);log(labels[p.type],m.detail);
   if(p.type==='STANDBY'&&m.status==='executed'){sleep=true;$('sleepOverlay').hidden=false;}
  }
 });
 frame.addEventListener('load',()=>{ready=false;frame.contentWindow.postMessage({channel:'timeecho-remote-v1',type:'HELLO'},location.origin);});
 setTimeout(()=>{if(!ready){$('boot').firstChild.textContent='作品加载时间较长，请检查本地服务后重试。';$('retry').hidden=false;}},15000);
 $('retry').onclick=()=>frame.src='node/index.html';
 document.querySelectorAll('[data-command]').forEach(b=>b.addEventListener('click',()=>{b.classList.add('pressed');setTimeout(()=>b.classList.remove('pressed'),160);send(b.dataset.command);}));
 $('reset').onclick=()=>{sleep=false;$('sleepOverlay').hidden=true;send('RESET');};
 $('wake').onclick=()=>{sleep=false;$('sleepOverlay').hidden=true;send('WAKE');};
 $('scan').onclick=()=>{feedback('正在模拟碰卡','模拟背部 NFC 区读取《光的重生》');setTimeout(()=>send('SCAN'),450);};
 $('voice').onclick=()=>{$('voiceDialog').showModal();};$('closeVoice').onclick=()=>$('voiceDialog').close();
 document.querySelectorAll('[data-voice]').forEach(b=>b.onclick=()=>{$('voiceDialog').close();send(b.dataset.voice);});
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
})();
