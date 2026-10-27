/* Live curriculum audit. Inventory is calculated from the loaded runtime registries.
   Structural coverage is intentionally distinguished from factual review and browser verification. */
(function(){
  const A=()=>window.GP_API;
  const esc=s=>A().esc(String(s==null?'':s));
  const https=s=>/^https:\/\//i.test(String(s||''));
  const listFor=id=>(A()&&A().LISTEN&&A().LISTEN[id])||(window.EXTRA_LISTEN&&window.EXTRA_LISTEN[id])||[]; // LISTEN is the engine's merged list (built-in + added)
  function view(){
    const phases=A().phases()||[];
    const simple=window.SIMPLE||{}, illus=window.ILLUS||{}, labx=window.LABX||{}, lq=window.LQ||{}, certs=window.EXTRA_CERTS||{};
    const cases=window.CASES||[];
    const caseDomains=new Set(cases.flatMap(c=>c.domains||[]));
    const rows=phases.map(p=>{
      const modules=p.modules||[];
      const chars=modules.reduce((n,m)=>n+(m.body||'').replace(/<[^>]*>/g,' ').length,0);
      const figs=modules.reduce((n,m)=>n+((illus[m.id]||[]).length),0);
      const labs=p.labs||[];
      const quizCount=modules.reduce((n,m)=>n+((lq[m.id]||[]).length),0);
      const practice=modules.reduce((n,m)=>n+((m.problems||[]).length),0);
      const resources=listFor(p.id);
      const videos=resources.filter(x=>/video|lecture|webinar|youtube|recorded talk/i.test([x.ty,x.t].join(' ')));
      const cert=Object.values(certs).filter(c=>c.ph===p.id);
      return {p,modules,chars,figs,labs,quizCount,practice,cards:(p.cards||[]).length,exam:(p.exam||[]).length,resources,videos,cert,
        missingSimple:modules.filter(m=>!simple[m.id]).length,
        missingFigures:modules.filter(m=>(illus[m.id]||[]).length<3).length,
        missingQuiz:modules.filter(m=>(lq[m.id]||[]).length<5).length,
        missingGuides:labs.filter(l=>!labx[l.id]).length,
        shortLessons:modules.filter(m=>(m.body||'').replace(/<[^>]*>/g,' ').trim().length<5000).length};
    });
    const sum=k=>rows.reduce((n,r)=>n+(typeof k==='function'?k(r):(r[k]||0)),0);
    const lessons=sum(r=>r.modules.length), allLabs=sum(r=>r.labs.length);
    const missingGuides=sum('missingGuides'), missingFigures=sum('missingFigures'), missingQuizzes=sum('missingQuiz');
    const certEntries=Object.entries(certs);
    const certMissing=certEntries.filter(([_,c])=>!c.checked||!Array.isArray(c.sources)||!c.sources.length||c.sources.some(s=>!https(s)));
    const certNeedsReview=certEntries.filter(([_,c])=>/unverified|not verified|could not be confirmed|could not be retrieved|check before you buy|confirm the current/i.test([c.name,c.code,c.blurb].join(' ')));
    const noCase=rows.filter(r=>!caseDomains.has(r.p.id));
    const noVideo=rows.filter(r=>r.videos.length===0);
    const noResource=rows.filter(r=>r.resources.length===0);
    const thin=rows.flatMap(r=>r.modules.filter(m=>(m.body||'').replace(/<[^>]*>/g,' ').trim().length<5000).map(m=>({domain:r.p,lesson:m,chars:(m.body||'').replace(/<[^>]*>/g,' ').trim().length}))).sort((a,b)=>a.chars-b.chars);
    const h=`<p class="eyebrow">Live curriculum audit · measured from loaded source data</p>
      <h1 style="margin:0 0 6px">Audit &amp; improvement plan</h1>
      <p class="muted" style="margin:0 0 14px">This page measures the source's structure and instructional assets at runtime. It does not certify the factual correctness of every paragraph, prove that every external link is live, or substitute for a full interactive browser/accessibility test.</p>
      <div class="grid c2" style="margin-bottom:14px">
        <div class="holo"><p class="eyebrow">Live inventory</p><p style="margin:0;line-height:1.8"><b>${phases.length}</b> domains · <b>${lessons}</b> lessons<br><b>${Math.round(sum(r=>r.modules.reduce((n,m)=>n+(m.minutes||0),0))/60)}</b> stated lesson-hours<br><b>${sum('figs')}</b> figures · <b>${allLabs}</b> labs<br><b>${sum('exam')}</b> exam items · <b>${sum('cards')}</b> flashcards<br><b>${sum('practice')}</b> lesson practice prompts · <b>${certEntries.length}</b> credential tracks</p></div>
        <div class="holo"><p class="eyebrow">Structural quality gates</p><p style="margin:0;line-height:1.8">Lessons without beginner explanations: <b>${sum('missingSimple')}</b><br>Lessons with fewer than 3 figures: <b>${missingFigures}</b><br>Lessons with fewer than 5 quiz questions: <b>${missingQuizzes}</b><br>Labs without structured guides: <b>${missingGuides}</b><br>Credentials missing dated HTTPS sources: <b>${certMissing.length}</b><br>Credential tracks with explicitly unverified claims: <b>${certNeedsReview.length}</b><br>Domains without a mapped field case: <b>${noCase.length}</b><br>Domains without an explicit video/lecture resource: <b>${noVideo.length}</b></p></div>
      </div>
      <div class="holo" style="margin-bottom:14px"><p class="eyebrow">Mastery loop</p><ol style="margin:0;padding-left:20px;line-height:1.7"><li><b>Retrieve:</b> attempt a pre-test from memory and record confidence before studying.</li><li><b>Model:</b> draw the mechanism, name assumptions and predict behavior before running a tool.</li><li><b>Study:</b> compare a worked example with the underlying rule; explain why alternatives fail.</li><li><b>Practice:</b> complete a lab from a clean start and preserve reproducible evidence.</li><li><b>Diagnose:</b> solve an unfamiliar employer-style incident with ranked hypotheses and falsifying tests.</li><li><b>Transfer:</b> solve a changed scenario without copying the original procedure.</li><li><b>Retain:</b> retrieve again after a delay; requeue missed concepts at shorter intervals.</li><li><b>Prove:</b> publish a sanitized portfolio artifact with tests, limitations, trade-offs and a clear README.</li></ol></div>
      <div class="holo" style="margin-bottom:14px"><p class="eyebrow">Release blockers and improvement priorities</p><ul style="margin:0;padding-left:18px;line-height:1.65"><li><b>Media coverage:</b> ${noVideo.length?`${noVideo.length} domains need an explicit audiovisual resource: ${noVideo.map(r=>esc(r.p.short||r.p.title)).join(', ')}.`:'Every domain has at least one explicit video, lecture or recorded-talk resource in the loaded resource catalogue.'} A link is a pointer, not proof of accessibility, caption quality or continued availability.</li><li><b>Lesson depth:</b> ${thin.length} lessons have fewer than 5,000 characters of body text. Treat this as a triage list, not a quality score; short lessons can be excellent when paired with derivations, labs and transfer tasks.</li><li><b>Technical correctness:</b> every rapidly changing claim (versions, prices, benchmarks, APIs, threat guidance and platform features) needs an issuer/primary-source citation and a dated review. Static QA cannot validate a factual statement.</li><li><b>Certification integrity:</b> ${certNeedsReview.length} tracks contain explicitly unverified or issuer-unconfirmed claims. Treat those fields as unresolved; check exact credential names, current exam codes, prerequisites, fees, renewal and official objectives with the issuer before exam purchase. An HTTPS URL and a date establish traceability, not correctness. Certification is not academic credit or accreditation.</li><li><b>Browser verification:</b> run the included Playwright smoke test in an environment with the dependency and browser installed. A blocked browser launch is an unrun test, not a pass.</li><li><b>Accessibility:</b> manually test keyboard-only use, visible focus, screen-reader names/states, contrast, reduced motion, zoom/reflow, captions/transcripts and touch targets.</li></ul></div>
      <p class="eyebrow">Domain-by-domain coverage</p>
      <div class="holo" style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr style="text-align:left"><th style="padding:5px">Domain</th><th>Lecture text</th><th style="text-align:right">Lessons</th><th style="text-align:right">Figures</th><th style="text-align:right">Labs</th><th style="text-align:right">Quiz gaps</th><th style="text-align:right">Media</th><th style="text-align:right">Case</th></tr></thead><tbody>${rows.map(r=>{const k=Math.round(r.chars/1000),w=Math.min(100,Math.round(r.chars/Math.max(1,...rows.map(x=>x.chars))*100));return `<tr style="border-top:1px solid var(--line,rgba(255,255,255,.08))"><td style="padding:6px;white-space:nowrap"><a onclick="GP.go('${r.p.id}')" style="cursor:pointer">${String(r.p.num||'').padStart(2,'0')} ${esc(r.p.short||r.p.title)}</a></td><td style="min-width:115px"><div style="height:7px;border-radius:4px;background:rgba(127,127,127,.18)"><div style="height:7px;border-radius:4px;width:${w}%;background:${r.chars<30000?'var(--amber)':'var(--cyan)'}"></div></div><span class="faint" style="font-size:11px">${k}k chars</span></td><td style="text-align:right">${r.modules.length}</td><td style="text-align:right;color:${r.missingFigures?'var(--amber)':'inherit'}">${r.figs}</td><td style="text-align:right">${r.labs.length}</td><td style="text-align:right;color:${r.missingQuiz?'var(--amber)':'inherit'}">${r.missingQuiz}</td><td style="text-align:right;color:${r.videos.length?'var(--ok)':'var(--amber)'}">${r.videos.length}</td><td style="text-align:right;color:${caseDomains.has(r.p.id)?'var(--ok)':'var(--amber)'}">${caseDomains.has(r.p.id)?'Yes':'No'}</td></tr>`}).join('')}</tbody></table></div>
      <div class="holo" style="margin-top:14px"><p class="eyebrow">Shortest lecture bodies · review candidates</p>${thin.length?`<p class="muted">${thin.slice(0,20).map(x=>`<a onclick="GP.go('${x.lesson.id}')" style="cursor:pointer">${esc(x.domain.short||x.domain.title)} — ${esc(x.lesson.title)} (${x.chars.toLocaleString()} chars)</a>`).join('<br>')}${thin.length>20?`<br>…and ${thin.length-20} more.`:''}</p>`:'<p>No lesson falls below the 5,000-character triage threshold.</p>'}</div>
      <div class="row" style="gap:8px;margin-top:14px"><button class="btn" onclick="GP.go('buildlog')">Build log</button><button class="btn ghost" onclick="GP.go('graph')">Dependency graph</button><button class="btn ghost" onclick="GP.go('mastery')">Mastery dashboard</button><button class="btn ghost" onclick="GP.go('listenall')">Video &amp; listening library</button><button class="btn" onclick="GP.go('advanced-studio')">Advanced Engineering Studio</button></div>`;
    A().set(h);
  }
  window.GP_VIEWS=window.GP_VIEWS||[]; window.GP_VIEWS.push({test:h=>h==='audit',nav:'home',render:()=>view()});
})();
