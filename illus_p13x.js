/* Third figures — Domain 13: Computer Science Foundations: Data Structures, Algorithms & Theory. Adds to the figures in illus_p13.js (never replaces them). */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const add=(id,figs)=>{ window.ILLUS=window.ILLUS||{}; window.ILLUS[id]=(window.ILLUS[id]||[]).concat(figs); };
  /* local helpers, kit colors only */
  const hl=(x,y,w,h,c,op)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="4" fill="'+c+'" opacity="'+(op||0.2)+'"/>';
  const circ=(cx,cy,r,o={})=>'<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+(o.fill||'none')+'" stroke="'+(o.stroke||'currentColor')+'" stroke-width="'+(o.sw||1.3)+'"/>';
  const panel=(x,y,w,h,t,c)=>box(x,y,w,h,'',{dash:true,stroke:DIM})+text(x+w/2,y+16,t,{bold:true,color:c,size:11});
  /* arrow between two circles of radius r, stopping at the rims */
  const link=(x1,y1,x2,y2,r,o={})=>{ const dx=x2-x1, dy=y2-y1, L=Math.hypot(dx,dy), ux=dx/L, uy=dy/L; return arrow(+(x1+ux*r).toFixed(1),+(y1+uy*r).toFixed(1),+(x2-ux*(r+2)).toFixed(1),+(y2-uy*(r+2)).toFixed(1),'',o); };

  /* M1 — binary search with its loop invariant, traced to termination */
  add('p13m1',[{cap:"The loop invariant for binary search, traced on a miss: searching for 30, the shaded range lo..hi always contains 30 if it is present, from the start (initialization) through every halving (maintenance). When lo passes hi the range is empty, so the invariant proves 30 is absent (termination).",
    svg:svg(560,245,(()=>{
      const a=[3,9,14,21,27,35,42,50], X=i=>120+i*36;
      let s=text(10,16,'target 30',{bold:true,color:CY,size:11,anchor:'start'});
      a.forEach((v,i)=>{ s+=text(X(i)+17,16,String(i),{size:9,color:DIM}); });
      const rows=[[0,7,3,'initialization',CY,'a[3] = 21 < 30 → lo = 4'],[4,7,5,'maintenance',DIM,'a[5] = 35 > 30 → hi = 4'],[4,4,4,'maintenance',DIM,'a[4] = 27 < 30 → lo = 5'],[5,4,-1,'termination',LM,'lo > hi: empty range']];
      rows.forEach(([lo,hi,mid,lab,lc,note],r)=>{ const y=28+r*44;
        if(lo<=hi) s+=hl(X(lo)-1,y-1,36*(hi-lo)+36,30,CY,0.18);
        a.forEach((v,i)=>{ const inR=i>=lo&&i<=hi, isM=i===mid; s+=box(X(i),y,34,28,String(v),{size:11,bold:isM,stroke:isM?AM:(inR?'currentColor':DIM),color:inR?'currentColor':DIM}); });
        s+=text(10,y+14,lab,{size:10,color:lc,anchor:'start'})+text(416,y+14,note,{size:10,color:r===3?LM:(mid>=0&&a[mid]<30?CY:AM),anchor:'start'});
        if(lo===hi) s+=text(X(lo)+17,y+38,'lo = hi',{size:9,color:AM}); else { s+=text(X(lo)+17,y+38,'lo',{size:9,color:r===3?MG:AM}); s+=text(X(hi)+17,y+38,'hi',{size:9,color:r===3?MG:AM}); } });
      s+=text(280,218,'invariant: 30 ∈ a[lo..hi] if present',{size:11,color:LM,bold:true})+text(280,236,'empty range + invariant ⇒ 30 is absent',{size:10,color:AM});
      return s; })(),'Binary search for 30 traced row by row with the invariant range shaded')}]);

  /* M2 — list.pop(0) shifts everything; a ring buffer moves one index */
  add('p13m2',[{cap:"list.pop(0) returns the front item and then shifts every remaining item one slot left, Θ(n) per dequeue. A ring buffer leaves the items in place and moves an index (dequeue advances head, enqueue advances tail, both modulo the capacity), so each operation is Θ(1) — the way a network card hands packets to the kernel.",
    svg:svg(560,215,(()=>{
      let s=panel(10,10,260,195,'LIST.POP(0): SHIFT ALL',MG)+panel(290,10,260,195,'RING BUFFER: MOVE AN INDEX',CY);
      const Lx=i=>28+i*28;
      s+=text(140,42,'before',{size:9,color:DIM}); ['A','B','C','D','E','F','',''].forEach((t,i)=>{ s+=box(Lx(i),50,26,24,t,{size:11,stroke:t?(i===0?MG:'currentColor'):DIM,dash:!t}); });
      ['B','C','D','E','F','','',''].forEach((t,i)=>{ s+=box(Lx(i),110,26,24,t,{size:11,stroke:t?'currentColor':DIM,dash:!t}); });
      for(let i=1;i<=5;i++) s+=arrow(Lx(i)+13,75,Lx(i-1)+15,108,'',{stroke:AM});
      s+=text(140,148,'after: A returned, rest shifted',{size:9,color:DIM})+text(140,166,'every item moves one slot',{size:10})+text(140,186,'n − 1 moves → Θ(n)',{size:11,color:MG,bold:true});
      const Rx=i=>308+i*28; const slot=['C','D','','','','','A','B'];
      slot.forEach((t,i)=>{ s+=text(Rx(i)+13,46,String(i),{size:9,color:DIM})+box(Rx(i),54,26,24,t,{size:11,stroke:t?CY:DIM,dash:!t}); });
      s+=arrow(Rx(6)+13,100,Rx(6)+13,81,'',{stroke:LM})+text(Rx(6)+13,110,'head',{size:9,color:LM});
      s+=arrow(Rx(2)+13,100,Rx(2)+13,81,'',{stroke:AM})+text(Rx(2)+13,110,'tail',{size:9,color:AM});
      s+=text(420,134,'dequeue: head = (head + 1) mod 8',{size:10})+text(420,152,'enqueue: tail = (tail + 1) mod 8',{size:10});
      s+=text(420,180,'one index moves → Θ(1)',{size:11,color:LM,bold:true});
      return s; })(),'list.pop(0) shifting every element versus a ring buffer advancing its head index')}]);

  /* M3 — quicksort's pivot decides the depth */
  add('p13m3',[{cap:"Quicksort's cost is its recursion depth, and the pivot sets the depth: a first-element pivot on already-sorted input peels off one item per level, giving n levels and 7 + 6 + … + 1 = 28 comparisons for eight items, the Θ(n²) case. A random or median pivot splits near the middle for about log₂ n levels of at most n comparisons each, and introsort switches to heapsort if the recursion still gets too deep.",
    svg:svg(560,245,(()=>{
      let s=panel(10,10,260,205,'FIRST PIVOT, SORTED INPUT',MG)+panel(290,10,260,205,'RANDOM / MEDIAN PIVOT',CY);
      const cell=(x,y,v,c,piv)=>(piv?hl(x,y,26,16,c,0.35):'')+box(x,y,26,16,String(v),{size:10,stroke:c,rx:3,bold:piv});
      for(let k=0;k<7;k++){ const y=36+k*18; for(let p=k;p<8;p++) s+=cell(28+p*28,y,p+1,p===k?MG:'currentColor',p===k); }
      s+=text(140,180,'7 + 6 + … + 1 = 28 compares',{size:10,color:AM})+text(140,198,'depth n → Θ(n²)',{size:11,color:MG,bold:true});
      const R=[[[0,7,3]],[[0,2,1],[4,7,5]],[[0,0,-1],[2,2,-1],[4,4,-1],[6,7,6]],[[7,7,-1]]];
      R.forEach((parts,k)=>{ const y=36+k*30; parts.forEach(([a,b,piv])=>{ for(let p=a;p<=b;p++) s+=cell(308+p*28,y,p+1,p===piv?CY:(piv<0?LM:'currentColor'),p===piv); }); });
      s+=text(420,180,'depth ≈ log₂ n, not n',{size:10,color:CY})+text(420,198,'n per level → Θ(n log n)',{size:11,color:LM,bold:true});
      s+=text(280,234,'introsort: too deep → switch to heapsort',{size:10,color:AM});
      return s; })(),'Quicksort partitions with a first-element pivot on sorted input versus a middle pivot')}]);

  /* M4 — a trie: lookup cost is the word length, prefixes are shared */
  add('p13m4',[{cap:"A trie holding car, cart, cat, do and dog: each level consumes one character, so finding 'cart' takes four steps however many words are stored, and words that share a prefix share its path. The price is memory: a node with 27 child pointers costs 216 bytes before it holds anything.",
    svg:svg(560,245,(()=>{
      const N={root:[165,26],c:[100,74],d:[230,74],a:[100,122],o:[230,122],r:[60,170],t1:[140,170],g:[230,170],t2:[60,218]};
      const E=[['root','c',1],['root','d',0],['c','a',1],['d','o',0],['a','r',1],['a','t1',0],['o','g',0],['r','t2',1]];
      let s=''; E.forEach(([p,c,on])=>{ s+=line(N[p][0],N[p][1]+13,N[c][0],N[c][1]-13,{stroke:on?CY:'currentColor',sw:on?2.4:1.2}); });
      const lab={root:'root',c:'c',d:'d',a:'a',o:'o',r:'r',t1:'t',g:'g',t2:'t'}, end={o:['do',1],r:['car',-1],t1:['cat',1],g:['dog',1],t2:['cart',-1]}, path=['root','c','a','r','t2'];
      Object.keys(N).forEach(k=>{ const [x,y]=N[k], on=path.includes(k), e=end[k]; s+=circ(x,y,13,{stroke:on?CY:(e?LM:'currentColor'),sw:on?2:1.3});
        if(e) s+=circ(x,y,9,{stroke:LM,sw:1})+text(x+e[1]*20,y,e[0],{size:10,color:LM,anchor:e[1]>0?'start':'end'});
        s+=text(x,y,lab[k],{size:k==='root'?9:12,bold:k!=='root'}); });
      s+=text(300,40,'find "cart": 4 steps',{size:12,color:CY,bold:true,anchor:'start'})+text(300,60,'Θ(L), L = length of the word',{size:10,anchor:'start'})+text(300,78,'independent of how many words',{size:10,color:DIM,anchor:'start'});
      s+=text(300,112,'prefix "ca" stored once',{size:11,color:AM,anchor:'start'})+text(300,130,'autocomplete = walk below a prefix',{size:10,color:DIM,anchor:'start'});
      s+=text(300,164,'node = 27 pointers × 8 B',{size:11,color:MG,anchor:'start'})+text(300,182,'= 216 bytes per node',{size:10,color:MG,anchor:'start'})+text(300,202,'no collisions, more memory',{size:10,color:DIM,anchor:'start'});
      s+=circ(306,228,6,{stroke:LM})+circ(306,228,3.5,{stroke:LM,sw:1})+text(318,228,'double ring = end of a word',{size:9,color:LM,anchor:'start'});
      return s; })(),'A trie of five words with the lookup path for cart highlighted')}]);

  /* M5 — union-find: path compression flattens the tree */
  add('p13m5',[{cap:"Path compression in union-find: find(e) climbs four parent links to the representative a and repoints every node it passed straight at a, so the next find(e) takes one hop. Combined with union by rank (the shorter tree goes under the taller), each operation costs amortized α(n), at most 4 for any input that fits in the universe.",
    svg:svg(560,235,(()=>{
      let s=text(105,16,'BEFORE: find(e)',{bold:true,color:AM,size:11})+text(420,16,'AFTER path compression',{bold:true,color:LM,size:11});
      const ch=[['a',44],['b',80],['c',116],['d',152],['e',188]];
      ch.forEach(([k,y],i)=>{ if(i>0) s+=link(70,y,70,ch[i-1][1],13,{stroke:AM,sw:1.8}); });
      s+=link(140,80,70,44,13);
      ch.forEach(([k,y],i)=>{ s+=circ(70,y,13,{stroke:i===0?CY:(i===4?AM:'currentColor'),sw:i===0?2:1.3})+text(70,y,k,{bold:true}); });
      s+=circ(140,80,13)+text(140,80,'f',{bold:true})+text(48,44,'root',{size:9,color:CY,anchor:'end'});
      s+=text(96,170,'find(e):',{size:10,color:AM,anchor:'start'})+text(96,184,'4 hops to root',{size:10,color:AM,anchor:'start'});
      s+=arrow(205,110,285,110,'compress');
      const A=[420,48]; const kids=[['f',320],['b',370],['c',420],['d',470],['e',520]];
      kids.forEach(([k,x])=>{ const tx=A[0]+(x-A[0])*0.4; const dx=tx-x, dy=64-126, L=Math.hypot(dx,dy); s+=arrow(+(x+dx/L*13).toFixed(1),+(126+dy/L*13).toFixed(1),+tx.toFixed(1),64,'',{stroke:k==='f'?'currentColor':LM,sw:k==='f'?1.3:1.8}); });
      s+=box(360,34,120,28,'a (root)',{stroke:CY,sw:2,bold:true,size:12});
      kids.forEach(([k,x])=>{ s+=circ(x,126,13,{stroke:k==='e'?AM:'currentColor'})+text(x,126,k,{bold:true}); });
      s+=text(420,160,'every node on the path',{size:10,color:DIM})+text(420,174,'now points at the root',{size:10,color:DIM});
      s+=text(420,196,'next find(e): 1 hop',{size:11,color:LM,bold:true});
      s+=text(140,222,'union by rank: short under tall',{size:10,color:DIM})+text(420,222,'together: amortized α(n) ≤ 4',{size:10,color:AM});
      return s; })(),'A union-find chain before and after path compression')}]);

  /* M6 — 0/1 knapsack: the DP table beats the greedy choice */
  add('p13m6',[{cap:"The lecture's knapsack counterexample as a DP table: with 10 kg of capacity, greedy grabs the most valuable item A (10 kg, worth 60) and stops, while each cell takes the better of skipping or taking its row's item and the last cell finds B + C = 100. The table has n × W cells, so the cost grows with the value W, which is exponential in the number of bits that write it down.",
    svg:svg(560,215,(()=>{
      const X0=120, cw=56, ch=30, Y=r=>30+r*34; const T=[[0,0,0],[0,0,60],[0,50,60],[0,50,100]];
      let s=''; ['w = 0','w = 5','w = 10'].forEach((t,j)=>{ s+=text(X0+j*cw+cw/2,18,t,{size:10,color:CY,bold:true}); });
      ['no items','+ A: 10 kg, $60','+ B: 5 kg, $50','+ C: 5 kg, $50'].forEach((t,r)=>{ s+=text(112,Y(r)+15,t,{size:10,anchor:'end',color:r===1?MG:'currentColor'}); });
      s+=hl(X0+2*cw,Y(3),cw,ch,LM,0.3);
      T.forEach((row,r)=>row.forEach((v,j)=>{ const tgt=r===3&&j===2, src=r===2&&(j===1||j===2); s+=box(X0+j*cw,Y(r),cw,ch,String(v),{rx:2,size:12,bold:tgt||src,stroke:tgt?LM:(src?AM:DIM),color:tgt?LM:(src?AM:'currentColor')}); }));
      s+=text(204,182,'C: max(60, 50 + 50) = 100',{size:11,color:LM})+text(204,200,'columns in 5 kg steps',{size:9,color:DIM});
      s+=text(310,34,'best[i][w] = max of',{size:11,bold:true,color:CY,anchor:'start'})+text(310,52,'skip i: best[i−1][w]',{size:10,anchor:'start'})+text(310,68,'take i: best[i−1][w − wᵢ] + vᵢ',{size:10,anchor:'start'});
      s+=text(310,104,'greedy, highest value first:',{size:10,color:DIM,anchor:'start'})+text(310,120,'takes A → $60  ✗',{size:11,color:MG,bold:true,anchor:'start'});
      s+=text(310,146,'DP: B + C → $100  ✓',{size:11,color:LM,bold:true,anchor:'start'});
      s+=text(310,180,'Θ(nW) cells, W a number:',{size:10,color:AM,anchor:'start'})+text(310,196,'pseudo-polynomial',{size:10,color:AM,anchor:'start'});
      return s; })(),'0/1 knapsack DP table where greedy takes 60 and the table finds 100')}]);

  /* M7 — the halting problem by diagonalization */
  add('p13m7',[{cap:"Turing's argument as a flow: if a decider H(P, x) existed, build D, which asks H about a program run on its own code and does the opposite, then run D on itself. Whatever H answers about D(D), D does the other thing, so no such H can exist, and the same reasoning (Rice's theorem) rules out a perfect malware detector.",
    svg:svg(560,252,(()=>{
      let s=box(15,12,175,46,'assume H(P, x) answers\n"does P halt on x?"',{stroke:AM,dash:true,size:10});
      s+=arrow(190,35,218,35,'')+box(220,12,130,46,'build D(P):\nask H(P, P)',{stroke:CY,size:10});
      s+=arrow(350,28,383,22,'')+arrow(350,44,383,54,'')+box(385,8,165,28,'H says halts → D loops',{size:10})+box(385,40,165,28,'H says loops → D halts',{size:10});
      s+=arrow(285,58,285,88,'')+text(295,74,'feed D its own code',{size:10,color:DIM,anchor:'start'});
      s+=box(180,90,210,34,'run D(D)',{stroke:CY,bold:true,size:12});
      s+=arrow(230,124,150,150,'')+arrow(340,124,410,150,'');
      s+=box(25,152,240,46,'H(D, D) says "halts"\n→ D(D) loops: H wrong',{stroke:MG,size:10})+box(295,152,240,46,'H(D, D) says "loops"\n→ D(D) halts: H wrong',{stroke:MG,size:10});
      s+=arrow(145,198,215,214,'')+arrow(415,198,345,214,'');
      s+=box(130,214,300,30,'contradiction ⇒ no such H exists',{stroke:LM,bold:true,size:11});
      return s; })(),'Diagonal argument showing that no halting decider can exist')}]);
})();
