/* Third figures — Domain 32: Threat Intelligence, OSINT & Social Engineering Defense. Adds to the figures in illus_p32.js (never replaces them). */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const add=(id,figs)=>{ window.ILLUS=window.ILLUS||{}; window.ILLUS[id]=(window.ILLUS[id]||[]).concat(figs); };

  /* m1 — the ACH matrix from the worked example (VPN login at 03:10) */
  const ev=[['E1 password in breach corpus','CNI'],['E2 firmware was current','NIN'],['E3 employee asleep at home','CNI'],['E4 never-seen fingerprint','CCI'],['E5 no exploit artifacts','NIN']];
  const cc={C:LM,I:MG,N:DIM}, HX=[228,318,408];
  add('p32m1',[{cap:"Analysis of Competing Hypotheses on the VPN-login example: mark every piece of evidence against every hypothesis, then count inconsistencies. H1 (stolen credential) has none, H2 has two, H3 has three. You reject the hypotheses with the most inconsistencies; consistent evidence is cheap because it fits several stories.",
    svg:svg(560,264,`${text(280,16,'ACH: reject the hypotheses with the most inconsistencies',{color:CY,bold:true,size:11})}
      ${text(30,47,'evidence',{anchor:'start',size:10,color:DIM})}
      ${['H1 stolen\ncredential','H2 appliance\nexploit','H3 employee\ntraveling'].map((h,i)=>box(HX[i],32,84,30,h,{stroke:CY,size:10})).join('')}
      ${ev.map((e,r)=>{ const y=68+r*28; return text(30,y+12,e[0],{anchor:'start',size:10})+e[1].split('').map((c,i)=>box(HX[i],y,84,24,c,{stroke:cc[c],color:cc[c],bold:true,size:11,rx:3})).join(''); }).join('')}
      ${text(30,223,'inconsistent (I) count',{anchor:'start',size:10,color:AM})}
      ${box(HX[0],210,84,26,'I = 0',{stroke:LM,color:LM,bold:true,size:11})}${box(HX[1],210,84,26,'I = 2',{stroke:AM,color:AM,bold:true,size:11})}${box(HX[2],210,84,26,'I = 3',{stroke:MG,color:MG,bold:true,size:11})}
      ${text(280,252,'judgment: H1 very likely (high confidence) · C consistent · N neutral',{color:LM,size:10})}`,
      'ACH matrix of five pieces of evidence against three hypotheses with inconsistency counts')}]);

  /* m2 — the collection gate: four questions before anything is collected */
  const Q=[['target in bounds? your footprint,\na fictional persona, a scoped asset','never a private individual',MG],
           ['publicly available? no login,\nno deception, nothing stolen','not open source: stop',MG],
           ['needed for the PIR, and\nproportionate to the harm?','do not collect it',MG],
           ['passive only? no contact\nwith the subject or family','active: needs written\nauthorization (RoE)',AM]];
  add('p32m2',[{cap:"Every collection decision passes four questions in order: is the target in bounds, is the data lawfully public, is it necessary and proportionate, and can it be gathered passively. Only then do you collect the minimum and log it with URL, UTC time and hash.",
    svg:svg(560,292,`${text(280,16,'Before you collect: four questions, in order',{color:CY,bold:true,size:11})}
      ${Q.map((q,i)=>{ const y=30+i*56; return box(16,y,250,38,q[0],{stroke:CY,size:10})+arrow(266,y+19,330,y+19,'no',{color:MG})+box(330,y,214,38,q[1],{stroke:q[2],color:q[2],size:10})+arrow(141,y+38,141,y+56,'')+text(150,y+47,'yes',{anchor:'start',size:9,color:LM}); }).join('')}
      ${box(16,254,528,32,'collect the least · capture URL, UTC, SHA-256 · grade the source',{stroke:LM,color:LM,size:10})}`,
      'Four ordered questions that gate any OSINT collection')}]);

  /* m3 — the defender's half of the attack-surface map */
  const fx=[['unknown subdomains (CT)','reconcile with the inventory;\ndecommission or monitor'],['exposed management service','firewall it, VPN or zero trust, patch'],['secret in a public repo','rotate the key; secret scanning,\npre-commit hooks'],
            ['corporate emails in breaches','forced resets,\nphishing-resistant MFA'],['job posting names the stack','generic skill wording;\nassume the stack is known']];
  add('p32m3',[{cap:"The blue-team column of the map: every class of finding has a specific reduction, and re-running the same passive map every 90 days turns the work into a metric, the count of unexpected internet-facing assets driven toward zero.",
    svg:svg(560,262,`${text(280,16,'The defender\'s half of the map: each finding has a fix',{color:CY,bold:true,size:11})}
      ${text(116,34,'finding (passive)',{size:10,color:CY,bold:true})}${text(403,34,'blue-team reduction',{size:10,color:LM,bold:true})}
      ${fx.map((f,i)=>{ const y=44+i*36; return box(16,y,200,30,f[0],{stroke:CY,size:10})+arrow(216,y+15,262,y+15,'')+box(262,y,282,30,f[1],{stroke:LM,size:10}); }).join('')}
      ${box(16,228,528,28,'re-run the map every 90 days · unexpected assets: 6 → 0',{stroke:AM,color:AM,size:10})}`,
      'Attack-surface findings mapped to blue-team reductions and a quarterly metric')}]);

  /* m4 — geolocation from coarse to fine, confirmed by independent features */
  add('p32m4',[{cap:"Geolocation narrows from country to district to the exact spot, and a location counts as confirmed only when several independent features agree and none contradicts. In the flooded-underpass example the mural, the lane count and the green footbridge all match. EXIF GPS, when present, is a lead to corroborate, never a conclusion.",
    svg:svg(560,254,`${text(280,16,'Geolocate coarse to fine; confirm with independent features',{color:CY,bold:true,size:11})}
      ${box(16,30,300,46,'country / region: script, road\nmarkings, plates, traffic side',{stroke:CY,size:10})}
      ${arrow(166,76,166,84,'')}${box(46,84,240,44,'district: roofline, stadium,\nwater, hill profile',{stroke:AM,size:10})}
      ${arrow(166,128,166,136,'')}${box(76,136,180,44,'exact spot: satellite +\nstreet-level match',{stroke:LM,size:10})}
      ${text(440,38,'the underpass photo',{color:CY,bold:true,size:10})}
      ${[['mural (Google Lens): agrees',LM],['lane count (Street View): agrees',LM],['green footbridge: agrees',LM],['contradicting features: 0',AM]].map((r,i)=>box(336,50+i*32,208,26,r[0],{stroke:r[1],size:10,rx:4})).join('')}
      ${arrow(166,180,166,194,'')}${arrow(440,176,440,194,'')}
      ${box(16,196,528,32,'several independent features agree, none contradicts → confirmed',{stroke:LM,color:LM,size:10})}
      ${text(280,244,'EXIF GPS is a lead to corroborate, never a conclusion',{color:DIM,size:10})}`,
      'Coarse-to-fine geolocation and the confirmation rule applied to an example photo')}]);

  /* m5 — feed quality arithmetic: relevance filtering by requirement */
  add('p32m5',[{cap:"Feed quality is arithmetic. 50,000 indicators a day at a 2% false-positive rate yields about 1,000 false alerts daily, more than a small SOC can work; the same feed filtered to the 500 indicators relevant to your PIRs yields about 10.",
    svg:svg(560,232,`${text(280,16,'A feed is only as good as its relevance filter',{color:CY,bold:true,size:11})}
      ${box(16,36,150,48,'raw feed\n50,000 IOCs / day',{stroke:DIM,size:11})}${arrow(166,60,212,60,'')}
      ${box(212,36,150,48,'× 2% false\npositives',{stroke:AM,size:11})}${arrow(362,60,408,60,'')}
      ${box(408,36,136,48,'≈ 1,000 false\nalerts a day',{stroke:MG,color:MG,bold:true,size:11})}
      ${text(280,102,'more than a small SOC\'s total capacity',{color:MG,size:10})}
      ${box(16,120,150,48,'filtered to PIRs\n500 IOCs / day',{stroke:CY,size:11})}${arrow(166,144,212,144,'')}
      ${box(212,120,150,48,'× 2% false\npositives',{stroke:AM,size:11})}${arrow(362,144,408,144,'')}
      ${box(408,120,136,48,'≈ 10 false\nalerts a day',{stroke:LM,color:LM,bold:true,size:11})}
      ${box(16,190,528,30,'measure every feed: timeliness · uniqueness · context · false-positive rate',{stroke:DIM,size:10})}`,
      'False-alert arithmetic for a raw feed versus a feed filtered by requirement')}]);

  /* m6 — the report button and the SOC's race against the long tail */
  const T=h=>40+h*120;
  add('p32m6',[{cap:"What the report button buys: early reporters let the SOC confirm a real campaign and pull it from every inbox before most people open it. In the worked example the median time-to-report fell from 3 hours 40 minutes to 9 minutes and the report rate rose from 6% to 48%.",
    svg:svg(560,250,`${text(280,16,'Report button to quarantine: the race the SOC must win',{color:CY,bold:true,size:11})}
      ${box(16,32,112,46,'real phish\ndelivered',{stroke:MG,size:10})}${arrow(128,55,150,55,'')}
      ${box(150,32,112,46,'one-click\nreport button',{stroke:CY,size:10})}${arrow(262,55,284,55,'')}
      ${box(284,32,120,46,'SOC triage:\nreal campaign?',{stroke:AM,size:10})}${arrow(404,55,426,55,'')}
      ${box(426,32,118,46,'pull it from\nevery inbox',{stroke:LM,color:LM,size:10})}
      ${line(206,78,206,94,{stroke:DIM})}${box(150,94,112,34,'thank-you reply\nwithin an hour',{stroke:DIM,size:10})}
      ${line(485,78,485,94,{stroke:DIM})}${box(426,94,118,34,'FIDO2: stolen\npasswords fail',{stroke:DIM,size:10})}
      ${line(T(0),190,T(4),190,{sw:1.5})}
      ${[0,1,2,3,4].map(h=>line(T(h),186,T(h),194)+text(T(h),204,h+' h',{size:9,color:DIM})).join('')}
      ${line(T(0.15),190,T(0.15),160,{stroke:LM,sw:2})}${text(T(0.15)+8,160,'after: median report in 9 min',{anchor:'start',size:10,color:LM})}
      ${line(T(3.667),190,T(3.667),160,{stroke:MG,sw:2})}${text(T(3.667)-8,160,'before: 3 h 40 min',{anchor:'end',size:10,color:MG})}
      ${text(280,226,'report rate 6% → 48% · the SOC pulls it before most open it',{color:AM,size:10})}`,
      'Phishing report triage flow and median time-to-report before and after a program')}]);

  /* m7 — TLP 2.0 as nested audiences */
  add('p32m7',[{cap:"TLP 2.0 markings as nested circles of readers: RED for named recipients only, AMBER+STRICT for your organization alone, AMBER for the organization and its clients on a need-to-know basis, GREEN for the community, CLEAR for anyone. Mark the whole document before it leaves your hands.",
    svg:svg(560,248,`${text(280,16,'TLP 2.0: each marking draws a wider circle of readers',{color:CY,bold:true,size:11})}
      ${box(16,28,340,212,'',{stroke:DIM})}${text(28,41,'TLP:CLEAR · unlimited release',{anchor:'start',size:10,color:DIM})}
      ${box(32,52,308,180,'',{stroke:LM})}${text(44,65,'TLP:GREEN · the community',{anchor:'start',size:10,color:LM})}
      ${box(48,76,276,148,'',{stroke:AM})}${text(60,89,'TLP:AMBER · org + clients,',{anchor:'start',size:10,color:AM})}${text(60,102,'need to know',{anchor:'start',size:10,color:AM})}
      ${box(64,114,244,102,'',{stroke:AM,dash:true})}${text(76,127,'TLP:AMBER+STRICT · org only',{anchor:'start',size:10,color:AM})}
      ${box(80,140,212,66,'TLP:RED\nnamed recipients only',{stroke:MG,color:MG,bold:true,size:11})}
      ${box(376,28,168,58,'mark the whole\ndocument',{stroke:CY,size:10})}
      ${box(376,104,168,58,'budget memo:\nTLP:AMBER+STRICT',{stroke:AM,size:10})}
      ${box(376,180,168,58,'MISP event tag:\ntlp:amber',{stroke:AM,size:10})}`,
      'TLP 2.0 markings drawn as nested audiences with example uses')}]);
})();
