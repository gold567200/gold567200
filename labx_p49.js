/* Lab guides — Domain 49: C++ and Rust: Modern Systems Programming */
window.LABX=window.LABX||{};
Object.assign(window.LABX,{
  "p49lab1":{
    time:"2–3 h",
    setup:[
      "A Linux machine, VM or WSL2 you own; Ubuntu 24.04 is assumed. Install the toolchain with: sudo apt install build-essential g++-14 clang lldb gdb cmake ninja-build valgrind strace binutils.",
      "If apt cannot find g++-14, enable the universe repository (sudo add-apt-repository universe && sudo apt update) or use the default g++ (13) — everything in this lab works with -std=c++20 on GCC 13 or newer.",
      "Have Domain 15 handy: you will compare against a C file reader that uses goto cleanup, and read disassembly with objdump as in Domain 15 Lab 2.",
      "Work in a fresh directory such as ~/p49/lab1 under Git so you can diff the C and C++ versions."
    ],
    checkpoints:[
      "g++-14 --version, clang++ --version and cmake --version print versions, and a hello world builds with -std=c++20 -Wall -Wextra -Wpedantic under both compilers with zero warnings.",
      "strace -e trace=openat,close ./report shows the openat of your file followed by its close even though the report function threw and main caught the exception; the C version needed more exit paths and lines for the same behavior.",
      "sizeof(Link) prints 16 and the virtual version prints 24; objdump -d -C -M intel shows a load of the vtable pointer from the object and an indirect call such as call QWORD PTR [rax] in the function that calls through Base&.",
      "nm lists _Z4areaii, _Z4aread and _ZN3geo4areaEd plus an unmangled C symbol; nm -C shows the readable signatures; linking a C caller without extern \"C\" fails with an 'undefined reference to `area'' style error that disappears after adding extern \"C\".",
      "You have a table of preprocessed line counts (about 43,000 for <iostream> with GCC 13), a build-time comparison for 50 translation units with and without a precompiled header or ccache, and a program whose output proves the linker silently kept one of two different inline definitions."
    ],
    hints:[
      "Every step is about seeing what the compiler generates for you. Before you open a tool, predict the output: which symbol name, which size, which system calls. Then check the prediction.",
      "The tools are strace for what the program asks the kernel, objdump -d -C -M intel for code, nm and c++filt for symbols, and g++ -E | wc -l for header cost. To stop the optimizer devirtualizing your call, call through a Base& parameter in a function defined in a different .cpp file, or mark the caller __attribute__((noinline)).",
      "For the ODR experiment, put inline int version() { return 1; } in a.cpp and inline int version() { return 2; } in b.cpp, call each from a function in its own file, and print both: both calls return the same value, chosen by link order. Swap the order of a.o and b.o on the link line and watch it change."
    ],
    trouble:[
      ["strace shows no close after the exception", "The exception was not caught, so std::terminate ran; whether the stack unwinds for an uncaught exception is implementation-defined", "Wrap the call in try/catch in main so the exception is caught and the stack unwinds, then rerun strace"],
      ["objdump shows a direct call to Link::loss, not an indirect one", "The compiler knew the dynamic type and devirtualized the call at -O2", "Call through a Base& in a function compiled in another translation unit, or add noinline, and look again; this is the optimization working, not a bug"],
      ["undefined reference to `area' when linking the C program", "The C file looks for the plain symbol area, but the C++ compiler emitted the mangled _Z4areaii", "Declare the function extern \"C\" in the C++ file, using #ifdef __cplusplus guards in a header shared by both languages"],
      ["The ODR experiment fails with 'multiple definition of `version()''", "The functions were not declared inline, so the linker treats two strong definitions as an error", "Mark both definitions inline; the loud error then becomes the silent violation the lab is demonstrating"],
      ["E: Unable to locate package g++-14", "The universe repository is not enabled or the package lists are stale", "Run sudo add-apt-repository universe and sudo apt update; check first which compilers you already have with ls /usr/bin/g++*"]
    ],
    challenge:"Write an RAII wrapper for a POSIX file descriptor (open/close) with deleted copy operations and working move operations, put several of them in a std::vector, force reallocations, and prove with strace that every descriptor is closed exactly once and none twice. Then make the move constructor forget to set the source to -1 and find the resulting double close with strace before reading Module 3.",
    reflect:[
      "Why can the compiler guarantee that a destructor runs on every exit path, while C's goto cleanup depends on the programmer remembering every path? What exactly does the compiler insert?",
      "Mangling lets overloads coexist, but it also makes C++ libraries hard to share between compilers. What does extern \"C\" give up to make interop possible?",
      "Why is an ODR violation between two inline functions silent, when a duplicate non-inline function is a link error? What would detect it?"
    ]
  },
  "p49lab2":{
    time:"2–3 h",
    setup:[
      "The Lab 1 toolchain (g++ 13 or 14 and clang++ 18 or newer). Close heavy applications and, on a laptop, plug in to power so frequency scaling does not distort timings.",
      "Python 3 or a spreadsheet for the results table and a simple bar chart.",
      "Read Module 2's container table first and write down your predicted ranking for each experiment before you run it.",
      "Create ~/p49/lab2 with one benchmark .cpp per experiment and a small shared header holding a timing helper that returns the median of five runs."
    ],
    checkpoints:[
      "Your harness prints the median of five timed runs using std::chrono::steady_clock, built with -O2, with a fixed random seed, and every benchmark prints a checksum of its result so nothing is optimized away.",
      "You have times for qsort, std::sort, std::ranges::sort and std::stable_sort on 10 million random ints under both g++ and clang++, with std::sort roughly twice as fast as qsort and an estimate of comparisons per second from n log2 n ≈ 2.3 × 10^8.",
      "Summing 10 million ints shows vector fastest, deque close and list several times slower; the reallocation counter shows 21 allocations for 1,000,000 push_backs without reserve and 1 with reserve(1000000).",
      "A table shows 1,000,000 lookups in map, unordered_map (with and without reserve) and a sorted vector with lower_bound, with map clearly slowest and an explanation that mentions tree depth (about 20) and cache misses.",
      "You saved the GCC and Clang diagnostics for the HasLoss concept failure, and both -D_GLIBCXX_DEBUG and -fsanitize=address stop the push_back-while-iterating loop with a report naming the invalid iterator or the freed memory."
    ],
    hints:[
      "Think about memory, not just Big-O. For each experiment, ask how many cache lines the data occupies and whether the next element's address is predictable.",
      "The constant factors come from three places: function-pointer calls that cannot be inlined (qsort's comparator), pointer chasing between scattered nodes (list, map), and hashing versus about 20 dependent comparisons per lookup (unordered_map versus map). reserve removes reallocation and rehashing.",
      "For the reallocation count, record capacity() before each push_back and increment a counter whenever it changes. For the concept, write template <HasLoss T> double total_loss(const std::vector<T>&) and call it with std::vector<int>; read the 'does not satisfy' line."
    ],
    trouble:[
      ["A benchmark reports 0 ms or impossibly fast times", "Dead-code elimination: the result was never used, so the optimizer deleted the work", "Print a checksum of the result, or write it to a volatile sink; verify with objdump that the loop still exists"],
      ["Times vary by 30% or more between runs", "Frequency scaling, background processes or a noisy VM", "Report the median of five or more runs after a warm-up run, close other programs, and optionally pin the process with taskset -c 2"],
      ["std::sort on list iterators fails with errors mentioning operator- or random_access_iterator", "std::sort requires random-access iterators and list iterators are bidirectional", "Use lst.sort(), or copy into a vector, sort it and copy back; note the error as evidence for the iterator-category figure"],
      ["Link errors or crashes after adding -D_GLIBCXX_DEBUG to one file", "Debug-mode containers have a different layout, so mixing objects built with and without the flag breaks the ABI", "Rebuild every translation unit with the same flag (make clean, or a fresh CMake build directory)"]
    ],
    challenge:"Replace the std::map index with std::flat_map (C++23, if your standard library provides it) or with a sorted vector of pairs, and measure lookups, insertions and memory use (maximum RSS from /usr/bin/time -v) for 1,000, 100,000 and 10,000,000 keys. Find the size at which each structure wins and explain the crossover with cache sizes from Domain 38.",
    reflect:[
      "vector and list are both O(n) to sum, yet one was about nine times slower. Which hardware mechanism explains the gap, and what would happen to it if each list node were allocated in sequence from a pool?",
      "Why does std::sort beat qsort when both are O(n log n)? What does that tell you about the cost of function pointers and void* interfaces in C?",
      "When would you still choose std::map over std::unordered_map despite the measured lookup times?"
    ]
  },
  "p49lab3":{
    time:"About 3 h",
    setup:[
      "The Lab 1 toolchain with sanitizer runtimes; check with g++ -fsanitize=address,undefined -x c++ - <<< 'int main(){}' && ./a.out that sanitizer builds link and run.",
      "Six small source files in ~/p49/lab3: buffer.cpp for the rule of five and one file per planted bug, so each sanitizer report is unambiguous.",
      "Build every bug program with -g -O1 -fno-omit-frame-pointer -fsanitize=address,undefined so stack traces show file and line numbers.",
      "Keep a text file of each raw report before you fix anything; the annotated reports are part of the deliverable."
    ],
    checkpoints:[
      "Your Buffer trace table shows which special member ran for each of the four operations (for example, push_back of a temporary prints the move constructor), and copying a 10-million-int vector takes tens of milliseconds while moving it takes well under a microsecond.",
      "With a noexcept move constructor the reallocation log shows only moves; without noexcept the same growth shows copies, and you can state that the vector is preserving its strong exception guarantee.",
      "You have five saved reports: heap-use-after-free for the reference kept across push_back, a stack-use-after-return or garbage output for the string_view (plus Clang's -Wreturn-stack-address warning), attempting double-free for the two unique_ptrs, LeakSanitizer's detected memory leaks for the shared_ptr cycle, and UBSan's signed integer overflow message.",
      "Each of the five programs now runs with zero sanitizer reports after an ownership fix: an index instead of a reference, a returned std::string, a single make_unique owner, a weak_ptr back edge, and a wider or checked integer type.",
      "With -D_GLIBCXX_ASSERTIONS an out-of-bounds operator[] aborts with an assertion naming __n < this->size(), and your overhead table lists run time and maximum RSS for plain, ASan and UBSan builds."
    ],
    hints:[
      "Each bug is about who owns memory and how long they hold it. Before you run the sanitizer, write one sentence naming the owner, the borrower and the moment the owner lets go.",
      "AddressSanitizer reports read bottom-up: the 'previously allocated' stack, then the 'freed by' stack, then the bad access. The string_view bug may need ASAN_OPTIONS=detect_stack_use_after_return=1 to report as stack-use-after-return instead of just printing garbage.",
      "For the noexcept experiment, add static counters to the copy and move constructors and print them after the vector has grown from 1 to 1,000 elements; then delete noexcept and run again. std::move on a const object silently selects the copy constructor."
    ],
    trouble:[
      ["The program prints a plausible number and ASan says nothing", "The binary was not linked with -fsanitize=address, the bug path did not execute, or the optimizer removed the read", "Compile and link with the same -fsanitize flags, use -O0 or -O1 -g, and confirm the bad line actually runs by printing before it"],
      ["AddressSanitizer:DEADLYSIGNAL repeated in a loop, or a shadow-memory mapping error at startup", "Newer kernels use more address-space randomization (vm.mmap_rnd_bits) than some older sanitizer runtimes expect", "Update the compiler, or temporarily run sudo sysctl vm.mmap_rnd_bits=28 (or run the program under setarch $(uname -m) -R) on your own lab machine"],
      ["The copy constructor runs where you expected a move", "The source is const (std::move of a const object yields const T&&), the move constructor is not noexcept during vector growth, or the compiler elided the operation entirely", "Check const-ness, add noexcept, and remember that guaranteed copy elision means a factory return may print neither"],
      ["LeakSanitizer prints 'LeakSanitizer does not work under ptrace'", "You ran the program inside gdb or strace, which uses ptrace", "Run the binary directly for leak checks, and use the debugger separately with ASAN_OPTIONS=detect_leaks=0"]
    ],
    challenge:"Write a minimal unique_ptr-like class template, Owner<T>, with a destructor, deleted copy, and noexcept move operations, then plant a bug in it (forget to null the source in the move constructor). Write a test that catches the double delete with ASan, fix it, and compare sizeof(Owner<int>) and the generated -O2 assembly for dereferencing it against std::unique_ptr<int> to show the abstraction costs nothing.",
    reflect:[
      "Which of the five bugs would AddressSanitizer miss if your tests never executed the faulty path, and what does that imply about sanitizer coverage compared with a compile-time check?",
      "Why does std::vector refuse to use a move constructor that is not noexcept during reallocation? Describe the failure it is protecting you from.",
      "For each of the five fixes, say whether it changed ownership or merely lifetime, and which one you would expect Rust's compiler to force on you."
    ]
  },
  "p49lab4":{
    time:"Two sessions of 2–3 h",
    setup:[
      "The Lab 1 toolchain plus GoogleTest (sudo apt install libgtest-dev, which provides CMake config files on Ubuntu 24.04) or network access for CMake FetchContent, and clang-tidy and clang-format (sudo apt install clang-tidy clang-format).",
      "A GitHub account and an empty repository for the project; public repositories get free GitHub Actions minutes, so the CI step costs nothing.",
      "A machine with at least 4 hardware threads makes the scaling measurements meaningful; record nproc in your notes.",
      "Separate build directories per configuration (build/debug, build/asan, build/tsan, build/release), because AddressSanitizer and ThreadSanitizer cannot share a build."
    ],
    checkpoints:[
      "cmake --preset asan followed by cmake --build --preset asan and ctest --preset asan (or ctest --test-dir build/asan) builds the library, app and tests and reports all tests passed; compile_commands.json exists in the build directory.",
      "The shared-double version produces a ThreadSanitizer 'data race' report naming your total variable and both threads; the scoped_lock version is TSan-clean but slower than one thread; the per-thread-partials version is TSan-clean and your timing table for 1, 2, 4 and all threads is compared with Amdahl's law.",
      "10 million items pass through the bounded queue under the TSan preset with no reports, the consumer always sees the payload published before the release store, and the count of items received equals the count sent.",
      "The deliberately deadlocked program shows, under thread apply all bt (gdb) or bt all (lldb), two threads blocked in mutex lock calls each holding the other's mutex; after switching to one std::scoped_lock(a, b) it completes. A core file of the null-dereference crash opens in gdb with bt pointing at the faulting source line.",
      "clang-tidy runs against compile_commands.json with the bugprone-*, modernize-* and cppcoreguidelines-* checks and you fixed or justified every finding, and the GitHub Actions workflow builds every preset and runs the tests green on push."
    ],
    hints:[
      "Build the skeleton first and make one trivial test pass in every preset before writing any threads; most CMake pain is easier to fix with ten lines of code than with five hundred.",
      "PUBLIC versus PRIVATE in target_* commands decides what consumers inherit. For the parallel sum, the fastest correct version does no synchronization inside the loop: each thread writes its partial result once, and std::jthread joins in its destructor before main reads the partials.",
      "For the deadlock, have thread 1 lock a then b and thread 2 lock b then a, with a short sleep between the two locks so the interleaving is reliable. Attach with gdb -p $(pidof deadlock), run thread apply all bt, then detach. For core files on Ubuntu, coredumpctl list and coredumpctl gdb are usually simpler than ulimit -c."
    ],
    trouble:[
      ["Could NOT find GTest (missing: GTEST_LIBRARY GTEST_INCLUDE_DIR ...)", "GoogleTest is not installed, or CMake cached an earlier failed search", "Install libgtest-dev or switch to FetchContent, then delete the build directory (or CMakeCache.txt) and configure again"],
      ["FATAL: ThreadSanitizer: unexpected memory mapping", "The kernel's address-space randomization entropy is higher than the TSan runtime expects", "Run the test under setarch $(uname -m) -R, or temporarily set sudo sysctl vm.mmap_rnd_bits=28 on your own lab machine, or upgrade the compiler"],
      ["ptrace: Operation not permitted when running gdb -p", "Yama's ptrace_scope=1 only allows debugging your own child processes", "Run sudo gdb -p PID on your own process, or temporarily echo 0 | sudo tee /proc/sys/kernel/yama/ptrace_scope and restore it to 1 afterwards"],
      ["The parallel version is slower than the serial one", "Lock contention or false sharing: threads take turns on one mutex or write adjacent values in the same 64-byte cache line inside the loop", "Diagnose before fixing: run perf stat or compare 1-thread and 2-thread times; then move synchronization out of the loop and pad per-thread slots with alignas(64)"],
      ["The compiler reports that -fsanitize=address and -fsanitize=thread are incompatible", "Both sanitizers were enabled in one configuration", "Keep ASan+UBSan and TSan in separate presets and separate build directories"]
    ],
    challenge:"Replace the per-thread partials with C++17 parallel algorithms (std::reduce with std::execution::par, linking TBB if libstdc++ requires it) and, separately, with a small thread pool you write using a mutex, a condition variable and std::jthread stop tokens. Compare correctness under TSan, run time and lines of code for the three designs, and decide which you would put in production.",
    reflect:[
      "Why did the mutex version get slower as you added threads? Use Amdahl's law and the cost of a contended lock to explain the curve.",
      "The release/acquire pair made the payload visible to the consumer. What could go wrong on an ARM machine if both operations were relaxed, even if the program seemed to work on your x86 PC?",
      "Which bugs did the CI pipeline catch that a single local build would not, and which still depend on test coverage?"
    ]
  },
  "p49lab5":{
    time:"Two sessions of about 3 h",
    setup:[
      "Install Rust from the official installer: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh, then restart the shell. Rust needs a C linker, so keep build-essential from Lab 1 installed. Run rustup update so stable is 1.85 or newer (required for edition 2024).",
      "Add the tools: rustup component add clippy rustfmt, and for the unsafe step rustup toolchain install nightly and rustup +nightly component add miri. Install hyperfine (sudo apt install hyperfine) for timing.",
      "Create the crate with cargo new fibertool and confirm edition = \"2024\" in Cargo.toml. Use the same synthetic OTDR data generator you used in Lab 4 so the C++ and Rust results are comparable.",
      "Keep the Lab 4 C++ release build available for the final size and speed comparison."
    ],
    checkpoints:[
      "rustc --version and cargo --version print 1.85 or newer, cargo run prints the default hello message, and Cargo.toml shows edition 2024.",
      "You have eight saved rustc outputs — E0382, E0499, E0502, E0597, E0106, E0515, E0373 and E0277 — each with a one-line note of the C or C++ bug it prevents and two different fixes that compile.",
      "A CSV with a bad line makes your parser return Err(Parse { line: N, ... }) and a missing file returns an Io error; cargo fmt --check, cargo clippy -- -D warnings and cargo test (unit and doc tests) all pass.",
      "The std::thread::scope version and the Arc<Mutex<HashMap>> version produce identical counts on the 4-million-line log, a cargo test compares them with the single-threaded count, and your release-build timing table shows which is faster and why.",
      "cargo run prints the value computed by the C function through unsafe extern \"C\" (for example 4.80 dB for 12 km and 6 splices), a C main calls your #[unsafe(no_mangle)] Rust function successfully, cargo +nightly miri test passes on the safe wrapper, and hyperfine and ls -l compare run time and binary size with the Lab 4 C++ build."
    ],
    hints:[
      "Read every borrow-checker error from the bottom label up: 'later used here' tells you which use keeps the borrow alive, and the first label tells you where it started. Most fixes either end the borrow earlier, use an index, or clone deliberately.",
      "Model the trace as enum Event with data per variant, implement From<std::io::Error> and From<ParseFloatError> (or map_err with the line number) for your error type, and let ? do the propagation. For threads, std::thread::scope lets each thread borrow a slice of the input without Arc or 'static.",
      "For the FFI, add cc = \"1\" under [build-dependencies] and the build.rs body is one line: cc::Build::new().file(\"csrc/loss.c\").compile(\"loss\"); then declare the function inside unsafe extern \"C\" { ... } and wrap the call in a safe function with a // SAFETY: comment explaining why the arguments are valid."
    ],
    trouble:[
      ["error: linker `cc` not found", "Rust uses the system C toolchain to link and none is installed", "Install build-essential (sudo apt install build-essential) and rebuild"],
      ["feature `edition2024` is required, or the 2024 edition is reported as unstable", "The installed stable toolchain is older than 1.85", "Run rustup update stable and check rustc --version again"],
      ["undefined symbol span_loss_db (rust-lld) or undefined reference to `span_loss_db' at link time", "build.rs did not compile the C file or did not tell cargo to link the library", "Check that build.rs runs (add println!(\"cargo:warning=building C\")), that the cc build call names the right file, and that the function name and signature match the C source exactly"],
      ["error: no such command: `miri`, or the miri component is missing", "Miri is only distributed for the nightly toolchain", "Run rustup toolchain install nightly and rustup +nightly component add miri, then invoke it as cargo +nightly miri test"],
      ["E0277: Rc<...> cannot be sent between threads safely, even inside thread::scope", "Scoped threads still require Send for values moved into them, and Rc's non-atomic count is not Send", "Share data by & reference to Sync types inside the scope, or switch Rc to Arc when shared ownership is really needed"]
    ],
    challenge:"Expose your Rust trace parser to C++ through the C ABI: a function that takes a pointer and length to the CSV bytes and returns an opaque handle, a function that reads the event count and total loss from the handle, and a function that frees it. Call it from the Lab 4 C++ program, run the C++ side under ASan and the Rust side under Miri, and document the ownership rule for every pointer that crosses the boundary.",
    reflect:[
      "Pick two of the eight borrow-checker errors and describe the run-time failure each would have caused in C++, and whether AddressSanitizer or ThreadSanitizer would have caught it in Lab 3 or Lab 4.",
      "The Arc<Mutex<HashMap>> version was correct but probably slower than the scoped per-thread maps. What does that say about the difference between memory safety and performance-aware design?",
      "Your Rust binary is likely larger than the C++ one. Explain where the bytes come from and when that trade-off matters, for example on the embedded boards of Domain 23."
    ]
  }
});
