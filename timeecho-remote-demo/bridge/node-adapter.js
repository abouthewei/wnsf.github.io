/* Local adaptation only. Original NODE content and runtime remain unchanged. */
(() => {
  'use strict';
  const origin = location.origin, session = new URLSearchParams(location.search).get('session') || '';
  const styles = document.createElement('style');
  styles.textContent = `.remote-focus{outline:3px solid #bf7842!important;outline-offset:5px!important;border-radius:4px;box-shadow:0 0 0 7px #f4f1e888!important}.remote-art-focus{outline:3px solid #bf7842!important;outline-offset:-5px!important}.remote-volume{position:fixed;bottom:85px;left:50%;transform:translateX(-50%);z-index:99999;background:#302c25ed;color:white;padding:12px 23px;border-radius:8px;font:14px sans-serif;pointer-events:none}`;
  document.head.append(styles);
  let focus = null, zone = 'art', volume = .5, seqCache = new Map(), epoch = 0, prevContext = '', disposed = false;
  const $ = id => document.getElementById(id);
  const N = () => window.NODE;
  const visible = el => el && !el.disabled && !el.closest('[hidden],[inert]') && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden' && getComputedStyle(el).display !== 'none';
  const context = () => `${N().state.mode}:${N().state.index}:${N().state.viewer}:${N().state.panel || ''}`;
  function post(type, data = {}) { parent.postMessage({ channel: 'timeecho-node-v1',scene:'node',session, type, ...data }, origin); }
  function focusArt() {
    document.querySelectorAll('.remote-focus,.remote-art-focus').forEach(el => el.classList.remove('remote-focus','remote-art-focus'));
    focus = null; zone = 'art';
    const el = N().state.viewer ? $('viewerArt') : N().state.mode === 'space' ? document.querySelector('.exhibit.is-current .exhibit-open') : document.querySelector('#readerContent .art-button');
    if (el) el.classList.add('remote-art-focus');
  }
  function select(el) {
    if (!visible(el)) return false;
    document.querySelectorAll('.remote-focus,.remote-art-focus').forEach(x => x.classList.remove('remote-focus','remote-art-focus'));
    focus = el; zone = 'controls'; el.classList.add('remote-focus');
    el.focus({preventScroll:true});
    for(let p=el.parentElement;p&&p!==document.body;p=p.parentElement){const css=getComputedStyle(p);if(/auto|scroll/.test(css.overflowY)&&p.scrollHeight>p.clientHeight){const r=el.getBoundingClientRect(),q=p.getBoundingClientRect();if(r.top<q.top+12)p.scrollTop-=q.top+12-r.top;else if(r.bottom>q.bottom-12)p.scrollTop+=r.bottom-q.bottom+12;}}
    N().setChrome(true); return true;
  }
  function controls() {
    const s = N().state;
    const scope = s.panel ? $('panel') : s.viewer ? $('viewer') : document.body;
    return [...scope.querySelectorAll('button,select,summary,a[href]')].filter(el => visible(el) && !el.matches('[data-fullscreen],.skip') && !el.closest('[aria-hidden="true"]'));
  }
  function direction(dir) {
    const s = N().state;
    if(zone==='controls' && focus?.matches('select') && ['LEFT','RIGHT'].includes(dir)){focus.selectedIndex=Math.max(0,Math.min(focus.options.length-1,focus.selectedIndex+(dir==='RIGHT'?1:-1)));return '待确认：'+focus.options[focus.selectedIndex].text;}
    if (zone === 'art' && !s.panel) {
      if (dir === 'LEFT' || dir === 'RIGHT') { N().dispatch(dir === 'LEFT' ? 'previous' : 'next'); focusArt(); return '已切换作品'; }
      if (dir === 'DOWN' && s.mode === 'read' && !s.viewer) {
        const reader = $('reader');
        if (reader.scrollTop + reader.clientHeight < reader.scrollHeight - 5) { reader.scrollBy({top:reader.clientHeight*.65,behavior:'smooth'}); return '向下阅读正文'; }
      }
      const target = s.viewer ? $('viewerStory') : document.querySelector(`[data-mode="${s.mode}"]`);
      select(target); return '已进入工具区';
    }
    const list = controls();
    if (!visible(focus) || !list.includes(focus)) { select(list[0]); return '已选中首项'; }
    const a = focus.getBoundingClientRect(), ax = a.x+a.width/2, ay = a.y+a.height/2;
    const candidates = list.filter(el=>el!==focus).map(el=>{
      const b=el.getBoundingClientRect(),dx=b.x+b.width/2-ax,dy=b.y+b.height/2-ay;
      const forward={LEFT:-dx,RIGHT:dx,UP:-dy,DOWN:dy}[dir];
      const cross=Math.abs(['LEFT','RIGHT'].includes(dir)?dy:dx);
      return {el,forward,score:forward+cross*2.5};
    }).filter(c=>c.forward>4).sort((a,b)=>a.score-b.score);
    if(candidates.length){select(candidates[0].el);return '焦点已移动';}
    if(!s.panel && dir==='DOWN'){focusArt();return '回到作品';}
    return '已到当前区域边界';
  }
  function panelStep(delta) {
    const list=controls(); if(!list.length)return '当前面板无可选项';
    const i=list.indexOf(focus),n=Math.max(0,Math.min(list.length-1,(i<0?(delta>0?-1:1):i)+delta));select(list[n]);return '已选择面板项目';
  }
  function activeMedia() {return [...document.querySelectorAll('video,audio')].find(el=>!el.paused) || N().inlineSession?.element || $('contentMedia');}
  function applyVolume() {
    document.querySelectorAll('video,audio').forEach(el=>{el.volume=volume;});
    // SpeechSynthesisUtterance.volume only takes effect before speak().
    const label=document.createElement('div');label.className='remote-volume';label.textContent=`音量 ${Math.round(volume*100)}%`;
    const host=N().state.panel?$('panel'):N().state.viewer?$('viewer'):document.body;host.querySelectorAll('.remote-volume').forEach(el=>el.remove());host.append(label);setTimeout(()=>label.remove(),1200);
  }
  // Preserve the original BGM gain/ducking logic while adding an independent master output.
  const AC=window.AudioContext || window.webkitAudioContext;
  const audioMasters=new Map();
  if(AC?.prototype?.createGain){
    const originalCreateGain=AC.prototype.createGain;
    AC.prototype.createGain=function(...args){
      const gain=originalCreateGain.apply(this,args),connect=gain.connect;
      gain.connect=function(target,...rest){
        if(target===this.context.destination){
          let master=audioMasters.get(this.context);
          if(!master){master=originalCreateGain.call(this.context);master.gain.value=volume;connect.call(master,target);audioMasters.set(this.context,master);}
          return connect.call(this,master,...rest);
        }
        return connect.call(this,target,...rest);
      };return gain;
    };
  }
  if(window.speechSynthesis){
    const speak=speechSynthesis.speak.bind(speechSynthesis),cancel=speechSynthesis.cancel.bind(speechSynthesis),pause=speechSynthesis.pause.bind(speechSynthesis),resume=speechSynthesis.resume.bind(speechSynthesis);
    let synthesizedAudio=null;
    const pausedGetter=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(speechSynthesis),'paused')?.get;
    Object.defineProperty(speechSynthesis,'paused',{configurable:true,get:()=>synthesizedAudio?synthesizedAudio.paused:(pausedGetter?.call(speechSynthesis)||false)});
    speechSynthesis.cancel=function(){if(synthesizedAudio){synthesizedAudio.pause();synthesizedAudio.remove();synthesizedAudio=null;}cancel();};
    speechSynthesis.pause=function(){if(synthesizedAudio)synthesizedAudio.pause();else pause();};
    speechSynthesis.resume=function(){if(synthesizedAudio)synthesizedAudio.play().catch(()=>{});else resume();};
    speechSynthesis.speak=function(utterance){
      utterance.volume=volume;
      const item=N()?.mediaItems.find(m=>m.type==='narration'&&m.text===utterance.text);
      if(!item){speak(utterance);return;}
      if(synthesizedAudio){synthesizedAudio.pause();synthesizedAudio.remove();}
      const audio=document.createElement('audio');synthesizedAudio=audio;audio.dataset.generatedNarration=item.id;audio.src='../narration/'+item.id+'.wav';audio.volume=volume;audio.preload='auto';audio.setAttribute('aria-label','原文合成讲解：'+item.title);document.body.append(audio);
      audio.onended=()=>{utterance.onend?.(new Event('end'));audio.remove();if(synthesizedAudio===audio)synthesizedAudio=null;};
      audio.onerror=()=>{utterance.onerror?.(new Event('error'));post('NOTICE',{detail:'合成讲解文件未能载入，请检查本地资源'});};
      audio.play().catch(()=>{post('NOTICE',{detail:'浏览器需要先在左侧启用声音，再按遥控播放'});});
    };
  }
  document.addEventListener('play',e=>{if(e.target.matches('video,audio')){e.target.volume=volume;}},true);
  async function playPause(){
    const media=activeMedia();
    if(media?.tagName==='VIDEO'||media?.tagName==='AUDIO'){
      if(media.dataset.generatedNarration && N().inlineSession?.utterance){const wasPaused=media.paused;await N().startInlineMedia(N().inlineSession.host,N().inlineSession.media);return wasPaused?'继续播放合成讲解':'合成讲解已暂停';}
      if(!media.paused){if(N().inlineSession?.utterance)await N().startInlineMedia(N().inlineSession.host,N().inlineSession.media);else media.pause();return '已暂停';}
      try{await media.play();return '正在播放';}catch{return '浏览器阻止有声播放，请先点击左侧媒体播放按钮启用声音';}
    }
    if(speechSynthesis.speaking){if(speechSynthesis.paused){speechSynthesis.resume();return '继续讲解';}speechSynthesis.pause();return '讲解已暂停';}
    const host=N().currentInlineHost(), item=N().primaryInline(N().chapters[N().state.index]);
    if(host&&item){await N().startInlineMedia(host,item);applyVolume();const started=activeMedia();return started&&!started.paused?(item.type==='narration'?'正在播放原文合成讲解':'正在播放当前影音'):'影音已准备，请再次播放或在左侧启用声音';}
    return '当前作品无可播放影音';
  }
  function back(){
    const s=N().state;
    if(s.panel){
      if(s.panel==='media' && $('panelBody').querySelector('[data-media-library]')){$('panelBody').querySelector('[data-media-library]').click();select(controls()[0]);return '返回影音列表';}
      if(['scenes','technical'].includes(s.panel)){N().showPanel('menu');select(controls()[0]);return '返回目录';}
      N().closePanel();focusArt();return '已关闭面板';
    }
    if(zone==='controls'){focusArt();return '回到作品';}
    if(s.viewer){N().closeViewer();setTimeout(focusArt,1300);return '返回展厅原位置';}
    if(s.mode==='space'){N().setMode('read');focusArt();return '返回顺序阅读';}
    return '已在阅读根层级';
  }
  function state(){
    const n=N(),s=n.state,m=activeMedia();
    return {ready:true,epoch,mode:s.mode,index:s.index,total:n.chapters.length,title:n.chapters[s.index]?.title,viewer:s.viewer,story:s.story,panel:s.panel,scene:s.scene,sceneTitle:n.book.scenes?.[s.scene]?.title,focus:focus?.isConnected?(focus.getAttribute('aria-label')||focus.textContent.trim()).slice(0,60):'当前作品',volume:Math.round(volume*100),playing:!!(m&&!m.paused)||!!(speechSynthesis.speaking&&!speechSynthesis.paused),chapterId:n.chapters[s.index]?.id};
  }
  const allowed=new Set(['NEXT_ITEM','PREV_ITEM','NAV_UP','NAV_DOWN','NAV_LEFT','NAV_RIGHT','CONFIRM','BACK','PLAY_PAUSE','VOLUME_UP','VOLUME_DOWN','HOME','MODE_READ','MODE_SPACE','MENU','SCENES','STORY','SCAN','STANDBY','WAKE','RESET']);
  async function dispatch(type){
    const n=N(),s=n.state;
    if(type==='NEXT_ITEM'||type==='PREV_ITEM'){
      if(s.panel)return panelStep(type==='NEXT_ITEM'?1:-1);
      const old=s.index;n.dispatch(type==='NEXT_ITEM'?'next':'previous');focusArt();return old===s.index?'已到作品边界':'已切换作品';
    }
    if(type.startsWith('NAV_'))return direction(type.slice(4));
    if(type==='CONFIRM'){
      if(zone==='controls'&&visible(focus)){
        if(focus.matches('select')){focus.dispatchEvent(new Event('change',{bubbles:true}));return '已选择影音：'+focus.options[focus.selectedIndex].text;}
        const target=focus;target.click();
        if(s.panel){if(!focus?.isConnected)select(controls()[0]);}else if(!focus?.isConnected||target.matches('[data-scene],[data-go],[data-mode],[data-exhibit],[data-open]'))focusArt();
        return '已确认选择';
      }
      if(s.panel){select(controls()[0]);return '已选中面板首项';}
      if(s.viewer){n.toggleStory();return s.story?'已展开故事':'已收起故事';}
      await n.openViewer();focusArt();return '进入作品欣赏';
    }
    if(type==='BACK')return back();
    if(type==='STORY'){if(!s.viewer)await n.openViewer();n.toggleStory();focusArt();return s.story?'已展开故事':'已收起故事';}
    if(type==='PLAY_PAUSE')return playPause();
    if(type==='VOLUME_UP'||type==='VOLUME_DOWN'){volume=Math.max(0,Math.min(1,volume+(type==='VOLUME_UP'?.05:-.05)));audioMasters.forEach(g=>g.gain.value=volume);applyVolume();return `音量 ${Math.round(volume*100)}%${speechSynthesis.speaking?'；讲解音量在下次播放生效':''}`;}
    if(type==='MENU'||type==='SCENES'){n.showPanel(type==='MENU'?'menu':'scenes');select(controls()[0]);return type==='MENU'?'目录已打开':'场景选择已打开';}
    if(type==='MODE_READ'||type==='MODE_SPACE'){if(s.panel)n.closePanel();if(s.viewer)await n.closeViewer();n.setMode(type==='MODE_READ'?'read':'space');focusArt();return type==='MODE_READ'?'顺序阅读':'空间观展';}
    if(type==='HOME'||type==='RESET'){if(s.panel)n.closePanel();if(s.viewer)await n.closeViewer();n.stopInlineMedia();n.toggleSound(false);document.querySelectorAll('video,audio').forEach(el=>el.pause());speechSynthesis.cancel();n.go(0,{force:true});n.setMode('read');if(type==='RESET'){volume=.5;audioMasters.forEach(g=>g.gain.value=volume);}focusArt();return '已回到作品首页';}
    if(type==='SCAN'){if(s.index===0&&!s.viewer)return '模拟已读到《光的重生》，作品已就绪';n.showPanel('menu');select(controls()[0]);return '模拟识别同一作品，保留当前阅读进度；可从目录继续';}
    if(type==='STANDBY'){n.stopInlineMedia();n.toggleSound(false);document.querySelectorAll('video,audio').forEach(el=>el.pause());speechSynthesis.cancel();return '演示待机，影音已停止';}
    if(type==='WAKE')return '演示已唤醒';
  }
  let chain=Promise.resolve();
  addEventListener('message',e=>{
    const m=e.data;if(e.origin!==origin||e.source!==parent||m?.channel!=='timeecho-remote-v1'||m.scene!=='node'||m.session!==session)return;
    if(m.type==='DISPOSE'){disposed=true;if(N()){N().stopInlineMedia();N().toggleSound(false);}document.querySelectorAll('video,audio').forEach(el=>el.pause());speechSynthesis.cancel();return;}
    if(disposed)return;
    if(m.type==='HELLO'){if(N())post('READY',{state:state()});return;}
    if(!N())return;
    if(!allowed.has(m.type)||!Number.isSafeInteger(m.seq))return;
    if(seqCache.has(m.seq)){post('ACK',seqCache.get(m.seq));return;}
    // Reserve IDs immediately so a duplicate queued message cannot execute twice.
    seqCache.set(m.seq,{seq:m.seq,status:'pending'});
    chain=chain.then(async()=>{
      if(disposed)return;
      let result;
      if(Date.now()-m.sentAt>2500)result={seq:m.seq,status:'expired',detail:'指令已过期，未执行'};
      else if(m.epoch!==undefined&&m.epoch!==epoch)result={seq:m.seq,status:'expired',detail:'页面已切换，旧指令已丢弃'};
      else try{result={seq:m.seq,status:'executed',detail:await dispatch(m.type)};}catch(error){console.error('Remote action failed',m.type,error);result={seq:m.seq,status:'error',detail:'操作未完成，请重试'};}
      update();result.state=state();seqCache.set(m.seq,result);if(seqCache.size>150)seqCache.delete(seqCache.keys().next().value);post('ACK',result);
    });
  });
  function update(){if(disposed)return;const c=context();if(c!==prevContext){prevContext=c;epoch++;if(N().state.panel&&(!visible(focus)||!focus?.closest('#panel')))select(controls()[0]);else if(!N().state.panel&&focus&&!visible(focus))focusArt();}post('STATE',{state:state()});}
  function init(){if(disposed)return;if(!N()){setTimeout(init,50);return;}prevContext=context();focusArt();post('READY',{state:state()});setInterval(update,180);}
  init();
})();
