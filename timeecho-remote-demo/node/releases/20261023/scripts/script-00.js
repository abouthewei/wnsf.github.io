'use strict';
/* Material cues stay around the image; scene adaptation only changes the rim light. */
(()=>{
const themes={
 ningxia:{name:'砂岩与胡桃木',material:'sandstone',width:13,mat:4,radius:2,colors:['#b99b73','#e5d3b0','#5e4934'],trim:'#d9c39b',paper:'#f3ead8'},
 apple:{name:'阳极氧化铝与陶瓷白',material:'aluminium',width:8,mat:3,radius:8,colors:['#b6bec4','#f2f6f8','#65727d'],trim:'#f7fbff',paper:'#f5f6f7'},
 renaissance:{name:'胡桃木与香槟金线脚',material:'carved-wood',width:18,mat:5,radius:1,colors:['#77553d','#b99363','#38281e'],trim:'#d1b078',paper:'#eee4d2'},
 kobe:{name:'碳纤维与紫金纪念边',material:'carbon',width:12,mat:3,radius:2,colors:['#443752','#75638a','#211d2a'],trim:'#d7b565',paper:'#ede8df'},
 alan:{name:'黑胶与拉丝香槟铝',material:'vinyl-metal',width:12,mat:4,radius:3,colors:['#383d42','#aab2b7','#161c22'],trim:'#cdb58e',paper:'#eee9dd'},
 shanhai:{name:'青铜、玉石与朱漆',material:'jade-bronze',width:15,mat:3,radius:4,colors:['#4c7362','#b4c9a5','#284a40'],trim:'#a77d45',paper:'#e5eddf'},
 babu:{name:'旧木与青砖',material:'weathered-wood',width:15,mat:4,radius:1,colors:['#8b765b','#b7ab91','#4e534a'],trim:'#8a9282',paper:'#ebe8db'},
 uk:{name:'橡木与亚麻纸衬',material:'oak-linen',width:12,mat:6,radius:1,colors:['#b48c5f','#e3c89d','#785836'],trim:'#f0dec0',paper:'#f3ecdf'},
 disney:{name:'珠光搪瓷',material:'pearl-enamel',width:12,mat:4,radius:13,colors:['#bfa6db','#fff4e6','#8c91c8'],trim:'#f6cfb1',paper:'#faf2fb'},
 xiaoqian:{name:'奶油木与玫瑰金',material:'cream-rose',width:10,mat:5,radius:5,colors:['#d7c4ac','#fff7e7','#ad8f7a'],trim:'#c3927e',paper:'#f9f2e7'}
};
const ids={NODE_Ningxia_RealScenes:'ningxia',NODE_Apple_Design:'apple',NODE_Renaissance_Journey:'renaissance',NODE_Kobe_Collectible:'kobe',NODE_TimeEcho_Alan:'alan',NODE_ShanHaiJing_Immersive:'shanhai',NODE_TimeEcho_Babu:'babu',NODE_TimeEcho_UK:'uk',We_had_a_magic_day_NODE:'disney',NODE_Chen_Xiaoqian:'xiaoqian'};
const rgb=h=>{const m=/^#([a-f\d]{6})$/i.exec(String(h));return m?[0,2,4].map(i=>parseInt(m[1].slice(i,i+2),16)):null};
function blend(a,b,t){const x=rgb(a),y=rgb(b);return !x||!y?a:'#'+x.map((v,i)=>Math.round(v+(y[i]-v)*t).toString(16).padStart(2,'0')).join('')}
function inferredTone(scene){const explicit=scene?.frameTone;if(['light','dark','warm','cool'].includes(explicit))return explicit;const id=String(scene?.id||'');if(/cosm|orbital|cyber|night|starlight|zhongshan|live/.test(id))return 'dark';if(/mars|pyramid|desert|ningxia|sand|heritage|court/.test(id))return 'warm';if(/coast|harbour|sea|snow|kunlun|lugu/.test(id))return 'cool';return 'light'}
function apply(book,scene){
 const requested=typeof book?.frameTheme==='string'?book.frameTheme:book?.frameTheme?.id;
 const id=themes[requested]?requested:(ids[book?.id]||'uk'),t=themes[id],root=document.documentElement,tone=inferredTone(scene);
 const dark=tone==='dark',accent=rgb(scene?.frameAccent)?scene.frameAccent:(tone==='warm'?'#c9a06c':tone==='cool'?'#8bc6cc':t.trim);
 const light=dark?'#f6f4e8':'#fffdf5',edge=dark?'#e7ede8':'#3d4a48';
 const values={
  '--frame-base-width':t.width+'px','--frame-base-mat':t.mat+'px','--frame-radius':t.radius+'px',
  '--frame-c1':blend(t.colors[0],accent,.09),'--frame-c2':blend(t.colors[1],light,dark?.17:.06),'--frame-c3':blend(t.colors[2],accent,.06),
  '--frame-trim':blend(t.trim,accent,.15),'--frame-mat':t.paper,'--frame-edge':edge,
  '--frame-rim-light':dark?'#f4fff0bd':'#fffef0a8','--frame-rim-dark':'#18252a66',
  '--frame-shadow':dark?'#020c18b8':'#11232975','--frame-scene-accent':accent,
  '--frame-keyline':dark?'#fff8ddc7':'#28352c6e','--frame-aura':dark?'#dceff52b':'#14232a12'
 };
 for(const [key,value] of Object.entries(values))root.style.setProperty(key,value);
 root.dataset.frameTheme=id;root.dataset.frameMaterial=t.material;root.dataset.frameTone=tone;
 root.dataset.frameName=t.name;
 return {theme:id,material:t.material,tone,name:t.name};
}
window.NODEFrames={apply,themes};
function boot(){try{const data=document.getElementById('book-data');if(!data)return;const b=JSON.parse(data.textContent);apply(b,b.scenes?.[0]);}catch(e){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();

'use strict';
(()=>{
const $=id=>document.getElementById(id), $$=s=>Array.from(document.querySelectorAll(s));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let book;try{book=JSON.parse($('book-data').textContent)}catch(e){book={chapters:[],assets:{},scenes:[]};}
const chapters=book.chapters||[], assets=book.assets||{}, scenes=book.scenes||[];
const reduceQuery=matchMedia('(prefers-reduced-motion: reduce)');
const state={index:0,mode:'read',scene:0,viewer:false,story:false,panel:null,sound:false,reduced:reduceQuery.matches,readerScroll:{},echo:{placed:false,index:0,detail:false,story:false,volume:30,everPlaced:false}};
const storageKey='node-reading-v1-'+(book.id||book.title);
const mediaItems=book.media||[];let activeMediaId=null,mediaLoadTicket=0,spoken=null,activeLoadedAsset=null,activeMediaScope=null;
const mediaById=id=>mediaItems.find(m=>m.id===id);
function chapterMedia(c){return (c.media||[]).map(x=>typeof x==='string'?mediaById(x):x).filter(Boolean);}
const mediaType=m=>({video:'影片',audio:'声音',embed:'影片',narration:'讲解',link:'来源'})[m.type]||'影音';
const historySession='node-'+Date.now()+'-'+Math.random().toString(36).slice(2);let historyBackPending=false,mediaDucking=false;
function pushOverlayHistory(kind){if(historyBackPending)return;try{const data={nodeSession:historySession,nodeOverlay:kind,panel:state.panel,index:state.index};if(history.state?.nodeSession===historySession&&history.state?.nodeOverlay===kind)history.replaceState(data,'');else history.pushState(data,'');}catch(e){}}
function popOverlayHistory(){try{if(!historyBackPending&&history.state?.nodeSession===historySession&&history.state?.nodeOverlay){historyBackPending=true;history.back();}}catch(e){historyBackPending=false;}}
let progressRecord=null;try{progressRecord=JSON.parse(localStorage.getItem(storageKey)||'null')}catch(e){}
let sceneLayer=0,sceneTicket=0,viewerTicket=0,lastPanelFocus=null,lastViewerFocus=null,viewerRequestedIndex=0,viewerImage=null,viewerFade=null,viewerGeometry=null,viewerCaptionIndex=-1,readerRenderedIndex=-1,toastTimer,step=500,drag=null,dragRAF=0,suppressClick=0;
let viewerClosing=false,viewerExitFromHistory=false,viewerExitTicket=0,viewerExitPromise=null,viewerMotionTicket=0,viewerMotion=[];
const resourceCache=new Map(), decoded=new Map(), invalidPreviews=new Set();
function resource(key){const value=assets[key]||key||'';if(typeof value==='object'&&value.embedded){const el=$(value.embedded);return {raw:el?.textContent||'',mime:value.mime||'application/octet-stream',encoded:true};}return {raw:String(value),encoded:false};}
function asset(key){if(resourceCache.has(key))return resourceCache.get(key);const r=resource(key);if(r.encoded&&!r.raw.trim())return '';if(!r.encoded&&!r.raw.startsWith('data:'))return r.raw;try{let raw=r.raw,mime=r.mime;if(!r.encoded){const comma=raw.indexOf(','),head=raw.slice(5,comma);mime=head.split(';')[0];if(!head.includes(';base64')){const url=URL.createObjectURL(new Blob([decodeURIComponent(raw.slice(comma+1))],{type:mime}));resourceCache.set(key,url);return url;}raw=raw.slice(comma+1);}if(!raw.trim())return '';const chunks=[];for(let start=0;start<raw.length;start+=524288){const str=atob(raw.slice(start,start+524288)),bytes=new Uint8Array(str.length);for(let n=0;n<str.length;n++)bytes[n]=str.charCodeAt(n);chunks.push(bytes);}const url=URL.createObjectURL(new Blob(chunks,{type:mime}));resourceCache.set(key,url);return url;}catch(e){return '';}}
async function mediaAsset(key,ticket){if(resourceCache.has(key))return resourceCache.get(key);const r=resource(key);if(!r.encoded)return asset(key);const chunks=[];for(let start=0;start<r.raw.length;start+=524288){if(ticket!==mediaLoadTicket)throw new Error('cancelled');const str=atob(r.raw.slice(start,start+524288)),bytes=new Uint8Array(str.length);for(let n=0;n<str.length;n++)bytes[n]=str.charCodeAt(n);chunks.push(bytes);if(start%2097152===0)await new Promise(resolve=>setTimeout(resolve,0));}if(ticket!==mediaLoadTicket)throw new Error('cancelled');const url=URL.createObjectURL(new Blob(chunks,{type:r.mime}));resourceCache.set(key,url);return url;}
function decode(key){if(decoded.has(key))return decoded.get(key);const p=new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{if(im.decode)im.decode().catch(()=>{}).then(()=>resolve(im));else resolve(im)};im.onerror=()=>reject(new Error('asset unavailable: '+key));const src=asset(key);if(!src){reject(new Error('asset unavailable: '+key));return;}im.src=src});decoded.set(key,p);p.catch(()=>{if(decoded.get(key)===p)decoded.delete(key)});if(decoded.size>8){const protectedKeys=new Set([state.index-1,state.index,state.index+1].filter(i=>chapters[i]).map(i=>chapterArt(chapters[i])));for(const k of decoded.keys())if(k!==key&&!protectedKeys.has(k)){decoded.delete(k);if(decoded.size<=8)break;}}return p;}

function chapterArt(c){return c.visual||'hero'}
function previewArt(c){return c.preview&&!invalidPreviews.has(c.preview)?c.preview:chapterArt(c)}
function rejectPreview(key){invalidPreviews.add(key);decoded.delete(key);const url=resourceCache.get(key);if(url?.startsWith('blob:'))URL.revokeObjectURL(url);resourceCache.delete(key);}
function bindPreview(im,c){
 const key=previewArt(c),original=chapterArt(c);im.dataset.previewKey=key;
 const fallback=()=>{if(im.dataset.previewKey!==key||key===original)return;rejectPreview(key);im.onerror=null;im.dataset.previewKey=original;const src=asset(original);if(src)im.src=src;else im.removeAttribute('src');};
 im.onerror=key===original?null:fallback;
 const src=asset(key);if(src)im.src=src;else fallback();
}
function decodePreview(c){const key=previewArt(c),original=chapterArt(c);return decode(key).catch(error=>{if(key===original)throw error;rejectPreview(key);return decode(original);});}
function preload(){[state.index-1,state.index,state.index+1].filter(i=>chapters[i]).forEach(i=>(state.viewer?decode(chapterArt(chapters[i])):decodePreview(chapters[i])).catch(()=>{}));}
// A single inline session owns playback across the reader, exhibition and viewer.
let inlineSession=null,inlineViewerHost=null,inlineHoverTimer=null;
function isLiveMedia(m){return !!m&&(m.live===true||m.kind==='live-photo'||m.presentation==='live-photo'||/live.?photo/i.test(m.title||'')||/-live$/.test(m.id||''));}
function inlineMediaFor(c){return chapterMedia(c).filter(m=>['video','audio','narration'].includes(m.type)&&(m.type==='narration'||m.asset||m.url));}
function primaryInline(c){const list=inlineMediaFor(c);return list.find(isLiveMedia)||list.find(m=>m.type==='video')||list.find(m=>m.type==='audio')||list[0];}
function releaseMediaResource(key){if(!key)return;const url=resourceCache.get(key);if(url?.startsWith('blob:'))URL.revokeObjectURL(url);resourceCache.delete(key);}
function inlineActionLabel(m,playing=false){return isLiveMedia(m)?(playing?'停止实况':'播放实况'):playing?(m.type==='narration'?'暂停讲解':'暂停'):(m.type==='narration'?'播放讲解':m.type==='audio'?'播放声音':'播放影片');}
function setInlineLabel(host,m,playing=false){const button=host?.querySelector('.frame-media-toggle');if(!button)return;button.setAttribute('aria-label',inlineActionLabel(m,playing)+'：'+m.title);button.setAttribute('aria-pressed',String(playing));button.innerHTML='<span aria-hidden="true">'+(playing?'Ⅱ':isLiveMedia(m)?'◉':'▶')+'</span><span>'+inlineActionLabel(m,playing)+'</span>';}
function stopInlineMedia(){
 clearTimeout(inlineHoverTimer);inlineHoverTimer=null;const session=inlineSession;inlineSession=null;
 if(!session)return;
 mediaLoadTicket++;
 if(session.utterance){session.utterance.onend=session.utterance.onerror=null;if(spoken===session.utterance){speechSynthesis.cancel();spoken=null;}}
 if(session.element){session.element.pause();session.element.removeAttribute('src');session.element.load();}
 releaseMediaResource(session.key);
 session.host.classList.remove('is-media-active','is-media-ready','is-media-loading','is-media-playing','needs-play-gesture');
 session.host.querySelector('.inline-media-layer')?.replaceChildren();
 const status=session.host.querySelector('.frame-media-status');if(status)status.textContent='';
 setInlineLabel(session.host,session.media,false);duckMedia(false);
}
function currentInlineHost(){return state.viewer?inlineViewerHost:state.mode==='read'?$('readerContent').querySelector('[data-inline-host]'):$('galleryTrack').querySelector('.exhibit.is-current [data-inline-host]');}
function attachInlineHost(host,index,scope){
 const c=chapters[index],list=inlineMediaFor(c),primary=primaryInline(c);if(!host||!primary)return;
 host.dataset.inlineHost='';host.dataset.inlineIndex=index;host.dataset.inlineScope=scope;host.dataset.inlineMedia=primary.id;
 host.classList.add('media-frame','has-inline-media');host.classList.toggle('is-live-photo',isLiveMedia(primary));
 host.insertAdjacentHTML('beforeend',`<div class="inline-media-layer" aria-label="${esc(primary.title)}"></div><div class="frame-media-actions"><button class="frame-media-toggle" data-inline-play aria-pressed="false"></button>${list.length>1?`<select class="frame-media-select" aria-label="选择本作品影音">${list.map(m=>`<option value="${esc(m.id)}" ${m.id===primary.id?'selected':''}>${esc(m.title)}</option>`).join('')}</select>`:''}</div><button class="frame-media-close" data-inline-close aria-label="停止播放并返回图片">×</button><span class="frame-media-status" role="status" aria-live="polite"></span>`);
 setInlineLabel(host,primary,false);let pointerInside=false;
 host.addEventListener('pointerenter',e=>{
  if(e.pointerType!=='mouse'||!matchMedia('(hover:hover) and (pointer:fine)').matches||state.panel||viewerClosing)return;
  pointerInside=true;const m=mediaById(host.dataset.inlineMedia);if(!isLiveMedia(m))return;
  clearTimeout(inlineHoverTimer);inlineHoverTimer=setTimeout(()=>{inlineHoverTimer=null;if(host.isConnected&&pointerInside&&!state.panel)startInlineMedia(host,m,true);},100);
 });
 host.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'){pointerInside=false;clearTimeout(inlineHoverTimer);inlineHoverTimer=null;if(inlineSession?.host===host&&isLiveMedia(inlineSession.media))stopInlineMedia();}});
}
function positionInlineViewer(im,box){
 if(!inlineViewerHost||im!==viewerImage)return;
 const style=getComputedStyle(im),scale=box.scale||1,insetX=(parseFloat(style.borderLeftWidth)||0)+(parseFloat(style.paddingLeft)||0),insetY=(parseFloat(style.borderTopWidth)||0)+(parseFloat(style.paddingTop)||0);
 inlineViewerHost.style.width=Math.max(1,box.width-2*insetX*scale)+'px';inlineViewerHost.style.height=Math.max(1,box.height-2*insetY*scale)+'px';inlineViewerHost.style.transform=`translate3d(${box.x+insetX*scale}px,${box.y+insetY*scale}px,0)`;
}
function prepareInlineViewer(index){
 inlineViewerHost?.remove();inlineViewerHost=null;
 if(!primaryInline(chapters[index]))return;
 const host=document.createElement('div');host.className='viewer-media-host media-frame';$('viewerArt').append(host);inlineViewerHost=host;attachInlineHost(host,index,'viewer');positionViewerImage(viewerImage);
}
async function playInlineElement(session){
 if(inlineSession!==session)return;
 try{await session.element.play();if(inlineSession!==session)return;session.host.classList.remove('needs-play-gesture');}
 catch(error){if(inlineSession!==session)return;session.host.classList.remove('is-media-playing');session.host.classList.add('needs-play-gesture');setInlineLabel(session.host,session.media,false);const status=session.host.querySelector('.frame-media-status');if(status)status.textContent='轻点播放';duckMedia(false);}
}
async function startInlineMedia(host,m,hover=false){
 if(!host?.isConnected||!m||viewerClosing||state.panel)return;
 if(inlineSession?.host===host&&inlineSession.media.id===m.id){
  if(hover)return;
  const session=inlineSession;
  if(isLiveMedia(m)){if(session.element?.src&&host.classList.contains('needs-play-gesture'))playInlineElement(session);else stopInlineMedia();return;}
  if(session.utterance){if(speechSynthesis.paused){speechSynthesis.resume();host.classList.add('is-media-playing');setInlineLabel(host,m,true);duckMedia(true);}else{speechSynthesis.pause();host.classList.remove('is-media-playing');setInlineLabel(host,m,false);duckMedia(false);}return;}
  if(host.classList.contains('is-media-loading'))return;
  if(session.element){if(session.element.paused){if(session.element.ended)session.element.currentTime=0;playInlineElement(session);}else session.element.pause();}return;
 }
 stopInlineMedia();stopPanelMedia();
 const session={host,media:m,key:m.asset||null,hover,element:null,utterance:null};inlineSession=session;const ticket=++mediaLoadTicket;
 host.dataset.inlineMedia=m.id;const choice=host.querySelector('.frame-media-select');if(choice)choice.value=m.id;host.classList.toggle('is-live-photo',isLiveMedia(m));host.classList.add('is-media-active','is-media-loading');
 const layer=host.querySelector('.inline-media-layer'),status=host.querySelector('.frame-media-status');layer.setAttribute('aria-label',m.title);layer.classList.toggle('is-audio',m.type!=='video');setInlineLabel(host,m,false);if(status)status.textContent='正在准备…';
 if(m.type==='narration'){
  if(!('speechSynthesis' in window)){stopInlineMedia();toast('此设备没有可用的语音服务，讲解文字仍可阅读。');return;}
  const card=document.createElement('div');card.className='inline-audio-card';card.innerHTML='<span aria-hidden="true">◉</span><span><strong>'+esc(m.title)+'</strong><small>设备合成讲解</small></span>';layer.append(card);
  const u=new SpeechSynthesisUtterance(m.text||m.description||'');u.lang=m.lang||'zh-CN';u.rate=.88;u.onend=u.onerror=()=>{if(inlineSession===session)stopInlineMedia()};session.utterance=u;spoken=u;host.classList.remove('is-media-loading');host.classList.add('is-media-ready','is-media-playing');if(status)status.textContent='';setInlineLabel(host,m,true);duckMedia(true);speechSynthesis.speak(u);return;
 }
 const el=document.createElement(m.type);session.element=el;el.className='inline-media-element';el.preload='metadata';el.setAttribute('playsinline','');el.setAttribute('webkit-playsinline','');el.controls=!isLiveMedia(m);el.loop=isLiveMedia(m);el.muted=isLiveMedia(m);el.defaultMuted=isLiveMedia(m);if(isLiveMedia(m))el.setAttribute('muted','');if(m.type==='video'&&m.poster)el.poster=asset(m.poster);el.setAttribute('aria-label',m.title);
 if(m.type==='audio'){const card=document.createElement('div');card.className='inline-audio-card';const title=document.createElement('strong');title.textContent=m.title;card.append(title,el);layer.append(card);}else layer.append(el);
 el.addEventListener('play',()=>{if(inlineSession!==session)return;host.classList.add('is-media-playing');host.classList.remove('needs-play-gesture');setInlineLabel(host,m,true);if(status)status.textContent='';duckMedia(!el.muted);});
 el.addEventListener('pause',()=>{if(inlineSession!==session)return;host.classList.remove('is-media-playing');setInlineLabel(host,m,false);duckMedia(false);});
 el.addEventListener('ended',()=>{if(inlineSession!==session)return;setInlineLabel(host,m,false);duckMedia(false);});
 el.addEventListener('volumechange',()=>{if(inlineSession===session)duckMedia(!el.paused&&!el.muted);});
 el.addEventListener('error',()=>{if(inlineSession!==session)return;stopInlineMedia();toast('这段影音暂时未能播放，请轻点重试。');});
 try{
  const src=m.asset?await mediaAsset(m.asset,ticket):m.url;
  if(ticket!==mediaLoadTicket||inlineSession!==session||!host.isConnected)return;
  if(!src)throw new Error('empty media');el.src=src;el.load();host.classList.remove('is-media-loading');host.classList.add('is-media-ready');if(status)status.textContent='';await playInlineElement(session);
 }catch(error){if(inlineSession===session){stopInlineMedia();toast('这段影音暂未载入，请轻点重试。');}}
}
function persist(){try{localStorage.setItem(storageKey,JSON.stringify({index:state.index,id:chapters[state.index]?.id,updated:Date.now()}))}catch(e){}}
function toast(s){if(!$('toast'))return;const host=state.panel?$('panel'):state.viewer?$('viewer'):document.body;if($('toast').parentElement!==host)host.appendChild($('toast'));$('toast').textContent=s;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3200)}
// Fullscreen and page immersion are separate capabilities.
const immersive={active:false,chrome:true,keyboard:false,pointerHeld:false,timer:null,autoSuppressed:false,pendingTap:false,rotationTried:false,hintShown:false};
let fullscreenBusy=false,lastFullscreenExitAt=-Infinity,lastFullscreenElement=null;
function fullscreenElement(){return document.fullscreenElement||document.webkitFullscreenElement||null;}
function standalone(){return matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches||navigator.standalone===true;}
function landscapePhone(){return (navigator.maxTouchPoints>0||matchMedia('(pointer:coarse)').matches)&&innerWidth>innerHeight&&innerHeight<=600&&innerWidth<=1200;}
function chromeGroups(){return $$('.topbar,.bottom-bar,.viewer-toolbar,.viewer-nav');}
function scheduleChrome(){
 clearTimeout(immersive.timer);
 if(immersive.active&&immersive.chrome&&!state.story&&!state.panel&&!immersive.keyboard&&!immersive.pointerHeld&&!viewerClosing)
  immersive.timer=setTimeout(()=>setChrome(false),4000);
}
function setChrome(show){
 if(!immersive.active)show=true;
 if(!show&&(state.story||state.panel||immersive.keyboard))return;
 immersive.chrome=show;document.body.classList.toggle('chrome-visible',show);
 chromeGroups().forEach(el=>{el.inert=immersive.active&&!show;el.setAttribute('aria-hidden',String(immersive.active&&!show));});
 $('viewerArt').setAttribute('aria-label',immersive.active&&!show?'轻点显示操作控件，左右滑动切换作品':'轻点展开或收起作品介绍');
 if(state.viewer)measureViewer();else layoutSpace();
 scheduleChrome();
}
function refreshImmersion(){
 const active=landscapePhone();
 if(active===immersive.active)return;
 immersive.active=active;document.body.classList.toggle('landscape-immersive',active);
 if(active){
  immersive.pendingTap=!fullscreenElement()&&!standalone()&&!immersive.autoSuppressed;
  setChrome(state.story||!!state.panel||immersive.keyboard);
  if(!immersive.hintShown){immersive.hintShown=true;toast('已切换横屏欣赏 · 轻点画面显示操作');}
 }else{immersive.pendingTap=false;setChrome(true);}
 requestAnimationFrame(()=>{if(state.viewer)measureViewer();else layoutSpace();});
}
function syncFullscreen(){
 const active=!!fullscreenElement(),installed=standalone();
 $$('[data-fullscreen]').forEach(b=>{
  b.setAttribute('aria-pressed',String(active));b.setAttribute('aria-label',active?'退出全屏':installed?'已独立显示':'全屏');
  b.title=active?'退出全屏':installed?'已独立显示':'全屏';b.querySelector('.fullscreen-label').textContent=b.title;
 });
 requestAnimationFrame(()=>{if(state.viewer)measureViewer();else layoutSpace();});
}
async function toggleFullscreen(reason='manual'){
 if(fullscreenBusy)return;
 const active=!!fullscreenElement(),automatic=reason!=='manual',root=document.documentElement;
 if(automatic&&(active||standalone()||immersive.autoSuppressed||!immersive.active||state.panel))return;
 if(!active&&standalone()){if(!automatic)toast('当前已在独立窗口中显示');return;}
 if(active&&!automatic){immersive.autoSuppressed=true;immersive.pendingTap=false;}
 const method=active?(document.exitFullscreen||document.webkitExitFullscreen):(root.requestFullscreen||root.webkitRequestFullscreen);
 if(!method){immersive.pendingTap=false;if(!automatic)showPanel('fullscreen');return;}
 fullscreenBusy=true;
 try{
  // Synchronous native request: retain the tap or trusted orientation event's permission.
  const result=active?method.call(document):root.requestFullscreen?method.call(root,{navigationUI:'hide'}):method.call(root);
  if(result&&typeof result.then==='function')await result;
 }catch(e){
  if(reason==='rotation')immersive.pendingTap=!immersive.autoSuppressed;
  else if(!automatic){if(active)toast('请使用浏览器的退出全屏功能。');else showPanel('fullscreen');}
  else toast('已收起页面控件；此浏览器暂未允许隐藏标签栏。');
 }finally{fullscreenBusy=false;syncFullscreen();}
}
function onFullscreenChange(){
 const element=fullscreenElement();
 if(element===document.documentElement&&element!==lastFullscreenElement&&$('viewer').open){
  const dialog=$('viewer'),caption=$('viewerCaption'),focus=document.activeElement;
  const dialogTop=dialog.scrollTop,captionTop=caption.scrollTop;
  dialog.close();dialog.showModal();
  if(focus&&dialog.contains(focus))focus.focus({preventScroll:true});
  dialog.scrollTop=dialogTop;caption.scrollTop=captionTop;
 }
 if(!element&&lastFullscreenElement){lastFullscreenExitAt=performance.now();immersive.autoSuppressed=true;immersive.pendingTap=false;setChrome(true);}
 if(element)immersive.pendingTap=false;
 lastFullscreenElement=element;syncFullscreen();
}
function onOrientationChange(event){
 refreshImmersion();
 // resize is layout-only. Only a real orientation event may initiate automatic fullscreen.
 if(event.isTrusted&&immersive.active&&!immersive.rotationTried&&!immersive.autoSuppressed){
  immersive.rotationTried=true;toggleFullscreen('rotation');
 }
 if(!immersive.active)immersive.rotationTried=false;
}
function captureImmersiveTap(e){
 if(!immersive.active||state.panel)return;
 if(Date.now()<=suppressClick){e.preventDefault();e.stopImmediatePropagation();return;}
 const target=e.target;
 if(target.closest('input,textarea,select,video,audio,a')||window.getSelection()?.toString())return;
 if(immersive.pendingTap&&!target.closest('[data-fullscreen]')){
  immersive.pendingTap=false;toggleFullscreen('tap');
 }
 if(!immersive.chrome){
  e.preventDefault();e.stopImmediatePropagation();setChrome(true);return;
 }
 scheduleChrome();
 // A deliberate tap on empty stage hides controls; actual actions keep their meaning.
 if(!target.closest('button,a,#viewerCaption')&&state.mode==='space')setChrome(false);
}
function cancelDialog(e,close){
 e.preventDefault();
 // Escape belongs to fullscreen first; it must not also dismiss the open artwork.
 if(fullscreenElement()){toggleFullscreen();return;}
 if(performance.now()-lastFullscreenExitAt<300)return;
 close();
}
function nav(){const c=chapters[state.index];if(!c)return;$('position').textContent=String(state.index+1).padStart(2,'0')+' / '+String(chapters.length).padStart(2,'0');$('chapterLabel').textContent=c.title;$('prev').disabled=state.index===0;$('next').disabled=state.index===chapters.length-1;if($('progress'))$('progress').style.width=((state.index+1)/chapters.length*100)+'%';$$('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===state.mode)));document.body.classList.toggle('space-mode',state.mode==='space');document.body.classList.toggle('reduced-motion',state.reduced);}
function context(c){let out=chapterMedia(c).map(m=>`<button class="primary" data-inline-shortcut="${esc(m.id)}">${m.type==='narration'?'◉':'▶'} ${esc(m.title||mediaType(m))}</button>`).join('');if(state.index===0){out+=`<button data-switch-space>走进空间展厅 ↗</button>`;if(mediaItems.length)out+=`<button data-panel="media">影音总览 · ${mediaItems.length}</button>`;}return out?'<div class="context-actions">'+out+'</div>':'';}
function supplemental(c){const list=c.images||c.supplements||[];return list.length?`<details class="supplemental"><summary>细节与档案 · ${list.length}</summary>${list.map((im,i)=>`<button data-reference="${i}"><img src="${asset(im.asset)}" alt="${esc(im.title||im.caption||'补充图片')}" loading="lazy"><span>${esc(im.title||im.caption||'查看细节')}</span></button>`).join('')}</details>`:'';}
function personalMemory(c){if(book.id!=='NODE_Chen_Xiaoqian')return '';try{const n=JSON.parse(localStorage.getItem('node-xiaoqian-memory-v1')||'{}').notes?.[c.id];return n&&(n.date||n.text)?'<h3>我的补记</h3><p>'+esc(n.date||'')+'</p><p>'+esc(n.text||'')+'</p>':'';}catch(e){return '';}}
function personalEntry(c){return book.id==='NODE_Chen_Xiaoqian'?`<button class="memory-entry" data-panel="memory">补记这段时光 ↗</button>`:'';}

function renderReader(){const c=chapters[state.index];if(!c)return;readerRenderedIndex=state.index;const related=(c.related||[]).map(id=>chapters.findIndex(x=>x.id===id)).filter(i=>i>=0&&i!==state.index);$('readerContent').innerHTML=`<article class="article-grid ${state.index===0?'cover':''}" data-chapter-id="${esc(c.id)}"><div class="article-visual"><figure><div class="media-frame"><button class="art-button" data-open="${state.index}" aria-label="专注欣赏：${esc(c.title)}"><img alt="${esc(c.caption||c.title)}" decoding="async"><span class="art-hint">轻点 · 专注欣赏 <span aria-hidden="true">↗</span></span></button></div><figcaption>${esc(c.caption||'')}</figcaption></figure></div><div class="article-copy"><header class="chapter-head"><div class="eyebrow">${esc(c.kicker||('NODE / '+String(state.index+1).padStart(2,'0')))}</div><h1 tabindex="-1">${esc(c.title)}</h1><p class="lead">${esc(c.lead||'')}</p></header>${context(c)}${personalEntry(c)}<div class="chapter-text">${(c.paragraphs||[]).map(p=>'<p>'+esc(p)+'</p>').join('')}</div>${c.points?.length?'<div class="point-grid">'+c.points.map(p=>'<section class="point"><h2>'+esc(p.title)+'</h2><p>'+esc(p.text)+'</p></section>').join('')+'</div>':''}${supplemental(c)}${related.length?'<nav class="related" aria-label="继续探索"><span>关联阅读</span>'+related.map(i=>`<button data-go="${i}">${esc(chapters[i].title)} <span aria-hidden="true">↗</span></button>`).join('')+'</nav>':''}</div></article>`;bindPreview($('readerContent').querySelector('.art-button img'),c);attachInlineHost($('readerContent').querySelector('.media-frame'),state.index,'read');}
// Hidden views keep their DOM. Rebuild only when that view is actually shown.
function go(index,opts={}){
 const n=Math.max(0,Math.min(chapters.length-1,Number(index)||0));
 if(!state.viewer)viewerTicket++;
 if(n===state.index&&!opts.force)return;
 stopInlineMedia();
 if(state.mode==='read'&&!state.viewer&&readerRenderedIndex===state.index)state.readerScroll[state.index]=$('reader').scrollTop;
 state.index=n;
 if(!state.viewer){
  if(state.mode==='read'){renderReader();$('reader').scrollTop=opts.restore?(state.readerScroll[n]||0):0;}
  else layoutSpace();
  nav();
 }
 preload();persist();
 if(opts.focus&&state.mode==='read'&&!state.viewer)$('readerContent').querySelector('h1')?.focus({preventScroll:true});
}
function setMode(mode){
 if(!['read','space'].includes(mode)||state.mode===mode)return;
 stopInlineMedia();
 if(!state.viewer)viewerTicket++;
 if(state.mode==='read'&&readerRenderedIndex===state.index)state.readerScroll[state.index]=$('reader').scrollTop;
 state.mode=mode;$('reader').hidden=mode!=='read';$('space').hidden=mode!=='space';nav();
 if(mode==='read'){
  if(readerRenderedIndex!==state.index)renderReader();
  $('reader').scrollTop=state.readerScroll[state.index]||0;
 }else{layoutSpace();if(!$('sceneA').getAttribute('src'))setScene(state.scene,true);}
 preload();
}
function buildSpace(){const frag=document.createDocumentFragment();chapters.forEach((c,i)=>{const b=document.createElement('div');b.className='exhibit';b.dataset.exhibit=i;b.setAttribute('role','group');b.setAttribute('aria-label',String(i+1)+' · '+c.title);b.innerHTML=`<div class="exhibit-art media-frame"><button class="exhibit-open" data-exhibit="${i}" aria-label="专注欣赏：${esc(c.title)}"><img alt="${esc(c.caption||c.title)}" draggable="false" decoding="async"></button></div><span class="exhibit-label"><span>${String(i+1).padStart(2,'0')}</span><strong>${esc(c.title)}</strong></span>`;attachInlineHost(b.querySelector('.exhibit-art'),i,'space');frag.appendChild(b)});$('galleryTrack').replaceChildren(frag);layoutSpace();}
function layoutSpace(allowBehindViewer=false){if(state.mode!=='space'||(state.viewer&&!allowBehindViewer))return;const vp=$('galleryViewport'),width=vp.clientWidth||innerWidth;const w=immersive.active?Math.min(820,width*.76):width<720?Math.min(620,width*.80):Math.min(680,width*.52);const chromeScale=immersive.active&&immersive.chrome?Math.max(.45,(vp.clientHeight-108)/Math.max(1,vp.clientHeight)):1;step=w+(width<720?34:70);vp.scrollLeft=0;vp.scrollTop=0;vp.style.setProperty('--card-width',w+'px');vp.style.setProperty('--exhibit-scale',String(chromeScale));$$('.exhibit').forEach((b,i)=>{const d=i-state.index,visible=Math.abs(d)<=2;b.style.left=(i*step)+'px';b.style.width=w+'px';b.style.transform=`translate(-50%, -50%) translateZ(${d===0?0:-65}px) rotateY(${d===0?0:(d>0?-6:6)}deg) scale(${chromeScale})`;b.style.visibility=visible?'visible':'hidden';b.style.opacity=Math.abs(d)>1?'0.35':'1';b.classList.toggle('is-current',d===0);b.tabIndex=-1;b.querySelector('.exhibit-open').tabIndex=d===0?0:-1;b.querySelectorAll('.frame-media-actions button,.frame-media-actions select').forEach(el=>el.tabIndex=d===0?0:-1);b.setAttribute('aria-hidden',String(!visible));b.setAttribute('aria-current',String(d===0));if(visible){const im=b.querySelector('img');if(!im.getAttribute('src'))bindPreview(im,chapters[i]);}else if(Math.abs(d)>3){const im=b.querySelector('img');im.onerror=null;delete im.dataset.previewKey;im.removeAttribute('src');}});$('galleryTrack').style.transform=`translate3d(${-state.index*step}px,0,0)`;}
async function setScene(index,immediate=false){if(!scenes.length)return;const n=(Number(index)+scenes.length)%scenes.length,scene=scenes[n],token=++sceneTicket,key=scene.asset||scene.id;try{await decode(key);if(token!==sceneTicket)return;const incoming=sceneLayer===0?$('sceneB'):$('sceneA'),outgoing=sceneLayer===0?$('sceneA'):$('sceneB');if(immediate&&!outgoing.getAttribute('src')){outgoing.src=asset(key);outgoing.style.objectPosition=scene.objectPosition||scene.sourceMetadata?.objectPosition||'center';outgoing.style.opacity='1';}else{incoming.src=asset(key);incoming.style.objectPosition=scene.objectPosition||scene.sourceMetadata?.objectPosition||'center';incoming.style.opacity='1';outgoing.style.opacity='0';sceneLayer=1-sceneLayer;}state.scene=n;window.NODEFrames?.apply(book,scene);if(state.viewer)measureViewer();$('spaceScene').innerHTML='<span aria-hidden="true">◈</span> '+esc(scene.title)+' <span aria-hidden="true">⌄</span>';if(state.panel==='scenes')renderPanel('scenes');}catch(e){if(token===sceneTicket)toast('场景暂未载入，作品仍可正常阅读。请重新选择场景。')}}
function viewerCaption(c){return `<div class="eyebrow">${esc(c.kicker||'NODE')} · ${String(state.index+1).padStart(2,'0')}</div><h2>${esc(c.title)}</h2><p class="lead">${esc(c.lead||'')}</p>${(c.paragraphs||[]).map(p=>'<p>'+esc(p)+'</p>').join('')}${(c.points||[]).map(p=>'<h3>'+esc(p.title)+'</h3><p>'+esc(p.text)+'</p>').join('')}${supplemental(c)}${personalMemory(c)}${personalEntry(c)}`;}
// Artwork geometry is measured on entry/resize, never once per animation frame.
// The caption always has its final width: story toggles animate only transform/opacity.
function measureViewer(){
 if(!state.viewer)return;
 const stage=$('viewerArt'),cap=$('viewerCaption');
 viewerGeometry={width:stage.clientWidth,height:stage.clientHeight,left:cap.offsetLeft,top:cap.offsetTop,
  portrait:!immersive.active&&matchMedia('(max-width:650px)').matches&&!matchMedia('(max-height:520px) and (orientation:landscape)').matches};
 stage.querySelectorAll('img').forEach(positionViewerImage);
}
function positionViewerImage(im){
 if(!viewerGeometry||!im.naturalWidth)return;
 const g=viewerGeometry,fit=Math.min(g.width/im.naturalWidth,g.height/im.naturalHeight),w=im.naturalWidth*fit,h=im.naturalHeight*fit;
 const tw=state.story&&!g.portrait?Math.max(1,g.left-20):g.width;
 const reserve=immersive.active&&immersive.chrome?48:0;
 const th=state.story&&g.portrait?Math.max(1,g.top-12):Math.max(1,g.height-reserve*2);
 const scale=Math.min(tw/w,th/h,1),x=(tw-w*scale)/2,y=(th-h*scale)/2+reserve;
 // Width/height stay fixed while showing/hiding the story. Only the transform changes.
 const ws=w+'px',hs=h+'px';if(im.style.width!==ws)im.style.width=ws;if(im.style.height!==hs)im.style.height=hs;
 im.style.transform=`translate3d(${x}px,${y}px,0) scale(${scale})`;
 positionInlineViewer(im,{x,y,width:w*scale,height:h*scale,scale});
}
function updateViewerText(n,withCaption=false){
 if(withCaption){$('viewerCaption').innerHTML=viewerCaption(chapters[n]);$('viewerCaption').scrollTop=0;viewerCaptionIndex=n;}
 $('viewerCount').textContent=String(n+1).padStart(2,'0')+' / '+String(chapters.length).padStart(2,'0');
 $('viewerPrev').disabled=n===0;$('viewerNext').disabled=n===chapters.length-1;const ms=chapterMedia(chapters[n]);$('viewerMedia').hidden=!ms.length;$('viewerMedia').textContent=ms.length===1?'▶ '+mediaType(ms[0]):'▶ 影音 · '+ms.length;$('viewerMedia').removeAttribute('data-media');$('viewerMedia').dataset.inlineShortcut=primaryInline(chapters[n])?.id||'';$('viewerPrompt').hidden=!!ms.length;
}
// The dialog's own opaque surface fades over the live return view; its backdrop stays transparent.
// Keep the image geometry and text layout untouched. Only two compositor properties animate.
function freezeViewerMotion(){
 const dialog=$('viewer'),art=$('viewerArt');
 if(dialog.open){dialog.style.opacity=getComputedStyle(dialog).opacity;art.style.transform=getComputedStyle(art).transform;}
 viewerMotionTicket++;viewerMotion.forEach(a=>a.cancel());viewerMotion=[];
}
function animateViewerVisibility(show,initial=false){
 freezeViewerMotion();
 const dialog=$('viewer'),art=$('viewerArt'),ticket=viewerMotionTicket;
 if(initial){dialog.style.opacity='0';art.style.transform='scale(.985)';}
 const targetOpacity=show?'1':'0',targetTransform=show?'scale(1)':'scale(.985)';
 if(state.reduced){dialog.style.opacity=targetOpacity;art.style.transform=show?'none':targetTransform;return Promise.resolve(true);}
 const options={duration:show?1240:1000,easing:'cubic-bezier(.4,0,.2,1)',fill:'both'};
 const motions=[dialog.animate([{opacity:dialog.style.opacity||'1'},{opacity:targetOpacity}],options),
  art.animate([{transform:art.style.transform||'none'},{transform:targetTransform}],options)];
 viewerMotion=motions;
 return Promise.all(motions.map(a=>a.finished)).then(()=>{
  if(ticket!==viewerMotionTicket)return false;
  dialog.style.opacity=targetOpacity;art.style.transform=show?'none':targetTransform;
  motions.forEach(a=>a.cancel());viewerMotion=[];return true;
 },()=>false);
}
async function prepareViewerReturn(){
 document.body.classList.add('return-preparing');
 if(state.mode==='read'){
  if(readerRenderedIndex!==state.index)renderReader();
  $('reader').scrollTop=state.readerScroll[state.index]||0;
 }else layoutSpace(true);
 nav();
 const im=state.mode==='read'?$('readerContent').querySelector('.art-button img'):$('galleryTrack').querySelector('.is-current img');
 if(im?.decode)await im.decode().catch(()=>{});
}
async function openViewer(index=state.index,fromHistory=false){
 stopInlineMedia();
 const n=Math.max(0,Math.min(chapters.length-1,Number(index)||0)),token=++viewerTicket;
 viewerRequestedIndex=n;
 const reopening=viewerClosing;
 if(reopening){viewerClosing=false;viewerExitTicket++;freezeViewerMotion();document.body.classList.remove('return-preparing');}
 try{
  // This cached, decoded image element is the very element inserted into the viewer.
  // Keep the current picture/reader visible until it is ready; newer requests supersede older ones.
  const incoming=await decode(chapterArt(chapters[n]));
  if(token!==viewerTicket)return;
  if(viewerFade)await viewerFade.finished.catch(()=>{});
  if(token!==viewerTicket)return;
  const wasOpen=state.viewer,wasStory=state.story;
  if(!wasOpen){
   lastViewerFocus=document.activeElement;
   if(state.mode==='read'&&readerRenderedIndex===state.index)state.readerScroll[state.index]=$('reader').scrollTop;
   state.viewer=true;state.story=false;$('viewer').classList.remove('story-open');
   $('viewerStory').setAttribute('aria-expanded','false');$('viewerStory').textContent='看故事';
   $('viewerCaption').setAttribute('aria-hidden','true');$('viewerCaption').inert=true;
  }else toggleStory(false);
  go(n);updateViewerText(n,!wasOpen);
  incoming.alt=chapters[n].caption||chapters[n].title;incoming.draggable=false;incoming.decoding='async';
  const outgoing=viewerImage;
  incoming.style.opacity='1';incoming.style.zIndex='1';
  if(!wasOpen||incoming===outgoing){
   incoming.style.transition='none';$('viewerArt').replaceChildren(incoming);viewerImage=incoming;
   if(!wasOpen){$('viewer').style.opacity='0';$('viewerArt').style.transform='scale(.985)';$('viewer').showModal();$('viewerClose').focus({preventScroll:true});}
   measureViewer();incoming.getBoundingClientRect();incoming.style.removeProperty('transition');
  }else{
   incoming.style.transition='none';$('viewerArt').appendChild(incoming);positionViewerImage(incoming);incoming.getBoundingClientRect();incoming.style.removeProperty('transition');
   // Solid outgoing picture underneath avoids the dark dip caused by fading BOTH layers.
   outgoing.style.zIndex='0';viewerImage=incoming;
   const fade=incoming.animate([{opacity:0},{opacity:1}],{duration:state.reduced?0:280,delay:state.reduced||!wasStory?0:160,easing:'ease-out',fill:'backwards'});
   viewerFade=fade;
   fade.finished.catch(()=>{}).then(()=>{
    if(viewerFade!==fade)return;
    if(outgoing!==viewerImage)outgoing.remove();
    incoming.style.removeProperty('transition');viewerFade=null;
   });
  }
  prepareInlineViewer(n);
  if(!wasOpen&&immersive.active)setChrome(immersive.keyboard);
  if(!wasOpen||reopening)animateViewerVisibility(true,!wasOpen);
  if(!fromHistory)pushOverlayHistory('viewer');
  preload();
 }catch(e){if(token===viewerTicket){viewerRequestedIndex=state.index;if(reopening)animateViewerVisibility(true);toast('此图暂未载入，当前画面已保留。请重试。');}}
}
function closeViewer(fromHistory=false){
 stopInlineMedia();
 viewerTicket++;viewerRequestedIndex=state.index;
 if(viewerClosing){if(fromHistory)viewerExitFromHistory=true;return viewerExitPromise||Promise.resolve();}
 if(!state.viewer)return Promise.resolve();
 viewerClosing=true;viewerExitFromHistory=fromHistory;const ticket=++viewerExitTicket;
 // Reverse an in-flight entrance from its current opacity; never jump to a fully visible frame.
 freezeViewerMotion();
 viewerExitPromise=(async()=>{
  await prepareViewerReturn();
  if(ticket!==viewerExitTicket||!viewerClosing)return;
  const completed=await animateViewerVisibility(false);
  if(!completed||ticket!==viewerExitTicket||!viewerClosing)return;
  viewerFade?.finish();state.viewer=false;state.story=false;viewerClosing=false;$('viewer').close();
  document.body.classList.remove('return-preparing');
  if(immersive.active)setChrome(immersive.keyboard);
  if(!viewerExitFromHistory)popOverlayHistory();
  nav();
  if(state.panel)return;
  if(state.mode==='space')$('galleryTrack').querySelector('.is-current .exhibit-open')?.focus({preventScroll:true});
  else if(lastViewerFocus?.isConnected)lastViewerFocus.focus({preventScroll:true});
  else $('readerContent').querySelector('h1')?.focus({preventScroll:true});
 })();
 return viewerExitPromise;
}
function toggleStory(force){
 if(!state.viewer||viewerClosing)return;
 const next=typeof force==='boolean'?force:!state.story;if(next===state.story)return;
 if(next&&viewerCaptionIndex!==state.index)updateViewerText(state.index,true);
 state.story=next;if(immersive.active){if(next)setChrome(true);else scheduleChrome();}$('viewer').classList.toggle('story-open',state.story);
 $('viewerStory').setAttribute('aria-expanded',String(state.story));$('viewerStory').textContent=state.story?'收起故事':'看故事';
 $('viewerCaption').setAttribute('aria-hidden',String(!state.story));$('viewerCaption').inert=!state.story;
 $('viewerArt').querySelectorAll('img').forEach(positionViewerImage);
}
function directoryHTML(){const groups=[...new Set(chapters.map(c=>c.group||'作品'))];return `<p class="panel-intro">${esc(book.subtitle||'跟随主题慢慢阅读，也可以从一件作品重新出发。')}</p>${progressRecord&&progressRecord.index>0?`<button class="resume-row" data-go="${Math.min(chapters.length-1,progressRecord.index)}">继续上次阅读 · ${esc(chapters[Math.min(chapters.length-1,progressRecord.index)]?.title||'')}</button>`:''}<div class="menu-tools menu-first"><button data-panel="scenes">切换空间 · ${scenes.length}</button>${mediaItems.length?`<button data-panel="media">▶ 影音总览 · ${mediaItems.length}</button>`:''}<button data-sound>${state.sound?'关闭':'开启'}背景音乐</button><button data-panel="technical">阅读设置与素材说明</button></div>${groups.map(g=>`<h3 class="directory-group">${esc(g)}</h3><div class="directory-grid">${chapters.map((c,i)=>({c,i})).filter(x=>(x.c.group||'作品')===g).map(({c,i})=>`<button class="directory-item ${i===state.index?'current':''}" data-go="${i}" ${i===state.index?'aria-current="true"':''}><span>${String(i+1).padStart(2,'0')}</span><strong>${esc(c.title)}</strong><small>${esc(c.kicker||'')}${chapterMedia(c).length?' · ▶ 影音':''}</small></button>`).join('')}</div>`).join('')}`;}
function scenesHTML(){const groups=[{id:'dedicated',title:'本刊专属 · 4 个场景'},{id:'universal',title:'通用空间 · 8 个场景'}];const kind=s=>s.collection==='universal'||s.sourceMetadata?.collection==='universal'?'universal':'dedicated';return `<p class="panel-intro">先走进这段内容的世界，也可以换一种观看氛围。切换空间，保留当前位置。</p>${groups.map(g=>`<h3 class="scene-group-title">${g.title}</h3><div class="scene-grid">${scenes.map((s,i)=>({s,i})).filter(({s})=>kind(s)===g.id).map(({s,i})=>`<button class="scene-choice" data-scene="${i}" aria-pressed="${i===state.scene}"><img src="${asset(s.asset||s.id)}" alt="${esc(s.title)}" loading="lazy"><strong>${esc(s.title)}</strong><span>${esc(s.description||'')}</span></button>`).join('')}</div>`).join('')}<div class="scene-switch"><button data-scene="${(state.scene-1+scenes.length)%scenes.length}">← 上一展厅</button><button data-scene="${(state.scene+1)%scenes.length}">下一展厅 →</button></div><p class="fineprint">作品位于独立的三维展示层，始终正对当前视线；空间背景不遮挡作品。这里是分层空间观展，不是可自由行走的实景扫描。</p>`;}

function fullscreenHelpHTML(){return `<p class="panel-intro">页面内的操作已可收起；浏览器标签栏由浏览器控制，当前窗口没有允许网页全屏。</p><div class="technical"><h3>继续在这里欣赏</h3><p>关闭此面板，轻点画面唤出操作；约 4 秒不操作后自动收起。打开故事时，控件会保持可见。</p><h3>iPhone / iPad 更完整的观看方式</h3><p>打开已上线的 NODE 网页，在 Safari 的分享菜单选择“添加到主屏幕”，并启用“作为 Web App 打开”，再从主屏幕进入。支持的系统会用独立窗口打开，不显示普通浏览器的标签栏。</p><p>本地 HTML 文件和聊天软件预览不一定支持此方式；团队需提供正式 HTTPS 网址。本文件不会自动安装应用或隐藏系统提示。</p></div>`;}
function technicalHTML(){return `<div class="technical"><h3>按你的节奏阅读</h3><button data-reduce aria-pressed="${state.reduced}">${state.reduced?'恢复柔和动效':'减少动态效果'}</button><p>左右键切换作品；空间中按 Enter 欣赏，Esc 返回。手机可以轻扫切换，横屏时轻点唤出控件，约4秒不操作自动收起。故事、播放与面板都在当前 NODE 内展开。</p><h3>声音</h3><button data-sound>${state.sound?'关闭':'开启'}背景音乐</button><p>${esc(book.bgm?.description||'可选轻柔合成纯音乐，默认关闭。播放影片与讲解时自动降低背景音乐。')}</p><h3>素材与版本</h3>${(book.notes||[]).map(n=>'<p>'+esc(n)+'</p>').join('')}<p>图片和内嵌影音随本 HTML 保存；仅标明外部来源的资料需要网络。清晰度以原素材为准；不会将低分辨率影像标为超高清。</p>${(book.sources||[]).map(x=>`<p>${x.url?`<a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.title||x.url)}</a>`:esc(x.title||'')}</p>`).join('')}<h3>空间来源</h3>${scenes.map(x=>`<p><strong>${esc(x.title)}</strong> · ${esc(x.description||'')}${x.source?' · '+esc(typeof x.source==='string'?x.source:JSON.stringify(x.source)):''}${x.license?' · '+esc(x.license):''}${x.sourceUrl?` · <a href="${esc(x.sourceUrl)}" target="_blank" rel="noopener">原始出处</a>`:''}</p>`).join('')}<h3>与 TimeTag / TimeEcho 相连</h3><p>TimeTag 保存稳定内容入口；本文件可用键盘方向键、Enter 和 Esc 交互。真实 NFC 在位检测、TimeEcho 控件与投屏需正式设备接入，本文件不声称已连接硬件。</p><p>只在当前浏览器记录阅读位置，不上传个人数据。</p></div>`;}
function memoryHTML(){let data={};try{data=JSON.parse(localStorage.getItem('node-xiaoqian-memory-v1')||'{}')}catch(e){}const c=chapters[state.index],note=data.notes?.[c.id]||{};return `<p class="panel-intro">${esc(c.title)} · 只保存在这个浏览器中。原始日期依据会继续保留。</p><label class="note-label">补充日期<input id="memoryDate" maxlength="50" value="${esc(note.date||'')}" placeholder="例如：约在某年夏天"></label><label class="note-label">我的记忆<textarea id="memoryText" maxlength="800" rows="6" placeholder="留下一句属于这段时光的话">${esc(note.text||'')}</textarea></label><button class="save-note" data-save-note>保存补记</button>${data.favorites?.includes(c.id)?'<p class="fineprint">这张照片在旧版中已被你收藏，记录已保留。</p>':''}`;}
function saveMemory(){let data={};try{data=JSON.parse(localStorage.getItem('node-xiaoqian-memory-v1')||'{}')}catch(e){}data.notes=data.notes||{};data.notes[chapters[state.index].id]={date:$('memoryDate').value.trim().slice(0,50),text:$('memoryText').value.trim().slice(0,800),updated:new Date().toISOString()};try{localStorage.setItem('node-xiaoqian-memory-v1',JSON.stringify(data));viewerCaptionIndex=-1;toast('补记已保存在当前浏览器')}catch(e){toast('浏览器未允许保存，请先复制文字留存。')}}

function duckMedia(active){mediaDucking=active;if(audioMaster&&audioContext){audioMaster.gain.cancelScheduledValues(audioContext.currentTime);audioMaster.gain.setTargetAtTime((state.sound && !active) ? 0.55 : 0,audioContext.currentTime,.16);}}
function stopPanelMedia(){mediaLoadTicket++;$('panelBody').querySelectorAll('video,audio').forEach(v=>{v.pause();v.removeAttribute('src');v.load();});$('panelBody').querySelectorAll('iframe').forEach(v=>v.removeAttribute('src'));if(activeLoadedAsset){const url=resourceCache.get(activeLoadedAsset);if(url?.startsWith('blob:'))URL.revokeObjectURL(url);resourceCache.delete(activeLoadedAsset);activeLoadedAsset=null;}if(spoken){spoken.onend=spoken.onerror=null;speechSynthesis.cancel();spoken=null;}duckMedia(false);}
function mediaHTML(){const scope=activeMediaScope===null?mediaItems:chapterMedia(chapters[activeMediaScope]);const m=mediaById(activeMediaId);if(!m)return `<p class="panel-intro">${activeMediaScope===null?'影片、现场声音与讲解，都从这里开始。':esc(chapters[activeMediaScope].title)+' · 本节点影音'}</p><div class="media-list">${scope.map(m=>`<button data-media="${esc(m.id)}">${m.poster?`<img src="${asset(m.poster)}" alt="" loading="lazy">`:'<span class="media-symbol">▶</span>'}<span><small>${mediaType(m)}</small><strong>${esc(m.title)}</strong><em>${esc(m.description||'')}</em></span></button>`).join('')}</div>`;const src=m.asset?null:m.url;return `<button class="media-back" data-media-library>← ${activeMediaScope===null?'全部影音':'本节点影音'}</button><h3 class="media-title">${esc(m.title)}</h3>${m.type==='video'||m.type==='audio'?`<${m.type} id="contentMedia" controls playsinline preload="metadata" ${m.poster&&m.type==='video'?`poster="${asset(m.poster)}"`:''} class="content-media"></${m.type}><p id="mediaStatus" role="status" class="fineprint">正在准备${mediaType(m)}…</p>`:m.type==='embed'?`<iframe class="content-media embed-player" src="${esc(src||'')}" allow="fullscreen; autoplay; encrypted-media" allowfullscreen title="${esc(m.title)}"></iframe>`:m.type==='narration'?`<p class="narration-text">${esc(m.text||'')}</p><button class="save-note" data-narrate="${esc(m.id)}">▶ 播放讲解</button><p class="fineprint">设备合成语音 · 不是人物原声。可用声音由当前设备决定。</p>`:`<p>这是原始来源页面。</p><a href="${esc(src||'#')}" target="_blank" rel="noopener">查看出处 ↗</a>`}<p class="media-description">${esc(m.description||'')}</p>${m.source?`<p class="fineprint">${esc(typeof m.source==='string'?m.source:JSON.stringify(m.source))}</p>`:''}`;}
async function loadMedia(){const m=mediaById(activeMediaId),el=$('contentMedia');if(!m||!el)return;const ticket=++mediaLoadTicket;try{const src=m.asset?await mediaAsset(m.asset,ticket):m.url;if(ticket!==mediaLoadTicket||!el.isConnected)return;activeLoadedAsset=m.asset||null;el.src=src;el.load();$('mediaStatus').textContent='点击播放 · 可在当前画面中欣赏';}catch(e){if(ticket===mediaLoadTicket&&$('mediaStatus'))$('mediaStatus').textContent='此媒体暂未载入，请返回后重试。';}}
function narrate(id){stopInlineMedia();const m=mediaById(id);if(!m||!('speechSynthesis' in window)){toast('此设备没有可用的语音服务，讲解文字仍可阅读。');return;}if(spoken){speechSynthesis.cancel();spoken=null;duckMedia(false);return;}const u=new SpeechSynthesisUtterance(m.text||m.description||'');u.lang=m.lang||'zh-CN';u.rate=.88;u.onend=u.onerror=()=>{if(spoken===u){spoken=null;duckMedia(false);}};spoken=u;duckMedia(true);speechSynthesis.speak(u);}
function renderPanel(kind){stopPanelMedia();const titles={fullscreen:'更大的观看画面',media:'影音',menu:book.title,scenes:'选择空间',technical:'阅读设置与素材说明',memory:'补记这段时光',reference:'细节与档案'};let html=kind==='fullscreen'?fullscreenHelpHTML():kind==='menu'?directoryHTML():kind==='scenes'?scenesHTML():kind==='media'?mediaHTML():kind==='memory'?memoryHTML():kind==='reference'?referenceHTML():technicalHTML();$('panelTitle').textContent=titles[kind]||titles.technical;$('panelBody').innerHTML=html;$('panel').dataset.kind=kind;if(kind==='media')loadMedia();}
let referenceIndex=0;function referenceHTML(){const im=(chapters[state.index].images||chapters[state.index].supplements||[])[referenceIndex];return im?`<img class="reference-image" src="${asset(im.asset)}" alt="${esc(im.title||'档案图')}"><h3>${esc(im.title||'')}</h3><p>${esc(im.caption||'')}</p>`:'';}

function showPanel(kind='menu',fromHistory=false){stopInlineMedia();viewerTicket++;if(!state.panel){lastPanelFocus=document.activeElement;$('panel').showModal();}state.panel=kind;setChrome(true);if(!fromHistory)pushOverlayHistory('panel');renderPanel(kind);$('panel').scrollTop=0;$('panelBody').scrollTop=0;$('panelClose').focus();}
function closePanel(fromHistory=false){if(!state.panel)return;stopPanelMedia();state.panel=null;$('panel').close();if(!fromHistory)popOverlayHistory();if(lastPanelFocus?.isConnected)lastPanelFocus.focus({preventScroll:true});scheduleChrome();}
let audioContext=null,audioMaster=null,audioTimer=null,audioStep=0;
function chord(){if(!audioContext||!state.sound)return;const now=audioContext.currentTime,seq=book.bgm?.seq||[[130.81,196,261.63],[146.83,220,293.66],[164.81,246.94,329.63],[130.81,196,261.63]],notes=seq[audioStep++%seq.length];notes.forEach((frequency,j)=>{const osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type='sine';osc.frequency.value=frequency;osc.detune.value=j===1?3:0;gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.025,now+1.6);gain.gain.linearRampToValueAtTime(0,now+8);osc.connect(gain);gain.connect(audioMaster);osc.start(now);osc.stop(now+8.1);});}
async function toggleSound(force){const desired=typeof force==='boolean'?force:!state.sound;if(desired){try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)throw new Error('not supported');if(!audioContext){audioContext=new AC();audioMaster=audioContext.createGain();audioMaster.gain.value=mediaDucking?0:.55;audioMaster.connect(audioContext.destination);}await audioContext.resume();state.sound=true;duckMedia(mediaDucking);chord();clearInterval(audioTimer);audioTimer=setInterval(chord,6500);toast('背景音乐已开启 · 轻柔合成纯音乐');}catch(e){state.sound=false;toast('此浏览器暂不能播放背景音乐，阅读不受影响。')}}else{state.sound=false;clearInterval(audioTimer);audioTimer=null;if(audioContext)audioContext.suspend().catch(()=>{});}if($('soundButton')){$('soundButton').setAttribute('aria-pressed',String(state.sound));$('soundButton').textContent=state.sound?'音乐开':'音乐关';}if(state.panel==='menu')renderPanel('menu');}
function next(delta){if(viewerClosing)return;const i=Math.max(0,Math.min(chapters.length-1,(state.viewer?viewerRequestedIndex:state.index)+delta));if(i===(state.viewer?viewerRequestedIndex:state.index))return;if(state.viewer)openViewer(i);else go(i);}
function wire(){
 document.addEventListener('click',captureImmersiveTap,true);
 document.addEventListener('pointerdown',()=>{immersive.keyboard=false;immersive.pointerHeld=true;clearTimeout(immersive.timer);},true);
 document.addEventListener('pointerup',()=>{immersive.pointerHeld=false;scheduleChrome();},true);
 document.addEventListener('pointercancel',()=>{immersive.pointerHeld=false;scheduleChrome();},true);
 window.addEventListener('blur',()=>{immersive.pointerHeld=false;scheduleChrome();});
 document.addEventListener('keydown',e=>{if(['Tab','ArrowLeft','ArrowRight','Enter',' '].includes(e.key)&&!e.target.closest('input,textarea,select')){immersive.keyboard=true;setChrome(true);}else if(e.key==='Escape'&&immersive.active&&!state.viewer&&!state.panel&&!fullscreenElement()){setChrome(!immersive.chrome);}},true);
 document.addEventListener('focusin',()=>{if(immersive.keyboard)setChrome(true);});
 document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled)return;if(b.hasAttribute('data-inline-close')){e.stopPropagation();stopInlineMedia();return;}if(b.hasAttribute('data-inline-play')){e.stopPropagation();const host=b.closest('[data-inline-host]');startInlineMedia(host,mediaById(host?.dataset.inlineMedia));return;}if(b.dataset.inlineShortcut){const host=currentInlineHost();if(host)startInlineMedia(host,mediaById(b.dataset.inlineShortcut));return;}if(b.hasAttribute('data-fullscreen')){toggleFullscreen();return;}if(b.dataset.go!==undefined){closePanel();if(state.viewer)openViewer(Number(b.dataset.go));else go(Number(b.dataset.go),{focus:true});return;}if(b.dataset.open!==undefined){openViewer(Number(b.dataset.open));return;}if(b.dataset.mode){setMode(b.dataset.mode);return;}if(b.dataset.media!==undefined){if(b.dataset.media==='__node__'){activeMediaScope=state.index;activeMediaId=null;}else activeMediaId=b.dataset.media;showPanel('media');return;}if(b.hasAttribute('data-media-library')){activeMediaId=null;renderPanel('media');return;}if(b.dataset.narrate){narrate(b.dataset.narrate);return;}if(b.dataset.reference!==undefined){referenceIndex=Number(b.dataset.reference);showPanel('reference');return;}if(b.hasAttribute('data-save-note')){saveMemory();return;}if(b.dataset.panel){if(b.dataset.panel==='media'){activeMediaId=null;activeMediaScope=null;}showPanel(b.dataset.panel);return;}if(b.hasAttribute('data-switch-space')){setMode('space');return;}if(b.hasAttribute('data-sound')){toggleSound();return;}if(b.hasAttribute('data-reduce')){state.reduced=!state.reduced;nav();renderPanel('technical');return;}if(b.dataset.scene!==undefined){setMode('space');setScene(Number(b.dataset.scene));closePanel();return;}if(b.dataset.exhibit!==undefined&&Date.now()>suppressClick){const i=Number(b.dataset.exhibit);if(i===state.index)openViewer(i);else go(i);}});
$('prev').addEventListener('click',()=>next(-1));$('next').addEventListener('click',()=>next(1));$('brand').addEventListener('click',()=>{closePanel();if(state.viewer)closeViewer();go(0);setMode('read');});$('menuButton').addEventListener('click',()=>showPanel('menu'));$('spaceScene').addEventListener('click',()=>showPanel('scenes'));$('panelClose').addEventListener('click',()=>closePanel());$('viewerClose').addEventListener('click',()=>closeViewer());$('viewerPrev').addEventListener('click',()=>next(-1));$('viewerNext').addEventListener('click',()=>next(1));$('viewerStory').addEventListener('click',()=>toggleStory());$('viewerArt').addEventListener('click',e=>{if(!e.target.closest('button,select,video,audio,.inline-media-layer')&&Date.now()>suppressClick)toggleStory()});$('soundButton')?.addEventListener('click',()=>toggleSound());
$('panel').addEventListener('cancel',e=>cancelDialog(e,closePanel));$('viewer').addEventListener('cancel',e=>cancelDialog(e,closeViewer));$('panelBody').addEventListener('play',e=>{if(e.target.id==='contentMedia')duckMedia(true)},true);$('panelBody').addEventListener('pause',e=>{if(e.target.id==='contentMedia')duckMedia(false)},true);$('panelBody').addEventListener('ended',e=>{if(e.target.id==='contentMedia')duckMedia(false)},true);$('panelBody').addEventListener('error',e=>{if(e.target.id==='contentMedia'){duckMedia(false);toast('短片暂时无法播放，图文内容仍可继续阅读。')}},true);$('panelBody').addEventListener('input',e=>{if(e.target.hasAttribute('data-echo-volume')){state.echo.volume=Number(e.target.value);e.target.nextElementSibling.textContent=state.echo.volume+'%';}});
document.addEventListener('change',e=>{if(!e.target.matches('.frame-media-select'))return;const host=e.target.closest('[data-inline-host]');host.dataset.inlineMedia=e.target.value;const m=mediaById(e.target.value);host.classList.toggle('is-live-photo',isLiveMedia(m));setInlineLabel(host,m,false);startInlineMedia(host,m);});
document.addEventListener('keydown',e=>{if(state.panel||/^(INPUT|TEXTAREA|SELECT|VIDEO|AUDIO)$/.test(e.target.tagName))return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();next(e.key==='ArrowRight'?1:-1);}else if(e.key==='Enter'&&state.mode==='space'&&!state.viewer&&!e.target.closest('button,a')){e.preventDefault();openViewer();}});
const vp=$('galleryViewport');vp.addEventListener('scroll',()=>{if(vp.scrollLeft)vp.scrollLeft=0;if(vp.scrollTop)vp.scrollTop=0;},{passive:true});vp.addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('video,audio,select,.frame-media-actions,.frame-media-close'))return;drag={x:e.clientX,y:e.clientY,dx:0,dy:0,active:false,id:e.pointerId};});vp.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;drag.dx=e.clientX-drag.x;drag.dy=e.clientY-drag.y;if(!drag.active&&Math.abs(drag.dx)>10&&Math.abs(drag.dx)>Math.abs(drag.dy)*1.3){drag.active=true;vp.setPointerCapture?.(e.pointerId);$('galleryTrack').classList.add('dragging');}if(drag.active){e.preventDefault();if(!dragRAF)dragRAF=requestAnimationFrame(()=>{dragRAF=0;if(drag)$('galleryTrack').style.transform=`translate3d(${-state.index*step+drag.dx*.8}px,0,0)`;});}});
function endDrag(e){if(!drag)return;const d=drag;drag=null;cancelAnimationFrame(dragRAF);dragRAF=0;$('galleryTrack').classList.remove('dragging');if(d.active){suppressClick=Date.now()+500;if(e.type!=='pointercancel'&&Math.abs(d.dx)>45)next(d.dx<0?1:-1);layoutSpace();}try{vp.releasePointerCapture(e.pointerId)}catch(err){}}
vp.addEventListener('pointerup',endDrag);vp.addEventListener('pointercancel',endDrag);
let viewSwipe=null;$('viewerArt').addEventListener('pointerdown',e=>{if(e.target.closest('video,audio,select,.frame-media-actions,.frame-media-close'))return;viewSwipe={x:e.clientX,y:e.clientY}});$('viewerArt').addEventListener('pointerup',e=>{if(!viewSwipe)return;const dx=e.clientX-viewSwipe.x,dy=e.clientY-viewSwipe.y;viewSwipe=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.4){suppressClick=Date.now()+500;next(dx<0?1:-1)}});$('viewerArt').addEventListener('pointercancel',()=>viewSwipe=null);
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{refreshImmersion();if(state.viewer)measureViewer();else layoutSpace();},80)});reduceQuery.addEventListener?.('change',e=>{state.reduced=e.matches;nav();});window.addEventListener('popstate',async e=>{if(historyBackPending){historyBackPending=false;if(state.viewer)pushOverlayHistory('viewer');else if(state.panel)pushOverlayHistory('panel');return;}if(e.state?.nodeSession===historySession&&e.state?.nodeOverlay){if(e.state.nodeOverlay==='viewer'){if(state.panel)closePanel(true);openViewer(e.state.index,true);}else{if(state.viewer)await closeViewer(true);if(history.state?.nodeSession===historySession&&history.state?.nodeOverlay==='panel'&&history.state?.panel===e.state.panel)showPanel(e.state.panel||'menu',true);}}else{if(state.panel)closePanel(true);if(state.viewer)closeViewer(true);}});document.addEventListener('visibilitychange',()=>{if(document.hidden){stopInlineMedia();if(state.sound)toggleSound(false);document.querySelectorAll('video,audio').forEach(v=>v.pause());if(spoken){speechSynthesis.cancel();spoken=null;duckMedia(false);}}});window.addEventListener('pagehide',()=>{stopInlineMedia();document.querySelectorAll('video').forEach(v=>v.pause());if(state.sound)toggleSound(false)});
}
if(screen.orientation?.addEventListener)screen.orientation.addEventListener('change',onOrientationChange);else window.addEventListener('orientationchange',onOrientationChange);
document.title=book.title+' · NODE';$('brand').querySelector('span').textContent=book.title;document.querySelector('.space-wordmark').textContent=book.subtitle||book.title;
if(!chapters.length){$('readerContent').innerHTML='<p>内容未能载入，请重新打开文件。</p>';return;}
const oldViewerArt=$('viewerArt'),viewerStage=document.createElement('div');for(const a of oldViewerArt.attributes)viewerStage.setAttribute(a.name,a.value);viewerStage.setAttribute('role','group');oldViewerArt.replaceWith(viewerStage);
window.NODEFrames?.apply(book,scenes[state.scene]);
$('bootStatus')?.remove();wire();document.addEventListener('fullscreenchange',onFullscreenChange);document.addEventListener('webkitfullscreenchange',onFullscreenChange);renderReader();buildSpace();nav();preload();refreshImmersion();syncFullscreen();
window.NODE={state,book,chapters,go,setMode,openViewer,closeViewer,setScene,toggleStory,showPanel,closePanel,toggleSound,layoutSpace,asset,decode,toggleFullscreen,refreshImmersion,immersive,setChrome,mediaItems,startInlineMedia,stopInlineMedia,primaryInline,currentInlineHost,get inlineSession(){return inlineSession}};
window.NODE.dispatch=function(action){if(action==='next')next(1);else if(action==='previous')next(-1);else if(action==='enter')openViewer();else if(action==='back'){if(state.panel)closePanel();else closeViewer();}else if(action==='story')toggleStory();else if(action==='controls')setChrome(true);};
})();
