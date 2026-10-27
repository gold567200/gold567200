/* Illustrations — Domain 46: Learning How to Learn, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  /* ================= DOMAIN 46: Learning How to Learn ================= */
  I.p46m1=[{cap:"Memory has three stages. Attention gates encoding, sleep replay does the consolidation, and every retrieval strengthens the trace — which is why a test is a learning event.",
    svg:flow([{t:'attend →\nencode'},{t:'consolidate\n(sleep replay)',stroke:CY},{t:'store\n(cortex)'},{t:'retrieve →\nstrengthen',stroke:MG}],{bw:104,gap:34,label:'The three stages of memory'})},
   {cap:"The forgetting curve (Ebbinghaus 1885) falls steeply then flattens; each spaced review resets it and makes the next decline slower. Reviews at days 1, 4 and 12 are the Recall engine's schedule.",
    svg:svg(560,235,`${line(60,40,60,190)}${line(60,190,530,190)}${text(38,40,'100%',{size:9,color:DIM})}${text(38,190,'0%',{size:9,color:DIM})}
      ${[[60,'0'],[150,'1'],[260,'4'],[380,'12'],[520,'32']].map(([x,l])=>text(x,204,l,{size:9,color:DIM})).join('')}${text(300,222,'days since first study',{size:10,color:DIM})}
      <path d="M60 40 C 90 120, 140 150, 200 160 S 400 180, 520 184" fill="none" stroke="${MG}" stroke-width="2"/>
      <path d="M60 40 C 90 80, 120 95, 150 100 L150 40 C 190 60, 230 70, 260 78 L260 40 C 300 52, 340 58, 380 62 L380 40 C 430 48, 480 50, 520 52" fill="none" stroke="${CY}" stroke-width="2"/>
      ${[150,260,380].map(x=>`<circle cx="${x}" cy="40" r="4" fill="${CY}"/>`).join('')}${text(330,28,'reviews reset and flatten the curve',{size:10,color:CY})}
      ${text(465,140,'no review: ≈34% at day 1,\n≈21% at a month',{size:9,color:MG})}`,'Forgetting curve with and without spaced reviews')},
   {cap:"How the app schedules one card rated Good every time: 1 day, 3 days, then the previous interval times the ease factor (2.5). Six reviews cover the first year.",
    svg:flow(['1 day','3 days','8 days','20 days','50 days','125 days'],{edges:['fixed','fixed','×2.5','×2.5','×2.5'],label:'Recall engine intervals for a card rated Good'})}];

  I.p46m2=[{cap:"The Dunlosky et al. (2013) scorecard. Only practice testing and spaced practice earned 'high utility'; the techniques that feel most productive sit at the bottom.",
    svg:stack([{t:'HIGH utility: practice testing · spaced (distributed) practice',stroke:LM},{t:'MODERATE: elaborative interrogation ·\nself-explanation · interleaved practice',stroke:AM},{t:'LOW: highlighting · rereading · summarization ·\nkeyword mnemonics · imagery for text',stroke:MG}],{w:520,h:46,label:'Dunlosky et al. 2013 utility ratings'})},
   {cap:"Blocked practice looks better during practice and loses a week later (Rohrer & Taylor 2007). Interleaving trains the choice of method, which is what exams and outages demand.",
    svg:compare({t:'BLOCKED',draw:x=>{ const col=c=>c==='A'?CY:(c==='B'?MG:AM); return [['A','A','A','A'],['B','B','B','B'],['C','C','C','C']].map((r,i)=>r.map((c,j)=>box(x+34+j*56,42+i*38,44,28,c,{size:11,stroke:col(c)})).join('')).join('')+text(x+140,165,'practice 89% → test 20%',{size:10,color:MG}); }},
      {t:'INTERLEAVED',draw:x=>{ const col=c=>c==='A'?CY:(c==='B'?MG:AM); return [['A','B','C','A'],['B','C','A','B'],['C','A','B','C']].map((r,i)=>r.map((c,j)=>box(x+34+j*56,42+i*38,44,28,c,{size:11,stroke:col(c)})).join('')).join('')+text(x+140,165,'practice 60% → test 63%',{size:10,color:LM}); }},{h:190,label:'Blocked vs interleaved practice, one week later'})},
   {cap:"The Feynman technique is a loop, not a step: the place you stall is the only honest map of what you do not understand yet.",
    svg:cycle(['pick a\nconcept','explain it\nsimply','find where\nyou stall','return &\nsimplify'],{label:'The Feynman technique'})}];

  I.p46m3=[{cap:"Oakley's two modes as pinball tables. Focused mode has tight bumpers: the ball follows a known path step by step. Diffuse mode has wide bumpers: the ball travels far and lands on unexpected connections.",
    svg:compare({t:'FOCUSED MODE',draw:x=>{ let s=''; for(let i=0;i<3;i++) for(let j=0;j<5;j++) s+=`<circle cx="${x+50+j*40}" cy="${55+i*35}" r="7" fill="none" stroke="${CY}"/>`; return s+`<path d="M${x+30} 45 L${x+70} 72 L${x+110} 50 L${x+150} 78 L${x+190} 55 L${x+230} 80" fill="none" stroke="${LM}" stroke-width="1.5"/>`+text(x+140,150,'tight bumpers: step by step',{size:10}); }},
      {t:'DIFFUSE MODE',draw:x=>{ let s=[[60,55],[210,55],[135,100],[60,125],[210,125]].map(([cx,cy])=>`<circle cx="${x+cx}" cy="${cy}" r="7" fill="none" stroke="${MG}"/>`).join(''); return s+`<path d="M${x+30} 40 Q ${x+140} 20 ${x+240} 90 T ${x+40} 140" fill="none" stroke="${LM}" stroke-width="1.5"/>`+text(x+140,150,'wide bumpers: new connections',{size:10}); }},{label:'Focused mode vs diffuse mode'})},
   {cap:"Attention residue (Leroy 2009): after a switch, part of your attention stays on the old task. Six phone checks in a 50-minute block cost about a quarter of it before counting the lost quality.",
    svg:svg(560,160,`${text(280,16,'one 50-minute block',{size:10,color:DIM})}
      <rect x="210" y="30" width="60" height="34" fill="${MG}" opacity="0.35"/><rect x="270" y="30" width="60" height="34" fill="${MG}" opacity="0.2"/><rect x="330" y="30" width="60" height="34" fill="${MG}" opacity="0.1"/>
      ${box(20,30,170,34,'task A: the lecture',{stroke:CY,fill:'#06303d',size:11})}${box(210,30,330,34,'task B: message · back to the lecture',{stroke:MG,size:11})}
      ${line(200,24,200,70,{stroke:AM,dash:true})}${text(200,82,'switch',{size:9,color:AM})}${text(330,82,'attention residue fades slowly',{size:9,color:MG})}
      ${text(280,112,'6 switches × 2 min re-entry = 12 of 50 min lost (24%)',{size:11,color:AM})}
      ${text(280,140,'phone in another room > pocket > desk (Ward et al. 2017)',{size:10,color:DIM})}`,'Attention residue and the cost of switching')},
   {cap:"A field worker's study day: retrieval at dawn, audio on the commute (hands-free, started before driving), a drill at lunch, a walk, then one deep block and a lab in the evening.",
    svg:flow([{t:'05:45\nRecall deck'},{t:'commute\naudio lesson',stroke:CY},{t:'lunch\nMixed drill'},{t:'17:30\nwalk, no phone',stroke:LM},{t:'18:00\n50-min block',stroke:MG},{t:'19:00\nlab / cards'}],{bw:120,bh:52,gap:40,label:"A field worker's study day"})}];

  I.p46m4=[{cap:"Burch's four stages of competence. Stage two is where learning is fastest and where most people quit; stage four is where plateaus hide.",
    svg:svg(560,205,`${box(20,140,120,42,'1 unconscious\nincompetence',{size:10,stroke:DIM})}${box(155,105,120,42,'2 conscious\nincompetence',{size:10,stroke:MG})}${box(290,70,120,42,'3 conscious\ncompetence',{size:10,stroke:AM})}${box(425,35,120,42,'4 unconscious\ncompetence',{size:10,stroke:LM})}
      ${arrow(140,161,155,126,'')}${arrow(275,126,290,91,'')}${arrow(410,91,425,56,'')}
      ${text(215,172,'fastest learning,\nmost quitting',{size:9,color:MG})}${text(485,100,'automatic —\nplateau risk',{size:9,color:LM})}`,'The four stages of competence')},
   {cap:"Deliberate practice is a loop with a goal at the edge of ability and immediate feedback. Repetition without the feedback step is experience, not practice.",
    svg:cycle(['goal at the\nedge of ability','full-attention\nattempt','immediate\nfeedback','analyze &\nrefine'],{label:'The deliberate practice loop'})},
   {cap:"Macnamara, Hambrick & Oswald (2014), 88 studies: deliberate practice explains a large share of performance in games and music and little in professions. The biggest lever you control — not the only one.",
    svg:svg(560,200,`${text(280,18,'Share of performance variance explained by deliberate practice',{size:10,color:DIM})}
      ${[['games',26],['music',21],['sports',18],['education',4],['professions',1]].map(([l,v],i)=>{ const x=60+i*100, h=v*4.6, top=165-h; return `<rect x="${x}" y="${top}" width="60" height="${h}" rx="3" fill="${CY}" opacity="0.75"/>`+text(x+30,top-9,v<2?'<1%':v+'%',{size:10,color:CY})+text(x+30,180,l,{size:10,color:DIM}); }).join('')}
      ${line(50,165,540,165,{stroke:DIM})}${text(280,196,'Macnamara, Hambrick & Oswald 2014 — meta-analysis of 88 studies',{size:9,color:DIM})}`,'Variance explained by deliberate practice by domain')}];

  I.p46m5=[{cap:"Bayesian updating on the branch outage. Each test is chosen for how differently the hypotheses predict it; two cheap tests take five suspects to one at 97 percent.",
    svg:svg(560,215,`${text(20,22,'hypothesis',{size:10,bold:true,anchor:'start'})}${text(185,22,'prior',{size:10,bold:true})}${text(275,22,'× P(ping ok)',{size:10,bold:true})}${text(380,22,'→ posterior',{size:10,bold:true})}${text(490,22,'→ after DNS fails',{size:10,bold:true})}${line(14,34,546,34,{stroke:DIM})}
      <rect x="14" y="38" width="532" height="24" rx="5" fill="none" stroke="${CY}"/>
      ${[['DNS broken','0.40','0.95','64%','97%',CY],['ACL on a port','0.25','0.70','30%','2%','currentColor'],['server down','0.20','0.05','2%','<1%','currentColor'],['cabling','0.10','0.02','0.3%','<1%','currentColor'],['other','0.05','0.50','4%','<1%','currentColor']].map((r,i)=>{ const y=50+i*28; return text(20,y,r[0],{size:10,anchor:'start',color:r[5]})+text(185,y,r[1],{size:10,mono:true})+text(275,y,r[2],{size:10,mono:true})+text(380,y,r[3],{size:10,mono:true,color:i===0?LM:'currentColor'})+text(490,y,r[4],{size:10,mono:true,color:i===0?LM:'currentColor'}); }).join('')}
      ${text(280,196,'two cheap tests: five suspects → one, at 97%',{size:11,color:AM})}`,'Bayesian updating of outage hypotheses')},
   {cap:"The abstraction ladder for 'the site is slow', with a concrete test on every rung. Debugging is moving between rungs on purpose; explanations that live on one rung are memorization.",
    svg:stack([{t:'"the site is slow" — the user\'s words',side:'browser dev tools'},{t:'HTTP: time to first byte',side:'curl -w',stroke:CY},{t:'TCP: retransmissions, window',side:'packet capture',stroke:CY},{t:'IP: route, latency, loss',side:'traceroute / ping',stroke:MG},{t:'physical: link errors, fiber loss',side:'switch counters, OTDR',stroke:AM}],{w:380,h:36,side:true,label:'The abstraction ladder with a test at every rung'})},
   {cap:"Pólya's four steps (1945). The fourth — looking back — is the one everyone skips and the one that produces transfer.",
    svg:cycle(['1 understand\nthe problem','2 devise\na plan','3 carry\nit out','4 look\nback'],{label:"Pólya's four steps"})}];

  I.p46m6=[{cap:"The Cornell layout builds retrieval practice into your notes: write cues after the lecture, then review by covering the notes and answering the cues; the summary strip is a Feynman paragraph.",
    svg:svg(560,222,`${box(40,20,130,135,'',{stroke:CY})}${text(105,72,'CUES\n(questions written\nafter the lecture)',{size:10,color:CY})}
      ${box(170,20,350,135,'',{stroke:'currentColor'})}${text(345,72,'NOTES\n(during the lecture, own words,\nno transcription)',{size:10})}
      ${box(40,155,480,45,'',{stroke:MG})}${text(280,178,'SUMMARY — one Feynman paragraph in your own words',{size:10,color:MG})}
      ${text(280,214,'review: cover the notes, answer the cues',{size:9,color:DIM})}`,'Cornell note layout')},
   {cap:"A Zettelkasten is a graph, not a filing cabinet: one idea per note, in your own words, with links that say why two ideas connect, and an index note per domain.",
    svg:svg(560,215,`${box(40,30,130,40,'ARP vs DNS\n(resolution)',{stroke:CY,size:10})}${box(230,20,130,40,'broadcast\ndomain',{size:10})}${box(400,30,130,40,'spoofing\n(conceptual)',{stroke:MG,size:10})}${box(120,120,130,40,'VLAN\n(segment)',{size:10})}${box(320,120,130,40,'DNS\nhierarchy',{size:10})}
      ${line(170,50,230,45)}${line(360,45,400,50)}${line(105,70,185,120)}${line(295,60,385,120)}${line(170,60,320,130,{dash:true})}
      ${text(200,36,'why',{size:8,color:DIM})}${text(380,36,'why',{size:8,color:DIM})}
      ${box(200,172,160,30,'INDEX: Domain 2 networking',{stroke:AM,size:10})}${line(185,160,250,172)}${line(385,160,330,172)}
      ${text(280,210,'one idea per note · own words · links say why',{size:9,color:DIM})}`,'A small Zettelkasten graph')},
   {cap:"Keshav's three-pass method for papers: most papers deserve only the first pass; the third is reserved for work you intend to build on.",
    svg:flow([{t:'pass 1\n5–10 min\nbird\'s-eye'},{t:'decide:\ncontinue?',stroke:AM},{t:'pass 2\n~1 hour\nfigures, refs',stroke:CY},{t:'pass 3\n4–5 hours\nre-implement',stroke:MG}],{bw:110,bh:58,gap:32,label:'Keshav\'s three-pass method'})}];

  I.p46m7=[{cap:"Calibration: predicted versus actual scores from the Module 7 example. Points below the diagonal are overconfidence; the pattern (both big misses in one domain) matters more than the mean.",
    svg:svg(560,230,`${text(290,16,'calibration: five quizzes, mean error +10',{size:10,color:DIM})}${line(60,30,60,190)}${line(60,190,520,190)}${line(60,190,520,30,{dash:true,stroke:DIM})}
      ${text(40,30,'100',{size:9,color:DIM})}${text(40,190,'50',{size:9,color:DIM})}${text(30,110,'actual',{size:9,color:DIM})}${text(60,203,'50',{size:9,color:DIM})}${text(290,203,'75',{size:9,color:DIM})}${text(520,203,'100',{size:9,color:DIM})}${text(290,220,'predicted score',{size:10,color:DIM})}
      ${[[90,70],[85,80],[80,85],[90,60],[75,75]].map(([p,a])=>{ const x=60+(p-50)/50*460, y=190-(a-50)/50*160; return `<circle cx="${x}" cy="${y}" r="5" fill="${a<p?MG:LM}"/>`; }).join('')}
      ${text(440,170,'below the line =\noverconfident',{size:9,color:MG})}${text(150,60,'above = underconfident',{size:9,color:LM})}`,'Calibration plot of predicted vs actual scores')},
   {cap:"The Dunning–Kruger pattern drawn correctly (schematic of Kruger & Dunning 1999): self-estimates sit near the 60th–70th percentile for every quartile. The effect is insensitivity, not inverted confidence — and part of it is statistical artefact.",
    svg:svg(560,222,`${text(150,20,'■ actual percentile',{size:10,color:CY})}${text(400,20,'■ self-estimate',{size:10,color:MG})}
      ${[['bottom 25%',12,60],['2nd',37,63],['3rd',62,68],['top 25%',87,72]].map(([l,a,p],i)=>{ const x=70+i*120; const ha=a*1.5, hp=p*1.5; return `<rect x="${x}" y="${175-ha}" width="40" height="${ha}" rx="3" fill="${CY}" opacity="0.75"/><rect x="${x+46}" y="${175-hp}" width="40" height="${hp}" rx="3" fill="${MG}" opacity="0.75"/>`+text(x+20,175-ha-9,String(a),{size:9,color:CY})+text(x+66,175-hp-9,'≈'+p,{size:9,color:MG})+text(x+43,190,l,{size:10,color:DIM}); }).join('')}
      ${line(50,175,540,175,{stroke:DIM})}${text(280,210,'estimates sit near 60–70 for everyone: insensitivity, not inverted confidence',{size:9,color:DIM})}`,'Dunning–Kruger 1999 pattern, schematic')},
   {cap:"The 12-month master plan with certification milestones. Mastery depth in Domains 1, 2, 3, 4, 7 and 8; survey depth elsewhere, with a 15 percent buffer and one rest day a week.",
    svg:flow([{t:'M1–2\nPh 46, 1, 2\nA+ Core 1'},{t:'M3–4\nPh 3, 16, 24\nA+ Core 2 · Net+',stroke:CY},{t:'M5–6\nPh 4, 13, 7, 25\nPCEP · Sec+',stroke:CY},{t:'M7–8\nPh 5, 18, 20, 8, 21\neJPT',stroke:MG},{t:'M9–10\nPh 14, 15, 11, 9, 12, 17\nCloud Practitioner',stroke:AM},{t:'M11–12\nPh 10, 19, 22, 23, 26\nPenTest+ · apply',stroke:LM}],{bw:150,bh:60,gap:30,label:'The 12-month plan'})},
   {cap:"The habit loop (Duhigg 2012) with an implementation intention as the cue: 'when I pour coffee at 5:45, I open the Recall deck.' Lally et al. (2010): a median of 66 days to automaticity.",
    svg:cycle(['cue\n(coffee at 5:45)','routine\n(open the deck)','reward\n(XP · streak · done)','craving\n(next morning)'],{label:'Cue, routine, reward'})}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
