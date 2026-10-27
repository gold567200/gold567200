/* Illustrations — Domain 9: Artificial Intelligence (upgrade, October 2026).
   Concatenates new figures onto the originals in illus_more.js; never replaces them. Numbers match the lecture's worked examples. */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const E=window.ILLUS||{}; const I={};
  const f1=v=>(+v).toFixed(1);
  const poly=(pts,o={})=>'<polyline points="'+pts.map(p=>f1(p[0])+','+f1(p[1])).join(' ')+'" fill="none" stroke="'+(o.stroke||'currentColor')+'" stroke-width="'+(o.sw==null?1.6:o.sw)+'"'+(o.dash?' stroke-dasharray="5 4"':'')+' stroke-linejoin="round"/>';
  const shade=(x,y,w,h,c,op)=>'<rect x="'+f1(x)+'" y="'+f1(y)+'" width="'+f1(Math.max(0,w))+'" height="'+f1(Math.max(0,h))+'" rx="2" fill="'+c+'" fill-opacity="'+(op==null?0.25:op)+'" stroke="none"/>';
  const rect=(x,y,w,h,c,o={})=>'<rect x="'+f1(x)+'" y="'+f1(y)+'" width="'+f1(Math.max(0,w))+'" height="'+f1(Math.max(0,h))+'" rx="'+(o.rx==null?2:o.rx)+'" fill="none" stroke="'+c+'" stroke-width="'+(o.sw||1.3)+'"'+(o.dash?' stroke-dasharray="5 4"':'')+'/>';
  const dot=(x,y,c,r)=>'<circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="'+(r||4)+'" fill="'+(c||CY)+'"/>';
  const circ=(x,y,r,c,o={})=>'<circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="'+f1(r)+'" fill="none" stroke="'+(c||'currentColor')+'" stroke-width="'+(o.sw||1.4)+'"'+(o.dash?' stroke-dasharray="4 3"':'')+'/>';
  const area=(pts,c,op)=>'<polygon points="'+pts.map(p=>f1(p[0])+','+f1(p[1])).join(' ')+'" fill="'+c+'" fill-opacity="'+(op==null?0.22:op)+'" stroke="none"/>';
  const axes=(x0,y0,x1,y1,xl,yl)=>arrow(x0,y0,x1,y0,'')+arrow(x0,y0,x0,y1,'')+(xl?text(x1,y0+14,xl,{size:10,color:DIM,anchor:'end'}):'')+(yl?text(x0+6,y1+2,yl,{size:10,color:DIM,anchor:'start'}):'');

  /* ================= Module 1: learning from data ================= */
  I.p9m1=(E.p9m1||[]).concat([
   {cap:"Least squares by hand on four cable jobs (1–4 km took 2, 3, 5, 6 hours). The fitted line ŷ = 1.4x + 0.5 leaves residuals of 0.1, −0.3, 0.3 and −0.1 hours (magenta), a mean squared error of 0.05 h². Read the parameters as physics: 0.5 h of setup plus 1.4 h per km.",
    svg:svg(560,230,(()=>{
      const X=x=>44+x*52, Y=y=>200-y*21; let s=axes(44,200,312,26,'km placed','hours');
      [1,2,3,4].forEach(k=>{ s+=line(X(k),200,X(k),204)+text(X(k),214,String(k),{size:10,color:DIM}); });
      [2,4,6,8].forEach(k=>{ s+=line(40,Y(k),44,Y(k))+text(36,Y(k),String(k),{size:10,color:DIM,anchor:'end'}); });
      s+=poly([[X(0.4),Y(1.4*0.4+0.5)],[X(4.8),Y(1.4*4.8+0.5)]],{stroke:CY,sw:2});
      [[1,2],[2,3],[3,5],[4,6]].forEach(([x,y])=>{ s+=dot(X(x),Y(y),AM,3.5)+line(X(x),Y(y),X(x),Y(1.4*x+0.5),{stroke:MG,sw:3}); });
      s+=text(X(4.6),Y(7.4),'ŷ = 1.4x + 0.5',{size:11,color:CY,bold:true,anchor:'end'});
      const rows=[['x̄ = 2.5,  ȳ = 4',null],['Σ(x−x̄)(y−ȳ) = 7',null],['Σ(x−x̄)² = 5',null],['w = 7 ÷ 5 = 1.4 h/km',CY],['b = 4 − 1.4 × 2.5 = 0.5 h',CY],['residuals 0.1, −0.3, 0.3, −0.1',MG],['MSE = 0.20 ÷ 4 = 0.05 h²',LM]];
      rows.forEach(([t,c],i)=>{ s+=text(336,40+i*25,t,{anchor:'start',size:11,color:c||'currentColor',bold:!!c}); });
      return s; })(),'Four data points, the least-squares line and the hand calculation of slope, intercept and error')},
   {cap:"The real run from the lecture, on a log scale. Training error (cyan) only falls as capacity grows, so it can never say when to stop; validation error (magenta) explodes to 558 for a degree-12 polynomial fitted to 15 points. Ridge regularization brings the same degree-12 model down to a 5-fold CV error of 0.037 (lime), right at the 0.04 noise floor.",
    svg:svg(560,232,(()=>{
      const Y=v=>196-(Math.log10(v)+2)*29; let s=line(52,196,548,196,{stroke:DIM})+line(52,196,52,38,{stroke:DIM});
      [[0.01,'0.01'],[0.1,'0.1'],[1,'1'],[10,'10'],[100,'100'],[1000,'1000']].forEach(([v,t])=>{ s+=line(48,Y(v),52,Y(v))+text(44,Y(v),t,{size:9,color:DIM,anchor:'end'}); });
      const bar=(x,v,c)=>shade(x,Y(v),34,196-Y(v),c,0.45)+rect(x,Y(v),34,196-Y(v),c)+text(x+17,Math.min(Y(v)-8,Y(0.04)-10),v<1?v.toFixed(3):v.toFixed(1),{size:10,color:c});
      const g=[['degree 1',0.099,0.517],['degree 3',0.027,0.155],['degree 12',0.020,558.5]];
      g.forEach(([lab,tr,va],i)=>{ const x=80+i*118; s+=bar(x,tr,CY)+bar(x+40,va,MG)+text(x+37,212,lab,{size:10}); });
      s+=bar(420,0.037,LM)+text(437,212,'degree 12 + ridge',{size:10});
      s+=line(52,Y(0.04),548,Y(0.04),{stroke:AM,dash:true})+text(548,Y(0.04)+12,'noise floor 0.04',{size:10,color:AM,anchor:'end'});
      s+=text(60,24,'train',{size:10,color:CY,anchor:'start',bold:true})+text(100,24,'validation',{size:10,color:MG,anchor:'start',bold:true})+text(170,24,'5-fold CV',{size:10,color:LM,anchor:'start',bold:true})+text(548,24,'MSE, log scale',{size:10,color:DIM,anchor:'end'});
      return s; })(),'Bar chart of training and validation error for three model sizes and a regularized model')},
   {cap:"Five-fold cross-validation on 2,000 examples: each of the five runs trains on four folds (1,600 rows) and validates on the fifth (400 rows), so every example is validated exactly once. Average the five scores; keep a separate test set sealed for the end.",
    svg:svg(560,214,(()=>{
      let s=text(280,14,'5-fold cross-validation',{bold:true,color:CY});
      for(let r=0;r<5;r++){ const y=28+r*30; s+=text(56,y+12,'run '+(r+1),{size:10,color:DIM,anchor:'end'});
        for(let c=0;c<5;c++){ const v=c===r; s+=(v?shade(64+c*70,y,64,24,MG,0.35):shade(64+c*70,y,64,24,CY,0.12))+rect(64+c*70,y,64,24,v?MG:CY)+text(96+c*70,y+12,v?'validate':'train',{size:10,color:v?MG:'currentColor',bold:v}); }
        s+=text(420,y+12,'score '+(r+1),{size:10,color:AM,anchor:'start'}); }
      s+=line(480,40,480,160,{stroke:AM})+arrow(480,100,506,100,'')+text(510,94,'average',{size:10,color:AM,anchor:'start'})+text(510,108,'5 scores',{size:10,color:AM,anchor:'start'});
      s+=text(280,190,'each run: 1,600 train / 400 validate',{size:11,color:DIM})+text(280,206,'test set: opened once, at the end',{size:11,color:LM});
      return s; })(),'Grid of five runs with a different validation fold in each')}
  ]);

  /* ================= Module 2: neural networks ================= */
  I.p9m2=(E.p9m2||[]).concat([
   {cap:"Why one neuron cannot do XOR, and how a hidden layer fixes it. Left: the two classes sit on opposite corners, so no straight line separates them. Right: after h1 = ReLU(x1 + x2) and h2 = ReLU(x1 + x2 − 1), the inputs land at (0,0), (1,0) twice and (2,1), and one straight line does the job.",
    svg:compare({t:'INPUT SPACE (x1, x2)',draw:o=>{ const X=v=>o+76+v*120, Y=v=>150-v*86; let s=axes(o+40,160,o+232,42,'x1','x2');
        [[0,0,CY],[1,1,CY],[0,1,MG],[1,0,MG]].forEach(([a,b,c])=>{ s+=dot(X(a),Y(b),c,7)+text(X(a),Y(b)+(b?18:16),'('+a+','+b+')',{size:10,color:c}); });
        s+=line(o+60,104,o+226,104,{stroke:DIM,dash:true})+line(o+136,152,o+136,50,{stroke:DIM,dash:true});
        s+=text(o+130,184,'no single line separates',{size:11,color:AM}); return s; }},
      {t:'HIDDEN SPACE (h1, h2)',draw:o=>{ const X=v=>o+52+v*84, Y=v=>150-v*86; let s=axes(o+40,160,o+246,42,'h1','h2');
        s+=dot(X(0),Y(0),CY,7)+text(X(0)+4,Y(0)-14,'(0,0)',{size:10,color:CY,anchor:'start'});
        s+=dot(X(1),Y(0),MG,7)+text(X(1),Y(0)+24,'(1,0) ×2',{size:10,color:MG});
        s+=dot(X(2),Y(1),CY,7)+text(X(2)-10,Y(1)+2,'(2,1)',{size:10,color:CY,anchor:'end'});
        s+=line(X(0.32),Y(-0.09),X(2.38),Y(0.94),{stroke:LM,sw:2});
        s+=text(o+130,184,'one line now works',{size:11,color:LM}); return s; }},{h:200,label:'XOR points in input space and in the hidden layer\'s space'})},
   {cap:"The lecture's 2-2-1 forward pass with every number shown. Weights label the edges; each hidden neuron adds its bias and applies ReLU. The second hidden unit's pre-activation is −0.05, so ReLU switches it off, and the output is σ(0.41) = 0.601.",
    svg:svg(560,224,(()=>{
      let s='';
      const node=(x,y,t,c,sub)=>circ(x,y,28,c||'currentColor')+text(x,y-(sub?6:0),t,{size:11,bold:true,color:c||'currentColor'})+(sub?text(x,y+10,sub,{size:9,color:DIM}):'');
      s+=line(88,70,222,70)+line(88,170,222,170)+line(84,86,226,154)+line(84,154,226,86)+line(278,74,402,112)+line(278,166,402,128,{dash:true,stroke:DIM});
      s+=node(60,70,'x1 = 0.5',null)+node(60,170,'x2 = −1',null);
      s+=node(250,70,'h1 = 0.6',CY,'z = 0.6')+node(250,170,'h2 = 0',DIM,'z = −0.05');
      s+=node(430,120,'z = 0.41',AM,'b = 0.05');
      s+=text(150,60,'0.2',{size:10,color:CY})+text(150,184,'0.1',{size:10,color:CY})+text(122,92,'0.7',{size:10,color:CY})+text(122,150,'−0.4',{size:10,color:CY});
      s+=text(340,82,'0.6',{size:10,color:AM})+text(340,160,'−0.9',{size:10,color:AM});
      s+=arrow(458,120,500,120,'')+text(530,112,'σ(0.41)',{size:10,color:DIM})+text(530,130,'0.601',{size:12,color:LM,bold:true});
      s+=text(250,214,'hidden biases (0.1, −0.3) · ReLU',{size:10,color:DIM});
      return s; })(),'A two-input, two-hidden, one-output network with weights, pre-activations and outputs')},
   {cap:"Four activation functions on the same scale (z from −4 to 4). ReLU has slope 1 wherever it is on, so gradients pass through deep stacks; the sigmoid's slope never exceeds 0.25, which is why ten stacked sigmoids shrink a gradient by up to a million times.",
    svg:svg(560,176,(()=>{
      let s=''; const fns=[['ReLU',z=>Math.max(0,z),'slope 0 or 1',CY],['sigmoid',z=>1/(1+Math.exp(-z)),'slope ≤ 0.25',MG],['tanh',z=>Math.tanh(z),'slope ≤ 1',AM],['GELU',z=>0.5*z*(1+Math.tanh(0.7978845608*(z+0.044715*z*z*z))),'smooth (GPT, BERT)',LM]];
      fns.forEach(([n,f,note,c],i)=>{ const x0=8+i*138, X=z=>x0+8+(z+4)/8*118, Y=y=>96-y*40;
        s+=rect(x0,24,134,122,DIM,{rx:6})+text(x0+67,14,n,{size:11,bold:true,color:c});
        s+=line(x0+8,Y(0),x0+126,Y(0),{stroke:DIM})+line(X(0),30,X(0),142,{stroke:DIM});
        const pts=[]; for(let k=0;k<=80;k++){ const z=-4+8*k/80, y=f(z); if(y<=1.25&&y>=-1.25) pts.push([X(z),Y(y)]); }
        s+=poly(pts,{stroke:c,sw:2}); s+=text(x0+67,162,note,{size:10,color:DIM}); });
      return s; })(),'Plots of ReLU, sigmoid, tanh and GELU with their slope limits')}
  ]);

  /* ================= Module 3: training ================= */
  I.p9m3=(E.p9m3||[]).concat([
   {cap:"Gradient descent on the cable-job data, recomputed in your browser: loss against step for four learning rates, log scale. η = 0.05 reaches the minimum (0.05) in about four steps, η = 0.01 crawls, and anything above the stability limit 2/λmax = 0.1198 grows — slowly at 0.12, explosively at 0.15.",
    svg:svg(560,236,(()=>{
      const xs=[1,2,3,4], ys=[2,3,5,6]; const run=lr=>{ let w=0,b=0; const L=[]; for(let t=0;t<=24;t++){ let l=0,gw=0,gb=0; for(let i=0;i<4;i++){ const e=w*xs[i]+b-ys[i]; l+=e*e/4; gw+=2*e*xs[i]/4; gb+=2*e/4; } L.push(l); w-=lr*gw; b-=lr*gb; } return L; };
      const X=t=>56+t*19, Y=v=>196-(Math.log10(Math.max(v,0.01))+2)*26; let s=axes(56,196,536,30,'step','loss (log)');
      [[0.01,'0.01'],[1,'1'],[100,'100'],[10000,'10⁴']].forEach(([v,t])=>{ s+=line(52,Y(v),56,Y(v))+text(48,Y(v),t,{size:9,color:DIM,anchor:'end'}); });
      [0,5,10,15,20].forEach(t=>{ s+=text(X(t),208,String(t),{size:9,color:DIM}); });
      const cfg=[[0.01,AM,'η 0.01'],[0.05,LM,'η 0.05'],[0.12,MG,'η 0.12'],[0.15,CY,'η 0.15']];
      cfg.forEach(([lr,c,lab],k)=>{ const L=run(lr); const pts=[]; for(let t=0;t<L.length;t++){ if(L[t]>10000){ pts.push([X(t),Y(10000)]); break; } pts.push([X(t),Y(L[t])]); } s+=poly(pts,{stroke:c,sw:2});
      });
      s+=text(300,228,'η 0.01',{size:10,color:AM,bold:true,anchor:'start'})+text(360,228,'η 0.05',{size:10,color:LM,bold:true,anchor:'start'})+text(420,228,'η 0.12',{size:10,color:MG,bold:true,anchor:'start'})+text(480,228,'η 0.15',{size:10,color:CY,bold:true,anchor:'start'});
      s+=line(56,Y(0.05),536,Y(0.05),{stroke:DIM,dash:true})+text(534,Y(0.05)-8,'minimum 0.05',{size:9,color:DIM,anchor:'end'});
      s+=text(320,14,'stable only if η < 2/16.70 = 0.1198',{size:11,color:AM,bold:true});
      return s; })(),'Loss curves for four learning rates, two converging and two diverging')},
   {cap:"Backpropagation on the lecture's tiny network. Forward values (cyan) flow right; gradients (magenta) flow left, each one the incoming gradient times a local derivative. The chain ends in ∂L/∂w1 = 0.275 × 1.5 = 0.412 — the same number the numerical check and PyTorch's autograd give.",
    svg:svg(560,214,(()=>{
      let s=''; const labs=['z1 = w1·x + b1','h = ReLU(z1)','z2 = w2·h + b2','p = σ(z2)','L = −ln p'];
      const fw=['x = 1.5','1.0','1.0','−0.2','0.450','0.798']; const bw=['0.275','0.275','−0.550','−0.550','1'];
      labs.forEach((t,i)=>{ const x=8+i*111; s+=box(x,78,96,40,t,{size:10,stroke:i===4?AM:'currentColor'}); });
      for(let i=0;i<4;i++){ const x=104+i*111; s+=arrow(x,90,x+15,90,''); s+=arrow(x+15,108,x,108,'',{stroke:MG}); }
      ['1.0','1.0','−0.2','0.450'].forEach((v,i)=>{ s+=text(111+i*111,68,v,{size:10,color:CY,bold:true}); });
      ['0.275','0.275','−0.550','−2.22'].forEach((v,i)=>{ s+=text(111+i*111,132,v,{size:10,color:MG,bold:true}); });
      s+=text(56,60,'w1 0.8 · b1 −0.2',{size:10,color:DIM})+text(278,60,'w2 −0.5 · b2 0.3',{size:10,color:DIM})+text(500,60,'L = 0.798',{size:10,color:AM,bold:true});
      s+=text(280,22,'forward: values →',{size:11,color:CY,bold:true})+text(280,152,'← backward: ∂L/∂(each value)',{size:11,color:MG,bold:true});
      s+=text(140,180,'∂L/∂w2 = −0.550 × h (1.0) = −0.550',{size:10,color:MG})+text(420,180,'∂L/∂w1 = 0.275 × x (1.5) = 0.412',{size:10,color:MG});
      s+=text(280,202,'one step at η = 0.1: loss 0.798 → 0.719',{size:10,color:LM});
      return s; })(),'Computational graph with forward values and backward gradients')},
   {cap:"One training step, repeated thousands of times: draw a mini-batch, run the forward pass, compute the loss, backpropagate, let the optimizer (Adam) update the weights, and clear the gradients before the next batch. 800 examples at batch 32 is 25 steps per epoch.",
    svg:cycle([{t:'mini-batch\nof 32',stroke:CY},{t:'forward\npass'},{t:'loss\n(cross-entropy)',stroke:AM},{t:'backward\n(autograd)',stroke:MG},{t:'Adam\nstep'},{t:'zero the\ngradients',stroke:LM}],{r:100,label:'Six-step training loop'})}
  ]);

  /* ================= Module 4: transformers ================= */
  I.p9m4=(E.p9m4||[]).concat([
   {cap:"The lecture's attention weights for three tokens. Each row is one token's query, softmaxed over every key, so rows sum to 1 (darker = more weight). Right: the causal mask blanks the upper triangle, so 'the' can only see itself and 'cat' splits evenly between 'the' and itself.",
    svg:compare({t:'FULL ATTENTION',draw:o=>{ const W=[[0.401,0.198,0.401],[0.164,0.164,0.673],[0.178,0.088,0.734]]; return grid(o,W,false); }},
      {t:'CAUSAL MASK',draw:o=>{ const W=[[1,0,0],[0.5,0.5,0],[0.178,0.088,0.734]]; return grid(o,W,true); }},{h:208,label:'Three-by-three attention weight grids with and without a causal mask'})},
   {cap:"A GPT-style decoder, bottom to top. Tokens become embeddings plus position information; each of N identical blocks adds an attention result and then an MLP result to a running residual stream; a final projection and softmax give next-token probabilities. Parameter counts are for GPT-2 small (d = 768, N = 12, ≈ 124 M in total).",
    svg:stack([{t:'softmax → next-token probabilities',stroke:LM,side:'50,257 outputs'},{t:'final LayerNorm + output projection',side:'tied to embeddings'},{t:'x + MLP(LayerNorm(x))',stroke:AM,side:'8d² ≈ 4.7 M per block'},{t:'x + Attention(LayerNorm(x))',stroke:MG,side:'4d² ≈ 2.4 M per block'},{t:'repeat the block N = 12 times',stroke:DIM,side:'12 × 7.1 M ≈ 85 M'},{t:'token embeddings + positions',stroke:CY,side:'50,257 × 768 ≈ 38.6 M'},{t:'tokens: "The", " cat", " sat"',side:'BPE token IDs'}],{w:300,h:32,gap:7,side:true,label:'Layer stack of a decoder-only transformer with parameter counts'})},
   {cap:"A convolution slides one 3 × 3 filter over the input; each position's dot product becomes one output value. A 5 × 5 input with no padding and stride 1 gives a (5 − 3 + 0)/1 + 1 = 3-wide output. The same nine weights are reused at every position — that sharing is why a 64→128-channel 3 × 3 layer needs only 73,856 parameters.",
    svg:svg(560,210,(()=>{
      let s=text(140,12,'input 5 × 5',{size:11,bold:true,color:CY})+text(413,12,'output 3 × 3',{size:11,bold:true,color:LM});
      for(let r=0;r<5;r++) for(let c=0;c<5;c++){ const hi=r>=1&&r<=3&&c>=2&&c<=4; s+=(hi?shade(60+c*32,24+r*32,30,30,MG,0.3):'')+rect(60+c*32,24+r*32,30,30,hi?MG:DIM); }
      s+=rect(123,55,97,97,MG,{sw:2.4})+text(140,198,'3 × 3 filter (9 weights)',{size:10,color:MG});
      for(let r=0;r<3;r++) for(let c=0;c<3;c++){ const hi=r===1&&c===2; s+=(hi?shade(362+c*34,60+r*34,32,32,LM,0.45):'')+rect(362+c*34,60+r*34,32,32,hi?LM:DIM); }
      s+=arrow(226,108,354,108,'dot product',{color:MG});
      s+=text(413,178,'(W − K + 2P)/S + 1 = 3',{size:10,color:AM});
      s+=text(413,198,'64→128 ch, 3×3: 73,856 params',{size:10,color:DIM});
      return s; })(),'A three by three filter over a five by five input producing a three by three output')}
  ]);
  function grid(o,W,mask){ const names=['the','cat','sat']; let s='';
    names.forEach((n,i)=>{ s+=text(o+56,62+i*40,n,{size:10,anchor:'end',color:DIM})+text(o+86+i*56,40,n,{size:10,color:DIM}); });
    W.forEach((row,r)=>row.forEach((v,c)=>{ const x=o+60+c*56, y=50+r*40; const blank=mask&&c>r;
      s+=(blank?shade(x,y,52,34,DIM,0.12):shade(x,y,52,34,CY,0.1+0.75*v))+rect(x,y,52,34,blank?DIM:CY,{dash:blank})+text(x+26,y+17,blank?'−∞':v.toFixed(3),{size:10,bold:!blank,color:blank?DIM:'currentColor'}); }));
    s+=text(o+144,184,mask?'row 1 sees only itself':'row 1 → output (0.599, 0.802)',{size:10,color:mask?MG:LM});
    return s; }

  /* ================= Module 5: LLMs ================= */
  /* Repair, not replacement: the original pipeline figure was 612 units wide with edge labels sitting on box borders.
     Same boxes, labels and caption, re-laid out in two rows so it fits the 560-unit phone limit. */
  const relayout=(arr,i,svgNew)=>{ arr=(arr||[]).slice(); if(arr[i]&&arr[i].svg) arr[i]=Object.assign({},arr[i],{svg:svgNew}); return arr; };
  I.p9m5=relayout(E.p9m5,0,flow([{t:'pretraining\n(internet-scale text)',stroke:CY},{t:'instruction\nfine-tuning',edge:'base model'},{t:'RLHF\n(human prefs)',stroke:AM,edge:''},{t:'inference:\nnext token ↺',stroke:MG,edge:'assistant'}],{perRow:2,bw:150,bh:56,gap:110,label:'LLM training pipeline and inference'})).concat([
   {cap:"Temperature reshapes the same four logits (Paris 4.0, Lyon 2.0, 'the' 1.0, Berlin 0.5) for 'The capital of France is'. At T = 0.5 Paris takes 97.9%; at T = 2 Berlin is sampled almost one time in ten. Top-p = 0.9 at T = 1 would keep only Paris and Lyon.",
    svg:svg(560,214,(()=>{
      const P=[['0.5',[0.979,0.018,0.002,0.001]],['1',[0.823,0.111,0.041,0.025]],['2',[0.567,0.208,0.126,0.098]]]; const toks=['Paris','Lyon','the','Berlin']; const cols=[LM,CY,AM,MG];
      let s=''; P.forEach(([T,probs],g)=>{ const x0=16+g*184; s+=text(x0+80,16,'T = '+T,{size:12,bold:true,color:g===1?CY:'currentColor'})+line(x0,170,x0+164,170,{stroke:DIM});
        probs.forEach((p,k)=>{ const x=x0+6+k*40, h=p*130; s+=shade(x,170-h,30,h,cols[k],0.5)+rect(x,170-h,30,h,cols[k])+text(x+15,170-h-8,(p*100).toFixed(1)+'%',{size:9,color:cols[k]})+text(x+15,184,toks[k],{size:9,color:DIM}); }); });
      s+=text(280,206,'p = softmax(logits ÷ T)',{size:11,color:DIM});
      return s; })(),'Bar charts of next-token probabilities at three temperatures')},
   {cap:"Two phases of inference. Prefill pushes the whole prompt through the model in one parallel pass (compute-bound, sets time to first token). Decode then adds one token per step, reading all the weights each time (bandwidth-bound) and appending that token's keys and values to the KV cache — 128 KiB per token for a Llama-3.1-8B shape, 16 GiB at 128K tokens.",
    svg:compare({t:'PREFILL: PROMPT IN PARALLEL',draw:o=>{ let s=''; ['The','capital','of','France','is'].forEach((w,i)=>{ s+=box(o+14+i*48,46,44,26,w,{size:9,stroke:CY}); s+=arrow(o+36+i*48,74,o+36+i*48,100,''); });
        s+=box(o+14,102,236,36,'one big matrix multiply',{size:11,stroke:AM}); s+=text(o+132,158,'compute-bound',{size:11,color:AM,bold:true})+text(o+132,176,'sets time to first token',{size:10,color:DIM}); return s; }},
      {t:'DECODE: ONE TOKEN PER STEP',draw:o=>{ let s=''; ['Paris','.','It','is'].forEach((w,i)=>{ const y=44+i*30; s+=box(o+14,y,56,24,w,{size:10,stroke:MG})+arrow(o+72,y+12,o+94,y+12,'');
          s+=shade(o+98,y+3,24+i*22,18,LM,0.35)+rect(o+98,y+3,24+i*22,18,LM)+text(o+104+24+i*22,y+12,(6+i)+' tokens',{size:9,color:DIM,anchor:'start'}); });
        s+=text(o+132,176,'KV cache grows 128 KiB per token',{size:10,color:LM}); return s; }},{h:196,label:'Prefill processes the prompt at once; decode generates token by token while the KV cache grows'})},
   {cap:"From base model to assistant. Pretraining on trillions of tokens builds the knowledge; supervised fine-tuning teaches the chat format; preference pairs train a reward model; reinforcement learning (PPO) raises reward while a KL penalty keeps the model close to its SFT version. DPO folds the last three boxes into one supervised-style step.",
    svg:flow([{t:'pretraining\n15T+ tokens',stroke:CY},{t:'SFT: prompt →\nideal answer',edge:'base'},{t:'humans pick\nA or B',stroke:AM,edge:'samples'},{t:'reward model\nσ(rA − rB)',stroke:AM,edge:'pairs'},{t:'PPO + KL\npenalty',stroke:MG,edge:'scores'},{t:'assistant\nmodel',stroke:LM,edge:''}],{perRow:3,bw:122,bh:52,gap:70,label:'Pretraining, supervised fine-tuning and RLHF pipeline'})}
  ]);

  /* ================= Module 6: GPUs ================= */
  /* Repair, not replacement: the original CUDA figure's bottom code label is wider than its dashed device box at phone width;
     shorten only that label (the lecture text carries the full sentence about warps running in lockstep). */
  const fixText=(arr,i,from,to)=>{ arr=(arr||[]).slice(); if(arr[i]&&arr[i].svg&&arr[i].svg.indexOf(from)>=0) arr[i]=Object.assign({},arr[i],{svg:arr[i].svg.replace(from,to)}); return arr; };
  I.p9m6=fixText(E.p9m6,0,'(a,b,c)  ·  warps of 32 run in lockstep','(a,b,c)  ·  warps of 32').concat([
   {cap:"The roofline (log–log): attainable speed is the lower of the compute roof and arithmetic intensity × memory bandwidth. A vector add (0.083 FLOP/byte) and batch-1 LLM decode (≈ 1) sit on the bandwidth slope; a 4,096-square FP16 matrix multiply (≈ 1,365) sits under the flat compute roof. The roof height and ridge here are schematic.",
    svg:svg(560,238,(()=>{
      const X=a=>60+(Math.log10(a)+2)*80, Y=v=>200-v; let s=axes(60,200,548,24,'','FLOP/s (log)')+text(548,228,'FLOP per byte (log)',{size:10,color:DIM,anchor:'end'});
      [[0.01,'0.01'],[0.1,'0.1'],[1,'1'],[10,'10'],[100,'100'],[1000,'1000']].forEach(([a,t])=>{ s+=line(X(a),200,X(a),204)+text(X(a),214,t,{size:9,color:DIM}); });
      const ridge=100, roof=160; const slope=a=>roof-(Math.log10(ridge)-Math.log10(a))*30;
      s+=poly([[X(0.01),Y(slope(0.01))],[X(ridge),Y(roof)],[X(5000),Y(roof)]],{stroke:CY,sw:2.4});
      s+=text(84,62,'slope = bandwidth',{size:10,color:CY,anchor:'start'})+text(544,28,'compute roof',{size:10,color:CY,anchor:'end'});
      s+=line(X(ridge),Y(roof),X(ridge),200,{stroke:DIM,dash:true})+text(X(ridge)+4,192,'ridge',{size:9,color:DIM,anchor:'start'});
      const pt=(a,lab,c,dy)=>{ const v=a<ridge?slope(a):roof; return '<circle cx="'+f1(X(a))+'" cy="'+f1(Y(v))+'" r="6" fill="'+c+'"/>'+text(X(a),Y(v)+dy,lab,{size:10,color:c,bold:true}); };
      s+=pt(0.083,'vector add',MG,18)+pt(1,'LLM decode',AM,18)+pt(1365,'big matmul',LM,18);
      s+=text(250,160,'memory-bound',{size:11,color:MG})+text(471,104,'compute-bound',{size:11,color:LM});
      return s; })(),'Roofline chart with vector add, LLM decode and matrix multiply placed on it')},
   {cap:"Bytes per parameter decide what fits. Serving in BF16 needs 2 bytes per parameter and 4-bit quantization about 0.5; full training with mixed-precision Adam needs about 16 (BF16 weights and gradients, plus an FP32 master copy and two FP32 Adam moments) before activations. A 7B model: 3.5 GB, 14 GB, or 112 GB.",
    svg:svg(560,206,(()=>{
      const S=22; let s=text(280,14,'bytes per parameter',{bold:true,color:CY});
      const seg=(x,y,w,c,t)=>shade(x,y,w,30,c,0.4)+rect(x,y,w,30,c)+(t?text(x+w/2,y+15,t,{size:10,bold:true}):'');
      let y=30; s+=text(120,y+15,'train (Adam)',{size:11,anchor:'end',bold:true}); let x=128; [[2,CY,'2'],[2,MG,'2'],[4,AM,'4'],[4,LM,'4'],[4,LM,'4']].forEach(([b,c,t])=>{ s+=seg(x,y,b*S,c,t); x+=b*S; }); s+=text(x+6,y+15,'16 B',{size:11,anchor:'start',bold:true,color:AM});
      s+=text(304,72,'BF16 weights · grads · FP32 master · Adam m · Adam v',{size:9,color:DIM});
      y=90; s+=text(120,y+15,'serve BF16',{size:11,anchor:'end',bold:true})+seg(128,y,2*S,CY,'')+text(128+2*S+6,y+15,'2 B',{size:11,anchor:'start',bold:true,color:CY});
      y=138; s+=text(120,y+15,'serve 4-bit',{size:11,anchor:'end',bold:true})+seg(128,y,0.5*S,CY,'')+text(128+0.5*S+6,y+15,'0.5 B',{size:11,anchor:'start',bold:true,color:CY});
      s+=text(280,190,'7B model: 112 GB to train · 14 GB BF16 · 3.5 GB 4-bit',{size:10,color:DIM});
      return s; })(),'Stacked bars of memory per parameter for training and two kinds of inference')},
   {cap:"Single-user generation speed is capped by bandwidth ÷ bytes read per token. On the RTX 5090 Laptop GPU (24 GB, 896 GB/s) a 4-bit 8B model tops out near 183 tokens/s and a 32B near 50; a 4-bit 70B (≈ 40 GB) does not fit at all, while an M5 Ultra (1.2 TB/s, up to 512 GB) runs it at up to 30 tokens/s. Real runtimes reach roughly 60–85% of these ceilings.",
    svg:svg(560,200,(()=>{
      let s=text(280,14,'decode ceiling = bandwidth ÷ model bytes',{bold:true,color:CY}); const S=1.2;
      const rows=[['5090 laptop · 8B 4-bit',183,LM,'896 ÷ 4.9 ≈ 183 tok/s'],['5090 laptop · 32B 4-bit',50,CY,'896 ÷ 18 ≈ 50 tok/s'],['M5 Ultra · 70B 4-bit',30,AM,'1,200 ÷ 40 = 30 tok/s'],['5090 laptop · 70B 4-bit',0,MG,'40 GB > 24 GB: does not fit']];
      rows.forEach(([lab,v,c,note],i)=>{ const y=32+i*38; s+=text(170,y+13,lab,{size:10,anchor:'end',bold:true});
        if(v){ s+=shade(178,y,v*S,26,c,0.45)+rect(178,y,v*S,26,c); } else s+=rect(178,y,40,26,MG,{dash:true})+text(198,y+13,'✗',{size:12,color:MG,bold:true});
        s+=text(178+Math.max(v*S,40)+8,y+13,note,{size:10,anchor:'start',color:c}); });
      s+=text(280,190,'batching many users raises intensity and throughput',{size:10,color:DIM});
      return s; })(),'Horizontal bars of decode-speed ceilings for several model and hardware combinations')}
  ]);

  /* ================= Module 7: using AI well ================= */
  /* Repair: the original RAG flow's 22-unit gaps put its edge labels on the box borders; same items, wider gaps. */
  I.p9m7=relayout(E.p9m7,0,flow([{t:'your docs',stroke:DIM},{t:'embeddings\n(vectors)',edge:'embed'},{t:'vector\nsearch',stroke:AM,edge:'question'},{t:'top chunks\n+ question',edge:'nearest'},{t:'LLM',stroke:CY,edge:'prompt'},{t:'grounded\nanswer + cites',stroke:LM,edge:''}],{perRow:3,bw:120,bh:52,gap:70,label:'RAG pipeline'})).concat([
   {cap:"Cosine similarity measures the angle between embeddings, not their length. The lecture's vectors a = (0.9, 0.1, 0.3) and b = (0.8, 0.2, 0.4) point almost the same way (cosine 0.984, about 10°); c = (−0.1, 0.9, 0.1) is nearly perpendicular to a (cosine 0.035, about 88°). Retrieval returns the chunks with the highest cosine to the question.",
    svg:svg(560,214,(()=>{
      const ox=70, oy=186, R=150; const v=(deg,c,lab)=>{ const r=deg*Math.PI/180, x=ox+R*Math.cos(r), y=oy-R*Math.sin(r); return arrow(ox,oy,x,y,'',{stroke:c,sw:2.2})+text(x+(deg>90?-8:10),y-4,lab,{size:12,bold:true,color:c,anchor:deg>90?'end':'start'}); };
      let s=line(ox-10,oy,ox+190,oy,{stroke:DIM})+v(18,CY,'a')+v(28,LM,'b')+v(106,MG,'c');
      s+=text(ox+66,oy-28,'≈10°',{size:10,color:LM,anchor:'start'})+text(ox+26,oy-60,'≈88°',{size:10,color:MG,anchor:'start'});
      const rows=[['cos θ = a·b ÷ (|a| |b|)',CY],['a·b = 0.72 + 0.02 + 0.12 = 0.86',null],['|a| = 0.954,  |b| = 0.917',null],['cos(a, b) = 0.984  → similar',LM],['cos(a, c) = 0.035  → unrelated',MG],['1 same · 0 unrelated · −1 opposite',DIM]];
      rows.forEach(([t,c],i)=>{ s+=text(290,40+i*26,t,{size:11,anchor:'start',color:c||'currentColor',bold:!!c&&c!==DIM}); });
      return s; })(),'Three vectors from one origin with the angles between them and the cosine arithmetic')},
   {cap:"Tool use: the model only proposes a call; your code decides whether it runs. Validate the arguments against a schema, check an allow-list, and put a human approval gate in front of anything that sends, pays, deletes or deploys — that is where prompt injection is actually stopped.",
    svg:flow([{t:'user request',stroke:CY},{t:'model proposes\ntool call (JSON)',edge:'prompt'},{t:'your code:\nschema + allow-list',stroke:AM,edge:'call'},{t:'human approves\nrisky actions',stroke:MG,edge:'if risky'},{t:'tool runs,\nreturns result',edge:'yes'},{t:'model writes\nthe answer',stroke:LM,edge:'result'}],{perRow:3,bw:136,bh:54,gap:54,label:'Tool-use loop with validation and approval gates'})},
   {cap:"Defense in depth for an LLM application. No single layer stops prompt injection, because instructions and data are all tokens to the model; each layer limits what a hijacked model can reach or do.",
    svg:stack([{t:'least-privilege tools and credentials',stroke:CY,side:'read-only where possible'},{t:'human approval for consequential actions',stroke:MG,side:'send · pay · delete'},{t:'validate and encode model output',stroke:AM,side:'schema, HTML, SQL, shell'},{t:'delimit untrusted content; no secrets',side:'web, email, documents'},{t:'log tool calls; alert on anomalies',stroke:LM,side:'Domain 21 detection'}],{w:310,h:36,gap:8,side:true,label:'Five defensive layers for an LLM application'})}
  ]);

  /* ================= Module 8: classical ML ================= */
  I.p9m8=(E.p9m8||[]).concat([
   {cap:"One greedy split, scored with Gini impurity. The parent (6 fault, 4 ok) has Gini 0.48. Splitting on loss > 0.08 dB sends a pure group left (Gini 0) and a 2-to-4 group right (Gini 0.444); the weighted impurity drops to 0.267, a decrease of 0.213, so the tree keeps this split if no other is better.",
    svg:svg(560,214,(()=>{
      let s=box(190,14,180,46,'10 splices: 6 fault, 4 ok\nGini = 1 − (0.36 + 0.16) = 0.48',{size:10,stroke:CY});
      s+=line(250,60,140,102)+line(310,60,420,102)+text(280,80,'loss > 0.08 dB?',{size:10,color:AM,bold:true})+text(176,82,'yes',{size:10,color:DIM})+text(388,82,'no',{size:10,color:DIM});
      s+=box(40,102,200,46,'4 fault, 0 ok\nGini = 0 (pure)',{size:10,stroke:LM})+box(320,102,200,46,'2 fault, 4 ok\nGini = 1 − (1/9 + 4/9) = 0.444',{size:10,stroke:MG});
      s+=text(280,174,'weighted: 0.4 × 0 + 0.6 × 0.444 = 0.267',{size:11,color:AM});
      s+=text(280,196,'impurity decrease 0.48 − 0.267 = 0.213',{size:11,color:LM,bold:true});
      return s; })(),'A decision-tree node split into a pure and a mixed child with Gini arithmetic')},
   {cap:"Bagging versus boosting. A random forest trains many deep trees independently on bootstrap samples and averages them, which cuts variance. Gradient boosting trains shallow trees one after another, each fitted to the residuals the ensemble still gets wrong, which cuts bias.",
    svg:compare({t:'BAGGING (RANDOM FOREST)',draw:o=>{ let s=box(o+80,40,100,26,'training data',{size:10,stroke:CY});
        [0,1,2].forEach(i=>{ const x=o+14+i*82; s+=line(o+130,66,x+38,86)+box(x,86,76,26,'bootstrap '+(i+1),{size:9})+line(x+38,112,x+38,124)+box(x+8,124,60,24,'tree',{size:10,stroke:LM})+line(x+38,148,o+130,164); });
        s+=box(o+80,164,100,22,'average votes',{size:10,stroke:AM})+text(o+130,198,'parallel · variance ↓',{size:10,color:AM,bold:true}); return s; }},
      {t:'BOOSTING',draw:o=>{ let s=''; ['tree 1','tree 2','tree 3'].forEach((t,i)=>{ const y=44+i*46; s+=box(o+26,y,70,26,t,{size:10,stroke:LM}); if(i<2){ s+=arrow(o+61,y+26,o+61,y+44,''); s+=text(o+110,y+36,'fit residuals',{size:9,color:MG,anchor:'start'}); } });
        s+=text(o+215,140,'shrinkage 0.1',{size:10,color:DIM})+text(o+215,158,'7 + 0.1 × 2.8',{size:10,color:DIM})+text(o+215,174,'= 7.28',{size:10,color:DIM});
        s+=text(o+130,198,'sequential · bias ↓',{size:10,color:AM,bold:true}); return s; }},{h:214,label:'Bagging builds trees in parallel; boosting builds them in sequence'})},
   {cap:"k-means by hand on six points (1, 2, 3, 10, 11, 12) starting from centroids 1 and 2 (diamonds). The first assignment puts five points with centroid 2, which moves to 7.6; the second assignment splits {1, 2, 3} from {10, 11, 12}; the centroids move to 2 and 11 and nothing changes after that. Final inertia: 4.",
    svg:svg(560,220,(()=>{
      const X=v=>60+v*36; let s='';
      const rowsd=[['start',[1,2],[0,1,1,1,1,1],false],['step 1',[1,7.6],[0,1,1,1,1,1],true],['step 2',[2,11],[0,0,0,1,1,1],true],['done',[2,11],[0,0,0,1,1,1],true]];
      const pts=[1,2,3,10,11,12];
      rowsd.forEach(([lab,cen,asg,col],r)=>{ const y=36+r*44; s+=text(52,y,lab,{size:10,anchor:'end',color:DIM})+line(X(0),y,X(13),y,{stroke:DIM});
        pts.forEach((p,i)=>{ const c=col?(asg[i]?MG:CY):(r===0?'currentColor':CY); s+=dot(X(p),y,r===0?DIM:c,5); });
        cen.forEach((m,k)=>{ const c=k?MG:CY; s+='<path d="M'+f1(X(m))+' '+f1(y-14)+' l7 7 l-7 7 l-7 -7 z" fill="none" stroke="'+c+'" stroke-width="2"/>'+text(X(m),y-22,String(m),{size:9,color:c,bold:true}); }); });
      [0,1,2,3,10,11,12].forEach(v=>{ s+=text(X(v),206,String(v),{size:9,color:DIM}); });
      s+=text(530,184,'inertia = 4',{size:11,color:LM,bold:true,anchor:'end'});
      return s; })(),'Four rows of a number line showing k-means assignments and centroid moves')}
  ]);

  /* ================= Module 9: evaluation and responsible AI ================= */
  I.p9m9=(E.p9m9||[]).concat([
   {cap:"The fraud confusion matrix from the lecture: 1,000 transactions, 50 frauds, 60 flagged. Precision reads across the 'flagged' column, recall across the 'actually fraud' row. Accuracy (0.97) looks excellent and says almost nothing on its own.",
    svg:svg(560,224,(()=>{
      let s=text(205,18,'predicted',{size:11,bold:true,color:DIM})+text(152,38,'flagged',{size:10,color:DIM})+text(262,38,'not flagged',{size:10,color:DIM});
      s+=text(84,76,'actually',{size:10,color:DIM,anchor:'end'})+text(84,90,'fraud (50)',{size:10,color:DIM,anchor:'end'})+text(84,136,'actually',{size:10,color:DIM,anchor:'end'})+text(84,150,'legit (950)',{size:10,color:DIM,anchor:'end'});
      const cell=(x,y,t,n,c)=>shade(x,y,104,54,c,0.25)+rect(x,y,104,54,c)+text(x+52,y+18,t,{size:10,color:c,bold:true})+text(x+52,y+36,n,{size:14,bold:true});
      s+=cell(100,52,'TP','40',LM)+cell(210,52,'FN','10',MG)+cell(100,112,'FP','20',AM)+cell(210,112,'TN','930',CY);
      const rows=[['precision = 40 / 60 = 0.667',AM],['recall = 40 / 50 = 0.800',MG],['specificity = 930 / 950 = 0.979',CY],['F1 = 0.727',LM],['accuracy = 970 / 1000 = 0.970',DIM]];
      rows.forEach(([t,c],i)=>{ s+=text(336,62+i*24,t,{size:11,anchor:'start',color:c,bold:c!==DIM}); });
      s+=text(205,192,'always-legit model: 95% accurate, 0 caught',{size:10,color:MG});
      return s; })(),'Two by two confusion matrix with counts and the metrics computed from it')},
   {cap:"AUC by pair counting, drawn. Positives scored 0.9, 0.8 and 0.4; negatives 0.7, 0.3 and 0.2. Walking down the ranked list, each positive steps the ROC curve up and each negative steps it right; the shaded area is 8 of the 9 positive-negative pairs ranked correctly, AUC = 0.889. The diagonal is a coin flip (0.5).",
    svg:svg(560,238,(()=>{
      const X=v=>70+v*170, Y=v=>200-v*170; let s=axes(70,200,262,22,'','recall (TPR)')+text(155,228,'false-positive rate',{size:10,color:DIM});
      const pts=[[0,0],[0,1/3],[0,2/3],[1/3,2/3],[1/3,1],[2/3,1],[1,1]];
      s+=area([[X(0),Y(0)],[X(0),Y(2/3)],[X(1/3),Y(2/3)],[X(1/3),Y(1)],[X(1),Y(1)],[X(1),Y(0)]],LM,0.22);
      s+=poly(pts.map(p=>[X(p[0]),Y(p[1])]),{stroke:LM,sw:2.4})+line(X(0),Y(0),X(1),Y(1),{stroke:DIM,dash:true});
      s+=text(X(0.62),Y(0.32),'AUC = 8/9',{size:12,color:LM,bold:true})+text(X(0.62),Y(0.32)+16,'= 0.889',{size:12,color:LM,bold:true});
      [0,0.5,1].forEach(v=>{ s+=text(X(v),214,String(v),{size:9,color:DIM})+text(62,Y(v),String(v),{size:9,color:DIM,anchor:'end'}); });
      const ranked=[['0.9','P'],['0.8','P'],['0.7','N'],['0.4','P'],['0.3','N'],['0.2','N']];
      s+=text(420,26,'ranked scores',{size:11,bold:true,color:CY});
      ranked.forEach(([v,c],i)=>{ const y=46+i*24, pos=c==='P'; s+=box(372,y,96,20,v+'  '+(pos?'positive':'negative'),{size:10,stroke:pos?LM:MG})+text(478,y+10,pos?'step up':'step right',{size:10,color:DIM,anchor:'start'}); });
      return s; })(),'Step-shaped ROC curve from six ranked scores with the area under it shaded')},
   {cap:"Choosing the threshold from costs, using the lecture's breast-cancer run. Lowering the threshold trades false alarms (amber) for missed cancers (magenta). If a miss costs 50 false alarms, the expected cost 50·FN + FP is 204 at 0.5, 163 at 0.2 and 70 at 0.05, so 0.05 wins even though accuracy falls.",
    svg:svg(560,214,(()=>{
      const data=[['0.5',4,4,204],['0.2',3,13,163],['0.05',1,20,70]]; let s=text(280,14,'threshold vs errors and cost (miss = 50 × false alarm)',{size:11,bold:true,color:CY});
      data.forEach(([t,fn,fp,cost],i)=>{ const x0=40+i*176; s+=line(x0,170,x0+150,170,{stroke:DIM});
        s+=shade(x0+10,170-fn*6,34,fn*6,MG,0.5)+rect(x0+10,170-fn*6,34,fn*6,MG)+text(x0+27,170-fn*6-8,'FN '+fn,{size:10,color:MG});
        s+=shade(x0+54,170-fp*6,34,fp*6,AM,0.5)+rect(x0+54,170-fp*6,34,fp*6,AM)+text(x0+71,170-fp*6-8,'FP '+fp,{size:10,color:AM});
        s+=text(x0+75,186,'threshold '+t,{size:10,bold:true})+text(x0+75,204,'cost '+cost,{size:11,bold:true,color:i===2?LM:DIM});
      });
      return s; })(),'Bars of false negatives and false positives at three thresholds with expected costs')},
   {cap:"A threat model for an LLM application (defensive view). Each arrow is an input the model cannot fully trust or an action it can trigger; the labels name the OWASP and MITRE ATLAS threat classes that live there. Test only systems you own or are authorized to assess.",
    svg:svg(560,232,(()=>{
      let s=box(210,90,140,46,'your LLM app\n(prompt + model)',{size:11,stroke:CY,bold:true});
      s+=box(14,20,120,34,'user input',{size:10})+box(14,170,120,34,'web pages, email',{size:10})+box(426,20,120,34,'tools and APIs',{size:10,stroke:MG})+box(426,170,120,34,'downloaded model',{size:10,stroke:AM})+box(220,176,120,34,'RAG document store',{size:10});
      s+=arrow(134,44,208,98,'',{stroke:MG})+arrow(134,180,208,128,'',{stroke:MG})+arrow(352,98,424,44,'',{stroke:MG})+arrow(426,180,352,130,'',{stroke:AM})+arrow(280,176,280,138,'',{stroke:AM});
      s+=text(90,72,'prompt injection',{size:10,color:MG})+text(90,156,'indirect injection',{size:10,color:MG})+text(440,72,'excessive agency',{size:10,color:MG,anchor:'start'});
      s+=text(452,150,'pickle file runs code',{size:10,color:AM})+text(280,222,'data poisoning',{size:10,color:AM});
      s+=text(280,18,'API: extraction, cost abuse',{size:10,color:DIM});
      return s; })(),'Diagram of an LLM application with its untrusted inputs, tools and the threats on each path')}
  ]);

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
