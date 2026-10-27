/* Illustrations — Domain 24: Fiber Optics, Telecom & the Physical Layer, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  // small raw-SVG helpers (theme-safe: colors only via the kit tokens or currentColor)
  const rect=(x,y,w,h,o={})=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(o.rx==null?6:o.rx)+'" fill="'+(o.fill||'none')+'" fill-opacity="'+(o.op==null?1:o.op)+'" stroke="'+(o.stroke||'currentColor')+'" stroke-width="'+(o.sw||1.3)+'"'+(o.dash?' stroke-dasharray="5 4"':'')+'/>';
  const circ=(cx,cy,r,o={})=>'<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+(o.fill||'none')+'" fill-opacity="'+(o.op==null?1:o.op)+'" stroke="'+(o.stroke||'currentColor')+'" stroke-width="'+(o.sw||1.3)+'"'+(o.dash?' stroke-dasharray="5 4"':'')+'/>';
  const poly=(pts,o={})=>'<polyline points="'+pts+'" fill="none" stroke="'+(o.stroke||'currentColor')+'" stroke-width="'+(o.sw||1.5)+'" stroke-linejoin="round"'+(o.dash?' stroke-dasharray="5 4"':'')+(o.arrow?' marker-end="url(#ah)"':'')+'/>';
  const polyg=(pts,o={})=>'<polygon points="'+pts+'" fill="'+(o.fill||'none')+'" fill-opacity="'+(o.op==null?1:o.op)+'" stroke="'+(o.stroke||'currentColor')+'" stroke-width="'+(o.sw||1.3)+'"/>';
  const I={};
  /* ================= DOMAIN 24: Fiber Optics, Telecom & the Physical Layer ================= */
  I.p24m1=[{cap:"Total internal reflection, longitudinal section. The core (n₁ = 1.468) sits inside a lower-index cladding (n₂ = 1.463); a ray meeting the boundary beyond the critical angle of 85.3° reflects completely and travels for kilometers, while a steeper ray refracts out through cladding and coating.",
    svg:svg(560,235,`${text(280,14,'light guided by total internal reflection',{size:11,bold:true,color:CY})}
      ${rect(20,28,440,180,{stroke:DIM})}${rect(20,58,440,120,{stroke:MG})}${rect(20,98,440,40,{stroke:CY,sw:1.6})}
      ${text(452,40,'coating 250 µm (acrylate)',{anchor:'end',size:10,color:DIM})}
      ${text(452,74,'cladding · n₂ = 1.463',{anchor:'end',size:10,color:MG})}
      ${text(452,118,'core · n₁ = 1.468',{anchor:'end',size:10,color:CY})}
      ${text(452,164,'cladding · n₂ = 1.463',{anchor:'end',size:10,color:MG})}
      ${poly('30,118 110,100 200,136 290,100 350,124',{stroke:LM,sw:1.8,arrow:true})}
      ${line(290,70,290,130,{stroke:DIM,dash:true})}${text(284,76,'normal',{anchor:'end',size:9,color:DIM})}
      ${text(150,150,'trapped: angle > θc = 85.3°',{size:10,color:LM})}
      ${poly('40,102 78,136 100,178 112,208',{stroke:MG,sw:1.5,dash:true,arrow:true})}
      ${text(150,196,'too steep (< θc): leaks out',{anchor:'start',size:10,color:MG})}
      ${text(280,224,'sin θc = n₂ ÷ n₁ = 1.463 ÷ 1.468 → θc ≈ 85.3°',{size:10,color:DIM})}`,'Total internal reflection inside a fiber core')},
   {cap:"Core sizes to scale against the universal 125 µm cladding: a 9 µm single-mode core carries one path; 50 and 62.5 µm multimode cores carry hundreds of modes that arrive at different times, which is what limits multimode to a few hundred meters at 10 Gb/s.",
    svg:svg(560,215,`${text(280,14,'core and cladding to scale (125 µm cladding everywhere)',{size:11,bold:true,color:CY})}
      ${[[95,'OS2 single-mode','9 / 125 µm · 1310 / 1550 nm',3.6],[280,'OM3 · OM4 multimode','50 / 125 µm · 850 nm',20],[465,'OM1 multimode (legacy)','62.5 / 125 µm · 850 nm',25]].map(([cx,n,d,r])=>circ(cx,100,50,{stroke:MG})+circ(cx,100,r,{fill:CY,op:0.35,stroke:CY})+text(cx,168,n,{size:11,bold:true})+text(cx,184,d,{size:10,color:DIM})).join('')}
      ${text(95,42,'125 µm',{size:9,color:MG})}
      ${text(280,206,'the core sets the mode count — one in OS2, hundreds in OM1 — so bandwidth and reach',{size:9,color:DIM})}`,'Single-mode and multimode core sizes drawn to scale')},
   {cap:"Attenuation versus wavelength. Rayleigh scattering falls as 1/λ⁴, the hydroxyl water peak sits at 1383 nm, and infrared absorption rises past 1600 nm, which leaves the windows the industry uses: 850 nm for multimode, 1310 and 1550 nm (the 0.2 dB/km minimum) for single-mode, 1625 nm for live-fiber testing.",
    svg:svg(560,232,`${text(300,14,'attenuation of silica fiber vs wavelength (dB/km)',{size:11,bold:true,color:CY})}
      ${line(60,30,60,190)}${line(60,190,540,190)}
      ${[[4,30],[3,70],[2,110],[1,150],[0,190]].map(([v,y])=>text(52,y,String(v),{anchor:'end',size:9,color:DIM})+line(57,y,60,y)).join('')}
      ${[[800,60],[1000,166.7],[1200,273.3],[1400,380],[1600,486.7]].map(([v,x])=>text(x,202,String(v),{size:9,color:DIM})+line(x,190,x,193)).join('')}
      ${text(300,220,'wavelength (nm)',{size:9,color:DIM})}
      ${poly('60,46 86.7,70 113.3,98 166.7,134 220,154 273.3,168 300,172 326.7,175 332,176 348,176.4 364,168 370.9,150 380,166 390.7,174.8 406.7,178 433.3,180.4 460,182 486.7,181.6 500,180.4 513.3,178 540,170',{stroke:CY,sw:2})}
      ${line(86.7,60,86.7,190,{stroke:AM,dash:true})}${line(332,120,332,190,{stroke:AM,dash:true})}${line(460,172,460,190,{stroke:AM,dash:true})}
      ${text(96,36,'850 nm · 3 dB/km (multimode)',{anchor:'start',size:10,color:AM})}
      ${text(175,112,'Rayleigh scattering ∝ 1/λ⁴',{anchor:'start',size:9,color:MG})}
      ${text(360,96,'1310 nm · 0.35 dB/km',{size:10,color:AM})}
      ${text(378,130,'1383 nm water peak',{anchor:'start',size:9,color:MG})}
      ${text(470,150,'1550 nm · 0.2 dB/km',{size:10,color:AM})}
      ${text(552,166,'1625 nm: test and monitor',{anchor:'end',size:9,color:DIM})}`,'Fiber attenuation versus wavelength with the transmission windows')}];

  I.p24m2=[{cap:"A loose-tube outside-plant cable cut across: twelve-fiber buffer tubes stranded around a central strength member, water blocking and aramid, optional corrugated steel armor (a conductor you bond and ground), and a black polyethylene jacket whose print carries the type, count and sequential footage.",
    svg:svg(560,250,`${text(280,12,'loose-tube OSP cable, cut across',{size:11,bold:true,color:CY})}
      ${circ(140,122,100,{sw:2.5})}${circ(140,122,88,{stroke:DIM,dash:true})}${circ(140,122,78,{stroke:AM})}
      ${[[190,122],[165,165.3],[115,165.3],[90,122],[115,78.7],[165,78.7]].map(([cx,cy])=>circ(cx,cy,22,{stroke:CY})+text(cx,cy,'12',{size:9,color:CY})).join('')}
      ${circ(140,122,14,{fill:DIM,op:0.6})}
      ${line(190,35.4,296,34,{stroke:DIM})}${text(300,34,'polyethylene jacket, black, printed',{anchor:'start',size:10})}
      ${line(209.3,67.8,296,68,{stroke:DIM})}${text(300,68,'corrugated steel armor — bond, ground',{anchor:'start',size:10})}
      ${line(216.3,105.8,296,104,{stroke:DIM})}${text(300,104,'water-blocking tape · aramid yarn',{anchor:'start',size:10,color:AM})}
      ${line(209,133,296,138,{stroke:DIM})}${text(300,138,'buffer tube · 12 fibers each',{anchor:'start',size:10,color:CY})}
      ${line(150,132,296,172,{stroke:DIM})}${text(300,172,'central strength member (GRP/steel)',{anchor:'start',size:10})}
      ${text(300,206,'each fiber: 125 µm glass, 250 µm coating',{anchor:'start',size:10,color:DIM})}
      ${text(300,224,'jacket print: count, type, footage',{anchor:'start',size:10,color:DIM})}`,'Cross-section of a loose-tube outside-plant fiber cable')},
   {cap:"One reel pull from splice point to splice point with the sequential footage marks doing the counting: slack at each access point is IN − OUT, running line between points is the previous OUT minus this IN, and the total must equal the first IN minus the last OUT.",
    svg:svg(560,240,`${text(280,10,'reel R-0257 · 864-fiber microcable · marks count down as cable pays off',{size:9,color:DIM})}
      ${box(10,20,124,78,'LE-D-108 · SPLICE\nSTA 0+00\nIN 18,250\nOUT 18,150\nslack 100 ft',{stroke:MG,size:10})}
      ${box(148,20,124,78,'HH · STA 8+40\nIN 17,310\nOUT 17,280\nslack 30 ft',{stroke:CY,size:10})}
      ${box(286,20,124,78,'HH · STA 17+28\nIN 16,392\nOUT 16,362\nslack 30 ft',{stroke:CY,size:10})}
      ${box(424,20,124,78,'LE-D-109 · SPLICE\nSTA 25+18\nIN 15,572\nOUT 15,492\nslack 80 ft',{stroke:MG,size:10})}
      ${line(72,130,486,130,{sw:2})}${[72,210,348,486].map(x=>line(x,98,x,121)+circ(x,130,9,{stroke:AM,sw:1.6})).join('')}
      ${text(141,117,'840 ft',{size:10,color:LM})}${text(279,117,'888 ft',{size:10,color:LM})}${text(417,117,'790 ft',{size:10,color:LM})}
      ${text(280,160,'slack 100 + 30 + 30 + 80 = 240 ft',{size:11,color:AM})}
      ${text(280,180,'running line 840 + 888 + 790 = 2,518 ft',{size:11,color:LM})}
      ${text(280,200,'TOTAL INSTALLED 2,758 ft = 18,250 − 15,492 ✓',{size:11,bold:true,color:CY})}
      ${text(280,222,'check 2: running line 2,518 ft = STA 25+18 on the prints ✓',{size:10,color:DIM})}`,'A reel installation run with sequential footage marks, slack loops and running line')},
   {cap:"The TIA-598 color order numbers both the fibers in a tube and the tubes themselves, so any fiber number becomes a tube and a color by arithmetic: fiber 137 of an 864-count cable is the slate fiber in the aqua (twelfth) tube.",
    svg:svg(560,205,`${text(280,14,'TIA-598 color order — fibers in a tube, and tubes',{size:11,bold:true,color:CY})}
      ${['blue','orange','green','brown','slate','white','red','black','yellow','violet','rose','aqua'].map((c,i)=>box(14+i*44,30,42,40,(i+1)+'\n'+c,{size:9,stroke:i<6?CY:MG})).join('')}
      ${text(280,90,'mnemonic: BOG BSW RBY VRA',{size:10,color:DIM})}
      ${text(280,115,'fiber number = (tube − 1) × 12 + position',{size:11,color:AM})}
      ${text(280,138,'fiber 137 in an 864-count (72 tubes × 12):',{size:10})}
      ${text(280,158,'tubes 1–11 hold 132 → 137 − 132 = 5',{size:10,color:LM})}
      ${text(280,178,'tube 12 (aqua) · position 5 (slate)',{size:11,bold:true,color:CY})}
      ${text(280,196,'tubes 13–24 repeat the colors with a tracer stripe',{size:9,color:DIM})}`,'The TIA-598 twelve-color code and the fiber-number arithmetic')}];

  I.p24m3=[{cap:"The fusion splice in order. The cleave decides everything: a flat end face within 0.5° fuses into one continuous piece of glass at about 2,000 °C and loses a few hundredths of a decibel; the splicer's on-screen estimate is a hint, and only an OTDR or OLTS measures the joint.",
    svg:flow([{t:'STRIP\n30–40 mm of coating',stroke:CY},{t:'CLEAN\n99% IPA, one wipe'},{t:'CLEAVE\nend face ≤ 0.5°',stroke:AM},{t:'ALIGN\ncores in V-grooves'},{t:'ARC\nfuse at ~2,000 °C',stroke:MG},{t:'PROTECT\nheat-shrink → tray',stroke:LM}],{perRow:3,bw:150,gap:34,bh:52,label:'The six steps of a fusion splice'})},
   {cap:"UPC versus APC end faces. A flat (domed) UPC face sends the glass–air reflection straight back down the core (about −50 dB); the 8° APC face steers it into the cladding where it is lost (−60 dB or better), which is why PON drops are green and green never mates with blue.",
    svg:compare({t:'UPC: ULTRA PHYSICAL CONTACT',draw:x=>text(x+89,54,'ceramic ferrule',{size:9,color:DIM})+rect(x+30,62,118,46,{stroke:CY})+line(x+30,85,x+148,85,{stroke:CY})+line(x+148,60,x+148,110,{stroke:LM,sw:3})+arrow(x+40,80,x+138,80,'',{stroke:LM})+arrow(x+138,91,x+48,91,'',{stroke:MG,dash:true})+text(x+200,70,'flat face',{size:10,color:LM})+text(x+130,132,'reflection goes straight back',{size:10,color:MG})+text(x+130,150,'return loss ≈ −50 to −55 dB',{size:10})+text(x+130,168,'blue housing · LANs, transceivers',{size:10,color:DIM})},
      {t:'APC: ANGLED PHYSICAL CONTACT',draw:x=>text(x+89,54,'ceramic ferrule',{size:9,color:DIM})+polyg((x+30)+',62 '+(x+144)+',62 '+(x+152)+',108 '+(x+30)+',108',{stroke:CY})+line(x+30,85,x+144,85,{stroke:CY})+line(x+144,60,x+152,110,{stroke:LM,sw:3})+arrow(x+40,80,x+134,80,'',{stroke:LM})+arrow(x+142,86,x+78,106,'',{stroke:MG,dash:true})+text(x+200,70,'8° face',{size:10,color:LM})+text(x+130,132,'reflection steered into cladding',{size:10,color:MG})+text(x+130,150,'return loss ≤ −60 dB',{size:10})+text(x+130,168,'green housing · PON, RF video',{size:10,color:DIM})},{h:190,label:'UPC versus APC connector end faces'})},
   {cap:"Inspect, clean, inspect. A single-mode core is 9 µm and dust is 1–10 µm, so every end face is checked with a 200–400× video probe before it is mated, cleaned dry first with a one-click cleaner, checked again, and only then connected — or capped.",
    svg:cycle(['INSPECT\n200–400× probe','dry clean\none-click','INSPECT again\nIEC 61300-3-35','still dirty?\nwet–dry IPA','CONNECT\nor cap it'],{label:'Inspect, clean, inspect'})}];

  I.p24m4=[{cap:"An OTDR trace read left to right: the launch spike and its dead zone, the backscatter line sloping at the fiber's dB/km, a fusion splice as a step with no spike, a connector as a spike plus a step, a bend as a step that grows at 1550 nm, a ghost at twice the connector's distance with zero loss, and the end-of-fiber spike falling into noise.",
    svg:svg(560,240,`${text(295,14,'OTDR trace: returned power vs distance (1550 nm)',{size:11,bold:true,color:CY})}
      ${line(50,30,50,205)}${line(50,205,540,205)}${text(36,36,'dB',{size:9,color:DIM})}
      ${[[0,50],[2,148],[4,246],[6,344],[8,442],[10,540]].map(([v,x])=>text(x,216,String(v),{size:9,color:DIM})+line(x,205,x,208)).join('')}
      ${text(295,232,'distance (km) = c × t ÷ 2n',{size:9,color:DIM})}
      ${poly('50,170 52,40 58,50 66,72 148,78 150,86 246,93 247,63 250,70 256,100 344,106 346,116 442,123 443,103 446,110 450,124 515,129 516,94 519,100 522,150 526,185 530,170 534,190 538,178 540,188',{stroke:CY,sw:1.8})}
      ${text(60,30,'launch spike + dead zone',{anchor:'start',size:9,color:DIM})}
      ${text(110,58,'slope = fiber dB/km',{anchor:'start',size:9,color:DIM})}
      ${text(152,110,'fusion splice: step, no spike',{anchor:'start',size:9,color:LM})}
      ${text(258,56,'connector: spike + step',{anchor:'start',size:9,color:AM})}
      ${text(346,140,'bend: step, worse at 1550',{anchor:'start',size:9,color:MG})}
      ${text(438,92,'ghost: spike, zero loss, 2 × 4 km',{anchor:'end',size:9,color:DIM})}
      ${text(505,40,'end: big spike, then noise',{anchor:'end',size:9,color:AM})}`,'An OTDR trace with every event type labeled')},
   {cap:"The loss budget as arithmetic. TIA-568.3 maximums give the pass line for the OLTS test; typical values give what you expect to read; the transceiver's power budget minus a 3 dB margin says whether the optic can live with it.",
    svg:svg(560,240,`${text(280,14,'3.2 km OSP single-mode link · 4 splices · 2 connector pairs',{size:11,bold:true,color:CY})}
      ${box(14,30,160,54,'fiber\n3.2 km × 0.5 dB/km\n= 1.6 dB',{size:10})}${text(187,57,'+',{size:16,color:DIM})}
      ${box(200,30,160,54,'splices\n4 × 0.3 dB\n= 1.2 dB',{size:10})}${text(373,57,'+',{size:16,color:DIM})}
      ${box(386,30,160,54,'connector pairs\n2 × 0.75 dB\n= 1.5 dB',{size:10})}
      ${text(280,100,'TIA maximum = 4.3 dB  (pass line for the OLTS test)',{size:11,bold:true,color:AM})}
      ${text(280,118,'typical: 3.2 × 0.35 + 4 × 0.05 + 2 × 0.3 ≈ 1.9 dB',{size:10,color:LM})}
      ${box(14,136,250,50,'10GBASE-LR power budget\n−8.2 dBm − (−14.4 dBm) = 6.2 dB',{stroke:CY,size:10})}
      ${box(296,136,250,50,'needed: 4.3 dB + 3 dB margin\n= 7.3 dB',{stroke:MG,size:10})}
      ${text(280,206,'7.3 > 6.2: marginal by the TIA worst case; typical 1.9 + 3 = 4.9 fits',{size:10})}
      ${text(280,226,'rule: Tx min − Rx sensitivity ≥ link loss + margin',{size:10,color:DIM})}`,'A TIA loss budget compared with a transceiver power budget')},
   {cap:"The one-cord reference (TIA-526-14-C / 526-7-A): the reference reading includes only the source and its launch cord, so when the link is inserted the measurement includes both of the link's end connectors — which is what TIA-568 wants certified.",
    svg:compare({t:'REFERENCE (one cord)',draw:x=>box(x+16,50,70,36,'source',{stroke:CY,size:10})+arrow(x+86,68,x+110,68,'')+box(x+110,50,70,36,'launch cord',{size:9})+arrow(x+180,68,x+204,68,'')+box(x+204,50,46,36,'meter',{stroke:LM,size:10})+text(x+130,110,'read P_ref: the 0 dB point',{size:10})+text(x+130,128,'cord stays on the source',{size:10,color:DIM})+text(x+130,146,'encircled flux for multimode',{size:9,color:DIM})},
      {t:'TEST (insert the link)',draw:x=>box(x+8,50,54,36,'source',{stroke:CY,size:9})+arrow(x+62,68,x+74,68,'')+box(x+74,50,44,36,'cord',{size:9})+arrow(x+118,68,x+130,68,'')+box(x+130,50,76,36,'link\n2 connectors',{stroke:AM,size:9})+arrow(x+206,68,x+218,68,'')+box(x+218,50,36,36,'meter',{stroke:LM,size:9})+text(x+130,110,'loss = P_ref − P_test (dB)',{size:10})+text(x+130,128,'includes both end connectors',{size:10,color:DIM})+text(x+130,146,'both wavelengths · both directions',{size:9,color:DIM})},{h:160,label:'One-cord reference and insertion-loss measurement'})}];

  I.p24m5=[{cap:"A GPON tree with its decibels: one OLT port launches +3 dBm; the feeder, the passive 1:32 splitter in the FDH (the big loss), the distribution cable, drops, connectors and splices leave −19.75 dBm at the ONT, 7.25 dB above a −27 dBm receiver inside the 28 dB class B+ budget.",
    svg:svg(560,245,`${box(10,20,88,44,'OLT (hut)\n+3 dBm',{stroke:CY,size:10})}${arrow(98,42,228,42,'')}${text(163,58,'feeder 5 km · −1.75 dB',{size:9,color:DIM})}
      ${box(228,10,107,64,'FDH cabinet\n1:32 splitter\n−17.5 dB',{stroke:AM,size:10})}
      ${[12,58,104,150].map(y=>line(335,42,385,y+14)+box(385,y,62,28,'MST',{size:10})+arrow(447,y+14,480,y+14,'')+box(480,y,70,28,'ONT',{stroke:LM,size:10})).join('')}
      ${text(265,90,'distribution 2 km · −0.7 dB',{size:9,color:DIM})}
      ${text(466,194,'drop → ONT, × 32 homes',{size:9,color:DIM})}
      ${text(280,214,'ONT receives +3 − 1.75 − 17.5 − 0.7 − 2.0 − 0.8 = −19.75 dBm',{size:10,bold:true,color:CY})}
      ${text(280,232,'sensitivity −27 dBm → margin 7.25 dB inside the 28 dB class B+ budget',{size:10,color:LM})}`,'A PON from OLT through splitter to ONTs with the loss budget')},
   {cap:"Reach by optic on a log scale. The suffix is the medium: S is 850 nm multimode (hundreds of meters, limited by modal dispersion), L is 1310 nm single-mode to 10 km, E and Z are 1550 nm to 40 and 80 km, and coherent 400ZR puts DWDM into a router pluggable for 120 km.",
    svg:svg(560,232,`${text(280,14,'reach by optic — log scale, 100 m to 200 km',{size:11,bold:true,color:CY})}
      ${[['10GBASE-SR · OM4 · 850 nm',0.4,'400 m',MG],['400GBASE-DR4 · OS2 · MPO',0.5,'500 m',MG],['10GBASE-LR · OS2 · 1310 nm',10,'10 km',CY],['10GBASE-ER · OS2 · 1550 nm',40,'40 km',AM],['10GBASE-ZR · OS2 · 1550 nm',80,'80 km',AM],['400ZR coherent DWDM',120,'120 km',LM]].map(([n,km,lab,c],i)=>{ const y=34+i*28, w=Math.round((Math.log10(km)+1)*100); return text(182,y+9,n,{anchor:'end',size:9})+rect(190,y,w,18,{fill:c,op:0.3,stroke:c,rx:3})+text(194+w,y+9,lab,{anchor:'start',size:9,color:c}); }).join('')}
      ${line(190,202,520,202)}${[['100 m',190],['1 km',290],['10 km',390],['100 km',490]].map(([t,x])=>line(x,202,x,206)+text(x,214,t,{size:9,color:DIM})).join('')}
      ${text(280,228,'S = 850 nm multimode · L = 1310 · E/Z = 1550 · ZR = coherent',{size:9,color:DIM})}`,'Reach of common Ethernet optics on a logarithmic scale')},
   {cap:"Wavelength-division multiplexing: independent lasers on different wavelengths are combined by a passive filter onto one fiber, amplified together by an EDFA every 80–100 km, and separated again at the far end — 96 channels of 400 Gb/s is about 38 Tb/s on one fiber pair.",
    svg:svg(560,212,`${[0,1,2,3].map(i=>box(14,20+i*34,70,26,'Tx λ'+(i+1),{size:10,stroke:[CY,MG,AM,LM][i]})+line(84,33+i*34,120,70+i*14,{stroke:[CY,MG,AM,LM][i]})).join('')}
      ${box(120,40,60,100,'MUX\nfilter',{size:10})}${line(180,90,380,90,{sw:2.5})}${text(280,62,'one fiber · up to 96 channels',{size:10,color:CY})}
      ${box(255,78,50,26,'EDFA',{stroke:AM,size:10,fill:'var(--bg)'})}${text(280,116,'amplifier hut every 80–100 km',{size:9,color:DIM})}
      ${box(380,40,60,100,'DEMUX\nfilter',{size:10})}${[0,1,2,3].map(i=>line(440,70+i*14,476,33+i*34,{stroke:[CY,MG,AM,LM][i]})+box(476,20+i*34,70,26,'Rx λ'+(i+1),{size:10,stroke:[CY,MG,AM,LM][i]})).join('')}
      ${text(280,166,'CWDM: 18 channels, 20 nm apart, 1270–1610 nm, no amplifiers',{size:10})}
      ${text(280,184,'DWDM: 40–96 channels at 100/50 GHz (0.8/0.4 nm), C-band 1530–1565 nm',{size:10})}
      ${text(280,202,'96 × 400 Gb/s ≈ 38 Tb/s on one fiber pair',{size:10,bold:true,color:CY})}`,'Wavelength-division multiplexing from lasers through MUX, fiber, EDFA and DEMUX')}];

  I.p24m6=[{cap:"Light safety as two lists. Telecom light is infrared and invisible, so the eye never defends itself; the power meter and the video probe are the only safe ways to find out whether a fiber is lit.",
    svg:compare({t:'ALWAYS',draw:x=>[['check with a power meter (−60 dBm floor)'],['inspect only with a video probe'],['dust caps on every unused port'],['treat a fiber as live until measured'],['amplified DWDM: wait for shutdown']].map((l,i)=>text(x+130,52+i*26,l[0],{size:10,color:LM})).join('')},
      {t:'NEVER',draw:x=>[['look into a fiber, connector or port'],['use an eyepiece scope on a fiber'],['trust "it looks dark" — IR is invisible'],['aim a VFL (650 nm) at anyone\'s face'],['open an amplified span unannounced']].map((l,i)=>text(x+130,52+i*26,l[0],{size:10,color:MG})).join('')},{h:190,label:'Laser and light safety: always and never'})},
   {cap:"Optical power on a dBm line. Ordinary transceivers sit around 1 mW (Hazard Level 1 or 1M, safe for a glance but never a stare); amplified DWDM lines carry 100 mW to 1 W (Hazard Level 3B or 4), enough to burn a retina or the end face itself.",
    svg:svg(560,200,`${text(300,14,'optical power on the fiber, and what it does to an eye',{size:11,bold:true,color:CY})}
      ${text(120,40,'+3 dB = ×2 · +10 dB = ×10 · dBm = 10 log(mW)',{anchor:'start',size:9,color:DIM})}
      ${line(60,120,540,120)}${[[60,'−10 dBm'],[180,'0 dBm · 1 mW'],[300,'+10 · 10 mW'],[420,'+20 · 100 mW']].map(([x,t])=>line(x,120,x,125)+text(x,135,t,{size:9,color:DIM})).join('')}${line(540,120,540,125)}${text(548,135,'+30 · 1 W',{anchor:'end',size:9,color:DIM})}
      ${rect(120,88,120,22,{fill:LM,op:0.3,stroke:LM,rx:3})}${text(180,99,'SFP/SFP+ · HL 1 / 1M',{size:9,color:LM})}
      ${text(180,70,'VFL 650 nm: visible, Class 2/3R',{size:9,color:AM})}
      ${rect(384,88,156,22,{fill:MG,op:0.3,stroke:MG,rx:3})}${text(462,99,'EDFA · Raman · HL 3B / 4',{size:9,color:MG})}
      ${text(300,156,'eye: no blink reflex at 850–1625 nm — the retina never warns you',{size:10,color:DIM})}
      ${text(300,174,'power meter floor ≈ −60 dBm: anything above it means a source is on',{size:10})}
      ${text(300,192,'ANSI Z136.2 and IEC 60825-2: hazard levels for fiber communication systems',{size:9,color:DIM})}`,'Optical power levels on a dBm scale with laser hazard levels')},
   {cap:"The ground rules with their numbers: a trench needs a protective system at five feet and a ladder within 25 feet of every worker from four feet; a manhole is a confined space entered only after a four-gas test, with a blower running and an attendant topside.",
    svg:svg(560,240,`${text(280,14,'ground rules: the trench and the hole',{size:11,bold:true,color:CY})}
      ${line(10,60,270,60,{sw:2})}${polyg('30,60 55,42 80,60',{stroke:DIM})}${text(55,32,'spoil 2 ft back',{size:9,color:DIM})}
      ${polyg('90,60 90,180 170,180 170,60',{stroke:AM,sw:1.6})}
      ${line(110,58,110,182,{stroke:LM})}${line(122,58,122,182,{stroke:LM})}${[70,86,102,118,134,150,166].map(y=>line(110,y,122,y,{stroke:LM})).join('')}
      ${arrow(186,62,186,178,'')}${text(196,112,'≥ 5 ft: shoring,\nsloping or box',{anchor:'start',size:9,color:AM})}
      ${text(130,196,'ladder within 25 ft\nif ≥ 4 ft deep',{size:9,color:LM})}
      ${text(425,36,'manhole / vault = confined space',{size:10,bold:true,color:MG})}
      ${[['four-gas test before entry:',MG],['O₂ 20.9% · LEL 0% · H₂S 0 · CO 0',LM],['blower running, then continuous monitor','currentColor'],['attendant topside + retrieval tripod','currentColor'],['harness on · radio check · 1910.268','currentColor'],['no arc or heater in gas-rich air',AM]].map(([t,c],i)=>text(305,60+i*22,t,{anchor:'start',size:10,color:c})).join('')}
      ${text(280,230,'OSHA 1926 Subpart P · 1910.146 · 1910.268 · 811 before any dig',{size:9,color:DIM})}`,'Trench protection depths and confined-space entry steps')}];

  I.p24m7=[{cap:"From the home to the ocean floor. Access plant (your PON) collects into metro rings between central offices, the core carries coherent DWDM between amplifier huts every 80–100 km, exchange points and data centers hang off the metro, and submarine systems with repeaters carry nearly all intercontinental traffic.",
    svg:flow([{t:'home ONT\n+ drop',stroke:LM},{t:'ACCESS\nPON · FDH · OLT hut',stroke:CY,edge:'drop'},{t:'METRO / AGGREGATION\nrings between COs',stroke:AM,edge:'feeder'},{t:'CORE / LONG-HAUL\nDWDM · amp huts 80–100 km',stroke:MG,edge:'metro'},{t:'IXP · CDN · data center\n(Domain 9 GPUs)',edge:'peers'},{t:'submarine landing\n→ other continents',stroke:DIM,edge:'subsea'}],{perRow:3,bw:148,gap:44,bh:56,label:'From the home to the ocean floor: the three carrier tiers'})},
   {cap:"5G transport is a fiber design problem: fronthaul from radio unit to distributed unit carries eCPRI at 10–25 Gb/s with a one-way budget near 100 µs, which at 4.9 µs per kilometer of glass caps the DU at roughly 20 km; midhaul and backhaul ride the same metro and long-haul network as everything else.",
    svg:svg(560,200,`${text(280,16,'the 5G wireless network is mostly fiber',{size:11,bold:true,color:CY})}
      ${box(10,70,110,50,'RU\nradio on the tower',{stroke:MG,size:10})}${arrow(120,95,160,95,'')}${box(160,70,110,50,'DU\nreal-time baseband',{stroke:AM,size:10})}${arrow(270,95,310,95,'')}${box(310,70,110,50,'CU\nregional center',{stroke:CY,size:10})}${arrow(420,95,460,95,'')}${box(460,70,90,50,'mobile core\n+ internet',{stroke:LM,size:10})}
      ${text(140,50,'fronthaul · eCPRI 10–25 Gb/s',{size:9,color:AM})}${text(140,134,'≤ 100 µs one way → ≤ 20 km',{size:9,color:LM})}
      ${text(290,50,'midhaul · ms budgets',{size:9,color:DIM})}${text(440,50,'backhaul · metro + long-haul',{size:9,color:DIM})}
      ${text(280,170,'4.9 µs per km of glass: the fronthaul radius is a fiber-length limit',{size:10,color:DIM})}
      ${text(280,188,'small cells on poles: power + fiber at every site (CFOS/W)',{size:9,color:DIM})}`,'5G fronthaul, midhaul and backhaul over fiber')},
   {cap:"The ladder from the handhole to the design office, one credential per rung: CFOT for the technician, CFOS/S and CFOS/T for the splicer-tester, CFOS/O for the lead, CFOS/D and BICSI for the OSP designer, Network+ and CCNA for the transport engineer, Security+ and Domain 8 for the physical-layer security pivot.",
    svg:svg(560,250,`${text(280,14,'the ladder from the handhole to the design office',{size:11,bold:true,color:CY})}
      ${[['fiber tech\nCFOT',DIM],['splicer-tester\nCFOS/S · CFOS/T',CY],['lead · QA\nCFOS/O',AM],['OSP designer\nCFOS/D · BICSI',LM],['transport eng.\nNet+ · CCNA',MG],['security pivot\nSec+ · Domain 8','currentColor']].map(([t,c],i)=>{ const x=10+i*90, y=160-i*26; return box(x,y,88,50,t,{stroke:c,size:10})+(i<5?arrow(x+88,y+25,x+90,y-3,''):''); }).join('')}
      ${text(280,226,'BLS May 2025 median, telecom installers/repairers ≈ $66k; splicers and engineers above',{size:9,color:DIM})}
      ${text(280,242,'each rung: a credential plus documented work — no degree required',{size:10,color:DIM})}`,'Career ladder from fiber technician to engineer with the certification for each rung')}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
