/* Mastery engine — dependency graph, practical mastery gate, spaced question review,
   cumulative + integration exams, understanding-vs-completion tracking, next action.
   Plugs into the engine through window.GP_API (available after boot) and window.GP_VIEWS. */
(function(){
  const V=window.GP_VIEWS=window.GP_VIEWS||[];
  const A=()=>window.GP_API;
  const $=id=>document.getElementById(id);
  const esc=s=>(s==null?"":String(s)).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const DAY=864e5, now=()=>Date.now();

  /* ===================== A. THE DEPENDENCY GRAPH =====================
     req = must be DEMONSTRATED (exam + lab evidence + explanation + variation) before the domain unlocks.
     rec = recommended, shown but not enforced. Each edge: [domain, why, [key prerequisite modules]]. */
  const G={
    p1:{lvl:1,req:[],rec:[]},
    p14:{lvl:1,req:[],rec:[]},
    p46:{lvl:1,req:[],rec:[]},
    p26:{lvl:1,req:[],rec:[]},
    p24:{lvl:1,req:[],rec:[["p14","decibel arithmetic for loss budgets",["p14m7"]]]},
    p3:{lvl:1,req:[["p1","an OS manages the CPU, memory and devices you meet in Hardware",["p1m3","p1m4","p1m6"]]],rec:[]},
    p4:{lvl:1,req:[["p1","variables are bytes; data types are binary representations",["p1m1"]]],rec:[["p14","logic and functions",["p14m1"]]]},
    p2:{lvl:1,req:[["p1","bits, encoding and the system bus before bits on a wire",["p1m1","p1m6"]]],rec:[["p24","the physical layer in glass",["p24m1"]]]},
    p23:{lvl:1,req:[["p1","transistors as switches and logic gates",["p1m1","p1m2","p1m7"]]],rec:[["p14","algebra for Ohm's and Kirchhoff's laws",[]]]},
    p5:{lvl:2,req:[["p4","JavaScript builds on programming fundamentals",["p4m2","p4m3","p4m4"]],["p2","HTTP, DNS and TCP carry every page",["p2m4","p2m5"]]],rec:[]},
    p6:{lvl:2,req:[["p4","control flow, functions and data structures",["p4m2","p4m3","p4m4"]]],rec:[]},
    p7:{lvl:2,req:[["p2","you defend what you understand: packets, ports, protocols",["p2m3","p2m4","p2m5"]],["p3","users, permissions, processes and services",["p3m5","p3m6"]]],rec:[]},
    p13:{lvl:2,req:[["p4","you implement every structure in code",["p4m4","p4m6"]],["p14","proofs, counting and logic for analysis",["p14m1","p14m3"]]],rec:[]},
    p15:{lvl:2,req:[["p1","memory, CPU and the system",["p1m3","p1m4"]],["p3","processes, files and the shell",["p3m3","p3m5"]],["p4","programming before C",["p4m1","p4m3"]]],rec:[]},
    p16:{lvl:2,req:[["p1","the hardware Windows manages",["p1m6"]],["p2","DNS, DHCP and addressing behind Active Directory",["p2m3","p2m5"]]],rec:[]},
    p18:{lvl:2,req:[["p4","queries are run from programs",["p4m4","p4m5"]]],rec:[["p13","B-trees and complexity behind indexes",["p13m4"]]]},
    p20:{lvl:2,req:[["p4","you engineer software you can already write",["p4m7"]]],rec:[["p3","the shell and Git on Linux",["p3m3"]]]},
    p22:{lvl:2,req:[["p4","pandas is Python",["p4m4","p4m5"]],["p14","statistics and probability",["p14m5","p14m6"]]],rec:[]},
    p10:{lvl:2,req:[["p2","Wi-Fi and Bluetooth are network links",["p2m2"]],["p3","the Raspberry Pi runs Linux",["p3m3","p3m6"]]],rec:[["p23","GPIO electronics",["p23m3"]]]},
    p29:{lvl:2,req:[["p3","enterprise Linux builds on the Linux core",["p3m3","p3m5","p3m6"]]],rec:[["p2","networking for the server role",["p2m3"]]]},
    p17:{lvl:3,req:[["p2","VPCs are networks: subnets, routes, NAT",["p2m3"]],["p3","cloud servers are Linux",["p3m5","p3m6"]]],rec:[]},
    p19:{lvl:3,req:[["p3","containers are Linux processes with namespaces and cgroups",["p3m5"]],["p20","CI/CD automates Git and tests",["p20m1","p20m2"]]],rec:[["p17","where pipelines deploy",[]]]},
    p25:{lvl:3,req:[["p7","where cryptography fits in security",["p7m2"]],["p14","modular arithmetic and probability",["p14m2","p14m3"]]],rec:[]},
    p27:{lvl:3,req:[["p2","CCNA deepens every networking layer",["p2m2","p2m3","p2m7"]]],rec:[["p24","fiber links under the routers",["p24m5"]]]},
    p30:{lvl:3,req:[["p1","server hardware, power and thermals",["p1m6"]],["p2","lab networking and VLANs",["p2m2","p2m3"]],["p3","hypervisors and guests run Linux",["p3m5"]]],rec:[]},
    p38:{lvl:3,req:[["p1","digital logic and binary representation",["p1m1","p1m2","p1m4"]],["p15","C, memory and how a program runs",["p15m1","p15m2","p15m3"]]],rec:[["p23","logic levels and real digital circuits",["p23m3"]]]},
    p9:{lvl:3,req:[["p4","you build models in Python",["p4m4","p4m6"]],["p14","linear algebra, probability and calculus",["p14m4","p14m5","p14m7"]],["p22","basic machine learning workflow",["p22m4","p22m5"]]],rec:[]},
    p21:{lvl:3,req:[["p7","security fundamentals and incident response basics",["p7m5","p7m6"]],["p3","Linux logs and processes",["p3m5"]]],rec:[["p16","Windows event logs",["p16m6"]]]},
    p8:{lvl:3,req:[["p7","the attacker's and defender's model",["p7m1","p7m4"]],["p5","web applications are most engagements",["p5m6"]]],rec:[["p3","Linux tooling",[]],["p16","Active Directory environments",["p16m4"]]]},
    p36:{lvl:3,req:[["p18","SQL and storage internals",["p18m2","p18m4"]],["p4","pipelines are code",["p4m5"]]],rec:[["p19","containers and orchestration",[]]]},
    p43:{lvl:3,req:[["p3","macOS is Unix underneath",["p3m3","p3m6"]]],rec:[["p16","endpoint management concepts",["p16m5"]]]},
    p11:{lvl:4,req:[["p15","C, memory, calling conventions and binaries",["p15m1","p15m2","p15m3"]],["p7","the legal and security frame",["p7m1"]]],rec:[["p38","the ISA and pipeline under the assembly",["p38m2"]]]},
    p12:{lvl:4,req:[["p9","what a language model is and how inference works",["p9m4","p9m5","p9m6"]],["p3","installing and running services",["p3m5"]],["p2","ports, binding and remote access",["p2m4"]]],rec:[]},
    p28:{lvl:4,req:[["p27","the networks you automate",["p27m2","p27m3"]],["p4","Python for automation",["p4m5","p4m7"]]],rec:[]},
    p31:{lvl:4,req:[["p8","authorized testing methodology and law",["p8m1","p8m2"]],["p5","how web apps are built",["p5m6","p5m7"]]],rec:[["p18","SQL",["p18m2"]],["p20","APIs",["p20m4"]]]},
    p32:{lvl:4,req:[["p7","security fundamentals",["p7m1","p7m6"]]],rec:[]},
    p33:{lvl:4,req:[["p7","controls and risk basics",["p7m7"]]],rec:[]},
    p34:{lvl:4,req:[["p9","transformers, tokens and embeddings",["p9m4","p9m5"]]],rec:[["p12","local model serving",["p12m4"]],["p20","APIs and testing",["p20m2","p20m4"]]]},
    p35:{lvl:4,req:[["p9","models and training",["p9m3"]],["p19","containers, CI/CD and observability",["p19m2","p19m3","p19m7"]]],rec:[["p22","the ML workflow",["p22m5"]]]},
    p39:{lvl:4,req:[["p5","UI and JavaScript fundamentals",["p5m5","p5m6"]],["p20","testing, APIs and design",["p20m2","p20m4"]]],rec:[["p6","OOP for Kotlin and Swift",["p6m3"]]]},
    p40:{lvl:4,req:[["p4","programming",["p4m3","p4m7"]],["p14","vectors, matrices and probability",["p14m4"]]],rec:[["p13","algorithms like A*",["p13m5"]]]},
    p42:{lvl:4,req:[["p10","the radio spectrum and Wi-Fi in practice",["p10m1","p10m2"]]],rec:[["p23","electronics",["p23m1"]],["p24","decibels and the physical layer",["p24m1"]]]},
    p44:{lvl:4,req:[["p5","HTML, CSS and accessibility basics",["p5m2","p5m4"]]],rec:[]},
    p45:{lvl:4,req:[["p26","how IT work is organized and documented",["p26m1","p26m4"]]],rec:[["p20","agile delivery",["p20m6"]]]},
    p47:{lvl:4,req:[["p7","security, privacy and the law",["p7m1","p7m7"]]],rec:[["p2","routing and encryption in transit",["p2m3"]]]},
    p37:{lvl:5,req:[["p2","unreliable networks",["p2m4","p2m7"]],["p13","algorithms and graphs",["p13m5"]],["p18","transactions and storage",["p18m3","p18m4"]]],rec:[["p19","running services",[]]]},
    p41:{lvl:5,req:[["p14","linear algebra and probability",["p14m4","p14m5"]]],rec:[["p25","what quantum breaks in cryptography",["p25m4","p25m6"]],["p38","how classical machines compute",[]]]}
  };
  /* Plain-text fields (exam, cards, problems, checks, misconceptions) are always escaped when shown, so an author's &lt; would
     display literally. Decode the basic entities once at load; HTML fields (body, example) are untouched. */
  (function(){ const ent={'&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'",'&apos;':"'",'&nbsp;':' ','&amp;':'&'};
    const dec=v=>typeof v==='string'&&v.indexOf('&')>-1?v.replace(/&(lt|gt|quot|#39|apos|nbsp|amp);/g,m=>ent[m]):v;
    const decArr=a=>Array.isArray(a)?a.map(x=>typeof x==='string'?dec(x):x):a;
    ((window.BOOTCAMP&&window.BOOTCAMP.phases)||[]).forEach(p=>{
      (p.exam||[]).forEach(q=>{ q.q=dec(q.q); q.options=decArr(q.options); q.why=dec(q.why); if(typeof q.answer==='string') q.answer=dec(q.answer); q.rubric=decArr(q.rubric); });
      (p.cards||[]).forEach(c=>{ c.front=dec(c.front); c.back=dec(c.back); });
      (p.modules||[]).forEach(m=>{ (m.problems||[]).forEach(x=>{ x.q=dec(x.q); x.a=dec(x.a); }); (m.checks||[]).forEach(x=>{ x.q=dec(x.q); x.a=dec(x.a); }); m.misconceptions=decArr(m.misconceptions); });
    }); })();
  /* October 2026 wave: new domains join the graph only when their content is loaded; edges to missing domains are dropped */
  const G2={
    p48:{lvl:1,req:[],rec:[]},
    p50:{lvl:3,req:[["p4","programming fundamentals",["p4m3","p4m5"]],["p5","JavaScript and the web",["p5m3","p5m5"]]],rec:[["p3","the shell",["p3m2","p3m5"]],["p20","software engineering practice",["p20m3"]]]},
    p49:{lvl:4,req:[["p15","C, pointers, memory and the toolchain",["p15m1","p15m2","p15m3"]]],rec:[["p13","data structures and complexity",["p13m2","p13m3"]]]},
    p51:{lvl:5,req:[["p15","C, memory and threads",["p15m2","p15m3"]],["p38","pipelines, caches and the memory hierarchy",["p38m3","p38m4"]]],rec:[["p14","linear algebra",["p14m4"]],["p9","what the GPU is accelerating",[]]]},
    p52:{lvl:4,req:[["p48","trigonometry, derivatives and integrals",["p48m4","p48m5","p48m6"]],["p14","linear algebra and probability",["p14m4","p14m5"]],["p4","Python for the labs",["p4m3"]]],rec:[["p23","sensors, motors and microcontrollers",["p23m3"]],["p42","the radio spectrum",[]]]},
    p53:{lvl:5,req:[["p38","how processors, caches and firmware work",["p38m3","p38m4"]],["p25","keys, signatures and attestation",["p25m3","p25m5"]]],rec:[["p23","embedded hardware",["p23m4"]],["p15","systems programming",["p15m3"]]]},
    p54:{lvl:4,req:[["p26","how IT work is run and documented",["p26m1","p26m4"]]],rec:[["p45","project management",["p45m2"]],["p33","risk, contracts and compliance",["p33m1"]]]}
  };
  const REC2={p14:[["p48","algebra, functions and calculus refresher",["p48m2","p48m3","p48m5"]]],p9:[["p48","derivatives and gradients",["p48m5","p48m7"]],["p51","how the GPU runs the math",["p51m5"]]],p22:[["p48","functions and logs",["p48m3"]]],p40:[["p48","trigonometry and vectors",["p48m4"]]],p12:[["p51","GPU memory and inference performance",["p51m5","p51m7"]]],p26:[["p54","turning skills into a business",[]]]};
  (function(){ const have=new Set(((window.BOOTCAMP&&window.BOOTCAMP.phases)||[]).map(p=>p.id));
    Object.keys(G2).forEach(k=>{ if(have.has(k)) G[k]=G2[k]; });
    Object.keys(REC2).forEach(k=>{ if(G[k]) REC2[k].forEach(e=>{ if(have.has(e[0])&&!G[k].rec.some(x=>x[0]===e[0])) G[k].rec.push(e); }); });
    Object.keys(G).forEach(k=>{ const g=G[k]; g.req=g.req.filter(e=>have.has(e[0])); g.rec=g.rec.filter(e=>have.has(e[0])); g.req.concat(g.rec).forEach(e=>{ const ph=window.BOOTCAMP.phases.find(p=>p.id===e[0]); const ids=new Set((ph.modules||[]).map(m=>m.id)); e[2]=(e[2]||[]).filter(m=>ids.has(m)); }); });
  })();
  const LEVELS=["","Foundations","Core technical competence","Systems integration","Professional specialization","Advanced engineering & research","Independent design & mastery"];
  const ROOTS=Object.keys(G).filter(k=>!G[k].req.length);

  /* ===================== state ===================== */
  function S(){ return A().S; }
  function mx(pid){ const s=S(); s.mx=s.mx||{}; s.mx[pid]=s.mx[pid]||{}; return s.mx[pid]; }
  function save(){ A().save(); }
  function cfg(){ const s=S(); s.gcfg=Object.assign({threshold:85, written:70, cumDelay:7, cumSize:20, retention:[30,90,180], lesson:80}, s.gcfg||{}); return s.gcfg; }
  function threshold(pid){ const c=cfg(); return (c.per&&c.per[pid])||c.threshold; }
  function grandfather(){ // keep anything already started open forever; runs once
    const s=S(); if(s.grand) return; s.grand={};
    A().phases().forEach(p=>{ const started=(p.modules||[]).some(m=>s.done&&s.done[m.id]) || (s.exams&&s.exams[p.id]) || (p.labs||[]).some(l=>s.labs&&s.labs[l.id]);
      if(started) s.grand[p.id]=Date.now(); });
    save();
  }
  function labs(pid){ const p=A().phase(pid); return (p&&p.labs)||[]; }
  function labRec(id){ const s=S(); s.lx=s.lx||{}; return s.lx[id]; }
  function steps(pid){
    const m=mx(pid), s=S(), t=threshold(pid);
    const best=Math.max(m.examBest||0, (s.exams&&typeof s.exams[pid]==='number')?s.exams[pid]:0);
    const lab=labs(pid).map(l=>[l,labRec(l.id)]).find(([l,r])=>r&&r.evidence&&r.reflection);
    return {
      exam:{ok:best>=t, best, t},
      lab:{ok:!!lab, lab:lab&&lab[0], rec:lab&&lab[1]},
      explain:{ok:!!(m.explain&&m.explain.pass), self:!!(m.explain&&m.explain.self), rec:m.explain},
      // varPassed is a permanent record: generating a new variation must not undo a solved step
      variation:{ok:!!(m.varPassed||(m.variation&&m.variation.pass)), self:m.varPassed?!!m.varPassed.self:!!(m.variation&&m.variation.self), rec:m.variation},
      cumulative:{ok:!!(m.cum&&m.cum.pass), rec:m.cum}
    };
  }
  function demonstrated(pid){ const st=steps(pid); return st.exam.ok&&st.lab.ok&&st.explain.ok&&st.variation.ok; }
  function practicalAt(pid){ const st=steps(pid); if(!(st.exam.ok&&st.lab.ok&&st.explain.ok&&st.variation.ok)) return null;
    const ts=[mx(pid).examAt, st.lab.rec&&st.lab.rec.at, st.explain.rec&&st.explain.rec.at, st.variation.rec&&st.variation.rec.at].filter(Boolean); return ts.length?Math.max(...ts):now(); }
  function mastered(pid){ return demonstrated(pid) && steps(pid).cumulative.ok; }
  function unlocked(p){ const id=p.id||p; const g=G[id]; if(!g) return true; const s=S(); if(!s.grand){ try{ grandfather(); }catch(e){} }
    if(s.grand&&s.grand[id]) return true; return g.req.every(([r])=>demonstrated(r)); }
  function stage(pid){ if(!unlocked(pid)) return 'locked'; if(mastered(pid)) return 'mastered'; if(demonstrated(pid)) return 'demonstrated';
    const st=steps(pid); if(st.exam.ok||st.lab.ok||st.explain.ok||st.variation.ok) return 'gate'; const p=A().phase(pid);
    return (p.modules||[]).some(m=>A().moduleDone(m.id))?'studying':'open'; }
  const STAGE_LABEL={locked:'🔒 Locked',open:'Open',studying:'Studying',gate:'Mastery gate',demonstrated:'Demonstrated',mastered:'★ Mastered'};
  const STAGE_CHIP={locked:'',open:'',studying:'',gate:'am',demonstrated:'ok',mastered:'ok'};
  function selfFlag(pid){ const st=steps(pid); return st.explain.self||st.variation.self; }
  function cumDue(pid){ const at=practicalAt(pid); if(at==null) return null; const due=at+cfg().cumDelay*DAY; return due; }
  function retentionDue(pid){ const c=mx(pid).cum; if(!c||!c.pass) return null; const r=mx(pid).ret||{n:0}; const iv=cfg().retention[Math.min(r.n,cfg().retention.length-1)]; return (r.at||c.at)+iv*DAY; }
  function ancestors(pid,acc){ acc=acc||new Set(); (G[pid]?G[pid].req:[]).forEach(([r])=>{ if(!acc.has(r)){ acc.add(r); ancestors(r,acc);} }); return acc; }
  function descendants(pid){ return Object.keys(G).filter(k=>G[k].req.some(([r])=>r===pid)); }
  function topo(){ const order=[], seen=new Set(); const visit=id=>{ if(seen.has(id)) return; seen.add(id); (G[id]?G[id].req:[]).forEach(([r])=>visit(r)); order.push(id); };
    A().phases().slice().sort((a,b)=>(G[a.id]?G[a.id].lvl:9)-(G[b.id]?G[b.id].lvl:9)||a.num-b.num).forEach(p=>visit(p.id)); return order; }
  function short(pid){ const p=A().phase(pid); return p?String(p.num).padStart(2,'0')+' '+p.short:pid; }
  function prereqNames(p){ const g=G[p.id]; return g?g.req.map(([r])=>short(r)):[]; }
  function hours(p){ const mins=(p.modules||[]).reduce((s,m)=>s+(m.minutes||0),0); return Math.round(mins/60*3.5); }

  /* ===================== ADA helper ===================== */
  async function ada(prompt){ try{ const fn=await A().getSample(); if(!fn) return null;
      const r=await fn([{role:'user',content:A().ADA_SYS+"\n\n"+prompt}],{modelTier:'quick',cache:false}); return (r&&r.text)||null; }catch(e){ return null; } }
  function json(t){ if(!t) return null; const m=t.match(/\{[\s\S]*\}/); if(!m) return null; try{ return JSON.parse(m[0]); }catch(e){ return null; } }

  /* ===================== shared quiz renderer ===================== */
  function quizHTML(qs,key){ return qs.map((q,i)=>`<div class="holo q" style="margin-top:12px"><div class="stem" style="white-space:pre-wrap"><b>Q${i+1}.</b> ${esc(q.q)}${q.tag?`<span class="tag" style="margin-left:8px">${esc(q.tag)}</span>`:''}</div>
      ${q.options.map((o,j)=>`<button type="button" class="opt" data-k="${key}" data-q="${i}" data-j="${j}" onclick="GPM.pick('${key}',${i},${j})">${esc(o)}</button>`).join('')}
      <div class="why" id="${key}w${i}" hidden></div></div>`).join(''); }
  const QZ={};
  function pick(key,i,j){ const z=QZ[key]; if(!z||z.done) return; z.picks[i]=j; document.querySelectorAll(`.opt[data-k="${key}"][data-q="${i}"]`).forEach(b=>b.classList.toggle('sel',+b.dataset.j===j)); }
  function grade(key){ const z=QZ[key]; if(!z||z.done) return null; let ok=0; z.done=true; /* each attempt is graded once */ const res=[];
    z.qs.forEach((q,i)=>{ const pk=z.picks[i]; const right=pk===q.answer; if(right) ok++; res.push({q,right,pk});
      document.querySelectorAll(`.opt[data-k="${key}"][data-q="${i}"]`).forEach(b=>{ const jj=+b.dataset.j; if(jj===q.answer) b.classList.add('right'); if(jj===pk&&!right) b.classList.add('wrong'); b.disabled=true; });
      const w=$(key+'w'+i); if(w){ w.hidden=false; w.textContent=q.why||''; } });
    return {ok,n:z.qs.length,pct:Math.round(ok/Math.max(1,z.qs.length)*100),res}; }

  /* ===================== C. question bank + spaced review ===================== */
  function bank(){ const out={}; A().phases().forEach(p=>(p.exam||[]).forEach(q=>{ if(q.type==='mc') out[q.id]=Object.assign({pid:p.id},q); }));
    (window.INTEGRATION||[]).forEach(sc=>(sc.questions||[]).forEach(q=>{ out[q.id]=Object.assign({pid:sc.domains[0],ix:sc.id,domains:sc.domains,tag:'Integration: '+sc.title},q); }));
    (window.CASES||[]).forEach(sc=>(sc.questions||[]).forEach(q=>{ out[q.id]=Object.assign({pid:sc.domains[0],ix:sc.id,domains:sc.domains,tag:'Field case: '+sc.title},q); }));
    const LQ=window.LQ||{}; if(Object.keys(LQ).length){ const mt={}; A().allModules().forEach(([p,m])=>mt[m.id]=[p.id,m.title]);
      Object.keys(LQ).forEach(mid=>{ const t=mt[mid]; if(!t) return; (LQ[mid]||[]).forEach(q=>{ out[q.id]=Object.assign({pid:t[0],mid,tag:'Lesson quiz: '+t[1]},q); }); }); }
    return out; }
  /* ===================== lesson quizzes: understanding per lesson, separate from completion ===================== */
  function lqPass(){ return cfg().lesson||80; }
  function lessonQuizHTML(m){ const qs=(window.LQ||{})[m.id]; if(!qs||!qs.length) return ''; const s=S(); const r=(s.lq||{})[m.id]; const key='lq_'+m.id; QZ[key]={qs,picks:{},done:false};
    return `<div class="holo" style="margin-top:14px" id="lqbox"><p class="eyebrow">Lesson quiz · ${qs.length} questions · tests understanding, not completion</p><p class="muted" style="margin:0 0 4px;font-size:14px">Apply what this lesson taught. ${lqPass()}% or better means you understood it; missed questions come back in spaced review.${r?` Best so far: <b>${Number(r.best)||0}%</b> after ${r.tries} attempt${r.tries===1?'':'s'}.`:''}</p>${quizHTML(qs,key)}<div class="row" style="margin-top:10px;gap:10px;align-items:center"><button class="btn sm" id="lqbtn" onclick="GPM.lqSubmit('${m.id}')">Check answers</button><span id="lqs" class="tag"></span></div></div>`; }
  function lqSubmit(mid){ const z=QZ['lq_'+mid]; if(!z) return; if(z.done) return lqRetry(mid);
    if(Object.keys(z.picks).length<z.qs.length){ $('lqs').textContent='Answer all '+z.qs.length+' first.'; return; }
    const g=grade('lq_'+mid); if(!g) return;
    g.res.forEach(r=>{ schedule(r.q.id,r.right,true); if(!r.right) A().logMiss({id:r.q.id,q:r.q.q,options:r.q.options,answer:r.q.answer,why:r.q.why}); });
    const s=S(); s.lq=s.lq||{}; const prev=s.lq[mid]; const best=Math.max(prev?prev.best:0,g.pct);
    s.lq[mid]={best,last:g.pct,tries:(prev?prev.tries:0)+1,at:now()}; save();
    if(g.pct>=lqPass()&&!(prev&&prev.best>=lqPass())) A().addXP(15,'Lesson understood');
    $('lqs').textContent=g.ok+'/'+g.n+' ('+g.pct+'%) — '+(g.pct>=lqPass()?'understood ✓':'re-read the lesson, then retry');
    const b=$('lqbtn'); if(b) b.textContent='Retry with a fresh attempt'; }
  function lqRetry(mid){ const f=A().allModules().find(([p,m])=>m.id===mid); const box=$('lqbox'); if(!f||!box) return; box.outerHTML=lessonQuizHTML(f[1]); }
  function lqStats(p){ const qsMods=(p.modules||[]).filter(m=>(window.LQ||{})[m.id]); const s=S(); const recs=qsMods.map(m=>(s.lq||{})[m.id]).filter(Boolean);
    return {total:qsMods.length, passed:recs.filter(r=>r.best>=lqPass()).length, avg:recs.length?Math.round(recs.reduce((a,r)=>a+r.best,0)/recs.length):null}; }
  const IVS=[1,3,7,16,35,90,180];
  function qr(){ const s=S(); s.qr=s.qr||{}; return s.qr; }
  function schedule(qid,right,first){ const r=qr(); const cur=r[qid]||{k:-1}; let k;
    if(!right) k=0; else if(first) k=Math.max(2,cur.k); else k=Math.min(IVS.length-1,cur.k+1); // a right answer on a retake never shortens an interval
    const jitter=first&&right?Math.floor(Math.random()*5):0; r[qid]={k,due:now()+(IVS[k]+jitter)*DAY,last:now(),n:(cur.n||0)+1}; }
  function onExam(pid,results,pct){ // called by the engine after a mastery exam is graded
    const m=mx(pid); m.examBest=Math.max(m.examBest||0,pct); if(pct>=threshold(pid)) m.examAt=m.examAt||now(); m.examHist=(m.examHist||[]).concat([{pct,at:now()}]).slice(-10);
    results.forEach(r=>{ if(r.q.type==='mc') schedule(r.q.id,r.right,true); }); save(); }
  function dueQuestions(){ const r=qr(), b=bank(), t=now(); return Object.keys(r).filter(k=>r[k].due<=t&&b[k]&&unlocked(b[k].pid)).map(k=>b[k]); }
  function reviewView(){
    const due=A().shuffle(dueQuestions()).slice(0,15); const cards=A().dueCards().length;
    const cum=topo().filter(pid=>{ const d=cumDue(pid); return d&&d<=now()&&!steps(pid).cumulative.ok; });
    const ret=topo().filter(pid=>{ const d=retentionDue(pid); return d&&d<=now(); });
    let h=`<p class="eyebrow">Spaced review · interleaved</p><h1 style="margin:0 0 6px">Today's review</h1>
      <p class="muted" style="margin:0 0 14px">Questions come back at growing intervals (1 → 3 → 7 → 16 → 35 → 90 → 180 days); a miss sends one back to tomorrow. They are mixed across subjects on purpose, so you practise choosing the right idea.</p>
      <div class="grid c2"><div class="holo"><p class="eyebrow">Questions due</p><div class="big" style="color:var(--cyan)">${dueQuestions().length}</div></div>
      <div class="holo"><p class="eyebrow">Flashcards due</p><div class="big" style="color:var(--mag)">${cards}</div><button class="btn ghost sm" onclick="GP.go('deck-due')" ${cards?'':'disabled'}>Review cards ▸</button></div></div>`;
    if(cum.length||ret.length) h+=`<div class="holo am" style="margin-top:14px"><p class="eyebrow">Cumulative assessments due</p>${cum.map(pid=>`<div class="row" style="justify-content:space-between;margin:6px 0"><span>${esc(short(pid))} — final cumulative exam</span><button class="btn sm" onclick="GP.go('cum-${pid}')">Start ▸</button></div>`).join('')}${ret.map(pid=>`<div class="row" style="justify-content:space-between;margin:6px 0"><span>${esc(short(pid))} — retention check</span><button class="btn sm" onclick="GP.go('cum-${pid}-ret')">Start ▸</button></div>`).join('')}</div>`;
    if(!due.length){ h+=`<div class="holo center" style="margin-top:14px"><p class="eyebrow">Questions</p><div class="big" style="color:var(--ok)">All clear ✓</div><p class="muted">Questions enter this queue when you take mastery exams and integration exams. Missed ones come back tomorrow.</p><button class="btn ghost" onclick="GP.go('ix')">Integration scenarios ▸</button></div>`; A().set(h); return; }
    QZ.rv={qs:due,picks:{},done:false};
    h+=quizHTML(due.map(q=>Object.assign({},q,{tag:q.tag||short(q.pid)})),'rv')+`<div class="holo center" style="margin-top:14px"><button class="btn" id="rvbtn" onclick="GPM.finishReview()">Check answers</button><div id="rvres" style="margin-top:10px"></div></div>`;
    A().set(h);
  }
  function finishReview(){ const g=grade('rv'); if(!g) return; const bt=$('rvbtn'); if(bt){ bt.disabled=true; bt.textContent='Checked'; } g.res.forEach(r=>{ schedule(r.q.id,r.right,false); if(!r.right) A().logMiss({id:r.q.id,q:r.q.q,options:r.q.options,answer:r.q.answer,why:r.q.why,src:'review',pick:r.pk}); });
    A().addXP(g.ok*3,'Review'); save(); $('rvres').innerHTML=`<div class="big">${g.pct}%</div><p class="muted">${g.ok}/${g.n} — missed questions return tomorrow; the rest move to longer intervals.</p>`; }

  /* ===================== cumulative + retention exams ===================== */
  function cumQuestions(pid,size){ const b=bank(); const own=[],pre=[],ix=[]; const anc=ancestors(pid);
    Object.values(b).forEach(q=>{ if(q.ix){ if(q.domains.includes(pid)&&q.domains.some(d=>anc.has(d)||d===pid)) ix.push(q); } else if(q.pid===pid) own.push(q); else if(anc.has(q.pid)) pre.push(q); });
    const sh=A().shuffle; let picked=sh(own).slice(0,Math.ceil(size*0.5)); picked=picked.concat(sh(ix).slice(0,Math.ceil(size*0.2)));
    picked=picked.concat(sh(pre).slice(0,size-picked.length)); if(picked.length<size) picked=picked.concat(sh(own.filter(q=>!picked.includes(q))).slice(0,size-picked.length));
    return sh(picked).map(q=>Object.assign({},q,{tag:q.tag||short(q.pid)})); }
  function cumView(arg){ const ret=/-ret$/.test(arg); const pid=arg.replace(/-ret$/,''); const p=A().phase(pid); if(!p) return A().set('');
    const st=steps(pid); const due=ret?retentionDue(pid):cumDue(pid);
    let h=`<p class="eyebrow">${esc(p.title)}</p><h1 style="margin:0 0 6px">${ret?'Retention check':'Cumulative mastery exam'}</h1>`;
    if(!ret&&!demonstrated(pid)){ h+=`<div class="holo am"><p style="margin:0">Finish the four practical gate steps first (exam, lab evidence, explanation, troubleshooting variation). The cumulative exam then opens ${cfg().cumDelay} days later — the delay is deliberate: it tests what you retained, not what you just read.</p><button class="btn sm" style="margin-top:10px" onclick="GP.go('${pid}')">Back to the domain</button></div>`; return A().set(h); }
    if(due&&due>now()){ h+=`<div class="holo am"><p style="margin:0">Opens on <b>${new Date(due).toLocaleDateString()}</b>. Keep doing your daily review until then.</p></div>`; return A().set(h); }
    const size=ret?12:cfg().cumSize; const qs=cumQuestions(pid,size);
    h+=`<p class="muted">${qs.length} questions mixing this domain (about half), its prerequisites${(window.INTEGRATION||[]).length?' and cross-domain integration scenarios':''}. Pass mark ${threshold(pid)}%. Timed mode is optional.</p>
      <div class="row" style="margin:8px 0"><button class="btn ghost sm" onclick="GPM.timer(${Math.round(qs.length*1.5)})">Start ${Math.round(qs.length*1.5)}-minute timer</button><span id="cumtimer" class="tag"></span></div>`;
    QZ.cum={qs,picks:{},done:false,pid,ret}; h+=quizHTML(qs,'cum')+`<div class="holo center" style="margin-top:14px"><button class="btn" onclick="GPM.finishCum()">Submit</button><div id="cumres" style="margin-top:10px"></div></div>`; A().set(h); }
  let tmr=null; function timer(min){ clearInterval(tmr); const end=now()+min*60000; tmr=setInterval(()=>{ const e=$('cumtimer'); if(!e){ clearInterval(tmr); return; } const s=Math.max(0,Math.round((end-now())/1000)); e.textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0'); if(!s){ clearInterval(tmr); finishCum(); } },500); }
  function finishCum(){ const z=QZ.cum; if(!z||z.done) return; clearInterval(tmr); const g=grade('cum'); const pid=z.pid, m=mx(pid), t=threshold(pid), pass=g.pct>=t;
    g.res.forEach(r=>{ schedule(r.q.id,r.right,false); if(!r.right) A().logMiss({id:r.q.id,q:r.q.q,options:r.q.options,answer:r.q.answer,why:r.q.why,src:'cumulative:'+pid,pick:r.pk}); });
    const weak={}; g.res.filter(r=>!r.right).forEach(r=>{ const k=r.q.ix?'integration':r.q.pid; weak[k]=(weak[k]||0)+1; });
    if(z.ret){ m.ret={n:((m.ret&&m.ret.n)||0)+(pass?1:0),at:now(),last:g.pct,pass}; }
    else { m.cum={pass:pass||!!(m.cum&&m.cum.pass),best:Math.max(g.pct,(m.cum&&m.cum.best)||0),at:pass?now():((m.cum&&m.cum.at)||0),hist:((m.cum&&m.cum.hist)||[]).concat([{pct:g.pct,at:now()}]).slice(-10)}; if(pass) A().addXP(200,'Domain MASTERED'); }
    save(); const wk=Object.keys(weak).map(k=>`${k==='integration'?'integration scenarios':esc(short(k))}: ${weak[k]} missed`).join(' · ');
    $('cumres').innerHTML=`<div class="big" style="color:${pass?'var(--ok)':'var(--amber)'}">${g.pct}%</div><p class="muted">${g.ok}/${g.n}. ${pass?(z.ret?'Retention confirmed; the next check is scheduled further out.':'Domain mastered.'):(z.ret?'Below the bar — this domain is flagged for refresh; its missed questions are in your review queue.':'Not yet. Missed questions are in your review queue; retake when ready.')}</p>${wk?`<p class="muted"><b>Weak areas:</b> ${wk}</p>`:''}`; }

  /* ===================== B. the practical mastery gate ===================== */
  function gatePanel(p){ if(!G[p.id]) return '';
    const st=steps(p.id), sg=stage(p.id), g=G[p.id];
    const row=(ok,label,detail,btn)=>`<div class="row" style="justify-content:space-between;align-items:flex-start;gap:10px;margin:10px 0"><div><b style="color:${ok?'var(--ok)':'var(--txt,#e6f6ff)'}">${ok?'✓':'○'} ${label}</b><div class="muted" style="font-size:13px">${detail}</div></div>${btn||''}</div>`;
    const cd=cumDue(p.id);
    let h=`<div class="holo ${sg==='mastered'?'':'mg'}" style="margin-bottom:14px"><p class="eyebrow">Mastery gate · ${STAGE_LABEL[sg]}${selfFlag(p.id)?' · includes self-assessed steps':''}</p>
      <p class="muted" style="margin:0 0 6px;font-size:14px">Opening lessons doesn't count. Mastery = pass the exam <i>and</i> prove you can do it, explain it, debug it, and still know it a week later. Steps 1–4 unlock the domains that depend on this one.</p>`;
    h+=row(st.exam.ok,'1 · Mastery exam ≥ '+st.exam.t+'%', st.exam.best?('Best: '+st.exam.best+'%'):'Not attempted yet', `<button class="btn sm ${st.exam.ok?'ghost':''}" onclick="GP.go('exam-${p.id}')">${st.exam.best?'Retake':'Take'}</button>`);
    h+=row(st.lab.ok,'2 · A lab, with evidence', st.lab.ok?('Submitted: '+esc(st.lab.lab.title)):'Pick any lab below; submit your output/screenshots-described and a reflection.', '');
    h+=row(st.explain.ok,'3 · Explain why it works', st.explain.ok?(st.explain.self?'Self-assessed against the rubric (ADA was offline)':'Accepted by ADA'):(st.lab.ok?'Write the first-principles explanation of your lab result.':'Unlocks after a lab is submitted.'), st.lab.ok?`<button class="btn sm ${st.explain.ok?'ghost':''}" onclick="GP.go('gate-explain-${p.id}')">${st.explain.ok?'Review':'Start'}</button>`:'');
    h+=row(st.variation.ok,'4 · Troubleshoot a variation', st.variation.ok?(st.variation.self?'Self-assessed against the reference':'Solved, graded by ADA'):'A changed version of the problem with a fault in it. Diagnose it.', `<button class="btn sm ${st.variation.ok?'ghost':''}" onclick="GP.go('gate-var-${p.id}')">${st.variation.ok?'Review':'Start'}</button>`);
    h+=row(st.cumulative.ok,'5 · Cumulative exam (≥'+cfg().cumDelay+' days later)', st.cumulative.ok?('Passed: '+(Number(st.cumulative.rec.best)||0)+'%'):(cd?('Opens '+new Date(cd).toLocaleDateString()+' — mixes this domain with its prerequisites'):'Opens '+cfg().cumDelay+' days after steps 1–4.'), cd&&cd<=now()&&!st.cumulative.ok?`<button class="btn sm" onclick="GP.go('cum-${p.id}')">Start</button>`:'');
    { const fc=caseFor(p.id); if(fc){ const fr=(A().S.ix||{})[fc.id]; h+=`<div class="row" style="justify-content:space-between;align-items:flex-start;gap:10px;margin:12px 0 0;padding-top:10px;border-top:1px solid var(--line)"><div><b style="color:${fr&&fr.pass?'var(--ok)':'var(--txt,#e6f6ff)'}">${fr&&fr.pass?'✓':'◇'} Field case (recommended)</b><div class="muted" style="font-size:13px">${esc(fc.title)} — a real-world problem from this subject${fr&&fr.pass?' · solved':''}</div></div><button class="btn sm ${fr&&fr.pass?'ghost':''}" onclick="GP.go('ix-${fc.id}')">${fr?'Review':'Open'}</button></div>`; } }
    h+=`</div>`;
    // dependency + course identity
    const desc=descendants(p.id);
    h+=`<div class="holo" style="margin-bottom:14px"><p class="eyebrow">Course identity · Level ${g.lvl} — ${LEVELS[g.lvl]}</p>
      <p class="muted" style="margin:0 0 8px;font-size:14px">Estimated study time: <b>~${hours(p)} hours</b> (lectures × 3.5 for labs, practice and review).</p>
      ${miniMap(p.id)}
      <p class="eyebrow" style="margin-top:10px">Prerequisite knowledge checklist</p>
      ${g.req.length?g.req.map(([r,why,mods])=>`<div style="margin:6px 0"><b>${demonstrated(r)?'✓':'○'} ${esc(short(r))}</b> <span class="muted">— ${esc(why)}</span>${mods.length?`<div class="row" style="gap:6px;margin-top:4px">${mods.map(mid=>`<a class="tag" onclick="GP.go('${mid}')" style="cursor:pointer">${esc(modTitle(mid))}</a>`).join('')}</div>`:''}</div>`).join(''):'<p class="muted" style="margin:0">None — this is a starting point.</p>'}
      ${g.rec.length?`<p class="muted" style="margin:8px 0 0;font-size:13px">Recommended alongside: ${g.rec.map(([r,why])=>esc(short(r))+' ('+esc(why)+')').join('; ')}</p>`:''}
      ${desc.length?`<p class="muted" style="margin:8px 0 0;font-size:13px">Demonstrating this unlocks: ${desc.map(d=>esc(short(d))).join(', ')}</p>`:''}
      <p class="eyebrow" style="margin-top:10px">Milestones</p>
      <div class="muted" style="font-size:14px">Beginner — first two lessons ${ms(p,0)} · Intermediate — all lessons + exam ${ms(p,1)} · Advanced — lab, explanation and variation ${ms(p,2)} · Expert — cumulative exam + a portfolio milestone ${ms(p,3)}</div></div>`;
    return h; }
  function ms(p,k){ const mods=p.modules||[], d=mods.filter(m=>A().moduleDone(m.id)).length, st=steps(p.id);
    const ok=[d>=Math.min(2,mods.length), d===mods.length&&st.exam.ok, st.lab.ok&&st.explain.ok&&st.variation.ok, st.cumulative.ok&&window.GPF&&GPF.hasMilestoneFor(p.id)][k]; return ok?'✓':'○'; }
  function modTitle(mid){ const f=A().allModules().find(([p,m])=>m.id===mid); return f?(mid.replace(/^p(\d+)m(\d+)$/,'$1.$2')+' '+f[1].title.split(':')[0]):mid; }
  function miniMap(pid){ const pre=G[pid].req.map(([r])=>r), post=descendants(pid); const W=560, rowY=[24,82,140];
    const place=(ids,y)=>ids.map((id,i)=>({id,x:Math.round((i+0.5)*W/Math.max(ids.length,1)),y}));
    const P=place(pre,rowY[0]), C=[{id:pid,x:W/2,y:rowY[1]}], D=place(post.slice(0,6),rowY[2]);
    const box=(n,hl)=>{ const sg=stage(n.id), col=hl?'var(--mag)':sg==='mastered'||sg==='demonstrated'?'var(--ok)':sg==='locked'?'var(--dim)':'var(--cyan)'; const w=Math.min(118,W/Math.max(pre.length,post.length,1)-8);
      return `<g style="cursor:pointer" onclick="GP.go('${n.id}')"><rect x="${n.x-w/2}" y="${n.y-15}" width="${w}" height="30" rx="7" fill="none" stroke="${col}" stroke-width="${hl?2:1.3}"/><text x="${n.x}" y="${n.y+4}" text-anchor="middle" font-size="10" fill="currentColor">${esc(short(n.id)).slice(0,18)}</text></g>`; };
    const ln=(a,b)=>`<line x1="${a.x}" y1="${a.y+15}" x2="${b.x}" y2="${b.y-15}" stroke="currentColor" stroke-opacity="0.45" stroke-width="1.2" marker-end="url(#mmah)"/>`;
    const H=post.length?166:110;
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Prerequisites and dependents of this domain" style="width:100%;height:auto;display:block;font-family:var(--fbody),sans-serif"><defs><marker id="mmah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>
      ${P.map(a=>ln(a,C[0])).join('')}${D.map(b=>ln(C[0],b)).join('')}${P.map(n=>box(n)).join('')}${box(C[0],true)}${D.map(n=>box(n)).join('')}
      ${pre.length?'':`<text x="${W/2}" y="30" text-anchor="middle" font-size="10" fill="var(--dim)">starting point — no prerequisites</text>`}</svg>`; }

  // step 3: explain
  function explainView(pid){ const p=A().phase(pid), st=steps(pid); if(!p) return;
    const lab=st.lab.lab; let h=`<p class="eyebrow">${esc(p.title)} · Mastery gate step 3</p><h1 style="margin:0 0 6px">Explain why it works</h1>`;
    if(!lab){ h+=`<div class="holo am"><p style="margin:0">Submit a lab with evidence first — the explanation is about <i>your</i> result.</p>${labs(pid).length?`<div class="row" style="margin-top:10px">${labs(pid).slice(0,4).map(l=>`<button class="btn sm" onclick="GP.go('lab-${l.id}')">${esc(l.title)} ▸</button>`).join('')}</div>`:''}</div>`; return A().set(h); }
    const prev=st.explain.rec;
    h+=`<div class="holo"><p class="eyebrow">Your lab</p><b>${esc(lab.title)}</b><p class="muted" style="margin:6px 0 0">${esc(lab.deliverable)}</p></div>
      <div class="holo" style="margin-top:12px"><p class="eyebrow">Write it like you're teaching it (150+ words)</p>
      <ol class="muted" style="margin:0 0 10px;font-size:14px"><li>What you built or observed, concretely.</li><li>Why it works — the mechanism, from first principles, in the terms of this domain.</li><li>What would break it, and how you'd notice.</li><li>How your evidence proves it.</li></ol>
      <textarea id="gx" style="min-height:220px;width:100%">${esc(prev&&prev.text||'')}</textarea>
      <div class="row" style="margin-top:10px"><button class="btn" onclick="GPM.submitExplain('${pid}')">Submit to ADA for grading</button><span id="gxs" class="tag"></span></div>
      <div id="gxr" style="margin-top:10px">${prev&&prev.feedback?`<div class="holo ${prev.pass?'':'am'}"><b>${prev.pass?'Accepted':'Revise'}${prev.self?' (self-assessed)':''}</b><p style="margin:6px 0 0">${esc(prev.feedback)}</p></div>`:''}</div></div>`;
    A().set(h); }
  const RUBRIC=["Describes the concrete result accurately","Explains the mechanism from first principles using correct terms","Identifies at least one realistic failure mode and how to detect it","Ties the claims to the submitted evidence"];
  async function submitExplain(pid){ const t=($('gx').value||'').trim(); const words=t.split(/\s+/).filter(Boolean).length; const s=$('gxs');
    if(words<150){ s.textContent=words+' words — write at least 150.'; return; }
    s.textContent='ADA is reading…'; const st=steps(pid), lab=st.lab.lab, p=A().phase(pid);
    const r=json(await ada(`MASTERY-GATE GRADING. Domain: ${p.title}. Lab: ${lab.title} — deliverable: ${lab.deliverable}. Student's lab evidence: """${(st.lab.rec.evidence||'').slice(0,1500)}""". Student's explanation: """${t.slice(0,4000)}""". Grade against this rubric: ${RUBRIC.join('; ')}. Be strict but fair: accept only if the mechanism is explained correctly and specifically, not just restated. Reply ONLY with JSON: {"pass":true|false,"score":0-100,"feedback":"2-4 sentences: what is right, what is missing or wrong","followup":"one probing question"}`));
    const m=mx(pid);
    const wasPass=!!(m.explain&&m.explain.pass);
    if(r&&typeof r.pass==='boolean'){ const pass=r.pass&&(r.score||0)>=cfg().written; m.explain={text:t,pass:pass||!!(m.explain&&m.explain.pass&&!m.explain.self),score:r.score,feedback:(r.feedback||'')+(r.followup?' Follow-up: '+r.followup:''),at:now(),self:false}; save(); s.textContent=''; explainView(pid); if(pass&&!wasPass) A().addXP(60,'Explanation accepted'); return; }
    // ADA unavailable → honest self-assessment
    s.textContent='';
    $('gxr').innerHTML=`<div class="holo am"><b>ADA is offline</b><p class="muted" style="margin:6px 0">You can self-assess against the rubric; the step will be marked "self-assessed" so your record stays honest. Re-submit to ADA later to upgrade it.</p>${RUBRIC.map((c,i)=>`<label style="display:block;margin:6px 0"><input type="checkbox" class="gxc"> ${esc(c)}</label>`).join('')}<button class="btn sm" onclick="GPM.selfExplain('${pid}')">Record self-assessment</button></div>`; }
  function selfExplain(pid){ const all=[...document.querySelectorAll('.gxc')].every(c=>c.checked); const m=mx(pid);
    if(m.explain&&m.explain.pass&&(!all||!m.explain.self)){ A().toast('Your earlier accepted explanation still counts; the new text was not graded.'); return explainView(pid); }
    m.explain={text:($('gx').value||'').trim(),pass:all,self:true,feedback:all?'Self-assessed: all rubric criteria ticked.':'Self-assessed: not all criteria met — revise and resubmit.',at:now()}; save(); explainView(pid); }

  // step 4: troubleshoot a variation
  async function varView(pid){ const p=A().phase(pid); if(!p) return; const m=mx(pid); const v=m.variation||{};
    let h=`<p class="eyebrow">${esc(p.title)} · Mastery gate step 4</p><h1 style="margin:0 0 6px">Troubleshoot a variation</h1>
      <p class="muted">Same subject, one thing changed, something broken. Diagnose it: say what you think is wrong, which test would confirm it, the fix, and how you'd verify the fix.</p>`;
    if(!v.scenario){ h+=`<div class="holo center"><button class="btn" onclick="GPM.newVariation('${pid}')">Generate my variation</button><div id="gvs" class="muted" style="margin-top:8px"></div></div>`; return A().set(h); }
    h+=`<div class="holo"><p class="eyebrow">Scenario${v.source==='bank'?' · from the problem bank':''}</p><p style="margin:0;white-space:pre-wrap">${esc(v.scenario)}</p>${v.evidence?`<pre style="white-space:pre-wrap;margin:10px 0 0">${esc(v.evidence)}</pre>`:''}</div>
      <div class="holo" style="margin-top:12px"><p class="eyebrow">Your diagnosis</p><textarea id="gv" style="min-height:180px;width:100%">${esc(v.answerText||'')}</textarea>
      <div class="row" style="margin-top:10px"><button class="btn" onclick="GPM.submitVariation('${pid}')">Submit</button><button class="btn ghost sm" onclick="GPM.newVariation('${pid}')">New variation</button><span id="gvs" class="tag"></span></div>
      <div id="gvr" style="margin-top:10px">${v.feedback?`<div class="holo ${v.pass?'':'am'}"><b>${v.pass?'Solved':'Not yet'}${v.self?' (self-assessed)':''}</b><p style="margin:6px 0 0">${esc(v.feedback)}</p>${v.revealed?`<p class="muted" style="margin:8px 0 0"><b>Reference:</b> ${esc(v.reference)}</p>`:''}</div>`:''}</div></div>`;
    A().set(h); }
  async function newVariation(pid){ const p=A().phase(pid), st=steps(pid), m=mx(pid); const s=$('gvs'); if(s) s.textContent='Building a variation…';
    const base=st.lab.lab?('Base it on the lab "'+st.lab.lab.title+'" ('+st.lab.lab.goal+').'):('Base it on this domain\'s core material: '+(p.modules||[]).map(x=>x.title.split(':')[0]).join('; ')+'.');
    const r=json(await ada(`Create ONE troubleshooting variation for a mastery check in the domain "${p.title}". ${base} Keep it a diagnosis/repair problem on systems the learner owns or an authorized lab; no attack procedures. Give realistic symptoms and 4-10 lines of evidence (logs, command output, measurements) that contain the clue, plus one red herring. Do not reveal the cause in the scenario. Reply ONLY with JSON: {"scenario":"2-4 sentences","evidence":"multi-line text","answer":"the cause, the confirming test, the fix and the verification, 60-120 words"}`));
    if(r&&r.scenario&&r.answer){ m.variation={scenario:r.scenario,evidence:r.evidence||'',reference:r.answer,source:'ada',at:0,pass:false}; save(); return varView(pid); }
    // fallback: an unseen problem from the module problem bank, answer hidden until submission
    const pool=[]; (p.modules||[]).forEach(mm=>(mm.problems||[]).forEach(pr=>pool.push(pr))); const used=(m.usedProblems||[]);
    const pr=A().shuffle(pool.filter(x=>!used.includes(x.q)))[0]||A().shuffle(pool)[0];
    if(!pr){ if(s) s.textContent='No problems available.'; return; }
    m.usedProblems=used.concat([pr.q]); m.variation={scenario:pr.q,evidence:'',reference:pr.a,source:'bank',pass:false}; save(); varView(pid); }
  async function submitVariation(pid){ const m=mx(pid), v=m.variation; const t=($('gv').value||'').trim(); const s=$('gvs'); if(t.split(/\s+/).length<25){ s.textContent='Give a fuller diagnosis (25+ words).'; return; }
    v.answerText=t; s.textContent='Grading…';
    const r=json(await ada(`Grade this troubleshooting answer for a mastery gate. Scenario: """${v.scenario}\n${v.evidence}""". Reference solution (hidden from the student): """${v.reference}""". Student answer: """${t.slice(0,3000)}""". Accept if the student identifies the real cause (or an equally valid one supported by the evidence), proposes a test that would confirm it, a correct fix and a verification. Reply ONLY with JSON: {"pass":true|false,"feedback":"2-4 sentences"}`));
    if(r&&typeof r.pass==='boolean'){ const first=!m.varPassed; v.pass=r.pass||v.passPrev; v.passPrev=v.pass; v.feedback=r.feedback; v.self=false; v.revealed=true; v.at=now(); if(r.pass) m.varPassed={at:now(),self:false}; save(); if(r.pass&&first) A().addXP(60,'Variation solved'); return varView(pid); }
    s.textContent=''; v.revealed=true; v.feedback='ADA is offline — compare your answer with the reference below and judge it honestly.'; save(); varView(pid);
    setTimeout(()=>{ const r2=$('gvr'); if(r2) r2.insertAdjacentHTML('beforeend',`<div class="row" style="margin-top:8px"><span class="muted">Did you get the cause, test, fix and verification?</span><button class="btn sm" onclick="GPM.selfVar('${pid}',1)">Yes</button><button class="btn ghost sm" onclick="GPM.selfVar('${pid}',0)">No</button></div>`); },50); }
  function selfVar(pid,ok){ const m=mx(pid), v=m.variation; if(ok&&!m.varPassed) m.varPassed={at:now(),self:true}; v.pass=!!ok; v.self=true; v.feedback=ok?'Self-assessed as solved against the reference.':'Self-assessed as not yet — generate a new variation and try again.'; v.at=now(); save(); varView(pid); }

  /* ===================== lab evidence (replaces "mark complete") ===================== */
  const REAL=/install|terminal|\bvm\b|virtual machine|docker|wireshark|gcc|gdb|\bgit\b|kubectl|packet tracer|proxmox|qiskit|python3?\b|nmap|ssh|powershell|ghidra|splunk|postgres|terraform|ansible|arduino|esp32|raspberry|otdr|sdr|podman|cml|gns3|figma|jira|projectlibre|ollama|hermes|pytorch|jupyter/i;
  function labKind(L){ return REAL.test(JSON.stringify(L))?'real':'design'; }
  /* lab guide: setup, checkpoints, progressive hints, troubleshooting, challenge, reflection (data in window.LABX) */
  function labGuide(L){ const X=(window.LABX||{})[L.id]; if(!X) return ''; const s=S(); const used=(s.lxh&&s.lxh[L.id])||0; const ck=(s.lxc&&s.lxc[L.id])||[];
    const sec=(t,b)=>`<p class="eyebrow" style="margin-top:12px">${t}</p>${b}`;
    let h=`<div class="holo" style="margin-top:14px"><p class="eyebrow">Lab guide${X.time?' · about '+esc(X.time):''}</p>`;
    if(X.safety) h+=`<p style="margin:0 0 8px;font-size:14px;color:var(--amber)">${esc(X.safety)}</p>`;
    if(X.setup&&X.setup.length) h+=sec('Starting conditions & setup',`<ul style="margin:0;padding-left:18px;line-height:1.55">${X.setup.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`);
    if(X.checkpoints&&X.checkpoints.length) h+=sec('Checkpoints — tick each when you see it',X.checkpoints.map((c,i)=>`<label style="display:flex;flex-wrap:nowrap;gap:10px;align-items:flex-start;margin:8px 0;cursor:pointer"><input type="checkbox" ${ck[i]?'checked':''} onchange="GPM.labCheck('${L.id}',${i},this.checked)" style="margin-top:5px;width:18px;height:18px;flex:none"><span style="flex:1;min-width:0">${esc(c)}</span></label>`).join(''));
    if(X.hints&&X.hints.length){ h+=sec(`Hints — reveal only when stuck (${used} of ${X.hints.length} used)`,`<div id="lxh-${L.id}">${X.hints.slice(0,used).map((x,i)=>`<div class="holo" style="margin:6px 0;padding:10px 12px"><b>Hint ${i+1}.</b> ${esc(x)}</div>`).join('')}</div>${used<X.hints.length?`<button class="btn ghost sm" onclick="GPM.labHint('${L.id}')">Show hint ${used+1} of ${X.hints.length}</button>`:''}`); }
    if(X.trouble&&X.trouble.length) h+=sec('Troubleshooting guide',X.trouble.map(t=>`<details style="margin:6px 0"><summary style="cursor:pointer"><b>${esc(t[0])}</b></summary><p style="margin:6px 0 0 14px;font-size:14px"><span class="muted">Likely cause:</span> ${esc(t[1])}<br><span class="muted">Fix:</span> ${esc(t[2])}</p></details>`).join(''));
    if(X.challenge) h+=sec('Challenge extension',`<p style="margin:0">${esc(X.challenge)}</p>`);
    if(X.reflect&&X.reflect.length) h+=sec('Reflection questions (answer in the reflection box below)',`<ol style="margin:0;padding-left:18px;line-height:1.55">${X.reflect.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`);
    return h+`</div>`; }
  function labCheck(id,i,v){ const s=S(); s.lxc=s.lxc||{}; const a=s.lxc[id]=s.lxc[id]||[]; a[i]=!!v; save(); }
  function labHint(id){ const s=S(); s.lxh=s.lxh||{}; const X=(window.LABX||{})[id]; if(!X) return; const n=s.lxh[id]=Math.min((s.lxh[id]||0)+1,X.hints.length); save();
    const box=document.getElementById('lxh-'+id); if(!box) return; box.insertAdjacentHTML('beforeend',`<div class="holo" style="margin:6px 0;padding:10px 12px"><b>Hint ${n}.</b> ${esc(X.hints[n-1])}</div>`);
    const b=box.nextElementSibling; if(b&&b.tagName==='BUTTON'){ if(n>=X.hints.length) b.remove(); else b.textContent=`Show hint ${n+1} of ${X.hints.length}`; }
    const hd=box.previousElementSibling; if(hd) hd.textContent=`Hints — reveal only when stuck (${n} of ${X.hints.length} used)`; }
  function labPanel(L,pp){ const r=labRec(L.id)||{}; const kind=labKind(L); const legacy=A().S.labs&&A().S.labs[L.id];
    return labGuide(L)+`<div class="holo ${kind==='real'?'':'am'}" style="margin-top:14px"><p class="eyebrow">${kind==='real'?'REAL LAB — done on your own machine with real tools':'DESIGN / WRITTEN LAB — produce the artifact described'}</p>
      <p class="muted" style="margin:0 0 8px;font-size:14px">${kind==='real'?'Nothing here is simulated: you run it on your computer, VM or hardware. Paste the actual output (commands + results), describe screenshots, or link a repo. The app checks that real evidence is present; ADA can review it.':'Write the deliverable itself (or link it). It counts toward the mastery gate once submitted with a reflection.'}
      ${kind==='real'?' Need tools set up first? Use the <a onclick="GP.go(\'bench\')" style="cursor:pointer;color:var(--cyan)">Real-tools workbench</a>.':''}</p>
      ${legacy&&!r.evidence?'<p class="muted" style="font-size:13px">You marked this complete before evidence was required — add evidence to count it toward mastery.</p>':''}
      <p class="eyebrow">Evidence</p><textarea id="lxe" class="labev" style="min-height:160px;width:100%" placeholder="Paste command output, measurements, links to your repo, or the written deliverable…">${esc(r.evidence||'')}</textarea>
      <p class="eyebrow" style="margin-top:10px">Reflection — what happened and why?</p><textarea id="lxr" class="labev" style="min-height:100px;width:100%" placeholder="What did you expect, what actually happened, why, and what would you do differently?">${esc(r.reflection||'')}</textarea>
      <div class="row" style="margin-top:10px"><button class="btn" onclick="GPM.submitLab('${L.id}')">${r.evidence?'Update submission':'Submit lab'}</button><button class="btn ghost sm" onclick="GPM.reviewLab('${L.id}')">Ask ADA to review my evidence</button><span id="lxs" class="tag">${r.at?'Submitted '+new Date(r.at).toLocaleDateString():''}</span></div>
      <div id="lxv" style="margin-top:8px">${r.review?`<div class="holo"><b>ADA's review</b><p style="margin:6px 0 0">${esc(r.review)}</p></div>`:''}</div></div>`; }
  function submitLab(id){ const e=($('lxe').value||'').trim(), rf=($('lxr').value||'').trim(); const s=$('lxs');
    const L=findLab(id); const kind=labKind(L);
    if(e.length<120){ s.textContent='Evidence too thin (120+ characters).'; return; }
    if(kind==='real'&&!/[$#>]\s|\n.*\n|https?:\/\/|\d/.test(e)){ s.textContent='Paste real output (commands and results) or a repo link.'; return; }
    if(rf.split(/\s+/).length<30){ s.textContent='Reflection: at least 30 words on what happened and why.'; return; }
    const s0=A().S; s0.lx=s0.lx||{}; const first=!s0.lx[id]; s0.lx[id]=Object.assign(s0.lx[id]||{},{evidence:e,reflection:rf,at:now(),kind,hints:(s0.lxh&&s0.lxh[id])||0});
    s0.labs=s0.labs||{}; if(!s0.labs[id]) s0.labs[id]=now(); save(); if(first) A().addXP(60,'Lab submitted'); s.textContent='Saved ✓ — counts toward the mastery gate.'; }
  async function reviewLab(id){ const L=findLab(id), r=labRec(id); const out=$('lxv'); if(!r||!r.evidence){ out.innerHTML='<p class="muted">Submit evidence first.</p>'; return; } out.innerHTML='<p class="muted">ADA is reviewing…</p>';
    const t=await ada(`Review this lab submission. Lab: ${L.title}. Goal: ${L.goal}. Deliverable: ${L.deliverable}. Evidence: """${r.evidence.slice(0,3000)}""". Reflection: """${r.reflection.slice(0,1500)}""". In under 120 words: does the evidence actually show the deliverable was achieved? What is missing or suspicious? One question to deepen understanding. Plain text.`);
    if(!t){ out.innerHTML='<p class="muted">ADA is offline right now; your submission is saved.</p>'; return; } r.review=t; save(); out.innerHTML=`<div class="holo"><b>ADA's review</b><p style="margin:6px 0 0">${esc(t)}</p></div>`; }
  function findLab(id){ let L=null; A().phases().forEach(p=>(p.labs||[]).forEach(x=>{ if(x.id===id) L=x; })); return L; }

  /* ===================== graph view ===================== */
  function graphView(){ const ps=A().phases(); const byL={}; ps.forEach(p=>{ const l=G[p.id]?G[p.id].lvl:6; (byL[l]=byL[l]||[]).push(p); });
    const cols=Math.max(...Object.values(byL).map(a=>a.length)), W=Math.max(980,cols*98), rowH=130; const pos={}; let y=40;
    Object.keys(byL).sort().forEach(l=>{ const arr=byL[l].sort((a,b)=>a.num-b.num); arr.forEach((p,i)=>{ pos[p.id]={x:Math.round((i+0.5)*W/arr.length),y}; }); y+=rowH; });
    const H=y; let edges='', nodes='', labels='';
    Object.keys(G).forEach(k=>G[k].req.forEach(([r])=>{ const a=pos[r], b=pos[k]; if(a&&b) edges+=`<line x1="${a.x}" y1="${a.y+14}" x2="${b.x}" y2="${b.y-14}" stroke="currentColor" stroke-opacity="0.28" stroke-width="1" marker-end="url(#gah)"/>`; }));
    Object.keys(byL).sort().forEach((l,i)=>{ labels+=`<text x="8" y="${40+i*rowH-22}" font-size="11" fill="var(--amber)" font-weight="700">LEVEL ${l} · ${esc(LEVELS[l]||'')}</text>`; });
    ps.forEach(p=>{ const q=pos[p.id], sg=stage(p.id); const col=sg==='mastered'||sg==='demonstrated'?'var(--ok)':sg==='locked'?'var(--dim)':'var(--cyan)';
      nodes+=`<g style="cursor:pointer" onclick="GP.go('${p.id}')"><rect x="${q.x-42}" y="${q.y-14}" width="84" height="28" rx="6" fill="var(--bg)" stroke="${col}" stroke-width="1.4"/><text x="${q.x}" y="${q.y+4}" text-anchor="middle" font-size="9.5" fill="currentColor">${esc(String(p.num).padStart(2,'0')+' '+p.short).slice(0,15)}</text></g>`; });
    A().set(`<p class="eyebrow">Curriculum dependency graph</p><h1 style="margin:0 0 6px">What builds on what</h1>
      <p class="muted" style="margin:0 0 10px">An arrow means "must be demonstrated first". Green = demonstrated or mastered, cyan = open, grey = locked. Tap a domain to open it. Scroll sideways on a phone.</p>
      <div style="overflow-x:auto;-webkit-overflow-scrolling:touch;border:1px solid var(--line);border-radius:12px"><svg viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="Dependency graph of all ${ps.length} domains by level" style="display:block;font-family:var(--fbody),sans-serif"><defs><marker id="gah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>${labels}${edges}${nodes}</svg></div>
      <div class="holo" style="margin-top:14px"><p class="eyebrow">Level 6 · Independent design & mastery</p><p style="margin:0">Your cumulative engineering portfolio — one system you build, deploy, secure, monitor and extend with AI across the whole curriculum.</p><button class="btn sm" style="margin-top:10px" onclick="GP.go('portfolio')">Open the portfolio ▸</button></div>`); }

  /* ===================== map (path) — grouped by level, stage-aware ===================== */
  function mapView(){ const ps=A().phases(); const t=topo();
    let h=`<p class="eyebrow">Learning path · prerequisite-aware</p><h1 style="margin:0 0 4px">The ${ps.length} domains</h1>
      <p class="muted" style="margin:0 0 10px">A domain unlocks when its prerequisites are <b>demonstrated</b> — exam ≥ ${cfg().threshold}%, a lab with evidence, an accepted explanation and a solved troubleshooting variation. Anything you had already started stays open.</p>
      <div class="row" style="margin-bottom:14px"><button class="btn sm" onclick="GP.go('graph')">Dependency graph ▸</button><button class="btn ghost sm" onclick="GP.go('mastery')">Understanding dashboard</button><button class="btn ghost sm" onclick="GP.go('review')">Today's review</button><button class="btn ghost sm" onclick="GP.go('portfolio')">Portfolio</button><button class="btn ghost sm" onclick="GP.go('careers')">Career & cert paths</button><button class="btn ghost sm" onclick="GP.go('advanced-studio')">Advanced Engineering Studio</button></div>`;
    for(let l=1;l<=5;l++){ const arr=t.map(id=>A().phase(id)).filter(p=>p&&G[p.id]&&G[p.id].lvl===l); if(!arr.length) continue;
      h+=`<p class="eyebrow" style="margin:18px 0 8px">Level ${l} · ${LEVELS[l]}</p><div class="ilist">`;
      arr.forEach(p=>{ const sg=stage(p.id), open=sg!=='locked', prog=Math.round(A().phaseProgress(p)*100); const need=G[p.id].req.filter(([r])=>!demonstrated(r)).map(([r])=>short(r));
        h+=`<a class="item ${open?'':'lock'}" ${open?`onclick="GP.go('${p.id}')"`:`onclick="GP.go('${p.id}')"`} style="cursor:pointer">
          <span class="ix">${open?String(p.num).padStart(2,'0'):'🔒'}</span><span class="bd"><span class="row" style="justify-content:space-between"><span class="ti">${esc(p.title)}</span><span class="chip ${STAGE_CHIP[sg]}">${STAGE_LABEL[sg]}</span></span>
          <span class="me">${open?esc(p.tagline):'Needs: '+esc(need.join(' + '))} · ~${hours(p)} h</span>${open?`<span class="pbar" style="margin-top:8px"><i style="width:${prog}%"></i></span>`:''}</span></a>`; });
      h+=`</div>`; }
    A().set(h); }

  /* ===================== understanding vs completion ===================== */
  function masteryView(){ const ps=topo().map(id=>A().phase(id)).filter(Boolean).filter(p=>stage(p.id)!=='locked');
    const icon=(ok,self)=>ok?(self?'◐':'✓'):'·';
    let h=`<p class="eyebrow">Understanding ≠ completion</p><h1 style="margin:0 0 6px">Mastery dashboard</h1>
      <p class="muted" style="margin:0 0 12px">Left: what you've <i>done</i> (lessons opened and completed, labs submitted). Right: what you've <i>proven</i> (lesson quizzes passed and average best score, exam, explanation, troubleshooting, delayed cumulative exam, retention). ◐ = self-assessed while ADA was offline.</p>
      <div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:13px"><tr style="text-align:left;color:var(--dim)"><th>Domain</th><th>Lessons</th><th>Labs</th><th>Lesson quizzes</th><th>Exam</th><th>Explain</th><th>Variation</th><th>Cumulative</th><th>Stage</th></tr>`;
    ps.forEach(p=>{ const st=steps(p.id), mods=p.modules||[]; const d=mods.filter(m=>A().moduleDone(m.id)).length; const lx=(p.labs||[]).filter(l=>{const r=labRec(l.id); return r&&r.evidence;}).length;
      h+=`<tr style="border-top:1px solid var(--line)"><td><a onclick="GP.go('${p.id}')" style="cursor:pointer">${esc(short(p.id))}</a></td><td>${d}/${mods.length}</td><td>${lx}/${(p.labs||[]).length}</td><td>${(()=>{ const q=lqStats(p); return q.total?(q.passed+'/'+q.total+(q.avg!=null?' · '+q.avg+'%':'')):'·'; })()}</td><td>${st.exam.best?st.exam.best+'%':'·'}</td><td>${icon(st.explain.ok,st.explain.self)}</td><td>${icon(st.variation.ok,st.variation.self)}</td><td>${st.cumulative.ok?(Number(st.cumulative.rec.best)||0)+'%':'·'}</td><td>${STAGE_LABEL[stage(p.id)]}</td></tr>`; });
    h+=`</table></div><div class="holo" style="margin-top:14px"><p class="eyebrow">Gate settings</p>
      <div class="row" style="justify-content:space-between;margin:6px 0"><span>Exam & cumulative pass mark</span><span><input type="range" min="70" max="95" step="1" value="${cfg().threshold}" oninput="GPM.setCfg('threshold',+this.value);this.nextElementSibling.textContent=this.value+'%'"> <b>${cfg().threshold}%</b></span></div>
      <div class="row" style="justify-content:space-between;margin:6px 0"><span>Lesson quiz pass mark</span><span><input type="range" min="60" max="100" step="5" value="${cfg().lesson}" oninput="GPM.setCfg('lesson',+this.value);this.nextElementSibling.textContent=this.value+'%'"> <b>${cfg().lesson}%</b></span></div>
      <div class="row" style="justify-content:space-between;margin:6px 0"><span>Days before the cumulative exam opens</span><span><input type="range" min="3" max="21" step="1" value="${cfg().cumDelay}" oninput="GPM.setCfg('cumDelay',+this.value);this.nextElementSibling.textContent=this.value+' d'"> <b>${cfg().cumDelay} d</b></span></div>
      <p class="faint" style="font-size:12px;margin:8px 0 0">Progress is stored in this browser only (localStorage). Export a backup from Labs → Genius Tools → Backup before switching devices or clearing site data.</p></div>`;
    A().set(h); }
  function setCfg(k,v){ cfg()[k]=v; save(); }

  /* ===================== next recommended action + today's plan ===================== */
  function nextAction(){ const t=topo();
    const cum=t.find(pid=>{ const d=cumDue(pid); return d&&d<=now()&&!steps(pid).cumulative.ok; }); if(cum) return {label:'Cumulative exam due: '+short(cum),why:'It has been '+cfg().cumDelay+'+ days since you demonstrated it — now we test retention.',go:'cum-'+cum};
    const ret=t.find(pid=>{ const d=retentionDue(pid); return d&&d<=now(); }); if(ret) return {label:'Retention check: '+short(ret),why:'A short mixed exam keeps mastered material alive.',go:'cum-'+ret+'-ret'};
    const dq=dueQuestions().length, dc=A().dueCards().length; if(dq>=10) return {label:dq+' review questions due',why:'Spaced retrieval first — it is the highest-value 20 minutes of the day.',go:'review'};
    const gate=t.find(pid=>{ const s=stage(pid); if(s!=='gate'&&s!=='studying') return false; const p=A().phase(pid); return (p.modules||[]).every(m=>A().moduleDone(m.id)); });
    if(gate){ const st=steps(gate); const step=!st.exam.ok?['Take the '+short(gate)+' mastery exam','exam-'+gate]:!st.lab.ok?['Submit a '+short(gate)+' lab with evidence',gate]:!st.explain.ok?['Explain your '+short(gate)+' lab result','gate-explain-'+gate]:['Troubleshoot a '+short(gate)+' variation','gate-var-'+gate];
      return {label:step[0],why:'You finished the lessons; demonstrating it unlocks '+(descendants(gate).length||'the next')+' dependent domain(s).',go:step[1]}; }
    for(const pid of t){ const p=A().phase(pid); if(!p||stage(pid)==='locked'||demonstrated(pid)) continue; const m=(p.modules||[]).find(mm=>!A().moduleDone(mm.id)); if(m) return {label:m.title,why:short(pid)+' · next lesson in dependency order',go:m.id,p,m}; }
    if(dq||dc) return {label:'Review',why:(dq+dc)+' items due',go:'review'};
    return {label:'Portfolio',why:'Every unlocked domain is demonstrated — build.',go:'portfolio'}; }
  function homeCard(){ const n=nextAction(); const dq=dueQuestions().length, dc=A().dueCards().length; const nd=Object.keys(G).filter(demonstrated).length, nm=Object.keys(G).filter(mastered).length;
    return `<div class="holo mg" style="margin-top:14px"><p class="eyebrow">Next recommended action</p><div class="ti" style="font-size:18px;font-weight:600">${esc(n.label)}</div><p class="muted" style="margin:4px 0 12px">${esc(n.why)}</p><button class="btn mg" onclick="GP.go('${n.go}')">Go ▸</button></div>
      <div class="holo" style="margin-top:14px"><p class="eyebrow">Today's plan · about 4–5 hours</p>
      <ol style="margin:0;padding-left:20px;line-height:1.7"><li><b>Review</b> (30–40 min): ${dq} questions + ${dc} cards — <a onclick="GP.go('review')" style="cursor:pointer;color:var(--cyan)">start</a></li><li><b>Learn</b> (60–90 min): the next lesson in dependency order, then its vocabulary check</li><li><b>Do</b> (60–90 min): a real lab on your machine, with evidence</li><li><b>Prove</b> (30 min): the next mastery-gate step</li><li><b>Build</b> (45–60 min): your current portfolio milestone — <a onclick="GP.go('portfolio')" style="cursor:pointer;color:var(--cyan)">open</a></li></ol>
      <p class="muted" style="margin:10px 0 0;font-size:13px">Demonstrated: <b>${nd}</b> · Mastered: <b>${nm}</b> of ${Object.keys(G).length}. Rest days count: one light day a week keeps the pace sustainable.</p>
      <div class="row" style="gap:6px;flex-wrap:wrap;margin-top:10px">${[['map','Roadmap'],['graph','Dependency graph'],['mastery','Mastery'],['ix','Integration'],['careers','Careers & certs'],['audit','Audit & plan'],['buildlog','Build log']].map(([g,t])=>`<button class="btn ghost sm" onclick="GP.go('${g}')">${t}</button>`).join('')}</div></div>`; }

  /* ===================== integration scenario practice ===================== */
  function allSc(){ return (window.INTEGRATION||[]).concat(window.CASES||[]); }
  function caseFor(pid){ return (window.CASES||[]).find(c=>c.domains[0]===pid); }
  function ixHome(){ const X=window.INTEGRATION||[]; const s=A().S; s.ix=s.ix||{};
    let h=`<p class="eyebrow">Cumulative · cross-domain</p><h1 style="margin:0 0 6px">Integration scenarios</h1><p class="muted" style="margin:0 0 12px">Real problems don't respect course boundaries. Each scenario needs several subjects at once: read the evidence, answer the reasoning questions, then write a diagnosis graded against a rubric. A scenario opens when all of its subjects are open.</p>`;
    if(!X.length){ h+=`<div class="holo am"><p style="margin:0">Scenarios are still being written — check back soon.</p></div>`; return A().set(h); }
    h+=`<div class="ilist">`+X.slice().sort((a,b)=>a.level-b.level).map(sc=>ixItem(sc,s)).join('')+`</div>`;
    const C=(window.CASES||[]).slice().sort((a,b)=>((A().phase(a.domains[0])||{}).num||0)-((A().phase(b.domains[0])||{}).num||0));
    if(C.length) h+=`<p class="eyebrow" style="margin-top:18px">Field cases · one per domain</p><p class="muted" style="margin:0 0 10px">A single subject, a real production problem: evidence, reasoning questions and a graded diagnosis. ${C.filter(c=>s.ix[c.id]&&s.ix[c.id].pass).length} of ${C.length} solved.</p><div class="ilist">`+C.map(sc=>ixItem(sc,s)).join('')+`</div>`;
    A().set(h); }
  function ixItem(sc,s){ const open=sc.domains.every(d=>unlocked(d)); const r=s.ix[sc.id];
    return `<a class="item ${open?'':'lock'}" onclick="GP.go('ix-${sc.id}')" style="cursor:pointer"><span class="ix">${r&&r.pass?'✓':open?'L'+sc.level:'🔒'}</span><span class="bd"><span class="ti">${esc(sc.title)}</span><span class="me">${sc.domains.map(d=>esc(short(d))).join(' + ')}</span></span></a>`; }
  function ixView(id){ const sc=allSc().find(x=>x.id===id); if(!sc) return ixHome(); const s=A().S; s.ix=s.ix||{}; const r=s.ix[id]||{};
    const open=sc.domains.every(d=>unlocked(d));
    let h=`<p class="eyebrow">${sc.kind==='case'?'Field case · real-world engineering problem':'Integration scenario'} · level ${sc.level} · ${sc.domains.map(d=>esc(short(d))).join(' + ')}</p><h1 style="margin:0 0 6px">${esc(sc.title)}</h1>`;
    if(!open){ h+=`<div class="holo am"><p style="margin:0">Opens when these are unlocked: ${sc.domains.filter(d=>!unlocked(d)).map(d=>`<a onclick="GP.go('${d}')" style="cursor:pointer;color:var(--cyan)">${esc(short(d))}</a>`).join(', ')}. Open each one to see what it needs.</p></div>`; return A().set(h); }
    h+=`<div class="holo"><p style="margin:0">${esc(sc.context)}</p></div>`+sc.evidence.map(e=>`<div class="holo" style="margin-top:10px"><p class="eyebrow">${esc(e.label)}</p>${(/\n/.test(e.text)&&/ {2,}|\t|\|/.test(e.text))?`<pre class="evpre" style="margin:0;font-size:12.5px">${esc(e.text)}</pre>`:`<pre style="white-space:pre-wrap;margin:0;font-size:12.5px">${esc(e.text)}</pre>`}</div>`).join('');
    QZ['ix_'+id]={qs:sc.questions,picks:{},done:false}; h+=quizHTML(sc.questions,'ix_'+id)+`<div class="row" style="margin-top:10px"><button class="btn sm" onclick="GPM.ixQuiz('${id}')">Check reasoning answers</button><span id="ixq" class="tag"></span></div>`;
    h+=`<div class="holo" style="margin-top:14px"><p class="eyebrow">Your engineering write-up</p><p class="muted" style="margin:0 0 8px">${esc(sc.task.prompt)}</p>
      <details style="margin:0 0 8px"><summary class="muted" style="cursor:pointer">Hints (reveal one at a time)</summary>${sc.hints.map((x,i)=>`<details style="margin:6px 0 0 12px"><summary class="muted" style="cursor:pointer">Hint ${i+1}</summary><p style="margin:4px 0">${esc(x)}</p></details>`).join('')}</details>
      <textarea id="ixt" style="min-height:200px;width:100%">${esc(r.text||'')}</textarea><div class="row" style="margin-top:10px"><button class="btn" onclick="GPM.ixSubmit('${id}')">Submit for grading</button><span id="ixs" class="tag"></span></div>
      <div id="ixr" style="margin-top:10px">${r.feedback?ixResult(sc,r):''}</div></div>`;
    A().set(h); }
  function ixResult(sc,r){ return `<div class="holo ${r.pass?'':'am'}"><b>${r.pass?'Accepted':'Not yet'}${r.self?' (self-assessed)':''}${r.score!=null?' · '+r.score+'/100':''}</b><p style="margin:6px 0 0">${esc(r.feedback)}</p>
      <details style="margin-top:8px"><summary style="cursor:pointer">Rubric, reference solution and alternatives</summary><ul>${sc.task.rubric.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p><b>Reference:</b> ${esc(sc.task.reference)}</p>${(sc.task.alternatives||[]).map(a=>`<p class="muted">Alternative: ${esc(a)}</p>`).join('')}</details></div>`; }
  function ixQuiz(id){ const g=grade('ix_'+id); if(!g) return; g.res.forEach(r=>schedule(r.q.id,r.right,true)); save(); $('ixq').textContent=g.ok+'/'+g.n+' — these questions now join your spaced review.'; }
  async function ixSubmit(id){ const sc=allSc().find(x=>x.id===id); const t=($('ixt').value||'').trim(); const s=$('ixs'); if(t.split(/\s+/).length<80){ s.textContent='Write at least 80 words.'; return; }
    s.textContent='Grading…'; const st=A().S; st.ix=st.ix||{};
    const r=json(await ada(`Grade a cross-domain troubleshooting write-up. Context: ${sc.context}. Evidence: ${sc.evidence.map(e=>e.label+': '+e.text).join(' | ').slice(0,3000)}. Rubric: ${sc.task.rubric.join('; ')}. Reference solution: ${sc.task.reference}. Valid alternatives: ${(sc.task.alternatives||[]).join('; ')}. Student write-up: """${t.slice(0,4000)}""". Reply ONLY with JSON {"pass":true|false,"score":0-100,"feedback":"3-5 sentences, criterion by criterion"}`));
    const prev=st.ix[id], wasPass=!!(prev&&prev.pass);
    if(r&&typeof r.pass==='boolean'){ const pass=r.pass&&(r.score||0)>=cfg().written; st.ix[id]={text:t,pass:pass||wasPass,score:r.score,feedback:r.feedback+(wasPass&&!pass?' (Your earlier accepted write-up still counts.)':''),at:now()}; }
    else if(wasPass){ st.ix[id]=Object.assign({},prev,{draft:t,feedback:'ADA is offline, so this new draft was saved but not graded. Your earlier accepted write-up still counts.'}); }
    else { st.ix[id]={text:t,pass:false,self:true,feedback:'ADA is offline — compare your write-up with the rubric and reference below.',at:now()}; }
    save(); if(st.ix[id].pass&&!wasPass) A().addXP(80,'Scenario solved'); s.textContent=''; $('ixr').innerHTML=ixResult(sc,st.ix[id]); }

  /* ===================== careers & certification paths ===================== */
  const PATHS=[
    {t:"Common core — everyone starts here",role:"The shared foundation under every path below; do these before specializing",d:["p46","p48","p1","p2","p3","p4","p14"],c:["c-learn","c-calc","c-aplus","c-net","c-linux","c-py","c-math"]},
    {t:"IT support",role:"Help desk → desktop support (often the first IT job)",d:["p1","p26","p2","p16","p3"],c:["c-career","c-aplus","c-net"]},
    {t:"Systems administration",role:"Linux/Windows sysadmin, then platform engineer",d:["p3","p29","p16","p30","p19"],c:["c-linux","c-rhcsa","c-win","c-server"]},
    {t:"Networking",role:"Network technician → network engineer (fits your fiber background)",d:["p24","p2","p27","p28","p10","p42"],c:["c-fiber","c-net","c-ccna","c-devnet","c-wireless","c-ham"]},
    {t:"Cybersecurity — defense",role:"SOC analyst → incident responder → threat intel",d:["p7","p21","p25","p32","p33","p47"],c:["c-sec","c-crypto","c-blue","c-osint","c-grc","c-darkweb"]},
    {t:"Cybersecurity — offense (authorized)",role:"Penetration tester → application security → reverse engineer",d:["p7","p8","p31","p11","p15"],c:["c-sec","c-pentest","c-appsec","c-re"]},
    {t:"Software engineering",role:"Developer → senior engineer → architect",d:["p4","p13","p20","p5","p50","p18","p49","p37","p39"],c:["c-py","c-cs","c-swe","c-web","c-ts","c-db","c-cpp","c-mobile","c-kafka"]},
    {t:"Cloud & DevOps",role:"Cloud/DevOps engineer → SRE",d:["p17","p19","p30","p37"],c:["c-cloud","c-devops","c-server"]},
    {t:"Data engineering",role:"Data analyst → data engineer",d:["p22","p18","p36"],c:["c-data","c-db","c-dataeng"]},
    {t:"AI / ML engineering",role:"ML engineer → LLM/AI engineer (local AI infrastructure)",d:["p48","p14","p22","p9","p34","p35","p51","p12"],c:["c-calc","c-math","c-ai","c-llm","c-mlops","c-hpc","c-hermes"]},
    {t:"Hardware & embedded",role:"Electronics/embedded technician → firmware/FPGA engineer → robotics or hardware-security engineer",d:["p1","p23","p38","p15","p52","p51","p53"],c:["c-embedded","c-riscv","c-sys","c-dsp","c-hpc","c-hwsec"]},
    {t:"Technical entrepreneur — IT, security & AI services",role:"Freelancer → consultant → owner of a small MSP / AI-services firm",d:["p26","p45","p54","p33","p17","p34","p12"],c:["c-career","c-pm","c-consult","c-grc","c-cloud","c-llm"]}];
  function careersView(){ const C=A().CERTS;
    let h=`<p class="eyebrow">Certification planning</p><h1 style="margin:0 0 6px">Career paths and the credentials that fit them</h1><p class="muted" style="margin:0 0 12px">Order matters more than count. Each path lists the domains that prepare you and the certifications in a sensible sequence; open any cert for its official facts, objectives mapped to lessons, renewal rules and practice questions. Verify current prices on the provider's site before you book.</p>`;
    PATHS.forEach(P0=>{ const P=Object.assign({},P0,{d:P0.d.filter(d=>A().phase(d))}); h+=`<div class="holo" style="margin-top:12px"><p class="eyebrow">${esc(P.t)}</p><p style="margin:0 0 8px">${esc(P.role)}</p><p class="muted" style="margin:0 0 6px;font-size:13px">Prepare with: ${P.d.map(d=>`<a onclick="GP.go('${d}')" style="cursor:pointer;color:var(--cyan)">${esc(short(d))}</a> <span>${demonstrated(d)?'✓':''}</span>`).join(' → ')}</p>
      <div class="ilist">${P.c.filter(k=>C[k]).map((k,i)=>`<a class="item" onclick="GP.go('${k}')"><span class="ix">${i+1}</span><span class="bd"><span class="ti">${esc(C[k].name)}</span><span class="me" style="display:block">${esc(C[k].code)} · ${esc(C[k].prov)} · ${esc(C[k].level)}</span>${certAgeLine(C[k])}</span><span class="tag">▸</span></a>`).join('')}</div></div>`; });
    { const all=Object.values(C), st=all.filter(c=>{ const a=A().certAge?A().certAge(c):null; return !a||a.stale; }).length, op=all.filter(c=>A().certReviewOpen&&A().certReviewOpen(c)).length;
      h+=`<p class="faint" style="margin:14px 0 0;font-size:13px">${op?`${op} of ${all.length} certification tracks still have an open issuer/source review (marked ⚠). `:''}${st?`${st} were last checked more than three months ago. `:''}Every certification page lists the issuer pages it was checked against; confirm the details there before you book.</p>`; }
    A().set(h); }
  function certAgeLine(c){ const a=A().certAge?A().certAge(c):null; if(!a) return '';
    const open=A().certReviewOpen?A().certReviewOpen(c):false;
    const w=open?'⚠ Issuer review open — confirm every detail before booking':a.days==null?'⚠ Facts not re-checked — confirm before booking':a.stale?'⚠ Facts checked '+A().ageWords(a.days)+' — re-check before booking':'Facts checked '+A().ageWords(a.days);
    return `<span class="me" style="display:block;margin-top:4px;color:${open||a.stale?'var(--amber)':'var(--dim)'}">${esc(w)}</span>`; }

  /* ===================== build log (visible development checklist) ===================== */
  const BUILD=[
    ["done","Audit of all domains (component counts, depth, gaps; 47 at the time, now 54)"],["done","Dependency graph with prerequisite reasons and key lessons; graph view; per-domain map"],["done","Prerequisite-aware unlocking on demonstrated mastery (started domains grandfathered)"],
    ["done","Progression levels 1–6 and study-hour estimates per domain"],["done","Practical mastery gate: exam ≥85% (configurable) + lab evidence + explanation + troubleshooting variation + delayed cumulative exam"],
    ["done","Understanding tracked separately from completion (mastery dashboard)"],["done","Question-level spaced review (1→3→7→16→35→90→180 days) and retention re-checks at 30/90/180 days"],
    ["done","Cumulative exams mixing a domain with its prerequisites; weak-area report"],["done","Cross-domain integration scenarios ("+((window.INTEGRATION||[]).length||0)+" so far): read real evidence from several subjects at once, answer reasoning questions, write a graded diagnosis"],
    ["done","Real vs design lab labelling; lab evidence + reflection; ADA evidence review"],["done","Real-tools workbench with output verification"],
    ["done","In-browser Python and SQLite. Inside the Claude viewer Python runs on Brython and SQLite on sql.js's asm.js build, both loaded as scripts from allowed CDNs (the viewer blocks the extra downloads that Pyodide and WebAssembly SQLite need); the single-file version uses real CPython (Pyodide) and WebAssembly SQLite first (v62)"],
    ["done","Cumulative engineering portfolio (Fieldbook) with milestones, acceptance tests, review criteria and evidence"],["done","Career & certification paths"],["done","Next recommended action and a 4–5 hour daily plan"],
    ["done","Foundation domains rebuilt to the depth of the newer ones: Hardware, Networking, Linux and Coding (lectures 4–5× longer, 3+ figures per module, 24–26-question exams, certification facts re-verified; all existing lessons, labs, questions and progress kept)"],["done","Second wave of foundation upgrades: Web, Java, Cybersecurity and AI (same depth targets, certification facts re-verified)"],["done","Wireless/Pi (p10) rebuilt: Pi engineering, electronics interfacing, Wi-Fi engineering, IoT radios, receive-only SDR; CWNA-110"],["not-feasible","Deeper Reverse Engineering (p11) lectures: the expansion was stopped by safety checks in this build environment (v49, and again in v51), so it is not being pursued further here. p11 has a contributed figure, beginner explanation and safe lab guide per lesson, a re-verified GREM certification entry and vetted free resources"],["done","Pentest (p8) rebuilt as a professional-practice course: 4 to 8 modules (law and rules of engagement, methodology and standards, threat modelling and vulnerability classes, CVSS 4.0/EPSS/KEV, web/cloud/AD assessment as design review, purple teaming), cumulative short-answer exam items, re-verified certification ladder (v49)"],
    ["done","Lab guide engine: setup, tick-off checkpoints, progressive hints (hints used are recorded), troubleshooting guide, challenge extension, reflection questions"],["done","Lab guides for all 282 labs: starting conditions, a checkpoint per step, progressive hints, troubleshooting with real error messages, a challenge extension, reflection questions and safety notes"],["done","Lab guides for the security labs (Pentest, Wireless/Pi, RevEng, AppSec, Threat Intel, Dark Web): setup, isolation, scope, methodology, evidence and the fix; no attack procedures (v48 contributed + v49)"],
    ["done","Field cases: one real-world engineering problem per domain ("+((window.CASES||[]).length||0)+" so far) with real evidence, reasoning questions and a graded diagnosis; linked from each mastery gate and fed into spaced review"],["not-feasible","A field case for Trusted Computing (p53): writing it was stopped by safety checks in this build environment (and again in v51), so that domain relies on its labs and integration scenarios instead"],
    ["planned","Glossary upgrade: pronunciation, related/confused terms, examples, cross-links; searchable"],
    ["done","New domains from the audit: Math Foundations (arithmetic to calculus), C++ & Rust, TypeScript/functional programming/design patterns/shell, Parallel & GPU programming, Signals/control/robotics, Trusted computing & hardware security, Freelancing & IT consulting — each with lab guides and graph prerequisites"],["done","Career paths: a common core everyone starts with, and a technical-entrepreneur path"],
    ["done","Lesson quizzes: 5 scored application questions at the end of every lesson ("+Object.keys(window.LQ||{}).length+" lessons), tracked as understanding separately from completion (adjustable pass mark), missed questions fed into spaced review"],
    ["done","Interactive browser test (v48): 34 checks across 523 routes at phone and desktop width - navigation, lessons, key terms by keyboard, lesson quizzes, labs, flashcards, exams, field cases, spaced review, progress after reload, backup/restore round trip, keyboard focus, layout overflow, JavaScript errors"],['done','Pentest and Reverse Engineering: beginner explanations, an added figure per lesson, glossary entries and safe lab guides for all 8 labs (contributed bundle, merged in v48)'],["done","Certification facts re-verified against the issuers for all 54 tracks; each certification page shows the date checked and the official sources (47 in v49, the last 7 in v50: Arduino/ETA, RHCSA/RHCE, Burp, GIAC GOSI, IAPP CIPT, Databricks, AWS MLA-C02), and lessons that quoted outdated facts were corrected"],["done","A third figure for every lesson in the 15 domains that had only two: 105 new figures (1,289 to 1,394); every lesson outside Reverse Engineering now has at least three (v51)"],["done","Certification pages show how long ago their facts were checked, turn amber with a re-check warning after three months, and carry a before-you-book checklist; the career and cert paths list shows each one's age (v51)"],["done","Cloud (p17) corrected: a DDoS simulation on AWS is allowed only under AWS's separate DDoS Simulation Testing policy, run by an approved test partner, not through the Simulated Events form (v51)"],["done","v60 production hardening merged (isolated Code Lab worker, Web Lab preview sandbox, safer saved-progress and backup checks, Reverse Engineering depth overlay, Advanced Engineering Studio, video resources, Trusted Computing field case); two bugs fixed before release: the Code Lab worker never started, and the video pack replaced Reverse Engineering's resource list (v60)"],["done","v61 fixes from a code review and a learner walkthrough: the app no longer goes blank when saved progress is unreadable (a copy is kept); ADA help buttons work on every lesson, lab and simulator; mastery exams lock after grading (no resubmitting the shown answers) and warn about blanks; solved gate steps stay solved; XP is awarded once per achievement and always saved; streaks and daily logs use your local date; restored backups are type-checked; Recall counts at most 20 new cards a day from domains you can open; backup, print and confirm flows work inside the Claude viewer; figures enlarge on tap; keyboard, screen-reader and phone-layout fixes (v61)"],["done","Every certification page opens with a Quick facts table (exam, format, length, passing score, price, delivery, prerequisites, validity, next step) taken from that page's own checked text; lesson text now says Domain instead of Phase (2,291 numbered references plus about 120 like “this phase”), and each Domain mention links to it (v62)"],["done","Three certification conflicts re-checked against the issuers (v63): Security+ now states CompTIA's own expected SY0-801 launch (on or around 17 Nov 2026, English first); CTIA's $550 courseware-plus-voucher price, $100 application fee, 312-85 code (brochure) and ECE renewal terms are now confirmed and consistent across the OSINT and Dark Web tracks, and GCTI's 82 questions, 3 hours and 71% are confirmed; the Apple exam figures are labelled as the outgoing iOS 26 versions until Apple publishes the new ones on 29 Oct"],["done","Classroom fixed for the Claude app (v64): speech now starts inside your tap, which iPhone and iPad require; if the device still stays silent the lesson shows each part on screen with a Continue button instead of racing ahead; the Claude app does not let pages use the microphone, so answers there are typed or dictated with the keyboard's microphone, with buttons for yes/no, next lesson, repeat and stop (a browser can still listen to spoken answers)"],["done","Website version (v65): the app can run on its own web address and be added to an iPhone Home Screen, with an offline cache. ADA works there through the learner's own Anthropic API key (Labs → Genius Tools → Connect ADA), stored only on that device and never in progress or backups; inside the Claude app ADA still uses the Claude account."],["done","Professor voice (v66): on the website, every lecture and the Classroom can speak with a lifelike ElevenLabs voice (George by default) through the learner's own ElevenLabs key (Labs → Genius Tools → Professor voice). Audio is saved on the device so replays are free; any failure falls back to the device voice; inside the Claude app the device voices are used."],["not-feasible","Real Linux VM inside the app: needs disk images the artifact can't host; real labs run on your machine instead (workbench)"]];
  function buildView(){ const col={done:'var(--ok)','in-progress':'var(--amber)',planned:'var(--cyan)','not-feasible':'var(--dim)'};
    A().set(`<p class="eyebrow">Development checklist</p><h1 style="margin:0 0 6px">Build log</h1><p class="muted" style="margin:0 0 12px">What has been built, what is in progress, and what is planned — honest status, updated with each release. <a onclick="GP.go('audit')" style="cursor:pointer;color:var(--cyan)">Read the full audit &amp; plan ▸</a></p><div class="holo">${BUILD.map(([s,t])=>`<div class="row" style="gap:10px;align-items:flex-start;margin:7px 0"><span class="chip" style="color:${col[s]};border-color:${col[s]};min-width:92px;text-align:center">${s}</span><span>${esc(t)}</span></div>`).join('')}</div>
      <div class="holo" style="margin-top:14px"><p class="eyebrow">Honest time estimate (at 4–5 focused hours a day)</p><p style="margin:0">Lecture time across all ${A().phases().length} domains is about ${Math.round(A().phases().reduce((s,p)=>s+(p.modules||[]).reduce((a,m)=>a+(m.minutes||0),0),0)/60)} hours; with labs, practice and review that is roughly ${Math.round(A().phases().reduce((s,p)=>s+hours(p),0)/100)*100} hours. Foundational competence: ~4–6 months. Employable (IT support → junior sysadmin/network/SOC with A+, Network+, Security+, Linux+ and a portfolio): ~8–12 months. Advanced specialization (e.g., OSCP-level pentesting, CCNA+, cloud/DevOps): 2–3 years. Research-level depth in any one area: 5+ years and real projects. These are estimates; your pace will vary.</p></div>`); }

  /* ===================== boot + routes ===================== */
  window.addEventListener('load',()=>{ try{ grandfather(); }catch(e){} });
  const R=(re,fn,nav)=>V.push({test:h=>re.test(h),nav:nav||'map',render:(h,api)=>{ grandfather(); fn(h); }});
  R(/^graph$/,graphView); R(/^mastery$/,masteryView); R(/^review$/,reviewView,'cards'); R(/^cum-p\d+(-ret)?$/,h=>cumView(h.slice(4)));
  R(/^gate-explain-p\d+$/,h=>explainView(h.replace('gate-explain-',''))); R(/^gate-var-p\d+$/,h=>varView(h.replace('gate-var-','')));
  R(/^ix$/,ixHome); R(/^ix-ix\d+$/,h=>ixView(h.slice(3))); R(/^ix-fcp\d+$/,h=>ixView(h.slice(3))); R(/^careers$/,careersView); R(/^buildlog$/,buildView,'home');
  window.GP_HOME_EXTRA=window.GP_HOME_EXTRA||[]; window.GP_HOME_EXTRA.unshift(()=>{ try{ grandfather(); return homeCard(); }catch(e){ console.error(e); return ''; } });
  window.GPM={allSc,G,LEVELS,unlocked,demonstrated,mastered,stage,steps,prereqNames,gatePanel,labPanel,labKind,onExam,threshold,nextAction,topo,mapView,short,ancestors,descendants,hours,
    pick,finishReview,finishCum,timer,submitExplain,selfExplain,newVariation,submitVariation,selfVar,submitLab,reviewLab,setCfg,ixQuiz,ixSubmit,cfg,grandfather,labCheck,labHint,labGuide,lessonQuizHTML,lqSubmit,lqRetry,lqStats};
})();
