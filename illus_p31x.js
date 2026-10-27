/* Third figures — Domain 31: Application Security & Web/Mobile Penetration Testing (Authorized). Adds to the figures in illus_p31.js (never replaces them). */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const add=(id,figs)=>{ window.ILLUS=window.ILLUS||{}; window.ILLUS[id]=(window.ILLUS[id]||[]).concat(figs); };

  /* m1 — STRIDE threat model of the booking app: each threat paired with its control */
  const stride=[['S',CY,'role cookie anyone can set','→ server-side session lookup'],['T',AM,'client sends the price','→ recompute from the catalog'],['R',LM,'no record of cancellations','→ append-only audit table'],
                ['I',MG,'"no such user" error','→ one message, same timing'],['D',AM,'SMS endpoint unlimited','→ 5 per phone per hour'],['E',CY,'any user lists all bookings','→ filter by owner on server']];
  add('p31m1',[{cap:"STRIDE turns \"what can go wrong\" into a checklist you walk before code exists. On the Module 1 booking app each letter finds one threat, and each threat gets a server-side control, an owner and a test.",
    svg:svg(560,240,`${text(280,16,'STRIDE on your booking app: threat → control',{color:CY,bold:true,size:11})}
      ${stride.map((s,i)=>{ const col=i<3?0:1, row=i%3; const x=16+col*274, y=32+row*54;
        return box(x,y,36,46,s[0],{stroke:s[1],color:s[1],bold:true,size:16})+box(x+42,y,212,46,s[2]+'\n'+s[3],{stroke:s[1],size:10}); }).join('')}
      ${text(280,206,'each threat gets a control, an owner and a test',{color:LM,size:10})}
      ${text(280,226,'drawn before code exists: the cheapest security work',{color:DIM,size:10})}`,
      'STRIDE threats on a booking app, each paired with its server-side control')}]);

  /* m2 — prepared statement: code channel parsed first, value bound later */
  add('p31m2',[{cap:"Why a parameterized query cannot be injected: the SQL text with its placeholder reaches the engine first and is parsed into a plan; the value travels on a separate channel and is bound into the slot, so the quote in O'Brien can only ever be a character. Identifiers cannot be bound, so they go through an allowlist.",
    svg:svg(560,250,`${text(280,16,'Prepared statement: syntax is fixed before data arrives',{color:CY,bold:true,size:11})}
      ${text(16,36,'code channel',{anchor:'start',size:10,color:DIM})}${text(16,118,'data channel',{anchor:'start',size:10,color:DIM})}
      ${box(16,44,140,46,'1  prepare\nWHERE name = ?',{mono:true,stroke:CY,size:10})}
      ${arrow(156,67,228,67,'SQL text')}
      ${box(228,44,140,46,'parser fixes\nthe syntax',{stroke:AM,size:11})}
      ${arrow(368,67,424,67,'plan')}
      ${box(424,44,120,128,'3  execute\nplan + value\n= result rows',{stroke:LM,size:11})}
      ${box(16,126,140,46,'2  bind\n("O\'Brien",)',{mono:true,stroke:MG,size:10})}
      ${arrow(156,149,424,149,'bound as data, never parsed')}
      ${text(280,192,'the quote arrives after parsing: it is just a character',{color:AM,size:10})}
      ${box(16,208,258,32,'names, ORDER BY → allowlist map',{stroke:DIM,size:10})}
      ${box(286,208,258,32,'least-privilege DB: leak, not takeover',{stroke:DIM,size:10})}`,
      'A prepared statement parses the SQL text first, then binds the value as data')}]);

  /* m3 — session lifecycle owned by the server, cookie flags and what each blocks */
  const flags=[['Secure','sent over HTTPS only'],['HttpOnly','scripts cannot read it'],['SameSite=Lax','not sent cross-site'],['__Host- prefix','bound to exact host']];
  add('p31m3',[{cap:"A session the server owns: a fresh random ID at login, state kept server-side, the role looked up on every request, and logout that destroys the record. The cookie carrying the ID gets four flags, each closing one route to theft or forgery.",
    svg:svg(560,250,`${text(280,16,'A server-owned session in a hardened cookie',{color:CY,bold:true,size:11})}
      ${['login succeeds:\nnew 256-bit ID','server stores\nuser_id + role','each request:\nrole looked up','logout destroys\nthe server record'].map((t,i)=>box(17+i*134,30,124,46,t,{stroke:i===0?CY:'currentColor',size:10})+(i<3?arrow(141+i*134,53,151+i*134,53,''):'')).join('')}
      ${text(280,92,'ID rotated at login (kills fixation) · idle + absolute timeouts',{color:DIM,size:10})}
      ${box(16,106,528,30,'Set-Cookie: __Host-sid=…; Secure; HttpOnly; SameSite=Lax; Path=/',{mono:true,stroke:CY,size:10})}
      ${flags.map((f,i)=>line(79+i*134,136,79+i*134,156,{stroke:LM})+box(17+i*134,156,124,46,f[0]+'\n'+f[1],{stroke:LM,size:10})).join('')}
      ${text(280,226,'+ a synchronizer CSRF token on every state-changing form',{color:AM,size:10})}`,
      'Server-side session lifecycle and the cookie flags that protect the session ID')}]);

  /* m4 — the scope gate a tester runs before sending any request */
  add('p31m4',[{cap:"The proxy will send anything; authorization is your job. Before a request leaves Repeater it passes three gates: the asset is in written scope, the test type is permitted, and automated requests are allowed. Any \"no\" means the request is unauthorized access.",
    svg:svg(560,248,`${text(280,16,'The tool cannot know your scope: check before you send',{color:CY,bold:true,size:11})}
      ${box(16,46,116,52,'asset in written\nscope or program?',{stroke:CY,size:10})}${arrow(132,72,162,72,'yes')}
      ${box(162,46,116,52,'this test type\npermitted?',{stroke:CY,size:10})}${arrow(278,72,308,72,'yes')}
      ${box(308,46,116,52,'automated requests\nallowed?',{stroke:CY,size:10})}${arrow(424,72,454,72,'yes')}
      ${box(454,46,90,52,'send via\nthe proxy',{stroke:LM,color:LM,size:11})}
      ${[74,220,366].map(x=>arrow(x,98,x,146,'no',{color:MG})).join('')}
      ${box(16,148,408,38,'do not send: that is unauthorized access',{stroke:MG,color:MG,size:11})}
      ${text(280,208,'a bounty policy may ban heavy scanning; your own lab welcomes it',{color:DIM,size:10})}
      ${text(280,230,'always in bounds: your apps · Academy labs · local Juice Shop · HTB',{color:LM,size:10})}`,
      'Three authorization gates checked before any test request is sent')}]);

  /* m5 — CORS: the browser enforces who may read a cross-origin response */
  add('p31m5',[{cap:"CORS is enforced by the browser, not the server: the server answers with an Access-Control-Allow-Origin header, and the browser lets the calling page read the reply only if its origin is on that exact list. It governs reading responses, so it never replaces CSRF defences.",
    svg:svg(560,248,`${text(280,16,'CORS: the browser decides who may read a response',{color:CY,bold:true,size:11})}
      ${box(16,34,170,56,'browser running\nsite A\'s script',{stroke:AM,size:11})}
      ${box(374,34,170,56,'site B server:\nshort exact allowlist',{stroke:CY,size:11})}
      ${arrow(186,52,374,52,'request + Origin: A')}
      ${arrow(374,78,186,78,'reply + ACAO header')}
      ${arrow(101,90,101,108,'')}
      ${box(16,110,170,36,'browser compares\nACAO with A',{stroke:AM,size:10})}
      ${arrow(186,122,236,112,'')}${arrow(186,134,236,150,'')}
      ${box(236,98,308,30,'A listed exactly → script reads reply',{stroke:LM,color:LM,size:10})}
      ${box(236,136,308,30,'not listed → script gets nothing',{stroke:MG,color:MG,size:10})}
      ${box(16,182,258,32,'never reflect Origin with credentials',{stroke:DIM,dash:true,size:10})}
      ${box(286,182,258,32,'CORS is not a CSRF defence',{stroke:DIM,dash:true,size:10})}
      ${text(280,234,'ACAO = Access-Control-Allow-Origin',{color:DIM,size:10})}`,
      'CORS flow: the server lists allowed origins and the browser enforces it')}]);

  /* m6 — certificate pinning: two checks, the second stops a locally added CA */
  add('p31m6',[{cap:"Pinning adds a second check after normal TLS validation: the server's key must also match the pin shipped inside the app. A fraudulently issued or locally installed CA passes the first check and fails the second. It protects transport only, so secrets still do not belong in the binary.",
    svg:svg(560,240,`${text(280,16,'Pinning: a trusted CA is necessary, not sufficient',{color:CY,bold:true,size:11})}
      ${box(16,44,110,52,'server sends\nits certificate',{size:10})}${arrow(126,70,156,70,'')}
      ${box(156,44,124,52,'chains to a\ntrusted CA?',{stroke:CY,size:10})}${arrow(280,70,310,70,'yes')}
      ${box(310,44,124,52,'key matches the\npin in the app?',{stroke:CY,size:10})}${arrow(434,70,464,70,'yes')}
      ${box(464,44,80,52,'TLS\nproceeds',{stroke:LM,color:LM,size:11})}
      ${arrow(218,96,218,136,'no',{color:MG})}${arrow(372,96,372,136,'no',{color:MG})}
      ${box(156,138,124,40,'refuse:\nuntrusted chain',{stroke:MG,size:10})}
      ${box(310,138,124,40,'refuse: fraudulent\nor locally added CA',{stroke:MG,size:10})}
      ${text(71,150,'without a pin,\nthe first check\nis the only one',{color:DIM,size:10})}
      ${box(16,196,528,32,'pinning protects transport only: never hide secrets in the app',{stroke:AM,size:10})}`,
      'Certificate pinning adds a key check after normal certificate validation')}]);

  /* m7 — CVSS severity versus business risk: two findings on one scale */
  const X=v=>20+52*v;
  add('p31m7',[{cap:"Severity is a property of the bug; risk is severity in context. On the CVSS scale finding A (9.8) outranks B (6.5), but A sits on an internal demo with no real data while B exposes customer billing records, so for this client B is the one to fix first.",
    svg:svg(560,242,`${text(280,16,'CVSS measures severity; risk is severity in context',{color:CY,bold:true,size:11})}
      ${box(X(0.1),30,X(3.9)-X(0.1),24,'Low 0.1–3.9',{stroke:DIM,size:10,rx:3})}${box(X(4),30,X(6.9)-X(4),24,'Medium 4.0–6.9',{stroke:AM,size:10,rx:3})}
      ${box(X(7),30,X(8.9)-X(7),24,'High 7.0–8.9',{stroke:MG,size:10,rx:3})}${box(X(9),30,X(10)-X(9),24,'Critical',{stroke:MG,size:10,rx:3})}
      ${arrow(X(6.5),96,X(6.5),58,'',{stroke:AM})}${arrow(X(9.8),96,X(9.8),58,'',{stroke:MG})}
      ${box(16,96,220,46,'context: exposure, data value,\nKEV listing, EPSS',{stroke:DIM,size:10})}
      ${box(250,96,144,46,'B  6.5 Medium\nIDOR on billing records',{stroke:AM,size:10})}
      ${box(400,96,144,46,'A  9.8 Critical\ninternal demo, no data',{stroke:MG,size:10})}
      ${arrow(126,142,126,166,'')}${arrow(322,142,322,166,'')}${arrow(472,142,472,166,'')}
      ${box(16,168,528,36,'for this client B outranks A: Medium severity, High risk',{stroke:LM,color:LM,size:11})}
      ${text(280,226,'lead with CVSS for comparability; rank by the client\'s risk',{color:DIM,size:10})}`,
      'Two findings on the CVSS scale and how business context reorders them')}]);
})();
