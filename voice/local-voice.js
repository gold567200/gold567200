/* On-device professor voice — page side. The worker (local-voice-worker.js) runs Supertonic 3 with the sherpa-onnx
   WebAssembly engine; this file starts it, sends text and turns the returned samples into playable WAV audio.
   window.GP_LOCAL = { VOICES, TOTAL_BYTES, load(onProgress), ready(), loading(), speak(text,{sid,speed}), wav(samples,rate) } */
(function(){
  const BASE=(function(){ const s=document.currentScript&&document.currentScript.src; return s?s.replace(/[^/]*$/,''):'voice/'; })();
  const SIZES={ 'sherpa-onnx-wasm-main-tts.wasm':13740219, 'duration_predictor.int8.onnx':3700147, 'text_encoder.int8.onnx':36416150, 'vector_estimator.int8.onnx':78400833,
    'vocoder.int8.onnx':25991073, 'tts.json':8253, 'unicode_indexer.bin':262144, 'voice.bin':517168 };
  const TOTAL=Object.values(SIZES).reduce((a,b)=>a+b,0);
  // Supertonic's ten built-in voices (F1–F5 are speaker ids 0–4, M1–M5 are 5–9). Descriptions come from measured pitch and pace.
  const VOICES=[
    {sid:6,id:'M2',label:'M2',desc:'Man · deep and measured'},
    {sid:9,id:'M5',label:'M5',desc:'Man · deep, slower pace'},
    {sid:8,id:'M4',label:'M4',desc:'Man · mid pitch'},
    {sid:5,id:'M1',label:'M1',desc:'Man · lighter'},
    {sid:7,id:'M3',label:'M3',desc:'Man · brisk'},
    {sid:2,id:'F3',label:'F3',desc:'Woman · lower, unhurried'},
    {sid:4,id:'F5',label:'F5',desc:'Woman · lower'},
    {sid:0,id:'F1',label:'F1',desc:'Woman · mid pitch'},
    {sid:1,id:'F2',label:'F2',desc:'Woman · bright'},
    {sid:3,id:'F4',label:'F4',desc:'Woman · bright, quicker'}];
  let worker=null, readyP=null, isReady=false, seq=0, progressCb=null; const pending=new Map();
  function fail(msg){ pending.forEach(p=>p.reject(new Error(msg))); pending.clear(); }
  // allowDownload: fetch missing files from the website (the Download button). Otherwise only files already saved on the device are used.
  function load(onProgress,opts){
    opts=opts||{};
    if(onProgress) progressCb=onProgress;
    if(readyP) return readyP;
    readyP=new Promise((resolve,reject)=>{
      try{ worker=new Worker(BASE+'local-voice-worker.js'); }catch(e){ readyP=null; return reject(e); }
      worker.onmessage=e=>{ const d=e.data||{};
        if(d.type==='progress'){ try{ progressCb&&progressCb(d.got,d.total||TOTAL,d.stage); }catch(_){} }
        else if(d.type==='ready'){ isReady=true; resolve(); }
        else if(d.type==='audio'){ const p=pending.get(d.id); adapt(d.ms,(d.playedSec||d.rawSec)/((p&&p.play)||1),d.steps); if(p){ pending.delete(d.id); p.resolve({samples:d.samples,sampleRate:d.sampleRate,ms:d.ms,rawSec:d.rawSec,steps:d.steps}); } }
        else if(d.type==='error'){
          if(d.id==='init'){ readyP=null; isReady=false; try{ worker.terminate(); }catch(_){} worker=null; const er=new Error(d.notCached?'The downloaded voice is no longer on this device.':d.message); er.notCached=!!d.notCached; reject(er); }
          else { const p=pending.get(d.id); if(p){ pending.delete(d.id); const er=new Error(d.message); er.cancelled=!!d.cancelled; p.reject(er); } } } };
      worker.onerror=e=>{ const m=(e&&e.message)||'The voice engine stopped (the device may be low on memory).'; fail(m);
        if(!isReady){ readyP=null; reject(new Error(m)); } else { isReady=false; readyP=null; try{ worker.terminate(); }catch(_){} worker=null; } };
      worker.postMessage({type:'init',base:BASE,totalBytes:TOTAL,allowDownload:!!opts.allowDownload});
    });
    readyP.catch(()=>{});
    return readyP;
  }
  // Generation speed decides the quality setting. Speech is made in 2–5 "flow steps": more steps sound slightly more polished
  // but take longer. Start at 4, step down when the phone falls behind playback and back up when it has time to spare,
  // so the lecture keeps flowing instead of pausing while the next sentence is made.
  // The setting this device settled on is remembered, so the next lecture starts at the right speed.
  const SPEED_STORE='genius_local_voice_speed_v1';
  let rtf=null, steps=4;
  try{ const v=JSON.parse(localStorage.getItem(SPEED_STORE)||'null'); if(v&&v.steps>=2&&v.steps<=5) steps=v.steps|0; }catch(e){}
  function adapt(ms,sec,used){ if(!(sec>0)) return; const play=sec; /* seconds of playback, already divided by the player's rate when it is slowed */ const r=(ms/1000)/play;
    if(used!==steps) return;                         // judge each setting only by clips made with it
    rtf=rtf==null?r:rtf*0.4+r*0.6;
    const before=steps; if(rtf>0.8&&steps>2) steps--; else if(rtf<0.5&&steps<5) steps++;
    if(steps!==before) rtf=null;
    try{ localStorage.setItem(SPEED_STORE,JSON.stringify({steps})); }catch(e){} }
  async function speak(text,opts){ opts=opts||{}; if(!isReady) await load();
    const id=++seq;
    return new Promise((resolve,reject)=>{ pending.set(id,{resolve,reject,play:opts.play>0?opts.play:1}); worker.postMessage({type:'speak',id,text:String(text||''),sid:opts.sid|0,speed:opts.speed||1,steps:opts.steps||steps,raw:!!opts.raw}); });
  }
  // Drop queued requests that haven't started (used when playback stops).
  function cancelAll(){ if(worker) worker.postMessage({type:'cancel',all:true}); }
  function wav(samples,rate){ const n=samples.length, b=new ArrayBuffer(44+n*2), d=new DataView(b); const w=(o,s)=>{ for(let i=0;i<s.length;i++) d.setUint8(o+i,s.charCodeAt(i)); };
    w(0,'RIFF'); d.setUint32(4,36+n*2,true); w(8,'WAVE'); w(12,'fmt '); d.setUint32(16,16,true); d.setUint16(20,1,true); d.setUint16(22,1,true); d.setUint32(24,rate,true); d.setUint32(28,rate*2,true); d.setUint16(32,2,true); d.setUint16(34,16,true); w(36,'data'); d.setUint32(40,n*2,true);
    for(let i=0,o=44;i<n;i++,o+=2){ const s=Math.max(-1,Math.min(1,samples[i])); d.setInt16(o,s<0?s*0x8000:s*0x7fff,true); }
    return new Blob([b],{type:'audio/wav'}); }
  window.GP_LOCAL={ VOICES, TOTAL_BYTES:TOTAL, load, ready:()=>isReady, loading:()=>!!readyP&&!isReady, speak, cancelAll, wav, base:BASE, speed:()=>({rtf,steps}) };
})();
