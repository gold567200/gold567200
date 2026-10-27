/* Illustrations — Domain 19: DevOps, Containers & Kubernetes, built on the kit in illus_core.js */
(function(){
  const K=window.ILLUS_KIT; const {svg,text,box,arrow,line,flow,stack,pyramid,cycle,tree,compare,CY,MG,AM,LM,DIM}=K;
  const I={};
  /* ================= DOMAIN 19: DevOps, Containers & Kubernetes ================= */
  I.p19m1=[{cap:"The delivery pipeline: every change passes through the same stages, the artifact is built once and promoted unchanged, and operation feeds back into the next commit.",
    svg:flow([{t:'source\ngit commit',stroke:CY},{t:'build\ncompile · deps',edge:'on push'},{t:'test\nunit · scan',edge:'green?'},{t:'package\nimage @sha256',stroke:AM,edge:'artifact'},{t:'deploy\nstaging → prod',stroke:LM,edge:'promote'},{t:'operate\nmonitor · roll back',stroke:MG,edge:'observe'}],{perRow:3,bw:150,gap:34,bh:52,label:'The six stages of a delivery pipeline'})},
   {cap:"The five DORA metrics and the 2023 elite band. Speed and stability are not a trade-off: elite teams score well on all of them, and low performers are slow and fragile at once.",
    svg:svg(560,232,`${text(125,12,'METRIC',{size:9,color:DIM,bold:true})}${text(423,12,'ELITE BAND (DORA 2023)',{size:9,color:DIM,bold:true})}
      ${[['deployment frequency','on demand — several per day'],['change lead time','under one day'],['change fail rate','about 5%'],['failed deployment recovery time','under one hour'],['deployment rework rate (added 2024)','share of deploys that are unplanned fixes']].map(([n,e],i)=>box(14,22+i*36,222,30,n,{size:11})+arrow(238,37+i*36,298,37+i*36,'')+box(300,22+i*36,246,30,e,{size:10,stroke:LM})).join('')}
      ${text(280,216,'speed and stability rise together; low performers are slow AND fragile',{size:10,color:AM})}`,'The five DORA metrics with the elite performance band')},
   {cap:"Push versus pull. Classic CI pushes to production with credentials stored in the pipeline; GitOps keeps the credentials inside the cluster, where an agent pulls the desired state from Git and reconciles forever.",
    svg:compare({t:'PUSH DEPLOY (classic CI)',draw:x=>box(x+16,44,110,42,'CI runner\nholds prod keys',{stroke:MG,size:10})+arrow(x+126,65,x+160,65,'push')+box(x+160,44,88,42,'cluster',{size:11})+text(x+130,118,'credentials leave the pipeline;\nrollback = a new deploy',{size:10,color:DIM})},
      {t:'GITOPS (Argo CD · Flux)',draw:x=>box(x+16,44,110,42,'Git repo\ndesired state',{stroke:CY,size:10})+arrow(x+160,65,x+126,65,'pull')+box(x+160,44,88,42,'agent in\ncluster',{stroke:LM,size:10})+text(x+130,118,'keys never leave the cluster;\ngit revert = rollback',{size:10,color:DIM})},{h:150,label:'Push deployment versus GitOps pull'})}];

  I.p19m2=[{cap:"An image is a stack of read-only layers, each addressed by its digest, with one thin writable layer on top. Put the layers that change most at the top: an edit to app.py rebuilds only that layer.",
    svg:stack([{t:'writable container layer',stroke:MG,side:'copy-on-write, gone on rm'},{t:'COPY app.py',side:'rebuilt on every edit'},{t:'COPY --from=builder /venv',side:'cached until deps change'},{t:'RUN useradd -r app',side:'cached'},{t:'FROM python:3.13-slim',stroke:CY,side:'shared by every image'}],{w:300,side:true,label:'Image layers from base to writable layer'})},
   {cap:"A container is one ordinary process. Namespaces change what it can see (its own PID 1, network, filesystem, user IDs); cgroups cap what it may use; capabilities and seccomp shrink what it may ask the kernel to do. There is no second kernel.",
    svg:svg(560,252,`${text(280,16,'ONE HOST KERNEL — no second operating system',{bold:true,color:CY,size:11})}
      ${box(14,28,532,196,'',{dash:true,stroke:DIM})}${text(60,40,'host kernel',{size:9,color:DIM})}
      ${box(24,50,130,38,'pid namespace\nsees itself as PID 1',{size:9,stroke:CY})}${box(24,96,130,38,'net namespace\nown eth0 · own ports',{size:9,stroke:CY})}${box(24,142,130,38,'mnt namespace\nown / from image layers',{size:9,stroke:CY})}
      ${box(406,50,130,38,'user namespace\nroot → UID 100000',{size:9,stroke:CY})}${box(406,96,130,38,'uts · ipc · time\n· cgroup namespaces',{size:9,stroke:CY})}${box(406,142,130,38,'14 capabilities kept\nseccomp blocks syscalls',{size:9,stroke:AM})}
      ${box(200,86,160,56,'python app.py\nhost PID 48213\n(an ordinary process)',{stroke:LM,size:10,mono:true})}
      ${line(154,69,200,100)}${line(154,115,200,114)}${line(154,161,200,128)}${line(406,69,360,100)}${line(406,115,360,114)}${line(406,161,360,128)}
      ${box(170,190,220,26,'cgroup v2: memory.max 256Mi · cpu.max 1',{size:9,stroke:MG})}${arrow(280,142,280,190,'limits')}
      ${text(280,240,'over memory.max → OOM killer → exit code 137',{size:10,color:MG})}`,'A container as a process restricted by namespaces, cgroups, capabilities and seccomp')},
   {cap:"Why multi-stage builds exist: the full python:3.13 image carries a compiler toolchain; slim keeps a shell and apt; alpine and distroless are about 50 MB, and distroless has no shell for an intruder to use.",
    svg:svg(560,176,`${text(280,14,'base image size (approx.)',{bold:true,color:CY,size:11})}
      ${[['python:3.13','~1 GB',1000,MG,'build stage only'],['python:3.13-slim','~150 MB',150,AM,'good default runtime'],['python:3.13-alpine','~50 MB',50,LM,'musl: watch wheels'],['distroless/python3','~50 MB',50,CY,'no shell, no apt']].map(([n,v,mb,c,note],i)=>{ const y=30+i*34, w=Math.max(4,Math.round(mb*0.22)); const lab=v+'  · '+note; const inside=w>300; return text(150,y+11,n,{anchor:'end',size:10,mono:true})+`<rect x="158" y="${y}" width="${w}" height="22" rx="4" fill="${c}" fill-opacity="0.35" stroke="${c}" stroke-width="1"/>`+(inside?text(166,y+11,lab,{anchor:'start',size:10,color:'#e6f6ff'}):text(166+w,y+11,lab,{anchor:'start',size:10,color:DIM})); }).join('')}
      ${text(280,166,'same app, same Python: 1,000 MB versus 50 MB of attack surface and transfer',{size:10,color:AM})}`,'Approximate sizes of Python base images')}];

  I.p19m3=[{cap:"Anatomy of a workflow: a trigger starts it, jobs run on separate fresh runners (in parallel unless chained with needs:), and each job is a list of steps that share one filesystem. Files cross jobs only as artifacts.",
    svg:svg(560,234,`${box(14,14,170,40,'on:\npush · pull_request',{stroke:AM,size:10})}${arrow(184,34,214,34,'')}
      ${box(214,14,332,40,'.github/workflows/ci.yml\npermissions: contents: read',{stroke:CY,size:10,mono:true})}
      ${box(14,84,146,46,'job: test\nmatrix 3.12 · 3.13',{stroke:LM,size:10})}${arrow(160,107,207,107,'needs')}
      ${box(207,84,146,46,'job: build\nimage → ghcr.io',{size:10})}${arrow(353,107,400,107,'needs')}
      ${box(400,84,146,46,'job: deploy\nenvironment: production',{stroke:MG,size:9})}
      ${line(87,130,87,160)}${text(300,146,'steps inside one job share the runner\'s filesystem',{size:9,color:DIM})}
      ${box(14,160,118,40,'actions/checkout@v7',{mono:true,size:9})}${arrow(132,180,152,180,'')}
      ${box(152,160,118,40,'setup-python@v7\ncache: pip',{mono:true,size:9})}${arrow(270,180,290,180,'')}
      ${box(290,160,118,40,'run: pytest -q',{mono:true,size:9})}${arrow(408,180,428,180,'')}
      ${box(428,160,118,40,'upload-artifact@v7\nreport.xml',{mono:true,size:9})}
      ${text(280,222,'jobs: separate fresh VMs, parallel unless needs: · files cross jobs only as artifacts',{size:9,color:DIM})}`,'GitHub Actions workflow anatomy: trigger, jobs, steps')},
   {cap:"OIDC federation: nothing long-lived is stored. The job proves who it is with a signed token naming the repository, branch and environment; the cloud trusts GitHub's issuer and hands back credentials that die in about an hour.",
    svg:flow([{t:'job requests a JWT\nfrom GitHub\'s OIDC issuer',stroke:CY},{t:'JWT claims\nrepo · branch · environment',edge:'signed'},{t:'AWS STS\nAssumeRoleWithWebIdentity',stroke:AM,edge:'exchange'},{t:'temporary credentials\nexpire in ~1 hour',stroke:LM,edge:'returns'}],{perRow:2,bw:200,gap:60,bh:56,label:'OIDC token exchange from GitHub Actions to a cloud'})},
   {cap:"The tj-actions/changed-files compromise (CVE-2025-30066): a tag is a movable pointer, a commit SHA is not. Workflows pinned to a SHA never ran the malicious code.",
    svg:compare({t:'PINNED TO A TAG',draw:x=>box(x+20,44,220,30,'uses: tj-actions/changed-files@v46',{mono:true,size:9,stroke:MG})+arrow(x+130,74,x+130,94,'')+box(x+20,94,220,30,'tag moved to a malicious commit',{size:10,stroke:MG})+arrow(x+130,124,x+130,144,'')+box(x+20,144,220,30,'secrets dumped into build logs',{size:10,stroke:MG})},
      {t:'PINNED TO A SHA',draw:x=>box(x+20,44,220,30,'uses: tj-actions/changed-files@a5ab…',{mono:true,size:9,stroke:LM})+arrow(x+130,74,x+130,94,'')+box(x+20,94,220,30,'a commit SHA cannot move',{size:10,stroke:LM})+arrow(x+130,124,x+130,144,'')+box(x+20,144,220,30,'Dependabot proposes the next SHA',{size:10,stroke:LM})},{h:196,label:'Tag pinning versus SHA pinning of actions'})}];

  I.p19m4=[{cap:"The Terraform loop: plan computes the difference between your code and the state file, apply makes the cloud match and records the result, and a refresh-only plan reveals drift when someone changes reality by hand.",
    svg:cycle(['init\nget providers','write HCL','plan\ndiff vs state','apply\ncall cloud APIs','state saved\nlocked backend','drift check\nrefresh-only'],{label:'The Terraform workflow as a cycle'})},
   {cap:"State is the map between your code and real objects. When reality drifts (a port opened in the console), plan shows the correction; you either apply to enforce the code or change the code, never live with the gap.",
    svg:svg(560,196,`${box(15,20,160,54,'CODE (.tf)\naws_security_group.web\nports 22, 80',{stroke:CY,size:10})}${box(200,20,160,54,'STATE (tfstate)\nweb → sg-0a1b2c\nports 22, 80',{stroke:AM,size:10})}${box(385,20,160,54,'REALITY (AWS)\nsg-0a1b2c\nports 22, 80, 3389',{stroke:MG,size:10})}
      ${arrow(175,36,200,36,'')}${arrow(360,36,385,36,'')}${arrow(385,60,360,60,'')}${arrow(200,60,175,60,'')}
      ${text(280,94,'plan compares code with state, then refreshes state from reality',{size:10,color:DIM})}
      ${box(60,112,440,32,'~ update in-place  aws_security_group.web   ingress 3389 → removed',{mono:true,size:10,stroke:AM})}
      ${text(280,166,'drift = reality ≠ state · apply enforces the code, or edit the code to accept it',{size:10,color:DIM})}`,'Terraform code, state and reality, with drift')},
   {cap:"Terraform provisions, Ansible configures. Both are idempotent when used as designed: running the same description twice changes nothing the second time.",
    svg:compare({t:'TERRAFORM — provision',draw:x=>[['declarative HCL, dependency graph'],['talks to cloud provider APIs'],['state file + locking'],['dry run: terraform plan'],['replace instances (immutable)']].map((l,i)=>text(x+130,50+i*24,l[0],{size:10})).join('')},
      {t:'ANSIBLE — configure',draw:x=>[['YAML playbooks of tasks'],['SSH or WinRM, agentless'],['inventory, no state file'],['dry run: --check --diff'],['mutate hosts in place']].map((l,i)=>text(x+130,50+i*24,l[0],{size:10,color:AM})).join('')},{h:176,label:'Terraform versus Ansible'})}];

  I.p19m5=[{cap:"Kubernetes architecture. The control plane decides; the nodes do. kube-apiserver is the only door to etcd; the scheduler binds Pods to nodes; controllers reconcile; each node's kubelet realizes Pods through containerd and runc while kube-proxy and the CNI wire the network.",
    svg:svg(560,282,`${box(12,12,536,118,'',{dash:true,stroke:CY})}${text(280,26,'CONTROL PLANE (static Pods on the control plane nodes)',{bold:true,color:CY,size:10})}
      ${box(24,40,124,42,'kube-apiserver\nauthn · RBAC · admission',{stroke:CY,size:9})}${arrow(148,61,160,61,'')}${box(160,40,108,42,'etcd\nRaft · 3 or 5 members',{stroke:AM,size:9})}
      ${box(280,40,124,42,'kube-scheduler\nfilter → score → bind',{size:9})}${box(416,40,120,42,'controller-manager\nreconcile loops',{size:9})}
      ${line(86,82,86,100)}${line(342,82,342,100)}${line(476,82,476,100)}${line(86,100,476,100)}
      ${text(280,116,'every component talks only to the API server; only it reads and writes etcd',{size:9,color:DIM})}
      ${box(12,150,258,112,'',{dash:true,stroke:LM})}${text(141,164,'NODE worker-1',{bold:true,color:LM,size:10})}
      ${box(22,176,74,36,'kubelet',{stroke:LM,size:10})}${box(104,176,74,36,'containerd\n→ runc',{size:9})}${box(186,176,74,36,'kube-proxy\n+ CNI',{size:9})}
      ${box(22,220,114,32,'Pod 10.244.1.17',{size:9,stroke:MG})}${box(146,220,114,32,'Pod 10.244.1.18',{size:9,stroke:MG})}
      ${box(290,150,258,112,'',{dash:true,stroke:LM})}${text(419,164,'NODE worker-2',{bold:true,color:LM,size:10})}
      ${box(300,176,74,36,'kubelet',{stroke:LM,size:10})}${box(382,176,74,36,'containerd\n→ runc',{size:9})}${box(464,176,74,36,'kube-proxy\n+ CNI',{size:9})}
      ${box(300,220,114,32,'Pod 10.244.2.5',{size:9,stroke:MG})}${box(424,220,114,32,'Pod 10.244.2.6',{size:9,stroke:MG})}
      ${arrow(59,130,59,176,'')}${arrow(337,130,337,176,'')}
      ${text(280,272,'kubelets watch the API for Pods bound to them · the CNI gives each Pod its own IP',{size:9,color:DIM})}`,'Kubernetes control plane components and two worker nodes')},
   {cap:"The path of one request: TLS ends at the gateway, HTTPRoute rules pick a Service by host and path, the Service's EndpointSlice lists the ready Pod IPs selected by label, and kube-proxy or eBPF forwards to one Pod's container port.",
    svg:flow([{t:'client\nhttps://shop.example',stroke:MG},{t:'Gateway / Ingress\nHTTPRoute: host + path',stroke:AM,edge:'TLS ends'},{t:'Service web\nClusterIP 10.96.44.9:80',stroke:CY,edge:'route'},{t:'EndpointSlice\n10.244.1.17:8000 …',edge:'selector app=web'},{t:'Pod\ncontainer port 8000',stroke:LM,edge:'kube-proxy / eBPF'}],{perRow:3,bw:150,gap:34,bh:54,label:'Request path from client to Pod'})},
   {cap:"A Deployment owns ReplicaSets. A rolling update grows a new ReplicaSet while shrinking the old within the 25% surge and 25% unavailable bounds; kubectl rollout undo simply reverses the two.",
    svg:tree({t:'Deployment web\nreplicas: 3',kids:[{t:'ReplicaSet\nweb-7d9f (old)',kids:['Pod','Pod']},{t:'ReplicaSet\nweb-8c2a (new)',kids:['new Pod']}]},{three:true,label:'Deployment, ReplicaSets and Pods during a rolling update'})}];

  I.p19m6=[{cap:"Node fit is arithmetic on requests. Seven Pods requesting 500m CPU and 1 GiB fit a node with 3.8 CPU and 15 GiB allocatable; the eighth is Pending with 'Insufficient cpu' even though 8 GiB of memory sits free.",
    svg:svg(560,196,`${text(280,16,'worker-1 allocatable: 3.8 CPU · 15 GiB   —   7 Pods × (500m, 1 GiB)',{bold:true,color:CY,size:11})}
      ${text(62,52,'CPU',{anchor:'end',size:11,bold:true})}${box(70,40,470,24,'',{stroke:CY})}
      ${Array.from({length:7},(_,i)=>`<rect x="${72+i*61.8}" y="42" width="58" height="20" rx="3" fill="${CY}" fill-opacity="0.22" stroke="${CY}" stroke-width="1"/>`).join('')}
      ${text(72+3*61.8+29,52,'7 × 500m = 3.5 CPU',{size:10,color:CY})}${text(521,52,'0.3',{size:9,color:DIM})}
      ${box(70,74,150,24,'Pod 8: requests 500m',{dash:true,stroke:MG,size:10})}${arrow(220,86,282,86,'')}${text(290,86,'0.3 CPU left → Pending: Insufficient cpu',{anchor:'start',size:10,color:MG})}
      ${text(62,128,'MEM',{anchor:'end',size:11,bold:true})}${box(70,116,470,24,'',{stroke:LM})}
      ${Array.from({length:7},(_,i)=>`<rect x="${72+i*31.3}" y="118" width="29" height="20" rx="3" fill="${LM}" fill-opacity="0.22" stroke="${LM}" stroke-width="1"/>`).join('')}
      ${text(72+3.5*31.3,128,'7 GiB',{size:10,color:LM})}${text(415,128,'8 GiB free — not the constraint',{size:10,color:DIM})}
      ${text(280,162,'the scheduler sums requests, never usage; limits are enforced later by cgroups',{size:10,color:DIM})}
      ${text(280,182,'0/3 nodes are available: 3 Insufficient cpu',{mono:true,size:10,color:MG})}`,'Node capacity arithmetic for CPU and memory requests')},
   {cap:"The first three minutes of any Pod problem: Pending means the scheduler could not place it, ImagePullBackOff means the kubelet could not fetch the image, CrashLoopBackOff means the process keeps dying. Events first, logs second, then the layer below.",
    svg:svg(560,230,`${box(205,12,150,36,'Pod not Running',{stroke:CY,bold:true})}
      ${line(280,48,100,75)}${line(280,48,280,75)}${line(280,48,460,75)}
      ${box(20,75,160,40,'Pending',{stroke:AM})}${box(200,75,160,40,'ImagePullBackOff',{stroke:AM})}${box(380,75,160,40,'CrashLoopBackOff',{stroke:AM})}
      ${line(100,115,57,140)}${line(100,115,142,140)}${line(280,115,237,140)}${line(280,115,322,140)}${line(460,115,417,140)}${line(460,115,502,140)}
      ${box(20,140,75,52,'describe\n→ Events',{size:10})}${box(105,140,75,52,'insufficient\ncpu / mem\ntaint · PVC',{size:9})}
      ${box(200,140,75,52,'image or\ntag typo',{size:10})}${box(285,140,75,52,'registry\nauth · Hub\nrate limit',{size:9})}
      ${box(380,140,75,52,'logs\n--previous',{size:10,mono:true})}${box(465,140,75,52,'exit 137\n= OOMKilled\nbad config',{size:9})}
      ${text(280,214,'method: events → logs → the layer below (node, runtime, network)',{size:10,color:DIM})}`,'Troubleshooting tree for a Pod that is not Running')},
   {cap:"RBAC: a binding connects a subject to a role, and the role lists verbs on resources. Verify with kubectl auth can-i before an auditor does, and never hand a workload cluster-admin.",
    svg:flow([{t:'subject\nServiceAccount shop/reader',stroke:CY},{t:'RoleBinding\nin namespace shop',edge:'bound by'},{t:'Role\nget, list: pods, pods/log',stroke:AM,edge:'grants'},{t:'kubectl auth can-i\nlist pods → yes · delete → no',stroke:LM,edge:'verify'}],{perRow:2,bw:220,gap:50,bh:56,label:'RBAC chain from subject to verified permission'})},
   {cap:"The storage claim chain: the Pod mounts a claim, the claim names a StorageClass, the class's CSI provisioner creates a volume, and the reclaim policy decides what happens to the disk when the claim is deleted.",
    svg:flow([{t:'Pod\nvolumeMounts: data',stroke:LM},{t:'PersistentVolumeClaim\n10Gi · ReadWriteOnce',stroke:CY,edge:'claims'},{t:'StorageClass\nCSI provisioner',stroke:AM,edge:'names'},{t:'PersistentVolume\ncloud disk · Delete/Retain',edge:'binds'}],{perRow:2,bw:220,gap:50,bh:56,label:'Pod to PVC to StorageClass to PV'})}];

  I.p19m7=[{cap:"The observability stack: Prometheus pulls metrics from applications and exporters, a DaemonSet ships stdout logs to Loki, traces land in Tempo or Jaeger, Grafana draws all three, and Alertmanager turns rules into pages or tickets.",
    svg:svg(560,250,`${box(20,20,120,44,'app /metrics\ncounters · histograms',{stroke:CY,size:9})}${box(160,20,120,44,'node_exporter\n:9100',{size:10})}${box(300,20,120,44,'kube-state-metrics\ncAdvisor',{size:9})}${box(440,20,100,44,'stdout logs\n/var/log/pods',{stroke:AM,size:9})}
      ${box(90,100,200,44,'Prometheus\npull · scrape every 15–60 s',{stroke:CY,size:10})}${box(380,100,160,44,'Fluent Bit → Loki\nstructured JSON',{stroke:AM,size:10})}
      ${arrow(80,64,150,100,'')}${arrow(220,64,190,100,'')}${arrow(360,64,230,100,'')}${arrow(490,64,470,100,'')}
      ${box(20,180,180,44,'Alertmanager\ngroup · route · silence',{stroke:MG,size:10})}${box(220,180,200,44,'Grafana dashboards\nmetrics · logs · traces',{stroke:LM,size:10})}${box(440,180,100,44,'Tempo / Jaeger\ntraces',{size:9})}
      ${arrow(150,144,110,180,'alerts')}${arrow(220,144,300,180,'PromQL')}${arrow(450,144,340,180,'LogQL')}
      ${text(280,240,'OpenTelemetry SDKs and Collector can carry all three signals',{size:10,color:DIM})}`,'Metrics, logs and traces flowing into Prometheus, Loki, Grafana and Alertmanager')},
   {cap:"The error budget is 1 − SLO over the window: 99.9% buys 43.2 minutes of full outage a month; 99.99% only 4.3. Each extra nine divides the budget by ten and multiplies the engineering roughly tenfold.",
    svg:svg(560,210,`${text(280,16,'error budget per 30-day window (43,200 minutes)',{bold:true,color:CY,size:11})}
      ${[['99%','1%',432],['99.9%','0.1%',43.2],['99.95%','0.05%',21.6],['99.99%','0.01%',4.32]].map(([s,b,m],i)=>{ const y=36+i*38, w=Math.max(3,Math.round(m*0.78)); return text(70,y+11,s,{anchor:'end',size:11,bold:true})+text(118,y+11,b,{size:10,color:DIM})+`<rect x="150" y="${y}" width="${w}" height="22" rx="4" fill="${MG}" fill-opacity="0.35" stroke="${MG}" stroke-width="1"/>`+text(158+w,y+11,m+' min',{anchor:'start',size:11,color:MG}); }).join('')}
      ${text(280,196,'each extra nine divides the budget by 10 and multiplies the cost about 10×',{size:10,color:DIM})}`,'Error budget in minutes for four SLO levels')},
   {cap:"Burn rate is how fast the budget is being spent relative to the SLO. The SRE Workbook's multiwindow policy pages at 14.4× over an hour (2% of the monthly budget) or 6× over six hours, and tickets at 1× sustained for three days.",
    svg:svg(560,198,`${text(280,16,'burn rate = error rate ÷ (1 − SLO)    e.g. 0.5% ÷ 0.1% = 5×',{bold:true,color:CY,size:11})}
      ${box(28,36,108,44,'1× for 3 days\n→ ticket',{stroke:AM,size:10})}${box(138,36,108,44,'6× for 6 h\n→ page',{stroke:MG,size:10})}${box(323,36,108,44,'14.4× for 1 h\n→ page',{stroke:MG,size:10})}
      ${line(82,80,82,104)}${line(192,80,192,104)}${line(377,80,377,104)}
      ${arrow(40,110,530,110,'')}${line(82,104,82,116)}${line(192,104,192,116)}${line(377,104,377,116)}${line(170,104,170,116,{stroke:AM})}${line(500,104,500,116,{stroke:MG})}
      ${text(82,128,'1×',{size:10})}${text(192,128,'6×',{size:10})}${text(377,128,'14.4×',{size:10})}${text(170,128,'5×',{size:10,color:AM})}${text(500,128,'20×',{size:10,color:MG})}
      ${text(170,150,'0.5% errors = 5×\n→ ticket',{size:10,color:AM})}${text(470,150,'2% errors = 20×\n→ page, roll back',{size:10,color:MG})}
      ${text(280,186,'page on fast burns over short windows; ticket on slow burns; never on CPU %',{size:10,color:DIM})}`,'Burn-rate thresholds for paging and ticketing')}];

  window.ILLUS=Object.assign(window.ILLUS||{},I);
})();
