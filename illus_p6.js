/* Illustrations — Domain 6: Java. Adds figures to the originals in illus_more.js (concatenated, never replaced). Numbers in the figures are the measured results of this domain's worked examples (OpenJDK 21.0.12). */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const E=window.ILLUS||{}; const I={};
  const path=(d,o={})=>'<path d="'+d+'" fill="none" stroke="'+(o.stroke||'currentColor')+'" stroke-width="'+(o.sw||1.3)+'"'+(o.dash?' stroke-dasharray="5 4"':'')+(o.noarrow?'':' marker-end="url(#ah)"')+'/>';
  const rect=(x,y,w,h,o={})=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(o.rx==null?2:o.rx)+'" fill="'+(o.fill||'none')+'" stroke="'+(o.stroke||'currentColor')+'" stroke-width="'+(o.sw||1.2)+'"'+(o.dash?' stroke-dasharray="4 3"':'')+(o.op?' fill-opacity="'+o.op+'"':'')+'/>';
  const T=(x,y,t,o={})=>text(x,y,t,Object.assign({size:11},o));

  /* ---------- Module 1: the JVM ---------- */
  const jit=[5224,3305,2215,2594,2288,2137,2240,2071], interp=[37472,37418,37585,38168,37532,34714,34725,34712];
  I.p6m1=(E.p6m1||[]).concat([
   {cap:"Tiered compilation: every method starts in the interpreter; after about 200 calls C1 compiles it with profiling, after about 5,000 C2 recompiles it using that profile. Hot loops switch mid-run by on-stack replacement, and a failed speculation sends the method back to the interpreter (deoptimization).",
    svg:svg(560,190,T(280,16,'one method’s life inside HotSpot',{size:12,bold:true,color:CY})+
      box(10,40,130,58,'Interpreter\ntier 0',{stroke:DIM})+arrow(142,69,213,69,'~200')+box(215,40,130,58,'C1 + profiling\ntier 3',{stroke:AM})+arrow(347,69,418,69,'~5,000')+box(420,40,130,58,'C2 optimized\ntier 4',{stroke:LM,bold:true})+
      T(177,110,'invocations',{size:10,color:DIM})+T(382,110,'invocations',{size:10,color:DIM})+
      path('M485 98 L485 140 L75 140 L75 101',{stroke:MG,dash:true})+T(280,154,'deoptimize when a speculation fails',{color:MG})+
      T(280,178,'OSR: a long loop jumps into compiled code mid-run',{size:10,color:DIM}),'Interpreter to C1 to C2 tiers with a deoptimization path back')},
   {cap:"Measured on this domain's two-core VM: the same 2-million-iteration method, eight rounds. Interpreter only (-Xint) costs about 37 ms every round; with the JIT, round 1 is 5.2 ms and the steady state about 2.1 ms — roughly 17 times faster.",
    svg:svg(560,215,T(280,14,'microseconds per round: -Xint vs tiered JIT',{size:12,bold:true,color:CY})+
      rect(330,28,12,10,{fill:'currentColor',stroke:DIM,op:0.25})+T(348,33,'interpreter',{anchor:'start',size:10,color:DIM})+rect(430,28,12,10,{fill:'currentColor',stroke:LM,op:0.8})+T(448,33,'JIT',{anchor:'start',size:10,color:LM})+
      line(30,175,545,175,{stroke:DIM})+
      jit.map((v,r)=>{ const x0=40+r*63, hi=Math.round(interp[r]/38168*120), hj=Math.max(2,Math.round(v/38168*120));
        return rect(x0,175-hi,24,hi,{fill:'currentColor',stroke:DIM,op:0.25})+rect(x0+27,175-hj,24,hj,{fill:'currentColor',stroke:LM,op:0.8})+T(x0+26,190,'round '+(r+1),{size:10,color:DIM}); }).join('')+
      T(52,47,'37 ms',{size:10,color:DIM})+T(79,150,'5.2 ms',{size:10,color:LM})+T(520,158,'2.1 ms',{size:10,color:LM})+
      T(280,207,'steady state: 37,000 / 2,100 ≈ 17× faster',{size:11,color:AM}),'Bar chart of interpreter versus JIT round times')},
   {cap:"Class loading: a class is loaded the first time it is needed. Each loader asks its parent first (parent delegation), so core classes always come from the bootstrap loader. Every class is then verified, prepared, resolved and initialized. Hello world loaded 541 classes, 532 of them from the class data sharing archive.",
    svg:svg(560,215,T(140,14,'loaders (parent first)',{size:12,bold:true,color:CY})+
      box(30,28,220,40,'Bootstrap loader\njava.base',{size:11,stroke:CY})+box(30,88,220,40,'Platform loader\nother JDK modules',{size:11})+box(30,148,220,40,'Application loader\nyour class path',{size:11,stroke:AM})+
      arrow(140,146,140,131,'')+arrow(140,86,140,71,'')+T(140,204,'541 classes for Hello; 532 from CDS',{size:10,color:DIM})+
      T(420,14,'then, per class',{size:12,bold:true,color:CY})+
      ['load the bytes','verify types and jumps','prepare static defaults','resolve symbolic refs','initialize: static blocks'].map((t,i)=>box(330,26+i*37,180,28,t,{size:11,stroke:i===1?LM:'currentColor'})+(i<4?arrow(420,54+i*37,420,62+i*37,''):'')).join(''),'Class loader hierarchy and the load verify prepare resolve initialize phases')}
  ]);

  /* ---------- Module 2: types ---------- */
  const prim=[['byte',1,'-128 to 127'],['short',2,'±32,767'],['char',2,'0 to 65,535'],['int',4,'±2.1 billion'],['float',4,'~7 digits'],['long',8,'±9.2 × 10^18'],['double',8,'~15–17 digits']];
  I.p6m2=(E.p6m2||[]).concat([
   {cap:"The primitives drawn to scale, one cell per byte. Unlike C, these sizes are fixed by the language on every platform; boolean's size is left to the JVM.",
    svg:svg(560,200,T(280,12,'one cell = one byte',{size:11,color:DIM})+prim.map(([n,b,r],i)=>{ const y=24+i*24; let s=T(48,y+10,n,{anchor:'end',size:11,mono:true,color:i===3?CY:'currentColor'});
        for(let k=0;k<b;k++) s+=rect(58+k*38,y,34,20,{stroke:i===3?CY:(b===8?AM:DIM)}); return s+T(66+b*38,y+10,r,{anchor:'start',size:11}); }).join(''),'Primitive types drawn to scale in bytes')},
   {cap:"int arithmetic wraps silently: one past 2,147,483,647 is -2,147,483,648. Thirty days in milliseconds computed in int overflows and wraps before it is widened to long.",
    svg:svg(560,175,line(40,70,520,70,{sw:1.6})+line(40,64,40,76)+line(280,64,280,76)+line(520,64,520,76)+
      T(14,88,'-2,147,483,648',{anchor:'start',size:10,mono:true})+T(280,88,'0',{size:10,mono:true})+T(546,88,'2,147,483,647',{anchor:'end',size:10,mono:true})+
      path('M520 62 C 505 12, 55 12, 40 60',{stroke:MG})+T(280,48,'MAX_VALUE + 1 wraps to MIN_VALUE',{color:MG})+
      T(280,112,'30 × 24 × 60 × 60 × 1000 = 2,592,000,000 (too big for int)',{size:11,mono:true})+
      T(280,134,'2,592,000,000 − 4,294,967,296 = −1,702,967,296',{size:11,mono:true,color:MG})+
      T(280,158,'fix: 30L * 24 * ... or Math.multiplyExact',{size:11,color:LM}),'Integer overflow wraparound and the thirty days example')},
   {cap:"Autoboxing goes through Integer.valueOf, which caches -128 to 127. Two boxed 127s are the same cached object; two boxed 128s are separate objects, so == (same object?) is false while equals (same value?) is true.",
    svg:compare({t:'BOXED 127: ONE OBJECT',draw:o=>box(o+20,50,46,26,'a',{stroke:CY,bold:true})+box(o+20,100,46,26,'b',{stroke:CY,bold:true})+arrow(o+66,63,o+138,80,'')+arrow(o+66,113,o+138,96,'')+
        box(o+140,66,104,44,'Integer 127\n(cached)',{size:11,stroke:LM})+T(o+130,148,'a == b  →  true',{mono:true,color:LM})},
      {t:'BOXED 128: TWO OBJECTS',draw:o=>box(o+20,50,46,26,'c',{stroke:MG,bold:true})+box(o+20,100,46,26,'d',{stroke:MG,bold:true})+arrow(o+66,63,o+138,58,'')+arrow(o+66,113,o+138,118,'')+
        box(o+140,40,104,34,'Integer 128',{size:11,stroke:MG})+box(o+140,102,104,34,'Integer 128',{size:11,stroke:MG})+T(o+130,150,'c == d → false',{mono:true,color:MG})+T(o+130,166,'c.equals(d) → true',{mono:true,size:10,color:LM})},{h:185,label:'Integer cache: shared object for 127, separate objects for 128'})}
  ]);

  /* ---------- Module 3: objects ---------- */
  const strip=(y,cells,total,title)=>T(20,y-10,title,{anchor:'start',size:11,bold:true,color:CY})+cells.map(([w,lab,st,d],i)=>{ const x=20+cells.slice(0,i).reduce((s,c)=>s+c[0],0)*18; return box(x,y,w*18,30,lab,{size:10,rx:2,stroke:st||'currentColor',dash:d}); }).join('')+T(20+cells.reduce((s,c)=>s+c[0],0)*18+10,y+15,total,{anchor:'start',size:11,bold:true,color:AM});
  I.p6m3=(E.p6m3||[]).concat([
   {cap:"What objects cost on 64-bit HotSpot (one square = one byte): a 12-byte header (8-byte mark word plus 4-byte compressed class pointer), fields, then padding to a multiple of 8. Compact object headers (JDK 25 option, JDK 27 default) cut the header to 8 bytes.",
    svg:svg(560,215,strip(32,[[8,'mark word 8',DIM],[4,'class 4',DIM],[4,'owner ref 4',CY],[8,'balance double 8',LM]],'24 bytes','Account (String ref + double)')+
      strip(102,[[12,'header 12',DIM],[4,'x 4',LM],[4,'y 4',LM],[4,'pad 4',DIM,true]],'24 bytes','record Point(int x, int y)')+
      strip(172,[[8,'header 8',AM],[4,'x 4',LM],[4,'y 4',LM]],'16 bytes','Point with compact headers'),'Object memory layouts in bytes')},
   {cap:"What new does, in order: initialize the class once, bump-allocate on the heap and zero the memory, run the constructor chain from Object downward, run field initializers, then the constructor body — and only then hand back the reference.",
    svg:flow([{t:'class init\n(once)',stroke:DIM},{t:'allocate\nTLAB bump'},{t:'zero fields\n0, null, false'},{t:'super() chain\nObject first',stroke:AM},{t:'field inits\nthen body'},{t:'reference\nreturned',stroke:LM}],{bw:110,bh:54,gap:40,label:'Steps performed by the new operator'})},
   {cap:"One line of record declaration on the left; everything javac generates on the right (confirmed with javap -p in the worked example). The compact constructor runs before the field is assigned, so an invalid Money can never exist.",
    svg:compare({t:'YOU WRITE',draw:o=>T(o+16,58,'record Money(long cents) {',{anchor:'start',mono:true,size:11})+T(o+16,80,'\u00a0\u00a0Money {',{anchor:'start',mono:true,size:11})+T(o+16,100,'\u00a0\u00a0\u00a0\u00a0if (cents < 0)',{anchor:'start',mono:true,size:11})+T(o+16,120,'\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0throw ...;',{anchor:'start',mono:true,size:11})+T(o+16,140,'\u00a0\u00a0}',{anchor:'start',mono:true,size:11})+T(o+16,160,'}',{anchor:'start',mono:true,size:11})},
      {t:'JAVAC GENERATES',draw:o=>['final class extends Record','private final long cents','canonical constructor','accessor cents()','equals and hashCode','toString: Money[cents=500]'].map((t,i)=>T(o+16,56+i*21,'• '+t,{anchor:'start',size:11,color:i<2?CY:LM})).join('')},{h:185,label:'Record declaration versus generated members'})}
  ]);

  /* ---------- Module 4: polymorphism ---------- */
  I.p6m4=(E.p6m4||[]).concat([
   {cap:"Dynamic dispatch: the compiler checks area() against the static type Shape; at run time the JVM follows the object's header to its class and calls whatever sits in that method's vtable slot. A call site that only ever sees one class gets inlined by the JIT.",
    svg:svg(560,200,box(10,74,104,44,'Shape s\n(reference)',{size:11,stroke:CY})+arrow(116,96,162,96,'')+box(164,66,128,60,'Circle object\nheader | r = 1.0',{size:11})+arrow(294,96,342,96,'')+
      T(318,84,'class',{size:10,color:DIM})+box(344,22,206,150,'',{stroke:AM})+T(447,40,'Circle vtable',{bold:true,color:AM})+
      box(356,56,182,26,'toString → Circle (generated)',{size:10,stroke:DIM})+box(356,90,182,26,'hashCode → Circle (generated)',{size:10,stroke:DIM})+box(356,124,182,26,'area → Circle.area',{size:11,stroke:LM,bold:true})+
      T(150,160,'invokevirtual area()',{mono:true,size:11})+T(150,182,'one class seen → JIT inlines',{size:10,color:LM}),'Dynamic dispatch through an object header and a vtable')},
   {cap:"The fragile base class, traced: the subclass's addAll counts 3 and calls the inherited addAll, which calls the overridden add once per element and counts 3 more. Composition forwards to a private HashSet whose internals cannot reach the counter.",
    svg:svg(560,200,T(280,14,'extends HashSet: counted 6',{size:12,bold:true,color:MG})+
      box(10,28,124,48,'addAll(a, b, c)\ncount += 3',{size:11,stroke:MG})+arrow(136,52,152,52,'')+box(154,28,124,48,'super.addAll\nAbstractCollection',{size:10})+arrow(280,52,296,52,'')+
      box(298,28,124,48,'calls add() 3×\noverridden!',{size:11,stroke:MG})+arrow(424,52,440,52,'')+box(442,28,108,48,'count += 1 × 3\n= 6',{size:11,stroke:MG,bold:true})+
      T(280,112,'composition: counted 3',{size:12,bold:true,color:LM})+
      box(10,126,160,48,'wrapper.addAll\ncount += 3',{size:11,stroke:LM})+arrow(172,150,200,150,'')+box(202,126,160,48,'inner.addAll\nplain HashSet',{size:11})+arrow(364,150,392,150,'')+box(394,126,156,48,'count = 3',{size:12,stroke:LM,bold:true})+
      T(280,192,'depend on contracts, not on a parent’s internals',{size:10,color:DIM}),'Inherited addAll double counting versus composition')},
   {cap:"A sealed interface names its permitted subtypes, so the compiler can check that a pattern switch handles every one. Adding Hex to the permits list turns each unhandled switch into a compile error — the compiler lists every place to update.",
    svg:svg(560,205,box(95,14,120,32,'sealed Shape',{stroke:CY,bold:true})+line(155,46,55,84)+line(155,46,155,84)+line(155,46,255,84)+
      box(15,84,80,30,'Circle',{size:11})+box(115,84,80,30,'Rect',{size:11})+box(215,84,80,30,'Tri',{size:11})+T(155,128,'records: final, permitted',{size:10,color:DIM})+
      box(105,150,100,30,'+ Hex ?',{size:11,stroke:MG,dash:true})+T(155,195,'switch no longer exhaustive',{size:10,color:MG})+
      box(320,14,230,170,'',{stroke:AM})+T(334,38,'return switch (s) {',{anchor:'start',mono:true,size:11})+T(334,62,'\u00a0\u00a0case Circle c -> ...;',{anchor:'start',mono:true,size:11})+
      T(334,84,'\u00a0\u00a0case Rect r -> ...;',{anchor:'start',mono:true,size:11})+T(334,106,'\u00a0\u00a0case Tri t -> ...;',{anchor:'start',mono:true,size:11})+T(334,128,'};',{anchor:'start',mono:true,size:11})+
      T(435,156,'exhaustive: no default',{size:11,color:LM})+T(435,174,'Hex added → compile error',{size:10,color:MG}),'Sealed hierarchy with an exhaustive pattern switch')}
  ]);

  /* ---------- Module 5: collections ---------- */
  // The original Domain 6 tree figure (illus_more.js) is kept with its caption and content, but redrawn: the kit's tree() places the
  // first grandchild ('ArrayList') 5 px outside its 350-px viewBox, which fails the figure check. Same six classes, same three interfaces.
  const kidX=[98,282,466], gk=['ArrayList','LinkedList','HashSet','TreeSet','HashMap','TreeMap'];
  const treeFixed=svg(560,190,box(227,10,110,34,'Collections',{stroke:CY,bold:true})+
    ['List\n(ordered)','Set\n(unique)','Map\n(key\u2192value)'].map((t,i)=>line(282,44,kidX[i],74)+box(kidX[i]-60,74,120,38,t,{size:11})).join('')+
    gk.map((g,k)=>line(kidX[Math.floor(k/2)],112,52+k*92,146)+box(10+k*92,146,84,30,g,{size:10})).join(''),'Java collections hierarchy');
  const fixTree=f=>(f&&/^The three main collection interfaces/.test(f.cap))?{cap:f.cap,svg:treeFixed}:f;
  I.p6m5=(E.p6m5||[]).map(fixTree).concat([
   {cap:"Inside a HashMap: the key's hashCode is mixed and masked to pick one of 16 buckets; colliding keys chain in the bucket, and a chain of 8 or more in a table of at least 64 becomes a red-black tree. At 12 entries (16 × 0.75) the table doubles and every entry is rehashed.",
    svg:svg(560,215,T(280,14,'index = (h ^ (h >>> 16)) & (16 - 1)',{size:11,mono:true,color:CY})+
      Array.from({length:16},(_,i)=>box(24+i*32,34,30,26,String(i),{size:10,rx:2,stroke:[3,9,12].includes(i)?AM:DIM})).join('')+
      box(14+3*32,82,50,24,'"C1"',{size:10,mono:true})+line(39+3*32,60,39+3*32,82)+box(14+3*32,118,50,24,'"S7"',{size:10,mono:true})+line(39+3*32,106,39+3*32,118)+T(78+3*32,130,'chain',{anchor:'start',size:10,color:DIM})+
      box(14+9*32,82,50,24,'"F2"',{size:10,mono:true})+line(39+9*32,60,39+9*32,82)+
      line(39+12*32,60,39+12*32,82)+box(4+12*32,82,70,48,'tree when\n≥ 8 here',{size:10,stroke:LM})+
      T(280,166,'load factor 0.75: resize at 12 entries, then 24, 48, ...',{size:11,color:AM})+
      T(280,190,'1,000,000 keys → 2^21 buckets after 17 resizes',{size:11})+T(280,207,'HashMap.newHashMap(n) presizes',{size:10,color:LM}),'HashMap bucket array with chains and a treeified bin')},
   {cap:"Why the same 100,000 indexed reads took 0.76 ms on an ArrayList and 6.7 s on a LinkedList: the array computes the slot's address directly, while each LinkedList.get(i) chases about n/4 = 25,000 scattered nodes, missing the CPU cache on most hops.",
    svg:compare({t:'ARRAYLIST: CONTIGUOUS',draw:o=>Array.from({length:6},(_,i)=>box(o+20+i*37,52,35,30,String(i),{size:11,rx:2,stroke:i===4?LM:CY})).join('')+
        arrow(o+185,108,o+185,86,'')+T(o+130,124,'get(4): base + 4 × 4 bytes',{size:11})+T(o+130,148,'measured 0.76 ms',{size:11,color:LM,bold:true})},
      {t:'LINKEDLIST: CHAINED',draw:o=>[[14,52],[64,98],[114,48],[164,100],[214,58]].map(([x,y],i,a)=>box(o+x,y,38,26,'n'+i,{size:10,stroke:i===4?MG:DIM})+(i<a.length-1?arrow(o+x+38,y+13,o+a[i+1][0]-2,a[i+1][1]+13,''):'')).join('')+
        T(o+130,148,'measured 6.7 s',{size:11,color:MG,bold:true})+T(o+130,166,'~2.5 billion pointer hops',{size:10,color:DIM})},{h:185,label:'ArrayList contiguous array versus LinkedList node chain'})},
   {cap:"Type erasure: javac checks List<String> at compile time, then erases the type argument and inserts a cast where values come out. At run time there is one class, so List<String> and List<Integer> are indistinguishable and a raw-type insert fails only when read.",
    svg:flow([{t:'source\nList<String> names',stroke:CY},{t:'bytecode\nList + (String) cast',stroke:AM,edge:'erase'},{t:'run time\njava.util.ArrayList',stroke:LM,edge:'run'}],{bw:140,bh:58,gap:50,label:'Generic source erased to raw bytecode with casts'})}
  ]);

  /* ---------- Module 6: memory and GC ---------- */
  const before=[7,15,36,39,44,47,50,53,54,54,55,56,56,56,56], after=[1,3,6,10,13,16,20,23,26,29,32,34,36,38,40];
  const gx=i=>60+i*33, gy=v=>178-v*2.2;
  I.p6m6=(E.p6m6||[]).concat([
   {cap:"The generational heap: new objects go into eden; a young collection copies the few survivors into a survivor space and empties eden wholesale; objects that survive enough collections are promoted to the old generation. Cost follows the survivors, not the garbage.",
    svg:svg(560,190,T(150,16,'young generation',{bold:true,color:CY})+T(430,16,'old generation',{bold:true,color:AM})+
      box(10,30,170,60,'eden\nnew objects',{stroke:CY})+box(186,30,52,60,'S0',{size:11,stroke:CY})+box(244,30,52,60,'S1',{size:11,stroke:CY,dash:true})+box(310,30,240,60,'old\nlong-lived objects',{stroke:AM})+
      arrow(95,128,95,93,'')+T(95,140,'new Account()',{size:10,mono:true,color:DIM})+
      path('M150 92 C 170 120, 200 120, 210 93',{stroke:LM})+T(176,128,'survivors',{size:10,color:LM})+
      path('M270 92 C 300 130, 380 130, 410 93',{stroke:AM})+T(340,138,'promoted after N GCs',{size:10,color:AM})+
      T(280,172,'most objects die young: eden is cleared, not swept',{size:11,color:DIM}),'Eden, survivor spaces and old generation')},
   {cap:"One real G1 log line from the worked example, taken apart. The after value (10M) approximates the live data; the committed heap is 64M; the application was paused for 4.96 ms.",
    svg:svg(560,200,T(280,16,'GC(3) Pause Young (Normal) (G1 Evacuation Pause) 39M->10M(64M) 4.960ms',{size:10,mono:true,color:CY})+
      box(10,36,80,28,'GC(3)',{size:11,mono:true,stroke:DIM})+box(100,36,190,28,'Pause Young (Normal)',{size:11,mono:true,stroke:CY})+box(300,36,250,28,'(G1 Evacuation Pause)',{size:11,mono:true,stroke:DIM})+
      T(50,78,'4th collection',{size:10,color:DIM})+T(195,78,'young-generation pause',{size:10,color:CY})+T(425,78,'cause: eden full',{size:10,color:DIM})+
      box(10,104,170,32,'39M->10M',{size:12,mono:true,stroke:LM,bold:true})+box(190,104,120,32,'(64M)',{size:12,mono:true,stroke:AM})+box(320,104,230,32,'4.960ms',{size:12,mono:true,stroke:MG})+
      T(95,150,'before -> after',{size:10,color:LM})+T(95,166,'after ≈ live set',{size:10,color:LM})+T(250,150,'committed heap',{size:10,color:AM})+T(435,150,'stop-the-world pause',{size:10,color:MG})+
      T(280,192,'watch the after value across many lines',{size:11,color:DIM}),'Decoded fields of a G1 GC log line')},
   {cap:"The leak signature, plotted from the worked example's real log: heap before each young collection (dashed) and after it (solid). A healthy service's after-values hover at a flat floor; here the floor rises every cycle because a static list keeps every tenth reading alive.",
    svg:svg(560,215,T(280,14,'after-GC heap climbs every collection = leak',{size:12,bold:true,color:MG})+
      line(50,178,545,178,{stroke:DIM})+line(50,30,50,178,{stroke:DIM})+line(50,gy(64),545,gy(64),{stroke:AM,dash:true})+T(540,gy(64)-8,'heap limit 64M',{anchor:'end',size:10,color:AM})+
      T(44,gy(0),'0',{anchor:'end',size:10,color:DIM})+T(44,gy(32),'32M',{anchor:'end',size:10,color:DIM})+
      '<polyline points="'+before.map((v,i)=>gx(i)+','+gy(v)).join(' ')+'" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3"/>'+
      '<polyline points="'+after.map((v,i)=>gx(i)+','+gy(v)).join(' ')+'" fill="none" stroke="'+MG+'" stroke-width="2"/>'+
      after.map((v,i)=>'<circle cx="'+gx(i)+'" cy="'+gy(v)+'" r="2.5" fill="'+MG+'"/>').join('')+
      T(gx(14),gy(40)+16,'40M',{size:10,color:MG})+T(gx(7),gy(53)-10,'before GC',{size:10,color:DIM})+
      T(297,198,'young collections GC(0) to GC(15)',{size:10,color:DIM}),'Line chart of heap before and after each collection')}
  ]);

  /* ---------- Module 7: building ---------- */
  I.p6m7=(E.p6m7||[]).concat([
   {cap:"Maven's default lifecycle is a fixed order of phases; asking for one runs every phase before it, and plugins do the work at each phase (compiler, Surefire for tests, jar).",
    svg:flow([{t:'validate'},{t:'compile\ncompiler plugin',stroke:CY},{t:'test\nSurefire',stroke:LM},{t:'package\njar plugin',stroke:AM},{t:'verify'},{t:'install\n~/.m2 repo'},{t:'deploy\nremote repo'}],{bw:96,bh:54,gap:40,label:'Maven lifecycle phases in order'})},
   {cap:"Sizes from the worked example: the application JAR is 2.7 KB, the jlink runtime image with only java.base and the app module is 39 MB, and the full JDK it replaces is 286 MB.",
    svg:svg(560,160,T(280,14,'what you ship (MB, to scale)',{size:12,bold:true,color:CY})+
      T(118,44,'full JDK 21',{anchor:'end',size:11})+rect(126,32,400,24,{fill:'currentColor',stroke:DIM,op:0.25})+T(520,44,'286 MB',{anchor:'end',size:11,bold:true})+
      T(118,84,'jlink image',{anchor:'end',size:11,color:LM})+rect(126,72,Math.round(39/286*400),24,{fill:'currentColor',stroke:LM,op:0.8})+T(190,84,'39 MB',{anchor:'start',size:11,bold:true,color:LM})+
      T(118,124,'app.jar',{anchor:'end',size:11,color:AM})+rect(126,112,2,24,{fill:'currentColor',stroke:AM})+T(136,124,'2.7 KB',{anchor:'start',size:11,bold:true,color:AM})+
      T(280,152,'jdeps says: java.base only → jlink adds nothing else',{size:10,color:DIM}),'Bar chart of JDK, jlink image and jar sizes')},
   {cap:"Maven's 'nearest wins' mediation: common 1.4 sits two levels from your project and common 2.2 three, so 1.4 is chosen — and lib-b, compiled against 2.2, fails at run time with NoSuchMethodError. dependency:tree reveals it; dependencyManagement pins the version.",
    svg:svg(560,200,box(220,10,120,30,'your app',{stroke:CY,bold:true})+line(280,40,140,62)+line(280,40,420,62)+
      box(80,62,120,30,'lib-a 2.0',{size:11})+box(360,62,120,30,'lib-b 3.1',{size:11})+line(140,92,140,114)+line(420,92,420,114)+
      box(70,114,140,30,'common 1.4',{size:11,stroke:LM,bold:true})+box(360,108,120,28,'lib-c 1.0',{size:11})+line(420,136,420,148)+box(350,148,140,28,'common 2.2',{size:11,stroke:MG,dash:true})+
      T(140,158,'depth 2: chosen',{size:10,color:LM})+T(140,176,'lib-b breaks at run time',{size:10,color:MG})+T(280,194,'fix: pin common in dependencyManagement',{size:10,color:DIM}),'Dependency tree with nearest-wins version conflict')}
  ]);

  /* ---------- Module 8: concurrency ---------- */
  const lane=(y,lab,c)=>T(40,y,lab,{bold:true,color:c})+line(70,y,545,y,{stroke:DIM,dash:true});
  I.p6m8=[
   {cap:"A lost update, step by step: count++ is a read, an add and a write. Both threads read 41 before either writes, so both write 42 — two increments, one effect. The worked run lost 843,674 of 4,000,000 this way.",
    svg:svg(560,205,lane(40,'T1',CY)+lane(100,'heap',AM)+lane(160,'T2',MG)+
      box(85,26,92,28,'read 41',{size:11,stroke:CY,fill:'var(--bg)'})+box(305,26,92,28,'write 42',{size:11,stroke:CY,fill:'var(--bg)'})+box(195,146,92,28,'read 41',{size:11,stroke:MG,fill:'var(--bg)'})+box(415,146,92,28,'write 42',{size:11,stroke:MG,fill:'var(--bg)'})+
      box(100,86,62,28,'41',{size:12,stroke:AM,fill:'var(--bg)'})+box(210,86,62,28,'41',{size:12,stroke:AM,fill:'var(--bg)'})+box(320,86,62,28,'42',{size:12,stroke:AM,fill:'var(--bg)'})+box(430,86,62,28,'42',{size:12,stroke:MG,bold:true,fill:'var(--bg)'})+
      arrow(131,84,131,57,'')+arrow(241,116,241,143,'')+arrow(351,57,351,84,'')+arrow(461,143,461,116,'')+
      T(280,196,'two increments, one effect: 42, not 43',{size:11,color:MG}),'Two threads interleaving count plus plus and losing an update')},
   {cap:"Virtual threads are scheduled by the JVM onto a few carrier platform threads (one per core). When a virtual thread blocks it unmounts and its stack waits on the heap, so the carrier runs another. 10,000 tasks waiting 100 ms each took 5,101 ms on 200 platform threads and 208 ms this way.",
    svg:svg(560,232,T(280,14,'10,000 virtual threads (a few shown)',{size:11,bold:true,color:CY})+
      Array.from({length:10},(_,i)=>box(14+i*54,26,48,26,'VT'+(i+1),{size:10,stroke:i===2||i===6?LM:DIM,dash:!(i===2||i===6)})).join('')+
      line(146,52,170,96,{stroke:LM})+line(362,52,380,96,{stroke:LM})+T(100,76,'mounted',{size:10,color:LM})+T(420,76,'mounted',{size:10,color:LM})+
      box(110,96,140,32,'carrier thread 1',{size:11,stroke:LM})+box(310,96,140,32,'carrier thread 2',{size:11,stroke:LM})+line(180,128,180,148)+line(380,128,380,148)+
      box(110,148,340,28,'2 OS threads on 2 CPU cores',{size:11,stroke:DIM})+
      T(280,190,'dashed = blocked on I/O, stack parked on the heap',{size:10,color:DIM})+
      T(280,208,'200-thread pool: 50 waves \u00d7 100 ms \u2248 5.1 s',{size:11,color:AM})+T(280,224,'virtual threads: all wait at once \u2248 0.2 s',{size:11,color:LM}),'Many virtual threads multiplexed onto two carrier threads')},
   {cap:"Happens-before in the stop-flag demo: with a volatile field, main's write is ordered before the worker's later read, so the worker sees it and stops. With a plain field there is no edge; the JIT hoisted the read out of the loop and the worker spun forever.",
    svg:svg(560,200,T(150,16,'volatile boolean stop',{bold:true,color:LM})+T(420,16,'plain boolean stop',{bold:true,color:MG})+
      box(20,36,120,30,'main: sleep 500',{size:10})+box(20,96,120,30,'stop = true',{size:11,stroke:LM,bold:true})+arrow(80,66,80,93,'')+
      box(160,36,120,30,'worker: spin',{size:10})+box(160,96,120,30,'reads true',{size:11,stroke:LM})+box(160,148,120,30,'loop exits',{size:11,stroke:LM})+arrow(220,126,220,145,'')+
      arrow(142,111,158,111,'')+T(150,140,'HB edge',{size:10,color:LM})+
      line(290,30,290,185,{stroke:DIM,dash:true})+
      box(300,36,120,30,'main: sleep 500',{size:10})+box(300,96,120,30,'stop = true',{size:11,stroke:MG})+arrow(360,66,360,93,'')+
      box(430,36,120,30,'worker: spin',{size:10})+box(430,96,120,30,'read hoisted',{size:11,stroke:MG,dash:true})+box(430,148,120,30,'never exits',{size:11,stroke:MG,bold:true})+arrow(490,126,490,145,'')+
      T(425,192,'no edge: write may never be seen',{size:10,color:MG}),'Volatile write happens-before read versus a plain field with no edge')},
   {cap:"A deadlock is a cycle in the wait-for graph: transfer-1 holds lock A and waits for B while transfer-2 holds B and waits for A. jcmd Thread.print reports exactly this cycle. Acquiring locks in one global order makes the cycle impossible.",
    svg:svg(560,200,box(40,30,150,40,'transfer-1',{stroke:CY,bold:true})+box(370,30,150,40,'lock B',{stroke:AM})+
      box(40,130,150,40,'lock A',{stroke:AM})+box(370,130,150,40,'transfer-2',{stroke:MG,bold:true})+
      arrow(192,50,368,50,'waits for')+arrow(445,72,445,128,'held by')+arrow(368,150,192,150,'waits for')+arrow(115,128,115,72,'held by')+
      T(280,100,'a cycle: nobody can proceed',{size:11,color:MG})+
      T(280,190,'fix: always lock the lower account id first',{size:11,color:LM}),'Wait-for cycle between two threads and two locks')}
  ];

  /* ---------- Module 9: streams and a service ---------- */
  I.p6m9=[
   {cap:"A stream pipeline: a source, lazy intermediate operations, and one terminal operation that pulls elements through all stages one at a time. Nothing runs until toList() is called.",
    svg:flow([{t:'log.stream()\nsource',stroke:CY},{t:'filter\nloss > 0.15'},{t:'sorted\nworst first',stroke:AM},{t:'map\nto a label'},{t:'toList()\nterminal',stroke:LM}],{perRow:5,bw:92,bh:56,gap:18,label:'Stream pipeline from source to terminal operation'})},
   {cap:"Laziness and short-circuiting, from the worked run: findFirst() pulled splices one at a time and stopped at the first match, so peek printed only [C11][C12]; the other six were never touched.",
    svg:svg(560,150,T(280,14,'findFirst() over 8 splices, limit 0.15 dB',{size:12,bold:true,color:CY})+
      [['C1 f1','0.03'],['C1 f2','0.21'],['C1 f3','0.05'],['C2 f1','0.02'],['C2 f2','0.04'],['C3 f1','0.32'],['C3 f2','0.06'],['C3 f3','0.15']].map(([n,v],i)=>box(10+i*68,40,62,46,n+'\n'+v,{size:10,stroke:i===0?DIM:(i===1?LM:DIM),dash:i>1,bold:i===1})).join('')+
      T(41,100,'visited',{size:10,color:DIM})+T(109,100,'match: stop',{size:10,color:LM})+T(350,100,'never visited',{size:10,color:DIM})+
      T(280,126,'output: [C11][C12] first bad: C1',{size:11,mono:true,color:AM}),'Short-circuiting findFirst visiting only two elements')},
   {cap:"The worked SpliceService: curl sends HTTP to the JDK's HttpServer, each request runs on its own virtual thread, the handler validates and stores into a ConcurrentHashMap with an AtomicLong id, and the response goes back as JSON with 201, 400 or 405.",
    svg:flow([{t:'curl POST\n/splices',stroke:CY},{t:'HttpServer\n127.0.0.1:8091'},{t:'virtual thread\nper request',stroke:LM},{t:'handler\nGET POST 405'},{t:'ConcurrentHashMap\n+ AtomicLong id',stroke:AM},{t:'201 + JSON\nor 400',stroke:LM}],{bw:130,bh:56,gap:40,label:'Request flow through the JDK HTTP service'})},
   {cap:"The Spring Boot shape of the same service: the framework runs the server and JSON conversion, and its dependency-injection container builds each layer and hands it the layer below through its constructor.",
    svg:stack([{t:'HTTP request (Tomcat, virtual threads)',stroke:CY,side:'embedded server'},{t:'@RestController SpliceController',side:'JSON via Jackson'},{t:'@Service rules and validation',side:'injected repository'},{t:'@Repository data access',stroke:AM,side:'JDBC or JPA'},{t:'database (Domain 18)',stroke:LM,side:'PostgreSQL etc.'}],{w:300,h:34,side:true,label:'Spring Boot layers wired by dependency injection'})}
  ];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
