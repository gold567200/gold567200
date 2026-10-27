/* Illustrations — Domain 53: Trusted Computing & Hardware Security Engineering, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  /* ================= DOMAIN 53: Trusted Computing ================= */
  // ---------- Module 1 ----------
  const chain=[['IP & design tools','malicious logic','design review'],['foundry','Trojan, overbuild','trusted foundry'],['assembly & test','counterfeit parts','authorized supply'],['board assembly','part swap, implant','inspection, X-ray'],['firmware (IBV/OEM)','shared vuln code','SBOM + signing'],['key provisioning','leaked/test keys','HSM ceremony'],['logistics, resale','interdiction','tamper seals'],['repair, refurbish','reflashed firmware','attest on return']];
  I.p53m1=[{cap:"The machine below the operating system. Each lower layer sees more and is fixed more slowly; a boot ROM bug is permanent, which is why trust must start in the smallest, most reviewed layer.",
    svg:stack([{t:'Applications · ring 3',side:'fix: hours to days'},{t:'Kernel and drivers · ring 0',side:'fix: days to weeks'},{t:'Hypervisor · ring −1',side:'fix: weeks'},{t:'UEFI firmware · SMM · "ring −2"',side:'fix: months, or never',stroke:AM},{t:'Security processor · "ring −3"',side:'fix: vendor via OEM',stroke:MG},{t:'Boot ROM · fuses · logic',side:'fix: new silicon only',stroke:CY,bold:true}],{w:330,side:true,label:'Layers below the operating system and how fast each is fixed'})},
   {cap:"Trust boundaries you can point to on a PC board. Every crossing — the TPM bus, the memory bus, SPI flash, DMA from devices and the debug header — needs a control (amber) and a test.",
    svg:svg(560,270,`${text(280,16,'TRUST BOUNDARIES ON A PC BOARD',{bold:true,color:CY,size:11})}
      ${box(200,60,170,100,'',{dash:true,stroke:CY})}${text(285,72,'CPU package',{size:10,color:CY})}${box(210,84,70,60,'cores',{size:10})}${box(290,84,70,60,'security\nprocessor',{size:9,stroke:MG})}
      ${box(20,70,110,50,'discrete TPM',{size:10})}${line(130,95,200,95,{sw:2})}${text(75,138,'LPC/SPI bus: fTPM,\nPIN, encrypted sessions',{size:9,color:AM})}
      ${box(430,70,110,50,'DRAM',{size:11})}${line(370,95,430,95,{sw:2})}${text(485,138,'memory bus:\nmemory encryption',{size:9,color:AM})}
      ${box(20,180,110,44,'SPI flash\n(UEFI image)',{size:10})}${line(130,200,215,160,{sw:2})}${text(75,240,'write-protect +\nBoot Guard / PSB',{size:9,color:AM})}
      ${box(220,190,120,44,'PCIe / Thunderbolt\ndevice (DMA)',{size:9})}${line(280,190,280,160,{sw:2})}${text(280,250,'IOMMU on before the OS',{size:9,color:AM})}
      ${box(430,180,110,44,'JTAG / UART\ndebug header',{size:9})}${line(430,200,360,160,{sw:2})}${text(485,240,'fuse-locked or\nauthenticated debug',{size:9,color:AM})}`,'Physical trust boundaries on a PC motherboard and their controls')},
   {cap:"The hardware supply chain as attack surface: every stage has a characteristic threat (magenta) and a control that answers it (lime).",
    svg:svg(560,215,chain.map((c,i)=>{ const r=Math.floor(i/4), k=i%4; const x=14+k*136, y=20+r*100;
        return box(x,y,118,40,c[0],{size:10,stroke:i===5?CY:'currentColor'})+text(x+59,y+56,c[1],{size:9,color:MG})+text(x+59,y+70,c[2],{size:9,color:LM})+(k<3?arrow(x+119,y+20,x+135,y+20,''):''); }).join('')+
      `<path d="M541 40 L551 40 L551 108 L73 108 L73 118" fill="none" stroke="currentColor" stroke-width="1.3" stroke-dasharray="3 3" marker-end="url(#ah)"/>`+text(14,206,'magenta: threat · lime: control',{anchor:'start',size:9,color:DIM}),'Supply-chain stages with their threats and controls')},
   {cap:"Attack potential as arithmetic. The field laptop with TPM-only BitLocker falls to an 8-point path (Basic: almost anyone); adding a pre-boot PIN pushes the cheapest path to 27 points, Beyond High.",
    svg:svg(560,170,`${text(280,16,'ATTACK POTENTIAL (points)',{bold:true,color:CY,size:11})}
      ${box(40,36,128,30,'TPM only: 8',{stroke:MG,size:10})}${box(40,80,432,30,'TPM + PIN: 27 points',{stroke:LM,size:10})}
      ${[10,14,20,25].map(v=>line(40+v*16,114,40+v*16,132,{stroke:DIM,sw:1.5})).join('')}
      ${line(40,124,520,124)}${text(120,140,'Basic',{size:9,color:DIM})}${text(232,140,'Enh.',{size:9,color:DIM})}${text(312,140,'Moderate',{size:9,color:DIM})}${text(400,140,'High',{size:9,color:DIM})}${text(480,140,'Beyond',{size:9,color:DIM})}
      ${text(280,160,'0–9 · 10–13 · 14–19 · 20–24 · 25+',{size:9,color:DIM})}`,'Attack-potential scores for two paths against a field laptop')}];

  // ---------- Module 2 ----------
  I.p53m2=[{cap:"The chain of trust: each stage verifies the next before running it, starting from immutable boot ROM and a key hash in fuses. A broken first link breaks everything after it.",
    svg:flow([{t:'boot ROM +\nfused key hash',stroke:CY},{t:'firmware\n(Boot Guard / PSB)'},{t:'UEFI\nSecure Boot'},{t:'shim or Windows\nboot manager'},{t:'bootloader'},{t:'kernel + initrd',stroke:LM}],{perRow:3,bw:140,bh:50,gap:50,edges:['verify','verify','db/dbx','verify','verify'],label:'Chain of trust from boot ROM to kernel'})},
   {cap:"Verified boot enforces; measured boot records. Secure Boot refuses unsigned code but passes anything still validly signed; measured boot proves exactly what ran, but only helps if someone checks.",
    svg:compare({t:'SECURE BOOT (verify)',draw:x=>['checks a signature','refuses to run on failure','answers: is this allowed?','weak spot: old signed code'].map((l,i)=>text(x+130,54+i*28,l,{size:10,color:i===3?MG:'currentColor'})).join('')},{t:'MEASURED BOOT (record)',draw:x=>['hashes into PCRs + event log','always continues','answers: what exactly ran?','weak spot: only if checked'].map((l,i)=>text(x+130,54+i*28,l,{size:10,color:i===3?MG:'currentColor'})).join('')},{h:170,label:'Secure Boot versus measured boot'})},
   {cap:"UEFI Secure Boot's key databases and the 2026 Microsoft certificate rollover. Machines lacking the 2023 certificates keep booting but stop receiving new boot-level protections and revocations.",
    svg:svg(560,240,`${box(220,12,120,32,'PK (platform key)',{stroke:CY,size:10})}${text(350,28,'one per machine (OEM/owner)',{anchor:'start',size:9,color:DIM})}
      ${arrow(280,44,280,66,'')}${box(220,68,120,32,'KEK list',{size:10})}${text(350,84,'authorizes db/dbx updates',{anchor:'start',size:9,color:DIM})}
      ${arrow(255,100,185,126,'')}${arrow(305,100,375,126,'')}${box(110,128,150,32,'db (allowed)',{stroke:LM,size:10})}${box(300,128,150,32,'dbx (revoked, wins)',{stroke:MG,size:10})}
      ${box(10,180,175,52,'KEK CA 2011\nexpired 24 Jun 2026\n→ KEK 2K CA 2023',{size:9,stroke:AM})}${box(193,180,175,52,'UEFI CA 2011\nexpired 27 Jun 2026\n→ UEFI CA + Option ROM CA',{size:9,stroke:AM})}${box(376,180,175,52,'Windows Production PCA 2011\nexpired 19 Oct 2026\n→ Windows UEFI CA 2023',{size:9,stroke:AM})}`,'UEFI Secure Boot key hierarchy and the 2026 certificate expirations')},
   {cap:"A trustworthy firmware update: verify the signature, refuse anything below the fused security version (anti-rollback), write the inactive slot, and fall back automatically if the new image does not come up healthy.",
    svg:flow([{t:'signed capsule\narrives'},{t:'verify vendor\nsignature',stroke:CY},{t:'SVN ≥ fused\nminimum?',stroke:AM},{t:'write inactive\nslot B'},{t:'boot B under\nwatchdog'},{t:'healthy: commit\nfailed: slot A',stroke:LM}],{perRow:3,bw:140,bh:50,gap:50,label:'Signed, anti-rollback A/B firmware update'})}];

  // ---------- Module 3 ----------
  I.p53m3=[{cap:"Extend is the only way to change a PCR. Each value commits to every earlier measurement and their order, so a replay of the event log must reproduce it exactly.",
    svg:svg(560,180,`${text(280,20,'EXTEND: PCR ← H(PCR ‖ digest)',{bold:true,color:CY,size:12})}
      ${box(10,60,90,40,'PCR = 00…00',{mono:true,size:9})}${arrow(100,80,117,80,'')}
      ${box(118,50,150,60,'H(PCR ‖ d1)\nd1 = H(firmware)',{size:10})}${arrow(268,80,285,80,'')}
      ${box(286,50,150,60,'H(PCR ‖ d2)\nd2 = H(bootloader)',{size:10})}${arrow(436,80,453,80,'')}
      ${box(454,60,96,40,'final PCR',{stroke:CY,size:11})}
      ${text(280,138,'order matters · no "set" operation · reset only at power-on',{size:10,color:AM})}
      ${text(280,162,'replay: same digests, same order → same value',{size:10,color:DIM})}`,'How the TPM extend operation builds a PCR value')},
   {cap:"Four hierarchies, each with a seed that never leaves the TPM. Primary keys are re-derived from seeds; child keys live on disk wrapped by their parent; the EK proves the chip and the AK signs quotes.",
    svg:svg(560,215,[['platform','firmware','firmware keys'],['storage (owner)','SRK 0x81000001','your keys: wrapped\nblobs on disk'],['endorsement','EK + EK cert','AK, bound via\nActivateCredential'],['null','reset every boot','ephemeral keys']].map((c,i)=>{ const x=10+i*137;
      return box(x,16,127,40,c[0]+'\nseed',{size:10,stroke:i===2?MG:(i===1?CY:'currentColor'),bold:true})+line(x+63,56,x+63,82)+box(x,82,127,36,c[1],{size:9})+line(x+63,118,x+63,146)+box(x,146,127,44,c[2],{size:9,stroke:i===2?LM:DIM}); }).join('')+text(280,206,'seeds never leave the chip; keys are recreated or reloaded',{size:9,color:DIM}),'TPM 2.0 hierarchies, seeds and keys')},
   {cap:"Remote attestation in one picture: a fresh nonce, a quote signed by the attestation key, the event log and certificates, then the verifier's checks before any relying party acts.",
    svg:svg(560,250,`${box(50,10,120,30,'VERIFIER',{stroke:CY,bold:true,size:11})}${box(390,10,120,30,'ATTESTER + TPM',{stroke:MG,bold:true,size:10})}
      ${line(110,40,110,160,{dash:true,stroke:DIM})}${line(450,40,450,160,{dash:true,stroke:DIM})}
      ${arrow(110,62,448,62,'1  fresh nonce')}${arrow(450,102,112,102,'2  quote: AK signs PCRs + nonce')}${arrow(450,140,112,140,'3  event log + EK/AK certs')}
      ${box(10,166,270,76,'4  checks: EK cert chain · AK bound to EK\nsignature valid · nonce fresh\nlog replay = quoted PCR digest\nevents = reference values',{size:9,stroke:AM})}
      ${arrow(280,204,298,204,'')}${box(300,180,250,48,'5  result → relying party\n(network access, key release)',{stroke:LM,size:10})}`,'Remote attestation message flow and verifier checks')},
   {cap:"Sealing: the TPM releases the secret only when the current PCR values satisfy the object's policy. Change a measured component and the unseal fails, so the system falls back to the recovery key.",
    svg:compare({t:'PCRs MATCH → UNSEAL',draw:x=>box(x+20,40,220,34,'sealed blob · policy: PCR 7 = A',{size:10})+box(x+20,84,220,30,'PCR 7 now = A',{size:10,stroke:LM})+arrow(x+130,114,x+130,130,'')+box(x+20,132,220,30,'key released',{size:10,stroke:LM})},{t:'PCR CHANGED → FAIL',draw:x=>box(x+20,40,220,34,'sealed blob · policy: PCR 7 = A',{size:10})+box(x+20,84,220,30,'PCR 7 now = B',{size:10,stroke:MG})+arrow(x+130,114,x+130,130,'')+box(x+20,132,220,30,'TPM_RC_POLICY_FAIL → recovery',{size:9,stroke:MG})},{h:175,label:'Unseal succeeds when PCRs match and fails when they change'})}];

  // ---------- Module 4 ----------
  const iso=[['SGX enclave',['enclave code','OS (untrusted)','hypervisor (untr.)','CPU + microcode'],[1,0,0,1]],['TrustZone',['normal-world apps','normal-world OS','secure-world OS','monitor + CPU'],[0,0,1,1]],['Confidential VM',['guest apps','guest OS','hypervisor (untr.)','CPU + sec. firmware'],[1,1,0,1]],['Coprocessor',['main apps','main OS','enclave OS (sepOS)','own core + ROM'],[0,0,1,1]]];
  I.p53m4=[{cap:"Four isolation models compared by what you must trust (solid lime) and what is kept out (dashed). Confidential VMs trust the whole guest but not the hypervisor; enclaves trust only their own code and the CPU.",
    svg:svg(560,228,iso.map((c,i)=>{ const x=10+i*137; return text(x+63,24,c[0],{bold:true,size:10,color:CY})+c[1].map((l,j)=>box(x,38+j*40,127,32,l,{size:9,stroke:c[2][j]?LM:DIM,dash:!c[2][j]})).join(''); }).join('')+text(280,214,'solid lime = inside the trusted base · dashed = kept out',{size:9,color:DIM}),'Trusted computing base of four isolation models')},
   {cap:"A confidential VM: per-VM keys held by the security processor or TDX module, encryption and integrity in the memory path, and a host that sees only ciphertext. Physical bus access is outside the promise.",
    svg:svg(560,240,`${box(20,16,520,40,'host OS + hypervisor — UNTRUSTED (sees ciphertext only)',{dash:true,stroke:MG,size:10})}
      ${box(40,76,220,60,'confidential VM A\nkey A · encrypted pages',{stroke:CY,size:10})}${box(300,76,220,60,'confidential VM B\nkey B · encrypted pages',{stroke:CY,size:10})}
      ${arrow(150,136,150,156,'')}${arrow(410,136,410,156,'')}
      ${box(40,158,220,44,'security processor / TDX module\nholds VM keys · signs reports',{stroke:LM,size:9})}${box(300,158,220,44,'memory-controller AES engine\n+ RMP / secure EPT (integrity)',{stroke:LM,size:9})}
      ${text(280,224,'DRAM holds only ciphertext; physical bus access is out of scope',{size:9,color:AM})}`,'Confidential VM architecture')},
   {cap:"Attestation and secure key release for a confidential VM: the guest binds a fresh public key into the signed report, the verifier checks chain, TCB, policy and measurement, and only then is the secret wrapped to that key.",
    svg:flow([{t:'guest creates\nkey pair'},{t:'report: measurement,\nreport data, TCB',stroke:CY},{t:'signed by VCEK\n(chip + TCB key)'},{t:'verifier: chain,\nTCB, policy, hash',stroke:AM},{t:'KMS wraps key\nto guest pubkey',stroke:LM},{t:'guest unwraps\nand runs'}],{perRow:3,bw:150,bh:54,gap:40,label:'Confidential VM attestation and secure key release'})},
   {cap:"What a TEE protects and what it does not. Writing the right-hand column into every design review is what keeps confidential computing honest.",
    svg:compare({t:'PROTECTED',draw:x=>['guest memory vs host software','registers on every VM exit','page integrity (SNP, TDX)','DMA from devices (IOMMU)'].map((l,i)=>text(x+130,54+i*28,l,{size:10,color:LM})).join('')},{t:'NOT PROTECTED',draw:x=>['bugs in your guest','availability (host can stop it)','side channels, unencrypted I/O','physical bus attacks','rollback of stored state'].map((l,i)=>text(x+130,52+i*26,l,{size:10,color:MG})).join('')},{h:190,label:'What trusted execution environments protect and do not protect'})}];

  // ---------- Module 5 ----------
  const mit=[['KPTI',[1,0,0,0]],['IBRS / IBPB / STIBP',[1,1,1,1]],['VERW buffer clearing',[1,0,1,0]],['L1D flush on VM entry',[0,0,1,0]],['core scheduling / SMT off',[0,0,0,1]],['constant-time code',[1,1,1,1]]];
  const cols=['user↔kernel','proc↔proc','VM↔VM','SMT sibling'];
  I.p53m5=[{cap:"Where the sharing is. SMT siblings share a core's caches, predictors and buffers; all cores share the last-level cache and memory controller. Timing differences in shared state are what a side channel reads.",
    svg:svg(560,232,`${box(20,26,250,138,'',{dash:true,stroke:DIM})}${text(145,38,'CORE 0',{bold:true,size:10,color:DIM})}
      ${box(35,50,105,34,'thread A\n(your app)',{stroke:CY,size:9})}${box(150,50,105,34,'thread B\n(SMT sibling)',{stroke:MG,size:9})}
      ${box(35,94,220,24,'shared: L1/L2, predictors, buffers',{size:9,stroke:AM})}${text(145,136,'core scheduling: only\nmutually trusted tasks here',{size:9,color:LM})}
      ${box(290,26,250,138,'',{dash:true,stroke:DIM})}${text(415,38,'CORE 1',{bold:true,size:10,color:DIM})}
      ${box(305,50,105,34,'thread C',{size:9})}${box(420,50,105,34,'thread D',{size:9})}${box(305,94,220,24,'shared: L1/L2, predictors, buffers',{size:9,stroke:AM})}
      ${box(20,176,520,30,'shared by all cores: last-level cache · memory controller · DRAM',{stroke:AM,size:10})}
      ${text(280,222,'timing differences in shared state = a side channel',{size:10,color:DIM})}`,'Shared microarchitectural resources on a two-core SMT processor')},
   {cap:"The mitigation landscape as a matrix: which boundary each move protects. Only constant-time code protects your secret whoever the observer is; everything else guards one kind of crossing.",
    svg:svg(560,250,`${text(10,24,'mitigation',{anchor:'start',size:10,bold:true,color:CY})}${cols.map((c,j)=>text(260+j*80,24,c,{size:9,bold:true,color:CY})).join('')}
      ${mit.map((m,i)=>{ const y=52+i*32; return line(10,y-16,550,y-16,{stroke:DIM,sw:0.6})+text(10,y,m[0],{anchor:'start',size:10})+m[1].map((v,j)=>v?`<circle cx="${260+j*80}" cy="${y}" r="6" fill="${LM}"/>`:text(260+j*80,y,'–',{size:12,color:DIM})).join(''); }).join('')}
      ${text(280,240,'plus microcode and new silicon, which underpin all of them',{size:9,color:DIM})}`,'Which boundary each microarchitectural mitigation protects')},
   {cap:"Why early exit leaks. memcmp stops at the first differing byte, so its time grows with the length of the matching prefix; the XOR-accumulate version touches every byte and its timing stays flat.",
    svg:compare({t:'memcmp (early exit)',draw:x=>[['prefix 0',56],['prefix 8',104],['prefix 16',152],['prefix 31',200]].map((b,i)=>box(x+30,46+i*28,b[1],20,'',{stroke:MG})+text(x+34,56+i*28,b[0],{anchor:'start',size:9})).join('')+text(x+130,170,'time reveals matching bytes',{size:10,color:MG})},{t:'ct_equal (constant time)',draw:x=>[['prefix 0'],['prefix 8'],['prefix 16'],['prefix 31']].map((b,i)=>box(x+30,46+i*28,200,20,'',{stroke:LM})+text(x+34,56+i*28,b[0],{anchor:'start',size:9})).join('')+text(x+130,170,'Welch t stays below 4.5',{size:10,color:LM})},{h:190,label:'Timing of early-exit versus constant-time comparison'})},
   {cap:"The cost of mitigations is arithmetic. Disabling SMT on a 48-core host that gains 1.25× from SMT gives up 12 core-equivalents; a kernel-entry mitigation of 150 ns at 200,000 syscalls per second costs 3% of a core.",
    svg:svg(560,170,`${text(280,16,'MEASURE THE COST, THEN DECIDE',{bold:true,color:CY,size:11})}
      ${box(20,32,480,30,'SMT on: 48 × 1.25 = 60 core-equivalents',{stroke:LM,size:10})}${box(20,72,384,30,'SMT off: 48 (−20%)',{stroke:MG,size:10})}
      ${text(280,124,'syscalls: 200,000/s × 150 ns = 30 ms/s = 3% of a core',{size:10,color:AM})}
      ${text(280,148,'core scheduling keeps most of the SMT gain for whole-core tenants',{size:10,color:DIM})}`,'Mitigation cost arithmetic')}];

  // ---------- Module 6 ----------
  const phys=[['NON-INVASIVE','observe: timing,\npower, EM','masking, hiding,\nconstant time'],['SEMI-INVASIVE','fault injection:\nglitch, EM, laser','sensors, redundancy,\nglitch detectors'],['INVASIVE','open the package:\nprobe, FIB edit','shields, meshes,\nzeroization']];
  I.p53m6=[{cap:"Three classes of physical attack, ordered by how much they disturb the chip, each answered by an engineering countermeasure (lime). Cost, time and expertise rise from left to right.",
    svg:svg(560,200,`${arrow(30,20,530,20,'cost, time and expertise rise')}
      ${phys.map((c,i)=>{ const x=10+i*183; return box(x,40,173,70,c[0]+'\n'+c[1],{size:10,stroke:i===0?CY:(i===1?AM:MG)})+arrow(x+86,110,x+86,128,'')+box(x,130,173,50,c[2],{size:10,stroke:LM}); }).join('')}`,'Physical attack classes and their countermeasures')},
   {cap:"FIPS 140-3's four security levels, each adding physical and authentication requirements to the one below. Most HSMs are validated at Level 3; software libraries at Level 1.",
    svg:stack([{t:'Level 4: envelope + environmental protection',side:'hostile locations',stroke:CY},{t:'Level 3: tamper detect/respond, identity auth',side:'most HSMs',stroke:LM},{t:'Level 2: tamper evidence, role-based auth',side:'tokens, some SEDs'},{t:'Level 1: production parts, no physical req.',side:'software libraries',stroke:DIM}],{w:360,side:true,label:'FIPS 140-3 security levels'})},
   {cap:"How a Common Criteria certificate comes to exist, and what you do with it: read the Security Target, compare the evaluated configuration with yours, and check the AVA_VAN level.",
    svg:flow([{t:'Protection Profile\n(product class)'},{t:'Security Target\n(this product, TOE)',stroke:CY},{t:'lab evaluation\n(ITSEF / CCTL)'},{t:'certification body\n(BSI, ANSSI, NIAP)'},{t:'certificate +\npublic report',stroke:LM},{t:'you: read ST,\nconfig, AVA_VAN',stroke:AM}],{perRow:3,bw:150,bh:54,gap:40,label:'Common Criteria evaluation flow'})},
   {cap:"Attack-potential bands and assurance claims. A product claiming AVA_VAN.5 must defeat every path scoring 24 or less, so the 21-point glitch path is in scope; the 8-point laptop path is one that even a Basic (AVA_VAN.2) claim must withstand.",
    svg:svg(560,170,`${text(280,16,'ATTACK POTENTIAL BANDS',{bold:true,color:CY,size:11})}
      ${box(30,36,160,36,'Basic 0–9',{size:9,stroke:DIM})}${box(190,36,64,36,'Enh. 10–13',{size:9,stroke:DIM})}${box(254,36,96,36,'Mod. 14–19',{size:9,stroke:DIM})}${box(350,36,80,36,'High 20–24',{size:9,stroke:AM})}${box(430,36,96,36,'Beyond 25+',{size:9,stroke:LM})}
      ${arrow(158,100,158,76,'')}${text(158,110,'TPM-only laptop: 8',{size:9,color:MG})}${arrow(366,100,366,76,'')}${text(366,110,'glitch path: 21',{size:9,color:AM})}
      ${text(280,148,'AVA_VAN.5 must defeat every path scoring 24 or less',{size:10,color:LM})}`,'Attack-potential bands with two example paths')}];

  // ---------- Module 7 ----------
  const rings=[['ring 1% · 40 devices',0.18],['ring 10% · 400 devices',0.865],['all · 4,000 devices',1.0]];
  const kpi=[['Secure Boot on',0.983],['Disk encrypted',0.993],['Recovery key escrowed',0.993],['Windows UEFI CA 2023',0.92]];
  I.p53m7=[{cap:"Why firmware SBOMs matter: one UEFI image is assembled from many suppliers' modules, so one bug in a shared component (an image parser, as in LogoFAIL) lands in many OEMs' products at once.",
    svg:svg(560,220,`${box(10,20,330,180,'',{dash:true,stroke:DIM})}${text(175,34,'UEFI IMAGE (one OEM model)',{bold:true,size:10,color:CY})}
      ${box(22,48,150,60,'IBV core\n(AMI/Insyde/Phoenix)',{size:10})}${box(180,48,150,60,'silicon code\n(FSP / AGESA)',{size:10})}
      ${box(22,120,150,60,'OEM drivers\nand setup',{size:10})}${box(180,120,150,60,'open source: EDK II,\nOpenSSL, image parsers',{size:9,stroke:MG})}
      ${['OEM A','OEM B','OEM C'].map((t,i)=>arrow(330,150,418,60+i*55,'')+box(420,40+i*55,120,40,t+' affected',{size:10,stroke:MG})).join('')}
      ${text(450,208,'one bug, many products',{size:9,color:MG})}`,'Composition of a UEFI firmware image and how a shared bug spreads')},
   {cap:"An update pipeline that deserves trust: provenance from the build, keys in an HSM behind quorum, TUF metadata against rollback and freeze, device-side checks, A/B slots, staged rings and a recovery image.",
    svg:flow([{t:'reproducible\nbuild'},{t:'provenance\n(in-toto)'},{t:'sign in HSM\n(M-of-N)',stroke:CY},{t:'TUF metadata\n+ mirrors'},{t:'device checks\nsig + SVN',stroke:AM},{t:'A/B slot +\nwatchdog'},{t:'rings: 1% →\n10% → 100%',stroke:LM},{t:'recovery:\ngolden image'}],{perRow:4,bw:110,bh:50,gap:30,label:'Trustworthy firmware update pipeline'})},
   {cap:"Ring arithmetic for a 4,000-device fleet and a hidden 0.5% failure rate: P(at least one failure) = 1 − 0.995ⁿ. A 40-device first ring catches it only 18% of the time; the 400-device ring is the real gate.",
    svg:svg(560,180,`${text(280,16,'P(≥1 failure seen) = 1 − 0.995ⁿ',{bold:true,color:CY,size:11})}
      ${rings.map((r,i)=>{ const y=42+i*42; return text(10,y+12,r[0],{anchor:'start',size:10})+box(170,y,Math.round(320*r[1]),24,'',{stroke:i===0?MG:(i===1?AM:LM)})+text(170+Math.round(320*r[1])+8,y+12,Math.round(r[1]*100)+'%',{anchor:'start',size:10,bold:true}); }).join('')}
      ${text(280,172,'halt the rollout on the first unexplained failure',{size:10,color:DIM})}`,'Probability that a staged rollout ring detects a rare failure')},
   {cap:"Fleet posture as a measured state, using the example week's numbers: each bar is reproducible from the collection script, and anything under target (amber) becomes a ticket with an owner.",
    svg:svg(560,190,`${text(280,16,'FLEET POSTURE — 412 LAPTOPS',{bold:true,color:CY,size:11})}
      ${kpi.map((k,i)=>{ const y=36+i*36; const c=k[1]<0.95?AM:LM; return text(10,y+12,k[0],{anchor:'start',size:10})+box(190,y,300,24,'',{stroke:DIM,dash:true})+box(190,y,Math.round(300*k[1]),24,'',{stroke:c,sw:2})+text(498,y+12,(k[1]*100).toFixed(1)+'%',{anchor:'start',size:10,bold:true,color:c}); }).join('')}
      ${text(280,182,'every red or amber item: owner, due date, expiring exception',{size:9,color:DIM})}`,'Fleet security posture indicators')}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
