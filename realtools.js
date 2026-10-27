/* D. Real tools — honest separation of simulated vs real, a real-tools workbench with
   output verification, and in-browser runtimes: Python (Pyodide, or Brython inside the Claude viewer)
   and SQLite (sql.js, WebAssembly or asm.js), loaded from allowed CDNs, with an honest message if they can't load. */
(function(){
  const V=window.GP_VIEWS=window.GP_VIEWS||[];
  const A=()=>window.GP_API; const $=id=>document.getElementById(id);
  const esc=s=>(s==null?"":String(s)).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  /* ---------- real runtime loaders (fail honestly) ----------
     Inside the Claude viewer a page may load scripts only from a few CDNs and may not fetch other files,
     so WebAssembly runtimes that download extra files (Pyodide, sql-wasm) cannot start there.
     In the viewer: Python runs on Brython (Python compiled to JavaScript in the page) and SQLite runs
     on sql.js's asm.js build (the same SQLite C code compiled to plain JavaScript; no extra downloads).
     Outside the viewer (the single-file version): real CPython via Pyodide and SQLite via WebAssembly first. */
  const FRAMED=(()=>{ try{ return window.self!==window.top; }catch(e){ return true; } })(); // inside the Claude viewer
  function loadScript(src){ return new Promise((res,rej)=>{ const el=document.createElement('script'); el.src=src; el.async=true;
    const t=setTimeout(()=>{ el.remove(); rej(new Error('timeout')); },60000);
    el.onload=()=>{ clearTimeout(t); res(src); }; el.onerror=()=>{ clearTimeout(t); el.remove(); rej(new Error('blocked: '+src)); }; document.head.appendChild(el); }); }
  // A blocked WebAssembly download can leave a runtime's start-up promise pending forever; give up and fall back instead.
  function withTimeout(p,ms,what){ return Promise.race([p,new Promise((_,rej)=>setTimeout(()=>rej(new Error(what+' did not start in time')),ms))]); }
  async function loadFirst(urls){ let last; for(const u of urls){ try{ return await loadScript(u); }catch(e){ last=e; } } throw last||new Error('no source'); }
  const BRY_VER='3.12.4', SQLJS_VER='1.12.0';
  const BRY_CORE=[`https://cdnjs.cloudflare.com/ajax/libs/brython/${BRY_VER}/brython.min.js`,`https://cdnjs.cloudflare.com/ajax/libs/brython/${BRY_VER}/brython.js`,`https://cdn.jsdelivr.net/npm/brython@${BRY_VER}/brython.min.js`,`https://cdn.jsdelivr.net/npm/brython@${BRY_VER}/brython.js`];
  const BRY_STD=[`https://cdnjs.cloudflare.com/ajax/libs/brython/${BRY_VER}/brython_stdlib.min.js`,`https://cdnjs.cloudflare.com/ajax/libs/brython/${BRY_VER}/brython_stdlib.js`,`https://cdn.jsdelivr.net/npm/brython@${BRY_VER}/brython_stdlib.js`];
  const SQL_ASM=[`https://cdn.jsdelivr.net/npm/sql.js@${SQLJS_VER}/dist/sql-asm.js`,`https://cdnjs.cloudflare.com/ajax/libs/sql.js/${SQLJS_VER}/sql-asm.js`,`https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-asm.js`];

  // A Python runner: {kind, label, run(code) -> {out, error}}
  let pyReady=null;
  async function pyodideRunner(status){
    if(!window.loadPyodide){ status&&status('Downloading CPython (Pyodide, ~10 MB, first time only)…'); await loadScript('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js'); }
    status&&status('Starting Python…'); const py=await withTimeout(loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'}),90000,'Pyodide');
    return {kind:'pyodide',label:'REAL · CPython compiled to WebAssembly (Pyodide)',async run(code){
      try{ if(py.loadPackagesFromImports) await py.loadPackagesFromImports(code); }catch(e){}
      try{ py.runPython(`import sys,io\n_e=io.StringIO();sys.stdout=_e;sys.stderr=_e`); py.runPython(code); return {out:py.runPython('_e.getvalue()')}; }
      catch(e){ let o=''; try{ o=py.runPython('_e.getvalue()'); }catch(_){} return {out:o,error:String(e.message||e)}; }
      finally{ try{ py.runPython('import sys;sys.stdout=sys.__stdout__;sys.stderr=sys.__stderr__'); }catch(_){} } }};
  }
  async function brythonRunner(status){
    if(!window.__BRYTHON__||!window.__BRYTHON__.runPythonSource){ status&&status('Downloading Python (Brython, ~5 MB, first time only)…'); await loadFirst(BRY_CORE); await loadFirst(BRY_STD); }
    status&&status('Starting Python…');
    if(!window.__gpBrythonInit){ window.brython({debug:0}); window.__gpBrythonInit=true; }
    let sink=null; window._gpPyOut=s=>{ if(sink) sink.push(String(s)); };
    sink=[]; __BRYTHON__.runPythonSource('import sys\nfrom browser import window\nclass _GPOut:\n    def write(self, s):\n        window._gpPyOut(s)\n    def flush(self):\n        pass\nsys.stdout=_GPOut()\nsys.stderr=_GPOut()\n','gp_setup');
    let n=0;
    return {kind:'brython',label:'Python 3.12 via Brython (Python compiled to JavaScript in this page)',async run(code){
      sink=[]; let error=null; try{ __BRYTHON__.runPythonSource(code,'main'+(++n)); }catch(e){ error=sink.length?null:String(e&&e.message||e); }
      return {out:sink.join(''),error}; }};
  }
  async function getPy(status){ if(pyReady) return pyReady;
    pyReady=(async()=>{
      if(!FRAMED){ try{ return await pyodideRunner(status); }catch(e){ /* fall through to Brython */ } }
      return await brythonRunner(status);
    })().catch(e=>{ pyReady=null; throw e; }); return pyReady; }

  let sqlReady=null;
  async function getSql(status){ if(sqlReady) return sqlReady; sqlReady=(async()=>{
    if(!FRAMED){ try{
      if(!window.initSqlJs){ status&&status('Downloading SQLite (~1 MB, first time only)…'); await loadScript(`https://cdn.jsdelivr.net/npm/sql.js@${SQLJS_VER}/dist/sql-wasm.js`); }
      status&&status('Starting SQLite…'); const SQL=await withTimeout(initSqlJs({locateFile:f=>`https://cdn.jsdelivr.net/npm/sql.js@${SQLJS_VER}/dist/`+f}),20000,'SQLite (WebAssembly)'); SQL._gpKind='SQLite compiled to WebAssembly (sql.js)'; return SQL; }catch(e){ try{ delete window.initSqlJs; }catch(_){ window.initSqlJs=undefined; } } }
    status&&status('Downloading SQLite (~1.3 MB, first time only)…'); await loadFirst(SQL_ASM);
    status&&status('Starting SQLite…'); const SQL=await initSqlJs(); SQL._gpKind='SQLite compiled to JavaScript (sql.js asm.js build)'; return SQL;
  })().catch(e=>{ sqlReady=null; throw e; }); return sqlReady; }

  /* ---------- real Python ---------- */
  function pyView(){ A().set(`<p class="eyebrow">Real runtime</p><h1 style="margin:0 0 6px">Python — run real code</h1>
    <p style="margin:0 0 10px"><span class="chip ok" id="pykind">${FRAMED?'Python 3.12 via Brython':'CPython (Pyodide) · Brython as fallback'}</span></p>
    <p class="muted" style="margin:0 0 12px">${FRAMED?'Inside the Claude app this runs on <b>Brython</b>, which compiles your Python to JavaScript in the page. Core Python (variables, loops, functions, classes, lists and dicts, exceptions, <code>math</code>, <code>random</code>, <code>json</code>, <code>re</code>, <code>datetime</code>) behaves as in CPython; packages such as NumPy are not available, and an endless loop will freeze the page, so reload it if that happens. The single-file version opened in a browser runs the real CPython interpreter instead.':'This runs actual CPython in your browser (Pyodide, a one-time ~10 MB download, online only). If Pyodide cannot load, it falls back to Brython, which compiles Python to JavaScript.'} For files, networking or pip packages, use Python on your computer (see the workbench).</p>
    <div class="holo"><textarea id="pyin" aria-label="Python code" style="min-height:200px;width:100%;font-family:var(--fmono),monospace">import sys, math
print("Python", sys.version.split()[0])
print("sqrt 2 =", math.sqrt(2))
print(sum(range(101)))
</textarea>
    <div class="row" style="margin-top:10px"><button class="btn" onclick="RT.runPy()">▶ Run</button><span id="pystat" class="tag"></span></div>
    <pre id="pyout" style="white-space:pre-wrap;margin-top:12px;min-height:40px;background:#0b1322;border:1px solid var(--line);border-radius:8px;padding:10px"></pre></div>
    <div class="holo mg" style="margin-top:12px"><p class="eyebrow">Why this matters</p><p class="muted" style="margin:0">Running real code — and reading real tracebacks — is how you actually learn. When this says a runtime is real, it is; when a lab is simulated, the app says so plainly.</p></div>`); }
  async function runPy(){ const out=$('pyout'), st=$('pystat'), code=$('pyin').value; out.textContent=''; st.textContent='';
    let R; try{ R=await getPy(m=>st.textContent=m); }catch(e){ st.textContent=''; out.innerHTML='<span style="color:var(--amber)">Python could not start here ('+esc(String(e&&e.message||e).slice(0,120))+'). '+(FRAMED?'The Claude viewer may be blocking the Python runtime; open the single-file version in Chrome or Safari while online, or run the code with Python on your computer.':'This environment is offline or the CDN is blocked.')+' The workbench has setup steps for Python on your machine.</span>'; return; }
    const k=$('pykind'); if(k) k.textContent=R.label;
    st.textContent='Running…'; await new Promise(r=>setTimeout(r,20));
    const res=await R.run(code); out.textContent=(res.out||'')+(res.error?((res.out?'\n':'')+res.error):'')||'(no output)';
    if(res.error||/Traceback \(most recent call last\)/.test(res.out||'')){ out.style.color='var(--mag)'; st.textContent='error'; } else { out.style.color=''; st.textContent='done'; } }

  /* ---------- real SQLite ---------- */
  let DB=null, SQLm=null;
  function sqliteView(){ A().set(`<p class="eyebrow">Real runtime</p><h1 style="margin:0 0 6px">SQLite — a real SQL database</h1>
    <p style="margin:0 0 10px"><span class="chip ok" id="sqkind">REAL · SQLite (sql.js)</span></p>
    <p class="muted" style="margin:0 0 12px">A genuine SQL engine in your browser: your CREATE/INSERT/SELECT run against real SQLite, compiled from its C source, not a lookalike. It needs a one-time download of about 1 MB. The database lives in memory for this session. To practise Postgres features, transactions across connections, or persistence, run a real database on your machine or in Docker (see Domain 18 and the workbench).</p>
    <div class="holo"><textarea id="sqin" aria-label="SQL statements" style="min-height:160px;width:100%;font-family:var(--fmono),monospace">CREATE TABLE splice(id INTEGER PRIMARY KEY, location TEXT, loss_db REAL);
INSERT INTO splice(location,loss_db) VALUES ('LE-D-108',0.03),('LE-D-109',0.28),('LE-D-110',0.05);
SELECT location, loss_db, CASE WHEN loss_db>0.1 THEN 'REDO' ELSE 'ok' END AS verdict
FROM splice ORDER BY loss_db DESC;</textarea>
    <div class="row" style="margin-top:10px"><button class="btn" onclick="RT.runSql()">▶ Run</button><button class="btn ghost sm" onclick="RT.resetDb()">Reset database</button><span id="sqstat" class="tag"></span></div>
    <div id="sqout" style="margin-top:12px"></div></div>`); }
  async function runSql(){ const out=$('sqout'), st=$('sqstat'); st.textContent='';
    try{ if(!SQLm) SQLm=await getSql(m=>st.textContent=m); if(!DB) DB=new SQLm.Database(); const k=$('sqkind'); if(k&&SQLm._gpKind) k.textContent='REAL · '+SQLm._gpKind; }
    catch(e){ st.textContent=''; out.innerHTML='<span style="color:var(--amber)">SQLite could not start here ('+esc(String(e&&e.message||e).slice(0,120))+'). '+(FRAMED?'The Claude viewer may be blocking it; the single-file version opened in a browser while online should work.':'This environment is offline or the CDN is blocked.')+' The in-app <a onclick="GP.go(\'tool-sql\')" style="cursor:pointer;color:var(--cyan)">SQL lab</a> works offline with sample tables; for the real engine, run sqlite3 or Postgres on your machine.</span>'; return; }
    st.textContent='';
    try{ const res=DB.exec($('sqin').value); if(!res.length){ out.innerHTML='<p class="muted">OK (no rows returned).</p>'; return; }
      out.innerHTML=res.map(r=>`<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:13px"><tr>${r.columns.map(c=>`<th style="text-align:left;border-bottom:1px solid var(--line);padding:4px 8px;color:var(--cyan)">${esc(c)}</th>`).join('')}</tr>${r.values.map(v=>`<tr>${v.map(x=>`<td style="border-bottom:1px solid var(--line);padding:4px 8px">${esc(x)}</td>`).join('')}</tr>`).join('')}</table></div>`).join(''); }
    catch(e){ out.innerHTML='<span style="color:var(--mag)">'+esc(String(e.message||e))+'</span>'; } }
  function resetDb(){ DB=null; $('sqout').innerHTML='<p class="muted">Database reset.</p>'; }

  /* ---------- real-tools workbench ---------- */
  const TRACKS=[
    {t:"Linux + shell (the core toolkit)", tools:"a Linux VM or WSL2, a terminal", setup:["Install VirtualBox or use WSL2 on Windows (`wsl --install`).","Install Ubuntu or Rocky Linux.","Open a terminal and confirm `uname -a` and `whoami`."], verify:{label:"Paste the output of `uname -a`", re:/Linux .*\d+\.\d+.*(x86_64|aarch64|arm)/i, hint:"Run uname -a in your Linux VM/WSL and paste the whole line."}, domains:["p3","p29","p15","p26"]},
    {t:"Git + GitHub", tools:"git, a GitHub account", setup:["Install git (`sudo apt install git` or git-scm.com).","`git config --global user.name` and `user.email`.","Create a repo, commit, and push."], verify:{label:"Paste the output of `git --version` and `git log --oneline -1`", re:/git version \d+\.\d+/i, hint:"git --version prints the version; make at least one commit for the log line."}, domains:["p20","p19"]},
    {t:"Python on your machine", tools:"Python 3, pip, a venv", setup:["Install Python 3.12+ (python.org or your package manager).","Create a venv: `python3 -m venv .venv && source .venv/bin/activate`.","`python -c \"import sys;print(sys.version)\"`."], verify:{label:"Paste the output of `python3 --version`", re:/Python 3\.(1[0-9]|[7-9])/, hint:"Run python3 --version (3.7+)."}, domains:["p4","p22","p28","p35"]},
    {t:"C toolchain + debugger", tools:"gcc or clang, gdb", setup:["Install build tools (`sudo apt install build-essential gdb`).","Compile: `echo 'int main(){return 0;}' > t.c && gcc -g t.c -o t`.","`gcc --version`."], verify:{label:"Paste the first line of `gcc --version`", re:/(gcc|clang).*\d+\.\d+/i, hint:"gcc --version or clang --version."}, domains:["p15","p11","p38"]},
    {t:"Containers (Docker/Podman)", tools:"Docker Desktop or Podman", setup:["Install Docker Desktop or Podman.","`docker run --rm hello-world` (or `podman run ...`).","`docker --version`."], verify:{label:"Paste the output of `docker --version` (or `podman --version`)", re:/(Docker|podman) version \d+/i, hint:"Install Docker/Podman and run the version command."}, domains:["p19","p17","p30","p36"]},
    {t:"Packet capture (Wireshark/tcpdump)", tools:"Wireshark or tcpdump", setup:["Install Wireshark (wireshark.org) or `sudo apt install tcpdump`.","Capture your own traffic: `sudo tcpdump -c 5 -n`.","Note the protocols you see."], verify:{label:"Paste 2–3 lines of your own `tcpdump -c 5 -n` capture", re:/IP\s+\d+\.\d+\.\d+\.\d+/i, hint:"Capture on your own network only; paste a couple of IP lines."}, domains:["p2","p27","p21","p7"]},
    {t:"Virtualization / home lab", tools:"VirtualBox, Proxmox, or Hyper-V", setup:["Install a hypervisor (VirtualBox is free and cross-platform).","Create one Linux VM and snapshot it.","`VBoxManage list vms` or note the VM in the GUI."], verify:{label:"Describe your VM (name, OS, RAM) and paste any CLI listing you have", re:/.{40,}/, hint:"At least name it, its OS and memory; a VBoxManage/virsh listing is ideal."}, domains:["p30","p16","p43"]},
    {t:"Local AI (Ollama / llama.cpp)", tools:"Ollama or Hermes Agent", setup:["Install Ollama (ollama.com) or follow Domain 12 for Hermes.","`ollama run llama3.2` (or a small model that fits your RAM).","Ask it one question."], verify:{label:"Paste the output of `ollama --version` or `ollama list`", re:/(ollama|version|[a-z0-9]+:[a-z0-9]+)/i, hint:"ollama --version, or ollama list after pulling a model."}, domains:["p12","p9","p34"]}];
  function benchView(){ const s=A().S; s.bench=s.bench||{};
    let h=`<p class="eyebrow">Real tools, not simulations</p><h1 style="margin:0 0 6px">Real-tools workbench</h1>
    <p class="muted" style="margin:0 0 12px">An interactive diagram can show you how a thing works; it cannot teach you to diagnose a real system. These tracks set up the actual tools engineers use. Follow the steps on your own machine, then paste a scrap of real output — the app checks it looks genuine and records it. This is how the mastery-gate labs get their evidence.</p>
    <p class="muted" style="margin:0 0 14px;font-size:13px">Two real runtimes also run right here in your browser: <a onclick="GP.go('py')" style="cursor:pointer;color:var(--cyan)">real Python</a> and <a onclick="GP.go('sqlite')" style="cursor:pointer;color:var(--cyan)">real SQLite</a>.</p>
    <div class="ilist">`;
    TRACKS.forEach((T,i)=>{ const done=s.bench[i]&&s.bench[i].ok; h+=`<details class="holo" style="margin:0 0 8px"><summary style="cursor:pointer;list-style:none"><span class="row" style="justify-content:space-between"><b>${done?'✓ ':''}${esc(T.t)}</b><span class="tag">${T.domains.map(d=>esc(GPM.short(d).slice(0,6))).join(' ')}</span></span></summary>
      <p class="muted" style="margin:8px 0 4px"><b>Tools:</b> ${esc(T.tools)}</p><ol class="muted" style="margin:0 0 8px;padding-left:20px">${T.setup.map(x=>`<li style="margin:4px 0">${esc(x)}</li>`).join('')}</ol>
      <p class="eyebrow">${esc(T.verify.label)}</p><textarea id="bv${i}" style="min-height:70px;width:100%;font-family:var(--fmono),monospace">${esc((s.bench[i]&&s.bench[i].text)||'')}</textarea>
      <div class="row" style="margin-top:8px"><button class="btn sm" onclick="RT.verify(${i})">Verify</button><span id="bvs${i}" class="tag">${done?'verified ✓':''}</span></div></details>`; });
    h+=`</div>`; A().set(h); }
  function verify(i){ const T=TRACKS[i], t=($('bv'+i).value||'').trim(), st=$('bvs'+i); const s=A().S; s.bench=s.bench||{};
    if(T.verify.re.test(t)){ const paid=!!(s.bench[i]&&s.bench[i]._xp); s.bench[i]={ok:true,text:t,at:Date.now(),_xp:1}; A().save(); st.textContent='verified ✓'; if(!paid) A().addXP(40,'Real tool set up'); }
    else { s.bench[i]={ok:false,text:t,_xp:(s.bench[i]&&s.bench[i]._xp)||undefined}; A().save(); st.textContent='Doesn\'t look right — '+T.verify.hint; } }

  V.push({test:h=>h==='py',nav:'labs',render:pyView});
  V.push({test:h=>h==='sqlite',nav:'labs',render:sqliteView});
  V.push({test:h=>h==='bench',nav:'labs',render:benchView});
  window.RT={runPy,runSql,resetDb,verify};
})();
