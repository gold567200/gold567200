/* Illustrations — Domain 37: Distributed Systems, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  const dot=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="none"/>`;
  const ring=(cx,cy,r,o={})=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${o.stroke||'currentColor'}" stroke-width="${o.sw||1.3}"/>`;
  const bar=(x,y,w,h,c,o={})=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx==null?3:o.rx}" fill="${o.fill||'none'}" stroke="${c}" stroke-width="${o.sw||1.6}" ${o.dash?'stroke-dasharray="5 4"':''}/>`;
  const solid=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" opacity="0.8"/>`;
  const path=(d,o={})=>`<path d="${d}" fill="none" stroke="${o.stroke||'currentColor'}" stroke-width="${o.sw||1.3}" ${o.dash?'stroke-dasharray="5 4"':''} ${o.arrow?'marker-end="url(#ah)"':''}/>`;

  /* ================= DOMAIN 37: Distributed Systems ================= */
  const lat=[['L1 cache hit · 0.5 ns',5e-10,CY],['main memory · 100 ns',1e-7,CY],['SSD random read · 150 µs',1.5e-4,AM],['datacenter round trip · 0.5 ms',5e-4,MG],['disk seek · 10 ms',1e-2,AM],['San Antonio ↔ Virginia · 30 ms',3e-2,MG],['California ↔ Netherlands · 150 ms',0.15,MG]];
  const LX=t=>200+34*(Math.log10(t)+10);
  I.p37m1=[{cap:"The latency ladder on a logarithmic scale: each tick is a factor of 1,000. A datacenter round trip costs a million L1 cache hits, and the bottom rows are fiber physics (about 5 µs per kilometer) that no code can beat.",
    svg:svg(560,250,`${text(280,14,'Latency ladder · log scale',{bold:true,color:CY,size:11})}
      ${lat.map(([l,t,c],i)=>{const y=30+i*27; return text(192,y+8,l,{anchor:'end',size:10})+bar(200,y,(LX(t)-200).toFixed(1),16,c);}).join('')}
      ${line(200,224,540,224)}${[[1e-9,'1 ns'],[1e-6,'1 µs'],[1e-3,'1 ms'],[1,'1 s']].map(([t,l])=>line(LX(t),220,LX(t),228)+text(LX(t),240,l,{size:10,color:DIM})).join('')}`,'Latency numbers from L1 cache to a transatlantic round trip on a log scale')},
   {cap:"Partial failure. A request that gets no reply has three possible histories, and from the client's side they are byte-for-byte identical: a timeout. That is why every retried operation must be idempotent.",
    svg:svg(560,232,`${[0,1,2].map(i=>box(15,15+i*65,90,42,'client',{stroke:CY})).join('')}
      ${arrow(105,36,200,36,'request')}${text(214,36,'✗',{size:16,color:MG,bold:true})}${box(290,15,130,42,'server never\nsaw it',{size:10,stroke:DIM,dash:true})}
      ${arrow(105,101,290,101,'request')}${box(290,80,130,42,'server crashed\nor still slow',{size:10,stroke:MG,dash:true})}
      ${arrow(105,153,290,153,'request')}${arrow(290,171,206,171,'')}${text(196,171,'✗',{size:16,color:MG,bold:true})}${box(290,145,130,42,'server did it\nreply lost',{size:10,stroke:LM})}
      ${box(440,15,110,172,'all three\nlook the same\nto the client:\na timeout\n\nso every retry\nmust be\nidempotent',{size:10,stroke:AM})}
      ${text(280,218,'same symptom, three causes',{size:10,color:DIM})}`,'Three indistinguishable causes of a missing reply')}];

  I.p37m2=[{cap:"Three processes, two messages, both clocks. Lamport stamps (L) respect cause and effect, but b (L2) and g (L4) are concurrent: their vectors [2,0,0] and [1,3,2] are incomparable, which only the vector clock can reveal.",
    svg:svg(560,245,`${text(20,14,'Lamport L and vector [P1,P2,P3]',{anchor:'start',bold:true,color:CY,size:11})}${text(540,14,'time →',{anchor:'end',size:10,color:DIM})}
      ${[['P1',50],['P2',120],['P3',190]].map(([p,y])=>text(22,y,p,{bold:true,size:11})+line(45,y,540,y,{stroke:DIM})).join('')}
      ${arrow(93,53,197,117,'m1')}${arrow(263,123,397,187,'m2')}
      ${dot(90,50,4.5,CY)}${dot(330,50,4.5,MG)}${dot(60,120,4.5,'currentColor')}${dot(200,120,4.5,'currentColor')}${dot(260,120,4.5,'currentColor')}${dot(120,190,4.5,'currentColor')}${dot(400,190,4.5,MG)}
      ${text(90,35,'a · L1 · [1,0,0]',{size:10,color:CY})}${text(330,35,'b · L2 · [2,0,0]',{size:10,color:MG})}
      ${text(60,137,'c · L1 · [0,1,0]',{size:10})}${text(200,137,'d · L2 · [1,2,0]',{size:10})}${text(268,105,'e · L3 · [1,3,0]',{size:10})}
      ${text(120,207,'f · L1 · [0,0,1]',{size:10})}${text(400,207,'g · L4 · [1,3,2]',{size:10,color:MG})}
      ${text(280,234,'b vs g: L2 < L4, yet vectors are concurrent',{size:10,color:AM})}`,'Space-time diagram with Lamport and vector clocks')},
   {cap:"The consistency spectrum. Moving right buys latency and availability by giving up guarantees; the dashed line marks where a system can no longer stay available on both sides of a partition.",
    svg:svg(560,200,`${text(10,20,'stronger: one-copy behavior',{anchor:'start',size:10,color:CY})}${text(550,20,'weaker: cheaper, always on',{anchor:'end',size:10,color:MG})}
      ${arrow(280,36,22,36,'')}${arrow(280,36,538,36,'')}
      ${[['Linearizable',CY,'etcd · Spanner','round trip per op'],['Sequential',CY,'memory models','no real-time order'],['Causal',LM,'COPS · Mongo','tracks dependencies'],['Session\nguarantees',AM,'read-your-writes','cheap per user'],['Eventual',MG,'DNS · Cassandra','converges later']].map(([n,c,ex,cost],i)=>box(10+i*110,50,100,44,n,{stroke:c,size:11})+text(60+i*110,111,ex,{size:9})+text(60+i*110,128,cost,{size:9,color:DIM})).join('')}
      ${box(10,150,210,32,'unavailable during a partition',{stroke:CY,dash:true,size:10})}${box(230,150,320,32,'can stay available during a partition',{stroke:MG,dash:true,size:10})}`,'Consistency models from linearizable to eventual')},
   {cap:"CAP covers only the partition branch; PACELC adds the everyday branch. Every replicated system makes two choices, and many let you choose per request.",
    svg:svg(560,232,`${box(190,8,180,36,'network partition now?',{stroke:AM,size:11,bold:true})}
      ${arrow(230,44,130,78,'yes')}${arrow(330,44,430,78,'no: else')}
      ${box(30,78,200,34,'availability or consistency?',{stroke:MG,size:10})}${box(330,78,200,34,'latency or consistency?',{stroke:CY,size:10})}
      ${arrow(110,112,72,150,'')}${arrow(150,112,207,150,'')}${arrow(410,112,352,150,'')}${arrow(450,112,487,150,'')}
      ${box(10,150,125,56,'PA\nanswer, reconcile\nCassandra · Dynamo',{stroke:MG,size:10})}${box(145,150,125,56,'PC\nminority refuses\netcd · Spanner',{stroke:CY,size:10})}
      ${box(290,150,125,56,'EL\nfast local reads\nDynamoDB default',{stroke:MG,size:10})}${box(425,150,125,56,'EC\nquorum every op\netcd · Spanner',{stroke:CY,size:10})}
      ${text(280,222,'most systems are PA/EL or PC/EC',{size:10,color:DIM})}`,'CAP and PACELC decision tree')}];

  I.p37m3=[{cap:"Two replication designs. Left: one leader orders every write and ships its log. Right: leaderless quorums with N = 3, W = 2, R = 2; because W + R > N, the replicas a read asks must include one that took the latest write (B).",
    svg:compare({t:'LEADER-BASED',draw:x=>box(x+80,42,100,30,'leader',{stroke:CY,bold:true})+arrow(x+110,72,x+65,118,'')+arrow(x+150,72,x+195,118,'')+text(x+130,100,'log stream',{size:9,color:DIM})+box(x+15,118,100,30,'follower 1')+box(x+145,118,100,30,'follower 2')+text(x+130,166,'all writes go via the leader',{size:9,color:DIM})+text(x+130,180,'followers lag: stale reads',{size:9,color:DIM})},
      {t:'LEADERLESS QUORUM',draw:x=>text(x+130,44,'write v2: wait for W = 2',{size:10,color:MG})+arrow(x+118,52,x+52,92,'')+arrow(x+130,52,x+130,92,'')+box(x+20,92,60,32,'A · v2',{stroke:MG})+box(x+100,92,60,32,'B · v2',{stroke:LM,bold:true})+box(x+180,92,60,32,'C · v1',{stroke:DIM,dash:true})+arrow(x+130,124,x+130,152,'')+arrow(x+210,124,x+152,152,'')+text(x+130,162,'read: R = 2 answers',{size:10,color:CY})+text(x+130,180,'W + R = 4 > N = 3',{size:10,color:LM,bold:true})},{h:200,label:'Leader-based replication versus leaderless quorum overlap'})},
   {cap:"Consistent hashing. A key belongs to the next node clockwise. When node E joins between D and A it takes only the arc (D, E], about 1/5 of the keys, from A; hash mod N would have moved about 80% of all keys.",
    svg:svg(560,240,`${ring(150,122,88)}${path('M 62 122 A 88 88 0 0 1 87.8 59.8',{stroke:MG,sw:5})}
      ${[[150,34,'A',CY],[238,122,'B',CY],[150,210,'C',CY],[62,122,'D',CY]].map(([x,y,l,c])=>dot(x,y,6,c)).join('')}${dot(87.8,59.8,6,MG)}
      ${text(150,18,'A',{bold:true,size:12})}${text(256,122,'B',{bold:true,size:12})}${text(150,228,'C',{bold:true,size:12})}${text(44,122,'D',{bold:true,size:12})}${text(62,44,'E (new)',{bold:true,size:11,color:MG})}
      ${text(150,122,'keys go to the\nnext node clockwise',{size:10,color:DIM})}
      ${text(420,36,'hash mod N, 4 → 5 nodes',{bold:true,size:11,color:AM})}${text(420,58,'80% of keys move',{size:11,color:MG})}
      ${text(420,100,'ring: new node E',{bold:true,size:11,color:CY})}${text(420,122,'takes one arc (D, E]',{size:10})}${text(420,142,'≈ 20% of keys move',{size:11,color:LM})}
      ${text(420,184,'virtual nodes (16–256 each)',{size:10,color:DIM})}${text(420,202,'even the arcs and the move',{size:10,color:DIM})}`,'Consistent hashing ring with a node joining')}];

  I.p37m4=[{cap:"Raft's three server states. A follower that hears no heartbeat becomes a candidate for a new term; a majority of votes makes it leader; a split vote retries; anyone who sees a higher term steps down.",
    svg:svg(560,170,`${box(10,56,110,50,'FOLLOWER\nvotes, replicates',{stroke:CY})}${box(225,56,110,50,'CANDIDATE\nrequests votes',{stroke:AM})}${box(440,56,110,50,'LEADER\nappends, commits',{stroke:LM})}
      ${text(65,40,'timeout 150–300 ms',{size:9,color:DIM})}${text(495,40,'heartbeats every 50 ms',{size:9,color:DIM})}
      ${arrow(120,72,225,72,'timeout')}${arrow(335,72,440,72,'majority votes')}${arrow(225,94,120,94,'sees leader')}
      ${path('M 258 56 C 258 22, 302 22, 302 54',{stroke:AM,arrow:true})}${text(280,14,'split vote: new term',{size:10,color:AM})}
      ${path('M 495 106 L 495 138 L 65 138 L 65 109',{arrow:true,stroke:MG})}${text(280,154,'higher term seen → step down',{size:10,color:MG})}`,'Raft follower, candidate and leader states')},
   {cap:"Log replication. Each cell is an entry labeled with its term. Index 5 is on a majority (S1 and S2), so it is committed; index 6 is only on the leader and is not yet committed. AppendEntries' consistency check repairs S3.",
    svg:svg(560,206,`${text(240,22,'log index →',{size:10,color:DIM})}${[1,2,3,4,5,6].map(i=>text(89+i*40,36,String(i),{size:10,color:DIM})).join('')}
      ${[['leader S1',48,6,CY],['follower S2',92,5,LM],['follower S3',136,4,DIM]].map(([n,y,k,c])=>text(55,y+14,n,{size:10})+[1,1,2,3,3,3].map((t,i)=>i<k?box(110+i*40,y,38,28,String(t),{stroke:c,size:11}):box(110+i*40,y,38,28,'',{stroke:AM,dash:true})).join('')).join('')}
      ${line(309,40,309,172,{stroke:LM,dash:true})}${text(250,188,'commit index 5: on a majority',{size:10,color:LM})}
      ${text(470,62,'AppendEntries carries',{size:10})}${text(470,78,'prevLogIndex + term',{size:10})}
      ${text(470,112,'mismatch: leader',{size:10})}${text(470,128,'walks nextIndex back',{size:10})}
      ${text(470,160,'index 6: 1 of 3 copies',{size:10,color:AM})}${text(470,176,'not yet committed',{size:10,color:AM})}`,'Raft log replication and the commit index')},
   {cap:"Two ways to change several services' data. Two-phase commit locks everything and blocks if the coordinator dies after prepare; a saga commits locally step by step and undoes completed steps with compensations, in reverse.",
    svg:compare({t:'TWO-PHASE COMMIT',draw:x=>box(x+80,40,100,28,'coordinator',{stroke:CY})+[0,1,2].map(i=>arrow(x+130,68,x+46+i*84,120,'')+box(x+10+i*84,120,72,28,'DB '+'ABC'[i],{size:10})).join('')+text(x+130,166,'1: prepare, all vote yes',{size:10})+text(x+130,182,'2: decision logged, commit',{size:10})+text(x+130,198,'coordinator dies: locks held',{size:10,color:MG})},
      {t:'SAGA',draw:x=>box(x+10,45,66,30,'T1 order',{size:10})+arrow(x+76,60,x+97,60,'')+box(x+97,45,66,30,'T2 pay',{size:10})+arrow(x+163,60,x+184,60,'')+box(x+184,45,66,30,'T3 stock ✗',{size:10,stroke:MG})+arrow(x+205,75,x+150,112,'')+box(x+97,112,66,30,'C2 refund',{size:10,stroke:AM})+arrow(x+97,127,x+76,127,'')+box(x+10,112,66,30,'C1 cancel',{size:10,stroke:AM})+text(x+130,166,'local commits plus events',{size:10})+text(x+130,182,'failure: compensate in reverse',{size:10})+text(x+130,198,'every step idempotent',{size:10,color:LM})},{h:224,label:'Two-phase commit versus saga with compensations'})}];

  I.p37m5=[{cap:"The circuit-breaker state machine. Closed counts failures; past the threshold it opens and fails fast; after a cool-down one trial call decides whether to close again or reopen.",
    svg:svg(560,190,`${box(10,60,120,50,'CLOSED\ncalls pass,\nfailures counted',{stroke:LM})}${box(220,60,120,50,'OPEN\nfail fast,\nno calls sent',{stroke:MG})}${box(430,60,120,50,'HALF-OPEN\none trial call',{stroke:AM})}
      ${text(175,42,'>50% of ≥20 fail',{size:9,color:MG})}${text(385,42,'cool-down',{size:9,color:AM})}
      ${arrow(130,75,220,75,'trip')}${arrow(340,75,430,75,'after 30 s')}${arrow(430,97,340,97,'trial fails')}
      ${path('M 490 110 L 490 148 L 70 148 L 70 113',{arrow:true,stroke:LM})}${text(280,162,'trial succeeds → close',{size:10,color:LM})}
      ${text(280,182,'stops retry storms early',{size:9,color:DIM})}`,'Circuit breaker closed, open and half-open states')},
   {cap:"Exponential backoff with full jitter: retry n sleeps a random time in [0, min(cap, base × 2^n)]. Without jitter, a thousand clients retry at the same instants and hit the server in spikes; with it, the load spreads out.",
    svg:svg(560,250,`${text(10,16,'sleep = random(0, min(cap, base × 2^n))',{anchor:'start',size:10,mono:true,color:CY})}
      ${[100,200,400,800,1000].map((ms,i)=>{const y=30+i*24; const w=ms*0.3; return text(10,y+8,'retry '+(i+1),{anchor:'start',size:10})+bar(70,y,w,16,AM)+dot((70+w*[0.62,0.35,0.8,0.22,0.55][i]).toFixed(1),y+8,3.5,MG)+text(70+w+8,y+8,i===4?'U(0, 1 s): capped':'U(0, '+ms+' ms)',{anchor:'start',size:9,color:DIM});}).join('')}
      ${line(70,154,370,154)}${[[0,'0'],[500,'0.5 s'],[1000,'1 s']].map(([t,l])=>line(70+t*0.3,150,70+t*0.3,158)+text(70+t*0.3,168,l,{size:9,color:DIM})).join('')}
      ${text(140,190,'no jitter: synchronized spikes',{size:10,color:MG})}${text(420,190,'full jitter: load spread out',{size:10,color:LM})}
      ${line(20,240,260,240)}${line(300,240,540,240)}${[45,105,165,225].map(x=>solid(x,198,8,42,MG)).join('')}
      ${Array.from({length:24},(_,i)=>solid(306+i*9.6,240-(9+((i*7)%9)),6,9+((i*7)%9),LM)).join('')}`,'Exponential backoff with full jitter and its effect on load')},
   {cap:"A deadline budget. The gateway gives checkout 800 ms and every hop receives only what remains: parallel calls cost the slower one, not the sum, and payment's retries must fit inside its share.",
    svg:svg(560,132,`${text(280,16,'POST /checkout · 800 ms deadline',{bold:true,color:CY,size:11})}
      ${bar(20,34,13,34,DIM)}${box(33,34,97.5,34,'parallel\n150 ms',{stroke:CY,size:10})}${box(130.5,34,344.5,34,'payment ≤ 530 ms (retries, jitter)',{stroke:AM,size:10})}${box(475,34,65,34,'DB\n100 ms',{stroke:LM,size:10})}
      ${text(20,84,'gateway 20 ms',{anchor:'start',size:9,color:DIM})}${text(540,84,'reserve for own write',{anchor:'end',size:9,color:DIM})}
      ${text(280,106,'parallel: max, not sum',{size:10})}${text(280,122,'pass remaining time downstream',{size:10,color:DIM})}`,'Deadline budget split across a checkout call')}];

  I.p37m6=[{cap:"One partition, three replicas. B2 is in sync; B3 fell behind for more than 30 s and left the ISR. The high watermark is the smallest log end among ISR members (9): offsets 0–8 are committed and readable, offset 9 is on the leader only.",
    svg:svg(560,235,`${text(380,30,'high watermark = 9',{size:10,color:LM,bold:true})}
      ${[['B1 leader',46,10,CY,false],['B2 in ISR',96,9,LM,false],['B3 out of ISR',146,7,DIM,true]].map(([n,y,k,c,d])=>text(55,y+14,n,{size:10})+Array.from({length:k},(_,i)=>box(110+i*27,y,25,28,String(i),{stroke:c,size:10,dash:d})).join('')).join('')}
      ${line(380,38,380,182,{stroke:LM,dash:true})}
      ${box(440,40,110,40,'producer\nacks=all',{stroke:AM,size:10})}${arrow(440,60,382,60,'')}
      ${box(440,140,110,40,'consumer\nreads below HW',{stroke:CY,size:10})}${arrow(376,165,440,160,'')}
      ${text(280,204,'ISR = {B1, B2} · min.insync.replicas = 2',{size:10})}${text(280,222,'B3 rejoins once caught up',{size:10,color:DIM})}`,'Kafka partition replicas, ISR and high watermark')},
   {cap:"Consumer groups. Within a group each partition goes to exactly one consumer, so parallelism stops at the partition count (B5 idles); separate groups each read the whole topic at their own pace.",
    svg:svg(560,246,`${text(280,14,'topic orders: 4 partitions',{bold:true,size:10,color:CY})}${text(75,14,'group alerts',{bold:true,size:10,color:AM})}${text(485,14,'group lakehouse',{bold:true,size:10,color:LM})}
      ${[0,1,2,3].map(i=>box(230,28+i*45,100,34,'P'+i,{stroke:CY,size:11})).join('')}
      ${box(20,45,110,40,'A1',{stroke:AM,size:11})}${box(20,135,110,40,'A2',{stroke:AM,size:11})}
      ${[0,1].map(i=>arrow(230,45+i*45,130,65,'')).join('')}${[2,3].map(i=>arrow(230,45+i*45,130,155,'')).join('')}
      ${[0,1,2,3].map(i=>box(430,28+i*45,110,34,'B'+(i+1),{stroke:LM,size:11})+arrow(330,45+i*45,430,45+i*45,'')).join('')}
      ${box(430,208,110,28,'B5 idle',{stroke:DIM,dash:true,size:10})}
      ${text(75,196,'2 partitions each',{size:9,color:DIM})}${text(280,214,'one consumer per partition',{size:9,color:DIM})}${text(280,228,'per group',{size:9,color:DIM})}`,'Kafka consumer groups sharing partitions')},
   {cap:"The transactional outbox. The business row and the event row commit together; Debezium reads the write-ahead log and publishes; the consumer's inbox table drops duplicates, so at-least-once publishing becomes an effectively-once side effect.",
    svg:svg(560,226,`${box(10,30,120,60,'order\nservice',{stroke:CY,size:11})}
      ${box(160,12,180,100,'',{stroke:AM,dash:true})}${text(250,26,'one local transaction',{size:10,color:AM})}${box(175,38,150,26,'INSERT orders row',{size:10})}${box(175,74,150,26,'INSERT outbox row',{size:10,stroke:LM})}
      ${arrow(130,60,158,60,'')}${arrow(340,87,378,70,'')}
      ${box(380,30,170,60,'Debezium reads\nthe WAL (CDC)',{stroke:MG,size:10})}${arrow(465,90,465,138,'publish')}
      ${box(380,140,170,50,'Kafka order.events\nkey = order id',{stroke:CY,size:10})}${arrow(380,165,342,165,'')}
      ${box(160,140,180,50,'shipping consumer\ninbox: unique msg id',{stroke:LM,size:10})}${arrow(160,165,132,165,'')}
      ${box(10,140,120,50,'book courier\nexactly once',{stroke:AM,size:10})}
      ${text(280,214,'at-least-once publish + inbox = effectively once',{size:10,color:DIM})}`,'Transactional outbox with CDC and an inbox')}];

  I.p37m7=[{cap:"An active/active pair of regions with home-region writes. Each user's data has one writing region; the other holds an asynchronous replica, so a region can fail over with an RPO of seconds and no two regions ever write the same key.",
    svg:svg(560,250,`${box(180,6,200,30,'users → DNS / anycast edge',{stroke:CY,size:10})}${arrow(230,36,140,62,'')}${arrow(330,36,420,62,'')}
      ${[[10,'us-east-1 · East home','East keys','West replica'],[290,'us-west-2 · West home','West keys','East replica']].map(([x,t,p,r])=>box(x,62,260,140,'',{stroke:DIM,dash:true})+text(x+130,76,t,{size:10,bold:true,color:AM})+box(x+20,86,220,24,'load balancer → services · 3 AZs',{size:10})+box(x+20,118,105,40,'DB primary\n'+p,{stroke:LM,size:10})+box(x+135,118,105,40,'async\n'+r,{stroke:DIM,dash:true,size:10})+box(x+20,166,220,26,'Kafka + outbox events',{size:10,stroke:MG})).join('')}
      ${arrow(150,222,410,222,'async replication ≈ 65 ms RTT')}${text(280,242,'writes stay in the home region',{size:10,color:DIM})}`,'Two-region active/active architecture with home-region writes')},
   {cap:"Why fleets run at 50–70%: in the simplest queueing model response time is service time ÷ (1 − utilization). At 80% latency is 5×, at 90% 10×, and a zone loss that pushes survivors from 65% to 97.5% makes it 40×.",
    svg:svg(560,242,`${text(62,20,'latency ÷ service time',{anchor:'start',size:10,color:DIM})}${text(540,20,'97.5% → 40×: off the chart',{anchor:'end',size:10,color:MG})}
      ${line(60,200,522,200)}${line(60,200,60,28)}
      ${[[1,'1×'],[10,'10×'],[20,'20×']].map(([k,l])=>line(56,200-k*8.5,60,200-k*8.5)+text(48,200-k*8.5,l,{anchor:'end',size:9,color:DIM})).join('')}
      ${[[0,'0%'],[0.5,'50%'],[0.8,'80%'],[1,'100%']].map(([r,l])=>line(60+r*460,200,60+r*460,205)+text(60+r*460,216,l,{size:9,color:DIM})).join('')}
      ${box(290,30,92,170,'',{stroke:LM,dash:true})}${text(336,44,'plan 50–70%',{size:10,color:LM})}
      ${path('M '+Array.from({length:20},(_,i)=>{const r=i*0.05; return (60+r*460).toFixed(1)+' '+(200-8.5/(1-r)).toFixed(1);}).join(' L '),{stroke:CY,sw:2})}
      ${[[0.5,2],[0.8,5],[0.9,10]].map(([r,k])=>dot(60+r*460,200-k*8.5,4,AM)+text(60+r*460-16,200-k*8.5-10,k+'×',{size:10,color:AM,bold:true})).join('')}
      ${text(290,234,'utilization ρ · R = S ÷ (1 − ρ)',{size:10})}`,'Queueing delay versus utilization')},
   {cap:"One purchase, end to end, at the median: about 200 ms, most of it spent on fiber between Dallas and Virginia and on the payment call. Every bar is a hop with its own timeout, retry rule and reason the retry is safe.",
    svg:svg(560,232,`${text(160,14,'0 ms',{size:9,color:DIM})}${text(540,14,'200 ms',{anchor:'end',size:9,color:DIM})}
      ${[['TLS 1.3 to edge',0,16,CY],['edge ↔ origin',16,30,MG],['LB · gateway · mesh',46,3,DIM],['checkout logic',49,40,CY],['seat hold (CAS)',89,8,LM],['payment + outbox',97,90,AM],['last mile to phone',187,8,MG]].map(([l,s,d,c],i)=>{const y=26+i*25; return text(150,y+9,l,{anchor:'end',size:10})+bar((160+s*1.9).toFixed(1),y,Math.max(3,d*1.9).toFixed(1),18,c)+text(s+d>150?160+s*1.9-5:160+(s+d)*1.9+6,y+9,d+' ms',{anchor:s+d>150?'end':'start',size:9,color:DIM});}).join('')}
      ${line(160,204,540,204)}${text(350,220,'total ≈ 195 ms at the median',{size:10,color:LM})}`,'Latency waterfall of one request end to end')}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
