/* Illustrations — Domain 30: Virtualization, Servers, Storage & the Home Lab, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  /* ================= DOMAIN 30: Home Lab ================= */
  I.p30m1=[{cap:"What a server adds to the PC you already built: the extra parts all serve three promises — run unattended, warn before failing, keep running after a part dies.",
    svg:compare({t:'GAMING PC',draw:x=>[['1 CPU · 2 memory channels',DIM],['non-ECC DDR5',DIM],['one power supply',DIM],['no remote console',DIM],['2–4 SATA/NVMe drives',DIM],['quiet tower on a desk',DIM]].map((l,i)=>box(x+10,40+i*30,240,24,l[0],{size:10,stroke:l[1]})).join('')},
                {t:'SERVER',draw:x=>[['1–2 sockets · 8–12 channels · 128 lanes',CY],['ECC RDIMM (72 bits per 64)',CY],['1+1 hot-swap power supplies',CY],['BMC: iDRAC · iLO · IPMI · Redfish',AM],['8–24 hot-swap SAS/NVMe bays',CY],['1U–2U rack · 60+ dB fans',MG]].map((l,i)=>box(x+10,40+i*30,240,24,l[0],{size:10,stroke:l[1]})).join('')},{h:230,label:'Gaming PC versus server hardware'})},
   {cap:"The closet arithmetic for a 280 W lab: energy and money, heat, circuit headroom and UPS loading — four results from one measured number.",
    svg:svg(560,240,`${text(280,18,'MEASURED IDLE LOAD: 280 W',{bold:true,color:CY})}
      ${box(15,32,160,44,'280 W\n× 8,760 h ÷ 1,000',{size:10,stroke:CY})}${arrow(175,54,205,54,'')}${box(205,32,160,44,'= 2,453 kWh per year',{size:10,stroke:CY})}${arrow(365,54,395,54,'')}${box(395,32,150,44,'× $0.15 / kWh\n= $368 per year',{size:10,stroke:AM,bold:true})}
      ${box(15,96,160,44,'280 W × 3.412\n= 955 BTU/h of heat',{size:10,stroke:MG})}${box(205,96,160,44,'15 A × 120 V × 80%\n= 1,440 W limit',{size:10,stroke:LM})}${arrow(365,118,395,118,'')}${box(395,96,150,44,'280 ÷ 1,440\n= 19% of the circuit',{size:10,stroke:LM})}
      ${box(15,160,160,44,'UPS 1500 VA / 900 W',{size:10,stroke:AM})}${arrow(175,182,205,182,'')}${box(205,160,160,44,'280 ÷ 900 = 31% load\n(target 40–70%)',{size:10,stroke:AM})}${arrow(365,182,395,182,'')}${box(395,160,150,44,'≈ 20–25 min runtime\nNUT shuts down at 5 min',{size:9,stroke:AM})}
      ${text(280,226,'every watt is paid for 8,760 hours a year and leaves the room as heat',{size:10,color:DIM})}`,'Power, heat, circuit and UPS arithmetic for a 280 W lab')}];

  I.p30m2=[{cap:"Type 1 hypervisors sit directly on the hardware; type 2 hypervisors are applications on a host OS. Both rely on VT-x/AMD-V, which gives the hypervisor a privilege level beneath the guest kernels.",
    svg:compare({t:'TYPE 1 (BARE METAL)',draw:x=>`${box(x+10,40,74,34,'VM',{size:11})}${box(x+93,40,74,34,'VM',{size:11})}${box(x+176,40,74,34,'VM',{size:11})}
        ${box(x+10,84,240,36,'hypervisor: ESX · Hyper-V · KVM · Xen',{size:10,stroke:CY,bold:true})}
        ${box(x+10,130,240,36,'hardware with VT-x / AMD-V + EPT/NPT',{size:10,stroke:LM})}
        ${text(x+130,186,'always-on servers · Proxmox VE',{size:10,color:DIM})}`},
      {t:'TYPE 2 (HOSTED)',draw:x=>`${box(x+10,40,115,30,'VM',{size:11})}${box(x+135,40,115,30,'VM',{size:11})}
        ${box(x+10,76,240,30,'VirtualBox · Workstation (an application)',{size:10,stroke:MG,bold:true})}
        ${box(x+10,112,240,30,'host OS: Windows · macOS · Linux',{size:10})}
        ${box(x+10,148,240,30,'hardware with VT-x / AMD-V',{size:10,stroke:LM})}
        ${text(x+130,190,'labs inside your desktop',{size:10,color:DIM})}`},{h:215,label:'Type 1 versus type 2 hypervisors'})},
   {cap:"Virtual networking on a KVM host: each VM NIC plugs into the Linux bridge like a switch port; a VLAN-aware bridge tags per VM and sends one 802.1Q trunk through the physical NIC to the managed switch.",
    svg:svg(560,250,`${box(20,15,150,44,'VM: domain controller\nNIC tag 20',{size:10,stroke:CY})}${box(205,15,150,44,'VM: Kali\nNIC tag 66',{size:10,stroke:MG})}${box(390,15,150,44,'VM: OPNsense\ntrunk (all tags)',{size:10,stroke:AM})}
      ${arrow(95,59,200,95,'')}${arrow(280,59,280,95,'')}${arrow(465,59,360,95,'')}
      ${box(80,95,400,40,'vmbr0 — VLAN-aware Linux bridge (bridge-vlan-aware yes, vids 2-4094)',{size:10,stroke:LM,bold:true})}
      ${arrow(280,135,280,160,'802.1Q trunk')}
      ${box(180,160,200,34,'enp1s0 — physical NIC',{size:10})}
      ${arrow(280,194,280,214,'')}
      ${box(20,214,520,30,'managed switch: trunk port → VLAN 10 · 20 · 30 · 40 · 66 · 99 access ports',{size:10,stroke:DIM})}`,'VLAN-aware bridge carrying several VLANs to the switch')}];

  I.p30m3=[{cap:"The worked Proxmox build: a mirrored ZFS boot pool, a VLAN-aware trunk, a cloud-init template cloned into servers, and backups leaving the host to a Proxmox Backup Server on separate storage.",
    svg:svg(560,260,`${box(15,15,380,230,'',{dash:true,stroke:CY})}${text(205,32,'pve1 — Proxmox VE 9.x host',{bold:true,color:CY})}
      ${box(30,48,170,44,'ZFS RAID1 boot pool\n2× NVMe → local · local-zfs',{size:9,stroke:LM})}${box(220,48,160,44,'vmbr0 VLAN-aware\ntrunk on enp1s0',{size:10,stroke:LM})}
      ${box(30,108,110,40,'9000\nubuntu template',{size:10,stroke:AM,dash:true})}${text(152,102,'clone',{size:9,color:DIM})}${arrow(140,128,165,128,'')}${box(165,108,65,40,'101\nk8s-1',{size:10})}${box(240,108,65,40,'102\ndc1',{size:10})}${box(315,108,65,40,'103\nkali',{size:10,stroke:MG})}
      ${box(30,165,170,34,'OPNsense VM (WAN + trunk)',{size:10,stroke:AM})}${box(220,165,160,34,'tyler@pve + TOTP · root off',{size:10,stroke:DIM})}
      ${box(30,208,350,28,'datacenter firewall: 8006 + 22 from MGMT only · default DROP',{size:9,stroke:MG})}
      ${text(478,90,'nightly 02:00 backups',{size:9,color:DIM})}${box(410,100,135,50,'PBS datastore\n(NAS, separate disks)',{size:10,stroke:AM})}${arrow(395,125,410,125,'')}
      ${box(410,165,135,50,'NFS / SMB shares\nfrom TrueNAS',{size:10,stroke:CY})}${arrow(395,190,410,190,'')}`,'Worked Proxmox VE build layout')},
   {cap:"vSphere vocabulary: vCenter manages clusters of ESX hosts; vMotion moves running VMs between them, HA restarts VMs after a host dies, DRS balances load; all of it depends on storage both hosts can reach.",
    svg:svg(560,240,`${box(180,12,200,36,'vCenter Server\n(management plane)',{size:10,stroke:CY,bold:true})}
      ${arrow(230,48,120,80,'')}${arrow(330,48,440,80,'')}
      ${box(20,80,200,80,'',{stroke:LM})}${text(120,94,'ESX host A',{bold:true,color:LM})}${box(35,106,50,40,'VM',{size:10})}${box(95,106,50,40,'VM',{size:10})}${box(155,106,50,40,'VM',{size:10})}
      ${box(340,80,200,80,'',{stroke:LM})}${text(440,94,'ESX host B',{bold:true,color:LM})}${box(355,106,50,40,'VM',{size:10})}${box(415,106,50,40,'VM',{size:10,dash:true,stroke:DIM})}${box(475,106,50,40,'',{size:10,dash:true,stroke:DIM})}
      ${arrow(222,120,338,120,'vMotion (live)')}${text(280,172,'HA: restart VMs after a host fails\nDRS: balance load across hosts',{size:9,color:AM,lh:11})}
      ${arrow(120,160,200,196,'')}${arrow(440,160,360,196,'')}
      ${box(150,196,260,34,'shared datastore: VMFS on SAN · vSAN · NFS',{size:10,stroke:MG})}`,'vCenter, ESX hosts, vMotion, HA and DRS')}];

  I.p30m4=[{cap:"Four 4 TB drives under each RAID level: data (D), parity (P) and mirror copies decide usable capacity, how many failures the set survives, and the write penalty.",
    svg:svg(560,245,`${text(280,16,'4 × 4 TB DRIVES',{bold:true,color:CY})}
      ${[['RAID 0',['D','D','D','D'],[CY,CY,CY,CY],'16 TB · survives 0 · penalty 1'],['RAID 5',['D','D','D','P'],[CY,CY,CY,AM],'12 TB · survives 1 · penalty 4'],['RAID 6',['D','D','P','P'],[CY,CY,AM,AM],'8 TB · survives 2 · penalty 6'],['RAID 10',['D','D′','E','E′'],[CY,MG,CY,MG],'8 TB · 1 per mirror · penalty 2']].map((r,i)=>{const y=30+i*50; return box(10,y,76,38,r[0],{size:11,bold:true})+r[1].map((d,j)=>box(96+j*52,y,46,38,d,{size:12,stroke:r[2][j]})).join('')+box(312,y,238,38,r[3],{size:10,stroke:DIM});}).join('')}
      ${text(280,238,'D = data · P = parity · D′/E′ = mirror copy',{size:10,color:DIM})}`,'RAID levels with four drives')},
   {cap:"ZFS from RAM down: the ARC caches in memory (which is why ECC matters), the pool stripes across vdevs that each hold their own redundancy, and datasets, zvols and snapshots sit on top.",
    svg:svg(560,250,`${box(130,12,300,34,'ARC — read cache in RAM (ECC!)',{size:10,stroke:AM,bold:true})}${arrow(280,46,280,66,'')}
      ${box(80,66,400,34,'zpool tank — stripes across its vdevs',{size:11,stroke:CY,bold:true})}
      ${arrow(170,100,120,124,'')}${arrow(390,100,440,124,'')}
      ${box(15,124,210,56,'vdev mirror-0\ndisk A + disk B · survives 1',{size:10,stroke:LM})}${box(335,124,210,56,'vdev raidz2-1\n6 disks, 2 parity · survives 2',{size:10,stroke:LM})}
      ${text(280,152,'lose one vdev →\nlose the pool',{size:10,color:MG})}
      ${box(15,196,170,40,'datasets (files)\nrecordsize · lz4',{size:10})}${box(195,196,170,40,'zvols (VM disks)\nvolblocksize 16K',{size:10})}${box(375,196,170,40,'snapshots · clones\nsend / receive',{size:10,stroke:CY})}
      ${text(280,246,'checksums on every block · scrub monthly · resilver on replace',{size:9,color:DIM})}`,'ZFS layers: ARC, pool, vdevs, datasets')}];

  I.p30m5=[{cap:"The 3-2-1 rule in the home lab: three copies, on two kinds of system, one of them offsite — and the offsite copy immutable so stolen admin credentials cannot delete it.",
    svg:svg(560,230,`${box(170,12,220,44,'PRODUCTION\nProxmox VMs + NAS datasets',{size:10,stroke:CY,bold:true})}
      ${arrow(220,56,100,96,'nightly')}${arrow(280,56,280,96,'weekly')}${arrow(340,56,460,96,'nightly sync')}
      ${box(15,96,170,60,'COPY 1\nPBS datastore on the NAS\ndedup · encrypted',{size:10,stroke:LM})}${box(195,96,170,60,'COPY 2\nrestic → USB disk\nrotated, one kept at work',{size:10,stroke:AM})}${box(375,96,170,60,'COPY 3 · OFFSITE\nB2 / S3 Object Lock\nIMMUTABLE 30 days',{size:10,stroke:MG,bold:true})}
      ${box(15,172,170,34,'3 copies',{size:11,stroke:DIM})}${box(195,172,170,34,'2 different systems',{size:11,stroke:DIM})}${box(375,172,170,34,'1 offsite + immutable',{size:11,stroke:DIM})}
      ${text(280,222,'+ 0 errors: restore one VM every month and time it',{size:10,color:DIM})}`,'3-2-1 backup copies for the lab')},
   {cap:"500 GB with 20 GB changing per day: weekly storage and restore complexity for incremental, differential and deduplicated forever-incremental schemes.",
    svg:svg(560,230,`${text(280,16,'WEEKLY STORAGE (bar length) AND PIECES NEEDED TO RESTORE SATURDAY',{size:10,bold:true,color:CY})}
      ${box(10,34,130,44,'full + daily\nincrementals',{size:10})}${box(150,34,268,44,'500 + 6 × 20 = 620 GB',{size:10,stroke:CY,fill:'#0b2a3a'})}${box(428,34,122,44,'restore: 7 pieces\nin order',{size:10,stroke:MG})}
      ${box(10,96,130,44,'full + daily\ndifferentials',{size:10})}${box(150,96,398,44,'500 + 20 + 40 + 60 + 80 + 100 + 120 = 920 GB\nrestore: 2 pieces (full + one differential)',{size:10,stroke:AM,fill:'#2a1f0b'})}
      ${box(10,158,130,44,'dedup forever-\nincremental (PBS)',{size:10})}${box(150,158,238,44,'500 + 6 × 20 ≈ 620 GB of chunks',{size:10,stroke:LM,fill:'#0b2a14'})}${box(398,158,152,44,'restore: 1 synthetic\nfull, any day',{size:10,stroke:LM})}
      ${text(280,222,'RPO = backup interval (24 h here) · RTO = size ÷ restore throughput + rebuild time',{size:9,color:DIM})}`,'Incremental, differential and deduplicated backup arithmetic')}];

  I.p30m6=[{cap:"The reference lab topology: the house router stays untouched, the lab firewall sits behind it, one trunk carries six VLANs, and you come in through WireGuard or Tailscale — no forwarded ports.",
    svg:svg(560,300,`${box(15,12,110,36,'internet',{size:11,stroke:DIM})}${arrow(125,30,165,30,'')}${box(165,12,120,36,'house router\n(family Wi-Fi)',{size:10,stroke:DIM})}${arrow(285,30,325,30,'')}${box(325,12,220,36,'OPNsense 26.7 (VM or N100 box)\nWAN · DHCP · Unbound · WireGuard',{size:9,stroke:AM,bold:true})}
      ${box(15,70,110,40,'phone / laptop\non the road',{size:10,stroke:LM})}${arrow(125,90,435,52,'WireGuard UDP 51820 or Tailscale')}
      ${arrow(435,48,435,118,'802.1Q trunk')}
      ${box(165,118,380,30,'managed switch — trunk to Proxmox, access ports to physical hosts',{size:10,stroke:LM})}
      ${[['10 MGMT\n10.10.10.0/24\nProxmox · BMC · PBS',CY],['20 SERVERS\n10.10.20.0/24\nAD · DNS · NAS · K8s',CY],['30 CLIENTS\n10.10.30.0/24\nPC · laptop',CY],['40 IOT\n10.10.40.0/24\ninternet only',DIM],['66 RANGE\n10.10.66.0/24\nKali · targets',MG],['99 MALWARE\n10.10.99.0/24\nno gateway',MG]].map((v,i)=>line(60+i*88,148,60+i*88,170)+box(17+i*88,170,86,70,v[0],{size:9,stroke:v[1]})).join('')}
      ${line(60,148,500,148)}
      ${text(280,262,'default deny between VLANs · RANGE: internet yes, RFC1918 no · MALWARE: nothing',{size:10,color:AM})}
      ${text(280,284,'MGMT reachable only from MGMT and the VPN · the house never sees the lab',{size:10,color:DIM})}`,'Reference home-lab network topology')},
   {cap:"Two isolation recipes. The pentest range may reach the internet but no private network; the malware lab reaches nothing at all. Both are yours — which is the whole legal point.",
    svg:compare({t:'PENTEST RANGE (VLAN 66)',draw:x=>[['internet egress: allowed (updates, THM/HTB VPN)',LM],['RFC1918 outside the VLAN: BLOCKED + logged',MG],['DNS: firewall resolver only',CY],['promiscuous mode: allowed here only',CY],['targets: only machines you own',AM],['entry: MGMT/VPN → Kali SSH',DIM]].map((l,i)=>box(x+10,40+i*30,240,24,l[0],{size:9,stroke:l[1]})).join('')},
                {t:'MALWARE LAB (VLAN 99)',draw:x=>[['gateway: none, or INetSim/FakeNet only',MG],['per-VM firewall: default DROP',MG],['no shared folders · clipboard · USB',AM],['snapshot before · rollback after',CY],['REMnux + FLARE VM (Domain 11)',CY],['ideally a dedicated old host',DIM]].map((l,i)=>box(x+10,40+i*30,240,24,l[0],{size:9,stroke:l[1]})).join('')},{h:230,label:'Isolating the pentest range and the malware lab'})}];

  I.p30m7=[{cap:"The operations loop that keeps a lab alive: patch with a canary, watch utilization/saturation/errors, turn trends into budget, run incidents from runbooks, and document what you learned.",
    svg:cycle([{t:'patch\nmonthly · canary',stroke:CY},{t:'monitor\nUSE + alerts',stroke:LM},{t:'capacity\ntrend → budget',stroke:AM},{t:'incident\nrunbook',stroke:MG},{t:'document\npostmortem'}],{label:'The lab operations cycle'})},
   {cap:"The Genius Protocol home lab, one stage per weekend or two, each tied to the phases it serves — Stage 3 is this domain's capstone.",
    svg:flow([{t:'0 · VirtualBox on\nthe gaming PC (1,3,4)',stroke:DIM},{t:'1 · Proxmox on a\nmini PC (3,16)',stroke:CY},{t:'2 · VLANs + OPNsense\n+ WireGuard (2,7,27)',stroke:CY},{t:'3 · ZFS NAS + PBS\n3-2-1 (this domain)',stroke:AM,bold:true},{t:'4 · RANGE + MALWARE\nVLANs (8,11)',stroke:MG},{t:'5 · K8s + AD + DB\n(19,16,18)',stroke:CY},{t:'6 · GPU passthrough\nlocal AI (9,12)',stroke:CY},{t:'7 · SIEM: Wazuh /\nSecurity Onion (21)',stroke:LM},{t:'8 · hybrid cloud +\nIaC (17,19)',stroke:LM}],{perRow:3,bw:150,bh:52,gap:40,label:'The sequenced home-lab build plan'})}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
