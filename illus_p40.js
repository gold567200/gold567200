/* Illustrations — Domain 40: Game Development, Graphics & Simulation, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  /* small local helpers (pure SVG strings, kit colors only) */
  const X=t=>40+t*4.8;                                   // ms → x for the timestep timeline
  const frames=[[0,23],[23,41],[41,70],[70,88],[88,100]];
  const seg=[['scripts\n3 ms',3,CY],['physics\n2',2,CY],['anim\n1.5',1.5,CY],['AI\n1',1,CY],['render\nsubmit 4',4,MG],['slack\n2',2,AM],['spare\n3.2',3.2,DIM]];
  const budgetBar=()=>{ let x=30; return seg.map(([t,ms,c])=>{ const w=ms*30; const s=box(x,34,w,46,t,{stroke:c,size:10,rx:2}); x+=w; return s; }).join(''); };
  const cacheLine=(x,y,cells,color)=>`<rect x="${x}" y="${y}" width="64" height="30" rx="2" fill="none" stroke="currentColor" stroke-width="1"/>`+cells.map(j=>`<rect x="${x+j*4+0.5}" y="${y+4}" width="3" height="22" fill="${color}"/>`).join('');
  const dot=(x,y,c)=>`<circle cx="${x}" cy="${y}" r="4.5" fill="${c||'currentColor'}"/>`;
  const poly=(pts,c)=>`<polygon points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${c}" stroke-width="1.3"/>`;

  /* ================= DOMAIN 40: Game Development ================= */
  I.p40m1=[{cap:"The game loop. Every frame drains input, advances the simulation in fixed steps, renders an interpolated picture and presents it — forever, inside a 16.7 ms budget at 60 fps.",
    svg:cycle([{t:'process input'},{t:'update\n(fixed steps)',stroke:CY},{t:'render\n(interpolated)',stroke:MG},{t:'present\n(vsync)',stroke:AM}],{label:'The game loop: input, update, render, present'})},
   {cap:"A fixed timestep decoupled from uneven frames. Real frames (top) take 23, 18, 29, 18 and 12 ms; the simulation (bottom) always advances in identical 16.7 ms steps. At the 41 ms frame two steps have run and 7.7 ms is left over, so the renderer blends 46% of the way toward the next state.",
    svg:svg(560,205,`${text(280,14,'render frames — uneven real time',{size:11,color:MG,bold:true})}
      ${frames.map(([a,b])=>box(X(a),24,(b-a)*4.8,30,(b-a)+' ms',{stroke:MG,size:10,rx:3})).join('')}
      ${text(280,76,'simulation — fixed 16.7 ms steps',{size:11,color:CY,bold:true})}
      ${[0,1,2,3,4,5].map(i=>box(X(i*16.667),86,80,30,'step '+(i+1),{stroke:CY,size:10,rx:3})).join('')}
      ${line(X(41),20,X(41),58,{stroke:AM,dash:true})}
      ${line(40,134,520,134)}${[0,25,50,75,100].map(t=>line(X(t),130,X(t),138)+text(X(t),148,t+' ms',{size:9,color:DIM})).join('')}${line(X(41),126,X(41),140,{stroke:AM,sw:2})}${text(X(41),148,'41',{size:9,color:AM})}
      ${text(280,172,'at 41 ms: 2 steps done (33.3 ms) · acc = 7.7 ms · α = 0.46',{size:11,color:AM})}
      ${text(280,192,'render draws the state 46% of the way from step 2 to step 3',{size:10,color:DIM})}`,'Fixed simulation steps versus uneven render frames')},
   {cap:"A 16.7 ms frame budget laid out to scale. CPU work on the main and render threads must fit the bar; the GPU draws the previous frame in parallel with its own 16.7 ms. Slack absorbs spikes; spare time is what you spend on new features.",
    svg:svg(560,172,`${text(280,18,'one 60 fps frame = 1000 ÷ 60 = 16.7 ms of CPU time',{size:11,bold:true,color:CY})}
      ${budgetBar()}
      ${box(30,96,501,32,'GPU: draws the previous frame in parallel, its own 16.7 ms',{stroke:LM,size:10})}
      ${line(30,146,531,146)}${[[30,'0'],[280.5,'8.3 ms'],[531,'16.7 ms']].map(([x,t])=>line(x,142,x,150)+text(x,162,t,{size:9,color:DIM})).join('')}`,'A 60 fps frame budget divided among subsystems')}];

  I.p40m2=[{cap:"The rendering pipeline. Two stages are your code (vertex and fragment shaders); the rest is fixed-function hardware you configure. Each triangle flows left to right, then down, millions of times per frame.",
    svg:flow([{t:'vertex and\nindex buffers'},{t:'vertex shader\n(your code)',stroke:CY},{t:'clip, divide\nby w, viewport'},{t:'rasterize:\npixel coverage'},{t:'fragment shader\n(your code)',stroke:MG},{t:'depth test,\nblend → image',stroke:AM}],{label:'The GPU rendering pipeline'})},
   {cap:"The chain of spaces. Model, view and projection matrices (Domain 14) carry a vertex from the artist's coordinates to clip space; dividing by w gives normalized device coordinates; the viewport maps them to pixels.",
    svg:flow([{t:'object\nspace'},{t:'world\nspace',edge:'M'},{t:'view\n(camera)',edge:'V'},{t:'clip\nspace',edge:'P',stroke:CY},{t:'NDC\n−1 … 1',edge:'÷w',stroke:MG},{t:'screen\npixels',edge:'px'}],{gap:50,label:'Coordinate spaces from object to screen'})},
   {cap:"Lighting vectors at one point. Lambert diffuse depends on the angle between the normal N and the light direction L; Blinn–Phong specular on the angle between N and the half vector H, halfway between L and the view direction V.",
    svg:svg(560,235,`${line(60,180,500,180,{sw:2})}${text(90,196,'surface',{size:10,color:DIM})}
      <circle cx="150" cy="70" r="14" fill="none" stroke="${AM}" stroke-width="1.5"/>${text(150,46,'light',{size:10,color:AM})}
      <ellipse cx="478" cy="139" rx="16" ry="9" fill="none" stroke="${MG}" stroke-width="1.5"/>${text(478,120,'eye',{size:10,color:MG})}
      ${arrow(280,180,280,70,'')}${text(266,66,'N',{bold:true})}
      ${arrow(280,180,196,109,'',{stroke:AM})}${text(186,120,'L',{bold:true,color:AM})}
      ${arrow(280,180,388,157,'',{stroke:MG})}${text(394,170,'V',{bold:true,color:MG})}
      ${arrow(280,180,305,83,'',{stroke:CY})}${text(318,84,'H',{bold:true,color:CY})}
      ${text(430,40,'H = normalize(L + V)',{size:10,color:CY})}
      ${text(280,210,'diffuse = max(0, N·L)    specular = max(0, N·H)^n',{size:11})}
      ${text(280,228,'L at 45°: N·L = 0.71 · N·H = 0.95 with n = 32 → 0.19',{size:10,color:DIM})}`,'Normal, light, view and half vectors for Lambert and Blinn-Phong')}];

  I.p40m3=[{cap:"Inheritance versus composition. A class tree needs a new subclass for every combination; components let a designer assemble an exploding, floating, collectible crate from parts that already exist.",
    svg:compare({t:'INHERITANCE: one tree',draw:x=>box(x+70,40,120,26,'Actor')+line(x+130,66,x+130,80)+box(x+70,80,120,26,'Enemy')+line(x+130,106,x+130,120)+box(x+70,120,120,26,'FlyingEnemy')+line(x+130,146,x+130,158)+box(x+30,158,200,26,'ExplodingFlyingCrate???',{stroke:MG,dash:true})},
      {t:'COMPOSITION: components',draw:x=>box(x+60,40,140,28,'Crate (entity)',{stroke:CY,bold:true})+[['Transform',0,0],['Collider',1,0],['Health',0,1],['Explosive',1,1],['Buoyancy',0,2],['Pickup',1,2]].map(([t,c,r])=>box(x+15+c*120,80+r*28,110,24,t,{size:11,stroke:r===1&&c===1?AM:'currentColor'})).join('')+text(x+130,178,'snap parts together in the editor',{size:10,color:DIM})},{h:200,label:'Inheritance tree versus component composition'})},
   {cap:"Why ECS is fast. Scattered objects waste each 64-byte cache line on one useful value; an ECS chunk stores each component as a packed array, so every byte fetched is used and the prefetcher streams ahead.",
    svg:svg(560,205,`${text(280,22,'scattered heap objects: 1 useful float per 64-byte line',{size:11,color:MG})}
      ${[0,1,2,3,4,5,6].map(i=>cacheLine(20+i*76,36,[(i*5+3)%16],MG)).join('')}
      ${text(280,98,'ECS chunk, structure of arrays: 16 floats per line',{size:11,color:CY})}
      ${[0,1,2,3,4,5,6].map(i=>cacheLine(20+i*76,112,[...Array(16).keys()],CY)).join('')}
      ${text(280,170,'100,000 scattered misses × ~100 ns ≈ 10 ms',{size:11,color:AM})}
      ${text(280,190,'2.4 MB streamed sequentially ≈ well under 1 ms',{size:11,color:LM})}`,'Cache lines: scattered objects versus packed component arrays')},
   {cap:"The Unity MonoBehaviour lifecycle. Initialization runs once; each frame runs zero or more FixedUpdate physics steps, then one Update and one LateUpdate before rendering.",
    svg:flow([{t:'Awake'},{t:'OnEnable'},{t:'Start'},{t:'FixedUpdate\n× 0..n',stroke:CY},{t:'Update\n× 1',stroke:MG},{t:'LateUpdate'},{t:'render'},{t:'OnDisable,\nOnDestroy',stroke:DIM}],{bw:100,gap:36,label:'Unity script lifecycle order'})}];

  I.p40m4=[{cap:"Integrators compared on one second of free fall at 60 Hz. Explicit Euler (old velocity) falls short, semi-implicit Euler (new velocity) overshoots by the same amount, and Verlet is exact for constant acceleration.",
    svg:stack([{t:'exact: ½·g·t² = 4.905 m',stroke:LM,side:'the reference'},{t:'explicit Euler: 4.823 m',stroke:MG,side:'−1.7% (old velocity)'},{t:'semi-implicit Euler: 4.987 m',stroke:CY,side:'+1.7% (new velocity)'},{t:'Verlet: 4.905 m',stroke:AM,side:'exact here'}],{w:300,side:true,label:'Integrator results for one second of free fall'})},
   {cap:"Tunneling. A bullet moving 6 m per step is tested only at its two positions, both clear of a 0.3 m wall, so the hit is never seen. A raycast or swept test along the path between the positions finds it.",
    svg:svg(560,200,`${text(280,16,'300 m/s × 0.02 s = 6 m per step · wall 0.3 m',{size:11,bold:true,color:AM})}
      ${box(272,30,14,54,'',{stroke:'currentColor',rx:1})}${dot(110,57,MG)}${dot(450,57,MG)}${text(110,76,'step k',{size:10,color:DIM})}${text(450,76,'step k+1',{size:10,color:DIM})}
      ${arrow(118,57,442,57,'',{stroke:MG,dash:true})}${text(380,44,'jump: no overlap',{size:10,color:MG})}
      ${box(272,104,14,54,'',{stroke:'currentColor',rx:1})}${dot(110,131,CY)}${dot(450,131,DIM)}
      ${line(118,131,270,131,{stroke:LM,sw:2})}<circle cx="272" cy="131" r="6" fill="none" stroke="${LM}" stroke-width="2"/>${text(200,120,'raycast hits',{size:10,color:LM})}
      ${text(280,182,'fixes: continuous detection, raycast sweeps, smaller steps, thicker colliders',{size:10,color:DIM})}`,'Tunneling between discrete physics steps and the raycast fix')},
   {cap:"The broad phase. Testing every pair grows as n²; a uniform grid lets each body test only its own and neighboring cells (dashed), so the work grows roughly linearly.",
    svg:svg(560,215,`${[0,1,2,3].map(r=>[0,1,2,3,4,5].map(c=>`<rect x="${20+c*40}" y="${30+r*40}" width="40" height="40" fill="none" stroke="${DIM}" stroke-width="1"/>`).join('')).join('')}
      <rect x="60" y="30" width="120" height="120" fill="none" stroke="${CY}" stroke-width="2" stroke-dasharray="5 4"/>
      ${[[35,45],[92,58],[150,48],[205,62],[44,128],[140,112],[170,135],[230,150],[75,170],[190,180],[250,95],[30,180]].map(([x,y])=>dot(x,y)).join('')}${dot(120,90,MG)}
      ${text(140,205,'uniform grid (spatial hash)',{size:10,color:DIM})}
      ${text(290,50,'brute force: n(n−1)/2 pairs',{size:11,bold:true,anchor:'start'})}
      ${text(290,74,'1,000 bodies → 499,500 pairs',{size:11,anchor:'start'})}
      ${text(290,98,'10,000 bodies → ~50 million',{size:11,anchor:'start'})}
      ${text(290,130,'grid: own cell + 8 neighbors',{size:11,color:CY,anchor:'start'})}
      ${text(290,154,'a handful of tests per body',{size:11,color:CY,anchor:'start'})}
      ${text(290,180,'broad phase ≈ linear in n',{size:11,bold:true,color:LM,anchor:'start'})}`,'Broad-phase spatial grid versus brute-force pair testing')}];

  I.p40m5=[{cap:"An animation state machine for a platformer character. Each transition is guarded by a parameter the gameplay code sets, and each is blended with a short crossfade.",
    svg:svg(560,222,`${box(30,95,100,40,'Idle',{stroke:CY,bold:true})}${box(200,25,100,40,'Run',{stroke:CY})}${box(410,25,100,40,'Jump',{stroke:MG})}${box(410,160,100,40,'Fall',{stroke:MG})}${box(200,160,100,40,'Land',{stroke:AM})}
      ${arrow(130,105,200,55,'speed > 0.1')}${arrow(300,45,410,45,'jump pressed')}${arrow(460,65,460,160,'vy < 0')}${arrow(410,180,300,180,'grounded')}${arrow(200,170,132,130,'clip ends')}
      ${text(280,214,'crossfades of 0.1–0.25 s on each transition · any state → Hit',{size:10,color:DIM})}`,'Animation state machine: Idle, Run, Jump, Fall, Land')},
   {cap:"A guard's behavior tree. The Selector tries each branch left to right and stops at the first that succeeds; each Sequence succeeds only if all its steps do. Ticked ten times a second, fifty guards cost about 0.17 ms per frame.",
    svg:svg(560,232,`${box(200,10,160,32,'Selector (OR)',{stroke:CY,bold:true})}
      ${[['Sequence (AND)\nsee · in range\n→ attack',MG],['Sequence (AND)\nsee player\n→ chase',AM],['Sequence (AND)\nlast known\n→ search 4 s',AM],['Patrol\n(fallback)',DIM]].map(([t,c],i)=>line(280,42,74+i*138,80)+box(10+i*138,80,128,56,t,{stroke:c,size:10})).join('')}
      ${text(280,162,'tried left to right; the first success wins',{size:10,color:DIM})}
      ${text(280,186,'ticked at 10 Hz · leaves return Success, Failure or Running',{size:11,color:AM})}
      ${text(280,210,'50 guards × 10 ticks × 0.02 ms ≈ 0.17 ms per frame',{size:11,color:LM})}`,'Behavior tree for a guard')},
   {cap:"Grid search versus a navmesh. On a grid, A* expands many cells and returns a staircase; on a navmesh it searches a few convex polygons, and the funnel algorithm pulls the corridor into a taut path.",
    svg:compare({t:'GRID: many nodes',draw:x=>[0,1,2,3,4,5].map(r=>[0,1,2,3,4,5,6,7,8,9].map(c=>`<rect x="${x+30+c*20}" y="${45+r*20}" width="20" height="20" fill="${(r===2&&c>2&&c<7)?DIM:'none'}" stroke="${DIM}" stroke-width="0.8"/>`).join('')).join('')+`<polyline points="${x+40},${155} ${x+40},${135} ${x+60},${135} ${x+60},${115} ${x+80},${115} ${x+80},${95} ${x+160},${95} ${x+160},${75} ${x+200},${75} ${x+200},${55} ${x+220},${55}" fill="none" stroke="${AM}" stroke-width="2"/>`+text(x+130,182,'A* expands many cells; jagged path',{size:10,color:DIM})},
      {t:'NAVMESH: few polygons',draw:x=>poly([[x+30,165],[x+30,95],[x+100,70],[x+115,150]],CY)+poly([[x+100,70],[x+170,55],[x+175,130],[x+115,150]],CY)+poly([[x+170,55],[x+235,50],[x+235,120],[x+175,130]],CY)+`<polyline points="${x+50},${140} ${x+112},${143} ${x+222},${62}" fill="none" stroke="${LM}" stroke-width="2"/>`+dot(x+50,140,LM)+dot(x+222,62,LM)+text(x+130,182,'A* over polygons + funnel: taut path',{size:10,color:DIM})},{h:205,label:'Grid pathfinding versus navmesh pathfinding'})}];

  I.p40m6=[{cap:"Prediction and reconciliation. The client applies inputs #41–#45 instantly; the server simulates #41 authoritatively and returns its state with an acknowledgment; the client rewinds to that state and replays the inputs the server has not yet seen.",
    svg:svg(560,232,`${text(280,16,'RTT 80 ms: predict now, correct later',{size:11,bold:true,color:AM})}
      ${line(60,82,540,82)}${line(60,170,540,170)}${text(32,82,'client',{size:10,color:DIM})}${text(32,170,'server',{size:10,color:DIM})}
      ${[0,1,2,3,4].map(i=>box(90+i*34,46,30,28,'#'+(41+i),{size:10,stroke:CY,rx:3})).join('')}
      ${arrow(105,82,190,168,'')}${text(138,132,'input #41',{size:10,color:DIM,anchor:'end'})}
      ${box(190,176,120,34,'simulate #41\n(authoritative)',{stroke:CY,size:10})}
      ${arrow(310,170,410,84,'')}${text(376,132,'state + ack #41',{size:10,color:DIM,anchor:'start'})}
      ${box(382,46,158,28,'rewind · replay #42–#45',{stroke:MG,size:10})}
      ${text(280,224,'remote players: drawn ~100 ms in the past between two snapshots',{size:10,color:DIM})}`,'Client-side prediction and server reconciliation timeline')},
   {cap:"Lag compensation for one shot. The server rewinds the target's hitbox by the shooter's round-trip time plus interpolation delay, 146.7 ms here, tests the hit as the shooter saw it, then restores the present.",
    svg:svg(560,212,`${line(40,100,520,100,{sw:2})}${text(60,88,'−200 ms',{size:9,color:DIM})}${text(520,88,'now',{size:10,color:DIM})}
      ${box(98,30,140,34,'B as A saw it\n(now − 146.7 ms)',{stroke:CY,size:10})}${line(168,64,168,100,{stroke:CY})}
      ${box(440,30,110,34,'B now\n+0.81 m away',{stroke:AM,size:10})}${line(495,64,495,100,{stroke:AM})}
      ${box(168,112,160,28,'interpolation 66.7 ms',{stroke:DIM,size:10})}${box(328,112,96,28,'down 40 ms',{stroke:DIM,size:10})}${box(424,112,96,28,'up 40 ms',{stroke:DIM,size:10})}
      ${arrow(516,172,172,172,'',{stroke:MG,dash:true})}${text(344,160,'server rewinds 146.7 ms',{size:10,color:MG})}
      ${text(280,200,'rewind = RTT 80 + interpolation 66.7 ≈ 8.8 ticks at 60 Hz',{size:11,color:AM})}`,'Server-side lag compensation rewind arithmetic')},
   {cap:"A profiling procedure. Measure a development build on target hardware, find what bounds the frame, fix one thing, and measure again — never optimize by guesswork.",
    svg:flow([{t:'dev build on\ntarget device'},{t:'main, render\nand GPU ms',stroke:CY},{t:'which bounds?\nlower-res test',stroke:AM},{t:'GPU: overdraw,\nshaders, shadows',stroke:MG},{t:'CPU: draws, GC,\nscripts, physics',stroke:MG},{t:'fix one thing,\nre-measure',stroke:LM}],{label:'Profiling procedure'})}];

  I.p40m7=[{cap:"Production milestones. A prototype answers 'is it fun?'; a vertical slice proves the full experience at final quality; alpha and beta lock features and then content; launch starts live operations.",
    svg:flow([{t:'prototype\n(is it fun?)'},{t:'vertical slice\n(final quality)',stroke:CY},{t:'alpha\n(features done)'},{t:'beta\n(content done)'},{t:'release\ncandidate',stroke:AM},{t:'launch +\nlive ops',stroke:LM}],{label:'Game production milestones'})},
   {cap:"Where a US$9.99 Steam sale goes, for 5,000 copies with 8% refunds and about 10% taxes. Engine fees are zero at this scale for both Unity Personal and Unreal.",
    svg:stack([{t:'gross: 5,000 × $9.99 = $49,950',stroke:CY},{t:'− 8% refunds → $45,954'},{t:'− ~10% sales tax and VAT → $41,359 adjusted gross'},{t:'− Valve 30% → $12,408',stroke:MG},{t:'you receive ≈ $28,951 (≈ $5.79 per copy)',stroke:LM,bold:true}],{w:440,label:'Steam revenue waterfall for a 9.99 dollar game'})},
   {cap:"Career paths from the same foundation. Each specialty is proven with a different kind of portfolio piece; game security connects this domain to your reverse-engineering goals.",
    svg:svg(560,200,`${box(170,12,220,34,'game programming foundation',{stroke:CY,bold:true})}
      ${[['gameplay\nfeel · systems',CY],['engine\nC++ · memory · threads',CY],['graphics\nshaders · math',CY]].map(([t,c],i)=>line(280,46,100+i*180,76)+box(20+i*180,76,160,44,t,{stroke:c,size:10})).join('')}
      ${[['tools\neditors · pipelines',AM],['tech art\nshaders · VFX · rigs',AM],['game security\nnetcode · RE (Ph. 11)',MG]].map(([t,c],i)=>box(20+i*180,136,160,44,t,{stroke:c,size:10})).join('')}
      ${text(280,194,'prove each path with finished, measured, published work',{size:10,color:DIM})}`,'Game programming career paths')}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
