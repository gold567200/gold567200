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
        else if(d.type==='audio'){ const p=pending.get(d.id); if(p){ pending.delete(d.id); p.resolve({samples:d.samples,sampleRate:d.sampleRate,ms:d.ms}); } }
        else if(d.type==='error'){
          if(d.id==='init'){ readyP=null; isReady=false; try{ worker.terminate(); }catch(_){} worker=null; const er=new Error(d.notCached?'The downloaded voice is no longer on this device.':d.message); er.notCached=!!d.notCached; reject(er); }
          else { const p=pending.get(d.id); if(p){ pending.delete(d.id); p.reject(new Error(d.message)); } } } };
      worker.onerror=e=>{ const m=(e&&e.message)||'The voice engine stopped (the device may be low on memory).'; fail(m);
        if(!isReady){ readyP=null; reject(new Error(m)); } else { isReady=false; readyP=null; try{ worker.terminate(); }catch(_){} worker=null; } };
      worker.postMessage({type:'init',base:BASE,totalBytes:TOTAL,allowDownload:!!opts.allowDownload});
    });
    readyP.catch(()=>{});
    return readyP;
  }
  async function speak(text,opts){ opts=opts||{}; if(!isReady) await load();
    const id=++seq;
    return new Promise((resolve,reject)=>{ pending.set(id,{resolve,reject}); worker.postMessage({type:'speak',id,text:String(text||''),sid:opts.sid|0,speed:opts.speed||1,steps:opts.steps||5}); });
  }
  function wav(samples,rate){ const n=samples.length, b=new ArrayBuffer(44+n*2), d=new DataView(b); const w=(o,s)=>{ for(let i=0;i<s.length;i++) d.setUint8(o+i,s.charCodeAt(i)); };
    w(0,'RIFF'); d.setUint32(4,36+n*2,true); w(8,'WAVE'); w(12,'fmt '); d.setUint32(16,16,true); d.setUint16(20,1,true); d.setUint16(22,1,true); d.setUint32(24,rate,true); d.setUint32(28,rate*2,true); d.setUint16(32,2,true); d.setUint16(34,16,true); w(36,'data'); d.setUint32(40,n*2,true);
    for(let i=0,o=44;i<n;i++,o+=2){ const s=Math.max(-1,Math.min(1,samples[i])); d.setInt16(o,s<0?s*0x8000:s*0x7fff,true); }
    return new Blob([b],{type:'audio/wav'}); }
  window.GP_LOCAL={ VOICES, TOTAL_BYTES:TOTAL, load, ready:()=>isReady, loading:()=>!!readyP&&!isReady, speak, wav, base:BASE };
})();
