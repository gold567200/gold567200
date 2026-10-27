/* Illustrations — Domain 13: Computer Science Foundations (data structures, algorithms, theory), built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  /* small raw primitives in kit colors (theme-safe) */
  const path=(d,o={})=>'<path d="'+d+'" fill="none" stroke="'+(o.stroke||'currentColor')+'" stroke-width="'+(o.sw||1.3)+'"'+(o.dash?' stroke-dasharray="5 4"':'')+(o.head?' marker-end="url(#ah)"':'')+'/>';
  const circ=(cx,cy,r,o={})=>'<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+(o.fill||'none')+'" stroke="'+(o.stroke||'currentColor')+'" stroke-width="'+(o.sw||1.3)+'"/>';
  const hl=(x,y,w,h,color,op)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="4" fill="'+color+'" opacity="'+(op||0.18)+'"/>';
  const BG='var(--bg)';

  /* ================= MODULE 1: RAM model, correctness, Big-O ================= */
  const growth=(()=>{ const x0=45,x1=370,y0=205,y1=30; const gx=t=>x0+t*(x1-x0), gy=v=>y0-Math.min(v,1)*(y0-y1); const nOf=t=>1+15*t;
    const curve=(f,stroke,dash)=>{ const pts=[]; let pt=0,pv=0; for(let i=0;i<=60;i++){ const t=i/60, v=f(nOf(t))/64; if(v>1){ const ts=pt+(1-pv)/(v-pv)*(t-pt); pts.push(gx(ts).toFixed(1)+','+gy(1).toFixed(1)); break; } pts.push(gx(t).toFixed(1)+','+gy(v).toFixed(1)); pt=t; pv=v; }
      return '<polyline points="'+pts.join(' ')+'" fill="none" stroke="'+stroke+'" stroke-width="2"'+(dash?' stroke-dasharray="5 4"':'')+'/>'; };
    let s=arrow(x0,y0,x1+10,y0,'')+arrow(x0,y0,x0,y1-10,'')+text(x0+6,y1-16,'operations',{size:10,color:DIM,anchor:'start'})+text(207,226,'input size n →',{size:10,color:DIM})+text(x0,215,'1',{size:9,color:DIM})+text(x1,215,'16',{size:9,color:DIM});
    s+=curve(n=>Math.pow(2,n),'currentColor',true)+curve(n=>n*n,MG)+curve(n=>n*Math.log2(n),AM)+curve(n=>n,CY)+curve(n=>Math.log2(n),LM);
    s+=text(153,20,'2ⁿ',{size:10})+text(197,20,'n²',{size:10,color:MG})+text(345,20,'n log n',{size:10,color:AM})+text(380,gy(0.25),'n',{size:10,color:CY,anchor:'start'})+text(380,gy(4/64),'log n',{size:10,color:LM,anchor:'start'});
    s+=text(392,40,'n = 10⁶ at 10⁹ ops/s',{size:10,bold:true,anchor:'start'});
    [['log n → 20 ns',LM],['n → 1 ms',CY],['n log n → 20 ms',AM],['n² → 17 minutes',MG],['2ⁿ (n = 60) → 36 years','currentColor']].forEach(([t,c],i)=>{ s+=text(392,62+i*22,t,{size:10,color:c,anchor:'start'}); });
    return svg(560,240,s,'Growth curves of common running times with the time each takes at a million items'); })();
  const doubling=(()=>{ const rows=[[1,0],[2,1],[4,2],[8,4],[16,8]]; let s='';
    rows.forEach(([cap,copy],i)=>{ const y=16+i*32, w=cap*18; s+=text(90,y+12,'cap '+cap,{size:10,color:DIM,anchor:'end'})+box(100,y,w,24,'',{stroke:i===4?CY:'currentColor'}); for(let c=1;c<cap;c++) s+=line(100+c*18,y,100+c*18,y+24,{stroke:DIM,sw:0.6}); s+=text(100+w+10,y+12,copy?'copy '+copy+' on growth':'no copy',{size:10,color:copy?AM:DIM,anchor:'start'}); });
    s+=text(280,192,'copies: 1 + 2 + 4 + 8 = 15 < 2n (n = 16)',{size:11,color:AM})+text(280,212,'n appends cost < 3n → Θ(1) amortized per append',{size:11,color:LM});
    return svg(560,228,s,'A dynamic array that doubles: total copy cost stays under 2n'); })();
  I.p13m1=[{cap:"The shape of the count is what survives hardware changes. Plotted on one scale for n = 1…16, 2ⁿ and n² leave the chart almost immediately, n log n reaches the top at the right edge, n and log n barely rise; the legend converts each shape into wall-clock time at a million items on a 10⁹-operations-per-second core.",svg:growth},
   {cap:"Amortized analysis of a doubling array: each growth copies the old contents, but the copies form a geometric series 1 + 2 + 4 + 8 that totals less than 2n, so n appends cost under 3n operations and each append is Θ(1) on average even though one of them is Θ(n).",svg:doubling}];

  /* ================= MODULE 2: arrays, lists, stacks, queues, hash tables ================= */
  const arrayVsList=compare({t:'ARRAY: CONTIGUOUS',draw:x=>{ let s=text(x+130,46,'a[0..7] · 8-byte ints',{size:10,color:DIM})+box(x+16,58,228,52,'',{dash:true,stroke:CY})+text(x+130,66,'one 64-byte cache line',{size:9,color:CY});
      for(let i=0;i<8;i++) s+=box(x+22+i*27,76,25,26,String(i),{size:10});
      s+=arrow(x+22,124,x+236,124,'')+text(x+130,140,'sequential: 1 miss per 8 elements',{size:10,color:LM})+text(x+130,160,'address = base + i × 8 → Θ(1)',{size:10,color:DIM})+text(x+130,180,'prefetcher runs ahead of you',{size:10,color:DIM}); return s; }},
    {t:'LINKED LIST: SCATTERED',draw:x=>{ let s=text(x+130,46,'each node: value + next pointer',{size:10,color:DIM});
      s+=arrow(x+80,74,x+168,80,'')+arrow(x+200,94,x+122,124,'')+arrow(x+120,130,x+178,136,'');
      s+=box(x+20,62,60,24,'12 ·',{fill:BG,stroke:CY,size:11})+text(x+50,98,'head',{size:9,color:DIM})+box(x+170,70,60,24,'7 ·',{fill:BG,size:11})+box(x+60,118,60,24,'3 ·',{fill:BG,size:11})+box(x+180,126,60,24,'9 · ∅',{fill:BG,stroke:MG,size:11});
      s+=text(x+130,170,'4 hops = 4 cache misses ≈ 400 ns',{size:10,color:MG})+text(x+130,188,'no index arithmetic: k-th item is Θ(k)',{size:9,color:DIM}); return s; }},{h:212,label:'Array versus linked list in memory'});
  const hashTable=(()=>{ const keys=[['alice',2],['bob',5],['carol',7],['dave',2],['erin',7]]; const used=new Set([2,5,7]); let s=text(165,12,'h(key) mod 8 → bucket',{size:10,color:DIM});
    for(let b=0;b<8;b++) s+=box(230,20+b*26,50,24,String(b),{size:10,stroke:used.has(b)?CY:DIM});
    keys.forEach(([k,b],i)=>{ const y=30+i*40; const coll=(i>=3); s+=box(20,y,80,22,k,{size:10,stroke:coll?MG:'currentColor'})+arrow(100,y+11,230,20+b*26+12,'',{stroke:coll?MG:'currentColor'}); });
    const chain=(b,items)=>{ const y=21+b*26; let x=300, r=''; items.forEach(([t,c],i)=>{ if(i) r+=arrow(x-22,y+11,x,y+11,''); r+=box(x,y,70,22,t,{size:10,stroke:c}); x+=92; }); r+=arrow(x-22,y+11,x-4,y+11,'')+text(x+6,y+11,'∅',{size:12,color:DIM}); return r; };
    s+=chain(2,[['alice',CY],['dave',MG]])+chain(5,[['bob',CY]])+chain(7,[['carol',CY],['erin',MG]]);
    s+=text(300,32,'n = 5 keys, m = 8 buckets',{size:10,anchor:'start'})+text(300,50,'α = n/m = 0.63 → ~1.6 compares',{size:10,anchor:'start',color:LM})+text(440,108,'collision → chain',{size:9,color:MG})+text(430,185,'resize when α > 2/3 (CPython dict)',{size:9,color:DIM});
    return svg(560,240,s,'A chained hash table with eight buckets, five keys and two collisions'); })();
  const lru=(()=>{ let s=box(20,70,130,90,'',{stroke:CY})+text(85,84,'dict: name → node',{size:10,color:CY});
    [['a',103],['b',125],['c',147]].forEach(([k,y])=>{ s+=text(40,y,k+' → •',{size:11,anchor:'start',mono:true}); });
    s+=arrow(150,103,250,74,'',{dash:true,stroke:DIM})+arrow(150,125,360,74,'',{dash:true,stroke:DIM})+arrow(150,147,470,74,'',{dash:true,stroke:DIM});
    s+=text(250,20,'head (most recent)',{size:9,color:DIM})+text(470,20,'tail (least recent)',{size:9,color:DIM})+box(210,30,80,44,'a',{stroke:LM,fill:BG,size:13,bold:true})+box(320,30,80,44,'b',{fill:BG,size:13,bold:true})+box(430,30,80,44,'c',{stroke:MG,fill:BG,size:13,bold:true});
    s+=arrow(290,44,320,44,'')+arrow(320,60,290,60,'')+arrow(400,44,430,44,'')+arrow(430,60,400,60,'');
    s+=text(370,140,'get(b): unlink b, relink at head → Θ(1)',{size:10})+text(370,160,'put at capacity: evict tail c → Θ(1)',{size:10,color:MG});
    return svg(560,175,s,'An LRU cache built from a dict and a doubly linked list'); })();
  I.p13m2=[{cap:"Two Θ(n) scans, a tenfold difference. The array's elements share cache lines, so one DRAM trip delivers eight of them and the prefetcher fetches ahead; every linked-list node is a separate allocation somewhere else in memory, so each hop is a likely ~100 ns miss.",svg:arrayVsList},
   {cap:"A chained hash table: h(key) mod m chooses the bucket, collisions become short chains, and the load factor α = n/m sets the expected chain length. CPython resizes its dict at two-thirds full so α stays small; an attacker who can make every key collide turns the table into one long list.",svg:hashTable},
   {cap:"The classic 'design an LRU cache' answer and the shape of DNS resolvers and CPU caches: a dict finds the node in Θ(1), and because you hold the node, unlinking it and relinking it at the head of the doubly linked list is Θ(1) too; eviction removes the tail.",svg:lru}];

  /* ================= MODULE 3: recursion, divide and conquer, sorting ================= */
  const mergeTree=(()=>{ let s=line(224,38,116,58)+line(224,38,332,58)+line(116,84,62,104)+line(116,84,170,104)+line(332,84,278,104)+line(332,84,386,104);
    const l2=[62,170,278,386]; l2.forEach((cx,i)=>{ s+=line(cx,130,35+(2*i)*54,150)+line(cx,130,35+(2*i+1)*54,150); });
    s+=box(124,12,200,26,'38 27 43 3 9 82 10 1',{stroke:CY,size:11,fill:BG})+box(56,58,120,26,'38 27 43 3',{size:11,fill:BG})+box(272,58,120,26,'9 82 10 1',{size:11,fill:BG});
    ['38 27','43 3','9 82','10 1'].forEach((t,i)=>{ s+=box(27+i*108,104,70,26,t,{size:11,fill:BG}); });
    [38,27,43,3,9,82,10,1].forEach((v,i)=>{ s+=box(20+i*54,150,30,26,String(v),{size:11,stroke:DIM,fill:BG}); });
    s+=arrow(224,178,224,204,'merge')+box(104,205,240,26,'1 3 9 10 27 38 43 82',{stroke:LM,size:11});
    [['level 0 · 8 ops',25],['level 1 · 8 ops',71],['level 2 · 8 ops',117],['leaves · n = 8',163]].forEach(([t,y])=>{ s+=text(548,y,t,{size:10,color:DIM,anchor:'end'}); });
    s+=text(548,218,'3 levels × 8 = 24 ≈ n log₂ n',{size:10,color:AM,anchor:'end'});
    return svg(560,245,s,'Merge sort recursion tree for eight numbers'); })();
  const decisionTree=(()=>{ let s=line(280,36,130,62)+line(280,36,430,62)+line(130,88,48,116)+line(130,88,195,116)+line(430,88,343,116)+line(430,88,475,116)+line(195,140,150,170)+line(195,140,235,170)+line(475,140,430,170)+line(475,140,515,170);
    const yn=(x,y,t)=>text(x,y,t,{size:9,color:t==='yes'?LM:MG});
    s+=yn(195,43,'yes')+yn(365,43,'no')+yn(78,98,'yes')+yn(176,98,'no')+yn(376,98,'yes')+yn(464,98,'no')+yn(160,151,'yes')+yn(228,151,'no')+yn(440,151,'yes')+yn(508,151,'no');
    s+=box(230,10,100,26,'a < b ?',{stroke:CY,fill:BG})+box(80,62,100,26,'b < c ?',{fill:BG})+box(380,62,100,26,'a < c ?',{fill:BG});
    s+=box(15,116,66,24,'a b c',{stroke:LM,fill:BG})+box(150,116,90,24,'a < c ?',{fill:BG})+box(310,116,66,24,'b a c',{stroke:LM,fill:BG})+box(430,116,90,24,'b < c ?',{fill:BG});
    [['a c b',120],['c a b',205],['b c a',400],['c b a',485]].forEach(([t,x])=>{ s+=box(x,170,60,24,t,{stroke:LM,fill:BG}); });
    s+=text(280,222,'3! = 6 leaves → height ≥ log₂ 6 ≈ 2.6 → 3 comparisons',{size:10,color:AM});
    return svg(560,240,s,'Decision tree for sorting three elements'); })();
  I.p13m3=[{cap:"Merge sort as a recursion tree: log₂ 8 = 3 levels of splitting, and the merging work on every level adds up to n. Total n log₂ n = 24 element moves for eight numbers, with no bad case because the split is always exactly in half.",svg:mergeTree},
   {cap:"Why no comparison sort beats n log n: every comparison-based sort is a decision tree whose leaves are the n! possible orderings. Three elements have 6 orderings, so some path must be at least log₂ 6 ≈ 2.6, i.e. 3 comparisons deep; for n items the height is at least log₂(n!) ≈ n log₂ n − 1.44n.",svg:decisionTree}];

  /* ================= MODULE 4: trees, heaps, tries, B-trees ================= */
  const bstCompare=compare({t:'SORTED INSERTS → CHAIN',draw:x=>{ let s=text(x+130,44,'insert 1, 2, 3, 4, 5 in order',{size:10,color:DIM});
      for(let i=0;i<4;i++) s+=line(x+70+i*38,78+i*26,x+78+(i+1)*38,56+(i+1)*26);
      for(let i=0;i<5;i++) s+=box(x+40+i*38,56+i*26,30,22,String(i+1),{fill:BG,stroke:i===4?MG:'currentColor'});
      s+=text(x+130,201,'height = n → Θ(n) search',{size:10,color:MG}); return s; }},
    {t:'BALANCED (AVL / RED-BLACK)',draw:x=>{ let s=text(x+130,44,'same keys after rotations',{size:10,color:DIM});
      s+=line(x+130,80,x+75,106)+line(x+130,80,x+185,106)+line(x+75,128,x+45,154)+line(x+185,128,x+215,154);
      s+=box(x+115,58,30,22,'3',{fill:BG,stroke:CY,bold:true})+box(x+60,106,30,22,'2',{fill:BG})+box(x+170,106,30,22,'4',{fill:BG})+box(x+30,154,30,22,'1',{fill:BG,stroke:LM})+box(x+200,154,30,22,'5',{fill:BG,stroke:LM});
      s+=text(x+130,201,'height 2 ≈ log₂ n → Θ(log n)',{size:10,color:LM}); return s; }},{h:222,label:'Unbalanced versus balanced binary search tree'});
  const heapArray=(()=>{ const nodes=[[265,12,'1',CY],[165,60,'5',AM],[365,60,'2',AM],[115,108,'9',MG],[215,108,'6',MG],[315,108,'4',MG],[415,108,'3',MG]]; let s='';
    [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]].forEach(([p,c])=>{ s+=line(nodes[p][0]+15,nodes[p][1]+24,nodes[c][0]+15,nodes[c][1]); });
    nodes.forEach(([x,y,v,c])=>{ s+=box(x,y,30,24,v,{fill:BG,stroke:c,bold:true}); });
    s+=text(280,156,'the same heap as an array — no pointers',{size:10,color:DIM});
    nodes.forEach(([x,y,v,c],i)=>{ s+=box(126+i*44,170,44,26,v,{stroke:c,bold:true})+text(148+i*44,210,String(i),{size:10,color:DIM}); });
    s+=text(280,234,'children of i: 2i + 1, 2i + 2 · parent: (i − 1) // 2',{size:10,color:AM});
    return svg(560,248,s,'A binary min-heap drawn as a tree and stored as an array'); })();
  const btreeFlow=flow([{t:'4 KB page\n8 B key + 8 B ptr'},{t:'fan-out\n4096 / 16 = 256',stroke:CY},{t:'3 levels\n256³ ≈ 16.8 M keys',stroke:AM},{t:'lookup\n1–2 disk reads',stroke:LM}],{label:'B-tree fan-out arithmetic'});
  I.p13m4=[{cap:"Same five keys, two trees. Inserting sorted keys into a plain BST always goes right, so the 'tree' is a chain of height n and every search is Θ(n); an AVL or red-black tree rotates after each insert and keeps the height near log₂ n.",svg:bstCompare},
   {cap:"A heap is a complete binary tree that lives in a plain array: colors mark levels, children of index i sit at 2i + 1 and 2i + 2, the parent at (i − 1) // 2. No pointers means contiguous memory, which is why heapq and every priority queue use it.",svg:heapArray},
   {cap:"Why a database index is three levels deep for 16 million rows: a node is one disk page, hundreds of keys wide. The top levels stay cached in RAM, so a lookup among millions of rows costs one or two real I/Os.",svg:btreeFlow}];

  /* ================= MODULE 5: graphs ================= */
  const graphPanel=(x,order,treeEdges,color,frontier,bottom)=>{ const P={A:[x+130,62],B:[x+70,104],C:[x+190,104],D:[x+70,146],E:[x+190,146],F:[x+130,188]}; const edges=['AB','AC','BC','BD','CE','DF','EF']; let s=text(x+130,42,frontier,{size:9,color:DIM});
    edges.forEach(e=>{ const [a,b]=[P[e[0]],P[e[1]]]; const t=treeEdges.includes(e); s+=line(a[0],a[1],b[0],b[1],{stroke:t?color:DIM,sw:t?2.2:1,dash:!t}); });
    Object.keys(P).forEach(k=>{ const [cx,cy]=P[k]; s+=box(cx-13,cy-11,26,22,k,{fill:BG,bold:true,size:11})+text(cx+20,cy-10,String(order.indexOf(k)+1),{size:9,color:AM,bold:true}); });
    return s+text(x+130,212,bottom,{size:9,color:color}); };
  const bfsDfs=compare({t:'BFS FROM A',draw:x=>graphPanel(x,'ABCDEF',['AB','AC','BD','CE','DF'],CY,'frontier queue: [B, C] → [C, D] → …','queue · layer by layer · fewest hops')},
    {t:'DFS FROM A',draw:x=>graphPanel(x,'ABCEFD',['AB','BC','CE','EF','DF'],MG,'stack: A → B → C → E → F → D','stack · one path deep · cycles, topo order')},{h:230,label:'Breadth-first versus depth-first search on the same graph'});
  const dijkstra=(()=>{ const P={A:[43,111],B:[108,51],C:[108,171],D:[183,51],E:[183,171],F:[248,111]}; const E=[['AB',4,66,74],['AC',2,66,150],['BC',1,122,111],['BD',5,145,41],['CD',8,158,104],['CE',10,145,183],['DE',2,197,111],['DF',6,224,72],['EF',3,224,150]]; const spt=['AC','BC','BD','DE','EF'];
    let s=text(140,18,'weights = km of fiber',{size:10,color:DIM});
    E.forEach(([e,w,lx,ly])=>{ const [a,b]=[P[e[0]],P[e[1]]]; const t=spt.includes(e); s+=line(a[0],a[1],b[0],b[1],{stroke:t?LM:'currentColor',sw:t?2.4:1})+text(lx,ly,String(w),{size:9,color:AM}); });
    Object.keys(P).forEach(k=>{ const [cx,cy]=P[k]; s+=box(cx-13,cy-11,26,22,k,{fill:BG,bold:true,size:11,stroke:k==='A'?CY:'currentColor'}); });
    s+=text(140,205,'highlighted edges = shortest-path tree',{size:9,color:LM});
    const cols=[372,407,442,477,512]; s+=text(282,30,'settle',{size:10,bold:true,anchor:'start'}); ['B','C','D','E','F'].forEach((c,i)=>{ s+=text(cols[i],30,c,{size:10,bold:true,color:CY}); }); s+=line(280,40,540,40,{stroke:DIM});
    const rows=[['A (0)',[['4','n'],['2','n'],['∞','d'],['∞','d'],['∞','d']]],['C (2)',[['3','n'],['✓','s'],['10','n'],['12','n'],['∞','d']]],['B (3)',[['✓','s'],['✓','s'],['8','n'],['12','k'],['∞','d']]],['D (8)',[['✓','s'],['✓','s'],['✓','s'],['10','n'],['14','n']]],['E (10)',[['✓','s'],['✓','s'],['✓','s'],['✓','s'],['13','n']]],['F (13)',[['✓','s'],['✓','s'],['✓','s'],['✓','s'],['✓','s']]]];
    rows.forEach(([lab,vals],r)=>{ const y=58+r*24; s+=text(282,y,'settle '+lab,{size:10,anchor:'start'}); vals.forEach(([v,kind],i)=>{ s+=text(cols[i],y,v,{size:10,color:kind==='n'?AM:kind==='s'?LM:kind==='d'?DIM:'currentColor',bold:kind==='n'}); }); });
    s+=text(410,205,'relax: if d[u] + w < d[v] then d[v] = d[u] + w',{size:10,color:DIM})+text(410,226,'A → F = 13 km via A-C-B-D-E-F',{size:10,color:LM});
    return svg(560,245,s,'Dijkstra on the six-site fiber graph with the relaxation table'); })();
  const kruskalFlow=flow([{t:'B-C 1\n✓ join'},{t:'A-C 2\n✓ join'},{t:'D-E 2\n✓ join'},{t:'E-F 3\n✓ join'},{t:'A-B 4\n✗ same set',stroke:MG},{t:'B-D 5\n✓ join → 13 km',stroke:LM}],{label:'Kruskal with union-find on the same graph'});
  I.p13m5=[{cap:"One graph, two traversals. BFS pulls vertices from a queue layer by layer (A, then B C, then D E, then F), so the solid tree edges are shortest paths by hop count; DFS pushes down one path (A B C E F, then back for D) and its back edges reveal cycles and give topological order on a DAG. Both are Θ(V + E).",svg:bfsDfs},
   {cap:"Dijkstra's algorithm on the module's six-site network: settle the closest unsettled vertex, relax its edges, repeat. Amber cells are tentative distances that just improved, green ticks are settled; the highlighted edges form the shortest-path tree, which is not the minimum spanning tree.",svg:dijkstra},
   {cap:"Kruskal's algorithm sorts the edges and accepts each one that joins two different components; union-find answers 'same component?' in near-constant amortized time, so the 4 km A-B edge is rejected and the MST totals 13 km.",svg:kruskalFlow}];

  /* ================= MODULE 6: dynamic programming and greedy ================= */
  const editTable=(()=>{ const T=[[0,1,2,3,4,5,6,7],[1,1,2,3,4,5,6,7],[2,2,1,2,3,4,5,6],[3,3,2,1,2,3,4,5],[4,4,3,2,1,2,3,4],[5,5,4,3,2,2,3,4],[6,6,5,4,3,3,2,3]]; const cols=['ε','s','i','t','t','i','n','g'], rowsH=['ε','k','i','t','t','e','n']; const X=110,Y=36,W=34,H=24; const onPath=new Set(['0,0','1,1','2,2','3,3','4,4','5,5','6,6','6,7']);
    let s=text(50,24,'sitting →',{size:10,color:CY,anchor:'start'})+text(40,120,'kitten',{size:10,color:MG})+text(40,134,'↓',{size:10,color:MG});
    cols.forEach((c,j)=>{ s+=text(X+j*W+17,24,c,{size:11,color:CY,bold:true}); }); rowsH.forEach((r,i)=>{ s+=text(98,Y+i*H+12,r,{size:11,color:MG,bold:true,anchor:'end'}); });
    T.forEach((row,i)=>row.forEach((v,j)=>{ const k=i+','+j; if(onPath.has(k)) s+=hl(X+j*W,Y+i*H,W,H,k==='6,7'?MG:AM,k==='6,7'?0.4:0.22); }));
    for(let j=0;j<=8;j++) s+=line(X+j*W,Y,X+j*W,Y+7*H,{stroke:DIM,sw:0.6}); for(let i=0;i<=7;i++) s+=line(X,Y+i*H,X+8*W,Y+i*H,{stroke:DIM,sw:0.6});
    T.forEach((row,i)=>row.forEach((v,j)=>{ const k=i+','+j, on=onPath.has(k); s+=text(X+j*W+17,Y+i*H+12,String(v),{size:11,bold:on,color:on?(k==='6,7'?MG:AM):'currentColor'}); }));
    s+=text(400,50,'D[i][j] = min of',{size:10,bold:true,anchor:'start'})+text(400,68,'delete: D[i−1][j] + 1',{size:10,anchor:'start'})+text(400,86,'insert: D[i][j−1] + 1',{size:10,anchor:'start'})+text(400,104,'sub: D[i−1][j−1] + [a≠b]',{size:10,anchor:'start'})+text(400,122,'match: copy the diagonal',{size:10,anchor:'start',color:DIM});
    s+=text(400,152,'path: sub k→s, sub e→i, insert g',{size:10,anchor:'start',color:AM})+text(400,172,'kitten → sitting = 3 edits',{size:11,anchor:'start',color:MG,bold:true})+text(400,196,'7 × 8 = 56 cells → Θ(mn)',{size:10,anchor:'start',color:DIM});
    s+=text(246,228,'each cell: Θ(1) from three neighbors',{size:10,color:DIM});
    return svg(560,245,s,'Edit-distance DP table for kitten to sitting'); })();
  const fibTree=tree({t:'fib(5)',kids:[{t:'fib(4)',kids:['fib(3)','fib(2)']},{t:'fib(3)',kids:['fib(2)','fib(1)']}]},{three:true,label:'Overlapping subproblems in naive Fibonacci'});
  const coinsCompare=compare({t:'GREEDY: LARGEST COIN FIRST',draw:x=>{ let s=text(x+130,46,'coins {1, 3, 4} · target 6',{size:10,color:DIM});
      [['4',x+70],['1',x+130],['1',x+190]].forEach(([v,cx])=>{ s+=circ(cx,90,20,{stroke:MG,sw:2})+text(cx,90,v,{bold:true,size:13}); });
      s+=text(x+130,130,'4 + 1 + 1',{size:11})+text(x+130,152,'3 coins ✗ not optimal',{size:11,color:MG,bold:true})+text(x+130,176,'no greedy-choice property here',{size:9,color:DIM}); return s; }},
    {t:'DP: C[a] = 1 + min C[a − c]',draw:x=>{ let s=text(x+130,46,'solve every amount 0…6 once',{size:10,color:DIM});
      [['3',x+100],['3',x+160]].forEach(([v,cx])=>{ s+=circ(cx,90,20,{stroke:LM,sw:2})+text(cx,90,v,{bold:true,size:13}); });
      [0,1,1,1,1,2,2].forEach((v,a)=>{ s+=box(x+25+a*30,118,30,22,String(v),{size:10,stroke:a===6?LM:DIM})+text(x+40+a*30,152,String(a),{size:9,color:DIM}); });
      s+=text(x+130,174,'C[6] = 2 coins ✓ (3 + 3)',{size:11,color:LM,bold:true}); return s; }},{h:200,label:'Greedy versus dynamic programming for coin change'});
  I.p13m6=[{cap:"Edit distance between kitten and sitting by the table: each cell is the cheapest of delete (above), insert (left) and substitute-or-match (diagonal). The highlighted path reconstructs the three edits, and the 56 cells cost Θ(mn) with no recursion.",svg:editTable},
   {cap:"Overlapping subproblems: naive Fibonacci recomputes fib(3) and fib(2) again and again, so the call tree has about φⁿ nodes. Memoization stores each answer the first time, collapsing fib(40)'s 331 million calls to 41.",svg:fibTree},
   {cap:"The standard counterexample. Taking the largest coin first spends 4 + 1 + 1 = 3 coins on 6, but the DP table C[a] = 1 + min C[a − c] finds 3 + 3 = 2. Greedy is only trustworthy with an exchange-argument proof; when you cannot write one, tabulate.",svg:coinsCompare}];

  /* ================= MODULE 7: automata, decidability, P vs NP ================= */
  const dfa=(()=>{ let s=arrow(40,105,82,105,'')+text(52,92,'start',{size:9,color:DIM})+text(540,20,'accepts strings ending in 01',{size:10,color:LM,anchor:'end'});
    s+=path('M 98 81 C 80 30, 140 30, 122 81',{head:true})+text(110,33,'1',{size:11,color:AM})+path('M 268 81 C 250 30, 310 30, 292 81',{head:true})+text(280,33,'0',{size:11,color:AM});
    s+=arrow(138,100,252,100,'0')+arrow(308,100,422,100,'1');
    s+=path('M 433 124 Q 365 170 297 124',{head:true})+text(365,135,'0',{size:11,color:AM})+path('M 443 130 Q 280 235 117 130',{head:true})+text(280,196,'1',{size:11,color:AM});
    s+=circ(110,105,26,{stroke:CY,sw:1.6,fill:BG})+circ(280,105,26,{stroke:CY,sw:1.6,fill:BG})+circ(450,105,26,{stroke:LM,sw:1.6,fill:BG})+circ(450,105,21,{stroke:LM,sw:1.6});
    s+=text(110,100,'q0',{bold:true})+text(110,114,'nothing',{size:9,color:DIM})+text(280,100,'q1',{bold:true})+text(280,114,'saw 0',{size:9,color:DIM})+text(450,100,'q2',{bold:true})+text(450,114,'saw 01',{size:9,color:LM});
    s+=text(280,212,'reads once, left to right · no memory beyond the state',{size:9,color:DIM});
    return svg(560,222,s,'A three-state DFA for binary strings ending in 01'); })();
  const reductions=(()=>{ let s=box(170,10,220,30,'every problem in NP',{stroke:CY,size:11})+arrow(280,40,280,62,'')+text(290,51,'Cook–Levin 1971',{size:9,color:DIM,anchor:'start'})+box(230,62,100,30,'SAT',{stroke:MG,bold:true})+arrow(280,92,280,114,'')+text(290,103,'≤p',{size:10,color:DIM,anchor:'start'})+box(230,114,100,30,'3-SAT',{stroke:MG,bold:true});
    const r3=[['CLIQUE',20],['VERTEX COVER',150],['HAMILTONIAN CYCLE',298],['SUBSET SUM',428]]; r3.forEach(([t,x])=>{ s+=arrow(280,144,x+56,172,'')+box(x,172,112,30,t,{size:10,fill:BG}); });
    [['INDEPENDENT SET',20],['TSP (decision)',298],['KNAPSACK',428]].forEach(([t,x])=>{ s+=arrow(x+56,202,x+56,224,'')+box(x,224,112,30,t,{size:10,stroke:AM}); });
    s+=text(100,70,'A ≤p B: turn any A',{size:10})+text(100,86,'into B in poly time',{size:10})+text(100,102,'⇒ B is at least',{size:10})+text(100,118,'as hard as A',{size:10});
    s+=text(460,70,'poly algorithm for any one',{size:10})+text(460,86,'⇒ all of NP in P ⇒ P = NP',{size:10,color:AM})+text(460,118,'Karp 1972: 21 problems',{size:9,color:DIM});
    return svg(560,265,s,'Polynomial-time reductions from SAT to other NP-complete problems'); })();
  const regexCompare=compare({t:'BACKTRACKING ENGINE',draw:x=>[['PCRE · Python re · Java · JS','currentColor'],['tries alternatives one by one','currentColor'],['supports backreferences, lookaround',DIM],['(a+)+$ on 30 a\'s then "!"',AM],['≈ 2³⁰ paths before it fails',MG],['seconds of CPU per request → ReDoS',MG]].map(([t,c],i)=>text(x+130,52+i*24,t,{size:10,color:c})).join('')},
    {t:'AUTOMATA ENGINE',draw:x=>[['RE2 · Go regexp · Rust regex','currentColor'],['Hyperscan inside Suricata','currentColor'],['simulates the NFA: O(n · m)',DIM],['no backreferences by design',DIM],['linear time, any pattern',LM],['the fix: RE2 or a length cap',LM]].map(([t,c],i)=>text(x+130,52+i*24,t,{size:10,color:c})).join('')},{h:205,label:'Backtracking versus automata regex engines'});
  I.p13m7=[{cap:"A deterministic finite automaton for 'binary strings ending in 01': three states, one transition per (state, symbol), a start arrow and a double-circled accepting state. It reads the input once and remembers nothing but its current state, which is exactly why no DFA can count brackets.",svg:dfa},
   {cap:"NP-completeness is proved by reduction. Cook and Levin showed every NP problem converts to SAT in polynomial time; Karp converted SAT onward to 21 more. Each arrow says 'solve the lower one fast and you solve the upper one fast', so one polynomial algorithm anywhere in the chain gives P = NP.",svg:reductions},
   {cap:"Same regular language, two engines. A backtracking matcher given nested quantifiers tries exponentially many splits before rejecting a near-match (ReDoS); an automata-based engine simulates the NFA in time linear in the input. Analyze patterns in your own harness before they reach a WAF.",svg:regexCompare}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
