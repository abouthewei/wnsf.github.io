(() => {
 const params=new URLSearchParams(location.search), kind=params.get('kind')==='video'?'video':'web';
 const scene=kind, session=params.get('session')||'', title=kind==='video'?'Bilibili':'搜狐官网';
 const src=kind==='video'?'https://www.bilibili.com/':'https://www.sohu.com/';
 const frame=document.querySelector('#site');
 const notice=document.querySelector('#notice');
 frame.addEventListener('load',()=>{notice.textContent=kind==='video'?'Bilibili 整站已嵌入，可在左侧页面浏览；遥控器无法跨域操作站内控件。':'搜狐官网已嵌入，可在左侧页面浏览；遥控器无法跨域操作站内控件。'});
 frame.src=src;
 document.title=title+' · TimeEcho';document.querySelector('#brand').textContent=title;
 const open=document.querySelector('#openSite');open.href=kind==='video'?'https://www.bilibili.com/':'https://www.sohu.com/';
 let epoch=0,disposed=false;
 function dispatch(type){notice.textContent=kind==='video'?'当前是 Bilibili 整站页面；网页由站点原生控件操作，遥控器无法跨域控制站内内容。':'当前是搜狐真实网页；遥控器无法跨域读取页面控件，阅读请在页面内操作。';return notice.textContent;}
 SceneHost.mount({scene,state:()=>({epoch,mode:kind==='video'?'video':'web',modeLabel:title,title,index:0,total:1,focus:'外站页面',volume:50,playing:false,progress:0,positionLabel:kind==='video'?'Bilibili 整站':'搜狐官网'}),dispatch,cleanup:()=>{disposed=true;frame.src='about:blank';}});
 notice.textContent=kind==='video'?'正在加载 Bilibili 整站；若未显示，请点击右上角另开官网。':'搜狐官网已嵌入。可直接在网页内操作；遥控器不能读取或操作跨域站内内容。';
})();
