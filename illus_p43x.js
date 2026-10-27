/* Third figures — Domain 43: macOS, iOS & Apple Device Management. Adds to the figures in illus_p43.js (never replaces them). */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const add=(id,figs)=>{ window.ILLUS=window.ILLUS||{}; window.ILLUS[id]=(window.ILLUS[id]||[]).concat(figs); };

  /* m1 — secure boot chain and Data Protection key entanglement */
  add('p43m1',[{cap:"Two chains of trust on every iPhone. At boot, immutable Boot ROM holding Apple's root public key verifies iBoot, iBoot verifies the kernel, and only Apple-signed code runs. For data, the Secure Enclave entangles your passcode with a device-unique key that never leaves the hardware, and the resulting class keys protect each file's key.",
    svg:svg(560,226,`${text(280,12,'Secure boot: each stage checks the next',{bold:true,color:CY,size:11})}
      ${box(10,26,130,50,'Boot ROM\nimmutable\nApple root key',{stroke:CY,size:10})}${arrow(140,51,170,51,'')}
      ${box(170,26,100,50,'iBoot',{stroke:CY,size:11})}${arrow(270,51,300,51,'')}
      ${box(300,26,100,50,'kernel',{stroke:CY,size:11})}${arrow(400,51,430,51,'')}
      ${box(430,26,120,50,'only Apple-signed\ncode · sandboxed\napps',{stroke:LM,size:10})}
      ${text(280,90,'each arrow: verify the signature, then run',{size:9,color:DIM})}
      ${text(280,112,'Data Protection: keys stay in hardware',{bold:true,color:MG,size:11})}
      ${box(10,124,330,94,'',{stroke:MG,dash:true})}${text(175,136,'Secure Enclave · separate processor',{size:9,color:MG})}
      ${box(22,146,150,30,'your passcode',{size:10})}${box(22,182,150,30,'device-unique key\n(never leaves chip)',{size:9})}
      ${arrow(172,161,214,170,'')}${arrow(172,197,214,186,'')}
      ${box(214,158,116,36,'class keys\n(entangled)',{stroke:MG,size:10})}
      ${arrow(330,176,394,176,'wrap')}
      ${box(394,138,156,76,'a key per file, by class:\nComplete\nComplete Unless Open\nUntil First User Auth\nNo Protection',{size:9,lh:12})}`,
      'Boot ROM to iBoot to kernel signature chain, and passcode plus device key protecting file keys')}]);

  /* m2 — TCC consent decisions */
  add('p43m2',[{cap:"TCC consent is a three-part key: one decision per user, per app, per service. An MDM PPPC profile can pre-grant some services such as Full Disk Access, but camera, microphone and screen recording still go to the user's prompt — and tccutil reset clears exactly one stored decision.",
    svg:svg(560,226,`${text(280,12,'TCC: one decision per user, app, service',{bold:true,color:CY,size:11})}
      ${box(10,40,120,48,'app asks for\na protected service',{stroke:CY,size:10})}${arrow(130,64,170,64,'')}
      ${box(170,40,160,48,'can an MDM PPPC\nprofile pre-grant it?',{stroke:AM,size:10})}
      ${arrow(330,54,380,40,'yes')}${box(380,22,170,40,'allowed by profile\ne.g. Full Disk Access',{stroke:LM,size:10})}
      ${arrow(330,76,380,96,'no')}${box(380,78,170,46,'user prompt\ncamera · mic · screen',{stroke:MG,size:10})}
      ${arrow(465,124,465,154,'')}${text(472,139,'stored',{anchor:'start',size:9,color:DIM})}
      ${box(10,154,120,34,'user: alice',{size:10})}${text(145,171,'×',{size:14,bold:true})}
      ${box(160,154,150,34,'app: com.vendor.app',{size:10,mono:true})}${text(320,171,'×',{size:14,bold:true})}
      ${box(330,154,100,34,'service: Camera',{size:10})}${text(440,171,'=',{size:14,bold:true})}
      ${box(450,154,100,34,'one decision',{stroke:MG,size:10})}
      ${text(280,210,'tccutil reset Camera com.vendor.app → clears one',{size:9,mono:true,color:DIM})}`,
      'TCC consent flow: PPPC pre-grant or user prompt, stored per user, app and service')}]);

  /* m3 — what each repair touches */
  const cell=(x,y,w,t,c)=>box(x,y,w,38,t,{stroke:c,color:c,size:10});
  add('p43m3',[{cap:"What each repair actually touches. A reinstall from recoveryOS replaces the sealed system and keeps the Data volume; a DFU revive reinstalls firmware and recoveryOS and keeps data; only a DFU restore erases everything. On an iPhone, Update keeps data and Restore erases it.",
    svg:svg(560,214,`${text(85,16,'action',{bold:true,color:CY,size:10})}${text(235,16,'sealed system',{bold:true,color:CY,size:10})}${text(370,16,'Data (your files)',{bold:true,color:CY,size:10})}${text(495,16,'firmware + recoveryOS',{bold:true,color:CY,size:9})}
      ${box(10,28,150,38,'reinstall macOS\nfrom recoveryOS',{size:10})}${cell(170,28,130,'replaced',AM)}${cell(310,28,120,'kept',LM)}${cell(440,28,110,'—',DIM)}
      ${box(10,74,150,38,'DFU revive',{size:10})}${cell(170,74,130,'—',DIM)}${cell(310,74,120,'kept',LM)}${cell(440,74,110,'reinstalled',AM)}
      ${box(10,120,150,38,'DFU restore',{size:10})}${cell(170,120,130,'erased, reinstalled',MG)}${cell(310,120,120,'erased',MG)}${cell(440,120,110,'reinstalled',AM)}
      ${text(280,178,'iPhone recovery: Update keeps data · Restore erases',{size:10,color:DIM})}
      ${text(280,198,'least destructive first; back up before restore',{size:10,color:AM})}`,
      'Which volumes a reinstall, a DFU revive and a DFU restore change')}]);

  /* m4 — choosing the enrollment path */
  add('p43m4',[{cap:"Choosing the enrollment path. Personal devices get account-driven User Enrollment, which keeps work data on its own volume; organization-owned devices bought through Apple channels use Automated Device Enrollment (supervised, not removable), and others go through Apple Configurator, supervised and removable only during a 30-day provisional period.",
    svg:svg(560,246,`${box(195,8,170,36,'who owns the device?',{stroke:CY,bold:true,size:11})}
      ${arrow(250,44,120,84,'personal')}${arrow(330,44,420,84,'org-owned')}
      ${box(10,84,180,46,'Account-driven\nUser Enrollment',{stroke:LM,size:11})}
      ${text(100,144,'unsupervised · user can remove',{size:9,color:DIM})}${text(100,157,'work data on its own volume',{size:9,color:DIM})}
      ${box(330,84,220,40,'bought through Apple channels?',{stroke:AM,size:10})}
      ${arrow(410,124,360,160,'yes')}${arrow(470,124,490,160,'no')}
      ${box(300,160,120,46,'Automated Device\nEnrollment (ADE)',{stroke:CY,size:10})}
      ${box(430,160,120,46,'Apple\nConfigurator',{stroke:CY,size:10})}
      ${text(360,218,'supervised',{size:9,color:LM})}${text(360,231,'not removable',{size:9,color:LM})}
      ${text(490,218,'supervised',{size:9,color:LM})}${text(490,231,'removable for 30 days',{size:9,color:AM})}
      ${box(10,180,270,48,'MDM never reads messages,\nbrowsing or personal app data',{stroke:DIM,dash:true,size:10})}`,
      'Decision tree from device ownership to User Enrollment, Automated Device Enrollment or Apple Configurator')}]);

  /* m5 — a DDM update deadline, by the numbers */
  const X=d=>60+d*55, Y=p=>180-p*1.4;
  add('p43m5',[{cap:"Patching is a deadline problem, solved declaratively. With a DDM enforcement declaration users install when convenient — 60% of 2,000 Macs in the first three days — and the remaining 800 install themselves at the day-7 deadline, so the report shows about 99% by day 8, the stragglers being offline.",
    svg:svg(560,222,`${text(280,12,'DDM enforcement: target version + local deadline',{bold:true,color:CY,size:11})}
      ${line(60,36,60,180,{stroke:DIM})}${line(60,180,520,180,{stroke:DIM})}
      ${text(52,Y(100),'100%',{size:9,color:DIM,anchor:'end'})}${text(52,Y(60),'60%',{size:9,color:DIM,anchor:'end'})}${text(52,180,'0',{size:9,color:DIM,anchor:'end'})}
      ${line(60,Y(100),520,Y(100),{stroke:DIM,dash:true})}
      ${[0,1,2,3,4,5,6,7,8].map(d=>line(X(d),180,X(d),184,{stroke:DIM})+text(X(d),194,'day '+d,{size:9,color:DIM})).join('')}
      ${line(X(7),36,X(7),180,{stroke:AM,dash:true})}${text(X(7)+6,164,'deadline',{size:10,bold:true,color:AM,anchor:'start'})}
      <path d="M${X(0)} ${Y(0)} Q${X(1)} ${Y(45)} ${X(3)} ${Y(60)} L${X(7)} ${Y(60)} L${X(8)} ${Y(99)}" fill="none" stroke="${CY}" stroke-width="2.2"/>
      ${text(X(3),Y(60)-14,'60% = 1,200 Macs',{size:10,color:CY})}
      ${text(X(5),Y(60)+16,'users install when convenient',{size:9,color:DIM})}
      ${text(X(7)-8,Y(80),'800 install\nat the deadline',{size:10,color:AM,anchor:'end'})}
      ${text(X(8)+8,Y(99)+14,'≈ 99%',{size:10,bold:true,color:LM,anchor:'start'})}
      ${text(280,212,'stragglers are offline Macs',{size:9,color:DIM})}`,
      'Update compliance over eight days with a declarative deadline on day seven')}]);

  /* m6 — iCloud Private Relay and how a network should respond */
  add('p43m6',[{cap:"iCloud Private Relay splits trust across two relays run by different entities, so no single party sees both who you are and where you go. A network that must audit traffic should answer DNS for mask.icloud.com with NXDOMAIN, which prompts users to turn Relay off; silently dropping the packets just makes devices stall and retry.",
    svg:svg(560,240,`${text(280,12,'iCloud Private Relay: two hops',{bold:true,color:CY,size:11})}
      ${box(10,28,100,44,'iPhone · Mac\nSafari, DNS',{stroke:CY,size:10})}${arrow(110,50,160,50,'QUIC')}
      ${box(160,28,110,44,'relay 1\none entity',{stroke:MG,size:10})}${arrow(270,50,320,50,'')}
      ${box(320,28,110,44,'relay 2\nanother entity',{stroke:MG,size:10})}${arrow(430,50,480,50,'')}
      ${box(480,28,70,44,'website',{size:10})}
      ${text(215,84,'sees you, not the site',{size:9,color:DIM})}${text(375,84,'sees the site, not you',{size:9,color:DIM})}
      ${text(280,102,'no single party sees both',{size:10,bold:true,color:LM})}
      ${line(280,114,280,218,{stroke:DIM,dash:true})}
      ${text(140,126,'WRONG: drop it silently',{bold:true,color:MG,size:10})}${text(420,126,'RIGHT: answer the DNS query',{bold:true,color:LM,size:10})}
      ${box(20,138,240,30,'firewall drops relay packets',{stroke:MG,size:10})}${arrow(140,168,140,184,'')}
      ${box(20,184,240,30,'devices stall and retry',{stroke:MG,size:10})}
      ${box(300,138,240,30,'NXDOMAIN for mask.icloud.com',{stroke:LM,size:10})}${arrow(420,168,420,184,'')}
      ${box(300,184,240,30,'users prompted to turn Relay off',{stroke:LM,size:10})}
      ${text(280,232,'managed devices: MDM can disable Relay',{size:9,color:DIM})}`,
      'Private Relay two-hop path and the right and wrong ways for a network to block it')}]);

  /* m7 — the Jamf remediation loop */
  add('p43m7',[{cap:"Jamf's objects working as a loop. An extension attribute script reports FileVault Off at inventory, a smart group collects those Macs, a policy scoped to the group remediates at the next check-in (every 15 minutes by default), and the next recon drops the fixed Mac out of the group.",
    svg:svg(560,226,`${box(20,26,200,56,'extension attribute script\nprints <result>Off</result>',{stroke:CY,size:10})}
      ${arrow(220,54,340,54,'inventory field')}
      ${box(340,26,200,56,'smart group\n"FileVault EA is Off"',{stroke:AM,size:10})}
      ${arrow(440,82,440,136,'scopes')}
      ${box(340,136,200,56,'remediation policy\nscoped to the group',{stroke:MG,size:10})}
      ${arrow(340,164,220,164,'runs at check-in')}
      ${box(20,136,200,56,'Mac fixed; next recon\ndrops it from the group',{stroke:LM,size:10})}
      ${arrow(120,136,120,82,'sudo jamf recon')}
      ${text(280,109,'no human in the loop',{size:11,bold:true,color:LM})}
      ${text(80,214,'profile: state',{size:9,color:DIM})}${text(213,214,'policy: actions',{size:9,color:DIM})}${text(346,214,'smart group: scope',{size:9,color:DIM})}${text(480,214,'EA: your own field',{size:9,color:DIM})}`,
      'Extension attribute, smart group and policy forming an automatic remediation loop')}]);
})();
