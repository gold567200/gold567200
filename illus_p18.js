/* Illustrations — Domain 18: Databases & SQL, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  // small helpers for this domain
  const venn=(x,y,mode,id)=>{ const r=26,d=30,ax=x-d/2,bx=x+d/2;
    let s=`<defs><clipPath id="${id}"><circle cx="${ax}" cy="${y}" r="${r}"/></clipPath></defs>`;
    const fA=`<circle cx="${ax}" cy="${y}" r="${r}" fill="${CY}" opacity="0.45"/>`, fB=`<circle cx="${bx}" cy="${y}" r="${r}" fill="${CY}" opacity="0.45"/>`;
    const inter=(c)=>`<circle cx="${bx}" cy="${y}" r="${r}" fill="${c}" ${c==='var(--bg)'?'':'opacity="0.45"'} clip-path="url(#${id})"/>`;
    if(mode==='inner') s+=inter(CY); if(mode==='left') s+=fA; if(mode==='right') s+=fB; if(mode==='full') s+=fA+fB; if(mode==='anti') s+=fA+inter('var(--bg)');
    s+=`<circle cx="${ax}" cy="${y}" r="${r}" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="${bx}" cy="${y}" r="${r}" fill="none" stroke="currentColor" stroke-width="1.3"/>`;
    s+=text(ax-12,y,'a',{size:10})+text(bx+12,y,'b',{size:10}); return s; };
  const crow=(x,y,dir)=>line(x,y,x+dir*10,y-8)+line(x,y,x+dir*10,y)+line(x,y,x+dir*10,y+8); // three-pronged "many" end
  const cells=(x0,y0,rows,cols,w,h,hl)=>{ let s=''; for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){ const on=hl(r,c); s+=`<rect x="${x0+c*(w+2)}" y="${y0+r*(h+2)}" width="${w}" height="${h}" rx="2" fill="${on||'none'}" ${on?'opacity="0.55"':''} stroke="${DIM}" stroke-width="1"/>`; } return s; };

  /* ================= DOMAIN 18: Databases & SQL ================= */
  I.p18m1=[{cap:"Normalization before and after. One sheet repeats the customer's phone on every order (change it and you edit forty rows); five tables store each fact once and point at it with foreign keys.",
    svg:svg(560,250,`${text(130,22,'BEFORE: one sheet',{bold:true,color:MG,size:11})}${box(15,36,230,128,'',{stroke:MG,dash:true})}
      ${['order  customer  phone     product','1001   Ana       555-0101  A1, B7','1002   Ana       555-0101  B7','1003   Ben       555-0199  A1','1004   Ana       555-0101  A1'].map((l,i)=>text(24,56+i*20,l,{mono:true,size:9,anchor:'start',color:i===0?DIM:'currentColor'})).join('')}
      ${text(130,180,'same phone copied 3× → update anomaly',{size:9,color:AM})}
      ${arrow(252,100,298,100,'3NF')}
      ${text(425,22,'AFTER: five tables, each fact once',{bold:true,color:LM,size:11})}
      ${box(305,42,105,32,'customers\n(phone once)',{stroke:LM,size:10})}${box(445,42,105,32,'products\n(price once)',{stroke:LM,size:10})}
      ${box(305,102,105,32,'orders\n(date, who)',{stroke:CY,size:10})}${box(445,102,105,32,'order_lines\n(qty per line)',{stroke:CY,size:10})}
      ${box(305,162,105,32,'salespeople\n(region once)',{stroke:LM,size:10})}
      ${arrow(357,102,357,76,'')}${arrow(445,118,412,118,'')}${arrow(497,102,497,76,'')}${arrow(357,162,357,136,'')}
      ${text(280,232,'every non-key column depends on the key, the whole key, and nothing but the key',{size:10,color:DIM})}`,'A messy order sheet normalized into five tables')},
   {cap:"A many-to-many relationship cannot be stored directly. The junction table holds one row per (student, course) pair; its composite primary key is the two foreign keys, and the crow's feet mark the 'many' ends.",
    svg:svg(560,165,`${box(20,55,140,50,'students\nPK student_id',{stroke:CY,size:11})}${box(210,55,140,50,'enrollments\nPK (student_id, course_id)',{stroke:AM,size:10})}${box(400,55,140,50,'courses\nPK course_id',{stroke:CY,size:11})}
      ${line(160,80,210,80)}${line(166,74,166,86)}${crow(210,80,-1)}${line(350,80,400,80)}${line(394,74,394,86)}${crow(350,80,1)}
      ${text(185,45,'one → many',{size:9,color:DIM})}${text(375,45,'many ← one',{size:9,color:DIM})}
      ${text(280,128,'M:N cannot be stored directly — one junction row per (student, course) pair',{size:10,color:AM})}
      ${text(280,148,'FK student_id → students   ·   FK course_id → courses   ·   grade lives here',{size:10,color:DIM})}`,'Students, enrollments and courses as a junction table')},
   {cap:"The three anomalies a messy sheet suffers, and why each disappears once every fact lives in exactly one table.",
    svg:compare({t:'ONE MESSY SHEET',draw:x=>[['update: fix a phone in 40 rows, miss one',MG],['insert: no product until it is ordered',MG],['delete: last order deletes the customer',MG]].map((l,i)=>text(x+130,58+i*34,l[0],{size:10,color:l[1]})).join('')},
      {t:'FIVE TABLES (3NF)',draw:x=>[['phone lives once, in customers',LM],['products exist on their own',LM],['deleting an order touches only orders',LM]].map((l,i)=>text(x+130,58+i*34,l[0],{size:10,color:l[1]})).join('')},{h:160,label:'Update, insert and delete anomalies before and after normalization'})}];

  I.p18m2=[{cap:"Join types as sets, with the row counts from the lecture problem (a has 1,200 rows, b has 800, 650 match). Shaded is what comes back; unmatched sides are filled with NULL.",
    svg:svg(560,175,`${text(280,16,'a: 1,200 rows · b: 800 rows · 650 matches',{size:10,color:DIM})}
      ${[['inner','INNER','650'],['left','LEFT','1,200'],['right','RIGHT','800'],['full','FULL','1,350'],['anti','ANTI (left)','550']].map((j,i)=>venn(60+i*110,62,j[0],'p18v'+i)+text(60+i*110,110,j[1],{size:10,bold:true})+text(60+i*110,124,j[2]+' rows',{size:10,color:LM})).join('')}
      ${text(280,158,'anti-join: LEFT JOIN … WHERE b.id IS NULL, or NOT EXISTS — never NOT IN on a nullable column',{size:9,color:AM})}`,'Inner, left, right, full and anti joins drawn as overlapping sets')},
   {cap:"You write SELECT first, but the engine evaluates in this order. It explains every classic error: an alias is unknown in WHERE, an aggregate cannot live in WHERE, and ORDER BY alone may use SELECT aliases.",
    svg:flow([{t:'FROM / JOIN'},{t:'WHERE',stroke:CY},{t:'GROUP BY',stroke:AM},{t:'HAVING',stroke:AM},{t:'SELECT',stroke:LM},{t:'DISTINCT'},{t:'ORDER BY',stroke:MG},{t:'LIMIT / FETCH'}],{perRow:4,bw:100,gap:40,bh:44,label:'Logical evaluation order of a SELECT statement'})},
   {cap:"GROUP BY collapses rows into one per group; a window function keeps every row and adds context — here a running total per customer with SUM(amount) OVER (PARTITION BY cust ORDER BY day).",
    svg:compare({t:'GROUP BY  (collapse)',draw:x=>text(x+30,50,'cust  amount',{mono:true,size:10,anchor:'start',color:DIM})+['A     10','A     20','B      5','B      7'].map((l,i)=>text(x+30,66+i*14,l,{mono:true,size:10,anchor:'start'})).join('')+arrow(x+130,124,x+130,142,'')+text(x+30,156,'A     30',{mono:true,size:10,anchor:'start',color:LM})+text(x+30,170,'B     12',{mono:true,size:10,anchor:'start',color:LM})+text(x+130,190,'4 rows in → 2 rows out',{size:10,color:DIM})},
      {t:'WINDOW  (keep rows)',draw:x=>text(x+30,50,'cust  amount  running',{mono:true,size:10,anchor:'start',color:DIM})+[['A     10','10'],['A     20','30'],['B      5',' 5'],['B      7','12']].map((l,i)=>text(x+30,66+i*14,l[0],{mono:true,size:10,anchor:'start'})+text(x+140,66+i*14,l[1],{mono:true,size:10,anchor:'start',color:LM})).join('')+text(x+130,190,'4 rows in → 4 rows out + a column',{size:10,color:DIM})},{h:205,label:'GROUP BY versus a window function on the same four rows'})}];

  I.p18m3=[{cap:"The lost update. Both transactions read 100, both add 50, both write 150; the second write silently erases the first. Read Committed permits it; an atomic UPDATE, SELECT … FOR UPDATE, or SERIALIZABLE with a retry prevents it.",
    svg:svg(560,205,`${text(40,60,'T1',{bold:true,color:CY,size:12})}${text(40,130,'T2',{bold:true,color:MG,size:12})}
      ${box(70,42,90,36,'read\nbalance 100',{stroke:CY,size:10})}${box(290,42,90,36,'write 150\n(100 + 50)',{stroke:CY,size:10})}${box(400,42,90,36,'COMMIT',{stroke:CY,size:11})}
      ${box(180,112,90,36,'read\nbalance 100',{stroke:MG,size:10})}${box(400,112,90,36,'write 150\n(+50 lost)',{stroke:AM,size:10,dash:true})}
      ${line(115,78,115,112,{dash:true,stroke:DIM})}${line(335,78,335,112,{dash:true,stroke:DIM})}
      ${arrow(60,170,520,170,'time')}
      ${text(280,193,'final balance 150, should be 200 — the lost update anomaly under Read Committed',{size:10,color:MG})}`,'Two interleaved transactions producing a lost update')},
   {cap:"The isolation ladder: each level forbids more anomalies and costs more aborts. PostgreSQL's Read Uncommitted behaves as Read Committed, its Repeatable Read also blocks phantoms, and Serializable catches write skew — the price is retrying on SQLSTATE 40001.",
    svg:svg(560,215,`${[['Read Uncommitted','dirty · non-repeatable · phantom (PG: = Read Committed)',DIM],['Read Committed (PG default)','non-repeatable · phantom · lost update · write skew',CY],['Repeatable Read','phantom allowed by the standard; PostgreSQL: none left',AM],['Serializable','none — write skew detected, retry on 40001',LM]].map((r,i)=>box(15,15+i*48,190,38,r[0],{stroke:r[2],size:11,bold:i===1})+box(225,15+i*48,320,38,r[1],{stroke:r[2],size:10})).join('')}
      ${text(215,12,'↑ stricter',{size:9,color:DIM})}`,'SQL isolation levels and the anomalies each still allows')},
   {cap:"MVCC: an UPDATE never overwrites a row. It writes a new version stamped with its transaction ID (xmin) and stamps the old one as superseded (xmax); each snapshot sees the version that was current for it, and VACUUM reclaims the dead one later.",
    svg:svg(560,180,`${text(210,24,'UPDATE in txid 205',{size:9,color:DIM})}${text(420,24,'later',{size:9,color:DIM})}
      ${box(20,35,170,46,'version 1\nxmin 100 · xmax 205',{stroke:MG,size:11})}${arrow(192,58,228,58,'')}${box(230,35,170,46,'version 2\nxmin 205 · xmax ∞',{stroke:LM,size:11})}${arrow(402,58,438,58,'')}${box(440,35,105,46,'VACUUM\nreclaims v1',{stroke:AM,size:10,dash:true})}
      ${box(20,100,170,40,'snapshot of txid 150\nsees version 1',{stroke:MG,size:10})}${box(230,100,170,40,'snapshot of txid 300\nsees version 2',{stroke:LM,size:10})}${text(492,120,'readers never\nblock writers',{size:10,color:DIM})}
      ${text(280,164,'xmax set = that version is dead; dead tuples pile up until VACUUM runs, or the table bloats',{size:9,color:AM})}`,'Row versions under multi-version concurrency control')}];

  I.p18m4=[{cap:"A B-tree index: with about 400 entries per 8 kB page, three levels address 64 million rows and four levels billions. Finding one row is one page read per level plus the heap page — four reads for a billion-row table.",
    svg:svg(560,260,`${box(230,12,100,34,'root page\n(1 page)',{stroke:CY,size:10,bold:true})}${text(548,29,'read 1',{anchor:'end',size:10,color:AM})}
      ${text(20,62,'× 400',{anchor:'start',size:9,color:DIM})}
      ${[60,230,400].map(x=>line(280,46,x+50,74)+box(x,74,100,34,'internal page\n(400 keys)',{size:10})).join('')}${text(165,91,'…',{size:14})}${text(335,91,'…',{size:14})}${text(552,91,'read 2',{anchor:'end',size:10,color:AM})}
      ${text(20,122,'× 400',{anchor:'start',size:9,color:DIM})}
      ${[20,150,280,410].map(x=>line(280,108,x+50,134)+box(x,134,100,34,'leaf: sorted\nkeys → TIDs',{size:10,stroke:LM})).join('')}${text(552,151,'read 3',{anchor:'end',size:10,color:AM})}
      ${arrow(200,168,280,200,'')}${box(230,200,100,34,'heap page\n(the row)',{stroke:MG,size:10})}${text(552,217,'read 4',{anchor:'end',size:10,color:AM})}
      ${text(280,248,'400 × 400 × 400 ≈ 64 million entries in 3 levels; 4 page reads to any row',{size:10,color:LM})}`,'A three-level B-tree index pointing into the heap')},
   {cap:"A query plan is a tree; read it from the leaves up, because the executor pulls rows upward. The scans feed a hash join, the join feeds the aggregate, and the sort and limit trim the result.",
    svg:svg(560,262,`${text(20,24,'executor pulls rows upward',{anchor:'start',size:9,color:DIM})}${text(540,24,'output ↑',{anchor:'end',size:10,color:DIM})}
      ${box(230,10,100,30,'Limit 10',{size:11})}${line(280,40,280,55)}
      ${box(195,55,170,34,'Sort by rentals DESC',{size:11})}${line(280,89,280,104)}
      ${box(195,104,170,40,'HashAggregate\nGROUP BY customer',{stroke:CY,size:11})}${line(280,144,280,158)}
      ${box(195,158,170,40,'Hash Join\nr.customer_id = c.id',{stroke:AM,size:11})}
      ${line(280,198,130,212)}${line(280,198,420,212)}
      ${box(20,212,220,40,'Seq Scan customer\ncost=0..15 rows=599',{stroke:LM,size:11})}${box(300,212,240,40,'Hash ← Seq Scan rental\ncost=0..310 rows=16,044',{stroke:LM,size:11})}`,'An EXPLAIN plan drawn as a tree of nodes')},
   {cap:"Inside one 8 kB heap page: a 24-byte header, line pointers growing down, tuples growing up from the end, free space between. A 'small' 40-byte row costs about 70 bytes once its 23-byte header and pointer are counted.",
    svg:stack([{t:'page header (24 B)',side:'offset 0'},{t:'line pointers (4 B each) ↓',stroke:CY,side:'one per tuple'},{t:'free space',stroke:DIM,side:'fills from both ends'},{t:'tuples: 23 B header + data ↑',stroke:MG,side:'a 40 B row costs ≈ 70 B'},{t:'special space',stroke:DIM,side:'empty on heap pages'}],{w:300,side:true,h:34,label:'Layout of an 8 kB PostgreSQL heap page'})}];

  I.p18m5=[{cap:"A production topology: clients reach the primary through a connection pooler; the primary streams WAL to a synchronous standby (zero loss) and an asynchronous one (reads); Patroni with etcd watches and promotes; backups go off-site. No database port faces the internet.",
    svg:svg(560,250,`${box(15,15,110,36,'app servers',{size:11})}${arrow(125,33,160,33,'')}${box(160,15,130,36,'PgBouncer\nconnection pooler',{stroke:DIM,size:10})}${arrow(290,33,330,33,'SQL')}${box(330,15,210,40,'PRIMARY\naccepts writes · emits WAL',{stroke:CY,size:11,bold:true})}
      ${arrow(400,55,342,110,'WAL')}${arrow(470,55,482,110,'WAL')}
      ${box(280,110,125,50,'SYNC STANDBY\nack before COMMIT',{stroke:LM,size:10})}${box(420,110,125,50,'ASYNC STANDBY\nread-only, may lag',{stroke:AM,size:10})}
      ${box(15,110,230,50,'Patroni + etcd\nhealth checks · promotes a standby',{stroke:MG,size:10})}${arrow(245,120,330,56,'',{dash:true,stroke:DIM})}${arrow(245,135,280,135,'',{dash:true,stroke:DIM})}
      ${line(482,160,482,185,{dash:true,stroke:DIM})}${box(15,185,525,34,'backups: pg_basebackup + WAL archive (pgBackRest) → encrypted, off-site, restore-tested monthly',{stroke:AM,dash:true,size:10})}
      ${text(280,240,'replication = availability · backups = recovery · 5432 never on the internet',{size:10,color:DIM})}`,'Primary, standbys, pooler, failover manager and backups')},
   {cap:"Point-in-time recovery as a timeline: restore Friday's base backup, replay the archived WAL, and stop thirty seconds before Monday's bad DELETE. The recovery point is bounded by how often WAL is archived.",
    svg:svg(560,180,`${box(30,15,100,36,'Fri 14:00\npg_basebackup',{stroke:CY,size:10})}${box(330,15,120,36,'Mon 09:11:30\nrecovery_target_time',{stroke:LM,size:9})}${box(452,15,98,36,'Mon 09:12\nDELETE, no WHERE',{stroke:MG,size:9})}
      ${line(80,51,80,100)}${line(390,51,400,100)}${line(501,51,430,100)}
      ${arrow(30,100,530,100,'')}<circle cx="80" cy="100" r="4" fill="${CY}"/><circle cx="400" cy="100" r="4" fill="${LM}"/><circle cx="430" cy="100" r="4" fill="${MG}"/>
      ${arrow(92,85,392,85,'replay WAL → stop at target',{color:LM})}
      ${Array.from({length:8},(_,i)=>`<rect x="${110+i*36}" y="108" width="28" height="12" rx="2" fill="none" stroke="${DIM}"/>`).join('')}${text(250,134,'16 MB WAL segments, archived at least every 60 s',{size:9,color:DIM})}
      ${line(400,108,430,108,{stroke:MG,sw:3})}${text(470,134,'30 s lost',{size:9,color:MG})}
      ${text(280,165,'recovery point ≤ archive_timeout; downtime under 20 minutes because the drill was rehearsed',{size:9,color:AM})}`,'Base backup plus WAL replay to a recovery target time')},
   {cap:"Why parameterization is structural, not a filter: with concatenation the parser sees one string and cannot tell your SQL from the user's text; with a parameterized query the statement is parsed and planned first and the value is bound afterwards, so it can only ever be data.",
    svg:compare({t:'STRING CONCATENATION',draw:x=>box(x+20,45,220,32,'sql = "… name = \'" + input + "\'"',{mono:true,size:9,stroke:MG})+arrow(x+130,77,x+130,93,'')+box(x+20,95,220,32,'one string → the parser',{stroke:MG,size:11})+arrow(x+130,127,x+130,143,'')+box(x+20,145,220,38,'a quote in the input ends the literal;\nthe rest is parsed as SQL',{stroke:MG,size:10})},
      {t:'PARAMETERIZED QUERY',draw:x=>box(x+20,45,220,32,'SELECT … WHERE name = $1',{mono:true,size:10,stroke:CY})+arrow(x+130,77,x+130,93,'')+box(x+20,95,220,32,'parse + plan first: structure fixed',{stroke:CY,size:11})+arrow(x+130,127,x+130,143,'')+box(x+20,145,220,38,'then bind the value:\nit can only ever be data',{stroke:LM,size:10})},{h:200,label:'SQL injection mechanism versus a parameterized query'})}];

  I.p18m6=[{cap:"The five non-relational shapes with their reference systems and default ports. Each optimizes one access pattern: whole nested records, key lookups, write-heavy known queries, path traversals, or ranked text search.",
    svg:svg(560,222,`${[['Document\nMongoDB · 27017','catalogs,\nuser profiles'],['Key-value\nRedis · 6379','cache, sessions,\nrate limits'],['Wide-column\nCassandra · 9042','telemetry,\nmessage history'],['Graph\nNeo4j · 7687','fraud rings,\nattack paths'],['Search\nElastic · 9200','full-text,\nlog analytics']].map((c,i)=>{ const x=10+i*110; return box(x,10,100,32,c[0],{size:10,stroke:[CY,AM,MG,LM,CY][i]})+text(x+50,190,c[1],{size:9,color:DIM,lh:12}); }).join('')}
      ${box(10,55,100,70,'{ id: 7,\n  name: "Ana",\n  tags: [...] }',{mono:true,size:9,stroke:DIM})}${text(60,145,'nested record',{size:9,color:DIM})}
      ${[0,1,2].map(r=>box(120,55+r*28,40,20,'key',{size:9,stroke:DIM})+arrow(161,65+r*28,174,65+r*28,'')+box(176,55+r*28,44,20,'value',{size:9,stroke:DIM})).join('')}${text(170,152,'O(1) · TTL expiry',{size:9,color:DIM})}
      ${box(230,55,100,20,'partition key',{size:9,stroke:AM})}${cells(230,80,3,4,23,16,(r,c)=>c===0?AM:'')}${text(280,152,'one table per query',{size:9,color:DIM})}
      <circle cx="360" cy="70" r="12" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="420" cy="70" r="12" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="390" cy="122" r="12" fill="none" stroke="currentColor" stroke-width="1.3"/>
      ${line(372,70,408,70)}${line(366,80,384,112)}${line(414,80,396,112)}${text(360,70,'a',{size:10})}${text(420,70,'b',{size:10})}${text(390,122,'c',{size:10})}${text(390,60,'KNOWS',{size:9,color:LM})}${text(390,152,'pointer per edge',{size:9,color:DIM})}
      ${['fiber  → d1 d4','splice → d2','reel   → d1 d2 d3'].map((l,i)=>text(444,64+i*18,l,{mono:true,size:9,anchor:'start'})).join('')}${text(500,152,'term → documents',{size:9,color:DIM})}`,'Document, key-value, wide-column, graph and search data models')},
   {cap:"Quorum arithmetic with three replicas. Writing to two and reading from two guarantees the read set overlaps the write set (W + R > N), so at least one replica answering the read has the latest value — and one node can be down.",
    svg:svg(560,200,`${box(20,10,120,34,'WRITE · W = 2',{stroke:CY,size:11,bold:true})}${box(420,10,120,34,'READ · R = 2',{stroke:MG,size:11,bold:true})}
      ${arrow(80,44,125,70,'')}${arrow(140,30,290,70,'')}${arrow(420,30,300,70,'')}${arrow(480,44,465,70,'')}
      ${box(60,70,130,44,'replica 1',{stroke:CY,size:12})}${box(230,70,130,44,'replica 2\n(in both sets)',{stroke:LM,size:11})}${box(400,70,130,44,'replica 3',{stroke:AM,size:12,dash:true})}
      ${text(125,130,'has the write',{size:10,color:CY})}${text(295,130,'has the write — the read sees it',{size:10,color:LM})}${text(465,130,'stale until repaired',{size:10,color:AM})}
      ${text(280,160,'W + R > N  →  2 + 2 > 3: at least one replica in the read set holds the latest write',{size:10,color:LM})}
      ${text(280,182,'W=1, R=1 is fastest and may return stale data; N=3, W=2, R=2 survives one node down',{size:9,color:DIM})}`,'Three replicas with a write quorum of two and a read quorum of two')},
   {cap:"The CAP theorem as a triangle. Partitions are not optional in a real network, so the choice is made only during a partition: refuse some requests (CP) or answer with possibly stale data (AP). PACELC adds the everyday latency-versus-consistency trade.",
    svg:svg(560,210,`<polygon points="280,38 95,155 470,155" fill="none" stroke="currentColor" stroke-width="1.3"/>
      ${box(225,8,110,30,'C · consistency',{stroke:CY,size:11})}${box(20,155,120,30,'A · availability',{stroke:AM,size:11})}${box(420,155,130,30,'P · partition tolerance',{stroke:LM,size:10})}
      ${text(100,85,'AP: answer, maybe stale\nCassandra · DynamoDB · DNS',{size:9,color:AM})}${text(460,85,'CP: refuse during a split\netcd · ZooKeeper · sync PG',{size:9,color:CY})}
      ${text(280,120,'during a partition: C or A',{size:10,bold:true})}
      ${text(280,142,'"CA" = a single node, not a distributed system',{size:9,color:DIM})}
      ${text(280,198,'PACELC: with no partition, trade latency against consistency',{size:9,color:DIM})}`,'Consistency, availability and partition tolerance as a triangle')}];

  I.p18m7=[{cap:"A star schema for the fiber work: one fact table at the grain 'one row per reel per crew per day', with measures and foreign keys to five small, wide, denormalized dimensions keyed by surrogate integers. The fact table is the only thing that ever gets big.",
    svg:svg(560,250,`${text(280,30,'dimensions: small, wide, denormalized',{size:10,color:AM})}${text(280,48,'integer surrogate keys · Type 2 keeps history',{size:9,color:DIM})}
      ${box(15,15,130,40,'dim_date\nyear · quarter · month',{stroke:AM,size:10})}${box(415,15,130,40,'dim_crew (Type 2)\nvalid_from · valid_to',{stroke:AM,size:10})}
      ${box(190,95,180,60,'fact_install\ngrain: reel × crew × day\nfootage · splices · hours',{stroke:CY,size:10,bold:true})}
      ${box(15,195,130,40,'dim_reel\nmanufacturer · footage',{stroke:AM,size:10})}${box(415,195,130,40,'dim_location\nfrom / to · lat · lon',{stroke:AM,size:10})}${box(215,200,130,40,'dim_work_order\ncustomer · PO',{stroke:AM,size:10})}
      ${arrow(190,105,145,52,'')}${arrow(370,105,415,52,'')}${arrow(190,145,145,198,'')}${arrow(370,145,415,198,'')}${arrow(280,155,280,198,'')}
      ${text(280,178,'100 M fact rows × 40 B = 4 GB; the five dimensions = a few MB',{size:9,color:DIM})}`,'A fact table surrounded by five dimension tables')},
   {cap:"Row store versus column store on the same 1-billion-row, 50-column table. Fetching one order wants the whole row together; summing one column wants that column alone — 3 of 50 columns is 16× less I/O before compression makes it 5–10× smaller again.",
    svg:compare({t:'ROW STORE (OLTP)',draw:x=>['id','region','month','qty','revenue'].map((h,c)=>text(x+50+c*42,50,h,{size:9,color:DIM})).join('')+cells(x+30,58,5,5,40,16,(r,c)=>r===1?CY:'')+text(x+130,178,'fetch one order: one row, together, fast',{size:9,color:CY})+text(x+130,192,'sum revenue: must read all 400 GB',{size:9,color:MG})},
      {t:'COLUMN STORE (OLAP)',draw:x=>['id','region','month','qty','revenue'].map((h,c)=>text(x+50+c*42,50,h,{size:9,color:DIM})).join('')+cells(x+30,58,5,5,40,16,(r,c)=>(c===1||c===2||c===4)?LM:'')+text(x+130,178,'scan 3 of 50 columns: 24 GB, not 400',{size:9,color:LM})+text(x+130,192,'alike values compress 5–10× → ≈ 3 GB',{size:9,color:LM})},{h:205,label:'Row-oriented versus column-oriented storage for the same table'})},
   {cap:"The modern pipeline DP-900 expects you to recognize: ingest in batches or streams, land raw files in a lake, add table semantics in a lakehouse, serve SQL from a warehouse, and model a star in Power BI. ELT means the transforms happen in SQL after loading.",
    svg:flow([{t:'sources\nOLTP · files · IoT'},{t:'ingest\nData Factory · Kafka',stroke:CY},{t:'data lake\nParquet in OneLake',stroke:AM},{t:'lakehouse\nDelta / Iceberg tables',stroke:AM},{t:'warehouse\nFabric · Snowflake',stroke:LM},{t:'Power BI\nstar model · visuals',stroke:MG}],{perRow:3,bw:150,gap:40,bh:52,label:'From source systems to a dashboard'})}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
