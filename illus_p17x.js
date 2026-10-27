/* Third figures — Domain 17: Cloud Computing: AWS, Azure & Google Cloud. Adds to the figures in illus_p17.js (never replaces them). */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const add=(id,figs)=>{ window.ILLUS=window.ILLUS||{}; window.ILLUS[id]=(window.ILLUS[id]||[]).concat(figs); };
  /* local helpers, kit colors only */
  const hl=(x,y,w,h,c,op)=>'<rect x="'+(+x).toFixed(1)+'" y="'+(+y).toFixed(1)+'" width="'+(+w).toFixed(1)+'" height="'+(+h).toFixed(1)+'" rx="3" fill="'+c+'" opacity="'+(op||0.2)+'"/>';
  const elbow=(d,o={})=>'<path d="'+d+'" fill="none" stroke="'+(o.stroke||'currentColor')+'" stroke-width="'+(o.sw||1.3)+'"'+(o.dash?' stroke-dasharray="5 4"':'')+' marker-end="url(#ah)"/>';
  const rr=(x,y,w,h,c,o={})=>'<rect x="'+(+x).toFixed(1)+'" y="'+(+y).toFixed(1)+'" width="'+(+w).toFixed(1)+'" height="'+(+h).toFixed(1)+'" rx="'+(o.rx==null?3:o.rx)+'" fill="none" stroke="'+c+'" stroke-width="'+(o.sw||1.3)+'"/>';
  const panel=(x,y,w,h,t,c)=>box(x,y,w,h,'',{dash:true,stroke:DIM})+text(x+w/2,y+16,t,{bold:true,color:c,size:11});

  /* M1 — capex versus pay-as-you-go, the worked example as bars */
  add('p17m1',[{cap:"The lecture's capex-versus-cloud example as monthly bars: the home tower costs about $56 a month in depreciation, electricity and a static IP before any labor, with one power supply and one disk between you and an outage, while a t4g.small with a 20 GB disk costs about $13.86. Renting wins for small, bursty or internet-facing work, but not for a GPU box that runs around the clock.",
    svg:svg(560,220,(()=>{
      const k=7, x0=150; let s='';
      const seg=(x,y,w,t,c)=>hl(x,y,w,34,c,0.3)+box(x,y,w,34,t,{stroke:c,rx:2,size:10});
      s+=text(140,47,'home tower',{size:11,bold:true,anchor:'end'})+text(140,61,'5-year capex',{size:9,color:DIM,anchor:'end'});
      s+=seg(x0,36,30*k,'$30 hardware',CY)+seg(x0+30*k,36,11.39*k,'$11.39 power',AM)+seg(x0+41.39*k,36,15*k,'$15 static IP',MG);
      s+=text(544,26,'≈ $56 / month',{size:11,bold:true,anchor:'end'})+text(x0,86,'plus patching; one PSU, one disk',{size:9,color:MG,anchor:'start'});
      s+=text(140,121,'cloud t4g.small',{size:11,bold:true,anchor:'end'})+text(140,135,'pay-as-you-go',{size:9,color:DIM,anchor:'end'});
      s+=hl(x0,110,12.26*k,34,CY,0.3)+rr(x0,110,12.26*k,34,CY,{rx:2})+hl(x0+12.26*k,110,1.6*k,34,AM,0.5)+rr(x0+12.26*k,110,1.6*k,34,AM,{rx:1});
      s+=text(x0+13.86*k+10,127,'≈ $13.86 / month',{size:11,bold:true,color:LM,anchor:'start'});
      s+=text(x0,160,'$12.26 instance + $1.60 gp3 disk',{size:10,anchor:'start'})+text(x0,176,'IP and 50 GB egress: $0',{size:10,color:DIM,anchor:'start'});
      s+=text(280,208,'exception: a 24/7 GPU (g6.xlarge ≈ $584/month)',{size:10,color:AM});
      return s; })(),'Monthly cost bars for a home server versus a small cloud instance')}]);

  /* M2 — four ways to pay, matched to the shape of demand */
  add('p17m2',[{cap:"Four prices for the same m7i.large, matched to the shape of a day's demand: commit to the steady baseline with a Savings Plan, pay on demand for the unpredictable peaks, and run interruptible batch work on spot. Spot is cheapest because AWS can reclaim it with a two-minute warning, so only work that can be resumed belongs there.",
    svg:svg(560,232,(()=>{
      const X=h=>50+h*13.333, Y=v=>190-v*15; const dem=[4,4,4,4,4,4,4,5,7,9,10,10,9,10,9,8,8,7,6,5,4,4,4,4,4];
      let s=line(50,190,372,190)+line(50,190,50,32)+text(56,28,'instances running',{size:9,color:DIM,anchor:'start'});
      [0,6,12,18,24].forEach(h=>{ s+=line(X(h),190,X(h),194)+text(X(h),204,h+'h',{size:9,color:DIM}); });
      s+=hl(50,Y(4),320,60,CY,0.28)+line(50,Y(4),370,Y(4),{stroke:CY});
      const pts=dem.map((v,h)=>X(h).toFixed(1)+','+Y(v).toFixed(1)).join(' ');
      s+='<polygon points="'+X(0)+','+Y(4)+' '+pts+' '+X(24).toFixed(1)+','+Y(4)+'" fill="'+AM+'" fill-opacity="0.28" stroke="'+AM+'" stroke-width="1.4"/>';
      s+=hl(X(1),Y(7),X(3.5)-X(1),45,MG,0.35)+rr(X(1),Y(7),X(3.5)-X(1),45,MG);
      s+=text(X(2.25),Y(7)-10,'spot: batch',{size:10,color:MG,bold:true});
      s+=text(225,100,'on demand: peaks',{size:10,color:AM,bold:true})+text(210,160,'Savings Plan: steady baseline',{size:10,color:CY,bold:true});
      s+=text(210,224,'a typical day (illustrative shape)',{size:9,color:DIM});
      s+=text(472,36,'m7i.large, per hour',{size:11,bold:true});
      [['on demand','$0.1008',AM],['1-yr Savings Plan','$0.067',CY],['3-yr Savings Plan','$0.046',CY],['spot','$0.045',MG]].forEach(([l,p,c],i)=>{ const y=62+i*24; s+=text(395,y,l,{size:10,color:c,anchor:'start'})+text(552,y,p,{size:10,color:c,bold:true,anchor:'end'}); });
      s+=text(472,166,'spot: 2-minute reclaim warning',{size:9,color:MG})+text(472,184,'us-east-1 list prices',{size:9,color:DIM});
      return s; })(),'A day of demand split into a Savings Plan baseline, on-demand peaks and a spot batch block')}]);

  /* M3 — 3-2-1 backups against the failures the lecture names */
  add('p17m3',[{cap:"The 3-2-1 rule tested against the failures the lecture names: eleven nines of durability survive a dead disk or AZ, but not a deleted bucket or ransomware holding your keys. Only a copy in a separate account and Region that the attacker cannot reach survives all three, and only a tested restore proves it works.",
    svg:svg(560,238,(()=>{
      let s=text(280,12,'the 3-2-1 backup rule',{bold:true,color:CY,size:11});
      s+=box(15,24,140,48,'copy 1: production\nS3, account A',{stroke:CY,size:10})+box(210,24,140,48,'copy 2: AWS Backup\nvault, account A',{stroke:AM,size:10})+box(405,24,140,48,'copy 3: off-site\nother account + Region',{stroke:LM,size:10});
      s+=arrow(155,48,208,48,'plan')+arrow(350,48,403,48,'copy');
      const rows=[['disk or AZ failure',[1,1,1]],['wrong bucket deleted',[0,1,1]],['ransomware with account-A keys',[0,0,1]]];
      rows.forEach(([t,ok],r)=>{ const y=94+r*44; if(r) s+=line(20,y-12,540,y-12,{stroke:DIM,sw:0.6,dash:true});
        s+=text(280,y,'threat: '+t,{size:10,color:DIM});
        ok.forEach((v,j)=>{ s+=text(85+j*195,y+18,v?'✓ survives':'✗ lost',{size:11,bold:true,color:v?LM:MG}); }); });
      s+=text(280,228,'and test a restore every quarter',{size:10,color:AM});
      return s; })(),'Three backup copies and which failures each one survives')}]);

  /* M4 — peering is not transitive; a Transit Gateway is a hub */
  add('p17m4',[{cap:"VPC peering is not transitive: with A–B and B–C peered, A still has no route to C unless you add an A–C peering of its own. A Transit Gateway is the hub-and-spoke router instead: every VPC and VPN attaches once, and traffic between any two spokes goes through the hub.",
    svg:svg(560,215,(()=>{
      let s=panel(10,8,260,198,'VPC PEERING',CY)+panel(290,8,260,198,'TRANSIT GATEWAY',AM);
      s+=line(65,76,128,118,{stroke:LM,sw:2})+line(152,118,215,76,{stroke:LM,sw:2})+line(100,61,180,61,{stroke:MG,dash:true,sw:1.6});
      s+=box(30,46,70,30,'VPC A',{size:11})+box(180,46,70,30,'VPC C',{size:11})+box(105,118,70,30,'VPC B',{size:11});
      s+=text(140,52,'✗ no route',{size:9,color:MG})+text(84,106,'peered',{size:9,color:LM,anchor:'end'})+text(196,106,'peered',{size:9,color:LM,anchor:'start'});
      s+=text(140,172,'A–B and B–C ≠ A–C',{size:11,color:MG,bold:true})+text(140,190,'peering is not transitive',{size:10,color:DIM});
      s+=line(378,72,400,92,{stroke:LM,sw:2})+line(482,72,460,92,{stroke:LM,sw:2})+line(378,140,400,132,{stroke:LM,sw:2})+line(482,140,460,132,{stroke:LM,sw:2});
      s+=box(395,92,70,40,'Transit\nGateway',{stroke:AM,bold:true,size:11});
      [[350,58,'VPC A'],[510,58,'VPC B'],[350,154,'VPC C'],[510,154,'your VPN']].forEach(([x,y,t])=>{ s+=box(x-35,y-14,70,28,t,{size:11,stroke:t==='your VPN'?CY:'currentColor'}); });
      s+=text(430,192,'A ↔ C through the hub ✓',{size:10,color:LM,bold:true});
      return s; })(),'Non-transitive VPC peering compared with a Transit Gateway hub')}]);

  /* M5 — the authorization checks before any cloud security test */
  add('p17m5',[{cap:"The checks that come before any cloud security test, in order: written scope naming the account IDs (without it the test is unauthorized access under the CFAA), then the provider's always-prohibited list, then the activities that need AWS's Simulated Events form two weeks ahead. Only assessments of listed services inside your scope proceed without prior approval, and the safe place to practice is a deliberately vulnerable lab or your own account.",
    svg:svg(560,270,(()=>{
      const Q=[['own account, or written scope\nnaming the account IDs?','no','stop: access without\nauthorization is a crime',MG],
               ['DoS or flooding, DNS zone\nwalking, bucket takeover?','yes','prohibited, even on\nyour own resources',MG],
               ['C2, red team, phishing or\nmalware simulation?','yes','Simulated Events form\n≥ 2 weeks in advance',AM],
               ['service on the listed set?\nEC2, RDS, Lambda …','yes','assess it: no prior\napproval needed',LM]];
      let s=''; Q.forEach(([q,ans,out,c],i)=>{ const y=10+i*60; s+=box(20,y,250,40,q,{size:10,stroke:i===0?CY:'currentColor'})+arrow(270,y+20,313,y+20,ans,{color:c})+box(315,y,230,40,out,{size:10,stroke:c,color:i===3?LM:'currentColor'});
        if(i<3){ s+=arrow(145,y+40,145,y+58,'')+text(153,y+50,i===0?'yes':'no',{size:10,color:i===0?LM:DIM,anchor:'start'}); } });
      s+=text(145,244,'not listed: check the current policy',{size:9,color:DIM});
      s+=text(280,262,'practice: CloudGoat, flAWS, your own account',{size:9,color:CY});
      return s; })(),'Decision path of authorization checks before testing a cloud account')}]);

  /* M6 — the life of an SQS message */
  add('p17m6',[{cap:"The life of an SQS message: a receive hides it from other consumers for the visibility timeout (30 seconds by default), and the worker deletes it when the job succeeds. If the timeout expires first the message becomes visible and is processed again, which is why the timeout must exceed the job length and why a message that keeps failing moves to a dead-letter queue.",
    svg:svg(560,238,(()=>{
      let s=box(15,10,135,30,'producer: send',{size:10})+arrow(82,40,82,84,'')+text(92,62,'at-least-once delivery',{size:9,color:DIM,anchor:'start'});
      s+=box(15,86,135,56,'visible in queue\nretained 4–14 days',{stroke:CY,size:10});
      s+=box(210,80,150,68,'in flight: hidden for\nthe visibility timeout\n(30 s default)',{stroke:AM,size:10});
      s+=box(425,14,120,44,'deleted by\nthe worker',{stroke:LM,size:10})+box(425,172,120,44,'dead-letter queue\nfor inspection',{stroke:MG,size:10});
      s+=arrow(150,100,208,100,'receive')+arrow(210,128,152,128,'',{stroke:AM})+text(181,160,'timeout ends:',{size:9,color:AM})+text(181,173,'visible again',{size:9,color:AM});
      s+=arrow(360,92,423,46,'delete',{color:LM});
      s+=arrow(360,136,423,186,'',{stroke:MG})+text(330,178,'fails repeatedly',{size:9,color:MG});
      s+=text(280,230,'timeout must exceed the job length',{size:10,color:AM,bold:true});
      return s; })(),'State diagram of an SQS message with visibility timeout, delete and dead-letter queue')}]);

  /* M7 — infrastructure as code is idempotent because of the state file */
  add('p17m7',[{cap:"Infrastructure as code is idempotent because Terraform plans against its state file: the first run finds a VPC that is declared but not yet managed, creates it and records it in the state. The second run with the same code finds nothing to change, so running it twice still leaves exactly one VPC.",
    svg:svg(560,225,(()=>{
      let s=box(15,14,120,40,'main.tf\ndesired: 1 VPC',{stroke:CY,size:10})+box(15,64,120,40,'state file\nmanages: nothing',{stroke:AM,size:10});
      s+=arrow(135,34,173,52,'')+arrow(135,84,173,66,'');
      s+=box(175,36,110,44,'plan\n+ create 1 VPC',{stroke:AM,size:10})+arrow(285,58,318,58,'')+box(320,36,100,44,'apply\nVPC created',{stroke:LM,size:10})+arrow(420,58,453,58,'')+box(455,36,95,44,'state file\nlists the VPC',{stroke:AM,size:10});
      s+=elbow('M502 80 L502 126 L75 126 L75 146',{stroke:DIM,dash:true})+text(290,118,'second run reads the updated state',{size:9,color:DIM});
      s+=box(15,148,120,44,'same main.tf\n+ updated state',{stroke:CY,size:10})+arrow(135,170,173,170,'')+box(175,148,110,44,'plan\nno changes',{stroke:LM,size:10})+arrow(285,170,318,170,'')+box(320,148,100,44,'apply\nnothing to do',{stroke:DIM,size:10})+arrow(420,170,453,170,'')+box(455,148,95,44,'still\none VPC',{stroke:LM,size:11,bold:true});
      s+=text(280,214,'idempotent: run twice, get one VPC',{size:11,color:LM,bold:true});
      return s; })(),'Two Terraform runs against a state file, the second planning no changes')}]);
})();
