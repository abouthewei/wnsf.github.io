/* Shared semantic input host for music and ordinary-web adapters. */
(() => {
  const session = new URLSearchParams(location.search).get('session') || '';
  const origin = location.origin;
  window.SceneHost = {
    mount({scene, state, dispatch, cleanup = () => {}}) {
      const cache = new Map(); let chain = Promise.resolve(), disposed = false;
      const post = (type, extra = {}) => parent.postMessage({channel:'timeecho-node-v1',scene,session,type,...extra},origin);
      const update = () => { if(!disposed) post('STATE',{state:state()}); };
      const onMessage = event => {
        const m = event.data;
        if(event.origin !== origin || event.source !== parent || m?.channel !== 'timeecho-remote-v1' || m.session !== session || m.scene !== scene) return;
        if(m.type === 'HELLO') { post('READY',{state:state()}); return; }
        if(m.type === 'DISPOSE') { disposed=true;cleanup();return; }
        if(disposed || !Number.isSafeInteger(m.seq) || typeof m.type !== 'string') return;
        if(cache.has(m.seq)) { post('ACK',cache.get(m.seq)); return; }
        cache.set(m.seq,{seq:m.seq,status:'pending'});
        chain=chain.then(async()=>{
          if(disposed)return;
          let result;
          if(Date.now()-m.sentAt>2500 || (m.epoch!==undefined && m.epoch!==state().epoch)) result={seq:m.seq,status:'expired',detail:'页面上下文已变化，旧操作未执行'};
          else try {result={seq:m.seq,status:'executed',detail:await dispatch(m.type)};}
          catch(error) {console.error('Scene action failed',m.type,error);result={seq:m.seq,status:'error',detail:'操作未完成，请重试'};}
          if(disposed)return;
          result.state=state();cache.set(m.seq,result);if(cache.size>150)cache.delete(cache.keys().next().value);post('ACK',result);update();
        });
      };
      addEventListener('message',onMessage);
      addEventListener('pagehide',()=>{disposed=true;cleanup();},{once:true});
      document.addEventListener('keydown',event=>{
        if(event.target.closest('input,textarea,select,[contenteditable="true"]'))return;
        const keys={ArrowLeft:'NAV_LEFT',ArrowRight:'NAV_RIGHT',ArrowUp:'NAV_UP',ArrowDown:'NAV_DOWN',Enter:'CONFIRM',Escape:'BACK',' ':'PLAY_PAUSE',Home:'HOME'};
        if(keys[event.key]){event.preventDefault();Promise.resolve(dispatch(keys[event.key])).then(update).catch(console.error);}
      });
      post('READY',{state:state()});const timer=setInterval(update,200);
      return {update,notice:detail=>post('NOTICE',{detail}),destroy:()=>{disposed=true;clearInterval(timer);removeEventListener('message',onMessage);cleanup();}};
    }
  };
})();
