/* Illustrations — Domain 49: C++ and Rust: Modern Systems Programming, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  // row of equal cells (memory words, array elements)
  const cells=(x,y,w,h,labels,o={})=>labels.map((t,i)=>box(x+i*w,y,w,h,t,{size:o.size||10,mono:o.mono,stroke:(o.strokes&&o.strokes[i])||o.stroke||'currentColor',dash:o.dash||(o.dashes&&o.dashes[i]),color:o.color,rx:2})).join('');
  /* ================= DOMAIN 49: C++ and Rust ================= */

  /* ---------- Module 1: From C to C++ ---------- */
  I.p49m1=[{cap:"RAII in one picture. Objects built in a scope are destroyed in reverse order on every way out of it — normal return, early return or an exception — so the file is always closed and the lock always released, with no cleanup label to forget.",
    svg:svg(560,215,
      box(10,24,160,140,'',{dash:true,stroke:DIM})+text(90,14,'inside one scope { ... }',{size:10,color:DIM})+
      box(22,36,136,32,'1. File f(path)',{stroke:CY,size:11})+box(22,78,136,32,'2. scoped_lock l(m)',{stroke:CY,size:11})+box(22,120,136,32,'3. vector buf(n)',{stroke:CY,size:11})+
      box(214,30,126,30,'normal return',{size:11})+box(214,79,126,30,'early return',{size:11})+box(214,128,126,30,'exception thrown',{size:11,stroke:MG})+
      arrow(172,60,212,45,'')+arrow(172,94,212,94,'')+arrow(172,128,212,143,'')+
      box(384,30,166,30,'~buf  runs first',{stroke:LM,size:11})+box(384,79,166,30,'~l  unlocks the mutex',{stroke:LM,size:11})+box(384,128,166,30,'~f  closes the file',{stroke:LM,size:11})+
      arrow(342,45,382,45,'')+arrow(342,94,382,94,'')+arrow(342,143,382,143,'')+
      text(467,18,'destructors, reverse order',{size:10,color:LM})+
      text(280,190,'every exit path runs the same destructors — no goto cleanup',{size:11,color:AM})+
      text(280,206,'(Domain 15 C needed one cleanup label per resource)',{size:10,color:DIM}),
      'RAII: three objects constructed in a scope, three exit paths, destructors run in reverse order')},
   {cap:"Name mangling, decoded. The Itanium C++ ABI used by GCC and Clang writes the namespace, the name lengths and the parameter types into the symbol so overloads can coexist; extern \"C\" turns it off, which is how C++ and Rust both talk to C.",
    svg:svg(560,215,
      text(280,16,'double fiber::loss(double km)   →   nm shows',{size:11,bold:true,color:CY})+
      [['_Z',58,CY],['N',50,AM],['5fiber',96,LM],['4loss',86,LM],['E',50,AM],['d',60,MG]].reduce((acc,s)=>{ const x=acc.x; acc.out+=box(x,28,s[1],32,s[0],{mono:true,size:12,stroke:s[2],rx:3}); acc.x+=s[1]+6; return acc; },{x:40,out:''}).out+
      text(69,76,'C++\nsymbol',{size:9,color:DIM})+text(129,76,'nested\nname',{size:9,color:DIM})+text(208,76,'length 5\n+ fiber',{size:9,color:DIM})+text(305,76,'length 4\n+ loss',{size:9,color:DIM})+text(379,76,'end of\nname',{size:9,color:DIM})+text(440,76,'param:\ndouble',{size:9,color:DIM})+
      line(20,104,540,104,{stroke:DIM})+
      text(30,122,'int add(int, int)',{anchor:'start',size:10,mono:true})+text(330,122,'_Z3addii',{anchor:'start',size:10,mono:true,color:LM})+
      text(30,141,'double add(double, double)',{anchor:'start',size:10,mono:true})+text(330,141,'_Z3adddd',{anchor:'start',size:10,mono:true,color:LM})+
      text(30,160,'double Splice::db() const',{anchor:'start',size:10,mono:true})+text(330,160,'_ZNK6Splice2dbEv',{anchor:'start',size:10,mono:true,color:LM})+
      text(30,179,'extern "C" int c_add(int, int)',{anchor:'start',size:10,mono:true})+text(330,179,'c_add  (unmangled)',{anchor:'start',size:10,mono:true,color:AM})+
      text(280,204,'nm -C or c++filt turns the right column back into the left',{size:10,color:DIM}),
      'Decoding the mangled symbol _ZN5fiber4lossEd and three more examples')},
   {cap:"What virtual costs. A polymorphic object gains an 8-byte vtable pointer (sizeof goes from 16 to 24 bytes); a call through a base reference loads that pointer, loads a slot and makes an indirect call — the call [rax+0x18] shape of Domain 11.",
    svg:svg(560,215,
      text(85,16,'VLink object (24 B)',{size:11,bold:true,color:CY})+
      box(20,28,130,30,'vptr  (8 B)',{stroke:MG,size:11})+box(20,58,130,30,'km: double  (8 B)',{size:11})+box(20,88,130,30,'splices: int  (4 B)',{size:11})+box(20,118,130,30,'padding  (4 B)',{size:10,dash:true,stroke:DIM,color:DIM})+
      text(290,16,'vtable for VLink',{size:11,bold:true,color:MG})+
      box(220,28,150,30,'slot 0: VLink::loss',{mono:true,size:10,stroke:MG})+box(220,58,150,30,'slot 1: ~VLink',{mono:true,size:10})+
      text(480,16,'machine code',{size:11,bold:true,color:LM})+
      box(415,28,130,30,'VLink::loss()',{mono:true,size:10,stroke:LM})+box(415,68,130,30,'VLink::~VLink()',{mono:true,size:10})+
      arrow(152,43,218,43,'')+arrow(372,43,413,43,'')+arrow(372,73,413,81,'')+
      text(280,176,'p->loss():  mov rax,[rdi]  →  call [rax+0]  (indirect)',{size:11,mono:true,color:AM})+
      text(280,198,'non-virtual members: a direct call, inlinable, same cost as C',{size:10,color:DIM}),
      'Object layout with a vtable pointer and the indirect call path')}];

  /* ---------- Module 2: Templates and the STL ---------- */
  I.p49m2=[{cap:"Stepanov's insight. Without a common interface, every algorithm must be written for every container (M × N). With iterators in the middle, each container provides iterators once and each algorithm is written once against them (M + N).",
    svg:compare({t:'WITHOUT ITERATORS: M × N',draw:x=>{ let s=''; const cs=['vector','list','map'], as=['sort','find','copy']; cs.forEach((c,i)=>{ s+=box(x+18,44+i*36,72,26,c,{size:11,stroke:CY}); }); as.forEach((a,j)=>{ s+=box(x+170,44+j*36,72,26,a,{size:11,stroke:AM}); }); cs.forEach((c,i)=>as.forEach((a,j)=>{ s+=line(x+90,57+i*36,x+170,57+j*36,{stroke:DIM}); })); s+=text(x+130,166,'3 × 3 = 9 implementations',{size:10,color:MG}); return s; }},
      {t:'WITH ITERATORS: M + N',draw:x=>{ let s=''; const cs=['vector','list','map'], as=['sort','find','copy']; cs.forEach((c,i)=>{ s+=box(x+12,44+i*36,64,26,c,{size:11,stroke:CY}); s+=line(x+76,57+i*36,x+104,93,{stroke:DIM}); }); s+=box(x+104,76,56,34,'iterator',{size:10,stroke:LM,bold:true}); as.forEach((a,j)=>{ s+=box(x+186,44+j*36,62,26,a,{size:11,stroke:AM}); s+=line(x+160,93,x+186,57+j*36,{stroke:DIM}); }); s+=text(x+130,166,'3 + 3 = 6 pieces of code',{size:10,color:LM}); return s; }},{h:185,label:'M times N implementations versus M plus N with iterators'})},
   {cap:"Amortized O(1), drawn. Each time a vector fills, it allocates double the capacity and moves the old elements across. The moves form the series 1 + 2 + 4 + …, which never exceeds the number of elements pushed: about one move per push_back on average.",
    svg:svg(560,215,
      [1,2,4,8,16].map((c,i)=>{ const y=16+i*30; let s=text(40,y+11,'cap '+c,{size:10,anchor:'end',color:DIM}); for(let k=0;k<c;k++){ const old=k<c/2&&c>1; s+=`<rect x="${50+k*15}" y="${y}" width="13" height="22" rx="2" fill="${old?CY:'none'}" opacity="${old?0.35:1}" stroke="${old?CY:DIM}" stroke-width="1.1"/>`; } s+=text(50+c*15+14,y+11,c===1?'first allocation':'grow: move '+(c/2)+' old',{size:10,anchor:'start',color:c===1?DIM:AM}); return s; }).join('')+
      text(280,176,'1,000,000 push_backs: 21 allocations, final capacity 1,048,576',{size:11,color:CY})+
      text(280,196,'total moves 1 + 2 + … + 524,288 ≈ 1,048,575  →  ~1 per push',{size:11,color:LM}),
      'Vector capacity doubling and the amortized move count')},
   {cap:"Iterator categories nest: each level adds a capability, and algorithms ask for the weakest level they need. std::sort needs random access, so a std::list cannot use it and provides its own sort member instead.",
    svg:stack([{t:'contiguous: vector, array, string',stroke:LM,side:'adjacent in memory'},{t:'random access: deque  (it + n in O(1))',stroke:CY,side:'std::sort works'},{t:'bidirectional: list, map, set  (--it)',side:'use list::sort member'},{t:'forward: forward_list, unordered_map',side:'multi-pass, ++ only'},{t:'input: istream_iterator  (single pass)',stroke:DIM,side:'read once, then gone'}],{w:300,side:true,label:'Iterator categories from strongest to weakest'})},
   {cap:"Big-O is not the whole story. Measured on a 2-core VM with GCC 13 at -O2: same complexity class, very different constants, because contiguous memory streams through 64-byte cache lines while nodes are scattered across the heap.",
    svg:svg(560,215,
      [['sort 10M ints','qsort',2066,'std::sort',1014],['sum 10M ints','std::list',57,'std::vector',6.3],['1M lookups','std::map',1056,'unordered_map',83]].map((g,i)=>{ const y=14+i*66, mx=Math.max(g[2],g[4]), sc=250/mx; return text(14,y+6,g[0],{anchor:'start',size:11,bold:true,color:CY})+
        text(118,y+24,g[1],{anchor:'end',size:10,mono:true})+`<rect x="124" y="${y+16}" width="${(g[2]*sc).toFixed(1)}" height="15" rx="2" fill="${MG}" opacity="0.55"/>`+text(130+g[2]*sc,y+24,g[2]+' ms',{anchor:'start',size:10,color:MG})+
        text(118,y+44,g[3],{anchor:'end',size:10,mono:true})+`<rect x="124" y="${y+36}" width="${Math.max(2,g[4]*sc).toFixed(1)}" height="15" rx="2" fill="${LM}" opacity="0.6"/>`+text(130+Math.max(2,g[4]*sc),y+44,g[4]+' ms',{anchor:'start',size:10,color:LM}); }).join('')+
      text(280,208,'inlined comparator · cache-friendly layout · hashing beats 20 pointer hops',{size:10,color:DIM}),
      'Measured timings: qsort versus std::sort, list versus vector, map versus unordered_map')}];

  /* ---------- Module 3: Ownership in C++ ---------- */
  I.p49m3=[{cap:"Copy versus move for a 10-million-int vector. A copy allocates a second 40 MB buffer and copies every element (22–26 ms measured); a move copies three pointers and leaves the source empty (about 50 ns).",
    svg:compare({t:'COPY  b = a   (22 ms)',draw:x=>box(x+16,44,96,30,'a {ptr,size,cap}',{size:10,stroke:CY})+box(x+16,108,96,30,'b {ptr,size,cap}',{size:10,stroke:CY})+box(x+150,44,96,30,'buffer 40 MB',{size:10,stroke:AM})+box(x+150,108,96,30,'new 40 MB copy',{size:10,stroke:MG})+arrow(x+112,59,x+148,59,'')+arrow(x+112,123,x+148,123,'')+arrow(x+198,76,x+198,106,'copy all',{dy:-4})+text(x+130,160,'allocate + 10M element copies',{size:10,color:MG})},
      {t:'MOVE  c = std::move(a)   (50 ns)',draw:x=>box(x+16,44,96,30,'a {null,0,0}',{size:10,stroke:DIM,color:DIM,dash:true})+box(x+16,108,96,30,'c {ptr,size,cap}',{size:10,stroke:LM})+box(x+150,76,96,30,'buffer 40 MB',{size:10,stroke:AM})+arrow(x+112,123,x+148,96,'')+text(x+64,90,'emptied',{size:9,color:DIM})+text(x+130,160,'3 pointers copied, source nulled',{size:10,color:LM})},{h:180,label:'Copying versus moving a large vector'})},
   {cap:"Value categories as a tree. Every expression is exactly one of lvalue, xvalue or prvalue; glvalues have identity, rvalues may be moved from, and xvalues — such as the result of std::move — are both.",
    svg:svg(560,215,
      box(220,10,120,30,'expression',{stroke:CY,bold:true,size:12})+
      box(90,70,110,30,'glvalue',{size:11,stroke:AM})+box(360,70,110,30,'rvalue',{size:11,stroke:AM})+
      line(280,40,145,70)+line(280,40,415,70)+
      box(20,132,120,30,'lvalue',{size:11,stroke:CY})+box(220,132,120,30,'xvalue',{size:11,stroke:MG,bold:true})+box(420,132,120,30,'prvalue',{size:11,stroke:LM})+
      line(145,100,80,132)+line(145,100,280,132)+line(415,100,280,132)+line(415,100,480,132)+
      text(80,178,'x,  v[0],  *p',{size:10,mono:true})+text(80,194,'has identity',{size:9,color:DIM})+
      text(280,178,'std::move(x)',{size:10,mono:true})+text(280,194,'identity + movable',{size:9,color:DIM})+
      text(480,178,'x + 1,  42,  T()',{size:10,mono:true})+text(480,194,'temporary',{size:9,color:DIM})+
      text(145,60,'identity',{size:9,color:DIM})+text(415,60,'movable',{size:9,color:DIM}),
      'Value category tree: glvalue and rvalue over lvalue, xvalue and prvalue')},
   {cap:"Why reference counting leaks cycles. Two nodes holding shared_ptrs to each other keep both counts at 1 after the last outside owner goes away, so neither destructor ever runs. A weak_ptr back edge does not count, and both nodes are freed.",
    svg:compare({t:'shared_ptr BOTH WAYS: LEAK',draw:x=>box(x+20,52,90,40,'Node A\ncount 1',{size:10,stroke:MG})+box(x+150,52,90,40,'Node B\ncount 1',{size:10,stroke:MG})+arrow(x+112,64,x+148,64,'')+arrow(x+148,82,x+112,82,'')+text(x+130,110,'head released: counts 2 → 1',{size:10})+text(x+130,128,'never 0 → destructors never run',{size:10,color:MG})+text(x+130,150,'LeakSanitizer: indirect leak',{size:9,color:DIM})},
      {t:'weak_ptr BACK EDGE: FREED',draw:x=>box(x+20,52,90,40,'Node A\ncount 0',{size:10,stroke:LM})+box(x+150,52,90,40,'Node B\ncount 0',{size:10,stroke:LM})+arrow(x+112,64,x+148,64,'')+arrow(x+148,82,x+112,82,'',{dash:true})+text(x+130,110,'weak_ptr does not own',{size:10})+text(x+130,128,'A freed, then B freed',{size:10,color:LM})+text(x+130,150,'ASan: 0 leaks',{size:9,color:DIM})},{h:175,label:'shared_ptr cycle leak versus weak_ptr back edge'})},
   {cap:"The bug C++ compiles silently. A reference into a vector survives a push_back that reallocates; the old 12-byte buffer is freed and the reference now points into freed heap memory, which AddressSanitizer reports as heap-use-after-free.",
    svg:svg(560,215,
      text(20,18,'before: v.size() == capacity() == 3',{anchor:'start',size:10,color:DIM})+
      box(20,30,70,28,'v',{size:11,stroke:CY})+cells(130,30,40,28,['1','2','3'],{stroke:CY})+arrow(90,44,128,44,'')+
      box(300,30,90,28,'int& first',{size:10,stroke:AM})+`<path d="M345 58 L345 68 L150 68 L150 61" fill="none" stroke="currentColor" stroke-width="1.3" marker-end="url(#ah)"/>`+text(250,82,'refers to element 0 of the old 12-byte buffer',{size:9,color:DIM})+
      text(20,104,'after v.push_back(4): reallocate to capacity 6, free the old buffer',{anchor:'start',size:10,color:DIM})+
      box(20,116,70,28,'v',{size:11,stroke:CY})+cells(130,116,40,28,['1','2','3','4','',''],{stroke:LM,dashes:[0,0,0,0,1,1]})+arrow(90,130,128,130,'')+
      cells(410,116,40,28,['?','?','?'],{stroke:MG,dash:true,color:MG})+text(470,160,'freed',{size:10,color:MG})+
      box(300,172,90,28,'int& first',{size:10,stroke:AM})+arrow(345,172,440,146,'',{stroke:MG})+
      text(150,188,'read → heap-use-after-free',{size:11,color:MG,bold:true}),
      'A reference dangling after vector reallocation')}];

  /* ---------- Module 4: Modern C++ in practice ---------- */
  I.p49m4=[{cap:"Why counter++ loses updates. It is three steps — load, add, store — and when two threads interleave them, both store the same value. Two increments become one; two million increments became 1,290,565 in the measured run.",
    svg:svg(560,230,
      text(160,14,'thread T1',{size:11,bold:true,color:CY})+text(400,14,'thread T2',{size:11,bold:true,color:MG})+
      line(30,22,30,186,{stroke:DIM})+`<polygon points="25,184 35,184 30,194" fill="currentColor"/>`+text(16,104,'time',{size:9,color:DIM})+
      box(90,24,140,26,'load counter → 5',{size:10,mono:true,stroke:CY})+box(330,52,140,26,'load counter → 5',{size:10,mono:true,stroke:MG})+
      box(90,80,140,26,'add 1 → 6',{size:10,mono:true,stroke:CY})+box(330,108,140,26,'add 1 → 6',{size:10,mono:true,stroke:MG})+
      box(90,136,140,26,'store 6',{size:10,mono:true,stroke:CY})+box(330,164,140,26,'store 6  (overwrites)',{size:10,mono:true,stroke:MG})+
      text(280,206,'two increments, counter went 5 → 6: one update lost',{size:11,color:AM})+
      text(280,222,'fix: mutex, std::atomic fetch_add, or per-thread sums',{size:10,color:LM}),
      'Interleaving of two threads losing an increment')},
   {cap:"What happens between your CMakeLists.txt and a green test run. CMake configures and generates build files; Ninja or Make runs the compiler and linker; ctest runs the tests. Presets make the same steps reproducible in CI.",
    svg:flow([{t:'CMakeLists.txt\n+ presets',stroke:CY},{t:'cmake -B build\nconfigure'},{t:'build.ninja\ngenerated'},{t:'ninja\ncompile, link'},{t:'ctest\nrun tests',stroke:LM}],{perRow:5,bw:86,bh:56,gap:24,label:'CMake configure, generate, build and test pipeline'})},
   {cap:"The memory-order ladder. Every step up gives more ordering guarantees and may cost more on weakly ordered CPUs such as ARM; a plain shared variable without synchronization is not on the ladder at all — it is a data race.",
    svg:stack([{t:'seq_cst — one global order (default)',stroke:LM,side:'simplest; slowest on ARM'},{t:'acquire / release — publish data',stroke:CY,side:'flag + payload handoff'},{t:'relaxed — atomicity only',stroke:AM,side:'counters, statistics'},{t:'plain int shared by threads',stroke:MG,side:'data race = undefined'}],{w:300,side:true,label:'Memory orders from strongest to a data race'})},
   {cap:"Release and acquire make a happens-before edge. The consumer's acquire load reads the value the producer's release store wrote, so everything the producer did before the store — writing data — is visible after the load.",
    svg:svg(560,215,
      text(140,16,'producer thread',{size:11,bold:true,color:CY})+text(420,16,'consumer thread',{size:11,bold:true,color:MG})+
      box(40,30,200,30,'data = measure();',{mono:true,size:10,stroke:CY})+box(40,96,200,30,'ready.store(true, release);',{mono:true,size:10,stroke:CY})+arrow(140,62,140,94,'')+
      box(320,96,200,30,'while (!ready.load(acquire)) {}',{mono:true,size:10,stroke:MG})+box(320,162,200,30,'use(data);  // sees the write',{mono:true,size:10,stroke:MG})+arrow(420,128,420,160,'')+
      arrow(242,111,318,111,'syncs with',{stroke:LM})+
      `<path d="M40 45 L24 45 L24 204 L300 204 L300 180 L316 180" fill="none" stroke="${AM}" stroke-width="1.3" stroke-dasharray="5 4" marker-end="url(#ah)"/>`+text(160,196,'happens-before: data write → use(data)',{size:10,color:AM}),
      'Release store and acquire load creating a happens-before edge')}];

  /* ---------- Module 5: Rust ownership and borrowing ---------- */
  I.p49m5=[{cap:"A Rust move. let t = s; copies the 24-byte stack header (pointer, capacity, length) and makes s statically unusable; the heap buffer is not touched and will be freed exactly once, by t. Using s afterwards is error E0382.",
    svg:svg(560,215,
      text(110,16,'stack',{size:11,bold:true,color:CY})+text(420,16,'heap',{size:11,bold:true,color:AM})+
      text(24,46,'s',{size:12,mono:true,bold:true,color:DIM})+cells(40,32,52,28,['ptr','cap 5','len 5'],{dash:true,stroke:DIM,color:DIM})+
      line(40,34,196,58,{stroke:MG})+line(40,58,196,34,{stroke:MG})+text(118,78,'moved: unusable (E0382)',{size:10,color:MG})+
      text(24,118,'t',{size:12,mono:true,bold:true,color:LM})+cells(40,104,52,28,['ptr','cap 5','len 5'],{stroke:LM})+
      cells(340,70,32,30,['f','i','b','e','r'],{stroke:AM,mono:true})+
      arrow(66,104,338,92,'',{stroke:LM})+arrow(198,46,338,78,'',{dash:true,stroke:DIM})+text(268,50,'was',{size:9,color:DIM})+
      text(280,168,'let t = s;  copies 24 bytes, never the heap buffer',{size:11,color:CY})+
      text(280,190,'only t drops the buffer: no double free, no moved-from state',{size:10,color:LM}),
      'Moving a String: stack header copied, source invalidated, heap untouched')},
   {cap:"Shared XOR mutable. Many shared borrows may coexist, or exactly one mutable borrow — never both at once. The third case is the C++ dangling-reference bug from Module 3, rejected at compile time as E0502.",
    svg:svg(560,215,
      box(8,10,176,160,'',{dash:true,stroke:DIM})+box(192,10,176,160,'',{dash:true,stroke:DIM})+box(376,10,176,160,'',{dash:true,stroke:DIM})+
      text(96,26,'many readers: OK',{size:11,bold:true,color:LM})+text(280,26,'one writer: OK',{size:11,bold:true,color:LM})+text(464,26,'both: E0502',{size:11,bold:true,color:MG})+
      box(56,120,80,28,'v',{size:12,mono:true,stroke:CY})+box(14,44,52,26,'&v',{size:10,mono:true})+box(70,44,52,26,'&v',{size:10,mono:true})+box(126,44,52,26,'&v',{size:10,mono:true})+arrow(40,72,80,118,'')+arrow(96,72,96,118,'')+arrow(152,72,112,118,'')+
      box(240,120,80,28,'v',{size:12,mono:true,stroke:CY})+box(240,44,80,26,'&mut v',{size:10,mono:true,stroke:AM})+arrow(280,72,280,118,'')+
      box(424,120,80,28,'v',{size:12,mono:true,stroke:CY})+box(384,44,74,26,'&v[0]',{size:10,mono:true})+box(464,44,82,26,'v.push(4)',{size:10,mono:true,stroke:MG})+arrow(421,72,450,118,'')+arrow(505,72,478,118,'',{stroke:MG})+
      text(96,160,'readers only',{size:9,color:DIM})+text(280,160,'exclusive access',{size:9,color:DIM})+text(464,160,'push needs &mut',{size:9,color:MG})+
      text(280,196,'the borrow checker proves this on every path, before the program runs',{size:11,color:AM}),
      'Borrowing rule: many shared references, or one mutable reference, never both')},
   {cap:"Lifetimes are scopes the compiler compares. The reference r lives in the outer region; the value x lives only in the inner block. Because r would outlive x, rustc rejects the program with E0597 — the dangling pointer of Domain 15, caught before it exists.",
    svg:svg(560,215,
      ['let r;','{','    let x = 5;','    r = &x;','}','println!("{}", r);'].map((t,i)=>text(150,24+i*26,t,{anchor:'start',size:12,mono:true,color:i===3||i===5?AM:'currentColor'})).join('')+
      `<path d="M120 14 L108 14 L108 168 L120 168" fill="none" stroke="${CY}" stroke-width="2"/>`+text(100,92,"'a: r",{anchor:'end',size:11,color:CY})+
      `<path d="M140 64 L130 64 L130 140 L140 140" fill="none" stroke="${MG}" stroke-width="2"/>`+
      text(310,76,"'b: x lives only here",{anchor:'start',size:11,color:MG})+
      text(310,128,'x dropped while still borrowed',{anchor:'start',size:10,color:MG})+
      text(310,154,'r used after x is gone',{anchor:'start',size:10,color:AM})+
      text(280,204,"'a outlives 'b  →  error[E0597]: 'x' does not live long enough",{size:11,color:AM}),
      'Lifetime regions of r and x and the E0597 error')},
   {cap:"A slice is a fat pointer: an address plus a length, 16 bytes in all. &v[1..3] borrows two elements of the vector's buffer without copying them, and every index through it is checked against the length.",
    svg:svg(560,215,
      text(90,16,'Vec<i32> v  (24 B)',{size:11,bold:true,color:CY})+cells(20,26,48,28,['ptr','cap 5','len 5'],{stroke:CY,size:10})+
      text(440,16,'&v[1..3]  (16 B)',{size:11,bold:true,color:LM})+cells(380,26,64,28,['ptr','len 2'],{stroke:LM,size:10})+
      text(440,122,'heap buffer',{anchor:'start',size:10,color:DIM})+cells(130,104,60,32,['10','20','30','40','50'],{strokes:[DIM,LM,LM,DIM,DIM],mono:true,size:11})+
      text(160,150,'[0]',{size:9,color:DIM})+text(220,150,'[1]',{size:9,color:LM})+text(280,150,'[2]',{size:9,color:LM})+text(340,150,'[3]',{size:9,color:DIM})+text(400,150,'[4]',{size:9,color:DIM})+
      arrow(44,56,150,102,'')+arrow(412,56,212,102,'',{stroke:LM})+
      text(280,178,'s[5] → panic: index out of bounds (never a silent overflow)',{size:11,color:AM})+
      text(280,198,'s.get(5) → None',{size:10,mono:true,color:DIM}),
      'Vector header, heap buffer and a slice borrowing two elements')}];

  /* ---------- Module 6: Rust in practice ---------- */
  I.p49m6=[{cap:"How enums are laid out. A tag plus room for the largest variant — except when a type has an impossible bit pattern: a Box is never null, so Option<Box<T>> uses null for None and stays 8 bytes. Sizes measured with std::mem::size_of on x86-64.",
    svg:svg(560,215,
      text(20,18,'Option<i32>   = 8 B',{anchor:'start',size:11,mono:true,bold:true,color:CY})+cells(250,6,70,24,['tag 4 B','i32 4 B'],{stroke:CY,size:10})+
      text(20,58,'Option<u64>   = 16 B',{anchor:'start',size:11,mono:true,bold:true,color:AM})+cells(250,46,70,24,['tag+pad 8 B','u64 8 B'],{stroke:AM,size:9})+
      text(20,98,'Option<Box<T>> = 8 B',{anchor:'start',size:11,mono:true,bold:true,color:LM})+cells(250,86,140,24,['pointer 8 B'],{stroke:LM,size:10})+text(400,98,'null means None',{anchor:'start',size:10,color:LM})+
      line(20,124,540,124,{stroke:DIM})+
      text(20,144,'enum Event  (tag + largest variant)',{anchor:'start',size:11,bold:true})+
      box(20,154,120,26,'Splice { km, db }',{size:10,mono:true})+box(148,154,170,26,'Connector { km, db, refl }',{size:10,mono:true,stroke:MG})+box(326,154,100,26,'Bend { km, db }',{size:10,mono:true})+box(434,154,106,26,'End { km }',{size:10,mono:true})+
      text(280,202,'match must cover all four, or rustc reports E0004',{size:10,color:AM}),
      'Enum and Option memory layouts with the null-pointer niche')},
   {cap:"Two kinds of dispatch. A generic function with a trait bound is monomorphized into one inlined copy per type; a dyn Trait object is a 16-byte fat pointer whose vtable chooses the method at run time, exactly like a C++ virtual call.",
    svg:compare({t:'GENERIC: fn total<T: Loss>',draw:x=>box(x+70,40,120,30,'total<T>',{mono:true,size:11,stroke:CY})+box(x+12,104,112,30,'total::<Splice>',{mono:true,size:10,stroke:LM})+box(x+136,104,112,30,'total::<Span>',{mono:true,size:10,stroke:LM})+arrow(x+110,72,x+70,102,'')+arrow(x+150,72,x+190,102,'')+text(x+130,156,'static dispatch, inlined',{size:10,color:LM})},
      {t:'TRAIT OBJECT: &dyn Loss',draw:x=>cells(x+14,40,62,30,['data ptr','vtable'],{size:10,stroke:MG})+box(x+14,108,92,30,'Span value',{size:10})+box(x+150,96,102,44,'vtable: loss_db\ndrop, size',{size:10,mono:true,stroke:MG})+arrow(x+45,72,x+45,106,'')+arrow(x+107,72,x+148,110,'')+text(x+130,160,'16-byte fat pointer, indirect call',{size:10,color:MG})},{h:180,label:'Static dispatch by monomorphization versus dynamic dispatch through a vtable'})},
   {cap:"The ? operator in motion. Each fallible step returns Ok to continue the happy path or Err to leave the function immediately, converting the error with From — errors are values the caller cannot forget to handle.",
    svg:svg(560,215,
      box(14,30,120,40,'read_to_string\n(path)?',{mono:true,size:10,stroke:CY})+box(160,30,110,40,'line.parse()?',{mono:true,size:10,stroke:CY})+box(296,30,110,40,'validate(&e)?',{mono:true,size:10,stroke:CY})+box(432,30,114,40,'Ok(total)',{mono:true,size:11,stroke:LM,bold:true})+
      arrow(136,50,158,50,'')+arrow(272,50,294,50,'')+arrow(408,50,430,50,'')+text(147,24,'Ok',{size:9,color:LM})+text(283,24,'Ok',{size:9,color:LM})+text(419,24,'Ok',{size:9,color:LM})+
      arrow(74,72,74,124,'Err',{stroke:MG})+arrow(215,72,215,124,'Err',{stroke:MG})+arrow(351,72,351,124,'Err',{stroke:MG})+
      box(14,126,392,34,'return Err(e.into())  — converted with From',{mono:true,size:10,stroke:MG})+
      text(280,186,'missing file → Err(Io(NotFound))  ·  bad line 3 → Err(Parse { line: 3 })',{size:10,color:AM})+
      text(280,204,'the caller must match or ? again: an ignored error does not compile',{size:10,color:DIM}),
      'Error propagation with the question-mark operator')},
   {cap:"The daily cargo loop. One tool creates, builds, tests, lints and formats; in CI the same commands run with warnings as errors, so the repository proves its own quality to anyone who reads it.",
    svg:cycle([{t:'cargo new',stroke:CY},'write code','cargo build','cargo test','cargo clippy','cargo fmt'],{label:'Cargo development loop'})}];

  /* ---------- Module 7: Concurrency, unsafe, FFI, choosing ---------- */
  I.p49m7=[{cap:"Send and Sync for common types. The compiler derives these markers from a type's fields; anything without Send cannot move to another thread, and anything without Sync cannot be shared by reference — data races become type errors.",
    svg:svg(560,215,
      text(100,16,'type',{size:11,bold:true,color:CY})+text(250,16,'Send',{size:11,bold:true,color:CY})+text(320,16,'Sync',{size:11,bold:true,color:CY})+text(440,16,'why',{size:11,bold:true,color:CY})+
      [['i32, String, Vec<T>',1,1,''],['Rc<T>',0,0,'non-atomic count'],['Arc<T>',1,1,'(T: Send + Sync)'],['Cell<T>, RefCell<T>',1,0,'unsynced mutation'],['Mutex<T>',1,1,'(T: Send)'],['*const T, *mut T',0,0,'raw pointers opt out']].map((r,i)=>{ const y=26+i*26; return line(30,y,530,y,{stroke:DIM})+text(40,y+13,r[0],{anchor:'start',size:10,mono:true})+text(250,y+13,r[1]?'yes':'no',{size:11,bold:true,color:r[1]?LM:MG})+text(320,y+13,r[2]?'yes':'no',{size:11,bold:true,color:r[2]?LM:MG})+text(370,y+13,r[3],{anchor:'start',size:10,color:DIM}); }).join('')+line(30,182,530,182,{stroke:DIM})+
      text(280,202,'thread::spawn requires Send + \'static: Rc fails with E0277',{size:10,color:AM}),
      'Send and Sync for common Rust types')},
   {cap:"Arc<Mutex<T>>: the Mutex owns the data. Each thread holds a clone of the Arc (an atomic count of owners); the only path to the HashMap is lock(), which returns a guard that unlocks when it is dropped.",
    svg:svg(560,215,
      ['thread 1','thread 2','thread 3'].map((t,i)=>box(14,24+i*58,96,36,t+'\nArc clone',{size:10,stroke:CY})+arrow(112,42+i*58,198,100,'')).join('')+
      box(200,80,110,40,'Arc\nstrong count 4',{size:10,stroke:AM})+arrow(312,100,346,100,'')+
      box(348,58,196,84,'',{stroke:LM})+text(446,72,'Mutex',{size:11,bold:true,color:LM})+box(366,84,160,44,'HashMap<u32, u32>\n(only via lock)',{mono:true,size:10,stroke:LM})+
      text(280,194,'let mut g = map.lock().unwrap();  *g.entry(id).or_insert(0) += 1;',{size:10,mono:true,color:CY})+
      text(446,160,'guard dropped → unlocked',{size:9,color:DIM})+text(446,174,'panic while locked → poisoned',{size:9,color:DIM}),
      'Three threads sharing a HashMap through Arc and Mutex')},
   {cap:"How unsafe stays contained. A safe API sits on top of a small unsafe core whose invariant is written down; callers never write unsafe, reviewers audit only the core, and Miri checks it for undefined behavior.",
    svg:stack([{t:'safe API: v.push(x)',stroke:LM,side:'callers write no unsafe'},{t:'invariant: len <= cap, ptr valid',stroke:CY,side:'stated in docs'},{t:'unsafe { ... }  + // SAFETY: why',stroke:AM,side:'audited, a few lines'},{t:'raw pointer write: ptr.add(len)',stroke:MG,side:'checked with Miri'},{t:'allocator: alloc / realloc / dealloc',side:'the Domain 15 heap'}],{w:300,side:true,label:'Layers of an encapsulated unsafe abstraction'})},
   {cap:"Crossing the FFI boundary. Rust declares the C function in an unsafe extern block; the call follows the System V C ABI (doubles in xmm0–xmm2, the int in edi, the result back in xmm0); the C code was compiled by build.rs and linked as a static library.",
    svg:flow([{t:'main.rs\nloss(12.0, 6)',stroke:CY},{t:'unsafe\nextern "C"\ndeclared'},{t:'C ABI call\nxmm0-2 + edi'},{t:'loss.c\nspan_loss_db',stroke:AM},{t:'xmm0 = 4.80\n4.2 + 0.6 dB',stroke:LM}],{perRow:5,bw:88,bh:58,gap:22,label:'Rust calling a C function through the C ABI'})},
   {cap:"The memory-safety timeline, 2019–2026. Industry data came first, then a sequence of U.S. government guidance; all of it is voluntary, and the January 1, 2026 roadmap date in the CISA/FBI Bad Practices document has now passed.",
    svg:flow([{t:'2019\nMicrosoft: ~70%\nCVEs memory'},{t:'2020\nChromium: ~70%\nserious bugs'},{t:'Nov 2022\nNSA memory\nsafety sheet',stroke:CY},{t:'Dec 2023\nMemory Safe\nRoadmaps',stroke:CY},{t:'Feb 2024\nONCD Building\nBlocks',stroke:CY},{t:'Oct 2024\nCISA/FBI Bad\nPractices',stroke:AM},{t:'Jun 2025\nNSA-CISA MSL\nsheet',stroke:AM},{t:'Jan 1, 2026\nroadmap\ntarget date',stroke:MG}],{perRow:4,bw:118,bh:58,gap:22,label:'Timeline of memory-safety data and guidance'})}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
