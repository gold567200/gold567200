/* Illustrations — Domain 50: TypeScript, Functional Programming, Design Patterns & Shell Scripting, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  const bar=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" opacity="0.75"/>`;
  /* ================= DOMAIN 50: TypeScript, FP, Patterns & Shell ================= */
  I.p50m1=[{cap:"Read types as sets of values. More required properties make a smaller set, so { x, y, label } sits inside Point and is assignable to it; a union is set union, an impossible intersection is never (the empty set), and unknown is everything.",
    svg:svg(560,230,`${box(10,10,540,210,'',{stroke:DIM,dash:true})}${text(24,26,'unknown — every value',{anchor:'start',size:11,color:DIM,bold:true})}
      ${box(28,40,262,170,'',{stroke:CY})}${text(42,56,'object types',{anchor:'start',size:10,color:CY})}
      ${box(46,68,226,128,'',{stroke:LM})}${text(60,84,'Point { x; y }',{anchor:'start',size:10,color:LM})}
      ${box(66,100,186,80,'{ x; y; label }\nmore properties = smaller set\nso it fits inside Point',{stroke:AM,size:10})}
      ${box(310,40,224,56,'string | number\nunion = set union',{stroke:MG,size:11})}
      ${box(310,106,224,44,'string & number = never',{stroke:DIM,size:11})}
      ${box(310,160,224,50,'never: the empty set\nno value is assignable',{size:10})}`,'Types drawn as nested sets of values')},
   {cap:"Narrowing as a sieve: each check in the code removes members from the union, so by the last branch only Reel is left and its properties can be used without a cast.",
    svg:svg(560,232,`${box(10,90,128,52,'v: string | number\n| Reel | null',{stroke:CY,size:10})}
      ${[['v === null','null → "nothing"'],['typeof v === "string"','string → v.length'],['typeof v === "number"','number → v.toFixed()'],['otherwise','Reel → v.id, v.feet']].map(([c,r],i)=>box(180,12+i*50,160,38,c,{mono:true,size:10,stroke:i===3?LM:'currentColor'})+box(384,12+i*50,166,38,r,{size:10,stroke:i===3?LM:DIM})+arrow(140,116,178,31+i*50,'')+arrow(342,31+i*50,382,31+i*50,'')).join('')}
      ${text(280,222,'each check removes one member of the union',{size:10,color:DIM})}`,'Control-flow narrowing of a union type')},
   {cap:"Erasure, line by line: type aliases, interfaces, assertions and type-only imports vanish, and signatures lose their annotations. An enum is the exception that generates code, which is why Node's type stripping rejects it.",
    svg:compare({t:'TYPESCRIPT SOURCE',draw:x=>['type Status = "a" | "b"','interface Reel { id: string }','function f(r: Reel): number','const s = x as Reel','import type { T } from "./t.ts"','enum Crew { North }'].map((l,i)=>text(x+14,52+i*24,l,{anchor:'start',size:10,mono:true,color:i===5?MG:'currentColor'})).join('')},
      {t:'JAVASCRIPT THAT RUNS',draw:x=>['(erased)','(erased)','function f(r)','const s = x','(erased)','var Crew; (function …) emits'].map((l,i)=>text(x+14,52+i*24,l,{anchor:'start',size:10,mono:true,color:i===5?MG:(l==='(erased)'?DIM:LM)})).join('')},{h:200,label:'TypeScript source versus emitted JavaScript'})}];
  I.p50m2=[{cap:"Three ways to run TypeScript. Only tsc checks types; Node's type stripping and bundlers such as Vite simply delete them, so every project needs tsc --noEmit in the editor and in CI however it runs.",
    svg:svg(560,254,`${box(10,102,96,50,'src/*.ts',{stroke:CY,bold:true,size:12})}
      ${[['tsc\ncheck + emit','dist/*.js + *.d.ts\nfor libraries',LM],['node file.ts\nstrip types','runs at once\nno type checking',AM],['Vite / esbuild\nstrip per file','browser bundle\nno type checking',AM]].map(([a,b,c],i)=>box(150,20+i*80,140,48,a,{size:10})+box(336,20+i*80,206,48,b,{size:10,stroke:c})+arrow(108,127,148,44+i*80,'')+arrow(292,44+i*80,334,44+i*80,'')).join('')}
      ${text(280,246,'checking is a separate step: tsc --noEmit in CI',{size:10,color:LM})}`,'Three TypeScript execution pipelines')},
   {cap:"Where runtime validation belongs: untrusted JSON enters as unknown, is parsed once by a schema at the boundary, and either becomes typed data the rest of the program trusts or a Result the caller must handle.",
    svg:svg(560,206,`${box(10,36,116,52,'HTTP JSON\ntype: unknown',{stroke:MG,size:10})}${box(156,36,116,52,'Zod safeParse\nat the boundary',{stroke:AM,size:10})}${box(302,36,116,52,'typed Reel[]\nfrom z.infer',{stroke:LM,size:10})}${box(448,36,102,52,'pure core\ntrusts types',{stroke:CY,size:10})}
      ${arrow(128,62,154,62,'')}${arrow(274,62,300,62,'')}${arrow(420,62,446,62,'')}
      ${arrow(214,90,214,128,'')}${box(144,130,140,46,'Result ok = false\nreject and alert',{stroke:MG,size:10})}
      ${text(420,140,'inside: no re-validation',{size:10,color:DIM})}
      ${text(280,196,'parse, don\'t validate: once, at the edge',{size:10,color:DIM})}`,'Validation at the trust boundary')},
   {cap:"The 72-million-foot bug laid out as arithmetic: validated numbers add to 13,355 ft; after an unchecked cast, the reduce's initial 0 and two strings concatenate into \"072306125\". Same code, same types on paper, different values at run time.",
    svg:svg(560,184,`${text(140,20,'numbers (validated)',{bold:true,size:11,color:LM})}${text(420,20,'strings (cast with as)',{bold:true,size:11,color:MG})}
      ${box(24,36,96,36,'7230',{mono:true,size:12})}${text(140,54,'+',{size:14,bold:true})}${box(160,36,96,36,'6125',{mono:true,size:12})}
      ${box(60,98,160,40,'13355 ft',{stroke:LM,bold:true,mono:true,size:12})}${arrow(140,74,140,96,'')}
      ${box(304,36,96,36,'"7230"',{mono:true,size:12,stroke:MG})}${text(420,54,'+',{size:14,bold:true})}${box(440,36,96,36,'"6125"',{mono:true,size:12,stroke:MG})}
      ${box(330,98,180,40,'"072306125"',{stroke:MG,bold:true,mono:true,size:12})}${arrow(420,74,420,96,'')}
      ${text(280,166,'0 + "7230" + "6125": + concatenates strings',{size:10,color:DIM})}`,'Number addition versus string concatenation')}];
  I.p50m3=[{cap:"Functional core, imperative shell: every decision is made by pure functions in the middle, which tests call with plain values; the thin shell around them reads the file and the clock and writes the results.",
    svg:svg(560,222,`${box(10,10,540,202,'',{stroke:AM,dash:true})}${text(24,26,'IMPERATIVE SHELL — effects live here',{anchor:'start',size:10,color:AM,bold:true})}
      ${box(24,46,124,36,'read splices.csv',{size:10})}${box(24,96,124,36,'clock: now()',{size:10})}${box(24,146,124,36,'env / config',{size:10})}
      ${box(180,40,196,156,'',{stroke:CY})}${text(278,58,'FUNCTIONAL CORE (pure)',{bold:true,size:10,color:CY})}
      ${box(196,72,164,30,'parse(text)',{mono:true,size:10})}${box(196,110,164,30,'evaluate(s, limit)',{mono:true,size:10})}${box(196,148,164,30,'summarize(vs)',{mono:true,size:10})}
      ${box(412,66,124,36,'print report',{size:10})}${box(412,126,124,36,'alert on failure',{size:10})}
      ${arrow(150,64,194,86,'')}${arrow(150,114,194,124,'')}${arrow(150,164,194,162,'')}${arrow(362,126,410,86,'')}${arrow(362,162,410,144,'')}`,'Functional core inside an imperative shell')},
   {cap:"A closure captures variables, not values. With var, the three callbacks share one binding that is 3 by the time they run; with let, every loop turn creates a fresh binding, so the callbacks print 0, 1 and 2.",
    svg:compare({t:'VAR: ONE SHARED BINDING',draw:x=>[0,1,2].map(i=>box(x+16,46+i*40,96,28,'callback '+(i+1),{size:10})+arrow(x+114,60+i*40,x+168,96,'')).join('')+box(x+170,76,74,40,'i = 3',{stroke:MG,mono:true,size:12})+text(x+130,176,'prints 3 3 3',{size:11,color:MG})},
      {t:'LET: A BINDING PER TURN',draw:x=>[0,1,2].map(i=>box(x+16,46+i*40,96,28,'callback '+(i+1),{size:10})+arrow(x+114,60+i*40,x+158,60+i*40,'')+box(x+160,46+i*40,74,28,'i = '+i,{stroke:LM,mono:true,size:11})).join('')+text(x+130,176,'prints 0 1 2',{size:11,color:LM})},{h:200,label:'Closures over var versus let'})},
   {cap:"The pipeline with its real numbers: filter keeps the two installed north reels, map turns each into feet used, reduce folds them into one total, and the total converts to 1,716.0 m.",
    svg:flow([{t:'4 reels\nR17 R18 R19 R20',stroke:CY},{t:'filter: north\nand installed'},{t:'R17, R20'},{t:'map used\n3220, 2410'},{t:'reduce (+, 0)\n5630 ft',stroke:LM},{t:'× 0.3048\n1716.0 m'}],{bw:150,bh:52,gap:40,label:'Filter, map and reduce over four reels'})},
   {cap:"Memoization measured on a log scale: naive fib(30) makes 2,692,537 calls (2F(31) − 1), while the memoized version computes each of the 31 values once — exponential versus linear work.",
    svg:svg(560,170,`${text(280,18,'calls to compute fib(30), log scale',{bold:true,size:11,color:CY})}
      ${[1,2,3,4,5,6].map(k=>line(140+k*54,32,140+k*54,118,{stroke:DIM,dash:true})+text(140+k*54,130,'10^'+k,{size:9,color:DIM})).join('')}
      ${text(14,56,'naive recursion',{anchor:'start',size:10})}${bar(140,46,Math.round(Math.log10(2692537)*54),20,MG)}${text(140+Math.round(Math.log10(2692537)*54)+6,56,'2,692,537',{anchor:'start',size:10,color:MG})}
      ${text(14,96,'memoized',{anchor:'start',size:10})}${bar(140,86,Math.round(Math.log10(31)*54),20,LM)}${text(140+Math.round(Math.log10(31)*54)+6,96,'31',{anchor:'start',size:10,color:LM})}
      ${text(280,158,'valid only because fib is a pure function',{size:10,color:DIM})}`,'Naive versus memoized Fibonacci call counts')}];
  I.p50m4=[{cap:"Counting states. Three independent fields multiply to 8 shapes, of which only 3 mean anything; a sum type with three variants has exactly the 3 legal shapes, so the 5 contradictions cannot even be written.",
    svg:svg(560,222,`${text(140,20,'PRODUCT: 2 × 2 × 2 = 8 shapes',{bold:true,size:11,color:AM})}
      ${['0 0 0','0 0 1','0 1 0','0 1 1','1 0 0','1 0 1','1 1 0','1 1 1'].map((t,i)=>{ const ok=(i===1||i===2||i===4); return box(16+(i%4)*64,36+Math.floor(i/4)*44,56,34,t,{mono:true,size:11,stroke:ok?LM:MG,dash:!ok,color:ok?LM:'currentColor'}); }).join('')}
      ${text(140,140,'bits: loading · error · data',{size:10,color:DIM})}${text(140,158,'3 valid (solid), 5 impossible (dashed)',{size:10})}
      ${text(420,20,'SUM: 1 + 1 + 1 = 3 shapes',{bold:true,size:11,color:LM})}
      ${['{ status: "loading" }','{ status: "error"; error }','{ status: "ok"; data }'].map((t,i)=>box(306,36+i*44,228,34,t,{mono:true,size:10,stroke:LM})).join('')}
      ${text(420,180,'contradictions cannot be written',{size:10,color:DIM})}
      ${text(280,210,'make illegal states unrepresentable',{size:10,color:CY})}`,'Product type versus sum type state counts')},
   {cap:"Result chaining as two rails (Scott Wlaschin's railway-oriented programming): each step either keeps a value on the ok rail or switches it to the error rail, and once on the error rail it passes every later step untouched.",
    svg:svg(560,202,`${text(14,60,'ok',{anchor:'start',size:11,color:LM,bold:true})}${text(14,150,'error',{anchor:'start',size:11,color:MG,bold:true})}
      ${box(60,40,110,40,'parse(line)',{mono:true,size:10})}${box(230,40,110,40,'check(range)',{mono:true,size:10})}${box(400,40,110,40,'used(feet)',{mono:true,size:10})}
      ${line(40,60,58,60,{stroke:LM,sw:2})}${line(172,60,228,60,{stroke:LM,sw:2})}${line(342,60,398,60,{stroke:LM,sw:2})}${arrow(512,60,552,60,'',{stroke:LM,sw:2})}
      ${line(52,150,500,150,{stroke:MG,sw:2})}${arrow(500,150,552,150,'',{stroke:MG,sw:2})}
      ${arrow(115,82,140,148,'',{stroke:MG,dash:true})}${arrow(285,82,310,148,'',{stroke:MG,dash:true})}${arrow(455,82,480,148,'',{stroke:MG,dash:true})}
      ${text(186,122,'R19: cannot parse',{size:9,color:MG})}${text(356,122,'R18: end > start',{size:9,color:MG})}${text(548,100,'R17: 3220 ft',{anchor:'end',size:9,color:LM})}
      ${text(280,186,'andThen runs the next step only on the ok rail',{size:10,color:DIM})}`,'Railway view of Result chaining')},
   {cap:"Laziness pulls values on demand: ten naturals are squared, seven are dropped, three pass, and take(3) stops the infinite generator. Below, the price of eagerness measured in CPython 3.13: about 40 MB for a million squares in a list versus about 200 bytes for a generator.",
    svg:svg(560,214,`${text(280,16,'naturals().map(sq).filter(> 50).take(3)',{mono:true,size:10,color:CY})}
      ${[1,2,3,4,5,6,7,8,9,10].map((n,i)=>{ const sq=n*n, keep=sq>50; return box(12+i*54,30,46,26,String(n),{mono:true,size:10,stroke:DIM})+text(35+i*54,72,String(sq),{mono:true,size:10,color:keep?LM:DIM})+text(35+i*54,90,keep?'keep':'drop',{size:9,color:keep?LM:DIM}); }).join('')}
      ${text(280,116,'take(3) is satisfied at n = 10; 11, 12 … are never computed',{size:10})}
      ${text(14,152,'eager list, 1M',{anchor:'start',size:10})}${bar(130,142,320,20,MG)}${text(456,152,'~40 MB',{anchor:'start',size:10,color:MG})}
      ${text(14,186,'generator',{anchor:'start',size:10})}${bar(130,176,3,20,LM)}${text(140,186,'~200 bytes',{anchor:'start',size:10,color:LM})}`,'Lazy pipeline and memory comparison')}];
  I.p50m5=[{cap:"The Gang of Four catalog (1994): 23 patterns in three families. Green ones are those you meet every week in TypeScript and Python code and frameworks; grey ones are rare outside compilers and GUI toolkits; singleton is amber because it is usually a global in disguise.",
    svg:svg(560,252,`${[['CREATIONAL · 5',10,[['Factory method',LM],['Abstract factory',DIM],['Builder',LM],['Prototype',DIM],['Singleton (careful)',AM]]],['STRUCTURAL · 7',195,[['Adapter',LM],['Bridge',DIM],['Composite',LM],['Decorator',LM],['Facade',LM],['Flyweight',DIM],['Proxy',LM]]],['BEHAVIORAL · 11',380,[['Chain of responsibility',LM],['Command',LM],['Interpreter',DIM],['Iterator',LM],['Mediator',DIM],['Memento',DIM],['Observer',LM],['State',LM],['Strategy',LM],['Template method',DIM],['Visitor',DIM]]]].map(([h,x,items])=>box(x,10,170,30,h,{stroke:CY,bold:true,size:11})+items.map(([n,c],i)=>text(x+85,56+i*16,n,{size:10,color:c})).join('')).join('')}
      ${text(280,242,'green: weekly · grey: rare · amber: handle with care',{size:9,color:DIM})}`,'The 23 Gang of Four patterns by family')},
   {cap:"Observer at work: the use case emits one typed event and never names its listeners; subscribers are added or removed (with the returned unsubscribe function) without editing the emitter — at the price of control flow you cannot read at the call site.",
    svg:svg(560,214,`${box(16,80,124,48,'use case\nemit("reelLow")',{stroke:CY,size:10})}${arrow(142,104,198,104,'')}
      ${box(200,72,134,64,'typed event bus\nEvents map\non() → unsubscribe',{stroke:AM,size:10})}
      ${['SMS crew lead','dashboard refresh','audit log'].map((t,i)=>box(404,14+i*66,140,40,t,{size:10})+arrow(336,104,402,34+i*66,'')).join('')}
      ${text(280,206,'the emitter never names its subscribers',{size:10,color:DIM})}`,'Observer pattern with a typed event bus')},
   {cap:"A pattern review in two columns: keep a pattern when it absorbs a variation that exists now; delete it when it only adds a file, a name and a jump for every reader.",
    svg:compare({t:'EARNS ITS KEEP',draw:x=>['a second implementation exists','the variation is real today','small interface, much hidden','replaces repeated switches','named in domain words'].map((l,i)=>text(x+130,54+i*26,l,{size:10,color:LM})).join('')},
      {t:'OVER-ENGINEERING',draw:x=>['one implementation "for later"','factory that only calls new','3-level inheritance for 2 methods','names describe the pattern','AbstractSingletonProxyFactoryBean'].map((l,i)=>text(x+130,54+i*26,l,{size:10,color:i===4?AM:MG})).join('')},{h:194,label:'When a pattern earns its keep'})}];
  I.p50m6=[{cap:"The same service two ways. Layered: each layer calls the one below, so the domain ends up depending on the database. Hexagonal: adapters for HTTP, CLI, SQLite and SMS all point inward at a core that imports none of them.",
    svg:compare({t:'LAYERED',draw:x=>['HTTP handlers','services','domain','database / ORM'].map((t,i)=>box(x+40,40+i*36,180,28,t,{size:10,stroke:i===3?MG:'currentColor'})+(i<3?arrow(x+130,68+i*36,x+130,74+i*36,''):'')).join('')+text(x+130,190,'domain depends on the database',{size:10,color:MG})},
      {t:'HEXAGONAL',draw:x=>box(x+70,88,120,46,'domain +\nuse cases',{stroke:CY,bold:true,size:11})+[['HTTP',x+8,40],['CLI',x+8,152],['SQLite',x+182,40],['SMS',x+182,152]].map(([t,ax,ay])=>box(ax,ay,70,28,t,{size:10,stroke:AM})).join('')+arrow(x+80,68,x+96,86,'')+arrow(x+80,152,x+96,136,'')+arrow(x+182,68,x+166,86,'')+arrow(x+182,152,x+166,136,'')+text(x+130,190,'all dependencies point inward',{size:10,color:LM})},{h:206,label:'Layered versus hexagonal dependencies'})},
   {cap:"The reel service as ports and adapters: driving adapters (CLI, HTTP) call the use case; the use case calls driven ports it owns (repository, notifier, clock), each with a real adapter for production and a fake or stub for tests.",
    svg:svg(560,238,`<polygon points="370,115 325,193 235,193 190,115 235,37 325,37" fill="none" stroke="${CY}" stroke-width="1.6"/>
      ${text(280,96,'RecordInstall',{bold:true,size:12,color:CY})}${text(280,116,'use case',{size:10,color:DIM})}${text(280,140,'install(): pure',{size:10,mono:true})}
      ${box(10,50,132,42,'CLI adapter\n(driving)',{size:10,stroke:AM})}${box(10,140,132,42,'HTTP adapter\n(driving)',{size:10,stroke:AM})}
      ${arrow(144,71,212,90,'')}${arrow(144,161,212,140,'')}
      ${box(404,18,150,48,'ReelRepository\nInMemory · SQLite',{size:10,stroke:LM})}${box(404,91,150,48,'Notifier\nConsole · SMS',{size:10,stroke:LM})}${box(404,164,150,48,'Clock\nsystem · stub',{size:10,stroke:LM})}
      ${arrow(348,76,402,44,'')}${arrow(372,115,402,115,'')}${arrow(348,154,402,186,'')}
      ${text(280,228,'ports are interfaces the core owns; adapters live outside',{size:10,color:DIM})}`,'Hexagon with driving and driven ports')},
   {cap:"Why fast adapters matter, as arithmetic: 360 in-memory tests at 2 ms, 40 database tests at 180 ms and a 9 s container start total about 16.9 s; running all 400 against the database costs 81 s, almost five times longer, on every run.",
    svg:svg(560,192,`${text(280,18,'400 tests: where the time goes',{bold:true,size:11,color:CY})}
      ${text(14,56,'360 fake + 40 DB',{anchor:'start',size:10})}${bar(140,46,4,20,LM)}${bar(144,46,36,20,AM)}${bar(180,46,44,20,MG)}${text(232,56,'16.9 s',{anchor:'start',size:10,color:LM})}
      ${text(14,100,'all 400 on DB',{anchor:'start',size:10})}${bar(140,90,356,20,AM)}${bar(496,90,44,20,MG)}${text(540,124,'81 s',{anchor:'end',size:10,color:MG})}
      ${bar(20,140,12,12,LM)}${text(38,146,'in-memory, 2 ms each',{anchor:'start',size:9})}${bar(200,140,12,12,AM)}${text(218,146,'database, 180 ms each',{anchor:'start',size:9})}${bar(390,140,12,12,MG)}${text(408,146,'container start, 9 s',{anchor:'start',size:9})}
      ${text(280,178,'360 × 2 ms + 40 × 180 ms + 9 s ≈ 16.9 s',{size:10,color:DIM})}`,'Test suite time with fake versus database adapters')}];
  I.p50m7=[{cap:"Bash's expansion order. Word splitting and globbing act only on the results of unquoted expansions from the third stage, which is why double quotes around $v and $(cmd) prevent both.",
    svg:flow([{t:'brace\n{1..3}'},{t:'tilde\n~'},{t:'parameter $v\narith · $(cmd)',stroke:CY},{t:'word splitting\non IFS',stroke:MG},{t:'globbing\n* ? [ ]',stroke:MG},{t:'quote removal\nthen execute',stroke:LM}],{bw:150,bh:52,gap:40,label:'Order of shell expansions'})},
   {cap:"Word splitting exactly as printf '[%s] ' reveals it: unquoted, one filename becomes three arguments; quoted, it stays one; and an unquoted variable holding *.xlsx is glob-expanded into every matching file.",
    svg:svg(560,202,`${text(280,16,'f="Reel 17 as-built.xlsx"',{mono:true,size:11,color:CY})}
      ${text(14,56,'printf … $f',{anchor:'start',mono:true,size:10})}${box(150,40,70,32,'Reel',{stroke:MG,mono:true,size:10})}${box(228,40,50,32,'17',{stroke:MG,mono:true,size:10})}${box(286,40,134,32,'as-built.xlsx',{stroke:MG,mono:true,size:10})}${text(432,56,'3 arguments',{anchor:'start',size:10,color:MG})}
      ${text(14,106,'printf … "$f"',{anchor:'start',mono:true,size:10})}${box(150,90,270,32,'Reel 17 as-built.xlsx',{stroke:LM,mono:true,size:10})}${text(432,106,'1 argument',{anchor:'start',size:10,color:LM})}
      ${text(14,156,'$pat (*.xlsx)',{anchor:'start',mono:true,size:10})}${box(150,140,131,32,'Reel 17 …xlsx',{stroke:AM,mono:true,size:10})}${box(289,140,131,32,'Reel 18 …xlsx',{stroke:AM,mono:true,size:10})}${text(432,156,'glob-expanded',{anchor:'start',size:10,color:AM})}
      ${text(280,192,'unquoted results are split on IFS, then globbed',{size:10,color:DIM})}`,'Word splitting and globbing of unquoted variables')},
   {cap:"Exit statuses carry meaning: 0 is success, 2 is bad usage, 126 and 127 mean the command could not run, and 128 + n means the process was killed by signal n — 130 for Ctrl-C, 137 for kill -9, 141 for SIGPIPE, 143 for SIGTERM.",
    svg:svg(560,212,`${[['0\nsuccess',LM],['1\ngeneral error','currentColor'],['2\nbad usage','currentColor'],['126\nnot\nexecutable',AM],['127\nnot found',AM]].map(([t,c],i)=>box(10+i*88,24,80,52,t,{stroke:c,size:10})).join('')}${box(452,24,98,52,'128 + n\nkilled by signal',{stroke:MG,size:10})}
      ${line(501,78,501,100)}${line(356,100,530,100)}
      ${[['130\nCtrl-C'],['137\nSIGKILL'],['141\nSIGPIPE'],['143\nSIGTERM']].map(([t],i)=>line(356+i*58,100,356+i*58,118)+box(330+i*58,118,52,44,t,{stroke:MG,size:10})).join('')}
      ${text(150,126,'$? holds the last status',{size:10})}${text(150,146,'PIPESTATUS: every stage',{size:10})}
      ${text(280,198,'codes 0–255; 128 + signal number when killed',{size:10,color:DIM})}`,'Map of shell exit statuses')},
   {cap:"Where shell ends and Python begins: keep short, linear glue in Bash; switch when you need data structures, floating point, many error-handling steps or portability, and call programs with subprocess.run and an argument list so no shell is involved.",
    svg:compare({t:'KEEP IT IN BASH',draw:x=>['glue for a few commands','under about 100 lines','linear control flow','text in, text out','only sh exists on the box'].map((l,i)=>text(x+130,54+i*26,l,{size:10,color:LM})).join('')},
      {t:'SWITCH TO PYTHON',draw:x=>['JSON or real data structures','floating point: $((7/2)) is 3','many steps with error handling','Windows or cross-platform','subprocess.run([…]): no shell'].map((l,i)=>text(x+130,54+i*26,l,{size:10,color:AM})).join('')},{h:194,label:'Bash versus Python decision'})}];
  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
