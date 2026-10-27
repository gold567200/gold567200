/* Illustrations — Domain 48: Mathematics Foundations, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  // local helpers on top of the kit (colors only via kit tokens or currentColor)
  const f1=v=>(+v).toFixed(1);
  const poly=(pts,o={})=>'<polyline points="'+pts.map(p=>f1(p[0])+','+f1(p[1])).join(' ')+'" fill="'+(o.fill||'none')+'"'+(o.op!=null?' fill-opacity="'+o.op+'"':'')+' stroke="'+(o.stroke||'currentColor')+'" stroke-width="'+(o.sw==null?1.6:o.sw)+'"'+(o.dash?' stroke-dasharray="5 4"':'')+' stroke-linejoin="round"/>';
  const shade=(x,y,w,h,c,op)=>'<rect x="'+f1(x)+'" y="'+f1(y)+'" width="'+f1(Math.max(0,w))+'" height="'+f1(Math.max(0,h))+'" rx="2" fill="'+c+'" fill-opacity="'+(op==null?0.25:op)+'" stroke="none"/>';
  const dot=(x,y,c,r)=>'<circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="'+(r||4)+'" fill="'+(c||CY)+'"/>';
  const rect=(x,y,w,h,c,o={})=>'<rect x="'+f1(x)+'" y="'+f1(y)+'" width="'+f1(Math.max(0,w))+'" height="'+f1(Math.max(0,h))+'" rx="'+(o.rx==null?2:o.rx)+'" fill="none" stroke="'+c+'" stroke-width="'+(o.sw||1.3)+'"'+(o.dash?' stroke-dasharray="5 4"':'')+'/>';
  const circ=(x,y,r,c,o={})=>'<circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="'+f1(r)+'" fill="none" stroke="'+(c||'currentColor')+'" stroke-width="'+(o.sw||1.3)+'"'+(o.dash?' stroke-dasharray="5 4"':'')+'/>';
  const area=(pts,c,op)=>'<polygon points="'+pts.map(p=>f1(p[0])+','+f1(p[1])).join(' ')+'" fill="'+c+'" fill-opacity="'+(op==null?0.25:op)+'" stroke="none"/>';
  const path=(d,o={})=>'<path d="'+d+'" fill="'+(o.fill||'none')+'" stroke="'+(o.stroke||'currentColor')+'" stroke-width="'+(o.sw||1.3)+'"'+(o.dash?' stroke-dasharray="5 4"':'')+'/>';
  // sample y = f(x) on [a, b] into screen points, stopping where it leaves [ylo, yhi]
  const curve=(f,a,b,X,Y,ylo,yhi,n)=>{ const pts=[]; n=n||160; for(let i=0;i<=n;i++){ const x=a+(b-a)*i/n, y=f(x); if(!isFinite(y)) continue; if(ylo!=null&&(y<ylo||y>yhi)){ if(pts.length) break; else continue; } pts.push([X(x),Y(y)]); } return pts; };
  const axes=(x0,y0,x1,y1,xl,yl)=>arrow(x0,y0,x1,y0,'')+arrow(x0,y0,x0,y1,'')+(xl?text(x1-2,y0+14,xl,{size:10,color:DIM,anchor:'end'}):'')+(yl?text(x0+6,y1+4,yl,{size:10,color:DIM,anchor:'start'}):'');

  /* ================= MODULE 1: number fluency ================= */
  I.p48m1=[{cap:"Same name, different size. SI prefixes count in powers of ten, binary prefixes in powers of two, and the gap between them grows with every step: 2.4% at kilo, 10% at tera. That is the whole reason a 1 TB drive shows as 931 GB in Windows (really 931 GiB). No bytes are missing.",
    svg:svg(560,236,(()=>{
      let s=text(280,16,'decimal (SI) vs binary (IEC) prefixes',{bold:true,color:CY});
      const rows=[['kB vs KiB',1.024,'+2.4%'],['MB vs MiB',1.048576,'+4.9%'],['GB vs GiB',1.073741824,'+7.4%'],['TB vs TiB',1.099511628,'+10.0%']];
      const x0=110, W=340;
      rows.forEach(([lab,r,pct],i)=>{ const y=36+i*46;
        s+=text(10,y+15,lab,{anchor:'start',size:11,bold:true});
        s+=shade(x0,y,W,14,CY,0.3)+rect(x0,y,W,14,CY);
        s+=shade(x0,y+18,W*r,14,AM,0.3)+rect(x0,y+18,W*r,14,AM);
        s+=shade(x0+W,y+18,W*(r-1),14,MG,0.6);
        s+=text(x0+W*r+6,y+25,pct,{anchor:'start',size:11,color:MG,bold:true}); });
      s+=text(x0+4,224,'cyan: 10³ⁿ bytes   amber: 2¹⁰ⁿ bytes',{anchor:'start',size:10,color:DIM});
      s+=text(550,224,'1 TB = 931 GiB',{anchor:'end',size:11,color:LM,bold:true});
      return s; })(),'Paired bars comparing SI and binary prefix sizes with the growing percentage gap')},
   {cap:"Dimensional analysis as a pipeline: each arrow multiplies by a conversion factor equal to 1, and the units cancel until only minutes remain. 50 GB at 300 Mb/s is about 22 minutes at full line rate. If the units do not cancel, the formula is wrong before you check a digit.",
    svg:flow([{t:'50 GB',stroke:CY,bold:true},{t:'400 Gb',edge:'× 8 b/B'},{t:'400,000 Mb',edge:'× 1,000'},{t:'1,333 s',edge:'÷ 300 Mb/s'},{t:'≈ 22.2 min',edge:'÷ 60 s/min',stroke:LM,bold:true}],{perRow:3,bw:110,gap:84,label:'Unit conversion chain from gigabytes to minutes'})},
   {cap:"Orders of magnitude on one log-scale ruler: each tick is a factor of 1,000. A text message, a photo, a 4K frame, a movie, a day of four security cameras and a 2 TB drive sit 2 to 12 powers of ten above a single byte. Estimating means landing in the right decade first.",
    svg:svg(560,200,(()=>{
      const X=e=>30+e*33.3; let s=text(280,16,'bytes on a log scale (each tick ×1,000)',{bold:true,color:CY});
      s+=arrow(24,110,548,110,'',{sw:1.6});
      [['1 B',0],['1 kB',3],['1 MB',6],['1 GB',9],['1 TB',12],['1 PB',15]].forEach(([t,e])=>{ s+=line(X(e),104,X(e),116)+text(X(e),130,t,{size:10,color:DIM,anchor:e===15?'end':(e===0?'start':'middle')}); });
      const up=[['text msg ~100 B',2],['photo ~3 MB',6.48],['movie ~5 GB',9.7],['2 TB drive',12.3]];
      const dn=[['4K frame 25 MB',7.4],['4 cams/day 173 GB',11.24]];
      up.forEach(([t,e],i)=>{ const y=i%2?52:72; s+=line(X(e),106,X(e),y+6,{stroke:AM,dash:true})+dot(X(e),110,AM,3.5)+text(X(e),y,t,{size:10,color:AM,anchor:i===0?'start':'middle'}); });
      dn.forEach(([t,e])=>{ s+=line(X(e),114,X(e),150,{stroke:MG,dash:true})+dot(X(e),110,MG,3.5)+text(X(e),160,t,{size:10,color:MG}); });
      s+=text(280,190,'round to 1 significant figure, track the powers of ten',{size:10,color:LM});
      return s; })(),'Logarithmic ruler of data sizes with everyday landmarks')}];

  /* ================= MODULE 2: algebra ================= */
  I.p48m2=[{cap:"An equation is a balance: whatever you do to one pan you do to the other, and it stays level. Solving 3x + 7 = 25 is two fair moves, subtract 7 from both sides, then divide both sides by 3, followed by the check that catches sign errors.",
    svg:svg(560,214,(()=>{
      let s=text(280,16,'do the same thing to both sides',{bold:true,color:CY});
      s+=line(110,58,450,58,{sw:2})+path('M280 58 L262 92 L298 92 Z')+line(240,92,320,92);
      s+=line(150,58,150,70)+line(410,58,410,70);
      s+=box(95,70,110,30,'3x + 7',{stroke:CY,mono:true})+box(355,70,110,30,'25',{stroke:CY,mono:true});
      const steps=['3x + 7 = 25','3x = 18','x = 6'];
      steps.forEach((t,i)=>{ const x=20+i*190; s+=box(x,124,140,34,t,{mono:true,stroke:i===2?LM:'currentColor',color:i===2?LM:'currentColor',bold:i===2}); });
      s+=arrow(162,141,208,141,'')+text(185,172,'−7 both sides',{size:10,color:AM});
      s+=arrow(352,141,398,141,'')+text(375,172,'÷3 both sides',{size:10,color:AM});
      s+=text(280,200,'check: 3(6) + 7 = 25  ✓',{size:12,color:LM,bold:true});
      return s; })(),'A balance scale over the two steps that solve 3x + 7 = 25')},
   {cap:"Ohm's law as a triangle: cover the quantity you want and the other two show the formula, V = IR, I = V/R, R = V/I. Right: the LED resistor from the lecture, where the resistor takes the 3 V the LED does not, so R = 3 V ÷ 0.020 A = 150 Ω and P = I²R = 0.06 W.",
    svg:compare({t:'OHM\'S LAW TRIANGLE',draw:x=>{ let s=path('M'+(x+130)+' 40 L'+(x+40)+' 140 L'+(x+220)+' 140 Z',{stroke:CY,sw:1.6})+line(x+76,100,x+184,100,{stroke:CY})+line(x+130,100,x+130,140,{stroke:CY});
        s+=text(x+130,78,'V',{size:16,bold:true,color:CY})+text(x+100,121,'I',{size:15,bold:true})+text(x+160,121,'R',{size:15,bold:true});
        s+=text(x+130,156,'V = IR · I = V/R · R = V/I',{size:10,color:DIM}); return s; }},
      {t:'LED RESISTOR',draw:x=>{ let s=box(x+14,50,74,30,'5 V supply',{stroke:AM,size:11})+box(x+96,50,74,30,'R = 150 Ω',{stroke:CY,size:11})+box(x+178,50,70,30,'LED 2 V',{stroke:MG,size:11});
        s+=arrow(x+88,65,x+95,65,'')+arrow(x+170,65,x+177,65,'');
        s+=text(x+130,100,'resistor drop: 5 − 2 = 3 V',{size:10})+text(x+130,118,'R = 3 V ÷ 0.020 A = 150 Ω',{size:10,color:CY})+text(x+130,136,'P = 0.020² × 150 = 0.06 W',{size:10,color:LM})+text(x+130,154,'5 V bench only, never mains',{size:9,color:MG}); return s; }},{h:180,label:'Ohm\'s law triangle and an LED resistor calculation'})},
   {cap:"A system of two equations is two lines, and the solution is where they cross. Plan A costs $20 + $0.05/GB and Plan B $5 + $0.20/GB; they meet at 100 GB and $25. Below 100 GB Plan B is cheaper, above it Plan A. Parallel lines would mean no solution.",
    svg:svg(560,226,(()=>{
      const X=g=>60+g*2.3, Y=c=>190-c*3.55;
      let s=text(280,16,'substitution: 20 + 0.05g = 5 + 0.20g → g = 100',{bold:true,color:CY,size:12});
      s+=shade(X(0),Y(45),X(100)-X(0),Y(0)-Y(45),MG,0.08)+shade(X(100),Y(45),X(200)-X(100),Y(0)-Y(45),CY,0.08);
      s+=axes(60,190,535,32,'GB per month','$ per month');
      [0,50,100,150].forEach(g=>{ s+=line(X(g),190,X(g),194)+text(X(g),206,String(g),{size:9,color:DIM}); });
      [0,10,20,30,40].forEach(c=>{ s+=line(56,Y(c),60,Y(c))+text(52,Y(c),'$'+c,{size:9,color:DIM,anchor:'end'}); });
      s+=line(X(0),Y(20),X(200),Y(30),{stroke:CY,sw:2})+line(X(0),Y(5),X(200),Y(45),{stroke:MG,sw:2});
      s+=text(X(200)-4,Y(30)+14,'A: $20 + $0.05/GB',{size:10,color:CY,anchor:'end'});
      s+=text(X(150)-8,Y(37)-8,'B: $5 + $0.20/GB',{size:10,color:MG,anchor:'end'});
      s+=line(X(100),Y(25),X(100),190,{stroke:LM,dash:true})+dot(X(100),Y(25),LM,5)+text(X(100)+8,Y(25)+16,'(100 GB, $25)',{size:11,color:LM,anchor:'start',bold:true});
      s+=text(X(50),Y(42),'B cheaper',{size:10,color:MG})+text(X(160),Y(8),'A cheaper',{size:10,color:CY});
      return s; })(),'Two cost lines crossing at 100 GB and 25 dollars')},
   {cap:"The discriminant b² − 4ac predicts the roots before you compute them: positive means the parabola crosses the axis twice, zero means it just touches once, negative means it never reaches the real axis (two complex roots).",
    svg:svg(560,180,(()=>{
      let s=text(280,16,'what b² − 4ac tells you',{bold:true,color:CY});
      const P=[['> 0: two roots',-1,CY],['= 0: one root',0,AM],['< 0: no real roots',1,MG]];
      P.forEach(([t,c,col],i)=>{ const ox=20+i*180, cx=ox+80, X=x=>cx+x*34, Y=y=>120-y*22;
        s+=line(ox,120,ox+160,120,{stroke:DIM})+line(cx,40,cx,150,{stroke:DIM,dash:true});
        s+=poly(curve(x=>x*x+c,-2.2,2.2,X,Y,-3,3.6),{stroke:col,sw:2});
        if(c<0){ s+=dot(X(-1),120,col,4)+dot(X(1),120,col,4); } if(c===0) s+=dot(cx,120,col,4);
        s+=text(cx,168,t,{size:11,color:col,bold:true}); });
      return s; })(),'Three parabolas showing two, one and zero real roots')}];

  /* ================= MODULE 3: functions and graphs ================= */
  I.p48m3=[{cap:"Growth rates on the same axes: log₂ n barely moves, n and n log₂ n stay tame, n² curves up, and 2ⁿ leaves the chart before n = 7. Big-O (Domain 13) is the study of which of these shapes an algorithm follows, because for large n the shape matters far more than the constant.",
    svg:svg(560,232,(()=>{
      const X=n=>60+n*21, Y=v=>200-v*1.68;
      let s=text(280,16,'operations against input size n',{bold:true,color:CY});
      s+=axes(60,200,535,26,'n','ops');
      [0,5,10,15,20].forEach(n=>{ s+=line(X(n),200,X(n),204)+text(X(n),215,String(n),{size:9,color:DIM}); });
      [0,25,50,75,100].forEach(v=>{ s+=line(56,Y(v),60,Y(v))+text(52,Y(v),String(v),{size:9,color:DIM,anchor:'end'}); });
      const F=[['2ⁿ',n=>Math.pow(2,n),MG],['n²',n=>n*n,AM],['n log₂ n',n=>n*Math.log2(Math.max(n,1)),CY],['n',n=>n,LM],['log₂ n',n=>Math.log2(Math.max(n,1)),'currentColor']];
      F.forEach(([t,f,c])=>{ const pts=curve(f,1,20,X,Y,0,100,200); s+=poly(pts,{stroke:c,sw:2}); });
      s+=text(X(6.64)+8,40,'2ⁿ',{size:11,color:MG,anchor:'start',bold:true});
      s+=text(X(10)+8,40,'n²',{size:11,color:AM,anchor:'start',bold:true});
      s+=text(X(20)+4,Y(86),'n log n',{size:10,color:CY,anchor:'start',bold:true});
      s+=text(X(20)+4,Y(20)-2,'n',{size:10,color:LM,anchor:'start',bold:true});
      s+=text(X(20)+4,186,'log n',{size:10,anchor:'start',bold:true});
      return s; })(),'Plot of log n, n, n log n, n squared and 2 to the n')},
   {cap:"A logarithm is the inverse of an exponential, so their graphs are mirror images across the line y = x: the point (2, 4) on y = 2ˣ reflects to (4, 2) on y = log₂ x. Every log law is an exponent law seen in this mirror.",
    svg:svg(560,240,(()=>{
      const X=x=>110+x*34, Y=y=>170-y*34;
      let s=text(280,16,'y = 2ˣ and y = log₂ x mirror across y = x',{bold:true,color:CY,size:12});
      s+=arrow(X(-2.5),Y(0),X(4.6),Y(0),'')+arrow(X(0),Y(-1.6),X(0),Y(4.3),'');
      [1,2,3,4].forEach(v=>{ s+=line(X(v),Y(0)-3,X(v),Y(0)+3)+text(X(v),Y(0)+14,String(v),{size:9,color:DIM}); s+=line(X(0)-3,Y(v),X(0)+3,Y(v))+text(X(0)-8,Y(v),String(v),{size:9,color:DIM,anchor:'end'}); });
      s+=line(X(-1.5),Y(-1.5),X(4.3),Y(4.3),{stroke:DIM,dash:true});
      s+=poly(curve(x=>Math.pow(2,x),-2.5,2.1,X,Y,-2,4.3),{stroke:CY,sw:2})+poly(curve(x=>Math.log2(x),0.33,4.5,X,Y,-1.6,4.3),{stroke:MG,sw:2});
      s+=dot(X(2),Y(4),CY,4.5)+dot(X(4),Y(2),MG,4.5)+line(X(2),Y(4),X(4),Y(2),{stroke:AM,dash:true});
      s+=text(X(2)-8,Y(4),'(2, 4)',{size:10,color:CY,anchor:'end'})+text(X(4)+4,Y(2)+16,'(4, 2)',{size:10,color:MG});
      s+=text(X(-2.4),Y(1.2),'y = 2ˣ',{size:11,color:CY,anchor:'start',bold:true})+text(X(3.6),Y(0.55),'y = log₂ x',{size:11,color:MG,bold:true});
      s+=text(262,32,'y = x',{size:10,color:DIM,anchor:'start'});
      const L=['2³ = 8  ⇔  log₂ 8 = 3','log(ab) = log a + log b','log(aⁿ) = n·log a','log_b x = ln x ÷ ln b','log₂ 10⁶ ≈ 20 halvings'];
      L.forEach((t,i)=>{ s+=text(330,70+i*26,t,{size:12,anchor:'start',color:i===4?LM:'currentColor',mono:i<4}); });
      return s; })(),'Exponential and logarithm curves reflected across y equals x, with log laws')},
   {cap:"A PON loss budget in decibels: multiplied losses become added dB. A 0 dBm laser, 20 km of fiber at 0.35 dB/km, four connectors and a 1:32 splitter (15 dB ideal, about 17 dB real) leave about −26 dBm at the ONT, 2 dB above a −28 dBm receiver. Never look into a live fiber; read it with a power meter.",
    svg:svg(560,214,(()=>{
      const Xd=d=>520+d*15.6;
      let s=text(280,16,'decibels add: 7 + 2 + 17 = 26 dB',{bold:true,color:CY});
      s+=line(Xd(-30),112,Xd(0),112,{stroke:DIM});
      [0,-10,-20,-30].forEach(d=>{ s+=line(Xd(d),108,Xd(d),116,{stroke:DIM})+text(Xd(d),128,d+' dBm',{size:9,color:DIM,anchor:d===0?'end':(d===-30?'start':'middle')}); });
      const segs=[['fiber 7 dB',7,CY],['conn 2',2,AM],['1:32 splitter 17 dB',17,MG]];
      let p=0; segs.forEach(([t,l,c])=>{ const x1=Xd(-(p+l)), x2=Xd(-p); s+=shade(x1,64,x2-x1,32,c,0.35)+rect(x1,64,x2-x1,32,c,{sw:1.2}); if(l>3) s+=text((x1+x2)/2,80,t,{size:10,color:c,bold:true}); p+=l; });
      s+=text(Xd(-8),56,'conn 2 dB',{size:9,color:AM});
      s+=text(Xd(0),48,'TX 0 dBm',{size:10,color:CY,anchor:'end'});
      s+=line(Xd(-28),40,Xd(-28),104,{stroke:LM,dash:true})+text(Xd(-28)-2,34,'RX sens. −28 dBm',{size:10,color:LM,anchor:'start'});
      s+=line(Xd(-28),150,Xd(-26),150,{stroke:LM,sw:2})+text(Xd(-26)+6,150,'margin 2 dB at −26 dBm',{size:11,color:LM,anchor:'start',bold:true});
      s+=text(280,178,'×2 power = +3 dB · ×10 = +10 dB · ÷32 ≈ −15 dB',{size:11,color:DIM});
      s+=text(280,200,'laser safety: never look into a live fiber',{size:10,color:MG});
      return s; })(),'Fiber loss budget bars on a dBm scale with receiver margin')}];

  /* ================= MODULE 4: trigonometry and vectors ================= */
  I.p48m4=[{cap:"The unit circle defines sine and cosine for every angle: walk an angle θ counterclockwise from (1, 0) and you arrive at (cos θ, sin θ). The horizontal leg is cos θ, the vertical leg sin θ, and Pythagoras on that triangle is the identity sin²θ + cos²θ = 1.",
    svg:svg(560,240,(()=>{
      const cx=150, cy=125, R=95, th=40*Math.PI/180, px=cx+R*Math.cos(th), py=cy-R*Math.sin(th);
      let s=text(280,16,'the unit circle: P = (cos θ, sin θ)',{bold:true,color:CY});
      s+=line(cx-R-18,cy,cx+R+18,cy,{stroke:DIM})+line(cx,cy-R-14,cx,cy+R+10,{stroke:DIM})+circ(cx,cy,R,'currentColor');
      s+=line(cx,cy,px,py,{sw:1.8})+line(cx,cy,px,cy,{stroke:CY,sw:2.4})+line(px,cy,px,py,{stroke:MG,sw:2.4});
      s+=path('M'+(cx+28)+' '+cy+' A28 28 0 0 0 '+f1(cx+28*Math.cos(th))+' '+f1(cy-28*Math.sin(th)),{stroke:AM,sw:1.6})+text(cx+40,cy-12,'θ',{size:12,color:AM,bold:true});
      s+=dot(px,py,LM,5)+text(px+8,py-8,'P',{size:12,color:LM,anchor:'start',bold:true});
      s+=text((cx+px)/2,cy+14,'cos θ',{size:11,color:CY,bold:true})+text(px+6,(cy+py)/2,'sin θ',{size:11,color:MG,anchor:'start',bold:true});
      s+=text(cx+R+4,cy+14,'(1, 0)',{size:9,color:DIM,anchor:'start'})+text(cx+4,cy-R-6,'(0, 1)',{size:9,color:DIM,anchor:'start'});
      const L=[['θ = 40° = 0.698 rad','currentColor'],['cos 40° = 0.766',CY],['sin 40° = 0.643',MG],['0.766² + 0.643² = 1',LM],['2π rad = 360°','currentColor'],['math.sin wants radians',AM]];
      L.forEach(([t,c],i)=>{ s+=text(330,60+i*28,t,{size:12,anchor:'start',color:c}); });
      return s; })(),'Unit circle with angle theta and the cosine and sine legs')},
   {cap:"A sine wave is the height of a point going round a circle, plotted against time. Amplitude A is the circle's radius, one trip around is one period T = 1/f, and a radio wave's length is λ = c/f: 12.5 cm for 2.4 GHz Wi-Fi.",
    svg:svg(560,220,(()=>{
      const cx=75, cy=110, R=50, X0=150, P=300, th=60*Math.PI/180, px=cx+R*Math.cos(th), py=cy-R*Math.sin(th);
      let s=text(280,16,'circle → wave: y = A sin(2πft)',{bold:true,color:CY});
      s+=circ(cx,cy,R,'currentColor')+line(cx-R-8,cy,cx+R+8,cy,{stroke:DIM})+line(cx,cy,px,py)+dot(px,py,MG,4.5);
      s+=line(X0,cy,X0+P*1.3,cy,{stroke:DIM});
      const wx=t=>X0+t*P; s+=poly(curve(t=>Math.sin(2*Math.PI*t),0,1.3,wx,y=>cy-R*y,null,null,200),{stroke:MG,sw:2});
      const tw=th/(2*Math.PI); s+=line(px,py,wx(tw),py,{stroke:AM,dash:true})+dot(wx(tw),py,MG,4.5);
      s+=line(wx(0.25),cy,wx(0.25),cy-R,{stroke:CY})+text(wx(0.25)+6,cy-R/2,'A',{size:12,color:CY,anchor:'start',bold:true});
      s+=line(wx(0),cy+R+18,wx(1),cy+R+18,{stroke:LM})+line(wx(0),cy+R+12,wx(0),cy+R+24,{stroke:LM})+line(wx(1),cy+R+12,wx(1),cy+R+24,{stroke:LM})+text(wx(0.5),cy+R+32,'one period T = 1/f',{size:11,color:LM});
      s+=text(cx,cy+R+32,'one turn = 2π',{size:10,color:DIM});
      s+=text(wx(0.75),cy-R-6,'λ = c / f',{size:11,color:AM,bold:true})+text(wx(0.75),cy-R+10,'2.4 GHz: 12.5 cm',{size:10,color:AM});
      return s; })(),'A point on a circle projected into a sine wave with amplitude and period marked')},
   {cap:"The dot product measures alignment. For a = (3, 4) and b = (4, 3), a · b = 24 and both lengths are 5, so cos θ = 24/25 and θ ≈ 16.3°. Rotate a by 90° to c = (−4, 3) and a · c = 0: perpendicular. Cosine similarity in vector search is exactly this cos θ.",
    svg:svg(560,232,(()=>{
      const O=[170,200], U=30, P=(x,y)=>[O[0]+x*U,O[1]-y*U];
      let s=text(280,16,'a · b = |a||b| cos θ',{bold:true,color:CY});
      s+=line(30,O[1],330,O[1],{stroke:DIM})+line(O[0],O[1]+8,O[0],40,{stroke:DIM});
      const a=P(3,4), b=P(4,3), c=P(-4,3);
      s+=arrow(O[0],O[1],a[0],a[1],'',{stroke:CY,sw:2.2})+arrow(O[0],O[1],b[0],b[1],'',{stroke:MG,sw:2.2})+arrow(O[0],O[1],c[0],c[1],'',{stroke:AM,sw:1.8,dash:true});
      s+=text(a[0]-4,a[1]-8,'a = (3, 4)',{size:11,color:CY,bold:true,anchor:'end'})+text(b[0]+6,b[1],'b = (4, 3)',{size:11,color:MG,bold:true,anchor:'start'})+text(c[0]-2,c[1]-10,'c = (−4, 3)',{size:10,color:AM});
      s+=path('M'+f1(O[0]+46*0.6)+' '+f1(O[1]-46*0.8)+' A46 46 0 0 1 '+f1(O[0]+46*0.8)+' '+f1(O[1]-46*0.6),{stroke:LM,sw:1.6})+text(O[0]+58,O[1]-58,'θ',{size:12,color:LM,bold:true});
      const L=[['a · b = 3·4 + 4·3 = 24','currentColor'],['|a| = |b| = √(9 + 16) = 5','currentColor'],['cos θ = 24 / 25 = 0.96',LM],['θ ≈ 16.3°: nearly aligned',LM],['a · c = −12 + 12 = 0',AM],['zero means perpendicular',AM]];
      L.forEach(([t,c],i)=>{ s+=text(362,50+i*26,t,{size:12,anchor:'start',color:c}); });
      return s; })(),'Two nearly aligned vectors and one perpendicular vector with dot product arithmetic')},
   {cap:"Rotation by θ moves (x, y) to (x cos θ − y sin θ, x sin θ + y cos θ). Rotating (2, 0) by 60° lands on (1, 1.732); the length stays 2. Written as a 2 × 2 matrix, this is the first transformation of Domain 14's linear algebra and every frame of Domain 40's graphics.",
    svg:svg(560,220,(()=>{
      const O=[120,185], U=60, P=(x,y)=>[O[0]+x*U,O[1]-y*U];
      let s=text(280,16,'rotate (2, 0) by 60° → (1, 1.732)',{bold:true,color:CY});
      s+=line(40,O[1],270,O[1],{stroke:DIM})+line(O[0],O[1]+10,O[0],34,{stroke:DIM});
      s+=path('M'+(O[0]+2*U)+' '+O[1]+' A'+(2*U)+' '+(2*U)+' 0 0 0 '+O[0]+' '+(O[1]-2*U),{stroke:DIM,dash:true});
      const p=P(2,0), q=P(1,Math.sqrt(3));
      s+=arrow(O[0],O[1],p[0]-2,p[1],'',{stroke:CY,sw:2.2})+arrow(O[0],O[1],q[0],q[1]+2,'',{stroke:MG,sw:2.2});
      s+=dot(p[0],p[1],CY,4)+dot(q[0],q[1],MG,4);
      s+=text(p[0]-4,p[1]+16,'(2, 0)',{size:11,color:CY})+text(q[0]+8,q[1]-4,'(1, 1.732)',{size:11,color:MG,anchor:'start'});
      s+=path('M'+(O[0]+40)+' '+O[1]+' A40 40 0 0 0 '+f1(O[0]+20)+' '+f1(O[1]-34.6),{stroke:AM,sw:1.6})+text(O[0]+48,O[1]-26,'60°',{size:11,color:AM,anchor:'start'});
      s+=box(300,48,240,30,'x′ = x cos θ − y sin θ',{mono:true,stroke:CY,size:11})+box(300,86,240,30,'y′ = x sin θ + y cos θ',{mono:true,stroke:CY,size:11});
      s+=text(420,138,'x′ = 2(0.5) − 0 = 1',{size:11,mono:true})+text(420,158,'y′ = 2(0.866) + 0 = 1.732',{size:11,mono:true});
      s+=text(420,186,'length still 2: rotation',{size:10,color:LM})+text(420,202,'preserves distances',{size:10,color:LM});
      return s; })(),'A vector rotated by sixty degrees with the rotation formulas')}];

  /* ================= MODULE 5: derivatives ================= */
  I.p48m5=[{cap:"From secant to tangent on f(x) = x² at x = 1: as h shrinks from 1.5 to 1 to 0.5, the secant slopes 3.5, 3, 2.5 close in on the tangent slope 2 = 2x. The derivative is the limit of that sequence of average rates.",
    svg:svg(560,232,(()=>{
      const X=x=>60+x*110, Y=y=>205-y*17;
      let s=text(280,16,'secant slopes → tangent slope',{bold:true,color:CY});
      s+=axes(60,205,420,30,'x','f(x)');
      [0,1,2,3].forEach(v=>{ s+=line(X(v),205,X(v),209)+text(X(v),219,String(v),{size:9,color:DIM}); });
      s+=poly(curve(x=>x*x,0,3.15,X,Y,0,10),{sw:2.2});
      const Ls=[[1.5,MG],[1,AM],[0.5,CY]];
      Ls.forEach(([h,c])=>{ const m=2+h, x2=1+h; const xa=1-1/m+0.03, xb=Math.min(3.1,x2+0.35); s+=line(X(xa),Y(1+m*(xa-1)),X(xb),Y(1+m*(xb-1)),{stroke:c,sw:1.4}); s+=dot(X(x2),Y(x2*x2),c,3.5); });
      s+=line(X(0.55),Y(1+2*(0.55-1)),X(2.6),Y(1+2*(2.6-1)),{stroke:LM,sw:2.2,dash:true});
      s+=dot(X(1),Y(1),LM,5)+text(X(1)+8,Y(1)+12,'(1, 1)',{size:10,color:LM,anchor:'start'});
      const L=[['h = 1.5: slope 3.5',MG],['h = 1.0: slope 3.0',AM],['h = 0.5: slope 2.5',CY],['h → 0: slope 2',LM]];
      L.forEach(([t,c],i)=>{ s+=text(420,56+i*24,t,{size:11,color:c,anchor:'start',bold:i===3}); });
      s+=text(420,166,'[f(1+h) − f(1)] / h',{size:11,anchor:'start',mono:true})+text(420,186,'= 2 + h → 2',{size:11,anchor:'start',mono:true,color:LM});
      return s; })(),'Parabola with three secant lines approaching the tangent at x equals 1')},
   {cap:"The chain rule multiplies rates along a pipeline. Forward, x feeds u = g(x), which feeds y = f(u); backward, the derivative is the product of the local rates, dy/dx = f′(u) · g′(x). Backpropagation in Domain 9 runs this multiplication backwards through every layer of a network.",
    svg:svg(560,200,(()=>{
      let s=text(280,16,'dy/dx = f′(u) · g′(x)',{bold:true,color:CY});
      const B=[[20,'x'],[210,'u = g(x)'],[400,'y = f(u)']];
      B.forEach(([x,t],i)=>{ s+=box(x,46,140,40,t,{mono:true,stroke:i===2?LM:CY,size:13}); });
      s+=arrow(162,66,208,66,'')+arrow(352,66,398,66,'');
      s+=text(185,36,'× g′(x)',{size:11,color:AM,bold:true})+text(375,36,'× f′(u)',{size:11,color:AM,bold:true});
      s+=path('M470 92 C470 130 90 130 90 92',{stroke:MG,sw:1.6,dash:true})+'<line x1="91" y1="98" x2="90" y2="90" stroke="'+MG+'" stroke-width="1.6" marker-end="url(#ah)"/>';
      s+=text(280,140,'backprop: multiply local rates backwards',{size:11,color:MG});
      s+=text(280,166,'sigmoid: σ = (1 + e^(−x))^(−1)',{size:11,mono:true});
      s+=text(280,186,'σ′ = σ(1 − σ)',{size:12,mono:true,color:LM,bold:true});
      return s; })(),'Chain rule as a forward pipeline with a backward product of derivatives')},
   {cap:"The gradient on a contour map of f(x, y) = x² + 3y²: at (2, 1) it is ∇f = (4, 6), pointing straight uphill and perpendicular to the contour line. Gradient descent with η = 0.1 steps along −∇f: the path bends, dropping fast in the steep y direction and then crawling along the shallow x direction.",
    svg:svg(560,232,(()=>{
      const cx=170, cy=125, S=42, P=(x,y)=>[cx+x*S,cy-y*S];
      let s=text(280,16,'∇f is perpendicular to contours',{bold:true,color:CY});
      [0.5,1.2,2.0,2.65,3.3].forEach((k,i)=>{ s+='<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+f1(k*S)+'" ry="'+f1(k*S/Math.sqrt(3))+'" fill="none" stroke="'+(i===3?AM:DIM)+'" stroke-width="'+(i===3?1.6:1.1)+'"/>'; });
      const p=P(2,1); s+=dot(p[0],p[1],AM,5);
      const g=[4,6], n=Math.hypot(4,6), L=46;
      s+=arrow(p[0],p[1],p[0]+L*g[0]/n,p[1]-L*g[1]/n,'',{stroke:MG,sw:2.2})+text(p[0]+L*g[0]/n+4,p[1]-L*g[1]/n-4,'∇f = (4, 6)',{size:11,color:MG,anchor:'start',bold:true});
      const path_=[[2,1],[1.6,0.4],[1.28,0.16],[1.024,0.064],[0.82,0.026],[0.655,0.01]];
      s+=poly(path_.map(q=>P(q[0],q[1])),{stroke:CY,sw:1.8})+path_.slice(1).map(q=>{ const r=P(q[0],q[1]); return dot(r[0],r[1],CY,3); }).join('');
      s+=dot(cx,cy,LM,5)+text(cx,cy+16,'minimum',{size:10,color:LM});
      s+=text(p[0]-10,p[1]-8,'(2, 1)',{size:10,color:AM,anchor:'end'});
      const T=[['f = x² + 3y²','currentColor'],['∂f/∂x = 2x,  ∂f/∂y = 6y','currentColor'],['∇f(2, 1) = (4, 6)',MG],['step: p ← p − η∇f',CY],['η = 0.1 shown in cyan',CY]];
      T.forEach(([t,c],i)=>{ s+=text(355,60+i*28,t,{size:12,anchor:'start',color:c}); });
      return s; })(),'Elliptical contours with a gradient arrow and a descent path to the minimum')}];

  /* ================= MODULE 6: integrals ================= */
  I.p48m6=[{cap:"A Riemann sum turns a rate into an amount by adding rectangles. For r(t) = 2t + 1 MB/s on [0, 4] the left sum is 1 + 3 + 5 + 7 = 16 MB and the right sum 24 MB; the exact integral, 20 MB, lies between them, and thinner slices close the gap.",
    svg:svg(560,232,(()=>{
      const X=t=>60+t*80, Y=r=>205-r*17;
      let s=text(280,16,'left sum 16 ≤ ∫ = 20 ≤ right sum 24',{bold:true,color:CY});
      for(let i=0;i<4;i++){ const hl=2*i+1, hr=2*(i+1)+1; s+=shade(X(i),Y(hl),80,Y(0)-Y(hl),CY,0.3)+rect(X(i),Y(hl),80,Y(0)-Y(hl),CY,{sw:1.2}); s+=rect(X(i),Y(hr),80,Y(0)-Y(hr),AM,{dash:true}); s+=text(X(i)+40,Y(hl)+14,String(hl),{size:11,color:CY,bold:true}); }
      s+=axes(60,205,420,30,'t (s)','MB/s');
      [0,1,2,3,4].forEach(t=>{ s+=line(X(t),205,X(t),209)+text(X(t),219,String(t),{size:9,color:DIM}); });
      s+=line(X(0),Y(1),X(4),Y(9),{stroke:LM,sw:2.2})+text(X(4)-6,Y(9)-10,'r(t) = 2t + 1',{size:11,color:LM,anchor:'end',bold:true});
      const L=[['left: 1+3+5+7 = 16',CY],['right: 3+5+7+9 = 24',AM],['exact: [t² + t]₀⁴ = 20',LM],['thinner slices → exact',DIM]];
      L.forEach(([t,c],i)=>{ s+=text(410,70+i*28,t,{size:11,color:c,anchor:'start',bold:i===2}); });
      return s; })(),'Left and right Riemann rectangles under a straight-line rate')},
   {cap:"The fundamental theorem in one picture: the shaded area under the rate r(t) up to x is the amount A(x), and the slope of A at any x equals the height of r there. Integrating accumulates; differentiating recovers the rate.",
    svg:compare({t:'RATE r(t) = 2t + 1',draw:x=>{ const X=t=>x+30+t*50, Y=r=>150-r*11; let s=line(x+30,150,x+240,150,{stroke:DIM})+line(x+30,150,x+30,40,{stroke:DIM});
        s+=area([[X(0),Y(0)],[X(0),Y(1)],[X(3),Y(7)],[X(3),Y(0)]],CY,0.3)+line(X(0),Y(1),X(4),Y(9),{stroke:CY,sw:2});
        s+=line(X(3),Y(0),X(3),Y(7),{stroke:AM,sw:1.6})+text(X(3)+5,Y(7)+6,'height 7',{size:10,color:AM,anchor:'start'});
        s+=text(X(1.5),Y(1.8),'area = 12',{size:11,color:CY,bold:true})+text(X(3),162,'x = 3',{size:10,color:DIM}); return s; }},
      {t:'AMOUNT A(x) = x² + x',draw:x=>{ const X=t=>x+30+t*50, Y=a=>150-a*5; let s=line(x+30,150,x+240,150,{stroke:DIM})+line(x+30,150,x+30,40,{stroke:DIM});
        s+=poly(curve(t=>t*t+t,0,4,X,Y,0,21),{stroke:MG,sw:2});
        s+=line(X(2.2),Y(12-0.8*7),X(3.8),Y(12+0.8*7),{stroke:AM,sw:1.6,dash:true})+dot(X(3),Y(12),AM,4);
        s+=text(X(3)-6,Y(12)-8,'A(3) = 12',{size:10,color:MG,anchor:'end'})+text(X(3)+8,Y(12)+14,'slope 7',{size:10,color:AM,anchor:'start'}); return s; }},{h:180,label:'Area under a rate curve and the matching accumulation function'})},
   {cap:"Probability is area under a density. Gaps between requests arriving at λ = 5 per second follow f(x) = 5e^(−5x); the whole area is 1, the mean gap is 1/λ = 0.2 s, and the shaded tail beyond 0.5 s, P(X > 0.5) = e^(−2.5) ≈ 0.082, is the chance of a half-second silence.",
    svg:svg(560,224,(()=>{
      const X=x=>60+x*380, Y=y=>190-y*28;
      let s=text(280,16,'exponential density f(x) = λe^(−λx), λ = 5/s',{bold:true,color:CY,size:12});
      const tail=curve(x=>5*Math.exp(-5*x),0.5,1.05,X,Y); s+=area([[X(0.5),Y(0)]].concat(tail,[[X(1.05),Y(0)]]),MG,0.4);
      s+=axes(60,190,520,34,'gap x (s)','density');
      [0,0.2,0.5,1].forEach(v=>{ s+=line(X(v),190,X(v),194)+text(X(v),205,String(v),{size:9,color:DIM}); });
      s+=poly(curve(x=>5*Math.exp(-5*x),0,1.05,X,Y),{stroke:CY,sw:2.2});
      s+=line(X(0.2),190,X(0.2),Y(5*Math.exp(-1)),{stroke:LM,dash:true})+text(X(0.2)+6,Y(2.2),'mean 1/λ = 0.2 s',{size:10,color:LM,anchor:'start'});
      s+=text(X(0.66),Y(0.95),'P(X > 0.5) = e^(−2.5) ≈ 0.082',{size:11,color:MG,anchor:'start',bold:true});
      s+=text(100,52,'f(0) = λ = 5',{size:10,color:CY,anchor:'start'});
      s+=text(400,64,'total area = 1',{size:11,color:DIM});
      return s; })(),'Exponential probability density with the tail beyond half a second shaded')},
   {cap:"The trapezoid rule joins samples with straight lines. On ∫₀¹ x² dx with four slices it gives 0.34375 against the exact 1/3, overestimating because the chords sit above a cup-shaped curve; Simpson's rule fits parabolas and is exact here.",
    svg:svg(560,224,(()=>{
      const X=x=>50+x*260, Y=y=>190-y*150;
      let s=text(280,16,'trapezoid rule on x², n = 4, h = 0.25',{bold:true,color:CY});
      for(let i=0;i<4;i++){ const a=i*0.25, b=a+0.25; s+=area([[X(a),Y(0)],[X(a),Y(a*a)],[X(b),Y(b*b)],[X(b),Y(0)]],AM,0.25)+poly([[X(a),Y(0)],[X(a),Y(a*a)],[X(b),Y(b*b)],[X(b),Y(0)]],{stroke:AM,sw:1.2}); }
      s+=axes(50,190,335,30,'x','');
      [0,0.25,0.5,0.75,1].forEach(v=>{ s+=line(X(v),190,X(v),194)+text(X(v),205,String(v),{size:9,color:DIM}); });
      s+=poly(curve(x=>x*x,0,1.02,X,Y),{stroke:CY,sw:2.2})+text(X(0.62)-8,Y(0.3844)-28,'y = x²',{size:11,color:CY,anchor:'end',bold:true});
      const L=[['T = h[f₀/2 + f₁ + f₂ + f₃ + f₄/2]','currentColor'],['T = 0.34375 (3% high)',AM],['exact ∫ = 1/3 = 0.33333',LM],['Simpson: 0.33333 exact',LM],['error: T ∝ h², S ∝ h⁴',DIM]];
      L.forEach(([t,c],i)=>{ s+=text(332,64+i*28,t,{size:i===0?9.5:11,color:c,anchor:'start',mono:i===0}); });
      return s; })(),'Four trapezoids under a parabola compared with the exact area')}];

  /* ================= MODULE 7: optimization and floating point ================= */
  I.p48m7=[{cap:"Gradient descent on f(x) = (x − 3)² + 1 from x = 0. With η = 0.1 each step shrinks the error by 0.8 and the iterates slide in (0.6, 1.08, 1.46…). With η = 1.0 they bounce between 0 and 6 forever, and with η = 1.1 they overshoot farther each time: 0 → 6.6 → −1.32 → diverges.",
    svg:svg(560,236,(()=>{
      const X=x=>80+x*45, Y=y=>200-y*6.2, f=x=>(x-3)*(x-3)+1;
      let s=text(280,16,'x ← x − η f′(x),  f′(x) = 2(x − 3)',{bold:true,color:CY,size:12});
      s+=line(X(-1.7),200,X(8.2),200,{stroke:DIM});
      [-1,0,6].forEach(v=>{ s+=line(X(v),200,X(v),204)+text(X(v),215,String(v),{size:9,color:DIM}); });
      s+=poly(curve(f,-1.7,7.8,X,Y,0,27),{sw:2});
      let x=0; const xs=[0]; for(let i=0;i<6;i++){ x=x-0.1*2*(x-3); xs.push(x); }
      xs.forEach((v,i)=>{ if(i<3) s+=arrow(X(v),Y(f(v)),X(xs[i+1])-1,Y(f(xs[i+1]))+1,'',{stroke:CY,sw:1.6}); s+=dot(X(v),Y(f(v)),CY,3.5); });
      s+=path('M'+X(0)+' '+Y(f(0))+' Q'+X(3)+' '+(Y(f(0))-26)+' '+X(6)+' '+Y(f(6)),{stroke:AM,sw:1.6,dash:true});
      s+=path('M'+X(0)+' '+Y(f(0))+' Q'+X(3.3)+' '+(Y(f(0))-50)+' '+X(6.6)+' '+Y(f(6.6)),{stroke:MG,sw:1.6,dash:true})+dot(X(6.6),Y(f(6.6)),MG,4);
      s+=dot(X(3),Y(1),LM,5)+text(X(3),Y(1)+14,'min (3, 1)',{size:10,color:LM});
      s+=text(X(0)-6,Y(f(0))+16,'x₀ = 0',{size:10,anchor:'end'});
      s+=text(436,60,'η = 0.1: converges',{size:11,color:CY,anchor:'start',bold:true})+text(436,80,'η = 1.0: oscillates',{size:11,color:AM,anchor:'start',bold:true})+text(436,100,'η = 1.1: diverges',{size:11,color:MG,anchor:'start',bold:true});
      s+=text(436,128,'error × (1 − 2η)',{size:11,anchor:'start',mono:true})+text(436,146,'per step',{size:10,color:DIM,anchor:'start'});
      return s; })(),'Gradient descent iterates on a parabola for three learning rates')},
   {cap:"Newton's method follows the tangent line down to the axis and jumps there. On f(x) = x² − 2 from x₀ = 3 the iterates are 1.833, 1.462, 1.4142: the number of correct digits roughly doubles each step (quadratic convergence), which is why libraries compute square roots this way.",
    svg:svg(560,236,(()=>{
      const X=x=>60+x*110, Y=y=>170-y*15.5, f=x=>x*x-2;
      let s=text(280,16,'xₖ₊₁ = xₖ − f(xₖ) / f′(xₖ)',{bold:true,color:CY});
      s+=line(40,Y(0),440,Y(0),{stroke:DIM})+line(X(0),Y(-2.3),X(0),Y(9.3),{stroke:DIM});
      [0,1,2,3].forEach(v=>{ s+=line(X(v),Y(0)-3,X(v),Y(0)+3)+text(X(v),Y(0)+14,String(v),{size:9,color:DIM}); });
      s+=poly(curve(f,0,3.3,X,Y,-2.3,9.3),{sw:2.2});
      const xs=[3]; for(let i=0;i<3;i++){ const v=xs[xs.length-1]; xs.push(v-f(v)/(2*v)); }
      const cols=[MG,AM,CY];
      for(let i=0;i<3;i++){ const v=xs[i], nv=xs[i+1]; s+=line(X(v),Y(0),X(v),Y(f(v)),{stroke:DIM,dash:true})+line(X(v),Y(f(v)),X(nv),Y(0),{stroke:cols[i],sw:1.8})+dot(X(v),Y(f(v)),cols[i],3.5)+dot(X(nv),Y(0),cols[i],3.5); }
      s+=text(X(3)+6,Y(f(3))+18,'x₀ = 3',{size:10,anchor:'start'});
      s+=text(X(xs[1])+4,Y(0)+26,'1.833',{size:10,color:MG})+text(X(xs[2])-14,Y(0)+40,'1.462',{size:10,color:AM});
      const L=[['x₁ = 1.8333',MG],['x₂ = 1.4621',AM],['x₃ = 1.41422',CY],['√2 = 1.41421…',LM],['digits double','currentColor'],['every step','currentColor']];
      L.forEach(([t,c],i)=>{ s+=text(450,60+i*24,t,{size:11,color:c,anchor:'start',mono:i<4}); });
      return s; })(),'Newton tangent lines stepping toward the square root of two')},
   {cap:"IEEE 754 is scientific notation in base 2. A double stores 1 sign bit, 11 exponent bits (bias 1023) and 52 fraction bits; a single stores 1, 8 (bias 127) and 23. Encoding −6.5 = −1.101₂ × 2² as a single gives sign 1, exponent 129 and fraction 101000…, which is 0xC0D00000.",
    svg:svg(560,230,(()=>{
      let s=text(280,16,'value = (−1)ˢ × 1.f × 2^(e − bias)',{bold:true,color:CY});
      s+=text(10,44,'binary64 (double): 64 bits',{size:11,anchor:'start',bold:true});
      s+=box(10,52,40,30,'s 1',{stroke:MG,size:11})+box(50,52,120,30,'exponent 11',{stroke:AM,size:11})+box(170,52,380,30,'fraction 52 (+ hidden 1 = 53-bit significand)',{stroke:CY,size:11});
      s+=text(10,102,'binary32 (single): 32 bits',{size:11,anchor:'start',bold:true});
      s+=box(10,110,40,30,'s 1',{stroke:MG,size:11})+box(50,110,120,30,'exponent 8',{stroke:AM,size:11})+box(170,110,380,30,'fraction 23',{stroke:CY,size:11});
      s+=text(10,162,'−6.5 as a single:',{size:11,anchor:'start',color:LM,bold:true});
      s+=box(10,170,40,30,'1',{stroke:MG,mono:true,size:12})+box(50,170,120,30,'10000001',{stroke:AM,mono:true,size:12})+box(170,170,250,30,'10100000000000000000000',{stroke:CY,mono:true,size:11});
      s+=text(486,185,'= 0xC0D00000',{size:12,mono:true,color:LM,bold:true});
      s+=text(110,216,'e = 2 + 127 = 129',{size:10,color:AM})+text(295,216,'f = .101 (6.5 = 1.101₂ × 2²)',{size:10,color:CY});
      return s; })(),'Bit layout of IEEE 754 double and single precision with a worked encoding')},
   {cap:"Catastrophic cancellation: subtracting nearly equal numbers keeps only the digits where they differ, so rounding noise becomes the answer. The naive quadratic formula for x² + 10⁸x + 1 = 0 returns −7.45 × 10⁻⁹ (25% wrong); computing the large root first and using x₂ = c/(a·x₁) gives −1.00 × 10⁻⁸.",
    svg:compare({t:'NAIVE: −b + √(b² − 4ac)',draw:x=>{ let s=text(x+130,48,'b = 100000000.0000000',{size:11,mono:true})+text(x+130,66,'√(b² − 4) = 99999999.99999998',{size:10,mono:true});
        s+=line(x+20,76,x+240,76)+text(x+130,90,'difference = 0.0000000149',{size:10,mono:true,color:MG});
        s+=text(x+130,108,'only 1–2 digits survive',{size:10,color:MG})+text(x+130,130,'x₂ ≈ −7.45 × 10⁻⁹',{size:12,color:MG,bold:true})+text(x+130,150,'25% error',{size:11,color:MG}); return s; }},
      {t:'STABLE: x₂ = c / (a·x₁)',draw:x=>{ let s=text(x+130,48,'x₁ = (−b − √(b² − 4ac)) / 2a',{size:10,mono:true})+text(x+130,66,'adds, never cancels',{size:10,color:DIM});
        s+=text(x+130,88,'x₁ ≈ −1.00 × 10⁸',{size:11,mono:true})+text(x+130,108,'x₂ = 1 / (1 × −10⁸)',{size:11,mono:true});
        s+=text(x+130,130,'x₂ ≈ −1.00 × 10⁻⁸',{size:12,color:LM,bold:true})+text(x+130,150,'full precision',{size:11,color:LM}); return s; }},{h:180,label:'Naive and stable quadratic formula results compared'})}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
