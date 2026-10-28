(() => {
 const $=id=>document.getElementById(id),audio=$('audio');
 const tracks=[{title:'晨间留白',theme:'warm',src:'audio/morning.wav',kind:'合成演示 · 温暖 / 轻盈'},{title:'远行回声',theme:'blue',src:'audio/journey.wav',kind:'合成演示 · 流动 / 平静'},{title:'夜航',theme:'purple',src:'audio/night.wav',kind:'合成演示 · 夜色 / 缓慢'}];
 let selected=0,active=0,epoch=0,seeking=false,repeat='list',focus=null,bridge,imported=[];
 const time=t=>Number.isFinite(t)?`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`:'0:00';
 function note(text){$('playerStatus').textContent=text;return text;}
 function drawList(){
  $('trackList').replaceChildren(...tracks.map((track,i)=>{
   const b=document.createElement('button');b.className='track'+(i===selected?' selected':'')+(i===active?' active':'');b.dataset.track=String(i);b.setAttribute('aria-label','播放：'+track.title);
   const num=document.createElement('span');num.className='track-index';num.textContent=String(i+1).padStart(2,'0');const art=document.createElement('span');art.className='track-art '+track.theme;const copy=document.createElement('span');copy.className='track-copy';const title=document.createElement('span');title.className='track-title';title.textContent=track.title;const kind=document.createElement('span');kind.className='track-kind';kind.textContent=track.kind;copy.append(title,kind);const status=document.createElement('span');status.className='track-state';status.textContent=i===active?(!audio.paused?'播放中':'已选'):'↗';b.append(num,art,copy,status);b.onclick=()=>{selected=i;playTrack(i);};return b;
  }));$('trackCount').textContent=String(tracks.length).padStart(2,'0')+' 首';
 }
 function render(){
  const t=tracks[active];$('trackTitle').textContent=t.title;$('coverTitle').textContent=t.title;$('album').dataset.theme=t.theme;$('kind').textContent=t.imported?'本地导入音频 · 来源由导入者确认':'合成演示音轨 · 非 AI 生成歌曲';$('artist').textContent=t.imported?'本地文件 / 仅当前浏览器':'TimeEcho / Instrumental Study';$('play').textContent=audio.paused?'▶':'Ⅱ';$('play').setAttribute('aria-label',audio.paused?'播放音乐':'暂停音乐');$('elapsed').textContent=time(audio.currentTime);$('duration').textContent=time(audio.duration);$('seek').value=Number.isFinite(audio.duration)&&audio.duration?audio.currentTime/audio.duration*100:0;$('seekMode').setAttribute('aria-pressed',String(seeking));$('modeHelp').textContent=seeking?'进度模式：圆环每步调整 5 秒，确认或返回退出。':'浏览模式：圆环选曲，确认播放；方向键选择控件。';document.body.dataset.seeking=String(seeking);$('repeat').dataset.active=String(repeat!=='off');$('repeat').textContent=repeat==='one'?'↻¹':'↻';
  document.querySelectorAll('.track').forEach((el,i)=>{el.classList.toggle('selected',i===selected);el.classList.toggle('active',i===active);el.querySelector('.track-state').textContent=i===active?(!audio.paused?'播放中':'已选'):'↗';});
 }
 function load(i){active=i;audio.src=tracks[i].src;audio.load();epoch++;render();}
 async function playTrack(i){if(i!==active||!audio.getAttribute('src'))load(i);selected=i;try{await audio.play();note('正在播放：'+tracks[i].title);}catch{note('未能播放，请重试或点击页面播放按钮。');}render();}
 function mark(el){document.querySelectorAll('.remote-focus').forEach(x=>x.classList.remove('remote-focus'));focus=el;if(el){el.classList.add('remote-focus');el.focus({preventScroll:true});el.scrollIntoView({block:'nearest'});}}
 function selectTrack(delta){selected=Math.max(0,Math.min(tracks.length-1,selected+delta));mark(document.querySelector(`[data-track="${selected}"]`));render();return note('已选择 '+tracks[selected].title+'，确认后播放');}
 function seek(delta){if(!Number.isFinite(audio.duration))return note('音频尚未就绪');audio.currentTime=Math.max(0,Math.min(audio.duration,audio.currentTime+delta));render();return note('进度 '+time(audio.currentTime));}
 async function dispatch(type){
  if(type==='NEXT_ITEM'||type==='PREV_ITEM')return seeking?seek(type==='NEXT_ITEM'?5:-5):selectTrack(type==='NEXT_ITEM'?1:-1);
  if(type==='CONFIRM'){if(seeking){seeking=false;epoch++;render();return note('退出进度调整');}if(focus&&!focus.matches('[data-track]')){if(focus.id==='importAudio')return note('请点击页面“导入我的音频”选择本地文件');focus.click();return note('已执行当前控件');}await playTrack(selected);return $('playerStatus').textContent;}
  if(type==='PLAY_PAUSE'){if(audio.paused)await playTrack(active);else{audio.pause();note('音乐已暂停');}return $('playerStatus').textContent;}
  if(type==='NEXT_TRACK'){selected=(active+1)%tracks.length;await playTrack(selected);return note('下一首：'+tracks[selected].title);}
  if(type==='VOLUME_UP'||type==='VOLUME_DOWN'){audio.volume=Math.max(0,Math.min(1,audio.volume+(type==='VOLUME_UP'?.05:-.05)));return note('音量 '+Math.round(audio.volume*100)+'%');}
  if(type==='SEEK_MODE'){seeking=!seeking;epoch++;focus=null;render();return note(seeking?'进入进度调整，圆环每步 5 秒':'退出进度调整');}
  if(type==='TRACKS'||type==='BACK'){seeking=false;epoch++;mark(document.querySelector(`[data-track="${selected}"]`));render();return note('回到歌曲列表');}
  if(type==='REPEAT'){repeat={list:'one',one:'off',off:'list'}[repeat];render();return note('循环：'+{list:'列表循环',one:'单曲循环',off:'关闭'}[repeat]);}
  if(type.startsWith('NAV_')){
   const dir=type.slice(4);if(seeking)return seek(['LEFT','UP'].includes(dir)?-5:5);
   if(!focus||focus.matches('[data-track]')){if(dir==='UP'||dir==='DOWN')return selectTrack(dir==='UP'?-1:1);mark($(dir==='LEFT'?'play':'seekMode'));return note('已选择播放器控件');}
   const list=[$('repeat'),$('previous'),$('play'),$('next'),$('seekMode')];let i=list.indexOf(focus);if(dir==='DOWN'){mark(document.querySelector(`[data-track="${selected}"]`));return note('回到歌曲列表');}mark(list[Math.max(0,Math.min(list.length-1,i+(['LEFT','UP'].includes(dir)?-1:1)))]);return note('已选择播放器控件');
  }
  if(type==='HOME'||type==='RESET'){audio.pause();seeking=false;selected=0;load(0);if(type==='RESET')audio.volume=.5;mark(document.querySelector('[data-track="0"]'));return note('回到音乐首页');}
  if(type==='STANDBY'){audio.pause();return note('音乐已暂停，演示待机');}if(type==='WAKE')return note('已唤醒，按播放继续');if(type==='SCAN')return note('模拟识别音乐卡，保留当前播放');return note('音乐场景不支持此操作');
 }
 $('play').onclick=()=>dispatch('PLAY_PAUSE');$('previous').onclick=()=>{selected=(active-1+tracks.length)%tracks.length;playTrack(selected);};$('next').onclick=()=>dispatch('NEXT_TRACK');$('seekMode').onclick=()=>dispatch('SEEK_MODE');$('repeat').onclick=()=>dispatch('REPEAT');$('seek').oninput=()=>{if(Number.isFinite(audio.duration))audio.currentTime=Number($('seek').value)/100*audio.duration;};
 $('importAudio').onchange=()=>{let added=0;for(const file of $('importAudio').files){if(!file.type.startsWith('audio/')&&!/\.(mp3|wav|m4a|ogg|flac)$/i.test(file.name))continue;const src=URL.createObjectURL(file);imported.push(src);tracks.push({title:file.name.replace(/\.[^.]+$/,''),theme:'blue',src,kind:'本地导入 · 未上传',imported:true});added++;}drawList();note(added?'已导入 '+added+' 首音频，圆环选择后确认播放':'请选择可播放的音频文件');epoch++;$('importAudio').value='';};
 for(const e of ['timeupdate','loadedmetadata','play','pause','durationchange'])audio.addEventListener(e,render);
 audio.addEventListener('error',()=>note('音频文件无法解码，请换用 MP3、WAV 或浏览器支持的格式。'));
 audio.onended=()=>{if(repeat==='one'){audio.currentTime=0;playTrack(active);}else if(active<tracks.length-1||repeat==='list'){selected=(active+1)%tracks.length;playTrack(selected);}else note('列表播放结束');};
 audio.volume=.5;drawList();load(0);bridge=SceneHost.mount({scene:'music',dispatch,state:()=>({epoch,mode:seeking?'seek':'music',modeLabel:seeking?'音乐 · 进度调整':'音乐播放器',title:tracks[active].title,index:selected,total:tracks.length,focus:seeking?'播放进度':focus?.getAttribute('aria-label')||tracks[selected].title,volume:Math.round(audio.volume*100),playing:!audio.paused,progress:audio.currentTime,positionLabel:time(audio.currentTime)+' / '+time(audio.duration)}),cleanup:()=>{audio.pause();imported.forEach(url=>URL.revokeObjectURL(url));}});
})();
