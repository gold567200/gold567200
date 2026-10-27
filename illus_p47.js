/* Illustrations — Domain 47: The Dark Web, Tor & Cybercrime Intelligence, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  /* ================= DOMAIN 47: Dark Web ================= */
  I.p47m1=[{cap:"The web drawn to scale instead of as an iceberg: the deep web (unindexed logins and databases) is enormous and mostly legal; the dark web is a small locked room inside it, counted in tens of thousands of live sites.",
    svg:svg(560,230,`${text(280,18,'THE WEB, TO SCALE (NOT AN ICEBERG)',{bold:true,size:11,color:DIM})}
      ${box(20,32,520,34,'surface web — indexed by search engines (hundreds of billions of pages)',{stroke:CY,size:10})}
      ${box(20,74,520,112,'',{stroke:AM})}${text(230,96,'deep web — unindexed: logins, databases, paywalls',{size:11,color:AM})}${text(230,114,'Bergman 2001: 400–550× the surface web, mostly legal',{size:10,color:DIM})}
      ${box(400,138,130,38,'dark web\nonion & I2P sites',{stroke:MG,size:9})}${text(230,158,'the dark web is the locked room, not the basement',{size:10,color:MG})}
      ${text(280,208,'Tor traffic: at least 80% goes to ordinary websites',{size:10,color:DIM})}`,'Surface, deep and dark web drawn to scale')},
   {cap:"Anonymity networks came from a Navy laboratory and a nonprofit, not from criminals: the timeline from onion routing at NRL to the Silk Road era.",
    svg:flow([{t:'1995–96\nNRL onion routing',stroke:CY},{t:'2000\nFreenet (Hyphanet)'},{t:'2002\nTor released',stroke:CY},{t:'2003\nI2P starts'},{t:'2006\nTor Project nonprofit',stroke:LM},{t:'2011–13\nSilk Road era',stroke:MG}],{bw:140,bh:52,gap:40,label:'Timeline of anonymity networks'})},
   {cap:"Tor Metrics, October 2026: mean daily directly-connecting users for the top five countries. One row plus its percentage recovers the total of about 3.2 million.",
    svg:svg(560,205,`${text(280,18,'Daily Tor users by country (Tor Metrics, Oct 2026)',{bold:true,size:11,color:CY})}
      ${[['United States',576,17.9,300,CY],['Germany',308,9.6,160,'currentColor'],['Finland',197,6.1,103,'currentColor'],['Brazil',147,4.6,77,'currentColor'],['United Kingdom',143,4.5,75,'currentColor']].map(([n,k,p,w,c],i)=>text(20,51+i*30,n,{anchor:'start',size:10})+box(130,40+i*30,w,22,'',{fill:i===0?'#0b2a3a':'none',stroke:c})+text(136+w,51+i*30,k+'k · '+p+'%',{anchor:'start',size:10,color:DIM})).join('')}
      ${text(280,193,'total ≈ 576k ÷ 0.179 ≈ 3.2 million per day (+ ~220k via bridges)',{size:10,color:DIM})}`,'Top countries by daily Tor users')}];
  I.p47m2=[{cap:"Who sees what on a three-hop circuit: the guard knows you but not your destination, the exit knows the destination but not you, and no single party sees both ends.",
    svg:svg(560,215,`${[['you',10,CY],['guard',125,'currentColor'],['middle',240,'currentColor'],['exit',355,'currentColor'],['website',470,MG]].map(([t,x,c])=>box(x,40,80,44,t,{stroke:c,size:12,bold:true})).join('')}
      ${arrow(92,62,123,62,'')}${arrow(207,62,238,62,'')}${arrow(322,62,353,62,'')}${arrow(437,62,468,62,'')}
      ${text(108,98,'3 layers',{size:9,color:DIM})}${text(223,98,'2 layers',{size:9,color:DIM})}${text(338,98,'1 layer',{size:9,color:DIM})}${text(453,98,'TLS or plain',{size:9,color:DIM})}
      ${text(50,128,'your ISP sees:\nTLS to a guard',{size:9})}${text(165,128,'sees your IP\nnot destination',{size:9})}${text(280,128,'sees guard & exit\nnothing else',{size:9})}${text(395,128,'sees destination\n+ any plain HTTP',{size:9})}${text(510,128,'sees exit IP\nnot you',{size:9})}
      ${text(280,195,'3 hops · 514-byte cells · a separate AES key per hop · guard pinned for months',{size:10,color:DIM})}`,'Tor circuit: who sees what at each hop')},
   {cap:"The onion itself: each relay holds one key and peels one layer; the wire only ever shows TLS between relays. Whether the innermost payload is readable at the exit depends on HTTPS.",
    svg:stack([{t:'TLS between relays (link)',stroke:DIM,side:'wire sees Tor'},{t:'layer 1: key with guard',stroke:CY,side:'guard peels'},{t:'layer 2: key with middle',stroke:AM,side:'middle peels'},{t:'layer 3: key with exit',stroke:MG,side:'exit peels'},{t:'payload: TCP stream to site',side:'HTTPS or plain'}],{w:300,side:true,label:'Onion layers of one cell'})},
   {cap:"Why bridges exist: a censor can download the public consensus and block every listed relay, so bridges are unlisted and pluggable transports disguise the handshake.",
    svg:compare({t:'PUBLIC RELAY (LISTED)',draw:x=>[['address in the hourly consensus'],['censor downloads list → blocks'],['DPI recognizes Tor handshake'],['works where Tor is not blocked']].map((l,i)=>text(x+130,52+i*28,l[0],{size:10})).join('')},{t:'BRIDGE + TRANSPORT',draw:x=>[['unlisted bridge address'],['obfs4: random-looking bytes'],['Snowflake: WebRTC via volunteers'],['WebTunnel: looks like HTTPS (2024)']].map((l,i)=>text(x+130,52+i*28,l[0],{size:10,color:AM})).join('')},{h:180,label:'Relays vs bridges'})}];
  I.p47m3=[{cap:"A v3 .onion address is nothing but the key: 32 bytes of ed25519 public key, a 2-byte SHA3-256 checksum and a version byte, base32-encoded into exactly 56 characters.",
    svg:svg(560,205,`${box(20,40,300,44,'ed25519 public key — 32 bytes',{stroke:CY,size:11})}${box(320,40,110,44,'checksum\n2 bytes',{stroke:AM,size:10})}${box(430,40,110,44,'version\n0x03 (1 byte)',{stroke:MG,size:10})}
      ${arrow(280,84,280,118,'base32',{dy:1})}
      ${box(90,120,380,40,'56 characters + ".onion" (62 in all)',{stroke:LM,size:11})}
      ${text(280,178,'35 bytes × 8 = 280 bits ÷ 5 bits per character = 56',{size:11,color:DIM})}
      ${text(280,196,'checksum = SHA3-256(".onion checksum" | key | 0x03)[:2]',{size:9,color:DIM,mono:true})}`,'Anatomy of a v3 onion address')},
   {cap:"Introduction and rendezvous: the service publishes a descriptor to HSDirs and waits at introduction points; the client picks a rendezvous relay and both sides build circuits to it. Six hops, and neither side learns the other's IP.",
    svg:svg(560,270,`${box(20,110,100,44,'client',{stroke:CY,size:12,bold:true})}${box(440,110,100,44,'onion service',{stroke:MG,size:11,bold:true})}
      ${box(230,20,100,40,'HSDir ring',{stroke:AM,size:11})}${box(230,100,100,44,'introduction\npoint',{size:10})}${box(230,190,100,44,'rendezvous\npoint',{stroke:LM,size:10})}
      ${arrow(490,110,330,42,'1 publish descriptor')}${arrow(120,110,230,42,'2 fetch descriptor')}
      ${arrow(120,150,230,210,'3 build circuit')}${arrow(120,126,230,120,'4 INTRODUCE1',{dy:12})}${arrow(330,120,440,128,'4 forwarded',{dy:12})}
      ${arrow(440,150,330,210,'5 RENDEZVOUS1')}
      ${text(280,258,'6 hops in total · the rendezvous relay sees only ciphertext · no IP crosses either way',{size:10,color:DIM})}`,'Onion service introduction and rendezvous protocol')}];
  I.p47m4=[{cap:"The only safe way to obtain Tor Browser: download from torproject.org, import the Tor Browser Developers signing key, and verify the .asc signature with gpgv before running anything. A BAD signature means delete.",
    svg:flow([{t:'download from\ntorproject.org'},{t:'import signing key\n(wkd lookup)'},{t:'gpgv .asc\nagainst the file',stroke:AM},{t:'Good signature\n→ install',stroke:LM}],{bw:104,bh:54,gap:36,label:'Verifying Tor Browser'})},
   {cap:"Tails and Whonix solve different problems: Tails leaves no trace on the hardware; Whonix makes sure that even a compromised workstation cannot learn your IP address.",
    svg:compare({t:'TAILS (AMNESIC)',draw:x=>[['live USB, Debian 13 based (7.x)'],['runs in RAM; nothing on disk'],['everything forced through Tor'],['optional encrypted Persistent Storage'],['for borrowed machines and sources']].map((l,i)=>text(x+130,52+i*28,l[0],{size:10})).join('')},{t:'WHONIX (ISOLATED)',draw:x=>[['two VMs on your host (18.0)'],['Gateway speaks only Tor'],['Workstation has no direct network'],['snapshot, work, revert'],['for a standing research box']].map((l,i)=>text(x+130,52+i*28,l[0],{size:10,color:AM})).join('')},{h:200,label:'Tails vs Whonix'})},
   {cap:"Tor Browser security levels trade features for attack surface; dark-web research is done at Safest because browser exploits, not Tor flaws, are what unmask people.",
    svg:stack([{t:'Standard — all features on',stroke:DIM,side:'trusted sites'},{t:'Safer — JS off on HTTP, click-to-play',stroke:AM,side:'general research'},{t:'Safest — JS off everywhere, fewer images',stroke:MG,side:'any onion site'}],{w:330,side:true,label:'Security levels'})}];
  I.p47m5=[{cap:"Tor uses one bidirectional three-hop circuit; I2P uses separate one-way inbound and outbound tunnels, rebuilt every ten minutes, with messages bundled by garlic routing.",
    svg:svg(560,215,`${text(140,24,'TOR: one circuit, both ways',{bold:true,color:CY,size:11})}${box(15,48,60,30,'you',{stroke:CY,size:11})}${box(95,48,44,30,'G',{size:11})}${box(159,48,44,30,'M',{size:11})}${box(223,48,44,30,'X',{size:11})}
      ${arrow(75,63,95,63,'')}${arrow(139,63,159,63,'')}${arrow(203,63,223,63,'')}${arrow(245,96,45,96,'reply, same 3 relays',{dy:-13})}
      ${text(140,140,'request and reply share one circuit\nthe exit reaches the clearnet',{size:9,color:DIM})}
      ${text(420,24,'I2P: two one-way tunnels',{bold:true,color:MG,size:11})}${box(300,48,60,30,'you',{stroke:MG,size:11})}${box(480,48,60,30,'peer',{stroke:MG,size:11})}
      ${arrow(360,63,480,63,'outbound tunnel')}${arrow(510,96,330,96,'inbound tunnel',{dy:-13})}
      ${text(420,140,'rebuilt every 10 min · garlic-bundled cells\nno exits by design',{size:9,color:DIM})}
      ${text(280,192,'both are overlay networks; they differ in what an observer can correlate',{size:10,color:DIM})}`,'Tor circuits vs I2P tunnels')},
   {cap:"A mixnet attacks the one thing Tor cannot: timing. A mix node delays, reorders and batches messages and adds dummy traffic, so order in does not match order out; the price is seconds of latency.",
    svg:svg(560,215,`${text(280,26,'A mix node breaks timing: order in ≠ order out',{bold:true,size:11,color:MG})}
      ${box(220,65,120,100,'MIX NODE\ndelay · reorder\nbatch · add cover',{stroke:MG,size:10})}
      ${arrow(60,80,220,80,'A')}${arrow(60,110,220,110,'B')}${arrow(60,140,220,140,'C')}
      ${arrow(340,80,500,80,'C')}${arrow(340,110,500,110,'A')}${arrow(340,140,500,140,'B')}${arrow(340,165,500,165,'dummy',{dash:true})}
      ${text(280,198,'Tor: hundreds of ms · Nym 5-hop mixnet: seconds · suits messaging, not browsing',{size:10,color:DIM})}`,'How a mixnet defeats timing correlation')},
   {cap:"What anonymity networks share with the mesh and off-grid networks of Domain 10 and Domain 12: all are overlays built from the same four parts; they differ in whether the goal is connectivity or unlinkability.",
    svg:tree({t:'overlay network',kids:[{t:'key = identity'},{t:'peer discovery'},{t:'relays / NAT'},{t:'store & forward'}]},{label:'What overlays share'})}];
  I.p47m6=[{cap:"Four takedowns, one pattern: each market ended through identities, infrastructure, money and physical evidence, never through breaking Tor.",
    svg:flow([{t:'Silk Road\n2011 – Oct 2013'},{t:'AlphaBay + Hansa\nJuly 2017',stroke:AM},{t:'Hydra\nApril 2022',stroke:MG},{t:'Genesis Market\nApril 2023',stroke:LM}],{bw:110,bh:54,gap:30,label:'Four market takedowns'})},
   {cap:"How operators get caught: the six evidence channels that appear again and again in the court documents, all pointing at the person behind the market.",
    svg:svg(560,250,`${box(205,100,150,50,'market operator',{stroke:MG,size:12,bold:true})}
      ${box(20,20,150,44,'reused handle\n& personal email',{size:10,stroke:CY})}${box(390,20,150,44,'server leaks\nits real IP',{size:10,stroke:CY})}
      ${box(20,103,150,44,'hosting & company\nrecords',{size:10,stroke:AM})}${box(390,103,150,44,'bitcoin trail\nto an exchange',{size:10,stroke:AM})}
      ${box(20,186,150,44,'physical mail\n& packages',{size:10,stroke:LM})}${box(390,186,150,44,'platform takeover\n(Hansa, 2017)',{size:10,stroke:LM})}
      ${arrow(170,42,205,105,'')}${arrow(390,42,355,105,'')}${arrow(170,125,205,125,'')}${arrow(390,125,355,125,'')}${arrow(170,208,205,145,'')}${arrow(390,208,355,145,'')}`,'Six evidence channels that identify market operators')},
   {cap:"Blockchain analysis in one transaction: spending 40 escrow payments together marks all 40 addresses as one wallet (common-input ownership); the change output stays with the owner and the big output lands at an exchange whose records answer a subpoena.",
    svg:svg(560,205,`${[['in 1 · 0.5 BTC'],['in 2 · 0.5 BTC'],['…'],['in 40 · 0.5 BTC']].map((t,i)=>box(20,28+i*38,96,30,t[0],{size:10,stroke:DIM})+arrow(116,43+i*38,170,95,'')).join('')}
      ${box(170,70,170,50,'one transaction\n40 inputs = 20 BTC',{stroke:CY,size:10})}
      ${arrow(340,85,400,62,'')}${box(400,40,140,44,'exchange deposit\n19.9 BTC → KYC record',{stroke:MG,size:9})}
      ${arrow(340,105,400,142,'')}${box(400,120,140,44,'change address\n0.1 BTC (same owner)',{stroke:AM,size:9})}
      ${text(280,192,'common-input-ownership heuristic: all 40 inputs belong to one wallet',{size:10,color:DIM})}`,'Address clustering by common-input ownership')}];
  I.p47m7=[{cap:"Dark-web monitoring is one collection discipline inside the intelligence cycle; a finding is only data until analysis attaches meaning and someone acts on the report.",
    svg:cycle([{t:'requirements'},{t:'collection',stroke:CY},{t:'processing'},{t:'analysis',stroke:AM},{t:'dissemination',stroke:MG},{t:'feedback'}],{r:105,label:'The intelligence cycle'})},
   {cap:"Anatomy of an intelligence report a CISO can act on: marking and bottom line first, calibrated judgments, graded sources, reproducible evidence, owned actions, and a methodology line that proves the rules were kept.",
    svg:stack([{t:'TLP marking · BLUF first',stroke:MG},{t:'key judgments with confidence bands',stroke:AM},{t:'source grading (Admiralty A–F / 1–6)'},{t:'evidence: captures, hashes, STIX IOCs',stroke:CY},{t:'actions with owners and dates',stroke:LM},{t:'methodology: public sources only',stroke:DIM}],{w:380,label:'Report structure'})},
   {cap:"Rules of engagement for dark-web research: what you always do and what you never do, regardless of how useful the shortcut looks.",
    svg:compare({t:'ALWAYS',draw:x=>[['written purpose & authorization'],['isolated VM, Safest level'],['capture, hash, timestamp (UTC)'],['legal review before collecting'],['report CSAM, then stop']].map((l,i)=>text(x+130,52+i*28,l[0],{size:10,color:LM})).join('')},{t:'NEVER',draw:x=>[['purchase or pay for access'],['download outside a sandbox'],['test stolen credentials'],['engage or negotiate with actors'],['use personal accounts']].map((l,i)=>text(x+130,52+i*28,l[0],{size:10,color:MG})).join('')},{h:200,label:'Rules of engagement'})}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
