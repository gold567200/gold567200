/* Illustrations — Domain 31: Application Security & Web/Mobile Pentesting, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  /* ================= DOMAIN 31: AppSec ================= */
  I.p31m1=[{cap:"Every part of an HTTP request was composed by someone the server cannot trust. Each attacker-controlled field maps to a class of flaw if the server believes it.",
    svg:svg(540,248,`${text(270,18,'HTTP REQUEST — every part is attacker-controlled',{color:MG,bold:true,size:11})}
      ${box(40,34,460,36,'method · path · query\nIDOR · SQL injection · traversal',{stroke:CY,size:10})}
      ${box(40,76,460,36,'headers: Host · Origin\nhost poisoning · CORS bypass',{stroke:AM,size:10})}
      ${box(40,118,460,36,'cookies: role=admin\nclient-side trust is no control',{stroke:MG,size:10})}
      ${box(40,160,460,36,'body: { role: admin }\nmass assignment · injection',{stroke:LM,size:10})}
      ${box(40,202,460,36,'uploads · server-fetched URLs\nbad upload · SSRF',{stroke:DIM,size:10})}`,'Parts of an HTTP request and the flaw each enables')},
   {cap:"Security lives at the trust boundary between the hostile client and the server. Three verbs enforce it, and only the server can.",
    svg:svg(540,200,`${text(270,16,'TRUST BOUNDARY — enforce on the server',{color:MG,bold:true,size:11})}
      ${box(16,34,112,52,'browser\n(hostile)',{stroke:MG,size:10})}${box(146,34,112,52,'reverse proxy\n/ CDN',{size:10})}${box(276,34,124,52,'app server\n(enforce here)',{stroke:CY,size:10})}${box(416,34,108,52,'DB · internal\n/ metadata',{stroke:AM,size:10})}
      ${line(137,28,137,92,{dash:true,stroke:MG})}${arrow(128,60,146,60,'')}${arrow(258,60,276,60,'')}${arrow(400,60,416,60,'')}
      ${box(16,118,160,34,'validate on entry',{stroke:LM,size:10})}${box(190,118,160,34,'encode on exit',{stroke:AM,size:10})}${box(364,118,160,34,'authorize every request',{stroke:CY,size:10})}
      ${text(270,176,'the client is hostile; the server decides',{color:DIM,size:10})}`,'Trust boundary between client and server with the three enforcement verbs')}];

  I.p31m2=[{cap:"SQL injection and its fix in one picture: concatenation lets a quote become code; a parameterized query binds the value as data that can never be parsed as syntax.",
    svg:svg(540,190,`${text(270,16,'Injection: keep code and data in separate channels',{color:CY,size:11})}
      ${text(135,40,'BROKEN — concatenation',{color:MG,bold:true,size:10})}
      ${box(20,52,232,38,'name = \'" + q + "\'',{mono:true,stroke:MG,size:9})}
      ${text(136,104,'q = O\'Brien  breaks the query',{color:DIM,size:9})}
      ${box(20,116,232,38,'DB runs attacker text as code',{stroke:MG,color:MG,size:9})}
      ${line(270,30,270,170,{dash:true,stroke:DIM})}
      ${text(405,40,'SAFE — parameterized',{color:LM,bold:true,size:10})}
      ${box(288,52,232,38,'"... name = ?", (q,)',{mono:true,stroke:CY,size:9})}
      ${text(404,104,'value bound, never parsed',{color:DIM,size:9})}
      ${box(288,116,232,38,'q is only ever data',{stroke:LM,color:LM,size:9})}`,'SQL injection via concatenation versus a safe parameterized query')},
   {cap:"Cross-site scripting is injection whose interpreter is the victim's browser. All three kinds end the same way, and the fix is contextual output encoding plus a Content Security Policy.",
    svg:svg(540,232,`${text(270,16,'XSS: untrusted text becomes script in the browser',{color:MG,size:10})}
      ${box(16,36,160,44,'reflected\nechoed in response',{stroke:AM,size:10})}${box(190,36,160,44,'stored\nsaved, shown later',{stroke:AM,size:10})}${box(364,36,160,44,'DOM-based\nJS source to sink',{stroke:AM,size:10})}
      ${arrow(96,80,210,118,'')}${arrow(270,80,270,118,'')}${arrow(444,80,330,118,'')}
      ${box(150,120,240,40,'victim browser parses it as code',{stroke:MG,color:MG,size:10})}
      ${arrow(270,160,270,180,'')}${box(120,180,300,36,'fix: encode for context + CSP',{stroke:LM,color:LM,size:10})}`,'The three kinds of XSS converging on the browser and the fix')}];

  I.p31m3=[{cap:"Authentication, session management and access control are three different questions with three different failures. All three must run on every request.",
    svg:svg(540,200,`${text(270,16,'Three questions, three different failures',{color:CY,size:11})}
      ${box(16,36,160,46,'authentication\nWHO are you?',{stroke:CY,size:10})}${box(190,36,160,46,'session\nSTILL you?',{stroke:AM,size:10})}${box(364,36,160,46,'access control\nMAY you?',{stroke:MG,size:10})}
      ${arrow(176,59,190,59,'')}${arrow(350,59,364,59,'')}
      ${arrow(96,82,96,104,'')}${arrow(270,82,270,104,'')}${arrow(444,82,444,104,'')}
      ${box(16,106,160,40,'fail: credential theft',{stroke:DIM,dash:true,size:9})}${box(190,106,160,40,'fail: hijack / CSRF',{stroke:DIM,dash:true,size:9})}${box(364,106,160,40,'fail: IDOR / escalation',{stroke:DIM,dash:true,size:9})}
      ${text(270,174,'all three run on every request',{color:DIM,size:10})}`,'Authentication, session and access control and the failure each prevents')},
   {cap:"The whole fix for an IDOR is one clause: look the object up scoped to the session's owner, and return 404 when it is not theirs.",
    svg:svg(540,190,`${text(270,16,'IDOR: the fix is a server-side ownership check',{color:CY,size:11})}
      ${text(135,40,'BROKEN',{color:MG,bold:true,size:10})}
      ${box(20,54,232,38,'WHERE id = ?',{mono:true,stroke:MG,size:10})}
      ${box(20,98,232,38,'returns anyone\'s invoice',{stroke:MG,color:MG,size:9})}
      ${line(270,30,270,160,{dash:true,stroke:DIM})}
      ${text(405,40,'SAFE',{color:LM,bold:true,size:10})}
      ${box(288,54,232,38,'WHERE id=? AND owner_id=?',{mono:true,stroke:CY,size:9})}
      ${box(288,98,232,38,'404 if not yours',{stroke:LM,color:LM,size:10})}
      ${text(270,170,'the AND clause is the whole control',{color:AM,size:10})}`,'IDOR before and after the server-side ownership check')}];

  I.p31m4=[{cap:"An intercepting proxy pauses traffic between your browser and a target you are authorized to test, so you can read and edit every request.",
    svg:svg(540,180,`${text(270,16,'The proxy pauses traffic you are authorized to test',{color:CY,size:10})}
      ${box(20,48,130,50,'browser',{stroke:CY,size:11})}${box(205,48,130,50,'Burp / ZAP\npause · edit',{stroke:MG,size:10})}${box(390,48,130,50,'server\n(your scope)',{stroke:AM,size:10})}
      ${arrow(150,73,205,73,'request')}${arrow(335,73,390,73,'forward')}
      ${text(270,124,'the CA you install trusts your own machine only',{color:DIM,size:9})}
      ${text(270,146,'scope: your apps · Academy labs · HTB · listed bounty',{color:LM,size:9})}`,'An intercepting proxy between the browser and an authorized target')},
   {cap:"The BSCP exam is three stages on each of two applications, inside four hours: get in, reach admin, read the secret file.",
    svg:svg(540,180,`${text(270,16,'BSCP: three stages per app, two apps, 4 hours',{color:CY,size:11})}
      ${box(16,46,160,50,'1 access\na user account',{stroke:CY,size:10})}${box(190,46,160,50,'2 reach the\nadmin interface',{stroke:AM,size:10})}${box(364,46,160,50,'3 read\n/home/carlos/secret',{stroke:MG,size:10})}
      ${arrow(176,71,190,71,'')}${arrow(350,71,364,71,'')}
      ${text(270,120,'x2 applications  =  6 flags, all required',{color:LM,size:10})}
      ${text(270,146,'free Academy prep · Burp Pro · US$99',{color:DIM,size:9})}`,'The three BSCP exam stages across two applications')}];

  I.p31m5=[{cap:"SSRF turns a server-side fetch into a reach inward. Pointed at the cloud metadata address it can return credentials, so a web bug becomes account compromise.",
    svg:svg(540,200,`${text(270,16,'SSRF: a fetch feature reaching cloud metadata',{color:MG,size:11})}
      ${box(16,44,120,46,'attacker\nsupplies URL',{stroke:MG,size:10})}${box(170,44,150,46,'app fetches it\nserver-side',{stroke:CY,size:10})}${box(360,44,164,46,'169.254.169.254\nmetadata to creds',{stroke:AM,size:10})}
      ${arrow(136,67,170,67,'')}${arrow(320,67,360,67,'inward')}
      ${arrow(270,90,270,118,'')}${box(50,120,440,34,'contain: allowlist · block private IPs · IMDSv2',{stroke:LM,color:LM,size:10})}
      ${text(270,176,'a web bug becomes cloud-account compromise',{color:DIM,size:9})}`,'SSRF reaching the cloud metadata endpoint and the containing controls')},
   {cap:"The software supply chain is three layers of trust you did not write. A03:2025 says secure each one.",
    svg:stack([{t:'update channel — sign & verify',stroke:AM},{t:'build / CI-CD — least privilege, OIDC',stroke:MG},{t:'dependencies — scan + pin + SBOM',stroke:CY}],{w:470,label:'A03:2025 — trust every layer you did not write'})}];

  I.p31m6=[{cap:"A mobile app is just another untrusted client; most vulnerabilities live in the backend API, which must authorize every request. The device adds its own storage and transport surface.",
    svg:svg(540,194,`${text(270,16,'The app is a client; the backend is the real target',{color:CY,size:10})}
      ${box(20,46,200,58,'mobile app\nUNTRUSTED client',{stroke:MG,size:10})}${box(320,46,200,58,'backend API\nmust authorize all',{stroke:CY,size:10})}
      ${arrow(220,75,320,75,'HTTPS')}
      ${box(20,122,200,40,'device: storage · transport',{stroke:AM,dash:true,size:9})}${box(320,122,200,40,'server re-checks every request',{stroke:LM,dash:true,size:9})}`,'Mobile app as untrusted client versus the backend API as real target')},
   {cap:"The lawful mobile lab is self-contained: an emulator, an app you installed to be broken, and a proxy whose CA you added to that emulator. Nothing leaves your network.",
    svg:svg(540,192,`${text(270,16,'A self-contained, lawful mobile lab',{color:CY,size:11})}
      ${box(20,44,150,50,'emulator\n(AVD / Simulator)',{stroke:CY,size:10})}${box(195,44,150,50,'vulnerable app\nyou installed',{stroke:MG,size:10})}${box(370,44,150,50,'Burp / ZAP\nyour CA',{stroke:AM,size:10})}
      ${arrow(170,69,195,69,'')}${arrow(345,69,370,69,'')}
      ${box(60,118,420,34,'secrets to Keystore / Keychain · HTTPS enforced',{stroke:LM,color:LM,size:10})}
      ${text(270,172,'nothing leaves your own network',{color:DIM,size:9})}`,'A lawful self-contained mobile testing lab on your own machine')}];

  I.p31m7=[{cap:"A finding is a self-contained unit a reader can act on. The reproduction steps are the field that most decides whether the bug gets fixed.",
    svg:stack([{t:'title — what & where',stroke:CY},{t:'CVSS — severity score'},{t:'evidence — prove, do not exfiltrate',stroke:AM},{t:'reproduction — numbered steps',stroke:LM},{t:'impact — in business terms'},{t:'remediation — the specific fix',stroke:MG}],{w:430,h:30,label:'A finding a developer can act on'})},
   {cap:"Automated tools shift left across the lifecycle, but none sees authorization or business-logic flaws; human review and a pentest remain necessary.",
    svg:flow([{t:'SAST\non commit',stroke:CY},{t:'IAST\nin QA tests',stroke:AM},{t:'DAST\non deploy',stroke:MG},{t:'pentest +\nreview',stroke:LM}],{bw:116,bh:50,gap:20,label:'Tools shift left; humans find logic flaws'})}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
