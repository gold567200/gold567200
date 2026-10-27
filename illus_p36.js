/* Illustrations — Domain 36: Data Engineering & Big Data, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  /* ================= DOMAIN 36: Data Engineering ================= */
  I.p36m1=[{cap:"Row store versus column store. OLTP reads one whole row in one contiguous read; an OLAP aggregate over two columns in a row store must read every byte, while a columnar store reads only the two column chunks it needs and compresses them.",
    svg:compare({t:'OLTP · ROW STORE',draw:x=>['id 48213 · Ann · 19.99 · 10-26','id 48214 · Bo · 5.25 · 10-26','id 48215 · Cy · 120.00 · 10-25','… 2 billion rows × 30 columns'].map((r,i)=>box(x+15,42+i*26,230,22,r,{size:9,stroke:i===0?CY:DIM})).join('')+text(x+130,158,'one row = one contiguous read',{size:10,color:DIM})+text(x+130,174,'aggregate ⇒ read all 480 GB',{size:10,color:MG})},
      {t:'OLAP · COLUMN STORE',draw:x=>['id','name','amt','dt'].map((c,i)=>box(x+25+i*58,42,50,100,c+'\n·\n·\n·',{size:9,stroke:(i>=2)?CY:DIM,fill:(i>=2)?'#06303d':'none'})).join('')+text(x+130,158,'read only amt, dt: 2 of 30 columns',{size:10,color:DIM})+text(x+130,174,'≈ 32 GB raw → ~5 GB compressed',{size:10,color:LM})},{h:190,label:'OLTP row store versus OLAP column store'})},
   {cap:"The same billion rows, three ways to read them. Parquet shrinks the bytes and lets a two-column query skip the other eighteen columns, so the Athena bill ($5 per TB scanned) drops fifty-fold.",
    svg:svg(560,210,`${text(280,20,'1 billion rows × 20 columns — bytes a query must read',{bold:true,color:CY,size:11})}
      ${text(112,57,'CSV',{anchor:'end',size:10})}${box(120,45,410,24,'100 GB → scan everything → $0.50 per query',{fill:'#2a0b0b',stroke:MG,size:10})}
      ${text(112,97,'Parquet',{anchor:'end',size:10})}${box(120,85,82,24,'20 GB',{fill:'#2a1f0b',stroke:AM,size:10})}${text(210,97,'whole table: $0.10',{anchor:'start',size:10,color:DIM})}
      ${text(112,137,'Parquet, 2 cols',{anchor:'end',size:10})}${box(120,125,10,24,'',{fill:'#0b2a3a',stroke:CY})}${text(138,137,'2 GB → $0.01 — 50× cheaper and faster',{anchor:'start',size:10,color:LM})}
      ${text(280,175,'row groups ≈ 128 MB · column chunks · min/max statistics skip whole groups',{size:10,color:DIM})}
      ${text(280,195,'columnar + compression + pruning = fewer bytes = less money',{size:10,color:AM})}`,'CSV versus Parquet scan sizes and Athena cost')},
   {cap:"The modern data stack as a pipeline: data is pulled out of sources, landed in cheap storage, transformed in place, scheduled by an orchestrator and served to analysts and models.",
    svg:flow([{t:'sources\napps · DBs · sensors'},{t:'ingestion\nKafka · Fivetran · CDC',stroke:MG},{t:'storage\nS3 · warehouse',stroke:CY},{t:'transform\ndbt · Spark',stroke:AM},{t:'orchestrate\nAirflow',stroke:LM},{t:'serve\nBI · ML · APIs'}],{bw:120,bh:54,gap:40,perRow:3,label:'The modern data stack'})}];

  I.p36m2=[{cap:"The daily as-built DAG. Each task depends on the one before; validation quarantines bad rows instead of failing silently, and MERGE on (reel_id, dt) makes the whole run idempotent, so a backfill for one date can never double it.",
    svg:svg(560,250,`${box(20,20,140,50,'sensor\nwait for dt= files',{size:10})}${arrow(160,45,210,45,'')}${box(210,20,140,50,'validate\ncontract · types',{size:10,stroke:AM})}${arrow(350,45,400,45,'')}${box(400,20,140,50,'load\nstaging (truncate first)',{size:10})}
      ${arrow(280,70,280,105,'bad rows')}${box(210,105,140,40,'quarantine\nbad rows + reason',{dash:true,stroke:MG,size:10})}
      ${arrow(470,70,470,180,'')}${box(400,180,140,50,'merge\nMERGE on (reel_id, dt)',{size:10,stroke:CY})}${arrow(400,205,350,205,'')}${box(210,180,140,50,'test\nunique · not null · ranges',{size:10,stroke:AM})}${arrow(210,205,160,205,'')}${box(20,180,140,50,'publish\nsummary → Telegram',{size:10,stroke:LM})}`,'The as-built pipeline DAG with a quarantine branch')},
   {cap:"Airflow time. The run that covers the data interval of October 25 starts when that interval ends, at the next 06:00, and carries logical_date 2026-10-25. Airflow 3 does not catch up on missed intervals unless you ask; history is an explicit backfill.",
    svg:svg(560,180,`${text(280,30,'Airflow 3: catchup=False by default · history via explicit backfill',{size:10,color:DIM})}
      ${line(140,70,400,70,{stroke:CY})}${line(140,70,140,80,{stroke:CY})}${line(400,70,400,80,{stroke:CY})}${text(270,56,'data interval · logical_date = 2026-10-25',{size:10,color:CY})}
      ${line(40,100,520,100)}${line(140,92,140,108)}${line(400,92,400,108)}${text(140,122,'06:00 Oct 25',{size:10})}${text(400,122,'06:00 Oct 26',{size:10})}
      ${arrow(400,160,400,112,'',{stroke:LM})}${text(400,170,'run starts here (after the interval ends)',{size:10,color:LM})}`,'Airflow data interval and logical date')},
   {cap:"Why idempotency comes before retries. A plain INSERT doubles the day on a retry; a MERGE or delete-then-insert reproduces exactly one copy, which is what makes retries and backfills free.",
    svg:compare({t:'INSERT (append)',draw:x=>box(x+30,42,200,28,'run 1: INSERT → 100 rows',{size:9})+box(x+30,80,200,28,'retry: INSERT → 200 rows',{size:9,stroke:MG})+text(x+130,130,'duplicates — not idempotent',{size:10,color:MG})+text(x+130,148,'a backfill doubles history',{size:10,color:DIM})},
      {t:'MERGE / DELETE + INSERT',draw:x=>box(x+30,42,200,28,'run 1: MERGE → 100 rows',{size:9})+box(x+30,80,200,28,'retry: MERGE → 100 rows',{size:9,stroke:LM})+text(x+130,130,'same state — idempotent',{size:10,color:LM})+text(x+130,148,'retries and backfills are free',{size:10,color:DIM})},{h:170,label:'Append versus idempotent load on a retry'})}];

  I.p36m3=[{cap:"Spark's machine model. The driver builds the plan; the cluster manager hands it executors; each executor core runs one task at a time, one task per partition per stage. 40 partitions on 12 cores is four waves.",
    svg:svg(560,240,`${box(20,20,170,54,'driver\nbuilds plan · schedules tasks',{stroke:CY,size:10})}${arrow(190,47,210,47,'')}${box(210,20,160,54,'cluster manager\nK8s · YARN · standalone',{size:10})}${box(390,20,150,54,'spark.executor.memory=16g\n(16g − 300 MB) × 0.6 ≈ 9.4 GB pool',{size:9,stroke:AM})}
      ${[0,1,2].map(i=>arrow(290,74,100+i*180,110,'')+box(20+i*180,110,160,90,'',{stroke:MG})+text(100+i*180,124,'executor '+(i+1)+' · 4 cores',{size:10,color:MG})+[0,1,2,3].map(j=>box(30+i*180+j*38,138,32,24,'task',{size:8,stroke:DIM})).join('')+text(100+i*180,185,'1 task per core at a time',{size:9,color:DIM})).join('')}
      ${text(280,222,'5 GB ÷ 128 MB ≈ 40 partitions → 40 tasks ÷ 12 cores ≈ 4 waves',{size:10,color:LM})}`,'Spark driver, cluster manager and executors')},
   {cap:"A shuffle is the stage boundary. Narrow work (read, filter, map) stays inside each partition; a groupBy or join needs every row with the same key in one place, so every map task writes a block for every reduce partition and the network carries all of it before stage 2 can start.",
    svg:svg(560,220,`${text(105,22,'STAGE 1 · narrow',{bold:true,color:CY,size:11})}${text(455,22,'STAGE 2 · after shuffle',{bold:true,color:MG,size:11})}${text(280,40,'hash(key) mod 200',{size:9,color:DIM})}
      ${[0,1,2].map(i=>box(30,45+i*50,150,36,'partition '+i+'\nread · filter · map',{size:9,stroke:CY})+box(380,45+i*50,150,36,'partition '+i+'\ngroupBy · agg',{size:9,stroke:MG})).join('')}
      ${[0,1,2].map(i=>[0,1,2].map(j=>arrow(180,63+i*50,380,63+j*50,'',{stroke:DIM})).join('')).join('')}
      ${text(280,205,'all-to-all over the network · stage barrier · spark.sql.shuffle.partitions = 200 (AQE adjusts)',{size:9,color:AM})}`,'Narrow stage, shuffle, wide stage')},
   {cap:"Two ways to join a 1 TB fact table to a 5 MB dimension. Broadcasting copies the small table to every executor (about 1 GB total) and leaves the big table in place; sort-merge shuffles and sorts both sides, moving the whole terabyte.",
    svg:compare({t:'BROADCAST JOIN',draw:x=>box(x+105,40,60,26,'dim 5 MB',{size:9,stroke:LM})+[0,1,2].map(i=>arrow(x+135,66,x+55+i*80,100,'')+box(x+20+i*80,100,70,40,'fact\npart '+i,{size:9,stroke:CY})).join('')+text(x+135,160,'copy of dim on every executor',{size:10,color:DIM})+text(x+135,178,'200 × 5 MB = 1 GB moved · no fact shuffle',{size:9,color:LM})},
      {t:'SORT-MERGE JOIN',draw:x=>[0,1,2].map(i=>box(x+20+i*80,40,70,34,'fact part '+i,{size:9,stroke:MG})+box(x+20+i*80,130,70,34,'dim part '+i,{size:9,stroke:MG})).join('')+arrow(x+55,74,x+135,130,'')+arrow(x+135,74,x+215,130,'')+arrow(x+215,74,x+55,130,'')+arrow(x+135,74,x+55,130,'')+text(x+135,178,'both sides shuffled by key + sorted: 1 TB moves',{size:9,color:MG})},{h:200,label:'Broadcast join versus sort-merge join'})}];

  I.p36m4=[{cap:"A topic is partitions; a partition is an ordered log addressed by offset. The key chooses the partition, so one device's readings stay ordered; a consumer group gives each partition to exactly one member, and lag is log end minus committed offset.",
    svg:svg(560,250,`${box(20,95,110,50,'producer\nkey = device_id',{stroke:CY,size:10})}${arrow(130,120,200,120,'hash(key) mod 3')}
      ${[0,1,2].map(p=>text(200,54+p*60,'P'+p,{size:10,bold:true})+[0,1,2,3,4,5].map(j=>box(215+j*34,40+p*60,30,28,String(j),{size:9,stroke:(p===2&&j>=4)?MG:DIM})).join('')+arrow(419,54+p*60,450,54+p*60,'')).join('')}
      ${box(450,40,90,28,'C0 ← P0',{size:9,stroke:LM})}${box(450,100,90,28,'C1 ← P1',{size:9,stroke:LM})}${box(450,160,90,28,'C1 ← P2',{size:9,stroke:LM})}
      ${text(317,218,'P2: committed offset 4 · log end 6 → lag 2',{size:10,color:MG})}
      ${text(280,240,'ordering holds within a partition · one partition → one consumer in a group',{size:9,color:DIM})}`,'Kafka topic, partitions, offsets and a consumer group')},
   {cap:"Delivery guarantees are decided by when the offset is committed relative to the processing. Exactly-once inside Kafka needs the idempotent producer and transactions; beyond Kafka it needs an idempotent sink.",
    svg:stack([{t:'at-most-once: commit offset → process → a crash loses records',stroke:MG},{t:'at-least-once: process → commit → a crash replays (duplicates)',stroke:AM},{t:'exactly-once in Kafka: idempotent producer + transactions',stroke:CY},{t:'end to end: at-least-once + idempotent sink (MERGE by key)',stroke:LM}],{w:520,label:'Delivery guarantees'})},
   {cap:"Tumbling one-minute windows on event time. The watermark trails the maximum event time by 30 seconds; windows that end before it are finalized and their state released, so a reading from 10:00:40 arriving at 10:03 is dropped.",
    svg:svg(560,200,`${text(280,20,'event time →',{size:10,color:DIM})}
      ${['10:00–10:01','10:01–10:02','10:02–10:03'].map((w,i)=>box(40+i*160,40,150,60,'',{stroke:CY,dash:true})+text(115+i*160,52,w,{size:10,color:CY})).join('')}
      ${[70,95,130,160,215,250,290,330,370,410].map(cx=>'<circle cx="'+cx+'" cy="80" r="4" fill="'+LM+'"/>').join('')}
      ${line(360,35,360,110,{stroke:MG,dash:true})}${text(360,125,'watermark = max event time − 30 s',{size:10,color:MG})}
      ${'<circle cx="470" cy="150" r="4" fill="'+MG+'"/>'}${arrow(462,147,130,98,'late record → dropped',{stroke:MG,dash:true,color:MG})}
      ${text(280,180,'windows ending before the watermark are finalized; later records are discarded or side-output',{size:9,color:DIM})}`,'Tumbling windows, event time and a watermark')}];

  I.p36m5=[{cap:"Separation of storage and compute. One columnar copy of the data sits in object storage; any number of independently sized compute clusters read it and are billed only while they run.",
    svg:svg(560,220,`${box(20,25,160,56,'warehouse X-Small\n1 credit/hour',{stroke:CY,size:10})}${box(200,25,160,56,'warehouse Large\n8 credits/hour',{stroke:AM,size:10})}${box(380,25,160,56,'serverless slots / Spark\npay per second',{stroke:MG,size:10})}
      ${arrow(100,81,100,125,'')}${arrow(280,81,280,125,'')}${arrow(460,81,460,125,'')}
      ${box(20,125,520,50,'object storage · one copy · columnar micro-partitions / Parquet · about $0.02 per GB-month',{stroke:LM,size:10})}
      ${text(280,198,'compute scales up, down or to zero independently of the data',{size:10,color:DIM})}`,'Storage and compute separated')},
   {cap:"The Delta transaction log. Numbered JSON commits add and remove Parquet files; the current table is the net result, an older version is an older prefix of the log, and VACUUM eventually deletes files no version still references.",
    svg:svg(560,240,`${text(120,20,'_delta_log/',{bold:true,color:CY,mono:true,size:11})}
      ${box(20,32,200,34,'00000.json  add a, add b',{mono:true,size:9})}${box(20,74,200,34,'00001.json  add c',{mono:true,size:9})}${box(20,116,200,34,'00002.json  remove a, add d',{mono:true,size:9,stroke:AM})}${box(20,158,200,34,'00010.checkpoint.parquet (every 10)',{mono:true,size:8,stroke:DIM,dash:true})}
      ${text(423,20,'data files (Parquet)',{bold:true,color:MG,size:11})}${['a','b','c','d'].map((f,i)=>box(300+i*62,40,54,40,f+'.parquet',{size:8,stroke:i===0?DIM:MG,dash:i===0})).join('')}
      ${text(420,100,'current (v2) = {b, c, d}',{size:10,color:MG})}${text(420,118,'VERSION AS OF 1 = {a, b, c}',{size:10,color:CY})}${text(420,136,'VACUUM (7 days) deletes a → no more v1',{size:10,color:AM})}
      ${text(280,215,'the log, not the bucket, defines the table: ACID · time travel · schema enforcement',{size:9,color:DIM})}`,'Delta Lake transaction log and time travel')},
   {cap:"Medallion architecture: bronze is raw and immutable, silver is cleaned and conformed, gold is shaped for consumers. Each layer is built only from the previous one by versioned code, so any table can be rebuilt.",
    svg:flow([{t:'bronze\nraw · append-only · as landed',stroke:AM},{t:'silver\ncleaned · typed · deduplicated',edge:'dbt / Spark'},{t:'gold\naggregates · star schemas',stroke:LM,edge:'dbt'}],{bw:140,bh:56,gap:60,label:'Medallion architecture'})}];

  I.p36m6=[{cap:"Write-audit-publish. New data is written to a staging table, the tests run against it, and only a passing result is swapped into the name consumers read; a failure quarantines and alerts without publishing anything.",
    svg:svg(560,200,`${box(20,75,150,50,'write\nstaging table',{size:10})}${arrow(170,100,205,100,'')}${box(205,75,150,50,'audit\ntests run here',{size:10,stroke:AM})}
      ${arrow(355,100,390,45,'pass')}${box(390,20,150,50,'publish\nswap into the live name',{size:10,stroke:LM})}
      ${arrow(355,100,390,155,'fail',{dash:true})}${box(390,130,150,50,'quarantine + alert\nnothing published',{size:10,stroke:MG,dash:true})}
      ${text(280,185,'consumers only ever see data that passed its tests',{size:10,color:DIM})}`,'Write, audit, publish')},
   {cap:"Five protections, each stopping a different failure: access control stops the wrong person, in-place controls stop the right person seeing too much, encryption stops stolen bytes, TLS stops eavesdropping, and a secrets manager stops leaked credentials.",
    svg:stack([{t:'access: roles · least privilege · MFA · short-lived credentials',stroke:CY},{t:'in place: row filters · column masks · HMAC pseudonyms',stroke:AM},{t:'at rest: SSE-KMS envelope encryption · rotation · audit',stroke:MG},{t:'in transit: TLS everywhere (brokers, clients, APIs)',stroke:LM},{t:'secrets: secrets manager or secret scopes, never in code',stroke:DIM}],{w:520,label:'Layers of data protection'})},
   {cap:"A data incident on a timeline. Mean time to detect is the gap between bad data reaching consumers and anyone noticing; a monitor on quarantine volume would have fired before publish.",
    svg:svg(560,170,`${line(40,70,520,70)}${[[80,'05:50\ndeploy'],[200,'06:40\nbad data live'],[330,'07:45\ndetected (user)'],[490,'09:10\nresolved']].map(([x,l])=>line(x,62,x,78)+text(x,92,l,{size:9})).join('')}
      ${line(200,45,330,45,{stroke:MG})}${line(200,45,200,55,{stroke:MG})}${line(330,45,330,55,{stroke:MG})}${text(265,34,'MTTD 65 min',{size:10,color:MG})}
      ${line(330,118,490,118,{stroke:AM})}${line(330,110,330,118,{stroke:AM})}${line(490,110,490,118,{stroke:AM})}${text(410,131,'MTTR 85 min',{size:10,color:AM})}
      ${text(280,156,'with a quarantine-volume monitor: detected 06:15 — before publish',{size:10,color:LM})}`,'Data incident timeline with MTTD and MTTR')}];

  I.p36m7=[{cap:"Reference architecture on AWS: sources are ingested by DMS, AppFlow or Kinesis into an S3 lakehouse registered in the Glue Data Catalog, transformed by Glue or EMR, queried by Athena and Redshift, governed by Lake Formation, KMS and CloudTrail.",
    svg:svg(560,270,`${text(70,18,'SOURCES',{size:9,bold:true,color:DIM})}${text(190,18,'INGEST',{size:9,bold:true,color:MG})}${text(310,18,'LAKE + CATALOG',{size:9,bold:true,color:CY})}${text(460,18,'QUERY / SERVE',{size:9,bold:true,color:LM})}
      ${box(20,30,100,36,'apps · DBs',{size:9})}${box(20,76,100,36,'SaaS',{size:9})}${box(20,122,100,36,'events · IoT',{size:9})}
      ${box(140,30,100,36,'DMS (CDC)',{size:9,stroke:MG})}${box(140,76,100,36,'AppFlow',{size:9,stroke:MG})}${box(140,122,100,36,'Kinesis → Firehose',{size:9,stroke:MG})}
      ${box(260,30,100,128,'S3\nbronze → silver → gold\nParquet / Iceberg\n+ Glue Data Catalog',{size:9,stroke:CY})}${box(260,170,100,36,'Glue ETL / EMR',{size:9,stroke:AM})}${arrow(310,170,310,158,'')}
      ${box(380,30,160,36,'Athena ($5 per TB scanned)',{size:9,stroke:LM})}${box(380,76,160,36,'Redshift + Spectrum',{size:9,stroke:LM})}${box(380,122,160,36,'QuickSight · ML',{size:9,stroke:LM})}
      ${arrow(120,48,140,48,'')}${arrow(120,94,140,94,'')}${arrow(120,140,140,140,'')}${arrow(240,48,260,60,'')}${arrow(240,94,260,94,'')}${arrow(240,140,260,130,'')}${arrow(360,60,380,48,'')}${arrow(360,94,380,94,'')}${arrow(360,130,380,140,'')}
      ${box(20,225,520,34,'Lake Formation permissions · KMS · CloudTrail · CloudWatch + SNS · Step Functions / MWAA · IaC (CloudFormation, CDK, Terraform)',{size:9,stroke:DIM})}`,'AWS data platform reference architecture')},
   {cap:"Reference architecture on Databricks: Lakeflow Connect and Auto Loader land bronze Delta tables, Declarative Pipelines build silver and gold with expectations, SQL warehouses and notebooks serve them, and Unity Catalog governs everything; Asset Bundles deploy it through CI/CD.",
    svg:svg(560,250,`${box(10,10,540,185,'',{dash:true,stroke:CY})}${text(280,26,'UNITY CATALOG · privileges · lineage · masks · audit',{size:10,color:CY,bold:true})}
      ${box(25,45,120,50,'Lakeflow Connect\n+ Auto Loader',{size:9,stroke:MG})}${arrow(145,70,165,70,'')}${box(165,45,100,50,'bronze\nDelta',{size:9,stroke:AM})}${arrow(265,70,285,70,'')}${box(285,45,120,50,'Declarative Pipelines\nexpectations',{size:9})}${arrow(405,70,425,70,'')}${box(425,45,110,50,'silver → gold\nDelta',{size:9,stroke:LM})}
      ${box(25,120,160,50,'Lakeflow Jobs\norchestration',{size:9})}${box(205,120,160,50,'Databricks SQL warehouse\nBI · Photon',{size:9,stroke:LM})}${box(385,120,150,50,'notebooks · Spark jobs\nML (Domain 35)',{size:9})}
      ${arrow(480,95,460,120,'')}${arrow(345,95,285,120,'')}
      ${box(20,210,250,30,'Asset Bundles → CI/CD (GitHub Actions)',{size:9,stroke:DIM})}${box(290,210,250,30,'system tables → cost · Delta Sharing',{size:9,stroke:DIM})}`,'Databricks lakehouse reference architecture')},
   {cap:"The two exams side by side, as verified on the vendors' pages in October 2026. Take the Databricks exam first, then DEA-C01.",
    svg:compare({t:'DATABRICKS DE ASSOCIATE',draw:x=>['45 scored questions · 90 min · $200','Webassessor · online or center · 2 years','platform 6% · ingestion 21%','transformation 22% · Lakeflow Jobs 16%','CI/CD 10% · troubleshooting 10% · gov 15%'].map((l,i)=>text(x+130,48+i*26,l,{size:10})).join('')},
      {t:'AWS DEA-C01',draw:x=>['65 questions (50 scored) · 130 min · $150','Pearson VUE · pass 720/1000 · 3 years','ingestion & transformation 34%','data store management 26%','operations 22% · security & governance 18%'].map((l,i)=>text(x+130,48+i*26,l,{size:10,color:AM})).join('')},{h:190,label:'Databricks and AWS data engineering exams compared'})}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
