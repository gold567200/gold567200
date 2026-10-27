/* Illustrations — Domain 16: Windows, Windows Server & Active Directory Administration, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  /* ================= DOMAIN 16: Windows, Windows Server & Active Directory ================= */
  I.p16m1=[{cap:"Two modes, one kernel. Everything above the dashed line runs in user mode (ring 3) and reaches the kernel only through ntdll.dll's syscall; below it, the executive, the kernel proper and every driver share one address space, which is why a driver bug blue-screens the whole machine.",
    svg:svg(560,262,`${box(15,12,530,100,'',{dash:true,stroke:AM})}${text(25,26,'USER MODE · ring 3',{anchor:'start',bold:true,color:AM,size:10})}
      ${box(25,36,120,34,'applications',{size:10})}${box(155,36,120,34,'services\nsvchost.exe',{size:10})}${box(285,36,120,34,'csrss.exe\nWin32 subsystem',{size:9})}${box(415,36,120,34,'lsass.exe\nlogons · secrets',{size:9,stroke:MG})}
      ${box(25,78,510,26,'kernel32.dll  →  ntdll.dll  →  syscall instruction',{size:10,stroke:AM})}
      ${line(15,120,545,120,{dash:true,stroke:MG})}${arrow(280,104,280,140,'')}${text(400,124,'the only way down: syscall',{size:9,color:MG})}
      ${box(15,142,530,112,'',{dash:true,stroke:CY})}${text(25,156,'KERNEL MODE · ring 0 · ntoskrnl.exe',{anchor:'start',bold:true,color:CY,size:10})}
      ${box(25,166,98,34,'Object Mgr\nevery handle',{size:9})}${box(128,166,98,34,'Memory Mgr\npage tables',{size:9})}${box(231,166,98,34,'I/O Mgr\ndriver stacks',{size:9})}${box(334,166,98,34,'Security Ref.\nMonitor',{size:9,stroke:MG})}${box(437,166,98,34,'Config Mgr\nthe registry',{size:9})}
      ${box(25,208,250,26,'kernel: scheduler · interrupts · sync',{size:10,stroke:CY})}${box(285,208,250,26,'drivers · win32k.sys · HAL',{size:10,stroke:AM})}
      ${text(280,247,'drivers share the kernel address space: one bad driver = bugcheck',{size:9,color:DIM})}`,'Windows NT architecture: user mode above, kernel mode below')},
   {cap:"Anatomy of a process. The container holds an address space, a handle table, threads and an access token; the token's SIDs and integrity level decide every access check, and UAC simply hands an administrator two tokens.",
    svg:svg(560,228,`${box(15,12,330,204,'',{stroke:CY})}${text(30,26,'PROCESS  (a container)',{anchor:'start',bold:true,color:CY,size:11})}
      ${box(30,40,300,30,'virtual address space · 128 TB user (x64)',{size:10})}
      ${box(30,80,145,52,'handle table\n0x1C4 → entry 113\n(values step by 4)',{size:9,stroke:AM})}${box(185,80,145,52,'threads\npriority 0–31\nwhat the scheduler runs',{size:9,stroke:LM})}
      ${box(30,142,300,64,'ACCESS TOKEN  "who is this?"\nuser SID · group SIDs · privileges\nintegrity: Low · Medium · High · System',{size:9,stroke:MG})}
      ${box(365,40,180,36,'S-1-5-18 = LocalSystem',{size:10,mono:true})}${box(365,86,180,46,'…-500 Administrator\n512 Domain Admins',{size:9,mono:true})}
      ${box(365,142,180,64,'UAC: an admin logon =\nfiltered Medium token +\nfull High token on consent',{size:9,stroke:AM})}`,'Process, handle table, threads and access token')},
   {cap:"The boot and critical-process chain. Anything named like one of these but living outside System32 or hanging off the wrong parent is masquerading; Process Explorer shows both the path and the parent.",
    svg:flow([{t:'UEFI →\nbootmgfw.efi'},{t:'winload.efi'},{t:'ntoskrnl.exe',stroke:CY},{t:'smss.exe'},{t:'csrss · wininit\n(Session 0)'},{t:'services.exe\n+ lsass.exe',stroke:MG},{t:'winlogon →\nuserinit'},{t:'explorer.exe',stroke:LM}],{bw:100,gap:40,label:'Windows boot and critical process chain'})}];

  I.p16m2=[{cap:"A PowerShell pipeline passes .NET objects, not text. Each stage asks the object for a property; nothing is parsed, and objects stream downstream one at a time so a million-line log never has to fit in memory.",
    svg:flow([{t:'Get-ChildItem\n-Recurse -File',stroke:CY},{t:'Where-Object\nLength -gt 100MB'},{t:'Sort-Object\nLength -Desc'},{t:'Select-Object\nFullName, GB'},{t:'Export-Csv\nold-big-logs.csv',stroke:AM}],{gap:60,edges:['objects','objects','objects','rows'],label:'The object pipeline'})},
   {cap:"Bash chains programs that exchange text; PowerShell chains cmdlets that exchange objects. The second design removes the parsing step, which is why Get-Member matters more than any regular expression.",
    svg:compare({t:'BASH (Domain 3): text',draw:x=>[['ps aux | grep nginx | awk \'{print $2}\'',true],['→ columns of text',false],['breaks when a column shifts',false],['exit status: $? is a number',false]].map((l,i)=>text(x+130,52+i*28,l[0],{size:10,mono:l[1]})).join('')},{t:'POWERSHELL: objects',draw:x=>[['Get-Process nginx |',true],['  Select-Object -ExpandProperty Id',true],['→ the .Id property, nothing parsed',false],['Get-Member shows the shape · Format-* last',false]].map((l,i)=>text(x+130,52+i*28,l[0],{size:10,mono:l[1],color:l[1]?AM:'currentColor'})).join('')},{h:180,label:'Text pipeline versus object pipeline'})},
   {cap:"Remoting fans one command out to many machines over WinRM (5985/5986), authenticated by Kerberos inside a domain; results come back as objects tagged with PSComputerName, and JEA endpoints expose only the cmdlets a role needs.",
    svg:svg(560,204,`${box(20,70,150,50,'admin workstation\nInvoke-Command',{stroke:CY,size:10})}
      ${box(390,18,150,40,'SRV01',{size:11})}${box(390,80,150,40,'SRV02',{size:11})}${box(390,142,150,40,'SRV03',{size:11})}
      ${arrow(170,88,390,38,'')}${arrow(170,95,390,100,'WinRM 5985/5986 · Kerberos')}${arrow(170,102,390,162,'')}
      ${box(20,140,150,52,'JEA endpoint:\nonly named cmdlets\nper role',{size:9,stroke:AM})}
      ${text(280,195,'fan-out: 32 machines at a time · results tagged PSComputerName',{size:9,color:DIM})}`,'PowerShell remoting over WinRM')}];

  I.p16m3=[{cap:"Core-based licensing, worked. Count every physical core (minimum 8 per processor, 16 per server); Standard buys two VMs per full set, Datacenter buys unlimited VMs, and on a 40-core host they cross at about twelve VMs.",
    svg:svg(560,224,`${box(20,12,520,34,'host: 2 processors × 20 cores = 40 cores → 40 core licenses (min 8/proc, 16/server)',{size:10,stroke:CY})}
      ${text(150,68,'STANDARD',{bold:true,color:LM})}${box(20,80,260,36,'40 × $73.50 = $2,940 per 2 VMs',{size:10,stroke:LM})}${box(20,122,260,36,'6 VMs: $8,820 · 12 VMs: $17,640',{size:10,stroke:LM})}
      ${text(420,68,'DATACENTER',{bold:true,color:MG})}${box(300,80,240,36,'40 × $423.19 = $16,928',{size:10,stroke:MG})}${box(300,122,240,36,'unlimited VMs on this host',{size:10,stroke:MG})}
      ${box(20,172,520,40,'break-even ≈ 12 VMs per host · plus a CAL per user or device · RDS CALs on top',{size:10,stroke:AM})}`,'Windows Server Standard versus Datacenter licensing arithmetic')},
   {cap:"Scope arithmetic for a /24: 254 usable addresses minus the infrastructure exclusion and printer reservations leaves 224 dynamic leases, which 300 one-day visitors on an 8-day lease exhaust in two days.",
    svg:svg(560,168,`${text(280,22,'scope 10.10.20.0/24 → 254 usable addresses',{bold:true,size:11,color:CY})}
      ${box(20,40,41,40,'',{fill:'#2a1f0b',stroke:AM})}${box(61,40,21,40,'',{fill:'#2a0b2a',stroke:MG})}${box(82,40,458,40,'224 dynamic leases · 8-day lease (DORA)',{fill:'#0b2a3a',stroke:CY,size:10})}
      ${text(40,96,'.1–.20\nexcluded',{size:9,color:AM})}${text(100,96,'10 printer\nreservations',{size:9,color:MG})}${text(400,96,'options: 003 router · 006 DNS · 015 domain · 066/067 PXE',{size:9,color:DIM})}
      ${text(280,136,'300 one-day visitors × 8-day lease exhaust 224 in two days\nfix: 1-day lease, or widen to /23 (510 usable) · authorize in AD · DHCP failover',{size:10,color:DIM,lh:15})}`,'DHCP scope arithmetic for a /24')},
   {cap:"Server Core versus Desktop Experience. The choice is permanent at install time, so decide by role: headless for infrastructure, GUI only where a role or a learner needs it.",
    svg:compare({t:'SERVER CORE',draw:x=>[['no shell, browser or MMC'],['sconfig + remote management'],['smaller surface, fewer reboots'],['DCs · DNS/DHCP · file · Hyper-V'],['fixed at install (since 2016)']].map((l,i)=>text(x+130,52+i*26,l[0],{size:10})).join('')},{t:'DESKTOP EXPERIENCE',draw:x=>[['full GUI on the box'],['RDS Session Host needs it'],['legacy GUI-only installers'],['bigger surface, more patches'],['learning, then move to Core']].map((l,i)=>text(x+130,52+i*26,l[0],{size:10})).join('')},{h:190,label:'Server Core versus Desktop Experience'})},
   {cap:"Headless by design: one management workstation runs Windows Admin Center, RSAT and PowerShell, and every server stays Server Core.",
    svg:svg(560,150,`${box(20,45,190,62,'management workstation\nWindows Admin Center :6516\nRSAT · PowerShell remoting',{stroke:CY,size:9})}
      ${box(330,12,210,36,'DC01 · Core · AD DS, DNS, DHCP',{size:10,stroke:LM})}${box(330,58,210,36,'FS01 · Core · files, DFS, print',{size:10,stroke:LM})}${box(330,104,210,36,'HV01 · Core · Hyper-V host',{size:10,stroke:LM})}
      ${arrow(210,66,330,30,'')}${arrow(210,76,330,76,'WinRM · HTTPS')}${arrow(210,86,330,122,'')}`,'Managing Server Core remotely with Windows Admin Center')}];

  I.p16m4=[{cap:"Forest, domain, OUs. The forest is the security boundary; a domain is only a replication and policy boundary; OUs exist to link Group Policy and delegate administration, while groups (AGDLP) are what grant access.",
    svg:svg(560,246,`${box(170,12,220,40,'FOREST  corp.example.com\nsecurity boundary · one schema',{stroke:CY,bold:true,size:10})}
      ${line(280,52,280,66)}${line(185,66,455,66)}${line(185,66,185,78)}${line(455,66,455,78)}
      ${box(20,78,330,44,'DOMAIN  corp.example.com\nreplication · policy · naming boundary',{stroke:LM,size:10})}${box(370,78,170,44,'SITES · TRUSTS\nHQ ↔ Branch · forest trust',{stroke:MG,size:9})}
      ${line(185,122,185,134)}${line(57,134,338,134)}${[57,133.5,210,286.5,338].map(c=>line(c,134,c,146)).join('')}
      ${box(20,146,74,34,'OU\nTier0',{size:10,stroke:AM})}${box(96.5,146,74,34,'OU\nServers',{size:10})}${box(173,146,74,34,'OU\nWorkstations',{size:10})}${box(249.5,146,74,34,'OU\nUsers',{size:10})}${box(326,146,24,34,'…',{size:12})}
      ${box(370,136,170,50,'every DC holds ntds.dit\nschema · config · domain\npartitions · GC on 3268',{size:9,stroke:DIM})}
      ${text(185,200,'OUs link GPOs and delegate admin · groups (AGDLP) grant access',{size:9,color:DIM})}
      ${text(280,230,'one forest, one domain, named under a public domain you own — never .local',{size:10,color:AM})}`,'Active Directory forest, domain and OU structure')},
   {cap:"Kerberos, step by step. The TGT is readable only by domain controllers (krbtgt key); the service ticket is readable only by the service (its own key); the service never calls the DC and no password crosses the wire.",
    svg:svg(560,212,`${box(30,12,120,36,'CLIENT\nAna\'s laptop',{stroke:LM,size:10})}${box(220,12,120,36,'KDC on a DC\nkrbtgt key · :88',{stroke:CY,size:10})}${box(410,12,120,36,'SERVICE\ncifs/fs01 · its key',{stroke:MG,size:10})}
      ${line(90,48,90,200,{dash:true,stroke:DIM})}${line(280,48,280,200,{dash:true,stroke:DIM})}${line(470,48,470,200,{dash:true,stroke:DIM})}
      ${arrow(95,72,275,72,'1 AS-REQ: name + timestamp')}${arrow(275,98,95,98,'2 AS-REP: TGT (10 h) + key')}
      ${arrow(95,124,275,124,'3 TGS-REQ: TGT + SPN')}${arrow(275,150,95,150,'4 TGS-REP: ticket + PAC')}
      ${arrow(95,178,465,178,'5 AP-REQ: ticket → service decrypts it')}
      ${text(280,198,'clocks within 5 min · needs DNS SRV + SPNs · AES, not RC4 · else NTLM fallback',{size:9,color:DIM})}`,'Kerberos ticket flow: AS, TGS and AP exchanges')},
   {cap:"Group Policy precedence: Local, Site, Domain, OU, child OU, and the last writer wins, so the OU closest to the object has the final word unless a higher link is Enforced. Refresh: every 90 minutes plus up to 30 random on clients, 5 minutes on DCs.",
    svg:stack([{t:'Local GPO',side:'processed first'},{t:'Site GPOs'},{t:'Domain GPOs',side:'Enforced: wins ties',stroke:AM},{t:'OU GPOs',side:'Block Inheritance'},{t:'child OU (closest)',side:'last writer wins',stroke:CY}],{side:true,label:'Group Policy processing order'})},
   {cap:"The five FSMO roles. Multi-master replication handles ordinary writes; these operations need one owner per forest or per domain. Transfer gracefully; seize only when the holder is gone for good.",
    svg:svg(560,124,`${text(130,20,'FOREST-WIDE (one each)',{bold:true,color:CY,size:10})}${text(405,20,'DOMAIN-WIDE (one per domain)',{bold:true,color:AM,size:10})}
      ${box(20,34,110,50,'Schema Master\nschema changes',{size:9,stroke:CY})}${box(135,34,110,50,'Domain Naming\nMaster',{size:9,stroke:CY})}
      ${box(270,34,85,50,'RID Master\n500-RID pools',{size:9,stroke:AM})}${box(365,34,85,50,'PDC Emulator\ntime, lockouts',{size:9,stroke:AM})}${box(460,34,85,50,'Infrastructure\nMaster',{size:9,stroke:AM})}
      ${text(280,108,'netdom query fsmo · the PDC Emulator is the busiest role and the domain\'s time source',{size:9,color:DIM})}`,'The five FSMO roles')}];

  I.p16m5=[{cap:"Hybrid identity. Active Directory stays on-premises for servers and legacy apps and is projected into Microsoft Entra ID by Connect Sync or Cloud Sync; devices relate to the cloud in three ways, and Intune plus Conditional Access take over the jobs Group Policy did.",
    svg:svg(560,246,`${box(20,15,200,60,'ACTIVE DIRECTORY (on-prem)\nLDAP · Kerberos · Group Policy',{stroke:AM,size:10})}${box(340,15,200,60,'MICROSOFT ENTRA ID (cloud)\nOAuth 2.0 · OIDC · SAML · flat',{stroke:CY,size:10})}
      ${arrow(220,45,340,45,'')}${text(280,30,'Connect Sync / Cloud Sync',{size:9,color:DIM})}${text(280,62,'every 30 min · PHS · PTA',{size:9,color:DIM})}
      ${box(20,110,160,50,'Entra registered\nBYOD + work account',{size:9})}${box(200,110,160,50,'Entra joined\nnew corporate devices',{size:9,stroke:CY})}${box(380,110,160,50,'Hybrid Entra joined\nAD-joined + cloud registered',{size:9,stroke:AM})}
      ${arrow(100,110,380,76,'')}${arrow(280,110,420,76,'')}${arrow(460,110,460,76,'')}
      ${box(20,185,250,48,'Intune replaces Group Policy\ncompliance · profiles · apps',{size:10,stroke:LM})}${box(290,185,250,48,'Conditional Access judges\nevery sign-in: if → then',{size:10,stroke:MG})}`,'Hybrid identity between Active Directory and Microsoft Entra ID')},
   {cap:"Conditional Access is an if-then engine: signals about the user, app, device and risk go in; the policy grants (usually with MFA and a compliant device) or blocks. Build in report-only mode and exclude two break-glass accounts.",
    svg:svg(560,200,`${box(20,30,170,140,'IF  (signals)\nuser or group\ncloud app\ndevice platform\nnamed location\ndevice state: compliant?\nsign-in / user risk',{size:9,stroke:CY,lh:15})}
      ${arrow(190,100,220,100,'')}${box(220,70,120,60,'Conditional\nAccess policy\n(Entra ID P1)',{stroke:AM,size:10})}
      ${box(380,30,160,50,'GRANT if MFA +\ncompliant device',{stroke:LM,size:10})}${box(380,120,160,50,'BLOCK\n(or limit the session)',{stroke:MG,size:10})}
      ${arrow(340,90,380,55,'match')}${arrow(340,110,380,145,'else')}
      ${text(280,188,'report-only first · exclude 2 break-glass accounts · block legacy auth',{size:9,color:DIM})}`,'Conditional Access as an if-then policy engine')},
   {cap:"Windows Autopilot, user-driven: a factory-sealed laptop becomes a managed, compliant device with no imaging, and the Enrollment Status Page holds the user until policies and required apps have landed.",
    svg:flow([{t:'hardware hash\nuploaded'},{t:'profile +\ngroup tag'},{t:'user unboxes,\nsigns in',stroke:CY},{t:'Entra join +\nIntune enroll'},{t:'ESP: policies\n& required apps',stroke:AM},{t:'compliant,\nready to work',stroke:LM}],{label:'Windows Autopilot user-driven flow'})}];

  I.p16m6=[{cap:"Log sizing is arithmetic. A domain controller at 50 events per second fills the default 20 MB Security log in about eleven minutes, so size it in gigabytes and forward events off the box, where an attacker with admin rights cannot clear them.",
    svg:svg(560,186,`${box(20,18,150,50,'50 events/s\n× 600 bytes',{stroke:CY,size:11})}${arrow(170,43,210,43,'')}${box(210,18,150,50,'= 30 KB/s\n≈ 2.6 GB per day',{stroke:AM,size:11})}${arrow(360,43,400,43,'')}${box(400,18,140,50,'20 MB default log\nwraps in ~11 min',{stroke:MG,size:10})}
      ${box(20,98,250,50,'set 1 GB+ on DCs\n(baseline floor 192 MB)',{size:10})}${arrow(270,123,310,123,'')}${box(310,98,230,50,'forward off-box: WEF or agent\n→ SIEM (Wazuh · Sentinel)',{size:10,stroke:LM})}
      ${text(280,170,'an attacker with admin can clear a local log, not one already shipped',{size:9,color:DIM})}`,'Security log sizing arithmetic')},
   {cap:"Four ways to patch, and the ring design that makes any of them safe: a small pilot catches breakage before ten percent see it, and deadlines guarantee completion before the next Patch Tuesday.",
    svg:svg(560,206,`${box(20,15,122,56,'WSUS\ndeprecated 2024\nlab only',{size:10,stroke:DIM})}${box(154,15,122,56,'Windows Update\nfor Business\nIntune rings',{size:10,stroke:CY})}${box(288,15,122,56,'Autopatch\nMicrosoft runs\nthe rings',{size:10,stroke:LM})}${box(422,15,122,56,'Hotpatch\nno-reboot · $1.50\ncore/month (Arc)',{size:10,stroke:AM})}
      ${box(20,108,150,46,'PILOT 1%\nday 0 · IT + volunteers',{stroke:CY,size:10})}${arrow(170,131,215,131,'day 3')}${box(215,108,150,46,'EARLY 10%\nacross departments',{stroke:AM,size:10})}${arrow(365,131,410,131,'day 7')}${box(410,108,130,46,'BROAD 89%\ndeadline + grace',{stroke:LM,size:10})}
      ${text(280,178,'quality deferral up to 30 days · feature up to 365 days\nHotpatch reboots only in Jan · Apr · Jul · Oct — 4 a year, not 12',{size:9,color:DIM,lh:13})}`,'Update delivery models and update rings')},
   {cap:"BitLocker seals the volume key to the TPM and a measured boot chain, so the disk opens only on its own machine; when firmware changes the measurements, only the escrowed 48-digit recovery password gets you back in.",
    svg:svg(560,200,`${box(20,20,160,60,'TPM 2.0\nseals the volume key\nto measured boot',{stroke:CY,size:10})}${arrow(180,50,220,50,'')}${box(220,20,160,60,'boot chain unchanged?\nkey unseals → volume\nopens on this PC only',{stroke:LM,size:9})}${arrow(380,50,420,50,'')}${box(420,20,120,60,'then Windows\nlogon protects\nthe running PC',{size:9,stroke:DIM})}
      ${box(20,110,220,56,'firmware updated → measurements\nchanged → key will not unseal',{stroke:MG,size:9})}${arrow(240,138,280,138,'')}${box(280,110,260,56,'48-digit recovery password\nescrowed to Entra ID / AD first\nSuspend-BitLocker -RebootCount 1',{stroke:AM,size:9})}
      ${text(280,185,'XTS-AES 128 default · data at rest only · on by default in 24H2 clean installs',{size:9,color:DIM})}`,'BitLocker, the TPM and recovery')}];

  I.p16m7=[{cap:"The tiered administration model. Tier 0 is the identity control plane; control flows down through separate accounts, but credentials never flow down, because an interactive logon leaves credential material in LSASS on the lower machine.",
    svg:svg(560,238,`${box(180,15,200,50,'TIER 0 · identity control plane\nDCs · AD CS · Entra Connect · PAWs',{stroke:MG,size:9,fill:'#2a0b2a'})}
      ${box(120,85,320,50,'TIER 1 · servers and applications\nfile, print, SQL, web, Hyper-V hosts*',{stroke:AM,size:10})}
      ${box(40,155,480,50,'TIER 2 · workstations, users, help desk\n(* a host that runs a DC is Tier 0)',{stroke:CY,size:10})}
      ${arrow(532,65,532,152,'',{stroke:MG})}${text(500,112,'credentials\nnever flow down',{size:9,color:MG})}
      ${arrow(28,152,28,68,'',{stroke:LM})}${text(60,112,'control flows\nup only via\nseparate accounts',{size:9,color:LM})}
      ${text(280,224,'ana (T2) · ana-t1 · ana-t0 on a PAW · Protected Users · logon restrictions by GPO',{size:9,color:DIM})}`,'The tiered administration model')},
   {cap:"Credential theft is the engine of almost every path across the map, stated only as a shape: each control on the lower row cuts one link, and the events listed are how you see the chain while it runs.",
    svg:svg(560,226,`${[['phish →\nfoothold'],['local admin\non that PC'],['harvest\nLSASS memory'],['reuse on\nnext machine'],['Tier 0\ncredential']].map((t,i)=>box(20+i*108.5,18,86,46,t[0],{size:10,stroke:MG})+(i<4?arrow(108+i*108.5,41,126.5+i*108.5,41,''):'')).join('')}
      ${[['ASR rules\nMFA · passkeys'],['Windows LAPS\nEPM, no local\nadmin users'],['Credential\nGuard + LSA\nprotection'],['host firewall\nscoping ·\ntiering'],['Protected\nUsers · PIM\nno caching']].map((t,i)=>arrow(63+i*108.5,118,63+i*108.5,68,'',{stroke:LM})+box(20+i*108.5,118,86,58,t[0],{size:9,stroke:LM})).join('')}
      ${text(280,196,'each control cuts one link of the chain\ndetect: 4624 type-3 fan-out · 4672 · 4648 · Sysmon 10 on lsass.exe',{size:9,color:DIM,lh:13})}`,'The credential-theft chain and the control that cuts each link')},
   {cap:"The detection pipeline. Sysmon and audit policy produce the events, forwarding moves them off the box, the SIEM runs Sigma-style rules, and an alert hands off to the Domain 7 incident process.",
    svg:flow([{t:'Sysmon +\naudit policy',stroke:CY},{t:'Windows Event\nForwarding'},{t:'SIEM\nWazuh · Sentinel',stroke:AM},{t:'Sigma-style\nrule'},{t:'alert →\nIR process',stroke:MG}],{gap:56,edges:['events','off-box','query','fires'],label:'From Sysmon to an alert'})}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
