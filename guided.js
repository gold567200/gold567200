/* Guided lessons — one step at a time, built for focus.
   Each lesson opens with the big idea, why it matters and the few things to remember. Then it moves part by part:
   - each part opens with what it's about, in plain words, and whether it's core or extra depth;
   - "Remember this" moments come right after the point they belong to;
   - a quick check comes every couple of parts, and a recap closes the lesson.
   The lesson text itself is unchanged; the guidance comes from window.FOCUS (focus_*.js), one pack per lesson.
   "Listen" reads the lesson the way a teacher would: signposting, pausing on what matters, asking and then answering. */
(function(){
  const MODE_KEY='genius_lesson_mode_v1';
  let A=null, cur=null;            // cur = {id, pp, m, idx, steps, i}
  const $=id=>document.getElementById(id);
  const esc=s=>A?A.esc(s):String(s);
  function mode(){ try{ return localStorage.getItem(MODE_KEY)||'guided'; }catch(e){ return 'guided'; } }
  function setMode(v){ try{ localStorage.setItem(MODE_KEY,v); }catch(e){} }
  function pack(id){ return (window.FOCUS||{})[id]||null; }

  const css=`.gd-top{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 10px}
  .gd-bar{flex:1;min-width:140px;height:8px;border-radius:6px;background:var(--line);overflow:hidden}.gd-bar i{display:block;height:100%;background:linear-gradient(90deg,var(--cyan),var(--mag));transition:width .25s}
  .gd-card{min-height:240px}.gd-card .lecture{font-size:var(--read,18px);line-height:1.65}
  .gd-kicker{font-family:var(--fmono);font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--cyan);margin:0 0 6px}
  .gd-plain{border-left:4px solid var(--cyan);background:#00e5ff12;border-radius:8px;padding:12px 14px;margin:8px 0 14px;font-size:calc(var(--read,18px) + 1px);line-height:1.55}
  .gd-plain b{color:var(--cyan)}
  .gd-rem{border:2px solid var(--amber);background:#ffb40014;border-radius:12px;padding:18px 18px 16px;margin:6px 0}
  .gd-rem .gd-kicker{color:var(--amber)}.gd-rem p{font-size:calc(var(--read,18px) + 3px);line-height:1.5;margin:6px 0 0;font-weight:600}
  .gd-big{font-size:calc(var(--read,18px) + 4px);line-height:1.45;font-weight:600;margin:4px 0 12px}
  .gd-list{margin:6px 0 0 0;padding:0;list-style:none;counter-reset:gd}.gd-list li{counter-increment:gd;position:relative;padding:8px 0 8px 40px;border-top:1px solid var(--line);line-height:1.5}
  .gd-list li::before{content:counter(gd);position:absolute;left:4px;top:7px;width:26px;height:26px;border-radius:50%;background:var(--amber);color:#111;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:14px}
  .gd-chip{display:inline-block;font-size:12px;padding:2px 8px;border-radius:10px;margin-left:6px;vertical-align:middle}
  .gd-chip.core{background:#00e5ff22;color:var(--cyan)}.gd-chip.extra{background:#ffffff14;color:var(--dim)}
  .gd-nav{display:flex;gap:10px;justify-content:space-between;margin-top:12px}.gd-nav .btn{flex:1;max-width:220px}
  .gd-ans{margin-top:12px;padding:12px 14px;border-radius:8px;background:#00ff9c12;border-left:4px solid var(--ok)}
  .gd-reading{outline:2px solid #00e5ff55;outline-offset:6px;border-radius:6px}`;
  const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

  /* ---------- turning a lesson into steps ---------- */
  function splitBody(m){
    const parts=String(m.body||'').split(/<h4[^>]*>/i);
    const intro=parts[0];
    const secs=parts.slice(1).map(s=>{ const t=((s.match(/^([\s\S]*?)<\/h4>/i)||[,''])[1]); return { title:t.replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").trim(), html:s.replace(/^[\s\S]*?<\/h4>/i,'') }; });
    return {intro,secs};
  }
  const textLen=html=>{ const d=document.createElement('div'); d.innerHTML=html; return (d.textContent||'').replace(/\s+/g,' ').trim().length; };
  // Long parts are split into pages of about 1,100 characters at element boundaries, so each screen holds one idea.
  function pages(html){
    const d=document.createElement('div'); d.innerHTML=html; const out=[]; let buf='', len=0;
    [...d.childNodes].forEach(n=>{ const h=n.nodeType===1?n.outerHTML:(n.textContent||''); const l=(n.textContent||'').replace(/\s+/g,' ').trim().length;
      if(buf&&len+l>1100&&len>350){ out.push(buf); buf=''; len=0; } buf+=h; len+=l; });
    if(buf.trim()) out.push(buf);
    return out.length?out:[html];
  }
  function buildSteps(pp,m){
    const F=pack(m.id); const {intro,secs}=splitBody(m); const steps=[];
    steps.push({type:'intro'});
    if(((window.ILLUS||{})[m.id]||[]).length) steps.push({type:'figs'});
    if(textLen(intro)>40) steps.push({type:'scene',html:intro});
    const checks=(m.checks||[]).slice(); let coreSince=0;
    secs.forEach((s,i)=>{
      const meta=(F.parts||[])[i]||{t:s.title,gist:'',core:true};
      const pg=pages(s.html);
      pg.forEach((h,j)=>steps.push({type:'part',i,j,of:pg.length,html:h,meta}));
      const rem=(F.remember||[]).filter(r=>r.part===i);
      if(rem.length) steps.push({type:'remember',items:rem.map(r=>r.p)});
      if(meta.core) coreSince++;
      if(coreSince>=2&&checks.length&&i<secs.length-1){ steps.push({type:'check',c:checks.shift()}); coreSince=0; }
    });
    if(checks.length) steps.push({type:'check',c:checks.shift()});
    if(m.example) steps.push({type:'example'});
    if((m.misconceptions||[]).length) steps.push({type:'traps'});
    steps.push({type:'recap'});
    return steps;
  }

  /* ---------- rendering ---------- */
  function savePos(){ try{ const S=A.S; S.guidePos=S.guidePos||{}; S.guidePos[cur.id]=cur.i; A.save(); }catch(e){} }
  function render(api,pp,m,idx){
    A=api; const F=pack(m.id); if(!F) return false;
    const steps=buildSteps(pp,m);
    let saved=((A.S.guidePos||{})[m.id])|0;
    // Reopening a finished lesson starts from the top for review; finishing it (same lesson already open) stays on the recap.
    if(saved>=steps.length-1&&A.moduleDone(m.id)&&!(cur&&cur.id===m.id)) saved=0;
    cur={id:m.id,pp,m,idx,steps,i:Math.min(saved,steps.length-1)};
    const nParts=splitBody(m).secs.length;
    A.set(`<p class="eyebrow">${esc(pp.title)} · Module ${idx+1} · Guided</p>
      <h1 style="margin:0 0 8px">${esc(m.title)}</h1>
      <div class="gd-top"><div class="gd-bar" aria-hidden="true"><i id="gdbar"></i></div><span class="tag" id="gdpos"></span></div>
      <div class="row" style="margin:0 0 10px;gap:8px">
        <button class="btn" id="gdlisten" onclick="GUIDE.listen()">🔊 Listen</button>
        <button class="btn ghost sm" id="gdpause" onclick="GUIDE.pause()" hidden>❚❚ Pause</button>
        <button class="btn ghost sm" id="gdstop" onclick="GUIDE.stop()" hidden>■ Stop</button>
        <span class="tag" id="gdnote"></span>
        <label class="tag" style="display:flex;align-items:center;gap:6px">SPEED <input id="gdrate" type="range" min="0.5" max="2" step="0.05" value="${A.ttsRate?A.ttsRate():0.5}" oninput="GUIDE.rate(this.value)" style="width:110px" aria-label="Speaking speed"><span id="gdratev" class="mono" style="color:var(--cyan)">${(A.ttsRate?A.ttsRate():0.5).toFixed(2)}×</span></label>
        <span style="flex:1"></span>
        <button class="btn ghost sm" onclick="GUIDE.full()">📄 Full lesson page</button>
      </div>
      <div class="holo gd-card" id="gdcard" aria-live="polite"></div>
      <div class="gd-nav"><button class="btn ghost" id="gdback" onclick="GUIDE.back()">◂ Back</button><button class="btn mg" id="gdnext" onclick="GUIDE.next()">Next ▸</button></div>
      <p class="faint" style="font-size:13px;margin:12px 0 0">${nParts} parts · about ${m.minutes} min. Your place is saved, so you can stop after any quick check and come back. On a keyboard, the arrow keys move between steps.</p>
      <p class="faint" style="font-size:13px;margin:6px 0 0">Prefer the whole lesson on one page? <button class="btn ghost sm" id="gdalwaysfull" onclick="GUIDE.alwaysFull()">Always open the full page</button></p>`);
    show();
    return true;
  }
  function chip(core){ return core?'<span class="gd-chip core">Core</span>':'<span class="gd-chip extra">Extra depth · skim it</span>'; }
  function show(){
    if(!cur) return; const {m,steps,i}=cur; const s=steps[i]; const F=pack(m.id); const c=$('gdcard'); if(!c) return;
    const nParts=splitBody(m).secs.length; let h='';
    if(s.type==='intro'){
      const simple=(window.SIMPLE||{})[m.id];
      h=`<p class="gd-kicker">🎯 The big idea</p><p class="gd-big">${esc(F.big)}</p>
        <p class="gd-kicker">Why it matters</p><p style="margin:0 0 14px;line-height:1.6">${esc(F.why)}</p>
        ${simple?`<p class="gd-kicker">Picture this</p><p style="margin:0 0 14px;line-height:1.6">${esc(simple.picture)}</p>`:''}
        <p class="gd-kicker">🧠 What you'll remember</p><p class="faint" style="margin:0 0 4px;font-size:14px">${F.remember.length} things. Each one is flagged when you reach it.</p>
        <ol class="gd-list">${F.remember.map(r=>`<li>${esc(r.p)}</li>`).join('')}</ol>`;
    } else if(s.type==='figs'){
      const figs=(window.ILLUS||{})[m.id]||[];
      h=`<p class="gd-kicker">👀 See it first</p><p class="muted" style="margin:0 0 10px">A picture of what this lesson is about. Tap a figure to enlarge it.</p>`+
        figs.map((f,k)=>`<figure class="fig"><div class="figwrap" tabindex="0" role="button" aria-label="Enlarge figure ${k+1}">${f.svg}</div><figcaption><b>Figure ${k+1}.</b> ${esc(f.cap||f.caption||'')}</figcaption></figure>`).join('');
    } else if(s.type==='scene'){
      h=`<p class="gd-kicker">Setting the scene</p><div class="lecture" id="gdbody">${s.html}</div>`;
    } else if(s.type==='part'){
      h=`<p class="gd-kicker">Part ${s.i+1} of ${nParts}${s.of>1?` · page ${s.j+1} of ${s.of}`:''}</p>
        <h2 style="margin:0 0 6px;font-size:22px">${esc(s.meta.t)}${chip(s.meta.core)}</h2>
        ${s.j===0&&s.meta.gist?`<div class="gd-plain"><b>In plain words:</b> ${esc(s.meta.gist)}</div>`:''}
        <div class="lecture" id="gdbody">${s.html}</div>`;
    } else if(s.type==='remember'){
      h=`<div class="gd-rem"><p class="gd-kicker">🧠 Remember this</p>${s.items.map(t=>`<p>${esc(t)}</p>`).join('')}</div>
        <p class="faint" style="font-size:14px;margin:12px 0 0">Say it to yourself once before you move on. It will come back in the recap and the quiz.</p>`;
    } else if(s.type==='check'){
      h=`<p class="gd-kicker">✋ Quick check</p><p class="gd-big" style="font-size:calc(var(--read,18px) + 2px)">${esc(s.c.q)}</p>
        <p class="faint" style="margin:0 0 10px;font-size:14px">Answer in your head first, then reveal.</p>
        <button class="btn ghost" id="gdreveal" onclick="GUIDE.reveal()">Show the answer</button><div id="gdans" class="gd-ans" hidden>${esc(s.c.a)}</div>`;
    } else if(s.type==='example'){
      h=`<p class="gd-kicker">🛠 Worked example</p><div class="lecture" id="gdbody">${m.example}</div>`;
    } else if(s.type==='traps'){
      h=`<p class="gd-kicker">⚠ Traps people fall into</p><ul class="lecture" style="margin:0">${m.misconceptions.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
    } else if(s.type==='recap'){
      const done=A.moduleDone(m.id); const next=cur.pp.modules[cur.idx+1];
      h=`<p class="gd-kicker">✅ Recap · the things to remember</p><ol class="gd-list">${F.remember.map(r=>`<li>${esc(r.p)}</li>`).join('')}</ol>
        <p class="gd-kicker" style="margin-top:16px">The big idea, once more</p><p style="margin:0 0 14px;line-height:1.6">${esc(F.big)}</p>
        <div class="row" style="gap:8px">${done?'<span class="chip ok">Lesson complete ✓</span>':`<button class="btn" onclick="GUIDE.complete()">Mark lesson complete ✓</button>`}
          <button class="btn ghost" onclick="GUIDE.quiz()">Take the lesson quiz</button>
          <button class="btn ghost" onclick="GP.go('class-${m.id}')">🎓 Classroom</button>
          ${next?`<button class="btn ghost" onclick="GP.go('${next.id}')">Next lesson ▸</button>`:''}</div>`;
    }
    c.innerHTML=h;
    const body=$('gdbody'); if(body&&A.annotateTerms){ try{ A.annotateTerms(body,A.deriveTerms(cur.pp,m)); A.initKwPop&&A.initKwPop(); }catch(e){} }
    const bar=$('gdbar'); if(bar) bar.style.width=Math.round((i+1)/steps.length*100)+'%';
    const pos=$('gdpos'); if(pos) pos.textContent='Step '+(i+1)+' of '+steps.length;
    const b=$('gdback'), n=$('gdnext'); if(b) b.disabled=i===0; if(n){ n.disabled=i>=steps.length-1; n.textContent=i>=steps.length-1?'Done':'Next ▸'; }
    savePos();
  }
  function go(to,fromNarration){
    if(!cur) return; const k=Math.max(0,Math.min(cur.steps.length-1,to)); if(k===cur.i&&!fromNarration) return;
    cur.i=k; show();
    const c=$('gdcard'); if(c&&!fromNarration){ try{ c.scrollIntoView({block:'start',behavior:'smooth'}); }catch(e){} }
    if(!fromNarration&&talking){ const at=k; stopTalk(); listenFrom(at); }
  }

  /* ---------- narration ---------- */
  // Text a teacher would say for each step: signposts, the plain-words line, the content, then pauses where you'd think.
  function speechOf(html){
    const d=document.createElement('div'); d.innerHTML=html; const out=[];
    d.querySelectorAll('sup').forEach(s=>s.replaceWith(' to the power of '+s.textContent+' '));
    const walk=root=>[...root.children].forEach(n=>{ const t=n.tagName.toLowerCase();
      if(t==='pre') out.push('There is a code example on screen; study it when we pause.');
      else if(t==='table'){ const rows=A.tableSpeech?A.tableSpeech(n):[]; if(rows.length){ out.push('The table on screen summarizes this. Its rows:'); rows.slice(0,6).forEach(r=>out.push(r)); if(rows.length>6) out.push('The remaining rows are on screen.'); } }
      else if(t==='ul'||t==='ol'){ [...n.children].forEach((li,k)=>out.push((t==='ol'?(['First','Second','Third','Fourth','Fifth','Sixth','Seventh','Eighth'][k]||'Next')+', ':'')+li.textContent)); }
      else if(t==='div'||t==='section') walk(n);
      else out.push(n.textContent); });
    walk(d); if(!d.children.length) out.push(d.textContent);
    return out.map(x=>A.cleanForSpeech(String(x||'').replace(/\s+/g,' ').trim())).filter(x=>x.length>1);
  }
  function script(k){
    const {m,steps}=cur, s=steps[k], F=pack(m.id), n=splitBody(m).secs.length, seg=[]; const say=(t,p)=>seg.push({t,p:p||300});
    const short=m.title.replace(/:.*$/,''), nfig=((window.ILLUS||{})[m.id]||[]).length, nr=F.remember.length;
    const ORD=['First','Second','Third','Fourth','Fifth'];
    // A lecturer's register: measured, precise, and explicit about what matters and why.
    if(s.type==='intro'){ say('Today we take up '+short+'.',500); say('The central idea is this. '+F.big,1000); say('Why should this concern you? '+F.why,1000);
      say('There are '+nr+" points I would like you to retain from this lesson. I will mark each one as we reach it.",1200); }
    else if(s.type==='figs') say('Before we begin, study the '+(nfig>1?'figures':'figure')+' on screen. '+(nfig>1?'They frame':'It frames')+' what follows.',2500);
    else if(s.type==='scene'){ say('Let me first set out the context.',500); speechOf(s.html).forEach(t=>say(t,300)); }
    else if(s.type==='part'){
      if(s.j===0){ say('Part '+(s.i+1)+' of '+n+': '+s.meta.t.replace(/[.:]+$/,'')+'.',600);
        if(!s.meta.core) say('This part is supplementary. Follow the reasoning, but you need not commit the details to memory.',600);
        if(s.meta.gist) say('Put simply: '+s.meta.gist,1000); }
      speechOf(s.html).forEach(t=>say(t,300));
    }
    else if(s.type==='remember'){ say('This next point is essential.',600); s.items.forEach(t=>say('Commit this to memory. '+t,1600)); }
    else if(s.type==='check'){ say('Let us test your understanding. '+s.c.q,600); say('Consider it for a moment before I answer.',-4000); say('The answer: '+s.c.a,1200); }
    else if(s.type==='example'){ say('Let us now work through an example, step by step.',600); speechOf(m.example).forEach(t=>say(t,300)); }
    else if(s.type==='traps'){ say(m.misconceptions.length>1?'Now, some common misconceptions, and why each one fails.':'Now, a common misconception, and why it fails.',600); m.misconceptions.forEach(t=>say(t,800)); }
    else if(s.type==='recap'){ say('To consolidate, the '+nr+' points to retain.',800);
      F.remember.forEach((r,j)=>say((ORD[j]||'Finally')+'. '+r.p,1100));
      say('That concludes the lesson. Rest for a few minutes, then attempt the quiz: retrieving what you have learned is what makes it last.',300); }
    // Pauses scale with the speaking speed (twice as long at 0.5×), except the thinking time before a quick-check answer (negative p), which stays 4 s.
    const r=Math.max(0.5,(A.ttsRate?A.ttsRate():0.5));
    return seg.map(x=>({t:A.cleanForSpeech(x.t),p:x.p<0?-x.p:Math.round(x.p/r)}));
  }
  let talking=false, paused=false, run=0, resumeFn=null;
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  function note(t){ const e=$('gdnote'); if(e) e.textContent=t||''; }
  function useProVoice(){ return !!(window.GP_VOICE&&GP_VOICE.on()); }
  // Device voice: sentence-sized utterances (long ones get cut off on some phones).
  function deviceSay(text,my){
    return new Promise(res=>{ if(!('speechSynthesis' in window)) return setTimeout(res,Math.min(8000,text.length*55));
      const parts=(text.match(/[^.!?]+[.!?]+["')\]]?\s*|[^.!?]+$/g)||[text]); let k=0;
      const next=()=>{ if(my!==run||k>=parts.length) return res(); const u=new SpeechSynthesisUtterance(parts[k++]); const v=A.bestVoice&&A.bestVoice(); if(v){ u.voice=v; u.lang=v.lang; } else u.lang='en-US';
        u.rate=(A.ttsRate?A.ttsRate():0.5); u.onend=next; u.onerror=()=>next(); try{ speechSynthesis.speak(u); }catch(e){ res(); } };
      next(); });
  }
  async function holdIfPaused(){ while(paused){ await new Promise(r=>{ resumeFn=r; }); } }
  async function listenFrom(k){
    const my=++run; talking=true; paused=false; ui(true);
    for(let i=k;i<cur.steps.length;i++){
      if(my!==run) return;
      if(i!==cur.i) go(i,true);
      const seg=script(i);
      for(let j=0;j<seg.length;j++){
        if(my!==run) return; await holdIfPaused(); if(my!==run) return;
        const s=seg[j], nextT=(seg[j+1]||(i+1<cur.steps.length?(script(i+1)[0]||{}):{})).t||'';
        if(useProVoice()){
          try{ await GP_VOICE.say(s.t,{title:cur.m.title,prefetchNext:nextT,onstatus:t=>note('▶ '+t),onstart:()=>note('▶ '+GP_VOICE.label())}); }
          catch(e){ GP_VOICE.suspend(); A.toast(GP_VOICE.explain(e)+' Switching to the device voice.'); await deviceSay(s.t,my); }
        } else { note('▶ reading'); await deviceSay(s.t,my); }
        if(my!==run) return; await holdIfPaused(); if(my!==run) return;
        await wait(s.p);
      }
    }
    if(my===run){ talking=false; ui(false); note('Lesson read ✓'); }
  }
  function ui(on){ const l=$('gdlisten'), p=$('gdpause'), s=$('gdstop'); if(l) l.hidden=on; if(p){ p.hidden=!on; p.textContent='❚❚ Pause'; } if(s) s.hidden=!on; }
  function stopTalk(){ run++; talking=false; paused=false; if(resumeFn){ const f=resumeFn; resumeFn=null; f(); }
    try{ window.GP_VOICE&&GP_VOICE.stop(); }catch(e){} try{ speechSynthesis.cancel(); }catch(e){} }

  window.GUIDE={
    wants:m=>mode()==='guided'&&!!pack(m.id),
    render, buildSteps, script:k=>cur?script(k):[], steps:()=>cur&&cur.steps, pos:()=>cur&&cur.i,
    next:()=>go(cur.i+1), back:()=>go(cur.i-1), goto:k=>go(k),
    reveal:()=>{ const a=$('gdans'), b=$('gdreveal'); if(a) a.hidden=false; if(b) b.hidden=true; },
    listen:()=>{ if(A.unlockSpeech) A.unlockSpeech(); listenFrom(cur.i); },
    pause:()=>{ if(!talking) return; const p=$('gdpause');
      if(!paused){ paused=true; try{ window.GP_VOICE&&GP_VOICE.pause(); }catch(e){} try{ speechSynthesis.pause(); }catch(e){} if(p) p.textContent='▶ Resume'; note('paused'); }
      else { paused=false; try{ window.GP_VOICE&&GP_VOICE.resume(); }catch(e){} try{ speechSynthesis.resume(); }catch(e){} if(p) p.textContent='❚❚ Pause'; note('▶ playing'); if(resumeFn){ const f=resumeFn; resumeFn=null; f(); } } },
    stop:()=>{ stopTalk(); ui(false); note(''); },
    full:()=>{ stopTalk(); GP._fullView=cur.id; A.moduleView(cur.id); },
    guided:id=>{ setMode('guided'); GP._fullView=null; A.moduleView(id); },
    setMode, mode,
    // Speed change while listening applies from the next sentence (and its pauses).
    rate:v=>{ A.setRate(v); const l=$('gdratev'); if(l) l.textContent=(A.ttsRate?A.ttsRate():+v).toFixed(2)+'×'; },
    alwaysFull:()=>{ setMode('full'); A.toast('Lessons will open as one full page. The 🎯 Guided version button at the top of each lesson switches back.'); GUIDE.full(); },
    complete:()=>{ stopTalk(); A.completeModule(cur.id); },
    quiz:()=>{ stopTalk(); GP._fullView=cur.id; A.moduleView(cur.id); setTimeout(()=>{ const q=document.getElementById('lqbox'); if(q) q.scrollIntoView({block:'start'}); },60); },
    talking:()=>talking
  };
  document.addEventListener('keydown',e=>{ if(!cur||!$('gdcard')) return; if(/input|textarea|select/i.test((e.target&&e.target.tagName)||'')) return;
    if(e.key==='ArrowRight'){ e.preventDefault(); GUIDE.next(); } else if(e.key==='ArrowLeft'){ e.preventDefault(); GUIDE.back(); } });
  window.addEventListener('hashchange',()=>{ if(talking) stopTalk(); if(window.GP) GP._fullView=null; cur=null; });
})();
