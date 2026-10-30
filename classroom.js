/* Classroom — hands-free, voice-first one-on-one lectures.
   The professor (ADA's voice) teaches a module section by section, asks questions,
   listens to the spoken answer, grades it, and moves on. Built for ears, not eyes. */
(function(){
  const V=window.GP_VIEWS=window.GP_VIEWS||[];
  let A=null;
  const st={ running:false, paused:false, mid:null, p:null, m:null, steps:[], i:0, abort:false, rec:null, recOK:null, wake:null,
    score:{ok:0,n:0}, resumeP:null, resumeFn:null, lastHeard:'', status:'idle', autoNext:true, adaQ:true, answered:{}, tts:null, inputWait:null };
  // Inside the Claude app the page runs in a frame that may not use the microphone, so answers are typed there
  // (the keyboard's own dictation microphone still lets you speak them).
  const FRAMED=(()=>{ try{ return window.self!==window.top; }catch(e){ return true; } })();
  const css=`
  .cls-orb{width:120px;height:120px;border-radius:50%;margin:14px auto;border:2px solid var(--line);position:relative;background:radial-gradient(circle at 50% 50%,#0e2238,#07101f 70%);transition:box-shadow .3s,border-color .3s}
  .cls-orb::after{content:'';position:absolute;inset:18px;border-radius:50%;border:1px dashed var(--line);opacity:.6}
  .cls-orb.speaking{border-color:var(--cyan);box-shadow:0 0 28px #00e5ff66,inset 0 0 30px #00e5ff33;animation:clsPulse 1.4s ease-in-out infinite}
  .cls-orb.listening{border-color:var(--mag);box-shadow:0 0 34px #ff2bd666,inset 0 0 30px #ff2bd633;animation:clsPulse .9s ease-in-out infinite}
  .cls-orb.thinking{border-color:var(--amber);box-shadow:0 0 24px #ffb13b55;animation:clsSpin 1.6s linear infinite}
  @keyframes clsPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
  @keyframes clsSpin{from{filter:hue-rotate(0)}to{filter:hue-rotate(360deg)}}
  .cls-stat{font-family:var(--fmono);letter-spacing:.12em;text-transform:uppercase;font-size:12px;color:var(--cyan);min-height:18px}
  .cls-heard{min-height:44px;font-size:17px;line-height:1.4;color:#e6f6ff;padding:10px 12px;border:1px solid var(--line);border-radius:12px;background:#0b1322;margin:12px 0}
  .cls-now{font-size:15px;color:var(--muted);line-height:1.5;max-height:5.5em;overflow:hidden}
  .btn.xl{font-size:18px;padding:16px 22px;border-radius:16px;min-width:46%}
  .cls-row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:14px}
  .cls-row .btn{flex:1 1 44%}
  .cls-pick .item .me{white-space:normal}
  .cls-now.reading{max-height:none;overflow:visible;font-size:17px;color:#e6f6ff;text-align:left}
  .cls-input{margin-top:12px;text-align:left}
  .cls-input textarea{width:100%;min-height:96px;font-size:17px;line-height:1.45;background:#070f1c;border:1px solid var(--line);border-radius:12px;color:var(--fg);padding:12px}
  .cls-input .hint{font-size:13px;color:var(--dim);margin:6px 2px 0}`;
  const styleEl=document.createElement('style'); styleEl.textContent=css; document.head.appendChild(styleEl);

  /* ---------- helpers ---------- */
  const $=id=>document.getElementById(id);
  const esc=s=>A?A.esc(s):String(s);
  function setStatus(s,label){ st.status=s; const o=$('corb'); if(o){ o.className='cls-orb '+s; } const t=$('cstat'); if(t) t.textContent=label||({speaking:micUsable()?'Speaking — say "pause" or "repeat" when I stop':'Speaking',listening:micUsable()?'Listening… speak now':'Your turn',thinking:'Thinking…',idle:'Ready',paused:'Paused',reading:'Read this, then tap Continue'}[s]||s); }
  function showHeard(t){ st.lastHeard=t||''; const h=$('cheard'); if(h) h.textContent=t?('“'+t+'”'):''; }
  function showNow(t){ const n=$('cnow'); if(n) n.textContent=t||''; }
  function showProg(){ const p=$('cprog'); if(p&&st.steps.length) p.textContent='Step '+Math.min(st.i+1,st.steps.length)+' of '+st.steps.length+(st.score.n?(' · '+st.score.ok+'/'+st.score.n+' correct'):''); }
  function htmlToSpeech(html){
    const d=document.createElement('div'); d.innerHTML=html||'';
    d.querySelectorAll('pre').forEach(x=>{ x.replaceWith(document.createTextNode(' There\'s a code example on screen; have a look at it later. ')); });
    d.querySelectorAll('table').forEach(t=>{ const rows=(A&&A.tableSpeech)?A.tableSpeech(t):[...t.querySelectorAll('tr')].map(r=>[...r.children].map(c=>c.textContent.trim()).filter(Boolean).join(', ')+'.'); t.replaceWith(document.createTextNode(' Here\'s a quick table. '+rows.join(' ')+' ')); });
    d.querySelectorAll('li').forEach(li=>{ li.insertAdjacentText('afterend','. '); });
    d.querySelectorAll('sup').forEach(s=>{ s.replaceWith(document.createTextNode(' to the power of '+s.textContent+' ')); });
    d.querySelectorAll('h4').forEach(h=>{ h.replaceWith(document.createTextNode(' '+h.textContent+'. ')); });
    let t=d.textContent.replace(/\s+/g,' ').trim();
    return A?A.cleanForSpeech(t):t;
  }
  function sections(m){
    const d=document.createElement('div'); d.innerHTML=m.body||''; const out=[]; let cur={title:'',nodes:[]};
    [...d.childNodes].forEach(n=>{ if(n.nodeType===1&&n.tagName==='H4'){ if(cur.nodes.length) out.push(cur); cur={title:n.textContent.trim(),nodes:[]}; } else cur.nodes.push(n); });
    if(cur.nodes.length) out.push(cur);
    return out.map(s=>{ const w=document.createElement('div'); s.nodes.forEach(n=>w.appendChild(n.cloneNode(true))); return {title:s.title, html:w.innerHTML, text:htmlToSpeech(w.innerHTML)}; }).filter(s=>s.text.length>40);
  }
  function chunk(text){ const out=[]; let buf=''; (String(text).match(/[^.!?]+[.!?]+["')\]]?\s*|[^.!?]+$/g)||[text]).forEach(sn=>{ if((buf+sn).length>230&&buf){ out.push(buf.trim()); buf=''; } buf+=sn; }); if(buf.trim()) out.push(buf.trim()); return out; }

  /* ---------- speech out ---------- */
  // Reading mode: when this device can't speak, show the text in full and wait for "Continue".
  function readOnScreen(text,label){
    return new Promise(res=>{ if(st.abort) return res();
      setStatus('reading',label||'Read this, then tap Continue'); const n=$('cnow'); if(n){ n.classList.add('reading'); n.textContent=text; }
      inputArea(`<div class="cls-row"><button class="btn mg xl" id="ccont">Continue ▸</button></div>`);
      const b=$('ccont'); st.inputWait=()=>{ st.inputWait=null; clearInput(); res(); }; if(b){ b.onclick=()=>{ const f=st.inputWait; if(f) f(); }; try{ b.focus({preventScroll:true}); }catch(e){} } });
  }
  function speak(text,label){
    if(st.abort) return Promise.resolve();
    if(window.GP_VOICE&&GP_VOICE.on()) return new Promise(res=>{ // professor voice (ElevenLabs); falls back to the device voice
      setStatus('speaking',label); const n=$('cnow'); if(n) n.classList.remove('reading'); showNow(text);
      GP_VOICE.say(text,{title:(st.m&&st.m.title)||'Classroom'}).then(res,e=>{ if(st.abort) return res(); GP_VOICE.suspend(); try{ A.toast(GP_VOICE.explain(e)+' Switching to the device voice.'); }catch(_){} deviceSpeak(text,label).then(res); }); });
    return deviceSpeak(text,label);
  }
  function deviceSpeak(text,label){
    if(st.abort) return Promise.resolve();
    if(st.tts===false||!('speechSynthesis' in window)) return readOnScreen(text,label);
    return new Promise(res=>{
      setStatus('speaking',label); const n=$('cnow'); if(n) n.classList.remove('reading'); showNow(text);
      const parts=chunk(text); let k=0, started=false, guard=null;
      const fallback=()=>{ // nothing came out: this device or frame is not letting the page speak
        st.tts=false; try{ speechSynthesis.cancel(); }catch(e){}
        readOnScreen(parts.slice(Math.max(0,k-1)).join(' '),label).then(res); };
      const next=()=>{ clearTimeout(guard); if(st.abort||st.paused) return res(); if(k>=parts.length) return res();
        const u=new SpeechSynthesisUtterance(parts[k++]); const v=A.bestVoice(); if(v){ u.voice=v; u.lang=v.lang||'en-US'; } else u.lang='en-US';
        u.rate=(A.ttsRate?A.ttsRate():1.5); u.pitch=1; u.volume=1;
        u.onstart=()=>{ started=true; st.tts=true; clearTimeout(guard); };
        u.onend=next; u.onerror=(e)=>{ clearTimeout(guard); const er=e&&e.error; if(er==='interrupted'||er==='canceled') return res(); if(er==='not-allowed'||(!started&&er==='synthesis-failed')) return fallback(); next(); };
        try{ speechSynthesis.speak(u); }catch(e){ return fallback(); }
        if(!started&&st.tts!==true) guard=setTimeout(()=>{ if(!started) fallback(); },4500); };
      next();
    });
  }
  function stopSpeaking(){ try{ if(window.GP_VOICE) GP_VOICE.stop(); }catch(e){} try{ speechSynthesis.cancel(); }catch(e){} }

  /* ---------- speech in ---------- */
  function SR(){ return window.SpeechRecognition||window.webkitSpeechRecognition||null; }
  function micUsable(){ return !FRAMED && !!SR() && st.recOK!==false; }
  function inputArea(html){ const c=$('cinput'); if(c){ c.innerHTML=html; c.hidden=false; } }
  function clearInput(){ const c=$('cinput'); if(c){ c.innerHTML=''; c.hidden=true; } }
  // Typed (or keyboard-dictated) replies. kind: 'window' (no wait), 'answer', 'question', 'yesno', 'end', 'stopwin'.
  function listenTyped(o={}){
    return new Promise(res=>{
      if(st.abort) return res({text:null});
      const kind=o.kind||'window';
      const done=(t)=>{ st.inputWait=null; clearInput(); res({text:t,typed:true}); };
      st.inputWait=(v)=>done(v==null?null:v);
      if(kind==='window'){ st.inputWait=null; return res({text:null,typed:true}); }
      if(kind==='yesno'){ setStatus('listening',o.label||'Did you have it?'); inputArea(`<div class="cls-row"><button class="btn xl" id="cy">Yes, I had it</button><button class="btn ghost xl" id="cn">No</button></div>`); $('cy').onclick=()=>done('yes'); $('cn').onclick=()=>done('no'); return; }
      if(kind==='end'){ setStatus('listening',o.label||'What next?'); inputArea(`<div class="cls-row">${o.next?`<button class="btn mg xl" id="cnx">Next lesson ▸</button>`:''}<button class="btn ghost xl" id="crp">Repeat this lesson</button><button class="btn ghost xl" id="cst">Stop</button></div>`); if($('cnx')) $('cnx').onclick=()=>done('next'); $('crp').onclick=()=>done('repeat'); $('cst').onclick=()=>done('stop'); return; }
      if(kind==='stopwin'){ setStatus('listening',o.label||'Continuing…'); inputArea(`<div class="cls-row"><button class="btn ghost xl" id="cst">Stop here</button></div>`); $('cst').onclick=()=>done('stop'); const t=setTimeout(()=>{ if(st.inputWait) done(null); },o.maxMs||5000); return; }
      // 'answer' or 'question': a text box; the keyboard's microphone key dictates into it
      setStatus('listening',o.label||(kind==='question'?'Type or dictate your question':'Type or dictate your answer'));
      inputArea(`<label for="cans" class="eyebrow" style="display:block;margin:0 0 6px">${kind==='question'?'Your question':'Your answer'}</label><textarea id="cans" autocomplete="off" placeholder="${kind==='question'?'Ask anything about this lesson…':'Answer in a sentence or two…'}"></textarea>
        <p class="hint">On a phone, tap the microphone on your keyboard to speak your ${kind==='question'?'question':'answer'} instead of typing.</p>
        <div class="cls-row"><button class="btn mg xl" id="csend">${kind==='question'?'Ask':'Send answer'}</button>${kind==='answer'?`<button class="btn ghost xl" id="cidk">I don't know</button><button class="btn ghost xl" id="crq">Repeat question</button>`:`<button class="btn ghost xl" id="ccan">Never mind</button>`}</div>`);
      const ta=$('cans'); const send=()=>{ const v=(ta&&ta.value||'').trim(); if(!v){ if(ta) ta.focus(); return; } done(v); };
      $('csend').onclick=send; if(ta) ta.addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); send(); } });
      if($('cidk')) $('cidk').onclick=()=>done("I don't know");
      if($('crq')) $('crq').onclick=()=>done('repeat');
      if($('ccan')) $('ccan').onclick=()=>done(null);
      try{ if(ta) ta.focus({preventScroll:false}); }catch(e){}
    });
  }
  function listen(o={}){ if(!micUsable()) return listenTyped(o); return listenMic(o); }
  function listenMic(o={}){
    return new Promise(res=>{
      const R=SR(); if(!R||st.recOK===false||st.abort){ return listenTyped(o).then(res); }
      let done=false, finalText='', interim=''; const r=new R(); st.rec=r;
      r.lang='en-US'; r.interimResults=true; r.maxAlternatives=1; r.continuous=false;
      const finish=(t)=>{ if(done) return; done=true; clearTimeout(tm); st.rec=null; try{ r.onend=null; r.stop(); }catch(e){} setStatus('thinking','Got it'); res({text:t}); };
      r.onresult=e=>{ for(let i=e.resultIndex;i<e.results.length;i++){ const t=e.results[i][0].transcript; if(e.results[i].isFinal) finalText+=t+' '; else interim=t; } showHeard((finalText+interim).trim()); };
      r.onerror=e=>{ const err=e&&e.error; if(err==='not-allowed'||err==='service-not-allowed'||err==='audio-capture'){ st.recOK=false; if(!done){ done=true; clearTimeout(tm); st.rec=null; listenTyped(o).then(res); } return; } finish(finalText.trim()||null); };
      r.onend=()=>finish((finalText||interim).trim()||null);
      const tm=setTimeout(()=>finish((finalText||interim).trim()||null), o.maxMs||16000);
      try{ r.start(); st.recOK=st.recOK===null?true:st.recOK; setStatus('listening',o.label||'Listening… speak now'); showHeard(''); }catch(e){ finish(null); }
    });
  }
  function stopListening(){ if(st.rec){ try{ st.rec.abort(); }catch(e){} st.rec=null; } }
  function command(t){
    if(!t) return null; const s=t.toLowerCase().trim(); const words=s.split(/\s+/).length; if(words>6) return null;
    if(/^(repeat|again|say that again|one more time|what\?|pardon)/.test(s)) return 'repeat';
    if(/^(next|continue|go on|move on|okay next|ok next|carry on)/.test(s)) return 'next';
    if(/^(skip|skip it|skip this|pass)/.test(s)) return 'skip';
    if(/^(pause|hold on|wait|hang on)/.test(s)) return 'pause';
    if(/^(stop|end class|end session|end the class|quit|exit)/.test(s)) return 'stop';
    if(/(slower|slow down)/.test(s)) return 'slower';
    if(/(faster|speed up)/.test(s)) return 'faster';
    if(/^(simpler|simple|simplify|i don'?t get it|i don'?t understand|explain that again|explain simpler)/.test(s)) return 'simpler';
    if(/^(question|i have a question|ask you something|can i ask)/.test(s)) return 'question';
    return null;
  }

  /* ---------- ADA (the professor's brain) ---------- */
  async function ada(prompt,maxWords){
    try{ const fn=await A.getSample(); if(!fn) return null; setStatus('thinking');
      const sys=A.ADA_SYS+"\n\nCLASSROOM ORAL MODE: everything you write will be read aloud by text-to-speech to a student who may be driving. Use plain spoken English only: no markdown, no bullet points, no headings, no code, no emojis, no URLs. Keep it under "+(maxWords||70)+" words.";
      const r=await fn([{role:'user',content:sys},{role:'user',content:prompt}],{modelTier:'quick',cache:false}); return (r&&r.text||'').trim()||null; }catch(e){ return null; }
  }
  async function genQuestion(sec){
    const t=await ada("The student just heard this section of the lecture '"+st.m.title+"':\n\n"+sec.text.slice(0,1800)+"\n\nWrite ONE short oral comprehension question about it (max 25 words) that can be answered in one or two spoken sentences, then its model answer (max 40 words). Output exactly two lines: 'Q: ...' and 'A: ...'.",80);
    if(!t) return null; const q=(t.match(/Q:\s*([^\n]+)/i)||[])[1], a=(t.match(/A:\s*([\s\S]+)/i)||[])[1]; if(!q) return null; return {q:q.trim(),a:(a||'').trim()};
  }
  async function grade(q,a,heard){
    const t=await ada("Oral quiz grading. Question: "+q+"\nModel answer: "+a+"\nThe student answered by voice or by typing (dictation and speech-to-text can contain recognition errors), so judge the meaning, not the wording: \""+heard+"\"\nReply in under 60 spoken words: start with exactly one of 'Correct.', 'Partly right.' or 'Not quite.', then state the key point in one or two sentences, then one short encouraging sentence.",60);
    if(!t) return null; const ok=/^correct/i.test(t); const partly=/^partly/i.test(t); return {text:t,ok,partly};
  }

  /* ---------- the lesson script ---------- */
  function buildSteps(p,m){
    const S=[]; const simple=(window.SIMPLE||{})[m.id];
    const num=(p.modules||[]).indexOf(m)+1;
    S.push({type:'say',text:"Welcome to the classroom. Today's lesson is "+m.title+", module "+num+" of "+p.title+". I'll teach it in sections and ask you questions as we go"+(micUsable()?"; just answer out loud. Whenever I pause, you can say repeat, next, skip, pause, slower, faster, simpler, or stop.":". Type your answers, or tap the microphone on your keyboard and say them. The buttons below let you pause, repeat, skip or ask a question at any time.")+" Let's begin."});
    S.push({type:'say',text:"By the end of this lesson you will be able to: "+m.outcomes.map(o=>o.trim().replace(/[.]+$/,'')).join('. ')+"."});
    if(simple) S.push({type:'say',text:"First, the simple version. "+simple.picture+" "+simple.idea+" Why it matters: "+simple.why, cue:'simple'});
    // Guided-mode focus pack (focus_*.js): the big idea up front, a plain-words line per section, "remember this" moments and a recap.
    const F=(window.FOCUS||{})[m.id]; const fparts=F?F.parts||[]:[]; const frem=F?F.remember||[]:[];
    const norm=t=>String(t||'').replace(/\s+/g,' ').trim().toLowerCase();
    if(F) S.push({type:'say',text:"Here's the big idea. "+F.big+" Why it matters: "+F.why+" There are "+frem.length+" things I want you to remember from this lesson. I'll point each one out when we get to it.", cue:'focus'});
    const secs=sections(m);
    secs.forEach((sec,k)=>{ const pi=sec.title?fparts.findIndex(x=>norm(x.t)===norm(sec.title)):-1; const fp=pi>=0?fparts[pi]:null;
      const lead=fp?((fp.core?'':"This one is extra depth. Worth hearing once, but you don't need to memorize it. ")+(fp.gist?'In plain words: '+fp.gist+' ':'')):'';
      S.push({type:'say',text:(sec.title?('Section '+(k+1)+': '+sec.title+'. '):'')+lead+sec.text, section:sec, cue:'section'});
      const rem=pi>=0?frem.filter(r=>r.part===pi):[];
      if(rem.length) S.push({type:'say',text:"Okay, this one's important. "+rem.map(r=>'Remember this: '+r.p).join(' '), cue:'remember'});
      S.push({type:'askgen',section:sec}); });
    if(m.example) S.push({type:'say',text:"Now a worked example. "+htmlToSpeech(m.example), cue:'example'});
    if(m.misconceptions&&m.misconceptions.length) S.push({type:'say',text:"Three misconceptions to avoid. "+m.misconceptions.map(x=>x.replace(/[\"“”]/g,'')).join(' Next: ')});
    if(frem.length) S.push({type:'say',text:"Before the quiz, here are the "+frem.length+" things to remember. "+frem.map((r,j)=>(['Number one','Number two','Number three','Number four','Number five'][j]||'And')+'. '+r.p).join(' '), cue:'recap'});
    S.push({type:'say',text:"Time for your quiz. I'll ask, you answer out loud, and I'll tell you how you did."});
    (m.checks||[]).forEach(c=>S.push({type:'ask',q:c.q,a:c.a,kind:'check'}));
    (m.problems||[]).slice(0,2).forEach(c=>S.push({type:'ask',q:c.q,a:c.a,kind:'problem'}));
    try{ const terms=(A.deriveTerms(p,m)||[]).slice(0,8); if(terms.length) S.push({type:'say',text:"Key terms to remember. "+terms.map(t=>t.term+': '+t.def).join(' ')}); }catch(e){}
    S.push({type:'end'});
    return S;
  }

  /* ---------- the runner ---------- */
  function waitIfPaused(){ if(!st.paused) return Promise.resolve(); setStatus('paused','Paused — tap Resume'); return new Promise(r=>{ st.resumeFn=r; }); }
  async function handleCommand(c){
    if(c==='repeat'){ st.i=Math.max(0,st.i-1); while(st.i>0&&st.steps[st.i].type!=='say') st.i--; return 'again'; }
    if(c==='next'||c==='skip'){ return 'next'; }
    if(c==='pause'){ st.paused=true; await waitIfPaused(); return 'again'; }
    if(c==='stop'){ stop(true); return 'stop'; }
    if(c==='slower'){ A.setRate((A.ttsRate?A.ttsRate():1.5)-0.25); await speak("Slower. Like this."); return 'again'; }
    if(c==='faster'){ A.setRate((A.ttsRate?A.ttsRate():1.5)+0.25); await speak("Faster. Like this."); return 'again'; }
    if(c==='simpler'){ const s=st.steps[st.i-1]&&st.steps[st.i-1].section; const t=await ada("Explain this section of '"+st.m.title+"' again as if to a bright twelve-year-old, with one everyday analogy, then connect the analogy back to the real terms:\n\n"+((s&&s.text)||st.m.title).slice(0,1500),120); await speak(t||"Here's the simple version again. "+(((window.SIMPLE||{})[st.m.id]||{}).idea||'')); return 'next'; }
    if(c==='question'){ await speak(micUsable()?"Go ahead, ask your question.":"Type your question, or dictate it with your keyboard's microphone."); const r=await listen({kind:'question',maxMs:20000,label:micUsable()?'Listening for your question':'Type or dictate your question'}); if(r.text){ const t=await ada("The student asked, out loud, during the lesson '"+st.m.title+"': \""+r.text+"\". Answer clearly in under 90 spoken words, then say 'Back to the lesson.'",90); await speak(t||"I can't reach my answer engine right now. Let's keep going and ask ADA later. Back to the lesson."); } return 'next'; }
    return null;
  }
  async function askAndGrade(q,a,kind){
    await speak(q,'Question'); if(st.abort) return;
    let r=await listen({kind:'answer',maxMs:kind==='problem'?25000:16000,label:micUsable()?'Your answer — speak now':'Type or dictate your answer'});
    if(st.abort) return;
    const c=command(r.text);
    if(c==='repeat'){ return askAndGrade(q,a,kind); }
    if(c==='next'||c==='skip'){ await speak("Skipping it."); return; }
    if(c==='pause'){ st.paused=true; await waitIfPaused(); return askAndGrade(q,a,kind); }
    if(c){ const h=await handleCommand(c); if(h==='stop') return; return askAndGrade(q,a,kind); }
    st.score.n++;
    if(r.unsupported||!r.text){
      if(r.unsupported){ await speak("Here's the model answer. "+a+" Were you right?"); const v=await tapYesNo(); if(v) st.score.ok++; await speak(v?"Good.":"That's fine, we'll revisit it."); return; }
      await speak("I didn't catch that. Here's the model answer. "+a+(micUsable()?" Say yes if you had it, or no.":" Did you have it?"));
      const r2=await listen({kind:'yesno',maxMs:8000,label:micUsable()?'Say yes or no':'Did you have it?'}); const yes=/\b(yes|yeah|yep|i did|correct|got it)\b/i.test(r2.text||''); if(yes) st.score.ok++; await speak(yes?"Good.":"Noted. We'll come back to it."); return;
    }
    const g=await grade(q,a,r.text);
    if(g){ if(g.ok) st.score.ok++; else if(g.partly) st.score.ok+=0.5; await speak(g.text); if(!g.ok) A.logMiss({id:'class:'+st.mid+':'+q.slice(0,40),q,options:null,answer:a,why:'',src:'classroom:'+st.mid,pick:r.text}); }
    else { await speak("I can't grade live right now, so compare yourself. The model answer: "+a+(micUsable()?" Say yes if you had it, or no.":" Did you have it?")); const r2=await listen({kind:'yesno',maxMs:8000,label:micUsable()?'Say yes or no':'Did you have it?'}); const yes=/\b(yes|yeah|yep|i did|correct|got it)\b/i.test(r2.text||''); if(yes) st.score.ok++; await speak(yes?"Good.":"Noted. We'll come back to it."); }
    A.save(); showProg();
  }
  function tapYesNo(){ return new Promise(res=>{ const row=$('cyn'); if(!row) return res(false); row.hidden=false; row.querySelector('[data-yn=1]').onclick=()=>{row.hidden=true;res(true);}; row.querySelector('[data-yn=0]').onclick=()=>{row.hidden=true;res(false);}; }); }
  async function run(){
    while(st.running&&!st.abort&&st.i<st.steps.length){
      await waitIfPaused(); if(st.abort) break;
      const s=st.steps[st.i]; showProg(); A.S.classroom=A.S.classroom||{pos:{},done:{}}; A.S.classroom.pos[st.mid]=st.i; A.save();
      if(s.type==='say'){
        await speak(s.text); if(st.abort) break; if(st.paused) continue;
        // short command window after each section
        if(s.cue==='section'||s.cue==='simple'||s.cue==='example'){ const r=await listen({kind:'window',maxMs:3500,label:'Say "repeat", "simpler" or "question" — or stay quiet to continue'}); const c=command(r.text); if(c){ const h=await handleCommand(c); if(h==='again'){ continue; } if(h==='stop') break; } }
        st.i++;
      } else if(s.type==='askgen'){
        if(!st.adaQ){ st.i++; continue; }
        const qa=s.qa||await genQuestion(s.section); if(qa){ s.qa=qa; await askAndGrade(qa.q,qa.a,'section'); }
        if(st.abort) break; st.i++;
      } else if(s.type==='ask'){
        await askAndGrade(s.q,s.a,s.kind); if(st.abort) break; st.i++;
      } else if(s.type==='end'){
        const pct=st.score.n?Math.round(st.score.ok/st.score.n*100):null;
        A.S.classroom.done[st.mid]={t:Date.now(),score:pct}; A.S.classroom.pos[st.mid]=0; A.addXP(A.XP.listen*3,'Classroom lesson complete'); A.save();
        const nx=nextModule();
        await speak("That's the end of "+st.m.title+"."+(pct!=null?(" You answered "+st.score.ok+" of "+st.score.n+" correctly, "+pct+" percent."):'')+(micUsable()?(nx?(" Say next to continue with "+nx.m.title+", repeat to hear this lesson again, or stop."):" Say repeat to hear it again, or stop."):(nx?(" Next up is "+nx.m.title+"."):"")));
        const r=await listen({kind:'end',next:!!nx,maxMs:10000,label:micUsable()?'Say next, repeat, or stop':'What next?'}); const c=command(r.text);
        if(c==='repeat'){ st.i=0; st.score={ok:0,n:0}; continue; }
        if(c==='next'&&nx){ st.running=false; location.hash='#class-'+nx.m.id; setTimeout(()=>start(),400); return; }
        if(!c&&st.autoNext&&nx){ await speak("Continuing to "+nx.m.title+" in five seconds."+(micUsable()?" Say stop to end.":"")); const r2=await listen({kind:'stopwin',maxMs:5000,label:micUsable()?'Say stop to end':'Continuing in 5 seconds'}); if(command(r2.text)!=='stop'){ st.running=false; location.hash='#class-'+nx.m.id; setTimeout(()=>start(),400); return; } }
        stop(false); await speak("Class dismissed. Good work."); return;
      } else st.i++;
    }
    if(st.abort) return;
    st.running=false; setStatus('idle','Finished'); render();
  }
  function nextModule(){ const mods=st.p.modules; const k=mods.indexOf(st.m); if(k>=0&&k+1<mods.length) return {p:st.p,m:mods[k+1]}; const ps=A.phases(); const pi=ps.indexOf(st.p); for(let j=pi+1;j<ps.length;j++){ if((ps[j].modules||[]).length) return {p:ps[j],m:ps[j].modules[0]}; } return null; }

  /* ---------- controls ---------- */
  async function start(from){
    // Must run synchronously inside the tap: iPhone/iPad only allow speech that starts from a user gesture.
    if(A&&A.unlockSpeech){ if(A.unlockSpeech()===false) st.tts=false; } else if(!('speechSynthesis' in window)) st.tts=false;
    if(micUsable()&&st.recOK===null){ try{ const r0=new (SR())(); r0.onerror=e=>{ if(e.error==='not-allowed'||e.error==='service-not-allowed'||e.error==='audio-capture') st.recOK=false; }; r0.onend=()=>{}; r0.start(); setTimeout(()=>{ try{ r0.abort(); }catch(x){} },600); }catch(e){ st.recOK=false; } }
    const h=(location.hash||'').slice(1); const mid=h.replace(/^class-/,''); const f=A.allModules().find(([p,m])=>m.id===mid); if(!f) return;
    st.p=f[0]; st.m=f[1]; st.mid=mid; st.abort=false; st.paused=false; st.running=true; st.score={ok:0,n:0}; st.steps=buildSteps(st.p,st.m);
    st.i=(from!=null)?from:0; st.i=Math.min(st.i,st.steps.length-1);
    try{ if(navigator.wakeLock&&!st.wake){ st.wake=await navigator.wakeLock.request('screen'); st.wake.addEventListener('release',()=>{ st.wake=null; }); } }catch(e){}
    render(); GP._lastModule=mid;
    run();
  }
  function toggle(){ if(!st.running) return; if(st.paused){ st.paused=false; const f=st.resumeFn; st.resumeFn=null; setStatus('speaking'); if(f) f(); } else { st.paused=true; stopSpeaking(); stopListening(); setStatus('paused','Paused — tap Resume'); } const b=$('cpause'); if(b) b.textContent=st.paused?'▶ Resume':'❚❚ Pause'; }
  function repeat(){ if(!st.running) return; if(st.inputWait&&$('cans')){ st.inputWait('repeat'); return; } if(st.inputWait){ const f=st.inputWait; f(); } st.i=Math.max(0,st.i-1); while(st.i>0&&st.steps[st.i].type!=='say') st.i--; stopSpeaking(); stopListening(); if(st.paused) toggle(); }
  function skip(){ if(!st.running) return; if(st.inputWait&&$('cans')){ st.inputWait('skip'); return; } if(st.inputWait){ const f=st.inputWait; f(); return; } st.i=Math.min(st.steps.length-1,st.i+1); stopSpeaking(); stopListening(); if(st.paused) toggle(); }
  function stop(silent){ st.running=false; st.abort=true; stopSpeaking(); stopListening(); if(st.inputWait){ const f=st.inputWait; st.inputWait=null; f(null); } if(st.resumeFn){ const f=st.resumeFn; st.resumeFn=null; f(); } try{ if(st.wake){ st.wake.release(); st.wake=null; } }catch(e){} setStatus('idle','Class ended'); if(!silent){ render(); } }
  function answerTap(){ if(st.rec||st.inputWait) return; stopSpeaking(); if(!micUsable()){ handleCommand('question'); return; } /* opens a listening window immediately */ listen({kind:'window',maxMs:16000,label:'Listening…'}).then(r=>{ const c=command(r.text); if(c) handleCommand(c); }); }
  function setOpt(k,v){ A.S.classroom=A.S.classroom||{pos:{},done:{}}; A.S.classroom.opts=A.S.classroom.opts||{}; A.S.classroom.opts[k]=v; A.save(); st[k]=v; render(); }
  function loadOpts(){ const o=(A.S.classroom&&A.S.classroom.opts)||{}; st.autoNext=o.autoNext!==false; st.adaQ=o.adaQ!==false; }

  /* ---------- views ---------- */
  function render(){ const h=(location.hash||'').slice(1); if(h==='class') classHome(); else if(/^class-/.test(h)) classSession(h.slice(6)); }
  function classHome(){
    loadOpts(); const C=A.S.classroom||{pos:{},done:{}}; const nx=A.nextUp(); const doneN=Object.keys(C.done||{}).length;
    let h=`<p class="eyebrow">Classroom · hands-free</p><h1 style="margin:0 0 6px">One-on-one with your professor</h1>
      <p class="muted" style="margin:0 0 14px">A spoken lecture that teaches, asks you questions and grades your answers. ${micUsable()?'You answer out loud, so it works hands-free: start it before you drive.':'In the Claude app you type or dictate your answers, so use it where you can glance at the screen; in a browser it can listen and run hands-free.'}</p>
      <p class="faint" style="margin:-8px 0 14px;font-size:13px">Voice: ${window.GP_VOICE&&GP_VOICE.on()?'🎓 '+A.esc(GP_VOICE.label()):'this device\'s voice'} · <a href="#tool-voice">Professor voice settings</a></p>
      <div class="holo mg" style="margin-bottom:14px"><p class="eyebrow">Continue</p>
        ${nx?`<div class="ti" style="font-size:18px;font-weight:600">${esc(nx.m.title)}</div><p class="muted" style="margin:4px 0 12px">${esc(nx.p.title)}</p><button class="btn mg xl" onclick="GP.go('class-${nx.m.id}')">🎓 Enter classroom ▸</button>`:`<p class="muted">Every loaded module is complete — pick any lesson below to hear it again.</p>`}
      </div>
      <div class="grid c2" style="margin-bottom:14px">
        <div class="holo"><p class="eyebrow">Lessons completed</p><div class="big" style="color:var(--cyan)">${doneN}</div></div>
        <div class="holo"><p class="eyebrow">How it works</p><p class="muted" style="margin:0;font-size:14px">Say <b>repeat</b>, <b>next</b>, <b>skip</b>, <b>pause</b>, <b>slower</b>, <b>faster</b>, <b>simpler</b>, <b>question</b> or <b>stop</b> whenever I pause.</p></div>
      </div>
      <div class="holo" style="margin-bottom:14px"><p class="eyebrow">Settings</p>
        <div class="row" style="justify-content:space-between;margin:6px 0"><span>Professor asks a question after each section (needs ADA online)</span><button class="btn ghost sm" onclick="CLASSROOM.setOpt('adaQ',${st.adaQ?'false':'true'})">${st.adaQ?'On':'Off'}</button></div>
        <div class="row" style="justify-content:space-between;margin:6px 0"><span>Auto-continue to the next lesson</span><button class="btn ghost sm" onclick="CLASSROOM.setOpt('autoNext',${st.autoNext?'false':'true'})">${st.autoNext?'On':'Off'}</button></div>
        <div class="row" style="justify-content:space-between;margin:6px 0"><span>Voice &amp; speed</span><span class="muted" style="font-size:13px">uses the voice chosen on any lecture's Play bar</span></div>
        <p class="faint" style="margin:8px 0 0;font-size:12px">${micUsable()?'You can answer out loud: allow the microphone when asked.':(FRAMED?'In the Claude app, type your answers, or tap the microphone on your keyboard to dictate them; the app does not let pages use the microphone directly. To answer out loud, open the single-file version in Safari or Chrome.':'This browser cannot listen, so type or dictate your answers.')} The professor speaks aloud: turn the volume up and switch off silent mode. If nothing is heard, the lesson shows each part on screen and waits for you to tap Continue.</p>
      </div>
      <p class="eyebrow">Choose any lesson</p><div class="ilist cls-pick">`;
    A.phases().forEach(p=>{ if(!(p.modules||[]).length) return; if(window.GPM&&!GPM.unlocked(p)){ h+=`<div class="item" style="opacity:.55;margin:0 0 6px"><span class="ix">${String(p.num).padStart(2,'0')}</span><span class="bd"><span class="ti">🔒 ${esc(p.title)}</span><span class="me">opens after ${esc(GPM.prereqNames(p).join(', '))}</span></span></div>`; return; } h+=`<details style="margin:0 0 6px"><summary class="item" style="cursor:pointer"><span class="ix">${String(p.num).padStart(2,'0')}</span><span class="bd"><span class="ti">${esc(p.title)}</span><span class="me">${p.modules.length} lessons${p.modules.filter(m=>C.done&&C.done[m.id]).length?' · '+p.modules.filter(m=>C.done[m.id]).length+' heard':''}</span></span></summary>`;
      p.modules.forEach((m,i)=>{ const d=C.done&&C.done[m.id]; h+=`<a class="item" onclick="GP.go('class-${m.id}')" style="margin-left:14px"><span class="ix">${i+1}</span><span class="bd"><span class="ti">${esc(m.title)}</span><span class="me">${m.minutes} min${d?' · heard'+(d.score!=null?' · '+(Number(d.score)||0)+'%':''):''}</span></span><span class="tag">▸</span></a>`; });
      h+=`</details>`; });
    h+=`</div>`; A.set(h);
  }
  function classSession(mid){
    loadOpts(); const f=A.allModules().find(([p,m])=>m.id===mid); if(!f){ return A.set(`<div class="holo center"><p class="eyebrow">Classroom</p><div class="big">Lesson not found</div><button class="btn" onclick="GP.go('class')">Back</button></div>`); }
    const [p,m]=f; if(window.GPM&&!GPM.unlocked(p)){ return A.set(`<div class="holo center"><p class="eyebrow">Classroom · locked</p><div class="big" style="font-size:20px">${esc(p.title)} opens after its prerequisites</div><p class="muted">Demonstrate ${esc(GPM.prereqNames(p).join(', ')||'the prerequisite domains')} first — the mastery gate shows exactly which lessons feed this one.</p><div class="row" style="justify-content:center;gap:8px"><button class="btn" onclick="GP.go('${p.id}')">See the gate</button><button class="btn ghost" onclick="GP.go('class')">Back</button></div></div>`); }
    const C=A.S.classroom||{pos:{},done:{}}; const pos=(C.pos||{})[mid]||0; const active=st.running&&st.mid===mid;
    const SRok=!!SR();
    A.set(`<p class="eyebrow">Classroom · ${esc(p.short)} · lesson ${(p.modules.indexOf(m)+1)} of ${p.modules.length}</p>
      <h1 style="margin:0 0 4px;font-size:24px">${esc(m.title)}</h1>
      <div class="holo center" style="padding:18px 16px 20px">
        <div id="corb" class="cls-orb ${active?st.status:'idle'}"></div>
        <div id="cstat" class="cls-stat">${active?'':'Ready'}</div>
        <div id="cprog" class="faint" style="margin-top:6px"></div>
        <div id="cheard" class="cls-heard"></div>
        <div id="cnow" class="cls-now"></div>
        ${active?`<div class="cls-row"><button class="btn xl" id="cpause" onclick="CLASSROOM.toggle()">${st.paused?'▶ Resume':'❚❚ Pause'}</button><button class="btn ghost xl" onclick="CLASSROOM.repeat()">↺ Repeat</button><button class="btn ghost xl" onclick="CLASSROOM.skip()">Skip ▸</button><button class="btn ghost xl" onclick="CLASSROOM.answerTap()">${micUsable()?'🎤 Speak':'✋ Ask a question'}</button></div>
          <div id="cinput" class="cls-input" hidden></div>
          <div id="cyn" class="cls-row" hidden><button class="btn xl" data-yn="1">Yes, I had it</button><button class="btn ghost xl" data-yn="0">No</button></div>
          <div style="margin-top:12px"><button class="btn ghost sm" onclick="CLASSROOM.stop()">■ End class</button></div>`
        :`<div class="cls-row"><button class="btn mg xl" onclick="CLASSROOM.start(0)">▶ Start lesson</button>${pos>2?`<button class="btn ghost xl" onclick="CLASSROOM.start(${pos})">Resume at step ${pos+1}</button>`:''}</div>
          <p class="faint" style="margin:12px 0 0;font-size:12px">${micUsable()?'Answers: by voice (allow the microphone when asked). ':(FRAMED?'Answers: type them, or tap the microphone on your keyboard to dictate (the Claude app does not let pages use the microphone directly). ':'Answers: type or dictate them (this browser cannot listen). ')}${'speechSynthesis' in window?'The professor speaks aloud; turn your volume up and switch off silent mode. If nothing is heard, the lesson shows the text and waits for you.':'This browser cannot speak, so the lesson shows the text and waits for you.'}</p><p class="faint" style="margin:6px 0 0;font-size:12px">Voice: ${window.GP_VOICE&&GP_VOICE.on()?'🎓 '+esc(GP_VOICE.label()):'this device\'s voice'} · <a href="#tool-voice">Professor voice settings</a></p>`}
      </div>
      <div class="holo" style="margin-top:14px"><p class="eyebrow">What happens</p><p class="muted" style="margin:0;font-size:14px">Objectives → the simple version → the lecture, section by section with a spoken question after each (when ADA is online) → a worked example → misconceptions → a five-question oral quiz graded by your professor → key terms. About ${m.minutes} minutes. Score and progress are saved; mistakes go to your mistake journal.</p>
        <div class="row" style="margin-top:10px"><button class="btn ghost sm" onclick="GP.go('${m.id}')">Open the written lecture</button><button class="btn ghost sm" onclick="GP.go('class')">All lessons</button></div></div>`);
    showProg();
  }
  window.addEventListener('hashchange',()=>{ const h=(location.hash||'').slice(1); if(st.running&&h!=='class-'+st.mid){ stop(true); } });
  document.addEventListener('visibilitychange',async()=>{ if(document.visibilityState==='visible'&&st.running&&!st.wake){ try{ st.wake=await navigator.wakeLock.request('screen'); }catch(e){} } });

  V.push({test:h=>h==='class', nav:'class', render:(h,api)=>{ A=api; classHome(); }});
  V.push({test:h=>/^class-[a-z]\d+m\d+$/.test(h), nav:'class', render:(h,api)=>{ A=api; classSession(h.slice(6)); }});
  window.GP_HOME_EXTRA=window.GP_HOME_EXTRA||[];
  window.GP_HOME_EXTRA.push(api=>`<div class="holo" style="margin-top:14px"><div class="row" style="justify-content:space-between;align-items:center"><div><p class="eyebrow">Classroom · hands-free</p><p style="margin:0" class="muted">Your professor teaches out loud, asks questions and listens to your answers — for the drive.</p></div><button class="btn mg" onclick="GP.go('class')">🎓 Enter</button></div></div>`);
  window.CLASSROOM={start,toggle,repeat,skip,stop,answerTap,setOpt,_st:st};
})();
