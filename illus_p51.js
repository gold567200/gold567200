/* Illustrations — Domain 51: Parallel Computing, HPC & GPU Programming, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  const poly=(pts,o={})=>`<polyline points="${pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')}" fill="none" stroke="${o.stroke||'currentColor'}" stroke-width="${o.sw||2}" ${o.dash?'stroke-dasharray="5 4"':''}/>`;
  const rect=(x,y,w,h,o={})=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${o.fill||'none'}" stroke="${o.stroke||'currentColor'}" stroke-width="${o.sw||1.2}" ${o.dash?'stroke-dasharray="4 3"':''}/>`;
  const dot=(x,y,c)=>`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="${c||'currentColor'}"/>`;
  const L2=Math.log2;

  /* ================= MODULE 1: why parallel ================= */
  const AX=lg=>60+lg/10*460, AY=lgS=>220-lgS/7*190;
  const amd=p=>Array.from({length:41},(_,i)=>{ const lg=i/4, N=2**lg, S=1/((1-p)+p/N); return [AX(lg),AY(L2(S))]; });
  const RX=I0=>60+(L2(I0)+4)/14*470, RY=P=>230-(L2(P)-4)/12*200;
  I.p51m1=[
   {cap:"Amdahl's law on log axes. Each curve flattens at 1/(1 − p): a program that is 95% parallel can never beat 20×, however many cores you add. At your laptop's 24 cores (dashed line) the 95% program gets 11.2× and the 99% program 19.5×, while the ideal line keeps climbing.",
    svg:svg(560,258,`${line(60,220,520,220)}${line(60,30,60,220)}
      ${[0,2,4,6,8,10].map((l,i)=>text(AX(l),234,['1','4','16','64','256','1024'][i],{size:10,color:DIM})).join('')}
      ${[0,1,2,3,4,5,6,7].map(l=>text(54,AY(l),String(2**l),{anchor:'end',size:10,color:DIM})).join('')}
      ${text(60,14,'speedup S (log scale)',{anchor:'start',size:10,color:DIM})}${text(290,250,'cores N (log scale)',{size:10,color:DIM})}
      ${poly([[AX(0),AY(0)],[AX(7),AY(7)]],{stroke:MG,dash:true,sw:1.5})}
      ${poly(amd(0.5),{stroke:DIM})}${poly(amd(0.9),{stroke:AM})}${poly(amd(0.95),{stroke:LM})}${poly(amd(0.99),{stroke:CY})}
      ${line(AX(L2(24)),30,AX(L2(24)),220,{dash:true,stroke:DIM})}${text(AX(L2(24))+4,210,'your 24 cores',{anchor:'start',size:10,color:DIM})}
      ${[[CY,'p = 0.99: at most 100×'],[LM,'p = 0.95: at most 20×'],[AM,'p = 0.90: at most 10×'],[DIM,'p = 0.50: at most 2×'],[MG,'ideal S = N (dashed)']].map((e,i)=>line(72,40+i*15,92,40+i*15,{stroke:e[0],sw:2})+text(98,40+i*15,e[1],{anchor:'start',size:10})).join('')}`,'Amdahl speedup curves for parallel fractions 0.5, 0.9, 0.95 and 0.99 versus core count')},
   {cap:"Measured-style rooflines for your two processors. Below the ridge a kernel's speed is bandwidth × intensity; above it, the flat compute roof. SAXPY, the image filter and batch-1 LLM decoding all sit on the GPU's slanted bandwidth line; only a big matrix multiply and heavily batched decoding reach the flat 45 TFLOP/s roof.",
    svg:svg(560,268,`${line(60,230,530,230)}${line(60,30,60,230)}
      ${[-4,-2,0,2,4,6,8,10].map((l,i)=>text(RX(2**l),244,['1/16','1/4','1','4','16','64','256','1K'][i],{size:10,color:DIM})).join('')}
      ${[16,128,1024,8192,65536].map((v,i)=>text(54,RY(v),['16','128','1K','8K','64K'][i],{anchor:'end',size:10,color:DIM})).join('')}
      ${text(8,14,'GFLOP/s (log)',{anchor:'start',size:10,color:DIM})}${text(295,260,'arithmetic intensity, FLOP per byte (log)',{size:10,color:DIM})}
      ${poly([[RX(1/16),RY(896/16)],[RX(45000/896),RY(45000)],[RX(1024),RY(45000)]],{stroke:CY,sw:2.2})}
      ${poly([[RX(16/89.6),RY(16)],[RX(1500/89.6),RY(1500)],[RX(1024),RY(1500)]],{stroke:AM,sw:2.2})}
      ${text(457,RY(45000)-13,'GPU: 45 TFLOP/s FP32',{size:10,color:CY})}${text(470,RY(1500)-8,'CPU: ~1.5 TFLOP/s',{size:10,color:AM})}
      ${dot(RX(0.167),RY(149.6),MG)}${text(RX(0.167)+6,RY(149.6)+14,'SAXPY 0.17',{anchor:'start',size:10})}
      ${dot(RX(2.25),RY(2016),MG)}${text(RX(2.25)-6,RY(2016)-8,'3×3 filter 2.25',{anchor:'end',size:10})}
      ${dot(RX(4),RY(3584),MG)}${text(RX(4)+8,RY(3584)+10,'LLM decode, batch 1: 4',{anchor:'start',size:10})}
      ${dot(RX(256),RY(45000),MG)}${text(RX(256),RY(45000)+14,'decode, batch 64',{size:10})}
      ${dot(RX(683),RY(45000),MG)}${text(RX(683),RY(45000)+28,'GEMM n = 4096',{size:10})}
      ${text(540,190,'GPU 896 GB/s · ridge ≈ 50 FLOP/B',{anchor:'end',size:10,color:CY})}${text(540,205,'CPU 89.6 GB/s · ridge ≈ 17 FLOP/B',{anchor:'end',size:10,color:AM})}`,'Roofline of the RTX 5090 Laptop GPU and the laptop CPU with five kernels placed')},
   {cap:"Strong versus weak scaling. Strong scaling splits one fixed job into thinner slices, so time should fall as 1/N until Amdahl's serial part stops it; weak scaling gives every worker the same slice and grows the job, so the ideal is a flat run time — Gustafson's case.",
    svg:compare({t:'STRONG: fixed problem',draw:x=>`${text(x+22,58,'N=1',{size:10,color:DIM})}${box(x+44,44,200,28,'whole problem',{size:10,stroke:CY})}
        ${text(x+22,98,'N=2',{size:10,color:DIM})}${box(x+44,84,98,28,'half',{size:10,stroke:CY})}${box(x+146,84,98,28,'half',{size:10,stroke:CY})}
        ${text(x+22,138,'N=4',{size:10,color:DIM})}${[0,1,2,3].map(i=>box(x+44+i*51,124,47,28,'¼',{size:11,stroke:CY})).join('')}
        ${text(x+130,168,'time falls as 1/N (Amdahl)',{size:10,color:LM})}`},
      {t:'WEAK: fixed work per worker',draw:x=>`${text(x+22,58,'N=1',{size:10,color:DIM})}${box(x+44,44,47,28,'piece',{size:10,stroke:MG})}
        ${text(x+22,98,'N=2',{size:10,color:DIM})}${[0,1].map(i=>box(x+44+i*51,84,47,28,'piece',{size:10,stroke:MG})).join('')}
        ${text(x+22,138,'N=4',{size:10,color:DIM})}${[0,1,2,3].map(i=>box(x+44+i*51,124,47,28,'piece',{size:10,stroke:MG})).join('')}
        ${text(x+130,168,'time stays flat (Gustafson)',{size:10,color:LM})}`},{h:186,label:'Strong scaling versus weak scaling'})},
   {cap:"Little's law sets how much memory traffic must be in flight to use the bandwidth you paid for: about 8 KB for the laptop's DDR5 and hundreds of kilobytes for the GPU's GDDR7. That is why CPUs prefetch and GPUs keep tens of thousands of threads resident.",
    svg:svg(560,150,`${box(20,24,130,40,'DDR5\n89.6 GB/s',{stroke:AM})}${text(170,44,'×',{size:18})}${box(190,24,120,40,'latency\n~90 ns')}${text(330,44,'=',{size:18})}${box(350,24,190,40,'~8 KB in flight\n≈ 126 cache lines',{stroke:AM})}
      ${box(20,84,130,40,'GDDR7\n896 GB/s',{stroke:CY})}${text(170,104,'×',{size:18})}${box(190,84,120,40,'latency\n~500 ns')}${text(330,104,'=',{size:18})}${box(350,84,190,40,'~450 KB in flight\n≈ 5.5 KB per SM',{stroke:CY})}
      ${text(280,142,'too few requests in flight and the bandwidth sits idle',{size:10,color:DIM})}`,"Little's law for the laptop DRAM and the GPU memory")}];

  /* ================= MODULE 2: shared-memory parallelism ================= */
  const lanesY=[30,58,86,114,142,170], lens=[250,232,262,240,226,256];
  I.p51m2=[
   {cap:"OpenMP's fork–join model. The master thread forks a team at the parallel region, each thread takes its share of the loop, and everyone waits at the implicit barrier; the region takes as long as the slowest thread, which is why load balance matters.",
    svg:svg(560,200,`${text(280,12,'#pragma omp parallel for: fork a team, share the loop, join',{size:10,color:DIM})}
      ${line(20,100,96,100,{sw:2})}${text(58,90,'master',{size:10,color:DIM})}${text(94,118,'fork',{anchor:'end',size:10,color:AM})}
      ${lanesY.map((y,i)=>line(96,100,130,y)+box(130,y-9,lens[i],18,'',{stroke:CY})+text(136,y,'T'+i+' iterations',{anchor:'start',size:9})+line(130+lens[i],y,420,y,{dash:true,stroke:DIM})+line(420,y,450,100)).join('')}
      ${line(420,20,420,180,{stroke:MG,sw:2})}${text(420,192,'implicit barrier',{size:10,color:MG})}
      ${line(450,100,540,100,{sw:2})}${text(495,90,'master',{size:10,color:DIM})}${text(454,118,'join',{anchor:'start',size:10,color:AM})}`,'Fork-join execution of an OpenMP parallel loop')},
   {cap:"False sharing. Left: eight per-thread counters share one 64-byte line, so each write by core 0 invalidates core 1's copy and the line ping-pongs between them. Right: padding each counter to its own line lets every core keep its line in the Modified state.",
    svg:compare({t:'FALSE SHARING',draw:x=>`${box(x+30,40,80,28,'core 0',{stroke:CY})}${box(x+150,40,80,28,'core 1',{stroke:MG})}
        ${[0,1,2,3,4,5,6,7].map(i=>box(x+18+i*28,100,28,24,'c'+i,{size:10,stroke:i===0?CY:(i===1?MG:DIM)})).join('')}
        ${arrow(x+70,68,x+32,98,'',{stroke:CY})}${arrow(x+190,68,x+60,98,'',{stroke:MG})}
        ${text(x+130,142,'one 64-byte line, 8 counters',{size:10})}${text(x+130,158,'ping-pongs on every write',{size:10,color:MG})}`},
      {t:'PADDED TO 64 BYTES',draw:x=>`${box(x+30,40,80,28,'core 0',{stroke:CY})}${box(x+150,40,80,28,'core 1',{stroke:MG})}
        ${box(x+10,100,26,24,'c0',{size:10,stroke:CY})}${box(x+36,100,88,24,'pad 56 B',{size:10,stroke:DIM,dash:true})}
        ${box(x+136,100,26,24,'c1',{size:10,stroke:MG})}${box(x+162,100,88,24,'pad 56 B',{size:10,stroke:DIM,dash:true})}
        ${arrow(x+60,68,x+28,98,'',{stroke:CY})}${arrow(x+190,68,x+152,98,'',{stroke:MG})}
        ${text(x+130,142,'two lines, one per core',{size:10})}${text(x+130,158,'no ping-pong',{size:10,color:LM})}`},{h:180,label:'False sharing versus padded counters'})},
   {cap:"Static versus dynamic scheduling on a hybrid CPU, sketched with two P-cores and two E-cores (an E-core doing 0.6 of a P-core's work). Equal static shares leave the P-cores idle 40% of the run while the E-cores finish; dynamic chunks let the fast cores take more work, finishing at 188 time units instead of 250.",
    svg:svg(560,236,`${text(10,18,'schedule(static): equal shares',{anchor:'start',size:11,color:CY})}
      ${[0,1,2,3].map(i=>{ const y=30+i*18, P=i<2; return text(76,y+7,P?'P-core':'E-core',{anchor:'end',size:10})+(P?box(80,y,150,14,'',{stroke:CY})+line(230,y+7,330,y+7,{dash:true,stroke:DIM}):box(80,y,250,14,'',{stroke:AM})); }).join('')}
      ${line(330,26,330,104,{stroke:MG,dash:true})}${text(336,52,'E-cores finish last',{anchor:'start',size:10,color:MG})}${text(336,70,'P-cores idle 40% of the run',{anchor:'start',size:10,color:DIM})}
      ${text(10,122,'schedule(dynamic): grab chunks',{anchor:'start',size:11,color:LM})}
      ${[0,1,2,3].map(i=>{ const y=134+i*18, P=i<2, cw=P?25:41.67, n=P?7:4, tail=187.5-n*cw; let s=text(76,y+7,P?'P-core':'E-core',{anchor:'end',size:10}); for(let k=0;k<n;k++) s+=rect(80+k*cw,y,cw,14,{stroke:P?CY:AM}); s+=rect(80+n*cw,y,tail,14,{stroke:P?CY:AM}); return s; }).join('')}
      ${line(267.5,130,267.5,208,{stroke:LM,dash:true})}${text(274,156,'all finish together',{anchor:'start',size:10,color:LM})}${text(274,172,'188 vs 250 time units',{anchor:'start',size:10,color:DIM})}
      ${arrow(80,218,540,218,'')}${text(310,230,'time',{size:10,color:DIM})}`,'Gantt chart of static versus dynamic OpenMP scheduling on P-cores and E-cores')},
   {cap:"NUMA first touch on a two-socket server. Initialize an array serially and Linux places every page on node 0, so threads on socket 1 read remotely across the inter-socket link; initialize it in parallel with the compute loop's schedule and every thread's pages are local.",
    svg:compare({t:'SERIAL INIT',draw:x=>`${box(x+14,40,84,40,'socket 0\ncores 0–11',{size:10,stroke:CY})}${box(x+162,40,84,40,'socket 1\ncores 12–23',{size:10,stroke:CY})}
        ${box(x+14,112,84,36,'RAM node 0\nall pages',{size:10,stroke:MG})}${box(x+162,112,84,36,'RAM node 1\nempty',{size:10,stroke:DIM,dash:true,color:DIM})}
        ${arrow(x+56,80,x+56,110,'')}${arrow(x+170,80,x+94,112,'remote',{stroke:MG})}
        ${text(x+130,168,'every page on node 0',{size:10,color:MG})}`},
      {t:'PARALLEL INIT',draw:x=>`${box(x+14,40,84,40,'socket 0\ncores 0–11',{size:10,stroke:CY})}${box(x+162,40,84,40,'socket 1\ncores 12–23',{size:10,stroke:CY})}
        ${box(x+14,112,84,36,'RAM node 0\nhalf the pages',{size:10,stroke:LM})}${box(x+162,112,84,36,'RAM node 1\nhalf the pages',{size:10,stroke:LM})}
        ${arrow(x+56,80,x+56,110,'')}${arrow(x+204,80,x+204,110,'')}
        ${text(x+130,168,'every access local',{size:10,color:LM})}`},{h:186,label:'NUMA first-touch placement with serial versus parallel initialization'})}];

  /* ================= MODULE 3: synchronization and memory models ================= */
  const costs=[['L1 hit',1,'about 1 ns',LM],['uncontended atomic',10,'about 10 ns',CY],['line moves between cores',100,'about 100 ns',AM],['contended mutex (futex)',3000,'microseconds',MG],['thread create + join',30000,'tens of µs',MG]];
  I.p51m3=[
   {cap:"The cost ladder of synchronization, each rung roughly ten times the one before (typical orders of magnitude on a modern CPU; measure your own). Designs that are fast at scale keep the hot path on the bottom rungs: local accumulation, then one publish.",
    svg:svg(560,214,`${text(280,14,'order-of-magnitude costs, log scale: each step ≈ 10×',{size:10,color:DIM})}
      ${costs.map((c,i)=>{ const y=30+i*32, len=8+Math.log10(c[1])*64; return text(222,y+11,c[0],{anchor:'end',size:11})+(i===0?box(230,y,len,22,'',{stroke:c[3]})+text(244,y+11,c[2],{anchor:'start',size:10}):box(230,y,len,22,c[2],{size:10,stroke:c[3]})); }).join('')}
      ${text(280,200,'count the synchronizations, then multiply by their cost',{size:10,color:DIM})}`,'Order-of-magnitude costs of synchronization operations')},
   {cap:"The store-buffer litmus test. Each core parks its store in a private store buffer and its following load reads memory directly, so both loads can return 0 — an outcome sequential consistency forbids and x86-TSO allows. A fence, a seq_cst store or a lock restores the order.",
    svg:svg(560,224,`${box(30,18,200,44,'core 1\nx = 1;   r1 = y;',{stroke:CY})}${box(330,18,200,44,'core 2\ny = 1;   r2 = x;',{stroke:MG})}
      ${box(30,86,150,30,'store buffer: x = 1',{stroke:AM,dash:true,size:11})}${box(380,86,150,30,'store buffer: y = 1',{stroke:AM,dash:true,size:11})}
      ${box(130,160,300,40,'memory: x = 0, y = 0',{stroke:CY})}
      ${arrow(105,62,105,84,'')}${arrow(455,62,455,84,'')}
      ${arrow(215,62,250,158,'reads y = 0',{stroke:LM})}${arrow(345,62,310,158,'reads x = 0',{stroke:LM})}
      ${arrow(105,116,170,158,'later',{dash:true,stroke:DIM})}${arrow(455,116,390,158,'later',{dash:true,stroke:DIM})}
      ${text(280,214,'x86-TSO allows r1 = r2 = 0; a fence or seq_cst store forbids it',{size:10,color:DIM})}`,'Store buffering lets both loads read zero on x86')},
   {cap:"Release–acquire message passing. The producer's release store publishes everything written before it; the consumer's acquire load that reads the flag synchronizes with that store, so the read of data is guaranteed to see 42 — on x86 and on Arm alike.",
    svg:svg(560,190,`${text(20,40,'producer',{anchor:'start',size:11,color:DIM})}${text(20,140,'consumer',{anchor:'start',size:11,color:DIM})}
      ${box(100,22,150,36,'data = 42',{stroke:AM})}${arrow(250,40,288,40,'')}${box(290,22,190,36,'flag.store(1, release)',{stroke:CY})}
      ${box(100,122,190,36,'flag.load(acquire) == 1',{stroke:CY})}${arrow(290,140,328,140,'')}${box(330,122,150,36,'read data → 42',{stroke:LM})}
      ${arrow(385,58,195,120,'synchronizes-with',{stroke:MG})}
      ${text(280,180,'everything before the release is visible after the acquire',{size:10,color:DIM})}`,'Release and acquire ordering between a producer and a consumer')}];

  /* ================= MODULE 4: distributed memory and clusters ================= */
  I.p51m4=[
   {cap:"Domain decomposition with a halo. The 8192² grid is split into a 4 × 4 process grid; rank 5 owns a 2048² block surrounded by one ring of ghost cells, and each step it trades 2048 × 8 bytes = 16 KB with each of its four neighbours before updating its interior.",
    svg:svg(560,236,`${text(110,22,'16 ranks, 4 × 4 process grid',{size:10,color:DIM})}
      ${Array.from({length:16},(_,r)=>{ const row=Math.floor(r/4), col=r%4; return box(30+col*40,34+row*40,40,40,'r'+r,{size:10,stroke:r===5?MG:([1,4,6,9].includes(r)?CY:DIM),sw:r===5?2:1.3}); }).join('')}
      ${text(110,210,'8192² doubles, 2048² per rank',{size:10,color:DIM})}
      ${line(192,94,328,120,{dash:true,stroke:DIM})}
      ${box(330,40,160,160,'',{dash:true,stroke:AM})}${box(346,56,128,128,'rank 5 owns\n2048 × 2048\ncells',{stroke:MG})}${text(410,48,'ghost cells',{size:9,color:AM})}
      ${arrow(410,38,410,14,'')}${text(420,14,'16 KB to north',{anchor:'start',size:10})}
      ${arrow(410,202,410,226,'')}${text(420,222,'16 KB to south',{anchor:'start',size:10})}
      ${arrow(328,120,304,120,'')}${text(300,134,'16 KB',{anchor:'end',size:10})}
      ${arrow(492,120,516,120,'')}${text(520,106,'16 KB',{anchor:'start',size:10})}`,'Two-dimensional domain decomposition and halo exchange for one rank')},
   {cap:"Ring allreduce. A reduce-scatter passes partial sums around the ring for p − 1 steps, then an allgather circulates the finished pieces for p − 1 more; every rank sends 2(p − 1)/p × n bytes, about 2n however many ranks there are, which makes it bandwidth-optimal.",
    svg:svg(560,206,`${box(82,30,56,28,'rank 0',{size:10,stroke:CY})}${box(162,96,56,28,'rank 1',{size:10,stroke:CY})}${box(82,162,56,28,'rank 2',{size:10,stroke:CY})}${box(2,96,56,28,'rank 3',{size:10,stroke:CY})}
      ${arrow(138,52,170,94,'')}${arrow(172,124,138,166,'')}${arrow(82,168,50,124,'')}${arrow(48,96,84,56,'')}
      ${text(110,110,'ring, p = 4',{size:10,color:DIM})}
      ${box(250,26,290,38,'reduce-scatter: p − 1 = 3 steps\neach step sends n/4',{size:11,stroke:CY})}
      ${box(250,76,290,38,'allgather: 3 more steps\neach step sends n/4',{size:11,stroke:AM})}
      ${box(250,126,290,42,'per rank: 6 × n/4 = 1.5n\n= 2(p − 1)/p × n, about 2n for large p',{size:11,stroke:LM})}
      ${text(395,192,'1 GB on 8 GPUs at 50 GB/s: 1.75 GB sent, 35 ms',{size:10,color:LM})}`,'Ring allreduce steps and bytes per rank')},
   {cap:"A Slurm job's life. sbatch queues it, the priority score (fair-share, age, size) orders it, backfill starts it early only if its time limit fits before the next reservation, srun launches the ranks, and sacct records what it used.",
    svg:flow([{t:'sbatch job.sh',stroke:CY},{t:'PENDING\npriority queue',edge:'submit'},{t:'backfill: fits\nbefore reservation?',edge:'score',stroke:AM},{t:'RUNNING\nsrun on nodes',stroke:LM,edge:'start'},{t:'COMPLETED\nsacct, checkpoint',edge:'finish'}],{perRow:3,bw:130,gap:50,bh:54,label:'Lifecycle of a Slurm batch job'})},
   {cap:"Checkpoint and restart on a timeline. Work since the last checkpoint is lost when a node fails, so the interval is a trade: Young's τ ≈ √(2CM) balances the time spent writing checkpoints against the expected rework.",
    svg:svg(560,170,`${box(20,60,110,30,'compute',{stroke:CY})}${box(130,60,18,30,'',{stroke:AM})}${box(148,60,110,30,'compute',{stroke:CY})}${box(258,60,18,30,'',{stroke:AM})}
      ${box(276,60,70,30,'compute',{stroke:CY,dash:true,color:DIM})}${line(346,54,346,96,{stroke:MG,sw:2})}${text(346,108,'node fails',{size:10,color:MG})}
      ${box(350,60,90,30,'restart + redo',{size:11,stroke:MG})}${box(440,60,90,30,'compute',{stroke:CY})}
      ${text(139,104,'C',{size:10,color:AM})}${text(267,104,'C',{size:10,color:AM})}
      ${line(148,122,258,122)}${line(148,116,148,128)}${line(258,116,258,128)}${text(203,136,'τ ≈ √(2CM)',{size:10})}
      ${line(276,122,346,122,{stroke:MG})}${text(311,136,'work lost',{size:10,color:MG})}
      <path d="M346 56 C 330 20, 292 20, 278 56" fill="none" stroke="${MG}" stroke-width="1.3" marker-end="url(#ah)"/>${text(311,18,'restart from last checkpoint',{size:10,color:MG})}
      ${text(280,158,'C = 5 min, MTBF = 263 min → τ ≈ 51 min, about 20% lost',{size:10,color:DIM})}`,'Timeline of computing, checkpoints, a node failure and restart')}];

  /* ================= MODULE 5: GPU architecture ================= */
  I.p51m5=[
   {cap:"Your RTX 5090 Laptop GPU from the outside in. 82 SMs share a 64 MB L2 cache and a 256-bit GDDR7 interface delivering 896 GB/s; inside each SM, four processing blocks each own a warp scheduler, 32 FP32 lanes, a quarter of the register file and a tensor core, and share 128 KB of L1/shared memory.",
    svg:svg(560,262,`${box(10,24,330,232,'',{stroke:DIM,dash:true})}${text(175,14,'RTX 5090 Laptop GPU (GB203)',{bold:true,color:CY})}
      ${Array.from({length:24},(_,k)=>box(24+(k%8)*39,36+Math.floor(k/8)*32,32,26,'SM',{size:10,stroke:k===0?CY:DIM})).join('')}
      ${text(175,140,'… 82 SMs in total, 10,496 FP32 lanes',{size:10})}
      ${box(24,152,305,26,'L2 cache, about 64 MB, shared by all SMs',{size:10,stroke:AM})}
      ${text(175,194,'24 GB GDDR7 · 256-bit · 896 GB/s',{size:10,color:LM})}
      ${Array.from({length:8},(_,k)=>box(24+k*38,212,36,24,'GDDR7',{size:9,stroke:LM})).join('')}
      ${box(352,24,198,232,'',{stroke:CY})}${text(451,14,'one SM (×82)',{bold:true,color:CY})}
      ${[[360,34],[454,34],[360,110],[454,110]].map(p=>box(p[0],p[1],88,70,'warp sched.\n32 FP32 lanes\n16K registers\ntensor core',{size:10})).join('')}
      ${box(360,188,184,26,'L1 / shared memory: 128 KB',{size:10,stroke:LM})}${text(451,236,'up to 48 warps resident',{size:10,color:DIM})}`,'Block diagram of the RTX 5090 Laptop GPU and one streaming multiprocessor')},
   {cap:"The GPU memory hierarchy, fastest and smallest at the top. Every step down costs roughly an order of magnitude in latency; the bottom step, PCIe to host RAM, is at least 14× narrower than VRAM, so data that has to cross it every step dominates the run.",
    svg:stack([{t:'registers: 256 KB per SM',stroke:LM,side:'~1 cycle, per thread'},{t:'shared memory / L1: 128 KB per SM',stroke:CY,side:'tens of cycles, per block'},{t:'L2 cache: about 64 MB',side:'hundreds of cycles'},{t:'GDDR7: 24 GB at 896 GB/s',stroke:AM,side:'several hundred cycles'},{t:'host RAM over PCIe: 64 GB',stroke:MG,side:'µs; ≥14× less bandwidth'}],{w:300,side:true,label:'GPU memory hierarchy from registers to host RAM'})},
   {cap:"Two memory designs. The laptop's GPU has its own 24 GB of fast VRAM behind a PCIe link to 64 GB of system RAM, so a model must fit in VRAM; the M5 Ultra's CPU, GPU and Neural Engine share one pool of up to 512 GB at 1.2 TB/s with no copies.",
    svg:compare({t:'RTX 5090 LAPTOP',draw:x=>`${box(x+16,40,100,34,'CPU (24 cores)',{size:10})}${box(x+144,40,100,34,'GPU (82 SMs)',{size:10,stroke:CY})}
        ${line(x+116,57,x+144,57,{stroke:MG,sw:2})}${text(x+130,100,'PCIe ≈ 63 GB/s',{size:10,color:MG})}
        ${line(x+66,74,x+66,120)}${line(x+194,74,x+194,120)}
        ${box(x+16,120,100,34,'DDR5 64 GB\n89.6 GB/s',{size:10})}${box(x+144,120,100,34,'GDDR7 24 GB\n896 GB/s',{size:10,stroke:CY})}
        ${text(x+130,178,'the model must fit in 24 GB',{size:10,color:AM})}`},
      {t:'M5 ULTRA MAC STUDIO',draw:x=>`${box(x+12,40,70,34,'CPU',{size:10})}${box(x+95,40,70,34,'GPU\n80 cores',{size:10,stroke:CY})}${box(x+178,40,70,34,'Neural\nEngine',{size:10})}
        ${line(x+47,74,x+47,120)}${line(x+130,74,x+130,120)}${line(x+213,74,x+213,120)}
        ${box(x+12,120,236,34,'unified memory: up to 512 GB\n1.2 TB/s, no copies',{size:10,stroke:LM})}
        ${text(x+130,178,'capacity for 70B-plus models',{size:10,color:LM})}`},{h:196,label:'Discrete GPU memory versus Apple unified memory'})},
   {cap:"Branch divergence inside one warp. When even and odd lanes take different paths, the warp executes both paths one after the other with half its lanes masked each time; branching on the warp index instead keeps all 32 lanes busy in a single pass.",
    svg:svg(560,172,`${text(60,22,'pass 1, if (lane % 2 == 0): odd lanes masked',{anchor:'start',size:10})}
      ${Array.from({length:32},(_,i)=>rect(60+i*15,30,13,18,{stroke:i%2===0?CY:DIM,dash:i%2!==0})).join('')}
      ${text(60,64,'pass 2, else: even lanes masked',{anchor:'start',size:10})}
      ${Array.from({length:32},(_,i)=>rect(60+i*15,72,13,18,{stroke:i%2===1?AM:DIM,dash:i%2!==1})).join('')}
      ${text(60,110,'branch on warp index instead: one pass, all lanes busy',{anchor:'start',size:10,color:LM})}
      ${Array.from({length:32},(_,i)=>rect(60+i*15,118,13,18,{stroke:LM})).join('')}
      ${text(280,160,'divergent warp: two passes at 50% each',{size:10,color:MG})}`,'Lane activity of a divergent warp versus a uniform warp')}];

  /* ================= MODULE 6: CUDA programming ================= */
  I.p51m6=[
   {cap:"How a thread finds its element. With 8 threads per block (256 in real code), thread 5 of block 2 computes i = blockIdx.x × blockDim.x + threadIdx.x = 2 × 8 + 5 = 21 and works on element 21; a grid-stride loop then adds the total thread count to cover arrays of any size.",
    svg:svg(560,200,`${[0,1,2,3].map(b=>{ const bx=20+b*132, hot=b===2; let s=text(bx+62,22,'blockIdx.x = '+b,{size:10,color:hot?MG:DIM})+rect(bx,30,124,40,{stroke:hot?MG:DIM});
        for(let t=0;t<8;t++){ const tx=bx+2+t*15, me=hot&&t===5; s+=rect(tx,40,13,22,{stroke:me?MG:CY,sw:me?2:1.2})+text(tx+6.5,51,String(t),{size:9,color:me?MG:'currentColor'}); } return s; }).join('')}
      ${text(20,88,'blockDim.x = 8 (256 in real code)',{anchor:'start',size:10,color:DIM})}${text(20,130,'global array',{anchor:'start',size:10,color:DIM})}
      ${Array.from({length:32},(_,i)=>rect(24+i*16,140,16,20,{stroke:i===21?MG:DIM,sw:i===21?2:1.2})).join('')}
      ${[0,4,8,12,16,24,28].map(i=>text(32+i*16,172,String(i),{size:9,color:DIM})).join('')}${text(32+21*16,172,'21',{size:9,color:MG})}
      ${arrow(367.5,64,368,138,'',{stroke:MG})}
      ${text(280,190,'i = blockIdx.x × blockDim.x + threadIdx.x = 2 × 8 + 5 = 21',{size:11,color:MG})}`,'Mapping a CUDA thread to an array element')},
   {cap:"Memory coalescing. When a warp's 32 threads read 32 consecutive floats, the hardware fetches four 32-byte sectors and uses every byte; with a stride of 8 floats each thread lands in its own sector, so 32 sectors (1,024 bytes) are fetched for 128 useful bytes.",
    svg:compare({t:'STRIDE 1: COALESCED',draw:x=>`${box(x+20,40,220,26,'warp: 32 threads, 32 floats',{size:10,stroke:CY})}
        ${[0,1,2,3,4,5,6,7].map(i=>box(x+20+i*28,108,26,26,'',{stroke:i<4?LM:DIM,dash:i>=4})).join('')}
        ${[0,1,2,3].map(i=>arrow(x+60+i*40,66,x+33+i*28,106,'',{stroke:LM})).join('')}
        ${text(x+130,152,'4 sectors, 128 B, all used',{size:10,color:LM})}${text(x+130,168,'efficiency 100%',{size:10})}`},
      {t:'STRIDE 8: SCATTERED',draw:x=>`${box(x+20,40,220,26,'warp: 32 threads, stride 8',{size:10,stroke:MG})}
        ${[0,1,2,3,4,5,6,7].map(i=>box(x+20+i*28,108,26,26,'',{stroke:DIM})+rect(x+21+i*28,109,4,24,{stroke:MG,fill:MG})).join('')}
        ${[0,1,2,3,4,5,6,7].map(i=>arrow(x+40+i*26,66,x+33+i*28,106,'',{stroke:MG})).join('')}
        ${text(x+130,152,'32 sectors, 1,024 B fetched',{size:10,color:MG})}${text(x+130,168,'128 B used: 12.5%',{size:10})}`},{h:186,label:'Coalesced versus strided warp memory access'})},
   {cap:"Shared-memory tiling of C = A × B. A block computing one tile of C walks a strip of tiles across A and down B; each pair of tiles is loaded once into shared memory, used 32 times from on-chip memory, then replaced — raising global-memory intensity from 0.25 to about 8 FLOP per byte.",
    svg:svg(560,240,`${box(20,120,100,100,'',{stroke:DIM})}${box(140,10,100,100,'',{stroke:DIM})}${box(140,120,100,100,'',{stroke:DIM})}
      ${box(20,150,100,20,'',{stroke:CY})}${box(60,150,20,20,'',{stroke:AM,sw:2.2})}${box(180,10,20,100,'',{stroke:CY})}${box(180,50,20,20,'',{stroke:AM,sw:2.2})}${box(180,150,20,20,'',{stroke:LM,sw:2.2})}
      ${arrow(24,180,116,180,'')}${arrow(210,14,210,106,'')}
      ${text(70,232,'A',{bold:true})}${text(250,60,'B',{bold:true,anchor:'start'})}${text(190,232,'C',{bold:true})}${text(70,140,'strip of A',{size:9,color:CY})}${text(190,140,'C tile',{size:9,color:LM})}
      ${box(290,14,260,30,'1. load one A tile + one B tile, coalesced',{size:10,stroke:AM})}
      ${box(290,52,260,30,'2. __syncthreads(): tiles complete',{size:10,stroke:DIM})}
      ${box(290,90,260,30,'3. 32 FMAs per thread from shared memory',{size:10,stroke:CY})}
      ${box(290,128,260,30,'4. __syncthreads(); slide to next tiles',{size:10,stroke:DIM})}
      ${box(290,166,260,30,'5. write the C tile once',{size:10,stroke:LM})}
      ${text(420,216,'reuse: 0.25 → 8 FLOP/B with T = 32',{size:11,color:LM})}`,'Tiled matrix multiply with shared-memory tiles and the five kernel steps')},
   {cap:"Streams overlap copies with compute. One stream runs a 40 ms upload, a 20 ms kernel and a 40 ms download back to back; split into four chunks on four streams with pinned memory and separate upload and download engines, the stages pipeline and the job takes about 55 ms.",
    svg:svg(560,212,`${text(104,41,'one stream',{anchor:'end',size:10})}${box(110,30,160,22,'upload 40 ms',{size:10,stroke:AM})}${box(270,30,80,22,'kernel',{size:10,stroke:CY})}${box(350,30,160,22,'download 40 ms',{size:10,stroke:LM})}${text(510,64,'100 ms',{size:10,color:DIM})}
      ${text(10,82,'four streams, pinned memory',{anchor:'start',size:10,color:DIM})}
      ${text(104,101,'upload',{anchor:'end',size:10})}${text(104,131,'kernel',{anchor:'end',size:10})}${text(104,161,'download',{anchor:'end',size:10})}
      ${[0,1,2,3].map(k=>box(110+k*40,90,40,22,'c'+k,{size:10,stroke:AM})+rect(150+k*40,120,20,22,{stroke:CY})+box(170+k*40,150,40,22,'c'+k,{size:10,stroke:LM})).join('')}
      ${line(330,86,330,178,{stroke:MG,dash:true})}${text(336,131,'done at 55 ms',{anchor:'start',size:10,color:MG})}
      ${text(280,202,'pinned memory + streams: copies hide behind compute',{size:10,color:DIM})}`,'Timeline of serial versus stream-overlapped copies and kernels')}];

  /* ================= MODULE 7: performance engineering and HPC for AI ================= */
  const dec=[[4.5,'8B at 4-bit (4.5 GB)'],[18,'32B at 4-bit (18 GB)'],[40,'70B at 4-bit (40 GB)']], mach=[[896,24,CY],[614,128,AM],[1200,512,LM]];
  const BY=v=>210-v*(170/300);
  I.p51m7=[
   {cap:"Three ways to split training across GPUs. Data parallelism copies the whole model and averages gradients; tensor parallelism splits each layer's matrices and needs NVLink-class bandwidth for its per-layer allreduces; pipeline parallelism assigns consecutive layers to stages and streams micro-batches through, paying a bubble of (p − 1)/(m + p − 1).",
    svg:svg(560,226,`${[6,192,378].map((x,i)=>box(x,10,176,206,'',{dash:true,stroke:DIM})+text(x+88,26,['data parallel','tensor parallel','pipeline parallel'][i],{bold:true,color:[CY,MG,AM][i]})).join('')}
      ${[0,1,2].map(g=>[0,1,2].map(l=>box(16+g*54,40+l*30,46,26,'L'+(l+1),{size:10,stroke:CY})).join('')+text(39+g*54,138,'GPU '+g,{size:9,color:DIM})).join('')}
      ${text(94,164,'full model on every GPU',{size:10})}${text(94,180,'own slice of the batch',{size:10})}${text(94,196,'allreduce the gradients',{size:10,color:CY})}
      ${[0,1].map(l=>[0,1,2].map(g=>box(202+g*52,44+l*48,50,34,'GPU '+g,{size:10,stroke:MG})).join('')+text(280,40+l*48+46,'layer '+(l+1)+' split 3 ways',{size:9,color:DIM})).join('')}
      ${text(280,164,'each layer split',{size:10})}${text(280,180,'allreduce every layer',{size:10})}${text(280,196,'needs NVLink bandwidth',{size:10,color:MG})}
      ${[0,1,2].map(s=>box(398,40+s*36,136,26,'GPU '+s+': layers '+(s*4+1)+'–'+(s*4+4),{size:10,stroke:AM})).join('')}${arrow(466,66,466,74,'')}${arrow(466,102,466,110,'')}
      ${text(466,164,'stages of layers',{size:10})}${text(466,180,'micro-batches stream through',{size:10})}${text(466,196,'bubble (p−1)/(m+p−1)',{size:10,color:AM})}`,'Data, tensor and pipeline parallelism side by side')},
   {cap:"Batch-1 decode ceilings from bandwidth ÷ bytes per token (weights only; the KV cache lowers them further). A model that does not fit in the laptop's 24 GB (the 70B case) cannot use its bandwidth at all, while the M5 Ultra's 1.2 TB/s gives the highest ceiling for every size.",
    svg:svg(560,252,`${line(60,210,540,210)}${line(60,40,60,210)}
      ${[0,100,200,300].map(v=>text(54,BY(v),String(v),{anchor:'end',size:10,color:DIM})+line(60,BY(v),540,BY(v),{stroke:DIM,dash:true,sw:0.5})).join('')}
      ${text(64,31,'tokens/s',{anchor:'start',size:10,color:DIM})}
      ${[['RTX 5090 Laptop 896 GB/s',CY,70],['M5 Max 614 GB/s',AM,260],['M5 Ultra 1.2 TB/s',LM,400]].map(e=>rect(e[2],12,10,10,{stroke:e[1],fill:e[1]})+text(e[2]+14,17,e[0],{anchor:'start',size:10})).join('')}
      ${dec.map((d,gi)=>{ const gx=80+gi*160; let s=text(gx+51,226,d[1],{size:10}); mach.forEach((m,mi)=>{ const bx=gx+mi*34; if(d[0]>m[1]*0.9){ s+=text(bx+15,204,'×',{size:12,color:MG}); return; } const v=m[0]/d[0]; s+=rect(bx,BY(v),30,210-BY(v),{stroke:m[2],fill:m[2]})+text(bx+15,BY(v)-6,String(Math.round(v)),{size:10}); }); return s; }).join('')}
      ${text(451,160,'laptop: does not fit',{size:10,color:MG})}
      ${text(300,244,'ceiling = bandwidth ÷ bytes per token (weights only)',{size:10,color:DIM})}`,'Decode ceilings for three model sizes on three machines')},
   {cap:"The performance-engineering loop. Measure a baseline, profile top-down, classify the bottleneck against the roofline, change exactly one thing, and re-measure — writing every result down, and stopping when you are near the roof or the goal is met.",
    svg:cycle(['measure\nbaseline','profile\n(nsys, perf)','classify\n(roofline)','change\none thing','re-measure\nand record'],{label:'Measure, profile, classify, change, re-measure loop'})},
   {cap:"Number formats drawn to scale, one cell per bit. Every halving of width halves memory and the bytes a memory-bound decode must read, but shrinks the exponent (range) and mantissa (precision) — which is why FP8 and FP4 need scale factors and why accuracy must be measured.",
    svg:svg(560,212,`${rect(90,8,10,10,{stroke:MG,fill:MG})}${text(104,13,'sign',{anchor:'start',size:10})}${rect(150,8,10,10,{stroke:AM,fill:AM})}${text(164,13,'exponent (range)',{anchor:'start',size:10})}${rect(270,8,10,10,{stroke:CY})}${text(284,13,'mantissa (precision)',{anchor:'start',size:10})}
      ${[['FP32',8,23,'8 exp · 23 mant'],['BF16',8,7,'8 exp · 7 mant'],['FP16',5,10,'5 exp · 10 mant · max 65,504'],['FP8 E4M3',4,3,'4 exp · 3 mant'],['FP4 E2M1',2,1,'2 exp · 1 mant · 16 values']].map((f,r)=>{ const y=32+r*32, bits=1+f[1]+f[2]; let s=text(84,y+9,f[0],{anchor:'end',size:11});
        for(let b=0;b<bits;b++){ const c=b===0?MG:(b<=f[1]?AM:CY); s+=rect(90+b*10,y,10,18,{stroke:c,fill:b<=f[1]?c:'none'}); } return s+text(96+bits*10,y+9,f[3],{anchor:'start',size:10}); }).join('')}
      ${text(280,202,'fewer bits → fewer bytes per token → faster decode',{size:10,color:DIM})}`,'Bit layouts of FP32, BF16, FP16, FP8 and FP4')}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
