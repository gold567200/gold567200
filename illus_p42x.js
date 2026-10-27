/* Third figures — Domain 42: Radio & RF Engineering: The Amateur License, SDR, Antennas & Propagation. Adds to the figures in illus_p42.js (never replaces them). */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const add=(id,figs)=>{ window.ILLUS=window.ILLUS||{}; window.ILLUS[id]=(window.ILLUS[id]||[]).concat(figs); };
  const dot=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
  const zone=(x,y,w,h,c,op)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" opacity="${op||0.16}"/>`;

  /* m1 — the same frequencies under several rules */
  add('p42m1',[{cap:"The same frequencies sit under several rules at once. 902–928 MHz is both an ISM band and the amateur 33 cm band, and the 13 cm amateur band overlaps 2.4 GHz Wi-Fi. A licensee has standing there; a Part 15 device must accept interference and cause none.",
    svg:svg(560,262,`${text(280,14,'Shared spectrum: who has standing',{bold:true,color:CY,size:11})}
      ${text(62,58,'900 MHz\nband',{bold:true,size:11})}
      ${box(148,30,364,20,'Part 18 ISM band 902–928 MHz',{stroke:DIM,size:10})}
      ${box(148,54,364,20,'Part 97 amateur 33 cm (licensed)',{stroke:LM,size:10,color:LM})}
      ${box(148,78,364,20,'Part 15 LoRa · Meshtastic default',{stroke:AM,size:10,color:AM})}
      ${line(120,106,540,106,{stroke:DIM})}${line(148,102,148,110)}${line(512,102,512,110)}
      ${text(148,118,'902',{size:9,color:DIM})}${text(512,118,'928 MHz',{size:9,color:DIM})}
      ${text(62,170,'2.4 GHz\nband',{bold:true,size:11})}
      ${box(155,134,210,20,'13 cm amateur 2,390–2,450',{stroke:LM,size:10,color:LM})}
      ${box(190,158,292,20,'Part 18 ISM 2,400–2,483.5 MHz',{stroke:DIM,size:10})}
      ${box(190,182,292,20,'Part 15 Wi-Fi · Bluetooth',{stroke:AM,size:10,color:AM})}
      ${line(120,210,540,210,{stroke:DIM})}${[155,190,365,482].map(x=>line(x,206,x,214)).join('')}
      ${text(155,222,'2,390',{size:9,color:DIM})}${text(190,234,'2,400',{size:9,color:DIM})}${text(365,222,'2,450',{size:9,color:DIM})}${text(482,222,'2,483.5',{size:9,color:DIM})}
      ${text(150,252,'Part 97: licensed, has standing',{size:10,color:LM})}${text(420,252,'Part 15: accept interference, cause none',{size:10,color:AM})}`,
      'Overlapping ISM, amateur and Part 15 allocations at 900 MHz and 2.4 GHz')}]);

  /* m2 — noise floor from bandwidth, then the Shannon ceiling */
  add('p42m2',[{cap:"Noise is power per hertz, so bandwidth sets the floor: −174 dBm/Hz plus 10 log B gives −140 dBm in a 2.5 kHz SSB channel and −101 dBm in a 20 MHz Wi-Fi channel (about −95 dBm after the receiver's noise figure). Shannon then caps the rate: about 166 Mbps at 25 dB SNR, of which 802.11ax MCS 11 reaches 86%.",
    svg:svg(560,232,`${text(280,12,'Bandwidth sets the noise floor',{bold:true,color:CY,size:11})}
      ${box(10,58,120,56,'thermal noise kT\n−174 dBm/Hz\nat 290 K',{stroke:DIM,size:10})}
      ${arrow(130,78,200,52,'')}${arrow(130,96,200,122,'')}${text(165,88,'+10 log B',{size:10,color:DIM})}
      ${box(200,28,150,44,'SSB, B = 2.5 kHz\n−174 + 34 = −140 dBm',{stroke:CY,size:10})}
      ${box(200,100,150,44,'Wi-Fi, B = 20 MHz\n−174 + 73 = −101 dBm',{stroke:MG,size:10})}
      ${arrow(350,50,420,50,'+17 dB')}${box(420,28,130,44,'FT8 in its 50 Hz:\n−20 dB → −3 dB SNR',{stroke:CY,size:9})}
      ${arrow(350,122,420,122,'NF 5–8 dB')}${box(420,100,130,44,'survey floor\n≈ −95 dBm',{stroke:MG,size:10})}
      ${text(10,166,'Shannon: C = B log2(1 + S/N)',{anchor:'start',bold:true,size:10,color:CY})}
      ${text(10,184,'20 MHz at 25 dB (S/N 316)',{anchor:'start',size:9,color:DIM})}
      ${box(210,158,300,18,'ceiling ≈ 166 Mbps',{stroke:DIM,dash:true,size:10,rx:3})}
      ${zone(210,184,259,18,LM,0.3)}${box(210,184,259,18,'802.11ax MCS 11: 143.4 Mbps',{stroke:LM,size:10,rx:3})}${text(492,193,'86%',{size:11,bold:true,color:LM})}
      ${text(280,222,'the data rate follows SNR, not the label',{size:10,color:AM})}`,
      'Thermal noise floor for SSB and Wi-Fi bandwidths and the Shannon capacity ceiling')}]);

  /* m3 — RF exposure evaluation */
  add('p42m3',[{cap:"The RF-exposure station evaluation as one calculation: 50 W into a 6 dBi antenna is 200 W EIRP, and power density S = EIRP/(4πR²) falls to the 0.2 mW/cm² general-population limit (30–300 MHz) at 2.8 m in free space, or about 4.5 m with the 2.56 ground-reflection factor. Distance, not hope, is the control.",
    svg:svg(560,222,`${text(280,12,'RF exposure: distance is the control',{bold:true,color:CY,size:11})}
      ${box(10,26,140,44,'50 W into 6 dBi\n= 200 W EIRP',{stroke:CY,size:11})}${arrow(150,48,220,48,'spreads')}
      ${box(220,26,170,44,'S = EIRP / (4π R²)',{stroke:DIM,size:12,mono:true})}${arrow(390,48,450,48,'solve R')}
      ${box(450,26,100,44,'limit\n0.2 mW/cm²',{stroke:AM,size:11,color:AM})}
      ${zone(50,96,224,30,MG)}${zone(274,96,136,30,AM)}${zone(410,96,130,30,LM,0.13)}
      ${line(50,90,50,132,{stroke:CY,sw:3})}${text(50,82,'antenna',{size:9,color:CY})}
      ${text(162,111,'above the limit',{size:10,color:MG})}${text(342,111,'above, with reflection',{size:9,color:AM})}${text(475,111,'below the limit',{size:10,color:LM})}
      ${line(50,136,540,136,{stroke:DIM})}${[50,274,410].map(x=>line(x,132,x,140)).join('')}
      ${text(50,148,'0 m',{size:9,color:DIM})}${text(274,148,'2.8 m',{size:10,bold:true})}${text(410,148,'4.5 m',{size:10,bold:true})}
      ${text(274,162,'free space',{size:9,color:DIM})}${text(410,162,'× 2.56 ground factor',{size:9,color:DIM})}
      ${text(280,186,'public limit · 30–300 MHz · 30-min average',{size:9,color:DIM})}
      ${text(280,206,'never work on an antenna that can transmit',{size:10,color:AM})}`,
      'Power density versus distance for 200 watts EIRP against the FCC general-population limit')}]);

  /* m4 — Doppler during an ISS pass */
  const P=(t)=>[ (1-t)*(1-t)*80+2*t*(1-t)*280+t*t*480, (1-t)*(1-t)*150+2*t*(1-t)*10+t*t*150 ];
  add('p42m4',[{cap:"Doppler on an ISS FM pass. At about 7.5 km/s the 437.800 MHz downlink arrives up to about 11 kHz high while the station approaches and as far low as it recedes, so you step through five memory channels from 437.810 to 437.790 MHz; the 145.990 MHz uplink and its 67.0 Hz tone stay fixed.",
    svg:svg(560,222,`${text(280,12,'Doppler on an ISS pass',{bold:true,color:CY,size:11})}
      <path d="M80 150 Q280 10 480 150" fill="none" stroke="currentColor" stroke-width="1.3" stroke-dasharray="5 4"/>
      ${line(20,150,540,150,{sw:1.6})}${arrow(230,40,330,40,'≈ 7.5 km/s')}
      ${[0,0.25,0.5,0.75,1].map((t,i)=>{ const [x,y]=P(t); const lab=['437.810','437.805','437.800','437.795','437.790'][i];
        return dot(x,y,5,CY)+(i===0?text(70,138,lab,{size:10,mono:true,anchor:'end'}):i===4?text(490,138,lab,{size:10,mono:true,anchor:'start'}):text(x,y-16,lab,{size:10,mono:true})); }).join('')}
      ${line(280,150,280,140,{stroke:LM,sw:2})}
      ${['rising','approaching','overhead','receding','setting'].map((l,i)=>text(80+i*100,164,l,{size:9,color:DIM})).join('')}
      ${['+10 kHz','+5 kHz','0','−5 kHz','−10 kHz'].map((l,i)=>text(80+i*100,178,l,{size:9,color:AM})).join('')}
      ${text(280,198,'Δf = f·v/c ≈ ±11 kHz at 437.8 MHz',{size:10,color:CY})}
      ${text(280,213,'uplink fixed: 145.990 MHz + 67.0 Hz tone',{size:9,color:DIM})}`,
      'ISS pass with five downlink memory channels stepping down through the Doppler shift')}]);

  /* m5 — GNU Radio FM receiver with sample rates */
  add('p42m5',[{cap:"The lab's FM receiver as a flowgraph. The low-pass filter isolates the 200 kHz-wide station and decimates by 10 (2.4 MSPS to 240 kSPS); WBFM Receive takes the phase derivative and decimates by 5 to 48 kSPS for the audio sink. A frequency sink on the source makes the same graph a spectrum analyzer.",
    svg:svg(560,204,`${text(280,12,'Five blocks, falling sample rates',{bold:true,color:CY,size:11})}
      ${box(10,30,130,56,'RTL-SDR Source\ntuned to a station',{stroke:CY,size:10})}${arrow(140,58,210,58,'2.4 MSPS')}
      ${box(210,30,130,56,'Low Pass Filter\ncutoff 100 kHz\ndecimate ÷10',{stroke:AM,size:10})}${arrow(340,58,410,58,'240 kSPS')}
      ${box(410,30,140,56,'WBFM Receive\nquad rate 240 k\naudio ÷5',{stroke:MG,size:10})}
      ${arrow(480,86,480,130,'48 kSPS')}${box(410,130,140,46,'Audio Sink\n48 kHz',{stroke:LM,size:10})}
      ${arrow(75,86,75,130,'')}${box(10,130,130,46,'QT GUI Frequency Sink\n= spectrum analyzer',{stroke:DIM,size:9})}
      ${box(210,130,130,46,'Rational Resampler\nonly for 44.1 kHz',{stroke:DIM,dash:true,size:9})}${line(340,153,410,153,{dash:true,stroke:DIM})}
      ${text(280,194,'÷10 then ÷5: 2.4 M → 240 k → 48 k',{size:10,color:AM})}`,
      'GNU Radio FM receiver flowgraph with the sample rate on every connection')}]);

  /* m6 — call-sign anatomy and the identification rule */
  const letter=(x,ch,c)=>box(x,26,44,44,ch,{stroke:c,color:c,bold:true,size:22,mono:true});
  add('p42m6',[{cap:"Reading a call sign and using it. KJ5ABC is a two-letter prefix, the call district (5 is Texas) and a three-letter suffix — the sequential 2×3 format new Technicians receive. Part 97.119 then requires the call sign at least every 10 minutes during a contact and at its end.",
    svg:svg(560,220,`${letter(145,'K',CY)}${letter(193,'J',CY)}${letter(251,'5',AM)}${letter(309,'A',LM)}${letter(357,'B',LM)}${letter(405,'C',LM)}
      ${line(145,78,237,78,{stroke:CY})}${line(251,78,295,78,{stroke:AM})}${line(309,78,449,78,{stroke:LM})}
      ${text(191,92,'prefix',{size:10,bold:true,color:CY})}${text(273,92,'call district',{size:10,bold:true,color:AM})}${text(379,92,'suffix',{size:10,bold:true,color:LM})}
      ${text(191,106,'K, N, W or 2 letters',{size:9,color:DIM})}${text(273,106,'Texas = 5',{size:9,color:DIM})}${text(379,106,'new Technician: 2×3',{size:9,color:DIM})}
      ${text(280,130,'Identify (97.119)',{bold:true,size:11,color:CY})}
      <rect x="40" y="152" width="432" height="16" rx="3" fill="${CY}" opacity="0.15"/>${line(40,160,520,160,{stroke:DIM})}
      ${text(40,182,'0 min',{size:9,color:DIM})}
      ${[[200,'10 min'],[360,'20 min'],[472,'end (27 min)']].map(([x,l])=>dot(x,160,6,LM)+text(x,144,'ID',{size:10,bold:true,color:LM})+text(x,182,l,{size:9,color:DIM})).join('')}
      ${text(120,144,'one contact',{size:9,color:DIM})}
      ${text(280,206,'upgrade: KJ5ABC/AG until ULS updates',{size:9,color:DIM})}`,
      'Call sign prefix, district and suffix, and identification every 10 minutes and at the end')}]);

  /* m7 — reading an anomaly on the waterfall, defensively */
  add('p42m7',[{cap:"Spectrum monitoring is baseline-then-anomaly. The shape on the waterfall names the likely source — a flat hump is a jammer, a drifting hump near 2.45 GHz at lunchtime is a microwave oven, a beacon from a BSSID you do not own is a rogue AP — and every finding is documented, located and remedied without transmitting anything.",
    svg:svg(560,252,`${box(170,8,220,38,'anomaly vs baseline\nwaterfall · rtl_power sweep',{stroke:CY,size:10})}
      ${[74,212,350,488].map(x=>arrow(280,46,x,76,'')).join('')}
      ${box(10,78,128,56,'flat broad hump\n= jammer',{stroke:MG,size:10})}
      ${box(148,78,128,56,'drifting hump\nnear 2.45 GHz\n= microwave oven',{stroke:AM,size:10})}
      ${box(286,78,128,56,'beacon from a\nBSSID you don\'t own\n= rogue AP',{stroke:AM,size:10})}
      ${box(424,78,126,56,'12.5 kHz TDMA buzz\n= DMR hotspot',{stroke:DIM,size:10})}
      ${[74,212,350,487].map(x=>arrow(x,134,x,152,'')).join('')}
      ${box(10,152,540,30,'log: time, frequency, bandwidth, dBm, place',{stroke:AM,size:10})}
      ${arrow(142,182,142,198,'')}${arrow(418,182,418,198,'')}
      ${box(10,198,265,32,'locate: walk it down, ARDF Yagi',{stroke:LM,size:10})}
      ${box(285,198,265,32,'remedy; persistent? report to FCC',{stroke:LM,size:10})}
      ${text(280,244,'receive-only: nothing transmitted, nothing touched',{size:9,color:DIM})}`,
      'Classifying RF anomalies by waterfall signature, then documenting, locating and remedying them')}]);
})();
