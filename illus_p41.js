/* Illustrations — Domain 41: Quantum Computing, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  /* small local helpers (colors only through the kit variables) */
  const f1=v=>Number(v).toFixed(1);
  const poly=(pts,o={})=>'<polyline points="'+pts.map(p=>f1(p[0])+','+f1(p[1])).join(' ')+'" fill="none" stroke="'+(o.stroke||'currentColor')+'" stroke-width="'+(o.sw||1.6)+'"'+(o.dash?' stroke-dasharray="5 4"':'')+'/>';
  const circ=(x,y,r,o={})=>'<circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="'+r+'" fill="'+(o.fill||'none')+'"'+(o.op!=null?' fill-opacity="'+o.op+'"':'')+' stroke="'+(o.stroke||'currentColor')+'" stroke-width="'+(o.sw||1.3)+'"'+(o.dash?' stroke-dasharray="4 3"':'')+'/>';
  const rect=(x,y,w,h,o={})=>'<rect x="'+f1(x)+'" y="'+f1(y)+'" width="'+f1(w)+'" height="'+f1(h)+'" rx="'+(o.rx||0)+'" fill="'+(o.fill||'none')+'"'+(o.op!=null?' fill-opacity="'+o.op+'"':'')+' stroke="'+(o.stroke||'none')+'" stroke-width="'+(o.sw||1.3)+'"'+(o.dash?' stroke-dasharray="5 4"':'')+'/>';
  const path=(d,o={})=>'<path d="'+d+'" fill="'+(o.fill||'none')+'"'+(o.op!=null?' fill-opacity="'+o.op+'"':'')+' stroke="'+(o.stroke||'currentColor')+'" stroke-width="'+(o.sw||1.3)+'"/>';

  /* ================= Module 1: qubits, amplitudes, interference ================= */
  const R=95,bx=150,by=125;
  const pr=(x,y,z)=>[bx+R*(-0.5*x+0.866*y), by-R*(-0.296*x-0.171*y+0.94*z)];
  const eq=Array.from({length:73},(_,i)=>{const a=i*5*Math.PI/180; return pr(Math.cos(a),Math.sin(a),0);});
  const P0=pr(0,0,1),P1=pr(0,0,-1),Pp=pr(1,0,0),Pm=pr(-1,0,0),Pi=pr(0,1,0),Pmi=pr(0,-1,0),Ps=pr(0,0.866,0.5),Pf=pr(0,0.866,0);
  I.p41m1=[{cap:"The Bloch sphere: every single-qubit state is a point on a unit sphere, |0⟩ at the north pole and |1⟩ at the south. The state shown (θ = 60°, φ = 90°) gives 0 with probability cos²(30°) = 0.75. Gates rotate the sphere; measurement projects onto a pole.",
    svg:svg(560,245,`${circ(bx,by,R)}${poly(eq,{stroke:DIM,sw:1.1,dash:true})}
      ${line(P1[0],P1[1],P0[0],P0[1],{stroke:DIM,dash:true})}${line(Pm[0],Pm[1],Pp[0],Pp[1],{stroke:DIM,dash:true})}${line(Pmi[0],Pmi[1],Pi[0],Pi[1],{stroke:DIM,dash:true})}
      ${circ(P0[0],P0[1],4,{fill:CY,stroke:CY})}${circ(P1[0],P1[1],4,{fill:MG,stroke:MG})}
      ${text(P0[0],P0[1]-14,'|0⟩',{bold:true,color:CY})}${text(P1[0],P1[1]+15,'|1⟩',{bold:true,color:MG})}
      ${text(Pp[0]-14,Pp[1]+14,'|+⟩',{size:11})}${text(Pm[0]-6,Pm[1]-12,'|−⟩',{size:11,color:DIM})}${text(Pi[0]+12,Pi[1]+12,'|+i⟩',{size:11,anchor:'start'})}${text(34,Pmi[1]-8,'|−i⟩',{size:11,color:DIM})}
      ${line(bx,by,Pf[0],Pf[1],{stroke:AM,dash:true})}${line(Pf[0],Pf[1],Ps[0],Ps[1],{stroke:AM,dash:true})}${arrow(bx,by,Ps[0],Ps[1],'',{stroke:AM,sw:2.2})}
      ${text(Ps[0]+16,Ps[1]-8,'|ψ⟩',{bold:true,color:AM})}${text(bx+12,by-46,'θ',{size:11,color:AM})}
      ${text(290,36,'|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ) sin(θ/2)|1⟩',{anchor:'start',size:11,bold:true})}
      ${text(290,64,'shown: θ = 60°, φ = 90°',{anchor:'start',size:11,color:AM})}
      ${text(290,88,'P(0) = cos²(30°) = 0.75',{anchor:'start',size:11})}${text(290,110,'P(1) = sin²(30°) = 0.25',{anchor:'start',size:11})}
      ${text(290,142,'north |0⟩ · south |1⟩',{anchor:'start',size:11,color:DIM})}${text(290,164,'|±⟩ on x · |±i⟩ on y',{anchor:'start',size:11,color:DIM})}
      ${text(290,186,'gates rotate the sphere',{anchor:'start',size:11,color:DIM})}${text(290,208,'one qubit only — no 2-qubit sphere',{anchor:'start',size:11,color:DIM})}`,'Bloch sphere with a state at theta 60 degrees')},
   {cap:"Interference, computed. One Hadamard splits |0⟩ into two amplitudes of +1/√2. A second Hadamard sends each branch to both outcomes: the two paths into |0⟩ add (½ + ½ = 1) while the two paths into |1⟩ cancel (½ − ½ = 0). Probabilities can only add; amplitudes can cancel.",
    svg:svg(560,235,`${box(10,92,72,46,'start\n|0⟩',{stroke:CY,size:12})}
      ${arrow(82,104,168,54,'H')}${arrow(82,126,168,178,'H')}
      ${box(170,30,112,46,'|0⟩\namp +1/√2',{size:11})}${box(170,156,112,46,'|1⟩\namp +1/√2',{size:11})}
      ${text(340,16,'second H',{size:11,color:DIM})}
      ${arrow(282,50,398,50,'+½')}${arrow(282,182,398,182,'−½',{stroke:MG,color:MG})}
      ${arrow(282,64,398,168,'')}${arrow(282,168,398,64,'')}
      ${text(298,92,'+½',{size:11,color:DIM})}${text(298,138,'+½',{size:11,color:DIM})}
      ${box(400,28,150,46,'|0⟩: ½ + ½ = 1',{stroke:LM,size:12,bold:true})}${box(400,158,150,46,'|1⟩: ½ − ½ = 0',{stroke:MG,size:12,bold:true})}
      ${text(280,224,'1,000 shots: 1,000 zeros (simulator)',{size:11,color:AM})}`,'Two Hadamards: amplitudes add for 0 and cancel for 1')}];

  /* ================= Module 2: the math ================= */
  const rows2=[['|00⟩','0','1/2',0.25],['|01⟩','1','1/2',0.25],['|10⟩','2','0',0],['|11⟩','3','1/√2',0.5]];
  I.p41m2=[{cap:"A two-qubit state is a list of four amplitudes, one per basis state, in Qiskit's little-endian order (qubit 0 is the right-hand bit). Squaring each amplitude gives the probabilities, which must sum to 1; ⟨ZZ⟩ weights agreeing bits +1 and disagreeing bits −1.",
    svg:svg(560,228,`${text(60,20,'basis |q₁q₀⟩',{bold:true,size:11})}${text(150,20,'index',{bold:true,size:11})}${text(225,20,'amplitude',{bold:true,size:11})}${text(400,20,'probability = |amp|²',{bold:true,size:11})}
      ${rows2.map((r,i)=>{const y=50+i*38; const w=r[3]*440; return text(60,y,r[0],{size:13,color:CY,bold:true})+text(150,y,r[1],{size:12})+text(225,y,r[2],{size:12,color:AM})+line(290,y+14,530,y+14,{stroke:DIM,sw:0.6})+(w>0?rect(290,y-11,w,22,{fill:CY,op:0.35,stroke:CY,rx:3}):'')+text(290+w+8,y,Math.round(r[3]*100)+'%',{size:11,anchor:'start'});}).join('')}
      ${text(140,208,'sum: ¼ + ¼ + 0 + ½ = 1',{size:11,color:LM})}${text(410,208,'⟨ZZ⟩ = +¼ − ¼ + ½ = 0.5',{size:11,color:LM})}`,'Amplitude and probability table for a two-qubit state')},
   {cap:"Why simulation hits a wall: an n-qubit statevector holds 2ⁿ complex amplitudes at 16 bytes each. Every ten extra qubits multiply memory by 1,024 — a 24 GB GPU holds 30 qubits, and 50 qubits would need 16 PiB.",
    svg:svg(560,230,`${text(280,18,'statevector memory = 2ⁿ × 16 bytes',{bold:true,size:12})}
      ${[[10,'16 KiB','trivial'],[20,'16 MiB','any laptop'],[30,'16 GiB','one 24 GB GPU'],[40,'16 TiB','a cluster'],[50,'16 PiB','']].map((r,i)=>{const y=48+i*34; const w=r[0]*8; const c=[LM,LM,CY,AM,MG][i]; return text(12,y,r[0]+' qubits',{anchor:'start',size:11})+rect(95,y-12,w,24,{fill:c,op:0.3,stroke:c,rx:3})+text(95+w-6,y,r[1],{anchor:'end',size:11,bold:true})+(r[2]?text(95+w+8,y,r[2],{anchor:'start',size:10,color:DIM}):'');}).join('')}
      ${text(280,218,'each +10 qubits = ×1,024 memory',{size:11,color:AM})}`,'Statevector memory growth with qubit count')}];

  /* ================= Module 3: gates and circuits ================= */
  const gates=[['X = [0 1 ; 1 0]\nbit flip · π about x',CY],['Z = [1 0 ; 0 −1]\nphase flip · π about z',CY],['H = (1/√2)[1 1 ; 1 −1]\n|0⟩→|+⟩ · |1⟩→|−⟩',AM],['S = diag(1, i)\nquarter turn · S² = Z',DIM],['T = diag(1, e^(iπ/4))\neighth turn · T² = S',MG],['CNOT, control q₀\n|01⟩→|11⟩ · |11⟩→|01⟩',LM]];
  I.p41m3=[{cap:"The gates you will type most, as matrices. Each single-qubit gate is a rotation of the Bloch sphere; T is the non-Clifford gate that makes circuits hard to simulate; CNOT flips its target when the control is 1 (ordering |q₁q₀⟩).",
    svg:svg(560,196,`${gates.map((g,i)=>box(10+(i%3)*183,10+Math.floor(i/3)*92,170,80,g[0],{stroke:g[1],size:14,lh:20})).join('')}`,'Gate matrices X, Z, H, S, T and CNOT')},
   {cap:"The Bell-state circuit read left to right: H puts qubit 0 in superposition, CNOT copies its value into qubit 1 branch by branch, and the result (|00⟩ + |11⟩)/√2 always measures 00 or 11, never 01 or 10.",
    svg:svg(560,225,`${text(30,70,'q₀',{bold:true})}${text(30,140,'q₁',{bold:true})}
      ${line(50,70,110,70)}${line(150,70,400,70)}${line(50,140,400,140)}${line(190,38,190,160,{stroke:DIM,dash:true})}${line(320,38,320,160,{stroke:DIM,dash:true})}${line(444,68,520,68,{stroke:DIM})}${line(444,72,520,72,{stroke:DIM})}${line(444,138,520,138,{stroke:DIM})}${line(444,142,520,142,{stroke:DIM})}
      ${box(110,52,40,36,'H',{stroke:AM,bold:true,size:14})}
      ${circ(230,70,5,{fill:'currentColor'})}${line(230,70,230,152)}${circ(230,140,12)}${line(218,140,242,140)}
      ${[52,122].map(y=>rect(400,y,44,36,{stroke:'currentColor',rx:5})+path('M408 '+(y+28)+' A14 14 0 0 1 436 '+(y+28))+line(422,y+28,433,y+10)).join('')}
      ${text(535,70,'c₀',{size:11,color:DIM})}${text(535,140,'c₁',{size:11,color:DIM})}
      ${text(80,182,'|00⟩',{size:11,color:DIM})}${text(190,182,'(|00⟩+|01⟩)/√2',{size:11,color:AM})}${text(320,182,'(|00⟩+|11⟩)/√2',{size:11,color:LM})}${text(470,182,'00 or 11 only',{size:11,color:LM})}
      ${text(280,214,'qc.h(0) · qc.cx(0, 1) · qc.measure_all()',{size:11,mono:true})}`,'Bell state circuit: H then CNOT then measure')}];

  /* ================= Module 4: algorithms ================= */
  const ox=200,oy=205,gr=150; const angs=[20.7,62.1,103.5,144.9], gcol=[DIM,AM,LM,MG];
  I.p41m4=[{cap:"Grover's algorithm as geometry for N = 8. The start state sits θ = 20.7° above the 'unmarked' axis; each iteration (oracle reflection, then diffusion reflection) rotates it 2θ toward the marked state |w⟩. Two iterations reach 94.5%; a third overshoots to 33.1%.",
    svg:svg(560,232,`${arrow(40,oy,372,oy,'')}${arrow(ox,oy+10,ox,34,'')}
      ${text(330,oy+16,'|s′⟩ unmarked',{size:11,color:DIM})}${text(ox+8,36,'|w⟩ marked',{size:11,color:LM,anchor:'start'})}
      ${angs.map((a,i)=>{const r=a*Math.PI/180; const x=ox+gr*Math.cos(r), y=oy-gr*Math.sin(r); const lx=ox+(gr+18)*Math.cos(r), ly=oy-(gr+14)*Math.sin(r); return arrow(ox,oy,x,y,'',{stroke:gcol[i],sw:2})+text(lx,ly,'k='+i,{size:11,bold:true,color:gcol[i]});}).join('')}
      ${text(470,34,'N = 8 · θ = 20.7°',{bold:true,size:12})}
      ${[['k=0: 12.5% (guess)',DIM],['k=1: 78.1%',AM],['k=2: 94.5% optimal',LM],['k=3: 33.1% overshoot',MG]].map((r,i)=>text(392,66+i*24,r[0],{anchor:'start',size:11,color:r[1]})).join('')}
      ${text(470,176,'P = sin²((2k+1)θ)',{size:11,bold:true})}${text(470,198,'each step turns 2θ',{size:11,color:DIM})}`,'Grover rotation geometry for eight items')},
   {cap:"The quantum Fourier transform on three qubits: a Hadamard on each qubit followed by controlled phase rotations from the qubits below it (R_k is a phase of 2π/2^k), then a swap to reverse the order — n(n−1)/2 controlled phases, O(n²) gates in all.",
    svg:svg(560,215,`${['q₂','q₁','q₀'].map((q,i)=>{const gx=[[90,160,230],[300,370],[440]][i]; let x0=44, w=''; gx.forEach(g=>{ w+=line(x0,50+i*55,g-18,50+i*55); x0=g+18; }); return text(26,50+i*55,q,{bold:true})+w+line(x0,50+i*55,520,50+i*55);}).join('')}
      ${[[90,0,'H',null],[160,0,'R₂',1],[230,0,'R₃',2],[300,1,'H',null],[370,1,'R₂',2],[440,2,'H',null]].map(g=>{const y=50+g[1]*55; let s=''; if(g[3]!=null){ const cy=50+g[3]*55; s+=line(g[0],y+15,g[0],cy)+circ(g[0],cy,5,{fill:'currentColor'}); } return s+box(g[0]-18,y-15,36,30,g[2],{stroke:g[2]==='H'?AM:CY,size:12,bold:true}); }).join('')}
      ${line(495,50,495,160,{stroke:MG})}${[50,160].map(y=>line(489,y-6,501,y+6,{stroke:MG,sw:2})+line(489,y+6,501,y-6,{stroke:MG,sw:2})).join('')}${text(495,186,'swap',{size:10,color:MG})}
      ${text(250,192,'3 H + 3 controlled phases + 1 swap',{size:11,color:DIM})}`,'Three-qubit quantum Fourier transform circuit')},
   {cap:"Shor's algorithm as a pipeline, worked for N = 15 with a = 7. Only the middle steps need the quantum computer (magenta); choosing a and the final gcd are classical (cyan). The powers 7, 4, 13, 1 repeat with period r = 4, and gcd(49 ± 1, 15) gives 3 and 5.",
    svg:flow([{t:'pick a = 7\n(N = 15)',stroke:CY},{t:'superpose\nall exponents x',stroke:MG},{t:'compute\n7ˣ mod 15',stroke:MG},{t:'QFT on the\nx register',stroke:MG},{t:'measure →\nperiod r = 4',stroke:MG},{t:'gcd(49 ± 1, 15)\n= 3 and 5',stroke:CY}],{bw:150,bh:54,gap:30,label:'Shor period-finding pipeline for N equals 15'})}];

  /* ================= Module 5: noise and error correction ================= */
  const tx=t=>60+t*0.8, py=p=>200-p*160;
  const curve=T=>Array.from({length:81},(_,i)=>{const t=i*5; return [tx(t),py(Math.exp(-t/T))];});
  const dq=(i,j)=>[100+70*j,50+70*i];
  const plaq=[[0,0,'X'],[0,1,'Z'],[1,0,'Z'],[1,1,'X']];
  I.p41m5=[{cap:"Decoherence as a clock. A qubit prepared in |1⟩ survives with probability e^(−t/T1): at 30 µs that is 0.86 for T1 = 200 µs (typical Heron r2) and 0.91 for T1 = 320 µs (Heron r3). Phase coherence, governed by T2 (dashed), is what interference needs.",
    svg:svg(560,232,`${line(60,200,385,200)}${line(60,200,60,32)}
      ${[0,100,200,300,400].map(t=>line(tx(t),200,tx(t),205)+text(tx(t),216,String(t),{size:10,color:DIM})).join('')}${text(222,228,'time (µs)',{size:10,color:DIM})}
      ${[[0,'0'],[0.5,'0.5'],[1,'1']].map(p=>text(52,py(p[0]),p[1],{size:10,anchor:'end',color:DIM})+line(56,py(p[0]),60,py(p[0]))).join('')}
      ${poly(curve(200),{stroke:CY,sw:2})}${poly(curve(320),{stroke:LM,sw:2})}${poly(curve(160),{stroke:MG,sw:1.6,dash:true})}
      ${line(tx(30),40,tx(30),200,{stroke:AM,dash:true})}${circ(tx(30),py(Math.exp(-30/200)),3.5,{fill:CY,stroke:CY})}${circ(tx(30),py(Math.exp(-30/320)),3.5,{fill:LM,stroke:LM})}${text(tx(30)+6,30,'30 µs',{size:10,color:AM,anchor:'start'})}
      ${rect(398,48,14,4,{fill:CY})}${text(418,50,'T1 = 200 µs (Heron r2)',{size:10,anchor:'start'})}
      ${rect(398,72,14,4,{fill:LM})}${text(418,74,'T1 = 320 µs (Heron r3)',{size:10,anchor:'start'})}
      ${line(398,98,412,98,{stroke:MG,dash:true})}${text(418,98,'T2 = 160 µs (phase)',{size:10,anchor:'start'})}
      ${text(398,132,'at 30 µs:',{size:11,anchor:'start',bold:true,color:AM})}${text(398,152,'0.86 vs 0.91 survive',{size:11,anchor:'start'})}
      ${text(398,180,'T2 ≤ 2·T1 always',{size:11,anchor:'start',color:DIM})}`,'T1 and T2 exponential decay curves')},
   {cap:"A distance-3 rotated surface code: 9 data qubits (dots) and 8 measure qubits, each checking the parity of its 2 or 4 neighbours in the X basis (cyan) or Z basis (magenta). That is 2d² − 1 = 17 qubits, correcting any single error; d = 5 needs 49 and d = 7 needs 97.",
    svg:svg(560,245,`${plaq.map(p=>{const a=dq(p[0],p[1]); const c=p[2]==='X'?CY:MG; return rect(a[0],a[1],70,70,{fill:c,op:0.16,stroke:c})+rect(a[0]+29,a[1]+29,12,12,{fill:c,stroke:c});}).join('')}
      ${path('M170 50 A35 35 0 0 1 240 50 Z',{fill:CY,op:0.16,stroke:CY})}${rect(199,25,12,12,{fill:CY,stroke:CY})}
      ${path('M100 190 A35 35 0 0 0 170 190 Z',{fill:CY,op:0.16,stroke:CY})}${rect(129,203,12,12,{fill:CY,stroke:CY})}
      ${path('M100 50 A35 35 0 0 0 100 120 Z',{fill:MG,op:0.16,stroke:MG})}${rect(75,79,12,12,{fill:MG,stroke:MG})}
      ${path('M240 120 A35 35 0 0 1 240 190 Z',{fill:MG,op:0.16,stroke:MG})}${rect(253,149,12,12,{fill:MG,stroke:MG})}
      ${[0,1,2].map(i=>[0,1,2].map(j=>{const a=dq(i,j); return circ(a[0],a[1],8,{fill:'currentColor'});}).join('')).join('')}
      ${circ(312,40,7,{fill:'currentColor'})}${text(326,40,'data qubit (9)',{anchor:'start',size:11})}
      ${rect(306,58,12,12,{fill:CY,stroke:CY})}${text(326,64,'X-parity check (4)',{anchor:'start',size:11})}
      ${rect(306,82,12,12,{fill:MG,stroke:MG})}${text(326,88,'Z-parity check (4)',{anchor:'start',size:11})}
      ${text(306,122,'d = 3: 2d² − 1 = 17 qubits',{anchor:'start',size:11,bold:true})}
      ${text(306,144,'corrects any 1 error',{anchor:'start',size:11,color:DIM})}
      ${text(306,166,'d = 5 → 49 · d = 7 → 97',{anchor:'start',size:11,color:DIM})}
      ${text(306,196,'p_L ≈ A·(p/p_th)^((d+1)/2)',{anchor:'start',size:11,color:AM})}`,'Distance-3 rotated surface code lattice')},
   {cap:"The overhead arithmetic on a log scale: physical qubits per logical qubit for a 10⁻¹² logical error. Gates ten times below threshold (Λ = 10) need d = 21 and 881 qubits; gates only twice below (Λ = 2) need d = 73 and 10,657. IBM's gross qLDPC code stores 12 logical qubits in 288, 24 each.",
    svg:svg(560,200,`${text(280,18,'physical qubits per logical qubit (log scale)',{bold:true,size:12})}
      ${[1,10,100,1000,10000].map((v,i)=>line(150+i*90,34,150+i*90,150,{stroke:DIM,sw:0.5,dash:true})+text(150+i*90,162,v.toLocaleString('en-US'),{size:10,color:DIM})).join('')}
      ${[['IBM gross code',24,LM,'24'],['surface, Λ = 10',881,CY,'881 (d = 21)'],['surface, Λ = 2',10657,MG,'10,657 (d = 73)']].map((r,i)=>{const y=52+i*34; const w=Math.log10(r[1])*90; return text(12,y,r[0],{anchor:'start',size:11})+rect(150,y-11,w,22,{fill:r[2],op:0.3,stroke:r[2],rx:3})+(150+w+8+r[3].length*6>552?text(150+w-6,y,r[3],{anchor:'end',size:10,bold:true}):text(150+w+6,y,r[3],{anchor:'start',size:10,bold:true}));}).join('')}
      ${text(280,186,'RSA-2048 ≈ 1,400 logical → ≈ 1.2 M qubits at Λ = 10',{size:11,color:AM})}`,'Physical qubits per logical qubit for three cases')}];

  /* ================= Module 6: real hardware ================= */
  const hx=k=>50+70*k;
  const topE=[0,1,2,3,4,5].map(k=>[hx(k)+13,60,hx(k+1)-13,60]), botE=[0,1,2,3,4,5].map(k=>[hx(k)+13,170,hx(k+1)-13,170]);
  const nodes=[0,1,2,3,4,5,6].map(k=>[hx(k),60,String(k)]).concat([[hx(0),115,'7'],[hx(4),115,'8']]).concat([0,1,2,3,4,5,6].map(k=>[hx(k),170,String(9+k)]));
  I.p41m6=[{cap:"A Qiskit pattern in four steps. You map the problem to circuits and observables, the transpiler optimizes them into an ISA circuit for one backend, a primitive executes them, and you post-process counts or expectation values against a prediction.",
    svg:flow([{t:'MAP\ncircuit, observable',stroke:CY},{t:'OPTIMIZE\ntranspile → ISA',stroke:AM},{t:'EXECUTE\nSampler · Estimator',stroke:MG},{t:'POST-PROCESS\ncounts · evs · stds',stroke:LM}],{bw:115,bh:58,gap:22,label:'Qiskit pattern: map, optimize, execute, post-process'})},
   {cap:"What generate_preset_pass_manager runs, stage by stage. Layout and routing decide which physical qubits you use and how many SWAPs you pay for; translation rewrites everything into the chip's native CZ, √X and RZ; scheduling leaves the idle windows that dynamical decoupling fills.",
    svg:flow([{t:'init\nunroll gates'},{t:'layout\npick qubits',stroke:CY},{t:'routing\ninsert SWAPs',stroke:MG},{t:'translation\nCZ · √X · RZ',stroke:AM},{t:'optimization\ncancel, resynthesize'},{t:'scheduling\ntiming, DD gaps',stroke:LM}],{bw:150,bh:54,gap:30,label:'Transpiler stages'})},
   {cap:"Routing on a heavy-hex coupling map. The circuit needs a CZ between physical qubits 1 and 4, three hops apart, so the transpiler swaps qubit 1's state to 2 and then 3 (two SWAPs = six extra CZs, about +1.2% error at 2 × 10⁻³ each) before the CZ can run.",
    svg:svg(560,232,`${topE.concat(botE).map(e=>line(e[0],e[1],e[2],e[3],{stroke:DIM})).join('')}
      ${[0,4].map(k=>line(hx(k),73,hx(k),102,{stroke:DIM})+line(hx(k),128,hx(k),157,{stroke:DIM})).join('')}
      ${line(hx(1)+13,60,hx(2)-13,60,{stroke:MG,sw:3})}${line(hx(2)+13,60,hx(3)-13,60,{stroke:MG,sw:3})}${line(hx(3)+13,60,hx(4)-13,60,{stroke:LM,sw:3})}
      ${text((hx(1)+hx(2))/2,40,'SWAP',{size:10,bold:true,color:MG})}${text((hx(2)+hx(3))/2,40,'SWAP',{size:10,bold:true,color:MG})}${text((hx(3)+hx(4))/2,40,'CZ',{size:10,bold:true,color:LM})}
      ${nodes.map(n=>{const hot=(n[2]==='1'||n[2]==='4'); return circ(n[0],n[1],13,{stroke:hot?AM:'currentColor',sw:hot?2.4:1.3})+text(n[0],n[1],n[2],{size:10,bold:hot,color:hot?AM:'currentColor'});}).join('')}
      ${text(280,204,'need CZ(1, 4): 3 hops → 2 SWAPs = 6 extra CZ',{size:11,color:AM})}
      ${text(280,222,'≈ 1 − 0.998⁶ ≈ 1.2% more failures per shot',{size:11,color:DIM})}`,'SWAP routing on a heavy-hex coupling map')}];

  /* ================= Module 7: quantum-safe security ================= */
  const bb=[['0','1','1','0','1','0','0','1'],['Z','X','Z','Z','X','X','Z','X'],['Z','Z','Z','X','X','Z','Z','X']];
  const match=bb[1].map((b,i)=>b===bb[2][i]);
  const yr=y=>60+(y-2026)*23;
  I.p41m7=[{cap:"BB84 on eight photons. Alice sends random bits in random bases (Z or X); Bob measures in random bases; they publicly compare bases and keep only the matching positions (green), here 1, 3, 5, 7 and 8, giving the sifted key 01101. An eavesdropper guessing bases corrupts about 25% of sifted bits.",
    svg:svg(560,222,`${match.map((m,i)=>m?rect(128+i*52,28,44,138,{stroke:LM,rx:6,fill:LM,op:0.08}):'').join('')}
      ${[0,1,2,3,4,5,6,7].map(i=>text(150+i*52,18,String(i+1),{size:10,color:DIM})).join('')}
      ${['Alice bit','Alice basis','Bob basis','bases match?','sifted key'].map((l,r)=>text(10,44+r*28,l,{anchor:'start',size:11,bold:r===4})).join('')}
      ${[0,1,2,3,4,5,6,7].map(i=>{const x=150+i*52; return text(x,44,bb[0][i],{size:12,color:AM})+text(x,72,bb[1][i],{size:12,color:CY})+text(x,100,bb[2][i],{size:12,color:MG})+text(x,128,match[i]?'yes':'no',{size:11,color:match[i]?LM:DIM})+text(x,156,match[i]?bb[0][i]:'·',{size:12,bold:true,color:match[i]?LM:DIM});}).join('')}
      ${text(280,190,'Eve: wrong basis ½ × Bob random ½ = 25% errors',{size:11,color:MG})}
      ${text(280,210,'abort above ≈ 11% QBER · then reconcile + hash',{size:11,color:DIM})}`,'BB84 sifting table for eight photons')},
   {cap:"Two answers to the quantum threat compared. QKD rests on physics but needs dedicated optics, an already-authenticated channel and trusted relays; post-quantum cryptography is software on today's networks, includes signatures, and is standardized and mandated.",
    svg:compare({t:'QKD (BB84 and successors)',draw:x=>['security: physics + hardware','needs pre-authenticated channel','dedicated fiber or satellite','≈ 100 km links, no amplifiers','trusted relays see the key','NSA: not for national systems'].map((l,i)=>text(x+130,54+i*24,l,{size:10.5})).join('')},{t:'POST-QUANTUM CRYPTOGRAPHY',draw:x=>['security: lattice and hash math','signatures included (ML-DSA)','software on existing networks','any distance, any device','FIPS 203 · 204 · 205 (2024)','mandated by CNSA 2.0'].map((l,i)=>text(x+130,54+i*24,l,{size:10.5,color:LM})).join('')},{h:200,label:'QKD versus post-quantum cryptography'})},
   {cap:"Mosca's inequality on a timeline. If the migration takes Y = 5 years and the data must then stay secret X = 10 more, protection is needed until 2041, while expert estimates put a cryptographically relevant machine in the 2030s (Z). X + Y > Z, so data encrypted today is exposed: start now, key exchange first.",
    svg:svg(560,200,`${line(60,150,520,150)}${[2026,2031,2036,2041,2046].map(y=>line(yr(y),146,yr(y),154)+text(yr(y),168,String(y),{size:10,color:DIM})).join('')}
      ${rect(yr(2030),30,yr(2039)-yr(2030),130,{fill:CY,op:0.08,stroke:CY,dash:true,rx:4})}${text((yr(2030)+yr(2039))/2,22,'Z: CRQC window (2030s)',{size:11,color:CY,bold:true})}
      ${rect(yr(2026),58,yr(2031)-yr(2026),26,{fill:AM,op:0.35,stroke:AM,rx:3})}${text((yr(2026)+yr(2031))/2,71,'Y = 5 years',{size:10,bold:true})}
      ${rect(yr(2031),98,yr(2041)-yr(2031),26,{fill:MG,op:0.35,stroke:MG,rx:3})}${text((yr(2031)+yr(2041))/2,111,'X: keep secret 10 yr',{size:10,bold:true})}
      ${text(yr(2041)+8,111,'→ 2041',{size:11,anchor:'start',color:MG})}
      ${text(280,190,'X + Y = 15 years > Z → recorded traffic is exposed',{size:11,color:AM})}`,'Mosca inequality timeline')}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
