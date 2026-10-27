/* Curated audiovisual supplements for domains whose existing resource packs lacked an explicit video/lecture path.
   URLs point to primary providers or established educational publishers. Check availability before a scheduled study session.
   These are external resources, not endorsements and not substitutes for the local lesson/lab. */
(function(){
  /* Append through EXTRA_LISTEN_ADD: the engine merges it after EXTRA_LISTEN, so these never replace a domain's built-in list. */
  const add=(domain,items)=>{ window.EXTRA_LISTEN_ADD=window.EXTRA_LISTEN_ADD||{}; window.EXTRA_LISTEN_ADD[domain]=(window.EXTRA_LISTEN_ADD[domain]||[]).concat(items); };
  add('p5',[{
    t:'CS50’s Web Programming with Python and JavaScript — lecture videos',by:'Harvard University',ty:'University course · recorded video lectures',
    why:'Watch the lecture for the current module, then implement a small feature and test the failure cases rather than copying the finished solution.',
    u:[['Course lectures and projects','https://cs50.harvard.edu/web/2020/']]
  }]);
  add('p6',[{
    t:'Software Construction — lectures on testing, specifications and concurrency',by:'MIT OpenCourseWare',ty:'University lectures · video and course materials',
    why:'Use the lectures to connect API design and correctness to actual code. Reproduce a test or concurrency example, then write a failing test before fixing it.',
    u:[['MIT 6.005 course materials','https://ocw.mit.edu/courses/6-005-software-construction-spring-2016/']]
  }]);
  add('p8',[{
    t:'PortSwigger Web Security Academy — video explainers and guided labs',by:'PortSwigger',ty:'Video explainers and interactive security labs',
    why:'Keep practice inside the Academy or another explicitly authorized lab. For each vulnerability, write the root cause, impact, fix and regression test.',
    u:[['Web Security Academy','https://portswigger.net/web-security'],['PortSwigger video channel','https://www.youtube.com/@PortSwiggerTV']]
  }]);
  add('p15',[{
    t:'Computer Systems: A Programmer’s Perspective — course lecture resources',by:'Carnegie Mellon University',ty:'University course · lecture material and recorded talks',
    why:'Pair low-level code with assembly, memory and performance experiments. Record compiler flags and hardware details so results can be reproduced.',
    u:[['CMU systems course resources','https://www.cs.cmu.edu/afs/cs/academic/class/15213-f15/www/']]
  }]);
  add('p17',[{
    t:'AWS on-demand events — architecture, operations and cloud security',by:'Amazon Web Services',ty:'Recorded technical sessions · video',
    why:'Choose a session matching the current architecture topic. Translate the design into a small deployment diagram and cost/security checklist; verify service details against current docs.',
    u:[['AWS events and on-demand content','https://aws.amazon.com/events/events-content/'],['Official AWS exam guides','https://docs.aws.amazon.com/aws-certification/latest/examguides/']]
  }]);
  add('p21',[{
    t:'Splunk technical videos — logs, detection and security operations',by:'Splunk',ty:'Recorded demonstrations · video library',
    why:'Follow a detection from data source to query, alert and triage. Document false positives, field assumptions, time range and the evidence that would disprove your hypothesis.',
    u:[['Official Splunk video library','https://www.splunk.com/en_us/resources/videos.html']]
  }]);
  add('p25',[{
    t:'Cryptography I — Stanford course video lectures',by:'Stanford University / Coursera',ty:'University course · video lectures',
    why:'Pause before each worked proof or protocol explanation and predict the next step. Distinguish a mathematically secure primitive from a secure system design.',
    u:[['Cryptography I course','https://www.coursera.org/learn/crypto']]
  }]);
  add('p29',[{
    t:'Linux Foundation — Linux administration and open-source systems talks',by:'The Linux Foundation',ty:'Technical video library and lectures',
    why:'Use the video to build a command checklist, then perform the task on a disposable VM and capture the exact before/after state.',
    u:[['Linux Foundation video channel','https://www.youtube.com/@Linuxfoundation'],['Introduction to Linux','https://training.linuxfoundation.org/training/introduction-to-linux/']]
  }]);
  add('p34',[{
    t:'Hugging Face — model, transformer and AI engineering video tutorials',by:'Hugging Face',ty:'Video tutorials and technical talks',
    why:'Pair each video with a minimal notebook and a written evaluation: task, baseline, data limitations, metric, failure cases and deployment constraints.',
    u:[['Hugging Face video channel','https://www.youtube.com/@huggingface'],['Hugging Face course','https://huggingface.co/learn']]
  }]);
  add('p36',[{
    t:'dbt and analytics engineering — recorded technical talks',by:'dbt Labs / Coalesce',ty:'Recorded conference talks · video',
    why:'For each modeling pattern, state its grain, keys, freshness expectations, lineage and tests. Use a small dataset to demonstrate how a bad join silently inflates a metric.',
    u:[['dbt Coalesce conference hub','https://www.getdbt.com/coalesce'],['dbt Learn','https://learn.getdbt.com/']]
  }]);
  add('p43',[{
    t:'Apple developer videos — platform engineering, Swift and system frameworks',by:'Apple Developer',ty:'Official developer sessions · video',
    why:'Select a session aligned to the module and record the platform/version assumptions. Implement the core idea in a small app and test accessibility, privacy and lifecycle behavior.',
    u:[['Apple Developer video library','https://developer.apple.com/videos/']]
  }]);
  add('p44',[{
    t:'Web Accessibility Perspectives — videos showing inclusive design in practice',by:'W3C Web Accessibility Initiative',ty:'Official accessibility video series',
    why:'After each clip, map the user barrier to a testable requirement and verify it with keyboard and assistive-technology testing, not only an automated scan.',
    u:[['W3C WAI perspective videos','https://www.w3.org/WAI/perspective-videos/'],['WCAG 2.2 quick reference','https://www.w3.org/WAI/WCAG22/quickref/']]
  }]);
  add('p46',[{
    t:'Learning How to Learn — video lessons on chunking, retrieval and practice',by:'Barbara Oakley and Terrence Sejnowski / Coursera',ty:'Course · video lessons',
    why:'Apply one method immediately: do retrieval before rereading, schedule a delayed review and compare confidence with actual accuracy.',
    u:[['Official course','https://www.coursera.org/learn/learning-how-to-learn']]
  }]);
  add('p49',[{
    t:'RustConf and Rust community technical talks',by:'Rust project community',ty:'Recorded conference talks · video',
    why:'When watching ownership, lifetimes or async talks, build the smallest compiling example, then deliberately create and fix a borrow-checker or concurrency failure.',
    u:[['Rust video talks','https://www.youtube.com/@RustVideos'],['The Rust Book','https://doc.rust-lang.org/book/']]
  }]);
  add('p50',[{
    t:'Haskell Foundation — talks on functional programming and language design',by:'Haskell Foundation',ty:'Recorded technical talks · video',
    why:'Translate one imperative loop into a pure function and tests. Explain evaluation, types and side effects rather than treating syntax as the goal.',
    u:[['Haskell Foundation video channel','https://www.youtube.com/@HaskellFoundation'],['Haskell learning resources','https://www.haskell.org/documentation/']]
  }]);
  add('p53',[{
    t:'Windows hardware security and Secure Boot — Microsoft Mechanics video library',by:'Microsoft',ty:'Recorded technical videos · platform security',
    why:'Use the demonstrations to connect firmware settings, TPM-backed measurements and OS trust. Treat the TPM course below as the hands-on complement.',
    u:[['Microsoft Mechanics video channel','https://www.youtube.com/@MicrosoftMechanics'],['Secure Boot and Trusted Boot','https://learn.microsoft.com/en-us/windows/security/operating-system-security/system-security/trusted-boot']]
  },{
    t:'Trusted computing and TPM education — TPM 2.0, PCRs and attestation',by:'Trusted Computing Group / OpenSecurityTraining2',ty:'Technical course with hands-on learning modules',
    why:'Draw the chain from measured boot to PCR extension to quote verification. Explain why a valid signature proves origin/integrity of the quote but not that a machine is compliant.',
    u:[['TPM education courses','https://www.trustedcomputinggroup.org/resources/courses'],['Microsoft Secure Boot and Trusted Boot','https://learn.microsoft.com/en-us/windows/security/operating-system-security/system-security/trusted-boot']]
  }]);
  add('p54',[{
    t:'Small-business education and practical business workshops',by:'U.S. Small Business Administration',ty:'Recorded education and video resources',
    why:'Build a conservative service model with owner labor, taxes, insurance, churn, sales-cycle delays and utilization. Do not borrow against an optimistic top-line revenue scenario.',
    u:[['SBA Learning Platform','https://legacy.sba.gov/sba-learning-platform'],['SBA official video channel','https://www.youtube.com/@SBAgov'],['SBA business guide','https://www.sba.gov/business-guide']]
  }]);
  add('p11',[{
    t:'OpenSecurityTraining2 — low-level systems and reverse-engineering courses',by:'OpenSecurityTraining2',ty:'Video course · self-paced · free access varies by course',
    why:'Use the architecture and assembly learning path before attempting binary analysis. Start with the course prerequisites; take notes on calling conventions, control flow, memory layout and evidence versus inference.',
    u:[['Official course catalogue','https://ost2.fyi/'],['Learning paths','https://ost2.fyi/Learning-Paths.html']]
  },{
    t:'Ghidra: Beyond the Code',by:'National Security Agency',ty:'Recorded technical talk · video',
    why:'A short orientation to why analysts use a disassembler/decompiler and how reverse engineering supports defensive research. Follow it with a lab on a binary you own or are explicitly authorized to inspect.',
    u:[['Watch the NSA talk','https://www.youtube.com/watch?v=08DW8gEMjpQ'],['Official Ghidra project and safety advisories','https://github.com/NationalSecurityAgency/ghidra']]
  }]);
  add('p16',[{
    t:'Windows Internals and Sysinternals troubleshooting webcasts',by:'Microsoft Learn / Sysinternals',ty:'Recorded lectures · video archive',
    why:'Study process and memory behavior by watching an engineer reason from observed system behavior. Reproduce the investigation with benign test processes and document which observations support each conclusion.',
    u:[['Windows Internals resource guide','https://learn.microsoft.com/en-us/sysinternals/resources/windows-internals'],['Recorded webcasts','https://learn.microsoft.com/en-us/sysinternals/resources/webcasts']]
  }]);
  add('p19',[{
    t:'DevOps Fundamentals — demonstrations of CI/CD, infrastructure as code and monitoring',by:'Microsoft Learn',ty:'Video series · recorded demonstrations',
    why:'Watch one episode, then build the equivalent minimal pipeline locally. Do not stop at tool vocabulary: record how a failed test blocks a release and how a rollback is verified.',
    u:[['Official series','https://learn.microsoft.com/en-us/shows/devops-fundamentals/'],['CNCF recorded cloud-native webinars','https://www.cncf.io/online-programs/']]
  }]);
  add('p28',[{
    t:'Cisco DevNet — network automation and programmable infrastructure',by:'Cisco DevNet',ty:'Video and guided-learning catalogue',
    why:'Pair the video material with API calls, structured data, source control and a repeatable network change. Use a simulator or lab environment; never experiment against a production network without authorization.',
    u:[['Cisco DevNet learning','https://developer.cisco.com/learning/'],['Cisco DevNet video channel','https://www.youtube.com/@CiscoDevNet']]
  }]);
  add('p33',[{
    t:'Cybersecurity Framework 2.0 — official overview and implementation webinars',by:'National Institute of Standards and Technology (NIST)',ty:'Official video and webinar series',
    why:'Map a fictional small business risk to Govern, Identify, Protect, Detect, Respond and Recover. Distinguish framework outcomes from prescribed controls and from compliance claims.',
    u:[['NIST-produced videos','https://www.nist.gov/cyberframework/videos'],['CSF 2.0 implementation webinar','https://www.nist.gov/video/csf-20-webinar-series-implementing-csf-20-why-what-and-how']]
  }]);
  add('p35',[{
    t:'Full Stack Deep Learning — production ML lectures and labs',by:'Full Stack Deep Learning',ty:'University-style video course · lectures and labs',
    why:'Focus on the full lifecycle: problem framing, data, baselines, evaluation, deployment, monitoring and iteration. Treat the 2022 material as a strong conceptual course; verify current APIs separately.',
    u:[['Official course hub','https://fullstackdeeplearning.com/course/']]
  }]);
  add('p45',[{
    t:'Professional Scrum webcasts — estimation, delivery, facilitation and team systems',by:'Scrum.org',ty:'Recorded expert webcasts · video',
    why:'Use a recorded session to critique a project decision, then write a one-page decision memo with outcome measures, risks, assumptions and a feedback loop. Do not treat one agile framework as universally optimal.',
    u:[['Official webcast archive','https://www.scrum.org/resources/webcasts']]
  }]);
  add('p47',[{
    t:'Threat-intelligence webinars: external exposure, dark-web monitoring and operational use',by:'Recorded Future',ty:'Recorded and upcoming webinars · video; some require registration',
    why:'Study how an organization turns external signals into a defensible decision. Record source reliability, collection legality, confidence, alternative explanations and what should not be inferred from a single listing or leak claim.',
    u:[['Threat-intelligence webinar library','https://www.recordedfuture.com/webinars/'],['SANS recorded talks and podcasts','https://www.sans.org/security-resources/watch-and-listen']]
  }]);
})();
