/* Domain 50 — TypeScript, Functional Programming, Design Patterns & Shell Scripting (facts as of October 2026) */
BOOTCAMP.phases.push({
id:"p50", num:50, title:"TypeScript, Functional Programming, Design Patterns & Shell Scripting", short:"TS & Patterns",
tagline:"The craft layer between knowing a language and building software people trust: a static type system that catches the bug before the customer does, functional habits that make code testable and concurrency-safe, the handful of design and architecture patterns that earn their keep, and shell scripts that do not delete the wrong directory on Wednesday. Every example runs on your own machine, with its output shown.",
prereq:"Domain 4 (Python fundamentals: functions, data structures, OOP and tests) and Domain 5 (web development, above all JavaScript the language and in the browser). Recommended: Domain 3 (the Linux shell, processes and files) and Domain 20 (Git, testing, clean code and SOLID). This domain builds on them rather than re-teaching them. All labs run on your own machine: Node.js 24 or 26 LTS with TypeScript 7, Python 3.12 or newer, Bash 5 and ShellCheck.",
outcomes:[
"Predict what the TypeScript checker accepts and rejects: structural assignability, excess property checks, unions and intersections, control-flow narrowing, discriminated unions with exhaustive never checks, and the soundness holes (any, as, unchecked indexing).",
"Write generic functions and types with constraints, keyof and indexed access, read conditional, mapped and template-literal types, and choose the right utility type — and state exactly which TypeScript syntax erases and which emits code.",
"Configure a strict TypeScript 7 project for Node.js and the browser, run it three ways (tsc, Node.js type stripping, a bundler), type an HTTP client end to end, validate untrusted data at the boundary with Zod, and migrate a JavaScript file with @ts-check and JSDoc.",
"Write pure, immutable, higher-order code with closures, map/filter/reduce and recursion in both TypeScript and Python, and explain the stack limits, memoization and the cost model behind each choice.",
"Model domains with algebraic data types, pattern matching and Option/Result values instead of null and exceptions; compose pipelines with currying and laziness; and read simple Haskell to see the ideas in their native form.",
"Apply SOLID with an honest critique, implement the patterns you actually meet (strategy, observer, command, adapter, decorator, factory and friends) idiomatically in TypeScript and Python, and argue when a pattern is over-engineering.",
"Structure a small service with layers, hexagonal ports and adapters, framework-free dependency injection, domain events and testing seams, and test it fast with in-memory adapters and node:test.",
"Write shell scripts that survive real filenames: expansion order, quoting and word splitting, set -euo pipefail and its caveats, functions, traps, exit codes, ShellCheck-clean code, POSIX sh portability — and know when to switch to Python."
],
texts:["The TypeScript Handbook and TSConfig reference (typescriptlang.org), with Effective TypeScript, 2nd ed. (Dan Vanderkam, O'Reilly 2024) — the spine for Modules 1–2","Grokking Simplicity (Eric Normand, Manning 2021) and the University of Helsinki Haskell MOOC (haskell.mooc.fi) — Modules 3–4","Design Patterns: Elements of Reusable Object-Oriented Software (Gamma, Helm, Johnson and Vlissides, 1994), read alongside Architecture Patterns with Python (Percival and Gregory, O'Reilly 2020, free at cosmicpython.com) — Modules 5–6","The GNU Bash Reference Manual, the POSIX.1-2024 Shell Command Language, and Greg's Wiki BashGuide and BashPitfalls — Module 7"],
modules:[
{id:"p50m1", title:"TypeScript's Type System: Structural Types, Unions, Narrowing, Generics and What Erases", minutes:60,
outcomes:["Predict assignability under structural typing, including excess property checks on fresh literals and branded types for units.","Model data with unions, intersections, literal types and discriminated unions, and narrow them with typeof, in, instanceof, equality and type guards.","Write generic functions with constraints, keyof and indexed access, and read conditional and mapped types.","Choose the right utility type and use as const and satisfies without losing precision.","State exactly what erases at run time, which features emit code, and the soundness holes (any, as, !, unchecked indexing)."],
body:`<p>What does a type checker actually prove about a JavaScript program, and what does it leave unproven? Answer that precisely and TypeScript becomes a tool you aim. It is the default language of the web and of Node.js tooling after Domain 5, and a static analyzer in the sense of Domain 11: knowing where its reasoning stops is how you find bugs in an authorized AppSec review (Domain 31). The current compiler is <strong>TypeScript 7.0</strong> (8 July 2026), ported to Go and 8–12 times faster than TypeScript 6; the language rules are unchanged.</p>
<h4>Types are sets; compatibility is shape</h4>
<p>Read a type as the set of values it admits: the literal type <code>"installed"</code> is a set of one, <code>never</code> is the empty set, <code>unknown</code> is everything, and assignability is the subset relation. Java (Domain 6) decides it by <em>name</em>; TypeScript decides it by <em>shape</em>, which is called <strong>structural typing</strong>: any value with the required properties fits. A <strong>union type</strong> <code>A | B</code> is set union (one or the other, and you may use only what both share until you check), and an intersection <code>A &amp; B</code> is set intersection, so <code>string &amp; number</code> is <code>never</code>. The <strong>excess property check</strong> rejects an unknown property on a <em>fresh</em> object literal, where it is almost always a typo. When you need nominal behavior — feet versus meters, the mix-up that lost the Mars Climate Orbiter — a <strong>branded type</strong> adds a phantom property no ordinary number has, at zero run-time cost.</p>
<pre><code>interface Point { x: number; y: number }
const norm = (p: Point) =&gt; Math.hypot(p.x, p.y);
const mark = { x: 3, y: 4, label: "OTDR marker" };
console.log(norm(mark));           // fine: a stored value may carry extra properties
// norm({ x: 3, y: 4, label: "m" }); // TS2353: excess property check on a fresh literal

type Feet = number &amp; { readonly __brand: "Feet" };
type Meters = number &amp; { readonly __brand: "Meters" };
const toMeters = (f: Feet) =&gt; (f * 0.3048) as Meters;
console.log(toMeters(3220 as Feet).toFixed(1));
// toMeters(981 as Meters);          // TS2345: 'Meters' is not assignable to 'Feet'
$ node brand.ts
5
981.5</code></pre>
<p>Inference widens literals in mutable positions (<code>let</code> gives <code>string</code>, <code>const</code> gives <code>"staged"</code>); <code>as const</code> freezes a literal to its narrowest readonly type; <code>satisfies</code> checks a value against a type without widening it.</p>
<h4>Narrowing and type guards</h4>
<p>The checker follows <code>if</code>, <code>switch</code> and <code>return</code> and shrinks a variable's type on each path. That is <strong>type narrowing</strong>, done with checks you already write: <code>typeof</code>, truthiness, <code>===</code> against a literal or <code>null</code>, <code>"key" in obj</code>, <code>instanceof</code>, <code>Array.isArray</code>. When none fits, write a <strong>type guard</strong>: a function returning the predicate <code>x is Reel</code>, so a <code>true</code> result narrows the argument at the call site. Since TypeScript 5.5 the checker infers simple predicates itself, which is why <code>[3220, undefined].filter((n) =&gt; n !== undefined)</code> is now <code>number[]</code>. Guards take <code>unknown</code>, never <code>any</code>: <code>any</code> switches checking off and spreads silently, while <code>unknown</code> accepts every value but allows nothing until you narrow — the honest type of data you have not inspected.</p>
<h4>Discriminated unions and exhaustiveness</h4>
<p>The most valuable pattern in the language is the <strong>discriminated union</strong>: a union of object types sharing one literal-typed tag (<code>kind</code> below). Switching on the tag narrows each branch to one variant, and assigning the leftover to <code>never</code> turns "I forgot a case" into a compile error. Module 4 shows it is an algebraic data type in disguise.</p>
<pre><code>type Shape =
  | { kind: "circle"; r: number }
  | { kind: "rect"; w: number; h: number }
  | { kind: "tri"; a: number; b: number; c: number };

function area(s: Shape): number {
  switch (s.kind) {
    case "circle":
      return Math.PI * s.r ** 2;
    case "rect":
      return s.w * s.h;
    case "tri": {
      const p = (s.a + s.b + s.c) / 2; // Heron's formula
      return Math.sqrt(p * (p - s.a) * (p - s.b) * (p - s.c));
    }
    default: {
      const unreachable: never = s; // compile error if a case is missing
      throw new Error("unhandled shape: " + JSON.stringify(unreachable));
    }
  }
}

console.log(area({ kind: "circle", r: 1 }).toFixed(4));
console.log(area({ kind: "rect", w: 3, h: 4 }));
console.log(area({ kind: "tri", a: 3, b: 4, c: 5 }));
$ node shapes.ts
3.1416
12
6
# add  | { kind: "hex"; side: number }  to Shape, then:
$ npx tsc --noEmit
shapes.ts(18,13): error TS2322: Type '{ kind: "hex"; side: number; }' is not assignable to type 'never'.</code></pre>
<p>Check by hand: Heron on the 3-4-5 triangle gives √(6·3·2·1) = 6. The payoff is the error: it names the variant you forgot and the line.</p>
<h4>Generics, conditional and mapped types</h4>
<p><strong>Generics</strong> are type parameters the checker fills in at each call, so a function can say "whatever goes in, the related type comes out." The Handbook's rule: a type parameter must appear at least twice, or it relates nothing and <code>unknown</code> would do. Constraints such as <code>K extends keyof T</code> limit what may be substituted; <code>keyof T</code> is the union of T's keys and the indexed access <code>T[K]</code> is the type stored there. A <strong>conditional type</strong> <code>T extends U ? X : Y</code> picks a branch by assignability, <code>infer</code> captures part of the match, and over a union it distributes member by member. A <strong>mapped type</strong> <code>{ readonly [K in keyof T]: T[K] }</code> rebuilds an object type key by key — that one line is the built-in <code>Readonly</code>.</p>
<pre><code>function pluck&lt;T, K extends keyof T&gt;(items: readonly T[], key: K): T[K][] {
  return items.map((item) =&gt; item[key]);
}
type ElementOf&lt;T&gt; = T extends readonly (infer E)[] ? E : never;

const reels = [
  { id: "R17", crew: "north", feet: 3220 },
  { id: "R18", crew: "south", feet: 1875 },
] as const;
type Reel = ElementOf&lt;typeof reels&gt;;   // union of the two literal object types
const ids = pluck(reels, "id");        // type: ("R17" | "R18")[]
const feet: number[] = pluck(reels, "feet");
console.log(ids, feet);
// pluck(reels, "colour");  // TS2345: '"colour"' is not assignable to '"feet" | "id" | "crew"'
$ node pluck.ts
[ 'R17', 'R18' ] [ 3220, 1875 ]</code></pre>
<p>The generic carried the literal types through the function and rejected a key that does not exist. You will rarely write type-level code from scratch, but you will use the built-in <strong>utility types</strong> daily:</p>
<table><tr><th>Utility type</th><th>Produces</th><th>Typical use</th></tr>
<tr><td><code>Partial</code> / <code>Required</code> / <code>Readonly</code></td><td>Every property optional / required / readonly (shallow)</td><td>Patch payloads; immutable records</td></tr>
<tr><td><code>Pick&lt;T, K&gt;</code> / <code>Omit&lt;T, K&gt;</code></td><td>Keep / drop the listed keys</td><td>An API view without the password hash</td></tr>
<tr><td><code>Record&lt;K, V&gt;</code></td><td>Object with keys K and values V</td><td>Lookup tables, groupBy results</td></tr>
<tr><td><code>Exclude</code> / <code>Extract</code> / <code>NonNullable</code></td><td>Filter members of a union</td><td>Dropping <code>null</code>; picking variants</td></tr>
<tr><td><code>ReturnType</code> / <code>Parameters</code> / <code>Awaited</code></td><td>Types read off a function or a Promise</td><td>Typing wrappers and decorators</td></tr></table>
<h4>What erases, and the soundness holes</h4>
<p>TypeScript's founding decision is <strong>type erasure</strong>: annotations, interfaces, generics, <code>as</code> and <code>import type</code> are deleted before the program runs, so <code>JSON.parse</code> returns data the checker has never seen. A few old features generate code and do not erase: <code>enum</code>, <code>namespace</code> with values, constructor parameter properties (<code>constructor(public id: string)</code>) and legacy decorators. Node.js runs <code>.ts</code> files by stripping types (Module 2) and refuses them: an enum fails with "SyntaxError [ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX]: TypeScript enum is not supported in strip-only mode", and the compiler flag <code>erasableSyntaxOnly</code> reports each one as TS1294 first. The erasable replacement is a frozen object plus a derived union:</p>
<pre><code>const Status = { Pending: "pending", Installed: "installed" } as const;
type Status = (typeof Status)[keyof typeof Status]; // "pending" | "installed"
class Reel {
  readonly id: string;
  constructor(id: string) { this.id = id; }
}
const s: Status = Status.Installed;
console.log(s, new Reel("R17").id);
$ node fixed.ts
installed R17</code></pre>
<p>The checker is also deliberately <em>unsound</em> in places: <code>any</code> disables checking, and <code>x as T</code> and <code>x!</code> are promises believed without evidence. Indexing returns <code>T</code>, not <code>T | undefined</code>, unless <code>noUncheckedIndexedAccess</code> is on: without it, <code>crews[0].toUpperCase()</code> on an empty array compiles and throws "TypeError: Cannot read properties of undefined"; with it, the compiler reports "'first' is possibly 'undefined'" (TS18048). Method parameters are checked bivariantly and mutable arrays are covariant, so a <code>Dog[]</code> passed as <code>Animal[]</code> can have a <code>Cat</code> pushed into it. In a review, these holes are where the bugs hide.</p>
<p><em>Certification mapping.</em> No widely recognized TypeScript certification exists, so this module is examined by your portfolio and by interviews ("what does structural typing allow?", "why is <code>any</code> worse than <code>unknown</code>?"). The runtime object model these types describe — literals, property enumeration, comparing and copying objects, prototypes — is Block 1 of JSA-41-01 (Classless Objects, 25%).</p>`,
example:`<p><strong>Typing a day of reel records.</strong> Model the day's log as a discriminated union on <code>status</code>: <code>{ status: "staged"; id; feet }</code>, <code>{ status: "installed"; id; startFt; endFt }</code> and <code>{ status: "failed"; id; reason }</code>. The log holds R17 installed from 10,450 ft down to 7,230 ft, R18 from 8,000 to 6,125, R19 staged with 12,000 ft and R21 failed for "jacket damage". Write <code>const installed = day.filter((e) =&gt; e.status === "installed")</code>: since TypeScript 5.5 the checker infers the predicate, so <code>installed</code> is typed as the installed variant only and <code>e.startFt - e.endFt</code> compiles with no cast. The reduce gives 3,220 + 1,875 = 5,095 ft, and 5,095 × 0.3048 = 1,553.0 m — exactly what <code>node example.ts</code> prints (<code>5095 1553.0</code>). Now the crew lead adds a fourth state, <code>{ status: "spliced"; id; closure: string }</code>. Every <code>switch</code> that ends with <code>const unreachable: never = e</code> fails to compile with TS2322 naming the spliced variant and the exact line, so the change is finished when the error list is empty — not when a customer finds the report that silently skipped spliced reels. Finally brand the units: <code>type Feet = number &amp; { readonly __brand: "Feet" }</code> makes <code>toMeters(981 as Meters)</code> a compile error, while costing zero bytes at run time.</p>`,
misconceptions:["\"TypeScript checks my data at run time.\" Types are erased before the program runs; JSON from a network or file is unchecked until you validate it yourself (Module 2's Zod).","\"An interface must be implemented explicitly, like in Java.\" TypeScript is structural: any value with the right properties fits, whatever it was named; use a branded type when you need nominal behavior.","\"any and unknown are interchangeable escape hatches.\" any turns the checker off and spreads; unknown accepts everything but forces you to narrow before use — always prefer unknown for uninspected data."],
problems:[
{q:"Given interface Splice { id: string; lossDb: number }, which of these compile, and why? (a) const s = { id: \"S1\", lossDb: 0.05, tech: \"TM\" }; const t: Splice = s; (b) const t: Splice = { id: \"S1\", lossDb: 0.05, tech: \"TM\" }; (c) const t: Splice = { id: \"S1\" } as Splice;", a:"(a) compiles: structural typing accepts extra properties on a non-fresh value. (b) fails with TS2353: excess property check on a fresh literal. (c) compiles, but the as assertion is a lie — lossDb is undefined at run time; this is a soundness hole, not a check."},
{q:"Write the type of a function last that returns the final element of any readonly array, preserving the element type, and say what it must return for an empty array under noUncheckedIndexedAccess.", a:"function last<T>(xs: readonly T[]): T | undefined { return xs[xs.length - 1]; } — the index access is T | undefined under noUncheckedIndexedAccess, which honestly models the empty array."},
{q:"type ElementOf<T> = T extends readonly (infer E)[] ? E : never. Compute ElementOf<string[] | number[]> and ElementOf<string>.", a:"string | number (the conditional distributes over the union: ElementOf<string[]> | ElementOf<number[]>), and never, because string is not an array type."},
{q:"A teammate writes enum Crew { North, South } in a file that Node.js runs directly with type stripping. Diagnose the failure and give an erasable rewrite that keeps both the values and a type.", a:"Node throws ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX because enum generates code. Rewrite: const Crew = { North: \"north\", South: \"south\" } as const; type Crew = (typeof Crew)[keyof typeof Crew]; — the object survives at run time, the union type erases."},
{q:"Count the values of each type: (a) boolean, (b) \"a\" | \"b\" | \"c\", (c) { ok: boolean; level: \"a\" | \"b\" | \"c\" }, (d) boolean | (\"a\" | \"b\" | \"c\"), (e) string & number.", a:"(a) 2; (b) 3; (c) 2 × 3 = 6 (an object is a product); (d) 2 + 3 = 5 (a union is a sum); (e) 0 — the intersection is never."}
],
checks:[
{q:"What is the name of TypeScript's compatibility rule based on shape rather than declared names?", a:"Structural typing."},
{q:"What return-type syntax turns a boolean function into a type guard?", a:"A type predicate, e.g. function isReel(x: unknown): x is Reel."},
{q:"Name three TypeScript features that are not erasable.", a:"enum, namespace with runtime values, constructor parameter properties (also legacy decorators and import aliases)."}
],
explain:"Teach ADA why TypeScript accepts an object with extra properties from a variable but rejects the same object written as a literal, then show her how a discriminated union plus a never assignment turns a forgotten case into a compile error."},
{id:"p50m2", title:"TypeScript in Practice: tsconfig and Strict Mode, Node.js and the Browser, a Typed API Client, Runtime Validation and Migration", minutes:60,
outcomes:["Write a strict tsconfig.json for a Node.js project and explain what each strict sub-flag and each extra flag catches.","Run TypeScript three ways — tsc emit, Node.js type stripping, a bundler — and keep type checking as a separate CI step.","Type an HTTP client end to end with fetch, timeouts, status checks and unknown, and explain why a cast on res.json() is a lie.","Validate untrusted data at the boundary with Zod 4, deriving the static type from the schema with z.infer.","Migrate a JavaScript file in safe steps: @ts-check and JSDoc, rename, then tighten one flag at a time."],
body:`<p>How do you get from types on a slide to a project where the compiler catches the bug before the customer does? Four decisions: how strict the checker is, how the code runs, where untrusted data is checked, and how existing JavaScript comes in. The toolchain moved fast in 2026. <strong>TypeScript 6.0</strong> (March) was the last compiler written in TypeScript and made strict checking the default; <strong>TypeScript 7.0</strong> (July) is the Go port, installed as usual (<code>npm install -D typescript</code>, <code>npx tsc</code>), and cut a full check of the VS Code source from 125.7 s to 10.6 s. It has no programmatic API until 7.1 (in beta), so typescript-eslint and the Vue, Svelte and Angular template tools still run on 6.0, installable alongside as <code>@typescript/typescript6</code> (<code>tsc6</code>).</p>
<h4>tsconfig.json and strict mode</h4>
<p><code>tsconfig.json</code> (JSON with comments) says which files form the project and how hard to check them. A sound starting point for Node.js:</p>
<pre><code>{
  "compilerOptions": {
    "strict": true,                     // the default since TypeScript 6.0; say it anyway
    "target": "esnext",
    "module": "nodenext",               // Node's ESM/CommonJS rules ("bundler" for Vite)
    "types": ["node"],                  // 7.0 defaults types to [], so list them
    "noUncheckedIndexedAccess": true,   // xs[i] is T | undefined
    "exactOptionalPropertyTypes": true, // a?: string does not accept undefined
    "verbatimModuleSyntax": true,       // forces import type, which Node requires
    "erasableSyntaxOnly": true,         // no enum, value namespaces, parameter properties
    "rewriteRelativeImportExtensions": true,
    "noEmit": true,                     // Node runs the .ts files; tsc only checks
    "skipLibCheck": true
  },
  "include": ["src"]
}</code></pre>
<p><strong>Strict mode</strong> is one switch for a family of checks, each aimed at a bug class: <code>strictNullChecks</code> ("possibly undefined" is an error, not a 2 a.m. crash), <code>noImplicitAny</code>, <code>strictFunctionTypes</code> (callback parameters checked contravariantly), <code>strictPropertyInitialization</code>, <code>useUnknownInCatchVariables</code> (<code>catch (e)</code> gives <code>unknown</code>, because anything can be thrown), <code>strictBindCallApply</code> and <code>noImplicitThis</code>. TypeScript 7.0 turned the 6.0 deprecations into hard errors: <code>target: "es5"</code>, <code>moduleResolution: "node"</code>, <code>baseUrl</code> and AMD/UMD output are gone. Of the extra flags, <code>noUncheckedIndexedAccess</code> closes Module 1's indexing hole and <code>exactOptionalPropertyTypes</code> separates "absent" from "present but undefined", which matters in every PATCH request.</p>
<h4>Running TypeScript: tsc, type stripping, bundlers</h4>
<p>Browsers and Node.js execute JavaScript, so something must remove the types. <em>Compile with tsc</em>: it checks and writes <code>.js</code> plus <code>.d.ts</code> files — the route for libraries. A <strong>declaration file</strong> (<code>.d.ts</code>) holds only types; it is how <code>@types/node</code> describes Node's API. <em>Run directly in Node.js</em>: <strong>type stripping</strong> replaces annotations with whitespace, so line numbers stay exact. It is on by default since Node 22.18 and stable since 24.12; it never type-checks, ignores <code>tsconfig.json</code>, needs real extensions in imports (<code>./core.ts</code>) and <code>import type</code> for type-only imports, rejects Module 1's non-erasable syntax and refuses <code>.ts</code> inside <code>node_modules</code>. Node 24 (maintenance LTS) or Node 26 (active LTS from 28 October 2026) both work. <em>Bundle for the browser</em>: Vite and esbuild strip types per file in milliseconds and never check either. Hence the rule: <strong>execution and checking are separate steps</strong> — run <code>tsc --noEmit</code> in the editor, a pre-commit hook and CI (Domain 19). In the browser the DOM types keep you honest: <code>document.querySelector&lt;HTMLInputElement&gt;("#reel")</code> returns <code>HTMLInputElement | null</code>.</p>
<h4>Typing an API client end to end</h4>
<p>This is where most projects lie to themselves. <code>res.json()</code> returns <code>Promise&lt;any&gt;</code>, and <code>as Reel[]</code> is a <strong>type assertion</strong>: it compiles and checks nothing. The local test server returns two reels; with <code>?broken=1</code> it sends the footage as strings, as happens when another team "fixes" its serializer.</p>
<pre><code>import * as z from "zod";   // Zod 4

const Reel = z.object({
  id: z.string(),
  crew: z.string(),
  startFt: z.number().int().nonnegative(),
  endFt: z.number().int().nonnegative(),
  installedAt: z.iso.datetime(),
});
type Reel = z.infer&lt;typeof Reel&gt;;

type Result&lt;T&gt; = { ok: true; value: T } | { ok: false; error: string };

async function getJson(url: string): Promise&lt;unknown&gt; {
  const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
  if (!res.ok) throw new Error("HTTP " + res.status + " from " + url);
  return res.json(); // Promise&lt;any&gt;, deliberately widened to unknown by our signature
}

// The lie: a cast compiles, checks nothing, and lets strings through.
async function feetLeftUnsafe(url: string): Promise&lt;number&gt; {
  const reels = (await getJson(url)) as Reel[];
  return reels.reduce((sum, r) =&gt; sum + r.endFt, 0);
}

// The truth: parse at the boundary, return a Result the caller must handle.
async function feetLeft(url: string): Promise&lt;Result&lt;number&gt;&gt; {
  const parsed = z.array(Reel).safeParse(await getJson(url));
  if (!parsed.success) return { ok: false, error: z.prettifyError(parsed.error) };
  return { ok: true, value: parsed.data.reduce((sum, r) =&gt; sum + r.endFt, 0) };
}

const base = "http://127.0.0.1:8787/reels";
console.log("unsafe, good data:  ", await feetLeftUnsafe(base));
console.log("unsafe, broken data:", await feetLeftUnsafe(base + "?broken=1"));
console.log("safe, good data:    ", await feetLeft(base));
const r = await feetLeft(base + "?broken=1");
console.log("safe, broken data:  ", r.ok ? r.value : "REJECTED\\n" + r.error);</code></pre>
<pre><code>$ node server.ts &amp;    # 30 lines of node:http on 127.0.0.1:8787 (Lab 2)
$ node client.ts
unsafe, good data:   13355
unsafe, broken data: 072306125
safe, good data:     { ok: true, value: 13355 }
safe, broken data:   REJECTED
✖ Invalid input: expected number, received string
  → at [0].startFt
✖ Invalid input: expected number, received string
  → at [0].endFt
  … the same two errors again at [1].startFt and [1].endFt</code></pre>
<p>Read the second line slowly: 7,230 + 6,125 should be 13,355 feet left on the truck, but the cast let two strings through, <code>+</code> concatenated them, and the report says 72 million feet — no exception, just a wrong number someone signs. The validated version refuses the data and names each bad field. Note the other habits: <code>AbortSignal.timeout(3000)</code> so a dead server cannot hang you, a status check because <code>fetch</code> does not throw on HTTP 500, <code>unknown</code> for anything parsed from the network (narrowed later by a schema or a type guard), and a <code>Result</code> (a discriminated union, Module 4) for the failure the caller must handle.</p>
<h4>Runtime validation at the boundary</h4>
<p>Because types erase, <strong>runtime validation</strong> must happen wherever data crosses into your program: HTTP bodies, files, environment variables, queues, <code>localStorage</code>. Alexis King's 2019 essay "Parse, don't validate" names the discipline: turn untyped input into a typed value <em>once</em>, at the edge, and let the rest of the program trust its types. <strong>Zod</strong> 4 (about 14 times faster at string parsing and 57% smaller than version 3) adds top-level formats such as <code>z.email()</code> and <code>z.iso.datetime()</code> and the <code>z.prettifyError</code> report above. Its decisive feature is <code>z.infer&lt;typeof Reel&gt;</code>: the static type is <em>derived</em> from the runtime schema, so the two cannot drift, and it takes part in structural typing like any hand-written interface. <code>safeParse</code> returns <code>{ success, data | error }</code>; <code>parse</code> throws. Valibot and ArkType are lighter alternatives implementing the same Standard Schema interface. Validate at the boundary only; re-validating deep inside means the boundary is not where you think.</p>
<h4>Migrating a JavaScript file</h4>
<p>You will inherit JavaScript. Migrate from the leaves inward, in steps that each leave the build green. Step one needs no rename: <code>// @ts-check</code> at the top, types in JSDoc, <code>allowJs</code> and <code>checkJs</code> in tsconfig. On this report script the checker finds two bugs the program hid behind <code>NaN</code> and <code>0</code>:</p>
<pre><code>// report.js
// @ts-check

/** @typedef {{ id: string, crew: string, startFt: number, endFt: number }} Reel */

/**
 * @param {Reel[]} reels
 * @param {string} crew
 * @returns {number}
 */
export function crewFeet(reels, crew) {
  return reels
    .filter((r) =&gt; r.crew === crew)
    .reduce((sum, r) =&gt; sum + (r.startFt - r.endfT), 0);
}

const total = crewFeet([{ id: "R17", crew: "north", startFt: 10450, endFt: 7230 }], "north");
console.log(total.toFixed(0));
console.log(crewFeet([], 7));
$ node report.js
NaN
0
$ npx tsc --noEmit
report.js(13,46): error TS2551: Property 'endfT' does not exist on type 'Reel'. Did you mean 'endFt'?
report.js(18,26): error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.</code></pre>
<p>Step two renames to <code>.ts</code> and moves JSDoc into annotations; step three tightens one flag at a time, tracking the error count as a burn-down. Use <code>unknown</code>, not <code>any</code>, for what you cannot type yet, and <code>// @ts-expect-error</code>, not <code>@ts-ignore</code>: it becomes an error itself once the problem is fixed, so it cannot rot.</p>
<p><em>Certification mapping.</em> Block 4 of JSA-41-01 (Advanced Functions, 25%) examines callbacks, promises, chaining, <code>async</code>/<code>await</code> and network requests (objectives 4.6–4.10) — the client above with its types removed. Block 3 (Built-in Objects, 27%) covers the <code>JSON</code> object whose untyped output motivates validation.</p>`,
example:`<p><strong>The Monday-morning report bug, fixed for good.</strong> A dispatch dashboard sums the feet left on each crew's reels from an internal API. On Monday it shows 72,306,125 ft for the north crew instead of 13,355. Diagnosis in four commands. <code>curl -s http://127.0.0.1:8787/reels | head -c 200</code> shows <code>"endFt":"7230"</code> — the upstream team changed its serializer and numbers now arrive as strings. <code>grep -n " as Reel" src/*.ts</code> finds <code>(await res.json()) as Reel[]</code>, the type assertion that let the strings in; <code>"7230" + "6125"</code> concatenates to <code>"72306125"</code>, and the leading zero from the reduce's initial 0 completes the nonsense. The fix is one schema: <code>const Reel = z.object({ id: z.string(), startFt: z.number().int().nonnegative(), endFt: z.number().int().nonnegative(), installedAt: z.iso.datetime() })</code>, <code>type Reel = z.infer&lt;typeof Reel&gt;</code>, and <code>z.array(Reel).safeParse(json)</code> at the single point where data enters. The dashboard now shows "REJECTED: expected number, received string at [0].endFt" and pages the on-call instead of publishing a wrong number. Add a test that runs the client against the server's <code>?broken=1</code> mode and asserts <code>ok === false</code>, and wire <code>"check": "tsc --noEmit"</code> and <code>"test": "node --test"</code> into CI so the next upstream change is caught in minutes, not by a customer.</p>`,
misconceptions:["\"Node.js runs TypeScript now, so I do not need tsc.\" Type stripping removes types without checking them; a file full of type errors runs happily. Run tsc --noEmit in CI.","\"(await res.json()) as Reel[] gives me typed data.\" A type assertion is a promise the compiler believes without evidence; only runtime validation (Zod, Valibot, ArkType) checks what actually arrived.","\"Turning on strict in an old project is all or nothing.\" Migrate incrementally: @ts-check and JSDoc first, then rename file by file, then enable one extra flag at a time and track the error count."],
problems:[
{q:"A Node.js 26 service fails at start-up with ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX on a line constructor(private repo: Repo) {}. Explain the cause and give the fix and the tsconfig flag that would have caught it in the editor.", a:"Parameter properties generate assignment code, so they are not erasable and type stripping refuses them. Declare the field and assign it (readonly #repo: Repo; constructor(repo: Repo) { this.#repo = repo; }). erasableSyntaxOnly reports TS1294 at edit time."},
{q:"Your CI runs node --test on .ts files and passes, yet tsc --noEmit reports 14 errors. How can both be true, and which result should gate a merge?", a:"Node strips types without checking them, so tests can pass on code that is type-incorrect (the errors may be on untested paths or harmless at run time today). Gate on both: tsc --noEmit for types and node --test for behavior; neither replaces the other."},
{q:"An API returns { \"temp\": \"21.5\" } instead of a number. Write the Zod schema line that accepts only real numbers, and the one that deliberately coerces numeric strings, and say when coercion is acceptable.", a:"temp: z.number() rejects the string; temp: z.coerce.number() converts \"21.5\" to 21.5. Coerce only for inputs that are strings by nature (query parameters, form fields, environment variables), never to paper over a broken upstream contract."},
{q:"Under exactOptionalPropertyTypes, why does { note?: string } reject { note: undefined }, and what changes in a PATCH request body?", a:"The flag separates absent from present-but-undefined; note?: string means the key may be missing, not that it may hold undefined. In a PATCH, an absent key means \"leave unchanged\" while an explicit null or undefined may mean \"clear it\", so you must model it explicitly (note?: string | null)."},
{q:"A 4,000-line JavaScript repository has no types. Plan the migration in phases with an observable exit criterion for each phase.", a:"(1) Add tsconfig with allowJs, checkJs off; CI runs tsc --noEmit (exit: green). (2) Add // @ts-check and JSDoc to leaf utilities (exit: zero errors per checked file). (3) Rename leaves to .ts, then callers, entry points last (exit: no .js files left in src). (4) Enable strict sub-flags then noUncheckedIndexedAccess one at a time, tracking the error count down to zero; replace any with unknown plus narrowing (exit: no explicit any, no @ts-ignore)."}
],
checks:[
{q:"Which TypeScript release made strict mode the default, and which release is the Go port?", a:"TypeScript 6.0 (March 2026) made strict the default; TypeScript 7.0 (July 2026) is the native Go port."},
{q:"Does Node.js type stripping check types?", a:"No. It replaces types with whitespace and runs the code; type checking requires tsc."},
{q:"What does z.infer<typeof Schema> give you?", a:"The static TypeScript type derived from the runtime schema, so the type and the validator cannot drift apart."}
],
explain:"Explain to ADA, with the 72-million-foot report as the example, why a cast on res.json() compiles but proves nothing, and walk her through where a Zod schema belongs and what z.infer adds."},
{id:"p50m3", title:"Functional Programming I: Pure Functions, Immutability, Higher-Order Functions, Closures and Recursion in TypeScript and Python", minutes:55,
outcomes:["Classify code as pure or effectful and restructure it as a functional core inside an imperative shell.","Get real immutability in TypeScript and Python (spread, toSorted, Object.freeze, frozen dataclasses) and state its costs and the structural-sharing fix.","Write higher-order functions and closures, and diagnose the var-in-loop, late-binding and mutable-default bugs.","Express data processing with map, filter and reduce (and comprehensions in Python), including the empty-input case.","Use recursion where depth is bounded, explain the stack limits of V8 and CPython, and apply memoization to pure functions."],
body:`<p>What changes when you treat functions as values and refuse to mutate data? Testing (Domain 20) becomes trivial, because a function that depends only on its arguments needs no mocks. The data races of Domain 15 cannot happen to data nobody writes. And whole platforms run on these ideas: React (Domain 5) renders through pure functions, Spark (Domain 36) is map, filter and reduce at cluster scale, and Domain 13's recursion is the functional loop. You will see each idea in TypeScript and Python side by side.</p>
<h4>Pure functions and side effects</h4>
<p>A <strong>pure function</strong> returns the same output for the same input and has no observable effect beyond computing that output. A <strong>side effect</strong> is anything else it does to the world: writing a file, a log line or a database row, mutating an argument or a global, reading the clock (<code>Date.now()</code>), drawing a random number, calling the network. Purity buys <strong>referential transparency</strong>: you may replace a call with its value without changing the program, which is what lets you reason about code like algebra, cache it, run it in parallel and test it with a table of inputs. The fiber loss budget from Domain 24 is a perfect pure function: 12.4 km × 0.35 dB/km + 6 splices × 0.1 dB + 2 connectors × 0.5 dB = 4.34 + 0.60 + 1.00 = 5.94 dB, today, tomorrow and on any machine. Real programs need effects, so the design rule (Gary Bernhardt's "functional core, imperative shell") is to push them to the edges: a thin shell reads input, calls a pure core that makes every decision, and writes the result. Module 6 grows this rule into an architecture.</p>
<h4>Immutability, honestly</h4>
<p><strong>Immutability</strong> means a value never changes after it is created; you build a new one instead. JavaScript's <code>const</code> is not it — <code>const</code> freezes the <em>binding</em>, not the object, so <code>const r = { feet: 3220 }; r.feet = 0</code> is legal. <code>Object.freeze</code> is real but shallow: nested objects stay writable. TypeScript's <code>readonly</code>, <code>Readonly&lt;T&gt;</code> and <code>ReadonlyArray&lt;T&gt;</code> are compile-time only and erase. In practice you get immutability by convention plus tooling: spread to copy (<code>{ ...reel, endFt: 7230 }</code>), the ES2023 non-mutating array methods <code>toSorted</code>, <code>toReversed</code>, <code>toSpliced</code> and <code>with</code> (instead of <code>sort</code> and <code>reverse</code>, which mutate in place), and <code>structuredClone</code> for a deep copy. Python has stronger tools: tuples, <code>frozenset</code>, and <code>@dataclass(frozen=True)</code>, whose instances raise <code>FrozenInstanceError</code> on assignment, with <code>dataclasses.replace</code> to make a modified copy. The cost is copying: replacing one field of a 1,000-element array by copy is O(n). <strong>Persistent data structures</strong> remove most of it by sharing structure — Clojure's vectors are 32-way trees, so a million elements are only ⌈log₃₂ 10⁶⌉ = 4 levels deep and an "update" copies four small nodes, not a million slots.</p>
<h4>Functions as values: higher-order functions and closures</h4>
<p>In both languages functions are first-class values: you can store them, pass them and return them. A <strong>higher-order function</strong> takes a function or returns one — <code>map</code>, <code>filter</code>, <code>sort</code> with a comparator, <code>setTimeout</code>, every decorator. A <strong>closure</strong> is a function together with the variables in scope where it was created; those variables live on after the outer function returns, privately. That is state without a class, and the source of two classic bugs:</p>
<pre><code>// 1. A closure keeps its own private state.
function makeCounter(start = 0) {
  let n = start;                 // lives on after makeCounter returns
  return () =&gt; ++n;
}
const next = makeCounter(100);
console.log(next(), next(), next());

// 2. var is function-scoped: three callbacks share one i. let makes a fresh binding per iteration.
for (var i = 0; i &lt; 3; i++) setTimeout(() =&gt; console.log("var", i), 0);
for (let j = 0; j &lt; 3; j++) setTimeout(() =&gt; console.log("let", j), 0);
$ node closures.ts
101 102 103
var 3
var 3
var 3
let 0
let 1
let 2</code></pre>
<pre><code>def make_counter(start=0):
    n = start
    def step():
        nonlocal n          # rebind the enclosing variable instead of creating a local
        n += 1
        return n
    return step

nxt = make_counter(100)
print(nxt(), nxt(), nxt())

late = [lambda: i for i in range(3)]          # all three close over the same i
bound = [lambda i=i: i for i in range(3)]     # default argument captures the value now
print([f() for f in late], [f() for f in bound])

def add_reel(reel, batch=[]):                 # the default list is created once, at def time
    batch.append(reel)
    return batch
print(add_reel("R17"), add_reel("R18"))
$ python3 closures.py
101 102 103
[2, 2, 2] [0, 1, 2]
['R17', 'R18'] ['R17', 'R18']</code></pre>
<p>Read the bugs mechanically. <code>var</code> is function-scoped, so three callbacks share one variable that is 3 when they run; <code>let</code> makes a fresh binding per iteration. Python closures capture variables, not values (late binding), so all three lambdas see the final <code>i</code>, while a default argument is evaluated at definition time. A mutable default is created <em>once</em>, when <code>def</code> runs, so every call shares one list — the most common Python bug in review. Without <code>nonlocal</code>, <code>n += 1</code> would create a local and raise <code>UnboundLocalError</code>.</p>
<h4>map, filter and reduce in two languages</h4>
<p><code>map</code> transforms each element, <code>filter</code> keeps those that pass a predicate, and <code>reduce</code> (a <em>fold</em>) combines all of them into one value using an accumulator. Together they replace most loops with a statement of intent:</p>
<pre><code>type Reel = Readonly&lt;{ id: string; crew: string; status: "installed" | "staged"; startFt: number; endFt: number }&gt;;
const reels: readonly Reel[] = [
  { id: "R17", crew: "north", status: "installed", startFt: 10450, endFt: 7230 },
  { id: "R18", crew: "south", status: "installed", startFt: 8000, endFt: 6125 },
  { id: "R19", crew: "north", status: "staged", startFt: 12000, endFt: 12000 },
  { id: "R20", crew: "north", status: "installed", startFt: 6000, endFt: 3590 },
];
const used = (r: Reel) =&gt; r.startFt - r.endFt;                 // pure

const north = reels
  .filter((r) =&gt; r.crew === "north" &amp;&amp; r.status === "installed")
  .map(used)
  .reduce((sum, ft) =&gt; sum + ft, 0);
console.log("north:", north, "ft =", (north * 0.3048).toFixed(1), "m");
console.log(reels.toSorted((a, b) =&gt; used(b) - used(a)).map((r) =&gt; r.id).join(" &gt; "));
console.log("input untouched:", reels.map((r) =&gt; r.id).join(","));
$ node pipeline.ts
north: 5630 ft = 1716.0 m
R17 &gt; R20 &gt; R18 &gt; R19
input untouched: R17,R18,R19,R20</code></pre>
<p>Check the arithmetic: north's installed reels used 3,220 + 2,410 = 5,630 ft, which is 1,716.0 m. In Python the same pipeline is <code>sum(used(r) for r in reels if is_north(r))</code> over a tuple of <code>@dataclass(frozen=True)</code> records, or literally <code>reduce(lambda acc, ft: acc + ft, map(used, filter(is_north, reels)), 0)</code>; both print 5630. Three details matter. Always give <code>reduce</code> an initial value: in JavaScript, <code>[].reduce((a, b) =&gt; a + b)</code> throws "TypeError: Reduce of empty array with no initial value", and the empty case always arrives in production. Each chained call is a full pass that allocates a new array — 3n work, still O(n); Module 4's lazy iterators fuse the passes. And Python prefers comprehensions and built-ins (<code>sum</code>, <code>any</code>, <code>max(key=…)</code>) to <code>map</code> and <code>lambda</code>; Guido van Rossum moved <code>reduce</code> into <code>functools</code> in Python 3 for that reason. Write each language the way its community reads it.</p>
<h4>Recursion, the stack and memoization</h4>
<p><strong>Recursion</strong> is the functional loop: a function defined in terms of smaller instances of itself, with a base case. It fits recursive data — directory trees, JSON, Domain 15's syntax trees — but every call uses a stack frame, and the stack is small. The ECMAScript 2015 standard specified proper tail calls, yet only Safari's JavaScriptCore implements them; V8 (Node.js, Chrome) does not, so deep recursion in Node throws. Python deliberately has no tail-call elimination and a default limit of 1,000 frames (<code>sys.getrecursionlimit()</code>), raising <code>RecursionError</code>. In a Node 22 test run a trivial recursive function died after about 9,600 frames; measure yours, because the number depends on frame size and version. Recurse over trees, whose depth is small; iterate over long lists.</p>
<pre><code>let calls = 0;
function fib(n: number): number { calls++; return n &lt; 2 ? n : fib(n - 1) + fib(n - 2); }
console.log("naive fib(30) =", fib(30), "calls:", calls);

function memoize&lt;A, R&gt;(f: (a: A) =&gt; R): (a: A) =&gt; R {
  const cache = new Map&lt;A, R&gt;();              // the closure owns the cache
  return (a) =&gt; {
    if (!cache.has(a)) cache.set(a, f(a));
    return cache.get(a) as R;
  };
}
let mcalls = 0;
const mfib: (n: number) =&gt; number = memoize((n: number) =&gt; {
  mcalls++;
  return n &lt; 2 ? n : mfib(n - 1) + mfib(n - 2);
});
console.log("memo  fib(30) =", mfib(30), "calls:", mcalls);

const sumTo = (n: number): number =&gt; (n === 0 ? 0 : n + sumTo(n - 1));
try { sumTo(100_000); } catch (e) { console.log((e as Error).name + ": " + (e as Error).message); }
$ node memo.ts
naive fib(30) = 832040 calls: 2692537
memo  fib(30) = 832040 calls: 31
RangeError: Maximum call stack size exceeded</code></pre>
<p>The call counts are worth deriving. Naive <code>fib(n)</code> makes C(n) = C(n−1) + C(n−2) + 1 calls with C(0) = C(1) = 1, which solves to 2F(n+1) − 1: for n = 30 that is 2 × 1,346,269 − 1 = 2,692,537 calls, exponential growth at about 1.618ⁿ. <strong>Memoization</strong> caches each result the first time it is computed, so each of the 31 values from 0 to 30 is computed once: 31 calls, O(n). It is correct <em>only</em> for pure functions — memoize something that reads the clock and you cache a lie. Python ships it as <code>@functools.cache</code> (and <code>lru_cache(maxsize=…)</code> when memory must be bounded); with it, <code>fib(90)</code> = 2,880,067,194,370,816,120 takes 91 calls. The closure in <code>memoize</code> holds private state, as an object would. Python's <code>functools.partial</code>, <code>itertools</code> (<code>accumulate</code>, <code>chain</code>, <code>groupby</code>, <code>islice</code>) and <code>operator</code> complete the toolkit.</p>
<p><em>Certification mapping.</em> JSA-41-01 Block 4 objective 4.2 (closures and IIFEs), 4.3 (call forwarding and context) and 4.4 (function decorators) are this module in JavaScript form, and Block 3 objective 3.5 (advanced array methods) is the map/filter/reduce section; expect output-prediction questions like the <code>var</code> loop. For Python, the PCAP associate exam tests closures, lambdas, <code>map</code>/<code>filter</code> and generators in the same style.</p>`,
example:`<p><strong>Splitting a splice report into core and shell.</strong> The original <code>report()</code> reads <code>splices.csv</code>, loops with a global <code>total</code>, prints a header containing <code>new Date()</code> and pushes failures into a module-level array: four side effects, untestable without files and a frozen clock. Refactor in three pure pieces. <code>parse(text: string): Splice[]</code> turns CSV text into records. <code>evaluate(s: Splice, limitDb = 0.30): Verdict</code> returns <code>{ id, lossDb, ok: s.lossDb &lt;= limitDb }</code>. <code>summarize(vs: readonly Verdict[])</code> is one <code>reduce</code> producing <code>{ count, totalDb, failed }</code>. For the losses 0.05, 0.08, 0.42, 0.03, 0.11 and 0.35 dB it returns count 6, total 1.04 dB (mean 0.173 dB) and failed = [S3 at 0.42, S6 at 0.35]. The shell is now four lines: read the file, call the core, format with a <code>now</code> passed in as an argument, print. The tests are a table of inputs and expected outputs — empty file (count 0, total 0, which is why <code>reduce</code> needs its initial value), all passing, exactly 0.30 dB (passes: the limit is inclusive) and a malformed line — and they run in milliseconds with no fixtures, mocks or temporary files. The same split in Python uses frozen dataclasses and <code>sum(v.loss_db for v in verdicts)</code>.</p>`,
misconceptions:["\"const makes an object immutable.\" const only prevents reassigning the variable; the object it points to can still be changed. Use copies, Object.freeze (shallow), or readonly types plus discipline.","\"Functional code is slower because it copies everything.\" Most pipelines are O(n) either way; copying cost matters only in hot loops over large data, where persistent data structures with structural sharing or a local mutable loop inside a pure function solve it.","\"A closure copies the variables it uses.\" It captures the variables themselves (by reference), which is why a var loop counter shows its final value in every callback and why Python lambdas in a loop all see the last i."],
problems:[
{q:"Classify each as pure or impure and name the effect: (a) (km) => km * 0.35; (b) () => Date.now() - start; (c) (xs) => xs.sort(); (d) (xs) => xs.toSorted(); (e) (n) => { console.log(n); return n * 2; }.", a:"(a) pure. (b) impure: reads the clock and a free variable. (c) impure: sort mutates its argument in place. (d) pure: returns a new array. (e) impure: writes to the console, even though the return value is deterministic."},
{q:"Derive the number of calls naive fib(25) makes, and the number with memoization.", a:"C(n) = 2F(n+1) − 1. F(26) = 121,393, so C(25) = 242,785 calls. With memoization, one computation per n from 0 to 25: 26 calls."},
{q:"This Python function is called three times: def tag(reel, seen=[]): seen.append(reel); return len(seen). What do tag(\"R1\"), tag(\"R2\"), tag(\"R3\") return, why, and what is the idiomatic fix?", a:"1, 2, 3 — the default list is created once when def runs and shared by every call. Fix: def tag(reel, seen=None): seen = [] if seen is None else seen; … (or better, make the function pure and return a new list)."},
{q:"Write a reduce that returns both the total and the maximum splice loss in one pass over [0.05, 0.42, 0.11], with an initial value that makes the empty array safe. What does it return for []?", a:"xs.reduce((acc, x) => ({ total: acc.total + x, max: Math.max(acc.max, x) }), { total: 0, max: -Infinity }) → { total: 0.58, max: 0.42 } (subject to floating-point rounding); for [] it returns { total: 0, max: -Infinity } instead of throwing."},
{q:"A colleague totals footage over 50,000 daily records with const total = ([h, ...rest]) => h ? h.feet + total(rest) : 0. It throws RangeError in Node, and even on a small input it is slow. Diagnose both problems and fix them.", a:"Depth: one stack frame per record, 50,000 frames, far beyond V8's roughly 10,000 (V8 has no tail-call elimination). Cost: each ...rest copies the remaining array, so the work is n + (n−1) + … ≈ n²/2 ≈ 1.25 billion element copies. Fix: records.reduce((sum, r) => sum + r.feet, 0) — O(n) time, constant stack."}
],
checks:[
{q:"Two properties of a pure function?", a:"Same output for the same input, and no observable side effects."},
{q:"Which ES2023 method sorts without mutating the array?", a:"Array.prototype.toSorted (also toReversed, toSpliced and with)."},
{q:"Default recursion limit in CPython, and the exception raised?", a:"1,000 frames; RecursionError."}
],
explain:"Teach ADA why the var loop prints 3, 3, 3 and the let loop prints 0, 1, 2, using the word closure correctly, and then explain why memoizing a function that calls Date.now() is a bug."},
{id:"p50m4", title:"Functional Programming II: Algebraic Data Types, Pattern Matching, Option and Result, Composition, Laziness — and a Taste of Haskell", minutes:60,
outcomes:["Count the states of product and sum types and redesign a model so that illegal states cannot be represented.","Use Python structural pattern matching with class and mapping patterns, guards and assert_never, and its TypeScript equivalent.","Replace null and exceptions with Option and Result values for expected failures, chaining steps with andThen/flatMap.","Compose pipelines with pipe, currying and partial application, and relate them to Unix pipes.","Explain lazy evaluation with generators and iterator helpers, measure its memory effect, and read a short Haskell program."],
body:`<p>How do you make illegal states unrepresentable and errors impossible to ignore? Module 3 gave you functions as values; this module designs <em>data</em> so the compiler rules out whole bug classes. "Make illegal states unrepresentable" is Yaron Minsky's phrase from Jane Street, a trading firm built on OCaml, and the bug it targets has a famous price: Tony Hoare called his 1965 null reference his "billion-dollar mistake". You will see the ideas in TypeScript and Python, then in Haskell, their native form.</p>
<h4>Algebraic data types: counting states</h4>
<p>An <strong>algebraic data type</strong> is built from two operations, and the names come from counting. A <em>product type</em> (a record, tuple or object) holds one of each field, so its number of possible values is the product: <code>{ ok: boolean; level: "a" | "b" | "c" }</code> has 2 × 3 = 6. A <em>sum type</em> (a tagged union) holds exactly one of its variants, so its count is the sum: <code>boolean | "a" | "b" | "c"</code> has 2 + 3 = 5. A loading state written as a product, <code>{ loading: boolean; error?: string; data?: Reel[] }</code>, has 2 × 2 × 2 = 8 shapes (each optional present or absent) of which 3 are meaningful; the other 5, such as loading <em>and</em> failed, are bugs waiting for a code path. As a sum, <code>{ status: "loading" } | { status: "error"; error: string } | { status: "ok"; data: Reel[] }</code> has exactly 3, and the impossible ones cannot be written. In TypeScript the sum type is Module 1's discriminated union; in Python a union of frozen dataclasses; in Haskell, Rust, OCaml and F# the central feature.</p>
<h4>Pattern matching</h4>
<p><strong>Pattern matching</strong> tests a value's shape and binds its parts in one step. Python has it since 3.10 (PEP 634): <code>match</code>/<code>case</code> with class and mapping patterns, guards and the wildcard <code>_</code>; pyright and mypy check exhaustiveness when the last case calls <code>typing.assert_never</code>. JavaScript has no <code>match</code> (a TC39 proposal is not in the language), so TypeScript uses <code>switch</code> on the tag plus the <code>never</code> check.</p>
<pre><code>from dataclasses import dataclass
from math import pi
from typing import assert_never

@dataclass(frozen=True)
class Circle:
    r: float

@dataclass(frozen=True)
class Rect:
    w: float
    h: float

type Shape = Circle | Rect                # Python 3.12 type alias: a sum of two products

def area(s: Shape) -&gt; float:
    match s:
        case Circle(r=r):
            return pi * r * r
        case Rect(w=w, h=h) if w == h:    # guard: squares take this branch
            return w * w
        case Rect(w=w, h=h):
            return w * h
        case _:
            assert_never(s)               # pyright/mypy error if a variant is unhandled

def describe(event: dict) -&gt; str:
    match event:
        case {"type": "splice", "loss_db": float(db)} if db &gt; 0.30:
            return f"splice FAILED at {db} dB"
        case {"type": "splice", "loss_db": float(db)}:
            return f"splice ok at {db} dB"
        case _:
            return "unknown event"

print([round(area(s), 4) for s in (Circle(1), Rect(3, 4), Rect(5, 5))])
print(describe({"type": "splice", "loss_db": 0.42}), "|", describe({"type": "otdr"}))
$ python3 adt.py
[3.1416, 12, 25]
splice FAILED at 0.42 dB | unknown event</code></pre>
<p>Cases are tried top to bottom, so the guarded square case must precede the general rectangle. And <code>float(db)</code> checks the type as it binds: a string <code>"0.42"</code> falls through to "unknown event" — validation for free.</p>
<h4>Option and Result instead of null and exceptions</h4>
<p>An <strong>option type</strong> (<code>Option&lt;T&gt;</code> in Rust, <code>Maybe a</code> in Haskell) is a sum of "some value" and "none", and a <strong>result type</strong> (<code>Result&lt;T, E&gt;</code>, <code>Either</code>) is a sum of success with a value and failure with an error. Absence or failure then appears <em>in the signature</em>, so the caller cannot forget it; with <code>strictNullChecks</code>, <code>T | undefined</code> is already an honest option. Exceptions are invisible: nothing in <code>parse(line: string): Line</code> says it throws. The professional rule: return a Result for <em>expected</em> failures (bad input, not found), throw for <em>bugs</em> and unrecoverable conditions. Steps chain with <code>andThen</code> (also called <code>flatMap</code> or <code>bind</code>), which runs the next step only on success:</p>
<pre><code>type Result&lt;T, E = string&gt; = { ok: true; value: T } | { ok: false; error: E };
const Ok = &lt;T&gt;(value: T): Result&lt;T, never&gt; =&gt; ({ ok: true, value });
const Err = &lt;E&gt;(error: E): Result&lt;never, E&gt; =&gt; ({ ok: false, error });

function andThen&lt;T, U, E&gt;(r: Result&lt;T, E&gt;, f: (t: T) =&gt; Result&lt;U, E&gt;): Result&lt;U, E&gt; {
  return r.ok ? f(r.value) : r;   // short-circuit: an error flows through untouched
}

type Line = { id: string; startFt: number; endFt: number };

function parse(line: string): Result&lt;Line&gt; {
  const [id, a, b] = line.split(",");
  const startFt = Number(a), endFt = Number(b);
  if (!id || !Number.isInteger(startFt) || !Number.isInteger(endFt)) return Err("cannot parse '" + line + "'");
  return Ok({ id, startFt, endFt });
}
function check(l: Line): Result&lt;Line&gt; {
  return l.endFt &lt;= l.startFt ? Ok(l) : Err(l.id + ": end " + l.endFt + " ft exceeds start " + l.startFt + " ft");
}
const used = (l: Line): Result&lt;number&gt; =&gt; Ok(l.startFt - l.endFt);

for (const line of ["R17,10450,7230", "R18,8000,9125", "R19,12k,11000"]) {
  const r = andThen(andThen(parse(line), check), used);
  console.log(r.ok ? line + " -&gt; " + r.value + " ft" : line + " -&gt; ERROR " + r.error);
}
$ node result.ts
R17,10450,7230 -&gt; 3220 ft
R18,8000,9125 -&gt; ERROR R18: end 9125 ft exceeds start 8000 ft
R19,12k,11000 -&gt; ERROR cannot parse 'R19,12k,11000'</code></pre>
<p>Each failure keeps the message of the step that failed, with no <code>try</code> and no way to read <code>value</code> without checking <code>ok</code>. Libraries such as neverthrow and Effect add method chaining; Rust builds the short-circuit into <code>?</code>. A type with a "wrap a value" function and a lawful <code>andThen</code> is a <strong>monad</strong>: Option, Result, arrays (<code>flatMap</code>) and, nearly, <code>Promise</code> (<code>then</code>). You need the pattern, not the word.</p>
<h4>Composition, currying and pipelines</h4>
<p><strong>Function composition</strong> builds a function from functions: compose(f, g)(x) = f(g(x)), and <code>pipe</code> is the same read left to right, the way data flows. You already compose in the shell: <code>grep R17 log | sort | uniq -c</code> (Domain 3). <strong>Currying</strong> turns a two-argument function into one that takes the first argument and returns a function awaiting the second, so <code>addSplices(6)</code> below is a ready-made stage. JavaScript's pipeline operator is still a proposal, so <code>pipe</code> is written with overloads:</p>
<pre><code>function pipe&lt;A, B&gt;(ab: (a: A) =&gt; B): (a: A) =&gt; B;
function pipe&lt;A, B, C&gt;(ab: (a: A) =&gt; B, bc: (b: B) =&gt; C): (a: A) =&gt; C;
function pipe&lt;A, B, C, D&gt;(ab: (a: A) =&gt; B, bc: (b: B) =&gt; C, cd: (c: C) =&gt; D): (a: A) =&gt; D;
function pipe(...fns: Array&lt;(x: unknown) =&gt; unknown&gt;) {
  return (x: unknown) =&gt; fns.reduce((acc, f) =&gt; f(acc), x);
}

const kmToDb = (km: number) =&gt; km * 0.35;                    // fiber attenuation at 1310 nm
const addSplices = (n: number) =&gt; (db: number) =&gt; db + n * 0.1; // curried: returns a function
const addConnectors = (n: number) =&gt; (db: number) =&gt; db + n * 0.5;

const linkLoss = pipe(kmToDb, addSplices(6), addConnectors(2));
console.log(linkLoss(12.4).toFixed(2), "dB");                 // 4.34 + 0.60 + 1.00

function* naturals() { let n = 1; while (true) yield n++; }  // infinite, but lazy
const firstSquaresOver50 = naturals()
  .map((n) =&gt; n * n)          // ES2025 iterator helpers: nothing runs yet
  .filter((sq) =&gt; sq &gt; 50)
  .take(3)
  .toArray();                  // pulls exactly as many values as needed
console.log(firstSquaresOver50);
$ node pipe.ts
5.94 dB
[ 64, 81, 100 ]</code></pre>
<h4>Lazy evaluation</h4>
<p>The second half of that program is <strong>lazy evaluation</strong>: computing a value only when it is demanded. <code>naturals()</code> is an infinite generator that costs nothing until asked, and the ES2025 iterator helpers (<code>map</code>, <code>filter</code>, <code>take</code>, <code>toArray</code> and friends, in Node 22+) run element by element: 1 … 49 are squared and rejected, 64, 81 and 100 pass, and <code>take(3)</code> stops after the tenth number — no intermediate arrays, passes fused. Python's generators and <code>itertools.islice</code> do the same. Measured on CPython 3.13, <code>[n * n for n in range(1_000_000)]</code> peaks at about 40 MB (an 8.4 MB pointer array plus a million integer objects), while the generator expression <code>(n * n for n in range(1_000_000))</code> is a 200-byte object and summing it peaks at a few hundred bytes. The costs: work happens when you did not choose, a generator is consumed once, and errors surface where values are used.</p>
<h4>A taste of Haskell</h4>
<p>In Haskell all of this is the default: functions are pure (effects live in the <code>IO</code> type), data is immutable, functions are curried, evaluation is lazy, and algebraic data types are how you model anything. Install GHC, <code>ghci</code> and <code>runghc</code> with GHCup (haskell.org/ghcup):</p>
<pre><code>-- shapes.hs   run with: runghc shapes.hs
data Shape = Circle Double | Rect Double Double | Tri Double Double Double

area :: Shape -&gt; Double
area (Circle r)  = pi * r * r
area (Rect w h)  = w * h
area (Tri a b c) = sqrt (p * (p - a) * (p - b) * (p - c))
  where p = (a + b + c) / 2

safeDiv :: Int -&gt; Int -&gt; Maybe Int
safeDiv _ 0 = Nothing
safeDiv a b = Just (div a b)

main :: IO ()
main = do
  mapM_ (print . area) [Circle 1, Rect 3 4, Tri 3 4 5]
  print (safeDiv 3220 4, safeDiv 1 0)
  print (take 3 (filter (&gt; 50) (map (^ 2) [1 ..])))
  print (sum [s - e | (s, e) &lt;- [(10450, 7230), (6000, 3590)]])

$ runghc shapes.hs
3.141592653589793
12.0
6.0
(Just 805,Nothing)
[64,81,100]
5630</code></pre>
<p>Read it against the TypeScript: <code>data Shape</code> is the discriminated union in one line; <code>area</code> is defined by pattern matching (<code>ghc -Wall</code> warns about a forgotten constructor); <code>Maybe Int</code> makes division by zero a value; <code>[1 ..]</code> is an infinite list made safe by laziness; <code>print . area</code> is composition. In <code>ghci</code>, <code>:t map</code> answers <code>map :: (a -&gt; b) -&gt; [a] -&gt; [b]</code>. OCaml and F# (<code>dotnet fsi</code>) teach the same ideas with strict evaluation; the free Helsinki Haskell MOOC is the next step.</p>
<p><em>Certification mapping.</em> JSA-41-01 objectives 4.5 (generators and iterators) and 4.7–4.9 (promises, chaining, <code>async</code>/<code>await</code>) are this module in JavaScript form — <code>then</code> is <code>andThen</code> for asynchronous results. Expect questions on what a generator yields, when its body runs, and how a rejection propagates.</p>`,
example:`<p><strong>Redesigning a splice-tray record.</strong> The old record is <code>{ fused: boolean; lossDb?: number; failReason?: string; retest: boolean }</code>: 2 × 2 × 2 × 2 = 16 shapes, of which only 3 are legal (not yet fused; fused with a loss; failed with a reason and a retest flag). Suppose the export from a 288-fiber closure contains 7 records with <code>fused: false</code> <em>and</em> a loss value, and 2 with a failure reason but <code>fused: true</code> — 9 contradictions every report must guess about. The sum-type redesign is <code>type Tray = { kind: "pending" } | { kind: "fused"; lossDb: number } | { kind: "failed"; reason: string; retest: boolean }</code>: exactly 3 shapes, so the 9 contradictions cannot be stored. Parsing the field CSV returns <code>Result&lt;Tray, string&gt;</code> per line; a line such as <code>F143,fused,</code> (fused with no loss) becomes <code>{ ok: false, error: "F143: fused without lossDb" }</code> and goes to a reject list for the splicer to re-shoot, rather than becoming a silent zero. Summaries pattern-match on <code>kind</code> with a <code>never</code> default, so adding a fourth state ("deferred") later produces one compile error per report that must decide what to do with it. Count: 288 fibers, 279 fused (mean 0.04 dB), 6 failed, 3 pending, 0 contradictions — by construction.</p>`,
misconceptions:["\"Option and Result are just null and exceptions with extra typing.\" The difference is that absence and failure appear in the type, so the compiler forces every caller to handle them; null and exceptions are invisible in signatures.","\"Functional programming means never using exceptions.\" Use Result for expected, recoverable failures and exceptions for bugs and unrecoverable conditions; mixing them deliberately is normal.","\"Lazy evaluation is always faster.\" It avoids unneeded work and memory, but it moves when work happens, lets errors surface far from their cause, and a generator can be consumed only once."],
problems:[
{q:"Count the representable states of { connected: boolean; retries: 0 | 1 | 2 | 3; error?: \"timeout\" | \"refused\" } (treat a missing optional as one state), then redesign it as a sum type with only the meaningful states: idle, connecting with a retry count, connected, failed with an error.", a:"2 × 4 × 3 = 24 states. Sum: { s: \"idle\" } | { s: \"connecting\"; retries: 0 | 1 | 2 | 3 } | { s: \"connected\" } | { s: \"failed\"; error: \"timeout\" | \"refused\" } = 1 + 4 + 1 + 2 = 8 states, all meaningful."},
{q:"Write andThen for an Option type Option<T> = { some: true; value: T } | { some: false } and use it to chain parseInt-like parsing and a non-zero check.", a:"function andThen<T, U>(o: Option<T>, f: (t: T) => Option<U>): Option<U> { return o.some ? f(o.value) : o; } — then andThen(parseNum(s), (n) => n !== 0 ? { some: true, value: n } : { some: false }). A none from either step short-circuits."},
{q:"In Python, this match never reaches the second case for squares: case Rect(w=w, h=h): … case Rect(w=w, h=h) if w == h: … Explain and fix.", a:"Cases are tried top to bottom and the first, unguarded Rect pattern matches every rectangle, including squares. Put the guarded (more specific) case first."},
{q:"How many squares does naturals().map(n => n * n).filter(sq => sq > 50).take(3).toArray() compute, and how many would an eager version over the array 1..1000 compute?", a:"Lazily: 10 (n = 1 … 10; 64, 81 and 100 pass, then take stops the generator). Eagerly over 1..1000: all 1,000 squares are computed and filtered before taking 3 — 100 times more work."},
{q:"A pipeline compose(validate, parse) is meant to run parse first. With compose(f, g)(x) = f(g(x)) and pipe(f, g)(x) = g(f(x)), which order does each produce, and which reads like the data flow?", a:"compose(validate, parse)(x) = validate(parse(x)): parse runs first, as intended, but reads right to left. pipe(parse, validate) gives the same result and reads left to right in data-flow order, like a Unix pipe."}
],
checks:[
{q:"Why are they called sum and product types?", a:"A product (record) has |A| × |B| values; a sum (tagged union) has |A| + |B| values."},
{q:"Which Python version introduced match/case, and which function marks an exhaustive default?", a:"Python 3.10 (PEP 634); typing.assert_never."},
{q:"What does the Haskell type Maybe Int express?", a:"An optional Int: either Just n or Nothing — Haskell's option type."}
],
explain:"Ask ADA to count the states of a loading flag record and of its discriminated-union redesign, then explain to her when a function should return a Result and when it should throw."},
{id:"p50m5", title:"Design Patterns That Matter: SOLID With Honest Critique, the Useful Dozen in TypeScript and Python, and When a Pattern Is Over-Engineering", minutes:55,
outcomes:["State each SOLID principle, what it gets right and how it is misused, and apply the Liskov test to a subtype.","Implement strategy, observer and command idiomatically with functions and types rather than class hierarchies.","Implement decorator and adapter (plus facade, proxy, composite, factory and builder) in TypeScript and Python, and explain why a singleton is usually a disguised global.","Prefer composition over inheritance and justify it in terms of coupling.","Diagnose over-engineering with YAGNI, the rule of three and the deep-module test, and argue for deleting a pattern."],
body:`<p>Which named designs earn their complexity, and how do you know before you pay for them? Domain 20 gave you SOLID in a table and six patterns in a paragraph; this module writes them in real TypeScript and Python, critiques them, and teaches the harder skill of <em>not</em> using them. The canon is <em>Design Patterns</em> (Gamma, Helm, Johnson and Vlissides — the "Gang of Four", 1994): 23 patterns, 5 creational, 7 structural and 11 behavioral, written for C++ and Smalltalk. In 1996 Peter Norvig showed that 16 of the 23 become invisible or much simpler with first-class functions, which TypeScript and Python have. Learn each pattern's <em>intent</em> — the vocabulary of code review and of frameworks (Express middleware is a chain of responsibility, Node streams are iterators) — and expect implementations smaller than the book's diagrams.</p>
<h4>SOLID, honestly</h4>
<p><strong>SOLID</strong> is Robert C. Martin's acronym for five object-oriented design principles. Each contains a real insight and a common misreading:</p>
<table><tr><th>Principle</th><th>What it gets right</th><th>How it is misused</th></tr>
<tr><td>Single responsibility</td><td>A module should have one reason to change — Martin's 2017 restatement: one <em>actor</em> who requests changes</td><td>Read as "one method per class", producing dozens of anemic classes</td></tr>
<tr><td>Open/closed</td><td>Add behavior by adding code (a new strategy or plug-in), not by editing tested code</td><td>Speculative extension points for variations that never arrive</td></tr>
<tr><td>Liskov substitution</td><td>A subtype must honor the base type's behavioral contract (Liskov and Wing, 1994)</td><td>Ignored: <code>Square extends Rectangle</code> breaks <code>setWidth</code>; TypeScript checks signatures, not behavior</td></tr>
<tr><td>Interface segregation</td><td>Depend only on what you use</td><td>Rarely misused in TypeScript, where structural types and <code>Pick&lt;T, K&gt;</code> make narrow interfaces free</td></tr>
<tr><td>Dependency inversion</td><td>Policy code depends on abstractions it owns; details plug in</td><td>An interface for every class, each with exactly one implementation</td></tr></table>
<p>The <strong>Liskov substitution principle</strong> is the most rigorous of the five and the one with a precise test: anywhere the base type works, the subtype must work, with no strengthened preconditions and no weakened postconditions. Dependency inversion is the most useful, because it is what makes code testable, and Module 6 turns it into an architecture. The honest critique: Dan North's CUPID (2022) argues that rules invite mechanical application and proposes properties instead (composable, Unix-philosophy, predictable, idiomatic, domain-based), and Casey Muratori's "Clean Code, Horrible Performance" (2023) measured a tight shape-area loop written with virtual dispatch running about 1.5 times slower than a <code>switch</code> and far slower than a lookup table — a real cost in a hot path of a game engine (Domain 40), and irrelevant in an I/O-bound web service. Principles are heuristics with costs. Above all, prefer <strong>composition over inheritance</strong>: build behavior by holding and calling other objects or functions, not by extending classes, because inheritance couples the subclass to every implementation detail of its parent.</p>
<h4>Behavioral patterns: strategy, observer, command</h4>
<p>The <strong>strategy pattern</strong> makes an algorithm swappable. In the book it is an interface with one method and a class per algorithm; in TypeScript and Python it is simply a function parameter: <code>budget(km, singleMode1550, splices)</code> instead of <code>budget(km, singleMode1310, splices)</code>, and <code>sorted(reels, key=used)</code> is the strategy pattern in one argument. The <strong>observer pattern</strong> lets subjects notify subscribers without knowing who they are — the basis of event emitters, DOM events and webhooks. The <strong>command pattern</strong> turns an action into an object you can queue, log, retry or undo. All three, plus a decorator, in idiomatic TypeScript:</p>
<pre><code>// OBSERVER: a typed event bus; subscribers do not know about each other.
type Events = { reelLow: { id: string; feetLeft: number }; installed: { id: string; feet: number } };
type Handler&lt;K extends keyof Events&gt; = (e: Events[K]) =&gt; void;
class Bus {
  private handlers: { [K in keyof Events]: Handler&lt;K&gt;[] } = { reelLow: [], installed: [] };
  on&lt;K extends keyof Events&gt;(type: K, h: Handler&lt;K&gt;): () =&gt; void {
    const list: Handler&lt;K&gt;[] = this.handlers[type];
    list.push(h);
    return () =&gt; { list.splice(list.indexOf(h), 1); };  // the unsubscribe function
  }
  emit&lt;K extends keyof Events&gt;(type: K, e: Events[K]): void {
    const list: Handler&lt;K&gt;[] = this.handlers[type];
    for (const h of list) h(e);
  }
}
const bus = new Bus();
bus.on("reelLow", (e) =&gt; console.log("ORDER more fiber:", e.id, "has", e.feetLeft, "ft"));
const stop = bus.on("installed", (e) =&gt; console.log("log:", e.id, "+" + e.feet + " ft"));
bus.emit("installed", { id: "R17", feet: 3220 });
stop();
bus.emit("installed", { id: "R18", feet: 1875 });   // nobody listening any more
bus.emit("reelLow", { id: "R20", feetLeft: 410 });

// COMMAND: each edit is an object that knows how to undo itself.
interface Command { run(): void; undo(): void; label: string }
const ledger: number[] = [];
const addRun = (ft: number): Command =&gt; ({
  label: "add " + ft, run: () =&gt; { ledger.push(ft); }, undo: () =&gt; { ledger.pop(); },
});
const history: Command[] = [];
function exec(c: Command) { c.run(); history.push(c); }
exec(addRun(3220)); exec(addRun(1875)); exec(addRun(2410));
history.pop()?.undo();
console.log("ledger", ledger, "total", ledger.reduce((a, b) =&gt; a + b, 0));

// DECORATOR: wrap behavior around a function without touching it.
function withRetry&lt;A extends unknown[], R&gt;(f: (...a: A) =&gt; Promise&lt;R&gt;, tries = 3) {
  return async (...a: A): Promise&lt;R&gt; =&gt; {
    for (let i = 1; ; i++) {
      try { return await f(...a); }
      catch (e) { if (i &gt;= tries) throw e; console.log("attempt", i, "failed:", (e as Error).message); }
    }
  };
}
let flaky = 0;
const readMeter = async (port: number) =&gt; {
  if (++flaky &lt; 3) throw new Error("timeout on port " + port);
  return -18.6;
};
console.log("power", await withRetry(readMeter)(1), "dBm");
$ node patterns.ts
log: R17 +3220 ft
ORDER more fiber: R20 has 410 ft
ledger [ 3220, 1875 ] total 5095
attempt 1 failed: timeout on port 1
attempt 2 failed: timeout on port 1
power -18.6 dBm</code></pre>
<p>Notice what the types buy: <code>bus.emit("reelLow", { id: "R20" })</code> is a compile error because <code>feetLeft</code> is missing, and a misspelled event name is rejected — the stringly-typed failure mode of Node's built-in <code>EventEmitter</code> is gone. Observers have two classic failure modes you should name in review. Forgotten subscriptions leak memory, which is why <code>on</code> returns an unsubscribe function and why Node prints "MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 reelLow listeners added" when an emitter passes 10 listeners. And control flow becomes invisible: who reacts to <code>installed</code> is no longer readable from the call site, so keep event names documented and few.</p>
<h4>Structural and creational patterns</h4>
<p>The <strong>decorator pattern</strong> wraps an object or function to add behavior without changing it: <code>withRetry</code> above adds retries to any async function, and Python's <code>@</code> syntax is the same idea applied at definition time (always use <code>functools.wraps</code> so the wrapper keeps the original's name). TypeScript 5.0 implements the standard ECMAScript decorators for classes, but Node's type stripping does not run them, so prefer higher-order functions for portable code. The <strong>adapter pattern</strong> converts an interface you are given into the one your code expects — the vendor SDK case, here with Python's <code>typing.Protocol</code>, which is structural typing exactly like a TypeScript interface:</p>
<pre><code>from math import log10
from typing import Protocol

class PowerMeter(Protocol):                 # the port: any object with read_dbm() fits
    def read_dbm(self) -&gt; float: ...

class VendorMeterV2:                        # third-party SDK with the "wrong" interface
    def get_reading(self) -&gt; dict:
        return {"value_mw": 0.0138, "unit": "mW"}

class VendorMeterAdapter:                   # ADAPTER: translate, do not modify the vendor
    def __init__(self, meter: VendorMeterV2) -&gt; None:
        self._meter = meter
    def read_dbm(self) -&gt; float:
        return round(10 * log10(self._meter.get_reading()["value_mw"]), 1)

def check_link(meter: PowerMeter, min_dbm: float = -25.0) -&gt; str:
    dbm = meter.read_dbm()
    return f"{dbm} dBm -&gt; {'PASS' if dbm &gt;= min_dbm else 'FAIL'}"

print(check_link(VendorMeterAdapter(VendorMeterV2())))
$ python3 adapter.py
-18.6 dBm -&gt; PASS</code></pre>
<p>The conversion is the Domain 24 formula: 10 × log₁₀(0.0138 mW) = −18.6 dBm, which passes a −25 dBm receiver threshold. The rest of the useful set: a <em>facade</em> gives a subsystem one simple entry point; a <em>proxy</em> stands in for an object to add laziness, caching or access control (JavaScript's <code>Proxy</code>); a <em>composite</em> treats a tree of parts uniformly (the DOM). A <em>factory</em> chooses which concrete thing to build (<code>parserFor(path)</code>), a <em>builder</em> assembles many optional parts (in TypeScript, usually an options object with defaults), and a <em>singleton</em> is a global with good manners that hides dependencies and makes tests order-dependent — create one instance in one place and pass it in.</p>
<h4>When a pattern is over-engineering</h4>
<p>Every pattern costs each reader another file, name and jump; count that against the variation it absorbs. The warning signs: An interface with exactly one implementation and no test double ("for the future"). A factory whose only job is to call a constructor. Inheritance three levels deep to share two methods. Names that describe the pattern rather than the domain — Spring really ships a class called <code>AbstractSingletonProxyFactoryBean</code>. Two rules keep you honest. YAGNI ("you aren't gonna need it", from Extreme Programming): do not build the extension point until the second variation exists. And the rule of three, which Martin Fowler credits to Don Roberts: tolerate duplication twice, extract the abstraction the third time, when you can see what actually varies. John Ousterhout's deep modules (Domain 20) give the positive test: a pattern is worth it when it hides a lot behind a small interface. The professional move in review is to ask "what variation does this absorb, and where is the second implementation?" — and to delete the pattern if nobody can answer.</p>
<p><em>Certification mapping.</em> JSA-41-01 Block 2 (Classes and the Class-Based Approach, 23%) tests class declarations, fields, accessors, inheritance, static members and classes versus constructor functions — the machinery under the class-based patterns — and objective 4.4 tests function decorators directly. Interviewers ask for strategy, observer, adapter and decorator by name, usually as "refactor this <code>switch</code>" or "add retries without editing this function".</p>`,
example:`<p><strong>One pattern added, one deleted.</strong> A reel-report service exports CSV, JSON and PDF through three separate <code>switch (format)</code> statements — <code>render</code>, <code>contentType</code> and <code>fileExtension</code> — in two files. Adding GeoJSON for the mapping team means editing all three switches (9 changed lines across 2 files, and the PDF branch of <code>fileExtension</code> was already missing a <code>break</code>). Apply the strategy pattern as data: <code>type Exporter = { render(r: Reel[]): string; contentType: string; ext: string }</code> and <code>const exporters: Record&lt;Format, Exporter&gt;</code>. Now GeoJSON is one new object in one file (12 lines), and because the registry is a <code>Record</code> over the <code>Format</code> union, adding <code>"geojson"</code> to the union without an exporter is a compile error. In the same review you find <code>ReelRepositoryFactory</code>, 38 lines whose only job is <code>return new SqliteReelRepository(path)</code>. Ask the two questions: what variation does it absorb (none — one implementation, constructed in one place), and where is the second implementation (the tests use an in-memory fake, so the <code>ReelRepository</code> <em>interface</em> earns its keep, but the factory does not). Delete the factory (−38 lines, −1 file), construct the repository in the composition root (Module 6), and the code base is smaller and more flexible at once.</p>`,
misconceptions:["\"Using more design patterns makes code more professional.\" Each pattern adds indirection that every reader pays for; it is justified only by a variation it absorbs. Unneeded patterns are a recognized smell (speculative generality).","\"The strategy pattern needs an interface and a class per algorithm.\" In languages with first-class functions a strategy is just a function (or an object of functions) passed as an argument; the class version is the C++ workaround.","\"Liskov substitution is satisfied if the subclass compiles.\" The type checker verifies signatures, not behavior; a Square that silently changes its height when setWidth is called compiles and still violates LSP."],
problems:[
{q:"class ReadOnlyList extends List overrides add() to throw an error. Which SOLID principle does this violate, how would a caller notice, and what is the better design?", a:"Liskov substitution: code written for List that calls add() now throws, so ReadOnlyList cannot stand in for List. Better: separate interfaces (ReadableList with get/size, and List extends it with add), or composition; ReadOnlyList implements only ReadableList."},
{q:"Your observer bus has a 'reelLow' event with three subscribers: an SMS sender, a dashboard update and an audit log. The SMS sender throws. With the Bus in this module, what happens to the other two, and how would you change emit?", a:"The loop stops at the throw, so subscribers after the SMS sender never run and the exception reaches the emitter. Wrap each handler call in try/catch (collect or log errors, then continue), or dispatch asynchronously with queueMicrotask/Promise.allSettled so one failing subscriber cannot block the rest."},
{q:"Implement undo for a command that sets a reel's endFt, given the reel object, and explain why the command must capture state at run time, not at construction.", a:"const setEnd = (reel, ft) => { let prev; return { run() { prev = reel.endFt; reel.endFt = ft; }, undo() { reel.endFt = prev; } }; } — prev must be read when run() executes, because other commands may have changed endFt between construction and execution."},
{q:"A function withCache(f) wraps a fetchReel(id) call. List two conditions under which this decorator is safe and one under which it serves wrong data.", a:"Safe when the underlying data is immutable for the cache's lifetime (e.g. archived reels) or when entries expire faster than the data changes (TTL). Wrong when the reel is updated after caching and nothing invalidates the entry — the decorator returns stale footage."},
{q:"Count the cost: a feature adds an interface, a factory, an abstract base class and one concrete class (4 files, 160 lines) for a single CSV import. Using YAGNI and the rule of three, what would you ship today, and when would you introduce each abstraction?", a:"Ship one function importCsv(text): Result<Reel[], string> (one file, roughly 40 lines). Introduce an interface when a second source appears (JSON or an API), and only then a registry or factory if callers must choose at run time; skip the abstract base class unless two importers genuinely share an algorithm with varying steps, and even then prefer passing functions."}
],
checks:[
{q:"How many patterns are in the Gang of Four book, and in which three families?", a:"23: 5 creational, 7 structural, 11 behavioral."},
{q:"Which pattern adds behavior around a function or object without changing it?", a:"The decorator pattern."},
{q:"What does YAGNI stand for?", a:"\"You aren't gonna need it\" — do not build an abstraction until the need is real."}
],
explain:"Have ADA play reviewer: show her a 38-line factory with one implementation and ask her to argue for or against it using YAGNI, the rule of three and the Liskov test; then explain why a strategy in TypeScript is just a function."},
{id:"p50m6", title:"Architecture Patterns: Layers, Hexagonal Ports and Adapters, Dependency Injection, Domain Events and Testing Seams on One Small Service", minutes:55,
outcomes:["Describe layered architecture, its downward-to-the-database dependency problem and the anemic domain model.","Structure a service as hexagonal ports and adapters with source dependencies pointing inward, distinguishing driving from driven ports.","Wire dependencies by hand in a composition root and explain when a DI container is worth its cost.","Use ports as testing seams with fakes, stubs and spies, and back fakes with contract tests.","Decouple in-process reactions with domain events, and recognize when cross-process delivery belongs to Domain 37's outbox."],
body:`<p>Where should the database call go? Every architecture pattern is an answer to that question and its cousins: where the HTTP parsing goes, where the clock is read, where the email is sent. The answer decides how fast your tests run, how painful it is to swap SQLite for Postgres, and whether a new teammate can find the business rules. This module builds one small service — record a reel installation, and warn when a reel drops below 500 ft — three ways, so you can see each pattern earn or fail to earn its keep. It builds on Domain 20 (the testing pyramid, test doubles) and stops where Domain 37 starts (events between services, the outbox, microservices).</p>
<h4>Layered architecture and its failure mode</h4>
<p><strong>Layered architecture</strong> stacks the code: presentation (HTTP handlers, CLI), application or service layer (use cases), domain (business rules), data access (SQL, files). Each layer calls only the one beneath it, like the OSI layers of Domain 2. It is the default shape of most frameworks and fine for CRUD applications. Its failure mode is that dependencies point <em>downward to the database</em>: the domain imports the ORM, business rules are written in terms of table rows, and testing a rule about 500 ft requires a database. The result is often an <strong>anemic domain model</strong> (Martin Fowler's 2003 name): data classes with getters and setters, and every rule scattered across services that load and save them. A second smell is the pass-through layer, a service method whose body is one call to the repository — layers that add files without adding decisions.</p>
<h4>Hexagonal: ports and adapters</h4>
<p><strong>Hexagonal architecture</strong>, which Alistair Cockburn published in 2005 under the name <strong>ports and adapters</strong>, flips the dependency. The application sits in the middle and owns its <em>ports</em>: interfaces written in its own vocabulary. <em>Driving</em> ports are what the application offers (the use case "record an install"); <em>driven</em> ports are what it needs from the world (store a reel, notify someone, tell the time). <em>Adapters</em> sit outside and translate: an HTTP handler or CLI drives the application, and a SQLite repository, an SMS gateway or the system clock is driven by it. The single rule is that source-code dependencies point inward — the core imports nothing from the adapters, no framework, no database driver. The hexagon shape means nothing; Cockburn drew six sides only to leave room for many ports. The onion architecture (Jeffrey Palermo, 2008) and Clean Architecture (Robert Martin, 2012) are the same dependency rule with different drawings. Here is the core of the service, with no I/O in it:</p>
<pre><code>// ---- domain: pure rules, no I/O, no framework ----
export type Reel = { readonly id: string; readonly feetLeft: number };
export const LOW_WATER_FT = 500;

export function install(reel: Reel, feet: number): Reel {
  if (!Number.isInteger(feet) || feet &lt;= 0) throw new RangeError("feet must be a positive integer");
  if (feet &gt; reel.feetLeft) throw new RangeError(reel.id + " has only " + reel.feetLeft + " ft");
  return { ...reel, feetLeft: reel.feetLeft - feet };
}

// ---- ports: interfaces the application OWNS and the outside world implements ----
export interface ReelRepository { get(id: string): Promise&lt;Reel | undefined&gt;; save(r: Reel): Promise&lt;void&gt; }
export interface Notifier { reelLow(r: Reel, at: Date): Promise&lt;void&gt; }
export interface Clock { now(): Date }

// ---- application: one use case, dependencies injected through the constructor ----
export type Deps = { repo: ReelRepository; notifier: Notifier; clock: Clock };
export class RecordInstall {
  readonly #deps: Deps;
  constructor(deps: Deps) { this.#deps = deps; }
  async run(id: string, feet: number): Promise&lt;Reel&gt; {
    const { repo, notifier, clock } = this.#deps;
    const before = await repo.get(id);
    if (!before) throw new Error("no reel " + id);
    const after = install(before, feet);          // the pure core decides
    await repo.save(after);                        // the ports carry out the effects
    if (before.feetLeft &gt;= LOW_WATER_FT &amp;&amp; after.feetLeft &lt; LOW_WATER_FT)
      await notifier.reelLow(after, clock.now());
    return after;
  }
}</code></pre>
<p><code>install</code> is a pure function — Module 3's functional core. <code>RecordInstall</code> is the application layer: it fetches, decides by calling the core, and asks ports to carry out effects. Nothing here knows whether reels live in memory, a JSON file or Postgres, or whether a warning goes to a console or a phone.</p>
<h4>Dependency injection and the composition root</h4>
<p><strong>Dependency injection</strong> means a component receives its collaborators instead of constructing them: the constructor of <code>RecordInstall</code> takes <code>{ repo, notifier, clock }</code>. You do not need a framework for it. The wiring lives in one place, the <strong>composition root</strong> (Mark Seemann's term) — the entry point, and the only module that knows which adapters are real:</p>
<pre><code>// composition root: the ONE place that knows which adapters are real
import { RecordInstall } from "./core.ts";
import { ConsoleNotifier, InMemoryReels, systemClock } from "./adapters.ts";

const useCase = new RecordInstall({
  repo: new InMemoryReels([{ id: "R20", feetLeft: 2410 }]),
  notifier: new ConsoleNotifier(),
  clock: systemClock,
});
console.log(await useCase.run("R20", 1200));
console.log(await useCase.run("R20", 800));
$ node main.ts                      # the timestamp is the real clock, so yours differs
{ id: 'R20', feetLeft: 1210 }
2026-10-21T15:02:11.482Z LOW: R20 410 ft left
{ id: 'R20', feetLeft: 410 }</code></pre>
<p>Swapping the in-memory repository for SQLite changes one line here and nothing in the core. DI containers (InversifyJS and tsyringe in TypeScript, NestJS's built-in injector, dependency-injector in Python) automate the wiring when graphs grow to dozens of components, at the price of decorators and runtime magic; for a service of this size, "pure DI" in a dozen lines of <code>main.ts</code> is clearer. The anti-pattern to recognize is the <em>service locator</em> — code that reaches into a global registry for its dependencies — which hides exactly what injection makes visible.</p>
<h4>Testing seams</h4>
<p>Michael Feathers defines a <strong>seam</strong> as a place where you can change a program's behavior without editing it there (<em>Working Effectively with Legacy Code</em>, 2004). Every port is a seam. The clock is the classic one: code that calls <code>new Date()</code> directly cannot be tested at 15:00 on a fixed day, while code that asks an injected <code>Clock</code> can. The tests below replace all three driven adapters with in-process <strong>test doubles</strong> — a real in-memory repository (a fake), a notifier that records calls (a spy) and a clock that returns a constant (a stub) — and run in a couple of milliseconds each with Node's built-in test runner:</p>
<pre><code>import { test } from "node:test";
import assert from "node:assert/strict";
import { RecordInstall, type Reel } from "./core.ts";
import { InMemoryReels } from "./adapters.ts";

function setup(feetLeft: number) {
  const sent: string[] = [];
  const useCase = new RecordInstall({
    repo: new InMemoryReels([{ id: "R20", feetLeft }]),
    notifier: { reelLow: async (r: Reel, at: Date) =&gt; { sent.push(r.id + "@" + at.toISOString()); } },
    clock: { now: () =&gt; new Date("2026-10-21T15:00:00Z") },   // the seam: time is injected
  });
  return { useCase, sent };
}

test("warns exactly once when a reel crosses below 500 ft", async () =&gt; {
  const { useCase, sent } = setup(1210);
  await useCase.run("R20", 700);   // 510 left: no warning
  await useCase.run("R20", 100);   // 410 left: crosses the line
  await useCase.run("R20", 10);    // 400 left: already low, no repeat
  assert.deepEqual(sent, ["R20@2026-10-21T15:00:00.000Z"]);
});

test("refuses to install more fiber than the reel holds", async () =&gt; {
  const { useCase } = setup(300);
  await assert.rejects(useCase.run("R20", 301), /only 300 ft/);
});
$ node --test --test-reporter=spec core.test.ts
✔ warns exactly once when a reel crosses below 500 ft (2.329995ms)
✔ refuses to install more fiber than the reel holds (0.531178ms)
ℹ tests 2
ℹ suites 0
ℹ pass 2
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 128.185491</code></pre>
<p>The first test pins down the business rule precisely: 1,210 − 700 = 510 ft (no warning), 510 − 100 = 410 ft (crossed the line, one warning), 410 − 10 = 400 ft (already low, no repeat). That is the shape Domain 20's pyramid asks for: many tests like these at the base, cheap enough to run on every save. Each real adapter then gets a small <em>contract test</em> suite — the same assertions run against <code>InMemoryReels</code> and against the SQLite adapter — so the fake is proven to behave like the real thing, and only a handful of end-to-end tests touch a real database or network. Run against an in-memory adapter, the two tests above take about 3 ms; against a database in a container, each would take tens to hundreds of milliseconds plus seconds of start-up. Over a 400-test suite that is the difference between one second and several minutes per run.</p>
<h4>Domain events, inside one process</h4>
<p>The use case above calls the notifier directly. When more things must react — an SMS to the crew lead, a dashboard refresh, an audit log — the core can instead emit a <strong>domain event</strong> such as <code>ReelLow { id, feetLeft, at }</code>: a record of something that happened, in the domain's vocabulary, published to an in-process bus (Module 5's observer pattern at architectural scale). Subscribers stay out of the use case, and adding a fourth reaction touches no existing code. The costs are the observer's: control flow you cannot read from the call site, ordering questions, and errors in subscribers that need a policy. The moment an event must leave the process — another service, a queue, a guarantee that it is published if and only if the database write committed — you need the transactional outbox, idempotent consumers and the delivery semantics of Domain 37 Module 6; do not improvise them inside a single service.</p>
<p><em>Choosing.</em> A script under a few hundred lines needs none of this. A CRUD application with thin rules is best served by its framework's layered conventions. Hexagonal pays off when real domain rules meet two or more kinds of I/O, or when tests must be fast and many — which describes most services that last. Several teams on one codebase want a modular monolith with enforced module boundaries before anyone mentions microservices (Domain 37 Module 5). Count adapters and rules; let the numbers choose the shape.</p>
<p><em>Certification mapping.</em> No exam tests hexagonal architecture by name; it is examined in system-design and code-review interviews, and its testing vocabulary (stubs, spies, fakes, test levels) is the ISTQB Foundation material of Domain 20's certification. In JSA-41-01, Block 2 (classes, 23%) covers the class mechanics used here — fields, private <code>#</code> members and constructors — and objectives 4.7–4.9 cover the promises every port returns.</p>`,
example:`<p><strong>The warning that fired twice at 7 p.m.</strong> The crew lead reports that "reel low" texts sometimes arrive twice, always around 19:00. The rule is "warn at most once per reel per day", and the original code computed the day with <code>new Date().toISOString().slice(0, 10)</code> inside the service. In October, Central time is UTC−5, so at 19:00 local the UTC date rolls over and the same reel, still low, counts as a new day. The bug could not be tested because the clock was hard-wired. Refactor: the use case takes a <code>Clock</code> port, and "day" is computed in the crew's zone with <code>Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(clock.now())</code>, which yields <code>2026-10-21</code> for both 18:59 and 19:01 local time. Two stub clocks — <code>new Date("2026-10-21T23:59:00Z")</code> and <code>new Date("2026-10-22T00:01:00Z")</code>, two minutes apart across midnight UTC — now prove that a second install sends no second text, and a third stub at <code>2026-10-22T13:00:00Z</code> (08:00 local the next morning) proves the warning re-arms. The test suite stays in memory: 41 tests in about 60 ms, versus the old suite's 4 minutes against a containerized database, so it runs on every save.</p>`,
misconceptions:["\"Hexagonal architecture means six layers or six ports.\" The hexagon is only a drawing with room for many ports; the content is one rule: dependencies point inward to an application that owns its interfaces.","\"Dependency injection requires a framework.\" Passing collaborators to a constructor or function and wiring them in one composition root is DI; containers are an optional convenience for large graphs.","\"Mocks everywhere make tests fast and safe.\" Over-mocked tests verify call sequences, not behavior, and break on every refactor; prefer real in-memory fakes backed by contract tests, and mock only at true boundaries."],
problems:[
{q:"A domain function imports pg (the Postgres driver) to look up a reel's crew before applying a rule. Identify the dependency-rule violation and redesign it with a port.", a:"The core depends outward on infrastructure, so it cannot be tested or reused without Postgres. Define a driven port in the core, interface CrewDirectory { crewOf(reelId: string): Promise<string | undefined> }, have the use case receive it, and implement PgCrewDirectory in an adapter wired in the composition root."},
{q:"Your test suite has 400 tests. 360 use in-memory adapters at about 2 ms each; 40 hit a containerized Postgres at about 180 ms each, plus 9 s of container start-up. Compute the run time, and the run time if all 400 hit Postgres.", a:"360 × 2 ms = 0.72 s; 40 × 180 ms = 7.2 s; plus 9 s start-up ≈ 16.9 s. All 400 on Postgres: 400 × 180 ms = 72 s + 9 s = 81 s — almost five times slower, before any parallelism."},
{q:"Classify each test double and say what it verifies: (a) clock: { now: () => new Date(\"2026-10-21T15:00:00Z\") }; (b) a notifier pushing every call into an array; (c) InMemoryReels backed by a Map.", a:"(a) Stub — supplies a canned input, verifies nothing. (b) Spy — records calls so the test can assert what was sent. (c) Fake — a working lightweight implementation of the port; verified against the real adapter by a shared contract test."},
{q:"After recording an install, the service must update a dashboard and append to an audit log, both in the same process. Compare calling them from the use case with emitting a ReelInstalled domain event, giving one advantage and one risk of the event.", a:"Direct calls are explicit and ordered but the use case grows with every new reaction. A domain event keeps the use case closed to new reactions (add a subscriber, edit nothing) but hides control flow and needs an error policy so a failing subscriber does not break the install."},
{q:"The audit log must be written to a separate service if and only if the database transaction commits. Why is emitting an in-process event after save() insufficient, and what is the standard pattern?", a:"The process can crash between commit and publish (event lost), or publish can succeed and the transaction roll back (phantom event). The transactional outbox writes the event to an outbox table in the same transaction; a relay publishes it afterward with at-least-once delivery and idempotent consumers (Domain 37)."}
],
checks:[
{q:"Who named hexagonal architecture, and what is its other name?", a:"Alistair Cockburn (2005); ports and adapters."},
{q:"What is the composition root?", a:"The single place, usually the entry point, where concrete adapters are created and injected."},
{q:"Feathers' definition of a seam?", a:"A place where you can alter a program's behavior without editing the code in that place."}
],
explain:"Draw for ADA the dependency arrows of the reel service in layered form and in hexagonal form, then explain why injecting a Clock is what makes the 'warn once per day' rule testable."},
{id:"p50m7", title:"Shell Scripting Done Right: Quoting and Word Splitting, set -euo pipefail and Its Caveats, Functions, Traps, Exit Codes, ShellCheck, POSIX sh — and When to Switch to Python", minutes:60,
outcomes:["Recite the order of shell expansions and predict exactly how an unquoted variable is split and globbed.","Use parameter expansion for basename, dirname, suffix stripping, replacement, defaults and the ${var:?} guard.","Use set -euo pipefail with an accurate model of its five classic caveats, and handle important failures explicitly.","Write functions with meaningful exit codes, clean up with an EXIT trap and mktemp, and parse options with getopts.","Keep scripts ShellCheck-clean, test POSIX sh scripts under dash, and decide with evidence when to rewrite in Python."],
body:`<p>Why does a shell script that worked on Tuesday delete the wrong directory on Wednesday? Because the shell rewrites your command line through a series of expansions before running it, and one unquoted variable turns a filename with a space into three arguments, or an empty variable into <code>/</code>. In January 2015 Valve's Steam client for Linux shipped <code>rm -rf "$STEAMROOT/"*</code>; when <code>STEAMROOT</code> came out empty it ran <code>rm -rf /*</code> and erased users' files. Domain 3 taught script anatomy; this module teaches the mechanism. The reference is GNU Bash 5 (5.3 is current). Note from day one: Debian and Ubuntu run <code>/bin/sh</code> as <em>dash</em>, a minimal POSIX shell, and macOS ships Bash 3.2 from 2007, so install a current Bash with Homebrew on a Mac.</p>
<h4>How the shell reads a line</h4>
<p>Bash expands in a fixed order: brace (<code>{1..3}</code>), tilde, then parameter, arithmetic and <strong>command substitution</strong> (<code>$(cmd)</code>, replaced by its output), then <strong>word splitting</strong>, then pathname expansion (globbing), then quote removal. Word splitting cuts the <em>results of unquoted expansions</em> at the characters in <code>IFS</code> (space, tab, newline), and globbing then expands any <code>*</code>, <code>?</code> or <code>[…]</code> they contain. Double quotes suppress both — that is the whole theory of quoting. Watch it with <code>printf '[%s] '</code>, which brackets each argument it receives:</p>
<pre><code>#!/usr/bin/env bash
f="Reel 17 as-built.xlsx"
printf '[%s] ' $f; echo          # unquoted: split on IFS into three words
printf '[%s] ' "$f"; echo        # quoted: one word, exactly as stored
pat='*.xlsx'
printf '[%s] ' $pat; echo        # unquoted: the value is ALSO glob-expanded
files=("Reel 17 as-built.xlsx" "splice log.csv")
printf '[%s] ' "$&#123;files[@]}"; echo   # each element stays one word
printf '[%s] ' "$&#123;files[*]}"; echo   # all elements joined into one word
$ bash split.sh          # in a folder holding "Reel 17 as-built.xlsx" and "Reel 18 as-built.xlsx"
[Reel] [17] [as-built.xlsx] 
[Reel 17 as-built.xlsx] 
[Reel 17 as-built.xlsx] [Reel 18 as-built.xlsx] 
[Reel 17 as-built.xlsx] [splice log.csv] 
[Reel 17 as-built.xlsx splice log.csv] </code></pre>
<p>Line 1: one filename became three arguments. Line 3: a variable holding <code>*.xlsx</code> was glob-expanded. So quote every expansion — <code>"$f"</code>, <code>"$(cmd)"</code>, <code>"$&#123;files[@]}"</code> — use arrays for lists (<code>"$@"</code> for arguments; <code>"$*"</code> joins them), and loop over a glob (<code>for f in ./*.xlsx</code>), never over <code>$(ls)</code>.</p>
<h4>Parameter expansion toolkit</h4>
<p><strong>Parameter expansion</strong> does string work without starting a process (a <code>sed</code> call costs a fork and exec, around a millisecond):</p>
<table><tr><th>Form</th><th>Result for f="/data/Reel 17.tar.gz"</th><th>Use</th></tr>
<tr><td><code>$&#123;f##*/}</code></td><td><code>Reel 17.tar.gz</code></td><td>basename (longest prefix match removed)</td></tr>
<tr><td><code>$&#123;f%/*}</code></td><td><code>/data</code></td><td>dirname (shortest suffix match removed)</td></tr>
<tr><td><code>$&#123;f%%.*}</code></td><td><code>/data/Reel 17</code></td><td>strip all extensions</td></tr>
<tr><td><code>$&#123;f// /_}</code></td><td><code>/data/Reel_17.tar.gz</code></td><td>replace every space</td></tr>
<tr><td><code>$&#123;#f}</code></td><td><code>20</code></td><td>length in characters</td></tr>
<tr><td><code>$&#123;dir:-/tmp}</code> / <code>$&#123;dir:?unset}</code></td><td>default value / abort with a message</td><td>safe defaults; guarding <code>rm</code></td></tr></table>
<p><code>$&#123;var:?}</code> is the Steam fix: <code>rm -rf -- "$&#123;STEAMROOT:?}"/*</code> aborts if the variable is empty instead of expanding to <code>/*</code> (ShellCheck SC2115).</p>
<h4>set -euo pipefail, and its caveats</h4>
<p><code>set -euo pipefail</code>, often sold as an unofficial strict-mode line, enables <code>-e</code> (exit when a command fails), <code>-u</code> (unset variables are errors) and <code>-o pipefail</code> (a pipeline fails if <em>any</em> stage fails). Use it, knowing that <code>-e</code> is full of exceptions:</p>
<pre><code>#!/usr/bin/env bash
set -euo pipefail

# 1. local masks the exit status of the command substitution (SC2155).
f() { local out=$(false); echo "1. still running after a failed \\$(false), out='$out'"; }
f

# 2. -e is suspended inside any command tested by if, while, &amp;&amp; or ||.
g() { false; echo "2. ran the line after false, because g was called from an if"; }
if g; then :; fi

# 3. Arithmetic that evaluates to 0 returns status 1, and -e exits on it.
i=0
(( i++ )) || echo "3. (( i++ )) returned 1 when i was 0; without || the script would die here"

# 4. grep exits 1 when nothing matches, which under -e and pipefail is fatal.
count=$(printf 'R17\\nR18\\n' | grep -c R99 || true)
echo "4. matches for R99: $count"

# 5. pipefail sees SIGPIPE: yes is killed when head stops reading (128 + 13 = 141).
set +e
yes | head -n 1 &gt; /dev/null
echo "5. pipeline status with pipefail: $?  (PIPESTATUS would show 141 0)"
$ bash caveats.sh; echo "exit=$?"
1. still running after a failed $(false), out=''
2. ran the line after false, because g was called from an if
3. (( i++ )) returned 1 when i was 0; without || the script would die here
4. matches for R99: 0
5. pipeline status with pipefail: 141  (PIPESTATUS would show 141 0)
exit=0</code></pre>
<p>Five lessons. <code>local x=$(cmd)</code> masks the failure with <code>local</code>'s own success (SC2155: declare, then assign). Errexit is suspended in anything tested by <code>if</code>, <code>while</code>, <code>&amp;&amp;</code> or <code>||</code>, including a whole function called there. <code>(( i++ ))</code> returns 1 when the value is 0, so a zero counter kills the script; write <code>i=$((i + 1))</code>. <code>grep</code> exits 1 for "no match". And under <code>pipefail</code> a producer killed by SIGPIPE reports 141 (128 + 13). Keep the options as a net, and handle every failure that matters explicitly: <code>cmd || die "…"</code>.</p>
<h4>Functions, exit codes and traps</h4>
<p>An <strong>exit status</strong> is 0–255: 0 is success. Conventions: 1 general error, 2 bad usage, 126 not executable, 127 command not found, 128 + n killed by signal n (130 Ctrl-C, 137 <code>kill -9</code>, 143 SIGTERM). <code>$?</code> holds the last status, <code>PIPESTATUS</code> every stage's. Functions return data by printing it and success by status, with <code>local</code> variables. A <strong>trap</strong> runs a command on a signal or pseudo-signal: <code>trap cleanup EXIT</code> runs on every exit path, including Ctrl-C, and <code>trap '…' ERR</code> with <code>set -E</code> reports the failing line. Together, in a ShellCheck-clean script that survives the nastiest filenames a field laptop produces:</p>
<pre><code>#!/usr/bin/env bash
# archive-asbuilts.sh: bundle today's as-built sheets into a dated tarball, keep the newest N.
set -Eeuo pipefail

usage() { printf 'usage: %s [-n] [-k KEEP] SRC_DIR DEST_DIR\\n' "$&#123;0##*/}" &gt;&amp;2; exit 2; }
log()   { printf '%s %s\\n' "$(date +%H:%M:%S)" "$*" &gt;&amp;2; }
die()   { log "ERROR: $*"; exit 1; }

dry_run=0 keep=7
while getopts ':nk:' opt; do
  case $opt in
    n) dry_run=1 ;;
    k) [[ $OPTARG =~ ^[0-9]+$ ]] || die "-k needs a number, got '$OPTARG'"; keep=$OPTARG ;;
    *) usage ;;
  esac
done
shift $((OPTIND - 1))
(( $# == 2 )) || usage
src=$1 dest=$2
[[ -d $src ]]  || die "source '$src' is not a directory"
mkdir -p -- "$dest"

work=$(mktemp -d)
trap 'rm -rf -- "$&#123;work:?}"' EXIT                         # runs on success, failure or Ctrl-C
trap 'log "failed at line $LINENO: $BASH_COMMAND"' ERR   # -E makes functions inherit it

shopt -s nullglob
sheets=("$src"/*.xlsx "$src"/*.csv)
(( $&#123;#sheets[@]} &gt; 0 )) || { log "nothing to archive in $src"; exit 0; }
log "found $&#123;#sheets[@]} sheet(s)"

archive="$dest/asbuilts-$(date +%F).tar.gz"
cp -- "$&#123;sheets[@]}" "$work/"
if (( dry_run )); then
  log "dry run: would write $archive"
else
  tar -czf "$archive" -C "$work" .
  log "wrote $archive ($(du -h -- "$archive" | cut -f1))"
fi

archives=("$dest"/asbuilts-*.tar.gz)       # globs sort by name; ISO dates sort by time
for (( i = 0; i &lt; $&#123;#archives[@]} - keep; i++ )); do
  f=$&#123;archives[i]}
  if (( dry_run )); then log "dry run: would delete $f"; else rm -f -- "$f"; log "deleted $f"; fi
done
$ ./archive-asbuilts.sh -k 2 in out      # in/ holds "Reel 17 as-built.xlsx", "-rf.csv", "splice*log.csv"
14:05:09 found 3 sheet(s)
14:05:09 wrote sb3/out/asbuilts-2026-10-26.tar.gz (4.0K)
14:05:09 deleted sb3/out/asbuilts-2026-10-14.tar.gz
14:05:09 deleted sb3/out/asbuilts-2026-10-15.tar.gz</code></pre>
<p>Each habit has a reason: <code>--</code> makes <code>-rf.csv</code> data, not a flag; <code>nullglob</code> turns an empty match into an empty array; <code>mktemp -d</code> plus the EXIT trap cleans up after Ctrl-C; logs go to stderr so stdout stays clean for pipes. The rotation relies on glob results being sorted and ISO dates (<code>%F</code>) sorting chronologically.</p>
<h4>ShellCheck, POSIX sh and portability</h4>
<p><strong>ShellCheck</strong> (version 0.11.0 or newer; <code>apt install shellcheck</code>, <code>brew install shellcheck</code>, or the VS Code extension) is a static analyzer for shell, and not optional. Learn its codes: SC2086 "Double quote to prevent globbing and word splitting" (both unquoted lines of <code>split.sh</code>), SC2046 (unquoted <code>$(…)</code>), SC2155, SC2164 (<code>cd</code> without <code>|| exit</code>), SC2115, and SC2207 (splitting command output into an array), which it raised on an early draft of the script above until a glob replaced the <code>ls</code> parsing. <strong>POSIX sh</strong> is the portable subset of POSIX.1-2024: no <code>[[ ]]</code>, arrays, <code>==</code>, <code>$'…'</code> or <code>{1..3}</code>, and <code>printf</code> instead of <code>echo -e</code>. Test <code>#!/bin/sh</code> scripts with dash, because Bash accepts bash-isms even as sh. Dash meets <code>[[ ]]</code> by printing <code>[[: not found</code>, skipping the branch and exiting 0 — a silent wrong answer — while ShellCheck reports SC3010 before you run it.</p>
<p><em>When to switch to Python.</em> Google's Shell Style Guide: if a script is more than 100 lines or uses non-straightforward control flow, rewrite it in a more structured language. Switch earlier for data structures, JSON, floating point (Bash arithmetic is integer only: <code>$((7 / 2))</code> is 3) or Windows. The Python port of the archive script is 36 lines against 45, and better in kind: <code>argparse</code> rejects <code>-k x</code> with status 2, <code>pathlib</code> globs never split, <code>tarfile</code> needs no temporary directory, and failures are exceptions with tracebacks. To run a program from Python, pass a list — <code>subprocess.run(["tar", "-czf", str(archive), "."], check=True)</code> — so there is no shell, no splitting and no command injection; never <code>shell=True</code> with untrusted input (Domain 31).</p>
<p><em>Certification mapping.</em> CompTIA Linux+ (XK0-006) gives 17% of its weight to Automation, Orchestration and Scripting, including shell scripting with variables, functions and logic flows; and RHCSA (Domain 29) requires simple shell scripts with conditionals, loops and positional parameters. Both reward quoting and exit-code discipline under time pressure.</p>`,
example:`<p><strong>Monday's broken upload.</strong> A crew laptop runs <code>upload.sh</code> at 17:00 to copy the day's as-builts to the office share. Today only one of the two files arrived, and the log shows three lines: "cp: cannot stat 'Reel': No such file or directory", the same for <code>'17'</code> and for <code>'as-built.xlsx'</code>. The script was <code>cd "$1"; for f in $(ls); do cp $f "$2"; done</code>, and today's files were <code>Reel 17 as-built.xlsx</code> and <code>splice-log.csv</code>. Diagnosis: <code>$(ls)</code> produced two lines; the unquoted command substitution was split on spaces and newlines into four words (<code>Reel</code>, <code>17</code>, <code>as-built.xlsx</code>, <code>splice-log.csv</code>); three <code>cp</code> calls failed on fragments and only the CSV was copied — and the script still exited 0, so nobody was alerted. <code>shellcheck upload.sh</code> reports all three defects: SC2164 (<code>cd</code> without <code>|| exit</code>), SC2045 ("Iterating over ls output is fragile. Use globs.") and SC2086 for the unquoted <code>$f</code>. Fix: <code>set -euo pipefail</code>, <code>shopt -s nullglob</code>, <code>cd -- "$1" || exit 1</code>, then <code>for f in ./*.xlsx ./*.csv; do cp -- "$f" "$2"/ || die "copy failed: $f"; done</code>, so a failure produces a non-zero exit status the scheduler can alert on. Test it before trusting it: in a scratch folder run <code>touch "a b.xlsx" ./-rf.csv "x*y.csv"</code>, point the script at a scratch destination, and confirm exactly 3 files arrive with their names intact.</p>`,
misconceptions:["\"set -e makes a script stop at the first error.\" Errexit is suspended inside if/while conditions and && or || lists (including whole functions called there), masked by local x=$(cmd), and triggered by harmless non-zero statuses such as grep's no-match or (( i++ )) when i is 0.","\"Quotes are only needed when a name contains spaces.\" Unquoted expansions are also glob-expanded, and empty values vanish entirely; quote every expansion unless you deliberately want splitting.","\"#!/bin/sh and #!/bin/bash are the same.\" On Debian and Ubuntu /bin/sh is dash, which rejects bash-isms such as [[ ]], arrays and ==; often it prints an error and carries on, so the script runs wrongly rather than stopping."],
problems:[
{q:"With dir=\"\" and the line rm -rf \"$dir\"/*, what runs? Rewrite the line safely in two different ways.", a:"It expands to rm -rf /* — deleting everything the user can delete. Safe: rm -rf -- \"${dir:?dir is empty}\"/* (aborts if empty or unset), or test first: [[ -n $dir && -d $dir ]] || die \"bad dir\"; then rm -rf -- \"$dir\"/*."},
{q:"Predict the output: set -euo pipefail; count=$(grep -c ERROR app.log); echo \"errors: $count\" — when app.log contains no ERROR lines. Fix it so it prints errors: 0.", a:"grep -c prints 0 but exits 1; under -e the assignment's failure exits the script before echo. Fix: count=$(grep -c ERROR app.log || true), or if ! count=$(grep -c ERROR app.log); then count=0; fi."},
{q:"A cron job's script ends with exit status 141 every night but its output looks complete. Explain the number and say whether it is a real failure.", a:"141 = 128 + 13: a pipeline stage was killed by SIGPIPE because a later stage (such as head) stopped reading; pipefail reported it. Usually harmless; handle that pipeline explicitly (e.g. avoid head on a producer whose failure you care about, or test PIPESTATUS) rather than disabling pipefail globally."},
{q:"Give the parameter expansions that turn p=\"/srv/asbuilts/Reel 17 as-built.xlsx\" into (a) Reel 17 as-built.xlsx, (b) /srv/asbuilts, (c) Reel 17 as-built, (d) Reel_17_as-built.xlsx.", a:"(a) ${p##*/}; (b) ${p%/*}; (c) n=${p##*/}; ${n%.*}; (d) n=${p##*/}; ${n// /_}."},
{q:"A 160-line Bash script parses a JSON inventory with grep and sed, computes average loss in dB with awk, and retries an API call three times. Argue for or against rewriting it in Python, with three concrete reasons.", a:"Rewrite: it exceeds Google's 100-line guideline; JSON parsing with grep/sed breaks on formatting changes while Python's json module is exact; floating-point averages need awk because Bash arithmetic is integer only, whereas Python has floats and statistics.mean; retries and error handling become explicit exceptions with tracebacks. Keep a thin shell wrapper only if the cron environment needs it."}
],
checks:[
{q:"In what order do word splitting and pathname expansion happen relative to parameter expansion?", a:"After it: parameter, arithmetic and command substitution first, then word splitting, then pathname (glob) expansion, then quote removal."},
{q:"What do exit statuses 126, 127 and 130 mean?", a:"126: found but not executable; 127: command not found; 130: terminated by SIGINT (Ctrl-C), 128 + 2."},
{q:"Which trap runs on every way a script can exit?", a:"trap … EXIT."}
],
explain:"Show ADA, with printf '[%s] ', how the filename Reel 17 as-built.xlsx becomes three arguments when unquoted, then explain why set -e did not stop a script whose function failed inside an if condition."}
],
listening:[],
labs:[
{id:"p50lab1", title:"Type-system workbench: strict TypeScript 7 on your machine", goal:"See exactly what the checker proves, what it cannot, and what erases — through your own predictions, compiler errors and program outputs.",
steps:[
"Install Node.js 24 or 26 LTS (nodejs.org, or fnm/nvm), then: mkdir ts-lab && cd ts-lab && npm init -y && npm pkg set type=module && npm install -D typescript @types/node. Confirm node --version shows v24 or v26 and npx tsc --version shows 7.x. Create the Module 2 tsconfig.json (strict, target esnext, module nodenext, types [\"node\"], noUncheckedIndexedAccess, exactOptionalPropertyTypes, verbatimModuleSyntax, erasableSyntaxOnly, noEmit) with include [\"src\"].",
"Structural typing: in src/brand.ts write the Point and branded Feet/Meters example from Module 1, then five assignability experiments (extra property via a variable; the same via a fresh literal; Meters passed as Feet; an object missing a property; a callback that ignores a parameter). Predict each result in a table, run npx tsc --noEmit, and record the real verdicts and error codes (TS2353, TS2345, TS2741 …).",
"Narrowing: write the Shape discriminated union with an exhaustive switch ending in const unreachable: never, run node src/shapes.ts (expect 3.1416, 12 and 6), add a hex variant and record the TS2322 error. Then write isReel(x: unknown): x is Reel and use it on the output of JSON.parse.",
"Generics and type-level code: implement pluck<T, K extends keyof T>, groupBy<T, K extends PropertyKey>, ElementOf<T> and DeepReadonly<T>. Write type tests: lines that must fail marked // @ts-expect-error (for example pluck(reels, \"colour\")) and lines that must compile, so npx tsc --noEmit proves both directions.",
"Erasure: add enum Status and a constructor parameter property; run node on the file and capture ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX, then capture the two TS1294 errors from tsc. Rewrite them as an as-const object plus a union and an explicit field, emit with npx tsc --noEmit false --outDir dist, and diff src against dist to list exactly what disappeared. Time npx tsc --noEmit twice with time."
],
deliverable:"A Git repository with src/, tsconfig.json and a README table — experiment, your prediction, the compiler's verdict (error code or OK), the runtime output — and one paragraph on which predictions were wrong and why."},
{id:"p50lab2", title:"A typed API client with Zod at the boundary — and a JavaScript migration", goal:"Build a small HTTP API and a typed client, prove that a cast lets bad data through, fix it with runtime validation and tests, and migrate a legacy JavaScript file step by step.",
steps:[
"In a new project set up like Lab 1, write src/server.ts with node:http bound to 127.0.0.1:8787: GET /reels returns at least two reels (id, crew, startFt, endFt, installedAt), and ?broken=1 sends startFt and endFt as strings and drops installedAt from one record. Run node src/server.ts and check both modes with curl -s.",
"Write src/client.ts: getJson(url): Promise<unknown> with fetch, AbortSignal.timeout(3000) and a res.ok check. Implement feetLeftUnsafe with as Reel[] and record its output in both modes (a number in good mode, a concatenated string in broken mode).",
"npm install zod. Define the Reel schema, derive type Reel = z.infer<typeof Reel>, and implement feetLeft returning a Result built from z.array(Reel).safeParse and z.prettifyError. Record the error report in broken mode.",
"Write test/client.test.ts with node:test and node:assert/strict: start the server on an ephemeral port (listen(0)), assert the good total, assert ok === false in broken mode, and assert the timeout path against a route that never responds. Add npm scripts check (tsc --noEmit) and test (node --test test/client.test.ts).",
"Migration: write a 40–80-line legacy.js report script that calls the API with no types. Add // @ts-check and JSDoc typedefs with allowJs and checkJs, record the error count; rename to .ts and fix; then enable noUncheckedIndexedAccess and exactOptionalPropertyTypes one at a time, recording the count after each step."
],
deliverable:"The repository with server, client, tests and the migrated file; a log of unsafe versus safe outputs; and an error burn-down table (step, errors before, errors after, most interesting bug found)."},
{id:"p50lab3", title:"Functional core in two languages, with property tests and a taste of Haskell", goal:"Write the same pure data-processing core in TypeScript and Python, test it with property-based tests, measure laziness, and see the same ideas in Haskell.",
steps:[
"TypeScript: in src/reels.ts write pure functions parseLine(line): Result<Reel, string>, used(reel), totalByCrew(reels): Record<string, number> and topN(reels, n) with filter, map, reduce and toSorted, Readonly types and no mutation. Hand-write a 20-line CSV containing three malformed lines and print the accepted totals and the rejects.",
"Python 3.12+: write reels.py with @dataclass(frozen=True), a parse function returning a Reel or an error string, match/case over event dictionaries, and both functools.reduce and a comprehension for the same totals. Confirm both languages print identical numbers.",
"Property tests: npm install -D fast-check, and pip install hypothesis inside a venv. State and test three properties: totalByCrew sums to the overall total; parseLine(formatLine(r)) round-trips any valid reel; topN output is ordered and is a subset of the input. Record any counterexample the tools shrink to.",
"Laziness: write a generator yielding 1,000,000 synthetic records. Compute the north-crew total eagerly (Array.from, then filter/map/reduce) and lazily (iterator helpers), and in Python with a list versus a generator expression. Measure peak memory (process.memoryUsage().heapUsed; tracemalloc.get_traced_memory) and time for each.",
"Haskell: install GHCup (haskell.org/ghcup), start ghci, and write shapes.hs from Module 4; run it with runghc and compare with the expected output. Delete one area equation and compile with ghc -Wall to see the incomplete-patterns warning, then port totalByCrew to Haskell with sum over a list comprehension or foldr."
],
deliverable:"Both implementations with their tests, a table of eager-versus-lazy memory and time in both languages, the shrunk counterexample (or why none was found), and the Haskell file with its output and the -Wall warning."},
{id:"p50lab4", title:"Refactor to patterns, then to hexagonal — and delete one abstraction", goal:"Protect a tangled script's behavior with characterization tests, introduce only the patterns that absorb real variation, restructure it as ports and adapters, and measure the result.",
steps:[
"Write by hand a 120–150-line reel-tracker.ts 'god script': it reads reels.json, applies installs from command-line arguments, prints a report in one of three formats through a switch, warns on the console when a reel drops below 500 ft, and calls new Date() inline. Commit it, then write characterization tests that run it with fixed inputs and compare the output to saved expected files.",
"Introduce patterns where variation exists: a strategy registry Record<Format, Exporter> for the three formats, a typed observer bus for reelLow and installed, an undoable command for installs, and a withRetry decorator around a simulated flaky notifier. Keep the characterization tests green after every commit.",
"Restructure as hexagonal: a pure domain install(); ports ReelRepository, Notifier and Clock; a RecordInstall use case; adapters InMemoryReels, JsonFileReels (node:fs/promises), ConsoleNotifier and systemClock; a CLI driving adapter and an HTTP one (node:http on 127.0.0.1). Wire everything in main.ts, the composition root.",
"Tests: use-case tests with a stub clock, a spy notifier and a fake repository; one contract-test function run against both InMemoryReels and JsonFileReels (in a temporary directory from fs.mkdtemp); one end-to-end test through the HTTP adapter.",
"Measure and review: suite time with node --test for in-memory versus file adapters, file and line counts before and after (wc -l), and dependency direction (grep the imports in src/domain for anything outside it — expect none). Write a one-page review naming one abstraction you would delete and why."
],
deliverable:"The Git history showing each step with green tests, the measurement table, a dependency diagram (hand-drawn or Mermaid), and the review page with the deleted abstraction."},
{id:"p50lab5", title:"Shell scripting done right, then the Python rewrite", goal:"Write a ShellCheck-clean Bash tool that survives hostile filenames and interruptions, prove the set -e caveats on your own machine, port the tool to POSIX sh and to Python, and decide which to keep.",
steps:[
"Check bash --version (5.x; on macOS run brew install bash), install ShellCheck (sudo apt install shellcheck, or brew install shellcheck) and dash (preinstalled on Debian and Ubuntu as /bin/sh). Create a sandbox: mkdir -p sandbox/in sandbox/out, then in sandbox/in run touch \"Reel 17 as-built.xlsx\" ./-rf.csv 'splice*log.csv' $'two\\nlines.csv', and create three dated archives in sandbox/out (touch asbuilts-2026-10-14.tar.gz and so on).",
"Write archive-asbuilts.sh from Module 7 yourself, without pasting: set -Eeuo pipefail, usage, log and die functions, getopts for -n and -k, mktemp -d with an EXIT trap, nullglob arrays, -- before every path, a dated tar.gz and rotation. Run it with -k 2 on the sandbox and verify with tar -tzf that all four hostile names arrived intact and only two archives remain.",
"Run shellcheck until it reports nothing. Then reintroduce one bug at a time — an unquoted $f, for f in $(ls), local x=$(cmd), cd without || exit — and record ShellCheck's code and what actually broke on the sandbox.",
"Prove the caveats: write caveats.sh with Module 7's five cases, predict each line and the final exit status, run it, and print PIPESTATUS after yes | head -n 1. Add sleep 30 before the tar step, press Ctrl-C during a run, and confirm the temporary directory is gone and echo $? shows 130.",
"Port: write a #!/bin/sh version with no arrays or [[ ]], run it under dash, and get shellcheck --shell=sh clean. Write archive_asbuilts.py with argparse, pathlib and tarfile. Compare line counts (wc -l), behavior on the sandbox, the error for -k x, and run time (time, five runs each)."
],
deliverable:"The Bash, POSIX sh and Python versions; the ShellCheck bug log; the caveats prediction-versus-actual table; the comparison table; and a short decision: which version you would schedule on a crew laptop, and why."}
],
capstone:{title:"Reel Ledger: a typed, tested, hexagonal tool with shell and Python companions",
brief:"Build Reel Ledger, a tool you could actually use after a day in the field, using synthetic data only — never an employer's or customer's records. (1) A strict TypeScript 7 service run with Node.js type stripping and checked by tsc --noEmit in CI: a pure domain (reels, installs, splices with loss budgets), Zod schemas at every boundary (CSV import, HTTP API, environment configuration), Result values for expected failures and exhaustive discriminated unions for every status. (2) Hexagonal structure: driving adapters for a CLI and an HTTP API on 127.0.0.1; driven ports for storage (in-memory and JSON-file adapters sharing one contract test), notification and clock; one composition root; domain events for reel-low and failed-splice reactions. (3) At least three design patterns, each justified in a short architecture decision record by the variation it absorbs, plus one abstraction you considered and rejected. (4) A ShellCheck-clean Bash wrapper that imports the day's CSVs, archives them and rotates old archives, with a POSIX sh variant tested under dash and a Python version of the same job, compared on one page. (5) A README with a ports-and-adapters diagram, the test pyramid with counts and run times, and a one-page explanation of the design for a bright ten-year-old.",
rubric:[
"tsc --noEmit is clean under strict, noUncheckedIndexedAccess and exactOptionalPropertyTypes with no explicit any, and every external input passes through a schema, proven by a broken-input test.",
"The domain imports nothing from adapters or frameworks (shown by an import check); use cases are tested with stubs, fakes and spies; the contract test passes against both storage adapters.",
"Each pattern has an ADR naming the variation it absorbs; the rejected abstraction is argued with YAGNI or the rule of three.",
"The shell wrapper is ShellCheck-clean, survives hostile filenames and Ctrl-C, returns meaningful exit codes, and the dash and Python variants behave identically on the same sandbox.",
"Only synthetic data is used, and the ten-year-old explanation is accurate enough that ADA could follow it."
]},
exam:[
{id:"p50q1", type:"mc", q:"interface Reel { id: string; feet: number }. Which assignment compiles?", options:["const r: Reel = { id: \"R1\", feet: 10, crew: \"N\" };", "const x = { id: \"R1\", feet: 10, crew: \"N\" }; const r: Reel = x;", "const r: Reel = { id: \"R1\" };", "const r: Reel = { id: 1, feet: 10 };"], answer:1, why:"Structural typing accepts extra properties on a value that is not a fresh literal. Writing the same literal directly triggers the excess property check, the literal without feet is missing a property, and id: 1 has the wrong type."},
{id:"p50q2", type:"mc", q:"In a switch over a discriminated union, what does const unreachable: never = s in the default branch achieve?", options:["It throws at run time for unknown variants", "It disables type narrowing in the switch", "It converts s to unknown", "It makes the compiler report an error if any variant is not handled"], answer:3, why:"If a variant is unhandled, s still has that variant's type in the default branch, which is not assignable to never, so compilation fails and names it."},
{id:"p50q3", type:"mc", q:"Which line makes Node.js type stripping fail with ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX?", options:["type Status = \"staged\" | \"installed\";", "import type { Reel } from \"./reel.ts\";", "enum Status { Staged, Installed }", "const s = \"staged\" satisfies string;"], answer:2, why:"enum generates JavaScript code, so it is not erasable; type aliases, import type and satisfies are removed without trace."},
{id:"p50q4", type:"mc", q:"Why is unknown preferred to any for data from JSON.parse?", options:["unknown forbids using the value until it is narrowed or validated, while any disables checking and spreads", "unknown is faster at run time", "any cannot hold objects", "unknown performs runtime validation"], answer:0, why:"Both accept any value, but only unknown forces a check before use; neither validates anything at run time."},
{id:"p50q5", type:"mc", q:"Which type describes a User without its passwordHash field?", options:["Partial<User>", "Pick<User, \"passwordHash\">", "Omit<User, \"passwordHash\">", "Exclude<User, \"passwordHash\">"], answer:2, why:"Omit drops the listed keys from an object type; Pick keeps only them, and Exclude filters union members, not object keys."},
{id:"p50q6", type:"mc", q:"What is the main benefit of type Reel = z.infer<typeof ReelSchema>?", options:["It makes validation unnecessary", "The static type is derived from the runtime schema, so the two cannot drift apart", "It speeds up tsc", "It enables Node.js to type-check at run time"], answer:1, why:"One source of truth: the schema validates at run time and the inferred type serves the checker."},
{id:"p50q7", type:"mc", q:"Which compiler option makes crews[0] have type string | undefined for crews: string[]?", options:["strictNullChecks", "exactOptionalPropertyTypes", "erasableSyntaxOnly", "noUncheckedIndexedAccess"], answer:3, why:"Without noUncheckedIndexedAccess, index access returns the element type even though the index may be out of bounds."},
{id:"p50q8", type:"mc", q:"What does for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0); print?", options:["3 3 3", "0 1 2", "undefined three times", "2 2 2"], answer:0, why:"var is function-scoped, so the three closures share one i, which is 3 when the callbacks run; let would print 0 1 2."},
{id:"p50q9", type:"mc", q:"Memoizing a function is safe only when the function is:", options:["Recursive", "Pure", "Asynchronous", "Curried"], answer:1, why:"A cache returns the first result forever; that is correct only if the same input always produces the same output with no side effects."},
{id:"p50q10", type:"mc", q:"How many values does { ok: boolean; level: \"a\" | \"b\" | \"c\" } have, and how many does boolean | \"a\" | \"b\" | \"c\" have?", options:["5 and 6", "6 and 6", "8 and 5", "6 and 5"], answer:3, why:"A product type multiplies (2 × 3 = 6); a sum type adds (2 + 3 = 5)."},
{id:"p50q11", type:"mc", q:"Under the usual professional rule, which failure should a function signal by returning a Result rather than throwing?", options:["An internal invariant is broken", "The process is out of memory", "A user-supplied CSV line cannot be parsed", "A programming error passes null where it is impossible"], answer:2, why:"Results are for expected, recoverable failures the caller should handle; exceptions are for bugs and unrecoverable conditions."},
{id:"p50q12", type:"mc", q:"class ReadOnlyList extends List overrides add() to throw. Which principle does this violate?", options:["Liskov substitution", "Single responsibility", "Open/closed", "Interface segregation"], answer:0, why:"Code written for List breaks when given a ReadOnlyList, so the subtype cannot substitute for its base type."},
{id:"p50q13", type:"mc", q:"Which is the clearest sign of over-engineering?", options:["An interface with two implementations, one used in tests", "A strategy registry over a union of five export formats", "An adapter around a vendor SDK", "A factory whose only job is to call one constructor, with one implementation"], answer:3, why:"The factory absorbs no variation; the others each hide a real, present difference."},
{id:"p50q14", type:"mc", q:"In hexagonal architecture, which dependency is forbidden?", options:["An HTTP adapter importing a use case", "A SQLite adapter implementing a repository port", "A domain module importing the Postgres driver", "The composition root importing every adapter"], answer:2, why:"Source dependencies must point inward; the core must not depend on infrastructure, while adapters and the composition root may depend on the core."},
{id:"p50q15", type:"mc", q:"Under set -e, why does i=0; (( i++ )) end the script?", options:["The arithmetic command returns status 1 because the expression's value is 0", "(( )) is not allowed under set -e", "i++ is a syntax error in Bash", "set -u treats i as unset"], answer:0, why:"(( expr )) returns 1 when expr evaluates to 0; i++ evaluates to the old value 0, so errexit fires. Use i=$((i + 1))."},
{id:"p50q16", type:"mc", q:"f=\"Reel 17 as-built.xlsx\"; printf '[%s] ' $f prints:", options:["[Reel 17 as-built.xlsx]", "[Reel] [17] [as-built.xlsx]", "[$f]", "Nothing; it is an error"], answer:1, why:"The unquoted expansion is split on IFS into three words; \"$f\" would print one bracketed argument."},
{id:"p50q17", type:"sa", q:"A dashboard computes total feet with (await res.json()) as Reel[] and reports 72 million feet after an upstream change. Explain the failure mechanism and design the fix, including where validation belongs and how you would prevent a regression.", answer:"The cast is a type assertion that checks nothing, and types erase at run time. The upstream API began sending numbers as strings; + concatenated them, so the sum became a huge string. Fix: treat the JSON as unknown, parse it once at the boundary with a runtime schema (Zod: z.array(Reel).safeParse), derive the type with z.infer, and return a Result so the caller must handle rejection (show the error, alert) instead of publishing a wrong number. Prevent regression with a test against a broken-data server mode asserting rejection, and run tsc --noEmit plus tests in CI.", rubric:["Identifies the cast as unchecked and type erasure as the reason","Explains string concatenation as the mechanism","Places runtime validation at the boundary with a derived type","Handles failure explicitly (Result or equivalent) and adds a regression test"]},
{id:"p50q18", type:"sa", q:"Explain, in order, how Bash expands the command rm -rf $dir/* when dir is empty and when dir is \"my backups\", and give the safe version with the reasons for each change.", answer:"Parameter expansion happens first: empty dir gives /* and \"my backups\" gives my backups/*. Word splitting then cuts the unquoted result on spaces (my and backups/*), and pathname expansion globs each word: /* becomes every top-level directory, backups/* matches inside a different folder. Safe: rm -rf -- \"${dir:?}\"/* — quotes stop splitting and globbing of the variable part while leaving the trailing * to glob inside the directory; ${dir:?} aborts if dir is empty or unset; -- stops filenames beginning with - being read as options. Also run under set -euo pipefail and check ShellCheck (SC2086, SC2115).", rubric:["Correct expansion order: parameter expansion, then word splitting, then globbing","Empty-variable case leads to /*","Spaces case splits into wrong arguments","Safe version uses quotes, ${dir:?} and --, with reasons"]}
],
cards:[
{id:"p50c1", front:"Structural typing", back:"TypeScript's compatibility rule: a value fits a type if it has the required properties with compatible types, whatever it was named. Fresh object literals also get an excess property check."},
{id:"p50c2", front:"Discriminated union", back:"A union of object types sharing a literal-typed tag (kind, status); switching on the tag narrows each branch, and assigning the leftover to never makes the switch exhaustive."},
{id:"p50c3", front:"Type narrowing", back:"Control-flow analysis that shrinks a variable's type along each path after checks such as typeof, ===, in, instanceof, Array.isArray or a type guard (x is T)."},
{id:"p50c4", front:"Generics", back:"Type parameters filled in at each use, relating inputs to outputs: function pluck<T, K extends keyof T>(xs: T[], k: K): T[K][]. A type parameter should appear at least twice."},
{id:"p50c5", front:"Utility types", back:"Built-in type transformers: Partial, Required, Readonly, Pick, Omit, Record, Exclude, Extract, NonNullable, ReturnType, Parameters, Awaited."},
{id:"p50c6", front:"Type erasure", back:"Types, interfaces, generics, as, satisfies and import type are deleted before the program runs; enum, value namespaces and parameter properties generate code and are not erasable."},
{id:"p50c7", front:"Strict mode", back:"The TypeScript strict flag (default since 6.0): strictNullChecks, noImplicitAny, strictFunctionTypes, strictPropertyInitialization, useUnknownInCatchVariables, strictBindCallApply, noImplicitThis."},
{id:"p50c8", front:"Type stripping", back:"Node.js runs .ts files by replacing types with whitespace (default since 22.18, stable since 24.12): no type checking, tsconfig ignored, import type and file extensions required, enums rejected."},
{id:"p50c9", front:"Runtime validation", back:"Checking untrusted data where it enters the program (HTTP, files, env) because types erase; e.g. Zod's safeParse, with z.infer deriving the static type from the schema."},
{id:"p50c10", front:"Pure function", back:"Returns the same output for the same input and has no side effects (no I/O, mutation, clock or randomness); enables referential transparency, caching and table-driven tests."},
{id:"p50c11", front:"Immutability", back:"Values never change after creation; you make new ones (spread, toSorted, structuredClone, frozen dataclasses). const and readonly are not deep immutability; persistent structures share structure."},
{id:"p50c12", front:"Higher-order function", back:"A function that takes or returns a function: map, filter, reduce, sort with a comparator, decorators such as withRetry or @functools.cache."},
{id:"p50c13", front:"Closure", back:"A function plus the variables in scope where it was created, captured by reference; gives private state, and explains the var-loop (3, 3, 3) and Python late-binding bugs."},
{id:"p50c14", front:"Algebraic data type", back:"A type built from products (records: |A| × |B| values) and sums (tagged unions: |A| + |B| values); used to make illegal states unrepresentable."},
{id:"p50c15", front:"Pattern matching", back:"Testing a value's shape and binding its parts in one step: Python match/case (3.10+) with class and mapping patterns and guards; Haskell function equations; TS switch on a tag."},
{id:"p50c16", front:"Result type", back:"A sum of success-with-value and failure-with-error (Result<T, E>, Either); puts expected failures in the signature and chains with andThen/flatMap. Option is the absence-only version."},
{id:"p50c17", front:"Function composition", back:"Building a function from functions: compose(f, g)(x) = f(g(x)); pipe applies left to right like a Unix pipeline; currying makes stages easy to build."},
{id:"p50c18", front:"Lazy evaluation", back:"Computing values only when demanded: generators, ES2025 iterator helpers, Python generator expressions, Haskell by default. Saves work and memory; moves when work and errors happen."},
{id:"p50c19", front:"SOLID", back:"Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion — useful heuristics with real costs when applied mechanically."},
{id:"p50c20", front:"Strategy pattern", back:"Make an algorithm swappable; in TypeScript and Python usually just a function parameter or a Record of functions keyed by a union type."},
{id:"p50c21", front:"Observer pattern", back:"Subscribers register with a subject and are notified of events without the subject knowing them; watch for leaked subscriptions and invisible control flow."},
{id:"p50c22", front:"Decorator pattern", back:"Wrap a function or object to add behavior (retry, cache, timing, logging) without changing it; Python's @ syntax, TypeScript higher-order functions."},
{id:"p50c23", front:"Adapter pattern", back:"Translate an interface you are given (a vendor SDK) into the interface your code owns; the basis of hexagonal adapters."},
{id:"p50c24", front:"Hexagonal architecture", back:"Ports and adapters (Cockburn, 2005): the application owns interfaces (ports); adapters for HTTP, CLI, databases and clocks plug in; source dependencies point inward."},
{id:"p50c25", front:"Dependency injection", back:"A component receives its collaborators (constructor or function arguments) instead of creating them; wired in a composition root; makes every port a testing seam."},
{id:"p50c26", front:"Word splitting", back:"After expansion, Bash splits unquoted results on IFS (space, tab, newline) and then globs them; double quotes prevent both. ShellCheck SC2086."},
{id:"p50c27", front:"Exit status", back:"0–255; 0 is success. 1 general error, 2 usage, 126 not executable, 127 not found, 128 + n killed by signal n (130 Ctrl-C, 137 SIGKILL, 141 SIGPIPE, 143 SIGTERM)."},
{id:"p50c28", front:"ShellCheck", back:"Static analyzer for shell scripts; key codes SC2086 (quote), SC2045 (ls loop), SC2155 (local masks status), SC2164 (cd || exit), SC2115 (guard rm), SC3010 ([[ ]] in sh)."}
]
});
