/* Illustrations — Domain 7: Cybersecurity: Defensive Foundations (deepened October 2026).
   Concatenates onto the original p7 figures defined in illus_more.js; built with the kit in illus_core.js. */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const E=window.ILLUS||{}; const I={};
  const rect=(x,y,w,h,o={})=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx==null?3:o.rx}" fill="${o.fill||'none'}" ${o.op!=null?`fill-opacity="${o.op}"`:''} stroke="${o.stroke||'currentColor'}" stroke-width="${o.sw||1.2}" ${o.dash?'stroke-dasharray="4 3"':''}/>`;
  const dot=(cx,cy,r,o={})=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${o.fill||'none'}" ${o.op!=null?`fill-opacity="${o.op}"`:''} stroke="${o.stroke||'currentColor'}" stroke-width="${o.sw||1.4}" ${o.dash?'stroke-dasharray="3 2"':''}/>`;

  /* ---------- Module 1: risk register and ALE ---------- */
  const heat=()=>{ let s=''; for(let L=1;L<=5;L++) for(let Im=1;Im<=5;Im++){ const sc=L*Im, x=60+(L-1)*40, y=20+(5-Im)*40; const c=sc>=15?MG:sc>=8?AM:LM; s+=rect(x,y,40,40,{fill:c,op:sc>=15?0.28:sc>=8?0.2:0.12,stroke:DIM,rx:0,sw:0.6}); } return s; };
  I.p7m1=(E.p7m1||[]).concat([
   {cap:"A risk register on a 5 × 5 heat map: likelihood × impact orders the work. Exposed RDP (R1, 4 × 5 = 20) is fixed first and drops to 1 × 5 = 5 once remote access moves behind MFA; the UPS risk (R5, 6) waits.",
    svg:svg(560,262,`${heat()}
      ${[1,2,3,4,5].map(i=>text(40+i*40,234,String(i),{size:10,color:DIM})).join('')}${text(160,252,'likelihood →',{size:11,color:DIM})}
      ${[1,2,3,4,5].map(i=>text(50,240-i*40,String(i),{size:10,color:DIM})).join('')}${text(24,120,'impact',{size:11,color:DIM})}
      ${dot(200,40,12,{fill:MG,op:0.35,stroke:MG})}${text(200,40,'R1',{size:10,bold:true})}
      ${dot(200,80,12,{stroke:MG})}${text(200,80,'R2',{size:10,bold:true})}
      ${dot(160,40,12,{stroke:MG})}${text(160,40,'R3',{size:10,bold:true})}
      ${dot(160,80,12,{stroke:AM})}${text(160,80,'R4',{size:10,bold:true})}
      ${dot(120,120,12,{stroke:LM})}${text(120,120,'R5',{size:10,bold:true})}
      ${dot(80,40,12,{stroke:LM,dash:true})}${text(80,40,'R1′',{size:10,bold:true,color:LM})}
      <path d="M200 27 L200 10 L80 10 L80 25" fill="none" stroke="${LM}" stroke-width="1.3" stroke-dasharray="4 3" marker-end="url(#ah)"/>
      ${text(290,24,'Register: L × I → residual',{anchor:'start',bold:true,size:12})}
      ${text(290,50,'R1 exposed RDP · 4×5 = 20 → 5',{anchor:'start',size:11})}
      ${text(290,72,'R2 email, no MFA · 16 → 8',{anchor:'start',size:11})}
      ${text(290,94,'R3 USB-disk backup · 15 → 6',{anchor:'start',size:11})}
      ${text(290,116,'R4 unencrypted laptop · 12 → 3',{anchor:'start',size:11})}
      ${text(290,138,'R5 no UPS · 6 → 3',{anchor:'start',size:11})}
      ${rect(290,170,14,12,{fill:MG,op:0.3,stroke:DIM})}${text(310,176,'high 15–25: within 30 days',{anchor:'start',size:10})}
      ${rect(290,192,14,12,{fill:AM,op:0.25,stroke:DIM})}${text(310,198,'medium 8–14: this quarter',{anchor:'start',size:10})}
      ${rect(290,214,14,12,{fill:LM,op:0.18,stroke:DIM})}${text(310,220,'low 1–7: accept or schedule',{anchor:'start',size:10})}`,'Five-by-five risk heat map with five plotted risks and the register beside it')},
   {cap:"Quantitative risk in one picture: SLE = asset value × exposure factor, ALE = SLE × ARO. A $2,400-a-year control that cuts ALE from $10,000 to $400 is worth $7,200 a year — that is the sentence that gets a budget approved.",
    svg:svg(560,215,`${rect(10,10,260,160,{stroke:DIM,dash:true,rx:6})}${rect(290,10,260,160,{stroke:DIM,dash:true,rx:6})}
      ${text(140,28,'BEFORE',{bold:true,color:MG})}${text(420,28,'WITH EDR + IMMUTABLE BACKUP',{bold:true,color:LM,size:11})}
      ${text(140,58,'AV $80,000 × EF 0.5',{size:12})}${text(140,80,'SLE = $40,000',{size:12,bold:true})}
      ${text(140,108,'× ARO 0.25 (1 in 4 yr)',{size:11,color:DIM})}${text(140,138,'ALE = $10,000 / yr',{size:14,bold:true,color:MG})}
      ${text(420,58,'AV $80,000 × EF 0.1',{size:12})}${text(420,80,'SLE = $8,000',{size:12,bold:true})}
      ${text(420,108,'× ARO 0.05 (1 in 20 yr)',{size:11,color:DIM})}${text(420,138,'ALE = $400 / yr',{size:14,bold:true,color:LM})}
      ${text(420,158,'control costs $2,400 / yr',{size:10,color:DIM})}
      ${text(280,196,'benefit = 10,000 − 400 − 2,400 = $7,200 / yr',{size:12,bold:true,color:LM})}`,'Annualized loss expectancy before and after a control')}
  ]);

  /* ---------- Module 2: TLS 1.3, certificate chain, lifetimes ---------- */
  I.p7m2=(E.p7m2||[]).concat([
   {cap:"The TLS 1.3 handshake in one round trip. Both sides send ephemeral key shares, so session keys are derived without ever crossing the wire (forward secrecy). The server proves it owns the certificate by signing the handshake transcript (CertificateVerify). Everything in braces is already encrypted.",
    svg:svg(560,250,`${text(80,16,'client (browser)',{bold:true,color:CY})}${text(480,16,'server (portal)',{bold:true,color:MG})}
      ${line(80,26,80,212,{dash:true,stroke:DIM})}${line(480,26,480,212,{dash:true,stroke:DIM})}
      ${arrow(82,48,478,48,'ClientHello + X25519 key share',{color:CY})}
      ${arrow(478,82,82,82,'ServerHello + key share',{color:MG})}
      ${arrow(478,112,82,112,'{Certificate chain}',{color:MG})}
      ${arrow(478,142,82,142,'{CertificateVerify: signature}',{color:MG})}
      ${arrow(478,172,82,172,'{Finished: MAC}',{color:MG})}
      ${arrow(82,202,478,202,'{Finished} then app data',{color:LM})}
      ${text(280,232,'1 RTT · ephemeral keys · AES-GCM records',{size:11,color:AM})}`,'TLS 1.3 handshake message ladder')},
   {cap:"How a client validates a certificate: every signature must chain to a root in its trust store, the dates must be current, the hostname must be a SAN entry, and it must not be revoked. If the server forgets to send the intermediate, desktop browsers may cope while phones and API clients fail.",
    svg:svg(560,230,`${box(20,15,210,50,'Root CA\nin OS/browser trust store',{stroke:CY,size:11})}
      ${box(20,85,210,50,'Intermediate CA\nsent by the server',{stroke:AM,size:11})}
      ${box(20,155,210,50,'Leaf: portal.example.com\nSAN list · 200-day validity',{stroke:LM,size:11})}
      ${arrow(125,155,125,137,'')}${arrow(125,85,125,67,'')}
      ${text(136,146,'signed by',{anchor:'start',size:10,color:DIM})}${text(136,76,'signed by',{anchor:'start',size:10,color:DIM})}
      ${text(270,28,'Client accepts only if:',{anchor:'start',bold:true,size:12})}
      ${text(270,58,'✓ signatures chain to trusted root',{anchor:'start',size:11})}
      ${text(270,82,'✓ current time inside validity',{anchor:'start',size:11})}
      ${text(270,106,'✓ hostname matches a SAN',{anchor:'start',size:11})}
      ${text(270,130,'✓ key usage allows server auth',{anchor:'start',size:11})}
      ${text(270,154,'✓ not revoked (CRL, OCSP)',{anchor:'start',size:11})}
      ${text(270,190,'no intermediate sent → mobile clients fail',{anchor:'start',size:11,color:MG})}`,'Certificate chain from leaf to root with the validation checks')},
   {cap:"Certificate lifetimes are shrinking by CA/Browser Forum ballot SC-081: 398 days until March 2026, 200 days now, 100 from March 2027 and 47 from March 2029. Renewals per certificate per year are 365 ÷ lifetime, so automation with ACME stops being optional.",
    svg:svg(560,215,`${text(280,14,'Max TLS certificate lifetime (SC-081)',{bold:true,size:12})}
      ${[['before Mar 2026',398,'398 d · 0.9 / yr',DIM],['from Mar 15, 2026',200,'200 d · 1.8 / yr',CY],['from Mar 15, 2027',100,'100 d · 3.7 / yr',AM],['from Mar 15, 2029',47,'47 d · 7.8 / yr',MG]].map(([l,d,v,c],i)=>{ const y=32+i*40, w=Math.round(d*0.754); return text(10,y+13,l,{anchor:'start',size:11})+rect(140,y,w,26,{fill:c,op:0.3,stroke:c})+text(140+w+8,y+13,v,{anchor:'start',size:11}); }).join('')}
      ${text(280,200,'40 certs × 7.8 ≈ 310 renewals/yr',{size:12,bold:true,color:AM})}`,'Bar chart of maximum certificate lifetimes and renewals per year')}
  ]);

  /* ---------- Module 3: passkeys, SSO, password hashing ---------- */
  I.p7m3=(E.p7m3||[]).concat([
   {cap:"Why a passkey cannot be phished. The authenticator signs only with the key registered for the origin the browser is really talking to. On the real site that works; on a look-alike domain there is no key, nothing to sign and no code for the user to hand over.",
    svg:compare({t:'REAL SITE bank.com',draw:x=>box(x+20,42,220,34,'site sends a random challenge',{size:11})+arrow(x+130,76,x+130,96,'')+box(x+20,96,220,34,'authenticator: key for bank.com',{size:11,stroke:CY})+arrow(x+130,130,x+130,150,'')+box(x+20,150,220,30,'signature verifies → signed in ✓',{size:11,stroke:LM})},
      {t:'LOOK-ALIKE bank-login.co',draw:x=>box(x+20,42,220,34,'fake page relays the challenge',{size:11})+arrow(x+130,76,x+130,96,'')+box(x+20,96,220,34,'origin bank-login.co: no key',{size:11,stroke:MG})+arrow(x+130,130,x+130,150,'')+box(x+20,150,220,30,'nothing to sign or type ✗',{size:11,stroke:MG})},{h:200,label:'Passkey origin binding on a real and a look-alike site'})},
   {cap:"Single sign-on: the application never sees the password. It redirects the user to the identity provider, which applies MFA and conditional access, then hands back a signed SAML assertion or OpenID Connect ID token that the app verifies with the provider's public key.",
    svg:flow([{t:'user opens\nthe app'},{t:'redirect to\nidentity provider',edge:'no session'},{t:'MFA +\nconditional access',stroke:AM},{t:'signed SAML /\nOIDC token',stroke:CY},{t:'app verifies\nIdP signature',stroke:LM,edge:'token'},{t:'session\ncookie issued',stroke:LM}],{bw:110,bh:52,gap:72,label:'Single sign-on flow through an identity provider'})},
   {cap:"The defender's arithmetic for password storage (log scale, one GPU, order of magnitude): every 8-character lowercase-plus-digit password (2.8 × 10^12) falls in about 5 minutes against SHA-256 but takes about 9 years against bcrypt at cost 10 — per account, because unique salts prevent sharing the work.",
    svg:svg(560,195,`${text(280,14,'Exhaust 36^8 passwords, one GPU',{bold:true,size:12})}
      ${text(10,48,'SHA-256 · 10^10/s',{anchor:'start',size:11})}${rect(140,35,93,26,{fill:MG,op:0.3,stroke:MG})}${text(240,48,'≈ 5 minutes',{anchor:'start',size:11,bold:true,color:MG})}
      ${text(10,93,'bcrypt-10 · 10^4/s',{anchor:'start',size:11})}${rect(140,80,319,26,{fill:LM,op:0.3,stroke:LM})}${text(466,93,'≈ 9 years',{anchor:'start',size:11,bold:true,color:LM})}
      ${line(140,128,480,128,{stroke:DIM})}${[[140,'1 s'],[253,'17 min'],[367,'12 days'],[480,'32 years']].map(([x,l])=>line(x,124,x,132,{stroke:DIM})+text(x,144,l,{size:10,color:DIM})).join('')}
      ${text(310,178,'salts force this work per account',{size:11,color:AM})}`,'Log-scale bars comparing password guessing time for SHA-256 and bcrypt')}
  ]);

  /* ---------- Module 4: email authentication, ransomware chain, DDoS ---------- */
  I.p7m4=(E.p7m4||[]).concat([
   {cap:"Email authentication as the receiving server sees it: SPF asks whether the sending IP is listed in DNS, DKIM verifies a signature with a key published in DNS, and DMARC requires one of them to align with the visible From domain, then applies the owner's policy.",
    svg:svg(560,240,`${box(10,95,110,50,'sending server\nmail.example.com',{size:11})}${arrow(122,120,198,120,'SMTP')}
      ${box(200,95,120,50,'receiving\nserver',{stroke:CY,bold:true})}
      ${box(170,10,180,40,'DNS: SPF, DKIM key, DMARC',{size:11,stroke:DIM,dash:true})}${line(260,95,260,52,{dash:true,stroke:DIM})}${text(282,74,'lookups',{anchor:'start',size:10,color:DIM})}
      ${box(360,15,190,38,'SPF: sender IP listed?',{size:11})}${box(360,68,190,38,'DKIM: signature valid?',{size:11})}${box(360,121,190,38,'DMARC: aligned with From?',{size:11,stroke:AM})}
      ${arrow(322,110,358,36,'')}${arrow(322,118,358,88,'')}${arrow(322,128,358,140,'')}${arrow(455,159,455,183,'')}
      ${box(360,185,190,44,'pass → inbox\nfail → none / quarantine / reject',{size:10,stroke:LM})}`,'SPF, DKIM and DMARC checks at the receiving mail server')},
   {cap:"A ransomware intrusion has stages, and every stage has a detection signal. Catching it at the first or second box costs minutes; catching it at the last costs the restore. This is why EDR behavior alerts and backup-deletion alerts matter more than the ransom note.",
    svg:svg(560,190,`${text(280,16,'each earlier detection is cheaper',{bold:true,size:12})}
      ${[['phish or\nopen port',CY,'user report,\nbanner'],['execution\n(macro)',CY,'macro block,\nEDR alert'],['credential\ntheft',AM,'EDR creds\nalert'],['lateral\nmovement',AM,'inter-VLAN\ndenies'],['backup\ndeletion',MG,'backup-delete\nalert'],['encrypt +\nextort',MG,'mass renames\n(too late)']].map(([t,c,d],i)=>{ const x=10+i*92; return box(x,32,80,50,t,{stroke:c,size:11})+(i<5?arrow(x+81,57,x+91,57,''):'')+text(x+40,102,d,{size:10,color:DIM,lh:12}); }).join('')}
      ${arrow(20,150,540,150,'cost of response grows',{color:MG})}`,'Ransomware stages with the detection signal for each')},
   {cap:"DDoS arithmetic: a 10 Gb/s flood aimed at a 1 Gb/s office link fills the link before a single packet reaches your firewall, so no box you own can filter it. Mitigation has to sit upstream — the ISP's scrubbing service or a CDN with more capacity than the attacker.",
    svg:svg(560,170,`${box(10,55,100,50,'flood\n10 Gb/s',{stroke:MG,bold:true})}${arrow(112,80,148,80,'')}
      ${box(150,45,130,70,'ISP network\n(scrub here)',{stroke:LM})}
      ${rect(282,74,120,12,{fill:AM,op:0.5,stroke:AM})}${text(342,60,'1 Gb/s link: full',{size:11,color:AM})}
      ${box(410,55,130,50,'your firewall',{stroke:DIM})}
      ${text(280,140,'link saturates before your firewall',{size:12,bold:true,color:MG})}${text(280,160,'mitigate upstream: ISP or CDN',{size:11,color:LM})}`,'Volumetric flood saturating a small link upstream of the firewall')}
  ]);

  /* ---------- Module 5: stateful firewall, zero trust, remote access ---------- */
  I.p7m5=(E.p7m5||[]).concat([
   {cap:"A stateful firewall remembers each allowed connection by its 5-tuple, so the reply matches the table and passes without a separate rule, while an unsolicited packet from a stranger matches nothing and falls to the implicit deny.",
    svg:svg(560,240,`${box(10,28,110,44,'staff PC\n10.10.10.25',{size:11})}${box(440,28,110,44,'web server\n93.184.216.34',{size:11,stroke:LM})}${box(440,160,110,44,'stranger\n198.51.100.7',{size:11,stroke:MG})}
      ${box(200,20,160,200,'',{stroke:AM})}${text(280,36,'stateful firewall',{bold:true,color:AM})}
      ${arrow(122,44,198,44,'SYN :443')}${arrow(362,44,438,44,'allowed')}${arrow(438,64,362,64,'reply')}${arrow(198,64,122,64,'pass')}
      ${text(280,96,'connection table',{bold:true,size:11})}${text(280,114,'TCP 10.10.10.25:51514',{mono:true,size:9})}${text(280,127,'→ 93.184.216.34:443',{mono:true,size:9})}${text(280,140,'state ESTABLISHED',{mono:true,size:9,color:LM})}
      ${text(280,166,'rules: first match wins',{size:10,color:DIM})}${text(280,180,'then implicit deny',{size:10,color:DIM})}
      ${arrow(438,182,362,182,'new SYN',{color:MG})}${text(280,204,'✗ no entry → drop',{size:11,bold:true,color:MG})}`,'Stateful firewall connection table admitting replies and dropping unsolicited traffic')},
   {cap:"Zero trust in NIST SP 800-207 terms. The policy engine decides from signals (identity, device health, location, threat intelligence); the policy administrator tells the policy enforcement point to open or refuse a session. The subject never reaches the resource except through the enforcement point.",
    svg:svg(560,250,`${rect(150,10,260,86,{stroke:DIM,dash:true,rx:6})}${text(470,30,'control plane',{size:11,color:DIM})}
      ${text(10,24,'signals',{anchor:'start',bold:true,size:11})}${text(10,42,'identity + MFA',{anchor:'start',size:10})}${text(10,57,'device health',{anchor:'start',size:10})}${text(10,72,'location, risk',{anchor:'start',size:10})}${text(10,87,'threat intel',{anchor:'start',size:10})}
      ${arrow(98,52,163,52,'')}${box(165,30,110,44,'policy\nengine',{stroke:CY,bold:true,size:11})}${arrow(277,52,288,52,'')}${box(290,30,110,44,'policy\nadministrator',{stroke:CY,size:11})}
      ${box(10,150,110,50,'subject\nuser + device',{size:11})}${box(200,150,160,50,'policy enforcement\npoint',{stroke:AM,bold:true,size:11})}${box(440,150,110,50,'resource\napp / data',{stroke:LM,size:11})}
      ${arrow(122,175,198,175,'request')}${arrow(362,175,438,175,'session')}${arrow(345,76,300,148,'allow / deny',{color:AM})}
      ${text(280,232,'data plane: no implicit trust zone',{size:11,color:DIM})}`,'NIST SP 800-207 zero-trust components across control and data planes')},
   {cap:"Three ways to reach the office from home. Port-forwarded RDP exposes a whole PC to every scanner on the internet; a VPN with MFA puts a verified device on a network segment; ZTNA brokers a verified user and device to one application with no inbound port at all.",
    svg:svg(560,212,`${[['exposed RDP','never',MG,['internet scanners','open port 3389','whole PC']],['VPN + MFA','good',AM,['user + MFA','VPN tunnel','network segment']],['ZTNA','best',LM,['user + device check','broker, no inbound port','one app only']]].map(([n,v,c,b],i)=>{ const y=10+i*70; return text(60,y+16,n,{bold:true,color:c,size:12})+text(60,y+33,v,{size:10,color:c})+box(130,y,120,40,b[0],{size:11})+arrow(252,y+20,298,y+20,'')+box(300,y,130,40,b[1],{size:11,stroke:i===0?MG:'currentColor'})+arrow(432,y+20,448,y+20,'')+box(450,y,100,40,b[2],{size:11,stroke:c}); }).join('')}`,'Exposed RDP versus VPN with MFA versus ZTNA')}
  ]);

  /* ---------- Module 6: SIEM pipeline, base rates, IR models ---------- */
  I.p7m6=(E.p7m6||[]).concat([
   {cap:"The SIEM pipeline. Raw events from identity, endpoint, firewall and DNS sources are collected, parsed into common fields, enriched with asset, user and location context, correlated by rules, and only then raised as an alert for a human to triage into a case.",
    svg:flow([{t:'sources\nIdP · EDR · FW · DNS'},{t:'collect\nagent · syslog · API'},{t:'parse +\nnormalize'},{t:'enrich\nasset · user · geo',stroke:AM},{t:'correlate\nrules · Sigma',stroke:CY},{t:'alert → triage\n→ case',stroke:LM}],{bw:130,bh:54,gap:40,label:'SIEM pipeline from sources to cases'})},
   {cap:"Base rates explain alert fatigue (Bayes, Domain 14). With 10 malicious events in a million, a detector that catches 99% of them and misfires on only 0.1% of benign events still produces about 1,000 false alarms for 9.9 real ones: roughly 1% precision. Tuning, not more analysts, fixes this.",
    svg:svg(560,240,`${box(195,10,170,40,'1,000,000 events / day',{bold:true,size:12})}
      ${line(260,50,115,85)}${line(300,50,445,85)}
      ${box(40,85,150,40,'malicious: 10',{stroke:MG,size:12})}${box(370,85,150,40,'benign: 999,990',{size:12})}
      ${line(115,125,115,160)}${line(445,125,445,160)}${text(125,142,'99% caught',{anchor:'start',size:10,color:DIM})}${text(455,142,'0.1% misfire',{anchor:'start',size:10,color:DIM})}
      ${box(40,160,150,40,'true alerts: 9.9',{stroke:LM,size:12})}${box(370,160,150,40,'false alarms ≈ 1,000',{stroke:AM,size:12})}
      ${text(280,224,'precision = 9.9 ÷ 1,010 ≈ 1%',{bold:true,size:13,color:MG})}`,'Probability tree showing why rare attacks give low alert precision')},
   {cap:"Same logic, different names. The Security+ exam lists seven incident-response steps, SANS uses six, and NIST's 2012 guide grouped them into four phases; NIST SP 800-61r3 (April 2025) now maps incident response onto the six CSF 2.0 functions.",
    svg:svg(560,200,`${[['Security+',['prepare','detect','analyze','contain','eradicate','recover','lessons']],['SANS (PICERL)',[['prepare',1],['identify',2],['contain',1],['eradicate',1],['recover',1],['lessons',1]]],['NIST r2 (2012)',[['preparation',1],['detection &\nanalysis',2],['contain · eradicate\n· recover',3],['post-\nincident',1]]]].map(([n,cells],r)=>{ const y=20+r*55; let col=0; return text(50,y+18,n,{bold:true,size:11})+cells.map(c=>{ const t=Array.isArray(c)?c[0]:c, span=Array.isArray(c)?c[1]:1; const x=100+col*64, w=span*64-4; col+=span; return box(x,y,w,36,t,{size:11,stroke:r===0?CY:r===1?AM:LM}); }).join(''); }).join('')}
      ${text(330,190,'SP 800-61r3 (2025): CSF 2.0 functions',{size:11,color:DIM})}`,'Alignment of Security+, SANS and NIST incident-response phases')}
  ]);

  /* ---------- Module 7: document hierarchy, authorization, Texas SB 2610 ---------- */
  I.p7m7=(E.p7m7||[]).concat([
   {cap:"The governance document hierarchy. A policy states intent and is approved by leadership; a standard makes it measurable and mandatory; a procedure gives the steps; a guideline only recommends. Auditors test whether each layer exists and matches the one above it.",
    svg:svg(560,220,`${[['POLICY',120,CY,'remote access requires MFA'],['STANDARD',170,AM,'admins FIDO2; staff number match'],['PROCEDURE',220,LM,'enroll two passkeys, record ticket'],['GUIDELINE',270,DIM,'consider a privacy screen (optional)']].map(([t,w,c,ex],i)=>{ const y=15+i*50, x=150-w/2; return box(x,y,w,42,t,{stroke:c,bold:true,size:12})+line(x+w+4,y+21,292,y+21,{dash:true,stroke:DIM})+text(300,y+21,ex,{anchor:'start',size:11}); }).join('')}`,'Pyramid of policy, standard, procedure and guideline with examples')},
   {cap:"Before any scan or test: authorization has to come from whoever controls the system, in writing, with scope. A client cannot authorize testing of a SaaS vendor's platform or a landlord's network — that permission belongs to them.",
    svg:svg(560,258,`${box(20,10,250,40,'Does the client own the system?',{size:11})}${arrow(272,30,328,30,'no')}${box(330,10,215,40,'need the owner\'s written permission',{size:11,stroke:MG})}
      ${arrow(145,52,145,78,'yes')}${box(20,80,250,40,'Signed by someone with authority?',{size:11})}${arrow(272,100,328,100,'no')}${box(330,80,215,40,'get owner or officer signature',{size:11,stroke:MG})}
      ${arrow(145,122,145,148,'yes')}${box(20,150,250,40,'Assets, activities, window in scope?',{size:11})}${arrow(272,170,328,170,'no')}${box(330,150,215,40,'stop: amend the scope first',{size:11,stroke:MG})}
      ${arrow(145,192,145,216,'yes')}${box(20,218,250,32,'proceed, log, stay in scope',{size:11,stroke:LM,bold:true})}`,'Decision flow for written authorization before security testing')},
   {cap:"Texas SB 2610 (effective September 1, 2025) scales the expected cybersecurity program to company size; a Texas business under 250 employees that maintained a conforming program is shielded from exemplary (punitive) damages after a breach — not from regulators or compensatory damages.",
    svg:stack([{t:'under 20 employees: passwords + training',stroke:DIM},{t:'20–99 employees: CIS Controls IG1',stroke:AM},{t:'100–249: full framework (NIST, ISO, CIS)',stroke:CY},{t:'reward: no exemplary (punitive) damages',stroke:LM,bold:true}],{w:440,h:40,label:'Texas SB 2610 program tiers by employee count'})}
  ]);

  /* ---------- Module 8: vulnerability management ---------- */
  const lx=v=>60+v*30, ly=e=>20+(-Math.log10(e))*66.7;
  I.p7m8=[
   {cap:"Vulnerability management is a loop, not a scan. Inventory first (you cannot scan what you do not know), scan with credentials, validate to remove false positives, prioritize by severity and likelihood, remediate, then prove it with a rescan and a report.",
    svg:cycle(['inventory','scan\n(credentialed)','validate','prioritize\nCVSS·EPSS·KEV','remediate','rescan +\nreport'],{label:'Vulnerability management cycle'})},
   {cap:"Severity is not risk. Plotting the five findings from the lecture by CVSS (across) and exploitation probability (EPSS, up, log scale) shows why the KEV-listed VPN and browser go first, while the 9.1 printer on an isolated VLAN can wait for its 90-day SLA.",
    svg:svg(560,262,`${line(60,220,360,220,{stroke:DIM})}${line(60,20,60,220,{stroke:DIM})}
      ${rect(270,20,90,67,{fill:MG,op:0.12,stroke:MG,dash:true,rx:0})}${text(300,74,'fix first',{size:10,bold:true,color:MG})}
      ${line(270,20,270,220,{dash:true,stroke:DIM})}${line(60,87,360,87,{dash:true,stroke:DIM})}
      ${[0,5,7,9,10].map(v=>text(lx(v),234,String(v),{size:10,color:DIM})).join('')}${text(210,252,'CVSS severity →',{size:11,color:DIM})}
      ${[[1,'1.0'],[0.1,'0.1'],[0.01,'0.01'],[0.001,'0.001']].map(([e,l])=>text(52,ly(e),l,{anchor:'end',size:10,color:DIM})).join('')}${text(22,120,'EPSS',{size:11,bold:true,color:DIM})}
      ${dot(lx(9.8),ly(0.94)+6,7,{fill:MG,op:0.6,stroke:MG})}${text(lx(9.8)-12,ly(0.94)+6,'A VPN',{anchor:'end',size:10})}
      ${dot(lx(8.8),ly(0.30),7,{fill:MG,op:0.6,stroke:MG})}${text(lx(8.8),ly(0.30)-14,'B browser',{size:10})}
      ${dot(lx(7.8),ly(0.02),7,{stroke:AM})}${text(lx(7.8)+10,ly(0.02),'C file server',{anchor:'start',size:10})}
      ${dot(lx(9.1),ly(0.001)-8,7,{stroke:LM})}${text(lx(9.1)+10,ly(0.001)-8,'D isolated printer',{anchor:'start',size:10})}
      ${dot(lx(5.3),ly(0.003),7,{stroke:DIM})}${text(lx(5.3)-10,ly(0.003),'E TLS 1.0',{anchor:'end',size:10})}
      ${dot(400,40,6,{fill:MG,op:0.6,stroke:MG})}${text(412,40,'on KEV catalog',{anchor:'start',size:10})}
      ${dot(400,62,6,{stroke:DIM})}${text(412,62,'not on KEV',{anchor:'start',size:10})}
      ${text(470,110,'P1: 72 h–7 d',{size:10,color:MG})}${text(470,128,'P2: 14–30 d',{size:10,color:AM})}${text(470,146,'P3: 60–90 d',{size:10,color:LM})}${text(470,164,'P4: next window',{size:10,color:DIM})}`,'Scatter of findings by CVSS and EPSS with KEV markers')},
   {cap:"Patch in rings and verify. A few pilot machines get the update on day 0, about 10% on day 2, everyone by day 7; servers go in a maintenance window after a snapshot. The patch is fixed only when a rescan says so, and KEV-listed fixes jump the queue.",
    svg:svg(560,200,`${line(40,150,490,150,{stroke:DIM})}${[[0,'day 0'],[2,'2'],[5,'5'],[7,'7'],[9,'9']].map(([d,l])=>line(40+d*45,146,40+d*45,154,{stroke:DIM})+text(40+d*45,168,l,{size:10,color:DIM})).join('')}
      ${box(40,18,120,34,'ring 0: lab + 3 pilots',{size:10,stroke:CY})}${line(40,52,40,146,{dash:true,stroke:DIM})}
      ${box(130,58,120,34,'ring 1: 10% of fleet',{size:10,stroke:CY})}${line(130,92,130,146,{dash:true,stroke:DIM})}
      ${box(265,98,86,34,'ring 2: all',{size:10,stroke:CY})}${line(265,132,265,146,{dash:true,stroke:DIM})}
      ${box(355,18,150,34,'servers: snapshot, window',{size:10,stroke:AM})}${line(355,52,355,146,{dash:true,stroke:DIM})}
      ${box(445,58,105,34,'rescan = verified',{size:10,stroke:LM,bold:true})}
      ${text(280,190,'KEV / P1 fixes skip ahead: 72 h',{size:11,bold:true,color:MG})}`,'Timeline of patch deployment rings and verification')},
   {cap:"Credentialed versus uncredentialed scanning. From outside, a scanner sees open ports and banners and guesses; logged in with a dedicated scan account, it reads installed versions and settings and finds the missing patches that matter.",
    svg:compare({t:'UNCREDENTIALED',draw:x=>box(x+30,45,200,30,'sees open ports, banners',{size:11})+box(x+30,85,200,30,'guesses versions from outside',{size:11,dash:true})+text(x+130,135,'misses most missing patches',{size:12,bold:true,color:MG})+text(x+130,155,'= a stranger\'s view',{size:10,color:DIM})},
      {t:'CREDENTIALED',draw:x=>box(x+30,45,200,30,'logs in with scan account',{size:11})+box(x+30,85,200,30,'reads installed versions, settings',{size:11})+text(x+130,135,'finds missing patches, weak config',{size:12,bold:true,color:LM})+text(x+130,155,'= an administrator\'s view',{size:10,color:DIM})},{h:175,label:'Uncredentialed versus credentialed vulnerability scan'})}
  ];

  /* ---------- Module 9: resilience ---------- */
  I.p7m9=[
   {cap:"RPO and RTO on one timeline. The recovery point objective is the data you can afford to lose (backup at 06:00, failure at 08:00: 2 hours); the recovery time objective is how long until the service must be back (13:00: 5 hours). Backup frequency serves RPO; restore speed serves RTO.",
    svg:svg(560,182,`${line(30,90,530,90,{stroke:DIM,sw:1.6})}
      ${line(120,80,120,100,{stroke:CY,sw:2})}${line(260,74,260,106,{stroke:MG,sw:2})}${line(460,80,460,100,{stroke:LM,sw:2})}
      ${text(120,28,'last backup 06:00',{size:11,color:CY})}${text(260,28,'failure 08:00',{size:11,bold:true,color:MG})}${text(460,28,'service back 13:00',{size:11,color:LM})}
      ${line(120,60,260,60,{stroke:MG})}${line(120,55,120,65,{stroke:MG})}${line(260,55,260,65,{stroke:MG})}${text(190,48,'RPO = 2 h of data',{size:11,color:MG})}
      ${line(260,124,460,124,{stroke:AM})}${line(260,119,260,129,{stroke:AM})}${line(460,119,460,129,{stroke:AM})}${text(360,142,'RTO = 5 h downtime',{size:11,color:AM})}
      ${text(280,170,'interval ≤ RPO · restore < RTO',{size:12,bold:true})}`,'Timeline showing recovery point objective and recovery time objective')},
   {cap:"A 3-2-1-1-0 design for a small office: a fast local repository for everyday restores, a nightly copy to cloud storage under compliance-mode object lock that no stolen admin account can delete, separate backup credentials with security keys, and a restore test that proves zero errors.",
    svg:svg(560,232,`${box(10,85,110,55,'file server\n(copy 1)',{bold:true})}
      ${arrow(122,100,188,50,'every 2 h')}${arrow(122,125,188,175,'nightly')}
      ${box(190,20,160,55,'local repository\n(copy 2, disk)',{stroke:CY,size:11})}${box(190,150,160,55,'cloud object lock\n35 days (copy 3)',{stroke:LM,size:11,bold:true})}
      ${line(352,47,398,47,{dash:true,stroke:AM})}${box(400,20,150,55,'separate credentials\n+ security keys',{stroke:AM,size:11})}
      ${arrow(352,177,398,177,'')}${box(400,150,150,55,'restore test\nquarterly: 0 errors',{stroke:LM,size:11})}
      ${text(150,224,'3 copies · 2 media · 1 off-site',{size:11,color:DIM})}${text(430,224,'1 immutable · 0 errors',{size:11,color:LM})}`,'Three-two-one-one-zero backup architecture')},
   {cap:"Restore time is size ÷ throughput. A 2 TB server is 1.6 × 10^13 bits: about 44 hours over a 100 Mb/s internet link, but 4.4 hours over a 1 Gb/s LAN (6.3 hours at a realistic 70%). Against an 8-hour RTO, only the local copy works — so keep one.",
    svg:svg(560,200,`${line(210,22,210,150,{dash:true,stroke:MG})}${text(210,14,'RTO 8 h',{size:11,bold:true,color:MG})}
      ${[['100 Mb/s internet',44.4,MG,'44 h ✗',true],['1 Gb/s LAN (70%)',6.3,AM,'6.3 h ✓',false],['1 Gb/s LAN (ideal)',4.4,LM,'4.4 h ✓',false]].map(([l,h,c,v,long],i)=>{ const y=34+i*40, w=Math.round(h*7.5); return text(10,y+13,l,{anchor:'start',size:11})+rect(150,y,w,26,{fill:c,op:0.3,stroke:c})+text(long?150+w+6:218,y+13,v,{anchor:'start',size:11,bold:true,color:c}); }).join('')}
      ${line(150,160,510,160,{stroke:DIM})}${[0,8,24,48].map(h=>line(150+h*7.5,156,150+h*7.5,164,{stroke:DIM})+text(150+h*7.5,176,h+' h',{size:10,color:DIM})).join('')}
      ${text(330,194,'2 TB = 1.6×10^13 bits ÷ rate',{size:11,color:DIM})}`,'Bars comparing restore times with the recovery time objective')},
   {cap:"Retention must outlast dwell time. If an intruder arrived 23 days before encrypting and you keep only 14 daily restore points, every copy postdates the intrusion; 30 dailies (plus monthlies) leave clean restore points from before they arrived.",
    svg:svg(560,200,`${line(244,24,244,150,{dash:true,stroke:MG})}${text(244,14,'intruder arrives (day −23)',{size:11,color:MG})}${line(520,24,520,150,{stroke:MG,sw:1.6})}${text(552,14,'encrypted: day 0',{anchor:'end',size:11,bold:true,color:MG})}
      ${text(40,40,'keep 14 dailies',{anchor:'start',size:11,bold:true})}${Array.from({length:14},(_,i)=>rect(40+(27+i)*12-4,50,8,16,{fill:MG,op:0.45,stroke:MG,rx:1})).join('')}${text(40,72,'no clean copy ✗',{anchor:'start',size:10,color:MG})}
      ${text(40,98,'keep 30 dailies',{anchor:'start',size:11,bold:true})}${Array.from({length:30},(_,i)=>{ const d=11+i; return rect(40+d*12-4,106,8,16,{fill:d<17?LM:DIM,op:d<17?0.6:0.3,stroke:d<17?LM:DIM,rx:1}); }).join('')}${text(40,128,'clean copies exist ✓',{anchor:'start',size:10,color:LM})}
      ${line(40,150,520,150,{stroke:DIM})}${[[-40,40],[-30,160],[-20,280],[-10,400],[0,520]].map(([d,x])=>text(x,166,(d<0?'−'+(-d):'0'),{size:10,color:DIM})).join('')}
      ${text(280,190,'retention must outlast dwell time',{size:12,bold:true,color:AM})}`,'Restore points versus attacker dwell time')}
  ];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
