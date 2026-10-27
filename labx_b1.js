/* Lab guides - batch 1 (domains p1,p2,p3,p4,p5,p6,p7,p9,p12,p13,p14,p15) */
window.LABX=window.LABX||{};

Object.assign(window.LABX,{
  "p1lab1":{
    time:"60-90 min",
    setup:[
      "Paper, a pencil and an eraser; optionally a ruler for neat gate boxes. No computer is required for the drawing itself.",
      "Recall the half adder: Sum = A XOR B, Carry = A AND B. Keep that and the binary addition table (0+0, 0+1, 1+1) in front of you.",
      "Optional: open the app's Logic Gate Playground to confirm how AND, OR and XOR behave before you wire a full adder by hand."
    ],
    checkpoints:[
      "Your full-adder drawing shows two half adders feeding one OR gate, with inputs A, B and Cin and outputs Sum and Cout.",
      "Four full adders are chained left to right, each stage's Cout wired into the next stage's Cin, and the first Cin tied to 0.",
      "Tracing 0101 + 0011 gives 1000 (8), with the carry out of bits 0,1,2 all 1 and the carry out of bit 3 equal to 0.",
      "Tracing 1111 + 0001 gives 0000 with a final carry-out of 1, and you can state why that overflows a 4-bit result.",
      "You wrote a sentence saying the top carry-out is the unsigned carry flag and that the true answer 10000 needs a 5th bit."
    ],
    hints:[
      "Decide first what each half adder computes on its own (one makes the sum bit, one makes a carry) and what the single OR gate is there to combine.",
      "A full adder is Sum = A XOR B XOR Cin and Cout = (A AND B) OR (Cin AND (A XOR B)); the OR merges the two places a carry can come from.",
      "In the ripple chain the only wire between stages is Cout into the next Cin, which is why it is 'ripple'; 1111 + 0001 overflows because the carry out of bit 3 has nowhere to go in four bits.",
      "Redo any disputed sum as a table with columns A, B, Cin, Sum, Cout for each bit position so no carry is left implicit."
    ],
    trouble:[
      ["A sum bit is right but a carry column is blank","You tracked Sum without writing each stage's Cout","Redo the trace as a per-bit table with A, B, Cin, Sum and Cout columns so every carry is explicit"],
      ["Your full adder seems to need two OR gates","You tried to OR the sum path as well as the carry path","Only one OR is needed and only for the carry; the Sum output is pure XOR of A, B and Cin"],
      ["1111 + 0001 gave 10000 and you kept all five bits","You treated it as arbitrary-width addition","A 4-bit adder has only four Sum outputs; the fifth bit is the carry-out flag, not a stored result bit"],
      ["You cannot decide if the result is a carry or an overflow","You are mixing unsigned carry with signed overflow","Unsigned overflow is the carry-out of the top bit; signed overflow is when carry-in and carry-out of the top bit differ - name which you mean"]
    ],
    challenge:"Convert your ripple adder into a 4-bit subtractor by adding an XOR gate on each B input controlled by a 'subtract' line and feeding that same line into the first Cin (two's-complement negation). Trace 0101 - 0011 and explain why the carry-out now means 'no borrow' instead of 'carry'.",
    reflect:[
      "Why does ripple-carry addition get slower as you add more bits, and what does that cost a real CPU in terms of its clock period?",
      "Give one addition where the carry flag and the signed-overflow flag disagree, and say which one an unsigned comparison in C relies on."
    ]
  },
  "p1lab2":{
    time:"two sessions of 2-3 h",
    setup:[
      "A Java runtime: install a current OpenJDK (for example Temurin 17 or newer) so the Nand to Tetris tools launch; confirm with 'java -version'.",
      "Download the free Nand to Tetris Software Suite from nand2tetris.org (a zip with HardwareSimulator and the project files), or use the web IDE on the same site.",
      "A plain text editor for the .hdl files, and the course's HDL syntax guide open for reference.",
      "Keep all the .hdl files for one project together in that project's folder so the simulator can find each sub-chip."
    ],
    checkpoints:[
      "The suite unzips and HardwareSimulator (or the web IDE) opens and loads a .hdl file without a Java error.",
      "Project 1: Not, And, Or, Xor and Mux (plus the 16-bit and multi-way versions) each pass their .tst script with 'Comparison ended successfully'.",
      "Project 2: HalfAdder, FullAdder, Add16 and the ALU all pass, including the ALU's zr (zero) and ng (negative) output flags.",
      "Project 3: Bit, Register, RAM8 and the PC pass, and your PC correctly resets, loads and increments across its test script.",
      "You wrote down which chip took the most attempts and the reason it was hard."
    ],
    hints:[
      "Every chip is built only from primitives you already made plus Nand; sketch the wiring on paper before typing any HDL.",
      "Mux is the workhorse: once Not and Mux exist, And, Or and the wide and multi-way versions are repetition, and the ALU is mostly prebuilt pieces plus the zr and ng logic.",
      "For the ALU, apply zx/nx to x and zy/ny to y with Mux16, select add-or-and with the f bit, negate the result with no, then derive zr by OR-ing all 16 output bits and ng from the sign bit.",
      "When a test fails, open the .out and .cmp side by side, find the first differing input row, and trace exactly those values through your wiring."
    ],
    trouble:[
      ["HardwareSimulator will not start and no window appears","Java is missing or the wrong version","Run 'java -version'; install OpenJDK 17+ and launch the suite's script, or use the web IDE at nand2tetris.org instead"],
      ["A chip loads but the test ends with a comparison mismatch","Your output differs from the supplied .cmp on some input row","Open the .out versus the .cmp, find the first differing row, and trace those exact inputs through your gates"],
      ["'Cannot find part' or an HDL parse error appears","A part name or pin is misspelled or the sub-chip file is elsewhere","Keep all your .hdl files in the one project folder; part and pin names are case sensitive and must match the chip interface"],
      ["Your Xor passes but Mux fails its test","You swapped the a and b inputs or mis-wired sel","Mux outputs a when sel is 0 and b when sel is 1; check both sel values by hand before running the script"]
    ],
    challenge:"Rebuild Xor from scratch using only four Nand gates (do not reuse your And/Or/Not) and confirm it still passes its test. Then expand your ALU completely into Nand gates and count them; compare that gate count to a real 74181-style ALU chip and note what the real chip adds that your HDL ignores.",
    reflect:[
      "Project 3 chips need a clock but Project 1-2 chips do not - what distinguishes combinational from sequential logic, and why does a Register require the DFF?",
      "You built the ALU before the CPU - why is it fair to say the ALU has no memory of previous operations, and where does that memory live instead?"
    ]
  },
  "p1lab3":{
    time:"60-90 min",
    setup:[
      "A Windows PC for Task Manager; on Linux substitute lscpu, lspci and dmidecode, and on macOS system_profiler, to read the same facts.",
      "Download CPU-Z from cpuid.com and HWiNFO from hwinfo.com (both free); you may need administrator rights to run them.",
      "A calculator or a spreadsheet for the bandwidth arithmetic, and a document to write the one-page summary.",
      "Have your GPU model and RAM configuration (number of sticks/channels) to hand so the spec numbers mean something."
    ],
    checkpoints:[
      "Task Manager Performance tab shows your physical cores, logical processors, L1/L2/L3 cache sizes, memory speed and channel count, and you recorded each.",
      "CPU-Z and HWiNFO confirm the ISA extensions present (for example AVX2), the boost clock, and the PCIe generation and lane width of your GPU slot.",
      "You computed a theoretical memory bandwidth in GB/s from transfer rate, bus width and channel count, and a PCIe bandwidth figure for the GPU slot.",
      "Your one-page summary names one workload the machine is well suited to and one it is poorly suited to, each justified by a number you recorded."
    ],
    hints:[
      "Theoretical memory bandwidth comes from three numbers you already have: the transfer rate, how wide one channel is, and how many channels you populated.",
      "DDR moves 64 bits per channel per transfer, so DDR4-3200 is 3200 MT/s x 64 / 8 bytes per second per channel; multiply by the number of channels.",
      "PCIe per-lane one-way rates are roughly 0.985 GB/s (Gen3), 1.969 GB/s (Gen4) and 3.938 GB/s (Gen5); multiply by the slot width (usually x16).",
      "If your computed bandwidth is off by a factor of eight, you mixed bits and bytes - MT/s times bus width gives bits per second, so divide by 8 for bytes."
    ],
    trouble:[
      ["Task Manager shows one CPU graph instead of per-core","The logical-processor view is collapsed","Right-click the CPU graph, choose 'Change graph to' then 'Logical processors'; socket/core/thread counts sit under the graph"],
      ["Your measured bandwidth looks half what reviews quote","Only one DIMM is populated, so memory runs single-channel","Check CPU-Z's Memory tab for the channel count; a single stick halves bandwidth, so populate the matched slots for dual-channel"],
      ["One tool lists AVX-512 and another does not","Some consumer chips have AVX-512 fused off or disabled in firmware","Trust the instruction-set line in CPU-Z/HWiNFO; a feature can exist on the die yet be disabled by the vendor"],
      ["The channel/slot details are blank in Task Manager","Windows cannot always read full memory topology","Cross-check with CPU-Z's SPD and Memory tabs, which read the module and controller directly"]
    ],
    challenge:"Download or compile a free memory-bandwidth benchmark (for example STREAM, or Intel MLC) and measure your actual sustained bandwidth. Explain why the measured figure is typically only 60-85% of your theoretical peak, and point to the part of the memory system (controller efficiency, refresh, row activation) that eats the difference.",
    reflect:[
      "Your L3 cache is a few megabytes but RAM is many gigabytes - using your recorded sizes, explain why a program that fits in L3 can run many times faster than one that streams from RAM.",
      "Would a memory-bound workload gain more from doubling the RAM clock on one channel, or from adding a second channel at the old clock, and why?"
    ]
  },
  "p1lab4":{
    time:"45-60 min",
    setup:[
      "Python 3.11 or newer installed from python.org or your OS package manager, and a terminal in which you can run a .py file.",
      "Optional but recommended: a virtual environment with NumPy installed ('python -m pip install numpy') for the third step.",
      "Enough free RAM to hold a list of tens of millions of integers, which is needed to exceed your cache and see the effect.",
      "Ask Claude for the 20-line script that sums a large list sequentially and then in a shuffled order, timing each pass."
    ],
    checkpoints:[
      "Running the script prints two timings and the sequential sum is measurably faster than the random-order sum on a large list.",
      "You can state the random-to-sequential time ratio and explain it in terms of cache-line misses rather than the additions themselves.",
      "The NumPy array sum is far faster than both Python loops, and you can name two reasons (contiguous memory and a vectorized C/SIMD loop)."
    ],
    hints:[
      "The work of adding N numbers is identical in both orders, so any time difference has to come from how memory is accessed, not from the arithmetic.",
      "A CPU fetches a whole 64-byte cache line at once: sequential access uses every byte it fetched and the prefetcher guesses the next line, while random access often uses one value and discards the rest.",
      "A Python list stores pointers to int objects scattered on the heap, so even 'sequential' indexing chases pointers; a NumPy array packs the numbers contiguously, which is why np.sum runs a tight SIMD loop in C.",
      "If the two timings are equal, your list fits entirely in cache - raise N into the tens of millions until the data exceeds your L3."
    ],
    trouble:[
      ["The two timings are nearly identical","The data fits in cache, so access order does not matter","Increase N until the list clearly exceeds your L3 size; only then does the miss penalty appear"],
      ["The random pass is slow but you shuffled inside the timed section","You timed the shuffle, not the summation","Build the shuffled index list or shuffle the data before starting the timer; time only the sum loop"],
      ["ModuleNotFoundError: No module named numpy","NumPy is not installed in the interpreter you ran","Activate your venv and run 'python -m pip install numpy' for that same interpreter"],
      ["The NumPy sum returns an odd value or overflows","The default integer dtype wrapped around","Build the array with dtype=np.int64 (or float64) so the running total does not overflow"]
    ],
    challenge:"Vary the stride: sum every element of a large array, then every 2nd, 4th, 8th, 16th and 32nd, timing each and dividing by the number of elements touched. Plot time-per-element against stride and find the stride where it stops rising; explain how that reveals your 64-byte cache-line size and, at larger strides, the page size.",
    reflect:[
      "Why does a NumPy array of ten million int64 use predictable contiguous memory while a Python list of the same integers does not, and what does that mean for cache behaviour?",
      "Prefetching helps sequential access; describe a real access pattern (such as traversing a linked list) where prefetching cannot help, and what data-structure change would fix it."
    ]
  }
});

Object.assign(window.LABX,{
  "p2lab1":{
    time:"60-90 min",
    setup:[
      "Your PC on the home network, with a terminal for ipconfig /all (Windows) or 'ip addr' and 'ip route' (Linux/macOS).",
      "Admin access to your router's web interface: find the gateway IP from ipconfig and the login (often on a sticker on the router).",
      "A drawing tool - paper is fine, or the free draw.io / diagrams.net - to lay out the topology.",
      "Permission to view the router's device list and DHCP settings (it is your own network, but note any guest/VLAN separation)."
    ],
    checkpoints:[
      "ipconfig /all (or ip addr) output shows your IPv4 address, subnet mask, default gateway, DNS servers and the NIC's MAC address, all recorded.",
      "The router admin page lists attached devices with their IP addresses and shows the DHCP pool start and end.",
      "Your diagram runs modem -> router -> any switch/AP -> devices, labelled with media type (Ethernet / Wi-Fi band) and each device's IP.",
      "You marked where NAT translates private to public addresses and where the single broadcast domain ends."
    ],
    hints:[
      "Everything behind your router shares one private subnet; read the mask to work out how many host addresses that subnet can hold.",
      "The default gateway is the router's LAN address; its WAN side holds the public IP from your ISP, and NAT happens at that boundary.",
      "A broadcast stays inside one subnet or VLAN and the router does not forward it to the internet, so the broadcast domain ends at the router's LAN interface - a plain switch or AP extends it, a router does not.",
      "Private addresses live in the 192.168, 10 and 172.16-31 ranges; if a device shows a different range it is probably on a guest SSID or separate VLAN."
    ],
    trouble:[
      ["The router login page will not load at the gateway IP","Wrong address, or HTTP/HTTPS mismatch","Use the 'default gateway' from ipconfig as the URL and try http:// explicitly; the admin password is often on the device sticker"],
      ["Two devices in your notes show the same IP","You mixed the public WAN IP with a LAN IP, or read an expired lease","Private LAN IPs are in 192.168/10/172.16-31; the WAN IP is public - label them separately on the diagram"],
      ["Your phone's IP is in a different subnet than your PC","A guest network or mesh node puts it on another subnet/VLAN","Note which SSID or VLAN each device is on; guest networks are deliberately isolated subnets"],
      ["You cannot find the MAC address","You are reading the wrong adapter","In ipconfig /all it is the 'Physical Address'; match the adapter (Wi-Fi vs Ethernet) that is actually connected"]
    ],
    challenge:"Add IPv6 to the same diagram: run ipconfig or 'ip -6 addr', identify your link-local (fe80::) address and any global address, and explain why an IPv6 host often holds several addresses at once and why NAT is usually absent on IPv6. Draw both address families on each device.",
    reflect:[
      "Your whole house shares one public IP - explain, in terms of NAT and port mapping, how the router keeps two laptops' simultaneous web requests from getting confused.",
      "If you moved one device onto a separate VLAN, what broadcast-based feature (printer or casting discovery, say) would break, and why?"
    ]
  },
  "p2lab2":{
    time:"2-3 h over several sessions",
    setup:[
      "Paper and pencil - do the drills by hand first before trusting any calculator or website.",
      "Know the baseline that /24 is 255.255.255.0 and the powers of two up to 256; keep a mask-to-block-size table handy.",
      "A timer or stopwatch to measure your per-problem time, and a sheet to log errors.",
      "Ask Claude for 20 random CIDR problems from /22 to /30, and have it mark your answers afterwards."
    ],
    checkpoints:[
      "You have 20 written problems, each a CIDR such as 10.4.0.0/22, solved for network, broadcast, usable range and host count.",
      "Your error log records the mistakes that recur (for example off-by-one on broadcast, or the wrong block size).",
      "You reached ten correct answers in a row, each in under 60 seconds, and recorded your best single time."
    ],
    hints:[
      "Work only in the one octet where the mask splits; the block size there is 256 minus the mask value for that octet.",
      "Block size is 2^(32 - prefix) total addresses; for the interesting octet it is 256 minus that octet's mask value, and networks start at multiples of the block size.",
      "Network is the first address in the block; broadcast is the next block's start minus one; usable hosts are block size minus two, except /31 and /32.",
      "If you are slow, stop converting everything to binary: memorize that /25=128, /26=64, /27=32, /28=16, /29=8, /30=4 and work in decimal in the split octet."
    ],
    trouble:[
      ["Your broadcast address is one too high","You added the block size instead of block size minus one","Broadcast equals network plus block size minus one; the next network starts at network plus block size"],
      ["A /22 confuses you because the split is in the third octet","You tried to work it in the fourth octet","For /17 to /24 the split lands in the third octet; a /22 has block size 4 there, so networks step 0, 4, 8, 12"],
      ["You subtracted two hosts for a /31 and got zero","/31 and /32 are special cases","A /31 has two usable addresses by RFC 3021 (point-to-point) and a /32 is a single host; do not subtract two for these"],
      ["You keep miscounting usable hosts","You confused total addresses with usable ones","Usable equals 2^(32-prefix) minus 2 for the network and broadcast addresses, for /30 and larger blocks"]
    ],
    challenge:"Take a single /24 and design a VLSM plan for subnets that need 50, 25, 10 and 2 hosts with no wasted space: assign the largest first, write each subnet's mask, network, usable range and broadcast, and prove none of them overlap. That allocation skill is the real job behind the timed drill.",
    reflect:[
      "Why does every ordinary subnet lose two addresses to the network and broadcast addresses, and what changed to let /31 point-to-point links use both?",
      "Explain why a /22 gives 1022 usable hosts, and how you would split it into four /24s for separate departments."
    ]
  },
  "p2lab3":{
    time:"60-90 min",
    setup:[
      "Install Wireshark from wireshark.org (free; on Windows allow the bundled Npcap driver when prompted).",
      "Know the name of your active network interface so you capture on the right one.",
      "Pick a website you have not visited today so the capture includes a fresh DNS lookup; close chatty apps to reduce noise.",
      "Capture only your own traffic on your own network - do not capture on networks you do not control."
    ],
    checkpoints:[
      "A live capture on your active interface shows packets scrolling, and you can stop and save it to a .pcapng file.",
      "After visiting the site you located the DNS query and its A/AAAA response using the display filter 'dns'.",
      "You found the TCP three-way handshake (SYN, SYN-ACK, ACK) to the server using 'tcp.flags.syn==1'.",
      "You identified the TLS Client Hello and Server Hello with 'tls.handshake' and noted which OSI layer each captured packet belongs to."
    ],
    hints:[
      "Filter out the noise first: a one-word display filter for each protocol (dns, tcp, tls) isolates exactly what you need.",
      "The events happen in order: DNS resolves the name, TCP opens to port 443, then TLS negotiates - look for them in that sequence.",
      "Right-click a packet and choose Follow > TCP Stream to see one conversation; the Client Hello carries the server name (SNI) in cleartext even though the payload is encrypted.",
      "If no DNS packet appears, the name was cached or resolved over encrypted DoH - flush the resolver cache and use a genuinely new hostname."
    ],
    trouble:[
      ["No interfaces appear or capture is greyed out","The capture driver is not installed or you lack permission","On Windows reinstall Npcap and allow it; on Linux grant capture capability to your user rather than running everything as root"],
      ["The page loads but you see no DNS packet","The name was cached or resolved via encrypted DoH/DoT","Run 'ipconfig /flushdns' (or your OS equivalent) and use a fresh hostname; a browser using DoH makes the lookup look like HTTPS to the resolver"],
      ["Thousands of packets and you cannot find yours","No display filter is applied","Apply a filter such as 'ip.addr == <server ip>' once you know the server, or 'frame contains \"example\"' to find by hostname"],
      ["TLS shows only 'Application Data', never a Client Hello","You started the capture after the connection began","Start the capture first, then load the site; the handshake happens once at connection start"]
    ],
    challenge:"Capture the same site twice - once cold, once after the TLS session can resume - and compare the packet counts and the handshake. Explain what session resumption (or TLS 1.3 0-RTT) saved, and measure the difference in time-to-first-byte between the two loads.",
    reflect:[
      "The SNI and the server certificate reveal which site you visited even though the content is encrypted - state clearly what TLS protects and what it still leaks at the network layer.",
      "Map each captured packet to its OSI layer, and justify the claim that one web request touches layers 2 through 7 within milliseconds."
    ]
  },
  "p2lab4":{
    time:"45-60 min",
    setup:[
      "A terminal with tracert (Windows) or traceroute (Linux/macOS; install it if missing, or use tracepath which needs no root).",
      "Pick university sites on three continents (Europe, Asia, South America - .edu/.ac/.ac.xx hosts respond well).",
      "A map or great-circle distance tool to estimate each destination's distance, and a spreadsheet for the results table.",
      "Expect some routers to filter ICMP, so plan to record where the trace stops responding."
    ],
    checkpoints:[
      "tracert to each of three overseas hosts completes or clearly shows where it stops, with per-hop round-trip times recorded.",
      "You estimated each host's distance and computed its speed-of-light-in-fibre minimum RTT using about 200,000 km/s and doubling for the round trip.",
      "Your table lists distance, minimum theoretical RTT and measured RTT for each host, and you can explain the gap between them."
    ],
    hints:[
      "Light in fibre travels at roughly two-thirds of c, about 200,000 km/s, and RTT is a round trip, so remember to double the one-way distance.",
      "Minimum RTT in ms is about 2 x distance_km / 200, because 200,000 km/s equals 200 km per ms; everything above that is queuing, detours and processing.",
      "Packets rarely follow the great-circle line - they detour through peering points and submarine-cable landings - so compare measured against the straight-line minimum and attribute the surplus.",
      "If measured RTT is below your computed minimum, the 'foreign' site is probably served from a nearby CDN edge; check the responding IP's real location."
    ],
    trouble:[
      ["All hops after a few show '* * *'","A router or firewall is dropping or deprioritizing the probes","This is normal; record the last responding hops, try 'tracert -d' to skip DNS, or a TCP-based traceroute to port 443 which is less filtered"],
      ["RTT sometimes falls at a later hop","Routers deprioritize replies to their own control plane, so intermediate RTTs are not cumulative truth","Trust the destination's RTT most; mid-path spikes often mean a busy router, not real path latency"],
      ["Measured RTT is less than the speed-of-light minimum","Your distance estimate is too high, or a CDN edge answered locally","Verify the responding IP's geolocation; a local cache node will beat the straight-line time to the real country"],
      ["'traceroute: command not found' on Linux","The package is not installed","Install traceroute, or use 'tracepath', which does not require root privileges"]
    ],
    challenge:"Run the same three traceroutes at three different times of day and over both Wi-Fi and Ethernet. Chart how much the RTT and the first (last-mile) hop vary, and separate the stable propagation delay from the variable queuing delay in your numbers.",
    reflect:[
      "Two cities 10,000 km apart cannot have an RTT under about 100 ms no matter the budget - explain why, and what that means for interactive applications across continents.",
      "Your first hop to the router is sub-millisecond but hop two to the ISP may be 10-20 ms - what in the access network explains that jump?"
    ]
  },
  "p2lab5":{
    time:"45-60 min",
    setup:[
      "Python 3 on your PC and a folder containing a simple index.html to serve.",
      "Your PC's private IP address from ipconfig / ip addr, and a phone on the same Wi-Fi network.",
      "Know that your host firewall may block inbound connections, and that you should NOT port-forward to the public internet for this exercise.",
      "A second data path for the last step: cellular data on the phone (turn Wi-Fi off) to test reachability from outside."
    ],
    checkpoints:[
      "'python -m http.server 8000' prints 'Serving HTTP on 0.0.0.0 port 8000' and http://localhost:8000 shows your page on the PC.",
      "From the phone on the same Wi-Fi, http://<PC-private-IP>:8000 loads the page.",
      "From mobile data the same URL fails, and you can explain the failure using private addressing, NAT, CGNAT and the firewall."
    ],
    hints:[
      "A private IP only has meaning inside your home network; think about what a device on a completely different network would do with an address like 192.168.x.x.",
      "Your PC sits behind the router's NAT with a non-routable private address, and an outside client has no path to it and no port mapping pointing inward.",
      "Even with a forwarded port, many ISPs place you behind carrier-grade NAT (CGNAT) so you have no unique public IP, and the host firewall must still allow inbound 8000 for even the LAN test to work.",
      "Remember that 'localhost' always means the device you typed it on, so from the phone you must use the PC's LAN IP, never localhost."
    ],
    trouble:[
      ["The phone on Wi-Fi cannot reach the page either","The host firewall blocks inbound 8000, or AP client isolation is on","Allow Python/port 8000 through the firewall for private networks, and check the router for 'AP/client isolation' and disable it for the test"],
      ["'OSError: [Errno 98] Address already in use' / port is already allocated","Another process is holding port 8000","Use a different port ('python -m http.server 8080') or stop the other process; 'netstat -ano | findstr 8000' finds the PID on Windows"],
      ["You used localhost from the phone and it failed","localhost refers to the phone itself","Use the PC's LAN IP; 127.0.0.1 and localhost always point at the device you typed them on"],
      ["The page loads but images or links are missing","The files are outside the served folder","http.server serves the directory it was launched in; keep all assets under that folder and use relative paths"]
    ],
    challenge:"Without exposing anything to the public internet, reach the page from mobile data using a private overlay you control (a Tailscale network of your own devices, or an SSH tunnel to a VM you own). Then explain exactly which NAT problem the tunnel solved and from which side the connection is actually initiated.",
    reflect:[
      "Your browser reaches servers easily but your laptop as a server is hard to reach from outside - explain how NAT makes outbound connections easy and inbound ones hard.",
      "CGNAT can mean you share one public IP with hundreds of subscribers - what does that break for someone who wants to self-host, and what are the legitimate workarounds?"
    ]
  }
});

Object.assign(window.LABX,{
  "p3lab1":{
    time:"60-90 min plus download time",
    setup:[
      "Windows 10 2004+ or Windows 11 with CPU virtualization enabled in firmware; an administrator PowerShell to run the WSL installer.",
      "A reliable internet connection for the distro and package downloads; you create a Linux username and password during first launch.",
      "VS Code installed on Windows plus its WSL extension, so you can open a Linux folder from the editor.",
      "A paid Claude plan (Pro, Max, Team or Enterprise) or a Console API account, since Claude Code needs one to sign in at step 4."
    ],
    checkpoints:[
      "'wsl --list --verbose' shows your distribution running at VERSION 2, and you have created your Linux user and password.",
      "'sudo apt update && sudo apt upgrade' completes and git, htop, tree and shellcheck all run from the shell.",
      "VS Code opens a WSL window (the bottom-left corner shows 'WSL: Ubuntu') with ~/projects open.",
      "Claude Code launches in WSL ('claude --version' prints a version) and runs once in a test folder after you complete the browser login."
    ],
    hints:[
      "Start from an elevated PowerShell; a single install command pulls the kernel, sets WSL2 as the default and installs a distro for you.",
      "Inside Ubuntu, refresh first with 'sudo apt update && sudo apt upgrade -y', then install the whole tool list in one 'sudo apt install' line.",
      "Install Claude Code inside WSL with the official installer 'curl -fsSL https://claude.ai/install.sh | bash', open a new shell so ~/.local/bin is on PATH, then run 'claude' and complete the login (it requires a paid plan).",
      "If a step behaves oddly, keep your work in the Linux home directory rather than /mnt/c, where filesystem access is far slower."
    ],
    trouble:[
      ["'wsl --install' fails or the VM will not start","Virtualization or the Virtual Machine Platform feature is disabled","Enable virtualization (VT-x/AMD-V) in firmware and turn on the 'Virtual Machine Platform' Windows feature, reboot, then retry"],
      ["apt commands fail with 'Could not resolve'","DNS inside WSL is misconfigured","Check /etc/resolv.conf has a working nameserver; if networking is stale run 'wsl --shutdown' from PowerShell and reopen the distro"],
      ["VS Code opens in Windows, not inside WSL","You launched it without the WSL remote","Install the WSL extension, then from the Ubuntu shell run 'code .' inside ~/projects; the window should read 'WSL: Ubuntu'"],
      ["'claude: command not found' after install","The install directory is not yet on PATH","Open a new terminal or run 'source ~/.bashrc', confirm ~/.local/bin is on PATH, then 'claude --version'"],
      ["htop looks empty or unstyled in Windows Terminal","Wrong profile or a tiny window","Launch the Ubuntu profile, maximize the window, and run htop; the bars and colours should fill the screen"]
    ],
    challenge:"Prove the filesystem-placement rule with numbers: clone a medium repository once into your Linux home and once under /mnt/c, then time 'git status' and a large file copy in each location. Explain the 9p protocol cost that makes /mnt/c slow and why keeping code in the Linux filesystem also fixes file-watching and permissions.",
    reflect:[
      "WSL2 runs a real Linux kernel in a lightweight VM rather than a translation layer - why does that make system calls and Docker work where WSL1 struggled?",
      "Why is keeping your code in the Linux filesystem both faster and better behaved for permissions and inotify file-watching than putting it under /mnt/c?"
    ]
  },
  "p3lab2":{
    time:"45-60 min",
    setup:[
      "Any Linux shell (the WSL2 install from Lab 1 is fine) with a normal user that has sudo.",
      "Know the basics of find, du, sort, grep and wc; keep a terminal open with command history.",
      "Some content under /var/log and /etc, which every running system has; generate a little activity if the box is brand new.",
      "A place to paste the commands and their outputs for the deliverable."
    ],
    checkpoints:[
      "You printed the single largest file in /var/log with its size, and recorded the exact command you used.",
      "You listed every file under /etc modified in the last 24 hours and the output is plausible for your system.",
      "You printed your user's /etc/passwd line and can explain each of the seven colon-separated fields.",
      "You listed the ten most recently installed packages and counted the comment lines in /etc/ssh/sshd_config."
    ],
    hints:[
      "find locates files by criteria such as size or modification time, du measures sizes, and piping either into 'sort -n' or 'sort -h' ranks them.",
      "For the largest log file try 'sudo du -ah /var/log | sort -rh | head', or 'sudo find /var/log -type f -exec du -h {} + | sort -rh | head -1'.",
      "Recent /etc changes: 'sudo find /etc -type f -mmin -1440' (the last day); recent packages: look in /var/log/dpkg.log for 'install' lines; count comments with 'grep -c' and an anchored pattern for a leading hash.",
      "If find prints permission errors, add 'sudo' or append '2>/dev/null' to hide the denied entries while keeping the real results."
    ],
    trouble:[
      ["find prints many 'Permission denied' lines","Some directories need root and the errors go to stderr","Prefix the command with sudo, or append '2>/dev/null' to suppress denied entries while keeping matches"],
      ["du and find disagree on the 'largest' item","du sums directory totals while find lists individual files","Decide what you mean: for one real file use find with a size print and sort numerically, not du's directory rollups"],
      ["/var/log/dpkg.log is empty or missing","This distro uses a different package manager or the log rotated","On apt systems check dpkg.log and dpkg.log.1; on dnf/rpm systems use 'rpm -qa --last' or /var/log/dnf.log"],
      ["Your field count for /etc/passwd looks wrong","You miscounted the empty-looking password field","There are seven fields name:x:uid:gid:gecos:home:shell; the 'x' means the real hash lives in /etc/shadow"]
    ],
    challenge:"Write a single command (a subshell or a sequence) that reports the three largest log files, the three most recently changed files under /etc, and your login shell, all at once; then turn it into a reusable alias in ~/.bashrc and explain each pipe stage.",
    reflect:[
      "Explain every field of your /etc/passwd line and why the password hash is kept separately in /etc/shadow - what does that separation protect?",
      "find -mtime and -mmin use a file's mtime; give a case (such as copying a file) where mtime misleads you about when the content really changed, and what ctime would show instead."
    ]
  },
  "p3lab3":{
    time:"60-90 min",
    setup:[
      "A Linux system with systemd (a real VM or cloud box; WSL2 needs 'systemd=true' in /etc/wsl.conf, then 'wsl --shutdown').",
      "A user with sudo, and Python 3 installed for the logging script.",
      "A path for your script such as /usr/local/bin, and an editor for the unit file.",
      "Know the three unit sections [Unit], [Service] and [Install] before you start."
    ],
    checkpoints:[
      "Your Python script, run by hand, logs a timestamp to standard output every 10 seconds.",
      "'sudo systemctl daemon-reload' then 'systemctl enable --now yourservice' reports the unit active (running).",
      "'journalctl -u yourservice -f' streams a new line roughly every 10 seconds.",
      "After you kill the process, systemctl shows systemd restarted it, and you can explain each unit directive you used."
    ],
    hints:[
      "A service needs a unit file in /etc/systemd/system telling systemd what to run, as which user, and what to do if it exits.",
      "A minimal unit is [Unit] Description=..., then [Service] with ExecStart pointing at python3 and your script plus Restart=always, then [Install] WantedBy=multi-user.target.",
      "After editing any unit always run 'daemon-reload'; 'enable' creates the boot symlink and '--now' also starts it; test restart by killing the PID and watching 'systemctl status' bring it back.",
      "If nothing reaches the journal, run Python with the -u flag (unbuffered) or flush, because buffered output never gets logged."
    ],
    trouble:[
      ["systemctl reports 'Unit not found'","The file is misnamed or in the wrong directory, or you skipped daemon-reload","Put it at /etc/systemd/system/name.service, run 'daemon-reload', then reference it as 'name' or 'name.service'"],
      ["The service fails immediately with status 203/EXEC","The ExecStart path is wrong or the script is not runnable","Use an absolute path to python3 and to the script, test that exact command by hand, and read 'journalctl -u name' for the error"],
      ["It runs but does not restart when killed","Restart= is unset or set to 'no'","Add 'Restart=always' and 'RestartSec=1', daemon-reload, restart the unit, then kill the PID again to confirm"],
      ["Nothing appears in journalctl","Python buffered its output, or you used the wrong unit name","Run python with -u or flush each line, confirm the unit name, and use 'journalctl -u name -n 50 --no-pager'"],
      ["WSL2 says 'System has not been booted with systemd'","systemd is not enabled in WSL","Add a [boot] section with 'systemd=true' to /etc/wsl.conf, run 'wsl --shutdown' from PowerShell, then reopen"]
    ],
    challenge:"Replace the sleep loop with a systemd timer: write a oneshot .service plus a .timer unit using OnUnitActiveSec=10s so systemd itself schedules each run, and compare the two designs. Explain when a timer is better than a long-running daemon and what happens to missed runs after a reboot.",
    reflect:[
      "What does 'WantedBy=multi-user.target' actually cause at boot, and how does 'enable' differ from 'start'?",
      "Restart=always can hide a crash loop - how would you detect a service that is 'running' only because systemd keeps reviving it, and what does StartLimitBurst do?"
    ]
  },
  "p3lab4":{
    time:"2-3 h",
    setup:[
      "A VM you own: a local Ubuntu 24.04 in VirtualBox/VMware, or a free-tier / low-cost cloud VM - take a snapshot before you start so you can roll back.",
      "An SSH client on your PC and an SSH keypair ready ('ssh-keygen -t ed25519' if you do not have one).",
      "nmap installed on your PC to scan the VM from outside, and the VM reachable from your PC.",
      "If you use a cloud VM, set a billing alert and plan to destroy the instance, its public IP and its disk when finished."
    ],
    checkpoints:[
      "You can SSH in as a non-root sudo user you created, using your key rather than the root account.",
      "sshd_config has PasswordAuthentication no and PermitRootLogin no (and you reloaded sshd); ufw default-denies incoming with only the intended ports open; updates are applied and fail2ban is running.",
      "nmap from your PC shows only the ports you intended (for example 22); everything else is closed or filtered.",
      "Trying 'ssh -o PreferredAuthentications=password user@host' is rejected - password login fails."
    ],
    hints:[
      "Do the first-ten-minutes routine in order: create your user and install your public key BEFORE you disable password and root login, or you can lock yourself out.",
      "Edit /etc/ssh/sshd_config to set PermitRootLogin no and PasswordAuthentication no, then run 'sudo systemctl reload sshd', keeping your current session open to test a fresh one.",
      "For the firewall: 'ufw default deny incoming', 'ufw allow OpenSSH', 'ufw enable'; fail2ban's sshd jail bans repeat failures; verify from outside with 'nmap -Pn <host>'.",
      "Always confirm key-based login works in a second terminal before you disable passwords, so you keep a way in."
    ],
    trouble:[
      ["You locked yourself out after disabling passwords","Your key was not installed for the user before passwords were turned off","Use the provider console or your snapshot to roll back, and in future confirm key login in a second session before disabling passwords"],
      ["Permission denied (publickey)","No matching public key on the server, or wrong file permissions","Put your public key in ~/.ssh/authorized_keys (chmod 700 ~/.ssh, 600 authorized_keys) and read 'ssh -v' output to see which key was offered"],
      ["nmap shows ports you did not open","A service listens on 0.0.0.0, or ufw is not actually enabled","Run 'sudo ufw status verbose' and 'sudo ss -tlnp' to find listeners; bind services to localhost or allow only the ports you need"],
      ["fail2ban is not banning failed logins","The jail is disabled or the log path is wrong","Enable the sshd jail in jail.local, restart fail2ban, and check 'fail2ban-client status sshd'"],
      ["Your cloud bill is climbing","You left the VM, its public IP or a disk running","Destroy the instance and release the IP and volume when done, and set a budget alert beforehand"]
    ],
    challenge:"Add a second factor to SSH for your user only: configure TOTP with libpam-google-authenticator, keep the backup codes offline, then re-run your nmap and a login test. Document what defence-in-depth layer this adds over keys alone and the usability cost it imposes.",
    reflect:[
      "Map each hardening step - disabling password auth, default-deny firewall, fail2ban - to the specific attack it blocks.",
      "nmap from outside is your verification step; why is checking the result more trustworthy than assuming your config changes worked, and what does 'filtered' versus 'closed' tell you?"
    ],
    safety:"Only harden, scan or test machines you own or are explicitly authorized to test, on an isolated or personal network. Snapshot the VM first so you can roll back, and never disable remote-access services on a box you can reach only over the network without a second way in. If you use a paid cloud VM, set a billing alert and destroy the instance, its public IP and its disk when finished."
  },
  "p3lab5":{
    time:"60-90 min",
    setup:[
      "A Linux shell with shellcheck installed ('sudo apt install shellcheck') and cron available (or a systemd timer).",
      "A test folder containing a few files, including at least one filename with spaces to prove quoting works.",
      "A destination folder for the archives and roughly a day of patience to confirm the scheduled run.",
      "Know 'set -euo pipefail' and the basics of tar and the date command before you write the script."
    ],
    checkpoints:[
      "backup.sh begins with 'set -euo pipefail', tars a target folder into a dated archive, and deletes archives older than 14 days.",
      "shellcheck reports no warnings, and the script works correctly on a folder containing a file whose name has spaces.",
      "A crontab entry runs the script nightly, and the next day the log shows it ran and the dated archive exists."
    ],
    hints:[
      "Quote every variable and build the filename from a date command so the script is safe with spaces and self-dating.",
      "Build the archive path as a quoted string using basename and \"$(date +%F)\", then tar with -czf and -C so paths with spaces survive, and delete old files with 'find \"$DEST\" -name \"*.tar.gz\" -mtime +14 -delete'.",
      "Schedule with 'crontab -e' using a line like '0 2 * * * /path/backup.sh >> /path/backup.log 2>&1'; cron uses a minimal PATH so use absolute paths and redirect output to a log.",
      "If 'set -e' exits the script on an expected non-zero (for example from find), handle that case explicitly rather than removing the safety option."
    ],
    trouble:[
      ["The script breaks on filenames with spaces","Unquoted variables are word-split by the shell","Quote every expansion as \"$var\", and prefer tar's -C with basename over concatenating one big path string"],
      ["'set -e' makes the script exit on the find/delete step","A command in a pipe returned non-zero","Understand pipefail, and allow the expected case explicitly (for example with '|| true') only where a non-zero result is genuinely fine"],
      ["The cron job never runs","Wrong crontab, a minimal PATH, or the script is not executable","chmod +x the script, use absolute paths inside it, and check 'grep CRON /var/log/syslog' and that you edited the right user's crontab"],
      ["Old archives are not being deleted","-mtime math is off, or the glob does not match your filenames","Confirm the name pattern matches your archives and test the retention on throwaway files with a small -mtime value first"],
      ["shellcheck flags SC2086 and similar","Unquoted expansions","Apply each code's suggestion; SC2086 means quote the expansion to prevent globbing and word-splitting"]
    ],
    challenge:"Make the backup incremental and verifiable: switch to tar --listed-incremental snapshots (or rsync --link-dest hardlink snapshots), add a sha256sum manifest, and write a restore test that extracts into a temporary directory and diffs it against the source. Prove a restore actually reproduces the data.",
    reflect:[
      "Why is 'set -euo pipefail' the first line of a serious script - give a concrete bug that each of the three options (e, u, pipefail) catches?",
      "A backup you have never restored is a hope, not a backup; what would you automate to gain real confidence the archives are usable?"
    ]
  }
});

Object.assign(window.LABX,{
  "p4lab1":{
    time:"60-90 min",
    setup:[
      "The app's Code Lab simulator, which runs in the browser with nothing to install; it auto-grades each kata against its tests.",
      "Optional: Python 3 on your own machine to redo the same katas in Python afterwards.",
      "Paper or a notes file for the Big-O you predict for each kata before running it.",
      "The built-in kata set (double, FizzBuzz, reverse, count vowels, is-prime, sum, max, word frequency, palindrome, binary-to-decimal)."
    ],
    checkpoints:[
      "The Code Lab opens and the Run button executes your function against its listed test cases.",
      "All ten katas reach 'ALL TESTS PASS', and your drafts persist as you move between them.",
      "You wrote the Big-O of each solution before running it (for example reverse O(n), is-prime O(sqrt n), word frequency O(n)).",
      "ADA reviewed one solution and you either applied or rejected its cleaner version with a stated reason."
    ],
    hints:[
      "State the cost before you code: ask how the work grows as the input doubles, and that is the Big-O you then confirm by running.",
      "is-prime only needs divisors up to the square root of n (O(sqrt n)); word frequency makes one pass with a dictionary (O(n)); binary-to-decimal is one pass multiplying a running total by two.",
      "Use an object or dict as a map for word frequency to keep it O(n) rather than scanning the list per word, and in FizzBuzz test divisibility by 15 first or 15 prints 'Fizz'.",
      "If a test fails on a right-looking answer, check the expected value's type: fizzbuzz(7) wants the number 7, not the string '7'."
    ],
    trouble:[
      ["FizzBuzz returns 'Fizz' for 15","You tested divisibility by 3 before 15","Test n % 15 == 0 first, then %3, then %5, otherwise return the number itself"],
      ["A test fails although the output looks correct","Type mismatch between a number and a string","Read the expected value's type in the test case and return exactly that type"],
      ["Word-frequency comparison fails","Extra whitespace, case differences, or wrong structure","Lowercase and split on spaces, count in one pass into an object; the test compares the serialized object"],
      ["is-prime says 1 is prime","Missing the n < 2 guard","Return false for n below 2, then loop candidate divisors from 2 up to the square root of n"]
    ],
    challenge:"Redo all ten katas in Python on your own machine with pytest, and for three of them write a deliberately worse implementation (for example an O(n^2) word count) alongside the good one. Time both on a large input and show that the Big-O difference you predicted actually appears in the clock.",
    reflect:[
      "You predicted each kata's Big-O before running it - for which one was your prediction wrong, and what in the code changed the real cost?",
      "The sandbox runs JavaScript but you will redo these in Python; name one behaviour (integer division, truthiness, or the default number type) that differs and could break a direct port."
    ]
  },
  "p4lab2":{
    time:"45-60 min",
    setup:[
      "Python 3 with an editor and terminal, or the app's Code Lab, so you can run a script and read its traceback.",
      "Ask ADA for a 25-line Python script that contains three planted bugs: one NameError, one IndexError and one logic error.",
      "Know how to read a Python traceback from the bottom up to the line that raised the error.",
      "A notes file to record how you localized each bug."
    ],
    checkpoints:[
      "Running the buggy script reproduces a traceback, and you read it bottom-up to the offending line.",
      "All three bugs are fixed and you named each error class: NameError, IndexError and the logic error that threw nothing.",
      "Your notes explain how you localized each bug - which line the traceback pointed to and what you printed or inspected."
    ],
    hints:[
      "A traceback's last line names the exception and its message, and the line just above it is where it was raised, so start reading there.",
      "A NameError means a name is undefined (a typo or use-before-assignment); an IndexError means an index is out of range, often an off-by-one or an empty list.",
      "The logic error throws nothing - the program runs but the result is wrong - so write the expected output for a tiny input by hand and add prints until the first wrong value appears.",
      "Fix the cause, not the symptom: when a value is bad at the point it throws, trace it upstream to where it was produced."
    ],
    trouble:[
      ["NameError: name 'x' is not defined","A typo, wrong scope, or use before assignment","Check spelling and that the variable is assigned before use in the same scope; Python has no hoisting"],
      ["IndexError: list index out of range","Off-by-one or looping past len()","Iterate the items directly, or use range(len(seq)) correctly, and print len(seq) and the index at the point of failure"],
      ["The exceptions are gone but the output is still wrong","The logic bug produces no traceback","Hand-compute the expected output for a small input, then bisect the code with prints until the first wrong value shows"],
      ["You fixed the line that threw but the bug returns","You patched a symptom, not the source","Ask why the value was bad at that line and trace it back to where it was first produced"]
    ],
    challenge:"Turn each fix into a regression test: write three pytest tests that fail on the original bugs and pass after your fix, then intentionally reintroduce one bug and watch the test catch it - the habit that stops a bug from coming back.",
    reflect:[
      "Python reports these errors at runtime, not compile time; how did that shape your debugging compared with a language that would have caught the NameError before running?",
      "Which of the three bugs was hardest to find, and what does that say about the value of tests over eyeballing code?"
    ]
  },
  "p4lab3":{
    time:"2-3 h",
    setup:[
      "Python 3 with pip, and a virtual environment created for this project.",
      "pytest installed in the venv ('python -m pip install pytest').",
      "A public-domain text from Project Gutenberg (gutenberg.org) to run the counter on a real book.",
      "Know functions, dicts and collections.Counter before you structure the program."
    ],
    checkpoints:[
      "The program reads a text file and prints its ten most common words, split into functions (read, normalize, count, top_n).",
      "Counting uses a dict or Counter, and you can explain why that is O(n) rather than scanning the list per word.",
      "pytest tests for normalize and count pass on small hand-made inputs.",
      "Running it on a downloaded Gutenberg book prints a sensible top-ten (likely the, and, of and similar)."
    ],
    hints:[
      "Separate the steps - read text, normalize (lowercase and strip punctuation), count, take the top N - so each is a small testable function.",
      "A dict or Counter gives average O(1) increment per word, so counting all words is O(n); scanning the list to count each word would be O(n^2).",
      "collections.Counter(words).most_common(10) returns the top ten, and a good test is normalize('Hello, HELLO!') == ['hello','hello'] plus count on a short string with known totals.",
      "Open the file with encoding='utf-8' and strip the Gutenberg licence header and footer before counting so they do not pollute the results."
    ],
    trouble:[
      ["Counts are split across 'Word' and 'word'","Normalization is not applied before counting","Lowercase and strip punctuation in normalize() before counting so case and punctuation do not fragment words"],
      ["Punctuation stays attached ('end.' versus 'end')","Splitting on spaces only","Strip or regex out non-letters, decide whether apostrophes count, and document that choice in the function"],
      ["pytest reports 'No module named pytest' or finds no tests","Not installed in the venv, or files not named test_*.py","Activate the venv and install pytest, name test files test_*.py and functions test_*"],
      ["UnicodeDecodeError on the book","The file has a BOM or unexpected bytes","Open with encoding='utf-8' and handle or strip the Gutenberg header/footer before processing"],
      ["The top words are all stopwords","That is expected for English text","It is correct; optionally filter a stopword list to surface content words, and note why term frequency alone needs inverse document frequency"]
    ],
    challenge:"Add an argparse command-line interface for the filename and N, a stopword-filter flag, and output as both a table and a CSV. Then compare the top-50 words of two different books and quantify how similar their distributions are (for example the size of the overlap) - a first taste of text analytics.",
    reflect:[
      "Why is Counter the right structure here, and what is the time complexity of counting n words with it versus a naive list scan?",
      "You split the tool into read/normalize/count/top_n; which function was easiest to test, and why does pure, side-effect-free code test more easily?"
    ]
  },
  "p4lab4":{
    time:"60-90 min",
    setup:[
      "Python 3 with venv and pip, and Git installed and configured ('git config --global user.name' and user.email).",
      "A free GitHub account if you intend to push, though a local repo is enough for the deliverable.",
      "A public JSON API that needs no key (a placeholder or open-data API).",
      "An editor and a terminal, and the habit of creating .gitignore before your first commit."
    ],
    checkpoints:[
      "A project folder has its own activated virtual environment, and 'pip install requests' installs into it (pip -V points inside the venv).",
      "Your script fetches a public JSON API with requests and prints one field from the response.",
      "'git init', at least one commit, and a README all exist, and the .venv directory is gitignored."
    ],
    hints:[
      "The venv isolates this project's packages from the system Python, so activate it before installing anything.",
      "Create it with 'python -m venv .venv', activate it, then 'pip install requests' and freeze with 'pip freeze > requirements.txt'.",
      "In the script use 'r = requests.get(url); r.raise_for_status(); data = r.json()' then print one field, and add '.venv/' and '__pycache__/' to .gitignore before committing.",
      "If the JSON is a list, index it before the key (data[0]['field']); print the whole response first to learn its shape."
    ],
    trouble:[
      ["pip installs to the system Python, not the venv","The venv is not activated in this shell","Activate it so the prompt shows (.venv), and confirm with 'which python' or 'pip -V' pointing inside .venv"],
      ["requests raises a ConnectionError or SSL error","No network, a wrong URL, or a proxy/cert issue","Open the URL in a browser, print r.status_code, and call raise_for_status() to surface non-200 responses"],
      ["KeyError when reading the field","The JSON shape differs from what you assumed","Print the whole parsed data (or its type); a JSON array needs an index before the key"],
      ["You accidentally committed .venv with hundreds of files","No .gitignore before the first 'git add'","Add '.venv/' and '__pycache__/' to .gitignore, run 'git rm -r --cached .venv', then commit again"]
    ],
    challenge:"Make the script resilient and reproducible: add retry-with-backoff on transient errors, cache the last good response to a local JSON file, pin versions in requirements.txt, and write a README that lets someone recreate the venv and run it in three commands.",
    reflect:[
      "Why does each project get its own venv instead of installing packages globally - what breaks when two projects need different versions of the same library?",
      "requirements.txt and .gitignore both shape what a collaborator receives; explain what each ensures and why the venv itself should never be committed."
    ]
  }
});

Object.assign(window.LABX,{
  "p5lab1":{
    time:"45-60 min",
    setup:[
      "The app's Web Lab simulator, which shows a live HTML+CSS preview as you type, with nothing to install.",
      "A modern browser; optionally your own editor and a .html file to try the same layout outside the sim.",
      "Know basic HTML tags and CSS selectors, and have the target card (heading, text, button, centered) in mind.",
      "A little patience to iterate, since the preview re-renders on each keystroke."
    ],
    checkpoints:[
      "The Web Lab preview re-renders as you edit the HTML and CSS.",
      "A card is centered both ways using flexbox on the body (display:flex, align-items:center, justify-content:center, min-height:100vh) and contains a heading, text and a button.",
      "The accent colour comes from a CSS custom property (--accent) and the button visibly changes on hover.",
      "At narrow widths a media query makes the card full-width instead of a fixed max-width."
    ],
    hints:[
      "Center with flexbox on the parent rather than margins, and give that parent a height so there is something to center within.",
      "Set the body to display:flex with align-items:center, justify-content:center and min-height:100vh, then give the card a max-width so it does not stretch on desktop.",
      "Define ':root { --accent: #00e5ff }' and use var(--accent); add '.btn:hover { background: ... }' and a media query '@media (max-width:500px){ .card{ max-width:none; width:100% } }'.",
      "If the hover does nothing, confirm you targeted the right element and that the hover rule sets a property that actually changes."
    ],
    trouble:[
      ["The card sits at the top, not vertically centered","The flex parent has no height","Give the parent min-height:100vh (or height:100%); without a height there is nothing to center within"],
      ["The hover effect does nothing","Wrong selector or an unchanged property","Target .btn:hover, set a different background or colour, and optionally add 'transition: background .2s' for a smooth effect"],
      ["The CSS variable has no effect","Defined in the wrong scope or mistyped","Define it on :root (or an ancestor) and reference it exactly as var(--accent); custom property names are case-sensitive and start with two dashes"],
      ["The media query never triggers","Wrong direction or no viewport meta in a real page","Check max-width versus min-width logic, add a viewport meta tag in a standalone file, and narrow the preview to test"]
    ],
    challenge:"Rebuild the same card layout twice more - once with CSS Grid (place-items:center) and once with absolute positioning plus transform:translate(-50%,-50%) - and write two sentences on when each technique is the right tool versus flexbox.",
    reflect:[
      "Flexbox centered your card in two lines - what is the flex container actually doing along the main and cross axes to achieve that?",
      "A CSS custom property let you theme the accent in one place; how is that different from a build-time Sass variable, and why can --accent change at runtime?"
    ]
  },
  "p5lab2":{
    time:"60-90 min",
    setup:[
      "A browser with DevTools (Chrome, Edge or Firefox) so you can run the Lighthouse accessibility audit.",
      "An editor or the Web Lab to rewrite the markup.",
      "Ask ADA for a messy div-only page snippet to start from.",
      "Know the HTML5 semantic elements (header, nav, main, article, footer) and how label/for associates a label with an input."
    ],
    checkpoints:[
      "You have a div-soup snippet to rebuild.",
      "It is rewritten with header, nav, main, article and footer, and every input has an associated label.",
      "Lighthouse's Accessibility audit runs in DevTools and you recorded the score.",
      "You fixed the items it flagged (contrast, alt text, labels, landmarks), the score improved, and you can explain each change."
    ],
    hints:[
      "Ask what each div means and replace it with the element that carries that meaning to the browser and to assistive technology.",
      "Landmark elements (header, nav, main, footer) let screen-reader users jump between regions, and inputs need a <label for=id> or a wrapping label so their purpose is announced.",
      "Run DevTools > Lighthouse > Accessibility; the usual fixes are add alt text to images, label every form control, ensure contrast of at least 4.5:1, set a page lang, and keep a single main.",
      "Use exactly one <main> and make sure label for-attributes match input id-attributes."
    ],
    trouble:[
      ["The accessibility score stays low despite semantic tags","Missing labels, alt text or contrast","Read each audit item - the report links the exact element - and fix labels, alt and contrast first for the biggest gains"],
      ["Lighthouse reports two main elements or no landmarks","Multiple main elements, or content still in bare divs","Use exactly one <main> and wrap the real regions in header/nav/main/footer so landmarks are detected"],
      ["Clicking a label does not focus its input","A for/id mismatch","Match <label for=\"email\"> to <input id=\"email\">, or nest the input inside the label element"],
      ["Lighthouse will not run on the local file","Some audits need a served page","Serve it with 'python -m http.server' or use the Web Lab, and run Lighthouse against the http URL"]
    ],
    challenge:"Navigate your rebuilt page using only the keyboard (Tab, Shift+Tab, Enter), then with a built-in screen reader (VoiceOver, Narrator or Orca). List three things that were impossible or confusing before the semantic rewrite and now work.",
    reflect:[
      "A sighted mouse user sees no difference between div-soup and semantic HTML - who benefits from the change, and through what technology?",
      "Why does a correct label association matter more than merely placing text next to an input, and what does the accessibility tree have to do with it?"
    ]
  },
  "p5lab3":{
    time:"2-3 h",
    setup:[
      "An editor plus a browser with DevTools, or the Web Lab; serve the page locally if the API requires it.",
      "A free public JSON API that sends CORS headers and needs no key.",
      "Know async/await and the DOM methods createElement, append and textContent.",
      "Keep the browser console open so you can read fetch and parsing errors."
    ],
    checkpoints:[
      "The page fetches JSON from a public API using async/await and logs the parsed data.",
      "Results are mapped into DOM nodes with createElement/append, not injected as a raw HTML string.",
      "A search input filters the rendered list live on the 'input' event.",
      "Errors are caught with try/catch and shown as a message, and data values are inserted with textContent rather than innerHTML."
    ],
    hints:[
      "Separate the concerns: get the fetch working, then the rendering, then the filter - each should work before you add the next.",
      "await fetch(url), then await res.json(); build each row with document.createElement and set element.textContent = value, then append to a container.",
      "For the filter, listen on 'input', lowercase the query, and show or re-render only rows whose text includes it; wrap the fetch in try/catch and, on error, set a status element's textContent.",
      "Keep the source array in memory so you can re-render from it on each keystroke instead of destroying nodes you cannot get back."
    ],
    trouble:[
      ["The fetch fails with a CORS error in the console","The API does not send CORS headers for your origin","Use an API that allows CORS; do not disable browser security to work around it"],
      ["The list shows '[object Object]'","You rendered the whole object instead of a field","Set textContent to a specific property (item.title); console.log one item to see its shape"],
      ["You reached for innerHTML with API data","XSS risk, and the lab forbids it","Use textContent for data values so any markup in the data cannot execute, and build structure with createElement"],
      ["The filter clears the list and never restores it","You removed nodes you cannot recover","Keep the source array and re-render from it each time, or toggle a hidden class rather than deleting nodes"],
      ["TypeError: cannot read properties of undefined","The response is nested under a key","Log the parsed JSON; the array may live under something like data.results, so map over that property"]
    ],
    challenge:"Add loading and empty states, debounce the search input so it does not re-render on every keystroke, and paginate or lazy-load the results. Use DevTools to measure how much debouncing reduced the number of render calls.",
    reflect:[
      "Why does using textContent instead of innerHTML for API data close an XSS hole - what would innerHTML do with a value that contained a script tag?",
      "async/await hides the callback; what is happening on the event loop while you 'await' the fetch, and why does the UI stay responsive?"
    ]
  },
  "p5lab4":{
    time:"2-3 h",
    setup:[
      "A free GitHub account and Git installed locally.",
      "A small personal/portfolio page built with semantic HTML, a responsive grid and a little JavaScript.",
      "A browser with Lighthouse in DevTools to measure performance and accessibility.",
      "A free GitHub Pages or Netlify account to host the site."
    ],
    checkpoints:[
      "A small portfolio page exists locally with semantic HTML, a responsive grid and some JavaScript.",
      "It is in a GitHub repository with at least one commit.",
      "It is deployed free to GitHub Pages or Netlify and loads at a public URL.",
      "Lighthouse performance and accessibility are both 90 or above after your improvements."
    ],
    hints:[
      "Ship something small and correct first, then raise the scores; deployment is a step, not the finish line.",
      "For GitHub Pages, push to a repo and enable Pages on the main branch in Settings; for Netlify, connect the repo or drag the folder - both return an https URL.",
      "To reach 90+, compress and size images, add width and height to avoid layout shift, defer non-critical JS, add alt text and labels, raise contrast, and set a viewport and lang.",
      "Use relative paths and exact filename casing, because Linux hosting is case-sensitive where your local machine may not be."
    ],
    trouble:[
      ["GitHub Pages shows a 404 or a blank page","Wrong branch/folder or a missing index.html","In Settings > Pages set the correct branch and /root (or /docs), ensure index.html is at that path, and wait for the build"],
      ["CSS or JS 404s on the live site but works locally","Absolute paths or a filename case mismatch","Use relative paths and match filenames exactly; Style.css and style.css differ on Linux hosting"],
      ["Lighthouse performance is stuck in the 70s","Large unoptimized images or render-blocking resources","Resize and compress images, set explicit dimensions, defer or async the scripts, then re-run; images are usually the biggest win"],
      ["Accessibility is below 90","Missing alt, labels or contrast","Fix the specific items Lighthouse lists - add alt, associate labels, raise contrast to at least 4.5:1"]
    ],
    challenge:"Add a CI gate: configure a GitHub Action that runs Lighthouse on every push and fails the build if performance or accessibility drops below 90, so regressions are caught automatically. Document what the action does and where its thresholds are set.",
    reflect:[
      "Your site is now a set of static files on a CDN - explain why static hosting is fast and cheap, and what you would need to add server-side to accept form submissions.",
      "Lighthouse rewards explicit image dimensions and deferred JS; connect each to a specific stage of the browser's render pipeline (layout, paint or parse)."
    ]
  }
});

Object.assign(window.LABX,{
  "p6lab1":{
    time:"60-90 min",
    setup:[
      "A JDK installed (a current LTS such as Temurin/OpenJDK 21), or an online Java playground if you prefer no install.",
      "An editor or IDE (VS Code with the Java extension pack, or IntelliJ IDEA Community - both free).",
      "Know how to compile with javac and run with java, or use the IDE's run button.",
      "Remember that the public class name must match its .java filename."
    ],
    checkpoints:[
      "A BankAccount class has a private balance field, deposit and withdraw methods (withdraw rejects an overdraft) and a getBalance.",
      "In main, two accounts are created and shown to be independent, so changing one does not affect the other.",
      "A toString() override makes printing an account readable, for example 'BankAccount[balance=100.0]'.",
      "You can explain encapsulation using the withdraw guard as the concrete example."
    ],
    hints:[
      "Private fields mean the outside world can change balance only through your methods, which is exactly where you enforce the rules.",
      "withdraw should check 'if (amount > balance) reject' before changing anything; deposit and withdraw mutate balance and getBalance returns it.",
      "Override 'public String toString()' to return a readable string, and note that two 'new BankAccount()' objects each hold their own balance field on the heap.",
      "If both accounts share a balance, you made the field static - remove static so each instance has its own."
    ],
    trouble:[
      ["error: balance has private access in BankAccount","main tries to touch balance directly","Access it through getBalance/deposit/withdraw; that restriction is the point of private"],
      ["Both accounts show the same balance","balance was declared static","Remove static; static fields are shared across all instances, while instance fields give each object its own"],
      ["An overdraft still succeeds","The guard returns but still mutates, or the comparison is wrong","Return or throw before subtracting, test 'amount > balance', and leave balance unchanged on rejection"],
      ["Printing shows BankAccount@1b6d3586","toString is not actually overridden","Use the exact signature 'public String toString()'; a typo makes it a new method, not an override"],
      ["error: could not find or load main class","Class/file name or package mismatch","The public class name must match the .java filename, and you run with the class name, not the .java file"]
    ],
    challenge:"Make the account robust: throw a custom checked InsufficientFundsException instead of returning false, add a transaction history as a List of amounts, and set a final account id in the constructor. Show how the checked exception forces the caller to handle the failure at compile time.",
    reflect:[
      "Encapsulation hid balance behind methods - what class of bug does that prevent that a public field would allow?",
      "Why does making balance an instance field rather than static give each account independence, and where do the two balance values actually live in memory?"
    ]
  },
  "p6lab2":{
    time:"60-90 min",
    setup:[
      "The JDK and editor/IDE from Lab 1.",
      "Know abstract classes, method overriding and the @Override annotation.",
      "A single file or small project is enough for the whole hierarchy.",
      "Recall the area formulas (circle pi*r*r, rectangle w*h, triangle 0.5*b*h)."
    ],
    checkpoints:[
      "An abstract class Shape declares 'abstract double area()', and Circle and Rectangle extend it and implement area().",
      "Several shapes are stored in a List<Shape> and a loop prints each area with no instanceof or type checks.",
      "Adding a Triangle requires no change to the printing loop.",
      "You can explain why the loop works as runtime polymorphism (dynamic dispatch)."
    ],
    hints:[
      "Program to the Shape type: the loop should only know that every Shape has an area(), not which concrete shape it is.",
      "Declare 'abstract double area();' in Shape, and have each subclass @Override it, so the compiler guarantees every Shape can compute its area.",
      "Store them in a List<Shape> and loop with 'for (Shape s : shapes) System.out.println(s.area());'; the JVM dispatches to the real subclass's area() at runtime, so no switch is needed.",
      "If you feel the urge to write instanceof, put the per-type behaviour in an overridden method instead."
    ],
    trouble:[
      ["error: Shape is abstract; cannot be instantiated","You tried 'new Shape()'","Only instantiate concrete subclasses; Shape is a contract, not a concrete object"],
      ["One shape's area is always zero or wrong","The subclass did not override correctly, or the formula is wrong","Add @Override so the compiler checks the signature, and verify the formula for that shape"],
      ["You reached for instanceof inside the loop","Thinking procedurally rather than polymorphically","Remove the type checks; if behaviour must differ by type, override a method in each subclass"],
      ["Adding Triangle broke compilation","It did not implement the abstract area()","Every concrete subclass must implement each abstract method, so give Triangle an area()"]
    ],
    challenge:"Add a perimeter() to the hierarchy and sort a List<Shape> by area using a Comparator; then introduce an interface Drawable with draw() that only some shapes implement, and iterate a List<Drawable> to show interface polymorphism alongside class inheritance.",
    reflect:[
      "The printing loop never changes as you add shapes - explain how dynamic dispatch makes the design open for extension but closed for modification.",
      "When would you choose an interface over an abstract class for Shape, and what can each do that the other cannot in Java?"
    ]
  },
  "p6lab3":{
    time:"60-90 min",
    setup:[
      "The JDK and editor/IDE; a short word list or a small text file to count.",
      "Know Map and List, the generic type syntax, and streams and lambdas (Java 8 or later).",
      "Have an example of a deliberately wrong-typed insertion ready so you can watch the compiler reject it.",
      "A terminal or IDE console to see the counts printed."
    ],
    checkpoints:[
      "Words are read and counted into a Map<String,Integer>, incrementing the count for each occurrence.",
      "The counts print, and the compiler rejects adding a wrong-typed key or value at compile time.",
      "A stream-plus-lambda version performs the filtering or counting (for example groupingBy with counting).",
      "You can state what the generic type parameters guaranteed."
    ],
    hints:[
      "The Map's type parameters fix which key and value types it accepts, checked at compile time rather than at runtime.",
      "Use 'map.merge(word, 1, Integer::sum)' or getOrDefault to count; declaring Map<String,Integer> means inserting a non-String key will not compile.",
      "A stream form is 'words.stream().filter(w -> w.length() > 3).collect(Collectors.groupingBy(w -> w, Collectors.counting()))'.",
      "If the compiler did not reject a wrong type, your declaration was too loose - avoid raw types and Object."
    ],
    trouble:[
      ["An unchecked or raw-type warning appears","You used a raw Map without type parameters","Declare the full generic types Map<String,Integer>; raw types discard the compile-time checks"],
      ["NullPointerException on the first increment","get() returns null for an absent key and you unboxed it","Use getOrDefault(word, 0) + 1, or merge/compute, so the missing case is handled"],
      ["The compiler did NOT reject a wrong type","You used Object or a raw collection","With Map<String,Integer> the wrong type fails to compile; if it compiled, loosen nothing and tighten the declaration"],
      ["The stream counts come out as Long, not Integer","Collectors.counting() returns Long","That is expected; use a Long value type or convert, and note the API's design choice"]
    ],
    challenge:"Sort the word counts by frequency descending and print the top ten with a stream (sorted on entry value, then limit(10)); then compare the readability and the performance of the explicit-loop version against the stream version on a large text.",
    reflect:[
      "Generics are erased at runtime - if the type information is gone by then, what exactly did <String,Integer> buy you, and when?",
      "The stream version is shorter; give one case where the explicit loop is clearer or faster, and why streams are not always the better choice."
    ]
  },
  "p6lab4":{
    time:"2-3 h",
    setup:[
      "The JDK, plus Maven installed (or an IDE that bundles it).",
      "An internet connection the first time, so Maven can download JUnit and plugins into ~/.m2.",
      "Know the src/main/java and src/test/java layout and that JUnit 5 goes in pom.xml with test scope.",
      "An editor/IDE that can run 'mvn test' and 'mvn package'."
    ],
    checkpoints:[
      "A Maven project has the standard src/main/java and src/test/java layout and a pom.xml that declares JUnit.",
      "A small utility class exists with @Test methods covering normal and edge cases.",
      "'mvn test' runs and the tests pass, and 'mvn package' produces a jar in target/.",
      "You can explain the project structure - where source, tests and build output live."
    ],
    hints:[
      "Let the archetype or IDE wizard create the standard layout; Maven finds code and tests by convention, not configuration.",
      "Put the class under src/main/java and tests under src/test/java in the same package, and add the junit-jupiter dependency with <scope>test</scope> in pom.xml.",
      "Write @Test methods using assertEquals and assertThrows for edge cases (empty input, negatives); 'mvn test' compiles and runs them and 'mvn package' builds the jar.",
      "If no tests are found, check that they are under src/test/java and that the surefire plugin is recent enough to discover JUnit 5 (Jupiter) tests."
    ],
    trouble:[
      ["'mvn test' finds no tests","Tests in the wrong directory, wrong naming, or an old runner","Place tests under src/test/java and, for JUnit 5, make sure the surefire plugin version discovers Jupiter tests"],
      ["Dependency downloads fail","No network or a corrupted local repository","Check connectivity, delete the broken artifact under ~/.m2/repository and re-run; a corporate proxy needs Maven settings.xml"],
      ["package succeeds but the jar will not run","No Main-Class manifest entry","Configure the jar or shade plugin with the mainClass for a runnable jar; a plain library jar is not executable"],
      ["Tests pass but assert the wrong thing","You asserted implementation details, not behaviour","Assert observable outputs and edge cases (empty, boundary, exception), not internal steps"]
    ],
    challenge:"Add a JaCoCo coverage report and a @ParameterizedTest that runs the same assertion over many inputs; raise coverage above 90% and identify one branch your original tests missed and why it mattered.",
    reflect:[
      "Maven works by convention - what does the standard directory layout buy a team over each project inventing its own, and how does test scope keep JUnit out of the shipped jar?",
      "A passing suite is only as good as its cases; which edge case did you nearly forget, and how would you decide a class is 'tested enough'?"
    ]
  }
});

Object.assign(window.LABX,{
  "p7lab1":{
    time:"45-60 min",
    setup:[
      "The app's Crypto Lab simulator (browser, no install), which shows Base64 encoding, a Caesar toy cipher and a SHA-256 hash.",
      "Optional: Python with hashlib on your machine to reproduce the same SHA-256 digest.",
      "Paper or a notes file for your 'when to use each' summary.",
      "Nothing sensitive is needed - use throwaway sample messages."
    ],
    checkpoints:[
      "The Crypto Lab shows a message as Base64, as a Caesar-shifted ciphertext, and as a SHA-256 hash.",
      "Decrypting the Caesar text with the right shift restores the message, and changing one ciphertext character corrupts the decryption.",
      "Changing one input character flips roughly half the hash's bits (the avalanche effect) and you confirm the hash cannot be reversed.",
      "Your notes state when to use encryption (confidentiality) versus hashing (integrity and passwords)."
    ],
    hints:[
      "Encoding, encryption and hashing look similar but differ on two questions: is a secret involved, and is the operation reversible?",
      "Base64 is reversible with no key (not security); Caesar is reversible with the key (toy encryption); SHA-256 is one-way with no key (a fingerprint).",
      "Passwords are stored as salted slow hashes, never encrypted, because the server never needs the plaintext back - it only checks a match; integrity uses a hash because any change alters the whole digest.",
      "To feel one-wayness, note that the only way back from a hash is to guess inputs and compare, which is why salt and a slow hash matter."
    ],
    trouble:[
      ["You think Base64 hides the data","Confusing encoding with encryption","Base64 is just a reversible representation anyone can decode instantly; it provides no confidentiality at all"],
      ["Your SHA-256 differs from an online tool","A trailing newline or a different text encoding","Hash the exact bytes; a stray newline or a different character encoding changes the digest completely"],
      ["You expect to 'decrypt' the hash","Hashes are one-way by design","You cannot invert SHA-256; attackers guess candidate inputs and compare hashes, which is why salting and slow hashing matter"],
      ["Caesar 'encryption' feels secure","The keyspace is tiny","Only 25 shifts exist, so brute force is instant; real encryption such as AES uses a 128- or 256-bit key, not a shift"]
    ],
    challenge:"In Python, compute a keyed HMAC-SHA256 over a message and show that changing either the message or the key breaks verification. Explain how this gives integrity AND authenticity where a bare hash gives only integrity - the jump from the toy lab to a real message authentication code.",
    reflect:[
      "A website verifies your password without storing it - explain, using one-wayness and salting, how the hash makes that possible and why a database theft is survivable.",
      "Encryption and hashing both scramble data; state the single question (do you ever need the original back?) that decides which one a design should use."
    ]
  },
  "p7lab2":{
    time:"45-60 min",
    setup:[
      "A document for your ranking and reasoning.",
      "Access to your own important accounts to check and enable MFA - do this only on accounts that belong to you.",
      "The Module 2 background on hashing, salting and slow/memory-hard hashes (Argon2, bcrypt, scrypt).",
      "Optional: a free-tier password manager to use in the challenge."
    ],
    checkpoints:[
      "You ranked plaintext, unsalted SHA-256 and salted Argon2 from worst to best for how damaging a database theft would be, with reasons.",
      "You can explain what salt defeats (precomputation and shared-hash correlation) and what a slow hash defeats (fast brute force).",
      "You checked your own important accounts for MFA and enabled it where it was missing.",
      "You can argue why MFA plus a salted slow hash is defence in depth (two independent layers)."
    ],
    hints:[
      "For each scheme ask: if the whole database leaks, how much work is it to recover the passwords?",
      "Plaintext is instant; unsalted SHA-256 is fast and friendly to rainbow tables and shared-hash detection; salted Argon2 makes each guess slow and salts kill precomputation and reuse detection.",
      "Salt makes every stored hash unique so identical passwords differ and precomputed tables are useless, while a slow/memory-hard hash caps the attacker's guesses per second even on GPUs.",
      "Remember you usually cannot verify a site's storage directly - judge by disclosures and whether it can email you your password (a red flag)."
    ],
    trouble:[
      ["You rank unsalted SHA-256 as safe because SHA-256 is 'strong'","Confusing cryptographic strength with suitability for password storage","SHA-256 is fast by design, which helps the attacker here; speed is exactly the wrong property for storing passwords"],
      ["You think a long password makes the storage scheme irrelevant","Both factors matter independently","A strong password helps you, but weak storage still exposes the millions of weak passwords in the same database"],
      ["MFA setup wants to remove your only other login method","Recovery confusion","Keep secure backup codes offline and never remove your only second factor"],
      ["You cannot tell whether a site salts","Storage is server-side and invisible","You often cannot verify directly; judge by disclosures and whether it can send you your plaintext password, which signals bad storage"]
    ],
    challenge:"Install a password manager (free tier is fine), generate unique high-entropy passwords for your five most important accounts, and audit for reuse. Then write how unique passwords change the blast radius of a single-site breach compared with reusing one password everywhere.",
    reflect:[
      "Salt and a slow hash defend against different attacks - name the attack each stops and why you need both rather than either alone.",
      "MFA and strong password storage are independent layers; explain how defence in depth means a failure in one does not hand over the account."
    ],
    safety:"Enable MFA and change passwords only on accounts that belong to you. Do not test, guess or attempt logins on anyone else's accounts, and store any recovery or backup codes offline in a safe place."
  },
  "p7lab3":{
    time:"2-3 h",
    setup:[
      "The Domain 3 VM you own (or a fresh local/cloud VM you control); take a snapshot before you begin.",
      "A sudo user on the VM, and the tools ss, ufw and systemctl available.",
      "nmap installed on your PC to scan the VM from outside.",
      "The CIS Benchmark idea to hand so you can map actions to controls."
    ],
    checkpoints:[
      "A baseline is recorded before any changes: open ports ('ss -tulnp'), running services, user accounts and patch status.",
      "Hardening is applied: unneeded services stopped and disabled, the host firewall default-denies with only needed ports, updates installed, accounts least-privilege.",
      "A re-scan ('ss' locally and nmap externally) shows fewer exposed ports, and you documented what changed.",
      "Each action is mapped to the risk it removed and to a CIS Benchmark idea."
    ],
    hints:[
      "Measure first - you cannot show improvement without a before snapshot of ports, services, users and patch level.",
      "'ss -tulnp' lists listening sockets with their process, 'systemctl disable --now' stops a service and prevents boot-start, and ufw with 'default deny incoming' then 'allow' only what you need.",
      "Re-run the exact same baseline commands afterward and diff them; map each change (closed Telnet removes a cleartext-credential risk, default-deny shrinks attack surface) to a CIS control.",
      "Disable services one at a time and verify access after each, and never disable sshd on a remote box without a second way in."
    ],
    trouble:[
      ["A service you disabled was actually needed (you lost SSH or DNS)","You disabled too aggressively","Roll back from your snapshot, disable one service at a time and verify access after each, and keep a second way in"],
      ["nmap says closed but ss shows it listening","The service binds 0.0.0.0 but the firewall blocks it, or it binds localhost","Decide intent: bind internal services to 127.0.0.1 and/or block at the firewall; closed/filtered externally is the goal for non-public ports"],
      ["ss lists many ports you do not recognize","Default daemons such as cups or avahi","Identify each by its process, disable what you do not use, and research anything system-critical before touching it"],
      ["Updates fail or require a reboot","Kernel or core libraries updated","Apply updates, reboot if required, and re-check that services and your access still work afterward"]
    ],
    challenge:"Write the whole baseline-and-harden routine as an idempotent shell script (or a small Ansible playbook) that you can run on a fresh VM and that prints a before/after diff of ports and services. Test it on a new snapshot to prove it is repeatable and safe to re-run.",
    reflect:[
      "You measured before and after - why is that diff stronger evidence of security than a checklist you ticked, and what could a before/after still miss?",
      "Map three of your actions to the CIA triad and to a CIS Benchmark control; which pillar did each most protect?"
    ],
    safety:"Perform baseline scanning and hardening only on machines you own or are explicitly authorized to test, on an isolated or personal network. Snapshot the VM first so you can roll back, and never disable remote-access services on a box you can reach only over the network without a second way in."
  },
  "p7lab4":{
    time:"60-90 min",
    setup:[
      "ADA to role-play a breach scenario (for example ransomware or an account takeover).",
      "The six-phase IR lifecycle (preparation, identification, containment, eradication, recovery, lessons learned) to hand.",
      "The Cyber Kill Chain and MITRE ATT&CK stage references for the mapping step.",
      "A document to write your playthrough and lessons learned; no special software is needed."
    ],
    checkpoints:[
      "ADA presents a concrete breach scenario with some initial indicators.",
      "You walk all six IR phases aloud, deciding a specific action at each (how to contain, what to eradicate, where to recover from).",
      "A blameless lessons-learned names which defensive layer was missing and how to add it.",
      "You mapped the attack's stages to the Cyber Kill Chain or MITRE ATT&CK tactics."
    ],
    hints:[
      "Decide and write a concrete action for each phase before moving on - a vague intention like 'investigate' is not a decision.",
      "Containment is about stopping spread (isolate the host, disable the account, revoke tokens) before eradication (remove the malware and persistence) and recovery (restore from known-good backups).",
      "Map the observed behaviour to ATT&CK tactics (Initial Access, Execution, Persistence, Lateral Movement, Exfiltration) and name the control that would have broken the chain earliest.",
      "Preserve evidence during identification and containment so you do not destroy what you need to understand the scope."
    ],
    trouble:[
      ["You jump straight to wipe-and-reinstall","Skipping identification and containment loses evidence and scope","Contain first, preserve evidence, understand the scope; premature eradication can miss persistence and destroy forensics"],
      ["Lessons-learned turns into blame","The blameless principle broke down","Focus on the missing control or process rather than the person; the output is a fix, not a culprit"],
      ["You cannot decide where to recover from","No known-good restore point was identified","Recovery needs a backup known to predate the compromise and verified clean - which is why tested backups matter"],
      ["The kill-chain mapping feels arbitrary","Confusing tactics with specific tools","Map to the stage's goal (what the attacker achieved) rather than the tool; ATT&CK tactics are the why, techniques the how"]
    ],
    challenge:"Run the scenario a second time having added the one missing control from your lessons-learned, and narrate where in the kill chain the attack now breaks. Quantify the reduced impact (data lost, downtime) so you could justify the control's value to a non-technical manager.",
    reflect:[
      "Containment before eradication can feel slow while systems are down - explain why rushing to eradicate can make the incident worse.",
      "Your lessons-learned found one missing layer; explain how defence in depth meant that single gap did not have to be catastrophic, and where the other layers helped or failed."
    ]
  }
});

Object.assign(window.LABX,{
  "p9lab1":{
    time:"45-60 min",
    setup:[
      "The app's ML Lab simulator (browser, no install): it trains a tiny neural net on points you place and draws the decision boundary with a live loss curve.",
      "A mouse or touchpad to place points of two classes on the canvas.",
      "Nothing else to install; the training runs in the browser.",
      "A notes file to describe what overfitting looked like."
    ],
    checkpoints:[
      "You placed two classes of points, pressed Train, and the decision boundary forms as the loss falls.",
      "The loss curve visibly decreases over epochs and the boundary separates the two classes.",
      "With a tiny, noisy dataset and many epochs you reproduced overfitting - the boundary contorts to capture individual points.",
      "You described what overfitting looked like (great on the placed points, poor on where new points would go)."
    ],
    hints:[
      "Watch two things together: the loss number falling and the boundary shape changing - they are the same event seen two ways.",
      "A smooth boundary that separates the groups is good generalization; a boundary that loops around individual stray points is memorization.",
      "Force overfitting with few points, a noisy point placed inside the other class, and many epochs - the boundary will contort to capture that one point.",
      "If the boundary stays a straight line and cannot separate the data, the pattern is nonlinear - add hidden units."
    ],
    trouble:[
      ["The loss will not fall and no boundary forms","Too few points of a class, or the layout is stuck","Place at least two or three of each class in a separable layout and retrain; add hidden units for a complex pattern"],
      ["The boundary is a straight line and cannot separate the data","Not enough capacity for a nonlinear (XOR-like) pattern","Increase the hidden units; a single linear boundary cannot solve XOR-shaped data, which is why hidden layers exist"],
      ["Overfitting is not obvious","The dataset is too large/clean or you trained too briefly","Shrink the dataset, add a mislabeled or noisy point, and train longer; overfitting shows most with little data"],
      ["The loss curve jumps around","The effective learning rate is high for this layout","Expected wobble; judge the overall downward trend rather than each individual step"]
    ],
    challenge:"For one fixed point layout, train with 2 hidden units, then 8, then 24, and compare boundary smoothness and final loss. Identify the smallest model that fits without contorting - a hands-on feel for the bias-variance trade-off and why a bigger model is not automatically better.",
    reflect:[
      "The boundary that best fits your placed points is not the one that best predicts new points - explain that gap in terms of overfitting and generalization.",
      "The loss is the number gradient descent minimizes; what would a loss that stops falling but stays high tell you about either the model's capacity or the data?"
    ]
  },
  "p9lab2":{
    time:"60-90 min",
    setup:[
      "Python 3 with a virtual environment, and either an AI provider API key on a free/low-cost tier or a local model (Ollama or llama.cpp) if you prefer no cloud.",
      "The provider's SDK or the requests library installed in the venv.",
      "Keep the API key in an environment variable or .env file and never in code, screenshots or chat.",
      "On a paid API, set a spending limit in the provider dashboard before you start."
    ],
    checkpoints:[
      "A Python script sends a prompt to the model and prints the response.",
      "Changing temperature from 0 to 1 produces visibly more varied output at 1 and more repeatable output at 0.",
      "You counted the prompt and completion tokens and estimated the cost from the provider's per-token prices.",
      "ADA reviewed your prompt and you tried a stronger version."
    ],
    hints:[
      "Get one call working and printing before you change anything; follow the provider's quickstart for the exact client call.",
      "The API returns a usage object with prompt and completion token counts; temperature near 0 makes the model pick the most likely tokens (repeatable), while near 1 it samples more widely.",
      "Estimate cost as prompt_tokens times the input price plus completion_tokens times the output price, and read the key from os.environ rather than hard-coding it.",
      "If you see 401/403, the key is missing or wrong in the running shell - print whether the env var is set, without printing its value."
    ],
    trouble:[
      ["401 or 403 Unauthorized","Missing or wrong API key, or not loaded from the environment","Confirm the env var is set in the shell you ran, print its presence (not its value), and regenerate the key if needed"],
      ["Temperature 0 seems to do nothing","That is expected - 0 is near-deterministic","Compare several runs at 0 (near-identical) with several at 1 (varied); some providers interpret or cap it differently"],
      ["The token count is missing","You ignored the usage field or used streaming","Read response.usage; for a local model use the server's token stats or a tokenizer library to count"],
      ["429 rate limit","Too many requests or a free-tier cap","Back off and retry with a short sleep; free tiers throttle, so space out the calls"],
      ["The bill is higher than expected","A large prompt or an accidental loop","Watch per-call usage, avoid loops over the API, and set a spending limit in the dashboard"]
    ],
    challenge:"Wrap the call in a small command-line tool: accept a prompt and temperature as arguments, log every call's tokens and estimated cost to a CSV, and run the same prompt at temperatures 0, 0.3, 0.7 and 1.0. Chart how output length and cost vary and decide which setting fits a factual task versus a brainstorm.",
    reflect:[
      "Temperature trades determinism for diversity - for a task like extracting a date from text, which setting do you want, and why?",
      "You pay per token in both directions; how does prompt design (shorter context, clearer instructions) change both cost and quality, and where is the trade-off?"
    ],
    safety:"Keep API keys in an environment variable or .env file, never in code, screenshots or chat, and do not commit them to Git. On a paid API set a spending limit in the provider dashboard and watch per-call token usage so a loop or an oversized prompt cannot run up an unexpected bill."
  },
  "p9lab3":{
    time:"60-90 min",
    setup:[
      "Access to a model: the same API or local setup as Lab 2, or ADA inside the app.",
      "A document to record each weak and strong prompt and their outputs side by side.",
      "Five task types to cover: summarize, classify, extract, rewrite and brainstorm.",
      "For a fair comparison, keep temperature low so output differences come from the prompt, not from sampling."
    ],
    checkpoints:[
      "You have five vague tasks, one per type (summarize, classify, extract, rewrite, brainstorm).",
      "For each you wrote a weak and a strong prompt, ran both, and recorded the outputs side by side.",
      "You added one few-shot example to one task and noted how the output changed.",
      "Your notes say which levers (role, format, constraints, examples) mattered most."
    ],
    hints:[
      "A strong prompt removes ambiguity: who the model should act as, what exactly to produce, in what format, and under what constraints.",
      "Compare controlled pairs - change one thing at a time (add a format spec, add constraints, add an example) so you can attribute the improvement.",
      "Few-shot means showing one or two input-to-output examples before the real input, and it helps most on classification and extraction where format and the label set matter.",
      "If the model ignores your format request, move it to the end and make it explicit, such as asking for only JSON with named keys."
    ],
    trouble:[
      ["Weak and strong prompts give similar output","The task was easy or the change too small","Pick genuinely ambiguous tasks and make the strong prompt differ clearly (explicit format, constraints or an example)"],
      ["The model ignores your format request","The instruction is buried or contradictory","Put the format instruction last, make it explicit, and remove any conflicting asks in the prompt"],
      ["A few-shot example leaks into the answer","The model copied the example rather than generalizing","Delimit examples clearly and make the real input distinct from them so the model generalizes"],
      ["Outputs vary run to run and are hard to compare","Temperature is too high for an A/B test","Lower the temperature so wording differences, not sampling noise, drive the comparison"]
    ],
    challenge:"Build a tiny prompt-evaluation harness: run each weak/strong pair three times and, for the classify and extract tasks, compute accuracy against a small gold set you label yourself. Report which prompt lever gave the biggest measurable accuracy gain rather than a subjective one.",
    reflect:[
      "Few-shot examples helped most on one task type - explain why format-heavy tasks (classify, extract) gain more from examples than open-ended ones (brainstorm).",
      "A strong prompt is longer and costs more tokens; when is the extra context worth it, and when would you instead invest in a sharper instruction?"
    ]
  },
  "p9lab4":{
    time:"2-3 h",
    setup:[
      "Python 3 with a virtual environment and NumPy installed.",
      "An embeddings model: a provider's embeddings API, or a local sentence-transformers model ('pip install sentence-transformers').",
      "A handful of your own text documents or notes to embed, plus a question whose answer lives only in them.",
      "A model to answer the final question (the same API/local setup as earlier labs)."
    ],
    checkpoints:[
      "You embedded a handful of text chunks and a query into vectors.",
      "You found the closest chunk to the query by cosine similarity in a few lines of NumPy.",
      "You pasted the top chunk into a prompt and asked the question, and also asked the same question with no context.",
      "You can explain why the retrieval-augmented answer is more reliable (it is grounded in your documents)."
    ],
    hints:[
      "Retrieval is just turning text into vectors and finding which document vector points most nearly the same way as the query vector.",
      "Cosine similarity is the dot product divided by the product of the norms; the chunk with the highest cosine to the query is your top hit.",
      "Build the augmented prompt as a context block holding the top chunk followed by the question and an instruction to answer only from the context, then compare with the same question and no context.",
      "If every similarity is near 1 or near 0, normalize the vectors first and make sure the query and the documents use the same embedding model and dimension."
    ],
    trouble:[
      ["All similarities are near 1 or near 0","Vectors are not normalized, or the dimensions mismatch","Normalize before the dot product, and use the same embedding model and vector size for query and documents"],
      ["The top chunk is irrelevant","Chunks too large or small, or the query is phrased unlike the text","Chunk at paragraph scale and rephrase the query; embeddings match meaning, so very long chunks dilute the signal"],
      ["ModuleNotFoundError for sentence_transformers or numpy","Not installed in the active venv","Activate the venv and pip install the packages; the first run downloads the model weights"],
      ["The no-context answer is already fine","The model knew the fact from pretraining","Choose a question whose answer exists only in your private notes so retrieval clearly matters"]
    ],
    challenge:"Scale the toy to a dozen documents, add top-k retrieval (k=3) with the chunks concatenated, and insert one chunk that contradicts the others. Observe how the model handles conflicting context and write what it implies about retrieval quality and source trust in a real RAG system.",
    reflect:[
      "Retrieval grounds the answer in your documents - explain why that reduces hallucination compared with relying on the model's parametric memory.",
      "Cosine similarity matches meaning, not keywords - give an example where it retrieves the right chunk despite no shared words, and one where it fails."
    ]
  }
});

Object.assign(window.LABX,{
  "p12lab1":{
    time:"60-90 min plus model download",
    setup:[
      "A machine you own with Git, curl, tar and a SHA-256 tool present; on Windows use WSL2 (Ubuntu) with systemd enabled per Module 2.",
      "A GPU or enough unified memory helps - 8 GB+ runs small models; any model you run needs at least a 64K-token context.",
      "Install with the official one-line installer: 'curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash', then 'source ~/.bashrc'.",
      "Expect a model download of several gigabytes, so allow time and disk space."
    ],
    checkpoints:[
      "After install and 'source ~/.bashrc', 'hermes doctor' reports green across PATH, Python, runtime and configuration.",
      "'hermes model' then Local models lists options coloured for your hardware, and you picked a green one and noted its size, quantization and context.",
      "In 'hermes --tui' the agent completed three tool-using tasks (list big files, write a Python script, summarize a file) and you saw which toolset each used.",
      "You opened ~/.hermes/ and wrote down the purpose of SOUL.md, memories/MEMORY.md and the session database (state.db)."
    ],
    hints:[
      "Install, then let 'hermes doctor' be your guide - it names exactly what to fix before anything else will work.",
      "The wizard's colour is a fit prediction: green means it should run around 20+ tokens/sec within your memory, so record the model's parameter count and quantization (for example 14B Q4_K_M at 64K).",
      "Size arithmetic: weight memory is roughly parameters times bits-per-weight divided by 8, plus a KV cache that grows with context, so a 14B at about 4.5 bits is around 8 GB before the 64K cache.",
      "If local models all show amber or red, confirm the GPU is detected (nvidia-smi inside WSL needs only the Windows driver) and pick a smaller model."
    ],
    trouble:[
      ["'hermes: command not found' after install","~/.local/bin is not on PATH yet","Run 'source ~/.bashrc' or open a new terminal, and confirm ~/.local/bin is on PATH"],
      ["hermes doctor flags Python or the runtime","An unsupported install route or missing companion tools","Use the official installer, not pip or brew; it pins Python 3.14 and uv, so re-run it and then hermes doctor"],
      ["No local models show as green","The GPU is not detected or has too little memory","Confirm the GPU is visible (on WSL install only the Windows driver), then pick a smaller model or accept amber with lower tokens/sec"],
      ["A model is rejected at startup","Its context is below the 64K floor","Choose a model/config with at least 64,000 tokens of context; Hermes refuses anything smaller"],
      ["The model download stalls partway","Network or Hugging Face throttling","Resume the download; it is pinned by URL and SHA-256 so a resume verifies integrity"]
    ],
    challenge:"Size two different models for your exact hardware on paper (weights plus the 64K KV cache), predict which the wizard will colour green, amber or red, then check your prediction against what 'hermes model' actually shows and explain any gap (for example MoE experts spilling to RAM, or display memory reserved).",
    reflect:[
      "'Self-improving' for Hermes means files change, not weights - after your three tasks, what would have to change on disk for it to do better next time?",
      "Why does the 64K-context floor exist - what must fit in the prompt (identity, tool definitions, memory) before the conversation even starts?"
    ],
    safety:"An agent runs real commands and edits files on your machine. Run Hermes as a normal user (not root), keep the approval step on (avoid --yolo) while learning, and only let it act on machines, accounts and networks you own or are explicitly authorized to use."
  },
  "p12lab2":{
    time:"2-3 h",
    setup:[
      "A working Hermes install from Lab 1.",
      "Docker installed and your user able to run containers, plus openssl to generate a random key.",
      "A chat client such as Open WebUI, run in Docker, to connect to the API server.",
      "Know the config precedence: command-line flags beat config.yaml, which beats .env, which beats defaults."
    ],
    checkpoints:[
      "terminal.backend is set to docker and a test command demonstrably runs inside a container rather than on the host.",
      "All keys live in .env (chmod 600) and config.yaml contains no secrets.",
      "The API server is enabled with a random bearer key, the gateway runs as a service, and a client connects at http://127.0.0.1:8642/v1 and chats through Hermes.",
      "'hermes security audit' and 'hermes egress' have both been run and you recorded what each reported."
    ],
    hints:[
      "The single biggest safety upgrade is making shell commands run in a container: set terminal.backend to docker and verify isolation with a command that prints the container's hostname.",
      "Config precedence matters: UPPER_SNAKE names like API_SERVER_KEY go to .env, while dotted keys like terminal.backend go to config.yaml.",
      "Generate the key with 'openssl rand -hex 24', set API_SERVER_ENABLED true and API_SERVER_KEY in .env, run the gateway, and point Open WebUI at http://host.docker.internal:8642/v1 with that key.",
      "If a client in a container cannot reach the API, remember loopback inside the container is not your host - use host.docker.internal."
    ],
    trouble:[
      ["Commands still run on the host","The backend was not actually switched, or Docker is not usable by your user","Confirm 'terminal.backend: docker' in config.yaml, ensure your user can run docker, and test with a command that prints the container hostname"],
      ["Open WebUI cannot reach the API","Wrong base URL from inside its container, or a missing bearer key","From a container use host.docker.internal:8642, not 127.0.0.1, and supply the bearer token, which is required even on loopback"],
      ["The API returns 401","Missing or incorrect API key","Set the exact API_SERVER_KEY in the client; Hermes requires the token even locally"],
      ["Secrets are still in config.yaml","A key was written to the wrong file","Move it to .env (chmod 600) and use 'hermes config set' with an UPPER_SNAKE name so it routes to .env"],
      ["security audit flags dependencies","Known-vulnerable packages reported via OSV","Record and update what it names; running the audit before exposing anything is the diagnostic habit to build"]
    ],
    challenge:"Expose the API to another device you own without opening any router port: put both machines on a Tailscale or WireGuard overlay, bind the server to loopback and reach it over an SSH tunnel or the overlay address, then re-run 'hermes egress' and confirm nothing is published to the public internet.",
    reflect:[
      "Running tools in Docker limits the blast radius of a bad command - what can a containerized agent still reach, and what does it protect the host from?",
      "The API server demands a bearer token even on 127.0.0.1 - why is 'it is only localhost' not a safe assumption on a multi-process machine?"
    ],
    safety:"Keep secrets only in .env (chmod 600), never in config.yaml, prompts or screenshots. Bind the API server and gateway to 127.0.0.1 and reach them remotely only over SSH or a private overlay (WireGuard/Tailscale) - never forward port 8642 to the public internet. Use the Docker backend for any untrusted task."
  },
  "p12lab3":{
    time:"60-90 min",
    setup:[
      "A working Hermes install with the gateway able to run (it ticks cron every 60 seconds).",
      "A messaging platform allowlisted to you only (for example your Telegram user ID in TELEGRAM_ALLOWED_USERS) for the cron delivery.",
      "An editor, and knowledge of the agentskills.io SKILL.md format; skills live in ~/.hermes/skills/.",
      "Under WSL, keep the gateway alive with tmux or Task Scheduler rather than systemd."
    ],
    checkpoints:[
      "~/.hermes/skills/<your-skill>/SKILL.md exists and appears as a slash command in the agent.",
      "You told Hermes two durable facts and they landed in MEMORY.md/USER.md, and you edited one of them by hand.",
      "A cron job runs your skill weekly and is allowlisted to deliver only to you.",
      "'hermes cron run' triggers it and 'hermes cron runs' shows the run output."
    ],
    hints:[
      "A skill is a folder with a SKILL.md whose front matter names it and says when to use it, followed by the steps; drop it in ~/.hermes/skills/ and it becomes a slash command.",
      "Memory is two short curated files, not the chat log - MEMORY.md for facts about the work and USER.md about you - and both the agent and you can edit them.",
      "'hermes cron create' (optionally with --skill) schedules a fresh-agent run with delivery to a platform; verify with 'hermes cron run' then 'hermes cron runs', keeping the delivery allowlisted to your own ID.",
      "State facts as durable ('my X is Y', 'always do Z') so the agent judges them worth keeping in memory."
    ],
    trouble:[
      ["The skill does not appear as a slash command","Wrong folder, invalid front matter, or not reloaded","Place it at ~/.hermes/skills/<name>/SKILL.md with valid front matter (name plus when-to-use) and restart or refresh the session"],
      ["The facts did not land in memory","Memory is disabled, or the agent judged them not durable","Check that memory is enabled, phrase the facts as durable, then inspect with 'hermes memory'"],
      ["Cron delivers to the wrong place or nobody","The platform is not configured or the allowlist is missing","Set up the gateway platform and allowlist your user ID, and test delivery with 'hermes send' before scheduling"],
      ["Cron never fires on schedule","The gateway (which ticks cron every 60s) is not running","Ensure the gateway service is running; under WSL keep it alive with tmux or Task Scheduler rather than systemd"],
      ["Your hand edit to MEMORY.md reverted","The agent re-curated it, or a size limit trimmed it","Keep memory within its size budget; durable edits survive, but the agent may reorganize, so re-check after a run"]
    ],
    challenge:"Have the agent draft the skill itself after you demonstrate the task once, then review and tighten it like a pull request - remove over-broad steps and add a verification step. Schedule it and confirm the scheduled fresh-agent run reproduces your manual result exactly.",
    reflect:[
      "A skill and a cron job are both just files the agent reads - why does 'review them like code' matter, and what could a careless auto-written skill do?",
      "Memory is deliberately tiny and curated - why would dumping whole transcripts into memory make the agent worse rather than better?"
    ]
  },
  "p12lab4":{
    time:"2-3 h",
    setup:[
      "Two machines you own (or a machine plus a VM), both with Hermes installed.",
      "A private network between them - a LAN, or a Tailscale/WireGuard overlay.",
      "The remote's API server enabled with a key and bound to the private address.",
      "Know the ports: 8642 for the API server and 9900 for A2A."
    ],
    checkpoints:[
      "The second machine runs Hermes with its API server enabled and bound to a private (LAN or Tailscale) address.",
      "From the main machine, 'hermes peer add' then 'hermes peer dm' works, and 'hermes peer run' with an idempotency key launches a job while retrying the same key creates no duplicate.",
      "A2A is enabled on both, each fetches the other's /.well-known/agent-card.json, and a2a_orchestrate runs across two agents claiming the same capability.",
      "You inspected ~/.hermes/a2a_audit.jsonl and wrote down what was logged."
    ],
    hints:[
      "A peer is just another machine's API server reached over HTTP with a bearer token, so it must sit on a private network, never a raw public port.",
      "Register with 'hermes peer add <name> --url http://host:8642 --key <API_SERVER_KEY>', then 'hermes peer dm <peer> message', and add --idempotency-key to 'hermes peer run' so a retry is safe.",
      "Enable A2A via 'hermes gateway setup' (default port 9900); the agent card is at /.well-known/agent-card.json, and a2a_orchestrate(capability, message, mode) fans a task to all agents claiming that capability.",
      "If outbound A2A calls do nothing, enable the a2a tools first with 'hermes tools enable a2a'."
    ],
    trouble:[
      ["peer add succeeds but dm/run cannot connect","The API server is bound to loopback only, or a firewall blocks the private address","Bind the remote API server to the private/overlay address, allow 8642 on that interface only, and test with curl from the main machine"],
      ["401 from the peer","Wrong or missing API key","Pass the remote's exact API_SERVER_KEY to peer add; the token is required"],
      ["A retried peer run created a duplicate job","No idempotency key, or a different key on the retry","Use the same --idempotency-key on the retry; that key is what makes the request safe to repeat"],
      ["agent-card.json returns 404","A2A is not enabled, or you used the wrong port","Enable A2A on that machine and fetch from the A2A port (default 9900), not the API port"],
      ["a2a_orchestrate returns nothing","Outbound A2A tools are off, or no agent claims the capability","Run 'hermes tools enable a2a' and make sure both agents advertise the shared capability in their cards"]
    ],
    challenge:"Add a third role: keep the GPU box serving the big model, run the gateway on a low-power machine (or a VM standing in for a Pi), and have a 7 a.m. cron on the gateway call 'hermes peer run gpu ...' with a dated idempotency key, delivering to your allowlisted chat. Prove zero public ports are open with an external port scan of your own WAN IP.",
    reflect:[
      "An idempotency key makes a retried job safe - explain the failure (a network timeout followed by a retry) it prevents and why exactly-once delivery is hard over a network.",
      "A2A is an open Linux Foundation protocol, not Hermes-only - what does that interoperability buy you, and what new trust question does calling another vendor's agent raise?"
    ],
    safety:"Link agents only across machines you own, over a private network (LAN) or an overlay such as WireGuard/Tailscale - never expose the API (8642) or A2A (9900) ports directly to the internet. Bind servers to the private address, keep bearer tokens secret, and review the a2a_audit.jsonl log to see what crossed between machines."
  },
  "p12lab5":{
    time:"2-3 h",
    setup:[
      "Two machines you own (or one plus an API-only client), each with a supported Mesh LLM GPU build (metal, cuda, rocm, vulkan or cpu).",
      "Install from the official source: 'curl -fsSL https://meshllm.cloud/install.sh | bash'.",
      "A wired LAN helps split mode; know that Mesh LLM is a young work-in-progress and the public mesh shares strangers' hardware.",
      "A Hermes install ready, so you can hand the pooled model to it at the end."
    ],
    checkpoints:[
      "'mesh-llm gpus' shows each machine's GPU and 'mesh-llm doctor' reports healthy.",
      "A private mesh started with --discover=<name> --mesh-discovery-mode mdns is joined by the second machine; 'curl localhost:9337/v1/models' returns a model and the console at :3131 shows both nodes.",
      "If memory allows, --split runs a model too big for either machine alone, and you measured tokens/sec over Wi-Fi versus Ethernet.",
      "'mesh-llm hermes --write' makes Hermes answer through the mesh, and you noted the trust policy you chose."
    ],
    hints:[
      "Keep it private first: mDNS discovery restricts the mesh to your LAN so you are not sharing with strangers on the public mesh.",
      "Router mode sends a whole request to a node that hosts the model; split mode cuts the model into contiguous layer ranges across nodes and passes activations between them each token (pipeline parallelism).",
      "'mesh-llm hermes --write' registers the mesh's OpenAI-compatible endpoint (localhost:9337/v1) as Hermes' provider; set a trust policy (require-owned or allowlist) so only your signed nodes take part.",
      "If /v1/models is empty while idle that is normal - load or serve a model and check the console at :3131."
    ],
    trouble:[
      ["The second machine will not join the mesh","Different mesh name or a discovery-mode mismatch","Use the identical --discover name on both; with mDNS both must share the same LAN segment"],
      ["/v1/models is empty","Normal while idle, or no model is loaded","An empty list while idle is expected; serve a model and re-check, and use the console at :3131 to see node and model state"],
      ["Split mode is slow over Wi-Fi","Pipeline parallelism adds a network hop per layer boundary per token","Use wired gigabit Ethernet; split mode enables model size, not speed - measure both to see the gap"],
      ["You assume the invite token is access control","It is connectivity material, not authorization","Use the trust system ('mesh-llm auth', --trust-policy require-owned or allowlist); the token only helps peers find the mesh"],
      ["Hermes still uses the old provider","'hermes --write' was not applied or was overridden","Re-run 'mesh-llm hermes --write' and confirm Hermes' model provider and base URL now point at localhost:9337/v1"]
    ],
    challenge:"Measure the real cost of pooling: run the same prompt in router mode on the single capable machine, then in split mode across both, recording tokens/sec and latency for each over Ethernet and Wi-Fi. Write up when splitting is worth it (the model is too big to fit) versus when a single machine is simply faster.",
    reflect:[
      "Split mode lets two small machines run a model neither could hold - explain, in terms of activations crossing the network per layer, why it buys capacity but not speed.",
      "The invite token is not a password - explain what actually authorizes a peer in Mesh LLM, and why sending a prompt to the public mesh means a stranger's GPU sees it."
    ],
    safety:"Pool GPUs only across machines you own, kept on your LAN (mDNS) or a private mesh - do not send sensitive prompts to the public mesh, where a stranger's machine processes them. Treat the invite token as connectivity material, not access control: authorize peers with a trust policy (require-owned or allowlist) and signed nodes."
  }
});

Object.assign(window.LABX,{
  "p13lab1":{
    time:"two sessions of 2-3 h",
    setup:[
      "Python 3.11+ with a virtual environment (Domain 4); install pytest and hypothesis into it.",
      "A package folder ds/ with a pyproject.toml so 'pip install -e .' works and pytest discovers your tests.",
      "Know dynamic arrays, linked lists, hashing and amortized analysis from Modules 1-2.",
      "An editor and a terminal; the whole library runs locally on your own machine."
    ],
    checkpoints:[
      "A ds/ package with pyproject.toml installs editable and pytest discovers tests in the venv.",
      "DynamicArray supports append/get/set/insert/pop, doubles capacity when full, and a test asserts n appends copy fewer than 2n elements.",
      "SinglyLinkedList and a dict-plus-doubly-linked-list LRU cache pass a Hypothesis property test against a brute-force list model over random operations.",
      "ChainedHashTable uses hash(key)%m, caps load factor at 0.75 with doubling resize, logs alpha before and after each resize, and asserts the longest chain stays under 8 on 100,000 random keys.",
      "A constant-hash-function test demonstrates Theta(n^2) insertion with a timing assertion - your own hash-flooding demonstration."
    ],
    hints:[
      "The amortized claim is testable: count the actual element copies in a counter during n appends and assert the total is under 2n, which is the geometric-doubling argument made concrete.",
      "An O(1) LRU needs a dict for lookup plus a doubly linked list for recency; a property test runs the same random operations on your LRU and on a slow list-based model and asserts identical results at every step.",
      "Resize the hash table (double m and rehash) when the load factor alpha = n/m passes 0.75; with a good hash and random keys the longest chain stays small, while a constant hash puts everything in one bucket and makes n inserts cost O(n^2).",
      "If the copy-count test fails, you are probably growing by a constant instead of doubling, which gives O(n^2) total copies."
    ],
    trouble:[
      ["pytest cannot import ds","The package is not installed or lacks a pyproject/__init__","Run 'pip install -e .' in the venv and make sure the package is importable and test files are named test_*.py"],
      ["The amortized copy-count test fails with too many copies","You resize by a constant, or copy on every append","Double the capacity on growth so total copies stay under 2n; growing by one each time gives O(n^2) copies"],
      ["Hypothesis finds a failing LRU sequence","A real eviction or recency bug the model exposed","Read the minimal counterexample Hypothesis prints and fix the move-to-front/evict logic; that shrinking is the whole point of property testing"],
      ["The longest chain exceeds 8","Poor hash, no resize, or a bad modulus","Confirm the resize triggers at alpha 0.75, log alpha before and after to prove the table grew, and use Python's hash with a sensible m"],
      ["The Theta(n^2) timing assertion is flaky","Noise dominates at small n","Use a large enough n and compare the ratio as n doubles (expect about 4x) rather than an absolute time"]
    ],
    challenge:"Add a ring buffer and an open-addressing hash table (linear probing with tombstones) to the package, then write a property test that both your chained and open-addressed tables behave identically to Python's dict over random insert/delete/lookup sequences. Measure which has the shorter average probe or chain length at load factor 0.7.",
    reflect:[
      "Each test protects an invariant - take the amortized-copy test and state precisely which claim from the lecture would be false if it failed.",
      "Your constant-hash demo is hash flooding on your own machine - explain how an attacker could weaponize it against a web application and what randomized hashing does to stop it."
    ],
    safety:"The constant-hash timing demonstration is a denial-of-service mechanism; run it only against your own data structures on your own machine to understand the defense (randomized hashing), never to degrade a shared or third-party service."
  },
  "p13lab2":{
    time:"2-3 h",
    setup:[
      "Python 3 with a virtual environment; install matplotlib and numpy into it.",
      "Know time.perf_counter_ns and timeit, and the standard-library deque, bisect and heapq.",
      "A machine quiet enough to time on - close heavy applications so measurements are stable.",
      "A notes file for the ratio table and the half-page analysis."
    ],
    checkpoints:[
      "bench.py times a linear scan, bisect binary search, set membership, and list.pop(0) versus deque.popleft() across n from 1,000 up to about 1,024,000.",
      "It times insertion sort, your merge sort, your quicksort (first-element and random pivot), heapq heapsort and sorted() on random, sorted and reversed input, and finds the n below which insertion sort wins.",
      "You computed the ratio of consecutive times as n doubles (about 2 for linear, 2.1-2.2 for n log n, 4 for quadratic) and plotted time vs n on log-log axes, reading the slopes.",
      "You summed a 5000x5000 float64 matrix row-first and column-first and explained the ratio using 64-byte cache lines.",
      "First-element-pivot quicksort on an already-sorted 100,000-element list hit the worst case; you recorded what happened and wrote why introsort exists."
    ],
    hints:[
      "Measure with perf_counter_ns and repeat each timing; the shape - how time grows as n doubles - is what you compare to theory, not the absolute numbers.",
      "list.pop(0) is O(n) because it shifts every element, while deque.popleft() is O(1); the timing gap is the data structure, not the loop around it.",
      "Doubling n multiplies O(n) time by about 2, O(n log n) by about 2.1-2.2 and O(n^2) by about 4; on log-log axes those are straight lines whose slopes are 1, roughly 1, and 2.",
      "For the sorted-input quicksort worst case, raise the recursion limit or use an explicit stack - that blow-up is exactly what you are demonstrating."
    ],
    trouble:[
      ["Timings are noisy and non-monotonic","Background load or too few repeats","Close other applications, repeat each measurement and take the minimum or median, and use a large enough n to dominate overhead"],
      ["Quicksort raises RecursionError on sorted input","A first-element pivot gives O(n) recursion depth on sorted data","Raise sys.setrecursionlimit or use an explicit stack; this is the worst case you set out to demonstrate"],
      ["Column-first matrix sum is barely slower","The array fits in cache or NumPy reordered it","Use a large C-contiguous float64 array; column-first strides across rows and wastes most of each 64-byte cache line"],
      ["Measured ratios do not match predictions","Constant factors dominate at small n","Compare at large n, where the asymptotic ratio emerges; small n is ruled by constants"],
      ["matplotlib shows nothing","No show()/savefig, or a headless machine","Call plt.savefig to a file and set log scales with plt.xscale('log') and plt.yscale('log')"]
    ],
    challenge:"Add a crossover finder that automatically reports the exact n where insertion sort stops beating your merge sort and the n where random-pivot quicksort overtakes heapsort; then implement a hybrid (insertion sort below the crossover, merge or quick above) and show it beats both - the idea behind real library sorts.",
    reflect:[
      "Your measured n log n ratio was about 2.1 rather than exactly 2 - explain where the extra factor comes from and why Big-O hides it.",
      "Row-first and column-first summed identical numbers at very different speeds - explain, using cache lines and strides, why the access pattern changed the cost though the arithmetic did not."
    ]
  },
  "p13lab3":{
    time:"two sessions of 3 h plus problem-set time",
    setup:[
      "A free account at cs50.harvard.edu/x and the CS50 codespace (browser-based, nothing to install locally); valgrind is available in it.",
      "Know C basics, chained hash tables, and DFS cycle detection (Module 5).",
      "Time to earn at least 70% on each problem via check50 and submit50.",
      "A sheet to record the Speller timing table and the valgrind summary."
    ],
    checkpoints:[
      "You registered at cs50.harvard.edu/x and the codespace opens, with check50 and submit50 working.",
      "Problem Set 3 Sort: you timed the three mystery binaries on sorted, reversed and random 5,000-50,000-line inputs and justified each identification.",
      "Plurality passes, and Runoff or Tideman passes (Tideman locks pairs with DFS cycle detection).",
      "Speller load/hash/size/check/unload pass with a chained hash table, and you recorded TIME IN load/check/total at N=26, then at 65,536 and 200,003 with a better hash.",
      "valgrind --leak-check=full on speller reports no leaks, you compared your nodes x 56-byte estimate to valgrind's total heap usage, and the Gradebook shows at least 70% on each."
    ],
    hints:[
      "For Sort, identify algorithms by their time signature: the one that is fast on already-sorted input behaves like an adaptive sort, while the one indifferent to input order is not.",
      "Tideman is a graph problem: candidates are vertices and locked pairs are directed edges, so refuse any edge that would create a cycle - a DFS that asks whether you can already reach the source from the destination.",
      "In Speller, more buckets (larger N) spread the keys so chains shorten and check() speeds up; watch load time trade against lookup time and the load factor fall as N grows.",
      "If Speller segfaults, run it under valgrind or gdb - it is usually an uninitialized bucket head or a lost next pointer during insertion."
    ],
    trouble:[
      ["check50 fails a style or format check","Output format or whitespace differs from the spec","Match the spec exactly and read check50's specific failing case to reproduce it locally"],
      ["Tideman locks a pair that creates a cycle","The cycle check is wrong or runs after locking","Check for a path from the loser back to the winner BEFORE locking; a DFS from the proposed edge's end must not reach its start"],
      ["Segmentation fault in Speller","Dereferencing NULL or walking a bad pointer","Run under valgrind/gdb; it is usually an uninitialized bucket head or a lost next pointer during insert"],
      ["valgrind reports memory leaks","unload() misses some nodes","Free every node in every bucket before freeing the table; a leak means a chain or bucket was skipped"],
      ["Your heap estimate is far from valgrind's","You forgot the bucket-array allocation or per-node padding","Account for the table of N pointers plus nodes times sizeof(node); struct padding can make a node larger than the sum of its fields"]
    ],
    challenge:"Instrument Speller to report its own load factor and the longest and average chain length for each N (26, 65536, 200003), then plot check-time against load factor. Find the N where the table stops getting faster because memory and cache effects outweigh shorter chains - the practical limit of just adding buckets.",
    reflect:[
      "A bigger hash table made check() faster but load() slower and used more memory - explain the time-space trade-off and how the load factor ties them together.",
      "valgrind found leaks your program ran fine without - why do leaks matter in a long-running program even when a short run works, and what habit catches them early?"
    ]
  },
  "p13lab4":{
    time:"2-3 h",
    setup:[
      "Python 3 with a virtual environment; install networkx and matplotlib.",
      "The six-site graph from Module 5 (A-F) with km weights A-B 4, A-C 2, B-C 1, B-D 5, C-D 8, C-E 10, D-E 2, D-F 6, E-F 3.",
      "Know BFS/DFS, Dijkstra, Bellman-Ford, Kruskal, union-find, edit distance and knapsack.",
      "Use only domains you own (or example.com variants) for the typosquat check - never probe anyone else's systems."
    ],
    checkpoints:[
      "The six-site graph is an adjacency list and BFS, DFS with cycle detection, and Kahn's topological sort (on a separate build-order DAG) all run.",
      "Dijkstra with heapq gives shortest A to F = 13 km via A-C-B-D-E-F, Bellman-Ford agrees, and Kruskal with union-find (union by rank + path compression) gives the MST total 13 km (edges B-C, A-C, D-E, E-F, B-D).",
      "networkx (shortest_path_length, minimum_spanning_tree) confirms your results, and cutting edge D-E then re-running connectivity shows the effect.",
      "A 25-random-site model in a 20 km square with Euclidean costs gives an MST cost and the cost of the cheapest ring-forming redundant edge.",
      "Edit distance flags look-alike domains at distance <= 2, and 0/1 knapsack plus coin change bottom-up with reconstruction include the {1,3,4} counterexample test that makes a greedy version fail."
    ],
    hints:[
      "An adjacency list maps each vertex to its (neighbor, weight) pairs; BFS uses a queue, DFS a stack or recursion, and Kahn's topological sort repeatedly removes a zero-in-degree vertex.",
      "Dijkstra settles the nearest unsettled vertex via a heap and relaxes its edges, while Kruskal sorts edges and adds each that joins two different components, with union-find answering 'same component?' in near-constant time.",
      "The shortest-path tree and the MST optimize different things: on this graph the MST omits A-B while the shortest paths use B-C, yet both total 13 - verify each against networkx.",
      "For coin change, use amount 6 with coins {1,3,4}: greedy gives 4+1+1 (three coins) but 3+3 (two coins) is optimal, so that is the test that must make greedy fail."
    ],
    trouble:[
      ["Dijkstra gives a wrong distance","Not using a priority queue, or relaxing already-settled nodes","Use heapq, pop the smallest tentative distance, skip settled vertices, and relax only outgoing edges"],
      ["Your MST total is not 13","You added a cycle-forming edge or missed the cheapest","Sort edges ascending and add one only if its endpoints are in different union-find sets; reject A-B 4 here since A and B already connect via C"],
      ["Topological sort on the fiber graph fails","That graph is undirected and cyclic; topo sort needs a DAG","Run Kahn's on a separate directed build-order DAG (permit, trench, splice, test), not on the undirected site graph"],
      ["Greedy coin change matched the DP answer","You did not use the {1,3,4} counterexample","For amount 6 greedy gives three coins but the optimum is two - that case must make the greedy version fail"],
      ["networkx MST differs from yours","Tie-breaking between equal-weight edges","Equal-weight ties can yield different but equally valid MSTs; compare the total weight, not the exact edge set"]
    ],
    challenge:"For the 25-site network, compute the MST, then for every single-edge removal measure whether the network stays connected (union-find) and the extra cost to restore connectivity. Identify the most critical link - the one whose loss is most expensive to work around - which is the analysis a real fiber planner does.",
    reflect:[
      "On this graph both the shortest-path tree and the MST total 13 km yet use different edges - explain what each optimizes and why they disagree on which edges to include.",
      "Union-find makes Kruskal fast - explain why checking 'are u and v connected?' with a DFS each time would be far slower, and what union-by-rank plus path compression buys you."
    ]
  },
  "p13lab5":{
    time:"two sessions of 3 h plus ongoing practice",
    setup:[
      "Python 3, and a free LeetCode and HackerRank account for the problem set and the skills tests.",
      "The 30-problem list (five per module), and knowledge of DFA/NFA basics and subset construction.",
      "For the ReDoS harness, use subprocess with a hard timeout and 'pip install google-re2' for the comparison - only on your own patterns.",
      "Your CS50x final project ready to submit for the certificate."
    ],
    checkpoints:[
      "You worked a 30-problem set (five per module, e.g. Two Sum, Valid Parentheses, LRU Cache, Merge Intervals, Kth Largest, Trie, Number of Islands, Course Schedule, Network Delay Time, Coin Change, LCS, Edit Distance), writing the Theta class before coding each.",
      "A DFA simulator (states, alphabet, transition table) runs the 'ends in 01' and 'even number of 1s' machines correctly.",
      "An NFA-to-DFA subset construction produces a DFA for a three-state NFA and you verified its language.",
      "A ReDoS test harness runs patterns under a 2-second subprocess timeout on your own patterns, showing (a+)+$ exploding while google-re2 stays linear.",
      "You took HackerRank Problem Solving Basic then Intermediate, added both to LinkedIn, and submitted the CS50x final project or requested the certificate."
    ],
    hints:[
      "State the Theta class before coding - it forces the right structure, such as a heap for Kth Largest, a hash set for Two Sum, BFS/DFS for Islands, and topological sort for Course Schedule.",
      "A DFA is a transition table plus an accept set, simulated by stepping each input symbol; subset construction turns each set of NFA states (with epsilon-closures) into one DFA state.",
      "Catastrophic backtracking happens when a regex can match a prefix many ways, as in (a+)+; run suspect patterns in a subprocess with a timeout and compare against re2, which uses an automaton and stays linear.",
      "For Kth Largest, keep a size-k min-heap so each insert is log k, rather than sorting the whole input."
    ],
    trouble:[
      ["Course Schedule is wrong on a cycle","You did not detect the cycle in the dependency graph","It is topological sort - a cycle means no valid order, detected via Kahn's leftover nodes or DFS colors"],
      ["Subset construction blows up in states","Worst-case 2^n is possible","Only reachable subsets matter; build states lazily from the start state's closure and most NFAs yield far fewer than 2^n"],
      ["The ReDoS harness hangs the whole script","You ran the evil regex in-process","Run each match in a separate subprocess with a hard timeout so a catastrophic pattern cannot freeze the harness"],
      ["A HackerRank test timed out and locked retries","The test is timed and a fail locks it for 30 days","Practice the problem types first; a failed attempt can be retaken after 30 days, so prepare before starting"],
      ["Kth Largest is too slow for the constraints","You sorted (O(n log n)) when O(n log k) was wanted","Use a size-k min-heap with heapq so each insert costs log k and you keep only the k largest"]
    ],
    challenge:"Turn the interview set into a spaced-repetition system: tag each of the 30 problems by pattern (two-pointer, heap, BFS/DFS, DP, union-find), track first-try success and time, and re-solve the ones you failed after a week. Report which pattern is your weakest and the measured improvement on the second pass.",
    reflect:[
      "Writing the Theta class before coding changed which data structure you reached for - give one problem where that habit saved you from a correct-but-too-slow solution.",
      "A DFA and an NFA can recognize the same language but the NFA can be exponentially smaller - explain the trade-off subset construction makes and why engines like re2 prefer the automaton over backtracking."
    ],
    safety:"The ReDoS harness demonstrates a denial-of-service weakness; run it only against your own regex patterns on your own machine, inside a timeout-guarded subprocess, to learn the defense (linear-time engines like re2) - never to overload a service you do not own."
  }
});

Object.assign(window.LABX,{
  "p14lab1":{
    time:"2-3 h",
    setup:[
      "Python 3 with a virtual environment; a Jupyter notebook is handy but a plain script is fine.",
      "Know itertools.product, modular arithmetic, and the Module 1-2 proofs you are turning into code.",
      "The toy RSA numbers: p=61, q=53, e=17, n=3233, and phi(n)=3120.",
      "A reference for the induction proofs you will write as docstrings."
    ],
    checkpoints:[
      "A truth-table generator with itertools.product verifies De Morgan's laws and that p->q equals (not p) or q for every input row.",
      "A loop confirms 1+...+n = n(n+1)/2 and 2^0+...+2^n = 2^(n+1)-1 for n up to 10^6, with the induction proof written as a docstring above it.",
      "Binary search with an explicit loop invariant asserted on every iteration passes against random sorted lists.",
      "Euclidean, extended Euclidean, modular-inverse and square-and-multiply functions reproduce the toy RSA example and pow(2790, 2753, 3233) equals 65, matching your implementation."
    ],
    hints:[
      "itertools.product([False, True], repeat=k) enumerates every assignment, so compare the two boolean expressions on each row and assert they are equal.",
      "The code checks instances while the docstring carries the actual proof (base case plus inductive step); running the loop to 10^6 is evidence, not proof.",
      "For RSA, d is e's modular inverse mod phi(n)=3120, found with the extended Euclidean algorithm; verify your modular exponentiation against Python's built-in pow(base, exp, mod).",
      "If your modular inverse comes out negative, take it mod phi(n) to bring it into range before using it as d."
    ],
    trouble:[
      ["The De Morgan check fails on some rows","Operator precedence or a mis-written expression","Parenthesize explicitly so not(a and b) equals (not a) or (not b) on every row, and print the failing assignment"],
      ["The n(n+1)/2 loop is slow at 10^6","Pure-Python loop overhead","That is acceptable for a check, or verify the closed form against the loop sum at sampled values of n"],
      ["The binary-search assertion fires","The invariant is stated wrong or there is an off-by-one","State the invariant precisely (the target, if present, lies in [lo, hi]) and update lo=mid+1 / hi=mid-1 consistently"],
      ["Your modular inverse is negative","Extended Euclid can return a negative coefficient","Reduce the result mod phi(n) into [0, phi) before using it as the private exponent d"],
      ["Your modexp disagrees with pow()","A square-and-multiply bug, usually bit order","Process the exponent bits and square at each step, and compare against pow(base, exp, mod) as the ground truth"]
    ],
    challenge:"Extend to a realistic size: write a Miller-Rabin primality test, generate two 512-bit primes, build n, e and d, and encrypt/decrypt a short integer. Time your square-and-multiply modexp against Python's pow and explain why naive exponentiation (base**exp % n) is infeasible at this scale.",
    reflect:[
      "Your loop verified the sum formula for a million values - explain precisely why that is strong evidence yet not a proof, and what the induction docstring adds that the loop cannot.",
      "Knowing n and e, why can you not recover d without factoring n, and what does that one-way difficulty have to do with the security of the whole scheme?"
    ]
  },
  "p14lab2":{
    time:"2-3 h",
    setup:[
      "Python 3 with a virtual environment; install numpy and matplotlib.",
      "Seed the RNG for reproducibility, and keep the birthday formula and the 1.177*sqrt(N) collision rule to hand.",
      "The CLT target for the dice experiment: mean 3.5 and standard deviation 1.71/sqrt(30).",
      "A notes file for one sentence per plot stating which theorem it demonstrates."
    ],
    checkpoints:[
      "Pi is estimated with 10^2, 10^4 and 10^6 points, and the absolute error against n on log axes has a slope of about -1/2.",
      "The birthday paradox for groups of 10, 23 and 50 over 100,000 trials matches the exact product formula.",
      "Drawing random 32-bit values until a repeat, repeated 1,000 times, gives a median first-collision count near 1.177 x 2^16 (about 77,000).",
      "Ten thousand sample means of 30 dice histogram to a normal with mean 3.5 and standard deviation 1.71/sqrt(30)."
    ],
    hints:[
      "Estimate pi as the fraction of points inside the quarter circle times four; the error shrinks like 1/sqrt(n), which is slope -1/2 on log-log axes.",
      "Count the complement for the birthday match (the probability all birthdays differ) and compare the simulated match frequency to one minus that product.",
      "The birthday bound says a 50% collision arrives after about 1.177*sqrt(N) draws, so for 32 bits N=2^32 and sqrt(N)=2^16, putting the median first-collision count near 77,000.",
      "For the CLT histogram, the standard deviation of the mean of 30 dice is 1.71/sqrt(30), about 0.31, not 1.71."
    ],
    trouble:[
      ["The pi error slope is not -1/2","Too few points, or too few trials to average out noise","Average several runs per n; the -1/2 slope holds in expectation, so reduce variance by repeating"],
      ["The birthday simulation disagrees with the formula","Off-by-one in days, or sampling without replacement","Sample birthdays uniformly in 1..365 with replacement and compare to 1 minus the product of (365-i)/365"],
      ["The collision median is far off","Too few repeats, or you reused the RNG stream","Repeat 1,000+ times with fresh draws; the skewed distribution means the median, not the mean, matches 1.177*sqrt(N)"],
      ["The CLT histogram looks non-normal","Too few samples, or the wrong standard deviation","Use 10,000 sample means and overlay a normal with SD 1.71/sqrt(30), not 1.71"]
    ],
    challenge:"Quantify the convergence rate: run the pi estimate at a dozen values of n, fit a line to log(error) against log(n), and report the fitted slope with a confidence interval. Confirm it is statistically consistent with -0.5 and explain why quadrupling the samples only halves the error.",
    reflect:[
      "Every experiment showed error shrinking like 1/sqrt(n) - explain why that same law makes Monte Carlo both widely applicable and slow to gain extra digits.",
      "The birthday bound surprised people (23, not 183) - explain in terms of pairs why collisions arrive near sqrt(N), and connect it to why a 128-bit hash needs 256 bits for collision resistance."
    ]
  },
  "p14lab3":{
    time:"2-3 h",
    setup:[
      "Python 3 with a virtual environment; install scikit-learn and numpy.",
      "Download the UCI SMS Spam Collection (5,574 labeled messages) from its official UCI page.",
      "Know Bayes' theorem, Laplace smoothing, and why you add logs instead of multiplying probabilities.",
      "A notes file for the metrics at both base rates and your tuning conclusion."
    ],
    checkpoints:[
      "The SMS Spam dataset loads and is split 80/20 into train and test.",
      "You tokenize, count per-class word frequencies with Laplace smoothing, and classify each test message by comparing log P(spam)+sum log P(word|spam) with the ham equivalent.",
      "You report accuracy, precision, recall and the confusion matrix, then re-weight the test set to a 0.5% spam base rate and recompute P(spam|flagged) to show the base-rate effect.",
      "scikit-learn's MultinomialNB on the same split is compared and any difference explained."
    ],
    hints:[
      "Work in log space: multiplying thousands of small probabilities underflows, so sum logs, and Laplace smoothing (+1) stops an unseen word zeroing the whole product.",
      "P(class|message) is proportional to P(class) times the product of P(word|class); pick the larger log score, and get precision and recall from the confusion matrix's TP, FP and FN.",
      "The base-rate effect: even a good classifier's P(spam|flagged) falls when real spam is rare (0.5%) because false positives from the huge ham population dominate - recompute with Bayes and the new prior.",
      "Precision is TP/(TP+FP) and recall is TP/(TP+FN); be explicit about which class you call positive."
    ],
    trouble:[
      ["Accuracy is high but it calls everything ham","Class imbalance and no smoothing, or a wrong prior","Use Laplace smoothing and the class priors, and report precision/recall rather than accuracy, which imbalance inflates"],
      ["Probabilities underflow to zero","You multiplied raw probabilities","Sum logarithms instead of multiplying, and compare the log scores"],
      ["Precision and recall look swapped","TP/FP/FN are mislabeled","Fix the convention: precision = TP/(TP+FP), recall = TP/(TP+FN), and state which class is positive"],
      ["Your classifier and MultinomialNB differ a lot","Different tokenization or smoothing alpha","Match the preprocessing and alpha; small differences are expected, large ones signal a feature or count mismatch"],
      ["The base-rate recomputation gives a strange number","Confusing P(flagged|spam) with P(spam|flagged)","Apply Bayes with the 0.5% prior; it is the posterior P(spam|flagged) that drops, not the recall"]
    ],
    challenge:"Build a threshold study: instead of the fixed decision boundary, vary the log-odds threshold and plot precision against recall. Pick the operating point a corporate mail gateway should use, where a false positive (a lost legitimate email) is costlier than a false negative, and justify the choice with numbers.",
    reflect:[
      "At a realistic 0.5% spam rate the probability a flagged message is truly spam dropped sharply - explain the base-rate fallacy and why precision matters more than accuracy here.",
      "A corporate gateway fears false positives more than false negatives - explain which metric you would optimize and what threshold change that implies."
    ]
  },
  "p14lab4":{
    time:"2-3 h",
    setup:[
      "Python 3 with a virtual environment; install numpy and matplotlib.",
      "Know derivatives, the chain rule, the sigmoid and cross-entropy, and finite-difference gradient checking.",
      "The Module 7 line-fit example: data (1,2),(2,4),(3,6) whose exact slope is w=28/14=2.",
      "A notebook for the gradient-check printout, the loss curves and the half-page analysis."
    ],
    checkpoints:[
      "Gradient descent on the one-parameter line fit prints iterates for eta=0.05, 0.15 and 0.25 showing convergence, oscillation and divergence respectively.",
      "Generalized to y=w1*x+w0 on noisy data, the fit matches np.linalg.lstsq and the closed-form slope formula.",
      "Logistic classification (sigmoid, cross-entropy) on two Gaussian clusters has its analytic gradient verified against a finite-difference check to six decimals.",
      "Loss curves for full-batch, mini-batch (32) and single-example updates are plotted and the trade-off described."
    ],
    hints:[
      "The update is theta <- theta - eta*gradient; too small an eta crawls, too large overshoots and diverges, and the example's three values of eta show all three regimes.",
      "For y=wx the gradient is (2/n)*sum(x_i*(w*x_i - y_i)), and the closed form w=sum(x*y)/sum(x*x)=28/14=2 is the target descent should approach.",
      "Finite-difference check: approximate dL/dtheta as (L(theta+e)-L(theta-e))/(2e) for small e around 1e-5 and compare to your analytic gradient; they should agree to about six decimals.",
      "If cross-entropy goes to infinity, clip the sigmoid output away from 0 and 1 before taking logs."
    ],
    trouble:[
      ["eta=0.25 produces NaN","Expected overflow as the iterates blow up","That is the divergence regime you set out to show; lower eta to recover, and note the critical eta depends on sum(x*x)"],
      ["lstsq and your descent disagree","Not converged, or you forgot the intercept","Run more iterations or raise eta within the stable range, and include the bias term w0 when comparing to lstsq"],
      ["The gradient check fails","The analytic gradient is wrong, or e is too small/large","Re-derive with the chain rule and use e around 1e-5; too small loses precision, too large loses accuracy"],
      ["Cross-entropy becomes infinite","log(0) from a saturated sigmoid","Clip predictions away from 0 and 1 (add a tiny epsilon) before the logarithm"],
      ["The mini-batch loss curve is jagged","Stochastic noise per batch","That is expected - single-example is noisiest and full-batch smoothest; plot all three to see the variance-versus-speed trade-off"]
    ],
    challenge:"Add momentum and Adam to your optimizer and compare their loss curves against plain SGD on the logistic problem at a learning rate where plain SGD struggles. Explain what each adaptive method changes about the effective step and why Adam often needs less learning-rate tuning.",
    reflect:[
      "The same gradient with three learning rates gave convergence, oscillation and divergence - explain what determines the critical learning rate and how sum(x*x) enters it.",
      "The finite-difference check caught a gradient bug without any hand calculus - explain why numerical gradient checking is a trusted debugging tool yet not used for training itself."
    ]
  },
  "p14lab5":{
    time:"2-3 h plus MITx problem-set time",
    setup:[
      "Python 3 with a virtual environment; install numpy, scipy and matplotlib.",
      "Know the two-proportion z-test, statistical power, and least squares; the Module 6 A/B numbers are 2.0% vs 2.4% with 10,000 per arm.",
      "A free MITx 6.431x audit enrollment on edX for the problem sets.",
      "A real small dataset you assemble (for example CPU benchmark score versus clock speed from a public table)."
    ],
    checkpoints:[
      "Simulating the A/B test (2.0% vs 2.4%, 10,000 per arm) 1,000 times and running the two-proportion z-test each time gives an estimated power.",
      "Simulating 1,000 identical-arm A/B tests with peeking every 1,000 visitors and stopping at p<0.05 reports a false-positive rate well above the nominal 5%.",
      "A least-squares line fit to your real dataset reports slope, intercept, r^2 and a residual plot.",
      "You enrolled in MITx 6.431x (audit) and kept an error log of your Unit 1-3 problem-set mistakes and their causes."
    ],
    hints:[
      "Power is the fraction of simulated true-effect experiments that reach p<0.05; with these numbers it is modest, which is why real A/B tests need large n.",
      "Peeking inflates false positives because each look is another chance to cross 0.05 by luck, so stopping the first time it dips is the error - simulate it and watch the rate climb past 5%.",
      "Least squares gives slope = sum((x-xbar)(y-ybar))/sum((x-xbar)^2); r^2 is the fraction of variance explained, and the residual plot should look patternless if a line is appropriate.",
      "Use the pooled proportion under the null when computing the two-proportion z-test standard error, and document which SE you used."
    ],
    trouble:[
      ["The estimated power seems too low","That is the real message - the test is underpowered","The 2.0 vs 2.4 effect needs about 21,000 per arm for 80% power; low power at 10,000 is the finding, not a bug"],
      ["The peeking false-positive rate is near 5%","You only checked once, not repeatedly","Check after every 1,000 visitors and stop at the first p<0.05; the inflation comes from the multiple looks"],
      ["r^2 is high but the residuals show a curve","A line fits the variance but not the shape","Trust the residual plot: a visible pattern means the linear model is wrong despite a decent r^2"],
      ["scipy's z-test and your manual value differ","Pooled versus unpooled standard error","Use the pooled proportion under the null for the two-proportion z-test and document which SE you chose"],
      ["MITx problems disagree with your Python","A hand method or assumption is wrong","Keep the error log and note whether it was a setup error, an arithmetic slip, or a misread distribution"]
    ],
    challenge:"Add a correct sequential-testing fix: implement an alpha-spending boundary (such as Pocock) or a fixed-horizon design with a pre-registered n, re-run the peeking simulation under it, and show the false-positive rate returns to about 5%. Explain what you traded away (power or time) to regain validity.",
    reflect:[
      "Peeking felt harmless but tripled your false-positive rate - explain why each additional look is a multiple-comparisons problem and why pre-registration fixes it.",
      "A 20% relative lift was 'not significant' at n=10,000 - explain the difference between statistical significance, effect size and power, and why reporting only a p-value misleads."
    ]
  }
});

Object.assign(window.LABX,{
  "p15lab1":{
    time:"two to three sessions of 2-3 h",
    setup:[
      "A Java runtime for the Nand to Tetris suite; download it free from nand2tetris.org.",
      "A C toolchain (gcc or clang), or Python first then C, for the assembler in Project 6.",
      "A text editor for the .hdl and .asm files, and knowledge of two's complement.",
      "Keep each project's files together so the simulator and tests find them."
    ],
    checkpoints:[
      "Project 1: Not, And, Or, Mux, DMux and their 16-bit versions pass the hardware simulator's test scripts.",
      "Projects 2-3: HalfAdder, FullAdder, Add16, Inc16 and the ALU pass, and Bit, Register, RAM8 through RAM16K and the PC pass, with the ALU control-bit table recorded.",
      "Project 4: Mult.asm and Fill.asm run correctly in the CPU emulator.",
      "Project 5: your CPU, Memory and Computer chips run the supplied programs.",
      "Project 6: your two-pass assembler (C, or Python then C) with a symbol table reproduces the supplied assembler's output byte-for-byte."
    ],
    hints:[
      "Build only from primitives you already made plus Nand, and plan each chip's wiring on paper before typing HDL.",
      "The ALU applies six control bits (zx, nx, zy, ny, f, no) with Mux16 and a final negate; derive zr by OR-ing all output bits and ng from the sign bit, and record which bit pattern computes each function.",
      "The assembler is two passes: pass 1 records label addresses in a symbol table, pass 2 translates each A- and C-instruction to 16 bits; compare your binary to the reference tool line by line.",
      "Remember that label lines like (LOOP) do not consume a ROM address in pass 1, so only real instructions increment the address counter."
    ],
    trouble:[
      ["A chip passes alone but fails inside the Computer","A sub-chip edge case or a clocking issue","Re-run that sub-chip's own test; sequential (clocked) parts fail first, so check the DFF-based chips"],
      ["Mult.asm gives wrong products","Loop/accumulator logic or an off-by-one","Multiply by repeated addition and trace R0, R1, R2 by hand for small inputs in the emulator"],
      ["Your assembler output differs by one bit","Wrong A-instruction address or C-instruction field encoding","The A-instruction is a 0 bit plus a 15-bit value; the C-instruction is 111 plus comp, dest and jump fields - diff against the reference at the first mismatch"],
      ["The symbol table resolves labels wrong","Pass 1 counted label lines as instructions","Label declarations do not consume a ROM address; only real instructions advance the address counter in pass 1"],
      ["HardwareSimulator will not launch","Java is missing","Install OpenJDK 17+ and run the suite's launcher, or use the web IDE"]
    ],
    challenge:"Make your assembler robust and self-checking: handle comments and whitespace, emit error messages with line numbers for undefined symbols, and add a round-trip mode that assembles then disassembles a program and asserts a match. Run it automatically over all the supplied .asm files.",
    reflect:[
      "You built the ALU from gates and later the CPU from the ALU - connect each project back to Domain 1 (gates, ALU, memory, fetch-execute) and say where the fetch-execute cycle lives in your Project 5 CPU.",
      "Your assembler has no intelligence of its own - explain what the symbol table does and why two passes are needed rather than one."
    ]
  },
  "p15lab2":{
    time:"2-3 h",
    setup:[
      "Linux with gcc, binutils (objdump, readelf, nm, strings), gdb, strace and checksec ('sudo apt install checksec' or the script).",
      "Know x86-64 basics and the compile pipeline (preprocess, compile, assemble, link).",
      "A 60-line C program with a struct, an array, a switch, a loop and a function pointer.",
      "Work only on binaries you wrote - the bomb here is your own program, which keeps this legal."
    ],
    checkpoints:[
      "You produced and read hello.i, hello.s, hello.o and the executable using gcc -E/-S/-c, objdump -d -M intel, readelf -h -l -S, nm and strings.",
      "Diffing the -O0 versus -O2 disassembly of one function, you identified the frame setup, struct offsets, the jump table and the function-pointer call.",
      "Your bomb (reads a passphrase and three numbers, checked with arithmetic you chose) builds stripped and optimized with gcc -O2 -s.",
      "You defused it using only objdump, strings, strace and gdb (break on the compare, inspect registers and memory, single-step), recording each deduction.",
      "Rebuilt with -fstack-protector-strong -fPIE -pie -z relro -z now -D_FORTIFY_SOURCE=3, checksec confirms the protections and you can explain each."
    ],
    hints:[
      "Each pipeline stage has a tool: -E preprocesses, -S compiles to assembly, -c assembles to an object, linking makes the executable, readelf shows ELF headers and sections, nm lists symbols and strings shows literals.",
      "At -O2 the compiler inlines, keeps values in registers rather than the stack, and turns a switch into a jump table - diff against -O0 to see what optimization removed.",
      "To defuse: strings may reveal the passphrase if it is not obfuscated, otherwise break in gdb at the comparison, read the expected value from a register or memory, and single-step the arithmetic checks.",
      "If checksec shows no PIE though you passed -pie, you likely missed -fPIE at compile time - pass both and confirm the ELF type is DYN."
    ],
    trouble:[
      ["objdump output is overwhelming","No symbols (stripped) and a huge dump","Use -M intel for readable syntax and focus on main and the functions it calls; for a stripped binary, start at the entry and follow calls"],
      ["gdb says 'No symbol table is loaded'","The binary was stripped","That is the exercise: break by address, use 'info registers', examine memory with x/, and reason from the disassembly"],
      ["strace shows nothing useful","The program reads stdin or the check is pure computation","strace reveals syscalls like read and write; the comparison itself is in-process, so switch to gdb for registers and memory"],
      ["checksec shows no PIE though you passed -pie","Missing -fPIE at compile, or wrong link flags","Pass both -fPIE (compile) and -pie (link) and verify with readelf -h that the Type is DYN"],
      ["FORTIFY_SOURCE seems to do nothing","It requires optimization to take effect","Compile with at least -O2 so -D_FORTIFY_SOURCE applies and the fortified function calls appear"]
    ],
    challenge:"Add an anti-analysis layer to your own bomb - compute the expected values at runtime rather than storing them as constants, so strings reveals nothing - then defuse it again. Document how that changed your workflow and why security-through-obscurity only slows an analyst who has a debugger.",
    reflect:[
      "The -O0 and -O2 disassembly of the same function differed sharply - explain two specific transformations the optimizer made and how each would mislead someone reading the binary cold.",
      "checksec listed the stack canary, PIE, RELRO and NX - pick two and explain the exact exploitation technique each one makes harder."
    ],
    safety:"Reverse engineer only software you wrote or are explicitly licensed to analyze; the bomb here is your own program. Do not apply these techniques to third-party or commercial binaries without written authorization, and keep the work on a machine you own."
  },
  "p15lab3":{
    time:"two sessions of 3 h",
    setup:[
      "Linux with gcc, gdb, strace, valgrind and -fsanitize=address.",
      "Know fork/exec/wait, file descriptors, dup2, pipe and signal handling.",
      "A terminal to run and test the shell interactively.",
      "This runs entirely on your own machine; no network or special privileges are needed."
    ],
    checkpoints:[
      "The read-tokenize-fork-exec-wait loop works with builtins cd and exit and decodes exit status correctly ($? is the code for a normal exit and 128+N for a signal).",
      "Output and input redirection (>, >>, <) via open+dup2 works, and a single pipe then N-command pipelines via pipe()+dup2 work.",
      "Background jobs with & are reaped by a non-blocking SIGCHLD handler, and SIGINT (Ctrl-C) interrupts the foreground child rather than the shell.",
      "Under 'strace -f' you see fork/clone, execve, dup2 and wait4, and under valgrind and -fsanitize=address the shell leaks nothing across 1,000 commands.",
      "Stress tests pass: a 100-command script, a 5-command pipeline, a missing command (exit 127), and a command killed with kill -9 (exit 137)."
    ],
    hints:[
      "fork() returns 0 in the child and the PID in the parent; the child execs the command and the parent waits and decodes the status with WIFEXITED/WEXITSTATUS and WIFSIGNALED/WTERMSIG.",
      "For redirection, open the file and dup2 it onto fd 0 or 1 in the child before exec; a pipe is pipe(fds) then dup2 the write end onto the left command's stdout and the read end onto the right command's stdin.",
      "Put the foreground child in its own process group so SIGINT hits it and not the shell, and reap background jobs with a SIGCHLD handler looping on waitpid(-1, ..., WNOHANG).",
      "If a pipeline hangs forever, you left a pipe end open - close every pipe fd you are not using in both the parent and the children."
    ],
    trouble:[
      ["Builtins like cd do not work","You forked for cd, so the parent's directory never changed","Run cd and exit in the parent process with no fork; only external commands fork and exec"],
      ["A pipe hangs forever","Unused pipe ends are left open","Close every pipe fd you are not using in both parent and children; a leftover open write end keeps the reader blocked waiting for EOF"],
      ["Zombie processes accumulate","Background children are not reaped","Install a SIGCHLD handler that loops waitpid(-1, ..., WNOHANG) until no more children are ready"],
      ["Ctrl-C kills the shell itself","The foreground child shares the shell's process group","Put the child in its own group with setpgid and give it the terminal; have the shell handle or ignore SIGINT appropriately"],
      ["AddressSanitizer reports leaks","Per-command token and argv buffers are not freed","Free the per-command allocations each iteration and run 1,000 commands under ASan to surface the slow leak"]
    ],
    challenge:"Add job control (jobs, fg, bg with SIGTSTP/Ctrl-Z and process-group terminal handover) and command history with line editing, then run your shell as the login shell in a disposable VM for an afternoon and fix whatever real tasks expose - the gap between a toy and a usable shell.",
    reflect:[
      "A pipeline of five commands means four pipes and five concurrent children - explain why closing the right fds is essential and what EOF has to do with a reader finishing.",
      "Exit status 137 and 127 both mean failure but tell different stories - decode each (128+9 versus command-not-found) and explain how your shell produced them."
    ]
  },
  "p15lab4":{
    time:"two sessions of 3 h",
    setup:[
      "Linux with gcc, valgrind and -fsanitize=address.",
      "Know mmap, pointers, alignment, and the glibc malloc overview (man mallopt and the comments in malloc.c).",
      "LD_PRELOAD to export your allocator so Valgrind and ASan see its bugs as plain memory errors.",
      "This runs on your own machine; no special privileges beyond building and running are needed."
    ],
    checkpoints:[
      "A bump allocator reserves a region with mmap, hands out 16-byte-aligned blocks by advancing a pointer with free as a no-op, and you measured its speed and noted when it fails.",
      "A free-list allocator has 16-byte headers (size plus in-use bit), first-fit search, block splitting, coalescing of adjacent free blocks on free, and realloc, with every returned pointer 16-byte aligned.",
      "A harness runs 100,000 random malloc/free/realloc operations with pattern-filled payloads and verifies the patterns, running clean under ASan and Valgrind.",
      "You measured fragmentation (requested bytes versus heap size) for first-fit versus best-fit after the workload.",
      "You read the glibc malloc overview and wrote a paragraph on what tcache and bins add over your design."
    ],
    hints:[
      "Round every size up to a multiple of 16 and keep the region base aligned; the bump allocator is fast because allocation is one pointer add, and its flaw is that it never reclaims memory.",
      "Each block needs a header storing its size and an in-use bit; free sets the bit and coalesces with a physically adjacent free block, and splitting avoids wasting a large block on a small request.",
      "For pattern verification, fill each allocation with a known pattern tied to its size or address and check it is intact before free; a failed pattern means overlapping allocations or header corruption.",
      "Compute the next block as (char*)block + header_size + payload_size; only merge when that physical neighbor is actually free."
    ],
    trouble:[
      ["Segfault on the second allocation","Header math or alignment is wrong","Count the header size in your offsets, make the returned pointer aligned past the header, and draw the block layout on paper"],
      ["Coalescing merges the wrong blocks or corrupts the list","Neighbor detection is off by the header size","Compute the next block as current plus header plus payload, and merge only when that neighbor is genuinely free"],
      ["Pattern verification fails intermittently","Two allocations overlap due to a splitting bug","A failed pattern means your splitter handed out overlapping memory - ensure the split leaves a valid free remainder with its own header"],
      ["ASan or Valgrind report your bugs as plain memory errors","Expected when the allocator is LD_PRELOADed","That is the point; read the first reported address and map it back to your header or split logic"],
      ["realloc loses data","You copied the wrong number of bytes","realloc must copy the smaller of the old and new sizes before freeing the old block"]
    ],
    challenge:"Add a best-fit and a segregated free-list (size-class) variant, then benchmark all three allocators plus glibc malloc on the same 100,000-operation workload for throughput and fragmentation. Report which wins on each metric and relate your size-class design to glibc's bins and tcache.",
    reflect:[
      "The bump allocator is the fastest possible and also useless for long-running programs - explain the exact trade-off and why a free list's coalescing is what makes reuse possible.",
      "Fragmentation differed between first-fit and best-fit - explain why best-fit is not always best, and what internal versus external fragmentation each suffers."
    ]
  },
  "p15lab5":{
    time:"2-3 h",
    setup:[
      "Linux with gcc, -fsanitize=thread (TSan), gdb and clock_gettime, on a multi-core machine.",
      "Know mutexes, atomics, condition variables, Amdahl's law and the GIL.",
      "Optionally the free-threaded Python 3.14t build to compare against standard CPython.",
      "This runs on your own machine; expect TSan to slow execution significantly while it instruments memory."
    ],
    checkpoints:[
      "The two-thread counter race, run ten times, gives varying or wrong totals, and building with -fsanitize=thread captures a data-race report.",
      "Three fixes (mutex, atomic_fetch_add, per-thread local counts) each give the correct total, timed with clock_gettime across 1, 2, 4, 8 and all cores, with a speedup plot explained by Amdahl's law and false sharing.",
      "A bounded producer-consumer queue (mutex plus two condition variables) moves 10 million items with 4 producers and 4 consumers, proven race-free under TSan.",
      "A deliberate deadlock (two locks, opposite order) is captured with gdb -p and 'thread apply all bt' showing the cycle, then fixed with lock ordering and again with trylock plus back-off.",
      "The same counter in Python with threading and multiprocessing is timed (and the 3.14t build if available), and you explained all the results with the GIL."
    ],
    hints:[
      "The race is a read-modify-write (count++) that interleaves between threads; TSan instruments memory accesses and reports the conflicting stacks, so trust it over eyeballing.",
      "Per-thread local counters avoid sharing entirely (sum at the end) and often beat both mutex and atomic; false sharing is when two threads' separate variables land on the same 64-byte cache line and ping-pong it between cores.",
      "The bounded queue needs two condition variables (not-full and not-empty) under one mutex: producers wait on not-full and consumers on not-empty, each signaling the other.",
      "If the deadlock will not reproduce, add a tiny sleep between the two lock acquisitions to widen the window, then attach gdb -p and dump all thread backtraces."
    ],
    trouble:[
      ["The race gives the correct total and seems fine","The timing happened not to interleave","Run it many times and under TSan; a race that looks fine is still a bug, and TSan reports it regardless of the observed total"],
      ["TSan flags a race in your 'fixed' atomic version","One access to the shared variable is still unsynchronized","Every access must be atomic or locked; a single plain read reintroduces the race"],
      ["Speedup is sublinear or negative past two cores","Lock contention or false sharing","Pad per-thread data to a cache line, shrink the critical section, and remember Amdahl caps speedup by the serial fraction"],
      ["The deadlock does not reproduce","The opposite-order locks rarely interleave","Add a short sleep between the two lock acquisitions to widen the race window, then capture it with gdb -p"],
      ["Python threading is not faster on CPU work","The GIL serializes Python bytecode","Expected; multiprocessing scales CPU-bound work and the free-threaded 3.14t build removes the GIL - time all three to see it"]
    ],
    challenge:"Quantify false sharing directly: run the per-thread-counter fix with the counters packed adjacently versus padded to separate 64-byte cache lines, measure the throughput difference across cores, and show the padded version scales where the packed one stalls. Explain the cache-coherence traffic behind it.",
    reflect:[
      "TSan flagged a race that produced the correct answer on your machine - explain why 'it worked when I ran it' is not evidence of correctness for concurrent code.",
      "threading, multiprocessing and the free-threaded build gave three different timings on the same CPU work - explain each with what the GIL does and does not serialize."
    ]
  },
  "p15lab6":{
    time:"2-3 h",
    setup:[
      "A disposable Linux VM you own, so you can safely pull the virtual power in the durability step.",
      "gcc, strace, lsof, /usr/bin/time, dumpe2fs and fio ('sudo apt install fio'), plus sudo for loopback mounts.",
      "Know file descriptors, dup2, stdio buffering, inodes, hard/symlinks, fsync and journaling.",
      "A lab notebook for fd-table drawings, strace excerpts, timings and the journaling benchmark table."
    ],
    checkpoints:[
      "A program opens a file, dup2's it onto fd 1, forks, and the child prints; you inspected /proc/PID/fd for both processes, explained every entry, and reproduced the 2>&1 ordering puzzle with fd-table drawings.",
      "stdio buffering is shown: printf without a newline then abort() (lost), then with fflush (kept), then setvbuf unbuffered, with 'strace -e write' showing exactly when the write syscall fires.",
      "Inodes and links: a file, a hard link and a symlink are created, ls -li and stat compared, and deleting the original name while a process holds it open makes df and du disagree, with lsof +L1 finding the culprit.",
      "Durability: 10,000 records written with (a) no fsync, (b) fsync per record, (c) one fsync per 100 records, timed with /usr/bin/time, then on the disposable VM the virtual power is pulled after (a) and you inspected what survived.",
      "A 1 GB loopback ext4 image mounted data=journal, data=ordered and data=writeback is benchmarked with fio, dumpe2fs reads the journal, a Btrfs snapshot shows copy-on-write, and cat /proc/filesystems and mount list the VFS."
    ],
    hints:[
      "An open file description is shared across fork and dup2, so parent and child share one file offset - draw the fd -> open-file-description -> inode chain to see why their writes interleave by offset.",
      "stdio buffers in user space, so the write syscall fires only on flush, a newline to a tty, a full buffer or exit; abort() skips the flush so unflushed data is lost, and strace -e write shows the real syscalls.",
      "A hard link is another name for the same inode (same inode number in ls -li); unlinking a name a process still has open frees the name but not the blocks until the last fd closes, so df (allocated) and du (named) disagree and lsof +L1 lists the orphaned-but-open file.",
      "For durability, fsync forces the data to the device; pull the power immediately after the no-fsync writes so you can see that their survival was luck."
    ],
    trouble:[
      ["df and du do not disagree","You closed the fd before checking, or the file was fully unlinked","Keep the process holding the fd open, delete the name while it is held, then run df, du and lsof +L1 from another shell"],
      ["strace -e write shows no write for printf","The output is buffered, not yet flushed","That is the lesson; the write appears only at flush, newline to a tty, or exit - add fflush or a newline and watch it fire"],
      ["The loopback mount fails","losetup/mount needs privileges or the image is the wrong size","Use sudo, create the image with dd or truncate to 1 GB, mkfs.ext4 it, then mount -o loop with the data= option"],
      ["fio numbers for the three journal modes look identical","Too small a run, or the page cache is hiding the device","Use a large enough fio job with sync/direct where appropriate; writeback and journal differ most under sync-heavy workloads"],
      ["After the power cut everything survived","The OS had already flushed before the cut","Pull the power immediately after the no-fsync writes; without fsync, survival is luck, so repeat to see inconsistent results"]
    ],
    challenge:"Measure the cost of durability precisely: chart throughput (records per second) against fsync frequency from 1-per-record up to 1-per-10,000, find the knee of the curve, and relate it to the device's write cache and the difference between fsync and fdatasync. State the batching policy you would choose for a write-heavy log.",
    reflect:[
      "fsync per record was far slower than batching - explain what fsync actually forces down to the device and why a database groups commits.",
      "A hard link and a symlink both point to a file but behave differently when the original is deleted - explain, using inodes and reference counts, which one survives and why."
    ],
    safety:"Do the power-cut step only on a disposable virtual machine with no data you care about; pulling the virtual power can corrupt its filesystem, which is the point, but on real hardware or a VM holding real data it causes permanent loss. Loopback mounts and fio run as root, so run them only on the throwaway VM."
  }
});
