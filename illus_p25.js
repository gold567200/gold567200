/* Illustrations — Domain 25: Cryptography & Applied Security Engineering, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  /* ================= DOMAIN 25: Cryptography ================= */
  I.p25m1=[{cap:"Where keys come from. Physical noise is harvested into the kernel's entropy pool and stretched by a cryptographically secure generator; every key, nonce and salt must come from the right-hand end of this pipeline, never from rand() or the clock.",
    svg:flow([{t:'physical noise\ninterrupts · jitter · RDRAND'},{t:'entropy pool\n(kernel)',stroke:AM},{t:'CSPRNG\nChaCha20 DRBG',stroke:CY},{t:'/dev/urandom\ngetrandom() · secrets'},{t:'keys · nonces\nsalts',stroke:LM}],{bw:120,gap:40,label:'From noise to keys'})},
   {cap:"The one-time pad: XOR each message bit with a truly random key bit used once and the ciphertext carries no information. Use the same key twice and the two ciphertexts XOR to the two plaintexts, with the key gone.",
    svg:svg(560,235,`${text(66,40,'message m',{size:11,color:DIM})}${text(66,90,'key k (random, once)',{size:10,color:AM})}${text(66,140,'c = m ⊕ k',{size:11,color:CY})}
      ${[0,1,0,0,1,0,0,0].map((b,i)=>box(130+i*46,22,40,36,String(b),{size:16,bold:true,stroke:DIM})).join('')}
      ${[1,0,1,1,0,1,0,1].map((b,i)=>box(130+i*46,72,40,36,String(b),{size:16,bold:true,stroke:AM,color:AM})).join('')}
      ${[1,1,1,1,1,1,0,1].map((b,i)=>box(130+i*46,122,40,36,String(b),{size:16,bold:true,stroke:CY,color:CY})).join('')}
      ${text(330,182,'every plaintext is equally likely given c: perfect secrecy (Shannon 1949)',{size:10,color:LM})}
      ${text(330,210,'reuse: c1 ⊕ c2 = (m1 ⊕ k) ⊕ (m2 ⊕ k) = m1 ⊕ m2 — the key cancels',{size:10,color:MG})}`,'One-time pad XOR and the cost of reuse')},
   {cap:"Key sizes as work. Each extra bit doubles the brute-force cost; 56 bits fell to a $250,000 machine in 1998, 128 bits would take the whole Bitcoin network about ten billion years.",
    svg:stack([{t:'DES 56-bit: fell 1998',side:'2^56 keys · 56 hours',stroke:MG},{t:'80-bit: retired',side:'≈19,000 y at 10^12 keys/s',stroke:AM},{t:'112-bit: NIST floor to 2030',side:'RSA-2048 · 3DES',stroke:AM},{t:'128-bit: AES-128 · P-256 · RSA-3072',side:'≈10^10 years',stroke:CY},{t:'256-bit: AES-256',side:'margin against Grover',stroke:LM}],{w:300,side:true,label:'Key size as brute-force work'})}];
  I.p25m2=[{cap:"The ECB penguin in miniature: ECB encrypts each block independently, so equal plaintext blocks give equal ciphertext blocks and the pattern survives. CTR and GCM mix a nonce and counter into every block, so equal inputs encrypt differently.",
    svg:compare({t:'ECB: block by block',draw:x=>['A','B','A','A'].map((t,i)=>box(x+15+i*60,45,50,32,t,{size:14,bold:true,stroke:t==='A'?CY:MG,color:t==='A'?CY:MG})).join('')+arrow(x+130,80,x+130,100,'')+['X','Y','X','X'].map((t,i)=>box(x+15+i*60,105,50,32,t,{size:14,bold:true,stroke:t==='X'?CY:MG,color:t==='X'?CY:MG})).join('')+text(x+130,155,'same block in → same block out',{size:10,color:MG})},{t:'CTR / GCM: nonce ‖ counter',draw:x=>['A','B','A','A'].map((t,i)=>box(x+15+i*60,45,50,32,t,{size:14,bold:true,stroke:t==='A'?CY:MG,color:t==='A'?CY:MG})).join('')+arrow(x+130,80,x+130,100,'')+['q','z','k','w'].map((t,i)=>box(x+15+i*60,105,50,32,t,{size:14,bold:true,stroke:LM,color:LM})).join('')+text(x+130,155,'counter changes → every block differs',{size:10,color:LM})},{h:175,label:'ECB versus counter-mode encryption'})},
   {cap:"An AEAD such as AES-GCM takes a key, a unique nonce, the plaintext and unencrypted associated data, and returns ciphertext plus a 16-byte tag. Decryption checks the tag first and refuses to release anything if a single bit changed.",
    svg:svg(560,215,`${box(20,12,150,34,'key K (256-bit)',{stroke:CY,size:10})}${box(20,52,150,34,'nonce N — never reused',{stroke:AM,size:10})}${box(20,92,150,34,'plaintext P',{size:10})}${box(20,132,150,34,'associated data A\n(header, sequence no.)',{size:9,stroke:DIM})}
      ${arrow(170,29,232,92,'')}${arrow(170,69,232,98,'')}${arrow(170,109,232,104,'')}${arrow(170,149,232,110,'')}
      ${box(232,62,110,70,'AES-GCM\nencrypt',{stroke:CY,size:12,bold:true})}
      ${arrow(342,88,400,70,'')}${arrow(342,112,400,130,'')}${box(400,52,140,36,'ciphertext C',{size:11})}${box(400,112,140,36,'tag T (16 bytes)',{stroke:AM,size:11})}
      ${text(280,196,'decrypt: verify T over C and A first; any change → reject, release nothing',{size:10,color:LM})}`,'AEAD inputs and outputs')},
   {cap:"The nonce-reuse catastrophe in CTR and GCM: the keystream depends only on key and nonce, so two messages under one nonce XOR to each other, and in GCM the authentication key leaks as well.",
    svg:svg(560,150,`${box(20,20,240,44,'c1 = m1 ⊕ KS(K, N)',{stroke:CY,size:12})}${box(300,20,240,44,'c2 = m2 ⊕ KS(K, N)',{stroke:CY,size:12})}
      ${arrow(140,64,260,96,'')}${arrow(420,64,300,96,'')}${box(150,96,260,36,'c1 ⊕ c2 = m1 ⊕ m2',{stroke:MG,size:13,bold:true})}
      ${text(280,144,'same N under K → keystream cancels; GCM also leaks H → forged tags',{size:10,color:MG})}`,'Nonce reuse cancels the keystream')}];
  I.p25m3=[{cap:"The birthday bound sizes every hash. Collisions appear near the square root of the output space, so a 128-bit digest collides in a fraction of a second on Bitcoin-scale hardware while a 256-bit digest holds for the age of the universe.",
    svg:svg(560,215,`${text(280,22,'collisions appear near √N = 2^(n/2) trials',{size:11,bold:true,color:CY})}
      ${[['MD5 · 128-bit','≈ 2^64 ≈ 1.8 × 10^19','0.02 s at 10^21 hashes/s',MG],['SHA-1 · 160-bit','≈ 2^80 ≈ 1.2 × 10^24','≈ 24 minutes',AM],['SHA-256 · 256-bit','≈ 2^128 ≈ 3.4 × 10^38','≈ 10^10 years',LM]].map(([a,b,c,col],i)=>box(20,45+i*48,130,36,a,{size:10,stroke:col,color:col})+box(165,45+i*48,170,36,b,{size:10,stroke:DIM})+box(350,45+i*48,190,36,c,{size:10,stroke:col})).join('')}
      ${text(280,200,'23 people in a room: 50.7% share a birthday — the same arithmetic',{size:10,color:DIM})}`,'Birthday-bound collision cost by digest size')},
   {cap:"A Merkle tree hashes items in pairs up to a root that commits to all of them. To prove tx2 is included you supply only the siblings on its path (h3 and H01): log2(n) hashes instead of the whole data set.",
    svg:svg(560,235,`${box(190,12,180,36,'root = H(H01 ‖ H23)',{stroke:CY,size:11,bold:true})}
      ${line(280,48,150,82)}${line(280,48,410,82)}
      ${box(60,82,180,36,'H01 = H(h0 ‖ h1)',{stroke:AM,size:11})}${box(320,82,180,36,'H23 = H(h2 ‖ h3)',{size:11})}
      ${line(150,118,75,155)}${line(150,118,210,155)}${line(410,118,345,155)}${line(410,118,480,155)}
      ${box(15,155,120,36,'h0 = H(tx0)',{size:10,stroke:DIM})}${box(150,155,120,36,'h1 = H(tx1)',{size:10,stroke:DIM})}${box(285,155,120,36,'h2 = H(tx2)',{size:10,stroke:MG,color:MG})}${box(420,155,120,36,'h3 = H(tx3)',{size:10,stroke:AM})}
      ${text(280,218,'proof for tx2: send h3 and H01 → verifier recomputes the root',{size:10,color:LM})}`,'Merkle tree with an inclusion proof')},
   {cap:"Why passwords need a salt and a slow, memory-hard hash. Against plain SHA-256 a single GPU tests tens of billions of guesses per second; against Argon2id with 64 MiB per guess the same card manages a few thousand.",
    svg:compare({t:'LEAK OF SHA-256 HASHES',draw:x=>['one GPU: ≈ 2 × 10^10 guesses/s','8-char password: 94^8 ≈ 6 × 10^15','cracked in ≈ 3.5 days','no salt → rainbow tables work'].map((l,i)=>text(x+130,52+i*28,l,{size:10,color:i===2?MG:'currentColor'})).join('')},{t:'LEAK OF ARGON2ID HASHES',draw:x=>['64 MiB per guess: ≈ 2,000 guesses/s','same password: ≈ 95,000 GPU-years','per-user salt: no tables','memory-hard: GPU cores starve'].map((l,i)=>text(x+130,52+i*28,l,{size:10,color:i===1?LM:'currentColor'})).join('')},{h:175,label:'Fast hash versus memory-hard hash after a database leak'})}];
  I.p25m4=[{cap:"Toy RSA start to finish: two primes give the modulus and φ(n); the public exponent's inverse mod φ(n) is the private exponent; encryption and decryption are one modular power each.",
    svg:flow([{t:'p = 61, q = 53'},{t:'n = 3233\nφ = 60 × 52 = 3120',stroke:CY},{t:'e = 17\nd = 17^-1 mod 3120 = 2753',stroke:AM},{t:'m = 65\nc = 65^17 mod 3233 = 2790',stroke:MG},{t:'2790^2753 mod 3233\n= 65',stroke:LM}],{bw:150,gap:40,bh:54,label:'Toy RSA with p = 61, q = 53'})},
   {cap:"Diffie–Hellman with p = 23 and g = 5. Each side raises the generator to a secret, exchanges the result, and raises what it received to its own secret; both reach 2 while the eavesdropper, holding only 8 and 19, faces the discrete logarithm.",
    svg:svg(560,240,`${box(200,12,160,34,'public: p = 23, g = 5',{stroke:DIM,size:11})}
      ${box(20,70,185,50,'Alice: secret a = 6\nA = 5^6 mod 23 = 8',{stroke:CY,size:10})}${box(355,70,185,50,'Bob: secret b = 15\nB = 5^15 mod 23 = 19',{stroke:MG,size:10})}
      ${arrow(205,84,355,84,'sends A = 8')}${arrow(355,108,205,108,'sends B = 19')}
      ${box(20,150,185,44,'Alice: 19^6 mod 23 = 2',{stroke:LM,size:11})}${box(355,150,185,44,'Bob: 8^15 mod 23 = 2',{stroke:LM,size:11})}
      ${box(215,150,130,44,'Eve sees 23, 5, 8, 19\nneeds log_5(8)',{stroke:AM,size:9,dash:true})}
      ${text(280,222,'shared secret 2 → HKDF → session key (ephemeral a, b give forward secrecy)',{size:10,color:DIM})}`,'Diffie–Hellman exchange with small numbers')},
   {cap:"NIST SP 800-57's equivalence table: every entry in a row costs about the same work to break. Curves reach 128-bit security with 256-bit keys because only generic square-root attacks are known against them.",
    svg:stack([{t:'112-bit: RSA-2048 · ECC-224 · 3DES',side:'acceptable through 2030',stroke:AM},{t:'128-bit: RSA-3072 · P-256 · X25519 · AES-128',side:'the standard today',stroke:CY},{t:'192-bit: RSA-7680 · P-384 · AES-192',side:'high assurance'},{t:'256-bit: RSA-15360 · P-521 · AES-256',side:'CNSA 2.0 class',stroke:LM}],{w:330,side:true,label:'Equivalent security strengths (SP 800-57 Part 1 Rev 5)'})}];
  I.p25m5=[{cap:"The TLS 1.3 handshake in one round trip. ClientHello and ServerHello carry ephemeral key shares in the clear; everything after ServerHello, including the certificate, is already encrypted under keys derived from the shared secret.",
    svg:svg(560,285,`${text(110,22,'CLIENT',{bold:true,color:CY})}${text(450,22,'SERVER',{bold:true,color:MG})}${line(110,34,110,262,{stroke:DIM})}${line(450,34,450,262,{stroke:DIM})}
      ${arrow(118,58,442,58,'ClientHello + key_share (X25519)')}
      ${arrow(442,100,118,100,'ServerHello + key_share')}${text(280,118,'both derive handshake keys (HKDF)',{size:9,color:LM})}
      ${arrow(442,158,118,158,'{Certificate, CertificateVerify, Finished}',{color:MG})}
      ${arrow(118,203,442,203,'{Finished}')}
      ${arrow(118,243,442,243,'application data (AES-GCM)',{color:LM})}
      ${text(280,275,'{ } = encrypted · 1 round trip · forward secrecy by construction',{size:10,color:DIM})}`,'TLS 1.3 handshake messages')},
   {cap:"A certificate chain and the two controls that keep it honest. Roots live in the browser's trust store, intermediates do the daily signing, leaves expire in weeks; every leaf is logged in Certificate Transparency so misissuance is visible.",
    svg:svg(560,210,`${box(20,15,300,40,'root CA — in the OS / browser trust store',{stroke:CY,size:11})}${arrow(170,55,170,78,'signs')}
      ${box(20,78,300,40,'intermediate CA — online, signs daily',{size:11})}${arrow(170,118,170,141,'signs')}
      ${box(20,141,300,44,'leaf: example.com (SANs)\nvalid 47–200 days · ACME-renewed',{stroke:LM,size:10})}
      ${arrow(320,163,360,110,'')}${box(360,80,180,56,'Certificate Transparency\nlog (Merkle tree) · SCTs',{stroke:AM,size:10})}
      ${box(360,150,180,40,'revocation: CRLs · CRLite\nshort lifetimes instead',{stroke:DIM,size:9,dash:true})}`,'Certificate chain, transparency and revocation')},
   {cap:"Kerberos in Active Directory: the client proves itself once to the KDC, receives a ticket-granting ticket, trades it for a service ticket encrypted under the service's key, and presents that ticket with a timestamped authenticator.",
    svg:flow([{t:'client\npassword → key'},{t:'KDC (AS)\nAS-REQ → TGT',stroke:CY},{t:'KDC (TGS)\nTGT → service ticket',stroke:AM},{t:'service\nticket + authenticator',stroke:MG},{t:'access granted\n(mutual auth, 5-min skew)',stroke:LM}],{bw:124,gap:40,bh:54,label:'Kerberos ticket flow'})},
   {cap:"Signal's double ratchet: every message key comes from a KDF chain and is deleted after use (forward secrecy); every reply mixes in a fresh Diffie–Hellman exchange, so a stolen session heals (post-compromise security). SPQR adds an ML-KEM ratchet alongside.",
    svg:cycle([{t:'send: fresh\nDH / KEM key'},{t:'root KDF mixes\nnew secret',stroke:CY},{t:'chain KDF →\nmessage key',stroke:MG},{t:'encrypt, then\ndelete the key',stroke:LM}],{label:'The double ratchet'})}];
  I.p25m6=[{cap:"What a large quantum computer changes. Shor's algorithm breaks every public-key scheme in use; Grover's only halves the exponent of symmetric brute force, so AES-256, SHA-256 and the new lattice and hash-based standards survive.",
    svg:compare({t:'BROKEN BY SHOR',draw:x=>['RSA (factoring)','Diffie–Hellman (discrete log)','ECDH · X25519','ECDSA · Ed25519','TLS certs · SSH keys · Bitcoin'].map((l,i)=>text(x+130,52+i*26,l,{size:10,color:MG})).join('')},{t:'SURVIVES (Grover only)',draw:x=>['AES-128 → 2^64 · AES-256 → 2^128','SHA-256 · SHA-3 · HMAC · HKDF','Argon2 · one-time pad','ML-KEM · ML-DSA · SLH-DSA','LMS / XMSS firmware signing'].map((l,i)=>text(x+130,52+i*26,l,{size:10,color:LM})).join('')},{h:185,label:'Quantum impact by primitive'})},
   {cap:"A hybrid key exchange runs X25519 and ML-KEM-768 side by side and feeds both secrets into HKDF; the session key is secure if either problem stays hard. This is what Chrome, OpenSSL 3.5, OpenSSH 10 and Signal already do.",
    svg:flow([{t:'X25519\nsecret (32 B)',stroke:CY},{t:'ML-KEM-768\nsecret (32 B)',stroke:MG},{t:'HKDF\n(both concatenated)',stroke:AM},{t:'session key\nsafe if either holds',stroke:LM}],{bw:112,gap:26,bh:54,label:'X25519MLKEM768 hybrid key exchange'})},
   {cap:"Harvest now, decrypt later as Mosca's inequality: if the years your data must stay secret (X) plus the years your migration takes (Y) exceed the years until a cryptographically relevant quantum computer (Z), traffic recorded today will be read.",
    svg:svg(560,200,`${box(60,38,190,30,'',{stroke:AM})}${text(70,53,'Y: migration (7 years)',{anchor:'start',size:10,color:AM})}
      ${box(250,38,270,30,'',{stroke:CY})}${text(260,53,'X: data must stay secret (25 years)',{anchor:'start',size:10,color:CY})}
      ${line(40,120,500,120)}${arrow(500,120,525,120,'')}${text(60,138,'2026',{size:10,color:DIM})}${text(520,138,'X + Y',{size:10,color:DIM})}
      ${line(380,76,380,128,{stroke:MG,dash:true})}${text(380,150,'Z: quantum computer arrives',{size:10,color:MG})}
      ${text(280,185,'Mosca: X + Y > Z → data encrypted today is readable later; migrate now',{size:10,color:LM})}`,'Mosca inequality timeline')}];
  I.p25m7=[{cap:"Envelope encryption: a root key in the HSM or KMS wraps key-encryption keys, which wrap one data-encryption key per object. Rotating the KEK re-wraps 32-byte DEKs; old KEK versions stay available to unwrap old data.",
    svg:svg(560,235,`${box(150,12,260,40,'root key — HSM / KMS, never exported',{stroke:CY,size:11,bold:true})}
      ${arrow(230,52,160,84,'wraps')}${arrow(330,52,410,84,'wraps')}
      ${box(60,84,200,40,'KEK v3 (current)',{stroke:AM,size:11})}${box(310,84,220,40,'KEK v2 (retired, still unwraps)',{stroke:DIM,size:10,dash:true})}
      ${arrow(120,124,95,158,'')}${arrow(160,124,275,158,'')}${arrow(200,124,460,158,'')}
      ${box(20,158,150,40,'DEK → file A',{stroke:LM,size:11})}${box(200,158,150,40,'DEK → file B',{stroke:LM,size:11})}${box(380,158,160,40,'DEK → DB column',{stroke:LM,size:11})}
      ${text(280,222,'rotate the KEK: re-wrap 32-byte DEKs, not terabytes · delete a DEK = crypto-shred',{size:10,color:DIM})}`,'Key hierarchy with envelope encryption')},
   {cap:"Encryption at rest and in transit defeat different adversaries. Full-disk and server-side encryption stop a thief with the hardware; TLS stops the network; only end-to-end encryption stops the service provider itself.",
    svg:compare({t:'AT REST',draw:x=>['BitLocker · LUKS · TDE · SSE-KMS','defeats: stolen disk, old backup','not: malware on a running host','not: SQL injection (app sees plaintext)'].map((l,i)=>text(x+130,52+i*28,l,{size:10,color:i<2?'currentColor':AM})).join('')},{t:'IN TRANSIT / END TO END',draw:x=>['TLS · mTLS · SSH · WireGuard','defeats: eavesdropper, MITM','not: either endpoint','E2E: the provider cannot read it'].map((l,i)=>text(x+130,52+i*28,l,{size:10,color:i===3?LM:(i===2?AM:'currentColor')})).join('')},{h:175,label:'What each encryption layer defeats'})},
   {cap:"Reading a vendor's cryptography claims. Named standard algorithms, a published protocol, dated audits and a FIPS certificate number are green flags; adjectives, proprietary ciphers and key recovery behind an end-to-end claim are red.",
    svg:compare({t:'RED FLAGS',draw:x=>['"military-grade" · "proprietary"','"256-bit" with no mode named','"E2EE" but vendor can reset keys','no audit · threatens researchers'].map((l,i)=>text(x+130,52+i*28,l,{size:10,color:MG})).join('')},{t:'GREEN FLAGS',draw:x=>['AES-256-GCM · X25519 · Argon2id','public protocol spec + threat model','dated third-party audit reports','FIPS 140-3 certificate on CMVP list'].map((l,i)=>text(x+130,52+i*28,l,{size:10,color:LM})).join('')},{h:175,label:'Vendor crypto claims: red and green flags'})},
   {cap:"The ISC2 Certified in Cybersecurity outline effective September 1, 2026, with domain weights. Modules 1–4 feed Domain 1, Module 3's passwords and Module 5's Kerberos feed Domain 3, protocols and key management feed Domain 4, and this module's practices feed Domains 2 and 5.",
    svg:stack([{t:'1 · Security Principles',side:'24%',stroke:CY},{t:'2 · Security Governance',side:'17.3%'},{t:'3 · IAM Concepts',side:'20%',stroke:AM},{t:'4 · Networking & Cloud Security',side:'21.3%',stroke:MG},{t:'5 · Security Ops & Incident Response',side:'17.3%',stroke:LM}],{w:300,side:true,label:'ISC2 CC exam domains, September 2026 outline'})}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
