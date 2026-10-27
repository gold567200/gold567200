/* Illustrations — Domain 4: Coding Fundamentals (Python). Adds figures to the originals in illus_core.js (concatenated, never replaced). */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const E=window.ILLUS||{}; const I={};
  const path=(d,o={})=>'<path d="'+d+'" fill="none" stroke="'+(o.stroke||'currentColor')+'" stroke-width="'+(o.sw||1.3)+'"'+(o.dash?' stroke-dasharray="5 4"':'')+' marker-end="url(#ah)"/>';

  /* ---------- Module 1: values, names, the interpreter ---------- */
  const stackCol=(x,instr,vals,last)=>box(x,30,100,40,instr,{size:instr.length>13?10:11,stroke:AM})+
    vals.map((v,k)=>box(x+20,136-k*26,60,24,String(v),{size:11,stroke:k===vals.length-1?LM:CY})).join('')+
    (vals.length?'':text(x+50,148,last,{size:11,color:LM,bold:true}));
  I.p4m1=(E.p4m1||[]).concat([
   {cap:"What python3 does with your file: the tokenizer cuts text into tokens (indentation becomes INDENT/DEDENT), the PEG parser builds an abstract syntax tree, the compiler emits bytecode into a code object, and the evaluation loop in ceval.c executes it. Imported modules cache that bytecode in __pycache__/*.pyc.",
    svg:flow([{t:'hello.py\nsource text',stroke:CY},{t:'tokens\nincl. INDENT'},{t:'AST\nPEG parser'},{t:'bytecode\ncode object',stroke:AM},{t:'ceval loop\nexecutes',stroke:LM}],{perRow:5,bw:90,bh:56,gap:20,label:'Source to tokens to AST to bytecode to the evaluation loop'})},
   {cap:"The bytecode of return price * qty + 5 run on a stack, with price = 3 and qty = 4 (CPython 3.14 listing). Each instruction pops its operands and pushes its result; the value left on top is returned.",
    svg:svg(560,190,text(280,14,'price = 3, qty = 4:   return price * qty + 5',{size:12,bold:true,color:CY})+
      stackCol(10,'LOAD price, qty',[3,4])+stackCol(118,'BINARY_OP *',[12])+stackCol(226,'LOAD_SMALL_INT\n5',[12,5])+stackCol(334,'BINARY_OP +',[17])+stackCol(442,'RETURN_VALUE',[],'returns 17')+
      line(10,162,542,162,{stroke:DIM})+text(280,178,'value stack after each instruction',{size:10,color:DIM}),'A stack machine evaluating price times qty plus 5')},
   {cap:"CPython frees an object the instant its reference count reaches zero. Two objects that point at each other keep each other's count at 1 forever, so the cyclic garbage collector (gc) periodically finds such unreachable islands and frees them.",
    svg:compare({t:'REFCOUNT: FREED AT ZERO',draw:o=>box(o+20,50,40,26,'a',{stroke:CY,bold:true})+box(o+20,96,40,26,'b',{stroke:MG,bold:true})+arrow(o+60,63,o+128,78,'')+arrow(o+60,109,o+128,92,'')+
        box(o+130,62,110,46,'Node object\nrefcount = 2',{size:11,stroke:LM})+text(o+130,140,'del b → refcount 1',{size:10,color:DIM})+text(o+130,158,'a = None → 0: freed',{size:10,color:AM})},
      {t:'CYCLE: NEEDS THE GC',draw:o=>box(o+30,60,80,40,'x object',{size:11,stroke:MG})+box(o+150,60,80,40,'y object',{size:11,stroke:MG})+arrow(o+110,72,o+148,72,'')+arrow(o+150,88,o+112,88,'')+
        text(o+130,128,'no names; counts stay 1',{size:10,color:DIM})+text(o+130,146,'gc.collect() finds the island',{size:10,color:AM})+text(o+130,164,'→ 2 objects freed',{size:10,color:LM})},{h:185,label:'Reference counting versus a reference cycle'})}
  ]);

  /* ---------- Module 2: control flow ---------- */
  const row=(y,vals,hi,note,o={})=>vals.map((v,j)=>box(20+j*38,y,34,28,String(v),{size:12,stroke:j===hi?AM:DIM,bold:j===hi,color:j===hi?AM:'currentColor'})).join('')+
    (o.ghost!=null?box(20+o.ghost*38,y,34,28,'?',{size:12,stroke:MG,dash:true,color:MG}):'')+text(230,y+14,note,{anchor:'start',size:11,color:o.c||'currentColor'});
  I.p4m2=(E.p4m2||[]).concat([
   {cap:"The iteration protocol behind every for loop: iter() is called once, next() before every pass; each item is bound to the loop variable and the body runs. When next() raises StopIteration the loop ends, and a loop-else runs only if no break fired.",
    svg:svg(560,185,box(10,70,100,44,'iter(items)\ncalled once',{size:11,stroke:CY})+arrow(110,92,148,92,'')+box(150,70,100,44,'next(it)',{stroke:AM,bold:true})+arrow(250,92,288,92,'')+
      box(290,70,110,44,'bind x = item\nrun the body',{size:11,stroke:LM})+path('M345 114 L345 150 L200 150 L200 117',{stroke:LM})+text(272,164,'repeat',{size:10,color:LM})+
      path('M200 70 L200 34 L480 34 L480 67',{stroke:MG,dash:true})+text(340,24,'raises StopIteration',{size:10,color:MG})+box(420,70,130,44,'loop ends\nelse runs if no break',{size:11,stroke:MG}),'The for loop iteration protocol')},
   {cap:"Why removing items while looping skips some: the loop walks indexes 0, 1, 2, … while each remove() shifts later items left. Starting from [2, 4, 5, 6, 8], the 4 slides into a slot the loop has already passed, and the run ends with [4, 5, 8].",
    svg:svg(560,200,row(14,[2,4,5,6,8],0,'i = 0: 2 is even → remove')+row(56,[4,5,6,8],1,'i = 1: sees 5, skipped 4',{c:MG})+
      row(98,[4,5,6,8],2,'i = 2: 6 is even → remove')+row(140,[4,5,8],-1,'i = 3: past the end → stop',{ghost:3})+
      text(280,188,'result: [4, 5, 8]',{size:11,color:LM}),'Index trace of removing items while iterating')}
  ]);

  /* ---------- Module 3: functions ---------- */
  I.p4m3=(E.p4m3||[]).concat([
   {cap:"Every call pushes a frame holding that call's locals and its place in the code; returning pops it. A traceback is a printout of the frames alive when an exception escaped — oldest first, the failing one last.",
    svg:stack([{t:'average · values=[] · total=0',stroke:MG,side:'ZeroDivisionError here'},{t:'report · rows · name="ana"',side:'called average()'},{t:'<module> · the script',stroke:CY,side:'called report()'}],{w:300,h:40,side:true,label:'Call stack of three frames'})},
   {cap:"The LEGB rule: a name is looked up in the Local scope, then any Enclosing functions, then the module's Globals, then the Built-ins. The first scope that has the name wins — and any assignment inside a function makes that name local for the whole body.",
    svg:svg(560,220,box(10,10,540,200,'',{stroke:DIM,dash:true})+text(22,26,'B  built-ins: len, print, range',{anchor:'start',size:11,color:DIM})+
      box(30,40,500,150,'',{stroke:CY})+text(42,56,'G  module: rate = 0.08, make_counter',{anchor:'start',size:11,color:CY})+
      box(50,70,460,110,'',{stroke:AM})+text(62,86,'E  make_counter(): count = 0',{anchor:'start',size:11,color:AM})+
      box(70,100,270,66,'',{stroke:LM})+text(82,118,'L  tick(): its own locals',{anchor:'start',size:11,color:LM})+text(82,140,'nonlocal count → uses E',{anchor:'start',size:10,color:DIM})+
      text(425,122,'lookup order',{size:11,bold:true})+text(425,142,'L → E → G → B',{size:12,color:MG,bold:true})+text(425,162,'first match wins',{size:10,color:DIM})+
      text(280,202,'any assignment makes it local',{size:10,color:DIM}),'Nested LEGB scopes')},
   {cap:"A closure outlives its creator. make_counter() returns, and its frame is discarded, but the inner tick function still holds a cell containing count; each call to make_counter() creates a separate cell, so c1 and c2 never share.",
    svg:svg(560,170,box(10,30,170,56,'make_counter() frame\nreturned: discarded',{size:11,stroke:DIM,dash:true,color:DIM})+
      box(220,20,120,40,'c1 = tick',{size:12,stroke:CY,mono:true})+arrow(340,40,388,40,'')+box(390,20,150,40,'cell: count = 3',{size:12,stroke:LM})+
      box(220,92,120,40,'c2 = tick',{size:12,stroke:MG,mono:true})+arrow(340,112,388,112,'')+box(390,92,150,40,'cell: count = 1',{size:12,stroke:LM})+
      text(95,110,'locals gone…',{size:10,color:DIM})+text(95,126,'…except captured ones',{size:10,color:AM})+
      text(380,158,'c1(), c1(), c1() → 1, 2, 3 · c2() → 1',{size:10,color:DIM}),'Closure cells kept alive after the outer function returns')}
  ]);

  /* ---------- Module 4: data structures ---------- */
  const xl=L=>60+L*18, yb=b=>170-(b-56)*0.729;
  I.p4m4=(E.p4m4||[]).concat([
   {cap:"What [3, 1, 4, 1, 5] really is: a list header, a contiguous array of 8-byte pointers with spare capacity, and int objects living elsewhere on the heap. Both 1s point at the same cached int object. Indexing is base + 8 × i, hence O(1).",
    svg:svg(560,210,box(10,25,120,56,'list object\nlen 5 · capacity 8',{size:11,stroke:CY})+arrow(130,53,168,53,'')+
      [0,1,2,3,4,5,6,7].map(i=>box(170+i*40,38,38,30,i<5?'•':'spare',{size:i<5?14:10,stroke:i<5?LM:DIM,dash:i>=5,color:i<5?LM:DIM})+text(189+i*40,29,String(i),{size:9,color:DIM})).join('')+
      box(150,130,60,28,'int 3',{size:11})+box(250,150,60,28,'int 1',{size:11,stroke:AM})+box(330,120,60,28,'int 4',{size:11})+box(430,150,60,28,'int 5',{size:11})+
      arrow(189,68,180,128,'')+arrow(229,68,270,148,'')+arrow(269,68,355,118,'')+arrow(309,68,290,148,'')+arrow(349,68,450,148,'')+
      text(280,198,'address = base + 8 × i: O(1)',{size:11,color:AM}),'Memory layout of a CPython list')},
   {cap:"A dict lookup in three steps: hash the key, keep the low bits to pick a slot in the index table, follow that slot to the dense entries array (the compact layout since 3.6, which is why dicts keep insertion order). One hash and a probe or two, at any size.",
    svg:svg(560,200,box(20,18,80,32,'"sam"',{mono:true,stroke:CY})+arrow(100,34,128,34,'')+box(130,18,120,32,'hash("sam")',{mono:true,size:11})+arrow(250,34,278,34,'')+box(280,18,110,32,'h & 7 = 2',{mono:true,stroke:AM})+
      arrow(320,50,126,78,'',{stroke:AM})+
      [0,1,2,3,4,5,6,7].map(i=>box(20+i*40,80,36,30,i===2?'0':(i===6?'1':'–'),{size:12,stroke:i===2||i===6?AM:DIM,color:i===2||i===6?AM:DIM})+text(38+i*40,120,String(i),{size:9,color:DIM})).join('')+
      text(400,90,'index table (8 slots)',{anchor:'start',size:10,color:DIM})+
      arrow(106,110,96,138,'')+arrow(266,110,272,138,'')+box(20,140,170,30,'entry 0: "sam" → 30',{size:11,stroke:LM})+box(200,140,170,30,'entry 1: "ana" → 25',{size:11,stroke:LM})+
      text(400,135,'one hash, 1–2 probes',{anchor:'start',size:11,color:LM})+text(400,153,'O(1) at any size',{anchor:'start',size:11,color:LM})+text(400,171,'resize at 2/3 full',{anchor:'start',size:11,color:DIM})+
      text(195,190,'dense entries keep insertion order',{size:10,color:DIM}),'How a dict finds a key')},
   {cap:"Measured on CPython 3.14: a list's size in bytes as you append. Capacity jumps 4 → 8 → 16 → 24, so most appends just fill a spare slot and only the rare resize copies the pointers — that is amortized O(1).",
    svg:svg(560,215,line(60,170,500,170,{stroke:DIM})+line(60,20,60,170,{stroke:DIM})+
      [[56,'56'],[88,'88'],[120,'120'],[184,'184'],[248,'248']].map(([b,t])=>text(54,yb(b),t,{anchor:'end',size:10,color:DIM})+line(60,yb(b),500,yb(b),{stroke:DIM,dash:true,sw:0.5})).join('')+
      [0,4,8,16,24].map(L=>text(xl(L),184,String(L),{size:10,color:DIM})).join('')+
      '<path d="M'+xl(0)+' '+yb(56)+' H'+xl(1)+' V'+yb(88)+' H'+xl(5)+' V'+yb(120)+' H'+xl(9)+' V'+yb(184)+' H'+xl(17)+' V'+yb(248)+' H'+xl(24)+'" fill="none" stroke="'+CY+'" stroke-width="2"/>'+
      [1,5,9,17].map(L=>'<circle cx="'+xl(L)+'" cy="'+yb(L===1?88:L===5?120:L===9?184:248)+'" r="4" fill="none" stroke="'+AM+'" stroke-width="1.5"/>').join('')+
      text(280,200,'len(list) after each append',{size:10,color:DIM})+text(80,14,'bytes',{size:10,color:DIM})+
      text(410,112,'○ = resize: copy pointers',{size:10,color:AM})+text(410,96,'flat run = free append',{size:10,color:CY}),'List size in bytes against length')}
  ]);

  /* ---------- Module 5: text, bytes, errors ---------- */
  const bits=(x,y,s,o={})=>s.split('').map((b,i)=>box(x+i*24,y,22,26,b,{size:12,mono:true,stroke:(o.pre&&i<o.pre)?AM:o.stroke,dash:(o.pre&&i<o.pre),color:(o.pre&&i<o.pre)?AM:'currentColor'})).join('');
  I.p4m5=(E.p4m5||[]).concat([
   {cap:"UTF-8 by hand for é (U+00E9 = 233). Its 11 bits split into 5 + 6, which drop into the two-byte template 110xxxxx 10xxxxxx: 0xC3 0xA9. That is why 'café' is 4 code points but 5 bytes.",
    svg:svg(560,195,text(60,22,'233 = 000 1110 1001  (11 bits)',{anchor:'start',size:12,bold:true,color:CY})+
      bits(60,36,'00011',{stroke:CY})+bits(190,36,'101001',{stroke:LM})+
      arrow(119,64,185,106,'',{stroke:CY})+arrow(261,64,415,106,'',{stroke:LM})+
      bits(60,108,'11000011',{pre:3,stroke:CY})+bits(300,108,'10101001',{pre:2,stroke:LM})+
      text(155,150,'byte 1 = 0xC3',{size:11,bold:true})+text(395,150,'byte 2 = 0xA9',{size:11,bold:true})+
      text(280,182,'dashed = fixed UTF-8 prefix bits',{size:10,color:AM}),'Encoding e-acute as two UTF-8 bytes')},
   {cap:"Text exists only inside your program. Everything that leaves it — a file, a socket, a fiber link — is bytes, so you encode at the way out and decode at the way in, with the same codec on both sides.",
    svg:flow([{t:'str "café"\n4 code points',stroke:CY},{t:'.encode("utf-8")'},{t:'bytes 63 61 66 c3 a9\n5 bytes',stroke:AM},{t:'disk or socket\nonly bytes'},{t:'.decode("utf-8")'},{t:'str "café"\nsame text again',stroke:LM}],{perRow:3,bw:150,bh:52,gap:40,label:'Encoding text to bytes and decoding it back'})},
   {cap:"Part of the built-in exception hierarchy. except clauses match a class or any parent, so put specific ones first; except Exception deliberately skips KeyboardInterrupt and SystemExit, which derive straight from BaseException.",
    svg:svg(560,205,box(210,10,140,32,'BaseException',{stroke:DIM})+line(280,42,160,70)+line(280,42,360,70)+line(280,42,490,70)+
      box(100,70,120,32,'Exception',{stroke:CY,bold:true})+box(290,70,140,32,'KeyboardInterrupt',{size:11})+box(440,70,100,32,'SystemExit',{size:11})+
      text(450,114,'skipped by except Exception',{size:10,color:MG})+
      [['ArithmeticError',70,'ZeroDivisionError'],['LookupError',200,'KeyError, IndexError'],['OSError',330,'FileNotFoundError'],['ValueError',460,'UnicodeDecodeError']].map(([t,cx,sub])=>line(160,102,cx,140)+box(cx-60,140,120,30,t,{size:11,stroke:LM})+text(cx,186,sub,{size:10,color:DIM})).join(''),'Built-in exception hierarchy')}
  ]);

  /* ---------- Module 6: algorithms ---------- */
  const cells=(y,groups,stroke)=>{ let s='', k=0; groups.forEach((g,gi)=>{ g.forEach(v=>{ s+=box(30+k*26+gi*12,y,22,22,String(v),{size:11,stroke}); k++; }); }); return s; };
  const fnode=(x,y,t,o={})=>box(x-32,y,64,26,t,{size:11,mono:true,stroke:o.s||'currentColor',color:o.c||'currentColor'});
  I.p4m6=(E.p4m6||[]).concat([
   {cap:"The call stack of fact(3). Each call pauses waiting for the one above it, until fact(0) hits the base case; then the frames unwind, each multiplying the value it receives. Four frames are alive at the deepest point.",
    svg:svg(560,205,box(60,150,240,32,'fact(3)  waits on 3 * fact(2)',{size:11,stroke:CY})+box(60,110,240,32,'fact(2)  waits on 2 * fact(1)',{size:11})+box(60,70,240,32,'fact(1)  waits on 1 * fact(0)',{size:11})+box(60,30,240,32,'fact(0)  base case: return 1',{size:11,stroke:LM})+
      arrow(36,182,36,34,'',{stroke:CY})+text(36,196,'push',{size:10,color:CY})+arrow(520,34,520,182,'',{stroke:LM})+text(520,196,'unwind',{size:10,color:LM})+
      text(320,46,'returns 1',{anchor:'start',size:11})+text(320,86,'returns 1 × 1 = 1',{anchor:'start',size:11})+text(320,126,'returns 2 × 1 = 2',{anchor:'start',size:11})+text(320,166,'returns 3 × 2 = 6',{anchor:'start',size:11,color:LM,bold:true}),'Call stack for factorial of 3')},
   {cap:"Merge sort on eight numbers. Halving takes log₂ 8 = 3 levels; merging each level touches all 8 items once, so the total work is about n × log₂ n = 24 steps — for a million items, 20 million instead of selection sort's 500 billion.",
    svg:svg(560,262,cells(10,[[5,2,8,1,9,3,7,4]],DIM)+cells(44,[[5,2,8,1],[9,3,7,4]],DIM)+cells(78,[[5,2],[8,1],[9,3],[7,4]],DIM)+cells(112,[[5],[2],[8],[1],[9],[3],[7],[4]],AM)+
      cells(146,[[2,5],[1,8],[3,9],[4,7]],LM)+cells(180,[[1,2,5,8],[3,4,7,9]],LM)+cells(214,[[1,2,3,4,5,7,8,9]],CY)+
      text(390,60,'split: log₂ 8 = 3 levels',{anchor:'start',size:11,color:DIM})+text(390,180,'merge: n work per level',{anchor:'start',size:11,color:LM})+
      text(390,226,'total ≈ n log₂ n',{anchor:'start',size:11,color:CY,bold:true})+text(280,252,'equal items merge left first: stable',{size:10,color:DIM}),'Merge sort split and merge levels')},
   {cap:"Naive fib(4) already computes fib(2) twice and fib(1) three times; the duplication grows by a factor of about 1.618 per level, reaching 2,692,537 calls for fib(30). Memoization computes each value once: n + 1 calls.",
    svg:svg(560,235,line(280,36,150,60)+line(280,36,410,60)+line(150,86,90,110)+line(150,86,210,110)+line(410,86,360,110)+line(410,86,460,110)+line(90,136,50,160)+line(90,136,130,160)+
      fnode(280,10,'fib(4)',{s:CY})+fnode(150,60,'fib(3)')+fnode(410,60,'fib(2)',{s:AM,c:AM})+fnode(90,110,'fib(2)',{s:AM,c:AM})+fnode(210,110,'fib(1)',{s:DIM})+fnode(360,110,'fib(1)',{s:DIM})+fnode(460,110,'fib(0)',{s:DIM})+
      fnode(50,160,'fib(1)',{s:DIM})+fnode(130,160,'fib(0)',{s:DIM})+
      text(400,170,'amber = repeated work',{size:10,color:AM})+text(280,206,'naive fib(30): 2,692,537 calls',{size:11})+text(280,224,'with @cache: 31 calls',{size:11,color:LM}),'Call tree of naive Fibonacci')}
  ]);

  /* ---------- Module 7: objects and modules ---------- */
  I.p4m7=(E.p4m7||[]).concat([
   {cap:"How a.history is found: Python checks the instance's own dict first, then the class, then the base classes in MRO order, and stops at the first match. history lives on the class, so every account's append lands in one shared list; log lives on each instance.",
    svg:svg(560,175,text(280,18,'attribute lookup: first match wins',{size:12,bold:true,color:CY})+
      box(10,60,90,40,'a.history',{mono:true,size:11,stroke:CY})+arrow(100,80,134,80,'')+box(136,52,130,56,'1. instance dict\nowner, balance, log',{size:10})+arrow(266,80,300,80,'miss',{color:MG})+
      box(302,52,130,56,'2. class Account\nbank, history, deposit',{size:10,stroke:LM})+arrow(432,80,466,80,'',{dash:true,stroke:DIM})+box(468,52,82,56,'3. bases\nby MRO',{size:10,stroke:DIM,dash:true,color:DIM})+
      text(201,128,'self.log is here',{size:10,color:LM})+text(367,128,'found: one shared list',{size:10,color:AM})+text(509,128,'not reached',{size:10,color:DIM})+
      text(280,160,'a.deposit(50) is Account.deposit(a, 50)',{size:11,color:DIM}),'Attribute lookup from instance to class to bases')},
   {cap:"What import json does: check the sys.modules cache; on a miss, search each directory of sys.path in order (your script's folder first — which is how a stray json.py shadows the real one), load the cached .pyc or compile, run the module's top level once, cache it and bind the name.",
    svg:flow([{t:'import json',stroke:CY},{t:'in sys.modules?\nyes → bind name'},{t:'no: search sys.path\nscript dir first',stroke:MG},{t:'load .pyc or\ncompile source'},{t:'run module top\nlevel, once only',stroke:AM},{t:'cache module,\nbind name json',stroke:LM}],{perRow:3,bw:150,bh:52,gap:40,label:'Steps of the import system'})},
   {cap:"Multiple inheritance in a diamond. For class D(B, C), the C3 linearization gives D → B → C → A → object, and the first class in that order that defines a method supplies it — so D().who() uses B's version.",
    svg:svg(560,200,box(110,12,80,32,'A',{bold:true,stroke:DIM})+box(30,82,80,32,'B',{bold:true,stroke:LM})+box(190,82,80,32,'C',{bold:true})+box(110,152,80,32,'D(B, C)',{bold:true,stroke:CY,size:11})+
      line(70,82,140,44)+line(230,82,160,44)+line(140,152,70,114)+line(160,152,230,114)+
      text(425,62,'D.__mro__ (C3)',{size:11,bold:true,mono:true})+
      [['D',300,CY],['B',350,LM],['C',400,'currentColor'],['A',450,'currentColor']].map(([t,x,c])=>box(x,80,36,30,t,{bold:true,stroke:c})).join('')+box(496,80,58,30,'object',{size:11,stroke:DIM})+
      [336,386,436,486].map(x=>arrow(x,95,x+10,95,'')).join('')+
      text(425,136,'first class defining who() wins',{size:10,color:DIM})+text(425,156,'D().who() → "B"',{size:12,color:LM,bold:true,mono:true}),'Method resolution order for a diamond')}
  ]);

  /* ---------- Module 8: the toolchain ---------- */
  I.p4m8=[
   {cap:"Anatomy of python3 -m venv .venv: a config file pointing at the base interpreter, symlinks named python, a pip, the activate scripts, and an empty site-packages. Activation only puts .venv/bin first on PATH.",
    svg:stack([{t:'.venv/pyvenv.cfg',stroke:CY,side:'base interpreter, version'},{t:'bin/python → base python3.14',side:'a symlink, not a copy'},{t:'bin/pip · bin/activate',stroke:AM,side:'activate edits PATH only'},{t:'lib/python3.14/site-packages/',stroke:LM,side:'packages install here'}],{w:290,h:38,side:true,label:'Contents of a virtual environment'})},
   {cap:"Git's three areas. git add copies a change from the working tree into the staging area; git commit records the staged snapshot in the repository. git restore runs the other way: --staged unstages, a plain restore throws away working edits.",
    svg:svg(560,200,text(280,20,'git status reports all three areas',{size:11,color:DIM})+
      box(10,40,140,64,'working tree\nyour files',{stroke:CY})+arrow(150,60,208,60,'add',{color:CY})+box(210,40,140,64,'staging area\n(the index)',{stroke:AM})+arrow(350,60,408,60,'commit',{color:AM})+box(410,40,140,64,'repository\n.git: all commits',{stroke:LM})+
      path('M280 104 L280 136 L90 136 L90 107',{stroke:AM,dash:true})+text(180,150,'git restore --staged file',{size:10,color:AM})+
      path('M480 104 L480 170 L50 170 L50 107',{stroke:MG,dash:true})+text(270,186,'git restore file: discard edits',{size:10,color:MG}),'Working tree, staging area and repository')},
   {cap:"The professional loop: write a test that states the behavior, watch pytest fail (red), change the code until it passes (green), and commit both together so the history records what the code was supposed to do.",
    svg:cycle([{t:'write a test',stroke:CY},{t:'pytest: red',stroke:MG},{t:'fix until green',stroke:LM},{t:'git commit',stroke:AM}],{label:'Test, fix, commit cycle'})},
   {cap:"A commit is a snapshot plus a pointer to its parent, all named by hashes; a branch such as main is just a movable label. Because each hash covers the parent's hash, editing old history changes every later hash.",
    svg:svg(560,175,box(20,40,160,52,'9fe741f\nParse splice log',{size:11,mono:true})+arrow(258,66,182,66,'parent',{color:DIM})+box(260,40,160,52,'f789727\nTighten limit 0.25',{size:11,mono:true,stroke:CY})+
      box(460,44,90,44,'main\n(HEAD)',{size:11,stroke:AM,bold:true})+arrow(460,66,422,66,'')+
      line(340,92,340,118)+box(260,118,160,28,'tree 41013b9e…',{size:11,mono:true,stroke:LM})+line(100,92,100,118)+box(20,118,160,28,'tree (older)',{size:11,mono:true,stroke:DIM,color:DIM})+
      text(280,164,'rewrite one → later hashes change',{size:10,color:MG}),'Two Git commits, their trees and a branch pointer')}
  ];
  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
