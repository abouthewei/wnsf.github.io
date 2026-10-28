(() => {
 const params=new URLSearchParams(location.search), kind=params.get('kind')==='video'?'video':'web';
 const scene=kind, session=params.get('session')||'', title=kind==='video'?'Bilibili':'搜狐官网';
 const src=kind==='video'?'https://www.bilibili.com/':'https://www.sohu.com/';
 const frame=document.querySelector('#site'),notice=document.querySelector('#notice');
 const channel='timeecho-bilibili-bridge-v1',pending=new Map();
 let epoch=0,extensionConnected=false,bridge,disposed=false;
 const pageState={title,focus:'Bilibili 整站',playing:false,progress:0,duration:0,volume:50,scrollY:0,hasVideo:false};
 frame.addEventListener('load',()=>{notice.textContent=kind==='video'?'Bilibili 整站已加载；遥控器控制需要安装 TimeEcho 扩展。':'搜狐官网已嵌入，可在左侧页面浏览；站内交互使用官网控件。'});
 frame.src=src;
 document.title=title+' · TimeEcho';document.querySelector('#brand').textContent=title;
 const open=document.querySelector('#openSite');open.href=kind==='video'?'https://www.bilibili.com/':'https://www.sohu.com/';document.querySelector('#extensionHelp').hidden=kind!=='video';document.querySelector('#extensionZip').hidden=kind!=='video';
 addEventListener('message',event=>{
  if(kind!=='video'||event.origin!==location.origin||event.source!==parent||event.data?.channel!==channel)return;
  const message=event.data;
  if(message.type==='STATUS'){extensionConnected=!!message.connected;notice.textContent=extensionConnected?'TimeEcho 扩展已连接到当前标签页的 Bilibili，可以使用右侧遥控器。':'尚未连接 TimeEcho 扩展；页面可浏览，安装扩展后可用遥控器操作。';bridge?.update();}
  if(message.type==='STATE'&&message.state){Object.assign(pageState,message.state);bridge?.update();}
  if(message.type==='RESULT'){
   const resolve=pending.get(message.id);if(resolve){pending.delete(message.id);clearTimeout(resolve.timer);if(message.state)Object.assign(pageState,message.state);resolve(message.detail||'Bilibili 已执行操作');bridge?.update();}
  }
 });
 function dispatch(type){
  if(kind!=='video'){notice.textContent='搜狐官网已嵌入；站内交互请使用左侧官网控件。';return notice.textContent;}
  if(!extensionConnected){notice.textContent='尚未连接 TimeEcho 扩展。安装并启用后，遥控器即可操作当前标签页中的 Bilibili。';return notice.textContent;}
  const id=crypto.randomUUID();
  return new Promise(resolve=>{const timer=setTimeout(()=>{pending.delete(id);resolve('扩展未响应；请刷新 Bilibili 页面后重试。');},3000);pending.set(id,Object.assign(resolve,{timer}));parent.postMessage({channel,type:'COMMAND',scene:'video',id,command:type},location.origin);});
 }
 bridge=SceneHost.mount({scene,state:()=>({epoch,mode:kind==='video'?'video':'web',modeLabel:kind==='video'?(extensionConnected?'Bilibili · 遥控已连接':'Bilibili 整站 · 待连接扩展'):'搜狐官网',title,index:0,total:1,focus:kind==='video'?pageState.focus:'外站页面',volume:pageState.volume,playing:pageState.playing,progress:pageState.progress,positionLabel:kind==='video'?(pageState.hasVideo?`${Math.floor(pageState.progress)} / ${Math.floor(pageState.duration||0)} 秒`:'Bilibili 整站'):'搜狐官网'}),dispatch,cleanup:()=>{disposed=true;frame.src='about:blank';}});
 if(kind==='video'){parent.postMessage({channel,type:'STATUS_REQUEST',scene:'video'},location.origin);notice.textContent='正在加载 Bilibili 整站；若未显示，请点击右上角另开官网。';}
 else notice.textContent='搜狐官网已嵌入；站内交互请使用左侧官网控件。';
})();
