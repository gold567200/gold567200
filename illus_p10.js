/* Illustrations — Domain 10: Wireless, Pi & Hardware Hacking (upgrade, October 2026).
   Concatenates new figures onto the originals in illus_more.js; never replaces them. Numbers match the lectures' worked examples. */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const E=window.ILLUS||{}; const I={};
  const f1=v=>(+v).toFixed(1);
  const poly=(pts,o={})=>'<polyline points="'+pts.map(p=>f1(p[0])+','+f1(p[1])).join(' ')+'" fill="none" stroke="'+(o.stroke||'currentColor')+'" stroke-width="'+(o.sw==null?1.6:o.sw)+'"'+(o.dash?' stroke-dasharray="5 4"':'')+' stroke-linejoin="round"/>';
  const shade=(x,y,w,h,c,op)=>'<rect x="'+f1(x)+'" y="'+f1(y)+'" width="'+f1(Math.max(0,w))+'" height="'+f1(Math.max(0,h))+'" rx="2" fill="'+c+'" fill-opacity="'+(op==null?0.25:op)+'" stroke="none"/>';
  const rect=(x,y,w,h,c,o={})=>'<rect x="'+f1(x)+'" y="'+f1(y)+'" width="'+f1(Math.max(0,w))+'" height="'+f1(Math.max(0,h))+'" rx="'+(o.rx==null?2:o.rx)+'" fill="none" stroke="'+c+'" stroke-width="'+(o.sw||1.3)+'"'+(o.dash?' stroke-dasharray="5 4"':'')+'/>';
  const dot=(x,y,c,r)=>'<circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="'+(r||4)+'" fill="'+(c||CY)+'"/>';
  const ell=(cx,cy,rx,ry,c,o={})=>'<ellipse cx="'+f1(cx)+'" cy="'+f1(cy)+'" rx="'+f1(rx)+'" ry="'+f1(ry)+'" fill="'+(o.fill||'none')+'"'+(o.op!=null?' fill-opacity="'+o.op+'"':'')+' stroke="'+c+'" stroke-width="'+(o.sw||1.4)+'"'+(o.dash?' stroke-dasharray="5 4"':'')+'/>';
  const path=(d,c,o={})=>'<path d="'+d+'" fill="'+(o.fill||'none')+'"'+(o.op!=null?' fill-opacity="'+o.op+'"':'')+' stroke="'+c+'" stroke-width="'+(o.sw||1.4)+'"'+(o.dash?' stroke-dasharray="4 3"':'')+'/>';

  /* ================= Module 1: spectrum, link budget, Fresnel ================= */
  I.p10m1=(E.p10m1||[]).concat([
   {cap:"A link budget is a staircase of gains and losses. The lecture's example: 20 dBm transmitter, −1 dB inside the AP, +4 dBi antenna (23 dBm EIRP), −73 dB of free space over 20 m at 5.5 GHz, −10 dB for two walls, arriving at −60 dBm. The noise floor of a 20 MHz channel with a 7 dB noise figure is −94 dBm, so the SNR is 34 dB — enough for 1024-QAM.",
    svg:svg(560,236,(()=>{
      const Y=d=>22+(30-d)*1.4; let s='';
      [[20,'+20'],[-20,'−20'],[-60,'−60'],[-100,'−100']].forEach(([d,t])=>{ s+=line(40,Y(d),46,Y(d),{stroke:DIM})+text(36,Y(d),t,{size:9,color:DIM,anchor:'end'}); });
      s+=line(46,Y(30),46,Y(-100),{stroke:DIM})+text(8,14,'dBm',{size:9,color:DIM,anchor:'start'});
      s+=poly([[56,Y(20)],[110,Y(20)],[110,Y(19)],[160,Y(19)],[160,Y(23)],[225,Y(23)],[345,Y(-50.2)],[400,Y(-50.2)],[400,Y(-60.2)],[470,Y(-60.2)]],{stroke:CY,sw:2.2});
      s+=text(83,Y(20)-10,'TX 20',{size:10,color:CY})+text(135,Y(19)+12,'−1 loss',{size:10,color:DIM})+text(192,Y(23)-10,'+4 dBi',{size:10,color:LM});
      s+=text(192,Y(23)+14,'EIRP 23',{size:10,color:LM,bold:true});
      s+=text(318,Y(-14),'free space −73',{size:10,color:MG,anchor:'start'})+text(328,Y(-14)+13,'20 m, 5.5 GHz',{size:9,color:DIM,anchor:'start'});
      s+=text(372,Y(-50.2)-10,'2 walls −10',{size:10,color:AM});
      s+=text(435,Y(-60.2)-10,'RX −60 dBm',{size:10,color:CY,bold:true});
      s+=line(56,Y(-94),548,Y(-94),{stroke:MG,dash:true})+text(60,Y(-94)+13,'noise floor −94 dBm (−174 + 73 + 7)',{size:10,color:MG,anchor:'start'});
      s+=arrow(505,Y(-60.2)+2,505,Y(-94)-2,'')+arrow(505,Y(-94)-2,505,Y(-60.2)+2,'')+text(512,Y(-77),'SNR',{size:10,color:LM,anchor:'start',bold:true})+text(512,Y(-77)+13,'34 dB',{size:10,color:LM,anchor:'start',bold:true});
      return s; })(),'Level diagram of a Wi-Fi link budget from transmitter to receiver, compared with the noise floor')},
   {cap:"Line of sight is not enough. The radio path occupies a football-shaped first Fresnel zone whose midpoint radius is about 8.66 × √(D/f) metres (D in km, f in GHz): 5.6 m for a 1 km link at 2.4 GHz. Keep at least 60% of it clear; a tree that pokes into that inner region costs several dB even though you can see the far antenna.",
    svg:svg(560,206,(()=>{
      let s=line(10,176,550,176,{stroke:DIM})+line(50,176,50,84,{sw:2})+line(510,176,510,84,{sw:2});
      s+=dot(50,84,CY,5)+dot(510,84,CY,5)+line(50,84,510,84,{stroke:CY,dash:true});
      s+=ell(280,84,230,46,CY,{fill:CY,op:0.08})+ell(280,84,230,28,LM,{dash:true});
      s+=path('M296 176 L296 150 M280 150 Q296 60 312 150 Z',AM,{sw:1.6});
      s+=text(280,28,'first Fresnel zone (r ≈ 5.6 m at 1 km, 2.4 GHz)',{size:10,color:CY});
      s+=text(155,84+9,'60% must stay clear',{size:10,color:LM});
      s+=text(390,140,'tree enters the 60% zone',{size:10,color:AM})+text(390,154,'→ several dB lost',{size:10,color:AM});
      s+=text(280,194,'r = 8.66 × √(D km ÷ f GHz) m at the midpoint',{size:10,color:DIM});
      s+=text(50,64,'A',{size:11,bold:true})+text(510,64,'B',{size:11,bold:true});
      return s; })(),'Two antennas with the first Fresnel zone drawn between them and a tree intruding into it')}
  ]);

  /* ================= Module 2: joining, airtime, segmentation ================= */
  const lad=(W,H,L,R,msgs,extra,label,xl,xr)=>svg(W,H,
    text(xl,16,L,{bold:true,color:CY})+text(xr,16,R,{bold:true,color:MG})+line(xl,26,xl,H-8,{dash:true,stroke:DIM})+line(xr,26,xr,H-8,{dash:true,stroke:DIM})+
    msgs.map(m=>{ const y1=m.y, y2=m.y+8; const a=m.d==='r'?xl:xr, b=m.d==='r'?xr:xl; if(m.d==='b') return line(xl,y1+4,xr,y1+4,{stroke:LM,sw:2.4})+text((xl+xr)/2,y1-6,m.t,{size:10,color:LM,bold:true}); return arrow(a,y1,b,y2,m.t,{color:m.c||DIM,stroke:m.s||'currentColor'}); }).join('')+(extra||''),label);
  I.p10m2=(E.p10m2||[]).concat([
   {cap:"Joining a WPA3-Personal network. Discovery uses beacons and probes; the SAE commit and confirm exchange happens in the authentication frames, before association, so every password guess needs a live exchange with the AP; the 4-way handshake then installs the keys, and only after message 4 does protected data flow. With WPA2 the authentication step is an empty formality; with 802.1X an EAP exchange with RADIUS sits between association and the 4-way handshake.",
    svg:lad(560,350,'client (STA)','access point',[
      {y:36,d:'l',t:'beacon: SSID, RSN = SAE'},{y:58,d:'r',t:'probe request'},{y:80,d:'l',t:'probe response'},
      {y:108,d:'r',t:'auth: SAE commit',s:CY},{y:130,d:'l',t:'auth: SAE commit',s:CY},{y:152,d:'r',t:'auth: SAE confirm',s:CY},{y:174,d:'l',t:'auth: SAE confirm',s:CY},
      {y:200,d:'r',t:'association request'},{y:222,d:'l',t:'association response'},
      {y:248,d:'l',t:'4-way M1 (ANonce)',s:AM},{y:268,d:'r',t:'M2 (SNonce, MIC)',s:AM},{y:288,d:'l',t:'M3 (group key)',s:AM},{y:306,d:'r',t:'M4',s:AM},
      {y:334,d:'b',t:'protected data (CCMP / GCMP)'}],
      text(40,62,'discover',{size:9,color:DIM})+text(40,142,'SAE',{size:9,color:CY,bold:true})+text(40,212,'associate',{size:9,color:DIM})+text(40,278,'keys',{size:9,color:AM,bold:true})+text(520,142,'PAKE:',{size:9,color:CY})+text(520,154,'no offline',{size:9,color:CY})+text(520,166,'guessing',{size:9,color:CY}),
      'Sequence of frames between a client and an access point when joining a WPA3 network',90,470)},
   {cap:"Airtime, not bits, is what clients share. The same 1,500-byte frame occupies 2 ms at 6 Mb/s, 222 µs at 54 Mb/s and 20 µs at 600 Mb/s (bars to scale), so one slow client can use the channel a hundred fast ones need. Beacons are a hidden tax: a 300-byte beacon at 1 Mb/s every 102.4 ms is 2.5% of airtime, and 15 beacon sources (5 SSIDs × 3 APs heard) take about 38%.",
    svg:svg(560,214,(()=>{
      let s=text(10,18,'one 1,500-byte frame (12,000 bits):',{size:11,anchor:'start',bold:true});
      const rows=[['6 Mb/s',2000,MG,'2,000 µs'],['54 Mb/s',222,AM,'222 µs'],['600 Mb/s',20,LM,'20 µs']];
      rows.forEach(([lab,us,c,t],i)=>{ const y=34+i*30, w=Math.max(3,us*0.19); s+=text(80,y+10,lab,{size:10,anchor:'end'})+shade(88,y,w,20,c,0.45)+rect(88,y,w,20,c)+text(Math.min(96+w,470),y+10,t,{size:10,color:c,anchor:'start'}); });
      s+=line(10,132,550,132,{stroke:DIM,dash:true});
      s+=text(10,150,'beacon tax per 102.4 ms interval, at 1 Mb/s:',{size:11,anchor:'start',bold:true});
      s+=rect(88,162,440,22,DIM)+shade(88,162,440*0.38,22,MG,0.4)+text(80,173,'15 SSID×AP',{size:10,anchor:'end'})+text(88+440*0.19,173,'≈ 38% beacons',{size:10,color:MG,bold:true})+text(88+440*0.69,173,'left for data',{size:10,color:DIM});
      s+=text(280,202,'fix: drop 1–11 Mb/s rates, basic rate 12–24 Mb/s, ≤ 3 SSIDs',{size:10,color:LM});
      return s; })(),'Bars comparing the airtime of one frame at three data rates, and the share of airtime taken by beacons')},
   {cap:"Segmentation as a rule table: rows are who starts a connection, columns where it goes. Staff may reach everything; IoT may reach the internet and local DNS but never start a connection into Staff; Guest reaches only the internet. Stateful replies return automatically, an mDNS reflector handles casting, and 802.1X/RADIUS can place each user or device in the right VLAN.",
    svg:svg(560,206,(()=>{
      const cols=['internet','Staff VLAN 10','IoT VLAN 20','Pi: DNS, RADIUS'], rows=[['Staff · WPA3-Enterprise',CY,['✓','✓','✓','✓']],['IoT · private PSK',AM,['✓','✗','isolate','DNS only']],['Guest · Enhanced Open',MG,['✓','✗','✗','DNS only']]];
      let s=text(90,22,'from ↓   to →',{size:10,color:DIM});
      cols.forEach((c,i)=>{ s+=box(184+i*92,8,88,30,c,{size:10,stroke:DIM}); });
      rows.forEach(([r,c,cells],j)=>{ const y=46+j*46; s+=box(8,y,170,40,r,{size:10,stroke:c,bold:true});
        cells.forEach((v,i)=>{ const ok=v==='✓', no=v==='✗'; s+=box(184+i*92,y,88,40,v,{size:ok||no?16:10,stroke:ok?LM:(no?MG:AM),color:ok?LM:(no?MG:AM),bold:ok||no}); }); });
      s+=text(280,196,'stateful: replies to allowed flows return; everything else is denied',{size:10,color:DIM});
      return s; })(),'Firewall rule matrix between staff, IoT and guest VLANs and shared services')}
  ]);

  /* ================= Module 3: BLE channels, battery ================= */
  I.p10m3=(E.p10m3||[]).concat([
   {cap:"Why BLE discovery survives busy Wi-Fi: the three advertising channels (37, 38, 39 at 2,402, 2,426 and 2,480 MHz, magenta) sit outside the cores of Wi-Fi channels 1, 6 and 11 (cyan humps). The other 37 BLE data channels (grey ticks) are hopped with an adaptive map that drops channels found busy.",
    svg:svg(560,190,(()=>{
      const X=f=>20+(f-2400)*6.3; let s=line(14,150,550,150,{stroke:DIM});
      [2412,2437,2462].forEach((f,i)=>{ s+=path('M'+f1(X(f-11))+' 150 C'+f1(X(f-7))+' 60 '+f1(X(f+7))+' 60 '+f1(X(f+11))+' 150',CY,{fill:CY,op:0.15,sw:1.5})+text(X(f),52,'Wi-Fi '+[1,6,11][i],{size:10,color:CY}); });
      for(let k=0;k<40;k++){ const f=2402+2*k; if(f===2402||f===2426||f===2480) continue; s+=line(X(f),150,X(f),140,{stroke:DIM}); }
      [[2402,'37'],[2426,'38'],[2480,'39']].forEach(([f,t])=>{ s+=shade(X(f)-4,40,8,110,MG,0.55)+text(X(f),30,t,{size:11,color:MG,bold:true}); });
      [2400,2420,2440,2460,2480].forEach(f=>{ s+=line(X(f),150,X(f),155)+text(X(f),167,String(f),{size:9,color:DIM}); });
      s+=text(280,184,'MHz · magenta = BLE advertising channels · grey = BLE data channels',{size:9,color:DIM});
      return s; })(),'Spectrum plot of BLE advertising channels placed between Wi-Fi channels 1, 6 and 11')},
   {cap:"The advertising interval is the battery knob. Each event costs about 15 µC and the chip sleeps at 2 µA. Once a second averages 17 µA, about 1.5 years on a 225 mAh CR2032; every 100 ms averages 152 µA, about 62 days. Same chip, same firmware, one parameter.",
    svg:svg(560,206,(()=>{
      let s='';
      const row=(y,n,lab,c,res)=>{ let t=text(10,y-28,lab,{size:11,anchor:'start',bold:true,color:c})+line(10,y,400,y,{stroke:DIM}); for(let i=0;i<n;i++){ const x=20+i*(380/n); t+=shade(x,y-22,4,22,c,0.7); } return t+text(410,y-14,res[0],{size:10,anchor:'start',color:c,bold:true})+text(410,y,res[1],{size:10,anchor:'start',color:DIM}); };
      s+=row(70,2,'interval 1 s (2 events in 2 s)',LM,['avg 17 µA','≈ 1.5 years']);
      s+=row(150,20,'interval 100 ms (20 events in 2 s)',MG,['avg 152 µA','≈ 62 days']);
      s+=text(280,186,'I avg = sleep + charge per event × events per second',{size:10,color:DIM});
      s+=text(280,200,'225 mAh ÷ 0.017 mA ≈ 13,000 h · 225 ÷ 0.152 ≈ 1,480 h',{size:10,color:DIM});
      return s; })(),'Two timelines of BLE advertising events at different intervals with the resulting battery life')}
  ]);

  /* ================= Module 4: Pi 5 architecture, boot chain ================= */
  I.p10m4=(E.p10m4||[]).concat([
   {cap:"Inside a Raspberry Pi 5: the BCM2712 system-on-chip does the computing (four Cortex-A76 cores, VideoCore VII GPU, LPDDR4X controller, HDMI and the SD card), while Raspberry Pi's own RP1 chip, reached over a four-lane PCIe 2.0 link, runs almost all the slow I/O — GPIO, USB, the Ethernet MAC, cameras and displays. A separate single PCIe lane goes to the FFC connector for NVMe or AI HATs.",
    svg:svg(560,236,(()=>{
      let s=box(170,20,200,92,'',{stroke:CY,sw:1.8})+text(270,36,'BCM2712 SoC',{bold:true,color:CY})+text(270,56,'4 × Cortex-A76 @ 2.4 GHz',{size:10})+text(270,72,'VideoCore VII GPU',{size:10})+text(270,88,'L2 512 KB/core · L3 2 MB',{size:10,color:DIM});
      s+=box(10,30,120,34,'LPDDR4X\n1–16 GB',{size:10,stroke:DIM})+arrow(132,47,168,47,'')+arrow(168,51,132,51,'');
      s+=box(10,78,120,30,'HDMI ×2 · microSD',{size:10,stroke:DIM})+line(130,93,170,93);
      s+=box(410,30,140,40,'PCIe ×1 FFC\nNVMe · AI HAT',{size:10,stroke:MG})+arrow(372,50,408,50,'',{stroke:MG});
      s+=arrow(270,114,270,146,'PCIe 2.0 ×4',{color:AM,stroke:AM});
      s+=box(170,148,200,40,'RP1 I/O controller',{stroke:AM,bold:true,sw:1.8});
      const io=['40-pin GPIO','USB 3 ×2 · USB 2 ×2','Ethernet MAC','MIPI CSI/DSI ×2','UART · SPI · I2C'];
      io.forEach((t,i)=>{ const x=8+i*110; s+=box(x,206,104,24,t,{size:9,stroke:DIM})+line(270,188,x+52,206,{stroke:DIM}); });
      s+=text(470,118,'PMIC: 5 V/5 A in',{size:9,color:DIM})+text(470,130,'vcgencmd pmic_read_adc',{size:9,color:DIM,mono:true});
      return s; })(),'Block diagram of the Raspberry Pi 5 SoC, RP1 I/O chip, memory and interfaces')},
   {cap:"The boot chain has no BIOS: ROM in the SoC loads the EEPROM bootloader, which walks BOOT_ORDER (read right to left; 0xf416 = NVMe, SD, USB, restart), reads config.txt and the device tree with its overlays, loads the kernel and cmdline.txt, and hands over to systemd. On a Pi 5 the GPU firmware lives in the EEPROM, so there are no start.elf files.",
    svg:flow([{t:'boot ROM\n(in the SoC)',stroke:DIM},{t:'EEPROM\nbootloader',stroke:CY,edge:'SPI'},{t:'BOOT_ORDER\n6 · 1 · 4 · f',stroke:AM,edge:'read'},{t:'config.txt\n+ device tree',stroke:AM,edge:'FAT'},{t:'kernel_2712\n+ cmdline.txt',stroke:CY,edge:'load'},{t:'systemd\nPID 1',stroke:LM,edge:'init'},{t:'your services\n(units)',stroke:LM,edge:'start'}],{bw:106,bh:50,gap:32,perRow:4,label:'Raspberry Pi 5 boot chain from ROM to services'})}
  ]);

  /* ================= Module 5: SDR chain, legal lines ================= */
  I.p10m5=(E.p10m5||[]).concat([
   {cap:"A software-defined receiver: the R828D tuner amplifies and mixes a slice of spectrum down, an 8-bit ADC samples it about 2.4 million times a second as IQ pairs (4.8 MB/s over USB), and everything after that is math — FFT for the waterfall, demodulation (AM from magnitude, FM from phase) and decoders for ADS-B or satellite images. Complex sampling at 2.4 MS/s shows a 2.4 MHz window.",
    svg:flow([{t:'antenna\n¼ λ = 6.9 cm',stroke:DIM},{t:'tuner R828D\nLNA + mixer',stroke:CY,edge:'RF'},{t:'8-bit ADC\n2.4 MS/s IQ',stroke:AM,edge:'IF'},{t:'USB 2.0\n4.8 MB/s',stroke:DIM,edge:'IQ'},{t:'FFT\nwaterfall',stroke:LM,edge:'samples'},{t:'demodulate\nAM · FM · PPM',stroke:CY,edge:'tune'},{t:'decode\nADS-B · LRPT',stroke:LM,edge:'bits'}],{bw:106,bh:52,gap:32,perRow:4,label:'Software-defined radio receive chain from antenna to decoder'})},
   {cap:"Where the legal lines are. Receiving public broadcasts and position reports is lawful; intercepting or disclosing private communications is a crime even with a receive-only dongle (ECPA, 47 U.S.C. 605); and transmitting needs an FCC-authorized Part 15 device within its limits, or an amateur license on amateur bands.",
    svg:compare({t:'LAWFUL TO RECEIVE',draw:x=>[['FM + RDS','88–108 MHz'],['airband voice (AM)','118–137 MHz'],['Meteor-M LRPT','≈137.1 / 137.9 MHz'],['NOAA Weather Radio','162.40–162.55 MHz'],['ADS-B aircraft','1,090 MHz'],['hydrogen line','1,420.4 MHz']].map(([a,b],i)=>text(x+14,52+i*21,a,{anchor:'start',size:10,color:LM})+text(x+246,52+i*21,b,{anchor:'end',size:10,color:DIM})).join('')},
      {t:'OFF-LIMITS / LICENSED',draw:x=>[['intercept cell or cordless calls','ECPA',MG],['decrypt private data','§ 605',MG],['divulge or use contents','§ 605',MG],['jam any signal','§ 333',MG],['transmit: Part 15 device','FCC ID',AM],['or ham license, ham bands','Part 97',AM]].map(([a,b,c],i)=>text(x+14,52+i*21,a,{anchor:'start',size:10,color:c})+text(x+246,52+i*21,b,{anchor:'end',size:10,color:DIM})).join('')},{h:190,label:'Comparison of lawful receive-only targets and off-limits or licensed activities'})}
  ]);

  /* ================= Module 6: battery path, USB-PD ================= */
  I.p10m6=(E.p10m6||[]).concat([
   {cap:"A deck's power path, worked: a 3S2P pack of 3.0 Ah 18650 cells (10.8 V × 6 Ah = 64.8 Wh) through its BMS and a 5 A fuse, a 90%-efficient buck converter set to 5.1 V at 5 A, and short 18 AWG leads to the Pi. Stopping at a safe 3.0 V per cell leaves about 52 Wh, so a measured 12 W load runs about 4.3 hours.",
    svg:svg(560,190,(()=>{
      let s='';
      const B=[['3S2P 18650\n10.8 V · 64.8 Wh',AM],['BMS\n+ 5 A fuse',MG],['buck 5.1 V\n5 A · 90%',CY],['18 AWG, 30 cm\n≈ 0.06 V drop',DIM],['Pi 5 + screen\n12 W measured',LM]];
      B.forEach(([t,c],i)=>{ const x=6+i*112; s+=box(x,30,100,54,t,{size:10,stroke:c}); if(i<4) s+=arrow(x+101,57,x+111,57,''); });
      s+=text(280,112,'64.8 Wh × 0.9 converter ≈ 58 Wh at 5.1 V',{size:11});
      s+=text(280,132,'stop at 3.0 V/cell → ≈ 52 Wh usable',{size:11});
      s+=text(280,154,'52 Wh ÷ 12 W ≈ 4.3 hours',{size:12,bold:true,color:LM});
      s+=text(280,178,'pack current at 25 W out, 9 V pack: 25 ÷ 0.9 ÷ 9 ≈ 3.1 A',{size:10,color:DIM});
      return s; })(),'Power path from battery pack through protection and converter to the Pi with runtime arithmetic')},
   {cap:"The USB-PD trap. The official 27 W supply offers a special 5.1 V × 5 A profile, so the Pi 5 allows 1.6 A to its USB ports. A typical power bank's standard profiles stop at 5 V × 3 A, so the Pi warns and caps USB at 600 mA — fine for a keyboard, not for a USB SSD. Use NVMe on PCIe, a 5 A converter or a Pi 5 UPS HAT.",
    svg:compare({t:'OFFICIAL 27 W SUPPLY',draw:x=>[['offers 5.1 V × 5 A',LM],['USB budget: 1.6 A',LM],['SSD + Wi-Fi dongle OK',LM],['no supply warning',DIM]].map(([t,c],i)=>text(x+130,58+i*26,t,{size:11,color:c})).join('')},
      {t:'TYPICAL PD POWER BANK',draw:x=>[['5 V × 3 A max at 5 V',AM],['USB budget: 600 mA',MG],['USB SSD browns out',MG],['supply warning at boot',DIM]].map(([t,c],i)=>text(x+130,58+i*26,t,{size:11,color:c})).join('')},{h:170,label:'Comparison of the Pi 5 on the official supply and on a typical power bank'})}
  ]);

  /* ================= Module 7: I2C timing, UART frame, driver circuits ================= */
  I.p10m7=(E.p10m7||[]).concat([
   {cap:"An I2C write to address 0x76 as a timing diagram. START: SDA falls while SCL is high. Each bit is set while SCL is low and read while it is high: seven address bits (1110110), then R/W = 0 for write, then the ninth clock where the sensor pulls SDA low to ACK. STOP: SDA rises while SCL is high. Both lines idle high through the pull-ups.",
    svg:svg(560,206,(()=>{
      const bw=46, x0=72, hiC=40, loC=70, hiD=116, loD=146; let scl=[[40,hiC],[x0,hiC],[x0,loC]], sda=[[40,hiD],[56,hiD],[56,loD]];
      const bits=[1,1,1,0,1,1,0,0,0]; let lv=0;
      bits.forEach((b,i)=>{ const x=x0+i*bw; scl.push([x+12,loC],[x+12,hiC],[x+36,hiC],[x+36,loC],[x+bw,loC]);
        const yv=b?hiD:loD; sda.push([x+4,lv?hiD:loD],[x+4,yv]); lv=b; sda.push([x+bw,yv]); });
      const xe=x0+9*bw; scl.push([xe+10,loC],[xe+10,hiC],[548,hiC]); sda.push([xe+2,lv?hiD:loD],[xe+2,loD],[xe+26,loD],[xe+26,hiD],[548,hiD]);
      let s=text(20,55,'SCL',{size:10,bold:true,color:CY})+text(20,131,'SDA',{size:10,bold:true,color:AM})+poly(scl,{stroke:CY,sw:1.8})+poly(sda,{stroke:AM,sw:1.8});
      s+=text(56,20,'START',{size:10,color:LM,bold:true})+text(xe+20,20,'STOP',{size:10,color:LM,bold:true});
      ['1','1','1','0','1','1','0','W=0','ACK'].forEach((t,i)=>{ s+=text(x0+i*bw+24,168,t,{size:10,color:i<7?AM:(i===7?DIM:LM),bold:i===8}); });
      s+=line(x0+4,180,x0+7*bw-4,180,{stroke:DIM})+text(x0+3.5*bw,194,'7-bit address 0x76',{size:10,color:DIM})+text(x0+8*bw+24,194,'sensor',{size:9,color:LM})+text(x0+7*bw+24,194,'write',{size:9,color:DIM});
      return s; })(),'I2C timing diagram showing start condition, seven address bits, write bit, acknowledge and stop')},
   {cap:"One UART byte, 8N1: the line idles high, a start bit pulls it low, eight data bits follow least-significant first (here 'A' = 0x41 = 01000001, sent 1,0,0,0,0,0,1,0), and a stop bit returns it high. Ten bits per byte: at 115,200 baud each bit is 8.68 µs, each byte 86.8 µs, so 11,520 bytes per second. The receiver samples mid-bit, which is why both clocks must agree within a few percent.",
    svg:svg(560,190,(()=>{
      const bw=46, x0=40, hi=50, lo=100; const bits=[0,1,0,0,0,0,0,1,0,1]; let pts=[[8,hi],[x0,hi]], lv=1;
      bits.forEach((b,i)=>{ const x=x0+i*bw, y=b?hi:lo; pts.push([x,lv?hi:lo],[x,y],[x+bw,y]); lv=b; }); pts.push([x0+10*bw,hi],[552,hi]);
      let s=poly(pts,{stroke:CY,sw:2});
      const lab=['start','D0','D1','D2','D3','D4','D5','D6','D7','stop'];
      lab.forEach((t,i)=>{ const x=x0+i*bw; s+=line(x,40,x,110,{stroke:DIM,dash:true})+text(x+bw/2,124,t,{size:10,color:i===0||i===9?AM:DIM,bold:i===0||i===9})+(i>0&&i<9?text(x+bw/2,30,String(bits[i]),{size:11,color:LM,bold:true}):'')+dot(x+bw/2,(bits[i]?hi:lo),MG,2.5); });
      s+=text(20,62,'idle',{size:9,color:DIM});
      s+=text(280,150,"'A' = 0x41 sent LSB first · magenta dots = mid-bit samples",{size:10,color:DIM});
      s+=text(280,172,'115,200 baud: 8.68 µs/bit · 86.8 µs/byte · 11,520 B/s',{size:11,color:AM});
      return s; })(),'UART 8N1 waveform for one byte with start bit, eight data bits and stop bit')},
   {cap:"Two drivers from the lecture. Left: an LED straight from a 3.3 V pin needs a series resistor, (3.3 − 2.0) ÷ 180 Ω = 7.2 mA, under the 16 mA pin limit. Right: a 70 mA relay coil is far beyond a pin, so the GPIO drives an NPN transistor through 680 Ω (about 3.8 mA of base current) and a flyback diode across the coil absorbs the turn-off spike.",
    svg:compare({t:'LED FROM A GPIO',draw:x=>{ const zz=(x1,y,n)=>{ let d='M'+x1+' '+y; for(let i=0;i<n;i++) d+=' l5 '+(i%2?7:-7); return d+' l5 0'; };
        return box(x+20,46,64,26,'GPIO 27',{size:10,stroke:CY})+line(x+84,59,x+104,59)+path(zz(x+104,59,6),AM,{sw:1.6})+text(x+124,44,'180 Ω',{size:10,color:AM})+line(x+139,59,x+160,59)
          +path('M'+(x+160)+' 49 L'+(x+160)+' 69 L'+(x+178)+' 59 Z',LM,{fill:LM,op:0.35,sw:1.4})+line(x+178,49,x+178,69,{stroke:LM,sw:1.6})+line(x+178,59,x+200,59)+line(x+200,59,x+200,96)+line(x+190,96,x+210,96)+line(x+194,100,x+206,100)+text(x+226,98,'GND',{size:9,color:DIM})
          +text(x+130,122,'R = (3.3 − 2.0) ÷ 0.008 ≈ 162 Ω',{size:10})+text(x+130,140,'→ 180 Ω gives 7.2 mA',{size:10,color:LM,bold:true})+text(x+130,158,'limit 16 mA/pin, 50 mA total',{size:9,color:DIM}); }},
      {t:'RELAY VIA TRANSISTOR',draw:x=>box(x+150,46,70,34,'relay coil\n70 mA',{size:10,stroke:AM})+text(x+122,63,'+5 V',{size:9,color:DIM})+line(x+136,63,x+150,63)+line(x+220,52,x+238,52,{stroke:MG})+line(x+238,52,x+238,74,{stroke:MG})+line(x+220,74,x+238,74,{stroke:MG})+path('M'+(x+232)+' 67 L'+(x+244)+' 67 L'+(x+238)+' 59 Z',MG,{fill:MG,op:0.35})+text(x+240,88,'flyback',{size:9,color:MG})+line(x+185,80,x+185,95)+'<circle cx="'+(x+185)+'" cy="'+108+'" r="13" fill="none" stroke="currentColor" stroke-width="1.3"/>'+text(x+185,108,'NPN',{size:8})+line(x+185,121,x+185,140)+line(x+175,140,x+195,140)+text(x+214,142,'GND',{size:9,color:DIM})+box(x+12,95,58,26,'GPIO 17',{size:10,stroke:CY})+line(x+70,108,x+90,108)+rect(x+90,101,40,14,AM)+text(x+110,92,'680 Ω',{size:9,color:AM})+line(x+130,108,x+172,108)+text(x+130,158,'Ib = (3.3 − 0.7) ÷ 680 ≈ 3.8 mA',{size:10,color:LM,bold:true})},{h:176,label:'Two simplified circuits: an LED with a series resistor and a relay switched by a transistor with a flyback diode'})}
  ]);

  /* ================= Module 8: radio map, LoRaWAN, Matter stack ================= */
  I.p10m8=(E.p10m8||[]).concat([
   {cap:"The IoT radio map on log scales: range across, data rate up. Wi-Fi is fast and short; BLE, Zigbee/Thread and Z-Wave are slow, short and frugal (meshes extend their reach hop by hop); Wi-Fi HaLow reaches about a kilometre at megabits; LoRaWAN reaches kilometres at hundreds to thousands of bits per second; LTE-M and NB-IoT reach anywhere the carrier does, for a monthly fee.",
    svg:svg(560,262,(()=>{
      const X=r=>70+(Math.log10(r)-1)/3.3*460, Y=b=>230-(Math.log10(b)-2)/7*200; let s=line(70,230,550,230,{stroke:DIM})+line(70,230,70,20,{stroke:DIM});
      [[10,'10 m'],[100,'100 m'],[1000,'1 km'],[10000,'10 km']].forEach(([r,t])=>{ s+=line(X(r),230,X(r),234)+text(X(r),246,t,{size:9,color:DIM}); });
      [[1e3,'1 kb/s'],[1e6,'1 Mb/s'],[1e9,'1 Gb/s']].forEach(([b,t])=>{ s+=line(66,Y(b),70,Y(b))+text(62,Y(b),t,{size:9,color:DIM,anchor:'end'}); });
      const P=[['Wi-Fi',50,5e8,CY,'start'],['BLE',40,1e6,LM,'start'],['Zigbee / Thread',20,2.5e5,LM,'start'],['Z-Wave',60,1e5,LM,'start'],['Wi-Fi HaLow',1000,4e6,CY,'end'],['LTE-M',10000,1e6,AM,'end'],['NB-IoT',15000,3e4,AM,'end'],['LoRaWAN',5000,1e3,MG,'end']];
      P.forEach(([n,r,b,c,a])=>{ const x=X(r), y=Y(b); s+=dot(x,y,c,5)+text(a==='start'?x+9:x-9,y,n,{size:10,color:c,anchor:a,bold:true}); });
      s+=text(550,258,'typical range (log)',{size:9,color:DIM,anchor:'end'})+text(76,16,'data rate (log)',{size:9,color:DIM,anchor:'start'});
      return s; })(),'Log-log map of IoT radio technologies by typical range and data rate')},
   {cap:"LoRaWAN is a star of stars. Class A sensors transmit when they have data; every gateway that hears a packet forwards it over IP; the network server removes duplicates, runs adaptive data rate and checks frame counters; the application receives decrypted data over MQTT. Two AES-128 session keys separate network integrity from end-to-end application encryption.",
    svg:flow([{t:'sensors\nClass A, SF7–10',stroke:MG},{t:'gateways\nPi + SX1302 HAT',stroke:AM,edge:'radio'},{t:'network server\nChirpStack · ADR',stroke:CY,edge:'IP'},{t:'application\nMQTT · dashboard',stroke:LM,edge:'data'}],{bw:104,bh:56,gap:36,label:'LoRaWAN architecture from sensors to application'})},
   {cap:"Matter is an application layer, not a radio. It runs over IPv6 on Wi-Fi, Thread or Ethernet; Bluetooth LE is used only to commission a new device. A border router joins the Thread mesh (802.15.4 with 6LoWPAN compression) to the home LAN, so a Matter controller on Wi-Fi can reach a battery sensor on Thread, locally, with no cloud.",
    svg:svg(560,214,(()=>{
      let s=box(20,14,410,36,'Matter: device types, fabrics, local control',{stroke:LM,bold:true,size:11});
      s+=box(20,58,410,32,'IPv6 · UDP / TCP',{stroke:CY,size:11});
      s+=box(20,98,128,58,'Wi-Fi\n802.11',{stroke:CY,size:11})+box(161,98,128,58,'Thread\n802.15.4 + 6LoWPAN',{stroke:AM,size:10})+box(302,98,128,58,'Ethernet\n802.3',{stroke:CY,size:11});
      s+=box(444,14,108,76,'BLE\ncommissioning\nonly',{stroke:MG,size:10,dash:true})+arrow(444,52,432,52,'',{stroke:MG});
      s+=box(110,174,240,32,'border router: Thread ↔ LAN',{stroke:AM,size:10})+line(225,156,225,174,{stroke:AM})+line(84,156,140,174,{stroke:CY})+line(366,156,320,174,{stroke:CY});
      s+=text(498,120,'setup code',{size:9,color:DIM})+text(498,133,'→ SPAKE2+',{size:9,color:DIM})+text(498,146,'→ fabric cert',{size:9,color:DIM});
      return s; })(),'Layer diagram of Matter running over IPv6 on Wi-Fi, Thread and Ethernet, with BLE for commissioning and a border router')}
  ]);

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
