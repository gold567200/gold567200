/* Illustrations — Domain 52: Signals, Control Systems & Robotics, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  /* ---------- local helpers: curves computed from the real equations ---------- */
  const f1=v=>(Math.round(v*10)/10).toFixed(1);
  const pl=(pts,o={})=>'<polyline points="'+pts.map(p=>f1(p[0])+','+f1(p[1])).join(' ')+'" fill="none" stroke="'+(o.c||'currentColor')+'" stroke-width="'+(o.w||1.6)+'"'+(o.dash?' stroke-dasharray="5 4"':'')+(o.op?' opacity="'+o.op+'"':'')+' stroke-linejoin="round"/>';
  const curve=(fn,a,b,n,X,Y)=>{ const p=[]; for(let i=0;i<=n;i++){ const t=a+(b-a)*i/n; p.push([X(t),Y(fn(t))]); } return p; };
  const dot=(x,y,r,c)=>'<circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="'+r+'" fill="'+(c||'currentColor')+'"/>';
  const ring=(x,y,r,c,w)=>'<circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="'+r+'" fill="none" stroke="'+(c||'currentColor')+'" stroke-width="'+(w||1.3)+'"/>';
  const rect=(x,y,w,h,c,op)=>'<rect x="'+f1(x)+'" y="'+f1(y)+'" width="'+f1(w)+'" height="'+f1(h)+'" fill="'+c+'" opacity="'+op+'"/>';
  const cross=(x,y,c,s)=>{ s=s||6; return line(x-s,y-s,x+s,y+s,{stroke:c,sw:2.2})+line(x-s,y+s,x+s,y-s,{stroke:c,sw:2.2}); };
  const path=(d,c,o={})=>'<path d="'+d+'" fill="none" stroke="'+(c||'currentColor')+'" stroke-width="'+(o.w||1.3)+'"'+(o.dash?' stroke-dasharray="5 4"':'')+(o.arrow?' marker-end="url(#ah)"':'')+'/>';
  const lg=(x,y,c,t,o={})=>line(x,y,x+22,y,{stroke:c,sw:2.2,dash:o.dash})+text(x+28,y,t,{anchor:'start',size:o.size||10,color:o.tc});

  /* ================= MODULE 1: signals and sampling ================= */
  I.p52m1=[
   {cap:"Sampling keeps only the values at t = nT. The continuous sine (thin line) becomes the sequence of stems; here fs is 8 samples per cycle, comfortably above the 2-per-cycle floor of the sampling theorem.",
    svg:(function(){ const X=t=>40+t*480, Y=v=>105-v*65; let s=line(40,105,525,105,{stroke:DIM});
      s+=pl(curve(t=>Math.sin(2*Math.PI*2*t),0,1,240,X,Y),{w:1.4});
      for(let n=0;n<=16;n++){ const t=n/16, v=Math.sin(2*Math.PI*2*t); s+=line(X(t),105,X(t),Y(v),{stroke:CY,sw:1.6})+dot(X(t),Y(v),3.5,CY); }
      s+=text(40,20,'x(t): the continuous signal',{anchor:'start',size:11})+text(525,20,'x[n] = x(nT): the samples',{anchor:'end',size:11,color:CY});
      s+=line(160,186,160,196)+line(190,186,190,196)+line(160,191,190,191)+text(175,206,'T = 1/fs',{size:10});
      s+=text(525,206,'8 samples per cycle',{anchor:'end',size:10,color:DIM});
      return svg(560,220,s,'A sine wave and its samples taken every T seconds'); })()},
   {cap:"Aliasing made visible: a 9 Hz cosine (dashed) sampled 10 times a second produces exactly the same samples as a 1 Hz cosine. Above the 5 Hz Nyquist frequency, a frequency f is indistinguishable from |f − fs|.",
    svg:(function(){ const X=t=>40+t*480, Y=v=>100-v*58; let s=line(40,100,525,100,{stroke:DIM});
      s+=pl(curve(t=>Math.cos(2*Math.PI*9*t),0,1,700,X,Y),{c:DIM,w:1.2,dash:true});
      s+=pl(curve(t=>Math.cos(2*Math.PI*t),0,1,200,X,Y),{c:AM,w:2.2});
      for(let n=0;n<=10;n++){ const t=n/10; s+=dot(X(t),Y(Math.cos(2*Math.PI*9*t)),4.2,MG); }
      s+=text(40,20,'9 Hz signal (dashed)',{anchor:'start',size:11,color:DIM})+text(290,20,'sampled at 10 Hz',{size:11,color:MG})+text(525,20,'what you see: 1 Hz',{anchor:'end',size:11,color:AM});
      s+=text(280,196,'alias = |9 − 10| = 1 Hz  ·  Nyquist = 5 Hz',{size:11,bold:true,color:CY});
      return svg(560,212,s,'A 9 hertz signal sampled at 10 hertz aliases to 1 hertz'); })()},
   {cap:"Quantization rounds every sample to one of 2^N levels. With 3 bits the staircase error is easy to see; each extra bit halves the step and buys 6.02 dB, which is where 98 dB for 16-bit audio comes from.",
    svg:(function(){ const X=t=>30+t*300, Y=v=>118-v*80; let s='';
      for(let k=0;k<=8;k++){ const y=Y(k/8*2-1); s+=line(30,y,330,y,{stroke:DIM,dash:true}); }
      s+=pl(curve(t=>0.95*Math.sin(2*Math.PI*t),0,1,200,X,Y),{c:DIM,w:1.3});
      const q=v=>{ const c=Math.min(7,Math.max(0,Math.floor((v+1)/2*8))); return (c+0.5)/8*2-1; };
      s+=pl(curve(t=>q(0.95*Math.sin(2*Math.PI*t)),0,1,600,X,Y),{c:CY,w:2});
      s+=text(30,22,'3 bits = 8 levels',{anchor:'start',size:11,color:CY})+text(330,22,'error within ±Δ/2',{anchor:'end',size:11,color:AM});
      s+=text(455,26,'SQNR = 6.02 N + 1.76 dB',{bold:true,color:CY,size:11});
      [['8-bit → 49.9 dB',DIM],['12-bit → 74.0 dB','currentColor'],['16-bit → 98.1 dB',CY],['24-bit → 146.2 dB',LM]].forEach((r,i)=>{ s+=box(365,44+i*40,180,32,r[0],{stroke:r[1],size:11}); });
      s+=text(455,212,'each bit adds 6.02 dB',{size:10,color:DIM});
      return svg(560,228,s,'A sine quantized to 3 bits, and ideal SQNR by bit depth'); })()},
   {cap:"The acquisition chain. The anti-aliasing low-pass must act before sampling; after the ADC, an alias is just another number. Bit depth sets the quantization floor, the sample-and-hold sets the timing.",
    svg:flow([{t:'sensor\nanalog x(t)'},{t:'anti-alias\nlow-pass',stroke:AM},{t:'sample\nand hold',stroke:CY},{t:'ADC\nN bits',stroke:CY},{t:'numbers\nx[n] in memory'}],{perRow:5,bw:92,gap:18,label:'Sensor, anti-aliasing filter, sample and hold, ADC, samples'})}
  ];

  /* ================= MODULE 2: the frequency domain ================= */
  I.p52m2=[
   {cap:"A square wave is a sum of odd harmonics with amplitudes 1/k. The fundamental alone is a sine; three terms already look square; adding terms to the 25th sharpens the edges, but the Gibbs ripple near each jump stays at about 9%.",
    svg:(function(){ const X=t=>30+t*240, Y=v=>110-v*68; const sq=(t,kmax)=>{ let v=0; for(let k=1;k<=kmax;k+=2) v+=Math.sin(2*Math.PI*k*t)/k; return 4/Math.PI*v; };
      let s=line(30,110,390,110,{stroke:DIM});
      s+=pl(curve(t=>sq(t,1),0,1.5,240,X,Y),{c:DIM,dash:true,w:1.3})+pl(curve(t=>sq(t,5),0,1.5,300,X,Y),{c:AM,w:1.6})+pl(curve(t=>sq(t,25),0,1.5,900,X,Y),{c:CY,w:1.8});
      s+=lg(405,36,DIM,'fundamental only',{dash:true})+lg(405,60,AM,'1st + 3rd + 5th')+lg(405,84,CY,'odd terms to 25th');
      s+=text(405,124,'(4/π)·Σ sin(kωt)/k',{anchor:'start',size:10})+text(405,141,'k = 1, 3, 5, …',{anchor:'start',size:10,color:DIM});
      s+=text(405,176,'Gibbs ripple ≈ 9%',{anchor:'start',size:10,color:MG});
      return svg(560,220,s,'Building a square wave from odd harmonics'); })()},
   {cap:"Spectral leakage, computed: a 64-point DFT of a tone at 10.5 cycles per record. Without a window the energy spills across every bin with side lobes only about 13 dB down; a Hann window widens the peak slightly but drops the skirts far below −40 dB.",
    svg:(function(){ const N=64, f0=10.5; const spec=(win)=>{ const out=[]; for(let k=0;k<32;k++){ let re=0,im=0; for(let n=0;n<N;n++){ const w=win?0.5-0.5*Math.cos(2*Math.PI*n/N):1; const x=Math.cos(2*Math.PI*f0*n/N)*w; re+=x*Math.cos(2*Math.PI*k*n/N); im-=x*Math.sin(2*Math.PI*k*n/N); } out.push(Math.hypot(re,im)); } const m=Math.max(...out); return out.map(v=>Math.max(-80,20*Math.log10(v/m+1e-12))); };
      const Yd=db=>46+(-db)/80*124;
      const panel=(ox,win,c)=>{ let s=line(ox+15,170,ox+245,170,{stroke:DIM});
        spec(win).forEach((db,k)=>{ s+=rect(ox+18+k*7.2,Yd(db),5,170-Yd(db),c,0.85); });
        return s+line(ox+15,Yd(-40),ox+245,Yd(-40),{stroke:'currentColor',dash:true})+rect(ox+196,Yd(-40)-16,48,14,'var(--bg)',0.9)+text(ox+242,Yd(-40)-9,'−40 dB',{anchor:'end',size:9}); };
      return compare({t:'NO WINDOW',draw:x=>panel(x,false,CY)+text(x+130,190,'skirts everywhere, −13 dB lobes',{size:10,color:DIM})},
                     {t:'HANN WINDOW',draw:x=>panel(x,true,MG)+text(x+130,190,'wider peak, skirts suppressed',{size:10,color:DIM})},{h:210,label:'DFT of a non-integer-cycle tone with and without a Hann window'}); })()},
   {cap:"DFT arithmetic for the most common audio setup. Bin spacing is fs/N, which equals one over the record length: resolution is bought with recording time, and the FFT makes the computation 341 times cheaper than a direct DFT.",
    svg:stack([{t:'fs = 48 kHz,  N = 4,096',stroke:CY,side:'the inputs'},{t:'record = N / fs = 85.3 ms',side:'resolution costs time'},{t:'Δf = fs / N = 11.72 Hz',stroke:AM,side:'bin spacing'},{t:'rfft keeps N/2 + 1 = 2,049 bins',side:'real signals mirror'},{t:'FFT 49 k ops vs DFT 16.8 M',stroke:LM,side:'341× less work'}],{w:300,side:true,label:'DFT bin spacing and FFT cost at 48 kilohertz'})},
   {cap:"Reading a spectrum: a 1 kHz test tone, mains hum at 60, 180 and 300 Hz about 47 dB below it, a low-frequency hump from air handling, and the noise floor. Read the floor first, then the lines, then anything the physics does not explain.",
    svg:(function(){ const lf=Math.log10(20000)-1; const X=f=>55+(Math.log10(f)-1)/lf*480, Y=db=>20+(-db)/130*180;
      const floor=f=>-121+30*Math.exp(-Math.pow((Math.log10(f)-1)/0.3,2))+1.6*Math.sin(Math.log10(f)*61)+1.1*Math.sin(Math.log10(f)*137);
      let s=line(55,200,535,200,{stroke:DIM})+line(55,20,55,200,{stroke:DIM});
      [[10,'10 Hz'],[100,'100'],[1000,'1 k'],[10000,'10 k']].forEach(([f,t])=>{ s+=line(X(f),200,X(f),204,{stroke:DIM})+text(X(f),213,t,{size:9,color:DIM}); });
      [[0,'0'],[-60,'−60'],[-120,'−120']].forEach(([d,t])=>{ s+=text(50,Y(d),t,{anchor:'end',size:9,color:DIM}); });
      const pts=[]; for(let i=0;i<=260;i++){ const f=Math.pow(10,1+lf*i/260); pts.push([X(f),Y(floor(f))]); } s+=pl(pts,{c:DIM,w:1.2});
      [[60,-55],[180,-61],[300,-66]].forEach(([f,d])=>{ s+=line(X(f),Y(floor(f)),X(f),Y(d),{stroke:MG,sw:2}); });
      s+=line(X(1000),Y(floor(1000)),X(1000),Y(-8),{stroke:CY,sw:2.4});
      s+=text(X(1000)+8,Y(-8)+2,'1 kHz tone, −8 dBFS',{anchor:'start',size:10,color:CY});
      s+=text(222,80,'mains hum: 60 · 180 · 300 Hz',{size:10,color:MG});
      s+=text(62,130,'air, handling',{anchor:'start',size:9,color:DIM});
      s+=text(530,174,'noise floor',{anchor:'end',size:10,color:DIM});
      s+=text(30,9,'dBFS',{size:9,color:DIM});
      return svg(560,222,s,'An annotated audio spectrum with a test tone, mains hum and a noise floor'); })()}
  ];

  /* ================= MODULE 3: digital filters ================= */
  I.p52m3=[
   {cap:"Convolution by hand: flip h, slide it along x, multiply the overlapping samples and add. Two-point averaging of [1, 2, 3] gives [0.5, 1.5, 2.5, 1.5] — length 3 + 2 − 1 = 4.",
    svg:(function(){ const cx=p=>150+p*56; let s=text(20,30,'x[k]',{anchor:'start',bold:true,size:11});
      [1,2,3].forEach((v,p)=>{ s+=box(cx(p)-23,17,46,26,String(v),{size:12,bold:true}); });
      const outs=['y[0] = 0.5·1 = 0.5','y[1] = 0.5·1 + 0.5·2 = 1.5','y[2] = 0.5·2 + 0.5·3 = 2.5','y[3] = 0.5·3 = 1.5'];
      for(let n=0;n<4;n++){ const y=56+n*38; s+=text(20,y+13,'n = '+n,{anchor:'start',size:11,color:DIM});
        [n-1,n].forEach(p=>{ s+=box(cx(p)-23,y,46,26,'0.5',{stroke:CY,size:11,color:CY}); });
        s+=text(358,y+13,outs[n],{anchor:'start',size:11,mono:true}); }
      s+=text(280,218,'flip h, slide, multiply overlaps, add',{size:11,color:AM});
      return svg(560,230,s,'Step-by-step convolution of a three-sample input with a two-point average'); })()},
   {cap:"The two filter families as signal-flow diagrams. An FIR filter only taps delayed inputs, so it is always stable; an IIR filter feeds its own output back, getting sharp responses from few coefficients at the price of a pole that must stay inside the unit circle.",
    svg:compare({t:'FIR: FEED-FORWARD',draw:ox=>text(ox+22,62,'x[n]',{size:11})+arrow(ox+40,62,ox+68,62,'')+box(ox+70,48,40,28,'z⁻¹',{size:11})+arrow(ox+110,62,ox+148,62,'')+box(ox+150,48,40,28,'z⁻¹',{size:11})+line(ox+190,62,ox+225,62)+
        [[ox+54,'b0'],[ox+130,'b1'],[ox+225,'b2']].map(([xt,b])=>line(xt,62,xt,92)+box(xt-16,92,32,22,b,{size:10,stroke:CY})+arrow(xt,114,xt,143,'')).join('')+
        box(ox+35,145,205,26,'Σ  →  y[n]',{stroke:CY,size:11})+text(ox+130,190,'always stable · linear phase',{size:10,color:DIM})},
      {t:'IIR: WITH FEEDBACK',draw:ox=>text(ox+22,80,'x[n]',{size:11})+arrow(ox+40,80,ox+78,80,'')+box(ox+80,66,36,28,'Σ',{stroke:MG,size:12})+arrow(ox+116,80,ox+200,80,'')+text(ox+226,80,'y[n]',{size:11})+
        line(ox+180,80,ox+180,128)+box(ox+160,128,40,26,'z⁻¹',{size:11})+arrow(ox+160,141,ox+130,141,'')+box(ox+76,128,52,26,'× 0.9',{size:10,stroke:MG})+arrow(ox+98,128,ox+98,96,'')+
        text(ox+130,190,'pole at 0.9 must stay inside',{size:10,color:DIM})},{h:210,label:'FIR and IIR filter structures'})},
   {cap:"Butterworth low-pass magnitude responses: all are flat in the passband and −3 dB at the cutoff, and each order adds 20 dB per decade of roll-off. A 4th-order design is 80 dB down one decade above the cutoff — and delays the signal more.",
    svg:(function(){ const X=f=>50+(Math.log10(f)+1)/2*330, Y=db=>25+(-db)/80*170; let s=line(50,195,380,195,{stroke:DIM})+line(50,25,50,195,{stroke:DIM});
      s+=line(50,Y(-3),380,Y(-3),{stroke:DIM,dash:true})+line(X(1),25,X(1),195,{stroke:DIM,dash:true});
      [[0.1,'0.1 fc'],[1,'fc'],[10,'10 fc']].forEach(([f,t])=>{ s+=text(X(f),207,t,{size:9,color:DIM}); });
      [[0,'0 dB'],[-40,'−40'],[-80,'−80']].forEach(([d,t])=>{ s+=text(45,Y(d),t,{anchor:'end',size:9,color:DIM}); });
      [[1,DIM],[2,AM],[4,CY]].forEach(([n,c])=>{ const pts=[]; for(let i=0;i<=200;i++){ const f=Math.pow(10,-1+2*i/200); pts.push([X(f),Y(Math.max(-80,-10*Math.log10(1+Math.pow(f,2*n))))]); } s+=pl(pts,{c,w:2}); });
      s+=lg(392,60,DIM,'1st: −20 dB/decade')+lg(392,84,AM,'2nd: −40 dB/decade')+lg(392,108,CY,'4th: −80 dB/decade');
      s+=text(392,146,'−3 dB at the cutoff',{anchor:'start',size:10,color:DIM})+text(392,164,'flat, ripple-free passband',{anchor:'start',size:10,color:DIM});
      return svg(560,215,s,'Butterworth magnitude responses of order 1, 2 and 4'); })()},
   {cap:"The z-plane is a map of a digital filter. The unit circle is the frequency axis from DC (z = 1) to the Nyquist frequency (z = −1); poles inside the circle are stable, a pole outside grows forever, and zeros on the circle carve perfect nulls such as a notch.",
    svg:(function(){ const cx=150, cy=115, R=85; let s=line(50,cy,262,cy,{stroke:DIM})+line(cx,20,cx,210,{stroke:DIM})+ring(cx,cy,R,'currentColor',1.6);
      s+=cross(cx+0.9*R,cy,CY,6)+ring(cx,cy,5,CY,1.8);
      const a=40*Math.PI/180; s+=cross(cx+1.12*R*Math.cos(a),cy-1.12*R*Math.sin(a),AM,6);
      const b=60*Math.PI/180; s+=ring(cx+R*Math.cos(b),cy-R*Math.sin(b),5,MG,2)+ring(cx+R*Math.cos(b),cy+R*Math.sin(b),5,MG,2);
      s+=text(cx+R+4,cy+14,'z = 1: DC',{anchor:'start',size:9,color:DIM})+text(cx-R+3,cy+14,'z = −1: Nyquist',{anchor:'start',size:9,color:DIM});
      s+=text(300,34,'unit circle = frequency axis',{anchor:'start',size:11,bold:true,color:CY})+text(300,56,'angle Ω = 2πf/fs, from 0 to π',{anchor:'start',size:10});
      s+=cross(308,88,CY,5)+text(322,88,'pole at 0.9: EMA, stable',{anchor:'start',size:10});
      s+=cross(308,113,AM,5)+text(322,113,'pole outside: grows forever',{anchor:'start',size:10});
      s+=ring(308,138,5,MG,2)+text(322,138,'zeros on circle: a notch',{anchor:'start',size:10});
      s+=ring(308,163,5,CY,1.8)+text(322,163,'EMA zero at the origin',{anchor:'start',size:10});
      s+=text(300,196,'stable ⇔ every pole inside',{anchor:'start',size:11,bold:true,color:LM});
      return svg(560,225,s,'Poles and zeros on the z-plane relative to the unit circle'); })()}
  ];

  /* ================= MODULE 4: control fundamentals ================= */
  I.p52m4=[
   {cap:"The standard feedback loop. The controller acts on the error between reference and measurement; disturbances push on the plant; the sensor closes the loop and brings its own noise. With L = CG, the closed loop is T = CG/(1 + CG).",
    svg:(function(){ let s=text(18,70,'r',{bold:true})+arrow(26,70,54,70,'')+ring(68,70,12)+text(68,70,'Σ',{size:11})+text(50,57,'+',{size:10})+text(56,92,'−',{size:12});
      s+=arrow(80,70,118,70,'e')+box(120,50,90,40,'controller\nC(s)',{stroke:CY,size:11})+arrow(210,70,244,70,'u')+ring(258,70,12)+text(258,70,'Σ',{size:11});
      s+=text(258,16,'d: disturbance',{size:10,color:AM})+arrow(258,26,258,56,'');
      s+=arrow(270,70,298,70,'')+box(300,50,90,40,'plant\nG(s)',{stroke:MG,size:11})+arrow(390,70,520,70,'')+text(536,70,'y',{bold:true});
      s+=line(470,70,470,150)+arrow(470,150,392,150,'')+box(300,130,90,40,'sensor\nH(s)',{size:11})+line(300,150,68,150)+arrow(68,150,68,84,'');
      s+=text(345,188,'adds noise n',{size:9,color:AM})+text(184,140,'measured y fed back',{size:10,color:DIM})+text(165,112,'T = CG / (1 + CG)',{size:11,bold:true,color:CY});
      return svg(560,200,s,'Closed-loop block diagram with controller, plant, sensor and disturbance'); })()},
   {cap:"The first-order step response y = K(1 − e^(−t/τ)): 63.2% of the final value at one time constant, 95% at three, 98.2% at four. It never overshoots; identifying K and τ from a step test takes five minutes.",
    svg:(function(){ const X=t=>50+t/5*440, Y=v=>190-v*150; let s=line(50,190,500,190,{stroke:DIM})+line(50,30,50,190,{stroke:DIM})+line(50,40,500,40,{stroke:DIM,dash:true})+text(506,40,'K',{anchor:'start',size:11});
      s+=pl(curve(t=>1-Math.exp(-t),0,5,200,X,Y),{c:CY,w:2.2});
      [[1,0.632,'63.2% at τ'],[3,0.950,'95% at 3τ']].forEach(([t,v,lab])=>{ s+=line(X(t),190,X(t),Y(v),{stroke:AM,dash:true})+line(50,Y(v),X(t),Y(v),{stroke:AM,dash:true})+dot(X(t),Y(v),3.5,AM)+text(X(t)+8,Y(v)+14,lab,{anchor:'start',size:10,color:AM}); });
      ['τ','2τ','3τ','4τ','5τ'].forEach((l,i)=>{ s+=text(X(i+1),203,l,{size:10,color:DIM}); }); s+=text(50,203,'0',{size:10,color:DIM});
      s+=text(330,130,'rise 10–90% = 2.2τ',{anchor:'start',size:10})+text(330,150,'settle within 2% ≈ 4τ',{anchor:'start',size:10})+text(330,170,'no overshoot, ever',{anchor:'start',size:10,color:DIM});
      return svg(560,212,s,'First-order step response with time-constant markers'); })()},
   {cap:"Second-order step responses at four damping ratios, all with the same natural frequency. Overshoot depends only on ζ: 53% at 0.2, 16% at 0.5, 4.6% at 0.7 and none at critical damping (ζ = 1).",
    svg:(function(){ const X=t=>40+t/12*360, Y=v=>200-v*110; const step=(t,z)=>{ if(z>=1) return 1-Math.exp(-t)*(1+t); const wd=Math.sqrt(1-z*z); return 1-Math.exp(-z*t)*(Math.cos(wd*t)+z/wd*Math.sin(wd*t)); };
      let s=line(40,200,400,200,{stroke:DIM})+line(40,20,40,200,{stroke:DIM})+line(40,Y(1),400,Y(1),{stroke:DIM,dash:true});
      [[0.2,MG,'ζ = 0.2 → 53%'],[0.5,AM,'ζ = 0.5 → 16%'],[0.7,CY,'ζ = 0.7 → 4.6%'],[1,LM,'ζ = 1 → 0%']].forEach(([z,c,lab],i)=>{ s+=pl(curve(t=>step(t,z),0,12,300,X,Y),{c,w:1.9})+lg(412,46+i*26,c,lab); });
      s+=text(412,160,'overshoot depends\non ζ alone',{anchor:'start',size:10,color:DIM});
      s+=text(220,216,'time × ωn',{size:10,color:DIM})+text(34,Y(1),'1',{anchor:'end',size:10,color:DIM});
      return svg(560,228,s,'Second-order step responses for damping ratios 0.2, 0.5, 0.7 and 1'); })()},
   {cap:"Where the poles sit decides the response: real poles in the left half-plane decay smoothly, complex poles there ring and decay, poles on the imaginary axis oscillate forever, and any pole in the right half-plane grows without bound.",
    svg:(function(){ const ox=160, oy=115; let s=rect(20,15,ox-20,200,CY,0.08)+line(20,oy,300,oy,{stroke:DIM})+line(ox,15,ox,215,{stroke:DIM});
      s+=text(90,30,'stable',{size:11,bold:true,color:CY})+text(230,30,'unstable',{size:11,bold:true,color:AM})+text(296,104,'Re',{anchor:'end',size:10,color:DIM})+text(168,206,'Im',{anchor:'start',size:10,color:DIM});
      s+=cross(100,oy,CY)+cross(120,75,MG)+cross(120,155,MG)+cross(ox,58,LM)+cross(ox,172,LM)+cross(232,82,AM)+cross(232,148,AM);
      const sk=(y0,fn,c)=>pl(curve(fn,0,1,80,t=>330+t*70,v=>y0-v*14),{c,w:1.7});
      s+=sk(40,t=>Math.exp(-4*t),CY)+sk(92,t=>Math.exp(-3*t)*Math.cos(18*t),MG)+sk(144,t=>Math.cos(18*t),LM)+sk(198,t=>Math.exp(1.2*t)*Math.cos(18*t)*0.45,AM);
      s+=text(412,34,'real, left half:\nsmooth decay',{anchor:'start',size:10,color:CY,lh:13})+text(412,86,'complex, left half:\nrings and decays',{anchor:'start',size:10,color:MG,lh:13});
      s+=text(412,138,'on the axis:\nsustained ringing',{anchor:'start',size:10,color:LM,lh:13})+text(412,190,'right half:\ngrows forever',{anchor:'start',size:10,color:AM,lh:13});
      return svg(560,225,s,'Pole locations in the s-plane and the responses they produce'); })()}
  ];

  /* ================= MODULE 5: PID control ================= */
  I.p52m5=[
   {cap:"Inside a production PID: P and I act on the error, D acts on the measurement so setpoint steps cause no kick, the sum is clamped to the actuator's limits, and the anti-windup path stops the integrator while the output is saturated.",
    svg:(function(){ let s=text(14,115,'r',{bold:true})+arrow(22,115,42,115,'')+ring(56,115,12)+text(56,115,'Σ',{size:11})+text(40,102,'+',{size:10})+text(46,136,'−',{size:12});
      s+=line(68,115,92,115)+line(92,48,92,115)+arrow(92,48,118,48,'')+arrow(92,115,118,115,'');
      s+=box(120,30,130,36,'P:  Kp · e',{stroke:CY,size:11})+box(120,97,130,36,'I:  Ki · ∫ e dt',{stroke:AM,size:11})+box(120,150,130,36,'D:  −Kd · dy/dt',{stroke:MG,size:11});
      s+=arrow(250,48,280,105,'')+arrow(250,115,276,115,'')+arrow(250,168,280,125,'')+ring(290,115,12)+text(290,115,'Σ',{size:11});
      s+=arrow(302,115,330,115,'')+box(332,95,70,40,'limit\n0 to 12 V',{stroke:AM,size:10})+arrow(402,115,428,115,'')+box(430,95,80,40,'plant',{size:11})+line(510,115,532,115)+arrow(532,115,546,115,'')+text(552,100,'y',{anchor:'end',bold:true});
      s+=line(530,115,530,212)+line(530,212,56,212)+arrow(56,212,56,128,'')+arrow(185,212,185,188,'')+text(194,201,'y',{anchor:'start',size:10,color:DIM});
      s+=path('M367 95 L367 84 L238 84 L238 95',AM,{dash:true,arrow:true})+text(374,80,'anti-windup',{anchor:'start',size:10,color:AM});
      return svg(560,225,s,'PID controller structure with saturation and anti-windup'); })()},
   {cap:"P-only versus PI on the same motor. Proportional control alone settles 20% short of the 2,000 rpm setpoint (Kp·K = 4, so the error is 1/5); adding the integral removes the offset completely. Idealized, without actuator limits.",
    svg:(function(){ const X=t=>50+t/0.25*420, Y=v=>190-v*140; let s=line(50,190,480,190,{stroke:DIM})+line(50,30,50,190,{stroke:DIM})+line(50,Y(1),480,Y(1),{stroke:DIM,dash:true});
      s+=pl(curve(t=>0.8*(1-Math.exp(-t/0.024)),0,0.25,200,X,Y),{c:AM,w:2.2})+pl(curve(t=>1-Math.exp(-t/0.03),0,0.25,200,X,Y),{c:CY,w:2.2});
      s+=text(476,40,'setpoint 2,000 rpm',{anchor:'end',size:10,color:DIM})+text(476,64,'PI: integral removes the offset',{anchor:'end',size:10,color:CY})+text(476,93,'P only: 1,600 rpm, 20% short',{anchor:'end',size:10,color:AM});
      s+=line(500,Y(0.8),500,Y(1),{stroke:MG,sw:2})+line(494,Y(0.8),506,Y(0.8),{stroke:MG})+line(494,Y(1),506,Y(1),{stroke:MG})+text(512,Y(0.9),'error',{anchor:'start',size:9,color:MG});
      [[0,'0'],[0.1,'0.1 s'],[0.2,'0.2 s']].forEach(([t,l])=>{ s+=text(X(t),203,l,{size:10,color:DIM}); });
      return svg(560,212,s,'Proportional versus proportional-integral step responses'); })()},
   {cap:"Integral windup, simulated: a 0 → 5,000 rpm step on a 12 V motor drive. With the anti-windup line removed, the integrator charges while the drive is pinned at 12 V and the speed overshoots; with conditional integration the same loop arrives with no overshoot.",
    svg:(function(){ const sim=aw=>{ const Kp=500,tau=0.12,T=0.005,kp=0.008,ki=kp/0.12,umax=12,r=5000,a=Math.exp(-T/tau); let y=0,i=0; const Y=[],U=[]; for(let k=0;k<200;k++){ const e=r-y, uu=kp*e+i, u=Math.min(Math.max(uu,-umax),umax); if(!aw||u===uu||(uu>umax&&e<0)||(uu<-umax&&e>0)) i+=ki*e*T; y=a*y+(1-a)*Kp*u; Y.push(y); U.push(u);} return {Y,U}; };
      const A=sim(true), B=sim(false); const X=k=>45+k/200*470, Yy=v=>140-v/6000*115, Yu=u=>226-(Math.max(u,8)-8)/4.5*44;
      const os=((Math.max(...B.Y)-5000)/50).toFixed(1);
      let s=line(45,140,515,140,{stroke:DIM})+line(45,Yy(5000),515,Yy(5000),{stroke:DIM,dash:true})+line(45,225,515,225,{stroke:DIM});
      s+=pl(B.Y.map((v,k)=>[X(k),Yy(v)]),{c:MG,w:2})+pl(A.Y.map((v,k)=>[X(k),Yy(v)]),{c:CY,w:2});
      s+=pl(B.U.map((u,k)=>[X(k),Yu(u)]),{c:MG,w:1.6})+pl(A.U.map((u,k)=>[X(k),Yu(u)]),{c:CY,w:1.6,dash:true});
      s+=text(515,18,'no anti-windup: '+os+'% overshoot',{anchor:'end',size:10,color:MG})+text(515,102,'with anti-windup: no overshoot',{anchor:'end',size:10,color:CY});
      s+=text(40,Yy(5000),'5,000',{anchor:'end',size:9,color:DIM})+text(45,168,'drive voltage u, 8 to 12.5 V',{anchor:'start',size:9,color:DIM})+text(515,176,'pinned at 12 V',{anchor:'end',size:9,color:MG});
      [[0,'0'],[100,'0.5 s'],[200,'1.0 s']].forEach(([k,l])=>{ s+=text(X(k),152,l,{size:9,color:DIM}); });
      return svg(560,234,s,'Simulated speed and drive voltage with and without anti-windup'); })()},
   {cap:"The Ziegler–Nichols ultimate-gain procedure in four moves. The rules aim for quarter-amplitude decay, which is aggressive, so the last step — detuning and testing with both setpoint and disturbance steps — is not optional.",
    svg:flow([{t:'turn I and D off\nraise Kp\nuntil it rings'},{t:'steady ringing\nread Ku\nand period Tu',stroke:AM},{t:'Kp = 0.6 Ku\nTi = Tu/2\nTd = Tu/8',stroke:CY},{t:'detune 10–20%\ntest setpoint\nand load steps',stroke:LM}],{perRow:4,bw:116,bh:64,gap:24,label:'Ziegler-Nichols tuning procedure'})}
  ];

  /* ================= MODULE 6: robotics fundamentals ================= */
  I.p52m6=[
   {cap:"One lidar point through three frames. The obstacle is 1.0 m ahead of the laser; the laser is 0.2 m ahead of base_link; the robot is at (2, 1) facing 90°. Two transforms later the obstacle is at (2.0, 2.2) in the world.",
    svg:(function(){ let s=arrow(50,215,130,215,'')+text(136,215,'x',{anchor:'start',size:10})+arrow(50,215,50,140,'')+text(50,132,'y',{size:10})+text(56,229,'world (map)',{anchor:'start',size:9,color:DIM});
      s+=ring(210,135,18,CY,1.8)+arrow(210,135,210,92,'',{stroke:CY,sw:2})+arrow(210,135,172,135,'',{stroke:MG,sw:1.6})+text(216,100,'x_base',{anchor:'start',size:9,color:CY})+text(170,124,'y_base',{anchor:'end',size:9,color:MG});
      s+=box(204,113,12,12,'',{stroke:AM,rx:2})+line(216,113,216,52,{stroke:AM,dash:true})+text(204,78,'1.0 m in laser frame',{anchor:'end',size:9,color:AM});
      s+=rect(201,30,20,20,AM,0.35)+box(201,30,20,20,'',{stroke:AM,rx:2})+text(228,40,'obstacle',{anchor:'start',size:10,color:AM})+text(195,166,'robot at (2, 1), 90°',{anchor:'end',size:9});
      s+=box(300,18,250,32,'laser frame: (1.0, 0)',{stroke:AM,size:11})+arrow(425,50,425,66,'')+box(300,68,250,32,'base_link: (1.2, 0)',{size:11})+arrow(425,100,425,116,'')+box(300,118,250,32,'rotate 90°: (0, 1.2)',{size:11})+arrow(425,150,425,166,'')+box(300,168,250,32,'add (2, 1): world (2.0, 2.2)',{stroke:CY,size:11,bold:true});
      s+=text(425,222,'T_world_laser = T_world_base · T_base_laser',{size:9,mono:true});
      return svg(560,236,s,'Transforming a lidar point from the laser frame to the world frame'); })()},
   {cap:"The two-link arm of the lecture: L1 = 0.30 m, L2 = 0.20 m, θ1 = 30°, θ2 = 45° puts the hand at (0.312, 0.343). The dashed arm is the second inverse-kinematics solution — elbow up — reaching the same point.",
    svg:(function(){ const bx=110, by=200, sc=400, d=Math.PI/180; const P=(x,y)=>[bx+x*sc,by-y*sc];
      const e1=P(0.3*Math.cos(30*d),0.3*Math.sin(30*d)), h=P(0.3*Math.cos(30*d)+0.2*Math.cos(75*d),0.3*Math.sin(30*d)+0.2*Math.sin(75*d));
      const t1b=(Math.atan2(0.3432,0.3116)+Math.atan2(0.2*Math.sin(45*d),0.3+0.2*Math.cos(45*d)))/d; const e2=P(0.3*Math.cos(t1b*d),0.3*Math.sin(t1b*d));
      let s=line(70,by,170,by,{sw:2})+line(bx,by,e2[0],e2[1],{stroke:DIM,sw:2,dash:true})+line(e2[0],e2[1],h[0],h[1],{stroke:DIM,sw:2,dash:true});
      s+=line(bx,by,e1[0],e1[1],{stroke:CY,sw:4})+line(e1[0],e1[1],h[0],h[1],{stroke:CY,sw:4});
      const ext=[e1[0]+50*Math.cos(30*d),e1[1]-50*Math.sin(30*d)]; s+=line(e1[0],e1[1],ext[0],ext[1],{stroke:DIM,dash:true});
      s+=path('M'+f1(bx+40)+' '+by+' A40 40 0 0 0 '+f1(bx+40*Math.cos(30*d))+' '+f1(by-40*Math.sin(30*d)),AM,{w:1.6});
      s+=path('M'+f1(e1[0]+30*Math.cos(30*d))+' '+f1(e1[1]-30*Math.sin(30*d))+' A30 30 0 0 0 '+f1(e1[0]+30*Math.cos(75*d))+' '+f1(e1[1]-30*Math.sin(75*d)),AM,{w:1.6});
      s+=dot(bx,by,5)+dot(e1[0],e1[1],5)+dot(h[0],h[1],5.5,MG)+dot(e2[0],e2[1],4,DIM);
      s+=text(158,190,'θ1 = 30°',{anchor:'start',size:10,color:AM})+text(262,122,'θ2 = 45°',{anchor:'start',size:10,color:AM})+text(200,176,'L1 = 0.30 m',{anchor:'start',size:10})+text(240,90,'L2 = 0.20 m',{anchor:'start',size:10});
      s+=text(228,44,'hand (0.312, 0.343)',{anchor:'end',size:10,color:MG})+text(150,74,'elbow-up solution',{anchor:'end',size:9,color:DIM});
      ['FK:','x = L1 cos θ1 + L2 cos(θ1+θ2)','y = L1 sin θ1 + L2 sin(θ1+θ2)','IK:','cos θ2 = (r² − L1² − L2²) / (2 L1 L2)','θ2 = ±45°: two solutions','reach: 0.10 m ≤ r ≤ 0.50 m'].forEach((t,i)=>{ s+=text(338,34+i*24,t,{anchor:'start',size:10,bold:t.length<5,color:t.length<5?CY:'currentColor'}); });
      return svg(560,222,s,'Two-link planar arm geometry with both inverse kinematics solutions'); })()},
   {cap:"The Kalman update as Gaussians: a prior of 10.0 ± 2.0 m and a measurement of 12.0 ± 1.0 m combine into a posterior of 11.6 ± 0.89 m — closer to the more certain source, and narrower than either.",
    svg:(function(){ const X=x=>40+(x-4)/12*480, Y=p=>190-p*330; const g=(m,sd)=>x=>Math.exp(-0.5*Math.pow((x-m)/sd,2))/(sd*Math.sqrt(2*Math.PI));
      let s=line(40,190,520,190,{stroke:DIM}); [6,8,10,12,14].forEach(x=>{ s+=line(X(x),190,X(x),194,{stroke:DIM})+text(X(x),203,x+' m',{size:9,color:DIM}); });
      s+=pl(curve(g(10,2),4,16,240,X,Y),{c:DIM,w:1.8})+pl(curve(g(12,1),4,16,240,X,Y),{c:AM,w:1.8})+pl(curve(g(11.6,Math.sqrt(0.8)),4,16,240,X,Y),{c:CY,w:2.6});
      s+=text(165,124,'prior 10.0 ± 2.0',{size:10,color:DIM})+text(450,72,'measurement 12.0 ± 1.0',{size:10,color:AM})+text(240,34,'posterior 11.6 ± 0.89',{size:10,bold:true,color:CY});
      s+=text(280,218,'K = 4 / (4 + 1) = 0.8   ·   x = 10 + 0.8 × (12 − 10)',{size:10});
      return svg(560,228,s,'Prior, measurement and posterior Gaussians in a one-dimensional Kalman update'); })()},
   {cap:"The Kalman filter's two-beat rhythm. Prediction moves the estimate with the motion model and grows its uncertainty by Q; each measurement shrinks it again, weighted by the gain. Between measurements the uncertainty breathes like a sawtooth.",
    svg:cycle([{t:'predict\nx⁻ = F x + B u'},{t:'P grows\nP⁻ = FPFᵀ + Q',stroke:AM},{t:'measure z\nvariance R'},{t:'gain\nK = P⁻/(P⁻+R)',stroke:MG},{t:'update x, P\nP shrinks',stroke:LM}],{label:'Kalman filter predict and update cycle'})}
  ];

  /* ================= MODULE 7: autonomy software ================= */
  I.p52m7=[
   {cap:"A small ROS 2 graph. Drivers publish sensor topics, localization fuses them and publishes the map → odom transform, Nav2 turns goals into velocity commands, and a watchdog sits between the planner and the motors so silence means stop.",
    svg:(function(){ let s=box(10,20,110,34,'lidar driver',{size:11})+box(10,95,110,34,'wheel odometry',{size:11})+box(10,170,110,34,'IMU driver',{size:11});
      s+=box(205,70,120,46,'localization\nEKF · AMCL',{stroke:CY,size:11})+box(205,162,120,40,'map server\nor SLAM',{stroke:DIM,size:11});
      s+=box(410,20,140,46,'Nav2\nplanner + controller',{stroke:AM,size:11})+box(410,105,140,34,'safety watchdog',{stroke:LM,size:11})+box(410,172,140,46,'motor driver\nros2_control',{stroke:MG,size:11});
      s+=arrow(120,40,203,82,'/scan')+arrow(120,112,203,95,'/odom')+arrow(120,187,203,108,'/imu')+arrow(265,162,265,118,'/map')+arrow(325,88,408,50,'/tf');
      s+=arrow(120,28,408,30,'scan → costmap',{stroke:DIM})+arrow(480,66,480,103,'/cmd_vel',{dy:0.01})+arrow(480,139,480,170,'safe cmd',{dy:0.01});
      s+=text(280,228,'boxes are nodes · arrows are topics',{size:9,color:DIM});
      return svg(560,236,s,'ROS 2 node graph for a mobile robot'); })()},
   {cap:"The autonomy pipeline runs at three speeds. Perception builds the world model, planning chooses where to go, control makes the motors obey — each layer faster than the one above it, the cascade principle of Module 5.",
    svg:flow([{t:'sensors\nlidar · IMU'},{t:'perception\n10–30 Hz',stroke:CY},{t:'planning\n1–20 Hz',stroke:AM},{t:'control\n50–1,000 Hz',stroke:MG},{t:'actuators\nmotors'}],{perRow:5,bw:92,gap:18,label:'Perception, planning and control pipeline with typical rates'})},
   {cap:"A* on a small occupancy grid, computed when this page loads: shaded cells are the ones A* expanded with the octile heuristic, the line is the shortest 8-connected path through the gap (no cutting wall corners), and the counts compare it with Dijkstra on the same grid.",
    svg:(function(){ const C=16, R=9, cs=22, x0=12, y0=14; const wall=(r,c)=>c===8&&r<=6; const S=[4,1], G=[4,14];
      const hO=(a,b)=>{ const dr=Math.abs(a[0]-b[0]), dc=Math.abs(a[1]-b[1]); return Math.max(dr,dc)+(Math.SQRT2-1)*Math.min(dr,dc); };
      const search=hf=>{ const g={}, par={}, closed=new Set(); const k=p=>p[0]+','+p[1]; g[k(S)]=0; let open=[[hf(S),S]];
        while(open.length){ open.sort((a,b)=>a[0]-b[0]); const [f,n]=open.shift(); const kn=k(n); if(closed.has(kn)) continue; closed.add(kn); if(kn===k(G)) break;
          for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){ if(!dr&&!dc) continue; const m=[n[0]+dr,n[1]+dc]; if(m[0]<0||m[0]>=R||m[1]<0||m[1]>=C||wall(m[0],m[1])) continue; if(dr&&dc&&(wall(n[0]+dr,n[1])||wall(n[0],n[1]+dc))) continue;
            const ng=g[kn]+(dr&&dc?Math.SQRT2:1); const km=k(m); if(g[km]===undefined||ng<g[km]-1e-9){ g[km]=ng; par[km]=n; open.push([ng+hf(m),m]); } } }
        const pathPts=[]; let cur=G; while(cur){ pathPts.push(cur); cur=par[cur[0]+','+cur[1]]; } return {closed,pathPts:pathPts.reverse(),len:g[k(G)]}; };
      const A=search(p=>hO(p,G)), D=search(()=>0); let free=0, s='';
      for(let r=0;r<R;r++) for(let c=0;c<C;c++){ const x=x0+c*cs, y=y0+r*cs; if(wall(r,c)) s+=rect(x,y,cs,cs,'currentColor',0.55); else { free++; if(A.closed.has(r+','+c)) s+=rect(x,y,cs,cs,CY,0.2); } }
      for(let c=0;c<=C;c++) s+=line(x0+c*cs,y0,x0+c*cs,y0+R*cs,{stroke:DIM,sw:0.5}); for(let r=0;r<=R;r++) s+=line(x0,y0+r*cs,x0+C*cs,y0+r*cs,{stroke:DIM,sw:0.5});
      s+=pl(A.pathPts.map(p=>[x0+p[1]*cs+cs/2,y0+p[0]*cs+cs/2]),{c:MG,w:3});
      s+=text(x0+S[1]*cs+cs/2,y0+S[0]*cs+cs/2,'S',{bold:true,size:12,color:LM})+text(x0+G[1]*cs+cs/2,y0+G[0]*cs+cs/2,'G',{bold:true,size:12,color:LM});
      s+=rect(380,22,18,14,CY,0.3)+text(406,29,'expanded by A*',{anchor:'start',size:10})+rect(380,46,18,14,'currentColor',0.55)+text(406,53,'wall (inflated)',{anchor:'start',size:10})+lg(378,77,MG,'shortest path');
      s+=text(380,108,'f(n) = g(n) + h(n)',{anchor:'start',size:11,bold:true,color:CY})+text(380,128,'h = octile distance',{anchor:'start',size:10});
      s+=text(380,152,'A*: '+A.closed.size+' cells expanded',{anchor:'start',size:10,color:CY})+text(380,170,'Dijkstra: '+D.closed.size+' cells',{anchor:'start',size:10,color:DIM})+text(380,188,'free cells: '+free,{anchor:'start',size:10,color:DIM})+text(380,206,'path: '+A.len.toFixed(1)+' cell widths',{anchor:'start',size:10,color:DIM});
      return svg(560,226,s,'A star search on an occupancy grid with a wall and a gap'); })()},
   {cap:"The tf tree of a mobile robot. Localization owns map → odom (which may jump when it corrects), odometry owns odom → base_link (smooth but drifting), and the sensor mounts are static transforms from the robot description.",
    svg:(function(){ let s=box(30,20,120,34,'map',{stroke:CY,bold:true})+arrow(150,37,218,37,'')+text(184,24,'AMCL / SLAM',{size:9,color:DIM});
      s+=box(220,20,120,34,'odom',{stroke:AM,bold:true})+arrow(340,37,408,37,'')+text(374,24,'odometry',{size:9,color:DIM})+box(410,20,130,34,'base_link',{stroke:MG,bold:true});
      [[290,'laser'],[385,'camera'],[470,'imu']].forEach(([x,t])=>{ s+=line(475,54,x+40,130)+box(x,130,80,30,t,{size:11}); });
      s+=text(420,178,'static transforms from the URDF',{size:9,color:DIM});
      s+=text(30,92,'map → odom: may jump',{anchor:'start',size:10,color:CY})+text(30,112,'odom → base_link: drifts',{anchor:'start',size:10,color:AM})+text(30,132,'look up any pair at time t',{anchor:'start',size:10});
      s+=text(150,198,'ros2 run tf2_ros tf2_echo map base_link',{size:9,mono:true})+text(150,214,'ros2 run tf2_tools view_frames',{size:9,mono:true});
      return svg(560,226,s,'Transform tree from map to odom to base_link to sensors'); })()},
   {cap:"Robot safety in layers, most fundamental first. Software limits are the last and weakest layer; the hardwired stop that cuts motor power, and the risk assessment that decided it was needed, come first.",
    svg:stack([{t:'Risk assessment first',stroke:CY,bold:true,side:'design out the hazard'},{t:'Hardwired e-stop cuts power',stroke:MG,side:'hardware, not code'},{t:'Safety-rated speed and force limits',stroke:AM,side:'drive or safety PLC'},{t:'Watchdog: silence means stop',stroke:LM,side:'firmware, 0.5 s'},{t:'Software limits and geofences',stroke:DIM,side:'ROS 2 nodes'}],{w:330,side:true,label:'Layers of robot safety from risk assessment to software limits'})}
  ];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
