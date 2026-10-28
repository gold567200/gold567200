/* Professor voice — lifelike speech for lectures and the Classroom through ElevenLabs, with the learner's own API key.
   Used on the website version. Inside the Claude app the page may not contact other sites, so the device's own voices are used there.
   The key is kept in this browser only and sent only to api.elevenlabs.io. Generated audio is saved on the device (IndexedDB),
   so replaying a lecture costs nothing. Anything that fails falls back to the device voice. */
(function(){
  const V=window.GP_VIEWS=window.GP_VIEWS||[]; let A=null;
  const KEY_STORE='genius_voice_key_v1', PREF_STORE='genius_voice_prefs_v1', USE_STORE='genius_voice_usage_v1', BYTES_STORE='genius_voice_cache_bytes_v1';
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
    ['eleven_multilingual_v2','Multilingual v2 — lifelike and steady over long lectures (recommended)'],
    ['eleven_v4','Eleven v4 — newest and most expressive'],
    ['eleven_flash_v2_5','Flash v2.5 — fastest, about half the credits']];
  const CONTEXT_OK=/^(eleven_multilingual_v2|eleven_flash_v2_5)$/;      // models documented with previous_text / next_text
  const SETTINGS={ stability:0.55, similarity_boost:0.75, style:0, use_speaker_boost:true }; const SET_VER='s1';
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
    if(typeof p.on!=='boolean') p.on=true;
    if(typeof p.name!=='string'||!p.name) p.name=(VOICES.find(v=>v[0]===p.voice)||[0,'Custom voice'])[1];
    return p; }
  function setPrefs(patch){ const p=Object.assign(prefs(),patch); try{ localStorage.setItem(PREF_STORE,JSON.stringify(p)); }catch(e){} return p; }
  function usage(){ let u=null; try{ u=JSON.parse(localStorage.getItem(USE_STORE)||'null'); }catch(e){} if(!u||typeof u!=='object') u={};
    u.chars=Number(u.chars)||0; u.calls=Number(u.calls)||0; if(!u.since) u.since=new Date().toISOString().slice(0,10); return u; }
  function addUsage(n){ const u=usage(); u.chars+=n; u.calls+=1; try{ localStorage.setItem(USE_STORE,JSON.stringify(u)); }catch(e){} }

  /* ---------- state ---------- */
  let suspended=false;                       // turned off for this visit after a failure; settings or a reload turns it back on
  function hasKey(){ return !!readKey(); }
  function on(){ return !FRAMED && !suspended && hasKey() && prefs().on; }
  function label(){ return prefs().name+' · ElevenLabs'; }
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
    if(s===404||/voice/i.test(st)) return mkErr('voice',msg||'That voice was not found.',s);
    if(s===429) return mkErr('busy',msg||'Too many requests at once.',s);
    return mkErr('api_error',msg||('Request failed ('+s+').'),s);
  }
  function explain(e){
    const c=e&&e.code;
    if(c==='bad_key') return 'ElevenLabs refused the API key.';
    if(c==='permission') return 'This ElevenLabs key isn\'t allowed to use Text to Speech. Edit the key\'s permissions on ElevenLabs.';
    if(c==='quota') return 'Your ElevenLabs credits (or this key\'s credit limit) have run out.';
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
  function chunks(text){
    const t=String(text||'').replace(/\s+/g,' ').trim(); if(!t) return [];
    const sents=t.match(/[^.!?;:]+[.!?;:]+["')\]]*\s*|[^.!?;:]+$/g)||[t];
    const out=[]; let buf='';
    sents.forEach(s=>{ const cap=out.length?1100:260;               // a short first piece so speech starts quickly
      if(buf&&(buf+s).length>cap){ out.push(buf.trim()); buf=''; }
      while(s.length>1600){ out.push(s.slice(0,1600)); s=s.slice(1600); }
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
  async function fetchTTS(text,ctx,p){
    const key=readKey(); if(!key) throw mkErr('no_key');
    brake();
    const body={ text, model_id:p.model, voice_settings:SETTINGS };
    if(CONTEXT_OK.test(p.model)){ if(ctx&&ctx.prev) body.previous_text=ctx.prev.slice(-300); if(ctx&&ctx.next) body.next_text=ctx.next.slice(0,300); }
    let res;
    try{ res=await fetch(ENDPOINT+encodeURIComponent(p.voice)+'?output_format='+FORMAT,{ method:'POST', headers:{ 'xi-api-key':key, 'content-type':'application/json', 'accept':'audio/mpeg' }, body:JSON.stringify(body) }); }
    catch(e){ throw mkErr('network','Network error: '+((e&&e.message)||e)); }
    if(!res.ok) throw await httpErr(res);
    const raw=await res.blob(); if(!raw||!raw.size) throw mkErr('playback','ElevenLabs returned no audio.');
    addUsage(text.length);
    return raw.type==='audio/mpeg'?raw:new Blob([raw],{type:'audio/mpeg'});
  }
  function clip(text,ctx){ const p=prefs(); const k=keyOf(p,text); if(mem.has(k)) return mem.get(k);
    const pr=(async()=>{ const hit=await idbGet(k); if(hit&&hit.size) return hit; const b=await fetchTTS(text,ctx,p); idbPut(k,b); return b; })();
    mem.set(k,pr); pr.catch(()=>{ mem.delete(k); });
    while(mem.size>60) mem.delete(mem.keys().next().value);
    return pr; }
  function prefetch(text){ try{ const parts=chunks(text); if(parts.length) clip(parts[0],{next:parts[1]||''}).catch(()=>{}); }catch(e){} }

  /* ---------- playback ---------- */
  let aud=null, gen=0, pendingResolve=null, endPlay=null, paused=false, resumeWait=null, silent=null;
  function audioEl(){ if(!aud){ aud=new Audio(); aud.preload='auto'; try{ aud.preservesPitch=true; aud.mozPreservesPitch=true; aud.webkitPreservesPitch=true; }catch(e){} } return aud; }
  function silentURL(){ if(silent) return silent; const n=800, b=new ArrayBuffer(44+n), v=new DataView(b); const w=(o,s)=>{ for(let i=0;i<s.length;i++) v.setUint8(o+i,s.charCodeAt(i)); };
    w(0,'RIFF'); v.setUint32(4,36+n,true); w(8,'WAVE'); w(12,'fmt '); v.setUint32(16,16,true); v.setUint16(20,1,true); v.setUint16(22,1,true); v.setUint32(24,8000,true); v.setUint32(28,8000,true); v.setUint16(32,1,true); v.setUint16(34,8,true); w(36,'data'); v.setUint32(40,n,true);
    for(let i=0;i<n;i++) v.setUint8(44+i,128); silent=URL.createObjectURL(new Blob([b],{type:'audio/wav'})); return silent; }
  // iPhone and iPad only let a page start audio inside a tap. Call this synchronously from the tap, before any await.
  function unlock(force){ if(!force&&!on()) return false; const a=audioEl(); try{ a.src=silentURL(); const p=a.play(); if(p&&p.catch) p.catch(()=>{}); }catch(e){} return true; }
  function rate(){ const r=Number(A&&A.S&&A.S.tts&&A.S.tts.rate)||(window.GP&&GP.S&&GP.S.tts&&Number(GP.S.tts.rate))||0.95; return Math.max(0.75,Math.min(1.25,r)); }
  function media(title){ try{ if(!('mediaSession' in navigator)||!window.MediaMetadata) return; navigator.mediaSession.metadata=new MediaMetadata({ title:title||'Lecture', artist:label(), album:'Genius Protocol' });
      navigator.mediaSession.setActionHandler('play',()=>resume()); navigator.mediaSession.setActionHandler('pause',()=>pause()); }catch(e){} }
  function play(blob,my,onstart){
    return new Promise((res,rej)=>{ const a=audioEl(); const url=URL.createObjectURL(blob); let fin=false;
      const done=err=>{ if(fin) return; fin=true; a.onended=a.onerror=a.onplaying=null; if(endPlay===finish) endPlay=null; setTimeout(()=>{ try{ URL.revokeObjectURL(url); }catch(e){} },1000); err?rej(err):res(); };
      const finish=()=>done(); endPlay=finish;
      a.onended=()=>done(); a.onerror=()=>done(mkErr('playback','The audio could not be played.')); a.onplaying=()=>{ try{ onstart&&onstart(); }catch(e){} };
      a.src=url; const r=rate(); try{ a.defaultPlaybackRate=r; a.playbackRate=r; }catch(e){}
      const go=()=>{ if(my!==gen) return done(); const p=a.play(); if(p&&p.catch) p.catch(e=>{ if(e&&e.name==='AbortError') return; done(mkErr(e&&e.name==='NotAllowedError'?'not_allowed':'playback',(e&&e.message)||'')); }); };
      if(paused) resumeWait=go; else go();
    });
  }
  // Speak text with the professor voice. Resolves when finished or stopped; rejects (with .code) if it can't, so callers can fall back.
  function say(text,opts){ opts=opts||{}; halt(); const my=++gen; const parts=chunks(text);
    return new Promise((resolve,reject)=>{ pendingResolve=resolve; let started=false;
      const finish=()=>{ if(pendingResolve===resolve) pendingResolve=null; resolve(); };
      (async()=>{
        if(!parts.length) return finish();
        media(opts.title);
        let nextP=clip(parts[0],{next:parts[1]||''}); nextP.catch(()=>{});
        for(let i=0;i<parts.length;i++){
          const blob=await nextP; if(my!==gen) return finish();
          if(i+1<parts.length){ nextP=clip(parts[i+1],{prev:parts[i],next:parts[i+2]||''}); nextP.catch(()=>{}); }
          else if(opts.prefetchNext) prefetch(opts.prefetchNext);
          await play(blob,my,()=>{ if(!started){ started=true; try{ opts.onstart&&opts.onstart(); }catch(e){} } });
          if(my!==gen) return finish();
        }
        finish();
      })().catch(e=>{ if(pendingResolve===resolve) pendingResolve=null; if(my!==gen) return resolve(); reject(e); });
    });
  }
  function halt(){ gen++; resumeWait=null; try{ if(aud){ aud.pause(); } }catch(e){} if(endPlay){ const f=endPlay; endPlay=null; f(); } if(pendingResolve){ const r=pendingResolve; pendingResolve=null; r(); } }
  function stop(){ halt(); paused=false; }
  function pause(){ paused=true; try{ if(aud) aud.pause(); }catch(e){} }
  function resume(){ paused=false; if(resumeWait){ const f=resumeWait; resumeWait=null; f(); return; } try{ if(aud&&aud.src&&!aud.ended){ const p=aud.play(); if(p&&p.catch) p.catch(()=>{}); } }catch(e){} }
  function isPaused(){ return paused; }

  window.GP_VOICE={ on, hasKey, label, say, stop, pause, resume, isPaused, prefetch, unlock, suspend, explain, chunks, prefs, framed:FRAMED, VOICES, MODELS };

  /* ---------- Professor voice page ---------- */
  function voiceView(){
    const p=prefs(), has=hasKey(), u=usage(), mb=(bytes()/1048576);
    const status = FRAMED ? `<div class="holo" style="border-color:var(--amber)"><b style="color:var(--amber)">● Inside the Claude app</b> — the app may not contact other sites here, so lectures use this device's voices. Open the website version for the professor voice.</div>`
      : on() ? `<div class="holo" style="border-color:var(--ok)"><b style="color:var(--ok)">● On.</b> Lectures and the Classroom speak with <b>${esc(p.name)}</b> (ElevenLabs). Anything that fails falls back to this device's voice.</div>`
      : has&&suspended ? `<div class="holo" style="border-color:var(--mag)"><b style="color:var(--mag)">● Paused after an error.</b> Using this device's voice for now. Tap Test voice to try again.</div>`
      : has ? `<div class="holo" style="border-color:var(--amber)"><b style="color:var(--amber)">○ Connected but switched off.</b> Lectures use this device's voices.</div>`
      : `<div class="holo" style="border-color:var(--mag)"><b style="color:var(--mag)">○ Not connected.</b> Lectures use this device's voices until you add an ElevenLabs key.</div>`;
    const custom=!VOICES.some(v=>v[0]===p.voice);
    const vlist=VOICES.map(([id,n,d])=>`<div class="row" style="justify-content:space-between;align-items:center;border-top:1px solid var(--line);padding:8px 0">
        <label style="display:flex;gap:10px;align-items:center;flex:1;min-width:200px"><input type="radio" name="gvv" value="${id}" ${p.voice===id?'checked':''} onchange="GP_VOICE_UI.pick('${id}','${n}')"><span><b>${n}</b> <span class="faint" style="font-size:13px">${esc(d)}</span></span></label>
        <button class="btn ghost sm" ${has&&!FRAMED?'':'disabled'} onclick="GP_VOICE_UI.preview('${id}','${n}',this)">▶ Preview</button></div>`).join('');
    const mopts=MODELS.map(([id,d])=>`<option value="${id}"${p.model===id?' selected':''}>${esc(d)}</option>`).join('');
    A.set(`<p class="eyebrow">Toolkit</p><h1 style="margin:0 0 6px">Professor voice</h1>
      <p class="muted" style="margin:0 0 12px">Give every lecture and the Classroom a lifelike, human voice from ElevenLabs, a specialist voice service. It uses your own ElevenLabs account, so you control the cost. Audio you've already heard is saved on this device and replays for free.</p>
      ${status}
      <div class="holo" style="margin-top:12px"><p class="eyebrow">Get a key (about 3 minutes)</p>
        <ol style="margin:6px 0 0 18px;padding:0;line-height:1.6">
          <li>Sign up or sign in at <a href="https://elevenlabs.io/app/settings/api-keys" target="_blank" rel="noopener">elevenlabs.io</a> and open <b>API keys</b>.</li>
          <li>Create a key. Under restrictions, allow only <b>Text to Speech</b> and set a <b>credit limit</b>, so a leaked key can't do anything else or cost more than you chose.</li>
          <li>Copy the key and paste it below. The free plan includes a small monthly allowance; whole lectures use a lot of characters, so regular listening needs a paid plan.</li>
        </ol></div>
      <div class="holo" style="margin-top:12px">
        <label for="gvkey" style="display:block;font-weight:600;margin-bottom:6px">ElevenLabs API key</label>
        <input id="gvkey" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${has?'A key is saved — paste a new one to replace it':'Paste your ElevenLabs key'}" style="width:100%">
        <label style="display:flex;gap:8px;align-items:center;margin:10px 0"><input type="checkbox" id="gvrem" ${(!has||remembered())?'checked':''}> Remember on this device (untick to forget it when the app closes)</label>
        <div class="row"><button class="btn mg" ${FRAMED?'disabled':''} onclick="GP_VOICE_UI.save()">${has?'Replace &amp; test':'Connect &amp; test'}</button>${has&&!FRAMED?'<button class="btn ghost" onclick="GP_VOICE_UI.test()">▶ Test voice</button>':''}</div>
        <p id="gvmsg" class="muted" role="status" style="margin:10px 0 0"></p></div>
      <div class="holo" style="margin-top:12px"><p class="eyebrow">Voice</p>
        <label style="display:flex;gap:10px;align-items:center;margin:4px 0 8px"><input type="checkbox" id="gvon" ${p.on?'checked':''} onchange="GP_VOICE_UI.toggle(this.checked)"> Use the professor voice for lectures and the Classroom</label>
        ${vlist}
        <div style="border-top:1px solid var(--line);padding-top:10px">
          <label for="gvcustom" style="display:block;margin-bottom:6px">Or use any voice from the ElevenLabs Voice Library: add it to <b>My Voices</b>, copy its voice ID, and paste it here</label>
          <div class="row"><input id="gvcustom" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Voice ID" value="${custom?esc(p.voice):''}" style="flex:1;min-width:180px"><button class="btn ghost sm" onclick="GP_VOICE_UI.custom()">Use this voice</button></div></div>
        <label for="gvmodel" style="display:block;margin:14px 0 6px">Voice model</label>
        <select id="gvmodel" onchange="GP_VOICE_UI.model(this.value)" style="width:100%">${mopts}</select>
        <p class="faint" style="font-size:13px;margin:8px 0 0">Speed follows the SPEED slider under each lecture.</p></div>
      <div class="holo" style="margin-top:12px"><p class="eyebrow">Usage on this device</p>
        <p style="margin:0">Characters sent to ElevenLabs: <b>${u.chars.toLocaleString()}</b> in ${u.calls.toLocaleString()} requests since ${esc(u.since)}. Replays of saved audio are free. Your real balance is on ElevenLabs' usage page.</p>
        <p class="faint" style="font-size:13px;margin:6px 0 0">Saved audio on this device: about ${mb.toFixed(1)} MB (oldest is removed past 250 MB).</p>
        <div class="row" style="margin-top:8px"><button class="btn ghost sm" onclick="GP_VOICE_UI.clear(this)">Delete saved audio</button>${has?'<button class="btn ghost sm" onclick="GP_VOICE_UI.forget(this)">Forget key on this device</button>':''}</div></div>
      <div class="holo" style="margin-top:12px"><p class="eyebrow">Keeping the key safe</p>
        <ul style="margin:6px 0 0 18px;padding:0;line-height:1.6">
          <li>The key is stored only in this browser on this device. It is never put in your progress or backups, and it is sent only to <code>api.elevenlabs.io</code>.</li>
          <li>ElevenLabs advises against putting keys in apps that run in a browser, because anyone who can use this device, or any script running on this page, could read it. That's why the steps above restrict the key to speech and cap its credits. Don't connect on a shared device.</li>
          <li>If the device is lost, delete the key on ElevenLabs. It stops working at once.</li>
        </ul></div>
      <div class="row" style="margin-top:14px"><button class="btn ghost" onclick="history.back()">◂ Back</button><button class="btn ghost" onclick="GP.go('tools')">Genius Tools</button></div>`);
  }
  function msg(t,ok){ const m=$('gvmsg'); if(m){ m.innerHTML=t; m.style.color=ok===true?'var(--ok)':ok===false?'var(--mag)':''; } }
  async function test(){
    unlock(true); suspended=false; msg('Generating a sample… (about '+SAMPLE.length+' characters)');
    try{ await say(SAMPLE,{title:'Voice test',onstart:()=>msg('▶ Playing '+esc(prefs().name)+'…')}); msg('✓ Connected. Lectures and the Classroom will use '+esc(prefs().name)+'.',true); return true; }
    catch(e){ msg('✗ '+esc(explain(e))+(e&&e.message&&e.code!=='api_error'?'<br><span class="faint">'+esc(e.message)+'</span>':''),false); return false; }
  }
  async function save(){
    const inp=$('gvkey'); const k=(inp&&inp.value||'').trim().replace(/\s+/g,'');
    if(!k){ if(hasKey()) return test(); msg('Paste your key first.',false); return; }
    if(k.length<20||/[^A-Za-z0-9_\-]/.test(k)){ msg('That doesn\'t look like an ElevenLabs API key. Check you copied all of it.',false); return; }
    if(!storeKey(k,!!($('gvrem')&&$('gvrem').checked))){ msg('This browser would not let the app store the key (private browsing or storage turned off).',false); return; }
    if(inp) inp.value=''; setPrefs({on:true});
    const ok=await test();
    if(ok) setTimeout(()=>{ if(location.hash==='#tool-voice'){ voiceView(); msg('✓ Connected. Lectures and the Classroom will use '+esc(prefs().name)+'.',true); } },1200);
  }
  async function preview(id,name,btn){
    unlock(true); const old=prefs(); setPrefs({voice:id,name}); const r=document.querySelector('input[name=gvv][value="'+id+'"]'); if(r) r.checked=true;
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
  window.GP_VOICE_UI={ save, test, preview, forget, clear,
    pick:(id,name)=>{ setPrefs({voice:id,name}); if(A) A.toast('Voice: '+name); },
    custom:()=>{ const v=($('gvcustom')&&$('gvcustom').value||'').trim(); if(!/^[A-Za-z0-9]{10,40}$/.test(v)){ msg('A voice ID is a code of letters and numbers, about 20 characters long.',false); return; }
      setPrefs({voice:v,name:'Custom voice'}); document.querySelectorAll('input[name=gvv]').forEach(r=>r.checked=false); msg('Custom voice saved. Tap Test voice to hear it.',true); },
    model:v=>{ if(MODELS.some(m=>m[0]===v)){ setPrefs({model:v}); if(A) A.toast('Voice model updated'); } },
    toggle:v=>{ setPrefs({on:!!v}); if(v) suspended=false; else stop(); if(A) A.toast(v?'Professor voice on':'Using device voices'); } };
  V.push({test:h=>h==='tool-voice', nav:'labs', render:(h,api)=>{ A=api; voiceView(); }});
  // Keep a reference to the engine API for rate() before the page is first opened.
  const grab=()=>{ if(!A&&window.GP_API) A=window.GP_API; }; if(document.readyState==='complete') setTimeout(grab,0); else window.addEventListener('load',grab);
})();
