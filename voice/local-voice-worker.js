/* On-device professor voice: Supertonic 3 (int8) on the sherpa-onnx WebAssembly engine, running in this worker.
   Model: Supertone's Supertonic 3 (OpenRAIL licence). Engine: sherpa-onnx (Apache-2.0, k2-fsa). See LICENSES.txt. */
let tts=null;
const FILES=['duration_predictor.int8.onnx','text_encoder.int8.onnx','vector_estimator.int8.onnx','vocoder.int8.onnx','tts.json','unicode_indexer.bin','voice.bin'];

// Downloaded files are kept in their own Cache Storage bucket, so the voice opens offline and isn't fetched twice.
const VCACHE='genius-voice-v1';
const puts=[];
async function cachedResponse(url){ try{ if(self.caches){ const c=await caches.open(VCACHE); return (await c.match(url))||null; } }catch(e){} return null; }
async function fetchBytes(url,onBytes,opts){
  opts=opts||{}; let res=await cachedResponse(url); const hit=!!res;
  if(!res){
    if(opts.cacheOnly){ const e=new Error('not_cached'); e.notCached=true; throw e; }
    res=await fetch(url); if(!res.ok) throw new Error('Download failed ('+res.status+') for '+url.split('/').pop());
    try{ const copy=res.clone(); puts.push(caches.open(VCACHE).then(c=>c.put(url,copy)).catch(()=>{})); }catch(e){}   // saved while the download is read
  }
  if(!res.body||!res.body.getReader){ const b=new Uint8Array(await res.arrayBuffer()); onBytes&&onBytes(b.length); return b; }
  const reader=res.body.getReader(), chunks=[]; let n=0;
  for(;;){ const {done,value}=await reader.read(); if(done) break; chunks.push(value); n+=value.length; onBytes&&onBytes(value.length); }
  const out=new Uint8Array(n); let o=0; for(const c of chunks){ out.set(c,o); o+=c.length; } return out;
}

async function init(d){
  const base=d.base; let got=0; const total=d.totalBytes||0;
  const tick=n=>{ got+=n; self.postMessage({type:'progress',got,total}); };
  const bytes={};
  // Fetch the engine first (so the browser caches it too), then the model files one at a time to limit memory peaks.
  const o={cacheOnly:!d.allowDownload};
  if(o.cacheOnly){ for(const f of ['sherpa-onnx-wasm-main-tts.wasm'].concat(FILES)){ if(!(await cachedResponse(base+f))){ const e=new Error('not_cached'); e.notCached=true; throw e; } } }
  await fetchBytes(base+'sherpa-onnx-wasm-main-tts.wasm',tick,o).then(b=>{ bytes.__wasm=b; });
  for(const f of FILES) bytes[f]=await fetchBytes(base+f,tick,o);
  await Promise.all(puts.splice(0));
  self.postMessage({type:'progress',got:total||got,total,stage:'starting'});
  await new Promise((resolve,reject)=>{
    const wasm=bytes.__wasm; delete bytes.__wasm;
    self.Module={
      locateFile:p=>base+p,
      wasmBinary:wasm,
      getPreloadedPackage:()=>new ArrayBuffer(0),
      print:()=>{}, printErr:()=>{},
      preRun:[()=>{ FS.mkdir('/st'); for(const f of FILES){ FS.writeFile('/st/'+f,bytes[f]); delete bytes[f]; } }],
      onRuntimeInitialized:()=>{
        try{
          tts=createOfflineTts(self.Module,{ offlineTtsModelConfig:{ offlineTtsSupertonicModelConfig:{
              durationPredictor:'/st/duration_predictor.int8.onnx', textEncoder:'/st/text_encoder.int8.onnx', vectorEstimator:'/st/vector_estimator.int8.onnx',
              vocoder:'/st/vocoder.int8.onnx', ttsJson:'/st/tts.json', unicodeIndexer:'/st/unicode_indexer.bin', voiceStyle:'/st/voice.bin' },
            numThreads:1, debug:0, provider:'cpu' }, ruleFsts:'', ruleFars:'', maxNumSentences:1 });
          if(!tts||!tts.handle) throw new Error('The voice engine did not start.');
          for(const f of ['duration_predictor.int8.onnx','text_encoder.int8.onnx','vector_estimator.int8.onnx','vocoder.int8.onnx']){ try{ FS.unlink('/st/'+f); }catch(e){} }   // the engine holds its own copy
          resolve();
        }catch(e){ reject(e); }
      }
    };
    try{ importScripts(base+'sherpa-onnx-wasm-main-tts.js', base+'sherpa-onnx-tts.js'); }catch(e){ reject(e); }
  });
}

// Natural pacing: the model pads every clip with about half a second of silence at each end and leaves
// 0.35–0.55 s between sentences. Trim the ends and shorten long internal silences so speech flows like a person talking.
const LEAD_MS=30, TAIL_MS=180, MAX_GAP_MS=260, FADE_MS=6;
function tighten(x,sr){
  const hop=Math.round(sr*0.01), n=Math.floor(x.length/hop); if(n<3) return x;
  const rms=new Float32Array(n); let peak=0;
  for(let f=0;f<n;f++){ let s=0; for(let i=f*hop,e=i+hop;i<e;i++) s+=x[i]*x[i]; rms[f]=Math.sqrt(s/hop); if(rms[f]>peak) peak=rms[f]; }
  const thr=Math.max(0.004,peak*0.03); let first=-1,last=-1;
  for(let f=0;f<n;f++) if(rms[f]>thr){ if(first<0) first=f; last=f; }
  if(first<0) return x;
  const start=Math.max(0,(first*hop)-Math.round(sr*LEAD_MS/1000)), end=Math.min(x.length,(last+1)*hop+Math.round(sr*TAIL_MS/1000));
  // collect the pieces to keep, cutting the middle out of silences longer than MAX_GAP_MS
  const keep=[]; let segStart=start, f=Math.floor(start/hop); const maxGap=Math.round(MAX_GAP_MS/10);
  while(f<last){
    if(rms[f]<=thr){ let g=f; while(g<last&&rms[g]<=thr) g++; const len=g-f;
      if(len>maxGap){ const half=Math.floor(maxGap/2); keep.push([segStart,(f+half)*hop]); segStart=(g-half)*hop; }
      f=g; } else f++;
  }
  keep.push([segStart,end]);
  let total=0; keep.forEach(([a,b])=>total+=Math.max(0,b-a));
  const out=new Float32Array(total), fade=Math.round(sr*FADE_MS/1000); let o=0;
  keep.forEach(([a,b],k)=>{ const len=Math.max(0,b-a); out.set(x.subarray(a,b),o);
    if(k>0) for(let i=0;i<fade&&i<len;i++) out[o+i]*=i/fade;                     // fade in after a cut
    if(k<keep.length-1) for(let i=0;i<fade&&i<len;i++) out[o+len-1-i]*=i/fade;  // fade out before a cut
    o+=len; });
  return out;
}

// Requests are queued so that "stop" can drop the ones not yet started; the worker yields between clips to read new messages.
const queue=[]; let busy=false;
async function pump(){
  if(busy) return; busy=true;
  while(queue.length){
    await new Promise(r=>setTimeout(r,0));
    const d=queue.shift(); if(!d) break;
    try{
      const t0=performance.now();
      const a=tts.generateWithConfig(d.text,{ sid:d.sid|0, speed:d.speed||1.0, numSteps:d.steps||5, silenceScale:0.2, extra:{lang:'en'} });
      if(!a.samples||!a.samples.length) throw new Error('No audio was produced.');
      const ms=performance.now()-t0, rawSec=a.samples.length/a.sampleRate;
      const out=d.raw?a.samples:tighten(a.samples,a.sampleRate);
      self.postMessage({type:'audio',id:d.id,samples:out,sampleRate:a.sampleRate,ms,rawSec,playedSec:out.length/a.sampleRate,steps:d.steps||5},[out.buffer]);
    }catch(err){ self.postMessage({type:'error',id:d.id,message:String((err&&err.message)||err)}); }
  }
  busy=false;
}

self.onmessage=async e=>{
  const d=e.data||{};
  if(d.type==='init'){
    try{ await init(d); self.postMessage({type:'ready',sampleRate:tts.sampleRate,speakers:tts.numSpeakers}); }
    catch(err){ self.postMessage({type:'error',id:'init',message:String((err&&err.message)||err),notCached:!!(err&&err.notCached)}); }
  } else if(d.type==='speak'){
    if(!tts){ self.postMessage({type:'error',id:d.id,message:'Voice not loaded'}); return; }
    queue.push(d); pump();
  } else if(d.type==='cancel'){
    const ids=new Set(d.ids||[]); for(let i=queue.length-1;i>=0;i--){ if(d.all||ids.has(queue[i].id)){ self.postMessage({type:'error',id:queue[i].id,message:'cancelled',cancelled:true}); queue.splice(i,1); } }
  }
};
