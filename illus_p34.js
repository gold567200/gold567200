/* Illustrations — Domain 34: LLM Engineering, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  /* ================= DOMAIN 34: LLM Engineering ================= */
  I.p34m1=[{cap:"The same workload on two model tiers (October 2026 list prices). 12,000 calls a day × 5,100 input and 300 output tokens: model choice alone is a 20× lever, before caching or batching.",
    svg:compare({t:'SONNET 5.5 · $2 / $10 per MTok',draw:x=>[['61.2M in × $2 = $122.40',CY],['3.6M out × $10 = $36.00',CY],['= $158 / day',AM],['≈ $4,750 / month',AM]].map((l,i)=>text(x+130,56+i*30,l[0],{size:11,color:l[1],bold:i>=2})).join('')},{t:'HAIKU 5.5 · $0.10 / $0.50 per MTok',draw:x=>[['61.2M in × $0.10 = $6.12',MG],['3.6M out × $0.50 = $1.80',MG],['= $7.92 / day',LM],['≈ $240 / month',LM]].map((l,i)=>text(x+130,56+i*30,l[0],{size:11,color:l[1],bold:i>=2})).join('')},{h:180,label:'Daily cost of one workload on two model tiers'})},
   {cap:"Temperature rescales the probabilities before sampling. Halving T from 1 to 0.5 squares and renormalizes: 0.60/0.30/0.10 becomes 0.78/0.20/0.02 — the favorite dominates and the tail nearly vanishes.",
    svg:svg(560,230,`${text(140,22,'T = 1.0 (model\'s own distribution)',{bold:true,color:CY,size:11})}${text(420,22,'T = 0.5 (sharper)',{bold:true,color:MG,size:11})}
      ${[[0.60,'tok A'],[0.30,'tok B'],[0.10,'tok C']].map(([p,n],i)=>box(60+i*60,180-p*150,40,p*150,'',{fill:CY,stroke:CY})+text(80+i*60,170-p*150,p.toFixed(2),{size:11,color:CY})+text(80+i*60,196,n,{size:10,color:DIM})).join('')}
      ${[[0.78,'tok A'],[0.20,'tok B'],[0.02,'tok C']].map(([p,n],i)=>box(340+i*60,180-p*150,40,p*150,'',{fill:MG,stroke:MG})+text(360+i*60,170-p*150,p.toFixed(2),{size:11,color:MG})+text(360+i*60,196,n,{size:10,color:DIM})).join('')}
      ${line(40,180,250,180,{stroke:DIM})}${line(320,180,530,180,{stroke:DIM})}${arrow(245,100,305,100,'p² / Σp²')}
      ${text(280,218,'p ∝ exp(z / T):  T → 0 greedy · T = 1 as trained · T > 1 flatter',{size:10,color:DIM})}`,'Effect of temperature on token probabilities')},
   {cap:"Anatomy of one request. The stable prefix (system prompt, tool definitions, few-shot examples) comes first so the provider can cache it; the volatile parts follow; the reply carries stop_reason and token usage you must log.",
    svg:stack([{t:'system prompt · tools · few-shot → cached prefix (0.05–0.1×)',stroke:CY},{t:'retrieved context · conversation history (volatile)',stroke:AM},{t:'user message',stroke:'currentColor'},{t:'response: text or tool_use · stop_reason · usage.input/output_tokens',stroke:MG}],{w:520,label:'Anatomy of an LLM request and response'})}];
  I.p34m2=[{cap:"How ADA's prompt is assembled on every turn: one constant system prompt, an optional Socratic clause, injected lecture context (a tiny retrieval step), a ten-turn window, your question — then a streamed reply.",
    svg:stack([{t:'ADA_SYS: identity · scope · tone · method · safety · honesty',stroke:CY},{t:'+ Socratic clause (only when toggled on)',stroke:AM},{t:'+ context: module title + first 1,500 chars of lecture',stroke:LM},{t:'+ last 10 turns of conversation',stroke:'currentColor'},{t:'+ your question → reply streamed token by token',stroke:MG}],{w:520,label:'How the ADA tutor prompt is assembled'})},
   {cap:"The lethal trifecta. An agent with private data, exposure to untrusted content and a way to send data out can be made to exfiltrate by prompt injection. No prompt wording fixes this; removing any one leg does.",
    svg:svg(560,240,`${box(160,20,240,54,'all three present →\nan injected page can steal or destroy',{stroke:MG,bold:true,size:11})}
      ${box(20,150,160,56,'private data\n(files · tickets · mail)',{stroke:AM,size:11})}${box(200,150,160,56,'untrusted content\n(web · docs · tool results)',{stroke:AM,size:11})}${box(380,150,160,56,'exfiltration channel\n(network · send · shell)',{stroke:AM,size:11})}
      ${arrow(100,150,235,74,'')}${arrow(280,150,280,74,'')}${arrow(460,150,325,74,'')}
      ${text(280,226,'defense: remove one leg (read step with no network · no private data near untrusted text) + approval + validation',{size:9,color:LM})}`,'The lethal trifecta of prompt injection')},
   {cap:"Evaluation-driven prompting: every change is measured on the same eval set, one variable at a time. A prompt that scores 94% is an engineering artifact; one that feels better is a mood.",
    svg:cycle([{t:'write prompt\nversion N'},{t:'run the\neval set',stroke:CY},{t:'read the\nfailures',stroke:AM},{t:'change\none thing',stroke:MG}],{label:'The evaluation-driven prompting loop'})}];
  I.p34m3=[{cap:"The RAG pipeline. Offline: chunk, embed and index (vectors plus a BM25 keyword index). Online: hybrid retrieval of ~20 candidates, reranking to 5, a prompt with numbered chunks, and an answer whose citations your code checks.",
    svg:flow([{t:'documents\n(yours)'},{t:'chunk\n400 tok · 40 overlap',stroke:CY},{t:'embed\n(same model always)',stroke:CY},{t:'vector DB\n+ BM25 index',stroke:AM},{t:'query →\nhybrid top 20',stroke:AM},{t:'rerank\n→ top 5',stroke:MG},{t:'prompt with\n[n] chunks',stroke:'currentColor'},{t:'answer\n+ citation check',stroke:LM}],{label:'Retrieval-augmented generation pipeline'})},
   {cap:"Cosine similarity is the angle between vectors, not their length. a = (3, 4) and b = (4, 3) point almost the same way (0.96); c = (5, 0) is further off (0.60). Databases store the distance 1 − cos θ.",
    svg:svg(560,230,`${line(40,190,300,190,{stroke:DIM})}${line(40,190,40,30,{stroke:DIM})}
      ${arrow(40,190,130,70,'',{stroke:CY,sw:2})}${text(150,62,'a = (3, 4)',{size:11,color:CY})}
      ${arrow(40,190,160,100,'',{stroke:MG,sw:2})}${text(190,96,'b = (4, 3)',{size:11,color:MG})}
      ${arrow(40,190,190,190,'',{stroke:AM,sw:2})}${text(222,180,'c = (5, 0)',{size:11,color:AM})}
      ${text(70,142,'θ',{size:12,color:DIM})}
      ${[['a·b = 3·4 + 4·3 = 24',CY],['|a| = |b| = √(9 + 16) = 5',CY],['cos θ(a, b) = 24 / 25 = 0.96',LM],['cos θ(a, c) = 15 / 25 = 0.60',AM],['distance = 1 − cos θ  (pgvector <=>)',DIM],['unit vectors → cosine = dot product',DIM]].map((l,i)=>text(430,52+i*26,l[0],{size:10,color:l[1]})).join('')}`,'Cosine similarity of three vectors')},
   {cap:"Hybrid search with reciprocal rank fusion (k = 60). BM25 and vectors rank differently; a chunk found high by both (#412) wins the fusion even though neither engine ranked it first in both lists.",
    svg:svg(560,230,`${text(100,22,'BM25 (keywords)',{bold:true,color:CY,size:11})}${text(280,22,'VECTORS (meaning)',{bold:true,color:MG,size:11})}${text(460,22,'RRF: Σ 1/(60 + rank)',{bold:true,color:LM,size:11})}
      ${['1. report #412','2. manual p.7','3. report #388'].map((t,i)=>box(20,40+i*40,160,32,t,{size:11,stroke:CY})).join('')}
      ${['1. report #388','2. report #412','3. report #299'].map((t,i)=>box(200,40+i*40,160,32,t,{size:11,stroke:MG})).join('')}
      ${[['#412: 1/61 + 1/62 = 0.0325',LM,true],['#388: 1/63 + 1/61 = 0.0323',DIM,false],['manual: 1/62 = 0.0161',DIM,false],['#299: 1/63 = 0.0159',DIM,false]].map((l,i)=>box(380,40+i*40,160,32,l[0],{size:10,stroke:l[1],bold:l[2]})).join('')}
      ${text(190,176,'both lists → one fused score → #412 wins',{size:10,color:LM})}
      ${text(280,210,'agreement between engines beats a single first place → then rerank the top 20 to 5',{size:10,color:DIM})}`,'Reciprocal rank fusion of keyword and vector rankings')}];
  I.p34m4=[{cap:"The agent loop as your code draws it: the model only proposes; the harness validates, runs the tool in a sandbox, appends the result and repeats under hard caps. The fence, not the model, is what you trust.",
    svg:svg(560,260,`${box(10,30,540,222,'',{dash:true,stroke:LM})}${text(280,46,'HARNESS = THE FENCE · turn cap · token budget · timeout · log every call',{size:10,color:LM,bold:true})}
      ${box(30,70,200,50,'model proposes\ntool_use(name, args)',{stroke:CY,size:11})}${box(330,70,200,50,'validate: schema +\nallowlist (host · path · port)',{stroke:AM,size:11})}
      ${box(330,170,200,50,'run tool in sandbox\n(read-only · no egress)',{stroke:MG,size:11})}${box(30,170,200,50,'append tool_result\n(or the error message)',{stroke:'currentColor',size:11})}
      ${arrow(230,95,330,95,'')}${arrow(430,120,430,170,'ok')}${arrow(330,195,230,195,'')}${arrow(130,170,130,120,'next turn')}
      ${text(280,150,'rejected → error text the model can read and recover from',{size:9,color:AM})}
      ${text(280,240,'plain-text reply (no tool_use) or cap reached → stop and report',{size:10,color:DIM})}`,'The agent loop inside its harness')},
   {cap:"Model Context Protocol: a host runs one MCP client per server; servers expose tools, resources and prompts over JSON-RPC 2.0, via stdio locally or Streamable HTTP remotely. The 2026-07-28 revision is stateless: version and capabilities ride in _meta on every request.",
    svg:svg(560,240,`${box(20,30,200,170,'',{dash:true,stroke:CY})}${text(120,48,'HOST',{bold:true,color:CY})}${text(120,64,'Claude Code · Hermes · your app',{size:9,color:DIM})}
      ${box(40,80,160,40,'MCP client #1',{stroke:CY,size:11})}${box(40,140,160,40,'MCP client #2',{stroke:CY,size:11})}
      ${box(330,70,210,56,'server: home-lab checks\ntools · resources · prompts',{stroke:MG,size:10})}${box(330,140,210,56,'server: docs (remote)\ntools · resources · prompts',{stroke:MG,size:10})}
      ${arrow(200,100,330,98,'stdio · JSON-RPC 2.0')}${arrow(200,160,330,168,'Streamable HTTP')}
      ${text(280,222,'2026-07-28: no initialize, no session id · _meta carries version + capabilities · optional server/discover',{size:9,color:LM})}`,'MCP hosts, clients and servers')},
   {cap:"Guardrails stack outside the model. Each layer is imperfect; together they bound what a fully compromised model could do and make it visible.",
    svg:stack([{t:'tool allowlist · read-only where possible',stroke:CY},{t:'schema + argument validation (hosts · paths · URLs)',stroke:CY},{t:'sandbox: container/VM · no egress unless needed',stroke:AM},{t:'human approval for irreversible or external actions',stroke:AM},{t:'budgets: turns · tokens · dollars · wall-clock',stroke:MG},{t:'tracing: every call logged · alerts on anomalies',stroke:LM}],{w:520,label:'Layered guardrails around an agent'})}];
  I.p34m5=[{cap:"Pick the lever that matches the problem. Behavior problems are prompting problems; knowledge problems are retrieval problems; only defaults — format, style, prompt length, a smaller model — justify training.",
    svg:tree({t:'What is wrong?',kids:[{t:'behavior?\n→ prompt'},{t:'knowledge?\n→ RAG'},{t:'format/cost?\n→ fine-tune'}]},{label:'Prompt, RAG or fine-tune'})},
   {cap:"LoRA freezes the big matrix W and trains two thin ones. For d = 4,096 and r = 16 the adapter has 2 × 4,096 × 16 = 131,072 parameters — 0.78% of the 16.8 million it adjusts.",
    svg:svg(560,240,`${box(30,40,150,150,'W\n4,096 × 4,096\nfrozen\n16.8M params',{stroke:DIM,size:11})}${text(200,115,'+',{size:22,color:'currentColor'})}
      ${box(222,40,40,150,'B\nd × r',{stroke:CY,size:10})}${text(280,115,'·',{size:22,color:'currentColor'})}${box(300,95,150,40,'A   r × d',{stroke:CY,size:11})}
      ${text(500,115,'= W + BA',{size:13,color:MG,bold:true})}
      ${text(280,212,'r = 16:  2 × 4,096 × 16 = 131,072 trainable params (0.78%) · adapter ≈ tens of MB',{size:10,color:LM})}
      ${text(280,230,'QLoRA: store W in 4-bit NF4 → a 7B base ≈ 3.5–4 GB, fits a 16 GB T4',{size:10,color:DIM})}`,'LoRA low-rank adapter arithmetic')},
   {cap:"Why QLoRA fits a consumer GPU: full fine-tuning needs ≈ 16 bytes per parameter for weights, master copy, gradients and Adam moments; QLoRA keeps a 4-bit frozen base and trains only the adapters.",
    svg:compare({t:'FULL FINE-TUNE · 7B · AdamW',draw:x=>[['fp16 weights  14 GB'],['fp32 master copy  28 GB'],['gradients  14 GB'],['Adam moments  56 GB'],['= 112 GB + activations']].map((l,i)=>text(x+130,52+i*28,l[0],{size:11,color:i===4?AM:'currentColor',bold:i===4})).join('')},{t:'QLoRA · 7B · NF4 base',draw:x=>[['4-bit base  ≈ 3.5–4 GB'],['adapters  ≈ 0.1 GB'],['adapter optimizer  ≈ 0.3 GB'],['activations  2–5 GB'],['≈ 6–10 GB → 16 GB T4']].map((l,i)=>text(x+130,52+i*28,l[0],{size:11,color:i===4?LM:'currentColor',bold:i===4})).join('')},{h:200,label:'Training memory: full fine-tune vs QLoRA'})}];
  I.p34m6=[{cap:"The evaluation pyramid. Cheap deterministic checks and production monitoring run on everything; model judges grade samples; humans calibrate the judges and settle hard cases.",
    svg:pyramid([{t:'human review'},{t:'LLM-as-judge (swapped)'},{t:'exact match · F1 · schema validity'},{t:'production monitoring · traces · feedback'}],{label:'The evaluation pyramid'})},
   {cap:"One agent request as a trace: the invoke_agent span contains chat spans for each model call and execute_tool spans for each tool, each carrying model, token counts and prompt version. This is how a wrong answer gets found in two minutes.",
    svg:svg(560,300,`${text(280,20,'OpenTelemetry GenAI spans — one nightly health check (11 s)',{bold:true,size:11,color:CY})}
      ${[['invoke_agent',0,11,CY,'prompt_version 3 · 9.8K in / 900 out'],['chat (turn 1)',0.2,2.3,MG,'gen_ai.request.model · input_tokens'],['execute_tool ping ×3',2.3,2.5,AM,''],['chat (turn 2)',2.5,4.9,MG,''],['execute_tool disk_usage',4.9,5.6,AM,'result: /srv 91%'],['execute_tool tail_log',5.6,6.1,AM,'1 rejected path → error'],['chat (turn 3, report)',6.1,11,MG,'finish_reasons: end_turn']].map(([n,s,e,c,a],i)=>text(12,50+i*34,n,{anchor:'start',size:10})+box(185+s*33,42+i*34,Math.max(6,(e-s)*33),16,'',{fill:c,stroke:c,rx:3})+(a?text(187+s*33,68+i*34,a,{anchor:'start',size:9,color:DIM}):'')).join('')}
      ${line(185,282,548,282,{stroke:DIM})}${[0,2,4,6,8,10].map(s=>text(185+s*33,292,s+' s',{size:9,color:DIM})).join('')}`,'Trace waterfall of an agent request')},
   {cap:"Defense in depth for an LLM feature. No single layer stops injection or data exposure; filters, delimiting, least-privilege tools, output validation and tracing each catch what the others miss.",
    svg:flow([{t:'user / document\ninput'},{t:'input filters\n+ PII masking',stroke:CY},{t:'delimited,\nlabeled context',stroke:CY},{t:'model',stroke:'currentColor'},{t:'output validation\n(schema · escaping)',stroke:AM},{t:'tool allowlist\n+ approval',stroke:AM},{t:'trace · alert\n· eval case',stroke:LM}],{label:'Defense in depth for an LLM application'})}];
  I.p34m7=[{cap:"A production LLM application. The gateway holds keys and enforces auth, limits, budgets, routing, fallback, caching, masking and logging; behind it sit hosted and local models, retrieval, sandboxed tool servers, and the tracing-and-evals loop.",
    svg:svg(560,270,`${box(15,100,90,50,'client\n(app · Slack)',{size:10})}${arrow(105,125,135,125,'')}
      ${box(135,40,200,190,'',{stroke:CY})}${text(235,56,'AI GATEWAY',{bold:true,color:CY})}
      ${['auth · rate limit · budget','router + fallback + retries','semantic cache (TTL)','PII masking · logging'].map((t,i)=>box(148,70+i*38,174,30,t,{size:10,stroke:i===2?AM:DIM})).join('')}
      ${box(370,40,175,44,'hosted API\nHaiku default · Sonnet escalate',{stroke:MG,size:10})}${box(370,96,175,44,'local vLLM / llama-server\n(confidential traffic)',{stroke:MG,size:10})}
      ${box(370,152,175,38,'retrieval: pgvector + BM25 + rerank',{stroke:AM,size:9})}${box(370,200,175,38,'tool servers (MCP) in sandboxes',{stroke:AM,size:9})}
      ${arrow(335,62,370,62,'')}${arrow(335,118,370,118,'')}${arrow(335,171,370,171,'')}${arrow(335,219,370,219,'')}
      ${box(135,240,410,24,'tracing · dashboards · sampled judge → eval set grows',{stroke:LM,size:10})}`,'Architecture of a production LLM application')},
   {cap:"Concurrency is KV-cache arithmetic. Llama-3-8B needs 128 KB of cache per token (2 × 32 layers × 8 KV heads × 128 dims × 2 bytes), 1 GB per 8K conversation; quantizing the weights frees room for twice the conversations, and aggregate throughput follows.",
    svg:compare({t:'24 GB GPU · fp16 weights',draw:x=>[['weights  16 GB'],['free for KV cache  8 GB'],['128 KB/token × 8K = 1 GB each'],['→ ≈ 8 concurrent conversations']].map((l,i)=>text(x+130,56+i*30,l[0],{size:11,color:i===3?AM:'currentColor',bold:i===3})).join('')},{t:'24 GB GPU · 4-bit weights',draw:x=>[['weights  4.5 GB'],['free for KV cache  19.5 GB'],['1 GB per 8K conversation'],['→ ≈ 19 concurrent conversations']].map((l,i)=>text(x+130,56+i*30,l[0],{size:11,color:i===3?LM:'currentColor',bold:i===3})).join('')},{h:180,label:'KV cache memory and concurrency on a 24 GB GPU'})},
   {cap:"The Databricks Certified Generative AI Engineer Associate exam by section weight. Application Development and Assembling/Deploying are more than half the exam; Data Preparation is the RAG module in disguise.",
    svg:svg(560,230,`${text(280,20,'Exam sections (45 scored questions · 90 min · $200)',{bold:true,size:11,color:CY})}
      ${[['Design Applications',14,CY],['Data Preparation',14,CY],['Application Development',30,MG],['Assembling & Deploying',22,MG],['Governance',8,AM],['Evaluation & Monitoring',12,AM]].map(([n,w,c],i)=>text(12,52+i*28,n,{anchor:'start',size:10})+box(195,42+i*28,w*11,20,'',{fill:c,stroke:c,rx:3})+text(200+w*11+6,52+i*28,w+'%',{anchor:'start',size:10,color:c,bold:true})).join('')}
      ${text(280,222,'Modules 2–5 cover the 30% block; Modules 3 and 7 cover the next 36%',{size:10,color:DIM})}`,'Databricks GenAI Engineer Associate exam section weights')}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
