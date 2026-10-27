/* Illustrations — Domain 12: Hermes & Mesh LLM, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  /* ================= DOMAIN 12: Hermes & Mesh LLM ================= */
  I.p12m1=[{cap:"Three things called Hermes. The agent (center) can run the Hermes models or any other model, locally or in the cloud; it links to other agents, and Mesh LLM can sit underneath as a pooled GPU provider.",
    svg:svg(560,240,`${box(190,20,180,52,'Hermes Agent\n(Nous Research · MIT)',{stroke:CY,size:11})}
      ${box(20,110,160,50,'Hermes models\n(open-weight LLMs)',{stroke:LM,size:10})}${box(200,110,160,50,'any model\nlocal or cloud',{stroke:'currentColor',size:10})}${box(380,110,160,50,'other Hermes agents\n(peer · A2A)',{stroke:MG,size:10})}
      ${arrow(100,110,230,72,'runs')}${arrow(280,110,280,72,'runs')}${arrow(460,110,330,72,'links')}
      ${box(150,190,260,40,'Mesh LLM — pooled GPUs across machines',{stroke:AM,size:10})}${arrow(280,190,280,160,'provides a model')}`,'How the pieces called Hermes relate')},
   {cap:"An agent is a loop around a model. The model proposes a tool call; the harness runs it and feeds the result back, until the task is done.",
    svg:cycle([{t:'read task'},{t:'think:\nplan / tool call',stroke:CY},{t:'act:\nrun the tool',stroke:MG},{t:'observe\nresult'}],{label:'The agent loop'})}];
  I.p12m2=[{cap:"Where Hermes lives after the installer runs (Linux, macOS, WSL2). The data directory is what you back up; the launcher is what your PATH finds.",
    svg:svg(560,230,`${box(200,15,160,36,'~  (your home)',{stroke:CY,bold:true})}
      ${line(280,51,280,70)}${line(120,70,440,70)}${line(120,70,120,85)}${line(440,70,440,85)}
      ${box(30,85,180,40,'.local/bin/hermes\n(the launcher on PATH)',{stroke:CY,size:10})}${box(330,85,220,40,'.hermes/  — all data: BACK THIS UP',{stroke:AM,size:10,bold:true})}
      ${line(440,125,440,140)}${line(300,140,540,140)}${[['hermes-agent/  (code)'],['config.yaml · .env · SOUL.md'],['memories/ · skills/ · cron/'],['sessions/ · state.db · plugins/']].map((t,i)=>line(330+i*70,140,330+i*70,150)+box(295+i*70,150,66,60,t[0].replace(/ · /g,'\n').replace('  (code)','\n(code)'),{size:8,stroke:i===1?MG:DIM})).join('')}`,'Hermes install layout')},
   {cap:"WSL2 done right: Linux home for files, the Windows NVIDIA driver only, and mirrored networking to reach a model server running on the Windows side.",
    svg:svg(560,210,`${box(20,20,250,170,'',{dash:true,stroke:DIM})}${text(145,38,'WINDOWS 11',{bold:true,color:DIM})}${box(40,55,210,40,'NVIDIA driver (only)',{stroke:LM,size:10})}${box(40,105,210,40,'Ollama / LM Studio (optional)\nbound to 0.0.0.0 or mirrored net',{stroke:MG,size:9})}${box(40,150,210,30,'C: drive — slow for WSL files',{stroke:AM,size:9})}
      ${box(290,20,250,170,'',{dash:true,stroke:CY})}${text(415,38,'WSL2 · UBUNTU',{bold:true,color:CY})}${box(310,55,210,40,'~/.hermes  +  repos  +  models',{stroke:CY,size:10})}${box(310,105,210,40,'systemd=true in /etc/wsl.conf',{size:9})}${box(310,150,210,30,'nvidia-smi sees the GPU',{stroke:LM,size:9})}
      ${arrow(145,75,310,75,'GPU passthrough')}${arrow(250,125,310,125,'localhost:11434')}`,'Hermes on WSL2: what goes where')}];
  I.p12m3=[{cap:"One agent core, many doors. Every entry point hands the task to the same AIAgent, which shares one set of tools, memory, skills and sessions.",
    svg:svg(560,230,`${['CLI / TUI','Gateway\n(Telegram…)','API server','ACP (editors)','cron job'].map((t,i)=>box(15+i*108,15,98,44,t,{size:10,stroke:i===1?MG:(i===2?AM:'currentColor')})+arrow(64+i*108,59,280,95,'')).join('')}
      ${box(170,95,220,44,'AIAgent — the single loop',{stroke:CY,size:12})}
      ${['tools (70+)','memory\nMEMORY.md · USER.md','skills\n(SKILL.md)','sessions\nSQLite + FTS5','terminal backend\nlocal · docker · ssh'].map((t,i)=>arrow(280,139,64+i*108,170,'')+box(15+i*108,170,98,46,t,{size:9,stroke:i===4?AM:DIM})).join('')}`,'Hermes architecture: entry points, core, services')},
   {cap:"The prompt is built in tiers so the unchanged prefix can be cached by the provider; when the chat grows past half the context, the middle turns are summarized.",
    svg:stack([{t:'volatile: live conversation (compressed in the middle at 50%)',stroke:MG},{t:'context: MEMORY.md · USER.md · project files (AGENTS.md…)',stroke:AM},{t:'stable: SOUL.md identity · tool definitions · skills  → cached',stroke:CY}],{w:500,label:'Prompt tiers and caching'})}];
  I.p12m4=[{cap:"Fitting a model into GPU memory: the quantized weights plus the KV cache for the context must fit, or the runtime spills to slower system RAM.",
    svg:svg(560,220,`${text(280,22,'16 GB GPU',{bold:true,color:CY})}${box(30,35,500,40,'',{stroke:CY})}
      ${box(30,35,300,40,'weights: 14B × 5.5 bits ÷ 8 ≈ 9.6 GB',{fill:'#0b2a3a',stroke:CY,size:10})}${box(330,35,130,40,'KV cache (64K ctx)',{fill:'#2a0b2a',stroke:MG,size:10})}${box(460,35,70,40,'driver /\ndisplay',{fill:'#1a1a1a',stroke:DIM,size:9})}
      ${text(280,100,'green: fits with room at 20+ tok/s',{size:11,color:LM})}
      ${box(30,120,500,40,'',{stroke:AM})}${box(30,120,476,40,'27B × 4.5 bits ÷ 8 ≈ 15.2 GB of weights alone',{fill:'#2a1f0b',stroke:AM,size:10})}${box(506,120,48,40,'KV →\nRAM',{fill:'#2a0b0b',stroke:MG,size:8,dash:true})}
      ${text(280,185,'amber/red: weights fit but the KV cache spills to RAM → tokens/s collapse',{size:11,color:AM})}
      ${text(280,205,'rule: memory ≈ params × bits ÷ 8, then add the KV cache',{size:10,color:DIM})}`,'Sizing a model to GPU memory')},
   {cap:"Every local server needs the flag that enables tool calling; without it the model can chat but never act.",
    svg:svg(560,180,`${[['Ollama','OLLAMA_CONTEXT_LENGTH=64000'],['llama-server','--jinja -fa -c 64000 -ngl 99'],['vLLM','--enable-auto-tool-choice --tool-call-parser hermes'],['LM Studio','lms server start · load_mode jit']].map(([n,f],i)=>box(20,15+i*40,120,32,n,{size:11,stroke:CY})+arrow(140,31+i*40,170,31+i*40,'')+box(170,15+i*40,370,32,f,{mono:true,size:9,stroke:AM})).join('')}`,'Local server flags Hermes needs')}];
  I.p12m5=[{cap:"Settings precedence: a command-line flag beats config.yaml, which beats .env, which beats the built-in defaults. Secrets belong only in .env.",
    svg:pyramid([{t:'CLI flags',stroke:CY},{t:'config.yaml (settings)'},{t:'.env (secrets · keys)',stroke:AM},{t:'built-in defaults',stroke:DIM}],{label:'Configuration precedence'})},
   {cap:"The gateway is default-deny: a message is served only if the sender is allowlisted or has been paired; the API server demands its key even from localhost.",
    svg:flow([{t:'message\narrives'},{t:'allowlisted\nor paired?',stroke:AM},{t:'yes →\nAIAgent',stroke:LM,edge:'yes'},{t:'no →\ndropped',stroke:MG}],{bw:100,bh:54,gap:30,label:'Gateway default deny'})}];
  I.p12m6=[{cap:"A three-machine Hermes mesh on a private overlay network: the GPU box serves the model and API, the Pi runs the gateway and schedules work, the laptop joins from anywhere. No port faces the internet.",
    svg:svg(560,250,`${box(20,20,520,210,'',{dash:true,stroke:LM})}${text(280,38,'TAILSCALE / WIREGUARD OVERLAY (private addresses)',{size:10,color:LM,bold:true})}
      ${box(40,60,160,70,'GPU box\nlocal 35B model\nAPI :8642 · A2A :9900',{stroke:CY,size:10})}${box(200,60,160,70,'Raspberry Pi\ngateway (Telegram)\ncron · small model',{stroke:AM,size:10})}${box(360,60,160,70,'laptop\nTUI · peer client',{stroke:MG,size:10})}
      ${arrow(200,95,360,95,'')}${text(280,88,'hermes peer run (idempotency key)',{size:9,color:DIM})}${arrow(440,130,120,130,'')}${text(280,145,'A2A: agent-card → JSON-RPC → SSE',{size:9,color:DIM})}
      ${box(150,170,260,44,'internet: zero open ports · bearer tokens · audit log',{stroke:LM,size:10})}`,'A private multi-machine Hermes mesh')},
   {cap:"What exists and what is only proposed in the 'Hermes Mesh' story, as of October 2026.",
    svg:svg(560,190,`${text(140,22,'IMPLEMENTED',{bold:true,color:LM})}${['hermes peer','A2A protocol (port 9900)','Kanban dispatch · profiles','subagent delegation','hermes-iroh-interconnect plugin'].map((t,i)=>box(30,35+i*30,220,26,t,{size:10,stroke:LM})).join('')}
      ${text(420,22,'PROPOSAL ONLY',{bold:true,color:MG})}${box(310,35,220,56,'RFC #94363 "Hermes Mesh"\nhermes mesh init / join',{size:10,stroke:MG,dash:true})}${text(420,110,'not shipped — don\'t trust a video\nthat promises it',{size:10,color:DIM})}${box(310,135,220,40,'community: hermes-mesh (PyPI),\nB1Z0N/hermes-mesh — small, early',{size:9,stroke:DIM,dash:true})}`,'Hermes multi-machine features: real vs proposed')}];
  I.p12m7=[{cap:"Split mode: a model too big for one machine is cut into contiguous layer ranges; each token's activations travel from range to range (pipeline parallelism). Router mode instead sends the whole request to one node that holds the model.",
    svg:svg(560,230,`${text(280,22,'SPLIT MODE — one model across two machines',{bold:true,color:CY})}
      ${box(30,40,230,70,'desktop (24 GB)\nlayers 0–47',{stroke:CY,size:11})}${box(300,40,230,70,'laptop (16 GB)\nlayers 48–79',{stroke:MG,size:11})}${arrow(260,75,300,75,'activations per token')}
      ${text(280,130,'router mode:',{bold:true,color:AM})}${box(30,145,230,50,'node A holds model X',{stroke:AM,size:10})}${box(300,145,230,50,'node B holds model Y',{stroke:AM,size:10})}${text(280,215,'request "model X" → routed to A · request "model Y" → routed to B',{size:10,color:DIM})}`,'Mesh LLM split mode vs router mode')},
   {cap:"Discovery gets peers to the mesh; trust decides who may serve or use it. An invite token is connectivity material, not authorization.",
    svg:compare({t:'DISCOVERY (find the mesh)',draw:x=>[['Nostr relays (default, --publish)'],['--discover=<name> named mesh'],['mDNS for LAN only'],['invite token (--join)']].map((l,i)=>text(x+130,52+i*28,l[0],{size:10})).join('')},{t:'TRUST (who is allowed)',draw:x=>[['mesh-llm auth init · sign-node'],['--trust-policy require-owned | allowlist'],['release attestation (signed builds)'],['[mesh_requirements] version bounds']].map((l,i)=>text(x+130,52+i*28,l[0],{size:10,color:AM})).join('')},{h:180,label:'Mesh LLM discovery vs trust'})}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
