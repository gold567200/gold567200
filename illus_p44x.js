/* Third figures — Domain 44: UX, UI Design & Accessibility. Adds to the figures in illus_p44.js (never replaces them). */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const add=(id,figs)=>{ window.ILLUS=window.ILLUS||{}; window.ILLUS[id]=(window.ILLUS[id]||[]).concat(figs); };
  const dot=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
  const ebar=(x1,x2,y,c)=>line(x1,y,x2,y,{stroke:c,sw:2.5})+line(x1,y-6,x1,y+6,{stroke:c,sw:1.6})+line(x2,y-6,x2,y+6,{stroke:c,sw:1.6});

  /* m1 — usability as numbers, before and after */
  const row=(x,y,k,v,c)=>text(x+16,y,k,{anchor:'start',size:10,color:DIM})+text(x+244,y,v,{anchor:'end',size:11,bold:true,color:c});
  add('p44m1',[{cap:"Usability as numbers, before and after. The baseline crew test scored 6 of 8 unaided, a median of 4:10 and SUS 58; bigger keys, a scan button and a specific error message gave 8 of 8, 2:05 and SUS 79 — about 333 hours a year across 40 crews.",
    svg:svg(560,232,`${box(10,8,260,154,'',{dash:true,stroke:DIM})}${box(290,8,260,154,'',{dash:true,stroke:DIM})}
      ${text(140,24,'BASELINE · 8 crew members',{bold:true,color:MG,size:11})}${text(420,24,'RETEST · 8 crew members',{bold:true,color:LM,size:11})}
      ${row(10,50,'effectiveness','6 of 8 · 75%',MG)}${row(10,74,'efficiency','median 4:10',MG)}${row(10,98,'satisfaction','SUS 58 (avg 68)',MG)}
      ${row(290,50,'effectiveness','8 of 8 · 100%',LM)}${row(290,74,'efficiency','median 2:05',LM)}${row(290,98,'satisfaction','SUS 79',LM)}
      ${text(140,128,'cause: 32-px keys, no scan,',{size:9,color:DIM})}${text(140,142,'"Invalid input"',{size:9,color:DIM})}
      ${text(420,128,'fix: 64-px keys, scan button,',{size:9,color:DIM})}${text(420,142,'error that says what to do',{size:9,color:DIM})}
      ${arrow(272,74,288,74,'')}
      ${box(10,174,540,50,'',{stroke:AM})}
      ${text(280,190,'40 crews × 2 min saved × 250 days = 20,000 min',{size:10})}
      ${text(280,208,'≈ 333 hours ≈ $13,300 a year at $40/h',{size:10,bold:true,color:AM})}`,
      'Effectiveness, efficiency and satisfaction before and after a redesign, with the yearly value')}]);

  /* m2 — margin of error shrinks, bias does not */
  add('p44m2',[{cap:"Sample size and bias are different errors. At 95% confidence the worst-case margin is ±9.8 points at n = 100, ±4.9 at 400 and ±3.1 at 1,000 — quadrupling n halves it — but a survey answered only by power users stays off the true value by the same amount at every size.",
    svg:svg(560,224,`${text(280,12,'Bigger n shrinks error, not bias',{bold:true,color:CY,size:11})}
      ${line(200,28,200,160,{stroke:LM,dash:true})}${line(330,28,330,160,{stroke:MG,dash:true})}
      ${ebar(252,408,50,CY)}${dot(330,50,5,MG)}${text(20,50,'n = 100',{anchor:'start',size:10})}${text(424,50,'±9.8 points',{anchor:'start',size:10,color:CY})}
      ${ebar(291,369,90,CY)}${dot(330,90,5,MG)}${text(20,90,'n = 400',{anchor:'start',size:10})}${text(424,90,'±4.9 points',{anchor:'start',size:10,color:CY})}
      ${ebar(305,355,130,CY)}${dot(330,130,5,MG)}${text(20,130,'n = 1,000',{anchor:'start',size:10})}${text(424,130,'±3.1 points',{anchor:'start',size:10,color:CY})}
      ${arrow(326,152,204,152,'')}${text(265,142,'sampling bias',{size:9,color:AM})}
      ${text(200,172,'true value',{size:10,color:LM})}${text(330,172,'power-user estimate',{size:10,color:MG})}
      ${text(280,196,'margin ≈ 1.96 × √( p(1 − p) / n )',{size:10,color:DIM,mono:true})}
      ${text(280,214,'quadruple n → half the margin; bias unchanged',{size:10,color:AM})}`,
      'Confidence intervals narrowing with sample size while a biased estimate stays away from the true value')}]);

  /* m3 — Hick's law: one flat list versus two levels */
  const rows=(x,y,n,w,hl,c)=>Array.from({length:n},(_,i)=>`<rect x="${x}" y="${y+i*18}" width="${w}" height="14" rx="2" fill="${hl.includes(i)?c:'none'}" ${hl.includes(i)?'opacity="0.35"':''} stroke="${DIM}" stroke-width="1"/>`).join('');
  const list14=()=>Array.from({length:14},(_,i)=>`<rect x="30" y="${30+i*11}" width="110" height="8" rx="2" fill="${i<4?CY:'none'}" ${i<4?'opacity="0.35"':''} stroke="${DIM}" stroke-width="1"/>`).join('');
  add('p44m3',[{cap:"Hick's law on the splice-type picker. One flat list of 14 familiar options costs log2(15) = 3.91 bits; splitting it into 4 categories of about 4 items costs 2 × log2(5) = 4.64 bits plus a second movement. Fewer choices per screen is not automatically faster.",
    svg:svg(560,224,`${text(140,14,'ONE FLAT LIST · 14 items',{bold:true,color:CY,size:11})}${text(420,14,'4 CATEGORIES → ~4 ITEMS',{bold:true,color:MG,size:11})}
      ${line(280,24,280,190,{stroke:DIM,dash:true})}
      ${list14()}
      ${text(85,194,'top 4 pinned',{size:9,color:CY})}
      ${text(210,58,'Hick: log2(n + 1)',{size:9,color:DIM})}${text(210,82,'log2(15)\n= 3.91 bits',{size:12,bold:true,color:CY,lh:15})}
      ${text(210,140,'one choice,\none movement',{size:10,color:DIM})}
      ${rows(300,46,4,48,[1],MG)}${arrow(350,71,372,71,'')}${rows(374,46,4,48,[2],MG)}
      ${text(490,58,'twice: log2(5)',{size:9,color:DIM})}${text(490,82,'2 × 2.32\n= 4.64 bits',{size:12,bold:true,color:MG,lh:15})}
      ${text(490,140,'two choices,\ntwo movements',{size:10,color:DIM})}
      ${text(372,140,'category,\nthen item',{size:9,color:DIM})}
      ${text(280,212,'flat list wins: 3.91 < 4.64 bits',{size:10,bold:true,color:LM})}`,
      'Hick\'s law comparison of one flat 14-item list against a two-level menu')}]);

  /* m4 — the contrast-ratio pipeline */
  const R=r=>30+(r-1)*36;
  add('p44m4',[{cap:"The WCAG contrast arithmetic as a pipeline: divide each channel by 255, linearize it, weight the channels into relative luminance, then divide (lighter + 0.05) by (darker + 0.05). #767676 on white lands at 4.54:1, just over the 4.5:1 line; the app's #0097b3 button with white text, at 3.46:1, passes only for large text until it is darkened to #007a91 (5.01:1).",
    svg:svg(560,224,`${text(280,12,'Contrast, computed: #767676 on white',{bold:true,color:CY,size:11})}
      ${box(10,26,96,52,'sRGB channel\n118 / 255\n= 0.4627',{stroke:CY,size:10})}${arrow(106,52,121,52,'')}
      ${box(121,26,96,52,'linearize\n(gamma 2.4)\n→ 0.181',{size:10})}${arrow(217,52,232,52,'')}
      ${box(232,26,96,52,'luminance L\ngray: R = G = B\nL = 0.181',{size:10})}${arrow(328,52,343,52,'')}
      ${box(343,26,96,52,'(1.0 + 0.05) /\n(0.181 + 0.05)',{size:10})}${arrow(439,52,454,52,'')}
      ${box(454,26,96,52,'4.54 : 1\npasses AA',{stroke:LM,color:LM,bold:true,size:11})}
      ${line(30,150,520,150,{stroke:DIM})}${text(30,164,'1:1',{size:9,color:DIM})}
      ${[[3,'3:1 large\ntext, UI'],[4.5,'4.5:1 AA\nbody text'],[7,'7:1 AAA']].map(([r,l])=>line(R(r),142,R(r),158,{sw:1.6})+text(R(r),170,l,{size:9,color:AM})).join('')}
      ${dot(R(3.46),150,5,MG)}${line(R(3.46),106,R(3.46),145,{stroke:MG})}${text(R(3.46),100,'#0097b3 · 3.46',{size:9,color:MG})}
      ${dot(R(4.54),150,4,'currentColor')}${line(R(4.54),118,R(4.54),145,{stroke:DIM})}${text(R(4.54)+4,118,'#767676 · 4.54',{size:9,anchor:'start'})}
      ${dot(R(5.01),150,5,LM)}${line(R(5.01),134,R(5.01),145,{stroke:LM})}${text(R(5.01)+4,134,'#007a91 · 5.01',{size:9,color:LM,anchor:'start'})}
      ${dot(R(12.9),150,5,CY)}${line(R(12.9),124,R(12.9),145,{stroke:CY})}${text(R(12.9),118,'cyan on #060a14 · 12.9',{size:9,color:CY})}
      ${text(280,206,'3.46 fails body text; darkened, 5.01 passes',{size:10,color:AM})}`,
      'Contrast ratio computed step by step and placed on a ruler of WCAG thresholds')}]);

  /* m5 — accessible name precedence */
  const step=(y,t,side,c,dash)=>box(24,y,250,32,t,{stroke:c,size:10,dash})+text(292,y+16,side,{anchor:'start',size:10,color:DIM,mono:/[<=]/.test(side)});
  add('p44m5',[{cap:"Where a control's accessible name comes from, in order of precedence: aria-labelledby, then aria-label, then native labeling (label, alt, legend, caption), then the element's own content for buttons and links. Title and placeholder are weak last resorts — which is why a placeholder is not a label.",
    svg:svg(560,222,`${text(280,12,'Accessible name: first source wins',{bold:true,color:CY,size:11})}
      ${arrow(12,30,12,206,'')}
      ${step(26,'1  aria-labelledby','highest precedence',CY)}
      ${step(66,'2  aria-label','aria-label="Close dialog"',CY)}
      ${step(106,'3  label, alt, legend, caption','<label for="fout">',LM)}
      ${step(146,'4  element content','a button\'s own text: Save',LM)}
      ${step(186,'5  title, placeholder','weak last resorts',AM,true)}`,
      'Accessible name sources from aria-labelledby down to title and placeholder')}]);

  /* m6 — small samples, wide intervals */
  const V=v=>120+v*4;
  add('p44m6',[{cap:"Small samples measure loosely. Four of five successes is consistent with a true rate anywhere from about 36% to 98%, one of five with 2% to 64%, and a five-person SUS mean of 70.5 spans 58 to 83 around the 68 average — report the interval, not the lone number.",
    svg:svg(560,214,`${text(280,12,'Five users: wide 95% intervals',{bold:true,color:CY,size:11})}
      ${text(10,48,'task, 4 of 5',{anchor:'start',size:10})}${ebar(V(36),V(98),48,CY)}${dot(V(80),48,5,CY)}${text((V(36)+V(98))/2,32,'36–98%',{size:10,color:CY})}
      ${text(10,90,'task 2, 1 of 5',{anchor:'start',size:10})}${ebar(V(2),V(64),90,MG)}${dot(V(20),90,5,MG)}${text((V(2)+V(64))/2,74,'2–64%',{size:10,color:MG})}
      ${text(10,132,'SUS, 5 users',{anchor:'start',size:10})}${ebar(V(58),V(83),132,LM)}${dot(V(70.5),132,5,LM)}${text(V(70.5),116,'70.5 (58–83)',{size:10,color:LM})}
      ${line(V(68),140,V(68),156,{stroke:AM,dash:true})}${text(V(68)-6,152,'68 avg',{size:9,color:AM,anchor:'end'})}
      ${line(120,170,520,170,{stroke:DIM})}${[0,25,50,75,100].map(v=>line(V(v),166,V(v),174,{stroke:DIM})+text(V(v),184,String(v),{size:9,color:DIM})).join('')}
      ${text(280,204,'five users find problems; they don\'t measure rates',{size:10,color:AM})}`,
      'Adjusted-Wald and SUS confidence intervals from a five-person test')}]);

  /* m7 — shifting accessibility left */
  add('p44m7',[{cap:"Shifting accessibility left puts a check at every stage: acceptance criteria in the ticket, a linter in the editor, axe in continuous integration through Playwright, a manual screen-reader pass before release, and an Accessibility Conformance Report updated each release. The design–engineering handoff runs both ways.",
    svg:svg(560,206,`${text(280,12,'Shift accessibility left: a check per stage',{bold:true,color:CY,size:11})}
      ${box(10,30,96,62,'ticket:\nacceptance\ncriteria',{stroke:CY,size:10})}${arrow(106,61,121,61,'')}
      ${box(121,30,96,62,'lint:\neslint-plugin-\njsx-a11y',{stroke:CY,size:10})}${arrow(217,61,232,61,'')}
      ${box(232,30,96,62,'CI: Playwright\n+ @axe-core/\nplaywright',{stroke:CY,size:10})}${arrow(328,61,343,61,'')}
      ${box(343,30,96,62,'manual screen-\nreader pass\nbefore release',{stroke:AM,size:10})}${arrow(439,61,454,61,'')}
      ${box(454,30,96,62,'ACR updated\neach release',{stroke:LM,size:10})}
      ${text(170,106,'automated: fast but partial',{size:9,color:DIM})}${text(396,106,'human verdict',{size:9,color:DIM})}
      ${text(280,132,'handoff runs both ways',{size:10,bold:true,color:LM})}
      ${box(40,144,200,46,'design: states, tokens,\naccessibility annotations',{stroke:MG,size:10})}
      ${box(320,144,200,46,'engineering: constraints,\ndata shapes, edge cases',{stroke:CY,size:10})}
      ${arrow(242,158,318,158,'')}${arrow(318,176,242,176,'')}`,
      'Accessibility checks from ticket to release and the two-way design-engineering handoff')}]);
})();
