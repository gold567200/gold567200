/* Field cases — batch 5 */
window.CASES=window.CASES||[];
window.CASES.push(
{ id:"fcp45", kind:"case", title:"The FTTH build that reported green", level:4, domains:["p45"],
  context:"You have just taken over as project manager for the contractor building Cedar Ridge Domain 2, a 640-home FTTH build for a regional ISP. The task order is $620,000 over 60 working days, with $1,500 a day in liquidated damages after day 60. Your predecessor moved to another job and left a week-6 status report that rates the job GREEN. The ISP's sponsor meets you Tuesday morning and wants to know whether the marketing launch date still holds. You have the cost report, the reconciled as-builts, the baseline schedule, this week's letter from the pole owner and the contract. Today is Monday, October 26. The status date is Friday, October 23, working day 30.",
  evidence:[
    { label:"Week-6 status report (written by the previous PM)",
      text:"CEDAR RIDGE FTTH PH2 - WEEKLY STATUS, WEEK 6\nStatus date: Fri Oct 23 (working day 30 of 60)\nOverall: GREEN\n\nBudget:     $272,800 spent of $620,000 (44%) at 50% of schedule\n            -> $37,200 under plan\nBore:       19,800 ft of 36,000 ft (55%) -> ahead of the timeline\nHandholes:  RED - 52 set of 64 planned. Authorized Saturday overtime\n            (3 Saturdays, $1,450 premium each) to catch up\nAerial:     waiting on pole make-ready (pole owner). No impact\n            expected - aerial has float\nSplicing:   starts day 50 as planned\nTop risk:   weather (low)\nDecisions needed: none" },
    { label:"Cost report and reconciled as-builts through day 30",
      text:"WP  Work package                         BAC      PV(d30)   EV(d30)*  AC(d30)\n1   Permits and locates               24,000    24,000    24,000    26,500\n2   Bore and conduit, 36,000 ft @ $9 324,000   162,000   178,200   201,400\n3   Handholes, 96 @ $650              62,400    41,600    33,800    35,100\n4   Aerial strand/lash, 18,000 ft\n    @ $4.50                           81,000    20,250     6,750     9,800\n5   Splicing and terminals            96,000         0         0         0\n6   Test, as-builts, restoration      32,600         0         0         0\n    TOTAL                            620,000   247,850   242,750   272,800\n* EV taken from the as-built footage sheet, all footage at the unit rate\n\nBore footage by street (first IN minus last OUT reconciled):\n  Cedar Ridge Dr 7,400 | Ridgeview Ln 5,100 | Post Oak Ct 4,400\n  Commons Ln / Ridge Ct 2,900  (not on the Domain 2 prints; started day 19)\n  Total 19,800 ft\nNotes: WP2 AC includes about $29,500 of crew, rig and conduit on\nCommons Ln / Ridge Ct. WP3 AC includes $4,350 of Saturday overtime premium.\nAerial: 1,500 ft lashed on make-ready segment 1; 3,000 ft of it remains." },
    { label:"Baseline schedule and this week's updates",
      text:"Act  Description (working days, finish-to-start)  Dur Pred   ES-EF  LS-LF  Float\nA    Permits, locates                              10  -      0-10   0-10    0\nB    Bore and conduit (2 rigs, 900 ft/day)         40  A     10-50  10-50    0\nC    Set handholes                                 30  A     10-40  20-50   10\nD    Pole make-ready (by pole owner)               15  A     10-25  15-30    5\nE    Aerial strand and lash (900 ft/day)           20  D     25-45  30-50    5\nF    Splice and terminals                           7  B,C,E 50-57  50-57    0\nG    Test, as-builts, restoration                   3  F     57-60  57-60    0\n\nUpdates received this week:\n- Pole owner letter, Wed Oct 21 (day 28): segment 1 released day 27;\n  segments 2-4 (13,500 ft of strand) will be released on day 44.\n- Remaining in-scope bore: 19,100 ft. Both rigs back on the prints\n  from day 31.\n- Lonestar Aerial can add a second aerial crew from day 44:\n  $3,600 per crew-day plus $2,000 mobilization." },
    { label:"Field email and contract excerpts",
      text:"From: R. Salinas (ISP construction manager)   Thu Oct 8, 7:52 AM\nTo: Crew 2 foreman\n\"While you're over there go ahead and run Commons Ln and Ridge Ct,\nthe developer sold those lots early. We'll sort out the paperwork later.\"\n(Change log: no entry. Nothing invoiced.)\n\nTask order TO-17 under the MSA:\n7.2  Changes. No change to scope, price or schedule is valid unless\n     made by a written Change Order signed by Owner's Project Manager.\n     Work performed without a Change Order is at Contractor's risk.\n9.4  Make-ready by others. If pole make-ready is not complete within\n     10 working days of its scheduled date, Contractor is entitled to\n     a time extension equal to the delay, provided Contractor gives\n     written notice within 5 working days of learning of the delay.\n11.1 Liquidated damages: $1,500 per working day after working day 60." }
  ],
  questions:[
    { id:"fcp45q1",
      q:"The report says the job is $37,200 under plan because $272,800 is less than half of the $620,000 budget. What is wrong with that claim?",
      options:[
        "Nothing. Spending less than a time-proportional share of the budget means the job is under budget",
        "It compares actual cost with a straight-line share of BAC, which says nothing about how much work the money bought. Against the earned value of baseline work ($216,650) the job is over cost (CPI about 0.89) and behind (SPI about 0.87)",
        "It should have compared AC with PV ($247,850), which shows the job $24,950 under budget",
        "It is acceptable as long as bore footage (55%) runs ahead of elapsed time (50%)"
      ],
      answer:1,
      why:"Cost status needs EV: CPI = EV / AC. Half of BAC is not the plan (the plan is PV, and the bore was front-loaded), and AC against PV mixes cost with schedule, so it is also meaningless. The footage comparison fails for the same reason: the plan called for 18,000 ft of bore by day 30, and 2,900 of the 19,800 ft aren't in the baseline anyway." },
    { id:"fcp45q2",
      q:"How should the 2,900 ft bored on Commons Ln and Ridge Ct be handled in earned value?",
      options:[
        "Count it in EV at $9 a foot, because it is real work the ISP asked for",
        "Leave it in EV and raise BAC by the same amount, so CPI is unaffected",
        "Absorb it quietly as goodwill and leave both EV and AC as they are",
        "Treat it as unapproved scope: exclude it from EV, move its roughly $29,500 of cost out of WP2 into a pending change, and submit a change request under clause 7.2 with the as-builts attached"
      ],
      answer:3,
      why:"EV measures progress against the approved baseline. Counting off-baseline footage lifts SPI from 0.87 to a false 0.98 and hides the slip. Raising BAC without a signed change order is an unapproved baseline change. The work was done at the contractor's risk, so a change request with evidence is the only way to get paid for it, and the email should be attached to it." },
    { id:"fcp45q3",
      q:"With the pole owner's new date, which chain of work now drives the finish?",
      options:[
        "Make-ready to aerial: with segments 2-4 released on day 44, 13,500 ft of strand takes 15 crew-days, so aerial ends about day 59 and splicing and testing push the finish to about day 69. The handholes still have float",
        "The handholes, because they are 12 behind and marked RED",
        "The bore, because WP2 has the largest budget and an SPI of 0.94",
        "Splicing, because the activity just before testing is always critical"
      ],
      answer:0,
      why:"Run the network forward: E cannot finish before 44 + 15 = 59, F runs 59-66 and G 66-69. The remaining bore (19,100 ft at 900 ft a day) ends about day 51, and the handholes had 10 days of float even before splicing moved, so the Saturday overtime crashed a non-critical activity and bought nothing. The critical path is the longest path, not the most expensive work or the one marked red." },
    { id:"fcp45q4",
      q:"Corrected SPI is 0.87, yet the finish is forecast 9 days late, 15% of the duration. Why doesn't SPI show the size of the slip?",
      options:[
        "Because the EV figures are still wrong",
        "Because SPI also includes the cost overrun",
        "SPI is a dollar-weighted index across all the work. The late aerial work is a small budget ($81,000 of $620,000), so a slip on a cheap activity on the critical path barely moves it. Dates come from the network, or from earned schedule on the critical path",
        "Because SPI always returns to 1.0 at the end of a job"
      ],
      answer:2,
      why:"SV and SPI weight each activity by its budget, not by its position in the network. A cheap activity on the critical path can be weeks late while expensive work runs on time. Forecast dates by updating the schedule. SPI drifting back to 1.0 near completion is a separate weakness that matters late in a job, not at day 30." }
  ],
  task:{ prompt:"Write the corrected week-6 status for the sponsor. Include the real CPI, SPI, EAC and forecast finish with your arithmetic, the root causes with evidence, the actions with costs and dates (including anything that must be sent this week), and the process changes that stop this happening again.",
    rubric:[
      "Recomputes earned value on baseline scope only: EV $216,650, AC about $243,300 with the Commons cost removed, CPI about 0.89, SPI about 0.87, EAC about $696,000 (BAC / CPI), VAC about -$76,000 and TCPI about 1.07, and rates the job amber or red, not green.",
      "Shows that the critical path moved to make-ready, aerial, splicing and testing, with a forecast finish near day 69 (9 days late, $13,500 of liquidated-damages exposure), and that the handhole overtime was spent on an activity with float.",
      "Treats Commons Ln / Ridge Ct as unapproved scope: excluded from EV, cost tracked separately, and a change request under clause 7.2 submitted with the as-builts and the email.",
      "Sends written notice under clause 9.4 by day 33 (Oct 28) to claim a time extension for the make-ready delay, and gives the sponsor a dated decision: accept the extension, or add the second aerial crew (about $30,800) to finish around day 62.",
      "Fixes the process: EV only from baseline as-builts, status thresholds on CPI, SPI and critical-path float, every field request routed through change control, and contract notice deadlines tracked in the plan."
    ],
    reference:"Week 6 is not green. Earned value must count only baseline scope, so the 2,900 ft on Commons Ln and Ridge Ct comes out: EV = $24,000 + 16,900 ft x $9 + 52 x $650 + 1,500 ft x $4.50 = $216,650. Moving the roughly $29,500 Commons cost out of WP2 leaves a baseline AC of $243,300. CPI = 0.89 and SPI = 0.87. EAC = $620,000 / 0.89, about $696,000 (VAC about -$76,000), and a TCPI of 1.07 says the budget will not come back by trying harder. The report compared AC with half the BAC, which measures nothing, and counting Commons footage faked an SPI of 0.98. Dates are worse than SPI shows. Make-ready segments 2-4 arrive on day 44, leaving 13,500 ft of strand (15 crew-days), so aerial ends about day 59 and splicing and testing push the finish to day 69: nine days late, with $13,500 of liquidated damages at stake. The handholes have 10 days of float, so the $4,350 of overtime bought nothing. This week: send written notice under clause 9.4 by October 28, submit a change request under 7.2 for Commons with the as-builts, and stop the handhole overtime. Ask the sponsor to decide by October 30 between accepting the extension to day 69 and paying about $30,800 for Lonestar's second aerial crew to finish near day 62. From now on, take EV only from baseline as-builts, set thresholds on CPI, SPI and critical-path float, and route field requests through change control.",
    alternatives:[
      "Using EAC = AC + (BAC - EV) / (CPI x SPI), about $761,000, as the pessimistic bound because cost and schedule pressure both persist: acceptable when the choice of formula is explained.",
      "Fast-tracking: splice the underground-fed terminals behind the bore from about day 51 instead of waiting for all the aerial work. This recovers several days at some rework risk and can replace or complement the second crew.",
      "Partly right: recomputing CPI and SPI correctly but reporting only that the job is 'a bit behind' misses the moved critical path, the clause 9.4 notice deadline and the unapproved scope, which are the decisions the sponsor actually has to make."
    ] },
  hints:[
    "Don't trust the report's arithmetic. Which three numbers does earned value need, and is every foot on the as-built sheet part of the baseline?",
    "Take Commons out of both EV and AC, then recompute CPI and SPI. Then run the network forward with the pole owner's new date. Which path is longest now?",
    "EV $216,650 and AC $243,300 give CPI 0.89 and SPI 0.87. Make-ready on day 44 puts aerial on the critical path and the finish near day 69. The clause 9.4 notice is due by October 28, and Commons needs a change request under 7.2."
  ] },
{ id:"fcp46", kind:"case", title:"Stuck at 62% with the exam 18 days away", level:1, domains:["p46"],
  context:"You install fiber on 10-hour shifts and study at night for CompTIA Network+ (N10-009), booked for Friday, November 13, 18 days from today. Six weeks ago you wrote a study plan, and you have followed it faithfully at eight to ten hours a week. For four weeks your practice-exam scores have been stuck between 61% and 64%. The app's simulator pass mark is 80%. You feel you know the material when you read it, but you blank on test questions. Before deciding whether to add hours or move the exam, you pull last week's study log, the app's analytics and your simulator history.",
  evidence:[
    { label:"Study log, week of Oct 19-25",
      text:"Day  Time         Activity                                                 Min\nMon  22:35-00:05  Reread Network Implementation notes and highlights        90\nTue  22:40-23:55  Video course, chapters 21-24 at 1.5x speed                75\nWed  22:30-23:50  Flipped through flashcards in browse mode, front and back 80\nThu  -            Shift ran to 19:30, no study                               0\nFri  23:00-23:45  40 practice questions, all Troubleshooting,\n                  answers checked at the end                                45\nSat  13:00-16:00  Rewrote notes for Modules 4-6 in color                   180\nSun  19:30-20:00  Recall deck: cleared 340 due cards, pressed Good\n                  on most after seeing the answer                           30\n                                                                Total     500\nMinutes spent answering from memory (Fri + Sun): 75 (15%)" },
    { label:"App analytics, last 28 days",
      text:"Recall deck\n  Days with reviews:          5 of 28 (four Sundays and Oct 7)\n  Cards due now:              412\n  True retention (28 days):   71%   (desired retention setting: 0.90)\n  New cards added:            386\nMixed drill sessions:         0\nBlurting sessions:            0\nMistake journal entries:      3 (all on Oct 2)\nFocus blocks completed:       4\nSleep (watch, weeknights):    average 5 h 52 min\nSleep (watch, weekends):      average 8 h 10 min\nStudy ends, weeknights:       about 00:00 on average; alarm 05:15" },
    { label:"Exam simulator history (90 questions each)",
      text:"Date    Predicted  Actual\nOct 1   75%        61%\nOct 8   78%        64%\nOct 15  80%        61%\nOct 22  82%        63%\n\nBy domain (correct / asked)       Oct 1   Oct 8   Oct 15  Oct 22\n1 Networking concepts (23%)       14/21   15/21   15/21   16/21\n2 Network implementation (20%)     8/18    9/18    8/18    9/18\n3 Network operations (19%)        11/17   11/17   11/17   12/17\n4 Network security (14%)           9/13    8/13   11/13    7/13\n5 Network troubleshooting (24%)   13/21   15/21   10/21   13/21\n\nApp banner on Oct 22 result: \"Network security down 31 points!\"" },
    { label:"The plan (written Sept 14) and your note from last night",
      text:"PLAN\n  Weeks 1-4  Read every module twice and highlight the key terms\n  Weeks 5-7  Watch the full video course\n  Week 8     Practice tests\n  Saturdays  Rewrite the week's notes neatly\n\nNOTE, Oct 25\n  \"I know this stuff when I read it, I just blank on the test.\n  Maybe I'm a visual learner and need more videos. Thinking of\n  going to 3 hours a night until the exam. Security fell apart\n  this week, so I should probably spend most of the time there.\"" }
  ],
  questions:[
    { id:"fcp46q1",
      q:"Your predicted score rose from 75% to 82% while your actual score stayed at 61-64%. What best explains the widening gap?",
      options:[
        "The simulator's questions got harder each week",
        "Test anxiety, which no study method can fix",
        "A fluency illusion. Rereading, browsing cards, rewriting notes and watching videos make the material feel familiar, which inflates your judgment of how well you know it, while recall itself is barely practiced (15% of the week)",
        "The Dunning-Kruger effect: the less you know, the more confident you become"
      ],
      answer:2,
      why:"Familiarity is not recall. Activities that re-expose you to the material raise feelings of knowing without training retrieval, so confidence rises while scores stay flat. The cure is procedural: predict, test, compare. Dunning-Kruger is the popular misstatement: the research found that self-estimates barely track ability, not that they run inversely to it." },
    { id:"fcp46q2",
      q:"The app flags Network security as 'down 31 points' (11/13 to 7/13). What should you conclude?",
      options:[
        "Very little. Thirteen questions is a tiny sample, so a 4-question swing is within noise (the domain averages about 67% across four tests). The persistent signal is Implementation at 44-50% and Troubleshooting at 48-71%, which together carry 44% of the exam weight",
        "Security knowledge is decaying fast, so most of the remaining time should go to Security",
        "The Oct 15 security score was the real one and Oct 22 was a fluke, so nothing needs to change",
        "The question bank is unreliable and should be replaced before any more practice"
      ],
      answer:0,
      why:"With n = 13 and p around 0.67, one test's standard error is about 13 points and the difference between two tests has one of about 18 points, so a 31-point swing is under two standard errors, and the other two results contradict it. Read trends across tests and weight domains by exam share. Chasing the noisiest domain is how plans drift away from the real gaps." },
    { id:"fcp46q3",
      q:"The deck has 412 cards due and 71% true retention against a 0.90 target, with reviews on 5 of 28 days. What is going on?",
      options:[
        "The FSRS scheduler is broken and the deck should switch back to SM-2",
        "Too few new cards are being added, so there is not enough material to review",
        "71% retention is fine for an exam that needs only 80%",
        "Reviewing once a week turns spaced repetition into massed cramming. Cards come due every day and pile up, most are reviewed days late after recall has dropped, and grading Good after seeing the answer feeds false data to the scheduler. Short daily reviews, honest grading and no new cards until the backlog clears fix it"
      ],
      answer:3,
      why:"A scheduler can only space reviews you actually do on the day it chose. Late reviews of forgotten cards and dishonest grades give FSRS bad data and keep the backlog growing. Adding 386 new cards while reviewing weekly makes it worse. The algorithm is fine; the habit is the problem." },
    { id:"fcp46q4",
      q:"Evaluate the note's plan to study 3 hours a night with more videos until the exam.",
      options:[
        "Good: with 18 days left, more hours is the only lever",
        "Wrong lever. The problem is method, not volume. Keep about the same hours, spend most of them answering from memory (mixed practice with immediate feedback, an error log, blurting and the daily deck), and protect sleep, which already averages under six hours on weeknights. Three hours ending after 01:00 would make consolidation worse",
        "Good, as long as the extra hours are videos, because a visual learner learns best from video",
        "Stop studying and rely on what you already know"
      ],
      answer:1,
      why:"Hours spent in low-utility activities buy little, and the learning-styles idea (matching instruction to a preferred 'style') has failed experimental tests. Sleep supports consolidation, so cutting it to add more rereading trades a real benefit for an illusory one." }
  ],
  task:{ prompt:"Write a diagnosis of why this plan isn't working, citing the evidence, then a revised 18-day plan with a daily schedule, the measurements you will track, and a decision rule for keeping or moving the exam date.",
    rubric:[
      "Diagnoses method, not effort: most of the week went to low-utility activities (rereading, browsing cards, rewriting notes, videos), only about 15% was retrieval, and the practice was blocked with delayed feedback.",
      "Uses calibration evidence: the predicted-minus-actual gap grew from 14 to 19 points, explains it as a fluency illusion, and adds predict-then-test to every quiz and simulator.",
      "Reads the scores statistically: treats the Security swing as noise on 13 questions and targets the persistent weak domains, Implementation and Troubleshooting, with interleaved mixed practice.",
      "Fixes the deck: short daily reviews, honest grading, new cards paused until the backlog clears, and true retention tracked toward about 90%.",
      "Protects sleep with a fixed stop time and at least 7 hours, and rejects both the 3-hours-a-night plan and the learning-styles reasoning.",
      "Sets measurable checkpoints and a go/no-go rule, for example simulators on days 7 and 14 and rescheduling before the vendor's deadline if day 14 is under about 75%."
    ],
    reference:"The plan fails on method, not effort. Last week's 500 minutes went mostly to rereading, browsing cards, rewriting notes and videos, all low-utility techniques. Only 75 minutes (15%) involved answering from memory, and those were blocked (40 Troubleshooting questions with feedback at the end) or rushed (340 cards graded after seeing the answer). Those activities build familiarity, so my sense of what I know rose: predictions climbed from 75% to 82% while scores stayed at 61-64%, a gap that widened from 14 to 19 points. The Security drop from 11/13 to 7/13 is noise on 13 questions. The persistent gaps are Implementation (44-50%) and Troubleshooting (48-71%), 44% of the exam weight. Reviewing the deck one day a week turns spacing into cramming: 412 cards are overdue and true retention is 71%. Weeknight sleep under six hours costs consolidation as well. Revised plan, about 75 minutes on weeknights, finished by 22:30: 15 minutes of deck daily with no new cards until under 50 are due; 40 minutes of mixed simulator questions weighted to domains 2 and 5, with feedback after each answer and every miss logged by type and turned into a card; 10 minutes of blurting one weak topic; and 10 minutes for the Mistake journal. Saturdays: a lab plus a timed 90-question simulator with my predicted score written first. Rule: if the day-14 simulator is under 75%, reschedule before the vendor's deadline; if two simulators reach 80%, sit the exam.",
    alternatives:[
      "Moving the exam two or three weeks now and running the same retrieval-heavy plan with less pressure. This is defensible given the 19-point calibration gap, if the decision is made from the data rather than from fear.",
      "Using the question bank as the main tool, with an error log and spaced retakes of missed items. Acceptable if it is interleaved across domains, gives immediate feedback and keeps the daily deck.",
      "Partly right: 'take more practice tests' without fixing the deck backlog, sleep and calibration addresses only one of the causes, and blocked practice tests by domain still won't train choosing which method applies."
    ] },
  hints:[
    "Classify every activity in the week's log as putting knowledge in or pulling it out, then compare the predicted and actual scores.",
    "Familiarity raises confidence without improving recall. Before reacting to one domain's swing, check its sample size, and look at how often the deck actually gets opened.",
    "Retrieval is 15% of the time, the calibration gap is 19 points, the Security swing is 4 questions out of 13, and the deck is reviewed weekly. Rebuild each day around the daily deck and mixed practice weighted to domains 2 and 5, protect sleep, and set a day-14 go/no-go simulator."
  ] },
{ id:"fcp47", kind:"case", title:"Tor Browser stuck at 14% after a VM rebuild", level:4, domains:["p47"],
  context:"You are the threat-intelligence analyst at a small MSSP. The firm's signed monitoring policy, MP-04, lets analysts passively read public onion forums and leak-site listings for client names, and only from the dedicated research VM cti-vm02 on VLAN 40. By design, all office egress, VLAN 40 included, goes through the explicit proxy proxy01. Change CHG-1187 (2025) exempted the research VM from TLS inspection and from the proxy's 443-only CONNECT rule. Last Thursday cti-vm02 was rebuilt from the team's VM template, and since then Tor Browser has never connected. The weekly client monitoring report is due at 17:00. It is 09:15 on Monday, October 26.",
  evidence:[
    { label:"Tor Browser log (Settings > Connection > View logs) and torrc",
      text:"Oct 26 04:12:01.000 [notice] Tor can't help you if you use it wrong! Learn how to be safe at https://support.torproject.org/faq/staying-anonymous/\nOct 26 04:12:01.000 [notice] Read configuration file \"/home/analyst/tor-browser/Browser/TorBrowser/Data/Tor/torrc\".\nOct 26 04:12:02.000 [notice] Opening Socks listener on 127.0.0.1:9150\nOct 26 04:12:02.000 [notice] Opened Socks listener connection (ready) on 127.0.0.1:9150\nOct 26 04:12:02.000 [notice] Bootstrapped 0% (starting): Starting\nOct 26 04:12:03.000 [notice] Starting with guard context \"default\"\nOct 26 04:12:03.000 [notice] Bootstrapped 3% (conn_proxy): Connecting to proxy\nOct 26 04:12:03.000 [notice] Bootstrapped 4% (conn_done_proxy): Connected to proxy\nOct 26 04:12:03.000 [warn] The https proxy sent back an unexpected status code 403 (\"Forbidden\"). Closing.\nOct 26 04:12:04.000 [notice] Bootstrapped 10% (conn_done): Connected to a relay\nOct 26 04:12:04.000 [notice] Bootstrapped 14% (handshake): Handshaking with a relay\nOct 26 04:12:05.000 [warn] Problem bootstrapping. Stuck at 14% (handshake): Handshaking with a relay. (DONE; DONE; count 1; recommendation warn; host 6C0F3E1D9A27B84E5D10C2F7A93B6E48D1F0A2C5 at 198.51.100.40:443)\nOct 26 04:12:05.000 [warn] 1 connections have failed:\nOct 26 04:12:05.000 [warn]  1 connections died in state handshaking (Tor, v3 handshake)\n...\nOct 26 04:13:41.000 [warn] Problem bootstrapping. Stuck at 14% (handshake): Handshaking with a relay. (DONE; DONE; count 14; recommendation warn; host 2B7D90C4E61A35F8B02D7C9E4A18F63B5D20E7A1 at 203.0.113.61:443)\nOct 26 04:13:41.000 [warn] 14 connections have failed:\nOct 26 04:13:41.000 [warn]  14 connections died in state handshaking (Tor, v3 handshake)\n\n$ grep -v '^#' ~/tor-browser/Browser/TorBrowser/Data/Tor/torrc | grep -i proxy\nHTTPSProxy 10.20.0.5:3128" },
    { label:"proxy01: squid.conf excerpt, access.log and cache.log",
      text:"# /etc/squid/squid.conf (excerpt)\nacl SSL_ports port 443\nacl CONNECT method CONNECT\nacl research_vm src 10.40.0.21/32     # CHG-1187: cti-vm02, no TLS inspection, any CONNECT port\nhttp_access allow CONNECT research_vm\nhttp_access deny CONNECT !SSL_ports\nacl step1 at_step SslBump1\nssl_bump peek step1\nssl_bump splice research_vm\nssl_bump bump all\n\n# access.log, Sep 28 (old VM)\n1790620811.402    912 10.40.0.21 TCP_TUNNEL/200 8231 CONNECT 192.0.2.88:9001 - HIER_DIRECT/192.0.2.88 -\n# access.log, today\n1793023923.211      1 10.40.0.23 TCP_DENIED/403 3912 CONNECT 203.0.113.77:9001 - HIER_NONE/- text/html\n1793023924.618    604 10.40.0.23 NONE_NONE/200 0 CONNECT 198.51.100.40:443 - HIER_DIRECT/198.51.100.40 -\n# cache.log, today\n2026/10/26 09:12:04 kid1| ERROR: negotiating TLS on FD 41: error:0A000086:SSL routines::certificate verify failed (1/-1/0)" },
    { label:"cti-vm02 state and the VLAN 40 DHCP leases",
      text:"analyst@cti-vm02:~$ ip -4 -br addr show ens18\nens18            UP             10.40.0.23/24\nanalyst@cti-vm02:~$ timedatectl\n               Local time: Mon 2026-10-26 04:14:22 CDT\n           Universal time: Mon 2026-10-26 09:14:22 UTC\n                 RTC time: Mon 2026-10-26 09:14:22\n                Time zone: America/Chicago (CDT, -0500)\nSystem clock synchronized: no\n              NTP service: inactive\n          RTC in local TZ: no\n(Office wall clock at the same moment: 09:14 CDT)\n\nDHCP server, VLAN 40 leases:\n  10.40.0.21  52:54:00:3a:91:c4  cti-vm02 (reservation)  last seen 2026-10-21\n  10.40.0.23  52:54:00:7e:05:b2  cti-vm02 (dynamic)      lease start 2026-10-22 16:03" },
    { label:"Ticket, network team note, firewall log and template notes",
      text:"INC-3307 (analyst, 09:05): \"Tor worked fine on the old VM. Now it never\nconnects. I tried Snowflake once from Connection Assist at 09:10 and it\nfailed too. Should I switch to WebTunnel bridges? Also the log says 'Tor\ncan't help you if you use it wrong' - did I break something?\"\n\nNetwork team: \"By design VLAN 40 has no direct internet egress. Everything\ngoes through proxy01:3128. No firewall changes since August.\"\n\nfw01, VLAN 40, today:\nOct 26 09:10:51 fw01 deny udp 10.40.0.23:50412 -> 198.51.100.200:3478 rule=default-deny-egress\nOct 26 09:10:52 fw01 deny udp 10.40.0.23:50412 -> 198.51.100.201:3478 rule=default-deny-egress\n\nTemplate vm-template-cti v3 (built Oct 22), notes:\n  \"Cloned from the corporate desktop image. NTP disabled because VLAN 40\n  has no direct NTP egress; clock comes from the virtual hardware clock.\n  Tor Browser proxy preset to proxy01:3128.\"" }
  ],
  questions:[
    { id:"fcp47q1",
      q:"The Tor log shows two kinds of failure: a 403 from the proxy, and connections stuck at 14% on port 443. What single cause explains both?",
      options:[
        "The ISP has started blocking the public relay list, so the VM needs bridges",
        "The Tor Browser download is corrupted and the program should be reinstalled",
        "proxy01 is overloaded and is dropping CONNECT requests",
        "The proxy no longer recognizes the VM as the research VM. CHG-1187's ACL names 10.40.0.21, and the rebuilt VM got 10.40.0.23 from DHCP (new MAC). Its CONNECTs to ORPort 9001 hit the 443-only rule, and its 443 tunnels are TLS-inspected (NONE_NONE/200 instead of TCP_TUNNEL/200, then 'certificate verify failed'), which a Tor link handshake cannot survive"
      ],
      answer:3,
      why:"Every line lines up: the old VM at .21 got TCP_TUNNEL/200 (spliced, any port), and the new VM at .23 gets TCP_DENIED/403 on :9001 and a bumped tunnel on :443. Tor relays present self-signed certificates and authenticate themselves inside the Tor handshake, so a proxy that terminates TLS and re-originates it fails its own upstream verification and breaks the link. The relays answered the proxy, so nothing upstream is blocking them." },
    { id:"fcp47q2",
      q:"The Tor log says 04:12 while the proxy logged 09:12 CDT for the same connection. What does that mean, and why does it matter after the proxy is fixed?",
      options:[
        "The VM's clock is 5 hours slow (NTP inactive, and the template disabled it). Once tunnels work, Tor will treat the current consensus as not yet valid and warn about clock skew, so bootstrap will fail again until time sync is fixed",
        "Nothing: Tor logs in UTC, so a 5-hour difference from CDT is expected",
        "The proxy's clock is wrong, which is why it rejects the VM",
        "It only affects log readability, because Tor does not use the clock"
      ],
      answer:0,
      why:"timedatectl confirms it independently: the VM says 09:14 UTC when the real time is 14:14 UTC, and NTP is off. A UTC timestamp could not explain it either, since UTC is ahead of CDT, not behind. Tor needs an accurate clock: the consensus has a validity window of a few hours, and relays' NETINFO cells reveal skew. Fix time sync against an internal NTP source, because VLAN 40 has no direct NTP egress." },
    { id:"fcp47q3",
      q:"The analyst asks whether to switch to WebTunnel bridges, since Snowflake failed. What is the right answer?",
      options:[
        "Yes: WebTunnel looks like ordinary HTTPS, so it will pass the TLS inspection",
        "No. Bridges and pluggable transports solve a different problem: a network blocking the public relay list or fingerprinting Tor. Here the relays are reachable, and the failure is the firm's own proxy rule no longer matching the VM. Snowflake needs UDP, which VLAN 40 denies by design, and disguising traffic to get around the firm's inspection is outside MP-04 and the change. Fix the exemption",
        "Yes: obfs4 bridges on port 443 avoid both the 403 and the inspection",
        "Use a phone hotspot on the VM so the office proxy is not involved"
      ],
      answer:1,
      why:"Bridges are unlisted entry relays for censored networks, such as a client site or a hotel network that blocks known relays, and Connection Assist suggests them whenever bootstrap fails, whatever the cause. Using one to route around your own employer's controls is a policy violation, not a fix, and a hotspot breaks the isolation MP-04 requires. The firewall log shows the Snowflake attempt hitting the designed UDP deny." },
    { id:"fcp47q4",
      q:"How should you treat the log line 'Tor can't help you if you use it wrong!'?",
      options:[
        "As proof that the analyst misconfigured Tor Browser",
        "As a sign that the Tor Browser build is not genuine",
        "As a red herring: tor prints that notice every time it starts. It points to safe-use guidance and says nothing about this failure",
        "As the reason Connection Assist suggested bridges"
      ],
      answer:2,
      why:"It is a fixed startup notice in every tor log. The actionable lines are the 403 warning and the 'Stuck at 14% (handshake)' problems, together with the proxy's access and cache logs." }
  ],
  task:{ prompt:"Write the incident note for INC-3307: the root causes with the evidence for each, the fix (including who must approve what), how you will verify that Tor bootstraps correctly, and the changes to the template and rebuild process so it doesn't happen again.",
    rubric:[
      "Traces both failure signatures (403 on :9001, stuck at 14% on :443) to the proxy treating the rebuilt VM as an ordinary client, because the CHG-1187 ACL names 10.40.0.21 and the VM is now 10.40.0.23, and cites TCP_TUNNEL versus NONE_NONE and the certificate-verify error.",
      "Explains why TLS inspection breaks Tor: relays use self-signed certificates and authenticate inside the Tor link handshake, so a proxy that terminates and re-originates TLS cannot pass it through.",
      "Finds the 5-hour clock error (log timestamps against the proxy, timedatectl, NTP inactive), predicts the consensus and clock-skew failure it would cause, and fixes time sync against an internal NTP server.",
      "Rejects bridges and pluggable transports here with reasons (relays aren't censored, UDP is denied by design, routing around the firm's control is outside MP-04) and says when bridges are the right tool.",
      "Restores the exemption in an approved, robust form (DHCP reservation for the new MAC or a static address, or proxy authentication or a dedicated listener, with the change record updated), and verifies Bootstrapped 100%, TCP_TUNNEL/200 entries in the proxy log and a synchronized clock.",
      "Fixes the rebuild process: the template syncs time from an internal source, and a post-rebuild checklist covers the address, time sync and a bootstrap test."
    ],
    reference:"Two faults, both from Thursday's rebuild. First, the proxy exemption no longer matches the VM. CHG-1187 identifies cti-vm02 by source address (acl research_vm src 10.40.0.21). The rebuilt VM has a new MAC, so DHCP gave it 10.40.0.23 and the reservation still points at the old MAC. To proxy01 it is now an ordinary client. CONNECTs to relay ORPorts on 9001 hit the 443-only rule (TCP_DENIED/403, Tor's \"unexpected status code 403\"), and tunnels to relays on 443 are bumped instead of spliced (NONE_NONE/200 where the old VM got TCP_TUNNEL/200). Squid then fails to verify the relays' self-signed certificates, and the Tor link handshake dies at 14%. Second, the VM's clock is 5 hours slow: the template disabled NTP, timedatectl shows \"System clock synchronized: no\", and the Tor log reads 04:12 against the proxy's 09:12. With the proxy fixed, Tor would reject the current consensus as not yet valid and report clock skew. Fixes: with the security owner's approval, update CHG-1187 and move the reservation to the new MAC, or better, identify the research VM by proxy authentication or a dedicated listener instead of an IP. Enable systemd-timesyncd against the internal NTP server 10.40.0.1. Verify Bootstrapped 100% (done), TCP_TUNNEL/200 from the VM and a synchronized clock. Bridges are not the answer: the relays aren't censored, and disguising traffic past our own proxy is outside MP-04. The banner line is a standard notice. Template: sync time internally, and add a rebuild checklist and a bootstrap test.",
    alternatives:[
      "Changing the ACL to the new address 10.40.0.23 under an emergency change. This works today, but it breaks again on the next rebuild unless the address is reserved or the exemption keys on something stable.",
      "Building the research workstation as Whonix (Gateway plus Workstation) behind the same approved exemption. This is a good long-term design for isolation, but it still needs the proxy exemption and a correct host clock to bootstrap.",
      "Partly right: fixing only the proxy ACL gets past the 14% handshake and then fails on the clock (consensus not yet valid). Fixing only the clock leaves the 403s and the TLS inspection in place."
    ] },
  hints:[
    "Match each Tor warning to a line in the proxy's access log, then compare the source address there with the ACL in squid.conf.",
    "A Tor link handshake cannot survive TLS inspection, and the exemption is keyed on an IP address. Then compare the Tor log's timestamps with the proxy's.",
    "The rebuilt VM is 10.40.0.23 but CHG-1187 exempts 10.40.0.21, so its tunnels are bumped or denied, and its clock is 5 hours slow with NTP off. Fix the exemption with approval, fix time sync, then retest. Bridges are not the answer here."
  ] },
{ id:"fcp48", kind:"case", title:"The loss budget that passed on paper", level:1, domains:["p48"],
  context:"You work for a fiber contractor and back up the outside-plant designer. Cluster 7 on Hackberry Rd, 64 homes on OLT1 PON 1/1/7 through a 1x4 splitter in FDH-7 and 1x16 splitters at the terminals, was signed off with a design spreadsheet that showed about 10 dB of headroom. At turn-up last week, every one of the first 12 homes read close to -27 dBm at the ONT. The OLT reports FEC errors and ONT resets, and three customers already report dropouts. The crew lead blames a bad splice he saw on the OTDR trace. The ISP wants an explanation and a fix plan by Wednesday, and 52 more homes are scheduled for next week.",
  evidence:[
    { label:"Design spreadsheet, cluster 7 (values and formulas)",
      text:"Cell  Item                              Value    Formula / source\nB3    OLT launch power (dBm)              2.5    measured at PON 1/1/7, 1490 nm\nB4    Route length from GIS (ft)       62,350    GIS export\nB5    Route length (km)                 11.81    =B4/5280\nB6    Fiber loss at 0.30 dB/km (dB)      3.54    =B5*0.30\nB7    Splitter 1 ratio (FDH-7)              4\nB8    Splitter 2 ratio (terminal)          16\nB9    Splitter loss (dB)                13.01    =10*LOG10(B7+B8)\nB10   Connectors, 4 x 0.5 dB             2.00\nB11   Fusion splices, 16 x 0.05 dB       0.80\nB12   Total loss (dB)                   19.35    =B6+B9+B10+B11\nB13   Predicted ONT Rx (dBm)           -16.85    =B3-B12\nB14   ONT Rx sensitivity (dBm)          -27.0    GPON class B+ ONT\nB15   Design margin (dB)                  3.0\nB16   Verdict                            PASS    =IF(B13>=B14-B15,\"PASS\",\"FAIL\")" },
    { label:"Turn-up readings, cluster 7 (power meter at the ONT jumper, 1490 nm)",
      text:"Home   ONT Rx (dBm)   Downstream FEC uncorrectable (15 min)   ONT resets today\n7-01   -26.8              0                                     0\n7-02   -27.0             14                                     0\n7-03   -27.1             41                                     0\n7-04   -27.3            188                                     1\n7-05   -27.4            402                                     1\n7-06   -26.9              6                                     0\n7-07   -27.6            911                                     2\n7-08   -27.9          1,620                                     3\n7-09   -27.2             97                                     0\n7-10   -27.0             18                                     0\n7-11   -27.5            644                                     2\n7-12   -27.1             52                                     0\nMean   -27.23\nSame meter on the OLT port: +2.5 dBm (matches B3)" },
    { label:"OTDR summary, feeder F-112 (CO to FDH-7, 1310 nm, tested before splitters)",
      text:"Direction A->B (CO to FDH-7)\nEvent  Distance (ft)  Type        Loss (dB)  Refl (dB)\n1           0         Connector     0.31      -52.4\n2       9,840         Splice        0.04\n3      21,320         Splice        0.06\n4      31,200         Splice       -0.08      ** GAINER **\n5      39,610         Splice        0.03\n6      48,900         Connector     0.28      -50.9\nEnd    48,905         End of fiber\nSection attenuation 0.34 dB/km   Total loss 5.71 dB\n\nDirection B->A, event 4: +0.20 dB\nBidirectional average, event 4: +0.06 dB\nCrew lead's note: \"Negative loss at 31,200 ft = bad splice, OTDR says so.\"" },
    { label:"Splitter datasheet, optics classes and unit facts",
      text:"PLC splitter (1260-1650 nm)   Ideal 10*log10(N) (dB)   Insertion loss, max (dB)\n1x2                            3.01                     4.0\n1x4                            6.02                     7.3\n1x8                            9.03                    10.5\n1x16                          12.04                    13.8\n1x32                          15.05                    17.3\n\nGPON class B+ optics: OLT Tx +1.5 to +5 dBm; ONT Rx sensitivity -27 dBm\nGPON class C+ optics: OLT Tx +3 to +7 dBm; ONT Rx sensitivity -30 dBm\n1 ft = 0.3048 m       1 mile = 5,280 ft = 1.609 km\n0 dBm = 1 mW          -27 dBm = 2.0 microwatts" }
  ],
  questions:[
    { id:"fcp48q1",
      q:"Cell B9 computes the two splitters as 10*LOG10(4+16). What is wrong with it?",
      options:[
        "It should use 20*LOG10, because optical signals are measured as voltages",
        "Cascaded splitters multiply the division of power (4 x 16 = 64 ways), so their dB losses add: 10 log10(4) + 10 log10(16) = 10 log10(64) = 18.06 dB ideal. Adding the ratios gives 10 log10(20) = 13.01 dB, about 5 dB too optimistic, and real devices are worse still (7.3 + 13.8 = 21.1 dB max)",
        "Nothing: the loss of two splitters is the log of their total number of outputs, 4 + 16 = 20",
        "It should use the natural logarithm LN instead of LOG10"
      ],
      answer:1,
      why:"Each splitter divides whatever power reaches it, so the fractions multiply: 1/4 x 1/16 = 1/64. Logarithms turn that product into a sum of decibels. Adding the ratios has no physical meaning. Power ratios use 10 log10 (20 log10 is for voltage or amplitude), and design budgets use the datasheet maximum, not the ideal." },
    { id:"fcp48q2",
      q:"Cells B4 to B6 turn the GIS length into fiber loss. What is the error and how big is it?",
      options:[
        "There is no error, because the GIS exports lengths in miles",
        "It doesn't matter, because fiber loss is small compared with the splitters",
        "The formula should divide by 1,000, because a kilometer is 1,000 feet",
        "=B4/5280 converts feet to miles, not kilometers. 62,350 ft is 11.81 miles but 19.00 km (x 0.3048 / 1000), so the fiber loss is 5.70 dB, not 3.54 dB, which makes the sheet 2.16 dB optimistic"
      ],
      answer:3,
      why:"Dividing by 5,280 gives miles, and the cell then labels the result km, so the length is short by a factor of 1.609. A kilometer is 3,281 feet, not 1,000. In a budget with a few dB of margin, a 2 dB error decides the verdict, so units need to be carried in every header and conversion." },
    { id:"fcp48q3",
      q:"Cell B16 passes a link if B13 >= B14 - B15, that is, Rx >= -27 - 3 = -30 dBm. What does that rule actually do?",
      options:[
        "With negative dBm values, subtracting the margin moves the threshold down to -30 dBm, so the check accepts links up to 3 dB worse than the ONT's sensitivity. The requirement is Rx >= sensitivity + margin = -24 dBm",
        "It is correct: subtracting the margin always makes a design safer",
        "It is correct, because the margin should be applied to the OLT launch power instead",
        "It should multiply the sensitivity by the margin"
      ],
      answer:0,
      why:"A margin is power you insist on keeping above the minimum, so it raises the required level: -27 + 3 = -24 dBm. On a negative scale, 'minus 3' means 3 dB worse. Even with only the splitter fixed (27.44 dB of loss, Rx -24.94 dBm), this formula still says PASS when the correct rule says FAIL." },
    { id:"fcp48q4", q:"How should you treat the -0.08 dB 'gainer' at 31,200 ft?",
      options:[
        "As the root cause: re-splice it before anything else",
        "As proof that the fiber amplifies light at that point",
        "As a red herring. A gainer is a one-direction OTDR artifact at a splice between fibers with slightly different backscatter. The two-direction average is +0.06 dB, a good splice that explains none of the 10 dB gap",
        "As evidence that the feeder loss is underestimated by 0.08 dB, which explains the failures"
      ],
      answer:2,
      why:"Passive fiber cannot add power. One direction reads low and the other high, and the average of the two is the true loss. The whole feeder measures 5.71 dB, close to what you would expect, while the discrepancy between the sheet and the meter is about 10 dB." }
  ],
  task:{ prompt:"Rebuild the cluster 7 loss budget correctly and show your arithmetic. Identify each error in the spreadsheet with its size in dB, check your corrected prediction against the turn-up readings, propose a design fix with numbers, and say how you would stop this class of mistake in future designs.",
    rubric:[
      "Recomputes the budget: 19.00 km x 0.30 = 5.70 dB, splitters 7.3 + 13.8 = 21.1 dB, connectors 2.0 dB and splices 0.8 dB for a total of 29.6 dB, giving Rx = 2.5 - 29.6 = -27.1 dBm.",
      "Names all three errors with their size: miles used as km (2.16 dB), ratios added instead of losses (13.01 versus 18.06 ideal or 21.1 max), and the margin applied in the wrong direction (threshold -30 instead of -24 dBm).",
      "Validates the corrected model against the measurements (predicted -27.1 against a measured mean of -27.2 dBm, range -26.8 to -27.9) and links the FEC errors and resets to operating at or below sensitivity.",
      "Dismisses the OTDR gainer with the bidirectional average (+0.06 dB).",
      "Proposes a fix that meets Rx >= -24 dBm with numbers, for example 1x8 terminal splitters (26.3 dB, -23.8 dBm) or class C+ optics and ONTs (Rx -26.6 dBm against a -27 dBm requirement), and puts next week's 52 turn-ups on hold until then.",
      "Prevents a repeat: units in every header and explicit conversions, splitter losses from datasheet maximums, the pass rule written as Rx - margin >= sensitivity, and the sheet tested against a link that has already been measured."
    ],
    reference:"The sheet is about 10 dB optimistic because of three math errors. Units: =B4/5280 turns feet into miles, but the cell is labeled km. 62,350 ft x 0.3048 = 19.00 km, so fiber loss is 5.70 dB, not 3.54. Logarithms: cascaded splitters multiply the division (1/4 x 1/16 = 1/64), so their dB losses add, giving 10 log10(64) = 18.06 dB ideal and 7.3 + 13.8 = 21.1 dB from the datasheet maximums. The sheet's 10 log10(4+16) = 13.01 dB is 8.1 dB short. The inequality: a 3 dB margin means Rx must be at least -27 + 3 = -24 dBm. The sheet subtracted it and accepted anything down to -30. Corrected budget: 5.70 + 21.1 + 2.0 + 0.8 = 29.6 dB, so Rx = 2.5 - 29.6 = -27.1 dBm, which fails sensitivity outright and misses the requirement by 3.1 dB. The meter agrees (mean -27.2 dBm), and FEC counts climb as power falls: links at the edge of sensitivity. The OTDR gainer averages +0.06 dB across both directions and is irrelevant. Fixes that meet -24 dBm: 1x8 terminal splitters (1:32 per PON, two PON ports for 64 homes), for 26.3 dB and -23.8 dBm. Or class C+ optics with C+ ONTs: at the +3 dBm minimum launch, Rx is -26.6 dBm against a -27 requirement. Hold next week's turn-ups until then. Prevention: units in headers, datasheet losses summed in dB, the rule Rx - margin >= sensitivity, and a test against a measured cluster.",
    alternatives:[
      "Checking the upstream direction as well: at 1310 nm (about 0.35 dB/km) the loss is about 30.6 dB, so an ONT launching +2 dBm arrives near -28.6 dBm against a -28 dBm OLT sensitivity. This also fails and strengthens the case for redesign.",
      "Using the ideal splitter loss (18.06 dB) instead of datasheet maximums gives Rx about -24.1 dBm. Spotting the addition error is right, but the result is optimistic, and the measured readings show the maximums are closer to reality.",
      "Partly right: fixing only the splitter formula still leaves the miles-for-km error and the reversed margin, and the sheet would still print PASS."
    ] },
  hints:[
    "Recompute each cell yourself with units attached. Where does a number change meaning or unit without a conversion?",
    "Decibels add when power ratios multiply. A margin is extra power you insist on keeping. Check which way 'minus 3 dB' moves the threshold when the numbers are negative.",
    "Feet / 5,280 is miles. Splitters: 10 log10(4) + 10 log10(16), or 21.1 dB from the datasheet. Threshold -27 + 3 = -24 dBm. The corrected prediction, -27.1 dBm, matches the meter, and the OTDR gainer averages out to +0.06 dB."
  ] },
{ id:"fcp49", kind:"case", title:"A one-line destructor that cost 57% of throughput", level:4, domains:["p49"],
  context:"You maintain ponstat, a C++20 service that collects telemetry frames from 16 OLTs over TCP, batches them every 250 ms and hands each batch to a writer thread. Release 2.4.1 went out Friday at 14:05 with a single change: a live-frame counter to help chase slow RSS growth. Since then the ingest thread has been pinned at 100% CPU, throughput has dropped from 18,200 to 7,900 frames a second, and OLTs are dropping telemetry. CI was green at -O2 -Wall -Wextra -Werror. A teammate has opened a draft PR that he says fixes it. It is Monday morning, and the network operations team wants the data back today.",
  evidence:[
    { label:"The 2.4.1 change and the unchanged ingest loop",
      text:"$ git show 9e41c07 -- src/frame.h        # \"frame: count live frames (#318)\"\n struct Frame {\n     std::string olt_id;\n     std::uint64_t ts_ns{};\n     std::vector<std::byte> payload;               // 64 KiB on average\n     Frame(std::string id, std::uint64_t ts, std::vector<std::byte> p)\n-        : olt_id(std::move(id)), ts_ns(ts), payload(std::move(p)) {}\n+        : olt_id(std::move(id)), ts_ns(ts), payload(std::move(p)) {\n+        g_live_frames.fetch_add(1, std::memory_order_relaxed);\n+    }\n+    ~Frame() { g_live_frames.fetch_sub(1, std::memory_order_relaxed); }\n };\n\n// src/ingest.cpp (unchanged since 2.3)\nstd::vector<Frame> batch;                          // flushed every 250 ms\nvoid Ingest::on_frame(Conn& c) {\n    Frame f{c.olt_id(), now_ns(), c.read_payload()};\n    batch.push_back(std::move(f));\n}\nvoid Ingest::flush() { writer_.submit(std::move(batch)); batch = {}; }\n\n$ g++ -std=c++20 -O2 -Wdeprecated-copy-dtor -c src/ingest.cpp    # local rebuild\nsrc/ingest.cpp:21:20: warning: implicitly-declared 'Frame::Frame(const Frame&)' is deprecated [-Wdeprecated-copy-dtor]\nsrc/frame.h:11:5: note: because 'Frame' has user-provided 'Frame::~Frame()'" },
    { label:"perf profile of the ingest thread on 2.4.1 (30 s)",
      text:"$ perf record -g -t 48213 -- sleep 30 && perf report --no-children --sort symbol\n# Samples: 118K of event 'cycles:P'\n  31.84%  [.] __memmove_avx_unaligned_erms\n          |\n          ---__memmove_avx_unaligned_erms\n             Frame::Frame(Frame const&)\n             |--50.4%--Ingest::on_frame\n             --49.6%--std::vector<Frame>::_M_realloc_insert<Frame>\n                       Ingest::on_frame\n  14.27%  [k] clear_page_erms\n   9.61%  [.] _int_malloc\n   7.02%  [.] _int_free\n   3.91%  [k] __handle_mm_fault\n   2.47%  [.] Frame::~Frame()\n   2.02%  [.] Conn::read_payload()\n   1.18%  [k] tcp_recvmsg_locked\n\nOn 2.4.0 the same profile showed __memmove at 4.2% and no Frame::Frame(Frame const&)." },
    { label:"Dashboards (5-minute means) and dmesg",
      text:"version  deployed       offered/s  processed/s  ingest CPU  flush p99  RSS\n2.4.0    Oct 19         18,200     18,200        46%        38 ms     2.1 GB\n2.4.1    Oct 23 14:05   18,400      7,900       100%       870 ms     3.6 GB\n\nponstat_frames_alive (new gauge in 2.4.1)\n  Oct 23 14:06   -948,112\n  Oct 23 14:30   -23,710,560\n  rate over the last hour: -15,800 per second\n\nolt-04 syslog: telemetry: export queue full, 1,844 records dropped\n\ndmesg on coll01:\n[Fri Oct 23 14:31:07 2026] perf: interrupt took too long (2512 > 2500),\n  lowering kernel.perf_event_max_sample_rate to 79500" },
    { label:"Draft PR #321, 'Fix copies in Frame', and its benchmark",
      text:"+    Frame(const Frame& o)\n+        : olt_id(o.olt_id), ts_ns(o.ts_ns), payload(o.payload) {\n+        g_live_frames.fetch_add(1, std::memory_order_relaxed);\n+    }\n+    Frame(Frame&& o)\n+        : olt_id(std::move(o.olt_id)), ts_ns(o.ts_ns),\n+          payload(std::move(o.payload)) {\n+        g_live_frames.fetch_add(1, std::memory_order_relaxed);\n+    }\n+    Frame& operator=(const Frame&) = default;\n+    Frame& operator=(Frame&&) = default;\n\nbench_batch: push 100,000 frames of 64 KiB into an empty std::vector<Frame>\n  2.4.0      0.41 s\n  2.4.1      2.95 s\n  PR #321    1.62 s\nPR description: \"Moves now work. Remaining slowness is probably malloc.\"" }
  ],
  questions:[
    { id:"fcp49q1", q:"Why did adding a destructor slow the service down so much?",
      options:[
        "The relaxed fetch_sub in the destructor causes cache-line contention between cores",
        "A user-declared destructor makes Frame non-trivially destructible, so std::vector can no longer use memcpy for it",
        "Declaring a destructor suppresses the implicitly declared move constructor and move assignment. The copy constructor is still generated, so push_back(std::move(f)) and every vector reallocation silently deep-copy the 64 KiB payload",
        "-O2 stops inlining functions of classes that have destructors"
      ],
      answer:2,
      why:"std::move is only a cast. With no move constructor declared, the rvalue binds to const Frame&, and the profile shows exactly that: memmove called from Frame::Frame(Frame const&), half from push_back and half from _M_realloc_insert. Frame was already non-trivial (it holds a string and a vector), and a relaxed atomic touched by one thread costs nanoseconds, not 30% of a core." },
    { id:"fcp49q2",
      q:"The new gauge falls by about 15,800 a second while the service processes 7,900 frames a second. What does that tell you?",
      options:[
        "Each frame is copied about twice. The implicit copy constructor doesn't increment the counter, but every copy's destructor decrements it, so the gauge drifts by about -2 per frame: one copy at push_back and, on average, about one more from reallocations",
        "Frames are leaking, which is the RSS growth the counter was meant to find",
        "The 64-bit atomic has overflowed and wrapped negative",
        "Relaxed memory ordering lets increments be lost in a data race"
      ],
      answer:0,
      why:"Only the converting constructor increments, while every destructor decrements, including the copies' destructors. Growing a vector by doubling copies about n elements in total for n insertions, which adds about one copy per frame to the one made by push_back: about two unmatched decrements per frame, matching 15,800 / 7,900. A leak would push the gauge up, not down. Relaxed atomics are still atomic, so no updates are lost." },
    { id:"fcp49q3",
      q:"PR #321 cuts the benchmark from 2.95 s to 1.62 s, not to 0.41 s. Why?",
      options:[
        "It fixes everything, and the remainder is malloc noise as the PR says",
        "It makes things worse, because the copy constructor now also increments the counter",
        "It won't compile, because defaulted assignment operators conflict with the hand-written constructors",
        "push_back(std::move(f)) now moves, but vector growth still copies. The hand-written move constructor isn't noexcept and Frame is copyable, so std::vector uses move_if_noexcept and copies on reallocation to keep its strong exception guarantee. That leaves about one 64 KiB copy per frame"
      ],
      answer:3,
      why:"During reallocation, std::vector moves elements only if the move constructor is noexcept, or if the type cannot be copied at all. A user-provided move constructor is noexcept only when you write noexcept. A defaulted one (= default) would deduce noexcept from the string and vector members. One copy per frame instead of two predicts roughly half the regression, which is what the benchmark shows." },
    { id:"fcp49q4",
      q:"How should you treat the dmesg line 'perf: interrupt took too long ... lowering kernel.perf_event_max_sample_rate'?",
      options:[
        "As the kernel throttling ponstat's CPU time, which explains the lost throughput",
        "As a red herring. perf lowered its own sampling rate because its sampling interrupt ran long while you profiled. It affects profiling resolution, not ponstat",
        "As NIC interrupts starving the ingest thread",
        "As a hardware fault on coll01"
      ],
      answer:1,
      why:"The message appeared at 14:31, during your perf record session, and concerns perf's own interrupt handler. Throughput fell at the 14:05 deploy, and the profile and the counter explain it fully." }
  ],
  task:{ prompt:"Write the regression analysis and the fix. Give the root cause in terms of C++'s special-member rules with evidence, the corrected Frame (code or a precise description), how you will prove the fix in a benchmark and in production, and what CI should have caught.",
    rubric:[
      "States the mechanism: a user-declared destructor suppresses the implicit move operations, the deprecated implicit copy constructor is used instead, and the evidence ties it to Frame::Frame(Frame const&) and _M_realloc_insert in perf and to the -Wdeprecated-copy-dtor warning.",
      "Explains the gauge drifting at about -2 per frame as unmatched destructor calls from those copies.",
      "Explains why PR #321 helps only half: the move constructor isn't noexcept, so reallocation still copies under move_if_noexcept.",
      "Gives a correct fix, preferably the rule of zero (counting moved into a small member type, Frame declaring no special members) or a full rule of five with noexcept moves, plus static_assert(std::is_nothrow_move_constructible_v<Frame>), and reserves the batch capacity after each flush.",
      "Verifies it: bench_batch back near 0.41 s, no Frame::Frame(Frame const&) in perf, the gauge stable, ingest CPU and throughput back to 2.4.0 levels, and the dmesg perf message dismissed.",
      "Adds CI guards: -Wdeprecated-copy-dtor (or clang-tidy cppcoreguidelines-special-member-functions and performance-noexcept-move-constructor), the type-trait static_assert, and a benchmark regression gate."
    ],
    reference:"Root cause: commit 9e41c07 added ~Frame(). A user-declared destructor stops the compiler from declaring Frame's move constructor and move assignment, but the copy constructor is still generated (deprecated, and -Wdeprecated-copy-dtor says so). So batch.push_back(std::move(f)) binds to const Frame& and deep-copies the 64 KiB payload. Every reallocation of batch, which restarts from zero capacity after each flush, copies the elements again. perf shows it directly: 32% in memmove under Frame::Frame(Frame const&), split evenly between on_frame and _M_realloc_insert, plus malloc, free and page zeroing. The gauge confirms it. Copies never increment the counter, but their destructors decrement it, about two per frame (-15,800/s at 7,900 frames/s). PR #321 restores moves for push_back, but its move constructor isn't noexcept, so std::vector keeps copying on reallocation (move_if_noexcept), which matches 1.62 s. Fix with the rule of zero: put the counting in a member type, struct LiveCount, whose noexcept default and copy constructors increment and whose destructor decrements. Frame then declares no special members, and its implicit move is noexcept. Add static_assert(std::is_nothrow_move_constructible_v<Frame>), and call batch.reserve(expected) after each flush. Verify bench_batch near 0.41 s, no Frame copy constructor in perf, a gauge that stays flat at the live count, and production back to about 18,200 frames/s at under 50% CPU. The dmesg line is perf throttling itself. CI: -Wdeprecated-copy-dtor, clang-tidy's special-member and noexcept-move checks, and a benchmark gate.",
    alternatives:[
      "A full rule of five: counting copy constructor, a noexcept move constructor and move assignment (or = default where possible), and the destructor. This is correct if every member function is consistent and the static_assert is added. It is more code to keep right than the rule of zero.",
      "Deleting Frame's copy operations (= delete) so any accidental copy is a compile error, with = default noexcept moves. This is strong if nothing legitimately copies frames, and it also makes vector move on reallocation.",
      "Partly right: removing the destructor and the counter restores performance but drops the RSS investigation the counter was added for. Adding only batch.reserve() hides the reallocation copies but still copies once per push_back."
    ] },
  hints:[
    "Start from the profile: which constructor is calling memmove, and from where? Then ask what the compiler generates for a class that declares a destructor.",
    "Count the gauge's increments and decrements per frame, including copies and reallocations. Then look up when std::vector moves rather than copies elements while it grows.",
    "~Frame() suppressed the implicit move, so push_back and reallocation call the implicit copy constructor (about two copies per frame). PR #321's move isn't noexcept, so growth still copies. Use the rule of zero with a counting member, static_assert nothrow-move, and reserve the batch."
  ] },
{ id:"fcp50", kind:"case", title:"Backups that said OK for twelve nights", level:3, domains:["p50"],
  context:"Your small IT business manages app01, an Ubuntu 24.04 server at a client's title company. It runs their CRM in Docker, with PostgreSQL in a container. A nightly cron script dumps the database to the office NAS, keeps about two weeks of dumps and posts 'backup OK' to your ops channel, and it has posted OK every night. This morning the client asked you to recover a contact record deleted on Friday, and the newest dump you opened is 20 bytes. The script starts with set -euo pipefail, so everyone assumed it would fail loudly. It is Monday, October 26, 09:30.",
  evidence:[
    { label:"crontab, the backup log and the version check",
      text:"$ sudo crontab -l | grep backup\n15 2 * * * /usr/local/bin/nightly-backup.sh >> /var/log/nightly-backup.log 2>&1\n\n$ grep -A3 -E '10-1[34]T|10-26T' /var/log/nightly-backup.log\n2026-10-13T02:15:01 start, free KB: 3812344120\n2026-10-13T02:18:47 dump written: /mnt/nas/backups/app01/crm-2026-10-13.sql.gz\n2026-10-13T02:18:48 pruned 1 old dump(s)\n2026-10-14T02:15:01 start, free KB: 3812150244\npg_dump: error: aborting because of server version mismatch\npg_dump: detail: server version: 17.10; pg_dump version: 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)\n2026-10-14T02:15:01 dump written: /mnt/nas/backups/app01/crm-2026-10-14.sql.gz\n2026-10-26T02:15:01 start, free KB: 3811902730\npg_dump: error: aborting because of server version mismatch\npg_dump: detail: server version: 17.10; pg_dump version: 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)\n2026-10-26T02:15:01 dump written: /mnt/nas/backups/app01/crm-2026-10-26.sql.gz\n2026-10-26T02:15:02 pruned 1 old dump(s)\n\n$ docker exec crm-db-1 postgres --version\npostgres (PostgreSQL) 17.10 (Debian 17.10-1.pgdg12+1)\nChange log, Oct 13 14:20: \"CRM vendor upgraded the stack; db image 16 -> 17.\"" },
    { label:"The backup share",
      text:"$ ls -l /mnt/nas/backups/app01/\n-rw-r--r-- 1 root root 191846212 Oct 12 02:18 crm-2026-10-12.sql.gz\n-rw-r--r-- 1 root root 192301977 Oct 13 02:18 crm-2026-10-13.sql.gz\n-rw-r--r-- 1 root root        20 Oct 14 02:15 crm-2026-10-14.sql.gz\n-rw-r--r-- 1 root root        20 Oct 15 02:15 crm-2026-10-15.sql.gz\n   ... Oct 16 to Oct 24: nine more files, every one 20 bytes ...\n-rw-r--r-- 1 root root        20 Oct 25 02:15 crm-2026-10-25.sql.gz\n-rw-r--r-- 1 root root        20 Oct 26 02:15 crm-2026-10-26.sql.gz\n\n$ gzip -l /mnt/nas/backups/app01/crm-2026-10-26.sql.gz\n         compressed        uncompressed  ratio uncompressed_name\n                 20                   0   0.0% /mnt/nas/backups/app01/crm-2026-10-26.sql\n\n$ printf '' | gzip | wc -c\n20" },
    { label:"/usr/local/bin/nightly-backup.sh",
      text:" 1  #!/usr/bin/env bash\n 2  set -euo pipefail\n 3  DEST=/mnt/nas/backups/app01\n 4  STAMP=$(date +%F)\n 5  log()    { printf '%s %s\\n' \"$(date +%FT%T)\" \"$*\"; }\n 6  notify() { curl -fsS -m 10 -d \"$1\" https://hooks.example.net/ops >/dev/null; }\n 7  backup_db() {\n 8      local out=\"$DEST/crm-$STAMP.sql.gz\"\n 9      local free=$(df --output=avail \"$DEST\" | tail -1)\n10      log \"start, free KB: $free\"\n11      pg_dump -h 127.0.0.1 -U backup crm | gzip > \"$out\"\n12      log \"dump written: $out\"\n13  }\n14  prune() { local n; n=$(find \"$DEST\" -name 'crm-*.sql.gz' -mtime +14 -print -delete | wc -l); log \"pruned $n old dump(s)\"; }\n15  if backup_db; then\n16      prune\n17      notify \"app01 backup OK $STAMP\"\n18  else\n19      notify \"app01 backup FAILED $STAMP\"\n20      exit 1\n21  fi" },
    { label:"ShellCheck, and a kernel message from last week",
      text:"$ shellcheck nightly-backup.sh\nIn nightly-backup.sh line 9:\n    local free=$(df --output=avail \"$DEST\" | tail -1)\n          ^--^ SC2155 (warning): Declare and assign separately to avoid masking return values.\n\n$ shellcheck -o all nightly-backup.sh | grep -A2 'line 15:'\nIn nightly-backup.sh line 15:\nif backup_db; then\n   ^-------^ SC2310 (info): This function is invoked in an 'if' condition so set -e will be disabled. Invoke separately if failures should cause the script to exit.\n\n$ dmesg -T | grep -i cifs\n[Tue Oct 20 13:42:17 2026] CIFS: VFS: \\\\nas01 has not responded in 180 seconds. Reconnecting...\n$ findmnt -n -o SOURCE,FSTYPE /mnt/nas\n//nas01/backups cifs" }
  ],
  questions:[
    { id:"fcp50q1",
      q:"The script has set -euo pipefail, and pg_dump failed every night. Why did it still report OK?",
      options:[
        "cron runs scripts with /bin/sh (dash), which ignores pipefail",
        "pipefail only applies to the last pipeline in a script",
        "gzip's success always hides pg_dump's failure, whatever options are set",
        "backup_db is called as an if condition, and Bash ignores errexit for everything run in that context, including the function body. pipefail did make the pipeline's status 1, but nothing acted on it: the function logged 'dump written' and returned that log call's 0, so the if took the OK branch"
      ],
      answer:3,
      why:"errexit is suspended in any command tested by if, while, && or ||, and in everything a tested function runs. A function's status is that of its last command. The crontab runs the script directly, so the bash shebang applies, and pipefail would have reported the failure if anything had checked the status. ShellCheck flags this only as optional check SC2310 (-o all)." },
    { id:"fcp50q2",
      q:"Every dump since October 14 is exactly 20 bytes. What does that tell you?",
      options:[
        "pg_dump aborted before writing anything, and gzip compressed an empty stream. An empty gzip file is 20 bytes (header plus trailer), and gzip -l shows 0 bytes uncompressed",
        "The NAS truncated the files during the CIFS reconnect",
        "The CRM database became very small after the vendor's upgrade",
        "The share filled up, so only the gzip header could be written"
      ],
      answer:0,
      why:"printf '' | gzip | wc -c prints 20, the size of every file since the night after the upgrade. The share has about 3.8 TB free and the database didn't shrink: the October 13 dump was 192 MB. Nothing reached gzip because pg_dump 16.14 refuses to dump a 17.10 server." },
    { id:"fcp50q3", q:"What do you do first?",
      options:[
        "Fix the script and let tonight's run take a good backup",
        "Upgrade the host's pg_dump to version 17 and rerun the job",
        "Protect the last good dumps: disable the cron job (or the prune) and copy crm-2026-10-12 and crm-2026-10-13 somewhere the prune cannot reach. Tonight's run would delete the October 12 dump and Wednesday's the October 13 one. Then take a fresh dump with a matching pg_dump and verify it",
        "Restore the October 13 dump over production to check that it works"
      ],
      answer:2,
      why:"prune deletes by age, not by quality. find -mtime +14 removes files at least 15 days old, so the two real dumps disappear on the next two nights and only empty files would remain. Preserve the evidence and the recovery point before changing anything. Test restores go to a scratch database, never over production." },
    { id:"fcp50q4",
      q:"How should you weigh the CIFS 'has not responded in 180 seconds' message and ShellCheck's SC2155 warning?",
      options:[
        "The CIFS reconnect corrupted the dumps, so the NAS should be replaced",
        "Both are red herrings for this incident. The reconnect happened once, on October 20 at 13:42 in the afternoon, while the empty dumps began on October 14 and are identical every night. SC2155 is a real issue on line 9, but the df result isn't what failed",
        "SC2155 is the root cause: fixing line 9 makes the script exit on errors",
        "The CIFS message shows the cron job couldn't reach the share, so it wrote to local disk"
      ],
      answer:1,
      why:"Match times and mechanisms. The failure starts the night after the database upgrade, at 02:15 every night, with pg_dump's own error message. The share is mounted and writable, since 20-byte files keep arriving. Fixing SC2155 on line 9 would not help while the function is still called in an if." }
  ],
  task:{ prompt:"Write the incident note and the corrected script. Explain why the job reported success while writing empty dumps (cite the evidence), what you did first and why, the fixed backup function and control flow, how you verify a dump is real, and the monitoring that would have caught this on the first night.",
    rubric:[
      "Explains the empty files: since the October 13 upgrade, pg_dump 16.14 aborts against the 17.10 server, and gzip of empty input is 20 bytes.",
      "Explains the false OK: errexit is suspended for the whole backup_db call because it is an if condition, pipefail's status is never tested, and the function returns its last command's 0. Notes that SC2310 needs -o all and that SC2155 is unrelated.",
      "Puts preserving crm-2026-10-12 and -13 and stopping the prune first, then takes and verifies a fresh dump today.",
      "Corrects the script: a pg_dump that matches the server (run inside the container, or client 17), the status checked explicitly (or PIPESTATUS), a temporary file verified with pg_restore --list and a size check, then an atomic mv, failure alerts through an ERR trap, and backup_db no longer called in an if.",
      "Bases retention on verified dumps (for example keeping the newest 14 good ones) instead of age alone.",
      "Adds monitoring that would have caught night one: an alert when no verified dump under 26 hours old exists or a dump is far smaller than usual, plus a scheduled test restore. Dismisses the CIFS message with the timeline."
    ],
    reference:"Since the vendor moved the database container to PostgreSQL 17 on October 13, the host's pg_dump 16.14 refuses to run (\"aborting because of server version mismatch\"). It exits non-zero before writing anything, so gzip compresses an empty stream into a 20-byte file, and gzip -l confirms 0 bytes uncompressed. The script reports success anyway. Line 15 calls backup_db as an if condition, and Bash disables errexit for everything in that context, the function body included. pipefail does set the pipeline's status to 1, but nothing tests it: the next line logs \"dump written\" and the function returns log's 0. ShellCheck flags this only with -o all (SC2310); SC2155 and the October 20 CIFS reconnect are unrelated. Worse, prune deletes by age, not by quality. First I disabled the cron job and copied the October 12 and 13 dumps off the share, because tonight's run would have deleted one and Wednesday's the last good one. Then I took a dump inside the container, where the version matches: docker exec crm-db-1 pg_dump -U backup -Fc crm > \"$tmp\" || die. The script now checks that status explicitly, runs pg_restore --list against the file inside the container, requires a sane size, and only then renames it into place. backup_db runs outside any if, with an ERR trap that posts FAILED. Prune keeps the 14 newest verified dumps. A dead-man check alerts if no verified dump under 26 hours old exists, and a monthly scratch restore proves the dumps work.",
    alternatives:[
      "Installing postgresql-client-17 from the PGDG repository on the host and pinning it to the server's major version. This is fine if the script also verifies each dump and alerts on failure, and the version is checked again after every database upgrade.",
      "Keeping the gzip pipeline but capturing rc=(\"${PIPESTATUS[@]}\") and failing if any element is non-zero. This is correct for the pipeline, but it still needs backup_db called outside the if, plus verification and safe retention.",
      "Partly right: re-adding set -e, adding set -E, or fixing SC2155 changes nothing while backup_db is still called in an if, and it leaves the age-based prune deleting the last good dumps."
    ] },
  hints:[
    "Start with the file sizes: what does a 20-byte .gz contain? Then read the log for the first night the size changed.",
    "set -e has exceptions. Where is backup_db called from, and which command's status does a function return?",
    "pg_dump 16 refuses a 17 server, and gzip of nothing is 20 bytes. 'if backup_db' disables errexit inside the function, which then returns log's 0. Save the October 12 and 13 dumps now, then dump with a matching version, verify, alert on failure and prune by verified count."
  ] },
{ id:"fcp51", kind:"case", title:"Twice the cores, the same query time", level:5, domains:["p51","p38"],
  context:"Your company runs a local retrieval service for a client's document assistant. It does a brute-force dot-product search over 10 million 1,024-dimension float32 embeddings (40.96 GB) on a used dual-socket server: 2 x 24-core Xeon, six DDR4-2933 channels per socket, 384 GB of RAM. The latency target is 250 ms per query. On one socket a query takes 0.39 s. A colleague raised OMP_NUM_THREADS to 48, expecting about 0.2 s, and got 0.37 s. He now wants to buy a GPU or a newer server. Before anyone spends money, you collect the scaling data, the NUMA layout and the code, and write the recommendation.",
  evidence:[
    { label:"Scaling runs (one query = one full pass over the 40.96 GB)",
      text:"threads  CPUs used (default placement)   time/query   effective GB/s\n  1      core 0                          3.10 s        13.2\n  6      cores 0-5                       0.62 s        66.1\n 12      cores 0-11                      0.44 s        93.1\n 24      cores 0-23 (socket 0)           0.39 s       105.0\n 48      cores 0-47 (both sockets)       0.37 s       110.7\n 96      all hardware threads            0.40 s       102.4\n\nSTREAM Triad from the 2025 acceptance test (GB/s):\n  socket 0 only, 24 threads                    104.1\n  both sockets, 48 threads, OMP_PROC_BIND=spread,\n  arrays initialized in parallel               207.3\n\nRun script:\n  export OMP_NUM_THREADS=48\n  ./vsearch --emb /data/emb.f32 --queries q.f32\n  (OMP_PROC_BIND and OMP_PLACES not set)" },
    { label:"NUMA layout and where the process's memory lives",
      text:"$ numactl --hardware\navailable: 2 nodes (0-1)\nnode 0 cpus: 0-23 48-71\nnode 0 size: 191915 MB\nnode 0 free: 148210 MB\nnode 1 cpus: 24-47 72-95\nnode 1 size: 193526 MB\nnode 1 free: 189873 MB\nnode distances:\nnode   0   1\n  0:  10  21\n  1:  21  10\n\n$ numastat -p $(pgrep vsearch)\nPer-node process memory usage (in MBs) for PID 61842 (vsearch)\n                           Node 0          Node 1           Total\n                  --------------- --------------- ---------------\nHuge                         0.00            0.00            0.00\nHeap                        41.22            0.00           41.22\nStack                        0.07            0.05            0.12\nPrivate                  39418.31          294.66        39712.97\n                  --------------- --------------- ---------------\nTotal                    39459.60          294.71        39754.31" },
    { label:"vsearch.c (excerpt), built with gcc -O3 -march=native -fopenmp",
      text:"float *emb = malloc((size_t)N * D * sizeof(float));   /* N = 10,000,000, D = 1024 */\nFILE *f = fopen(path, \"rb\");\nif (fread(emb, sizeof(float), (size_t)N * D, f) != (size_t)N * D) die(\"short read\");\nfclose(f);                                             /* load: 21 s, one thread */\n\n/* per query */\n#pragma omp parallel for schedule(dynamic, 1024)\nfor (size_t i = 0; i < N; i++) {\n    const float *v = emb + i * D;\n    float s = 0.0f;\n    #pragma omp simd reduction(+:s)\n    for (int d = 0; d < D; d++) s += v[d] * q[d];\n    score[i] = s;\n}\ntopk_select(score, N, K);                              /* 2 ms */" },
    { label:"Colleague's note and the RAS counters",
      text:"Note: \"Scaling stops at one socket, so we're compute-limited. An H100\nwould be ~100x faster on FLOPs. Also look at the memory error below -\nnode 1 might be bad, which would explain why socket 1 adds nothing.\"\n\n$ dmesg -T | grep EDAC\n[Mon Oct 26 08:02:41 2026] EDAC MC1: 1 CE memory read error on\n  CPU_SrcID#1_MC#0_Chan#2_DIMM#0 (channel:2 slot:0 page:0x5c21f3\n  offset:0x880 grain:32 syndrome:0x0)\n\n$ sudo ras-mc-ctl --error-count\nLabel                              CE   UE\nCPU_SrcID#1_MC#0_Chan#2_DIMM#0      1    0\n(all 11 other DIMMs)                0    0\n(uptime 23 days)" }
  ],
  questions:[
    { id:"fcp51q1",
      q:"Why does going from 24 threads on one socket to 48 threads on two barely change the query time?",
      options:[
        "Amdahl's law: the serial part of each query dominates once there are more than 24 threads",
        "One thread ran fread into a fresh malloc buffer, so under first-touch placement every page landed on node 0 (numastat: about 39.4 GB on node 0, almost nothing on node 1). All 48 threads stream from node 0's six channels (about 105 GB/s), and socket 1's reads also cross the socket interconnect. The second socket adds cores but no memory bandwidth",
        "Hyper-threading makes the two sockets compete for the same FPUs",
        "The dynamic schedule's chunk handout costs more than the work at 48 threads"
      ],
      answer:1,
      why:"Effective bandwidth tops out at 105-111 GB/s, which is node 0's STREAM figure, whatever the thread count. The loop is fully parallel and top-k takes only 2 ms, so Amdahl doesn't explain it, and 1 to 24 threads already gave 7.9x. HT threads share each core's bandwidth and only add contention (0.40 s)." },
    { id:"fcp51q2",
      q:"Where does this kernel sit on the roofline, and what is the best query time this server can reach?",
      options:[
        "Compute-bound: 20.5 GFLOP per query at about 3.7 TFLOPS is about 6 ms, so the SIMD code is simply inefficient",
        "It's bound by L3 misses that better software prefetching would remove",
        "It's compute-bound, so a GPU's FLOP advantage translates directly into a 100x speedup",
        "Each element brings 4 bytes and 2 FLOPs, about 0.5 FLOP/byte, far left of the machine's ridge point (about 3.7 TFLOPS / 207 GB/s, roughly 18 FLOP/byte). It is memory-bound, so the floor is bytes / bandwidth: 40.96 GB / about 207 GB/s, about 0.20 s, using both nodes' memory"
      ],
      answer:3,
      why:"At 0.5 FLOP/byte, a streaming pass over 41 GB is limited by DRAM bandwidth no matter how fast the FMAs are. The CPU's 3.7 TFLOPS would need roughly 7 TB/s to feed this loop. Reaching 0.2 s requires both sockets' memory controllers. A GPU helps only through its own memory bandwidth, and only if 41 GB fits in its memory." },
    { id:"fcp51q3", q:"Which change actually uses both nodes' bandwidth?",
      options:[
        "Allocate, then first-touch the array in parallel with the same schedule(static) partition the search uses (or have each thread pread its own chunk). Change the search loop to schedule(static), and bind threads with OMP_PROC_BIND=spread and OMP_PLACES=cores, so each thread streams pages from its own node",
        "Run under numactl --membind=1 so all memory moves to node 1",
        "Set OMP_NUM_THREADS=96 to use the hyper-threads",
        "Enable transparent huge pages, because TLB misses are the real bottleneck"
      ],
      answer:0,
      why:"Pages go where they are first written, and a thread stays local only if it later reads the same range it touched. That requires a static partition used identically in both loops, plus pinned threads. dynamic scheduling hands chunks to whichever thread is free, so it scatters remote accesses. --membind=1 just moves the bottleneck to node 1, and HT didn't help in the measurements." },
    { id:"fcp51q4", q:"How should you treat the corrected memory error on node 1?",
      options:[
        "As the cause: a failing DIMM throttles node 1, which is why socket 1 adds nothing",
        "As a reason to disable node 1 and run on socket 0 only",
        "As a red herring. One corrected error in 23 days is ECC doing its job, has no measurable effect on bandwidth, and the process barely uses node 1 memory anyway. Record it and watch the trend",
        "As proof that the server must be replaced before tuning anything"
      ],
      answer:2,
      why:"Correctable errors are corrected transparently. A rising count on one DIMM would justify a replacement ticket, but a single event explains nothing about a bandwidth ceiling that numastat and first-touch already explain completely." }
  ],
  task:{ prompt:"Write the recommendation for the team. Diagnose the scaling limit with the roofline and NUMA evidence, give the code and run changes with the query time you expect and why, explain how you will verify them, and say whether new hardware is justified, along with what you would try next for more headroom.",
    rubric:[
      "Places the kernel on the roofline (about 0.5 FLOP/byte against a ridge near 18 FLOP/byte) and computes the floor as bytes / bandwidth (40.96 GB at about 105-111 GB/s gives 0.37-0.39 s now, and at about 207 GB/s gives about 0.20 s).",
      "Diagnoses first-touch: the single-threaded fread placed all pages on node 0 (numastat), so the second socket adds no bandwidth and reads cross the interconnect. Rules out Amdahl and hyper-threading with the data.",
      "Fixes placement: parallel first-touch or chunked pread with the same schedule(static) as the search, the search loop changed from dynamic to static, and threads bound with OMP_PROC_BIND=spread and OMP_PLACES=cores.",
      "Verifies: numastat shows about half the array on each node, effective bandwidth near 200 GB/s and a query time near 0.20 s, under the 250 ms target.",
      "Dismisses the corrected ECC error and the compute-bound GPU argument, and offers next steps for headroom, such as batching queries to raise intensity, float16 or int8 storage to cut bytes, or an approximate-nearest-neighbor index."
    ],
    reference:"The search is memory-bound, and the second socket added cores but no memory. Each element costs 4 bytes and 2 FLOPs, about 0.5 FLOP/byte, against a ridge point near 18 FLOP/byte (3.7 TFLOPS / 207 GB/s). Query time is therefore bytes divided by bandwidth: 40.96 GB at the measured 105-111 GB/s is 0.37-0.39 s, whichever socket's cores do the reading. The bandwidth stops at one node because one thread ran fread into a freshly malloc'ed buffer, and under Linux's first-touch policy every page went to that thread's node: numastat shows 39.4 GB on node 0 and 0.3 GB on node 1. With 48 threads, socket 1's cores pull from node 0 across the interconnect, so node 0's six channels (104 GB/s on STREAM) stay the limit. Amdahl doesn't apply, because the loop is fully parallel and top-k takes 2 ms. HT only adds contention, and the single corrected ECC event is noise. Fix: allocate, then touch or pread each thread's chunk in a schedule(static) loop. Switch the search loop from dynamic to the same static schedule, and run 48 threads with OMP_PROC_BIND=spread and OMP_PLACES=cores. Verify that numastat shows about 19.5 GB per node and that the effective bandwidth approaches STREAM's 207 GB/s, which gives about 0.20 s per query, inside the 250 ms target. This evidence doesn't justify new hardware. For more headroom, batch concurrent queries into one pass (a matrix multiply raises FLOPs per byte), store vectors as float16 to halve the bytes, or move to an ANN index.",
    alternatives:[
      "numactl --interleave=all ./vsearch: a one-line fix with no code change that spreads pages round-robin over both nodes. About half of each thread's reads stay remote, so expect slightly less than the first-touch fix, but likely still under 250 ms.",
      "Two processes, one per socket, each bound with numactl --cpunodebind=N --membind=N and holding half the vectors, with top-k results merged. Locality is excellent at the cost of more operational complexity.",
      "Partly right: a GPU with enough memory for 41 GB does have far more bandwidth, but buying one to fix what is a page-placement problem costs money the CPU fix doesn't, and the case for it would have to rest on future load, not on this data."
    ] },
  hints:[
    "Compute GB/s for each row of the scaling table and compare it with the STREAM figures. Where does it flatten, and at what value?",
    "Linux places a page on the node of the thread that first writes it. Which thread wrote all 40 GB, and what does numastat say about where it lives?",
    "A single-threaded fread put every page on node 0, so 48 threads share one node's roughly 105 GB/s. First-touch in parallel with schedule(static), use the same schedule in the search, bind with OMP_PROC_BIND=spread and OMP_PLACES=cores, and expect about 0.20 s."
  ] },
{ id:"fcp52", kind:"case", title:"The curing oven that overshoots after every door opening", level:4,
  domains:["p52"],
  context:"Your fiber shop cures epoxy-polish connectors in a small benchtop oven you retrofitted with a microcontroller, a thermocouple and a solid-state relay. The cure profile is 120 °C, and the connector boots and 900 µm buffer start to deform above 140 °C. Holding temperature works well: the log sits within a degree of 120 for hours. But every time a tech opens the door for 45 seconds to load a new tray, the oven recovers and then shoots far past the setpoint. Twelve connectors were scrapped this week with warped boots. A coworker already lowered one gain on a bench unit and says the problem is \"mostly fixed\". The shop manager wants the real cause, a fix and a test that proves it before Monday's 300-connector job.",
  evidence:[
    { label:"Controller code (runs once per second; output drives the SSR duty cycle)",
      text:"KP = 4.0      # % output per degC of error\nKI = 0.08     # % output per degC per second\nDT = 1.0      # s\ninteg = 38.0  # % (value it settles to while holding 120 C)\n\ndef step(setpoint, temp):\n    global integ\n    err = setpoint - temp\n    integ += KI * err * DT\n    out = KP * err + integ\n    return max(0.0, min(100.0, out))   # SSR duty, 0-100 %" },
    { label:"Controller log, door opened at t=0 s and closed at t=45 s (setpoint 120 C)",
      text:"t(s)  temp_C   err     P%      I%     out%\n -10   120.0    0.0     0.0    38.0    38.0\n   0   120.0    0.0     0.0    38.0    38.0\n  15    95.5   24.5    97.8    53.6   100.0\n  30    81.1   38.9   155.5    91.6   100.0\n  45    71.8   48.2   192.9   143.9   100.0\n  60    81.7   38.3   153.2   196.1   100.0\n  90   100.1   19.9    79.5   266.3   100.0\n 120   116.8    3.2    12.8   294.3   100.0\n 150   131.9  -11.9   -47.5   284.2   100.0\n 180   145.5  -25.5  -102.1   239.6   100.0\n 210   152.4  -32.4  -129.4   166.7    37.2\n 240   143.9  -23.9   -95.5    97.2     1.7\n 270   132.7  -12.7   -50.7    53.2     2.5\n 300   124.4   -4.4   -17.8    33.1    15.4\n 330   120.1   -0.1    -0.5    28.2    27.6\n 420   119.1    0.9     3.6    36.2    39.7\npeak 152.6 C at t=204 s" },
    { label:"Shop notes and alarms this week",
      text:"Mon 07:40  SSR heatsink temperature 61 C - warning threshold 60 C (cleared 07:52)\nMon 09:15  Thermocouple reading jitters +/-0.6 C at steady state\nTue 13:05  Tray 3 scrapped: boots warped (12 connectors)\nWed 10:30  Bench unit: KI lowered 0.08 -> 0.02. Door test peak 132.0 C.\nWed 11:10  Bench unit after a full 24-connector cold tray: 9 min to settle\n           back within 1 C of 120 (was about 3 min with KI=0.08)\nThu 08:00  Manager: \"Add derivative action, that fixes overshoot.\"" }
  ],
  questions:[
    { id:"fcp52q1",
      q:"Why does the oven hold 120 °C well for hours but overshoot by about 30 °C after a door opening?",
      options:[
        "The thermocouple lags the air temperature, so the controller sees the rise too late",
        "While the output is stuck at 100 % the integral keeps accumulating error, so when the temperature reaches the setpoint the integral alone still demands full power",
        "The proportional gain is too high, so the loop is close to instability at the setpoint",
        "The SSR overheats and switches on unpredictably after long full-power periods"
      ],
      answer:1,
      why:"The log shows I rising from 38 % to 294 % between t=0 and t=120 s while out is pinned at 100 %. That is integral windup: the extra integral is useless while saturated, and at t=120 s the oven is almost at setpoint with P near zero but I near 294 %, so the heater stays fully on. At steady state none of this happens, which is why holding is fine. The SSR warning cleared quickly and does not explain the pattern." },
    { id:"fcp52q2",
      q:"The bench unit with KI = 0.02 peaked at 132 °C instead of 152.6 °C. What is the best reading of that result?",
      options:[
        "The fix works; 132 °C is below the 140 °C limit, so ship it",
        "It proves the original gains were unstable",
        "It shows the problem is the thermocouple placement",
        "It shrinks the symptom because the integral winds up four times slower, but the windup mechanism is still there and every load disturbance is now corrected four times more slowly"
      ],
      answer:3,
      why:"Lowering KI reduces how fast the integral grows during saturation, so the overshoot shrinks, but a longer door opening or a colder tray will wind it up again. It also weakens normal disturbance rejection: the shop note shows recovery after a cold tray took 9 minutes instead of about 3. The mechanism, integrating while saturated, is untouched." },
    { id:"fcp52q3", q:"Which change addresses the root cause?",
      options:[
        "Stop the integrator from accumulating while the output is saturated (conditional integration or clamping), or feed back the difference between commanded and actual output (back-calculation)",
        "Add derivative action as the manager suggests",
        "Raise the sample rate from 1 Hz to 10 Hz",
        "Lower KP so the output saturates less often"
      ],
      answer:0,
      why:"Anti-windup prevents the integral from growing when the actuator cannot respond. Derivative action reacts to the rate of change and adds noise from the jittery thermocouple, but it does not remove an integral that is already 250 % too large. The plant's time constant is minutes, so 1 Hz sampling is adequate. Lowering KP would slow every response." },
    { id:"fcp52q4",
      q:"At t=150 s the integral is 284 % and it must come back down to about 38 % before the heater stops being driven hard. If the error averages about -25 °C during the overshoot, roughly how long does that unwinding take?",
      options:["About 12 seconds","About 60 seconds","About 120 seconds","About 250 seconds"],
      answer:2,
      why:"The integral changes by KI × error per second: 0.08 × (-25) = -2 % per second. To fall by 284 - 38 = 246 % takes about 123 seconds. The log agrees: I falls from 284 % at t=150 to 53 % at t=270, 120 seconds later. That long unwind is the overshoot you see." }
  ],
  task:{ prompt:"Write the engineering note for the shop manager: identify the root cause with the specific log values that prove it, explain why lowering KI and adding derivative action are not the fix, give the corrected controller logic (pseudocode is fine), and describe the acceptance test you will run before Monday, including pass criteria and a safety measure that does not depend on the control software.",
    rubric:[
      "Names integral windup and cites the evidence: I grows from 38 % to about 294 % while the output is pinned at 100 %, and P is near zero at t=120 s while the heater is still fully on",
      "Explains why KI=0.02 only shrinks the symptom and slows normal disturbance recovery (the 9-minute settle), and why derivative action does not remove the accumulated integral and amplifies thermocouple noise",
      "Gives a correct anti-windup method in code: conditional integration or clamping (do not integrate when saturated in the direction of the error, or clamp the integral to the output range), or back-calculation",
      "Defines a repeatable acceptance test (45 s and a longer door opening, plus a cold full tray) with numeric pass criteria such as peak no more than 3 °C over setpoint and settling within a stated time",
      "Adds an independent over-temperature cutoff (a thermal fuse or a separate high-limit controller) below the 140 °C damage point"
    ],
    reference:"Root cause: integral windup. While the door is open and during recovery, the heater output is pinned at 100 %, so the extra integral it requests cannot be delivered, yet the code keeps adding KI × error every second. The log shows the integral rising from 38 % at t=0 to 294 % at t=120 s. At t=120 s the oven is only 3.2 °C below setpoint, so the proportional term is 12.8 %, but the integral alone still demands about 300 %, so the SSR stays fully on and the oven peaks at 152.6 °C, 12 °C past the boot damage limit. Unwinding takes about two minutes at -2 % per second. Lowering KI to 0.02 slows the windup, so the peak drops to 132 °C, but it also slows normal load recovery from about 3 to 9 minutes, and a longer door opening would still exceed 140 °C. Derivative action responds to the rate of change, not to the stored integral, and would amplify the ±0.6 °C thermocouple jitter.\nFix: keep KI = 0.08 and add conditional integration. Compute the unsaturated output first, and only integrate when the output is not saturated, or when the error would pull it back out of saturation. Clamp the integral to 0–100 %. In simulation this limits the peak to about 123.5 °C.\nAcceptance test: door openings of 45 s and 90 s, then a cold 24-connector tray. Pass if the peak is no more than 3 °C over setpoint and the oven is within 1 °C of 120 within 4 minutes, three runs each. Add an independent 135 °C high-limit thermostat in series with the SSR.",
    alternatives:[
      "Back-calculation anti-windup (integrator fed with Kt × (actual output - commanded output)) is equally correct and handles slowly varying saturation smoothly.",
      "Setpoint weighting or a slower setpoint ramp after the door closes reduces overshoot further, but only together with anti-windup.",
      "Clamping the integral to a fixed range such as 0–60 % helps, but is only partly right: a fixed clamp can be too small for a cold tray and still allows some windup."
    ] },
  hints:[
    "Look at the I% column while out% is stuck at 100 %. What is the integral doing that the heater cannot?",
    "At t=120 s, add P% and I%. Why is the heater still fully on when the oven is almost at setpoint?",
    "Integral windup: the integrator keeps accumulating while the actuator is saturated. The fix is to stop or limit integration during saturation, not to change the gains."
  ] },
{ id:"fcp54", kind:"case", title:"The managed-IT contract that loses money every month", level:4,
  domains:["p54","p26"],
  context:"Your small IT and AI services agency signed a fixed-fee managed IT contract with a dental group in March: $1,800 a month for 22 users. The client is happy and has referred two other practices. But your bookkeeper flags that this account lost money in August, more in September and $843 in October, and asks whether to drop the client. Your technician says \"they just need a lot of help lately.\" You have the contract, three months of time logs from your PSA tool and the account's profit and loss. Decide what is actually wrong, what the contract already lets you do, and what to say to the client before the November invoice goes out.",
  evidence:[
    { label:"Managed services agreement, schedule A (excerpt)",
      text:"Monthly fee: $1,800, based on 22 covered users. User count is reviewed\n  quarterly; the fee adjusts by $81.82 per user added or removed.\nIncluded: unlimited remote help-desk support for covered users and devices,\n  business hours (Mon-Fri 7:00-18:00); 2 hours of onsite time per month.\nExcluded (quoted separately at $125/hour or fixed price, approved in writing\n  before work starts): projects, including new systems, software migrations,\n  office moves and hardware refreshes.\nAfter-hours work (outside the hours above): $150/hour, billed monthly.\nOnsite time beyond the included 2 hours: $125/hour." },
    { label:"PSA time report for this client (hours)",
      text:"Category                         Aug    Sep    Oct\nRemote tickets (routine)          8.5    9.0    9.0\nNew-user setup                    2.0    3.0    5.5\nImaging software migration        4.0    6.5    9.0\nOnsite visits                     3.0    4.0    4.0\nAfter-hours (patch window/outage) 4.0    3.5    4.0\nTotal                            21.5   26.0   31.5\nCovered users at month end         24     26     29\nBillable time entered in PSA      0.0    0.0    0.0\nNote: technician logged all time under \"Managed - included\"." },
    { label:"Account P&L (bookkeeper) and a vendor notice",
      text:"                     Aug       Sep       Oct\nRevenue           $1,800    $1,800    $1,800\nLabor at $68/h    $1,462    $1,768    $2,142\nTools $14/user      $336      $364      $406\nBackup storage       $95       $95       $95\nProfit              -$93     -$427     -$843\nVendor notice: Microsoft 365 Business Premium price increases next\nquarter. (This client's licenses are billed separately as a pass-through\nat cost plus 10%, not inside the managed fee.)" }
  ],
  questions:[
    { id:"fcp54q1",
      q:"What was the account's effective revenue per hour of work in October, and what does it tell you?",
      options:[
        "About $57 per hour, below the $68 loaded cost, so every hour worked loses money before tools are counted",
        "About $68 per hour, exactly break-even on labor",
        "About $82 per hour, profitable on labor but not on tools",
        "About $125 per hour, the contract's project rate"
      ],
      answer:0,
      why:"$1,800 ÷ 31.5 hours = about $57 per hour. Your loaded labor cost is $68 per hour, so the account loses about $11 on every hour even before $501 of tools and storage. The trend matters too: hours rose from 21.5 to 31.5 while revenue stayed flat." },
    { id:"fcp54q2",
      q:"Which single item accounts for the most unrecovered revenue in October?",
      options:[
        "The Microsoft 365 price increase",
        "Seven new users without the quarterly fee adjustment",
        "After-hours work not billed at $150 per hour",
        "The imaging-software migration logged as included support, which the contract excludes as a project"
      ],
      answer:3,
      why:"The contract excludes software migrations and bills them at $125 per hour: 9.0 hours is $1,125 in October alone. After-hours is $600 (4 × $150), the user true-up is about $573 (7 × $81.82), and extra onsite is $250. The Microsoft 365 increase is a red herring: those licenses are billed as a pass-through, outside the managed fee." },
    { id:"fcp54q3", q:"What is the best first move with the client?",
      options:[
        "Send a clear account review: apply the quarterly user adjustment the contract already provides, bill after-hours and extra onsite time going forward, and quote the remaining migration work as a project for approval",
        "Quietly lower the service level so the hours fall",
        "Drop the client at renewal, since the account loses money",
        "Raise the monthly fee by 50 % at renewal without explanation"
      ],
      answer:0,
      why:"The contract already prices the work that is causing the loss; your agency has not been enforcing it. A transparent review, backed by the time logs, keeps a happy, referring client and restores margin. Quietly degrading service damages trust, and dropping or surprising the client gives up a fixable account." },
    { id:"fcp54q4",
      q:"If October had been billed exactly as the contract allows, what would the account's margin have been?",
      options:["About -47 %","About 12 %","About 25 %","About 39 %"], answer:3,
      why:"Revenue would be $1,800 + $573 user adjustment + $1,125 project + $600 after-hours + $250 extra onsite = $4,348. Cost is $2,142 labor + $501 tools and storage = $2,643. Profit $1,705 ÷ $4,348 = about 39 %." }
  ],
  task:{ prompt:"Write a one-page account review for your own business, with the client-facing part clearly marked: the root cause of the loss with numbers from the evidence, what the contract already allows, the internal process changes that stop it recurring, and the exact message you will send the client before the November invoice. Keep it fair to a good client.",
    rubric:[
      "Computes the problem correctly: about $57 per hour effective against a $68 loaded cost, and an October loss of $843 driven by hours growing from 21.5 to 31.5",
      "Separates in-scope from out-of-scope work using the contract: migration hours (projects excluded), after-hours ($150/h), onsite beyond 2 hours ($125/h) and the quarterly user adjustment ($81.82 per user); identifies the Microsoft 365 notice as irrelevant to this margin",
      "Fixes the internal process: time-entry categories that mark billable work, a rule that projects need a written quote before work starts, a quarterly user true-up on the calendar, and a monthly margin check per account",
      "Writes a client message that is transparent and specific, references the agreement, gives the numbers, and offers a choice (e.g. a fixed-price quote to finish the migration)",
      "Shows the corrected economics (about 39 % margin for October billed as contracted) or an equivalent check that the account is profitable going forward"
    ],
    reference:"The account is not unprofitable because the client is difficult; it is unprofitable because we stopped enforcing our own contract. In October we worked 31.5 hours for $1,800, about $57 per hour against a $68 loaded cost, and lost $843 after $501 of tools and storage. Hours grew from 21.5 to 31.5 in three months, but only 9 hours of that is routine help-desk support, which the fixed fee is meant to cover. The rest is work the agreement prices separately: 9.0 hours on the imaging-software migration (a project, $125 per hour, $1,125), 4.0 after-hours hours ($150 per hour, $600), 2 onsite hours beyond the included 2 ($250), and seven new users without the quarterly adjustment (7 × $81.82, about $573 a month). Our technician logged everything as included, so nothing reached an invoice. The Microsoft 365 increase is a pass-through and does not affect this margin.\nBilled as contracted, October would have earned $4,348 against $2,643 of cost, a 39 % margin.\nInternal changes: billable categories in the PSA, a written quote before any project starts, a quarterly user true-up, and a monthly margin review per account.\nClient message: thank them for the referrals, explain that their growth to 29 users and the migration have gone beyond the agreement's scope, apply the user adjustment from November, bill after-hours and extra onsite time as the agreement states, and send a fixed-price quote to finish the migration for their approval. We will not back-bill the migration hours already absorbed.",
    alternatives:[
      "Back-billing October's after-hours and onsite time is defensible because the agreement states those rates, but absorbing past migration hours as goodwill keeps a referring client; either choice is acceptable if explained.",
      "Moving the client to per-user pricing with project work in a prepaid block of hours is a valid restructure at renewal.",
      "Simply raising the fixed fee is partly right: it restores margin but hides the cause, and it will erode again as the client keeps growing."
    ] },
  hints:[
    "Divide October's revenue by October's hours and compare it with the loaded cost per hour.",
    "Go through the time report line by line and ask, for each category, whether the agreement includes it or prices it separately.",
    "Most of the loss is work the agreement already prices (projects, after-hours, extra onsite, added users) that was logged as included. Enforcing the contract, not dropping the client, fixes it."
  ] }
);


/* v52: missing Trusted Computing field case — defensive firmware/attestation incident. */
window.CASES.push({
  id:"fcp53", kind:"case", title:"Secure Boot rollout: attestation fails after a firmware update", level:4, domains:["p53"],
  context:"You are the platform-security engineer for a 240-device engineering fleet. After a vendor firmware update, 18 Windows laptops fail the compliance check used to release access to a sensitive build system. Users report that the machines boot normally. The change manager wants you to either waive the check today or roll back the entire fleet. Your task is to determine what the evidence actually proves, contain the risk, and recommend a controlled recovery.",
  evidence:[
    {label:"Change record",text:"Change CHG-8821: deploy firmware 1.8.4 to 240 laptops. Vendor release notes say the update refreshes Secure Boot databases and fixes a boot-chain vulnerability. Pilot: 12 devices; 2 were marked 'attestation mismatch' but the rollout was approved because both users could log in. No signed exception was recorded."},
    {label:"Representative device evidence",text:"Device ENG-044: firmware version 1.8.4; Secure Boot enabled in setup; TPM present. Compliance collector: quote signature valid; nonce matches; PCR 7 differs from the expected baseline. Event log shows a new Secure Boot dbx measurement and a boot component version not present in the baseline. Last known-good baseline was captured before the vendor update. No evidence yet that the quote was forged or that the device is compromised."},
    {label:"Fleet summary",text:"18 devices fail policy, all with firmware 1.8.4. 222 pass. The 18 failures span two hardware models. EDR reports no correlated malware alert. Help desk proposes disabling Secure Boot and allowing the devices to enroll again. Build-system access is gated by a policy that checks the signed attestation result, not merely the Secure Boot toggle."}
  ],
  questions:[
    {id:"fcp53q1",q:"What can you conclude from a valid quote, matching nonce and changed PCR 7?",options:["The device is definitely compromised","The quote is replayed because PCR values changed","The quote is cryptographically valid and fresh, but the measured state differs from the approved baseline; investigate the event log and expected change before declaring compromise","Secure Boot must be disabled because the TPM is faulty"],answer:2,why:"Quote signature and nonce support authenticity and freshness. PCR mismatch means measured state differs; it is not, by itself, proof of compromise. The event log and approved change are needed to explain the measurement."},
    {id:"fcp53q2",q:"What is the safest immediate response while the mismatch is unresolved?",options:["Disable Secure Boot and bypass the access gate for all 18 devices","Keep the policy gate in place for affected devices, preserve quote/event-log evidence, compare against vendor guidance and a verified pilot, and use a documented time-limited exception only if risk owners approve","Reimage every device immediately without preserving evidence","Delete the old baseline and enroll every device automatically"],answer:1,why:"Preserve evidence, avoid weakening the control, validate the expected measurement change, and make any exception explicit, scoped, approved and expiring."},
    {id:"fcp53q3",q:"What should the corrected baseline process include?",options:["One global PCR baseline that never changes","A baseline updated automatically whenever any device boots","A signed, versioned baseline tied to approved firmware, hardware model and change record, tested in a pilot with rollback and monitoring","A screenshot of the Secure Boot setting"],answer:2,why:"Measured state is expected to change with legitimate updates. Baselines need provenance, versioning, model awareness, change approval, pilot validation and rollback."}
  ],
  task:{prompt:"Write the incident response note for the security lead. Separate confirmed facts from hypotheses; define containment, evidence collection, validation, recovery, exception criteria, and the long-term baseline/change-control design. Include the acceptance tests that must pass before restoring build-system access.",rubric:[
    "States that valid signature plus matching nonce supports authenticity/freshness, while PCR mismatch means a different measured state and does not alone prove compromise.",
    "Preserves the TPM quote, nonce, event log, firmware version, device model, boot measurements, policy decision and change record with timestamps and hashes where appropriate.",
    "Keeps access gated for unresolved devices; does not disable Secure Boot or mass-enroll new baselines to silence the alert.",
    "Validates vendor release notes and signed firmware provenance, reproduces on a pilot device, checks the event-log-to-PCR replay, and compares known-good devices by hardware model.",
    "Defines a signed/versioned approved baseline, pilot/rollback plan, change approval, exception owner and expiry, monitoring, and successful attestation acceptance tests."
  ]},
  hints:["First separate what the cryptographic quote proves from what the PCR mismatch means.","Compare the event log with the signed change record and the baseline; don't assume either compromise or harmlessness from one signal.","Keep the access control active, preserve evidence, validate the approved update on a pilot, then publish a signed versioned baseline with rollback and expiring exceptions."]
});
