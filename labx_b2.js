/* Lab guides — batch 2 (p16–p26) */
window.LABX=window.LABX||{};
/* ---------- p16 Windows, Windows Server & Active Directory ---------- */
Object.assign(window.LABX,{
  "p16lab1":{
    time:"two sessions of 2–3 h",
    setup:[
      "A host with 16 GB RAM (8 GB is the bare minimum), virtualization enabled in firmware (VT-x or AMD-V) and about 150 GB free disk. Hypervisor: Hyper-V (Windows Pro/Enterprise), VirtualBox 7.x or Proxmox VE.",
      "The Windows Server 2025 and Windows 11 Enterprise evaluation ISOs from the Microsoft Evaluation Center (microsoft.com/evalcenter). Write down the date you install: the evaluations expire.",
      "A private or internal-only virtual switch with no physical adapter bound to it. Plan the addressing before you start, for example 10.10.10.0/24 with DC01 at 10.10.10.10 and a scope of .100–.200.",
      "Take a snapshot of DC01 after sconfig (name and static IP) and before promotion, so a failed forest install costs minutes, not an evening."
    ],
    checkpoints:[
      "Both ISOs are on disk, the private switch exists, and the VM settings show Generation 2 / UEFI with Secure Boot and a vTPM on the client.",
      "sconfig shows the new name and static IP with DNS pointing to itself; Get-WindowsFeature shows AD-Domain-Services, DNS and DHCP as Installed; after the reboot you log on as CORP\\Administrator.",
      "Get-DhcpServerInDC lists DC01; Get-DhcpServerv4Scope shows your scope as Active; Get-DhcpServerv4OptionValue shows options 003, 006 (DC01's IP) and 015 (your domain).",
      "dcdiag ends with 'passed test' on Connectivity, Advertising and Services; the SRV lookup returns dc01 on port 389; Get-ADDomain shows your DNSRoot; netdom query fsmo lists DC01 for all five roles.",
      "On the client, ipconfig /all shows a lease from your scope with DHCP and DNS server = DC01; whoami returns corp\\<user>; klist shows a krbtgt ticket; DC01's Security log has a 4768 for that user followed by 4769 events."
    ],
    hints:[
      "Order matters. Identity first (name, static IP, DNS), then the forest, then DHCP. DHCP authorization is stored in Active Directory, so it cannot happen before the forest exists.",
      "The key cmdlets are Install-WindowsFeature AD-Domain-Services,DNS,DHCP -IncludeManagementTools, then Install-ADDSForest -DomainName corp.<yours> -InstallDns, then Add-DhcpServerInDC, Add-DhcpServerv4Scope, Add-DhcpServerv4ExclusionRange and Set-DhcpServerv4OptionValue -Router -DnsServer -DnsDomain.",
      "For the events, filter instead of scrolling: Get-WinEvent -FilterHashtable @{LogName='Security';Id=4768,4769} -MaxEvents 20, then match TargetUserName and the client address field to your client. 4768 is the TGT; each 4769 is a service ticket (host/, cifs/, ldap/)."
    ],
    trouble:[
      ["Domain join fails with 'An Active Directory Domain Controller (AD DC) for the domain could not be contacted'","The client's DNS server is your router or a public resolver, so it cannot find the SRV records","Check DNS first, always: run the same nslookup -type=SRV from the client. Set the client's only DNS server to DC01 (or fix DHCP option 006) and retry."],
      ["The client gets a 169.254.x.x address","DHCP is not authorized, the scope is not active, or the client VM is on a different virtual switch","Run Get-DhcpServerInDC and Get-DhcpServerv4Scope on DC01, then check which switch the client's adapter is attached to."],
      ["Install-ADDSForest stops with a password or static IP error","SafeModeAdministratorPassword does not meet complexity, or the NIC is still on DHCP","Set the static IP in sconfig, rerun with -SafeModeAdministratorPassword (Read-Host -AsSecureString) and a long password."],
      ["dcdiag shows failures in the first minutes after promotion","Services and replication are still settling, or the clock is unsynchronized","Wait 15 minutes and rerun. Check w32tm /query /status; Kerberos tolerates only five minutes of clock skew."],
      ["No 4768/4769 events appear","Kerberos auditing subcategories are not enabled, or you are looking at the client's log instead of DC01's","Run auditpol /get /subcategory:'Kerberos Authentication Service' on DC01 and enable success auditing if needed."]
    ],
    challenge:"Add DC02 as a second Server Core domain controller with Install-ADDSDomainController, configure DHCP failover in load-balance mode between the two, then shut down DC01 and prove a client can still log on and renew its lease. Check replication health with repadmin /replsummary and move one FSMO role to DC02 with Move-ADDirectoryServerOperationMasterRole, then move it back.",
    reflect:[
      "Why does a domain join depend on DNS SRV records instead of a fixed DC address, and what exactly breaks when a client uses a public resolver?",
      "Why must a Windows DHCP server be authorized in AD, and what real-network problem does that prevent?",
      "If the client clock were ten minutes off, what would you see in the logon and the events, and why does Kerberos care about time?"
    ],
    safety:"Keep the lab on a private or internal virtual switch. A lab DHCP server bridged onto your home network will hand out wrong leases to family devices and can take the household offline."
  },
  "p16lab2":{
    time:"3–4 h",
    setup:[
      "The Lab 1 domain running with a fresh snapshot. Add FS01 (Windows Server 2025 evaluation, Core or Desktop Experience), joined to the domain, with two folders to share.",
      "Management tools: RSAT on the Windows 11 client (Settings > System > Optional features: RSAT Active Directory and Group Policy Management tools) or a Desktop Experience server with GPMC.",
      "Windows LAPS is built into current Windows 11 and Server 2025 builds. Do not install the legacy LAPS MSI; mixing the two causes confusing results.",
      "A second Windows 11 VM to act as the Tier 0 PAW (privileged access workstation), placed in its own OU under Tier0."
    ],
    checkpoints:[
      "Get-ADOrganizationalUnit -Filter * lists the seven OUs; Get-ADGroupMember shows global groups nested in domain local groups; a member user opens the FS01 share and a non-member gets 'Access is denied'.",
      "GPMC shows the three GPOs linked to the right OUs; gpresult /r on the workstation lists Baseline-Workstations under Applied Group Policy Objects; running a command creates event 4104 in Microsoft-Windows-PowerShell/Operational.",
      "gpresult /h for the workstation shows the Winning GPO for each setting, and the Enforced link wins even under the OU with Block Inheritance.",
      "Get-LapsADPassword -Identity <client> -AsPlainText returns a password and an expiration time; after Reset-LapsPassword the password and timestamp change.",
      "A help-desk member resets a user's password in OU=Users successfully, and the same action on an account in OU=Tier0 fails with 'Access is denied'."
    ],
    hints:[
      "Draw precedence before you test it: local, site, domain, OU, with the closest OU winning. Enforced and Block Inheritance are the only two exceptions, and Enforced beats Block Inheritance.",
      "Tier0-Restrictions lives under Computer Configuration > User Rights Assignment ('Deny log on locally', 'Deny log on through Remote Desktop Services'). It is a computer setting, so link it where the workstation computer objects are. LAPS needs the schema update, Set-LapsADComputerSelfPermission on the Workstations OU, and the 'Configure password backup directory' policy set to Active Directory.",
      "Use the Delegation of Control Wizard on OU=Users for 'Reset user passwords and force password change at next logon'. Accounts in protected groups have their ACL reset by AdminSDHolder/SDProp, which is one reason Tier 0 accounts stay safe even from sloppy delegation; verify with dsacls on both OUs."
    ],
    trouble:[
      ["A GPO never shows up in gpresult","The computer object is still in the default Computers container, which is not an OU and cannot have GPOs linked","Move the computer into the Workstations OU, run gpupdate /force, and read the 'filtered out' section of gpresult /r."],
      ["Get-LapsADPassword returns nothing","Schema not extended, policy not applied, or the computer cannot write its own password attribute","Check Microsoft-Windows-LAPS/Operational on the client first: it states why the update failed. Then rerun Set-LapsADComputerSelfPermission and Invoke-LapsPolicyProcessing."],
      ["The help-desk user cannot reset even in OU=Users","The token was issued before the group change, or the target is a protected account","Log the help-desk user off and on (group membership is read at logon), then test against an ordinary user."],
      ["Advanced settings in the baseline seem ignored","Legacy category-level audit or security settings from another GPO override them","Find the Winning GPO in gpresult /h; the report tells you which link supplied each value."]
    ],
    challenge:"Script the whole build: one PowerShell file that creates the OUs, groups, nesting, share ACLs, GPOs and links on an empty domain. Restore DC01 to the pre-lab snapshot, run the script, and compare Get-GPOReport -ReportType Xml output from both builds to prove they are identical. Then add a security-filtered GPO that applies to one group only and show it in gpresult.",
    reflect:[
      "Why does AGDLP place permissions on domain local groups rather than on users or global groups, and what does that save during a reorganization or merger?",
      "Why is 'Deny log on locally' for Tier 0 accounts linked to the workstation OU instead of the OU that holds the Tier 0 accounts?",
      "What risk do unique, rotating local administrator passwords remove, and what risk remains even with LAPS in place?"
    ]
  },
  "p16lab3":{
    time:"4–6 h over two sessions",
    setup:[
      "PowerShell 7.4 or later on your admin machine (winget install Microsoft.PowerShell) and VS Code with the PowerShell extension. Targets can keep Windows PowerShell 5.1.",
      "WinRM reachable on DC01, FS01 and the client. Servers have it on by default; enable it on Windows 11 with Enable-PSRemoting or, better, by GPO. Verify with Test-WSMan <name>.",
      "Install-Module Pester -MinimumVersion 5.0 -Scope CurrentUser -Force -SkipPublisherCheck (Windows ships an old Pester 3.4) and Install-Module PSScriptAnalyzer -Scope CurrentUser.",
      "For the gMSA, a KDS root key. In this lab only you may backdate it: Add-KdsRootKey -EffectiveTime ((Get-Date).AddHours(-10)). In production you wait the ten hours."
    ],
    checkpoints:[
      "The AuditKit folder holds AuditKit.psm1 and AuditKit.psd1 (from New-ModuleManifest); Test-ModuleManifest passes and Get-Command -Module AuditKit lists both functions.",
      "The CSV has rows from all three machines with a PSComputerName column; with one VM powered off, the run still finishes and the failed host appears in your error log, not as a crash.",
      "Invoke-Pester reports Failed: 0, and Invoke-ScriptAnalyzer -Path . -Recurse shows no Error-severity results (any warning you keep has a written reason).",
      "Test-ADServiceAccount svc-audit returns True on the host, the task shows CORP\\svc-audit$ as its user with LastTaskResult 0, and the Security log has event 4698 for the task's creation."
    ],
    hints:[
      "Make each function emit objects, never formatted text. Format and export only at the end. And remember: the module exists on your machine, not on the targets.",
      "Ship the function body to the targets with Invoke-Command -ScriptBlock ${function:Get-ServiceRisk}, and collect failures with -ErrorAction SilentlyContinue -ErrorVariable failed. Read service paths from Get-CimInstance Win32_Service (PathName), and folder rights with Get-Acl.",
      "An unquoted service path is a PathName that does not start with a quote and has a space before the .exe. The gMSA task uses New-ScheduledTaskPrincipal -UserId 'CORP\\svc-audit$' -LogonType Password with no password; Install-ADServiceAccount must succeed on that host first."
    ],
    trouble:[
      ["'WinRM cannot complete the operation. Verify that the specified computer name is valid...'","WinRM is not listening or the firewall blocks TCP 5985","Run Test-WSMan <host> before anything else. It separates name resolution, firewall and service problems in one step."],
      ["\"The term 'Get-ServiceRisk' is not recognized\" inside Invoke-Command","The script block runs in a remote session that does not have your module","Pass ${function:...} as the script block, or copy the module into a PSSession with Copy-Item -ToSession and import it there."],
      ["Install-ADServiceAccount fails with 'An unspecified error has occurred'","The host is not in PrincipalsAllowedToRetrieveManagedPassword, or its Kerberos ticket predates the change","Check Get-ADServiceAccount svc-audit -Properties PrincipalsAllowedToRetrieveManagedPassword, then run klist purge -li 0x3e7 or reboot the host."],
      ["The task exists but no event 4698 is logged","The 'Other Object Access Events' audit subcategory is off","Enable it with auditpol /set /subcategory:'Other Object Access Events' /success:enable, recreate the task, and look again."],
      ["Pester errors such as 'Should -Be' not recognized","The built-in Pester 3.4 loaded instead of 5.x","Run Get-Module Pester -ListAvailable, then Import-Module Pester -MinimumVersion 5.0 before Invoke-Pester."]
    ],
    challenge:"Add drift detection: keep each run's CSV with a date in the name and write Compare-AuditRun, which reports new local administrators and newly risky services since the previous run. Cover it with Pester tests that Mock Get-CimInstance to return fake services with a quoted path, an unquoted path with spaces, and a path with no spaces, so the tests run without any VM.",
    reflect:[
      "Remoting returns deserialized objects. What can you no longer do with them, and why does PowerShell work that way?",
      "Why is a gMSA safer for a scheduled task than a domain user whose password never expires?",
      "Which single finding in your CSV would an assessor rate highest, and what evidence in the row supports that rating?"
    ]
  },
  "p16lab4":{
    time:"4–6 h",
    setup:[
      "The lab domain (DC01, FS01, client) on its isolated switch, with snapshots taken before you change audit policy.",
      "Sysmon from Microsoft Sysinternals (learn.microsoft.com/sysinternals) and one community configuration: SwiftOnSecurity's sysmon-config or Olaf Hartong's sysmon-modular, both on GitHub. Read the config before you deploy it.",
      "A collector: FS01 for Windows Event Forwarding, or an Ubuntu VM with 4–8 GB RAM for a Wazuh server installed per documentation.wazuh.com.",
      "Microsoft Office on the client (an existing licence or a trial) for the benign test document. The test command should be harmless, such as writing the date to a text file."
    ],
    checkpoints:[
      "auditpol /get /category:* on DC01 shows the subcategories you set; wevtutil gl Security shows maxSize 1073741824; a new process creates event 4688 with the Process Command Line field filled in.",
      "Get-Service Sysmon64 shows Running on each machine, and Get-WinEvent -LogName Microsoft-Windows-Sysmon/Operational -MaxEvents 100 contains IDs 1, 3 and 22.",
      "On the collector, Forwarded Events (or the Wazuh dashboard) contains a 4769 from DC01 and a Sysmon 1 from the client, with timestamps within a minute of the activity.",
      "You can show a Sysmon 1 whose ParentImage is WINWORD.EXE and Image is powershell.exe, the matching 4104 script block, and a Sysmon 3 or 22 from the same ProcessGuid.",
      "Your written detection names the data source, the logic, the expected false positives and the first response step."
    ],
    hints:[
      "Separate collection from detection. First prove each event type exists locally on each machine, then prove it travels to the collector. Only then look for the story.",
      "The command line in 4688 needs a separate setting: 'Include command line in process creation events' under Administrative Templates > System > Audit Process Creation. For WEF, run wecutil qc on the collector, create a source-initiated subscription, and point sources at it with the 'Configure target Subscription Manager' policy.",
      "ProcessGuid is your join key between Sysmon 1, 3 and 22. A detection in words looks like: alert when an Office application is the parent of a script interpreter, excluding known add-ins you have listed; then state how often that should fire in a normal week."
    ],
    trouble:[
      ["Forwarded Events receives Sysmon but never the Security log from DC01","The Network Service account cannot read the Security log on the source","Add NETWORK SERVICE to Event Log Readers on the source (by GPO for DCs), restart WinRM, and read Microsoft-Windows-Eventlog-ForwardingPlugin/Operational on the source for the real error."],
      ["Sysmon logs 1 and 3 but no 22","The configuration filters DNS queries or excludes the process you tested","Dump the active rules with sysmon -c and search for DnsQuery; test with Resolve-DnsName from PowerShell."],
      ["No 4104 events","The Script Block Logging policy did not reach the machine","Check gpresult and the registry value EnableScriptBlockLogging under HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\ScriptBlockLogging."],
      ["The test macro never runs","Office blocks macros by default, especially in files marked as downloaded from the internet","Create the document on the lab client itself and allow macros only on that VM. That default block is exactly why this technique is rarer today."],
      ["Subcategory settings seem ignored","Old category-level audit settings override the advanced policy","Enable 'Audit: Force audit policy subcategory settings to override audit policy category settings' in the same GPO."]
    ],
    challenge:"Measure the cost of visibility. Count events per hour by machine and event ID for one day, compute how many days of history the 1 GB Security log holds on DC01, then tune the Sysmon config to drop one noisy benign process. Re-run the test document and prove your detection still sees the full parent, script block and network chain after tuning.",
    reflect:[
      "Why is the parent–child process relationship a stronger signal than the PowerShell command text by itself?",
      "What changes between collector-initiated and source-initiated forwarding when you go from three machines to 500?",
      "If someone tried to hide activity by clearing logs, which events and settings in your setup would make that visible?"
    ],
    safety:"Security tooling: run this only on machines you own, inside the isolated lab network. The test document must perform a harmless action and must never leave the lab VM."
  },
  "p16lab5":{
    time:"two sessions of 2–3 h",
    setup:[
      "A new trial tenant from Microsoft's Intune free trial page. Conditional Access needs Microsoft Entra ID P1; if your trial does not include it, add a Microsoft 365 E5 or EMS E5 trial to the same tenant and confirm under Billing > Licenses.",
      "A fresh Windows 11 Pro or Enterprise VM (Generation 2, Secure Boot, vTPM, 4 GB RAM, 64 GB disk), not domain joined, with a snapshot taken at the first OOBE screen.",
      "An authenticator app on your phone and a password manager or sealed paper copy for the two break-glass account passwords.",
      "Trial end dates written in your calendar. Some trials ask for a card; cancel in the Microsoft 365 admin center before they convert."
    ],
    checkpoints:[
      "Entra admin center > Mobility shows Microsoft Intune with MDM user scope set; two cloud-only break-glass accounts with Global Administrator exist and you have signed in with each once.",
      "dsregcmd /status on the VM shows AzureAdJoined : YES; Intune admin center > Devices lists the VM as managed by Intune with a recent successful sync time.",
      "The compliance report shows the device Compliant; manage-bde -status shows Protection On; the device page shows a backed-up local administrator password.",
      "Sign-in logs show your policy's Report-only result first; after enabling, a sign-in from a non-compliant browser is blocked, and both break-glass accounts still sign in.",
      "dsregcmd /status shows NgcSet : YES after the Windows Hello PIN; the VM appears under Windows Autopilot devices with the profile status Assigned."
    ],
    hints:[
      "Build in this order: licences and enrollment scope, then the device, then policies, then enforcement. Conditional Access can only use compliance after Intune has evaluated the device.",
      "BitLocker compliance on a VM needs a vTPM, and attestation-based checks report only after a reboot and a check-in. For the Autopilot hash, run the Get-WindowsAutopilotInfo script from the PowerShell Gallery as administrator with -OutputFile, and import the CSV untouched.",
      "The CA policy: Users = all users excluding the break-glass group; Target resources = all resources; Grant = require MFA and require a compliant device, both required. Run the What If tool for a normal user and a break-glass account before you switch it to On."
    ],
    trouble:[
      ["The device is Entra joined but never appears in Intune","MDM user scope does not include the user, or the user has no Intune licence","Check the user's licences first, then the MDM scope; disconnect the work account and enroll again."],
      ["Compliance stays 'Not evaluated' or 'In grace period'","The device has not checked in since the policy was assigned","Trigger Sync from Settings > Accounts > Access work or school > Info, reboot once, and allow up to an hour. Read the per-setting status in the device's compliance view to find the failing item."],
      ["Locked out of the portal right after enabling Conditional Access","The break-glass accounts were not excluded, or MFA registration was incomplete","Sign in with a break-glass account and set the policy back to report-only. This is exactly why report-only comes first."],
      ["The Autopilot import fails or the device does not show up","The hash CSV was opened and re-saved in Excel, which changes its format","Export the hash again and import the raw file; wait several minutes and refresh the Autopilot list."]
    ],
    challenge:"Treat the tenant as code. With the Microsoft Graph PowerShell SDK (Connect-MgGraph), export your compliance policies and the Conditional Access policy to JSON in a Git repository. Then suspend BitLocker on the VM, time how long it takes for the device to go non-compliant and for Conditional Access to block it, and write the measured delay into your 500-device plan.",
    reflect:[
      "Why do break-glass accounts sit outside Conditional Access, and what compensating controls make that acceptable?",
      "For the 500 devices, would you choose Entra joined, hybrid joined or registered, and what would make you change that answer?",
      "What would you look for in report-only results before turning a policy on for everyone?"
    ],
    safety:"Cloud cost and access: trials can convert to paid subscriptions, so cancel before the end date. Use a new trial tenant, never your employer's tenant, and test Conditional Access with break-glass accounts excluded."
  }
});
/* ---------- p17 Cloud Computing: AWS, Azure & Google Cloud ---------- */
Object.assign(window.LABX,{
  "p17lab1":{
    time:"3–4 h",
    setup:[
      "An email you control (ideally a fresh alias), a phone for verification, and a credit or debit card. The AWS Free plan and the Azure free account need a card for identity even though the labs cost nothing.",
      "A hardware security key or an authenticator app for MFA, and a password manager for the root and admin credentials.",
      "AWS CLI v2 installed from docs.aws.amazon.com/cli, plus git. Confirm with aws --version.",
      "A private Git repository created up front to hold every template and README in this domain.",
      "A calendar reminder for the Azure 30-day window and the AWS six-month credit window, so nothing converts to paid without your knowledge."
    ],
    checkpoints:[
      "The root user has MFA enabled (IAM dashboard shows a green tick), root has zero access keys, and the alternate contacts are filled in.",
      "aws sts get-caller-identity --profile lab returns the admin user's ARN, not the root account.",
      "The CloudWatch alarm EstimatedCharges > $5 exists in us-east-1, the SNS email subscription is Confirmed, and the AWS Budget shows $10 with alerts at 50/80/100% of actual and forecast.",
      "The Azure free account shows the $200 credit, the Entra ID account has MFA on, and Cost Management shows a $10 budget wired to an action group that emails you.",
      "CloudTrail shows a trail delivering to a versioned, encrypted S3 bucket; AWS Config shows the recorder on; the README holds the tagging standard and your account, tenant and subscription IDs."
    ],
    hints:[
      "Do security before anything that can cost money. Root MFA and billing alarms are step zero, because an exposed root key with no alarm is how people wake up to a four-figure bill.",
      "Billing alarms live only in us-east-1 regardless of your working Region. Enable 'Receive Billing Alerts' in Billing preferences first, or CloudWatch will have no billing metric to alarm on.",
      "Create the alarm from the CLI with aws cloudwatch put-metric-alarm on the AWS/Billing EstimatedCharges metric with dimension Currency=USD; subscribe the SNS topic to your email and click the confirmation link, or the alarm can never notify."
    ],
    trouble:[
      ["No billing data appears in CloudWatch","Billing alerts were never enabled, or you are not in us-east-1","Switch the console to us-east-1, enable billing alerts in preferences, and wait a few hours for the first datapoint."],
      ["aws sts get-caller-identity returns the root ARN or an error","The CLI is using root keys or an unconfigured profile","Delete any root access keys, run aws configure sso --profile lab, and always pass --profile lab."],
      ["The SNS email never arrives","The subscription is Pending because the confirmation link was not clicked","Open the SNS topic, resend confirmation, and check spam. An unconfirmed subscription silently drops all alerts."],
      ["Azure budget created but no alert email","The action group has no email receiver, or the address is unverified","Edit the action group, add an Email receiver, and send yourself the test notification."],
      ["CloudTrail or Config shows charges creeping up","Config records every resource type and data events are on","Scope Config to the resource types you need and keep CloudTrail to management events in the lab."]
    ],
    challenge:"Codify the guardrails so a new account is safe in one command. Write a small CloudFormation or Terraform template that creates the SNS topic, the subscription, the billing alarm and the budget, and a short script that applies it. Delete the console-built alarm and budget, deploy from the template instead, and confirm the alert still fires by temporarily lowering the threshold to $0.01.",
    reflect:[
      "In the shared responsibility model, which of these controls protect you from the provider's failures and which protect you from your own mistakes?",
      "Why is an unused root user with MFA and no access keys safer than a convenient admin that you log in with daily?",
      "What is the first thing you would automate before giving anyone else access to this account, and why?"
    ],
    safety:"Real cloud accounts can incur real charges. Keep root MFA on, confirm the billing alarm works, and never commit access keys or the account IDs' secrets to Git."
  },
  "p17lab2":{
    time:"2–3 h",
    setup:[
      "The AWS account and lab CLI profile from Lab 1, with billing alarms live.",
      "A small static site to publish (your portfolio from an earlier domain, or a folder with index.html and a few assets).",
      "AWS CLI v2 configured; optional but useful: the site in your Git repo so you can redeploy.",
      "Optional: a domain name you own and can edit DNS for, if you want the custom-domain and ACM steps."
    ],
    checkpoints:[
      "The bucket shows Block Public Access ON and Versioning Enabled; requesting an object by its plain S3 URL returns 403 AccessDenied.",
      "The CloudFront distribution serves index.html over HTTPS from its *.cloudfront.net name, and the generated bucket policy allows only the CloudFront service principal with your distribution's source ARN.",
      "If using a domain: ACM shows the certificate Issued in us-east-1, the distribution has the alternate domain name, and the site loads over your own HTTPS name.",
      "After editing a file and syncing, the old content still serves until you create an invalidation for /*, after which the new content appears.",
      "Your one-paragraph estimate shows the arithmetic: 10,000 x 2 MB egress against the free tier, 50 MB storage, and request counts, landing near zero."
    ],
    hints:[
      "The whole point is that the bucket is private and only CloudFront can read it. If any step needs 'make the bucket public', you are on the old pattern; use Origin Access Control instead.",
      "Create the distribution with the S3 bucket as origin and an Origin Access Control; CloudFront offers to update the bucket policy for you. Set Default Root Object to index.html or the root URL returns an error.",
      "An ACM certificate used by CloudFront must be requested in us-east-1 no matter where your bucket is. Versioned filenames (app.3f9c.js) avoid invalidations because each deploy references new names the edge has never cached."
    ],
    trouble:[
      ["The CloudFront URL returns AccessDenied","OAC is not set, the bucket policy was not updated, or Default Root Object is blank","Check the three in order: OAC on the origin, the bucket policy's source-ARN condition, then the root object setting."],
      ["Edits do not show up after aws s3 sync","CloudFront is serving the cached copy until its TTL expires","Create an invalidation for /* (first 1,000 paths a month are free) or switch to versioned filenames."],
      ["The custom domain shows a certificate error","The ACM certificate is in the wrong Region or the alternate domain name is missing on the distribution","Reissue the certificate in us-east-1 and add the exact domain as an alternate domain name on the distribution."],
      ["Route 53 alias or CNAME does not resolve","DNS has not propagated or the record points to the wrong target","Query with dig or nslookup; an alias must target the distribution's domain, not the bucket."],
      ["sync uploads everything every time","No content hashing, so unchanged files are re-sent","Use aws s3 sync (which compares size and timestamp) and add --delete to remove stale objects."]
    ],
    challenge:"Build a tiny deploy pipeline: a script that syncs with versioned filenames, writes a new index.html that references them, and only invalidates index.html. Measure first-byte latency from two distant locations with curl -w, then compare the cost and latency of serving the same site straight from the S3 website endpoint with no CDN, and write down what the edge actually bought you.",
    reflect:[
      "Why do versioned filenames scale better than invalidations for a busy site, and when would you still need an invalidation?",
      "What does Origin Access Control protect against that a public bucket does not?",
      "Where does the money go in this architecture at 10,000 visitors versus 10 million, and which line grows fastest?"
    ],
    safety:"Leaving a public bucket or an unused distribution running is the usual way to lose track of cost; confirm Block Public Access and watch the billing alarm from Lab 1."
  },
  "p17lab3":{
    time:"two sessions of 2–3 h",
    setup:[
      "The AWS account, lab profile and billing alarms from Lab 1. This lab creates billable resources (a NAT gateway and an RDS instance); plan to run it for about two hours and destroy everything.",
      "AWS CLI v2 and a text editor with YAML support. Optional: cfn-lint (pip install cfn-lint) to catch template errors before deploying.",
      "The mysql client locally is not required because you connect through SSM Session Manager; the AWS Session Manager plugin for the CLI must be installed.",
      "A Git repo for the template. Take no snapshots of RDS unless you want them, because a final snapshot is a resource that survives stack deletion."
    ],
    checkpoints:[
      "aws cloudformation validate-template returns without error; the stack reaches CREATE_COMPLETE; the Resources tab shows the VPC, four subnets, the IGW, one NAT gateway, route tables and the S3 gateway endpoint.",
      "The security-group chain exists (sg-alb 443/80 from anywhere, sg-web 80 from sg-alb, sg-db 3306 from sg-web); the ALB DNS name serves a page showing an instance ID; the ASG shows desired 2 running in private subnets with no key pair.",
      "An SSM session opens to a web instance; from there the mysql client connects to the RDS endpoint; from your laptop a direct connection to both the instances and the database times out.",
      "After deleting the NAT route, dnf update fails but aws s3 ls still works through the gateway endpoint; terminating one instance triggers an ASG replacement within a couple of minutes; refreshing the ALB alternates instance IDs.",
      "The stack deletes to DELETE_COMPLETE, the console shows no leftover NAT gateways, Elastic IPs or RDS snapshots, and Cost Explorer two days later shows under about $1."
    ],
    hints:[
      "Build the template in layers and deploy after each: network first, then the security groups and compute, then the database. A template that tries to do everything at once fails in ways that are hard to read.",
      "SSM Session Manager replaces SSH and key pairs: give the instance role AmazonSSMManagedInstanceCore and make sure it can reach the SSM endpoints (through the NAT gateway, or add interface endpoints). No inbound rule is needed for SSM.",
      "The database's subnets have no default route at all; that is what 'no route out' means. The gateway endpoint for S3 is a route-table entry, which is why aws s3 ls keeps working even after you remove the NAT route."
    ],
    trouble:[
      ["The stack rolls back during creation","One resource failed; CloudFormation reverts the whole stack","Open the stack Events, find the first CREATE_FAILED line (the rest are cascade), read its status reason, fix that one resource and redeploy."],
      ["The ALB shows 502 or 503","Targets are unhealthy because nginx is not up or the health-check path or port is wrong","Check Target Group health, then read the instance's user-data log at /var/log/cloud-init-output.log via SSM."],
      ["SSM 'Session Manager plugin not found' or the instance is not a managed node","The plugin is not installed locally, or the instance lacks the SSM role or endpoint reachability","Install the Session Manager plugin; confirm the instance appears under Systems Manager Fleet Manager."],
      ["Cannot connect to RDS from the web instance","sg-db does not allow 3306 from sg-web, or the endpoint or credentials are wrong","Check the security-group chain references groups, not CIDRs; test with nc -zv <endpoint> 3306."],
      ["Stack deletion fails","The S3 logging bucket is not empty, or a final RDS snapshot blocks it","Empty the bucket, and set DeletionPolicy appropriately; delete leftover snapshots by hand."]
    ],
    challenge:"Make the one-NAT-gateway trade-off real: add a parameter that deploys one NAT gateway per AZ, then compare the hourly cost and the blast radius of an AZ failure against the single-NAT design in a short note. Then enable VPC Flow Logs to CloudWatch, generate traffic, and find in the logs the exact rejected connection from your laptop to the database.",
    reflect:[
      "Why does the database sit in subnets with no default route at all, and what attack or mistake does that prevent?",
      "A single NAT gateway saves money but adds a dependency. What exactly fails if its AZ goes down, and who notices?",
      "Which leftover resources cost money after a careless 'delete', and what habit catches them every time?"
    ],
    safety:"This lab creates billable resources. Destroy the stack when done, verify no NAT gateways, Elastic IPs or RDS snapshots remain, and keep the Lab 1 billing alarm active."
  },
  "p17lab4":{
    time:"3–4 h",
    setup:[
      "The AWS account and lab profile from Lab 1. GuardDuty's 30-day trial and Access Analyzer are free for the trial window; turn GuardDuty off at the end.",
      "AWS CLI v2 and CloudShell (in-console) for assume-role tests. A customer-managed KMS key will be created; note that KMS keys cost about $1/month, so schedule it for deletion at the end.",
      "A test bucket for PDF-style objects and a couple of small files to upload.",
      "Everything in this lab targets only your own account; that is the only testing that needs no authorization."
    ],
    checkpoints:[
      "The identity policy allows only s3:GetObject and s3:PutObject on the bucket ARN with a Condition aws:SecureTransport true; assuming the role with aws sts assume-role returns temporary credentials.",
      "A table records the IAM Policy Simulator verdict and the real CLI result for GetObject, ListBucket, DeleteObject and ec2:DescribeInstances, and they agree.",
      "With an explicit Deny for DeleteObject in the bucket policy and an Allow in the identity policy, the delete is still denied; your one sentence states that an explicit Deny always wins.",
      "A read fails with a KMS AccessDenied error until the role is granted kms:Decrypt, then succeeds; CloudTrail event history shows both Decrypt calls with the role session name.",
      "Access Analyzer runs, the credential report downloads, GuardDuty shows sample findings, and the one-page playbook for InstanceCredentialExfiltration lists revoke, isolate and read-CloudTrail steps."
    ],
    hints:[
      "Least privilege means the policy allows exactly the four verbs you need and nothing else. Resist adding s3:* to make an error go away; the error is the lesson.",
      "IAM policy evaluation: an explicit Deny anywhere overrides any Allow. Among Allows, the union applies. Write the order you observe in your own words after the bucket-policy-versus-identity-policy test proves it.",
      "For the KMS step, the key policy and the role's permissions must both allow use of the key. Grant kms:Decrypt to the role (via the key policy or a grant), then find both attempts in CloudTrail by filtering on the event name Decrypt and your role session name."
    ],
    trouble:[
      ["Every S3 call denies even GetObject","The aws:SecureTransport condition, a missing resource ARN, or using the wrong credentials","Compare the simulator output to the CLI; the simulator names the statement that decided. Confirm you are using the assumed-role credentials."],
      ["The delete succeeds when you expected a deny","The explicit Deny is on the wrong resource ARN or the wrong principal","Check the bucket policy's Resource (/* for objects) and Principal; re-run and read which statement applied."],
      ["Reads fail with KMS.AccessDeniedException even after granting Decrypt","The key policy still excludes the role, or the old session cached the denial","Edit the key policy to include the role, then start a fresh assume-role session."],
      ["CloudTrail shows no Decrypt events","Data events are not logged, or you are reading the wrong Region or time window","Management events include KMS Decrypt; widen the time range and confirm the Region matches the key's Region."],
      ["GuardDuty shows nothing","Sample findings were not generated, or the detector is in another Region","Run the generate-sample-findings action in the detector's Region and refresh."]
    ],
    challenge:"Write the policy with Access Analyzer's policy generation from CloudTrail: perform the four actions, let Access Analyzer propose a least-privilege policy from the logged activity, and compare it line by line with your hand-written one. Then add an aws:SourceIp condition that restricts the role to your own IP and prove from CloudShell (a different IP) that it is denied.",
    reflect:[
      "Why does an explicit Deny override every Allow, and how does that make bucket policies a safe backstop?",
      "What did the simulator get right or wrong compared with the live CLI, and when would you trust one over the other?",
      "Encryption added a second gate (KMS) on top of IAM. When is that extra gate worth the operational cost?"
    ],
    safety:"Security tooling and encryption keys: operate only in your own account. Schedule the KMS key for deletion and disable GuardDuty at the end of the trial to avoid ongoing charges."
  },
  "p17lab5":{
    time:"two sessions of 2–3 h",
    setup:[
      "The AWS account and lab profile from Lab 1, plus the Azure free account from Lab 1 with a resource group you can delete wholesale.",
      "AWS SAM CLI (docs.aws.amazon.com/serverless) or plain CloudFormation; Azure Functions Core Tools and the Azure CLI (az). Python 3.13 locally, and curl.",
      "boto3 is bundled in the Lambda Python runtime; for local packaging use a virtual environment with pinned versions.",
      "Delete both stacks and the Azure resource group at the end; confirm both bills return to zero."
    ],
    checkpoints:[
      "The DynamoDB table exists with partition key id and on-demand capacity; the Lambda (256 MB, arm64) PUTs and GETs items; curl against the function URL or HTTP API returns the stored item as JSON.",
      "A 1,000-request run produces REPORT lines in CloudWatch Logs Insights; you can point to the cold-start invocation and show your GB-second cost table at 100k, 1M and 50M requests with and without the free tier.",
      "The SAM or CloudFormation template deploys the function, table, role and API together, and the console-built copy is deleted.",
      "The Azure Function App on Consumption responds to curl with a function key; Cosmos DB free tier or Table Storage holds the items.",
      "A side-by-side table compares cold starts, IAM role versus managed identity, the free grants, and CloudWatch versus Application Insights; after deleting the resource group and stack both bills read zero."
    ],
    hints:[
      "Give the Lambda execution role only the table's PutItem and GetItem plus the three CloudWatch Logs actions (CreateLogGroup, CreateLogStream, PutLogEvents). A wildcard role here defeats the lesson.",
      "The cost formula is requests x price-per-request plus GB-seconds x price-per-GB-second, where GB-seconds = (memory in GB) x (billed duration in seconds) x request count. The REPORT line gives you billed duration and max memory used per invocation.",
      "On Azure, the managed identity replaces the IAM role and the function key protects the endpoint. Deploy with func azure functionapp publish or az functionapp, and read cold starts in Application Insights' Live Metrics or the requests table."
    ],
    trouble:[
      ["Lambda returns AccessDenied talking to DynamoDB","The execution role lacks PutItem/GetItem on the table ARN","Add exactly those two actions scoped to the table ARN; check the error in CloudWatch Logs, which names the missing action."],
      ["curl to the function URL returns 403","The function URL auth type is AWS_IAM but you sent an unsigned request","Set the URL auth to NONE for the lab, or sign the request; for the HTTP API check the route and stage."],
      ["Cold starts dominate every call","Each request hits a fresh execution environment at low volume","Fire a warm burst, then read steady-state durations; note that provisioned concurrency removes cold starts at a cost."],
      ["Azure func publish fails or the function 404s","Wrong runtime, missing function key, or the app is still starting","Confirm the Python version matches, pass the key as ?code= or the x-functions-key header, and wait for the app to warm."],
      ["Bills are not zero after cleanup","A table, log group, Cosmos account or the resource group survived","Delete the resource group as a whole on Azure; on AWS delete the stack, then check DynamoDB, Lambda and log groups by hand."]
    ],
    challenge:"Load the AWS API harder: run a short burst at higher concurrency, capture the duration distribution from Logs Insights, and compute the P50 and P99 billed duration. Then set the Lambda memory to 128 MB and to 512 MB, re-run, and show from your cost table whether more memory makes the function cheaper per request because it finishes faster.",
    reflect:[
      "Why can more memory sometimes lower the total bill for a CPU-bound function, and how would you find the sweet spot?",
      "Compare the IAM role and the Azure managed identity: what problem do both solve, and how do they differ in daily use?",
      "Which cloud's developer experience did you prefer for this task, and which specific step drove that preference?"
    ],
    safety:"Serverless is cheap but not free at scale. Delete both stacks and the Azure resource group, confirm no tables or log groups linger, and keep the billing alarm from Lab 1 on."
  }
});
/* ---------- p18 Databases & SQL ---------- */
Object.assign(window.LABX,{
  "p18lab1":{
    time:"two sessions of 2–3 h",
    setup:[
      "Docker Desktop or Docker Engine installed (docs.docker.com). Confirm with docker --version. About 2 GB free for the image and data.",
      "A psql client: either use the one inside the container with docker exec, or install the postgresql-client package locally.",
      "The Pagila sample database from github.com/devrimgunduz/pagila (pagila-schema.sql then pagila-data.sql). Optionally the Chinook database too.",
      "A free account on pgexercises.com, and a text file or SQL file where you will save your twelve queries with comments."
    ],
    checkpoints:[
      "docker exec -it pg18 psql -U postgres then \\l shows the postgres database and your Pagila database; the container shows Up in docker ps.",
      "\\dt lists the Pagila tables, \\d film shows its columns, and SELECT count(*) returns the expected non-zero counts for film, customer, rental and payment.",
      "Twelve saved queries run without error and return rows: three joins including one NOT EXISTS anti-join, three GROUP BY with HAVING, two subqueries, two CTEs (one recursive), two window functions.",
      "Every pgexercises category shows complete, and you have notes on the three exercises that were hardest and why."
    ],
    hints:[
      "Map the port to localhost only (127.0.0.1:5432:5432) so the database is never exposed to your network. Load the schema before the data, because the data file assumes the tables exist.",
      "An anti-join 'customers with no rentals' is cleanest as NOT EXISTS (SELECT 1 FROM rental r WHERE r.customer_id = c.customer_id). A running total is sum(amount) OVER (ORDER BY payment_date).",
      "A recursive CTE needs the WITH RECURSIVE keyword, a base case, UNION ALL, and the recursive reference to the CTE name. For a hierarchy, generate one with generate_series or use a self-referencing table."
    ],
    trouble:[
      ["docker run says the port is already allocated","Another PostgreSQL (or a previous container) is bound to 5432","Run docker ps to find it, stop it, or map a different host port such as 127.0.0.1:5433:5432."],
      ["psql: 'password authentication failed for user postgres'","The POSTGRES_PASSWORD you set does not match what you typed","Recreate the container with a known password, or docker exec in and ALTER USER postgres PASSWORD."],
      ["The data file errors with 'relation does not exist'","pagila-data.sql was loaded before pagila-schema.sql","Load the schema first, then the data; drop and recreate the database if it is half-loaded."],
      ["\\dt shows no tables after loading","You loaded into a different database or as a different user","Confirm with SELECT current_database(); load Pagila into the database you are querying."],
      ["A window function errors with 'must appear in GROUP BY'","You mixed an aggregate and a window without the right clause","Remember window functions do not collapse rows; remove the GROUP BY or use a subquery."]
    ],
    challenge:"Take one of your window-function queries and rewrite it three ways: with a window function, with a correlated subquery, and with a self-join. Run EXPLAIN (ANALYZE) on each, record the timings, and write one paragraph on why the planner handles them differently. Then wrap the recursive CTE in a view and query it.",
    reflect:[
      "When does a correlated subquery read better than a join, and when does it cost more to run?",
      "What does a window function compute that a GROUP BY cannot, and why does it keep every row?",
      "Which pgexercises problem taught you the most, and what mental model did you lack before it?"
    ]
  },
  "p18lab2":{
    time:"3–4 h",
    setup:[
      "The PostgreSQL container from Lab 1 running, with a new empty database for this lab.",
      "A real spreadsheet you keep, exported to CSV. Anonymize anything sensitive first; an as-built or inventory sheet works well.",
      "A diagramming tool for the ER diagram: dbdiagram.io (free, in-browser) or a paper sketch you photograph.",
      "psql open, plus the CSV accessible to the container (copy it in with docker cp or mount a volume)."
    ],
    checkpoints:[
      "A list of every column with the functional dependencies you identified (X determines Y) written out.",
      "An ER diagram with 1NF, 2NF and 3NF tables, every primary key and foreign key named, and a note on the anomaly each split removes.",
      "CREATE TABLE statements run clean with NOT NULL, UNIQUE, CHECK and FOREIGN KEY constraints; \\d on each table shows them.",
      "COPY loads the staging table; INSERT ... SELECT DISTINCT populates the normalized tables with the expected row counts.",
      "A join query reproduces the original sheet row for row, and a duplicate-serial and a negative-footage insert are both rejected with their SQLSTATE codes (23505 for unique violation, 23514 for check violation)."
    ],
    hints:[
      "Find the functional dependencies first: for each candidate key ask what it uniquely determines. 2NF removes dependencies on part of a composite key; 3NF removes dependencies between non-key columns.",
      "Load everything as text into a staging table first, then cast and split into the clean tables. COPY staging FROM '/path/file.csv' WITH (FORMAT csv, HEADER true) is the fastest way in.",
      "A CHECK constraint like CHECK (footage >= 0) rejects the negative value; a UNIQUE constraint on serial rejects the duplicate. The error text includes the SQLSTATE; capture it from the server message."
    ],
    trouble:[
      ["COPY fails with 'could not open file for reading: No such file or directory'","The path is the container's filesystem, not your host","docker cp the CSV into the container, or use \\copy from the psql client which reads the local file."],
      ["COPY rejects rows on type or null errors","The staging table is too strict, or the CSV has blanks and bad dates","Make every staging column text, load, then cast and clean with INSERT ... SELECT."],
      ["A foreign key insert fails with 23503","The referenced parent row does not exist yet","Load parent (dimension) tables before child tables; insert DISTINCT parents first."],
      ["The reproduction query returns too many or too few rows","A join is missing a key or duplicates a parent","Check join cardinality: count rows at each join and compare to the original sheet's row count."],
      ["CHECK or UNIQUE does not fire","The constraint was not actually created, or data was loaded before it","Run \\d table to confirm the constraint exists; add it with ALTER TABLE and retest the bad insert."]
    ],
    challenge:"Add a surrogate key and a natural key to one table and justify which you expose to the application. Then write a trigger or a generated column that enforces a rule the CHECK constraints cannot (for example, that a span's end station is greater than its start), and prove it rejects a bad row. Finally, measure how a missing index on a foreign key affects a join with EXPLAIN.",
    reflect:[
      "Which anomaly (insert, update or delete) would have bitten you worst in the original flat sheet, and how does 3NF remove it?",
      "When is denormalizing back to a wider table the right call, and what do you give up?",
      "Why do constraints in the database beat the same checks in application code?"
    ]
  },
  "p18lab3":{
    time:"3–4 h",
    setup:[
      "The PostgreSQL container from Lab 1 with a database for this lab; give the container enough shared memory for a 10-million-row table.",
      "psql, and a file to keep your tuning log (the nine plans and your arithmetic).",
      "Know your version's defaults: SHOW seq_page_cost; and SHOW random_page_cost; so your cost arithmetic uses the real constants.",
      "Generate the events table with generate_series so the data is reproducible."
    ],
    checkpoints:[
      "The events table has 10,000,000 rows after INSERT ... generate_series, and ANALYZE has run; EXPLAIN (ANALYZE, BUFFERS) is captured for a point lookup, a 1% range and a 90% range.",
      "After adding a B-tree index on user_id and a BRIN index on ts, the three plans are re-captured, and your writeup explains each planner choice from seq_page_cost, random_page_cost and row estimates.",
      "Each of the three mistakes (function on an indexed column, implicit cast, OFFSET 1000000) is reproduced with its slow plan and fixed with a fast plan.",
      "A covering index with INCLUDE makes one query switch to Index Only Scan after VACUUM, visible in the plan as 'Index Only Scan' with 'Heap Fetches: 0'."
    ],
    hints:[
      "Always run ANALYZE before trusting a plan; stale statistics make the planner guess wrong. Read plans from the innermost node outward.",
      "A 90% range should use a sequential scan on purpose: reading most of the table in order is cheaper than millions of random index lookups. The planner compares estimated cost, and that is the lesson, not a bug.",
      "An Index Only Scan needs all selected columns in the index (use INCLUDE for non-key columns) and an up-to-date visibility map, which VACUUM maintains. Heap Fetches: 0 confirms it never touched the table."
    ],
    trouble:[
      ["The index exists but the planner ignores it","The query uses a function or cast on the column, or the range is too wide","Check for WHERE date(ts) = ... or a type mismatch; rewrite as a sargable range so the index applies."],
      ["Index Only Scan still shows Heap Fetches","The visibility map is stale after bulk inserts","Run VACUUM (or VACUUM ANALYZE) on the table and re-run the query."],
      ["Plans change between runs","Caching warms buffers, or autovacuum changed statistics","Use BUFFERS to see shared hit vs read, and run each query twice, reporting the warm run."],
      ["OFFSET 1000000 is slow even with an index","The engine still scans and discards the skipped rows","Switch to keyset pagination (WHERE id > last_seen ORDER BY id LIMIT n)."],
      ["BRIN index helps nothing","The ts column is not physically correlated with insertion order","BRIN relies on clustering; confirm rows were inserted in ts order or CLUSTER the table."]
    ],
    challenge:"Force the planner's hand to learn its limits: disable sequential scans with SET enable_seqscan = off for the 90% query and show the worse plan and timing, proving the planner was right to choose the scan. Then widen the row estimate error by inserting skewed data without re-running ANALYZE, watch the plan go wrong, and fix it by raising the statistics target on that column.",
    reflect:[
      "Why is a sequential scan sometimes the correct plan, and what two cost constants decide the crossover point?",
      "What makes a predicate sargable, and why does a function on the column defeat the index?",
      "When would you accept the write cost of a covering index to win an Index Only Scan?"
    ]
  },
  "p18lab4":{
    time:"3–4 h",
    setup:[
      "A PostgreSQL container with Pagila loaded for the logical dump, plus a second local PostgreSQL instance (another container or a native install) for the physical base-backup and PITR drill.",
      "The server tools pg_dump, pg_restore, pg_basebackup in your PATH or inside the container.",
      "Writable directories for the WAL archive and the base backup, with enough disk for the WAL you will generate.",
      "A clock you trust and a notepad: PITR is about time, so you will record wall-clock timestamps throughout."
    ],
    checkpoints:[
      "pg_dump -Fc produces a custom-format file; pg_restore -j 4 loads it into a new database; SELECT count(*) matches the source on film, customer and payment.",
      "The second instance has archive_mode on and a working archive_command; pg_basebackup -X stream produced a base backup; timestamped rows were inserted once a minute for ten minutes.",
      "After a destructive DELETE at a noted time, restoring the base backup with recovery_target_time set to just before it, plus recovery.signal, brings the server up and the deleted rows are present again.",
      "The runbook lists every command with its output and timing, the recovered row count, and the measured recovery time end to end."
    ],
    hints:[
      "Separate the two recovery types: pg_dump is a logical snapshot (good for moving or restoring a database), while base backup plus WAL replay is physical and lets you stop at an exact second.",
      "For PITR you need archive_mode = on, a restorable archive_command, and WAL streamed during the base backup. Recovery reads restore_command and recovery_target_time, and you create recovery.signal to tell PostgreSQL to enter recovery.",
      "Set recovery_target_time to a timestamp a second or two before the DELETE, and set recovery_target_action = promote so the server comes up read-write once it reaches the target."
    ],
    trouble:[
      ["pg_restore reports errors about existing objects","Restoring into a non-empty database","Restore into a freshly created empty database, or use --clean --if-exists deliberately."],
      ["Recovery never reaches the target and stays in recovery","The archive_command failed earlier, so WAL files are missing","Check the server log; it names the WAL file it cannot find. Verify the archive directory actually received files during the backup window."],
      ["The server starts but the deleted rows are still gone","recovery_target_time was after the DELETE, or the time zone was wrong","Re-check the noted time and the session time zone; set the target a little earlier and retry from the base backup."],
      ["pg_basebackup fails with 'could not connect' or a slot error","Missing replication privileges or wal_level too low","Set wal_level = replica, allow a replication connection in pg_hba.conf, and retry."],
      ["Row counts differ after a logical restore","The dump ran while data was changing","Dump a quiet database or use a consistent snapshot; pg_dump is already consistent to its start time, so check for post-dump writes."]
    ],
    challenge:"Turn the drill into a tested procedure: write a script that takes the base backup, generates known rows with timestamps, performs the destructive change, and restores to a target time passed as an argument, then verifies the expected row count automatically. Run it for two different target times and confirm each lands on the right state. Measure how recovery time grows with the amount of WAL to replay.",
    reflect:[
      "When would you reach for a logical dump versus physical PITR, and what does each cost in time and storage?",
      "What is the recovery point objective of your setup, and which setting determines how much data you could lose?",
      "Why does testing restores matter more than testing backups, and what did your measured recovery time reveal?"
    ],
    safety:"Run the destructive DELETE only against the lab instance. Never point an archive_command or a restore at a database anyone depends on, and keep the drill on disposable data."
  },
  "p18lab5":{
    time:"3–4 h",
    setup:[
      "The PostgreSQL container from earlier labs, plus redis:8 and mongo:8 containers, all bound to 127.0.0.1 only.",
      "Clients: redis-cli (in the Redis container), mongosh (in the Mongo container or installed), and psql. Python 3 with redis, pymongo and psycopg for the timing scripts.",
      "The 1,000 Pagila films exported so you can load the same data into all three stores.",
      "A read-only copy of a SQLite file you own (for example a copy of a browser profile database), never the live file."
    ],
    checkpoints:[
      "Each store is reachable only on 127.0.0.1; Redis requires a password (requirepass) and MongoDB has authorization enabled with a user you created; an unauthenticated connection is refused.",
      "The same 1,000 films are stored three ways (a PostgreSQL table with a JSONB attrs column, a MongoDB collection, Redis hashes keyed film:<id>); a count in each returns 1,000.",
      "A timing table shows 1,000 single-item reads and one 'all films by category' query in each store, with the numbers you measured.",
      "Changing one film's rental rate in all three is done, with a written note on the consistency each gave and what a crash mid-change would do.",
      "Python's sqlite3 opens the copied file read-only and lists its tables with a query against sqlite_master."
    ],
    hints:[
      "Harden before you benchmark. A Redis or MongoDB on a default bind with no auth is the classic exposed-database incident; this lab makes you set requirepass and enable MongoDB authorization first.",
      "For a fair read test, time the same operation shape in each: a primary-key get in PostgreSQL, a findOne by _id in MongoDB, an HGETALL in Redis. Use a loop of 1,000 and report total and per-op time.",
      "Open SQLite read-only with sqlite3.connect('file:copy.db?mode=ro', uri=True) and list tables with SELECT name FROM sqlite_master WHERE type='table'."
    ],
    trouble:[
      ["Cannot connect to Redis or Mongo from Python","Bound to 127.0.0.1 inside the container but the port is not published, or auth is missing","Publish 127.0.0.1:6379 and 127.0.0.1:27017, and pass the password or auth database in the client."],
      ["MongoDB lets you in with no password","authorization is not enabled, or you connected over the localhost exception","Start mongod with --auth, create an admin user, and confirm an anonymous connection is refused."],
      ["Redis reads are suspiciously fast or slow","You timed network round trips one at a time, or pipelining skewed it","Report single-op latency honestly; note that Redis is in-memory, which is the point of the comparison."],
      ["sqlite3 raises 'database is locked'","You opened the live file while an application held it","Copy the file first and open the copy read-only; never test against the live database."],
      ["JSONB queries are slow in PostgreSQL","No GIN index on the attrs column","Add a GIN index if you query inside the JSON; note this is the cost of document flexibility in a relational store."]
    ],
    challenge:"Make the consistency difference concrete: write a script that updates the rental rate in all three stores but is killed halfway (raise an exception after the first write). Restart and inspect each store's state, then describe which left you with a torn update and how a transaction (PostgreSQL) or a document-level atomic update (MongoDB) would have prevented it. Add a Redis MULTI/EXEC block and show the difference.",
    reflect:[
      "For the 'all films by category' query, which store was most expressive and which fastest, and why are those not the same store?",
      "What exactly does a crash mid-change cost in each model, and which store's default behavior surprised you?",
      "Given your own as-built data, which of the four stores would you actually choose, and what would change that choice?"
    ],
    safety:"Bind every database to 127.0.0.1 and set authentication before loading data; an exposed Redis or MongoDB with no password is a real and common breach. Work only on a copy of any SQLite file you own."
  }
});
/* ---------- p19 DevOps, Containers & Kubernetes ---------- */
Object.assign(window.LABX,{
  "p19lab1":{
    time:"3–4 h",
    setup:[
      "Docker Desktop or Docker Engine (docs.docker.com); confirm docker run hello-world works.",
      "The Flask app from an earlier domain in a Git repo, with a requirements file pinning versions.",
      "Trivy for image scanning (aquasecurity.github.io/trivy) and dive for layer inspection (github.com/wagoodman/dive); both are single binaries.",
      "A terminal where you can run docker stats and docker inspect; about 2 GB free disk for images."
    ],
    checkpoints:[
      "The naive image builds; docker images shows its size (likely 1 GB+), docker history shows many layers, and docker inspect shows it runs as root (User is empty or 0).",
      "The two-stage image is under 200 MB, runs as a non-root user (docker inspect shows a UID), has a HEALTHCHECK, and a one-line code change rebuilds in seconds thanks to layer caching and .dockerignore.",
      "Running with --memory=256m --cpus=1 --read-only --tmpfs /tmp --cap-drop ALL still serves requests; docker stats shows the limits; on the host, ps shows the container process with its real PID.",
      "trivy image reports fewer vulnerabilities after moving to the newest slim digest; dive shows wasted space and efficient layers.",
      "compose up starts app and Redis on a user-defined network; the app resolves redis by name (getent hosts redis or a ping inside the container)."
    ],
    hints:[
      "The size win comes from not shipping build tools. Build the wheel or venv in a first stage, then copy only the runtime artifacts into a slim final stage.",
      "Order the Dockerfile so dependencies install before the app code is copied; then a code change only invalidates the last layer. Add a .dockerignore with .git, __pycache__ and the venv.",
      "Create a non-root user with adduser and switch with USER before CMD. --cap-drop ALL removes Linux capabilities; the process still runs because a web server needs none of them once bound above port 1024."
    ],
    trouble:[
      ["The container exits immediately","CMD is wrong, the app crashed on start, or it tried to write to a read-only filesystem","Run docker logs <id>; for the read-only case, mount a tmpfs where the app writes."],
      ["Build is slow every time despite small changes","COPY . . comes before pip install, so the dependency layer is always rebuilt","Copy requirements first, install, then copy the rest; add .dockerignore."],
      ["--read-only breaks the app","The app writes logs, a pid file or a cache to the filesystem","Add --tmpfs for those paths, or point them at a mounted volume; this teaches you what the app writes."],
      ["Containers cannot resolve each other by name","They are on the default bridge, which has no DNS","Put both on a user-defined network (compose does this automatically) so Docker's embedded DNS resolves service names."],
      ["Trivy finds criticals you cannot fix","They are in the base image, not your code","Move to the newest slim or distroless digest; pin by digest so the fix sticks."]
    ],
    challenge:"Pin the final image to a distroless base and get it building and running as non-root with no shell inside. Prove the attack surface shrank by showing docker run --entrypoint sh fails, then measure cold start and image pull time against the slim version. Write which Linux namespace or cgroup isolated which resource (PID, network, memory) from the evidence in docker inspect and ps.",
    reflect:[
      "Which kernel features (namespaces, cgroups, capabilities) actually isolated your container, and which of them stops which class of problem?",
      "Why does a read-only root filesystem make a compromised container less useful to an attacker?",
      "What did the slim or distroless base remove, and what did you give up for the smaller attack surface?"
    ],
    safety:"Security tooling: scan and run only images you built or trust, on your own machine."
  },
  "p19lab2":{
    time:"3–4 h",
    setup:[
      "A GitHub account and the Flask repo from Lab 1 pushed to it. GitHub Actions minutes are free for public repos.",
      "A VPS or home server you own for the deploy target, reachable over Tailscale (tailscale.com) so no port is exposed to the internet; Docker and docker compose installed on it.",
      "The repo's Settings > Environments ready to create a 'production' environment, and Settings > Secrets for any SSH key.",
      "Trivy knowledge from Lab 1; the action pins you will use come from the actions' README (use full commit SHAs)."
    ],
    checkpoints:[
      "ci.yml has top-level permissions: contents: read; every push runs the test job across Python 3.12 and 3.13 with pip caching; a JUnit artifact is uploaded and visible on the run.",
      "On main, the build job logs in to ghcr.io with GITHUB_TOKEN and packages: write, builds with docker/build-push-action, tags with the commit SHA, and outputs the digest; the GHCR package page shows that digest.",
      "The deploy job uses environment: production with you as a required reviewer; it waits for approval, then runs docker compose pull && up -d over SSH via Tailscale.",
      "Every third-party action is pinned to a full commit SHA, Dependabot for github-actions is enabled, and a build step fails when Trivy finds a critical CVE.",
      "A PR with a hostile-looking title builds without that title ever reaching a run: shell step; your workflow uses env vars, not direct interpolation."
    ],
    hints:[
      "Least privilege for the token: set permissions at the top to read, then raise only the job that needs packages: write. The default token is powerful; narrow it.",
      "Tag the image with ${{ github.sha }} so every build is traceable, and read the pushed digest from the build-push-action output. Use environments to gate production behind a reviewer.",
      "Never put ${{ github.event.pull_request.title }} directly inside a run: line; assign it to an env: variable and reference $TITLE, so a title like '; rm -rf' is data, not code."
    ],
    trouble:[
      ["The workflow does not run at all","The file is misnamed or in the wrong path, or YAML is invalid","It must be .github/workflows/*.yml; check the Actions tab for a parse error and validate the YAML indentation."],
      ["ghcr login fails with 'denied' or 'permission_denied'","The job lacks packages: write, or the package visibility blocks it","Add packages: write to that job's permissions and check the package's access settings."],
      ["The deploy job runs without waiting","The environment has no required reviewer, or the job did not set environment:","Add a required reviewer to the production environment and set environment: production on the job."],
      ["SSH deploy fails with 'Permission denied (publickey)'","The private key secret is wrong or the server lacks the matching public key","Confirm the public key is in the server's authorized_keys and the secret holds the full private key; test the Tailscale hostname resolves."],
      ["Trivy step passes despite known CVEs","Severity or exit-code flags are not set","Run trivy with --severity CRITICAL --exit-code 1 so the step actually fails the build."]
    ],
    challenge:"Add OIDC-based deployment to a cloud instead of a long-lived SSH key: configure the job to request an OIDC token and assume a cloud role with no stored secret, and explain in a note why this is safer than the SSH key. Then add a concurrency group so a new push to main cancels an in-flight deploy, and prove it by pushing twice quickly.",
    reflect:[
      "Why pin actions to a commit SHA rather than a tag like v4, and what supply-chain attack does that stop?",
      "What makes untrusted PR input (a title, a branch name) dangerous in a run: step, and how does the env-var pattern neutralize it?",
      "Why is OIDC preferable to a stored cloud credential for deployment?"
    ],
    safety:"Security and access: deploy only to a host you own, keep it off the public internet with Tailscale, and never print secrets in logs."
  },
  "p19lab3":{
    time:"3–4 h",
    setup:[
      "A cloud account you own with a billing alarm already set (AWS Free plan credits, or Oracle Cloud Always Free which has no time limit).",
      "Terraform (developer.hashicorp.com/terraform) and the cloud CLI configured; confirm terraform version and that the CLI can authenticate.",
      "Ansible installed (pip install ansible or the distro package) for the configuration step.",
      "A Git repo for the .tf files; the state bucket will be created by hand before Terraform uses it as a backend."
    ],
    checkpoints:[
      "The state bucket exists; terraform init succeeds with the s3 backend and use_lockfile; terraform fmt and validate pass.",
      "terraform plan -out=tfplan then apply tfplan creates a security group and one small instance; curl of its public IP returns your app's page; terraform state list shows the resources.",
      "After adding a rule in the console, terraform plan -refresh-only shows the drift, a normal plan proposes to remove it, and apply restores the code's state.",
      "terraform workspace new staging creates an isolated state, and you can explain what changed (a separate state file, same code).",
      "The Ansible playbook installs a package and places a config file; the first run reports changed, the second reports ok; terraform destroy leaves the console empty and the bill near zero."
    ],
    hints:[
      "Pin the provider version and use a remote backend with locking from the start, so a second apply cannot corrupt state. The lockfile is what stops two runs clobbering each other.",
      "Drift is the gap between real infrastructure and your code. plan -refresh-only shows what reality looks like now; a normal plan shows what Terraform would do to match the code again.",
      "Idempotence is the Ansible lesson: a module that already converged reports ok, not changed. Use the package and copy/template modules, which are declarative, rather than a shell command that runs every time."
    ],
    trouble:[
      ["terraform init fails on the backend","The state bucket does not exist yet, or credentials cannot reach it","Create the bucket by hand first; confirm the CLI can list it before init."],
      ["Error: 'Error acquiring the state lock'","A previous run crashed and left the lock, or two runs overlap","Wait, then if truly stuck use terraform force-unlock with the lock ID shown; investigate why it was held."],
      ["curl of the instance times out","The security group has no ingress rule, or user_data has not finished","Check the security group rule and the instance's cloud-init log; give user_data a minute."],
      ["Ansible run reports changed every time","A shell or command task runs unconditionally","Replace it with an idempotent module, or add creates/changed_when so it reports honestly."],
      ["destroy leaves resources and cost","Something was created outside Terraform, or a resource has deletion protection","Import or delete the stray resource; disable protection; confirm state list is empty."]
    ],
    challenge:"Refactor the single instance into a reusable module with input variables and outputs, then instantiate it twice (dev and staging) from one root configuration. Introduce drift in only the staging instance and show that plan touches staging but not dev. Then move the state bucket's object to simulate a lost lock and recover cleanly, documenting the steps.",
    reflect:[
      "Why is remote, locked state essential the moment more than one person or pipeline runs Terraform?",
      "What is the difference between a refresh-only plan and a normal plan, and when do you want each?",
      "Why does idempotence let you run the same playbook safely over and over, and how does that change operations?"
    ],
    safety:"Real cloud resources cost money. Set the billing alarm before applying, destroy at the end, and never commit the state file or cloud credentials to Git."
  },
  "p19lab4":{
    time:"3–4 h",
    setup:[
      "A machine with 8 GB RAM free and Docker installed; kubectl and kind (kind.sigs.k8s.io) or minikube.",
      "A kind config that disables the default CNI and maps host ports 80 and 443, so you can install Calico and reach the gateway.",
      "Calico manifests for NetworkPolicy enforcement, and Envoy Gateway or Traefik for the Gateway API.",
      "A Git repo for all manifests; app.localtest.me resolves to 127.0.0.1 with no DNS setup needed."
    ],
    checkpoints:[
      "kubectl get nodes shows the kind node Ready after Calico is installed; kubectl get pods -n kube-system shows Calico running.",
      "In namespace shop, the Deployment (digest-pinned, with requests/limits and a readiness probe), Service, ConfigMap and Secret exist; kubectl get endpointslices shows the pod IPs; the service DNS name resolves inside a test pod.",
      "The Gateway, GatewayClass and HTTPRoute (or Ingress) are Programmed/Accepted; curl http://app.localtest.me returns the app's response through the gateway.",
      "A rolling update to a new digest completes and a rollback works; breaking the readiness probe stalls the rollout and kubectl rollout status reports it.",
      "A default-deny NetworkPolicy makes the app unreachable; after allowing only the gateway namespace, kubectl exec curl tests succeed from the gateway and fail from elsewhere."
    ],
    hints:[
      "The CNI is the piece that enforces NetworkPolicy. kind's default CNI does not, so you disable it and install Calico; otherwise your default-deny policy does nothing.",
      "Follow the path: Service selects pods, EndpointSlices list their IPs, and the cluster DNS name is service.namespace.svc.cluster.local. If curl fails, walk that chain to find the broken link.",
      "A default-deny is a NetworkPolicy that selects all pods with empty ingress rules. Then add a second policy whose ingress allows from the gateway namespace by namespaceSelector."
    ],
    trouble:[
      ["Pods stay Pending","Insufficient resources, or the CNI is not installed so pods cannot get an IP","kubectl describe pod shows the reason; install Calico and confirm nodes are Ready."],
      ["curl through the gateway returns connection refused","The Gateway is not Programmed, the HTTPRoute hostname is wrong, or ports are not mapped","Check kubectl get gateway and the HTTPRoute status; confirm the kind config maps 80/443."],
      ["The rollout hangs","maxUnavailable/maxSurge plus a failing readiness probe block progress","kubectl rollout status and kubectl describe show the new pods never become Ready; fix the probe."],
      ["default-deny blocks nothing","Calico is not enforcing, or the policy selects the wrong pods","Confirm Calico is the CNI and the policy's podSelector matches; test with an exec curl before and after."],
      ["Service has no endpoints","The Service selector does not match the pod labels","kubectl get endpointslices shows empty; align the selector and the pod template labels exactly."]
    ],
    challenge:"Add a second application in a different namespace and write NetworkPolicies so the two cannot talk to each other but both can be reached through the gateway. Then add resource limits that are too low, watch the pod get OOMKilled, read the event, and right-size it. Capture the whole working set as a single kustomization you can apply to a fresh cluster.",
    reflect:[
      "Why can NetworkPolicy do nothing without a CNI that enforces it, and what does that teach you about Kubernetes defaults?",
      "Walk the request from curl to the container: which object does each hop depend on?",
      "Why does a readiness probe stall a rollout on purpose, and how does that protect users during a bad deploy?"
    ]
  },
  "p19lab5":{
    time:"two sessions of 2–3 h",
    setup:[
      "Free accounts on Killercoda (killercoda.com) and KodeKloud; both run CKA-style scenarios in the browser, so no local cluster is required.",
      "A stopwatch or a notes file to time each task, and the one-page troubleshooting playbook you started in the module.",
      "Familiarity with kubectl from Lab 4; the exam shell aliases (k=kubectl, export do='--dry-run=client -o yaml') speed everything up.",
      "The official Kubernetes docs open in a tab: the real exam allows them, so practice using them fast."
    ],
    checkpoints:[
      "A log entry for each scenario (taints/tolerations, requests/limits, PV/PVC/StorageClass, RBAC for a ServiceAccount, NetworkPolicy, Helm) with the time taken and what you missed.",
      "etcd snapshot save then restore completed; a kubeadm upgrade plan/apply done on a control plane; a worker drained, upgraded and uncordoned; certificate expiry checked with kubeadm certs check-expiration.",
      "Each broken-cluster task fixed and timed: a stopped kubelet restarted, a bad static Pod manifest corrected, a Service given endpoints, a CoreDNS failure resolved.",
      "The exam shell is configured (alias, do, bash completion) and the five slowest tasks are each redone until under five minutes."
    ],
    hints:[
      "Speed comes from generating YAML, not writing it: k create ... $do > pod.yaml, then edit. Learn to jump to the right docs page in seconds.",
      "For a broken cluster, check in order: kubectl get nodes, then on the node journalctl -u kubelet, then the static Pod manifests in /etc/kubernetes/manifests, then the API server and CoreDNS pods. A fixed order is faster than guessing.",
      "A Service with no endpoints almost always means the selector does not match pod labels; kubectl get endpointslices is the fastest confirmation."
    ],
    trouble:[
      ["kubelet will not start","A bad flag, a missing config file, or a full disk","journalctl -u kubelet -n 50 names the cause; fix the config and systemctl restart kubelet."],
      ["A static Pod never appears","The manifest in /etc/kubernetes/manifests has a YAML or image error","The kubelet logs the parse or pull error; correct the file and it is picked up automatically."],
      ["etcd restore leaves the API server down","The restore wrote to a new data dir the manifest does not point at","Update the etcd static Pod manifest's data dir to the restored path and wait for it to restart."],
      ["CoreDNS is CrashLoopBackOff","A bad Corefile or a missing upstream","kubectl logs the CoreDNS pod; fix the ConfigMap and let it reload."],
      ["Tasks run out of time","Writing YAML by hand and not using docs","Use $do to scaffold, copy from docs, and practice the five slowest until they are muscle memory."]
    ],
    challenge:"Build your own broken-cluster scenario: on a kind or kubeadm cluster you control, deliberately break three things (stop the kubelet, corrupt a static Pod manifest, point a Service selector at nothing), hand it to yourself a day later with no notes, and time how long diagnosis takes. Refine your playbook so the next person could fix it faster than you did.",
    reflect:[
      "What is your fixed diagnostic order for an unreachable cluster, and why does order beat intuition under time pressure?",
      "Which task type cost you the most time, and what specific habit or alias cut it down?",
      "Why does the exam allow the docs, and how does that change what you should memorize versus look up?"
    ]
  },
  "p19lab6":{
    time:"3–4 h",
    setup:[
      "Docker and docker compose installed; the Flask app from Lab 1 with the prometheus_client library added.",
      "Compose images for prometheus, node_exporter (or windows_exporter), alertmanager and grafana, all official.",
      "A Slack incoming webhook or an SMTP endpoint for the Alertmanager receiver; a test channel or inbox is fine.",
      "A load tool such as hey or a short Python loop to drive traffic and trigger errors via a feature flag in the app."
    ],
    checkpoints:[
      "compose up brings all services up; Prometheus Targets page shows prometheus, node_exporter and the Flask app all UP; the app exposes /metrics with a request counter and a latency histogram.",
      "A Grafana dashboard shows request rate, error ratio and P99 latency from PromQL, plus node CPU and memory panels.",
      "Recording rules compute the error ratio; alerting rules for 14.4x (1h and 5m) and 6x (6h and 30m) burn rates exist and route through Alertmanager to your receiver.",
      "Under injected 5xx load the burn-rate alert fires in Slack or email, and after rollback it resolves; a one-page blameless postmortem is written."
    ],
    hints:[
      "Instrument the app first: a Counter for requests by status and a Histogram for latency give you everything the dashboards and the SLO need. Expose them on /metrics.",
      "The error ratio is rate(errors[window]) / rate(total[window]). A burn rate of 14.4 over one hour means you are spending the monthly error budget 14.4x too fast; that is the signal to page.",
      "Use multi-window multi-burn-rate alerts: the fast pair (1h and 5m at 14.4x) catches sudden outages, the slow pair (6h and 30m at 6x) catches slow burns, and both reduce false pages."
    ],
    trouble:[
      ["A target shows DOWN in Prometheus","The scrape address is wrong, or the app is not on the Compose network","Check prometheus.yml targets use the service name and port; curl the /metrics endpoint from the Prometheus container."],
      ["Grafana panels are empty","Wrong data source, or the PromQL metric name does not match what the app exposes","Open Explore in Grafana and run the raw query; fix the metric name or labels."],
      ["The alert never fires","The rule's for: duration is too long for the test, or the expression is wrong","Test the expression in Prometheus first; shorten for: during the test to see it fire quickly."],
      ["Alertmanager receives but does not notify","The route or receiver config is wrong, or the webhook URL is bad","Check Alertmanager's Status page and logs; test the Slack webhook with curl."],
      ["Burn-rate math looks wrong","The window or the budget base is mismatched","Confirm the SLO target (99.9%) sets the budget, and that windows in the rule match the burn-rate pair."]
    ],
    challenge:"Add distributed tracing: instrument the app with OpenTelemetry, run a collector and Tempo (or Jaeger) in the same Compose stack, and correlate a spike in P99 latency on the dashboard with a slow span in a trace. Then tighten the SLO to 99.95% and show how the error budget and the burn-rate thresholds change.",
    reflect:[
      "Why do multi-window burn-rate alerts page less often than a simple threshold on error rate, yet still catch real outages?",
      "What does an error budget let a team decide that an uptime percentage alone does not?",
      "In your postmortem, what made the writeup blameless, and why does that produce better fixes?"
    ]
  }
});
/* ---------- p20 Software Engineering Practice ---------- */
Object.assign(window.LABX,{
  "p20lab1":{
    time:"3–4 h",
    setup:[
      "Git and a GitHub account. Generate an SSH key for commit signing (ssh-keygen -t ed25519) and add it to GitHub under Signing keys.",
      "Python 3.12+ and pytest installed; a small fiber loss-budget script to be the repo's subject.",
      "Configure signing: git config gpg.format ssh, git config user.signingkey <path>, git config commit.gpgsign true.",
      "A public GitHub repo you will create for this lab; branch protection rulesets are free on public repos."
    ],
    checkpoints:[
      "The repo has README, LICENSE, a Python .gitignore and CONTRIBUTING; a test commit shows the Verified badge on GitHub.",
      "Three issues exist (bug, feature, docs); each has a branch, small signed commits, and a PR whose body says 'Closes #N'; each PR has at least two of your own line comments before a squash merge.",
      "A ruleset on main blocks direct pushes, requires one approval or the 'test' status check, requires signed commits and linear history.",
      "ci.yml runs on push and pull_request with permissions contents: read, pinned checkout and setup-python, pytest with coverage, failing under 85%; you made a PR fail then fixed it to green."
    ],
    hints:[
      "Keep commits small and each tied to one change, so the PR review and the squash message tell a clean story. Sign from the first commit so the Verified badge is never missing.",
      "'Closes #N' in the PR body (not just the title) is what auto-closes the issue on merge. The required status check name must exactly match the job name in your workflow.",
      "For coverage gating, run pytest --cov and add --cov-fail-under=85 so CI fails below the line; pin actions to full commit SHAs as in the DevOps phase."
    ],
    trouble:[
      ["Commits show 'Unverified'","The signing key is not added to GitHub, or the wrong key format is configured","Confirm gpg.format ssh and that the public key is under GitHub Signing keys; recommit."],
      ["The required check never turns green","The check name in the ruleset does not match the workflow job name","Copy the exact job name into the required status check; re-run the PR."],
      ["Cannot push to main","The ruleset correctly blocks direct pushes","Open a branch and a PR; that is the intended workflow."],
      ["The issue did not close on merge","'Closes #N' was only in the title, or the PR targeted the wrong branch","Put the keyword in the PR body and target main; closing keywords are case-insensitive but need the # and number."],
      ["Coverage passes locally but CI differs","Different Python version or missing test dependency in CI","Match the CI Python version and install test extras in the workflow."]
    ],
    challenge:"Add a CODEOWNERS file and a second required reviewer rule, then simulate a real review: open a PR that intentionally drops coverage below 85% and watch CI block the merge, fix it, and record the full timeline. Add a release workflow that tags a version and attaches the built artifact when you push a tag, and cut v0.1.0.",
    reflect:[
      "What does commit signing actually prove, and what does it not protect against?",
      "Why gate merges on a status check and a review rather than trusting discipline, even on a solo repo?",
      "How does squash-merging change the history you keep, and when would you prefer merge commits?"
    ]
  },
  "p20lab2":{
    time:"3–4 h",
    setup:[
      "Python 3.12+ with pytest, pytest-cov, hypothesis and mutmut installed in a virtual environment.",
      "A module exposing budget(km, splices, connectors) to test; implement a simple version if you do not have one.",
      "A worksheet (paper or text file) for the test-design artifacts: equivalence partitions, boundary values and the decision table.",
      "A terminal for pytest and mutmut; mutmut needs the tests to pass before it runs."
    ],
    checkpoints:[
      "The worksheet lists equivalence partitions, 3-value boundary values for each range (0-120 km, 0-48 splices, 0-8 connectors), and a decision table for the splices > 24 sign-off rule.",
      "The pytest file uses a fixture for the baseline link and parametrize for every boundary value, with pytest.raises cases for each invalid partition.",
      "A Hypothesis property test asserts in-range inputs give a non-negative dB value that increases with km; a mock test asserts the report emailer is called once with the right subject and no email is sent.",
      "pytest --cov --cov-branch reaches 100% branch coverage on the module; mutmut reports a surviving-mutant count before and after you add tests to kill them."
    ],
    hints:[
      "Equivalence partitioning picks one representative per class; boundary values test the edges (min-1, min, min+1 and the same at max), because that is where off-by-one bugs live.",
      "A decision table enumerates the combinations of conditions and their outcomes; the splices > 24 rule is one condition with a clear boundary at 24 and 25.",
      "Branch coverage is stricter than line coverage: it requires both sides of each if. Mutation testing then checks whether your assertions would actually catch a changed operator; a surviving mutant is a test gap."
    ],
    trouble:[
      ["parametrize cases all share state unexpectedly","A mutable default or a shared fixture object","Make the fixture return a fresh object each time (function scope) and avoid mutable defaults."],
      ["Hypothesis finds a failing example","Either a real bug or an over-broad property","Read the minimal counterexample it prints; decide if the code or the property is wrong, and constrain the strategy if needed."],
      ["The mock test actually sends email","You patched the wrong name or the real function is imported directly","Patch where the function is used, not where it is defined; assert_called_once_with the subject."],
      ["Coverage sticks below 100%","An unreachable branch or an untested exception path","Read --cov-report=term-missing to see the exact lines; add a test or remove dead code."],
      ["mutmut reports everything survived","It ran against code your tests do not import, or tests did not pass first","Ensure pytest is green, point mutmut at the module, and re-run."]
    ],
    challenge:"Extend budget to a wavelength and fiber-type parameter and redo the test design: new partitions, new boundaries, and a decision table that now has two conditions. Reach 100% branch coverage again, then run mutmut and drive the mutation score to zero survivors, writing down which mutant each new test killed and why that mutant was dangerous.",
    reflect:[
      "Why do boundary values catch more bugs per test than random in-range values?",
      "What does a surviving mutant tell you that a green coverage report does not?",
      "When is a property-based test the right tool, and what kind of bug does it find that example tests miss?"
    ]
  },
  "p20lab3":{
    time:"3–4 h",
    setup:[
      "Python 3.12+ with pytest, ruff and mypy in a virtual environment; a Git repo so each refactoring is its own commit.",
      "A real messy script of yours (100-200 lines) or the tangled example from the module.",
      "Characterization-test knowledge: you will snapshot current behavior before changing anything.",
      "The in-app ADA reviewer for the final diff using Conventional Comments."
    ],
    checkpoints:[
      "Characterization tests capture the script's current output on three inputs and pass against the unchanged code.",
      "At least ten named refactorings are committed one per commit, with the refactoring named in each message, and tests stay green after each.",
      "One Strategy, one Factory and one Decorator are introduced where they cure a real pain, each with a one-sentence justification.",
      "ruff and mypy report clean; ADA's review thread exists with Conventional Comments and your response to every comment."
    ],
    hints:[
      "Characterization tests pin current behavior (even if buggy) so refactoring cannot change it unnoticed. Snapshot the exact output first.",
      "Refactor in tiny steps and run tests after each: Extract Function, Rename, Introduce Parameter Object, Replace Magic Literal with a named constant. The discipline is the lesson, not the cleverness.",
      "Reach for a pattern only where it removes real pain: Strategy for an injected exporter/sender, Factory to pick a parser by file type, Decorator for @retry or @lru_cache. Forcing a pattern where it is not needed is the anti-lesson."
    ],
    trouble:[
      ["A refactoring changes the output","The step was too big or altered behavior, not just structure","Revert to the last green commit and take a smaller step; refactoring must preserve behavior."],
      ["mypy flags errors after extracting functions","Missing or wrong type hints on the new boundaries","Add precise type hints at the new function signatures; let mypy guide the contracts."],
      ["ruff complains about imports or unused names","Dead code revealed by the refactor","Remove the unused code; that cleanup is part of the win."],
      ["The Strategy injection makes tests harder","You coupled construction to logic","Inject the dependency through a parameter so tests can pass a fake; that is the point of Strategy."],
      ["@lru_cache gives stale results","The cached function has side effects or mutable arguments","Cache only pure functions of hashable args; move side effects out."]
    ],
    challenge:"After the refactor, add a new requirement that the old tangle would have made painful (a new export format, or a new parser), and show it now takes one small class and no change to existing code. Measure the change: lines touched, cyclomatic complexity before and after (radon), and whether coverage held. Write a paragraph on which refactoring unlocked the easy extension.",
    reflect:[
      "Why do characterization tests have to come before the first refactoring, not after?",
      "For one pattern you introduced, what pain did it remove, and what would be the cost of adding it where there was no pain?",
      "How did small-step refactoring with tests change your confidence compared with a big rewrite?"
    ]
  },
  "p20lab4":{
    time:"3–4 h",
    setup:[
      "Python 3.12+ with FastAPI, uvicorn, pytest and httpx; a JWT library such as PyJWT.",
      "Spectral for linting the OpenAPI file (stoplight.io/open-source/spectral), installable via npm.",
      "A local JWT issuer you generate (a small script that signs tokens with a key you hold) so you control exp and aud.",
      "A Git repo; the openapi.yaml is written by hand first, then compared with the generated one."
    ],
    checkpoints:[
      "openapi.yaml defines /v1/links with cursor pagination, create, get, update, delete, a Link schema, Problem Details errors, a bearer securityScheme and a 429 response; Spectral lints it clean.",
      "The FastAPI service returns correct codes: 201 with a Location header, 204 on delete, 404, 422; GET supports ETag/If-None-Match; POST honors an Idempotency-Key; a token-bucket limiter returns 429 with Retry-After.",
      "JWT validation pins the algorithm list and checks aud and exp; tests cover expired, wrong-audience and tampered tokens and all are rejected.",
      "The generated /openapi.json is compared with the hand-written file, differences are reconciled, and the /docs page is published."
    ],
    hints:[
      "Design-first means the YAML is the contract and the code conforms to it. Lint the YAML before writing a line of FastAPI.",
      "Return 201 with a Location header pointing at the new resource, 204 with no body on delete, 422 for validation errors. Problem Details (RFC 9457) gives errors a consistent JSON shape.",
      "Pin the JWT algorithm explicitly (algorithms=['RS256']) so a token claiming alg:none or HS256 is rejected; always verify aud and exp. An Idempotency-Key store maps a key to the first response so retries do not double-create."
    ],
    trouble:[
      ["Spectral reports errors on the spec","Missing required fields, bad refs or an invalid response object","Read each rule Spectral names; fix the referenced path in the YAML."],
      ["The 422 body is not Problem Details","FastAPI's default validation error shape differs","Add an exception handler that reshapes validation errors into the Problem Details format."],
      ["JWT validation accepts a tampered token","The signature is not verified or the algorithm is not pinned","Never use verify_signature=False; pass the key and a fixed algorithms list, and test a tampered token."],
      ["Idempotency-Key does nothing","The key is not stored or not checked before creating","Store the key with the first response and short-circuit on a repeat within the window."],
      ["The generated and hand-written specs diverge","Code-first inference differs from your design in field names or codes","Reconcile deliberately; decide which is the source of truth and align the other."]
    ],
    challenge:"Add conditional requests end to end: support If-Match on PUT so a stale client update is rejected with 412, and prove it with a test that reads an ETag, lets another request change the resource, then tries the stale update. Then add a contract test that loads openapi.yaml and asserts the running service matches it, so drift fails CI.",
    reflect:[
      "Where did design-first and code-first disagree, and which should win when they do?",
      "Why pin the JWT algorithm list, and what attack does an unpinned validator enable?",
      "What does an Idempotency-Key protect against, and why is it safer than telling clients 'do not retry'?"
    ]
  },
  "p20lab5":{
    time:"3–4 h",
    setup:[
      "A text editor and a diagram tool (diagrams.net or Mermaid) for the one high-level diagram.",
      "The Module 5 design format in front of you: requirements, estimates, API, data model, diagram, two deep dives, bottlenecks.",
      "A calculator or a notebook for the back-of-envelope arithmetic (QPS, storage, bandwidth, availability).",
      "The in-app ADA reviewer to run the mock interview and pose follow-up challenges."
    ],
    checkpoints:[
      "One system is chosen (rate-limited notification service, expiring-link file sharing, or a 10,000-device telemetry pipeline) with requirements clarified in writing.",
      "The estimates section shows the arithmetic for QPS, storage, bandwidth and availability, not just final numbers.",
      "The document states where the design is CP or AP during a partition, which operations are idempotent and how, and the cache hit ratio needed to meet the latency target.",
      "ADA has posed three follow-up challenges, you have answered them, and the document is revised; final length is 2-3 pages with the diagram."
    ],
    hints:[
      "Start by clarifying scope and constraints; an interviewer rewards the questions you ask before drawing. Write the assumptions down.",
      "Show the arithmetic: peak QPS = daily requests / 86400 x a peak factor; storage = rows x bytes x retention; bandwidth = QPS x payload. Round and state your assumptions.",
      "Name the CAP choice explicitly per operation: a notification dedup store might be CP, while a read replica serving history is AP. Tie the cache hit ratio to the latency budget with a sentence of math."
    ],
    trouble:[
      ["The design sprawls and loses focus","No prioritized requirements, so everything feels equally important","List functional and non-functional requirements and rank them; design to the top three."],
      ["Estimates are hand-wavy","Numbers stated without the calculation","Show each formula and its inputs; an interviewer trusts arithmetic they can follow."],
      ["The CP/AP answer is vague","Treating the whole system as one consistency model","Decide per data path; say what a client sees during a partition on each."],
      ["Deep dives stay shallow","Describing components instead of mechanisms","Pick two hard parts (idempotent delivery, link expiry) and explain how, with data structures and failure handling."],
      ["ADA's challenges expose a gap","A missed bottleneck or an unstated assumption","Revise the document rather than defending it; capturing the fix is the point."]
    ],
    challenge:"Take the same system and redesign it for 100x the load, then write a one-page diff: which components change, which stay, where a new bottleneck appears, and what it costs. Then pick the single riskiest assumption in your estimates and describe the experiment or metric you would use to validate it before building.",
    reflect:[
      "Which non-functional requirement drove the most of your design, and why?",
      "For one operation, what exactly does a client experience during a network partition, and why did you choose CP or AP there?",
      "What did ADA's hardest challenge reveal about a blind spot in your first draft?"
    ]
  }
});
/* ---------- p21 Blue Team: SOC, IR & Forensics ---------- */
Object.assign(window.LABX,{
  "p21lab1":{
    time:"two sessions of 2–3 h",
    setup:[
      "A VM you own with 8 GB RAM for Splunk; Splunk Enterprise from splunk.com (the 60-day trial converts to the 500 MB/day Free license). Take a snapshot after install.",
      "The BOTSv1 dataset and question set from github.com/splunk/botsv1, installed as an app so index=botsv1 is searchable.",
      "A browser and a notes file for your answer sheet (SPL, time range, screenshot per answer).",
      "Basic SPL from the module; keep the Splunk search reference open."
    ],
    checkpoints:[
      "index=botsv1 returns events; a search over sourcetypes shows Suricata, IIS and Sysmon data present.",
      "For the web-defacement scenario you have the scanner's source IP (from stats count by src), the brute-force pattern (a timechart of login failures then the first success) and the uploaded file's name.",
      "For the ransomware scenario you have the first process and the DNS query (Sysmon Event 1 and 22) and the parent process that launched it.",
      "Every answer is saved with its SPL, the exact time range and a screenshot; you can name the search commands used (stats, timechart, rex, table, dedup, lookup).",
      "Five detection ideas are written, each naming the data source and the specific Sysmon or Windows event it depends on."
    ],
    hints:[
      "Start broad, then narrow: get the sourcetypes, then pivot on one indicator (an IP, a host, a user) and let the data lead. Note the time window of the incident early.",
      "stats count by src ranks talkers; timechart span=1m count by status buckets login outcomes over time; rex extracts a field from raw text when there is no parsed field.",
      "Join the story with Sysmon: Event 1 is process creation (ParentImage links child to parent), Event 22 is a DNS query. Pivot on ProcessGuid to connect a process to its network and DNS activity."
    ],
    trouble:[
      ["index=botsv1 returns nothing","The app or index was not installed, or the time picker is set to the last 24 hours","Set the time range to All time (the data is from the incident date), and confirm the index exists under Settings > Indexes."],
      ["A search is extremely slow","Searching raw text over all time with no index or sourcetype filter","Always start with index=botsv1 and a sourcetype; add a time range; use stats instead of returning every event."],
      ["A field you expect is not there","That sourcetype does not parse it, or the field name differs","Click a field in the events list to see what is extracted, or use rex to pull it from _raw."],
      ["The Free license warning appears","You exceeded 500 MB/day of indexing","The BOTS data is already indexed; you are only searching, so no new volume. Avoid re-ingesting it."],
      ["Counts do not match the question's expected answer","Wrong time window or a duplicate-inflating join","Dedup where appropriate and confirm the window matches the incident; verify with a second search shape."]
    ],
    challenge:"Turn one investigation into a saved detection: write the SPL as a scheduled search that would have alerted on the brute-force-then-success pattern in near real time, with a threshold and a time window you justify. Then measure its noise by running it across the whole dataset and counting how often it would have fired, and tune it down to the real incident.",
    reflect:[
      "Why does starting with the sourcetypes and a time window beat jumping straight to a keyword search?",
      "Which single data source carried the most of your investigation, and what would you have missed without it?",
      "For one detection idea, what legitimate activity could trigger it, and how would you reduce that noise?"
    ],
    safety:"Use only the provided public dataset on a VM you own. Investigation here is reading logs, not touching any live system."
  },
  "p21lab2":{
    time:"two sessions of 2–3 h",
    setup:[
      "Free accounts on TryHackMe and LetsDefend; both run in the browser with no local setup.",
      "The TryHackMe SOC Level 1 path (SIEM, network security, endpoint rooms) and the LetsDefend SOC Analyst monitoring queue.",
      "A notes file in the Module 1 triage format, and a tally sheet for your precision and timing.",
      "A timer so each alert is worked under realistic time pressure."
    ],
    checkpoints:[
      "The TryHackMe SOC Level 1 SIEM, network and endpoint sections (Splunk, Snort/Zeek/Wireshark, Sysmon rooms) are complete, and at least ten LetsDefend alerts are worked.",
      "For every alert there is a one-paragraph triage note written before looking at the platform's answer: what fired, asset, identity, time, true or false positive, scope, next action.",
      "Each true positive has a Module 3 severity level and the containment you would request.",
      "A tally shows your analyst precision (correct true-positive calls) and median minutes per alert.",
      "Two wrong alerts have post-mortems naming the evidence that would have changed your call."
    ],
    hints:[
      "Decide before you peek. Writing the triage note first is what builds the reflex; the platform's answer is the grader, not the crutch.",
      "Use a fixed template so nothing is skipped: fired / asset / identity / time / verdict / scope / next action. Speed comes from the template, not from rushing.",
      "Precision here means the share of your 'true positive' calls that were actually true. Track it so you can see whether you are over- or under-calling, which is the habit a SOC lead watches for."
    ],
    trouble:[
      ["Every alert feels like a true positive","Over-calling because benign patterns are not yet familiar","Build a short list of known-benign behaviors you have seen; compare each alert to it before calling."],
      ["Triage takes far too long","Reading everything instead of the few fields that decide","Anchor on the one indicator that confirms or refutes first (the process, the IP, the user), then expand only if needed."],
      ["You disagree with the platform's answer","Either a genuine judgment call or a missed piece of evidence","Re-read the alert for the evidence the answer cites; if it is a judgment call, record your reasoning in the post-mortem."],
      ["LetsDefend sandbox or links will not load","Browser or extension blocking, or the free tier queue is slow","Disable blockers for the site; some content is gated to paid tiers, so pick the free monitoring alerts."],
      ["Severity feels arbitrary","No consistent criteria applied","Use the Module 3 definitions (impact x scope) the same way every time so your levels are comparable."]
    ],
    challenge:"After ten alerts, write your own one-page triage playbook from the patterns you saw: the three questions that resolved the most alerts fastest, the top five benign look-alikes, and a decision tree for escalate-versus-close. Then work five more alerts using only the playbook and see whether your precision and median time improved.",
    reflect:[
      "What was the single most common reason you mis-called an alert, and what fixes it?",
      "Which evidence type (endpoint, network, identity) resolved the most alerts for you, and why?",
      "How would tracking precision change the way a SOC coaches a new analyst?"
    ]
  },
  "p21lab3":{
    time:"two sessions of 2–3 h",
    setup:[
      "An isolated analysis VM (REMnux is ideal; it ships Zeek and Wireshark) with no bridge to any network you care about; snapshot it before opening any sample.",
      "Volatility 3 (pip install volatility3) and a public Windows memory sample from the Volatility Foundation Memory Samples wiki or a MemLabs image (github.com/stuxnet999/MemLabs).",
      "A public exercise PCAP from malware-traffic-analysis.net or the Wireshark sample-captures wiki.",
      "A hashing tool (sha256sum) and a notes file in the Module 4 report structure. Look up hashes on VirusTotal by hash only; never upload a sample."
    ],
    checkpoints:[
      "The memory sample's SHA-256 is recorded before you open it; windows.info prints the OS build and confirms the profile.",
      "pstree, psscan, cmdline, netscan and malfind run; every process that fails the 'what wrong looks like' tests is listed with a justification.",
      "One suspicious region is dumped with windows.dumpfiles, hashed, and looked up on VirusTotal by hash (lookup only).",
      "zeek -r on the PCAP produces conn.log, dns.log, http.log and files.log; a key finding is confirmed with a Wireshark display filter and Follow TCP Stream.",
      "A two-part report (memory, network) records evidence hashes, tool versions, findings tied to artifacts, a timeline and limitations."
    ],
    hints:[
      "Hash before you touch. The SHA-256 recorded first is your proof the evidence did not change, which is the whole basis of a defensible finding.",
      "In memory, look for the mismatches: a process whose parent is wrong, a name that should not exist, network connections from something that should not talk, or injected code that malfind flags. Justify each against the baseline.",
      "In the PCAP, let Zeek summarize first (conn.log for who talked to whom, dns.log for lookups, http.log for requests, files.log for transferred files), then drop into Wireshark to confirm the one connection that matters with a filter and Follow TCP Stream."
    ],
    trouble:[
      ["Volatility errors with 'Unsatisfied requirement' or no profile","Wrong symbol table, or the image is from an unsupported build","Run windows.info first; Volatility 3 auto-detects symbols, but a mismatched or corrupt image will fail here, which tells you to re-download it."],
      ["netscan shows nothing","The plugin needs the right symbols, or the sample predates the connections","Confirm windows.info succeeded; try windows.netstat as an alternative view."],
      ["malfind floods with false positives","Normal processes have RWX regions too","Correlate with pstree and cmdline; a flagged region in a process with a suspicious parent matters more than one in a known service."],
      ["zeek -r produces no logs","Zeek is not installed or the PCAP path is wrong","Confirm which zeek and run in a writable directory; logs are written to the current folder."],
      ["Wireshark cannot follow a stream","You filtered on the wrong conversation","Use conn.log to get the exact IPs and ports, then filter ip.addr and tcp.port before Follow TCP Stream."]
    ],
    challenge:"Build a timeline that spans both evidence types: correlate a process start time from memory with a DNS lookup and an HTTP request time from the PCAP, and show they tell one story. Then write the one limitation that most weakens your conclusion (for example, no disk image to confirm persistence) and what evidence would remove it.",
    reflect:[
      "Why does recording the hash before analysis matter, and what claim does it let you defend later?",
      "What did memory show that the packet capture could not, and vice versa?",
      "For one flagged process, what made it suspicious, and what benign explanation did you have to rule out?"
    ],
    safety:"Only on systems you own, inside an isolated VM with no bridged network. Never upload samples to third parties; look up hashes only. Keep real malware away from any machine that matters."
  },
  "p21lab4":{
    time:"3–4 h",
    setup:[
      "A Windows VM with Sysmon and Splunk (from Lab 1) for validation, kept on the isolated lab network.",
      "sigma-cli (pip install sigma-cli) plus the Splunk backend plugin; a text editor for the YAML rules.",
      "YARA installed (yara binary) and a benign test file you create with unique strings.",
      "Atomic Red Team (github.com/redcanaryco/atomic-red-team) for validating the Sigma rule in your own lab only."
    ],
    checkpoints:[
      "A Sigma rule exists with id, logsource, detection, condition, falsepositives, level and ATT&CK tags for a behavior you observed earlier.",
      "sigma convert -t splunk -p splunk_windows produces SPL; running it against index=botsv1 (or your lab index) returns a hit count.",
      "After adding a filter for a legitimate hit, precision before and after is recorded.",
      "A YARA rule for your benign test file (unique strings, a size limit, the MZ check for an executable) runs with yara -r against a system directory and reports zero false positives; a deliberately loose version shows the hit count exploding.",
      "An Atomic Red Team test matching the behavior runs on your Windows VM, Sysmon records it, and the Sigma-derived search fires in Splunk."
    ],
    hints:[
      "Write the detection as a behavior, not a single indicator: 'Office spawns a script interpreter' survives renames and new payloads, where a file hash does not.",
      "falsepositives and level are not optional fluff; they tell the analyst what benign activity to expect and how urgently to respond. Fill them honestly.",
      "Tune by subtraction: run the rule, find the benign hits, add a filter clause for exactly those, and re-measure precision. The YARA size limit and MZ check exist to stop the rule matching half the disk."
    ],
    trouble:[
      ["sigma convert errors on the rule","A field name or logsource that the pipeline does not map","Check the rule against the Sigma spec and the pipeline's field mappings; fix the logsource product/service."],
      ["The converted SPL returns zero hits","Field names in your index differ from the pipeline's assumptions","Inspect the actual field names in Splunk and adjust the Sigma detection fields or the pipeline."],
      ["YARA matches far too much","Strings are too common or there is no size/type guard","Add a filesize limit and the uint16(0) == 0x5A4D MZ check; make strings unique to your test file."],
      ["The Atomic test does not fire the rule","Sysmon is not configured to log that event, or the rule condition is too narrow","Confirm Sysmon logs the relevant event ID; loosen the condition until it matches, then re-tighten with a filter."],
      ["Precision does not improve after tuning","The filter removed real hits too, or targeted the wrong field","Check what the filter excluded; it must remove only the benign pattern, not the true positive."]
    ],
    challenge:"Write a second Sigma rule for a related but distinct behavior and show how a shared false-positive filter can be factored out, then convert both to a second backend (for example the Elastic query language) and confirm the logic survives translation. Measure how the Atomic test's artifacts differ from a real-world variant and note what your rule would miss.",
    reflect:[
      "Why is a behavior-based detection more durable than an indicator-based one, and what does it cost in false positives?",
      "What did tuning teach you about the trade-off between catching everything and paging the analyst too often?",
      "How did validating with an Atomic test change your confidence versus just reading the rule?"
    ],
    safety:"Security tooling: run Atomic Red Team tests and YARA scans only on systems you own, inside the isolated lab. The test file and test technique must be benign and must not leave the lab."
  },
  "p21lab5":{
    time:"3–4 h",
    setup:[
      "The in-app ADA to facilitate the tabletop; a company profile you write (size, systems, data, backup posture).",
      "The FIRST CVSS v3.1 calculator (first.org/cvss/calculator), CISA KEV catalog (cisa.gov/kev) and EPSS (first.org/epss) open in tabs.",
      "Five real CVSS v3.1 vectors to score (pick recent CVEs), and a worksheet for ISS, Impact, Exploitability and Roundup by hand.",
      "A spreadsheet or table for the ten-row risk register and the SLE/ARO/ALE arithmetic."
    ],
    checkpoints:[
      "ADA ran the ransomware tabletop with injects; your decisions as incident commander (containment, evidence, notifications and deadlines, pay-or-not) are recorded.",
      "Five vulnerabilities are scored by hand (ISS, Impact, Exploitability, Roundup) and checked against the FIRST calculator, with the arithmetic slips noted.",
      "Each of the five is looked up in KEV and EPSS and re-ordered by KEV, EPSS and exposure, with one sentence per vulnerability justifying its SLA class.",
      "A ten-row risk register has inherent and residual scores, treatments, owners and review dates; two rows are quantified with SLE, ARO and ALE and one control purchase is justified.",
      "An after-action report (timeline, decisions, gaps, five action items with owners) and a one-page executive vulnerability summary are written."
    ],
    hints:[
      "In the tabletop, state decisions with their deadlines and who you would notify; the exercise tests decision-making under incomplete information, not perfect answers.",
      "CVSS base score math: compute the Impact Sub-Score from C/I/A, the Exploitability from vector/complexity/privileges/interaction, combine (with the scope rule), then round up to one decimal. Doing it by hand reveals where the calculator's result comes from.",
      "KEV means known-exploited (treat as urgent regardless of score); EPSS is the probability of exploitation in the next 30 days. Prioritize by KEV first, then EPSS and exposure, not by CVSS alone."
    ],
    trouble:[
      ["Your CVSS score differs from the calculator","A rounding step or the scope-changed formula was applied wrong","Redo the Impact and Exploitability sub-scores separately; the scope flag changes the combining formula and the roundup is to one decimal."],
      ["The prioritization feels like CVSS again","KEV and EPSS were not actually used to reorder","Put KEV items at the top regardless of score, then sort the rest by EPSS and exposure; justify each move."],
      ["ALE numbers look arbitrary","SLE or ARO were guessed without basis","SLE = asset value x exposure factor; ALE = SLE x ARO. State the assumptions for each; the arithmetic must be followable."],
      ["The risk register mixes risks and controls","Rows describe fixes instead of risks","Each row is a risk (threat x asset x impact); treatments are a separate column."],
      ["The executive summary is too technical","Written for engineers, not decision-makers","Lead with business impact and the decision you want; put CVSS detail in an appendix."]
    ],
    challenge:"Re-run the tabletop with one variable changed (backups are compromised too, or the breach is public before you are ready) and show how your containment and notification decisions shift. Then compute the ALE before and after your recommended control for the two quantified rows, and state the break-even point at which the control stops being worth its cost.",
    reflect:[
      "Why does KEV outrank a high CVSS score for prioritization, and what would you tell a manager who only looks at CVSS?",
      "Which tabletop decision was hardest with incomplete information, and what would have made it easier?",
      "What does quantifying a risk with ALE let you justify that a red/amber/green rating cannot?"
    ]
  }
});
/* ---------- p22 Data Analytics & Data Science ---------- */
Object.assign(window.LABX,{
  "p22lab1":{
    time:"3–4 h",
    setup:[
      "Python 3.12+ with a virtual environment and pinned pandas 3.x, numpy, matplotlib, seaborn and jupyterlab (pip install into the venv).",
      "The Kaggle Titanic train.csv and the UCI Adult dataset downloaded into data/raw, which you keep read-only.",
      "JupyterLab running; a project folder under version control so the notebook and cleaning log are tracked.",
      "Know the goal of reproducibility: 'Restart kernel and run all' must succeed from a clean state."
    ],
    checkpoints:[
      "The venv has the pinned versions (pip freeze shows them); both CSVs are in data/raw and untouched.",
      "For each dataset: shape, info(), describe(), isna().sum() and value_counts() on every categorical are run, with a one-line data-quality note per column.",
      "The cleaning log records each change: types parsed, '?' marked missing, category dtype added, Tukey fences applied to one numeric column with the flagged rows investigated (not deleted).",
      "Titanic survival rates by Sex, Pclass and their pivot are computed; Adult income rate by education and the sex crosstab are computed; a wide table is reshaped with melt and back with pivot_table.",
      "A 150-word findings paragraph states denominators and the missing-data caveat; Restart-and-run-all passes end to end."
    ],
    hints:[
      "Profile before you clean: you cannot fix what you have not measured. isna().sum() and value_counts() tell you where the problems are.",
      "Tukey fences are Q1 - 1.5*IQR and Q3 + 1.5*IQR; flag rows outside them and look at them before deciding, because an outlier is often a data-entry error or the most interesting case.",
      "Reproducibility means no hidden state: read raw data read-only, do every transform in the notebook, and never rely on a cell you ran out of order. melt goes wide-to-long; pivot_table goes long-to-wide."
    ],
    trouble:[
      ["Restart-and-run-all fails though cells worked before","Out-of-order execution left hidden state","Run top to bottom from a fresh kernel; remove any cell that depends on a later one."],
      ["value_counts misses the missing values","NaN is excluded by default","Pass dropna=False to see how many are missing in each category."],
      ["'?' still counts as a category","It was never converted to NaN","Replace '?' with np.nan on read (na_values) or afterward, then re-profile."],
      ["Survival rates do not match known figures","Denominator includes rows you should have scoped out, or a groupby on the wrong column","State the denominator explicitly and check the group sizes; mean of a 0/1 column is the rate."],
      ["pivot_table throws on duplicate index/column pairs","Multiple rows map to one cell with no aggregation","Pass an aggfunc so duplicates are combined deliberately."]
    ],
    challenge:"Add a reusable profiling function that takes any DataFrame and prints the shape, dtypes, missing counts and top categories, then run it on a third public dataset you pick and write its data-quality notes in half the time. Parameterize the notebook with papermill or a config cell so the same analysis runs on a different input without edits.",
    reflect:[
      "Why investigate outliers instead of deleting them, and what would deleting them hide?",
      "What does stating the denominator protect a reader from when you report a rate?",
      "Why is 'restart and run all' the real test of a notebook, and what kind of bug does it catch?"
    ]
  },
  "p22lab2":{
    time:"3–4 h",
    setup:[
      "Power BI Desktop (free, Windows only) from the Microsoft Store or powerbi.microsoft.com; a Windows machine or VM.",
      "The Adult CSV (or your own exported installs data) and a generated date table.",
      "pandas from Lab 1 available to cross-check one measure.",
      "The PL-300 modeling concepts in mind: star schema, single-direction relationships, DAX measures, row-level security."
    ],
    checkpoints:[
      "Power Query has typed columns, '?' replaced with null, profiled columns and one unpivoted wide table; the data loads.",
      "The model is a star: a fact table plus at least two dimensions and the date table, one-to-many single-cross-filter relationships, with the date table marked.",
      "Five measures exist (a count, a rate with DIVIDE, a time-intelligence YTD or period-over-period, an average, a CALCULATE with a filter) and one matches the same number computed in pandas.",
      "A one-page report has a KPI card, a sorted bar, a line with a reference line, a matrix and a slicer, with a colorblind-safe theme and alt text, checked in Performance Analyzer.",
      "A row-level-security role filters one dimension and 'View as' proves it; the page exports to PDF."
    ],
    hints:[
      "Model as a star, not a snowflake of joined tables: one fact surrounded by dimensions, with single-direction relationships, is what makes DAX and filters behave.",
      "DIVIDE(numerator, denominator) returns blank instead of erroring on divide-by-zero, which is why it beats the / operator for a rate. Mark the date table so time-intelligence functions work.",
      "Cross-check one measure against pandas to trust your DAX: compute the same rate both ways and reconcile any difference, which is usually a filter-context surprise."
    ],
    trouble:[
      ["A measure returns blank or wrong totals","Filter context or a broken relationship","Check the relationship direction and cardinality; use CALCULATE to set the context explicitly."],
      ["Time intelligence (YTD) returns errors","The date table is not marked or has gaps","Generate a continuous date table and mark it as the date table in Model view."],
      ["Relationship cannot be created","Both columns are on the many side, or types differ","Ensure one side is unique (the dimension key) and the column types match."],
      ["RLS does not filter as expected","The role's DAX filter is on the wrong table or direction","Test with 'View as'; put the filter on the dimension and rely on the relationship to propagate."],
      ["The pandas and DAX numbers differ","Different filtering, or counting rows versus distinct values","Align the filter and the aggregation (count vs distinct count) on both sides."]
    ],
    challenge:"Add a what-if parameter (a slider) that lets the reader adjust a threshold and see a measure respond, then build a second report page as a drill-through target from the bar chart. Compare the Performance Analyzer timings before and after replacing a slow visual-level calculation with a measure, and write which change helped most.",
    reflect:[
      "Why does a star schema make measures and slicers behave predictably where a web of relationships does not?",
      "What is filter context in DAX, and how did it explain the difference you reconciled with pandas?",
      "Which accessibility choice (theme, alt text, sort order) most changed how readable your report is, and why?"
    ]
  },
  "p22lab3":{
    time:"3–4 h",
    setup:[
      "Python 3.12+ with numpy, scipy, matplotlib and seaborn in a virtual environment.",
      "A notebook or script file; set a random seed so results are reproducible.",
      "Know the two-proportion z-test from the module; scipy.stats has the pieces, or implement it directly.",
      "Enough patience for 10,000-iteration simulations; they run in seconds but think before you scale them up."
    ],
    checkpoints:[
      "10,000 A/A tests (both arms 10%, 1,000 users each) give a share with p < 0.05 of about 5%, confirming the false-positive rate of a single honest test.",
      "The peeking simulation (check p every 100 users per arm, stop at first p < 0.05) reports a false-positive rate well above 5%.",
      "The computed sample size to detect 10% to 11% at alpha 0.05, power 0.8 is stated, and 2,000 true A/B tests at that size confirm power near 80%.",
      "A seaborn histplot overlays the lift distributions for n=1,000 and n=14,700 per arm with the axis at zero.",
      "Five rules for running an A/B test are written, each justified by one specific simulation result."
    ],
    hints:[
      "An A/A test has no real difference, so any 'significant' result is a false positive. At alpha 0.05 you expect about 5%, and seeing that confirms your test is calibrated.",
      "Peeking inflates false positives because each look is another chance to cross the line; the more often you peek, the higher the rate climbs. That is the lesson the simulation makes visceral.",
      "Power is the probability of detecting a real effect of a given size. Use a sample-size formula (or statsmodels' power tools) for a two-proportion test, then verify by simulating at that n and counting detections."
    ],
    trouble:[
      ["The A/A false-positive rate is not near 5%","A bug in the test, or too few iterations","Check the z-test implementation against scipy; raise iterations to 10,000 for a stable estimate."],
      ["The peeking rate seems too low","You peeked too few times or stopped incorrectly","Peek every 100 users and stop at the first crossing; the more frequent the peeks, the higher the inflation."],
      ["Simulated power is far from 80%","The sample size or effect size does not match the formula's inputs","Recompute n with the exact alpha, power and baseline-to-target rates; verify units match."],
      ["Plots are misleading","The x-axis does not include zero, or bins hide the overlap","Set the axis to include zero and use enough bins to show both distributions honestly."],
      ["Results change every run","No fixed seed","Set np.random.seed once at the top for reproducibility."]
    ],
    challenge:"Implement a sequential test that controls the false-positive rate even while peeking (an alpha-spending function or a simple Bonferroni-style correction across looks), and show by simulation that it holds near 5% where naive peeking did not. Then quantify the cost: how many more users it needs to reach 80% power compared with a single fixed-n test.",
    reflect:[
      "Mechanically, why does peeking inflate the false-positive rate, and why does more peeking make it worse?",
      "What does statistical power buy you, and what is the cost of running underpowered tests?",
      "Which of your five rules would prevent the most real-world mistakes, and why?"
    ]
  },
  "p22lab4":{
    time:"3–4 h",
    setup:[
      "Python 3.12+ with scikit-learn, pandas, numpy and matplotlib in a virtual environment.",
      "The UCI Adult dataset from Lab 1, cleaned.",
      "A notebook and a fixed random_state for every split and model so results reproduce.",
      "The model-card format from the module in front of you."
    ],
    checkpoints:[
      "A stratified 80/20 split with a fixed random_state is done; a ColumnTransformer (impute+scale numeric, one-hot categorical) sits inside a Pipeline so no leakage occurs.",
      "5-fold cross-validated ROC AUC for logistic regression, random forest and HistGradientBoosting on the training set only is tabulated with mean and spread.",
      "The best model is tuned with RandomizedSearchCV on training folds; the test set is opened once and accuracy, precision, recall, F1, AUC and the confusion matrix are reported.",
      "Recall and precision by sex and by race on the test set are computed; ROC and precision-recall curves are plotted.",
      "A one-page model card records intended use, data provenance, overall and subgroup metrics, limitations, ethical notes, version and date."
    ],
    hints:[
      "Leakage is the silent killer: fit the scaler and encoder only on training data, which is why they live inside the Pipeline and are fit during cross-validation, not before the split.",
      "Tune on the training folds only and touch the test set exactly once, at the end; every peek at the test set during tuning leaks information and inflates your reported score.",
      "Subgroup metrics expose disparate error rates a single accuracy number hides. Compute recall and precision per group and put them in the card even when they are uncomfortable."
    ],
    trouble:[
      ["Test scores are suspiciously high","Data leakage from fitting transforms before the split, or a feature that encodes the target","Move all transforms inside the Pipeline; check for a column that is a proxy for the label."],
      ["One-hot encoding fails on unseen categories at test time","The encoder saw categories only in training","Set handle_unknown='ignore' on the OneHotEncoder."],
      ["Cross-validation and test AUC differ a lot","Overfitting during tuning, or a small or unrepresentative test set","Use the cross-validated estimate as the honest number; report the gap in the card."],
      ["Subgroup recall is unstable","Small group sizes","Report the group n alongside the metric; note the uncertainty in limitations."],
      ["RandomizedSearchCV is slow","Too wide a search or too many folds","Narrow the parameter distributions and use fewer iterations; it is a search, not an exhaustive grid."]
    ],
    challenge:"Add a calibration step: plot a reliability curve for the tuned model, apply Platt scaling or isotonic calibration, and show whether the predicted probabilities become more trustworthy. Then pick one subgroup disparity and test one mitigation (reweighting or a threshold per group), measuring what it fixes and what it costs overall.",
    reflect:[
      "Why must the test set be opened only once, and what exactly goes wrong if you tune against it?",
      "What does a subgroup recall gap mean for a person the model affects, and whose job is it to act on it?",
      "When is AUC the wrong headline metric, and what would you report instead for this problem?"
    ]
  },
  "p22lab5":{
    time:"3–4 h",
    setup:[
      "Python 3.12+ with pandas, pandera, pyarrow and a SQLite driver (built in) in a virtual environment.",
      "A SQLite database you create with an installs table (generate 50,000 rows with timestamps) and a crews table.",
      "cron available (Linux or WSL) for scheduling; a log file path the job can write.",
      "The in-app ADA to critique the executive report as a skeptical operations director."
    ],
    checkpoints:[
      "The SQLite database has 50,000 install rows and a crews table; extract.py reads by a watermark, validates with pandera (ranges, nulls, referential integrity, row-count band), writes Parquet partitioned by date, and does a delete-then-insert into a summary table.",
      "Running extract.py twice produces the same summary (idempotence proven by equal row counts and values).",
      "cron runs it (for example 0 2 * * *) and logs to a file; feeding an impossible loss value makes the run fail loudly with a pandera error in the log.",
      "A one-page executive report answers one question (such as rework rate by crew) with a magnitude-and-interval headline, three numbers with denominators, one honest chart, a recommendation, caveats and a next step.",
      "ADA has critiqued the report as a skeptical operations director and a revised version exists; both versions are kept."
    ],
    hints:[
      "Idempotence comes from the watermark plus delete-then-insert: re-running must not double-count. Test it by running twice and diffing the summary.",
      "pandera schemas fail loudly on bad data, which is what you want: a pipeline that silently passes garbage is worse than one that stops. Put ranges, nullability and a row-count band in the schema.",
      "The executive report leads with the number that matters and its uncertainty, then three supporting figures with denominators; the chart supports the headline rather than decorating it."
    ],
    trouble:[
      ["The second run doubles the summary rows","Insert without delete, or the watermark did not advance","Delete the target partition or key range before inserting, and persist the watermark."],
      ["pandera does not catch the bad value","The schema's range or check is too loose","Tighten the Check to the real physical bounds; add a row-count band so a truncated input also fails."],
      ["cron job does nothing","Wrong path, environment, or no execute context","cron has a minimal PATH; use absolute paths and the venv's python, and redirect output to the log."],
      ["Parquet files pile up","No partition overwrite strategy","Partition by date and overwrite the partition on re-run, or clean old partitions deliberately."],
      ["The report buries the finding","Leading with method instead of the answer","Put the headline number and interval first; move methodology to a footnote."]
    ],
    challenge:"Add data-quality metrics as a first-class output: have the pipeline write a small table of row counts, null rates and failed-check counts per run, then build a tiny trend of those over several runs so you can see quality drift. Schedule a second job that emails you (or writes a flag file) only when a quality metric crosses a threshold.",
    reflect:[
      "Why is a pipeline that fails loudly on bad data better than one that keeps running, and what does the operations team gain?",
      "What makes the delete-then-insert pattern idempotent, and when would it still double-count?",
      "Which of ADA's criticisms most improved the report, and what does that say about writing for a skeptical reader?"
    ]
  }
});
/* ---------- p23 Electronics & Embedded Systems ---------- */
Object.assign(window.LABX,{
  "p23lab1":{
    time:"two sessions of 2–3 h",
    setup:[
      "An Arduino UNO or an ESP32 dev board you own, a USB cable, and the Arduino IDE 2.x (arduino.cc) or PlatformIO. For ESP32 add the board URL in Preferences and install the ESP32 core.",
      "A starter kit: breadboard, jumper wires, LEDs, resistors (220-1k ohm), a push button, an LDR or TMP36, an SG90 servo, a DC motor with a TB6612FNG or L298N driver, and an SSD1306 I2C OLED.",
      "A digital multimeter for the current and voltage measurements, and a separate 5 V supply for the servo and motor (never from the board's regulator).",
      "The datasheet for your LED (forward voltage) so you can size the resistor properly."
    ],
    checkpoints:[
      "The built-in LED blinks, then an external LED lights through a resistor you sized; the measured current matches your (Vsupply - Vf)/R calculation within a few percent.",
      "The button with INPUT_PULLUP reads reliably after debouncing; the serial monitor at 115200 shows a clean press count with no bounce.",
      "The analog sensor prints ten averaged readings per second converted to volts and to units (lux or degrees C).",
      "The servo sweeps smoothly on its own 5 V supply with a common ground, and the DC motor changes speed and direction via PWM on the driver.",
      "An I2C scanner finds the OLED at 0x3C, and the display shows the live sensor value updating."
    ],
    hints:[
      "Build one stage at a time and keep each working before adding the next; a fault is far easier to find when only one thing changed.",
      "Size the LED resistor from Ohm's law: R = (Vsupply - Vf) / Idesired, picking I around 5-15 mA. The multimeter in series confirms the real current.",
      "A motor or servo pulls current spikes that crash a board sharing its supply; give them a separate supply with a common ground. Always run an I2C scanner before using any I2C device to confirm its address and wiring."
    ],
    trouble:[
      ["The board resets or browns out when the motor runs","The motor is drawing current through the board's regulator","Power the motor from a separate supply with a common ground; add a decoupling capacitor."],
      ["The button registers many presses per push","Switch bounce","Debounce in software (ignore changes for ~20 ms) or add an RC filter; the clean count confirms it."],
      ["The OLED shows nothing","Wrong I2C address, SDA/SCL swapped, or no pull-ups","Run the I2C scanner first; it prints the address if wiring is right, and silence points you at the bus."],
      ["Analog readings are noisy","No averaging, or a floating input","Average several samples; ensure the divider or sensor actually drives the pin."],
      ["Upload fails with 'port not found' or a sync error","Wrong board/port selected, or a driver issue","Select the correct board and port; on some boards hold BOOT while uploading (ESP32)."]
    ],
    challenge:"Combine every peripheral into one state machine: the button cycles modes, the sensor value drives the motor speed, and the OLED shows the current mode and reading. Then put the board to sleep between readings and measure the current drop, writing down how much each peripheral costs when idle versus active.",
    reflect:[
      "Why does a shared supply for a motor crash the microcontroller, and what does the separate supply plus common ground fix?",
      "What does INPUT_PULLUP do electrically, and why does the button read HIGH when not pressed?",
      "For one stage, what was the fault and how did measuring (not guessing) lead you to it?"
    ],
    safety:"Low voltage, but motors and servos can pinch and wires can short. Never power a motor through the board's regulator, and double-check polarity on the LED and the supply."
  },
  "p23lab2":{
    time:"2–3 h",
    setup:[
      "A digital multimeter you trust, with working probes and a known-good battery.",
      "A kit of ten resistors with color bands, a 9 V battery or supply, a 1 kohm and a 2 kohm resistor for the divider, an LED, and diodes 1N4007 and 1N5819.",
      "A breadboard, a 100 ohm 2 W power resistor for the load test, and optionally a USB current meter.",
      "A worksheet for predicted-versus-measured values and percent error."
    ],
    checkpoints:[
      "Ten resistors are measured and compared with their color-code values; percent error is computed and each is within its tolerance band.",
      "For the 9V / 1k / 2k divider, every node voltage and the current are predicted, then measured (voltage in parallel, current in series), with any difference explained.",
      "The LED's forward voltage is measured at 5 mA and 20 mA, and the board's idle current is measured on the USB line.",
      "A continuity and resistance survey of the breadboard documents rail splits and row connections; diode-test readings for 1N4007, 1N5819 and an LED are recorded.",
      "The load test shows the 5 V rail sagging under the 100 ohm 2 W load, and the regulator's output resistance is computed from the sag."
    ],
    hints:[
      "Measure voltage across a component (parallel) but current through it (series, meter in the circuit); mixing these up is the most common meter mistake and can blow the meter's fuse.",
      "Percent error is 100 x (measured - nominal) / nominal; compare it with the tolerance band (gold 5%, brown 1%) to judge whether a resistor is in spec.",
      "Output resistance from a load test: R_out = (V_noload - V_load) / I_load. The sag under a known load is the whole experiment."
    ],
    trouble:[
      ["The meter reads zero or OL for current","The probes are in the voltage jacks, or the fuse is blown","Move the red probe to the current jack and break the circuit to insert the meter in series; check the fuse if still zero."],
      ["Resistance readings drift","Fingers across the probes, or in-circuit measurement","Measure out of circuit and do not touch both probe tips; your body is a parallel resistor."],
      ["Divider voltages do not add to 9 V","The meter's input resistance loads a high-value divider, or a bad connection","With 1k/2k the loading is tiny; check the breadboard row connections with continuity."],
      ["Diode test shows OL both ways","Open diode, or the meter is not in diode mode","Confirm diode mode; a good silicon diode reads ~0.6 V forward, OL reverse; Schottky reads lower."],
      ["Load test shows no sag","The load is not actually drawing current, or you measured the wrong node","Confirm the power resistor is across 5 V and warm; measure right at the pin."]
    ],
    challenge:"Characterize the LED fully: sweep current from 1 mA to 20 mA in steps, measure Vf at each, and plot the I-V curve to see the diode's exponential knee. Then compute the resistor you would need for exactly 10 mA from a 3.3 V and a 5 V rail, build both, and confirm the current matches on the meter.",
    reflect:[
      "Why do you measure current in series and voltage in parallel, and what happens physically if you reverse them?",
      "What did the three largest discrepancies have in common, and what does that tell you about measurement error versus component error?",
      "What does the regulator's output resistance predict about how its voltage behaves as you add load?"
    ],
    safety:"The 100 ohm 2 W resistor gets hot under load; hold it by the leads and limit the test to a few seconds. Keep current through the LED under its rated maximum."
  },
  "p23lab3":{
    time:"two sessions of 2–3 h",
    setup:[
      "An ESP32 or UNO, a BME280 or MPU-6050 I2C sensor with the right pull-ups, and a Raspberry Pi (or a PC) for the host side.",
      "A logic analyzer (an inexpensive 8-channel clone) and PulseView from the sigrok project (sigrok.org) for the I2C capture.",
      "Python 3 with pyserial on the host; on the Pi also i2c-tools and smbus2, with the I2C interface enabled in raspi-config.",
      "A USB cable for serial, and jumper wires for both the MCU-to-sensor and the Pi-to-sensor wiring."
    ],
    checkpoints:[
      "A logic-analyzer capture in PulseView decodes one I2C transaction with START, the 7-bit address, the ACK, data bytes and STOP clearly labelled.",
      "The MCU streams one JSON line per second over USB serial in the form {\"t\":..,\"rh\":..,\"p\":..}.",
      "A pyserial script on the host parses the lines, appends to a timestamped CSV, and runs as a systemd service that survives a reboot (systemctl status shows active).",
      "A day of data is plotted; the same sensor read directly on the Pi's I2C header responds to i2cdetect -y 1 and smbus2, and a paragraph compares the two architectures."
    ],
    hints:[
      "Capture the I2C transaction before trusting the data: the decoded START, address, ACK and STOP tell you the bus is healthy and the address is right.",
      "Send newline-delimited JSON so the host can read one line at a time; a partial line means you read before the newline arrived, so read with readline().",
      "A systemd service needs a unit file with the absolute path to python and the script, Restart=on-failure, and enabling with systemctl enable so it starts at boot."
    ],
    trouble:[
      ["i2cdetect shows nothing on the Pi","I2C not enabled, wrong bus number, or missing pull-ups","Enable I2C in raspi-config, try bus 1, and confirm the sensor board has pull-ups or add them."],
      ["Serial reads are garbled","Baud-rate mismatch between MCU and host","Set the same baud on both ends; 115200 is common. Confirm the port with ls /dev/tty*."],
      ["JSON parse errors on the host","Reading a partial line, or extra boot output on the serial line","Use readline() and wrap json.loads in try/except; skip non-JSON boot banners."],
      ["The systemd service fails at boot but works by hand","The serial device is not ready yet, or a relative path","Add After=dev-ttyUSB0.device or a restart loop; use absolute paths and the venv python."],
      ["The logic analyzer decode is garbage","Wrong channels mapped to SDA/SCL, or sample rate too low","Map SDA and SCL correctly in PulseView and sample at least 4x the I2C clock."]
    ],
    challenge:"Add a second sensor on the same I2C bus at a different address and show both in one capture and one CSV, then deliberately remove a pull-up and capture the degraded edges to see why pull-ups matter. Compare the end-to-end latency of the MCU-plus-host path against reading directly on the Pi, and say which architecture you would ship and why.",
    reflect:[
      "What does the ACK bit in the I2C capture prove, and what does its absence tell you?",
      "When is the MCU-plus-host split worth the extra complexity over reading the sensor directly on the Pi?",
      "Why does a systemd service beat a script in a terminal for something that must run every day?"
    ]
  },
  "p23lab4":{
    time:"two sessions of 2–3 h",
    setup:[
      "An ESP32 (C3 or classic), a BME280 sensor, an INA219 or USB power meter for current measurement, and a single 18650 cell with a holder (handle lithium cells carefully).",
      "A Raspberry Pi running Mosquitto (mosquitto.org) for the broker, with openssl to create a CA and certificates.",
      "A router or access point where you can create a guest SSID or IoT VLAN with client isolation and a firewall rule.",
      "The ESP32 toolchain (Arduino core or ESP-IDF) and nmap on a machine on the IoT network you own."
    ],
    checkpoints:[
      "Mosquitto listens on 8883 with TLS and required authentication; mosquitto_sub with the client certificate subscribes successfully, and a plain connection on 1883 is refused.",
      "The ESP32 firmware stores Wi-Fi credentials in NVS via a provisioning portal, publishes BME280 readings with QoS 1 and a retained status topic, sets a Last Will, then deep-sleeps for 10 minutes.",
      "Awake and sleep current are measured, and battery life for one 18650 is computed from the duty cycle and recorded.",
      "The node sits on the guest SSID or IoT VLAN with client isolation; nmap from the IoT network shows only the broker port reachable and nothing else.",
      "An OTA update (ArduinoOTA or HTTPS OTA) changes the version string once, and the rollback path is demonstrated."
    ],
    hints:[
      "Prove the secure broker with mosquitto_sub before touching the ESP32, so when the node fails you know the problem is on the node, not the broker.",
      "Battery life = capacity (mAh) / average current (mA), where average current = (awake_mA x awake_seconds + sleep_mA x sleep_seconds) / period. Deep sleep is what makes the number large.",
      "A retained status topic plus a Last Will lets the broker publish 'offline' automatically if the node drops; set the LWT on connect and publish 'online' retained after connecting."
    ],
    trouble:[
      ["The ESP32 cannot connect to the TLS broker","Wrong CA on the device, clock not set (certs need time), or SNI/hostname mismatch","Load the CA cert into the firmware, set time via SNTP before TLS, and match the broker's certificate hostname."],
      ["Deep sleep never wakes or resets instead","Wrong wake source or GPIO hold, or a brownout on wake","Configure the timer wake source; a current spike on wake can brown out a weak supply, so check the cell and capacitor."],
      ["Current draw in sleep is milliamps, not microamps","A peripheral or the sensor stays powered, or a pull-up leaks","Power the sensor from a GPIO you can turn off, and remove unnecessary pull-ups; measure with the INA219."],
      ["nmap shows unexpected open ports","Client isolation is off or the firewall rule is too permissive","Enable client isolation on the SSID and restrict the rule to the broker IP and port only; re-scan."],
      ["OTA bricks the node","No rollback partition or a bad image","Use the dual-partition OTA scheme so a failed boot rolls back; keep a serial-flash recovery path."]
    ],
    challenge:"Add a verified-boot or signed-OTA step so the node refuses an unsigned firmware image, and prove it rejects a tampered image. Then run the node on battery for a full day, log every wake over MQTT, and compare the measured battery drain against your calculated life, explaining any gap.",
    reflect:[
      "Why does a secured MQTT node need network isolation on top of TLS, and what does each layer stop?",
      "Where does the current actually go during a 10-minute cycle, and which phase dominates the battery budget?",
      "What makes an OTA path safe, and what is the failure you most want the rollback to catch?"
    ],
    safety:"Lithium 18650 cells can vent or catch fire if shorted, over-discharged or charged wrongly; use a protected cell and a proper holder, never short the terminals, and charge only with a correct charger. Isolate the IoT node on a network you own."
  },
  "p23lab5":{
    time:"three sessions of 2–3 h",
    setup:[
      "A temperature-controlled soldering iron, rosin flux, solder, a brass-tip cleaner, flux-cored wick, and fume extraction or good ventilation; safety glasses.",
      "A through-hole practice kit (a 555 flasher or a simple clock) and an SMD practice board with 0805, 0603 and a SOIC part.",
      "KiCad 10 (kicad.org) and a fab house's design rules (JLCPCB or OSH Park publish them).",
      "The Lab 4 node design as the target board; a current-limited bench supply for first power-up, and a loupe or USB microscope for inspecting joints."
    ],
    checkpoints:[
      "The through-hole kit is built; joints are photographed under magnification and classified good, cold or bridged, and the bad ones are reworked to good.",
      "The SMD practice board has 0805, 0603 and a SOIC part soldered, with one fine-pitch part drag-soldered.",
      "In KiCad the carrier board (ESP32 module, BME280 header, MCP1700 regulator with caps, battery connector with fuse, program header, mounting holes) passes ERC and DRC against the fab's rules, and Gerbers plus drill files are exported.",
      "Five boards are ordered; one is assembled, power-to-ground continuity is checked before power, it is brought up on a current-limited supply, flashed, and runs the Lab 4 firmware; an enclosure is chosen or printed."
    ],
    hints:[
      "A good joint is shiny and concave with the pad and lead both wetted; a cold joint is dull and blobby. Heat the joint, not the solder, and clean the tip often.",
      "Run ERC on the schematic and DRC on the layout before exporting; fix every error and understand each warning. Load the fab's design rules so clearances match what they can make.",
      "Always check power-to-ground for a short with the meter before applying power, and bring the board up on a current-limited supply so a mistake trips the limit instead of burning a trace."
    ],
    trouble:[
      ["Solder balls up and will not wet the pad","Not enough heat, no flux, or an oxidized tip","Clean and re-tin the tip, add flux, raise the temperature a little, and heat the pad and lead together."],
      ["DRC reports clearance or width errors","Traces or pads violate the fab's rules","Load the correct design rules, then widen traces or increase clearance until DRC is clean."],
      ["The board draws too much current at power-up","A solder bridge or a backwards part","The current-limited supply catches it; find the bridge with the meter and a loupe, and check part orientation."],
      ["ERC complains about unconnected pins or power flags","Missing net connections or no power-flag symbol","Add the power flags and connect the stray nets; ERC warnings are usually real."],
      ["The regulator output is wrong or missing","Wrong part, missing caps, or reversed input","Confirm the MCP1700 pinout and the input/output caps; measure the output before connecting the ESP32."]
    ],
    challenge:"Design a second revision from what you learned assembling the first: move a part that was hard to reach, add test points for power and the serial lines, and add a silkscreen label for the fuse rating. Order it, assemble it, and write a one-page comparison of yield and bring-up time between rev A and rev B.",
    reflect:[
      "What distinguishes a reliable joint from one that will fail later, and how do you judge it by eye?",
      "Why run ERC and DRC and a power-to-ground check before ever applying power, and what does each catch?",
      "What one layout decision most affected how easy the board was to assemble and debug?"
    ],
    safety:"Soldering: the iron and solder are hot, solder fumes need ventilation or extraction, and lead-based solder requires hand-washing before eating. Wear eye protection when clipping leads, and let the iron cool in its stand."
  }
});
/* ---------- p24 Fiber Optics, Telecom & the Physical Layer ---------- */
Object.assign(window.LABX,{
  "p24lab1":{
    time:"two sessions of 2–3 h plus daily drills",
    setup:[
      "A free account at fiberu.org (the FOA's learning site) and a quiet place to work the lessons and quizzes.",
      "About $20 for the Fiber U Certificate of Completion test when you are ready; save the PDF it issues.",
      "A set of flash cards or a spaced-repetition app, and photos or a chart of SC, LC, ST, FC and MPO connectors in UPC (blue) and APC (green) housings.",
      "The TIA-598 color order and the jacket-color convention (OM1-OM5, OS2) printed out to build the drill from."
    ],
    checkpoints:[
      "All ten Basic Fiber Optics lesson quizzes are scored at 100%.",
      "The Certificate of Completion test is passed and the PDF is saved (it is documentation for the FOA Direct Certification application).",
      "A flash drill exists covering the twelve TIA-598 colors in order, jacket colors by fiber type, and photos of the five connector types with UPC and APC housings.",
      "You can name any fiber number's buffer tube and strand color in an 864-fiber cable in under ten seconds, scored at 100% three days running."
    ],
    hints:[
      "The twelve colors repeat in both the buffer tubes and the strands within a tube, which is the key to high-count cables; learn the order once and apply it twice.",
      "Fiber number to position: tube = ceil(fiber / 12), position in tube = ((fiber - 1) mod 12) + 1, then map both to the color order. Practice the arithmetic until it is automatic.",
      "APC connectors are green with an angled endface (lower reflectance, used in PON and video); UPC are blue. Learn the color-to-type link so you never cross-connect APC to UPC."
    ],
    trouble:[
      ["A lesson quiz will not score 100%","A detail skimmed, often units or a color-order edge case","Re-read the lesson section the missed question came from; the quiz is diagnostic, so chase the exact gap."],
      ["The color order will not stick","Rote memorization without a mnemonic or the tube/strand link","Use a mnemonic for the twelve colors and drill tube and strand together so one reinforces the other."],
      ["Connectors look alike in photos","Housing color and endface angle not noticed","Sort by housing color first (green APC, blue UPC), then by latch and ferrule size to tell SC/LC/ST apart."],
      ["The 864-count lookup is slow","Doing the arithmetic from scratch each time","Memorize the tube boundaries (1-12, 13-24, ...) so you jump straight to the tube, then the strand color."],
      ["The certificate PDF will not save or print","Browser or account issue after the test","Re-download from the Fiber U account page; keep a backup copy for the FOA application."]
    ],
    challenge:"Build a two-way drill: given a tube color and a strand color, name the fiber number, and given a fiber number, name both colors, for cables of 144, 432 and 864 fibers. Time yourself and track the error rate over a week, then add the ribbon-cable case where twelve fibers share a ribbon and the numbering differs.",
    reflect:[
      "Why do the twelve colors repeat at both the tube and the strand level, and how does that scale to 864 fibers?",
      "What real failure does confusing APC and UPC cause on a live link, and why does the endface angle matter?",
      "Which part of the identification drill will save you the most time on a real splice job, and why?"
    ]
  },
  "p24lab2":{
    time:"3–4 h",
    setup:[
      "The TIA-568.3 loss values (connector, splice and fiber attenuation maximums and typicals) and the wavelength plan, printed or bookmarked.",
      "A calculator for the six hand-worked budgets, and a notebook to show the arithmetic and margins.",
      "Python 3 (python.org) for the loss_budget and compare_budget functions; a plain text editor or a notebook.",
      "The transceiver power budgets you will add: GPON B+ (28 dB), XGS-PON N1 (29 dB), 10GBASE-LR (6.2 dB), 10GBASE-ER (40 km)."
    ],
    checkpoints:[
      "Six budgets are worked by hand using TIA maximums and then typicals, each with its margin: 150 m OM3 at 850 nm (two connector pairs); 2 km inside-plant SM (four pairs, two splices); 3.2 km OSP (two pairs, four splices); a 1:32 GPON at 7 km; a 1:64 XGS-PON at 12 km; 40 km OSP for 10GBASE-ER.",
      "loss_budget(km, splices, connector_pairs, fiber, wavelength) returns the TIA maximum and typical loss, and compare_budget(loss, tx_min_dbm, rx_sens_dbm, margin=3) returns a pass/marginal/fail verdict.",
      "All six run through the script and match the hand arithmetic to within 0.05 dB.",
      "The GPON B+ (28 dB), XGS-PON N1 (29 dB) and 10GBASE-LR (6.2 dB) power budgets print pass, marginal or fail for each link."
    ],
    hints:[
      "Total loss = fiber attenuation (dB/km x km at the wavelength) + connectors (pairs x per-pair loss) + splices (count x per-splice loss). PON adds the splitter loss, which dominates.",
      "Use the right attenuation for the wavelength: roughly 3.5 dB/km at 850 nm multimode, 0.35 dB/km at 1310 nm and 0.25 dB/km at 1550 nm single-mode. The splitter loss for 1:32 is about 17-18 dB.",
      "A link passes when the available power budget (tx_min - rx_sensitivity) exceeds the total loss plus your margin (3 dB is a common safety margin). compare_budget just encodes that inequality."
    ],
    trouble:[
      ["The script and the hand math disagree by more than 0.05 dB","Different attenuation constant or a rounding difference","Use the same per-km, per-connector and per-splice values in both; print the components separately to find the mismatch."],
      ["A PON budget always fails","The splitter loss was omitted or set too low","Add the correct splitter loss (about 17.5 dB for 1:32, 20.5 dB for 1:64); it is the biggest term."],
      ["A multimode link looks far worse than single-mode","850 nm multimode attenuation is roughly ten times 1550 nm single-mode","That is correct physics; multimode is for short runs. Confirm you used the multimode constant."],
      ["compare_budget returns pass when it should be marginal","The margin was not subtracted, or tx/rx values are swapped","Verify available budget = tx_min - rx_sensitivity (both negative dBm) and that margin is subtracted."],
      ["Units confusion between dB and dBm","Mixing loss (dB) with power (dBm)","Keep loss in dB and absolute power in dBm; the budget compares a dB loss against a dBm-to-dBm span."]
    ],
    challenge:"Extend the script to take a measured OLTS loss and report the remaining margin and a pass/fail against both the TIA maximum and the transceiver budget, then feed it the numbers from a real acceptance test (your own, if your employer permits) and see whether the link passed with margin to spare or was living on the edge.",
    reflect:[
      "Why does the splitter loss dominate a PON budget, and what does that mean for how far a PON can reach?",
      "When would you design to the TIA maximum values versus the typical values, and what risk does each choice carry?",
      "What does a 3 dB margin actually protect against over the life of a link?"
    ]
  },
  "p24lab3":{
    time:"3–4 h",
    setup:[
      "The Fiber U 'Understanding OTDRs' mini-course (fiberu.org), worked through once.",
      "A free OTDR trace viewer and sample .sor files from a manufacturer (EXFO, VIAVI or AFL publish both).",
      "A calculator for the distance-from-time arithmetic, and a notes sheet for the five annotated event tables.",
      "The group index of refraction you will use (n = 1.468 for the hand calculations), and knowledge of ghost, gainer and reflective-versus-non-reflective events from the module."
    ],
    checkpoints:[
      "The OTDR mini-course is complete; a trace viewer is installed and opens the sample .sor files.",
      "For each of five traces, every event is listed with distance, loss, reflectance, type (reflective or non-reflective) and your identification (connector, fusion splice, mechanical splice, bend, ghost, gainer, end).",
      "Two event distances are computed by hand from round-trip time with n = 1.468 and agree with the viewer.",
      "Changing the pulse width on a trace with a suspected ghost is done, and you record what moves and what does not.",
      "If your employer permits, two real acceptance-package traces from your crew are read the same way, event by event, with your identifications."
    ],
    hints:[
      "A reflective event (connector, mechanical splice, end) shows a spike; a non-reflective event (fusion splice, bend) shows only a step down. A gainer is a splice artifact from mismatched backscatter, not real gain.",
      "Distance = (c / n) x (round-trip time / 2), where c is the speed of light in vacuum. The factor of two accounts for light going out and coming back.",
      "A ghost is a reflection of a reflection, appearing at a multiple of a real reflective event's distance. Changing the pulse width moves or hides measurement artifacts but not real events, which is how you confirm a ghost."
    ],
    trouble:[
      ["An event is hard to classify","The reflectance and loss together are ambiguous","Use both: a loss step with no spike is a fusion splice or bend; a spike with loss is a connector or mechanical splice."],
      ["A gainer shows apparent gain (loss below zero)","Backscatter coefficient mismatch between two fibers","Average a bidirectional measurement; the real splice loss is the mean of the two directions."],
      ["Hand distance does not match the viewer","Wrong index of refraction or forgot the factor of two","Use the trace's own index setting and divide the round trip by two."],
      ["Events hide in the dead zone","Pulse width too wide near a strong reflection","Shorten the pulse width to resolve close events, accepting shorter range."],
      ["A ghost is mistaken for a real event","Not tested against pulse-width changes or distance multiples","Check whether it sits at a multiple of a real reflective event and whether it moves with pulse width."]
    ],
    challenge:"Take one trace and analyze it bidirectionally: compute the true splice loss at a gainer by averaging both directions, and show the single-direction reading was misleading. Then set up two traces of the same link at different pulse widths and write which events each resolves better and why short and long pulses trade dead zone against range.",
    reflect:[
      "Why does a fusion splice show no reflection while a connector does, and what does that tell you about the two joints?",
      "Why must a gainer be read bidirectionally, and what is physically happening at that splice?",
      "How does pulse width trade dead zone against dynamic range, and when would you choose each?"
    ]
  },
  "p24lab4":{
    time:"2–3 h",
    setup:[
      "A blank reel-installation as-built sheet (the daily template you already use) or paper with columns for station, IN, OUT, slack, running line and totals.",
      "A calculator, and the sample numbers given in the lab steps written out.",
      "Knowledge of your sheet's stationing convention (STA in feet, where 9+12 means 912 feet).",
      "A quiet workspace; this is an arithmetic-and-verification drill, not a field task."
    ],
    checkpoints:[
      "The sheet is filled from the given marks: A IN 20,410 / OUT 20,310; HH1 at 9+12 IN 19,398 / OUT 19,368; HH2 at 19+95 IN 18,285 / OUT 18,255; B at 30+40 IN 17,210 / OUT 17,130.",
      "Slack at each point and the running line between points are computed, with subtotals and TOTAL INSTALLED.",
      "TOTAL INSTALLED equals first IN minus last OUT (20,410 - 17,130 = 3,280), and the running-line sum matches the stationing of B (STA 30+40).",
      "A deliberate digit error (19,398 to 19,938) is introduced, the sheet recomputed, and you record which check caught it and how.",
      "Both checks are added to your routine before submitting a real sheet."
    ],
    hints:[
      "Slack at a point is the counter reading difference across that point (IN minus OUT); running line between two points is the difference of the counters between them. The two must reconcile with the stationing.",
      "The expected results are slack 240 total, running line 3,040, total installed 3,280. If your total does not equal first IN minus last OUT, a number is wrong.",
      "The two independent checks are the point of the lab: total = first IN - last OUT catches a slack error, and running line summed = stationing of B catches a distance error. A single error usually breaks only one check, which tells you where to look."
    ],
    trouble:[
      ["TOTAL INSTALLED does not equal first IN minus last OUT","A transposed or mistyped counter reading","Re-enter each IN/OUT; the mismatch size often points at which digit flipped."],
      ["The running line does not match the stationing of B","A distance between two handholes is wrong","Compare each segment's running line against the station difference; the odd segment is the error."],
      ["Slack numbers look negative","IN and OUT swapped at a point","At each handhole the cable pays out, so IN is larger than OUT; swap them back."],
      ["The injected error is caught by both checks","The error happened to affect both distance and total","That is fine; note that some errors break both, and a single check would have missed nothing here."],
      ["Stationing arithmetic confuses feet","Reading 9+12 as 9.12 instead of 912 feet","A station is hundreds of feet plus the plus-value in feet; 9+12 is 912 feet."]
    ],
    challenge:"Build a small spreadsheet or script that takes the station, IN and OUT for each point and computes slack, running line, totals and both reconciliation checks automatically, flagging any row where the checks disagree. Feed it a day of your own real numbers and see whether it catches anything you would have submitted.",
    reflect:[
      "Why do two independent checks catch errors that one check would miss, and what kind of error slips past each one alone?",
      "Which check would have caught the error you injected, and what would you have done if only the other check existed?",
      "How does adding these checks before you submit change the cost of a mistake for the QA inspector and for you?"
    ]
  },
  "p24lab5":{
    time:"2–3 h to build, then two field audits two weeks apart",
    setup:[
      "The Module 6 safety material covering light, glass, chemicals, excavation (Subpart P), confined space, aerial, traffic (MUTCD) and documentation.",
      "A document or spreadsheet for the 25-item checklist, organized by hazard area.",
      "Honesty and a real workday to audit against, scoring each item met, partly met or missed.",
      "A calendar reminder for the two-week re-audit."
    ],
    checkpoints:[
      "A 25-item checklist spans light (power meter not eyepiece, caps on), glass (sharps, mat, glasses, no food), chemicals (SDS, storage, eye wash), excavation (811 ticket, tolerance zone, Subpart P depths), confined space (gas test, blower, attendant), aerial (clearances, bonding, fall protection), traffic (MUTCD plan, Class 2/3 apparel) and documentation.",
      "One real workday is audited item by item, each scored met, partly met or missed, honestly.",
      "The three misses with the highest consequence are listed, each with a fix you personally control.",
      "A second audit two weeks later records whether the three fixes held."
    ],
    hints:[
      "Group the checklist by hazard so you can audit a whole area at once; a list in random order is slower to use and easier to skip.",
      "Weight by consequence, not by ease: a missed 811 ticket or a skipped gas test matters more than a missing label, so your three priority fixes should come from the high-consequence end.",
      "Make each fix something you control alone (your own apparel, your own ticket check, your own meter habit), because a fix that depends on someone else will not hold between audits."
    ],
    trouble:[
      ["The checklist is too long to use","Too many low-value items crowding out the critical ones","Keep 25 items, but order by consequence so the ones that can hurt you are first."],
      ["Every item scores 'met'","Grading yourself generously","Require evidence for each 'met' (the ticket number, the gas reading, the photo); if you cannot point to it, it is partly met."],
      ["The high-consequence misses are outside your control","The fix depends on a crew or employer decision","Record the request you would make, but pick personal fixes for your own three so they actually happen."],
      ["The re-audit shows the same misses","The fix was a resolution, not a changed habit or a changed tool","Make the fix structural: a pre-job card, a tool in your bag, a default you cannot skip."],
      ["Subpart P depths or MUTCD classes unclear","Relying on memory for the numbers","Keep the OSHA Subpart P soil-and-depth table and the MUTCD apparel classes in the checklist itself as a reference."]
    ],
    challenge:"Turn the checklist into a one-minute pre-job card you actually run before each task, then audit a crewmate's day (with their consent) against it and compare what an outside observer catches versus self-assessment. Track your met/partly/missed scores across four weekly audits and show whether the trend is improving.",
    reflect:[
      "Which single missed item on your list could cause the most serious harm, and why is it easy to skip?",
      "Why does self-auditing tend to score higher than an outside audit, and what evidence requirement closes that gap?",
      "What is the difference between a fix that is a resolution and one that changes a habit or a tool, and which held at the re-audit?"
    ],
    safety:"This lab is about field safety itself: 811 locate tickets, OSHA Subpart P excavation depths, confined-space gas testing and attendants, aerial clearances and fall protection, MUTCD traffic control, and never viewing a live fiber through an eyepiece. Follow your employer's procedures and never treat the checklist as a substitute for required training or permits."
  }
});
/* ---------- p25 Cryptography & Applied Security Engineering ---------- */
Object.assign(window.LABX,{
  "p25lab1":{
    time:"two sessions of 2–3 h",
    setup:[
      "A free CryptoHack account (cryptohack.org) and Python 3.12+ with the pycryptodome and requests libraries for the helpers.",
      "A notebook or a helpers.py file where you save every function you write (xor, bytes_to_long, modular inverse).",
      "Comfort with bytes, ints and hex from an earlier domain; the site's challenges are solved locally in Python.",
      "A one-page document to collect the ten misuses you exploit and the correct practice for each."
    ],
    checkpoints:[
      "The Introduction course (encoding, XOR, bytes-and-ints) is complete and your profile shows the solves.",
      "The Modular Arithmetic course and the first ten General and Mathematics challenges are solved, with every Python helper saved to your library.",
      "The Symmetric Cryptography course ECB, CBC and padding challenges are solved.",
      "At least five RSA challenges (small exponent, factoring from hints, signature forgery) are solved, each with a paragraph naming the misuse that made it possible."
    ],
    hints:[
      "Build a small helper library as you go; nearly every later challenge reuses xor, bytes_to_long, long_to_bytes and a modular inverse, so write them once and import them.",
      "The modular inverse is Python's pow(x, -1, n); small-exponent RSA often falls to an integer cube root when the message is short and e is 3.",
      "For each RSA solve, ask what single assumption the challenge broke (no padding, a shared modulus, a tiny exponent, a reused nonce) and write the one-line fix beside it."
    ],
    trouble:[
      ["bytes_to_long and back give wrong values","Endianness or an off-by-one in length","Use pycryptodome's bytes_to_long/long_to_bytes rather than hand-rolling, and check with a round-trip test."],
      ["A modular inverse raises an error","The inputs are not coprime, so no inverse exists","Confirm gcd(x, n) == 1; if not, the challenge expects a different route (factoring)."],
      ["An RSA challenge will not factor","You are trying brute force where a hint was intended","Re-read the challenge for the given structure (close primes, shared factor, Fermat factoring)."],
      ["XOR results look like garbage","Wrong key length or encoding, or XORing strings not bytes","Work in bytes throughout and confirm the key repeats to the message length."],
      ["The site rejects a correct-looking flag","Extra whitespace or wrong flag format","Strip the flag and match the expected format exactly."]
    ],
    challenge:"Package your helpers into a tested module with pytest cases for each function, then pick one RSA challenge you solved and write a short script that demonstrates the correct, safe version (OAEP padding, a proper exponent) refusing the same attack. This turns the exploit into a lesson about the defense.",
    reflect:[
      "For the RSA solves, what single assumption did each broken challenge rely on, and what practice removes it?",
      "Why is textbook RSA (no padding) unsafe even when the key is large?",
      "Which helper did you reuse most, and what does that tell you about where cryptographic bugs cluster?"
    ],
    safety:"All targets are challenges on a platform built to be broken legally; apply none of these techniques to systems you do not own or are not explicitly authorized to test."
  },
  "p25lab2":{
    time:"two sessions of 2–3 h",
    setup:[
      "Python 3.12+ with the cryptography library (pyca/cryptography) for the AES primitive, and pytest.",
      "The Cryptopals challenge text (cryptopals.com), sets 1 and 2, open for reference.",
      "A Git repository with one file per challenge and a README you will fill in with the attack-to-defense mapping.",
      "The provided challenge inputs (ciphertexts and files) downloaded alongside the code."
    ],
    checkpoints:[
      "Set 1 is complete: hex/base64 conversion, fixed and single-byte XOR, English scoring, repeating-key XOR broken, AES-128-ECB decrypted with the library, ECB detected.",
      "Set 2 is complete: PKCS#7 padding implemented, CBC implemented from the ECB primitive and verified against the library, and the ECB/CBC detection oracle built.",
      "The byte-at-a-time ECB decryption, ECB cut-and-paste, PKCS#7 validation and CBC bit-flipping challenges all pass against your own oracle functions.",
      "Each challenge has two sentences naming the mode property abused and the modern construction (AEAD, random IV, authenticated decryption) that removes it; tests pass."
    ],
    hints:[
      "Implement CBC yourself from the ECB block primitive, then check your implementation against the library's CBC; matching ciphertext proves you understand the chaining.",
      "ECB leaks because identical plaintext blocks produce identical ciphertext blocks; the detection oracle just looks for repeated 16-byte blocks.",
      "Byte-at-a-time ECB decryption works by controlling input length so one unknown byte falls at a block boundary, then matching it against all 256 possibilities one position at a time."
    ],
    trouble:[
      ["Your CBC does not match the library","IV handling or the XOR-before-encrypt order is wrong","CBC XORs the previous ciphertext block into the plaintext before encrypting; check the first block uses the IV."],
      ["PKCS#7 validation accepts bad padding","The check does not verify every pad byte","Validate that the last byte N is between 1 and block size and that the final N bytes all equal N; raise on any mismatch."],
      ["Byte-at-a-time attack stalls","Block alignment drifts as the known prefix grows","Recompute the target block index each round so the unknown byte stays at the boundary."],
      ["CBC bit-flip corrupts the wrong byte","Editing the wrong position in the previous block","Remember a flip in ciphertext block i changes plaintext block i+1 at the same offset; target accordingly."],
      ["Single-byte XOR picks the wrong key","Weak English scoring","Score with letter frequency including spaces; the space character is the strongest signal in English text."]
    ],
    challenge:"Add an authenticated construction to your repo: wrap your CBC in an encrypt-then-MAC scheme with HMAC-SHA256, then show that the CBC bit-flipping attack now fails because the MAC check rejects the tampered ciphertext before decryption. Write the one-paragraph explanation of why authenticate-then-decrypt order matters.",
    reflect:[
      "Why does ECB leak structure that CBC hides, and what does the penguin image demonstration really show?",
      "What property did the bit-flipping attack abuse, and how does adding a MAC remove it?",
      "Why is implementing a mode yourself a better teacher than calling the library, even though you would never ship your own in production?"
    ],
    safety:"Every target is your own code or the course's provided inputs; nothing here is run against any system you do not own."
  },
  "p25lab3":{
    time:"3–4 h",
    setup:[
      "OpenSSL 3.x (openssl version) on Linux, macOS or WSL; most systems ship it, and the module uses the 3.x subcommands.",
      "Python 3.12+ with the cryptography library for the AES-GCM step, since openssl enc does not offer GCM.",
      "A local nginx or a Python TLS server for the certificate-serving step, and a scratch directory for keys and certs.",
      "A command log file; you will paste commands and their outputs as the deliverable."
    ],
    checkpoints:[
      "openssl genpkey produces RSA-3072, EC P-256 and Ed25519 keys; file sizes and generation times are recorded; openssl pkey -text -noout dumps each.",
      "openssl dgst -sha256 and -sha3-256 hash a file; an HMAC is computed with -hmac; changing one byte changes the digest; the AES-GCM step is done in Python with AESGCM.",
      "A file is signed with openssl pkeyutl -sign using the Ed25519 key and verified; tampering makes verification fail.",
      "A lab PKI is built (root CA, intermediate, CSR, leaf with a SAN); openssl verify -CAfile validates the chain; a local TLS server serves it and openssl s_client inspects it.",
      "A public site's certificate chain is decoded with openssl x509 -text, identifying issuer, validity, SANs, key type, signature algorithm and the SCT list."
    ],
    hints:[
      "openssl genpkey is the modern key generator for all three algorithms; -text -noout prints the key structure so you can see how RSA-3072 dwarfs Ed25519.",
      "openssl enc has no authenticated mode, which is exactly why the module sends you to Python's AESGCM; using an unauthenticated cipher for real data is the mistake to avoid.",
      "Build the chain in order: root CA signs the intermediate, intermediate signs the leaf, and the server must present leaf plus intermediate. openssl verify -CAfile with the root confirms the whole chain."
    ],
    trouble:[
      ["openssl verify reports 'unable to get local issuer certificate'","The chain is incomplete or the CAfile is wrong","Provide the full chain (leaf then intermediate) and point -CAfile at the root; confirm each cert's issuer matches the next cert's subject."],
      ["s_client shows 'verify error: self signed certificate in chain'","The server is not sending the intermediate, or the root is not trusted","Concatenate leaf and intermediate in the served file; pass the root with -CAfile for the test."],
      ["Signature verification unexpectedly passes after tampering","You verified the wrong file or signature","Re-run against the tampered file explicitly; a good Ed25519 verify fails loudly on any change."],
      ["A SAN mismatch error in the browser or s_client","The leaf's Subject Alternative Name does not include the hostname","Add the exact hostname to the SAN in the CSR config; CN alone is ignored by modern clients."],
      ["Key generation times are too close to measure","The algorithms are fast on modern hardware","Time many iterations in a loop; the relative difference (RSA-3072 slow, Ed25519 fast) is the point."]
    ],
    challenge:"Add a certificate revocation story: issue a leaf, then revoke it with your CA and generate a CRL, and show openssl verify -crl_check rejecting the revoked cert. Then compare signing and verification throughput of RSA-3072, P-256 and Ed25519 by timing a thousand operations each, and explain why the signing and verifying costs are asymmetric for RSA.",
    reflect:[
      "Why is Ed25519 so much smaller and faster than RSA-3072 for the same or better security, and what held RSA in place so long?",
      "Why does a chain need the intermediate, and what breaks when a server forgets to send it?",
      "What does the SCT list in a public certificate tell you, and what does Certificate Transparency protect against?"
    ],
    safety:"Decode only certificates from sites you choose to visit; the lab CA and keys are yours. Keep private keys out of any shared log and redact them in the deliverable."
  },
  "p25lab4":{
    time:"3–4 h",
    setup:[
      "Python 3.12+ with the cryptography library and the built-in secrets module; a notebook or script for the timings.",
      "The RFC 7919 ffdhe2048 prime (copy it from the RFC) for the finite-field Diffie-Hellman step.",
      "Knowledge of the extended Euclidean algorithm, Miller-Rabin and square-and-multiply from the module.",
      "A write-up file for the timing comparison and the argument for curves."
    ],
    checkpoints:[
      "Extended Euclidean, modular inverse and square-and-multiply are implemented and verified against Python's pow(x, e, n) and pow(x, -1, n).",
      "Miller-Rabin generates two 1024-bit primes from secrets; a 2048-bit RSA key is built; a 32-byte key is encrypted and decrypted with OAEP from the library; textbook RSA (no padding) is shown to be malleable.",
      "Diffie-Hellman over ffdhe2048 produces a shared secret, and the same exchange with X25519 from the library produces another; both are timed and the key sizes compared.",
      "An AES-256-GCM key is derived from each shared secret with HKDF and used to send an authenticated message end to end."
    ],
    hints:[
      "Verify every primitive against the standard library before building on it: your square-and-multiply must match pow(base, exp, mod) exactly, or every later step inherits the bug.",
      "Textbook RSA malleability: because encryption is just modular exponentiation, multiplying two ciphertexts multiplies the plaintexts. Demonstrate it, then show OAEP padding breaks the relationship.",
      "Never use a raw Diffie-Hellman shared secret as a key; run it through HKDF to derive a uniform AES-256 key, then use AES-GCM so the message is authenticated as well as encrypted."
    ],
    trouble:[
      ["Miller-Rabin occasionally returns a composite","Too few rounds, or a bug in the witness loop","Use enough rounds (40 for 1024-bit) and cross-check candidates with sympy.isprime during development."],
      ["Your modular inverse disagrees with pow(x, -1, n)","A sign or reduction error in extended Euclidean","Reduce the result mod n at the end; test against many known pairs."],
      ["OAEP decryption fails","Mismatched hash or label between encrypt and decrypt","Use the same OAEP parameters (MGF1 and hash) on both sides."],
      ["X25519 and ffdhe2048 secrets are different lengths","They are; that is expected","Run both through HKDF to a fixed-length key; the raw secret sizes differ by design."],
      ["GCM decryption raises InvalidTag","Wrong key, nonce reuse, or tampered ciphertext","Confirm the derived key and the nonce match the encrypt side; never reuse a nonce with the same key."]
    ],
    challenge:"Measure the gap at a higher security level: add RSA-3072 and a 3072-bit finite-field DH, time key generation and a key agreement for each, and plot the cost against X25519. Then implement a tiny man-in-the-middle on your unauthenticated DH to show why raw key agreement needs signatures or a pre-shared identity, and note what X25519 alone does not give you.",
    reflect:[
      "Why did the field move from finite-field Diffie-Hellman to elliptic curves, and what do the timings and key sizes show?",
      "What makes textbook RSA malleable, and what exactly does OAEP add to stop it?",
      "Why must a shared secret pass through a KDF before it becomes a key, and what goes wrong if you skip that?"
    ],
    safety:"These implementations are for learning only; never use hand-rolled cryptography to protect real data. Use the vetted library for anything that matters."
  },
  "p25lab5":{
    time:"3–4 h",
    setup:[
      "Your own computer and your own browser, capturing only your own traffic. Wireshark (wireshark.org) installed.",
      "A site you own or your lab TLS server from Lab 3 as the capture target; optionally a TLS 1.2 server in your lab for comparison.",
      "The SSLKEYLOGFILE environment variable set for your own browser, and Wireshark's TLS preferences pointed at that file for decryption.",
      "openssl s_client for the side-by-side reconciliation; a notes file for the annotated screenshots."
    ],
    checkpoints:[
      "A capture filtered on tls.handshake shows the ClientHello with versions, cipher suites, SNI, ALPN, supported groups and key_share, and whether X25519MLKEM768 was offered.",
      "ServerHello is found with the selected group and cipher suite; the Certificate message is confirmed encrypted in TLS 1.3, and you count the readable handshake messages.",
      "With SSLKEYLOGFILE set and Wireshark pointed at it, your own session decrypts and the Certificate and Finished messages become readable.",
      "If a TLS 1.2 server is available, it is captured and compared for round trips and visible fields; openssl s_client output is reconciled with the capture.",
      "The report opens with the legal line that this is your own traffic on your own network, and closes with half a page on what an observer learns with and without ECH."
    ],
    hints:[
      "TLS 1.3 encrypts everything after ServerHello, including the certificate, so without the key log you will see only the ClientHello, ServerHello and some extensions in the clear.",
      "SSLKEYLOGFILE makes the browser write the session secrets to a file that Wireshark reads to decrypt your own traffic; this works only because it is your session and your secrets.",
      "Compare message counts to see the 1-RTT handshake of TLS 1.3 against the extra round trip of TLS 1.2; the SNI (and, with ECH, its absence) is the key privacy difference to note."
    ],
    trouble:[
      ["No TLS packets appear","Wrong capture interface, or the traffic used QUIC/HTTP3","Capture on the active interface and force the browser to TCP TLS (disable HTTP/3 for the test) if you want classic TLS."],
      ["Decryption does not work even with the key log","Wireshark is pointed at the wrong file, or the browser was not launched with the variable set","Set SSLKEYLOGFILE before launching the browser, confirm the file grows, and set the (Pre)-Master-Secret log filename in Wireshark TLS preferences."],
      ["The Certificate message is unreadable","That is correct for TLS 1.3 without the key log","Decrypt with the key log to read it; its being encrypted is the privacy improvement to note."],
      ["s_client output does not match the capture","Different cipher or group negotiated on separate connections","Pin the same options on s_client and compare the same connection; renegotiation can differ run to run."],
      ["X25519MLKEM768 is not offered","The browser or server is older, or PQC hybrids are disabled","Note what was offered instead; the presence or absence of the hybrid group is itself a finding."]
    ],
    challenge:"Capture the same site twice, once with Encrypted Client Hello (ECH) available and once without, and document exactly which fields move from cleartext into the encrypted ClientHello, especially the SNI. Then time the full handshake for TLS 1.3 versus 1.2 across several runs and quantify the round-trip saving.",
    reflect:[
      "In a TLS 1.3 handshake, what can a passive network observer still read, and what did TLS 1.3 move out of their view?",
      "What does ECH hide that plain TLS 1.3 does not, and why does the SNI matter for privacy?",
      "Why is capturing your own traffic lawful while capturing someone else's is not, and where is that line?"
    ],
    safety:"Capture only your own traffic on your own network. Capturing or decrypting other people's traffic without written authorization is unlawful; state that line at the top of your report."
  },
  "p25lab6":{
    time:"3–4 h",
    setup:[
      "Python 3.12+ with the argon2-cffi library and pytest in a virtual environment.",
      "A way to load a secret from the environment or a secret manager for the optional pepper (an environment variable is fine for the lab).",
      "Legacy hashes to migrate from: generate a few bcrypt and unsalted SHA-256 examples to practice the upgrade path.",
      "A Git repo for the module, its tests, the benchmark table and the one-page policy."
    ],
    checkpoints:[
      "The module wraps argon2-cffi with hash(password) returning the encoded string, verify(stored, candidate) in constant time, and needs_rehash(stored) for parameter upgrades.",
      "A benchmark table finds the Argon2id memory and time cost near 250 ms on your hardware and records the OWASP minimum (19 MiB, t=2, p=1) and the RFC 9106 option (64 MiB, t=3, p=4).",
      "An optional pepper HMACs the password with an env-loaded key before hashing, with documented rotation.",
      "A migration path upgrades legacy bcrypt or unsalted SHA-256 hashes transparently on the next successful login.",
      "Tests cover correct verify, wrong-password fail, tampered-hash fail, rehash after a parameter change, and indistinguishable timing of success and failure within noise."
    ],
    hints:[
      "Argon2id's encoded string already contains the salt and parameters, so verify and needs_rehash can read them back; you do not store salt separately.",
      "Tune parameters to your hardware: raise memory and time cost until a hash takes about 250 ms, which balances user experience against attacker cost. Record where OWASP and RFC 9106 sit relative to your number.",
      "The migration pattern: on login, detect the legacy hash format, verify against the old scheme, and if correct, re-hash with Argon2id and replace the stored value, so users upgrade silently one login at a time."
    ],
    trouble:[
      ["Hashing is far faster or slower than 250 ms","Memory or time cost not tuned to this machine","Sweep the parameters and pick the ones that land near 250 ms on your hardware; faster helps attackers."],
      ["verify leaks timing between right and wrong passwords","Early return or a non-constant comparison","Use the library's verify, which is constant-time; do not branch on intermediate results."],
      ["needs_rehash never returns True","It is comparing against the same parameters that produced the hash","Change the configured parameters, then check an old hash; it should report that a rehash is due."],
      ["The pepper breaks verification after rotation","Old hashes were made with the previous pepper","Version the pepper and keep old versions for verification until all users have rotated; document this."],
      ["Legacy migration double-hashes or fails","The format detection is wrong, or the old verify is skipped","Detect the stored format explicitly; verify against the matching old scheme before upgrading."]
    ],
    challenge:"Add a login throttle and account-lockout policy around the module and show, with a small simulation, how it changes the attacker's effective guess rate on top of the slow hash. Then write a migration dry-run that reports how many users are on each hash scheme and estimates how long a full transparent migration will take at your login volume.",
    reflect:[
      "Why is a deliberately slow hash the right tool for passwords when fast hashes are right everywhere else?",
      "What threat does the pepper address that the per-password salt does not, and why must it live outside the database?",
      "Why migrate legacy hashes on login rather than all at once, and what does that cost you in the meantime?"
    ],
    safety:"Handle real password hashes only for systems you own or are authorized to maintain; keep the pepper and any secret key out of the repository and out of logs."
  }
});
/* ---------- p26 IT Operations, Service Management & Career Launch ---------- */
Object.assign(window.LABX,{
  "p26lab1":{
    time:"3–4 h",
    setup:[
      "A ticketing system in your lab: osTicket in Docker (docs.docker.com) or Spiceworks Cloud Help Desk (free). Give it a few minutes to install.",
      "The Module 1 material: a 3x3 priority matrix (impact x urgency) and SLA targets to configure.",
      "The in-app ADA to role-play five users, one at a time.",
      "A timer and a notes file for your six-step work and your timings."
    ],
    checkpoints:[
      "The ticketing system is up with categories, a 3x3 priority matrix and SLA targets configured from Module 1.",
      "ADA role-plays five users ('internet down', 'printer won't print', 'locked out again', 'laptop slow since yesterday', 'phishing email I clicked'), answering only what you ask.",
      "For each ticket you open, triage and set priority with justification, run the six steps aloud, ask ADA for the result of each test, and either resolve or write an evidence-based escalation note.",
      "Each ticket is closed with cause, fix and verification and is timed; ADA grades your questions, priority calls and communication under stress, and you record three improvements."
    ],
    hints:[
      "Set priority from impact times urgency, not from how loud the user is; write the one-line justification so your call is defensible.",
      "The six steps keep you honest under pressure: identify the problem, theorize a cause, test the theory, plan and implement the fix, verify, and document. Say each aloud so ADA can grade your reasoning.",
      "When you cannot fix it, escalate with evidence: what you observed, what you tried, what you ruled out, and what you need next. An escalation without evidence just moves the ticket, not the problem."
    ],
    trouble:[
      ["osTicket container will not start or load","Port conflict or the database container is not ready","Check docker ps and logs; map a free host port and wait for the DB before the web app."],
      ["You set priority too high on everything","Reacting to tone instead of impact and urgency","Apply the matrix literally; a single stuck printer is rarely a high-impact incident."],
      ["You jump to a fix before diagnosing","Pattern-matching to a past ticket","Force yourself through test-the-theory before implementing; the phishing ticket especially rewards scoping first."],
      ["ADA gives vague answers","That is the point; real users do too","Ask narrower, test-shaped questions ('what is the exact error text?') rather than open ones."],
      ["The phishing ticket is handled as routine","Not recognizing it as a potential incident","Treat a clicked phishing link as a security event: contain first (disconnect, reset credentials), then investigate."]
    ],
    challenge:"Add SLA timers that actually count down and deliberately let one ticket breach, then write the customer-facing update you would send at the breach and the internal note explaining why. Run a sixth surprise ticket that is really two problems disguised as one, and show how your six-step method separates them.",
    reflect:[
      "Why set priority from impact and urgency rather than from how upset the user is, and when do those diverge?",
      "Which of the six steps do you most want to skip under pressure, and what goes wrong when you do?",
      "What made your best escalation note useful to the next tier, and what would have made it useless?"
    ]
  },
  "p26lab2":{
    time:"3–4 h",
    setup:[
      "A wiki in your lab: BookStack or Wiki.js in Docker, or an MkDocs site (mkdocs.org) served locally.",
      "The Module 4 style guide to write as the first page.",
      "Source material: Lab 1's tickets, a home-lab procedure, and a user-facing task to document.",
      "The in-app ADA to act as a new technician following your steps literally."
    ],
    checkpoints:[
      "The wiki is running and the Module 4 style guide is its first page.",
      "Three KB articles exist: one from Lab 1's tickets, one procedure (for example 'Join a Windows 11 VM to the lab domain'), and one user-facing article with no commands (for example 'Register your authenticator app').",
      "Each article has a search-phrase title, applies-to, symptoms, cause, numbered steps with expected results, verification, escalation, owner and review date, and redacted screenshots.",
      "ADA followed each article literally as a new technician, reported every ambiguity, and the ambiguities are fixed."
    ],
    hints:[
      "Write the title as the phrase a stressed technician would actually search at 2 a.m., not as a formal heading; findability is most of a KB's value.",
      "Every numbered step needs an expected result, so the reader knows whether it worked before moving on; a step without a checkpoint is where people get lost.",
      "The user-facing article uses no commands and no jargon; test it by having ADA follow it as a non-technical user and flag anything it cannot do from the words alone."
    ],
    trouble:[
      ["ADA gets stuck on a step","The step assumed knowledge or skipped a sub-step","Add the missing detail and an expected result; the ambiguity report is doing its job."],
      ["The article is hard to find later","Title is a formal heading, not a search phrase","Rename to the symptom or task phrase a user would type; add alternate terms in the body."],
      ["Screenshots leak hostnames or user data","Not redacted before upload","Blur or crop sensitive fields; keep a redaction checklist for every screenshot."],
      ["The procedure works for you but not ADA","You filled gaps from memory","Follow your own article on a fresh VM without improvising; fix every point you had to guess."],
      ["The wiki will not render Markdown","Wrong syntax or an unconfigured renderer","Check the platform's Markdown flavor; preview before publishing."]
    ],
    challenge:"Add a short 'related articles' and 'last verified' workflow: link the three articles to each other, set a review date, and define what triggers a re-verification (a product update, a failed follow). Then hand the procedure article to someone who has never seen your lab and time how long it takes them to complete it with no help from you.",
    reflect:[
      "Why is the search-phrase title often more valuable than the content itself?",
      "What does an 'expected result' after each step give the reader that the step alone does not?",
      "Which ambiguity ADA found would have cost the most time in a real 2 a.m. incident, and why did you miss it?"
    ]
  },
  "p26lab3":{
    time:"3–4 h",
    setup:[
      "A word processor that exports clean .docx and text-based PDF (not an image), plus a plain-text editor to check ATS parsing.",
      "Your raw material: every job, project, certificate, lab and ten field-work events with real numbers (miles, spans, customers, incidents, trainees).",
      "A real job posting to target, and a LinkedIn account.",
      "The in-app ADA to critique against the posting and as a recruiter searching."
    ],
    checkpoints:[
      "Raw material is collected with quantified field-work events.",
      "A one-column resume with Summary, Skills, Certifications (earned and scheduled), quantified Experience bullets, Projects and Education is saved as both .docx and a text-based PDF.",
      "ADA has reviewed the resume against a real posting for missing keywords, weak bullets, parsing risks and a 20-second first impression, and you revised twice.",
      "A LinkedIn profile is built (220-character headline, three-paragraph About, skills from postings, certifications linked, Featured with GitHub or blog, Open to Work set) and ADA has critiqued it as a recruiter searching 'help desk A+ Active Directory'."
    ],
    hints:[
      "One column, standard headings and a text-based PDF parse cleanly through applicant tracking systems; multi-column and graphics-heavy templates often scramble.",
      "Every experience bullet should be an action verb plus a quantified result; 'reduced truck rolls 18% by...' beats 'responsible for installations'. Your field numbers are your edge.",
      "Mirror the posting's keywords where they are true of you, so both the ATS and the human see the match; do not invent skills, but do name the ones you actually have in the posting's words."
    ],
    trouble:[
      ["The resume parses badly in plain text","Columns, tables or text boxes","Rebuild as a single column with simple headings; confirm by copying the PDF text into a plain editor."],
      ["Bullets read as duties, not achievements","No numbers or outcomes","Add a metric and a result to each; if you cannot quantify, describe the before and after."],
      ["ADA says the 20-second read misses the point","The summary buries the target role","Put the target role and strongest proof in the first two lines."],
      ["LinkedIn profile does not surface in searches","Headline and skills lack the posting's terms","Load the headline and skills with the exact phrases recruiters search; keep them truthful."],
      ["Certifications section looks thin","Scheduled exams not listed","List earned certs and scheduled ones with dates; a dated plan signals momentum."]
    ],
    challenge:"Tailor the resume to two different roles (a help desk role and a NOC or field-engineering role) from the same raw material, and show how the summary, the skills order and three bullets change for each. Then run both through a free ATS-style parser and compare how cleanly each is read, fixing whatever the parser drops.",
    reflect:[
      "Why does quantifying a bullet change how a recruiter reads it, and which of your field numbers is most persuasive?",
      "What parsing choices make a resume ATS-friendly, and why do fancy templates backfire?",
      "How should the same experience be framed differently for two different target roles without misrepresenting it?"
    ]
  },
  "p26lab4":{
    time:"3–4 h",
    setup:[
      "The in-app ADA to run a 30-minute interview from a target job posting.",
      "A way to record yourself: your phone's audio or video recorder is enough.",
      "A quiet room, the posting, and no notes during the answers.",
      "The Module 6 question table and the STAR structure in mind for the review afterward."
    ],
    checkpoints:[
      "ADA ran a 30-minute interview: five technical questions from Module 6, three STAR behavioral questions, one 'what would you do if you did not know', and one salary-expectation question.",
      "You recorded yourself answering aloud without notes, thinking aloud on the technical questions.",
      "ADA scored each answer for correctness, structure, length and confidence and identified the STAR story with the weakest Result.",
      "The weak story is rewritten with numbers, the three worst answers are redone, and the before and after are compared."
    ],
    hints:[
      "Think aloud on technical questions; interviewers score your reasoning, not just the final answer, and silence reads as being stuck.",
      "STAR keeps behavioral answers tight: Situation and Task briefly, most of the time on Action, and a quantified Result. A weak Result is the most common failure, so lead the rewrite there.",
      "For the 'if you did not know' question, show your method: what you would check first, who or what you would consult, and how you would verify, rather than bluffing an answer."
    ],
    trouble:[
      ["Answers ramble and run long","No structure, so you keep adding","Use STAR for behavioral and a clear claim-then-reason shape for technical; aim for about 90 seconds."],
      ["Technical answers are right but sound unsure","Not thinking aloud, or hedging","Narrate your reasoning and commit to a best answer while noting assumptions."],
      ["The STAR Result is vague","No metric captured at the time","Reconstruct a plausible, honest number (time saved, tickets closed, uptime) and state how you would measure it."],
      ["The salary answer is a single number blurted out","No range or basis","Give a researched range with a basis and signal flexibility; practice it to two calm sentences."],
      ["Watching the recording is uncomfortable","Normal; it is also the most useful data","Note filler words, pace and eye contact once, then focus on fixing the top two."]
    ],
    challenge:"Run a second interview a day later with ADA raising the difficulty (a follow-up that challenges each answer, as a real panel does), record it, and measure whether your structure and length improved. Build a one-page bank of six polished STAR stories mapped to the competencies the posting names, so any behavioral question maps to one.",
    reflect:[
      "What did the recording show that you did not feel while answering, and why is that gap useful?",
      "Why does thinking aloud help on a technical question even when you reach the wrong answer?",
      "Which STAR story is your strongest, and what made its Result land where the weak one did not?"
    ]
  },
  "p26lab5":{
    time:"2–3 h",
    setup:[
      "The Module 5 certification ladder and the current exam codes, with US prices verified from the vendor sites on the day you plan.",
      "Your real weekly study hours from the Module 7 schedule.",
      "A calendar tool (table, spreadsheet or image) and a budget table.",
      "The in-app ADA to stress-test the plan for a lost month."
    ],
    checkpoints:[
      "The next 12 months of ladder rungs are listed with current exam codes and vendor-verified US prices.",
      "Study hours per cert are estimated (A+ about 80-120, Network+ 60-100, Security+ 60-100 for someone who has done the earlier domains) and mapped onto your real weekly hours.",
      "Exam dates are on a calendar with two-week buffers, renewal dates and CEU plans are added, and the Security+ V7 to V8 transition on 17 Nov 2026 is accounted for if it affects you.",
      "A budget covers exam fees, one retake bundle, books and lab hardware, with employer-reimbursable items marked; ADA has stress-tested the plan for a lost month and a fallback exists."
    ],
    hints:[
      "Verify prices and exam codes on the vendor site the day you plan; they change, so do not trust a number from memory or an old article.",
      "Map study hours onto the hours you actually have, not the hours you wish you had; a plan built on optimistic time is the one that slips.",
      "Build the buffer in from the start: a two-week margin before each exam absorbs a bad week without toppling the next rung. Note the Security+ version transition date so you register for the right version."
    ],
    trouble:[
      ["The plan assumes more hours than you have","Optimistic weekly estimate","Use your logged real hours; if the math does not fit 12 months, extend the timeline rather than overpromising."],
      ["Exam prices in the plan are wrong","Used a remembered or outdated figure","Re-check each vendor page the day you finalize; prices and bundles shift."],
      ["No slack when life interrupts","Back-to-back exams with no buffer","Add two-week buffers and a named fallback for a lost month."],
      ["Renewal dates missed","Only new certs were scheduled","Add CEU and renewal dates for anything already held so a cert does not lapse."],
      ["The Security+ version catches you out","Registered for the wrong version around the transition","Check the 17 Nov 2026 V7 to V8 date and register for the version you will actually sit."]
    ],
    challenge:"Build two versions of the plan: an aggressive one and a realistic one, and write the decision rule for when to drop from aggressive to realistic (a missed buffer, a failed exam). Then compute the total cost including one failed attempt and a retake, and identify which single expense an employer is most likely to reimburse and how you would ask.",
    reflect:[
      "Why verify prices and codes the day you plan rather than trusting a source, and what has changed recently in the ladder?",
      "What happens to the whole plan if one exam slips, and how does the buffer contain that?",
      "Which certification gives you the most career leverage per study hour, and why?"
    ]
  },
  "p26lab6":{
    time:"three sessions of 2–3 h",
    setup:[
      "A host with enough RAM for several VMs (do the arithmetic first); a hypervisor (Hyper-V, Proxmox or VirtualBox).",
      "Evaluation ISOs: Windows Server and Windows 11; pfSense or OPNsense; Ubuntu Server. Docker on the Ubuntu VM for the wiki and ticketing system from earlier labs.",
      "A GitHub account and git, with an SSH key set up; diagrams.net or Mermaid for the layer-3 diagram.",
      "A dated build-log file from the first entry; a .gitignore so no secrets are committed."
    ],
    checkpoints:[
      "The RAM arithmetic and hypervisor choice are the first build-log entry.",
      "Stage 1: a Windows Server evaluation domain controller plus a joined Windows 11 client, with users, groups and one GPO. Stage 2: a pfSense or OPNsense VM with a lab VLAN. Stage 3: an Ubuntu server with Docker running your wiki and ticketing system.",
      "A dated build log records goal, steps, what broke, the fix, what you learned and time spent for each stage, with a layer-3 diagram in diagrams.net or Mermaid.",
      "The log and diagram are published as a GitHub repository with a README, no secrets and a .gitignore in place, and one blog post is written from it."
    ],
    hints:[
      "Do the RAM budget before building: sum each VM's assigned memory plus headroom for the host, so you do not discover the shortfall mid-build.",
      "Write the log as you go, not from memory afterward; the 'what broke and how I fixed it' entries are the most valuable part for your GitHub and for future-you.",
      "Keep secrets out of the repo from the first commit with a .gitignore; a credential pushed once lives in the history even after you delete it."
    ],
    trouble:[
      ["The host runs out of RAM","VMs over-allocated or no host headroom","Right-size each VM, use dynamic memory where supported, and leave the host a few GB."],
      ["The client cannot reach the internet through pfSense","WAN/LAN interfaces swapped or the VLAN is misconfigured","Confirm which virtual NIC is WAN and which is LAN; check the VLAN tag and the firewall rules."],
      ["Docker containers do not survive a reboot","No restart policy set","Add restart: unless-stopped in compose so the wiki and ticketing come back automatically."],
      ["A secret was committed",".gitignore added too late","Rotate the secret, remove it from history, and confirm .gitignore now covers it; treat the old value as exposed."],
      ["The domain join fails","DNS on the client points away from the DC","Point the client's DNS at the domain controller, as in the Windows phase."]
    ],
    challenge:"Add a monitoring stage: put a small Prometheus and Grafana or an Uptime Kuma container on the Ubuntu VM watching the DC, the firewall and the services, and add its dashboard to the build log. Then write a one-page 'rebuild from scratch' runbook from your log and test it by tearing down and rebuilding Stage 3 against the runbook alone.",
    reflect:[
      "Why is the 'what broke and how I fixed it' log more valuable to a future employer than a clean final diagram?",
      "What did building the network tier (pfSense, VLAN) teach you that the Windows phase alone did not?",
      "Why does a committed secret stay dangerous even after you delete the file, and what does that teach about Git history?"
    ]
  }
});
