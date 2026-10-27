/* Illustrations — Domain 3: Linux & Operating Systems (v42 upgrade). Keeps the original figures from illus_core.js and appends new ones; built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const E=window.ILLUS||{}; const I={};
  const DL='$'+'{'; // literal "dollar-brace" for parameter-expansion labels

  /* ---------- Module 1: what an OS does ---------- */
  I.p3m1=(E.p3m1||[]).concat([
   {cap:"What strace shows when bash runs ls: the parent clones itself, the child replaces its program with execve, reads the directory and writes six bytes to file descriptor 1, then exits; the parent, blocked in wait4, collects status 0. One short listing is about 75 system calls.",
    svg:svg(560,232,`${text(12,14,'parent',{anchor:'start',size:10,color:DIM})}${text(12,114,'child',{anchor:'start',size:10,color:DIM})}
      ${box(10,24,120,40,'bash  PID 100',{stroke:CY,size:11})}${arrow(130,44,173,44,'')}${box(175,24,90,40,'clone()',{stroke:AM})}
      ${arrow(265,44,328,44,'PID 101')}${box(330,24,220,40,'wait4(-1)  blocked',{stroke:CY,size:11})}
      ${arrow(220,64,200,122,'fork')}
      ${box(130,124,110,44,'execve\n/usr/bin/ls',{stroke:MG,size:11})}${arrow(240,146,268,146,'')}
      ${box(270,124,120,44,'openat(dir)\ngetdents64',{size:11})}${arrow(390,146,418,146,'')}
      ${box(420,124,130,44,'write(1, 6 bytes)\nexit_group(0)',{stroke:LM,size:10})}
      ${arrow(485,122,485,66,'status 0')}
      ${text(280,196,'strace -c: 75 system calls for one tiny ls',{size:11,color:AM})}
      ${text(280,216,'17 mmap · 8 fstat · 7 openat (mostly the loader)',{size:10,color:DIM})}`,'strace view of bash running ls: clone, execve, openat, getdents64, write, exit_group, wait4')},
   {cap:"The process states ps shows. Most processes sleep (S) most of the time; D means stuck waiting on disk or NFS and cannot be killed until the I/O returns; T is stopped; Z is a zombie that has exited and waits only for its parent to call wait.",
    svg:svg(560,222,`${box(210,82,140,46,'R  running /\nrunnable',{stroke:LM,bold:true,size:11})}
      ${box(10,14,150,44,'S  sleeping\n(waiting for event)',{size:11})}
      ${box(10,150,150,44,'D  disk wait\n(cannot be killed)',{stroke:AM,size:11})}
      ${box(400,14,150,44,'T  stopped\n(Ctrl-Z, SIGSTOP)',{size:11})}
      ${box(400,150,150,44,'Z  zombie\n(exited, not reaped)',{stroke:MG,size:11})}
      ${arrow(210,92,162,50,'block',{dy:-12})}${arrow(162,30,226,80,'',{dash:true})}
      ${arrow(210,120,162,160,'I/O')}${arrow(162,184,232,130,'',{dash:true})}
      ${arrow(350,92,398,50,'SIGSTOP',{dy:-12})}${arrow(398,30,334,80,'',{dash:true})}
      ${arrow(350,120,398,160,'exit')}
      ${text(475,210,'parent wait() → gone',{size:10,color:DIM})}
      ${text(280,210,'dashed = back to R',{size:10,color:DIM})}`,'Process state machine: R, S, D, T and Z')},
   {cap:"Reading free -h correctly. Of 15 GiB, programs use 3.1; 11 GiB is page cache the kernel gives back on demand; only 1.2 is literally free. 'available' (about 12 GiB) is the real headroom, and the OOM killer acts only when that approaches zero.",
    svg:svg(560,172,`${text(280,14,'free -h on a 16 GB server (15 GiB usable)',{size:11,bold:true,color:CY})}
      ${box(20,28,105,42,'used\n3.1G',{stroke:MG,size:11})}${box(125,28,374,42,'buff/cache 11G\npage cache: reclaimable',{stroke:CY,dash:true,size:11})}${box(499,28,41,42,'free\n1.2G',{stroke:LM,size:9})}
      ${line(125,82,540,82,{stroke:LM})}${line(125,76,125,88,{stroke:LM})}${line(540,76,540,88,{stroke:LM})}
      ${text(332,100,'available ≈ 12 GiB = free + reclaimable cache',{size:11,color:LM})}
      ${text(280,130,'OOM only when available nears 0: SIGKILL to the top oom_score',{size:10,color:AM})}
      ${text(280,152,'victim exits with status 137 = 128 + 9',{size:10,color:DIM})}`,'free -h breakdown: used, buff/cache, free and available')}
  ]);

  /* ---------- Module 2: landscape ---------- */
  I.p3m2=(E.p3m2||[]).concat([
   {cap:"What a distribution actually is: the same kernel and (mostly) the same GNU userland, wrapped in an init system, a package manager with signed repositories, defaults and a support promise. Servers stop at the init layer; desktops add a display stack.",
    svg:stack([{t:'apps · desktop (GNOME, KDE) or none',side:'servers skip this'},{t:'package manager + signed repos',stroke:AM,side:'apt/.deb · dnf/.rpm'},{t:'init system: systemd (PID 1)',side:'services and targets'},{t:'GNU userland: bash, coreutils, glibc',side:'Alpine: busybox + musl'},{t:'Linux kernel (GPL-2.0-only)',stroke:CY,side:'uname -r'},{t:'hardware: x86-64 · ARM64 · RISC-V',stroke:DIM,side:'lscpu'}],{w:300,side:true,label:'Layers of a Linux distribution'})},
   {cap:"Support windows decide what a server should run. An Ubuntu LTS gets five years of standard updates (ten with Ubuntu Pro), RHEL majors ten years, Debian about three plus community LTS, while Fedora supports each release for about thirteen months.",
    svg:svg(560,200,`${text(8,31,'Ubuntu 24.04',{anchor:'start',size:10})}${box(91,22,190,18,'5 yr standard',{stroke:CY,size:9})}${box(281,22,190,18,'Ubuntu Pro (to 10 yr)',{stroke:CY,dash:true,size:9})}
      ${text(8,71,'RHEL 10',{anchor:'start',size:10})}${box(133,62,380,18,'10-year lifecycle',{stroke:LM,size:9})}
      ${text(8,111,'Debian 13',{anchor:'start',size:10})}${box(141,102,114,18,'~3 yr',{stroke:AM,size:9})}${box(255,102,76,18,'LTS',{stroke:AM,dash:true,size:9})}
      ${text(8,151,'Fedora (each)',{anchor:'start',size:10})}${box(80,142,41,18,'13 mo',{stroke:MG,size:9})}${text(130,151,'then upgrade, every year',{anchor:'start',size:10,color:DIM})}
      ${line(80,172,536,172,{stroke:DIM})}${[2024,2026,2028,2030,2032,2034,2036].map((y,i)=>line(80+i*76,168,80+i*76,176,{stroke:DIM})+text(80+i*76,188,String(y),{size:9,color:DIM})).join('')}`,'Support lifecycles of Ubuntu LTS, RHEL, Debian and Fedora')},
   {cap:"How WSL2 is built: a Microsoft-built Linux kernel in a lightweight Hyper-V utility VM. Files in ~ live in an ext4 virtual disk and are fast; /mnt/c reaches the Windows NTFS drive through a 9P file server across the VM boundary, paying a cost on every file operation.",
    svg:svg(560,192,`${box(8,8,544,176,'',{dash:true,stroke:DIM})}${text(18,22,'Windows 11 host',{anchor:'start',size:10,color:DIM})}
      ${box(24,36,150,48,'Windows apps\nVS Code, Terminal',{size:11})}${box(24,120,150,44,'NTFS drive C:',{size:11,stroke:AM})}
      ${box(224,32,316,140,'',{stroke:CY})}${text(234,46,'Hyper-V utility VM',{anchor:'start',size:10,color:CY})}
      ${box(244,56,280,28,'Linux kernel (Microsoft build)',{stroke:CY,size:11})}
      ${box(244,100,130,58,'/mnt/c\n9P file server\nslow per file',{stroke:AM,size:10})}
      ${box(390,100,134,58,'Ubuntu\next4.vhdx\n~/projects: fast',{stroke:LM,size:10})}
      ${arrow(244,136,176,140,'9P',{stroke:AM})}${arrow(174,60,242,68,'wsl')}`,'WSL2 architecture with the ext4 virtual disk and the 9P path to Windows files')}
  ]);

  /* ---------- Module 3: filesystem, shell, permissions ---------- */
  I.p3m3=(E.p3m3||[]).concat([
   {cap:"The kernel's permission check uses exactly one class: privileged processes pass, otherwise the owner bits if you own the file, else the group bits if you are in its group, else the others bits. The first match wins, so mode 0077 locks out the owner.",
    svg:svg(560,240,`${box(10,10,250,36,'privileged? (UID 0 / CAP_DAC_OVERRIDE)',{stroke:AM})}${arrow(260,28,328,28,'yes')}${box(330,10,220,36,'allow (exec needs any x bit)',{stroke:LM,size:11})}
      ${arrow(135,46,135,68,'')}${text(150,58,'no',{anchor:'start',size:10,color:DIM})}
      ${box(10,70,250,36,'process UID = file owner?')}${arrow(260,88,328,88,'yes')}${box(330,70,220,36,'use OWNER bits only, stop',{stroke:CY,size:11})}
      ${arrow(135,106,135,128,'')}${text(150,118,'no',{anchor:'start',size:10,color:DIM})}
      ${box(10,130,250,36,'file group in my groups?')}${arrow(260,148,328,148,'yes')}${box(330,130,220,36,'use GROUP bits only, stop',{stroke:AM,size:11})}
      ${arrow(135,166,135,188,'')}${text(150,178,'no',{anchor:'start',size:10,color:DIM})}
      ${box(10,190,250,36,'everyone else')}${arrow(260,208,328,208,'')}${box(330,190,220,36,'use OTHERS bits',{stroke:MG,size:11})}`,'Decision chain of the Linux permission check')},
   {cap:"The umask is a bit mask, not a subtraction: the new mode is the requested mode AND NOT the umask. Files request 666, so umask 022 clears the group and others write bits and leaves 644.",
    svg:svg(560,200,`${['owner','group','others'].map((g,i)=>text(260+i*120,12,g,{size:9,color:DIM})).join('')}
      ${[['requested 666','110110110',CY],['umask 022','000010010',AM],['NOT umask','111101101',DIM],['= 644  rw-r--r--','110100100',LM]].map((r,ri)=>text(12,34+ri*40,r[0],{anchor:'start',size:11,color:r[2],mono:ri===3?false:false})+r[1].split('').map((b,bi)=>box(190+Math.floor(bi/3)*120+(bi%3)*36,20+ri*40,32,28,b,{mono:true,size:13,stroke:b==='1'?r[2]:DIM,color:b==='1'?r[2]:DIM})).join('')).join('')}
      ${text(280,188,'umask 033 also gives 644, not 633: masked x bits were never requested',{size:10,color:AM})}`,'Bitwise umask arithmetic 666 AND NOT 022 equals 644')}
  ]);

  /* ---------- Module 4: text, pipes, redirection ---------- */
  I.p3m4=(E.p3m4||[]).concat([
   {cap:"Redirections apply left to right, and 2>&1 copies whatever descriptor 1 points to at that moment. Left: stdout goes to the file first, then stderr copies it. Right: stderr copies the terminal first, then only stdout moves to the file.",
    svg:compare({t:'cmd > file 2>&1',draw:x=>`${box(x+20,48,60,30,'fd 1',{mono:true})}${box(x+20,100,60,30,'fd 2',{mono:true})}${box(x+160,48,80,30,'file',{stroke:LM})}${box(x+160,100,80,30,'terminal',{stroke:DIM,color:DIM})}${arrow(x+80,63,x+158,63,'')}${arrow(x+80,115,x+158,70,'',{stroke:LM})}${text(x+130,152,'both end up in the file',{size:11,color:LM})}${text(x+130,172,'1) fd1 → file  2) fd2 = copy of fd1',{size:9,color:DIM})}`},
                {t:'cmd 2>&1 > file',draw:x=>`${box(x+20,48,60,30,'fd 1',{mono:true})}${box(x+20,100,60,30,'fd 2',{mono:true})}${box(x+160,48,80,30,'file',{stroke:LM})}${box(x+160,100,80,30,'terminal',{stroke:AM})}${arrow(x+80,63,x+158,63,'')}${arrow(x+80,115,x+158,115,'',{stroke:AM})}${text(x+130,152,'errors still on screen',{size:11,color:AM})}${text(x+130,172,'1) fd2 = copy of fd1 (tty)  2) fd1 → file',{size:9,color:DIM})}`},{h:190,label:'File descriptor tables for two redirection orders'})},
   {cap:"A pipe is a 64 KiB kernel buffer between two processes that run at the same time. The writer blocks when it is full, the reader when it is empty, and when the reader exits the writer's next write raises SIGPIPE — exit status 141.",
    svg:svg(560,166,`${text(280,18,'all stages of a pipeline run at the same time',{size:11,bold:true,color:CY})}
      ${box(10,46,130,50,'writer\nyes / gzip',{stroke:CY,size:11})}${arrow(140,71,188,71,'write()')}${box(190,40,180,62,'kernel pipe buffer\n64 KiB',{stroke:AM,size:11})}${arrow(370,71,418,71,'read()')}${box(420,46,130,50,'reader\nhead / grep',{stroke:LM,size:11})}
      ${text(80,122,'full → writer waits',{size:10,color:DIM})}${text(280,122,'empty → reader waits',{size:10,color:DIM})}${text(480,122,'reader exits → SIGPIPE',{size:10,color:MG})}
      ${text(280,150,'yes | head -1   →   PIPESTATUS = 141 0',{size:10,mono:true,color:AM})}`,'A pipe as a kernel buffer between writer and reader')},
   {cap:"The order in which bash rewrites a line before running it. Word splitting and globbing happen only to unquoted results, which is why \"$var\" in double quotes stays one argument however many spaces it contains.",
    svg:flow([{t:'1 brace\n{a,b} {1..3}'},{t:'2 tilde\n~ → $HOME'},{t:'3 $var $(cmd)\n$((math))',stroke:CY},{t:'4 word\nsplitting',stroke:MG},{t:'5 globs\n*.txt',stroke:AM},{t:'6 quote\nremoval',stroke:LM}],{perRow:3,bw:120,bh:52,gap:40,label:'Bash expansion order'})}
  ]);

  /* ---------- Module 5: processes, services, packages, scheduling ---------- */
  I.p3m5=(E.p3m5||[]).concat([
   {cap:"How a service is stopped: systemd sends SIGTERM, waits up to TimeoutStopSec (90 seconds by default), and only then sends SIGKILL. The exit status tells you which happened, because a process killed by signal N exits with 128 + N.",
    svg:svg(560,170,`${box(10,24,130,46,'systemctl stop\n→ SIGTERM (15)',{stroke:AM,size:11})}${arrow(140,47,198,47,'')}
      ${box(200,24,160,46,'TimeoutStopSec\nwait up to 90 s',{size:11})}${arrow(360,47,418,47,'')}
      ${box(420,24,130,46,'still alive?\n→ SIGKILL (9)',{stroke:MG,size:11})}
      ${arrow(75,70,75,106,'')}${box(10,108,130,44,'clean exit\nstatus 0 or 143',{stroke:LM,size:11})}
      ${arrow(485,70,485,106,'')}${box(420,108,130,44,'killed\nstatus 137',{stroke:MG,size:11})}
      ${text(280,124,'exit status = 128 + signal',{size:11,color:DIM})}${text(280,144,'130 Ctrl-C · 137 KILL · 143 TERM',{size:10,color:DIM})}`,'Signal escalation during systemctl stop')},
   {cap:"Dependencies and ordering are separate in systemd. enable makes multi-user.target want the service (a symlink); Wants= pulls another unit in; After= only orders startup and pulls nothing in by itself.",
    svg:svg(560,200,`${box(190,8,180,40,'multi-user.target',{stroke:CY,bold:true})}
      ${box(10,112,180,46,'network-online.target',{size:11})}${box(370,112,180,46,'nginx.service',{stroke:LM,bold:true})}
      ${arrow(330,48,440,110,'wants')}
      ${arrow(368,126,192,126,'Wants= pulls in')}${arrow(368,148,192,148,'After= orders only',{dash:true,stroke:AM})}
      ${text(450,80,'enable = symlink in\ntarget.wants/',{anchor:'start',size:9,color:DIM})}
      ${text(280,186,'After= without Wants= starts nothing',{size:10,color:AM})}`,'systemd Wants versus After between units')},
   {cap:"The five cron fields read left to right: minute, hour, day of month, month, day of week. '30 6 * * 1' is 06:30 every Monday; */15 means every 15 minutes and 1-5 means Monday to Friday.",
    svg:svg(560,150,`${text(280,20,'30 6 * * 1  /opt/scripts/report.sh',{mono:true,size:13,color:CY})}
      ${[['minute','30'],['hour','6'],['day of month','*'],['month','*'],['weekday','1 = Mon']].map((f,i)=>box(20+i*106,40,96,46,f[0]+'\n'+f[1],{size:11,stroke:i===4?AM:'currentColor'})).join('')}
      ${text(280,108,'*/15 = every 15 min · 1-5 = Mon–Fri · 0 2 * * * = 02:00 daily',{size:10,color:DIM})}
      ${text(280,132,'escape % as \\% · absolute paths · redirect output',{size:10,color:AM})}`,'Cron field layout')}
  ]);

  /* ---------- Module 6: users, security, networking ---------- */
  I.p3m6=(E.p3m6||[]).concat([
   {cap:"Where the firewall lives: netfilter hooks inside the kernel. A packet for this host passes PREROUTING and INPUT before reaching a socket; a routed packet passes FORWARD and POSTROUTING. ufw and firewalld only generate the nftables rules attached to these hooks.",
    svg:svg(560,212,`${box(10,82,80,40,'NIC in')}${arrow(90,102,108,102,'')}${box(110,82,100,40,'PREROUTING',{size:11})}${arrow(210,102,228,102,'')}
      ${box(230,82,90,40,'routing\ndecision',{size:11})}${arrow(275,82,338,40,'for me')}${box(340,20,90,38,'INPUT',{stroke:CY,bold:true})}${arrow(430,39,448,39,'')}${box(450,20,100,38,'socket\nsshd :22',{stroke:LM,size:11})}
      ${arrow(320,102,338,102,'')}${box(340,82,90,40,'FORWARD',{size:11})}${arrow(430,102,448,102,'')}${box(450,82,100,40,'POSTROUTING\n→ NIC out',{size:10})}
      ${box(10,152,320,44,'ufw · firewalld  →  generate nftables rules',{stroke:AM,size:11})}
      ${text(445,166,'nft list ruleset',{size:10,mono:true,color:DIM})}${text(445,184,'shows the real rules',{size:10,color:DIM})}`,'Netfilter hooks on the packet path')},
   {cap:"The first column to read in ss -tulpn is the local address. 0.0.0.0 (or [::]) listens on every interface and is reachable from the network if the firewall allows; 127.0.0.1 accepts only connections from the same machine.",
    svg:compare({t:'0.0.0.0:22  (sshd)',draw:x=>`${box(x+20,44,220,36,'listens on every interface',{stroke:CY,size:11})}${text(x+130,104,'reachable from the network\nif the firewall allows it',{size:11,color:DIM})}${box(x+50,128,160,28,'audit: should it be open?',{stroke:AM,size:10})}`},
                {t:'127.0.0.1:3306  (mysqld)',draw:x=>`${box(x+20,44,220,36,'listens on loopback only',{stroke:LM,size:11})}${text(x+130,104,'only processes on this\nhost can connect',{size:11,color:DIM})}${box(x+50,128,160,28,'correct for a local DB',{stroke:LM,size:10})}`},{h:172,label:'Reading the local address column in ss output'})},
   {cap:"How a name becomes an address on Ubuntu. Programs ask the C library, which follows nsswitch.conf: /etc/hosts first, then DNS through the systemd-resolved stub at 127.0.0.53. getent hosts follows this whole path; dig skips straight to DNS.",
    svg:flow([{t:'app\ngetaddrinfo()'},{t:'nsswitch.conf\nfiles → dns'},{t:'/etc/hosts',stroke:AM},{t:'resolved\n127.0.0.53',stroke:CY},{t:'upstream DNS\n1.1.1.1',stroke:LM}],{perRow:5,bw:92,bh:52,gap:16,label:'Name resolution path through nsswitch, hosts file and systemd-resolved'})}
  ]);

  /* ---------- Module 7: scripting and environment ---------- */
  I.p3m7=(E.p3m7||[]).concat([
   {cap:"Which startup files bash reads depends on how it was started. Login shells read /etc/profile and the first personal profile; new terminal tabs read ~/.bashrc; scripts, cron jobs and systemd services read none — the root of most 'works in my terminal, fails in cron' reports.",
    svg:svg(560,190,`${box(10,8,170,38,'login shell\n(SSH, console)',{stroke:CY,size:11})}${box(10,56,170,28,'/etc/profile',{size:11})}${arrow(95,84,95,94,'')}
      ${box(10,96,170,40,'first of ~/.bash_profile,\n~/.bash_login, ~/.profile',{size:10})}${arrow(95,136,95,146,'')}${box(10,148,170,28,'Ubuntu: .profile → .bashrc',{size:10,dash:true})}
      ${box(195,8,170,38,'interactive non-login\n(new terminal tab)',{stroke:LM,size:11})}${box(195,56,170,28,'~/.bashrc',{stroke:LM,size:11})}
      ${box(380,8,170,38,'non-interactive\n(script, cron, systemd)',{stroke:MG,size:11})}${box(380,56,170,40,'reads none of them\n(minimal environment)',{stroke:MG,size:11})}
      ${box(380,108,170,40,'set PATH in the script\nor Environment= in unit',{stroke:AM,size:10})}`,'Bash startup files by shell type')},
   {cap:"Parameter expansion trims paths inside the shell with no extra process: % removes from the end, # from the front, doubled for the longest match. Applied to one path it yields the directory, the file name and the name without its extension.",
    svg:svg(560,180,`${text(280,16,'f=/var/log/app/error.log.gz',{mono:true,size:12,color:CY})}
      ${box(40,30,200,30,'/var/log/app',{mono:true,size:12})}${box(240,30,20,30,'/',{mono:true,stroke:DIM,size:12})}${box(260,30,170,30,'error.log',{mono:true,size:12})}${box(430,30,80,30,'.gz',{mono:true,stroke:AM,size:12})}
      ${text(20,86,DL+'f%/*}',{anchor:'start',mono:true,size:11,color:LM})}${text(150,86,'→ /var/log/app   (directory)',{anchor:'start',size:11})}
      ${text(20,110,DL+'f##*/}',{anchor:'start',mono:true,size:11,color:LM})}${text(150,110,'→ error.log.gz   (file name)',{anchor:'start',size:11})}
      ${text(20,134,DL+'f%.gz}',{anchor:'start',mono:true,size:11,color:LM})}${text(150,134,'→ /var/log/app/error.log',{anchor:'start',size:11})}
      ${text(20,158,DL+'#f}',{anchor:'start',mono:true,size:11,color:LM})}${text(150,158,'→ 25 characters',{anchor:'start',size:11})}`,'Parameter expansion applied to a path')},
   {cap:"Exit statuses are a language. 0 is success, small numbers are the program's own failures, 126 and 127 mean the command could not be executed or found, and anything above 128 means a signal killed it.",
    svg:svg(560,130,`${box(10,24,60,46,'0\nsuccess',{stroke:LM,size:11})}${box(70,24,170,46,'1–125\nprogram-defined failure',{size:11})}${box(240,24,70,46,'126\nnot exec',{stroke:AM,size:11})}${box(310,24,70,46,'127\nnot found',{stroke:AM,size:11})}${box(380,24,170,46,'128 + N\nkilled by signal N',{stroke:MG,size:11})}
      ${text(465,88,'130 Ctrl-C · 137 KILL · 143 TERM',{size:10,color:MG})}
      ${text(260,114,'check with: cmd; echo $?   ·   set -e stops at the first non-zero',{size:10,color:DIM})}`,'Ranges of shell exit status codes')}
  ]);

  /* ---------- Module 8 (new): storage and boot ---------- */
  I.p3m8=[
   {cap:"Names point to inodes; inodes point to data. Two hard links are two directory entries with the same inode number (link count 2). A symbolic link is its own small inode whose content is a path. Space is freed only when the link count is zero and no process holds the file open.",
    svg:svg(560,214,`${text(105,16,'directory demo/',{size:11,bold:true,color:CY})}${box(10,26,190,120,'',{stroke:DIM})}
      ${text(20,52,'a.txt    → 1213014',{anchor:'start',mono:true,size:11})}${text(20,84,'hard.txt → 1213014',{anchor:'start',mono:true,size:11})}${text(20,116,'soft.txt → 1213017',{anchor:'start',mono:true,size:11})}
      ${box(250,22,150,70,'inode 1213014\nregular · links: 2\nmode 0644 · 3 bytes',{stroke:LM,size:10})}${box(250,116,150,60,'inode 1213017\nsymlink · links: 1\ncontent: "a.txt"',{stroke:AM,size:10})}
      ${box(440,32,110,50,'data blocks\n(3 bytes)',{size:10})}
      ${arrow(152,50,248,48,'')}${arrow(152,82,248,64,'')}${arrow(152,114,248,140,'')}${arrow(400,57,438,57,'')}
      ${text(280,200,'rm a.txt → links 1; space freed at 0 links and no open fds',{size:10,color:AM})}`,'Directory entries, inodes and data blocks for hard and symbolic links')},
   {cap:"The boot chain on a UEFI machine with Secure Boot. Each link verifies or loads the next: firmware loads shim from the EFI system partition, shim verifies GRUB, GRUB loads the kernel and initramfs, the initramfs mounts the real root, and systemd brings up the default target.",
    svg:flow([{t:'UEFI firmware\nNVRAM entries',stroke:DIM},{t:'shim on ESP\nSecure Boot',stroke:AM},{t:'GRUB 2\ngrub.cfg'},{t:'kernel +\ninitramfs',stroke:CY},{t:'systemd\nPID 1',stroke:LM},{t:'default.target\nmulti-user',stroke:LM}],{perRow:3,bw:130,bh:52,gap:60,edges:['verifies','loads','vmlinuz + initramfs','root fs','starts'],label:'Boot chain from UEFI to a systemd target'})},
   {cap:"LVM's three layers. Disks become physical volumes, physical volumes are pooled into a volume group of 4 MiB extents, and logical volumes are carved from the pool — so a mounted file system can grow online with lvextend -r.",
    svg:stack([{t:'xfs file system mounted at /data',stroke:LM,side:'df -h /data'},{t:'LV /dev/data/web  (50 GiB)',stroke:CY,side:'lvs · lvextend -r'},{t:'VG data: pool of 4 MiB extents',stroke:AM,side:'vgs · vgextend'},{t:'PV /dev/sdb      PV /dev/sdc',side:'pvs · pvcreate'},{t:'two physical disks',stroke:DIM,side:'lsblk'}],{w:300,side:true,label:'LVM layers from disks to a mounted file system'})},
   {cap:"Journaling in four steps. The change is described in the journal and committed before the real structures are touched, so a crash before the commit discards the entry and a crash after it is replayed at the next mount — seconds instead of a full-disk check.",
    svg:svg(560,190,`${text(280,16,'one metadata change, journaled',{size:11,bold:true,color:CY})}
      ${box(10,34,120,48,'1 write intent\nto journal',{stroke:CY,size:11})}${arrow(130,58,148,58,'')}${box(150,34,120,48,'2 commit\nrecord',{stroke:AM,size:11})}${arrow(270,58,288,58,'')}
      ${box(290,34,120,48,'3 write real\nstructures',{size:11})}${arrow(410,58,428,58,'')}${box(430,34,120,48,'4 checkpoint\nfree journal',{stroke:LM,size:11})}
      ${box(10,108,260,40,'crash before commit → entry discarded',{stroke:MG,dash:true,size:10})}${box(290,108,260,40,'crash after commit → replayed at mount',{stroke:LM,dash:true,size:10})}
      ${text(280,174,'recovery in seconds, not a full-disk fsck',{size:10,color:DIM})}`,'Journaling write sequence and crash recovery')}
  ];

  /* ---------- Module 9 (new): containers and troubleshooting ---------- */
  I.p3m9=[
   {cap:"A container is an ordinary host process: namespaces decide what it can see, a cgroup decides what it can use, overlayfs gives it a root file system, and dropped capabilities, seccomp and an LSM profile shrink what it may do. Underneath, every container shares one host kernel.",
    svg:svg(560,224,`${box(8,8,544,152,'',{dash:true,stroke:DIM})}${text(280,22,'one container = an ordinary host process',{size:11,bold:true,color:CY})}
      ${box(200,40,160,40,'process (PID 1 inside)',{stroke:LM,bold:true,size:11})}
      ${box(20,36,160,48,'namespaces\npid mnt net uts ipc user',{stroke:CY,size:10})}${box(380,36,160,48,'cgroup v2\ncpu.max · memory.max',{stroke:AM,size:10})}
      ${box(20,100,160,46,'overlayfs root\nimage layers + upper',{size:10})}${box(380,100,160,46,'privileges dropped\ncaps · seccomp · LSM',{stroke:MG,size:10})}
      ${arrow(180,60,198,60,'')}${arrow(380,60,362,60,'')}${arrow(180,118,240,82,'')}${arrow(380,118,320,82,'')}
      ${box(8,172,544,40,'ONE shared host kernel — the wall a VM has and a container lacks',{stroke:MG,bold:true,size:11})}`,'Container anatomy: namespaces, cgroups, overlayfs, dropped privileges, shared kernel')},
   {cap:"cgroup v2 limits are plain files with plain arithmetic. cpu.max holds a quota and a period in microseconds, so 150000 100000 is 1.5 CPUs; memory.max is bytes, so 512 MiB is 536,870,912; memory.events counts the OOM kills that end in exit status 137.",
    svg:svg(560,200,`${text(280,14,'cpu.max = quota period (µs of CPU per period)',{size:11,bold:true,color:CY})}
      ${text(20,44,'150000 100000',{anchor:'start',mono:true,size:11})}${box(200,30,100,26,'1 CPU',{stroke:AM,size:10})}${box(300,30,50,26,'½',{stroke:AM,size:10})}${text(366,44,'= 1.5 CPUs (--cpus 1.5)',{anchor:'start',size:11,color:AM})}
      ${text(20,84,'50000 100000',{anchor:'start',mono:true,size:11})}${box(200,70,50,26,'½',{stroke:LM,size:10})}${text(366,84,'= 0.5 CPU (CPUQuota=50%)',{anchor:'start',size:11,color:LM})}
      ${text(20,124,'memory.max',{anchor:'start',mono:true,size:11})}${text(200,124,'512 × 2^20 = 536,870,912 bytes',{anchor:'start',size:11,color:CY})}
      ${text(20,154,'memory.events',{anchor:'start',mono:true,size:11})}${text(200,154,'oom_kill 1  →  exit status 137',{anchor:'start',size:11,color:MG})}
      ${text(280,186,'/sys/fs/cgroup/system.slice/app.service/',{size:10,mono:true,color:DIM})}`,'cgroup v2 CPU and memory limit arithmetic')},
   {cap:"Triage for a high load average. vmstat 1 separates the four causes in one line: many runnable tasks with high user time is CPU, many blocked tasks with high I/O wait is storage, swap traffic is memory pressure, and high steal time is the hypervisor.",
    svg:svg(560,214,`${box(180,6,200,36,'load is high: run vmstat 1',{stroke:CY,bold:true,size:11})}
      ${[['r ≫ cores\nus high','CPU-bound\npidstat · top',LM],['b high\nwa high','disk or NFS\niostat -xz 1',AM],['si/so high\navailable low','memory\nfree · OOM log',MG],['st high\n(on a VM)','hypervisor\nask provider',DIM]].map((c,i)=>arrow(280,42,70+i*140,74,'')+box(10+i*140,76,120,48,c[0],{size:11})+arrow(70+i*140,124,70+i*140,146,'')+box(10+i*140,148,120,48,c[1],{stroke:c[2],size:11})).join('')}`,'Diagnosing a high load average with vmstat')},
   {cap:"How overlayfs builds a container's root. Read-only image layers are shared by every container from the image; one thin writable upper layer takes every change (a modified file is copied up first) and disappears with the container — which is why data belongs in volumes.",
    svg:svg(560,200,`${box(10,8,380,36,'merged view = container root /',{stroke:LM,bold:true,size:11})}${text(402,26,'what the process sees',{anchor:'start',size:10,color:DIM})}
      ${box(10,56,380,32,'upper (writable): changed + new files',{stroke:AM,size:11})}${text(402,66,'copy-up on write;',{anchor:'start',size:10,color:AM})}${text(402,80,'deleted with container',{anchor:'start',size:10,color:AM})}
      ${box(10,100,380,28,'image layer 3: app code',{size:10})}${box(10,132,380,28,'image layer 2: pip install',{size:10})}${box(10,164,380,28,'image layer 1: base OS (debian:13)',{stroke:DIM,size:10})}
      ${text(402,140,'read-only, shared by',{anchor:'start',size:10,color:DIM})}${text(402,154,'every container',{anchor:'start',size:10,color:DIM})}`,'overlayfs layers of a container image')}
  ];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
