/* Illustrations — Domain 8: authorized testing, methodology, risk and working with defenders.
   Appends to the figures defined for p8m1–p8m4 in illus_more.js (never replaces them). */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K; const I={};

  /* ===== M1: ethics, law, rules of engagement ===== */
  I.p8m1=[
    {cap:"Authorization is a gate, not a formality: the target, methods and time window must all be in scope.",
      svg:flow([{t:"Written permission",stroke:CY},{t:"Scope + rules",stroke:MG},{t:"Authorized test",stroke:AM},{t:"Evidence + report",stroke:LM}],{bw:112,bh:48,gap:20,label:"Rules of engagement"})},
    {cap:"The four documents that make an engagement legitimate — all signed before any testing begins.",
      svg:stack([{t:"Scope: assets in / out of bounds",stroke:CY},{t:"Rules of engagement: methods, timing, limits",stroke:MG},{t:"Authorization letter: signed by an owner",stroke:AM},{t:"NDA / MSA: protect the secrets you see",stroke:LM}],{w:420,label:"Paperwork of a legitimate engagement"})},
    {cap:"Responsible disclosure: report privately, give time to fix, coordinate before any public mention.",
      svg:flow([{t:"Find flaw",stroke:CY},{t:"Report\nprivately",stroke:MG},{t:"Owner fixes",stroke:AM},{t:"Coordinated\ndisclosure",stroke:LM}],{bw:104,bh:50,gap:20,label:"Coordinated disclosure flow"})}
  ];

  /* ===== M2: methodology and standards ===== */
  I.p8m2=[
    {cap:"The seven PTES sections — scoping and reporting bracket the technical work in the middle.",
      svg:flow([{t:"pre-\nengage",stroke:AM},{t:"intel\ngather"},{t:"threat\nmodel",stroke:CY},{t:"vuln\nanalysis"},{t:"exploit",stroke:MG},{t:"post-\nexploit"},{t:"report",stroke:LM}],{perRow:4,bw:66,bh:48,gap:16,label:"PTES seven sections"})},
    {cap:"Every offensive phase mirrors a Domain 7 defensive control — the output is fixes, not a break-in.",
      svg:compare(
        {t:"offense (phase)",draw:x=>box(x+20,42,220,26,"recon",{size:11,stroke:CY})+box(x+20,74,220,26,"scan / enumerate",{size:11,stroke:CY})+box(x+20,106,220,26,"gain access",{size:11,stroke:CY})+box(x+20,138,220,26,"post-exploitation",{size:11,stroke:CY})},
        {t:"defense (domain 7)",draw:x=>box(x+20,42,230,26,"reduce attack surface",{size:11,stroke:LM})+box(x+20,74,230,26,"patch / harden",{size:11,stroke:LM})+box(x+20,106,230,26,"secure code / input",{size:11,stroke:LM})+box(x+20,138,230,26,"least privilege / segment",{size:11,stroke:LM})},
        {h:180,label:"Offense mirrors defense"})},
    {cap:"NIST SP 800-115 four stages: the attack stage loops back to discovery as you learn the estate.",
      svg:cycle([{t:"planning"},{t:"discovery",stroke:CY},{t:"attack",stroke:MG},{t:"reporting",stroke:LM}],{label:"NIST SP 800-115 methodology"})}
  ];

  /* ===== M3: toolkit and legal practice ===== */
  I.p8m3=[
    {cap:"The toolkit by category — all dual-use security tools; authorization makes their use legitimate.",
      svg:stack([{t:"Testing distro: Kali / Parrot",stroke:CY},{t:"OSINT / recon",stroke:DIM},{t:"Scanners: nmap, Nessus",stroke:AM},{t:"Web proxy: Burp / ZAP",stroke:MG},{t:"Exploit framework: Metasploit",stroke:DIM}],{w:360,label:"Dual-use tool categories"})},
    {cap:"Same scan, two readers: fundamentals turn raw output into a report the client can act on.",
      svg:compare(
        {t:"beginner",draw:x=>box(x+25,45,210,34,"forwards 200 lines\nof raw output",{size:11,stroke:MG})+text(x+130,120,"worthless, often wrong",{color:MG,size:11})},
        {t:"professional",draw:x=>box(x+25,45,210,34,"real vs false positive,\nreachable, impact",{size:11,stroke:LM})+text(x+130,120,"actionable findings",{color:LM,size:11})},
        {h:150,label:"Why fundamentals decide value"})},
    {cap:"Legal practice grounds only — sanctioned platforms and your own isolated VMs, never the live internet.",
      svg:flow([{t:"TryHackMe\n/ HTB",stroke:CY},{t:"PortSwigger\nAcademy",stroke:MG},{t:"picoCTF",stroke:AM},{t:"your own\nisolated VMs",stroke:LM}],{bw:106,bh:50,gap:18,label:"Sanctioned practice"})}
  ];

  /* ===== M4: reporting, remediation, retest, profession ===== */
  I.p8m4=[
    {cap:"The report serves two readers and closes with a retest that verifies the fixes actually held.",
      svg:stack([{t:"Executive summary (leadership)",stroke:CY},{t:"Finding: root cause · risk · evidence · fix",stroke:MG},{t:"Finding: … (ordered by business risk)"},{t:"Methodology & scope covered"},{t:"Retest: verified fixed",stroke:LM}],{w:420,label:"Report structure"})},
    {cap:"The certification ladder: build the foundation first, the hands-on milestone last.",
      svg:pyramid([{t:"OSCP+ / GPEN (practical milestone)",color:LM},{t:"CEH (HR breadth)"},{t:"eJPT / PenTest+ (entry offensive)",color:AM},{t:"Security+ (defensive foundation)",color:CY}],{label:"Pentest certification ladder"})},
    {cap:"A finding is only closed when the retest confirms it — a closed ticket is not proof.",
      svg:cycle([{t:"finding"},{t:"remediate",stroke:MG},{t:"retest",stroke:CY},{t:"verified\nfixed",stroke:LM}],{label:"Closing the loop"})}
  ];

  /* ===== M5: vulnerability classes by root cause ===== */
  I.p8m5=[
    {cap:"The one root cause: untrusted input crosses the trust boundary and is treated as privileged.",
      svg:svg(520,170,
        box(20,55,150,56,"attacker input\n(the request)",{size:11,stroke:MG})+
        line(195,40,195,135,{dash:true,stroke:AM})+text(195,150,"trust boundary",{size:11,color:AM})+
        arrow(170,83,230,83,"crosses")+
        box(230,55,260,56,"treated as code / command /\nidentity, not data",{size:11,stroke:CY}),
        "Untrusted input crossing a trust boundary")},
    {cap:"One principle, many classes — keep input as data on the trusted side and they all close.",
      svg:tree({t:"untrusted input",kids:[{t:"injection"},{t:"XSS"},{t:"SSRF"},{t:"path\ntraversal"}]},{label:"One root cause, many classes"})},
    {cap:"Each class: a primary fix at the source, plus compensating controls and a detection.",
      svg:stack([{t:"Injection → parameterized queries",stroke:CY,side:"+ least-priv DB"},{t:"Access control → server-side authz",stroke:MG,side:"+ deny by default"},{t:"XSS → output encoding",stroke:AM,side:"+ CSP"},{t:"SSRF → outbound allow-list",stroke:LM,side:"+ block metadata"}],{w:300,side:true,label:"Class, fix and defence-in-depth"})}
  ];

  /* ===== M6: risk and severity ===== */
  I.p8m6=[
    {cap:"Severity is not risk: a CVSS score alone cannot set priority without likelihood and context.",
      svg:svg(540,150,
        box(20,45,150,44,"CVSS\n(severity)",{size:11,stroke:CY})+
        text(190,67,"x",{size:16,color:DIM})+
        box(210,45,150,44,"EPSS / KEV\n(likelihood)",{size:11,stroke:AM})+
        text(378,67,"x",{size:16,color:DIM})+
        box(395,45,130,44,"business\ncontext",{size:11,stroke:MG})+
        text(270,120,"= risk (what to fix first)",{size:12,color:LM}),
        "Risk equals severity times likelihood times context")},
    {cap:"CVSS 4.0 has four metric groups; context can move a score a whole severity band.",
      svg:stack([{t:"Base: intrinsic traits + impact",stroke:CY,side:"9.3 example"},{t:"Threat: exploit maturity",stroke:AM,side:"E:P -> 7.3"},{t:"Environmental: your requirements",stroke:MG,side:"CR/IR/AR"},{t:"Supplemental: extra context",stroke:DIM,side:"no score change"}],{w:300,side:true,label:"CVSS 4.0 metric groups"})},
    {cap:"Highest CVSS is not highest priority: the reachable, exploited, data-bearing flaw wins.",
      svg:compare(
        {t:"printer firmware",draw:x=>box(x+25,44,210,30,"CVSS 9.1",{size:11,stroke:CY})+box(x+25,80,210,44,"EPSS 0.001 · not KEV\nisolated VLAN",{size:10,stroke:DIM})+text(x+130,146,"P3 — segmentation",{color:DIM,size:11})},
        {t:"customer login",draw:x=>box(x+25,44,210,30,"CVSS 8.6",{size:11,stroke:MG})+box(x+25,80,210,44,"internet-facing\nregulated data",{size:10,stroke:AM})+text(x+130,146,"P1 — fix first",{color:LM,bold:true,size:11})},
        {h:165,label:"Priority follows risk, not the biggest number"})}
  ];

  /* ===== M7: cloud, AD, web as config & design review ===== */
  I.p8m7=[
    {cap:"The cloud shared-responsibility model: you assess the customer's configuration, not the provider.",
      svg:compare(
        {t:"provider secures",draw:x=>box(x+20,44,220,28,"data centers, hardware",{size:11,stroke:DIM})+box(x+20,78,220,28,"the services themselves",{size:11,stroke:DIM})+text(x+130,128,"out of scope",{color:DIM,size:11})},
        {t:"customer secures",draw:x=>box(x+20,44,230,28,"IAM, storage, network",{size:11,stroke:LM})+box(x+20,78,230,28,"logging, keys, config",{size:11,stroke:LM})+text(x+130,128,"what you review",{color:LM,size:11})},
        {h:150,label:"Shared responsibility"})},
    {cap:"Active Directory as design review: flat privilege lets one workstation reach domain admin.",
      svg:compare(
        {t:"flat (risky)",draw:x=>box(x+70,40,110,26,"domain admin",{size:10,stroke:MG})+line(x+125,66,x+60,96)+line(x+125,66,x+190,96)+box(x+30,96,70,24,"user",{size:10})+box(x+160,96,70,24,"user",{size:10})+text(x+130,140,"one hop to admin",{color:MG,size:10})},
        {t:"tiered (fixed)",draw:x=>box(x+70,40,110,24,"tier 0 admin",{size:10,stroke:LM})+box(x+70,74,110,22,"tier 1 servers",{size:10,stroke:AM})+box(x+70,104,110,22,"tier 2 users",{size:10,stroke:CY})+text(x+130,140,"least privilege",{color:LM,size:10})},
        {h:160,label:"Flat versus tiered privilege"})},
    {cap:"Identity is the real perimeter: cloud role, AD account and web session are all identities.",
      svg:flow([{t:"cloud role",stroke:CY},{t:"AD account",stroke:AM},{t:"web session",stroke:MG}],{edges:["",""],bw:120,bh:46,gap:14,label:"Identity fabric"})}
  ];

  /* ===== M8: working with defenders ===== */
  I.p8m8=[
    {cap:"Red, blue and purple: purple pairs offense and defense so each technique ends in a detection.",
      svg:svg(540,150,
        box(20,50,150,50,"red:\nemulate adversary",{size:11,stroke:MG})+
        box(370,50,150,50,"blue:\nSOC & response",{size:11,stroke:CY})+
        box(195,45,150,60,"purple:\ntogether, in the open",{size:11,stroke:LM,bold:true})+
        arrow(170,75,195,75,"")+arrow(345,75,370,75,"")+
        text(270,128,"every run -> a validated detection",{size:11,color:LM}),
        "Red, blue and purple teaming")},
    {cap:"Detection validation: if a logged technique never alerts, build the detection and map it.",
      svg:flow([{t:"run technique\n(authorized)",stroke:AM},{t:"telemetry\nexists?"},{t:"reaches\nSIEM?"},{t:"alert fires?",stroke:CY},{t:"build\ndetection",stroke:LM}],{perRow:3,bw:96,bh:50,gap:16,label:"Detection validation"})},
    {cap:"A finding becomes durable: mapped to a MITRE ATT&CK technique, verified again at retest.",
      svg:cycle([{t:"finding"},{t:"fix +\ndetection",stroke:MG},{t:"map to\nATT&CK",stroke:AM},{t:"retest:\nalert fires",stroke:LM}],{label:"Finding to durable capability"})}
  ];

  window.ILLUS=window.ILLUS||{}; Object.keys(I).forEach(k=>{ window.ILLUS[k]=(window.ILLUS[k]||[]).concat(I[k]); });  /* add to the original figures, never replace them */
})();
