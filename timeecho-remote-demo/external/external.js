(() => {
 const params=new URLSearchParams(location.search),kind=params.get('kind')==='video'?'video':'web';
 const scene=kind,session=params.get('session')||'',title=kind==='video'?'Bilibili':'搜狐官网';
 const src=kind==='video'?'https://www.bilibili.com/':'https://www.sohu.com/';
 const frame=document.querySelector('#site'),notice=document.querySelector('#notice');
 const channel='timeecho-external-bridge-v1',pending=new Map();
 let epoch=0,extensionConnected=false,bridge;
 const pageState={title,focus:'网页浏览',focusMode:'browse',playing:false,progress:0,duration:0,volume:50,scrollY:0,scrollProgress:0,hasVideo:false};
 const connectionNotice=()=>extensionConnected
  ?`${title} 已连接：方向键选择控件，转盘滚动页面；焦点进入播放器后，转盘调整进度。`
  :'未连接扩展。请在安装新版扩展的 Chrome 中打开本页；ChatGPT 内置浏览器不支持 Chrome 扩展。';

 frame.addEventListener('load',()=>{notice.textContent=extensionConnected?connectionNotice():`${title}页面已加载；${connectionNotice()}`;});
 frame.src=src;
 document.title=title+' · TimeEcho';
 document.querySelector('#brand').textContent=title;
 const open=document.querySelector('#openSite');open.href=src;
 document.querySelector('#extensionHelp').hidden=false;
 document.querySelector('#extensionZip').hidden=false;

 addEventListener('message',event=>{
  if(event.origin!==location.origin||event.source!==parent||event.data?.channel!==channel||event.data?.scene!==scene)return;
  const message=event.data;
  if(message.type==='STATUS'){
   extensionConnected=!!message.connected;
   notice.textContent=connectionNotice();
   bridge?.update();
  }
  if(message.type==='STATE'&&message.state){Object.assign(pageState,message.state);bridge?.update();}
  if(message.type==='RESULT'){
   const resolve=pending.get(message.id);
   if(resolve){pending.delete(message.id);clearTimeout(resolve.timer);if(message.state)Object.assign(pageState,message.state);resolve(message.detail||'网页已执行操作');bridge?.update();}
  }
 });

 function dispatch(type){
  if(!extensionConnected){notice.textContent=connectionNotice();return notice.textContent;}
  const id=crypto.randomUUID();
  return new Promise(resolve=>{
   const timer=setTimeout(()=>{pending.delete(id);resolve('扩展未及时响应；请确认已重新加载 v1.2.0 并刷新页面。');},3000);
   pending.set(id,Object.assign(resolve,{timer}));
   parent.postMessage({channel,type:'COMMAND',scene,id,command:type},location.origin);
  });
 }

 bridge=SceneHost.mount({scene,serial:false,state:()=>({
  epoch,mode:kind==='video'?'video':'web',
  modeLabel:`${title} · ${extensionConnected?'遥控已连接':'待连接扩展'}`,
  title:pageState.title||title,index:0,total:1,focus:pageState.focus,
  volume:pageState.volume,playing:pageState.playing,progress:pageState.progress,
  positionLabel:pageState.focusMode==='player'&&pageState.hasVideo
   ?`${Math.floor(pageState.progress||0)} / ${Math.floor(pageState.duration||0)} 秒`
   :`页面滚动 ${pageState.scrollProgress||0}%`
 }),dispatch,cleanup:()=>{frame.src='about:blank';}});

 parent.postMessage({channel,type:'STATUS_REQUEST',scene},location.origin);
 notice.textContent=`正在加载${title}页面；${connectionNotice()}`;
})();
