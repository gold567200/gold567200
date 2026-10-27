/* Illustrations — Domain 14: Mathematics for Computing, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  // small local helpers on top of the kit (all colors via the kit tokens or currentColor)
  const poly=(pts,o={})=>'<polyline points="'+pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')+'" fill="'+(o.fill||'none')+'"'+(o.op!=null?' fill-opacity="'+o.op+'"':'')+' stroke="'+(o.stroke||'currentColor')+'" stroke-width="'+(o.sw==null?1.6:o.sw)+'"'+(o.dash?' stroke-dasharray="5 4"':'')+' stroke-linejoin="round"/>';
  const shade=(x,y,w,h,c,op)=>'<rect x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" width="'+Math.max(0,w).toFixed(1)+'" height="'+Math.max(0,h).toFixed(1)+'" rx="3" fill="'+c+'" fill-opacity="'+(op==null?0.25:op)+'" stroke="none"/>';
  const dot=(x,y,c,r)=>'<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+(r||4)+'" fill="'+(c||CY)+'"/>';
  const rect=(x,y,w,h,c,o={})=>'<rect x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" width="'+Math.max(0,w).toFixed(1)+'" height="'+Math.max(0,h).toFixed(1)+'" rx="'+(o.rx==null?3:o.rx)+'" fill="none" stroke="'+c+'" stroke-width="'+(o.sw||1.3)+'"'+(o.tr?' transform="'+o.tr+'"':'')+'/>';

  /* ================= DOMAIN 14: Mathematics for Computing ================= */
  I.p14m1=[{cap:"p → q and ¬p ∨ q have identical truth-table columns, so they are logically equivalent — and the single false row (p true, q false) is the only case in which a firewall rule or an exploit chain can break. Right: the same truth as hardware, a NOT feeding an OR.",
    svg:svg(560,230,(()=>{
      const cols=[['p',20,50],['q',75,50],['p → q',130,65],['¬p ∨ q',200,65]];
      const rows=[['T','T','T','T'],['T','F','F','F'],['F','T','T','T'],['F','F','T','T']];
      let s=''; cols.forEach(([h,x,w])=>{ s+=box(x,20,w,26,h,{bold:true,stroke:CY,color:CY,size:12}); });
      rows.forEach((r,i)=>{ const y=52+i*28, bad=i===1; cols.forEach(([h,x,w],j)=>{ s+=box(x,y,w,26,r[j],{stroke:bad?MG:DIM,color:(bad&&j>=2)?MG:'currentColor',bold:bad&&j>=2,size:12}); }); });
      s+=text(142,180,'identical columns ⇒ equivalent',{size:11,color:LM})+text(142,198,'only F row: p = T, q = F',{size:11,color:MG});
      s+=text(430,40,'the same truth as a gate',{size:11,color:CY,bold:true});
      s+=text(318,75,'p',{size:12})+line(326,75,352,75)+'<path d="M352,62 L352,88 L378,75 Z" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="383" cy="75" r="5" fill="none" stroke="currentColor" stroke-width="1.3"/>'+line(388,75,437,75);
      s+=text(318,105,'q',{size:12})+line(326,105,437,105);
      s+='<path d="M430,60 Q452,90 430,120 Q482,120 502,90 Q482,60 430,60 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>';
      s+=line(502,90,532,90)+text(518,76,'p → q',{size:11,color:LM});
      s+=text(365,50,'NOT',{size:9,color:DIM})+text(468,90,'OR',{size:10,color:DIM});
      s+=text(430,150,'¬p ∨ q',{size:12,color:LM,bold:true})+text(430,168,'NOT p, then OR with q',{size:10,color:DIM});
      s+=text(430,198,'gates are connectives (Domain 1)',{size:10,color:DIM});
      return s; })(),'Truth table of implication beside its logic-gate form')},
   {cap:"Induction as dominoes: the base case knocks over P(1); the inductive step P(n) → P(n + 1) guarantees that each domino topples the next; together they fell every one of infinitely many dominoes without touching each individually.",
    svg:svg(560,200,(()=>{
      const xs=[30,100,170,240,310,380,450,515], ang=[72,42,14,0,0,0,0,0];
      let s=text(280,18,'induction: the dominoes argument',{bold:true,color:CY});
      xs.forEach((x,i)=>{ const a=ang[i], fallen=a>0, lbl=i<7?'P('+(i+1)+')':'P(n)';
        if(fallen) s+='<rect x="'+x+'" y="80" width="18" height="60" rx="3" fill="'+CY+'" fill-opacity="0.25" stroke="'+CY+'" stroke-width="1.4" transform="rotate('+a+' '+(x+18)+' 140)"/>';
        else s+=rect(x,80,18,60,i===7?AM:'currentColor',{sw:1.4});
        s+=text(x+9,158,lbl,{size:10,color:fallen?CY:(i===7?AM:DIM)}); });
      s+=text(492,110,'⋯',{size:14,color:DIM});
      s+=arrow(332,62,376,62,'',{stroke:AM,sw:1.6})+text(354,46,'P(n) → P(n+1)',{size:11,color:AM});
      s+=text(39,176,'base case',{size:10,color:LM});
      s+=text(280,192,'base case + step ⇒ all fall',{size:11,color:AM});
      return s; })(),'Dominoes falling as an image of proof by induction')}];

  I.p14m2=[{cap:"Euclid's algorithm for gcd(252, 105): replace (a, b) by (b, a mod b) until the remainder is 0; the last nonzero remainder is the gcd. Read the same three lines backwards and you get Bézout's identity 21 = 5·105 − 2·252 — the extended algorithm that computes modular inverses, and therefore RSA private keys.",
    svg:svg(560,240,(()=>{
      let s=text(140,16,'forward: Euclid',{bold:true,color:CY})+text(420,16,'backward: Bézout',{bold:true,color:AM});
      const L=['252 = 2·105 + 42','105 = 2·42 + 21','42 = 2·21 + 0'];
      L.forEach((t,i)=>{ const y=30+i*68; s+=box(20,y,240,36,t,{mono:true,size:13,stroke:i===2?LM:CY,color:i===2?LM:'currentColor'}); if(i<2) s+=arrow(140,y+36,140,y+66,'(b, a mod b)',{dy:2}); });
      s+=text(140,222,'last nonzero remainder: gcd = 21',{size:11,color:LM});
      const R=['21 = 105 − 2·42','= 105 − 2(252 − 2·105)','= 5·105 − 2·252'];
      R.forEach((t,i)=>{ const y=30+i*68; s+=box(300,y,240,36,t,{mono:true,size:12,stroke:AM}); if(i<2) s+=arrow(420,y+36,420,y+66,i===0?'substitute 42':'collect terms',{dy:2}); });
      s+=text(420,216,'with gcd = 1,\nx is the inverse a⁻¹',{size:11,color:AM});
      return s; })(),'Euclidean algorithm steps and the back-substitution that yields Bezout coefficients')},
   {cap:"Modular arithmetic is clock arithmetic: 9 + 5 wraps past 12 to 2, so 9 + 5 ≡ 2 (mod 12). An 8-bit register is a 256-hour clock: 0xFF + 1 wraps to 0x00 (unsigned overflow), and in two's complement 0x7F + 1 flips from +127 to −128.",
    svg:svg(560,235,(()=>{
      const cx=125,cy=120,R=82; let s=text(125,16,'ℤ₁₂: the clock',{bold:true,color:CY});
      s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="none" stroke="currentColor" stroke-width="1.3"/>';
      for(let k=1;k<=12;k++){ const a=(-90+k*30)*Math.PI/180; const x=cx+(R-16)*Math.cos(a), y=cy+(R-16)*Math.sin(a); const hot=k===9||k===2;
        s+=text(x,y,String(k),{size:hot?13:11,bold:hot,color:hot?(k===9?CY:LM):'currentColor'})+line(cx+(R-4)*Math.cos(a),cy+(R-4)*Math.sin(a),cx+R*Math.cos(a),cy+R*Math.sin(a)); }
      const r2=R-34, a9=Math.PI, a2=-30*Math.PI/180; const x9=cx+r2*Math.cos(a9), y9=cy+r2*Math.sin(a9), x2=cx+r2*Math.cos(a2), y2=cy+r2*Math.sin(a2);
      s+='<path d="M'+x9.toFixed(1)+','+y9.toFixed(1)+' A'+r2+','+r2+' 0 0 1 '+x2.toFixed(1)+','+y2.toFixed(1)+'" fill="none" stroke="'+AM+'" stroke-width="2" marker-end="url(#ah)"/>';
      s+=text(cx,cy+6,'+5',{size:12,color:AM,bold:true});
      s+=text(125,222,'9 + 5 ≡ 2 (mod 12)',{size:12,color:LM});
      s+=text(420,16,'wrap-around: 8 bits',{bold:true,color:CY});
      ['0xFE','0xFF','0x00','0x01'].forEach((t,i)=>{ const x=300+i*62; s+=box(x,46,50,32,t,{mono:true,size:12,stroke:i===2?MG:'currentColor',color:i===2?MG:'currentColor'}); if(i<3) s+=arrow(x+50,62,x+62,62,''); });
      s+=text(420,96,'+1 each step: mod 256',{size:10,color:DIM});
      s+=box(300,125,110,34,'0x7F = +127',{mono:true,size:11,stroke:LM})+arrow(410,142,430,142,'')+box(430,125,110,34,'0x80 = −128',{mono:true,size:11,stroke:MG,color:MG});
      s+=text(420,178,'signed: +1 flips the sign',{size:10,color:MG});
      s+=text(420,222,'overflow = wrap, not an error',{size:11,color:AM});
      return s; })(),'A 12-hour clock for mod 12 and 8-bit wrap-around')},
   {cap:"Toy RSA end to end: two primes make n and φ(n); e is chosen coprime to φ(n) and d is its modular inverse; encrypting 65 gives 2790 and decrypting returns 65 because ed ≡ 1 (mod φ(n)). Public: n and e. Private: d, p and q.",
    svg:flow([{t:'primes (private)\np = 61, q = 53',stroke:MG},{t:'n = 3233 (public)\nφ(n) = 60·52 = 3120',stroke:CY},{t:'e = 17 (public)\nd = 17⁻¹ = 2753',stroke:CY},{t:'encrypt: m = 65\n65¹⁷ mod n = 2790',stroke:AM},{t:'decrypt: c = 2790\n2790²⁷⁵³ mod n = 65',stroke:LM}],{bw:140,bh:54,gap:40,label:'Toy RSA key generation, encryption and decryption'})}];

  I.p14m3=[{cap:"Choosing 2 of {A, B, C, D}: the 12 off-diagonal cells are ordered pairs, P(4, 2) = 12; each unordered pair appears twice, so C(4, 2) = 12/2 = 6 (the solid triangle). The same count turns 23 people into 253 pairs — the engine of the birthday paradox.",
    svg:svg(560,235,(()=>{
      const items=['A','B','C','D'], ox=70, oy=52, c=36; let s=text(142,20,'pairs from {A, B, C, D}',{bold:true,color:CY});
      items.forEach((t,i)=>{ s+=text(ox+c*i+c/2,oy-12,t,{size:11,color:DIM,bold:true})+text(ox-12,oy+c*i+c/2,t,{size:11,color:DIM,bold:true}); });
      for(let i=0;i<4;i++) for(let j=0;j<4;j++){ const x=ox+c*j, y=oy+c*i;
        if(i<j) s+=shade(x,y,c,c,CY,0.25)+box(x,y,c,c,items[i]+items[j],{stroke:CY,color:CY,size:11,rx:3,bold:true});
        else if(i>j) s+=box(x,y,c,c,items[i]+items[j],{stroke:DIM,color:DIM,size:11,rx:3,dash:true});
        else s+=box(x,y,c,c,'',{stroke:DIM,rx:3})+line(x+8,y+8,x+c-8,y+c-8,{stroke:DIM}); }
      s+=text(142,210,'6 unordered (solid) · 12 ordered',{size:11,color:LM});
      s+=box(290,45,250,36,'C(n, k) = n! / (k!(n − k)!)',{mono:true,size:12,stroke:CY});
      s+=box(290,100,250,36,'C(23, 2) = 253 pairs',{size:12,stroke:AM})+text(415,150,'→ P(shared birthday) = 50.7%',{size:11,color:AM});
      s+=box(290,165,250,36,'C(52, 5) = 2,598,960 hands',{size:12,stroke:LM});
      s+=text(415,222,'order ignored ⇒ divide by k!',{size:11,color:DIM});
      return s; })(),'A grid of pairs showing ordered versus unordered selections, with binomial coefficient examples')},
   {cap:"Probability that at least two of k people share a birthday, from the exact complement product (365/365)(364/365)…: it crosses 50% at k = 23 and reaches 97% at k = 50. Hash collisions follow the same curve with N = 2ⁿ in place of 365, which is where the 1.177√N birthday bound comes from.",
    svg:svg(560,235,(()=>{
      const X=k=>50+k*8, Y=p=>190-p*150; let s=text(280,18,'P(shared birthday) vs group size',{bold:true,color:CY});
      s+=line(50,190,540,190)+line(50,190,50,30);
      [0,0.5,1].forEach(v=>{ s+=text(40,Y(v),String(v),{size:10,anchor:'end',color:DIM})+line(46,Y(v),50,Y(v)); });
      [0,10,20,30,40,50,60].forEach(k=>{ s+=text(X(k),206,String(k),{size:10,color:DIM})+line(X(k),190,X(k),194); });
      const P=[0]; let q=1; for(let k=1;k<=60;k++){ q*=(365-k+1)/365; P.push(1-q); }
      s+=poly(P.map((p,k)=>[X(k),Y(p)]),{stroke:CY,sw:2});
      s+=line(X(23),190,X(23),Y(P[23]),{stroke:AM,dash:true})+line(50,Y(P[23]),X(23),Y(P[23]),{stroke:AM,dash:true})+dot(X(23),Y(P[23]),AM,5);
      s+=text(X(23)+10,Y(P[23])+16,'k = 23 → 50.7%',{size:11,color:AM,anchor:'start'});
      s+=dot(X(50),Y(P[50]),LM,4)+text(X(50)+8,Y(P[50])+18,'k = 50 → 97%',{size:11,color:LM,anchor:'start'});
      s+=text(295,224,'group size k',{size:10,color:DIM});
      s+=text(140,60,'23 people = 253 pairs',{size:10,color:DIM});
      return s; })(),'Birthday-paradox probability curve crossing 50 percent at 23 people')},
   {cap:"Password search spaces on a logarithmic scale, with the time to exhaust each at 10¹¹ guesses per second against a fast unsalted hash. Four more characters multiply the space by 95⁴ ≈ 8 × 10⁷; that is why length beats composition rules, and why slow salted hashing (bcrypt, Argon2) matters even more.",
    svg:svg(560,215,(()=>{
      let s=text(280,18,'brute force at 10¹¹ guesses/s',{bold:true,color:CY});
      const rows=[['26⁸ lowercase',11.32,'2.1×10¹¹ · ≈ 2 s',DIM],['95⁸ printable',15.82,'6.6×10¹⁵ · ≈ 18 h',AM],['95¹² printable',23.73,'5.4×10²³ · ≈ 171,000 yr',MG]];
      rows.forEach(([lbl,lg,t,c],i)=>{ const y=42+i*52, w=lg*15; s+=text(140,y+13,lbl,{size:11,anchor:'end'})+shade(150,y,w,26,c,0.3)+rect(150,y,w,26,c)+text(150+w-6,y-8,t,{size:10,color:c,anchor:'end'}); });
      s+=text(280,198,'each character multiplies by 95',{size:11,color:LM});
      return s; })(),'Three password search spaces as log-scale bars with cracking times')}];

  I.p14m4=[{cap:"Matrix multiplication is rows times columns: entry c₁₂ is the dot product of row 1 of A with column 2 of B, 2·2 + 1·4 = 8. Every entry of an n×n product costs n multiply-adds, so the whole product costs n³ — the number that prices every neural-network layer and every GPU.",
    svg:svg(560,225,(()=>{
      const cell=40, A=[[2,1],[1,2]], B=[[1,2],[3,4]], C=[[5,8],[7,10]];
      const mat=(x0,y0,M,hl)=>{ let s=''; M.forEach((r,i)=>r.forEach((v,j)=>{ const h=hl(i,j); s+=(h?shade(x0+j*cell,y0+i*cell,cell,cell,h,0.25):'')+box(x0+j*cell,y0+i*cell,cell,cell,String(v),{stroke:h||DIM,color:h||'currentColor',bold:!!h,size:14,rx:0}); })); return s; };
      let s=text(80,40,'A',{bold:true,color:CY})+text(190,40,'B',{bold:true,color:MG})+text(320,40,'C = AB',{bold:true,color:AM});
      s+=mat(40,55,A,(i,j)=>i===0?CY:null)+text(135,95,'·',{size:20})+mat(150,55,B,(i,j)=>j===1?MG:null)+text(245,95,'=',{size:18})+mat(280,55,C,(i,j)=>(i===0&&j===1)?AM:null);
      s+=text(80,150,'row 1',{size:10,color:CY})+text(190,150,'column 2',{size:10,color:MG})+text(320,150,'c₁₂',{size:10,color:AM});
      s+=box(380,55,165,40,'c₁₂ = 2·2 + 1·4 = 8',{mono:true,size:11,stroke:AM,color:AM});
      s+=text(462,112,'row · column = dot product',{size:10,color:DIM});
      s+=box(380,128,165,34,'n×n · n×n: n³ multiply-adds',{size:10,stroke:CY});
      s+=text(462,180,'n = 4096: 1.4×10¹¹ flops',{size:10,color:DIM})+text(462,196,'RTX 4090: under 2 ms',{size:10,color:DIM});
      s+=text(190,200,'AB ≠ BA in general',{size:11,color:MG});
      return s; })(),'Row times column producing one entry of a matrix product')},
   {cap:"A = [[2, 1], [1, 2]] moves most vectors off their line: (1, 0) lands on (2, 1). Its eigenvectors stay put: (1, 1) is stretched to (3, 3) (λ = 3) and (1, −1) is left alone (λ = 1). Along those two axes the whole transformation is just 'stretch by 3' and 'do nothing'.",
    svg:svg(560,245,(()=>{
      const ox=150, oy=135, u=30; const P=(x,y)=>[ox+x*u, oy-y*u];
      let s=line(20,oy,290,oy,{stroke:DIM})+line(ox,235,ox,15,{stroke:DIM});
      const vec=(x,y,c,o={})=>{ const [px,py]=P(x,y); return arrow(ox,oy,px,py,'',{stroke:c,sw:o.sw||2,dash:o.dash}); };
      s+=line(...P(-2.5,-2.5),...P(3.1,3.1),{stroke:CY,dash:true,sw:1})+line(...P(-2.5,2.5),...P(3.3,-3.3),{stroke:LM,dash:true,sw:1});
      s+=vec(3,3,CY,{dash:true})+vec(1,1,CY)+text(...P(3.45,2.65),'(3, 3)',{size:10,color:CY})+text(...P(0.5,1.4),'(1, 1)',{size:10,color:CY});
      s+=vec(1,-1,LM)+text(...P(2.3,-1.0),'(1, −1) → itself',{size:10,color:LM,anchor:'start'});
      s+=vec(2,1,MG,{dash:true})+vec(1,0,MG)+text(...P(1.3,-0.4),'(1, 0)',{size:10,color:MG})+text(...P(2.6,1.1),'(2, 1)',{size:10,color:MG});
      s+=text(430,30,'A = [[2, 1], [1, 2]]',{bold:true,color:AM,mono:true,size:12});
      [['A(1,1) = (3,3): λ = 3',CY],['A(1,−1) = (1,−1): λ = 1',LM],['A(1,0) = (2,1): rotated',MG],['det = 3·1 = 3\ntrace = 3 + 1 = 4','currentColor']].forEach(([t,c],i)=>{ s+=box(320,52+i*42,225,34,t,{size:11,stroke:c,color:c}); });
      s+=text(430,232,'eigenvectors: axes A never turns',{size:10,color:DIM});
      return s; })(),'Eigenvectors of a 2 by 2 matrix stay on their lines while other vectors rotate')},
   {cap:"One dense layer is one matrix–vector product: a 128×784 weight matrix times a 784-pixel image gives 128 outputs for 100,352 multiply-adds; a batch of 64 images turns that into a single (64×784)(784×128) product, exactly the shape a GPU is built to run.",
    svg:svg(560,195,(()=>{
      let s=text(280,18,'y = Wx + b',{bold:true,color:CY});
      s+=box(40,45,200,70,'W\n128 × 784 weights',{stroke:CY,size:12})+text(255,80,'·',{size:20})+box(270,45,70,70,'x\n784 pixels',{stroke:MG,size:11})+text(355,80,'+',{size:18})+box(370,45,50,70,'b\n128',{stroke:DIM,size:11})+text(435,80,'=',{size:18})+box(450,45,90,70,'y\n128 outputs',{stroke:AM,size:11});
      s+=text(140,140,'128 × 784 = 100,352 multiply-adds',{size:11,color:LM});
      s+=text(400,140,'batch of 64: (64×784)(784×128)',{size:11,color:DIM});
      s+=text(280,172,'then ReLU — Module 7 trains W',{size:10,color:DIM});
      return s; })(),'A dense neural-network layer drawn as matrix shapes')}];

  I.p14m5=[{cap:"Bayes with natural frequencies: of 10,000 events, 1 is malicious and 9,999 are benign. The detector catches 99% of the malicious (≈1 alert) and false-alarms on 1% of the benign (≈100 alerts), so P(malicious | alert) ≈ 1/101 ≈ 1% — the base-rate effect that drowns a SOC in noise.",
    svg:svg(560,250,(()=>{
      let s=box(200,12,160,36,'10,000 events',{stroke:CY,bold:true});
      s+=arrow(250,48,140,78,'1 in 10,000',{dy:4})+arrow(310,48,420,78,'9,999 in 10,000',{dy:4});
      s+=box(60,78,160,44,'malicious\n1',{stroke:MG,color:MG,size:12})+box(340,78,160,44,'benign\n9,999',{stroke:DIM,size:12});
      s+=arrow(140,122,140,150,'99% caught',{dy:5})+arrow(380,122,350,150,'1% false alarm',{dy:5})+arrow(440,122,480,150,'99% quiet',{dy:5});
      s+=box(60,150,160,44,'alert ≈ 1\n(true positive)',{stroke:MG,color:MG,size:11})+box(290,150,120,44,'alert ≈ 100\n(false positives)',{stroke:AM,color:AM,size:10})+box(425,150,120,44,'no alert\n≈ 9,899',{stroke:DIM,size:11});
      s+=box(90,212,380,30,'P(malicious | alert) ≈ 1/101 ≈ 1%',{stroke:LM,color:LM,size:12});
      return s; })(),'A natural-frequency tree for the detector base-rate calculation')},
   {cap:"The normal distribution and the 68–95–99.7 rule: about 68% of values fall within one standard deviation of the mean, 95% within two, 99.7% within three. Means of samples obey it by the central limit theorem, which is why confidence intervals use 1.96 standard errors.",
    svg:svg(560,235,(()=>{
      const cx=280, sg=65, base=185, H=130; const Xz=z=>cx+z*sg, Yz=z=>base-H*Math.exp(-z*z/2);
      const seg=(a,b,c,op)=>{ const pts=[[Xz(a),base]]; for(let z=a;z<=b+1e-9;z+=0.05) pts.push([Xz(z),Yz(z)]); pts.push([Xz(b),base]); return poly(pts,{fill:c,op,stroke:'none',sw:0}); };
      let s=text(280,18,'the 68–95–99.7 rule',{bold:true,color:CY});
      s+=seg(-3,-2,MG,0.25)+seg(2,3,MG,0.25)+seg(-2,-1,AM,0.25)+seg(1,2,AM,0.25)+seg(-1,1,CY,0.3);
      const curve=[]; for(let z=-3.5;z<=3.5;z+=0.05) curve.push([Xz(z),Yz(z)]); s+=poly(curve,{stroke:'currentColor',sw:1.8});
      s+=line(60,base,500,base);
      [-3,-2,-1,0,1,2,3].forEach(z=>{ s+=line(Xz(z),base,Xz(z),base+5)+text(Xz(z),base+16,z===0?'μ':(z<0?'μ−'+(-z)+'σ':'μ+'+z+'σ'),{size:10,color:DIM}); });
      s+=text(cx,150,'68%',{size:13,bold:true,color:CY})+text(Xz(-1.5),172,'13.6%',{size:10,color:AM})+text(Xz(1.5),172,'13.6%',{size:10,color:AM})+text(Xz(-2.5),150,'2.1%',{size:10,color:MG})+text(Xz(2.5),150,'2.1%',{size:10,color:MG});
      s+=text(cx,225,'±1σ: 68% · ±2σ: 95% · ±3σ: 99.7%',{size:11,color:LM});
      return s; })(),'Normal curve shaded by standard-deviation bands')},
   {cap:"The Poisson(λ = 4) distribution for packets per second: P(k) = e⁻⁴ 4ᵏ/k!, so a silent second has probability e⁻⁴ ≈ 1.8%, the mean and the variance are both 4, and the shape is the one that request arrivals, radioactive decays and typos per page all share.",
    svg:svg(560,205,(()=>{
      const lam=4; let s=text(280,18,'Poisson(λ = 4): packets per second',{bold:true,color:CY});
      const pk=[]; let f=1; for(let k=0;k<=12;k++){ if(k>0) f*=k; pk.push(Math.exp(-lam)*Math.pow(lam,k)/f); }
      const mx=Math.max(...pk), base=160, bw=30, gap=8, x0=50;
      pk.forEach((p,k)=>{ const h=p/mx*110, x=x0+k*(bw+gap), c=k===0?MG:(k===4?AM:CY); s+=shade(x,base-h,bw,h,c,0.35)+rect(x,base-h,bw,h,c,{rx:1,sw:1.2})+text(x+bw/2,base+14,String(k),{size:10,color:DIM}); });
      s+=line(x0-4,base,x0+13*(bw+gap),base);
      s+=text(50,38,'P(0) = e⁻⁴ ≈ 1.8%',{size:11,color:MG,anchor:'start'})+line(65,46,65,146,{stroke:MG,dash:true});
      s+=text(330,45,'mean = variance = λ = 4',{size:11,color:AM,anchor:'start'});
      s+=text(280,192,'k = packets in one second',{size:10,color:DIM});
      return s; })(),'Poisson probability mass function for rate 4')}];

  I.p14m6=[{cap:"Twenty 95% confidence intervals from twenty samples of the same population. The true mean μ never moves; the intervals do, and about 19 of 20 cover it. That is the correct reading of '95%': a property of the procedure, not a probability about μ.",
    svg:svg(560,245,(()=>{
      const mu=300, se=20, hw=1.96*se; const zs=[0.3,-1.1,0.8,-0.4,1.5,-2.3,0.1,-0.7,1.9,-1.4,0.6,1.6,-0.2,0.9,-1.7,0.4,-0.9,1.2,-0.5,0.0];
      let s=line(mu,28,mu,222,{stroke:LM,dash:true,sw:1.5})+text(mu,18,'true μ',{size:11,color:LM,bold:true});
      zs.forEach((z,i)=>{ const y=36+i*9.6, c=mu+z*se, miss=Math.abs(z)>1.96, col=miss?MG:CY; s+=line(c-hw,y,c+hw,y,{stroke:col,sw:miss?2.2:1.6})+dot(c,y,col,2.4); if(miss) s+=text(c-hw-8,y,'misses μ',{size:10,color:MG,anchor:'end'}); });
      s+=text(455,70,'19 of 20 cover μ',{size:12,color:CY,bold:true});
      s+=text(455,96,'estimate ± 1.96 × SE',{size:11})+text(455,118,'SE = σ/√n',{size:11,color:DIM});
      s+=text(455,150,'4× the data ⇒ half the width',{size:10,color:AM});
      s+=text(455,180,'μ fixed; the interval is random',{size:10,color:DIM});
      s+=text(280,238,'each row: one sample\'s interval',{size:10,color:DIM});
      return s; })(),'Twenty confidence intervals around a fixed true mean, one missing')},
   {cap:"Least squares chooses the line that minimizes the sum of the squared vertical gaps (the residuals, in amber). With these six points the slope is Sxy/Sxx and the intercept is ȳ − β₁x̄; r² reports the fraction of y's variance the line explains.",
    svg:svg(560,245,(()=>{
      const xs=[1,2,3,4,5,6], ys=[2.6,2.9,5.1,4.9,7.2,7.1]; const n=6, mx=3.5, my=ys.reduce((a,b)=>a+b,0)/n;
      let sxy=0,sxx=0,syy=0; xs.forEach((x,i)=>{ sxy+=(x-mx)*(ys[i]-my); sxx+=(x-mx)*(x-mx); syy+=(ys[i]-my)*(ys[i]-my); }); const b1=sxy/sxx, b0=my-b1*mx, r2=(sxy*sxy)/(sxx*syy);
      const X=x=>50+x*48, Y=y=>205-y*20;
      let s=line(50,205,350,205)+line(50,205,50,20)+text(364,222,'x',{size:11,color:DIM})+text(38,24,'y',{size:11,color:DIM});
      s+=line(X(0.5),Y(b0+b1*0.5),X(6.5),Y(b0+b1*6.5),{stroke:LM,sw:2});
      xs.forEach((x,i)=>{ const yh=b0+b1*x; s+=line(X(x),Y(ys[i]),X(x),Y(yh),{stroke:AM,sw:2})+dot(X(x),Y(ys[i]),CY,4.5)+text(X(x),220,String(x),{size:10,color:DIM}); });
      s+=text(200,18,'the least-squares line',{bold:true,color:CY});
      s+=box(375,40,170,34,'minimize Σ (yᵢ − ŷᵢ)²',{size:11,stroke:AM,color:AM});
      s+=box(375,86,170,34,'β₁ = Sxy / Sxx = '+b1.toFixed(2),{size:11,stroke:LM});
      s+=box(375,132,170,34,'β₀ = ȳ − β₁x̄ = '+b0.toFixed(2),{size:11,stroke:LM});
      s+=box(375,178,170,34,'r² = '+r2.toFixed(3),{size:12,stroke:CY,color:CY});
      s+=text(460,232,'amber gaps = residuals',{size:10,color:AM});
      return s; })(),'Scatter points with the least-squares line and residuals')},
   {cap:"A p-value is a tail area under the null hypothesis: for the A/B test (2.0% vs 2.4%, n = 10,000 per arm) the statistic z = 1.93 leaves 5.4% of the null distribution in the two tails — just short of the 5% cutoff at ±1.96. Both verdicts, 'significant' and 'not significant', hide how close that is.",
    svg:svg(560,215,(()=>{
      const cx=280, sg=70, base=165, H=120; const Xz=z=>cx+z*sg, Yz=z=>base-H*Math.exp(-z*z/2);
      const tail=(a,b,c,op)=>{ const pts=[[Xz(a),base]]; for(let z=a;z<=b+1e-9;z+=0.05) pts.push([Xz(z),Yz(z)]); pts.push([Xz(b),base]); return poly(pts,{fill:c,op,stroke:'none',sw:0}); };
      let s=text(280,18,'p-value = tail area under H₀',{bold:true,color:CY});
      s+=tail(-3.4,-1.93,MG,0.4)+tail(1.93,3.4,MG,0.4);
      const curve=[]; for(let z=-3.5;z<=3.5;z+=0.05) curve.push([Xz(z),Yz(z)]); s+=poly(curve,{stroke:'currentColor',sw:1.8})+line(30,base,530,base);
      s+=line(Xz(1.93),base,Xz(1.93),Yz(1.93)-30,{stroke:MG,sw:1.6})+text(Xz(1.93)+6,Yz(1.93)-36,'observed z = 1.93',{size:10,color:MG,anchor:'start'});
      s+=line(Xz(-1.93),base,Xz(-1.93),Yz(-1.93)-30,{stroke:MG,sw:1.6});
      s+=line(Xz(1.96),base,Xz(1.96),30,{stroke:AM,dash:true})+line(Xz(-1.96),base,Xz(-1.96),30,{stroke:AM,dash:true})+text(Xz(-1.96)-6,36,'cutoff ±1.96 (α = 0.05)',{size:10,color:AM,anchor:'end'});
      s+=text(Xz(2.7),base-22,'2.7%',{size:10,color:MG})+text(Xz(-2.7),base-22,'2.7%',{size:10,color:MG});
      s+=text(cx,base-60,'H₀: no difference',{size:11,color:DIM});
      s+=text(280,200,'two tails: p ≈ 0.054 > 0.05',{size:11,color:LM});
      return s; })(),'Standard normal curve with the two-tailed p-value area shaded')}];

  I.p14m7=[{cap:"Gradient descent on the bowl f(x) = x²: each step moves against the slope, x ← x − η·2x. With η = 0.1 the iterates 5, 4, 3.2, 2.56, … shrink by 0.8 each step and slide to the minimum; with η = 1.1 the first step overshoots to −6 and every step grows — the learning rate decides everything.",
    svg:svg(560,250,(()=>{
      const X=x=>280+x*38, Y=f=>205-f*4.3, f=x=>x*x;
      const curve=[]; for(let x=-6.3;x<=6.3;x+=0.1) curve.push([X(x),Y(f(x))]); let s=poly(curve,{stroke:'currentColor',sw:1.8});
      s+=text(280,18,'θ ← θ − η ∇f(θ)',{bold:true,color:AM,size:13});
      const xs=[5]; for(let i=0;i<7;i++) xs.push(xs[xs.length-1]*0.8);
      xs.forEach((x,i)=>{ if(i<4){ const nx=xs[i+1]; s+=arrow(X(x),Y(f(x)),X(nx)+3,Y(f(nx))+1,'',{stroke:CY,sw:1.6}); } s+=dot(X(x),Y(f(x)),CY,3.5); });
      s+=text(X(5)-22,Y(f(5))-26,'x₀ = 5',{size:11,color:CY,anchor:'end'});
      s+=arrow(X(5),Y(f(5))-6,X(-6)+6,Y(f(-6))+4,'',{stroke:MG,dash:true,sw:1.5})+text(X(-6)+10,Y(f(-6))-14,'η = 1.1: 5 → −6 → 7.2 …',{size:10,color:MG,anchor:'start'});
      s+=dot(X(0),Y(0),LM,4)+text(X(0),Y(0)+16,'minimum',{size:10,color:LM});
      s+=text(280,238,'η = 0.1: 5, 4, 3.2, 2.56, 2.05 … → 0',{size:11,color:CY});
      return s; })(),'Gradient descent iterates sliding down a parabola, with a divergent step')},
   {cap:"Entropy of a biased coin, H(p) = −p log₂ p − (1 − p) log₂(1 − p): a fair coin carries 1 bit per flip, a 90/10 coin only 0.47 bits, a certain outcome 0. Predictable sources carry less information — the reason human-chosen passwords hold far fewer bits than their length suggests.",
    svg:svg(560,225,(()=>{
      const X=p=>60+p*440, Y=h=>180-h*120; const H=p=>(p<=0||p>=1)?0:-(p*Math.log2(p)+(1-p)*Math.log2(1-p));
      let s=text(280,18,'H(p) = −Σ p log₂ p  (bits)',{bold:true,color:MG});
      s+=line(60,180,500,180)+line(60,180,60,50);
      [0,0.5,1].forEach(p=>{ s+=line(X(p),180,X(p),184)+text(X(p),196,String(p),{size:10,color:DIM}); });
      [0,0.5,1].forEach(h=>{ s+=line(56,Y(h),60,Y(h))+text(50,Y(h),String(h),{size:10,color:DIM,anchor:'end'}); });
      const pts=[]; for(let p=0;p<=1.0001;p+=0.01) pts.push([X(Math.min(p,1)),Y(H(Math.min(p,1)))]); s+=poly(pts,{stroke:MG,sw:2});
      s+=dot(X(0.5),Y(1),CY,5)+text(X(0.5),Y(1)-14,'fair coin: 1 bit',{size:11,color:CY});
      s+=line(X(0.9),180,X(0.9),Y(H(0.9)),{stroke:AM,dash:true})+dot(X(0.9),Y(H(0.9)),AM,5)+text(X(0.9)-10,152,'p = 0.9: 0.47 bits',{size:11,color:AM,anchor:'end'});
      s+=text(280,214,'P(heads) = p',{size:10,color:DIM});
      s+=text(66,60,'certain: 0 bits',{size:10,color:DIM,anchor:'start'});
      return s; })(),'Binary entropy curve peaking at one bit for a fair coin')},
   {cap:"A fiber loss budget is decibel arithmetic: 20 km at 0.2 dB/km (4.0 dB) plus four splices (0.4 dB) and two connector pairs (1.0 dB) is 5.4 dB of loss, so a 0 dBm transmitter arrives at −5.4 dBm, 22.6 dB above a −28 dBm receiver — logarithms turn multiplied losses into a sum. Never look into a live fiber; check it with a power meter, and bin every cleaved shard as a sharp.",
    svg:svg(560,215,(()=>{
      const Xd=d=>80+(d+30)*14;
      let s=text(280,18,'loss budget: 20 km at 1550 nm',{bold:true,color:CY});
      s+=line(Xd(-30),110,Xd(0),110,{stroke:DIM});
      [0,-10,-20,-30].forEach(d=>{ s+=line(Xd(d),106,Xd(d),114,{stroke:DIM})+text(Xd(d),126,d+' dBm',{size:9,color:DIM}); });
      s+=line(Xd(-28),106,Xd(-28),114,{stroke:MG});
      const segs=[['fiber 20 km × 0.2 = 4.0 dB',4.0,CY],['4 splices × 0.1 = 0.4 dB',0.4,AM],['2 connectors × 0.5 = 1.0 dB',1.0,MG]];
      let p=0; segs.forEach(([t,l,c])=>{ const x1=Xd(-(p+l)), x2=Xd(-p); s+=shade(x1,62,x2-x1,30,c,0.35)+rect(x1,62,x2-x1,30,c,{rx:1,sw:1.2}); p+=l; });
      s+=text(Xd(0),52,'TX 0 dBm',{size:10,color:CY,anchor:'end'})+text(Xd(-5.4)-4,52,'RX −5.4 dBm',{size:10,color:LM,anchor:'end'});
      s+=line(Xd(-28),44,Xd(-28),100,{stroke:MG,dash:true})+text(Xd(-28)+4,40,'sensitivity −28 dBm',{size:10,color:MG,anchor:'start'});
      s+=line(Xd(-28),150,Xd(-5.4),150,{stroke:LM,sw:1.6})+line(Xd(-28),144,Xd(-28),156,{stroke:LM})+line(Xd(-5.4),144,Xd(-5.4),156,{stroke:LM})+text((Xd(-28)+Xd(-5.4))/2,165,'margin 22.6 dB',{size:11,color:LM});
      segs.forEach(([t,l,c],i)=>{ s+=shade(80,174+i*13-5,9,9,c,0.9)+text(96,174+i*13,t,{size:9,color:c,anchor:'start'}); });
      s+=text(430,196,'never look into a live fiber',{size:10,color:MG});
      return s; })(),'A fiber loss budget as segments on a dBm scale with the receiver margin')}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
