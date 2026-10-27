/* Illustrations — Domain 38: Computer Architecture & Digital Design (RISC-V, pipelines, caches, FPGAs), built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  /* small helpers built on the kit: a routed wire with an arrowhead, a wire without one, and a row of bit cells */
  const wire=(d,o={})=>`<path d="${d}" fill="none" stroke="${o.stroke||'currentColor'}" stroke-width="${o.sw||1.3}" ${o.dash?'stroke-dasharray="5 4"':''} ${o.noHead?'':'marker-end="url(#ah)"'}/>`;
  const dot=(x,y,c)=>`<circle cx="${x}" cy="${y}" r="2.5" fill="${c||'currentColor'}"/>`;
  const bitRow=(x,y,str,o={})=>{ const cw=o.cw||28, h=o.h||26; return str.split('').map((b,i)=>box(x+i*cw,y,cw-3,h,'',{rx:4,stroke:b==='1'?(o.on||CY):DIM})+text(x+i*cw+(cw-3)/2,y+h/2,b,{mono:true,size:o.size||13,color:b==='1'?(o.on||CY):DIM})).join(''); };

  /* ================= DOMAIN 38 · MODULE 1: numbers, logic, the single-cycle datapath ================= */
  I.p38m1=[{cap:"Two's complement in 8 bits. The top bit carries weight −128, so negating a number is 'invert every bit, then add one': +5 = 0x05 becomes 0xFB = −5. Because of that weighting, one adder serves both signs: 7 + (−5) in 4 bits gives 1 0010, and dropping the carry out leaves 2.",
    svg:svg(560,215,`${text(178,14,'negate +5 in 8 bits',{bold:true,color:CY,size:11})}
      ${[-128,64,32,16,8,4,2,1].map((w,i)=>text(70+i*28+12.5,32,String(w).replace('-','−'),{size:9,color:i===0?MG:DIM})).join('')}
      ${[['+5','00000101','0x05'],['invert','11111010','0xFA'],['add 1','11111011','0xFB = −5']].map((r,k)=>text(62,44+k*36+13,r[0],{anchor:'end',size:11,color:DIM})+bitRow(70,44+k*36,r[1],{on:k===2?LM:CY})+text(300,44+k*36+13,r[2],{anchor:'start',mono:true,size:12,color:k===2?LM:AM})).join('')}
      ${text(180,166,'−128+64+32+16+8+2+1 = −5',{size:11,color:AM})}
      ${line(384,8,384,176,{dash:true,stroke:DIM})}
      ${text(468,14,'one adder, both signs',{bold:true,color:CY,size:11})}
      ${text(500,50,'0111',{anchor:'end',mono:true,size:15})}${text(512,50,'+7',{anchor:'start',size:10,color:DIM})}
      ${text(426,74,'+',{mono:true,size:15})}${text(500,74,'1011',{anchor:'end',mono:true,size:15})}${text(512,74,'−5',{anchor:'start',size:10,color:DIM})}
      ${line(414,89,506,89)}
      ${text(461,104,'1',{anchor:'end',mono:true,size:15,color:MG})}${text(500,104,'0010',{anchor:'end',mono:true,size:15,color:LM})}${text(512,104,'+2',{anchor:'start',size:10,color:LM})}
      ${text(452,128,'carry out\ndropped',{size:9,color:MG})}
      ${text(280,198,'overflow: 0x7FFFFFFF+1 = 0x80000000 = −2³¹',{size:10,color:MG})}`,'Two\'s complement negation of 5 and a 4-bit addition with the carry dropped')},
   {cap:"IEEE 754 single precision: 1 sign bit, 8 exponent bits stored with a bias of 127, and 23 fraction bits that follow an implicit leading 1. 6.5 is 1.101₂ × 2², so the exponent field is 129 and the word, read four bits at a time, is 0x40D00000. 0.1 has no finite binary form, which is why it is stored slightly wrong.",
    svg:svg(560,205,`${text(280,12,'6.5 as an IEEE 754 single (32 bits)',{bold:true,color:CY,size:11})}
      ${text(47.5,30,'sign',{size:10,color:MG})}${text(115,30,'exponent · 8 bits',{size:10,color:AM})}${text(347.5,30,'fraction · 23 bits',{size:10,color:CY})}
      ${[[31,0],[30,1],[23,8],[22,9],[0,31]].map(([b,i])=>text(40+i*15+7.5,45,String(b),{size:9,color:DIM})).join('')}
      ${'01000000110100000000000000000000'.split('').map((b,i)=>{ const col=i===0?MG:(i<9?AM:CY); return box(40+i*15+0.5,52,14,26,'',{rx:2,stroke:col})+text(40+i*15+7.5,65,b,{mono:true,size:11,color:b==='1'?col:DIM}); }).join('')}
      ${Array.from({length:9},(_,k)=>line(40+k*60,80,40+k*60,86,{stroke:DIM})).join('')}
      ${'40D00000'.split('').map((h,k)=>text(70+k*60,96,h,{bold:true,size:13,color:AM})).join('')}
      ${[['value','6.5 = 110.1₂ = 1.101₂ × 2²','currentColor'],['exponent','2 + 127 = 129 = 10000001₂',AM],['fraction','101 then 20 zeros → 0x40D00000',LM]].map(([k,v,c],i)=>text(104,122+i*20,k,{anchor:'end',size:11,color:DIM})+text(116,122+i*20,v,{anchor:'start',size:11,color:c})).join('')}
      ${text(40,190,'not exact: 0.1 → 0x3DCCCCCD ≈ 0.100000001',{anchor:'start',size:10,color:MG})}`,'IEEE 754 single-precision bit layout of 6.5')},
   {cap:"The single-cycle datapath. The PC addresses instruction memory; fixed bit fields select two registers to read and one to write; the ALU's second input is a register or a sign-extended immediate (ALUSrc); data memory serves loads and stores; a write-back mux picks the ALU result or the loaded word. The control unit is a truth table on the opcode.",
    svg:svg(560,252,`${box(40,10,160,34,'control unit\ndecodes opcode [6:0]',{size:10,stroke:MG})}${arrow(104,94,104,46,'',{dash:true,stroke:MG})}
      ${text(212,20,'sets RegWrite, ALUSrc,',{anchor:'start',size:9,color:MG})}${text(212,33,'MemRead/Write, WBsel, Branch',{anchor:'start',size:9,color:MG})}
      ${box(14,110,34,50,'PC',{stroke:AM,bold:true,size:12})}${arrow(48,135,62,135)}
      ${box(64,96,80,78,'instruction\nmemory\n200 ps',{size:10})}
      ${box(174,88,96,100,'')}${text(178,112,'rs1 [19:15]',{anchor:'start',size:9,color:CY})}${text(178,132,'rs2 [24:20]',{anchor:'start',size:9,color:CY})}${text(178,152,'rd [11:7]',{anchor:'start',size:9,color:LM})}${text(222,176,'registers 100 ps',{size:9,bold:true})}
      ${text(264,112,'A',{anchor:'end',size:10})}${text(264,150,'B',{anchor:'end',size:10})}
      ${arrow(144,112,172,112)}${arrow(144,132,172,132)}${arrow(144,152,172,152)}
      ${box(174,200,96,30,'imm gen\nsign-extend',{size:9})}${wire('M144 166 L158 166 L158 215 L172 215')}
      ${box(292,128,14,48,'',{rx:7})}${arrow(270,150,290,150)}${wire('M270 215 L299 215 L299 179')}${text(312,192,'ALUSrc',{anchor:'start',size:9,color:MG})}${arrow(306,152,318,152)}
      ${arrow(270,112,318,112)}
      ${box(320,96,60,80,'ALU\n200 ps',{stroke:CY,size:11})}
      ${arrow(380,136,394,136)}${dot(387,136)}${wire('M387 136 L387 194 L498 194 L498 165')}${text(442,206,'ALU result (R-type)',{size:9,color:DIM})}
      ${box(396,96,78,78,'data\nmemory\n200 ps',{size:10})}${arrow(474,124,488,124)}
      ${box(490,112,16,50,'',{rx:8})}${text(498,103,'WBsel',{size:9,color:MG})}
      ${wire('M506 137 L528 137 L528 66 L246 66 L246 86',{stroke:LM})}${text(388,55,'write-back · 100 ps',{size:10,color:LM})}
      ${box(10,200,140,30,'next PC = PC + 4\nor PC + imm if taken',{size:9})}${arrow(31,198,31,162)}
      ${text(280,244,'clock period = slowest path (the load)',{size:10,color:AM})}`,'Single-cycle RISC-V datapath')},
   {cap:"Why the slowest instruction sets the clock. With the textbook delays, a load needs instruction memory, register read, ALU, data memory and register write: 800 ps. A store needs 700, an add 600, a branch 500, but in a single-cycle design every instruction gets the full 800 ps period (1.25 GHz), so the shorter ones idle.",
    svg:svg(560,212,`${text(280,14,'single-cycle: every instruction gets 800 ps',{bold:true,color:CY,size:11})}
      ${[['lw (load)',['IF','REG','ALU','MEM','WB']],['sw (store)',['IF','REG','ALU','MEM']],['add (R-type)',['IF','REG','ALU','WB']],['beq (branch)',['IF','REG','ALU']]].map(([nm,st],r)=>{ const y=30+r*34; let x=120, s=text(112,y+13,nm,{anchor:'end',size:10}); const D={IF:200,REG:100,ALU:200,MEM:200,WB:100}, C={IF:CY,REG:'currentColor',ALU:AM,MEM:MG,WB:LM};
        st.forEach(k=>{ const w=D[k]*0.48; s+=box(x,y,w-2,26,k+' '+D[k],{size:10,rx:3,stroke:C[k]}); x+=w; });
        const idle=504-x; if(idle>1) s+=box(x,y,idle-2,26,idle>60?'idle '+Math.round(idle/0.48)+' ps':'idle',{size:9,rx:3,stroke:DIM,dash:true,color:DIM}); return s; }).join('')}
      ${line(504,24,504,166,{dash:true,stroke:MG})}${text(400,180,'period 800 ps → 1.25 GHz',{size:10,color:MG})}
      ${text(280,200,'Module 3: five 200 ps stages instead',{size:10,color:DIM})}`,'Instruction latencies against the single-cycle clock period')}];

  /* ================= MODULE 2: the RISC-V ISA and its encodings ================= */
  /* x position of bit b on a 32-bit ruler that starts at x=70 with 15 px per bit */
  const bx=b=>70+(31-b)*15;
  const field=(y,hi,lo,t,c,o={})=>box(bx(hi)+1,y,(hi-lo+1)*15-2,o.h||24,t,{size:o.size||11,rx:3,stroke:c,color:c===DIM?'currentColor':c,mono:o.mono});
  I.p38m2=[{cap:"The six RV32I encoding formats as 32-bit fields. Opcode (bits 6:0), rd (11:7), funct3 (14:12), rs1 (19:15) and rs2 (24:20) sit in the same place in every format that has them, so the decoder can read registers before it knows the instruction; only the immediate bits (amber) move, and the immediate's sign bit is always bit 31.",
    svg:svg(560,258,`${[[31,0],[25,6],[24,7],[20,11],[19,12],[15,16],[14,17],[12,19],[11,20],[7,24],[6,25],[0,31]].map(([b])=>text(bx(b)+7.5,28,String(b),{size:9,color:DIM})).join('')}
      ${[['R','add',[[31,25,'funct7',DIM],[24,20,'rs2',CY],[19,15,'rs1',CY],[14,12,'funct3',DIM],[11,7,'rd',LM],[6,0,'opcode',MG]]],
         ['I','addi',[[31,20,'imm[11:0]',AM],[19,15,'rs1',CY],[14,12,'funct3',DIM],[11,7,'rd',LM],[6,0,'opcode',MG]]],
         ['S','sw',[[31,25,'imm[11:5]',AM],[24,20,'rs2',CY],[19,15,'rs1',CY],[14,12,'funct3',DIM],[11,7,'imm[4:0]',AM],[6,0,'opcode',MG]]],
         ['B','beq',[[31,25,'imm[12|10:5]',AM],[24,20,'rs2',CY],[19,15,'rs1',CY],[14,12,'funct3',DIM],[11,7,'imm[4:1|11]',AM],[6,0,'opcode',MG]]],
         ['U','lui',[[31,12,'imm[31:12]',AM],[11,7,'rd',LM],[6,0,'opcode',MG]]],
         ['J','jal',[[31,12,'imm[20|10:1|11|19:12]',AM],[11,7,'rd',LM],[6,0,'opcode',MG]]]].map(([f,ex,fs],k)=>{ const y=38+k*30; return text(22,y+12,f,{bold:true,size:13,color:CY})+text(48,y+12,ex,{size:9,color:DIM})+fs.map(([hi,lo,t,c])=>field(y,hi,lo,t,c)).join(''); }).join('')}
      ${text(280,230,'register fields never move → cheap decoder',{size:10,color:LM})}
      ${text(280,247,'every immediate\'s sign bit is bit 31',{size:10,color:AM})}`,'The R, I, S, B, U and J instruction formats as bit fields')},
   {cap:"Hand-encoding addi x5, x0, 10. Write each I-type field in binary (imm = 10, rs1 = x0, funct3 = 000, rd = x5, opcode = 0010011), concatenate the 32 bits, regroup them by four and read off the hex: 0x00A00293. The nibble boundaries ignore the field boundaries, which is why hex dumps look scrambled until you split the fields again.",
    svg:svg(560,214,`${text(310,12,'addi x5, x0, 10 (I-type)',{mono:true,bold:true,size:12,color:CY})}
      ${[['fields',38],['binary',70],['by 4',127],['hex',160]].map(([t,y])=>text(62,y,t,{anchor:'end',size:10,color:DIM})).join('')}
      ${[[31,20,'imm[11:0] = 10','000000001010',AM],[19,15,'rs1 = x0','00000',CY],[14,12,'funct3','000',DIM],[11,7,'rd = x5','00101',LM],[6,0,'OP-IMM','0010011',MG]].map(([hi,lo,t,b,c])=>field(26,hi,lo,t,c)+field(58,hi,lo,b,c,{mono:true,size:12})).join('')}
      ${text(310,100,'concatenate 32 bits, regroup by 4',{size:9,color:DIM})}
      ${['0000','0000','1010','0000','0000','0010','1001','0011'].map((n,k)=>box(71+k*60,114,58,26,n,{mono:true,size:12,rx:3,stroke:DIM,color:'currentColor'})+text(100+k*60,160,'00A00293'[k],{bold:true,size:15,color:AM})).join('')}
      ${text(310,192,'= 0x00A00293',{mono:true,bold:true,size:15,color:LM})}`,'Worked encoding of addi x5, x0, 10 into 0x00A00293')},
   {cap:"Why the S format splits its immediate. A store has no rd, so to keep rs1 and rs2 in their fixed places the 12-bit offset is cut in two: bits 11:5 go where funct7 would be and bits 4:0 go where rd would be. sw x5, 8(x2) therefore encodes as 0x00512423.",
    svg:svg(560,220,`${text(280,12,'sw x5, 8(x2): offset 8 is split',{bold:true,size:11,color:CY})}
      ${text(152,47,'imm = 8',{anchor:'end',size:11})}
      ${'000000001000'.split('').map((b,i)=>{ const c=i<7?AM:LM; return box(160+i*20,34,18,26,'',{rx:3,stroke:c})+text(169+i*20,47,b,{mono:true,size:12,color:b==='1'?c:DIM}); }).join('')}
      ${[[0,'11'],[6,'5'],[7,'4'],[11,'0']].map(([i,t])=>text(169+i*20,26,t,{size:9,color:DIM})).join('')}
      ${arrow(229,62,124,110,'',{stroke:AM})}${arrow(349,62,406,110,'',{stroke:LM})}
      ${[[31,25,'imm[11:5]\n0000000',AM],[24,20,'rs2 = x5\n00101',CY],[19,15,'rs1 = x2\n00010',CY],[14,12,'f3\n010',DIM],[11,7,'imm[4:0]\n01000',LM],[6,0,'STORE\n0100011',MG]].map(([hi,lo,t,c])=>field(112,hi,lo,t,c,{h:38,size:11})).join('')}
      ${text(310,174,'0000000 00101 00010 010 01000 0100011',{mono:true,size:11})}
      ${text(310,200,'= 0x00512423',{mono:true,bold:true,size:15,color:LM})}`,'The S-type immediate split for sw x5, 8(x2)')},
   {cap:"The 32 integer registers by ABI role. Caller-saved registers (amber) may be destroyed by any call, so you save them yourself if you still need them; callee-saved registers (green) must come back unchanged, so a function that uses them saves and restores them. x0 always reads zero.",
    svg:svg(560,262,`${text(280,14,'RV32I registers by ABI role',{bold:true,size:11,color:CY})}
      ${['zero','ra','sp','gp','tp','t0','t1','t2','s0/fp','s1','a0','a1','a2','a3','a4','a5','a6','a7','s2','s3','s4','s5','s6','s7','s8','s9','s10','s11','t3','t4','t5','t6'].map((n,i)=>{ const c=/^(zero|gp|tp)$/.test(n)?DIM:(/^(sp|s)/.test(n)?LM:AM); return box(10+(i%8)*68,28+Math.floor(i/8)*44,64,40,'x'+i+'\n'+n,{size:11,stroke:c,color:c===DIM?'currentColor':c}); }).join('')}
      ${box(24,212,14,14,'',{rx:2,stroke:AM})}${text(44,219,'caller-saved: ra, t0–t6, a0–a7',{anchor:'start',size:10,color:AM})}
      ${box(250,212,14,14,'',{rx:2,stroke:LM})}${text(270,219,'callee-saved: sp, s0–s11',{anchor:'start',size:10,color:LM})}
      ${box(420,212,14,14,'',{rx:2,stroke:DIM})}${text(440,219,'fixed: zero, gp, tp',{anchor:'start',size:10,color:DIM})}
      ${text(280,246,'a0–a7 carry arguments; a0/a1 return',{size:10})}`,'RISC-V integer registers colored by caller-saved and callee-saved role')}];

  /* ================= MODULE 3: pipelining, hazards, prediction, speculation ================= */
  I.p38m3=[{cap:"The five-stage pipeline. Pipeline registers (IF/ID, ID/EX, EX/MEM, MEM/WB) carry each instruction's data and control forward one stage per clock. Forwarding wires a result from EX/MEM or MEM/WB straight back into the ALU inputs, chosen by a forwarding unit that compares the earlier instruction's rd with the current rs1 and rs2, so a dependent instruction need not wait for write-back.",
    svg:svg(560,246,`${text(280,14,'add x5, x1, x2 → sub x6, x5, x3',{mono:true,size:11,color:CY})}${text(280,32,'sub gets x5 forwarded, no stall',{size:10,color:DIM})}
      ${[['IF/ID',109],['ID/EX',219],['EX/MEM',329],['MEM/WB',439]].map(([t,x])=>text(x+6,52,t,{size:9,color:DIM})+box(x,60,12,110,'',{rx:2,stroke:DIM})).join('')}
      ${[['IF\nI-cache',25,'currentColor'],['ID\nregisters',135,'currentColor'],['EX\nALU',245,CY],['MEM\nD-cache',355,'currentColor'],['WB\nwrite rd',465,LM]].map(([t,x,c])=>box(x,80,70,70,t,{size:11,stroke:c})).join('')}
      ${[95,205,315,425].map(x=>arrow(x,115,x+12,115)+arrow(x+26,115,x+38,115)).join('')}
      ${wire('M335 170 L335 190 L290 190 L290 153',{stroke:MG})}${text(342,190,'EX/MEM → ALU',{anchor:'start',size:9,color:MG})}
      ${wire('M445 170 L445 206 L262 206 L262 153',{stroke:AM})}${text(452,190,'MEM/WB → ALU',{anchor:'start',size:9,color:AM})}
      ${box(232,214,126,24,'forwarding unit',{size:10,stroke:MG,dash:true})}${arrow(250,213,250,153,'',{dash:true,stroke:MG})}
      ${text(366,226,'compares rd with rs1, rs2',{anchor:'start',size:9,color:DIM})}`,'Five-stage pipeline with pipeline registers and forwarding paths')},
   {cap:"The worked example cycle by cycle. The add needs x5 from the load, which only exists after the load's MEM stage, so one bubble (stall) is unavoidable even with forwarding; the sub behind it is held in IF for that cycle. The add→sub and sub→beq dependences are covered by EX/MEM forwarding with no stall. Total: 9 cycles; without forwarding, 14.",
    svg:svg(560,246,`${Array.from({length:9},(_,c)=>text(170+c*44,22,'c'+(c+1),{size:10,color:DIM})).join('')}
      ${[['lw x5, 0(x10)',[[1,'IF'],[2,'ID'],[3,'EX'],[4,'MEM'],[5,'WB']]],
         ['add x6, x5, x7',[[2,'IF'],[3,'ID'],[4,'stall'],[5,'EX'],[6,'MEM'],[7,'WB']]],
         ['sub x8, x6, x9',[[3,'IF'],[4,'held'],[5,'ID'],[6,'EX'],[7,'MEM'],[8,'WB']]],
         ['beq x8, x0, L',[[5,'IF'],[6,'ID'],[7,'EX'],[8,'MEM'],[9,'WB']]]].map(([ins,cells],r)=>{ const y=34+r*38; return text(10,y+13,ins,{anchor:'start',mono:true,size:10})+cells.map(([c,s])=>{ const st={IF:CY,ID:'currentColor',EX:AM,MEM:'currentColor',WB:LM,stall:MG,held:DIM}[s]; const soft=(s==='stall'||s==='held'); return box(150+(c-1)*44,y,40,26,s,{size:10,rx:3,stroke:st,dash:soft,color:soft?st:'currentColor'}); }).join(''); }).join('')}
      ${arrow(304,61,342,71,'',{stroke:AM,sw:1.8})}${arrow(348,99,386,109,'',{stroke:MG,sw:1.8})}${arrow(392,137,430,147,'',{stroke:MG,sw:1.8})}
      ${text(280,196,'9 cycles = 4 + 5 − 1 + 1 bubble',{size:11,color:AM})}${text(280,214,'without forwarding: 14 cycles',{size:10,color:MG})}
      ${line(118,234,138,234,{stroke:AM,sw:1.8})}${text(144,234,'MEM/WB forward',{anchor:'start',size:9,color:AM})}${line(300,234,320,234,{stroke:MG,sw:1.8})}${text(326,234,'EX/MEM forward',{anchor:'start',size:9,color:MG})}`,'Pipeline timing table with a load-use stall and forwarding')},
   {cap:"A two-bit saturating counter, one per branch in the predictor table. Taken (T) moves it right, not taken (N) moves it left, and the top bit is the prediction. A loop branch that is taken a hundred times and falls through once only drops from 'strong taken' to 'weak taken', so the next loop is still predicted correctly.",
    svg:svg(560,200,`${text(140,24,'predict NOT TAKEN',{bold:true,size:10,color:MG})}${line(20,36,260,36,{stroke:MG})}
      ${text(420,24,'predict TAKEN',{bold:true,size:10,color:LM})}${line(300,36,540,36,{stroke:LM})}
      ${[['00','strong not-taken',MG],['01','weak not-taken',MG],['10','weak taken',LM],['11','strong taken',LM]].map(([b,t,c],k)=>box(20+k*140,64,100,46,b+'\n'+t,{size:10,stroke:c})).join('')}
      ${[0,1,2].map(k=>arrow(120+k*140,76,158+k*140,76,'T',{stroke:LM,color:LM})+arrow(160+k*140,98,122+k*140,98,'N',{stroke:MG,color:MG,dy:-12})).join('')}
      ${wire('M50 110 C50 140 90 140 90 112',{stroke:MG})}${text(70,150,'N',{size:11,color:MG})}
      ${wire('M470 110 C470 140 510 140 510 112',{stroke:LM})}${text(490,150,'T',{size:11,color:LM})}
      ${text(280,172,'strong states survive a single surprise',{size:10,color:AM})}${text(280,190,'T = taken · N = not taken',{size:9,color:DIM})}`,'Two-bit saturating counter branch predictor state machine')},
   {cap:"Why Spectre-class attacks work. After a mispredicted branch (in Meltdown, a load that is about to fault) the core runs ahead speculatively; when it squashes that work, architectural state (registers, memory) is restored perfectly, but a cache line loaded at a secret-dependent address stays cached, and timing later accesses reveals which line it was. Study it on hardware you own or in sanctioned labs only.",
    svg:svg(560,218,`${text(225,14,'mispredicted branch: speculative window',{size:10,color:MG})}${text(444,14,'after the squash',{size:10,color:LM})}
      ${box(120,24,212,138,'',{dash:true,stroke:MG})}
      ${text(62,54,'architectural',{size:10,bold:true})}${text(62,68,'registers, memory',{size:9,color:DIM})}
      ${text(62,112,'micro-\narchitectural',{size:10,bold:true,lh:12})}${text(62,140,'cache lines',{size:9,color:DIM})}
      ${box(130,44,192,34,'secret read into a register',{size:10,stroke:DIM,dash:true})}${arrow(322,61,346,61)}${box(348,44,192,34,'rolled back: no trace',{size:10,stroke:LM,color:LM})}
      ${box(130,108,192,34,'secret-indexed line loaded',{size:10,stroke:MG})}${arrow(322,125,346,125)}${box(348,108,192,34,'line stays cached',{size:10,stroke:MG,color:MG})}
      ${text(444,156,'timing a probe reveals it',{size:10,color:AM})}
      ${arrow(120,178,540,178)}${text(530,190,'time',{anchor:'end',size:9,color:DIM})}
      ${text(280,206,'fixes: KPTI · retpolines/IBRS · fences · coarse timers',{size:10,color:LM})}`,'Speculative execution leaves cache state behind after rollback')}];

  /* ================= MODULE 4: the memory hierarchy ================= */
  I.p38m4=[{cap:"One address through a 32 KB, 8-way set-associative L1 with 64-byte lines (64 sets). The low 6 bits pick the byte in the line, the next 6 pick the set, and the remaining 20 bits are the tag. All eight tags in set 40 are compared at once; way 3 matches, so it is a hit and bytes 60–63 come back.",
    svg:svg(560,266,`${text(280,12,'address 0x00401A3C',{mono:true,bold:true,size:12,color:CY})}
      ${box(40,24,300,24,'tag 0x00401',{stroke:LM,color:LM,size:11})}${box(340,24,90,24,'index 40',{stroke:AM,color:AM,size:11})}${box(430,24,90,24,'offset 60',{stroke:CY,color:CY,size:11})}
      ${text(190,60,'bits 31–12 · 20 bits',{size:9,color:DIM})}${text(385,60,'bits 11–6',{size:9,color:DIM})}${text(475,60,'bits 5–0',{size:9,color:DIM})}
      ${arrow(385,68,385,93,'',{stroke:AM})}${text(394,80,'selects set 40',{anchor:'start',size:9,color:AM})}
      ${text(70,86,'set 40 of 64 · 8 ways',{anchor:'start',size:10,color:AM})}${box(66,96,482,46,'',{stroke:AM,rx:6})}
      ${['0x3A0F1','0x00400','0x7FFE2','0x00401','0x12345','0x0BEEF','0x00402','0x5C0DE'].map((t,k)=>box(70+k*60,100,54,38,'way '+k+'\n'+t,{mono:true,size:10,stroke:k===3?LM:DIM,color:k===3?LM:'currentColor'})+line(97+k*60,138,97+k*60,150,{stroke:DIM})+box(85+k*60,150,24,18,'=',{size:11,rx:9,stroke:k===3?LM:DIM,color:k===3?LM:DIM})+line(97+k*60,168,97+k*60,184,{stroke:LM})).join('')}
      ${wire('M40 36 L20 36 L20 184 L538 184',{stroke:LM,noHead:true})}
      ${text(280,202,'way 3 tag matches → hit',{size:10,color:LM})}${text(280,218,'offset 60 → return bytes 60–63',{size:10,color:CY})}
      ${text(280,240,'32 KB = 64 sets × 8 ways × 64 B',{size:10,color:AM})}${text(280,256,'all 8 tags compared in parallel',{size:9,color:DIM})}`,'Address split into tag, index and offset for an 8-way set-associative cache')},
   {cap:"AMAT is computed from the bottom up. What an L1 miss costs is itself an average: L2's 12-cycle hit plus 20% of 200 cycles for DRAM, 52 cycles. That becomes L1's miss penalty: 4 + 0.05 × 52 = 6.6 cycles. Let the L1 miss rate double to 10% and AMAT jumps to 9.2 cycles, 39% worse.",
    svg:svg(560,212,`${text(280,12,'AMAT = hit time + miss rate × penalty',{bold:true,size:11,color:CY})}
      ${box(20,28,120,48,'L1\nhit 4 cycles',{stroke:CY})}${arrow(140,52,218,52,'5% miss')}
      ${box(220,28,120,48,'L2\nhit 12 cycles',{stroke:AM})}${arrow(340,52,418,52,'20% miss')}
      ${box(420,28,120,48,'DRAM\n200 cycles',{stroke:MG})}
      ${box(20,96,520,28,'step 1 · an L1 miss costs 12 + 0.2 × 200 = 52 cycles',{stroke:AM,size:11})}
      ${box(20,134,520,28,'step 2 · AMAT = 4 + 0.05 × 52 = 6.6 cycles',{stroke:LM,color:LM,size:11,bold:true})}
      ${box(20,172,520,28,'what if L1 misses 10%? 4 + 0.10 × 52 = 9.2 (+39%)',{stroke:MG,color:MG,size:11,dash:true})}`,'AMAT calculation across L1, L2 and DRAM')},
   {cap:"MESI from one cache's point of view. Solid arrows are this core's own reads and writes; dashed arrows are what it snoops from other cores. Any write by another core invalidates our copy; a write by us from S or I first invalidates everyone else's; E becomes M silently. False sharing is two cores bouncing one line between M and I on every write.",
    svg:svg(560,292,`${text(20,14,'solid = this core · dashed = another core',{anchor:'start',size:10,color:DIM})}
      ${wire('M80 70 L80 44 L480 44 L480 68',{stroke:MG,dash:true})}${text(280,36,'other core reads',{size:10,color:MG})}
      ${box(20,70,120,44,'E · Exclusive\nalone, clean',{stroke:CY})}${box(220,70,120,44,'M · Modified\nalone, dirty',{stroke:MG})}${box(420,70,120,44,'S · Shared\nclean, maybe copies',{stroke:AM})}
      ${arrow(140,84,218,84,'my write',{stroke:CY,color:CY})}${arrow(420,84,342,84,'my write',{stroke:CY,color:CY})}
      ${arrow(340,102,418,102,'other reads',{stroke:MG,color:MG,dash:true,dy:-13})}
      ${[[80,'my read,\nno sharers'],[280,'my write'],[480,'my read,\nothers have it']].map(([c,t],k)=>{ const up=k===0?c+22:c-22, dn=k===0?c-22:c+22; return arrow(up,224,up,116,'',{stroke:CY})+arrow(dn,116,dn,224,'',{stroke:MG,dash:true})+text(k===0?up+6:up-6,164,t,{anchor:k===0?'start':'end',size:10,color:CY})+text(k===0?dn-6:dn+6,164,'other\nwrites',{anchor:k===0?'end':'start',size:10,color:MG}); }).join('')}
      ${box(20,226,520,36,'I · Invalid: line not present here',{stroke:DIM})}
      ${text(280,280,'false sharing = ping-pong between two writers',{size:10,color:AM})}`,'MESI cache coherence state diagram')},
   {cap:"Virtual to physical on RV64 with Sv39. The 39-bit virtual address carries three 9-bit indexes and a 12-bit offset; satp points at the root table, and each level's 4 KiB table of 512 entries leads to the next. A TLB hit skips all three memory reads; a miss pays them before the data access, which is why huge pages and big second-level TLBs exist.",
    svg:svg(560,250,`${text(280,12,'Sv39: 39-bit virtual address, 3 levels',{bold:true,size:11,color:CY})}
      ${[['VPN[2] · 9 bits',60],['VPN[1] · 9 bits',165],['VPN[0] · 9 bits',270]].map(([t,x])=>box(x,24,105,24,t,{stroke:AM,color:AM,size:10})).join('')}${box(375,24,165,24,'page offset · 12 bits',{stroke:CY,color:CY,size:10})}
      ${arrow(112,48,112,94,'',{stroke:AM})}${arrow(218,48,218,94,'',{stroke:AM})}${arrow(323,48,323,94,'',{stroke:AM})}${arrow(470,48,470,94,'',{stroke:CY})}
      ${box(4,104,52,28,'satp',{stroke:MG,color:MG,size:10})}${arrow(56,118,70,118)}
      ${box(72,96,80,44,'L2 table\n512 PTEs',{size:10})}${arrow(152,118,176,118)}
      ${box(178,96,80,44,'L1 table\n512 PTEs',{size:10})}${arrow(258,118,281,118)}
      ${box(283,96,80,44,'L0 table\nPTE → PPN',{size:10})}${arrow(363,118,398,118)}
      ${box(400,96,140,44,'physical address\nPPN + offset',{stroke:LM,color:LM,size:10})}
      ${box(60,166,480,30,'TLB hit: VPN → PPN directly, no walk',{stroke:LM,dash:true,size:10})}${arrow(470,164,470,142,'',{stroke:LM,dash:true})}
      ${text(280,214,'TLB miss: 3 table reads, then data',{size:10,color:MG})}${text(280,232,'2 MiB pages skip a level',{size:10,color:DIM})}`,'Sv39 three-level page walk and the TLB shortcut')},
   {cap:"Same arithmetic, different memory walk. Matrices are stored row by row, so a 1024-wide row of doubles is 8 KB. In i-j-k order the inner loop walks B down a column, touching a new 64-byte line on every step; in i-k-j order it walks B along a row, so one line delivers eight useful doubles. That alone is typically a 5–10× speedup.",
    svg:compare({t:'i-j-k: B down a column',draw:x=>{ let s=''; for(let r=0;r<8;r++) for(let c=0;c<8;c++) s+=box(x+30+c*20,48+r*14,18,12,'',{rx:2,stroke:c===0?MG:DIM}); return s+arrow(x+20,48,x+20,158,'',{stroke:MG})+text(x+198,82,'stride\n8 KB',{anchor:'start',size:10,color:MG})+text(x+198,126,'1 miss\nper use',{anchor:'start',size:10,color:MG})+text(x+130,176,'1 useful double per line',{size:10,color:DIM}); }},
      {t:'i-k-j: B along a row',draw:x=>{ let s=''; for(let r=0;r<8;r++) for(let c=0;c<8;c++) s+=box(x+30+c*20,48+r*14,18,12,'',{rx:2,stroke:r===0?LM:DIM}); return s+arrow(x+30,40,x+188,40,'',{stroke:LM})+text(x+198,82,'stride\n8 B',{anchor:'start',size:10,color:LM})+text(x+198,126,'1 miss\nper 8 uses',{anchor:'start',size:10,color:LM})+text(x+130,176,'8 useful doubles per line',{size:10,color:DIM}); }},{h:200,label:'Column walk versus row walk of matrix B'})}];

  /* ================= MODULE 5: parallelism, GPUs and the roofline ================= */
  const cell=(x,y,w,h,c,o={})=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx==null?2:o.rx}" fill="none" stroke="${c}" stroke-width="${o.sw||1.2}" ${o.dash?'stroke-dasharray="4 3"':''}/>`;
  const RX=ai=>70+115*(Math.log10(ai)+1), RY=g=>230-50*(Math.log10(g)-1);   /* roofline axes: AI 0.1–1000, 10–100,000 GFLOP/s */
  const pt=(ai,g,c)=>`<circle cx="${RX(ai).toFixed(1)}" cy="${RY(g).toFixed(1)}" r="4.5" fill="${c}"/>`;
  I.p38m5=[{cap:"The roofline for an RTX 4070 (29.15 TFLOPS FP32, 504 GB/s). Attainable performance is the lower of the sloped bandwidth line and the flat compute roof; they meet at the ridge, about 58 FLOP per byte. SAXPY, a stencil and LLM token generation all sit left of the ridge, so only moving fewer bytes speeds them up; a tiled matrix multiply reaches the roof.",
    svg:svg(560,272,`${text(76,16,'attainable GFLOP/s (log) · RTX 4070',{anchor:'start',size:10,color:DIM})}
      ${line(70,230,530,230)}${line(70,30,70,230)}
      ${[0.1,1,10,100,1000].map(v=>line(RX(v),230,RX(v),234)+text(RX(v),246,String(v),{size:9,color:DIM})).join('')}
      ${[[10,'10'],[100,'100'],[1000,'1K'],[10000,'10K'],[100000,'100K']].map(([v,t])=>line(66,RY(v),70,RY(v))+text(62,RY(v),t,{anchor:'end',size:9,color:DIM})).join('')}
      ${line(RX(0.1),RY(50.4),RX(57.84),RY(29150),{stroke:CY,sw:2.2})}${line(RX(57.84),RY(29150),530,RY(29150),{stroke:CY,sw:2.2})}
      ${line(RX(57.84),RY(29150)+4,RX(57.84),230,{stroke:AM,dash:true})}
      ${text(380,44,'ridge 58 FLOP/B',{anchor:'end',size:10,color:AM})}${text(530,44,'peak 29.15 TFLOP/s',{anchor:'end',size:10,color:CY})}
      ${text(80,130,'504 GB/s × AI',{anchor:'start',size:10,color:CY})}
      ${pt(2/12,84,MG)}${text(104,198,'SAXPY · AI 0.17 → 84 GFLOP/s',{anchor:'start',size:10,color:MG})}
      ${pt(1.6,806.4,AM)}${text(218,150,'stencil · AI 1.6 → 0.8 TFLOP/s',{anchor:'start',size:10,color:AM})}
      ${pt(4,2016,LM)}${text(264,130,'LLM decode · AI ≈ 4',{anchor:'start',size:10,color:LM})}
      ${pt(680,29150,CY)}${text(395,76,'tiled matmul\nAI ≈ 680 · at peak',{anchor:'start',size:10,color:CY})}
      ${text(380,218,'← memory-bound',{anchor:'end',size:9,color:DIM})}${text(395,218,'compute-bound →',{anchor:'start',size:9,color:DIM})}
      ${text(300,264,'arithmetic intensity, FLOP per byte (log)',{size:10,color:DIM})}`,'Roofline model for an RTX 4070 with four kernels placed on it')},
   {cap:"A GPU is many identical streaming multiprocessors sharing one memory system. The RTX 4070 has 46 SMs; each SM has four partitions, each with its own warp scheduler and 32 FP32 lanes (128 per SM, 5,888 in total), a slice of the register file, and an L1 that doubles as programmer-managed shared memory. Threads are issued in warps of 32 that execute one instruction in lockstep.",
    svg:svg(560,266,`${text(105,16,'RTX 4070 · 46 SMs',{bold:true,size:11,color:CY})}
      ${Array.from({length:46},(_,i)=>cell(18+(i%8)*22,30+Math.floor(i/8)*20,18,16,i===7?CY:DIM,{sw:i===7?2.2:1.2})).join('')}
      <line x1="105" y1="152" x2="105" y2="176" stroke="currentColor" stroke-width="1.3" marker-start="url(#ah)" marker-end="url(#ah)"/>
      ${box(14,178,182,28,'12 GB GDDR6X · 504 GB/s',{stroke:MG,size:10})}
      ${text(105,222,'5,888 lanes · 29 TFLOPS FP32',{size:10,color:AM})}
      ${text(105,238,'warp = 32 threads, one instruction',{size:9,color:DIM})}
      ${Array.from({length:32},(_,i)=>cell(17+i*5.5,248,4.5,10,LM,{rx:1,sw:1})).join('')}
      ${arrow(193,38,228,52,'',{stroke:CY,dash:true})}
      ${box(230,22,320,222,'',{stroke:CY})}${text(390,38,'one SM: 4 partitions',{bold:true,size:11,color:CY})}
      ${[[240,50],[394,50],[240,118],[394,118]].map(([x,y])=>box(x,y,146,60,'warp scheduler\n32 FP32 lanes\n16K registers',{size:10,stroke:'currentColor'})).join('')}
      ${box(240,188,300,24,'L1 / shared memory (per SM)',{size:10,stroke:AM,color:AM})}
      ${text(390,228,'dozens of warps resident per SM',{size:10,color:LM})}`,'GPU made of streaming multiprocessors, one SM enlarged')},
   {cap:"How a GPU hides memory latency. Each warp computes briefly, then waits hundreds of cycles for a load. Because the SM keeps many warps resident, its scheduler simply issues from whichever warp is ready; with five warps here the issue slot is busy every cycle even though each warp spends most of its time waiting. A CPU spends its transistors on caches and prediction instead.",
    svg:svg(560,200,`${text(300,14,'one SM, five warps, ~500-cycle loads',{bold:true,size:11,color:CY})}
      ${Array.from({length:5},(_,k)=>{ const y=28+k*24; let s=text(72,y+8,'warp '+k,{anchor:'end',size:10}); for(let t=80+k*24;t+22<=540;t+=120){ s+=cell(t,y,22,16,CY,{sw:1.6}); const w=Math.min(96,540-(t+24)); if(w>6) s+=(k===0&&t===80)?box(t+24,y,w-2,16,'memory wait',{size:9,rx:2,stroke:MG,dash:true,color:MG}):cell(t+24,y,w-2,16,MG,{dash:true}); } return s; }).join('')}
      ${text(72,165,'issue',{anchor:'end',size:10,color:LM})}${Array.from({length:19},(_,s)=>box(80+s*24,156,22,18,'w'+(s%5),{size:9,rx:3,stroke:LM})).join('')}
      ${text(300,190,'enough warps → issue slot never idles',{size:10,color:LM})}`,'Warp scheduling hides memory latency')},
   {cap:"Fixed-width SIMD versus RISC-V's vector extension. AVX2 and AVX-512 bake the register width into the instructions, so a wider unit needs new instructions and recompiled code. RVV is vector-length agnostic: vsetvli asks the hardware how many elements it will process this iteration (4 floats at VLEN 128, 32 at VLEN 1024), so one binary runs at full width on any core.",
    svg:compare({t:'fixed-width SIMD (x86)',draw:x=>text(x+130,50,'AVX2 · 256-bit · 8 floats',{size:10})+Array.from({length:8},(_,i)=>cell(x+66+i*16,60,14,16,CY)).join('')+text(x+130,98,'AVX-512 · 512-bit · 16 floats',{size:10})+Array.from({length:16},(_,i)=>cell(x+18+i*14,108,12,16,CY)).join('')+text(x+130,146,'new width = new instructions',{size:10,color:MG})+text(x+130,162,'old binaries never use it',{size:10,color:DIM})},
      {t:'RISC-V V: length-agnostic',draw:x=>text(x+130,50,'VLEN 128 → vl = 4 floats',{size:10})+Array.from({length:4},(_,i)=>cell(x+98+i*16,60,14,16,LM)).join('')+text(x+130,98,'VLEN 1024 → vl = 32 floats',{size:10})+Array.from({length:32},(_,i)=>cell(x+18+i*7,108,6,16,LM,{rx:1})).join('')+text(x+130,146,'vsetvli asks the hardware',{size:10,color:LM})+text(x+130,162,'same binary, any width',{size:10,color:DIM})},{h:180,label:'Fixed-width SIMD versus vector-length-agnostic RISC-V V'})}];

  /* ================= MODULE 6: HDLs, FPGAs, simulation and timing ================= */
  const code=(x0,y0,lines,lh)=>lines.map(([s,c],i)=>{ const n=s.length-s.trimStart().length; return text(x0+n*6,y0+i*lh,s.trim(),{anchor:'start',mono:true,size:9.5,color:c||'currentColor'}); }).join('');
  I.p38m6=[{cap:"What an FPGA is made of. The fabric is a grid of logic cells with columns of block RAM and DSP multipliers, joined by programmable routing and ringed by I/O. Each logic cell is a 4-input look-up table (16 SRAM bits holding any truth table; this one is a 4-input XOR), a flip-flop, and a configuration bit that picks the registered or the direct output. The bitstream sets every one of those bits.",
    svg:svg(560,248,`${text(120,12,'FPGA fabric (simplified)',{bold:true,size:11,color:CY})}${text(92,28,'BRAM',{size:9,color:AM})}${text(180,28,'DSP',{size:9,color:MG})}
      ${[24,52,112,140,200].map(x=>Array.from({length:6},(_,r)=>cell(x,36+r*26,20,18,(x===200&&r===2)?CY:DIM,{sw:(x===200&&r===2)?2.2:1.2})).join('')).join('')}
      ${[0,1,2].map(k=>cell(80,36+k*52,24,44,AM)+cell(168,36+k*52,24,44,MG)).join('')}
      ${text(120,204,'logic cells, BRAM, DSP slices',{size:9,color:DIM})}${text(120,219,'+ routing, I/O banks, PLLs',{size:9,color:DIM})}${text(120,238,'Tang Nano 20K: 20,736 LUT4s',{size:10,color:AM})}
      ${arrow(222,97,262,97,'',{stroke:CY,dash:true})}
      ${box(266,24,284,214,'',{stroke:CY})}${text(408,40,'one logic cell',{bold:true,size:11,color:CY})}
      ${['a','b','c','d'].map((n,i)=>text(278,80+i*18,n,{mono:true,size:10})+arrow(284,80+i*18,298,80+i*18)).join('')}
      ${box(300,56,100,104,'',{stroke:AM})}${text(350,68,'LUT4',{bold:true,size:11,color:AM})}
      ${Array.from({length:16},(_,i)=>{ const v=((i&1)^((i>>1)&1)^((i>>2)&1)^((i>>3)&1)); const x=322+(i%4)*14, y=78+Math.floor(i/4)*14; return cell(x,y,13,13,v?AM:DIM,{rx:1,sw:1})+text(x+6.5,y+6.5,String(v),{mono:true,size:9,color:v?AM:DIM}); }).join('')}
      ${text(350,150,'16-bit truth table',{size:9,color:DIM})}
      ${arrow(400,98,428,98)}${dot(412,98)}${wire('M412 98 L412 70 L507 70 L507 94')}
      ${box(430,84,56,48,'',{stroke:CY})}${text(442,98,'D',{size:10})}${text(474,98,'Q',{size:10})}${text(458,120,'FF',{bold:true,size:11,color:CY})}${wire('M434 132 L440 125 L446 132',{noHead:true})}
      ${arrow(440,170,440,134)}${text(440,180,'clk',{size:9,color:DIM})}
      ${box(500,96,14,60,'',{rx:7})}${arrow(486,108,498,108)}${arrow(514,126,540,126)}${text(527,140,'out',{size:9})}${text(507,170,'config\nbit',{size:9,color:MG})}
      ${box(300,172,100,24,'carry chain',{size:9,stroke:DIM})}
      ${text(408,224,'bitstream sets LUT bits + routing',{size:9,color:LM})}`,'FPGA fabric and the inside of one logic cell: LUT4, flip-flop and output mux')},
   {cap:"Verilog describes hardware, it does not run line by line. The blink module synthesizes into a 25-bit register with an adder feeding it, a comparator that detects 13,499,999, a mux that resets the count, and a one-bit led register that toggles through an inverter whenever the comparator fires. Colors link each line to the hardware it creates.",
    svg:svg(560,256,`${box(8,14,226,214,'',{stroke:DIM,dash:true})}
      ${code(18,30,[['module blink('],['  input clk,'],['  output reg led);',LM],['  reg [24:0] count;',CY],['  always @(posedge clk)'],['    if (count == 13_499_999) begin',AM],['      count <= 0;',CY],['      led <= ~led;',LM],['    end else'],['      count <= count + 1;',CY],['endmodule']],18)}
      ${text(121,242,'blink.v · describes hardware',{size:9,color:DIM})}
      ${box(262,64,16,56,'',{rx:8})}${text(252,108,'0',{anchor:'end',mono:true,size:10,color:CY})}${line(255,108,262,108)}
      ${arrow(278,92,296,92)}${box(298,70,70,44,'count\n25 FFs',{stroke:CY,size:10})}${wire('M327 114 L333 108 L339 114',{noHead:true})}
      ${line(368,92,384,92)}${dot(384,92)}${wire('M384 92 L384 38 L392 38')}${box(394,24,44,28,'+1',{size:12,stroke:CY,color:CY})}
      ${wire('M438 38 L452 38 L452 14 L240 14 L240 76 L260 76',{stroke:CY})}
      ${arrow(384,92,398,92)}${box(400,78,100,30,'== 13,499,999',{stroke:AM,color:AM,size:10})}
      ${wire('M500 93 L514 93 L514 140 L270 140 L270 122',{stroke:AM})}${text(520,116,'hit',{anchor:'start',size:9,color:AM})}
      ${dot(360,140,AM)}${arrow(360,140,360,166,'',{stroke:AM})}${text(366,154,'en',{anchor:'start',size:9,color:AM})}
      ${box(330,168,60,40,'led\nFF',{stroke:LM,size:10})}${wire('M354 208 L360 202 L366 208',{noHead:true})}
      ${line(390,188,404,188,{stroke:LM})}${dot(404,188,LM)}${arrow(404,188,470,188,'',{stroke:LM})}${text(476,188,'LED pin',{anchor:'start',size:10,color:LM})}
      ${wire('M404 188 L404 226 L382 226',{stroke:LM})}${box(342,216,40,20,'NOT',{size:9,stroke:LM})}${wire('M342 226 L316 226 L316 188 L328 188',{stroke:LM})}
      ${text(400,248,'all flops share clk (27 MHz)',{size:9,color:DIM})}`,'The blink Verilog module and the hardware it synthesizes to')},
   {cap:"Timing sets the clock. Data leaves the first flip-flop t_cq after a clock edge, crosses logic and routing, and must arrive a setup time before the next edge (and stay put for the hold time after it). 0.5 + 3.2 + 0.3 = 4.0 ns allows 250 MHz; a pipeline register that halves the logic brings the path to 2.4 ns, about 417 MHz.",
    svg:svg(560,236,`${text(280,14,'one register-to-register path',{bold:true,size:11,color:CY})}
      ${box(30,30,50,40,'FF',{bold:true,stroke:CY})}${arrow(80,50,108,50)}${box(110,30,330,40,'combinational logic + routing',{stroke:AM,color:AM})}${arrow(440,50,468,50)}${box(470,30,50,40,'FF',{bold:true,stroke:CY})}
      ${wire('M49 70 L55 64 L61 70',{noHead:true})}${wire('M489 70 L495 64 L501 70',{noHead:true})}
      ${box(60,96,55,26,'t_cq',{size:10,stroke:CY,rx:3})}${box(115,96,352,26,'logic + routing 3.2 ns',{size:10,stroke:AM,color:AM,rx:3})}${box(467,96,33,26,'',{stroke:MG,rx:3})}${cell(500,96,12,26,MG,{dash:true})}
      ${text(87,134,'0.5 ns',{size:9,color:DIM})}${text(464,134,'setup 0.3',{anchor:'end',size:9,color:MG})}${text(518,109,'hold',{anchor:'start',size:9,color:MG})}
      ${line(60,124,60,150,{dash:true,stroke:DIM})}${line(500,124,500,150,{dash:true,stroke:DIM})}
      ${wire('M30 172 L60 172 L60 152 L280 152 L280 172 L500 172 L500 152 L540 152',{noHead:true,stroke:LM})}${text(60,184,'edge',{size:9,color:LM})}${text(500,184,'next edge',{size:9,color:LM})}
      ${text(280,206,'T = 0.5 + 3.2 + 0.3 = 4.0 ns → 250 MHz',{size:11,color:LM})}
      ${text(280,226,'pipelined: 0.5 + 1.6 + 0.3 = 2.4 ns → 417 MHz',{size:10,color:CY})}`,'Setup, hold and the fmax calculation for one flip-flop-to-flip-flop path')},
   {cap:"A UART transmitter at 115,200 baud, 8N1, sending 'A' (0x41). The idle line is high; a low start bit, eight data bits least-significant first, and a high stop bit make one 10-bit frame of 86.8 µs. From a 27 MHz clock each bit lasts 234 cycles (0.16% error), and the receiver samples in the middle of each bit.",
    svg:svg(560,236,`${text(280,14,'\'A\' = 0x41 at 115,200 baud, 8N1',{bold:true,size:11,color:CY})}
      ${(()=>{ const v=[0,1,0,0,0,0,0,1,0,1]; let d='M20 50 L60 50', lv=50; v.forEach((b,s)=>{ const y=b?50:90, x=60+s*40; if(y!==lv){ d+=' L'+x+' '+y; lv=y; } d+=' L'+(x+40)+' '+y; }); d+=' L540 50';
        return wire(d,{noHead:true,stroke:LM,sw:2})+v.map((b,s)=>text(80+s*40,34,String(b),{mono:true,size:10,color:AM})+line(80+s*40,44,80+s*40,96,{dash:true,stroke:DIM})+text(80+s*40,108,['start','d0','d1','d2','d3','d4','d5','d6','d7','stop'][s],{size:9,color:s===0||s===9?MG:DIM})).join(''); })()}
      ${text(470,72,'RX samples\nmid-bit',{anchor:'start',size:9,color:DIM})}
      ${text(280,132,'27,000,000 ÷ 115,200 = 234.375 → divider 234',{size:10,color:AM})}${text(280,150,'error 0.16% · 86.8 µs per byte',{size:10,color:DIM})}
      ${[['IDLE',40],['START',160],['DATA ×8\nLSB first',280],['STOP',400]].map(([t,x])=>box(x,166,96,32,t,{size:10,stroke:CY})).join('')}
      ${arrow(136,182,158,182)}${arrow(256,182,278,182)}${arrow(376,182,398,182)}${wire('M448 198 L448 214 L88 214 L88 200')}${text(268,226,'line returns high (idle)',{size:9,color:DIM})}`,'UART 8N1 frame waveform and transmitter state machine')},
   {cap:"The open-source FPGA flow for a Gowin board. Simulate first; Yosys synthesizes the Verilog into a netlist of LUTs and flip-flops; nextpnr places and routes it and reports fmax; gowin_pack writes the bitstream; openFPGALoader programs the board. Swap synth_gowin, nextpnr's target and the packer for iCE40 (icepack) or ECP5 (ecppack).",
    svg:flow([{t:'blink.v + tb.v\nVerilog'},{t:'simulate\niverilog · Verilator',stroke:LM,edge:'test'},{t:'Yosys\nsynth_gowin → JSON',stroke:CY,edge:'pass'},{t:'nextpnr\nplace, route, fmax',stroke:AM,edge:'netlist'},{t:'gowin_pack\n→ blink.fs',edge:'placed'},{t:'openFPGALoader\n→ Tang Nano 20K',stroke:MG,edge:'load'}],{perRow:3,bw:140,bh:52,gap:60,label:'Open-source FPGA flow from Verilog to a programmed board'})}];

  /* ================= MODULE 7: soft cores, bare metal, boot and open silicon ================= */
  I.p38m7=[{cap:"The boot chain on a RISC-V Linux board, drawn against the three privilege levels. Mask ROM, the U-Boot SPL that brings up DRAM, and OpenSBI run in machine mode; OpenSBI stays resident and answers the kernel's SBI calls. U-Boot and the Linux kernel run in supervisor mode, the kernel learning the hardware from a device tree; user space runs in user mode.",
    svg:svg(560,250,`${text(280,14,'privilege drops as boot proceeds',{bold:true,size:11,color:CY})}
      ${[['M','machine',MG,26],['S','supervisor',CY,96],['U','user',LM,166]].map(([l,n,c,y])=>box(10,y,540,56,'',{stroke:c,dash:true})+text(35,y+20,l,{bold:true,size:14,color:c})+text(35,y+38,n,{size:9,color:DIM})).join('')}
      ${[['mask ROM\nZSBL',60,34,'currentColor'],['U-Boot SPL\nDRAM init',144,34,'currentColor'],['OpenSBI\nSBI runtime',228,34,MG],['U-Boot\nloads Linux',312,104,'currentColor'],['Linux\nkernel, DTB',396,104,CY],['user space\n(Domain 3)',480,174,LM]].map(([t,x,y,c])=>box(x,y,70,40,t,{size:10,stroke:c})).join('')}
      ${arrow(130,54,142,54)}${arrow(214,54,226,54)}${wire('M263 74 L263 124 L310 124')}${arrow(382,124,394,124)}${wire('M431 144 L431 194 L478 194')}
      ${wire('M410 104 L410 90 L285 90 L285 76',{dash:true,stroke:MG})}${text(330,62,'SBI calls (ecall) from S-mode',{anchor:'start',size:9,color:MG})}
      ${text(280,240,'QEMU virt: same chain, -bios default',{size:9,color:DIM})}`,'RISC-V boot chain from mask ROM to user space across M, S and U modes')},
   {cap:"A soft core is useless alone. A minimal SoC wraps PicoRV32 in a bus with block-RAM memory, an SPI-flash controller that lets code execute in place, a timer for interrupts, a UART (PicoSoC's data register sits at 0x02000008), GPIO for LEDs and buttons, and reset and clock logic. Your linker script and drivers must agree with this memory map.",
    svg:svg(560,240,`${text(280,12,'a minimal RISC-V SoC on an FPGA',{bold:true,size:11,color:CY})}
      ${box(10,22,540,190,'',{dash:true,stroke:DIM})}${text(22,38,'FPGA fabric · Tang Nano 20K',{anchor:'start',size:10,color:DIM})}
      ${box(28,90,110,60,'PicoRV32\nRV32IMC core',{stroke:CY})}${text(83,170,'runs bare-metal C',{size:9,color:DIM})}${text(83,190,'1–2K LUTs, 25–50 MHz',{size:9,color:AM})}
      ${line(138,120,530,120,{stroke:AM,sw:3})}${text(152,110,'bus',{size:9,color:AM})}
      ${[['RAM\nblock RAM',170,'currentColor'],['SPI flash ctrl\nexecute-in-place',300,'currentColor'],['timer\nIRQ → core',430,'currentColor']].map(([t,x,c])=>box(x,52,x===430?100:110,40,t,{size:10,stroke:c})+line(x+55,92,x+55,120,{stroke:AM})).join('')}
      ${[['UART\ndata 0x02000008',170,LM],['GPIO\nLEDs, buttons',300,'currentColor'],['reset +\nclock (PLL)',430,'currentColor']].map(([t,x,c])=>box(x,148,x===430?100:110,40,t,{size:10,stroke:c,color:c===LM?LM:'currentColor'})+line(x+55,120,x+55,148,{stroke:AM})).join('')}
      ${arrow(225,190,225,228,'',{stroke:LM})}${text(235,224,'USB-serial → terminal at 115,200',{anchor:'start',size:10,color:LM})}`,'Block diagram of a PicoRV32 system-on-chip in an FPGA')},
   {cap:"Bare metal on QEMU's virt machine. The linker script puts .text (with _start first) at 0x80000000 in 128 KB of RAM, then .data and .bss; start.S points sp at the top of RAM, zeroes .bss and calls main. Printing is a store of each byte to the 16550 UART's transmit register at 0x10000000 through a volatile pointer.",
    svg:svg(560,240,`${text(235,12,'QEMU virt memory (link.ld)',{bold:true,size:11,color:CY})}
      ${box(150,24,170,32,'stack ↓ grows down',{size:10,stroke:CY,rx:2})}${box(150,56,170,34,'free RAM',{size:10,stroke:DIM,dash:true,rx:2})}${box(150,90,170,26,'.bss · zeroed',{size:10,stroke:AM,rx:2})}${box(150,116,170,24,'.data',{size:10,rx:2})}${box(150,140,170,36,'.text · _start first',{size:10,stroke:LM,rx:2})}
      ${text(235,190,'…',{size:12,color:DIM})}${box(150,200,170,26,'UART THR (MMIO)',{size:10,stroke:MG,rx:2})}
      ${[['0x80020000',24],['0x80000000',176],['0x10000000',213]].map(([a,y])=>text(144,y,a,{anchor:'end',mono:true,size:9,color:DIM})).join('')}${text(60,100,'RAM\n128 KB',{size:10,color:DIM})}
      ${text(446,24,'start.S, then main()',{bold:true,size:11,color:CY})}
      ${[['la sp, _stack_top',CY],['zero .bss (sw loop)',AM],['call main',LM],['j . if main returns','currentColor']].map(([t,c],i)=>box(346,40+i*40,200,28,t,{mono:true,size:10,stroke:c})+(i<3?arrow(446,68+i*40,446,78+i*40):'')).join('')}
      ${arrow(344,54,324,32,'',{dash:true,stroke:CY})}${arrow(344,94,324,103,'',{dash:true,stroke:AM})}
      ${text(446,206,'puts() stores bytes to THR',{size:10,color:MG})}${text(446,224,'-nostdlib -ffreestanding -T link.ld',{mono:true,size:9,color:DIM})}`,'Bare-metal memory layout on QEMU virt and the start.S sequence')},
   {cap:"From RTL to silicon with open tools. Yosys maps the Verilog to a foundry's standard cells, OpenROAD places, builds the clock tree and routes, signoff checks design rules, layout-versus-schematic and timing, and the GDSII file goes to the fab; LibreLane wraps the whole flow. Tiny Tapeout puts your design in one tile of a shared die with a fixed pin interface.",
    svg:svg(560,246,`${[['RTL\nVerilog',CY],['synthesis\nYosys + ABC','currentColor'],['place & route\nOpenROAD',AM],['signoff\nDRC · LVS · STA','currentColor'],['GDSII\ntapeout',LM]].map(([t,c],i)=>box(10+i*111,20,96,44,t,{size:10,stroke:c})+(i<4?arrow(106+i*111,42,119+i*111,42):'')).join('')}
      ${text(150,84,'LibreLane runs the whole flow',{size:10,color:CY})}${text(420,84,'open PDKs: SKY130 · IHP · GF180',{size:10,color:AM})}
      ${box(170,110,220,104,'your design\n~1,000 cells\n≈ 160 × 100 µm',{stroke:CY,size:11})}
      ${arrow(250,94,250,108)}${arrow(310,94,310,108)}${text(242,98,'clk',{anchor:'end',size:9})}${text(318,98,'rst_n',{anchor:'start',mono:true,size:9})}
      ${arrow(100,150,168,150,'',{stroke:AM})}${text(94,150,'ui_in[7:0]',{anchor:'end',mono:true,size:10,color:AM})}${text(94,164,'8 inputs',{anchor:'end',size:9,color:DIM})}
      ${arrow(392,150,460,150,'',{stroke:LM})}${text(466,150,'uo_out[7:0]',{anchor:'start',mono:true,size:10,color:LM})}${text(466,164,'8 outputs',{anchor:'start',size:9,color:DIM})}
      <line x1="394" y1="196" x2="458" y2="196" stroke="${MG}" stroke-width="1.3" marker-start="url(#ah)" marker-end="url(#ah)"/>${text(466,196,'uio[7:0]',{anchor:'start',mono:true,size:10,color:MG})}${text(466,210,'8 bidirectional',{anchor:'start',size:9,color:DIM})}
      ${text(90,196,'shared die with\nhundreds of tiles',{size:9,color:DIM})}
      ${text(280,236,'Tiny Tapeout: your Verilog on real silicon',{size:10,color:LM})}`,'Open ASIC flow from RTL to GDSII and the Tiny Tapeout tile interface')},
   {cap:"Where the RVFA exam's marks are, and which part of this domain covers each. The ISA and assembly domains together are 60% of the exam, so hand-encoding, register roles and reading RV32I code deserve most of your study hours; C and the OS-and-tools domain lean on Domain 15 and Modules 4 and 7.",
    svg:svg(560,222,`${text(280,14,'RVFA domain weights → study hours',{bold:true,size:11,color:CY})}
      ${[['Overview',10,'Modules 1, 2, 5',DIM],['ISA',35,'Modules 1–2',CY],['Assembly',25,'Module 2 · Lab 1',CY],['C (high-level)',15,'Domain 15 · Module 7',AM],['OS & tools',15,'Modules 4, 7',AM]].map(([n,p,m,c],k)=>{ const y=30+k*30, w=p*300/35; return text(142,y+11,n,{anchor:'end',size:10})+box(150,y,w,22,p+'%',{size:10,rx:3,stroke:c,color:c===DIM?'currentColor':c})+text(158+w,y+11,m,{anchor:'start',size:9,color:DIM}); }).join('')}
      ${text(280,194,'ISA + assembly = 60% of the exam',{size:10,color:AM})}${text(280,212,'90 min · multiple choice · online',{size:9,color:DIM})}`,'RVFA exam domain weights mapped to the modules')}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
