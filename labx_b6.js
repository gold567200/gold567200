/* Lab guides — batch 6 (p10, p32, p47). Every exercise is scoped to your own hardware, your own network, yourself, fictional organisations, sanctioned challenge sets or public documents. */
window.LABX=window.LABX||{};

/* p10 Wireless, Pi & Hardware: build on your own hardware, survey your own network, receive-only radio */
Object.assign(window.LABX,{
  "p10lab1":{
    time:"two sessions of 2–3 h",
    setup:[
      "Hardware: a Raspberry Pi 4 or 5 (2 GB RAM is plenty for Pi-hole or a file server), the matching official USB-C supply (Pi 5: 27 W, 5.1 V 5 A; Pi 4: 15 W, 5.1 V 3 A), a 16–32 GB microSD card from a known brand, a case with a heatsink or the Pi 5 Active Cooler, and an Ethernet cable to your router if you can (DNS and file serving are better wired).",
      "On your laptop: Raspberry Pi Imager from raspberrypi.com/software, and an SSH key (`ssh-keygen -t ed25519` if `~/.ssh/id_ed25519.pub` does not exist yet). Choose Raspberry Pi OS Lite (64-bit) for a headless server, so no desktop wastes RAM.",
      "Router access: you need the DHCP client list to find the Pi and a DHCP reservation so its address never changes. Screenshot the router's current DNS and DHCP pages before you touch anything; that is your rollback plan.",
      "Pick one starter and open its official docs: Pi-hole (docs.pi-hole.net), a Samba file server (the file-sharing section of the Raspberry Pi documentation), or RetroPie (retropie.org.uk; check its supported-models list for your Pi, and use only games you legally own)."
    ],
    checkpoints:[
      "Your notes name the starter, why you chose it, and what 'done' means as one testable sentence (Pi-hole: 'a client using the Pi for DNS gets 0.0.0.0 for a blocklisted domain'; Samba: 'my laptop mounts the share and copies a 1 GB file').",
      "Imager finished with 'Write Successful'; the Pi appears in the router's DHCP list; `ssh you@hostname.local` (or the IP) logs in with your key and no password prompt; `cat /etc/os-release` shows Raspberry Pi OS and `uname -m` prints aarch64.",
      "The service survives `sudo reboot` with no manual steps: `systemctl status <service>` shows active (running); for Pi-hole, `pihole status` reports blocking enabled, `pihole -q <domain>` finds a domain on a blocklist and `dig @<pi-ip> <that domain>` returns 0.0.0.0. `vcgencmd get_throttled` prints throttled=0x0.",
      "Your setup notes are reproducible: every command in order, every file you edited and the change, the reserved IP, how to back up the configuration and how to roll back. Someone else could rebuild the box from them.",
      "Your upgrade explanation is correct for each item: RAM is soldered (you change model, not modules); an SSD attaches over USB 3 or, on a Pi 5, the PCIe M.2 HAT+; cooling matters when `vcgencmd measure_temp` approaches 80 C under load; a HAT adds a function through the 40-pin header and may need a dtoverlay line in config.txt."
    ],
    hints:[
      "Do the boring parts first: a fixed address, key-based SSH, updates. Every starter breaks the same way if the Pi's IP changes or you lock yourself out, so solve those before installing anything.",
      "In Imager's OS customisation settings, set the hostname, your username and password, the Wi-Fi country, and enable SSH with public-key authentication only, pasting your .pub key. Then reserve the Pi's address in the router instead of hard-coding a static IP on the Pi: one source of truth is easier to debug.",
      "For Pi-hole, test on one device before the whole house: set your laptop's DNS by hand to the Pi's IP, run `dig example.com`, then a blocklisted domain, and only then change the router's DHCP DNS setting. The admin password on Pi-hole v6 is set with `pihole setpassword` (v5 used `pihole -a -p`). For Samba the key steps are a [share] block in /etc/samba/smb.conf, `sudo smbpasswd -a <user>`, and `testparm` before restarting smbd."
    ],
    trouble:[
      ["`ssh: Could not resolve hostname raspberrypi.local`","mDNS (.local names) is not working on your laptop or network, or you set a different hostname in Imager","Find the Pi's IP in the router's DHCP client list and SSH to the IP. VPN software often blocks mDNS; disconnect it and retry."],
      ["`Permission denied (publickey)`","Imager embedded a different key than the one your SSH client offers, or the username differs","Run `ssh -v you@ip` and read which key files are offered; point at the right one with `ssh -i ~/.ssh/id_ed25519`. If you still cannot get in, re-flash the card: it takes ten minutes and shows why notes matter."],
      ["Random freezes, SD-card corruption, or 'Undervoltage detected!' in `dmesg`","A weak power supply or thin cable; a Pi 5 on a supply that cannot negotiate 5 A also limits USB current and warns at boot","Check `vcgencmd get_throttled` first: any value other than 0x0 means under-voltage or throttling has occurred since boot. Use the official supply and do not power a drive from the Pi's USB ports without enough budget."],
      ["The whole household loses internet after you point the router's DNS at Pi-hole","The Pi is down, its IP changed, or Pi-hole is listening on the wrong interface","Diagnose in order: does the Pi answer ping? Does `dig @<pi-ip> example.com` answer? Is the IP still the reserved one? Restore the router DNS setting from your screenshot first, then fix the Pi calmly."],
      ["Windows says it cannot access the share because security policies block unauthenticated guest access","Current Windows disables guest SMB access by default","Do not enable guest access. Create a Samba user with `sudo smbpasswd -a <user>` and connect with those credentials."]
    ],
    challenge:"Make the Pi rebuildable from scratch in under 30 minutes. Write one shell script that installs the packages, applies your configuration and restores the service's backup (Pi-hole: a Teleporter export; Samba: smb.conf and the user list). Then prove it: flash a second card, run the script, swap cards, and time how long until clients work again. Record every step you had forgotten to script.",
    reflect:[
      "Why is a DHCP reservation on the router usually a better design than a static IP set on the Pi itself, and when would you choose the opposite?",
      "Your Pi-hole is a single point of failure for name resolution. What are two ways to keep DNS working when it is down, and what does each cost in blocking coverage or complexity?",
      "Which upgrade (SSD, more RAM, cooling, a HAT) would actually change your project's performance, and what measurement would prove it?"
    ],
    safety:"Use the official power supply and a ventilated case. Before changing router DNS or DHCP, screenshot the existing settings and tell the household. Never port-forward DNS (53) or the admin page to the internet; that turns the Pi into an open resolver others can abuse."
  },
  "p10lab2":{
    time:"60–90 min",
    setup:[
      "A phone or laptop that lists nearby networks with channel and signal. Android: the open-source WiFiAnalyzer (VREM Software, on F-Droid and Google Play). iPhone: third-party apps cannot scan, so install Apple's AirPort Utility and turn on Settings > AirPort Utility > Wi-Fi Scanner. Laptops: Windows `netsh wlan show networks mode=bssid`, Linux `nmcli -f SSID,CHAN,FREQ,SIGNAL dev wifi list`, macOS Wireless Diagnostics (Option-click the Wi-Fi icon) > Window > Scan.",
      "Admin access to your own router or the ISP gateway's app. Screenshot the current wireless settings for each band: SSID, channel, channel width, security mode. That screenshot is your rollback plan.",
      "A repeatable performance test at fixed spots: iperf3 between a wired computer (`iperf3 -s`) and your laptop (`iperf3 -c <ip> -t 20`) isolates the Wi-Fi link; an internet speed test is a weaker second choice. Mark three or four test spots (router room, the farthest room, one in between).",
      "Scope: you only read the beacons every access point broadcasts publicly. You do not connect to, probe or capture traffic from any network that is not yours. In your write-up, label neighbour networks N1, N2, ... instead of recording their names."
    ],
    checkpoints:[
      "The analyzer shows your own network with its channel, band and signal in dBm, and you can tell your 2.4 GHz and 5 GHz radios apart (same or different SSID, different BSSIDs).",
      "A 'before' record exists: for each test spot, your signal (dBm) and iperf3 throughput; and a 2.4 GHz channel map listing every visible network by channel and signal (N1, N2, ...). You can say which of channels 1, 6 and 11 is most crowded and whether any network sits on an overlapping channel such as 3 or 9.",
      "After setting 2.4 GHz to the least-loaded of 1/6/11 at 20 MHz width, the analyzer shows your network on the new channel. The 'after' table, at the same spots and the same time of day, shows the change in throughput and in the number and strength of networks sharing your channel. Your 5 GHz channel and width are recorded too.",
      "Your explanation gives numbers for each band: 2.4 GHz has three non-overlapping 20 MHz channels in North America but the best wall penetration; 5 GHz has many more channels, some of them DFS channels that must vacate on radar detection; 6 GHz needs Wi-Fi 6E or 7 clients, requires WPA3, offers the widest clean channels and has the shortest range."
    ],
    hints:[
      "Interference is not 'how many networks I can see'. Look at which ones share or overlap your channel and how strong they are: a neighbour at -85 dBm barely matters; one at -55 dBm on your channel matters a lot.",
      "2.4 GHz channels are 5 MHz apart but each is about 20 MHz wide, so only 1, 6 and 11 avoid each other. Sharing a channel is better than partial overlap: radios on the same channel decode each other's frames and take turns, while a partly overlapping signal is just noise that corrupts frames.",
      "Set 2.4 GHz width to 20 MHz (40 MHz on 2.4 GHz almost always hurts in a neighbourhood), pick the 1/6/11 channel with the fewest and weakest co-channel neighbours, and measure at the same spots and time of day. Run each test three times: one measurement is a story, three averaged are evidence."
    ],
    trouble:[
      ["The router page offers only 'Auto' or 'Smart Connect', no channel setting","Many mesh systems and ISP gateways manage channels themselves","Look for an advanced or 'split bands' option in the app. If none exists, record which channel Auto picks before and after a router restart and note that the vendor controls it; that is a valid finding."],
      ["After the change, some devices drop off or will not reconnect","Older clients may not support the new settings, or another field (security mode, SSID) changed by accident","Compare the settings page with your before screenshot and revert everything except channel and width. Restart the client; if it still fails, forget the network and rejoin."],
      ["Throughput jumps around between runs","Speed tests measure your ISP and a remote server as much as your Wi-Fi, and household traffic varies","Isolate the layer first: use iperf3 on the LAN, run each test three times, and note what else was using the network. If LAN results are steady but speed tests swing, the bottleneck is not your radio."],
      ["AirPort Utility on iPhone shows no Wi-Fi Scan button","The Wi-Fi Scanner option is off in iOS Settings","Open Settings > AirPort Utility, enable Wi-Fi Scanner, reopen the app and tap Wi-Fi Scan in the top corner."],
      ["The 5 GHz network vanishes for a minute at random","The router is on a DFS channel and detected radar, which forces a channel change and a listening wait","Check the router log for radar or DFS events. If clients cannot tolerate the gap, choose a non-DFS channel (36–48 or 149–165 in the US)."]
    ],
    challenge:"Replace the four spots with a heat map. Sketch your floor plan on grid paper, take signal and iperf3 readings at ten or more marked points for each band, and colour them in a spreadsheet. Then change one variable (router position or height, 5 GHz width from 80 to 40 MHz, or band steering on or off), produce a second map, and write which change helped most, by how much, and why the physics predicts it.",
    reflect:[
      "Why does sharing channel 6 with three neighbours usually beat sitting alone on channel 3 or 9?",
      "Wider channels give higher peak speed. Why can 80 or 160 MHz channels make a crowded 5 GHz environment slower in practice?",
      "In a dense apartment block, which band would you use for a desk PC and which for a smart plug in the garage, and why?"
    ],
    safety:"Survey passively only: do not connect to, probe, capture or disrupt any network you do not own. Router changes affect everyone in the home, so warn them, change one setting at a time, and keep the before screenshot so you can restore it."
  },
  "p10lab3":{
    time:"two sessions of 2 h",
    setup:[
      "A Raspberry Pi running Raspberry Pi OS (the lab 1 Pi is fine), a solderless breadboard, male-to-female jumper wires, one 5 mm LED, a 330 ohm resistor (220 ohm to 1 kohm works), a momentary push button, and an I2C temperature sensor breakout rated for 3.3 V, such as a BME280, SHT31 or AHT20 board. Zero models without header pins need a pre-soldered header.",
      "Software: `sudo apt update && sudo apt install python3-gpiozero python3-lgpio i2c-tools`. gpiozero works on every model, including the Pi 5. Do not use the old RPi.GPIO library on a Pi 5: it does not support the Pi 5's RP1 I/O chip.",
      "Enable I2C with `sudo raspi-config` > Interface Options > I2C > Yes, then reboot. Run `pinout` to print the header map and keep the official GPIO diagram from the Raspberry Pi documentation open, because physical pin numbers and GPIO (BCM) numbers differ.",
      "Wire with the Pi shut down and unplugged. Before powering on, check every wire against your diagram once more: a 5 V lead on a GPIO pin can permanently damage the Pi."
    ],
    checkpoints:[
      "LED wired GPIO17 (physical pin 11) -> resistor -> LED long leg (anode); short leg (cathode) -> GND (pin 9). A gpiozero script using LED(17) and led.blink() makes it blink and stops cleanly on Ctrl+C. Your notes compute the current: about (3.3 V - 2.0 V) / 330 ohm = 4 mA.",
      "Button wired between GPIO27 (pin 13) and GND. A script using Button(27) prints 'pressed' exactly once per press, relying on the internal pull-up, and toggles the LED.",
      "`i2cdetect -y 1` shows your sensor's address in the grid (commonly 76 or 77 for BME280, 44 for SHT31, 38 for AHT20). Your logger writes a CSV row with an ISO 8601 UTC timestamp and the temperature every 10–60 s, and breathing on the sensor makes the values rise visibly.",
      "Your explanation covers: GPIO is 3.3 V logic and not 5 V tolerant; keep pin current small (a few mA for indicators); I2C is a two-wire addressed bus (SDA, SCL, pull-ups, many devices); SPI is a faster four-wire bus with one chip-select line per device; UART is point-to-point serial with TX and RX crossed and an agreed baud rate."
    ],
    hints:[
      "Build one circuit at a time and prove it before adding the next. Most GPIO 'bugs' are a wire one breadboard row off, or BCM and physical pin numbers mixed up.",
      "gpiozero uses BCM numbers: LED(17) means GPIO17, which is physical pin 11. Button(27) enables the internal pull-up by default, so wire the button to GND, not to 3.3 V. Add bounce_time=0.05 if one press registers several times, and use signal.pause() to keep an event-driven script alive.",
      "Sensor wiring: VIN to 3.3 V (pin 1), GND to pin 6, SDA to GPIO2 (pin 3), SCL to GPIO3 (pin 5). Confirm the address with i2cdetect before writing code. Then use smbus2 with a small driver or the vendor's Python library inside a venv, and log with csv.writer plus datetime.now(timezone.utc).isoformat()."
    ],
    trouble:[
      ["`error: externally-managed-environment` when you `pip install` a sensor library","Raspberry Pi OS (Debian 12 and later) protects the system Python, per PEP 668","Create a venv that can still see apt's gpiozero: `python3 -m venv --system-site-packages ~/gpio-env`, then `source ~/gpio-env/bin/activate` and pip install inside it."],
      ["`RuntimeError: Cannot determine SOC peripheral base address`","RPi.GPIO, or a library built on it, is running on a Pi 5","Switch to gpiozero with the lgpio backend or a library that supports the Pi 5. Check which GPIO library a tutorial uses before you follow it."],
      ["`i2cdetect -y 1` shows only dashes","I2C is not enabled, SDA and SCL are swapped, the board has no power, or the module needs 5 V","Work from the bottom up: confirm `/dev/i2c-1` exists (I2C enabled), measure 3.3 V at the board's VIN with a multimeter, then check SDA is on pin 3 and SCL on pin 5. Suspect the sensor only after those pass."],
      ["The script runs without errors but the LED never lights","LED reversed, the wrong number type in code, or the resistor in the wrong breadboard row","Move the resistor's GPIO lead to 3.3 V (pin 1) for a second. If the LED lights, the circuit is fine and the pin number in code is wrong; if not, turn the LED around."],
      ["`lgpio.error: 'GPIO busy'`","Another process, often an earlier script still running, holds the pin","Find it with `ps aux | grep python` and stop it. Use try/finally or gpiozero's close() so scripts release pins on exit."]
    ],
    challenge:"Turn the logger into a small service: run it under systemd so it starts at boot and restarts on failure, store readings in SQLite, and light the LED when the temperature crosses a threshold you adjust with the button (short press up, long press down via Button's hold_time). Then break it on purpose: unplug the sensor's SDA wire while it runs and make the code log the error and retry instead of crashing. Finally, log 100 readings in a stable room and compute the standard deviation to measure the sensor's noise.",
    reflect:[
      "Why does the LED need a series resistor at all, and what would happen to the pin and the LED without one?",
      "Why can many sensors share two I2C wires while SPI needs an extra wire per device, and when would you still choose SPI?",
      "A sensor module is labelled 5 V. What exactly could go wrong if its output went straight to a GPIO input, and what part fixes it?"
    ],
    safety:"Low-voltage work only, but the Pi is fragile: wire with power off, never connect 5 V to a GPIO pin, and never short 5 V or 3.3 V to GND. Use the official USB-C supply; no mains wiring is involved or allowed. If you solder headers, work in a ventilated space with eye protection and an iron stand."
  },
  "p10lab4":{
    time:"two sessions of 90 min",
    setup:[
      "Sources: the official Flipper Zero documentation at docs.flipper.net; for receive-only radio, the RTL-SDR quick-start guide at rtl-sdr.com and the rtl_433 project README; and your regulator's rules. In the US that is the FCC: 47 CFR Part 15 for unlicensed low-power devices and the FCC's jammer enforcement page. Elsewhere, use your national regulator.",
      "Hardware is optional. If you own a Flipper Zero, update it to official firmware with qFlipper or the mobile app so its region-based transmit limits apply. If not, an RTL-SDR Blog V4 USB dongle (receive-only, roughly 40 USD) is the cheapest way to see real RF; or do the lab from documentation alone.",
      "An inventory of devices you personally own that you may examine: your own garage or gate remote, NFC tags you bought, your TV's IR remote, your own 433 MHz weather station or doorbell. Exclude anything that belongs to an employer, landlord, building, bank or another person: work badges, building fobs, payment cards, other people's car keys.",
      "A notebook template (markdown file or spreadsheet) with columns: feature, physics (band, modulation, typical range), what it does, legitimate use, legal boundary and source, own-device observation, open questions."
    ],
    checkpoints:[
      "The notebook lists each main Flipper app from the official docs (Sub-GHz, 125 kHz RFID, NFC, Infrared, GPIO, iButton, Bad USB, U2F) and, for each radio one, its frequency range and the rule that governs it, citing the exact regulation section or regulator page you read.",
      "Every own-device observation is receive-only. Examples: Sub-GHz Frequency Analyzer showing your remote near 315, 390 or 433.92 MHz; an NFC read identifying your own tag's type (for example NTAG215); an rtl_433 decode of your own weather sensor. Neighbours' sensors that rtl_433 also hears are recorded only as 'other devices present'.",
      "Every row has all columns filled, including the legitimate use and the legal boundary in your own words. At least one row explains why a rolling-code remote (KeeLoq, Security+) differs from a fixed-code one and why you must not replay it.",
      "The notebook ends with your rules of engagement, written after rereading the Domain 8 ethics module: what you will never do (transmit where you are not permitted, jam, replay or clone anything you do not own, read other people's cards) and what written permission anything beyond your own devices would require."
    ],
    hints:[
      "Organise by physics first and tool second. Once you know a feature's frequency, power and modulation, the legal question becomes 'which rule covers this band and this use', and that you can look up.",
      "Receiving and transmitting are treated differently in law. Listening to unencrypted broadcasts is often lawful, but disclosing or using private communications you happen to receive is not, and transmitting is regulated by band, power and purpose. Jamming is prohibited outright in the US.",
      "For your own garage remote, the useful experiment is Frequency Analyzer and a raw read only, followed by a written explanation: a rolling-code receiver accepts each code once and tracks a counter, so experimenting with replay can desynchronise your own remote. Put that in the 'why not' column instead of testing it."
    ],
    trouble:[
      ["Frequency Analyzer shows nothing when you press your remote","The remote's band is outside the analyzer's range, its battery is weak, or the devices are too far apart","Hold the remote a few centimetres away and press repeatedly. Read the FCC ID on its label and look it up in the FCC ID search on fcc.gov to learn its operating frequency."],
      ["A Sub-GHz transmit option says it is unavailable in your region","Official firmware enforces regional transmit limits","That is working as intended. Do not install firmware that removes the limits; record the behaviour and the rule it implements in your notebook."],
      ["rtl_433 prints many devices you do not recognise","Neighbours' weather stations, tyre-pressure sensors and doorbells share the 433 MHz band","Filter to your own device by protocol and ID (press its test button and note the ID) and keep only that in your notes."],
      ["You cannot find which rule applies to a band or feature","Regulations are organised by band and device class, not by gadget name","Start from your regulator's frequency allocation table, find the band, then the rule part for it. If it is still unclear, write 'unclear: do not transmit' in the legal-boundary column. Unclear means no."]
    ],
    challenge:"Add a receive-only measurement section. With an RTL-SDR (or the Flipper's Frequency Analyzer), record your own remote's received signal strength at 1, 2, 4 and 8 metres and through one wall, and compare the drop with the inverse-square law. Then draw a one-page 'is this allowed?' decision flowchart someone else could follow for any new RF feature: own device or not, receive or transmit, which band, licensed or unlicensed, power limit, and where it stops.",
    reflect:[
      "Why does the law treat receiving and transmitting so differently, and what does that say about who bears the harm in each case?",
      "What property of rolling-code systems defeats simple replay, and why can careless experiments with them still break your own equipment?",
      "If a friend asks you to copy their apartment building's fob, which questions decide whether that is lawful, and who actually has the authority to say yes?"
    ],
    safety:"Receive only. Do not transmit, replay, emulate, clone or jam any signal; jamming is illegal in the US and most countries. Examine only devices you personally own, never cards, fobs or remotes belonging to employers, buildings, banks or other people, and keep official firmware with its region limits."
  }
});

/* p32 Threat Intelligence, OSINT & Social Engineering Defense: yourself, fictional companies, sanctioned challenges, your own MISP, consent-based programs */
Object.assign(window.LABX,{
  "p32lab1":{
    time:"two sessions of 2–3 h, plus 30 min a week for opt-out follow-ups",
    setup:[
      "A research VM on a hypervisor you own (VirtualBox, VMware or UTM): the Trace Labs OSINT VM (follow the current build instructions on Trace Labs' official site or GitHub; recent versions are built on Kali), or a minimal Debian 13 VM with Firefox ESR and exiftool (`sudo apt install libimage-exiftool-perl`). Take a snapshot named clean-baseline before any research.",
      "A fresh browser profile inside the VM with no logins, no sync and no extensions you did not choose on purpose. You log in nowhere during collection; account changes in the cleanup phase happen on your normal device.",
      "A case-file folder with a findings sheet (ID, UTC time, URL, what it shows, SHA-256 of the capture, Admiralty grade, risk, action) and the PIR at the top: 'What could an attacker use to pretext me?'. Keep it in an encrypted container (VeraCrypt or an encrypted archive), because it becomes a dossier on you.",
      "Scope: you, and only you. People-search and breach results will show relatives and old housemates. Do not open their profiles or record their details, and redact them from any capture you keep."
    ],
    checkpoints:[
      "The VM boots from the clean-baseline snapshot, the fresh profile shows no saved logins, and the case file has the PIR written as a question at the top.",
      "A list of your identifiers (usernames, emails, phone, past cities) exists, each with the searches run: two or three search engines with exact-match quotes, reverse image search of your profile photos on at least two engines, Have I Been Pwned for each email. `exiftool -a -G1 -gps:all -DateTimeOriginal <file>` has been run on images downloaded from where you posted them, not on the originals on your phone.",
      "Each finding has a capture file, a UTC timestamp (`date -u +%Y-%m-%dT%H:%M:%SZ`), the URL, a `sha256sum` value recorded in the sheet, and an Admiralty grade with a one-line reason (for example 'B2: established people-search site, consistent with what I know').",
      "The plan lists actions in priority order with dates: passwords for breached or reused accounts and passkeys or app-based MFA on your email first, then deletions, people-search opt-outs, search-engine removal requests and alerts. The first five items show a completion date, and any image you keep online has been re-uploaded with metadata stripped (`exiftool -all= file.jpg` leaves a file.jpg_original backup)."
    ],
    hints:[
      "Think like the attacker in your PIR: they want a believable story. Your employer, your manager's name, your hometown, your pet's name and your phone number are worth more to them than an embarrassing photo.",
      "Pivot systematically. Every new identifier you find (an old username, a second email) gets its own row and its own searches. Use exact-match quotes and site: filters, and use more than one reverse image engine, because each indexes differently.",
      "Fix the account layer before the visibility layer. An exposed email with a reused breached password is an active risk; a broker listing is a pretexting aid. Rotate breached passwords in a password manager, add passkeys where offered, then submit opt-outs (each people-search site has its own form) and use Google's 'Results about you' to request removal of contact details and set alerts."
    ],
    trouble:[
      ["exiftool finds no GPS data in any photo you posted","Most large social platforms strip EXIF on upload","That is a valid finding, but also check places that keep originals: personal blogs, forums, cloud-share links, marketplace listings and photo sites. Check one original on your phone to see what would have leaked."],
      ["A capture's SHA-256 no longer matches when you re-hash it","The file was edited, re-saved or recompressed by a viewer or screenshot tool","Hash immediately after capture, set captures read-only, and redact only copies. Record both the original and the redacted hash."],
      ["Have I Been Pwned lists a breach you do not remember","An old account, a service that was acquired, or a third party that held your email","Read the breach description for the data classes exposed, assume the password is known, and change it wherever it was reused. Do not go looking for the leaked data itself."],
      ["An opt-out form asks for photo ID or more data than the listing shows","Some people-search sites ask for verification, and lookalike 'removal' sites harvest data","Reach the opt-out page from the site's own privacy policy, give the minimum, and log what you submitted. Paid removal services exist; decide whether the convenience is worth giving your data to one more company."]
    ],
    challenge:"Measure whether the cleanup worked. Thirty days after your opt-outs, rerun exactly the same queries from the same snapshot and compute the percentage of findings that disappeared, came back or newly appeared. Then rank the remaining public facts by how much each would help an impersonator of your bank or employer, and identify the one further action that would remove the most useful facts at once.",
    reflect:[
      "Why does the order of the cleanup plan matter more than its length?",
      "Which of your findings came from a source you would grade reliable but carried information you could not confirm, and what does that say about trusting aggregator sites?",
      "Why do analysts collect from an isolated VM and a fresh profile even when the subject is themselves?"
    ],
    safety:"Research yourself only. Do not search for, record or contact relatives, exes, coworkers or anyone else who appears in results; redact them. Do not download breach data, buy reports about other people, or reuse the case file to investigate anyone."
  },
  "p32lab2":{
    time:"3–4 h, plus a day's wait for new certificates to appear in CT logs",
    setup:[
      "This guide takes the fictional-company route. Invent a company (name, sector, size) and give it harmless infrastructure you own: a domain you already have or a cheap new one, three or four subdomains (for example www, staging, a 'legacy' host), a free static site such as GitHub Pages, and Let's Encrypt certificates so the names reach certificate transparency logs. Write your known-asset inventory before you enumerate anything.",
      "A local Git repository you create for the fictional company, with one deliberately committed fake secret: a random string in a token-like format that grants access to nothing. Keep the repository local; pushing it gains nothing and may trip secret-scanning push protection.",
      "Tools: a browser, curl and jq; free accounts on Shodan and Censys (some filters need paid plans); gitleaks from its official GitHub releases; a spreadsheet for the asset table and the collection log. crt.sh and the Wayback Machine CDX API need no account.",
      "A scoping statement template with six fields: organisation (fictional), assets (your domains and hosts only), methods (passive only: public databases and normal page loads of your own sites; no port scans, no logins), people (none: no employee names, emails or profiles), dates, data handling."
    ],
    checkpoints:[
      "A signed scoping statement with all six fields and your known-asset inventory (N known assets) are dated before the first query in the collection log.",
      "The enumeration list is deduplicated and every name has a source and first-seen date, from crt.sh (`curl -s 'https://crt.sh/?q=%25.yourdomain&output=json' | jq -r '.[].name_value' | sort -u`), at least one passive DNS source, and the Wayback Machine (`https://web.archive.org/cdx/search/cdx?url=*.yourdomain&fl=original,timestamp&collapse=urlkey`).",
      "Shodan and Censys were queried only for your own hostnames and IPs, with each query in the collection log. A public code search for the domain is logged even if empty. gitleaks on your local repo reports the fake secret with file, line and commit. The exposure metric is written as a fraction, for example 2 unexpected / 5 known = 0.4.",
      "The final table has one row per asset (asset, type, source, first seen, Admiralty grade, exposure note, action). The action plan has two columns, pentest-scope candidates for Domain 8 and blue-team actions for Domain 21, and no individual is named anywhere."
    ],
    hints:[
      "The value of the map is the gap between what the organisation thinks it has and what the internet says it has. That is why the known inventory comes first: without it you cannot count 'unexpected'.",
      "Certificate transparency is the strongest passive source because every publicly trusted certificate is logged, including for staging hosts nobody remembers. Wildcard certificates hide individual names, so note them as a coverage gap. Archives show old paths and subdomains that DNS no longer lists.",
      "Clean crt.sh output: name_value can hold several names separated by newlines and leading '*.' wildcards, so split, strip, lowercase and `sort -u`. Current gitleaks releases use `gitleaks git -v <repo>` (older ones `gitleaks detect --source <repo> -v`). Grade carefully: a CT entry is strong evidence that a name existed, but weak evidence that a host is live today until a second source confirms it."
    ],
    trouble:[
      ["crt.sh returns 502, times out or gives an empty array","crt.sh is a free service under heavy load, or your certificate is too new to be indexed","Retry later, query the exact domain rather than a broad pattern, and allow a few hours after issuing a certificate. Log the outage: a collection gap is a fact worth reporting."],
      ["Shodan or Censys returns nothing for your hosts","They have not crawled them yet, the free tier blocks that filter, or your static site sits on a shared CDN address","Log the null result with the date. Do not scan your hosts yourself to fill the gap: this lab is passive by design, and an empty result is part of the exposure picture."],
      ["gitleaks finds nothing although you committed a fake secret","The string matches no built-in rule, or you scanned a different folder","Run with -v and check the path. Use a format a default rule recognises or add a custom rule in .gitleaks.toml, and note in the report that scanners only catch known patterns."],
      ["Your table starts collecting people's names (domain registrant, commit authors, emails in certificates)","Several public sources carry personal data by default","Remove them and use roles ('registrant contact'). Record that the source exposes personal data as a finding with a blue-team action, such as WHOIS privacy or a role mailbox."]
    ],
    challenge:"Automate collection: write a script that takes a domain, pulls crt.sh and Wayback CDX results, normalises and deduplicates names, compares them with your known-asset inventory file, and prints the exposure metric plus each unexpected name with source and first-seen date. Run it weekly for a month while you add one subdomain and retire another, show that it detects both changes, and describe what a defender should alert on.",
    reflect:[
      "Why do passive sources such as CT logs and web archives reveal assets an internal inventory misses, and what does that imply about decommissioning?",
      "The same table serves a pentester and a defender. Which rows would each prioritise, and where might those priorities conflict?",
      "What goes wrong if you treat a CT log entry as proof that a host is live, and how should the Admiralty grade reflect that?"
    ],
    safety:"Passive collection only, against assets you own for a fictional company. No port scans, logins or active probing, and no real organisation's assets. Record no individuals: no employees, personal emails or profiles."
  },
  "p32lab3":{
    time:"three or four sessions of 2 h",
    setup:[
      "Challenge sources published for training: Gralhix OSINT exercises (gralhix.com, by Sofia Santos) and OSINT Dojo challenges. Do not substitute photos of real people taken from social media.",
      "Tools: Google Earth (web or Pro), Google Maps and Street View, Bing or Yandex maps where Google coverage is thin, overpass-turbo.eu for OpenStreetMap queries, SunCalc (suncalc.org), Bellingcat's Shadow Finder (run it from its GitHub repository or the linked Colab notebook), and exiftool on your laptop.",
      "Your own set: five photos of public places (landmarks, streets, parks) taken with location enabled and with no faces or licence plates in the frame. Copy them by cable or a cloud 'download original' option, not through a messaging app, which strips EXIF.",
      "A case-note template: clues observed, tools and queries, candidate locations, final answer, confidence (an ICD 203 word such as 'likely' or 'very likely'), time spent, and, filled in only afterwards, the official answer and your error in metres or minutes."
    ],
    checkpoints:[
      "Fifteen challenge notes (ten Gralhix, five OSINT Dojo) each have clues, tools and a confidence word recorded with a timestamp before the solution was opened.",
      "An answer key exists from the originals (`exiftool -n -csv -GPSLatitude -GPSLongitude -DateTimeOriginal -OffsetTimeOriginal originals/ > key.csv`); the stripped copies show nothing for `exiftool -gps:all` and have random file names. Each of the five solves records your guess, the true position, the distance error in metres and the time error in minutes.",
      "Two shadow computations show the object height h, shadow length L, elevation e = atan(h/L) in degrees, and the SunCalc window where the sun's elevation matches and its azimuth is opposite the shadow direction. One Shadow Finder run shows the candidate band it produced and how you narrowed it.",
      "Twenty verification notes share one shape: a one-sentence judgment, a confidence word with its probability band, the key evidence, and 'what would change my mind'. The error analysis names the clue classes that misled you (signs, vegetation, road markings, architecture, sun)."
    ],
    hints:[
      "Start wide, then narrow: hemisphere and climate, then country (driving side, script, road markings, bollards), then city, then the exact spot. Write each step down; the reasoning is what is being graded, not the pin.",
      "Once you have a candidate area, stop guessing and start testing: line up two fixed features (a ridge line and a tower, a road bend and a building) and check that the viewing angle matches in Street View or Google Earth 3D. Overpass-turbo can search for combinations, such as a church within 100 m of a level crossing.",
      "Shadow maths: e = atan(h/L). A 2 m post casting a 3 m shadow gives e = atan(0.667), about 33.7 degrees. In SunCalc, set the place and date, drag the time slider until the elevation matches, then use the shadow's direction to choose between the morning and afternoon windows."
    ],
    trouble:[
      ["Your own photos have no GPS data","Location was off in the camera app, or a share sheet or messaging app removed it","Check one original on the phone. On iPhone, the share sheet's Options control location; transfer by cable or iCloud 'Download Original'. Retake the photos if needed."],
      ["Your time error is exactly one or more whole hours","DateTimeOriginal is local time with no zone; OffsetTimeOriginal may be missing, or you compared it with UTC","Write the time zone explicitly and convert everything to UTC before computing the error, allowing for daylight saving time on the photo's date."],
      ["The shadow method gives an impossible time window","Height and length estimated in different units, sloping ground, or an object that is not vertical","Use a reference of known size in the same plane, check that the ground is level, widen the confidence band and state the assumption in the note."],
      ["Your confidence words do not match your accuracy","You are scoring certainty by effort rather than evidence","Build a calibration table: for each confidence word, the fraction of those answers that were right. If 'very likely' (80–95%) answers are right only 60% of the time, downgrade."]
    ],
    challenge:"Run a calibration study across all twenty notes: plot each stated probability band against the actual hit rate (within 100 m for place, 15 min for time) and compute a Brier score. Then take one of your own stripped photos, crop out the decisive landmark, and solve it again a week later; document how your reasoning and confidence changed when the strongest clue was gone.",
    reflect:[
      "Why must clues and confidence be logged before you look at the answer, and which bias does that protect against?",
      "Two clues point to the same city. When does that raise confidence sharply, and when are the clues not really independent?",
      "Geolocation works just as well against private individuals. Where do you draw the line between verifying a public news image and locating a person, and why?"
    ],
    safety:"Use only sanctioned challenge sets and your own photographs of public places with no identifiable people or plates. Never geolocate or chronolocate images of private individuals, their homes or their routines."
  },
  "p32lab4":{
    time:"two sessions of 2–3 h",
    setup:[
      "A machine you own with at least 8 GB RAM available to Docker (16 GB or more if you try OpenCTI) and 20 GB of free disk, running Docker Engine with the compose plugin or Docker Desktop (docs.docker.com). Check that `docker compose version` works.",
      "Official sources only: `git clone https://github.com/MISP/misp-docker.git`, then `cp template.env .env` and read its comments. Set BASE_URL to the exact address you will browse to (for example https://localhost) and keep the instance on your machine, never exposed to the internet.",
      "Python 3.10 or later in a virtual environment: `python3 -m venv misp-env && source misp-env/bin/activate && pip install pymisp`. Ideally match PyMISP to your MISP version; MISP warns when they drift.",
      "One public vendor or government threat report marked TLP:CLEAR (for example a CISA advisory, a national CERT report or a security vendor's research post) that lists IOCs and ATT&CK technique IDs."
    ],
    checkpoints:[
      "`docker compose ps` shows the MISP core, database, Redis and mail containers running (names vary by version); the UI loads at BASE_URL after you accept the self-signed certificate; you logged in with the default admin credentials from the README and changed the password. Galaxies and taxonomies are updated, and the mitre-attack-pattern galaxy and the tlp taxonomy are enabled.",
      "One default feed (for example an abuse.ch feed) is enabled and fetched, and your notes record: indicators pulled, how many correlate with a second cached feed, and a table or histogram of indicator age by month.",
      "Your event has a title, date, distribution, a TLP tag, an estimative-language tag, the IOCs as correctly typed attributes (ip-dst, domain, url, sha256) with to_ids set deliberately, and ATT&CK galaxy clusters. Its STIX 2.1 export opens as JSON: a bundle containing indicator objects with pattern fields and attack-pattern objects.",
      "A PyMISP script prints the indicators added in the last 7 days tagged with your chosen technique, and reads the MISP URL and API key from environment variables, not from the source."
    ],
    hints:[
      "The first start can take several minutes while the database initialises and MISP updates itself. Watch `docker compose logs -f` for the core container instead of refreshing the browser; most 'it is broken' moments are 'it is not finished yet'.",
      "Feeds: open the feed list, load the default feed metadata, enable one feed and fetch it; cache a second one so MISP can correlate without importing it as events. Overlap comes from comparing cached feeds; age comes from each attribute's first-seen or timestamp field.",
      "PyMISP: `misp = PyMISP(url, key, ssl=False)` for the lab's self-signed certificate (or pass the certificate path), then `misp.search(controller='attributes', tags=['misp-galaxy:mitre-attack-pattern=\"<name> - T1566\"'], timestamp='7d', pythonify=True)`. Copy the exact tag string from your event page; it must match character for character."
    ],
    trouble:[
      ["`Bind for 0.0.0.0:443 failed: port is already allocated`","Another container or a local web server already holds port 80 or 443","Find it with `docker ps` and `sudo ss -ltnp | grep -E ':80 |:443 '`. Stop it, or change the published ports using the variables documented in .env, and update BASE_URL to match."],
      ["Feed fetch fails or shows zero indicators","The container cannot reach the internet (proxy, DNS, firewall), or the feed URL changed","Test from inside the container with `docker compose exec <core service> curl -sI <feed url>`. If that fails, it is networking, not MISP. Check the feed's own site for its current URL."],
      ["PyMISP raises CERTIFICATE_VERIFY_FAILED or 403 'Authentication failed'","The lab certificate is self-signed, or the auth key is wrong, disabled or restricted to certain IPs","For SSL, use ssl=False only in the lab or pass the exported certificate. For 403, create a new auth key and test it first: `curl -k -H 'Authorization: <key>' -H 'Accept: application/json' https://localhost/servers/getVersion`."],
      ["Login loops back to the login page, or the UI shows an internal error just after start-up","Initialisation is still running, or BASE_URL does not match the address in your browser","Wait for the logs to settle, make BASE_URL match the address bar exactly (scheme, host and port), and run `docker compose up -d` again."],
      ["The machine slows to a crawl when you add OpenCTI","OpenCTI runs Elasticsearch or OpenSearch, RabbitMQ and several workers","Stop MISP while testing OpenCTI or skip the optional step, and record the resource cost as a finding for anyone choosing between the platforms."]
    ],
    challenge:"Measure feed quality properly. Write a script that, for two cached feeds, computes their overlap (Jaccard index), the median indicator age, and the fraction of IP indicators inside large cloud or CDN ranges, where blocking would cause collateral damage. Decide, with numbers, which feed you would trust for automatic blocking and which only for enrichment. Bonus: create a second local organisation and a sharing group and show how distribution levels control what each organisation sees.",
    reflect:[
      "Why can an indicator that appears in two feeds still be a poor blocking candidate?",
      "What does STIX 2.1 add beyond a CSV of IOCs, and who benefits from the extra structure?",
      "Why tag events with TLP and estimative language instead of leaving that context in a free-text description?"
    ],
    safety:"Run MISP only on your own machine, bound to localhost or a lab network and never exposed to the internet. Feed indicators include live malicious URLs and domains: treat them as text and do not visit or download them. Share events only within their TLP marking."
  },
  "p32lab5":{
    time:"three sessions of 2 h",
    setup:[
      "Case sources: FBI IC3 public service announcements (ic3.gov), DOJ press releases and court filings in BEC prosecutions, CISA guidance, and vendor threat-research blogs. Use only cases already published; you analyse processes and organisations, not individuals.",
      "A closed local lab for the GoPhish step: GoPhish from its official GitHub releases (github.com/gophish/gophish) and a local mail catcher such as Mailpit (`docker run -d --name mailpit -p 8025:8025 -p 1025:1025 axllent/mailpit`). Every recipient is a test mailbox inside Mailpit, which you own, and no message leaves your machine.",
      "A plainly labelled test template, not a lure: subject and body read 'LAB SIMULATION - GoPhish metrics test', with one link labelled 'Record a test click'. You are testing the measurement pipeline. Your program will contain rules about lures, never lure text.",
      "A profile for a fictional 600-person firm: departments (finance, HR, help desk, engineering, sales), locations, and current controls (email gateway, MFA type, DMARC policy). The memo and program are written for this firm."
    ],
    checkpoints:[
      "A ten-row case table with columns: source (with link), vector (email, voice, SMS, BEC), persuasion principles (authority, urgency, liking, reciprocity, social proof, commitment, unity), process deviation (for example bank details changed without a callback), and the control that would have stopped it. At least three rows are BEC and at least one is vishing.",
      "The memo names the sponsor and approvers (CISO, HR, legal, employee representatives where they exist), scope and exclusions (staff on leave or in a personal crisis), consent (simulations announced in policy and onboarding), data handling (aggregate reporting, a retention period, no discipline for single clicks) and lure rules (banned themes such as pay, bonuses, layoffs, health emergencies and disasters).",
      "GoPhish runs with the admin UI at https://127.0.0.1:3333 and the password you set after the one-time password printed in the console. A campaign to five or more Mailpit test addresses shows Sent, and after you act on some messages, Clicked and Email Reported (report one by opening the phish server's `/report?rid=<rid>` URL for that recipient). You computed report rate (reported / delivered) and median time-to-report from the exported raw events.",
      "The twelve-month plan contains a monthly calendar of role-based modules; the report-button workflow from click to SOC triage to feedback; written verification protocols for finance (callback to a number on file, dual approval for payment-detail changes) and the help desk (identity checks before MFA or password resets); a passkey rollout by group; a DMARC path from p=none to p=reject with dates; and a dashboard with targets (report rate and time-to-report primary, click rate secondary)."
    ],
    hints:[
      "In every case, look for the moment a normal process was skipped. Social engineering rarely defeats a control; it persuades someone to step around one. That moment is where your program's controls belong.",
      "Write the memo as if the most sceptical employee will read it, because they will. Programs fail when staff feel tricked or punished and succeed when reporting is easy, fast and thanked. Make 'reported' the headline number, not 'clicked'.",
      "In the lab, 'opened' depends on a tracking image loading, so it is the least reliable number. Export the raw events, take each recipient's Email Sent and Email Reported times, compute the differences, and report the median rather than the mean, because a few late reporters skew averages."
    ],
    trouble:[
      ["GoPhish exits with `listen tcp 0.0.0.0:80: bind: permission denied`","On Linux, ports below 1024 need root, and GoPhish should not run as root","Edit config.json: set the phish_server listen_url to 127.0.0.1:8080 and use http://127.0.0.1:8080 as the campaign URL."],
      ["Campaign status shows Error, or nothing appears in Mailpit","The sending profile points at the wrong host or port, or expects authentication Mailpit does not offer","Set the sending profile host to 127.0.0.1:1025 with no username or password and use 'Send Test Email' first. Read the GoPhish console: it prints the SMTP error verbatim."],
      ["Opened stays at zero although you read the messages","The mail viewer blocks remote images, so the tracking image never loads","This is a finding, not a bug: real mail clients behave the same way, and privacy features can inflate opens. Say so in your metrics section and rely on clicks and reports."],
      ["Your case table drifts into profiling the employees who were deceived","News stories and court records name individuals","Refer to roles (accounts-payable clerk, CFO) and organisations. The lesson is the process gap; naming victims adds nothing."]
    ],
    challenge:"Build the dashboard you designed using synthetic data: write a small Python script that generates twelve months of plausible fictional results for the 600-person firm, then chart report rate, median time-to-report and repeat clicks by department. Set targets, write the quarterly review a CISO would read, and include one program change the data justifies. Explain how a falling click rate alone could hide a worsening situation.",
    reflect:[
      "Why is report rate a better primary measure of a program's health than click rate?",
      "Which verification protocol would have stopped the most cases in your table, and why do process controls outlast training alone?",
      "Where is the line between a realistic simulation and one that damages trust, and who in the organisation should decide where it sits?"
    ],
    safety:"Send simulations only to test mailboxes you own inside a closed local lab, never to friends, family, coworkers or any real organisation. Write no deceptive lures and impersonate no real brand. A real program needs written authorisation from leadership, HR and legal before any message is sent."
  }
});

/* p47 Tor & Anonymity Networks: verified clients, public metrics, Tails, your own onion service, public court documents */
Object.assign(window.LABX,{
  "p47lab1":{
    time:"60–90 min",
    setup:[
      "A computer you own and GnuPG: usually preinstalled on Linux (`gpg --version`); on Windows install Gpg4win from gpg4win.org; on macOS install GnuPG with Homebrew (`brew install gnupg`) or GPG Suite.",
      "From torproject.org/download only, download Tor Browser for your platform and its matching signature file (the signature link next to the download, ending in .asc). Put both in a new, empty folder. Never take Tor Browser from mirrors, unofficial app stores or links in forums.",
      "A plain-text log with UTC timestamps for every action: file names, the fingerprint you saw, the exact gpgv output, each setting changed, each onion address and the page it was copied from.",
      "The rule for this whole module: onion addresses come only from the operator's own clearnet page or from onion.torproject.org, never from search results, wikis or link lists."
    ],
    checkpoints:[
      "Your log shows the key fetched with `gpg --auto-key-locate nodefault,wkd --locate-keys torbrowser@torproject.org`, fingerprint EF6E 286D DA85 EA2A 4BA7 DE68 4E2C 6E87 9329 8290 compared character by character with the Tor Project's verification page, the key exported to ./tor.keyring, and `gpgv --keyring ./tor.keyring <file>.asc <file>` printing 'Good signature from \"Tor Browser Developers (signing key) <torbrowser@torproject.org>\"'.",
      "The shield icon (or Settings > Privacy & Security > Security Level) shows Safest, and Settings shows HTTPS-Only Mode enabled in all windows. Your log notes that JavaScript is now off everywhere, so some pages render plainly.",
      "The log lists each onion address beside the clearnet URL it was copied from (onion.torproject.org, the BBC's own page about its mirror, ProPublica's own page). Each onion page loads with the same content as its clearnet version. For each clearnet site you record whether Tor Browser showed the '.onion available' button in the address bar; torproject.org does, and if a news site does not, you record that rather than assume.",
      "Screenshots of the circuit display (site information panel in the address bar) for a clearnet page (three relays, then the site) and for an onion page. A timing table has five loads of each version with the median, using 'New Tor circuit for this site' between runs."
    ],
    hints:[
      "Verification answers two questions: was this file signed by whoever holds the signing key, and is that key really the Tor Project's? The signature answers the first; checking the fingerprint against the official page answers the second.",
      "gpgv trusts only keys in the keyring you hand it, which is why the procedure exports the single Tor Browser key to ./tor.keyring first. The .asc must belong to exactly the file name and version you downloaded.",
      "For timing, use the developer tools Network panel (the load time in its status bar) or a stopwatch, and take a new circuit between runs so you are not timing a warm one. Compare medians: with five samples, one slow relay drags the mean around."
    ],
    trouble:[
      ["`gpgv: Can't check signature: No public key`","The keyring file is empty or not where you pointed, or the key fetch failed","Run `gpg --list-keys torbrowser@torproject.org` to confirm the key is present, export again, and check `ls -l tor.keyring` is not 0 bytes. If the WKD lookup fails on your network, fetch the same fingerprint from keys.openpgp.org and compare it again."],
      ["`gpgv: BAD signature`","The download is corrupt, truncated, tampered with, or not the file this signature belongs to","Delete it, download again from torproject.org, and make sure the .asc matches the exact version and platform. Never run a file that fails verification."],
      ["gpg prints 'WARNING: This key is not certified with a trusted signature!'","You ran `gpg --verify` rather than gpgv, and you have not signed the Tor key yourself","Normal: the warning concerns your web of trust, not the file. The fingerprint comparison is what establishes the key; gpgv with the exported keyring avoids the confusion."],
      ["An onion page will not load or is very slow","Onion connections need a rendezvous and more relays, the service may be busy, or Tor is still bootstrapping","Check first that a clearnet page loads in Tor Browser (your Tor connection works), then use 'New Tor circuit for this site'. If the service stays down, log it; do not go looking for alternative addresses."]
    ],
    challenge:"Automate the check. Write a short script that takes a Tor Browser file and its .asc, imports the key only by its full fingerprint, runs gpgv, and exits non-zero unless the output reports a good signature from that key. Then break it on purpose: overwrite one byte in a copy of the file (`printf 'X' | dd of=copy.tar.xz bs=1 seek=1000 conv=notrunc`) and pair a correct file with the signature of a different version. Confirm both fail and log the exact messages.",
    reflect:[
      "Onion addresses are self-authenticating, so why is a link list still an unacceptable source for them?",
      "What does the Safest level protect you from that three relays do not, and what does it cost?",
      "Why might the onion mirror of a site load faster, or slower, than the same site reached through an exit relay?"
    ],
    safety:"Lawful use only: visit only the official mirrors named in this lab, with addresses copied from their operators' own pages. Do not browse onion directories or link lists, and do not download or open files over Tor. Tor is legal in the US and most countries; check your own country's law first."
  },
  "p47lab2":{
    time:"2–3 h",
    setup:[
      "A browser and a spreadsheet (LibreOffice Calc, Excel or Google Sheets), or Python with pandas and matplotlib. All data comes from the public clearnet site metrics.torproject.org; no Tor connection is needed.",
      "The pages you need: Users (relay users and bridge users by country, each with a 'Download as CSV' link under the graph, and the Top-10 country tables for each), and Servers and Traffic (relays and bridges, relays by flag for the Exit count, total relay bandwidth). Set the date range to the last six months. Page names occasionally change; use the site's navigation if a link has moved.",
      "Read the Tor Metrics explanation of how user numbers are estimated before you begin: users are inferred from directory requests, so they are estimates with known artefacts, not a headcount.",
      "An analysis document with sections: question, sources (URL and download date), method, results, judgment with confidence, caveats."
    ],
    checkpoints:[
      "Your folder holds the downloaded CSVs, named with the download date, and two charts built from them, each with a title, labelled axes, units and the line 'Source: Tor Metrics, metrics.torproject.org, downloaded <date>'.",
      "The arithmetic is written out: for one country row, total = users / (percentage / 100); for example 576,000 users at 17.9% implies about 3.2 million. A second row gives a total within a few per cent of the first, and you explain the small difference (rounding, averaging period).",
      "You name the top three bridge-user countries with their shares, and for each spike in the window you cite a dated public source (news report, Tor Project blog or forum post, OONI report) with a plausible explanation, or write 'no explanation found'. You state whether the event comes before the spike.",
      "A table records the relay count, Exit-flag relay count, and advertised and consumed bandwidth (Gbit/s) at the start and end of the window, with the percentage change."
    ],
    hints:[
      "Treat the graphs as evidence with error bars, not as facts. Before explaining a spike, check whether it appears in both relay and bridge users, and whether Tor Metrics marks it as a possible censorship event.",
      "Bridge users are a censorship map: people switch to bridges when direct connections are blocked. A rise in a country's bridge users together with a fall in its relay users is the classic signature of a block.",
      "Write the judgment in one ICD 203 phrase with its band, for example 'it is likely (55–80%) that the rise in bridge users from country X after <date> reflects blocking of direct Tor connections', then list the evidence and one observation that would lower your confidence, such as no matching OONI measurements."
    ],
    trouble:[
      ["The CSV opens as one wide column or with junk rows at the top","Comment lines precede the header, or your spreadsheet expects a different delimiter","Open it in a text editor, note the comment lines, and import with a comma delimiter, skipping them (in pandas, `pd.read_csv(path, comment='#')`)."],
      ["Totals computed from two countries differ by more than 10%","The rows came from different tables (relay vs bridge), periods or averages","Check that both rows come from the same table and period. Write the formula and the source cell next to every number."],
      ["A dramatic spike has no news explanation","Not every spike is censorship: measurement artefacts, botnets and misconfigured client fleets also move the estimate","Diagnose by shape first (a sudden jump that then stays flat is often automated clients), compare relay and bridge series, search the Tor Project blog and forum, and if nothing fits, say so and lower your confidence."]
    ],
    challenge:"Test your explanation quantitatively. For one country and one event date, compute mean daily users for the 14 days before and after, then compare that change with the distribution of every 14-day change in your six-month window: is it unusual? Cross-check OONI Explorer's Tor reachability measurements for that country and period, and revise your confidence band in writing.",
    reflect:[
      "Why does Tor Metrics estimate users from directory requests instead of counting them, and what kinds of error does that method create?",
      "Why is the bridge-user table a better censorship indicator than the relay-user table?",
      "What evidence would move your key judgment from 'likely' to 'very likely'?"
    ],
    safety:"Use only public, aggregate data. Keep the analysis at country and network level, and do not attempt to identify or track individual Tor users or relay operators."
  },
  "p47lab3":{
    time:"2–3 h",
    setup:[
      "An Intel or AMD (x86-64) computer you own or may use that can boot from USB. Tails does not run on Apple Silicon Macs or ARM laptops. Note the RAM figure from the Tails system-requirements page for step 4.",
      "A USB stick of 8 GB or more that you are willing to erase completely, and ideally a phone or second computer to read the instructions while Tails is running.",
      "Download Tails only from tails.net and follow its installation guide for your operating system; it includes the verification step and names the USB-writing tool to use. Do not take Tails images from other mirrors or torrents.",
      "Know your computer's boot-menu key before you start (often F12, F9, F10 or Esc on PCs; hold Option on Intel Macs). Back up the computer first: Tails will not touch its internal disk, but choosing the wrong disk while writing the USB is the classic accident."
    ],
    checkpoints:[
      "The verification step on tails.net reported success (or your OpenPGP check against the Tails signing key printed a good signature), the image was written to the stick whose name and size you checked twice, and the stick appears in your computer's boot menu.",
      "Tails reaches the Welcome Screen and the desktop, and Tor Connection reports connected. You created a file on the Desktop and a Tor Browser bookmark; after shutdown and a second boot, neither exists. Your table's first row reads: file gone, bookmark gone.",
      "Persistent Storage is created with a strong passphrase and unlocked at the Welcome Screen on the next boot, and its settings show which features are on. After a reboot, the table records what survived: a file in the Persistent folder survives, bookmarks survive only if that feature is on, and a file on the Desktop and the browsing history do not.",
      "Your notes give the Tails version (About Tails), the Tor Browser version (Tor Browser menu > Help > About Tor Browser) and the RAM requirement from the official page, each with the date checked."
    ],
    hints:[
      "Amnesia means nothing is written to the computer's disks and the live system starts fresh every boot. Persistent Storage is an opt-in exception: an encrypted partition on the same stick that keeps only the features you enable.",
      "Persistent Storage does not make the whole system persistent. Test each kind of thing separately: a Desktop file, a file in the Persistent folder, a bookmark, browsing history, a saved Wi-Fi password.",
      "Add one more row: boot with Persistent Storage present but do not unlock it at the Welcome Screen. Tails then behaves exactly as it did without it, which is why the stick is safe to boot on a borrowed computer."
    ],
    trouble:[
      ["The computer ignores the stick and boots its normal operating system","The boot menu was not opened in time, Windows Fast Startup skipped it, or firmware boot order or Secure Boot settings interfere","Press the boot-menu key immediately at power-on; from Windows, hold Shift while clicking Restart and choose 'Use a device'. Follow the Tails start page for your computer type if Secure Boot blocks it."],
      ["Black screen or an error after the Tails boot menu","Graphics hardware the default drivers do not handle, or a bad write","Try the Troubleshooting Mode boot entry. If that fails, re-verify the download and rewrite the stick before blaming the hardware."],
      ["Tor Connection cannot connect","The network blocks Tor, the clock is far off, or a captive portal (hotel, café) wants a login","Try a bridge (obfs4 or Snowflake) in Tor Connection. For a captive portal, use the Unsafe Browser only to log in, as Tails documents. On your home network, check that the router is not filtering."],
      ["The bookmark is gone even with Persistent Storage","The Tor Browser Bookmarks feature is off, or Persistent Storage was not unlocked at the Welcome Screen","Turn the feature on in the Persistent Storage settings, reboot and unlock. This is the main finding of step 3: persistence is per feature."]
    ],
    challenge:"Write a threat-by-threat comparison of Tails and Whonix for five threats: malware on the host, a compromised browser, a seized USB stick, forensic examination of the computer's disk, and a network observer. For each, say which tool protects you, why, and at what cost. Then test the claim you can test safely: after a Tails session, boot the computer's normal OS and look for traces (recently modified files, new entries in its logs) to support or refute the amnesia claim.",
    reflect:[
      "Why is running only from RAM a different protection from encrypting a disk, and which adversaries does each one stop?",
      "When does Tails beat Whonix, and when does Whonix's separate Gateway and Workstation matter more?",
      "What risk do you accept when you turn on Persistent Storage, and how much does the passphrase change it?"
    ],
    safety:"Writing the image erases the USB stick: confirm the device name and size before writing, and never select the computer's internal disk. Use Tails only for lawful purposes; it is legal in the US and most countries, but check your local law and any employer or school policy for the computer you boot."
  },
  "p47lab4":{
    time:"2–3 h",
    setup:[
      "A Linux VM you own (Debian 12 or 13, or Ubuntu 24.04) with a snapshot taken before you start, and Tor Browser on your host to visit the service. Install tor from your distribution (`sudo apt install tor`) or from the Tor Project's own Debian repository as described on support.torproject.org.",
      "A tiny static page with only your own text: `mkdir ~/site && echo '<h1>My lab onion service</h1>' > ~/site/index.html`.",
      "Python 3 (for the web server and the address computation) and the formula from Module 3: address = base32(PUBKEY | CHECKSUM | VERSION) + '.onion', where CHECKSUM is the first 2 bytes of SHA3-256('.onion checksum' | PUBKEY | VERSION) and VERSION is the byte 0x03.",
      "Keep the web server bound to 127.0.0.1 so nothing on your LAN can reach it; tor connects to it locally."
    ],
    checkpoints:[
      "`cd ~/site && python3 -m http.server 8080 --bind 127.0.0.1` is running; `curl -s http://127.0.0.1:8080` returns your HTML; `ss -ltn` shows the listener on 127.0.0.1:8080, not 0.0.0.0:8080; `systemctl status tor` shows tor active.",
      "/etc/tor/torrc contains `HiddenServiceDir /var/lib/tor/my_service/` and `HiddenServicePort 80 127.0.0.1:8080`. After `sudo systemctl restart tor`, `sudo cat /var/lib/tor/my_service/hostname` prints 56 base32 characters plus .onion (62 in all), and the directory also holds hs_ed25519_public_key and hs_ed25519_secret_key.",
      "Tor Browser loads http://<your address>.onion and shows your page. In the circuit display, your client-side relays appear with countries, the third being the rendezvous point, followed by service-side hops your browser cannot see, shown without location. You count six relays and explain which three your client chose and which three the service chose.",
      "Your Python output prints the computed address and the hostname file side by side, and they match exactly. Changing one byte of the key changes the checksum, so the address changes completely."
    ],
    hints:[
      "The address is not looked up anywhere: it is the public key. Once you have the 32 key bytes, the rest is a fixed recipe of checksum, version byte and base32.",
      "The public-key file is not just the key. It begins with a 32-byte header ('== ed25519v1-public: type0 ==' padded with zero bytes) followed by the 32-byte key, so read the file as bytes and take the last 32. Only the tor user can read the directory, so run your script with sudo or copy the file first.",
      "In Python: `hashlib.sha3_256(b'.onion checksum' + pub + b'\\x03').digest()[:2]` gives the checksum, and `base64.b32encode(pub + chk + b'\\x03').decode().lower() + '.onion'` gives the address. Use SHA3-256, not Keccak-256, which some crypto libraries offer under a confusingly similar name."
    ],
    trouble:[
      ["tor will not start, and the log says 'Permissions on directory /var/lib/tor/my_service/ are too permissive'","You created the directory yourself, or it is not owned by the tor user","Delete it and let tor create it, or run `sudo chown -R debian-tor:debian-tor /var/lib/tor/my_service && sudo chmod 700 /var/lib/tor/my_service` (debian-tor on Debian and Ubuntu). Validate the config with `sudo -u debian-tor tor --verify-config`."],
      ["The hostname file never appears","tor did not read your change (wrong file, typo) or failed to start","Read the log before the file system: `journalctl -u tor@default -e` on Debian and Ubuntu names the line and the problem. Then check the spelling of HiddenServiceDir and HiddenServicePort."],
      ["Tor Browser says 'Onion site not found' or 'Unable to connect'","The descriptor is not published yet, the local web server is down, or HiddenServicePort points at the wrong port","Wait a minute or two after a restart, confirm `curl http://127.0.0.1:8080` works on the VM, and compare the port in torrc with the server's port."],
      ["Your computed address does not match the hostname file","You used the whole 64-byte file, forgot the version byte, used Keccak instead of SHA3-256, or compared upper case with lower case","Print len(pub) (it must be 32) and the checksum in hex, then check each ingredient of the formula in order."]
    ],
    challenge:"Go one level deeper into the protocol. Enable client authorization: generate an x25519 key pair, place the public half in the service's authorized_clients directory and give the private half to Tor Browser, then show the page now loads only for the authorized client. Next, serve a second local page on another port with a second HiddenServicePort line, and explain from the descriptor and rendezvous design why someone who knows your address still cannot learn your VM's IP.",
    reflect:[
      "Your onion service never accepts an inbound connection. How does that one design choice hide its location?",
      "Why does a self-authenticating address remove the need for DNS and certificate authorities, and what new problem does it create for users?",
      "Real onion services have still been located. Name two ways it has happened, and say which your lab setup would be exposed to."
    ],
    safety:"Run the service only on your own VM, serving only your own static lab page; keep the web server bound to 127.0.0.1 and shut the service down when the lab ends. Host nothing for anyone else and nothing you would not publish under your own name."
  },
  "p47lab5":{
    time:"3–4 h",
    setup:[
      "Primary sources: the DOJ press release (justice.gov) or Europol press release (europol.europa.eu) for your chosen takedown, and at least one court document. Free routes: DOJ releases often link the complaint or indictment, and CourtListener's RECAP archive (courtlistener.com) holds many federal filings. PACER charges per page but waives small quarterly totals.",
      "All reading is on the clearnet. You do not visit any dark-web site, mirror or seizure banner, and you do not need Tor for this lab.",
      "A source register: for each document, its title, issuing body, date, URL, download date, and a short citation code (for example [DOJ-PR 2017-07-20] or [Compl. para 34]).",
      "A brief template: bottom line up front, timeline, failure and method taxonomy, two defender lessons, sources."
    ],
    checkpoints:[
      "The source register holds at least one press release and one court filing for the same case, with dates and URLs. You note each filing's type (complaint, indictment, forfeiture complaint, judgment) and what it represents: allegations unless it is a plea, verdict or judgment.",
      "The timeline has ten or more dated entries, each cited to a page or paragraph. Every amount carries its currency and the conversion date or method the source used, because cryptocurrency values move.",
      "A table classifies each OPSEC failure and investigative method named in the documents as identity, infrastructure, money, physical or platform, with a citation per row. Nothing appears that is not in a document; your own inferences sit in a separate, labelled column.",
      "Two defender lessons each follow from a specific table row and name a concrete control (for example 'keep research identities separate from personal accounts in our intel team', or 'blockchain analytics in our fraud monitoring')."
    ],
    hints:[
      "Press releases summarise; court documents give the detail and the dates. When they disagree, the filing usually wins, and the disagreement is worth a footnote.",
      "In complaints and affidavits, look for the paragraphs describing how the investigation proceeded; they list the methods. Classify each by what was linked to what: a handle to an email (identity), a server to a hosting account (infrastructure), a wallet to an exchange account (money).",
      "Write every sentence so a reader could check it: claim, then citation. Use 'alleged' for anything in a complaint or indictment and 'according to' for press-release figures. Turn each lesson into something a team could start on Monday."
    ],
    trouble:[
      ["You cannot find a court document for your case","It is sealed, filed under a different case name, or not on free archives","Search CourtListener by the defendant and district named in the press release and check whether the release links a PDF. If nothing public exists, pick another of the four cases rather than leaning on secondary summaries."],
      ["Two sources give different amounts or dates","Different conversion dates, different measures (seized vs alleged revenue), or a later correction","Record both with citations and explain the difference in a footnote; never average them."],
      ["The timeline fills with facts from news articles and blogs","Secondary sources are easier to read","Use them only to find primary documents. A fact found only in a news story is labelled as such, or dropped."],
      ["The brief reads like a story about the defendants","Narrative pulls attention to people rather than methods","Restructure around the taxonomy and the lessons: a defender needs what was detectable and which control helps, not a biography."]
    ],
    challenge:"Brief a second case from the list and build a comparison: count failures and methods per taxonomy category for both takedowns, and identify which category produced the decisive link in each, according to the documents. Then write one cited paragraph on what the pattern means for a corporate threat-intelligence team investigating fraud against its own company, separating what a company may do itself from what needs law enforcement and legal process.",
    reflect:[
      "Why does the difference between an allegation in a complaint and a finding in a judgment matter for a brief a decision-maker will rely on?",
      "Which category of failure appears most often across takedowns, and why might that be?",
      "Which investigative methods in your case could a defender inside a company lawfully use, and which are available only to law enforcement with legal process?"
    ],
    safety:"Clearnet public documents only: do not visit dark-web markets, forums, mirrors or seized-site pages, and do not seek out leaked data. Describe defendants only as the documents do, use 'alleged' for unproven claims, and do not research uncharged people named in passing."
  },
  "p47lab6":{
    time:"two sessions of 2–3 h",
    setup:[
      "A fictional company: name, sector, size, country, an obviously fictional domain (for example under example.com) or one you own, key systems and suppliers. Check that the name does not match a real company.",
      "Sources, all public and on the clearnet: Tor Metrics; ransomware.live, used only for aggregate counts of leak-site postings by sector and month; Have I Been Pwned's public breach list and descriptions (not searches of other people's addresses); CISA and national CERT advisories; vendor reports; news and press releases.",
      "A collection log (date and UTC time, source, URL, what was taken, hash of any capture, the rule of engagement that applies) and a report template (BLUF, key judgments with ICD 203 confidence, Admiralty grades, impact, actions with owners, IOC appendix as CSV or STIX 2.1, TLP marking, methodology statement).",
      "Rules of engagement written before collection: public sources only, no interaction with threat actors, no purchases, no downloads of stolen data, no personal data of real individuals, and stop and report if anything unlawful is encountered."
    ],
    checkpoints:[
      "The company profile and three to five intelligence requirements exist, each a question a decision depends on (for example 'Are ransomware groups posting more victims from our sector this year than last, and which initial-access methods do advisories cite?').",
      "The collection log shows every source with URL and time, and each item maps to a requirement. From ransomware.live you took counts and dates by sector only, no victim names or data, and you followed no links to leak sites.",
      "The report has every required part: a BLUF under 60 words; two or three key judgments, each with an ICD 203 phrase and band; an Admiralty grade per source; impact in business terms; actions with owner roles (CISO, IT operations, finance) and deadlines; an IOC appendix taken only from public advisories; a TLP marking such as TLP:AMBER; and a methodology statement listing every rule kept.",
      "Three CISO questions are written down with your answers, and the revised report shows what changed in response: a lowered confidence, a sharper action, or an unsupported claim removed."
    ],
    hints:[
      "Start from the decisions, not the data. A requirement no decision depends on produces pages nobody reads, and every key judgment should answer one requirement.",
      "Aggregates do the work here: sector counts over time, the share of advisories that cite a given initial-access technique, the number of public breaches in your sector. They support judgments without touching anyone's stolen data.",
      "Build each key judgment as: one sentence with its ICD 203 phrase and band; two or three sourced points with Admiralty grades; what would change it. The action follows directly: who does what by when."
    ],
    trouble:[
      ["You find nothing specific to your company","It is fictional, so there is no company-specific exposure to find","That is expected. Report sector-level threat and state in the methodology that public sources gave no company-specific findings. A good report states its limits."],
      ["A source page links to a leak site or offers downloadable data","Trackers and news articles sometimes link to raw material","Do not follow it. Log that the link existed and was not followed, under your stop rule."],
      ["Every judgment says 'likely'","Confidence words used as decoration rather than measurement","For each, list the evidence and the alternatives you considered. If you cannot say what would raise or lower it, the confidence is not calibrated."],
      ["The IOC appendix has indicators you cannot source","They were copied from an aggregator without the original advisory","Keep only indicators traceable to a dated advisory or report, with source and date in each row, and drop the rest."]
    ],
    challenge:"Make the report a repeatable product: produce it again a month later using only your logged method, and add a 'changes since last report' section with the numbers that moved. Convert the IOC appendix to a STIX 2.1 bundle (by hand or with the stix2 Python library), show that it loads, for example into the MISP instance from Domain 32, and explain which fields a SOC analyst would actually use.",
    reflect:[
      "Why does a methodology statement raise a report's value to a CISO rather than being bureaucratic padding?",
      "Which of your rules of engagement protects the company legally, and which protects you as the analyst?",
      "How would your judgments change if you were allowed to monitor closed forums under legal supervision, and what new risks would that bring?"
    ],
    safety:"Public, legal, clearnet sources only: no onion sites, forums, chat channels, purchases or downloads, and no contact with threat actors. Use aggregate counts, not victims' names or data, include no personal data of real individuals, and stop and report if you meet illegal material."
  }
});
