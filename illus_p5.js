/* Illustrations — Domain 5: Web Development. Adds figures to the originals in illus_core.js (concatenated, never replaced). */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const E=window.ILLUS||{}; const I={};
  const dot=(x,y,c)=>'<circle cx="'+x+'" cy="'+y+'" r="4.5" fill="'+c+'" stroke="'+c+'"/>';
  const vline=(x,y1,y2,c)=>line(x,y1,x,y2,{stroke:c,dash:true});

  /* ---------- Module 1: URL to pixels ---------- */
  const seg=(x,y,ms,label,c,o={})=>box(x,y,ms*1.2,30,label,{stroke:c,size:o.size||11,color:o.color});
  I.p5m1=(E.p5m1||[]).concat([
   {cap:"Where the first 320 ms go. At a 50 ms round-trip time each setup step costs one RTT: DNS, the TCP handshake and the TLS 1.3 handshake, then the request itself plus 120 ms of server work. HTTP/3 (QUIC) merges the transport and TLS handshakes and saves one RTT; a warm revisit with cached DNS and a reused connection pays only the request.",
    svg:svg(560,192,text(280,12,'TTFB: RTT 50 ms, server 120 ms',{size:12,bold:true,color:CY})+
      text(10,51,'HTTP/2 cold',{anchor:'start',size:11})+seg(120,36,50,'DNS',AM)+seg(180,36,50,'TCP',CY)+seg(240,36,50,'TLS 1.3',MG)+seg(300,36,50,'req',DIM)+seg(360,36,120,'server 120',LM)+text(510,51,'320 ms',{anchor:'start',size:11,bold:true})+
      text(10,101,'HTTP/3 cold',{anchor:'start',size:11})+seg(120,86,50,'DNS',AM)+seg(180,86,50,'QUIC\n+TLS',MG,{size:10})+seg(240,86,50,'req',DIM)+seg(300,86,120,'server 120',LM)+text(450,101,'270 ms',{anchor:'start',size:11,bold:true})+
      text(10,151,'warm revisit',{anchor:'start',size:11})+seg(120,136,50,'req',DIM)+seg(180,136,120,'server 120',LM)+text(330,151,'170 ms',{anchor:'start',size:11,bold:true})+
      line(120,174,480,174,{stroke:DIM})+[0,100,200,300].map(v=>line(120+v*1.2,170,120+v*1.2,178,{stroke:DIM})+text(120+v*1.2,186,v+' ms',{size:9,color:DIM})).join(''),
      'Timeline of DNS, TCP, TLS and request round trips for three loads')},
   {cap:"What a change costs. Changing geometry (width, top, adding a node) forces layout, paint and composite. Changing only appearance (color, shadow) skips layout. Changing transform or opacity skips layout and paint and is composited on the GPU — which is why smooth animations use them. Everything must fit in about 16.7 ms per frame at 60 Hz.",
    svg:svg(560,172,['JS','Style','Layout','Paint','Composite'].map((s,i)=>text(176+i*82,14,s,{size:10,color:DIM})).join('')+
      [[0,'geometry:\nwidth, top',[1,1,1,1,1]],[1,'appearance:\ncolor, shadow',[1,1,0,1,1]],[2,'transform,\nopacity',[1,1,0,0,1]]].map(([r,lab,on])=>{ const y=26+r*44;
        return text(10,y+11,lab,{anchor:'start',size:11})+on.map((v,i)=>box(140+i*82,y,72,32,v?'runs':'skipped',{size:10,stroke:v?(r===0?MG:r===1?AM:LM):DIM,dash:!v,color:v?'currentColor':DIM})).join(''); }).join('')+
      text(280,164,'Frame budget 16.7 ms at 60 Hz',{size:11,color:AM}),'Which rendering stages run for geometry, appearance and transform changes')}
  ]);

  /* ---------- Module 2: semantics and accessibility ---------- */
  const rx=r=>40+(r-1)*480/7;
  I.p5m2=(E.p5m2||[]).concat([
   {cap:"The browser turns the DOM into an accessibility tree of roles, names and states, and that tree is what a screen reader announces. A labelled nav becomes a named landmark, an icon button gets its name from aria-label, a decorative image with empty alt disappears, and a labelled required input is read as 'Email, edit text, required'.",
    svg:compare({t:'DOM (WHAT YOU WROTE)',draw:o=>['<nav aria-label="Main">','<button aria-label="Menu">','<img src="logo.png" alt="">','<label for=e> + <input id=e>'].map((t,i)=>box(o+12,42+i*32,236,24,t,{mono:true,size:10,stroke:DIM})).join('')},
      {t:'ACCESSIBILITY TREE',draw:o=>[['navigation "Main"',LM],['button "Menu", collapsed',LM],['(decorative: not exposed)',DIM],['textbox "Email", required',LM]].map(([t,c],i)=>box(o+12,42+i*32,236,24,t,{size:11,stroke:c,color:c===DIM?DIM:'currentColor'})).join('')},{h:180,label:'DOM nodes and the accessibility tree they produce'})},
   {cap:"Contrast is arithmetic: (L of lighter + 0.05) ÷ (L of darker + 0.05), using each color's relative luminance. On white, #767676 scores 4.54:1 and passes AA for body text; #777777 scores 4.48:1 and fails by a hair; #999999 at 2.85:1 fails even the 3:1 large-text bar; #595959 reaches 7.0:1.",
    svg:svg(560,172,text(280,12,'ratio = (L1+0.05) ÷ (L2+0.05)',{size:12,bold:true,color:CY})+
      vline(rx(3),40,110,AM)+text(rx(3),34,'3:1 large text',{size:10,color:AM})+vline(rx(4.5),40,110,LM)+text(rx(4.5)+18,48,'4.5:1 body text',{size:10,color:LM,anchor:'start'})+
      line(40,110,520,110)+[1,2,3,4,5,6,7,8].map(r=>line(rx(r),106,rx(r),114)+text(rx(r),124,r+':1',{size:9,color:DIM})).join('')+
      dot(rx(2.85),110,MG)+dot(rx(4.48),110,MG)+dot(rx(4.54),110,LM)+dot(rx(7.0),110,LM)+
      text(rx(2.85),158,'#999999 2.85 fail',{size:10,color:MG})+text(rx(4.48)-6,142,'#777777 4.48 fail',{size:10,color:MG,anchor:'end'})+
      text(rx(4.54)+6,158,'#767676 4.54 pass',{size:10,color:LM,anchor:'start'})+text(rx(7.0),142,'#595959 7.0 pass',{size:10,color:LM}),'Contrast ratios of four greys on white against the AA thresholds')}
  ]);

  /* ---------- Module 3: cascade, specificity, box sizing ---------- */
  const trip=(y,sel,v,rank,c)=>box(10,y,250,28,sel,{mono:true,size:10,stroke:c})+v.map((n,i)=>box(275+i*62,y,52,28,String(n),{size:12,bold:true,stroke:c,color:c})).join('')+text(470,y+14,rank,{anchor:'start',size:11,color:c});
  I.p5m3=(E.p5m3||[]).concat([
   {cap:"The cascade checks these in order and stops at the first difference: origin and importance (browser, user, author; !important reverses the order), inline style attributes, cascade layers, specificity, and finally order of appearance. Most 'my style won't apply' bugs are decided at step 4.",
    svg:stack([{t:'1  Origin and importance',stroke:CY,side:'important flips order'},{t:'2  Inline style attribute',side:'style="…"'},{t:'3  Cascade layers',side:'later @layer wins'},{t:'4  Specificity (a, b, c)',stroke:AM,side:'ids › classes › types'},{t:'5  Order of appearance',side:'last rule wins'}],{w:300,h:34,side:true,label:'The five steps of the CSS cascade'})},
   {cap:"Specificity is a triple (ids, classes/attributes/pseudo-classes, types/pseudo-elements) compared left to right, never added up as one number. One id outranks any number of classes, and :where() contributes nothing, which makes it ideal for easily overridden resets.",
    svg:svg(560,186,text(280,12,'Specificity is compared column by column',{size:12,bold:true,color:CY})+
      ['ids','classes','types'].map((h,i)=>text(301+i*62,32,h,{size:10,color:DIM})).join('')+
      trip(44,'#main .card p',[1,1,1],'1st',LM)+trip(79,'.card.active p:first-child',[0,3,1],'2nd',CY)+trip(114,'nav ul li a',[0,0,4],'3rd',AM)+trip(149,':where(#main) p',[0,0,1],'4th',DIM),
      'Four selectors ranked by their specificity triples')},
   {cap:"The same declaration — width: 300px; padding: 20px; border: 2px — under both sizing models. content-box adds padding and border outside the width (344 px rendered); border-box keeps the box at 300 px and shrinks the content to 256 px, which is why every modern stylesheet starts with a border-box reset.",
    svg:compare({t:'CONTENT-BOX',draw:o=>box(o+20,42,220,84,'',{stroke:MG,sw:2.5})+box(o+34,54,192,60,'',{stroke:AM,dash:true})+box(o+50,66,160,36,'content 300',{stroke:CY,color:CY})+
        text(o+130,144,'300 + 2×20 + 2×2 = 344 px',{size:11,color:AM})+text(o+130,162,'width sets content only',{size:10,color:DIM})},
      {t:'BORDER-BOX',draw:o=>box(o+20,42,220,84,'',{stroke:MG,sw:2.5})+box(o+34,54,192,60,'',{stroke:AM,dash:true})+box(o+50,66,160,36,'content 256',{stroke:CY,color:CY})+
        text(o+130,144,'300 − 40 − 4 = 256 content',{size:11,color:LM})+text(o+130,162,'width sets the whole box',{size:10,color:DIM})},{h:178,label:'content-box versus border-box arithmetic'})}
  ]);

  /* ---------- Module 4: layout arithmetic ---------- */
  I.p5m4=(E.p5m4||[]).concat([
   {cap:"The flexbox sizing algorithm on paper: a 600 px row with 20 px gaps holds items whose bases are 100, 200 and 100 px. The 160 px left over is shared in proportion to flex-grow 1 : 2 : 1, so the items finish at 140, 280 and 140 px (drawn at 0.8 scale).",
    svg:svg(560,200,text(280,12,'flex-grow 1:2:1, 600 px, gap 20',{size:12,bold:true,color:CY})+
      text(40,38,'1. bases and gaps',{anchor:'start',size:11,color:DIM})+box(40,50,480,40,'',{stroke:DIM,dash:true})+
      box(40,54,80,32,'100',{stroke:CY})+box(136,54,160,32,'200',{stroke:AM})+box(312,54,80,32,'100',{stroke:CY})+box(396,54,120,32,'free 160',{stroke:MG,dash:true,color:MG})+
      text(40,110,'2. share 160 as 40 / 80 / 40',{anchor:'start',size:11,color:DIM})+box(40,122,480,40,'',{stroke:DIM,dash:true})+
      box(40,126,112,32,'grow 1 → 140',{stroke:LM})+box(168,126,224,32,'grow 2 → 280',{stroke:LM})+box(408,126,112,32,'grow 1 → 140',{stroke:LM})+
      text(280,184,'600−40−400 = 160 px free',{size:11,color:AM}),'Flex-grow arithmetic for three items')},
   {cap:"One stylesheet, two layouts. Mobile-first, the named grid areas stack in one column; at 48em and wider the same areas are rearranged into a header, a sidebar beside the main content, and a footer — without touching the HTML.",
    svg:compare({t:'PHONE: ONE COLUMN',draw:o=>box(o+60,42,140,22,'header',{size:11,stroke:CY})+box(o+60,68,140,44,'main',{size:12,stroke:LM})+box(o+60,116,140,22,'aside',{size:11,stroke:AM})+box(o+60,142,140,22,'footer',{size:11,stroke:DIM})},
      {t:'48em AND WIDER',draw:o=>box(o+20,42,220,22,'header',{size:11,stroke:CY})+box(o+20,68,62,70,'aside',{size:11,stroke:AM})+box(o+88,68,152,70,'main',{size:12,stroke:LM})+box(o+20,142,220,22,'footer',{size:11,stroke:DIM})},{h:178,label:'Grid template areas on a phone and on a wide screen'})},
   {cap:"How many columns does repeat(auto-fill, minmax(220px, 1fr)) make? With a 16 px gap the count is ⌊(W + 16) ÷ 236⌋: one 358 px column on a phone, three 229 px columns at 720 px, five 227 px columns at 1,200 px — no media query needed (drawn to scale).",
    svg:svg(560,200,text(280,12,'cols = ⌊(W+16) ÷ 236⌋',{size:12,bold:true,color:CY})+
      text(10,52,'358 px: 1 col',{anchor:'start',size:11})+box(112,36,131,32,'358',{stroke:LM})+
      text(10,107,'720 px: 3 cols',{anchor:'start',size:11})+[0,1,2].map(i=>box(112+i*90,91,84,32,'229',{stroke:AM})).join('')+
      text(10,162,'1,200 px: 5 cols',{anchor:'start',size:11})+[0,1,2,3,4].map(i=>box(112+i*89.2,146,83.3,32,'227',{stroke:CY})).join(''),'Column counts of an auto-fill grid at three widths')}
  ]);

  /* ---------- Module 5: closures and scope ---------- */
  I.p5m5=(E.p5m5||[]).concat([
   {cap:"A closure in memory. Each call to makeCounter() creates a fresh environment holding its own n; the arrow function it returns keeps a reference to that environment, so n survives after makeCounter() has returned and each counter counts independently.",
    svg:svg(560,190,text(280,12,'A closure keeps its environment alive',{size:12,bold:true,color:CY})+
      box(10,62,150,52,'makeCounter()\ncalled twice',{size:11,stroke:CY})+arrow(160,78,198,55,'')+arrow(160,98,198,130,'')+
      box(200,30,150,46,'environment 1\nn: 0 → 1 → 2',{size:11,stroke:AM})+box(200,108,150,46,'environment 2\nn: 0 → 1',{size:11,stroke:AM})+
      box(400,30,150,46,'next()\nreturns 1, then 2',{size:11,stroke:LM})+box(400,108,150,46,'other()\nreturns 1',{size:11,stroke:LM})+
      arrow(398,53,352,53,'')+arrow(398,131,352,131,'')+text(280,176,'each call: a new environment',{size:11,color:DIM}),'Two closures each holding their own environment')},
   {cap:"The var-versus-let loop bug. With var there is one function-scoped i, and all three timer callbacks read it after the loop has finished, so they print 3 3 3. With let each iteration gets a fresh binding, and each callback closes over its own: 0 1 2.",
    svg:compare({t:'VAR: ONE SHARED i',draw:o=>box(o+90,46,80,30,'i = 3',{stroke:MG,bold:true,color:MG})+[0,1,2].map(k=>box(o+12+k*85,112,70,30,'callback',{size:11,stroke:DIM})+arrow(o+47+k*85,110,o+130,79,'')).join('')+text(o+130,160,'prints 3 3 3',{size:12,bold:true,color:MG})},
      {t:'LET: A NEW i EACH PASS',draw:o=>[0,1,2].map(k=>box(o+12+k*85,46,70,30,'i = '+k,{stroke:LM,bold:true,color:LM})+box(o+12+k*85,112,70,30,'callback',{size:11,stroke:DIM})+arrow(o+47+k*85,110,o+47+k*85,79,'')).join('')+text(o+130,160,'prints 0 1 2',{size:12,bold:true,color:LM})},{h:176,label:'One shared var binding versus per-iteration let bindings'})}
  ]);

  /* ---------- Module 6: the event loop ---------- */
  const L=(x,y,ch,c)=>box(x,y,46,40,ch,{size:16,bold:true,stroke:c,color:c,mono:true});
  I.p5m6=(E.p5m6||[]).concat([
   {cap:"The event loop: take one task (a script, a click, a timer) and run it until the call stack is empty; then drain every microtask (promise reactions, await continuations), including ones added meanwhile; then, if a frame is due, run requestAnimationFrame callbacks, style, layout and paint; then take the next task.",
    svg:cycle(['take one\ntask','run until\nstack empty','drain all\nmicrotasks','render if\nframe due'],{label:'The browser event loop'})},
   {cap:"The trace from the lecture. The script is task 1 and prints A, E (the async function runs synchronously up to its first await) and G. The emptied stack lets the microtasks run in queue order — C (.then), D (queueMicrotask), F (the code after await). Only then does the timer's task print B.",
    svg:svg(560,172,box(10,26,230,112,'',{dash:true,stroke:DIM})+box(256,26,170,112,'',{dash:true,stroke:DIM})+box(442,26,110,112,'',{dash:true,stroke:DIM})+
      text(125,40,'TASK 1: THE SCRIPT',{size:11,bold:true,color:CY})+text(341,40,'MICROTASKS',{size:11,bold:true,color:AM})+text(497,40,'TASK 2',{size:11,bold:true,color:MG})+
      L(28,62,'A',CY)+L(102,62,'E',CY)+L(176,62,'G',CY)+L(266,62,'C',AM)+L(318,62,'D',AM)+L(370,62,'F',AM)+L(474,62,'B',MG)+
      text(51,122,'sync',{size:9,color:DIM})+text(125,122,'sync to await',{size:9,color:DIM})+text(199,122,'sync',{size:9,color:DIM})+text(341,122,'in queue order',{size:9,color:DIM})+text(497,122,'timer',{size:9,color:DIM})+
      arrow(241,82,254,82,'')+arrow(427,82,440,82,'')+text(280,158,'output → A E G C D F B',{size:12,bold:true,color:LM,mono:true}),'Execution order of tasks and microtasks in the example')},
   {cap:"An event's journey. A click on a button travels down from window to the target (capture), then back up through every ancestor (bubble). Event delegation puts one listener on the list: it sees clicks from every current and future item, and e.target.closest('[data-id]') finds which one.",
    svg:svg(560,200,['window','document','<ul id="list">','<li data-id="7">','<button> target'].map((t,i)=>box(200,14+i*36,160,26,t,{mono:true,size:11,stroke:i===2?AM:i===4?CY:DIM})).join('')+
      arrow(182,20,182,172,'',{stroke:CY})+text(172,96,'capture',{anchor:'end',size:11,color:CY})+
      arrow(378,172,378,20,'',{stroke:MG})+text(390,40,'bubble',{anchor:'start',size:11,color:MG})+text(390,99,'one delegated listener',{anchor:'start',size:10,color:AM}),
      'Capture and bubble phases through the DOM ancestors')}
  ]);

  /* ---------- Module 7: deploy, measure, renew ---------- */
  const cwv=(y,lab,parts)=>{ let x=110; return text(10,y+16,lab,{anchor:'start',size:11})+parts.map(([w,t,c])=>{ const b=box(x,y,w,32,t,{size:10,stroke:c,color:c}); x+=w; return b; }).join(''); };
  I.p5m7=(E.p5m7||[]).concat([
   {cap:"The production path of a request: the browser asks DNS where the site lives (A/ALIAS at the apex, CNAME for www), connects over HTTPS to the nearest CDN edge, which holds the TLS certificate and a cache, and only on a cache miss goes back to the origin — a static host or your application server.",
    svg:flow([{t:'visitor\nbrowser',stroke:CY},{t:'DNS\nA + CNAME',edge:'?'},{t:'CDN edge\nTLS + cache',stroke:LM,edge:'TLS'},{t:'origin\nhost or app',stroke:AM,edge:'miss'}],{perRow:4,bw:108,bh:56,gap:34,label:'Browser to DNS to CDN edge to origin'})},
   {cap:"The Core Web Vitals and Google's thresholds. LCP measures loading, INP responsiveness (it replaced First Input Delay in March 2024) and CLS visual stability. A page passes when the 75th percentile of real visits is in the good band for all three.",
    svg:svg(560,172,text(280,12,'Core Web Vitals thresholds',{size:12,bold:true,color:CY})+
      cwv(26,'LCP loading',[[175,'good ≤ 2.5 s',LM],[105,'needs work',AM],[140,'poor > 4 s',MG]])+
      cwv(70,'INP response',[[120,'good ≤ 200 ms',LM],[180,'needs work',AM],[120,'poor > 500 ms',MG]])+
      cwv(114,'CLS stability',[[105,'good ≤ 0.1',LM],[158,'needs work',AM],[157,'poor > 0.25',MG]])+
      text(280,162,'75th percentile of real visits',{size:10,color:DIM}),'Good, needs-improvement and poor bands for LCP, INP and CLS')},
   {cap:"Why certificate renewal must be automated. CA/Browser Forum ballot SC-081 cut the maximum lifetime of publicly trusted TLS certificates from 398 days to 200 days for certificates issued from 15 March 2026, then 100 days from 15 March 2027 and 47 days from 15 March 2029 (drawn to scale).",
    svg:svg(560,172,text(280,12,'Maximum public TLS certificate lifetime (SC-081)',{size:12,bold:true,color:CY})+
      [['before Mar 2026',398,DIM],['from 15 Mar 2026',200,AM],['from 15 Mar 2027',100,MG],['from 15 Mar 2029',47,MG]].map(([l,d,c],i)=>{ const y=26+i*34, w=d*0.9045;
        return text(10,y+13,l,{anchor:'start',size:11})+box(180,y,w,26,d>=100?d+' days':'',{size:11,stroke:c})+(d<100?text(180+w+8,y+13,d+' days',{anchor:'start',size:11,bold:true,color:c}):''); }).join('')+
      text(280,164,'automate: ACME, renew at ⅔ life',{size:10,color:AM}),'Shrinking maximum TLS certificate lifetimes')}
  ]);

  /* ---------- Module 8: HTTP and the back end ---------- */
  const msg=(lines,x)=>lines.map(([t,c],i)=>text(x,46+i*19,t,{anchor:'start',mono:true,size:10,color:c||'currentColor'})).join('');
  I.p5m8=(E.p5m8||[]).concat([
   {cap:"Anatomy of one exchange, as curl -i prints it. The request has a start line (method, path, version), headers, a blank line and a body; the response has a status line, headers, a blank line and a body. Content-Type tells the receiver how to parse the body; Location points at the newly created resource.",
    svg:svg(560,186,box(10,24,266,136,'',{dash:true,stroke:DIM})+box(284,24,266,136,'',{dash:true,stroke:DIM})+text(143,14,'REQUEST',{size:11,bold:true,color:CY})+text(417,14,'RESPONSE',{size:11,bold:true,color:LM})+
      msg([['POST /api/quotes HTTP/1.1',CY],['Host: shop.example.com'],['Content-Type: application/json'],['Cookie: sid=Vh3k…'],['',DIM],['{"name":"Ana", …}',AM]],20)+
      msg([['HTTP/1.1 201 Created',LM],['Location: /api/quotes/1'],['Content-Type: application/json'],['Cache-Control: no-store'],['',DIM],['{"id":1}',AM]],294)+
      text(280,176,'start line, headers, blank, body',{size:10,color:DIM}),'An HTTP request and response side by side')},
   {cap:"A CORS preflight. A page on www.example.com sends JSON to api.example.com, a different origin, so the browser first sends an OPTIONS request with the Origin and the method it wants. Only if the server approves with matching Allow headers does the browser send the real POST, and it lets the page read the reply only if that reply allows the origin too.",
    svg:svg(560,232,box(40,10,140,36,'browser\nwww.example.com',{size:11,stroke:CY})+box(380,10,140,36,'server\napi.example.com',{size:11,stroke:AM})+
      vline(110,46,206,DIM)+vline(450,46,206,DIM)+
      arrow(112,78,448,78,'OPTIONS preflight + Origin',{color:CY})+arrow(448,116,112,116,'204 Allow-Origin, -Methods',{color:AM})+
      arrow(112,154,448,154,'POST /api/quotes (JSON)',{color:CY})+arrow(448,192,112,192,'201 Created + Allow-Origin',{color:LM})+
      text(280,222,'browser enforces; curl ignores CORS',{size:10,color:MG}),'Sequence of a CORS preflight and the real request')},
   {cap:"Caching done right. On the first visit the HTML arrives with an ETag and no-cache, and the hashed script with a one-year immutable lifetime. The next day the browser revalidates only the HTML (If-None-Match → 304, no body) and takes the script straight from its cache without any request.",
    svg:compare({t:'FIRST VISIT',draw:o=>box(o+12,42,236,26,'GET /  →  200 + ETag "a1"',{mono:true,size:10,stroke:CY})+box(o+12,76,236,26,'GET app.3f9a.js  →  200',{mono:true,size:10,stroke:CY})+box(o+12,110,236,26,'max-age=1 year, immutable',{mono:true,size:10,stroke:DIM})+text(o+130,156,'1.9 MB, 46 requests',{size:11,color:AM})},
      {t:'NEXT DAY',draw:o=>box(o+12,42,236,26,'If-None-Match "a1"  →  304',{mono:true,size:10,stroke:LM})+box(o+12,76,236,26,'app.3f9a.js: from cache',{mono:true,size:10,stroke:LM})+box(o+12,110,236,26,'no request at all',{size:11,stroke:DIM})+text(o+130,156,'~300 bytes, 1 request',{size:11,color:LM})},{h:172,label:'First visit versus a revalidated revisit'})},
   {cap:"The path of a POST through the lecture's Express 5 API: the JSON parser enforces a 10 KB limit (413 if larger, 400 if malformed), the route runs validation (422 with field errors), the INSERT binds values to ? placeholders, and success returns 201 with a Location header. Any thrown error lands in the single error handler, which returns a generic 500.",
    svg:flow([{t:'POST\n/api/quotes',stroke:CY},{t:'express.json\nlimit 10kb'},{t:'route\nhandler'},{t:'validate\nelse 422',stroke:AM},{t:'INSERT … ?\nparameterized',stroke:LM},{t:'201 Created\n+ Location',stroke:LM}],{perRow:3,bw:140,bh:52,gap:40,label:'Request pipeline through the Express API'})}
  ]);

  /* ---------- Module 9: security ---------- */
  I.p5m9=(E.p5m9||[]).concat([
   {cap:"Why parameterized queries stop SQL injection. String building pastes input into the SQL text, so the parser sees one mixed string and data can change the query's structure. With a placeholder the statement is compiled first and the value is bound afterwards as pure data, so a quote in the input is just a character.",
    svg:compare({t:'STRING BUILDING',draw:o=>box(o+12,46,128,30,"…email = '",{mono:true,size:11,stroke:DIM})+box(o+140,46,108,30,'+ user input',{size:11,stroke:MG,color:MG})+arrow(o+130,78,o+130,104,'')+box(o+30,106,200,30,'parser: one mixed string',{size:11,stroke:MG})+text(o+130,158,'data can change structure',{size:11,color:MG})},
      {t:'PLACEHOLDER',draw:o=>box(o+12,46,150,30,'…email = ?',{mono:true,size:11,stroke:CY})+box(o+172,46,76,30,'value',{size:11,stroke:LM})+arrow(o+87,78,o+87,104,'')+arrow(o+210,78,o+210,104,'')+box(o+12,106,150,30,'compiled first',{size:11,stroke:CY})+box(o+172,106,76,30,'bound\nas data',{size:10,stroke:LM})+text(o+130,158,'structure fixed before data',{size:11,color:LM})},{h:174,label:'String-built SQL versus a parameterized query'})},
   {cap:"Storing a password: combine it with a unique random salt and run a slow, memory-hard function (Argon2id at 19 MiB and 2 iterations, or scrypt N = 2^17), storing the algorithm, parameters, salt and hash together. The bars show why on a log scale: every 8-character lowercase-and-digit password falls in about 141 seconds to a GPU running fast SHA-256, but takes about 64 years at a thousand slow hashes per second.",
    svg:svg(560,192,box(10,24,100,40,'password',{stroke:CY})+text(124,44,'+',{size:16,bold:true})+box(138,24,110,40,'random salt\n16 bytes',{size:11})+arrow(250,44,284,44,'')+
      box(286,24,130,40,'Argon2id\n19 MiB · t=2',{size:11,stroke:AM})+arrow(418,44,446,44,'')+box(448,24,102,40,'stored\n$argon2id$…',{size:10,stroke:LM,mono:true})+
      text(280,92,'search space 36^8 ≈ 2.8e12',{size:11,bold:true})+
      text(10,122,'SHA-256 (fast)',{anchor:'start',size:11})+box(200,110,64,24,'',{stroke:MG})+text(272,122,'141 s',{anchor:'start',size:11,bold:true,color:MG})+
      text(10,156,'Argon2id-class (slow)',{anchor:'start',size:11})+box(200,144,279,24,'',{stroke:LM})+text(486,156,'≈ 64 years',{anchor:'start',size:11,bold:true,color:LM})+
      text(340,182,'log scale',{size:9,color:DIM}),'Password hashing pipeline and fast versus slow hash cracking time')},
   {cap:"'Sign in with Google' done right: the OpenID Connect authorization code flow with PKCE. The app sends a hash of a secret verifier; the user authenticates at the provider; the code comes back to the exact registered redirect URI; the server exchanges code plus verifier for tokens, validates the ID token, and starts its own session.",
    svg:flow([{t:'1 app: verifier,\nchallenge, state',stroke:CY},{t:'2 provider:\nuser signs in',stroke:MG},{t:'3 redirect back:\ncode + state',stroke:AM},{t:'4 server: code +\nverifier → tokens',stroke:AM},{t:'5 verify ID token:\niss aud exp nonce',stroke:LM},{t:'6 create your\nown session',stroke:LM}],{perRow:3,bw:150,bh:56,gap:34,label:'OpenID Connect authorization code flow with PKCE'})},
   {cap:"Defense in depth against XSS. Validation narrows what is accepted; output encoding for the right context is the core defense; sanitizing is only for genuine user HTML; a nonce-based Content Security Policy blocks script that slips through; and an HttpOnly session cookie limits what any surviving script could steal.",
    svg:stack([{t:'Validate input (type, length)',side:'narrows input'},{t:'Encode output for context',stroke:LM,side:'the core defense'},{t:'Sanitize real HTML (DOMPurify)',side:'only if HTML needed'},{t:'Content Security Policy (nonce)',stroke:CY,side:'blocks injected script'},{t:'HttpOnly session cookie',stroke:AM,side:'limits the damage'}],{w:300,h:34,side:true,label:'Layers of XSS defense'})}
  ]);

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
