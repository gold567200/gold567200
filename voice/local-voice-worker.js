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

self.onmessage=async e=>{
  const d=e.data||{};
  if(d.type==='init'){
    try{ await init(d); self.postMessage({type:'ready',sampleRate:tts.sampleRate,speakers:tts.numSpeakers}); }
    catch(err){ self.postMessage({type:'error',id:'init',message:String((err&&err.message)||err),notCached:!!(err&&err.notCached)}); }
  } else if(d.type==='speak'){
    if(!tts){ self.postMessage({type:'error',id:d.id,message:'Voice not loaded'}); return; }
    try{
      const t0=performance.now();
      const a=tts.generateWithConfig(d.text,{ sid:d.sid|0, speed:d.speed||1.0, numSteps:d.steps||5, silenceScale:0.2, extra:{lang:'en'} });
      if(!a.samples||!a.samples.length) throw new Error('No audio was produced.');
      self.postMessage({type:'audio',id:d.id,samples:a.samples,sampleRate:a.sampleRate,ms:performance.now()-t0},[a.samples.buffer]);
    }catch(err){ self.postMessage({type:'error',id:d.id,message:String((err&&err.message)||err)}); }
  }
};
