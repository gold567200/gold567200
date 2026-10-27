/* Illustrations — Domain 29: Advanced Linux & Enterprise Administration (RHCSA), built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  /* ================= DOMAIN 29: RHCSA ================= */
  I.p29m1=[{cap:"The enterprise Linux pipeline. Fedora moves fast, CentOS Stream previews the next RHEL minor release, RHEL is the ten-year supported product, and Rocky Linux and AlmaLinux rebuild it for free with different compatibility promises.",
    svg:svg(560,210,`${box(10,25,140,50,'Fedora\nnew tech first',{stroke:LM,size:10})}${arrow(150,50,210,50,'branch')}
      ${box(210,25,140,50,'CentOS Stream\nnext RHEL minor preview',{stroke:AM,size:10})}${arrow(350,50,410,50,'freeze')}
      ${box(410,25,140,50,'RHEL 10\n10-year lifecycle',{stroke:CY,size:10,bold:true})}
      ${arrow(450,75,340,130,'rebuild 1:1')}${arrow(500,75,500,130,'rebuild ABI')}
      ${box(270,130,140,50,'Rocky Linux 10\nRESF · bug-for-bug',{stroke:MG,size:10})}${box(430,130,120,50,'AlmaLinux 10\nABI-compatible',{stroke:MG,size:10})}
      ${text(130,150,'free rebuilds, no subscription',{size:10,color:DIM})}
      ${text(280,198,'RHEL 10 and Rocky 10 need an x86-64-v3 CPU (AVX2); Alma also ships x86-64-v2',{size:10,color:DIM})}`,'From Fedora to RHEL to the rebuilds')},
   {cap:"The boot chain, link by link. Each stage loads the next; the initramfs is a temporary root that finds the real one and hands over to systemd with switch_root.",
    svg:flow([{t:'UEFI firmware\nESP · Secure Boot'},{t:'shim → GRUB2\nBLS entries',edge:'loads'},{t:'kernel +\ninitramfs',edge:'loads'},{t:'systemd PID 1\ndefault.target',stroke:CY,edge:'switch_root'},{t:'services\nsshd · httpd',stroke:LM,edge:'starts'}],{label:'Boot chain from firmware to services'})},
   {cap:"Why rd.break works when rescue does not: the rescue and emergency targets run after the real root is mounted and ask for the root password; rd.break stops earlier, inside the initramfs, before any login exists.",
    svg:compare({t:'RESCUE / EMERGENCY TARGET',draw:x=>[['systemd.unit=rescue.target'],['real root mounted (ro in emergency)'],['asks for the ROOT PASSWORD'],['for a system you can still log in to']].map((l,i)=>text(x+130,52+i*28,l[0],{size:10})).join('')},{t:'rd.break',draw:x=>[['stops in the initramfs'],['before switch_root: no password'],['mount -o remount,rw /sysroot; chroot'],['passwd root; touch /.autorelabel']].map((l,i)=>text(x+130,52+i*28,l[0],{size:10,color:AM})).join('')},{h:180,label:'Repair targets versus rd.break'})}];
  I.p29m2=[{cap:"Anatomy of a unit file. [Unit] says who must be up first, [Service] says what runs and how it is confined, [Install] says which target pulls it in when enabled.",
    svg:stack([{t:'[Unit]  Description= · After= · Wants=',stroke:CY,side:'order and requirement'},{t:'[Service]  Type= · ExecStart= · Restart= · User=',side:'what runs, how it heals'},{t:'[Service]  ProtectSystem= · PrivateTmp= · NoNewPrivileges=',stroke:LM,side:'sandbox: free security'},{t:'[Install]  WantedBy=multi-user.target',stroke:AM,side:'enable → symlink in .wants/'}],{w:320,side:true,label:'Sections of a systemd unit file'})},
   {cap:"Timer versus cron for the same 02:30 job. The timer catches up after downtime, logs to the journal and inherits every service feature; cron is simpler and still on the exam.",
    svg:compare({t:'CRON',draw:x=>[['30 2 * * *  /usr/local/bin/job'],['missed while off: lost (anacron: daily only)'],['output mailed, usually unread'],['no limits, no dependencies']].map((l,i)=>text(x+130,52+i*28,l[0],{size:10})).join('')},{t:'SYSTEMD TIMER',draw:x=>[['OnCalendar=*-*-* 02:30:00'],['Persistent=true → catches up'],['output in the journal (journalctl -u)'],['MemoryMax=, After=, RandomizedDelaySec=']].map((l,i)=>text(x+130,52+i*28,l[0],{size:10,color:AM})).join('')},{h:180,label:'cron versus systemd timer'})},
   {cap:"cgroups v2 as systemd sees it: every service, login and machine lives in a slice, and set-property writes limits onto a service's group so a leak is contained there.",
    svg:svg(560,215,`${box(230,10,100,32,'/ (root)',{stroke:CY,bold:true})}
      ${line(280,42,115,70)}${line(280,42,280,70)}${line(280,42,445,70)}
      ${box(40,70,150,34,'system.slice',{stroke:CY})}${box(205,70,150,34,'user.slice',{stroke:AM})}${box(370,70,150,34,'machine.slice',{stroke:MG})}
      ${line(115,104,70,125)}${line(115,104,158,125)}${line(280,104,245,125)}${line(280,104,325,125)}${line(445,104,410,125)}${line(445,104,483,125)}
      ${box(30,125,80,30,'httpd.service',{size:9})}${box(118,125,80,30,'sshd.service',{size:9})}${box(205,125,80,30,'user-1000.slice',{size:9})}${box(290,125,70,30,'web (linger)',{size:9})}${box(380,125,60,30,'VMs',{size:9})}${box(448,125,70,30,'containers',{size:9})}
      ${text(280,185,'systemctl set-property httpd.service CPUQuota=50% MemoryMax=512M',{size:10,mono:true,color:AM})}
      ${text(280,203,'systemd-cgls shows the tree · systemd-cgtop shows live use per group',{size:10,color:DIM})}`,'The cgroups v2 hierarchy under systemd')}];
  I.p29m3=[{cap:"SELinux type enforcement in one picture: the web server process (httpd_t) may read web content types and bind labeled ports; content moved in from a home directory keeps user_home_t and is denied until restorecon relabels it.",
    svg:svg(560,240,`${box(20,90,170,56,'process: httpd_t\n(the web server)',{stroke:CY})}
      ${box(330,15,215,50,'/var/www/html\nhttpd_sys_content_t',{stroke:LM,size:10})}${box(330,90,215,56,'/home/tyler/site (moved with mv)\nuser_home_t',{stroke:MG,size:10})}${box(330,170,215,50,'port 8080 → http_port_t\n(semanage port -a)',{stroke:LM,size:10})}
      ${arrow(190,105,330,40,'read: allowed')}${arrow(190,118,330,118,'read: DENIED (AVC)')}${arrow(190,131,330,195,'bind: allowed')}
      ${text(280,232,'fix: semanage fcontext -a -t httpd_sys_content_t "/path(/.*)?"  →  restorecon -Rv /path',{size:9,mono:true,color:AM})}`,'SELinux type enforcement for a web server')},
   {cap:"Two gates, in order. firewalld decides whether the packet reaches the socket at all; SELinux decides whether the process may own that socket and read the files. A service on a custom port needs both opened.",
    svg:flow([{t:'packet arrives\non enp1s0'},{t:'firewalld zone:\nport allowed?',stroke:AM},{t:'socket :8080\n(nginx)'},{t:'SELinux: may httpd_t\nbind and read?',stroke:MG},{t:'response\n200 OK',stroke:LM}],{edges:['','accept','','allow'],label:'Firewall gate then SELinux gate'})},
   {cap:"umask arithmetic. New files start from 666 and directories from 777; the umask bits are removed. 027 yields 640 and 750; RHEL's defaults are 022 for root and 002 for ordinary users.",
    svg:svg(560,150,`${text(60,36,'file',{size:11,bold:true})}${box(100,20,110,32,'666',{mono:true})}${text(225,36,'−',{size:16})}${box(240,20,110,32,'umask 027',{mono:true,stroke:AM})}${text(365,36,'=',{size:16})}${box(380,20,165,32,'640  rw- r-- ---',{mono:true,stroke:LM})}
      ${text(60,86,'directory',{size:11,bold:true})}${box(100,70,110,32,'777',{mono:true})}${text(225,86,'−',{size:16})}${box(240,70,110,32,'umask 027',{mono:true,stroke:AM})}${text(365,86,'=',{size:16})}${box(380,70,165,32,'750  rwx r-x ---',{mono:true,stroke:LM})}
      ${text(280,128,'root default 022 → 644 / 755 · user default 002 → 664 / 775 (user private groups)',{size:10,color:DIM})}`,'How umask produces file and directory modes')}];
  I.p29m4=[{cap:"The storage stack from a raw disk to a mounted path. Every tool in this module is a verb on one layer, and fstab by UUID is what makes the top layer survive a reboot.",
    svg:stack([{t:'mount point /data  ← /etc/fstab by UUID (nofail)',stroke:CY},{t:'file system: XFS (grows) or ext4 (shrinks offline)'},{t:'LUKS (optional encryption, /etc/crypttab)',stroke:MG},{t:'logical volume lv_data  (lvextend -r grows live)',stroke:AM},{t:'volume group vg_lab  (extents; vgextend adds disks)'},{t:'physical volume /dev/sdb1  (pvcreate)'},{t:'GPT partition on the disk  (parted mklabel gpt)',stroke:DIM}],{w:420,label:'The Linux storage stack'})},
   {cap:"Extent arithmetic the exam loves. A 5 GiB disk with 8 MiB extents gives 639 extents; 3 GiB is 384 of them, growing to 4.5 GiB takes 192 more, and 63 extents (504 MiB) remain.",
    svg:svg(560,200,`${text(280,18,'vg_lab: 639 extents × 8 MiB (one 5 GiB disk)',{bold:true,size:11})}
      ${box(30,35,500,44,'',{stroke:DIM})}${box(30,35,300,44,'lv_data: 384 PE = 3 GiB',{stroke:CY,size:10})}${box(330,35,150,44,'+192 PE = +1.5 GiB',{stroke:AM,size:10,dash:true})}${box(480,35,50,44,'63 free',{stroke:DIM,size:8})}
      ${text(280,105,'3 GiB ÷ 8 MiB = 3 × 1024 ÷ 8 = 384 extents',{size:11})}
      ${text(280,128,'lvextend -r -L 4.5G → 576 extents, file system grown while mounted',{size:11,color:AM})}
      ${text(280,151,'Free PE = 639 − 576 = 63 extents = 504 MiB left',{size:11,color:DIM})}
      ${text(280,180,'lvcreate -L 1.5G rounds up to whole extents: 192',{size:10,color:DIM})}`,'LVM extents and a live extension')},
   {cap:"The six fstab fields, and the two commands that must follow any edit. A device name here instead of a UUID is the most common way to make a server unbootable.",
    svg:svg(560,150,`${box(24,30,130,36,'UUID=3f1c-…',{mono:true,stroke:CY,size:11})}${box(166,30,70,36,'/data',{mono:true,size:11})}${box(248,30,50,36,'xfs',{mono:true,size:11})}${box(310,30,130,36,'defaults,nofail',{mono:true,stroke:AM,size:11})}${box(452,30,36,36,'0',{mono:true})}${box(500,30,36,36,'0',{mono:true})}
      ${text(89,85,'device',{size:10,color:DIM})}${text(201,85,'mount point',{size:10,color:DIM})}${text(273,85,'type',{size:10,color:DIM})}${text(375,85,'options',{size:10,color:DIM})}${text(470,85,'dump',{size:10,color:DIM})}${text(518,85,'fsck pass',{size:10,color:DIM})}
      ${text(280,122,'then: systemctl daemon-reload → mount -a (must be silent) → only now reboot',{size:10,color:AM})}`,'The fields of an /etc/fstab line')}];
  I.p29m5=[{cap:"The troubleshooting ladder. Climb from the bottom and stop at the first failing rung; each rung has a command that proves it, and each symptom (refused, hangs, 403) points at a rung.",
    svg:stack([{t:'8  Service',stroke:LM,side:'journalctl -u, curl -v'},{t:'7  SELinux',stroke:MG,side:'ausearch -m AVC'},{t:'6  Firewall',stroke:AM,side:'firewall-cmd --list-all'},{t:'5  Socket',side:'ss -tulpn'},{t:'4  Name',side:'getent hosts, dig'},{t:'3  Route',side:'ip route, ping gateway'},{t:'2  Address',side:'ip -br addr, nmcli dev'},{t:'1  Link',stroke:CY,side:'ip -br link, ethtool'}],{w:200,side:true,label:'Bottom-up network troubleshooting ladder'})},
   {cap:"An active-backup bond: two interfaces, one address. When the primary link drops, traffic moves to the backup within a second, and no switch configuration is required.",
    svg:svg(560,200,`${box(20,20,130,44,'enp7s0\nactive (primary)',{stroke:LM,size:10})}${box(20,100,130,44,'enp8s0\nbackup',{stroke:DIM,size:10,dash:true})}
      ${arrow(150,42,230,70,'')}${arrow(150,122,230,90,'',{dash:true})}
      ${box(230,52,160,56,'bond0\nmode=active-backup\nmiimon=100',{stroke:CY,size:10})}${arrow(390,80,430,80,'')}
      ${box(430,56,115,48,'192.168.56.20/24\none address',{stroke:AM,size:10})}
      ${text(280,180,'link down on enp7s0 → traffic moves to enp8s0 in under a second; no switch config',{size:10,color:DIM})}`,'An active-backup network bond')},
   {cap:"nmcli's two steps. con add and con mod only write the keyfile profile; nothing changes on the wire until con up applies it, which is why a modified address 'did not take'.",
    svg:flow([{t:'nmcli con add / mod\n(edit the profile)'},{t:'keyfile in\n/etc/NetworkManager/\nsystem-connections',edge:'write'},{t:'nmcli con up\n(apply: live interface)',stroke:CY,edge:'apply'}],{bw:140,bh:60,gap:50,label:'nmcli: edit, then apply'})}];
  I.p29m6=[{cap:"Rootless means mapped, not missing. The container's root is your own UID on the host and its other users land in your /etc/subuid range, so an escape is an unprivileged user owning nothing.",
    svg:svg(560,210,`${box(20,20,240,150,'',{dash:true,stroke:DIM})}${text(140,38,'INSIDE THE CONTAINER',{bold:true,color:CY,size:11})}
      ${box(45,55,190,36,'root  (UID 0)',{mono:true})}${box(45,110,190,36,'nginx worker (UID 101)',{mono:true,size:10})}
      ${box(300,20,240,150,'',{dash:true,stroke:DIM})}${text(420,38,'ON THE HOST',{bold:true,color:MG,size:11})}
      ${box(325,55,190,36,'web  (UID 1001)',{mono:true})}${box(325,110,190,36,'UID 165636 (165536+100)',{mono:true,size:10})}
      ${arrow(235,73,325,73,'maps to')}${arrow(235,128,325,128,'maps to')}
      ${text(280,192,'/etc/subuid → web:165536:65536 — container UIDs 1–65536 map onto that range',{size:10,color:DIM})}`,'Rootless container UID mapping')},
   {cap:"Quadlet: from a .container file to a service that starts at boot. The generator builds the unit at daemon-reload; linger is what lets a user's services run without a login session.",
    svg:flow([{t:'~/.config/containers/\nsystemd/web.container'},{t:'systemctl --user\ndaemon-reload',edge:'read by'},{t:'generator →\nweb.service',stroke:CY,edge:'creates'},{t:'loginctl\nenable-linger',stroke:AM,edge:'plus'},{t:'runs at boot\nno login needed',stroke:LM,edge:'gives'}],{bw:130,gap:40,label:'Quadlet from file to boot-time service'})},
   {cap:"Ansible is agentless: the control node pushes small modules over SSH, runs them and removes them. Idempotent modules make the second run report changed=0, which is what makes nightly runs safe.",
    svg:svg(560,210,`${box(20,50,190,90,'control node (server1)\ninventory.ini · ansible.cfg\nsite.yml · ansible-core',{stroke:CY,size:10})}
      ${arrow(210,80,350,45,'SSH + Python')}${arrow(210,110,350,145,'SSH + Python')}
      ${box(350,20,190,50,'server2 (managed)\nmodules pushed, run, removed',{size:9})}${box(350,120,190,50,'server3 (managed)\nno agent installed',{size:9})}
      ${text(280,185,'run 1: ok=6 changed=5 · run 2: ok=6 changed=0 → idempotent',{size:11,color:AM})}
      ${text(280,203,'ansible-playbook site.yml --check --diff previews; --syntax-check validates',{size:9,color:DIM})}`,'Ansible control node and managed nodes')}];
  I.p29m7=[{cap:"The troubleshooting loop. One hypothesis and one change at a time, verified by the command that proves it, made persistent, and written down.",
    svg:cycle([{t:'symptom &\nwhat changed'},{t:'locate\nthe layer',stroke:CY},{t:'one\nhypothesis'},{t:'one change',stroke:AM},{t:'verify &\npersist',stroke:LM},{t:'document'}],{label:'The seven-step troubleshooting method as a loop'})},
   {cap:"A 180-minute exam plan. Gate tasks (repositories, network, root access) first because everything depends on them; storage after the easy points are banked; the last half hour is a reboot and a grader-style verification pass.",
    svg:svg(560,175,`${text(280,16,'EX200: 180 minutes, planned',{bold:true,size:11})}
      ${text(20,36,'read 5',{size:9,anchor:'start',color:DIM})}${text(77,48,'gate 15',{size:9,color:AM})}
      ${box(20,60,14,40,'',{stroke:DIM})}${box(34,60,43,40,'',{stroke:AM})}${box(77,60,116,40,'quick wins 40',{size:10})}${box(193,60,130,40,'services 45',{size:10,stroke:MG})}${box(323,60,130,40,'storage 45',{size:10,stroke:CY})}${box(453,60,87,40,'reboot &\nverify 30',{size:9,stroke:LM})}
      ${text(20,115,'0',{size:9,anchor:'start',color:DIM})}${text(193,115,'60',{size:9,color:DIM})}${text(367,115,'120',{size:9,color:DIM})}${text(453,115,'150',{size:9,color:DIM})}${text(540,115,'180',{size:9,anchor:'end',color:DIM})}
      ${text(280,150,'gate tasks first · storage after other points are banked · reboot and verify before time runs out',{size:9,color:DIM})}`,'Time plan for the three-hour exam')},
   {cap:"Reading a slow server with the USE method. Load must be compared with the CPU count; high %wa with idle CPUs and no swapping points at disk, so the fix is the I/O producer, not more CPU.",
    svg:compare({t:'LOAD 8.5 ON 2 vCPU',draw:x=>[['runnable + disk-wait processes'],['8.5 ÷ 2 = 4.25 per CPU: saturated'],['top: %us 12  %sy 3  %wa 60'],['vmstat: si/so = 0 → not swapping']].map((l,i)=>text(x+130,52+i*28,l[0],{size:10})).join('')},{t:'VERDICT: DISK',draw:x=>[['iostat -xz 1: %util 99, await 420 ms'],['pidstat -d 1 names the writer'],['fix the producer; IOWeight=, renice'],['not: more CPUs, not: more RAM']].map((l,i)=>text(x+130,52+i*28,l[0],{size:10,color:AM})).join('')},{h:180,label:'Diagnosing a disk-bound server'})}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
