/* Illustrations — Domain 17: Cloud Computing (AWS, Azure & Google Cloud), built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  /* ================= DOMAIN 17: Cloud ================= */
  I.p17m1=[{cap:"A Region is a cluster of Availability Zones: separate buildings, miles apart, each with its own power, cooling and fiber, joined by private links under two milliseconds. Edge locations sit outside the Region, inside ISP networks, caching content near users.",
    svg:svg(560,250,`${box(15,30,370,205,'',{dash:true,stroke:CY})}${text(200,45,'REGION  us-east-2 (Ohio)',{bold:true,color:CY,size:11})}
      ${box(30,60,150,160,'',{dash:true,stroke:DIM})}${text(105,74,'AVAILABILITY ZONE a',{size:10,color:DIM,bold:true})}${box(42,90,126,34,'data center 1\npower · cooling · fiber',{size:9})}${box(42,135,126,34,'data center 2\nindependent feeds',{size:9})}${box(42,180,126,30,'racks of Nitro servers',{size:9,stroke:DIM})}
      ${box(220,60,150,160,'',{dash:true,stroke:DIM})}${text(295,74,'AVAILABILITY ZONE b',{size:10,color:DIM,bold:true})}${box(232,90,126,34,'data center 3\nmiles from AZ a',{size:9})}${box(232,135,126,34,'data center 4',{size:9})}${box(232,180,126,30,'same Region, other grid',{size:9,stroke:DIM})}
      ${line(180,160,220,160,{stroke:LM,sw:2})}${text(200,135,'fiber\n<2 ms',{size:9,color:LM,lh:11})}
      ${box(415,60,130,40,'edge location\nSan Antonio',{stroke:AM,size:10})}${box(415,115,130,40,'edge location\nDallas',{stroke:AM,size:10})}${box(415,170,130,40,'users',{stroke:MG,size:10})}
      ${arrow(480,170,480,155,'')}${arrow(415,140,385,140,'')}${text(400,127,'miss',{size:9,color:AM})}
      ${text(280,243,'failure shape: disk daily · server hourly · AZ rarely · Region very rarely',{size:9,color:DIM})}`,'A Region made of two Availability Zones, with edge locations outside it')},
   {cap:"The shared responsibility model as a grid. You always own your data and identities; the provider always owns the buildings and hypervisor; the rows in between change hands as you move from IaaS to PaaS to SaaS.",
    svg:svg(560,230,`${text(260,22,'IaaS (EC2)',{bold:true,color:CY,size:11})}${text(375,22,'PaaS (RDS)',{bold:true,color:CY,size:11})}${text(490,22,'SaaS (M365)',{bold:true,color:CY,size:11})}
      ${[['data · identities · access',[1,1,1]],['application code',[1,1,0]],['OS · runtime · patching',[1,0,0]],['hypervisor · hardware · buildings',[0,0,0]]].map(([lbl,row],r)=>box(40,40+r*40,160,34,lbl,{size:9,stroke:DIM})+row.map((you,c)=>box(205+c*115,40+r*40,110,34,you?'YOU':'PROVIDER',{size:10,bold:true,fill:you?'#06303d':'#2a0b2a',stroke:you?CY:MG,color:you?CY:MG})).join('')).join('')}
      ${text(280,215,'the line moves toward the provider as you rent more of the stack',{size:10,color:DIM})}`,'Shared responsibility grid across IaaS, PaaS and SaaS')}];
  I.p17m2=[{cap:"The crossover every architect is paid to find: a function bills per GB-second and grows with load, a reserved VM costs the same whether busy or idle. For Module 2's thumbnail service the lines cross near 3.3 million images a month.",
    svg:svg(560,230,`${line(60,190,540,190)}${line(60,20,60,190)}${text(60,12,'$ / month',{size:10,color:DIM,anchor:'start'})}${text(300,212,'monthly workload (images) →',{size:10,color:DIM})}
      ${line(60,120,540,120,{stroke:CY,sw:2})}${text(470,108,'VM, 1-yr Savings Plan: $15 flat',{size:10,color:CY})}
      ${line(60,185,540,40,{stroke:MG,sw:2})}${text(420,28,'Lambda: GB-seconds × $0.0000167',{size:10,color:MG})}
      <circle cx="275" cy="120" r="5" fill="${AM}"/>${text(275,96,'crossover ≈ 3.3M / month',{size:10,color:AM})}
      ${text(60,200,'0',{size:9,color:DIM})}${text(275,200,'3.3M',{size:9,color:AM})}${text(540,200,'30M',{size:9,color:DIM})}${text(50,120,'$15',{size:9,color:DIM,anchor:'end'})}${text(50,40,'$150',{size:9,color:DIM,anchor:'end'})}
      ${text(200,176,'idle most of the day → serverless wins',{size:9,color:LM})}${text(430,150,'sustained load → the VM wins',{size:9,color:LM})}`,'Cost crossover between Lambda and a reserved VM')},
   {cap:"One server is a single point of failure; an Auto Scaling group behind an Application Load Balancer is a fleet. The balancer health-checks every target, the group keeps the count between min and max and spreads it across Availability Zones.",
    svg:svg(560,250,`${box(20,15,120,40,'users\nHTTPS 443',{stroke:MG,size:10})}${arrow(140,35,205,35,'')}${box(205,15,150,40,'Application Load Balancer\nhealth checks · TLS',{stroke:CY,size:10})}
      ${box(30,85,230,120,'',{dash:true,stroke:DIM})}${text(45,98,'AZ a',{size:10,color:DIM,bold:true,anchor:'start'})}${box(45,115,95,40,'web 1',{size:10})}${box(150,115,95,40,'web 2',{size:10})}${text(145,185,'target: average CPU 50%',{size:9,color:DIM})}
      ${box(300,85,230,120,'',{dash:true,stroke:DIM})}${text(515,98,'AZ b',{size:10,color:DIM,bold:true,anchor:'end'})}${box(315,115,95,40,'web 3',{size:10})}${box(420,115,95,40,'web 4\n(scaling out)',{size:9,stroke:LM,dash:true})}${text(415,185,'lose an AZ, lose half, not all',{size:9,color:DIM})}
      ${arrow(255,55,92,115,'')}${arrow(270,55,197,115,'')}${arrow(290,55,362,115,'')}${arrow(305,55,467,115,'')}
      ${box(130,215,300,28,'Auto Scaling group: min 2 · desired 4 · max 6',{stroke:AM,size:10})}`,'An Auto Scaling group across two AZs behind a load balancer')},
   {cap:"An instance type name is a sentence. Read m7i.large as family, generation, processor and size; every size step doubles vCPU and memory together.",
    svg:svg(560,120,`${box(80,15,80,40,'m',{size:18,bold:true,stroke:CY})}${text(120,70,'family\ngeneral purpose',{size:10,color:DIM,lh:12})}
      ${box(180,15,80,40,'7',{size:18,bold:true})}${text(220,70,'generation\n(newer = cheaper)',{size:10,color:DIM,lh:12})}
      ${box(280,15,80,40,'i',{size:18,bold:true})}${text(320,70,'processor: Intel\n(a = AMD · g = Graviton)',{size:9,color:DIM,lh:12})}
      ${box(380,15,120,40,'large',{size:16,bold:true,stroke:AM})}${text(440,70,'size: 2 vCPU · 8 GiB\neach step doubles both',{size:9,color:DIM,lh:12})}
      ${text(280,108,'c = compute · r = memory · t = burstable · g / p = GPU · i = storage',{size:10,color:DIM})}`,'Decoding an EC2 instance type name')}];
  I.p17m3=[{cap:"Three storage shapes. Object storage keeps whole files under keys behind HTTPS; block storage is one virtual disk bolted to one instance; file storage is a network filesystem many machines mount at once.",
    svg:svg(560,230,`${box(10,10,170,210,'',{dash:true,stroke:DIM})}${box(195,10,170,210,'',{dash:true,stroke:DIM})}${box(380,10,170,210,'',{dash:true,stroke:DIM})}
      ${text(95,26,'OBJECT (S3)',{bold:true,color:CY})}${box(35,40,120,96,'',{stroke:CY,rx:10})}${text(95,58,'photos/2026/a.jpg',{size:9,mono:true})}${text(95,76,'logs/day1.gz',{size:9,mono:true})}${text(95,94,'backup.tar',{size:9,mono:true})}${text(95,118,'keys, not folders',{size:9,color:DIM})}${text(95,160,'HTTPS · whole objects\n11 nines · $0.023/GB',{size:9,color:DIM,lh:12})}${text(95,205,'everything else',{size:10,color:LM})}
      ${text(280,26,'BLOCK (EBS)',{bold:true,color:MG})}${box(215,45,130,40,'one EC2 instance',{size:10})}${line(280,85,280,106)}${box(235,106,90,40,'gp3 volume\n3,000 IOPS',{size:9,stroke:MG})}${text(280,160,'one AZ · in-place writes\nsnapshots to S3',{size:9,color:DIM,lh:12})}${text(280,205,'databases · boot disks',{size:10,color:LM})}
      ${text(465,26,'FILE (EFS)',{bold:true,color:AM})}${box(395,45,45,30,'vm',{size:9})}${box(443,45,45,30,'vm',{size:9})}${box(491,45,45,30,'vm',{size:9})}${line(417,75,465,106)}${line(465,75,465,106)}${line(513,75,465,106)}${box(410,106,110,40,'NFS filesystem\nmulti-AZ',{size:9,stroke:AM})}${text(465,160,'many mounts at once\n$0.30/GB-month',{size:9,color:DIM,lh:12})}${text(465,205,'shared trees · uploads',{size:10,color:LM})}`,'Object, block and file storage compared')},
   {cap:"A lifecycle policy walks objects down the storage classes as they age and finally deletes them. Module 3's photo archive drops from $64 to about $5 a month this way.",
    svg:flow([{t:'S3 Standard\n$0.023/GB',stroke:CY},{t:'Standard-IA\n$0.0125/GB',edge:'30 days'},{t:'Glacier Flexible\n$0.0036/GB',edge:'90 days'},{t:'Deep Archive\n$0.00099/GB',edge:'1 year',stroke:AM},{t:'expire\n(and old versions)',edge:'7 years',stroke:MG}],{label:'S3 lifecycle policy'})},
   {cap:"Multi-AZ is for failover: a synchronous standby that takes over the same endpoint and serves no reads. A read replica is for scaling: an asynchronous copy with its own endpoint. Exam questions hinge on not confusing them.",
    svg:compare({t:'MULTI-AZ (failover)',draw:x=>box(x+15,45,90,40,'primary\nAZ a',{stroke:CY,size:10})+arrow(x+108,65,x+152,65,'sync')+box(x+155,45,90,40,'standby\nAZ b',{stroke:CY,size:10,dash:true})+text(x+130,112,'same DNS endpoint\nfailover ≈ 60 s · RPO 0',{size:10,color:DIM})+text(x+130,155,'standby takes no reads',{size:10,color:MG})},
      {t:'READ REPLICA (scale reads)',draw:x=>box(x+15,45,90,40,'primary\nwrites + reads',{stroke:CY,size:10})+arrow(x+108,65,x+152,65,'async')+box(x+155,45,90,40,'replica\nreads only',{stroke:MG,size:10})+text(x+130,112,'own endpoint · lag ms to s\ncan be cross-Region',{size:10,color:DIM})+text(x+130,155,'promotable, but not HA',{size:10,color:MG})},{h:180,label:'Multi-AZ versus read replica'})}];
  I.p17m4=[{cap:"The two-tier, two-AZ VPC from the worked example. Public subnets reach the internet gateway and hold the load balancer and NAT gateways; private app subnets route outbound through NAT and reach S3 through a free gateway endpoint; database subnets have no route out at all.",
    svg:svg(560,345,`${box(230,8,100,26,'internet',{stroke:MG,size:10})}${arrow(280,34,280,48,'')}${box(215,48,130,28,'internet gateway',{stroke:CY,size:10})}
      ${box(15,90,530,232,'',{dash:true,stroke:CY})}${text(40,103,'VPC 10.20.0.0/16',{size:10,color:CY,bold:true,anchor:'start'})}${text(40,119,'AZ a',{size:10,color:DIM,bold:true,anchor:'start'})}${text(520,119,'AZ b',{size:10,color:DIM,bold:true,anchor:'end'})}
      ${box(30,128,240,48,'',{stroke:LM,dash:true})}${text(262,138,'public 10.20.0.0/24',{size:9,color:LM,anchor:'end'})}${box(45,146,100,26,'ALB',{size:9})}${box(160,146,100,26,'NAT gateway',{size:9,stroke:AM})}
      ${box(290,128,240,48,'',{stroke:LM,dash:true})}${text(522,138,'public 10.20.1.0/24',{size:9,color:LM,anchor:'end'})}${box(305,146,100,26,'ALB',{size:9})}${box(420,146,100,26,'NAT gateway',{size:9,stroke:AM})}
      ${text(280,186,'route: 0.0.0.0/0 → igw',{size:9,color:LM})}
      ${box(30,196,240,48,'',{stroke:CY,dash:true})}${text(262,206,'private app 10.20.10.0/24',{size:9,color:CY,anchor:'end'})}${box(45,214,210,26,'web servers (ASG) · SSM only',{size:9})}
      ${box(290,196,240,48,'',{stroke:CY,dash:true})}${text(522,206,'private app 10.20.11.0/24',{size:9,color:CY,anchor:'end'})}${box(305,214,210,26,'web servers (ASG) · SSM only',{size:9})}
      ${text(280,254,'route: 0.0.0.0/0 → nat (per AZ) · S3 via gateway endpoint',{size:9,color:CY})}
      ${box(30,264,240,48,'',{stroke:MG,dash:true})}${text(262,274,'private db 10.20.20.0/24',{size:9,color:MG,anchor:'end'})}${box(45,282,210,26,'RDS primary',{size:9})}
      ${box(290,264,240,48,'',{stroke:MG,dash:true})}${text(522,274,'private db 10.20.21.0/24',{size:9,color:MG,anchor:'end'})}${box(305,282,210,26,'RDS standby (Multi-AZ)',{size:9})}
      ${text(280,334,'route: local only — no path to the internet',{size:9,color:MG})}
      ${arrow(265,76,95,146,'')}${arrow(295,76,355,146,'')}${arrow(95,172,105,214,'')}${arrow(355,172,365,214,'')}${arrow(80,240,80,282,'')}${arrow(340,240,340,282,'')}`,'A two-tier VPC across two Availability Zones')},
   {cap:"Two firewalls with different natures. The security group is stateful, lives on the instance and only allows; the network ACL is stateless, lives on the subnet and can deny. Use the first to connect tiers, the second to block a hostile range.",
    svg:compare({t:'SECURITY GROUP',draw:x=>['attaches to the instance (ENI)','stateful: replies allowed','allow rules only · implicit deny','all rules evaluated together','can reference other groups','default: deny in · allow out'].map((l,i)=>text(x+130,50+i*22,l,{size:10})).join('')},
      {t:'NETWORK ACL',draw:x=>['attaches to the subnet','stateless: allow ephemeral ports','allow AND deny rules','lowest rule number wins','CIDRs only','default NACL allows everything'].map((l,i)=>text(x+130,50+i*22,l,{size:10,color:AM})).join('')},{h:195,label:'Security group versus network ACL'})},
   {cap:"Direct Connect is a physical port in a colocation building: your router, a single-mode patch cord with 1310 nm LR optics, 802.1Q VLANs and BGP, then a private virtual interface into your VPC. Hosted connections start at 50 Mbps; dedicated ports come in 1, 10, 100 and 400 Gbps.",
    svg:flow([{t:'your router\nBGP · 802.1Q VLAN',stroke:MG},{t:'cross-connect\nSMF · 1310 nm LR',stroke:AM},{t:'Direct Connect port\n1 / 10 / 100 / 400G',stroke:CY},{t:'AWS Region\nprivate VIF → VPC',stroke:LM}],{bw:112,gap:30,label:'The Direct Connect path'})}];
  I.p17m5=[{cap:"How IAM decides. Everything starts denied; one explicit Deny anywhere ends the request; otherwise an Allow must exist in an identity or resource policy and must also be permitted by the Organization's SCPs and any permissions boundary.",
    svg:svg(560,250,`${box(20,20,120,40,'API request\n(who · action · resource)',{stroke:CY,size:9})}${arrow(140,40,180,40,'')}
      ${box(180,20,120,40,'explicit Deny\nanywhere?',{stroke:MG,size:10})}${arrow(300,40,340,40,'no')}
      ${box(340,20,120,40,'Allow in identity\nor resource policy?',{size:9})}${arrow(400,60,400,100,'yes')}
      ${box(340,100,120,40,'SCP + permissions\nboundary allow?',{size:9})}${arrow(400,140,400,180,'yes')}
      ${box(340,180,120,40,'ALLOW',{stroke:LM,fill:'#0b2a14',bold:true,color:LM})}
      ${box(150,180,120,40,'DENY (default)',{stroke:MG,fill:'#2a0b0b',bold:true,color:MG})}
      ${arrow(240,60,240,180,'yes')}${arrow(345,60,255,180,'no')}${arrow(340,128,270,192,'no')}
      ${text(280,240,'every applicable policy is read; a single Deny statement settles it',{size:9,color:DIM})}`,'IAM policy evaluation flow')},
   {cap:"Machines get roles, never keys. A long-term access key pasted into a config works from anywhere forever once stolen; a role hands the instance short-lived STS credentials scoped to one bucket, and every use lands in CloudTrail.",
    svg:compare({t:'WRONG: access keys',draw:x=>box(x+30,42,200,34,'IAM user + long-term keys',{size:10,stroke:MG})+arrow(x+130,76,x+130,96,'')+box(x+30,96,200,34,'pasted into config on EC2',{size:10})+text(x+130,150,'stolen once = valid forever\nworks from any IP on Earth',{size:10,color:MG})},
      {t:'RIGHT: IAM role',draw:x=>box(x+30,42,200,34,'instance profile → role',{size:10,stroke:LM})+arrow(x+130,76,x+130,96,'')+box(x+30,96,200,34,'STS temporary creds (1 h)',{size:10})+text(x+130,150,'scoped to one bucket · rotates\nIMDSv2 · logged in CloudTrail',{size:10,color:LM})},{h:190,label:'Access keys versus an IAM role'})},
   {cap:"Envelope encryption: a data key encrypts the object, the KMS key (which never leaves the hardware security module) encrypts the data key, and the wrapped data key is stored beside the ciphertext. Decrypting means asking KMS, which checks permissions and logs the call.",
    svg:svg(560,170,`${box(15,30,120,44,'your data\n(object · volume · row)',{size:9})}${box(215,30,130,44,'data key\n(AES-256, per object)',{stroke:CY,size:9})}${box(425,30,120,44,'KMS key in HSM\nnever leaves KMS',{stroke:MG,size:9})}
      ${arrow(215,52,135,52,'encrypts')}${arrow(425,52,345,52,'wraps')}
      ${arrow(280,74,280,110,'')}${box(140,110,280,40,'stored together: ciphertext + wrapped data key',{size:9,stroke:DIM})}
      ${text(280,163,'decrypt = ask KMS to unwrap the data key · permission-checked · logged',{size:9,color:DIM})}`,'Envelope encryption with KMS')}];
  I.p17m6=[{cap:"The default good design: Route 53 to an ALB spanning two AZs, an Auto Scaling web tier, an SQS queue absorbing bursts between web and workers (spot instances scaling on queue depth), and RDS Multi-AZ with a synchronous standby. Any single AZ can vanish.",
    svg:svg(560,320,`${box(230,8,100,26,'Route 53',{size:10,stroke:MG})}${arrow(280,34,280,50,'')}${box(205,50,150,30,'ALB (2 AZs)',{stroke:CY,size:10})}
      ${box(20,95,250,215,'',{dash:true,stroke:DIM})}${text(32,107,'AZ a',{size:10,color:DIM,bold:true,anchor:'start'})}${box(290,95,250,215,'',{dash:true,stroke:DIM})}${text(528,107,'AZ b',{size:10,color:DIM,bold:true,anchor:'end'})}
      ${box(40,120,100,34,'web (ASG)',{size:10})}${box(310,120,100,34,'web (ASG)',{size:10})}${arrow(255,80,90,120,'')}${arrow(305,80,360,120,'')}
      ${box(180,175,200,36,'SQS queue (regional)\nvisibility timeout 6 min',{stroke:AM,size:9,fill:'var(--bg)'})}${arrow(90,154,200,175,'')}${arrow(360,154,360,175,'')}
      ${box(40,230,100,34,'workers (spot)',{size:10})}${box(310,230,100,34,'workers (spot)',{size:10})}${arrow(200,211,90,230,'')}${arrow(360,211,360,230,'')}
      ${box(150,278,100,30,'RDS primary',{stroke:MG,size:9})}${box(310,278,110,30,'RDS standby (sync)',{stroke:MG,size:9,dash:true})}${arrow(250,293,310,293,'')}
      ${arrow(90,264,170,278,'')}${arrow(360,264,250,283,'')}`,'Multi-AZ architecture decoupled by a queue')},
   {cap:"Availability arithmetic. Components in series multiply their uptimes and the weakest link dominates; independent components in parallel multiply their failure probabilities, which is why two AZs are so much better than one.",
    svg:compare({t:'SERIES (multiply uptimes)',draw:x=>box(x+20,45,100,34,'ALB 99.99%',{size:10})+arrow(x+120,62,x+140,62,'')+box(x+140,45,100,34,'RDS 99.95%',{size:10})+text(x+130,105,'0.9999 × 0.9995',{size:11,color:AM,mono:true})+text(x+130,125,'= 99.94%  (≈ 5.3 h / year down)',{size:10,color:CY})+text(x+130,155,'the weakest link dominates',{size:10,color:DIM})},
      {t:'PARALLEL (multiply failures)',draw:x=>box(x+20,45,100,34,'AZ a 99.9%',{size:10})+box(x+140,45,100,34,'AZ b 99.9%',{size:10})+text(x+130,105,'1 − 0.001 × 0.001',{size:11,color:AM,mono:true})+text(x+130,125,'= 99.9999%  (≈ 32 s / year)',{size:10,color:MG})+text(x+130,155,'only if failures are independent',{size:10,color:DIM})},{h:180,label:'Series versus parallel availability'})},
   {cap:"The four disaster-recovery strategies trade money for RPO and RTO. Pick the cheapest rung that meets the numbers the business actually wrote down.",
    svg:stack([{t:'backup & restore · RPO hours · RTO hours',stroke:DIM,side:'cheapest'},{t:'pilot light · data live, servers off',side:'$$ · RTO tens of min'},{t:'warm standby · scaled-down copy running',stroke:AM,side:'$$$ · RTO minutes'},{t:'active-active · RPO ≈ 0 · RTO ≈ 0',stroke:MG,side:'about double'}],{w:340,side:true,label:'Four DR strategies'})}];
  I.p17m7=[{cap:"Infrastructure as code is a loop, not a document: the template lives in Git, a change set previews the diff, the stack deploys, drift detection catches hand edits, and deleting the stack removes everything it made. That last step is how a lab ends at $0.",
    svg:flow([{t:'template.yaml\nin Git',stroke:CY},{t:'validate +\nchange set',edge:'commit'},{t:'deploy\nstack',stroke:LM,edge:'review'},{t:'drift\ndetection',stroke:AM},{t:'delete stack\n= clean lab',stroke:MG}],{label:'The infrastructure-as-code loop'})},
   {cap:"Billing guardrails, wired. Usage becomes the EstimatedCharges metric (published only in us-east-1), an alarm fires an SNS email, and a Budget adds forecast alerts and an optional automated action. Set up in thirty minutes, before the first server.",
    svg:svg(560,200,`${box(20,30,110,44,'metered usage\n(EC2 · NAT · S3 …)',{size:9})}${arrow(130,52,170,52,'')}
      ${box(170,30,130,44,'AWS/Billing EstimatedCharges\nus-east-1 only',{stroke:CY,size:9})}${arrow(300,52,340,52,'')}
      ${box(340,30,90,44,'alarm\n> $5',{stroke:MG,size:11})}${arrow(430,52,460,52,'')}${box(460,30,85,44,'SNS → email',{stroke:LM,size:9})}
      ${text(385,88,'needs billing alerts enabled',{size:9,color:DIM})}
      ${arrow(235,74,235,120,'')}${box(170,120,130,44,'AWS Budget $10\n50 / 80 / 100%',{stroke:CY,size:9})}${arrow(300,142,340,142,'')}${box(340,120,205,44,'forecast alert → action:\ndeny ec2:RunInstances',{stroke:AM,size:9})}
      ${text(280,185,'first thirty minutes of every new account · total cost $0',{size:10,color:DIM})}`,'Billing alarm and budget flow')},
   {cap:"The seven Rs of migration applied to a home lab. The first two are retire and retain; a GPU box running local models and a smart-home hub usually belong at home, and the plan should say so with the numbers.",
    svg:svg(560,200,`${box(20,20,120,56,'retire\n(2015 Minecraft server)',{stroke:DIM,size:9})}${box(155,20,120,56,'retain\n(GPU box · smart home)',{stroke:LM,size:9})}${box(290,20,120,56,'rehost\n(lift and shift to a VM)',{size:9})}${box(425,20,120,56,'relocate\n(VMware estate wholesale)',{size:9})}
      ${box(87,100,120,56,'replatform\n(MySQL → RDS)',{stroke:CY,size:9})}${box(222,100,120,56,'repurchase\n(buy the SaaS instead)',{size:9})}${box(357,100,120,56,'refactor\n(site → S3 + CloudFront)',{stroke:MG,size:9})}
      ${text(280,185,'inventory → estimate → guardrails → stateless first → data → DNS cutover → decommission',{size:9,color:DIM})}`,'The seven Rs of migration')}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
