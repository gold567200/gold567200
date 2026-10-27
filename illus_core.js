/* Illustrations — a tiny SVG drawing kit + figures for Domains 1–5.
   Every figure is inline SVG in currentColor (theme-safe) with accent colors via CSS variables.
   window.ILLUS[moduleId] = [{cap, svg}] */
(function(){
  const CY="var(--cyan)", MG="var(--mag)", AM="var(--amber)", LM="var(--lime)", DIM="var(--dim)";
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const DEFS=`<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>`;
  function svg(W,H,inner,label){ return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label||'diagram')}" style="width:100%;max-width:${Math.min(W,640)}px;height:auto;display:block;margin:0 auto;font-family:var(--fbody),system-ui,sans-serif;font-size:12px">${DEFS}${inner}</svg>`; }
  function text(x,y,t,o={}){ const lines=String(t).split('\n'); const lh=o.lh||13;
    return lines.map((ln,i)=>`<text x="${x}" y="${y+i*lh}" text-anchor="${o.anchor||'middle'}" font-size="${o.size||12}" font-weight="${o.bold?700:400}" fill="${o.color||'currentColor'}" ${o.mono?'font-family="var(--fmono),monospace"':''} dominant-baseline="middle">${esc(ln)}</text>`).join(''); }
  function box(x,y,w,h,t,o={}){ const lines=String(t).split('\n'); let size=o.size||12; const maxLen=Math.max(1,...lines.map(l=>l.length)); const fit=(w-10)/(maxLen*(o.mono?0.62:0.56)); if(fit<size) size=Math.max(8,Math.floor(fit*10)/10);
    const lh=o.lh||Math.round(size*1.15); const y0=y+h/2-(lines.length-1)*lh/2;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx==null?7:o.rx}" fill="${o.fill||'none'}" stroke="${o.stroke||'currentColor'}" stroke-width="${o.sw||1.3}" ${o.dash?'stroke-dasharray="5 4"':''}/>`+text(x+w/2,y0,t,{size,bold:o.bold,color:o.color,lh,mono:o.mono}); }
  function arrow(x1,y1,x2,y2,t,o={}){ const mx=(x1+x2)/2, my=(y1+y2)/2; return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o.stroke||'currentColor'}" stroke-width="${o.sw||1.3}" ${o.dash?'stroke-dasharray="5 4"':''} marker-end="url(#ah)"/>`+(t?`<rect x="${mx-String(t).length*3.2-4}" y="${my-(o.dy||9)-7}" width="${String(t).length*6.4+8}" height="14" rx="3" fill="var(--bg)" opacity="0.9"/>`+text(mx,my-(o.dy||9),t,{size:11,color:o.color||DIM}):''); }
  function line(x1,y1,x2,y2,o={}){ return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o.stroke||'currentColor'}" stroke-width="${o.sw||1.3}" ${o.dash?'stroke-dasharray="5 4"':''}/>`; }
  function flow(items,o={}){ // horizontal boxes with labeled arrows; wraps to rows when there are many
    const n=items.length, perRow=o.perRow||(n>4?Math.ceil(n/2):n), bw=o.bw||104, bh=o.bh||52, gap=o.gap||46, pad=10, rowGap=34;
    const rows=Math.ceil(n/perRow); const W=perRow*bw+(perRow-1)*gap+pad*2, H=rows*bh+(rows-1)*rowGap+pad*2;
    let s=''; items.forEach((it,i)=>{ const r=Math.floor(i/perRow), c=i%perRow; const x=pad+c*(bw+gap), y=pad+r*(bh+rowGap);
      s+=box(x,y,bw,bh,typeof it==='string'?it:it.t,{fill:it.fill,stroke:it.stroke,color:it.color,bold:it.bold});
      if(i<n-1){ const lbl=(items[i+1].edge||o.edges&&o.edges[i])||'';
        if(c<perRow-1) s+=arrow(x+bw+3,y+bh/2,x+bw+gap-3,y+bh/2,lbl);
        else { const nx=pad, ny=y+bh+rowGap; s+=`<path d="M${x+bw/2} ${y+bh} L${x+bw/2} ${y+bh+rowGap/2} L${nx+bw/2} ${y+bh+rowGap/2} L${nx+bw/2} ${ny-3}" fill="none" stroke="currentColor" stroke-width="1.3" marker-end="url(#ah)"/>`+(lbl?text((x+nx+bw)/2,y+bh+rowGap/2-8,lbl,{size:11,color:DIM}):''); } } });
    return svg(W,H,s,o.label); }
  function stack(layers,o={}){ // vertical bars (top first)
    const w=o.w||300, h=o.h||38, gap=o.gap||8, pad=10, sideW=o.side?160:0; const W=w+pad*2+sideW, H=layers.length*(h+gap)-gap+pad*2;
    let s=''; layers.forEach((L,i)=>{ const y=pad+i*(h+gap); const l=typeof L==='string'?{t:L}:L; s+=box(pad,y,w,h,l.t,{fill:l.fill,stroke:l.stroke,color:l.color,bold:l.bold});
      if(l.side) s+=text(pad+w+12,y+h/2,l.side,{anchor:'start',size:11,color:DIM}); });
    return svg(W,H,s,o.label); }
  function pyramid(levels,o={}){ const W=360,H=levels.length*40+20; let s=''; levels.forEach((L,i)=>{ const w=120+i*(220/(levels.length-1)); const x=(W-w)/2, y=10+i*40;
      s+=box(x,y,w,32,L.t,{fill:L.fill,color:L.color,bold:i===0}); if(L.side) s+=text(W-4,y+16,L.side,{anchor:'end',size:10,color:DIM}); }); return svg(W,H,s,o.label); }
  function cycle(items,o={}){ const n=items.length, R=o.r||95, cx=150, cy=150; let s=''; items.forEach((it,i)=>{ const a=-Math.PI/2+i*2*Math.PI/n, x=cx+R*Math.cos(a), y=cy+R*Math.sin(a);
      const lab=(it&&typeof it==='object')?(it.t||''):it; const stk=(it&&typeof it==='object'&&it.stroke)?it.stroke:(i===0?CY:'currentColor'); s+=box(x-46,y-18,92,36,lab,{fill:i===0?'#06303d':'none',stroke:stk}); const a2=-Math.PI/2+(i+1)*2*Math.PI/n; const x2=cx+R*Math.cos(a2), y2=cy+R*Math.sin(a2);
      const t=0.62; s+=arrow(x+(x2-x)*0.3,y+(y2-y)*0.3,x+(x2-x)*t,y+(y2-y)*t,''); }); return svg(300,300,s,o.label); }
  function tree(root,o={}){ // simple 2-level tree
    const kids=root.kids||[]; const bw=96,bh=34; const W=Math.max(kids.length*(bw+14),300)+20; const H=o.three?190:120;
    let s=box(W/2-bw/2,10,bw,bh,root.t,{stroke:CY,bold:true}); kids.forEach((k,i)=>{ const x=10+i*((W-20)/kids.length)+((W-20)/kids.length-bw)/2; s+=line(W/2,10+bh,x+bw/2,80); s+=box(x,80,bw,bh,k.t||k,{});
      if(k.kids){ k.kids.forEach((g,j)=>{ const gx=x+(j-(k.kids.length-1)/2)*62; s+=line(x+bw/2,80+bh,gx+28,150); s+=box(gx,150,56,28,g,{size:10}); }); } });
    return svg(W,H,s,o.label); }
  function compare(left,right,o={}){ const W=560,H=o.h||170; let s=box(10,10,260,H-20,'',{dash:true,stroke:DIM})+box(290,10,260,H-20,'',{dash:true,stroke:DIM});
    s+=text(140,26,left.t,{bold:true,color:CY})+text(420,26,right.t,{bold:true,color:MG}); s+=left.draw(10)+right.draw(290); return svg(W,H,s,o.label); }

  const I={};
  /* ================= DOMAIN 1 ================= */
  I.p1m1=[{cap:"A transistor is an electrically controlled switch. Left: the circuit symbol (a small voltage on the gate lets current flow from drain to source). Right: what one looks like as a part, and the reality inside a chip — billions of them, each a few nanometers wide.",
    svg:svg(560,210,
      // MOSFET symbol
      `${line(60,60,60,150)}${line(60,105,100,105)}${text(42,105,'gate',{size:11,color:DIM})}
       ${line(100,70,100,140,{sw:2.5})}${line(100,80,140,80)}${line(140,80,140,50)}${text(140,40,'drain (current in)',{size:11,color:DIM})}
       ${line(100,130,140,130)}${line(140,130,140,160)}${text(140,172,'source (current out)',{size:11,color:DIM})}
       ${arrow(150,60,150,95,'',{stroke:LM,sw:2})}${text(190,78,'flows only when\ngate is ON',{size:11,color:LM,anchor:'start'})}
       ${text(110,195,'circuit symbol',{bold:true,color:CY})}`+
      // physical package
      `${box(300,55,70,60,'',{fill:'#0f2140',rx:6})}${text(335,85,'TRANSISTOR',{size:9,mono:true})}${line(312,115,312,150)}${line(335,115,335,150)}${line(358,115,358,150)}${text(335,160,'one discrete part\n(3 legs)',{size:10,color:DIM})}
       ${box(420,45,110,80,'',{fill:'#070f1c',rx:4})}${Array.from({length:6},(_,r)=>Array.from({length:9},(_,c)=>`<rect x="${428+c*11.5}" y="${53+r*11.5}" width="8" height="8" fill="${(r*9+c)%7===0?CY:'#163a5e'}"/>`).join('')).join('')}
       ${text(475,140,'inside a chip: billions,\neach ~5 nm wide',{size:10,color:DIM})}${text(430,195,'the same switch at two scales',{bold:true,color:CY})}`,
      'Transistor symbol, a discrete transistor part, and billions of transistors inside a chip')},
   {cap:"Eight switches, each worth a power of two. Only the ON switches count: 8 + 4 + 1 = 13. That is 1101 in binary and 0x0D in hex.",
    svg:svg(520,130,[128,64,32,16,8,4,2,1].map((v,i)=>{ const on=[0,0,0,0,1,1,0,1][i]; return box(14+i*62,20,50,50,on?'1':'0',{fill:on?'#06303d':'none',stroke:on?CY:DIM,bold:true,size:20,color:on?CY:DIM})+text(39+i*62,88,String(v),{size:11,color:on?LM:DIM}); }).join('')+text(260,114,'ON positions add up: 8 + 4 + 1 = 13  →  binary 1101  →  hex D',{size:12,color:AM}),'Eight binary switches representing 13')}];
  I.p1m2=[{cap:"The standard gate shapes and what each does. Wire an XOR and an AND together and you have a half adder: XOR gives the sum digit, AND gives the carry — one-bit addition from two rules.",
    svg:svg(600,250,
      // AND
      `<path d="M30 30 h40 a30 30 0 0 1 0 60 h-40 z" fill="none" stroke="currentColor" stroke-width="1.5"/>${text(60,60,'AND',{size:11})}${text(60,105,'both 1 → 1',{size:10,color:DIM})}
       <path d="M160 30 q20 30 0 60 q50 0 70 -30 q-20 -30 -70 -30 z" fill="none" stroke="currentColor" stroke-width="1.5"/>${text(195,60,'OR',{size:11})}${text(195,105,'either 1 → 1',{size:10,color:DIM})}
       <path d="M290 30 v60 l60 -30 z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="354" cy="60" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/>${text(312,60,'NOT',{size:11})}${text(320,105,'flips it',{size:10,color:DIM})}
       <path d="M410 30 q20 30 0 60 q50 0 70 -30 q-20 -30 -70 -30 z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M402 30 q20 30 0 60" fill="none" stroke="currentColor" stroke-width="1.5"/>${text(447,60,'XOR',{size:11})}${text(447,105,'exactly one 1 → 1',{size:10,color:DIM})}
       <path d="M520 30 h30 a30 30 0 0 1 0 60 h-30 z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="584" cy="60" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/>${text(545,60,'NAND',{size:11})}${text(555,105,'builds all others',{size:10,color:DIM})}`+
      // half adder
      `${text(300,135,'HALF ADDER',{bold:true,color:CY})}
       ${text(150,170,'A',{bold:true})}${text(150,210,'B',{bold:true})}
       ${line(160,170,250,170)}${line(160,210,250,210)}${line(200,170,200,250)}${line(220,210,220,250)}
       <path d="M250 150 q15 20 0 40 q40 0 55 -20 q-15 -20 -55 -20 z" fill="none" stroke="${CY}" stroke-width="1.5"/><path d="M243 150 q15 20 0 40" fill="none" stroke="${CY}" stroke-width="1.5"/>${text(278,170,'XOR',{size:10})}
       ${arrow(305,170,370,170,'')}${text(410,170,'SUM = A XOR B',{anchor:'start',color:LM,bold:true})}
       ${line(200,250,250,250)}${line(220,250,250,250)}<path d="M250 230 h25 a20 20 0 0 1 0 40 h-25 z" fill="none" stroke="${CY}" stroke-width="1.5"/>${text(270,250,'AND',{size:10})}
       ${arrow(295,250,370,250,'')}${text(410,250,'CARRY = A AND B',{anchor:'start',color:AM,bold:true})}`,
      'Logic gate symbols and a half adder built from XOR and AND')}];
  I.p1m3=[{cap:"The memory hierarchy: each level down is bigger and cheaper but 10–1000× slower. Programs feel fast when their working data stays near the top.",
    svg:pyramid([{t:'Registers · ~0.3 ns',fill:'#06303d',color:CY,side:'bytes'},{t:'L1 / L2 cache · 1–4 ns',side:'KB–MB'},{t:'L3 cache · 10–40 ns',side:'tens of MB'},{t:'RAM (DRAM) · ~100 ns',side:'GB'},{t:'SSD · ~50–100 µs',side:'TB'},{t:'Hard disk · 5–10 ms',side:'TB, cheapest'}],{label:'Memory hierarchy from registers to hard disk'})},
   {cap:"How a circuit remembers: two gates cross-coupled so each one's output feeds the other's input. Pulse SET and the output locks at 1; pulse RESET and it locks at 0. That feedback loop is one bit of memory (a latch).",
    svg:svg(420,150,`${box(120,25,90,40,'NOR',{})}${box(120,85,90,40,'NOR',{})}${arrow(40,45,118,45,'SET')}${arrow(40,105,118,105,'RESET')}
      ${arrow(212,45,290,45,'Q (the bit)',{color:LM})}${arrow(212,105,290,105,'not Q')}
      <path d="M212 45 L250 45 L250 70 L100 70 L100 95 L118 95" fill="none" stroke="${MG}" stroke-width="1.3" marker-end="url(#ah)"/>
      <path d="M212 105 L250 105 L250 80 L100 80 L100 55 L118 55" fill="none" stroke="${MG}" stroke-width="1.3" marker-end="url(#ah)"/>
      ${text(330,75,'feedback = memory',{color:MG,bold:true,size:11})}`,'SR latch made from two cross-coupled NOR gates')}];
  I.p1m4=[{cap:"Inside the CPU: the control unit fetches the instruction at the program counter, decodes it, the ALU executes it using the registers, and the result is written back. Then it repeats, billions of times a second.",
    svg:svg(600,260,`${box(20,20,560,220,'',{dash:true,stroke:DIM})}${text(60,34,'CPU',{bold:true,color:CY,anchor:'start'})}
      ${box(50,60,120,50,'Control unit\n(decoder, sequencer)',{size:11})}${box(220,60,120,50,'Registers\n(RAX, RBX… 64-bit)',{size:11})}${box(390,60,120,50,'ALU\n(add, compare, shift)',{size:11,stroke:CY})}
      ${box(50,150,120,50,'Program counter\n(next instruction)',{size:11,stroke:AM})}${box(220,150,120,50,'L1 cache\n(instructions + data)',{size:11})}${box(390,150,120,50,'Clock\n4 GHz = 4 billion ticks/s',{size:11})}
      ${arrow(170,85,218,85,'decode')}${arrow(340,85,388,85,'operands')}${arrow(450,112,450,148,'')}${arrow(280,148,280,112,'fetch',{})}${arrow(170,175,218,175,'address')}
      ${line(540,70,560,70)}${text(540,228,'memory (RAM) ↔',{anchor:'end',size:11,color:DIM})}`,'Block diagram of a CPU: control unit, registers, ALU, program counter, cache, clock')},
   {cap:"The fetch–decode–execute cycle every instruction goes through.",svg:flow([{t:'FETCH\nread instruction at PC',stroke:AM},{t:'DECODE\nwhat op? which registers?'},{t:'EXECUTE\nALU does the work',stroke:CY},{t:'MEMORY\nload/store if needed'},{t:'WRITE-BACK\nresult → register'}],{bw:104,bh:56,gap:30,label:'Five-stage instruction cycle'})}];
  I.p1m5=[{cap:"Without a pipeline, one instruction finishes before the next starts. With one, each stage works on a different instruction every tick — like an assembly line — so throughput approaches one instruction per tick.",
    svg:svg(560,210,`${text(70,20,'no pipeline',{bold:true,color:DIM})}${[0,1,2].map(i=>box(20+i*170,32,160,24,'I'+(i+1)+': F→D→E→M→W',{size:11,stroke:DIM})).join('')}
      ${text(70,80,'pipelined',{bold:true,color:CY})}${['F','D','E','M','W'].map((s,k)=>[0,1,2,3].map(i=>box(20+(k+i)*42,92+i*26,40,22,s,{size:11,fill:i===0?'#06303d':'none',stroke:i===0?CY:'currentColor'})).join('')).join('')}
      ${text(390,105,'tick →',{color:DIM,anchor:'start'})}${text(400,150,'4 instructions in flight;\none finishes every tick',{anchor:'start',size:11,color:LM})}`,'Sequential versus pipelined execution')},
   {cap:"Amdahl's law: the part that can't be split (serial) caps the speedup no matter how many cores you add.",
    svg:svg(520,120,`${text(60,20,'1 core',{anchor:'start',color:DIM})}${box(60,30,80,22,'serial 20',{size:11,stroke:MG})}${box(140,30,320,22,'parallel 80',{size:11,stroke:CY})}
      ${text(60,72,'16 cores',{anchor:'start',color:DIM})}${box(60,82,80,22,'serial 20',{size:11,stroke:MG})}${box(140,82,20,22,'5',{size:10,stroke:CY})}${text(300,93,'100 s → 25 s: only 4× faster, not 16×',{color:AM,anchor:'start',size:11})}`,'Amdahl law: serial fraction limits speedup')}];
  I.p1m6=[{cap:"The map of a PC: the CPU talks directly to RAM (memory channels) and to the GPU and main SSD (PCIe lanes); the chipset handles the slower devices over a narrower link.",
    svg:svg(600,290,`${box(230,110,140,60,'CPU',{bold:true,stroke:CY,size:14})}
      ${box(40,20,140,50,'RAM (DDR5)\ndual channel ~96 GB/s',{size:11})}${arrow(180,45,230,110,'memory bus')}
      ${box(420,20,150,50,'GPU\nPCIe 5.0 x16 ~63 GB/s',{size:11,stroke:MG})}${arrow(420,45,370,110,'16 lanes')}
      ${box(420,110,150,50,'NVMe SSD\nPCIe x4 ~7 GB/s',{size:11})}${arrow(420,135,372,135,'4 lanes')}
      ${box(230,220,140,50,'Chipset',{size:12})}${arrow(300,170,300,218,'x4 link')}
      ${box(40,220,140,50,'USB · SATA · audio\nEthernet · Wi-Fi',{size:11})}${arrow(230,245,182,245,'')}${box(420,220,150,50,'extra PCIe / M.2 slots',{size:11})}${arrow(370,245,418,245,'')}
      ${text(300,285,'power: PSU → VRMs step 12 V down to ~1 V for the CPU core',{size:10,color:DIM})}`,'Motherboard topology: CPU, RAM, GPU, NVMe, chipset and peripherals')},
   {cap:"CPU vs GPU: a few powerful cores for one fast instruction stream, versus thousands of simple cores doing the same math on different data at once. CUDA is how the GPU's thousands of workers get their orders.",
    svg:compare({t:'CPU · 8–16 big cores',draw:x=>Array.from({length:8},(_,i)=>box(x+22+(i%4)*58,45+Math.floor(i/4)*52,50,44,'core',{size:10,stroke:CY})).join('')},{t:'GPU · thousands of small cores',draw:x=>Array.from({length:96},(_,i)=>`<rect x="${x+22+(i%16)*14.5}" y="${45+Math.floor(i/16)*16}" width="11" height="12" rx="2" fill="none" stroke="${MG}"/>`).join('')+text(x+130,152,'same instruction, different data (SIMT) — CUDA kernels',{size:10,color:DIM})},{h:170,label:'CPU with few large cores versus GPU with many small cores'})}];
  I.p1m7=[{cap:"From sand to chip: silicon is purified into a wafer, patterned with light layer by layer, cut into dies, tested (bad ones discarded — yield), and packaged. Bigger dies have more chances for a defect.",
    svg:flow([{t:'silicon\nwafer (300 mm)'},{t:'photo-\nlithography\n(EUV light)'},{t:'hundreds of\nlayers'},{t:'dice into\ndies'},{t:'test →\nyield',stroke:AM},{t:'package\n& ship',stroke:CY}],{bw:84,bh:60,gap:24,label:'Chip manufacturing flow'})},
   {cap:"Why clock speeds stopped rising around 2005: transistor counts kept doubling (Moore's law) but power per area could no longer fall (end of Dennard scaling), so the industry turned to more cores and specialized chips.",
    svg:svg(520,170,`${line(50,140,490,140)}${line(50,140,50,20)}${text(270,160,'year  1990 → 2005 → 2025',{size:11,color:DIM})}
      <path d="M50 130 C150 120 250 60 300 20 L480 15" fill="none" stroke="${CY}" stroke-width="2"/>${text(400,30,'transistors per chip (keeps rising)',{size:10,color:CY,anchor:'start'})}
      <path d="M50 135 C150 125 250 70 300 60 L480 60" fill="none" stroke="${MG}" stroke-width="2"/>${text(400,75,'clock speed (flat since ~2005)',{size:10,color:MG,anchor:'start'})}
      ${line(300,20,300,140,{dash:true,stroke:AM})}${text(300,152,'2005: heat wall',{size:10,color:AM})}`,'Transistor counts keep rising while clock speeds flatten after 2005')}];

  /* ================= DOMAIN 2 ================= */
  I.p2m1=[{cap:"Encapsulation: each layer wraps the one above in its own header, like envelopes inside envelopes. A router opens only the IP envelope; a switch only the Ethernet one; your browser only the HTTP message.",
    svg:svg(600,150,`${box(20,30,560,90,'',{stroke:'currentColor'})}${text(60,45,'Ethernet frame',{anchor:'start',size:11,color:DIM})}
      ${box(130,45,440,65,'',{stroke:AM})}${text(170,58,'IP packet',{anchor:'start',size:11,color:AM})}
      ${box(240,60,320,42,'',{stroke:CY})}${text(280,72,'TCP segment',{anchor:'start',size:11,color:CY})}
      ${box(340,70,210,24,'HTTP: GET /page',{stroke:MG,color:MG,size:11})}
      ${text(60,110,'MAC addresses',{anchor:'start',size:10,color:DIM})}${text(170,95,'IP addresses',{anchor:'start',size:10,color:AM})}${text(280,92,'ports, seq #',{anchor:'start',size:10,color:CY})}`,'HTTP inside TCP inside IP inside an Ethernet frame')},
   {cap:"The four TCP/IP layers (and the OSI numbers interviews use) — each has one job and one kind of address.",
    svg:stack([{t:'Application · HTTP, DNS, TLS · (OSI 5–7) · names',fill:'#2a0725',stroke:MG},{t:'Transport · TCP, UDP · (OSI 4) · ports',stroke:CY},{t:'Internet · IP, ICMP · (OSI 3) · IP addresses',stroke:AM},{t:'Link · Ethernet, Wi-Fi, ARP · (OSI 1–2) · MAC addresses'}],{w:420,label:'TCP/IP layers with OSI numbers and address types'})}];
  I.p2m2=[{cap:"A home network: devices on the same switch/Wi-Fi talk directly by MAC address (one broadcast domain). Anything beyond goes to the router, the only way out.",
    svg:svg(560,200,`${box(230,20,110,44,'Router\n(default gateway)',{size:11,stroke:AM})}${arrow(285,0,285,18,'to the internet',{dy:-2})}
      ${box(230,100,110,40,'Switch',{stroke:CY})}${line(285,64,285,100)}
      ${[['PC',60],['Printer',160],['NAS',360],['Phone (Wi-Fi)',460]].map(([n,x])=>box(x-45,160,90,34,n,{size:11})+line(285,140,x,160)).join('')}
      ${text(285,150,'',{})}${text(420,80,'same broadcast domain: MAC-to-MAC',{size:10,color:DIM,anchor:'start'})}`,'Home LAN with router, switch and devices')}];
  I.p2m3=[{cap:"An IPv4 address with a /24 mask: the first 24 bits name the network, the last 8 name the host. 256 addresses, 254 usable (network and broadcast are reserved).",
    svg:svg(560,130,`${['192','168','1','10'].map((o,i)=>box(40+i*120,20,110,36,o,{bold:true,size:14,stroke:i<3?CY:LM,color:i<3?CY:LM})).join('')}
      ${text(220,70,'network part (24 bits)',{color:CY,size:11})}${text(455,70,'host (8 bits)',{color:LM,size:11})}
      ${text(280,100,'mask 255.255.255.0 = /24  ·  network 192.168.1.0  ·  broadcast 192.168.1.255  ·  usable .1–.254',{size:11,color:DIM})}`,'IPv4 address split into network and host parts')},
   {cap:"NAT: many private addresses share one public address. The router rewrites the source and remembers who asked, so replies find their way back.",
    svg:svg(560,150,`${[['192.168.1.10',30],['192.168.1.11',70],['192.168.1.12',110]].map(([a,y])=>box(20,y-14,120,28,a,{size:11,mono:true})).join('')}
      ${box(220,45,120,60,'Router\nNAT table',{stroke:AM})}${[30,70,110].map(y=>arrow(140,y,218,75,'')).join('')}
      ${arrow(340,75,440,75,'203.0.113.7:51020')}${box(440,55,100,40,'Internet',{stroke:MG})}`,'Private hosts sharing one public address through NAT')}];
  I.p2m4=[{cap:"The TCP three-way handshake happens before any data: SYN, SYN-ACK, ACK. One round trip, then both sides have sequence numbers and the connection exists.",
    svg:svg(460,190,`${text(80,20,'Client',{bold:true,color:CY})}${text(380,20,'Server',{bold:true,color:MG})}${line(80,30,80,180,{dash:true,stroke:DIM})}${line(380,30,380,180,{dash:true,stroke:DIM})}
      ${arrow(80,55,380,70,'SYN (seq=x)')}${arrow(380,95,80,110,'SYN-ACK (seq=y, ack=x+1)')}${arrow(80,135,380,150,'ACK (ack=y+1)')}${text(230,172,'connection open — data flows',{size:11,color:LM})}`,'TCP three-way handshake sequence')},
   {cap:"TCP vs UDP: the courier who guarantees delivery and order, versus the postcards that are fast and fine to lose.",
    svg:compare({t:'TCP · reliable',draw:x=>text(x+130,60,'handshake first',{size:11})+text(x+130,80,'every byte numbered',{size:11})+text(x+130,100,'lost → resent, in order',{size:11})+text(x+130,120,'slows down when crowded',{size:11})+text(x+130,145,'files · web · email · SSH',{size:11,color:CY})},{t:'UDP · fast',draw:x=>text(x+130,60,'no handshake',{size:11})+text(x+130,80,'8-byte header',{size:11})+text(x+130,100,'lost → gone (skip it)',{size:11})+text(x+130,120,'no ordering, no waiting',{size:11})+text(x+130,145,'voice · video · games · DNS',{size:11,color:MG})},{h:165,label:'TCP versus UDP properties'})}];
  I.p2m5=[{cap:"What happens when you type a URL: DNS finds the address, TCP opens the connection, TLS secures it, HTTP asks for the page. Three round trips before the first byte.",
    svg:flow([{t:'DNS\nname → IP',stroke:AM},{t:'TCP\nhandshake'},{t:'TLS\ncertificate +\nkeys',stroke:CY},{t:'HTTP\nGET /page'},{t:'200 OK\nHTML',stroke:LM},{t:'render\npixels',stroke:MG}],{bw:84,bh:60,gap:22,label:'Steps from typing a URL to a rendered page'})},
   {cap:"DNS resolution: your resolver asks the root, then the top-level domain, then the authoritative server, and caches the answer.",
    svg:svg(560,120,`${box(10,40,90,40,'your PC',{size:11})}${arrow(100,60,160,60,'example.com?')}${box(160,40,110,40,'recursive\nresolver',{size:11,stroke:CY})}
      ${arrow(270,50,340,30,'.com?')}${box(340,15,90,30,'root',{size:11})}${arrow(270,60,340,60,'example?')}${box(340,45,90,30,'.com TLD',{size:11})}${arrow(270,70,340,92,'A record?')}${box(340,77,90,30,'authoritative',{size:11,stroke:AM})}
      ${arrow(430,92,500,92,'93.184.216.34')}${text(520,110,'',{})}`,'Recursive DNS lookup through root, TLD and authoritative servers')}];
  I.p2m6=[{cap:"The physical internet: your ISP, exchange points where networks peer, long-haul and undersea fiber, and CDN edge servers that keep popular content near you.",
    svg:svg(600,180,`${box(10,70,80,40,'you',{size:11})}${arrow(90,90,140,90,'last mile')}${box(140,70,90,40,'ISP\n(AS 1)',{size:11})}${arrow(230,90,300,90,'peering')}${box(300,60,110,60,'Internet\nexchange (IXP)',{size:11,stroke:CY})}
      ${arrow(410,80,480,50,'transit')}${box(480,30,110,40,'Tier-1 backbone',{size:11})}${arrow(410,100,480,130,'')}${box(480,110,110,40,'CDN edge\n(cached copy)',{size:11,stroke:LM})}
      ${line(590,50,600,50)}${text(300,160,'undersea cable: ~200,000 km/s → New York ↔ London ≈ 60 ms round trip',{size:11,color:DIM})}`,'ISP, exchange point, backbone and CDN edge')}];
  I.p2m7=[{cap:"Troubleshoot bottom-up: each test rules out one layer. Where the first failure appears tells you what's broken.",
    svg:stack([{t:'6. ping a name (google.com) → fails here = DNS',stroke:MG},{t:'5. ping a public IP (1.1.1.1) → fails = upstream / NAT'},{t:'4. ping the gateway → fails = local network'},{t:'3. check your address (169.254.x.x = no DHCP)',stroke:AM},{t:'2. link light / Wi-Fi associated?'},{t:'1. is it plugged in / turned on?',stroke:CY}],{w:420,label:'Bottom-up network troubleshooting ladder'})}];

  /* ================= DOMAIN 3 ================= */
  I.p3m1=[{cap:"User mode vs kernel mode: ordinary programs can't touch hardware; they make system calls into the kernel, which owns the CPU, memory, files and devices.",
    svg:svg(520,200,`${box(20,20,480,160,'',{dash:true,stroke:DIM})}${text(70,35,'user mode',{anchor:'start',color:DIM,size:11})}
      ${['browser','Claude Code','Python','ls'].map((n,i)=>box(40+i*115,50,100,34,n,{size:11})).join('')}
      ${[0,1,2,3].map(i=>arrow(90+i*115,84,90+i*115,110,i===1?'system call':'')).join('')}
      ${box(40,112,440,30,'KERNEL  (processes · memory · files · drivers)',{stroke:CY,color:CY,bold:true,size:12})}
      ${arrow(260,142,260,160,'')}${box(40,160,440,18,'hardware: CPU · RAM · SSD · network card',{size:10,rx:3})}`,'User programs call into the kernel which controls hardware')}];
  I.p3m2=[{cap:"The family tree: Unix (1969) → GNU tools + the Linux kernel (1991) → the distributions you actually install. macOS descends from the BSD branch.",
    svg:tree({t:'Unix (1969)',kids:[{t:'BSD → macOS'},{t:'GNU + Linux',kids:['Debian','Red Hat','Arch']},{t:'Android\n(Linux kernel)'}]},{three:true,label:'Unix family tree'})}];
  I.p3m3=[{cap:"The filesystem is a tree starting at / . A path is directions from the root: /home/tyler/notes/todo.txt. ~ is your home.",
    svg:tree({t:'/',kids:[{t:'home',kids:['tyler','notes…']},{t:'etc\n(config)'},{t:'var\n(logs, data)'},{t:'usr/bin\n(programs)'}]},{three:true,label:'Linux filesystem tree'})},
   {cap:"Reading a permission string: type, then rwx for the owner, the group, and everyone else — also written as the octal number 754.",
    svg:svg(520,110,`${['-','rwx','r-x','r--'].map((s,i)=>box(40+i*120,20,100,40,s,{mono:true,size:16,bold:true,stroke:[DIM,CY,AM,MG][i],color:[DIM,CY,AM,MG][i]})).join('')}
      ${['file (d = dir)','owner = 7','group = 5','others = 4'].map((s,i)=>text(90+i*120,78,s,{size:11,color:DIM})).join('')}${text(260,100,'chmod 754 file',{mono:true,color:LM})}`,'Permission string -rwxr-xr-- equals octal 754')}];
  I.p3m4=[{cap:"A pipeline: each program's output flows into the next's input. Small tools snap together to answer a real question.",
    svg:flow([{t:'grep\n"error" log'},{t:'cut\nIP column',edge:'|'},{t:'sort',edge:'|'},{t:'uniq -c\ncount',edge:'|'},{t:'sort -rn\nrank',edge:'|'},{t:'head\ntop 10',stroke:LM,edge:'|'}],{bw:80,bh:52,gap:28,label:'Shell pipeline of six small tools'})}];
  I.p3m5=[{cap:"A service's life under systemd: started at boot, watched, restarted on crash, logged to the journal.",
    svg:cycle(['boot: start','running','crash!','auto-restart','journal log'],{label:'systemd service lifecycle'})}];
  I.p3m6=[{cap:"SSH key authentication: the private key never leaves your laptop; the server holds only the public half. Nothing to guess, so password attacks become impossible.",
    svg:svg(560,130,`${box(20,30,170,70,'your laptop\n🔑 private key (600)\n~/.ssh/id_ed25519',{size:11,stroke:CY})}${arrow(190,65,370,65,'challenge signed with private key')}
      ${box(370,30,170,70,'server\n🔓 public key\n~/.ssh/authorized_keys',{size:11,stroke:LM})}${text(280,118,'PasswordAuthentication no · PermitRootLogin no · ufw allow 22',{size:10,color:DIM})}`,'SSH public-key authentication between laptop and server')}];
  I.p3m7=[{cap:"Anatomy of a safe Bash script: the interpreter line, the three safety flags, quoted variables, and an exit code the caller can check.",
    svg:stack([{t:'#!/usr/bin/env bash   ← which interpreter',stroke:DIM},{t:'set -euo pipefail   ← stop on error, unset vars, pipe failures',stroke:AM},{t:'DIR="${1:?usage}"   ← arguments, quoted',stroke:CY},{t:'for f in "$DIR"/*; do … done   ← loops, if, functions'},{t:'exit 0   ← 0 = success, anything else = failure',stroke:LM}],{w:460,label:'Structure of a Bash script'})}];

  /* ================= DOMAIN 4 ================= */
  I.p4m1=[{cap:"Variables are names, not boxes. After b = a, both names point at the same list, so appending through b changes what a sees. Numbers and strings can't be changed in place, so they never surprise you.",
    svg:svg(520,130,`${box(40,30,60,34,'a',{stroke:CY,bold:true})}${box(40,80,60,34,'b',{stroke:MG,bold:true})}${arrow(100,47,220,60,'')}${arrow(100,97,220,70,'')}
      ${box(220,45,150,40,'[1, 2, 3]  (one list object)',{size:11,stroke:LM})}${text(430,65,'b.append(4) →\na is [1,2,3,4] too',{anchor:'start',size:11,color:AM})}`,'Two variable names bound to one list object')}];
  I.p4m2=[{cap:"Control flow as a flowchart: a decision diamond chooses a branch; a loop arrow repeats until the condition fails.",
    svg:svg(520,200,`${box(20,80,90,40,'start',{rx:20})}${arrow(110,100,160,100,'')}<polygon points="230,70 300,100 230,130 160,100" fill="none" stroke="${AM}" stroke-width="1.4"/>${text(230,100,'score ≥ 90?',{size:11})}
      ${arrow(300,100,360,100,'yes')}${box(360,80,120,40,'grade = "A"',{stroke:LM})}${arrow(230,130,230,170,'no')}${box(170,170,120,28,'check next branch',{size:11})}
      <path d="M480 100 L500 100 L500 40 L65 40 L65 78" fill="none" stroke="${MG}" stroke-width="1.3" stroke-dasharray="5 4" marker-end="url(#ah)"/>${text(300,30,'loop: for each student, repeat',{size:11,color:MG})}`,'Flowchart with a decision and a loop')}];
  I.p4m3=[{cap:"A function is a box: arguments go in, a return value comes out. Names inside stay inside (scope). Returned values can be passed to the next box — printed ones can't.",
    svg:svg(540,130,`${arrow(10,60,80,60,'3, 4')}${box(80,30,140,60,'area(width, height)\n  return w * h',{mono:true,size:11,stroke:CY})}${arrow(220,60,290,60,'12')}${box(290,30,120,60,'format(…)',{mono:true,size:11})}${arrow(410,60,470,60,'"12 m²"')}${text(150,110,'local names live only here',{size:10,color:DIM})}`,'Functions composed by passing return values')}];
  I.p4m4=[{cap:"Four containers, four access patterns. The dict and set jump straight to an item by hashing its key (O(1)); a list must be scanned (O(n)).",
    svg:svg(600,170,`${text(80,20,'list',{bold:true,color:CY})}${[0,1,2,3].map(i=>box(30+i*28,30,26,26,String([3,1,4,1][i]),{size:11})).join('')}${text(80,72,'index 0,1,2… scan to search',{size:10,color:DIM})}
      ${text(230,20,'tuple',{bold:true})}${box(190,30,80,26,'(3, 4)',{size:11,rx:13})}${text(230,72,'fixed; dict key OK',{size:10,color:DIM})}
      ${text(390,20,'dict',{bold:true,color:LM})}${box(330,30,120,26,'"sam" → 30',{size:11})}${box(330,60,120,26,'"ana" → 25',{size:11})}${text(390,100,'hash(key) → jump: O(1)',{size:10,color:LM})}
      ${text(530,20,'set',{bold:true,color:MG})}<circle cx="530" cy="50" r="26" fill="none" stroke="${MG}"/>${text(530,50,'{1,2,3}',{size:11})}${text(530,90,'unique; O(1) "in"',{size:10,color:DIM})}
      ${text(300,150,'Big-O: O(1) flat · O(log n) halving · O(n) line · O(n²) nested loops = the cliff',{size:11,color:AM})}`,'List, tuple, dict and set with their access costs')}];
  I.p4m5=[{cap:"Read a traceback from the bottom: the last line names the error; the deepest frame in your own code is where to look.",
    svg:svg(520,130,`${box(20,15,480,100,'',{fill:'#070f1c',stroke:DIM})}${text(40,32,'Traceback (most recent call last):',{anchor:'start',mono:true,size:11,color:DIM})}${text(60,50,'File "app.py", line 12, in main    ← your code: look here',{anchor:'start',mono:true,size:11,color:AM})}${text(60,68,'File "lib.py", line 88, in parse     (library)',{anchor:'start',mono:true,size:11,color:DIM})}
      ${text(40,96,"KeyError: 'email'      ← read this FIRST: type + value",{anchor:'start',mono:true,size:11,color:MG,bold:true})}`,'Anatomy of a Python traceback')}];
  I.p4m6=[{cap:"Binary search halves the sorted range each step: a million items takes about 20 steps. Linear search would scan all of them.",
    svg:svg(520,130,`${[0,1,2,3,4,5,6,7].map(i=>box(30+i*58,20,54,30,String([2,5,8,12,16,23,38,56][i]),{size:12,stroke:i>=4?DIM:(i===2?LM:CY),color:i>=4?DIM:'currentColor'})).join('')}
      ${text(260,70,'target 8: check middle (12) → too big → discard right half → check 5 → check 8 ✓',{size:11,color:AM})}${text(260,100,'3 steps instead of up to 8 · O(log n)',{size:11,color:LM})}`,'Binary search on a sorted array')}];
  I.p4m7=[{cap:"A class is the blueprint; each object made from it has its own data. Tests check behavior so later changes can't silently break it.",
    svg:svg(540,150,`${box(20,30,150,80,'class Account\n  owner, balance\n  deposit()\n  withdraw()',{mono:true,size:11,stroke:CY})}${arrow(170,70,230,50,'new')}${arrow(170,70,230,100,'new')}
      ${box(230,30,120,38,'sam · $150',{size:11,stroke:LM})}${box(230,80,120,38,'ana · $40',{size:11,stroke:LM})}${box(400,45,120,50,'test_deposit()\nassert … == 150',{mono:true,size:10,stroke:AM})}${arrow(350,49,398,60,'')}`,'Class blueprint producing objects, with a unit test')}];

  /* ================= DOMAIN 5 ================= */
  I.p5m1=[{cap:"The render pipeline: HTML becomes the DOM tree, CSS becomes style rules, the browser lays out boxes and paints pixels. JavaScript edits the DOM and the browser repaints.",
    svg:flow([{t:'HTML',stroke:AM},{t:'DOM tree',edge:'parse'},{t:'+ CSS\n(CSSOM)',stroke:CY,edge:'style'},{t:'layout\n(boxes)',edge:''},{t:'paint\n(pixels)',stroke:LM,edge:''},{t:'JS edits\nDOM',stroke:MG,edge:'repaint ↺'}],{bw:84,bh:52,gap:28,label:'Browser render pipeline'})},
   {cap:"The DOM is a tree: html → body → header/main/footer → the elements inside. JavaScript walks and changes this tree.",
    svg:tree({t:'<html>',kids:[{t:'<head>',kids:['<title>','<link css>']},{t:'<body>',kids:['<header>','<main>','<footer>']}]},{three:true,label:'DOM tree'})}];
  I.p5m2=[{cap:"Div soup vs semantic HTML: the same page, but the right-hand version tells screen readers, search engines and other developers what each part is.",
    svg:compare({t:'div soup',draw:x=>['<div class="hdr">','<div class="nav">','<div class="main">','<div class="btn">'].map((t,i)=>box(x+40,40+i*28,180,22,t,{mono:true,size:10,stroke:DIM})).join('')},{t:'semantic',draw:x=>['<header>','<nav>','<main>','<button>'].map((t,i)=>box(x+40,40+i*28,180,22,t,{mono:true,size:10,stroke:LM})).join('')},{h:165,label:'Generic divs versus semantic elements'})}];
  I.p5m3=[{cap:"The CSS box model, inside out: content, padding, border, margin. With box-sizing: border-box, the width you set includes padding and border.",
    svg:svg(420,220,`${box(20,20,380,180,'',{dash:true,stroke:DIM})}${text(60,34,'margin',{anchor:'start',size:11,color:DIM})}
      ${box(60,50,300,120,'',{stroke:MG,sw:3})}${text(90,64,'border',{anchor:'start',size:11,color:MG})}
      ${box(90,75,240,70,'',{stroke:AM})}${text(120,88,'padding',{anchor:'start',size:11,color:AM})}
      ${box(120,100,180,30,'content',{stroke:CY,fill:'#06303d',color:CY})}`,'CSS box model layers')}];
  I.p5m4=[{cap:"Flexbox arranges items in one direction; grid places them in rows and columns. A responsive grid wraps as the screen narrows.",
    svg:compare({t:'flexbox · one row',draw:x=>[0,1,2].map(i=>box(x+30+i*75,50,65,40,'item',{size:11,stroke:CY})).join('')+text(x+130,125,'justify-content · align-items · gap',{size:10,color:DIM})},{t:'grid · rows + columns',draw:x=>[0,1,2,3,4,5].map(i=>box(x+30+(i%3)*75,40+Math.floor(i/3)*48,65,40,'cell',{size:11,stroke:MG})).join('')+text(x+130,150,'repeat(auto-fill, minmax(200px,1fr))',{size:10,color:DIM,mono:true})},{h:170,label:'Flexbox row versus CSS grid'})}];
  I.p5m5=[{cap:"The everyday JavaScript pipeline: filter keeps the items you want, map transforms each one into what you'll display.",
    svg:flow([{t:'products\n[{…},{…},{…}]'},{t:'.filter(\np => p.price < 20)',stroke:AM,edge:''},{t:'[cheap items]',edge:'→'},{t:'.map(\np => p.name)',stroke:CY,edge:''},{t:'["Pen","Tape"]',stroke:LM,edge:'→'}],{bw:104,bh:56,gap:26,label:'filter then map on an array'})}];
  I.p5m6=[{cap:"The front-end loop: an event fires, your code fetches JSON from a server, shapes it, and renders it into the DOM — without freezing the page while waiting.",
    svg:cycle(['click / input\nevent','fetch(url)\n(async)','await .json()','map → DOM\nnodes','page updates'],{label:'Event, fetch, render loop'})}];
  I.p5m7=[{cap:"From your editor to the world: commit to GitHub, a host builds and deploys it to a CDN, and every push updates the live site.",
    svg:flow([{t:'your code\nHTML/CSS/JS'},{t:'git push',stroke:AM,edge:''},{t:'GitHub repo',edge:''},{t:'Netlify /\nPages build',stroke:CY,edge:'auto'},{t:'CDN · live URL',stroke:LM,edge:''}],{bw:96,bh:52,gap:30,label:'Static site deployment pipeline'})}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
  window.ILLUS_KIT={svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM};
})();
