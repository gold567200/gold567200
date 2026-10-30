/* Classroom — hands-free, voice-first one-on-one lectures.
   The professor (ADA's voice) teaches a module section by section, asks questions,
   listens to the spoken answer, grades it, and moves on. Built for ears, not eyes.
   Stay-awake design: long sections are cut into short parts (about 2 minutes by default), and after each
   part the professor asks a quick check-in question and WAITS for an answer before going on. Silence is
   never treated as "keep going". A break reminder interrupts long sessions. */
(function(){
  const V=window.GP_VIEWS=window.GP_VIEWS||[];
  let A=null;
  const st={ running:false, paused:false, mid:null, p:null, m:null, steps:[], i:0, abort:false, rec:null, recOK:null, wake:null,
    score:{ok:0,n:0}, resumeP:null, resumeFn:null, lastHeard:'', status:'idle', autoNext:true, answered:{}, tts:null, inputWait:null,
    checkin:'short', breakMin:25, sinceBreak:0, lastActive:0, pausedAt:0, jump:null, onBreak:false };
  const CHECKIN_OPTS=[['short','Every ~2 min'],['medium','Every ~4 min'],['section','After each section'],['off','Off']];
  const BREAK_OPTS=[[25,'Every 25 min'],[40,'Every 40 min'],[0,'Off']];
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
  const wc=s=>(String(s).trim().match(/\S+/g)||[]).length;
  // Words per check-in part: ~145 spoken words a minute at normal speed, scaled by the chosen speech rate.
  function segTarget(){ const base=st.checkin==='medium'?560:290; let r=1; try{ r=Number(A&&A.ttsRate?A.ttsRate():1)||1; }catch(e){} return Math.round(base*Math.max(.75,Math.min(2,r))); }
  // Cut a section into roughly equal parts, only at real sentence ends (not "3.5" or mid-quote), never leaving a tiny tail.
  function splitSeg(text,target){
    const T=String(text); const sents=T.match(/[^.!?]+[.!?]+["')\]”]?\s*|[^.!?]+$/g)||[T];
    const total=sents.reduce((a,s)=>a+wc(s),0); const n=Math.max(1,Math.round(total/target)); if(n<2) return [T.trim()];
    const per=total/n, out=[]; let buf='', acc=0;
    sents.forEach((s,i)=>{ buf+=s; acc+=wc(s); const nx=sents[i+1];
      if(out.length<n-1&&acc>=per*(out.length+1)&&/\s$/.test(s)&&nx&&/^\s*["'(“]?[A-Z0-9]/.test(nx)){ out.push(buf.trim()); buf=''; } });
    if(buf.trim()) out.push(buf.trim());
    if(out.length>1&&wc(out[out.length-1])<target*0.35){ const t=out.pop(); out[out.length-1]+=' '+t; }
    return out;
  }
  // The line the offline check-in reads back: the part's opening sentence (two if the first is short).
  function keyLine(t){ const s=String(t).match(/[\s\S]+?[.!?]+["')\]”]?(?=\s+["'(“]?[A-Z0-9]|\s*$)/g)||[String(t)]; let out=(s[0]||String(t)).trim();
    if(wc(out)<12&&s[1]) out+=' '+s[1].trim(); const w=out.split(/\s+/); return w.length>45?w.slice(0,45).join(' ')+'…':out; }

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
        u.rate=(A.ttsRate?A.ttsRate():1); u.pitch=1; u.volume=1;
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
      if(kind==='yesno'){ setStatus('listening',o.label||'Did you have it?'); inputArea(`<div class="cls-row"><button class="btn xl" id="cy">${esc(o.yes||'Yes, I had it')}</button><button class="btn ghost xl" id="cn">${esc(o.no||'No')}</button></div>`); $('cy').onclick=()=>done('yes'); $('cn').onclick=()=>done('no'); return; }
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
  async function ada(prompt,maxWords,quiet){
    try{ const fn=await A.getSample(); if(!fn) return null; if(!quiet) setStatus('thinking');
      const sys=A.ADA_SYS+"\n\nCLASSROOM ORAL MODE: everything you write will be read aloud by text-to-speech to a student who may be driving. Use plain spoken English only: no markdown, no bullet points, no headings, no code, no emojis, no URLs. Keep it under "+(maxWords||70)+" words.";
      const r=await fn([{role:'user',content:sys},{role:'user',content:prompt}],{modelTier:'quick',cache:false}); return (r&&r.text||'').trim()||null; }catch(e){ return null; }
  }
  async function genQuestion(sec,quiet){
    const t=await ada("The student just heard this short part of the lecture '"+st.m.title+"':\n\n"+sec.text.slice(0,2400)+"\n\nWrite ONE quick check-in question about the most important idea in THIS part only, something they can answer only if they were paying attention (max 22 words, answerable in one spoken sentence), then its model answer (max 35 words). Output exactly two lines: 'Q: ...' and 'A: ...'.",80,quiet);
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
    const ci=st.checkin, split=(ci==='short'||ci==='medium');
    const how=ci==='off'?"I will teach it in sections and quiz you at the end"
      :ci==='section'?"I will teach it in sections, with a quick check-in question after each one"
      :"I will teach it in short parts of about "+(ci==='medium'?'four':'two')+" minutes. After each part I will ask you a quick question and wait for your answer before we go on, so stay with me";
    S.push({type:'say',text:"Welcome to the classroom. Today's lesson is "+m.title+", module "+num+" of "+p.title+". "+how+(micUsable()?". Just answer out loud. Whenever I pause, you can say repeat, next, skip, pause, slower, faster, simpler, or stop.":". Type your answers, or tap the microphone on your keyboard and say them. The buttons below let you pause, repeat, skip or ask a question at any time.")+(st.breakMin?" Every "+st.breakMin+" minutes or so, I will remind you to take a short break.":"")+" Let's begin."});
    S.push({type:'say',text:"By the end of this lesson you will be able to: "+m.outcomes.map(o=>o.trim().replace(/[.]+$/,'')).join('. ')+"."});
    if(simple) S.push({type:'say',text:"We begin with the intuition. "+simple.picture+" "+simple.idea+" Why it matters: "+simple.why, cue:'simple'});
    // Guided-mode focus pack (focus_*.js): the big idea up front, a plain-words line per section, "remember this" moments and a recap.
    const F=(window.FOCUS||{})[m.id]; const fparts=F?F.parts||[]:[]; const frem=F?F.remember||[]:[];
    const norm=t=>String(t||'').replace(/\s+/g,' ').trim().toLowerCase();
    if(F) S.push({type:'say',text:"The central idea is this. "+F.big+" Why should this concern you? "+F.why+" There are "+frem.length+" points I would like you to retain from this lesson. I will mark each one as we reach it.", cue:'focus'});
    const secs=sections(m);
    secs.forEach((sec,k)=>{ const pi=sec.title?fparts.findIndex(x=>norm(x.t)===norm(sec.title)):-1; const fp=pi>=0?fparts[pi]:null;
      const lead=fp?((fp.core?'':"This section is supplementary. Follow the reasoning, but you need not commit the details to memory. ")+(fp.gist?'Put simply: '+fp.gist+' ':'')):'';
      const parts=split?splitSeg(sec.text,segTarget()):[sec.text];
      parts.forEach((pt,j)=>{
        const seg={title:sec.title, html:sec.html, text:pt, key:(parts.length===1&&fp&&fp.gist)?fp.gist:keyLine(pt)};
        const head=j===0?((sec.title?('Section '+(k+1)+': '+sec.title+'. '):'')+(parts.length>1?'This one comes in '+parts.length+' short parts. ':'')+lead)
                        :('Section '+(k+1)+', part '+(j+1)+' of '+parts.length+'. ');
        S.push({type:'say',text:head+pt, section:seg, cue:'section'});
        if(ci!=='off') S.push({type:'check',section:seg}); });
      const rem=pi>=0?frem.filter(r=>r.part===pi):[];
      if(rem.length) S.push({type:'say',text:"This next point is essential. "+rem.map(r=>'Commit this to memory: '+r.p).join(' '), cue:'remember'}); });
    if(m.example){ const ex=htmlToSpeech(m.example); const parts=split?splitSeg(ex,segTarget()):[ex];
      parts.forEach((pt,j)=>{ const seg={title:'Worked example',text:pt,key:keyLine(pt)};
        S.push({type:'say',text:(j===0?"Let us now work through an example, step by step. ":"The example, continued. ")+pt, section:seg, cue:'example'});
        if(ci!=='off') S.push({type:'check',section:seg}); }); }
    if(m.misconceptions&&m.misconceptions.length) S.push({type:'say',text:(m.misconceptions.length>1?"Now, "+m.misconceptions.length+" common misconceptions, and why each one fails. ":"Now, a common misconception, and why it fails. ")+m.misconceptions.map(x=>x.replace(/[\"“”]/g,'')).join(' Another: ')});
    if(frem.length) S.push({type:'say',text:"Before the quiz, let us consolidate the "+frem.length+" points to retain. "+frem.map((r,j)=>(['First','Second','Third','Fourth','Fifth'][j]||'Finally')+'. '+r.p).join(' '), cue:'recap'});
    S.push({type:'say',text:"Now for the quiz. I will pose each question; you answer, and I will tell you how you did."});
    (m.checks||[]).forEach(c=>S.push({type:'ask',q:c.q,a:c.a,kind:'check'}));
    (m.problems||[]).slice(0,2).forEach(c=>S.push({type:'ask',q:c.q,a:c.a,kind:'problem'}));
    try{ const terms=(A.deriveTerms(p,m)||[]).slice(0,8); if(terms.length) S.push({type:'say',text:"Finally, the key terms. "+terms.map(t=>t.term+': '+t.def).join(' ')}); }catch(e){}
    S.push({type:'end'});
    return S;
  }

  /* ---------- the runner ---------- */
  function waitIfPaused(){ if(!st.paused) return Promise.resolve(); setStatus('paused','Paused — tap Resume'); return new Promise(r=>{ st.resumeFn=r; }); }
  function pauseNow(){ st.paused=true; st.pausedAt=Date.now(); const b=$('cpause'); if(b) b.textContent='▶ Resume'; }
  const cut=()=>st.abort||st.jump!=null;               // the student stopped, skipped or asked to repeat
  function sayStepAt(i){ let j=Math.max(0,Math.min(st.steps.length-1,i)); while(j>0&&st.steps[j].type!=='say') j--; return j; }
  const YES=/\b(yes|yeah|yep|yup|sure|please|again|replay|close|i did|correct|got it)\b/i;
  async function handleCommand(c){
    if(c==='repeat'){ st.jump=sayStepAt(st.i); return 'again'; }
    if(c==='next'||c==='skip'){ return 'next'; }
    if(c==='pause'){ pauseNow(); await waitIfPaused(); return 'again'; }
    if(c==='stop'){ stop(true); return 'stop'; }
    if(c==='slower'){ A.setRate((A.ttsRate?A.ttsRate():1)-0.25); await speak("Slower. Like this."); return 'again'; }
    if(c==='faster'){ A.setRate((A.ttsRate?A.ttsRate():1)+0.25); await speak("Faster. Like this."); return 'again'; }
    if(c==='simpler'){ const cur=st.steps[st.i]; const s=(cur&&cur.section)||(st.steps[st.i-1]&&st.steps[st.i-1].section); const t=await ada("Explain this part of '"+st.m.title+"' again as if to a bright twelve-year-old, with one everyday analogy, then connect the analogy back to the real terms:\n\n"+((s&&s.text)||st.m.title).slice(0,1500),120); await speak(t||"Here's the simple version again. "+(((window.SIMPLE||{})[st.m.id]||{}).idea||'')); return 'next'; }
    if(c==='question'){ await speak(micUsable()?"Go ahead, ask your question.":"Type your question, or dictate it with your keyboard's microphone."); const r=await listen({kind:'question',maxMs:20000,label:micUsable()?'Listening for your question':'Type or dictate your question'}); if(r.text){ const t=await ada("The student asked, out loud, during the lesson '"+st.m.title+"': \""+r.text+"\". Answer clearly in under 90 spoken words, then say 'Back to the lesson.'",90); await speak(t||"I can't reach my answer engine right now. Let's keep going and ask ADA later. Back to the lesson."); } return 'next'; }
    return null;
  }
  // Ask one question and grade it. Returns 'ok' | 'partly' | 'missed' | 'skipped'.
  // o.gate: a check-in — silence never counts as an answer; after two silent tries the class pauses until Resume.
  // o.self: no live grader — read back the key line and let the student judge themselves (not added to the score).
  async function askAndGrade(q,a,kind,o={}){
    await speak((o.intro||'')+q,o.label||'Question'); if(cut()) return 'skipped';
    const lab=micUsable()?'Your answer — speak now':'Type or dictate your answer';
    let r=await listen({kind:'answer',maxMs:kind==='problem'?25000:16000,label:lab});
    if(cut()) return 'skipped';
    if(o.gate&&!r.text&&!r.unsupported){
      await speak("Still with me? Take your time.",'Check-in'); if(cut()) return 'skipped';
      r=await listen({kind:'answer',maxMs:14000,label:lab}); if(cut()) return 'skipped';
      if(!r.text){ await speak("I'll wait right here. Tap Resume when you're back."); if(cut()) return 'skipped';
        pauseNow(); await waitIfPaused(); if(cut()) return 'skipped'; return askAndGrade(q,a,kind,o); }
    }
    const c=command(r.text);
    if(c==='repeat'){ return askAndGrade(q,a,kind,o); }
    if(c==='next'||c==='skip'){ await speak("Skipping it."); return 'skipped'; }
    if(c==='pause'){ pauseNow(); await waitIfPaused(); if(cut()) return 'skipped'; return askAndGrade(q,a,kind,o); }
    if(c){ const h=await handleCommand(c); if(h==='stop'||cut()) return 'skipped'; return askAndGrade(q,a,kind,o); }
    if(o.self){
      const idk=/^(i don'?t know|no idea|not sure|dunno)/i.test(r.text||'');
      await speak((idk?"No problem. ":"Thanks. ")+"Here's the key line from that part: "+a+(idk?"":" Was that close to what you said?"),'Check-in'); if(cut()) return 'skipped';
      let yes=false;
      if(!idk){ const r2=await listen({kind:'yesno',maxMs:9000,label:micUsable()?'Say yes or no':'Close to what you said?',yes:'Yes, close',no:'Not really'}); yes=YES.test(r2.text||''); }
      return yes?'ok':'missed';
    }
    st.score.n++; let res='missed';
    if(r.unsupported||!r.text){
      if(r.unsupported){ await speak("Here's the model answer. "+a+" Were you right?"); const v=await tapYesNo(); if(v) st.score.ok++; await speak(v?"Correct.":"No matter; we will return to it."); return v?'ok':'missed'; }
      await speak("I didn't catch that. Here's the model answer. "+a+(micUsable()?" Say yes if you had it, or no.":" Did you have it?"));
      const r2=await listen({kind:'yesno',maxMs:8000,label:micUsable()?'Say yes or no':'Did you have it?'}); const yes=/\b(yes|yeah|yep|i did|correct|got it)\b/i.test(r2.text||''); if(yes) st.score.ok++; await speak(yes?"Good.":"Noted. We'll come back to it."); return yes?'ok':'missed';
    }
    const g=await grade(q,a,r.text);
    if(g){ if(g.ok) st.score.ok++; else if(g.partly) st.score.ok+=0.5; res=g.ok?'ok':(g.partly?'partly':'missed'); await speak(g.text); if(!g.ok) A.logMiss({id:'class:'+st.mid+':'+q.slice(0,40),q,options:null,answer:a,why:'',src:'classroom:'+st.mid,pick:r.text}); }
    else { await speak("I can't grade live right now, so compare yourself. The model answer: "+a+(micUsable()?" Say yes if you had it, or no.":" Did you have it?")); const r2=await listen({kind:'yesno',maxMs:8000,label:micUsable()?'Say yes or no':'Did you have it?'}); const yes=/\b(yes|yeah|yep|i did|correct|got it)\b/i.test(r2.text||''); if(yes) st.score.ok++; res=yes?'ok':'missed'; await speak(yes?"Good.":"Noted. We'll come back to it."); }
    A.save(); showProg(); return res;
  }
  function tapYesNo(){ return new Promise(res=>{ const row=$('cyn'); if(!row) return res(false); row.hidden=false; row.querySelector('[data-yn=1]').onclick=()=>{row.hidden=true;res(true);}; row.querySelector('[data-yn=0]').onclick=()=>{row.hidden=true;res(false);}; }); }
  // The check-in after each short part. The question is written by ADA while the part is still playing;
  // with ADA offline it becomes a recall prompt ("what was that part about?") that the student checks themselves.
  async function checkIn(s){
    const seg=s.section; let qa=s.qa;
    if(!qa){ if(!s.qaP) s.qaP=genQuestion(seg,true); setStatus('thinking','Preparing your check-in…'); qa=await s.qaP; s.qaP=null; if(qa) s.qa=qa; }
    if(cut()) return null;
    const res=qa?await askAndGrade(qa.q,qa.a,'check',{gate:true,intro:'Check-in. ',label:'Check-in'})
                :await askAndGrade("Check-in. In a sentence or two, what was that part about?",seg.key||'',"check",{gate:true,self:true,label:'Check-in'});
    if(cut()) return null;
    if(res==='missed'){
      await speak("Want to hear that part again?",'Check-in'); if(cut()) return null;
      const r=await listen({kind:'yesno',maxMs:9000,label:micUsable()?'Say yes or no':'Hear that part again?',yes:'Yes, replay it',no:'No, keep going'});
      if(cut()) return null;
      if(YES.test(r.text||'')){ await speak("Okay. From the top of that part."); return 'replay'; }
    }
    return null;
  }
  function dueBreak(){ return st.breakMin>0&&st.sinceBreak&&(Date.now()-st.sinceBreak)>=st.breakMin*60000; }
  async function takeBreak(){
    const mins=Math.max(1,Math.round((Date.now()-st.sinceBreak)/60000));
    st.onBreak=true; st.breakSkip=false;
    await speak("You've been at it for "+mins+" minutes, so let's take a five-minute break. Stand up, stretch, drink some water, and get some light or fresh air if you can. Your brain keeps sorting this out while you rest.",'Break time');
    if(st.abort){ st.onBreak=false; return; }
    if(!st.breakSkip) await new Promise(res=>{
      let left=300, tick=null;
      const lab=()=>left>0?('Break · '+Math.floor(left/60)+':'+String(left%60).padStart(2,'0')):'Break over — tap Continue when ready';
      const end=()=>{ clearInterval(tick); st.inputWait=null; st.onBreak=false; stopSpeaking(); clearInput(); res(); };
      setStatus('paused',lab());
      inputArea(`<div class="cls-row"><button class="btn mg xl" id="cback">I'm back — continue ▸</button></div><p class="hint" style="text-align:center">Skipping it? Fine once in a while; tapping now continues straight away.</p>`);
      st.inputWait=end; const b=$('cback'); if(b) b.onclick=end;
      tick=setInterval(()=>{ if(st.abort){ end(); return; } left--; if(st.status!=='speaking') setStatus('paused',lab());
        if(left===0){ clearInterval(tick); speak("Break's over. Tap continue when you're ready.",'Break over').then(()=>{ if(st.onBreak) setStatus('paused',lab()); }); } },1000);
    });
    st.onBreak=false; st.sinceBreak=Date.now(); st.lastActive=Date.now();
    if(!st.abort&&!st.breakSkip) await speak("Welcome back. Let's pick up where we left off.");
    st.breakSkip=false;
  }
  async function run(){
    while(st.running&&!st.abort&&st.i<st.steps.length){
      await waitIfPaused(); if(st.abort) break;
      if(st.jump!=null){ st.i=Math.max(0,Math.min(st.steps.length-1,st.jump)); st.jump=null; }
      const s=st.steps[st.i]; showProg(); st.lastActive=Date.now(); A.S.classroom=A.S.classroom||{pos:{},done:{}}; A.S.classroom.pos[st.mid]=st.i; A.save();
      if(s.type==='say'){
        if((s.cue==='section'||s.cue==='example')&&dueBreak()){ await takeBreak(); if(st.abort) break; continue; }
        const nx=st.steps[st.i+1]; const gated=!!(nx&&nx.type==='check');
        if(gated&&!nx.qa&&!nx.qaP) nx.qaP=genQuestion(nx.section,true);   // write the check-in while this part plays
        await speak(s.text); if(st.abort) break; if(st.jump!=null||st.paused) continue;
        // short command window after a section that has no check-in of its own
        if(!gated&&(s.cue==='section'||s.cue==='simple'||s.cue==='example')){ const r=await listen({kind:'window',maxMs:3500,label:'Say "repeat", "simpler" or "question" — or stay quiet to continue'}); const c=command(r.text); if(c){ const h=await handleCommand(c); if(h==='again'){ continue; } if(h==='stop') break; } }
        st.i++;
      } else if(s.type==='check'){
        const r=await checkIn(s); if(st.abort) break; if(st.jump!=null) continue;
        if(r==='replay'){ st.i=sayStepAt(st.i-1); continue; }
        st.i++;
      } else if(s.type==='ask'){
        await askAndGrade(s.q,s.a,s.kind); if(st.abort) break; if(st.jump!=null) continue; st.i++;
      } else if(s.type==='end'){
        const pct=st.score.n?Math.round(st.score.ok/st.score.n*100):null;
        A.S.classroom.done[st.mid]={t:Date.now(),score:pct}; A.S.classroom.pos[st.mid]=0; A.addXP(A.XP.listen*3,'Classroom lesson complete'); A.save();
        const nx=nextModule();
        await speak("That's the end of "+st.m.title+"."+(pct!=null?(" You answered "+st.score.ok+" of "+st.score.n+" correctly, "+pct+" percent."):'')+(micUsable()?(nx?(" Say next to continue with "+nx.m.title+", repeat to hear this lesson again, or stop."):" Say repeat to hear it again, or stop."):(nx?(" Next up is "+nx.m.title+"."):"")));
        const r=await listen({kind:'end',next:!!nx,maxMs:10000,label:micUsable()?'Say next, repeat, or stop':'What next?'}); const c=command(r.text);
        if(c==='repeat'){ st.i=0; st.jump=null; st.score={ok:0,n:0}; continue; }
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
    loadOpts(); st.p=f[0]; st.m=f[1]; st.mid=mid; st.abort=false; st.paused=false; st.running=true; st.jump=null; st.onBreak=false; st.breakSkip=false; st.score={ok:0,n:0}; st.steps=buildSteps(st.p,st.m);
    // the break clock keeps running across lessons that auto-continue; it resets after 10 idle minutes
    if(!st.sinceBreak||Date.now()-(st.lastActive||0)>10*60000) st.sinceBreak=Date.now(); st.lastActive=Date.now();
    st.i=(from!=null)?from:0; st.i=Math.min(st.i,st.steps.length-1);
    try{ if(navigator.wakeLock&&!st.wake){ st.wake=await navigator.wakeLock.request('screen'); st.wake.addEventListener('release',()=>{ st.wake=null; }); } }catch(e){}
    render(); GP._lastModule=mid;
    run();
  }
  function toggle(){ if(!st.running) return;
    if(st.paused){ st.paused=false; if(st.pausedAt&&Date.now()-st.pausedAt>3*60000) st.sinceBreak=Date.now(); st.pausedAt=0; const f=st.resumeFn; st.resumeFn=null; setStatus('speaking'); if(f) f(); }
    else { pauseNow(); stopSpeaking(); stopListening(); setStatus('paused','Paused — tap Resume'); }
    const b=$('cpause'); if(b) b.textContent=st.paused?'▶ Resume':'❚❚ Pause'; }
  // Repeat: replay the part you're in (or, while answering, hear the question again).
  function repeat(){ if(!st.running) return; if(st.onBreak){ endBreakEarly(); return; }
    if(st.inputWait&&$('cans')){ st.inputWait('repeat'); return; }
    st.jump=sayStepAt(st.i); if(st.inputWait){ const f=st.inputWait; f(null); }
    stopSpeaking(); stopListening(); if(st.paused) toggle(); }
  // Skip: move past the part you're in, together with its check-in.
  function skip(){ if(!st.running) return; if(st.onBreak){ endBreakEarly(); return; }
    if(st.inputWait&&$('cans')){ st.inputWait('skip'); return; }
    const cur=st.steps[st.i]; let j=st.i+1; if(cur&&cur.type==='say'&&st.steps[j]&&st.steps[j].type==='check') j++;
    st.jump=Math.min(st.steps.length-1,j); if(st.inputWait){ const f=st.inputWait; f(null); }
    stopSpeaking(); stopListening(); if(st.paused) toggle(); }
  function endBreakEarly(){ st.breakSkip=true; stopSpeaking(); if(st.inputWait){ const f=st.inputWait; f(); } }
  function stop(silent){ st.running=false; st.abort=true; st.onBreak=false; stopSpeaking(); stopListening(); if(st.inputWait){ const f=st.inputWait; st.inputWait=null; f(null); } if(st.resumeFn){ const f=st.resumeFn; st.resumeFn=null; f(); } try{ if(st.wake){ st.wake.release(); st.wake=null; } }catch(e){} setStatus('idle','Class ended'); if(!silent){ render(); } }
  function answerTap(){ if(st.rec||st.inputWait) return; stopSpeaking(); if(!micUsable()){ handleCommand('question'); return; } /* opens a listening window immediately */ listen({kind:'window',maxMs:16000,label:'Listening…'}).then(r=>{ const c=command(r.text); if(c) handleCommand(c); }); }
  function setOpt(k,v){ A.S.classroom=A.S.classroom||{pos:{},done:{}}; A.S.classroom.opts=A.S.classroom.opts||{}; A.S.classroom.opts[k]=v; A.save(); st[k]=v; render(); }
  function loadOpts(){ const o=(A.S.classroom&&A.S.classroom.opts)||{}; st.autoNext=o.autoNext!==false; st.checkin=CHECKIN_OPTS.some(x=>x[0]===o.checkin)?o.checkin:'short'; st.breakMin=BREAK_OPTS.some(x=>x[0]===o.breakMin)?o.breakMin:25; }

  /* ---------- views ---------- */
  function render(){ const h=(location.hash||'').slice(1); if(h==='class') classHome(); else if(/^class-/.test(h)) classSession(h.slice(6)); }
  function classHome(){
    loadOpts(); const C=A.S.classroom||{pos:{},done:{}}; const nx=A.nextUp(); const doneN=Object.keys(C.done||{}).length;
    let h=`<p class="eyebrow">Classroom · hands-free</p><h1 style="margin:0 0 6px">One-on-one with your professor</h1>
      <p class="muted" style="margin:0 0 14px">A spoken lecture taught in short parts. After each part your professor asks a quick question and waits for your answer, so you stay switched on. ${micUsable()?'You answer out loud, so it works hands-free: start it before you drive.':'In the Claude app you type or dictate your answers, so use it where you can glance at the screen; in a browser it can listen and run hands-free.'}</p>
      <p class="faint" style="margin:-8px 0 14px;font-size:13px">Voice: ${window.GP_VOICE&&GP_VOICE.on()?'🎓 '+A.esc(GP_VOICE.label()):'this device\'s voice'} · <a href="#tool-voice">Professor voice settings</a></p>
      <div class="holo mg" style="margin-bottom:14px"><p class="eyebrow">Continue</p>
        ${nx?`<div class="ti" style="font-size:18px;font-weight:600">${esc(nx.m.title)}</div><p class="muted" style="margin:4px 0 12px">${esc(nx.p.title)}</p><button class="btn mg xl" onclick="GP.go('class-${nx.m.id}')">🎓 Enter classroom ▸</button>`:`<p class="muted">Every loaded module is complete — pick any lesson below to hear it again.</p>`}
      </div>
      <div class="grid c2" style="margin-bottom:14px">
        <div class="holo"><p class="eyebrow">Lessons completed</p><div class="big" style="color:var(--cyan)">${doneN}</div></div>
        <div class="holo"><p class="eyebrow">How it works</p><p class="muted" style="margin:0;font-size:14px">Short parts, then a check-in you must answer before it moves on. Miss one and you can replay that part. Say <b>repeat</b>, <b>next</b>, <b>skip</b>, <b>pause</b>, <b>slower</b>, <b>faster</b>, <b>simpler</b>, <b>question</b> or <b>stop</b> whenever I pause.</p></div>
      </div>
      <div class="holo" style="margin-bottom:14px"><p class="eyebrow">Settings</p>
        <div style="margin:6px 0 14px"><div style="font-weight:600">Check-in questions</div><p class="faint" style="margin:2px 0 8px;font-size:13px">The lesson stops after each short part, asks you a quick question and waits for your answer before it goes on. Answering keeps your brain switched on instead of drifting off.</p>
          <div class="row" style="gap:6px">${CHECKIN_OPTS.map(([v,l])=>`<button class="btn sm ${st.checkin===v?'mg':'ghost'}" aria-pressed="${st.checkin===v}" onclick="CLASSROOM.setOpt('checkin','${v}')">${l}</button>`).join('')}</div></div>
        <div style="margin:6px 0 14px"><div style="font-weight:600">Break reminder</div><p class="faint" style="margin:2px 0 8px;font-size:13px">A 5-minute stand-up break: stretch, water, fresh air. The timer carries over when lessons auto-continue.</p>
          <div class="row" style="gap:6px">${BREAK_OPTS.map(([v,l])=>`<button class="btn sm ${st.breakMin===v?'mg':'ghost'}" aria-pressed="${st.breakMin===v}" onclick="CLASSROOM.setOpt('breakMin',${v})">${l}</button>`).join('')}</div></div>
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
      <div class="holo" style="margin-top:14px"><p class="eyebrow">What happens</p><p class="muted" style="margin:0;font-size:14px">Objectives → the simple version → ${st.checkin==='off'?'the lecture, section by section':st.checkin==='section'?'the lecture, section by section, with a check-in question after each one':'the lecture in short parts of about '+(st.checkin==='medium'?'4':'2')+' minutes, each followed by a check-in question you answer before it continues'} → a worked example → misconceptions → a five-question oral quiz graded by your professor → key terms.${st.breakMin?' A break reminder every '+st.breakMin+' minutes.':''} About ${m.minutes} minutes of teaching. Score and progress are saved; mistakes go to your mistake journal. <a href="#class">Change check-ins</a></p>
        <div class="row" style="margin-top:10px"><button class="btn ghost sm" onclick="GP.go('${m.id}')">Open the written lecture</button><button class="btn ghost sm" onclick="GP.go('class')">All lessons</button></div></div>`);
    showProg();
  }
  window.addEventListener('hashchange',()=>{ const h=(location.hash||'').slice(1); if(st.running&&h!=='class-'+st.mid){ stop(true); } });
  document.addEventListener('visibilitychange',async()=>{ if(document.visibilityState==='visible'&&st.running&&!st.wake){ try{ st.wake=await navigator.wakeLock.request('screen'); }catch(e){} } });

  V.push({test:h=>h==='class', nav:'class', render:(h,api)=>{ A=api; classHome(); }});
  V.push({test:h=>/^class-[a-z]\d+m\d+$/.test(h), nav:'class', render:(h,api)=>{ A=api; classSession(h.slice(6)); }});
  window.GP_HOME_EXTRA=window.GP_HOME_EXTRA||[];
  window.GP_HOME_EXTRA.push(api=>`<div class="holo" style="margin-top:14px"><div class="row" style="justify-content:space-between;align-items:center"><div><p class="eyebrow">Classroom · hands-free</p><p style="margin:0" class="muted">Your professor teaches out loud in short parts and checks in with a quick question after each one.</p></div><button class="btn mg" onclick="GP.go('class')">🎓 Enter</button></div></div>`);
  window.CLASSROOM={start,toggle,repeat,skip,stop,answerTap,setOpt,_st:st};
})();
