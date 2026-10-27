/* Illustrations — Domain 39: Mobile App Development, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  /* ================= DOMAIN 39: Mobile ================= */
  I.p39m1=[{cap:"Two stacks, one idea: both platforms run apps as sandboxed processes on a Unix-like kernel. The real difference is the runtime: Android's ART executes DEX bytecode with mixed ahead-of-time and just-in-time compilation, while iOS runs Swift compiled ahead of time to ARM64, with no virtual machine.",
    svg:compare({t:'ANDROID',draw:x=>['Apps: Kotlin → DEX bytecode','Android framework + Jetpack','ART runtime · native libraries','HALs (Project Treble)','Linux kernel · Binder · SELinux'].map((t,i)=>box(x+20,40+i*40,220,32,t,{size:11,stroke:i===2?CY:(i===4?AM:'currentColor')})).join('')},
      {t:'iOS',draw:x=>['Apps: Swift → ARM64 code','SwiftUI · UIKit frameworks','dyld + Swift runtime, no VM','IOKit drivers (Apple only)','XNU kernel: Mach + BSD'].map((t,i)=>box(x+20,40+i*40,220,32,t,{size:11,stroke:i===2?MG:(i===4?AM:'currentColor')})).join('')},{h:250,label:'Android and iOS software stacks compared'})},
   {cap:"Both platforms run a lifecycle state machine you do not control. From the bottom states (an Android Activity that is stopped, an iOS app that is suspended) the system may kill the whole process without calling your code, so state must be saved before you get there.",
    svg:svg(560,215,`${text(280,16,'ANDROID ACTIVITY',{bold:true,size:11,color:CY})}
      ${['Created\nonCreate','Started\nonStart','Resumed\nonResume','Stopped\nonPause · onStop','Destroyed\nonDestroy'].map((t,i)=>box(14+i*108,28,92,42,t,{size:10,stroke:i===3?MG:CY})+(i<4?arrow(108+i*108,49,120+i*108,49,''):'')).join('')}
      ${text(280,96,'iOS APP',{bold:true,size:11,color:AM})}
      ${['Not running','Inactive','Active','Background\n(a few seconds)','Suspended'].map((t,i)=>box(14+i*108,108,92,42,t,{size:10,stroke:i===4?MG:AM})+(i<4?arrow(108+i*108,129,120+i*108,129,''):'')).join('')}
      ${box(120,170,320,34,'Killed without a callback → save early',{stroke:MG,size:11})}`,'Android Activity and iOS app lifecycle states')}];
  I.p39m2=[{cap:"Unidirectional data flow in the Compose notes app. Room emits a new list whenever the table changes, the ViewModel maps it to one UI state, and the composable recomposes only the rows that changed. Taps travel back up as events; nothing refreshes the screen by hand.",
    svg:svg(560,215,`${text(140,20,'emits',{size:10,color:DIM})}${text(280,20,'maps',{size:10,color:DIM})}${text(420,20,'collects',{size:10,color:DIM})}
      ${box(10,30,120,50,'Room · SQLite\n(source of truth)',{stroke:AM,size:11})}${box(150,30,120,50,'Repository\nFlow<List<Note>>',{size:10})}${box(290,30,120,50,'ViewModel\nStateFlow<UiState>',{stroke:CY,size:10})}${box(430,30,120,50,'NotesScreen\n(composable)',{stroke:LM,size:11})}
      ${arrow(131,55,148,55,'')}${arrow(271,55,288,55,'')}${arrow(411,55,428,55,'')}
      <path d="M490 81 L490 125 L370 125 L370 83" fill="none" stroke="${MG}" stroke-width="1.3" marker-end="url(#ah)"/>${text(430,138,'event: add(title)',{size:10,color:MG})}
      <path d="M310 81 L310 162 L70 162 L70 83" fill="none" stroke="${AM}" stroke-width="1.3" marker-end="url(#ah)"/>${text(190,175,'insert → Room emits again',{size:10,color:AM})}
      ${text(280,202,'state flows down · events flow up',{size:11,color:DIM})}`,'Compose state and event flow')},
   {cap:"Where state lives decides what survives. remember survives recomposition only; a ViewModel survives rotation but not process death; rememberSaveable and SavedStateHandle restore small values after process death; the database keeps everything durable.",
    svg:svg(560,215,`${text(270,20,'recompose',{bold:true,size:11})}${text(380,20,'rotation',{bold:true,size:11})}${text(490,20,'process death',{bold:true,size:11})}${line(14,34,546,34,{stroke:DIM})}
      ${[['remember { }',1,0,0],['rememberSaveable',1,1,1],['ViewModel',1,1,0],['SavedStateHandle',1,1,1],['Room database',1,1,1]].map((r,i)=>text(20,52+i*30,r[0],{anchor:'start',size:11,mono:true})+[1,2,3].map(j=>text(160+j*110,52+i*30,r[j]?'✓':'✗',{size:15,bold:true,color:r[j]?LM:MG})).join('')+line(14,66+i*30,546,66+i*30,{stroke:DIM,sw:0.5})).join('')}
      ${text(280,203,'Saved state holds small values only',{size:10,color:DIM})}`,'What Android state survives')}];
  I.p39m3=[{cap:"In SwiftUI every piece of state has an owner. ContentView owns the model and the city text; the TextField edits the city through a binding; .task(id:) runs the model's async load whenever the city changes, and only the views that read the changed property re-render.",
    svg:svg(560,240,`${box(170,12,220,46,'ContentView\n@State model · @State city',{stroke:CY,size:11})}
      ${box(15,100,160,46,'WeatherModel\n@Observable class',{stroke:MG,size:11})}${box(200,100,160,46,'TextField\n$city binding',{size:11})}${box(385,100,160,46,'Forecast text\nreads model.forecast',{size:11})}
      ${arrow(230,58,110,99,'owns')}${arrow(280,58,280,99,'')}${arrow(330,58,450,99,'passes')}
      ${box(15,186,200,44,'URLSession async/await\n+ JSONDecoder',{stroke:AM,size:11})}${arrow(80,146,80,184,'')}${text(90,166,'.task(id:) → load() sets forecast',{anchor:'start',size:10,color:DIM})}
      ${box(260,192,285,36,'property changes → readers re-render',{stroke:LM,size:11})}`,'SwiftUI state ownership and data flow')},
   {cap:"Value versus reference. Assigning a struct copies it, so changing the copy leaves the original alone: right for data such as a Forecast. Assigning a class copies a reference to one shared object: right for a model that several views observe.",
    svg:compare({t:'STRUCT (value)',draw:x=>box(x+20,44,100,40,'a: Forecast\n31 °C',{size:11,stroke:CY})+box(x+140,44,100,40,'b = a (copy)\n31 °C',{size:11,stroke:CY})+text(x+130,104,'b.tempC = 20',{mono:true,size:11})+box(x+20,118,100,40,'a\n31 °C',{size:11})+box(x+140,118,100,40,'b\n20 °C',{size:11,stroke:AM})+text(x+130,176,'original untouched',{size:10,color:LM})},
      {t:'CLASS (reference)',draw:x=>box(x+20,44,90,34,'m1',{mono:true,size:12})+box(x+150,44,90,34,'m2',{mono:true,size:12})+box(x+55,112,150,46,'one WeatherModel\nforecast: 20 °C',{stroke:MG,size:11})+arrow(x+65,78,x+105,110,'')+arrow(x+195,78,x+155,110,'')+text(x+130,176,'m2 loads; m1 sees it',{size:10,color:MG})},{h:195,label:'Swift structs versus classes'})}];
  I.p39m4=[{cap:"Three cross-platform bets. Flutter compiles Dart ahead of time and draws every pixel with its own engine; React Native runs JavaScript on Hermes and drives real platform views through JSI; Kotlin Multiplatform shares compiled Kotlin logic and keeps each platform's native UI.",
    svg:svg(560,220,`${[['FLUTTER',CY,['Dart code\nAOT → ARM','Flutter engine\n(Impeller)','draws every pixel\nMetal · Vulkan']],['REACT NATIVE',MG,['TypeScript / JS\non Hermes','JSI · Fabric\nTurboModules','real native views\nUILabel · TextView']],['KOTLIN MULTIPLATFORM',AM,['shared Kotlin logic\nmodels · network · data','JVM on Android\nKotlin/Native on iOS','native UI\nCompose · SwiftUI']]].map(([t,c,bs],k)=>{ const x=10+k*185; return text(x+85,16,t,{bold:true,size:11,color:c})+bs.map((b,i)=>box(x,30+i*64,170,46,b,{size:11,stroke:i===2?c:'currentColor'})+(i<2?arrow(x+85,77+i*64,x+85,92+i*64,''):'')).join(''); }).join('')}`,'Flutter, React Native and Kotlin Multiplatform architectures')},
   {cap:"A decision rule that survives arguments: apps that live at the hardware edge or need every frame go native; otherwise let the team decide. Web teams ship fastest in React Native, Android teams extend with Kotlin Multiplatform, and small design-led teams often choose Flutter.",
    svg:svg(560,222,`${box(150,10,260,40,'Hardware edge or peak performance?',{dash:true,stroke:AM,size:11})}
      ${box(10,90,170,42,'Native\nKotlin + Swift',{stroke:CY,size:11})}${box(330,90,180,42,'Who is the team?',{dash:true,stroke:AM,size:11})}
      ${arrow(230,51,110,88,'yes')}${arrow(330,51,420,88,'no')}
      ${[['Web / React\n→ RN + Expo',MG],['Android / Kotlin\n→ KMP',AM],['Small, design-led\n→ Flutter',CY]].map(([t,c],i)=>arrow(420,133,247+i*125,166,'')+box(190+i*125,168,115,44,t,{stroke:c,size:11})).join('')}`,'Choosing native or a cross-platform framework')}];
  I.p39m5=[{cap:"Three layers with dependencies pointing down. The UI renders one state object from its state holder, events travel up as calls, the optional domain layer combines repositories, and only the data layer touches databases and the network.",
    svg:stack([{t:'UI layer: composables · SwiftUI views',stroke:LM,side:'renders one state'},{t:'State holder: ViewModel · @Observable',stroke:CY,side:'state ↓ · events ↑'},{t:'Domain layer (optional): use cases',stroke:DIM,side:'combines repositories'},{t:'Data layer: repositories',stroke:AM,side:'owns the source of truth'},{t:'Sources: Room · SwiftData · HTTP',stroke:AM,side:'local + remote'}],{w:340,side:true,label:'App architecture layers'})},
   {cap:"Offline-first in one picture: the UI reads only the local database; each edit is saved together with an outbox row; a background worker drains the outbox with retries and an idempotency key; changes pulled from the server land in the database, never directly in the UI.",
    svg:svg(560,228,`${box(10,14,330,180,'',{dash:true,stroke:DIM})}${text(175,26,'PHONE',{bold:true,size:10,color:DIM})}
      ${box(25,40,120,40,'UI\nCompose · SwiftUI',{size:11})}${box(25,125,120,46,'Local database\nsource of truth',{stroke:CY,size:11})}
      ${box(200,40,125,40,'Sync worker\nWorkManager · BGTask',{size:10})}${box(200,125,125,46,'Outbox\nedits + UUID',{stroke:AM,size:11})}
      ${box(420,72,125,58,'Server API',{stroke:MG,size:12})}
      ${arrow(70,81,70,123,'')}${text(64,102,'write',{anchor:'end',size:10})}${arrow(100,123,100,83,'')}${text(106,102,'observe',{anchor:'start',size:10})}
      ${arrow(146,148,198,148,'')}${text(172,138,'same txn',{size:9,color:AM})}
      ${arrow(262,124,262,82,'')}${text(268,103,'drain',{anchor:'start',size:10})}
      ${arrow(326,60,418,92,'')}${text(380,50,'POST + UUID',{size:10,color:MG})}${text(482,62,'retries 30 → 60 → 120 s',{size:9,color:DIM})}
      <path d="M440 131 L440 205 L85 205 L85 174" fill="none" stroke="${MG}" stroke-width="1.3" marker-end="url(#ah)"/>${text(262,218,'pull changes since cursor',{size:10,color:MG})}`,'Offline-first sync with an outbox')},
   {cap:"Bitmap memory depends on pixels, not on file size: a 3 MB JPEG of a 12-megapixel photo becomes 48 MB once decoded. Decoding at display size is a fourteen-fold saving per image.",
    svg:svg(560,190,`${text(280,16,'decoded bitmap = width × height × 4 bytes',{bold:true,size:12})}
      ${box(20,32,480,30,'4000 × 3000 photo: 48 MB decoded',{stroke:MG,size:11})}
      ${box(20,80,35,30,'',{stroke:LM})}${text(65,95,'1080 × 810 thumbnail: 3.5 MB',{anchor:'start',size:11})}
      ${box(20,128,30,30,'',{stroke:DIM,dash:true})}${text(60,143,'JPEG file on disk: about 3 MB',{anchor:'start',size:11,color:DIM})}
      ${text(280,178,'20 photos: 960 MB vs 70 MB',{size:11,color:AM})}`,'Bitmap memory arithmetic')}];
  I.p39m6=[{cap:"A permission flow that respects a no: ask at the moment of need, explain first, and give every answer a path — the feature, a fallback, or a route to Settings once the system will no longer show its dialog.",
    svg:svg(560,222,`${box(15,15,150,46,'User taps Scan',{size:11})}${box(200,15,150,46,'Explain why\n(in context)',{stroke:CY,size:11})}${box(385,15,160,46,'System dialog',{stroke:AM,size:11})}
      ${arrow(166,38,198,38,'')}${arrow(351,38,383,38,'')}
      ${arrow(440,62,95,128,'allow')}${arrow(455,62,280,128,'deny')}${arrow(478,62,465,128,'deny again')}
      ${box(15,130,160,46,'Use the feature',{stroke:LM,size:11})}${box(200,130,160,46,'Fallback\nmanual entry',{size:11})}${box(385,130,160,46,'Settings link\n(dialog blocked)',{stroke:MG,size:11})}
      ${text(140,205,'Android: two denials, no dialog',{size:10,color:DIM})}${text(420,205,'iOS: one prompt, then Settings',{size:10,color:DIM})}`,'Runtime permission flow')},
   {cap:"Why the Keystore and Keychain beat a key in your code: the key is generated inside secure hardware and never leaves it. The app holds only a reference and asks the hardware to encrypt, decrypt or sign, optionally only after the user authenticates.",
    svg:svg(560,222,`${box(10,14,250,180,'',{dash:true,stroke:DIM})}${text(135,30,'APP PROCESS',{bold:true,size:11,color:DIM})}
      ${box(28,48,214,44,'encrypted token\n(DataStore or Keychain item)',{size:10})}${box(28,118,214,44,'key alias / reference\nno key bytes',{size:11})}
      ${box(300,14,250,180,'',{dash:true,stroke:CY})}${text(425,30,'SECURE HARDWARE',{bold:true,size:11,color:CY})}
      ${box(318,48,214,44,'TEE · StrongBox\nSecure Enclave',{size:11})}${box(318,118,214,44,'private key: made here,\nnever exported',{stroke:LM,size:11})}
      ${arrow(243,72,316,72,'request')}${arrow(316,140,244,140,'result')}
      ${text(280,210,'Optional gate: biometrics before each use',{size:10,color:AM})}`,'Keystore and Keychain key isolation')},
   {cap:"OWASP MASVS v2.1 groups mobile security requirements into eight control groups; each maps to a design decision in this module, and Domain 31's authorized testers check the same eight.",
    svg:svg(560,140,`${[['STORAGE','secrets at rest'],['CRYPTO','platform crypto only'],['AUTH','sessions, biometrics'],['NETWORK','TLS, pinning'],['PLATFORM','IPC, WebViews, links'],['CODE','deps, input checks'],['RESILIENCE','anti-tamper'],['PRIVACY','minimize, disclose']].map(([g,d],i)=>box(15+(i%4)*133,12+Math.floor(i/4)*64,125,52,g+'\n'+d,{size:11,stroke:i===7?MG:(i<4?CY:AM)})).join('')}`,'OWASP MASVS control groups')}];
  I.p39m7=[{cap:"The release pipeline: every merge is built, tested and signed by CI, goes to internal testers and TestFlight, passes store review, then rolls out in stages while crash and ANR metrics decide whether to continue or halt.",
    svg:flow([{t:'Merge to main'},{t:'CI: build · test\n· sign',stroke:CY},{t:'Internal track\n+ TestFlight',stroke:CY},{t:'Store review',stroke:AM},{t:'Staged rollout\n1% → 100%',stroke:LM},{t:'Watch vitals:\nhalt or continue',stroke:MG}],{perRow:3,bw:150,gap:40,bh:52,label:'Mobile release pipeline'})},
   {cap:"Two chains of trust. On Android you sign uploads with a resettable upload key and Google signs what devices install; on iOS Apple's certificates and provisioning profiles bind the build to your team, and Apple signs what the App Store delivers.",
    svg:compare({t:'ANDROID',draw:x=>box(x+20,40,220,40,'Upload key (yours)',{stroke:CY,size:11})+arrow(x+130,81,x+130,98,'')+box(x+20,100,220,40,'Play App Signing:\nGoogle holds app key',{stroke:AM,size:11})+arrow(x+130,141,x+130,158,'')+box(x+20,160,220,40,'Device verifies\napp signing key',{size:11})+text(x+130,218,'lost upload key → reset',{size:10,color:LM})},
      {t:'iOS',draw:x=>box(x+20,40,220,40,'Distribution certificate\n+ provisioning profile',{stroke:MG,size:11})+arrow(x+130,81,x+130,98,'')+box(x+20,100,220,40,'App Store Connect:\nApple re-signs',{stroke:AM,size:11})+arrow(x+130,141,x+130,158,'')+box(x+20,160,220,40,'Device verifies\nApple chain',{size:11})+text(x+130,218,'revoked cert: live apps unaffected',{size:10,color:LM})},{h:240,label:'Android and iOS app signing chains'})},
   {cap:"The mobile ladder: scope grows from a feature to a product area to direction across teams. At every rung the evidence is shipped work — releases, metrics, design documents — more than certificates alone.",
    svg:svg(560,235,`${text(15,18,'Scope grows at each rung',{anchor:'start',bold:true,size:11})}
      ${[['Junior','ships with review',DIM],['Mid-level','owns features end to end',CY],['Senior','owns an area, mentors',MG],['Staff','direction across teams',AM]].map(([t,d,c],i)=>{ const x=15+i*135, y=165-i*45; return box(x,y,125,40,t,{stroke:c,size:12,bold:true})+text(x+62,y+56,d,{size:10,color:DIM}); }).join('')}`,'Mobile engineering career ladder')}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
