(() => {
 const params=new URLSearchParams(location.search), kind=params.get('kind')==='video'?'video':'web';
 const scene=kind, session=params.get('session')||'', title=kind==='video'?'哔哩哔哩视频':'搜狐官网';
 const src=kind==='video'?'https://player.bilibili.com/player.html?bvid=BV1B7411m7LV&autoplay=0&danmaku=0':'https://www.sohu.com/';
 const frame=document.querySelector('#site'); frame.src=src;
 document.title=title+' · TimeEcho';document.querySelector('#brand').textContent=title;
 const open=document.querySelector('#openSite');open.href=kind==='video'?'https://www.bilibili.com/video/BV1B7411m7LV':'https://www.sohu.com/';
 let epoch=0,disposed=false;const notice=document.querySelector('#notice');
 function dispatch(type){notice.textContent=kind==='video'?'当前是 B 站真实播放器；播放、暂停、进度和音量请在播放器内操作，遥控器无法跨域控制。':'当前是搜狐真实网页；遥控器无法跨域读取页面控件，阅读请在页面内操作。';return notice.textContent;}
 SceneHost.mount({scene,state:()=>({epoch,mode:kind==='video'?'video':'web',modeLabel:title,title,index:0,total:1,focus:'外站页面',volume:50,playing:false,progress:0,positionLabel:kind==='video'?'B站官方外链播放器':'搜狐官网'}),dispatch,cleanup:()=>{disposed=true;frame.src='about:blank';}});
 notice.textContent=kind==='video'?'加载 B 站官方外链播放器示例；请点击播放器内的播放控件。':'搜狐官网已嵌入。可直接在网页内操作；遥控器不能读取或操作跨域站内内容。';
})();
