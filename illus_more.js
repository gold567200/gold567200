/* Illustrations for Domains 6–11, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};

  /* ================= DOMAIN 6: Java ================= */
  I.p6m1=[{cap:"Write once, run anywhere: javac compiles your source to bytecode once; each platform's JVM runs that same bytecode.",
    svg:svg(560,170,`${box(20,55,110,50,'Hello.java\n(source)',{size:11})}${arrow(130,80,200,80,'javac')}${box(200,55,120,50,'Hello.class\n(bytecode)',{size:11,stroke:AM})}
      ${arrow(320,70,400,30,'')}${arrow(320,80,400,80,'')}${arrow(320,90,400,130,'')}${box(400,15,140,30,'JVM on Windows',{size:11,stroke:CY})}${box(400,65,140,30,'JVM on macOS',{size:11,stroke:CY})}${box(400,115,140,30,'JVM on Linux / Android',{size:11,stroke:CY})}
      ${text(280,150,'JDK = compiler + tools · JRE/JVM = what runs it',{size:11,color:DIM})}`,'Java source compiled to bytecode and run by JVMs on any platform')}];
  I.p6m2=[{cap:"Static typing: every variable declares what it holds, and the compiler refuses mismatches before the program ever runs.",
    svg:svg(540,130,`${[['int','42',CY],['double','3.14',CY],['boolean','true',CY],['String','"hi"',LM]].map(([t,v,c],i)=>box(20+i*130,25,115,45,t+'\n'+v,{mono:true,size:12,stroke:c})).join('')}
      ${text(270,100,'int x = "hello";   →  compile error: incompatible types (caught before running)',{mono:true,size:11,color:MG})}`,'Java typed variables and a compile-time type error')}];
  I.p6m3=[{cap:"A class is the blueprint; new builds objects from it; private fields are changed only through methods (encapsulation).",
    svg:svg(540,160,`${box(20,25,180,110,'class Account {\n  private double balance;\n  void deposit(double amt)\n  double getBalance()\n}',{mono:true,size:11,stroke:CY})}
      ${arrow(200,70,270,50,'new Account()')}${arrow(200,90,270,110,'new Account()')}${box(270,30,110,40,'acct1\nbalance 150',{size:11,stroke:LM})}${box(270,90,110,40,'acct2\nbalance 40',{size:11,stroke:LM})}
      ${text(460,60,'acct1.balance = -5\n✗ private!',{size:11,color:MG})}${text(460,110,'acct1.deposit(10)\n✓ via method',{size:11,color:LM})}`,'Class with private field and objects created from it')}];
  I.p6m4=[{cap:"Inheritance tree plus an interface contract: every Dog is an Animal; anything that implements Swimmer promises a swim() method. Polymorphism lets one list hold them all.",
    svg:svg(540,190,`${box(220,15,100,34,'Animal',{stroke:CY,bold:true})}${line(270,49,150,85)}${line(270,49,270,85)}${line(270,49,390,85)}
      ${box(100,85,100,34,'Dog',{})}${box(220,85,100,34,'Cat',{})}${box(340,85,100,34,'Duck',{})}
      ${box(420,15,110,34,'«interface»\nSwimmer',{size:10,dash:true,stroke:AM})}${line(390,85,475,49,{dash:true,stroke:AM})}${line(150,85,100,49,{dash:true,stroke:AM})}${box(30,15,100,34,'«interface»\nSwimmer',{size:10,dash:true,stroke:AM})}
      ${text(270,150,'for (Animal a : zoo) a.speak();   → "Woof", "Meow", "Quack"',{mono:true,size:11,color:LM})}${text(270,172,'same call, each object answers its own way = polymorphism',{size:10,color:DIM})}`,'Animal inheritance tree with a Swimmer interface and polymorphic call')}];
  I.p6m5=[{cap:"The three main collection interfaces and the classes you'll use most, plus what generics add.",
    svg:tree({t:'Collections',kids:[{t:'List\n(ordered)',kids:['ArrayList','LinkedList']},{t:'Set\n(unique)',kids:['HashSet','TreeSet']},{t:'Map\n(key→value)',kids:['HashMap','TreeMap']}]},{three:true,label:'Java collections hierarchy'})}];
  I.p6m6=[{cap:"Stack vs heap: each method call gets a frame of local variables on the stack; objects live on the heap and are reached through references. The garbage collector frees objects nobody references.",
    svg:svg(540,180,`${text(110,20,'STACK (per thread)',{bold:true,color:CY})}${box(40,30,140,36,'main(): a → ref',{size:11,mono:true})}${box(40,70,140,36,'deposit(): amt=10',{size:11,mono:true})}
      ${text(400,20,'HEAP (objects)',{bold:true,color:MG})}${box(320,30,160,40,'Account{balance=150}',{size:11,mono:true,stroke:LM})}${box(320,90,160,40,'Account{balance=40}',{size:11,mono:true,stroke:DIM,dash:true})}
      ${arrow(180,48,318,50,'reference')}${text(400,150,'no reference → garbage collected',{size:11,color:DIM})}${text(110,150,'null = reference to nothing\n→ NullPointerException',{size:11,color:MG})}`,'Stack frames referencing objects on the heap')}];
  I.p6m7=[{cap:"A real Java project: packages organize code, a build tool fetches libraries and compiles, tests run automatically, and the result ships as a jar.",
    svg:flow([{t:'src/…\npackages'},{t:'Maven /\nGradle',stroke:AM,edge:'build'},{t:'libraries\n(downloaded)',edge:'deps'},{t:'JUnit\ntests',stroke:CY,edge:'test'},{t:'app.jar',stroke:LM,edge:'package'}],{bw:96,bh:52,gap:30,label:'Java build pipeline'})}];

  /* ================= DOMAIN 7: Cybersecurity ================= */
  I.p7m1=[{cap:"The CIA triad: every control protects confidentiality, integrity or availability — and risk is threat × vulnerability × impact.",
    svg:svg(520,210,`<polygon points="260,25 60,185 460,185" fill="none" stroke="${CY}" stroke-width="1.6"/>${text(260,15,'Confidentiality',{bold:true,color:CY})}${text(60,200,'Integrity',{bold:true,color:AM})}${text(460,200,'Availability',{bold:true,color:LM})}
      ${text(260,105,'SECURITY',{bold:true,size:14})}${text(160,130,'encryption\naccess control',{size:10,color:DIM})}${text(360,130,'backups\nredundancy',{size:10,color:DIM})}${text(260,165,'hashes · signatures',{size:10,color:DIM})}`,'CIA triad triangle')},
   {cap:"Defense in depth: layers, so one failure isn't fatal.",svg:stack([{t:'policies & training (people)',stroke:DIM},{t:'perimeter: firewall, VPN'},{t:'network: segmentation, IDS',stroke:AM},{t:'host: patching, hardening, EDR'},{t:'application: input validation, auth',stroke:CY},{t:'data: encryption, backups',stroke:LM}],{w:360,label:'Defense in depth layers'})}];
  I.p7m2=[{cap:"Three tools, three jobs: symmetric encryption (one shared key), asymmetric (public lock, private unlock — and signing), and hashing (one-way fingerprint).",
    svg:svg(600,200,`${text(100,20,'SYMMETRIC (AES)',{bold:true,color:CY})}${box(30,35,60,30,'text',{size:11})}${arrow(90,50,150,50,'🔑 K')}${box(150,35,60,30,'cipher',{size:11,stroke:CY})}${arrow(150,70,90,70,'🔑 K',{})}${text(120,95,'same key both ways',{size:10,color:DIM})}
      ${text(310,20,'ASYMMETRIC (RSA/EC)',{bold:true,color:AM})}${box(240,35,60,30,'text',{size:11})}${arrow(300,50,360,50,'public 🔓')}${box(360,35,60,30,'cipher',{size:11,stroke:AM})}${arrow(360,70,300,70,'private 🔑')}${text(330,95,'anyone locks, only you unlock\n(reverse it = signature)',{size:10,color:DIM})}
      ${text(520,20,'HASH (SHA-256)',{bold:true,color:MG})}${box(470,35,100,30,'any data',{size:11})}${arrow(520,65,520,95,'')}${box(470,95,100,30,'64-hex digest',{size:10,stroke:MG})}${text(520,140,'one-way · change 1 bit,\nwhole hash changes',{size:10,color:DIM})}
      ${text(300,180,'TLS uses all three: asymmetric to agree a key, symmetric for speed, hashes for integrity',{size:11,color:LM})}`,'Symmetric encryption, asymmetric encryption and hashing')}];
  I.p7m3=[{cap:"Authentication (who are you), authorization (what may you do), accounting (what did you do) — and the three factor types that make MFA work.",
    svg:flow([{t:'AUTHENTICATE\nknow · have · are',stroke:CY},{t:'AUTHORIZE\nrole / rules',stroke:AM,edge:'identity'},{t:'ACCOUNT\nlogs, audit',stroke:LM,edge:'actions'}],{bw:130,bh:56,gap:50,label:'AAA: authentication, authorization, accounting'})}];
  I.p7m4=[{cap:"Each attack class has a matching defense. Learn them as pairs.",
    svg:svg(560,200,`${[['phishing / social engineering','training · MFA · verify'],['malware / ransomware','patch · least privilege · backups · EDR'],['network: MITM, spoofing','encryption (TLS/VPN) · segmentation'],['web: SQL injection, XSS','validate input · parameterize · escape output']].map(([a,d],i)=>box(20,15+i*45,230,36,a,{size:11,stroke:MG})+arrow(252,33+i*45,300,33+i*45,'')+box(300,15+i*45,240,36,d,{size:11,stroke:LM})).join('')}`,'Attack classes paired with their defenses')}];
  I.p7m5=[{cap:"Segmented, zero-trust network: zones separated by firewalls, every request verified, so a compromised printer can't reach payroll.",
    svg:svg(560,170,`${box(20,60,100,50,'internet',{size:11})}${arrow(120,85,170,85,'')}${box(170,40,80,90,'edge\nfirewall',{size:11,stroke:AM})}
      ${arrow(250,60,320,30,'')}${box(320,15,100,32,'guest / IoT',{size:11,stroke:DIM})}${arrow(250,85,320,85,'')}${box(320,69,100,32,'staff',{size:11})}${arrow(250,110,320,140,'')}${box(320,124,100,32,'servers',{size:11,stroke:CY})}
      ${line(420,31,470,31,{dash:true,stroke:MG})}${text(500,31,'✗ blocked',{size:10,color:MG})}${arrow(420,85,470,140,'verified only')}${text(290,165,'zero trust: verify every request, every time',{size:11,color:LM})}`,'Segmented network with firewall-enforced zones')}];
  I.p7m6=[{cap:"The incident-response lifecycle. The 'lessons learned' step is what makes the next incident smaller.",
    svg:cycle(['prepare','identify','contain','eradicate','recover','lessons\nlearned'],{label:'Incident response lifecycle'})}];
  I.p7m7=[{cap:"Governance sets the rules, risk management chooses priorities, compliance proves it — and people make or break all of it.",
    svg:stack([{t:'Governance: policies, standards, ownership',stroke:CY},{t:'Risk: identify · assess · treat (avoid, reduce, transfer, accept)',stroke:AM},{t:'Compliance: ISO 27001 · SOC 2 · PCI DSS · HIPAA · GDPR'},{t:'People: training, culture, clear processes',stroke:LM}],{w:440,label:'Governance, risk, compliance and people'})}];

  /* ================= DOMAIN 8: Ethical Hacking ================= */
  I.p8m1=[{cap:"The only line that matters: written authorization with a defined scope. Same tools, same actions — on one side a profession, on the other a crime.",
    svg:compare({t:'authorized test',draw:x=>box(x+30,45,200,30,'signed scope + RoE + dates',{size:11,stroke:LM})+box(x+30,85,200,30,'named emergency contact',{size:11,stroke:LM})+text(x+130,140,'= professional pentester',{color:LM,bold:true})},{t:'no authorization',draw:x=>box(x+30,45,200,30,'"they seemed fine with it"',{size:11,stroke:MG})+box(x+30,85,200,30,'"I was just curious"',{size:11,stroke:MG})+text(x+130,140,'= CFAA felony, intent irrelevant',{color:MG,bold:true})},{h:165,label:'Authorized testing versus unauthorized access'})}];
  I.p8m2=[{cap:"The five phases of an engagement, bracketed by scoping before and the report after.",
    svg:flow([{t:'scope &\nRoE',stroke:AM},{t:'recon'},{t:'scan &\nenumerate'},{t:'exploit\n(prove it)',stroke:MG},{t:'post-\nexploitation'},{t:'report',stroke:LM}],{bw:80,bh:52,gap:22,label:'Penetration test phases'})}];
  I.p8m3=[{cap:"A legal home lab: attacker VM and target VM on a host-only network inside your own machine — nothing reaches the real internet.",
    svg:svg(520,170,`${box(20,20,480,130,'',{dash:true,stroke:DIM})}${text(60,35,'your PC (VirtualBox)',{anchor:'start',size:11,color:DIM})}
      ${box(60,60,160,60,'Kali Linux VM\n(attacker)',{size:11,stroke:MG})}${arrow(220,90,300,90,'host-only net')}${box(300,60,160,60,'Juice Shop /\nMetasploitable (target)',{size:11,stroke:CY})}
      ${line(380,120,380,140,{dash:true,stroke:MG})}${text(380,160,'✗ no route to the internet',{size:11,color:MG})}`,'Isolated attacker and target VMs on a host-only network')}];
  I.p8m4=[{cap:"The report is the deliverable: findings ranked by severity, with evidence and exact fixes, then a retest to close them.",
    svg:stack([{t:'Executive summary (for leadership)',stroke:CY},{t:'Finding: title · severity · evidence · remediation',stroke:MG},{t:'Finding: …  (repeat, ordered by risk)'},{t:'Methodology & scope covered'},{t:'Retest → verified fixed ✓',stroke:LM}],{w:420,label:'Structure of a penetration test report'})}];

  /* ================= DOMAIN 9: AI ================= */
  I.p9m1=[{cap:"Classical programming: data + rules → answers. Machine learning: data + answers → rules (the model), then the model turns new data into answers.",
    svg:compare({t:'classical',draw:x=>box(x+25,45,90,34,'data',{size:11})+box(x+25,95,90,34,'rules (code)',{size:11})+arrow(x+115,62,x+160,80,'')+arrow(x+115,112,x+160,95,'')+box(x+160,70,90,34,'answers',{size:11,stroke:CY})},{t:'machine learning',draw:x=>box(x+25,45,90,34,'data',{size:11})+box(x+25,95,90,34,'answers',{size:11})+arrow(x+115,62,x+160,80,'')+arrow(x+115,112,x+160,95,'')+box(x+160,70,90,34,'model\n(rules)',{size:11,stroke:MG})},{h:150,label:'Classical programming versus machine learning'})}];
  I.p9m2=[{cap:"One neuron: inputs × weights, summed, plus a bias, through an activation. Layers of them turn pixels into 'cat'.",
    svg:svg(560,190,`${[['x₁',40],['x₂',95],['x₃',150]].map(([t,y])=>`<circle cx="60" cy="${y}" r="16" fill="none" stroke="currentColor"/>`+text(60,y,t,{size:12})+arrow(78,y,200,95,'w'+t.slice(1))).join('')}
      <circle cx="230" cy="95" r="32" fill="#06303d" stroke="${CY}" stroke-width="1.6"/>${text(230,90,'Σ + b',{size:12,bold:true})}${text(230,106,'ReLU',{size:10,color:DIM})}${arrow(262,95,330,95,'output')}
      ${text(440,60,'layers: input → hidden → hidden → output',{size:11,color:DIM})}${text(440,85,'edges → shapes → objects',{size:11,color:LM})}${text(440,115,'all knowledge = the weights',{size:11,color:AM})}`,'An artificial neuron with weighted inputs and an activation')}];
  I.p9m3=[{cap:"Gradient descent: the loss is a landscape, the weights are your position, and each step goes downhill. Step size is the learning rate.",
    svg:svg(520,170,`<path d="M30 60 C120 20 180 150 260 140 C340 130 400 40 490 70" fill="none" stroke="${CY}" stroke-width="2"/>${[[60,52],[110,62],[160,100],[205,128],[250,139]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="5" fill="${i===4?LM:AM}"/>`).join('')}
      ${arrow(70,45,100,55,'')}${arrow(120,62,150,90,'')}${arrow(170,102,200,124,'')}${text(260,160,'loss ↓  (lowest valley = best weights)',{size:11,color:LM})}${text(430,110,'too big a step →\novershoots the valley',{size:10,color:MG})}`,'Gradient descent steps down a loss curve')}];
  I.p9m4=[{cap:"Attention: when processing 'it', the model weighs every other word at once and finds the one it refers to — in parallel, which is why transformers scale on GPUs.",
    svg:svg(560,120,`${['The','animal','didn\'t','cross','the','street','because','it','was','tired'].map((w,i)=>box(10+i*55,20,50,30,w,{size:10,stroke:i===7?MG:(i===1?LM:DIM),color:i===7?MG:(i===1?LM:'currentColor')})).join('')}
      <path d="M395 50 C300 95 150 95 60 50" fill="none" stroke="${LM}" stroke-width="2.2" marker-end="url(#ah)"/><path d="M395 50 C370 80 330 80 310 50" fill="none" stroke="${DIM}" stroke-width="1" stroke-dasharray="3 3"/>
      ${text(230,108,'"it" attends strongly to "animal" (thick) and weakly to "street" (dashed)',{size:11,color:DIM})}`,'Attention weights from the word it to other words')}];
  I.p9m5=[{cap:"How an LLM is made and used: pretraining on huge text, instruction fine-tuning, RLHF — then inference predicts one token at a time.",
    svg:flow([{t:'pretraining\n(internet-scale text)',stroke:CY},{t:'instruction\nfine-tuning',edge:'base model'},{t:'RLHF\n(human prefs)',stroke:AM,edge:''},{t:'inference:\nnext token ↺',stroke:MG,edge:'assistant'}],{bw:118,bh:56,gap:40,label:'LLM training pipeline and inference'})}];
  I.p9m6=[{cap:"The CUDA model: the host (CPU) copies data to the device (GPU) and launches a kernel that thousands of threads run at once, organized into blocks and a grid.",
    svg:svg(600,220,`${box(20,70,120,80,'HOST (CPU)\nyour program',{size:11})}${arrow(140,95,230,95,'copy data →')}${arrow(230,125,140,125,'← results')}
      ${box(230,20,350,185,'',{dash:true,stroke:MG})}${text(270,35,'DEVICE (GPU)',{anchor:'start',bold:true,color:MG})}${text(300,55,'grid of blocks',{anchor:'start',size:11,color:DIM})}
      ${[0,1,2].map(b=>box(250+b*108,65,100,70,'',{stroke:CY})+text(300+b*108,76,'block '+b,{size:10,color:CY})+Array.from({length:12},(_,t)=>`<rect x="${258+b*108+(t%6)*14}" y="${88+Math.floor(t/6)*16}" width="11" height="12" rx="2" fill="${t===0&&b===0?LM:'none'}" stroke="currentColor"/>`).join('')).join('')}
      ${text(400,150,'each thread: c[i] = a[i] + b[i]   (one element each)',{mono:true,size:10,color:LM})}${text(400,175,'kernel<<<blocks, threads>>>(a,b,c)  ·  warps of 32 run in lockstep',{mono:true,size:10,color:DIM})}
      ${text(400,196,'VRAM (global) ↔ shared memory ↔ registers',{size:10,color:AM})}`,'CUDA host, device, grid, blocks and threads')}];
  I.p9m7=[{cap:"Retrieval-augmented generation: embed your documents, find the chunks most similar to the question, and give them to the model so it answers from real text.",
    svg:flow([{t:'your docs',stroke:DIM},{t:'embeddings\n(vectors)',edge:'embed'},{t:'vector\nsearch',stroke:AM,edge:'question'},{t:'top chunks\n+ question',edge:'nearest'},{t:'LLM',stroke:CY,edge:'prompt'},{t:'grounded\nanswer + cites',stroke:LM,edge:''}],{bw:84,bh:52,gap:22,label:'RAG pipeline'})}];

  /* ================= DOMAIN 10: Wireless ================= */
  I.p10m1=[{cap:"Frequency vs reach: low frequencies (long waves) travel far and through walls; high frequencies (short waves) carry more data but fade fast.",
    svg:svg(560,170,`<path d="M20 50 ${Array.from({length:14},(_,i)=>`Q${40+i*40} ${i%2?90:10} ${60+i*40} 50`).join(' ')}" fill="none" stroke="${CY}" stroke-width="1.8"/>${text(300,105,'433 MHz / 2.4 GHz-ish: long wave → far, through walls, less data',{size:11,color:CY})}
      <path d="M20 135 ${Array.from({length:54},(_,i)=>`Q${25+i*10} ${i%2?155:115} ${30+i*10} 135`).join(' ')}" fill="none" stroke="${MG}" stroke-width="1.4"/>${text(300,162,'5–6 GHz: short wave → fast, short range, blocked by walls',{size:11,color:MG})}`,'Long and short wavelengths compared')}];
  I.p10m2=[{cap:"2.4 GHz channels overlap; only 1, 6 and 11 are clean. Neighbors on 3 and 9 interfere with everyone. 5 GHz has many more non-overlapping channels.",
    svg:svg(560,150,`${line(30,110,540,110)}${[1,2,3,4,5,6,7,8,9,10,11].map(c=>text(30+(c-1)*48,128,String(c),{size:11,color:[1,6,11].includes(c)?LM:DIM})).join('')}
      ${[1,6,11].map(c=>`<path d="M${30+(c-1)*48-45} 110 Q${30+(c-1)*48} 20 ${30+(c-1)*48+45} 110" fill="${LM}" fill-opacity="0.18" stroke="${LM}"/>`).join('')}
      ${[3,9].map(c=>`<path d="M${30+(c-1)*48-45} 110 Q${30+(c-1)*48} 40 ${30+(c-1)*48+45} 110" fill="none" stroke="${MG}" stroke-dasharray="4 3"/>`).join('')}${text(300,145,'green: non-overlapping (1/6/11) · dashed: overlaps and interferes',{size:10,color:DIM})}`,'2.4 GHz Wi-Fi channel overlap')}];
  I.p10m3=[{cap:"The BLE stack: GAP finds and connects devices; GATT organizes data into services and characteristics, like a heart-rate service exposing a number.",
    svg:stack([{t:'Application: your app reads "heart rate = 72"',stroke:LM},{t:'GATT: services → characteristics (the data)',stroke:CY},{t:'GAP: advertising, discovery, connecting',stroke:AM},{t:'Link layer: 2.4 GHz, 40 channels, frequency hopping'},{t:'Radio',stroke:DIM}],{w:400,label:'Bluetooth Low Energy stack'})}];
  I.p10m4=[{cap:"A Raspberry Pi 5 from above: the 40-pin GPIO header along one edge, the processor and RAM in the middle, and the ports you already know.",
    svg:svg(520,260,`${box(40,30,440,200,'',{fill:'#0f2a1f',stroke:LM,rx:10})}
      ${Array.from({length:20},(_,i)=>`<circle cx="${70+i*20}" cy="48" r="4" fill="${AM}"/><circle cx="${70+i*20}" cy="62" r="4" fill="${AM}"/>`).join('')}${text(260,80,'40-pin GPIO header: 3.3V · 5V · GND · digital I/O · I2C · SPI · UART',{size:10,color:AM})}
      ${box(150,100,90,70,'SoC\n(Arm CPU)',{size:11,fill:'#0b1322',stroke:CY})}${box(260,100,70,70,'RAM\n4/8/16 GB',{size:10,fill:'#0b1322'})}${box(350,105,60,35,'Wi-Fi /\nBT',{size:9,fill:'#0b1322'})}
      ${box(48,100,36,28,'USB-C\npower',{size:8})}${box(48,140,36,28,'micro\nHDMI×2',{size:8})}${box(430,100,40,28,'USB 3',{size:9})}${box(430,140,40,28,'USB 2',{size:9})}${box(430,180,40,28,'Ethernet',{size:8})}
      ${box(150,185,120,28,'PCIe (NVMe HAT)',{size:9,stroke:MG})}${box(290,185,100,28,'microSD (under)',{size:9})}${text(260,248,'runs full Linux · every Domain 3 skill applies',{size:11,color:DIM})}`,'Raspberry Pi 5 board layout')}];
  I.p10m5=[{cap:"An RF multitool like the Flipper Zero bundles several radios and interfaces in one handheld. Each is for reading, saving and replaying signals from devices you own.",
    svg:svg(560,230,`${box(40,30,180,170,'',{fill:'#1f1a0b',stroke:AM,rx:14})}${box(60,45,140,70,'screen',{size:11,fill:'#0b1322',stroke:DIM})}<circle cx="130" cy="155" r="22" fill="none" stroke="currentColor"/>${text(130,155,'◎',{size:16})}${text(190,185,'GPIO →',{size:9,color:DIM})}
      ${[['Sub-1 GHz radio (CC1101)','garage & car-key frequencies: 315/433/868/915 MHz'],['125 kHz RFID','older access badges'],['13.56 MHz NFC','cards, tags, phones'],['Infrared','TV / AC remotes'],['iButton / 1-Wire','touch-key fobs'],['Bluetooth LE + USB (BadUSB)','apps, keyboard emulation'],['GPIO pins','sensors, electronics']].map(([n,d],i)=>text(250,40+i*26,n,{anchor:'start',size:11,color:CY,bold:true})+text(250,52+i*26,d,{anchor:'start',size:10,color:DIM})).join('')}
      ${text(300,222,'cannot defeat modern rolling-code or encrypted systems · transmitting is regulated',{size:10,color:MG})}`,'Handheld RF multitool and its radios')}];

  I.p10m6=[{cap:"Anatomy of a cyberdeck: a single-board computer, display, keyboard and battery, with radios and ports chosen for the job, all inside an enclosure you design. The power budget decides how long it runs.",
    svg:svg(560,250,`${box(20,20,520,210,'',{fill:'#0b1322',stroke:AM,rx:16})}${text(280,38,'ENCLOSURE  (hard case · 3D print · repurposed)',{size:10,color:AM,bold:true})}
      ${box(50,55,230,95,'7-inch display',{size:12,stroke:CY})}${box(300,55,200,40,'Raspberry Pi 5',{size:12,stroke:LM})}${text(400,110,'USB · Ethernet · GPIO · NVMe',{size:9,color:DIM})}${box(300,120,200,30,'cooler / fan  (thermals!)',{size:10,stroke:MG})}
      ${box(50,165,230,45,'mechanical keyboard',{size:12,stroke:CY})}${box(300,165,95,45,'battery\n74 Wh',{size:10,stroke:AM})}${box(405,165,95,45,'radios: Wi-Fi\nLoRa · SDR',{size:9,stroke:MG})}
      ${text(280,245,'power budget: Pi 5 ~8 W + screen ~3 W + radios ~2 W ≈ 13 W → 74 Wh ÷ 13 W ≈ 5½ h',{size:10,color:DIM})}`,'Exploded view of a cyberdeck and its power budget')},
   {cap:"Purpose comes first. The job you pick decides the board, screen, power and radios — the same chassis idea becomes three very different machines.",
    svg:svg(560,200,`${[['Field network kit',MG,['Pi 5 + Kali','Ethernet + monitor-mode Wi-Fi','long battery · rugged case','authorized tests only']],['SDR / RF station',CY,['Pi 5 or x86 mini PC','RTL-SDR / HackRF','antenna connectors','receive freely · TX licensed']],['Off-grid writer',LM,['Pi Zero 2 W','e-ink screen','great keyboard · solar','LoRa / Meshtastic']]].map(([t,c,ls],i)=>box(15+i*180,15,170,170,'',{dash:true,stroke:c})+text(100+i*180,36,t,{bold:true,color:c,size:12})+ls.map((l,j)=>text(100+i*180,66+j*30,l,{size:10})).join('')).join('')}`,'Three cyberdecks, three purposes')}];

  /* ================= DOMAIN 11: Reverse Engineering ================= */
  I.p11m1=[{cap:"The reverse-engineering workflow: triage, static analysis, dynamic analysis, document — always inside the legal line and, for malware, inside an isolated VM.",
    svg:flow([{t:'legal check:\nmay I analyze?',stroke:AM},{t:'triage\nfile · strings',edge:'yes'},{t:'static\n(Ghidra)',stroke:CY},{t:'dynamic\n(debugger, VM)',stroke:MG},{t:'document\n& report',stroke:LM}],{bw:96,bh:56,gap:28,label:'Reverse engineering workflow'})}];
  I.p11m2=[{cap:"Registers are the CPU's work trays; the stack grows as functions call each other, holding locals and the return address.",
    svg:svg(560,180,`${text(110,20,'REGISTERS',{bold:true,color:CY})}${['RAX','RBX','RCX','RDX','RSP','RBP','RIP'].map((r,i)=>box(30+(i%4)*42,30+Math.floor(i/4)*36,38,28,r,{mono:true,size:10,stroke:r==='RSP'||r==='RBP'?AM:(r==='RIP'?MG:'currentColor')})).join('')}${text(110,120,'RSP/RBP = stack pointers · RIP = next instruction',{size:10,color:DIM})}
      ${text(400,20,'STACK (grows down)',{bold:true,color:AM})}${['main() locals','return address','old RBP','helper() locals'].map((t,i)=>box(300,30+i*30,200,26,t,{size:11,mono:true,stroke:i>=2?AM:'currentColor'})).join('')}${text(400,165,'prologue pushes · epilogue pops',{size:10,color:DIM})}`,'CPU registers and a call stack')}];
  I.p11m3=[{cap:"A control-flow graph: blocks of straight-line code connected by the branches between them. Cross-references show who calls what.",
    svg:svg(520,210,`${box(200,15,120,34,'entry: read input',{size:11})}${arrow(260,49,260,70,'')}<polygon points="200,100 260,70 320,100 260,130" fill="none" stroke="${AM}"/>${text(260,100,'len == 8?',{size:11})}
      ${arrow(200,100,120,140,'no')}${box(60,140,120,34,'print "wrong"',{size:11,stroke:MG})}${arrow(320,100,400,140,'yes')}${box(340,140,120,34,'compare bytes',{size:11,stroke:CY})}${arrow(400,174,400,195,'')}${text(400,202,'→ "correct"',{size:11,color:LM})}
      ${text(120,195,'xref: "wrong" string used here',{size:10,color:DIM})}`,'Control-flow graph of a password check')}];
  I.p11m4=[{cap:"Dynamic analysis: run the program under a debugger, pause at breakpoints, step, and watch registers, memory and behavior — inside an isolated VM.",
    svg:flow([{t:'breakpoint\nset',stroke:AM},{t:'run until\nhit'},{t:'inspect\nregisters/mem',stroke:CY},{t:'step\n1 instruction'},{t:'observe\nfiles · net',stroke:MG}],{bw:92,bh:52,gap:28,label:'Debugging loop'})}];
  I.p11m5=[{cap:"Inside an executable: a header pointing to sections — code, data, imports — and the entry point. Packers hide the real code until runtime.",
    svg:compare({t:'normal PE / ELF',draw:x=>['header (entry, sections)','.text (code)','.data (globals)','imports (DLLs/libs)'].map((t,i)=>box(x+40,40+i*28,180,22,t,{size:10,stroke:CY})).join('')},{t:'packed',draw:x=>['header','tiny unpacker stub','compressed / encrypted blob','(real code appears at runtime)'].map((t,i)=>box(x+40,40+i*28,180,22,t,{size:10,stroke:i>=1?MG:CY,dash:i===2})).join('')},{h:165,label:'Normal executable layout versus packed'})}];
  I.p11m6=[{cap:"The malware lab: an isolated VM with snapshots and no real network, and the four analysis stages that produce indicators defenders can use.",
    svg:svg(560,200,`${box(20,20,220,160,'',{dash:true,stroke:MG})}${text(60,35,'isolated VM (FLARE-VM / REMnux)',{anchor:'start',size:10,color:MG})}${box(40,55,180,34,'snapshot taken ✓',{size:11,stroke:LM})}${box(40,100,180,34,'sample runs here only',{size:11})}${box(40,140,180,30,'host-only / no network',{size:10,stroke:MG})}
      ${['1 basic static','2 basic dynamic','3 advanced static','4 advanced dynamic'].map((t,i)=>box(270,25+i*38,130,30,t,{size:11,stroke:i%2?AM:CY})+arrow(400,40+i*38,440,40+i*38,'')).join('')}${box(440,60,110,70,'IOCs:\nhashes · domains\nfile paths',{size:10,stroke:LM})}`,'Malware analysis lab and stages')}];
  I.p11m7=[{cap:"The professional toolchain, and where AI assistants fit: on top of fundamentals, as accelerators you supervise.",
    svg:stack([{t:'AI assistants (ReVa, r2ai, REA): speed up, never trust blindly',stroke:MG},{t:'automation: Python scripts over many files',stroke:AM},{t:'instrumentation: Frida · debuggers: x64dbg, GDB+pwndbg',stroke:CY},{t:'suites: Ghidra · IDA Pro · Binary Ninja · rizin/Cutter'},{t:'fundamentals: assembly · formats · calling conventions',stroke:LM}],{w:460,label:'Reverse engineering toolchain layers'})}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
