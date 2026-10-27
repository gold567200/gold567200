/* Illustrations — Domain 20: Software Engineering Practice (Git, Testing, Design, APIs, System Design, Delivery, Secure Code), built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  // a commit drawn as a small circle with a letter inside (used by the merge/rebase figure)
  const node=(x,y,t,c)=>'<circle cx="'+x+'" cy="'+y+'" r="13" fill="var(--bg)" stroke="'+(c||'currentColor')+'" stroke-width="1.3"/>'+text(x,y,t,{size:10,bold:true,color:c||'currentColor'});

  /* ================= MODULE 1: Git ================= */
  I.p20m1=[{cap:"Git's object graph. Refs (HEAD, main, feature) are tiny files pointing at commits; each commit points at its parent and at exactly one tree — the snapshot; trees point at blobs and subtrees. Every object is named by the hash of its contents, so identical files anywhere in history are one blob.",
    svg:svg(560,300,`${box(170,18,70,26,'HEAD',{stroke:AM,size:10,bold:true})}${arrow(240,31,260,31,'')}${box(260,18,70,26,'main',{stroke:LM,size:10,bold:true})}${box(400,18,80,26,'feature',{stroke:LM,size:10,bold:true})}
      ${box(40,75,100,40,'commit C1\n(no parent)',{stroke:CY,size:10})}${box(230,75,100,40,'commit C2\n(parent C1)',{stroke:CY,size:10})}${box(420,75,100,40,'commit C3\n(parent C2)',{stroke:CY,size:10})}
      ${arrow(230,95,140,95,'parent')}${arrow(420,95,330,95,'parent')}${arrow(295,44,280,75,'')}${arrow(440,44,470,75,'')}
      ${arrow(280,115,280,135,'')}${box(230,135,100,32,'tree (root)',{stroke:MG,size:10})}
      ${arrow(260,167,180,195,'')}${arrow(300,167,380,195,'')}${box(130,195,100,34,'blob\nREADME.md',{stroke:DIM,size:10})}${box(330,195,100,34,'tree src/',{stroke:MG,size:10})}
      ${arrow(380,229,380,255,'')}${box(330,255,100,34,'blob\nsrc/loss.py',{stroke:DIM,size:10})}
      ${text(90,150,'C1, C3 → their own trees',{size:9,color:DIM})}${text(90,163,'unchanged subtrees shared',{size:9,color:DIM})}
      ${text(20,280,'same bytes → same hash → one object',{size:10,color:AM,anchor:'start'})}`,'Git objects: refs point to commits, commits to trees, trees to blobs')},
   {cap:"The three areas. git add copies a snapshot of a file into the staging area (the index); git commit turns the index into a tree plus a commit object. A file edited after git add therefore has a staged and an unstaged version.",
    svg:flow([{t:'working tree\n(your files)'},{t:'staging area\n(the index)',stroke:AM,edge:'git add'},{t:'repository\n(.git objects)',stroke:CY,edge:'git commit'}],{bw:120,bh:52,gap:80,label:'Working tree, staging area, repository'})},
   {cap:"Merge records what happened: a commit M with two parents (C and E). Rebase replays D and E on top of C as D′ and E′ — new objects with new hashes. The old D and E still exist in every clone that pulled them, which is why you never rebase shared history.",
    svg:compare({t:'MERGE',draw:x=>line(x+40,70,x+160,70)+line(x+100,70,x+100,120)+line(x+100,120,x+160,120)+line(x+160,70,x+220,70)+line(x+160,120,x+220,70)+node(x+40,70,'A')+node(x+100,70,'B')+node(x+160,70,'C',CY)+node(x+100,120,'D',MG)+node(x+160,120,'E',MG)+node(x+220,70,'M',LM)+text(x+100,158,'M has two parents: C and E',{size:10,color:LM})},
                {t:'REBASE',draw:x=>line(x+35,70,x+215,70)+node(x+35,70,'A')+node(x+80,70,'B')+node(x+125,70,'C',CY)+node(x+170,70,'D′',AM)+node(x+215,70,'E′',AM)+line(x+80,120,x+140,120,{dash:true,stroke:DIM})+node(x+110,120,'D',DIM)+node(x+155,120,'E',DIM)+text(x+200,120,'old copies',{size:9,color:DIM})+text(x+130,158,'D′ E′ are new hashes; linear',{size:10,color:AM})},{h:180,label:'Merge versus rebase'})},
   {cap:"Bisect is binary search over history. Sixteen commits between a known-good and a known-bad commit need ⌈log₂ 16⌉ = 4 test runs; 1,000 need 10; 5,000 need 13. git bisect run automates the whole hunt.",
    svg:svg(560,130,`${Array.from({length:16},(_,i)=>{ const bad=i>=10; return '<rect x="'+(20+i*33)+'" y="45" width="26" height="26" rx="4" fill="none" stroke="'+(bad?MG:LM)+'" stroke-width="1.3"/>'+text(33+i*33,58,String(i+1),{size:9,color:bad?MG:LM}); }).join('')}
      ${text(33,30,'good',{size:10,color:LM})}${text(33+15*33,30,'bad',{size:10,color:MG})}
      ${[[8,'1st'],[12,'2nd'],[10,'3rd'],[9,'4th']].map(([i,s])=>text(33+i*33,86,s,{size:9,color:AM,bold:true})).join('')}
      ${text(33+10*33,108,'↑ first bad = commit 11',{size:10,color:MG})}${text(130,108,'tests in order: 1st…4th → 4 = log₂ 16',{size:10,color:DIM})}`,'git bisect as binary search')}];

  /* ================= MODULE 2: Testing ================= */
  I.p20m2=[{cap:"The test pyramid with the module's arithmetic: 2,000 unit tests at 5 ms run in 10 seconds and can run on every save; 40 browser tests at 20 s take 13 minutes and belong in CI before a merge. Cost and time rise as you climb.",
    svg:pyramid([{t:'E2E (browser)\n40 × 20 s = 13 min',color:MG},{t:'integration (real DB)\n200 × 200 ms = 40 s',color:AM},{t:'unit\n2,000 × 5 ms = 10 s',color:LM}],{label:'The test pyramid with timings'})},
   {cap:"Test-driven development is a three-beat loop: write a failing test for the next small behavior, write the least code that passes, then clean up with the tests as your net.",
    svg:cycle(['RED\nfailing test','GREEN\nmake it pass','REFACTOR\nclean up'],{label:'The TDD cycle'})},
   {cap:"Boundary value analysis for a field accepting 18–65. Partitions: below 18 (invalid), 18–65 (valid), above 65 (invalid). 2-value BVA tests 17, 18, 65, 66; 3-value adds the inside neighbors 19 and 64. Off-by-one defects live exactly here.",
    svg:svg(560,150,`${line(40,70,520,70,{sw:2})}${line(150,50,150,90,{dash:true,stroke:LM})}${line(410,50,410,90,{dash:true,stroke:LM})}
      ${text(90,36,'invalid (< 18)',{size:10,color:MG})}${text(280,36,'valid partition 18–65',{size:10,color:LM})}${text(470,36,'invalid (> 65)',{size:10,color:MG})}
      ${[[120,'17',MG],[150,'18',LM],[180,'19',LM],[380,'64',LM],[410,'65',LM],[440,'66',MG]].map(([x,v,c])=>'<circle cx="'+x+'" cy="70" r="6" fill="'+c+'"/>'+text(x,98,v,{size:11,color:c,bold:true})).join('')}
      ${text(150,124,'2-value BVA: 17, 18, 65, 66',{size:11,color:AM})}${text(410,124,'3-value adds 19 and 64',{size:11,color:AM})}`,'Boundary values on a number line')}];

  /* ================= MODULE 3: Design ================= */
  I.p20m3=[{cap:"SOLID in one line each. Dependency inversion (bottom) is what makes Module 2's tests cheap: inject the clock, the network and the storage, and tests never touch the real ones.",
    svg:stack([{t:'S — Single responsibility',side:'one reason to change',stroke:CY},{t:'O — Open / closed',side:'extend, do not modify',stroke:CY},{t:'L — Liskov substitution',side:'keep the base contract'},{t:'I — Interface segregation',side:'no unused methods'},{t:'D — Dependency inversion',side:'inject abstractions',stroke:AM}],{w:250,side:true,label:'The SOLID principles'})},
   {cap:"Ousterhout's deep module hides a lot of functionality behind a small interface (the Unix file API). A shallow module exposes many functions with little inside — complexity with extra steps.",
    svg:compare({t:'DEEP MODULE',draw:x=>box(x+70,45,120,32,'open · read\nwrite · close',{stroke:CY,size:10})+box(x+20,87,220,66,'drivers · buffering\nfilesystems · caching\npermissions · locking',{stroke:DIM,size:10})+text(x+130,168,'small interface, much hidden',{size:10,color:LM})},
                {t:'SHALLOW MODULE',draw:x=>box(x+15,45,230,32,'22 public functions, 1:1 wrappers',{stroke:MG,size:10})+box(x+70,87,120,32,'3 lines each',{stroke:DIM,size:10})+text(x+130,168,'big interface, little inside',{size:10,color:MG})},{h:190,label:'Deep versus shallow modules'})},
   {cap:"Dependency inversion. The service depends on an abstraction (a Protocol), not on Postgres; production injects the real repository, tests inject an in-memory fake, and no test ever opens a database connection.",
    svg:svg(560,220,`${box(200,15,160,42,'Service\n(business logic)',{stroke:CY,size:10})}${arrow(280,57,280,88,'depends on')}
      ${box(170,88,220,42,'Repository (Protocol)\nget(id) · save(obj)',{stroke:AM,size:10,dash:true})}
      ${arrow(150,176,235,130,'implements')}${arrow(410,176,325,130,'implements')}
      ${box(50,176,190,38,'PostgresRepository\n(production)',{stroke:LM,size:10})}${box(320,176,190,38,'InMemoryRepository\n(tests — no database)',{stroke:MG,size:10})}`,'Dependency inversion with a Protocol')},
   {cap:"The refactoring loop (Fowler, Feathers): pin current behavior with characterization tests, pick one smell, apply one named refactoring, run the tests, commit. Thirty two-minute steps beat one two-hour rewrite.",
    svg:cycle(['characterization\ntests first','pick one\nsmell','apply one named\nrefactoring','run the tests\n(still green?)','commit'],{label:'The refactoring loop'})}];

  /* ================= MODULE 4: APIs ================= */
  I.p20m4=[{cap:"One REST exchange with its headers doing real work: the bearer token authenticates, If-None-Match lets the server answer 304 with no body when the ETag still matches, and the status code carries legal meaning.",
    svg:svg(560,245,`${box(20,20,90,210,'client',{stroke:CY,bold:true})}${box(450,20,90,210,'server',{stroke:MG,bold:true})}
      ${text(280,38,'GET /v1/links/42',{mono:true,size:11,bold:true})}${text(280,53,'Authorization: Bearer eyJhbGci…',{mono:true,size:10,color:DIM})}${text(280,68,'If-None-Match: "a1b2"',{mono:true,size:10,color:DIM})}
      ${arrow(115,82,445,82,'',{stroke:CY})}${arrow(445,122,115,122,'',{stroke:MG})}
      ${text(280,142,'HTTP/1.1 200 OK   ETag: "a1b2"',{mono:true,size:10,bold:true})}${text(280,157,'Content-Type: application/json',{mono:true,size:10,color:DIM})}${text(280,172,'{ "id": 42, "km": 12.5, "loss_db": 5.8 }',{mono:true,size:10})}
      ${text(280,200,'same ETag → 304 Not Modified, no body',{size:10,color:AM})}${text(280,218,'bad input 422 · no token 401 · no scope 403 · too fast 429',{size:9,color:DIM})}`,'A REST request and response')},
   {cap:"OAuth 2.0 Authorization Code with PKCE. Four roles: you (resource owner), the app (client), the authorization server that issues tokens, and the API (resource server) that only ever sees the bearer token.",
    svg:flow([{t:'app sends you to\nthe auth server\n+ code_challenge'},{t:'you log in\nand consent',stroke:AM},{t:'redirect back\nwith a short code'},{t:'app swaps code +\nverifier for tokens',stroke:CY},{t:'API verifies the\nbearer JWT',stroke:MG}],{bw:150,bh:54,gap:28,perRow:3,label:'OAuth 2.0 Authorization Code + PKCE'})},
   {cap:"A JWT is three base64url parts separated by dots. The signature proves nothing was altered; it does not hide anything — the payload is readable by anyone holding the token, so secrets never belong in it.",
    svg:svg(560,185,`${box(20,15,160,36,'HEADER',{stroke:MG,bold:true})}${text(190,33,'.',{size:18,bold:true})}${box(200,15,160,36,'PAYLOAD (claims)',{stroke:AM,bold:true})}${text(370,33,'.',{size:18,bold:true})}${box(380,15,160,36,'SIGNATURE',{stroke:CY,bold:true})}
      ${text(100,70,'"alg": "RS256"',{mono:true,size:9})}${text(100,84,'"kid": "k1"',{mono:true,size:9})}${text(100,110,'pin the algorithm list',{size:9,color:MG})}
      ${text(280,70,'"iss": auth.example.com',{mono:true,size:9})}${text(280,84,'"sub": u_8812  "aud": links-api',{mono:true,size:9})}${text(280,98,'"exp": 1761303600 (1 h)',{mono:true,size:9})}${text(280,112,'"scope": links:read',{mono:true,size:9})}${text(280,130,'check aud and exp every time',{size:9,color:AM})}
      ${text(460,70,'RS256 over',{mono:true,size:9})}${text(460,84,'header.payload',{mono:true,size:9})}${text(460,98,'issuer private key;',{size:9})}${text(460,112,'verified via JWKS',{size:9})}${text(460,130,'tamper → verify fails',{size:9,color:CY})}
      ${text(280,165,'signed, NOT encrypted — base64url is encoding, anyone holding it can read the payload',{size:10,color:AM})}`,'Anatomy of a JWT')},
   {cap:"A token bucket of capacity 100 refilled at 10 per second allows a burst of 100 and a sustained 10 requests per second. When the bucket is empty the client gets 429 with Retry-After and backs off exponentially with jitter.",
    svg:svg(560,175,`${arrow(120,8,120,28,'')}${text(190,16,'refill 10 tokens / s',{size:10,color:LM,anchor:'start'})}
      ${box(60,30,120,100,'',{stroke:CY,rx:5})}<rect x="64" y="72" width="112" height="54" rx="4" fill="${CY}" opacity="0.3"/>${text(120,52,'capacity 100',{size:11,bold:true})}${text(120,100,'tokens left',{size:10})}
      ${box(250,50,100,36,'request',{stroke:'currentColor'})}${arrow(250,68,185,68,'')}${text(217,88,'takes 1 token',{size:9,color:DIM})}
      ${arrow(350,62,440,45,'')}${box(440,28,100,34,'token? → 200',{stroke:LM,size:10})}
      ${arrow(350,74,440,98,'')}${box(440,82,100,36,'empty → 429\nRetry-After: 3',{stroke:MG,size:10})}
      ${text(280,155,'client retries with backoff + jitter: 1, 2, 4, 8 s, capped at 32 s',{size:10,color:DIM})}`,'Token-bucket rate limiting')}];

  /* ================= MODULE 5: System design ================= */
  I.p20m5=[{cap:"The standard web architecture. A load balancer spreads requests over stateless app servers; a cache absorbs most reads; the primary database replicates asynchronously to a read replica (replication lag); a queue hands slow work to workers; static content comes from a CDN.",
    svg:svg(560,325,`${box(20,15,90,36,'clients',{bold:true})}${box(130,15,80,36,'DNS',{stroke:DIM})}${box(230,15,110,36,'CDN\n(static, media)',{stroke:DIM,size:9})}
      ${arrow(110,33,130,33,'')}${arrow(210,33,230,33,'')}${arrow(65,51,230,80,'')}
      ${box(170,80,220,40,'load balancer (L7)\nhealth checks',{stroke:CY,size:10})}
      ${arrow(260,120,130,150,'')}${arrow(280,120,280,150,'')}${arrow(300,120,430,150,'')}
      ${box(70,150,120,40,'app server\n(stateless)',{size:10})}${box(220,150,120,40,'app server\n(stateless)',{size:10})}${box(370,150,120,40,'app server\n(stateless)',{size:10})}
      ${arrow(130,190,105,225,'')}${arrow(280,190,280,225,'')}${arrow(430,190,405,225,'')}${arrow(440,190,495,225,'')}
      ${box(40,225,130,46,'cache (Redis)\n90% hits · 1 ms',{stroke:AM,size:10})}${box(215,225,125,46,'primary DB\n(writes)',{stroke:LM,size:10})}${box(365,225,80,46,'replica\n(reads)',{stroke:LM,size:9})}${box(455,225,90,46,'queue\n(Kafka)',{stroke:MG,size:10})}
      ${arrow(340,255,365,255,'')}${text(352,282,'async',{size:9,color:DIM})}${arrow(500,271,500,288,'')}${box(455,288,90,30,'workers',{stroke:MG,size:10})}
      ${text(105,290,'miss → DB (20 ms)',{size:9,color:DIM})}`,'Load balancer, stateless servers, cache, replicated database, queue')},
   {cap:"Cache arithmetic. Average latency = hits × cache time + misses × database time. At 90% hits: 0.9 × 1 ms + 0.1 × 20 ms = 2.9 ms and the database sees one request in ten. At 60% hits the average triples to 8.6 ms and database load quadruples.",
    svg:svg(560,150,`${text(20,30,'90% hit ratio',{size:11,anchor:'start',bold:true})}<rect x="130" y="20" width="36" height="22" fill="${CY}" opacity="0.6"/><rect x="166" y="20" width="80" height="22" fill="${MG}" opacity="0.6"/>${text(256,31,'= 2.9 ms',{size:11,anchor:'start',color:LM,bold:true})}
      ${text(148,56,'0.9 ms',{size:9,color:CY})}${text(206,56,'misses 2.0 ms',{size:9,color:MG})}
      ${text(20,95,'60% hit ratio',{size:11,anchor:'start',bold:true})}<rect x="130" y="85" width="24" height="22" fill="${CY}" opacity="0.6"/><rect x="154" y="85" width="320" height="22" fill="${MG}" opacity="0.6"/>${text(484,96,'= 8.6 ms',{size:11,anchor:'start',color:AM,bold:true})}
      ${text(142,121,'0.6',{size:9,color:CY})}${text(314,121,'misses 0.4 × 20 ms = 8.0 ms',{size:9,color:MG})}
      ${text(280,142,'bar length = milliseconds (40 px per ms); hits at 1 ms, misses at 20 ms',{size:9,color:DIM})}`,'Cache hit ratio versus average latency')},
   {cap:"Availability expressed as downtime per year. Each extra nine multiplies the cost, and dependencies in series multiply their failure: two 99.9% services together give 99.8%.",
    svg:stack([{t:'99% — 3.65 days down per year',side:'one server, no failover',stroke:MG},{t:'99.9% — 8.8 hours',side:'replicas + failover',stroke:AM},{t:'99.99% — 53 minutes',side:'multi-zone + on-call',stroke:LM},{t:'99.999% — 5.3 minutes',side:'multi-region, costly',stroke:CY}],{w:300,side:true,label:'Availability as yearly downtime'})},
   {cap:"CAP in practice. When a partition cuts node A from node B, a CP system refuses or delays requests it cannot confirm; an AP system answers from the copy it has, possibly stale. Partitions are not optional, so the real decision is which behavior you want during one.",
    svg:compare({t:'CP · stay consistent',draw:x=>box(x+20,50,70,34,'node A',{stroke:CY})+box(x+170,50,70,34,'node B',{stroke:CY})+line(x+90,67,x+170,67,{dash:true,stroke:MG})+text(x+130,55,'✕ partition',{size:9,color:MG})+box(x+20,128,70,30,'client',{})+arrow(x+55,128,x+55,86,'')+text(x+62,107,'write',{size:9,color:DIM,anchor:'start'})+text(x+175,133,'A cannot confirm with B',{size:9,color:AM})+text(x+175,147,'→ 503 or wait',{size:9,color:AM})},
                {t:'AP · stay available',draw:x=>box(x+20,50,70,34,'node A',{stroke:MG})+box(x+170,50,70,34,'node B',{stroke:MG})+line(x+90,67,x+170,67,{dash:true,stroke:MG})+text(x+130,55,'✕ partition',{size:9,color:MG})+box(x+20,128,70,30,'client',{})+arrow(x+55,128,x+55,86,'')+text(x+62,107,'read',{size:9,color:DIM,anchor:'start'})+text(x+175,133,'A answers from its copy',{size:9,color:LM})+text(x+175,147,'→ possibly stale',{size:9,color:LM})},{h:180,label:'CP versus AP during a partition'})}];

  /* ================= MODULE 6: Delivery ================= */
  I.p20m6=[{cap:"One Sprint, one month or less, with the Scrum Guide 2020 maximum timeboxes for a one-month Sprint; shorter Sprints shrink the events proportionally. The Increment is the only output that counts.",
    svg:cycle(['Sprint Planning\n≤ 8 h','Daily Scrum\n15 min','build the\nIncrement','Sprint Review\n≤ 4 h','Retrospective\n≤ 3 h'],{label:'The Scrum cycle'})},
   {cap:"A Kanban board with WIP limits. Five items are in flight (3 in progress, 2 in review) and the team finishes 2.5 a week, so Little's Law gives a two-week lead time; the limits stop anyone starting a sixth and force finishing over starting.",
    svg:svg(560,225,`${[['To do','currentColor'],['In progress · WIP 3',AM],['Review · WIP 2',MG],['Done',LM]].map(([t,c],i)=>box(20+i*135,15,125,30,t,{stroke:c,size:10,bold:true})).join('')}
      ${['#88 XLSX export','#91 README','#93 retry logic','#95 JWT aud check'].map((t,j)=>box(30,55+j*30,105,24,t,{size:9,stroke:DIM})).join('')}
      ${['#84 cursor paging','#86 rate limiter','#87 ETag support'].map((t,j)=>box(165,55+j*30,105,24,t,{size:9,stroke:AM})).join('')}
      ${['#82 ADR-0007','#83 SBOM in CI'].map((t,j)=>box(300,55+j*30,105,24,t,{size:9,stroke:MG})).join('')}
      ${['#79 signed commits','#80 ruleset','#81 problem+json'].map((t,j)=>box(435,55+j*30,105,24,t,{size:9,stroke:LM})).join('')}
      ${text(280,190,'Little\'s Law: lead time = WIP ÷ throughput = 5 ÷ 2.5 per week = 2 weeks',{size:11,color:AM})}${text(280,208,'halve WIP → halve lead time, nobody works harder',{size:10,color:DIM})}`,'Kanban board with WIP limits and Little\'s Law')},
   {cap:"Semantic versioning gives each number a contract. From 1.4.2: a compatible fix → 1.4.3, a compatible feature → 1.5.0, a breaking change → 2.0.0. Pre-releases sort before the release; a caret range stays below the next MAJOR.",
    svg:svg(560,175,`${box(70,15,120,50,'MAJOR\n2',{stroke:MG,size:12,bold:true})}${text(205,40,'.',{size:22,bold:true})}${box(220,15,120,50,'MINOR\n5',{stroke:AM,size:12,bold:true})}${text(355,40,'.',{size:22,bold:true})}${box(370,15,120,50,'PATCH\n0',{stroke:LM,size:12,bold:true})}
      ${text(130,80,'breaking change',{size:10,color:MG})}${text(280,80,'new, compatible feature',{size:10,color:AM})}${text(430,80,'compatible bug fix',{size:10,color:LM})}
      ${text(280,115,'1.4.2 → 1.4.3 (fix) → 1.5.0 (feat) → 2.0.0 (feat!)',{mono:true,size:11})}
      ${text(280,140,'2.0.0-rc.1 < 2.0.0        ^1.4.2 means ≥ 1.4.2 and < 2.0.0',{size:10,color:DIM})}${text(280,160,'MAJOR 0.y.z: anything may break at any time',{size:10,color:DIM})}`,'Semantic versioning')},
   {cap:"From merge to release: CI proves the build, Conventional Commits compute the version and the changelog, the tag becomes a GitHub Release with artifacts, and a canary behind a feature flag separates deploying from releasing. Rollback is rehearsed, not improvised.",
    svg:flow([{t:'PR squash-merged\nto main'},{t:'CI: tests, ruff,\nmypy, pip-audit',stroke:CY,edge:'push'},{t:'tag v1.5.0 +\nchangelog section',stroke:AM,edge:'green'},{t:'build artifact →\nGitHub Release',edge:'release'},{t:'canary 5%\nbehind a flag',stroke:MG,edge:'deploy'},{t:'100% · rollback\none command',stroke:LM,edge:'healthy'}],{bw:120,bh:50,gap:66,perRow:3,label:'Release pipeline'})}];

  /* ================= MODULE 7: Secure software ================= */
  I.p20m7=[{cap:"Security gates through the SDLC. Each stage has a defense that is cheap there and expensive later: a threat model at design, allowlists and parameterized queries in code, a secret scanner at commit, audit and SBOM in CI, signed artifacts at release, and fail-closed logging in production.",
    svg:flow([{t:'DESIGN\nthreat model,\nabuse cases',stroke:CY},{t:'CODE\nallowlist validation,\nparameterized queries',edge:'gate'},{t:'COMMIT\ngitleaks pre-commit,\nsigned commits',edge:'gate'},{t:'CI\npip-audit, SBOM,\nSHA-pinned actions',stroke:AM,edge:'gate'},{t:'RELEASE\nsigned artifacts,\nSemVer tag',edge:'gate'},{t:'RUN\nstructured logs,\nalerts, fail closed',stroke:MG,edge:'gate'}],{bw:140,bh:58,gap:50,perRow:3,label:'Security gates in the software lifecycle'})},
   {cap:"Injection is data becoming code. A string-built query lets a crafted input rewrite the SQL; a parameterized query sends the statement and the value separately, so no quoting trick can change the statement's meaning.",
    svg:compare({t:'STRING-BUILT · injectable',draw:x=>text(x+130,50,'f"… WHERE id = \'{reel_id}\'"',{mono:true,size:9})+arrow(x+130,60,x+130,82,'')+box(x+15,84,230,30,'input: R-000001\' OR \'1\'=\'1',{mono:true,size:9,stroke:MG})+arrow(x+130,114,x+130,136,'')+text(x+130,150,'the data became SQL code',{size:10,color:MG})},
                {t:'PARAMETERIZED · safe',draw:x=>text(x+130,50,'"… WHERE id = ?", (reel_id,)',{mono:true,size:9})+arrow(x+130,60,x+130,82,'')+box(x+15,84,230,30,'the value stays a value, quotes included',{size:9,stroke:LM})+arrow(x+130,114,x+130,136,'')+text(x+130,150,'code and data travel separately',{size:10,color:LM})},{h:170,label:'String-built versus parameterized queries'})},
   {cap:"Supply-chain discipline (OWASP A03). A lockfile pins versions and hashes, Syft produces the SBOM — the machine-readable ingredient list in CycloneDX or SPDX — and Grype matches it against known CVEs on every CI run.",
    svg:flow([{t:'your code +\n150 packages'},{t:'uv.lock pins\nversions + hashes',stroke:CY,edge:'pin'},{t:'syft → SBOM\n(CycloneDX / SPDX)',stroke:AM,edge:'catalog'},{t:'grype matches\nknown CVEs',stroke:MG,edge:'scan'},{t:'fix: update, pin\nor replace',stroke:LM,edge:'triage'}],{bw:130,bh:50,gap:64,perRow:3,label:'From dependencies to SBOM to CVE scan'})},
   {cap:"A pushed secret is compromised the moment it lands, because scanners harvest public commits within minutes. Rotate first; rewriting history comes second and does not un-leak anything.",
    svg:flow([{t:'secret pushed\n= compromised'},{t:'1 rotate /\nrevoke now',stroke:MG},{t:'2 check logs\nfor misuse',stroke:AM},{t:'3 purge history\n(git filter-repo)'},{t:'4 push protection\n+ gitleaks hook',stroke:CY},{t:'5 blameless\nincident review',stroke:LM}],{bw:140,bh:50,gap:36,perRow:3,label:'Responding to a leaked secret'})}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
