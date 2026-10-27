/* Illustrations — Domain 32: Threat Intelligence, OSINT & Social Engineering Defense, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  /* ================= DOMAIN 32 ================= */
  I.p32m1=[{cap:"The intelligence cycle. Direction sets the requirements, feedback rewrites them; a team that skips direction produces reports nobody asked for.",
    svg:cycle([{t:'planning &\ndirection'},{t:'collection',stroke:CY},{t:'processing',stroke:DIM},{t:'analysis &\nproduction',stroke:MG},{t:'dissemination',stroke:AM},{t:'feedback',stroke:LM}],{label:'The six-stage intelligence cycle'})},
   {cap:"Estimative language maps words to probability bands (ICD 203). Confidence (high, moderate, low) is a separate statement about the quality of the evidence.",
    svg:svg(560,200,`${text(280,22,'WORDS OF ESTIMATIVE PROBABILITY',{bold:true,color:CY,size:11})}
      ${box(20,80,520,30,'',{stroke:DIM,rx:4})}
      <rect x="46" y="80" width="78" height="30" fill="#0b2a3a" stroke="${CY}" rx="2"/><rect x="124" y="80" width="130" height="30" fill="#1a1a2a" stroke="${DIM}" rx="2"/><rect x="254" y="80" width="52" height="30" fill="#2a1f0b" stroke="${AM}" rx="2"/><rect x="306" y="80" width="130" height="30" fill="#1a1a2a" stroke="${DIM}" rx="2"/><rect x="436" y="80" width="78" height="30" fill="#2a0b2a" stroke="${MG}" rx="2"/>
      ${text(85,60,'very unlikely 5–20%',{size:10,color:CY})}${text(280,60,'roughly even 45–55%',{size:10,color:AM})}${text(475,60,'very likely 80–95%',{size:10,color:MG})}
      ${text(189,128,'unlikely 20–45%',{size:10})}${text(371,128,'likely 55–80%',{size:10})}
      ${text(20,152,'almost no chance 1–5%',{size:10,color:DIM,anchor:'start'})}${text(540,152,'almost certain 95–99%',{size:10,color:DIM,anchor:'end'})}
      ${text(280,182,'then, separately: confidence = high / moderate / low (evidence quality)',{size:10,color:LM})}`,'Estimative language probability bands and separate confidence')}];
  I.p32m2=[{cap:"Passive collection reads what third parties already publish; active collection touches the target or its people and needs written authorization. Trace Labs allows only the left column.",
    svg:compare({t:'PASSIVE (view only)',draw:x=>[['search engines, web archives'],['certificate transparency logs'],['Shodan / Censys indexes'],['public filings and records'],['passive DNS history']].map((l,i)=>text(x+130,52+i*26,l[0],{size:10})).join('')},{t:'ACTIVE (needs authorization)',draw:x=>[['port scans, brute force'],['friend requests, messages'],['password resets, logins'],['phone calls, site visits'],['registering a subject\'s email']].map((l,i)=>text(x+130,52+i*26,l[0],{size:10,color:MG})).join('')},{h:190,label:'Passive versus active collection'})},
   {cap:"The legal and ethical lines that sit beside every collection decision, from criminal law down to professional ethics. Public data does not switch any of them off.",
    svg:stack([{t:'CFAA: unauthorized access (Van Buren 2021)',stroke:MG},{t:'stalking and harassment law (Tex. Penal Code 42.07 / 42.072)',stroke:MG},{t:'privacy law: GDPR · CCPA/CPRA · Texas TDPSA (2024) · FCRA',stroke:AM},{t:'platform terms of service: fake accounts, scraping',stroke:AM},{t:'ethics: necessity · proportionality · minimization · no deception',stroke:LM}],{w:500,label:'Legal and ethical lines in OSINT'})},
   {cap:"Analyst OPSEC and evidence as one pipeline: isolation keeps you out of the adversary's logs; capture with timestamps and hashes makes the work reproducible.",
    svg:flow([{t:'research VM\n(snapshot)',stroke:CY},{t:'isolated browser\nprofile'},{t:'VPN / Tor\npath',stroke:DIM},{t:'capture: URL,\nUTC, SHA-256',stroke:AM},{t:'case file +\nAdmiralty grade',stroke:LM}],{label:'OPSEC and evidence pipeline'})}];
  I.p32m3=[{cap:"An attack-surface map is built from passive sources only, deduplicated into an asset table, then handed to an authorized recon phase and to the blue team's reduction backlog.",
    svg:svg(560,250,`${['company filings','WHOIS / RDAP','passive DNS','certificate transparency','Shodan / Censys','public code & buckets'].map((t,i)=>box(15,15+i*36,150,28,t,{size:10,stroke:i===3?CY:DIM})+arrow(165,29+i*36,205,125,'')).join('')}
      ${box(205,95,170,60,'asset table\n(dedupe · first-seen · owner)',{stroke:CY,size:11})}
      ${arrow(375,120,405,80,'')}${arrow(375,130,405,175,'')}
      ${box(405,55,140,50,'authorized pentest\nrecon (Domain 8)',{stroke:MG,size:10})}${box(405,150,140,50,'blue-team reduction\n(Domain 21)',{stroke:LM,size:10})}
      ${text(280,232,'assets, never people · every row carries its source and grade',{size:10,color:DIM})}`,'Attack-surface mapping from passive sources to action')},
   {cap:"The funnel with real numbers from the worked example: certificate entries collapse to unique names, passive DNS adds a few, resolution and scanner review leave a short action list.",
    svg:flow([{t:'134 CT entries',stroke:CY},{t:'41 unique names',edge:'dedupe'},{t:'+7 passive DNS = 48',edge:'union'},{t:'29 resolve today',edge:'resolve (authorized)',stroke:AM},{t:'6 need action',edge:'scanners',stroke:MG}],{bw:120,gap:64,label:'Attack-surface funnel arithmetic'})}];
  I.p32m4=[{cap:"Chronolocation from a shadow: tan(elevation) = height ÷ shadow length. A 2.0 m post with a 2.7 m shadow gives about 36.5°, and SunCalc turns that into a time window for a known date and place.",
    svg:svg(560,220,`${text(280,18,'shadows point away from the sun',{size:10,color:DIM})}
      ${line(40,170,520,170,{sw:1.5})}
      <circle cx="373" cy="42" r="14" fill="${AM}" opacity="0.9"/>${text(373,70,'sun',{size:10,color:AM})}
      ${line(373,42,308,90,{stroke:AM,dash:true})}${line(308,90,200,170,{stroke:AM,dash:true})}
      ${line(308,170,308,90,{stroke:CY,sw:3})}${text(322,130,'h = 2.0 m',{size:11,color:CY,anchor:'start'})}
      ${line(200,170,308,170,{stroke:MG,sw:4})}${text(254,190,'L = 2.7 m (shadow)',{size:11,color:MG})}
      ${text(158,152,'e ≈ 36.5°',{size:11,color:LM})}${line(186,158,198,167,{stroke:LM})}
      ${text(280,212,'tan e = h / L = 2.0 / 2.7 → e ≈ 36.5°  →  SunCalc gives the time window',{size:10,color:LM})}`,'Shadow length geometry for chronolocation')},
   {cap:"The verification workflow for any image or video: provenance first, then metadata, scene clues from coarse to fine, the sun as a clock, and a judgment stated with confidence.",
    svg:flow([{t:'reverse image\nsearch',stroke:CY},{t:'EXIF /\nmetadata'},{t:'scene clues\ncoarse → fine',stroke:AM},{t:'shadows +\nSunCalc',stroke:LM},{t:'corroborate &\nstate confidence',stroke:MG}],{label:'Image verification workflow'})}];
  I.p32m5=[{cap:"The Pyramid of Pain (Bianco, 2013): the higher the indicator type you detect, the more it costs the adversary to adapt. Hash-only defenses live at the bottom.",
    svg:pyramid([{t:'TTPs — tough',color:MG},{t:'tools — challenging',color:AM},{t:'network/host artifacts — annoying'},{t:'domain names — simple'},{t:'IP addresses — easy',color:DIM},{t:'hash values — trivial',color:DIM}],{label:'The Pyramid of Pain'})},
   {cap:"The Diamond Model: every intrusion event has an adversary using a capability over infrastructure against a victim; the edges are the analyst's pivots and the meta-features describe the event.",
    svg:svg(560,230,`${box(220,10,120,32,'adversary',{stroke:MG,bold:true})}${box(420,99,130,32,'capability',{stroke:AM,bold:true})}${box(220,188,120,32,'victim',{stroke:CY,bold:true})}${box(10,99,140,32,'infrastructure',{stroke:LM,bold:true})}
      ${line(280,42,420,115)}${line(420,115,280,188)}${line(280,188,150,115)}${line(150,115,280,42)}
      ${text(405,55,'develops / uses',{size:9,color:DIM})}${text(405,178,'exploits',{size:9,color:DIM})}${text(158,178,'connects to',{size:9,color:DIM})}${text(158,55,'operates',{size:9,color:DIM})}
      ${text(285,100,'meta-features:',{size:9,color:DIM,bold:true})}${text(285,114,'timestamp · phase · result',{size:9,color:DIM})}${text(285,128,'direction · methodology · resources',{size:9,color:DIM})}`,'The Diamond Model of intrusion analysis')},
   {cap:"How intelligence moves: a report becomes STIX 2.1 objects, travels over a TAXII 2.1 collection into MISP or OpenCTI, and ends as detections and hunts in the SIEM.",
    svg:flow([{t:'vendor report\n(mapped to ATT&CK)',stroke:DIM},{t:'STIX 2.1 bundle\n(indicator, malware…)',stroke:CY},{t:'TAXII 2.1\ncollection',stroke:AM},{t:'MISP / OpenCTI\nevent + galaxies',stroke:LM},{t:'SIEM detections\n& hunts',stroke:MG}],{bw:124,label:'STIX, TAXII and the platforms'})}];
  I.p32m6=[{cap:"The fraud signature: authority plus urgency plus a deviation from process. The defense is a protocol, not vigilance: call back on a number already on file, require two approvers, and allow no urgency exception.",
    svg:svg(560,200,`${box(20,30,160,50,'authority\n(CEO, IT, auditor)',{stroke:MG,size:11})}${text(190,55,'+',{size:18,bold:true})}${box(200,30,160,50,'urgency\n(deadline, fear)',{stroke:MG,size:11})}${text(370,55,'+',{size:18,bold:true})}${box(380,30,160,50,'process deviation\n(new account, skip a step)',{stroke:MG,size:11})}
      ${arrow(280,80,280,110,'')}
      ${box(90,110,380,50,'STOP: call back on a number already on file',{stroke:LM,size:12,bold:true})}
      ${text(280,185,'dual authorization above a threshold · no urgency exception, ever',{size:10,color:AM})}`,'The business email compromise signature and the protocol that defeats it')},
   {cap:"What a working program changes in a year. Click rate moves, but the numbers that defend the organization are report rate, time-to-report, and credentials that no longer work when stolen.",
    svg:compare({t:'BASELINE (month 0)',draw:x=>[['click rate 34%'],['submitted credentials 11%'],['report rate 6%'],['median time-to-report 3 h 40 min'],['passwords + SMS codes']].map((l,i)=>text(x+130,52+i*26,l[0],{size:10,color:i===4?DIM:'currentColor'})).join('')},{t:'MONTH 12',draw:x=>[['click rate 7%'],['submitted credentials 1%'],['report rate 48%'],['median time-to-report 9 min'],['passkeys · DMARC p=reject']].map((l,i)=>text(x+130,52+i*26,l[0],{size:10,color:i>=2?LM:'currentColor'})).join('')},{h:190,label:'Awareness program metrics before and after'})}];
  I.p32m7=[{cap:"The intelligence report, top to bottom. The reader who stops after the first block still knows the judgment, how sure you are, and what to do.",
    svg:stack([{t:'BLUF: judgment · confidence · recommended action',stroke:CY,bold:true},{t:'key judgments with estimative language',stroke:CY},{t:'scope and requirement (which PIR, what window)'},{t:'analysis: evidence, ACH alternatives, change triggers',stroke:AM},{t:'sourcing: every claim with an Admiralty grade',stroke:AM},{t:'recommendations: owner · date · cost',stroke:LM},{t:'appendices: STIX / MISP export · ATT&CK map · TLP label',stroke:DIM}],{w:500,label:'Structure of an intelligence report'})},
   {cap:"The credential ladder with honest prices (October 2026). The GOSI exam is affordable on its own; the SANS course is optional and costs nearly nine times more.",
    svg:flow([{t:'free badges\nOSINT Dojo · Trace Labs',stroke:LM},{t:'PORP · $399\n72-h practical + report',stroke:CY},{t:'CTIA · ~$550\n312-85 · 50 questions',stroke:AM},{t:'GOSI · $999\n75 q · 2 h · 69%\nSEC497 optional $8,780',stroke:MG}],{perRow:2,bw:240,bh:72,gap:40,label:'OSINT and threat-intelligence credential ladder'})}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
