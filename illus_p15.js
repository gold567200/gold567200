/* Illustrations — Domain 15: Systems Programming: C, Memory, Operating Systems & Compilers, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  /* ================= DOMAIN 15: Systems Programming ================= */
  I.p15m1=[{cap:"The four-stage pipeline that gcc hides. Each stage has a flag that stops after it and a file you can read: the preprocessed translation unit, the assembly, the object file with unresolved symbols, and the linked executable.",
    svg:flow([{t:'hello.c\nC source',stroke:CY},{t:'preprocess\ncpp  (-E)\nhello.i'},{t:'compile\ncc1  (-S)\nhello.s'},{t:'assemble\nas  (-c)\nhello.o'},{t:'link\nld\n./hello',stroke:LM}],{perRow:5,bw:86,bh:56,gap:26,label:'The C compilation pipeline: preprocess, compile, assemble, link'})},
   {cap:"Padding is where the bytes go. Every field must start at a multiple of its own size, so {char; int; char} costs 12 bytes while {int; char; char} costs 8 — the same data, one third smaller, just by reordering.",
    svg:svg(560,205,`${text(280,16,'struct { char c; int i; char d; }   →   sizeof = 12',{size:11,bold:true,color:CY})}
      ${['c','pad','pad','pad','i','i','i','i','d','pad','pad','pad'].map((t,i)=>box(40+i*36,28,34,34,t,{size:10,stroke:t==='pad'?DIM:(t==='i'?LM:CY),dash:t==='pad',color:t==='pad'?DIM:'currentColor'})+text(57+i*36,72,String(i),{size:9,color:DIM})).join('')}
      ${text(280,100,'struct { int i; char c; char d; }   →   sizeof = 8',{size:11,bold:true,color:LM})}
      ${['i','i','i','i','c','d','pad','pad'].map((t,i)=>box(40+i*36,112,34,34,t,{size:10,stroke:t==='pad'?DIM:(t==='i'?LM:CY),dash:t==='pad',color:t==='pad'?DIM:'currentColor'})+text(57+i*36,156,String(i),{size:9,color:DIM})).join('')}
      ${text(280,182,'rule: each field starts at a multiple of its own size;\nthe struct rounds up to its largest field\'s alignment',{size:10,color:AM,lh:12})}`,'Struct padding: 12 bytes versus 8 bytes for the same three fields')},
   {cap:"Pointer arithmetic is scaled by the type. With int *p at 0x1000, p + 1 is 0x1004 and p + 3 is 0x100C; cast to char * and the same +3 moves three bytes.",
    svg:svg(560,150,`${['0x1000','0x1004','0x1008','0x100C'].map((a,i)=>text(88+i*104,16,a,{size:10,mono:true,color:DIM})+box(40+i*104,28,96,44,'a['+i+']\n4 bytes',{size:11,stroke:i===0||i===1||i===3?CY:DIM})).join('')}
      ${arrow(88,112,88,78,'',{stroke:LM,sw:1.6})}${arrow(192,112,192,78,'',{stroke:LM,sw:1.6})}${arrow(400,112,400,78,'',{stroke:LM,sw:1.6})}
      ${text(88,124,'p',{size:11,bold:true,color:LM})}${text(192,124,'p + 1',{size:11,bold:true,color:LM})}${text(400,124,'p + 3',{size:11,bold:true,color:LM})}
      ${text(296,124,'p + 2',{size:11,color:DIM})}
      ${text(280,142,'(char *)p + 3 = 0x1003 — the step is sizeof(*p), not 1',{size:10,color:AM})}`,'Pointer arithmetic on an int array')}];

  I.p15m2=[{cap:"The address space of one Linux process, low addresses at the bottom. Code is read-only and executable, everything writable is non-executable, the heap grows up and the stack grows down from near the top.",
    svg:stack([{t:'kernel — upper half, not yours',stroke:DIM,color:DIM,side:'ring 0'},{t:'stack ↓  8 MiB, grows down',stroke:MG,side:'frames, locals  rw-p'},{t:'mmap region: shared libraries',side:'libc.so · big mallocs'},{t:'heap ↑  brk, grows up',stroke:AM,side:'malloc / free  rw-p'},{t:'.bss  zero-initialized globals',side:'0 bytes in the file'},{t:'.data  initialized globals',side:'rw-p'},{t:'.rodata  constants, strings',side:'r--p'},{t:'.text  machine code',stroke:CY,side:'r-xp  never w+x'}],{w:300,side:true,label:'Process address space, top to bottom'})},
   {cap:"Defense in layers, as a stack. Each mitigation sits on the one below it and answers a bypass of the previous generation; a stock 2026 Linux build ships with all of them, which checksec confirms.",
    svg:stack([{t:'shadow stack / CFI  (Intel CET, ARM PAC)',stroke:LM,side:'-fcf-protection'},{t:'full RELRO + FORTIFY_SOURCE=3',side:'-z relro -z now'},{t:'ASLR + PIE: random addresses each run',stroke:AM,side:'-fPIE -pie'},{t:'NX / W^X: data pages never execute',side:'GNU_STACK without x'},{t:'stack canary checked before ret',stroke:CY,side:'-fstack-protector-strong'},{t:'the program itself: bounds-checked C',stroke:MG,side:'snprintf, fgets, ASan'}],{w:300,side:true,label:'Mitigation layers from the program up to hardware'})},
   {cap:"glibc chunk arithmetic: the request plus an 8-byte size field, rounded up to a multiple of 16, never below 32. malloc(24) costs 32 bytes and malloc(100) costs 112; the 4 px per byte scale makes the overhead visible.",
    svg:svg(560,190,`${text(40,22,'malloc(24):  24 + 8 = 32  →  32-byte chunk',{anchor:'start',size:11,color:CY})}
      ${box(40,32,32,30,'hdr',{size:9,stroke:DIM,color:DIM})}${box(72,32,96,30,'24 usable bytes',{size:10,stroke:CY})}
      ${text(40,92,'malloc(100):  100 + 8 = 108  →  rounds up to 112',{anchor:'start',size:11,color:AM})}
      ${box(40,102,32,30,'hdr',{size:9,stroke:DIM,color:DIM})}${box(72,102,400,30,'100 requested bytes',{size:10,stroke:AM})}${box(472,102,16,30,'',{stroke:AM,dash:true})}${text(480,146,'+4 pad',{size:9,color:AM})}
      ${text(280,172,'rule: (n + 8) rounded up to 16, minimum 32, every chunk 16-byte aligned',{size:10,color:DIM})}`,'glibc malloc chunk sizes for 24 and 100 bytes')}];

  I.p15m3=[{cap:"One ELF file, two views. The linker works with sections (.text, .data, .symtab); the kernel's loader works with segments (LOAD, INTERP, DYNAMIC). The first four bytes are the magic number every tool checks.",
    svg:stack([{t:'ELF header: 7f 45 4c 46, class, type, entry',stroke:CY,side:'readelf -h'},{t:'program headers (segments)',stroke:AM,side:'loader view: readelf -l'},{t:'.text  code  r-x',side:'objdump -d'},{t:'.rodata  constants',side:'strings'},{t:'.data / .bss  globals  rw-',side:'.bss takes no file bytes'},{t:'.plt / .got  dynamic call tables',side:'RELRO makes .got read-only'},{t:'.symtab / .strtab  symbols',side:'nm; gone after strip'},{t:'section headers (sections)',stroke:MG,side:'linker view: readelf -S'}],{w:300,side:true,label:'Layout of an ELF executable'})},
   {cap:"fork returns twice, exec replaces the child's program while keeping its PID and open files, and waitpid turns the child's exit into the status the shell reports as $?.",
    svg:svg(560,230,`${text(20,20,'parent',{anchor:'start',size:10,color:DIM})}${text(20,120,'child',{anchor:'start',size:10,color:DIM})}
      ${box(20,40,110,40,'shell  PID 100',{stroke:CY,size:11})}${arrow(130,60,140,60,'')}${box(140,40,70,40,'fork()',{stroke:AM})}
      ${arrow(210,60,250,60,'→ 101')}${box(250,40,110,40,'waitpid(101)\nblocked',{stroke:CY,size:10})}
      ${box(380,40,170,40,'status 0  →  $? = 0',{stroke:LM,size:11})}
      ${arrow(175,80,175,140,'→ 0')}${box(140,140,70,40,'child\nPID 101',{stroke:MG,size:10})}${arrow(210,160,250,160,'')}${box(250,140,90,40,'execvp("ls")',{stroke:MG,size:10})}${arrow(340,160,380,160,'')}${box(380,140,80,40,'ls runs',{size:11})}${arrow(460,160,500,160,'')}${box(500,140,50,40,'exit(0)',{stroke:LM,size:9})}
      ${arrow(525,140,525,80,'SIGCHLD')}
      ${text(280,215,'fork copies page tables (copy-on-write); exec keeps PID and fds; wait reaps the zombie',{size:10,color:DIM})}`,'fork, exec and wait between a shell and its child')},
   {cap:"The millisecond after Enter. The kernel maps the segments and the interpreter named in INTERP; the dynamic loader maps libraries and relocates; then control reaches your main through libc's start-up code.",
    svg:flow([{t:'execve("./hello")',stroke:CY},{t:'kernel maps\nLOAD segments\n+ stack, auxv',edge:'trap'},{t:'ld-linux maps\nlibc, relocates',edge:'ld.so'},{t:'_start →\n__libc_start_main',edge:'jmp'},{t:'main()\nwrite(1, …)',stroke:LM,edge:'call'},{t:'exit_group(0)',stroke:MG,edge:'ret'}],{label:'Loader sequence from execve to exit_group'})}];

  I.p15m4=[{cap:"A 48-bit x86-64 address is four 9-bit table indexes plus a 12-bit page offset. For 0x00007f1234567abc the walk is entry 254, then 72, then 418, then 359, then byte 0xabc of the frame — four dependent reads unless the TLB has the answer.",
    svg:svg(560,240,`${text(280,16,'virtual address 0x00007f12 34567abc  (48 bits used)',{size:11,bold:true,color:CY})}
      ${box(40,30,90,34,'PML4 idx\n9 bits = 254',{stroke:MG,size:10})}${box(130,30,90,34,'PDPT idx\n9 bits = 72',{size:10})}${box(220,30,90,34,'PD idx\n9 bits = 418',{size:10})}${box(310,30,90,34,'PT idx\n9 bits = 359',{size:10})}${box(400,30,120,34,'page offset\n12 bits = 0xabc',{stroke:AM,size:10})}
      ${['47–39','38–30','29–21','20–12','11–0'].map((t,i)=>text(i<4?85+i*90:460,76,t,{size:9,color:DIM})).join('')}
      ${['CR3\nper process','PML4\n512 × 8 B','PDPT\n512 × 8 B','PD\n512 × 8 B','PT\n512 × 8 B','frame\n+ offset'].map((t,i)=>box(14+i*92,100,72,46,t,{size:10,stroke:i===0?MG:(i===5?LM:'currentColor')})+(i<5?arrow(88+i*92,123,104+i*92,123,''):'')).join('')}
      ${text(280,170,'each level is one 4 KiB table of 512 entries; only branches in use exist',{size:10,color:DIM})}
      ${text(280,190,'a flat table would need 2^35 × 8 B = 256 GiB per process',{size:10,color:AM})}
      ${text(280,212,'the TLB caches finished translations: ~64 L1 entries, ~2,000 L2',{size:10,color:LM})}`,'Four-level page-table walk on x86-64')},
   {cap:"Two napkin calculations. Scheduler weights decide the share of a core (nice 0 against nice 10 is 1024 against 110), and TLB reach is entries times page size, which is why huge pages multiply it by 512.",
    svg:svg(560,190,`${text(40,20,'one core, two busy tasks:',{anchor:'start',size:11,bold:true,color:CY})}
      ${box(40,32,433,30,'nice 0 · weight 1024 · 90.3%',{stroke:CY,fill:'#06303d',size:10})}${box(473,32,47,30,'',{stroke:MG,fill:'#2a0b2a'})}${text(497,76,'nice 10: 9.7%',{anchor:'end',size:10,color:MG})}
      ${text(200,76,'share = weight ÷ Σ weights = 1024 ÷ 1134',{size:10,color:DIM})}
      ${text(40,104,'TLB reach with the same 2,048 entries:',{anchor:'start',size:11,bold:true,color:AM})}
      ${box(40,116,160,32,'2,048 × 4 KiB = 8 MiB',{stroke:AM,size:10})}${box(240,116,280,32,'2,048 × 2 MiB = 4 GiB  (×512)',{stroke:LM,size:10})}
      ${text(280,172,'huge pages also skip a level of the walk — a common 10–20% win for big arrays',{size:10,color:DIM})}`,'Nice-weight CPU share and TLB reach arithmetic')},
   {cap:"A page fault is the mechanism, not a bug. Minor faults are answered from RAM in about a microsecond; major faults wait for storage; only a fault with no legal mapping becomes SIGSEGV.",
    svg:compare({t:'MINOR FAULT · from RAM',draw:x=>['first touch of a new page (demand zero)','file page already in the page cache','copy-on-write break after fork','cost about 1 µs, no I/O'].map((l,i)=>text(x+130,52+i*26,l,{size:10})).join('')},{t:'MAJOR FAULT · from disk',draw:x=>['page was swapped out: read it back','file page not cached: read from disk','cost ~100 µs NVMe, ~10 ms HDD','thousands per second = thrashing','no mapping at all → SIGSEGV'].map((l,i)=>text(x+130,52+i*26,l,{size:10,color:i===4?MG:AM})).join('')},{h:200,label:'Minor versus major page faults'})}];

  I.p15m5=[{cap:"Why counter++ loses updates. Each thread loads, adds and stores as three separate steps; when the steps interleave, both threads write 6 and one increment vanishes. This is a data race, and ThreadSanitizer reports exactly this interleaving.",
    svg:svg(560,258,`${text(120,22,'thread T1',{bold:true,color:CY})}${text(280,22,'counter in memory',{bold:true,color:AM})}${text(440,22,'thread T2',{bold:true,color:MG})}
      ${arrow(20,44,20,240,'',{stroke:DIM})}${text(20,34,'time',{size:9,color:DIM})}
      ${[['load counter → 5','5',null],[null,'5','load counter → 5'],['add 1 → 6 in register','5',null],[null,'5','add 1 → 6 in register'],['store 6','6',null],[null,'6, should be 7','store 6']].map((r,i)=>{ const y=42+i*32; return (r[0]?box(40,y,160,28,r[0],{stroke:CY,size:10}):'')+box(230,y,100,28,r[1],{stroke:i===5?MG:AM,size:10,color:i===5?MG:'currentColor'})+(r[2]?box(360,y,160,28,r[2],{stroke:MG,size:10}):''); }).join('')}
      ${text(280,246,'one increment is lost: load-add-store is three steps, not one',{size:10,color:DIM})}`,'Lost update from an interleaved counter++')},
   {cap:"Deadlock drawn as a wait-for cycle. Thread A holds lock 1 and wants lock 2; thread B holds lock 2 and wants lock 1. All four Coffman conditions are present; a global lock order removes the circular wait.",
    svg:svg(560,232,`${box(30,40,110,40,'thread A',{stroke:CY})}${box(190,40,110,40,'lock 1',{stroke:AM})}${box(30,150,110,40,'lock 2',{stroke:AM})}${box(190,150,110,40,'thread B',{stroke:MG})}
      ${arrow(140,60,190,60,'holds')}${arrow(85,80,85,150,'wants',{stroke:MG,dash:true})}${arrow(190,170,140,170,'holds')}${arrow(245,150,245,80,'wants',{stroke:MG,dash:true})}
      ${text(165,212,'wait-for cycle: A → 2 → B → 1 → A',{size:10,color:DIM})}
      ${text(435,30,'four conditions, all required',{size:11,bold:true,color:AM})}
      ${['1  mutual exclusion','2  hold-and-wait','3  no preemption','4  circular wait'].map((t,i)=>box(330,46+i*38,210,30,t,{size:10,stroke:i===3?MG:'currentColor'})).join('')}
      ${text(435,206,'break any one → no deadlock\nlock ordering breaks #4',{size:10,color:LM,lh:13})}`,'Deadlock wait-for cycle and the four Coffman conditions')},
   {cap:"Amdahl's law with 95% parallel work: 16 cores give 9.1×, 64 cores give 15.4×, and infinite cores give 20×. The serial 5% — usually a lock — caps everything.",
    svg:svg(560,210,`${text(280,16,"Amdahl's law, p = 0.95:  speedup = 1 / (0.05 + 0.95 / N)",{size:11,bold:true,color:CY})}
      ${line(30,50,530,50,{dash:true,stroke:MG})}${text(500,40,'limit 20×',{size:10,color:MG})}
      ${[[1,1.0],[2,1.9],[4,3.5],[8,5.9],[16,9.1],[64,15.4],['∞',20]].map(([n,s],i)=>{ const x=40+i*72, h=s*6; return box(x,170-h,46,h,'',{stroke:i===4?LM:CY,fill:'#06303d'})+text(x+23,161-h,s+'×',{size:10,color:i===4?LM:CY})+text(x+23,184,'N = '+n,{size:10}); }).join('')}
      ${text(280,202,'the serial 5% caps everything; 64 cores give 15×, not 64×',{size:10,color:DIM})}`,"Amdahl's law speedup bars for p = 0.95")}];

  I.p15m6=[{cap:"A byte's journey from printf to the platter. Three buffers stand between your program and durable storage; only fsync pushes through all of them and waits, and only the drive's flush makes it survive a power cut.",
    svg:flow([{t:'printf()\nstdio buffer\n4–8 KiB',stroke:CY},{t:'write()\nsystem call',edge:'flush'},{t:'page cache\ndirty, in RAM',stroke:AM,edge:'copy'},{t:'writeback\n≤ 30 s later',edge:'kernel timer'},{t:'drive write\ncache',edge:'fsync'},{t:'platter / NAND\ndurable',stroke:LM,edge:'FLUSH'}],{label:'Buffering layers between printf and the disk'})},
   {cap:"The inode is the file; names are directory entries pointing at it. Two hard links share inode 1234 (link count 2), a symlink is a separate tiny file holding a path, and the blocks are freed only when the last name and the last open descriptor are gone.",
    svg:svg(560,228,`${box(20,30,150,30,'directory  /home/t',{stroke:DIM,size:10})}${box(20,60,150,28,'notes.txt  →  #1234',{size:10})}${box(20,88,150,28,'backup  →  #1234',{size:10})}${box(20,116,150,28,'link  →  "notes.txt"',{size:10,stroke:MG})}
      <path d="M20 130 L8 130 L8 74 L16 74" fill="none" stroke="var(--mag)" stroke-width="1.3" stroke-dasharray="5 4" marker-end="url(#ah)"/>
      ${arrow(170,74,220,90,'')}${arrow(170,102,220,104,'')}
      ${box(220,40,170,120,'inode #1234\nmode rw-r--r--  uid 1000\nsize 8,192  mtime …\nlink count = 2\nextents → blocks',{stroke:CY,size:10})}
      ${arrow(390,100,430,54,'')}${arrow(390,100,430,90,'')}${arrow(390,100,430,126,'')}
      ${box(430,40,110,28,'block 5120',{size:10,stroke:LM})}${box(430,76,110,28,'block 5121',{size:10,stroke:LM})}${box(430,112,110,28,'…',{size:10,stroke:DIM})}
      ${text(280,190,'two names, one inode (hard links); the symlink is a file containing a path',{size:10,color:DIM})}
      ${text(280,210,'rm removes a name; blocks are freed at link count 0 with no open descriptor',{size:10,color:AM})}`,'Inode, directory entries, hard links, symlink and data blocks')},
   {cap:"The redirection puzzle as two file-descriptor tables. dup2 copies whatever descriptor 1 points at right now, so the order of > out.txt and 2>&1 decides where errors go.",
    svg:compare({t:'./prog > out.txt 2>&1',draw:x=>[['fd 0','terminal','currentColor'],['fd 1','out.txt',LM],['fd 2','out.txt',LM]].map((r,i)=>box(x+20,42+i*28,60,24,r[0],{size:10})+arrow(x+82,54+i*28,x+120,54+i*28,'')+text(x+180,54+i*28,r[1],{size:11,color:r[2]})).join('')+text(x+130,146,'1) fd 1 → out.txt\n2) fd 2 = copy of fd 1 → out.txt',{size:10,color:LM,lh:13})},{t:'./prog 2>&1 > out.txt',draw:x=>[['fd 0','terminal','currentColor'],['fd 1','out.txt',LM],['fd 2','terminal',MG]].map((r,i)=>box(x+20,42+i*28,60,24,r[0],{size:10})+arrow(x+82,54+i*28,x+120,54+i*28,'')+text(x+180,54+i*28,r[1],{size:11,color:r[2]})).join('')+text(x+130,146,'1) fd 2 = copy of fd 1 → terminal\n2) fd 1 → out.txt',{size:10,color:MG,lh:13})},{h:180,label:'File-descriptor tables for the two redirection orders'})}];

  I.p15m7=[{cap:"The compiler pipeline from characters to machine code. The front end understands the program, the middle end rewrites a machine-independent IR with dozens of passes, and the back end chooses instructions and registers.",
    svg:flow([{t:'source text\nint f(int a)…',stroke:CY},{t:'lexer\n→ tokens'},{t:'parser\n→ AST'},{t:'semantic check\nnames + types',edge:'AST'},{t:'IR (SSA)\noptimizer passes',stroke:AM,edge:'lower'},{t:'codegen\nregisters, asm',stroke:LM,edge:'emit'}],{label:'Compiler stages: lexer, parser, semantic analysis, IR, code generation'})},
   {cap:"One function through the compiler: the token stream, the syntax tree whose shape encodes precedence, the SSA form, and the single lea instruction that -O2 produces by strength reduction and x86 address-mode selection.",
    svg:svg(560,215,`${text(80,20,'tokens',{bold:true,color:CY})}${['return','a','*','8','+','1',';'].map((t,i)=>box(40,32+i*24,80,20,t,{size:10,mono:true,stroke:DIM})).join('')}
      ${text(280,28,'AST: return a * 8 + 1',{bold:true,color:AM,size:11})}
      ${line(280,75,230,105)}${line(280,75,330,105)}${line(230,135,190,165)}${line(230,135,270,165)}
      ${box(255,45,50,30,'+',{stroke:AM,bold:true})}${box(205,105,50,30,'*',{stroke:AM,bold:true})}${box(305,105,50,30,'1',{})}${box(165,165,50,30,'a',{})}${box(245,165,50,30,'8',{})}
      ${text(460,28,'IR (SSA)  →  x86-64',{bold:true,color:LM,size:11})}
      ${box(380,45,160,54,'%b = mul i32 %a, 8\n%r = add i32 %b, 1\nret i32 %r',{mono:true,size:9,stroke:DIM})}
      ${arrow(460,99,460,125,'-O2')}${box(380,125,160,44,'lea eax, [rdi*8+1]\nret',{mono:true,size:10,stroke:LM})}
      ${text(460,190,'mul → shift → lea address\nmode; no stack frame',{size:10,color:DIM,lh:13})}`,'Tokens, AST, SSA IR and the final lea instruction')},
   {cap:"The nand2tetris tower, bottom to top: twelve projects from a NAND gate to a running game, every layer built by you and tested in the free simulators.",
    svg:stack([{t:'Tetris / your Jack program',stroke:LM,side:'project 9'},{t:'OS classes in Jack (Math, Memory…)',side:'project 12'},{t:'Jack compiler → VM code',stroke:CY,side:'projects 10–11'},{t:'VM translator (stack machine)',side:'projects 7–8'},{t:'assembler → Hack binary',side:'project 6'},{t:'Hack CPU + memory',stroke:AM,side:'project 5'},{t:'ALU, registers, RAM, counter',side:'projects 2–3'},{t:'logic gates from NAND',stroke:MG,side:'project 1'}],{w:300,side:true,label:'The nand2tetris layers and projects'})},
   {cap:"A Makefile is a dependency graph. shell needs three object files; each object needs its .c file and the shared header; a change to shell.h rebuilds all three objects, a change to alloc.c rebuilds one.",
    svg:svg(560,195,`${box(230,15,100,32,'shell',{stroke:LM,bold:true})}
      ${line(280,47,115,75)}${line(280,47,280,75)}${line(280,47,445,75)}
      ${box(60,75,110,32,'main.o',{})}${box(225,75,110,32,'shell.o',{})}${box(390,75,110,32,'alloc.o',{})}
      ${line(115,107,70,140)}${line(280,107,235,140)}${line(445,107,400,140)}${line(115,107,500,140,{stroke:AM,dash:true})}${line(280,107,500,140,{stroke:AM,dash:true})}${line(445,107,500,140,{stroke:AM,dash:true})}
      ${box(30,140,80,28,'main.c',{size:10})}${box(195,140,80,28,'shell.c',{size:10})}${box(360,140,80,28,'alloc.c',{size:10})}${box(455,140,90,28,'shell.h',{size:10,stroke:AM})}
      ${text(280,185,'a target rebuilds only when a prerequisite is newer (make -j16 runs recipes in parallel)',{size:10,color:DIM})}`,'Make dependency graph for a three-file program')}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
