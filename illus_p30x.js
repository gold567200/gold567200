/* Third figures — Domain 30: Virtualization, Servers, Storage & the Home Lab. Adds to the figures in illus_p30.js (never replaces them). */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const add=(id,figs)=>{ window.ILLUS=window.ILLUS||{}; window.ILLUS[id]=(window.ILLUS[id]||[]).concat(figs); };

  /* m1 — ECC versus a flipped bit, and why ZFS cannot catch it */
  add('p30m1',[{cap:"Where a flipped memory bit goes. ECC stores 8 check bits with every 64 data bits, so the memory controller corrects a single flip and detects a double one, and the BMC logs it. Without ECC the flip happens before ZFS computes its checksum, so the corrupt block reaches the disk looking perfectly valid.",
    svg:svg(560,240,`${text(140,16,'WITHOUT ECC (desktop DIMM)',{bold:true,color:MG,size:11})}${text(420,16,'WITH ECC (72 bits per 64)',{bold:true,color:LM,size:11})}
      ${line(280,28,280,196,{dash:true,stroke:DIM})}
      ${box(30,32,220,34,'a bit flips in RAM',{size:11})}${arrow(140,66,140,94,'')}${text(148,80,'nothing checks it',{anchor:'start',size:10,color:DIM})}
      ${box(30,96,220,34,'ZFS checksums the wrong data',{size:11,stroke:AM})}${arrow(140,130,140,158,'')}${text(148,144,'written to disk',{anchor:'start',size:10,color:DIM})}
      ${box(30,160,220,34,'corrupt block, valid checksum',{size:11,stroke:MG,color:MG,bold:true})}
      ${box(310,32,220,34,'a bit flips in RAM',{size:11})}${arrow(420,66,420,94,'')}${text(428,80,'8 check bits tested',{anchor:'start',size:10,color:DIM})}
      ${box(310,96,220,34,'1 flip corrected · 2 detected',{size:11,stroke:LM})}${arrow(420,130,420,158,'')}${text(428,144,'BMC logs DIMM A3',{anchor:'start',size:10,color:DIM})}
      ${box(310,160,220,34,'correct data gets the checksum',{size:11,stroke:LM,color:LM,bold:true})}
      ${text(280,213,'ZFS protects disks; ECC protects RAM',{size:11,color:CY,bold:true})}
      ${text(280,229,'on-die DDR5 ECC: not a substitute',{size:10,color:DIM})}`,
      'Without ECC a RAM bit flip is checksummed and written as valid data; with ECC it is corrected or detected and logged')}]);

  /* m2 — a snapshot chain lives in the VM's own failure domain */
  add('p30m2',[{cap:"What a snapshot chain really is. Each copy-on-write snapshot freezes a layer; new writes land in the newest delta, and a read may have to walk back through every layer to find its block. All the layers sit in the same pool as the VM, so a snapshot is a return point measured in days, not a backup.",
    svg:svg(560,228,`${text(280,13,'SNAPSHOTS ARE RETURN POINTS, NOT BACKUPS',{bold:true,color:CY,size:11})}
      ${box(415,24,120,26,'running VM',{size:11,stroke:CY})}${arrow(475,50,475,90,'')}${text(467,55,'new writes',{anchor:'end',size:10,color:DIM})}
      ${box(15,64,530,116,'',{dash:true,stroke:DIM})}${text(25,78,'one ZFS / LVM pool = one failure domain',{anchor:'start',size:10,color:DIM})}
      ${box(30,92,110,40,'base disk\nfrozen',{size:11})}${box(165,92,100,40,'snapshot 1\nfrozen delta',{size:10})}${box(290,92,100,40,'snapshot 2\nfrozen delta',{size:10})}${box(415,92,120,40,'active delta\ntakes writes',{size:11,stroke:CY})}
      ${arrow(413,112,392,112,'')}${arrow(288,112,267,112,'')}${arrow(163,112,142,112,'')}
      ${arrow(530,156,40,156,'a read may walk every layer',{dash:true,dy:0})}
      ${text(280,196,'VMware: 2–3 deep, under 72 hours',{size:10,color:AM})}
      ${text(280,213,'dead pool: VM and snapshots lost',{size:10,color:MG,bold:true})}`,
      'A copy-on-write snapshot chain inside one storage pool: writes go to the newest delta, reads may traverse every layer, and the pool is one failure domain')}]);

  /* m3 — live migration with ZFS replication, step by step */
  add('p30m3',[{cap:"Live migration with ZFS replication, as in the worked example. The final disk delta goes first, then the VM's 4 GB of RAM is copied while it keeps running, dirtied pages are re-copied, and only the last few MB move during a pause of tens of milliseconds. Without a replica the whole disk must stream first, and mismatched CPU flags stop the VM from resuming.",
    svg:svg(560,240,`${text(280,14,'qm migrate 101 pve2 --online',{mono:true,color:CY,size:11})}
      ${box(20,28,330,24,'VM 101 running on pve1',{size:11,stroke:CY})}${box(352,28,40,24,'stun',{size:9,stroke:MG,color:MG})}${box(394,28,146,24,'running on pve2',{size:11,stroke:LM})}
      ${box(20,78,100,44,'send final\nZFS delta',{size:10})}${box(135,78,100,44,'copy 4 GB RAM\nwhile it runs',{size:10})}${box(250,78,100,44,'re-copy pages\nit dirtied',{size:10})}${box(365,78,80,44,'pause for\nlast few MB',{size:10,stroke:MG})}${box(460,78,80,44,'resume\non pve2',{size:10,stroke:LM})}
      ${arrow(121,100,133,100,'')}${arrow(236,100,248,100,'')}${arrow(351,100,363,100,'')}${arrow(446,100,458,100,'')}
      ${line(372,52,405,78,{dash:true,stroke:MG})}
      <path d="M300 122 Q 242 150 186 124" fill="none" stroke="currentColor" stroke-width="1.3" marker-end="url(#ah)"/>${text(243,150,'repeat until few pages left',{size:10,color:DIM})}
      ${box(20,166,255,42,'replicated every 15 min:\nstun of tens of ms',{size:10,stroke:LM})}${box(285,166,255,42,'no replica: whole disk streams\nfirst, taking minutes',{size:10,stroke:AM})}
      ${text(280,228,'CPU flags must match: use x86-64-v3',{size:10,color:DIM})}`,
      'Proxmox live migration steps: final ZFS delta, RAM copied while running, dirty pages re-copied, a brief pause, resume on the second node')}]);

  /* m4 — the RAID 5 rebuild arithmetic */
  add('p30m4',[{cap:"Why RAID 5 is considered dead for big disks. Rebuilding a 12 TB drive reads about 9.6 × 10¹³ bits; at one unrecoverable read error per 10¹⁴ bits that is 0.96 expected errors and a 62% chance of at least one (9% on enterprise drives rated 10¹⁵). One more error during a RAID 5 rebuild loses the array, and the rebuild itself takes about 22 hours.",
    svg:svg(560,222,`${text(280,13,'REBUILDING ONE 12 TB DRIVE IN RAID 5',{bold:true,color:CY,size:11})}
      ${box(12,26,118,46,'read every bit:\n12 × 10¹² × 8',{size:11})}${arrow(131,49,150,49,'')}
      ${box(152,26,118,46,'≈ 9.6 × 10¹³ bits\n÷ 1 URE per 10¹⁴',{size:11})}${arrow(271,49,290,49,'')}
      ${box(292,26,118,46,'expected UREs\n≈ 0.96',{size:11})}${arrow(411,49,430,49,'')}
      ${box(432,26,118,46,'1 − e^−0.96\n≈ 62% at least one',{size:11,stroke:MG,color:MG,bold:true})}
      ${text(12,98,'consumer: 1 per 10¹⁴',{anchor:'start',size:10})}${box(150,90,186,18,'',{stroke:MG,rx:3})}${text(344,99,'62%',{anchor:'start',size:11,bold:true,color:MG})}
      ${text(12,128,'enterprise: 1 per 10¹⁵',{anchor:'start',size:10})}${box(150,120,27,18,'',{stroke:LM,rx:3})}${text(185,129,'9%',{anchor:'start',size:11,bold:true,color:LM})}
      ${box(390,88,158,52,'one more error\nduring a RAID 5 rebuild\nloses the array',{size:10,stroke:AM})}
      ${box(12,164,262,44,'rebuild at 150 MB/s: 80,000 s\n≈ 22 h of stress on survivors',{size:10,stroke:AM})}
      ${box(286,164,262,44,'big disks: RAID 6 / RAIDZ2\nor mirrors instead',{size:10,stroke:LM})}`,
      'RAID 5 rebuild arithmetic for a 12 TB drive: 9.6 times ten to the 13 bits read, 0.96 expected unrecoverable read errors, 62 percent chance of at least one')}]);

  /* m5 — RPO and RTO on one timeline */
  add('p30m5',[{cap:"RPO looks backwards from the failure, RTO forwards. A nightly backup means up to 24 hours of VM changes can be lost; rebuilding a dead Proxmox host (1 h reinstall, 40 min restore, 20 min verify) brings the VMs back in about 2 hours, inside the 4-hour objective — known because the restore was timed. Restore time is size ÷ throughput, which is why the medium matters.",
    svg:svg(560,215,`${text(280,12,'ONE INCIDENT ON A TIMELINE',{bold:true,color:CY,size:11})}
      ${line(50,52,50,96,{stroke:CY})}${text(50,30,'nightly backup\n02:00',{size:10,color:CY})}
      ${line(200,52,200,96,{stroke:MG,sw:2})}${text(200,36,'host dies',{size:10,color:MG,bold:true})}
      ${line(350,52,350,96,{stroke:LM,sw:2})}${text(350,30,'VMs back\n≈ 2 h later',{size:10,color:LM,bold:true})}
      ${line(500,52,500,96,{stroke:AM,dash:true})}${text(500,30,'4 h RTO\nobjective',{size:10,color:AM})}
      ${line(50,87,200,87,{stroke:MG,dash:true,sw:2})}${text(125,74,'RPO: up to 24 h lost',{size:10,color:MG})}
      ${box(200,78,75,18,'',{stroke:CY,rx:2})}${box(275,78,50,18,'',{stroke:AM,rx:2})}${box(325,78,25,18,'',{stroke:LM,rx:2})}${line(350,87,500,87,{dash:true,stroke:DIM})}
      ${text(237,108,'reinstall 1 h',{size:10,color:CY})}${text(300,122,'restore 40 min',{size:10,color:AM})}${text(362,108,'verify 20 min',{size:10,color:LM})}${text(425,74,'slack',{size:10,color:DIM})}
      ${box(15,140,260,46,'RPO = time between backups\nnightly → up to 24 h lost',{size:10,stroke:MG})}
      ${box(285,140,260,46,'RTO = find + rebuild + restore\n+ verify; restore = size / speed',{size:10,stroke:CY})}
      ${text(145,203,'2 TB over gigabit: ≈ 5.6 h',{size:10,color:DIM})}${text(415,203,'2 TB, NVMe + 10 GbE: ≈ 40 min',{size:10,color:DIM})}`,
      'Timeline of a failure: the RPO reaches back to the last nightly backup, the RTO is reinstall plus restore plus verify, about 2 hours against a 4 hour objective')}]);

  /* m6 — the RANGE rules, evaluated top-down */
  add('p30m6',[{cap:"OPNsense evaluates the RANGE interface's rules top-down and stops at the first match. A packet from Kali to a server on VLAN 20 skips the DNS rule and hits the RFC1918 block, which logs it; a packet to TryHackMe passes the first two rules and matches the internet rule. Rules after the match are never consulted, so order is the policy.",
    svg:svg(560,225,`${text(280,12,'VLAN 66 RULES: FIRST MATCH WINS',{bold:true,color:CY,size:11})}
      ${text(72,48,'packet ↓  rule →',{size:10,color:DIM})}
      ${box(145,26,86,40,'1 pass DNS\nto firewall',{size:10})}${box(247,26,86,40,'2 block\nRFC1918, log',{size:10,stroke:MG})}${box(349,26,86,40,'3 pass\nany (internet)',{size:10,stroke:LM})}${box(451,26,86,40,'4 default\ndeny',{size:10,stroke:DIM})}
      ${box(10,86,125,40,'Kali → 10.10.20.5\nSERVERS VLAN',{size:10,stroke:CY})}
      ${box(145,86,86,40,'no match',{size:10,stroke:DIM,dash:true,color:DIM})}${arrow(232,106,245,106,'')}${box(247,86,86,40,'MATCH\nblock + log',{size:10,stroke:MG,color:MG,bold:true})}${box(349,86,86,40,'not\nreached',{size:10,stroke:DIM,dash:true,color:DIM})}${box(451,86,86,40,'not\nreached',{size:10,stroke:DIM,dash:true,color:DIM})}
      ${arrow(136,106,143,106,'')}
      ${box(10,140,125,40,'Kali →\ntryhackme.com',{size:10,stroke:CY})}
      ${arrow(136,160,143,160,'')}${box(145,140,86,40,'no match',{size:10,stroke:DIM,dash:true,color:DIM})}${arrow(232,160,245,160,'')}${box(247,140,86,40,'no match',{size:10,stroke:DIM,dash:true,color:DIM})}${arrow(334,160,347,160,'')}${box(349,140,86,40,'MATCH\npass',{size:10,stroke:LM,color:LM,bold:true})}${box(451,140,86,40,'not\nreached',{size:10,stroke:DIM,dash:true,color:DIM})}
      ${text(280,200,'rule 2 is the wall',{size:11,color:MG,bold:true})}
      ${text(280,216,'order matters: first match decides',{size:10,color:DIM})}`,
      'Two packets evaluated against the RANGE firewall rules: one to a private server is blocked by rule 2, one to the internet passes at rule 3')}]);

  /* m7 — the CompTIA method carries the DEGRADED runbook */
  add('p30m7',[{cap:"The Server+ troubleshooting method is the skeleton of every runbook. Here CompTIA's six steps carry the lab's \"ZFS pool DEGRADED\" runbook from the alert to the updated inventory; the 12 TB resilver in step 5 takes about 22 hours, and you do not reboot during it.",
    svg:flow([{t:'1 identify the problem\nalert + zpool status -v',stroke:CY},{t:'2 establish a theory\nthe FAULTED disk is dying'},{t:'3 test the theory\nsmartctl -a: bad sectors'},{t:'4 plan and implement\nzpool replace, new disk',stroke:AM},{t:'5 verify functionality\nresilver, scrub: 0 errors'},{t:'6 document\nlabel bay, update inventory',stroke:LM}],{perRow:3,bw:160,bh:56,gap:30,label:'The six CompTIA troubleshooting steps applied to a degraded ZFS pool'})}]);
})();
