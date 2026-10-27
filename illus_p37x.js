/* Third figures — Domain 37: Distributed Systems: Consensus, Replication, Microservices & Streaming. Adds to the figures in illus_p37.js (never replaces them). */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const add=(id,figs)=>{ window.ILLUS=window.ILLUS||{}; window.ILLUS[id]=(window.ILLUS[id]||[]).concat(figs); };

  /* m1 — the tail at scale */
  const grid=()=>{ let s=''; for(let r=0;r<10;r++) for(let c=0;c<10;c++){ const slow=(r===6&&c===3); s+=box(200+c*14,30+r*14,11,11,'',{rx:2,stroke:slow?MG:DIM,fill:slow?MG:'none',sw:1}); } return s; };
  add('p37m1',[{cap:"Dean and Barroso's tail at scale. A server that answers 99% of requests in under 10 ms and 1% in a full second looks healthy; a user request that fans out to 100 such servers and waits for every reply meets at least one slow server with probability 1 − 0.99¹⁰⁰ ≈ 63%. That is why p99, not the average, is the number to design for.",
    svg:svg(560,218,`${text(280,13,'THE TAIL AT SCALE',{bold:true,color:CY,size:11})}
      ${box(15,40,110,40,'one user\nrequest',{size:11,stroke:CY})}${arrow(127,60,194,60,'')}${text(160,78,'fans out\nto 100',{size:10,color:DIM})}
      ${text(70,104,'waits for\nevery reply',{size:10,color:DIM})}
      ${grid()}
      ${text(270,184,'each: 99% < 10 ms, 1% = 1 s',{size:10,color:DIM})}
      ${box(370,30,175,40,'P(all 100 fast)\n= 0.99¹⁰⁰ ≈ 0.37',{size:11,stroke:LM})}
      ${box(370,82,175,40,'P(≥ 1 slow server)\n= 1 − 0.37 ≈ 63%',{size:11,stroke:MG,color:MG,bold:true})}
      ${box(370,134,175,40,'remedy: hedge after p95,\ntake the first answer',{size:10,stroke:AM})}
      ${text(280,206,'design for p99, not the average',{size:11,color:CY,bold:true})}`,
      'A request fanned out to 100 servers each slow 1 percent of the time meets at least one slow server 63 percent of the time')}]);

  /* m2 — read-your-writes with a token */
  add('p37m2',[{cap:"Read-your-writes with a lagging follower. With each write the leader hands the user a token, its log position (the WAL LSN in PostgreSQL); a follower serves that user's read only once it has replayed up to the token, otherwise it waits or redirects. The user's own comment never vanishes, yet the system as a whole is still not linearizable.",
    svg:svg(560,238,`${box(10,10,80,28,'user',{size:11,stroke:CY})}${box(170,10,100,28,'leader',{size:11})}${box(330,8,120,32,'follower\n200 ms behind',{size:10,stroke:AM})}
      ${line(50,38,50,205,{dash:true,stroke:DIM})}${line(220,38,220,205,{dash:true,stroke:DIM})}${line(390,40,390,205,{dash:true,stroke:DIM})}
      ${arrow(52,58,218,58,'write comment')}
      ${arrow(218,82,52,82,'ok + token')}
      ${arrow(222,98,388,150,'',{dash:true})}${text(228,160,'log shipped (async)',{anchor:'start',size:10,color:DIM})}
      ${arrow(52,118,388,118,'read + token')}
      ${box(455,104,95,30,'replay < token:\nwait or redirect',{size:10,stroke:AM})}${line(392,118,453,118,{dash:true,stroke:AM})}
      ${box(455,142,95,30,'replay ≥ token:\nserve the read',{size:10,stroke:LM})}${line(392,154,453,154,{dash:true,stroke:LM})}
      ${arrow(388,188,52,188,'your comment is there',{color:LM})}
      ${text(280,224,'token = leader\'s log position (WAL LSN)',{size:10,color:DIM})}`,
      'Sequence diagram: the leader returns a log-position token with each write, and the follower serves the user only after replaying up to it')}]);

  /* m3 — a grow-only counter CRDT */
  add('p37m3',[{cap:"A grow-only counter, the simplest CRDT. Each replica increments only its own slot; merging takes the maximum of each slot, and the value is the sum. Because that merge is commutative, associative and idempotent, replicas that exchange state in any order, any number of times, all converge — here to [2,3,1] = 6 — with no coordination.",
    svg:svg(560,228,`${text(280,12,'G-COUNTER: MERGE = MAX PER SLOT',{bold:true,color:CY,size:11})}
      ${text(135,32,'local increments',{size:10,color:DIM})}${text(300,32,'exchange and merge',{size:10,color:DIM})}${text(475,32,'converged',{size:10,color:DIM})}
      ${text(36,58,'replica A',{size:10})}${text(36,110,'replica B',{size:10})}${text(36,162,'replica C',{size:10})}
      ${box(75,40,120,36,'[2,0,0]  value 2',{size:11,mono:true})}${box(75,92,120,36,'[0,3,0]  value 3',{size:11,mono:true})}${box(75,144,120,36,'[0,0,1]  value 1',{size:11,mono:true})}
      ${box(225,40,150,140,'max per slot:\n[2,0,0]\n⊔ [0,3,0]\n⊔ [0,0,1]\n= [2,3,1]',{size:11,mono:true,stroke:AM,lh:20})}
      ${arrow(196,58,223,58,'')}${arrow(196,110,223,110,'')}${arrow(196,162,223,162,'')}
      ${arrow(376,58,403,58,'')}${arrow(376,110,403,110,'')}${arrow(376,162,403,162,'')}
      ${box(405,40,140,36,'[2,3,1]  value 6',{size:11,mono:true,stroke:LM})}${box(405,92,140,36,'[2,3,1]  value 6',{size:11,mono:true,stroke:LM})}${box(405,144,140,36,'[2,3,1]  value 6',{size:11,mono:true,stroke:LM})}
      ${text(280,200,'value = sum of slots; merging twice changes nothing',{size:10,color:CY})}
      ${text(280,216,'commutative · associative · idempotent',{size:10,color:DIM})}`,
      'Three replicas of a grow-only counter merge by taking the maximum of each slot and all converge to the same value')}]);

  /* m4 — fencing tokens */
  add('p37m4',[{cap:"Why a lock with a timeout is not enough. Client 1's garbage-collection pause outlasts its lease, the lock service grants a new lease to client 2, and client 1 wakes still believing it holds the lock. Every grant carries a monotonically increasing fencing token, and the storage rejects any write whose token is lower than the highest it has seen — the resource itself must check.",
    svg:svg(560,248,`${box(10,10,100,28,'client 1',{size:11,stroke:CY})}${box(150,10,120,28,'lock service',{size:11})}${box(300,10,100,28,'client 2',{size:11,stroke:CY})}${box(440,10,110,28,'storage',{size:11,stroke:AM})}
      ${line(60,38,60,88,{dash:true,stroke:DIM})}${line(60,172,60,212,{dash:true,stroke:DIM})}${line(210,38,210,212,{dash:true,stroke:DIM})}${line(350,38,350,212,{dash:true,stroke:DIM})}${line(495,38,495,194,{dash:true,stroke:DIM})}
      ${arrow(62,56,208,56,'acquire')}${arrow(208,76,62,76,'lease, token 33')}
      ${box(42,88,36,84,'GC\npause',{size:9,stroke:MG,color:MG,dash:true})}
      ${box(165,92,90,20,'lease expires',{size:10,stroke:AM})}
      ${arrow(348,134,212,134,'acquire')}${arrow(212,151,348,151,'token 34')}
      ${arrow(352,168,493,168,'write, token 34',{color:LM})}
      ${arrow(62,188,493,188,'write, token 33 (stale)',{color:MG})}
      ${box(440,196,110,22,'reject: 33 < 34',{size:10,stroke:MG,color:MG,bold:true})}
      ${text(280,236,'the resource must check the token',{size:11,color:CY,bold:true})}`,
      'Sequence diagram: a paused client wakes with an expired lease and stale fencing token 33, and storage rejects its write after accepting token 34')}]);

  /* m5 — retries multiply across layers */
  const retryTree=()=>{ let s=box(230,28,100,26,'1 user call',{size:11,stroke:CY});
    const p1=[180,330,480]; p1.forEach(c=>{ s+=line(280,54,c,76)+box(c-40,76,80,24,'client try',{size:10}); [-48,0,48].forEach(d=>{ const c2=c+d; s+=line(c,100,c2,124)+box(c2-20,124,40,22,'mesh',{size:10,stroke:AM}); [-14,0,14].forEach(e=>{ s+=line(c2,146,c2+e,168)+box(c2+e-5,168,10,14,'',{rx:2,stroke:MG,sw:1}); }); }); });
    return s; };
  add('p37m5',[{cap:"Retries multiply across layers. If the client, the service mesh and the SDK each retry three times, one user action becomes 3 × 3 × 3 = 27 attempts against a dependency that is already sick — load amplified exactly when it hurts most. Retry only idempotent calls, at one layer, with backoff, jitter and a budget of about 10% of normal traffic.",
    svg:svg(560,230,`${text(280,13,'RETRIES AT THREE LAYERS MULTIPLY',{bold:true,color:CY,size:11})}
      ${text(8,41,'request',{anchor:'start',size:10,color:DIM})}${text(8,88,'client: 3 tries',{anchor:'start',size:10})}${text(8,135,'mesh: × 3 = 9',{anchor:'start',size:10,color:AM})}${text(8,175,'SDK: × 3 = 27',{anchor:'start',size:10,color:MG,bold:true})}
      ${retryTree()}
      ${text(330,198,'27 attempts hit the sick dependency',{size:11,color:MG})}
      ${text(280,218,'fix: one retry layer, ≤ 10% budget',{size:10,color:AM,bold:true})}`,
      'A tree showing one user call becoming 3 client tries, 9 mesh tries and 27 SDK attempts')}]);

  /* m6 — acks=all and min.insync.replicas */
  const brokers=(x)=>box(x+10,40,72,38,'B1\nleader, ISR',{size:10,stroke:CY})+box(x+94,40,72,38,'B2\nout of ISR',{size:10,stroke:DIM,dash:true,color:DIM})+box(x+178,40,72,38,'B3\nout of ISR',{size:10,stroke:DIM,dash:true,color:DIM})+text(x+130,92,'RF = 3, ISR shrank to {B1}',{size:10,color:DIM});
  add('p37m6',[{cap:"acks=all means every replica currently in the ISR. With RF = 3 and the ISR shrunk to the leader alone, min.insync.replicas = 1 lets acks=all acknowledge a single copy, which the next leader failure loses; min.insync.replicas = 2 refuses the write instead (NotEnoughReplicas) while committed data stays readable — a CP choice made per topic.",
    svg:compare({t:'min.insync.replicas = 1',draw:x=>`${brokers(x)}
        ${box(x+10,104,240,34,'acks=all waits for 1 copy\n(really acks=1)',{size:10,stroke:AM})}${arrow(x+130,138,x+130,154,'')}
        ${box(x+10,156,240,34,'B1 dies: acked write lost',{size:11,stroke:MG,color:MG,bold:true})}`},
      {t:'min.insync.replicas = 2',draw:x=>`${brokers(x)}
        ${box(x+10,104,240,34,'producer gets NotEnoughReplicas:\nwrites stop',{size:10,stroke:AM})}${arrow(x+130,138,x+130,154,'')}
        ${box(x+10,156,240,34,'committed data stays readable',{size:11,stroke:LM,color:LM,bold:true})}`},{h:210,label:'With the ISR shrunk to one broker, min.insync.replicas 1 acknowledges a single copy while 2 stops writes'})}]);

  /* m7 — capacity planning as a chain */
  add('p37m7',[{cap:"Capacity planning as a chain you write down. 5 million users at 40 requests a day average about 2,300 requests per second, planned at a 7,000 peak. CPU time turns that into 210 busy cores, 350 at a 60% target and 525 (about 33 sixteen-core instances) to survive losing one of three zones; Little's law (L = λW) turns it into 560 requests in flight and 70 concurrent database queries.",
    svg:svg(560,228,`${box(10,24,150,42,'5M users × 40/day\n÷ 86,400 s',{size:11})}${arrow(85,66,85,86,'')}
      ${box(10,88,150,30,'≈ 2,300 req/s average',{size:10})}${arrow(85,118,85,142,'')}${text(92,131,'peak 2–4×',{anchor:'start',size:10,color:DIM})}
      ${box(10,144,150,44,'plan for\n7,000 req/s',{size:12,stroke:AM,color:AM,bold:true})}
      ${text(370,26,'CPU → cores',{bold:true,color:CY,size:11})}${text(370,126,'concurrency → pool (Little\'s law)',{bold:true,color:CY,size:11})}
      ${arrow(162,150,188,66,'')}${arrow(162,168,188,162,'')}
      ${box(190,36,110,52,'× 30 ms CPU\n= 210 busy cores',{size:10})}${arrow(301,62,313,62,'')}
      ${box(315,36,105,52,'÷ 60% target\n= 350 cores',{size:10})}${arrow(421,62,433,62,'')}
      ${box(435,36,115,52,'× 1.5 zone loss\n= 525 cores\n≈ 33 × 16-core',{size:10,stroke:LM,bold:true})}
      ${box(190,136,110,52,'L = λW, 80 ms\n= 560 in flight',{size:10})}${arrow(301,162,313,162,'')}
      ${box(315,136,105,52,'10 ms DB hold\n= 70 queries',{size:10})}${arrow(421,162,433,162,'')}
      ${box(435,136,115,52,'sizes the\nDB connection pool',{size:10,stroke:LM})}
      ${text(280,214,'3 zones, lose one: survivors carry all',{size:10,color:DIM})}`,
      'Capacity chain from users to requests per second, then to cores with utilization and zone headroom, and to concurrency with Little\'s law')}]);
})();
