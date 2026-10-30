/* Professor voice — lifelike speech for lectures and the Classroom, on the website version. Two engines:
   • On-device (default): Supertonic 3, an open text-to-speech model, runs on the phone itself (voice/local-voice.js). Free, private,
     works offline after a one-time download; nothing is sent anywhere.
   • ElevenLabs (optional): studio voices through the learner's own API key, kept in this browser only and sent only to
     api.elevenlabs.io. Generated audio is saved on the device (IndexedDB), so replays cost nothing.
   Inside the Claude app the page may not load these, so the device's own voices are used there. Any failure falls back to the device voice. */
(function(){
  const V=window.GP_VIEWS=window.GP_VIEWS||[]; let A=null;
  const KEY_STORE='genius_voice_key_v1', PREF_STORE='genius_voice_prefs_v1', USE_STORE='genius_voice_usage_v1', BYTES_STORE='genius_voice_cache_bytes_v1', LOCAL_STORE='genius_local_voice_v1';
  const ENDPOINT='https://api.elevenlabs.io/v1/text-to-speech/';
  const FORMAT='mp3_44100_128';
  const FRAMED=(()=>{ try{ return window.self!==window.top; }catch(e){ return true; } })();
  // ElevenLabs default voices (available to every account). George is the default: a warm British narrator, the classic lecturer.
  const VOICES=[
    ['JBFqnCBsd6RMkjVDRZzb','George','British man · warm, the classic lecturer'],
    ['onwK4e9ZLuTAKqWW03F9','Daniel','British man · authoritative'],
    ['nPczCjzI2devNBz1zQrb','Brian','American man · deep and measured'],
    ['pqHfZKP75CvOlQylNhV4','Bill','American man · older, trustworthy'],
    ['Xb7hH8MSUJpSbSDYk0k2','Alice','British woman · confident'],
    ['pFZP5JQG7iQjIQuC4Bku','Lily','British woman · warm'],
    ['XrExE9yKIg1WjnnlVkGX','Matilda','American woman · friendly']];
  const MODELS=[
    ['eleven_v4','Eleven v4 — most lifelike and expressive (recommended)'],
    ['eleven_multilingual_v2','Multilingual v2 — very steady over long lectures'],
    ['eleven_flash_v2_5','Flash v2.5 — fastest, about half the credits']];
  const FALLBACK_MODEL='eleven_multilingual_v2';
  const CONTEXT_OK=/^(eleven_multilingual_v2|eleven_flash_v2_5)$/;      // models documented with previous_text / next_text
  // Per-model settings. ElevenLabs: v4 takes only stability and similarity (no style, speed or speaker boost);
  // for v2 a little below the 0.5 default stability sounds more like natural speech, and style stays 0.
  function settingsFor(model){ return /^eleven_v[34]/.test(model) ? { stability:0.5, similarity_boost:0.8 }
    : { stability:0.42, similarity_boost:0.8, style:0, use_speaker_boost:true }; }
  const SET_VER='s2';
  const SAMPLE="Good morning. Today we'll follow a single packet across the internet, and you'll see it's far more elegant than it sounds.";
  const CACHE_CAP=250*1024*1024;
  const $=id=>document.getElementById(id);
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  /* ---------- device-only storage ---------- */
  function readKey(){ let k=''; try{ k=sessionStorage.getItem(KEY_STORE)||''; }catch(e){} if(!k){ try{ k=localStorage.getItem(KEY_STORE)||''; }catch(e){} } return k; }
  function remembered(){ try{ return !!localStorage.getItem(KEY_STORE); }catch(e){ return false; } }
  function forgetKey(){ try{ localStorage.removeItem(KEY_STORE); }catch(e){} try{ sessionStorage.removeItem(KEY_STORE); }catch(e){} }
  function storeKey(k,remember){ forgetKey(); try{ (remember?localStorage:sessionStorage).setItem(KEY_STORE,k); return true; }catch(e){ return false; } }
  function prefs(){ let p={}; try{ p=JSON.parse(localStorage.getItem(PREF_STORE)||'{}')||{}; }catch(e){}
    if(typeof p.voice!=='string'||!/^[A-Za-z0-9]{10,40}$/.test(p.voice)) p.voice=VOICES[0][0];
    if(!MODELS.some(m=>m[0]===p.model)) p.model=MODELS[0][0];
    if(p.mv!==2){ if(!p.modelPicked) p.model=MODELS[0][0]; p.mv=2; }   // v67: Eleven v4 is the new default unless one was chosen
    if(typeof p.on!=='boolean') p.on=true;
    if(typeof p.name!=='string'||!p.name) p.name=(VOICES.find(v=>v[0]===p.voice)||[0,'Custom voice'])[1];
    if(p.engine!=='local'&&p.engine!=='eleven') p.engine='local';                 // v68: the on-device voice is the default
    if(!Number.isInteger(p.localSid)||p.localSid<0||p.localSid>9) p.localSid=6;     // Supertonic M2
    if(typeof p.localName!=='string'||!p.localName) p.localName='M2';
    return p; }
  function setPrefs(patch){ const p=Object.assign(prefs(),patch); try{ localStorage.setItem(PREF_STORE,JSON.stringify(p)); }catch(e){} return p; }
  function usage(){ let u=null; try{ u=JSON.parse(localStorage.getItem(USE_STORE)||'null'); }catch(e){} if(!u||typeof u!=='object') u={};
    u.chars=Number(u.chars)||0; u.calls=Number(u.calls)||0; if(!u.since) u.since=new Date().toISOString().slice(0,10); return u; }
  function addUsage(n){ const u=usage(); u.chars+=n; u.calls+=1; try{ localStorage.setItem(USE_STORE,JSON.stringify(u)); }catch(e){} }

  /* ---------- state ---------- */
  let suspended=false;                       // turned off for this visit after a failure; settings or a reload turns it back on
  function hasKey(){ return !!readKey(); }
  // The on-device voice needs the website (it loads voice/ files and runs WebAssembly); not the Claude app or the single file.
  const LOCAL_POSSIBLE=!FRAMED && /^https?:$/.test(location.protocol);
  function localDownloaded(){ try{ return localStorage.getItem(LOCAL_STORE)==='1'; }catch(e){ return false; } }
  function eng(){ return prefs().engine; }
  function on(){ if(FRAMED||suspended) return false; const p=prefs(); if(!p.on) return false;
    return p.engine==='local' ? (LOCAL_POSSIBLE&&localDownloaded()) : hasKey(); }
  function available(){ return !FRAMED && ((LOCAL_POSSIBLE&&localDownloaded())||hasKey()); }
  function label(){ const p=prefs(); return p.engine==='local' ? p.localName+' · on-device voice' : p.name+' · ElevenLabs'; }
  let localScript=null;
  function ensureLocal(){ if(window.GP_LOCAL) return Promise.resolve(window.GP_LOCAL); if(!LOCAL_POSSIBLE) return Promise.resolve(null);
    if(!localScript) localScript=new Promise(res=>{ const sc=document.createElement('script'); sc.src='voice/local-voice.js'; sc.onload=()=>res(window.GP_LOCAL||null); sc.onerror=()=>{ localScript=null; res(null); }; document.head.appendChild(sc); });
    return localScript; }
  function suspend(){ suspended=true; }

  /* ---------- errors ---------- */
  function mkErr(code,message,status){ const e=new Error(message||code); e.code=code; e.status=status||0; return e; }
  async function httpErr(res){
    let d=null, msg='', st=''; try{ const j=await res.json(); d=j&&j.detail; }catch(e){}
    if(d&&typeof d==='object'&&!Array.isArray(d)){ msg=d.message||''; st=d.status||d.code||d.type||''; }
    else if(Array.isArray(d)&&d[0]) msg=d[0].msg||''; else if(typeof d==='string') msg=d;
    const s=res.status, both=(st+' '+msg);
    if(/quota|credit|exceed|limit reached|insufficient/i.test(both)) return mkErr('quota',msg||'Out of ElevenLabs credits.',s);
    if(/permission/i.test(both)||s===403) return mkErr('permission',msg||'This key is not allowed to make speech.',s);
    if(s===401) return mkErr('bad_key',msg||'The key was not accepted.',s);
    if(/model/i.test(both)&&!/voice_not_found/i.test(st)) return mkErr('model',msg||'That voice model was not accepted.',s);
    if(s===404||/voice/i.test(st)) return mkErr('voice',msg||'That voice was not found.',s);
    if(s===429) return mkErr('busy',msg||'Too many requests at once.',s);
    return mkErr('api_error',msg||('Request failed ('+s+').'),s);
  }
  function explain(e){
    const c=e&&e.code;
    if(c==='bad_key') return 'ElevenLabs refused the API key.';
    if(c==='permission') return 'This ElevenLabs key isn\'t allowed to use Text to Speech. Edit the key\'s permissions on ElevenLabs.';
    if(c==='quota') return 'Your ElevenLabs credits (or this key\'s credit limit) have run out.';
    if(c==='local_missing') return 'The downloaded voice is no longer on this device (the browser may have cleared it). Download it again in Professor voice.';
    if(c==='local') return 'The on-device voice couldn\'t run here ('+String((e&&e.message)||'unknown error').slice(0,120)+').';
    if(c==='model') return 'ElevenLabs refused the voice model. Pick another in Professor voice.';
    if(c==='voice') return 'ElevenLabs couldn\'t find that voice. Pick another in Professor voice.';
    if(c==='busy') return 'ElevenLabs is busy or you\'ve hit your plan\'s limit on requests at once.';
    if(c==='network') return 'Couldn\'t reach ElevenLabs. Check the internet connection.';
    if(c==='not_allowed') return 'The browser blocked the audio. Tap Play again.';
    if(c==='playback') return 'The audio couldn\'t be played.';
    if(c==='no_key') return 'No ElevenLabs key on this device.';
    return 'ElevenLabs: '+((e&&e.message)||'something went wrong.');
  }

  /* ---------- request brake: at most 40 requests a minute ---------- */
  const recent=[];
  function brake(){ const now=Date.now(); while(recent.length&&now-recent[0]>60000) recent.shift(); if(recent.length>=40) throw mkErr('busy','Local limit: 40 requests a minute.'); recent.push(now); }

  /* ---------- text → request-sized pieces (deterministic, so saved audio is found again) ---------- */
  // On the phone each piece is generated while the previous one plays, so on-device pieces are a sentence or two;
  // ElevenLabs gets whole paragraphs (smoother delivery), with a modest first piece so speech starts quickly.
  function chunks(text,engine){
    const t=String(text||'').replace(/\s+/g,' ').trim(); if(!t) return [];
    const sents=t.match(/[^.!?;:]+[.!?;:]+["')\]]*\s*|[^.!?;:]+$/g)||[t];
    const local=(engine||eng())==='local'; const first=local?200:600, rest=local?420:1800, hard=local?600:2400;
    const out=[]; let buf='';
    sents.forEach(s=>{ const cap=out.length?rest:first;
      if(buf&&(buf+s).length>cap){ out.push(buf.trim()); buf=''; }
      while(s.length>hard){ let cut=s.lastIndexOf(', ',hard); if(cut<hard/3) cut=s.lastIndexOf(' ',hard); if(cut<hard/3) cut=hard; out.push((buf+s.slice(0,cut+1)).trim()); buf=''; s=s.slice(cut+1); }
      buf+=s; });
    if(buf.trim()) out.push(buf.trim());
    return out;
  }
  function hash(str,seed){ let h1=0xdeadbeef^seed, h2=0x41c6ce57^seed;
    for(let i=0;i<str.length;i++){ const ch=str.charCodeAt(i); h1=Math.imul(h1^ch,2654435761); h2=Math.imul(h2^ch,1597334677); }
    h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909); h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);
    return (h2>>>0).toString(16).padStart(8,'0')+(h1>>>0).toString(16).padStart(8,'0'); }
  function keyOf(p,text){ const s=p.model+'|'+p.voice+'|'+SET_VER+'|'+FORMAT+'|'+text; return hash(s,1)+hash(s,7)+'-'+text.length; }

  /* ---------- saved audio (IndexedDB; memory if unavailable) ---------- */
  let dbp=null;
  function db(){ if(dbp) return dbp; dbp=new Promise(res=>{ try{ const r=indexedDB.open('genius_voice',1);
      r.onupgradeneeded=()=>{ const d=r.result; if(!d.objectStoreNames.contains('clips')){ const s=d.createObjectStore('clips',{keyPath:'k'}); s.createIndex('t','t'); } };
      r.onsuccess=()=>res(r.result); r.onerror=()=>res(null); r.onblocked=()=>res(null); }catch(e){ res(null); } }); return dbp; }
  async function idbGet(k){ const d=await db(); if(!d) return null; return new Promise(res=>{ try{ const q=d.transaction('clips').objectStore('clips').get(k);
      q.onsuccess=()=>res(q.result?q.result.blob:null); q.onerror=()=>res(null); }catch(e){ res(null); } }); }
  function bytes(){ try{ return Number(localStorage.getItem(BYTES_STORE))||0; }catch(e){ return 0; } }
  function setBytes(n){ try{ localStorage.setItem(BYTES_STORE,String(Math.max(0,n))); }catch(e){} }
  async function idbPut(k,blob){ const d=await db(); if(!d) return; try{ await new Promise(res=>{ const tx=d.transaction('clips','readwrite'); tx.objectStore('clips').put({k,blob,size:blob.size,t:Date.now()}); tx.oncomplete=res; tx.onerror=res; tx.onabort=res; });
      setBytes(bytes()+blob.size); if(bytes()>CACHE_CAP) await evict(); }catch(e){} }
  async function evict(){ const d=await db(); if(!d) return; let total=0; const rows=[];
    await new Promise(res=>{ try{ const c=d.transaction('clips').objectStore('clips').index('t').openCursor(); c.onsuccess=()=>{ const cur=c.result; if(!cur){ res(); return; } rows.push([cur.value.k,cur.value.size||0]); total+=cur.value.size||0; cur.continue(); }; c.onerror=res; }catch(e){ res(); } });
    const del=[]; let i=0; while(total>CACHE_CAP*0.8&&i<rows.length){ del.push(rows[i][0]); total-=rows[i][1]; i++; }
    if(del.length) await new Promise(res=>{ const tx=d.transaction('clips','readwrite'); const s=tx.objectStore('clips'); del.forEach(k=>s.delete(k)); tx.oncomplete=res; tx.onerror=res; });
    setBytes(total); }
  async function clearSaved(){ const d=await db(); mem.clear(); if(d) await new Promise(res=>{ try{ const tx=d.transaction('clips','readwrite'); tx.objectStore('clips').clear(); tx.oncomplete=res; tx.onerror=res; }catch(e){ res(); } }); setBytes(0); }

  /* ---------- fetching speech ---------- */
  const mem=new Map();
  function localClip(text){ const p=prefs(); const spd=localSpeed(); const k='L|'+p.localSid+'|'+spd+'|'+text; if(mem.has(k)) return mem.get(k);
    const pr=(async()=>{ const L=await ensureLocal(); if(!L) throw mkErr('local','the voice files could not be loaded');
      if(!L.ready()){ try{ await L.load(null,{allowDownload:false}); }
        catch(e){ if(e&&e.notCached){ try{ localStorage.removeItem(LOCAL_STORE); }catch(_){} throw mkErr('local_missing','The downloaded voice is no longer on this device.'); } throw mkErr('local',(e&&e.message)||String(e)); } }
      let r; try{ r=await L.speak(text,{sid:p.localSid,speed:spd,play:playRate()}); }catch(e){ throw mkErr('local',(e&&e.message)||String(e)); }
      if(!r||!r.samples||!r.samples.length) throw mkErr('local','no audio was produced');
      return L.wav(r.samples,r.sampleRate); })();
    mem.set(k,pr); pr.catch(()=>{ if(mem.get(k)===pr) mem.delete(k); });
    while(mem.size>30) mem.delete(mem.keys().next().value);
    return pr; }
  async function fetchTTS(text,ctx,p){
    const key=readKey(); if(!key) throw mkErr('no_key');
    brake();
    const body={ text, model_id:p.model, voice_settings:settingsFor(p.model) };
    if(CONTEXT_OK.test(p.model)){ if(ctx&&ctx.prev) body.previous_text=ctx.prev.slice(-300); if(ctx&&ctx.next) body.next_text=ctx.next.slice(0,300); }
    let res;
    try{ res=await fetch(ENDPOINT+encodeURIComponent(p.voice)+'?output_format='+FORMAT,{ method:'POST', headers:{ 'xi-api-key':key, 'content-type':'application/json', 'accept':'audio/mpeg' }, body:JSON.stringify(body) }); }
    catch(e){ throw mkErr('network','Network error: '+((e&&e.message)||e)); }
    if(!res.ok){ const e=await httpErr(res); if(e.code==='api_error'&&(e.status===400||e.status===422||/model/i.test(e.message))) e.code='model'; throw e; }
    const raw=await res.blob(); if(!raw||!raw.size) throw mkErr('playback','ElevenLabs returned no audio.');
    addUsage(text.length);
    return raw.type==='audio/mpeg'?raw:new Blob([raw],{type:'audio/mpeg'});
  }
  function clip(text,ctx){ const p=prefs(); if(p.engine==='local') return localClip(text); const k=keyOf(p,text); if(mem.has(k)) return mem.get(k);
    const pr=(async()=>{ const hit=await idbGet(k); if(hit&&hit.size) return hit;
      let b; try{ b=await fetchTTS(text,ctx,p); }
      catch(e){ if(!(e&&e.code==='model'&&p.model!==FALLBACK_MODEL)) throw e;
        // The chosen model was refused (not on this plan, or its settings were rejected): use Multilingual v2 from now on.
        setPrefs({model:FALLBACK_MODEL,modelNote:'Eleven v4 was refused ('+String(e.message||'').slice(0,120)+'), so Multilingual v2 is used.'});
        const p2=prefs(); const k2=keyOf(p2,text); const hit2=await idbGet(k2); if(hit2&&hit2.size) return hit2;
        b=await fetchTTS(text,ctx,p2); idbPut(k2,b); return b; }
      idbPut(k,b); return b; })();
    mem.set(k,pr); pr.catch(()=>{ if(mem.get(k)===pr) mem.delete(k); });
    while(mem.size>60) mem.delete(mem.keys().next().value);
    return pr; }
  // Fetch the first piece(s) of the next block early; returns the promise for its first piece.
  function prefetch(text,prev,count){ try{ const parts=chunks(text,eng()); if(!parts.length) return null;
      const first=clip(parts[0],{prev:prev||'',next:parts[1]||''}); first.catch(()=>{});
      for(let j=1;j<Math.min(parts.length,count||1);j++) clip(parts[j],{prev:parts[j-1],next:parts[j+1]||''}).catch(()=>{});
      return first; }catch(e){ return null; } }

  /* ---------- playback ---------- */
  // Two audio elements take turns: while one plays, the next piece is loaded into the other, so pieces follow without a gap.
  let plays=0, els=[], cur=0, gen=0, pendingResolve=null, endPlay=null, paused=false, resumeWait=null, silent=null, lastEnd=0; const gaps=[];
  function mkEl(){ const a=new Audio(); a.preload='auto'; try{ a.preservesPitch=true; a.mozPreservesPitch=true; a.webkitPreservesPitch=true; }catch(e){} return a; }
  function audioEl(){ if(!els.length) els=[mkEl(),mkEl()]; return els[cur]; }
  function standby(){ audioEl(); return els[1-cur]; }
  function setSrc(a,blob){ if(a.__blob===blob) return; const old=a.__url; a.__blob=blob; a.__url=URL.createObjectURL(blob); a.src=a.__url;
    if(old) setTimeout(()=>{ try{ URL.revokeObjectURL(old); }catch(e){} },2000); }
  function preload(blob){ try{ const s=standby(); if(!blob||s.__blob===blob||!s.paused) return; setSrc(s,blob); s.load(); }catch(e){} }
  function silentURL(){ if(silent) return silent; const n=800, b=new ArrayBuffer(44+n), v=new DataView(b); const w=(o,s)=>{ for(let i=0;i<s.length;i++) v.setUint8(o+i,s.charCodeAt(i)); };
    w(0,'RIFF'); v.setUint32(4,36+n,true); w(8,'WAVE'); w(12,'fmt '); v.setUint32(16,16,true); v.setUint16(20,1,true); v.setUint16(22,1,true); v.setUint32(24,8000,true); v.setUint32(28,8000,true); v.setUint16(32,1,true); v.setUint16(34,8,true); w(36,'data'); v.setUint32(40,n,true);
    for(let i=0;i<n;i++) v.setUint8(44+i,128); silent=URL.createObjectURL(new Blob([b],{type:'audio/wav'})); return silent; }
  // iPhone and iPad only let a page start audio inside a tap. Call this synchronously from the tap, before any await.
  function unlock(force){ if(!force&&!on()) return false; audioEl(); els.forEach(a=>{ try{ a.__blob=null; a.src=silentURL(); const p=a.play(); if(p&&p.catch) p.catch(()=>{}); }catch(e){} }); return true; }
  // Speaking speed (0.5× by default since the learner asked for it). Below 1×, every engine slows playback with the pitch kept.
  // The on-device model is not asked to slow down itself: measured, at speed 0.5 it mostly adds long silences and drops voiced
  // sound (3.8 s voiced of 22.6 s, versus 6.8 s voiced at 1×), so it generates at 1× and the player stretches it. Above 1× the
  // model speaks faster itself, which also makes each piece quicker to generate.
  function rate(){ const api=A||window.GP_API; if(api&&api.ttsRate) return api.ttsRate(); return 0.5; }
  function localSpeed(){ const r=rate(); return r>1?Math.round(r*20)/20:1; }
  function playRate(){ const r=rate(); return eng()==='local'?(r<1?r:1):r; }
  function media(title){ try{ if(!('mediaSession' in navigator)||!window.MediaMetadata) return; navigator.mediaSession.metadata=new MediaMetadata({ title:title||'Lecture', artist:label(), album:'Genius Protocol' });
      navigator.mediaSession.setActionHandler('play',()=>resume()); navigator.mediaSession.setActionHandler('pause',()=>pause()); }catch(e){} }
  function play(blob,my,onstart,joined){
    return new Promise((res,rej)=>{ const s=standby(); let a; if(s.__blob===blob){ cur=1-cur; a=els[cur]; } else { a=audioEl(); setSrc(a,blob); }
      let fin=false;
      const done=err=>{ if(fin) return; fin=true; a.onended=a.onerror=a.onplaying=null; if(endPlay===finish) endPlay=null; err?rej(err):res(); };
      const finish=()=>done(); endPlay=finish;
      a.onended=()=>{ lastEnd=performance.now(); done(); }; a.onerror=()=>done(mkErr('playback','The audio could not be played.'));
      a.onplaying=()=>{ plays++; if(joined&&lastEnd){ gaps.push(Math.round(performance.now()-lastEnd)); if(gaps.length>60) gaps.shift(); } lastEnd=0; try{ onstart&&onstart(); }catch(e){} };
      const r=playRate(); try{ a.currentTime=0; a.defaultPlaybackRate=r; a.playbackRate=r; }catch(e){}
      const go=()=>{ if(my!==gen) return done(); try{ a.playbackRate=playRate(); }catch(e){} const p=a.play(); if(p&&p.catch) p.catch(e=>{ if(e&&e.name==='AbortError') return; done(mkErr(e&&e.name==='NotAllowedError'?'not_allowed':'playback',(e&&e.message)||'')); }); };
      if(paused) resumeWait=go; else go();
    });
  }
  // Speak text with the professor voice. Resolves when finished or stopped; rejects (with .code) if it can't, so callers can fall back.
  function say(text,opts){ opts=opts||{}; halt(); const my=++gen; const parts=chunks(text,eng()); const local=eng()==='local';
    return new Promise((resolve,reject)=>{ pendingResolve=resolve; let started=false;
      const finish=()=>{ if(pendingResolve===resolve) pendingResolve=null; resolve(); };
      (async()=>{
        if(!parts.length) return finish();
        media(opts.title);
        if(local&&!(window.GP_LOCAL&&GP_LOCAL.ready())){ try{ opts.onstatus&&opts.onstatus('Loading the voice…'); }catch(e){} }
        let nextP=clip(parts[0],{prev:opts.prevText||'',next:parts[1]||opts.prefetchNext||''}); nextP.catch(()=>{});
        // On the phone, queue the whole block and the start of the next one now, so generation stays ahead of playback.
        if(local){ for(let j=1;j<parts.length;j++) clip(parts[j],{}).catch(()=>{}); if(opts.prefetchNext) prefetch(opts.prefetchNext,parts[parts.length-1],2); }
        for(let i=0;i<parts.length;i++){
          const blob=await nextP; if(my!==gen) return finish();
          if(i+1<parts.length){ nextP=clip(parts[i+1],{prev:parts[i],next:parts[i+2]||opts.prefetchNext||''}); nextP.catch(()=>{}); nextP.then(b=>{ if(my===gen) preload(b); },()=>{}); }
          else if(opts.prefetchNext){ const pn=prefetch(opts.prefetchNext,parts[i],local?2:1); if(pn) pn.then(b=>preload(b),()=>{}); }
          await play(blob,my,()=>{ if(!started){ started=true; try{ opts.onstart&&opts.onstart(); }catch(e){} } },i>0||!!opts.joined);
          if(my!==gen) return finish();
        }
        finish();
      })().catch(e=>{ if(pendingResolve===resolve) pendingResolve=null; if(my!==gen) return resolve(); reject(e); });
    });
  }
  function halt(){ gen++; resumeWait=null; els.forEach(a=>{ try{ a.pause(); }catch(e){} }); if(endPlay){ const f=endPlay; endPlay=null; f(); } if(pendingResolve){ const r=pendingResolve; pendingResolve=null; r(); } }
  // A full stop also drops on-device pieces queued ahead, so a new start isn't kept waiting behind them.
  function stop(){ halt(); paused=false; lastEnd=0;
    if(window.GP_LOCAL&&GP_LOCAL.cancelAll){ GP_LOCAL.cancelAll(); for(const k of [...mem.keys()]) if(k.startsWith('L|')) mem.delete(k); } }
  function pause(){ paused=true; try{ audioEl().pause(); }catch(e){} }
  function resume(){ paused=false; if(resumeWait){ const f=resumeWait; resumeWait=null; f(); return; } const aud=audioEl(); try{ if(aud&&aud.src&&!aud.ended){ const p=aud.play(); if(p&&p.catch) p.catch(()=>{}); } }catch(e){} }
  function isPaused(){ return paused; }

  window.GP_VOICE={ on, available, hasKey, label, say, stop, pause, resume, isPaused, prefetch, unlock, suspend, explain, chunks, prefs, engine:eng, localDownloaded, stats:()=>({plays,gaps:gaps.slice(),local:window.GP_LOCAL&&GP_LOCAL.speed?GP_LOCAL.speed():null}), ensureLocal, localPossible:LOCAL_POSSIBLE, framed:FRAMED, VOICES, MODELS };

  /* ---------- Professor voice page ---------- */
  // Supertonic 3's ten voices (speaker ids: F1–F5 are 0–4, M1–M5 are 5–9); descriptions come from measured pitch and pace.
  const LOCAL_VOICES=[[6,'M2','Man · deep and measured'],[9,'M5','Man · deep, slower pace'],[8,'M4','Man · mid pitch'],[5,'M1','Man · lighter'],[7,'M3','Man · brisk'],
    [2,'F3','Woman · lower, unhurried'],[4,'F5','Woman · lower'],[0,'F1','Woman · mid pitch'],[1,'F2','Woman · bright'],[3,'F4','Woman · bright, quicker']];
  const LOCAL_TOTAL=159035987;   // engine + model files in voice/ (local-voice.js has the same total)
  function voiceView(){
    const p=prefs(), has=hasKey(), u=usage(), mb=(bytes()/1048576), loc=p.engine==='local', dl=localDownloaded(), MB=Math.round(LOCAL_TOTAL/1e6);
    const box=(c,t)=>`<div class="holo" style="border-color:var(--${c})">${t}</div>`;
    const status = FRAMED ? box('amber',`<b style="color:var(--amber)">● Inside the Claude app</b> — the page may not load voices here, so lectures use this device's own voices. Open the website version for the professor voice.`)
      : !p.on ? box('amber',`<b style="color:var(--amber)">○ Switched off.</b> Lectures use this device's own voices.`)
      : suspended ? box('mag',`<b style="color:var(--mag)">● Paused after an error.</b> Using this device's voice for now. ${loc?'Tap a voice\'s Preview':'Tap Test voice'} to try again.`)
      : on() ? box('ok',`<b style="color:var(--ok)">● On.</b> Lectures and the Classroom speak with <b>${esc(label())}</b>. Anything that fails falls back to this device's voice.`)
      : loc ? box('mag',`<b style="color:var(--mag)">○ Not downloaded yet.</b> ${LOCAL_POSSIBLE?`Download the on-device voice below (about ${MB} MB, once).`:'The on-device voice works on the website version only.'} Until then, lectures use this device's own voices.`)
      : box('mag',`<b style="color:var(--mag)">○ ElevenLabs is selected but no key is saved.</b> Lectures use this device's own voices.`);
    const lvoices=LOCAL_VOICES.map(([sid,n,d])=>`<div class="row" style="justify-content:space-between;align-items:center;border-top:1px solid var(--line);padding:8px 0">
        <label style="display:flex;gap:10px;align-items:center;flex:1;min-width:200px"><input type="radio" name="gvl" value="${sid}" ${p.localSid===sid?'checked':''} onchange="GP_VOICE_UI.localPick(${sid},'${n}')"><span><b>${n}</b> <span class="faint" style="font-size:13px">${esc(d)}</span></span></label>
        <button class="btn ghost sm" onclick="GP_VOICE_UI.localPreview(${sid},'${n}',this)">▶ Preview</button></div>`).join('');
    const localSection=`<div class="holo" style="margin-top:12px">
        <label style="display:flex;gap:10px;align-items:center;font-weight:600"><input type="radio" name="gveng" value="local" ${loc?'checked':''} onchange="GP_VOICE_UI.engine('local')"> On-device voice <span class="tag" style="font-size:11px">free · private · works offline</span></label>
        <p class="muted" style="margin:8px 0 0">An open AI voice model (Supertonic 3) runs on your phone itself. No account, no key, no per-use cost, and nothing you study is sent anywhere.</p>
        ${!LOCAL_POSSIBLE?`<p class="faint" style="font-size:13px;margin:8px 0 0">Available on the website version only (not inside the Claude app or the single-file version).</p>`
        : !dl?`<p style="margin:10px 0 6px">It needs a one-time download of about <b>${MB} MB</b>, so use Wi-Fi. After that it opens instantly, even offline.</p>
          <button class="btn mg" onclick="GP_VOICE_UI.download(this)">⬇ Download the voice (${MB} MB)</button>
          <progress id="lvprog" max="100" value="0" style="width:100%;margin-top:10px" hidden></progress>`
        :`<p class="faint" style="font-size:13px;margin:8px 0 4px">Downloaded on this device. Each lecture takes a moment to start; on older phones there can be a short pause between sentences.</p>
          ${lvoices}
          <div class="row" style="margin-top:8px"><button class="btn ghost sm" onclick="GP_VOICE_UI.localDelete(this)">Delete the downloaded voice</button></div>`}
        <p id="lvmsg" class="muted" role="status" style="margin:10px 0 0"></p></div>`;
    const custom=!VOICES.some(v=>v[0]===p.voice);
    const vlist=VOICES.map(([id,n,d])=>`<div class="row" style="justify-content:space-between;align-items:center;border-top:1px solid var(--line);padding:8px 0">
        <label style="display:flex;gap:10px;align-items:center;flex:1;min-width:200px"><input type="radio" name="gvv" value="${id}" ${p.voice===id?'checked':''} onchange="GP_VOICE_UI.pick('${id}','${n}')"><span><b>${n}</b> <span class="faint" style="font-size:13px">${esc(d)}</span></span></label>
        <button class="btn ghost sm" ${has&&!FRAMED?'':'disabled'} onclick="GP_VOICE_UI.preview('${id}','${n}',this)">▶ Preview</button></div>`).join('');
    const mopts=MODELS.map(([id,d])=>`<option value="${id}"${p.model===id?' selected':''}>${esc(d)}</option>`).join('');
    A.set(`<p class="eyebrow">Toolkit</p><h1 style="margin:0 0 6px">Professor voice</h1>
      <p class="muted" style="margin:0 0 12px">Give every lecture and the Classroom a lifelike AI voice instead of your device's built-in one.</p>
      ${status}
      <label style="display:flex;gap:10px;align-items:center;margin:12px 0 0"><input type="checkbox" id="gvon" ${p.on?'checked':''} onchange="GP_VOICE_UI.toggle(this.checked)"> Use the professor voice for lectures and the Classroom</label>
      ${localSection}
      <details class="holo" style="margin-top:12px" ${loc?'':'open'}><summary style="cursor:pointer;font-weight:600">ElevenLabs — studio voices with your own key (optional)</summary>
      <label style="display:flex;gap:10px;align-items:center;margin:10px 0 0"><input type="radio" name="gveng" value="eleven" ${loc?'':'checked'} onchange="GP_VOICE_UI.engine('eleven')"> Use ElevenLabs instead <span class="faint" style="font-size:13px">(needs an ElevenLabs account; paid plans for regular listening)</span></label>
      <div style="margin-top:12px"><p class="eyebrow">Get a key (about 3 minutes)</p>
        <ol style="margin:6px 0 0 18px;padding:0;line-height:1.6">
          <li>Sign up or sign in at <a href="https://elevenlabs.io/app/settings/api-keys" target="_blank" rel="noopener">elevenlabs.io</a> and open <b>API keys</b>.</li>
          <li>Create a key. Under restrictions, allow only <b>Text to Speech</b> and set a <b>credit limit</b>, so a leaked key can't do anything else or cost more than you chose.</li>
          <li>Copy the key and paste it below. The free plan includes a small monthly allowance; whole lectures use a lot of characters, so regular listening needs a paid plan.</li>
        </ol></div>
      <div style="margin-top:12px">
        <label for="gvkey" style="display:block;font-weight:600;margin-bottom:6px">ElevenLabs API key</label>
        <input id="gvkey" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${has?'A key is saved — paste a new one to replace it':'Paste your ElevenLabs key'}" style="width:100%">
        <label style="display:flex;gap:8px;align-items:center;margin:10px 0"><input type="checkbox" id="gvrem" ${(!has||remembered())?'checked':''}> Remember on this device (untick to forget it when the app closes)</label>
        <div class="row"><button class="btn mg" ${FRAMED?'disabled':''} onclick="GP_VOICE_UI.save()">${has?'Replace &amp; test':'Connect &amp; test'}</button>${has&&!FRAMED?'<button class="btn ghost" onclick="GP_VOICE_UI.test()">▶ Test voice</button>':''}</div>
        <p id="gvmsg" class="muted" role="status" style="margin:10px 0 0"></p></div>
      <div style="margin-top:12px"><p class="eyebrow">ElevenLabs voice</p>
        ${vlist}
        <div style="border-top:1px solid var(--line);padding-top:10px">
          <label for="gvcustom" style="display:block;margin-bottom:6px">Or use any voice from the ElevenLabs Voice Library: add it to <b>My Voices</b>, copy its voice ID, and paste it here</label>
          <div class="row"><input id="gvcustom" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Voice ID" value="${custom?esc(p.voice):''}" style="flex:1;min-width:180px"><button class="btn ghost sm" onclick="GP_VOICE_UI.custom()">Use this voice</button></div></div>
        <label for="gvmodel" style="display:block;margin:14px 0 6px">Voice model</label>
        <select id="gvmodel" onchange="GP_VOICE_UI.model(this.value)" style="width:100%">${mopts}</select>${p.modelNote?`<p class="faint" style="font-size:13px;margin:6px 0 0;color:var(--amber)">${esc(p.modelNote)}</p>`:''}</div>
      <div style="margin-top:12px"><p class="eyebrow">Usage on this device</p>
        <p style="margin:0">Characters sent to ElevenLabs: <b>${u.chars.toLocaleString()}</b> in ${u.calls.toLocaleString()} requests since ${esc(u.since)}. Replays of saved audio are free. Your real balance is on ElevenLabs' usage page.</p>
        <p class="faint" style="font-size:13px;margin:6px 0 0">Saved ElevenLabs audio on this device: about ${mb.toFixed(1)} MB (oldest is removed past 250 MB).</p>
        <div class="row" style="margin-top:8px"><button class="btn ghost sm" onclick="GP_VOICE_UI.clear(this)">Delete saved audio</button>${has?'<button class="btn ghost sm" onclick="GP_VOICE_UI.forget(this)">Forget key on this device</button>':''}</div></div>
      <div style="margin-top:12px"><p class="eyebrow">Keeping the key safe</p>
        <ul style="margin:6px 0 0 18px;padding:0;line-height:1.6">
          <li>The key is stored only in this browser on this device. It is never put in your progress or backups, and it is sent only to <code>api.elevenlabs.io</code>.</li>
          <li>ElevenLabs advises against putting keys in apps that run in a browser, because anyone who can use this device, or any script running on this page, could read it. That's why the steps above restrict the key to speech and cap its credits. Don't connect on a shared device.</li>
          <li>If the device is lost, delete the key on ElevenLabs. It stops working at once.</li>
        </ul></div></details>
      <p class="faint" style="font-size:13px;margin:12px 0 0">Speed follows the SPEED slider under each lecture.</p>
      <div class="row" style="margin-top:14px"><button class="btn ghost" onclick="history.back()">◂ Back</button><button class="btn ghost" onclick="GP.go('tools')">Genius Tools</button></div>`);
  }
  function lmsg(t,ok){ const m=$('lvmsg'); if(m){ m.innerHTML=t; m.style.color=ok===true?'var(--ok)':ok===false?'var(--mag)':''; } }
  async function download(btn){
    unlock(true); suspended=false;
    if(btn) btn.disabled=true; lmsg('Preparing the download…');
    const L=await ensureLocal(); if(!L){ lmsg('✗ The voice files could not be loaded from the website. Check the connection and try again.',false); if(btn) btn.disabled=false; return; }
    const pr=$('lvprog'); if(pr) pr.hidden=false;
    try{
      await L.load((got,total,stage)=>{ const pct=Math.min(100,Math.round(got/total*100)); if(pr) pr.value=pct;
        lmsg(stage==='starting'?'Starting the voice on this device…':'Downloading… '+pct+'% ('+Math.round(got/1e6)+' of '+Math.round(total/1e6)+' MB). Keep this page open.'); },{allowDownload:true});
      try{ localStorage.setItem(LOCAL_STORE,'1'); }catch(e){}
      setPrefs({engine:'local',on:true});
      lmsg('✓ Downloaded. Playing a sample…',true);
      try{ await say(SAMPLE,{title:'Voice test'}); }catch(e){}
      if(location.hash==='#tool-voice'){ voiceView(); lmsg('✓ Ready. Lectures and the Classroom now use '+esc(label())+'.',true); }
    }catch(e){ lmsg('✗ '+esc(explain(e&&e.code?e:mkErr('local',(e&&e.message)||String(e)))),false); if(btn) btn.disabled=false; }
  }
  async function localPreview(sid,name,btn){
    unlock(true); suspended=false; setPrefs({engine:'local',localSid:sid,localName:name});
    const r=document.querySelector('input[name=gvl][value="'+sid+'"]'); if(r) r.checked=true;
    const e1=document.querySelector('input[name=gveng][value=local]'); if(e1) e1.checked=true;
    if(btn){ btn.disabled=true; btn.textContent='…'; }
    try{ await say(SAMPLE,{title:'Voice preview',onstatus:t=>lmsg(esc(t)),onstart:()=>lmsg('▶ '+esc(name)+'…')}); lmsg('Now using '+esc(name)+'.',true); }
    catch(e){ lmsg('✗ '+esc(explain(e)),false); }
    finally{ if(btn){ btn.disabled=false; btn.textContent='▶ Preview'; } }
  }
  async function localDelete(btn){
    if(btn&&!btn.dataset.armed){ btn.dataset.armed='1'; btn.textContent='Tap again to delete the voice'; setTimeout(()=>{ if(btn.isConnected){ delete btn.dataset.armed; btn.textContent='Delete the downloaded voice'; } },4000); return; }
    stop(); try{ localStorage.removeItem(LOCAL_STORE); }catch(e){}
    try{ if(window.caches){ for(const k of await caches.keys()){ const c=await caches.open(k); for(const r of await c.keys()){ if(/\/voice\/[^/]+$/.test(new URL(r.url).pathname)) await c.delete(r); } } } }catch(e){}
    if(A) A.toast('On-device voice deleted from this device'); voiceView();
  }
  function msg(t,ok){ const m=$('gvmsg'); if(m){ m.innerHTML=t; m.style.color=ok===true?'var(--ok)':ok===false?'var(--mag)':''; } }
  async function test(){
    unlock(true); suspended=false; setPrefs({engine:'eleven'}); msg('Generating a sample… (about '+SAMPLE.length+' characters)');
    try{ await say(SAMPLE,{title:'Voice test',onstart:()=>msg('▶ Playing '+esc(prefs().name)+'…')}); msg('✓ Connected. Lectures and the Classroom will use '+esc(prefs().name)+'.',true); return true; }
    catch(e){ msg('✗ '+esc(explain(e))+(e&&e.message&&e.code!=='api_error'?'<br><span class="faint">'+esc(e.message)+'</span>':''),false); return false; }
  }
  async function save(){
    const inp=$('gvkey'); const k=(inp&&inp.value||'').trim().replace(/\s+/g,'');
    if(!k){ if(hasKey()) return test(); msg('Paste your key first.',false); return; }
    if(k.length<20||/[^A-Za-z0-9_\-]/.test(k)){ msg('That doesn\'t look like an ElevenLabs API key. Check you copied all of it.',false); return; }
    if(!storeKey(k,!!($('gvrem')&&$('gvrem').checked))){ msg('This browser would not let the app store the key (private browsing or storage turned off).',false); return; }
    if(inp) inp.value=''; setPrefs({on:true,engine:'eleven'});
    const ok=await test();
    if(ok) setTimeout(()=>{ if(location.hash==='#tool-voice'){ voiceView(); msg('✓ Connected. Lectures and the Classroom will use '+esc(prefs().name)+'.',true); } },1200);
  }
  async function preview(id,name,btn){
    unlock(true); const old=prefs(); setPrefs({voice:id,name,engine:'eleven'}); const r=document.querySelector('input[name=gvv][value="'+id+'"]'); if(r) r.checked=true;
    if(btn){ btn.disabled=true; btn.textContent='…'; } suspended=false;
    try{ await say(SAMPLE,{title:'Voice preview'}); msg('Now using '+esc(name)+'.',true); }
    catch(e){ msg('✗ '+esc(explain(e)),false); if(e&&e.code==='voice') setPrefs({voice:old.voice,name:old.name}); }
    finally{ if(btn){ btn.disabled=false; btn.textContent='▶ Preview'; } }
  }
  function forget(btn){
    if(btn&&!btn.dataset.armed){ btn.dataset.armed='1'; btn.textContent='Tap again to forget the key'; setTimeout(()=>{ if(btn.isConnected){ delete btn.dataset.armed; btn.textContent='Forget key on this device'; } },4000); return; }
    stop(); forgetKey(); if(A) A.toast('ElevenLabs key removed from this device'); voiceView();
  }
  async function clear(btn){
    if(btn&&!btn.dataset.armed){ btn.dataset.armed='1'; btn.textContent='Tap again to delete'; setTimeout(()=>{ if(btn.isConnected){ delete btn.dataset.armed; btn.textContent='Delete saved audio'; } },4000); return; }
    await clearSaved(); if(A) A.toast('Saved audio deleted'); voiceView();
  }
  window.GP_VOICE_UI={ save, test, preview, forget, clear, download, localPreview, localDelete,
    localPick:(sid,name)=>{ setPrefs({localSid:sid,localName:name,engine:'local'}); if(A) A.toast('Voice: '+name); },
    engine:v=>{ if(v==='local'||v==='eleven'){ stop(); setPrefs({engine:v}); suspended=false; voiceView(); } },
    pick:(id,name)=>{ setPrefs({voice:id,name}); if(A) A.toast('Voice: '+name); },
    custom:()=>{ const v=($('gvcustom')&&$('gvcustom').value||'').trim(); if(!/^[A-Za-z0-9]{10,40}$/.test(v)){ msg('A voice ID is a code of letters and numbers, about 20 characters long.',false); return; }
      setPrefs({voice:v,name:'Custom voice'}); document.querySelectorAll('input[name=gvv]').forEach(r=>r.checked=false); msg('Custom voice saved. Tap Test voice to hear it.',true); },
    model:v=>{ if(MODELS.some(m=>m[0]===v)){ setPrefs({model:v,modelPicked:true,modelNote:''}); if(A) A.toast('Voice model updated'); } },
    toggle:v=>{ setPrefs({on:!!v}); if(v) suspended=false; else stop(); if(A) A.toast(v?'Professor voice on':'Using device voices'); } };
  V.push({test:h=>h==='tool-voice', nav:'labs', render:(h,api)=>{ A=api; voiceView(); }});
  // Keep a reference to the engine API for rate() before the page is first opened.
  const grab=()=>{ if(!A&&window.GP_API) A=window.GP_API; }; if(document.readyState==='complete') setTimeout(grab,0); else window.addEventListener('load',grab);
})();
