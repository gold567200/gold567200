/* Third figures — Domain 21: Blue Team: SOC Operations, Incident Response & Digital Forensics. Adds to the figures in illus_p21.js (never replaces them). */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const add=(id,figs)=>{ window.ILLUS=window.ILLUS||{}; window.ILLUS[id]=(window.ILLUS[id]||[]).concat(figs); };
  const dot=(x,y,r,c,op)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${op?'opacity="'+op+'"':''}/>`;

  /* m1 — rule precision and alert fatigue */
  const grid=()=>{ let s=''; for(let r=0;r<10;r++) for(let c=0;c<20;c++){ const real=(r===3&&c===7)||(r===8&&c===15); s+=real?dot(20+c*11,40+r*11,4.5,MG):dot(20+c*11,40+r*11,3,DIM,0.55); } return s; };
  add('p21m1',[{cap:"Why rule precision matters more than alert volume. A rule that fires 200 times a day for 2 real incidents has 1% precision and, at five minutes of triage each, burns 16.7 analyst-hours a day; tuning, enrichment and risk-based alerting (signals add up per host or user, and only the sum pages a human) are the cures.",
    svg:svg(560,218,`${text(125,20,'200 alerts a day · 2 real',{bold:true,color:CY,size:11})}${grid()}
      ${text(400,40,'precision = 2 ÷ 200 = 1%',{size:12,bold:true,color:MG})}
      ${text(400,66,'200 alerts × 5 min triage',{size:10})}
      ${text(400,84,'= 16.7 analyst-hours a day',{size:11,bold:true,color:AM})}
      ${text(400,104,'to find two real events',{size:9,color:DIM})}
      ${text(400,126,'across 100 rules: alert fatigue',{size:9,color:DIM})}
      ${text(280,154,'cures for alert fatigue',{bold:true,size:10,color:LM})}
      ${box(10,166,170,44,'tuning\nallowlist the known-good',{stroke:LM,size:10})}
      ${box(195,166,170,44,'enrichment\nowner · role · reputation',{stroke:LM,size:10})}
      ${box(380,166,170,44,'risk-based alerting\nonly the sum pages',{stroke:LM,size:10})}`,
      'Two true alerts among two hundred, the precision and analyst-time arithmetic, and the three cures')}]);

  /* m2 — four searches scope a compromised account */
  const srow=(y,q,f,c)=>box(10,y,230,44,q,{stroke:CY,size:10})+arrow(240,y+22,290,y+22,'')+box(290,y,260,44,f,{stroke:c,size:10});
  add('p21m2',[{cap:"Scoping a compromised account with four searches. Logons by source and type give the scope, the failure timechart shows the password spray that landed, Sysmon process events on the nine servers reveal ransomware staging, and Zeek's conn.log shows the 4.1 GB upload — twenty minutes from one alert to initial access, scope, intent and exfiltration.",
    svg:svg(560,236,`${text(125,12,'SEARCH',{bold:true,color:CY,size:10})}${text(420,12,'WHAT IT ESTABLISHES',{bold:true,color:LM,size:10})}
      ${srow(24,'4624 for jsmith\nby src, LogonType, host','23 type-3 logons to 9 servers\n→ scope',LM)}
      ${srow(76,'4625 from 10.0.2.15\ntimechart span=1m','312 failures, 02:31–02:46\n→ initial access: a spray',AM)}
      ${srow(128,'Sysmon Event 1\non those 9 servers','recon, then vssadmin\n→ intent: ransomware staging',MG)}
      ${srow(180,'Zeek conn.log\nfrom 10.0.2.15','4.1 GB out over 443, 03:10\n→ exfiltration',MG)}`,
      'Four log searches and the scope, initial access, intent and exfiltration each one establishes')}]);

  /* m3 — short-term containment decision */
  add('p21m3',[{cap:"Short-term containment stops the bleeding without destroying the scene. Normally isolate the host through EDR so it keeps running, capture memory first by the order of volatility, then disable the account, revoke its sessions and tokens and sinkhole the C2 domain. Only active encryption of shared storage justifies isolating the segment at once, and pulling the power is the last choice because it destroys RAM.",
    svg:svg(560,256,`${box(170,6,220,32,'compromise confirmed on a host',{stroke:CY,size:11})}${arrow(280,38,280,60,'')}
      ${box(140,60,280,40,'ransomware encrypting shared storage now?',{stroke:AM,size:10})}
      ${arrow(180,100,105,138,'yes')}${arrow(420,82,470,122,'no')}
      ${box(10,138,190,48,'isolate the segment now\nbeats a perfect memory image',{stroke:MG,size:10})}
      ${box(10,200,190,40,'power off: last choice\nit destroys RAM',{stroke:DIM,dash:true,size:10})}
      ${box(330,122,220,34,'EDR network isolation\nhost and memory stay live',{stroke:LM,size:10})}${arrow(440,156,440,168,'')}
      ${box(330,168,220,34,'capture memory first\norder of volatility',{stroke:LM,size:10})}${arrow(440,202,440,214,'')}
      ${box(330,214,220,34,'disable account, revoke tokens,\nsinkhole the C2 domain',{stroke:LM,size:10})}
      ${text(265,176,'then: eradicate,',{size:9,color:DIM})}${text(265,189,'rebuild from',{size:9,color:DIM})}${text(265,202,'known-good image',{size:9,color:DIM})}`,
      'Containment decision: isolate the segment for active encryption, otherwise isolate the host, capture memory and cut access')}]);

  /* m4 — order of volatility */
  const ov=[['CPU registers and cache',MG,'most perishable'],['memory · routing/ARP · processes',MG,'RAM before power-off;\nnetwork state before isolation'],['temporary file systems',AM,''],['disk',AM,'image disks before rebuild'],['remote logs',CY,''],['physical configuration',CY,''],['archival media',DIM,'least perishable']];
  add('p21m4',[{cap:"Collect in the order of volatility (RFC 3227): the most perishable evidence first. In practice that means memory before you pull power, network state before you isolate, and disk images before you rebuild.",
    svg:svg(560,240,`${text(30,12,'first',{size:9,bold:true,color:MG})}${arrow(30,20,30,222,'')}${text(30,234,'last',{size:9,bold:true,color:DIM})}
      ${ov.map(([t,c,s],i)=>box(50,8+i*32,300,26,t,{stroke:c,size:11})+(s?text(366,21+i*32,s,{anchor:'start',size:9,color:DIM,lh:11}):'')).join('')}`,
      'Order of volatility from CPU registers down to archival media')}]);

  /* m5 — beacon regularity as a hunting signal */
  const gaps=[60,57,63,55,66,59,61,54,64,58];
  const ticks=(arr,y,c)=>{ let x=60, s=line(x,y-8,x,y+8,{stroke:c,sw:2}); arr.forEach(g=>{ x+=g*0.8; s+=line(x,y-8,x,y+8,{stroke:c,sw:2}); }); return s; };
  add('p21m5',[{cap:"Beacon hunting turns timing into a detection. A 60-second beacon with 10% jitter arrives every 54–66 s, so the spread of its inter-arrival times is tiny next to ordinary traffic; the hunt flags source–destination pairs with more than 50 connections whose standard deviation is under 15% of the mean.",
    svg:svg(560,216,`${text(280,12,'Hunting beacons: regularity is the signal',{bold:true,color:CY,size:11})}
      ${text(30,52,'beacon',{size:10,color:CY})}${line(60,52,540,52,{stroke:DIM})}${ticks(gaps,52,CY)}
      ${text(300,74,'gaps 54–66 s · small spread',{size:10,color:CY})}
      ${text(30,112,'normal',{size:10,color:DIM})}${line(60,112,540,112,{stroke:DIM})}${ticks([7,95,20,4,160,35,12,140,22],112,DIM)}
      ${text(300,134,'gaps vary widely',{size:10,color:DIM})}
      ${box(60,150,480,30,'flag: count > 50 and sd < 0.15 × mean',{stroke:AM,size:11,mono:true})}
      ${text(300,200,'beacon behavior maps to ATT&CK T1071.001',{size:9,color:DIM})}`,
      'Regular beacon timing compared with irregular normal traffic, and the low-variance hunting rule')}]);

  /* m6 — same CVSS, different priority */
  const vrow=(x,y,k,v,c)=>text(x+16,y,k,{anchor:'start',size:10,color:DIM})+text(x+244,y,v,{anchor:'end',size:11,bold:true,color:c});
  add('p21m6',[{cap:"Two findings with the same CVSS 9.8 get opposite treatment. The VPN appliance is in KEV, has an EPSS of 0.94, a public exploit and faces the internet: emergency change tonight. The print server has an EPSS of 0.02, no KEV entry and sits on the print VLAN: a 30-day ticket. CVSS measures severity, not likelihood.",
    svg:svg(560,236,`${box(10,8,260,160,'',{dash:true,stroke:DIM})}${box(290,8,260,160,'',{dash:true,stroke:DIM})}
      ${text(140,26,'VPN appliance',{bold:true,color:MG,size:11})}${text(420,26,'internal print server',{bold:true,color:CY,size:11})}
      ${vrow(10,52,'CVSS','9.8','currentColor')}${vrow(10,76,'EPSS (30 days)','0.94',MG)}${vrow(10,100,'in KEV','yes, since Friday',MG)}${vrow(10,124,'reachable from','the internet',MG)}${vrow(10,148,'public exploit','yes',MG)}
      ${vrow(290,52,'CVSS','9.8','currentColor')}${vrow(290,76,'EPSS (30 days)','0.02',LM)}${vrow(290,100,'in KEV','no',LM)}${vrow(290,124,'reachable from','print VLAN only',LM)}${vrow(290,148,'public exploit','no',LM)}
      ${box(10,180,260,34,'Act: emergency change tonight',{stroke:MG,size:10,bold:true})}
      ${box(290,180,260,34,'30-day SLA, ticket to the owner',{stroke:CY,size:10,bold:true})}
      ${text(280,228,'CVSS = severity, not likelihood or your risk',{size:10,color:AM})}`,
      'Two CVSS 9.8 findings prioritized differently by KEV, EPSS and exposure')}]);

  /* m7 — backups as a security control, and the RTO arithmetic */
  const tile=(x,n,t,c)=>box(x,26,100,58,'',{stroke:c})+text(x+50,42,n,{size:20,bold:true,color:c})+text(x+50,62,t,{size:10,lh:12});
  add('p21m7',[{cap:"Backups are a security control with their own threat model: 3 copies on 2 media, 1 off-site, 1 offline or immutable, and 0 errors on a real restore test. The RTO arithmetic decides the design — 40 TB in 8 hours needs about 11.1 Gbps, while a single 1 Gbps stream takes 89 hours.",
    svg:svg(560,222,`${text(280,12,'3-2-1-1-0: backups as a security control',{bold:true,color:CY,size:11})}
      ${tile(10,'3','copies',CY)}${tile(120,'2','media',CY)}${tile(230,'1','off-site',CY)}${tile(340,'1','offline or\nimmutable',LM)}${tile(450,'0','restore-test\nerrors',AM)}
      ${text(280,102,'backup console: its own credentials + MFA',{size:9,color:DIM})}
      ${box(10,120,160,50,'restore 40 TB\nRTO 8 hours',{stroke:CY,size:11})}${arrow(170,145,220,145,'needs')}
      ${box(220,120,150,50,'5 TB/h\n≈ 11.1 Gbps',{stroke:AM,size:11,bold:true})}${arrow(370,145,410,145,'vs')}
      ${box(410,120,140,50,'one 1 Gbps stream\n89 hours',{stroke:MG,size:11})}
      ${text(280,192,'→ local immutable copy or parallel streams',{size:10,color:LM})}
      ${text(280,210,'test restores monthly, not dashboards',{size:9,color:DIM})}`,
      'The 3-2-1-1-0 backup rule and the bandwidth needed to meet an 8-hour recovery time objective')}]);
})();
