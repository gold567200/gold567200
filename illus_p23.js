/* Illustrations — Domain 23: Electronics & Embedded Systems, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  // small helpers (ground symbol, filled rect, path, node dot) — colors only via kit tokens or currentColor
  const gnd=(x,y,c)=>line(x-12,y,x+12,y,{stroke:c||'currentColor',sw:1.5})+line(x-8,y+6,x+8,y+6,{stroke:c||'currentColor'})+line(x-4,y+12,x+4,y+12,{stroke:c||'currentColor'});
  const rect=(x,y,w,h,fill,op,o={})=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(o.rx||0)+'" fill="'+fill+'" opacity="'+(op==null?1:op)+'"'+(o.stroke?' stroke="'+o.stroke+'" stroke-width="1.3"':'')+'/>';
  const path=(d,stroke,o={})=>'<path d="'+d+'" fill="'+(o.fill||'none')+'" stroke="'+(stroke||'currentColor')+'" stroke-width="'+(o.sw||1.6)+'"'+(o.dash?' stroke-dasharray="5 4"':'')+(o.marker?' marker-end="url(#ah)"':'')+(o.op!=null?' opacity="'+o.op+'"':'')+'/>';
  const dot=(x,y,c)=>'<circle cx="'+x+'" cy="'+y+'" r="3.5" fill="'+(c||'currentColor')+'"/>';
  // square-wave path: bits[] of 0/1, each bit w px wide, starting at x0; yH/yL are the HIGH/LOW y levels
  const wave=(x0,bits,w,yH,yL,lead,tail)=>{ let x=x0, d='M'+(x0-(lead||0))+' '+yL+' L'+x0+' '+yL+(bits[0]?' L'+x0+' '+yH:''); bits.forEach((b,i)=>{ const y=b?yH:yL; if(i>0&&bits[i-1]!==b) d+=' L'+x+' '+y; d+=' L'+(x+w)+' '+y; x+=w; }); if(tail) d+=' L'+(x+tail)+' '+(bits[bits.length-1]?yH:yL); return d; };

  /* ================= DOMAIN 23 ================= */
  /* ---------- Module 1: electricity fundamentals ---------- */
  I.p23m1=[{cap:"Series: one current flows through everything, voltages add, resistances add (1 kΩ + 2 kΩ = 3 kΩ, so 9 V drives 3 mA and splits into 3 V and 6 V). Parallel: every branch sees the same voltage, currents add, and the total resistance is smaller than any branch (two 1 kΩ make 500 Ω).",
    svg:compare({t:'SERIES — one current',draw:x=>`${box(x+20,86,34,60,'9 V',{stroke:AM,size:11})}${line(x+37,86,x+37,60)}${line(x+37,60,x+80,60)}${box(x+80,48,56,24,'1 kΩ',{size:10})}${line(x+136,60,x+170,60)}${box(x+170,48,56,24,'2 kΩ',{size:10})}${line(x+226,60,x+245,60)}${line(x+245,60,x+245,176)}${line(x+245,176,x+37,176)}${line(x+37,176,x+37,146)}
        ${text(x+108,86,'3 V',{size:10,color:LM})}${text(x+198,86,'6 V',{size:10,color:LM})}${arrow(x+200,176,x+120,176,'3 mA')}
        ${text(x+150,112,'R = 1k + 2k = 3 kΩ',{size:10})}${text(x+150,128,'I = 9 V / 3 kΩ = 3 mA',{size:10})}${text(x+150,144,'3 V + 6 V = 9 V  (KVL)',{size:10,color:DIM})}${text(x+130,194,'same current · voltages add',{size:10,color:CY})}`},
      {t:'PARALLEL — one voltage',draw:x=>`${box(x+20,86,34,60,'5 V',{stroke:AM,size:11})}${line(x+37,86,x+37,60)}${line(x+37,60,x+100,60)}${line(x+100,60,x+100,140)}${box(x+135,68,60,24,'1 kΩ',{size:10})}${line(x+100,80,x+135,80)}${line(x+195,80,x+230,80)}${box(x+135,128,60,24,'1 kΩ',{size:10})}${line(x+100,140,x+135,140)}${line(x+195,140,x+230,140)}${line(x+230,80,x+230,176)}${line(x+230,176,x+37,176)}${line(x+37,176,x+37,146)}
        ${text(x+165,58,'5 mA',{size:10,color:LM})}${text(x+165,118,'5 mA',{size:10,color:LM})}${text(x+165,104,'both see 5 V',{size:9,color:DIM})}${arrow(x+200,176,x+120,176,'10 mA')}
        ${text(x+130,194,'1/R = 1/1k + 1/1k → 500 Ω · 10 mA',{size:10,color:MG})}`},{h:215,label:'Series versus parallel circuits with the arithmetic'})},
   {cap:"Ohm's law as a triangle: cover the quantity you want; the two left over are multiplied if side by side and divided if one is over the other. Worked for a 220 Ω resistor on 5 V, plus the power check that decides whether the part survives.",
    svg:svg(560,215,`${path('M120 30 L30 170 L210 170 Z','currentColor',{sw:1.6})}${line(75,100,165,100)}${line(120,100,120,170)}
      ${text(120,70,'V',{size:26,bold:true,color:CY})}${text(90,138,'I',{size:24,bold:true,color:LM})}${text(152,138,'R',{size:24,bold:true,color:AM})}
      ${text(120,190,'cover the unknown',{size:10,color:DIM})}${text(120,205,'side by side → multiply · over → divide',{size:9,color:DIM})}
      ${box(240,28,300,30,'V = I × R = 0.0227 A × 220 Ω = 5 V',{size:11,mono:true,stroke:CY})}
      ${box(240,66,300,30,'I = V / R = 5 V / 220 Ω = 22.7 mA',{size:11,mono:true,stroke:LM})}
      ${box(240,104,300,30,'R = V / I = 5 V / 0.0227 A = 220 Ω',{size:11,mono:true,stroke:AM})}
      ${box(240,142,300,30,'P = V × I = 5 × 0.0227 = 0.114 W',{size:11,mono:true,stroke:MG})}
      ${text(390,186,'a ¼ W resistor is fine · on 12 V: 0.65 W → smoke',{size:10,color:MG})}`,'Ohm\'s law triangle with a worked example and the power check')},
   {cap:"What current does to a body at mains frequency. The arithmetic is Ohm's law with your skin as the resistor: wet skin at 120 V passes a lethal current, dry skin at 9 V passes nothing you can feel. That is why codes draw the hazard line at 50 V and why this domain lives at 3.3–12 V.",
    svg:svg(560,205,`${rect(40,64,110,12,LM,0.45)}${rect(150,64,120,12,AM,0.5)}${rect(270,64,250,12,MG,0.5)}${line(40,70,520,70,{stroke:DIM})}
      ${[[60,'1 mA','felt'],[180,'5 mA','GFCI trips (4–6 mA)'],[300,'10–16 mA','let-go lost: muscles clamp'],[430,'50–100 mA','ventricular fibrillation']].map(([x,a,b])=>line(x,60,x,80)+text(x,50,a,{size:10,bold:true})+text(x,92,b,{size:9,color:DIM})).join('')}
      ${text(500,50,'120 mA',{size:10,bold:true,color:MG})}${line(500,60,500,80,{stroke:MG})}
      ${box(30,118,240,42,'wet skin ≈ 1 kΩ at 120 V\n→ 120 mA: lethal',{stroke:MG,size:10})}${box(290,118,240,42,'dry skin ≈ 100 kΩ at 9 V\n→ 0.09 mA: not even felt',{stroke:LM,size:10})}
      ${text(280,186,'codes draw the line at 50 V (NFPA 70E · OSHA); this domain stays at 3.3–12 V',{size:10,color:DIM})}`,'Body current thresholds and the 50 volt rule')}];

  /* ---------- Module 2: components and datasheets ---------- */
  I.p23m2=[{cap:"Reading a four-band resistor: two digit bands, a multiplier band and a tolerance band set apart by a gap. Red-red-brown-gold is 22 × 10¹ = 220 Ω ±5%. The digit code (black 0 … white 9) is the same for every band.",
    svg:svg(560,200,`${text(280,16,'black 0 · brown 1 · red 2 · orange 3 · yellow 4 · green 5 · blue 6 · violet 7 · gray 8 · white 9',{size:9,color:DIM})}
      ${line(40,80,150,80,{sw:2})}${line(410,80,520,80,{sw:2})}${rect(150,50,260,60,DIM,0.3,{rx:16,stroke:'currentColor'})}
      ${rect(185,50,22,60,MG,0.75)}${rect(230,50,22,60,MG,0.75)}${rect(275,50,22,60,AM,0.65)}${rect(350,50,22,60,AM,0.35)}
      ${text(196,38,'red',{size:10,color:MG})}${text(241,38,'red',{size:10,color:MG})}${text(286,38,'brown',{size:10,color:AM})}${text(361,38,'gold',{size:10,color:AM})}
      ${text(196,128,'2',{size:14,bold:true,color:CY})}${text(241,128,'2',{size:14,bold:true,color:CY})}${text(286,128,'×10¹',{size:12,bold:true,color:CY})}${text(361,128,'±5%',{size:12,bold:true,color:CY})}
      ${text(280,160,'22 × 10¹ = 220 Ω ±5%',{size:15,bold:true,color:LM})}${text(280,184,'1st digit · 2nd digit · multiplier · (gap) · tolerance',{size:9,color:DIM})}`,'Resistor color bands decoded to 220 ohms')},
   {cap:"The most-asked calculation in beginner electronics. An LED is a current device: the resistor takes whatever voltage the LED does not, and the current is set by R = (V_supply − V_f)/I. Check the power in the resistor and the current limit of the pin that drives it.",
    svg:svg(560,185,`${text(40,76,'5 V',{size:11,bold:true,color:AM})}${line(40,86,40,110)}${line(40,110,80,110)}${box(80,98,70,24,'150 Ω',{stroke:AM,size:10})}${text(115,86,'drops 3.0 V',{size:10,color:AM})}
      ${arrow(150,110,228,110,'20 mA')}${path('M230 98 L230 122 L254 110 Z',LM,{fill:LM,op:0.8})}${line(254,98,254,122,{stroke:LM,sw:2})}${arrow(246,96,256,84,'',{stroke:LM})}${arrow(256,100,266,88,'',{stroke:LM})}${text(242,140,'V_f = 2.0 V (red)',{size:10,color:LM})}
      ${line(254,110,330,110)}${line(330,110,330,124)}${gnd(330,124)}${text(330,152,'GND',{size:9,color:DIM})}
      ${box(360,40,185,32,'R = (5 − 2.0) / 0.020 A',{size:11,mono:true,stroke:AM})}${box(360,80,185,32,'= 150 Ω  (220 Ω → 13.6 mA)',{size:10,mono:true,stroke:AM})}${box(360,120,185,32,'P = I²R = 0.06 W → ¼ W fine',{size:10,mono:true,stroke:LM})}
      ${text(280,172,'the pin is the other limit: UNO 20 mA recommended, 40 mA absolute maximum',{size:9,color:DIM})}`,'LED current-limiting resistor circuit and arithmetic')},
   {cap:"A transistor as a switch: a 10 mA base current from the pin lets 100 mA flow through the relay coil (forced β = 10 keeps the transistor saturated). The flyback diode across the coil, cathode to positive, absorbs the inductive kick when the coil is switched off.",
    svg:svg(560,240,`${text(185,30,'+5 V',{size:11,bold:true,color:AM,anchor:'end'})}${line(200,30,330,30,{stroke:AM,sw:1.6})}${line(255,30,255,50)}${box(235,50,40,50,'relay\ncoil',{stroke:MG,size:9})}${text(228,75,'100 mA',{size:9,color:MG,anchor:'end'})}
      ${line(310,30,310,60)}${line(300,60,320,60,{stroke:LM,sw:2})}${path('M300 80 L320 80 L310 60 Z',LM,{fill:LM,op:0.8})}${line(310,80,310,108)}${line(310,108,255,108)}${text(330,66,'flyback diode',{size:9,color:LM,anchor:'start'})}${text(330,79,'1N5819 · cathode to +',{size:9,color:LM,anchor:'start'})}
      ${line(255,100,255,108)}${dot(255,108)}${line(230,118,230,158,{sw:3})}${line(230,128,255,108)}${arrow(230,148,255,170,'')}${line(255,170,255,190)}${gnd(255,190)}
      ${box(20,108,100,60,'MCU pin\nHIGH = 5 V\n10 mA out',{stroke:CY,size:9})}${line(120,138,130,138)}${box(130,126,60,24,'430 Ω',{stroke:AM,size:10})}${line(190,138,230,138)}
      ${text(220,122,'B',{size:9,color:DIM})}${text(268,116,'C',{size:9,color:DIM})}${text(268,182,'E',{size:9,color:DIM})}${text(190,162,'2N3904 NPN',{size:9,color:DIM})}
      ${box(375,112,175,30,'β = 10 → I_b = 10 mA',{size:10,mono:true,stroke:AM})}${box(375,150,175,30,'R_b = 4.3 V / 10 mA = 430 Ω',{size:10,mono:true,stroke:AM})}${box(375,188,175,30,'V_CE(sat) ≈ 0.2 V',{size:10,mono:true,stroke:LM})}
      ${text(200,228,'low-side switch: load above, emitter to GND',{size:10,color:DIM})}`,'BJT low-side switch driving a relay coil with a flyback diode')},
   {cap:"Same job, two regulators. A linear regulator burns the whole voltage difference as heat: 12 V to 5 V at 0.5 A is 3.5 W, a heatsink or a fire. A buck converter at 90% efficiency loses about 0.28 W on the same job, at the price of switching noise (buck first, then a small LDO for clean analog).",
    svg:compare({t:'LINEAR (LM7805)',draw:x=>`${box(x+25,44,210,30,'12 V in → 5 V out at 0.5 A',{size:10})}${box(x+25,82,210,34,'P_loss = (12 − 5) × 0.5 A\n= 3.5 W',{size:10,mono:true,stroke:MG})}
        ${text(x+130,132,'efficiency 5/12 = 42%',{size:10})}${text(x+130,150,'3.5 W → heatsink or fire',{size:10,color:MG})}${text(x+130,168,'cheap · quiet · needs 2 V headroom',{size:9,color:DIM})}`},
      {t:'BUCK (MP1584, ~90%)',draw:x=>`${box(x+25,44,210,30,'P_out = 5 V × 0.5 A = 2.5 W',{size:10})}${box(x+25,82,210,34,'P_in = 2.5 / 0.9 = 2.78 W\nloss ≈ 0.28 W',{size:10,mono:true,stroke:LM})}
        ${text(x+130,132,'efficiency ≈ 90%',{size:10})}${text(x+130,150,'0.28 W → no heatsink',{size:10,color:LM})}${text(x+130,168,'noisy: add a small LDO for analog',{size:9,color:DIM})}`},{h:190,label:'Linear versus switching regulator power loss'})}];

  /* ---------- Module 3: digital electronics ---------- */
  const lv=(x0,title,vcc,vih,vil)=>{ const y=v=>180-28*v; return `${text(x0+30,24,title,{size:10,bold:true})}${rect(x0,y(vcc),60,y(vih)-y(vcc),CY,0.35)}${rect(x0,y(vil),60,180-y(vil),LM,0.35)}${rect(x0,y(vcc),60,180-y(vcc),'none',1,{stroke:'currentColor'})}
      ${text(x0+30,(y(vcc)+y(vih))/2,'HIGH',{size:10,bold:true,color:CY})}${text(x0+30,(y(vih)+y(vil))/2,'undefined',{size:9,color:DIM})}${text(x0+30,(y(vil)+180)/2,'LOW',{size:10,bold:true,color:LM})}
      ${text(x0+66,y(vih),'V_IH '+vih+' V',{size:9,anchor:'start',color:CY})}${text(x0+66,y(vil),'V_IL '+vil+' V',{size:9,anchor:'start',color:LM})}${text(x0-6,y(vcc),vcc+' V',{size:9,anchor:'end',color:DIM})}`; };
  I.p23m3=[{cap:"A logic level is a voltage range, not a number. An output must land inside the receiver's HIGH or LOW band; the gap in between is undefined. A 3.3 V HIGH satisfies a TTL input (2.0 V) but not a 5 V 74HC input (3.5 V), and 5 V into a 3.3 V-only input exceeds its absolute maximum.",
    svg:svg(560,215,`${line(40,180,540,180,{stroke:DIM})}${text(64,180,'0 V',{size:9,anchor:'end',color:DIM})}
      ${lv(70,'5 V TTL / 74HCT',5,2.0,0.8)}${lv(240,'5 V CMOS (74HC)',5,3.5,1.5)}${lv(410,'3.3 V LVTTL',3.3,2.0,0.8)}
      ${text(280,202,'3.3 V HIGH clears TTL (2.0 V) but not 74HC (3.5 V); 5 V into a 3.3 V-only pin can kill it',{size:9,color:DIM})}`,'Logic level thresholds for 5 V TTL, 5 V CMOS and 3.3 V logic')},
   {cap:"Left: a pull-up resistor gives the input a defined HIGH; pressing the button pulls it LOW (active-low). Right: the contact chatters for milliseconds, so the firmware ignores further edges for 30–50 ms (or an RC filter and a Schmitt trigger do it in hardware) and sees one clean press.",
    svg:svg(560,230,`${text(80,22,'3.3 V',{size:11,bold:true,color:AM})}${line(80,30,80,45)}${box(55,45,50,26,'10 kΩ',{stroke:AM,size:10})}${line(80,71,80,110)}${dot(80,110)}${line(80,110,150,110)}${box(150,94,90,32,'MCU input\nINPUT_PULLUP',{stroke:CY,size:9})}
      ${line(80,110,80,140)}${box(55,140,50,26,'button',{dash:true,size:10})}${line(80,166,80,185)}${gnd(80,185)}
      ${text(170,150,'idle: pulled HIGH = 1\npressed: LOW = 0',{size:10,color:DIM})}${text(170,192,'internal pull-up: 20–80 kΩ',{size:9,color:DIM})}
      ${text(276,60,'1',{size:9,anchor:'end',color:DIM})}${text(276,120,'0',{size:9,anchor:'end',color:DIM})}
      ${path('M285 60 L360 60 L360 120 L365 120 L365 60 L370 60 L370 120 L378 120 L378 60 L382 60 L382 120 L395 120 L395 60 L399 60 L399 120 L545 120',MG,{sw:1.8})}
      ${text(410,42,'raw pin: contact chatter 1–20 ms',{size:10,color:MG})}${rect(358,50,90,80,'none',1,{stroke:LM})}${text(403,145,'ignore edges for 30–50 ms',{size:9,color:LM})}
      ${text(276,170,'1',{size:9,anchor:'end',color:DIM})}${text(276,200,'0',{size:9,anchor:'end',color:DIM})}${path('M285 170 L360 170 L360 200 L545 200',CY,{sw:1.8})}${text(470,160,'debounced: one clean press',{size:9,color:CY})}
      ${text(415,220,'hardware option: RC 10 kΩ · 100 nF + 74HC14',{size:9,color:DIM})}`,'Pull-up resistor with a button, and switch debouncing')},
   {cap:"One UART frame carrying the byte 0x41 ('A') at 8N1: the line idles HIGH, a LOW start bit, eight data bits least-significant first, a HIGH stop bit. There is no clock wire, so both ends must agree on the baud rate; at 115,200 baud each bit lasts 8.68 µs.",
    svg:svg(560,180,`${text(280,28,'UART 8N1 — byte 0x41 (\'A\') = 0100 0001, sent LSB first',{size:10,color:CY})}${text(12,60,'1',{size:9,anchor:'start',color:DIM})}${text(12,110,'0',{size:9,anchor:'start',color:DIM})}
      ${[60,104,148,192,236,280,324,368,412,456,500].map(xb=>line(xb,50,xb,118,{stroke:DIM,dash:true})).join('')}
      ${path('M20 60 L60 60 L60 110 L104 110 L104 60 L148 60 L148 110 L192 110 L236 110 L280 110 L324 110 L368 110 L368 60 L412 60 L412 110 L456 110 L456 60 L500 60 L540 60',LM,{sw:2})}
      ${[[40,'idle'],[82,'start'],[126,'d0=1'],[170,'d1=0'],[214,'d2=0'],[258,'d3=0'],[302,'d4=0'],[346,'d5=0'],[390,'d6=1'],[434,'d7=0'],[478,'stop'],[520,'idle']].map(([x,t],i)=>text(x,130,t,{size:9,color:(i===1||i===10)?MG:DIM})).join('')}
      ${text(280,152,'at 115,200 baud each bit is 8.68 µs → 10 bits = 86.8 µs → 11,520 bytes/s',{size:10,color:DIM})}${text(280,168,'no clock: both ends agree on the baud · TX → RX, RX → TX · share GND',{size:9,color:DIM})}`,'A UART frame bit by bit')},
   {cap:"One I2C write seen on a logic analyzer. START: SDA falls while SCL is high. The master clocks out the 7-bit address 0x76 plus the write bit; on the ninth clock the addressed device pulls SDA low (ACK). STOP: SDA rises while SCL is high. A HIGH on clock 9 is a NACK: nobody answered.",
    svg:svg(560,220,`${text(30,46,'SCL',{size:10,bold:true})}${text(30,118,'SDA',{size:10,bold:true})}
      ${path('M20 60 L100 60 '+[0,1,2,3,4,5,6,7,8].map(i=>'L'+(100+40*i)+' 85 L'+(120+40*i)+' 85 L'+(120+40*i)+' 60 L'+(140+40*i)+' 60').join(' ')+' L540 60',CY,{sw:1.8})}
      ${[0,1,2,3,4,5,6,7,8].map(i=>text(130+40*i,99,String(i+1),{size:9,color:DIM})).join('')}
      ${['1','1','1','0','1','1','0','W=0','ACK'].map((b,i)=>text(130+40*i,113,b,{size:9,color:i===8?MG:LM})).join('')}
      ${path('M20 130 L80 130 L80 155 L105 155 L105 130 L225 130 L225 155 L265 155 L265 130 L345 130 L345 155 L490 155 L490 130 L540 130',LM,{sw:1.8})}${line(425,155,465,155,{stroke:MG,sw:3})}
      ${text(80,113,'START',{size:9,color:CY})}${text(500,113,'STOP',{size:9,color:CY})}
      ${text(260,172,'address 0x76 = 1110110 · W = 0',{size:10,color:DIM})}${text(440,172,'ACK: device pulls SDA low',{size:9,color:MG})}
      ${text(280,192,'data may change only while SCL is low; START and STOP are the exceptions',{size:9,color:DIM})}${text(280,208,'HIGH on clock 9 = NACK (nobody home) → run the address scanner',{size:9,color:DIM})}`,'I2C start, address, acknowledge and stop on two wires')},
   {cap:"SPI, mode 0, reading the BME280's chip-ID register. The master drops that device's chip select, then clocks 16 bits: in the first frame MOSI carries the register address 0xD0 (bit 7 set = read) while MISO is ignored; in the second frame the master clocks dummy bits and MISO returns 0x60. Data changes on the falling SCK edge and is sampled on the rising edge.",
    svg:svg(560,236,`${text(300,14,'SPI mode 0: data changes on the falling SCK edge, sampled on the rising edge',{size:10,color:CY})}
      ${text(204,30,'frame 1: MOSI = 0xD0 (register 0xD0, read bit set)',{size:9,color:AM})}${text(412,30,'frame 2: MISO = 0x60 (chip ID)',{size:9,color:LM})}
      ${text(50,50,'CS',{size:10,bold:true,anchor:'end'})}${text(50,86,'SCK',{size:10,bold:true,anchor:'end'})}${text(50,132,'MOSI',{size:10,bold:true,anchor:'end'})}${text(50,178,'MISO',{size:10,bold:true,anchor:'end'})}
      ${path('M60 44 L86 44 L86 56 L530 56 L530 44 L548 44',MG,{sw:1.8})}
      ${path('M60 96 '+Array.from({length:16},(_,k)=>'L'+(108+26*k)+' 96 L'+(108+26*k)+' 76 L'+(121+26*k)+' 76 L'+(121+26*k)+' 96').join(' ')+' L548 96',CY,{sw:1.6})}
      ${line(308,66,308,196,{stroke:DIM,dash:true})}
      ${path(wave(95,[1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0],26,122,142,35,37),AM,{sw:1.8})}
      ${[1,1,0,1,0,0,0,0].map((b,k)=>text(108+26*k,110,String(b),{size:9,color:AM})).join('')}${text(412,110,'0x00 (dummy byte)',{size:9,color:DIM})}
      ${path('M60 188 L303 188',DIM,{sw:1.6,dash:true})}${path(wave(303,[0,1,1,0,0,0,0,0],26,168,188,0,37),LM,{sw:1.8})}
      ${text(204,156,'ignored',{size:9,color:DIM})}${[0,1,1,0,0,0,0,0].map((b,k)=>text(316+26*k,156,String(b),{size:9,color:LM})).join('')}
      ${text(300,212,'MSB first · CS low selects one device · 1–50+ MHz · SCK, MOSI, MISO and GND are shared',{size:9,color:DIM})}${text(300,228,'mode 0 is the common default; CPOL and CPHA pick the idle level and the sampling edge',{size:9,color:DIM})}`,'SPI chip select, clock, MOSI and MISO timing for a register read')}];

  /* ---------- Module 4: microcontrollers ---------- */
  I.p23m4=[{cap:"A microcontroller is a complete computer on one die: core, program flash, data SRAM and the peripherals, all hanging off one internal bus. Peripherals are memory-mapped registers, so writing a bit at an address flips a pin.",
    svg:svg(560,250,`${box(20,20,520,190,'',{dash:true,stroke:DIM})}${text(280,34,'ONE CHIP — a complete computer',{size:10,bold:true,color:CY})}
      ${box(36,48,112,56,'CPU core\nAVR 8-bit · Cortex-M',{stroke:CY,size:9})}${box(160,48,112,56,'flash (program)\n32 KB – 4 MB',{stroke:AM,size:9})}${box(284,48,112,56,'SRAM (data)\n2 KB – 520 KB',{stroke:AM,size:9})}${box(408,48,116,56,'clock\n16–240 MHz\ncrystal ±20 ppm',{stroke:DIM,size:9})}
      ${line(92,104,92,124)}${line(216,104,216,124)}${line(340,104,340,124)}${line(466,104,466,124)}${line(36,124,524,124,{sw:2.5})}${text(280,136,'internal bus — peripherals are memory-mapped registers',{size:9,color:DIM})}
      ${[['timers\nPWM · prescaler',CY],['UART · I2C · SPI\nserial',MG],['ADC\n10–12 bit',LM],['interrupts\nNVIC · vectors',AM],['GPIO pins\n≤ 20–40 mA each','currentColor']].map(([t,c],i)=>line(82+i*102,124,82+i*102,150)+box(36+i*102,150,92,48,t,{stroke:c,size:9})).join('')}
      ${[0,1,2,3,4,5].map(i=>line(452+i*14,198,452+i*14,208)).join('')}
      ${text(280,228,'boots in ms · deterministic timing · sleeps at µA · costs $1–10',{size:10,color:DIM})}${text(280,244,'ESP32 adds a Wi-Fi/BLE radio · RP2040 adds PIO state machines',{size:9,color:DIM})}`,'Microcontroller block diagram')},
   {cap:"A Cortex-M memory map: flash at the bottom with the vector table in its first words, SRAM holding globals, a heap growing up and a stack growing down, and peripheral registers at 0x4000_0000. The AVR is different (Harvard: separate flash and SRAM spaces), which is why F() keeps strings out of the UNO's 2 KB.",
    svg:svg(560,255,`${text(140,16,'Cortex-M address map (low addresses at bottom)',{size:9,color:DIM})}
      ${box(40,28,200,44,'peripherals: GPIO · timers · UART',{stroke:MG,size:9})}${text(246,66,'0x4000_0000',{size:9,mono:true,anchor:'start',color:DIM})}
      ${box(40,84,200,84,'',{stroke:AM})}${text(140,98,'stack ↓ grows down',{size:9,color:AM})}${text(140,126,'free — if they meet: random crash',{size:9,color:MG})}${text(140,154,'heap ↑ · .bss · .data globals',{size:9,color:AM})}${text(246,162,'0x2000_0000',{size:9,mono:true,anchor:'start',color:DIM})}
      ${box(40,180,200,66,'',{stroke:CY})}${text(140,196,'program code (.text)',{size:9,color:CY})}${box(40,218,200,28,'vectors: [0] SP · [1] reset',{stroke:CY,size:9,fill:'#06303d'})}${text(246,240,'0x0000_0000',{size:9,mono:true,anchor:'start',color:DIM})}
      ${box(330,30,220,70,'AVR (UNO) is Harvard:\nseparate flash and SRAM\naddress spaces — F("...")\nkeeps strings in flash',{size:9,stroke:AM})}
      ${box(330,115,220,56,'PORTB |= (1 << 5);\n→ pin 13 HIGH in 62.5 ns',{size:10,mono:true,stroke:CY})}
      ${box(330,186,220,56,'STM32F4: GPIOA ODR @ 0x4002_0014\nwrite bit 5 → PA5 high',{size:9,mono:true,stroke:MG})}`,'Memory map and memory-mapped registers')},
   {cap:"From source to silicon: the compiler produces an ELF, a converter emits a raw image, an uploader hands it to the bootloader (Optiboot over serial, the ESP32 ROM loader, or the RP2040's USB drive), which writes flash; on reset the vector table sends the core to your code.",
    svg:flow([{t:'source\n.ino · .c · .py'},{t:'compiler\navr-gcc · arm-gcc'},{t:'ELF\n(symbols + code)'},{t:'image\n.hex · .bin · .uf2'},{t:'uploader\navrdude · esptool'},{t:'bootloader\nwrites flash',stroke:AM},{t:'reset vector\nsetup() runs',stroke:LM}],{perRow:4,bw:118,bh:54,gap:22,label:'The embedded toolchain from source to running firmware'})},
   {cap:"A hardware timer doing the work with no code in the loop. The 16 MHz clock is divided by the prescaler to 15,625 ticks per second; counting 0 to 15,624 is exactly 15,625 ticks, so the compare-match interrupt fires once a second, as accurate as the crystal (±20 ppm, about 2 s a day).",
    svg:svg(560,212,`${box(20,20,150,50,'system clock\n16,000,000 Hz',{stroke:CY,size:10})}${arrow(170,45,205,45,'')}${box(205,20,150,50,'prescaler ÷ 1024\n(CS12 | CS10)',{stroke:AM,size:10})}${arrow(355,45,390,45,'')}${box(390,20,150,50,'timer tick\n15,625 Hz = 64 µs',{stroke:LM,size:10})}
      ${path('M465 70 L465 90 L95 90 L95 107','currentColor',{sw:1.3,marker:true})}
      ${box(20,110,150,50,'TOP = OCR1A = 15,624\ncount 0 … 15,624 (CTC)',{stroke:AM,size:9})}${arrow(170,135,205,135,'')}${box(205,110,150,50,'15,625 ticks\n= 1.000 s',{stroke:LM,size:10})}${arrow(355,135,390,135,'')}${box(390,110,150,50,'compare-match ISR\nPINB = (1 << 5)',{stroke:MG,size:10,mono:true})}
      ${text(280,180,'f = 16,000,000 / (1024 × (15,624 + 1)) = 1.000 Hz',{size:10,color:DIM})}${text(280,198,'the ISR toggles pin 13 every second; loop() stays free · accuracy is the crystal\'s: ±20 ppm',{size:9,color:DIM})}`,'Timer prescaler and compare-match arithmetic for a 1 Hz interrupt')}];

  /* ---------- Module 5: sensors, actuators, power ---------- */
  I.p23m5=[{cap:"An H-bridge is four switches around a motor. Closing S1 and S4 sends current left to right (forward); closing S2 and S3 reverses it; PWM on the active pair sets speed. Closing S1 with S3 (or S2 with S4) shorts the supply: shoot-through.",
    svg:svg(560,240,`${line(160,40,400,40,{stroke:AM,sw:1.6})}${text(140,40,'+12 V',{size:10,bold:true,color:AM})}${line(160,200,400,200,{sw:1.6})}${text(140,200,'GND',{size:10,bold:true})}
      ${line(200,40,200,62)}${box(170,62,60,28,'S1 ON',{stroke:LM,size:10})}${line(200,90,200,150)}${box(170,150,60,28,'S3 off',{stroke:DIM,dash:true,size:10})}${line(200,178,200,200)}
      ${line(360,40,360,62)}${box(330,62,60,28,'S2 off',{stroke:DIM,dash:true,size:10})}${line(360,90,360,150)}${box(330,150,60,28,'S4 ON',{stroke:LM,size:10})}${line(360,178,360,200)}
      ${line(200,120,258,120)}${line(302,120,360,120)}<circle cx="280" cy="120" r="22" fill="none" stroke="currentColor" stroke-width="1.5"/>${text(280,120,'M',{size:14,bold:true})}
      ${arrow(200,96,200,114,'',{stroke:LM,sw:2})}${arrow(205,112,253,112,'',{stroke:LM,sw:2})}${arrow(360,126,360,144,'',{stroke:LM,sw:2})}
      ${text(80,104,'never S1+S3\nor S2+S4:\nshoot-through',{size:9,color:MG})}
      ${box(420,60,125,46,'S1 + S4 on: forward',{stroke:LM,size:10})}${box(420,118,125,46,'S2 + S3 on: reverse',{stroke:MG,size:10})}${box(420,176,125,46,'PWM the ON pair\n= speed',{stroke:CY,size:10})}
      ${text(280,230,'TB6612FNG / DRV8833 (MOSFET, cool) vs L298N (bipolar, drops ~2 V)',{size:9,color:DIM})}`,'H-bridge motor driver with the forward current path')},
   {cap:"Duty cycling decides battery life. The node is awake 2 s of every 600 s at 160 mA and asleep the rest at 60 µA, so the average is 0.593 mA and an 18650 lasts about 140 days. Swap in a board whose regulator and LED draw 5 mA asleep and the same cell lasts 15 days.",
    svg:svg(560,200,`${rect(40,60,12,30,MG,0.7)}${text(46,48,'awake 2 s @ 160 mA',{size:9,color:MG,anchor:'start'})}${rect(52,60,468,30,CY,0.15)}${rect(40,60,480,30,'none',1,{stroke:'currentColor'})}${text(286,75,'sleep 598 s @ 60 µA',{size:10,color:CY})}
      ${text(40,102,'0 s',{size:9,color:DIM})}${text(520,102,'600 s',{size:9,color:DIM})}
      ${box(40,118,480,26,'average = (160 × 2 + 0.06 × 598) / 600 = 0.593 mA',{size:11,mono:true,stroke:AM})}
      ${box(40,150,230,26,'2,500 mAh × 80% ÷ 0.593 mA ≈ 140 days',{size:10,mono:true,stroke:LM})}${box(290,150,230,26,'5 mA board (AMS1117 + LED): 15 days',{size:10,mono:true,stroke:MG})}
      ${text(280,188,'board choice is a power decision: measure with an INA219, do not trust the datasheet',{size:9,color:DIM})}`,'Duty cycle arithmetic for battery life')},
   {cap:"The pattern that never changes: pin → driver → actuator. Logic and actuators get their own supplies sized for peaks, every power pin gets a decoupling capacitor, and all grounds meet at one star point, never through the microcontroller's thin traces.",
    svg:svg(560,220,`${box(30,15,110,36,'3.3 V LDO\n+ 100 nF / 100 µF',{stroke:CY,size:9})}${line(85,51,85,70)}${box(380,15,120,36,'motor supply 5–12 V\nrated for stall',{stroke:MG,size:9})}${line(440,51,440,70)}
      ${box(30,70,110,60,'ESP32\n3.3 V logic\npin ~12–20 mA',{stroke:CY,size:9})}${arrow(140,100,200,100,'signal')}${box(200,70,120,60,'driver\nMOSFET / H-bridge',{stroke:AM,size:9})}${arrow(320,100,380,100,'power')}${box(380,70,120,60,'actuator\nmotor · servo · strip',{stroke:MG,size:9})}
      ${text(440,150,'coil? → flyback diode',{size:9,color:AM})}
      ${line(85,130,85,185)}${line(260,130,260,185)}${line(440,165,440,185)}${line(85,185,440,185)}${dot(280,185,LM)}${text(292,172,'★ one ground point',{size:10,color:LM,anchor:'start'})}
      ${text(280,207,'star ground: all returns meet at one point, never through the MCU',{size:9,color:DIM})}`,'Pin, driver, actuator and the star ground')},
   {cap:"A hobby servo reads pulse width, not duty cycle: a 50 Hz frame (20 ms) carries one pulse of 1.0 to 2.0 ms, and that width is the angle command. Speed-controlled motors use ordinary PWM instead. Feed the servo from its own 5 V supply with a common ground; an SG90 stalls at 650 mA.",
    svg:svg(560,248,`${text(280,16,'servo signal: 50 Hz frame, pulse width = angle',{size:10,color:CY})}
      ${[[50,70,20,'1.0 ms → 0°','1.0 ms'],[100,120,30,'1.5 ms → 90°','1.5 ms'],[150,170,40,'2.0 ms → 180°','2.0 ms']].map(([yH,yL,w,lbl,pw],i)=>text(72,(yH+yL)/2,lbl,{size:9,anchor:'end',color:[CY,LM,MG][i]})+path('M80 '+yL+' L80 '+yH+' L'+(80+w)+' '+yH+' L'+(80+w)+' '+yL+' L480 '+yL+' L480 '+yH+' L'+(480+w)+' '+yH+' L'+(480+w)+' '+yL+' L540 '+yL,[CY,LM,MG][i],{sw:1.8})+text(80+w+26,yH+4,pw,{size:9,color:[CY,LM,MG][i]})).join('')}
      ${line(80,190,480,190,{stroke:DIM})}${line(80,184,80,196,{stroke:DIM})}${line(480,184,480,196,{stroke:DIM})}${text(280,204,'20 ms frame (50 Hz) — the pulse width is the command; the frame is only the refresh',{size:9,color:DIM})}
      ${text(280,222,'servo on its own 5 V supply (SG90 stalls at 650 mA, MG996R up to 2.5 A), ground shared with the MCU',{size:9,color:DIM})}
      ${text(280,238,'the UNO Servo library and ESP32 LEDC make this pulse; analogWrite() at 490 Hz does not',{size:9,color:DIM})}`,'Servo pulse-width timing at 50 Hz')}];

  /* ---------- Module 6: building and debugging ---------- */
  I.p23m6=[{cap:"What an oscilloscope shows that a multimeter cannot: the 3.3 V rail dips to 2.6 V for a few milliseconds when the motor starts, enough to reset the chip. Trigger on the falling edge, 500 mV per division, DC coupling. The probe's ground clip is bonded to mains earth: never clip it to a live node.",
    svg:svg(560,230,`${rect(30,20,400,170,'none',1,{stroke:'currentColor'})}${[1,2,3,4,5,6,7,8,9].map(i=>line(30+40*i,20,30+40*i,190,{stroke:DIM,sw:0.6})).join('')}${[1,2,3,4,5,6,7].map(i=>line(30,20+21.25*i,430,20+21.25*i,{stroke:DIM,sw:0.6})).join('')}
      ${line(190,20,190,190,{stroke:AM,dash:true})}${text(190,12,'▼ trigger',{size:9,color:AM})}
      ${path('M30 60 L190 60 L198 90 L210 70 L222 84 L236 66 L252 74 L270 64 L290 61 L430 60',LM,{sw:2})}
      ${text(110,48,'3.3 V rail',{size:10,color:LM})}${text(300,120,'dip when the motor starts: 3.3 → 2.6 V',{size:9,color:MG})}${arrow(300,110,230,94,'',{stroke:MG})}
      ${box(30,196,400,22,'CH1 500 mV/div · 2 ms/div · DC · trig ↓ 3.0 V',{size:9,mono:true,stroke:DIM,rx:3})}
      ${box(445,25,100,42,'10× probe\n10 MΩ · few pF',{size:9,stroke:CY})}${box(445,78,100,42,'bandwidth ≥ 5×\nsignal frequency',{size:9,stroke:AM})}${box(445,131,100,42,'AC couple to\nzoom on ripple',{size:9,stroke:DIM})}${box(445,184,100,34,'GND clip = mains\nearth!',{size:9,stroke:MG})}`,'Oscilloscope trace of a supply dip')},
   {cap:"Three joints under the magnifier. A good joint is bright and concave and wets both pad and lead. A cold joint is a dull ball sitting on the pad with no wetting (not enough heat on both surfaces). A bridge is a blob that shorts two pads. The last two are found by eye and by continuity test.",
    svg:compare({t:'GOOD JOINT',draw:x=>`${rect(x+40,120,180,12,DIM,0.5)}${rect(x+110,112,40,8,AM,0.7)}${line(x+130,40,x+130,112,{sw:3})}${path('M'+(x+100)+' 120 C '+(x+118)+' 112, '+(x+124)+' 92, '+(x+130)+' 72 C '+(x+136)+' 92, '+(x+142)+' 112, '+(x+160)+' 120 Z',LM,{fill:LM,op:0.55})}
        ${text(x+130,150,'bright, concave, wets pad and lead',{size:9,color:LM})}${text(x+130,166,'heat pad + lead ~1 s · feed solder · 1 s · lift',{size:9,color:DIM})}`},
      {t:'COLD · BRIDGED',draw:x=>`${rect(x+30,120,220,12,DIM,0.5)}${rect(x+50,112,40,8,AM,0.7)}${line(x+70,40,x+70,112,{sw:3})}<circle cx="${x+70}" cy="96" r="17" fill="${DIM}" opacity="0.8" stroke="${MG}"/>${text(x+70,150,'cold: dull ball,\nno wetting',{size:9,color:MG})}
        ${rect(x+150,112,30,8,AM,0.7)}${rect(x+200,112,30,8,AM,0.7)}${line(x+165,40,x+165,112,{sw:3})}${line(x+215,40,x+215,112,{sw:3})}<ellipse cx="${x+190}" cy="106" rx="50" ry="14" fill="${MG}" opacity="0.4" stroke="${MG}"/>${text(x+190,150,'bridge: blob joins\ntwo pads → short',{size:9,color:MG})}`},{h:195,label:'Good, cold and bridged solder joints'})},
   {cap:"KiCad from idea to boards in the mail. Two automated checks guard the flow: ERC catches schematic mistakes (unconnected pins, conflicting outputs), DRC catches layout mistakes against the fabricator's limits (clearance, trace width, drill size).",
    svg:flow([{t:'schematic\nsymbols · nets'},{t:'annotate +\nassign footprints'},{t:'ERC\nelectrical rules',stroke:AM},{t:'PCB layout\nplace · route · zones'},{t:'DRC\nfab rules',stroke:AM},{t:'Gerber + drill\nexport'},{t:'fabricator\nJLCPCB · PCBWay · OSH',stroke:LM}],{perRow:4,bw:118,bh:54,gap:22,label:'KiCad design flow from schematic to fabricated board'})},
   {cap:"The fault-finding order that saves weekends: reproduce, then measure power at the chip under load, then prove one common ground, then look at signals (scope for shape, analyzer for content), and only then read code. One change per experiment, written down.",
    svg:flow([{t:'reproduce\nthe failure'},{t:'POWER\nrails at the chip,\nunder load',stroke:AM},{t:'GROUND\none common GND,\ncontinuity',stroke:LM},{t:'SIGNALS\nscope: shape\nanalyzer: bytes',stroke:CY},{t:'CODE\nprints · minimal\nsketch',stroke:MG},{t:'one change per\nexperiment · log it'}],{perRow:3,bw:150,bh:58,gap:40,label:'Fault-finding method: power, ground, signals, code'})}];

  /* ---------- Module 7: embedded software and IoT ---------- */
  I.p23m7=[{cap:"Firmware as a state machine: five named states, explicit transitions, and a timeout that is a transition rather than a hope. Deep sleep ends in a reset, so the loop re-enters IDLE from the top. Nothing blocks, so buttons, keepalives and the watchdog all keep running.",
    svg:svg(560,230,`${box(20,40,100,40,'IDLE',{stroke:CY,fill:'#06303d',bold:true})}${box(160,40,100,40,'SAMPLING',{bold:true})}${box(300,40,110,40,'CONNECTING',{bold:true})}${box(440,40,100,40,'PUBLISHING',{bold:true})}${box(300,150,110,40,'SLEEPING',{stroke:AM,bold:true})}
      ${arrow(120,60,160,60,'time to sample',{dy:28})}${arrow(260,60,300,60,'sensor read',{dy:28})}${arrow(410,60,440,60,'wifiUp()',{dy:28})}
      ${path('M490 80 L490 170 L413 170','currentColor',{sw:1.3,marker:true})}${text(482,125,'publish() ok',{size:10,color:DIM,anchor:'end'})}
      ${arrow(355,80,355,150,'timeout 10 s',{color:MG})}
      ${path('M300 170 L70 170 L70 83','currentColor',{sw:1.3,marker:true})}${text(185,160,'deepSleepFor(600) → wake = reset',{size:9,color:AM})}
      ${text(280,212,'every transition explicit · timeouts are states · no delay() · feed the watchdog',{size:9,color:DIM})}`,'Sensor node firmware as a state machine')},
   {cap:"MQTT is publish/subscribe through a broker: the node publishes one topic, and anything that subscribes (a dashboard, Home Assistant, a Hermes agent) receives it. Devices never address each other. Plaintext 1883 belongs only on a lab network; 8883 with TLS is what you deploy.",
    svg:svg(560,240,`${text(280,20,'publish/subscribe: devices never talk to each other, only to the broker',{size:10,color:DIM})}
      ${box(20,95,140,50,'ESP32 node\npublish home/garage/env',{stroke:LM,size:9})}${arrow(160,120,205,120,'QoS 1')}${box(205,90,150,60,'broker (Mosquitto)\non the Pi · TLS :8883',{stroke:CY,size:10})}
      ${arrow(355,108,400,52,'')}${arrow(355,120,400,120,'')}${arrow(355,132,400,188,'')}
      ${box(400,30,140,44,'Home Assistant\nsub home/#',{stroke:MG,size:9})}${box(400,98,140,44,'Hermes agent (Ph. 12)\nsub home/garage/+',{stroke:MG,size:9})}${box(400,166,140,44,'phone dashboard\nsub home/garage/env',{stroke:MG,size:9})}
      ${text(280,168,'retained msg · Last Will "offline"\nkeepalive · wildcards + and #',{size:9,color:AM})}
      ${text(280,222,'1883 plaintext = lab only · 8883 TLS with CA verified + client cert = deploy',{size:9,color:DIM})}`,'MQTT publish and subscribe through a broker')},
   {cap:"Over-the-air updates done safely: two application slots in flash. The running app downloads the new image over verified TLS into the idle slot, checks its signature, marks it pending and reboots; if the new firmware does not confirm itself within its first boot, the bootloader rolls back.",
    svg:svg(560,170,`${text(280,20,'ESP32 flash: two app slots make updates safe',{size:10,color:CY})}
      ${box(20,38,68,50,'boot-\nloader',{size:9,stroke:DIM})}${box(88,38,58,50,'partition\ntable',{size:9,stroke:DIM})}${box(146,38,74,50,'otadata\n(which slot)',{size:9,stroke:AM})}${box(220,38,160,50,'ota_0\nrunning v1.4.1',{size:10,stroke:LM,fill:'#06303d'})}${box(380,38,160,50,'ota_1\nnew v1.4.2 (idle slot)',{size:10,stroke:MG})}
      ${box(20,110,120,44,'1 fetch over TLS\ninto the idle slot',{size:9,stroke:CY})}${arrow(140,132,160,132,'')}${box(160,110,120,44,'2 verify signature\n(Secure Boot V2)',{size:9,stroke:CY})}${arrow(280,132,300,132,'')}${box(300,110,120,44,'3 mark pending\nreboot into it',{size:9,stroke:CY})}${arrow(420,132,440,132,'')}${box(440,110,100,44,'4 confirm or\nroll back',{size:9,stroke:AM})}`,'Dual-partition OTA update with rollback')},
   {cap:"Defense in depth on a five-dollar chip: each layer assumes the one above it has failed. Mirai needed only default passwords and an open Telnet port; every layer here would have stopped it.",
    svg:stack([{t:'network: isolated IoT VLAN · firewall allows broker only · no UPnP',stroke:CY},{t:'transport: TLS on 8883 · CA verified · client certificate per device',stroke:LM},{t:'firmware: signed images · Secure Boot V2 · OTA with rollback',stroke:AM},{t:'device: unique credentials · UART console off · JTAG fused off',stroke:MG},{t:'application: validate every topic and payload · log · update + EOL plan',stroke:DIM}],{w:520,h:36,label:'Defense in depth for an IoT node'})}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
