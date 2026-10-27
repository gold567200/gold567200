/* Domain 8 support pack: ethical-testing certification track, authorized-practice listening, and scoped vocabulary.
   Certification facts verified October 2026 against the issuers' own pages (see EXTRA_CERTS["c-pentest"].sources).
   Prices move and the issuer stores often omit a printed figure, so prices are marked "about" / "unverified:" where the official page did not print one. */

window.EXTRA_CERTS = window.EXTRA_CERTS || {};
window.EXTRA_CERTS["c-pentest"]={
  checked:"2026-10-27",
  sources:[
    "https://www.comptia.org/en-us/certifications/pentest/",
    "https://www.comptia.org/en-us/blog/the-updated-comptia-pentest-is-here/",
    "https://www.comptia.org/en-us/resources/ce/learn/continuing-education-renewal-fees/",
    "https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide",
    "https://help.offsec.com/hc/en-us/articles/4412170923924-OSCP-Exam-FAQ",
    "https://help.offsec.com/hc/en-us/articles/31553032386964-OffSec-Continuing-Professional-Education-CPE-Program-Overview",
    "https://ine.com/security/certifications/ejpt-certification",
    "https://cert.eccouncil.org/certified-ethical-hacker.html",
    "https://cert.eccouncil.org/ece-policy.html",
    "https://www.giac.org/certifications/penetration-tester-gpen"
  ],
  ph:"p8",
  name:"Pentest path: Security+ → eJPT / PenTest+ → CEH → OSCP+ / GPEN",
  code:"PT0-003 (PenTest+) · eJPT · 312-50 (CEH v13) · PEN-200 (OSCP+) · GPEN",
  prov:"CompTIA · INE Security · EC-Council · OffSec · GIAC (SANS)",
  level:"Offensive security — from entry practical to the recognized hands-on milestone",
  blurb:"This is a ladder of authorized-penetration-testing certifications, not one exam. Start with CompTIA Security+ (Domain 7) for the defensive foundation employers expect first. CompTIA PenTest+ V3, exam PT0-003, launched December 17, 2024 (PT0-002 retired June 17, 2025); it is a maximum of 90 multiple-choice and performance-based questions in 165 minutes, scored 750 on a 100-900 scale, offered in English, French, Japanese and Portuguese, and approved under the US DoD 8140 framework; CompTIA recommends Network+ and Security+ plus 3-4 years in a pentest role, and the certification is valid three years, renewed with 60 CEUs plus a US$150 CE fee for the three-year period (or by CertMaster CE or a higher CompTIA cert). The INE Security eJPT is the gentlest real entry: a 48-hour hands-on practical (INE's March 2026 update raised it to 45 questions from 35 and added a generative-AI-for-pentesters course), valid three years, with no formal prerequisites; voucher about US$249 with one free retake (unverified: INE does not print the price on the certification page). EC-Council's CEH v13 (exam 312-50) is 125 multiple-choice questions in 4 hours with a form-dependent cut score of 60-85%; it is widely requested by HR filters but less hands-on, needs either official training or two years' experience plus a US$100 application fee, and is maintained under EC-Council's ECE scheme (120 credits over 3 years plus an US$80/year fee). The respected hands-on milestone is OffSec's OSCP+ from PEN-200: a roughly 24-hour (23h45m) proctored practical built around an assumed-breach Active Directory set worth 40 points plus three standalone targets worth 60, 70/100 to pass, with a professional report due within 24 hours and no bonus points; the '+' (introduced late 2024) expires after three years and is kept current through OffSec's CPE program and an annual maintenance fee (about US$135-145/year) or a higher OffSec exam, while the original OSCP remains lifetime. A strong alternative in enterprise and government is GIAC's GPEN (SANS SEC560): 82 questions, 3 hours, 73% to pass for versions from July 12, 2025, in the performance-based CyberLive format, renewed every four years with 36 CPEs. Recommended order for you: Security+ and this domain's ethics and methodology modules first, then eJPT or PenTest+, then OSCP+ once your lab practice is strong; add CEH only if an employer's HR filter demands it. All exam prices change and several issuers do not print a figure on the certification page, so confirm the current cost in the issuer's store before you book.",
  domains:[
    "CompTIA PenTest+ PT0-003 — Engagement management (13%): scoping, rules of engagement, legal and compliance, collaboration and communication (Modules 1-2, 4)",
    "CompTIA PenTest+ PT0-003 — Reconnaissance and enumeration (21%): information gathering, active and passive discovery (Modules 2-3)",
    "CompTIA PenTest+ PT0-003 — Vulnerability discovery and analysis (17%): scanning, analysis, prioritization (Modules 5-6)",
    "CompTIA PenTest+ PT0-003 — Attacks and exploits (35%): network, application, cloud, wireless, social engineering concepts (Modules 5, 7)",
    "CompTIA PenTest+ PT0-003 — Post-exploitation and lateral movement (14%): persistence, pivoting and impact, assessed conceptually (Modules 7-8)",
    "OffSec OSCP+ (PEN-200) — Standalone targets (60 pts) plus an assumed-breach Active Directory set (40 pts), 70/100 to pass, with a scored professional report (Modules 2, 4, 7)",
    "EC-Council CEH v13 (312-50) — 20 modules from reconnaissance and scanning through web, wireless, cloud, mobile, IoT/OT and cryptography, tested by recognition (Modules 5, 7)"
  ],
  tips:[
    "Security+ and Modules 1-2 (ethics, law, methodology) come first — always; PenTest+ puts 13% on engagement management, which is Modules 1, 2 and 4.",
    "For PenTest+ reconnaissance/enumeration (21%) and vulnerability discovery/analysis (17%), drill Modules 3, 5 and 6 — read scan output, name the vulnerability class by root cause, and score it with CVSS 4.0 tempered by EPSS/KEV.",
    "For the OSCP+ Active Directory set, Module 7 (AD as assumed-breach design review) and Domain 16 are the map; practice methodology and note-taking under time pressure because the report is scored.",
    "Practice only in TryHackMe, Hack The Box, the free PortSwigger Web Security Academy and your own isolated VM lab; OSCP bans AI assistants and limits Metasploit, so build the fundamentals (Modules 3, 5).",
    "The report is the product on every exam (Module 4): rehearse an executive summary plus technical findings with root cause, risk rating and remediation, ordered by business risk."
  ],
  q:[
    {q:"Before any testing begins, what must be in place?",options:["A fast internet connection","Signed authorization defining scope and rules of engagement","The latest exploit tools","A public disclosure plan"],answer:1,why:"Written authorization and a defined scope are the legal and ethical foundation of every engagement (CFAA); PenTest+ engagement management tests exactly this."},
    {q:"The CompTIA PenTest+ PT0-003 exam is:",options:["100 questions, 90 minutes, open book","Up to 90 multiple-choice and performance-based questions in 165 minutes, 750/900 to pass","A 24-hour practical with a report","Essay only, graded by a human"],answer:1,why:"PT0-003 (launched December 2024) is a maximum of 90 MCQ and performance-based questions in 165 minutes, scored 750 on 100-900."},
    {q:"Which is the FINAL and most valuable deliverable of a professional engagement?",options:["Exploitation","Scanning","A clear, prioritized report plus a retest","Reconnaissance"],answer:2,why:"The client pays for actionable findings, remediation and verification that fixes held — not the break-in itself."},
    {q:"You find a vulnerability outside the agreed scope. You should:",options:["Exploit it to be thorough","Ignore it entirely","Stop, document, and notify your point of contact","Post it publicly"],answer:2,why:"Out-of-scope findings are escalated to the named contact, never acted on or disclosed."},
    {q:"The OSCP+ exam's Active Directory set is best described as:",options:["A multiple-choice section","An assumed-breach scenario where you start with a given credential, worth 40 points","A physical break-in","An essay on Kerberos"],answer:1,why:"OSCP+ hands you a starting username and password and awards 40 of 100 points for the domain exploit chain; the whole exam needs 70 to pass and a report within 24 hours."}
  ]
};

/* Full listening list for p8. Using window.EXTRA_LISTEN.p8 (replaces the in-app default), so the original
   entries are reproduced here and the OWASP WSTG and three more verified sources are appended. */
window.EXTRA_LISTEN = window.EXTRA_LISTEN || {};
window.EXTRA_LISTEN.p8 = [
  {t:"Darknet Diaries",by:"Jack Rhysider",ty:"Podcast · true security stories",why:"How real intrusions actually unfold — listen for the missing control in each one, then name the Domain 7 fix.",u:[["Episodes","https://darknetdiaries.com/episode/"]]},
  {t:"Ghost in the Wires",by:"Kevin Mitnick",ty:"Audiobook · 14h",why:"Social engineering from a master, and a cautionary tale about where the legal line sits.",u:[["Audible","https://www.audible.com/pd/Ghost-in-the-Wires-Audiobook/B005H3FYR4"]]},
  {t:"Tracers in the Dark",by:"Andy Greenberg",ty:"Audiobook · 10.8h",why:"Following the money on the dark web; how evidence and attribution really work.",u:[["Audible","https://www.audible.com/pd/Tracers-in-the-Dark-Audiobook/B09VLK4VRG"]]},
  {t:"Hack The Box & TryHackMe",by:"HTB / THM",ty:"Hands-on labs · the legal practice grounds",why:"Where you actually build skill lawfully, from beginner rooms to advanced machines (Module 3).",u:[["TryHackMe","https://tryhackme.com"],["Hack The Box","https://www.hackthebox.com"]]},
  {t:"OWASP Web Security Testing Guide (WSTG)",by:"OWASP",ty:"Docs · the web-testing checklist",why:"The free, authoritative catalogue of what to test in a web app; use it only against apps you own or are authorized to assess (Modules 5, 7).",u:[["Guide","https://owasp.org/www-project-web-security-testing-guide/"]]},
  {t:"PortSwigger Web Security Academy",by:"PortSwigger",ty:"Course · free, hands-on labs",why:"Free, vendor-sandboxed labs for every web vulnerability class, mapped to the WSTG — the safest way to learn Module 5 by doing.",u:[["Academy","https://portswigger.net/web-security"]]},
  {t:"NIST SP 800-115, Technical Guide to Information Security Testing and Assessment",by:"NIST",ty:"Docs · free methodology + RoE template",why:"The planning/discovery/attack/reporting methodology and the rules-of-engagement template behind Module 2.",u:[["Read free","https://csrc.nist.gov/pubs/sp/800/115/final"]]},
  {t:"The Penetration Testing Execution Standard (PTES)",by:"PTES",ty:"Docs · the seven-section standard",why:"The common mental model of an engagement, from pre-engagement to reporting (Module 2).",u:[["Standard","https://www.pentest-standard.org/"],["Readable docs","https://pentest-standard.readthedocs.io/en/latest/index.html"]]}
];

window.EXTRA_GLOSSARY = window.EXTRA_GLOSSARY || [];
window.EXTRA_GLOSSARY.push(
  ["rules of engagement","Written constraints for an authorized security test: scope, timing, allowed methods, contacts, stop conditions and data handling.",["p8"]],
  ["scope","The explicitly authorized assets, accounts, actions and time window a test may cover; anything outside it requires clarification and approval.",["p8"]],
  ["false positive","A reported weakness that evidence does not substantiate; testers validate findings before assigning severity.",["p8"]],
  ["proof of concept","A minimal, controlled demonstration that establishes a finding without unnecessary access, data collection or disruption.",["p8"]],
  ["remediation","A change that removes or reduces the root cause of a security finding, followed by verification or retesting.",["p8"]],
  ["finding","A documented security issue with evidence, affected asset, impact, severity rating, remediation and retest status.",["p8"]],
  ["authorization","Explicit written permission from a system owner to test named targets within an agreed scope; the one thing that makes security testing legal.",["p8"]],
  ["CFAA","The US Computer Fraud and Abuse Act (18 U.S.C. 1030), which criminalizes accessing a computer without, or in excess of, authorization.",["p8"]],
  ["safe harbour","A written promise in a bug-bounty or disclosure policy not to pursue legal action for good-faith testing that stays within the published scope.",["p8"]],
  ["coordinated disclosure","Reporting a flaw privately to the owner and allowing time to fix it before any public mention; the industry-standard disclosure norm.",["p8"]],
  ["threat modelling","Identifying what matters, what can go wrong (e.g. STRIDE), and which tests exercise those risks, to direct effort to where impact lives.",["p8"]],
  ["trust boundary","The line between attacker-controlled input and what a system trusts; most application flaws are untrusted input crossing it and being treated as privileged.",["p8"]],
  ["CVSS","The Common Vulnerability Scoring System; version 4.0 gives a 0-10 severity score from Base, Threat, Environmental and Supplemental metric groups.",["p8"]],
  ["EPSS","The Exploit Prediction Scoring System: the probability that a vulnerability will be exploited in the wild within the next 30 days.",["p8"]],
  ["KEV catalogue","CISA's Known Exploited Vulnerabilities list of flaws confirmed actively exploited; US federal agencies must remediate new entries within two weeks (BOD 22-01).",["p8"]],
  ["shared responsibility","The cloud model in which the provider secures the infrastructure and the customer secures their own configuration, data and identities.",["p8"]],
  ["least privilege","Granting an identity only the access its job requires; the standard fix for over-privileged cloud roles and Active Directory service accounts.",["p8"]],
  ["purple teaming","An engagement in which the offensive and defensive sides work in the open so each technique ends in a validated detection or a closed gap.",["p8"]],
  ["MITRE ATT&CK","A free, versioned knowledge base of adversary tactics and techniques; the shared language offense and defense use to describe behaviour and map detections.",["p8"]],
  ["retest","Re-running the specific checks that produced each finding to verify the weakness is genuinely gone (and, in purple teaming, that the new detection fires).",["p8"]]
);
