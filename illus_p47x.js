/* Third figures — Domain 47: The Dark Web: Anonymity Networks, Tor & Cybercrime Intelligence. Adds to the figures in illus_p47.js (never replaces them). */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const add=(id,figs)=>{ window.ILLUS=window.ILLUS||{}; window.ILLUS[id]=(window.ILLUS[id]||[]).concat(figs); };

  /* m1 — classify any page with two questions: indexed? overlay needed? */
  add('p47m1',[{cap:"Surface, deep and dark are answers to two testable questions. Can a general search engine reach and index it? Then it is surface web. If not, does reaching it need special software for an overlay network? If not, it is deep web (mostly logins and databases, mostly legal); if so, it is dark web.",
    svg:svg(560,240,`${text(280,16,'Surface, deep or dark? Two questions decide',{color:CY,bold:true,size:11})}
      ${box(16,32,200,48,'indexed by a general\nsearch engine?',{stroke:CY,size:11})}
      ${arrow(216,56,300,56,'yes')}${box(300,32,244,48,'SURFACE WEB\nindexed pages',{stroke:CY,size:11})}
      ${arrow(116,80,116,106,'')}${text(126,93,'no',{anchor:'start',size:10,color:DIM})}
      ${box(16,106,200,48,'needs special software\n(an overlay network)?',{stroke:AM,size:11})}
      ${arrow(216,130,300,130,'no')}${box(300,106,244,48,'DEEP WEB: logins, query\nresults, paywalls, robots.txt',{stroke:AM,size:11})}
      ${text(422,168,'unindexed, mostly legal and boring',{size:10,color:DIM})}
      ${arrow(116,154,116,182,'')}${text(126,168,'yes',{anchor:'start',size:10,color:DIM})}
      ${box(16,182,320,46,'DARK WEB: onion services,\nI2P sites, Hyphanet freesites',{stroke:MG,size:11})}
      ${text(444,196,'darknet = the network',{size:10,color:MG})}${text(444,214,'dark web = content on it',{size:10,color:MG})}`,
      'Decision path classifying content as surface, deep or dark web')}]);

  /* m2 — telescopic circuit construction: one key per hop */
  const CX=[62,216,362,498];
  add('p47m2',[{cap:"How the layers get their keys: the client does a handshake with the guard, then extends the circuit through the guard to the middle, then through both to the exit, ending with one separate symmetric key per hop. Each 514-byte cell is then wrapped in three layers, so each relay can remove only its own.",
    svg:svg(560,250,`${text(280,16,'Building a circuit telescopically: one key per hop',{color:CY,bold:true,size:11})}
      ${['client','guard','middle','exit'].map((n,i)=>box(CX[i]-46,28,92,28,n,{stroke:[LM,CY,'currentColor',AM][i],size:11})+line(CX[i],56,CX[i],170,{dash:true,stroke:DIM})).join('')}
      ${arrow(CX[0],84,CX[1]-2,84,'1 ntor handshake → key 1',{color:CY})}
      ${arrow(CX[0],124,CX[2]-2,124,'2 extend via guard → key 2')}
      ${arrow(CX[0],164,CX[3]-2,164,'3 extend via both → key 3',{color:AM})}
      ${text(CX[1]+6,98,'holds key 1 only',{anchor:'start',size:9,color:DIM})}
      ${text(CX[2]+6,138,'holds key 2 only',{anchor:'start',size:9,color:DIM})}
      ${text(CX[3]-6,180,'holds key 3 only',{anchor:'end',size:9,color:DIM})}
      ${box(16,192,528,30,'each 514-byte cell: three AES-CTR layers, key 1 outermost',{stroke:LM,size:10})}
      ${text(280,238,'each relay peels one layer and learns only the next hop',{color:DIM,size:10})}`,
      'Telescopic Tor circuit construction giving one symmetric key per relay')}]);

  /* m3 — the lawful lab: web server on loopback, tor publishes it, nothing on the public side */
  add('p47m3',[{cap:"Why the lab binds the web server to 127.0.0.1: only the local tor daemon can reach it, and tor makes outbound circuits only, so the clearnet has nothing to connect to. A server that also listens on the public interface is the classic misconfiguration that reveals where an onion service really is.",
    svg:svg(560,250,`${text(280,16,'Your lab onion service: nothing listens on the public side',{color:CY,bold:true,size:11})}
      ${box(16,28,528,152,'',{stroke:DIM,dash:true})}${text(28,42,'your machine',{anchor:'start',size:10,color:DIM})}
      ${box(36,58,156,56,'python http.server\n127.0.0.1:8080',{mono:true,stroke:LM,size:10})}
      ${arrow(256,86,192,86,'loopback')}
      ${box(256,52,168,68,'tor daemon\nHiddenServicePort\n80 127.0.0.1:8080',{mono:true,stroke:CY,size:10})}
      ${arrow(424,86,552,86,'outbound only',{stroke:CY})}
      ${box(36,134,388,34,'public interface: nothing listening on 8080',{stroke:DIM,dash:true,size:10})}
      ${box(16,194,258,44,'clearnet cannot reach the\nweb server directly',{stroke:LM,color:LM,size:10})}
      ${box(286,194,258,44,'misconfiguration to avoid: server\nalso on the public interface',{stroke:MG,color:MG,size:10})}`,
      'Lab onion service with the web server bound to loopback and tor making only outbound circuits')}]);

  /* m4 — one research session, starting and ending at a clean snapshot */
  add('p47m4',[{cap:"A research session is a loop that starts and ends in the same clean state: revert the Whonix Workstation, set Tor Browser to Safest with HTTPS-Only, take addresses only from official clearnet pages, capture as you go, then close, revert and write the log. Anything outside the written purpose, such as a forum link list, is not clicked.",
    svg:svg(560,250,`${text(280,16,'One research session: start clean, end clean',{color:CY,bold:true,size:11})}
      ${box(16,34,160,50,'1  revert Workstation\nto snapshot CLEAN',{stroke:CY,size:10})}${arrow(176,59,200,59,'')}
      ${box(200,34,160,50,'2  Tor Browser:\nSafest, HTTPS-Only',{stroke:AM,size:10})}${arrow(360,59,384,59,'')}
      ${box(384,34,160,50,'3  addresses only from\nofficial clearnet pages',{stroke:LM,size:10})}
      ${arrow(464,84,464,148,'')}
      ${box(384,150,160,50,'4  capture: UTC time,\naddress, screenshot',{stroke:LM,size:10})}${arrow(384,175,360,175,'')}
      ${box(200,150,160,50,'5  close, revert,\nwrite the log',{stroke:CY,size:10})}
      ${line(200,175,96,175,{stroke:DIM})}${arrow(96,175,96,86,'',{stroke:DIM})}${text(106,130,'next\nsession',{anchor:'start',size:10,color:DIM})}
      ${text(282,110,'Whonix Gateway + Workstation',{size:10,color:DIM})}${text(282,124,'on a dedicated machine',{size:10,color:DIM})}
      ${text(280,224,'link list outside your written purpose? do not click',{color:AM,size:10})}
      ${text(280,240,'no personal logins · no add-ons · no documents opened online',{color:DIM,size:10})}`,
      'A dark-web research session as a loop from a clean snapshot back to a clean snapshot')}]);

  /* m5 — Hyphanet: a datastore, not a pipe */
  add('p47m5',[{cap:"Hyphanet stores content instead of carrying connections: a file is split into encrypted blocks kept on other users' disks, each fetched by its Content Hash Key and checked against SHA-256 on arrival. The publisher can go offline and the content stays, which a seized Tor server cannot offer.",
    svg:svg(560,246,`${text(280,16,'Hyphanet is a datastore, not a pipe',{color:CY,bold:true,size:11})}
      ${box(16,32,110,48,'publisher\ninserts a file',{stroke:CY,size:10})}${arrow(126,56,158,56,'')}
      ${['b1','b2','b3','b4'].map((b,i)=>box(160+i*40,36,36,40,b,{stroke:AM,size:10,mono:true})).join('')}
      ${text(238,92,'split + encrypted',{size:10,color:DIM})}
      ${arrow(318,56,400,56,'spread')}
      ${box(400,30,144,56,'other users\' disks\n(they cannot read\nthe blocks)',{stroke:AM,size:10})}
      ${arrow(71,80,71,118,'later')}
      ${box(16,120,110,40,'publisher\ngoes offline',{stroke:DIM,dash:true,color:DIM,size:10})}
      ${arrow(472,86,472,118,'')}
      ${box(400,120,144,40,'reader asks by key\n(CHK)',{stroke:LM,size:10})}
      ${arrow(400,140,372,140,'')}
      ${box(190,120,182,40,'check on arrival:\nSHA-256(block) = key',{stroke:LM,size:10})}
      ${box(16,182,258,48,'Tor onion service: server\nseized → the site is gone',{stroke:MG,size:10})}
      ${box(286,182,258,48,'Hyphanet: content persists\nafter the publisher leaves',{stroke:LM,size:10})}`,
      'Hyphanet stores encrypted blocks on peers, verified by content hash, so content outlives the publisher')}]);

  /* m6 — Operation Bayonet as a timeline (investigators' view) */
  const D=d=>30+d*12.5; /* d = days after 15 June 2017 */
  add('p47m6',[{cap:"Operation Bayonet from the investigators' side: Dutch police were already running Hansa when AlphaBay fell, so AlphaBay's users moved onto a market the police controlled. The lesson for analysts is the one the users missed: the platform itself may not be what it seems.",
    svg:svg(560,244,`${text(280,16,'Operation Bayonet, summer 2017: two markets, one operation',{color:CY,bold:true,size:11})}
      ${box(16,30,170,42,'20 Jun: Hansa admins\narrested in Germany',{stroke:CY,size:10})}${line(D(5),72,D(5),84,{stroke:CY})}
      ${box(196,30,170,42,'5 Jul: AlphaBay admin\narrested in Bangkok',{stroke:CY,size:10})}${line(D(20),72,D(20),84,{stroke:CY})}
      ${box(376,30,168,42,'20 Jul: Hansa closed,\n~27,000 transactions seen',{stroke:LM,size:10})}${line(D(35),72,D(35),84,{stroke:LM})}
      ${box(D(5),84,D(35)-D(5),26,'Dutch police operate Hansa undercover',{stroke:AM,color:AM,size:10})}
      ${line(D(0),124,D(40),124,{sw:1.5})}
      ${[[5,'20 Jun'],[20,'5 Jul'],[35,'20 Jul']].map(t=>line(D(t[0]),119,D(t[0]),129)+text(D(t[0]),139,t[1],{size:9,color:DIM})).join('')}
      ${box(D(0),150,D(20)-D(0),26,'AlphaBay online (~200,000 users)',{stroke:DIM,size:10})}
      ${text(D(20)+10,163,'AlphaBay dark → Hansa users rise 8×',{anchor:'start',size:10,color:MG})}
      ${box(16,192,528,42,'~10,000 foreign buyer addresses passed to Europol\nlesson: never assume the platform is trustworthy',{stroke:LM,size:10})}`,
      'Timeline of Operation Bayonet showing Hansa run undercover before AlphaBay was taken down')}]);

  /* m7 — collection governance: from a finding to an action, inside the rules */
  add('p47m7',[{cap:"Collection governance for a dark-web analyst, using the stolen-credential example: authorization first, observation only, a check of what was found (abuse material means stop and report; personal or stolen data means legal review), evidence captured with hashes, verification against your own records rather than by testing logins, and a TLP-marked report with owned actions.",
    svg:svg(560,300,`${text(280,16,'From finding to action, inside the rules',{color:CY,bold:true,size:11})}
      ${box(16,30,250,32,'written purpose + authorization',{stroke:CY,size:10})}${arrow(141,62,141,74,'')}
      ${box(16,74,250,32,'observe only: never buy, never engage',{size:10})}${arrow(141,106,141,118,'')}
      ${box(16,118,250,32,'what did you find?',{stroke:AM,color:AM,bold:true,size:11})}
      ${arrow(266,128,318,104,'')}${box(318,88,226,32,'CSAM → stop, leave, report (NCMEC)',{stroke:MG,color:MG,size:10})}
      ${arrow(266,140,318,160,'')}${box(318,144,226,32,'personal or stolen data → legal review',{stroke:AM,size:10})}
      ${arrow(141,150,141,166,'')}${text(150,158,'otherwise',{anchor:'start',size:9,color:DIM})}
      ${box(16,166,250,32,'capture: UTC, SHA-256, custody log',{stroke:LM,size:10})}${arrow(141,198,141,210,'')}
      ${box(16,210,250,32,'verify against HR directory, never by login',{stroke:LM,size:10})}
      ${arrow(266,226,318,226,'')}${box(318,210,226,32,'312 pairs → 41 staff → 3 VPN',{stroke:DIM,size:10,mono:true})}
      ${arrow(141,242,141,256,'')}
      ${box(16,256,528,34,'TLP:AMBER report: reset the 41 accounts, MFA on VPN, image 3 laptops',{stroke:LM,color:LM,size:10})}`,
      'Governance flow from authorization through collection checks to a marked intelligence report')}]);
})();
