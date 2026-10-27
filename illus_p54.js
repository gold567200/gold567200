/* Illustrations — Domain 54: Freelancing, IT Consulting & Running a Technical Business, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  // local helpers: translucent filled rect, circle, polyline (colors only via kit variables)
  const R=(x,y,w,h,c,op)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${c}" fill-opacity="${op==null?0.25:op}" stroke="${c}" stroke-width="1.2"/>`;
  const C=(cx,cy,r,c,fill)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill?c:'none'}" fill-opacity="${fill?0.35:1}" stroke="${c}" stroke-width="1.5"/>`;
  const PL=(pts,c,dash)=>`<polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${c}" stroke-width="2" ${dash?'stroke-dasharray="5 4"':''}/>`;
  const L=(lines,x,y,o)=>lines.map((t,i)=>text(x,y+i*(o&&o.step||20),t,Object.assign({anchor:'start',size:10},o||{}))).join('');

  /* ================= MODULE 1: business models ================= */
  I.p54m1=[{cap:"Six business models, ordered by what the client buys: from hours, where the client carries the risk and revenue is one-off, to managed outcomes, where revenue recurs and the provider carries the risk.",
    svg:svg(560,190,`${text(280,14,'WHAT THE CLIENT BUYS',{bold:true,color:CY,size:11})}
      ${[['FREELANCE\nhours','invoice per hour'],['CONSULTING\njudgment','fixed fee'],['AGENCY\nprojects','milestones'],['PRODUCTIZED\npackages','setup + monthly'],['MSP\nmanaged IT','per user/mo'],['MSSP\nsecurity','per endpoint/mo']].map(([b,s],i)=>box(10+i*91,28,84,56,b,{size:11,stroke:i<3?'currentColor':(i===3?AM:MG)})+text(52+i*91,100,s,{size:9,color:DIM})).join('')}
      ${arrow(20,124,540,124,'')}
      ${text(20,144,'one-off · client holds the risk',{anchor:'start',size:10})}${text(540,144,'recurring · you hold the risk',{anchor:'end',size:10})}
      ${text(280,174,'most small firms run two or three at once',{size:10,color:DIM})}`,'Six technical-services business models arranged from selling hours to selling managed outcomes')},
   {cap:"Project revenue is lumpy; recurring revenue stacks. The month MRR alone covers fixed costs (dashed line) is the month a slow sales period stops being a crisis.",
    svg:svg(560,230,(()=>{ const proj=[9,0,4,7,0,12,3,0,8,2,6,0], mrr=[3.0,3.4,3.8,4.1,4.5,4.9,5.3,5.6,6.0,6.4,6.7,7.1], k=9.4, base=190;
      let s=`${R(60,10,12,10,LM,0.4)}${text(78,15,'recurring (MRR)',{anchor:'start',size:10})}${R(200,10,12,10,AM,0.4)}${text(218,15,'project revenue',{anchor:'start',size:10})}`;
      s+=line(48,base,508,base)+line(48,base,48,30);
      [0,5,10,15].forEach(v=>{ s+=text(44,base-v*k,'$'+v+'k',{anchor:'end',size:9,color:DIM}); });
      proj.forEach((p,i)=>{ const x=52+i*38; s+=R(x,base-mrr[i]*k,30,mrr[i]*k,LM,0.4); if(p) s+=R(x,base-(mrr[i]+p)*k,30,p*k,AM,0.35); s+=text(x+15,204,String(i+1),{size:9,color:DIM}); });
      s+=line(48,base-6.4*k,508,base-6.4*k,{dash:true,stroke:MG})+text(512,base-6.4*k-6,'fixed',{anchor:'start',size:9,color:MG})+text(512,base-6.4*k+6,'costs',{anchor:'start',size:9,color:MG});
      s+=text(280,222,'month',{size:10,color:DIM}); return s; })(),'Stacked bar chart of lumpy project revenue on top of steadily growing recurring revenue against a fixed-cost line')},
   {cap:"Unit economics of one managed IT client: $1,200 of revenue minus $264 of tools and $432 of loaded labor leaves $504 of gross profit (42%), which repays a $2,800 acquisition cost in 5.6 months and is worth about $33,600 over the client's life at 1.5% monthly churn.",
    svg:svg(560,222,`${text(140,14,'ONE CLIENT, ONE MONTH',{bold:true,color:CY,size:11})}
      ${R(20,40,60,150,CY,0.3)}${text(50,32,'$1,200',{size:10,bold:true})}
      ${R(100,40,60,33,MG,0.3)}${text(130,57,'−$264',{size:10})}${line(80,40,100,40,{dash:true,stroke:DIM})}
      ${R(180,73,60,54,MG,0.3)}${text(210,100,'−$432',{size:10})}${line(160,73,180,73,{dash:true,stroke:DIM})}
      ${R(260,127,60,63,LM,0.35)}${text(290,152,'$504',{size:10,bold:true})}${text(290,166,'42%',{size:10})}${line(240,127,260,127,{dash:true,stroke:DIM})}
      ${line(10,190,330,190)}
      ${['revenue','tools','labor','gross profit'].map((t,i)=>text(50+i*80,204,t,{size:10})).join('')}
      ${box(360,30,190,46,'CAC $2,800\npayback 5.6 months',{stroke:AM,size:11})}
      ${box(360,90,190,46,'churn 1.5% a month\nLTV = 504 ÷ 0.015',{stroke:CY,size:11})}
      ${box(360,150,190,46,'LTV ≈ $33,600\nabout 12 × CAC',{stroke:LM,size:11})}
      ${arrow(324,150,356,120,'')}`,'Waterfall from revenue to gross profit for one managed IT client, with CAC, payback and LTV')}];

  /* ================= MODULE 2: clients and scoping ================= */
  I.p54m2=[{cap:"The sales funnel is arithmetic: 40 leads became 16 discovery calls, 8 proposals and 3 clients, a 7.5% lead-to-client rate, so two new clients a month needs about 27 leads or a better stage.",
    svg:svg(560,215,`${text(280,14,'LAST QUARTER, MODEL AGENCY',{bold:true,color:CY,size:11})}
      ${[['leads',40,'40',CY],['discovery calls',16,'16 · 40%',AM],['proposals',8,'8 · 50%',MG],['signed clients',3,'3 · 37.5%',LM]].map(([l,v,t,c],i)=>text(140,46+i*40,l,{anchor:'end',size:11})+R(150,32+i*40,v*9.5,28,c,0.3)+text(158+v*9.5,46+i*40,t,{anchor:'start',size:10})).join('')}
      ${text(280,200,'lead to client 7.5% · 2 clients a month needs about 27 leads',{size:10,color:DIM})}`,'Horizontal funnel bars from leads to discovery calls to proposals to signed clients')},
   {cap:"The document stack: one MSA signed once holds the legal terms; each project gets a short SOW; each change gets a signed change order; invoices follow milestones. When documents conflict, the order-of-precedence clause decides.",
    svg:svg(560,215,`${box(10,10,250,40,'MASTER SERVICES AGREEMENT',{stroke:CY,bold:true,size:11})}
      ${text(276,24,'signed once',{anchor:'start',size:10,bold:true})}${text(276,38,'liability, IP, confidentiality, payment',{anchor:'start',size:9,color:DIM})}
      ${line(80,50,80,64)}${line(200,50,200,64)}
      ${box(25,64,110,38,'SOW 1\nwebsite',{size:10})}${box(145,64,110,38,'SOW 2\nAI receptionist',{size:10})}
      ${text(276,78,'one per project',{anchor:'start',size:10,bold:true})}${text(276,92,'scope, exclusions, acceptance, fees',{anchor:'start',size:9,color:DIM})}
      ${line(200,102,200,114)}${box(150,114,100,30,'CO-01 Spanish',{size:10,stroke:AM})}
      ${text(276,124,'one per change',{anchor:'start',size:10,bold:true})}${text(276,138,'signed before work starts',{anchor:'start',size:9,color:DIM})}
      ${line(80,102,80,158)}${box(10,158,72,28,'deposit',{size:10})}${box(88,158,72,28,'launch',{size:10})}${box(166,158,84,28,'acceptance',{size:10})}
      ${text(276,168,'per milestone',{anchor:'start',size:10,bold:true})}${text(276,182,'50% · 40% · 10%, net 15',{anchor:'start',size:9,color:DIM})}
      ${text(280,206,'conflicts: the order-of-precedence clause decides',{size:10,color:DIM})}`,'Document hierarchy of MSA, statements of work, change orders and milestone invoices')},
   {cap:"Change control at small-firm scale: a request is logged and its impact assessed, then priced on a change order; work starts only after the client signs and the schedule is updated.",
    svg:flow(['REQUEST\nlogged','IMPACT\nscope, cost, days','PRICED\nchange order','SIGNED\nby the client','SCHEDULE\nupdated','WORK\nstarts'],{bw:120,label:'Change control flow from request to signed change order to work'})}];

  /* ================= MODULE 3: pricing and estimating ================= */
  I.p54m3=[{cap:"The rate formula laid out: pay, self-employment tax, benefits, overhead and a 15% profit add up to $167,079 of revenue needed; divided by 1,104 billable hours that is about $151 an hour, with a break-even (loaded cost) of about $129.",
    svg:svg(560,206,(()=>{ const f=520/167079, seg=[['pay',90000,CY],['SE tax',12717,MG],['benefits',10500,AM],['overhead',28800,DIM],['profit',25062,LM]]; let x=20, s=text(280,16,'REVENUE NEEDED: $167,079 A YEAR',{bold:true,color:CY,size:11}); const cx=[];
      seg.forEach(([l,v,c])=>{ const w=v*f; s+=R(x,32,w,36,c,0.3); cx.push(x+w/2); x+=w; });
      s+=text(cx[0],50,'$90,000 pay',{size:11})+text(cx[3],44,'$28,800',{size:10})+text(cx[3],57,'overhead',{size:10})+text(cx[4],44,'$25,062',{size:10})+text(cx[4],57,'profit',{size:10});
      s+=line(cx[1],68,cx[1],80,{stroke:MG})+text(cx[1]-4,90,'SE tax $12,717',{size:9,anchor:'end'})+line(cx[2],68,cx[2],108,{stroke:AM})+text(cx[2]-4,116,'benefits $10,500',{size:9,anchor:'end'});
      s+=text(280,150,'÷ 1,104 billable hours (1,840 available × 60%)',{size:11});
      s+=text(280,178,'= about $151 an hour',{size:14,bold:true,color:CY})+text(280,198,'break-even (loaded cost) about $129',{size:10,color:DIM}); return s; })(),'Stacked bar of the costs and profit that make up revenue needed, divided by billable hours to give the hourly rate')},
   {cap:"Utilization is the lever: the same $167,079 needs $227 an hour at 40% billable but $114 at 80%. A solo owner rarely sustains more than 60–65%, so a price that only works at 75% is a price that does not work.",
    svg:svg(560,224,(()=>{ const u=[40,45,50,55,60,65,70,75,80]; let s=text(280,14,'RATE NEEDED vs UTILIZATION (same $167,079)',{bold:true,color:CY,size:11})+line(56,190,544,190);
      u.forEach((p,i)=>{ const r=167079/(1840*p/100), h=r*0.62, x=62+i*54; s+=R(x,190-h,44,h,p===60?CY:DIM,p===60?0.45:0.25)+text(x+22,184-h,'$'+Math.round(r),{size:10,bold:p===60})+text(x+22,204,p+'%',{size:10}); });
      s+=text(300,220,'utilization (billable ÷ available hours)',{size:10,color:DIM}); return s; })(),'Bar chart of the hourly rate required at utilization from 40 to 80 percent')},
   {cap:"Where an AI receptionist's money goes, per call-minute with placeholder unit prices: voice (telephony, speech-to-text, text-to-speech and the platform fee) is about 90% of roughly $0.094; model tokens are about 10%.",
    svg:svg(560,160,(()=>{ const parts=[['phone',0.010,CY],['STT',0.010,AM],['TTS',0.015,LM],['voice platform',0.050,MG],['tokens',0.009,DIM]], f=500/0.094; let x=30, s=text(280,14,'COST PER CALL-MINUTE ≈ $0.094',{bold:true,color:CY,size:11});
      parts.forEach(([l,v,c])=>{ const w=v*f; s+=R(x,30,w,36,c,0.3)+text(x+w/2,48,l,{size:10})+text(x+w/2,82,'$'+v.toFixed(3),{size:9,color:DIM}); x+=w; });
      s+=line(30,96,445,96,{stroke:MG})+text(237,110,'voice ≈ 90%',{size:10,color:MG})+line(447,96,530,96,{stroke:DIM})+text(488,110,'≈ 10%',{size:10,color:DIM});
      s+=text(280,136,'3-minute call ≈ $0.28 · price with included minutes + overage',{size:10})+text(280,152,'swap in your vendors\' current prices in Lab 1',{size:9,color:DIM}); return s; })(),'Stacked bar of AI receptionist cost per minute by component')},
   {cap:"Local hardware versus a hosted API: a Studio at about $572 a month all-in is flat; API cost rises with tokens. Against frontier pricing ($3/$15 per million) break-even is near 177 million tokens a month; twenty receptionist clients use about 89 million, so on cost alone the API wins.",
    svg:svg(560,226,(()=>{ const X=m=>60+m*1.175, Y=d=>190-d*0.1143; let s=text(280,14,'MONTHLY COST: LOCAL STUDIO vs HOSTED API',{bold:true,color:CY,size:11});
      s+=line(60,190,535,190)+line(60,190,60,28);
      [0,100,200,300,400].forEach(m=>{ s+=text(X(m),204,m?m+'M':'0',{size:9,color:DIM}); });
      [0,500,1000].forEach(d=>{ s+=text(54,Y(d),'$'+d.toLocaleString('en-US'),{anchor:'end',size:9,color:DIM}); });
      s+=PL([[X(0),Y(572)],[X(400),Y(572)]],AM)+PL([[X(0),Y(0)],[X(400),Y(1296)]],MG)+PL([[X(0),Y(0)],[X(400),Y(431)]],LM);
      s+=line(X(89),190,X(89),40,{dash:true,stroke:DIM})+text(X(89)+4,48,'20 receptionist clients ≈ 89M',{anchor:'start',size:9});
      s+=C(X(177),Y(572),4,AM,1)+text(X(177)+6,Y(572)+18,'break-even ≈ 177M',{anchor:'start',size:10,bold:true});
      s+=text(530,Y(572)-8,'local ≈ $572 a month',{anchor:'end',size:10,color:AM})+text(318,86,'API at $3 / $15',{anchor:'end',size:10,color:MG})+text(530,158,'API at $1 / $5',{anchor:'end',size:10,color:LM});
      s+=text(298,220,'tokens per month',{size:10,color:DIM}); return s; })(),'Line chart of monthly cost against tokens for a local Mac Studio and two hosted API price tiers, with the break-even point')}];

  /* ================= MODULE 4: legal, risk and money ================= */
  I.p54m4=[{cap:"Sole proprietorship versus a single-member LLC in Texas: the tax default is the same, but the LLC separates business liabilities (if you keep it separate) at the cost of a $300 filing, a registered agent and an annual franchise report.",
    svg:compare({t:'SOLE PROPRIETORSHIP',draw:x=>L(['• forms automatically','• you are the business','• Schedule C + SE tax','• no franchise tax','• name: county clerk (DBA)'],x+14,52,{step:21})},
                {t:'SINGLE-MEMBER LLC',draw:x=>L(['• Certificate of Formation, $300','• liability stays with the LLC','• Schedule C + SE tax (default)','• franchise report by May 15','• needs a registered agent'],x+14,52,{step:21})},{h:170,label:'Comparison of a sole proprietorship and a single-member LLC in Texas'})},
   {cap:"How contracts move risk: a third party's claim lands on the client, the indemnity passes it to you, and your insurer pays only what the policy covers. The limitation-of-liability cap keeps one claim from exceeding a year of fees, except for the carve-outs.",
    svg:svg(560,206,`${text(134,30,'claim',{size:10,color:DIM})}${text(280,30,'indemnity',{size:10,color:DIM})}${text(426,30,'policy?',{size:10,color:DIM})}
      ${box(6,40,110,50,'THIRD PARTY\ncopyright owner',{size:10})}${arrow(116,65,150,65,'')}
      ${box(152,40,110,50,'CLIENT',{size:11,stroke:CY})}${arrow(262,65,296,65,'')}
      ${box(298,40,110,50,'YOUR LLC',{size:11,stroke:AM,bold:true})}${arrow(408,65,442,65,'')}
      ${box(444,40,110,50,'INSURER\nE&O, cyber',{size:10,stroke:LM})}
      ${text(10,114,'LIMITATION OF LIABILITY',{anchor:'start',bold:true,size:10,color:CY})}
      ${R(10,124,540,22,MG,0.15)}${text(280,135,'client\'s claimed loss: $250,000',{size:10})}
      ${R(10,152,39,22,LM,0.45)}${text(56,163,'cap = fees paid in 12 months: $18,000',{anchor:'start',size:10})}
      ${text(10,192,'carve-outs: confidentiality, indemnified IP claims, gross negligence',{anchor:'start',size:9,color:DIM})}`,'Diagram of a third-party claim passing through indemnity to your firm and insurer, and a liability cap bar')},
   {cap:"The filing calendar: federal estimated tax on April 15, June 15, September 15 and January 15; contractor 1099-NECs by January 31; the Texas franchise (Public Information) report by May 15; sales tax on the schedule the Comptroller assigns.",
    svg:svg(560,176,(()=>{ const mx=i=>30+i*41.67; let s=line(30,96,530,96);
      ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].forEach((m,i)=>{ s+=text(mx(i)+20.8,112,m,{size:9,color:DIM}); });
      const ev=[[mx(0)+18.8,'Q4 est.',50,56,MG],[mx(0)+40,'1099-NEC',30,36,AM],[mx(3)+19.4,'Q1 est.',50,70,MG],[mx(4)+18.8,'TX franchise',18,36,CY],[mx(5)+19.4,'Q2 est.',50,56,MG],[mx(8)+19.4,'Q3 est.',50,56,MG]];
      ev.forEach(([x,t,y,y0,c])=>{ s+=line(x,y0,x,93,{stroke:c})+C(x,96,3.5,c,1)+text(x,y,t,{size:9,color:c}); });
      s+=text(mx(3)+19.4,64,'+ return',{size:9,color:MG})+text(mx(4)+18.8,30,'report (PIR)',{size:9,color:CY});
      s+=R(30,126,500,18,LM,0.15)+text(280,135,'Texas sales tax: file monthly, quarterly or yearly, as the Comptroller assigns',{size:9});
      s+=text(280,164,'every month: reconcile the books and move tax money to its own account',{size:9,color:DIM}); return s; })(),'Annual calendar of federal estimated tax dates, 1099-NEC, Texas franchise report and sales tax filing')},
   {cap:"Four insurance layers for a technical firm, each paying for a different failure. Contracts often demand a certificate showing $1 million per occurrence; tell the broker exactly what you sell, because some policies exclude security testing or AI work unless declared.",
    svg:stack([{t:'GENERAL LIABILITY',side:'injury, property damage',stroke:CY},{t:'PROFESSIONAL (E&O)',side:'your mistakes, their loss',stroke:AM},{t:'CYBER: FIRST-PARTY',side:'your breach costs',stroke:MG},{t:'CYBER: THIRD-PARTY',side:'claims from others',stroke:MG}],{side:true,label:'Stack of insurance coverages for a technical services firm'})}];

  /* ================= MODULE 5: delivering managed services ================= */
  I.p54m5=[{cap:"Measure, target, promise: the SLI is the measurement, the SLO the internal target, the SLA the contract with credits. At 99.9% the month's error budget is 43.8 minutes; a 33-minute outage leaves 10.8, so risky changes wait.",
    svg:svg(560,196,`${box(10,10,250,48,'SLI: measured\n1-minute checks: 200 + keyword',{size:11,stroke:DIM})}${arrow(135,58,135,72,'')}
      ${box(10,74,250,48,'SLO: internal target\n99.9% a month',{size:11,stroke:CY})}${arrow(135,122,135,136,'')}
      ${box(10,138,250,48,'SLA: the contract\n99.5% + capped credits',{size:11,stroke:AM})}
      ${text(296,22,'ERROR BUDGET AT 99.9%',{anchor:'start',bold:true,size:11,color:CY})}
      ${text(296,42,'43,830 min × 0.1% = 43.8 min',{anchor:'start',size:10})}
      ${R(296,56,248,26,DIM,0.12)}${R(296,56,186.8,26,MG,0.35)}${text(389,69,'used: 33 min',{size:10})}${text(513,69,'10.8',{size:10})}
      ${text(296,106,'budget left → keep shipping',{anchor:'start',size:10,color:LM})}
      ${text(296,124,'budget gone → freeze risky changes',{anchor:'start',size:10,color:MG})}
      ${text(296,154,'SLA looser than SLO:',{anchor:'start',size:10,bold:true})}
      ${text(296,170,'you see trouble before it costs money',{anchor:'start',size:10})}`,'SLI, SLO and SLA ladder beside an error budget bar')},
   {cap:"The delivery loop: monitor what users feel, alert only on what needs action, open a prioritized ticket, respond from a runbook, resolve and notify, then review blamelessly and feed the fix back into monitoring.",
    svg:cycle(['MONITOR\nsymptoms','ALERT\nactionable','TICKET\npriority','RESPOND\nrunbook','RESOLVE\nnotify','REVIEW\npostmortem'],{label:'Cycle from monitoring through alert, ticket, response, resolution and review'})},
   {cap:"Backups as 3-2-1-1-0, and the restore arithmetic that tests them: pulling 200 GB from offsite over 100 Mbit/s takes about 4.4 hours before any rebuild, so a 4-hour RTO needs the local copy.",
    svg:svg(560,226,`${box(10,82,120,50,'CLIENT DATA\nproduction',{stroke:CY,size:11})}
      ${box(176,14,150,42,'COPY 2: local\nNAS or backup server',{size:10})}${box(176,86,150,42,'COPY 3: offsite\nobject storage',{size:10})}${box(176,158,150,42,'IMMUTABLE\nobject lock or offline',{size:10,stroke:AM})}
      ${arrow(130,100,174,40,'')}${arrow(130,107,174,107,'')}${arrow(130,114,174,174,'')}
      ${L(['RESTORE MATH'],346,24,{bold:true,color:CY,size:11})}
      ${L(['200 GB from offsite','× 8 = 1,600 Gbit','÷ 0.1 Gbit/s = 16,000 s'],346,46,{step:18})}
      ${text(346,106,'≈ 4.4 h: misses a 4 h RTO',{anchor:'start',size:10,bold:true,color:MG})}
      ${text(346,126,'→ restore from the local copy',{anchor:'start',size:10,color:LM})}
      ${L(['prove it quarterly: timed','restore, checksums match'],346,154,{step:16,color:DIM})}
      ${text(280,218,'3 copies · 2 media · 1 offsite · 1 immutable · 0 errors',{size:10,color:DIM})}`,'Three backup copies from production and the arithmetic of an offsite restore against the RTO')},
   {cap:"Incident communication on the clock (the Saturday outage from the worked example): alert at 09:12, acknowledgment at 09:14, first client notice at 09:20, fix at 09:41, resolution notice at 09:45, and a written post-incident report on Tuesday.",
    svg:svg(560,170,(()=>{ const X=m=>40+(m-10)*12; let s=text(280,14,'SATURDAY, P1: SITE RETURNS 503',{bold:true,color:CY,size:11})+line(X(10),86,X(50),86);
      [10,20,30,40,50].forEach(m=>{ s+=text(X(m),126,'09:'+m,{size:9,color:DIM}); });
      const ev=[[12,'alert',1,MG],[14,'ack',0,AM],[20,'first notice',1,CY],[41,'fixed',0,LM],[45,'resolved notice',1,CY]];
      ev.forEach(([m,t,up,c])=>{ const x=X(m); s+=C(x,86,4,c,1)+line(x,up?50:90,x,up?82:100,{stroke:c})+text(x,up?42:110,t,{size:10,color:c}); });
      s+=R(X(12),80,X(41)-X(12),12,MG,0.15);
      s+=text(280,150,'down 33 min → 99.925% for the month · report by Tuesday',{size:10}); return s; })(),'Timeline of a website outage from alert to resolution notice')}];

  /* ================= MODULE 6: security and AI done responsibly ================= */
  I.p54m6=[{cap:"Authorized security work is a sequence of documents and checks: the owner with authority signs, rules of engagement set the limits, testing stays in scope, and the report and retest close the engagement. Anything unexpected means stop and call the named contact.",
    svg:flow(['OWNER\nwith authority','WRITTEN\nauthorization','RULES OF\nENGAGEMENT','TEST\nin scope only','REPORT\nfindings','RETEST\nand close'],{bw:120,label:'Steps of an authorized security engagement'})},
   {cap:"An AI receptionist for a medical practice, drawn as a data flow: the greeting discloses automation and recording, every vendor that touches PHI signs a BAA, emergencies go to a human, and a retention schedule limits what is kept.",
    svg:svg(560,232,`${box(10,8,206,44,'GREETING DISCLOSES:\nautomated · may be recorded',{stroke:AM,size:10})}
      ${box(344,8,160,44,'HUMAN HANDOFF\nemergencies',{stroke:LM,size:10})}${arrow(300,80,342,48,'')}
      ${[['CALLER\nany state'],['CARRIER\ntelephony'],['VOICE PLATFORM\nSTT · model · TTS'],['BOOKING API\npractice system'],['SUMMARY\nsecure inbox']].map(([t],i)=>box(10+i*111,80,96,50,t,{size:10,stroke:i===2?MG:'currentColor'})+(i<4?arrow(106+i*111,105,119+i*111,105,''):'')).join('')}
      ${text(58,146,'consent by',{size:9})}${text(58,158,'continuing',{size:9})}
      ${text(169,146,'BAA if it',{size:9,color:MG})}${text(169,158,'records',{size:9,color:MG})}
      ${text(280,146,'BAA + DPA',{size:9,color:MG})}${text(280,158,'no training on audio',{size:9,color:MG})}
      ${text(391,146,'client system',{size:9})}${text(502,146,'client inbox',{size:9})}
      ${R(10,176,540,24,DIM,0.1)}${text(280,188,'retention: transcripts 30 days · logs 12 months · no voiceprints · no card numbers',{size:9})}
      ${text(280,220,'any vendor that refuses a BAA is designed out',{size:10,color:DIM})}`,'Data flow of an AI receptionist with disclosure, vendor agreements, human handoff and retention')},
   {cap:"Call-recording consent: federal law and Texas let one participant record, but about a dozen states require everyone's consent. Callers cross state lines, so the safe design discloses on every call.",
    svg:compare({t:'ONE-PARTY CONSENT',draw:x=>L(['• federal law (18 U.S.C. 2511)','• Texas (Penal Code 16.02)','• most other states','• one participant may record'],x+14,52,{step:22})},
                {t:'ALL-PARTY CONSENT (examples)',draw:x=>L(['• California · Florida','• Illinois · Maryland','• Massachusetts · Montana','• New Hampshire · Pennsylvania','• Washington'],x+14,52,{step:22})},{h:170,label:'Comparison of one-party and all-party call-recording consent rules'})},
   {cap:"Local or cloud AI for a client: local keeps data on hardware you control at a fixed cost but must be sized for peak load and secured by you; cloud is elastic and has frontier models but runs on vendor terms. Most clients end up hybrid.",
    svg:compare({t:'LOCAL (YOUR STUDIO)',draw:x=>L(['+ data stays on your hardware','+ fixed, predictable cost','− sized for peak; one box','− you patch, back up, secure','→ private, batch, steady work'],x+14,52,{step:21})},
                {t:'CLOUD API (DPA or BAA)',draw:x=>L(['+ elastic and redundant','+ frontier models','− usage bills, vendor terms','− data leaves your network','→ real-time, peaks, hardest tasks'],x+14,52,{step:21})},{h:170,label:'Comparison of local and cloud AI deployment for a client'})}];

  /* ================= MODULE 7: growing the business ================= */
  I.p54m7=[{cap:"The growth flywheel of a small service firm: reliable delivery produces measured results, which become case studies and reviews, which bring referrals and better-fit clients, who accept value-based prices that fund better delivery.",
    svg:cycle(['DELIVER\nreliably','MEASURE\nresults','CASE STUDY\n+ review','REFERRALS\npartners','BETTER\nclients','PRICE\nfor value'],{label:'Growth flywheel from delivery to results, case studies, referrals, better clients and pricing'})},
   {cap:"Hire when three signals agree. The model agency's utilization averaged 78% over 13 weeks, just under the 80% line, and its pipeline does not yet cover a salary, so it subcontracts now and hires later.",
    svg:svg(560,212,(()=>{ const u=[72,76,81,79,74,83,80,77,82,78,75,80,77]; let s=text(145,14,'UTILIZATION, LAST 13 WEEKS',{bold:true,color:CY,size:11})+line(30,180,262,180);
      u.forEach((v,i)=>{ const h=v*1.4; s+=R(32+i*18,180-h,14,h,v>=80?AM:CY,0.3); });
      s+=line(30,180-112,262,180-112,{dash:true,stroke:MG})+text(26,180-112,'80%',{anchor:'end',size:9,color:MG})+text(145,196,'weeks · average 78%',{size:10,color:DIM});
      s+=box(286,20,264,36,'UTILIZATION > 80% FOR 13 WEEKS\nnot yet: 78%',{size:10,stroke:AM});
      s+=box(286,64,264,36,'PIPELINE ≥ 1.5 × THE SALARY\nnot yet',{size:10,stroke:MG});
      s+=box(286,108,264,36,'CASH ≥ 3 MONTHS OF THE SALARY\nyes: $21,000',{size:10,stroke:LM});
      s+=box(286,156,264,40,'DECISION: subcontract now,\nhire when all three agree',{size:11,stroke:CY,bold:true}); return s; })(),'Weekly utilization bars against an 80 percent line beside three hiring signals and the decision')},
   {cap:"The one-page operating plan: every box fits on a single sheet, and the bottom row is the rhythm that keeps it alive: KPIs weekly, profit and loss monthly, the whole plan quarterly.",
    svg:svg(560,250,`${box(10,10,265,32,'PURPOSE: one line',{stroke:CY,size:11})}${box(285,10,265,32,'90-DAY MILESTONES',{stroke:CY,size:11})}
      ${box(10,50,265,44,'IDEAL CLIENT +\npositioning sentence',{size:10})}${box(285,50,265,44,'OFFERS + PRICES\nfrom the Lab 1 workbook',{size:10})}
      ${box(10,102,265,44,'12-MONTH TARGETS\nMRR · clients · margin',{size:10})}${box(285,102,265,44,'CHANNELS\n+ weekly sales activity',{size:10})}
      ${box(10,154,265,44,'CAPACITY · PARTNERS\nhiring triggers',{size:10})}${box(285,154,265,44,'TOP 3 RISKS\nwith mitigations',{size:10,stroke:MG})}
      ${box(10,206,540,36,'KPIs weekly · profit and loss monthly · plan quarterly',{stroke:LM,size:11,bold:true})}`,'Layout of a one-page operating plan')}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
