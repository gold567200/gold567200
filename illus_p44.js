/* Illustrations — Domain 44: UX, UI Design & Accessibility, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  /* ================= DOMAIN 44: UX, UI Design & Accessibility ================= */
  I.p44m1=[{cap:"ISO 9241-11 makes usability measurable: fix the users, goals and context first, then measure all three components — before and after every change.",
    svg:svg(560,215,`${box(130,12,300,48,'specified users · goals ·\ncontext of use',{stroke:CY,size:12,bold:true})}
      ${arrow(280,60,100,108,'')}${arrow(280,60,280,108,'')}${arrow(280,60,460,108,'')}
      ${box(20,108,160,56,'EFFECTIVENESS\nsuccess rate · errors',{stroke:LM,size:11})}${box(200,108,160,56,'EFFICIENCY\ntime on task · taps',{stroke:AM,size:11})}${box(380,108,160,56,'SATISFACTION\nSUS · single-ease',{stroke:MG,size:11})}
      ${text(280,192,'usability = all three, measured',{size:11,color:DIM})}`,'ISO 9241-11 usability: users, goals, context and three measures')},
   {cap:"The Double Diamond: diverge and converge twice — first to find the right problem, then to build the right solution. Each diamond ends in evidence, not sticky notes.",
    svg:svg(560,225,`<polygon points="30,110 150,35 270,110 150,185" fill="none" stroke="${CY}" stroke-width="1.5"/><polygon points="290,110 410,35 530,110 410,185" fill="none" stroke="${MG}" stroke-width="1.5"/>
      ${text(150,20,'PROBLEM SPACE',{size:11,bold:true,color:CY})}${text(410,20,'SOLUTION SPACE',{size:11,bold:true,color:MG})}
      ${text(100,110,'Discover',{size:12})}${text(210,110,'Define',{size:12})}${text(355,110,'Develop',{size:12})}${text(470,110,'Deliver',{size:12})}
      ${text(150,203,'research → problem statement',{size:10,color:DIM})}${text(410,203,'prototypes → tested release',{size:10,color:DIM})}`,'The Double Diamond design process')},
   {cap:"Hawaii, January 2018, as layered defects: each layer could have stopped the false alert; none did. Fixes target every layer, not just the operator.",
    svg:flow([{t:'drill and live\noptions alike',stroke:AM},{t:'same confirm\nprompt',stroke:AM},{t:'no prepared\nretraction',stroke:MG},{t:'38 minutes\nof panic',stroke:MG}],{bw:112,bh:54,gap:30,label:'Layered interface defects behind the Hawaii false alert'})}];

  I.p44m2=[{cap:"Choose methods by the question. Top half: what people say; bottom half: what they do. Left: why (qualitative); right: how many (quantitative).",
    svg:svg(560,265,`${line(280,30,280,240,{stroke:DIM})}${line(30,135,530,135,{stroke:DIM})}
      ${text(155,44,'qualitative · say',{size:10,bold:true,color:CY})}${text(405,44,'quantitative · say',{size:10,bold:true,color:MG})}
      ${text(155,152,'qualitative · do',{size:10,bold:true,color:CY})}${text(405,152,'quantitative · do',{size:10,bold:true,color:MG})}
      ${box(45,62,105,32,'interviews',{size:11})}${box(160,62,105,32,'open card sort',{size:10})}
      ${box(295,62,105,32,'surveys',{size:11})}${box(410,62,105,32,'SUS ratings',{size:11})}
      ${box(45,170,105,40,'contextual\ninquiry',{size:11,stroke:CY})}${box(160,170,105,40,'usability\ntest',{size:11,stroke:CY})}
      ${box(295,170,70,40,'funnels',{size:10,stroke:MG})}${box(372,170,70,40,'A/B test',{size:10,stroke:MG})}${box(449,170,70,40,'tree\ntest',{size:10,stroke:MG})}
      ${text(280,256,'when the question is about behavior, watch behavior',{size:10,color:AM})}`,'User research methods by say/do and qualitative/quantitative')},
   {cap:"A funnel shows where people leave, not why. Step 1 loses the most people (14,000); pair that drop with a usability test to find the cause.",
    svg:svg(560,230,`${[['sessions','20,000',380,''],['start form','6,000',114,'step 30%'],['reach payment','2,400',46,'step 40%'],['complete','1,800',34,'step 75%']].map(([l,n,w,s],i)=>text(140,38+i*44,l+'\n'+n,{size:10,anchor:'end',lh:12})+`<rect x="150" y="${28+i*44}" width="${w}" height="28" rx="4" fill="${i===0?CY:(i===3?LM:MG)}" opacity="0.45"/>`+(s?text(158+w,44+i*44,s,{size:10,anchor:'start',color:AM}):'')).join('')}
      ${text(280,212,'overall 1,800 / 20,000 = 9% · biggest leak: step 1',{size:11,color:DIM})}`,'A four-step conversion funnel with step rates')},
   {cap:"Affinity mapping turns raw observations into insight bottom-up: one note per observation, clusters before labels, themes before solutions.",
    svg:flow([{t:'raw notes\n(1 per sticky)'},{t:'clusters\n(bottom-up)',stroke:CY},{t:'named\nthemes',stroke:AM},{t:'insights →\npersonas, JTBD',stroke:LM}],{bw:112,bh:54,gap:30,label:'Affinity mapping synthesis'})}];

  I.p44m3=[{cap:"Fitts's law at the same distance: doubling the target width removes almost a bit of difficulty and about 0.14 s from every tap.",
    svg:svg(560,215,`<circle cx="50" cy="50" r="7" fill="${CY}"/>${arrow(58,50,452,50,'D = 600 px')}<rect x="461" y="30" width="17" height="40" rx="3" fill="none" stroke="${MG}" stroke-width="1.6"/>${text(520,50,'W 24',{size:10,color:MG})}
      ${text(280,92,'ID = log2(600/24 + 1) = 4.70 bits → 0.81 s',{size:11})}
      <circle cx="50" cy="130" r="7" fill="${CY}"/>${arrow(58,130,444,130,'D = 600 px')}<rect x="453" y="110" width="34" height="40" rx="3" fill="none" stroke="${LM}" stroke-width="1.6"/>${text(522,130,'W 48',{size:10,color:LM})}
      ${text(280,172,'ID = log2(600/48 + 1) = 3.75 bits → 0.66 s',{size:11,color:LM})}
      ${text(280,200,'MT = a + b · log2(D/W + 1), a = 0.10 s, b = 0.15 s/bit',{size:10,color:DIM})}`,'Fitts law worked example with two target widths')},
   {cap:"Norman's two gulfs. Signifiers and mapping bridge execution (how do I do it?); feedback bridges evaluation (did it work?). Slips and mistakes need different fixes.",
    svg:svg(560,205,`${box(20,72,140,60,'PERSON\ngoal',{stroke:CY,size:12})}${box(400,72,140,60,'SYSTEM\nstate',{stroke:MG,size:12})}
      ${text(280,30,'gulf of execution: how do I do it?',{size:11,color:CY})}${text(280,48,'bridged by signifiers and mapping',{size:10,color:DIM})}
      ${arrow(160,88,400,88,'act')}${arrow(400,118,160,118,'perceive')}
      ${text(280,154,'gulf of evaluation: did it work?',{size:11,color:MG})}${text(280,172,'bridged by feedback and visible state',{size:10,color:DIM})}
      ${text(280,196,'slip: right goal, wrong action · mistake: wrong goal',{size:10,color:AM})}`,'Gulfs of execution and evaluation')},
   {cap:"Design tokens in three tiers. Components reference meaning, meaning references raw values, and one build compiles them all to CSS, Compose and Swift.",
    svg:flow([{t:'primitive\ncyan-400 #00e5ff',stroke:CY},{t:'semantic\ncolor-action'},{t:'component\nbutton-primary-bg',stroke:MG},{t:'CSS · Compose\n· Swift',stroke:LM}],{bw:112,bh:54,gap:24,label:'Design token tiers'})}];

  I.p44m4=[{cap:"This app's tokens measured against its #060a14 background. Text needs 4.5:1 and component borders need 3:1; --faint and --line fall short, everything else passes with room.",
    svg:svg(560,248,`${[['lecture text #e6f6ff',17.89,1],['--fg #d7f3ff',17.11,1],['--amber #ffd166',13.72,1],['--cyan #00e5ff',12.86,1],['--dim #7fa6c4',7.68,1],['--mag #ff2bd6',6.19,1],['--faint #4d6f8c',3.74,0],['--line #15385e',1.66,0]].map(([l,v,ok],i)=>{ const w=Math.round(v*18.1); const y=36+i*24; return text(142,y+9,l,{size:10,anchor:'end'})+`<rect x="150" y="${y}" width="${w}" height="18" rx="3" fill="${ok?LM:MG}" opacity="${ok?0.4:0.65}"/>`+text(ok?156+w:240,y+9,v.toFixed(1)+':1'+(ok?'':' FAIL'),{size:10,anchor:'start',color:ok?'currentColor':MG}); }).join('')}
      ${line(204,30,204,230,{stroke:AM,dash:true})}${line(231,30,231,230,{stroke:AM,dash:true})}
      ${text(244,22,'4.5:1 text',{size:9,color:AM,anchor:'start'})}${text(196,240,'3:1 UI',{size:9,color:AM,anchor:'end'})}`,'Contrast ratios of the app theme tokens')},
   {cap:"A modular type scale: one base (16 px) times one ratio (1.25) gives every size. Five steps used consistently beat a dozen ad-hoc sizes.",
    svg:svg(560,160,`${text(280,20,'16 × 1.25ⁿ — the major-third scale',{size:11,color:CY})}
      ${[[50,16],[130,20],[225,25],[340,31],[470,39]].map(([x,s])=>text(x,82,'Aa',{size:s,bold:true})+text(x,128,s+' px',{size:10,color:DIM})).join('')}
      ${text(280,152,'body 16–18 px · line height ~1.5 · 45–75 characters per line',{size:10,color:AM})}`,'A modular type scale from 16 px at ratio 1.25')},
   {cap:"An 8-point spacing system: every gap is one of a few steps, and space inside a group stays smaller than space between groups.",
    svg:svg(560,150,`${text(280,18,'4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 px',{size:11,color:CY})}
      ${(()=>{ let x=40, s=''; [4,8,12,16,24,32,48,64].forEach(v=>{ s+=`<rect x="${x}" y="${104-v}" width="${v}" height="${v}" fill="${CY}" opacity="0.35" stroke="${CY}"/>`+text(x+v/2,118,String(v),{size:10,color:DIM}); x+=v+30; }); return s; })()}
      ${text(280,140,'internal spacing ≤ external spacing',{size:10,color:AM})}`,'Eight-point spacing scale')}];

  I.p44m5=[{cap:"WCAG 2.2's structure: four POUR principles, 13 guidelines, 86 success criteria. AA conformance means all 31 Level A plus all 24 Level AA criteria.",
    svg:svg(560,250,`${[['PERCEIVABLE',CY,['1.1 text alternatives','1.2 time-based media','1.3 adaptable','1.4 distinguishable']],['OPERABLE',MG,['2.1 keyboard','2.2 enough time','2.3 seizures','2.4 navigable','2.5 input modalities']],['UNDERSTANDABLE',AM,['3.1 readable','3.2 predictable','3.3 input assistance']],['ROBUST',LM,['4.1 compatible']]].map(([h,c,g],i)=>box(10+i*137,14,130,34,h,{stroke:c,bold:true,size:11})+g.map((t,j)=>box(10+i*137,58+j*31,130,26,t,{size:10,stroke:DIM})).join('')).join('')}
      ${text(280,236,'13 guidelines · 86 criteria · A 31 · AA 24 · AAA 31',{size:10,color:DIM})}`,'WCAG 2.2 principles and guidelines')},
   {cap:"A screen reader reads the accessibility tree, not the pixels. A native button arrives with its role, name and keyboard behavior already filled in.",
    svg:flow([{t:'DOM\n<button>Save',stroke:CY},{t:'accessibility tree\nrole · name · state',stroke:AM},{t:'screen reader\n"Save, button"',stroke:MG},{t:'speech or\nbraille',stroke:LM}],{bw:112,bh:56,gap:24,label:'From DOM to accessibility tree to screen reader'})},
   {cap:"The legal timeline as of October 2026: the EAA applies since June 2025; US state and local governments now have until April 2027 or April 2028; EN 301 549 v4.1.1 (WCAG 2.2) awaits citation.",
    svg:svg(560,215,`${line(20,108,540,108,{stroke:DIM,sw:2})}
      ${[[45,'1990\nADA',0],[110,'2017\n§508 refresh',1],[175,'2019\nEAA adopted',0],[240,'Oct 2023\nWCAG 2.2',1],[305,'Jun 2025\nEAA applies',0],[370,'Apr 2026\nTitle II\nextended',1],[435,'Sep 2026\nEN 301 549\nv4.1.1',0],[500,'2027 / 2028\nTitle II\ndeadlines',1]].map(([x,t,b])=>`<circle cx="${x}" cy="108" r="5" fill="${b?MG:CY}"/>`+line(x,b?113:103,x,b?132:84,{stroke:DIM})+text(x,b?144:(84-13*(t.split('\n').length)),t,{size:9,lh:13,color:b?MG:CY})).join('')}`,'Accessibility law and standards timeline')}];

  I.p44m6=[{cap:"Scoring the System Usability Scale: odd items count response − 1, even items count 5 − response, and the sum × 2.5 gives 0–100. This participant scores 82.5, well above the 68 average.",
    svg:svg(560,190,`${[4,2,5,1,4,2,5,2,4,2].map((r,i)=>{ const x=20+i*52, odd=i%2===0; const s=odd?r-1:5-r; return text(x+22,16,'Q'+(i+1),{size:9,color:DIM})+box(x,26,44,32,String(r),{stroke:odd?CY:MG,size:13})+arrow(x+22,58,x+22,82,'')+box(x,84,44,32,String(s),{stroke:odd?CY:MG,size:13,bold:true}); }).join('')}
      ${text(280,140,'odd sum 17 + even sum 16 = 33',{size:12})}${text(280,164,'33 × 2.5 = SUS 82.5   (average ≈ 68)',{size:12,color:LM})}`,'System Usability Scale scoring example')},
   {cap:"Share of problems found by n participants, 1 − (1 − L)ⁿ. Five users catch about 84% of problems that affect 31% of people — but only 41% of those that affect 10%.",
    svg:svg(560,225,`${line(60,30,60,180,{stroke:DIM})}${line(60,180,520,180,{stroke:DIM})}${text(42,30,'100%',{size:9,color:DIM,anchor:'end'})}${text(42,180,'0%',{size:9,color:DIM,anchor:'end'})}
      ${[1,5,10,15].map(n=>text(60+(n-1)*32.86,194,String(n),{size:9,color:DIM})).join('')}${text(290,212,'participants (n)',{size:10,color:DIM})}
      <polyline fill="none" stroke="${CY}" stroke-width="2" points="${Array.from({length:15},(_,k)=>{const n=k+1;return (60+k*32.86).toFixed(1)+','+(180-150*(1-Math.pow(0.69,n))).toFixed(1);}).join(' ')}"/>
      <polyline fill="none" stroke="${MG}" stroke-width="2" stroke-dasharray="5 4" points="${Array.from({length:15},(_,k)=>{const n=k+1;return (60+k*32.86).toFixed(1)+','+(180-150*(1-Math.pow(0.9,n))).toFixed(1);}).join(' ')}"/>
      ${line(191.4,40,191.4,180,{stroke:AM,dash:true})}
      ${text(400,53,'L = 0.31: 5 users → 84%',{size:10,color:CY})}${text(400,118,'L = 0.10: 5 users → 41%',{size:10,color:MG})}`,'Problems found versus number of test participants')},
   {cap:"Automated tools and manual testing find different barriers. Run both: the tools are fast and repeatable, but only people with a keyboard and a screen reader can deliver the verdict.",
    svg:compare({t:'AUTOMATED (axe, Lighthouse)',draw:x=>['missing alt, labels, names','plain-text contrast','invalid ARIA, duplicate IDs','page language and title','≈ 40–57% of issues'].map((l,i)=>text(x+130,54+i*24,l,{size:10,color:i===4?AM:'currentColor'})).join('')},{t:'MANUAL (keyboard, AT)',draw:x=>['focus order, traps, visibility','is the alt text meaningful?','what the screen reader says','zoom, reflow, motion','the rest — and the verdict'].map((l,i)=>text(x+130,54+i*24,l,{size:10,color:i===4?LM:'currentColor'})).join('')},{h:185,label:'Automated versus manual accessibility testing'})}];

  I.p44m7=[{cap:"A case study is an argument in six parts. Hiring managers skim for the problem, the evidence, the decisions and the measured outcome.",
    svg:flow([{t:'1 context\nand role'},{t:'2 problem\n+ evidence',stroke:CY},{t:'3 process\n(why these)'},{t:'4 decisions\nand trade-offs',stroke:AM},{t:'5 outcome\n(measured)',stroke:LM},{t:'6 reflection'}],{bw:140,bh:54,gap:40,label:'The six parts of a UX case study'})},
   {cap:"The credential path for this domain: the Google certificate and CPACC in the first half-year, WAS after real remediation work, and CPWA when both are passed.",
    svg:flow([{t:'Domain 44 +\nGoogle UX\nmonths 1–6',stroke:CY},{t:'CPACC\nIAAP session\n~month 5',stroke:MG},{t:'audits and\nremediation\nyear 1–2'},{t:'WAS\n75 questions\nyear 2',stroke:AM},{t:'CPWA\n= CPACC + WAS',stroke:LM}],{bw:140,bh:62,gap:40,label:'UX and accessibility certification path'})}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
