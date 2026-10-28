const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../bridge/scene-host.js'),'utf8');
function setup(){
 const handlers={},messages=[],parent={postMessage:m=>messages.push(m)};let calls=0,cleanups=0;
 const scope={URLSearchParams,location:{search:'?session=current',origin:'http://demo.local'},parent,window:{},document:{addEventListener(){}},addEventListener:(name,fn)=>handlers[name]=fn,removeEventListener(){},setInterval(){return 1;},clearInterval(){},console,Date,Promise,Number,Map};
 vm.runInNewContext(source,scope);scope.window.SceneHost.mount({scene:'music',state:()=>({epoch:4}),dispatch:async()=>{calls++;return 'ok';},cleanup:()=>cleanups++});
 const send=(extra={},event={})=>handlers.message({origin:'http://demo.local',source:parent,data:{channel:'timeecho-remote-v1',scene:'music',session:'current',type:'NEXT_ITEM',seq:1,sentAt:Date.now(),epoch:4,...extra},...event});
 return {send,messages,get calls(){return calls;},get cleanups(){return cleanups;}};
}
const flush=()=>new Promise(resolve=>setImmediate(resolve));
test('duplicate queued messages execute once, and replays receive the recorded ACK',async()=>{const s=setup();s.send();s.send();await flush();assert.equal(s.calls,1);s.send();assert.equal(s.calls,1);assert.equal(s.messages.at(-1).status,'executed');});
test('different origin, sender, scene and session cannot execute a command',async()=>{const s=setup();s.send({}, {origin:'http://other.local'});s.send({}, {source:{}});s.send({scene:'web'});s.send({session:'previous'});await flush();assert.equal(s.calls,0);});
test('stale context and expired messages are rejected',async()=>{const s=setup();s.send({epoch:3});s.send({seq:2,sentAt:Date.now()-3000});await flush();assert.equal(s.calls,0);assert.equal(s.messages.filter(m=>m.type==='ACK'&&m.status==='expired').length,2);});
test('disposing a scene stops media and prevents later commands',async()=>{const s=setup();s.send({type:'DISPOSE'});s.send({seq:2});await flush();assert.equal(s.cleanups,1);assert.equal(s.calls,0);});
test('commands queued before a scene switch are also cancelled',async()=>{const s=setup();s.send();s.send({type:'DISPOSE'});await flush();assert.equal(s.calls,0);});
