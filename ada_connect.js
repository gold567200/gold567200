/* Connect ADA — lets ADA work when Genius Protocol runs on its own website instead of inside the Claude app.
   Inside the Claude app, ADA uses the viewer's Claude account (the `sample` capability) and nothing here is needed.
   On the website there is no Claude account to borrow, so the learner can paste their own Anthropic API key.
   The key is kept in this browser only (its own storage entry, never in progress or backups) and is sent only to
   api.anthropic.com. The provider below has the same call shape as the Claude app's: fn(messages, {onText, modelTier}) -> {text, truncated}. */
(function(){
  const V=window.GP_VIEWS=window.GP_VIEWS||[]; let A=null;
  const KEY_STORE='genius_ada_key_v1', PREF_STORE='genius_ada_prefs_v1', USE_STORE='genius_ada_usage_v1';
  const ENDPOINT='https://api.anthropic.com/v1/messages';
  const MODELS={ haiku:'claude-haiku-5-5', sonnet:'claude-sonnet-5-5', opus:'claude-opus-5-5' };
  const MODEL_LABEL={ haiku:'Haiku 5.5 — fastest and cheapest', sonnet:'Sonnet 5.5 — balanced (recommended)', opus:'Opus 5.5 — strongest, costs the most' };
  const FRAMED=(()=>{ try{ return window.self!==window.top; }catch(e){ return true; } })();
  const $=id=>document.getElementById(id);
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  /* ---------- local storage (device only) ---------- */
  function readKey(){ let k=''; try{ k=sessionStorage.getItem(KEY_STORE)||''; }catch(e){} if(!k){ try{ k=localStorage.getItem(KEY_STORE)||''; }catch(e){} } return k; }
  function remembered(){ try{ return !!localStorage.getItem(KEY_STORE); }catch(e){ return false; } }
  function forgetKey(){ try{ localStorage.removeItem(KEY_STORE); }catch(e){} try{ sessionStorage.removeItem(KEY_STORE); }catch(e){} }
  function storeKey(k,remember){ forgetKey(); try{ (remember?localStorage:sessionStorage).setItem(KEY_STORE,k); return true; }catch(e){ return false; } }
  function prefs(){ let p={}; try{ p=JSON.parse(localStorage.getItem(PREF_STORE)||'{}')||{}; }catch(e){}
    if(!MODELS[p.chat]) p.chat='sonnet'; if(typeof p.reactions!=='boolean') p.reactions=true; return p; }
  function setPrefs(patch){ const p=Object.assign(prefs(),patch); try{ localStorage.setItem(PREF_STORE,JSON.stringify(p)); }catch(e){} return p; }
  function usage(){ let u=null; try{ u=JSON.parse(localStorage.getItem(USE_STORE)||'null'); }catch(e){}
    if(!u||typeof u!=='object') u={}; ['calls','inTok','outTok'].forEach(k=>{ u[k]=Number(u[k])||0; }); if(!u.since) u.since=new Date().toISOString().slice(0,10); return u; }
  function addUsage(inTok,outTok){ const u=usage(); u.calls+=1; u.inTok+=Number(inTok)||0; u.outTok+=Number(outTok)||0; try{ localStorage.setItem(USE_STORE,JSON.stringify(u)); }catch(e){} }
  function resetUsage(){ try{ localStorage.removeItem(USE_STORE); }catch(e){} }

  /* ---------- request shaping ---------- */
  // The app's callers send the tutor instructions as a first user turn, sometimes followed by another user turn.
  // The Messages API wants alternating roles that start with the user, so consecutive turns of one role are joined.
  function toMessages(input){
    const arr=typeof input==='string'?[{role:'user',content:input}]:(Array.isArray(input)?input:[]);
    const out=[];
    arr.forEach(m=>{ if(!m) return; const role=m.role==='assistant'?'assistant':'user'; const c=String(m.content==null?'':m.content);
      if(!c.trim()) return; const last=out[out.length-1]; if(last&&last.role===role) last.content+='\n\n'+c; else out.push({role,content:c}); });
    while(out.length&&out[0].role!=='user') out.shift();
    while(out.length&&out[out.length-1].role!=='user') out.pop();
    return out;
  }
  function modelFor(tier){ if(tier==='quick') return MODELS.haiku; if(tier==='complex') return MODELS.opus; return MODELS[prefs().chat]||MODELS.sonnet; }
  function maxFor(tier){ return tier==='quick'?1024:tier==='complex'?4096:2048; }
  function headers(key){ return { 'content-type':'application/json', 'x-api-key':key, 'anthropic-version':'2023-06-01', 'anthropic-dangerous-direct-browser-access':'true' }; }

  /* ---------- errors ---------- */
  function mkErr(code,message,status){ const e=new Error(message||code); e.code=code; e.status=status||0; return e; }
  async function httpError(res){
    let type='', msg=''; try{ const j=await res.json(); type=(j&&j.error&&j.error.type)||''; msg=(j&&j.error&&j.error.message)||''; }catch(e){}
    const s=res.status;
    if(s===401||type==='authentication_error') return mkErr('bad_key',msg||'The API key was not accepted.',s);
    if(s===403||type==='permission_error') return mkErr('bad_key',msg||'This API key is not allowed to do that.',s);
    if(s===429||type==='rate_limit_error') return mkErr('rate_limited',msg||'Too many requests.',s);
    if(s===529||type==='overloaded_error') return mkErr('overloaded',msg||'Claude is overloaded.',s);
    if(/credit balance|billing|spend limit|usage limit/i.test(msg)) return mkErr('no_credit',msg,s);
    if(s===404||type==='not_found_error') return mkErr('model',msg||'That model is not available to this key.',s);
    return mkErr('api_error',msg||('Request failed ('+s+').'),s);
  }
  function explain(e){
    const c=e&&e.code;
    if(c==='bad_key') return "Your API key was refused. Open Connect ADA (Labs → Genius Tools) to check or replace it.";
    if(c==='no_credit') return "Your Anthropic API account has no credit left or has reached its spend limit. Add credit or raise the limit in the Claude Console, then ask again.";
    if(c==='rate_limited') return "We've asked a lot quickly — give it a moment and try again.";
    if(c==='overloaded') return "Claude is busy right now. Try again in a minute.";
    if(c==='network') return "I couldn't reach Claude. Check your internet connection and try again.";
    if(c==='model') return "Your key can't use the chosen model. Pick another one in Connect ADA.";
    if(c==='no_key') return "ADA isn't connected on this device yet. Open Connect ADA to add your key.";
    if(c==='api_error') return "Claude couldn't answer that: "+(e.message||'unknown error');
    return null;
  }

  /* ---------- local safety brake: at most 20 requests a minute from this page ---------- */
  const recent=[];
  function brake(){ const now=Date.now(); while(recent.length&&now-recent[0]>60000) recent.shift(); if(recent.length>=20) throw mkErr('rate_limited','Local limit: 20 requests a minute.'); recent.push(now); }

  /* ---------- the provider ---------- */
  async function call(input,opts){
    opts=opts||{}; const key=readKey(); if(!key) throw mkErr('no_key','No API key on this device.');
    const messages=toMessages(input); if(!messages.length) throw mkErr('api_error','Nothing to send.');
    brake();
    const tier=opts.modelTier||'default';
    const body={ model:opts.model||modelFor(tier), max_tokens:opts.maxTokens||maxFor(tier), messages };
    const stream=typeof opts.onText==='function';
    let res;
    try{ res=await fetch(ENDPOINT,{ method:'POST', headers:headers(key), body:JSON.stringify(stream?Object.assign({stream:true},body):body), signal:opts.signal }); }
    catch(e){ if(e&&e.name==='AbortError') throw e; throw mkErr('network','Network error: '+(e&&e.message||e)); }
    if(!res.ok) throw await httpError(res);
    if(!stream){
      let j=null; try{ j=await res.json(); }catch(e){ throw mkErr('api_error','The reply could not be read.'); }
      const text=(j.content||[]).filter(b=>b&&b.type==='text').map(b=>b.text).join('');
      addUsage(j.usage&&j.usage.input_tokens, j.usage&&j.usage.output_tokens);
      return { text, truncated:j.stop_reason==='max_tokens', model:j.model };
    }
    if(!res.body||!res.body.getReader){ // very old browsers: read the whole event stream at once
      return parseEvents(await res.text(),opts.onText);
    }
    const reader=res.body.getReader(), dec=new TextDecoder(); const st={buf:'',text:'',stop:null,inTok:0,outTok:0,model:body.model};
    let partialErr=null;
    try{
      for(;;){ const {done,value}=await reader.read(); if(done) break; st.buf+=dec.decode(value,{stream:true}).replace(/\r\n/g,'\n'); drain(st,opts.onText); }
      st.buf+='\n\n'; drain(st,opts.onText);
    }catch(e){ partialErr=e; }
    addUsage(st.inTok,st.outTok);
    if(partialErr){ if(partialErr.code) { partialErr.text=st.text; throw partialErr; } const e=mkErr('network','The answer was cut off.'); e.text=st.text; throw e; }
    return { text:st.text, truncated:st.stop==='max_tokens', model:st.model };
  }
  function drain(st,onText){
    let i; while((i=st.buf.indexOf('\n\n'))>=0){ const chunk=st.buf.slice(0,i); st.buf=st.buf.slice(i+2);
      const data=chunk.split('\n').filter(l=>l.startsWith('data:')).map(l=>l.slice(5).replace(/^ /,'')).join('\n'); if(!data) continue;
      let ev; try{ ev=JSON.parse(data); }catch(e){ continue; }
      if(ev.type==='message_start'&&ev.message){ st.model=ev.message.model||st.model; st.inTok=(ev.message.usage&&ev.message.usage.input_tokens)||0; }
      else if(ev.type==='content_block_delta'&&ev.delta&&ev.delta.type==='text_delta'){ st.text+=ev.delta.text||''; try{ onText&&onText({text:st.text,delta:ev.delta.text||''}); }catch(e){} }
      else if(ev.type==='message_delta'){ if(ev.delta&&ev.delta.stop_reason) st.stop=ev.delta.stop_reason; if(ev.usage&&ev.usage.output_tokens) st.outTok=ev.usage.output_tokens; }
      else if(ev.type==='error'){ const t=(ev.error&&ev.error.type)||'', m=(ev.error&&ev.error.message)||'Stream error';
        throw mkErr(t==='overloaded_error'?'overloaded':t==='rate_limit_error'?'rate_limited':'api_error',m); }
    }
  }
  function parseEvents(all,onText){ const st={buf:all.replace(/\r\n/g,'\n')+'\n\n',text:'',stop:null,inTok:0,outTok:0,model:''}; drain(st,onText); addUsage(st.inTok,st.outTok); return {text:st.text,truncated:st.stop==='max_tokens',model:st.model}; }

  const sample=function(input,opts){ return call(input,opts); };
  sample.json=async function(input,opts){ const r=await call(input,opts); const m=(r.text||'').match(/[\[{][\s\S]*[\]}]/); if(!m) throw mkErr('api_error','No JSON in the reply.'); return JSON.parse(m[0]); };
  sample.limits=async function(){ return {images:false}; };
  sample.viaKey=true;

  window.ADA_KEY={ sample, ready:()=>!!readKey(), explain, prefs, autoReactions:()=>prefs().reactions, modelFor, toMessages, framed:FRAMED, MODELS };

  /* ---------- Connect ADA page ---------- */
  async function connectView(){
    const p=prefs(), has=!!readKey(), u=usage();
    let viaClaude=false; try{ const fn=window.claude&&claude.use?await Promise.race([claude.use('sample'),new Promise(r=>setTimeout(()=>r(null),1500))]):null; viaClaude=!!fn; }catch(e){}
    const status = viaClaude ? `<div class="holo" style="border-color:var(--ok)"><b style="color:var(--ok)">● Connected through the Claude app.</b> ADA is using your Claude account here, so you don't need a key in this view. A key is only for the website version.</div>`
      : has ? `<div class="holo" style="border-color:var(--ok)"><b style="color:var(--ok)">● Connected with your API key</b> (${remembered()?'remembered on this device':'kept until you close this app'}). Chat model: ${esc(MODEL_LABEL[p.chat])}.</div>`
      : `<div class="holo" style="border-color:var(--mag)"><b style="color:var(--mag)">○ Not connected on this device.</b> Everything else in the app works; ADA needs a connection to answer.</div>`;
    const viewerNote = FRAMED ? `<p class="faint" style="font-size:13px">You're inside the Claude app, which blocks the page from contacting other sites, so a pasted key can't be used here. Open the website version for that.</p>` : '';
    const opts=Object.keys(MODELS).map(k=>`<option value="${k}"${p.chat===k?' selected':''}>${esc(MODEL_LABEL[k])}</option>`).join('');
    A.set(`<p class="eyebrow">Toolkit</p><h1 style="margin:0 0 6px">Connect ADA</h1>
      <p class="muted" style="margin:0 0 12px">Inside the Claude app, ADA uses your Claude account. On the Genius Protocol website there's no Claude account to borrow, so ADA talks to Claude with your own Anthropic API key instead.</p>
      ${status}${viewerNote}
      <div class="holo" style="margin-top:12px"><p class="eyebrow">Get a key (about 3 minutes)</p>
        <ol style="margin:6px 0 0 18px;padding:0;line-height:1.6">
          <li>Sign in at <a href="https://platform.claude.com/" target="_blank" rel="noopener">platform.claude.com</a> (the Claude Console). API use is pay-as-you-go and billed separately from any Claude subscription.</li>
          <li>Under <b>Settings → Workspaces</b>, create a workspace just for this app and give it a low monthly <b>spend limit</b>. (The Default workspace can't have one.)</li>
          <li>Create an <b>API key</b> in that workspace, copy it, and paste it below.</li>
        </ol></div>
      <div class="holo" style="margin-top:12px">
        <label for="adakey" style="display:block;font-weight:600;margin-bottom:6px">Anthropic API key</label>
        <input id="adakey" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${has?'A key is saved — paste a new one to replace it':'sk-ant-…'}" style="width:100%">
        <label style="display:flex;gap:8px;align-items:center;margin:10px 0"><input type="checkbox" id="adarem" ${(!has||remembered())?'checked':''}> Remember on this device (untick to forget it when the app closes)</label>
        <div class="row"><button class="btn mg" onclick="ADA_CONNECT.save()">${has?'Replace &amp; test':'Connect &amp; test'}</button>${has?'<button class="btn ghost" onclick="ADA_CONNECT.test()">Test connection</button>':''}</div>
        <p id="adamsg" class="muted" role="status" style="margin:10px 0 0"></p></div>
      <div class="holo" style="margin-top:12px"><p class="eyebrow">Settings</p>
        <label for="adamodel" style="display:block;margin-bottom:6px">Model for chat with ADA</label>
        <select id="adamodel" onchange="ADA_CONNECT.model(this.value)" style="width:100%">${opts}</select>
        <p class="faint" style="font-size:13px;margin:6px 0 10px">Quick jobs (grading a short answer, a one-line reaction) always use Haiku to keep costs down.</p>
        <label style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="adareact" ${p.reactions?'checked':''} onchange="ADA_CONNECT.reactions(this.checked)"> Let ADA react after lessons and exams (one short Haiku request each time)</label>
        <p class="faint" style="font-size:13px;margin:12px 0 0">Requests from this device through your key: <b>${u.calls}</b> since ${esc(u.since)} · about ${u.inTok.toLocaleString()} tokens sent, ${u.outTok.toLocaleString()} received. Your real spend is on the Console's Usage page.</p>
        <div class="row" style="margin-top:8px"><button class="btn ghost sm" onclick="ADA_CONNECT.resetUsage()">Reset counter</button>${has?'<button class="btn ghost sm" onclick="ADA_CONNECT.forget(this)">Forget key on this device</button>':''}</div></div>
      <div class="holo" style="margin-top:12px"><p class="eyebrow">Keeping the key safe</p>
        <ul style="margin:6px 0 0 18px;padding:0;line-height:1.6">
          <li>The key is stored only in this browser on this device. It is never put in your progress or backups, and it is sent only to <code>api.anthropic.com</code>.</li>
          <li>Anyone who can open this app on this device can use it, and so could any script running on this page, so use a key with a spend limit and don't connect on a shared device.</li>
          <li>If the device is lost, delete the key in the Console. It stops working at once.</li>
        </ul></div>
      <div class="row" style="margin-top:14px"><button class="btn ghost" onclick="GP.go('tutor')">Back to ADA</button><button class="btn ghost" onclick="GP.go('tools')">Genius Tools</button></div>`);
  }
  function msg(t,ok){ const m=$('adamsg'); if(m){ m.innerHTML=t; m.style.color=ok===true?'var(--ok)':ok===false?'var(--mag)':''; } }
  async function test(){
    msg('Testing… (one tiny request)');
    try{ const r=await call([{role:'user',content:'Reply with exactly the word: ready'}],{modelTier:'default',maxTokens:16});
      msg('✓ Connected. '+esc(r.model||modelFor('default'))+' replied “'+esc((r.text||'').trim().slice(0,40))+'”. ADA is ready.',true); return true; }
    catch(e){ msg('✗ '+esc(explain(e)||e.message||'That did not work.')+(e&&e.message&&explain(e)&&e.code!=='api_error'?'<br><span class="faint">'+esc(e.message)+'</span>':''),false); return false; }
  }
  async function saveKey(){
    const inp=$('adakey'); const k=(inp&&inp.value||'').trim().replace(/\s+/g,'');
    if(!k){ if(readKey()) return test(); msg('Paste your key first.',false); return; }
    if(!/^sk-ant-/.test(k)){ msg('That doesn\'t look like an Anthropic API key (they start with “sk-ant-”). Check you copied the whole key.',false); return; }
    const rem=!!($('adarem')&&$('adarem').checked);
    if(!storeKey(k,rem)){ msg('This browser would not let the app store the key (private browsing or storage turned off).',false); return; }
    if(inp) inp.value='';
    const ok=await test();
    if(ok){ setTimeout(()=>{ if(location.hash==='#tool-ada') connectView().then(()=>msg('✓ Connected. ADA is ready.',true)); },900); }
  }
  function forget(btn){
    if(btn&&!btn.dataset.armed){ btn.dataset.armed='1'; btn.textContent='Tap again to forget the key'; setTimeout(()=>{ if(btn.isConnected){ delete btn.dataset.armed; btn.textContent='Forget key on this device'; } },4000); return; }
    forgetKey(); if(A) A.toast('Key removed from this device'); connectView();
  }
  window.ADA_CONNECT={ save:saveKey, test, forget, model:v=>{ if(MODELS[v]){ setPrefs({chat:v}); if(A) A.toast('Chat model: '+MODEL_LABEL[v].split(' —')[0]); } },
    reactions:v=>{ setPrefs({reactions:!!v}); }, resetUsage:()=>{ resetUsage(); connectView(); } };
  V.push({test:h=>h==='tool-ada', nav:'tutor', render:(h,api)=>{ A=api; connectView(); }});
})();
