/* Illustrations — Domain 1: Hardware & How Computers Work (upgrade, October 2026).
   Concatenates new figures onto the originals defined in illus_core.js; never replaces them. */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const E=window.ILLUS||{}; const I={};
  const band=(x,y,w,h,c,op)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${c}" opacity="${op==null?0.22:op}"/>`;
  const seg=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" opacity="0.45" stroke="${c}" stroke-width="1"/>`;
  /* Repair, not replacement: three original figures in illus_core.js draw labels just outside their own viewBox
     (clipped on a phone), and one label sits on top of an axis label. Widen only the viewBox string and move that one
     label; the drawing and caption otherwise stay exactly as authored. */
  const fixVB=(arr,i,...pairs)=>{ arr=(arr||[]).slice(); if(arr[i]&&arr[i].svg){ let v=arr[i].svg; for(let k=0;k<pairs.length;k+=2) if(v.indexOf(pairs[k])>=0) v=v.replace(pairs[k],pairs[k+1]); arr[i]=Object.assign({},arr[i],{svg:v}); } return arr; };

  /* ---------- Module 1: bits, numbers, formats ---------- */
  I.p1m1=(E.p1m1||[]).concat([
   {cap:"Noise margins make two levels robust: anything below about 0.3 V reads as 0, anything above about 0.7 V as 1, and the wide forbidden gap absorbs noise. PAM4 (PCIe 6.0, 400G Ethernet) squeezes four levels into the same swing — two bits per symbol, a third of the margin, so it needs error correction.",
    svg:svg(560,215,
      `${text(150,16,'two levels: wide margins',{bold:true,color:CY,size:11})}
       ${text(44,40,'1.0 V',{anchor:'end',size:10,color:DIM})}${text(44,85,'0.7 V',{anchor:'end',size:10,color:DIM})}${text(44,145,'0.3 V',{anchor:'end',size:10,color:DIM})}${text(44,190,'0 V',{anchor:'end',size:10,color:DIM})}
       ${line(52,36,52,194,{stroke:DIM})}
       ${band(60,36,190,49,LM)}${text(155,60,'reads as 1',{size:11,color:LM,bold:true})}
       <rect x="60" y="85" width="190" height="60" rx="3" fill="none" stroke="${DIM}" stroke-dasharray="5 4"/>${text(155,115,'forbidden zone: absorbs noise',{size:10,color:DIM})}
       ${band(60,145,190,49,CY)}${text(155,170,'reads as 0',{size:11,color:CY,bold:true})}
       ${text(420,16,'PAM4: four levels, two bits',{bold:true,color:MG,size:11})}
       ${['11','10','01','00'].map((b,i)=>band(330,38+i*40,140,24,MG,0.18+0.06*i)+text(400,50+i*40,b,{size:12,bold:true,mono:true,color:MG})).join('')}
       ${['gap','gap','gap'].map((g,i)=>text(505,70+i*40,'margin ÷ 3',{size:9,color:DIM})).join('')}
       ${text(420,205,'needs forward error correction',{size:10,color:AM})}`,
      'Two-level logic thresholds with noise margins compared with four-level PAM4 signaling')},
   {cap:"Bits per weight decide what fits. The same 70-billion-parameter model is 280 GB in FP32, 140 GB in BF16 or FP16, 70 GB in FP8 and about 35–40 GB at 4 bits. Bar length is the bit width; colors show sign, exponent and fraction.",
    svg:svg(560,215,(()=>{ const rows=[['FP32',1,8,23,'280 GB'],['BF16',1,8,7,'140 GB'],['FP16',1,5,10,'140 GB'],['FP8 E4M3',1,4,3,'70 GB'],['FP4 E2M1',1,2,1,'~35 GB']]; const u=12, x0=80;
      let s=text(280,14,'bits per weight  →  size of a 70B model',{bold:true,color:CY,size:11});
      rows.forEach((r,i)=>{ const y=28+i*32; let x=x0; s+=text(72,y+11,r[0],{anchor:'end',size:10,mono:true}); s+=seg(x,y,r[1]*u,22,MG); x+=r[1]*u; s+=seg(x,y,r[2]*u,22,AM); x+=r[2]*u; s+=seg(x,y,r[3]*u,22,CY); x+=r[3]*u; s+=text(x+8,y+11,r[4],{anchor:'start',size:11,bold:true,color:LM}); });
      s+=seg(120,192,12,12,MG)+text(138,198,'sign',{anchor:'start',size:10})+seg(200,192,12,12,AM)+text(218,198,'exponent',{anchor:'start',size:10})+seg(300,192,12,12,CY)+text(318,198,'fraction',{anchor:'start',size:10});
      return s; })(),'Bit layouts of FP32, BF16, FP16, FP8 and FP4 with the resulting size of a 70B model')},
   {cap:"Endianness: the 32-bit value 0x12345678 occupies four bytes. x86-64 and ARM store the least significant byte first (little-endian); network protocols send the most significant first (big-endian), which is why packet and memory dumps read differently.",
    svg:compare({t:'little-endian (x86, ARM)',draw:x=>['78','56','34','12'].map((b,i)=>box(x+20+i*56,52,50,40,b,{mono:true,bold:true,size:14,stroke:i===0?CY:'currentColor'})+text(x+45+i*56,108,'+'+i,{size:10,color:DIM})).join('')+text(x+130,140,'lowest byte at lowest address',{size:10,color:CY})},
      {t:'big-endian (network order)',draw:x=>['12','34','56','78'].map((b,i)=>box(x+20+i*56,52,50,40,b,{mono:true,bold:true,size:14,stroke:i===0?MG:'currentColor'})+text(x+45+i*56,108,'+'+i,{size:10,color:DIM})).join('')+text(x+130,140,'highest byte first, as written',{size:10,color:MG})},{h:165,label:'The value 0x12345678 stored little-endian and big-endian'})}
  ]);

  /* ---------- Module 2: gates and adders ---------- */
  I.p1m2=fixVB(E.p1m2,0,'viewBox="0 0 600 250"','viewBox="0 0 600 262"').concat([
   {cap:"A CMOS inverter is one p-type and one n-type transistor in series. Input 1 turns the nMOS on and pulls the output to ground; input 0 turns the pMOS on and pulls it to the supply. In either steady state one switch is off, so almost no current flows — CMOS spends energy mainly when it switches.",
    svg:svg(560,220,
      `${line(60,24,220,24,{sw:2})}${text(140,12,'VDD ≈ 1.0 V',{size:10,color:AM})}
       ${line(140,24,140,52)}${box(100,52,80,40,'pMOS\non when A = 0',{size:10,stroke:MG})}
       ${line(140,92,140,132)}<circle cx="140" cy="112" r="3.5" fill="currentColor"/>${arrow(140,112,236,112,'',{})}${text(286,112,'Y = NOT A',{size:12,bold:true,color:LM})}
       ${box(100,132,80,40,'nMOS\non when A = 1',{size:10,stroke:CY})}${line(140,172,140,198)}${line(60,198,220,198,{sw:2})}${text(140,210,'ground 0 V',{size:10,color:DIM})}
       ${text(24,112,'A',{size:13,bold:true})}${line(34,112,78,112)}${line(78,72,78,152)}${line(78,72,100,72)}${line(78,152,100,152)}
       ${box(350,40,195,44,'A = 1: nMOS on, pMOS off\n→ Y pulled to 0',{size:10,stroke:CY})}
       ${box(350,96,195,44,'A = 0: pMOS on, nMOS off\n→ Y pulled to 1',{size:10,stroke:MG})}
       ${box(350,152,195,44,'steady state: one switch off\n→ almost no current',{size:10,stroke:LM})}`,
      'CMOS inverter built from a pMOS and an nMOS transistor')},
   {cap:"A 4-bit ripple-carry adder computing 0110 + 0111. Each full adder passes its carry to the column on its left, so the top bit cannot settle until the carry has rippled through every column: sums 1, 0, 1, 1 give 1101 = 13.",
    svg:svg(560,205,(()=>{ const cols=[{b:3,a:'0',bb:'0',s:'1'},{b:2,a:'1',bb:'1',s:'1'},{b:1,a:'1',bb:'1',s:'0'},{b:0,a:'0',bb:'1',s:'1'}]; const xs=[30,160,290,420]; const carries=['1','1','0'];
      let s=text(280,14,'0110 (6)  +  0111 (7)',{bold:true,color:CY,size:12});
      cols.forEach((c,i)=>{ const x=xs[i]; s+=text(x+45,38,'A'+c.b+'='+c.a+'  B'+c.b+'='+c.bb,{size:10,mono:true,color:DIM}); s+=arrow(x+45,46,x+45,66,''); s+=box(x,68,90,52,'full adder\nbit '+c.b,{size:11,stroke:i===3?CY:'currentColor'}); s+=arrow(x+45,120,x+45,146,''); s+=text(x+45,160,'S'+c.b+' = '+c.s,{size:11,bold:true,color:LM}); });
      for(let i=0;i<3;i++){ s+=arrow(xs[i+1]-2,94,xs[i]+92,94,'c='+carries[i],{color:AM}); }
      s+=arrow(548,94,512,94,'0',{color:AM}); s+=arrow(28,94,6,94,'',{}); s+=text(18,130,'Cout\n= 0',{size:9,color:DIM,lh:11});
      s+=text(280,190,'result 1101 = 13; the carry rippled through three columns',{size:11,color:AM});
      return s; })(),'Four full adders chained as a ripple-carry adder adding 6 and 7')},
   {cap:"Why lookahead wins: a 64-bit ripple adder's critical path is about 128 gate delays, longer than a 5 GHz clock period of roughly 20 delays; a tree-structured carry-lookahead adder needs about a dozen, at the cost of several times more gates.",
    svg:svg(560,160,
      `${text(100,40,'ripple-carry',{anchor:'end',size:11,bold:true})}${band(110,26,384,28,MG,0.3)}${text(302,40,'≈ 128 gate delays (2 per bit)',{size:11,bold:true})}
       ${text(100,88,'lookahead',{anchor:'end',size:11,bold:true})}${band(110,74,42,28,LM,0.4)}${text(182,88,'≈ 12–14 delays: 2 × log2(64) + a few',{anchor:'start',size:11,color:LM})}
       ${line(170,16,170,112,{dash:true,stroke:AM})}${text(170,126,'one 5 GHz clock ≈ 20 delays',{size:10,color:AM})}
       ${text(280,150,'at ~10 ps per delay: about 1.3 ns versus 0.14 ns',{size:10,color:DIM})}`,
      'Critical path of a 64-bit ripple-carry adder versus a carry-lookahead adder')}
  ]);

  /* ---------- Module 3: DRAM and SSD internals ---------- */
  I.p1m3=(E.p1m3||[]).concat([
   {cap:"Reading DDR5-6000 CL30-36-36: the memory clock is 3,000 MHz, a third of a nanosecond per cycle. A row hit costs only CL (10 ns); a row miss must precharge, activate and then read — about 34 ns inside the chip before the trip back through the controller and caches.",
    svg:svg(560,200,
      `${text(280,14,'DDR5-6000 CL30-36-36  ·  3,000 MHz clock  ·  0.33 ns per cycle',{size:11,bold:true,color:CY})}
       ${box(40,40,144,40,'precharge  tRP 36',{size:11,stroke:DIM})}${box(184,40,144,40,'activate  tRCD 36',{size:11,stroke:AM})}${box(328,40,120,40,'read  CL 30',{size:11,stroke:LM})}
       ${text(112,94,'12 ns',{size:11,color:DIM})}${text(256,94,'12 ns',{size:11,color:AM})}${text(388,94,'10 ns',{size:11,color:LM})}
       ${arrow(456,60,520,60,'data',{})}
       ${box(328,116,120,32,'row hit: 10 ns',{size:11,stroke:LM})}${text(188,132,'row already open →',{size:10,color:DIM})}
       ${text(244,172,'row miss: 12 + 12 + 10 ≈ 34 ns in the chip',{size:11,color:AM})}
       ${text(244,190,'DDR4-3200 CL16: 16 ÷ 1,600 MHz = the same 10 ns',{size:10,color:DIM})}`,
      'Timeline of DRAM precharge, activate and read with nanosecond conversions')},
   {cap:"Inside an NVMe SSD: the host talks to a controller (ARM cores running the flash translation layer, ECC and wear leveling) that keeps its address map in DRAM and drives several independent NAND channels in parallel. Pages are written in 16 KB units; blocks are erased whole.",
    svg:svg(560,232,
      `${box(8,92,96,52,'host CPU\nNVMe driver',{size:11,stroke:CY})}${arrow(106,118,150,118,'PCIe x4',{})}
       ${box(152,14,150,40,'DRAM: FTL map\n≈ 1 GB per TB',{size:10,stroke:AM})}${line(227,54,227,72,{stroke:AM})}
       ${box(152,72,150,100,'SSD controller\nARM cores\nflash translation layer\nECC · wear leveling',{size:10,stroke:MG})}
       ${[0,1,2,3].map(i=>{ const y=18+i*50; return line(302,122,350,y+17)+box(352,y,190,34,'',{stroke:'currentColor'})+text(392,y+17,'ch '+i,{size:10,color:DIM})+[0,1,2,3].map(j=>`<rect x="${418+j*30}" y="${y+7}" width="24" height="20" rx="3" fill="none" stroke="${CY}"/>`).join(''); }).join('')}
       ${text(447,222,'NAND dies on 4 channels',{size:10,color:DIM})}
       ${text(150,200,'write: 16 KB pages',{size:10,color:LM,anchor:'start'})}${text(150,216,'erase: whole blocks of MBs',{size:10,color:AM,anchor:'start'})}`,
      'Block diagram of an NVMe SSD: host, controller, DRAM and NAND channels')},
   {cap:"More bits per cell means more voltage levels squeezed into the same window: 2 for SLC, 4 for MLC, 8 for TLC, 16 for QLC. Each step is cheaper per gigabyte but slower to write and good for fewer program/erase cycles.",
    svg:svg(560,215,(()=>{ const cols=[['SLC',1,'~100k P/E'],['MLC',2,'~3–10k'],['TLC',3,'~1–3k'],['QLC',4,'~0.3–1k']]; let s=text(280,14,'same voltage window, more levels',{bold:true,color:CY,size:11});
      cols.forEach((c,i)=>{ const cx=80+i*133, n=Math.pow(2,c[1]), h=128/n; for(let k=0;k<n;k++){ s+=`<rect x="${cx-30}" y="${30+k*h}" width="60" height="${Math.max(h-1.5,1.5)}" fill="${[LM,CY,AM,MG][i]}" opacity="${k%2?0.22:0.5}"/>`; }
        s+=`<rect x="${cx-30}" y="30" width="60" height="128" fill="none" stroke="currentColor"/>`; s+=text(cx,174,c[0]+': '+c[1]+' bit'+(c[1]>1?'s':''),{size:11,bold:true}); s+=text(cx,192,n+' levels',{size:10,color:DIM}); s+=text(cx,207,c[2],{size:10,color:AM}); });
      return s; })(),'Voltage levels per cell for SLC, MLC, TLC and QLC NAND with endurance')}
  ]);

  /* ---------- Module 4: ISA, iron law, privilege ---------- */
  I.p1m4=(E.p1m4||[]).concat([
   {cap:"One operation, three instruction sets. x86-64 encodes add rax, rbx in three bytes from a variable-length format (1 to 15 bytes); ARM64 and RISC-V use one fixed 32-bit word, which is why their decoders can take eight instructions at a time.",
    svg:svg(560,200,
      `${text(12,30,'x86-64',{anchor:'start',size:11,bold:true,color:CY})}${text(12,46,'add rax, rbx',{anchor:'start',size:10,mono:true,color:DIM})}
       ${['48','01','D8'].map((b,i)=>box(150+i*50,22,46,34,b,{mono:true,bold:true,size:13,stroke:CY})).join('')}${text(310,39,'prefix · opcode · ModRM',{anchor:'start',size:10,color:DIM})}
       ${text(12,96,'ARM64',{anchor:'start',size:11,bold:true,color:MG})}${text(12,112,'add x0, x0, x1',{anchor:'start',size:10,mono:true,color:DIM})}
       ${box(150,88,196,34,'0x8B010000',{mono:true,bold:true,size:13,stroke:MG})}${text(356,105,'one fixed 32-bit word',{anchor:'start',size:10,color:DIM})}
       ${text(12,162,'RISC-V',{anchor:'start',size:11,bold:true,color:AM})}${text(12,178,'add a0, a0, a1',{anchor:'start',size:10,mono:true,color:DIM})}
       ${box(150,154,196,34,'0x00B50533',{mono:true,bold:true,size:13,stroke:AM})}${text(356,171,'funct7 rs2 rs1 f3 rd op',{anchor:'start',size:10,color:DIM})}`,
      'The same register add encoded for x86-64, ARM64 and RISC-V')},
   {cap:"The iron law of performance: time = instructions × cycles per instruction × seconds per cycle. Ten billion instructions at CPI 0.4 on a 5 GHz clock take 0.8 s. Each factor is a different lever: algorithms and SIMD, core design, clock speed.",
    svg:svg(560,170,
      `${box(10,30,130,56,'instructions\n10 billion',{size:11,stroke:CY})}${text(152,58,'×',{size:18,bold:true})}
       ${box(164,30,130,56,'cycles / instr.\n0.4 (IPC 2.5)',{size:11,stroke:MG})}${text(306,58,'×',{size:18,bold:true})}
       ${box(318,30,110,56,'s / cycle\n0.2 ns (5 GHz)',{size:11,stroke:AM})}${text(440,58,'=',{size:18,bold:true})}
       ${box(452,30,98,56,'CPU time\n0.8 s',{size:12,bold:true,stroke:LM,color:LM})}
       ${text(75,110,'better algorithm,',{size:10,color:CY})}${text(75,124,'SIMD, compiler',{size:10,color:CY})}
       ${text(229,110,'wider, smarter core',{size:10,color:MG})}${text(229,124,'(fewer stalls)',{size:10,color:MG})}
       ${text(373,110,'higher clock',{size:10,color:AM})}${text(373,124,'(power ∝ V²·f)',{size:10,color:AM})}
       ${text(280,156,'the only three levers on performance',{size:11,bold:true,color:DIM})}`,
      'Iron law of processor performance with a worked example')},
   {cap:"Privilege levels, enforced by the CPU itself. Applications run in user mode and must make a system call to reach the kernel; a hypervisor sits beneath guest kernels using VT-x or AMD-V; firmware and a security processor run before and beneath them all.",
    svg:stack([{t:'user mode (ring 3): apps, games',stroke:CY,side:'syscall to ask the kernel'},{t:'kernel mode (ring 0): the OS',stroke:MG,side:'drivers, page tables'},{t:'hypervisor: VT-x / AMD-V',stroke:AM,side:'Hyper-V, WSL 2, Proxmox'},{t:'firmware (UEFI) + security CPU',stroke:DIM,side:'runs first, verifies boot'}],{w:300,side:true,label:'Privilege layers from applications down to firmware'})}
  ]);

  /* ---------- Module 5: AMAT, power limits, bottleneck test ---------- */
  I.p1m5=(E.p1m5||[]).concat([
   {cap:"Average memory access time, level by level: with L1 at 1 ns missing 5% of the time, and 20% of those misses going on from L2 (4 ns) to DRAM (80 ns), the average access costs 2.0 ns — twice an L1 hit, set mostly by how often you reach DRAM.",
    svg:svg(560,190,
      `${box(20,30,120,52,'L1 cache\n1 ns',{size:12,stroke:LM})}${arrow(142,56,208,56,'5% miss',{})}
       ${box(210,30,120,52,'L2 cache\n4 ns',{size:12,stroke:AM})}${arrow(332,56,398,56,'20% miss',{})}
       ${box(400,30,140,52,'DRAM\n80 ns',{size:12,stroke:MG})}
       ${text(280,118,'AMAT = 1 + 0.05 × (4 + 0.2 × 80)',{size:13,mono:true,color:CY})}
       ${text(280,142,'= 1 + 0.05 × 20 = 2.0 ns',{size:13,mono:true,bold:true,color:LM})}
       ${text(280,172,'halve DRAM misses → 1.6 ns · double L1 time → 3.0 ns',{size:10,color:DIM})}`,
      'Average memory access time computed across L1, L2 and DRAM')},
   {cap:"TDP is not the power draw. An Intel desktop chip may run at its 250 W turbo limit (PL2) for tau seconds, then settle at its 125 W base power (PL1); AMD's limit is PPT, 1.35 × TDP — 162 W for a 120 W-TDP part. Coolers and power supplies must be sized for the enforced limits.",
    svg:svg(560,210,
      `${line(60,30,60,170,{stroke:DIM})}${line(60,170,525,170,{stroke:DIM})}
       ${text(52,53,'250 W',{anchor:'end',size:10,color:DIM})}${text(52,94,'162 W',{anchor:'end',size:10,color:DIM})}${text(52,112,'125 W',{anchor:'end',size:10,color:DIM})}${text(52,170,'0',{anchor:'end',size:10,color:DIM})}
       <path d="M60 53 L275 53 L275 112 L520 112" fill="none" stroke="${CY}" stroke-width="2.2"/>
       <path d="M60 94 L520 94" fill="none" stroke="${MG}" stroke-width="2" stroke-dasharray="6 4"/>
       ${text(168,43,'Intel PL2: 250 W turbo',{size:10,color:CY})}${text(400,126,'Intel PL1: 125 W sustained',{size:10,color:CY})}
       ${text(400,84,'AMD PPT: 162 W (TDP 120 W)',{size:10,color:MG})}
       ${text(60,186,'0 s',{size:10,color:DIM})}${text(275,186,'tau ≈ 56 s',{size:10,color:DIM})}${text(515,186,'time',{size:10,color:DIM})}
       ${text(300,198,'many boards set PL1 = PL2: the chip never drops back',{size:10,color:AM})}`,
      'CPU package power over time under Intel PL1 and PL2 limits and an AMD PPT limit')},
   {cap:"The resolution test for bottlenecks: if raising the resolution barely changes the frame rate, the CPU is the limit (the GPU had headroom); when the frame rate falls, the GPU has become the limit. Here the laptop is CPU-bound at 1080p and 1440p and GPU-bound at 4K.",
    svg:svg(560,196,
      `${line(60,150,520,150,{stroke:DIM})}
       ${band(110,30,90,120,CY,0.35)}${text(155,22,'92 fps',{size:11,bold:true})}${text(155,166,'1080p',{size:11})}
       ${band(240,32,90,118,CY,0.35)}${text(285,24,'91 fps',{size:11,bold:true})}${text(285,166,'1440p',{size:11})}
       ${band(370,67,90,83,MG,0.35)}${text(415,59,'64 fps',{size:11,bold:true})}${text(415,166,'4K',{size:11})}
       ${text(220,186,'flat → CPU-bound',{size:11,color:AM,bold:true})}${text(415,186,'falls → GPU-bound',{size:11,color:MG,bold:true})}`,
      'Frame rate at three resolutions showing CPU-bound and GPU-bound regimes')}
  ]);

  /* ---------- Module 6: buses, DMA, unified memory, UEFI ---------- */
  I.p1m6=fixVB(E.p1m6,0,'viewBox="0 0 600 290"','viewBox="0 0 600 298"').concat([
   {cap:"PCIe bandwidth roughly doubles each generation. Per direction, a x16 graphics slot carries about 15.8 GB/s on PCIe 3.0, 31.5 on 4.0, 63 on 5.0, about 121 on 6.0 and 242 on 7.0; an NVMe drive's x4 link is a quarter of each.",
    svg:svg(560,215,(()=>{ const rows=[['PCIe 3.0 · 8 GT/s',15.8,'15.8'],['PCIe 4.0 · 16 GT/s',31.5,'31.5'],['PCIe 5.0 · 32 GT/s',63,'63'],['PCIe 6.0 · 64 GT/s',121,'~121'],['PCIe 7.0 · 128 GT/s',242,'~242']]; const k=1.55;
      let s=text(330,14,'x16 bandwidth per direction, GB/s',{bold:true,color:CY,size:11});
      rows.forEach((r,i)=>{ const y=28+i*34; s+=text(126,y+12,r[0],{anchor:'end',size:10,mono:true}); s+=band(134,y,r[1]*k,24,i<3?CY:MG,0.4); s+=text(134+r[1]*k+6,y+12,r[2],{anchor:'start',size:11,bold:true}); });
      s+=text(330,200,'128b/130b to 5.0 · PAM4 + FLIT from 6.0 · x4 NVMe = ÷ 4',{size:10,color:DIM});
      return s; })(),'PCIe x16 bandwidth by generation')},
   {cap:"An NVMe read without the CPU copying data: the driver queues a command in RAM and rings the drive's doorbell; the SSD fetches the command and writes the data into RAM by DMA, posts a completion and raises an MSI-X interrupt on the core that asked.",
    svg:flow([{t:'driver writes\ncommand to\nsubmission queue',stroke:CY},{t:'doorbell write\n(MMIO register)'},{t:'SSD fetches\ncommand\n(DMA read)'},{t:'NAND read →\ndata into RAM\n(DMA write)',stroke:AM},{t:'completion\nentry posted\n(DMA write)'},{t:'MSI-X interrupt\nto the core\nthat asked',stroke:LM}],{perRow:3,bw:150,bh:60,gap:40,label:'Sequence of an NVMe read using DMA and an MSI-X interrupt'})},
   {cap:"Discrete VRAM versus unified memory for local AI. Your laptop's RTX 5090 has 24 GB of fast GDDR7 behind a PCIe link from 64 GB of slower DDR5; an M5 Ultra Mac Studio shares up to 512 GB at 1.2 TB/s among CPU, GPU and Neural Engine. Decoding speed ≈ bandwidth ÷ model size, so a 40 GB model splits badly on the laptop and fits whole on the Mac.",
    svg:compare({t:'laptop: discrete VRAM',draw:x=>box(x+18,44,92,34,'i9 CPU',{size:11,stroke:CY})+box(x+18,104,92,46,'64 GB DDR5\n89.6 GB/s',{size:10})+line(x+64,78,x+64,104)+box(x+150,44,96,34,'RTX 5090 L',{size:11,stroke:MG})+box(x+150,104,96,46,'24 GB GDDR7\n896 GB/s',{size:10,stroke:MG})+line(x+198,78,x+198,104)+arrow(x+112,61,x+148,61,'')+text(x+130,92,'PCIe',{size:9,color:DIM})+text(x+130,172,'40 GB model: ~4 tok/s',{size:11,bold:true,color:AM})},
      {t:'Mac Studio: unified memory',draw:x=>box(x+18,44,224,40,'M5 Ultra: CPU + GPU + Neural Engine',{size:10,stroke:CY})+line(x+130,84,x+130,104)+box(x+18,104,224,46,'up to 512 GB unified\n1.2 TB/s, no copies',{size:11,stroke:LM})+text(x+130,172,'40 GB model: ~30 tok/s ceiling',{size:11,bold:true,color:LM})},{h:195,label:'Discrete GPU memory compared with unified memory for running a 40 GB model'})},
   {cap:"What runs between the power button and Windows or Linux: a security processor checks the firmware, UEFI's SEC, PEI, DXE and BDS phases bring up the cache, memory, drivers and boot order, and a signed loader from the EFI System Partition starts the kernel.",
    svg:flow([{t:'security CPU\nverifies\nfirmware',stroke:MG},{t:'SEC\ncache as RAM'},{t:'PEI\nmemory init\n+ training',stroke:AM},{t:'DXE\ndrivers,\nGOP video'},{t:'BDS\nBootOrder\nfrom NVRAM'},{t:'ESP loader\nSecure Boot\nsignature check',stroke:CY},{t:'kernel +\ndrivers'},{t:'login',stroke:LM}],{perRow:4,bw:110,bh:58,gap:30,label:'UEFI boot phases from security processor to login'})}
  ]);

  /* ---------- Module 7: lithography, yield, transistor shapes ---------- */
  I.p1m7=fixVB(E.p1m7,1,'viewBox="0 0 520 170"','viewBox="0 0 562 170"','<text x="300" y="152" text-anchor="middle" font-size="10"','<text x="300" y="11" text-anchor="middle" font-size="10"').concat([
   {cap:"The Rayleigh limit as arithmetic: CD = k1 × λ / NA. Deep-ultraviolet immersion prints about 40 nm in one exposure, EUV about 16 nm, and High-NA EUV about 10 nm — which is why the leading edge moved to 13.5 nm light.",
    svg:svg(560,180,
      `${text(280,14,'smallest half-pitch in one exposure:  CD = k1 × λ / NA',{bold:true,color:CY,size:11})}
       ${text(192,46,'DUV 193 nm · NA 1.35',{anchor:'end',size:10,mono:true})}${band(200,34,280,24,DIM,0.45)}${text(486,46,'≈ 40 nm',{anchor:'start',size:11,bold:true})}
       ${text(192,90,'EUV 13.5 nm · NA 0.33',{anchor:'end',size:10,mono:true})}${band(200,78,115,24,CY,0.45)}${text(321,90,'≈ 16 nm',{anchor:'start',size:11,bold:true})}
       ${text(192,134,'High-NA EUV · NA 0.55',{anchor:'end',size:10,mono:true})}${band(200,122,70,24,LM,0.5)}${text(276,134,'≈ 10 nm',{anchor:'start',size:11,bold:true})}
       ${text(280,168,'k1 ≈ 0.28–0.4 · finer pitches need multiple exposures',{size:10,color:DIM})}`,
      'Lithography resolution for DUV, EUV and High-NA EUV')},
   {cap:"Same wafer, very different economics. At 0.1 defects per cm², a 300 mm wafer holds about 70 candidates for a 750 mm² GPU die, of which about 47% are perfect; it holds about 917 candidates for a 71 mm² chiplet at 93% yield. Magenta squares mark dies hit by a defect.",
    svg:(()=>{ const wafer=(x,d,pBad,seed,lab,col)=>{ const cx=x+130, cy=104, r=66; let z=seed; const rnd=()=>(z=(z*16807)%2147483647)/2147483647; let s=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="currentColor"/>`; const n=Math.ceil(r/d)+1;
        for(let i=-n;i<n;i++) for(let j=-n;j<n;j++){ const x0=cx+i*d, y0=cy+j*d; const ok=[[x0,y0],[x0+d,y0],[x0,y0+d],[x0+d,y0+d]].every(([a,b])=>Math.hypot(a-cx,b-cy)<=r); if(!ok) continue; const bad=rnd()<pBad; const g=d>6?0.8:0.4; s+=`<rect x="${x0+g}" y="${y0+g}" width="${d-2*g}" height="${d-2*g}" fill="${bad?MG:CY}" opacity="${bad?0.75:0.35}"/>`; }
        return s+text(cx,182,lab,{size:10,bold:true,color:col}); };
      return compare({t:'750 mm² GPU die',draw:x=>wafer(x,12.05,0.53,11,'≈ 70 candidates · ~47% perfect',AM)},{t:'71 mm² chiplet',draw:x=>wafer(x,3.71,0.07,29,'≈ 917 candidates · ~93% perfect',LM)},{h:200,label:'Dies per wafer and yield for a large GPU die and a small chiplet'}); })()},
   {cap:"The transistor changed shape to stop leaking. A planar gate sits on top of the channel; a FinFET's gate wraps a vertical fin on three sides (from 2011); a gate-all-around nanosheet transistor surrounds stacked sheets on all four sides (from 2022).",
    svg:svg(560,195,
      `${text(280,14,'more gate around the channel  →  less leakage',{bold:true,color:CY,size:11})}
       ${band(40,118,120,22,CY,0.45)}${band(70,94,60,24,MG,0.55)}${text(100,82,'gate',{size:10,color:MG})}${text(100,152,'channel',{size:10,color:CY})}
       ${text(100,172,'planar: one side',{size:11,bold:true})}
       ${band(250,62,60,14,MG,0.55)}${band(250,62,12,82,MG,0.55)}${band(298,62,12,82,MG,0.55)}${band(266,80,28,64,CY,0.5)}${line(230,144,330,144)}
       ${text(280,172,'FinFET: three sides',{size:11,bold:true})}${text(280,188,'Intel 22 nm, 2011',{size:10,color:DIM})}
       <rect x="410" y="66" width="100" height="84" rx="6" fill="${MG}" opacity="0.3"/>${[0,1,2].map(i=>band(424,80+i*22,72,12,CY,0.7)).join('')}
       ${text(460,172,'GAA: all four sides',{size:11,bold:true})}${text(460,188,'Samsung 3 nm, 2022',{size:10,color:DIM})}`,
      'Planar, FinFET and gate-all-around transistor cross-sections')}
  ]);

  /* ---------- Module 8: power and heat (new) ---------- */
  I.p1m8=[
   {cap:"Inside an ATX power supply: mains AC is rectified and boosted by power-factor correction to about 400 V DC — the capacitor that makes opening a PSU dangerous even after unplugging — then switched through an isolating transformer to 12 V, from which 5 V and 3.3 V are derived.",
    svg:flow([{t:'AC in\n100–240 V'},{t:'rectifier + PFC\n≈ 400 V DC\nDANGER: stays charged',stroke:MG,color:MG},{t:'switching +\ntransformer\n(isolation)'},{t:'12 V main rail\n(almost all load)',stroke:AM},{t:'DC-DC\n5 V · 3.3 V\n+ 5 VSB standby'},{t:'24-pin · EPS ·\nPCIe · 12V-2x6',stroke:CY}],{perRow:3,bw:150,bh:62,gap:40,label:'Power conversion stages inside an ATX power supply'})},
   {cap:"A wattage budget for an RTX 5090 desktop: 575 W of graphics, 162 W of CPU at its PPT limit and about 108 W for everything else make 845 W sustained — 85% of a 1,000 W supply before transients. At 89% efficiency the wall sees about 950 W, all of which ends up as heat in the room.",
    svg:svg(560,190,
      `${text(280,14,'sustained DC load versus PSU rating',{bold:true,color:CY,size:11})}
       ${band(20,40,287,36,MG,0.45)}${text(163,58,'GPU 575 W',{size:11,bold:true})}
       ${band(307,40,81,36,CY,0.45)}${text(347,58,'CPU 162 W',{size:10,bold:true})}
       ${band(388,40,54,36,AM,0.45)}${text(415,58,'rest 108',{size:9,bold:true})}
       ${line(442,30,442,86,{stroke:LM,sw:1.6})}${text(442,96,'845 W (85%)',{size:10,bold:true,color:LM})}
       <rect x="20" y="40" width="500" height="36" rx="3" fill="none" stroke="currentColor" stroke-dasharray="5 4"/>${text(520,28,'1,000 W PSU',{anchor:'end',size:10,color:DIM})}
       ${text(280,124,'wall: 845 ÷ 0.89 ≈ 950 W  →  7.9 A at 120 V',{size:11,color:AM})}
       ${text(280,146,'room heat ≈ 3,240 BTU/h  ·  airflow ≈ 149 CFM at ΔT 10 °C',{size:11,color:AM})}
       ${text(280,170,'15 A circuit: keep continuous load under 1,440 W',{size:10,color:DIM})}`,
      'Stacked wattage budget for a high-end desktop against a 1,000 W supply')},
   {cap:"Heat flows through a chain of thermal resistances like current through resistors: ΔT = P × θ. With 0.30 °C/W from die to air, a 200 W CPU in a 25 °C room settles at 85 °C. The paste layer itself contributes only about 0.016 °C/W — if it fully replaces the air.",
    svg:svg(560,200,(()=>{ const items=[['silicon\njunction',CY],['solder +\nheat spreader','currentColor'],['thermal paste\n≈ 0.016 °C/W',AM],['cooler base +\nheat pipes','currentColor'],['fins → air\n25 °C',LM]]; let s='';
      items.forEach((it,i)=>{ const x=10+i*110; s+=box(x,34,92,54,it[0],{size:10,stroke:it[1]}); if(i<4) s+=arrow(x+94,61,x+108,61,''); });
      s+=text(56,104,'85 °C',{size:12,bold:true,color:MG})+text(496,104,'25 °C',{size:12,bold:true,color:LM});
      s+=text(280,136,'ΔT = P × θ = 200 W × 0.30 °C/W = 60 °C',{size:12,mono:true,color:CY});
      s+=text(280,160,'T junction = 25 + 60 = 85 °C',{size:12,mono:true,bold:true});
      s+=text(280,186,'same gap filled with air: ≈ 4.8 °C/W — instant throttling',{size:10,color:DIM});
      return s; })(),'Thermal resistance chain from silicon junction to ambient air with a worked temperature')},
   {cap:"Air carries the heat out. A desktop pulls cool air in at the front and exhausts warm air at the rear and top, following convection; removing 845 W with a 10 °C rise needs about 149 CFM. A laptop breathes through its underside, so a bed or blanket blocks the intake within minutes.",
    svg:svg(560,220,
      `<rect x="60" y="34" width="300" height="168" rx="8" fill="none" stroke="currentColor" stroke-width="1.5"/>
       ${[74,118,162].map(y=>arrow(8,y,56,y,'',{stroke:CY,sw:1.8})).join('')}${text(32,206,'intake',{size:10,color:CY})}
       ${box(220,62,80,52,'CPU\ncooler',{size:11,stroke:AM})}${box(90,140,210,26,'GPU 575 W',{size:11,stroke:MG})}
       ${arrow(364,82,410,82,'',{stroke:MG,sw:1.8})}${text(414,82,'rear',{anchor:'start',size:10,color:MG})}
       ${[150,250].map(x=>arrow(x,32,x,8,'',{stroke:MG,sw:1.8})).join('')}${text(200,16,'top exhaust',{size:10,color:MG})}
       ${text(210,186,'CFM ≈ 1.76 × 845 W ÷ 10 °C ≈ 149',{size:10,color:AM})}
       <rect x="434" y="118" width="116" height="16" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/>${text(492,108,'laptop',{size:11,bold:true})}
       ${[462,492,522].map(x=>arrow(x,168,x,138,'',{stroke:CY,sw:1.6})).join('')}
       ${text(492,184,'intake from below:',{size:10,color:CY})}${text(492,200,'never on a bed',{size:10,bold:true,color:MG})}`,
      'Desktop front-to-back airflow and a laptop drawing air from underneath')}
  ];

  /* ---------- Module 9: troubleshooting (new) ---------- */
  I.p1m9=[
   {cap:"The CompTIA troubleshooting method: identify the problem, establish a theory, test it, plan and implement the fix, verify full functionality with preventive measures, and document. If a test rejects the theory, go back to step 2 or escalate.",
    svg:cycle([{t:'1 identify',stroke:CY},{t:'2 theory'},{t:'3 test',stroke:AM},{t:'4 plan + fix'},{t:'5 verify',stroke:LM},{t:'6 document'}],{label:'Six-step CompTIA troubleshooting method as a cycle'})},
   {cap:"A no-POST decision path. No fans or lights means power; fans but no picture means read the debug LED or beeps, and each stage points to its own first tests — including simply waiting out DDR5 memory training on a first boot.",
    svg:svg(560,250,
      `${box(200,8,160,32,'press the power button',{size:11,stroke:CY})}${arrow(280,40,280,62,'',{})}
       ${box(200,64,160,32,'fans or lights?',{size:11,bold:true})}${arrow(198,80,172,80,'no',{})}
       ${box(8,62,162,44,'outlet · PSU switch\n24-pin · PSU tester',{size:10,stroke:MG})}
       ${arrow(280,96,280,124,'yes',{})}${box(200,126,160,32,'debug LED / beeps?',{size:11,bold:true})}
       ${[[8,'CPU: EPS cable,\nBIOS supports CPU?',CY],[147,'DRAM: wait (training),\nreseat, one stick',AM],[286,'VGA: GPU power,\nreseat, use iGPU',MG],[425,'BOOT: boot order,\ndrive, ESP, UEFI',LM]].map(([x,t,c])=>line(280,158,x+63,186)+box(x,188,127,50,t,{size:10,stroke:c})).join('')}`,
      'Decision path for a PC that powers on but does not POST')},
   {cap:"Half-splitting is binary search for faults: each well-chosen test eliminates half the remaining suspects, so sixteen suspects need at most four tests. The minimal-configuration bench test is the classic first split.",
    svg:svg(560,190,(()=>{ const rows=[['16 suspects',16],['test 1 → 8',8],['test 2 → 4',4],['test 3 → 2',2],['test 4 → 1',1]]; let s='';
      rows.forEach((r,ri)=>{ const y=12+ri*35; s+=text(10,y+11,r[0],{anchor:'start',size:10,bold:ri===4,color:ri===4?MG:'currentColor'});
        for(let k=0;k<16;k++){ const alive=k<r[1]; const fault=(k===0); const x=100+k*28; s+=`<rect x="${x}" y="${y}" width="22" height="22" rx="4" fill="${alive&&ri===4?MG:'none'}" opacity="${alive?1:0.35}" stroke="${alive?(ri===4&&fault?MG:CY):DIM}" ${alive?'':'stroke-dasharray="3 3"'}/>`; } });
      return s; })(),'Sixteen suspects reduced to one in four half-splitting tests')}
  ];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
