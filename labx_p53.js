/* Lab guides — Domain 53: Trusted Computing & Hardware Security Engineering */
window.LABX=window.LABX||{};
Object.assign(window.LABX,{
  "p53lab1":{
    time:"60–90 min",
    setup:[
      "Every computer you own and can administer: a Windows 11 PC with an administrator account and/or a Linux machine with sudo. Your own hardware only — never a work or customer machine without written permission.",
      "Linux packages: sudo apt install tpm2-tools mokutil fwupd (Debian/Ubuntu) or sudo dnf install tpm2-tools mokutil fwupd (Fedora). Windows needs nothing extra: msinfo32, PowerShell run as administrator and tpm.msc are built in.",
      "A spreadsheet or Markdown table prepared before you start, one row per machine, with the columns from step 5.",
      "This lab is read-only. If BitLocker or LUKS is on, locate your recovery key now (aka.ms/myrecoverykey for a Microsoft account) so it is ready before any later lab touches firmware."
    ],
    checkpoints:[
      "msinfo32's System Summary shows BIOS Mode 'UEFI', Secure Boot State 'On' or 'Off', a PCR7 Configuration line ('Bound' or 'Binding Not Possible') and a Kernel DMA Protection line; Get-Tpm shows TpmPresent True and TpmReady True; Confirm-SecureBootUEFI prints True or False (an error means legacy BIOS mode).",
      "Both Get-SecureBootUEFI checks print True or False: db contains 'Windows UEFI CA 2023' (True is good) and PK contains 'DO NOT TRUST' or 'DO NOT SHIP' (False is good). tpm.msc shows a manufacturer (for example INTC, AMD, IFX, NTC or MSFT) and Specification Version 2.0.",
      "mokutil --sb-state prints 'SecureBoot enabled' or 'disabled'; tpm_version_major contains 2; tpm2_getcap properties-fixed lists TPM2_PT_MANUFACTURER and TPM2_PT_FIRMWARE_VERSION_1 with values; /sys/kernel/security/lockdown shows the active mode in brackets, such as 'none [integrity] confidentiality'.",
      "Every file under /sys/devices/system/cpu/vulnerabilities prints one line starting 'Not affected', 'Mitigation:' or 'Vulnerable'; fwupdmgr security prints an HSI rating such as HSI:2 followed by passed and failed attributes.",
      "The table has one complete row per machine with no blank cells (write 'n/a' plus a reason), and every red cell has a proposed fix and a one-line risk note."
    ],
    hints:[
      "Read each value as a statement about a trust boundary: Secure Boot is about what may run, the TPM about what can be measured and sealed, DMA protection about devices, and the 2023 CA about whether the machine can still receive boot-level fixes.",
      "On Windows the Secure Boot variables come back as byte arrays. Convert them with [System.Text.Encoding]::ASCII.GetString((Get-SecureBootUEFI db).bytes) and then use -match. On Linux, bootctl status and mokutil read the same UEFI variables.",
      "Typical red items and fixes: Secure Boot off → enable it in firmware setup after confirming your bootloader is signed; 2023 CA missing → OEM UEFI update, then Microsoft's Secure Boot update; PK is a test key → OEM firmware update or vendor contact; 'Vulnerable' mitigation lines → microcode or OEM firmware update, then reboot."
    ],
    trouble:[
      ["Confirm-SecureBootUEFI: 'Cmdlet not supported on this platform'","The PC boots in legacy BIOS/CSM mode, so there are no UEFI variables","Check BIOS Mode in msinfo32. Converting to UEFI needs MBR2GPT and a firmware change: plan it with a backup, and do not attempt it in this read-only lab."],
      ["Get-Tpm shows TpmPresent False on a modern PC","The firmware TPM (Intel PTT or AMD fTPM) is disabled in firmware setup, common on self-built PCs","Enable PTT or fTPM in the firmware's security menu, boot, and rerun Get-Tpm."],
      ["tpm2_getcap: 'Failed to open specified TCTI device file /dev/tpmrm0: Permission denied'","Your user is not in the tss group, or you forgot sudo","Use sudo, or add yourself to the tss group (sudo usermod -aG tss $USER) and log in again. If /dev/tpm0 does not exist at all, check dmesg | grep -i tpm and the firmware TPM setting."],
      ["fwupdmgr security is an unknown command or shows no HSI line","An old fwupd version, or a virtual machine where HSI is not computed","Diagnostic habit: check the tool version first (fwupdmgr --version) before blaming the hardware. Update fwupd, and in VMs record 'n/a (virtual)' rather than guessing."]
    ],
    challenge:"Turn steps 1–4 into one script per operating system (PowerShell and Bash) that prints a single CSV row per machine with every column of your table, then run it against all your machines from one place — PowerShell remoting for Windows, SSH or Ansible for Linux. Add a 'checked at' timestamp, run it again a week later, and explain every value that changed.",
    reflect:[
      "Your PC shows Secure Boot on but no Windows UEFI CA 2023 in db. Explain precisely what protection it has today and what it will fail to receive in future.",
      "Why does a firmware TPM remove the bus-sniffing path a discrete TPM has, and what new dependency does it introduce?",
      "Which of your red items would an attacker with 30 minutes alone with the machine use first, and which control closes it?"
    ],
    safety:"Read-only lab on machines you own. Do not change firmware settings, clear the TPM or toggle Secure Boot on a daily machine: clearing the TPM destroys sealed keys and can lock you out of BitLocker or LUKS volumes."
  },
  "p53lab2":{
    time:"90–120 min",
    setup:[
      "A Linux machine with TPM 2.0 and UEFI boot — physical, or the Lab 3 VM, which is ideal for step 5. Install tools: sudo apt install tpm2-tools python3-yaml efibootmgr (or the dnf equivalents).",
      "Python 3.10 or newer with PyYAML, a text editor, and a working folder for pcr-before.txt, eventlog.yaml and your script.",
      "For step 5 use the VM and take a snapshot first, so reordering boot entries cannot strand you.",
      "The firmware log is /sys/kernel/security/tpm0/binary_bios_measurements and is readable only by root. If /sys/kernel/security is empty, mount it: sudo mount -t securityfs securityfs /sys/kernel/security."
    ],
    checkpoints:[
      "pcr-before.txt contains sha256 values for PCRs 0–5 and 7, each 64 hex digits, and PCR 7 is not all zeros on a UEFI machine.",
      "eventlog.yaml exists; searching it for EV_EFI_VARIABLE_DRIVER_CONFIG finds entries for SecureBoot, PK, KEK, db and dbx under PCRIndex 7, and PCR 4 has EV_EFI_BOOT_SERVICES_APPLICATION entries for shim or your bootloader.",
      "Your script prints one 64-hex-digit value for each PCR that appears in the log.",
      "For every PCR your replay equals the tpm2_pcrread value and the pcrs summary at the end of the tpm2_eventlog output — or you have written down which one differs and why.",
      "After reordering boot entries and rebooting, PCR 1 differs from pcr-before.txt while PCRs 0 and 7 are unchanged, and you can point to the EV_EFI_VARIABLE_BOOT event for BootOrder whose digest changed."
    ],
    hints:[
      "The event log is a list of (PCR, digest) pairs in order. If you can extend a 32-byte buffer yourself, you have reproduced what the TPM did; the only rules are to use the same bank (SHA-256) and exactly the logged order.",
      "In the tpm2_eventlog YAML each event has PCRIndex, EventType and Digests (a list of AlgorithmId and Digest). Do not extend EV_NO_ACTION events — they are informational — but read the StartupLocality one: if it says locality 3, PCR 0 starts from 31 zero bytes followed by 0x03.",
      "The core of the replay: pcr = bytes(32) (or the locality start value), then for each event of that PCR, pcr = hashlib.sha256(pcr + bytes.fromhex(digest)).digest(). Compare pcr.hex() with tpm2_pcrread sha256:N."
    ],
    trouble:[
      ["'Permission denied' reading binary_bios_measurements","The file is readable only by root","Run tpm2_eventlog with sudo, or sudo cp the file into your folder and chown it before parsing."],
      ["The PCR 0 replay differs but every other PCR matches","The log has a StartupLocality event, so PCR 0 did not start from all zeros","Find the EV_NO_ACTION StartupLocality event, start PCR 0 from 31 zero bytes plus the locality byte, and replay again."],
      ["Every replay differs","SHA-1 digests are being extended into a SHA-256 replay (or the reverse), or the Digests list is read in the wrong order","Print AlgorithmId for each digest and select sha256 explicitly. Diagnostic habit: replay one PCR with three events by hand first, then automate."],
      ["tpm2_eventlog cannot parse the file, or the listing is empty on a VM","The VM boots with SeaBIOS instead of OVMF/UEFI","Recreate the VM with UEFI (OVMF) firmware and a TPM 2.0 device; legacy BIOS logs use a different format."]
    ],
    challenge:"Extend the script into a mini verifier: save the replayed PCRs and the list of (PCR, event type, description, digest) as a JSON baseline, then after any reboot compare the new log with the baseline and print exactly which events were added, removed or changed. Use it to explain a real change — a kernel, shim or firmware update — and decide, as a verifier would, whether to accept it.",
    reflect:[
      "The TPM does not protect the event log. Why does a matching replay still let you trust it, and what would an attacker have to do to fake a log that matches?",
      "Why does reordering boot entries change PCR 1 but not PCR 7, and what does that teach you about choosing PCRs for sealing?",
      "If a measured component lied about what it measured, which earlier component would be responsible for catching it — and why does that make the root of trust decisive?"
    ]
  },
  "p53lab3":{
    time:"two sessions of 2 h",
    setup:[
      "A Linux host with hardware virtualization enabled (grep -cE 'vmx|svm' /proc/cpuinfo returns more than 0) and about 30 GB free. If your only machine runs Windows 11 Pro, a Hyper-V Generation 2 VM with Secure Boot and 'Enable Trusted Platform Module' gives an equivalent virtual TPM for steps 2–6.",
      "Install on the host: sudo apt install qemu-system-x86 qemu-utils libvirt-daemon-system virt-manager ovmf swtpm swtpm-tools, then sudo usermod -aG libvirt $USER and log in again.",
      "An Ubuntu 24.04 LTS or Fedora installer ISO from ubuntu.com or fedoraproject.org.",
      "In virt-manager: New VM, tick 'Customize configuration before install', set Firmware to a UEFI option with secure boot (an OVMF_CODE secboot file), then Add Hardware > TPM > Emulated, model CRB, version 2.0. Install the OS and take a snapshot named clean."
    ],
    checkpoints:[
      "The VM boots, mokutil --sb-state inside it prints 'SecureBoot enabled', and a snapshot named clean is listed in virt-manager.",
      "ls -l /dev/tpmrm0 shows the device, and tpm2_pcrread sha256:7,16 prints a non-zero PCR 7 and an all-zero PCR 16.",
      "prim.ctx, pcr.policy, seal.pub, seal.priv and seal.ctx exist, and tpm2_create printed the new object's attributes without an error.",
      "cmp secret.bin out.bin prints nothing (identical files); after tpm2_pcrextend 16, tpm2_unseal fails with a policy error (TPM_RC_POLICY_FAIL, code 0x99d); after tpm2_pcrreset 16 the unseal succeeds again.",
      "cryptsetup luksDump shows a Tokens section with a systemd-tpm2 token listing PCR 7 and a separate systemd-recovery token; systemd-cryptsetup attach unlocks without a passphrase and the mapped device appears in lsblk.",
      "With Secure Boot disabled in the VM firmware, the TPM token no longer unlocks (systemd-cryptsetup falls back to a prompt), the recovery key does unlock, and after re-enabling Secure Boot or reverting the snapshot the TPM unlock works again."
    ],
    hints:[
      "Think of the sealed object as a box whose combination is 'PCR 16 equals what it was when I sealed it'. Anything that changes PCR 16 changes the combination; resetting PCR 16 restores it. PCR 16 is the debug PCR, which is why software may reset it.",
      "The policy digest is computed from the PCR values you read with tpm2_pcrread -o. At unseal time the session recomputes the policy from the current PCRs, which is what -p pcr:sha256:16 asks for. For the disk, systemd-cryptenroll builds the same kind of policy over PCR 7.",
      "Key commands: tpm2_pcrextend 16:sha256=$(printf '%064d' 1) changes PCR 16; tpm2_pcrreset 16 clears it. Test volume: truncate -s 512M test.img; sudo losetup -fP --show test.img; sudo cryptsetup luksFormat --type luks2 /dev/loopN; then systemd-cryptenroll with --recovery-key and with --tpm2-device=auto --tpm2-pcrs=7 on /dev/loopN; unlock with sudo systemd-cryptsetup attach testvol /dev/loopN - tpm2-device=auto."
    ],
    trouble:[
      ["virt-manager reports no firmware with secure boot support, or offers no TPM device","ovmf or swtpm packages are missing, or libvirtd was not restarted after installing them","Install ovmf, swtpm and swtpm-tools, run sudo systemctl restart libvirtd, and reopen virt-manager."],
      ["tpm2_unseal fails with ErrorCode 0x0000099d even before you extend","PCR 16 was not zero when you built the policy, or you sealed against a different bank","Run tpm2_pcrread sha256:16 before sealing and before unsealing; reset PCR 16 and recreate the policy and object with the sha256 bank."],
      ["Unseal still succeeds after the extend","tpm2_create ran without -L pcr.policy, so the object has no PCR policy","Inspect the object with tpm2_print -t TPM2B_PUBLIC seal.pub and look for a non-empty authPolicy; recreate it with -L pcr.policy."],
      ["systemd-cryptenroll says TPM2 support is not available, or the token never unlocks","An old systemd, missing tpm2-tss libraries, or unlocking with plain cryptsetup without the systemd token plugin","Diagnostic habit: confirm the token exists with cryptsetup luksDump before debugging the unlock. Use systemd 252 or newer, install the tpm2-tss libraries, and unlock with systemd-cryptsetup attach."],
      ["After changing Secure Boot the VM no longer boots","The change also altered the boot order or another firmware setting","Revert to the clean snapshot — that is exactly why you took it — and change only the Secure Boot option next time."]
    ],
    challenge:"Replace the PCR 16 policy with a signed policy: create an RSA key pair, use tpm2_policyauthorize so the sealed object accepts any PCR policy signed by your key, then deliberately change PCR 16 and authorize the new value with a fresh signature — this is how vendors ship updates without re-sealing everyone's data. Alternatively, create an EK and AK (tpm2_createek, tpm2_createak), quote PCRs 0–7 with a random nonce (tpm2_quote), verify it with tpm2_checkquote, and show that a stale nonce fails verification.",
    reflect:[
      "Why is PCR 7 a better default for disk unlock than PCR 0, and which attack does that choice leave to Secure Boot to stop?",
      "A sealed object holds at most 128 bytes. Why is that no obstacle to encrypting a whole disk?",
      "What would change if the VM's vTPM state directory were copied to another host together with the disk image, and how should a production platform prevent it?"
    ],
    safety:"Do all of this inside the VM. Never clear the TPM, wipe key slots or toggle Secure Boot on your daily machine during this lab. Keep the recovery key printed by systemd-cryptenroll and the clean snapshot until you finish."
  },
  "p53lab4":{
    time:"2–3 h",
    setup:[
      "Linux (native gives cleaner timings than WSL2) with gcc or clang, make, binutils (objdump) and your distribution's linux-tools or kernel-tools package for cpupower.",
      "Python 3 in a virtual environment: python3 -m venv ct && . ct/bin/activate && pip install numpy scipy matplotlib.",
      "A quiet machine: close browsers and games, plug in the laptop, and if firmware allows, disable turbo for the session, because frequency changes add noise.",
      "Optional for step 5: dudect from its GitHub repository (oreparaz/dudect). This lab measures comparison functions you wrote, on your own machine; it never targets a service or another person's system."
    ],
    checkpoints:[
      "Both functions compile with -O2 -Wall without warnings, and a unit test confirms each returns 1 for equal buffers and 0 for a single-byte difference at every one of the 32 positions.",
      "taskset -p shows the process bound to one CPU, cpupower frequency-info reports the performance governor, and timings.csv has 800,000 rows (2 functions × 2 classes × 200,000) with function, class and nanosecond columns.",
      "The notebook prints Welch's t for each function: leaky_equal far above 4.5 in absolute value, ct_equal below 4.5; the histograms show two separated peaks for leaky_equal and overlapping peaks for ct_equal.",
      "objdump shows leaky_equal with a conditional jump that depends on the compared bytes inside the loop, and ct_equal with xor/or operations and no data-dependent exit; in Python, == shows a larger t than hmac.compare_digest at the same sample size.",
      "If you ran dudect, after 10 million or more measurements its maximum t stays below its threshold and it reports that the function may be constant time."
    ],
    hints:[
      "The experiment compares two input classes that differ only in the secret-dependent property you care about (how many leading bytes match). Everything else — buffer addresses, cache warmth, order — must be identical or randomized between classes, or you will measure your harness instead of your function.",
      "Interleave the classes randomly in one loop instead of timing all of class A and then all of class B, and keep the compiler from deleting or hoisting the calls (noinline functions, a volatile result sink). clock_gettime costs more than a 32-byte compare, so time a batch of, say, 64 calls per sample.",
      "scipy.stats.ttest_ind(a, b, equal_var=False) gives Welch's t. Trim the top 1% of each class by a rule fixed before you look at the data. For the assembly: objdump -d -M intel --no-show-raw-insn ./ct | less, then search for the two function names."
    ],
    trouble:[
      ["Both functions show |t| far above 4.5","The harness leaks: classes timed in separate blocks, different buffer addresses per class, or a frequency change between blocks","Interleave classes randomly with the same buffers, warm up first, set the performance governor, and check that the harness gives a small t for ct_equal alone."],
      ["Both functions show t near zero and tiny timings","The compiler optimized the calls away or hoisted them out of the loop, so nothing was timed","Inspect the assembly for the calls; mark the functions __attribute__((noinline)) and store results into a volatile variable."],
      ["cpupower: command not found","The tools package for your running kernel is not installed","Install linux-tools-common and linux-tools-$(uname -r) on Ubuntu or kernel-tools on Fedora. Under WSL2 you cannot set the governor; record it as a limitation."],
      ["Results swing wildly between runs","Background load, thermal throttling or activity on the SMT sibling","Diagnostic habit: measure the noise floor first by timing an empty function. Then run idle, plugged in, pinned to a core whose sibling is idle, and report the median and spread of three runs."]
    ],
    challenge:"Break your own function on purpose: build ct_equal with gcc and clang at -O2 and -O3, add a variant with a deliberate secret-dependent early return, and show that your test flags that variant and none of the others. Then port the experiment to a second language you use — Java's MessageDigest.isEqual or Go's subtle.ConstantTimeCompare — and compare t-values at the same sample size.",
    reflect:[
      "Your result shows t = 1.2 for ct_equal. What does that prove, and what does it not prove about other machines, compilers and frequency behavior?",
      "Why does timing a batch of 64 calls per sample improve the experiment, and what kind of leak could batching hide?",
      "Hertzbleed showed that power can become timing through frequency scaling. How would you design an experiment to check whether that affects your function?"
    ]
  },
  "p53lab5":{
    time:"2–3 h",
    setup:[
      "A project you own — a Git repository from Domain 4 or Domain 19, or a container image you built — plus the computer you use every day.",
      "Syft and Grype from Anchore's GitHub releases or official install script (read the script before running it and pin a version), and jq for reading JSON.",
      "Linux: sudo apt install fwupd dmidecode smartmontools nvme-cli. Windows: PowerShell as administrator and your motherboard or laptop vendor's support page for your exact model.",
      "Optional: cyclonedx-cli from the CycloneDX GitHub releases, or Python with the jsonschema package and the CycloneDX JSON schema from cyclonedx.org, for step 4."
    ],
    checkpoints:[
      "app.cdx.json and app.spdx.json exist; jq '.components | length' app.cdx.json prints a number above zero, and the SPDX file lists packages with versions and package URLs (purls).",
      "grype prints a findings table (or 'No vulnerabilities found'); your VEX table has five rows, each with CVE, component, status (affected, not_affected, fixed or under_investigation) and a one-line justification.",
      "Your inventory lists at least the system firmware vendor, version and date; the GPU VBIOS version; the SSD model and firmware revision; and for each, whether fwupdmgr get-updates or the vendor page shows a newer version.",
      "firmware.cdx.json validates without errors and contains one component per device with \"type\": \"firmware\", a name, a version and a supplier.",
      "The plan names where each signing key lives, the security-version policy, ring sizes with the 1 − (1 − p)^n arithmetic, a halt rule, the recovery path, a security.txt contact and the 24-hour, 72-hour and 14-day reporting timeline, each tagged protect, detect or recover."
    ],
    hints:[
      "An SBOM answers 'what is in it?' and VEX answers 'does this vulnerability matter here?'. Build the full inventory before fixing anything, so you can see the whole picture.",
      "Authoritative firmware versions come from the devices: fwupdmgr get-devices shows each device's version and GUID; dmidecode -t bios gives the system firmware; nvidia-smi -q and nvme id-ctrl give GPU and SSD firmware. CycloneDX's component type firmware is the slot for each.",
      "Write the plan from the device's point of view first — what it checks before installing (signature, SVN, power), where it writes (the inactive slot), how it decides it is healthy, how it gets back if not — then add the server side: keys in an HSM or hardware token, rings of 1% and 10% with the probability arithmetic, and who must be told, by when."
    ],
    trouble:[
      ["Syft produces an SBOM with almost no components","It scanned a folder without lock files, or the wrong path","Point it at the repository root that holds the lock files (package-lock.json, poetry.lock, go.sum) or at the built image, and run with -v to see which catalogers ran."],
      ["Grype reports hundreds of findings, mostly in base-image packages","The container base image is large or out of date","Rebuild on a slim, current base image, then triage only what remains; record not_affected with a justification such as vulnerable_code_not_in_execute_path."],
      ["fwupdmgr get-devices lists nothing for your motherboard","Your vendor does not publish to LVFS, or capsule updates are disabled in firmware","Record the version from dmidecode, check the vendor's support page, and enable UEFI capsule updates only if the vendor documents it."],
      ["Schema validation fails with 'Additional properties are not allowed'","A typo, or a field at the wrong level — for example supplier given as a string instead of an object","Diagnostic habit: validate after each component you add rather than at the end. Compare with an example from the CycloneDX specification; supplier is an object such as {\"name\": \"Vendor\"}."]
    ],
    challenge:"Automate it: make CI regenerate the software SBOM on every commit, fail the build when a new critical finding appears without a VEX statement, and store the SBOM as a signed build artifact (cosign or GPG). Then design the firmware equivalent for a hypothetical product with 4,000 devices — ring sizes, a halt rule, and the probability that each ring detects a 0.5% brick rate — and compare it with your PC vendor's real update practice.",
    reflect:[
      "When LogoFAIL was announced, why could an OEM with firmware SBOMs say which models were affected in minutes while others took weeks?",
      "Signing proves who produced an update. Name two failures a signed update can still cause and the controls in your plan that catch each.",
      "Which parts of your plan are protect, detect and recover in NIST SP 800-193 terms, and which of the three is weakest for your own PC?"
    ],
    safety:"This lab inventories firmware; it does not require installing any. If you do apply a firmware update, keep the machine on mains power, suspend BitLocker for one reboot or have the LUKS recovery key at hand, and never interrupt the update."
  }
});
