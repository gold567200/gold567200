/* Toolkit — learning tools that plug into the Genius Protocol engine through window.GP_VIEWS / window.GP_API */
(function(){
  const V=window.GP_VIEWS=window.GP_VIEWS||[]; let A=null;
  const $=id=>document.getElementById(id); const esc=s=>A?A.esc(s):String(s);
  const today=()=>(A&&A.dayKey)?A.dayKey():new Date().toISOString().slice(0,10);
  const css=`.tool-grid .holo{display:flex;flex-direction:column;gap:6px}.tool-grid .ti{font-weight:600}.tool-grid .btn{align-self:flex-start;margin-top:auto}
  .bar{display:flex;align-items:flex-end;gap:4px;height:90px;border-bottom:1px solid var(--line);padding-bottom:2px}.bar i{flex:1;background:linear-gradient(180deg,var(--cyan),#0a4a5c);border-radius:3px 3px 0 0;min-height:2px;display:block}
  .timer{font-family:var(--fmono);font-size:56px;letter-spacing:.06em;color:var(--cyan);text-shadow:0 0 18px #00e5ff66}
  .mission li{margin:6px 0}.mission input{transform:scale(1.3);margin-right:10px}
  .blurt textarea{min-height:180px}.hit{color:var(--ok)}.miss{color:var(--mag)}
  .res .item .ti{font-weight:600}.hl{background:#00e5ff22;border-radius:3px}
  .sheet h3{margin:14px 0 6px;color:var(--cyan)}.sheet dl{margin:0}.sheet dt{font-weight:700;color:#e6f6ff;margin-top:8px}.sheet dd{margin:2px 0 0 0;color:var(--muted)}
  @media print{#nav,#hud,header,.btn,#popin,#toast{display:none!important}body,#deck{background:#fff!important;color:#000!important;overflow:visible!important}.holo{border:1px solid #999;box-shadow:none}.sheet dt{color:#000}.sheet dd{color:#333}.sheet h3{color:#000}}`;
  const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
  const T=()=>{ A.S.tools=A.S.tools||{}; return A.S.tools; };

  /* ---------- Toolkit home ---------- */
  const TOOLS=[
    ['tool-focus','⏱','Focus timer & daily mission','A 25/5 timer and today\'s three-step mission: lecture → recall → practice.'],
    ['tool-drill','🎯','Mixed drill','Interleaved questions pulled from every domain you\'ve touched — the strongest known booster of long-term retention.'],
    ['tool-mistakes','📓','Mistake journal','Every question you ever missed, re-asked until you clear it.'],
    ['tool-sim','🏁','Exam simulator','Timed, randomized certification-style exams with pass marks and score history.'],
    ['tool-blurt','🧠','Blurting (free recall)','Write everything you remember about a lesson from a blank page; see which key terms you hit and which you missed.'],
    ['tool-dojo','⌨️','Command dojo','Type Linux, PowerShell, Git, Docker, kubectl, SQL and Cisco commands from memory until they are muscle memory.'],
    ['tool-sql','🗄️','SQL lab','A real query engine in your browser with sample tables and graded exercises.'],
    ['tool-maps','🕸','Concept maps','One picture per domain: modules and their key terms, linked.'],
    ['tool-sheets','📄','Cheat sheets','A printable one-page summary per domain — terms, cards and lesson one-liners.'],
    ['tool-search','🔎','Search everything','Find any term, lecture or card across the whole curriculum.'],
    ['tool-think','💡','Thinking tools','Mental models and learning-science techniques, with prompts to apply them to what you are studying now.'],
    ['tool-stats','📈','Study analytics','XP per day, streaks, exam scores by domain, weakest areas.'],
    ['tool-backup','💾','Backup & restore','Export your progress to a file and restore it on any device.'],
    ['tool-socratic','🗣','Socratic mode','Make ADA answer with guiding questions instead of answers — the way the best tutors teach.'],
    ['tool-ada','🔑','Connect ADA','Use ADA on the website version with your own Anthropic API key. Inside the Claude app this isn\'t needed.']];
  function toolsHome(){
    let h=`<p class="eyebrow">Toolkit</p><h1 style="margin:0 0 6px">Genius Tools</h1><p class="muted" style="margin:0 0 14px">Everything cognitive science says actually works — retrieval, spacing, interleaving, free recall, deliberate practice — built as tools you can run in two taps.</p><div class="grid c2 tool-grid">`;
    TOOLS.forEach(([id,ic,t,d])=>{ h+=`<div class="holo"><div class="row" style="justify-content:space-between"><span class="ti">${esc(t)}</span><span style="font-size:20px">${ic}</span></div><p class="muted" style="margin:0;font-size:14px">${esc(d)}</p><button class="btn ghost sm" onclick="GP.go('${id}')">Open ▸</button></div>`; });
    A.set(h+`</div>`);
  }

  /* ---------- Backup & restore ---------- */
  // Inside the Claude artifact viewer the page runs in a frame where downloads and print are blocked.
  const FRAMED=(()=>{ try{ return window.self!==window.top; }catch(e){ return true; } })();
  async function copySheet(){ const el=document.querySelector('#view'); const txt=el?el.innerText:''; try{ await navigator.clipboard.writeText(txt); A.toast('Cheat sheet copied'); }catch(e){ A.toast('Copy was blocked here — select the text and copy it by hand'); } }
  function backupView(){
    const n=JSON.stringify(A.S).length;
    A.set(`<p class="eyebrow">Toolkit</p><h1 style="margin:0 0 6px">Backup &amp; restore</h1>
      <p class="muted">Your progress lives in this browser's storage. Export it regularly (and before clearing site data or switching phones), then restore it anywhere.</p>
      <div class="holo"><p class="eyebrow">Export</p><p class="muted" style="margin:0 0 10px">${(n/1024).toFixed(1)} KB · XP ${A.S.xp} · ${Object.keys(A.S.done||{}).length} modules done · ${Object.keys(A.S.srs||{}).length} cards learned</p>
        ${FRAMED?`<p class="muted" style="margin:0 0 10px;font-size:14px">Inside the Claude viewer, downloads are blocked. Copy the backup text and keep it somewhere safe (a note, an email to yourself, or a .json file on your computer).</p>
        <div class="row"><button class="btn" onclick="TOOLS.copyBackup()">Copy backup text</button><button class="btn ghost" onclick="TOOLS.showBackup()">Show backup text</button></div>`
        :`<div class="row"><button class="btn" onclick="TOOLS.exportFile()">Download backup file</button><button class="btn ghost" onclick="TOOLS.copyBackup()">Copy as text</button><button class="btn ghost" onclick="TOOLS.showBackup()">Show backup text</button></div>`}
        <textarea id="bkout" readonly hidden aria-label="Backup text" style="min-height:90px;margin-top:10px"></textarea></div>
      <div class="holo" style="margin-top:14px"><p class="eyebrow">Restore</p><p class="muted" style="margin:0 0 10px">Pick a backup file, or paste the text. Restoring replaces the progress on this device.</p>
        <input type="file" id="bkfile" accept="application/json,.json" style="margin-bottom:10px"><textarea id="bktext" placeholder="…or paste backup text here" style="min-height:80px"></textarea>
        <div class="row" style="margin-top:10px"><button class="btn mg" onclick="TOOLS.importBackup()">Restore</button></div><p id="bkmsg" class="muted" style="margin:8px 0 0"></p></div>`);
  }
  function exportFile(){ const data=backupText(); const blob=new Blob([data],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='genius-protocol-backup-'+today()+'.json'; document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); },500); A.toast('Backup downloaded'); }
  function backupText(){ return JSON.stringify({app:'genius_protocol',v:1,t:Date.now(),S:A.S}); }
  function showBackup(){ const t=$('bkout'); if(!t) return; t.value=backupText(); t.hidden=false; t.focus(); t.select(); A.toast('Backup text shown — select all and copy it'); }
  async function copyBackup(){ const data=backupText(); try{ await navigator.clipboard.writeText(data); A.toast('Backup copied — paste it somewhere safe'); }catch(e){ const t=$('bkout'); if(t){ t.value=data; t.hidden=false; t.focus(); t.select(); } A.toast('Copy was blocked here — the text is selected below; copy it by hand'); } }
  function validateBackupTree(value,depth=0,budget={n:0}){
    if(depth>40 || ++budget.n>100000) return false;
    if(value===null || typeof value==='string' || typeof value==='boolean') return true;
    if(typeof value==='number') return Number.isFinite(value);
    if(Array.isArray(value)) return value.length<=100000 && value.every(v=>validateBackupTree(v,depth+1,budget));
    if(typeof value!=='object' || Object.getPrototypeOf(value)!==Object.prototype) return false;
    for(const k of Object.keys(value)){if(k==='__proto__'||k==='prototype'||k==='constructor'||!validateBackupTree(value[k],depth+1,budget))return false;}
    return true;
  }
  function importBackup(){
    const f=$('bkfile').files[0];
    const done=txt=>{
      try{
        if(typeof txt!=='string'||txt.length>10000000) throw new Error('file too large');
        const o=JSON.parse(txt);
        if(!o||Array.isArray(o)||typeof o!=='object') throw new Error('not an object');
        if(o.app!==undefined && o.app!=='genius_protocol') throw new Error('wrong application');
        if(o.v!==undefined && o.v!==1) throw new Error('unsupported backup version');
        const imported=o.S||o;
        if(!imported||Array.isArray(imported)||typeof imported!=='object'||!validateBackupTree(imported)||typeof imported.xp!=='number'||!Number.isFinite(imported.xp)||imported.xp<0||imported.xp>1000000000) throw new Error('invalid state');
        if(imported.streak!==undefined&&(!Number.isFinite(imported.streak)||imported.streak<0||imported.streak>1000000)) throw new Error('invalid streak');
        const next={xp:0,streak:0,last:null,done:{},exams:{},labs:{},listened:{},certq:{},srs:{},seenPop:{},tutor:[]};
        Object.keys(A.S).forEach(k=>delete A.S[k]);
        Object.assign(A.S,next,imported); if(A.normalizeState) A.normalizeState(A.S);
        A.save(); A.renderHUD();
        $('bkmsg').textContent='Restored ✓ — '+Object.keys(A.S.done||{}).length+' modules, XP '+A.S.xp;
        A.toast('Progress restored');
      }catch(e){$('bkmsg').textContent='Restore rejected: choose an intact Genius Protocol backup (JSON under 10 MB). Your current progress was not changed.';}
    };
    if(f){ if(f.size>10000000){$('bkmsg').textContent='Backup file exceeds the 10 MB safety limit.';return;} f.text().then(done).catch(()=>{$('bkmsg').textContent='The backup file could not be read.';}); }
    else if($('bktext').value.trim()) done($('bktext').value.trim());
    else $('bkmsg').textContent='Choose a file or paste the text first.';
  }

  /* ---------- Question pools ---------- */
  function mcPool(filter){ const out=[]; A.phases().forEach(p=>{ if(filter&&!filter(p)) return; (p.exam||[]).forEach(q=>{ if(q.type==='mc') out.push(Object.assign({src:'exam:'+p.id,pid:p.id},q)); }); const cid=A.certFor(p); if(cid){ (A.CERTS[cid].q||[]).forEach((q,i)=>out.push(Object.assign({id:cid+'_q'+i,src:'cert:'+cid,pid:p.id},q))); } }); return out; }
  function touched(p){ return (p.modules||[]).some(m=>A.moduleDone(m.id)) || !!A.S.exams[p.id] || A.phaseUnlocked(p)&&p.num===1; }
  let Q=null; // active quiz session
  function startQuiz(kind,items,opts={}){ Q={kind,items:A.shuffle(items).slice(0,opts.n||items.length),i:0,ok:0,picks:[],start:Date.now(),limit:opts.limitMs||0,title:opts.title||'Drill',pass:opts.pass||0,onDone:opts.onDone||null,cert:opts.cert||null}; renderQ(); if(Q.limit) tickQ(); }
  function tickQ(){ if(!Q||!Q.limit) return; const left=Q.limit-(Date.now()-Q.start); const t=$('qtimer'); if(!t){ Q=null; return; } /* left the timed test: abandon it rather than grade it later over another page */ t.textContent=Math.max(0,Math.floor(left/60000))+':'+String(Math.max(0,Math.floor(left/1000)%60)).padStart(2,'0'); if(left<=0){ finishQ(); return; } Q._t=setTimeout(tickQ,500); }
  function renderQ(){ const q=Q.items[Q.i]; if(!q) return finishQ();
    A.set(`<p class="eyebrow">${esc(Q.title)} · ${Q.i+1}/${Q.items.length}${Q.limit?' · <span id="qtimer" class="mono"></span> left':''}</p>
      <div class="holo q"><div class="stem" style="font-size:17px">${esc(q.q)}</div>${q.options.map((o,j)=>`<button type="button" class="opt" data-j="${j}" onclick="TOOLS.pickQ(${j})">${esc(o)}</button>`).join('')}
        <div id="qwhy" class="muted" style="margin-top:10px" hidden></div></div>
      <div class="row" style="margin-top:12px;justify-content:space-between"><span class="muted">${Q.ok} correct so far</span><button class="btn ghost sm" onclick="TOOLS.finishQ()">End</button></div>`); }
  function pickQ(j){ const q=Q.items[Q.i]; if(Q.picks[Q.i]!=null) return; Q.picks[Q.i]=j; const right=j===q.answer; if(right){ Q.ok++; A.addXP(2); } else A.logMiss({id:q.id,q:q.q,options:q.options,answer:q.answer,why:q.why,src:q.src||Q.kind,pick:j});
    document.querySelectorAll('.opt').forEach(b=>{ const jj=+b.dataset.j; if(jj===q.answer) b.classList.add('right'); if(jj===j&&!right) b.classList.add('wrong'); b.disabled=true; });
    const w=$('qwhy'); if(w){ w.hidden=false; w.innerHTML=(right?'<b style="color:var(--ok)">Correct.</b> ':'<b style="color:var(--mag)">Not quite.</b> ')+esc(q.why||'')+` <button class="btn sm" style="margin-left:8px" onclick="TOOLS.nextQ()">Next ▸</button>`; }
    if(right && Q.kind==='mistakes'){ const m=A.S.mist&&A.S.mist[q.id]; if(m){ m.n=Math.max(0,(m.n||1)-1); if(m.n===0) delete A.S.mist[q.id]; } }
    A.save(); }
  function nextQ(){ Q.i++; renderQ(); }
  function finishQ(){ if(!Q) return; clearTimeout(Q._t); const n=Q.picks.filter(x=>x!=null).length, pct=Q.items.length?Math.round(Q.ok/Q.items.length*100):0; const passed=Q.pass?pct>=Q.pass:null; const Qd=Q; Q=null;
    if(Qd.cert){ A.S.simhist=A.S.simhist||{}; (A.S.simhist[Qd.cert]=A.S.simhist[Qd.cert]||[]).push({t:Date.now(),pct,n:Qd.items.length}); if(passed) A.addXP(60,'Simulated exam passed'); A.save(); }
    else if(Qd.ok>=5) A.addXP(10,'Drill complete');
    A.set(`<div class="holo center"><p class="eyebrow">${esc(Qd.title)}</p><div class="big" style="color:${passed===false?'var(--mag)':'var(--ok)'}">${pct}%</div><p class="muted">${Qd.ok} of ${Qd.items.length} correct · ${n} answered${Qd.pass?' · pass mark '+Qd.pass+'%':''}${passed===true?' · <b style="color:var(--ok)">PASS</b>':passed===false?' · <b style="color:var(--mag)">below the mark — review the journal and retry</b>':''}</p>
      <div class="row" style="justify-content:center"><button class="btn" onclick="GP.go('${Qd.cert?'tool-sim':Qd.kind==='mistakes'?'tool-mistakes':'tool-drill'}')">Back</button><button class="btn ghost" onclick="GP.go('tool-mistakes')">Mistake journal</button></div></div>`); }

  /* ---------- Mixed drill ---------- */
  function drillView(){ const pool=mcPool(touched); const all=mcPool();
    A.set(`<p class="eyebrow">Toolkit</p><h1 style="margin:0 0 6px">Mixed drill</h1><p class="muted">Interleaving: questions from different domains, shuffled together, so you practise <i>choosing</i> the right idea instead of pattern-matching the chapter. ${pool.length} questions available from domains you've started (${all.length} in the whole curriculum).</p>
      <div class="grid c2"><div class="holo"><p class="eyebrow">Started domains</p><p class="muted" style="margin:0 0 10px">${pool.length} questions</p><button class="btn" ${pool.length?'':'disabled'} onclick="TOOLS.drill('touched',12)">12 questions ▸</button></div>
      <div class="holo"><p class="eyebrow">Whole curriculum</p><p class="muted" style="margin:0 0 10px">Preview everything — expect to miss a lot.</p><button class="btn ghost" onclick="TOOLS.drill('all',12)">12 questions ▸</button></div></div>`); }
  function drill(scope,n){ const pool=scope==='all'?mcPool():mcPool(touched); if(!pool.length) return A.toast('Finish a module first'); startQuiz('drill',pool,{n,title:'Mixed drill'}); }

  /* ---------- Mistake journal ---------- */
  function mistakesView(){ const M=A.S.mist||{}; const list=Object.values(M).sort((a,b)=>b.t-a.t); const mc=list.filter(x=>x.options&&x.options.length);
    let h=`<p class="eyebrow">Toolkit</p><h1 style="margin:0 0 6px">Mistake journal</h1><p class="muted">${list.length} open mistakes. A question leaves the journal when you answer it correctly as many times as you missed it. Retrying mistakes is the highest-yield study there is.</p>
      <div class="row" style="margin-bottom:14px"><button class="btn mg" ${mc.length?'':'disabled'} onclick="TOOLS.retryMistakes()">Retry ${Math.min(mc.length,15)} now ▸</button><button class="btn ghost sm" onclick="TOOLS.clearMistakes(this)">Clear all</button></div><div class="ilist">`;
    list.slice(0,60).forEach(x=>{ h+=`<div class="item"><span class="ix">${Number(x.n)||1}×</span><span class="bd"><span class="ti" style="font-weight:500">${esc(x.q)}</span><span class="me">${x.options?('Answer: '+esc(x.options[x.answer])):('Model answer: '+esc(x.answer||''))}${x.why?' — '+esc(x.why):''}<br><span class="faint">${esc(x.src||'')} · ${new Date(x.t).toLocaleDateString()}</span></span></span></div>`; });
    if(!list.length) h+=`<div class="holo center"><div class="big" style="color:var(--ok)">Clean slate ✓</div><p class="muted">Missed questions from exams, drills, vocabulary checks, cert prep and the Classroom will collect here.</p></div>`;
    A.set(h+`</div>`); }
  function retryMistakes(){ const list=Object.values(A.S.mist||{}).filter(x=>x.options&&x.options.length); startQuiz('mistakes',list,{n:15,title:'Mistake retry'}); }
  let clearArmedUntil=0;
  function clearMistakes(btn){ // the viewer ignores confirm(), so confirmation is a second tap
    const n=Object.keys(A.S.mist||{}).length; if(!n){ A.toast('The journal is already empty'); return; }
    if(Date.now()>clearArmedUntil){ clearArmedUntil=Date.now()+5000; if(btn){ btn.textContent='Tap again to clear '+n; btn.classList.add('mg'); } setTimeout(()=>{ if(Date.now()>=clearArmedUntil && btn && document.body.contains(btn)){ btn.textContent='Clear all'; btn.classList.remove('mg'); } },5100); return; }
    clearArmedUntil=0; A.S.mist={}; A.save(); A.toast('Mistake journal cleared'); mistakesView(); }

  /* ---------- Exam simulator ---------- */
  function simView(){ let h=`<p class="eyebrow">Toolkit</p><h1 style="margin:0 0 6px">Exam simulator</h1><p class="muted">Timed and randomized, like the real thing: questions drawn from the certification's practice bank plus its domain's mastery exam. Pass mark 80%. Your scores are kept so you can see readiness grow.</p><div class="ilist">`;
    A.phases().forEach(p=>{ const cid=A.certFor(p); if(!cid) return; const c=A.CERTS[cid]; const pool=(c.q||[]).length+(p.exam||[]).filter(q=>q.type==='mc').length; const hist=(A.S.simhist||{})[cid]||[]; const best=hist.length?Math.max(...hist.map(x=>x.pct)):null;
      h+=`<a class="item" onclick="TOOLS.sim('${cid}')"><span class="ix">🏁</span><span class="bd"><span class="ti">${esc(c.name)}</span><span class="me">${pool} questions · ${Math.ceil(Math.min(pool,30)*1.2)} min${hist.length?' · attempts '+hist.length+' · best '+best+'%':''}</span></span><span class="tag">▸</span></a>`; });
    A.set(h+`</div>`); }
  function sim(cid){ const c=A.CERTS[cid]; const p=A.phase(c.ph); const pool=[...(c.q||[]).map((q,i)=>Object.assign({id:cid+'_q'+i,src:'cert:'+cid},q)),...(p&&p.exam||[]).filter(q=>q.type==='mc').map(q=>Object.assign({src:'exam:'+p.id},q))]; if(!pool.length) return A.toast('No questions yet'); const n=Math.min(pool.length,30); startQuiz('sim',pool,{n,title:'Simulated: '+c.code,pass:80,limitMs:Math.ceil(n*1.2)*60000,cert:cid}); }

  /* ---------- Focus timer & daily mission ---------- */
  let F={left:25*60,run:false,mode:'focus',t:null};
  function focusView(){ const Tt=T(); Tt.focus=Tt.focus||{}; const d=today(); const sessions=Number(Tt.focus[d])||0; const next=A.nextUp(); const due=A.dueCards().length; const mist=Object.keys(A.S.mist||{}).length; Tt.mission=Tt.mission||{}; const M=Tt.mission[d]||(Tt.mission[d]={});
    A.set(`<p class="eyebrow">Toolkit</p><h1 style="margin:0 0 6px">Focus &amp; today's mission</h1>
      <div class="holo center"><p class="eyebrow">${F.mode==='focus'?'Focus block':'Break'}</p><div class="timer" id="ftime">${fmt(F.left)}</div><p class="muted" style="margin:6px 0 12px">${sessions} focus block${sessions===1?'':'s'} today · 25 on, 5 off. Phone face-down. One task.</p>
        <div class="row" style="justify-content:center"><button class="btn mg" id="fbtn" onclick="TOOLS.focusToggle()">${F.run?'Pause':'Start'}</button><button class="btn ghost" onclick="TOOLS.focusReset()">Reset</button><button class="btn ghost sm" onclick="TOOLS.focusLen(25)">25</button><button class="btn ghost sm" onclick="TOOLS.focusLen(50)">50</button></div></div>
      <div class="holo" style="margin-top:14px"><p class="eyebrow">Today's mission</p><ul class="mission" style="list-style:none;padding:0;margin:0">
        <li><label><input type="checkbox" ${M.lecture?'checked':''} onchange="TOOLS.mission('lecture',this.checked)"> Learn: <b>${next?esc(next.m.title):'All modules complete'}</b> ${next?`<button class="btn ghost sm" onclick="GP.go('${next.m.id}')">open</button> <button class="btn ghost sm" onclick="GP.go('class-${next.m.id}')">classroom</button>`:''}</label></li>
        <li><label><input type="checkbox" ${M.recall?'checked':''} onchange="TOOLS.mission('recall',this.checked)"> Recall: <b>${due} cards due</b> <button class="btn ghost sm" onclick="GP.go('cards')">review</button></label></li>
        <li><label><input type="checkbox" ${M.practice?'checked':''} onchange="TOOLS.mission('practice',this.checked)"> Practice: <b>${mist?mist+' mistakes to retry':'a mixed drill'}</b> <button class="btn ghost sm" onclick="GP.go('${mist?'tool-mistakes':'tool-drill'}')">go</button></label></li>
        <li><label><input type="checkbox" ${M.build?'checked':''} onchange="TOOLS.mission('build',this.checked)"> Build: <b>one lab or dojo set</b> <button class="btn ghost sm" onclick="GP.go('labs')">labs</button> <button class="btn ghost sm" onclick="GP.go('tool-dojo')">dojo</button></label></li></ul>
        <p class="faint" style="margin:10px 0 0">All four done = +40 XP. ${M.lecture&&M.recall&&M.practice&&M.build?'<b style="color:var(--ok)">Mission complete ✓</b>':''}</p></div>`); }
  function fmt(s){ return Math.floor(s/60)+':'+String(s%60).padStart(2,'0'); }
  function focusToggle(){ F.run=!F.run; if(F.run){ F.t=setInterval(()=>{ F.left--; const e=$('ftime'); if(e) e.textContent=fmt(F.left); if(F.left<=0){ clearInterval(F.t); F.run=false; if(F.mode==='focus'){ const Tt=T(); Tt.focus=Tt.focus||{}; Tt.focus[today()]=(Number(Tt.focus[today()])||0)+1; A.addXP(15,'Focus block done'); F.mode='break'; F.left=5*60; try{ navigator.vibrate&&navigator.vibrate([200,100,200]); }catch(x){} A.popin('Focus block complete. Stand up, look far away for twenty seconds, water. Back in five.'); } else { F.mode='focus'; F.left=F.len||25*60; A.popin('Break over. Next block — what is the one thing?'); } if(location.hash==='#tool-focus') focusView(); } },1000); } else clearInterval(F.t); const b=$('fbtn'); if(b) b.textContent=F.run?'Pause':'Start'; }
  function focusReset(){ clearInterval(F.t); F.run=false; F.mode='focus'; F.left=F.len||25*60; focusView(); }
  function focusLen(m){ F.len=m*60; focusReset(); }
  function mission(k,v){ const Tt=T(); const d=today(); Tt.mission=Tt.mission||{}; const M=Tt.mission[d]||(Tt.mission[d]={}); M[k]=v; if(M.lecture&&M.recall&&M.practice&&M.build&&!M.rewarded){ M.rewarded=true; A.addXP(40,'Daily mission complete'); } A.save(); focusView(); }

  /* ---------- Blurting ---------- */
  function blurtHome(){ let h=`<p class="eyebrow">Toolkit</p><h1 style="margin:0 0 6px">Blurting</h1><p class="muted">Free recall: close the lecture, write everything you remember on a blank page, then compare. The effort of pulling it out of memory is what makes it stick. Pick a lesson you've studied.</p><div class="ilist">`;
    A.allModules().forEach(([p,m])=>{ if(!A.moduleDone(m.id)&&!(A.S.classroom&&A.S.classroom.done&&A.S.classroom.done[m.id])) return; h+=`<a class="item" onclick="GP.go('tool-blurt-${m.id}')"><span class="ix">${String(p.num).padStart(2,'0')}</span><span class="bd"><span class="ti">${esc(m.title)}</span><span class="me">${esc(p.short)}</span></span><span class="tag">▸</span></a>`; });
    if(!A.allModules().some(([p,m])=>A.moduleDone(m.id))) h+=`<p class="muted">Complete a module first — then it appears here.</p>`;
    A.set(h+`</div>`); }
  function blurtView(mid){ const f=A.allModules().find(([p,m])=>m.id===mid); if(!f) return blurtHome(); const [p,m]=f;
    A.set(`<p class="eyebrow">Blurting · ${esc(p.short)}</p><h1 style="margin:0 0 6px;font-size:22px">${esc(m.title)}</h1><p class="muted">Blank page. Write everything you know about this lesson — definitions, numbers, how things connect. No peeking. Then check.</p>
      <div class="holo blurt"><textarea id="blurt" placeholder="Start writing…"></textarea><div class="row" style="margin-top:10px"><button class="btn mg" onclick="TOOLS.blurtCheck('${mid}')">Check what I hit</button><button class="btn ghost" onclick="TOOLS.blurtAda('${mid}')">Ask ADA to grade it</button></div><div id="blurtres" style="margin-top:12px"></div></div>`); }
  function blurtCheck(mid){ const f=A.allModules().find(([p,m])=>m.id===mid); const [p,m]=f; const text=($('blurt').value||'').toLowerCase(); const terms=A.deriveTerms(p,m); const hits=[],miss=[]; terms.forEach(t=>{ const k=t.term.toLowerCase(); (text.includes(k)||text.includes(k.replace(/s$/,'')))?hits.push(t):miss.push(t); });
    const pct=terms.length?Math.round(hits.length/terms.length*100):0; if(pct>=60){ const Tt=A.S.tools=A.S.tools||{}; Tt.blurtPaid=Tt.blurtPaid||{}; if(!Tt.blurtPaid[mid]){ Tt.blurtPaid[mid]=Date.now(); A.addXP(12,'Blurt ≥60%'); } } $('blurtres').innerHTML=`<p class="eyebrow">You covered ${hits.length} of ${terms.length} key terms (${pct}%)</p><p><b class="hit">Hit:</b> ${hits.map(t=>esc(t.term)).join(', ')||'—'}</p><p><b class="miss">Missed:</b> ${miss.map(t=>'<span title="'+esc(t.def)+'">'+esc(t.term)+'</span>').join(', ')||'—'}</p><p class="muted">Now re-read only the missed parts, close it, and blurt again tomorrow.</p>`; }
  function blurtAda(mid){ const f=A.allModules().find(([p,m])=>m.id===mid); const text=($('blurt').value||'').trim(); if(!text) return A.toast('Write first'); GP._lastModule=mid; GP.go('tutor'); setTimeout(()=>GP.quick('I just did a free-recall "blurt" of the module "'+f[1].title+'". Grade it: what did I get right, what is wrong, what important ideas did I leave out? Then ask me one question on the weakest part. Here is my blurt:\n\n'+text.slice(0,3000)),80); }

  /* ---------- Concept maps ---------- */
  function mapsHome(){ let h=`<p class="eyebrow">Toolkit</p><h1 style="margin:0 0 6px">Concept maps</h1><p class="muted">Dual coding: a picture of how a domain's lessons and key terms hang together. Pick a domain.</p><div class="ilist">`;
    A.phases().forEach(p=>{ if(!(p.modules||[]).length) return; h+=`<a class="item" onclick="GP.go('tool-map-${p.id}')"><span class="ix">${String(p.num).padStart(2,'0')}</span><span class="bd"><span class="ti">${esc(p.title)}</span><span class="me">${p.modules.length} lessons</span></span><span class="tag">▸</span></a>`; }); A.set(h+`</div>`); }
  function mapView(pid){ const p=A.phase(pid); if(!p||!window.ILLUS_KIT) return mapsHome(); const K=window.ILLUS_KIT; const mods=p.modules; const n=mods.length; const W=560, H=120+n*118; let s=K.box(W/2-150,12,300,44,p.title,{stroke:K.CY,bold:true,size:12});
    const lastY=80+(n-1)*118+23; s+=K.line(W/2,56,W/2,68,{stroke:K.DIM})+K.line(W/2,68,22,68,{stroke:K.DIM})+K.line(22,68,22,lastY,{stroke:K.DIM});
    mods.forEach((m,i)=>{ const y=80+i*118; const terms=A.deriveTerms(p,m).slice(0,4); s+=K.line(22,y+23,36,y+23,{stroke:K.DIM}); s+=K.box(36,y,224,46,(i+1)+'. '+m.title.replace(/:.*$/,''),{stroke:K.MG,size:11}); terms.forEach((t,j)=>{ const tx=288+(j%2)*136, ty=y-6+Math.floor(j/2)*34; s+=K.line(260,y+23,tx,ty+14,{stroke:K.DIM}); s+=K.box(tx,ty,130,28,t.term,{size:10,stroke:K.LM}); }); });
    A.set(`<p class="eyebrow">Concept map · ${esc(p.short)}</p><h1 style="margin:0 0 6px;font-size:22px">${esc(p.title)}</h1><p class="muted">Each lesson with its first key terms. Tap a lesson in the Path to open it.</p><figure class="fig"><div class="figwrap">${K.svg(W,H,s,'Concept map of '+p.title)}</div><figcaption>Lessons (magenta) and their key terms (green) for this domain.</figcaption></figure><div class="row"><button class="btn ghost" onclick="GP.go('${pid}')">Open domain</button><button class="btn ghost" onclick="GP.go('tool-sheet-${pid}')">Cheat sheet</button></div>`); }

  /* ---------- Cheat sheets ---------- */
  function sheetsHome(){ let h=`<p class="eyebrow">Toolkit</p><h1 style="margin:0 0 6px">Cheat sheets</h1><p class="muted">One page per domain: lesson one-liners, every flashcard, and the glossary terms that belong to it. Copy it, print it from the single-file version, or read it here before an exam.</p><div class="ilist">`;
    A.phases().forEach(p=>{ if(!(p.modules||[]).length) return; h+=`<a class="item" onclick="GP.go('tool-sheet-${p.id}')"><span class="ix">${String(p.num).padStart(2,'0')}</span><span class="bd"><span class="ti">${esc(p.title)}</span><span class="me">${(p.cards||[]).length} cards</span></span><span class="tag">▸</span></a>`; }); A.set(h+`</div>`); }
  function sheetView(pid){ const p=A.phase(pid); if(!p) return sheetsHome(); const gl=A.GLOSSARY.filter(g=>g[2]&&g[2].includes(pid));
    const simple=window.SIMPLE||{};
    A.set(`<div class="row" style="justify-content:space-between"><p class="eyebrow">Cheat sheet · ${esc(p.short)}</p>${FRAMED?`<button class="btn ghost sm" onclick="TOOLS.copySheet()">Copy as text</button>`:`<button class="btn ghost sm" onclick="window.print()">Print / PDF</button>`}</div><h1 style="margin:0 0 6px;font-size:22px">${esc(p.title)}</h1>
      <div class="holo sheet"><h3>Lessons in one line each</h3>${p.modules.map((m,i)=>`<p style="margin:4px 0"><b>${i+1}. ${esc(m.title)}</b> — ${esc((simple[m.id]&&simple[m.id].idea)||m.outcomes[0]||'')}</p>`).join('')}
        <h3>Flashcards</h3><dl>${(p.cards||[]).map(c=>`<dt>${esc(c.front)}</dt><dd>${esc(c.back)}</dd>`).join('')}</dl>
        ${gl.length?`<h3>Glossary</h3><dl>${gl.map(g=>`<dt>${esc(g[0])}</dt><dd>${esc(g[1])}</dd>`).join('')}</dl>`:''}
        ${A.certFor(p)?`<h3>Exam objectives · ${esc(A.CERTS[A.certFor(p)].name)}</h3><p>${A.CERTS[A.certFor(p)].domains.map(esc).join(' · ')}</p>`:''}</div>`); }

  /* ---------- Search ---------- */
  function searchView(q){ A.set(`<p class="eyebrow">Toolkit</p><h1 style="margin:0 0 6px">Search everything</h1><p class="muted" style="margin:0 0 12px">Find any term, command or concept across every lesson, flashcard, glossary entry, certification, lab and field case. Press Enter or tap Search.</p><div class="ask" style="margin-bottom:12px"><input id="srch" placeholder="term, command, concept…" value="${esc(q||'')}" onkeydown="if(event.key==='Enter')TOOLS.search(this.value)"><button class="btn" onclick="TOOLS.search(document.getElementById('srch').value)">Search</button></div><div id="sres" class="ilist res"></div>`); if(q) search(q); else $('srch').focus(); }
  const decEl=document.createElement('textarea');
  function decodeEnt(t){ decEl.innerHTML=String(t||''); return decEl.value; } // lesson text is HTML: turn &amp; etc. back into characters before escaping once
  function hlText(t,rx){ const g=new RegExp('('+rx.source+')','ig'); return String(t).split(g).map((x,i)=>i%2?'<span class="hl">'+esc(x)+'</span>':esc(x)).join(''); }
  function search(q){ q=(q||'').trim(); const box=$('sres'); if(!q){ box.innerHTML=''; return; } const rx=new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'); const out=[];
    A.allModules().forEach(([p,m])=>{ const text=(m.body||'').replace(/<[^>]+>/g,' '); if(rx.test(m.title)||rx.test(text)){ const i=text.search(rx); out.push({k:'Lesson',t:m.title,s:i>=0?text.slice(Math.max(0,i-70),i+90):'',go:m.id,sub:p.short}); } });
    A.allCards().forEach(c=>{ if(rx.test(c.front)||rx.test(c.back)) out.push({k:'Card',t:c.front,s:c.back,go:'deck-'+c.phase,sub:(A.phase(c.phase)||{}).short}); });
    A.GLOSSARY.forEach(g=>{ if(rx.test(g[0])||rx.test(g[1])) out.push({k:'Term',t:g[0],s:g[1],go:null,sub:'glossary'}); });
    Object.entries(A.CERTS||{}).forEach(([id,c])=>{ if(rx.test(c.name)||rx.test(c.code||'')||rx.test(c.blurb||'')) out.unshift({k:'Cert',t:c.name,s:(c.code||'')+' · '+(c.prov||''),go:id,sub:'certification'}); });
    A.phases().forEach(p=>(p.labs||[]).forEach(l=>{ if(rx.test(l.title)||rx.test(l.goal||'')) out.push({k:'Lab',t:l.title,s:l.goal||'',go:'lab-'+l.id,sub:p.short}); }));
    (window.GPM&&GPM.allSc?GPM.allSc():(window.CASES||[])).forEach(c=>{ const tt=c.title||c.t||''; if(rx.test(tt)||rx.test(c.context||'')) out.push({k:'Case',t:tt,s:(c.context||'').slice(0,160),go:'ix-'+c.id,sub:'field case'}); });
    box.innerHTML=out.slice(0,60).map(r=>`<a class="item" ${r.go?`onclick="GP.go('${r.go}')"`:''}><span class="ix">${({Lesson:'📖',Card:'🃏',Cert:'🎓',Lab:'🧪',Case:'🗂'})[r.k]||'🔤'}</span><span class="bd"><span class="ti">${esc(r.t)}</span><span class="me">${hlText(decodeEnt(r.s),rx)}<br><span class="faint">${esc(r.k)} · ${esc(r.sub||'')}</span></span></span></a>`).join('')||`<p class="muted">Nothing matched.</p>`; }

  /* ---------- Thinking tools ---------- */
  const THINK=[
    ['Retrieval practice','Testing yourself beats re-reading by a wide margin. Close the book and pull the answer out; the strain is the learning.','Quiz me on the module I just finished, one question at a time, hardest first.'],
    ['Spaced repetition','Review just before you forget; intervals grow as memory strengthens. The Recall engine does the scheduling — your job is to show up daily.','Which ideas from this module are most likely to fade in a week? Turn them into three flashcards.'],
    ['Interleaving','Mix problem types from different topics in one session so you learn to choose the method, not just execute it. Use the Mixed drill.','Give me five mixed problems that blend this module with an earlier domain.'],
    ['Feynman technique','Explain it in plain words to a smart twelve-year-old. Where you stumble is exactly where you don\'t understand yet. Go back, simplify, repeat.','I will explain this concept simply; find the gaps in my explanation and push me on them.'],
    ['First principles','Strip a problem to the facts you are sure of, then rebuild. "What do I actually know here?" beats analogy when the analogy breaks.','Help me derive this concept from first principles instead of memorizing it.'],
    ['Inversion','Ask how it would fail, break, or be attacked. Engineers and security people think backwards on purpose.','Show me the five ways this would go wrong in practice and how each is caught.'],
    ['Deliberate practice','Work at the edge of your ability with immediate feedback on specific weaknesses. Comfortable repetition is not practice.','Design a 20-minute deliberate-practice session on my weakest skill in this domain.'],
    ['Dual coding','Pair words with pictures. Draw the diagram yourself from memory, then compare with the figure.','Describe the key diagram of this module so I can draw it, then check my description.'],
    ['Elaborative interrogation','Keep asking "why is this true?" and "how does this connect to what I know?" Connection is memory.','Ask me why-questions about this module until I hit something I can\'t explain.'],
    ['Bayesian thinking','Hold beliefs with probabilities; update them with evidence. Troubleshooting is Bayes: the most likely cause first, then revise.','Walk me through diagnosing a problem in this domain as a Bayesian would.'],
    ['Pólya\'s problem solving','Understand the problem → devise a plan → carry it out → look back. Looking back is the step everyone skips.','Give me a hard problem and coach me through Pólya\'s four steps without solving it for me.'],
    ['Rubber-duck debugging','Explain the code or system line by line to an inanimate object. The bug usually surfaces mid-sentence.','Be my rubber duck: I will narrate; only ask clarifying questions.'],
    ['Pomodoro & single-tasking','25 minutes on one thing, phone in another room. Attention is the bottleneck of learning, not time.',null],
    ['Sleep & exercise','Memory consolidates during sleep; aerobic exercise grows the hippocampus. Study hard, then sleep — cramming at 2 a.m. is net negative.',null],
    ['Zettelkasten notes','One idea per note, in your own words, linked to related notes. Over a year it becomes a second brain and a book of your expertise.',null],
    ['Teach to learn','Write the lesson up for someone else (a blog, a README, a friend). The clearest signal you understand something is that you can make someone else understand it.','I want to teach this module to a beginner; critique my lesson plan.']];
  function thinkView(){ A.set(`<p class="eyebrow">Toolkit</p><h1 style="margin:0 0 6px">Thinking tools</h1><p class="muted">The techniques with the strongest evidence behind them, plus the mental models experts actually use. Each one has a button that applies it to whatever you are studying right now, with ADA.</p>
      ${THINK.map(([t,d,p])=>`<div class="holo" style="margin-bottom:10px"><div class="ti" style="font-weight:600">${esc(t)}</div><p class="muted" style="margin:4px 0 8px">${esc(d)}</p>${p?`<button class="btn ghost sm" onclick="GP.go('tutor');setTimeout(()=>GP.quick(${JSON.stringify(p).replace(/"/g,'&quot;')}),80)">Apply with ADA ▸</button>`:''}</div>`).join('')}`); }

  /* ---------- Analytics ---------- */
  function statsView(){ const log=A.S.xplog||{}; const days=[...Array(14)].map((_,i)=>{ const dd=new Date(); dd.setDate(dd.getDate()-(13-i)); const d=A.dayKey?A.dayKey(dd):dd.toISOString().slice(0,10); return [d,log[d]||0]; }); const mx=Math.max(1,...days.map(x=>x[1]));
    const exams=A.phases().filter(p=>A.S.exams[p.id]).length; const mist=Object.keys(A.S.mist||{}).length; const cls=Object.keys((A.S.classroom&&A.S.classroom.done)||{}).length; const focus=Object.values((A.S.tools&&A.S.tools.focus)||{}).reduce((a,b)=>a+(Number(b)||0),0);
    const byDom=A.phases().map(p=>{ const miss=Object.values(A.S.mist||{}).filter(x=>(x.src||'').includes(p.id)).length; const done=(p.modules||[]).filter(m=>A.moduleDone(m.id)).length; return {p,miss,done}; }).filter(x=>x.done||x.miss).sort((a,b)=>b.miss-a.miss);
    A.set(`<p class="eyebrow">Toolkit</p><h1 style="margin:0 0 6px">Study analytics</h1>
      <div class="holo"><p class="eyebrow">XP per day · last 14 days</p><div class="bar">${days.map(([d,v])=>`<i title="${d}: ${Number(v)||0} XP" style="height:${Math.round(v/mx*100)}%"></i>`).join('')}</div><div class="row" style="justify-content:space-between;margin-top:6px"><span class="faint">${days[0][0]}</span><span class="faint">today</span></div></div>
      <div class="grid c2" style="margin-top:14px">
        <div class="holo"><p class="eyebrow">Streak</p><div class="big" style="color:var(--amber)">${A.S.streak||0}</div></div>
        <div class="holo"><p class="eyebrow">Level · XP</p><div class="big" style="color:var(--cyan)">${A.level()} · ${A.S.xp}</div></div>
        <div class="holo"><p class="eyebrow">Modules · exams mastered</p><div class="big">${Object.keys(A.S.done||{}).length} · ${exams}</div></div>
        <div class="holo"><p class="eyebrow">Cards learned · due</p><div class="big">${Object.keys(A.S.srs||{}).length} · ${A.dueCards().length}</div></div>
        <div class="holo"><p class="eyebrow">Open mistakes</p><div class="big" style="color:${mist?'var(--mag)':'var(--ok)'}">${mist}</div></div>
        <div class="holo"><p class="eyebrow">Classroom lessons · focus blocks</p><div class="big">${cls} · ${focus}</div></div></div>
      <div class="holo" style="margin-top:14px"><p class="eyebrow">Weakest domains (open mistakes)</p>${byDom.length?byDom.slice(0,8).map(x=>`<div class="row" style="justify-content:space-between;margin:4px 0"><span>${esc(x.p.title)}</span><span class="mono" style="color:${x.miss?'var(--mag)':'var(--ok)'}">${x.miss} open · ${x.done}/${(x.p.modules||[]).length} done</span></div>`).join(''):'<p class="muted">Start studying and this fills in.</p>'}</div>`); }

  /* ---------- Socratic mode ---------- */
  function socraticView(){ const on=!!A.S.socratic; A.set(`<p class="eyebrow">Toolkit</p><h1 style="margin:0 0 6px">Socratic mode</h1><p class="muted">When it's on, ADA stops handing you answers and instead asks the question that leads you to the next step — the way a great tutor runs office hours. Harder, slower, and far better for understanding. Turn it off when you just need a fact.</p>
      <div class="holo center"><div class="big" style="color:${on?'var(--ok)':'var(--dim)'}">${on?'ON':'OFF'}</div><button class="btn ${on?'ghost':'mg'}" onclick="TOOLS.socratic(${on?'false':'true'})">${on?'Turn off':'Turn on'}</button></div>`); }
  function socratic(v){ A.S.socratic=!!v; A.save(); A.toast('Socratic mode '+(v?'on':'off')); socraticView(); }

  /* ---------- registration ---------- */
  const R=(re,fn,nav)=>V.push({test:h=>re.test(h),nav:nav||'labs',render:(h,api)=>{ A=api; fn(h); }});
  R(/^tools$/,()=>toolsHome(),'labs');
  R(/^tool-backup$/,()=>backupView()); R(/^tool-drill$/,()=>drillView()); R(/^tool-mistakes$/,()=>mistakesView()); R(/^tool-sim$/,()=>simView());
  R(/^tool-focus$/,()=>focusView(),'home'); R(/^tool-blurt$/,()=>blurtHome()); R(/^tool-blurt-/,h=>blurtView(h.slice(11)));
  R(/^tool-maps$/,()=>mapsHome()); R(/^tool-map-/,h=>mapView(h.slice(9))); R(/^tool-sheets$/,()=>sheetsHome()); R(/^tool-sheet-/,h=>sheetView(h.slice(11)));
  R(/^tool-search/,h=>searchView(decodeURIComponent(h.split('=')[1]||''))); R(/^tool-think$/,()=>thinkView()); R(/^tool-stats$/,()=>statsView(),'home'); R(/^tool-socratic$/,()=>socraticView(),'tutor');
  window.GP_HOME_EXTRA=window.GP_HOME_EXTRA||[];
  window.GP_HOME_EXTRA.push(api=>{ const mist=Object.keys(api.S.mist||{}).length; return `<div class="holo" style="margin-top:14px"><p class="eyebrow">Genius tools</p><div class="row"><button class="btn ghost sm" onclick="GP.go('tool-focus')">⏱ Focus &amp; mission</button><button class="btn ghost sm" onclick="GP.go('tool-drill')">🎯 Mixed drill</button><button class="btn ghost sm" onclick="GP.go('tool-mistakes')">📓 Mistakes${mist?' ('+mist+')':''}</button><button class="btn ghost sm" onclick="GP.go('tool-sim')">🏁 Exam sim</button><button class="btn ghost sm" onclick="GP.go('tools')">All tools ▸</button></div></div>`; });
  window.TOOLS={exportFile,copyBackup,showBackup,copySheet,importBackup,pickQ,nextQ,finishQ,drill,retryMistakes,clearMistakes,sim,focusToggle,focusReset,focusLen,mission,blurtCheck,blurtAda,search,socratic};
})();
