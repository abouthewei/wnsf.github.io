(() => {
 const $=id=>document.getElementById(id),storeKey='timeecho-xhs-local-v1';
 const heart='<svg viewBox="0 0 24 24"><path d="M12 21 3 12C-2 5 7 0 12 7c5-7 14-2 9 5z"/></svg>';
 let book,notes=[],active=null,image=0,category='全部',view='discover',query='',savedScroll=0,local={liked:[],saved:[]};
 try{const stored=JSON.parse(localStorage.getItem(storeKey)||'{}');for(const key of ['liked','saved'])if(Array.isArray(stored[key]))local[key]=stored[key].filter(x=>typeof x==='string');}catch{}
 const definitions=[
  {id:'florence',chapter:1,others:[2,3],title:'佛罗伦萨｜原来城市真的可以像一幅画',category:'旅行',ratio:'3/4',text:['从米开朗琪罗广场看过去，穹顶、钟楼和阿诺河一起铺开。先别急着找某个景点，沿着河流慢慢看，会发现这座城市的比例。','这篇笔记把城市远景、教堂与老桥放在一起，方便用遥控器试试多图切换。封面经过适配裁切，详情里的照片保留原始比例。']},
  {id:'duomo',chapter:2,others:[1,4],title:'抬头看穹顶，才懂什么叫建筑的力量',category:'建筑',ratio:'4/5',text:['圣母百花大教堂的穹顶是这组图像的主角。从街道抬头看，与从远处辨认它，是两种不同的观看方式。','用上一张和下一张切换，可以把建筑局部与城市整体放在一起观察。图像对应的出处与授权说明保留在下面。']},
  {id:'ponte',chapter:3,others:[1,4],title:'阿诺河边的慢镜头：留一点时间给散步',category:'旅行',ratio:'4/3',text:['有时候让人记住一座城市的，是河岸、桥影和并不匆忙的一段路。看老桥，也可以顺着水面寻找建筑的倒影。','这里没有真实出行记录，也不是小红书用户发布的笔记；它是一组用来验证网页交互的原创示例文案。']},
  {id:'pazzi',chapter:5,others:[20,4],title:'喜欢安静空间的人，可以多看一眼这里',category:'建筑',ratio:'3/4',text:['帕齐礼拜堂的线条和比例，让空间有一种清楚的节奏。试着先看拱，再看墙面与开口之间的关系。','这组笔记把几种建筑空间放在一起。没有夸张的镜头，只有可以慢慢停留的图像。']},
  {id:'venus',chapter:6,others:[9,10],title:'在美术馆里，给一幅画多留几分钟',category:'艺术',ratio:'1/1',text:['面对《维纳斯的诞生》，可以先从画面的风、衣褶与人物朝向开始看。并不需要一次记住全部背景知识。','切换到另外两幅图像，观察构图和人物动作有什么不同。所有作品名与原始图像说明在来源区域保留。']},
  {id:'urbino',chapter:20,others:[5,4],title:'乌尔比诺｜把回廊当作一段缓慢的阅读',category:'建筑',ratio:'3/4',text:['重复的开口、转角与光线，常常让回廊有一种接近阅读的节奏。每往前一点，画面的关系就发生一点变化。','如果只看一张照片，很容易忽略这种联系。多图浏览可以把相似结构并排放进记忆。']},
  {id:'athens',chapter:23,others:[16,29],title:'看画的时候，你会先看人物还是空间？',category:'艺术',ratio:'4/3',text:['《雅典学院》的空间构图提供了一条很清楚的观看路径。可以先找到画面的中心，再沿着人物群组向两边移动。','这篇示例没有借用真实用户的观点或评论。文字为本地验证编写，图像仍按原作品说明标注。']},
  {id:'arnolfini',chapter:32,others:[41,37],title:'一幅画的细节，真的可以看很久',category:'艺术',ratio:'4/5',text:['《阿尔诺芬尼夫妇像》里，空间、物件和人物的关系都值得慢慢看。先看整体，再回到一个小细节，会得到不同的感受。','需要更长时间阅读时，可以用遥控器向下翻页滚动右侧正文，再按返回回到刚刚的笔记位置。']},
  {id:'palazzo',chapter:4,others:[1,2],title:'广场和街道，才是一座城市的日常',category:'旅行',ratio:'1/1',text:['同一座建筑在不同距离下，会呈现不同的性格。广场上的人、街道的走向与建筑的体量，共同组成了城市的日常。','这组照片来自已保留来源的项目素材，不是为了示例临时编造的旅行照片。']},
  {id:'garden',chapter:9,others:[6,10],title:'跟着画里的光，再看一次文艺复兴',category:'艺术',ratio:'3/4',text:['有时可以把观看的线索缩小到一束光、一片花园，或者一处衣褶。具体的细节，比抽象的标签更容易让人停下来。','如果喜欢这组图像，可以点一下收藏。它只会记在当前浏览器里，不会操作任何真实的小红书账号。']}
 ];
 const asset=(chapter,preview=false)=>{const c=book.chapters[chapter],key=preview&&book.assets[c.preview]?c.preview:c.visual;return '../node/'+String(book.assets[key]).replace(/^\.\//,'');};
 function persist(){try{localStorage.setItem(storeKey,JSON.stringify(local));$('pageStatus').textContent='已保存到本机';}catch{$('pageStatus').textContent='浏览器未允许保存，互动仅在本次页面有效';}}
 function matches(note){return (category==='全部'||note.category===category)&&(view==='discover'||local[view].includes(note.id))&&(!query||(note.title+note.category).includes(query));}
 function drawFeed(){
  const result=notes.filter(matches);$('feed').replaceChildren(...result.map(note=>{
   const b=document.createElement('button');b.className='note-card';b.dataset.note=note.id;b.setAttribute('aria-label','查看笔记：'+note.title);b.style.setProperty('--ratio',note.ratio);
   const cover=document.createElement('div');cover.className='cover-wrap';const img=document.createElement('img');img.className='note-cover';img.src=asset(note.chapter,true);img.alt=book.chapters[note.chapter].title;img.loading='lazy';const badge=document.createElement('span');badge.className='image-badge';badge.textContent='3 图';cover.append(img,badge);
   const title=document.createElement('div');title.className='note-card-title';title.textContent=note.title;const bottom=document.createElement('div');bottom.className='card-footer';const avatar=document.createElement('span');avatar.className='mini-avatar';avatar.textContent='旅';const author=document.createElement('span');author.textContent='旅途观察 · 示例';const likes=document.createElement('span');likes.className='card-heart';likes.dataset.liked=String(local.liked.includes(note.id));likes.innerHTML=heart+'<span>'+Number(local.liked.includes(note.id))+'</span>';bottom.append(avatar,author,likes);b.append(cover,title,bottom);b.onclick=()=>openNote(note);return b;
  }));$('emptyState').hidden=!!result.length;$('resultCount').textContent=result.length+' 篇示例';$('feedHeading').textContent=view==='saved'?'我的本地收藏':view==='liked'?'我在本机赞过的笔记':query?'搜索：'+query:'发现值得停留的日常';
 }
 function gallery(){const chapters=[active.chapter,...active.others],c=book.chapters[chapters[image]];$('noteImage').src=asset(chapters[image]);$('noteImage').alt=c.title;$('imageCount').textContent=(image+1)+' / '+chapters.length+' · '+c.title;$('previousImage').disabled=image===0;$('nextImage').disabled=image===chapters.length-1;}
 function drawActions(){for(const [key,id,label] of [['liked','likeNote','点赞'],['saved','saveNote','收藏']]){const on=local[key].includes(active.id);$(id).setAttribute('aria-pressed',String(on));$(id).querySelector('span').textContent=on?'已'+label:label;}}
 function openNote(note){
  active=note;image=0;savedScroll=scrollY;$('noteTitle').textContent=note.title;$('noteBody').replaceChildren(...note.text.map(text=>{const p=document.createElement('p');p.textContent=text;return p;}));$('noteTags').textContent='#'+note.category+' #欧洲观察 #本地交互示例';$('sourceDetails').open=false;
  $('noteSources').replaceChildren(...[note.chapter,...note.others].flatMap(index=>{const c=book.chapters[index],title=document.createElement('p');title.textContent=c.title+' · '+(c.caption||'');const detail=document.createElement('p');detail.textContent=(c.paragraphs||[]).join('\n');return [title,detail];}));
  gallery();drawActions();$('noteDialog').showModal();document.querySelector('.note-copy').scrollTop=0;
 }
 function closeNote(){if($('noteDialog').open)$('noteDialog').close();}
 $('closeNote').onclick=closeNote;$('previousImage').onclick=()=>{if(image>0){image--;gallery();}};$('nextImage').onclick=()=>{if(image<2){image++;gallery();}};
 for(const [key,id] of [['liked','likeNote'],['saved','saveNote']])$(id).onclick=()=>{if(!active)return;const i=local[key].indexOf(active.id);if(i<0)local[key].push(active.id);else local[key].splice(i,1);persist();drawActions();};
 $('noteDialog').addEventListener('close',()=>{const id=active?.id;drawFeed();const card=document.querySelector(`[data-note="${id}"]`);card?.focus({preventScroll:true});scrollTo({top:savedScroll,behavior:'instant'});});
 document.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>{category=b.dataset.category;document.querySelectorAll('[data-category]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));drawFeed();});
 document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view;document.querySelectorAll('[data-view]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));drawFeed();});
 $('searchForm').onsubmit=e=>{e.preventDefault();query=$('search').value.trim();drawFeed();};$('clearFilters').onclick=()=>{view='discover';category='全部';query='';$('search').value='';document.querySelectorAll('[data-view]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.view==='discover')));document.querySelectorAll('[data-category]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.category==='全部')));drawFeed();};
 $('aboutButton').onclick=()=>$('aboutDialog').showModal();$('closeAbout').onclick=()=>$('aboutDialog').close();
 fetch('../node/releases/20261023/data/book-data.json').then(r=>{if(!r.ok)throw Error('source data');return r.json();}).then(data=>{book=data;notes=definitions;drawFeed();}).catch(()=>{$('feedHeading').textContent='图片素材暂未载入，请刷新后重试';});
})();
