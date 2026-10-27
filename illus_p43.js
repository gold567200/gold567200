/* Illustrations — Domain 43: macOS, iOS & Apple Device Management, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  const circ=(x,y,c)=>`<circle cx="${x}" cy="${y}" r="6" fill="none" stroke="${c}" stroke-width="2"/>`;
  /* ================= DOMAIN 43: Apple ================= */
  I.p43m1=[{cap:"macOS in layers. Everything from launchd down to the kernel is Darwin, Apple's open-source core; the frameworks and apps on top are Apple's closed code; the chip underneath carries the Secure Enclave.",
    svg:stack([{t:'Apps: Safari, Terminal, your tools',side:'closed source'},{t:'Frameworks: AppKit · Metal · Core ML',side:'closed source'},{t:'launchd (PID 1): daemons · agents',stroke:CY,side:'Darwin (open)'},{t:'BSD userland: zsh · ls · sed',side:'Darwin (open)'},{t:'XNU kernel: Mach + BSD + IOKit',stroke:CY,side:'Darwin (open)'},{t:'Apple silicon SoC + Secure Enclave',stroke:AM,side:'hardware'}],{w:340,side:true,label:'macOS layers from apps to silicon'})},
   {cap:"Why unified memory matters for local AI. A PC's GPU can only use its own VRAM, fed across PCIe; on Apple silicon the CPU, GPU and Neural Engine share one memory pool, so a 128 GB Mac can give its GPU roughly 96 GB.",
    svg:compare({t:'PC: DISCRETE GPU',draw:x=>box(x+20,40,220,36,'CPU + 64 GB DDR5\n≈ 90 GB/s',{size:10})+arrow(x+130,78,x+130,112,'PCIe ≈ 64 GB/s',{dy:0})+box(x+20,114,220,40,'GPU: 32 GB VRAM\n1,792 GB/s',{stroke:MG,size:10})+text(x+130,170,'model must fit in 32 GB',{size:10,color:MG})},
      {t:'MAC: UNIFIED MEMORY',draw:x=>box(x+15,40,230,116,'',{stroke:CY})+text(x+130,51,'one package',{size:9,color:DIM})+['CPU','GPU','NE'].map((t,i)=>box(x+30+i*70,60,60,28,t,{size:10})+line(x+60+i*70,88,x+60+i*70,104)).join('')+box(x+30,104,200,44,'128 GB unified memory\n614 GB/s (M5 Max)',{stroke:CY,size:10})+text(x+130,170,'GPU can wire ≈ 96 GB',{size:10,color:CY})},{h:190,label:'Discrete GPU memory versus Apple unified memory'})},
   {cap:"The decode-speed ceiling is memory bandwidth divided by the bytes read per token. For a 70B model at 4.5 bits (39.4 GB) each step up the Apple silicon line roughly doubles the ceiling; the RTX 5090 is faster per byte but cannot hold the model.",
    svg:svg(560,240,`${text(280,16,'Decode ceiling, 70B at 4.5 bits',{bold:true,color:CY,size:12})}
      ${[['M5 · 153 GB/s',3.9],['M5 Pro · 307 GB/s',7.8],['M5 Max · 614 GB/s',15.6],['M5 Ultra · 1.2 TB/s',30.5]].map(([l,v],i)=>{const y=34+i*36, len=Math.round(v*9.5); return text(150,y+13,l,{anchor:'end',size:11})+box(160,y,len,26,'',{stroke:CY})+text(160+len+8,y+13,v+' tok/s',{anchor:'start',size:11,color:LM});}).join('')}
      ${text(150,191,'RTX 5090 · 1,792 GB/s',{anchor:'end',size:11})}${box(160,178,290,26,'too big for 32 GB VRAM',{dash:true,stroke:MG,size:10})}
      ${text(280,226,'ceiling = bandwidth ÷ 39.4 GB',{size:11,color:DIM})}`,'Decode speed ceilings for a 70B model on Apple silicon')}];

  I.p43m2=[{cap:"The protection layers a downloaded app meets. The browser marks it quarantined, Gatekeeper checks signature and notarization, XProtect scans it, TCC asks the user before it touches private data, and SIP keeps even root away from the sealed system.",
    svg:flow([{t:'browser saves app\n+ quarantine flag'},{t:'Gatekeeper:\nsigned? notarized?',stroke:CY},{t:'XProtect\nmalware scan',stroke:AM},{t:'app asks for\ncamera or files'},{t:'TCC prompt:\nuser decides',stroke:MG},{t:'SIP guards the\nsealed system',stroke:LM}],{bw:140,bh:56,gap:36,label:'Protection layers for a downloaded app'})},
   {cap:"launchd has domains. Daemons live in the system domain and run as root from boot; agents live in a user's gui domain and run as that user from login. The same launchctl verbs (bootstrap, print, kickstart, bootout) work on both.",
    svg:compare({t:'SYSTEM DOMAIN · DAEMONS',draw:x=>box(x+15,42,230,34,'/Library/LaunchDaemons',{mono:true,size:11})+box(x+15,86,230,34,'runs as root, at boot',{size:11})+box(x+15,130,230,46,'sudo launchctl bootstrap\nsystem job.plist',{mono:true,size:10,stroke:CY})},
      {t:'GUI/501 DOMAIN · AGENTS',draw:x=>box(x+15,42,230,34,'~/Library/LaunchAgents',{mono:true,size:11})+box(x+15,86,230,34,'runs as the user, at login',{size:11})+box(x+15,130,230,46,'launchctl bootstrap\ngui/501 job.plist',{mono:true,size:10,stroke:MG})},{h:200,label:'launchd system and user domains'})}];

  I.p43m3=[{cap:"The non-booting Mac ladder, least destructive first. Each step keeps data until the DFU restore; restoring from backup is the last rung, not the first.",
    svg:flow([{t:'startup options\nappear?'},{t:'First Aid in\nDisk Utility',edge:'yes'},{t:'reinstall macOS\n(keeps data)',stroke:LM,edge:'fails'},{t:'DFU revive\n(keeps data)',stroke:AM,edge:'fails'},{t:'DFU restore\n(erases all)',stroke:MG,edge:'fails'},{t:'restore from\nbackup',stroke:CY,edge:'then'}],{bw:140,bh:56,gap:50,label:'Escalation ladder for a Mac that will not boot'})},
   {cap:"Where the evidence lives. Every process writes structured messages through logd into tracev3 files; Console, log show and log stream read them, and a sysdiagnose bundles them for the ticket.",
    svg:flow([{t:'processes log\nsubsystem · level'},{t:'logd collects',stroke:CY},{t:'tracev3 store\n/var/db/diagnostics'},{t:'Console · log show\nlog stream',stroke:AM},{t:'sysdiagnose\nattached to ticket',stroke:MG}],{bw:140,bh:56,gap:40,label:'The unified log pipeline'})}];

  I.p43m4=[{cap:"The MDM protocol never connects to the device. The server asks APNs to wake it; the device calls the server, reports Idle, pulls one queued command, executes it and acknowledges, repeating until the queue is empty.",
    svg:svg(560,235,`${box(20,15,150,44,'MDM server',{stroke:CY})}${box(205,15,150,44,'APNs (Apple)',{stroke:AM})}${box(390,15,150,44,'iPhone or Mac',{stroke:MG})}
      ${line(95,59,95,225,{dash:true,stroke:DIM})}${line(280,59,280,225,{dash:true,stroke:DIM})}${line(465,59,465,225,{dash:true,stroke:DIM})}
      ${arrow(95,90,278,90,'1 push · HTTP/2 443')}${arrow(282,120,463,120,'2 wake · TCP 5223')}${arrow(463,150,97,150,'3 HTTPS: Idle')}${arrow(97,180,463,180,'4 queued command')}${arrow(463,210,97,210,'5 Acknowledged')}`,'MDM push, check-in and command sequence')},
   {cap:"Legacy MDM versus Declarative Device Management. In the 27.0 releases legacy update commands stop working entirely, so update enforcement is declarative only.",
    svg:compare({t:'LEGACY MDM',draw:x=>['server sends one command','device obeys, then replies','server polls for state','updates by MDM command','gone for updates in 27.0'].map((l,i)=>text(x+130,52+i*26,l,{size:11,color:i===4?MG:'currentColor'})).join('')},
      {t:'DECLARATIVE (DDM)',draw:x=>['server sends declarations','device enforces on its own','status channel reports changes','updates by declaration + deadline','required in every 27.0 OS'].map((l,i)=>text(x+130,52+i*26,l,{size:11,color:i===4?LM:'currentColor'})).join('')},{h:180,label:'Legacy MDM versus DDM'})},
   {cap:"Zero-touch deployment. The purchase links the serial to your Apple Business account, the account points it at your MDM, and the device configures itself at first power-on while the user waits at Await Configuration.",
    svg:flow([{t:'buy from Apple\nor a reseller'},{t:'serial appears in\nApple Business',stroke:CY},{t:'assigned to\nMDM server'},{t:'first boot:\nRemote Management',stroke:AM},{t:'profiles, apps,\nPlatform SSO',stroke:MG},{t:'user reaches a\nfinished desktop',stroke:LM}],{bw:140,bh:56,gap:36,label:'Zero-touch deployment path'})}];

  I.p43m5=[{cap:"Platform SSO login with a Secure Enclave key. The private key never leaves the chip; the identity provider checks a signature, so there is no password to phish, and apps then sign in with the issued token.",
    svg:flow([{t:'login window or\nFileVault unlock'},{t:'IdP SSO extension\n(Entra · Okta)',stroke:CY},{t:'Secure Enclave key\nsigns challenge',stroke:AM},{t:'IdP verifies,\nissues SSO token',stroke:MG},{t:'apps sign in\nwithout prompts',stroke:LM}],{bw:150,bh:56,gap:40,label:'Platform SSO with a Secure Enclave key'})},
   {cap:"Who can unlock what. A secure-token user's password or the escrowed recovery key unwraps the FileVault key; the bootstrap token only lets MDM grant secure tokens and authorize updates.",
    svg:svg(560,240,`${box(20,20,160,50,'user password\n(secure-token user)',{stroke:CY,size:10})}${box(200,20,160,50,'recovery key\n(escrowed in MDM)',{stroke:AM,size:10})}${box(380,20,160,50,'bootstrap token\n(escrowed in MDM)',{stroke:MG,size:10,dash:true})}
      ${arrow(100,70,180,110,'unlocks')}${arrow(280,70,262,110,'unlocks')}
      ${box(100,110,260,44,'key encryption key\nguarded by Secure Enclave',{stroke:CY,size:10})}${arrow(230,154,230,180,'')}
      ${box(100,180,260,44,'volume key: Data volume\nAES engine, always on',{stroke:LM,size:10})}
      ${arrow(460,70,460,110,'')}${box(385,110,150,50,'grants secure tokens\nauthorizes updates',{stroke:MG,size:10})}${text(460,182,'does not unlock',{size:10,color:MG})}${text(460,196,'FileVault',{size:10,color:MG})}`,'FileVault unlockers versus the bootstrap token')}];

  I.p43m6=[{cap:"Bonjour stops at the router. The Apple TV's mDNS announcements to 224.0.0.251 never leave VLAN 30, so the staff Mac cannot see it until an mDNS gateway reflects just the AirPlay service to VLAN 10.",
    svg:svg(560,250,`${box(20,20,170,56,'staff Mac\nVLAN 10',{stroke:CY})}${box(370,20,170,56,'Apple TV\nVLAN 30',{stroke:AM})}
      ${box(195,100,170,44,'router / L3 switch',{})}
      ${arrow(430,76,330,100,'announce')}${arrow(195,122,105,76,'blocked',{stroke:MG,color:MG})}
      ${text(280,165,'224.0.0.251 · TTL 1',{size:10,color:DIM})}
      ${box(195,186,170,46,'mDNS gateway:\nreflect _airplay only',{stroke:LM})}
      ${arrow(480,76,365,200,'',{dash:true,stroke:LM})}${arrow(195,200,60,76,'',{dash:true,stroke:LM})}
      ${text(280,244,'guest VLAN gets nothing',{size:10,color:DIM})}`,'Bonjour across VLANs with an mDNS gateway')},
   {cap:"Apple's roaming arithmetic. An iPhone on a call at −73 dBm has crossed its −70 dBm trigger and needs a candidate 8 dB stronger (−65 dBm or better): the −64 dBm AP wins, the −66 dBm AP does not.",
    svg:svg(560,230,`${line(40,130,520,130)}
      ${[-80,-75,-70,-65,-60,-55].map(d=>{const x=40+(d+80)*19.2; return line(x,126,x,134)+text(x,146,String(d).replace('-','−'),{size:10,color:DIM});}).join('')}
      ${text(280,164,'signal (dBm): weaker ← → stronger',{size:10,color:DIM})}
      ${line(136,60,136,130,{dash:true,stroke:AM})}${text(136,52,'Mac roams below −75',{size:10,color:AM})}
      ${line(232,34,232,130,{dash:true,stroke:CY})}${text(232,26,'iPhone roams below −70',{size:10,color:CY})}
      ${line(328,80,328,130,{dash:true,stroke:LM})}${text(328,72,'needs −65 (+8 dB)',{size:10,color:LM})}
      ${circ(173,130,MG)}${text(173,182,'current AP −73',{size:10,color:MG})}
      ${circ(309,130,MG)}${text(300,200,'−66: too weak',{size:10,color:MG})}
      ${circ(347,130,LM)}${text(385,182,'−64: roams here',{size:10,color:LM})}
      ${text(280,222,'idle iPhone or any Mac: +12 dB',{size:10,color:DIM})}`,'Apple Wi-Fi roaming thresholds')},
   {cap:"Content caching, by the numbers. Without a cache 200 devices each pull an 8 GB update across the WAN; with one cache the WAN carries a single copy and the LAN delivers the rest.",
    svg:compare({t:'WITHOUT A CACHE',draw:x=>box(x+20,44,220,36,'200 devices × 8 GB',{size:11})+text(x+130,100,'= 1,600 GB over the WAN',{size:11,color:MG})+text(x+130,124,'1,600 × 8 ÷ 1 Gb/s',{size:11})+text(x+130,148,'≈ 12,800 s ≈ 3.6 hours',{size:11,color:MG})},
      {t:'WITH ONE CACHE',draw:x=>box(x+20,44,220,36,'cache Mac on Ethernet',{size:11,stroke:LM})+text(x+130,100,'WAN: one 8 GB copy',{size:11,color:LM})+text(x+130,124,'≈ 64 s at 1 Gb/s',{size:11})+text(x+130,148,'LAN serves 1,592 GB',{size:11,color:LM})},{h:175,label:'WAN load with and without content caching'})}];

  I.p43m7=[{cap:"An AutoPkg-to-Munki patch pipeline. The download is code-signature verified, imported into the testing catalog, proven on pilot Macs, then promoted to production for everyone.",
    svg:flow([{t:'vendor download\n(.download recipe)'},{t:'code signature\nverified',stroke:CY},{t:'.munki import\nto testing',stroke:AM},{t:'pilot Macs\nfor 3 days'},{t:'promote to\nproduction',stroke:MG},{t:'Managed Software\nCenter installs',stroke:LM}],{bw:140,bh:56,gap:36,label:'AutoPkg and Munki pipeline'})},
   {cap:"The Jamf Pro API from a script. One token request with the API client's credentials, then paginated inventory calls; 2,350 Macs at 100 per page take 24 requests.",
    svg:svg(560,225,`${box(20,15,170,44,'Python script',{stroke:CY})}${box(370,15,170,44,'Jamf Pro',{stroke:AM})}
      ${line(105,59,105,195,{dash:true,stroke:DIM})}${line(455,59,455,195,{dash:true,stroke:DIM})}
      ${arrow(105,90,453,90,'POST /api/oauth/token')}${arrow(453,120,107,120,'access_token, expires_in')}${arrow(105,150,453,150,'GET computers-inventory')}${arrow(453,180,107,180,'100 records per page')}
      ${text(280,212,'2,350 Macs ÷ 100 = 24 pages',{size:11,color:LM})}`,'Jamf Pro API token and pagination sequence')},
   {cap:"A Mac-admin career ladder. Each rung adds a credential and, more importantly, more automation; the top rung is where macOS internals meet security engineering.",
    svg:pyramid([{t:'endpoint security\nor architect'},{t:'client platform engineer'},{t:'Mac / Jamf admin\nJamf Tech · Admin · ACITP'},{t:'help desk · Apple support\nACSP · Jamf Associate'}],{label:'Mac admin career ladder'})}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
