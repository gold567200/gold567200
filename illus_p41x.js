/* Third figures — Domain 41: Quantum Computing. Adds to the figures in illus_p41.js (never replaces them). */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const add=(id,figs)=>{ window.ILLUS=window.ILLUS||{}; window.ILLUS[id]=(window.ILLUS[id]||[]).concat(figs); };

  /* m1 — resource estimates for a CRQC versus today's machines (log scale) */
  const lx=n=>60+80*(Math.log10(n)-2);
  const est=(y,lab,n,st)=>text(60,y,lab,{anchor:'start',size:10,color:st})+box(60,y+6,lx(n)-60,14,'',{stroke:st,rx:3});
  add('p41m1',[{cap:"The honest timeline in one chart. Published estimates of the physical qubits needed to break RSA-2048 fell from about 20 million (2019) to under a million (2025), and 256-bit elliptic curves to under 500,000 (2026). Today's largest machines hold roughly 100–1,000 physical qubits with error rates about ten times too high, which is why most experts place a cryptographically relevant machine in the 2030s.",
    svg:svg(560,222,`${text(280,11,'QUBITS NEEDED TO BREAK PUBLIC-KEY CRYPTO',{bold:true,color:CY,size:11})}
      ${est(30,'2019 estimate, RSA-2048: ≈ 20 million (8 h)',2e7,MG)}
      ${est(66,'2025 estimate, RSA-2048: < 1 million (< 1 week)',1e6,MG)}
      ${est(102,'2026 estimate, ECC-256: < 500,000 (minutes)',5e5,AM)}
      ${text(60,138,'today\'s largest machines: ≈ 100–1,000',{anchor:'start',size:10,color:LM})}${box(60,144,80,14,'',{stroke:LM,rx:3})}${text(148,152,'errors still ~10× too high',{anchor:'start',size:10,color:DIM})}
      ${line(60,168,540,168,{stroke:DIM})}${[2,4,6,8].map(e=>line(lx(Math.pow(10,e)),165,lx(Math.pow(10,e)),171,{stroke:DIM})+text(lx(Math.pow(10,e)),180,'10'+['','','²','','⁴','','⁶','','⁸'][e],{size:10,color:DIM})).join('')}
      ${text(300,194,'physical qubits, log scale',{size:10,color:DIM})}
      ${text(280,212,'most experts: CRQC in the 2030s',{size:11,color:CY,bold:true})}`,
      'Log-scale bars: estimates of qubits needed to break RSA-2048 and ECC-256 fell to under a million, while today\'s machines hold about 100 to 1,000 qubits')}]);

  /* m2 — measuring one qubit of a two-qubit state */
  add('p41m2',[{cap:"Measuring one qubit of a two-qubit state, worked from the lecture. Qubit 1 (the left digit) reads 0 with probability ¼ + ¼ = ½, and the surviving terms, renormalized, leave (|00⟩ + |01⟩)/√2 = |0⟩ ⊗ |+⟩, a product state. It reads 1 with probability ½ and leaves |11⟩. Measurement keeps only the terms that match the outcome, then rescales them.",
    svg:svg(560,230,`${text(280,11,'MEASURE ONLY QUBIT 1 (THE LEFT DIGIT)',{bold:true,color:CY,size:11})}
      ${box(110,22,340,34,'|ψ⟩ = ½|00⟩ + ½|01⟩ + (1/√2)|11⟩',{size:12,stroke:CY,mono:true})}
      ${arrow(220,56,140,104,'')}${arrow(340,56,420,104,'')}
      ${text(155,72,'q₁ = 0\nP = ¼ + ¼ = ½',{anchor:'end',size:10,color:LM})}${text(406,72,'q₁ = 1\nP = ½',{anchor:'start',size:10,color:AM})}
      ${box(20,106,240,44,'keep |00⟩, |01⟩; renormalize:\n(|00⟩ + |01⟩)/√2',{size:10,stroke:LM,lh:16})}
      ${box(300,106,240,44,'only |11⟩ survives:\n|11⟩',{size:10,stroke:AM,lh:16})}
      ${arrow(140,150,140,170,'')}${arrow(420,150,420,170,'')}
      ${box(20,172,240,32,'= |0⟩ ⊗ |+⟩, a product state',{size:10,stroke:LM,color:LM,bold:true})}
      ${box(300,172,240,32,'= |1⟩ ⊗ |1⟩',{size:10,stroke:AM,color:AM,bold:true})}
      ${text(280,221,'keep matching terms, then renormalize',{size:10,color:DIM})}`,
      'Measurement tree: measuring qubit 1 gives 0 or 1 with probability one half each, leaving a product state in each branch')}]);

  /* m3 — no-cloning as amplitudes */
  const bars=(x0,amps,st)=>amps.map((a,i)=>{ const cx=x0+i*58, h=a*70; return (h>0?box(cx-18,170-h,36,h,'',{stroke:st,rx:2}):line(cx-18,170,cx+18,170,{stroke:DIM}))+text(cx,170-h-8,a===0?'0':(a>0.6?'0.71':'0.5'),{size:10,color:st})+text(cx,182,['00','01','10','11'][i],{size:10,mono:true,color:DIM}); }).join('');
  add('p41m3',[{cap:"The no-cloning proof drawn as amplitudes. A machine that copies |0⟩ and |1⟩ must, by linearity, turn |+⟩|0⟩ into (|00⟩ + |11⟩)/√2 — but a true copy |+⟩|+⟩ has all four amplitudes equal to ½. They are different vectors, so no unitary can clone an unknown state; that is also why an eavesdropper cannot copy QKD photons.",
    svg:svg(560,218,`${box(10,8,540,42,'if U|0⟩|0⟩ = |00⟩ and U|1⟩|0⟩ = |11⟩,\nthen by linearity U|+⟩|0⟩ = (|00⟩ + |11⟩)/√2',{size:11,stroke:CY,lh:16})}
      ${text(140,72,'(|00⟩ + |11⟩)/√2',{size:11,bold:true,color:CY})}${text(140,86,'what linearity gives',{size:10,color:DIM})}
      ${text(420,72,'|+⟩|+⟩ = ½(|00⟩+|01⟩+|10⟩+|11⟩)',{size:11,bold:true,color:MG})}${text(420,86,'what a copy needs',{size:10,color:DIM})}
      ${line(280,64,280,186,{dash:true,stroke:DIM})}
      ${bars(53,[0.707,0,0,0.707],CY)}${bars(333,[0.5,0.5,0.5,0.5],MG)}
      ${text(280,207,'different vectors → no unitary copies',{size:11,color:AM,bold:true})}`,
      'Bar charts of amplitudes: linearity produces 0.71, 0, 0, 0.71 while a true clone needs 0.5 in all four basis states')}]);

  /* m4 — the VQE loop */
  add('p41m4',[{cap:"VQE runs a loop between two computers. The QPU prepares a short parameterized circuit, the Estimator measures its energy E(θ), and a classical optimizer such as COBYLA or SPSA proposes new parameters. For H₂ at 0.735 Å the loop recovers the ground energy −1.8573 hartree to three decimals on a simulator, and the variational principle guarantees the estimate never drops below the true value.",
    svg:svg(560,225,`${text(280,11,'VQE: A QUANTUM–CLASSICAL LOOP',{bold:true,color:CY,size:11})}
      ${box(15,24,140,52,'parameterized circuit\n|ψ(θ)⟩ on the QPU',{size:11,stroke:MG,lh:16})}${arrow(156,50,203,50,'run')}
      ${box(205,24,150,52,'Estimator measures\nE(θ) = ⟨ψ(θ)|H|ψ(θ)⟩',{size:11,stroke:AM,lh:16})}${arrow(356,50,403,50,'E(θ)')}
      ${box(405,24,140,52,'classical optimizer\nCOBYLA or SPSA',{size:11,stroke:CY})}
      <path d="M475 76 L475 100 L85 100 L85 79" fill="none" stroke="currentColor" stroke-width="1.3" marker-end="url(#ah)"/>${text(280,111,'updated θ',{size:11,color:DIM})}
      ${box(15,122,530,40,'H₂ at 0.735 Å as two qubits:\n−1.0524·II + 0.3979·IZ − 0.3979·ZI − 0.0113·ZZ + 0.1809·XX',{size:10,mono:true})}
      ${box(15,174,258,40,'converges to −1.8573 hartree\n(3 decimals, simulator)',{size:10,stroke:LM})}
      ${box(287,174,258,40,'never below the true ground\nenergy: variational principle',{size:10,stroke:AM})}`,
      'VQE loop: the QPU prepares a parameterized state, the Estimator measures its energy, a classical optimizer updates the parameters')}]);

  /* m5 — the three-qubit bit-flip code */
  const syn=(x,s,act,st)=>box(x,96,125,28,s,{size:11,mono:true})+arrow(x+62,124,x+62,146,'')+box(x,148,125,30,act,{size:10,stroke:st,color:st});
  add('p41m5',[{cap:"The three-qubit bit-flip code. Two CNOTs spread α|0⟩ + β|1⟩ into α|000⟩ + β|111⟩ (entangled, not three copies); two ancillas measure the parities Z₁Z₂ and Z₂Z₃, and that syndrome names the flipped qubit without revealing α or β. The code fails only when two or more qubits flip: p_L = 3p² − 2p³, or 2.98 × 10⁻⁴ at p = 1%.",
    svg:svg(560,230,`${text(280,11,'FIND THE FLIP WITHOUT READING THE STATE',{bold:true,color:CY,size:11})}
      ${box(10,24,150,34,'α|0⟩ + β|1⟩',{size:12,stroke:CY,mono:true})}${arrow(161,41,218,41,'CNOT ×2')}
      ${box(220,24,170,34,'α|000⟩ + β|111⟩',{size:12,stroke:CY,mono:true})}${text(400,41,'entangled,\nnot 3 copies',{anchor:'start',size:10,color:DIM})}
      ${text(280,82,'syndrome = (Z₁Z₂, Z₂Z₃) from two ancillas',{size:10,color:AM})}
      ${syn(15,'(0, 0)','no flip',LM)}${syn(150,'(1, 0)','X on qubit 1',AM)}${syn(285,'(1, 1)','X on qubit 2',AM)}${syn(420,'(0, 1)','X on qubit 3',AM)}
      ${text(280,198,'α and β never measured: superposition survives',{size:10,color:CY})}
      ${text(280,216,'p_L = 3p² − 2p³: at 1%, 2.98 × 10⁻⁴',{size:11,color:LM,bold:true})}`,
      'Repetition code: encoding with two CNOTs, then a four-entry syndrome table mapping parity results to the qubit to correct')}]);

  /* m6 — predict the Bell result from calibration data */
  add('p41m6',[{cap:"Predict, then run. From ibm_kingston's calibration — CZ error 2.0 × 10⁻³, readout errors 1.5% and 1.8% — the Bell circuit should be error-free about 96.5% of the time, so about 3.5% of shots should land on the forbidden 01 and 10. A 4,000-shot run gave 3.6%, within one standard error; the Estimator's ⟨ZZ⟩ rises from about 0.93 to 0.99 once TREX removes readout bias.",
    svg:svg(560,232,`${text(280,11,'BELL STATE ON ibm_kingston, PREDICTED FIRST',{bold:true,color:CY,size:11})}
      ${box(10,24,130,24,'CZ error 2.0 × 10⁻³',{size:10})}${box(10,54,130,24,'readout error 1.5%',{size:10})}${box(10,84,130,24,'readout error 1.8%',{size:10})}
      ${arrow(141,36,168,56,'')}${arrow(141,66,168,66,'')}${arrow(141,96,168,76,'')}
      ${box(170,44,175,44,'0.998 × 0.985 × 0.982\n≈ 0.965 error-free',{size:10,stroke:CY})}${arrow(346,66,373,66,'')}
      ${box(375,44,175,44,'predict ≈ 3.5%\non 01 and 10',{size:11,stroke:AM,color:AM,bold:true})}
      ${arrow(462,88,462,128,'compare',{dash:true})}
      ${box(10,130,280,44,'measured, 4,000 shots:\n00 1938 · 11 1918 · 01 77 · 10 67',{size:10,mono:false})}${arrow(291,152,373,152,'3.6%')}
      ${box(375,130,175,44,'within one std error\n(≈ 0.3%)',{size:10,stroke:LM,color:LM,bold:true})}
      ${box(10,188,265,32,'Estimator ⟨ZZ⟩, level 0: ≈ 0.93',{size:10,stroke:DIM})}
      ${box(285,188,265,32,'level 1 (TREX): ≈ 0.99',{size:10,stroke:LM})}`,
      'Calibration numbers multiplied into a predicted 3.5 percent of forbidden Bell outcomes, compared with a measured 3.6 percent')}]);

  /* m7 — QKD over fiber: loss, no amplifiers, trusted nodes */
  add('p41m7',[{cap:"Why QKD needs trusted nodes. At 0.2 dB/km a 50 km span delivers 10% of photons, 100 km 1% and 200 km 0.01%, and no amplifier can help because an optical amplifier is a copying device, which no-cloning forbids. Long networks chain relays instead — Beijing–Shanghai uses 32 over about 2,000 km — and at every relay the key exists in the clear. The classical channels beside a QKD link are ordinary lasers: never look into a fiber end.",
    svg:svg(560,240,`${text(280,11,'QKD OVER FIBER: LOSS, THEN TRUSTED NODES',{bold:true,color:CY,size:11})}
      ${text(280,28,'at 0.2 dB/km (1550 nm)',{size:10,color:DIM})}
      ${box(10,36,170,40,'50 km = 10 dB\n10% of photons arrive',{size:10,stroke:LM})}${box(195,36,170,40,'100 km = 20 dB\n1% arrive',{size:10,stroke:AM})}${box(380,36,170,40,'200 km = 40 dB\n0.01% arrive',{size:10,stroke:MG,color:MG,bold:true})}
      ${box(10,88,540,26,'no amplifier: an EDFA copies, and no-cloning forbids it',{size:10,stroke:AM})}
      ${box(10,132,70,40,'Alice',{size:11,stroke:CY})}${arrow(81,152,123,152,'QKD')}
      ${box(125,132,90,40,'relay\nkey in clear',{size:10,stroke:MG,dash:true})}${arrow(216,152,243,152,'')}
      ${box(245,132,90,40,'relay\nkey in clear',{size:10,stroke:MG,dash:true})}${arrow(336,152,363,152,'')}
      ${box(365,132,90,40,'relay\nkey in clear',{size:10,stroke:MG,dash:true})}${arrow(456,152,478,152,'')}
      ${box(480,132,70,40,'Bob',{size:11,stroke:CY})}
      ${text(280,188,'Beijing–Shanghai: 32 relays, ≈ 2,000 km',{size:10,color:DIM})}
      ${text(280,210,'never look into a fiber end',{size:11,color:AM,bold:true})}
      ${text(280,226,'cleaved shards go in the sharps container',{size:10,color:DIM})}`,
      'Fiber loss for QKD at 50, 100 and 200 kilometres, no amplifiers, and a chain of trusted relays where the key is in the clear')}]);
})();
