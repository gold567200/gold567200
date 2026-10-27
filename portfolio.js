/* E. Cumulative engineering portfolio — "The Fieldbook".
   One system the learner builds across the whole curriculum: a small web service, backed by a
   database, containerized and deployed, secured, monitored, and extended with a local AI feature.
   Each milestone names the domains it draws on, a spec, acceptance tests, a code-review checklist,
   documentation requirements and an evidence submission. Milestones unlock as their domains are demonstrated. */
(function(){
  const V=window.GP_VIEWS=window.GP_VIEWS||[];
  const A=()=>window.GP_API; const $=id=>document.getElementById(id);
  const esc=s=>(s==null?"":String(s)).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const dem=id=>window.GPM?GPM.demonstrated(id):true;
  const short=id=>window.GPM?GPM.short(id):id;

  const MS=[
    {id:"m1", t:"Hello, service", need:["p4"], rec:["p3","p20"], lvl:2,
      spec:"A command-line program (Python) that takes input, does something useful, and prints a result with error handling. Put it under version control.",
      why:"Everything later is this, grown up. Start with a clean, tested, version-controlled program.",
      tasks:["A CLI tool (e.g. a subnet calculator, a fiber loss-budget calculator, or a log summarizer).","Argument parsing and input validation.","A README explaining what it does and how to run it.","A Git repo with at least 5 meaningful commits."],
      accept:["Runs without a stack trace on bad input (it prints a helpful message).","`--help` explains usage.","README lets a stranger run it in under 2 minutes."],
      review:["Functions are small and named for what they do.","No duplicated logic.","Errors are handled, not ignored.","No secrets or absolute paths hard-coded."],
      docs:"README with purpose, install, usage, and one example.", evidenceHint:"Paste the repo URL (or the code), the --help output, and a run on good and bad input."},
    {id:"m2", t:"Add a real database", need:["p18","p4"], rec:["p13"], lvl:2,
      spec:"Give your tool persistent storage in SQLite (then try Postgres). Model the data properly, index what you query, and use parameterized queries.",
      why:"Real services remember things. You practise schema design, indexing and safe queries.",
      tasks:["A normalized schema (at least two related tables).","Parameterized queries only — no string-built SQL.","An index on a column you filter/join on, with before/after timing.","A backup-and-restore you actually tested."],
      accept:["Re-running the tool keeps previous data.","`EXPLAIN` shows the index is used.","Injecting a quote in input does not break or expose anything."],
      review:["Primary/foreign keys defined.","No N+1 query pattern.","Migrations or schema file checked into Git.","Transactions wrap multi-step writes."],
      docs:"A schema diagram (text is fine) and the query list.", evidenceHint:"Paste the schema, one parameterized query, and the EXPLAIN output before and after the index."},
    {id:"m3", t:"Put it on the web", need:["p5","p20"], rec:["p2","p44"], lvl:3,
      spec:"Wrap the service in an HTTP API (FastAPI/Flask) and a small, accessible web UI. Define the endpoints, validate inputs, return proper status codes, and write tests.",
      why:"This is the shape of most software jobs: an API, a UI, and tests that keep them honest.",
      tasks:["A REST API with at least 3 endpoints and input validation.","A minimal web UI that is keyboard-navigable and passes a contrast check.","Automated tests (pytest) covering the happy path and one failure path.","An OpenAPI/Swagger description."],
      accept:["Bad requests return 4xx with a clear message, not 500.","Tests pass in CI (next milestone) or locally with one command.","The UI works with the keyboard alone."],
      review:["Endpoints are nouns; verbs are HTTP methods.","No business logic in the view layer.","Secrets come from env vars, not code.","Test names say what they assert."],
      docs:"API reference (OpenAPI) and a one-page architecture sketch.", evidenceHint:"Paste the endpoint list, a passing test run, and a description of the UI (or a link)."},
    {id:"m4", t:"Containerize and automate", need:["p19","p20"], rec:["p3","p17"], lvl:3,
      spec:"Dockerize the app, add a CI pipeline that lints and tests on every push, and make the build reproducible.",
      why:"\"Works on my machine\" ends here. You learn containers, CI/CD and reproducible builds.",
      tasks:["A multi-stage Dockerfile producing a small image.","docker compose bringing up the app and its database.","A GitHub Actions workflow that runs the tests on push.","A pinned dependency file (lockfile)."],
      accept:["`docker compose up` starts the whole stack from scratch.","A failing test makes CI red.","The image is well under 1 GB and has no secrets baked in."],
      review:["Base image is slim/distroless; no unnecessary packages.","Build is cached in layers sensibly.","CI fails closed (a broken build does not deploy).","Least-privilege: the container does not run as root."],
      docs:"A build-and-run guide and the CI badge.", evidenceHint:"Paste the Dockerfile, the compose file, and a link/screenshot-description of a green CI run."},
    {id:"m5", t:"Deploy it", need:["p17","p19"], rec:["p30","p37"], lvl:3,
      spec:"Deploy to a cloud free tier (or your home lab), behind HTTPS, with configuration and secrets managed properly. Write a runbook.",
      why:"Software that isn't deployed isn't finished. You practise cloud, networking and operations.",
      tasks:["A reachable deployment (cloud free tier, a VM, or your home lab) over HTTPS.","Secrets in a secret store or env, never in the repo.","A runbook: how to deploy, roll back, and restart.","Billing alarms (cloud) or resource limits (lab)."],
      accept:["The site is reachable over HTTPS with a valid certificate.","You can roll back to the previous version.","No secret is in the Git history."],
      review:["TLS configured correctly (no mixed content, valid chain).","Firewall/security group is least-privilege.","Backups run and have been restored once.","The runbook works for someone who isn't you."],
      docs:"A runbook and a network diagram (ports, where each piece runs).", evidenceHint:"Paste the URL (or describe the deployment), the TLS check, and your rollback steps."},
    {id:"m6", t:"Secure it", need:["p7","p31","p25"], rec:["p8","p33"], lvl:4,
      spec:"Threat-model the app, fix the OWASP issues that apply, add authentication/authorization done right, and prove it with tests. Authorized testing only, on your own app.",
      why:"Every engineer is now a security engineer. You apply cryptography, app-sec and the law.",
      tasks:["A short threat model (assets, entry points, top risks).","Authentication with properly hashed passwords (Argon2/bcrypt) or OAuth.","Authorization checks on every sensitive endpoint (no IDOR).","A dependency scan and the fixes it prompted."],
      accept:["A user cannot reach another user's data by changing an ID.","Passwords are never stored or logged in plaintext.","Security headers and HTTPS are set; a scan is clean of highs."],
      review:["Input validation server-side, output encoding in the UI.","Secrets rotated; none in logs.","Errors don't leak stack traces to users.","Least-privilege DB account."],
      docs:"The threat model and a note on what you fixed and why.", evidenceHint:"Describe your threat model, the auth approach, and paste a scan summary (your own app only)."},
    {id:"m7", t:"Observe it", need:["p19","p21"], rec:["p37","p26"], lvl:4,
      spec:"Add logging, metrics and alerting. Define what 'healthy' means (SLOs), then break it on purpose and watch your monitoring catch it.",
      why:"You can't operate what you can't see. You practise SRE, logging and incident response.",
      tasks:["Structured logs and a metrics endpoint (Prometheus-style).","A dashboard (Grafana or hosted) for latency, errors and saturation.","One alert tied to an SLO.","A game-day: inject a fault and record what your monitoring showed."],
      accept:["A spike in errors fires the alert.","You can answer 'is it the app, the DB, or the network?' from the dashboards.","Logs let you trace one request end to end."],
      review:["No secrets or PII in logs.","Alerts are actionable, not noisy.","Dashboards show the four golden signals.","The game-day has a written post-incident note."],
      docs:"A monitoring overview and the game-day post-incident note.", evidenceHint:"Describe the dashboards/alert, and paste the post-incident note from your injected fault."},
    {id:"m8", t:"Add an AI feature — locally", need:["p9","p34","p12"], rec:["p35"], lvl:4,
      spec:"Integrate a model into the app — ideally a local one (Ollama/Hermes) — with retrieval over your own data, guardrails, an eval set, and an eye on latency and cost.",
      why:"The capstone of the capstone: a complete app you built, deployed, secured, monitored, and made intelligent — on infrastructure you control.",
      tasks:["A model-backed feature (e.g. natural-language search, summaries, or a help assistant) grounded in your app's data (RAG).","Run it against a local model where feasible; measure latency and memory.","An eval set (10+ cases) and a guardrail against prompt injection.","A fallback for when the model is unavailable."],
      accept:["The feature answers from your data, with citations, not hallucinations.","It degrades gracefully when the model is down.","Your eval set catches a regression if you weaken the prompt."],
      review:["No secrets or user data sent to a third party without consent.","Inputs to the model are validated; outputs are checked.","Latency and cost are measured, not guessed.","The eval set is in the repo and runs."],
      docs:"An architecture doc for the whole system and an AI-feature design note.", evidenceHint:"Describe the feature and the model, paste a few eval results, and link the final repo."}];

  function rec(id){ const s=A().S; s.port=s.port||{}; return s.port[id]||{}; }
  function msUnlocked(m){ return m.need.every(dem); }
  function msDone(m){ return !!rec(m.id).ok; }
  function portView(){ const s=A().S; s.port=s.port||{}; const done=MS.filter(msDone).length;
    let h=`<p class="eyebrow">Level 6 · Independent design & mastery</p><h1 style="margin:0 0 6px">The Fieldbook — your engineering portfolio</h1>
    <p class="muted" style="margin:0 0 12px">One system, built across the whole curriculum. Each milestone draws on the domains you've demonstrated and adds a layer: a program → a database → a web API and UI → containers and CI → a cloud/home-lab deployment → security → monitoring → a local-AI feature. At the end you can point an employer at a complete, deployed, secured, observed, AI-enhanced application you built and can explain end to end.</p>
    <div class="holo" style="margin-bottom:14px"><div class="row" style="justify-content:space-between"><span class="muted">Milestones completed</span><b class="mono" style="color:var(--cyan)">${done}/${MS.length}</b></div><div class="pbar" style="margin-top:8px"><i style="width:${Math.round(done/MS.length*100)}%"></i></div></div>
    <div class="ilist">`;
    MS.forEach((m,i)=>{ const open=msUnlocked(m), d=msDone(m); const need=m.need.filter(x=>!dem(x));
      h+=`<a class="item ${open?'':'lock'}" onclick="GP.go('port-${m.id}')" style="cursor:pointer"><span class="ix">${d?'✓':open?i+1:'🔒'}</span><span class="bd"><span class="row" style="justify-content:space-between"><span class="ti">${esc(m.t)}</span><span class="tag">${m.need.map(x=>esc(short(x).slice(0,6))).join(' ')}</span></span><span class="me">${open?esc(m.spec.slice(0,90))+'…':'Needs: '+need.map(x=>esc(short(x))).join(', ')}</span></span></a>`; });
    h+=`</div>`; A().set(h); }
  function msView(id){ const m=MS.find(x=>x.id===id); if(!m) return portView(); const r=rec(id); const open=msUnlocked(m);
    let h=`<p class="eyebrow">Portfolio milestone · draws on ${m.need.concat(m.rec||[]).map(x=>esc(short(x))).join(', ')}</p><h1 style="margin:0 0 6px">${esc(m.t)}</h1>`;
    if(!open){ h+=`<div class="holo am"><p style="margin:0">Unlocks when you've demonstrated: ${m.need.filter(x=>!dem(x)).map(x=>esc(short(x))).join(', ')}. You can read the spec now and start sketching.</p></div>`; }
    h+=`<div class="holo mg" style="margin-top:12px"><p class="eyebrow">Why this milestone</p><p style="margin:0">${esc(m.why)}</p></div>
      <div class="holo" style="margin-top:12px"><p class="eyebrow">Specification</p><p style="margin:0 0 10px">${esc(m.spec)}</p>
        <p class="eyebrow">Tasks</p><ul class="lecture" style="margin:0">${m.tasks.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
      <div class="grid c2" style="margin-top:12px"><div class="holo"><p class="eyebrow">Acceptance tests</p><ul style="margin:0;padding-left:18px">${m.accept.map(x=>`<li style="margin:4px 0">${esc(x)}</li>`).join('')}</ul></div>
        <div class="holo"><p class="eyebrow">Code-review checklist</p><ul style="margin:0;padding-left:18px">${m.review.map(x=>`<li style="margin:4px 0">${esc(x)}</li>`).join('')}</ul></div></div>
      <div class="holo" style="margin-top:12px"><p class="eyebrow">Documentation required</p><p style="margin:0">${esc(m.docs)}</p></div>
      <div class="holo" style="margin-top:12px"><p class="eyebrow">Submit your milestone (evidence)</p><p class="muted" style="margin:0 0 8px;font-size:13px">${esc(m.evidenceHint)}</p>
        <textarea id="pe" style="min-height:160px;width:100%">${esc(r.text||'')}</textarea>
        <div class="row" style="margin-top:10px"><button class="btn" onclick="PF.submit('${id}')">Submit milestone</button><button class="btn ghost sm" onclick="PF.review('${id}')">Ask ADA to review it</button><span id="pes" class="tag">${r.ok?'Completed '+new Date(r.at).toLocaleDateString():''}</span></div>
        <div id="per" style="margin-top:10px">${r.review?`<div class="holo"><b>ADA's review</b><p style="margin:6px 0 0">${esc(r.review)}</p></div>`:''}</div></div>`;
    A().set(h); }
  function submit(id){ const t=($('pe').value||'').trim(), s=$('pes'); if(t.split(/\s+/).length<40){ s.textContent='Add more detail (40+ words) and your evidence.'; return; }
    const st=A().S; st.port=st.port||{}; const first=!(st.port[id]&&st.port[id].ok); st.port[id]={ok:true,text:t,at:Date.now(),review:st.port[id]&&st.port[id].review}; A().save(); if(first) A().addXP(150,'Portfolio milestone'); s.textContent='Completed ✓'; }
  async function review(id){ const m=MS.find(x=>x.id===id), r=rec(id), out=$('per'); if(!r.text){ out.innerHTML='<p class="muted">Write your submission first.</p>'; return; } out.innerHTML='<p class="muted">ADA is reviewing…</p>';
    let t=null; try{ const fn=await A().getSample(); if(fn){ const rr=await fn([{role:'user',content:A().ADA_SYS+`\n\nReview this portfolio milestone submission as a senior engineer doing code review. Milestone: ${m.t}. Spec: ${m.spec}. Acceptance tests: ${m.accept.join('; ')}. Review checklist: ${m.review.join('; ')}. Submission: """${r.text.slice(0,4000)}""". In under 150 words: does it meet the acceptance tests? Which checklist items are satisfied and which are missing or unclear? Give one concrete next improvement. Plain text.`}],{modelTier:'quick',cache:false}); t=rr&&rr.text; } }catch(e){}
    if(!t){ out.innerHTML='<p class="muted">ADA is offline right now; your submission is saved. Review it yourself against the acceptance tests and checklist above.</p>'; return; }
    const st=A().S; st.port[id].review=t; A().save(); out.innerHTML=`<div class="holo"><b>ADA's review</b><p style="margin:6px 0 0">${esc(t)}</p></div>`; }
  function hasMilestoneFor(pid){ return MS.some(m=>msDone(m)&&m.need.concat(m.rec||[]).includes(pid)); }

  V.push({test:h=>h==='portfolio',nav:'labs',render:portView});
  V.push({test:h=>/^port-m\d+$/.test(h),nav:'labs',render:h=>msView(h.slice(5))});
  window.GPF={hasMilestoneFor};
  window.PF={submit,review};
})();
