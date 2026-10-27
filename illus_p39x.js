/* Third figures — Domain 39: Mobile App Development. Adds to the figures in illus_p39.js (never replaces them). */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const add=(id,figs)=>{ window.ILLUS=window.ILLUS||{}; window.ILLUS[id]=(window.ILLUS[id]||[]).concat(figs); };

  /* m1 — one tap, traced (Android cold start) */
  add('p39m1',[{cap:"One tap, traced on Android 17. The launcher asks the system to start the app, Zygote forks a process that already holds the framework, ART maps the DEX code and applies the Baseline Profile so hot paths are precompiled, and only then do your Application object, onCreate and the first Compose frame run. A well-built app does all of it in under 500 ms; Android vitals calls a 5-second cold start slow.",
    svg:svg(560,190,`${box(10,10,160,52,'1 tap the icon\nlauncher asks the system',{size:10,stroke:CY})}${arrow(171,36,198,36,'')}
      ${box(200,10,160,52,'2 Zygote forks a child\nframework already loaded',{size:10})}${arrow(361,36,388,36,'')}
      ${box(390,10,160,52,'3 ART maps DEX code\n+ Baseline Profile',{size:10,stroke:AM})}
      <path d="M470 62 L470 80 L90 80 L90 93" fill="none" stroke="currentColor" stroke-width="1.3" marker-end="url(#ah)"/>
      ${box(10,96,160,52,'4 Application object\ncreated',{size:10})}${arrow(171,122,198,122,'')}
      ${box(200,96,160,52,'5 Activity onCreate\nruns',{size:10})}${arrow(361,122,388,122,'')}
      ${box(390,96,160,52,'6 Compose draws\nthe first frame',{size:10,stroke:LM,color:LM,bold:true})}
      ${text(280,166,'well built: under 500 ms',{size:11,color:LM,bold:true})}
      ${text(280,182,'Android vitals: 5 s cold start is slow',{size:10,color:DIM})}`,
      'Android cold start in six steps from the launcher tap through Zygote, ART and the Baseline Profile to the first Compose frame')}]);

  /* m2 — LazyColumn and keyed recomposition */
  const rows=()=>{ let s=''; for(let i=0;i<15;i++){ const hot=i===7; s+=box(165,36+i*10,165,8,'',{rx:2,sw:hot?1.6:1,stroke:hot?MG:DIM,fill:hot?MG:'none'}); } return s; };
  add('p39m2',[{cap:"Why a 10,000-note list doesn't stutter. LazyColumn composes only the roughly 15 rows on screen and reuses their slots as you scroll. When note 4,217 is edited, Room emits a new list, the ViewModel's StateFlow emits new UI state, and Compose compares the stable keys: 14 rows are skipped and one recomposes — not the whole screen.",
    svg:svg(560,222,`${box(30,24,80,172,'',{stroke:DIM})}${box(30,92,80,30,'',{stroke:CY,sw:1.8})}
      ${line(110,92,163,36,{dash:true,stroke:DIM})}${line(110,122,163,184,{dash:true,stroke:DIM})}
      ${text(70,208,'Room: 10,000 notes',{size:10,color:DIM})}${text(247,24,'on screen: ≈ 15 rows composed',{size:10,color:CY})}
      ${rows()}
      ${box(372,30,175,40,'edit note 4,217:\nRoom emits a new list',{size:10,stroke:AM})}
      ${box(372,90,175,40,'keys compared:\n14 rows unchanged, skipped',{size:10,stroke:DIM})}
      ${box(372,150,175,40,'1 row recomposes\n(not 10,000)',{size:11,stroke:LM,color:LM,bold:true})}
      ${arrow(334,60,370,105,'')}${arrow(334,110,370,168,'',{stroke:MG})}
      ${text(247,206,'key = { it.id } on every row',{size:10,mono:true,color:DIM})}`,
      'A lazy list composes only the 15 visible rows of 10,000; after an edit, keyed comparison recomposes one row and skips fourteen')}]);

  /* m3 — the lawful roads to iOS work without a Mac */
  const route=(x,need,how,limit,st)=>box(x,58,125,34,need,{size:10})+line(x+62,92,x+62,106)+box(x,106,125,46,how,{size:10,stroke:st})+box(x,162,125,32,limit,{size:10,stroke:DIM,dash:true,color:DIM});
  add('p39m3',[{cap:"The lawful roads to iOS development, chosen by what you need. The Swift language runs free on Linux or Windows; CI macOS runners and Xcode Cloud build, test and upload; a rented cloud Mac gives full Xcode by the month; and a used Apple-silicon Mac mini is the cheapest legitimate machine for the long run. Running macOS on non-Apple hardware violates its license.",
    svg:svg(560,238,`${box(200,8,160,28,'What do you need?',{size:11,stroke:CY,bold:true})}
      ${line(280,36,72,58)}${line(280,36,207,58)}${line(280,36,342,58)}${line(280,36,477,58)}
      ${route(10,'learn the language','Swift on Linux\nor Windows: free','no SwiftUI,\nno Simulator',LM)}
      ${route(145,'build, test, upload','CI macOS runners;\nXcode Cloud 25 h/mo','no interactive\ndesign work',CY)}
      ${route(280,'full Xcode now','cloud Mac\n$20–100+ per month','latency;\nmonthly bills',AM)}
      ${route(415,'a long-term career','used Apple-silicon\nMac mini','cheapest legitimate\ndev machine',LM)}
      ${box(10,204,540,26,'✗ macOS on non-Apple hardware: license violation',{size:11,stroke:MG,color:MG,dash:true})}`,
      'Decision tree of lawful routes to iOS development without owning a Mac, with the license-violating route crossed out')}]);

  /* m4 — the same BLE feature in three stacks */
  add('p39m4',[{cap:"The same Bluetooth OTDR feature in three stacks. Compose calls the platform BLE API directly; Flutter needs the flutter_blue_plus plugin or a platform channel; Expo needs a config plugin and a native module that someone writes in Kotlin and Swift. Cross-platform code still reaches native code at the hardware edge — the framework fastest to start is slowest there.",
    svg:svg(560,232,`${text(95,14,'Compose (native)',{bold:true,color:CY,size:11})}${text(280,14,'Flutter',{bold:true,color:AM,size:11})}${text(465,14,'Expo (React Native)',{bold:true,color:MG,size:11})}
      ${box(10,26,170,32,'Kotlin app code',{size:11,stroke:CY})}${arrow(95,58,95,178,'direct call')}
      ${box(195,26,170,32,'Dart app code',{size:11,stroke:AM})}${arrow(280,58,280,76,'')}
      ${box(195,78,170,40,'flutter_blue_plus plugin\nor a platform channel',{size:10,stroke:AM})}${arrow(280,118,280,178,'')}
      ${box(380,26,170,32,'TypeScript app code',{size:11,stroke:MG})}${arrow(465,58,465,76,'')}
      ${box(380,78,170,40,'config plugin +\nnative module',{size:10,stroke:MG})}${arrow(465,118,465,132,'')}
      ${box(380,134,170,36,'Kotlin + Swift\nyou write anyway',{size:10,stroke:MG,color:MG,bold:true})}${arrow(465,170,465,178,'')}
      ${box(10,180,540,28,'platform Bluetooth LE API (Android / iOS)',{size:11,stroke:LM})}
      ${text(280,222,'quickest start, slowest hardware edge',{size:10,color:DIM})}`,
      'Three paths from app code to the Bluetooth LE API: direct in Compose, through a plugin in Flutter, through a native module in Expo')}]);

  /* m5 — the frame budget */
  const fr=(t0,ms,y,st,lab)=>box(40+t0*7.5,y,ms*7.5,24,lab,{size:10,stroke:st,color:st,rx:3});
  const ticks=()=>[0,16.7,33.4,50.1,66.8].map((t,i)=>{ const x=40+t*7.5; return line(x,33,x,40,{stroke:DIM})+line(x,53,x,83,{dash:true,stroke:DIM})+line(x,123,x,153,{dash:true,stroke:DIM})+text(x,26,i===0?'0 ms':String(t),{size:9,color:DIM}); }).join('');
  add('p39m5',[{cap:"The frame budget, from the crew-photo example. At 60 Hz a frame must be ready every 16.7 ms (8.3 ms at 120 Hz). Rows that formatted dates and parsed EXIF during composition took 22 ms, overran each vsync, and the old frame was shown again — jank. Moving that work into the repository's mapping step dropped frames to 9 ms, inside the budget.",
    svg:svg(560,200,`${text(280,11,'ONE FRAME EVERY 16.7 ms AT 60 Hz',{bold:true,color:CY,size:11})}
      ${ticks()}
      ${text(42,48,'before: date + EXIF work in composition',{anchor:'start',size:10,color:MG})}
      ${fr(0,22,56,MG,'22 ms')}${fr(22,22,56,MG,'22 ms')}
      ${text(205,94,'overruns its vsync: old frame repeats',{size:10,color:MG})}
      ${text(42,118,'after: work moved to the repository',{anchor:'start',size:10,color:LM})}
      ${fr(0,9,126,LM,'9 ms')}${fr(16.7,9,126,LM,'9 ms')}${fr(33.4,9,126,LM,'9 ms')}${fr(50.1,9,126,LM,'9 ms')}
      ${text(280,176,'every frame inside its 16.7 ms slot',{size:10,color:LM})}
      ${text(280,192,'120 Hz: the budget is 8.3 ms',{size:10,color:DIM})}`,
      'Frame timeline at 60 hertz: 22 millisecond frames overrun the vsync and cause jank, 9 millisecond frames fit inside 16.7 milliseconds')}]);

  /* m6 — push by token */
  add('p39m6',[{cap:"Push works by token. The app registers with the platform service and receives a device token, sends it to your server, and your server later asks FCM (HTTP v1, short-lived OAuth 2.0 tokens from a service account) or APNs (HTTP/2, a JWT signed with your .p8 key) to deliver. The platform, not your server, reaches the phone — and silent pushes are throttled, so correctness must never depend on them.",
    svg:svg(560,232,`${box(10,10,120,28,'app on the phone',{size:11,stroke:CY})}${box(220,10,120,28,'your server',{size:11,stroke:AM})}${box(400,10,140,28,'FCM / APNs',{size:11,stroke:LM})}
      ${line(70,38,70,192,{dash:true,stroke:DIM})}${line(280,38,280,110,{dash:true,stroke:DIM})}${line(280,132,280,192,{dash:true,stroke:DIM})}${line(470,38,470,192,{dash:true,stroke:DIM})}
      ${arrow(72,56,468,56,'1 register')}
      ${arrow(468,78,72,78,'2 device token')}
      ${arrow(72,100,278,100,'3 send token')}
      ${box(225,110,110,22,'stores the token',{size:10,stroke:AM})}
      ${arrow(282,150,468,150,'4 send message')}
      ${arrow(468,176,72,176,'5 notification delivered',{color:LM})}
      ${text(280,208,'FCM: OAuth 2.0 · APNs: .p8 JWT',{size:10,color:DIM})}
      ${text(280,224,'never depend on silent pushes',{size:10,color:MG})}`,
      'Sequence diagram of push notifications: register, receive a device token, send it to your server, server asks FCM or APNs to deliver')}]);

  /* m7 — why rollouts start small */
  const bar=(y,lab,pct,st,val)=>text(10,y+4,lab,{anchor:'start',size:10,lh:12})+box(130,y-6,pct*200,22,'',{stroke:st,rx:3})+text(136+pct*200,y+5,val,{anchor:'start',size:11,bold:true,color:st});
  add('p39m7',[{cap:"Why rollouts start small, from the weather 1.4 example. A new crash hits 1.5% of users on the new build: at a 10% rollout of 40,000 daily users it adds 0.15 points to the 0.4% baseline (60 people a day); at 100% it would reach about 1.9% (600 a day), past Android vitals' 1.09% bad-behavior line. Halting stops new installs only, so a remote-config flag protects those who already updated.",
    svg:svg(560,215,`${text(280,11,'A 1.5% CRASH AT 10% VERSUS 100%',{bold:true,color:CY,size:11})}
      ${line(348,32,348,150,{dash:true,stroke:AM,sw:1.6})}${text(348,26,'1.09% bad-behavior line',{size:10,color:AM})}
      ${bar(46,'baseline',0.4,DIM,'0.4%')}
      ${bar(84,'10% rollout\n60 people/day',0.55,AM,'0.55%')}
      ${bar(122,'100% rollout\n600 people/day',1.9,MG,'1.9%')}
      ${box(10,164,170,40,'halt the rollout:\nnew installs stop',{size:10,stroke:AM})}${arrow(181,184,193,184,'')}
      ${box(195,164,170,40,'remote-config flag off\nfor users already updated',{size:10,stroke:LM})}${arrow(366,184,378,184,'')}
      ${box(380,164,170,40,'ship 1.4.1:\nrollouts restart',{size:10,stroke:CY})}`,
      'Crash-rate bars: baseline 0.4 percent, 0.55 percent at a 10 percent rollout, 1.9 percent at 100 percent, against a 1.09 percent threshold')}]);
})();
