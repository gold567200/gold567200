/* Third figures — Domain 14: Mathematics for Computing: Logic, Discrete Math, Linear Algebra, Probability & Statistics. Adds to the figures in illus_p14.js (never replaces them). */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const add=(id,figs)=>{ window.ILLUS=window.ILLUS||{}; window.ILLUS[id]=(window.ILLUS[id]||[]).concat(figs); };
  /* local helpers, kit colors only */
  const hl=(x,y,w,h,c,op)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="3" fill="'+c+'" opacity="'+(op||0.2)+'"/>';
  const dot=(x,y,c,r)=>'<circle cx="'+x+'" cy="'+y+'" r="'+(r||4)+'" fill="'+(c||CY)+'"/>';
  const elbow=(d,o={})=>'<path d="'+d+'" fill="none" stroke="'+(o.stroke||'currentColor')+'" stroke-width="'+(o.sw||1.3)+'"'+(o.dash?' stroke-dasharray="5 4"':'')+' marker-end="url(#ah)"/>';
  const panel=(x,y,w,h,t,c)=>box(x,y,w,h,'',{dash:true,stroke:DIM})+text(x+w/2,y+16,t,{bold:true,color:c,size:11});

  /* M1 — the firewall example: one wrong connective, caught by four rows */
  add('p14m1',[{cap:"The lecture's firewall rule as a truth table: allow only LAN sources (L) going to approved servers (A), so the deny rule is ¬(L ∧ A), which De Morgan turns into ¬L ∨ ¬A. The hurried version ¬L ∧ ¬A is false in two rows that should be denied, including an outsider aiming at an approved server, and four rows expose it in seconds.",
    svg:svg(560,232,(()=>{
      const cols=[['L',20,40],['A',64,40],['L ∧ A\nintent: allow',108,94],['¬L ∨ ¬A\ncorrect deny',206,94],['¬L ∧ ¬A\nhurried deny',304,94],['what happens',402,140]];
      const rows=[['T','T','T','F','F','allowed, as intended',LM],['T','F','F','T','F','wrong rule lets it in ✗',MG],['F','T','F','T','F','outsider reaches server ✗',MG],['F','F','F','T','T','denied, as intended',LM]];
      let s=''; cols.forEach(([h,x,w],j)=>{ s+=box(x,18,w,38,h,{bold:true,size:11,stroke:j===4?MG:(j===3?LM:CY),color:j===4?MG:(j===3?LM:CY)}); });
      rows.forEach((r,i)=>{ const y=62+i*30, bad=r[6]===MG; if(bad) s+=hl(18,y-2,526,30,MG,0.12);
        cols.forEach(([h,x,w],j)=>{ const v=j<5?r[j]:r[5]; const hot=bad&&j===4; s+=box(x,y,w,26,v,{size:j<5?12:10,stroke:hot?MG:DIM,color:j===5?r[6]:(hot?MG:'currentColor'),bold:hot}); }); });
      s+=text(280,200,'De Morgan: ¬(L ∧ A) ≡ ¬L ∨ ¬A',{size:12,color:CY,bold:true})+text(280,220,'four rows expose the bug',{size:10,color:LM});
      return s; })(),'Truth table comparing the correct and the hurried firewall deny rules')}]);

  /* M2 — square-and-multiply for 65^17 mod 3233 */
  add('p14m2',[{cap:"Square-and-multiply on the lecture's toy RSA encryption: square 65 four times, reducing mod 3233 after every step, then multiply together the powers whose bit is 1 in 17 = 10001₂. Five multiplications give 65¹⁷ ≡ 2790 instead of sixteen, and the same trick handles 2,048-bit exponents.",
    svg:svg(560,232,(()=>{
      let s=text(280,14,'65¹⁷ mod 3233 by square-and-multiply',{bold:true,color:CY,size:12});
      const P=[['65¹ = 65',1],['65² ≡ 992',0],['65⁴ ≡ 1232',0],['65⁸ ≡ 1547',0],['65¹⁶ ≡ 789',1]];
      P.forEach(([t,b],i)=>{ const x=10+i*111; s+=box(x,28,96,40,t,{size:12,stroke:b?LM:'currentColor',bold:!!b}); if(i<4) s+=arrow(x+97,48,x+110,48,'');
        s+=box(x+13,94,70,24,'bit '+i+' = '+b,{size:10,stroke:b?LM:DIM,color:b?LM:DIM}); });
      s+=text(280,82,'each arrow: square, reduce mod 3233',{size:10,color:DIM});
      s+=text(280,134,'17 = 16 + 1 = binary 10001',{size:11,color:AM});
      s+=arrow(48,118,170,150,'',{stroke:LM})+arrow(492,118,390,150,'',{stroke:LM});
      s+=box(130,150,300,34,'65¹⁷ ≡ 789 × 65 = 51,285 ≡ 2790',{size:11,stroke:LM,bold:true});
      s+=text(280,204,'five multiplications instead of sixteen',{size:10,color:LM})+text(280,222,'toy RSA: 65 encrypts to 2790',{size:10,color:DIM});
      return s; })(),'Repeated squaring of 65 modulo 3233 combined by the bits of 17')}]);

  /* M3 — pigeonhole: no lossless compressor shrinks every file */
  add('p14m3',[{cap:"The pigeonhole argument against a universal compressor, at n = 3: there are 2³ = 8 three-bit files but only 1 + 2 + 4 = 7 strings shorter than three bits. Any compressor that shrinks all of them must send two files to the same output, so it cannot be lossless; one that shrinks some files must expand others.",
    svg:svg(560,248,(()=>{
      let s=text(90,16,'8 files of 3 bits',{bold:true,color:CY,size:11})+text(90,30,'2³ = 8',{size:10,color:DIM})+text(250,16,'compress →',{size:10,color:DIM});
      s+=text(410,16,'7 shorter strings',{bold:true,color:AM,size:11})+text(410,30,'lengths 0–2: 1 + 2 + 4',{size:10,color:DIM});
      const F=['000','001','010','011','100','101','110','111'], H=['ε','0','1','00','01','10','11'];
      F.forEach((f,i)=>{ const to=Math.min(i,6), hot=i>=6; s+=arrow(121,49+i*24,378,61+to*24,'',{stroke:hot?MG:DIM,sw:hot?1.8:1.1}); });
      F.forEach((f,i)=>{ s+=box(60,40+i*24,60,18,f,{mono:true,size:11,stroke:i>=6?MG:CY}); });
      H.forEach((h,i)=>{ s+=box(380,52+i*24,60,18,h,{mono:true,size:11,stroke:i===6?MG:AM,bold:i===6}); });
      s+=text(452,61,'ε = empty string',{size:9,color:DIM,anchor:'start'});
      s+=text(452,178,'two files,',{size:10,color:MG,anchor:'start'})+text(452,192,'one output:',{size:10,color:MG,anchor:'start'})+text(452,206,'not reversible',{size:10,color:MG,anchor:'start',bold:true});
      s+=text(280,240,'shrinks some files ⇒ must expand others',{size:10,color:AM});
      return s; })(),'Eight three-bit files mapped onto seven shorter strings, forcing a collision')}]);

  /* M4 — Gaussian elimination and the picture of the same system */
  add('p14m4',[{cap:"The lecture's system 2x + y = 5, x + 2y = 4 solved two ways: elimination subtracts half of row one from row two, leaving 1.5y = 1.5, so y = 1 and x = 2; geometrically, that is the one point where the two lines cross. The determinant 2·2 − 1·1 = 3 is not zero, which is exactly why there is a single crossing; a zero determinant means parallel or identical lines.",
    svg:svg(560,240,(()=>{
      let s=box(20,20,220,44,'2x + y = 5\nx + 2y = 4',{stroke:CY,size:12});
      s+=arrow(130,64,130,90,'')+text(140,78,'R2 − ½ R1',{size:10,color:AM,anchor:'start'});
      s+=box(20,92,220,44,'2x + y = 5\n1.5y = 1.5',{stroke:AM,size:12});
      s+=arrow(130,136,130,162,'')+text(140,150,'back-substitute',{size:10,color:DIM,anchor:'start'});
      s+=box(20,164,220,36,'y = 1 → x = (5 − 1)/2 = 2',{stroke:LM,size:12,bold:true});
      s+=text(130,222,'matrix form: Ax = b',{size:10,color:DIM});
      const P=(x,y)=>[300+x*36,205-y*36];
      s+=line(300,205,500,205,{stroke:DIM})+line(300,205,300,15,{stroke:DIM});
      [1,2,3,4,5].forEach(k=>{ s+=text(P(k,0)[0],217,String(k),{size:9,color:DIM})+text(292,P(0,k)[1],String(k),{size:9,color:DIM,anchor:'end'}); });
      s+=line(...P(0,5),...P(2.5,0),{stroke:CY,sw:2})+line(...P(0,2),...P(4,0),{stroke:MG,sw:2});
      s+=text(...P(0.35,4.6),'2x + y = 5',{size:10,color:CY,anchor:'start'})+text(...P(3.6,0.6),'x + 2y = 4',{size:10,color:MG,anchor:'start'});
      s+=dot(...P(2,1),LM,5)+text(...P(2.25,1.3),'(2, 1)',{size:11,color:LM,bold:true,anchor:'start'});
      s+=text(545,40,'det = 4 − 1 = 3 ≠ 0',{size:10,color:AM,anchor:'end'})+text(545,56,'one crossing point',{size:10,color:AM,anchor:'end'})+text(545,76,'det = 0: parallel or same line',{size:9,color:DIM,anchor:'end'});
      return s; })(),'Gaussian elimination steps beside the two lines crossing at (2, 1)')}]);

  /* M5 — Ω as a 6 x 6 grid: independent versus disjoint */
  add('p14m5',[{cap:"Two dice drawn as their sample space of 36 equally likely cells. 'First die is 6' and 'second die is 6' share exactly one cell, 1/36 = 1/6 × 1/6, so they are independent (and inclusion–exclusion gives 6 + 6 − 1 = 11 cells for at least one six); 'sum is 7' and 'sum is 2' share no cell, so they are disjoint, and disjoint events with nonzero probability are dependent.",
    svg:svg(560,245,(()=>{
      let s=panel(10,8,265,228,'INDEPENDENT',CY)+panel(285,8,265,228,'DISJOINT',MG);
      const grid=(x0,y0,fillOf)=>{ let g=''; for(let r=0;r<6;r++){ g+=text(x0-8,y0+r*22+10,String(r+1),{size:9,color:DIM,anchor:'end'}); for(let c=0;c<6;c++){ const x=x0+c*22, y=y0+r*22, f=fillOf(r,c); if(r===0) g+=text(x+10,y0-8,String(c+1),{size:9,color:DIM});
          (f.fills||[]).forEach(col=>{ g+=hl(x,y,20,20,col,0.4); }); g+=box(x,y,20,20,'',{rx:2,stroke:f.stroke||DIM,sw:f.sw||0.8}); } } return g; };
      s+=grid(34,46,(r,c)=>{ const a=r===5, b=c===5; return {fills:[a?CY:null,b?MG:null].filter(Boolean),stroke:a&&b?LM:null,sw:a&&b?2.4:null}; });
      const leg=(x,y,c,t,outline)=>(outline?'<rect x="'+x+'" y="'+(y-6)+'" width="12" height="12" rx="2" fill="none" stroke="'+c+'" stroke-width="2"/>':hl(x,y-6,12,12,c,0.6))+text(x+18,y,t,{size:10,anchor:'start'});
      s+=leg(176,56,CY,'A: 1st die 6')+leg(176,76,MG,'B: 2nd die 6')+leg(176,96,LM,'A ∩ B: 1 cell',true);
      s+=text(176,124,'P(A ∩ B) = 1/36',{size:10,anchor:'start'})+text(176,140,'= 1/6 × 1/6',{size:10,color:LM,anchor:'start'})+text(176,160,'independent',{size:11,color:LM,bold:true,anchor:'start'});
      s+=text(142,198,'|A ∪ B| = 6 + 6 − 1 = 11',{size:10,color:AM})+text(142,216,'P(at least one 6) = 11/36',{size:10,color:AM});
      s+=grid(309,46,(r,c)=>{ const sum=r+c+2; return {fills:sum===7?[AM]:(sum===2?[MG]:[])}; });
      s+=leg(451,56,AM,'A: sum 7')+leg(451,76,MG,'B: sum 2');
      s+=text(451,100,'no shared cell',{size:10,anchor:'start'})+text(451,124,'P(A ∩ B) = 0',{size:10,anchor:'start'})+text(451,140,'≠ 6/36 × 1/36',{size:10,color:MG,anchor:'start'})+text(451,160,'dependent',{size:11,color:MG,bold:true,anchor:'start'});
      s+=text(417,198,'disjoint ≠ independent',{size:11,color:MG,bold:true})+text(417,216,'Ω = 36 equally likely cells',{size:10,color:DIM});
      return s; })(),'Two 6 by 6 dice grids contrasting independent and disjoint events')}]);

  /* M6 — multiple comparisons: twenty tests of pure noise */
  add('p14m6',[{cap:"Why testing many things manufactures discoveries: run 20 independent tests at α = 0.05 on pure noise and you expect one false 'significant' result, with a 64% chance of at least one. Bonferroni's fix tests each at α/m = 0.0025; pre-registration and reported effect sizes keep the analysis honest.",
    svg:svg(560,215,(()=>{
      let s=text(147,18,'20 tests of pure noise',{bold:true,color:CY,size:11});
      for(let i=0;i<20;i++){ const r=Math.floor(i/5), c=i%5, x=20+c*52, y=34+r*36, hit=i===12; if(hit) s+=hl(x,y,46,28,MG,0.3); s+=box(x,y,46,28,hit?'p < .05':'p ≥ .05',{size:10,stroke:hit?MG:DIM,color:hit?MG:DIM,bold:hit}); }
      s+=text(147,190,'one "discovery" from noise alone',{size:10,color:MG})+text(147,206,'each test: α = 0.05',{size:9,color:DIM});
      s+=text(428,30,'expected false hits',{size:10,color:DIM})+text(428,48,'20 × 0.05 = 1',{size:12,color:AM,bold:true});
      s+=text(428,80,'P(at least one)',{size:10,color:DIM})+text(428,98,'1 − 0.95²⁰ = 64%',{size:12,color:MG,bold:true});
      s+=text(428,130,'Bonferroni: test at α/m',{size:10,color:DIM})+text(428,148,'0.05 / 20 = 0.0025',{size:12,color:LM,bold:true});
      s+=text(428,182,'or pre-register the analysis',{size:10,color:DIM})+text(428,200,'and report effect sizes',{size:10,color:DIM});
      return s; })(),'Twenty null tests with one false positive and the Bonferroni correction')}]);

  /* M7 — backpropagation is the chain rule, one factor per link */
  add('p14m7',[{cap:"One neuron, L = (σ(wx + b) − y)², as a computation graph: the forward pass computes z, then a, then the loss. The backward pass multiplies one local derivative per link, 2(a − y), then a(1 − a), then x, to get ∂L/∂w; doing that for every weight from the output backwards, reusing shared factors, is backpropagation.",
    svg:svg(560,218,(()=>{
      let s=text(160,14,'forward: values →',{bold:true,color:CY,size:11})+text(420,14,'← backward: local slopes',{bold:true,color:AM,size:11});
      s+=box(15,28,44,24,'b',{size:12})+box(15,58,44,24,'x',{size:12})+box(15,88,44,24,'w',{size:12,stroke:LM,bold:true});
      s+=arrow(59,40,103,56,'')+arrow(59,70,103,68,'')+arrow(59,100,103,82,'');
      s+=box(105,40,115,56,'z = wx + b',{stroke:CY,size:12})+box(270,40,110,56,'a = σ(z)',{stroke:CY,size:12})+box(430,40,115,56,'L = (a − y)²',{stroke:MG,size:12});
      s+=arrow(220,68,268,68,'z')+arrow(380,68,428,68,'a');
      s+=line(487,96,487,140,{stroke:AM,dash:true})+arrow(487,140,328,140,'∂L/∂a = 2(a − y)',{stroke:AM,dash:true,color:AM});
      s+=line(325,96,325,140,{stroke:AM,dash:true})+arrow(322,140,166,140,'∂a/∂z = a(1 − a)',{stroke:AM,dash:true,color:AM});
      s+=line(162,96,162,140,{stroke:AM,dash:true})+elbow('M160 140 L37 140 L37 115',{stroke:AM,dash:true})+text(98,131,'∂z/∂w = x',{size:10,color:AM});
      s+=box(70,160,420,34,'∂L/∂w = 2(a − y) · a(1 − a) · x',{stroke:LM,size:12,bold:true});
      s+=text(280,210,'one factor per link, multiplied backward',{size:10,color:DIM});
      return s; })(),'Computation graph of one neuron with forward values and backward chain-rule factors')}]);
})();
