/* Illustrations — Domain 27: Enterprise Networking (Cisco CCNA), built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  /* ================= DOMAIN 27: CCNA ================= */
  I.p27m1=[{cap:"The three-tier campus. Every access switch uplinks to both distribution switches, every distribution switch to both cores; one failure costs capacity, never connectivity. A collapsed core merges the two upper rows into one redundant pair.",
    svg:svg(560,262,`${box(150,14,110,40,'CORE A\nfast · no policy',{stroke:CY,size:10})}${box(300,14,110,40,'CORE B\nfast · no policy',{stroke:CY,size:10})}${line(260,34,300,34)}
      ${box(100,96,140,46,'DISTRIBUTION 1\nSVIs · HSRP · ACLs',{stroke:AM,size:10})}${box(320,96,140,46,'DISTRIBUTION 2\nSVIs · HSRP · ACLs',{stroke:AM,size:10})}
      ${line(170,96,205,54)}${line(170,96,355,54)}${line(390,96,205,54)}${line(390,96,355,54)}
      ${[20,155,290,425].map(x=>box(x,186,115,44,'ACCESS\n48 × 1G · PoE',{stroke:LM,size:10})+line(x+57,186,170,142)+line(x+57,186,390,142)).join('')}
      ${text(280,250,'uplinks 2 × 10G per access switch → 48:20 = 2.4:1 oversubscription',{size:10,color:DIM})}`,'Three-tier campus hierarchy with redundant uplinks')},
   {cap:"Spine-leaf: every leaf connects to every spine and spines connect only to leaves, so any two servers are two hops apart and traffic spreads across all spines (ECMP) instead of being blocked by Spanning Tree.",
    svg:svg(560,200,`${[100,230,360].map(x=>box(x,16,100,40,'SPINE',{stroke:CY,bold:true})).join('')}
      ${[20,160,300,440].map(x=>box(x,112,100,40,'LEAF',{stroke:LM,bold:true})+[150,280,410].map(sx=>line(x+50,112,sx,56)).join('')+text(x+50,172,'servers 48 × 25G',{size:10,color:DIM})).join('')}
      ${text(280,190,'leaf → spine → leaf: two hops, 4 × 100G uplinks per leaf = 3:1',{size:10,color:DIM})}`,'Spine-leaf fabric')},
   {cap:"IOS modes. The prompt tells you where you are; nothing you type is saved until copy running-config startup-config writes RAM to NVRAM.",
    svg:stack([{t:'Switch>   user EXEC — look only (ping, few show)',side:'enable ↓',stroke:DIM},{t:'Switch#   privileged EXEC — show · debug · copy · reload',side:'configure terminal ↓',stroke:CY},{t:'Switch(config)#   global configuration',side:'interface g0/1 ↓',stroke:AM},{t:'Switch(config-if)#   interface configuration',side:'exit · end · Ctrl-Z ↑',stroke:MG}],{w:350,side:true,label:'Cisco IOS command modes'})}];
  I.p27m2=[{cap:"An 802.1Q tag is four bytes inserted after the source MAC: TPID 0x8100 announces the tag; the 12-bit VLAN ID allows 4,094 VLANs. Native-VLAN frames travel with no tag at all.",
    svg:svg(560,150,`${box(10,30,70,44,'Dst MAC\n6',{size:10})}${box(80,30,70,44,'Src MAC\n6',{size:10})}${box(150,30,70,44,'TPID\n0x8100',{stroke:MG,size:10})}${box(220,30,90,44,'PCP·DEI·VID\n3+1+12 bits',{stroke:MG,size:10})}${box(310,30,60,44,'Type\n2',{size:10})}${box(370,30,120,44,'Payload\n46–1500',{size:10})}${box(490,30,60,44,'FCS\n4',{size:10})}
      ${line(150,84,310,84,{stroke:MG})}${line(150,78,150,84,{stroke:MG})}${line(310,78,310,84,{stroke:MG})}${text(230,98,'802.1Q tag — 4 bytes',{size:10,color:MG})}
      ${text(280,128,'VID 12 bits → 4,094 usable VLANs · native VLAN = untagged · must match both ends',{size:10,color:DIM})}`,'802.1Q tagged Ethernet frame')},
   {cap:"Spanning Tree on a triangle. SW-A wins root with priority 24,576; B and C each choose the cheapest path to it (root ports); A's ports are designated; the B–C link's far end blocks (alternate) and wakes up only if a link fails.",
    svg:svg(560,232,`${box(225,16,110,48,'SW-A  ROOT\npriority 24,576',{stroke:CY,size:10,bold:true})}${box(40,166,110,44,'SW-B\npriority 28,672',{stroke:LM,size:10})}${box(410,166,110,44,'SW-C\npriority 32,768',{stroke:LM,size:10})}
      ${line(95,166,255,64)}${line(465,166,305,64)}${line(150,188,410,188,{dash:true,stroke:MG})}
      ${text(140,105,'cost 4 (1G)',{size:10,color:DIM})}${text(420,105,'cost 4 (1G)',{size:10,color:DIM})}
      ${text(228,76,'DP',{size:10,color:CY})}${text(332,76,'DP',{size:10,color:CY})}${text(80,156,'RP',{size:10,color:LM})}${text(480,156,'RP',{size:10,color:LM})}
      ${text(280,180,'blocked / alternate',{size:10,color:MG})}${text(280,224,'bridge ID = priority + VLAN ID + MAC · lowest wins · RP = root port, DP = designated',{size:9,color:DIM})}`,'Spanning Tree root election and port roles')},
   {cap:"Two ways to route between VLANs. Router-on-a-stick sends every inter-VLAN packet across one trunk twice; an SVI on a Layer 3 switch routes in the switching ASIC at backplane speed.",
    svg:compare({t:'ROUTER-ON-A-STICK',draw:x=>box(x+70,42,120,40,'router\ng0/0.10 · g0/0.20',{stroke:CY,size:10})+line(x+130,82,x+130,118)+text(x+185,100,'trunk 1 Gbps',{size:10,color:AM})+box(x+70,118,120,36,'L2 switch\nVLAN 10 · VLAN 20',{size:10})+text(x+130,172,'each packet crosses the trunk twice',{size:10,color:DIM})},{t:'LAYER 3 SWITCH (SVI)',draw:x=>box(x+50,42,160,50,'L3 switch · ip routing\ninterface vlan 10 / vlan 20',{stroke:MG,size:10})+box(x+25,128,90,30,'VLAN 10 PC',{size:10})+box(x+145,128,90,30,'VLAN 20 PC',{size:10})+line(x+70,128,x+110,92)+line(x+190,128,x+150,92)+text(x+130,172,'routed in hardware, no trunk bottleneck',{size:10,color:DIM})},{h:190,label:'Router-on-a-stick versus SVI'})}];
  I.p27m3=[{cap:"The forwarding decision for 10.1.20.7. Longest prefix match discards everything but the two /24s; administrative distance then prefers EIGRP (90) over OSPF (110); the metric never matters because it compares only routes from one protocol.",
    svg:svg(560,232,`${text(170,20,'destination 10.1.20.7 — candidate routes',{bold:true,color:CY,size:11})}
      ${[['S*  0.0.0.0/0        AD 1',DIM],['S   10.0.0.0/8       AD 1',DIM],['O   10.1.0.0/16      AD 110  cost 20',DIM],['O   10.1.20.0/24     AD 110  cost 130',AM],['D   10.1.20.0/24     AD 90   ← installed',LM]].map(([t,c],i)=>box(14,34+i*36,312,30,t,{mono:true,size:10,stroke:c,color:c})).join('')}
      ${box(350,34,196,46,'1. longest prefix match\n/24 beats /16, /8, /0',{stroke:CY,size:10})}${box(350,98,196,46,'2. lowest administrative distance\nEIGRP 90 beats OSPF 110',{stroke:AM,size:10})}${box(350,162,196,46,'3. lowest metric\nonly within one protocol',{stroke:DIM,size:10})}
      ${arrow(448,80,448,98,'')}${arrow(448,144,448,162,'')}${text(280,224,'a default route (/0) matches everything and therefore loses to anything more specific',{size:9,color:DIM})}`,'Longest prefix match, then administrative distance, then metric')},
   {cap:"OSPF neighbor states. Hellos must agree on area, subnet, timers and authentication to leave Down; an MTU mismatch stalls at ExStart; on a shared segment only the DR and BDR go to Full with everyone.",
    svg:flow([{t:'Down'},{t:'Init'},{t:'2-Way',stroke:AM},{t:'ExStart',stroke:MG},{t:'Exchange'},{t:'Loading'},{t:'Full',stroke:LM}],{bw:74,gap:50,perRow:4,edges:['hello','see me','DR/BDR','master','DBDs','LSUs'],label:'OSPF adjacency states'})},
   {cap:"EUI-64: split the 48-bit MAC, insert fffe in the middle, and flip the seventh bit of the first byte (the universal/local bit). 00 becomes 02.",
    svg:svg(560,206,`${text(280,18,'MAC  00:1a:2b:3c:4d:5e',{bold:true,color:CY,size:11})}
      ${['00','1a','2b'].map((t,i)=>box(130+i*50,32,44,30,t,{mono:true,size:12})).join('')}${['3c','4d','5e'].map((t,i)=>box(300+i*50,32,44,30,t,{mono:true,size:12})).join('')}
      ${arrow(280,66,280,88,'insert fffe')}
      ${['00','1a','2b'].map((t,i)=>box(80+i*50,92,44,30,t,{mono:true,size:12})).join('')}${['ff','fe'].map((t,i)=>box(230+i*50,92,44,30,t,{mono:true,size:12,stroke:MG,color:MG})).join('')}${['3c','4d','5e'].map((t,i)=>box(330+i*50,92,44,30,t,{mono:true,size:12})).join('')}
      ${arrow(280,126,280,148,'flip bit 7 of byte 1')}
      ${text(280,160,'0000 0000  →  0000 0010  =  0x02',{mono:true,size:11,color:AM})}
      ${box(130,174,300,26,'interface ID  021a:2bff:fe3c:4d5e',{mono:true,size:11,stroke:LM,color:LM})}`,'EUI-64 interface identifier from a MAC address')}];
  I.p27m4=[{cap:"PAT (NAT overload): many inside hosts share one public address; the router rewrites source ports and keeps a translation table so replies find their way back. When two hosts pick the same port, the router assigns a new one.",
    svg:svg(560,240,`${box(14,20,130,90,'inside  10.1.10.0/24\n.50 :51000\n.51 :51000\n.52 :40022',{stroke:LM,size:10})}${box(196,34,168,62,'R1 — PAT (overload)\nip nat inside source list 1\ninterface g0/0 overload',{stroke:CY,size:10})}${box(416,20,130,90,'outside: internet\n203.0.113.5\n(inside global)',{stroke:MG,size:10})}
      ${arrow(144,65,196,65,"")}${arrow(364,65,416,65,"")}
      ${text(280,128,'inside local : port   →   inside global : port',{size:10,color:DIM})}
      ${[['10.1.10.50:51000  →  203.0.113.5:51000',LM],['10.1.10.51:51000  →  203.0.113.5:1024',AM],['10.1.10.52:40022  →  203.0.113.5:40022',LM]].map(([t,c],i)=>box(100,140+i*26,360,22,t,{mono:true,size:10,stroke:c,color:c})).join('')}
      ${text(280,230,'show ip nat translations · ~60,000 flows per public address',{size:9,color:DIM})}`,'Port Address Translation table')},
   {cap:"An ACL is read top-down and stops at the first match; the invisible deny at the end drops anything no line permitted. Specific permits go before the broad deny.",
    svg:stack([{t:'10 permit tcp 10.1.10.0/24 → host 10.1.50.10 eq 80',stroke:LM,side:'match → permit, stop'},{t:'20 permit tcp 10.1.10.0/24 → host 10.1.50.10 eq 443',stroke:LM,side:'match → permit, stop'},{t:'30 deny ip 10.1.10.0/24 → 10.1.50.0/24 log',stroke:MG,side:'match → drop, stop'},{t:'40 permit ip any any',stroke:LM,side:'everything else'},{t:'(implicit) deny any — invisible',stroke:DIM,side:'nothing matched → drop'}],{w:330,side:true,label:'Extended ACL evaluated top-down'})},
   {cap:"IPsec ESP in tunnel mode wraps the whole original packet: a new IP header carries it between the VPN gateways, ESP encrypts everything from the original header onward and authenticates the lot.",
    svg:svg(560,150,`${box(10,30,90,44,'new IP hdr\n(gateways)',{size:10})}${box(100,30,70,44,'ESP hdr\nSPI, seq',{stroke:MG,size:10})}${box(170,30,90,44,'orig IP hdr\n(inside hosts)',{size:10})}${box(260,30,60,44,'TCP',{size:10})}${box(320,30,90,44,'data',{size:10})}${box(410,30,70,44,'ESP trailer\npad',{stroke:MG,size:10})}${box(480,30,70,44,'ESP auth\nICV',{stroke:MG,size:10})}
      ${line(170,84,480,84,{stroke:AM})}${line(170,78,170,84,{stroke:AM})}${line(480,78,480,84,{stroke:AM})}${text(325,97,'encrypted — AES-256-GCM',{size:10,color:AM})}
      ${line(100,114,550,114,{stroke:LM})}${line(100,108,100,114,{stroke:LM})}${line(550,108,550,114,{stroke:LM})}${text(325,128,'authenticated · ESP = IP protocol 50 · IKE on UDP 500 / 4500',{size:10,color:LM})}`,'IPsec ESP packet in tunnel mode')}];
  I.p27m5=[{cap:"Split-MAC wireless: lightweight APs on PoE access ports tunnel control (UDP 5246, DTLS) and client data (UDP 5247) to the controller over CAPWAP; the controller's trunk or LAG drops client traffic onto its VLAN.",
    svg:svg(560,236,`${box(120,30,170,54,'WLC — Catalyst 9800\ntrunk / LAG to the core',{stroke:CY,size:10})}${box(360,30,186,54,'campus core\nclient VLAN 20 · mgmt VLAN 99',{stroke:AM,size:10})}${arrow(290,57,360,57,'trunk')}
      ${[20,135,250].map((x,i)=>box(x,160,105,46,'AP '+(i+1)+' (local mode)\naccess port · PoE',{stroke:LM,size:9})+line(x+52,160,205,84,{stroke:DIM,dash:true})).join('')}
      ${text(300,116,'CAPWAP tunnels (dashed)\n5246 control · 5247 data',{anchor:'start',size:10,color:DIM})}
      ${box(400,160,146,46,'laptop → SSID CORP\nWPA3-Enterprise',{stroke:MG,size:10})}${line(400,183,355,183,{stroke:MG,dash:true})}${text(378,172,'Wi-Fi',{size:9,color:MG})}
      ${text(280,226,'AP: access port, tunnels everything · WLC: trunk carrying every client VLAN',{size:9,color:DIM})}`,'Lightweight APs, CAPWAP and the wireless LAN controller')},
   {cap:"802.1X has three parties. The authenticator (switch port or controller) only relays EAP; the RADIUS server checks the credential or certificate against the directory and returns Access-Accept, optionally with a VLAN.",
    svg:flow([{t:'supplicant\n(laptop)'},{t:'authenticator\n(WLC / switch)',stroke:AM},{t:'auth server\n(RADIUS: ISE)',stroke:MG},{t:'directory\n(AD / LDAP)',stroke:DIM}],{bw:98,gap:48,bh:54,edges:['EAPoL','RADIUS','LDAP'],label:'802.1X roles'})},
   {cap:"TACACS+ guards who may type which command on the devices; RADIUS decides who may join the network. Know the ports and what each encrypts.",
    svg:compare({t:'TACACS+',draw:x=>[['TCP 49',CY],['entire payload encrypted',null],['authn · authz · acct separate',null],['per-command authorization',null],['device administration',AM],['Cisco (RFC 8907)',DIM]].map(([l,c],i)=>text(x+140,50+i*22,l,{size:10,color:c||'currentColor'})).join('')},{t:'RADIUS',draw:x=>[['UDP 1812 / 1813',MG],['only the password encrypted',null],['authn + authz combined',null],['accounting separate',null],['network access: 802.1X, VPN',AM],['IETF (RFC 2865 / 2866)',DIM]].map(([l,c],i)=>text(x+140,50+i*22,l,{size:10,color:c||'currentColor'})).join('')},{h:190,label:'TACACS+ versus RADIUS'})}];
  I.p27m6=[{cap:"Controller-based networking. Applications state intent through the northbound REST API; the controller holds the map and programs devices southbound with NETCONF/RESTCONF, SSH or SNMP; the devices keep forwarding in hardware.",
    svg:stack([{t:'applications · scripts · dashboards (intent)',side:'what, not how',stroke:DIM},{t:'northbound API — REST · JSON',side:'HTTPS, tokens',stroke:CY},{t:'controller — Catalyst Center · Meraki dashboard',side:'the whole map',stroke:AM},{t:'southbound — NETCONF/YANG · RESTCONF · SSH · SNMP',side:'TCP 830 · 443 · 22',stroke:MG},{t:'devices — control plane (OSPF, STP) + data plane (ASIC)',side:'forwarding',stroke:LM}],{w:360,side:true,label:'SDN planes and APIs'})},
   {cap:"A REST exchange with Catalyst Center: log in once for a token, then carry it in every request. The verb says what you want; the status code says what happened; the body is JSON.",
    svg:svg(560,214,`${box(20,16,130,44,'script / Postman',{stroke:CY})}${box(410,16,130,44,'Catalyst Center',{stroke:AM})}
      ${arrow(150,82,410,82,'POST /dna/system/api/v1/auth/token  (basic auth)')}${arrow(410,108,150,108,'200 OK   { "Token": "eyJ…" }')}
      ${arrow(150,146,410,146,'GET /dna/intent/api/v1/network-device')}${arrow(410,172,150,172,'200 OK   [ {…}, {…} ]  JSON')}
      ${text(280,196,'header on every call: X-Auth-Token — stateless · 401 = bad token · 429 = slow down',{size:9,color:DIM})}`,'REST API token and query exchange')},
   {cap:"JSON is a tree: an object of key/value pairs whose values are strings, numbers, booleans, null, arrays or further objects. The exam shows a blob and asks what type a value is.",
    svg:tree({t:'{ }  object',kids:[{t:'hostname\n"ASW1"  string'},{t:'mgmt  { }',kids:['ip (str)','vlan 99']},{t:'poe\ntrue  boolean'},{t:'uplinks  [ ]',kids:['Gi1/0/47','Gi1/0/48']}]},{three:true,label:'JSON document as a tree'})}];
  I.p27m7=[{cap:"Divide and conquer: one ping to the gateway halves the search space. Success means the fault is beyond the gateway; failure means it is local — port, VLAN, DHCP, cable.",
    svg:svg(560,206,`${[['PC',LM],['access SW',null],['gateway SVI',CY],['core',null],['edge router',null],['internet',MG]].map(([t,c],i)=>box(17+i*90,80,76,40,t,{size:10,stroke:c||'currentColor'})+(i<5?arrow(93+i*90,100,107+i*90,100,''):'')).join('')}
      ${line(55,60,235,60,{stroke:MG})}${text(145,46,'ping gateway fails → fault is here: cable, port, VLAN, DHCP',{size:10,color:MG})}
      ${line(235,140,505,140,{stroke:LM})}${text(370,156,'ping gateway OK → fault is beyond: route, NAT, ACL, ISP',{size:10,color:LM})}
      ${text(280,190,'then halve again: traceroute, show ip route, show ip nat translations, show access-lists',{size:9,color:DIM})}`,'Divide-and-conquer troubleshooting along the path')},
   {cap:"The two status words of show ip interface brief are the first diagnosis. Read Layer 1 first, Layer 2 second.",
    svg:svg(560,196,`${text(280,18,'show ip interface brief  —  Status / Protocol',{bold:true,color:CY,size:11})}
      ${box(20,34,250,62,'up / up\nhealthy — look higher (address, route, ACL)',{stroke:LM,size:10})}${box(290,34,250,62,'up / down\nLayer 1 fine, Layer 2 dead: encapsulation,\nkeepalive, far end shut or err-disabled',{stroke:AM,size:10})}
      ${box(20,112,250,62,'down / down\ncable, optic, speed mismatch, far side off',{stroke:MG,size:10})}${box(290,112,250,62,'administratively down\nsomeone typed shutdown → no shutdown',{stroke:DIM,size:10})}
      ${text(280,188,'late collisions + CRC errors in show interfaces = duplex mismatch',{size:9,color:DIM})}`,'Interface status words and what they mean')},
   {cap:"Where the 200-301 v1.1 points come from. IP Connectivity is the heaviest domain; Automation and IP Services are the lightest. Study time should roughly follow the bars.",
    svg:svg(560,236,`${[['Network Fundamentals',20,CY],['Network Access',20,LM],['IP Connectivity',25,AM],['IP Services',10,DIM],['Security Fundamentals',15,MG],['Automation & Programmability',10,DIM]].map(([t,p,c],i)=>text(12,34+i*32,t,{anchor:'start',size:10})+box(190,22+i*32,p*14,24,p+'%',{stroke:c,color:c,bold:true,size:11})).join('')}
      ${text(280,222,'120 min · US$300 · verify v1.1/v2.0 date',{size:10,color:DIM})}`,'CCNA 200-301 exam domain weights')}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
