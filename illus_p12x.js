/* Third figures — Domain 12: Hermes & Mesh LLM: Local AI on Your Own Hardware. Adds to the figures in illus_p12.js (never replaces them). */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const add=(id,figs)=>{ window.ILLUS=window.ILLUS||{}; window.ILLUS[id]=(window.ILLUS[id]||[]).concat(figs); };
  /* local helpers, kit colors only */
  const hl=(x,y,w,h,c,op)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="4" fill="'+c+'" opacity="'+(op||0.2)+'"/>';
  const elbow=(d,o={})=>'<path d="'+d+'" fill="none" stroke="'+(o.stroke||'currentColor')+'" stroke-width="'+(o.sw||1.3)+'"'+(o.dash?' stroke-dasharray="5 4"':'')+' marker-end="url(#ah)"/>';

  /* M1 — "self-improving" means files change, never the weights */
  add('p12m1',[{cap:"What 'self-improving' actually writes: after a non-trivial task Hermes writes or edits a skill, updates its two curated memory files and saves the session to a searchable database, and the next task reads all three back. The model's weights are never touched, so everything it 'learned' is a file you can open, read or delete.",
    svg:svg(560,240,(()=>{
      let s=text(85,14,'THE RUN',{bold:true,color:CY,size:11})+text(325,14,'WHAT CHANGES: FILES',{bold:true,color:LM,size:11})+text(492,14,'NEVER CHANGES',{bold:true,color:MG,size:11});
      s+=box(20,30,130,180,'agent loop\nsolves a task\n\nmodel proposes,\nharness acts',{stroke:CY,size:11});
      s+=box(240,30,170,44,'skills/…/SKILL.md\nreusable playbook',{stroke:LM,size:10})+box(240,98,170,44,'MEMORY.md · USER.md\ncurated notes',{stroke:LM,size:10})+box(240,166,170,44,'state.db sessions\nfull-text search',{stroke:LM,size:10});
      s+=arrow(150,52,238,52,'writes')+arrow(150,120,238,120,'edits')+arrow(150,188,238,188,'saves');
      s+=elbow('M325 210 L325 226 L85 226 L85 213',{stroke:DIM,dash:true})+text(205,219,'next task reads them back',{size:10,color:DIM});
      s+=box(440,40,105,70,'model\nweights',{stroke:DIM,dash:true,size:12,color:DIM})+text(492,132,'not retrained,\nnot edited',{size:10,color:MG,lh:13});
      s+=text(492,176,'learning = files\nyou can read\nor delete',{size:10,color:DIM,lh:13});
      return s; })(),'Self-improvement writes skill, memory and session files while the model weights stay unchanged')}]);

  /* M2 — the first-day path, with hermes doctor as the loop that gates everything */
  add('p12m2',[{cap:"The first-day path: the installer pins its own Python and tools, a new shell puts hermes on PATH, and hermes doctor is a loop you repeat (fix what it reports, rerun) until everything is green. Only then run setup and the model wizard, which refuses any model under 64K context.",
    svg:svg(560,240,(()=>{
      const r1=[['install.sh\ncurl … | bash',CY],['pins Python 3.14\nuv · Node · ripgrep','currentColor'],['source ~/.bashrc\nor new terminal','currentColor'],['hermes doctor\nPATH · Python …',AM]];
      let s=''; r1.forEach(([t,c],i)=>{ const x=15+i*140; s+=box(x,20,110,46,t,{stroke:c,size:10}); if(i<3) s+=arrow(x+112,43,x+138,43,''); });
      s+=arrow(490,68,490,108,'check',{dy:-2});
      s+=box(435,110,110,40,'all green?',{stroke:AM,size:11,bold:true});
      s+=arrow(490,150,490,180,'no',{dy:-2})+box(435,182,110,36,'fix what it\nreports',{stroke:MG,size:10});
      s+=elbow('M545 200 L553 200 L553 43 L547 43',{stroke:MG});
      s+=arrow(435,130,407,130,'yes',{dy:0});
      s+=box(295,110,110,40,'hermes setup\nQuick·Full·Blank',{stroke:LM,size:10})+arrow(295,130,267,130,'')+box(155,110,110,40,'hermes model\nlocal or cloud',{stroke:LM,size:10})+arrow(155,130,127,130,'')+box(15,110,110,40,'hermes --tui\nfirst real task',{stroke:LM,size:10});
      s+=text(210,170,'model context below 64K?',{size:10,color:AM})+text(210,184,'Hermes refuses it at startup',{size:10,color:AM});
      s+=box(15,196,395,36,'unsupported installs:\npip · uv tool · Homebrew · AUR · 32-bit',{stroke:MG,dash:true,size:10,color:MG});
      return s; })(),'Install, new shell, doctor loop, setup, model wizard, first task')}]);

  /* M3 — the context compressor: what is kept and what is summarized */
  add('p12m3',[{cap:"Context compression, drawn to the lecture's numbers: when the conversation reaches half the context window, the first three turns and the last twenty stay verbatim and everything between them becomes one summary. The session keeps a parent–child lineage, so the original turns stay searchable.",
    svg:svg(560,225,(()=>{
      let s=text(30,18,'context window',{size:10,color:DIM,anchor:'start'});
      s+=hl(30,26,250,22,AM,0.3)+box(30,26,500,22,'',{stroke:DIM,rx:4})+text(155,37,'conversation so far',{size:10});
      s+=line(280,20,280,54,{stroke:MG,sw:1.6,dash:true})+text(290,62,'trigger: 50% full',{size:10,color:MG,anchor:'start'});
      const row=(y,mid,midC,dash)=>{ let r=''; [1,2,3].forEach((k,i)=>{ r+=box(70+i*30,y,26,30,String(k),{stroke:LM,size:11,bold:true}); }); r+=box(165,y,225,30,mid,{stroke:midC,size:10,dash:dash})+box(395,y,145,30,'last 20 turns',{stroke:CY,size:10}); return r; };
      s+=text(20,95,'before',{size:10,color:DIM,anchor:'start'})+row(80,'turns 4 … n − 20','currentColor',false);
      s+=arrow(113,112,113,138,'')+arrow(277,112,277,138,'')+arrow(467,112,467,138,'')+text(121,125,'kept',{size:10,color:LM,anchor:'start'})+text(285,125,'summarize',{size:10,color:AM,anchor:'start'})+text(475,125,'kept',{size:10,color:CY,anchor:'start'});
      s+=text(20,155,'after',{size:10,color:DIM,anchor:'start'})+row(140,'one summary of the middle',AM,true);
      s+=text(280,192,'ends verbatim; middle becomes a summary',{size:10,color:LM})+text(280,210,'lineage: parent → child, still searchable',{size:10,color:DIM});
      return s; })(),'Compression keeps the first three and last twenty turns and summarizes the middle at half the context')}]);

  /* M4 — what "hermes model → Local models" does, step by step */
  add('p12m4',[{cap:"What the Local-models wizard decides for you: the backend follows the hardware (NVIDIA to CUDA, AMD or Intel to Vulkan, Apple Silicon to Metal, anything else to CPU). The recommender then offers only builds that fit your memory at a predicted 20+ tokens per second, never below 4-bit, configured for at least 64K context, and pins each download by SHA-256.",
    svg:svg(560,255,(()=>{
      let s=text(135,20,'BACKEND = auto',{bold:true,color:CY,size:11})+text(422,20,'RECOMMENDER',{bold:true,color:AM,size:11});
      [['NVIDIA GPU','CUDA',LM],['AMD / Intel GPU','Vulkan',CY],['Apple Silicon','Metal',MG],['anything else','CPU',DIM]].forEach(([h,b,c],i)=>{ const y=36+i*38; s+=box(15,y,110,30,h,{size:10})+arrow(125,y+15,163,y+15,'')+box(165,y,90,30,b,{stroke:c,size:11,bold:true})+line(255,y+15,272,y+15); });
      s+=line(272,51,272,165)+arrow(272,51,298,51,'');
      const steps=['fits GPU or unified memory','≥ 20 tok/s · never below 4-bit','configured with ≥ 64K context','download pinned: URL + SHA-256','start server · set as default'];
      steps.forEach((t,i)=>{ const y=36+i*42; s+=box(300,y,245,30,t,{stroke:i===4?LM:AM,size:10}); if(i<4) s+=arrow(422,y+30,422,y+40,''); });
      s+=text(422,246,'options shown green · amber · red',{size:10,color:DIM});
      s+=box(15,196,240,36,'too big: experts spill to RAM,\nKV cache stays on GPU',{stroke:MG,size:10});
      s+=text(135,246,'idle 15 min → unloads',{size:10,color:DIM});
      return s; })(),'Backend auto-selection and the recommender pipeline of the managed llama.cpp runtime')}]);

  /* M5 — hermes config set routes by the shape of the key */
  add('p12m5',[{cap:"hermes config set decides where a value lands from the shape of its name: UPPER_SNAKE names are secrets and go to .env (mode 600), dotted keys are settings and go to config.yaml. That routing is why a key pasted into config.yaml, a prompt or memory is always a mistake.",
    svg:svg(560,215,(()=>{
      let s=box(15,24,230,40,'hermes config set\nOPENROUTER_API_KEY …',{mono:true,size:10,stroke:MG})+box(15,142,230,40,'hermes config set\nmodel.default …',{mono:true,size:10,stroke:CY});
      s+=arrow(245,44,276,92,'')+arrow(245,162,276,126,'');
      s+=box(278,88,112,42,'name in\nUPPER_SNAKE?',{stroke:AM,size:10,bold:true});
      s+=arrow(390,98,423,52,'yes',{dy:2})+arrow(390,120,423,156,'no',{dy:2});
      s+=box(425,16,120,64,'.env\nmode 600\nAPI keys · tokens',{stroke:MG,size:10})+box(425,124,120,64,'config.yaml\nmodel.default\nterminal.backend',{stroke:CY,size:10});
      s+=text(485,94,'secrets only here',{size:9,color:MG})+text(485,202,'settings, no secrets',{size:9,color:CY});
      s+=text(130,92,'one command,',{size:10,color:DIM})+text(130,108,'two destinations',{size:10,color:DIM});
      s+=text(130,206,'never: keys in prompts or memory',{size:10,color:AM});
      return s; })(),'hermes config set routes UPPER_SNAKE names to .env and dotted keys to config.yaml')}]);

  /* M6 — an idempotency key makes a retry safe */
  add('p12m6',[{cap:"Why the 7 a.m. job carries an idempotency key: when the reply to hermes peer run is lost, the Pi cannot tell whether the GPU box started the job. It retries at 7:30 with the same key, and a key the receiver has already seen is not run again, so the retry never creates a duplicate.",
    svg:svg(560,240,(()=>{
      let s=box(85,10,130,34,'Raspberry Pi (A)\ncron at 7:00',{stroke:AM,size:10})+box(345,10,130,34,'GPU box (B)\nAPI server :8642',{stroke:CY,size:10});
      s+=line(150,44,150,222,{stroke:DIM,dash:true})+line(410,44,410,222,{stroke:DIM,dash:true});
      s+=arrow(150,72,408,72,'7:00 peer run · key K');
      s+=box(420,58,130,30,'job runs\nkey K recorded',{stroke:LM,size:9});
      s+=arrow(408,108,152,108,'reply lost / timeout',{stroke:MG,dash:true,color:MG});
      s+=text(75,108,'did it run?',{size:10,color:AM})+text(75,122,'A can\'t tell',{size:10,color:AM});
      s+=arrow(150,150,408,150,'7:30 retry · same key K');
      s+=box(420,134,130,34,'K already seen:\nno second job',{stroke:LM,size:9});
      s+=arrow(408,190,152,190,'one job, one result',{stroke:LM,color:LM});
      s+=text(75,190,'safe to retry',{size:10,color:LM});
      s+=text(280,232,'K = morning-<date>: one key per day',{size:9,color:DIM});
      return s; })(),'Sequence of a peer run, a lost reply and a safe retry with the same idempotency key')}]);

  /* M7 — on a public mesh, who can read the prompt */
  add('p12m7',[{cap:"Who can read a prompt on the public mesh: iroh tries a direct, hole-punched path and falls back to a relay, and either way the bytes travel as encrypted QUIC that the relay cannot read. The peer that serves the model must decrypt the prompt to run it, and on serve --auto that peer is a stranger's GPU.",
    svg:svg(560,225,(()=>{
      let s=text(280,14,'iroh: node identity = public key',{size:10,color:DIM});
      s+=box(15,62,120,50,'your laptop\nmesh-llm client',{stroke:CY,size:10});
      s+=box(215,28,130,44,'relay (fallback)\ncannot read it',{stroke:LM,size:10});
      s+=box(425,62,120,50,'stranger\'s GPU\nserves the model',{stroke:MG,size:10});
      s+=arrow(135,74,213,52,'')+arrow(345,52,423,74,'')+text(165,46,'encrypted',{size:10,color:DIM})+text(395,46,'encrypted',{size:10,color:DIM});
      s+=arrow(135,100,423,100,'direct (hole-punched)',{dash:true});
      s+=text(75,130,'prompt leaves',{size:10,color:DIM})+text(75,144,'your machine',{size:10,color:DIM});
      s+=text(485,130,'decrypts and runs it:',{size:10,color:MG})+text(485,144,'sees the prompt',{size:10,color:MG,bold:true});
      s+=box(110,164,340,30,'public mesh: send nothing sensitive',{stroke:AM,size:11,bold:true});
      s+=text(280,212,'blackboard posts: visible to every peer',{size:9,color:DIM});
      return s; })(),'Relays forward encrypted traffic but the serving peer necessarily sees the prompt')}]);
})();
