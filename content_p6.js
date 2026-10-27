/* Domain 6 — Java (upgraded to foundation depth; facts as of October 2026; every worked example compiled and run on OpenJDK 21.0.12, build 2026-08-18) */
BOOTCAMP.phases.push({
id:"p6", num:6, title:"Java", short:"Java",
tagline:"Strong typing, the JVM, and true object-oriented thinking — the language that runs enterprise back ends, telecom billing and provisioning systems, big-data platforms and (through ART) the Android ecosystem. Learn it down to the bytecode, the garbage collector and the memory model.",
prereq:"Domain 4 (Python gave you the concepts: values, functions, collections, objects, tests). Java is stricter and more verbose; that strictness is the lesson. Domain 1 (memory, CPU caches) and Domain 3 (processes, threads, the shell) make Modules 6 and 8 click. Install a current LTS JDK (21 or 25 — Eclipse Temurin, Amazon Corretto, Microsoft's build or your distribution's openjdk package) and run every example yourself.",
outcomes:[
"Explain how Java runs: javac to bytecode, the class-file format, class loading and verification, the interpreter, tiered JIT compilation and deoptimization — and read javap output.",
"Write statically-typed Java with full control of primitives, overflow, floating point, casts, autoboxing, strings, switch expressions and methods.",
"Model problems with encapsulated classes, immutable value types and records; predict object layout and initialization order.",
"Design with interfaces, abstract classes, sealed hierarchies and pattern matching; prefer composition over inheritance; implement equals and hashCode correctly.",
"Use generics (including erasure, bounds and wildcards) and choose collections by their Big-O and memory behavior, explaining HashMap and ArrayList internals.",
"Handle checked and unchecked exceptions with try-with-resources; explain the stack, the heap, the generational collectors (G1, ZGC) and read a GC log to diagnose a leak.",
"Build, test and package a multi-module project with Maven or Gradle, JUnit 5/6, jar and jlink, and debug it in an IDE.",
"Write correct concurrent code with executors, locks, atomics and virtual threads, explain the Java Memory Model's happens-before rules, and ship a small HTTP service built with streams and lambdas."
],
texts:[
{title:"Head First Java (3rd ed.)", by:"Sierra, Bates & Gee", note:"The friendliest path into Java and OOP thinking. Read it cover to cover alongside Modules 1–5.", url:""},
{title:"Effective Java (3rd ed.)", by:"Joshua Bloch", note:"The book every professional Java developer owns; the 'right way' to use the language. Items 10–11 (equals/hashCode), 17–18 (immutability, composition), 31 (wildcards) and 78–84 (concurrency) are quoted throughout this domain.", url:""},
{title:"Oracle Java Tutorials / dev.java", by:"Oracle", note:"The authoritative free reference and tutorials; pair with the JEP index (openjdk.org/jeps) for what changed in each release.", url:"https://dev.java/learn/"},
{title:"Oracle Certified Professional: Java SE 25 Developer (1Z0-831) objectives", by:"Oracle", note:"The certification track for this domain (1Z0-830 for Java SE 21 remains on offer). See the certification page for verified exam facts.", url:"https://education.oracle.com/java-se-25-developer-professional/pexam_1Z0-831"}
],
modules:[
{id:"p6m1", title:"The JVM: Bytecode, Class Loading, the JIT and Write Once, Run Anywhere", minutes:55,
outcomes:["Explain the compile-to-bytecode, run-on-JVM model and read a class file's header and javap disassembly.","Define JDK, JRE and JVM, name the current LTS releases and explain the six-month release cadence.","Trace class loading, linking, verification and initialization, and explain why bytecode is safe to load.","Explain the interpreter, tiered C1/C2 JIT compilation, on-stack replacement and deoptimization, and why naive benchmarks lie.","Write, compile and run a first Java program, and diagnose the classic launch errors."],
body:`<p>The question this module answers: what actually happens between typing <code>java Hello</code> and seeing output, and why does that design let one compiled file run on your Windows gaming PC, a Linux server in a telecom central office and a cloud VM without change? Python (Domain 4) is compiled to bytecode and then interpreted by a C loop. Java works differently, and that difference is its defining idea. You write Java source, a <strong>compiler</strong> translates it to an intermediate form called <strong>bytecode</strong>, and a <strong>virtual machine</strong> runs that bytecode — first by interpreting it, then by compiling the hot parts to native machine code while the program runs. Understanding this model explains Java's portability, its speed, its startup cost and its tooling.</p>
<h4>The model</h4>
<p>You write a .java file. The Java compiler (javac) checks it thoroughly and compiles it to a .class file containing <strong>bytecode</strong>, a compact, platform-independent instruction set (not the machine code of any real CPU from Domain 1). The <strong>JVM</strong> (Java Virtual Machine) then executes that bytecode, translating it to the actual machine's instructions as it runs. The JVM uses a <strong>JIT</strong> (just-in-time) compiler that compiles hot bytecode to native machine code on the fly, which is why Java, despite the extra layer, runs close to native speed for long-running programs. javac does very little optimization on purpose; the heavy optimization happens at run time, where the JVM can see which code is actually hot and which types actually flow through it.</p>
<h4>Write once, run anywhere</h4>
<p>Because bytecode targets the JVM, not the hardware, the same .class file runs on Windows, macOS, Linux or a server, as long as that platform has a JVM. This is Java's famous <strong>"write once, run anywhere"</strong>. Contrast Domain 1 and Domain 15: a compiled C program is machine code for one CPU family and one operating system's binary format (ELF on Linux, PE on Windows); Java's bytecode is portable, and the JVM bridges to each platform. The JVM itself is a native program, built separately for x86-64 and ARM64 and for each OS — the portability is bought by porting the JVM once so that you never port your application. The promise has edges: code that calls native libraries through JNI or the Foreign Function and Memory API, hard-codes <code>C:\\</code> paths, or assumes a line ending is no longer portable. The trade is that the JVM must be installed and started, which is why Java shines for long-running servers, not tiny scripts.</p>
<h4>JDK, JRE, JVM</h4>
<ul>
<li><strong>JVM</strong>: the engine that runs bytecode. HotSpot, the OpenJDK implementation, is what almost everyone runs.</li>
<li><strong>JRE</strong> (Runtime Environment): the JVM plus the standard libraries needed to run Java programs. Oracle stopped shipping a separate JRE with JDK 11; some vendors (Eclipse Temurin) still package one, and <code>jlink</code> (Module 7) builds a trimmed runtime containing only the modules your application needs.</li>
<li><strong>JDK</strong> (Development Kit): the JRE plus the tools to <em>develop</em> Java, chiefly the compiler javac, and also <code>javap</code> (disassembler), <code>jshell</code> (REPL), <code>jcmd</code> and <code>jfr</code> (diagnostics), <code>jar</code> and <code>jlink</code>. You install the JDK to write Java.</li>
</ul>
<p>Java ships a feature release every six months, in March and September, and every two years one of them is a long-term support (<strong>LTS</strong>) release that vendors patch for years. The LTS line is 8, 11, 17, 21 and 25 (September 2025); JDK 26 arrived in March 2026, JDK 27 on 15 September 2026, and the next LTS will be JDK 29 in September 2027. Teams target an LTS — today 21 or 25. OpenJDK is the open-source reference; Oracle JDK, Eclipse Temurin, Amazon Corretto, Microsoft's build, Azul Zulu and the Ubuntu <code>openjdk-21</code> package used for every example in this domain (21.0.12) are builds of the same code. Java 25 is also the release the newest certification exam targets.</p>
<h4>Your first program</h4>
<p>Every Java program starts in a class with a main method (modern Java is relaxing this, but you will see it everywhere):</p>
<pre><code>public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, world");
    }
}</code></pre>
<p>Compile with javac Hello.java (produces Hello.class), run with java Hello. The ceremony, a class wrapping everything, the fixed main signature, is more than Python's single print line, and that verbosity is Java's character: explicit, structured, checked ahead of time. The payoff is that the compiler catches a whole category of errors before the program ever runs. Three modern shortcuts: <code>java Hello.java</code> compiles in memory and runs a single file (JEP 330, JDK 11), JDK 22 extended that to multi-file programs (JEP 458), and JDK 25 finalized <strong>compact source files</strong> with instance main methods (JEP 512), so a beginner's file can be just <code>void main() { IO.println("Hello"); }</code>. On JDK 21 the same idea is a preview feature (<code>java --enable-preview --source 21 Hi.java</code>), which is how it was tested here. The exam for Java SE 25 asks about these launch modes; production code still uses classes in packages (Module 7).</p>
<h4>Inside a class file</h4>
<p>A .class file is a precisely specified binary format (JVM Specification, chapter 4). It starts with the magic number <code>0xCAFEBABE</code>, then a minor and major <strong>class file version</strong>. The major version is 44 plus the Java release: 65 for Java 21, 69 for Java 25, 71 for Java 27. Then comes the <strong>constant pool</strong> — every string, class name, method name and type descriptor the code refers to, numbered so instructions can say "method #7" — followed by the fields, the methods with their bytecode, and attributes such as line-number tables for stack traces. Run <code>od -A x -t x1 -N 8 Hello.class</code> and you see <code>ca fe ba be 00 00 00 41</code>: hex 41 is 65, Java 21. That version number explains the most common deployment error in the industry: a class compiled by JDK 25 refuses to load on a Java 21 runtime with <code>UnsupportedClassVersionError ... class file version 69.0, this version of the Java Runtime only recognizes class file versions up to 65.0</code>. Fix it by upgrading the runtime or compiling with <code>javac --release 21</code>, which also checks you only used Java 21 APIs.</p>
<h4>Bytecode is a stack machine</h4>
<p>Each method call gets a frame with a local-variable array and an operand stack, and bytecode instructions push and pop that stack. Here is <code>static int square(int x) { return x * x; }</code> as <code>javap -c</code> prints it:</p>
<pre>  static int square(int);
    Code:
       0: iload_0
       1: iload_0
       2: imul
       3: ireturn</pre>
<p><code>iload_0</code> pushes local slot 0 (x) twice, <code>imul</code> pops two ints and pushes the product, <code>ireturn</code> returns the top of the stack. The type is in the opcode — <code>iload</code>, <code>lload</code>, <code>fload</code>, <code>aload</code> for int, long, float and reference — because every opcode is one byte and the JVM wants to know types without inference. A loop becomes compare-and-jump (<code>if_icmpgt</code>, <code>goto</code>) with <code>iinc</code> for <code>i++</code>; method calls are <code>invokestatic</code>, <code>invokevirtual</code>, <code>invokeinterface</code> and <code>invokespecial</code>; and since JDK 9 string concatenation compiles to <code>invokedynamic</code>, which lets the runtime choose the fastest strategy. This is the same stack-machine idea as CPython's bytecode in Domain 4 and a cousin of the x86 you read in Domain 11; tools like Ghidra and the Java decompilers in Domain 11 turn bytecode back into near-original source precisely because it keeps names and types.</p>
<h4>Class loading, linking and verification</h4>
<p>The JVM does not load your whole program at start-up; a <strong>class loader</strong> loads each class the first time it is needed. Three loaders form a hierarchy: the bootstrap loader (core classes in <code>java.base</code>), the platform loader (other JDK modules) and the application loader (your class path or module path). Loading uses parent delegation: a loader asks its parent first, so nobody can slip in a fake <code>java.lang.String</code>. Loading is followed by linking — <em>verification</em>, preparation (static fields get default values) and resolution of symbolic references — and finally initialization, when static initializers run, exactly once, on first active use. The <strong>bytecode verifier</strong> is the security keystone: it proves, before a single instruction runs, that the code never pops an empty stack, never treats an int as a reference and never jumps outside the method, which is why bytecode cannot forge a pointer the way a C program can. Count it yourself: on this machine <code>java -Xlog:class+load</code> shows that Hello world loads 541 classes, 532 of them mapped straight from the class data sharing (CDS) archive, a pre-parsed snapshot of JDK classes that cuts start-up time. Two errors come from this machinery: <code>ClassNotFoundException</code> (code asked a loader by name and it was not found) and <code>NoClassDefFoundError</code> (the class existed at compile time but is missing, or failed initialization, at run time).</p>
<h4>The execution engine: interpreter, C1 and C2</h4>
<p>HotSpot uses <strong>tiered compilation</strong>. Every method starts in the interpreter (tier 0). After about 200 invocations (<code>Tier3InvocationThreshold</code>) the C1 compiler produces quick native code instrumented to profile which branches are taken and which classes appear at each call site (tier 3). After about 5,000 (<code>Tier4InvocationThreshold</code>) the C2 compiler uses that profile to produce heavily optimized code (tier 4): inlining small methods, removing bounds checks it can prove unnecessary, unrolling loops, allocating short-lived objects in registers instead of on the heap (escape analysis), and turning an interface call that has only ever seen one class into a direct, inlined call. A long-running loop cannot wait for the method to be called again, so the JIT performs <strong>on-stack replacement</strong> (OSR): it compiles the loop and jumps into the compiled version mid-execution. When a speculation turns out wrong — a second implementation class gets loaded, a never-taken branch is taken — the JVM performs <strong>deoptimization</strong>: it discards that compiled code, reconstructs the interpreter frame and carries on, to recompile later. Compiled code lives in the code cache (240 MiB reserved on this machine).</p>
<p>Measured on this machine, the same 2-million-iteration method, eight rounds: with the JIT the rounds took 5,224, 3,305, 2,215 … 2,071 µs; with <code>-Xint</code> (interpreter only) every round took about 35,000–38,000 µs. Steady state is about 37,000 / 2,100 ≈ 17 times faster, and the first round is slower than the rest because it ran partly interpreted. <code>-XX:+PrintCompilation</code> shows the climb — the <code>%</code> marks OSR, the 3 and 4 are the tiers, and "made not entrant" is code being replaced:</p>
<pre> ms  id  %  tier  method
 46    7 %     3  Warmup::work @ 4 (29 bytes)
 48    8       3  Warmup::work (29 bytes)
 48    9 %     4  Warmup::work @ 4 (29 bytes)
 49    7 %     3  Warmup::work @ 4 (29 bytes)   made not entrant
 94  110       4  Warmup::work (29 bytes)</pre>
<p>Two lessons follow. First, Java performance is a function of time: a service is slow for its first seconds (warm-up) and fast afterwards, so load-test after warm-up and do not judge Java by a 50 ms script. Second, naive benchmarks lie — dead-code elimination, OSR and warm-up distort a hand-written timing loop — so serious measurements use JMH, the OpenJDK benchmark harness. Start-up keeps improving: JDK 24 added an ahead-of-time cache of loaded and linked classes (JEP 483) and JDK 25 added AOT method profiles (JEP 515), while GraalVM Native Image compiles a whole application ahead of time into a native executable that starts in milliseconds, at the cost of a closed world (limited reflection and dynamic class loading).</p>
<h4>When it goes wrong</h4>
<table><tr><th>Symptom</th><th>Cause</th><th>Fix</th></tr>
<tr><td><code>Error: Could not find or load main class Hello</code></td><td>Wrong directory or class path, typed <code>java Hello.class</code>, or the class is in a package</td><td>Run from the class-path root with the fully qualified name: <code>java -cp out com.you.app.Main</code></td></tr>
<tr><td><code>UnsupportedClassVersionError</code></td><td>Compiled by a newer javac than the runtime</td><td>Upgrade the runtime, or <code>javac --release 21</code></td></tr>
<tr><td><code>javac: command not found</code></td><td>Only a runtime is installed, or PATH/JAVA_HOME is wrong</td><td>Install a JDK; check <code>java -version</code> and <code>javac -version</code> agree</td></tr>
<tr><td><code>class Hello is public, should be declared in a file named Hello.java</code></td><td>File name and public class name differ</td><td>Rename the file or the class (case matters)</td></tr>
<tr><td><code>NoClassDefFoundError</code> at run time</td><td>A dependency present at compile time is missing at run time, or a static initializer threw</td><td>Fix the class path (Module 7); read the "Caused by" of the first failure</td></tr></table>
<h4>Where Java lives</h4>
<p>Java runs a huge share of the world's back-end systems: banks, airlines, e-commerce, telecom billing and provisioning, and most large enterprises, because it is fast, stable, strongly typed and has a mature ecosystem. <strong>Android</strong> apps are built in Kotlin (Google's preferred language since 2019) or Java, but correct a common claim: Android does not run a JVM. The build converts JVM bytecode into Dalvik bytecode (DEX) with the D8 tool, and the Android Runtime (ART) runs it with a mix of ahead-of-time and just-in-time compilation — Domain 39 builds on exactly that pipeline. Kotlin, Scala, Clojure and Groovy all compile to JVM bytecode, which is why the JVM, not the Java language, is the real platform. Big-data tools (Hadoop, Spark, Kafka) are JVM software, and so are tools you will use in this course: Ghidra (Domain 11) and Burp Suite (Domain 8). Learning Java is a direct path to enterprise and Android jobs, and its discipline makes you a better programmer in any language.</p>
<p><em>Exam mapping.</em> The Java SE 25 Developer exam (1Z0-831) and its Java 21 sibling (1Z0-830) place compiling and launching code under "Packaging and Deploying Java Code": compiling with javac, running single-file and multi-file source programs, compact source files and instance main methods (new in 25), class paths and JARs. The JIT, class loading and the class-file format are not exam items, but they are what interviewers mean by "do you understand the JVM?", and they are the foundation for the GC and concurrency material in Modules 6 and 8.</p>`,
example:`<p><strong>Watching the JIT work (OpenJDK 21.0.12, two-core VM).</strong> Save this as <code>Warmup.java</code>, compile with <code>javac Warmup.java</code>, then run it twice — once normally, once with the JIT switched off:</p>
<pre>public class Warmup {
    // Sum of i*i mod 7 over a range: enough arithmetic for the JIT to matter.
    static long work(int n) {
        long sum = 0;
        for (int i = 0; i &lt; n; i++) {
            sum += (long) i * i % 7;
        }
        return sum;
    }
    public static void main(String[] args) {
        long check = 0;
        for (int round = 1; round &lt;= 8; round++) {
            long t0 = System.nanoTime();
            check += work(2_000_000);
            long us = (System.nanoTime() - t0) / 1_000;
            System.out.printf("round %d: %,6d us%n", round, us);
        }
        System.out.println("checksum " + check);
    }
}</pre>
<p><code>java Warmup</code> printed:</p>
<pre>round 1:  5,224 us
round 2:  3,305 us
round 3:  2,215 us
round 4:  2,594 us
round 5:  2,288 us
round 6:  2,137 us
round 7:  2,240 us
round 8:  2,071 us
checksum 31999976</pre>
<p><code>java -Xint Warmup</code> (interpreter only) printed:</p>
<pre>round 1: 37,472 us
round 2: 37,418 us
round 3: 37,585 us
round 4: 38,168 us
round 5: 37,532 us
round 6: 34,714 us
round 7: 34,725 us
round 8: 34,712 us
checksum 31999976</pre>
<p>Read it like an engineer. The checksum is identical, so both runs computed the same thing; only speed differs. Interpreted, each round costs about 37,000 µs, roughly 18.5 ns per loop iteration — dozens of bytecode dispatches for the multiply, modulo and add. With tiered compilation, round 1 (5,224 µs) still includes interpreted and C1 time, round 2 is partly C2 code entered by on-stack replacement, and from round 3 the C2 code settles near 2,100 µs, about 1 ns per iteration: 37,000 / 2,100 ≈ 17 times faster. If you had timed only round 1 you would have underestimated Java's speed by 2.5 times; if you had timed a single short run of a CLI tool, the 40-odd milliseconds of JVM start-up would dominate everything. Then run <code>javap -c Warmup</code> and find <code>lrem</code> (long remainder) and <code>i2l</code> (int-to-long widening) — the cast in <code>(long) i * i</code> made visible.</p>`,
misconceptions:["\"Java is interpreted like Python.\" Java compiles to bytecode, which the JVM runs (and JIT-compiles to native); it's a hybrid, much faster for long-running work.","\"Java and JavaScript are related.\" They share only a name (a 1990s marketing decision); they're entirely different languages.","\"The JVM makes Java slow.\" Startup is slower, but JIT compilation makes steady-state performance near native.","\"Android phones run a Java virtual machine.\" Android converts JVM bytecode to DEX and runs it on ART with ahead-of-time and JIT compilation; the language is Java or Kotlin, the runtime is not a JVM.","\"A .class file runs on any Java version.\" It runs on its own version or newer; an older runtime rejects a newer class-file version with UnsupportedClassVersionError unless you compiled with --release for that target."],
problems:[
{q:"Put these in order from what you write to what executes: bytecode, source code, machine code, JVM.", a:"Source code → (javac) → bytecode → JVM (JIT) → machine code executes."},
{q:"What's the difference between the JDK and the JRE?", a:"JRE runs Java (JVM + libraries); JDK adds the development tools (compiler javac) to write it."},
{q:"Why can the same .class file run on Windows and Linux?", a:"Bytecode targets the JVM, not the hardware; each platform's JVM translates it to that machine's instructions."},
{q:"Give one reason big enterprises favor Java's static typing.", a:"The compiler catches whole classes of errors before running, which matters more as codebases grow large and long-lived."},
{q:"Name two places Java runs in the real world.", a:"Any two: enterprise back-ends (banking, e-commerce), Android apps, big-data tools (Spark/Kafka/Hadoop)."},
{q:"A class file starts ca fe ba be 00 00 00 45. Which Java release compiled it, and what happens if you run it on a Java 21 runtime?", a:"Hex 45 = 69 = 44 + 25, so Java 25. A Java 21 runtime supports class files up to version 65 and throws UnsupportedClassVersionError; upgrade the runtime or recompile with javac --release 21."},
{q:"With Tier3InvocationThreshold = 200 and Tier4InvocationThreshold = 5,000, a request handler is called 40 times per second. Roughly when does it reach C1 and when C2 code, and what does that mean for a load test?", a:"200 / 40 = 5 s to tier 3 (C1 with profiling) and 5,000 / 40 = 125 s to tier 4 (C2). Measure only after a warm-up of a few minutes, or the numbers describe interpreted and C1 code, not production steady state. (Loops can be OSR-compiled sooner.)"},
{q:"Interpreted, a loop iteration costs 18.5 ns; C2 code costs 1.05 ns. A batch job runs the loop 10 billion times. Estimate both run times, and the share of the compiled run spent warming up if warm-up costs 0.3 s.", a:"Interpreted: 10^10 × 18.5 ns = 185 s. Compiled: 10^10 × 1.05 ns ≈ 10.5 s. Warm-up of 0.3 s is 0.3 / 10.8 ≈ 3% of the run — and it shrinks toward zero as the job gets longer, which is exactly why Java suits long-running work and is weak for 50 ms scripts."},
{q:"A deployment fails with NoClassDefFoundError: com/fasterxml/jackson/databind/ObjectMapper, though the code compiled fine. Diagnose.", a:"The library was on the compile class path but is not on the run-time class path (or a different packaging dropped it). Ship the dependency: run with the full class path, build a fat/uber jar, or let Maven/Gradle produce the runtime classpath; check with jar tf or mvn dependency:tree."}
],
checks:[{q:"What does javac produce?",a:"Bytecode (.class files)."},{q:"What runs the bytecode?",a:"The JVM (with JIT compiling hot code to native)."},{q:"What does 'write once, run anywhere' mean?",a:"The same bytecode runs on any platform with a JVM."},{q:"What are the current LTS releases, and the next one?",a:"17, 21 and 25 (September 2025); next LTS is JDK 29 in September 2027."},{q:"What does the bytecode verifier guarantee?",a:"Type-safe stack and locals, no jumps outside the method, no forged references — checked before the code runs."}],
explain:"Explain to ADA the compile-to-bytecode-run-on-JVM model and why it makes Java portable, contrasting it with a compiled C program from Domain 1 — then explain why the same loop got 17 times faster after its third round."},

{id:"p6m2", title:"Syntax and Static Typing: Types, Variables, Control Flow and Methods", minutes:55,
outcomes:["Declare typed variables and distinguish primitives from objects, with exact sizes and ranges.","Predict integer overflow, integer division, casts and floating-point results, and choose long, BigDecimal or Math.*Exact when correctness matters.","Explain autoboxing and the Integer cache, and why == on wrappers and strings misleads.","Use Java's operators, switch expressions and loops; write overloaded methods with typed parameters and return types.","Explain static typing and read the compiler errors it produces."],
body:`<p>The question this module answers: what exactly does Java's compiler know about every value in your program, and where does that knowledge stop protecting you? Coming from Python, Java's syntax will feel strict and noisy at first: every variable has a declared type, every statement ends in a semicolon, blocks use braces, and the compiler enforces it all. That strictness is the point — but the type system also has sharp edges (silent overflow, integer division, wrapper identity) that the compiler happily accepts. Learn both halves.</p>
<h4>Static typing</h4>
<p>In Python a variable can hold anything and change type freely. In Java, you declare a variable's <strong>type</strong> and it is fixed: int count = 5; String name = "Sam";. This is <strong>static typing</strong>: types are checked at compile time. Try to put the wrong type in, or call a method that does not exist on that type, and the program will not compile. You write more up front (the types), and in return the compiler and your editor catch mistakes instantly and autocomplete accurately. (Modern Java lets you write var count = 5; where the type is obvious; the type is still fixed, just inferred.) <code>var</code> works only for local variables with an initializer — not fields, not parameters, not <code>var x = null;</code> — and it never makes Java dynamic: <code>var list = new ArrayList&lt;String&gt;()</code> is permanently an <code>ArrayList&lt;String&gt;</code>. Every expression has a compile-time type that the compiler reasons with and a run-time class of the actual object; Module 4's polymorphism lives in the gap between the two.</p>
<h4>Primitives vs objects</h4>
<p>Java has two families of type, a distinction Python hides. <strong>Primitives</strong> are simple values stored directly: int (whole numbers), long (big whole numbers), double (decimals, Domain 1's floats), boolean (true/false), char (one character), plus byte, short, float. They are lowercase and fast. <strong>Objects</strong> are everything else, created from classes: String, arrays, and your own types. Objects are referred to by <strong>references</strong> (Domain 4's "names point to objects", Module 6 goes deeper). Each primitive has an object wrapper (int to Integer, double to Double) for when you need an object, and Java auto-converts between them (autoboxing). Knowing which you are holding matters for equality (Module 4) and collections (Module 5).</p>
<h4>The eight primitives, exactly</h4>
<table><tr><th>Type</th><th>Bits</th><th>Range or precision</th><th>Default (fields)</th></tr>
<tr><td>byte</td><td>8</td><td>-128 to 127</td><td>0</td></tr>
<tr><td>short</td><td>16</td><td>-32,768 to 32,767</td><td>0</td></tr>
<tr><td>char</td><td>16 (unsigned)</td><td>0 to 65,535 — one UTF-16 code unit</td><td>'\\u0000'</td></tr>
<tr><td>int</td><td>32</td><td>-2,147,483,648 to 2,147,483,647 (about ±2.1 billion)</td><td>0</td></tr>
<tr><td>long</td><td>64</td><td>about ±9.22 × 10^18</td><td>0L</td></tr>
<tr><td>float</td><td>32</td><td>IEEE 754, about 7 significant digits</td><td>0.0f</td></tr>
<tr><td>double</td><td>64</td><td>IEEE 754, about 15–17 significant digits</td><td>0.0</td></tr>
<tr><td>boolean</td><td>JVM-defined</td><td>true or false; not convertible to or from int</td><td>false</td></tr></table>
<p>Unlike C (Domain 15), these sizes are fixed by the language on every platform — part of write once, run anywhere. Integers are two's complement (Domain 1), so the bit pattern of -1 is all ones. Literals carry types too: <code>42</code> is an int, <code>42L</code> a long, <code>3.0</code> a double, <code>3.0f</code> a float, and underscores are allowed for readability (<code>2_000_000</code>).</p>
<h4>Overflow and conversion</h4>
<p><strong>Integer overflow</strong> is silent in Java: arithmetic wraps modulo 2^32 for int and 2^64 for long, with no error. <code>Integer.MAX_VALUE + 1</code> is -2,147,483,648. The classic production bug is a constant computed in int before it is widened: <code>long ms = 30 * 24 * 60 * 60 * 1000;</code> multiplies five ints, the true answer 2,592,000,000 exceeds 2,147,483,647, the result wraps to 2,592,000,000 − 4,294,967,296 = -1,702,967,296, and only then is it widened to long. Write <code>30L * 24 * ...</code> so the first operand forces long arithmetic. When overflow must be an error rather than a wrap — money, counters, array sizes — use <code>Math.addExact</code>, <code>multiplyExact</code> and <code>toIntExact</code>, which throw <code>ArithmeticException</code>. Conversions follow fixed rules: <em>widening</em> (int to long, int to double) is automatic; <em>narrowing</em> needs a cast and silently drops information — <code>(int) 3.99</code> is 3 (truncation toward zero), <code>(byte) 200</code> is -56 (200 − 256). Arithmetic on byte, short and char is promoted to int first, so <code>byte b = 10; b = b + 1;</code> fails to compile ("possible lossy conversion from int to byte") while <code>b += 1</code> compiles, because compound assignment hides a cast.</p>
<h4>Floating point and money</h4>
<p>double is binary floating point, so most decimal fractions are approximations: <code>0.1 + 0.2</code> prints 0.30000000000000004, exactly as in Domain 4. Never compare doubles with == after arithmetic; compare with a tolerance (<code>Math.abs(a - b) &lt; 1e-9</code>). Never store money in a double: store whole cents in a long, or use <code>BigDecimal</code> built from a String (<code>new BigDecimal("0.1")</code>; the double constructor captures the binary error). Division by zero differs by type: integer <code>5 / 0</code> throws <code>ArithmeticException</code>, but <code>5.0 / 0</code> is Infinity and <code>0.0 / 0</code> is NaN, which is not even equal to itself.</p>
<h4>Operators and control flow</h4>
<p>Arithmetic (+ - * / %), comparison (== != &lt; &gt; &lt;= &gt;=), logical (&amp;&amp; || !), all like Domain 4/5. Control flow is C-style: if/else if/else, while, for (two forms: the classic for (int i = 0; i &lt; n; i++) and the enhanced for (String s : items) that iterates a collection), switch, break, continue. Braces define blocks; indentation is cosmetic (unlike Python). One integer-math trap from Domain 1: 7 / 2 is 3 (integer division) when both are ints; you need 7.0 / 2 or a double to get 3.5. A second trap for Python programmers: Java's integer division truncates toward zero, so <code>-7 / 2</code> is -3 and <code>-7 % 2</code> is -1, where Python gives -4 and 1; <code>Math.floorDiv</code> and <code>Math.floorMod</code> give Python's answers. <code>&amp;&amp;</code> and <code>||</code> short-circuit (<code>s != null &amp;&amp; s.isEmpty()</code> is safe); the single <code>&amp;</code> and <code>|</code> evaluate both sides.</p>
<p>Modern Java's <strong>switch expression</strong> (Java 14) is the version to write: arrow labels never fall through, several labels share an arm (<code>case 4, 5 -&gt;</code>), the whole switch yields a value, and the compiler insists every possible value is covered (a <code>default</code> or, with enums and sealed types, every constant — Module 4). Use <code>yield</code> to return a value from a block arm. The old colon-style switch with <code>break</code> still compiles, and forgetting a <code>break</code> still falls through to the next case — a bug class the arrow form deletes.</p>
<h4>Methods</h4>
<p>A <strong>method</strong> is Java's function, but it lives inside a class and declares the type of every parameter and its return value:</p>
<pre><code>public static int add(int a, int b) {
    return a + b;
}</code></pre>
<p>The return type (int) comes before the name; void means it returns nothing. public and static are <strong>modifiers</strong> (Module 3 covers access; static means the method belongs to the class, not an instance). Methods can be <strong>overloaded</strong>: several methods with the same name but different parameter types, and the compiler picks the right one by the arguments. The typed signature is a contract the compiler enforces at every call site, the opposite of Python's "find out at runtime". Overload resolution happens at compile time in three phases — an exact or widening match first, then autoboxing, then varargs — so <code>print(5)</code> prefers <code>print(long)</code> over <code>print(Integer)</code>. Java passes every argument <em>by value</em>: a primitive is copied, and for an object the <em>reference</em> is copied, so a method can mutate the caller's object but cannot make the caller's variable point somewhere else (Module 6 draws it). The compiler also enforces definite assignment ("variable might not have been initialized") and that every path of a non-void method returns.</p>
<h4>Autoboxing and the Integer cache</h4>
<p><strong>Autoboxing</strong> converts int to Integer (and back) automatically, so <code>List&lt;Integer&gt;</code> accepts <code>list.add(7)</code>. It is convenient and has three costs. Memory: an Integer is a 16-byte object (a 12-byte header plus 4 bytes of value) reached through a 4-byte reference, so a million boxed ints cost about 20 MB where an <code>int[]</code> costs 4 MB. Null: unboxing a null Integer throws <code>NullPointerException</code> on a line that contains no visible method call. Identity: <code>Integer.valueOf</code> is guaranteed to cache values from -128 to 127; an implementation may cache additional values. Two boxed 127s therefore compare identical under the required cache behavior, but two boxed 128s are not guaranteed to be different objects. <code>==</code> tests reference identity, not numeric value; compare wrappers with <code>equals</code> or unbox deliberately. Compare wrappers with <code>equals</code>, or unbox first.</p>
<h4>Strings</h4>
<p>String is an object and is <strong>immutable</strong> (Domain 4): methods like toUpperCase() return a new String. Compare strings with .equals() (value equality), never == (which compares references, Module 4's big trap). Concatenate with + or, for heavy building, a StringBuilder. Text blocks (triple-quoted) handle multi-line strings in modern Java. Under the hood, string literals are interned in a <strong>string pool</strong>, which is why two identical literals happen to be ==; a String built at run time or with <code>new String</code> is a separate object. Since JDK 9, compact strings store Latin-1 text in one byte per character and switch to two-byte UTF-16 only when needed. Repeated <code>s += piece</code> inside a loop copies the whole string each time — n appends of a growing string cost O(n²) character copies — while one StringBuilder appends in amortized O(1) each. A text block strips the incidental indentation common to its lines, and a trailing backslash joins two lines.</p>
<h4>Compiler errors you will meet</h4>
<table><tr><th>Message</th><th>Meaning</th></tr>
<tr><td><code>incompatible types: String cannot be converted to int</code></td><td>The value's type does not fit the variable's declared type</td></tr>
<tr><td><code>possible lossy conversion from double to int</code></td><td>Narrowing needs an explicit cast — decide if losing the fraction is intended</td></tr>
<tr><td><code>variable x might not have been initialized</code></td><td>Some path reads a local before any assignment (locals have no default)</td></tr>
<tr><td><code>missing return statement</code></td><td>A path through a non-void method ends without returning</td></tr>
<tr><td><code>cannot find symbol</code></td><td>A typo, a missing import, or a method that does not exist on the static type</td></tr></table>
<p><em>Exam mapping.</em> This module is the first two objective groups of 1Z0-831 and 1Z0-830: "Handling Date, Time, Text, Numeric and Boolean Values" (primitives and wrappers, the Math API, parentheses, type promotion and casting, String, StringBuilder and text blocks) and "Program Flow Control" (if/else, switch statements and expressions, loops, break and continue). The exam's favorite tricks are exactly the ones above: compound-assignment casts, integer division, wrapper identity, text-block whitespace, and which switch forms compile. The Date-Time API (<code>LocalDate</code>, <code>Duration</code>, <code>Period</code>, <code>ZonedDateTime</code>) belongs to the same objective; practice it with the Oracle tutorial.</p>`,
example:`<p><strong>Every numeric trap in one run (OpenJDK 21.0.12).</strong> <code>Types.java</code> is complete; compile with <code>javac Types.java</code> and run with <code>java Types</code>:</p>
<pre>import java.math.BigDecimal;

public class Types {
    static String classify(int code) {
        return switch (code / 100) {          // switch expression (Java 14+)
            case 2 -&gt; "success";
            case 3 -&gt; "redirect";
            case 4, 5 -&gt; "error";
            default -&gt; "unknown";
        };
    }
    public static void main(String[] args) {
        int max = Integer.MAX_VALUE;
        System.out.println("int max      = " + max);
        System.out.println("max + 1      = " + (max + 1));          // silent wraparound
        long ms = 30 * 24 * 60 * 60 * 1000;                         // int math, then widened
        long msOk = 30L * 24 * 60 * 60 * 1000;
        System.out.println("30 days ms   = " + ms + " (wrong) vs " + msOk);
        System.out.println("7 / 2        = " + (7 / 2) + ",  7 / 2.0 = " + (7 / 2.0));
        System.out.println("-7 / 2       = " + (-7 / 2) + ", -7 % 2 = " + (-7 % 2));
        System.out.println("0.1 + 0.2    = " + (0.1 + 0.2));
        System.out.println("BigDecimal   = " + new BigDecimal("0.1").add(new BigDecimal("0.2")));
        char c = 'A';
        System.out.println("'A' + 1      = " + (c + 1) + "  (char)('A'+1) = " + (char) (c + 1));
        Integer a = 127, b = 127, x = 128, y = 128;
        System.out.println("127 == 127   : " + (a == b) + "   128 == 128 : " + (x == y) + "   128.equals : " + x.equals(y));
        try {
            Math.addExact(max, 1);
        } catch (ArithmeticException e) {
            System.out.println("addExact     : " + e.getMessage());
        }
        var list = new java.util.ArrayList&lt;String&gt;();             // var: type inferred, still fixed
        list.add("fiber");
        System.out.println("var list     : " + list + " is " + list.getClass().getSimpleName());
        System.out.println("404 is       : " + classify(404) + ", 302 is " + classify(302));
        String s1 = "hi", s2 = "hi", s3 = new String("hi");
        System.out.println("literal ==   : " + (s1 == s2) + ", new String == : " + (s1 == s3) + ", equals : " + s1.equals(s3));
    }
}</pre>
<p>Output:</p>
<pre>int max      = 2147483647
max + 1      = -2147483648
30 days ms   = -1702967296 (wrong) vs 2592000000
7 / 2        = 3,  7 / 2.0 = 3.5
-7 / 2       = -3, -7 % 2 = -1
0.1 + 0.2    = 0.30000000000000004
BigDecimal   = 0.3
'A' + 1      = 66  (char)('A'+1) = B
127 == 127   : true   128 == 128 : false   128.equals : true
addExact     : integer overflow
var list     : [fiber] is ArrayList
404 is       : error, 302 is redirect
literal ==   : true, new String == : false, equals : true</pre>
<p>Line by line: MAX_VALUE + 1 wraps to the most negative int. The 30-day constant is computed in int and wraps to -1,702,967,296 before being widened; the <code>30L</code> version is right. Integer division truncates (3, and -3 rather than Python's -4). <code>0.1 + 0.2</code> shows binary floating point while BigDecimal built from strings gives exactly 0.3. <code>'A' + 1</code> promotes the char to the int 66; casting back gives 'B'. Boxed 127s share one cached object, boxed 128s do not, and <code>equals</code> is right in both cases. <code>Math.addExact</code> turns silent overflow into an exception. The switch expression maps 404 to "error" with no break statements. The last line shows the string pool: two literals are one object, <code>new String</code> is another, and <code>equals</code> compares the text.</p>`,
misconceptions:["\"Types are just extra typing.\" They let the compiler and editor catch errors and autocomplete; the cost up front is repaid in caught bugs.","\"== compares strings.\" == compares references for objects; use .equals() for value equality (== is fine for primitives).","\"int division gives a decimal.\" int / int truncates (7/2 = 3); use a double for 3.5.","\"The compiler would warn me about overflow.\" int and long arithmetic wraps silently; use long early in the expression or Math.addExact/multiplyExact when overflow must fail loudly.","\"var makes Java dynamically typed.\" var infers a fixed static type at compile time and works only for initialized local variables."],
problems:[
{q:"Declare an integer count set to 10 and a String city set to 'Austin'.", a:"int count = 10; String city = \"Austin\";"},
{q:"Why does the compiler reject String n = 5; ?", a:"Static typing: 5 is an int, not a String; the types don't match, so it won't compile."},
{q:"What's the difference between a primitive and an object in Java? Give one of each.", a:"Primitives (int, double, boolean) store values directly; objects (String, arrays, your classes) are accessed by reference. e.g. int vs String."},
{q:"How do you correctly compare two String variables for equal text?", a:"a.equals(b) — never == (which compares references)."},
{q:"What does 7 / 2 evaluate to in Java, and how do you get 3.5?", a:"3 (integer division); use 7.0 / 2 or cast to double."},
{q:"A meter logs fiber length in millimetres as an int. What is the longest run it can hold before overflow, in km, and what type should it use for a 3,000 km backbone?", a:"2,147,483,647 mm ≈ 2,147 km, so 3,000 km = 3,000,000,000 mm overflows an int (it would wrap negative). Use long (up to 9.2 × 10^18 mm), or store metres if millimetre precision is not needed."},
{q:"Predict the output: byte b = (byte) 130; short s = 10; s += 2.9; System.out.println(b + \" \" + s + \" \" + (char) ('a' + 2) + \" \" + (-9 / 4) + \" \" + Math.floorMod(-9, 4));", a:"-126 12 c -2 3. (130 − 256 = -126; compound assignment casts 12.9 to 12; 'a'+2 = 99 = 'c'; -9/4 truncates to -2; floorMod(-9,4) = 3.)"},
{q:"A method returns Integer and the caller writes int total = count(); It crashes with NullPointerException on that line, which contains no dot. Diagnose and give two fixes.", a:"count() returned null and auto-unboxing called intValue() on it. Fix by never returning null (return 0 or an OptionalInt), or by checking before unboxing (Integer c = count(); int total = c == null ? 0 : c;)."},
{q:"Two Integer variables both hold 1000 and a == b is false, yet an equivalent test with 100 passes. Explain and fix.", a:"Integer.valueOf caches only -128..127, so two boxed 100s are the same cached object but two boxed 1000s are distinct objects; == compares references. Use a.equals(b) or compare the unboxed ints (a.intValue() == b.intValue())."}
],
checks:[{q:"What is static typing?",a:"Variable types are declared and checked at compile time."},{q:"Primitive vs object — name one each.",a:"Primitive: int/double/boolean; object: String/array/your class."},{q:"How to compare strings by value?",a:".equals(), not ==."},{q:"Range of int?",a:"-2,147,483,648 to 2,147,483,647 (32-bit two's complement)."},{q:"Which boxed values does Integer.valueOf cache?",a:"-128 to 127."}],
explain:"Explain to ADA why Java's compiler rejecting a type mismatch before running is an advantage, not an annoyance, especially on a big team — then explain the one class of numeric bug (silent overflow) that it does not catch, using the 30-days-in-milliseconds example."},

{id:"p6m3", title:"Object-Oriented Programming: Classes, Objects, Encapsulation and Records", minutes:55,
outcomes:["Define a class with fields, methods and constructors, and predict its initialization order.","Create objects with new, use references, and estimate an object's size in bytes.","Apply encapsulation with private fields, validated methods, final fields and defensive copies.","Build immutable value types with records and compact constructors.","Explain this, instance vs static, nested vs inner classes, enums, and why OOP organizes large programs."],
body:`<p>The question this module answers: how do you make a piece of a large program responsible for its own correctness, so that a bug in one place cannot quietly corrupt data everywhere? Java is object-oriented to its core, far more than Python requires. Where Domain 4 treated classes as optional, in Java almost everything lives in a class, and modeling your problem as interacting objects is the central skill. This module builds that foundation, from the syntax down to what an object costs in memory.</p>
<h4>Classes and objects</h4>
<p>A <strong>class</strong> is a blueprint; an <strong>object</strong> (or <strong>instance</strong>) is a thing built from it. A class defines <strong>fields</strong> (its data) and <strong>methods</strong> (its behavior):</p>
<pre><code>public class Account {
    private String owner;      // field
    private double balance;    // field

    public Account(String owner, double balance) {   // constructor
        this.owner = owner;
        this.balance = balance;
    }
    public void deposit(double amount) {              // method
        this.balance += amount;
    }
    public double getBalance() {                      // getter
        return this.balance;
    }
}</code></pre>
<p>You create objects with <strong>new</strong>: Account a = new Account("Sam", 100.0);. Now a is a reference to an Account object; a.deposit(50) calls its method. You can make many independent Account objects, each with its own owner and balance, which is the point: one class, many instances. (Module 2's warning applies: a real ledger stores cents in a long or uses BigDecimal, not double — the worked example does.)</p>
<h4>Constructors and this</h4>
<p>A <strong>constructor</strong> runs when you new an object and sets up its initial state. It has the class's name and no return type. <strong>this</strong> refers to the current object, used to distinguish the field (this.owner) from a parameter of the same name (owner). A class can have several constructors (overloaded) for different ways to create it, and one can delegate to another with <code>this(...)</code> as its first statement. If you write no constructor, javac supplies a no-argument default one; the moment you write any constructor, that default disappears — the source of "constructor Account in class Account cannot be applied to given types".</p>
<h4>What new actually does</h4>
<p><code>new Account("Sam", 100.0)</code> is five steps. (1) If the class has not been initialized, the JVM runs its static initializers, once (Module 1's class loading). (2) It allocates memory on the heap — usually by bumping a pointer inside a thread-local allocation buffer, a few nanoseconds — and zeroes it, which is why fields start as 0, false or null. (3) It calls the constructor, whose first action is always a call to the superclass constructor (<code>super()</code>, inserted for you), so <code>Object</code>'s constructor runs first and subclasses are built on a finished base. (4) Field initializers and instance initializer blocks run in textual order. (5) The rest of the constructor body runs and <code>new</code> yields the reference. The order matters when a superclass constructor calls an overridable method: the subclass override runs before the subclass's own fields are initialized and sees zeros and nulls — one reason Effective Java says constructors must not call overridable methods. JDK 25's flexible constructor bodies (JEP 513, on the Java 25 exam) allow statements before <code>super(...)</code> that validate arguments without touching <code>this</code>, so a bad argument can be rejected before the superclass does any work.</p>
<h4>What an object costs</h4>
<p>On 64-bit HotSpot every object starts with a header: an 8-byte mark word (identity hash, lock state, GC age) and a 4-byte compressed class pointer, 12 bytes in all, and every object is padded to a multiple of 8 bytes. References are 4 bytes while the heap is under 32 GB (<strong>compressed oops</strong>). So the Account above is 12 (header) + 4 (owner reference) + 8 (double) = 24 bytes, plus its String, which is a separate object. A <code>record Point(int x, int y)</code> is 12 + 4 + 4 = 20, padded to 24 bytes; a million of them cost 24 MB. Compact object headers shrink the header to 8 bytes (JEP 519, a product option in JDK 25; on by default in JDK 27 via JEP 534), making that Point 16 bytes and the million 16 MB — a third less heap for small-object-heavy services without changing a line of code. This arithmetic is why Module 5 prefers <code>int[]</code> to <code>List&lt;Integer&gt;</code> for large numeric data.</p>
<h4>Encapsulation</h4>
<p><strong>Encapsulation</strong> is the principle of hiding an object's internal data and exposing a controlled interface. You mark fields <strong>private</strong> (reachable only inside the class) and provide <strong>public</strong> methods to interact with them, getters to read and setters to write, often with validation. Why: the object protects its own invariants. An Account with a private balance and a deposit/withdraw method can refuse an overdraft; a public balance anyone could set to -1000 cannot. Encapsulation is why OOP scales: each object is responsible for its own correctness, so you reason about one class at a time (Domain 3's "each process its own memory", Domain 4's sealed functions, one level up). This is the deepest reason Java forces structure.</p>
<p>Doing it well takes more than <code>private</code>. Validate in the constructor so an invalid object can never exist (<code>Objects.requireNonNull(owner, "owner")</code>). Make fields <code>final</code> when they never change after construction. Do not leak mutable internals: a getter that returns the internal <code>List</code> lets any caller edit your history, so return <code>Collections.unmodifiableList(history)</code> (a read-only view) or <code>List.copyOf(history)</code> (a snapshot). Copy mutable arguments on the way in, too, or the caller keeps a handle to your state. And not every field needs a setter: methods named after behavior (<code>withdraw</code>, <code>close</code>) keep the rules inside the class, which is the "tell, don't ask" principle.</p>
<h4>Immutability and records</h4>
<p>An <strong>immutable</strong> object cannot change after construction: final class, private final fields, no setters, defensive copies. String, Integer, LocalDate and BigDecimal are all immutable. The payoffs are large: an immutable object can be shared between threads with no locking (Module 8), used safely as a HashMap key (Module 5), cached and reused, and reasoned about without asking "who else might have changed it?". Operations return new objects instead (<code>money.plus(other)</code>).</p>
<p>A <strong>record</strong> (Java 16, JEP 395) is the language's built-in immutable data carrier: <code>record Money(long cents) {}</code> declares a final class with a private final field, a canonical constructor, an accessor <code>cents()</code> (not <code>getCents()</code>), and value-based <code>equals</code>, <code>hashCode</code> and <code>toString</code>. A <em>compact constructor</em> — <code>Money { if (cents &lt; 0) throw ...; }</code> — validates the parameters before the fields are assigned automatically; you may reassign the parameters there but not the fields. Records can have methods, static factories and implement interfaces, but cannot extend a class (they extend <code>java.lang.Record</code>) or declare extra instance fields. Their immutability is shallow: a record holding a <code>List</code> is only as immutable as that list, so copy with <code>List.copyOf</code> in the compact constructor.</p>
<h4>Instance vs static</h4>
<p>Members marked <strong>static</strong> belong to the <em>class</em>, not any instance: one shared copy. A static field is shared by all objects (a counter of how many were created); a static method is called on the class (Math.sqrt(x)), not an object, and cannot touch instance fields because there is no instance. Instance members (no static) belong to each object. main is static because it runs before any object exists. Getting this distinction right is a common early hurdle and a frequent interview question; the compiler's version of it is "non-static variable cannot be referenced from a static context". Two good uses of static: constants (<code>static final double SPLICE_MAX_DB = 0.15;</code>) and static factory methods (<code>List.of</code>, <code>Money.ofDollars(12)</code>), which can have descriptive names and return cached instances. A mutable static field, by contrast, is global state — shared by every thread and every test — so treat one as a smell.</p>
<p>Classes can nest. A <em>static nested class</em> is just a class scoped inside another (the worked example's <code>Bank.Account</code>). An <em>inner class</em> (no <code>static</code>) carries a hidden reference to its enclosing instance, which costs 4 bytes and can keep a large outer object alive (a classic leak, Module 6). Default to static nested. An <strong>enum</strong> is a class with a fixed set of instances (<code>enum Wavelength { NM_1310, NM_1550 }</code>), type-safe where int constants are not, and it may carry fields and methods.</p>
<h4>Access modifiers</h4>
<p>Four levels control visibility: <strong>private</strong> (this class only), default/package-private (same package), <strong>protected</strong> (package plus subclasses, Module 4), and <strong>public</strong> (everyone). Default to private and open up only as needed, the principle of least exposure, which keeps your classes' internals free to change without breaking other code.</p>
<table><tr><th>Modifier</th><th>Same class</th><th>Same package</th><th>Subclass elsewhere</th><th>Everyone</th></tr>
<tr><td>private</td><td>yes</td><td>no</td><td>no</td><td>no</td></tr>
<tr><td>(none) package-private</td><td>yes</td><td>yes</td><td>no</td><td>no</td></tr>
<tr><td>protected</td><td>yes</td><td>yes</td><td>yes (through inheritance)</td><td>no</td></tr>
<tr><td>public</td><td>yes</td><td>yes</td><td>yes</td><td>yes (and, with modules, only if the package is exported — Module 7)</td></tr></table>
<p><em>Exam mapping.</em> 1Z0-831's largest objective group, "Applying Object-Oriented Principles in Java Programs", starts here: declaring and instantiating objects and their lifecycle, initialization of fields and initializer blocks, records, flexible constructor bodies, nested classes, encapsulation and immutability, and <code>var</code> and variable scope. Expect code that asks what prints when a static initializer, an instance initializer and two constructors all run, and records whose compact constructor tries to assign a field (it does not compile).</p>`,
example:`<p><strong>An account that cannot be corrupted (OpenJDK 21.0.12).</strong> <code>Bank.java</code> is complete: a <code>Money</code> record that rejects negative values, and an <code>Account</code> that validates every change and never leaks its history:</p>
<pre>import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

public class Bank {
    /** Immutable value: a record gives constructor, accessors, equals, hashCode, toString. */
    record Money(long cents) {
        Money {                                   // compact constructor: validate once
            if (cents &lt; 0) throw new IllegalArgumentException("negative money: " + cents);
        }
        Money plus(Money o)  { return new Money(Math.addExact(cents, o.cents)); }
        Money minus(Money o) { return new Money(cents - o.cents); }
        boolean lessThan(Money o) { return cents &lt; o.cents; }
        @Override public String toString() { return String.format("$%d.%02d", cents / 100, cents % 100); }
    }

    static final class Account {
        private static int opened = 0;            // one copy, shared by the class
        private final String owner;               // set once, never reassigned
        private Money balance;
        private final List&lt;String&gt; history = new ArrayList&lt;&gt;();

        Account(String owner, Money opening) {
            this.owner = Objects.requireNonNull(owner, "owner");
            this.balance = opening;
            opened++;
            history.add("open " + opening);
        }
        void deposit(Money m)  { balance = balance.plus(m); history.add("dep " + m); }
        void withdraw(Money m) {
            if (balance.lessThan(m))
                throw new IllegalStateException(owner + ": insufficient funds for " + m + " (have " + balance + ")");
            balance = balance.minus(m);
            history.add("wd " + m);
        }
        Money balance() { return balance; }
        List&lt;String&gt; history() { return Collections.unmodifiableList(history); }  // no leaking the internal list
        static int opened() { return opened; }
    }

    public static void main(String[] args) {
        Account sam = new Account("Sam", new Money(10_000));
        Account ana = new Account("Ana", new Money(2_550));
        sam.deposit(new Money(1_999));
        try {
            ana.withdraw(new Money(5_000));
        } catch (IllegalStateException e) {
            System.out.println("refused: " + e.getMessage());
        }
        System.out.println("Sam " + sam.balance() + ", Ana " + ana.balance() + ", opened " + Account.opened());
        System.out.println("history " + sam.history());
        try {
            sam.history().add("forged");
        } catch (UnsupportedOperationException e) {
            System.out.println("cannot edit history from outside: " + e.getClass().getSimpleName());
        }
        Money a = new Money(500), b = new Money(500);
        System.out.println("records equal by value: " + a.equals(b) + ", same object: " + (a == b));
        try {
            new Money(-1);
        } catch (IllegalArgumentException e) {
            System.out.println("invariant held: " + e.getMessage());
        }
    }
}</pre>
<p><code>javac Bank.java &amp;&amp; java Bank</code> printed:</p>
<pre>refused: Ana: insufficient funds for $50.00 (have $25.50)
Sam $119.99, Ana $25.50, opened 2
history [open $100.00, dep $19.99]
cannot edit history from outside: UnsupportedOperationException
records equal by value: true, same object: false
invariant held: negative money: -1</pre>
<p>Every invariant held: the overdraft was refused inside <code>withdraw</code>, the static counter saw both accounts, the outside world could read the history but not forge it, two Money records with the same cents are equal without being the same object, and a negative amount could not even be constructed. <code>javap -p 'Bank$Money'</code> shows what the one-line record declaration generated:</p>
<pre>Compiled from "Bank.java"
final class Bank$Money extends java.lang.Record {
  private final long cents;
  Bank$Money(long);
  Bank$Money plus(Bank$Money);
  Bank$Money minus(Bank$Money);
  boolean lessThan(Bank$Money);
  public java.lang.String toString();
  public final int hashCode();
  public final boolean equals(java.lang.Object);
  public long cents();
}</pre>
<p>A final class extending <code>java.lang.Record</code>, a private final field, the accessor <code>cents()</code>, and final <code>equals</code>, <code>hashCode</code> and <code>toString</code> — about 40 lines of hand-written boilerplate you did not have to write or test. Size check: each Money is 12 + 8 = 20 bytes, padded to 24.</p>`,
misconceptions:["\"Getters/setters are pointless boilerplate.\" They let the class validate and change its internals later without breaking callers; public fields lock you in and remove control.","\"static means constant.\" static means class-level (one shared copy), not unchangeable; final means unchangeable.","\"this is optional noise.\" this disambiguates fields from same-named parameters and makes the current object explicit.","\"A private List field is safe.\" If a getter returns the list itself, callers can modify it; return an unmodifiable view or a copy, and copy mutable constructor arguments.","\"Records are just shorter classes.\" They are deliberately restricted: final, no extra instance fields, no extending another class, and value-based equality — use them for data, not for objects with identity or mutable state."],
problems:[
{q:"Write a class Dog with a private name field, a constructor, and a getName() getter.", a:"public class Dog {\\n  private String name;\\n  public Dog(String name) { this.name = name; }\\n  public String getName() { return this.name; }\\n}"},
{q:"How do you create a Dog object named 'Rex' and read its name?", a:"Dog d = new Dog(\"Rex\"); String n = d.getName();"},
{q:"Why make a field private and expose a method instead of a public field?", a:"Encapsulation: the class controls and validates access, protecting its invariants and freeing it to change internals without breaking callers."},
{q:"What's the difference between a static method and an instance method?", a:"A static method belongs to the class (called as Class.method(), no object, can't use instance fields); an instance method belongs to an object and can use its fields."},
{q:"What does the keyword this refer to?", a:"The current object the method/constructor is operating on."},
{q:"A splice record holds long id, int fiber, double lossDb and a String cable reference. Estimate its size on 64-bit HotSpot with compressed oops, then the heap for 5 million of them (ignore the Strings), with and without compact object headers.", a:"Header 12 + 8 + 4 + 8 + 4 = 36 → padded to 40 bytes; 5,000,000 × 40 = 200 MB. With an 8-byte compact header: 8 + 24 = 32 bytes (already a multiple of 8) → 160 MB, saving 40 MB."},
{q:"class A { A() { init(); } void init() {} } class B extends A { int x = 7; void init() { System.out.println(x); } } — what does new B() print, and why?", a:"0. A's constructor runs before B's field initializers, and it calls the overridden init(), which reads B.x while it still holds its zeroed default. Never call overridable methods from a constructor."},
{q:"Design an immutable Route value with a name and a list of splice ids, so neither the caller nor any later reader can change it.", a:"record Route(String name, List&lt;Long&gt; spliceIds) { Route { Objects.requireNonNull(name); spliceIds = List.copyOf(spliceIds); } } — List.copyOf makes an unmodifiable snapshot (and rejects nulls), so the caller's list and the accessor's result cannot alter the record."},
{q:"A colleague adds public void setBalance(long cents) to Account 'for the import job'. What invariant does that break, and what would you offer instead?", a:"It bypasses every rule in deposit/withdraw (no negative balances, history entries), so any caller can now create an inconsistent account. Offer a purpose-built method (e.g., a static factory Account.imported(owner, opening, history) that validates) or keep the import inside the class/package."}
],
checks:[{q:"Class vs object?",a:"A class is the blueprint; an object is an instance made with new."},{q:"What does encapsulation do?",a:"Hides internal data (private) behind a controlled public interface so the object guards its own correctness."},{q:"static member belongs to?",a:"The class itself (one shared copy), not an instance."},{q:"What does a record generate for you?",a:"A final class with private final fields, a canonical constructor, accessors, equals, hashCode and toString."},{q:"Header size of an object on 64-bit HotSpot (compressed class pointers)?",a:"12 bytes (8 mark word + 4 class pointer); 8 with compact object headers."}],
explain:"Explain to ADA, using the Account example, how encapsulation turns 'a bug could be anywhere' into 'the bug is in this one class' — and then why returning the internal history list from a getter quietly undoes that guarantee."},

{id:"p6m4", title:"Inheritance, Interfaces, Polymorphism, Sealed Types and Pattern Matching", minutes:60,
outcomes:["Use inheritance (extends), override methods correctly, and explain how dynamic dispatch finds the method at run time.","Define and implement interfaces with default, static and private methods, and choose between an interface and an abstract class.","Prefer composition over inheritance and recognize the fragile-base-class problem.","Model closed hierarchies with sealed types and records, and use pattern matching for instanceof and switch with exhaustiveness checking.","Explain polymorphism and implement the Object methods equals/hashCode/toString to their contracts."],
body:`<p>The question this module answers: how do you write one piece of code that works for a whole family of types — including types that do not exist yet — without it collapsing into a tangle of type checks? The pillars of OOP after encapsulation are inheritance, polymorphism and abstraction. They let you model relationships between types and write code that works across a family of them. Java expresses these more formally than most languages, which makes it an ideal place to learn them properly — and modern Java (17–25) adds sealed types and pattern matching, which change how good Java is written.</p>
<h4>Inheritance</h4>
<p><strong>Inheritance</strong> lets a class build on another. A subclass <strong>extends</strong> a superclass, inheriting its fields and methods and adding or changing its own. A SavingsAccount extends Account, getting owner, balance and deposit for free, and adding interest. The subclass can <strong>override</strong> a superclass method to change its behavior (marked @Override, which tells the compiler to check you actually matched a real method, catching typos). super calls the parent's version. Inheritance models an "is-a" relationship (a SavingsAccount is an Account). Use it sparingly: deep inheritance trees become rigid, and modern advice is to prefer composition (holding an object) over inheritance when the relationship is really "has-a".</p>
<p>The override rules are precise: same name and parameter types; the return type may be a subtype (covariant return); visibility may widen but never narrow ("attempting to assign weaker access privileges"); and the override may not declare broader checked exceptions. Static methods, private methods and fields are not overridden — a static method with the same signature merely hides the parent's, and fields are resolved by the static type of the reference. A class can extend only one class; <code>final</code> on a class or method forbids extension or overriding.</p>
<h4>Interfaces</h4>
<p>An <strong>interface</strong> is a pure contract: a list of method signatures a class promises to provide, with no implementation (modern Java allows some default methods, but the idea is the contract). A class <strong>implements</strong> an interface and must supply those methods. Example: a Comparable interface declares compareTo; any class that implements it can be sorted. The power: code can accept "anything that implements Comparable" without knowing the concrete type. A class can implement many interfaces (unlike single inheritance), which is how Java gets flexibility without the complexity of multiple inheritance. Interfaces are how you program to a capability, not a concrete class, the key to flexible, testable design.</p>
<p>Since Java 8 an interface may contain <em>default</em> methods (an implementation that implementers inherit, which is how <code>List</code> gained <code>sort</code> and <code>forEach</code> without breaking every existing list class) and <em>static</em> methods; since Java 9, <em>private</em> helper methods. Interfaces still hold no instance state — their fields are implicitly <code>public static final</code> constants. If a class inherits the same default method from two interfaces, the compiler forces it to override and choose, for example with <code>Swimmer.super.move()</code>; and a method inherited from a superclass always beats an interface default ("class wins").</p>
<h4>Abstract classes</h4>
<p>An <strong>abstract class</strong> sits between the two: it can have real fields and methods like a normal class, but also abstract methods (no body) that subclasses must implement, and you cannot instantiate it directly. Use an abstract class when subclasses share real code and state (a base Shape with a stored color and an abstract area() each shape defines); use an interface when you are defining a capability many unrelated classes can offer (Comparable, Runnable). Rule of thumb: interface for "can do", abstract class for "is a kind of, with shared guts".</p>
<table><tr><th></th><th>Interface</th><th>Abstract class</th></tr>
<tr><td>Instance fields (state)</td><td>No (constants only)</td><td>Yes</td></tr>
<tr><td>Constructors</td><td>No</td><td>Yes (run by subclasses via super)</td></tr>
<tr><td>How many per class</td><td>Implement many</td><td>Extend one</td></tr>
<tr><td>Method bodies</td><td>default, static, private</td><td>Any, plus abstract ones</td></tr>
<tr><td>Best for</td><td>A capability across unrelated types; APIs you will evolve</td><td>A family sharing code and invariants; template methods</td></tr></table>
<h4>Polymorphism</h4>
<p><strong>Polymorphism</strong> ("many forms") is the payoff: a variable of a supertype can hold any subtype, and calling a method runs the right version for the actual object. Account acc = new SavingsAccount(...); acc.deposit(...) runs, and if SavingsAccount overrode a method, the override runs, even though the variable's type is Account. So you can write one method that takes an Account (or a List of them) and it works for every subtype, each behaving correctly. This is how a graphics program draws a list of Shapes without knowing which are circles or squares: it calls shape.area() and the right version runs. Polymorphism is what makes OOP code extensible: add a new subtype and existing code handles it.</p>
<p>The mechanism is <strong>dynamic dispatch</strong>. The compiler checks the call against the <em>static</em> type and emits <code>invokevirtual</code> (or <code>invokeinterface</code>); at run time the JVM follows the object's header to its class and looks the method up in that class's virtual method table, an array of code pointers in which an override occupies the same slot as the method it replaces. The JIT (Module 1) then removes most of the cost: if profiling shows a call site has only ever seen one class (monomorphic) or two (bimorphic), C2 inlines the target behind a cheap type check; only call sites that see many classes (megamorphic) pay for a table lookup every time. Note the asymmetry the exam loves: <em>overriding</em> is chosen at run time by the object's class, but <em>overloading</em> is chosen at compile time by the static types of the arguments (Module 2).</p>
<h4>Composition over inheritance</h4>
<p>Inheritance couples a subclass to its parent's implementation, not just its contract. Effective Java's Item 18 makes the point with a set that counts insertions: extend <code>HashSet</code>, override <code>add</code> and <code>addAll</code> to increment a counter, add three elements with <code>addAll</code> — and the count is 6. <code>HashSet.addAll</code> is inherited from <code>AbstractCollection</code>, whose implementation calls <code>add</code> for each element, so each element is counted twice. That self-use is an undocumented implementation detail that could change in any JDK release: the <em>fragile base class</em> problem. The fix is composition: hold a private <code>Set</code> and forward to it (a wrapper or decorator), and the count is 3 regardless of how <code>HashSet</code> is written. Inherit only when the subtype truly is-a supertype and honors its contract — the Liskov substitution principle: any code written against the supertype must still work when handed the subtype. (A mutable Square that extends Rectangle breaks it: setting the width of a "rectangle" unexpectedly changes its height.)</p>
<h4>Sealed types, records and pattern matching</h4>
<p>Open polymorphism is right when anyone may add a subtype. Often the set is closed: a payment is a card, a transfer or cash; a network event is up, down or flapping. A <strong>sealed</strong> interface or class (Java 17, JEP 409) lists its permitted subtypes — <code>sealed interface Shape permits Circle, Rect, Tri</code> — and each must be <code>final</code> (records are), <code>sealed</code> or <code>non-sealed</code>. Combined with records, that gives algebraic data types, and Java 21's <strong>pattern matching</strong> for switch (JEP 441) with record patterns (JEP 440) lets you take them apart safely:</p>
<pre><code>static double area(Shape s) {
    return switch (s) {
        case Circle c -&gt; Math.PI * c.r() * c.r();
        case Rect(double w, double h) when w == h -&gt; w * w;   // record pattern + guard
        case Rect(double w, double h) -&gt; w * h;
        case Tri t -&gt; 0.5 * t.base() * t.height();
    };
}</code></pre>
<p>Three guarantees come with it. The switch is <em>exhaustive</em>: no default is needed, and if someone adds a fifth permitted subtype every such switch stops compiling until it handles the new case — the compiler finds every place you must change, instead of a runtime "unknown type" error. Order is checked: a guarded case placed after the unguarded case for the same type is "dominated" and rejected. And the binding variables (<code>c</code>, <code>w</code>, <code>h</code>) exist only where the match succeeded, so there is no unchecked cast. The <code>instanceof</code> pattern (<code>if (o instanceof Rect r)</code>, Java 16) does the same for single tests; JDK 22's unnamed pattern <code>_</code> ignores components you do not need. Use virtual methods when behavior belongs to the type and new types are added often; use a sealed hierarchy plus pattern switches when the set of types is fixed and new operations are added often.</p>
<h4>The Object methods</h4>
<p>Every class in Java secretly extends <strong>Object</strong>, inheriting a few methods you should know and often override: <strong>toString()</strong> (how the object prints, override it for readable output), <strong>equals()</strong> (value equality, Module 2's trap, override to define when two objects are "equal"), and <strong>hashCode()</strong> (a number used by hash-based collections, Module 5). The rule: if you override equals, you must override hashCode consistently, or your objects misbehave in a HashMap/HashSet. This is one of the most important practical rules in Java (a whole chapter of Effective Java).</p>
<p>The contract is mathematical: equals must be reflexive, symmetric, transitive and consistent, and <code>x.equals(null)</code> is false; equal objects must have equal hash codes (unequal objects may collide). The failure is concrete: a <code>HashSet</code> first uses <code>hashCode</code> to pick a bucket and only then calls <code>equals</code>, so a class that overrides only <code>equals</code> keeps <code>Object</code>'s identity-based hash code and two "equal" keys land in different buckets — the set answers "not found" for an object equal to one it holds. Write <code>equals(Object o)</code>, not <code>equals(Account a)</code>: the latter is an overload that collections never call, and <code>@Override</code> catches the mistake. Build the hash from the same fields equals compares (<code>Objects.hash(a, b)</code>), and never use mutable fields in either if the object will be a key. Records generate a correct pair for free.</p>
<p><em>Exam mapping.</em> On 1Z0-831 this is the rest of "Applying Object-Oriented Principles": inheritance, abstract and sealed types, polymorphism and overriding rules, interfaces with default, static and private methods, and enums; pattern matching for <code>switch</code> is examined through the flow-control objective. (Oracle dropped the separate 1Z0-830 objective on reference casting and <code>instanceof</code>; expect patterns inside switch questions instead.) Typical items: which overrides compile, which default method wins, whether a switch is exhaustive, and which case label is dominated.</p>`,
example:`<p><strong>Sealed shapes, a fragile base class and a broken key (OpenJDK 21.0.12).</strong> <code>Shapes.java</code>:</p>
<pre>import java.util.*;

public class Shapes {
    sealed interface Shape permits Circle, Rect, Tri {}
    record Circle(double r) implements Shape {}
    record Rect(double w, double h) implements Shape {}
    record Tri(double base, double height) implements Shape {}

    // Exhaustive switch: no default needed, and adding a fourth Shape breaks compilation here.
    static double area(Shape s) {
        return switch (s) {
            case Circle c -&gt; Math.PI * c.r() * c.r();
            case Rect(double w, double h) when w == h -&gt; w * w;      // record pattern + guard
            case Rect(double w, double h) -&gt; w * h;
            case Tri t -&gt; 0.5 * t.base() * t.height();
        };
    }

    // Inheritance done wrong: Effective Java Item 18.
    static class CountingSet&lt;E&gt; extends HashSet&lt;E&gt; {
        int added = 0;
        @Override public boolean add(E e) { added++; return super.add(e); }
        @Override public boolean addAll(Collection&lt;? extends E&gt; c) { added += c.size(); return super.addAll(c); }
    }
    // Composition: wrap, do not extend.
    static class CountingSet2&lt;E&gt; {
        private final Set&lt;E&gt; inner = new HashSet&lt;&gt;();
        int added = 0;
        boolean add(E e) { added++; return inner.add(e); }
        boolean addAll(Collection&lt;? extends E&gt; c) { added += c.size(); return inner.addAll(c); }
    }

    static final class BadKey {                 // equals without hashCode
        final String id;
        BadKey(String id) { this.id = id; }
        @Override public boolean equals(Object o) { return o instanceof BadKey k &amp;&amp; k.id.equals(id); }
    }

    public static void main(String[] args) {
        List&lt;Shape&gt; shapes = List.of(new Circle(1), new Rect(2, 3), new Rect(4, 4), new Tri(6, 2));
        double total = 0;
        for (Shape s : shapes) {
            System.out.printf("%-28s area %7.3f%n", s, area(s));
            total += area(s);
        }
        System.out.printf("total area %.3f%n", total);

        CountingSet&lt;String&gt; bad = new CountingSet&lt;&gt;();
        bad.addAll(List.of("a", "b", "c"));
        CountingSet2&lt;String&gt; good = new CountingSet2&lt;&gt;();
        good.addAll(List.of("a", "b", "c"));
        System.out.println("extends HashSet counted " + bad.added + ", composition counted " + good.added);

        Set&lt;BadKey&gt; keys = new HashSet&lt;&gt;();
        keys.add(new BadKey("splice-17"));
        System.out.println("equal objects? " + new BadKey("splice-17").equals(new BadKey("splice-17"))
                + ", set finds it? " + keys.contains(new BadKey("splice-17")));
    }
}</pre>
<p><code>javac Shapes.java &amp;&amp; java Shapes</code> printed:</p>
<pre>Circle[r=1.0]                area   3.142
Rect[w=2.0, h=3.0]           area   6.000
Rect[w=4.0, h=4.0]           area  16.000
Tri[base=6.0, height=2.0]    area   6.000
total area 31.142
extends HashSet counted 6, composition counted 3
equal objects? true, set finds it? false</pre>
<p>The loop never tests a type, yet each shape computed its own area (π, 6, 16 through the square guard, 6): total 31.142. The counting set that <em>extends</em> HashSet reported 6 for three elements because the inherited <code>addAll</code> called the overridden <code>add</code>; the composed version reported 3. The key class with <code>equals</code> but no <code>hashCode</code> produced two equal objects that the set could not find. Now add a fourth shape — <code>record Hex(double side) implements Shape</code> and <code>Hex</code> in the permits list — and recompile:</p>
<pre>$ javac Shapes.java        # after adding: record Hex(double side) implements Shape, and Hex to permits
Shapes.java:12: error: the switch expression does not cover all possible input values
        return switch (s) {
               ^
1 error</pre>
<p>That error is the feature: the compiler has located the one method in the codebase that must learn about hexagons, before any customer sees a wrong area.</p>`,
misconceptions:["\"Inheritance is the main tool of OOP.\" Overusing it creates brittle trees; prefer composition and interfaces; use inheritance for genuine is-a relationships.","\"Interface and abstract class are interchangeable.\" Interface = a capability/contract (implement many); abstract class = shared code+state for a family (extend one).","\"Overriding equals is enough.\" You must override hashCode to match, or hash-based collections break.","\"Overloaded methods are chosen by the object's run-time class.\" Overloads are resolved at compile time from the static argument types; only overrides are dispatched at run time.","\"A switch over a sealed type needs a default just in case.\" With a sealed type the compiler proves exhaustiveness; adding a default hides the compile error you want when a new subtype appears."],
problems:[
{q:"What's the difference between extends and implements?", a:"extends inherits from one superclass (is-a, with shared code); implements fulfills an interface's contract (a capability, can do several)."},
{q:"When would you use an interface vs an abstract class?", a:"Interface for a capability many unrelated classes can offer (Comparable); abstract class when subclasses share real fields/code plus some methods each must define."},
{q:"Explain polymorphism using a List of a supertype.", a:"A List&lt;Shape&gt; can hold Circles and Squares; calling shape.area() runs each object's own version, so one loop handles all subtypes and new ones work automatically."},
{q:"If you override equals(), what else must you override and why?", a:"hashCode(), consistently — hash-based collections (HashMap/HashSet) use it to find objects, so equal objects must share a hash code."},
{q:"What does @Override do for you?", a:"Tells the compiler to verify you're actually overriding a real superclass/interface method, catching signature typos."},
{q:"class P { static String s() { return \"P\"; } String i() { return \"P\"; } } class C extends P { static String s() { return \"C\"; } String i() { return \"C\"; } } — with P p = new C(); what do p.s() and p.i() return?", a:"p.s() returns \"P\": static methods are hidden, not overridden, and are bound by the static type. p.i() returns \"C\": instance methods are dynamically dispatched on the object's class."},
{q:"A sealed interface Event permits Up, Down, Flap (all records). A colleague's switch over Event has a default branch that logs 'unknown'. Why is that worse than no default, and what happens when Maintenance is added to the permits list?", a:"With no default the switch is checked for exhaustiveness, so adding Maintenance makes every such switch fail to compile until it is handled. With the default, the code compiles and Maintenance events silently fall into 'unknown' at run time. Remove the default."},
{q:"Your class InstrumentedList extends ArrayList and overrides add and addAll to count insertions. A JDK update changes the counts your tests expect. Diagnose and redesign.", a:"Fragile base class: your counts depended on whether ArrayList.addAll internally calls add, an implementation detail that changed. Redesign with composition: implement List by forwarding to a private ArrayList (or extend a forwarding wrapper), counting in your own add and addAll only."},
{q:"An Employee class defines public boolean equals(Employee other). employees.contains(new Employee(42)) returns false although an equal employee is in the list. Why, and what is the fix?", a:"equals(Employee) is an overload, not an override of equals(Object); ArrayList.contains calls equals(Object), which is still Object's identity check. Declare public boolean equals(Object o) with @Override (pattern: o instanceof Employee e &amp;&amp; e.id == id) and a matching hashCode."}
],
checks:[{q:"extends vs implements?",a:"extends a superclass (one, is-a); implements interfaces (many, capabilities)."},{q:"What is polymorphism?",a:"A supertype variable runs the actual subtype's method version; one code path serves many types."},{q:"equals + what?",a:"hashCode (override both consistently)."},{q:"What does sealed add to a class hierarchy?",a:"A fixed permits list, so the compiler can prove a pattern switch exhaustive."},{q:"What is the fragile base class problem?",a:"A subclass breaks because it depends on the superclass's internal self-use; prefer composition."}],
explain:"Explain to ADA why a payroll loop over a List of Employee needs no changes when a new employee subtype is added, naming polymorphism and overriding — then explain when you would instead make the hierarchy sealed and use a pattern switch, and what the compiler gives you in return."},

{id:"p6m5", title:"Generics and the Collections Framework", minutes:60,
outcomes:["Use generics for type-safe containers and explain type erasure and its consequences.","Write generic methods with bounds and wildcards (PECS).","Use List, Map, Set, Deque and their main implementations, including sequenced collections and immutable collections.","Explain ArrayList growth and HashMap hashing, load factor, resizing and treeification with numbers.","Choose the right collection for a task from its Big-O and memory behavior (ties to Domain 4 and Domain 13)."],
body:`<p>The question this module answers: when your program holds a hundred thousand splice records, which container makes lookups instant and which makes them take seconds, and how does the compiler stop the wrong type getting in? Real programs manage groups of objects, and Java's <strong>Collections framework</strong> is its answer, made type-safe by <strong>generics</strong>. If Domain 4 Module 4 taught you lists, dicts and sets, this is the same ideas with Java's types bolted on, and the types are the point. Domain 13 proves the Big-O bounds; this module shows you the implementations that realize them.</p>
<h4>Generics</h4>
<p><strong>Generics</strong> let a class or method work with a type you specify, checked by the compiler. A List&lt;String&gt; is "a list of Strings": the compiler guarantees only Strings go in, and what comes out is a String with no casting. Before generics (Java 5, 2004), collections held raw Object and you cast everything, risking runtime errors; generics moved those errors to compile time (this domain's theme). You will mostly <em>use</em> generics (List&lt;Account&gt;, Map&lt;String, Integer&gt;) and occasionally write them (a method with a type parameter &lt;T&gt;). The angle brackets everywhere in Java code are generics declaring their element types; the diamond <code>new ArrayList&lt;&gt;()</code> lets the compiler infer them.</p>
<h4>How generics really work: type erasure</h4>
<p>Java implements generics by <strong>type erasure</strong>. The compiler checks every use against the type parameters, then erases them: <code>List&lt;String&gt;</code> becomes plain <code>List</code> in the bytecode, <code>T</code> becomes <code>Object</code> (or its bound), and javac inserts a cast where a value comes out (<code>(String) list.get(0)</code>). The design kept Java 5 code binary-compatible with every pre-generics library, and it has consequences you must know. At run time <code>new ArrayList&lt;String&gt;().getClass() == new ArrayList&lt;Integer&gt;().getClass()</code> is true — there is one class. You cannot write <code>new T()</code>, <code>new T[10]</code> or <code>x instanceof List&lt;String&gt;</code>, because T no longer exists when the code runs. Two methods <code>void f(List&lt;String&gt;)</code> and <code>void f(List&lt;Integer&gt;)</code> clash ("have the same erasure"). Primitives cannot be type arguments, so <code>List&lt;int&gt;</code> is illegal and every element is a boxed Integer (Module 2's 16 bytes each). And a <em>raw type</em> — <code>List</code> with no brackets — switches the checks off: insert an Integer through a raw reference into a <code>List&lt;String&gt;</code> and the only warning is javac's "unchecked call"; the <code>ClassCastException</code> arrives later, at the read, far from the bug (heap pollution). Treat every unchecked warning as an error.</p>
<h4>Bounds, wildcards and PECS</h4>
<p>A type parameter can be bounded: <code>static &lt;T extends Comparable&lt;T&gt;&gt; T max(List&lt;T&gt; xs)</code> accepts any list whose elements can compare themselves. Generic types are <em>invariant</em>: a <code>List&lt;Integer&gt;</code> is not a <code>List&lt;Number&gt;</code>, because if it were you could add a Double to a list of Integers. (Arrays chose the opposite, covariance, and pay with a run-time <code>ArrayStoreException</code>.) Wildcards restore flexibility safely. <code>List&lt;? extends Number&gt;</code> means "a list of some subtype of Number": you may read Numbers out but not add. <code>List&lt;? super Integer&gt;</code> means "a list of Integer or a supertype": you may add Integers but read only Objects. Effective Java's mnemonic is <strong>PECS</strong> — producer <code>extends</code>, consumer <code>super</code> — and the JDK follows it: <code>Collections.copy(List&lt;? super T&gt; dest, List&lt;? extends T&gt; src)</code>.</p>
<h4>The three interfaces</h4>
<ul>
<li><strong>List</strong>: an ordered sequence, duplicates allowed, indexed, Domain 4's list. Main implementation <strong>ArrayList</strong> (backed by an array, fast index access and append). Example: List&lt;String&gt; names = new ArrayList&lt;&gt;();</li>
<li><strong>Map</strong>: key-to-value pairs, Domain 4's dict. Main implementation <strong>HashMap</strong> (O(1) lookup by key, Domain 1's hashing, Module 4's hashCode). Example: Map&lt;String, Integer&gt; ages = new HashMap&lt;&gt;(); ages.put("Sam", 30); ages.get("Sam");</li>
<li><strong>Set</strong>: unique elements, no duplicates, Domain 4's set. Main implementation <strong>HashSet</strong> (O(1) membership).</li>
</ul>
<p>Notice the pattern: you declare the variable as the interface (List, Map, Set) and instantiate a concrete implementation (ArrayList, HashMap, HashSet). Programming to the interface (Module 4) means you can swap implementations later without changing the rest of your code, a direct payoff of this module's and Module 4's lessons. Around them sit <code>Queue</code> and <code>Deque</code> (double-ended queue; <strong>ArrayDeque</strong> is the right stack and the right queue — the legacy <code>Stack</code> class is synchronized and obsolete). Java 21 added <em>sequenced collections</em> (JEP 431): <code>List</code>, <code>Deque</code>, <code>LinkedHashSet</code> and the sorted sets share <code>getFirst()</code>, <code>getLast()</code>, <code>addFirst</code>, <code>removeLast</code> and <code>reversed()</code>, and <code>LinkedHashMap</code> and the sorted maps gain <code>firstEntry()</code>, <code>lastEntry()</code>, <code>putFirst</code> and <code>reversed()</code>.</p>
<h4>Using them</h4>
<p>Add with add/put, read with get, check with contains/containsKey, size with size(). Iterate with the enhanced for: for (String name : names) or for (Map.Entry&lt;String, Integer&gt; e : ages.entrySet()). The collection you choose has the Big-O consequences from Domain 4: ArrayList index is O(1) but searching it is O(n); HashMap/HashSet lookup is O(1). Reach for a Map whenever you look things up by a key, and a Set for fast membership or dedup, exactly as in Domain 4, now with types. Learn the Map conveniences that replace whole if/else blocks: <code>getOrDefault</code>, <code>putIfAbsent</code>, <code>computeIfAbsent(k, x -&gt; new ArrayList&lt;&gt;()).add(v)</code> for grouping, and <code>merge(word, 1, Integer::sum)</code> for counting.</p>
<table><tr><th>Implementation</th><th>get / lookup</th><th>add</th><th>remove</th><th>Notes</th></tr>
<tr><td>ArrayList</td><td>O(1) by index; O(n) contains</td><td>amortized O(1) at end; O(n) in the middle</td><td>O(n) (shifts)</td><td>Contiguous, cache-friendly; the default list</td></tr>
<tr><td>LinkedList</td><td>O(n) by index</td><td>O(1) at ends</td><td>O(1) at ends or via iterator</td><td>24-byte node per element, pointer chasing; rarely the right choice</td></tr>
<tr><td>ArrayDeque</td><td>O(1) at ends</td><td>amortized O(1) at ends</td><td>O(1) at ends</td><td>Stack and queue; no nulls</td></tr>
<tr><td>HashMap / HashSet</td><td>O(1) average</td><td>O(1) average</td><td>O(1) average</td><td>No order; bins become trees, so worst case O(log n)</td></tr>
<tr><td>LinkedHashMap</td><td>O(1)</td><td>O(1)</td><td>O(1)</td><td>Insertion or access order; LRU cache via removeEldestEntry</td></tr>
<tr><td>TreeMap / TreeSet</td><td>O(log n)</td><td>O(log n)</td><td>O(log n)</td><td>Red-black tree; sorted; floor, ceiling, range views</td></tr>
<tr><td>PriorityQueue</td><td>O(1) peek</td><td>O(log n)</td><td>O(log n) poll</td><td>Binary heap; "next most urgent" (Domain 13)</td></tr>
<tr><td>EnumMap / EnumSet</td><td>O(1)</td><td>O(1)</td><td>O(1)</td><td>Array / bit vector keyed by enum ordinal; fastest of all</td></tr></table>
<h4>Inside ArrayList</h4>
<p>An ArrayList is an <code>Object[]</code> plus a size. A new list allocates its 10-slot array on the first add; when the array is full it allocates one 50% larger (new capacity = old + old/2) and copies. That is why appends are <em>amortized</em> O(1): growing from 10 to a million slots takes about 29 resizes, and the total elements copied over the whole run is under three per element. If you know the final size, <code>new ArrayList&lt;&gt;(n)</code> skips the copying. Inserting at index 0 shifts every element (O(n)), so a list used as a queue is a bug waiting for load — use ArrayDeque.</p>
<h4>Inside HashMap</h4>
<p>A <strong>HashMap</strong> is an array of buckets whose length is a power of two (16 by default). To place a key it calls <code>hashCode()</code>, mixes the high bits into the low ones (<code>h ^ (h &gt;&gt;&gt; 16)</code>), and takes the low bits as the index (<code>hash &amp; (length - 1)</code>, a cheap modulo). Colliding keys share a bucket in a linked chain; when one chain reaches 8 entries and the table has at least 64 buckets, that bin is converted into a red-black tree, so even a flood of colliding keys costs O(log n), not O(n). The <strong>load factor</strong> (0.75) sets when the table doubles: 16 buckets hold 12 entries, then 32 hold 24, and so on, each resize rehashing every entry. Worked arithmetic: one million entries need a table of at least 1,000,000 / 0.75 = 1,333,334 buckets, the next power of two is 2^21 = 2,097,152, and growing from 2^4 to 2^21 takes 17 resizes. <code>HashMap.newHashMap(1_000_000)</code> (Java 19) presizes the table and skips them. Each entry costs a 32-byte node plus the key and value objects, so a million-entry <code>HashMap&lt;String, Integer&gt;</code> easily reaches 100 MB; that is why Domain 18's databases and Domain 36's data tools exist. Finally, never mutate a field that participates in <code>hashCode</code> while the object is a key: the entry stays in the bucket for its old hash and becomes unreachable.</p>
<h4>Iteration, mutation and immutable collections</h4>
<p>Collection iterators are <em>fail-fast</em>: each collection counts structural modifications, and if the count changes during a for-each loop the next step throws <code>ConcurrentModificationException</code> — even in a single thread. Remove while iterating with <code>list.removeIf(s -&gt; s.lossDb() &gt; 0.3)</code> or an explicit <code>Iterator.remove()</code>. <code>List.of</code>, <code>Set.of</code> and <code>Map.of</code> (Java 9) build truly unmodifiable collections that also reject nulls; <code>List.copyOf</code> snapshots a mutable one; <code>Collections.unmodifiableList</code> is only a read-only <em>view</em> that still shows later changes to the list behind it. Any of them throws <code>UnsupportedOperationException</code> on <code>add</code>.</p>
<h4>Ordering: Comparable and Comparator</h4>
<p>A class that has one natural order implements <code>Comparable&lt;T&gt;</code> (<code>compareTo</code> returns negative, zero or positive); any other order is a <code>Comparator</code>, built fluently: <code>Comparator.comparing(Splice::cable).thenComparingDouble(Splice::lossDb).reversed()</code>. <code>List.sort</code> and <code>Collections.sort</code> use TimSort, a stable O(n log n) merge sort that is close to O(n) on partly sorted input; <code>Arrays.sort</code> on primitives uses dual-pivot quicksort. TreeMap and TreeSet use the comparator for equality too, so a comparator inconsistent with equals silently drops "duplicates".</p>
<h4>Streams and lambdas (a taste)</h4>
<p>Modern Java added <strong>lambdas</strong> (anonymous functions, like arrow functions from Domain 5: n -&gt; n * 2) and <strong>streams</strong>, a pipeline for processing collections declaratively: names.stream().filter(n -&gt; n.length() &gt; 3).map(String::toUpperCase).collect(Collectors.toList()). That is Domain 4's comprehensions and Domain 5's filter/map, in Java. Streams make collection code concise and are heavily used in modern codebases, though the basics above are what you must master first. Module 9 takes them apart: laziness, collectors, primitive streams and gatherers.</p>
<p><em>Exam mapping.</em> 1Z0-831's "Using Arrays and Collections to Store and Retrieve Data" covers arrays, List, Set, Map and Deque, sequenced collections, sorting, Comparable and Comparator; generics and wildcards appear inside those questions. Expect output-prediction items on <code>List.of</code> immutability, <code>Arrays.asList</code> (fixed size but writable), TreeSet ordering, <code>remove(int)</code> versus <code>remove(Object)</code> on a <code>List&lt;Integer&gt;</code>, and which generic assignments compile.</p>`,
example:`<p><strong>Big-O you can feel (OpenJDK 21.0.12, two-core VM).</strong> <code>CollectionsLab.java</code> times the same operations on three collections, counts words, and demonstrates erasure:</p>
<pre>import java.util.*;

public class CollectionsLab {
    static long time(Runnable r) {
        r.run();                                     // one warm-up pass so the JIT has compiled the loop
        long t0 = System.nanoTime();
        r.run();
        return (System.nanoTime() - t0) / 1_000;
    }
    public static void main(String[] args) {
        final int N = 100_000;
        List&lt;Integer&gt; array = new ArrayList&lt;&gt;();
        List&lt;Integer&gt; linked = new LinkedList&lt;&gt;();
        Set&lt;Integer&gt; hash = new HashSet&lt;&gt;();
        for (int i = 0; i &lt; N; i++) { array.add(i); linked.add(i); hash.add(i); }

        long[] sink = new long[1];
        System.out.println("N = " + N);
        System.out.println("ArrayList  get(i) x 100k : " + time(() -&gt; { for (int i = 0; i &lt; N; i++) sink[0] += array.get(i); }) + " us");
        System.out.println("LinkedList get(i) x 100k : " + time(() -&gt; { for (int i = 0; i &lt; N; i++) sink[0] += linked.get(i); }) + " us");
        System.out.println("ArrayList  contains x 1k : " + time(() -&gt; { for (int i = 0; i &lt; 1_000; i++) if (array.contains(N - 1 - i)) sink[0]++; }) + " us");
        System.out.println("HashSet    contains x 1k : " + time(() -&gt; { for (int i = 0; i &lt; 1_000; i++) if (hash.contains(N - 1 - i)) sink[0]++; }) + " us");

        // Word count with merge: one hash lookup per word.
        String text = "the quick fiber the slow fiber the end";
        Map&lt;String, Integer&gt; counts = new TreeMap&lt;&gt;();          // TreeMap: sorted keys, O(log n)
        for (String w : text.split(" ")) counts.merge(w, 1, Integer::sum);
        System.out.println("counts " + counts);

        // Type erasure: one runtime class for every parameterization.
        List&lt;String&gt; ls = new ArrayList&lt;&gt;();
        List&lt;Integer&gt; li = new ArrayList&lt;&gt;();
        System.out.println("same runtime class? " + (ls.getClass() == li.getClass()) + " -&gt; " + ls.getClass().getName());

        // Heap pollution through a raw type: the compiler warns, the crash comes later.
        List raw = ls;
        raw.add(42);
        try {
            String s = ls.get(0);
        } catch (ClassCastException e) {
            System.out.println("raw-type insert blew up at READ time: " + e.getClass().getSimpleName());
        }

        Deque&lt;String&gt; stack = new ArrayDeque&lt;&gt;();
        stack.push("a"); stack.push("b"); stack.push("c");
        System.out.println("ArrayDeque as stack pops " + stack.pop() + stack.pop() + stack.pop());
        System.out.println("sink " + (sink[0] &gt; 0));
    }
}</pre>
<p><code>javac -Xlint:unchecked CollectionsLab.java</code> prints the warning you should never ignore (<code>unchecked call to add(E) as a member of the raw type List</code>), then <code>java CollectionsLab</code> printed:</p>
<pre>N = 100000
ArrayList  get(i) x 100k : 760 us
LinkedList get(i) x 100k : 6702686 us
ArrayList  contains x 1k : 168772 us
HashSet    contains x 1k : 228 us
counts {end=1, fiber=2, quick=1, slow=1, the=3}
same runtime class? true -&gt; java.util.ArrayList
raw-type insert blew up at READ time: ClassCastException
ArrayDeque as stack pops cba
sink true</pre>
<p>Do the arithmetic. ArrayList: 100,000 indexed reads in 760 µs, about 7.6 ns each including unboxing. LinkedList: the same loop took 6.7 seconds, nearly 9,000 times slower, because <code>get(i)</code> walks from the nearer end — on average n/4 = 25,000 node hops, so 100,000 calls make about 2.5 billion pointer chases at roughly 2.7 ns each (a cache miss to main memory, Domain 1). Membership: 1,000 <code>contains</code> calls on the ArrayList scanned about 100 million elements (169 ms); the HashSet answered the same 1,000 questions in 228 µs, about 740 times faster. The TreeMap printed its keys sorted, <code>merge</code> counted each word with one lookup, the two lists share one runtime class (erasure), the raw-type insert failed only when read back, and ArrayDeque popped c, b, a as a stack should.</p>`,
misconceptions:["\"Angle brackets are optional syntax.\" They declare the element type; List&lt;String&gt; is enforced by the compiler, preventing wrong-type insertion.","\"Use ArrayList for everything.\" Use a Map for key lookups and a Set for uniqueness/membership; the Domain 4 Big-O reasons still apply.","\"Declare the variable as the concrete class.\" Declare it as the interface (List/Map/Set) so you can swap implementations freely.","\"Generic type information exists at run time.\" It is erased; List&lt;String&gt; and List&lt;Integer&gt; are the same class, so you cannot test or create T at run time and raw types can smuggle in the wrong type.","\"LinkedList is faster for inserts, so prefer it.\" Only at the ends or through an iterator; indexed access is O(n) and its scattered nodes defeat the CPU cache. ArrayList or ArrayDeque almost always wins."],
problems:[
{q:"Declare a list of Strings and add 'a' to it.", a:"List&lt;String&gt; items = new ArrayList&lt;&gt;(); items.add(\"a\");"},
{q:"Which collection to count occurrences of each word, and what's the lookup cost?", a:"A Map&lt;String, Integer&gt; (HashMap); O(1) lookup by key."},
{q:"Why declare a variable as List rather than ArrayList?", a:"Programming to the interface lets you swap the implementation (e.g. LinkedList) later without changing calling code."},
{q:"What problem did generics solve compared to raw collections?", a:"They moved type errors from runtime (ClassCastException) to compile time by enforcing the element type."},
{q:"Write a stream that keeps names longer than 3 letters and uppercases them.", a:"names.stream().filter(n -> n.length() > 3).map(String::toUpperCase).collect(Collectors.toList())"},
{q:"You will load 600,000 fiber records into a HashMap keyed by circuit id. With the defaults, what final table length results and how many resizes happen? How do you avoid them?", a:"Need ≥ 600,000 / 0.75 = 800,000 buckets → next power of two 2^20 = 1,048,576. From 16 (2^4) to 2^20 is 16 doublings = 16 resizes, each rehashing every entry so far. Avoid with HashMap.newHashMap(600_000) (or new HashMap&lt;&gt;(800_000))."},
{q:"Pick the collection and state the cost: (a) the 10 worst splices seen so far in a stream of millions; (b) circuits ordered by id with 'next id above 5000'; (c) undo history; (d) unique MAC addresses.", a:"(a) a PriorityQueue (min-heap) of size 10: O(log 10) per item; (b) TreeMap with ceilingKey/higherKey: O(log n); (c) ArrayDeque as a stack: O(1) push/pop; (d) HashSet: O(1) average add/contains."},
{q:"Write the signature of a method that copies every element of a list of some Number subtype into a list that can hold Numbers, and explain each wildcard.", a:"static void copyAll(List&lt;? extends Number&gt; src, List&lt;? super Number&gt; dst) — src is a producer you only read Numbers from (extends); dst is a consumer you only add Numbers to (super). PECS."},
{q:"for (String id : ids) if (id.startsWith(\"X\")) ids.remove(id); throws ConcurrentModificationException in a single-threaded program. Explain and fix.", a:"The for-each uses the list's iterator, which is fail-fast: list.remove changes the modification count and the iterator's next() detects it. Use ids.removeIf(id -> id.startsWith(\"X\")) or Iterator.remove()."}
],
checks:[{q:"What does List&lt;String&gt; guarantee?",a:"The compiler ensures the list holds only Strings."},{q:"Map implementation with O(1) lookup?",a:"HashMap."},{q:"Declare variables as the interface or the class?",a:"The interface (List/Map/Set), instantiate the implementation."},{q:"HashMap default capacity and load factor?",a:"16 buckets and 0.75, so it resizes at 12 entries (doubling each time)."},{q:"What is type erasure?",a:"The compiler checks generic types, then erases them to their bounds and inserts casts; no generic type info at run time."}],
explain:"Explain to ADA how generics are Module 2's static-typing idea applied to collections, using List&lt;Integer&gt; rejecting a String as your example — then explain why a raw List reference can still smuggle a String in, and where the crash appears."},

{id:"p6m6", title:"Exceptions, References and the JVM: Memory, Garbage Collection and Error Handling", minutes:60,
outcomes:["Handle errors with try/catch/finally and try-with-resources, distinguish checked vs unchecked exceptions, and design exception handling across layers.","Explain how exceptions unwind the stack and what suppressed exceptions are.","Explain references, null, pass-by-value and NullPointerException, and use Optional where it belongs.","Explain the stack, the heap, metaspace and garbage collection: reachability, the generational hypothesis, G1 and ZGC.","Read a GC log, recognize the signature of a memory leak, and name the tools that find the retaining reference."],
body:`<p>The question this module answers: when something goes wrong — a missing file, a null where an object should be, a heap that keeps growing — what exactly does the JVM do, and how do you read the evidence it leaves? This module covers how Java handles things going wrong (exceptions) and how it manages memory (references and garbage collection), two areas where Java's design choices differ sharply from both Python and the C-level view of Domain 1 and Domain 15.</p>
<h4>Exceptions</h4>
<p>Like Domain 4, Java signals errors by throwing <strong>exceptions</strong>, handled with try/catch:</p>
<pre><code>try {
    int result = divide(a, b);
} catch (ArithmeticException e) {
    System.out.println("Can't divide: " + e.getMessage());
} finally {
    // always runs, for cleanup
}</code></pre>
<p>Java adds a distinction Python lacks: <strong>checked</strong> vs <strong>unchecked</strong> exceptions. <strong>Checked</strong> exceptions (IOException, SQLException, things that can go wrong with the outside world) must be either caught or declared in the method signature with throws, the compiler enforces it, forcing you to acknowledge failure paths. <strong>Unchecked</strong> exceptions (RuntimeException and its kin: NullPointerException, ArrayIndexOutOfBoundsException, IllegalArgumentException, usually programming bugs) need not be declared. The philosophy: checked for recoverable external failures you should plan for, unchecked for bugs you should fix. finally always runs (even on exception), for cleanup; modern Java's try-with-resources auto-closes files and connections.</p>
<table><tr><th>Branch of Throwable</th><th>Examples</th><th>Checked?</th><th>What to do</th></tr>
<tr><td>Error</td><td>OutOfMemoryError, StackOverflowError</td><td>No</td><td>Do not catch in normal code; the JVM is in trouble — fix the cause</td></tr>
<tr><td>RuntimeException</td><td>NullPointerException, IllegalArgumentException, IllegalStateException, ArithmeticException, ClassCastException</td><td>No</td><td>Bugs or violated preconditions: fix, or validate early</td></tr>
<tr><td>Other Exception</td><td>IOException (NoSuchFileException), SQLException, InterruptedException</td><td>Yes</td><td>Recover (retry, fall back, report), or declare and let a higher layer decide</td></tr></table>
<h4>How an exception actually travels</h4>
<p><code>throw</code> compiles to the <code>athrow</code> instruction. Every method's bytecode carries an <em>exception table</em> — rows of "from, to, target, type" — and when an exception is thrown the JVM searches the current method's table for a row whose range covers the failing instruction and whose type matches. If none matches it pops the frame and repeats in the caller: <em>stack unwinding</em>, frame by frame, until a handler is found or the thread's top is reached and the default handler prints the stack trace. Run <code>javap -c</code> on a method with try-with-resources and you will see rows of type <code>java/lang/Throwable</code> the compiler generated for the hidden close logic. The expensive part of an exception is not the throw but building its stack trace when the object is created, which is why exceptions are for exceptional paths, never for ordinary loop control. A stack trace reads top-down from where it was thrown; with chained exceptions, the root cause is the last "Caused by:" block — read that first.</p>
<h4>try-with-resources, suppressed exceptions and finally</h4>
<p>Any object implementing <code>AutoCloseable</code> can be declared in a <strong>try-with-resources</strong> header: <code>try (var in = Files.newBufferedReader(p); var out = Files.newBufferedWriter(q)) { ... }</code>. The compiler generates the closing code for you: resources close automatically in <em>reverse</em> order of opening, whether the body completes or throws. If the body throws and a <code>close()</code> also throws, the close failure is not allowed to replace the real one; it is attached to it as a <em>suppressed</em> exception (<code>e.getSuppressed()</code>). The hand-written <code>finally</code> version gets this wrong: an exception thrown in finally silently replaces the original, and a <code>return</code> inside finally swallows any exception at all. Use multi-catch for identical handling of unrelated types (<code>catch (IOException | SQLException e)</code>), and order catch blocks from specific to general — a catch for a subclass after its superclass does not compile.</p>
<h4>Designing with exceptions</h4>
<p>Four rules cover most code reviews. Fail fast: validate arguments at the boundary (<code>Objects.requireNonNull</code>, <code>IllegalArgumentException</code>) so the stack trace points at the caller's mistake, not ten frames later. Never swallow: an empty <code>catch {}</code> turns a crash you could diagnose into wrong data you cannot. Translate at layer boundaries and keep the cause: a repository catches <code>SQLException</code> and throws <code>new SpliceStoreException("save failed for " + id, e)</code>, so callers see a meaningful type and the log still shows the root cause. Handle once: either log or rethrow, not both, or one failure appears five times in the log. For <code>InterruptedException</code> (Module 8) the rule is special — restore the flag with <code>Thread.currentThread().interrupt()</code> if you cannot propagate it.</p>
<h4>References and null</h4>
<p>From Module 2: objects are accessed through <strong>references</strong>, a variable holds a reference to an object on the heap, not the object itself. A reference that points to nothing is <strong>null</strong>. Call a method on a null reference and you get the infamous <strong>NullPointerException</strong> (NPE), Java's most common runtime error. It happens when you assume an object exists but it was never assigned, or a method returned null. Guarding against null (checking before use, avoiding returning null, using Optional in modern Java) is a daily discipline. Understanding that a variable is a reference, not the object, also explains why passing an object to a method and mutating it changes the caller's object (Domain 4's mutability), while reassigning the parameter does not — Java passes the reference by value.</p>
<p>Since JDK 14 (JEP 358, on by default from JDK 15) the JVM tells you exactly what was null: <code>Cannot invoke "java.lang.Double.doubleValue()" because the return value of "Failures$Splice.lossDb()" is null</code> names the method that returned null and reveals a hidden unboxing. <code>Optional&lt;T&gt;</code> is for <em>return types</em> that may be empty (<code>findById</code>), consumed with <code>map</code>, <code>orElse</code> and <code>orElseThrow</code>; do not use it for fields, parameters or collections (return an empty list instead).</p>
<h4>The stack and the heap</h4>
<p>The JVM organizes memory into two regions (Domain 1's memory, structured): the <strong>stack</strong> holds method call frames, local variables and references, one frame per active call, popped when the method returns (this is the call stack from Domain 1, and deep recursion overflows it, Domain 4). The <strong>heap</strong> holds all objects created with new. A local variable on the stack holds a reference to an object on the heap. When you understand this, references, null, and parameter passing all make sense.</p>
<p>The full map has more regions. Each thread has its own stack, 1 MiB by default on 64-bit Linux (<code>-Xss</code>); on this machine an unbounded recursion died with <code>StackOverflowError</code> after 20,540 frames. The heap is shared by all threads; its maximum defaults to a quarter of the memory the JVM sees (1,496 MiB in this VM; containers are detected, and <code>-XX:MaxRAMPercentage</code> is the knob there). Class metadata lives in <strong>metaspace</strong>, native memory outside the heap; JIT-compiled code lives in the code cache (Module 1). Sizes are predictable: a <code>byte[1024]</code> is a 16-byte header (12 plus a 4-byte length) and 1,024 bytes of data, 1,040 bytes in all.</p>
<h4>Garbage collection</h4>
<p>In C (Domain 1), you must free memory you allocate, and forgetting causes leaks. Java frees you from this with <strong>garbage collection</strong> (GC): the JVM automatically reclaims objects on the heap that are no longer reachable from any reference. When nothing points to an object anymore, it becomes eligible for collection, and the GC reclaims its memory later, invisibly. This eliminates whole classes of bugs (use-after-free, most leaks) and is a big reason Java is productive and safe. You still must avoid the Java version of a leak: unintentionally keeping references (a growing static collection that is never cleared keeps its objects alive forever). GC manages memory; it does not manage your references.</p>
<p>"Reachable" has a precise meaning. The collector starts from the <strong>GC roots</strong> — local variables in every thread's stack frames, static fields of loaded classes, JNI references — and traces every reference from them; whatever it never reaches is garbage, including cycles of objects that point only at each other (which CPython's reference counting in Domain 4 needs a separate cycle detector for). The cost of a tracing collection is proportional to the <em>live</em> objects, not the garbage. That, plus the <strong>generational hypothesis</strong> — most objects die young — is why the heap is split into a young generation (new objects are allocated in <em>eden</em>; survivors are copied between two survivor spaces) and an old generation (objects that survive enough collections, up to 15, are promoted). A young collection copies the few survivors and discards eden wholesale, so a service allocating a gigabyte a second of short-lived request objects can still spend only a few milliseconds per collection.</p>
<table><tr><th>Collector</th><th>Design</th><th>Pauses</th><th>Use</th></tr>
<tr><td>Serial</td><td>One thread, stop-the-world</td><td>Proportional to heap</td><td>Tiny heaps, single-core containers</td></tr>
<tr><td>Parallel</td><td>Many threads, stop-the-world</td><td>Longer, but best throughput</td><td>Batch jobs that only care about total time</td></tr>
<tr><td>G1 (default)</td><td>Heap split into equal regions (here 1 MiB); evacuates the regions with most garbage first; concurrent marking</td><td>Targets 200 ms (<code>-XX:MaxGCPauseMillis</code>), typically a few ms</td><td>General purpose; default since JDK 9, and on every machine size since JDK 27</td></tr>
<tr><td>ZGC</td><td>Concurrent marking and relocation with colored pointers and load barriers; generational by default since JDK 23</td><td>Sub-millisecond, independent of heap size</td><td>Latency-sensitive services, very large heaps (<code>-XX:+UseZGC</code>)</td></tr>
<tr><td>Shenandoah</td><td>Concurrent compaction (generational mode a product feature in JDK 25)</td><td>Low, like ZGC</td><td>Some OpenJDK builds (Red Hat, Amazon)</td></tr></table>
<h4>Reading a GC log</h4>
<p>Turn on unified logging with <code>-Xlog:gc</code> (or <code>-Xlog:gc*:file=gc.log</code> in production). One line decodes as: uptime, event number, event type and cause, heap occupancy before and after, committed heap size, and pause length. <code>GC(3) Pause Young (Normal) (G1 Evacuation Pause) 39M-&gt;10M(64M) 4.960ms</code> means the fourth collection was a young evacuation that took the heap from 39 MB to 10 MB of a 64 MB heap and stopped the application for 4.96 ms. The number that matters is the <em>after</em> value: it approximates the live set. In a healthy service it saws up and down around a flat floor. In the worked program below it climbs on every collection — 1, 3, 6, 10, 13 … 40 MB — the unmistakable signature of a leak: something is keeping every collection's survivors alive. G1 then started a concurrent mark cycle (heap occupancy crossed its initiating threshold, about 45%), and with a 32 MB heap the same program ran out: 18 full collections that freed nothing, then <code>OutOfMemoryError: Java heap space</code>. A bigger heap only delays that ending; the fix is to find the reference. ZGC with the same tiny 64 MB heap logged "Allocation Stall" — concurrent collectors need headroom to work while the application allocates.</p>
<p>The tool chain for leaks: <code>jcmd &lt;pid&gt; GC.heap_info</code> and <code>GC.class_histogram</code> (which classes own the heap — here, 40,000 <code>byte[]</code>), a heap dump with <code>jcmd &lt;pid&gt; GC.heap_dump /tmp/h.hprof</code> or <code>-XX:+HeapDumpOnOutOfMemoryError</code>, then Eclipse MAT's "path to GC roots", which ends at the guilty static field. JDK Flight Recorder (<code>-XX:StartFlightRecording</code>) records allocation and GC events cheaply enough to leave on in production. Usual culprits: static collections, caches with no eviction, listeners never removed, ThreadLocals in pooled threads, and inner classes holding their outer object.</p>
<h4>When it goes wrong</h4>
<table><tr><th>Error</th><th>Meaning</th><th>First move</th></tr>
<tr><td>OutOfMemoryError: Java heap space</td><td>Live set exceeds -Xmx (leak or undersized heap)</td><td>GC log after-values; class histogram; heap dump</td></tr>
<tr><td>OutOfMemoryError: Metaspace</td><td>Too many classes loaded (class-loader leak in redeploys, runaway proxies)</td><td>jcmd VM.metaspace; check repeated hot redeploys</td></tr>
<tr><td>OutOfMemoryError: unable to create native thread</td><td>OS thread or memory limit hit</td><td>Count threads (jcmd Thread.print); bound pools or use virtual threads (Module 8)</td></tr>
<tr><td>StackOverflowError</td><td>Unbounded or very deep recursion</td><td>The repeating frames in the trace show the cycle; make it iterative</td></tr>
<tr><td>NullPointerException</td><td>A null reference was used</td><td>Read the helpful message; fix the producer of the null, not just the consumer</td></tr></table>
<p><em>Exam mapping.</em> 1Z0-831's "Implementing Exception Handling in Java Applications" tests try/catch/finally, try-with-resources (close order, suppressed exceptions, effectively final resources), multi-catch, and custom checked and unchecked exceptions — often as "what is printed?" items. Garbage collection and GC logs are not exam objectives, but they are standard interview and production material, and Domain 21's incident response and Domain 19's container sizing assume you can read them.</p>`,
example:`<p><strong>Four failures, handled and explained (OpenJDK 21.0.12).</strong> <code>Failures.java</code>:</p>
<pre>import java.io.*;
import java.nio.file.*;
import java.util.*;

public class Failures {
    static class Meter implements AutoCloseable {
        private final String name;
        Meter(String name) { this.name = name; System.out.println("open  " + name); }
        void read(boolean fail) {
            if (fail) throw new IllegalStateException(name + ": read failed");
            System.out.println("read  " + name);
        }
        @Override public void close() {
            System.out.println("close " + name);
            if (name.equals("otdr")) throw new UncheckedIOException(new IOException(name + ": close failed"));
        }
    }
    record Splice(String id, Double lossDb) {}

    static int depth = 0;
    static void recurse() { depth++; recurse(); }

    public static void main(String[] args) throws Exception {
        // 1. try-with-resources closes in reverse order; a close() failure is attached, not lost.
        try (Meter a = new Meter("power"); Meter b = new Meter("otdr")) {
            a.read(false);
            b.read(true);
        } catch (IllegalStateException e) {
            System.out.println("caught " + e.getMessage());
            for (Throwable s : e.getSuppressed()) System.out.println("  suppressed " + s.getCause().getMessage());
        }

        // 2. Checked exception: the compiler forced this catch (or a throws clause).
        try {
            Files.readString(Path.of("/no/such/splice-log.txt"));
        } catch (IOException e) {
            System.out.println("checked " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }

        // 3. Helpful NullPointerException messages (JEP 358, on by default since JDK 15).
        Map&lt;String, Splice&gt; byId = new HashMap&lt;&gt;();
        byId.put("S1", new Splice("S1", null));
        try {
            double total = byId.get("S1").lossDb() + 0.3;        // auto-unboxing a null Double
        } catch (NullPointerException e) {
            System.out.println("NPE: " + e.getMessage());
        }
        Optional&lt;Splice&gt; maybe = Optional.ofNullable(byId.get("S9"));
        System.out.println("Optional: " + maybe.map(Splice::id).orElse("no splice S9"));

        // 4. The stack is finite: count frames until StackOverflowError.
        try { recurse(); } catch (StackOverflowError e) { System.out.println("StackOverflowError after " + depth + " frames"); }
    }
}</pre>
<p><code>javac Failures.java &amp;&amp; java Failures</code> printed:</p>
<pre>open  power
open  otdr
read  power
close otdr
close power
caught otdr: read failed
  suppressed otdr: close failed
checked NoSuchFileException: /no/such/splice-log.txt
NPE: Cannot invoke "java.lang.Double.doubleValue()" because the return value of "Failures$Splice.lossDb()" is null
Optional: no splice S9
StackOverflowError after 20004 frames</pre>
<p>The resources opened power then otdr and closed otdr then power — reverse order — before the catch ran; the close failure did not hide the read failure but rode along as a suppressed exception. The checked <code>NoSuchFileException</code> had to be caught (delete the catch and javac refuses: "unreported exception IOException; must be caught or declared to be thrown"). The helpful NPE message names the exact method that returned null and exposes the unboxing. Optional made the absent splice explicit. The default 1 MiB stack held 20,540 frames of <code>recurse()</code>, about 51 bytes per JIT-compiled frame. Then the leak, with <code>GcDemo.java</code> (a static list that keeps one of every ten 1 KiB readings):</p>
<pre>import java.util.ArrayList;
import java.util.List;

public class GcDemo {
    static final List&lt;byte[]&gt; CACHE = new ArrayList&lt;&gt;();      // the "leak": a static list that only grows

    public static void main(String[] args) {
        long allocated = 0;
        int i = 0;
        try {
            for (i = 1; i &lt;= 400_000; i++) {
                byte[] reading = new byte[1024];               // 1 KiB per sensor reading, mostly garbage
                allocated += reading.length;
                if (i % 10 == 0) CACHE.add(reading);           // keep 1 in 10 forever
            }
        } catch (OutOfMemoryError e) {
            int kept = CACHE.size();
            CACHE.clear();                                     // drop the references so we can print
            System.out.printf("OutOfMemoryError (%s) at reading %d with %d arrays retained%n", e.getMessage(), i, kept);
            return;
        }
        Runtime rt = Runtime.getRuntime();
        long usedMb = (rt.totalMemory() - rt.freeMemory()) &gt;&gt; 20;
        System.out.printf("allocated %d MiB, retained %d arrays (~%d MiB), heap used now %d MiB%n",
                allocated &gt;&gt; 20, CACHE.size(), (CACHE.size() * 1040L) &gt;&gt; 20, usedMb);
    }
}</pre>
<pre>$ java -Xmx64m -Xlog:gc GcDemo
[0.006s][info][gc] Using G1
[0.042s][info][gc] GC(0) Pause Young (Normal) (G1 Evacuation Pause) 7M-&gt;1M(64M) 1.859ms
[0.050s][info][gc] GC(1) Pause Young (Normal) (G1 Evacuation Pause) 15M-&gt;3M(64M) 1.922ms
[0.069s][info][gc] GC(2) Pause Young (Normal) (G1 Evacuation Pause) 36M-&gt;6M(64M) 5.403ms
[0.082s][info][gc] GC(3) Pause Young (Normal) (G1 Evacuation Pause) 39M-&gt;10M(64M) 4.960ms
[0.094s][info][gc] GC(4) Pause Young (Normal) (G1 Evacuation Pause) 44M-&gt;13M(64M) 4.086ms
   ... GC(5) to GC(10): after-values 16M, 20M, 23M, 26M, 29M, 32M ...
[0.133s][info][gc] GC(11) Pause Young (Concurrent Start) (G1 Evacuation Pause) 56M-&gt;34M(64M) 1.168ms
[0.133s][info][gc] GC(12) Concurrent Mark Cycle
[0.142s][info][gc] GC(15) Pause Young (Normal) (G1 Evacuation Pause) 56M-&gt;40M(64M) 1.223ms
[0.144s][info][gc] GC(12) Pause Remark 50M-&gt;50M(64M) 0.270ms
[0.148s][info][gc] GC(12) Pause Cleanup 50M-&gt;50M(64M) 0.124ms
[0.151s][info][gc] GC(12) Concurrent Mark Cycle 17.874ms
allocated 390 MiB, retained 40000 arrays (~39 MiB), heap used now 50 MiB

$ java -Xmx32m GcDemo
OutOfMemoryError (Java heap space) at reading 300766 with 30076 arrays retained</pre>
<p>Arithmetic check: 400,000 readings × 1,024 bytes = 390 MiB allocated, almost all garbage, collected in pauses of 1–5 ms each. Retained: 40,000 × 1,040 bytes = 39.7 MiB, which is why the after-GC floor rose to about 40 MB and the 32 MB heap died at reading 300,766 with 30,076 arrays (about 30 MiB) held. The log told you it was a leak before the crash did.</p>`,
misconceptions:["\"Garbage collection means no memory worries.\" GC reclaims unreachable objects, but references you forget to drop (e.g. an ever-growing static list) keep objects alive — a leak.","\"All exceptions are the same.\" Checked (external, must handle/declare) vs unchecked (bugs, RuntimeException) differ in compiler treatment and intent.","\"A variable holds the object.\" It holds a reference to an object on the heap; null is a reference to nothing, and calling a method on it throws NPE.","\"OutOfMemoryError means I need a bigger -Xmx.\" If the after-GC live set keeps rising, a bigger heap only delays the crash; find the retaining reference with a histogram or heap dump.","\"finally is the safe place for cleanup that can fail.\" An exception or return in finally replaces or swallows the original exception; try-with-resources keeps the original and records close failures as suppressed."],
problems:[
{q:"What's the difference between a checked and an unchecked exception?", a:"Checked (e.g. IOException) must be caught or declared with throws (compiler-enforced); unchecked (RuntimeException, e.g. NullPointerException) needn't be — usually programming bugs."},
{q:"What causes a NullPointerException?", a:"Calling a method or accessing a field on a reference that is null (points to no object)."},
{q:"What lives on the stack vs the heap?", a:"Stack: method frames, local variables and references. Heap: the objects created with new."},
{q:"What does garbage collection do, and what can still leak?", a:"Reclaims heap objects no longer reachable by any reference; you can still 'leak' by keeping references (e.g. a static collection that grows forever)."},
{q:"What does finally guarantee?", a:"Its block runs whether or not an exception was thrown — used for cleanup (try-with-resources automates closing resources)."},
{q:"A service's GC log shows young pauses with after-values 410M, 412M, 409M, 411M over an hour, then a week later 410M, 520M, 640M, 760M within ten minutes after a deploy. Which deploy is suspicious, what is happening, and what three commands do you run?", a:"The new deploy: the after-GC live set rising ~120 MB per collection means objects survive that should die (a leak or an unbounded cache). Run jcmd &lt;pid&gt; GC.class_histogram (twice, to see what grows), jcmd &lt;pid&gt; GC.heap_dump /tmp/h.hprof (analyze paths to GC roots in Eclipse MAT), and capture a JFR recording; meanwhile set -XX:+HeapDumpOnOutOfMemoryError."},
{q:"Predict the output: try (R a = new R(\"a\"); R b = new R(\"b\")) { throw new IllegalStateException(\"x\"); } catch (Exception e) { print(e.getMessage() + e.getSuppressed().length); } where R.close() prints 'close-' + name and b's close throws.", a:"close-b close-a, then x1: resources close in reverse order before the catch runs, the body's exception wins, and b's close failure is attached as one suppressed exception."},
{q:"A heap has a 1,600 MB young generation. A service allocates 800 MB/s of request objects, and 2% survive each young collection. How often do young GCs run, and how much is copied each time?", a:"Eden fills in about 1,600 / 800 = 2 s, so roughly one young GC every 2 seconds; 2% of ~1,600 MB = ~32 MB of survivors copied each time. Cost tracks the 32 MB live, not the 1,568 MB of garbage — the generational hypothesis at work."},
{q:"Rewrite this so it cannot leak a connection and does not swallow errors: Connection c = ds.getConnection(); Statement s = c.createStatement(); s.execute(sql); c.close();", a:"try (Connection c = ds.getConnection(); Statement s = c.createStatement()) { s.execute(sql); } — both close in reverse order even if execute throws, close failures become suppressed, and the SQLException propagates (declare throws SQLException or translate it with the cause attached)."}
],
checks:[{q:"Checked vs unchecked — which must you handle/declare?",a:"Checked (the compiler enforces it)."},{q:"NPE comes from?",a:"Using a null reference (calling a method/field on nothing)."},{q:"What frees Java's unused objects?",a:"The garbage collector (reclaims unreachable heap objects)."},{q:"In a GC log line 39M-&gt;10M(64M) 4.960ms, what does 10M approximate?",a:"The live data after the collection (the live set); 64M is the committed heap and 4.960 ms the pause."},{q:"Default collector in current JDKs?",a:"G1 (on every machine size since JDK 27; ZGC is the low-latency option)."}],
explain:"Explain to ADA, using the stack and heap, what a reference is and why a NullPointerException happens, then why GC still can't stop every leak — and show how the after-GC numbers in a GC log reveal one."},

{id:"p6m7", title:"Building Real Java: Packages, Modules, Build Tools, Testing and the Ecosystem", minutes:60,
outcomes:["Organize code into packages and multi-file projects, and explain the class path, JARs and the module path.","Use a build tool (Maven/Gradle): coordinates, lifecycle, dependency scopes, transitive conflicts and wrappers.","Write unit tests with JUnit 5/6, including parameterized and exception tests, and run them in the build.","Package an application as a JAR and a jlink runtime image, and debug it in an IDE.","Explain where Java goes next (Spring, Jakarta EE, Android, Kotlin) and the supply-chain risks of dependencies."],
body:`<p>The question this module answers: what turns a folder of .java files into something a team can build identically on every laptop and CI server, test on every commit and ship? A single Hello.java is not real Java. Professional Java is many files, organized into packages, built by a tool, tested with JUnit, and often built on a framework. This module maps that world so the jump from exercises to real projects is not a cliff.</p>
<h4>Packages and project structure</h4>
<p>A <strong>package</strong> is a namespace that groups related classes (com.yourcompany.billing), mirrored by folders on disk. Classes declare their package at the top and <strong>import</strong> others (import java.util.List;). Packages prevent name clashes and organize large codebases, Domain 4's modules, formalized. The convention (enforced by build tools) is a src/main/java tree for code and src/test/java for tests, with the package folders beneath. A class's real name is its fully qualified name — <code>com.you.splice.LossBudget</code> — and <code>import</code> is only a compile-time shorthand; nothing is "loaded" by an import.</p>
<h4>The class path, JARs and the module path</h4>
<p>At run time the JVM finds classes by turning a name into a path: <code>com.you.splice.LossBudget</code> becomes <code>com/you/splice/LossBudget.class</code>, searched in each entry of the <strong>class path</strong> (<code>-cp out:lib/a.jar:lib/b.jar</code>, with <code>;</code> instead of <code>:</code> on Windows). A JAR is a ZIP of class files and resources plus <code>META-INF/MANIFEST.MF</code>, whose <code>Main-Class</code> line makes <code>java -jar app.jar</code> work. The class path is flat and forgiving: two versions of one library on it means whichever comes first wins, and a missing one shows up only as <code>NoClassDefFoundError</code> when first used (Module 1). Java 9's module system (JPMS) adds a stricter layer: a <code>module-info.java</code> names the module, the modules it <code>requires</code> and the packages it <code>exports</code>. Unexported packages are inaccessible to other modules even if their classes are public — strong encapsulation one level above Module 3's access modifiers — and missing modules are detected at start-up instead of halfway through a request. <code>jdeps</code> lists what a JAR depends on; <strong>jlink</strong> assembles a custom runtime image containing only the modules your application needs. In the worked example the image is 39 MB against 286 MB for the full JDK, which matters for container images (Domain 19). Most application code still runs on the class path (the "unnamed module"); libraries increasingly ship as modules, and plain JARs on the module path become "automatic modules".</p>
<h4>Build tools</h4>
<p>You will not compile dozens of files by hand or download libraries manually. A <strong>build tool</strong>, <strong>Maven</strong> or <strong>Gradle</strong>, does it: it manages <strong>dependencies</strong> (declare a library and the version in a config file, pom.xml for Maven or build.gradle for Gradle, and it downloads it and everything it needs from a central repository, Domain 4's pip, Domain 5's npm), compiles the project, runs the tests, and packages the result into a runnable .jar. This dependency management and standard lifecycle is what makes Java projects reproducible across machines, the same role venv/requirements played in Domain 4.</p>
<p>Maven's model is worth knowing exactly. Every artifact has coordinates, <code>groupId:artifactId:version</code> (for example <code>org.junit.jupiter:junit-jupiter:5.11.4</code>). The <strong>build lifecycle</strong> is a fixed sequence of phases — validate, compile, test, package, verify, install, deploy — and running one runs every phase before it, so <code>mvn package</code> compiles and tests first; plugins do the work (the compiler plugin at compile, Surefire at test, the JAR plugin at package). Dependency <em>scopes</em> say where a library is needed: <code>compile</code> (everywhere, the default), <code>test</code> (JUnit — never shipped), <code>provided</code> (the server supplies it), <code>runtime</code> (a JDBC driver). Dependencies are <em>transitive</em>: you declare five, you get fifty. When two paths bring different versions of the same library, Maven picks the one nearest your project in the tree ("nearest wins"), which can silently select an older version — the cause of <code>NoSuchMethodError</code> at run time; <code>mvn dependency:tree</code> shows the truth and a <code>dependencyManagement</code> section or a BOM pins versions. Downloads are cached in <code>~/.m2/repository</code>. Commit the Maven Wrapper (<code>mvnw</code>) or Gradle Wrapper (<code>gradlew</code>) so every machine uses the same tool version. Current lines: Maven 3.9.x is what nearly every project runs (Maven 4 has been in release candidates through 2026), and Gradle 9.x (Android's build system).</p>
<table><tr><th></th><th>Maven</th><th>Gradle</th></tr>
<tr><td>Build file</td><td>pom.xml (declarative XML)</td><td>build.gradle.kts (Kotlin DSL) or build.gradle (Groovy)</td></tr>
<tr><td>Model</td><td>Fixed lifecycle of phases, plugins bound to phases</td><td>Graph of tasks with inputs and outputs</td></tr>
<tr><td>Speed</td><td>Good; rebuilds more than needed</td><td>Incremental builds, build cache, a background daemon</td></tr>
<tr><td>Where you meet it</td><td>Most enterprise back ends, most Spring examples</td><td>Android, large multi-project builds, Kotlin projects</td></tr>
<tr><td>Test command</td><td>mvn test</td><td>./gradlew test</td></tr></table>
<h4>Dependencies are a supply chain</h4>
<p>Every dependency is code from strangers running with your program's privileges. Log4Shell (CVE-2021-44228, December 2021) was a remote-code-execution flaw in Log4j 2, a logging library present transitively in a vast number of Java applications whose owners did not know they used it. The defenses are routine engineering: pin versions (no open ranges), keep a dependency inventory (an SBOM, e.g. CycloneDX, generated by a build plugin), scan with OWASP Dependency-Check or your platform's equivalent, enable Gradle's dependency verification or Maven checksum checks, and update deliberately. Domain 7 and Domain 31 treat this as software supply-chain security; for now, know that <code>mvn dependency:tree</code> is a security tool.</p>
<h4>Testing with JUnit</h4>
<p><strong>JUnit</strong> is Java's standard testing framework (Domain 4's pytest, Java edition). You write test methods annotated @Test that use assertions (assertEquals(7, calc.add(3, 4))) to check behavior; the build tool runs them. The discipline is identical to Domain 4: test the normal case and the edge cases, and tests catch regressions when you change code. In enterprise Java, tests are not optional, a large system without them is unmaintainable, and interviewers expect you to write them. JUnit's convention is expected value first, actual result second — swap them and the failure message reads backwards.</p>
<p>Modern JUnit is the JUnit Platform (which launches tests and reports to Maven, Gradle and IDEs) plus the Jupiter programming model you write against (<code>org.junit.jupiter.api</code>). JUnit 5 introduced that architecture; JUnit 6.0 (September 2025) kept the same Jupiter API, unified the version numbers and raised the baseline to Java 17, so everything below works on both. The essentials: <code>@Test</code>; <code>@BeforeEach</code>/<code>@AfterEach</code> for per-test setup (a fresh instance of the test class is created for every test method, so tests cannot leak state through fields); <code>assertEquals(expected, actual, delta)</code> for doubles; <code>assertThrows(IllegalArgumentException.class, () -&gt; ...)</code>; <code>assertAll</code> to report several failures at once; and <code>@ParameterizedTest</code> with <code>@CsvSource</code> to run one test over a table of cases — ideal for boundary values. Around JUnit sit Mockito (test doubles for collaborators), AssertJ (fluent assertions) and Testcontainers (a real PostgreSQL or Kafka in Docker for integration tests, Domain 18 and Domain 19). Maven's Surefire plugin runs classes named <code>*Test</code>, <code>Test*</code>, <code>*Tests</code> or <code>*TestCase</code> and summarizes with a line of the form <code>Tests run: 7, Failures: 0, Errors: 0, Skipped: 0</code>; a test class named <code>LossBudgetCheck</code> silently never runs.</p>
<h4>IDEs</h4>
<p>Java is almost always written in a full <strong>IDE</strong>, IntelliJ IDEA (the standard) or Eclipse, because static typing lets the IDE do so much: accurate autocomplete, instant error highlighting as you type, powerful refactoring (rename a method everywhere safely), and a debugger. This is static typing's payoff (Module 2) made tangible: the richer tooling is a direct consequence of the compiler knowing every type. VS Code with the Java extensions is a lighter alternative. Learn the debugger properly: line and conditional breakpoints, exception breakpoints (stop when any NPE is thrown), "evaluate expression", and stepping into library code. To debug a process running elsewhere — a container or a test server — start it with <code>-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005</code> and attach the IDE to port 5005 (only on a network you control: the debug port grants code execution). For production, log through SLF4J with Logback or Log4j 2 instead of <code>System.out</code>, and never log secrets or untrusted strings unescaped.</p>
<h4>The ecosystem and where you go next</h4>
<p><strong>Spring</strong> (and Spring Boot) is the dominant Java framework for building web services and enterprise back-ends, it wires your objects together (dependency injection), handles web requests (the server side of Domain 2/5's APIs), and connects to databases. It is the main reason companies hire Java developers, and a natural next step after this domain. Spring Boot 4.0 (November 2025, on Spring Framework 7, Java 17 or later) and 4.1 (June 2026) are the current lines; Module 9 builds the same small service with and without it. Jakarta EE (the former Java EE, now under the Eclipse Foundation, with packages renamed from <code>javax.*</code> to <code>jakarta.*</code>), Quarkus, Micronaut and Helidon are the other server stacks you will see. <strong>Android</strong> development uses Java and increasingly <strong>Kotlin</strong>, a modern JVM language that runs on the same bytecode and interoperates with Java, less verbose, with null safety built in, and worth learning after Java; Android builds run through Gradle, and Domain 39 covers the D8/R8 and ART steps that follow. Big-data (Spark, Kafka) is Java too, and Domain 36 uses it.</p>
<h4>When it goes wrong</h4>
<table><tr><th>Symptom</th><th>Likely cause</th><th>First move</th></tr>
<tr><td><code>package com.x does not exist</code></td><td>Dependency not declared, wrong scope, or IDE not synced with the build file</td><td>Check the pom/gradle file; reimport the project</td></tr>
<tr><td><code>NoSuchMethodError</code> at run time</td><td>Two versions of a library; an older one won mediation</td><td><code>mvn dependency:tree -Dverbose</code>; pin with dependencyManagement</td></tr>
<tr><td>Tests pass in the IDE, are skipped in CI</td><td>Class name does not match Surefire patterns, or JUnit 4 and 5 annotations mixed</td><td>Rename to *Test; use org.junit.jupiter.api.Test</td></tr>
<tr><td><code>Could not resolve dependencies</code></td><td>Typo in coordinates, private repository not configured, offline</td><td>Check coordinates on Maven Central; settings.xml; proxy</td></tr>
<tr><td><code>module not found</code> / <code>package is not visible</code></td><td>Missing requires or exports in module-info</td><td>Add requires/exports, or run on the class path</td></tr></table>
<p><em>Exam mapping.</em> 1Z0-831's "Packaging and Deploying Java Code" covers exactly the JDK half of this module: packages and imports, compiling and running from the command line, JAR files, defining modules with <code>requires</code>, <code>exports</code> and services, module import declarations (new in Java 25), creating runtime images with jlink, automatic and unnamed modules, plus compact source files and multi-file source launching. Maven, Gradle, JUnit and IDEs are not on the exam; they are on every job description.</p>`,
example:`<p><strong>From exercise to project.</strong> Your calculator grows from one file to: a Calculator class in package com.you.calc, a Main class that uses it, a CalculatorTest with JUnit @Test methods, and a pom.xml declaring JUnit as a dependency. You run mvn test and Maven downloads JUnit, compiles everything, and runs your tests; mvn package produces a runnable jar. That structure, source and test trees, a build file, a dependency, passing tests, is what "a Java project" means, and it is the same shape whether the project is 3 files or 3,000.</p>
<p><strong>The same shape, built by hand with only the JDK (OpenJDK 21.0.12)</strong>, so you see what Maven automates. A fiber loss-budget library in a module, with an internal app package:</p>
<pre>module com.you.splice {
    exports com.you.splice;          // the public API; com.you.splice.app stays internal
}</pre>
<pre>package com.you.splice;

/** Optical link loss budget: fiber attenuation + connectors + splices + safety margin. */
public final class LossBudget {
    private final double dbPerKm, connectorDb, spliceDb, marginDb;

    public LossBudget(double dbPerKm, double connectorDb, double spliceDb, double marginDb) {
        if (dbPerKm &lt;= 0) throw new IllegalArgumentException("dbPerKm must be &gt; 0");
        this.dbPerKm = dbPerKm; this.connectorDb = connectorDb; this.spliceDb = spliceDb; this.marginDb = marginDb;
    }
    public double totalLoss(double km, int connectors, int splices) {
        if (km &lt; 0 || connectors &lt; 0 || splices &lt; 0) throw new IllegalArgumentException("negative input");
        return km * dbPerKm + connectors * connectorDb + splices * spliceDb + marginDb;
    }
    public boolean fits(double powerBudgetDb, double km, int connectors, int splices) {
        return totalLoss(km, connectors, splices) &lt;= powerBudgetDb;
    }
}</pre>
<pre>package com.you.splice.app;

import com.you.splice.LossBudget;

public class Main {
    public static void main(String[] args) {
        LossBudget sm1310 = new LossBudget(0.35, 0.75, 0.10, 3.0);   // single-mode at 1310 nm
        double km = 12.5;
        int connectors = 2, splices = 6;
        double loss = sm1310.totalLoss(km, connectors, splices);
        System.out.printf("12.5 km, 2 connectors, 6 splices: %.2f dB total%n", loss);
        System.out.println("fits a 15 dB budget? " + sm1310.fits(15.0, km, connectors, splices));
        System.out.println("fits a 9 dB budget?  " + sm1310.fits(9.0, km, connectors, splices));
    }
}</pre>
<pre>$ find src -name "*.java"
src/main/java/module-info.java
src/main/java/com/you/splice/LossBudget.java
src/main/java/com/you/splice/app/Main.java
$ javac -d out $(find src/main/java -name "*.java")
$ jar --create --file app.jar --main-class com.you.splice.app.Main -C out .
$ java -jar app.jar
12.5 km, 2 connectors, 6 splices: 9.48 dB total
fits a 15 dB budget? true
fits a 9 dB budget?  false
$ jar --describe-module --file app.jar
com.you.splice jar:file:///.../app.jar!/module-info.class
exports com.you.splice
requires java.base mandated
contains com.you.splice.app
main-class com.you.splice.app.Main
$ jdeps --list-deps app.jar
   java.base
$ jlink --module-path app.jar --add-modules com.you.splice --output img \\
        --strip-debug --no-header-files --no-man-pages --compress=zip-6
$ du -sh img $JAVA_HOME
39M   img
286M  /usr/lib/jvm/java-21-openjdk-amd64
$ img/bin/java --list-modules
com.you.splice
java.base@21.0.12.1</pre>
<p>Check the arithmetic: 12.5 km × 0.35 dB/km = 4.375 dB, plus 2 × 0.75 = 1.5 dB of connectors, 6 × 0.10 = 0.6 dB of splices and a 3.0 dB margin, is 9.475 dB — inside a 15 dB budget, outside a 9 dB one. jdeps confirms the only dependency is <code>java.base</code>, so jlink built a 39 MB runtime instead of shipping a 286 MB JDK. The JUnit test that belongs in <code>src/test/java/com/you/splice/LossBudgetTest.java</code> (JUnit Jupiter API, identical in JUnit 5 and 6; with <code>junit-jupiter</code> as a test-scoped dependency, <code>mvn test</code> runs it):</p>
<pre>package com.you.splice;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

class LossBudgetTest {
    private final LossBudget sm1310 = new LossBudget(0.35, 0.75, 0.10, 3.0);

    @Test
    void addsEveryLossTerm() {
        assertEquals(9.475, sm1310.totalLoss(12.5, 2, 6), 1e-9);
    }

    @Test
    void zeroLengthIsJustConnectorsAndMargin() {
        assertEquals(4.5, sm1310.totalLoss(0, 2, 0), 1e-9);
    }

    @Test
    void rejectsNegativeLength() {
        assertThrows(IllegalArgumentException.class, () -&gt; sm1310.totalLoss(-1, 0, 0));
    }

    @ParameterizedTest
    @CsvSource({"15.0, true", "9.475, true", "9.0, false"})
    void budgetBoundary(double budget, boolean expected) {
        assertEquals(expected, sm1310.fits(budget, 12.5, 2, 6));
    }
}</pre>
<p>Four test methods, one of them run three times from the CSV table, so Surefire reports six test executions. The boundary row "9.475, true" is deliberate: it pins the rule "a link exactly at budget passes" (≤, not &lt;). Floating-point boundaries are fragile in general; here the sum evaluates to exactly 9.475 (checked in jshell), and a production version would compare with a tolerance or work in hundredths of a dB as integers.</p>`,
misconceptions:["\"You compile Java files by hand.\" Real projects use Maven/Gradle to manage dependencies, compile, test and package; manual javac is only for toy examples.","\"Tests are optional extra work.\" In enterprise Java they're expected and essential; JUnit tests catch regressions and document behavior.","\"Java and Kotlin are rivals you must choose between.\" Kotlin runs on the JVM and interoperates with Java; many teams mix them, especially on Android.","\"import loads a class.\" import is a compile-time naming shortcut; classes are loaded lazily by the class loader when first used.","\"I only depend on the five libraries in my pom.\" Transitive dependencies make it dozens; mediation can pick versions you never chose, and each one is part of your attack surface."],
problems:[
{q:"What is a package and why use one?", a:"A namespace grouping related classes (and matching folders) to avoid name clashes and organize large codebases."},
{q:"What does a build tool like Maven do for you?", a:"Manages dependencies (downloads libraries + versions), compiles, runs tests, and packages the app into a jar — reproducibly."},
{q:"What's the Java equivalent of pytest, and how do you mark a test?", a:"JUnit; annotate a test method with @Test and use assertions like assertEquals."},
{q:"Why is Java usually written in an IDE like IntelliJ?", a:"Static typing enables accurate autocomplete, live error-checking, safe refactoring and a strong debugger — tooling that pays off the type verbosity."},
{q:"What is Spring and why does it matter for jobs?", a:"The dominant Java framework for web services/enterprise back-ends (dependency injection, web, data); it's a primary reason companies hire Java developers."},
{q:"Your app depends on lib-a 2.0 (which needs common 1.4) and lib-b 3.1 (which needs common 2.2 via lib-c). At run time you get NoSuchMethodError in a lib-b class. Diagnose using Maven's mediation rule and fix it.", a:"Maven chooses the version nearest the root: common 1.4 (depth 2 via lib-a) beats common 2.2 (depth 3 via lib-b → lib-c), so lib-b runs against an older common that lacks the method. Confirm with mvn dependency:tree -Dverbose; fix by pinning common 2.2 in dependencyManagement (if lib-a is compatible) or upgrading lib-a."},
{q:"A container image ships a full JDK (286 MB) for an app whose jdeps output is java.base, java.net.http and java.logging. Propose the change and estimate the effect.", a:"Build a runtime with jlink --add-modules java.base,java.net.http,java.logging --strip-debug --no-man-pages --no-header-files --compress=zip-6, and copy only that image into a slim base. Expect roughly 40–50 MB instead of 286 MB, faster pulls and a smaller attack surface (no javac, no unused modules)."},
{q:"CI shows 'Tests run: 0' but the IDE runs 12 tests in LossBudgetChecks.java using org.junit.Test. Give two reasons and the fixes.", a:"(1) Surefire's default includes are *Test, Test*, *Tests, *TestCase — LossBudgetChecks matches none; rename (e.g. LossBudgetTest) or configure includes. (2) org.junit.Test is JUnit 4; with only the Jupiter engine on the test class path those tests are not discovered — switch to org.junit.jupiter.api.Test (or add the Vintage engine during migration)."},
{q:"Write the module-info.java for a module com.you.splice.web that uses java.net.http, exposes only com.you.splice.web.api, and depends on com.you.splice.", a:"module com.you.splice.web { requires java.net.http; requires com.you.splice; exports com.you.splice.web.api; } — every other package in the module stays inaccessible to other modules."}
],
checks:[{q:"What manages dependencies and builds in Java?",a:"Maven or Gradle."},{q:"Java's unit-test framework?",a:"JUnit (@Test + assertions)."},{q:"Dominant enterprise Java framework?",a:"Spring / Spring Boot."},{q:"What do requires and exports declare in module-info.java?",a:"requires: modules this one depends on; exports: packages other modules may use."},{q:"What does mvn package run before packaging?",a:"Every earlier lifecycle phase: validate, compile, test."}],
explain:"Explain to ADA what turns a single .java file into 'a real Java project', naming packages, a build tool, dependencies and JUnit tests — then explain how one dependency you never declared can break your app at run time, and how you would prove it."},

{id:"p6m8", title:"Concurrency: Threads, Executors, Virtual Threads and the Java Memory Model", minutes:60,
outcomes:["Create and coordinate threads and explain why count++ loses updates, at the bytecode level.","Make shared state correct with synchronized, locks, atomics and concurrent collections, and choose between them.","Explain the Java Memory Model's happens-before rules and use volatile and safe publication correctly.","Use ExecutorService, Future and CompletableFuture, size a thread pool with Little's Law, and use virtual threads for blocking I/O.","Diagnose deadlocks, races and pinning with jcmd thread dumps and JFR."],
body:`<p>The question this module answers: how does one Java process serve thousands of simultaneous requests on a handful of CPU cores without corrupting its own data? Every server you will build, attack in a lab (Domain 8) or defend (Domain 21) is concurrent. Your gaming PC's CPU has many cores (Domain 1); Domain 15 showed threads and mutexes in C; this module gives you Java's version, which adds two things C lacks — a precisely specified memory model and, since Java 21, virtual threads that make the simple thread-per-request style scale to millions of tasks.</p>
<h4>Threads</h4>
<p>A <strong>thread</strong> is an independent path of execution with its own stack, sharing the heap with every other thread in the process. Classic Java threads are <em>platform threads</em>: each one is a wrapper around an operating-system thread (Domain 3), scheduled by the kernel, with a stack reserved up front (1 MiB by default) and a creation cost in the tens of microseconds. You start one with <code>Thread.ofPlatform().start(task)</code> or the older <code>new Thread(task).start()</code> — calling <code>run()</code> directly just runs the task on the current thread. <code>join()</code> waits for it to finish. A thread moves through the states NEW, RUNNABLE, BLOCKED (waiting for a monitor), WAITING and TIMED_WAITING (in <code>join</code>, <code>sleep</code>, a lock or a queue) and TERMINATED; a thread dump shows each thread's state and stack. Cancellation is cooperative: <code>t.interrupt()</code> sets a flag and wakes the thread from blocking calls with <code>InterruptedException</code>; well-behaved code stops, or restores the flag (<code>Thread.currentThread().interrupt()</code>) if it cannot. JVM shutdown waits for non-daemon threads.</p>
<h4>Race conditions</h4>
<p>A <strong>race condition</strong> is a bug whose outcome depends on the timing of threads. The canonical one: four threads each run <code>count++</code> a million times. <code>count++</code> looks atomic but compiles to three steps — <code>getstatic</code> (read), <code>iconst_1; iadd</code> (add), <code>putstatic</code> (write). If two threads both read 41, both write 42, one increment has vanished (a <em>lost update</em>). In the worked example the plain counter ended at 3,156,326 instead of 4,000,000 on one run and at 2,029,917 on another: wrong, and differently wrong each time, which is what makes races so expensive to debug. The other classic shape is check-then-act — <code>if (!map.containsKey(k)) map.put(k, v);</code> — where another thread acts between the check and the act. Both are cured by making the compound action atomic.</p>
<h4>Locks: synchronized and java.util.concurrent.locks</h4>
<p>Every Java object has a monitor. <code>synchronized (lock) { ... }</code> (or a <code>synchronized</code> method, which locks <code>this</code>) lets one thread at a time into the block, and is reentrant, so a thread holding the lock can re-enter it. It also gives <em>visibility</em>: everything a thread wrote before releasing a lock is seen by the next thread that acquires it. <code>ReentrantLock</code> offers the same with extras — <code>tryLock()</code> with a timeout, interruptible waiting, optional fairness and several <code>Condition</code>s — at the price of an explicit <code>unlock()</code> in a <code>finally</code>. <code>ReadWriteLock</code> lets many readers in at once. Rules: keep critical sections short, never call unknown code (callbacks, I/O) while holding a lock, and lock on a private final object, not on <code>this</code> or a String literal that other code can also lock.</p>
<h4>Atomics and concurrent collections</h4>
<p>For a single variable, locking is often overkill. <code>AtomicInteger.incrementAndGet()</code> uses the CPU's <strong>compare-and-swap</strong> instruction (<code>lock cmpxchg</code> on x86): read the value, compute the new one, and store it only if the value is still the one you read, retrying otherwise — atomic without blocking. Under heavy contention every core fights over one cache line (Domain 1's coherence traffic), so <code>LongAdder</code> keeps a set of striped counters that are summed on read; in the worked run it beat <code>AtomicInteger</code> and <code>synchronized</code>. For shared maps use <code>ConcurrentHashMap</code>: reads take no lock, writes lock only one bin, and <code>merge</code>, <code>compute</code> and <code>computeIfAbsent</code> are atomic, which fixes the check-then-act race in one call (<code>counts.merge(word, 1, Integer::sum)</code>). <code>CopyOnWriteArrayList</code> suits rarely-changed listener lists; <code>BlockingQueue</code> (<code>ArrayBlockingQueue</code>, <code>LinkedBlockingQueue</code>) is the producer-consumer workhorse; <code>CountDownLatch</code> and <code>Semaphore</code> coordinate. Remember Module 5: plain <code>HashMap</code> and <code>ArrayList</code> are not thread-safe, and <code>Collections.synchronizedMap</code> serializes everything.</p>
<h4>The Java Memory Model</h4>
<p>The <strong>Java Memory Model</strong> (JMM, JSR 133, Java 5) answers a question Python's GIL and C's undefined behavior (Domain 15) leave murky: when is one thread guaranteed to see another thread's write? Not automatically. Cores keep values in registers, store buffers and caches (Domain 1 and Domain 38), and both the JIT and the CPU reorder independent instructions. The JMM defines a <strong>happens-before</strong> relation; if write W happens-before read R, R sees W. The edges you use daily: program order within one thread; unlocking a monitor happens-before every later lock of it; a write to a <strong>volatile</strong> field happens-before every later read of it; <code>Thread.start()</code> happens-before the started thread's actions, and a thread's actions happen-before another thread returns from <code>join()</code> on it; submitting a task to an executor happens-before it runs, and the task's completion happens-before <code>Future.get()</code> returns; and a constructor's writes to <code>final</code> fields are visible to any thread that sees the constructed object, provided <code>this</code> did not escape during construction. Two conflicting accesses not ordered by happens-before, at least one a write, are a <em>data race</em>, and then no ordering is promised.</p>
<p>The worked visibility demo makes it physical: a worker spins on <code>while (!stop)</code> with a plain boolean, main sets <code>stop = true</code> after 500 ms, and the worker never stops — the JIT compiled the loop, saw no write to <code>stop</code> inside it and hoisted the read out. Declare the field <code>volatile</code> and the same program stops after about 1.27 billion spins. <code>volatile</code> gives visibility and ordering, not atomicity: <code>volatile int count; count++</code> still loses updates. Safe publication — making a fully built object visible to other threads — needs one of these edges: a final field, a volatile field, a lock, or a concurrent collection.</p>
<h4>Deadlock</h4>
<p>A <strong>deadlock</strong> needs Domain 15's four conditions at once: mutual exclusion, hold-and-wait, no preemption and a circular wait. Two transfers that lock accounts in opposite orders — thread 1 holds A and wants B, thread 2 holds B and wants A — wait forever, with zero CPU use. The JVM detects monitor deadlocks for you: <code>jcmd &lt;pid&gt; Thread.print</code> (or <code>jstack</code>) ends with "Found one Java-level deadlock" and names both threads, the locks they hold and the locks they want, as in the transcript below. Prevent it by breaking circular wait: always acquire locks in one global order (for example by account id), or use <code>tryLock</code> with a timeout and back off.</p>
<pre>$ java Deadlock &amp;          # hangs: neither thread ever prints
$ jcmd &lt;pid&gt; Thread.print
Found one Java-level deadlock:
=============================
"transfer-1":
  waiting to lock monitor 0x00007febcc050920 (object 0x00000000a8518310, a java.lang.Object),
  which is held by "transfer-2"

"transfer-2":
  waiting to lock monitor 0x00007febd80015b0 (object 0x00000000a8518300, a java.lang.Object),
  which is held by "transfer-1"</pre>
<h4>Executors, futures and pool sizing</h4>
<p>Creating raw threads per task does not scale and leaks threads on errors. An <strong>executor</strong> separates <em>what</em> to run from <em>how</em>: <code>ExecutorService pool = Executors.newFixedThreadPool(8)</code>, then <code>pool.submit(callable)</code> returns a <code>Future</code> whose <code>get()</code> waits for the result (and rethrows a failure wrapped in <code>ExecutionException</code>). Since Java 19 an <code>ExecutorService</code> is <code>AutoCloseable</code>, so try-with-resources waits for submitted tasks and shuts the pool down. <code>CompletableFuture</code> chains asynchronous steps (<code>supplyAsync(...).thenApply(...).thenCombine(...)</code>); <code>ScheduledExecutorService</code> runs periodic jobs; the common <code>ForkJoinPool</code> runs parallel streams (Module 9). How many platform threads? For CPU-bound work, about one per core — more only adds context switches. For blocking work, Brian Goetz's rule from <em>Java Concurrency in Practice</em> is threads ≈ cores × (1 + wait time / compute time): 8 cores, 100 ms waiting on a database per 5 ms of computing gives 8 × 21 = 168 threads. <strong>Little's Law</strong> gives the same answer from the outside: requests in flight = throughput × latency, so 2,000 requests/s at 100 ms each keeps 200 requests in progress, and a thread-per-request server needs 200 threads to avoid queuing.</p>
<h4>Virtual threads</h4>
<p>Two hundred platform threads is fine; twenty thousand is not (20 GB of reserved stack and a kernel scheduler drowning in context switches). That is why asynchronous frameworks with callbacks existed — at the cost of code that is hard to read and debug. Java 21's <strong>virtual threads</strong> (JEP 444) remove the trade-off. A virtual thread is a <code>Thread</code> implemented by the JVM, not the OS: the JVM mounts it on a <em>carrier</em> — a carrier thread is one of a small pool of platform threads (a ForkJoinPool with one per core), and when the virtual thread blocks on I/O, a lock or <code>sleep</code>, the JVM unmounts it — copying its stack frames to the heap — and runs another on the same carrier. Blocking becomes cheap, a virtual thread costs on the order of a kilobyte until its stack grows, and millions can exist. The worked measurement: 10,000 tasks that each block for 100 ms took 5,101 ms on a pool of 200 platform threads (theory: 10,000 / 200 × 0.1 s = 5 s) and 208 ms with one virtual thread per task, on a two-core VM.</p>
<p>Rules for using them well. Use <code>Executors.newVirtualThreadPerTaskExecutor()</code> or <code>Thread.ofVirtual().start(...)</code>, and never pool virtual threads — they are cheap to create and pooling only adds limits. To protect a scarce resource (a database allowing 50 connections), bound concurrency with a <code>Semaphore</code> or the connection pool, not with a thread pool. Virtual threads speed up waiting, not computing: CPU-bound work still needs about one thread per core. Until JDK 24, blocking inside <code>synchronized</code> <em>pinned</em> the virtual thread to its carrier; JEP 491 (JDK 24) removed that for <code>synchronized</code>, but pinning remains for native frames, and JFR's <code>jdk.VirtualThreadPinned</code> event finds it. Prefer <strong>scoped values</strong> (final in JDK 25, JEP 506) to ThreadLocal for passing request context to millions of short-lived threads; structured concurrency, which treats a group of subtasks as one unit with shared cancellation, is still a preview API (seventh preview in JDK 27).</p>
<pre>$ java Visibility                       # static boolean stop
main set stop = true
worker STILL RUNNING after 2 s: it never saw the write
$ java Visibility                       # static volatile boolean stop
main set stop = true
worker saw stop after 1270746003 spins
worker finished</pre>
<h4>When it goes wrong</h4>
<table><tr><th>Symptom</th><th>Likely cause</th><th>Tool or fix</th></tr>
<tr><td>Totals slightly wrong, differently each run</td><td>Race: unsynchronized read-modify-write or check-then-act</td><td>Atomics, ConcurrentHashMap.merge, or a lock; test under load</td></tr>
<tr><td>Process alive, 0% CPU, requests time out</td><td>Deadlock or every pool thread blocked</td><td><code>jcmd &lt;pid&gt; Thread.print</code>; consistent lock order; timeouts</td></tr>
<tr><td>A thread never sees a flag change</td><td>No happens-before edge</td><td>volatile, AtomicBoolean or interrupt()</td></tr>
<tr><td>ConcurrentModificationException</td><td>A non-thread-safe collection shared, or modified while iterating</td><td>Concurrent collection or confinement to one thread</td></tr>
<tr><td>Virtual-thread service no faster</td><td>CPU-bound work, pinning in native code, or a small connection pool</td><td>Profile with JFR; check pool sizes</td></tr></table>
<p>Concurrency bugs are probabilistic; a test that passes once proves little. OpenJDK's jcstress harness runs tiny concurrent tests billions of times to expose memory-model violations, and stress tests with many threads belong in CI for any shared-state code.</p>
<p><em>Exam mapping.</em> 1Z0-831's "Implementing Multithreading for Concurrent Code Execution" covers creating platform and virtual threads, <code>Runnable</code> and <code>Callable</code>, thread lifecycle, executors, locking and the concurrent API (atomics, concurrent collections), scoped values (new for 25) and parallel streams; 1Z0-830 has the same group without scoped values. Expect "which output is possible?" items: if an answer depends on thread timing, the exam expects you to say the output is not guaranteed.</p>`,
example:`<p><strong>Four ways to count to four million (OpenJDK 21.0.12, two-core VM).</strong> <code>Race.java</code> runs the same 4 × 1,000,000 increments with no protection, a monitor, a CAS-based atomic and a striped adder:</p>
<pre>import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

public class Race {
    static int plain = 0;
    static int locked = 0;
    static final Object LOCK = new Object();
    static final AtomicInteger atomic = new AtomicInteger();
    static final LongAdder adder = new LongAdder();

    public static void main(String[] args) throws Exception {
        final int THREADS = 4, PER = 1_000_000;
        for (String mode : new String[]{"plain", "synchronized", "AtomicInteger", "LongAdder"}) {
            plain = 0; locked = 0; atomic.set(0); adder.reset();
            long t0 = System.nanoTime();
            try (ExecutorService pool = Executors.newFixedThreadPool(THREADS)) {   // ExecutorService is AutoCloseable since 19
                for (int t = 0; t &lt; THREADS; t++) {
                    pool.submit(() -&gt; {
                        for (int i = 0; i &lt; PER; i++) {
                            switch (mode) {
                                case "plain" -&gt; plain++;                       // read-modify-write: not atomic
                                case "synchronized" -&gt; { synchronized (LOCK) { locked++; } }
                                case "AtomicInteger" -&gt; atomic.incrementAndGet();  // CAS loop
                                default -&gt; adder.increment();                  // striped counters
                            }
                        }
                    });
                }
            }                                                                  // close() waits for all tasks
            long ms = (System.nanoTime() - t0) / 1_000_000;
            long result = switch (mode) {
                case "plain" -&gt; plain;
                case "synchronized" -&gt; locked;
                case "AtomicInteger" -&gt; atomic.get();
                default -&gt; adder.sum();
            };
            System.out.printf("%-14s %,10d of %,d  (%d ms)%n", mode, result, THREADS * PER, ms);
        }
    }
}</pre>
<p><code>javac Race.java &amp;&amp; java Race</code> printed:</p>
<pre>plain           3,156,326 of 4,000,000  (74 ms)
synchronized    4,000,000 of 4,000,000  (276 ms)
AtomicInteger   4,000,000 of 4,000,000  (92 ms)
LongAdder       4,000,000 of 4,000,000  (59 ms)</pre>
<p>The plain counter lost 843,674 increments (21%); an earlier run lost 49%. The three correct versions all reached 4,000,000; their timings in this one run (276, 92 and 59 ms) show the usual ordering under contention — a monitor makes threads queue, CAS retries on conflict, LongAdder spreads writes over several cells — but rerun it and the numbers move, so benchmark real workloads with JMH before choosing. Then the same idea at server scale, <code>Virtual.java</code>:</p>
<pre>import java.time.Duration;
import java.util.concurrent.*;
import java.util.stream.IntStream;

public class Virtual {
    // Simulates a blocking call: a database query or an HTTP request that waits 100 ms.
    static int blockingCall(int i) throws InterruptedException {
        Thread.sleep(Duration.ofMillis(100));
        return i % 7;
    }
    static long run(ExecutorService ex, int tasks) throws Exception {
        long t0 = System.nanoTime();
        long sum = 0;
        try (ex) {
            var futures = IntStream.range(0, tasks).mapToObj(i -&gt; ex.submit(() -&gt; blockingCall(i))).toList();
            for (Future&lt;Integer&gt; f : futures) sum += f.get();
        }
        System.out.printf("  checksum %d, ", sum);
        return (System.nanoTime() - t0) / 1_000_000;
    }
    public static void main(String[] args) throws Exception {
        int tasks = 10_000;
        System.out.println("tasks: " + tasks + " x 100 ms blocking wait, CPUs: " + Runtime.getRuntime().availableProcessors());
        System.out.println("fixed pool of 200 platform threads:" );
        System.out.println(run(Executors.newFixedThreadPool(200), tasks) + " ms");
        System.out.println("one virtual thread per task:");
        System.out.println(run(Executors.newVirtualThreadPerTaskExecutor(), tasks) + " ms");
        Thread vt = Thread.ofVirtual().unstarted(() -&gt; {});
        System.out.println("a virtual thread: " + vt + ", isVirtual=" + vt.isVirtual());
    }
}</pre>
<pre>tasks: 10000 x 100 ms blocking wait, CPUs: 2
fixed pool of 200 platform threads:
  checksum 29994, 5101 ms
one virtual thread per task:
  checksum 29994, 208 ms
a virtual thread: VirtualThread[#10222]/new, isVirtual=true</pre>
<p>5,101 ms versus 208 ms for identical work: the fixed pool can only wait on 200 sleeps at a time (50 waves of 100 ms), while 10,000 virtual threads all wait at once on two carrier threads. The checksums match, so the speed-up changed nothing about correctness — only about how waiting is scheduled.</p>`,
misconceptions:["\"count++ is a single step, so it is thread-safe.\" It is a read, an add and a write; two threads interleaving them lose updates. Use AtomicInteger, LongAdder or a lock.","\"volatile makes compound operations atomic.\" volatile guarantees visibility and ordering of single reads and writes; volatile count++ still races.","\"If my test passed, my concurrent code is correct.\" Races and visibility bugs depend on timing, JIT decisions and CPU; correctness must come from happens-before reasoning, backed by stress tests.","\"Virtual threads make everything faster.\" They make blocking cheap, so I/O-bound servers scale; CPU-bound work still needs about one thread per core.","\"You should pool virtual threads like platform threads.\" They are cheap to create; pooling them only adds a limit. Bound access to scarce resources with a Semaphore or a connection pool instead."],
problems:[
{q:"Write the bytecode steps of the statement count++ for a static int field and show an interleaving of two threads that loses an update starting from 41.", a:"getstatic count; iconst_1; iadd; putstatic count. T1 reads 41, T2 reads 41, T1 adds and writes 42, T2 adds and writes 42: two increments, one effect (should be 43)."},
{q:"A service handles 1,500 requests/s; each spends 4 ms on CPU and 76 ms waiting on a database. Using Little's Law, how many requests are in flight, and how many platform threads would a thread-per-request server need on 8 cores? What changes with virtual threads?", a:"In flight = 1,500 × 0.080 s = 120 requests, so about 120 threads (Goetz: 8 × (1 + 76/4) = 160 is the per-core sizing upper bound for full CPU use). With virtual threads you create one per request and stop sizing pools; the real limit becomes the database pool (bound with a Semaphore or the pool size)."},
{q:"Which happens-before edge, if any, makes each of these safe? (a) Thread A sets a volatile boolean ready = true after filling an array; B reads ready then the array. (b) A puts a result into a ConcurrentHashMap; B gets it. (c) A writes a plain field; B reads it after A.join() returns.", a:"(a) Volatile write → volatile read, and program order makes the array writes visible too. (b) Concurrent collections guarantee that an insertion happens-before a retrieval that sees it. (c) All of A's actions happen-before join() returns in B. All three are safe."},
{q:"transfer(from, to) locks from then to. Two concurrent transfers A→B and B→A hang forever. Show the cycle and give a fix that cannot deadlock.", a:"T1 holds A and waits for B; T2 holds B and waits for A — circular wait. Fix: always lock the account with the smaller id first (Account first = a.id &lt; b.id ? a : b), or use tryLock with timeouts and retry with backoff."},
{q:"10,000 tasks each block 200 ms. Estimate wall time on (a) a fixed pool of 100 platform threads, (b) newCachedThreadPool on a box that can create at most 4,000 threads, (c) virtual threads.", a:"(a) 10,000 / 100 = 100 waves × 0.2 s = 20 s. (b) It tries to create 10,000 threads and fails with OutOfMemoryError: unable to create native thread around 4,000. (c) About 0.2–0.3 s: all tasks wait concurrently on a few carriers."},
{q:"A check-then-act cache: if (!cache.containsKey(id)) cache.put(id, load(id)); on a ConcurrentHashMap sometimes loads the same id twice. Why, and what is the one-line fix?", a:"Another thread can run between containsKey and put, so both load. Use cache.computeIfAbsent(id, this::load), which performs the check and insert atomically for that key (keep load fast and non-recursive)."},
{q:"A worker loop while (!stop) { } never ends after main sets stop = true, but adding System.out.println inside the loop 'fixes' it. Explain both behaviors and give the real fix.", a:"Without a happens-before edge the JIT may hoist the read of stop out of the loop, so the change is never observed. println takes a lock internally, which happens to force re-reads — an accident, not a guarantee. Declare stop volatile (or use AtomicBoolean or interruption)."},
{q:"Rewrite to be correct and non-blocking for 8 threads incrementing per-word counts: Map&lt;String,Integer> counts = new HashMap&lt;>(); ... counts.put(w, counts.getOrDefault(w, 0) + 1);", a:"ConcurrentHashMap&lt;String, LongAdder&gt; counts = new ConcurrentHashMap&lt;&gt;(); counts.computeIfAbsent(w, k -> new LongAdder()).increment(); — atomic per key, minimal contention; read with counts.get(w).sum()."}
],
checks:[{q:"What does volatile guarantee?",a:"Visibility and ordering: a volatile write happens-before every later read of that field (not atomicity of compound actions)."},{q:"Name three happens-before edges.",a:"Any three: program order, unlock→lock of a monitor, volatile write→read, Thread.start, Thread.join, executor submit→run, Future completion→get, final fields after construction."},{q:"What happens to a virtual thread when it blocks on I/O?",a:"The JVM unmounts it from its carrier thread (stack saved on the heap) and runs another virtual thread on that carrier."},{q:"Which command shows a Java-level deadlock?",a:"jcmd &lt;pid> Thread.print (or jstack)."},{q:"Little's Law?",a:"Items in flight = throughput × time in system (L = λW)."}],
explain:"Explain to ADA why four threads doing count++ end up below four million, at the bytecode level, then explain the Java Memory Model's happens-before idea using the stop-flag demo, and finally why 10,000 blocking tasks finish 25 times faster on virtual threads but a CPU-bound job would not."},

{id:"p6m9", title:"Lambdas, Streams and a Real Service: From Functional Pipelines to an HTTP API", minutes:60,
outcomes:["Write lambdas and method references against the java.util.function interfaces, and explain how invokedynamic implements them.","Build stream pipelines with filter, map, flatMap, sorted, reduce and collectors (groupingBy, partitioningBy, toMap), and predict laziness and short-circuiting.","Use primitive streams, Optional and gatherers appropriately, and know when a plain loop or a parallel stream is the better tool.","Build and test a small JSON-over-HTTP service with the JDK's HttpServer and virtual threads, then map it onto Spring Boot.","Describe honestly where Java is used in industry and how this domain connects to Android (Domain 39), data engineering (Domain 36) and application security (Domain 31)."],
body:`<p>The question this module answers: how do professional Java developers turn collections of records into answers in a few readable lines, and how does that code end up behind an HTTP endpoint that other programs call? Module 5 gave you a taste of streams; Module 8 gave you the threads a server runs on. This module joins them: functional Java first, then a real service built with nothing but the JDK, then the Spring Boot version you will meet at work.</p>
<h4>Lambdas and functional interfaces</h4>
<p>A <strong>lambda</strong> is an anonymous function: <code>s -&gt; s.lossDb() &gt; 0.15</code>, <code>(a, b) -&gt; a + b</code>, or a block <code>x -&gt; { log(x); return x * 2; }</code>. Java has no function type; instead a lambda is converted to whatever <strong>functional interface</strong> the context expects — an interface with exactly one abstract method (marked, optionally, with <code>@FunctionalInterface</code>). The same text <code>s -&gt; s.isEmpty()</code> can become a <code>Predicate&lt;String&gt;</code> or a <code>Function&lt;String, Boolean&gt;</code> depending on where you put it; this is target typing. The <code>java.util.function</code> package holds the standard shapes:</p>
<table><tr><th>Interface</th><th>Method</th><th>Shape</th><th>Typical use</th></tr>
<tr><td>Predicate&lt;T&gt;</td><td>test</td><td>T → boolean</td><td>filter</td></tr>
<tr><td>Function&lt;T,R&gt;</td><td>apply</td><td>T → R</td><td>map</td></tr>
<tr><td>Consumer&lt;T&gt;</td><td>accept</td><td>T → nothing</td><td>forEach</td></tr>
<tr><td>Supplier&lt;T&gt;</td><td>get</td><td>nothing → T</td><td>orElseGet, lazy defaults</td></tr>
<tr><td>UnaryOperator&lt;T&gt;, BinaryOperator&lt;T&gt;</td><td>apply</td><td>T → T, (T,T) → T</td><td>replaceAll, reduce</td></tr>
<tr><td>IntPredicate, ToDoubleFunction&lt;T&gt; …</td><td>test, applyAsDouble …</td><td>primitive versions</td><td>avoid boxing</td></tr></table>
<p>A <strong>method reference</strong> is shorthand for a lambda that only calls a method, in four kinds: static (<code>Integer::parseInt</code>), bound to an object (<code>System.out::println</code>), unbound, where the first argument becomes the receiver (<code>String::toUpperCase</code>, <code>Splice::lossDb</code>), and constructor (<code>ArrayList::new</code>). Lambdas may read local variables only if they are <em>effectively final</em> — never reassigned — because the lambda captures the value, not the variable; the compiler error is "local variables referenced from a lambda expression must be final or effectively final". Functions compose: <code>Predicate.and</code>, <code>or</code>, <code>negate</code>; <code>Function.andThen</code> and <code>compose</code>; <code>Comparator.comparing(...).thenComparing(...)</code>. Under the hood javac does not generate an anonymous class: it emits an <code>invokedynamic</code> instruction (Module 1), and on first execution the JVM's <code>LambdaMetafactory</code> spins up an implementation of the interface; a lambda that captures nothing is created once and reused. Lambdas are cheap.</p>
<h4>Streams: pipelines, laziness and short-circuiting</h4>
<p>A <strong>stream</strong> is not a collection; it is a one-shot pipeline over a source. Every <strong>stream pipeline</strong> has three parts: a source (<code>list.stream()</code>, <code>Stream.of</code>, <code>IntStream.range</code>, <code>Files.lines</code>), zero or more <em>intermediate</em> operations that return a new stream (<code>filter</code>, <code>map</code>, <code>flatMap</code>, <code>sorted</code>, <code>distinct</code>, <code>limit</code>, <code>peek</code>), and one <em>terminal</em> operation that produces a result (<code>toList</code>, <code>collect</code>, <code>count</code>, <code>reduce</code>, <code>forEach</code>, <code>findFirst</code>, <code>anyMatch</code>). Intermediate operations are lazy: building the pipeline does nothing, and when the terminal operation runs, each element flows through all the stages before the next element starts — so <code>findFirst</code>, <code>anyMatch</code> and <code>limit</code> short-circuit and stop pulling once they have an answer. In the worked example, a pipeline with a printing <code>peek</code> printed nothing while it was being built and then visited only two of eight splices to find the first bad one. Two consequences catch people out: a stream can be consumed only once (reuse throws <code>IllegalStateException: stream has already been operated upon or closed</code>), and since Java 9 <code>count()</code> may skip the pipeline entirely when the size is known, so side effects in <code>peek</code> or <code>map</code> may never run. Stateful operations — <code>sorted</code>, <code>distinct</code> — must see every element before emitting any, and <code>sorted</code> on an infinite stream never finishes.</p>
<h4>Collectors and reduction</h4>
<p><code>collect</code> with the <code>Collectors</code> factory methods turns a stream into a structure. <code>groupingBy(Splice::cable)</code> builds a <code>Map&lt;String, List&lt;Splice&gt;&gt;</code>; add a downstream collector to summarize each group (<code>counting()</code>, <code>averagingDouble</code>, <code>summingInt</code>, <code>mapping</code>, <code>maxBy</code>) and a map factory (<code>TreeMap::new</code>) for sorted keys. <code>partitioningBy(predicate)</code> always yields a map with exactly two keys, true and false. <code>toMap(keyFn, valueFn)</code> throws <code>IllegalStateException</code> on a duplicate key unless you pass a merge function, and throws <code>NullPointerException</code> on a null value. <code>joining(", ")</code> builds strings. <code>Stream.toList()</code> (Java 16) returns an unmodifiable list; <code>Collectors.toList()</code> makes no promise about mutability. <code>reduce(identity, op)</code> folds a stream with an associative operation. Prefer the primitive streams — <code>mapToDouble(Splice::lossDb).sum()</code>, <code>average()</code>, <code>summaryStatistics()</code> — which avoid boxing every element (Module 2's 16 bytes each). <code>flatMap</code> flattens a stream of streams: every fiber of every cable becomes one stream. Results that may be absent come back as <code>Optional</code> (Module 6).</p>
<h4>Gatherers, parallel streams and when not to stream</h4>
<p>JDK 24 finalized <em>stream gatherers</em> (JEP 485), and they are on the Java 25 exam: <code>stream.gather(...)</code> is a user-definable intermediate operation, with built-ins such as <code>Gatherers.windowFixed(3)</code> (the stream 1 to 7 becomes [1, 2, 3], [4, 5, 6], [7]), <code>windowSliding</code>, <code>fold</code>, <code>scan</code> (running totals) and <code>mapConcurrent</code> (map with bounded concurrency on virtual threads). They need JDK 24 or later, so they were not run on this domain's JDK 21. <code>parallelStream()</code> splits the work across the common ForkJoinPool (one thread per core minus one). It pays only for large, CPU-heavy, stateless work over splittable sources (arrays, ArrayList, ranges); it is slower for small inputs, for LinkedList or I/O sources, and it is wrong with side effects on shared state (Module 8's races, now hidden inside a framework). And streams are not always clearer: when a loop needs early exit with several results, checked exceptions, or indexes, write the loop. The goal is readable code, not the fewest lines.</p>
<h4>A real service with only the JDK</h4>
<p>HTTP (Domain 2 and Domain 5) is text over TCP: a request line (<code>POST /splices HTTP/1.1</code>), headers, a blank line and an optional body; the response is a status line (<code>201 Created</code>), headers and a body. The JDK ships a small, supported HTTP server in the <code>jdk.httpserver</code> module (<code>com.sun.net.httpserver.HttpServer</code>), and since Java 21 you can give it a virtual-thread-per-request executor, which makes the simple blocking style scale (Module 8). The worked <code>SpliceService</code> binds to 127.0.0.1, accepts form-encoded POSTs, validates them (a non-numeric fiber or a loss outside 0–5 dB returns 400, an unknown method returns 405), stores records in a <code>ConcurrentHashMap</code> with an <code>AtomicLong</code> id generator — both safe for concurrent requests — and renders JSON with a record method and a stream. The <code>curl</code> transcript below is its real output. What it lacks is what frameworks provide: a JSON library (Jackson) instead of hand-built strings, routing, content negotiation, metrics, structured logging, configuration and graceful shutdown. (<code>jwebserver</code>, JDK 18's simple file server, covers the other common need: serving a directory of static files for testing.)</p>
<pre>$ java SpliceService 8091
listening on http://127.0.0.1:8091/splices

$ curl -i -X POST -d 'cable=C1&amp;fiber=2&amp;lossDb=0.04' http://127.0.0.1:8091/splices
HTTP/1.1 201 Created
Content-type: application/json
{"id":1,"cable":"C1","fiber":2,"lossDb":0.04}

$ curl -X POST -d 'cable=C3&amp;fiber=1&amp;lossDb=0.32' http://127.0.0.1:8091/splices
{"id":2,"cable":"C3","fiber":1,"lossDb":0.32}

$ curl -i -X POST -d 'cable=C3&amp;fiber=x&amp;lossDb=0.1' http://127.0.0.1:8091/splices
HTTP/1.1 400 Bad Request
{"error":"NumberFormatException"}

$ curl http://127.0.0.1:8091/splices
[{"id":1,"cable":"C1","fiber":2,"lossDb":0.04},{"id":2,"cable":"C3","fiber":1,"lossDb":0.32}]

$ curl -o /dev/null -w "%{http_code}\\n" -X DELETE http://127.0.0.1:8091/splices
405</pre>
<h4>The same service in Spring Boot</h4>
<p>In Spring Boot the handler shrinks to annotated methods, and the framework supplies the server (embedded Tomcat by default), JSON conversion, validation and <strong>dependency injection</strong> — the container builds your objects and passes their collaborators into their constructors, so a controller receives a repository instead of creating one, and a test can pass in a fake:</p>
<pre><code>@RestController
@RequestMapping("/splices")
class SpliceController {
    private final SpliceRepository repo;                 // injected by Spring
    SpliceController(SpliceRepository repo) { this.repo = repo; }

    @GetMapping
    List&lt;Splice&gt; all() { return repo.findAll(); }      // serialized to JSON by Jackson

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    Splice add(@Valid @RequestBody NewSplice body) { return repo.save(body.toSplice()); }
}</code></pre>
<p>Add <code>spring-boot-starter-web</code> (and <code>-validation</code>) to the build, set <code>spring.threads.virtual.enabled=true</code> (Spring Boot 3.2 and later) to serve requests on virtual threads, and <code>spring-boot-starter-actuator</code> adds <code>/actuator/health</code> and metrics. Spring Boot 4.x requires Java 17 or later. This listing was not compiled here — this environment cannot download from Maven Central — so treat it as the shape to type into a project generated at start.spring.io, where it will need imports for the annotations and your own <code>Splice</code>, <code>NewSplice</code> and <code>SpliceRepository</code> types.</p>
<h4>Production concerns and security</h4>
<p>A service on a network is an attack surface, and Domain 31 tests services like this one (only your own, or with written permission). Validate every input at the boundary and return 4xx, never a stack trace; bind to localhost until you mean to expose it; set timeouts on every outbound call; never deserialize untrusted bytes with Java's built-in <code>ObjectInputStream</code> — Java deserialization flaws have been a long-running class of remote-code-execution bugs — and parse JSON into specific record types instead; keep dependencies patched (Log4Shell, Module 7); log requests without logging secrets. For deployment, Domain 19 containerizes the JVM: it detects container memory and CPU limits, so size the heap with <code>-XX:MaxRAMPercentage=75</code> rather than a hard-coded <code>-Xmx</code>, and use a jlink runtime (Module 7) to shrink the image.</p>
<h4>Where Java is actually used</h4>
<p>Honest picture, October 2026. Java remains near the top of language-popularity indexes such as TIOBE after more than two decades, and its stronghold is server-side business software: banking and payments, insurance, retail and logistics, government, and telecom operations and billing support systems (OSS/BSS) — the provisioning and inventory systems behind the fiber you install. The JVM also runs much of the data infrastructure Domain 36 uses (Kafka, Spark, Flink, Hadoop, Elasticsearch, Cassandra). On Android, Kotlin is the default for new apps, Java remains fully supported and common in older codebases, and the Android SDK itself is Java APIs — Domain 39 picks up from here. Desktop and tools: IntelliJ IDEA, Ghidra (Domain 11), Burp Suite (Domain 8 and Domain 31) and Minecraft: Java Edition (Domain 40). Where Java is <em>not</em> the default: browser front ends (JavaScript and TypeScript, Domain 5), machine-learning research (Python, Domain 9), kernels, firmware and embedded systems (C, C++ and Rust, Domains 15 and 23), and quick scripts. The career reading: Java plus Spring, SQL (Domain 18) and containers (Domain 19) is one of the most hireable back-end skill sets there is, and the OCP certification is the recognized proof of the language part.</p>
<p><em>Exam mapping.</em> 1Z0-831's "Processing Data Using Streams and Lambda Expressions" covers functional interfaces, lambdas and method references, object and primitive streams, intermediate and terminal operations, collectors with grouping, partitioning and reduction, parallel streams and, new for 25, gatherers. Typical items: what a pipeline prints (watch laziness and short-circuiting), which lambda compiles (effectively final, target types), and the exact map type a <code>groupingBy</code> returns. HTTP servers and Spring are not exam objectives.</p>`,
example:`<p><strong>Splice analytics in one file (OpenJDK 21.0.12).</strong> <code>Splices.java</code> is a full pipeline workout over a day's splice log, with a 0.15 dB rework threshold:</p>
<pre>import java.util.*;
import java.util.function.*;
import java.util.stream.*;

public class Splices {
    record Splice(String cable, int fiber, double lossDb) {}

    public static void main(String[] args) {
        List&lt;Splice&gt; log = List.of(
            new Splice("C1", 1, 0.03), new Splice("C1", 2, 0.21), new Splice("C1", 3, 0.05),
            new Splice("C2", 1, 0.02), new Splice("C2", 2, 0.04), new Splice("C3", 1, 0.32),
            new Splice("C3", 2, 0.06), new Splice("C3", 3, 0.15));
        double limit = 0.15;

        // 1. A pipeline: source -&gt; intermediate ops (lazy) -&gt; terminal op (runs it).
        List&lt;String&gt; rework = log.stream()
            .filter(s -&gt; s.lossDb() &gt; limit)
            .sorted(Comparator.comparingDouble(Splice::lossDb).reversed())
            .map(s -&gt; s.cable() + "/f" + s.fiber() + " " + s.lossDb() + " dB")
            .toList();
        System.out.println("rework: " + rework);

        // 2. Collectors: group, count, average, partition.
        Map&lt;String, Double&gt; avgByCable = log.stream()
            .collect(Collectors.groupingBy(Splice::cable, TreeMap::new, Collectors.averagingDouble(Splice::lossDb)));
        avgByCable.forEach((c, avg) -&gt; System.out.printf("avg %s = %.3f dB%n", c, avg));
        Map&lt;Boolean, Long&gt; pass = log.stream()
            .collect(Collectors.partitioningBy(s -&gt; s.lossDb() &lt;= limit, Collectors.counting()));
        System.out.println("pass/fail " + pass);

        // 3. Primitive streams avoid boxing; summaryStatistics in one pass.
        DoubleSummaryStatistics st = log.stream().mapToDouble(Splice::lossDb).summaryStatistics();
        System.out.printf("n=%d min=%.2f max=%.2f total=%.2f dB%n", st.getCount(), st.getMin(), st.getMax(), st.getSum());

        // 4. Laziness: nothing runs until the terminal op, and limit() short-circuits.
        Stream&lt;Splice&gt; lazy = log.stream().peek(s -&gt; System.out.print("[" + s.cable() + s.fiber() + "]"))
                                 .filter(s -&gt; s.lossDb() &gt; limit);
        System.out.print("built the pipeline, nothing printed yet -&gt; ");
        System.out.println(" first bad: " + lazy.findFirst().orElseThrow().cable());

        // 5. Functions are values: compose them.
        Function&lt;Double, Double&gt; toMilli = db -&gt; db * 1000;
        Function&lt;Double, String&gt; label = v -&gt; String.format("%.0f mdB", v);
        System.out.println("composed: " + toMilli.andThen(label).apply(0.032));
        Predicate&lt;Splice&gt; bad = s -&gt; s.lossDb() &gt; limit;
        Predicate&lt;Splice&gt; onC3 = s -&gt; s.cable().equals("C3");
        System.out.println("bad on C3: " + log.stream().filter(bad.and(onC3)).count());
    }
}</pre>
<p><code>javac Splices.java &amp;&amp; java Splices</code> printed:</p>
<pre>rework: [C3/f1 0.32 dB, C1/f2 0.21 dB]
avg C1 = 0.097 dB
avg C2 = 0.030 dB
avg C3 = 0.177 dB
pass/fail {false=2, true=6}
n=8 min=0.02 max=0.32 total=0.88 dB
built the pipeline, nothing printed yet -&gt; [C11][C12] first bad: C1
composed: 32 mdB
bad on C3: 1</pre>
<p>Check it by hand. Two splices exceed 0.15 dB (C3/f1 at 0.32 and C1/f2 at 0.21), sorted worst first; C3/f3 at exactly 0.15 passes because the test is &gt;. Cable averages: C1 = (0.03 + 0.21 + 0.05) / 3 = 0.097, C2 = 0.030, C3 = (0.32 + 0.06 + 0.15) / 3 = 0.177. Six pass and two fail. The statistics line came from one pass over a <code>DoubleStream</code>, with no boxing. The laziness line is the important one: "built the pipeline, nothing printed yet" appeared before any bracket, and then only [C11] and [C12] were visited — <code>findFirst</code> stopped the moment C1 fiber 2 matched, leaving six splices untouched. Composition turned 0.032 dB into "32 mdB", and <code>bad.and(onC3)</code> found the single bad splice on C3. The service built on the same records is <code>SpliceService.java</code>:</p>
<pre>import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicLong;

/** A tiny JSON-over-HTTP service using only the JDK: one virtual thread per request. */
public class SpliceService {
    record Splice(long id, String cable, int fiber, double lossDb) {
        String json() {
            return String.format("{\\"id\\":%d,\\"cable\\":\\"%s\\",\\"fiber\\":%d,\\"lossDb\\":%.2f}", id, cable, fiber, lossDb);
        }
    }
    private static final Map&lt;Long, Splice&gt; STORE = new ConcurrentHashMap&lt;&gt;();
    private static final AtomicLong NEXT_ID = new AtomicLong(1);

    public static void main(String[] args) throws IOException {
        int port = args.length &gt; 0 ? Integer.parseInt(args[0]) : 8080;
        HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", port), 0);
        server.setExecutor(Executors.newVirtualThreadPerTaskExecutor());
        server.createContext("/splices", SpliceService::handle);
        server.start();
        System.out.println("listening on http://127.0.0.1:" + port + "/splices");
    }

    static void handle(HttpExchange ex) throws IOException {
        try (ex) {
            switch (ex.getRequestMethod()) {
                case "GET" -&gt; {
                    String body = STORE.values().stream().map(Splice::json)
                                       .reduce((a, b) -&gt; a + "," + b).map(s -&gt; "[" + s + "]").orElse("[]");
                    send(ex, 200, body);
                }
                case "POST" -&gt; {
                    // Expect a form-style body: cable=C1&amp;fiber=2&amp;lossDb=0.04
                    String form = new String(ex.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
                    Map&lt;String, String&gt; f = new java.util.HashMap&lt;&gt;();
                    for (String kv : form.split("&amp;")) {
                        String[] p = kv.split("=", 2);
                        if (p.length == 2) f.put(p[0], p[1]);
                    }
                    try {
                        double loss = Double.parseDouble(f.get("lossDb"));
                        if (loss &lt; 0 || loss &gt; 5) throw new IllegalArgumentException("lossDb out of range");
                        Splice s = new Splice(NEXT_ID.getAndIncrement(), f.get("cable"), Integer.parseInt(f.get("fiber")), loss);
                        STORE.put(s.id(), s);
                        send(ex, 201, s.json());
                    } catch (RuntimeException e) {          // NumberFormatException, NPE, our own check
                        send(ex, 400, "{\\"error\\":\\"" + e.getClass().getSimpleName() + "\\"}");
                    }
                }
                default -&gt; send(ex, 405, "{\\"error\\":\\"method not allowed\\"}");
            }
        }
    }
    static void send(HttpExchange ex, int status, String json) throws IOException {
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        ex.getResponseHeaders().set("Content-Type", "application/json");
        ex.sendResponseHeaders(status, bytes.length);
        try (OutputStream os = ex.getResponseBody()) { os.write(bytes); }
    }
}</pre>
<p>Its real responses are in the curl transcript in the lecture above: 201 with the stored JSON, 400 for a non-numeric fiber, the full list on GET, and 405 for DELETE.</p>`,
misconceptions:["\"A stream is a kind of collection.\" It is a one-shot, lazy pipeline over a source; it stores nothing, runs only when a terminal operation is called, and cannot be reused.","\"peek and map always run once per element.\" Short-circuiting operations stop early, and count() may skip the pipeline entirely when the size is known, so never put required side effects in a pipeline.","\"parallelStream() is a free speed-up.\" It helps only large, CPU-bound, stateless work on splittable sources, and it is slower for small inputs and wrong with shared mutable state.","\"Lambdas are anonymous inner classes in disguise.\" javac emits invokedynamic and the JVM's LambdaMetafactory creates the implementation at run time; non-capturing lambdas are cached singletons.","\"A framework makes a service secure.\" Spring handles plumbing; input validation, safe deserialization, timeouts and patched dependencies are still your job."],
problems:[
{q:"Write a pipeline that returns the distinct cable names with at least one splice over 0.15 dB, sorted alphabetically, as an unmodifiable List.", a:"log.stream().filter(s -> s.lossDb() > 0.15).map(Splice::cable).distinct().sorted().toList()"},
{q:"What exact type does log.stream().collect(Collectors.groupingBy(Splice::cable, Collectors.counting())) return, and how do you get the keys sorted?", a:"Map&lt;String, Long> (a HashMap in practice, unordered). Pass a map factory: groupingBy(Splice::cable, TreeMap::new, counting()), giving a TreeMap&lt;String, Long>."},
{q:"Predict the output: Stream.of(\"a\", \"bb\", \"ccc\").peek(s -> System.out.print(s + \" \")).filter(s -> s.length() > 1).findFirst().ifPresent(System.out::println);", a:"a bb bb — each element flows through peek then filter; a fails the filter, bb passes and findFirst stops immediately, so ccc is never visited."},
{q:"This fails to compile: int total = 0; list.forEach(s -> total += s.fiber()); Explain and give two correct versions.", a:"Lambdas may only capture effectively final locals, and total is reassigned. Use int total = list.stream().mapToInt(Splice::fiber).sum(); or a plain for loop (or an AtomicInteger/LongAdder if truly needed across threads)."},
{q:"Collectors.toMap(Splice::cable, Splice::lossDb) throws IllegalStateException: Duplicate key C1. Why, and how do you build 'worst loss per cable' instead?", a:"Several splices share a cable, and toMap without a merge function refuses duplicate keys. Use toMap(Splice::cable, Splice::lossDb, Math::max) (or groupingBy with a maxBy downstream)."},
{q:"A team switches a pipeline over 2,000 orders to parallelStream() and adds results to a shared ArrayList in forEach. Name the two problems and fix them.", a:"(1) ArrayList is not thread-safe, so concurrent adds lose elements or throw. (2) 2,000 small items cost more to split and coordinate than to process. Fix: stay sequential and use .toList() (or collect, which is safe even in parallel)."},
{q:"Your SpliceService must reject a POST whose lossDb is 7.2 and one whose cable is missing. What status codes and response bodies should it return, and where does the check belong?", a:"400 Bad Request for both, with a JSON error naming the field (e.g. {\"error\":\"lossDb out of range\"} and {\"error\":\"cable is required\"}). Validate at the boundary, before constructing the record (or in the record's compact constructor), never by catching NullPointerException deep inside."},
{q:"Under load, the JDK HttpServer version with a fixed pool of 20 threads stalls when each request waits 200 ms on a downstream API. Using Little's Law, what throughput ceiling does the pool impose, and what one-line change removes it?", a:"Throughput ≤ threads / latency = 20 / 0.2 s = 100 requests/s; beyond that requests queue. server.setExecutor(Executors.newVirtualThreadPerTaskExecutor()) lets every request wait concurrently (then bound downstream calls with a Semaphore if that API has limits)."}
],
checks:[{q:"What is a functional interface?",a:"An interface with exactly one abstract method; a lambda or method reference can implement it."},{q:"Name the three parts of a stream pipeline.",a:"A source, zero or more lazy intermediate operations, and one terminal operation."},{q:"Which interface does filter take, and which does map take?",a:"filter takes a Predicate&lt;T>; map takes a Function&lt;T,R>."},{q:"What does partitioningBy always return?",a:"A Map&lt;Boolean, …> with exactly two keys, true and false."},{q:"How do you make the JDK HttpServer handle each request on a virtual thread?",a:"server.setExecutor(Executors.newVirtualThreadPerTaskExecutor())."}],
explain:"Explain to ADA what 'lazy' means for a Java stream, using the peek-and-findFirst output where only two of eight splices were visited — then walk through what happens, thread by thread, when two curl requests hit SpliceService at the same moment, and why ConcurrentHashMap and AtomicLong make that safe."}
],
listening:[],
labs:[
{id:"p6lab1", title:"First class and objects", goal:"Model with classes.", steps:["In an online Java playground or your JDK, write a BankAccount class with private balance, deposit and withdraw (rejecting overdraft), and a getBalance.","In main, create two accounts and show they're independent.","Add a toString() override so printing an account is readable.","Explain encapsulation to ADA using your withdraw guard."], deliverable:"Your compiling class + main output."},
{id:"p6lab2", title:"Inheritance & polymorphism", goal:"A shape hierarchy.", steps:["Write an abstract Shape with an abstract double area(), and Circle and Rectangle subclasses.","Put several shapes in a List&lt;Shape&gt; and loop, printing each area — without checking types.","Add a Triangle and confirm the loop needs no change.","Explain to ADA why that's polymorphism."], deliverable:"The hierarchy and the one loop that handles all shapes."},
{id:"p6lab3", title:"Collections & generics", goal:"Use Map and List type-safely.", steps:["Read a list of words and count each with a Map&lt;String, Integer&gt;.","Print the counts; try (and watch the compiler reject) adding a wrong type.","Rewrite the filtering with a stream and lambda.","Explain to ADA what the generics guaranteed."], deliverable:"Your word-count program."},
{id:"p6lab4", title:"A real project with tests", goal:"Maven + JUnit.", steps:["Create a Maven project (or use an IDE's wizard) with the src/main and src/test structure.","Write a small utility class and JUnit @Test methods for its normal and edge cases.","Run mvn test; make them pass; then mvn package for a jar.","Explain the project structure to ADA."], deliverable:"Passing tests and a built jar."}
],
capstone:{title:"Build an object-oriented Java application", brief:"Build a small but real Java program (a library catalog, a bank with multiple account types, a simple inventory — or, closer to your work, a fiber splice and loss-budget tracker) using: multiple classes with encapsulation, an interface or abstract class with polymorphism, generic collections (List/Map/Set), exception handling, packages, a Maven/Gradle build, and JUnit tests. Then take it to professional depth: model at least one value type as a record and one closed set of variants as a sealed interface handled by an exhaustive pattern switch; process data with at least one stream pipeline and collector; make one piece of shared state safe for concurrent use and prove it with a multi-threaded test; and expose two operations over HTTP (the JDK HttpServer on virtual threads, or Spring Boot). Run it once with -Xlog:gc and explain the log. Walk ADA through your class design and where each OOP pillar appears, then through one decision you made about collections, one about exceptions and one about concurrency.", rubric:["Classes use private fields with controlled access (encapsulation).","An interface or abstract class is used with genuine polymorphism (a loop/method over a supertype).","Generic collections chosen appropriately (Map for lookups, etc.); exceptions handled.","Builds with Maven/Gradle and has passing JUnit tests.","At least one record with a validating compact constructor and one sealed hierarchy with an exhaustive switch (no default branch).","A stream pipeline with a collector replaces a hand-written loop where it reads better, and the choice of each collection is justified by its Big-O.","Shared mutable state is thread-safe (atomics, a concurrent collection or a lock) and a test with several threads demonstrates it; the HTTP endpoint validates input and returns correct status codes.","The learner can read the program's GC log and javap output aloud and explain what each line means."]},
exam:[
{id:"p6q1", type:"mc", q:"What does the Java compiler (javac) produce?", options:["Machine code for your CPU","Bytecode (.class) that the JVM runs","A Python file","An executable installer"], answer:1, why:"javac compiles source to portable bytecode; the JVM runs it (JIT to native)."},
{id:"p6q2", type:"mc", q:"How should you compare two String objects for equal text?", options:["==","=","a.equals(b)","a.compareTo(b)"], answer:2, why:"== compares references; .equals() compares value."},
{id:"p6q3", type:"mc", q:"Which is a primitive type?", options:["String","Integer","int","ArrayList"], answer:2, why:"int is a primitive; String/Integer/ArrayList are objects."},
{id:"p6q4", type:"mc", q:"Encapsulation is achieved by:", options:["Making all fields public","Private fields with public methods controlling access","Using static everywhere","Avoiding classes"], answer:1, why:"Hide data (private) behind a controlled interface."},
{id:"p6q5", type:"mc", q:"A static member belongs to:", options:["Each object instance","The class itself (one shared copy)","The JVM only","The superclass"], answer:1, why:"static = class-level; instance members belong to each object."},
{id:"p6q6", type:"mc", q:"extends is to ____ as implements is to ____.", options:["interface ; superclass","superclass ; interface","field ; method","package ; class"], answer:1, why:"extends a superclass (is-a); implements an interface (capability)."},
{id:"p6q7", type:"mc", q:"Polymorphism lets you:", options:["Store any type in any variable","Call a method on a supertype reference and run the actual subtype's version","Avoid writing classes","Make fields public"], answer:1, why:"The runtime object's overridden method runs, so one code path serves many subtypes."},
{id:"p6q8", type:"mc", q:"If you override equals(), you must also override:", options:["toString()","hashCode()","main()","the constructor"], answer:1, why:"Hash-based collections rely on equal objects sharing a hashCode."},
{id:"p6q9", type:"mc", q:"List&lt;String&gt; names guarantees:", options:["The list is sorted","Only Strings can be added (compile-checked)","Faster code","The list is immutable"], answer:1, why:"Generics enforce the element type at compile time."},
{id:"p6q10", type:"mc", q:"A NullPointerException happens when you:", options:["Divide by zero","Call a method on a null reference","Exceed an array's length","Run out of memory"], answer:1, why:"Using a reference that points to no object throws NPE."},
{id:"p6q11", type:"sa", q:"Explain the compile-and-run model of Java and why it gives 'write once, run anywhere', contrasting with a compiled C program.", answer:"You write .java source; javac compiles it to bytecode (.class), a portable instruction set for the JVM, not any real CPU. The JVM on each platform executes the bytecode, JIT-compiling hot paths to that machine's native code. Because bytecode targets the JVM rather than hardware, the same .class runs anywhere a JVM exists — 'write once, run anywhere'. A compiled C program, by contrast, is native machine code for one CPU/OS and must be recompiled for each platform.", rubric:"Covers source→bytecode→JVM(JIT), portability via the JVM abstraction, and the contrast with native C."},
{id:"p6q12", type:"sa", q:"Explain encapsulation and polymorphism, and why each helps large programs, using a concrete example.", answer:"Encapsulation hides an object's data behind a controlled interface: private fields with public methods that validate changes (an Account with private balance and a withdraw() that refuses overdrafts), so each class guards its own correctness and bugs are localized. Polymorphism lets a supertype reference run the actual subtype's overridden method, so one piece of code (for (Employee e : list) e.calculatePay()) handles every subtype and new subtypes work without changing it. Together they let big programs be reasoned about one class at a time and extended without editing existing code.", rubric:"Defines both with examples; encapsulation=controlled/validated access/localized bugs; polymorphism=one path over many subtypes, extensible."},
{id:"p6q13", type:"sa", q:"Distinguish checked from unchecked exceptions, and explain references, null, and garbage collection in Java's memory model.", answer:"Checked exceptions (IOException, SQLException) represent external failures you must catch or declare with throws — the compiler enforces it; unchecked exceptions (RuntimeException like NullPointerException) are usually bugs and need not be declared. Variables hold references to objects on the heap (method frames and locals live on the stack); a null reference points to nothing, and using it throws a NullPointerException. The garbage collector automatically reclaims heap objects no longer reachable by any reference, preventing most leaks — though keeping references unnecessarily (a growing static collection) still leaks.", rubric:"Checked vs unchecked (compiler/intent); references+stack/heap; null→NPE; GC reclaims unreachable objects but references can still leak."},
{id:"p6q14", type:"mc", q:"A JAR built on a developer's laptop fails on the production server with java.lang.UnsupportedClassVersionError: ... class file version 69.0, this version of the Java Runtime only recognizes class file versions up to 65.0. What happened, and what is the best fix?", options:["The JAR is corrupt; rebuild it","It was compiled for Java 25 and the server runs Java 21; recompile with javac --release 21 (or upgrade the server runtime)","The server needs a larger heap","The class path is missing a dependency"], answer:1, why:"Major version = 44 + release: 69 is Java 25, 65 is Java 21. An older JVM cannot load newer class files; --release 21 targets the server and also checks that only Java 21 APIs are used."},
{id:"p6q15", type:"mc", q:"long ms = 30 * 24 * 60 * 60 * 1000; prints -1702967296. Why?", options:["long cannot hold 2,592,000,000","The multiplication is done in int and overflows before the result is widened to long","Java rounds large products","println cannot print longs"], answer:1, why:"All operands are int, so the product wraps modulo 2^32 (2,592,000,000 − 4,294,967,296) and only then is widened. Writing 30L makes the whole expression long."},
{id:"p6q16", type:"mc", q:"Integer a = 127, b = 127, c = 128, d = 128; What does System.out.println((a == b) + \" \" + (c == d)); print?", options:["true true","true false","false false","It does not compile"], answer:1, why:"Autoboxing uses Integer.valueOf, which caches -128 to 127; a and b are the same cached object, c and d are distinct objects, and == compares references. Use equals."},
{id:"p6q17", type:"mc", q:"class CountingSet&lt;E&gt; extends HashSet&lt;E&gt; overrides add (count++) and addAll (count += c.size()), each calling super. After addAll(List.of(\"a\",\"b\",\"c\")) the count is 6. What is the root cause?", options:["HashSet stores duplicates","The inherited addAll calls the overridden add for each element, so every element is counted twice — a fragile-base-class problem; use composition instead","List.of creates six elements","The JIT ran addAll twice"], answer:1, why:"HashSet.addAll comes from AbstractCollection, which loops calling add(), which is now the counting override. Depending on a superclass's self-use is fragile; wrapping a Set and forwarding (composition) counts 3."},
{id:"p6q18", type:"mc", q:"sealed interface Shape permits Circle, Rect {} and a method uses an exhaustive switch expression over Shape with no default. A developer adds record Tri(...) implements Shape and lists Tri in permits. What happens?", options:["The switch throws MatchException at run time for triangles","The code compiles and the switch returns 0 for Tri","Compilation fails at the switch: it no longer covers all possible input values","Tri is silently treated as a Rect"], answer:2, why:"The compiler checks exhaustiveness against the permits list, so every pattern switch over Shape must now handle Tri — the compiler finds every place that needs updating."},
{id:"p6q19", type:"mc", q:"A report loops for (int i = 0; i &lt; list.size(); i++) total += list.get(i); over 100,000 elements and takes 6.7 seconds. The list is a LinkedList. What is the complexity and the fix?", options:["O(n); use a parallel stream","O(n²) because get(i) walks nodes; use an ArrayList or iterate with for-each","O(log n); add an index","O(1); the slowness is GC"], answer:1, why:"Each LinkedList.get(i) traverses from the nearer end (n/4 hops on average), so the loop is O(n²): about 2.5 billion pointer hops. ArrayList.get is O(1), or iterate with for-each, which walks the list once."},
{id:"p6q20", type:"mc", q:"A service's G1 log shows young-collection after-values of 1M, 3M, 6M, 10M, 13M, … 40M on a 64M heap, then a concurrent mark cycle; with a 32M heap the process ends in repeated Pause Full and OutOfMemoryError: Java heap space. What is the most likely diagnosis?", options:["The heap is simply too small; double -Xmx and move on","A memory leak: objects that should die stay reachable, so the live set grows after every collection — find the retaining reference with a class histogram or heap dump","G1 is broken; switch to ZGC","Too many threads"], answer:1, why:"The after-GC value approximates the live set; a steady climb means something retains objects (here a static list). A bigger heap only delays the OOM. jcmd GC.class_histogram and a heap dump analyzed for paths to GC roots find the culprit."},
{id:"p6q21", type:"mc", q:"10,000 tasks each block for 100 ms on I/O. Roughly how long does a fixed pool of 200 platform threads take, and roughly how long does newVirtualThreadPerTaskExecutor take?", options:["0.1 s and 0.1 s","5 s and about 0.2 s","50 s and 5 s","1,000 s and 100 s"], answer:1, why:"The pool runs 200 at a time: 10,000 / 200 = 50 waves × 0.1 s = 5 s (measured 5.1 s). Virtual threads all block concurrently and unmount from their carriers, so the whole batch takes about one sleep plus overhead (measured about 0.2 s)."},
{id:"p6q22", type:"mc", q:"A worker thread runs while (!stop) {} on a plain static boolean. Main sets stop = true, but the worker never exits. Which change is the correct fix?", options:["Call Thread.yield() in main","Declare the field volatile (or use AtomicBoolean), creating a happens-before edge from the write to the read","Make the field static","Increase the thread priority"], answer:1, why:"Without a happens-before relationship the JIT may hoist the read out of the loop and the worker never observes the write. A volatile write happens-before every later volatile read of that field."},
{id:"p6q23", type:"mc", q:"With default settings (capacity 16, load factor 0.75), what table length does a HashMap end with after one million puts of distinct keys?", options:["1,000,000","1,048,576 (2^20)","1,333,334","2,097,152 (2^21)"], answer:3, why:"It needs capacity × 0.75 ≥ 1,000,000, i.e. at least 1,333,334 buckets; the next power of two is 2^21 = 2,097,152 (2^20 holds only 786,432 entries). Getting there takes 17 resizes; HashMap.newHashMap(1_000_000) presizes and avoids them."},
{id:"p6q24", type:"mc", q:"What does this print? Stream&lt;String&gt; s = List.of(\"a\",\"b\").stream().peek(System.out::print).map(String::toUpperCase); System.out.println(\"!\");", options:["ab!","AB!","!","It throws IllegalStateException"], answer:2, why:"Intermediate operations are lazy; without a terminal operation the pipeline never runs, so only ! is printed."},
{id:"p6q25", type:"sa", q:"Four threads each increment a shared static int counter one million times, and the program prints 3,156,326 instead of 4,000,000. Explain at the bytecode and memory-model level why updates are lost, then give three correct fixes and the trade-off of each.", answer:"count++ compiles to getstatic, iconst_1, iadd, putstatic: a read, a computation and a write. Two threads can both read the same value and both write value + 1, so one increment disappears (a lost update). Nothing creates a happens-before ordering between the threads' accesses, so this is a data race and the JMM promises no particular result. Fixes: (1) synchronized block or ReentrantLock around the increment — simple and composes with other state, but threads queue on the lock; (2) AtomicInteger.incrementAndGet — lock-free CAS, good at moderate contention, but it retries under heavy contention and only covers one variable; (3) LongAdder.increment — striped cells summed on read, fastest under heavy write contention, but sum() is not an atomic snapshot and it uses more memory. (volatile alone is not a fix: it gives visibility, not atomicity.)", rubric:["Breaks count++ into read, add and write (getstatic/iadd/putstatic) and shows an interleaving that loses an update","Names it a data race with no happens-before ordering","Gives three valid fixes (lock, atomic, LongAdder or confinement/ConcurrentHashMap.merge)","States a real trade-off for each and notes that volatile alone is insufficient"]},
{id:"p6q26", type:"sa", q:"A teammate benchmarks a method by timing its first call and concludes Java is ten times slower than C. Explain how HotSpot actually executes a hot method over time, and how you would measure it properly.", answer:"HotSpot starts every method in the bytecode interpreter. After roughly 200 invocations (or a hot loop) C1 compiles it with profiling instrumentation; after roughly 5,000 C2 recompiles it using the profile — inlining, escape analysis, removing bounds checks, devirtualizing monomorphic calls. Long loops are compiled mid-run by on-stack replacement, and wrong speculations are undone by deoptimization. The first call therefore measures the interpreter (here about 17 times slower than steady state) plus class loading and JVM start-up. Measure with a warm-up phase and many iterations, guard against dead-code elimination by consuming results, and preferably use JMH, the OpenJDK benchmark harness, reporting steady-state throughput or latency percentiles.", rubric:["Describes interpreter → C1 (profiling) → C2 (optimized) tiers with approximate thresholds","Mentions at least two C2 optimizations and OSR or deoptimization","Explains why the first call is unrepresentative (interpretation, class loading, start-up)","Prescribes warm-up, result consumption and JMH"]}
],
cards:[
{id:"p6c1", front:"Bytecode", back:"Portable instructions javac produces from source; the JVM runs them (not native CPU machine code)."},
{id:"p6c2", front:"JVM", back:"Java Virtual Machine: runs bytecode, JIT-compiles hot paths to native; enables 'write once, run anywhere'."},
{id:"p6c3", front:"JDK vs JRE vs JVM", back:"JVM runs bytecode; JRE = JVM + libraries (to run); JDK = JRE + tools like javac (to develop)."},
{id:"p6c4", front:"Static typing", back:"Variable types are declared and checked at compile time; errors caught before running (vs Python's runtime)."},
{id:"p6c5", front:"Primitive vs object", back:"Primitives (int, double, boolean, char) store values directly; objects (String, arrays, your classes) are accessed by reference."},
{id:"p6c6", front:"== vs .equals()", back:"On objects, == compares references (same object); .equals() compares value. Use .equals() for Strings."},
{id:"p6c7", front:"Class vs object", back:"A class is a blueprint; an object (instance) is built with new; one class, many instances."},
{id:"p6c8", front:"Constructor", back:"Runs on new to initialize an object; same name as the class, no return type; this sets fields."},
{id:"p6c9", front:"Encapsulation", back:"Private fields + public methods that control/validate access; each object guards its own correctness."},
{id:"p6c10", front:"static", back:"Belongs to the class (one shared copy), not an instance; static methods can't use instance fields; main is static."},
{id:"p6c11", front:"Access modifiers", back:"private (class) < package-private (default) < protected (package+subclasses) < public (all). Default to private."},
{id:"p6c12", front:"Inheritance (extends)", back:"A subclass inherits a superclass's fields/methods and can @Override them; models 'is-a'; use sparingly."},
{id:"p6c13", front:"Interface (implements)", back:"A contract of method signatures a class promises; a class can implement many; program to capabilities, not concretes."},
{id:"p6c14", front:"Abstract class", back:"Partly-implemented base with shared fields/code + abstract methods subclasses must define; can't be instantiated."},
{id:"p6c15", front:"Polymorphism", back:"A supertype reference runs the actual subtype's overridden method; one code path serves many types, extensible."},
{id:"p6c16", front:"equals + hashCode", back:"Override both consistently; hash-based collections need equal objects to share a hashCode."},
{id:"p6c17", front:"toString()", back:"Object method controlling how an object prints; override for readable output."},
{id:"p6c18", front:"Generics", back:"Type parameters (List&lt;String&gt;) checked by the compiler; moved container type-errors from runtime to compile time."},
{id:"p6c19", front:"List / ArrayList", back:"Ordered, indexed, duplicates allowed; ArrayList is array-backed (O(1) index/append, O(n) search)."},
{id:"p6c20", front:"Map / HashMap", back:"Key→value pairs; HashMap gives O(1) lookup by key (uses hashCode). Java's dict."},
{id:"p6c21", front:"Set / HashSet", back:"Unique elements; HashSet gives O(1) membership. Java's set."},
{id:"p6c22", front:"Program to the interface", back:"Declare variables as List/Map/Set, instantiate ArrayList/HashMap/HashSet; swap implementations freely."},
{id:"p6c23", front:"Lambdas & streams", back:"n -> n*2 (anonymous function) + stream pipelines (filter/map/collect): Java's version of comprehensions/filter-map."},
{id:"p6c24", front:"Checked vs unchecked exceptions", back:"Checked (IOException): must catch/declare (compiler-enforced). Unchecked (RuntimeException/NPE): bugs, needn't declare."},
{id:"p6c25", front:"try/catch/finally", back:"catch handles a thrown exception; finally always runs (cleanup); try-with-resources auto-closes."},
{id:"p6c26", front:"Reference & null", back:"A variable holds a reference to a heap object; null points to nothing; using it throws NullPointerException."},
{id:"p6c27", front:"Stack vs heap", back:"Stack: method frames, locals, references. Heap: objects created with new."},
{id:"p6c28", front:"Garbage collection", back:"The JVM reclaims heap objects no longer reachable by any reference; forgotten references still leak."},
{id:"p6c29", front:"Package & import", back:"A namespace grouping classes (com.you.app), mirrored by folders; import brings in other classes."},
{id:"p6c30", front:"Maven / Gradle", back:"Build tools: manage dependencies, compile, test, and package to a jar (Java's pip/npm equivalent)."},
{id:"p6c31", front:"JUnit", back:"Java's unit-test framework: @Test methods with assertions; catches regressions, run by the build tool."},
{id:"p6c32", front:"Spring / Kotlin / Android", back:"Spring: dominant enterprise framework (DI, web, data). Kotlin: modern JVM language, interoperates with Java. Android uses both."},
{id:"p6c33", front:"Class loader", back:"Loads a class's bytes the first time it is needed; bootstrap → platform → application loaders, with parent delegation so core classes cannot be faked."},
{id:"p6c34", front:"Tiered compilation", back:"HotSpot runs a method in the interpreter, then C1 with profiling (~200 calls), then C2 optimized code (~5,000 calls); hot loops jump in via on-stack replacement."},
{id:"p6c35", front:"Deoptimization", back:"Discarding JIT-compiled code whose speculation failed (e.g. a new subclass loaded) and resuming in the interpreter, to recompile later."},
{id:"p6c36", front:"Class file version", back:"Major version = 44 + Java release (65 = Java 21, 69 = Java 25); an older JVM rejects newer class files with UnsupportedClassVersionError — compile with --release N."},
{id:"p6c37", front:"Bytecode verifier", back:"Checks before execution that bytecode keeps the operand stack and locals type-safe and never jumps out of a method — why bytecode cannot forge pointers."},
{id:"p6c38", front:"Integer overflow", back:"int/long arithmetic wraps silently (MAX_VALUE + 1 = MIN_VALUE); widen early (30L * ...) or use Math.addExact/multiplyExact to throw instead."},
{id:"p6c39", front:"Autoboxing", back:"Automatic int ↔ Integer conversion; boxed values are 16-byte objects, unboxing null throws NPE, and Integer.valueOf caches only -128..127 (so == misleads)."},
{id:"p6c40", front:"Switch expression", back:"switch with arrow labels that yields a value, never falls through, allows case 4, 5 ->, and must be exhaustive (default, all enum constants or all sealed subtypes)."},
{id:"p6c41", front:"Record", back:"A final, shallowly immutable data class: private final fields, canonical constructor, accessors, value-based equals/hashCode/toString; validate in a compact constructor."},
{id:"p6c42", front:"Immutability", back:"An object that cannot change after construction (final fields, no setters, defensive copies): thread-safe without locks and safe as a map key."},
{id:"p6c43", front:"Dynamic dispatch", back:"Choosing an overridden method at run time from the object's class via its virtual method table; the JIT inlines monomorphic call sites. Overloads are chosen at compile time."},
{id:"p6c44", front:"Sealed type", back:"A class or interface with a permits list of allowed subtypes (final, sealed or non-sealed), so the compiler can prove a pattern switch exhaustive."},
{id:"p6c45", front:"Pattern matching", back:"instanceof and switch patterns (type, record and guarded patterns) that test, cast and bind in one step; switch over a sealed type needs no default."},
{id:"p6c46", front:"Fragile base class", back:"A subclass breaks because it depends on the superclass's internal self-use (HashSet.addAll calling add); prefer composition and forwarding."},
{id:"p6c47", front:"Type erasure", back:"javac checks generic types then erases them (List&lt;String> → List) and inserts casts; no new T(), no instanceof List&lt;String>, one runtime class."},
{id:"p6c48", front:"PECS", back:"Producer extends, consumer super: read from List&lt;? extends T>, write into List&lt;? super T>."},
{id:"p6c49", front:"Load factor", back:"HashMap resizes (doubles) when size exceeds capacity × 0.75: 16 buckets hold 12 entries; bins of 8+ colliding keys become red-black trees."},
{id:"p6c50", front:"try-with-resources", back:"try (A a = ...; B b = ...) closes resources automatically in reverse order; a close() failure is attached to the main exception as suppressed."},
{id:"p6c51", front:"Generational hypothesis", back:"Most objects die young, so the heap has a young generation collected often and cheaply (cost ∝ survivors) and an old generation collected rarely."},
{id:"p6c52", front:"GC root", back:"A starting point for reachability — thread-stack locals, static fields, JNI references; anything not reachable from a root is garbage, cycles included."},
{id:"p6c53", front:"Race condition", back:"A bug whose outcome depends on thread timing, e.g. count++ (read, add, write) losing updates, or check-then-act on a shared map."},
{id:"p6c54", front:"Happens-before", back:"The Java Memory Model's visibility guarantee: unlock→lock, volatile write→read, start, join, executor submit and Future.get create edges; without one there is a data race."},
{id:"p6c55", front:"volatile", back:"Field modifier giving visibility and ordering (a write happens-before later reads) but not atomicity: volatile count++ still races."},
{id:"p6c56", front:"Virtual thread", back:"A JVM-managed Thread (Java 21) mounted on a few carrier threads and unmounted while blocked: cheap enough for one per task; helps I/O-bound work, not CPU-bound."},
{id:"p6c57", front:"Executor", back:"ExecutorService runs submitted Runnable/Callable tasks on managed threads and returns Futures; AutoCloseable since Java 19; newVirtualThreadPerTaskExecutor for blocking work."},
{id:"p6c58", front:"Deadlock", back:"Threads each holding a lock the other needs (circular wait); jcmd &lt;pid> Thread.print reports it; prevent with one global lock order or tryLock timeouts."},
{id:"p6c59", front:"Little's Law", back:"Requests in flight = throughput × latency (L = λW): 2,000 req/s × 0.1 s = 200 concurrent requests — the thread count a blocking server needs."},
{id:"p6c60", front:"Functional interface", back:"An interface with one abstract method (Predicate, Function, Consumer, Supplier); the target type a lambda or method reference is converted to."},
{id:"p6c61", front:"Method reference", back:"Shorthand lambda: static (Integer::parseInt), bound (System.out::println), unbound (String::length) or constructor (ArrayList::new)."},
{id:"p6c62", front:"Stream pipeline", back:"Source → lazy intermediate ops (filter, map, sorted) → one terminal op (toList, collect, findFirst) that runs it; one-shot, short-circuits when it can."},
{id:"p6c63", front:"jlink", back:"Builds a custom runtime image containing only the modules an app needs (39 MB vs a 286 MB JDK in this domain's example)."},
{id:"p6c64", front:"Build lifecycle", back:"Maven's fixed phases validate → compile → test → package → verify → install → deploy; running a phase runs all earlier ones."}
]
});
