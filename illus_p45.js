/* Illustrations — Domain 45: Technical Project Management & Leadership, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  // small local helpers: translucent filled rect, circle, polyline (colors only via kit variables)
  const R=(x,y,w,h,c,op)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${c}" fill-opacity="${op==null?0.25:op}" stroke="${c}" stroke-width="1.2"/>`;
  const C=(cx,cy,r,c,fill)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill?c:'none'}" fill-opacity="${fill?0.3:1}" stroke="${c}" stroke-width="1.5"/>`;
  const PL=(pts,c,dash)=>`<polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${c}" stroke-width="2" ${dash?'stroke-dasharray="5 4"':''}/>`;
  /* ================= DOMAIN 45: Technical Project Management ================= */
  I.p45m1=[{cap:"The triple constraint governs how a project is delivered, but value is the target: an output (homes passed) only matters if it becomes an outcome (subscribers) and a benefit (revenue).",
    svg:svg(560,232,`<polygon points="130,42 30,190 230,190" fill="none" stroke="${CY}" stroke-width="1.6"/>
      ${text(130,28,'SCOPE',{bold:true,color:CY,size:11})}${text(42,207,'SCHEDULE',{bold:true,color:CY,size:11})}${text(220,207,'COST',{bold:true,color:CY,size:11})}
      ${text(130,138,'quality',{size:11})}${text(130,156,'+ resources, risk',{size:9,color:DIM})}
      ${box(320,18,220,48,'OUTPUT\n412 homes passed',{stroke:AM,size:11})}${arrow(430,66,430,86,'')}
      ${box(320,88,220,48,'OUTCOME\n190 subscribers',{stroke:LM,size:11})}${arrow(430,136,430,156,'')}
      ${box(320,158,220,48,'BENEFIT\n$159,600 revenue a year',{stroke:MG,size:11})}
      ${arrow(236,112,316,46,'')}${text(130,224,'how it is delivered',{size:10,color:DIM})}${text(430,224,'why it was worth doing',{size:10,color:DIM})}`,'Triple constraint triangle beside the output, outcome and benefit chain')},
   {cap:"Failure is the base rate. Of 16,000+ projects, fewer than half hit budget, 8.5% hit budget and schedule, and 0.5% also delivered the promised benefits (Flyvbjerg & Gardner 2023); CHAOS 2020 rates 31% of software projects successful.",
    svg:svg(560,240,`${text(280,14,'FLYVBJERG & GARDNER: 16,000+ PROJECTS',{bold:true,color:CY,size:11})}
      ${[['all projects · 100%',100],['on budget · ~48%',47.9],['+ on time · 8.5%',8.5],['+ benefits · 0.5%',0.5]].map(([l,v],i)=>text(10,40+i*28,l,{anchor:'start',size:10})+R(180,30+i*28,Math.max(3,v*3.6),20,i===3?MG:CY,0.3)).join('')}
      ${text(280,158,'STANDISH CHAOS 2020: SOFTWARE PROJECTS',{bold:true,color:CY,size:11})}
      ${R(10,170,167.4,30,LM,0.3)}${R(177.4,170,270,30,AM,0.3)}${R(447.4,170,102.6,30,MG,0.3)}
      ${text(93.7,185,'successful 31%',{size:10})}${text(312.4,185,'challenged 50%',{size:10})}${text(498.7,185,'failed 19%',{size:10})}
      ${text(280,226,'benefits are the hardest target of all',{size:10,color:DIM})}`,'Bar charts of project success rates from Flyvbjerg and Gardner and from CHAOS 2020')},
   {cap:"Choose the life cycle by how stable the requirements are and how expensive change is: predictive for a permit-fixed bore, adaptive for a provisioning app, hybrid when one project has both.",
    svg:svg(560,200,`${box(10,18,170,92,'PREDICTIVE\nplan it all, then build\ne.g. bore under highway',{stroke:CY,size:10})}
      ${box(195,18,170,92,'HYBRID\npredictive plant +\nagile portal, synced',{stroke:AM,size:10})}
      ${box(380,18,170,92,'ADAPTIVE\nplan each sprint\ne.g. provisioning app',{stroke:MG,size:10})}
      ${arrow(280,138,540,138,'')}${arrow(280,138,20,138,'')}
      ${text(20,158,'requirements stable,',{anchor:'start',size:10})}${text(20,172,'change expensive',{anchor:'start',size:10})}
      ${text(540,158,'requirements emerge,',{anchor:'end',size:10})}${text(540,172,'feedback cheap',{anchor:'end',size:10})}
      ${text(280,192,'incremental: light one serving area at a time',{size:9,color:DIM})}`,'Spectrum of project life cycles from predictive to adaptive')}];

  I.p45m2=[{cap:"The power-interest grid turns a stakeholder list into four engagement strategies; each Oak Hollow stakeholder lands in one quadrant.",
    svg:svg(560,250,`${box(70,20,230,100,'',{stroke:DIM})}${box(300,20,230,100,'',{stroke:DIM})}${box(70,120,230,100,'',{stroke:DIM})}${box(300,120,230,100,'',{stroke:DIM})}
      ${text(185,34,'KEEP SATISFIED',{bold:true,color:AM,size:10})}${text(415,34,'MANAGE CLOSELY',{bold:true,color:MG,size:10})}${text(185,134,'MONITOR',{bold:true,color:DIM,size:10})}${text(415,134,'KEEP INFORMED',{bold:true,color:LM,size:10})}
      ${C(130,62,6,AM,1)}${text(130,78,'city ROW office',{size:10})}${C(235,92,6,AM,1)}${text(235,108,'pole owner',{size:10})}
      ${C(470,62,6,MG,1)}${text(470,78,'ISP sponsor',{size:10})}${C(360,92,6,MG,1)}${text(360,108,'marketing VP',{size:10})}
      ${C(455,160,6,LM,1)}${text(455,176,'residents on route',{size:10})}${C(355,188,6,LM,1)}${text(355,204,'HOA board',{size:10})}
      ${C(160,178,6,DIM,1)}${text(160,194,'untouched utility',{size:10})}
      ${text(40,104,'power',{size:10,bold:true})}${text(40,118,'↑',{size:12})}${text(62,28,'high',{size:9,color:DIM,anchor:'end'})}${text(62,212,'low',{size:9,color:DIM,anchor:'end'})}
      ${text(76,234,'low',{size:9,color:DIM,anchor:'start'})}${text(300,236,'interest →',{size:10,bold:true})}${text(528,234,'high',{size:9,color:DIM,anchor:'end'})}`,'Power-interest grid with Oak Hollow stakeholders')},
   {cap:"A work breakdown structure decomposes the whole scope into deliverables, then work packages; the 100% rule says the children contain all of the parent's work and nothing else.",
    svg:svg(560,200,`${box(205,8,150,34,'FTTH Oak Hollow',{stroke:CY,bold:true,size:11})}${line(280,42,280,58)}${line(46,58,514,58)}
      ${['1 PM','2 Design,\npermits','3 Under-\nground','4 Aerial','5 Splicing','6 Test,\nas-builts','7 Restore'].map((t,i)=>line(46+i*78,58,46+i*78,70)+box(10+i*78,70,72,40,t,{size:10,stroke:i===2?AM:'currentColor'})).join('')}
      ${line(202,110,202,124)}${line(133,124,427,124)}
      ${['3.1 Locates','3.2 Bore,\nconduit','3.3 Hand-\nholes','3.4 Cable\nplacement'].map((t,i)=>line(133+i*98,124,133+i*98,136)+box(88+i*98,136,90,38,t,{size:10,stroke:AM})).join('')}
      ${text(280,190,'work packages: estimated, assigned, checked',{size:10,color:DIM})}`,'Work breakdown structure for the Oak Hollow fiber build')},
   {cap:"Forward and backward passes on the Oak Hollow network: A–B–D–F–G has zero float and sets the 52-day finish, while handholes (C) have 14 days of float and aerial (E) has 16.",
    svg:svg(560,262,`${[['A permits 10d','ES 0 · EF 10','float 0',8,100,1],['B bore 20d','ES 10 · EF 30','float 0',122,20,1],['C handholes 6d','ES 10 · EF 16','float 14',122,100,0],['E aerial 12d','ES 10 · EF 22','float 16',122,180,0],['D cable 8d','ES 30 · EF 38','float 0',236,60,1],['F splice 10d','ES 38 · EF 48','float 0',350,100,1],['G test 4d','ES 48 · EF 52','float 0',462,100,1]].map(([a,b,c,x,y,k])=>box(x,y,92,56,a+'\n'+b+'\n'+c,{size:10,stroke:k?MG:DIM,sw:k?2.2:1.2})).join('')}
      ${arrow(100,116,122,52,'',{stroke:MG})}${arrow(100,128,122,128,'')}${arrow(100,140,122,204,'')}
      ${arrow(214,48,236,78,'',{stroke:MG})}${arrow(214,128,236,100,'')}${arrow(328,96,350,118,'',{stroke:MG})}${arrow(214,210,350,146,'')}${arrow(442,128,462,128,'',{stroke:MG})}
      ${text(280,252,'critical path A–B–D–F–G = 52 days',{size:11,bold:true,color:MG})}`,'Critical path network diagram with early start, early finish and float')}];

  I.p45m3=[{cap:"Earned value at day 10 of the bore: work done (EV $102K) trails the plan (PV $120K) and costs more than budgeted (AC $112K), so the forecast (EAC ≈ $263.5K) lands above the $240K budget.",
    svg:svg(560,250,(()=>{ const X=d=>60+d*19.58, Y=k=>210-k*0.6786;
      const pv=PL([[X(0),Y(0)],[X(20),Y(240)]],CY), ev=PL([[0,0],[2,20],[4,38],[6,60],[8,80],[10,102]].map(([d,k])=>[X(d),Y(k)]),LM), ac=PL([[0,0],[2,22],[4,42],[6,66],[8,89],[10,112]].map(([d,k])=>[X(d),Y(k)]),MG);
      return `${line(60,210,535,210)}${line(60,210,60,20)}${line(60,Y(240),530,Y(240),{dash:true,stroke:DIM})}${text(66,Y(240)-8,'BAC $240K',{anchor:'start',size:10,color:DIM})}
      ${pv}${ev}${ac}${PL([[X(10),Y(112)],[X(23.5),Y(263.5)]],MG,true)}${C(X(23.5),Y(263.5),4,MG,1)}${text(545,16,'EAC ≈ $263.5K',{anchor:'end',size:10,color:MG})}
      ${line(X(10),210,X(10),34,{dash:true,stroke:AM})}${text(X(10),26,'status: day 10',{size:10,color:AM})}
      ${text(372,74,'PV (plan)',{anchor:'end',size:10,color:CY})}${text(250,124,'AC',{anchor:'end',size:10,color:MG})}${text(250,154,'EV',{anchor:'end',size:10,color:LM})}
      ${text(300,172,'SV = EV − PV = −$18K',{anchor:'start',size:10,color:AM})}${text(300,190,'CV = EV − AC = −$10K',{anchor:'start',size:10,color:AM})}
      ${text(60,224,'0',{size:9})}${text(X(10),224,'10',{size:9})}${text(X(20),224,'20',{size:9})}${text(300,240,'working days',{size:9,color:DIM})}
      ${text(54,Y(120),'120K',{anchor:'end',size:9})}${text(54,Y(240),'240K',{anchor:'end',size:9})}`; })(),'Earned value S-curves for planned value, earned value and actual cost')},
   {cap:"Every change, from a field reroute to a new cul-de-sac, takes one path: request, impact analysis, a decision by the named authority, baseline updates, then communication.",
    svg:flow([{t:'change\nrequest'},{t:'impact\nanalysis',stroke:AM},{t:'CCB or sponsor\ndecides',stroke:MG},{t:'update\nbaselines',stroke:CY},{t:'communicate\nand execute',stroke:LM}],{bw:110,bh:52,gap:40,label:'Integrated change control path'})},
   {cap:"Contract types move cost risk between seller and buyer; fiber construction runs on unit prices, so the reconciled as-built quantities become the invoice.",
    svg:svg(560,192,`${text(280,14,'WHO CARRIES THE COST RISK?',{bold:true,color:CY,size:11})}
      ${[['FIRM FIXED\nPRICE\nscope fully defined',CY],['UNIT PRICE\nrate fixed,\nquantity varies',LM],['TIME AND\nMATERIALS\ncap with a NTE',AM],['COST PLUS\nFEE\nhigh uncertainty',MG]].map(([t,c],i)=>box(10+i*137,28,129,64,t,{stroke:c,size:10})).join('')}
      ${arrow(280,114,540,114,'')}${arrow(280,114,20,114,'')}
      ${text(20,132,'seller carries cost risk',{anchor:'start',size:10})}${text(540,132,'buyer carries cost risk',{anchor:'end',size:10})}
      ${box(100,150,360,32,'fiber construction: unit price · as-built = invoice',{stroke:LM,size:10})}`,'Contract types arranged by who carries cost risk')}];

  I.p45m4=[{cap:"A probability–impact matrix ranks the register at a glance: the permit delay and heat illness land in red, rock on the bore in amber, and each score is P × I on scales defined in advance.",
    svg:svg(560,250,`${Array.from({length:25},(_,n)=>{ const r=Math.floor(n/5), c=n%5, P=5-r, Imp=c+1, s=P*Imp; return R(80+c*52,20+r*36,52,36,s>=15?MG:(s>=8?AM:LM),0.16); }).join('')}
      ${[1,2,3,4,5].map(i=>text(106+(i-1)*52,212,String(i),{size:9})+text(72,38+(5-i)*36,String(i),{size:9,anchor:'end'})).join('')}
      ${text(210,230,'impact →',{size:10,bold:true})}${text(36,104,'proba-',{size:10,bold:true})}${text(36,118,'bility ↑',{size:10,bold:true})}
      ${[['R1',2,4],['R2',3,2],['R3',2,3],['R4',4,4],['R5',2,5],['R6',3,5]].map(([l,p,im])=>{ const x=80+(im-1)*52+26, y=20+(5-p)*36+18; return C(x,y,12,'currentColor')+text(x,y,l,{size:9,bold:true}); }).join('')}
      ${[['R1 rock on bore · 2×4 = 8',AM],['R2 locates late · 3×2 = 6',LM],['R3 pole replacements · 6',LM],['R4 permit delay · 4×4 = 16',MG],['R5 portal data breach · 10',AM],['R6 crew heat illness · 15',MG]].map(([t,c],i)=>text(360,34+i*24,t,{anchor:'start',size:10,color:c})).join('')}
      ${text(360,190,'red ≥ 15 · amber 8–14 · green ≤ 7',{anchor:'start',size:9,color:DIM})}`,'Five-by-five probability and impact heat map with six risks plotted')},
   {cap:"A decision tree prices the bore-versus-aerial choice: expected costs of $21,600 and $21,000 are nearly tied, so the months of make-ready risk on the aerial route decide it.",
    svg:svg(560,230,`${box(14,98,26,26,'',{stroke:CY,rx:2})}${text(27,138,'decide',{size:9,color:DIM})}
      ${line(40,104,150,55,{stroke:CY})}${line(40,118,150,165,{stroke:AM})}${text(62,50,'bore: $18,000',{anchor:'start',size:10,color:CY})}${text(62,184,'aerial: $15,000',{anchor:'start',size:10,color:AM})}
      ${C(160,55,10,CY)}${line(170,52,296,30)}${line(170,58,296,80)}${text(302,30,'rock 30% → +$12,000',{anchor:'start',size:10})}${text(302,80,'no rock 70% → $0',{anchor:'start',size:10})}
      ${C(160,165,10,AM)}${line(170,162,296,140)}${line(170,168,296,190)}${text(302,140,'poles 40% → +$15,000',{anchor:'start',size:10})}${text(302,190,'no poles 60% → $0',{anchor:'start',size:10})}
      ${box(436,35,114,40,'EMV $21,600',{stroke:CY,size:11,bold:true})}${box(436,145,114,40,'EMV $21,000',{stroke:AM,size:11,bold:true})}
      ${text(280,220,'nearly tied on money: schedule decides',{size:10,color:DIM})}`,'Decision tree comparing boring and aerial construction by expected monetary value')},
   {cap:"The hierarchy of controls ranks job-hazard-analysis controls: remove the hazard first, and treat PPE as the last line, never the first.",
    svg:svg(560,226,`${[['ELIMINATION · overlash, no dig',500,LM],['SUBSTITUTION · bore, not open trench',420,LM],['ENGINEERING · trench box, vacuum excavation',340,CY],['ADMINISTRATIVE · 811, JHA, work zone',260,AM],['PPE · hard hat, vest, glasses',180,MG]].map(([t,w,c],i)=>box(280-w/2,8+i*40,w,34,t,{stroke:c,size:11})).join('')}
      ${text(280,218,'most effective at the top · PPE is the last line',{size:10,color:DIM})}`,'Inverted pyramid of the hierarchy of controls with fiber examples')}];

  I.p45m5=[{cap:"Scrum's loop: the Product Owner orders the Product Backlog, Sprint Planning sets a Sprint Goal, the Developers inspect daily, and each Sprint ends with an Increment that meets the Definition of Done, reviewed and retrospected.",
    svg:flow([{t:'Product\nBacklog',stroke:CY},{t:'Sprint\nPlanning'},{t:'Sprint\nBacklog',stroke:CY},{t:'Daily Scrum\n15 minutes'},{t:'Increment\nmeets DoD',stroke:LM},{t:'Review and\nRetrospective',stroke:MG}],{bw:112,bh:52,gap:40,label:'The Scrum loop'})},
   {cap:"Little's law on a splicing crew's Kanban board: at four closures a day, cutting work in progress from 12 to 8 cuts the average cycle time from 3 days to 2.",
    svg:svg(560,236,`${[['READY',DIM,4,1],['SPLICING · WIP 8',AM,8,2],['TESTING · WIP 4',CY,4,1],['DONE',LM,6,1]].map(([h,c,n,cols],i)=>{ const x=10+i*137; let s=box(x,8,129,28,h,{stroke:c,size:10,bold:true})+box(x,40,129,118,'',{stroke:DIM,dash:true});
        for(let k=0;k<n;k++){ const cc=cols===2?k%2:0, rr=cols===2?Math.floor(k/2):k; const w=cols===2?52:109; s+=R(x+10+cc*57,48+rr*(cols===2?27:18),w,cols===2?20:13,c,0.22); } return s; }).join('')}
      ${text(280,178,"cycle time = WIP ÷ throughput (Little's law)",{size:11,bold:true,color:CY})}
      ${text(280,198,'12 in progress ÷ 4 a day = 3 days',{size:11})}${text(280,218,'WIP limit 8 ÷ 4 a day = 2 days',{size:11,color:LM})}`,'Kanban board with WIP limits and the Little\'s law arithmetic')},
   {cap:"A hybrid plan: the plant runs on a predictive critical-path schedule, the portal runs in ten-day Sprints, and both meet at the 'first area lit' milestone on day 40.",
    svg:svg(560,222,`${text(45,46,'PLANT',{size:10,bold:true,color:CY})}${text(45,60,'predictive',{size:9,color:DIM})}
      ${box(90,40,75,26,'permits',{stroke:CY,size:10})}${box(165,40,150,26,'bore and conduit',{stroke:CY,size:10})}${box(315,40,75,26,'cable+splice',{stroke:CY,size:9})}${box(390,40,150,26,'next serving areas',{stroke:DIM,size:10,dash:true})}
      ${text(45,116,'PORTAL',{size:10,bold:true,color:MG})}${text(45,130,'agile',{size:9,color:DIM})}
      ${[1,2,3,4,5,6].map(n=>box(90+(n-1)*75,110,75,26,'Sprint '+n,{stroke:n<=4?MG:DIM,size:10,dash:n>4})).join('')}
      ${line(390,28,390,150,{dash:true,stroke:LM,sw:2})}${text(390,166,'first area lit · day 40',{size:10,bold:true,color:LM})}
      ${line(90,186,540,186)}${[0,10,20,30,40,50,60].map(d=>text(90+d*7.5,198,String(d),{size:9})).join('')}${text(315,214,'working days',{size:9,color:DIM})}`,'Two-lane hybrid timeline joining a construction schedule and software sprints at a milestone')}];

  I.p45m6=[{cap:"Situational leadership matches the style to the person and the task: the same tech may need delegating on bores and directing on a new splicer.",
    svg:svg(560,250,`${box(72,22,224,84,'S1 DIRECTING\nshow, then watch\napprentice, first splice',{stroke:MG,size:10})}${box(304,22,224,84,'S2 COACHING\ndirect and explain why\nlearning but frustrated',{stroke:AM,size:10})}
      ${box(72,114,224,84,'S4 DELEGATING\noutcome, deadline, trust\nveteran on a routine bore',{stroke:LM,size:10})}${box(304,114,224,84,'S3 SUPPORTING\nlisten and encourage\nskilled, lost confidence',{stroke:CY,size:10})}
      ${arrow(66,204,534,204,'')}${arrow(66,204,66,16,'')}${text(300,222,'supportive behavior →',{size:10,bold:true})}
      ${text(34,100,'directive',{size:9,bold:true})}${text(34,113,'behavior ↑',{size:9,bold:true})}
      ${text(300,242,'diagnose competence and commitment per task',{size:9,color:DIM})}`,'Situational leadership quadrants with field examples')},
   {cap:"The five conflict modes plotted by assertiveness and cooperativeness, with PMBOK's names and the situation each fits; force is correct for safety, collaborate for lasting decisions.",
    svg:svg(560,250,`${box(80,24,180,52,'COMPETING\nforce/direct · safety',{stroke:MG,size:10})}${box(340,24,180,52,'COLLABORATING\nproblem-solve · lasting',{stroke:LM,size:10})}
      ${box(210,90,180,52,'COMPROMISING\nreconcile · deadline',{stroke:AM,size:10})}
      ${box(80,150,180,48,'AVOIDING\nwithdraw · cool off',{stroke:DIM,size:10})}${box(340,150,180,48,'ACCOMMODATING\nsmooth · their priority',{stroke:CY,size:10})}
      ${arrow(66,206,534,206,'')}${arrow(66,206,66,16,'')}${text(300,224,'cooperativeness →',{size:10,bold:true})}
      ${text(34,100,'assert-',{size:9,bold:true})}${text(34,113,'iveness ↑',{size:9,bold:true})}
      ${text(300,242,'pick the mode by stakes and relationship',{size:9,color:DIM})}`,'Thomas-Kilmann conflict modes on assertiveness and cooperativeness axes')},
   {cap:"The rock change order on a number line: your floor ($28 a foot, true cost) and the owner's BATNA ($39.60 a foot) bound the ZOPA; the $31 deal leaves both sides better off than walking away.",
    svg:svg(560,180,`${R(100,78,348,24,AM,0.18)}${line(40,90,520,90,{sw:2})}
      ${[26,28,30,32,34,36,38,40,42].map(v=>line(40+(v-26)*30,86,40+(v-26)*30,94)+text(40+(v-26)*30,108,'$'+v,{size:9})).join('')}
      ${text(274,68,'ZOPA $28 – $39.60 a foot',{size:11,bold:true,color:AM})}
      ${line(100,46,100,78,{stroke:CY})}${text(100,24,'your floor',{size:10,color:CY})}${text(100,38,'$28 (true cost)',{size:10,color:CY})}
      ${line(448,46,448,78,{stroke:MG})}${text(448,24,"owner's BATNA",{size:10,color:MG})}${text(448,38,'$39.60 (specialist)',{size:10,color:MG})}
      ${'<polygon points="190,82 198,90 190,98 182,90" fill="'+LM+'" stroke="'+LM+'"/>'}${text(190,132,'deal: $31 × 1,500 ft = $46,500',{size:11,bold:true,color:LM})}
      ${text(280,162,'you clear $4,500 · owner saves $12,890 vs BATNA',{size:10,color:DIM})}`,'Negotiation number line showing the zone of possible agreement')}];

  I.p45m7=[{cap:"US median pay along the path from field to project management (BLS, May 2025), with PMI's 2025 survey median for PMP holders; medians, not offers.",
    svg:svg(560,232,`${text(280,14,'US MEDIAN PAY (BLS MAY 2025 · PMI 2025 SURVEY)',{bold:true,color:CY,size:10})}
      ${[['line installer (telecom)',74300,AM],['construction supervisor',79920,AM],['PM specialist',102320,CY],['construction manager',114990,CY],['PMP holder (PMI)',135000,MG]].map(([l,v,c],i)=>{ const w=v/135000*330, y=30+i*36; return text(10,y+11,l,{anchor:'start',size:10})+R(160,y,w,22,c,0.3)+text(166+w,y+11,'$'+v.toLocaleString('en-US'),{anchor:'start',size:10}); }).join('')}
      ${text(280,222,'region and the size of jobs you can prove decide the number',{size:9,color:DIM})}`,'Bar chart of median pay from line installer to PMP holder')},
   {cap:"Exam weights mapped to this domain's modules: business analysis is 27% of the CAPM and the most under-studied domain; Project+ adds IT governance from Domains 26 and 33.",
    svg:svg(560,210,`${text(280,14,'CAPM CONTENT OUTLINE (2023 UPDATE)',{bold:true,color:CY,size:11})}
      ${(()=>{ let x=10, s=''; [['Fundamentals 36%',36,CY,'Modules 1–4, 6'],['Predictive 17%',17,AM,'M2–M3'],['Agile 20%',20,LM,'M5'],['Business analysis 27%',27,MG,'M2, M5, M6']].forEach(([l,p,c,m])=>{ const w=p*5.4; s+=R(x,26,w,34,c,0.3)+text(x+w/2,43,l,{size:10})+text(x+w/2,74,m,{size:9,color:DIM}); x+=w; }); return s; })()}
      ${text(280,104,'COMPTIA PROJECT+ PK0-005',{bold:true,color:CY,size:11})}
      ${(()=>{ let x=10, s=''; [['Concepts 33%',33,CY,'M1, M5, M6'],['Life cycle 30%',30,AM,'M2–M4'],['Tools, docs 19%',19,LM,'M3, M7'],['IT, gov. 18%',18,MG,'Domains 26, 33']].forEach(([l,p,c,m])=>{ const w=p*5.4; s+=R(x,116,w,34,c,0.3)+text(x+w/2,133,l,{size:10})+text(x+w/2,164,m,{size:9,color:DIM}); x+=w; }); return s; })()}
      ${text(280,196,'study by weight, score your mocks by domain',{size:10,color:DIM})}`,'Stacked bars of CAPM and Project+ domain weights mapped to modules')},
   {cap:"A portfolio holds everything the organization funds; a program coordinates related projects for a shared benefit; operations run what the projects built.",
    svg:tree({t:'Portfolio',kids:[{t:'Project:\nOSS upgrade'},{t:'Program:\ncity launch',kids:['area 1','portal']},{t:'Operations:\nNOC'}]},{three:true,label:'Portfolio, program, project and operations hierarchy'})}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
