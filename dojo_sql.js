/* Command dojo (typing drills) + SQL lab (an in-browser query engine) */
(function(){
  const V=window.GP_VIEWS=window.GP_VIEWS||[]; let A=null; const $=id=>document.getElementById(id); const esc=s=>A?A.esc(s):String(s);
  const css=`.dojo input{font-family:var(--fmono);font-size:16px}.dojo .ok{color:var(--ok)}.dojo .bad{color:var(--mag)}
  .sqlout{overflow:auto;max-width:100%}.sqlout table{border-collapse:collapse;font-size:13px;font-family:var(--fmono)}.sqlout th,.sqlout td{border:1px solid var(--line);padding:4px 8px;white-space:nowrap}.sqlout th{color:var(--cyan)}
  .sql textarea{font-family:var(--fmono);min-height:90px}`;
  const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

  /* ================= COMMAND DOJO ================= */
  const SETS={
    linux:{title:'Linux shell',ci:false,items:[
      ['Print the current working directory',['pwd']],['List all files including hidden ones in long format',['ls -la','ls -al','ls -l -a','ls -a -l']],['Change to your home directory',['cd','cd ~','cd $HOME']],
      ['Create a directory named lab',['mkdir lab']],['Create an empty file named notes.txt',['touch notes.txt']],['Copy a.txt to b.txt',['cp a.txt b.txt']],['Move (rename) old.txt to new.txt',['mv old.txt new.txt']],
      ['Delete a directory tree named tmp and everything in it',['rm -r tmp','rm -rf tmp']],['Show the first 5 lines of log.txt',['head -n 5 log.txt','head -5 log.txt']],['Follow new lines appended to app.log',['tail -f app.log']],
      ['Search for the word error in app.log',['grep error app.log']],['Search recursively for TODO in the current directory',['grep -r TODO .','grep -rn TODO .','grep -R TODO .']],['Show running processes for all users in full format',['ps aux','ps -ef']],
      ['Find files named *.log under /var/log',['find /var/log -name "*.log"','find /var/log -name \'*.log\'','find /var/log -name *.log']],['Show disk space usage of filesystems in human-readable form',['df -h']],['Show the size of each item in the current directory, human readable',['du -sh *','du -h --max-depth=1']],
      ['Make script.sh executable for everyone',['chmod +x script.sh','chmod a+x script.sh','chmod 755 script.sh']],['Give read/write to owner only on secret.txt (octal)',['chmod 600 secret.txt']],['Change owner of data.txt to user alice',['chown alice data.txt']],
      ['Show which user you are',['whoami']],['Display the manual page for ls',['man ls']],['Show the last 20 lines of the system journal',['journalctl -n 20','journalctl -n20']],['Restart the ssh service with systemd',['sudo systemctl restart ssh','sudo systemctl restart sshd','systemctl restart ssh','systemctl restart sshd']],
      ['Show listening TCP ports with the process (modern tool)',['ss -tlnp','ss -ltnp','ss -plnt','ss -tulnp','sudo ss -tlnp','sudo ss -tulnp']],['Download https://example.com/file.tar.gz with curl keeping the filename',['curl -O https://example.com/file.tar.gz']],['Extract archive.tar.gz',['tar -xzf archive.tar.gz','tar xzf archive.tar.gz','tar -xvzf archive.tar.gz','tar xvzf archive.tar.gz']],
      ['Count the lines in big.txt',['wc -l big.txt']],['Show your IP addresses (modern tool)',['ip a','ip addr','ip address','ip addr show','ip a s']],['Connect with ssh as user bob to host 10.0.0.5',['ssh bob@10.0.0.5']],['Print the value of the PATH variable',['echo $PATH','echo "$PATH"']]]},
    powershell:{title:'PowerShell',ci:true,items:[
      ['List processes',['Get-Process','gps','ps']],['Get help for Get-Service',['Get-Help Get-Service','help Get-Service','man Get-Service']],['Show the members (properties and methods) of the output of Get-Process',['Get-Process | Get-Member','gps | gm','Get-Process | gm']],
      ['List services that are running',['Get-Service | Where-Object Status -eq Running','Get-Service | Where-Object {$_.Status -eq "Running"}','Get-Service | Where-Object {$_.Status -eq \'Running\'}','Get-Service | ? Status -eq Running','Get-Service | where Status -eq Running']],
      ['Restart the Spooler service',['Restart-Service Spooler','Restart-Service -Name Spooler']],['List files in C:\\Logs recursively',['Get-ChildItem C:\\Logs -Recurse','gci C:\\Logs -Recurse','ls C:\\Logs -Recurse','dir C:\\Logs -Recurse','Get-ChildItem -Path C:\\Logs -Recurse']],
      ['Show the execution policy',['Get-ExecutionPolicy']],['Test whether host 10.0.0.1 answers on port 443',['Test-NetConnection 10.0.0.1 -Port 443','tnc 10.0.0.1 -Port 443','Test-NetConnection -ComputerName 10.0.0.1 -Port 443']],['Show IP configuration',['Get-NetIPConfiguration','ipconfig','Get-NetIPAddress']],
      ['Read the file C:\\app.log',['Get-Content C:\\app.log','gc C:\\app.log','cat C:\\app.log','type C:\\app.log']],['Export the process list to procs.csv',['Get-Process | Export-Csv procs.csv','Get-Process | Export-Csv -Path procs.csv','gps | Export-Csv procs.csv']],['Start a remote session to server SRV01',['Enter-PSSession SRV01','Enter-PSSession -ComputerName SRV01','etsn SRV01']],
      ['Show the 10 newest System event log entries',['Get-EventLog -LogName System -Newest 10','Get-WinEvent -LogName System -MaxEvents 10']],['Create a new local user named labuser',['New-LocalUser labuser','New-LocalUser -Name labuser']]]},
    git:{title:'Git',ci:false,items:[
      ['Initialize a repository here',['git init']],['Clone https://github.com/x/y.git',['git clone https://github.com/x/y.git']],['Show the working tree status',['git status','git status -s']],['Stage every change',['git add .','git add -A','git add --all']],
      ['Commit with the message "fix bug"',['git commit -m "fix bug"','git commit -m \'fix bug\'']],['Create and switch to branch feature/login',['git switch -c feature/login','git checkout -b feature/login']],['Switch to branch main',['git switch main','git checkout main']],
      ['Show the commit history as one line per commit',['git log --oneline']],['Show the diff of staged changes',['git diff --staged','git diff --cached']],['Push the current branch and set upstream to origin',['git push -u origin HEAD','git push --set-upstream origin HEAD']],
      ['Fetch and merge from origin main',['git pull origin main','git pull']],['Rebase the current branch onto main',['git rebase main']],['Undo the last commit but keep the changes staged',['git reset --soft HEAD~1','git reset --soft HEAD^']],['Discard local changes to app.py',['git restore app.py','git checkout -- app.py']],
      ['Show who changed each line of app.py',['git blame app.py']],['Stash the current changes',['git stash']],['Show the reflog (your safety net)',['git reflog']]]},
    docker:{title:'Docker',ci:false,items:[
      ['List running containers',['docker ps','docker container ls']],['List all containers including stopped',['docker ps -a','docker container ls -a']],['Run nginx detached, mapping host port 8080 to container port 80',['docker run -d -p 8080:80 nginx','docker run -p 8080:80 -d nginx']],
      ['Build an image tagged myapp:1.0 from the current directory',['docker build -t myapp:1.0 .']],['Show container logs for web and follow them',['docker logs -f web','docker logs --follow web']],['Open an interactive shell in container web',['docker exec -it web sh','docker exec -it web bash','docker exec -it web /bin/sh','docker exec -it web /bin/bash']],
      ['Stop and remove container web',['docker rm -f web','docker stop web && docker rm web']],['List images',['docker images','docker image ls']],['Remove unused data (containers, networks, dangling images)',['docker system prune','docker system prune -f']],['Start the services in docker-compose.yml in the background',['docker compose up -d','docker-compose up -d']],
      ['Show resource usage of running containers',['docker stats']],['Inspect the network settings of container web',['docker inspect web']]]},
    kubectl:{title:'Kubernetes (kubectl)',ci:false,items:[
      ['List pods in the current namespace',['kubectl get pods','kubectl get po','k get pods']],['List pods in all namespaces',['kubectl get pods -A','kubectl get pods --all-namespaces','kubectl get po -A']],['Describe pod web-0',['kubectl describe pod web-0','kubectl describe po web-0']],
      ['Show logs of pod web-0 and follow',['kubectl logs -f web-0','kubectl logs web-0 -f']],['Apply the manifest deploy.yaml',['kubectl apply -f deploy.yaml']],['Scale deployment web to 5 replicas',['kubectl scale deployment web --replicas=5','kubectl scale deploy web --replicas=5','kubectl scale deployment/web --replicas=5']],
      ['Open a shell in pod web-0',['kubectl exec -it web-0 -- sh','kubectl exec -it web-0 -- bash','kubectl exec -it web-0 -- /bin/sh']],['List nodes with extra details',['kubectl get nodes -o wide','kubectl get no -o wide']],['Delete pod web-0',['kubectl delete pod web-0','kubectl delete po web-0']],
      ['Show the rollout status of deployment web',['kubectl rollout status deployment web','kubectl rollout status deployment/web','kubectl rollout status deploy web']],['Forward local port 8080 to port 80 of service web',['kubectl port-forward svc/web 8080:80','kubectl port-forward service/web 8080:80']],['Show the current context',['kubectl config current-context']]]},
    sql:{title:'SQL',ci:true,items:[
      ['Select every column from the employees table',['SELECT * FROM employees','SELECT * FROM employees;']],['Select the name and salary of employees earning more than 50000',['SELECT name, salary FROM employees WHERE salary > 50000','SELECT name,salary FROM employees WHERE salary > 50000','SELECT name, salary FROM employees WHERE salary>50000']],
      ['Count the rows in orders',['SELECT COUNT(*) FROM orders']],['Average salary per dept_id',['SELECT dept_id, AVG(salary) FROM employees GROUP BY dept_id']],['Top 3 highest salaries (name and salary)',['SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 3']],
      ['Inner join employees to departments on dept_id = departments.id, selecting employee name and department name',['SELECT employees.name, departments.name FROM employees JOIN departments ON employees.dept_id = departments.id','SELECT e.name, d.name FROM employees e JOIN departments d ON e.dept_id = d.id','SELECT e.name, d.name FROM employees AS e JOIN departments AS d ON e.dept_id = d.id']],
      ['Insert a department with id 9 and name Research',['INSERT INTO departments (id, name) VALUES (9, \'Research\')','INSERT INTO departments (id,name) VALUES (9,\'Research\')']],['Raise every salary by 10 percent',['UPDATE employees SET salary = salary * 1.1','UPDATE employees SET salary = salary * 1.10']],['Delete orders with amount 0',['DELETE FROM orders WHERE amount = 0']],
      ['Create an index named idx_emp_dept on employees(dept_id)',['CREATE INDEX idx_emp_dept ON employees (dept_id)','CREATE INDEX idx_emp_dept ON employees(dept_id)']]]},
    cisco:{title:'Cisco IOS',ci:true,items:[
      ['Enter privileged EXEC mode',['enable','en']],['Enter global configuration mode',['configure terminal','conf t','config t']],['Show the running configuration',['show running-config','show run','sh run']],['Show brief interface IP status',['show ip interface brief','sh ip int br','show ip int brief','sh ip int brief']],
      ['Show the routing table',['show ip route','sh ip route']],['Set the hostname to SW1',['hostname SW1']],['Create VLAN 10',['vlan 10']],['Set interface GigabitEthernet0/1 as an 802.1Q trunk (after encapsulation if needed)',['switchport mode trunk']],['Assign an access port to VLAN 10',['switchport access vlan 10']],
      ['Give interface Gig0/0 the address 10.0.0.1/24',['ip address 10.0.0.1 255.255.255.0']],['Bring an interface up (undo shutdown)',['no shutdown','no shut']],['Save the running config to startup',['copy running-config startup-config','copy run start','wr','write memory','write']],['Show MAC address table',['show mac address-table','sh mac address-table','show mac-address-table']],['Show VLANs',['show vlan brief','show vlan','sh vlan br','sh vlan brief']]]},
    nettools:{title:'Network troubleshooting',ci:false,items:[
      ['Ping 8.8.8.8 four times (Linux)',['ping -c 4 8.8.8.8','ping -c4 8.8.8.8']],['Trace the route to example.com (Linux)',['traceroute example.com','tracepath example.com','mtr example.com']],['Look up the A record of example.com with dig',['dig example.com','dig example.com A','dig A example.com']],['Query the MX records of example.com with dig',['dig example.com MX','dig MX example.com']],
      ['Show the ARP/neighbor table (modern Linux)',['ip neigh','ip n','ip neighbor','ip neighbour']],['Show the routing table (modern Linux)',['ip route','ip r','ip route show']],['Test a TCP connection to host 10.0.0.5 port 22 with netcat',['nc -zv 10.0.0.5 22','nc -vz 10.0.0.5 22','netcat -zv 10.0.0.5 22']],['Capture 10 packets on eth0 with tcpdump',['sudo tcpdump -i eth0 -c 10','tcpdump -i eth0 -c 10','sudo tcpdump -c 10 -i eth0']],
      ['Scan the top 1000 TCP ports of a host you own, 10.0.0.9, with nmap',['nmap 10.0.0.9']],['Show the TLS certificate of example.com with openssl',['openssl s_client -connect example.com:443','openssl s_client -connect example.com:443 -servername example.com']]]}
  };
  let D=null;
  function norm(s,ci){ s=String(s||'').trim().replace(/\s+/g,' ').replace(/\s*;\s*$/,''); return ci?s.toLowerCase():s; }
  function dojoHome(){ const Tt=A.S.tools=A.S.tools||{}; Tt.dojo=Tt.dojo||{};
    A.set(`<p class="eyebrow">Toolkit</p><h1 style="margin:0 0 6px">Command dojo</h1><p class="muted">Professionals don't look up <code>ls -la</code>. Type each command from the prompt until it is reflex. A set is 10 prompts; near-misses show the accepted answers so you learn the exact spelling.</p><div class="grid c2">${Object.entries(SETS).map(([k,s])=>{ const best=(Tt.dojo[k]||{}).best; return `<div class="holo"><div class="ti" style="font-weight:600">${esc(s.title)}</div><p class="muted" style="margin:4px 0 10px">${s.items.length} prompts${best!=null?' · best '+(Number(best)||0)+'/10':''}</p><button class="btn ghost sm" onclick="DOJO.start('${k}')">Start set ▸</button></div>`; }).join('')}</div>`); }
  function start(k){ const s=SETS[k]; D={k,items:A.shuffle(s.items).slice(0,10),i:0,ok:0,ci:s.ci,title:s.title}; renderD(); }
  function renderD(){ const it=D.items[D.i]; if(!it) return finishD();
    A.set(`<p class="eyebrow">Command dojo · ${esc(D.title)} · ${D.i+1}/10</p><div class="holo dojo"><div class="stem" style="font-size:17px;margin-bottom:10px">${esc(it[0])}</div><div class="ask"><input id="dj" placeholder="type the command…" autocomplete="off" autocapitalize="off" spellcheck="false" onkeydown="if(event.key==='Enter')DOJO.check()"><button class="btn" onclick="DOJO.check()">Check</button></div><div id="djres" style="margin-top:10px;min-height:24px"></div></div><div class="row" style="margin-top:12px;justify-content:space-between"><span class="muted">${D.ok} correct</span><button class="btn ghost sm" onclick="DOJO.finish()">End</button></div>`); const inp=$('dj'); if(inp) inp.focus(); }
  function check(){ if(!D||D.answered===D.i) return; /* one answer per prompt */ const it=D.items[D.i]; const v=norm($('dj').value,D.ci); if(!v) return; D.answered=D.i; const ok=it[1].some(a=>norm(a,D.ci)===v); const r=$('djres');
    if(ok){ D.ok++; A.addXP(2); r.innerHTML=`<span class="ok">✓ Correct</span> <button class="btn sm" onclick="DOJO.next()">Next ▸</button>`; }
    else { r.innerHTML=`<span class="bad">✗ Not quite.</span> Accepted: <code>${it[1].slice(0,3).map(esc).join('</code>, <code>')}</code> <button class="btn sm" onclick="DOJO.next()">Next ▸</button>`; A.logMiss({id:'dojo:'+D.k+':'+it[0].slice(0,30),q:'Command: '+it[0],options:null,answer:it[1][0],why:'',src:'dojo:'+D.k,pick:$('dj').value}); }
    $('dj').disabled=true; }
  function next(){ D.i++; renderD(); }
  function finishD(){ const Tt=A.S.tools; Tt.dojo[D.k]=Tt.dojo[D.k]||{}; const b=Tt.dojo[D.k]; b.best=Math.max(b.best||0,D.ok); b.runs=(b.runs||0)+1; if(D.ok>=8) A.addXP(15,'Dojo set ≥8/10'); A.save(); A.set(`<div class="holo center"><p class="eyebrow">Dojo · ${esc(D.title)}</p><div class="big" style="color:${D.ok>=8?'var(--ok)':'var(--amber)'}">${D.ok}/10</div><p class="muted">${D.ok>=8?'Reflex-level. Keep it sharp.':'Run it again tomorrow; the misses are in your mistake journal.'}</p><div class="row" style="justify-content:center"><button class="btn" onclick="DOJO.start('${D.k}')">Again</button><button class="btn ghost" onclick="GP.go('tool-dojo')">Other sets</button></div></div>`); D=null; }

  /* ================= SQL LAB ================= */
  const DB={
    departments:[{id:1,name:'Engineering',city:'Austin'},{id:2,name:'Sales',city:'Denver'},{id:3,name:'Support',city:'Austin'},{id:4,name:'Security',city:'Remote'}],
    employees:[{id:1,name:'Ada',dept_id:1,salary:120000,hired:'2019-03-01'},{id:2,name:'Linus',dept_id:1,salary:98000,hired:'2021-07-15'},{id:3,name:'Grace',dept_id:4,salary:135000,hired:'2018-01-10'},{id:4,name:'Ken',dept_id:3,salary:52000,hired:'2022-11-02'},{id:5,name:'Dennis',dept_id:2,salary:61000,hired:'2020-05-20'},{id:6,name:'Margaret',dept_id:1,salary:143000,hired:'2016-09-09'},{id:7,name:'Tim',dept_id:2,salary:58000,hired:'2023-02-14'},{id:8,name:'Radia',dept_id:4,salary:127000,hired:'2019-12-01'},{id:9,name:'Vint',dept_id:3,salary:49000,hired:'2024-04-04'},{id:10,name:'Barbara',dept_id:null,salary:70000,hired:'2021-01-05'}],
    orders:[{id:101,employee_id:5,customer:'Acme',amount:1200,order_date:'2024-01-10'},{id:102,employee_id:7,customer:'Globex',amount:300,order_date:'2024-01-12'},{id:103,employee_id:5,customer:'Initech',amount:2500,order_date:'2024-02-01'},{id:104,employee_id:7,customer:'Acme',amount:800,order_date:'2024-02-03'},{id:105,employee_id:5,customer:'Umbrella',amount:0,order_date:'2024-02-20'},{id:106,employee_id:2,customer:'Globex',amount:4100,order_date:'2024-03-05'},{id:107,employee_id:7,customer:'Initech',amount:950,order_date:'2024-03-15'},{id:108,employee_id:5,customer:'Acme',amount:1750,order_date:'2024-03-30'},{id:109,employee_id:4,customer:'Hooli',amount:120,order_date:'2024-04-02'},{id:110,employee_id:7,customer:'Hooli',amount:660,order_date:'2024-04-11'}]
  };
  // --- tokenizer ---
  function tokenize(sql){ const t=[]; const re=/\s*(?:(<=|>=|<>|!=|=|<|>)|(\(|\)|,|\*|\.|;)|('(?:[^']|'')*'|"(?:[^"]|"")*")|(\d+(?:\.\d+)?)|([A-Za-z_][A-Za-z0-9_]*))/y; let i=0; while(i<sql.length){ re.lastIndex=i; const m=re.exec(sql); if(!m){ if(/\s/.test(sql[i])){ i++; continue; } throw new Error('Unexpected character "'+sql[i]+'"'); } i=re.lastIndex; if(m[1]) t.push({t:'op',v:m[1]}); else if(m[2]) t.push({t:'p',v:m[2]}); else if(m[3]) t.push({t:'str',v:m[3].slice(1,-1).replace(/''/g,"'").replace(/""/g,'"')}); else if(m[4]) t.push({t:'num',v:parseFloat(m[4])}); else t.push({t:'id',v:m[5]}); } return t; }
  const KW=new Set(['SELECT','FROM','WHERE','AND','OR','NOT','JOIN','INNER','LEFT','ON','GROUP','BY','HAVING','ORDER','ASC','DESC','LIMIT','AS','DISTINCT','LIKE','IN','IS','NULL','BETWEEN','COUNT','SUM','AVG','MIN','MAX','TRUE','FALSE']);
  function parse(sql){ const T=tokenize(sql); let i=0; const peek=()=>T[i]; const kw=w=>{ const x=T[i]; return x&&x.t==='id'&&x.v.toUpperCase()===w; }; const eat=w=>{ if(!kw(w)) throw new Error('Expected '+w+(T[i]?(' near "'+T[i].v+'"'):' at end')); i++; }; const eatP=v=>{ if(!(T[i]&&T[i].t==='p'&&T[i].v===v)) throw new Error('Expected "'+v+'"'); i++; };
    function ident(){ const x=T[i]; if(!x||x.t!=='id'||KW.has(x.v.toUpperCase())&&!/^(COUNT|SUM|AVG|MIN|MAX)$/i.test(x.v)) throw new Error('Expected a name'+(x?(' near "'+x.v+'"'):'')); i++; return x.v; }
    function primary(){ const x=T[i]; if(!x) throw new Error('Unexpected end');
      if(x.t==='p'&&x.v==='('){ i++; const e=expr(); eatP(')'); return e; }
      if(x.t==='num'){ i++; return {k:'lit',v:x.v}; } if(x.t==='str'){ i++; return {k:'lit',v:x.v}; }
      if(kw('NULL')){ i++; return {k:'lit',v:null}; } if(kw('TRUE')){ i++; return {k:'lit',v:true}; } if(kw('FALSE')){ i++; return {k:'lit',v:false}; }
      if(x.t==='id'&&/^(COUNT|SUM|AVG|MIN|MAX)$/i.test(x.v)&&T[i+1]&&T[i+1].v==='('){ const fn=x.v.toUpperCase(); i+=2; let arg; if(T[i]&&T[i].v==='*'){ i++; arg={k:'star'}; } else { let distinct=false; if(kw('DISTINCT')){ i++; distinct=true; } arg=expr(); arg.distinct=distinct; } eatP(')'); return {k:'agg',fn,arg}; }
      if(x.t==='p'&&x.v==='*'){ i++; return {k:'star'}; }
      if(x.t==='id'){ i++; if(T[i]&&T[i].t==='p'&&T[i].v==='.'){ i++; if(T[i]&&T[i].v==='*'){ i++; return {k:'star',tbl:x.v}; } const c=ident(); return {k:'col',tbl:x.v,col:c}; } return {k:'col',col:x.v}; }
      throw new Error('Unexpected "'+x.v+'"'); }
    function unary(){ if(kw('NOT')){ i++; return {k:'not',e:unary()}; } return cmp(); }
    function cmp(){ let l=primary(); const x=T[i]; let neg=false; if(kw('NOT')&&T[i+1]&&/^(LIKE|IN|BETWEEN)$/i.test(T[i+1].v)){ i++; neg=true; }
      if(kw('IS')){ i++; let n=false; if(kw('NOT')){ i++; n=true; } eat('NULL'); return {k:'isnull',e:l,not:n}; }
      if(kw('LIKE')){ i++; const r=primary(); return {k:'like',l,r,not:neg}; }
      if(kw('IN')){ i++; eatP('('); const list=[]; if(!(T[i]&&T[i].v===')')){ list.push(expr()); while(T[i]&&T[i].v===','){ i++; list.push(expr()); } } eatP(')'); return {k:'in',l,list,not:neg}; }
      if(kw('BETWEEN')){ i++; const a=primary(); eat('AND'); const b=primary(); return {k:'between',l,a,b,not:neg}; }
      if(x&&x.t==='op'){ i++; const r=primary(); return {k:'cmp',op:x.v,l,r}; }
      return l; }
    function andE(){ let l=unary(); while(kw('AND')){ i++; l={k:'and',l,r:unary()}; } return l; }
    function expr(){ let l=andE(); while(kw('OR')){ i++; l={k:'or',l,r:andE()}; } return l; }
    // statement
    eat('SELECT'); let distinct=false; if(kw('DISTINCT')){ i++; distinct=true; }
    const cols=[]; do{ const e=expr(); let alias=null; if(kw('AS')){ i++; alias=ident(); } else if(T[i]&&T[i].t==='id'&&!KW.has(T[i].v.toUpperCase())){ alias=T[i].v; i++; } cols.push({e,alias}); }while(T[i]&&T[i].v===','&&(++i));
    eat('FROM'); const from=[]; const tbl=()=>{ const n=ident(); let alias=n; if(kw('AS')){ i++; alias=ident(); } else if(T[i]&&T[i].t==='id'&&!KW.has(T[i].v.toUpperCase())){ alias=T[i].v; i++; } return {n,alias}; };
    from.push(Object.assign(tbl(),{join:null}));
    while(kw('JOIN')||kw('INNER')||kw('LEFT')){ let type='inner'; if(kw('LEFT')){ i++; type='left'; if(kw('OUTER')) i++; } else if(kw('INNER')) i++; eat('JOIN'); const t=tbl(); eat('ON'); t.join={type,on:expr()}; from.push(t); }
    let where=null, group=null, having=null, order=null, limit=null;
    if(kw('WHERE')){ i++; where=expr(); }
    if(kw('GROUP')){ i++; eat('BY'); group=[expr()]; while(T[i]&&T[i].v===','){ i++; group.push(expr()); } }
    if(kw('HAVING')){ i++; having=expr(); }
    if(kw('ORDER')){ i++; eat('BY'); order=[]; do{ const e=expr(); let dir='asc'; if(kw('ASC')){ i++; } else if(kw('DESC')){ i++; dir='desc'; } order.push({e,dir}); }while(T[i]&&T[i].v===','&&(++i)); }
    if(kw('LIMIT')){ i++; const x=T[i]; if(!x||x.t!=='num') throw new Error('LIMIT needs a number'); limit=x.v; i++; }
    if(T[i]&&T[i].v===';') i++; if(i<T.length) throw new Error('Unexpected "'+T[i].v+'"');
    return {distinct,cols,from,where,group,having,order,limit}; }
  // --- executor ---
  function run(sql,db){ const q=parse(sql); const D2=db||DB;
    const getTable=n=>{ const t=D2[n]||D2[n.toLowerCase()]; if(!t) throw new Error('Unknown table '+n); return t; };
    // rows are objects: {alias:{...row}}
    const truthy=v=>v===true;
    let rows=getTable(q.from[0].n).map(r=>({[q.from[0].alias]:r}));
    for(let j=1;j<q.from.length;j++){ const f=q.from[j]; const right=getTable(f.n); const out=[]; rows.forEach(l=>{ let matched=false; right.forEach(r=>{ const cand=Object.assign({},l,{[f.alias]:r}); if(truthy(evalE(f.join.on,cand))){ out.push(cand); matched=true; } }); if(!matched&&f.join.type==='left') out.push(Object.assign({},l,{[f.alias]:null})); }); rows=out; }
    function colVal(e,row){ if(e.tbl){ const t=row[e.tbl]; if(t===undefined) throw new Error('Unknown table alias '+e.tbl); return t?t[e.col]:null; } let found, n=0; for(const a in row){ const t=row[a]; if(t&&Object.prototype.hasOwnProperty.call(t,e.col)){ found=t[e.col]; n++; } else if(t===null){ /* left join null */ } } if(n===0){ const anyHas=Object.keys(row).some(a=>{ const tb=getTable(q.from.find(f=>f.alias===a).n); return tb[0]&&Object.prototype.hasOwnProperty.call(tb[0],e.col); }); if(anyHas) return null; throw new Error('Unknown column '+e.col); } if(n>1) throw new Error('Ambiguous column '+e.col); return found===undefined?null:found; }
    function like(s,p){ if(s==null) return false; const re=new RegExp('^'+String(p).replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/%/g,'.*').replace(/_/g,'.')+'$','i'); return re.test(String(s)); }
    function evalE(e,row,grp){ switch(e.k){
      case 'lit': return e.v; case 'col': return colVal(e,row); case 'star': return 1;
      case 'cmp': { const l=evalE(e.l,row,grp), r=evalE(e.r,row,grp); if(l==null||r==null) return null; switch(e.op){ case '=': return l==r; case '<>': case '!=': return l!=r; case '<': return l<r; case '>': return l>r; case '<=': return l<=r; case '>=': return l>=r; } }
      case 'and': { const l=evalE(e.l,row,grp); if(l===false) return false; const r=evalE(e.r,row,grp); if(r===false) return false; return (l==null||r==null)?null:true; }
      case 'or': { const l=evalE(e.l,row,grp); if(l===true) return true; const r=evalE(e.r,row,grp); if(r===true) return true; return (l==null||r==null)?null:false; }
      case 'not': { const v=evalE(e.e,row,grp); return v==null?null:!v; }
      case 'isnull': { const v=evalE(e.e,row,grp); return e.not?(v!=null):(v==null); }
      case 'like': { const v=like(evalE(e.l,row,grp),evalE(e.r,row,grp)); return e.not?!v:v; }
      case 'in': { const l=evalE(e.l,row,grp); const v=e.list.some(x=>evalE(x,row,grp)==l); return e.not?!v:v; }
      case 'between': { const l=evalE(e.l,row,grp), a=evalE(e.a,row,grp), b=evalE(e.b,row,grp); if(l==null) return null; const v=l>=a&&l<=b; return e.not?!v:v; }
      case 'agg': { if(!grp) throw new Error('Aggregate '+e.fn+' needs GROUP BY or a whole-table aggregate'); let vals=grp.map(r=>e.arg.k==='star'?1:evalE(e.arg,r)); if(e.arg.k!=='star') vals=vals.filter(v=>v!=null); if(e.arg.distinct) vals=[...new Set(vals)]; switch(e.fn){ case 'COUNT': return vals.length; case 'SUM': return vals.reduce((a,b)=>a+b,0); case 'AVG': return vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length*100)/100:null; case 'MIN': return vals.length?vals.reduce((a,b)=>a<b?a:b):null; case 'MAX': return vals.length?vals.reduce((a,b)=>a>b?a:b):null; } } }
      throw new Error('Cannot evaluate'); }
    if(q.where) rows=rows.filter(r=>truthy(evalE(q.where,r)));
    const hasAgg=e=>e&&(e.k==='agg'||['cmp','and','or','not','like','in','between','isnull'].includes(e.k)&&['l','r','e','a','b'].some(k=>e[k]&&hasAgg(e[k])));
    const aggregating=q.group||q.cols.some(c=>hasAgg(c.e))||hasAgg(q.having);
    let groups;
    if(aggregating){ const map=new Map(); rows.forEach(r=>{ const key=q.group?JSON.stringify(q.group.map(g=>evalE(g,r))):'all'; if(!map.has(key)) map.set(key,[]); map.get(key).push(r); }); groups=[...map.values()]; if(!groups.length&&!q.group) groups=[[]]; if(q.having) groups=groups.filter(g=>truthy(evalE(q.having,g[0]||{},g))); }
    const name=(c,idx)=>c.alias||(c.e.k==='col'?c.e.col:c.e.k==='agg'?(c.e.fn.toLowerCase()+'('+(c.e.arg.k==='star'?'*':(c.e.arg.col||'expr'))+')'):'col'+(idx+1));
    const expand=(cols,sampleRow)=>{ const out=[]; cols.forEach(c=>{ if(c.e.k==='star'){ const aliases=c.e.tbl?[c.e.tbl]:q.from.map(f=>f.alias); aliases.forEach(a=>{ const tb=getTable(q.from.find(f=>f.alias===a).n); Object.keys(tb[0]||{}).forEach(col=>out.push({e:{k:'col',tbl:a,col},alias:null})); }); } else out.push(c); }); return out; };
    const cols=expand(q.cols);
    { const seen={}; cols.forEach(c=>{ const n=name(c,0); seen[n]=(seen[n]||0)+1; }); cols.forEach((c,idx)=>{ const n=name(c,idx); if(seen[n]>1&&!c.alias&&c.e.k==='col'&&c.e.tbl) c.alias=c.e.tbl+'.'+c.e.col; }); }
    let result;
    if(aggregating){ result=groups.map(g=>{ const r=g[0]||{}; const o={}; cols.forEach((c,idx)=>{ o[name(c,idx)]=c.e.k==='agg'||hasAgg(c.e)?evalE(c.e,r,g):evalE(c.e,r,g); }); o.__row=r; o.__grp=g; return o; }); }
    else result=rows.map(r=>{ const o={}; cols.forEach((c,idx)=>{ o[name(c,idx)]=evalE(c.e,r); }); o.__row=r; return o; });
    if(q.order){ result.sort((x,y)=>{ for(const o of q.order){ const colName=o.e.k==='col'&&!o.e.tbl&&x[o.e.col]!==undefined?o.e.col:null; const a=colName?x[colName]:evalE(o.e,x.__row,x.__grp), b=colName?y[colName]:evalE(o.e,y.__row,y.__grp); if(a==b) continue; if(a==null) return 1; if(b==null) return -1; return (a<b?-1:1)*(o.dir==='desc'?-1:1); } return 0; }); }
    result=result.map(o=>{ const c={}; Object.keys(o).forEach(k=>{ if(!k.startsWith('__')) c[k]=o[k]; }); return c; });
    if(q.distinct){ const seen=new Set(); result=result.filter(r=>{ const k=JSON.stringify(r); if(seen.has(k)) return false; seen.add(k); return true; }); }
    if(q.limit!=null) result=result.slice(0,q.limit);
    return result; }
  const EX=[
    ['Every employee, all columns.','SELECT * FROM employees'],
    ['Names and salaries of employees earning over 100,000, highest first.','SELECT name, salary FROM employees WHERE salary > 100000 ORDER BY salary DESC'],
    ['How many orders are there?','SELECT COUNT(*) FROM orders'],
    ['Total order amount per employee_id (employee_id and the total).','SELECT employee_id, SUM(amount) FROM orders GROUP BY employee_id'],
    ['Each employee\'s name with their department name (inner join).','SELECT employees.name, departments.name FROM employees JOIN departments ON employees.dept_id = departments.id'],
    ['Every employee\'s name and department name, including employees with no department (left join).','SELECT e.name, d.name FROM employees e LEFT JOIN departments d ON e.dept_id = d.id'],
    ['Average salary per department name, only departments averaging above 60,000.','SELECT d.name, AVG(e.salary) FROM employees e JOIN departments d ON e.dept_id = d.id GROUP BY d.name HAVING AVG(e.salary) > 60000'],
    ['Customers (no duplicates) who placed an order over 1,000.','SELECT DISTINCT customer FROM orders WHERE amount > 1000'],
    ['Employees whose name starts with the letter M or who were hired in 2023 or later (name, hired).','SELECT name, hired FROM employees WHERE name LIKE \'M%\' OR hired >= \'2023-01-01\''],
    ['The three most recent orders: id, customer, amount.','SELECT id, customer, amount FROM orders ORDER BY order_date DESC LIMIT 3'],
    ['Count of employees per city (join to departments), largest first.','SELECT d.city, COUNT(*) FROM employees e JOIN departments d ON e.dept_id = d.id GROUP BY d.city ORDER BY COUNT(*) DESC'],
    ['Employees in departments located in Austin, names only, alphabetical.','SELECT e.name FROM employees e JOIN departments d ON e.dept_id = d.id WHERE d.city = \'Austin\' ORDER BY e.name']];
  function sqlView(){ const Tt=A.S.tools=A.S.tools||{}; Tt.sql=Tt.sql||{};
    A.set(`<p class="eyebrow">Toolkit</p><h1 style="margin:0 0 6px">SQL lab</h1><p class="muted">A real query engine running in your browser (SELECT with joins, WHERE, GROUP BY/HAVING, ORDER BY, LIMIT, DISTINCT, LIKE/IN/BETWEEN/IS NULL, COUNT/SUM/AVG/MIN/MAX). Tables: <b>employees</b>(id, name, dept_id, salary, hired), <b>departments</b>(id, name, city), <b>orders</b>(id, employee_id, customer, amount, order_date).</p>
      <div class="holo sql"><textarea id="sqlin" placeholder="SELECT name, salary FROM employees WHERE salary > 100000 ORDER BY salary DESC">${esc(Tt.sql.last||'')}</textarea><div class="row" style="margin-top:8px"><button class="btn" onclick="SQLLAB.run()">Run ▸</button><button class="btn ghost sm" onclick="SQLLAB.show('employees')">employees</button><button class="btn ghost sm" onclick="SQLLAB.show('departments')">departments</button><button class="btn ghost sm" onclick="SQLLAB.show('orders')">orders</button></div><div id="sqlout" class="sqlout" style="margin-top:10px"></div></div>
      <p class="eyebrow" style="margin-top:18px">Exercises · ${Object.keys(Tt.sql.done||{}).length}/${EX.length} solved</p><div class="ilist">${EX.map((e,i)=>`<a class="item ${(Tt.sql.done||{})[i]?'done':''}" onclick="SQLLAB.ex(${i})"><span class="ix">${(Tt.sql.done||{})[i]?'✓':i+1}</span><span class="bd"><span class="ti" style="font-weight:500">${esc(e[0])}</span></span><span class="tag">▸</span></a>`).join('')}</div>`); }
  function table(rows){ if(!rows.length) return '<p class="muted">0 rows</p>'; const cols=Object.keys(rows[0]); return `<table><tr>${cols.map(c=>'<th>'+esc(c)+'</th>').join('')}</tr>${rows.map(r=>'<tr>'+cols.map(c=>'<td>'+(r[c]==null?'<i class="faint">NULL</i>':esc(r[c]))+'</td>').join('')+'</tr>').join('')}</table><p class="faint" style="margin:6px 0 0">${rows.length} row${rows.length===1?'':'s'}</p>`; }
  let cur=null;
  function runUI(){ const sql=$('sqlin').value; const out=$('sqlout'); A.S.tools.sql.last=sql; A.save(); try{ const rows=run(sql); out.innerHTML=table(rows); if(cur!=null){ const want=run(EX[cur][1]); const canon=rs=>JSON.stringify(rs.map(r=>Object.values(r).map(v=>v==null?null:String(v)))); const ordered=/\bORDER\s+BY\b/i.test(EX[cur][1]); const ok=ordered?canon(want)===canon(rows):JSON.stringify(rows.map(r=>Object.values(r).map(String)).sort())===JSON.stringify(want.map(r=>Object.values(r).map(String)).sort()); out.innerHTML=(ok?`<p class="ok" style="color:var(--ok);font-weight:600">✓ Exercise ${cur+1} solved</p>`:`<p style="color:var(--mag);font-weight:600">✗ Not the expected result for exercise ${cur+1} (expected ${want.length} row${want.length===1?'':'s'}${ordered?', in order':''})</p>`)+out.innerHTML; if(ok){ A.S.tools.sql.done=A.S.tools.sql.done||{}; if(!A.S.tools.sql.done[cur]){ A.S.tools.sql.done[cur]=1; A.addXP(8,'SQL exercise'); } A.save(); } } }catch(e){ out.innerHTML=`<p style="color:var(--mag)">Error: ${esc(e.message)}</p>`; } }
  function show(t){ $('sqlout').innerHTML=table(DB[t].slice()); }
  function ex(i){ cur=i; const inp=$('sqlin'); inp.value=''; inp.placeholder='Exercise '+(i+1)+': '+EX[i][0]; inp.focus(); $('sqlout').innerHTML=`<p class="muted">Exercise ${i+1}: ${esc(EX[i][0])} — write the query and Run.</p>`; }

  V.push({test:h=>h==='tool-dojo',nav:'labs',render:(h,api)=>{ A=api; dojoHome(); }});
  V.push({test:h=>h==='tool-sql',nav:'labs',render:(h,api)=>{ A=api; cur=null; sqlView(); }});
  window.DOJO={start,check,next,finish:finishD};
  window.SQLLAB={run:runUI,show,ex,_run:run};
})();
