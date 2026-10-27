/* Lab guides — Domain 50: TypeScript, Functional Programming, Design Patterns & Shell Scripting */
window.LABX=window.LABX||{};
Object.assign(window.LABX,{
  "p50lab1":{
    time:"2–3 h",
    setup:[
      "Node.js 24 or 26 LTS from nodejs.org (or installed with fnm or nvm). Check with node --version; anything older than 22.18 cannot run .ts files without a flag.",
      "A new folder and project: mkdir ts-lab && cd ts-lab && npm init -y && npm pkg set type=module && npm install -D typescript @types/node. npx tsc --version should print 7.x (6.x also works for every step except the speed comparison).",
      "VS Code (or any editor with the TypeScript language server) so you can hover over values and see inferred types, plus Git: git init and a first commit before step 2.",
      "The Module 2 tsconfig.json with include [\"src\"] and noEmit true, and an empty src/ folder. Keep a README.md open for the prediction table you will fill in."
    ],
    checkpoints:[
      "node --version prints v24.x or v26.x and npx tsc --version prints Version 7.x; after you create src/hello.ts containing console.log(\"ok\"), node src/hello.ts prints ok and npx tsc --noEmit exits with no output and status 0 (echo $? prints 0).",
      "Your README table has five rows with a prediction and an actual verdict each; the fresh-literal row shows TS2353, the Meters-as-Feet row shows TS2345, and the missing-property row shows TS2741.",
      "node src/shapes.ts prints 3.1416, 12 and 6 on three lines; after adding the hex variant, tsc reports TS2322 \"... is not assignable to type 'never'\" at the line of the never assignment; isReel(JSON.parse(...)) narrows without any cast.",
      "npx tsc --noEmit exits 0 with every // @ts-expect-error line still producing an error underneath (remove one deliberately and confirm tsc now reports TS2578 \"Unused '@ts-expect-error' directive\").",
      "node prints SyntaxError [ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX] for the enum file, tsc prints two TS1294 errors, the rewritten file runs, and your diff of src against dist lists every annotation and type-only import that vanished."
    ],
    hints:[
      "Before each experiment, write down which set the value belongs to and which set the target type describes. Assignability is just 'is this set inside that one?', with one extra rule for fresh object literals.",
      "For the type tests, put the failing calls on their own lines directly under // @ts-expect-error. The directive applies only to the next line, and tsc complains if that line has no error, so the file proves both what must fail and what must pass.",
      "For erasure, compare three outputs side by side: node's error, tsc's TS1294 list, and npx tsc --noEmit false --outDir dist followed by diff -r src dist. An as-const object plus type Status = (typeof Status)[keyof typeof Status] keeps both the values and the union."
    ],
    trouble:[
      ["node src/shapes.ts fails with ERR_UNKNOWN_FILE_EXTENSION \".ts\"","Your Node.js is older than 22.18 (or 23.6), where type stripping is not on by default","Upgrade to Node 24 or 26 LTS. Always run node --version first when Node behaves differently from the lecture; most 'it works for others' problems are version problems."],
      ["tsc reports \"Cannot find name 'console'\" or \"Cannot find name 'process'\"","TypeScript 7 defaults types to [], so @types/node is installed but not loaded","Add \"types\": [\"node\"] to compilerOptions and confirm @types/node is in devDependencies."],
      ["tsc prints error TS18003: No inputs were found in config file","The include paths match no .ts files yet (an empty src/ folder, or files saved outside it)","Create at least one .ts file inside src/ and run tsc from the folder that holds tsconfig.json."],
      ["Running npx tsc src/shapes.ts ignores your tsconfig, or errors that a tsconfig.json is present","Passing file names on the command line bypasses tsconfig.json, which TypeScript 7 treats as an error","Run npx tsc --noEmit (or npx tsc -p .) with no file names and control the file list with include."],
      ["An import fails at run time with ERR_MODULE_NOT_FOUND for './reel'","Node requires real file extensions in ESM imports, and type stripping does not rewrite them","Import './reel.ts' and enable rewriteRelativeImportExtensions (or allowImportingTsExtensions with noEmit) so tsc accepts the extension."]
    ],
    challenge:"Write a typed groupBy that returns Partial<Record<K, T[]>> when keys are arbitrary strings but Record<K, T[]> when K is a finite union, using a conditional type, and prove both behaviors with @ts-expect-error tests. Then install @typescript/typescript6 beside TypeScript 7, run tsc6 --noEmit and tsc --noEmit on the same project with time three times each, and report the speed-up and any diagnostic that differs.",
    reflect:[
      "Which of your five assignability predictions were wrong, and what does each mistake reveal about the difference between structural and nominal typing?",
      "Why can the TypeScript team make Node.js run .ts files by deleting types, yet refuse to support enum the same way? What would supporting it require?",
      "noUncheckedIndexedAccess makes code noisier. In which kinds of code would you turn it on, and where would you accept the soundness hole?"
    ]
  },
  "p50lab2":{
    time:"3–4 h, or two sessions",
    setup:[
      "The Lab 1 toolchain (Node 24 or 26, TypeScript 7, @types/node) in a fresh project folder with type set to module, the Module 2 tsconfig.json, and Git initialized.",
      "curl for manual checks (preinstalled on Linux, macOS and Windows 10+). npm install zod later in step 3 gives Zod 4; import it as import * as z from \"zod\".",
      "Two terminal tabs: one for the server (node src/server.ts) and one for the client and tests. Bind the server to 127.0.0.1 only, never 0.0.0.0, so it is not reachable from your network.",
      "A legacy.js script for step 5: write 40–80 lines of plain JavaScript yourself that fetches /reels and prints a per-crew report, with no types and at least one real bug."
    ],
    checkpoints:[
      "curl -s http://127.0.0.1:8787/reels prints JSON with numeric startFt and endFt; curl -s 'http://127.0.0.1:8787/reels?broken=1' shows the same fields as quoted strings and one record without installedAt.",
      "node src/client.ts prints a number for feetLeftUnsafe in good mode (13355 with the Module 2 data) and a long concatenated string in broken mode, with no exception and no compiler error.",
      "feetLeft returns { ok: true, value: 13355 } in good mode and ok: false in broken mode, and the z.prettifyError report names each bad path, for example \"→ at [0].endFt\".",
      "npm test runs node --test and reports pass 3, fail 0 (good total, broken rejection, timeout); npm run check runs tsc --noEmit and prints nothing.",
      "Your burn-down table has at least four rows (@ts-check, rename to .ts, noUncheckedIndexedAccess, exactOptionalPropertyTypes) with error counts that end at 0, and names the real bug the checker found."
    ],
    hints:[
      "Keep the server boring: one createServer callback, parse req.url with new URL(req.url ?? '/', 'http://localhost'), and choose the body with url.searchParams.has('broken'). The interesting work is all in the client.",
      "Give getJson the return type Promise<unknown>. Then the compiler refuses to let you touch the data until you either cast it (the unsafe version) or parse it (the safe one), which makes the difference between the two versions visible in the code.",
      "For tests, call server.listen(0) and read server.address().port so tests never collide on 8787, close the server in an after() hook, and test the timeout with a route that never calls res.end() plus AbortSignal.timeout(200)."
    ],
    trouble:[
      ["Error: listen EADDRINUSE: address already in use 127.0.0.1:8787","An earlier server process is still running in another tab or in the background","Find it with lsof -i :8787 (or ss -ltnp | grep 8787 on Linux) and stop it; in tests use listen(0) for a random free port."],
      ["TypeError: fetch failed with cause ECONNREFUSED","The server is not running, or it listens on a different host or port than the client uses","Check the server tab first, then curl the exact URL the client uses. Diagnose from the outside in: process running, port listening, URL correct, then code."],
      ["The test run hangs and never prints a summary","The HTTP server (or a pending timer) keeps the event loop alive after the tests finish","Close the server in after(() => server.close()), and make sure the never-responding route's request is aborted by the timeout."],
      ["tsc reports TS2307 Cannot find module 'zod' or its type declarations","zod is not installed in this project, or tsc runs from a different folder than package.json","Run npm install zod in the project root and run tsc from that same folder; zod ships its own types, so no @types package is needed."]
    ],
    challenge:"Add a POST /reels/:id/install endpoint that accepts { feet: number } validated by a Zod schema and returns 400 with the prettified error for bad input. Then make the client generic: getParsed<T>(url, schema: z.ZodType<T>): Promise<Result<T, string>>, and use it for two endpoints so that a schema change is a single edit. Finish by deliberately changing the server's field name from endFt to end_ft and confirming that exactly one test fails with a readable message.",
    reflect:[
      "The unsafe client compiled cleanly and produced a wrong number without an exception. Which other places in a real system (files, environment variables, queues) would behave the same way, and where would you put the schema for each?",
      "Why is deriving the static type from the schema (z.infer) safer than writing an interface and a schema separately? What failure does it make impossible?",
      "During the migration, which strictness flag found the most real bugs, and which mostly produced noise? What does that tell you about the order in which to enable them?"
    ],
    safety:"Bind the practice server to 127.0.0.1 only and stop it when you finish. Do not point the client at real company or customer APIs or data; use the synthetic reels you created."
  },
  "p50lab3":{
    time:"3–4 h, plus 1 h for the Haskell part",
    setup:[
      "The Lab 1 TypeScript toolchain, plus npm install -D fast-check for property-based tests.",
      "Python 3.12 or newer from python.org or your package manager. Create a virtual environment with python3 -m venv .venv, activate it (source .venv/bin/activate, or .venv\\Scripts\\activate on Windows) and pip install hypothesis pytest.",
      "GHCup for the Haskell step: follow the one-line installer on haskell.org/ghcup (on Windows, run it inside WSL2 for the smoothest experience), accept the recommended GHC, then confirm with ghc --version and ghci.",
      "A hand-written reels.csv with 20 lines in the form id,crew,status,startFt,endFt, including three malformed lines (a non-number, a missing field, an end greater than the start)."
    ],
    checkpoints:[
      "node src/reels.ts prints per-crew totals for the 17 valid lines and lists exactly the three rejects with their reasons; grep -n 'push\\|sort(' src/reels.ts finds no mutation of inputs (toSorted only).",
      "python3 reels.py prints the same per-crew totals as the TypeScript version, and assigning to a field of a Reel raises FrozenInstanceError.",
      "Your fast-check tests (run with node --test) and pytest both report all three properties passing over at least 100 generated cases each, or you have recorded the shrunk counterexample and fixed the bug it revealed.",
      "Your table shows eager versus lazy peak memory and time in both languages for 1,000,000 records; the lazy versions use memory in kilobytes, not tens of megabytes, and give the same total.",
      "runghc shapes.hs prints 3.141592653589793, 12.0, 6.0, (Just 805,Nothing), [64,81,100] and 5630; ghc -Wall on the edited file prints a non-exhaustive pattern warning naming the missing constructor."
    ],
    hints:[
      "Start from the output you want: write the tests for parseLine and totalByCrew first, with three or four hand-picked lines each, then write the functions until they pass. Pure functions make that order natural.",
      "For property tests, generate valid reels (fc.record / hypothesis.strategies.builds) with endFt drawn between 0 and startFt, and write a formatLine function; the round-trip property parse(format(r)) equals r catches surprisingly many parsing bugs.",
      "For memory, measure peak, not final, usage: in Node read process.memoryUsage().heapUsed in a loop or run with --expose-gc and call gc() before measuring; in Python wrap each version in tracemalloc.start() and read get_traced_memory()[1]."
    ],
    trouble:[
      ["Python totals differ from TypeScript totals by a few hundred feet","itertools.groupby only groups adjacent items, so unsorted input produces several groups per crew","Sort by the same key first (sorted(reels, key=crew)) or use a dict accumulation; compare the group counts in both languages to find the mismatch."],
      ["ModuleNotFoundError: No module named 'hypothesis'","The virtual environment is not active in this terminal, or pip installed into a different Python","Activate .venv again and check which python3 points inside .venv; then pip install hypothesis there."],
      ["The lazy TypeScript version throws TypeError: ...map is not a function","Iterator helpers need Node 22 or newer, or the value is an array or plain object rather than an iterator","Check node --version, and call the helpers on a generator object (gen().map(...)), or wrap an array with Iterator.from(arr)."],
      ["ghc: command not found after installing GHCup","The GHCup environment file was not sourced, so ~/.ghcup/bin is not on PATH","Open a new terminal or source ~/.ghcup/env, then run ghc --version again."]
    ],
    challenge:"Make the TypeScript pipeline fully lazy over a 10-million-line file read with node:readline (an async iterator), compute the per-crew totals in one pass with constant memory, and compare its peak memory with an fs.readFileSync plus split version. Then write the same streaming job in Haskell using lines and foldl', and explain why foldl' rather than foldl matters for memory.",
    reflect:[
      "Which idea felt most natural in TypeScript, which in Python, and which only made sense once you saw it in Haskell? Why do the languages differ there?",
      "Property-based tests found (or failed to find) a counterexample. What kind of bug are they good at catching that hand-picked examples miss?",
      "Laziness saved memory in step 4. Describe one situation where laziness would make a bug harder to find, and how you would guard against it."
    ]
  },
  "p50lab4":{
    time:"two sessions of 2–3 h",
    setup:[
      "The Lab 1 toolchain in a new Git repository, with tsconfig.json from Module 2 and npm scripts check (tsc --noEmit) and test (node --test with your test file list).",
      "A synthetic reels.json with 6–10 reels (id, crew, feetLeft) and three sample install commands; no real job or customer data.",
      "Discipline for the whole lab: commit after every step with a message naming the pattern or refactoring, and run npm test before each commit, so the Git history becomes your evidence.",
      "Optional: Mermaid (in VS Code's Markdown preview or mermaid.live) for the dependency diagram, or pen and paper photographed."
    ],
    checkpoints:[
      "reel-tracker.ts runs with the three sample commands, and the characterization tests compare its output to saved expected files and pass; git log shows the original script committed before any refactoring.",
      "The Format union has three members and adding a fourth without an exporter is a compile error; emitting reelLow with a missing field is a compile error; undo restores the previous feetLeft; withRetry succeeds on the third attempt of the flaky notifier. Characterization tests are still green.",
      "src/domain contains install() and the port interfaces with no imports from adapters, node:fs or node:http; main.ts is the only file that constructs adapters; both the CLI and HTTP adapters produce the same results as the original script.",
      "The same contract-test function passes against InMemoryReels and JsonFileReels; use-case tests use a stub clock and a spy notifier and assert the exact warning text and timestamp; the HTTP end-to-end test passes.",
      "Your measurement table shows suite times for in-memory and file adapters, line and file counts before and after, and the import check output (empty for src/domain); the review page names one abstraction to delete with a reason based on YAGNI or the rule of three."
    ],
    hints:[
      "Characterization tests do not judge whether the old behavior is right; they record what it is. Run the script with fixed arguments, save stdout to a file, and assert equality, so every later refactoring has a safety net.",
      "Extract the pure domain first (install and the reel-low rule as plain functions), then the ports it needs. A port's methods should be named in the use case's words (get, save, reelLow, now), not in the database's.",
      "A contract test is a function that receives a factory: runRepoContract('memory', () => new InMemoryReels()) and runRepoContract('json', async () => new JsonFileReels(await mkdtemp(join(tmpdir(), 'reels-')))). Both run the same assertions."
    ],
    trouble:[
      ["Characterization tests fail after a refactoring that should not change behavior","Output now depends on something the old script did differently: key order, a timestamp, or number formatting","Diff the actual and expected output first; if it is the clock, inject it now rather than loosening the test."],
      ["Tests pass alone but fail when run together","Shared state: a module-level repository, a singleton bus, or one JSON file reused across tests","Create fresh adapters in each test (or beforeEach) and give each file-adapter test its own temporary directory."],
      ["TS2345 when passing InMemoryReels where ReelRepository is expected","A method signature differs, for example get returns Reel | null while the port says Reel | undefined, or save is not async","Read the full error: TypeScript lists the incompatible property. Make the adapter match the port the core owns, not the other way round."],
      ["ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX on a class constructor","A constructor parameter property such as constructor(private repo: Repo) is not erasable","Declare the field (readonly #repo: Repo) and assign it in the constructor body, as in Module 6."]
    ],
    challenge:"Add a SqliteReels adapter using the node:sqlite module (check its stability status in your Node version's documentation first) or the better-sqlite3 package, and run the same contract tests against it without changing a single test. Then introduce a ReelInstalled domain event with two subscribers (dashboard and audit log), make one subscriber throw, and change the bus so the install still succeeds and the error is logged.",
    reflect:[
      "Which pattern did the most to make the later hexagonal step easy, and which one did you end up deleting? What did that teach you about introducing patterns early?",
      "Your fast tests run against fakes. What gives you confidence that the fakes behave like the real adapters, and what could still go wrong only in production?",
      "If three teams had to work on this service, what would you change first: the architecture, the module boundaries, or the deployment? Why?"
    ]
  },
  "p50lab5":{
    time:"3–4 h",
    setup:[
      "A Linux machine, WSL2 Ubuntu or macOS terminal. Check bash --version (5.x; macOS ships 3.2, so run brew install bash and use the Homebrew bash for this lab). Install ShellCheck with sudo apt install shellcheck or brew install shellcheck, and confirm dash exists (command -v dash; on macOS, brew install dash).",
      "A throwaway sandbox inside your home directory, never a real data folder: mkdir -p ~/shlab/sandbox/in ~/shlab/sandbox/out. If you work in a VM, take a snapshot first so you can roll back.",
      "Hostile test files in sandbox/in: touch \"Reel 17 as-built.xlsx\" ./-rf.csv 'splice*log.csv' $'two\\nlines.csv', and three dated archives in sandbox/out (asbuilts-2026-10-14.tar.gz, -15, -16).",
      "Python 3.12+ for the final port, and the time command (built into Bash) for measurements."
    ],
    checkpoints:[
      "ls sandbox/in lists four entries (the newline name appears quoted, escaped or split across two lines depending on your ls), and sandbox/out holds three dated archives.",
      "./archive-asbuilts.sh -k 2 sandbox/in sandbox/out logs 'found 4 sheet(s)', writes today's archive, deletes the two oldest, and exits 0; tar -tzf on the new archive lists all four hostile names; ls sandbox/out shows exactly two archives.",
      "shellcheck archive-asbuilts.sh prints nothing and exits 0; your bug log has four rows, each with the ShellCheck code (SC2086, SC2045, SC2155, SC2164) and what actually broke when you ran the buggy version on the sandbox.",
      "Your caveats table has five predictions and five actual results; the script's final exit status matches your prediction; PIPESTATUS after yes | head -n 1 prints 141 0; after Ctrl-C, echo $? prints 130 and the mktemp directory no longer exists.",
      "dash ./archive-asbuilts-posix.sh archives the same four files, shellcheck --shell=sh is clean, python3 archive_asbuilts.py -k x prints an argparse usage error with exit status 2, and your comparison table lists line counts and median run times for all three versions."
    ],
    hints:[
      "Build the script up in small runs: first just the getopts loop printing the parsed values, then the nullglob array and a log of its length, then the copy into mktemp, then tar, then rotation. Run it on the sandbox after each addition.",
      "Quote every expansion, put -- before every filename argument to cp, rm, tar and du, and use \"${work:?}\" in the EXIT trap. For rotation, rely on the fact that glob results are sorted and ISO dates sort chronologically, so you never need to parse ls.",
      "In POSIX sh there are no arrays: loop directly over the globs, skip the unmatched-glob case with [ -e \"$f\" ] || continue, and count with n=$((n + 1)). In Python, sorted(dest.glob('asbuilts-*.tar.gz'))[:-keep] gives the archives to delete."
    ],
    trouble:[
      ["cp: invalid option -- '.' when copying -rf.csv","A filename beginning with - was read as an option because -- was missing","Put -- before the file arguments: cp -- \"${sheets[@]}\" \"$work/\". Test every script against a file named like an option."],
      ["The script archives a file literally named *.xlsx, or reports 1 sheet in an empty folder","nullglob is not set, so an unmatched glob stays as the literal pattern","Add shopt -s nullglob before building the array (Bash), or [ -e \"$f\" ] || continue in the POSIX version."],
      ["bash: archive-asbuilts.sh: /usr/bin/env: bad interpreter, or $'\\r': command not found","The file has Windows CRLF line endings, usually from editing on Windows","Convert with dos2unix or sed -i 's/\\r$//' file, and set your editor (or git config core.autocrlf input) to use LF for scripts."],
      ["The script exits silently in the middle with status 1 and no error message","set -e stopped at a failing command that prints nothing, such as grep with no match or (( i++ )) when i is 0","Run bash -x ./script.sh to trace each command, read the last line before the exit, and handle that command explicitly. The ERR trap with set -E should also print the failing line."]
    ],
    challenge:"Add a -c CHECKSUM option that writes a SHA-256 manifest of every archived file into the tarball and verifies it after writing (sha256sum on Linux, shasum -a 256 on macOS), failing with a distinct exit code if verification fails. Then add flock-based locking so two simultaneous runs cannot rotate the same directory, prove it by starting two runs at once, and port both features to the Python version.",
    reflect:[
      "Which set -e caveat surprised you most, and how will it change the way you write the next script that matters?",
      "The POSIX version needed no arrays and still handled every hostile filename. What did you lose by giving up arrays, and when is portability worth that cost?",
      "Looking at your comparison table, which version would you schedule on a crew laptop, and what single fact decided it?"
    ],
    safety:"Run everything only inside the throwaway sandbox. A deletion bug in a rotation script destroys real data, so never point it at a real folder until it has passed on the sandbox, always guard rm paths with ${var:?} and --, and keep a VM snapshot or backup if you test on a machine you depend on."
  }
});
