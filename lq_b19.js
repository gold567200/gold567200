/* Lesson quizzes — batch 19 (answer positions rebalanced) */
window.LQ=window.LQ||{};
Object.assign(window.LQ,{
 "p8m1": [
  {
   "id": "p8m1q1",
   "q": "A colleague scans a former employer's web server on his own time, changes nothing, and emails them the holes he found 'to be helpful.' He had no contract or permission. Is this lawful?",
   "options": [
    "No, because unauthorized access is itself the crime, whatever his intent",
    "Yes, because he altered no data and caused no measurable damage to the server",
    "Yes, since the private, helpful disclosure cures any technical overstep he may have made",
    "No, but only because he later used the findings outside the company's walls"
   ],
   "answer": 0,
   "why": "The CFAA criminalizes unauthorized access itself; 'I changed nothing' and 'I meant well' are not defenses, and disclosing afterward does not retroactively authorize the access. Authorization, not harm, is the line."
  },
  {
   "id": "p8m1q2",
   "q": "You are testing under a signed contract. Mid-engagement you stumble onto a folder of patient medical records on a server that is not named anywhere in your scope. What is the right next step?",
   "options": [
    "Keep reading the folder so your final report captures the full extent of the exposure",
    "Document it, stop, and escalate to your named contact",
    "Quietly delete your own access logs to protect the patients' privacy",
    "Continue testing that server, since you already happen to have access to it"
   ],
   "answer": 1,
   "why": "Data outside scope, especially regulated records, is a stop-and-escalate condition: document and contact your point of contact. Continuing to access it exceeds your authorization, and tampering with logs is itself misconduct."
  },
  {
   "id": "p8m1q3",
   "q": "A bug-bounty program's scope lists only *.shop.example.com. You find a serious flaw in mail.example.com, which is not listed. What does the program authorize?",
   "options": [
    "Testing any example.com host, because the same brand is running the program",
    "Any host at all, as long as you report privately and never sell the flaw you find",
    "Only the listed shop subdomains; mail.example.com is unauthorized",
    "Testing mail.example.com this once, because the flaw there is unusually serious"
   ],
   "answer": 2,
   "why": "A bug bounty is written authorization limited to its published scope. A host outside that scope is unauthorized access with a program logo nearby; severity and private reporting do not extend the grant. Read the scope like the contract it is."
  },
  {
   "id": "p8m1q4",
   "q": "Which document, signed by someone who owns the systems, should a tester carry throughout an engagement to show the work is sanctioned if questioned?",
   "options": [
    "The signed non-disclosure agreement covering the client's confidential secrets",
    "The company's published responsible-disclosure and safe-harbor policy",
    "The commercial license file for the vulnerability scanner being used",
    "The authorization ('get out of jail') letter"
   ],
   "answer": 3,
   "why": "The authorization letter, signed by an owner of the systems, proves the work is permitted and is carried for the duration. The NDA binds you to protect secrets but grants no access; the disclosure policy governs reporting, not permission."
  },
  {
   "id": "p8m1q5",
   "q": "You find a real, severe flaw in a client's app during a sanctioned test. Under coordinated disclosure, what may you properly do with it?",
   "options": [
    "Report it privately to the owner and allow reasonable time to fix",
    "Publish a working proof-of-concept so the wider industry can learn from the issue",
    "Sell it to a vulnerability broker, since you discovered it through legitimate work",
    "Use it to pivot into deeper systems so the written report looks more impressive"
   ],
   "answer": 0,
   "why": "Coordinated disclosure means reporting privately to the owner and allowing time to remediate before any public mention. Selling, publishing, or pivoting beyond what proves the point all exceed the engagement and the industry norm."
  }
 ],
 "p8m2": [
  {
   "id": "p8m2q1",
   "q": "A client wants an assessment that simulates a logged-in customer who should not be able to reach other customers' data. The tester gets a normal user account but no source code or architecture documents. Which approach is this?",
   "options": [
    "Black box, since the tester starts from an outsider's position with little information",
    "Grey box",
    "White box",
    "Physical, because it models someone already inside the building"
   ],
   "answer": 1,
   "why": "Grey box means partial knowledge, exactly the position of a logged-in user: some access and credentials but no full internal information. Black box assumes nothing; white box gives full information including source code."
  },
  {
   "id": "p8m2q2",
   "q": "Put these engagement phases in correct order: post-exploitation, reconnaissance, reporting, scanning and enumeration, gaining access.",
   "options": [
    "Recon, then gaining access, then scanning/enumeration, post-exploitation, reporting",
    "Scanning/enumeration first, then recon, gaining access, reporting, and post-exploitation",
    "Recon, scanning/enumeration, gaining access, post-exploitation, reporting",
    "Recon, scanning/enumeration, post-exploitation, gaining access, then reporting last"
   ],
   "answer": 2,
   "why": "The lifecycle is recon (map the surface), scan/enumerate (find entry points), gain access (prove exploitable), post-exploitation (assess impact), then reporting. Gaining access must precede post-exploitation, and reporting always comes last."
  },
  {
   "id": "p8m2q3",
   "q": "During scanning you find an outdated, internet-exposed service. A pentester thinks in both directions. What is the Domain 7 defensive mirror of this finding?",
   "options": [
    "Least privilege and tight network segmentation between internal zones",
    "Secure coding practices together with rigorous input validation on all fields",
    "Append-only audit logging of every administrative action taken",
    "Patching and attack-surface reduction"
   ],
   "answer": 3,
   "why": "An outdated, exposed service is a scanning/enumeration finding whose defensive counter is patching and closing or restricting unneeded services. Least privilege mirrors post-exploitation; secure coding mirrors exploitation; logging supports detection."
  },
  {
   "id": "p8m2q4",
   "q": "A junior tester says the real value of a test is the dramatic break-in. According to PTES thinking, where does most of a test's professional value actually sit?",
   "options": [
    "In scoping and reporting",
    "In the sheer number of distinct vulnerabilities the tester manages to find",
    "In the exploitation phase, which is where real technical skill is proven",
    "In the post-exploitation phase, measured by how far the tester can pivot"
   ],
   "answer": 0,
   "why": "Good scoping decides what matters and reporting turns findings into fixes; exploitation merely proves a finding is real. The point is a prioritized list of weaknesses to fix, not the break-in itself."
  },
  {
   "id": "p8m2q5",
   "q": "Working with minimal impact, a tester confirms a SQL injection reaches the user table. What should they do to demonstrate it?",
   "options": [
    "Dump the entire user table to the client so the full extent is beyond dispute",
    "Retrieve one record or a row count as proof, then stop and document",
    "Drop the table so the business impact of the flaw is made vivid and undeniable",
    "Leave a small marker file on the server to prove they had write access"
   ],
   "answer": 1,
   "why": "Minimal impact means proving the finding to the least extent needed and no further: a single record or a count shows exploitability. Dumping everything or destroying data exceeds the mandate and can breach the rules of engagement and the law."
  }
 ],
 "p8m3": [
  {
   "id": "p8m3q1",
   "q": "Two testers run the same scanner against the same authorized target and get the same 200-line report. One writes an actionable report; the other forwards raw output. What best explains the difference?",
   "options": [
    "The first tester had simply paid for the premium edition of the scanner",
    "The first happened to run the scan at a slower, gentler rate limit",
    "The first understands networks, systems and apps and can read the output",
    "The first was using a considerably faster testing machine than the second"
   ],
   "answer": 2,
   "why": "The scanner is identical; the fundamentals (Domains 2/3/7) are the whole difference. Understanding lets one separate real findings from false positives and explain business impact. Tools surface data; they do not supply the meaning."
  },
  {
   "id": "p8m3q2",
   "q": "A beginner wants unlimited, lawful practice on web vulnerabilities. Which is an appropriate place to build the skill?",
   "options": [
    "A competitor's live login page, probed gently and only during off-hours",
    "A site found to be running an outdated CMS, since it is clearly already insecure",
    "A small business site belonging to a friend who gave a casual verbal OK",
    "The PortSwigger Web Security Academy's own sandboxed labs"
   ],
   "answer": 3,
   "why": "PortSwigger's Academy provides labs in the vendor's own sandbox built to be attacked. The live internet and others' sites, even with a casual OK, are off-limits; legal practice means sanctioned platforms and your own isolated VMs."
  },
  {
   "id": "p8m3q3",
   "q": "You build a home lab with OWASP Juice Shop and Metasploitable to practice. What network setup keeps this lawful and contained?",
   "options": [
    "A host-only (isolated) network",
    "Bridged networking, so each practice VM receives a real routable address",
    "Port-forwarding to the VMs, so you can also reach the lab remotely when away",
    "Placing the vulnerable VMs inside the office DMZ for convenient shared access"
   ],
   "answer": 0,
   "why": "Deliberately vulnerable VMs must sit on an isolated host-only network so practice never touches real systems. Bridged addresses, port-forwarding, or a DMZ would expose intentionally broken machines to the live internet, which is dangerous and irresponsible."
  },
  {
   "id": "p8m3q4",
   "q": "A recruiter calls nmap and Metasploit 'hacker tools' and worries about using them. What is the honest framing?",
   "options": [
    "They are illegal tools that an operator must hold a special government license to run",
    "They are dual-use security tools; authorization makes their use legitimate",
    "They are only safe to use in their paid, commercially supported enterprise versions",
    "They are largely obsolete now, and serious modern testers have mostly abandoned them"
   ],
   "answer": 1,
   "why": "Scanners and exploitation frameworks are dual-use: defenders run the same tools to audit themselves first. It is authorization, not the tool, that determines legitimacy. They are standard security software, not contraband."
  },
  {
   "id": "p8m3q5",
   "q": "Which pairing of tool category to its standard example is correct?",
   "options": [
    "Network port scanner is best represented by the vulnerability tool Nessus",
    "Testing distribution is best represented by the framework called Metasploit",
    "Web proxy — Burp Suite",
    "Exploitation framework is best represented by the port scanner called nmap"
   ],
   "answer": 2,
   "why": "Burp Suite is the core web proxy for application testing. Nessus is a vulnerability scanner (nmap is the port scanner), Metasploit is the exploitation framework, and Kali/Parrot are the testing distributions."
  }
 ],
 "p8m4": [
  {
   "id": "p8m4q1",
   "q": "A test finds a high-severity flaw on an internal printer and a medium flaw on the public, internet-facing customer-login page that handles personal data. How should the report prioritize them?",
   "options": [
    "Printer first, because its raw technical severity score is the higher of the two",
    "Equal priority, since severity and business risk are really the same measurement",
    "List them alphabetically by asset name, to keep the report scrupulously neutral",
    "Login page first"
   ],
   "answer": 3,
   "why": "Risk is likelihood times impact and exposure, not raw severity alone. An internet-facing login handling customer data carries more real risk than a higher-scored internal printer. Turning raw findings into a risk-prioritized plan is the professional's job."
  },
  {
   "id": "p8m4q2",
   "q": "A finding reads only: 'Login page is vulnerable to injection. Fix it.' Which element most needed by the engineers who will fix it is missing?",
   "options": [
    "Reproduction evidence and concrete remediation guidance",
    "A short marketing-friendly summary written for the client's sales team",
    "The tester's list of professional certifications and training history",
    "The precise calendar start and end dates of the overall engagement"
   ],
   "answer": 0,
   "why": "A technical finding must be a self-contained unit: evidence that it is real and reproducible, plus specific remediation. Without those, an engineer cannot verify or fix it. The vague one-liner is exactly what gets a report ignored."
  },
  {
   "id": "p8m4q3",
   "q": "After the client fixes the reported issues, what closes the loop on a good engagement?",
   "options": [
    "Issuing a press release that announces the successful test to the public",
    "A retest to verify the fixes worked",
    "Deleting the report entirely, on the grounds of client confidentiality",
    "Immediately selling the client a much larger follow-on test of everything"
   ],
   "answer": 1,
   "why": "A retest confirms remediation was effective, closing the engagement. Helping the team understand root causes prevents whole classes of issues. The trusted-advisor relationship, not publicity, is what earns repeat work."
  },
  {
   "id": "p8m4q4",
   "q": "Someone with no certifications wants to break into pentesting. Which path matches the field's recommended order?",
   "options": [
    "Take the hands-on OSCP exam first, then go back and learn the fundamentals later",
    "Skip certifications altogether, on the theory that only a university degree matters",
    "Build defensive fundamentals and Security+, practice on legal labs, then a pentest cert",
    "Earn CEH first because HR filters ask for it, and treat that as a complete career"
   ],
   "answer": 2,
   "why": "Most pentesters start in defense, earn Security+ and fundamentals, practice on legal labs, then add a pentest cert, with OSCP as a later hands-on milestone, not a starting point. The field rewards a demonstrable practice record and a clean reputation."
  },
  {
   "id": "p8m4q5",
   "q": "Why does the executive summary of a pentest report avoid technical jargon?",
   "options": [
    "Because leadership is assumed to be unable to grasp any technical terminology at all",
    "Because including jargon would simply make the overall document too long to read",
    "Because the underlying technical details are deliberately kept secret from the client",
    "Because its audience is leadership deciding on risk and resources in business terms"
   ],
   "answer": 3,
   "why": "The report has two audiences: the executive summary serves leadership, who need risk posture and business impact in plain language to prioritize and fund fixes. The technical findings serve the engineers. Clarity for each audience is a core professional skill."
  }
 ]
});
Object.assign(window.LQ,{
 "p11m1": [
  {
   "id": "p11m1q1",
   "q": "A developer wants to reverse-engineer a commercial game's DRM so he can strip the copy protection and resell the game. Which statement is correct?",
   "options": [
    "Stripping the protection to clone and resell it is on the wrong side of the line",
    "It is legal, since he lawfully bought and owns at least one genuine copy of the game",
    "It is legal as long as he only ever shares the result with a small circle of friends",
    "It is fine, because reverse engineering is a long-established and legitimate discipline"
   ],
   "answer": 0,
   "why": "Analyzing programs you may lawfully analyze is legitimate; defeating a product's protections to clone and resell it is piracy and crosses the DMCA/license boundary. Owning a copy or limiting sharing does not change that the purpose is unlawful."
  },
  {
   "id": "p11m1q2",
   "q": "You receive a live malware sample to analyze. Which lab setup follows the containment discipline an employer expects?",
   "options": [
    "Run it on your own laptop, but only after switching the Wi-Fi off first",
    "An isolated VM with host-only or no networking, snapshotted, then reverted",
    "Run it on a spare physical machine that is still plugged into the office LAN",
    "Run it in a VM with shared folders enabled so results copy out to the host easily"
   ],
   "answer": 1,
   "why": "Live malware is handled like hazardous material: an isolated VM with host-only or no network, a clean snapshot before detonation, and a revert after, with shared folders and clipboard off. Disconnecting Wi-Fi on your real machine or using the office LAN still risks the host and the network."
  },
  {
   "id": "p11m1q3",
   "q": "A beginner opens a stripped binary in Ghidra, reads the decompiled C-like output, and assumes it is the original source code. What is wrong with that assumption?",
   "options": [
    "The decompiler can only ever show raw assembly instructions, never any C-like code",
    "Decompilation only ever works on programs that were already open-source to begin with",
    "Decompilation is an approximation; original names, comments and structure are lost",
    "Decompilation perfectly recovers the exact source, but only when the binary is 64-bit"
   ],
   "answer": 2,
   "why": "A decompiler produces readable pseudocode, not the original source: variable names, comments and some structure are gone, and it can guess wrong. The real skill is reading that approximation, which is why the field trains fundamentals, not just tool output."
  },
  {
   "id": "p11m1q4",
   "q": "Which of these is a legitimate target to practice reverse engineering on, fully within the law?",
   "options": [
    "A rival vendor's licensed app, examined to understand how its best features work",
    "A streaming service's DRM module, inspected purely to see how the scheme operates",
    "A neighbor's router firmware that you pulled off the shared network yesterday",
    "A purpose-built crackme challenge"
   ],
   "answer": 3,
   "why": "Crackmes and CTF challenges are built expressly for legal RE practice, alongside your own programs and open-source software. Reversing a licensed competitor's app, a DRM scheme, or someone else's device firmware you are not authorized to study crosses the Module 1 line."
  },
  {
   "id": "p11m1q5",
   "q": "Two analysts use the same AI RE assistant on the same unknown binary. One steers it well and catches its errors; the other accepts confident nonsense. What accounts for the difference?",
   "options": [
    "The first understands assembly, calling conventions and control-flow graphs",
    "The first happened to be running the assistant on noticeably faster local hardware",
    "The first quietly disabled the assistant's built-in safety and content filtering",
    "The first analyst had simply paid for the more capable premium version of the model"
   ],
   "answer": 0,
   "why": "AI assistants multiply skill; they do not replace it. Only someone who can read assembly and understand calling conventions and CFGs can tell a correct explanation from a plausible-but-wrong one. That is why the domain teaches fundamentals first and the AI layer last."
  }
 ],
 "p11m2": [
  {
   "id": "p11m2q1",
   "q": "On 64-bit Linux (System V ABI), a function is called with three integer arguments. Which registers hold the first three, in order?",
   "options": [
    "RAX, then RBX, then RCX, which are the first three general-purpose registers listed",
    "RDI, RSI, RDX",
    "RCX, then RDX, then R8, exactly as the 64-bit Windows calling convention specifies",
    "RBP, then RSP, then RIP, the frame, stack and instruction pointers in sequence"
   ],
   "answer": 1,
   "why": "The System V ABI passes the first six integer arguments in RDI, RSI, RDX, RCX, R8, R9. RCX, RDX, R8, R9 is the 64-bit Windows convention. RAX holds the return value; RBP/RSP/RIP are frame, stack and instruction pointers."
  },
  {
   "id": "p11m2q2",
   "q": "You see this at the top of a function: push rbp ; mov rbp, rsp ; sub rsp, 0x20. What is happening?",
   "options": [
    "The function is tearing down its frame and returning control to its caller",
    "Two of the function's arguments are being compared to set the condition flags",
    "A function prologue is setting up a stack frame and reserving 32 bytes of locals",
    "The program is dispatching to a hardware interrupt handler elsewhere in memory"
   ],
   "answer": 2,
   "why": "That is the classic prologue: save the old base pointer, set a new frame pointer, and subtract from RSP to reserve local space (0x20 = 32 bytes). The epilogue (leave; ret) tears it down. Recognizing prologues locates function starts even when symbols are stripped."
  },
  {
   "id": "p11m2q3",
   "q": "In a disassembly you read: cmp eax, 0 ; je 0x4011a0. When does execution jump to 0x4011a0?",
   "options": [
    "Always, because je after a cmp is really just an unconditional jump in disguise",
    "Whenever the value currently held in EAX is a negative (signed) number",
    "Whenever the value currently held in EAX is strictly greater than zero",
    "When EAX equals 0"
   ],
   "answer": 3,
   "why": "cmp sets the flags as if subtracting 0 from EAX; je ('jump if equal') takes the branch when the zero flag is set, i.e. when EAX equals 0. A chain of cmp/je against byte values is the signature of an input or password check."
  },
  {
   "id": "p11m2q4",
   "q": "After the instruction call strlen executes, where would you look for the length it returned?",
   "options": [
    "In RAX",
    "In RIP, the register that holds the address of the next instruction to run",
    "On the top of the stack, where return values are pushed before the ret runs",
    "In RSP, the register that always points at the current top of the stack"
   ],
   "answer": 0,
   "why": "By convention a function's integer return value comes back in RAX. RSP points at the top of the stack, RIP holds the next instruction address, and arguments beyond the register-passed ones live on the stack, not the return value."
  },
  {
   "id": "p11m2q5",
   "q": "A learner frets that reverse engineering means memorizing hundreds of assembly instructions. Why is that overblown?",
   "options": [
    "Modern disassemblers now translate every instruction directly into plain English for you",
    "You read, not write, and a few dozen common instructions cover most code",
    "Assembly is effectively identical across every CPU architecture, so one set covers all",
    "The decompiler removes any need to ever look at assembly instructions again at all"
   ],
   "answer": 1,
   "why": "You read assembly rather than write it, and a small core (mov, cmp, the jumps, call/ret, push/pop, add/sub, lea) covers the vast majority of what you meet. You drop to the assembly only where the decompiled pseudocode looks wrong, not everywhere."
  }
 ],
 "p11m3": [
  {
   "id": "p11m3q1",
   "q": "You are handed an unknown 64-bit ELF. Before loading it into a disassembler, which sequence of triage steps orients you fastest and for free?",
   "options": [
    "Run the binary immediately and watch what effects it has on the system",
    "Set a breakpoint at main and painstakingly single-step through the whole program",
    "file, then strings, then the import table",
    "Compute its byte entropy, note the number, and consider the triage finished there"
   ],
   "answer": 2,
   "why": "Static triage leads: file gives format and architecture, strings dumps readable text and URLs, and the import table reveals which library functions it calls. These form hypotheses in minutes before you open a disassembler, and without the risk of running it."
  },
  {
   "id": "p11m3q2",
   "q": "In a control-flow graph, one basic block splits with two outgoing arrows that later rejoin. What structure does that shape usually represent?",
   "options": [
    "A read-only string table that the surrounding code happens to index into",
    "An unconditional jump that simply relocates execution to one fixed target address",
    "A function call that transfers control out and then returns to the following block",
    "An if/else branch"
   ],
   "answer": 3,
   "why": "A block splitting into two paths that rejoin (a diamond) is an if/else. A back-edge cycling upward is a loop; one block fanning out to many is a switch. Reading these shapes, not line-by-line assembly, is the productive pace."
  },
  {
   "id": "p11m3q3",
   "q": "strings reveals the text 'Enter license key:' in a binary. What is the fastest way to reach the code that uses it?",
   "options": [
    "Cross-reference (xref) the string",
    "Run the program and type a key, then try to guess which function handled it",
    "Scroll through the disassembly listing until you happen to spot it by eye",
    "Rename every function in the database first, then search for the string again"
   ],
   "answer": 0,
   "why": "An xref answers 'what code uses this string?' and jumps you straight to the function that prints it, and from there to the logic that decides. The 'find a string, xref to its user' move is the fastest way into an unknown binary."
  },
  {
   "id": "p11m3q4",
   "q": "While reading decompiled pseudocode for speed, a section looks suspicious and does not match what the program seems to do. What should you do?",
   "options": [
    "Trust the pseudocode anyway, since the decompiler's output is authoritative by design",
    "Drop to the assembly for that section and verify it directly",
    "Assume the entire binary must simply be corrupt and abandon the analysis session",
    "Delete the questionable function from the database and carry on with the rest"
   ],
   "answer": 1,
   "why": "The decompiler's output is a lossy approximation that can be wrong. The expert reads pseudocode for speed but drops to the faithful assembly whenever it looks suspicious. The two views are complementary; you never trust the pseudocode blindly."
  },
  {
   "id": "p11m3q5",
   "q": "What is the real, reusable deliverable of a thorough static analysis session in a tool like Ghidra?",
   "options": [
    "A single screenshot of the program's entry point as it first appears on load",
    "A raw hex dump of every byte contained in the binary's .text code section",
    "The richly annotated database of renamed functions, comments and defined types",
    "A flat list of every machine instruction in the binary printed in address order"
   ],
   "answer": 2,
   "why": "Static analysis is iterative: as you understand functions you rename them, comment and define data types, each pass easing the next. The finished, annotated database capturing that understanding is the analyst's real work product."
  }
 ],
 "p11m4": [
  {
   "id": "p11m4q1",
   "q": "A sample's command-and-control address is encrypted on disk, so strings shows nothing and the code just calls a decrypt routine on a blob. Inside the safe VM, what is usually the fastest way to read the plaintext address?",
   "options": [
    "Reverse the cryptographic algorithm by hand, reading it out of the assembly",
    "Upload the whole sample to an online translation service and read what it returns",
    "Rename the decrypt function in the database and then run strings over the file again",
    "Breakpoint just after the decrypt call and read the buffer"
   ],
   "answer": 3,
   "why": "Dynamic analysis shines here: the string is plaintext in memory once the program decrypts it, so set a breakpoint right after the decrypt routine and read the buffer. Reversing the crypto by hand is far slower; strings still sees only the encrypted form."
  },
  {
   "id": "p11m4q2",
   "q": "You want to catch exactly which code modifies a particular global variable during execution. Which debugger feature is designed for that?",
   "options": [
    "A watchpoint on that memory location",
    "A breakpoint placed at the program's entry point so you can watch it start up",
    "The practice of stepping over every call and reading registers after each one",
    "Patching the variable to zero and seeing whether the program's behavior changes"
   ],
   "answer": 0,
   "why": "A watchpoint pauses execution when a specific memory location changes, catching whoever writes it. An entry breakpoint only pauses at the start; stepping over every call would be impossibly slow; patching changes behavior rather than observing it."
  },
  {
   "id": "p11m4q3",
   "q": "A new analyst claims static analysis makes dynamic analysis unnecessary. Why is that wrong?",
   "options": [
    "Dynamic analysis is simply always faster than static analysis in every case",
    "They are complementary: static finds the spot, dynamic reveals runtime values",
    "Static analysis is fundamentally unable to read any of the strings inside a file",
    "Dynamic analysis never requires an isolated lab, so there is no reason to skip it"
   ],
   "answer": 1,
   "why": "The two are complementary, not redundant. Static maps the code and finds the right spot; dynamic reveals runtime values and behavior static cannot predict, such as a decrypted config. The daily rhythm is static to find, dynamic to read."
  },
  {
   "id": "p11m4q4",
   "q": "Which of these is purely behavioral (as opposed to instruction-level) analysis of a running sample?",
   "options": [
    "Single-stepping through the sample's decrypt routine one instruction at a time",
    "Reading the value held in RAX at a carefully chosen breakpoint address",
    "Observing which files, registry keys and network connections it creates",
    "Setting a watchpoint on a buffer to see precisely when its contents change"
   ],
   "answer": 2,
   "why": "Behavioral analysis observes the sample's effects on the system, files created, registry keys set, processes spawned, connections attempted, with monitoring tools. Single-stepping, reading registers and watchpoints are instruction-level debugging. Behavior tells you what it does; code analysis tells you how."
  },
  {
   "id": "p11m4q5",
   "q": "When may a malware sample be run under a live debugger during dynamic analysis?",
   "options": [
    "On your normal working machine, provided you finish the session quickly enough",
    "On the shared office test server, but only once everyone has gone home for the day",
    "On any machine at all, as long as your antivirus signatures are fully up to date",
    "Only inside the isolated, snapshotted VM"
   ],
   "answer": 3,
   "why": "Dynamic work with live malware happens only inside the isolated lab: host-only or simulated networking, a clean snapshot before detonation, revert after. 'Quickly on my own machine' is exactly the mistake the containment rule exists to prevent."
  }
 ],
 "p11m5": [
  {
   "id": "p11m5q1",
   "q": "A file shows almost no readable strings, only two imports, and an entropy around 7.9 bits/byte. Before disassembling anything, what does this profile most strongly suggest?",
   "options": [
    "The program is packed",
    "The program is simply very small and genuinely does almost nothing of interest",
    "The file is just a plain-text configuration script with no executable code at all",
    "The file was corrupted during download and the bytes are effectively random noise"
   ],
   "answer": 0,
   "why": "Near-maximal entropy with few strings and few imports is the classic signature of packing: the real code is compressed or encrypted behind a stub. An empty import table often means API hashing or packing is hiding the real imports, a red flag, not a sign the program does little."
  },
  {
   "id": "p11m5q2",
   "q": "A UPX-style packer wraps a program. What is the usual analyst response to get at the real code?",
   "options": [
    "Painstakingly break the compression algorithm by hand, entirely offline",
    "Let the unpacking stub run in the debugger, then dump the real code from memory",
    "Delete the stub section out of the file and hope the original code runs anyway",
    "Rename the entry-point function and assume the packing problem is now solved"
   ],
   "answer": 1,
   "why": "Unpacking is typically dynamic: let the stub unpack the original into memory, then dump it. Breaking the compression by hand is unnecessary work, and removing a section just corrupts the file. Once dumped, strings and imports reappear."
  },
  {
   "id": "p11m5q3",
   "q": "A sample checks whether a debugger is attached, looks for VM artifacts like specific drivers and low uptime, then goes dormant. To a defender, what does this behavior most indicate?",
   "options": [
    "The sample is almost certainly a legitimate, properly licensed commercial application",
    "The sample is poorly written and, because it mostly sleeps, essentially harmless",
    "It is strong evidence the sample is malicious",
    "The analysis virtual machine itself must be badly misconfigured in some way"
   ],
   "answer": 2,
   "why": "Benign software has no reason to hide from a debugger or detect a VM and play dead. Heavy anti-debugging and anti-VM behavior is itself a confession of malicious intent, part of the verdict, not merely an obstacle to analysis."
  },
  {
   "id": "p11m5q4",
   "q": "Which description correctly matches an anti-analysis technique to what it does?",
   "options": [
    "API hashing compresses the entire file down to a much smaller size on disk",
    "String encryption works by resolving each library call through a runtime hash value",
    "Opaque predicates helpfully list every imported function right in the file header",
    "Control-flow flattening replaces clean structure with a dispatcher loop"
   ],
   "answer": 3,
   "why": "Control-flow flattening hides structure behind a dispatcher loop, wrecking the CFG's readability. API hashing hides imports by resolving them via runtime hashes; string encryption decodes strings only at use; opaque predicates are junk branches that never vary."
  },
  {
   "id": "p11m5q5",
   "q": "In a PE file, which section typically holds the executable code the CPU runs?",
   "options": [
    ".text",
    ".data, the section reserved for the program's initialized global data values",
    ".rsrc, which is where the program keeps its icons, dialogs and other resources",
    ".rdata, the read-only area that stores strings and the import address table"
   ],
   "answer": 0,
   "why": ".text holds the code. .data holds initialized data, .rdata read-only data such as strings and the import table, and .rsrc the resources. Parsing the header's sections, entry point and imports gives you the skeleton to analyze against."
  }
 ],
 "p11m6": [
  {
   "id": "p11m6q1",
   "q": "You build a malware analysis lab. Which pairing of ready-made analyst environments is correct?",
   "options": [
    "Kali as the Linux analysis box paired with Metasploitable as the Windows box",
    "REMnux (Linux) and FLARE-VM (Windows toolkit)",
    "Juice Shop running on Linux paired with DVWA running on the Windows machine",
    "Ghidra used as the Linux environment and IDA Pro used as the Windows environment"
   ],
   "answer": 1,
   "why": "REMnux is a Linux distro preloaded with analysis tools; FLARE-VM is a scripted Windows analyst toolkit. The others are web-pentest practice targets or disassemblers, not the standard malware-analysis environments. Networking is host-only or simulated with INetSim/FakeNet."
  },
  {
   "id": "p11m6q2",
   "q": "You receive an unknown sample. Following the four-stage methodology, which should you do first?",
   "options": [
    "Debug through its anti-analysis defenses and decrypt the embedded configuration",
    "Disassemble it in Ghidra straight away to read the core algorithms line by line",
    "Basic static triage: hash it, check intel, read strings and imports, check packing",
    "Dump the fully unpacked payload out of memory using the advanced dynamic stage"
   ],
   "answer": 2,
   "why": "The first stage is basic static triage: compute the hash and check threat-intel databases (someone may have analyzed it), then strings, imports and a packing check. Advanced static and dynamic work come later, and you cycle between stages as findings accumulate."
  },
  {
   "id": "p11m6q3",
   "q": "What is the real, reusable deliverable of a malware analysis, the thing that protects a whole fleet?",
   "options": [
    "A readable narrative story describing everything the malware was observed doing",
    "A high-resolution screenshot of the decompiler view of the main routine",
    "An archived copy of the original sample kept for the team's future reference",
    "Detection: IOCs and a YARA rule"
   ],
   "answer": 3,
   "why": "The output is detection, not a story: indicators of compromise (hashes, C2 domains, registry keys) and a YARA rule matching the family's stable byte patterns, mapped to MITRE ATT&CK. That is how one analysis lets every defender detect the family."
  },
  {
   "id": "p11m6q4",
   "q": "A YARA rule is written against which kind of artifact so defenders can detect a malware family across many machines?",
   "options": [
    "Chosen strings or byte sequences that appear in the family's files",
    "The network round-trip latency the sample exhibits when it beacons to its server",
    "The exact wall-clock timestamp at which the sample was first observed in the wild",
    "The analyst's written notes speculating about the author's likely motive and origin"
   ],
   "answer": 0,
   "why": "YARA is a signature language that matches files containing chosen strings or byte sequences. Writing a rule on a family's stable, unique patterns (often from the unpacked sample) lets defenders detect it fleet-wide. Latency, timestamps and motive are not matchable file content."
  },
  {
   "id": "p11m6q5",
   "q": "During detonation a sample drops a file in AppData, sets a Run registry key, and beacons to two domains. Which malware category does setting a Run key most directly illustrate?",
   "options": [
    "Self-propagation across the network in the manner of a classic worm",
    "Persistence",
    "The file-encryption behavior that is the defining trait of ransomware families",
    "The deep operating-system hiding that characterizes a kernel-level rootkit"
   ],
   "answer": 1,
   "why": "A Run key makes the malware restart at logon, which is persistence. The dropped file and beaconing are separate behaviors; encrypting files would signal ransomware and deep hiding would signal a rootkit. Recognizing the behavior tells you what to look for next."
  }
 ],
 "p11m7": [
  {
   "id": "p11m7q1",
   "q": "A learner on a tight budget wants one professional-grade disassembler/decompiler suite to start with, free and well-documented. Which fits best?",
   "options": [
    "IDA Pro, the long-time commercial standard with the fastest overall workflow",
    "Binary Ninja, the modern, highly scriptable suite with a clean intermediate view",
    "Ghidra",
    "x64dbg, the free and widely used Windows user-mode debugging application"
   ],
   "answer": 2,
   "why": "Ghidra is free, open-source, has a strong decompiler and the free GhidraClass course, making it the best starting suite. IDA Pro and Binary Ninja are paid; x64dbg is a Windows debugger, not a disassembler/decompiler suite."
  },
  {
   "id": "p11m7q2",
   "q": "What does Frida do that a classic disassembler does not?",
   "options": [
    "It cryptographically signs compiled binaries so that a release can be verified later",
    "It statically reconstructs a binary's full control-flow graph without running it",
    "It compresses finished executables down to a smaller on-disk footprint for shipping",
    "It injects scripts into a running process to hook and log calls live"
   ],
   "answer": 3,
   "why": "Frida is a dynamic instrumentation toolkit: it injects scripts into a live process to hook and log calls, excellent for mobile and app analysis. Mapping the CFG statically is the disassembler's job; packing and signing are unrelated."
  },
  {
   "id": "p11m7q3",
   "q": "An analyst must triage thousands of samples and auto-rename functions by pattern. What makes this practical?",
   "options": [
    "Scripting a major tool's API (Ghidra scripts, r2pipe, Binary Ninja)",
    "Buying additional monitors so more of the analysis fits on the screen at once",
    "Patiently clicking through every single sample one at a time by hand",
    "Detonating every one of the samples live, all at the same time, to save hours"
   ],
   "answer": 0,
   "why": "Serious RE is scripted: every major tool exposes an API, so repetitive work (batch triage, auto-renaming, config extraction) becomes a short loop. Hand-clicking does not scale, and detonating thousands of live samples at once is reckless, not a workflow."
  },
  {
   "id": "p11m7q4",
   "q": "A Ghidra AI assistant labels a dense routine 'RC4 key scheduling.' What is the professional stance toward that answer?",
   "options": [
    "Accept it on faith, because the model has read far more code than any person could",
    "Verify it against the assembly yourself",
    "Rename the function to match and move on without reading the routine at all",
    "Reject all AI output outright, since none of it can ever be trusted even a little"
   ],
   "answer": 1,
   "why": "AI explanations can be confidently wrong and can be baited by obfuscated code. The right stance is to confirm the claim against the assembly, which you can only do if you know the fundamentals. AI makes a good analyst faster, not a novice safe."
  },
  {
   "id": "p11m7q5",
   "q": "Does adding an AI-assisted RE tool change which binaries you are allowed to analyze?",
   "options": [
    "Yes, these assistants generally come bundled with broad rights to analyze anything",
    "Yes, but the expanded permission only covers binaries that are already open-source",
    "No, the authorization and legality line applies identically whatever drives the tool",
    "No, and the reason is simply that AI tools cannot actually read binaries at all yet"
   ],
   "answer": 2,
   "why": "The authorization/legality boundary from Module 1 holds no matter what tool you use; an assistant does not expand what you may lawfully analyze. The point of the whole domain is fundamentals and legality first, with AI as a late accelerator."
  }
 ]
});
Object.assign(window.LQ,{
 "p31m1": [
  {
   "id": "p31m1q1",
   "q": "A booking app's admin page checks a cookie role=owner that the login handler set, and anyone can edit that cookie in their browser. Which fix follows the application-security axiom?",
   "options": [
    "Set the role cookie with the HttpOnly flag so client scripts cannot read it",
    "Obfuscate the cookie name so an attacker cannot guess which cookie to edit",
    "Sign the cookie with base64 encoding so tampering becomes visibly obvious",
    "Re-derive the role per request from a server-side session, never from the cookie"
   ],
   "answer": 3,
   "why": "The client is hostile and the server is the only place a decision can be enforced: authorization must come from server-held session state, not a client-supplied claim. HttpOnly, obfuscation and base64 do not stop the user from choosing their own role value."
  },
  {
   "id": "p31m1q2",
   "q": "A payment API accepts the item price as a field in the request body and charges that amount. Running STRIDE on it, which threat is this, and what is the fix?",
   "options": [
    "Tampering; recompute the price server-side from the catalog",
    "Spoofing; require the user to log in again before paying",
    "Repudiation; add an append-only audit log of each payment",
    "Information disclosure; encrypt the price field in transit"
   ],
   "answer": 0,
   "why": "Trusting a client-supplied price is Tampering with data crossing into the server's trust zone; the fix is to recompute the amount server-side from authoritative data. Logging addresses repudiation and TLS addresses disclosure, but neither stops the client from changing the charge."
  },
  {
   "id": "p31m1q3",
   "q": "Why is broken access control, not injection, the category a plain vulnerability scanner is least able to find?",
   "options": [
    "Scanners cannot send authenticated requests to protected endpoints at all",
    "Access control is a question of meaning only a human who knows intent can ask",
    "Scanners are deliberately configured to skip authorization tests for safety",
    "Access-control flaws leave no trace in the HTTP response for a tool to match"
   ],
   "answer": 1,
   "why": "A scanner matches patterns; it cannot know that user A should not see user B's invoice or that a step was skipped. Broken access control tops the list because intent is invisible to tools. Scanners can authenticate and do leave responses, so those reasons are wrong."
  },
  {
   "id": "p31m1q4",
   "q": "A developer argues 'we serve everything over HTTPS, so the application is secure.' Why is that reasoning flawed?",
   "options": [
    "HTTPS is too slow, so most teams quietly disable it under real load",
    "HTTPS only protects stored data, never data moving across the network",
    "TLS protects the pipe, but the attacker is the client speaking perfect HTTPS",
    "HTTPS certificates expire, so the protection lapses without anyone noticing"
   ],
   "answer": 2,
   "why": "TLS secures the channel between client and server; it does nothing about a hostile client who sends malicious input over a perfectly encrypted connection. HTTPS protects data in transit (not only at rest), and the flaw is conceptual, not about speed or expiry."
  },
  {
   "id": "p31m1q5",
   "q": "A tester intercepts a request in a proxy and removes a field the page's JavaScript marked required, then forwards it. The server accepts it. What lesson does this illustrate?",
   "options": [
    "The proxy introduced a bug that would not occur in a normal browser",
    "Interception only works against sites that lack a Content Security Policy",
    "The JavaScript must have been written incorrectly for that one field",
    "Client-side validation is a suggestion the attacker is free to ignore"
   ],
   "answer": 3,
   "why": "Client-side code is published and runs on the attacker's machine; an intercepting proxy edits the request after any JavaScript checks pass. Validation must be enforced server-side. This is normal attacker behavior, not a proxy artifact or a one-off coding slip."
  }
 ],
 "p31m2": [
  {
   "id": "p31m2q1",
   "q": "Code builds a query as \"SELECT id FROM users WHERE name = '\" + name + \"'\". What is the structural fix, and why not just escape the quotes?",
   "options": [
    "Use a parameterized query so values travel separately from the SQL text",
    "Escape every quote in name before concatenating it into the statement string",
    "Reject any input that contains a single-quote character anywhere in it",
    "Run the database under a lower-privilege account so damage is limited"
   ],
   "answer": 0,
   "why": "Parameterization sends the SQL first with placeholders and binds values as data, removing the confusion structurally. Escaping is a fragile filter with encoding edge cases; blocking quotes breaks legitimate names; least privilege limits blast radius but does not prevent the injection."
  },
  {
   "id": "p31m2q2",
   "q": "A reporting feature lets users pick the sort column and direction, which become part of an ORDER BY clause. Why can't a bound parameter alone secure this, and what is the right approach?",
   "options": [
    "It can; simply bind the column name as a normal query parameter like any value",
    "Identifiers cannot be parameters, so map the user's choice through an allowlist",
    "Disable sorting entirely, because ORDER BY can never be made safe in any form",
    "Concatenate the column name but wrap the whole query in a try/except block"
   ],
   "answer": 1,
   "why": "Placeholders bind values, not SQL identifiers like table or column names and keywords, so a bound parameter cannot carry a column. Map the user's choice through an allowlist dictionary of permitted columns. Sorting is fine when the identifier is validated this way."
  },
  {
   "id": "p31m2q3",
   "q": "A page saves a user's comment and later renders it to other visitors; the comment contains a script that then runs in those visitors' browsers. Which XSS type is this?",
   "options": [
    "Reflected XSS, because the input is echoed straight back in the response",
    "DOM-based XSS, because client JavaScript wrote it to a dangerous sink",
    "Stored XSS",
    "Server-side template injection, because the engine rendered the comment"
   ],
   "answer": 2,
   "why": "Data saved earlier and rendered to other users later is stored XSS. Reflected XSS appears in the immediate response to the same request; DOM-based never involves the server storing or reflecting it; template injection is the input becoming the template itself, not a value in it."
  },
  {
   "id": "p31m2q4",
   "q": "User-supplied text is placed inside a JavaScript string literal in the page. Which output-handling choice safely neutralizes it for that context?",
   "options": [
    "HTML-entity-encode the angle brackets and ampersands in the text",
    "Percent-encode the whole value as though it were part of a URL",
    "Wrap the value in single quotes and trust the browser to parse it",
    "Unicode-escape it, or pass it as JSON in a script-type data block"
   ],
   "answer": 3,
   "why": "A JavaScript string context needs \\uXXXX escaping, or better, delivering the data as JSON in a <script type=\"application/json\"> block. HTML-entity encoding is for an HTML body context and percent-encoding is for URLs; neither is safe inside a JS string, and quoting alone does not escape breakouts."
  },
  {
   "id": "p31m2q5",
   "q": "A service calls pickle.loads() on data received from clients. Why is this dangerous even if the data 'looks like' a normal object?",
   "options": [
    "Deserializing untrusted pickle is remote code execution by documented design",
    "Pickle data is always much larger, so it will exhaust the server's memory",
    "Pickle cannot represent nested objects, so it will crash on complex inputs",
    "Pickle stores data in cleartext, so an attacker can read other users' objects"
   ],
   "answer": 0,
   "why": "In pickle the bytes decide which classes are instantiated and which methods run while rebuilding, so loading untrusted input is code execution by design. The fix is a data-only format (JSON, protobuf) with schema validation, or signing native objects and allowlisting classes."
  }
 ],
 "p31m3": [
  {
   "id": "p31m3q1",
   "q": "A team stores user passwords with a single fast SHA-256 and no salt, reasoning 'SHA-256 is cryptographically strong.' Why is this still the vulnerability?",
   "options": [
    "SHA-256 is reversible, so an attacker simply decrypts the stored values",
    "A fast, unsalted hash lets a GPU try billions of guesses and reuse rainbow tables",
    "SHA-256 produces collisions often enough that two passwords will clash",
    "SHA-256 output is too short to store a long password securely at all"
   ],
   "answer": 1,
   "why": "Speed is the problem: a GPU tries billions of fast hashes per second, and no salt means precomputed rainbow tables work and identical passwords share a hash. Use a slow, salted, memory-hard function (Argon2id, bcrypt, scrypt). SHA-256 is not reversible, so 'decrypt' is wrong."
  },
  {
   "id": "p31m3q2",
   "q": "An app wants the structural defense against CSRF on its state-changing requests. Which cookie attribute provides it?",
   "options": [
    "The Secure flag, which keeps the cookie off plaintext HTTP connections",
    "The HttpOnly flag, which hides the cookie from page JavaScript",
    "SameSite=Lax or Strict",
    "The __Host- prefix, which binds the cookie to one exact hostname"
   ],
   "answer": 2,
   "why": "SameSite=Lax or Strict stops the cookie from riding along on cross-site requests, which is the structural CSRF defense. Secure protects confidentiality in transit, HttpOnly limits XSS theft, and __Host- binds scope; none of those stop a cross-site forged request."
  },
  {
   "id": "p31m3q3",
   "q": "GET /api/invoice/1042 returns the invoice because the server looks it up by ID without checking who owns it; changing 1042 to 1043 reveals a stranger's invoice. What is the real fix?",
   "options": [
    "Replace the sequential ID with an unguessable random UUID in the URL",
    "Return 403 instead of 200 so the attacker learns nothing useful",
    "Move the invoice ID from the URL path into a request header instead",
    "Enforce an ownership check server-side: match the record to the session's user"
   ],
   "answer": 3,
   "why": "The flaw is a missing ownership check, not a visible ID; the fix is to authorize against server-held identity, e.g. WHERE id=? AND owner_id=?. UUIDs are only defense in depth, moving the ID elsewhere hides nothing, and a 403 still leaks that the record exists."
  },
  {
   "id": "p31m3q4",
   "q": "A server verifies RS256 JWTs but calls a verify routine that honors the alg field inside the token. How should the algorithm be chosen to prevent algorithm-confusion attacks?",
   "options": [
    "Pin the accepted algorithm in server code and ignore the token's alg field",
    "Allow alg: none only for tokens issued to trusted internal services",
    "Accept whatever alg the token's header specifies, for maximum compatibility",
    "Rotate the signing algorithm on every request so none can be predicted"
   ],
   "answer": 0,
   "why": "Reading alg from the token lets an attacker force the server to verify an RS256 token as HMAC using the public key as the secret. Pin the algorithm server-side and never trust the token's alg. Accepting the header's value, or ever allowing none, is the vulnerability."
  },
  {
   "id": "p31m3q5",
   "q": "A developer plans to 'instantly log out' users by expecting a stateless JWT to be revoked on demand. Why does that not work, and what is the remedy?",
   "options": [
    "JWTs cannot be logged out at all, so sessions must last forever once issued",
    "A stateless JWT is valid until it expires; use a denylist or short-lived tokens",
    "Logging out requires deleting the signing key, which invalidates every token",
    "JWTs are revoked instantly already, so the concern is simply unfounded"
   ],
   "answer": 1,
   "why": "A stateless JWT stays valid until its exp regardless of 'logout', so instant revocation needs a server-side denylist or short-lived access tokens with refresh tokens. Deleting the signing key would break all users, and JWTs are not revocable by default."
  }
 ],
 "p31m4": [
  {
   "id": "p31m4q1",
   "q": "To read your own app's HTTPS traffic in Burp you install Burp's CA certificate. A teammate calls this 'a hacking step.' What is the accurate description?",
   "options": [
    "It secretly weakens TLS for every site the whole network connects to",
    "It installs a backdoor that lets Burp intercept other people's machines too",
    "It makes your own machine trust your own proxy so you can read your own traffic",
    "It only works because the target site has a misconfigured certificate chain"
   ],
   "answer": 2,
   "why": "Installing the proxy CA makes your own device trust your own proxy so it can decrypt traffic you are already handling; it grants no access to anything and is pointless on a device you do not own. It does not weaken other sites or other machines."
  },
  {
   "id": "p31m4q2",
   "q": "You want to send one request repeatedly with small manual edits, reading each response and thinking, where most real testing happens. Which Burp tool is that?",
   "options": [
    "Scanner, the automated crawl-and-audit engine in the Professional edition",
    "Intruder, which automates a request across a set of payload positions",
    "Decoder, which transforms data between encodings for inspection",
    "Repeater"
   ],
   "answer": 3,
   "why": "Repeater sends a single request over and over with precise manual edits, which is where most skilled testing happens. Scanner automates auditing, Intruder automates across payload sets, and Decoder just transforms encodings; none is the manual edit-and-resend tool."
  },
  {
   "id": "p31m4q3",
   "q": "A GraphQL endpoint has introspection enabled. What does that hand a tester, and why does it matter?",
   "options": [
    "The entire typed schema of every type, field and operation",
    "A list of currently logged-in users and their active session tokens",
    "Full administrative access to run any mutation without authorization",
    "The server's source code for each resolver function behind the API"
   ],
   "answer": 0,
   "why": "Introspection exposes the complete schema, every type, field and operation, which maps the whole API. It does not reveal sessions, source code, or grant admin rights. Authorization must still be enforced per field or resolver regardless of introspection."
  },
  {
   "id": "p31m4q4",
   "q": "A beginner says 'I need Burp Suite Professional before I can start learning web testing.' What is the accurate counterpoint?",
   "options": [
    "Only Professional can intercept HTTPS traffic, so it is genuinely required",
    "Community edition plus the free Academy teaches almost all of it manually",
    "You cannot test anything meaningful without the automated Scanner's output",
    "ZAP is the only free option, and it cannot do manual interception at all"
   ],
   "answer": 1,
   "why": "Community edition's manual proxy and Repeater, together with the free Web Security Academy, teach nearly all the skill, which is mostly manual. Professional mainly adds the Scanner, full-speed Intruder and the BSCP exam. Community intercepts HTTPS fine, and ZAP also does manual work."
  },
  {
   "id": "p31m4q5",
   "q": "During authorized recon of your own scope, where is a fast, free place to discover API endpoints and parameter names the app uses?",
   "options": [
    "Brute-force the target's DNS for hidden subdomains without checking the policy",
    "Port-scan the entire hosting provider's address range to find related hosts",
    "The application's own JavaScript bundles, read for routes and parameter names",
    "Submit random payloads to every form field and watch which ones error out"
   ],
   "answer": 2,
   "why": "The app's published JavaScript frequently reveals API endpoints, parameter names and feature flags, and reading it is passive. DNS brute force and wide port scans are active and may exceed authorization; blindly fuzzing forms is noisy and not how you map endpoints."
  }
 ],
 "p31m5": [
  {
   "id": "p31m5q1",
   "q": "An API endpoint GET /api/orders/{id} returns any order whose ID is supplied, without checking the caller owns it. In the OWASP API Security Top 10 this is which risk?",
   "options": [
    "Server-Side Request Forgery against an internal service",
    "Unrestricted Resource Consumption from too many requests",
    "Security Misconfiguration of the API gateway",
    "Broken Object Level Authorization (BOLA)"
   ],
   "answer": 3,
   "why": "Returning an object without verifying the caller owns it is BOLA, the API equivalent of IDOR and the most common, most damaging API bug. Resource consumption is about rate/cost limits, misconfiguration is defaults left on, and SSRF is the server fetching an attacker-chosen URL."
  },
  {
   "id": "p31m5q2",
   "q": "A profile-update endpoint binds every JSON key straight onto the user record, so a request including \"role\":\"admin\" promotes the caller. What is the fix?",
   "options": [
    "Allowlist exactly which fields each role may set, via an explicit schema",
    "Reject any request body that contains the literal word admin anywhere",
    "Encrypt the request body so the role field cannot be read in transit",
    "Rename the role field to something attackers are unlikely to guess"
   ],
   "answer": 0,
   "why": "Mass assignment is cured by making the field set explicit and role-aware: define a DTO/schema naming only the fields a given role may set, so role has nowhere to land. Blocking a keyword, encrypting transit, or renaming fields do not stop the model from binding client keys."
  },
  {
   "id": "p31m5q3",
   "q": "An image-by-URL feature lets the server fetch a user-supplied address. An attacker points it at 169.254.169.254. Why is this dangerous, and what contains it?",
   "options": [
    "It wastes bandwidth; rate-limit the fetch feature to contain the cost",
    "It can reach the cloud metadata endpoint for credentials; allowlist destinations and block private ranges",
    "It exposes the image's EXIF data; strip metadata before storing the file",
    "It enables stored XSS via SVG; re-encode every fetched image on upload"
   ],
   "answer": 1,
   "why": "That link-local address is the cloud instance metadata endpoint, which can return credentials, so SSRF plus a reachable metadata service becomes account compromise. Contain it by allowlisting the destination, blocking private/loopback/link-local ranges (re-checking after DNS), and requiring IMDSv2."
  },
  {
   "id": "p31m5q4",
   "q": "A CORS config reflects the request's Origin header back in Access-Control-Allow-Origin and also sends Access-Control-Allow-Credentials: true. Why is that dangerous?",
   "options": [
    "It prevents legitimate front ends from ever reading the API's responses",
    "It disables the browser's same-origin policy for the user's entire session",
    "It lets any site make authenticated cross-origin requests and read the replies",
    "It silently downgrades the connection from HTTPS back to plain HTTP"
   ],
   "answer": 2,
   "why": "Reflecting any Origin together with credentials true means every site can send the user's authenticated requests and read the responses, a serious data-exposure bug. Allow only a short exact list of trusted origins. CORS governs reading cross-origin responses; it is not an SOP kill switch or a transport downgrade."
  },
  {
   "id": "p31m5q5",
   "q": "A team runs a dependency vulnerability scan once, at release. Why is an SBOM plus continuous scanning the better posture?",
   "options": [
    "An SBOM makes the application run measurably faster in production",
    "A one-time scan permanently certifies the release as free of vulnerabilities",
    "Continuous scanning replaces the need to ever patch dependencies at all",
    "New CVEs appear constantly, and an SBOM answers 'are we affected?' in minutes"
   ],
   "answer": 3,
   "why": "Vulnerabilities in shipped dependencies are disclosed continuously, so a single release-time scan goes stale immediately; a software bill of materials lets you answer whether today's CVE affects you in minutes instead of weeks. An SBOM is an inventory, not a performance feature or a patch substitute."
  }
 ],
 "p31m6": [
  {
   "id": "p31m6q1",
   "q": "When you need to know the security requirements a mobile app should meet versus the concrete tests to verify them, which OWASP resources map to each?",
   "options": [
    "MASVS defines the requirements; MASTG provides the tests",
    "MASTG defines the requirements; MASVS provides the tests",
    "Both MASVS and MASTG are testing guides with no requirements standard",
    "MASVS is for Android only and MASTG is for iOS only"
   ],
   "answer": 0,
   "why": "The MASVS is the 'what' (security requirements grouped into control families); the MASTG is the 'how' (concrete tests and demos for both platforms). They are the mobile equivalents of the ASVS and WSTG and both cover Android and iOS."
  },
  {
   "id": "p31m6q2",
   "q": "A banking app writes the user's login token into SharedPreferences as plaintext. Which MASVS area does this violate, and what is the correct place for it?",
   "options": [
    "MASVS-NETWORK; enforce TLS through the Network Security Config",
    "MASVS-STORAGE; keep the secret in the Keystore/Keychain",
    "MASVS-CODE; recompile the app with stack protections enabled",
    "MASVS-PLATFORM; declare the right runtime permissions for storage"
   ],
   "answer": 1,
   "why": "Plaintext secrets in SharedPreferences is an insecure-storage (MASVS-STORAGE) failure; keys and tokens belong in the hardware-backed Android Keystore or iOS Keychain, with any persisted data encrypted by a key from that store. Network, code-hardening and permissions are separate control families."
  },
  {
   "id": "p31m6q3",
   "q": "A product manager says 'the app uses certificate pinning, so it is secure.' What does pinning actually do, and not do?",
   "options": [
    "It encrypts the local database, so stored secrets are safe even if the device is lost",
    "It guarantees the backend API will authorize every request correctly",
    "It strengthens transport against interception but does not protect hardcoded secrets or replace server authorization",
    "It makes the app binary impossible to reverse-engineer or decompile"
   ],
   "answer": 2,
   "why": "Pinning makes the app reject any TLS certificate except the expected one, raising the bar against interception; it does nothing for secrets baked into the binary (an owner can still reverse it) and does not replace server-side authorization. It is a control to add, never the only one."
  },
  {
   "id": "p31m6q4",
   "q": "A developer insists 'the vulnerabilities are in the mobile app itself.' Where do most mobile security findings actually live?",
   "options": [
    "In the user's choice of a weak device unlock PIN",
    "In the phone's operating system kernel, below the app's control",
    "In the app-store review process, which misses most issues",
    "In the backend API, because the app is just another untrusted client"
   ],
   "answer": 3,
   "why": "Most mobile vulnerabilities live in the backend API: the app is another untrusted client, so the server must still authorize everything. The device adds storage, transport and binary surface, but the API is where the damaging flaws usually are, not the OS kernel or the store review."
  },
  {
   "id": "p31m6q5",
   "q": "You want a lawful mobile testing lab. Which setup keeps everything within software you own and are authorized to test?",
   "options": [
    "Run a deliberately vulnerable practice app on an emulator you created",
    "Intercept a popular banking app's live traffic on your personal handset",
    "Disable pinning on a competitor's production app to read its API calls",
    "Install your proxy's CA onto a stranger's rooted phone to inspect its apps"
   ],
   "answer": 0,
   "why": "A lawful lab is self-contained: a free emulator you created plus an intentionally vulnerable app built to be tested (DIVA, InsecureBankv2, iGoat, DVIA-v2). Installing a CA on someone else's device, intercepting a real app, or bypassing pinning on a competitor's app are all unauthorized."
  }
 ],
 "p31m7": [
  {
   "id": "p31m7q1",
   "q": "A finding reports an IDOR scored CVSS 6.5 (Medium) on an endpoint that exposes every customer's billing records. The client asks whether to treat it as Medium priority. What should the report say?",
   "options": [
    "Yes, fix it at Medium; CVSS is the authoritative statement of priority",
    "CVSS sets severity, but business risk here is High because of exposure and data value",
    "Downgrade it to Low, since only authenticated users can trigger it at all",
    "Raise the CVSS score to 9.0 so the ticket is prioritized correctly"
   ],
   "answer": 1,
   "why": "CVSS gives comparable severity; priority is business risk, severity in context of exposure, exploit likelihood and the value behind the bug. Customer billing data on a reachable endpoint warrants a High fix priority despite a Medium base score. You report CVSS, then advise what to fix first; you do not fudge the score."
  },
  {
   "id": "p31m7q2",
   "q": "Which field in a written finding is the one that most directly gets a bug fixed, by letting a developer see it themselves on a test instance?",
   "options": [
    "The CVSS vector string and numeric base score",
    "The plain-language business-impact paragraph for management",
    "Numbered reproduction steps",
    "The reference links to OWASP cheat sheets and CWE entries"
   ],
   "answer": 2,
   "why": "Clear, numbered reproduction steps a developer can follow on a test instance are what turn a report into a fix; without them a finding cannot be verified. CVSS aids comparison, impact aids prioritization, and references aid the fix, but reproduction is what makes it actionable."
  },
  {
   "id": "p31m7q3",
   "q": "Which statement correctly places SAST versus DAST in the development lifecycle?",
   "options": [
    "SAST needs the app instrumented and running with live traffic to work",
    "DAST reads source code while SAST only tests the deployed application remotely",
    "Both run only after release, so neither can shift security left in the pipeline",
    "SAST analyzes source without running it and runs on every commit; DAST tests the running app from outside"
   ],
   "answer": 3,
   "why": "SAST (static) analyzes source or bytecode without executing it and fits in the IDE and every commit (shift left); DAST (dynamic) tests the running app from outside, against a staging build in CI. IAST is the one that instruments the running app; the roles in the other options are swapped."
  },
  {
   "id": "p31m7q4",
   "q": "For your stated goal of highest skill-per-dollar and a direct rehearsal of the day job, which web certification does the lecture recommend starting with?",
   "options": [
    "The BSCP, prepared for with the free Academy and a practical $99 exam",
    "CEH, because HR filters recognize the name more than any other credential",
    "The eWPT, because it is valid for three years and bundles strong courseware",
    "OSWE, because deep white-box exploitation is the most valuable skill to prove first"
   ],
   "answer": 0,
   "why": "BSCP is called the best value: the preparing Web Security Academy is free and excellent, the exam is $99 and practical, and it rehearses the day job. OSWE is a later white-box step, eWPT is a reasonable alternative to choose after BSCP, and CEH is broad but less hands-on."
  },
  {
   "id": "p31m7q5",
   "q": "A tester proves an access-control flaw by downloading the entire customer table 'to show full impact.' Why is this wrong under professional practice?",
   "options": [
    "It proves nothing, because a scanner could have produced the same list faster",
    "Prove, do not exfiltrate: one record or a redacted screenshot suffices",
    "It is acceptable as long as the data is deleted after the report is written",
    "Downloading data is fine; only modifying it would breach the rules"
   ],
   "answer": 1,
   "why": "The principle is prove, do not exfiltrate: a single record or a redacted screenshot demonstrates the bug, while pulling the whole table is unnecessary and can itself breach the rules of engagement and the law. Deleting it afterward or calling it read-only does not make bulk exfiltration acceptable."
  }
 ]
});
Object.assign(window.LQ,{
 "p32m1": [
  {
   "id": "p32m1q1",
   "q": "A SOC detection engineer needs to know which specific hashes, domains and behaviors to hunt for and block today. Which level of intelligence is this, and who is its usual consumer?",
   "options": [
    "Strategic intelligence, consumed mainly by the board and risk committee",
    "Operational intelligence, consumed by the incident-response lead and red team",
    "Tactical intelligence, consumed by SOC analysts and detection engineers",
    "Executive intelligence, consumed by the chief financial officer for budgeting"
   ],
   "answer": 2,
   "why": "Hours-to-days, machine-actionable indicators for SOC analysts and detection engineers are tactical. Strategic serves the board over quarters to years; operational serves managers over weeks to months. There is no standard 'executive' level in this model."
  },
  {
   "id": "p32m1q2",
   "q": "Which of these is a properly formed priority intelligence requirement (PIR)?",
   "options": [
    "Produce a polished monthly report on cybercrime for the leadership team",
    "Tell me everything important about the ransomware threat landscape right now",
    "Collect as many indicators of compromise as the team can find before Friday",
    "Which ransomware groups hit U.S. telecom contractors in the last year, via what initial access, and does our remote-access stack appear in their tradecraft?"
   ],
   "answer": 3,
   "why": "A PIR names a population, a window and a mechanism and ties to a decision, so you can tell when it is answered. 'Tell me about ransomware' is too vague, collecting indicators is a task not a requirement, and 'produce a report' describes a product, not the question it answers."
  },
  {
   "id": "p32m1q3",
   "q": "A report states: 'We assess it is likely (moderate confidence) that a stolen VPN credential was used.' What do 'likely' and 'moderate confidence' separately express?",
   "options": [
    "Likely is the probability of the claim; confidence is the quality of the evidence behind it",
    "Likely is the source's reliability grade; confidence is the information's credibility grade",
    "Both describe the same thing: how probable the analyst thinks the claim is",
    "Likely means 80-95% and confidence means the analyst double-checked the math"
   ],
   "answer": 0,
   "why": "Estimative language ('likely' = 55-80%) states the probability of the claim; the confidence level (high/moderate/low) describes the quality and corroboration of the evidence. They are different axes, and a judgment can be likely with low confidence. Reliability/credibility is the separate Admiralty code."
  },
  {
   "id": "p32m1q4",
   "q": "In an ACH matrix you tally inconsistencies: H1 has 0, H2 has 2, H3 has 3. Which judgment does the method support?",
   "options": [
    "H3 is strongest, because it drew the most analyst attention and evidence",
    "H1 is most likely; reject the hypotheses with the most inconsistencies first",
    "H2 wins, because it sits in the middle and is the safest compromise",
    "No judgment is possible until every hypothesis reaches zero inconsistencies"
   ],
   "answer": 1,
   "why": "ACH eliminates hypotheses by their inconsistencies rather than crowning the one with the most support, because disconfirming evidence is decisive while consistent evidence is cheap. With the fewest inconsistencies, H1 is favored. Attention and compromise are not ACH criteria."
  },
  {
   "id": "p32m1q5",
   "q": "A threat-intel team produces beautiful reports no one requested and its budget is cut within two years. Which stage of the intelligence cycle did it neglect?",
   "options": [
    "Dissemination, the step that delivers the product to its consumer",
    "Processing, the step that normalizes and deduplicates the raw data",
    "Planning and direction",
    "Feedback, the step that measures whether the last product helped"
   ],
   "answer": 2,
   "why": "Living in collection and production without planning and direction, where a consumer states what they need, is the classic failure: effort with no requirement behind it. Processing, dissemination and feedback are real stages, but the missing one here is the direction that makes work relevant."
  }
 ],
 "p32m2": [
  {
   "id": "p32m2q1",
   "q": "Which of these counts as passive collection that never touches the target?",
   "options": [
    "Sending a friend request to the subject so you can view their private posts",
    "Attempting a DNS zone transfer directly against the organization's name server",
    "Calling the help desk with a pretext to confirm an employee's email format",
    "Searching Shodan's existing index and archived copies of the target's pages"
   ],
   "answer": 3,
   "why": "Passive collection reads already-published data through third-party services; Shodan already did the scanning, so querying its index is passive. Friend requests, zone-transfer attempts and pretext calls all touch the target or its people and are active collection that needs authorization."
  },
  {
   "id": "p32m2q2",
   "q": "Under Trace Labs Search Party rules for missing-persons OSINT, a volunteer considers messaging the subject's brother to ask a question. Is that allowed?",
   "options": [
    "No; contacting the subject or their family or friends is forbidden",
    "Yes, provided the message is polite and the brother is an adult",
    "Yes, as long as the volunteer does not reveal they are part of a contest",
    "No, unless a team captain approves the specific message beforehand"
   ],
   "answer": 0,
   "why": "Trace Labs rules are passive reconnaissance only: zero contact with the subject or their family and friends, no logins, no password resets. Any outreach, however polite or discreet, is active collection and grounds for disqualification. Captain approval does not create an exception."
  },
  {
   "id": "p32m2q3",
   "q": "An analyst wants to know whether corporate email addresses appear in known breaches. Which approach is both effective and lawful?",
   "options": [
    "Download the breach dumps from a criminal forum and grep for the domain",
    "Use Have I Been Pwned's domain search, then force resets and MFA",
    "Buy a 'combolist' of logs so the data can be verified line by line",
    "Attempt the leaked passwords against the login page to see which still work"
   ],
   "answer": 1,
   "why": "Checking exposure through a service built for it (Have I Been Pwned's domain search) and responding with forced resets and phishing-resistant MFA is the defender's path. Downloading or buying dumps is handling stolen credentials, and testing them against a login is unauthorized access."
  },
  {
   "id": "p32m2q4",
   "q": "Before browsing a suspect's domain, an analyst connects from the corporate network with their personal browser logged into company accounts. What is the OPSEC problem?",
   "options": [
    "The corporate network is probably too slow for efficient research work",
    "Personal accounts load faster and so bias the analyst toward quick conclusions",
    "It tells the adversary who is looking and ties the investigation to the company",
    "There is no real problem as long as the analyst uses incognito mode"
   ],
   "answer": 2,
   "why": "OPSEC protects the investigation: browsing a target from the corporate network with logged-in personal accounts reveals who is looking and links it to the organization, burning the source. The baseline is an isolated VM, per-case browser profiles with no personal logins, and a VPN or Tor; incognito does not hide your IP."
  },
  {
   "id": "p32m2q5",
   "q": "Why does an OSINT investigation capture each page with its URL, a UTC timestamp and a SHA-256 hash as it is collected?",
   "options": [
    "To make the files smaller so the case archive fits on one drive",
    "To hide the analyst's identity from the sites being examined",
    "Because platforms require a hash before they will serve archived pages",
    "So the findings can be reproduced and shown later to be unaltered"
   ],
   "answer": 3,
   "why": "An investigation you cannot reproduce is an opinion: capturing URL, UTC time and a content hash gives chain-of-custody so you can prove later the evidence was not altered. Hashing does not shrink files, is not a platform requirement, and does nothing to anonymize the analyst."
  }
 ],
 "p32m3": [
  {
   "id": "p32m3q1",
   "q": "You are mapping a company's external attack surface and want the single richest passive source of its subdomains and internal-sounding hostnames. Which do you query first?",
   "options": [
    "Certificate transparency logs via a service like crt.sh",
    "A brute-force wordlist run straight against the company's own DNS servers",
    "A full port scan of the company's published IP netblocks",
    "The company's recruiters, asked directly which systems they run"
   ],
   "answer": 0,
   "why": "Since 2018 every publicly trusted TLS certificate is logged, so certificate transparency (crt.sh) is the best passive host list, often exposing names like vpn or jenkins. DNS brute force and port scans are active; asking recruiters is not how you enumerate hosts and touches people."
  },
  {
   "id": "p32m3q2",
   "q": "Searching Shodan for your authorized target returns a host with 3389 open and a Fortinet VPN portal banner. A colleague says 'running Shodan against them is hacking.' What is correct?",
   "options": [
    "It is hacking, so you must get a separate warrant before viewing results",
    "Reading Shodan's index is passive, because the scanning already happened",
    "Shodan only shows fake honeypot data, so the finding can be ignored",
    "Viewing the banner is fine, but recording the port number is not allowed"
   ],
   "answer": 1,
   "why": "Shodan continuously scans the whole internet and indexes banners; searching that index is passive because the scanning already occurred. Scanning the hosts yourself without authorization would be active. The results are real and recording them is exactly the point of the map."
  },
  {
   "id": "p32m3q3",
   "q": "A corporate attack-surface map is supposed to be 'people-free.' Which deliverable item respects that rule?",
   "options": [
    "A roster of named employees with their roles, work hours and personal habits",
    "A dossier profiling the CISO's social-media activity and daily routine",
    "A table of assets with source, first-seen date, owner and a risk note",
    "A list of staff most likely to fall for a phishing email, ranked by name"
   ],
   "answer": 2,
   "why": "Attack-surface OSINT analyzes assets, not people: a table of hosts with source, first-seen date, owner and risk note is the output. Email formats may be inferred to judge exposure, but building named-employee rosters, personal profiles or phishing target lists is the profiling the curriculum refuses."
  },
  {
   "id": "p32m3q4",
   "q": "A public job posting asks for experience with 'FortiGate, Okta, Splunk and a Windows Server 2012 R2 migration.' What should the attack-surface analyst record and recommend?",
   "options": [
    "Nothing; job postings are marketing and reveal no useful technical detail",
    "The names of the hiring managers, to map who owns each named system",
    "That the company is hiring, which signals financial health worth noting",
    "That the security stack and an end-of-life system are disclosed; advise generic skill descriptions"
   ],
   "answer": 3,
   "why": "A posting like this publishes the security stack and flags an end-of-life system (2012 R2); you record it as part of the map and recommend recruiters describe skills generically. It is not noise, it is not about financial health, and recording hiring managers' names would violate the people-free rule."
  },
  {
   "id": "p32m3q5",
   "q": "GitHub code search surfaces an API key a former contractor committed to a public repo in your authorized scope. What is the right handling?",
   "options": [
    "Report it immediately and never use it; recommend rotation and secret scanning",
    "Use the key to confirm how much access it grants before reporting it",
    "Post it to the security team's public channel so everyone can help verify",
    "Leave it, since public repos are outside any attack-surface engagement"
   ],
   "answer": 0,
   "why": "A leaked secret is reported immediately and never used; the remediation is to rotate the key and add secret scanning and pre-commit hooks. Using it would be unauthorized access, broadcasting it spreads the exposure, and public repos tied to the org are squarely in an attack-surface map."
  }
 ],
 "p32m4": [
  {
   "id": "p32m4q1",
   "q": "You suspect a photo circulating as 'breaking news' is actually recycled from an older event. Which reverse-image engine is most directly suited to finding the earliest indexed copy?",
   "options": [
    "Google Lens, which excels at identifying objects, landmarks and text",
    "TinEye",
    "Yandex, which is strongest at matching landscapes and buildings",
    "Bing Visual Search, which lets you crop to a region before searching"
   ],
   "answer": 1,
   "why": "TinEye specializes in finding the earliest indexed copy of an image, which answers the recycling question directly. Google Lens is best for objects and text, Yandex for landscapes and buildings, and Bing for cropped-region search; all are useful, but TinEye targets 'is this old?'"
  },
  {
   "id": "p32m4q2",
   "q": "A 2.0 m signpost casts a 3.46 m shadow on flat ground. What is the approximate solar elevation, using tan(e) = h / L?",
   "options": [
    "About 60 degrees, since the post is taller than the shadow is long",
    "About 45 degrees, because any post and shadow give a right angle",
    "About 30 degrees",
    "About 15 degrees, consistent with the sun being near the horizon"
   ],
   "answer": 2,
   "why": "tan(e) = 2.0 / 3.46 = 0.578, and arctan(0.578) is about 30 degrees. A long shadow relative to the object means a low sun. The post is shorter than its shadow, so the angle is well under 45 degrees; 45 would require equal lengths."
  },
  {
   "id": "p32m4q3",
   "q": "A social-media photo you are verifying has no EXIF metadata at all. What should you conclude?",
   "options": [
    "The photo was almost certainly edited or faked to remove the evidence",
    "The file is corrupt and cannot be used as evidence in the investigation",
    "The capture location is hidden, which proves the uploader had something to hide",
    "Little; most platforms strip EXIF on upload, so absence is uninformative"
   ],
   "answer": 3,
   "why": "Major platforms routinely strip EXIF on upload, so its absence means almost nothing. Present EXIF is only a lead to corroborate because every field is editable. Missing metadata is not proof of tampering, concealment or corruption; you verify location by other clues."
  },
  {
   "id": "p32m4q4",
   "q": "Geolocating a street scene, you match a mural, the lane count and a distinctive pedestrian bridge to Street View, and nothing in the image contradicts them. How confident can you be, and why?",
   "options": [
    "Location confirmed with high confidence, because multiple independent features align and none conflict",
    "Only low confidence, because Street View imagery is never current enough to rely on",
    "Confirmed, but only if the photo still carries its original GPS EXIF tag",
    "Impossible to confirm without the photographer stating where they stood"
   ],
   "answer": 0,
   "why": "A location is confirmed when several independent features align and no feature contradicts them, the same discipline as ACH. GPS EXIF is a bonus lead, not a requirement, and you do not need the photographer's statement. Street View age rarely prevents matching fixed landmarks."
  },
  {
   "id": "p32m4q5",
   "q": "A video call later proven to involve deepfaked executives led a firm to wire funds. For judging whether a video is synthetic, what is the durable method?",
   "options": [
    "Run a deepfake detector and trust its verdict as the final answer",
    "Provenance plus corroboration: C2PA credentials, first appearance, independent sources",
    "Count visual tells like warped hands; if none appear, treat it as genuine",
    "Assume any video from a messaging app is synthetic by default"
   ],
   "answer": 1,
   "why": "Detectors lag behind new generators and visual tells can be absent, so the durable test is provenance (C2PA Content Credentials, where the file first appeared) plus independent corroboration. A clean detector result or a lack of obvious tells does not establish authenticity, and blanket assumptions are not analysis."
  }
 ],
 "p32m5": [
  {
   "id": "p32m5q1",
   "q": "A report lists a file hash, a C2 domain, and 'phishing with an ISO that mounts and runs a loader, then dumping credentials from LSASS.' Which part is a TTP rather than an IOC?",
   "options": [
    "The file hash, because it uniquely identifies the malicious binary",
    "The C2 domain, because it names where the malware connects",
    "The phishing-ISO-loader-then-LSASS-dump behavior",
    "All three are indicators of compromise, with no TTP present"
   ],
   "answer": 2,
   "why": "An IOC is a specific observable (a hash, a domain); a TTP describes how the adversary operates. The ISO-loader-to-LSASS behavior is the tactic/technique that survives even when the hash and domain change, which is why it sits at the top of the Pyramid of Pain."
  },
  {
   "id": "p32m5q2",
   "q": "On David Bianco's Pyramid of Pain, which indicator type costs the adversary the most to change when you detect and block it?",
   "options": [
    "Hash values, since the attacker must recompile to alter them",
    "IP addresses, since the attacker must rent a new server",
    "Domain names, since the attacker must register another one",
    "TTPs"
   ],
   "answer": 3,
   "why": "TTPs sit at the apex: changing behavior means retraining the operation, which is costly, so detecting at that level causes the most pain. Hashes, IPs and domains are trivial, easy and simple for the adversary to swap, which is why they sit near the bottom."
  },
  {
   "id": "p32m5q3",
   "q": "A free feed delivers 40,000 indicators a day at a 2% false-positive rate. Alerting on all of them against your logs produces roughly how many false alerts daily, and what is the lesson?",
   "options": [
    "About 800 false alerts; filter the feed to indicators relevant to your PIRs",
    "About 80 false alerts, a volume any small SOC can comfortably absorb",
    "About 8,000 false alerts; the only fix is to buy a second, better feed",
    "About 40 false alerts; false positives from free feeds are negligible"
   ],
   "answer": 0,
   "why": "2% of 40,000 is about 800 false alerts a day, likely beyond a small SOC's capacity. The lesson is relevance filtering by requirement: more volume is not better defense, and value comes from indicators tied to your PIRs, not from adding feeds."
  },
  {
   "id": "p32m5q4",
   "q": "Three vendors call the same group APT29, Cozy Bear and Midnight Blizzard, and one report hedges the link. How should an analyst express attribution?",
   "options": [
    "State it as settled fact once any reputable vendor has named the group",
    "Use estimative language and a confidence level, since attribution is a judgment",
    "Pick the vendor name that appears most often and present it without caveat",
    "Avoid naming any actor, because vendor disagreement makes attribution useless"
   ],
   "answer": 1,
   "why": "Attribution is an analytic judgment, never a fact: express it with estimative language and a confidence level, and use a mapping (MISP's threat-actor galaxy) to reconcile vendor aliases. Vendor naming is inconsistent by design, so neither treating it as fact nor refusing to attribute is right."
  },
  {
   "id": "p32m5q5",
   "q": "You map a public incident: a spearphishing link, login with stolen VPN credentials, a PowerShell downloader, then file-server encryption. What does mapping these to ATT&CK technique IDs let a defender do that an IOC list cannot?",
   "options": [
    "Guarantee the specific domains and hashes stay blocked forever",
    "Automatically remediate the intrusion without any analyst involvement",
    "Turn the behaviors into durable hunt hypotheses that outlast the indicators",
    "Prove which named threat actor was definitely responsible for the attack"
   ],
   "answer": 2,
   "why": "ATT&CK technique IDs capture behaviors (TTPs), which become hunt hypotheses that keep working after the domains and hashes change. IOCs expire quickly. Mapping does not freeze indicators, does not auto-remediate, and does not by itself prove attribution."
  }
 ],
 "p32m6": [
  {
   "id": "p32m6q1",
   "q": "A finance employee gets an email: the 'CEO' needs an urgent wire to a new vendor account in the next hour, and says to skip the usual approval. Which combination makes this a textbook social-engineering red flag?",
   "options": [
    "A spelling error in the signature combined with an unfamiliar email client",
    "An attachment larger than usual combined with an external sender banner",
    "A generic greeting together with a slightly delayed delivery timestamp",
    "Authority plus urgency plus a deviation from normal process"
   ],
   "answer": 3,
   "why": "Any request combining authority, urgency and a deviation from process is suspicious by definition, however plausible its story; those accelerants trigger the emotional 'hijack' that suppresses careful checking. Spelling, client, greeting and attachment size are weak secondary cues at best."
  },
  {
   "id": "p32m6q2",
   "q": "Across FACC, Ubiquiti, Toyota Boshoku and the Arup deepfake call, what single control would most directly have stopped each business email compromise loss?",
   "options": [
    "Confirming any payment or banking change by calling a number already on file",
    "Stronger spam filtering to quarantine the impersonation emails on arrival",
    "Mandatory annual security-awareness training for all finance staff",
    "Encrypting all outbound wire-transfer instructions end to end"
   ],
   "answer": 0,
   "why": "The BEC pattern is authority plus urgency plus a payment-detail change outside normal channels; the constant control is out-of-band verification, calling a number already on file (never one in the message), with dual approval above a threshold. Filters, annual training and encryption do not verify the request's legitimacy."
  },
  {
   "id": "p32m6q3",
   "q": "A CISO boasts that the phishing-simulation click rate fell from 34% to 7%. Why is that not the best measure of real resilience?",
   "options": [
    "Click rate is impossible to measure accurately, so any number is meaningless",
    "Click rate mainly tracks lure difficulty; report rate and time-to-report matter more",
    "A 7% click rate is actually worse than 34% for a trained population",
    "Click rate only counts executives, so it misrepresents the wider workforce"
   ],
   "answer": 1,
   "why": "Click rate rises and falls with how hard the lure is; the operational numbers are report rate and time-to-first-report, because fast reporting lets the SOC pull a real phish before most people open it. Click rate is measurable and covers all staff, so those objections are wrong."
  },
  {
   "id": "p32m6q4",
   "q": "A manager wants the next phishing simulation to be 'as sneaky and harsh as possible,' using a fake bonus lure with no prior notice. Why is this the wrong design?",
   "options": [
    "Only the real attackers are allowed to use bonus-themed lures, by convention",
    "Sneaky lures are illegal under federal law regardless of who approves them",
    "Harsh, unauthorized lures destroy trust and the reporting culture the program needs",
    "Simulations must always warn each recipient individually the day before"
   ],
   "answer": 2,
   "why": "A simulation is an authorized test with program-level consent, defined scope and lures that teach rather than humiliate; cruel bonus lures became public-relations disasters and bred contempt, killing the reporting culture. They are not criminal per se, and individual day-before warnings would defeat the test; policy-level consent is the standard."
  },
  {
   "id": "p32m6q5",
   "q": "Cloudflare staff entered credentials on a phishing page during the same campaign that breached Twilio, yet Cloudflare was not compromised. What made the difference?",
   "options": [
    "Its employees recognized the lure and reported it before clicking anything",
    "It had disabled all remote access during the window of the campaign",
    "Its email filter blocked the smishing messages before they reached phones",
    "FIDO2 security keys bound to the real origin made the stolen credentials useless"
   ],
   "answer": 3,
   "why": "Even though credentials were phished, phishing-resistant FIDO2 keys are bound to the legitimate origin, so a lookalike site produces a non-matching signature and the stolen password cannot be used. The staff did enter credentials, so recognition was not the save, and the messages were not simply filtered out."
  }
 ],
 "p32m7": [
  {
   "id": "p32m7q1",
   "q": "You are drafting an intelligence report for a busy executive who may read only the first paragraph. In BLUF form, what must that opening paragraph contain?",
   "options": [
    "The judgment, its confidence, and the recommended action the reader should take",
    "A chronological account of how the investigation unfolded step by step",
    "A full list of the indicators of compromise gathered during collection",
    "The analyst's methodology and the tools used, before any conclusions"
   ],
   "answer": 0,
   "why": "BLUF (bottom line up front) opens with the judgment, its confidence level and what to do, so a reader who stops after one paragraph still gets the decision. Chronology, raw IOC lists and methodology come later; intelligence writing is inverted, conclusion first."
  },
  {
   "id": "p32m7q2",
   "q": "A report is marked TLP:AMBER+STRICT. Who may the recipient share it with?",
   "options": [
    "Anyone in the community, since AMBER permits broad distribution",
    "The recipient's organization only, not its clients or partners",
    "Named individuals listed in the document and no one else at all",
    "Anyone, because the +STRICT suffix removes all handling limits"
   ],
   "answer": 1,
   "why": "TLP:AMBER+STRICT restricts sharing to the recipient's own organization, excluding clients and partners that plain AMBER would allow. TLP:RED is the named-individuals-only level, and GREEN is community-wide; the +STRICT suffix tightens, not loosens, the limit."
  },
  {
   "id": "p32m7q3",
   "q": "A new analyst claims they cannot pursue GOSI because they cannot afford the $8,780 SANS course. What is the accurate response?",
   "options": [
    "GOSI is free, so no payment of any kind is actually required to sit it",
    "The course is mandatory, so the certification is simply out of reach for now",
    "The exam is sold separately for about $999, so self-study is realistic",
    "Only employees of SANS are permitted to register for the GOSI exam"
   ],
   "answer": 2,
   "why": "The GOSI exam is sold separately (about $999) from the optional SANS course, and it is open-book, so self-study against the six published objectives is realistic. The course is not mandatory, the exam is not free, and there is no employer restriction on who may register."
  },
  {
   "id": "p32m7q4",
   "q": "Which metric best proves that an intelligence program is actually changing decisions, rather than just producing documents?",
   "options": [
    "The raw number of reports published per quarter by the team",
    "The number of hours analysts spent collecting during the quarter",
    "The total volume of indicators ingested from all subscribed feeds",
    "The count of control, patch or budget changes traced to a report"
   ],
   "answer": 3,
   "why": "Decisions influenced, the count of concrete changes (controls, patches, budget) traceable to a report, is what shows the program earns its budget. Reports published, indicators ingested and hours collected measure activity, not impact; intelligence is judged by whether it changed something."
  },
  {
   "id": "p32m7q5",
   "q": "Briefing executives, you are told to pre-empt the question 'how sure are you?' How should that be answered in intelligence terms?",
   "options": [
    "With the confidence level and what single piece of evidence would change it",
    "With a firm yes or no, so leadership is not burdened with nuance",
    "By restating the key judgment more loudly and in greater detail",
    "By deferring to whichever vendor report the board already trusts most"
   ],
   "answer": 0,
   "why": "'How sure are you' is answered with the confidence level and the sensitivity, which piece of evidence, if wrong, would flip the judgment. A false yes/no hides uncertainty, repetition adds nothing, and outsourcing the judgment to a vendor abandons the analyst's role."
  }
 ]
});
Object.assign(window.LQ,{
 "p47m1": [
  {
   "id": "p47m1q1",
   "q": "Tor Metrics shows the United States at 576,000 directly connecting users, which it reports as 17.9% of the daily total. Roughly how many directly connecting users is that total?",
   "options": [
    "About 576,000, since the United States dominates the Tor user base entirely",
    "About 3.2 million",
    "About 10 million, because most Tor users never appear in these estimates",
    "About 1.0 million, found by multiplying the U.S. figure by its percentage share"
   ],
   "answer": 1,
   "why": "If 576,000 is 17.9% of the total, divide: 576,000 / 0.179 is about 3.2 million. You divide by the share, not multiply by it. The U.S. is the largest single country but far from the whole base, and the figure is an estimate, not a tenfold undercount."
  },
  {
   "id": "p47m1q2",
   "q": "The 'dark web is 90% of the internet' iceberg claim traces to a misread study. What did that original figure actually describe?",
   "options": [
    "The proportion of Tor circuits that terminate at a hidden service rather than a website",
    "The share of global bandwidth consumed by onion-service traffic each day",
    "The deep web (databases and login-protected pages), not hidden dark-web sites",
    "The percentage of websites that search engines deliberately refuse to index"
   ],
   "answer": 2,
   "why": "Bergman's figure estimated the deep web, mostly databases and login-gated pages, at hundreds of times the surface web; it was never about hidden criminal sites. The dark web is tens of thousands of sites, a village, while the deep web is the ocean of ordinary logged-in content."
  },
  {
   "id": "p47m1q3",
   "q": "Classify these: your online bank account page (behind a login), a public news article, and a Tor onion service. Which pairing is right?",
   "options": [
    "All three are surface web, since each is reachable from an ordinary browser",
    "Bank page and news article are both dark web; only the onion service is deep web",
    "News article is deep web; bank page is surface web; onion service is surface web",
    "Bank page is deep web; news article is surface web; onion service is dark web"
   ],
   "answer": 3,
   "why": "A page behind a login is deep web (unindexed but on the ordinary internet); an indexed public article is surface web; content on an overlay network needing special software is dark web. The bank page is not hidden by design, just unindexed, which is the deep-web definition."
  },
  {
   "id": "p47m1q4",
   "q": "A relative insists Tor is 'built by criminals and mostly used for crime.' Which correction is accurate?",
   "options": [
    "Onion routing began at the U.S. Naval Research Laboratory, and most Tor traffic goes to ordinary websites",
    "Tor is illegal to use in the United States but tolerated for journalists",
    "All Tor traffic goes to hidden sites, but those sites are mostly legal services",
    "Tor was built by a criminal collective and later taken over by a nonprofit"
   ],
   "answer": 0,
   "why": "Onion routing was designed at the U.S. Naval Research Laboratory, Tor is free software run by a U.S. nonprofit, and even generous estimates put onion-service traffic near a fifth of client traffic, so most Tor traffic is ordinary websites. Using Tor is legal in the United States."
  },
  {
   "id": "p47m1q5",
   "q": "An analyst writes 'I found it on the darknet' to mean 'on a dark-web site.' Why does the lecture insist on keeping these terms distinct?",
   "options": [
    "The terms are interchangeable, so the distinction is only academic pedantry",
    "Darknet is the network; dark web is the web content that rides on it",
    "Darknet refers only to illegal sites, while dark web refers only to legal ones",
    "Darknet means the deep web, and dark web means the surface web"
   ],
   "answer": 1,
   "why": "The darknet is the overlay network (the pipes); the dark web is the web content hosted on it; the deep web is a different thing entirely (unindexed ordinary pages). Keeping the vocabulary clean prevents the common conflation; legality is not what separates the two words."
  }
 ],
 "p47m2": [
  {
   "id": "p47m2q1",
   "q": "Tor pins a client's guard relay for weeks to months rather than choosing a new one for each circuit. Why is frequent guard rotation actually worse for anonymity?",
   "options": [
    "Rotating guards slows every circuit because new handshakes are expensive",
    "A fixed guard lets the directory authorities load-balance the network better",
    "Frequent rotation raises the chance of eventually picking a malicious guard",
    "Rotating guards leaks the user's real IP to every relay they ever use"
   ],
   "answer": 2,
   "why": "The guard sees your real IP, so the more different guards you use over time, the greater the cumulative chance one is adversary-controlled; pinning limits that exposure. The reason is this risk arithmetic, not handshake cost, load-balancing, or any IP leak to other relays."
  },
  {
   "id": "p47m2q2",
   "q": "An adversary can observe both the link from you to your guard and the link from the exit to the website. What can they attempt, and how does Tor treat this?",
   "options": [
    "Nothing, because three layers of encryption make the two ends mathematically unlinkable",
    "They can decrypt the traffic directly, which is why Tor adds a fourth relay by default",
    "They can read the content at the guard, since the guard holds the first decryption key",
    "End-to-end traffic correlation by timing and volume; a global passive adversary is outside Tor's threat model"
   ],
   "answer": 3,
   "why": "Tor is low-latency and does not reshape timing, so someone watching both ends can correlate volumes and timing to link them; Tor explicitly does not defend against a global passive adversary. Encryption hides content, not the timing pattern, and the guard never sees plaintext or your destination."
  },
  {
   "id": "p47m2q3",
   "q": "A user points a plain Firefox at a Tor SOCKS proxy 'to save the overhead of Tor Browser.' Why is this far less safe?",
   "options": [
    "Plain Firefox presents a unique browser fingerprint and may leak DNS outside Tor",
    "Plain Firefox is slower over Tor, which makes the user give up on anonymity",
    "Plain Firefox cannot reach onion services, so the user will think Tor failed",
    "Plain Firefox encrypts only to the guard, while Tor Browser encrypts end to end"
   ],
   "answer": 0,
   "why": "Tor Browser makes everyone look alike (uniform user agent, letterboxed sizes, limited JavaScript) and routes DNS through Tor; a plain browser is fingerprintable in minutes and can resolve DNS itself, leaking your lookups. Both reach onion services, and Tor's encryption model is the same either way."
  },
  {
   "id": "p47m2q4",
   "q": "A censor downloads Tor's public consensus and blocks every listed relay address. On top of that, their deep packet inspection recognizes the Tor handshake. What restores access?",
   "options": [
    "Switching to a faster exit relay in an uncensored country",
    "A bridge reached through a pluggable transport such as obfs4 or Snowflake",
    "Rotating the user's guard relay several times per minute",
    "Disabling HTTPS-Only mode so the traffic blends in with plain web browsing"
   ],
   "answer": 1,
   "why": "An unlisted bridge defeats address blocking, and a pluggable transport (obfs4, Snowflake, WebTunnel) disguises the handshake so DPI cannot recognize it. A different exit does not help when entry is blocked, rapid guard rotation is harmful, and disabling HTTPS-Only weakens security without evading the censor."
  },
  {
   "id": "p47m2q5",
   "q": "A user asks whether running 'Tor over a VPN' automatically makes them more anonymous. What is the accurate answer?",
   "options": [
    "Yes, every added layer always increases anonymity by one more hop",
    "Yes, because the VPN hides the exit relay's IP from the destination site",
    "Not automatically; the VPN then sees your identity, so add a layer only with a clear reason",
    "No, because combining Tor with any VPN is technically impossible to configure"
   ],
   "answer": 2,
   "why": "Each extra party sees something: Tor over a VPN hides Tor use from your ISP but hands your identity to the VPN vendor, so you add a layer only when you can state what it buys. More hops are not automatically better, the VPN sits before the guard not after the exit, and the combination is configurable."
  }
 ],
 "p47m3": [
  {
   "id": "p47m3q1",
   "q": "A v3 .onion address is 56 base32 characters. It encodes a 32-byte ed25519 public key, a 2-byte checksum and a 1-byte version. Which calculation gives the 56?",
   "options": [
    "32 bytes times 2 base32 characters each, which yields exactly 56 characters total",
    "32 plus 2 plus 1 is 35, rounded up to the nearest power of two near 56",
    "56 is simply the fixed length the Tor protocol assigns to every onion address",
    "35 bytes is 280 bits, and base32 carries 5 bits per character, so 280 / 5 = 56"
   ],
   "answer": 3,
   "why": "The three parts total 35 bytes = 280 bits, and base32 encodes 5 bits per character, so 280 / 5 = 56 characters. The length is derived from the key size, not an arbitrary fixed value, and the other arithmetic does not produce 56."
  },
  {
   "id": "p47m3q2",
   "q": "Because a v3 .onion name is itself the service's public key, what does the design not need that ordinary web hosting requires?",
   "options": [
    "A certificate authority to vouch for the name",
    "A web server process to answer incoming requests",
    "Any encryption of the traffic between client and service",
    "A unique private key held by the operator of the service"
   ],
   "answer": 0,
   "why": "The address is the public key, so the service is self-authenticating: whoever proves possession of the matching private key is the site, and no certificate authority is needed to bind a name to a key. The service still runs a server, still encrypts traffic, and still holds a private key."
  },
  {
   "id": "p47m3q3",
   "q": "Investigators have located the real server behind several seized onion services. According to the lecture, how does this almost always happen?",
   "options": [
    "By breaking the ed25519 cryptography that protects the address",
    "Through misconfiguration, operator mistakes, infrastructure records or cryptocurrency",
    "By forcing the directory authorities to reveal the service's IP",
    "By watching a single relay that happens to see both ends of the circuit"
   ],
   "answer": 1,
   "why": "The protocol protects the connection; services are found through misconfiguration (a server also listening on its public IP), operator errors, hosting records answering court orders, and cryptocurrency tracing, never by breaking the math. No single relay sees both ends of an onion circuit."
  },
  {
   "id": "p47m3q4",
   "q": "You want to reach a news organization's legitimate onion mirror without being phished by a clone. What is the safe way to obtain its address?",
   "options": [
    "Copy it from a popular 'hidden wiki' list that aggregates many onion links",
    "Search a dark-web forum and pick the address with the most upvotes",
    "Take it from the organization's own clearnet page or its Onion-Location header",
    "Accept whichever 56-character address a search engine returns first"
   ],
   "answer": 2,
   "why": "A 56-character name cannot be checked by eye, and clones of real onion sites are a standing industry, so take the address only from the organization's own clearnet site or its Onion-Location header. Hidden-wiki lists, forum links and raw search hits are exactly where phishing clones live."
  },
  {
   "id": "p47m3q5",
   "q": "An operator wants a service that unlisted visitors cannot even detect, not merely one whose location is hidden. Which feature provides that?",
   "options": [
    "Running the service in single-onion mode for lower latency",
    "Publishing the address through an Onion-Location header on a public site",
    "Backing the address with several instances using OnionBalance",
    "Client authorization, which encrypts the descriptor to specific client keys"
   ],
   "answer": 3,
   "why": "Client authorization encrypts the descriptor to a list of client public keys, so anyone without a listed key cannot even read the descriptor, making the service invisible rather than merely hidden. Single-onion mode trades anonymity for speed, Onion-Location advertises a service, and OnionBalance is for load distribution."
  }
 ],
 "p47m4": [
  {
   "id": "p47m4q1",
   "q": "A journalist must do a sensitive session on a borrowed computer and leave absolutely no trace on its disk afterward. Which environment fits best, and why?",
   "options": [
    "Tails, because it is amnesic and runs from a USB stick in RAM only",
    "Whonix, because its two-VM design isolates the Workstation from the network",
    "A hardened plain Firefox, because it stores less data than Tor Browser",
    "A standard VPN app, because it encrypts everything the computer sends"
   ],
   "answer": 0,
   "why": "Tails is amnesic: it boots from USB, runs in RAM, and writes nothing to the host disk, which is exactly right for a borrowed machine. Whonix provides network isolation for a standing workstation but is not amnesic; a plain browser and a VPN leave traces and do not meet the requirement."
  },
  {
   "id": "p47m4q2",
   "q": "After downloading Tor Browser you run gpgv to check its OpenPGP signature and it reports 'BAD signature.' What should you do?",
   "options": [
    "Install it anyway, since the download completed without any transfer errors",
    "Delete the file",
    "Re-run the verification with signature checking turned off to bypass the glitch",
    "Install it but switch the security level to Safest as a precaution"
   ],
   "answer": 1,
   "why": "A BAD signature means the file does not match the Tor Project's signing key, so it may be tampered with (fake, trojanized builds are a known malware vector); delete it and download again from torproject.org. Installing it, disabling verification, or raising the security level does not make a bad download safe."
  },
  {
   "id": "p47m4q3",
   "q": "For any onion site you do not control and all dark-web research, which Tor Browser security level does the lecture prescribe, and what does it do?",
   "options": [
    "Standard, which keeps every browser and site feature enabled for compatibility",
    "Safer, which disables JavaScript only on non-HTTPS sites and makes media click-to-play",
    "Safest, which disables JavaScript everywhere and limits fonts, icons and images",
    "None; the security level makes no difference once HTTPS-Only mode is enabled"
   ],
   "answer": 2,
   "why": "Safest disables JavaScript everywhere and restricts fonts, icons and images, shrinking the attack surface that browser exploits (not Tor weaknesses) use to unmask people. Standard and Safer leave more enabled, and the level matters a great deal: HTTPS-Only alone does not block a JavaScript exploit."
  },
  {
   "id": "p47m4q4",
   "q": "A colleague fears that simply running Tor or operating a relay is illegal in the United States. What is accurate?",
   "options": [
    "It is illegal, and only journalists hold a recognized exemption from the law",
    "It is legal only if you first obtain written authorization from your ISP",
    "Running a relay is legal, but merely using Tor requires registering with the FCC",
    "No U.S. law forbids using Tor, visiting onion sites or running a relay"
   ],
   "answer": 3,
   "why": "No U.S. law forbids using Tor, visiting onion sites, running a relay or hosting an onion service, and the Tor Project has long received U.S. government funding; what is illegal (drugs, CSAM, unauthorized access) is illegal on any network. Exit relays attract abuse complaints, but there is no registration or ISP-permission requirement."
  },
  {
   "id": "p47m4q5",
   "q": "Doing authorized dark-web research, you should capture evidence as you go but must avoid certain actions. Which is a hard rule?",
   "options": [
    "Never purchase anything or run downloaded files outside a disposable sandbox",
    "Message a vendor to confirm a listing is real before recording it",
    "Open downloaded documents immediately so you can screenshot their contents",
    "Maximize the browser window so screenshots capture the full page"
   ],
   "answer": 0,
   "why": "The checklist forbids purchasing, messaging actors, and running downloads outside an isolated sandbox; you analyze only inside a disposable VM and never fund or contact crime. Opening documents online can leak outside Tor, contacting a vendor is a transaction in a court's eyes, and maximizing the window harms fingerprint uniformity."
  }
 ],
 "p47m5": [
  {
   "id": "p47m5q1",
   "q": "An NGO needs to publish a 40 MB report that a government will try to take down, and it must stay available even after the publisher goes offline. Which network fits the requirement?",
   "options": [
    "Tor onion service, because its self-authenticating name resists impersonation",
    "Hyphanet, because content persists on peers after the publisher disconnects",
    "A commercial VPN, because it hides the publisher's location from the state",
    "I2P, because its garlic routing resists traffic analysis inside the network"
   ],
   "answer": 1,
   "why": "Hyphanet is a distributed datastore where a file's encrypted blocks live on other users' disks, so content survives after the publisher leaves, exactly the censorship-resistant publishing property Tor lacks. An onion service, a VPN and I2P all require the host to stay online to serve content."
  },
  {
   "id": "p47m5q2",
   "q": "A hobbyist community wants anonymous chat and file sharing strictly among its own members, with no exposure to the clearnet. Which network is designed for that?",
   "options": [
    "Tor, routing everything out through its roughly 2,800 exit relays",
    "A mixnet messenger, accepting multi-second delays to defeat timing analysis",
    "I2P, where every member also routes and there is no exit by default",
    "Yggdrasil, an encrypted IPv6 overlay that provides anonymity between peers"
   ],
   "answer": 2,
   "why": "I2P is built for services inside the network, has no exits by default, and makes every participant a router providing cover traffic, which fits internal-only chat and file sharing. Tor is oriented to reaching the clearnet, a mixnet suits latency-tolerant messaging, and Yggdrasil gives connectivity, not anonymity."
  },
  {
   "id": "p47m5q3",
   "q": "A student claims 'a mixnet like Nym is strictly better than Tor, so everyone should use it.' What is the accurate qualification?",
   "options": [
    "Mixnets are indeed strictly better and the only reason Tor survives is inertia",
    "A mixnet is identical to Tor but with a different name for each relay",
    "Mixnets are weaker than Tor because batching messages leaks their timing",
    "A mixnet resists timing correlation but adds latency that makes web browsing impractical"
   ],
   "answer": 3,
   "why": "A mixnet delays and reorders messages with cover traffic to defeat the global-passive-adversary timing attack Tor cannot, but that latency makes web browsing impractical, so it suits messaging. It is not strictly better, batching defeats rather than leaks timing, and it is a different architecture, not a renamed Tor."
  },
  {
   "id": "p47m5q4",
   "q": "Which statement about I2P versus Tor is correct?",
   "options": [
    "I2P has no exits by default and uses a DHT instead of directory authorities",
    "I2P is simply a slower clone of Tor with the same exit-relay design",
    "I2P relies on the same nine directory authorities that Tor's consensus uses",
    "I2P routes each message over a single bidirectional tunnel rebuilt hourly"
   ],
   "answer": 0,
   "why": "I2P has no exits by design (it is for internal services), garlic-bundles messages, uses unidirectional tunnels, and keeps a Kademlia-style netDB over floodfill routers instead of directory authorities. It is not a slower Tor clone, shares none of Tor's authorities, and uses separate inbound and outbound tunnels, not one bidirectional one."
  },
  {
   "id": "p47m5q5",
   "q": "A new analyst assumes Hyphanet (formerly Freenet) is 'anonymous web browsing like Tor.' Why is that wrong?",
   "options": [
    "It is faster than Tor but offers no anonymity whatsoever to its users",
    "It is a distributed encrypted datastore for publishing, not a way to browse servers",
    "It only works for real-time chat and cannot store files for later retrieval",
    "It routes through Tor exits, so it is really just a front end for Tor"
   ],
   "answer": 1,
   "why": "Hyphanet is a distributed, encrypted datastore for publishing content that persists on peers, not a pipe to reach live servers; your node even stores encrypted fragments of others' content you cannot read. It is slow, not fast, is about storage not chat, and does not route through Tor."
  }
 ],
 "p47m6": [
  {
   "id": "p47m6q1",
   "q": "Every famous darknet market in the lecture ended with arrests despite Tor and cryptocurrency. What does the pattern of those cases show was the real cause?",
   "options": [
    "The authorities had secretly broken Tor's onion-routing encryption outright",
    "Court orders compelled the Tor Project itself to quietly hand over the operators' real names",
    "Reused identities, leaking servers, hosting records and cryptocurrency tracing",
    "Random chance, since investigators had no systematic method that actually worked"
   ],
   "answer": 2,
   "why": "Silk Road, AlphaBay, Hansa and Hydra all fell through reused handles and emails, servers that leaked their IP, hosting-company records, undercover work and blockchain tracing, not through breaking Tor. The Tor Project cannot deanonymize users, and the method was systematic, not luck."
  },
  {
   "id": "p47m6q2",
   "q": "Darknet markets hold buyers' funds in escrow, and two large markets simply vanished with user balances. Why is the exit scam a structural risk of this model?",
   "options": [
    "Law enforcement seizes escrow faster than the operators can quietly withdraw it",
    "Escrow funds are stored in a format that corrupts over time and is eventually lost",
    "Buyers can reverse Bitcoin payments, forcing the market to hoard large reserves",
    "Whoever holds the escrow can disappear with all of it"
   ],
   "answer": 3,
   "why": "Because the market custodies everyone's funds in escrow, the operator can always vanish with the balances, which is the normal end of a market that is not seized (Evolution, Empire). Bitcoin payments are irreversible, escrow does not decay, and the risk is the operator, not a seizure race."
  },
  {
   "id": "p47m6q3",
   "q": "A suspect insists Bitcoin made their market 'untraceable.' Why is that false?",
   "options": [
    "Bitcoin is pseudonymous and permanently public; clustering plus exchange records unravels it",
    "Bitcoin transactions stay private until a court formally orders the blockchain decrypted",
    "Bitcoin is fully anonymous, but exchanges voluntarily report any large transactions to police",
    "Bitcoin hides amounts but reveals addresses, so only transaction totals can ever be traced"
   ],
   "answer": 0,
   "why": "Bitcoin's ledger is public and permanent, so firms cluster addresses with heuristics and follow funds to an exchange whose know-your-customer records answer a subpoena; it is pseudonymous, not anonymous. The ledger is not encrypted, and both amounts and addresses are visible on chain."
  },
  {
   "id": "p47m6q4",
   "q": "Genesis Market sold 'bots', packages of a victim's browser fingerprint, cookies and saved logins, and ran partly on the open web. What two defender lessons does this carry?",
   "options": [
    "Session cookies are never credentials, and essentially all dark-web crime happens on the Tor network",
    "A session cookie is effectively a credential, and dark-web crime is often not on a darknet",
    "Antivirus software alone reliably stops infostealers, and cookies expire far too fast to matter",
    "Only passwords ever matter to defenders, and the open web is always safer than any onion site"
   ],
   "answer": 1,
   "why": "Stolen session cookies let an attacker resume a logged-in session, so a cookie is effectively a credential, and Genesis ran invitation-only on the open web, showing 'dark-web' crime is often not on a darknet. Cookies are not harmless, antivirus is not a complete defense, and the open web is not inherently safer."
  },
  {
   "id": "p47m6q5",
   "q": "A vendor address receives 40 separate payments, then spends all 40 outputs together in one transaction. Under the common-input-ownership heuristic, what do investigators infer?",
   "options": [
    "The 40 separate payments were all made by the very same buyer to the vendor",
    "The transaction must have passed through a mixer to combine those inputs first",
    "All 40 input addresses belong to one wallet (the vendor's)",
    "Nothing, because spending multiple inputs together reveals no useful relationship"
   ],
   "answer": 2,
   "why": "The common-input-ownership heuristic treats all inputs spent together in one transaction as controlled by a single wallet, so the 40 addresses cluster to the vendor. It says nothing about who sent the original payments, does not imply a mixer, and is precisely the relationship clustering relies on."
  }
 ],
 "p47m7": [
  {
   "id": "p47m7q1",
   "q": "A recruiter asks whether to pursue 'a dark-web certification.' What is the honest framing of this career?",
   "options": [
    "Only law-enforcement agencies may train anyone in dark-web monitoring at all",
    "There is a dedicated dark-web certification offered jointly by Tor and Europol",
    "Dark-web monitoring is a standalone profession needing no other intelligence skills",
    "There is no dark-web certification; it is a CTI skill, certified via CTIA and GCTI"
   ],
   "answer": 3,
   "why": "There is no 'dark-web expert' certification; dark-web monitoring is one collection discipline inside threat intelligence, and the relevant credentials are CTI ones (EC-Council's CTIA, GIAC's GCTI). It is not a standalone profession, and training is widely available, not restricted to law enforcement."
  },
  {
   "id": "p47m7q2",
   "q": "A vendor alert says your company's credentials are for sale on a Tor forum. Under the rules of engagement, which action is permitted?",
   "options": [
    "Verify the claim against your own HR directory and logs, then force resets",
    "Buy a 'sample' from the seller to confirm the credentials are genuine",
    "Test the leaked credentials against your VPN portal to see which still work",
    "Open a chat with the seller to negotiate the price down before reporting"
   ],
   "answer": 0,
   "why": "You verify through your own directory and logs and respond with forced resets and MFA; you never buy samples, test stolen credentials against any system (CFAA), or engage the actor without legal approval. Purchasing funds crime, credential testing is unauthorized access, and a chat is a transaction in a court's eyes."
  },
  {
   "id": "p47m7q3",
   "q": "A colleague argues that buying a leaked-data sample from a forum is the fastest way to prove a breach is real. Why is this the wrong approach?",
   "options": [
    "Samples are always fakes, so the purchase would prove nothing either way",
    "It funds crime, may itself be illegal, and good analysis verifies via your own logs",
    "It is fine as long as the purchase is made with the company credit card",
    "It is only acceptable once your organization's legal team has already been sued"
   ],
   "answer": 1,
   "why": "Purchasing funds criminal activity and can itself be a crime; sound analysis verifies the breach against your own logs and directory instead. The payment method is irrelevant, waiting for a lawsuit is nonsensical, and samples are not uniformly fake, the point is that buying them is off-limits."
  },
  {
   "id": "p47m7q4",
   "q": "A junior analyst submits a CSV of 300 indicators of compromise and calls it an intelligence report. Why is that not yet intelligence?",
   "options": [
    "A CSV is the wrong file format; reports must be delivered as signed PDFs",
    "Three hundred indicators is too few to constitute a complete report",
    "Indicators are data; intelligence adds judgment, confidence, impact and recommended action",
    "The indicators must first be sorted alphabetically before they count as intelligence"
   ],
   "answer": 2,
   "why": "Indicators are raw data; intelligence attaches analytic judgment with calibrated confidence, business impact, and a recommended action for a named decision-maker. The file format, the count of indicators, and their ordering are not what makes data into intelligence."
  },
  {
   "id": "p47m7q5",
   "q": "Writing the dark-web intelligence report, which set of elements reflects the professional standard taught here?",
   "options": [
    "A screenshot gallery, the analyst's opinion, and a promise to follow up later",
    "A single severity score and the name of the tool used to find the data",
    "Only the raw forum posts, pasted in full with no analysis or marking",
    "BLUF, calibrated confidence, Admiralty source grading, TLP marking and STIX indicators"
   ],
   "answer": 3,
   "why": "The standard report leads with the bottom line (BLUF), states judgments with estimative language and confidence, grades sources with the Admiralty code, attaches machine-readable indicators (STIX 2.1), and marks distribution with TLP. A screenshot gallery, raw posts, or a bare score with no judgment is not an intelligence product."
  }
 ]
});
