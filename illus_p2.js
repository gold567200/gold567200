/* Illustrations — Domain 2: Networking & the Internet (deepened October 2026).
   Concatenates onto the original p2 figures defined in illus_core.js; built with the kit in illus_core.js. */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const E=window.ILLUS||{}; const I={};
  // helpers for this domain
  const rect=(x,y,w,h,o={})=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx==null?3:o.rx}" fill="${o.fill||'none'}" ${o.op!=null?`fill-opacity="${o.op}"`:''} stroke="${o.stroke||'currentColor'}" stroke-width="${o.sw||1.2}" ${o.dash?'stroke-dasharray="4 3"':''}/>`;
  // two-party sequence ladder: msgs [{y,d:'r'|'l',t,c,lost}]
  const lad=(W,H,L,R,msgs,extra,label,xl=70,xr=490)=>svg(W,H,
    text(xl,16,L,{bold:true,color:CY})+text(xr,16,R,{bold:true,color:MG})+line(xl,26,xl,H-8,{dash:true,stroke:DIM})+line(xr,26,xr,H-8,{dash:true,stroke:DIM})+
    msgs.map(m=>{ const y1=m.y, y2=m.y+(m.dy==null?12:m.dy); const a=m.d==='r'?xl:xr, b=m.d==='r'?xr:xl; const mx=(a+b)/2, my=(y1+y2)/2;
      if(m.lost) return line(a,y1,mx,my,{stroke:MG,dash:true})+text(mx,my,'✕',{bold:true,size:15,color:MG})+text(mx,my-14,m.t,{size:11,color:MG});
      return arrow(a,y1,b,y2,m.t,{color:m.c||DIM,stroke:m.s||'currentColor'}); }).join('')+(extra||''),label);

  /* ---------- Module 1: layers, encapsulation, delays ---------- */
  I.p2m1=(E.p2m1||[]).concat([
   {cap:"The four delays every packet pays at every hop. Transmission is size ÷ link rate (120 µs for 1,500 bytes at 100 Mb/s); propagation is distance ÷ 200,000 km/s (5 ms for 1,000 km); queuing is the one that swings with load; processing is microseconds.",
    svg:svg(560,215,`${box(10,72,86,46,'router A',{stroke:CY})}${box(464,72,86,46,'router B',{stroke:CY})}
      ${[0,1,2,3,4].map(i=>rect(18+i*14,40,11,16,{stroke:AM})).join('')}${text(53,28,'queue: 0–100s ms',{size:10,color:AM})}
      ${line(96,95,100,95,{sw:2})}${line(170,95,464,95,{sw:2})}${rect(100,86,70,18,{stroke:CY,fill:CY,op:0.25})}${text(135,95,'packet',{size:10})}
      ${arrow(178,80,456,80,'')}${text(318,66,'propagation = d ÷ s',{size:11,color:MG})}
      ${text(135,128,'transmission = L ÷ R',{size:11,color:CY})}${text(135,144,'12,000 bits ÷ 100 Mb/s = 120 µs',{size:10,color:DIM})}
      ${text(370,128,'1,000 km ÷ 200,000 km/s',{size:10,color:DIM})}${text(370,144,'= 5 ms, at any link rate',{size:10,color:DIM})}
      ${text(507,134,'processing: µs',{size:10})}
      ${text(95,190,'long path → propagation wins',{size:10,color:AM})}${text(280,190,'slow link → transmission wins',{size:10,color:AM})}${text(465,190,'busy link → queuing wins',{size:10,color:AM})}`,'Processing, queuing, transmission and propagation delay on one link')},
   {cap:"Why a perfect gigabit speed test reads about 941 Mb/s. Every full frame occupies 1,538 byte-times on the wire but carries only 1,448 bytes of your data; the other 90 are preamble, headers, TCP options, checksum and the inter-frame gap. At 100 Mb/s the same ratio gives 94 Mb/s — the signature of a cable with a broken pair.",
    svg:svg(560,175,`${text(280,20,'one full frame = 1,538 byte-times on the wire',{bold:true,size:11})}
      ${text(36,40,'wire only',{size:9,color:DIM})}${text(524,40,'wire only',{size:9,color:DIM})}
      ${box(10,50,52,40,'pre+SFD\n8',{stroke:DIM,dash:true,size:10})}${box(62,50,52,40,'Ethernet\n14',{stroke:AM,size:10})}${box(114,50,52,40,'IPv4\n20',{stroke:AM,size:10})}${box(166,50,52,40,'TCP\n20+12',{stroke:AM,size:10})}
      ${box(218,50,228,40,'your data\n1,448 bytes',{stroke:LM,bold:true})}${box(446,50,52,40,'FCS\n4',{stroke:AM,size:10})}${box(498,50,52,40,'gap\n12',{stroke:DIM,dash:true,size:10})}
      ${text(280,108,'90 bytes of overhead per frame',{size:10,color:MG})}
      ${text(280,132,'1,448 ÷ 1,538 = 94.1%  →  941 Mb/s on 1 Gb/s',{size:12,color:LM})}
      ${text(280,158,'94 Mb/s wired? one pair is broken',{size:10,color:AM})}`,'Ethernet frame overhead and resulting goodput')}
  ]);

  /* ---------- Module 2: link layer ---------- */
  // keep the original home-network figure, but right-align its one label that ran past the 560-wide viewBox
  const fitHome=f=>(f&&f.svg&&f.svg.indexOf('<text x="420" y="80" text-anchor="start"')>=0)?{cap:f.cap,svg:f.svg.replace('<text x="420" y="80" text-anchor="start"','<text x="552" y="80" text-anchor="end"')}:f;
  I.p2m2=(E.p2m2||[]).map(fitHome).concat([
   {cap:"The 802.1Q tag: four bytes inserted after the source MAC. The 0x8100 TPID announces it, three priority bits let voice go first, and the 12-bit VLAN ID allows 4,094 usable VLANs. Access ports strip it; trunks keep it.",
    svg:svg(560,195,`${box(10,30,70,36,'dst MAC\n6',{size:11})}${box(80,30,70,36,'src MAC\n6',{size:11})}${box(150,30,90,36,'802.1Q tag\n4',{stroke:MG,bold:true,size:11})}${box(240,30,70,36,'EtherType\n2',{size:11})}${box(310,30,170,36,'payload\n46–1,500',{size:11})}${box(480,30,70,36,'FCS\n4',{size:11})}
      ${line(150,66,60,110,{dash:true,stroke:MG})}${line(240,66,500,110,{dash:true,stroke:MG})}
      ${box(60,110,160,40,'TPID 0x8100\n16 bits',{stroke:AM,size:11})}${box(220,110,70,40,'PCP\n3 bits',{size:11})}${box(290,110,50,40,'DEI\n1 bit',{size:10})}${box(340,110,160,40,'VLAN ID\n12 bits',{stroke:CY,bold:true,size:11})}
      ${text(150,176,'12 bits → 4,094 usable VLANs',{size:10,color:CY})}${text(420,176,'tagged frame up to 1,522 bytes',{size:10,color:DIM})}`,'Ethernet frame with an 802.1Q tag expanded into TPID, PCP, DEI and VLAN ID')},
   {cap:"How a switch learns. It records the source MAC of every frame against the port it arrived on, floods frames for destinations it has not learned yet, and forwards out one port once it knows. After that, A↔B traffic never reaches C.",
    svg:svg(560,215,`${box(100,20,130,40,'switch',{stroke:CY,bold:true})}
      ${box(20,140,70,30,'A · port 1',{size:11})}${box(130,140,70,30,'B · port 2',{size:11})}${box(240,140,70,30,'C · port 3',{size:11})}
      ${line(165,60,55,140)}${line(165,60,165,140)}${line(165,60,275,140)}
      ${box(345,18,205,52,'1. A → B: learn A = port 1\nB unknown → flood 2 and 3',{stroke:AM,size:11})}
      ${box(345,80,205,52,'2. B → A: learn B = port 2\nA known → port 1 only',{stroke:LM,size:11})}
      ${box(345,142,205,52,'3. table: A → 1, B → 2\nC never sees A ↔ B',{stroke:CY,size:11})}
      ${text(165,198,'entries age out after 300 s',{size:10,color:DIM})}`,'Switch MAC learning in three steps')},
   {cap:"Why only channels 1, 6 and 11 work together at 2.4 GHz: each channel is 20 MHz wide but centers are only 5 MHz apart. A plan using 4 and 8 overlaps its neighbors and creates interference that CSMA/CA cannot coordinate.",
    svg:svg(560,200,`${text(250,18,'2.4 GHz: 20 MHz wide, 5 MHz apart',{bold:true,size:11})}
      ${line(20,150,540,150)}
      ${[4,8].map(n=>{ const c=90+(n-1)*36; return `<path d="M${c-72} 150 Q${c} 30 ${c+72} 150" fill="none" stroke="${MG}" stroke-width="1.4" stroke-dasharray="5 4"/>`; }).join('')}
      ${[1,6,11].map(n=>{ const c=90+(n-1)*36; return `<path d="M${c-72} 150 Q${c} 30 ${c+72} 150" fill="none" stroke="${CY}" stroke-width="2"/>`; }).join('')}
      ${[1,2,3,4,5,6,7,8,9,10,11].map(n=>text(90+(n-1)*36,164,String(n),{size:10,color:[1,6,11].includes(n)?CY:([4,8].includes(n)?MG:DIM),bold:[1,6,11].includes(n)})).join('')}
      ${text(495,40,'1 · 6 · 11 clean',{size:10,color:CY})}${text(495,56,'4 and 8 overlap',{size:10,color:MG})}
      ${text(280,188,'ch1 = 2,412 MHz · ch6 = 2,437 · ch11 = 2,462',{size:10,color:DIM})}`,'Overlapping 2.4 GHz Wi-Fi channels with 1, 6 and 11 highlighted')}
  ]);

  /* ---------- Module 3: IPv4, VLSM, routing, DHCP ---------- */
  I.p2m3=(E.p2m3||[]).concat([
   {cap:"A VLSM plan for 192.168.20.0/24, drawn to scale (2 pixels per address): the 100-host LAN gets a /25, the 50-host LAN a /26, the 25-host LAN a /27, three router links get /30s, and 20 addresses stay free. Equal /26s would have failed the biggest LAN.",
    svg:svg(560,190,`${text(276,26,'192.168.20.0/24 — largest need first',{bold:true,size:12})}
      ${box(20,50,256,46,'LAN A /25\n.0–.127 · 126 hosts',{stroke:CY})}${box(276,50,128,46,'LAN B /26\n.128–.191',{stroke:LM})}${box(404,50,64,46,'C /27\n.192–.223',{stroke:AM,size:10})}
      ${rect(468,50,24,46,{stroke:MG})}${rect(492,50,40,46,{stroke:DIM,dash:true})}
      ${line(480,96,480,109,{stroke:MG})}${text(466,118,'3 × /30 links',{size:10,color:MG})}
      ${line(512,96,512,128,{stroke:DIM})}${text(505,138,'free .236–.255',{size:10,color:DIM})}
      ${text(200,165,'equal /26s fail LAN A: 100 > 62',{size:10,color:AM})}`,'VLSM allocation of a /24 into /25, /26, /27 and /30 subnets')},
   {cap:"Longest-prefix match: a packet for 10.1.5.9 matches four routes, and the most specific one (/24 via R3) wins. Administrative distance and metric only matter between routes to the same prefix.",
    svg:svg(560,200,`${text(280,18,'packet to 10.1.5.9 — which route?',{bold:true,size:12})}
      ${[['0.0.0.0/0  via ISP','matches, 0 bits',DIM],['10.0.0.0/8  via R1','matches, 8 bits',DIM],['10.1.0.0/16  via R2','matches, 16 bits',DIM],['10.1.5.0/24  via R3','matches, 24 bits → wins',LM]].map((r,i)=>box(20,34+i*36,250,28,r[0],{mono:true,size:11,stroke:i===3?LM:'currentColor',bold:i===3})+text(290,48+i*36,r[1],{anchor:'start',size:11,color:r[2],bold:i===3})).join('')}
      ${text(280,188,'most specific route wins',{size:11,color:AM})}`,'Routing table lookup by longest prefix match')},
   {cap:"DHCP's four messages. The client has no address, so it broadcasts from 0.0.0.0; the server offers a lease; the client broadcasts its choice so other servers withdraw; the ACK delivers mask, gateway and DNS. Across VLANs a relay forwards the broadcast as unicast.",
    svg:lad(560,232,'client (no IP yet)','DHCP server',[
      {y:46,d:'r',t:'DISCOVER  0.0.0.0 → 255.255.255.255',c:AM},
      {y:86,d:'l',t:'OFFER  10.4.7.201 · lease 8 h'},
      {y:126,d:'r',t:'REQUEST  (broadcast) I accept',c:AM},
      {y:166,d:'l',t:'ACK  mask · router · DNS',c:LM}],
      text(280,214,'renew at 50% (T1) · rebind at 87.5% (T2)',{size:10,color:DIM}),'DHCP Discover, Offer, Request, Acknowledge sequence')}
  ]);

  /* ---------- Module 4: transport ---------- */
  I.p2m4=(E.p2m4||[]).concat([
   {cap:"Sequence and acknowledgment numbers count bytes. When the segment at 2461 is lost, the receiver keeps asking for 2461 (a duplicate ACK) and uses SACK to say what it already holds, so the sender resends only the hole.",
    svg:lad(560,252,'sender','receiver',[
      {y:44,d:'r',t:'seq 1001 · 1,460 bytes'},
      {y:74,d:'l',t:'ack 2461',c:CY},
      {y:112,d:'r',t:'seq 2461 lost',lost:true},
      {y:134,d:'r',t:'seq 3921 · 1,460 bytes'},
      {y:164,d:'l',t:'dup ack 2461 · SACK 3921–5381',c:MG},
      {y:194,d:'r',t:'resend seq 2461',c:AM},
      {y:224,d:'l',t:'ack 5381 — hole filled',c:LM}],'', 'TCP sequence numbers, a lost segment, duplicate ACK with SACK and retransmission')},
   {cap:"The congestion window over time: slow start doubles it every round trip, congestion avoidance adds one segment per round trip, a loss detected by duplicate ACKs cuts it (to half for Reno, 0.7× for CUBIC), and a timeout drops it to one segment.",
    svg:svg(560,225,`${line(50,190,535,190)}${line(50,190,50,20)}${text(290,210,'time (round trips) →',{size:10,color:DIM})}${text(30,105,'cwnd',{size:10,color:DIM})}
      <polyline points="50,187 80,184 110,178 140,166 170,142 200,94 205,142 330,100 335,127 450,96 455,187 480,184 505,176 530,160" fill="none" stroke="${CY}" stroke-width="2"/>
      ${text(95,120,'slow start',{size:10,color:CY})}${text(95,133,'×2 per RTT',{size:10,color:CY})}
      ${text(200,80,'loss: ×0.5',{size:10,color:MG})}${text(268,160,'+1 segment per RTT',{size:10,color:LM})}
      ${text(335,86,'CUBIC: ×0.7',{size:10,color:MG})}${text(502,112,'timeout →',{size:10,color:AM})}${text(502,126,'1 segment',{size:10,color:AM})}`,'Congestion window sawtooth with slow start, additive increase, multiplicative decrease and timeout')},
   {cap:"The bandwidth-delay product as a pipe: 1 Gb/s wide and 80 ms long holds 10 MB. A 64 KB window leaves it more than 99% empty (about 6.5 Mb/s); only a window as large as the pipe fills it.",
    svg:svg(560,195,`${text(280,20,'pipe: 1 Gb/s wide × 80 ms long = 10 MB',{bold:true,size:11})}
      ${rect(40,36,480,44,{stroke:CY,rx:10})}${rect(44,40,5,36,{stroke:MG,fill:MG,op:0.6,rx:1})}${text(290,58,'64 KB in flight → 0.6% full → 6.5 Mb/s',{size:11,color:MG})}
      ${rect(40,100,480,44,{stroke:CY,rx:10,fill:CY,op:0.2})}${text(280,122,'10 MB in flight → full → ~1 Gb/s',{size:11,color:LM})}
      ${text(280,172,'window needed = bandwidth × RTT',{size:11,color:AM})}`,'Bandwidth-delay product drawn as a pipe partly and fully filled')}
  ]);

  /* ---------- Module 5: DNS, HTTP, TLS ---------- */
  I.p2m5=(E.p2m5||[]).concat([
   {cap:"The TLS 1.3 handshake in one round trip. The key shares in ClientHello and ServerHello give both sides the same secret, so everything after ServerHello is already encrypted (braces): the certificate, the signature proving the server holds its key, and the Finished messages.",
    svg:lad(560,252,'client','server',[
      {y:44,d:'r',t:'ClientHello · key share · SNI · ALPN',c:AM},
      {y:84,d:'l',t:'ServerHello · key share',c:CY},
      {y:114,d:'l',t:'{Certificate · CertificateVerify · Finished}',c:MG},
      {y:154,d:'r',t:'{Finished}',c:MG},
      {y:184,d:'r',t:'{GET /}  application data',c:LM},
      {y:214,d:'l',t:'{200 OK}',c:LM}],
      text(527,104,'1 RTT',{bold:true,size:11,color:AM})+text(280,244,'{ } = encrypted',{size:10,color:DIM}),'TLS 1.3 full handshake message sequence')},
   {cap:"DNS changes do not propagate; caches expire. A resolver that cached the record at 11:59 keeps serving the old address until its TTL runs out: until 12:59 with TTL 3,600, until 12:04 with TTL 300. Lower the TTL a full old-TTL before the change.",
    svg:svg(560,195,`${line(40,80,520,80,{stroke:DIM})}${line(40,140,520,140,{stroke:DIM})}
      ${line(280,32,280,160,{dash:true,stroke:AM})}${text(280,24,'record changed 12:00',{size:10,color:AM})}
      ${text(40,64,'TTL 3,600',{anchor:'start',size:11,bold:true})}${rect(276,70,240,20,{stroke:MG,fill:MG,op:0.25})}${text(400,104,'old address until 12:59',{size:10,color:MG})}
      ${text(40,124,'TTL 300',{anchor:'start',size:11,bold:true})}${rect(276,130,20,20,{stroke:LM,fill:LM,op:0.35})}${text(360,164,'stale only until 12:04',{size:10,color:LM})}
      ${text(40,184,'11:00',{anchor:'start',size:10,color:DIM})}${text(280,184,'12:00',{size:10,color:DIM})}${text(520,184,'13:00',{anchor:'end',size:10,color:DIM})}`,'Timeline of cached DNS records with long and short TTLs')},
   {cap:"Head-of-line blocking. HTTP/2 interleaves all streams in one TCP byte stream, so one lost packet stalls every stream until it is resent; HTTP/3 over QUIC keeps streams independent, so only the stream that lost a packet waits.",
    svg:compare({t:'HTTP/2 over TCP',draw:x=>[1,2,3,1,2,3,1,2].map((s,i)=>rect(x+18+i*28,52,24,24,{stroke:i===3?MG:(i>3?DIM:CY),dash:i>3})+text(x+30+i*28,64,i===3?'✕':String(s),{size:11,bold:i===3,color:i===3?MG:(i>3?DIM:'currentColor')})).join('')+text(x+130,104,'one lost packet stalls',{size:10,color:MG})+text(x+130,120,'every stream behind it',{size:10,color:MG})},
      {t:'HTTP/3 over QUIC',draw:x=>[1,2,3].map((s,r)=>text(x+26,58+r*30,'S'+s,{size:11,bold:true})+[0,1,2,3,4,5].map(i=>{ const lost=(r===1&&i===2), wait=(r===1&&i>2); return rect(x+44+i*30,47+r*30,24,20,{stroke:lost?MG:(wait?DIM:LM),dash:wait})+(lost?text(x+56+i*30,57+r*30,'✕',{size:11,bold:true,color:MG}):''); }).join('')).join('')+text(x+130,150,'only stream 2 waits',{size:10,color:LM})},{h:170,label:'Head-of-line blocking in HTTP/2 versus HTTP/3'})}
  ]);

  /* ---------- Module 6: the physical internet ---------- */
  I.p2m6=(E.p2m6||[]).concat([
   {cap:"The 2008 YouTube hijack in one picture: YouTube's AS announced a /22; another AS announced a /24 inside it. Routers everywhere prefer the more specific prefix (longest-prefix match), so traffic followed the /24. RPKI route-origin validation would mark that /24 invalid.",
    svg:svg(560,210,`${box(20,30,150,50,'AS 36561 (YouTube)\nannounces /22',{stroke:CY})}${box(20,130,150,50,'AS 17557\nannounces /24',{stroke:MG})}
      ${box(330,80,210,60,'router elsewhere\n/22 vs /24 → picks /24',{stroke:AM})}
      ${arrow(172,55,328,98,'208.65.152.0/22',{color:CY})}${arrow(172,155,328,124,'208.65.153.0/24',{color:MG})}
      ${text(435,160,'RPKI: /24 would be invalid',{size:10,color:LM})}${text(280,198,'more specific wins → traffic diverted',{size:10,color:MG})}`,'BGP hijack through a more-specific prefix announcement')},
   {cap:"A GPON optical budget, to scale. Class B+ optics allow 28 dB; 20 km of fiber, the 1:32 splitter, four connectors and ten splices use 27.5 dB, leaving 0.5 dB — one dirty connector and the customers on this tree go dark.",
    svg:svg(560,225,`${box(10,24,70,38,'OLT',{stroke:CY,bold:true})}${line(80,43,200,43,{sw:1.6})}${text(140,34,'20 km feeder',{size:10,color:DIM})}
      <path d="M200 43 L240 26 L240 60 Z" fill="none" stroke="${MG}" stroke-width="1.4"/>${text(220,76,'1:32',{size:10,color:MG})}
      ${line(240,30,300,25)}${line(240,43,300,43)}${line(240,56,300,61)}${box(300,15,50,20,'ONT',{size:10})}${box(300,33,50,20,'ONT',{size:10})}${box(300,51,50,20,'ONT',{size:10})}${text(392,43,'× 32 homes',{size:10,color:DIM})}
      ${text(480,24,'GPON B+ budget 28 dB',{size:11,bold:true})}
      ${text(20,102,'loss budget, OLT → ONT',{anchor:'start',size:10,color:DIM})}
      ${box(20,110,130,36,'fiber 7.0',{stroke:CY,size:11})}${box(150,110,325,36,'splitter 1:32 · 17.5 dB',{stroke:MG,size:11})}${rect(475,110,37,36,{stroke:AM})}${rect(512,110,19,36,{stroke:AM})}${rect(531,110,9,36,{stroke:LM,dash:true})}
      ${line(493,146,493,162)}${text(488,166,'connectors 2.0',{anchor:'end',size:10,color:AM})}${line(521,146,521,178)}${text(516,182,'splices 1.0',{anchor:'end',size:10,color:AM})}${line(535,146,535,194)}${text(530,198,'margin 0.5 dB',{anchor:'end',size:10,color:LM})}
      ${text(150,192,'total 27.5 of 28 dB',{size:11,color:AM})}`,'PON schematic and optical loss budget bar')},
   {cap:"Latency is distance: light in fiber covers about 200 km per millisecond, so every 100 km of cable adds about 1 ms of round trip. These are the floors; real paths are 1.3–1.5 times longer than the straight line and add equipment delay.",
    svg:svg(560,200,`${text(280,18,'minimum RTT ≈ 1 ms per 100 km',{bold:true,size:11})}
      ${[['Dallas–Ashburn 2,100 km',21],['New York–London 5,500 km',55],['LA–Tokyo 9,000 km',90],['New York–Sydney 16,000 km',160]].map((r,i)=>text(10,48+i*34,r[0],{anchor:'start',size:10})+rect(170,38+i*34,r[1]*2.125,20,{stroke:CY,fill:CY,op:0.25})+text(176+r[1]*2.125,48+i*34,r[1]+' ms',{anchor:'start',size:10,color:CY})).join('')}
      ${text(280,186,'real paths: 1.3–1.5× longer, plus equipment',{size:10,color:DIM})}`,'Minimum round-trip time for four city pairs')}
  ]);

  /* ---------- Module 7: operations and troubleshooting ---------- */
  I.p2m7=(E.p2m7||[]).concat([
   {cap:"CompTIA's seven-step troubleshooting methodology, in the order the exam expects. Step 1 includes the question that solves most tickets — what changed? — and step 7 is what makes the next ticket five minutes long.",
    svg:flow([{t:'1 identify\nwhat changed?',stroke:AM},{t:'2 theory\nprobable cause'},{t:'3 test\nconfirm or rethink'},{t:'4 plan\n+ side effects'},{t:'5 implement\nor escalate',stroke:CY},{t:'6 verify\n+ prevent',stroke:LM},{t:'7 document\nlessons learned',stroke:MG}],{perRow:4,bw:118,bh:56,gap:22,label:'Seven-step troubleshooting methodology'})},
   {cap:"Reading mtr. Loss at a single middle hop with clean hops after it is a router rate-limiting its own ICMP replies — ignore it. Loss that starts at a hop and persists to the destination is real, and that first lossy hop is where to look.",
    svg:compare({t:'loss at one hop only',draw:x=>[0,0,0,38,0,0].map((v,i)=>rect(x+40+i*34,120-Math.max(v*2,2),22,Math.max(v*2,2),{stroke:v?MG:LM,fill:v?MG:LM,op:0.4,rx:1})+text(x+51+i*34,132,String(i+1),{size:10,color:DIM})).join('')+text(x+153,38,'38%',{size:10,color:MG})+text(x+130,152,'rate-limited ICMP: ignore',{size:10,color:LM})},
      {t:'loss from hop 4 to the end',draw:x=>[0,0,0,12,12,12].map((v,i)=>rect(x+40+i*34,120-Math.max(v*2,2),22,Math.max(v*2,2),{stroke:v?MG:LM,fill:v?MG:LM,op:0.4,rx:1})+text(x+51+i*34,132,String(i+1),{size:10,color:DIM})).join('')+text(x+187,86,'12% each',{size:10,color:MG})+text(x+130,152,'real loss: report hop 4',{size:10,color:MG})},{h:178,label:'Interpreting per-hop loss in mtr'})},
   {cap:"MTU arithmetic. A ping with -s 1472 fills exactly one 1,500-byte packet; each layer of encapsulation subtracts its overhead, and when the 'fragmentation needed' ICMP is filtered, anything bigger than the result disappears silently.",
    svg:svg(560,190,`${text(280,16,'ping -M do -s 1472 fills exactly 1,500',{bold:true,size:11})}
      ${box(60,28,80,34,'IP header\n20',{stroke:AM,size:11})}${box(140,28,80,34,'ICMP\n8',{stroke:AM,size:11})}${box(220,28,280,34,'data 1,472 (the -s value)',{stroke:CY,size:11})}
      ${[['path MTU\n1,500',DIM],['PPPoE −8\n1,492',AM],['WireGuard −60\n1,432 inside',MG],['IP+TCP −40\nMSS 1,392',LM]].map((b,i)=>box(10+i*140,92,120,46,b[0],{stroke:b[1],size:11})).join('')}
      ${arrow(130,115,148,115,'')}${arrow(270,115,288,115,'')}${arrow(410,115,428,115,'')}
      ${text(280,170,'too big + ICMP filtered = silent black hole',{size:10,color:MG})}`,'Packet size arithmetic for ping tests, PPPoE and WireGuard')}
  ]);

  /* ---------- Module 8: IPv6 (new) ---------- */
  I.p2m8=[
   {cap:"An IPv6 /64 decoded. The first 48 bits come from your ISP or registry, the next 16 are yours to plan (here: site 1, block 0, VLAN 20), and the last 64 are the interface ID the host chooses itself.",
    svg:svg(560,170,`${text(280,18,'2001:db8:abcd:1020::/64 decoded',{bold:true,size:12})}
      ${box(20,34,195,44,'2001:db8:abcd\nrouting prefix · 48 bits',{stroke:AM,size:11})}${box(215,34,65,44,'1020\nsubnet\n16 bits',{stroke:CY,size:10})}${box(280,34,260,44,'interface ID · 64 bits\nSLAAC, EUI-64 or random',{stroke:LM,size:11})}
      ${text(117,94,'from your ISP or RIR',{size:10,color:DIM})}${text(247,94,'yours',{size:10,color:DIM})}${text(410,94,'chosen by the host',{size:10,color:DIM})}
      ${text(280,124,'subnet 1020 = site 1 · block 0 · VLAN 20',{size:11,color:CY})}
      ${text(280,150,'a /48 holds 65,536 such /64s',{size:10,color:AM})}`,'IPv6 address split into routing prefix, subnet ID and interface ID')},
   {cap:"Modified EUI-64: split the MAC, insert FFFE in the middle, and flip the universal/local bit (0x02) of the first byte. The ff:fe in the middle of an interface ID gives it away; modern systems prefer random stable or temporary IDs for privacy.",
    svg:flow([{t:'MAC\n3C:5A:B4:12:34:56'},{t:'split, insert FFFE\n3C5AB4 FFFE 123456',stroke:AM},{t:'flip bit 0x02\n3C → 3E',stroke:MG},{t:'interface ID\n3e5a:b4ff:fe12:3456',stroke:LM}],{bw:118,bh:58,gap:22,label:'Deriving a modified EUI-64 interface ID from a MAC address'})},
   {cap:"SLAAC on the wire. The host forms a link-local address, checks it is unique with a Neighbor Solicitation from ::, asks all routers for an advertisement, builds global addresses from the advertised /64 and checks those too. Its default gateway is the router's link-local address.",
    svg:lad(560,240,'host','router / link',[
      {y:48,d:'r',t:'NS from :: → solicited-node (DAD)',c:AM},
      {y:88,d:'r',t:'RS → ff02::2 all routers'},
      {y:128,d:'l',t:'RA: prefix /64 · A, M, O · lifetime',c:CY},
      {y:168,d:'r',t:'NS again: DAD on global address',c:AM}],
      text(78,36,'1. link-local fe80:: first',{anchor:'start',size:9,color:DIM})+text(280,214,'default route via fe80::1 (router link-local)',{size:10,color:LM}),'SLAAC message sequence: duplicate address detection, router solicitation and advertisement')},
   {cap:"Prefix delegation: the ISP's DHCPv6 server hands the customer router a /56, and the router advertises one /64 per LAN. 256 subnets from one delegation — and a reason to refuse an ISP that gives out only a /64.",
    svg:svg(560,195,`${box(20,20,130,46,'ISP DHCPv6\n(behind the OLT)',{stroke:AM,size:11})}${arrow(150,43,228,43,'IA_PD /56')}${box(230,20,140,46,'home router\n2001:db8:42:ab00::/56',{stroke:CY,size:10})}${text(455,43,'256 × /64',{size:11,color:LM,bold:true})}
      ${box(20,120,160,44,'LAN\n…:ab00::/64',{size:11})}${box(200,120,160,44,'guest\n…:ab01::/64',{size:11})}${box(380,120,160,44,'IoT\n…:ab10::/64',{stroke:LM,size:11})}
      ${arrow(300,66,100,118,'')}${arrow(300,66,280,118,'')}${arrow(300,66,460,118,'')}${text(410,96,'one RA per LAN',{size:10,color:DIM})}
      ${text(280,184,'only a /64 from the ISP? no subnets',{size:10,color:MG})}`,'DHCPv6 prefix delegation from ISP to home router to LANs')}
  ];

  /* ---------- Module 9: securing the network (new) ---------- */
  I.p2m9=[
   {cap:"A stateful firewall checks the first packet of a flow against its rules, then records it. Replies match the state entry and pass without any inbound rule; an unsolicited packet from outside matches nothing and meets the default deny.",
    svg:svg(560,230,`${text(280,20,'rules once, then the state table',{bold:true,size:11})}
      ${box(10,80,100,46,'laptop\n192.168.1.57',{stroke:CY,size:11})}${box(220,50,120,96,'',{stroke:AM})}${text(280,64,'stateful firewall',{bold:true,size:11,color:AM})}${text(280,88,'57:51515 ↔ .20:443',{mono:true,size:9})}${text(280,104,'ESTABLISHED',{mono:true,size:9,color:LM})}${text(280,120,'timeout 5 days',{mono:true,size:9,color:DIM})}
      ${box(450,80,100,46,'server\n198.51.100.20',{stroke:MG,size:11})}
      ${arrow(112,92,218,92,'SYN')}${arrow(342,92,448,92,'SYN')}${arrow(448,114,342,114,'SYN-ACK')}${arrow(218,114,112,114,'state match')}
      ${box(450,170,100,36,'stranger',{stroke:DIM,dash:true,size:11})}${arrow(448,186,342,140,'',{stroke:MG})}${text(300,200,'no state → default deny',{size:10,color:MG})}`,'Stateful firewall allowing replies by state and dropping unsolicited traffic')},
   {cap:"Segmentation: the firewall's default deny sits between zones, and each zone gets only the flows it needs — 443 into the screened subnet, the inside out through a proxy, management only from a jump host, guests and IoT to the internet and nowhere else.",
    svg:svg(560,230,`${box(10,92,90,44,'internet',{stroke:DIM})}${box(150,78,110,72,'firewall\ndefault deny',{stroke:AM,bold:true})}${arrow(100,114,148,114,'')}
      ${box(330,8,220,44,'screened subnet (DMZ)\ninternet → 443 only',{stroke:MG,size:11})}${box(330,60,220,44,'inside · staff\nout via proxy',{stroke:CY,size:11})}${box(330,112,220,44,'management\nfrom jump host only',{stroke:LM,size:11})}${box(330,164,220,44,'guest · IoT · cameras\ninternet only',{stroke:DIM,size:11})}
      ${arrow(260,100,328,30,'')}${arrow(260,108,328,82,'')}${arrow(260,120,328,134,'')}${arrow(260,128,328,186,'')}
      ${text(140,200,'zone = VLAN + subnet + rules',{size:10,color:DIM})}`,'Firewall zones: screened subnet, inside, management and guest')},
   {cap:"WireGuard's overhead over IPv6: 40 bytes of outer IPv6, 8 of UDP, 16 of WireGuard header and a 16-byte authentication tag — 80 bytes, so a 1,500-byte path leaves 1,420 for the inner packet (60 bytes and 1,440 over IPv4).",
    svg:svg(560,170,`${text(280,18,'WireGuard over IPv6 on a 1,500-byte path',{bold:true,size:11})}
      ${box(10,36,80,40,'outer IPv6\n40',{stroke:AM,size:11})}${box(90,36,60,40,'UDP\n8',{stroke:AM,size:11})}${box(150,36,80,40,'WG header\n16',{stroke:AM,size:11})}${box(230,36,240,40,'inner packet ≤ 1,420',{stroke:CY,bold:true})}${box(470,36,80,40,'auth tag\n16',{stroke:AM,size:11})}
      ${text(280,98,'80 bytes overhead (60 over IPv4)',{size:10,color:MG})}
      ${text(280,124,'inner MTU 1,420 · TCP MSS 1,380',{size:11,color:LM})}
      ${text(280,150,'behind PPPoE: subtract 8 more',{size:10,color:AM})}`,'WireGuard encapsulation overhead and resulting MTU')},
   {cap:"802.1X roles: the supplicant talks EAP to the switch or access point (the authenticator), which relays it to a RADIUS server; only after an accept does the port forward traffic, optionally into a VLAN chosen for that user.",
    svg:flow([{t:'supplicant\nlaptop or phone',stroke:CY},{t:'authenticator\nswitch or AP',stroke:AM,edge:'EAPOL'},{t:'RADIUS server\nUDP 1812',stroke:LM,edge:'RADIUS'},{t:'port opens\nin assigned VLAN',stroke:MG,edge:'accept'}],{perRow:2,bw:170,bh:56,gap:110,label:'802.1X supplicant, authenticator and RADIUS server'})}
  ];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
