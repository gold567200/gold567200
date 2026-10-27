/* Domain 4 — Coding Fundamentals (taught in Python; facts as of October 2026, examples run on CPython 3.14.6) */
BOOTCAMP.phases.push({
id:"p4", num:4, title:"Coding Fundamentals", short:"Code",
tagline:"How to think like a programmer — in Python, down to the mechanism: what the interpreter does with your text, what a name really points at, what each data structure costs, and the professional loop of venv, pytest, the debugger and Git. The ideas transfer to every language.",
prereq:"Domains 1 and 3 help (what memory is; the terminal), but you can start here. Install Python 3.14 or 3.15 from python.org (or your package manager), or start in the in-app Real Python lab at #py; anything with files, packages or Git needs the real local install.",
outcomes:[
"Model a problem with variables, the core data types, and expressions, and predict what any Python line evaluates to — including floor division with negatives, float rounding, precedence and truthiness.",
"Explain how CPython runs code (source → AST → bytecode → evaluation loop), read dis output, and describe the object model: names versus objects, identity, mutability, reference counting and the cyclic garbage collector.",
"Direct a program with conditionals, loops and boolean logic, and explain the iteration protocol a for loop runs on.",
"Decompose a problem into functions with clear inputs, outputs and scope; apply LEGB, closures, *args/**kwargs and keyword-only parameters, and draw the call stack.",
"Choose the right built-in data structure (list, tuple, dict, set) from its memory layout and Big-O cost, and confirm the choice with a timeit measurement.",
"Handle text, bytes and UTF-8 correctly, read and write files safely, raise and catch exceptions deliberately, and read a traceback and debug methodically with pdb and logging.",
"Explain recursion and implement linear/binary search and a simple sort; use memoization and state the cost of each approach.",
"Use objects and classes, modules, packages and virtual environments with pyproject.toml; write pytest tests that catch regressions; and keep a solo project in Git."
],
texts:[
{title:"Automate the Boring Stuff with Python (3rd ed.)", by:"Al Sweigart", note:"Free online. The best absolute-beginner on-ramp; do Parts I–II.", url:"https://automatetheboringstuff.com"},
{title:"Python Crash Course (3rd ed.)", by:"Eric Matthes", note:"The most-recommended first Python book; project-driven.", url:""},
{title:"CS50x / CS50P (Harvard)", by:"David Malan", note:"Free. CS50P is Python; CS50x is the broader CS intro. World-class lectures.", url:"https://cs50.harvard.edu/python/"},
{title:"Python Institute PCEP/PCAP objectives", by:"Python Institute", note:"The checklist for this domain's certification track: PCEP-30-02 and PCAP-31-03 are active; PCEP-30-03 and PCAP-31-04 are scheduled for 31 October 2026.", url:"https://pythoninstitute.org/pcep"}
],
modules:[
{id:"p4m1", title:"What a Program Is: Values, Variables, Types and Expressions", minutes:50,
outcomes:["Explain what the interpreter does with a file: tokenize, parse, compile to bytecode, execute — and read a dis listing.","Name Python's core types, their literal forms and their real costs (arbitrary-precision int, IEEE 754 float).","Predict the result and type of any expression, including floor division with negatives, precedence, the float-rounding trap and truthiness.","Use variables as names bound to objects, not boxes, and explain identity, mutability and reference counting.","Diagnose the five most common beginner type errors from their messages."],
body:`<p>What actually happens between typing <code>python3 hello.py</code> and seeing output — and what is a variable, really? Get this module exact and every later bug becomes a question you can answer: <em>which object does this name point at right now, and what is its type?</em> A program is a sequence of instructions that transforms data. In Python, the <strong>interpreter</strong> first compiles your whole file and then executes it one statement at a time, evaluating each and moving on, which is why Python is forgiving to learn: you can try one line in the <strong>REPL</strong> (the interactive prompt) and see the result immediately. Everything you learned in Domain 1 is underneath this: each value is bytes in memory, each operation is the CPU following instructions. Python hides that so you can think about the problem — but a professional knows exactly what is being hidden.</p>
<h4>How your code actually runs: source, bytecode, interpreter</h4>
<p>The program called <code>python3</code> is almost always <strong>CPython</strong>, the reference implementation, written in C (Domain 15 teaches you to read it). It processes a file in four stages. The tokenizer cuts the text into tokens (names, numbers, operators, INDENT and DEDENT markers — this is where indentation becomes syntax). The PEG parser (the default since 3.9) arranges the tokens into an abstract syntax tree; <code>python3 -m ast hello.py</code> prints it. The compiler walks the tree and emits <strong>bytecode</strong>: compact instructions for a virtual stack machine, stored in a <strong>code object</strong>. Finally the evaluation loop (<code>ceval.c</code>) executes the instructions one by one, pushing and popping values on a per-call value stack. Because the whole file compiles first, a SyntaxError on line 40 means line 1 never runs. When you <code>import</code> a module, its bytecode is cached in <code>__pycache__/name.cpython-314.pyc</code> and reused until the source changes; the script you run directly is recompiled every time. The <code>dis</code> module shows the bytecode:</p>
<pre>import dis
def total(price, qty):
    return price * qty + 5
dis.dis(total)

# CPython 3.14.6 prints:
  3           RESUME                   0
  4           LOAD_FAST_BORROW_LOAD_FAST_BORROW 1 (price, qty)
              BINARY_OP                5 (*)
              LOAD_SMALL_INT           5
              BINARY_OP                0 (+)
              RETURN_VALUE</pre>
<p>Read it as a stack machine: push <code>price</code> and <code>qty</code>, multiply the top two, push the constant 5, add, return the top of the stack. CPython 3.13 prints <code>LOAD_FAST_LOAD_FAST</code> and <code>LOAD_CONST</code> for the same function: bytecode is an implementation detail that changes every release, which is why <code>.pyc</code> names carry the version. Since 3.11 the specializing adaptive interpreter (PEP 659) rewrites hot instructions into type-specific fast paths — an add that keeps seeing two ints becomes an int-only add — which is most of why 3.11 averaged 1.25× faster than 3.10. An experimental JIT has shipped since 3.13 (off by default), and Python 3.15, released 9 October 2026, makes UTF-8 the default text encoding (Module 5) and adds explicit lazy imports (Module 7). When a Domain 11 malware sample turns out to be a PyInstaller bundle, these <code>.pyc</code> files are what you disassemble.</p>
<h4>Values and types</h4>
<p>Every value has a type that determines what you can do with it. The core types:</p>
<table><tr><th>Type</th><th>Example</th><th>What it is</th></tr>
<tr><td>int</td><td>42, -7, 1000000</td><td>Whole numbers, unlimited size in Python</td></tr>
<tr><td>float</td><td>3.14, 2.0, 1e-9</td><td>Real numbers (IEEE 754, Domain 1); approximate</td></tr>
<tr><td>str</td><td>"hello", 'x'</td><td>Text, a sequence of characters</td></tr>
<tr><td>bool</td><td>True, False</td><td>Truth values (a subtype of int: True==1)</td></tr>
<tr><td>NoneType</td><td>None</td><td>The absence of a value</td></tr>
<tr><td>bytes</td><td>b"\\x00\\xff"</td><td>Raw bytes 0–255: files, sockets, encodings (Module 5)</td></tr>
<tr><td>list / dict / set / tuple</td><td>[1,2], {"a":1}</td><td>Collections (Module 4)</td></tr></table>
<p>Check a type with <code>type(x)</code>. Convert with the type's name: <code>int("42")</code> gives 42, <code>str(42)</code> gives "42", <code>float("3.14")</code> gives 3.14. A bad conversion raises an error (<code>int("x")</code> raises ValueError), which you will learn to handle in Module 5. Integer literals come in four bases — <code>0b1010</code> is 10, <code>0o17</code> is 15, <code>0xFF</code> is 255 — and underscores group digits (<code>1_000_000</code>). Python integers have arbitrary precision in the language model, but they are limited by available memory and implementation details. In common 64-bit CPython builds, an int is a heap object whose magnitude is stored in internal digits; <code>sys.getsizeof(1)</code> is often 28 bytes, <code>2**30</code> often 32 and <code>2**100</code> often 40. These are implementation- and build-dependent examples, not language guarantees, and a C <code>long</code> has platform-dependent width. Since 3.11, converting an int of more than 4,300 decimal digits to or from a string raises ValueError — a deliberate guard against denial-of-service input, adjustable with <code>sys.set_int_max_str_digits</code>. A float is an IEEE 754 binary64 double: 53 bits of mantissa, about 15–17 significant decimal digits, so <code>0.1 + 0.2</code> is <code>0.30000000000000004</code> and <code>0.1 + 0.2 == 0.3</code> is False. Compare floats with <code>math.isclose</code>, and keep money in integer cents or <code>decimal.Decimal</code>. Two console facts the PCEP exam loves: <code>input()</code> always returns a str, and <code>print(a, b, sep="-", end="")</code> controls the separator and the line ending.</p>
<h4>Variables are names, not boxes</h4>
<p>A variable is a name bound to an object. <code>x = [1, 2, 3]</code> does not put a list "in" x; it makes x refer to a list object. This matters: <code>y = x</code> makes y refer to the <em>same</em> list, so <code>y.append(4)</code> changes what x sees too. Numbers and strings are immutable (you cannot change them in place, so this never surprises you), but lists and dicts are mutable and shared by reference. This single idea prevents a whole class of bugs, and it is why Domain 1's "a pointer is an address" was worth learning.</p>
<p>The precise model: every object has an <strong>identity</strong> (<code>id(x)</code>, its memory address in CPython), a type, and a value; the identity and type never change. A name lives in a <strong>namespace</strong>, which is literally a dict from strings to object references — <code>globals()</code> shows the module's. <code>a is b</code> asks "same object?" (compares identities); <code>a == b</code> asks "equal values?". To get a separate list, copy it: <code>list(a)</code>, <code>a[:]</code> or <code>a.copy()</code>. Memory is managed by <strong>reference counting</strong>: each object counts how many names and containers refer to it, and when the count drops to zero CPython frees it on the spot. Two objects that refer only to each other never reach zero, so a cyclic garbage collector (the <code>gc</code> module) periodically finds such unreachable groups and frees them. CPython also caches the ints from -5 to 256 and interns many short strings, so <code>x is 256</code> may be True while the same test with 1000 is False. That is an implementation detail, not a language rule: use <code>is</code> only for <code>None</code> (<code>if x is None:</code>), and <code>==</code> for everything else.</p>
<h4>Expressions and operators</h4>
<p>An expression evaluates to a value. Arithmetic: <code>+ - * /</code>, plus <code>**</code> (power), <code>//</code> (floor division), <code>%</code> (remainder). Two traps that trip every beginner: <code>/</code> always gives a float in Python 3 (<code>7 / 2</code> is 3.5, not 3), while <code>//</code> floors (<code>7 // 2</code> is 3); and <code>%</code> (modulo) gives the remainder, which is how you test even/odd (<code>n % 2 == 0</code>) and wrap around a range. String operators: <code>+</code> concatenates ("a" + "b" is "ab"), <code>*</code> repeats ("ab" * 3). Comparisons (<code>== != &lt; &gt; &lt;= &gt;=</code>) produce booleans. Precedence follows math (<code>*</code> before <code>+</code>); use parentheses when unsure.</p>
<p>Floor division floors toward negative infinity, not toward zero as C and Java do: <code>-7 // 2</code> is -4 and <code>-7 % 2</code> is 1, because Python keeps the invariant <code>a == (a // b) * b + a % b</code> — check it: (-4)(2) + 1 = -7. The remainder therefore takes the sign of the divisor, which is exactly what you want for wrapping an index around a ring of 12 fiber positions: <code>(pos - 1) % 12</code> never goes negative. Comparisons chain: <code>0 &lt; x &lt; 10</code> means <code>0 &lt; x and x &lt; 10</code>. Assignment with <code>=</code> is a statement, not an expression; the walrus operator <code>:=</code> (3.8+) is the expression form, as in <code>while (line := f.readline()):</code>.</p>
<table><tr><th>Priority (high → low)</th><th>Operators</th><th>Worked case</th></tr>
<tr><td>1</td><td><code>**</code> (right-associative)</td><td><code>2 ** 3 ** 2</code> = 2 ** 9 = 512</td></tr>
<tr><td>2</td><td>unary <code>-</code>, <code>+</code>, <code>~</code></td><td><code>-2 ** 2</code> = -(2 ** 2) = -4</td></tr>
<tr><td>3</td><td><code>* / // %</code></td><td><code>7 + 10 % 4</code> = 7 + 2 = 9</td></tr>
<tr><td>4</td><td><code>+ -</code></td><td><code>"ab" * 3 + "c"</code> = "abababc"</td></tr>
<tr><td>5</td><td>comparisons, <code>in</code>, <code>is</code></td><td><code>1 + 1 == 2</code> is True</td></tr>
<tr><td>6–8</td><td><code>not</code>, then <code>and</code>, then <code>or</code></td><td><code>not 0 or 0 and 5</code> = True or 0 = True</td></tr></table>
<h4>Truthiness</h4>
<p>Every value is usable as a condition. "Falsy" values are <code>False</code>, <code>0</code>, <code>0.0</code>, <code>""</code>, <code>[]</code>, <code>{}</code>, and <code>None</code>; everything else is "truthy". So <code>if items:</code> means "if the list is non-empty", a Python idiom you will read constantly. The boolean operators <code>and</code>, <code>or</code>, <code>not</code> short-circuit: <code>a and b</code> stops at a if a is falsy, and returns the actual value, not always a bool, which enables the idiom <code>name = user_input or "guest"</code>. Because bool is a subclass of int, <code>True + True</code> is 2 and <code>sum(flags)</code> counts the True values in a list — handy, and a source of puzzles on the exam.</p>
<h4>f-strings</h4>
<p>The modern way to build text from values: put an f before the quote and expressions in braces. <code>f"{name} scored {score} ({score/total:.0%})"</code> inserts the values and formats the percentage. This is how you produce readable output, and it replaces older, clumsier formatting. After the colon comes the format specification: <code>{x:.3f}</code> three decimals, <code>{n:,}</code> thousands separators (1,234,567), <code>{s:&gt;8}</code> right-align in 8 columns, <code>{x!r}</code> the debugging repr, and <code>{x=}</code> prints the expression and its value (<code>x=42</code>), the fastest debug print there is. Rounding is round-half-to-even, so <code>f"{0.875:.0%}"</code> prints 88% and <code>round(2.5)</code> is 2.</p>
<h4>Failure modes and how to read them</h4>
<table><tr><th>Symptom</th><th>Cause</th><th>Fix</th></tr>
<tr><td><code>TypeError: can only concatenate str (not "int") to str</code></td><td>"Total: " + 5</td><td>f"Total: {5}" or str(5)</td></tr>
<tr><td>5 + 5 prints 55</td><td><code>input()</code> returned two strs</td><td><code>int(input())</code> at the boundary</td></tr>
<tr><td>Sum of 0.1s never equals 1.0</td><td>binary floats cannot represent 0.1</td><td><code>math.isclose</code>, integer cents</td></tr>
<tr><td><code>NameError: name 'totl' is not defined</code></td><td>a typo or a name used before assignment</td><td>3.10+ often adds "Did you mean: 'total'?"</td></tr>
<tr><td>SyntaxError points at the line <em>after</em> the bug</td><td>an unclosed bracket swallows the next line</td><td>look one line up; count brackets</td></tr></table>
<p><em>Certification mapping.</em> This module is PCEP-30-02 Block 1, Computer Programming and Python Fundamentals (18% of the exam, 7 items): interpreters versus compilers, lexis, syntax and semantics, literals and numeral systems, operators and their precedence, type casting, and console I/O with <code>print()</code> and <code>input()</code>. The operator-precedence and floor-division questions also appear inside Block 2 and 3 code snippets, so drill the table above until <code>-7 // 2</code> and <code>2 ** 3 ** 2</code> answer themselves.</p>`,
example:`<p><strong>Predict the output.</strong> Given <code>a = 3</code>, <code>b = 4</code>, what is <code>f"{a} and {b} make {a + b}, and {a}/{b} = {a / b:.2f}"</code>? The braces evaluate: a is 3, b is 4, a+b is 7, a/b is 0.75 formatted to two decimals. Result: <code>3 and 4 make 7, and 3/4 = 0.75</code>. Note a/b used true division (0.75), not floor (which would be 0).</p>
<p><strong>A complete program, run on CPython 3.14.6.</strong> Save as <code>names.py</code> and run <code>python3 names.py</code> (or paste it into the Real Python lab at #py):</p>
<pre>import sys

a = [1, 2, 3]
b = a                 # second name, same object
b.append(4)
print(a, a is b, id(a) == id(b))
c = list(a)           # a new list with equal contents
print(c == a, c is a)
print(7 / 2, 7 // 2, 7 % 2, -7 // 2, -7 % 2)
print(0.1 + 0.2, 0.1 + 0.2 == 0.3)
print(sys.getsizeof(0), sys.getsizeof(1), sys.getsizeof(2**30), sys.getsizeof(2**100))
print(True + True, type(True).__mro__)
print(0b1010, 0o17, 0xFF, 1_000_000, -2 ** 2, 2 ** 3 ** 2)
name = None or "guest"
print(name, f"{7/9:.3f}", f"{0.875:.0%}", f"{1234567:,}")</pre>
<pre>[1, 2, 3, 4] True True
True False
3.5 3 1 -4 1
0.30000000000000004 False
28 28 32 40
2 (&lt;class 'bool'&gt;, &lt;class 'int'&gt;, &lt;class 'object'&gt;)
10 15 255 1000000 -4 512
guest 0.778 88% 1,234,567</pre>
<p>Every line is a lesson: one list with two names; a copy that is equal but not identical; floor division rounding toward negative infinity; the binary float error; ints growing by 4 bytes per 30-bit digit; bool inheriting from int; four literal bases and right-associative power; <code>or</code> returning an operand.</p>`,
misconceptions:["\"7 / 2 is 3.\" In Python 3, / always gives a float (3.5); use // for integer floor division.","\"y = x copies the list.\" It binds a second name to the same object; mutating through one is visible through the other.","\"== and = are the same.\" = binds a name; == compares values. Using = in an if is a syntax error in Python (a small mercy).","\"Python reads and runs my file one line at a time.\" CPython compiles the whole file to bytecode first, which is why a SyntaxError near the end stops even the first print; execution then proceeds statement by statement.","\"x is y is just a faster ==.\" is compares identity. Small-int caching makes 256 is 256 True while equal 1000s can be different objects; use is only for None.","\"-7 // 2 is -3, like in C.\" Python floors toward negative infinity: -7 // 2 is -4 and -7 % 2 is 1, keeping a == (a // b) * b + a % b."],
problems:[
{q:"What are the value and type of 10 // 3, 10 % 3, and 10 / 3?", a:"3 (int), 1 (int), 3.3333… (float). // floors, % is remainder, / is true division."},
{q:"After a = [1,2]; b = a; b.append(3), what is a?", a:"[1, 2, 3] — a and b name the same list object."},
{q:"Write an expression that is True when n is an even number greater than 100.", a:"n % 2 == 0 and n > 100"},
{q:"What does \"ab\" * 3 + \"c\" evaluate to?", a:"'abababc' — repetition binds before concatenation here because * precedes +."},
{q:"Why is `if names:` preferred over `if len(names) > 0:`?", a:"An empty list is falsy, so the shorter form reads naturally and works for any collection; both are correct."},
{q:"Predict exactly: print(-7 // 2, -7 % 2, 2 ** 3 ** 2, -2 ** 2, 7 + 10 % 4). Show the arithmetic.", a:"-4 1 512 -4 9. Floor of -3.5 is -4 and the remainder is -7 - (-4)(2) = 1; ** is right-associative so 3 ** 2 = 9 first, then 2 ** 9 = 512; unary minus binds looser than ** so -(2 ** 2) = -4; % before + gives 7 + 2 = 9."},
{q:"A field crew script asks for two cable lengths with input() and prints 'Total: 1525' when the user typed 15 and 25. Diagnose and fix.", a:"input() returns str, so + concatenated '15' and '25'. Convert at the boundary: a = int(input()); b = int(input()); print(f'Total: {a + b}') → Total: 40. Wrap the int() in try/except ValueError (Module 5) for bad input."},
{q:"You sum the price 0.10 ten times and test == 1.0; it is False. Explain the mechanism and give two correct fixes.", a:"0.1 has no exact binary64 representation (it is stored as 0.1000000000000000055…), and ten roundings accumulate to 0.9999999999999999. Fix: compare with math.isclose(total, 1.0), or keep money in integer cents (10 * 10 == 100) or decimal.Decimal('0.10')."},
{q:"How many bytes does sys.getsizeof report for 2**60 on 64-bit CPython, and why? (0 and 1 take 28; each 30-bit digit adds 4.)", a:"2**60 needs 61 bits, i.e. three 30-bit digits (90 bits ≥ 61), so 28 - 4 + 3×4 = 36 bytes: a 24-byte header plus 4 bytes per digit. (2**30 = 32 bytes with two digits; 2**100 = 40 with four.)"}
],
checks:[{q:"What does // do?",a:"Floor (integer) division."},{q:"Name three falsy values.",a:"Any of: False, 0, '', [], {}, None."},{q:"Is a variable a box or a name?",a:"A name bound to an object."},{q:"Which module shows a function's bytecode?",a:"dis (dis.dis(f))."},{q:"When does CPython free an object?",a:"When its reference count reaches zero; the cyclic GC handles reference cycles."}],
explain:"Explain to ADA why `a = [1]; b = a; b.append(2)` changes a, but `a = 1; b = a; b = b + 1` does not change a. Use the words 'name', 'object', 'mutable'."},
{id:"p4m2", title:"Control Flow: Conditionals, Loops and Boolean Logic", minutes:50,
outcomes:["Write if/elif/else chains that cover every case, in the right order.","Choose between for and while, explain the iteration protocol a for loop runs on, and avoid infinite loops.","Use range, enumerate, zip, break, continue, pass, else-on-loop and match.","Apply truth tables, short-circuiting and De Morgan's laws to build and simplify conditions.","Recognize and fix the classic loop bugs: off-by-one, mutating while iterating, the or-trap and exhausted iterators."],
body:`<p>A program that runs top to bottom can only do one thing. Control flow lets it decide and repeat, which is where logic turns into behavior. In Python, indentation is the syntax: the body of an if or loop is the indented block, so whitespace is not cosmetic, it is the structure. The tokenizer from Module 1 literally emits INDENT and DEDENT tokens, and mixing tabs and spaces raises TabError, so configure your editor to insert four spaces (PEP 8). This module answers two questions you will ask of every program you ever read: <em>which branch runs?</em> and <em>what makes this loop stop?</em></p>
<h4>Conditionals</h4>
<p><code>if condition:</code> runs its block when the condition is truthy. Add <code>elif</code> (else-if) for more cases and <code>else</code> for the fallback. Only the first matching branch runs:</p>
<pre><code>if score &gt;= 90:
    grade = "A"
elif score &gt;= 80:
    grade = "B"
else:
    grade = "C or below"</code></pre>
<p>Order matters: because only the first true branch runs, you check the most specific or highest threshold first. A common bug is writing <code>if score &gt;= 80</code> before <code>if score &gt;= 90</code>, so a 95 never reaches the A branch. For a one-line choice there is the <strong>conditional expression</strong>: <code>status = "pass" if loss_db &lt;= 0.3 else "re-splice"</code>. A block cannot be empty, so <code>pass</code> is the statement that does nothing — a placeholder while you sketch.</p>
<h4>The for loop</h4>
<p>Python's for loop iterates over a sequence, not a counter: <code>for item in items:</code> binds item to each element in turn. To count, use <code>range(n)</code> (0 to n-1), <code>range(a, b)</code> (a to b-1), or <code>range(a, b, step)</code>. To get both index and value, use <code>enumerate</code>: <code>for i, item in enumerate(items):</code>. To walk two sequences together, use <code>zip</code>: <code>for name, score in zip(names, scores):</code>. These three (range, enumerate, zip) cover almost every loop you will write, and reaching for them instead of manual index bookkeeping is the mark of fluent Python.</p>
<h4>What a for loop really does: the iteration protocol</h4>
<p>A for loop works on any <strong>iterable</strong> — an object that can hand out an <strong>iterator</strong>. The loop calls <code>iter(items)</code> once, then calls <code>next()</code> on the iterator before every pass, binding the result to the loop variable; when the iterator raises <code>StopIteration</code>, the loop ends. Written by hand:</p>
<pre>it = iter(items)
while True:
    try:
        item = next(it)
    except StopIteration:
        break
    print(item)          # the loop body</pre>
<p>Lists, strings, tuples, dicts (over their keys), sets, files (over their lines) and <code>range</code> are all iterables, which is why one loop syntax covers them all. <code>range</code> is lazy: it computes each number on demand, so <code>sys.getsizeof(range(10**9))</code> is 48 bytes, while a list of a billion ints would need over 8 GB of pointers alone. Its length is ⌈(stop − start) / step⌉: <code>range(2, 10, 3)</code> has ⌈8 / 3⌉ = 3 values (2, 5, 8), and <code>range(10, 0, -3)</code> gives 10, 7, 4, 1. One sharp edge: iterators are single-use. <code>pairs = zip(a, b)</code> can be looped once; the second loop over the same <code>pairs</code> silently does nothing. Turn it into a list if you need two passes. Module 4's generators and Domain 22's data pipelines are built on exactly this protocol.</p>
<h4>The while loop</h4>
<p><code>while condition:</code> repeats until the condition becomes falsy. Use it when you do not know the count in advance (read until end of file, retry until success, game loop until quit). The danger is the infinite loop: if nothing in the body changes the condition, it never ends. Always ask "what makes this stop?" When one does run away, press Ctrl+C: Python raises <code>KeyboardInterrupt</code> and the traceback names the exact line the loop was on. A subtle infinite loop: <code>x = 0.0; while x != 1.0: x += 0.1</code> never ends, because the float sum steps from 0.9999999999999999 to 1.0999999999999999 and is never exactly 1.0 (Module 1). Loop on <code>x &lt; 1.0</code>, or better, count with integers.</p>
<h4>break and continue</h4>
<p>Two statements, break and continue, steer a loop from inside its body. <code>break</code> exits the loop immediately; <code>continue</code> skips to the next iteration. Use break to stop searching once you have found what you need (and save work); use continue to skip items that do not qualify. Python also allows <code>else</code> on a loop, which runs only if the loop finished without a break, the clean way to express "searched everything and found nothing". The same rule holds for <code>while ... else</code>: the else runs when the condition turns false, but not after a break.</p>
<h4>Boolean logic: truth tables, short-circuits and De Morgan</h4>
<table><tr><th>a</th><th>b</th><th>a and b</th><th>a or b</th><th>not a</th></tr>
<tr><td>True</td><td>True</td><td>True</td><td>True</td><td>False</td></tr>
<tr><td>True</td><td>False</td><td>False</td><td>True</td><td>False</td></tr>
<tr><td>False</td><td>True</td><td>False</td><td>True</td><td>True</td></tr>
<tr><td>False</td><td>False</td><td>False</td><td>False</td><td>True</td></tr></table>
<p><strong>Short-circuit</strong> evaluation makes <code>and</code> a guard: in <code>if items and items[0] &gt; 0:</code> the index is never evaluated on an empty list, so it cannot raise IndexError. <strong>De Morgan's laws</strong> let you push a <code>not</code> inward: <code>not (a and b)</code> equals <code>(not a) or (not b)</code>, and <code>not (a or b)</code> equals <code>(not a) and (not b)</code>. So "reject unless the splice is both clean and under 0.3 dB" — <code>if not (clean and loss &lt;= 0.3):</code> — can be rewritten <code>if not clean or loss &gt; 0.3:</code>, which reads as the rule a tech would say aloud. Domain 14 proves these laws; Domain 38 builds them out of gates. The most common logic bug in beginner code is the <strong>or-trap</strong>: <code>if x == 1 or 2:</code> parses as <code>(x == 1) or 2</code>, and 2 is truthy, so the branch always runs. Write <code>if x in (1, 2):</code>.</p>
<h4>Under the hood: a loop is a compare and a jump</h4>
<p>Disassemble <code>for x in xs: if x &gt; 0: n += 1</code> on CPython 3.14 and you find <code>GET_ITER</code> (the <code>iter()</code> call), <code>FOR_ITER</code> (the <code>next()</code> call, which jumps past the loop when the iterator is exhausted), <code>COMPARE_OP (&gt;)</code>, <code>POP_JUMP_IF_TRUE</code> and two <code>JUMP_BACKWARD</code> instructions that return to <code>FOR_ITER</code>. That is the same shape as the compare-and-branch assembly you will read in Domain 15 and reverse in Domain 11: high-level control flow always lowers to conditional jumps.</p>
<h4>match: structural pattern matching</h4>
<p>Since 3.10, <code>match</code> compares a value against shapes, not just constants. <code>match cmd.split():</code> with <code>case ["go", direction]:</code> matches a two-word list starting with "go" and binds the second word; <code>case ["quit"] | ["exit"]:</code> matches either; <code>case _:</code> is the catch-all. Use it for parsing commands or messages with several shapes; for a plain number range an if/elif chain is still clearer.</p>
<h4>Nesting and flattening</h4>
<p>Loops and conditionals nest, but deep nesting is hard to read. Two habits keep it flat: return or continue early to handle the exceptional case and dedent the main path (a "guard clause"), and extract an inner block into a function (Module 3) once it has its own job. Three levels of indentation is a smell; four is a rewrite. Count the work, too: two nested loops over n and m items run n × m times, and the "every pair once" pattern <code>for i in range(n): for j in range(i + 1, n):</code> runs n(n − 1)/2 times — 499,500 passes for n = 1,000. Module 4 calls that O(n²).</p>
<h4>Failure modes and fixes</h4>
<table><tr><th>Bug</th><th>What you see</th><th>Fix</th></tr>
<tr><td>Off-by-one</td><td><code>range(1, 10)</code> stops at 9</td><td><code>range(1, n + 1)</code>; test the boundary</td></tr>
<tr><td>Mutating while iterating</td><td><code>remove</code> inside the loop skips the next item</td><td>Build a new list with a comprehension</td></tr>
<tr><td>The or-trap</td><td>The branch always runs</td><td><code>x in (1, 2)</code></td></tr>
<tr><td>Float loop condition</td><td>A while loop never ends</td><td>Use <code>&lt;</code>, or count with ints</td></tr>
<tr><td>Exhausted iterator</td><td>The second loop over a zip does nothing</td><td><code>list(zip(...))</code> once</td></tr>
<tr><td>else at the wrong indent</td><td>A loop-else where you meant if-else</td><td>Line the else up with its if</td></tr></table>
<p>Practise these in the Real Python lab (#py): it runs real CPython in the browser through Pyodide, perfect for one-screen experiments like the ones above.</p>
<p><em>Certification mapping.</em> PCEP-30-02 Block 2, Control Flow — Conditional Blocks and Loops, is the largest block on the exam (29%, 8 items): if, if-else, if-elif-else and nesting; while and for loops; range(); pass, break and continue; and the while-else and for-else forms. Expect "how many times does this print?" items — count iterations with the range-length formula — and loop-else items where the answer hinges on whether a break fired.</p>`,
example:`<p><strong>FizzBuzz, the classic.</strong> Print 1 to 100, but "Fizz" for multiples of 3, "Buzz" for 5, "FizzBuzz" for both. The trick is order and modulo: <code>for n in range(1, 101): if n % 15 == 0: print("FizzBuzz") elif n % 3 == 0: print("Fizz") elif n % 5 == 0: print("Buzz") else: print(n)</code>. Check 15 first, because 15 is divisible by both 3 and 5; checking 3 first would catch it too early and never print FizzBuzz.</p>
<p><strong>Six loop mechanisms in one program (CPython 3.14.6).</strong></p>
<pre>import sys

it = iter(["a", "b"])                       # 1. the iteration protocol
print(next(it), next(it))
try:
    next(it)
except StopIteration:
    print("StopIteration ends the loop")

r = range(10**9)                            # 2. range is lazy
print(sys.getsizeof(r), len(range(2, 10, 3)), list(range(10, 0, -3)))

nums = [2, 4, 5, 6, 8]                      # 3. remove-while-iterating bug
for n in nums:
    if n % 2 == 0:
        nums.remove(n)
print("buggy:", nums)
nums = [n for n in [2, 4, 5, 6, 8] if n % 2 != 0]
print("fixed:", nums)

x = 3                                       # 4. the or-trap
print(x == 1 or 2, bool(x == 1 or 2), x in (1, 2))

for n in [3, 7, 11]:                        # 5. for-else
    if n % 2 == 0:
        print("found even", n)
        break
else:
    print("no even number")

def describe(cmd):                          # 6. match (3.10+)
    match cmd.split():
        case ["go", direction]:
            return f"moving {direction}"
        case ["quit"] | ["exit"]:
            return "bye"
        case _:
            return "unknown"
print(describe("go north"), "|", describe("exit"), "|", describe("dance"))</pre>
<pre>a b
StopIteration ends the loop
48 3 [10, 7, 4, 1]
buggy: [4, 5, 8]
fixed: [5]
2 True False
no even number
moving north | bye | unknown</pre>
<p>Trace the bug by index: the loop is at index 0 (value 2) and removes it, shifting 4 into index 0; the next pass reads index 1, which is now 5, so 4 is skipped. Index 2 is 6, removed, shifting 8 into index 2; index 3 no longer exists, so the loop ends with [4, 5, 8]. The comprehension builds a new list and never shifts anything.</p>`,
misconceptions:["\"Indentation is just style.\" In Python it defines the block; wrong indentation is a different program or a syntax error.","\"for loops need a counter variable.\" for iterates over a sequence; use enumerate if you also need the index.","\"elif branches are all checked.\" Only the first truthy branch runs; the rest are skipped.","\"if x == 1 or 2: tests whether x is 1 or 2.\" It parses as (x == 1) or 2, which is always truthy; write x in (1, 2).","\"Removing items from a list inside a for loop over it is fine.\" Each removal shifts later items left, so the loop skips the item after every removal; build a new list instead.","\"A loop's else runs when the loop body never executes.\" It runs whenever the loop ends without break — including after a full, normal run."],
problems:[
{q:"Rewrite this to use enumerate: i = 0; for name in names: print(i, name); i += 1", a:"for i, name in enumerate(names): print(i, name)"},
{q:"What prints? for n in range(2, 10, 3): print(n)", a:"2, 5, 8 (start 2, step 3, stop before 10)."},
{q:"Write a while loop that keeps asking for input until the user types 'quit'.", a:"while True:\\n    cmd = input('> ')\\n    if cmd == 'quit':\\n        break"},
{q:"Why must FizzBuzz test n % 15 (or 3 and 5 together) before n % 3?", a:"A number divisible by both 3 and 5 would match the % 3 branch first and print 'Fizz', never 'FizzBuzz'."},
{q:"What does loop-else do: for x in items: if x < 0: break; else: print('all non-negative')?", a:"The else runs only if the loop completed without hitting break — i.e., no negative was found."},
{q:"How many times does the body run? (a) for i in range(5, 50, 7)  (b) for i in range(10): for j in range(i): ...  (c) for i in range(100): for j in range(i + 1, 100): ...", a:"(a) ⌈45 / 7⌉ = 7 (5, 12, 19, 26, 33, 40, 47). (b) 0 + 1 + … + 9 = 45. (c) 100 × 99 / 2 = 4,950 — every unordered pair once."},
{q:"Simplify with De Morgan and remove the not: if not (connector_clean and loss_db <= 0.3): reject()", a:"if not connector_clean or loss_db > 0.3: reject() — not (A and B) = (not A) or (not B), and not (x <= 0.3) is x > 0.3."},
{q:"A colleague writes pairs = zip(fibers, losses), loops over pairs to print them, then loops again to find the worst splice — and the second loop finds nothing. Diagnose and fix.", a:"zip returns a single-use iterator; the first loop exhausted it, so the second loop's first next() raises StopIteration immediately. Fix: pairs = list(zip(fibers, losses)), or compute both results in one pass."},
{q:"Trace this and give the final list: nums = [1, 2, 2, 3]; for n in nums: if n == 2: nums.remove(n). Then write the correct one-liner.", a:"Index 0 is 1 (kept); index 1 is 2 → removed, list [1, 2, 3]; index 2 is now 3 (the second 2 was skipped) → loop ends with [1, 2, 3]. Correct: nums = [n for n in nums if n != 2] → [1, 3]."}
],
checks:[{q:"What defines a block in Python?",a:"Indentation."},{q:"Which loop when you don't know the count?",a:"while."},{q:"What does break do?",a:"Exits the loop immediately."},{q:"What exception ends a for loop internally?",a:"StopIteration, raised by the iterator's next()."},{q:"State one De Morgan law.",a:"not (a and b) == (not a) or (not b)  (or: not (a or b) == (not a) and (not b))."}],
explain:"Explain to ADA the difference between break and continue by describing what each does in a loop that searches a list for the first even number."},
{id:"p4m3", title:"Functions: Decomposition, Arguments, Return, Scope and Closures", minutes:55,
outcomes:["Define functions with parameters and return values, and explain what def and a call do at runtime (function object, frame, call stack).","Explain the difference between arguments and parameters; use positional, keyword, default, *args, **kwargs, keyword-only and positional-only parameters.","Resolve any name with the LEGB rule and explain UnboundLocalError, global and nonlocal.","Build and explain a closure, and avoid the late-binding and mutable-default traps.","Decompose a problem into small, testable functions."],
body:`<p>A function is a named, reusable block that takes inputs and (usually) returns an output. Functions are how you beat complexity: instead of one 300-line script, you write a dozen small functions each doing one thing, name them well, and compose them. This is the single most important habit in programming, and it is why Domain 4 spends a whole module on it. The question this module answers precisely: <em>when you call a function, what exists, where, and for how long?</em></p>
<h4>Defining and calling</h4>
<pre><code>def area(width, height):
    return width * height

a = area(3, 4)   # a is 12</code></pre>
<p><code>def</code> names the function; the names in parentheses are <em>parameters</em>; the values you pass when calling are <em>arguments</em>. <code>return</code> sends a value back and ends the function; a function with no return gives back <code>None</code>. A function that only prints is not the same as one that returns, a distinction beginners blur: print shows text to a human; return hands a value to the rest of the program. You can almost always prefer return, then print the result at the top level.</p>
<h4>What def and a call actually do</h4>
<p><code>def</code> is an executable statement, not a declaration. When Python reaches it, it builds a <strong>function object</strong> — the compiled code object from Module 1, a reference to the module's globals, and a tuple of default values — and binds it to the name. Functions are therefore ordinary values: you can store them in a list, pass them to <code>sorted(key=...)</code> and return them from other functions. Each <em>call</em> creates a fresh <strong>frame</strong>: a record holding that call's local variables, its value stack, the index of the next bytecode instruction, and a link back to the caller's frame. Frames pile up as calls nest — this pile is the <strong>call stack</strong> — and each frame is discarded when its function returns, which is why locals vanish after the call. A traceback (Module 5) is simply a printout of the frames that were live when the exception escaped, and Module 6's recursion limit caps how tall the pile may grow (1,000 frames by default). This is the same stack frame you will see as <code>push rbp; mov rbp, rsp</code> in Domain 15's disassembly, built in software by the interpreter instead of by the CPU.</p>
<h4>Arguments: positional, keyword, default</h4>
<p>Arguments bind to parameters by position by default: <code>area(3, 4)</code> sets width=3, height=4. You can pass by name for clarity: <code>area(height=4, width=3)</code>. Parameters can have defaults: <code>def greet(name, greeting="Hello"):</code> lets you call <code>greet("Sam")</code> or <code>greet("Sam", "Hi")</code>. One sharp trap: never use a mutable default like <code>def f(items=[])</code>, because that list is created once and shared across all calls; use <code>def f(items=None):</code> then <code>if items is None: items = []</code>. The mechanism is the previous section: defaults are evaluated once, when <code>def</code> runs, and stored on the function object — <code>f.__defaults__</code> shows the very list that keeps growing.</p>
<h4>Flexible parameters: *args, **kwargs, keyword-only, positional-only</h4>
<p>A parameter written <code>*values</code> collects any extra positional arguments into a tuple; <code>**options</code> collects extra keyword arguments into a dict. Parameters after the star are <strong>keyword-only</strong>: in <code>def report(title, *values, sep=", ", **options)</code>, sep can only be passed by name, so <code>report("temps", 71, 68, sep="|")</code> can never confuse a reading with a separator. A bare <code>/</code> marks the parameters before it as positional-only (3.8+), the way many built-ins work: <code>len(obj=x)</code> is an error. The full order is <code>def f(a, b, /, c, *args, d, **kwargs)</code>. At the call site the stars run in reverse — <code>report("row", *row)</code> spreads a list into positional arguments and <code>f(**settings)</code> spreads a dict into keywords — which is how wrappers forward "whatever they were given" to another function.</p>
<h4>Argument passing: call by sharing</h4>
<p>Python passes references to objects, not copies and not variables. Inside the function the parameter is a new name bound to the caller's object. So <em>mutating</em> it (<code>items.append(99)</code>) changes the object the caller also sees, while <em>rebinding</em> it (<code>n = n + 1</code>) only moves the local name and the caller sees nothing. This is Module 1's names-versus-objects rule applied across a call. Functions that mutate their arguments surprise callers; prefer returning a new value, and say so in the docstring when a function must mutate.</p>
<h4>Scope</h4>
<p>A name assigned inside a function is <em>local</em>: it exists only during the call and cannot be seen outside. A function can read names from the enclosing (global) scope, but assigning to a name makes it local unless you declare <code>global</code> (which you should almost never do). This isolation is a feature: each function is a sealed box, so you can reason about it alone. Domain 3's "each process has its own memory" is the same idea one level up. Shared mutable state (globals) is the source of the hardest bugs, which is why functional decomposition, passing data in and returning results out, is preferred.</p>
<p>The exact lookup order is the <strong>LEGB rule</strong>: Local (the current function), Enclosing (any outer functions, innermost first), Global (the module), Built-in (<code>len</code>, <code>print</code>, <code>range</code>). The first scope that has the name wins. Whether a name is local is decided at compile time: if a function assigns to <code>total</code> anywhere in its body, <code>total</code> is local for the <em>whole</em> body, so <code>total += 1</code> before any assignment raises <code>UnboundLocalError: cannot access local variable 'total' where it is not associated with a value</code>, even though a global <code>total</code> exists. <code>global total</code> or, for an enclosing function's variable, <code>nonlocal total</code>, tells the compiler otherwise. Shadowing works the same way in reverse: write <code>list = [1, 2]</code> at module level and later <code>list("abc")</code> raises <code>TypeError: 'list' object is not callable</code>, because G now hides B.</p>
<h4>Closures</h4>
<p>An inner function that uses a variable from its enclosing function keeps that variable alive after the outer function returns. The pair — function plus captured variables — is a <strong>closure</strong>. <code>make_counter()</code> below returns a <code>tick</code> function that remembers its own <code>count</code>; two counters made by two calls never share. CPython stores the captured variable in a cell object, visible as <code>tick.__closure__[0].cell_contents</code>. Closures are how decorators, callbacks and the <code>key=</code> functions of Module 6 carry configuration without globals. The trap is <strong>late binding</strong>: a closure captures the variable, not its value at the moment of creation, so <code>[lambda: i for i in range(3)]</code> produces three functions that all return 2, the final value of i. Bind the value as a default (<code>lambda i=i: i</code>) to freeze it.</p>
<h4>lambda, map and filter</h4>
<p><code>lambda x: x * 2</code> is an anonymous one-expression function — useful as a <code>key=</code> argument (<code>sorted(splices, key=lambda s: s[1])</code>) and nowhere it needs a name. <code>map(f, xs)</code> applies f to each item and <code>filter(pred, xs)</code> keeps the items where pred is truthy; both return lazy iterators (Module 2). In modern Python a comprehension usually reads better: <code>[x * 2 for x in xs if x &gt; 0]</code> replaces <code>list(map(lambda x: x * 2, filter(lambda x: x &gt; 0, xs)))</code>. Know both forms; the PCAP exam asks about the second.</p>
<h4>Decomposition in practice</h4>
<p>Faced with "count the ten most common words in a file", you do not write one blob. You write <code>read_text(path)</code>, <code>normalize(text)</code> (lowercase, strip punctuation), <code>count_words(words)</code>, and <code>top_n(counts, n)</code>, then compose them: <code>top_n(count_words(normalize(read_text(path))), 10)</code>. Each is a few lines, each testable alone, each reusable. If you can name what a block does, it wants to be a function. This is exactly the Unix philosophy from Domain 3, applied inside a program. A <strong>pure function</strong> — output depends only on inputs, no side effects — is the easiest kind to test (Module 8): give it inputs, assert on the output, no files or globals to set up. Push input/output to the edges and keep the core pure.</p>
<h4>Docstrings and type hints</h4>
<p>A triple-quoted string right after <code>def</code> documents the function (<code>help(fn)</code> shows it). Modern Python adds optional type hints: <code>def area(width: float, height: float) -&gt; float:</code>. Hints are not enforced at runtime, but they document intent and let tools catch mistakes, and you will see them everywhere in professional code. Run a checker such as mypy or pyright and <code>area("3", 4)</code> is flagged before the program ever runs; Domain 20 makes this part of the build.</p>
<table><tr><th>Symptom</th><th>Root cause</th><th>Fix</th></tr>
<tr><td><code>TypeError: unsupported operand type(s) for +: 'NoneType' and 'NoneType'</code></td><td>a function printed instead of returning</td><td>return the value; print at the edge</td></tr>
<tr><td>A default list keeps old items</td><td>defaults are evaluated once at def time</td><td><code>items=None</code> sentinel</td></tr>
<tr><td><code>UnboundLocalError</code></td><td>assignment later in the body made the name local</td><td>pass it in and return it; or <code>nonlocal</code>/<code>global</code></td></tr>
<tr><td><code>TypeError: f() missing 1 required positional argument</code></td><td>call does not match the parameter list</td><td>read the signature: <code>help(f)</code></td></tr>
<tr><td>Caller's list changed unexpectedly</td><td>function mutated its argument</td><td>copy inside, or return a new list</td></tr></table>
<p><em>Certification mapping.</em> PCEP-30-02 Block 4, Functions and Exceptions (28%, 8 items), covers the function half of this module: defining and invoking functions, return and None, recursion, parameters versus arguments, positional, keyword and mixed passing, default values, name scopes, shadowing and the global keyword. PCAP-31-03 Section 5 (Miscellaneous, 22%) adds lambdas with map() and filter(), and closures. The LEGB table and the UnboundLocalError rule are the two most-tested ideas; be able to predict both from a code listing.</p>`,
example:`<p><strong>Return vs print.</strong> Compare <code>def double(x): print(x * 2)</code> with <code>def double(x): return x * 2</code>. The first shows a number but gives back None, so <code>total = double(5) + double(5)</code> crashes (None + None). The second returns 10, so the sum is 20. Functions that return compose; functions that only print are dead ends. Write functions that return, and print at the edges.</p>
<p><strong>Scope, closures and parameters in one program (CPython 3.14.6).</strong></p>
<pre>rate = 0.08                      # global

def price_with_tax(amount):
    tax = amount * rate          # L: amount, tax   G: rate   B: round
    return round(amount + tax, 2)
print(price_with_tax(50))

def make_counter():
    count = 0                    # enclosing scope
    def tick():
        nonlocal count
        count += 1
        return count
    return tick
c1, c2 = make_counter(), make_counter()
print(c1(), c1(), c1(), c2())
print(c1.__closure__[0].cell_contents)

def add_tag(tag, tags=[]):       # default built ONCE, at def time
    tags.append(tag)
    return tags
print(add_tag("a"), add_tag("b"), add_tag.__defaults__)

def report(title, *values, sep=", ", **options):
    return f"{title}: {sep.join(str(v) for v in values)} {options}"
print(report("temps", 71, 68, 75, units="F"))
row = [1, 2, 3]
print(report("row", *row, sep="|"))

def bump(items, n):
    items.append(99)             # mutates the caller's list
    n = n + 1                    # rebinds a local name only
lst, k = [1], 1
bump(lst, k)
print(lst, k)

print([f() for f in [lambda: i for i in range(3)]])       # late binding
print([f() for f in [lambda i=i: i for i in range(3)]])   # value frozen

total = 0
def broken():
    total += 1                   # assignment makes 'total' local
try:
    broken()
except UnboundLocalError as e:
    print(type(e).__name__ + ":", e)</pre>
<pre>54.0
1 2 3 1
3
['a', 'b'] ['a', 'b'] (['a', 'b'],)
temps: 71, 68, 75 {'units': 'F'}
row: 1|2|3 {}
[1, 99] 1
[2, 2, 2]
[0, 1, 2]
UnboundLocalError: cannot access local variable 'total' where it is not associated with a value</pre>
<p>Line four is the mutable-default trap made visible: both calls return the <em>same</em> list object, which already holds both tags by the time print runs, and <code>__defaults__</code> shows it living on the function.</p>`,
misconceptions:["\"print and return do the same thing.\" print outputs text for a human; return hands a value to the program. Only returned values compose.","\"A function can change a global by assigning to it.\" Assigning creates a local name; you'd need the (discouraged) global keyword.","\"def f(items=[]) gives a fresh list each call.\" The default list is created once and shared; use None as the sentinel instead.","\"Python passes arguments by value, so a function can't change my list.\" It passes references to objects: mutating a list parameter changes the caller's list; only rebinding the parameter is invisible to the caller.","\"A variable is local only after the line that assigns it.\" Locality is decided at compile time for the whole function body, which is why reading it earlier raises UnboundLocalError.","\"Each lambda in [lambda: i for i in range(3)] remembers its own i.\" Closures capture the variable, not the value; all three see i's final value, 2."],
problems:[
{q:"Write a function is_prime(n) that returns True or False.", a:"def is_prime(n):\\n    if n < 2: return False\\n    for i in range(2, int(n**0.5)+1):\\n        if n % i == 0: return False\\n    return True"},
{q:"Why does def add_tag(tags=[]) accumulate across calls, and what's the fix?", a:"The default [] is created once and reused, so appends persist. Fix: tags=None, then if tags is None: tags = []."},
{q:"What does this return: def f(x): x = x + 1 — called as f(5)?", a:"None — it computes but never returns; add 'return x'."},
{q:"Call area(width, height) two ways passing 3 and 4 so that width=3.", a:"area(3, 4) positionally, or area(width=3, height=4) / area(height=4, width=3) by keyword."},
{q:"Decompose 'find the average line length in a file' into three function names.", a:"read_lines(path), line_lengths(lines), average(numbers) — compose as average(line_lengths(read_lines(path)))."},
{q:"Given x = 'G'; def outer(): x = 'E'; def inner(): print(x); return inner — what does outer()() print, and what changes if inner's body is x = 'L'; print(x)? And if inner's body is print(x); x = 'L'?", a:"'E' (Enclosing beats Global). With x = 'L' first it prints 'L' (Local). With print(x) before the assignment it raises UnboundLocalError: the later assignment makes x local to inner for the whole body."},
{q:"Design a signature for splice_report(job_id, *losses, limit=0.3, **meta) and show two calls: one with three losses and the default limit, one with a list of losses spread in and limit 0.25. What are losses and meta inside the second call if you also pass tech='TM'?", a:"splice_report('J-17', 0.05, 0.12, 0.41) and splice_report('J-17', *loss_list, limit=0.25, tech='TM'). Inside the second, losses is a tuple of the list's items and meta is {'tech': 'TM'}; limit can only be passed by keyword because it follows *losses."},
{q:"Write make_multiplier(k) that returns a function multiplying its argument by k, then explain why triple = make_multiplier(3); triple(7) still works after make_multiplier has returned.", a:"def make_multiplier(k):\\n    def mul(x):\\n        return x * k\\n    return mul\\ntriple(7) is 21. mul is a closure: CPython kept k alive in a cell object referenced by mul.__closure__, so the enclosing frame's variable survives the frame."},
{q:"A function normalize(rows) sorts rows in place with rows.sort() and returns nothing. The caller later prints the original data and finds it reordered. Explain using call-by-sharing and give two fixes.", a:"The parameter rows is a second name for the caller's list; .sort() mutates that one object. Fix: return sorted(rows) (a new list) and let the caller rebind, or copy first (rows = list(rows)) inside the function — and document the behavior."}
],
checks:[{q:"Parameter vs argument?",a:"Parameter is the name in the def; argument is the value passed in."},{q:"What does a function with no return give back?",a:"None."},{q:"Why avoid globals?",a:"Shared mutable state creates hard-to-trace bugs; sealed functions are easier to reason about."},{q:"What does LEGB stand for?",a:"Local, Enclosing, Global, Built-in — the order Python searches for a name."},{q:"What does *args collect?",a:"Extra positional arguments, as a tuple (**kwargs collects extra keywords as a dict)."}],
explain:"Teach ADA the 'if you can name what it does, it wants to be a function' rule using a script you'd otherwise write as one long block."},
{id:"p4m4", title:"Data Structures: Lists, Tuples, Dicts, Sets and Big-O", minutes:60,
outcomes:["Choose the right collection for a task from its access pattern and memory layout.","Use the key operations, comprehensions, generator expressions and the collections module.","State the Big-O cost of common operations, explain amortized O(1) append, and confirm it with a timeit measurement.","Explain why a dict lookup is O(1) and a list search is O(n): hashing, open addressing, load factor, hashability.","Avoid the aliasing traps: shallow copies, [[0]*3]*3, and tuples that contain lists."],
body:`<p>Choosing the right data structure is most of what separates slow, tangled code from fast, clean code. Python gives you four workhorses, each tuned for different access patterns, and the whole game is matching the structure to what you need to do. This module goes one level below the API — what each structure looks like in memory — because once you can picture the layout, every Big-O number in the tables below stops being a fact to memorize and becomes something you can derive.</p>
<h4>List: an ordered, mutable sequence</h4>
<p><code>nums = [3, 1, 4]</code>. Access by index <code>nums[0]</code> (O(1)); append <code>nums.append(5)</code> (O(1)); insert/remove in the middle (O(n), everything shifts); search <code>x in nums</code> (O(n), it checks each). Slicing <code>nums[1:3]</code> returns a sublist. Sort in place <code>nums.sort()</code> or make a sorted copy <code>sorted(nums)</code>. Lists are your default sequence, and Domain 1's cache lesson applies: the list's array of references is contiguous, so indexing and iterating are fast.</p>
<p>The precise layout: a CPython list is a <strong>dynamic array</strong> of 8-byte pointers, and the objects those pointers refer to live elsewhere on the heap. Indexing is one multiply-and-add (address = base + 8 × i), hence O(1). Because the elements themselves are scattered, a list of a million floats is far less cache-friendly than a C array — the reason NumPy (Domain 22) stores raw numbers contiguously and runs math 10–100× faster. Appending is cheap because the list over-allocates: measured on CPython 3.14, an empty list is 56 bytes; the first append reserves 4 slots (88 bytes), then capacity grows to 8 (120), 16 (184), 24 (248) and onward by roughly an eighth plus a constant. Most appends just fill a spare slot; the rare append that triggers a resize copies every pointer, but spread over all the appends the cost per append is constant — <strong>amortized O(1)</strong>. Inserting at the front is genuinely O(n): every pointer shifts one slot. On a 100,000-item list, <code>append</code> plus <code>pop()</code> measured 49 ns while <code>insert(0, x)</code> plus <code>pop(0)</code> measured 40,215 ns — 800 times slower for what looks like the same one-item operation.</p>
<h4>Tuple: an immutable sequence</h4>
<p><code>point = (3, 4)</code>. Like a list but unchangeable, which makes it usable as a dict key and signals "these belong together and won't change" (coordinates, a row of data). Unpacking is the everyday use: <code>x, y = point</code>, and <code>a, b = b, a</code> swaps in one line. A tuple is a fixed-size array with no spare capacity, so <code>(1, 2, 3)</code> is 72 bytes against 88 for <code>[1, 2, 3]</code>. Immutability is shallow: <code>t = (1, [2, 3])</code> lets you <code>t[1].append(4)</code>, and such a tuple is no longer hashable (<code>TypeError: unhashable type: 'list'</code>). A one-element tuple needs the comma: <code>(5,)</code>; <code>(5)</code> is just 5 in parentheses.</p>
<h4>Dict: key to value, the most important structure</h4>
<p><code>ages = {"sam": 30, "ana": 25}</code>. Look up by key <code>ages["sam"]</code> (O(1)!), add/update <code>ages["lee"] = 40</code>, check <code>"sam" in ages</code> (O(1)), iterate <code>for name, age in ages.items():</code>. Use <code>ages.get("x", default)</code> to avoid a KeyError. The dict is a <strong>hash table</strong> (Domain 1's memory addressing in software form): it hashes the key to jump near the value, which is why lookup does not depend on size. Any time you think "look something up by a name or id", you want a dict, not a list you search.</p>
<p>The mechanism, step by step. <code>hash("sam")</code> returns a 64-bit integer. The dict keeps a power-of-two table of slots and takes the low bits of the hash as the slot number: with 8 slots, index = hash &amp; 7. If that slot holds a different key, it probes another slot chosen from the remaining hash bits (<strong>open addressing</strong>) until it finds the key or an empty slot; with a good hash spread, that takes one or two probes on average no matter how many keys there are. Since 3.6 the layout is compact — a small index table pointing into a dense array of (hash, key, value) entries — which saves memory and is why iteration follows insertion order, a language guarantee since 3.7. When the table is two-thirds full it is rebuilt larger, another amortized O(1) cost. Two consequences. Keys must be <strong>hashable</strong>: their hash must never change, so ints, strs, tuples of hashables and frozensets qualify while lists, dicts and sets do not; Python 3.15 adds a built-in <code>frozendict</code> (PEP 814) for when a mapping itself must be a key. And the O(1) is an average: if an attacker can choose keys that all collide, every lookup degrades to O(n). That "hash flooding" denial-of-service is why CPython randomizes str and bytes hashes per process (<code>PYTHONHASHSEED</code>), a defense you will meet again in Domain 7.</p>
<h4>Set: unique, unordered membership</h4>
<p><code>seen = {1, 2, 3}</code>. No duplicates, O(1) membership test, and set algebra: union <code>a | b</code>, intersection <code>a &amp; b</code>, difference <code>a - b</code>. Use a set to deduplicate (<code>set(items)</code>) or to test membership fast (change <code>if x in big_list</code>, which is O(n), to <code>if x in big_set</code>, which is O(1)). A set is a dict's hash table with keys and no values, so everything above about hashing applies. Symmetric difference <code>a ^ b</code> keeps items in exactly one set, and <code>set()</code> — not <code>{}</code>, which is an empty dict — creates an empty set.</p>
<h4>Comprehensions</h4>
<p>The Pythonic way to build a collection from another: <code>[x*x for x in nums]</code> (list), <code>{x for x in nums}</code> (set), <code>{k: v for k, v in pairs}</code> (dict), with an optional filter <code>[x for x in nums if x &gt; 0]</code>. One readable line replaces a loop-and-append, and once it clicks you will reach for it constantly. Swap the brackets for parentheses and you get a <strong>generator expression</strong>, which produces items lazily through Module 2's iteration protocol: <code>sum(x*x for x in range(10**6))</code> never builds the list. Measured: the list comprehension's list object alone is 8,448,728 bytes (plus a million int objects), the generator object is 208 bytes. A function containing <code>yield</code> is a generator too; it pauses at each yield and resumes on the next <code>next()</code>, the natural way to stream a large file line by line.</p>
<h4>Copies and aliasing</h4>
<p>Module 1's names-versus-objects rule bites hardest inside containers. <code>list(a)</code>, <code>a[:]</code> and <code>a.copy()</code> make a <em>shallow</em> copy: a new outer list holding the same inner objects. <code>copy.deepcopy(a)</code> copies all the way down. The classic trap is <code>grid = [[0] * 3] * 3</code>: the outer <code>* 3</code> copies the reference to one inner list three times, so <code>grid[0][0] = 1</code> prints <code>[[1, 0, 0], [1, 0, 0], [1, 0, 0]]</code>. Build each row separately: <code>[[0] * 3 for _ in range(3)]</code>.</p>
<h4>The collections module</h4>
<p><code>Counter(words).most_common(2)</code> counts in one line (a dict subclass); <code>defaultdict(list)</code> creates a missing key's value on first access, so grouping is <code>d[key].append(item)</code> with no existence check; <code>deque</code> is a double-ended queue with O(1) appends and pops at both ends, the right tool for a FIFO queue or a sliding window where <code>list.pop(0)</code> would be O(n); <code>namedtuple</code> and Module 7's dataclasses give fields names. <code>heapq</code> keeps a list as a binary heap: push and pop-smallest in O(log n), the basis of priority queues in Domain 13.</p>
<h4>Big-O: the language of cost</h4>
<p>Big-O describes how work grows with input size n, ignoring constants. O(1) is constant (a dict lookup, a list index): same cost at any size. O(n) is linear (scanning a list, a single loop): double the data, double the time. O(n log n) is the cost of good sorting. O(n²) is nested loops over the same data (comparing every pair): 1,000 items becomes a million steps, 1,000,000 becomes a trillion, which is why an accidental nested loop is the most common cause of a program that "works on small input and hangs on real data". The practical rules: prefer a dict/set lookup (O(1)) over a list search (O(n)) inside a loop; avoid nesting loops over large collections; and know that n² is the cliff.</p>
<table><tr><th>Operation</th><th>list</th><th>dict / set</th><th>deque</th></tr>
<tr><td>index <code>x[i]</code> / lookup <code>d[k]</code></td><td>O(1)</td><td>O(1) average</td><td>O(n) in the middle</td></tr>
<tr><td>append / add at the end</td><td>O(1) amortized</td><td>O(1) amortized</td><td>O(1)</td></tr>
<tr><td>insert or pop at the front</td><td>O(n)</td><td>—</td><td>O(1)</td></tr>
<tr><td>membership <code>x in c</code></td><td>O(n)</td><td>O(1) average, O(n) worst</td><td>O(n)</td></tr>
<tr><td>delete by key / value</td><td>O(n)</td><td>O(1) average</td><td>O(n)</td></tr>
<tr><td>sort</td><td>O(n log n)</td><td>—</td><td>—</td></tr>
<tr><td>memory per item (64-bit)</td><td>8 B pointer + spare slots</td><td>4–5× a list's (37 KB vs 8 KB per 1,000)</td><td>8 B in 64-slot blocks</td></tr></table>
<h4>Measure, don't guess</h4>
<p>Big-O predicts the shape; <code>timeit</code> gives the constants. The example below times <code>probe in data</code> for a value at the very end of a list versus the same test on a set. Measured on CPython 3.14.6 (2.1 GHz Xeon): the list took 7.0 µs at n = 1,000, 71 µs at 10,000 and 713 µs at 100,000 — exactly linear, about 7 ns per element compared — while the set stayed at 0.04 µs at every size. Now the worked arithmetic for the million-by-million problem: a list miss scans 10^6 elements × 7 ns = 7 ms, and 10^6 queries × 7 ms = 7,000 s, almost two hours. The set does 10^6 lookups × 40 ns = 0.04 s. The operation count fell by a factor of a million (n² → n); the wall-clock gain is about 175,000×, because one hash lookup costs more than one comparison — the constant Big-O hides. At small n the constants can win: below a dozen items, a linear scan of a tuple is often as fast as hashing.</p>
<p><em>Certification mapping.</em> PCEP-30-02 Block 3, Data Collections — Tuples, Dictionaries, Lists and Strings (25%, 7 items): indexing, slicing, list methods, comprehensions and nested lists; tuples and their immutability versus lists; dictionaries with keys(), items() and values(); and string slicing and methods. PCAP-31-03 Section 5 returns to list comprehensions with conditions and nesting. The exam will not ask for Big-O, but Domain 13, Domain 18's indexes and every technical interview will; this module's tables are the foundation for all three.</p>`,
example:`<p><strong>The O(n) → O(1) fix.</strong> Find which of a million query names appear in a list of a million known names. Nested: <code>for q in queries: if q in known_list:</code> is O(n²) — a trillion checks, hours. Convert once: <code>known = set(known_list)</code> (O(n)), then <code>for q in queries: if q in known:</code> is O(n) overall — a million checks, a blink. Same logic, same result, one data-structure choice, roughly a million times fewer operations.</p>
<p><strong>Measure it yourself (CPython 3.14.6, 2.1 GHz Xeon).</strong> Save as <code>membership.py</code>; run it locally — timings in the browser lab are slower but show the same shape.</p>
<pre>import timeit

for n in (1_000, 10_000, 100_000):
    data = list(range(n))
    as_set = set(data)
    probe = n - 1                       # worst case for the list: the last item
    t_list = timeit.timeit(lambda: probe in data, number=1_000)
    t_set = timeit.timeit(lambda: probe in as_set, number=1_000)
    print(f"n={n:&gt;7,}  list {t_list/1000*1e6:9.2f} us   set {t_set/1000*1e6:6.3f} us"
          f"   ratio {t_list/t_set:8.0f}x")

d = list(range(100_000))
print("append  ", f"{timeit.timeit(lambda: d.append(1) or d.pop(), number=100_000)/100_000*1e9:6.0f} ns")
print("insert0 ", f"{timeit.timeit(lambda: d.insert(0, 1) or d.pop(0), number=10_000)/10_000*1e9:6.0f} ns")</pre>
<pre>n=  1,000  list      7.00 us   set  0.040 us   ratio      176x
n= 10,000  list     71.17 us   set  0.043 us   ratio     1656x
n=100,000  list    713.36 us   set  0.041 us   ratio    17454x
append       49 ns
insert0   40215 ns</pre>
<p>Your numbers will differ by machine; the shape will not. Each tenfold increase in n multiplies the list time by ten and leaves the set time flat — O(n) against O(1), measured rather than asserted.</p>`,
misconceptions:["\"A list and a dict are interchangeable.\" Searching a list is O(n); a dict/set lookup is O(1). For lookups by key, always dict.","\"Big-O tells you the exact time.\" It describes growth, not milliseconds; an O(n) solution can beat an O(1) one on tiny inputs, but scale decides.","\"Tuples are just read-only lists for no reason.\" Immutability lets them be dict keys and signals fixed structure.","\"A Python list stores the numbers themselves in one block, like a C array.\" It stores 8-byte pointers contiguously; the int or float objects live elsewhere on the heap, which is why NumPy arrays are faster for numeric work.","\"[[0] * 3] * 3 makes a 3×3 grid.\" It makes three references to one inner list; changing one row changes all three. Use a comprehension.","\"Dict lookup is always O(1).\" It is O(1) on average; adversarial collisions make it O(n), which is why CPython randomizes string hashes."],
problems:[
{q:"Which structure for 'count how many times each word appears'?", a:"A dict mapping word → count (or collections.Counter, which is a dict subclass)."},
{q:"Write a comprehension for the squares of even numbers 0–9.", a:"[x*x for x in range(10) if x % 2 == 0] → [0, 4, 16, 36, 64]"},
{q:"What is the Big-O of checking membership in a list vs a set of n items?", a:"List: O(n). Set: O(1) on average."},
{q:"Deduplicate [3,1,3,2,1] while you don't care about order.", a:"set([3,1,3,2,1]) → {1, 2, 3}"},
{q:"Why can a tuple be a dict key but a list cannot?", a:"Dict keys must be hashable/immutable; tuples are immutable, lists are not."},
{q:"A list scan costs about 7 ns per element on your machine. Estimate the run time of checking 200,000 work-order IDs against a list of 500,000 closed IDs (assume misses scan everything), then with a set at 40 ns per lookup.", a:"List: 200,000 × 500,000 = 1 × 10^11 comparisons × 7 ns = 7 × 10^11 ns = 700 s ≈ 12 minutes. Set: build O(n) once (~500,000 inserts, tens of ms) + 200,000 × 40 ns = 8 ms. Roughly 10^5 times faster."},
{q:"A queue of incoming OTDR traces is processed with jobs.pop(0) on a list that holds 50,000 items. Diagnose the cost and fix it.", a:"list.pop(0) shifts every remaining pointer, O(n) per pop, O(n²) to drain the queue (~1.25 × 10^9 pointer moves). Use collections.deque and popleft(), which is O(1), making the drain O(n)."},
{q:"Predict both outputs: grid = [[0]*3]*3; grid[1][2] = 7; print(grid). Then t = ([1], 2); t[0].append(9); print(t); hash(t).", a:"[[0, 0, 7], [0, 0, 7], [0, 0, 7]] — three references to one row. ([1, 9], 2) — the tuple can't be rebound but its list can be mutated; hash(t) raises TypeError: unhashable type: 'list'."},
{q:"Using the measured growth (capacity 4, 8, 16, 24, …), roughly how many resizes happen while appending 1,000 items, and why is append still O(1)?", a:"Capacity grows by about 1/8 plus a constant each time; measured on CPython 3.14, appending 1,000 items triggers 28 resizes (under 3% of appends). Each resize copies all current pointers, but the total copied stays proportional to n (a geometric series), so the cost averaged over all appends is constant: amortized O(1)."}
],
checks:[{q:"Dict lookup Big-O?",a:"O(1) average."},{q:"What does a set guarantee?",a:"Unique elements and O(1) membership."},{q:"What's the n² cliff?",a:"Nested loops over the same large data — grows catastrophically."},{q:"What does 'hashable' require?",a:"A hash that never changes during the object's life and equality consistent with it — in practice, immutable."},{q:"Which collection gives O(1) pops from the front?",a:"collections.deque (popleft)."}],
explain:"Explain to ADA why changing one line from a list to a set turned an hours-long program into an instant one, in Big-O terms."},
{id:"p4m5", title:"Strings, Bytes, Files and Errors: Real Input and Output", minutes:60,
outcomes:["Manipulate strings with the common methods and slicing.","Explain text versus bytes and encode/decode UTF-8 by hand, including why len('café') is 4 but its UTF-8 form is 5 bytes.","Read and write files safely with the with statement, an explicit encoding and pathlib.","Handle errors with try/except/else/finally, raise and chain your own, and design a small exception hierarchy.","Read a traceback, including the 3.11+ caret markers, and find the real cause."],
body:`<p>Programs earn their keep by reading real input and producing real output, and real data is messy, so this module is strings, files, and the errors they cause. It answers the question behind half of all production bugs: <em>what bytes are actually in this file, and what happens when they are not what my code expects?</em></p>
<h4>Strings</h4>
<p>A string is an immutable sequence of characters, so you index (<code>s[0]</code>) and slice (<code>s[1:4]</code>, <code>s[::-1]</code> reverses) just like a list, but methods return a new string. The ones you will use daily: <code>s.lower()</code>/<code>s.upper()</code>, <code>s.strip()</code> (remove surrounding whitespace), <code>s.split(",")</code> (to a list), <code>",".join(parts)</code> (from a list), <code>s.replace(a, b)</code>, <code>s.startswith(x)</code>/<code>s.endswith(x)</code>, <code>x in s</code>, <code>s.find(x)</code>, and f-strings for building them. Half of all data work is <code>text.strip().lower().split(",")</code> and friends. Immutability has a cost model: <code>s += piece</code> in a loop may copy the whole string each time, O(n²) for n pieces, so collect pieces in a list and <code>"".join(parts)</code> once at the end. Strings compare character by character by code point, which is why <code>"Zebra" &lt; "apple"</code> is True (Z is 90, a is 97) — sort case-insensitively with <code>key=str.lower</code>.</p>
<h4>Text versus bytes: Unicode and UTF-8</h4>
<p>A <code>str</code> is a sequence of Unicode <strong>code points</strong> — abstract numbers such as U+0041 for A and U+00E9 for é; <code>ord("é")</code> is 233 and <code>chr(233)</code> is "é". A <code>bytes</code> object is a sequence of integers 0–255, which is all a disk, a socket or a fiber link ever carries. An <strong>encoding</strong> maps one to the other: <code>s.encode("utf-8")</code> produces bytes and <code>b.decode("utf-8")</code> turns them back. <strong>UTF-8</strong> is the encoding of the web and of Linux, and its rule is a variable length of one to four bytes:</p>
<table><tr><th>Code point range</th><th>Bytes</th><th>Bit pattern</th><th>Measured example</th></tr>
<tr><td>U+0000–U+007F</td><td>1</td><td><code>0xxxxxxx</code></td><td>A → 41</td></tr>
<tr><td>U+0080–U+07FF</td><td>2</td><td><code>110xxxxx 10xxxxxx</code></td><td>é → c3 a9</td></tr>
<tr><td>U+0800–U+FFFF</td><td>3</td><td><code>1110xxxx 10xxxxxx 10xxxxxx</code></td><td>€ → e2 82 ac</td></tr>
<tr><td>U+10000–U+10FFFF</td><td>4</td><td><code>11110xxx</code> + three <code>10xxxxxx</code></td><td>🐍 → f0 9f 90 8d</td></tr></table>
<p>Work é by hand: 233 is binary 000 1110 1001, eleven bits; split it 00011 | 101001 into the two-byte pattern and you get 110<em>00011</em> 10<em>101001</em> = 0xC3 0xA9. So <code>len("café")</code> is 4 (code points) but <code>len("café".encode("utf-8"))</code> is 5 (bytes): <code>63 61 66 c3 a9</code>. ASCII text is valid UTF-8 unchanged, which is why the design won. Decoding with the wrong codec is the source of mojibake: bytes written as Latin-1 (<code>caf\\xe9</code>) fed to <code>.decode("utf-8")</code> raise <code>UnicodeDecodeError: 'utf-8' codec can't decode byte 0xe9 in position 3: unexpected end of data</code>, because 0xE9 announces a three-byte sequence that never arrives; <code>errors="replace"</code> substitutes the &#xFFFD; replacement character instead of crashing. Inside CPython, a str uses 1, 2 or 4 bytes per code point depending on its widest character (PEP 393), so a single emoji can quadruple a long string's memory. A <code>bytearray</code> is the mutable cousin of bytes: <code>ba = bytearray(b"fiber"); ba[0] = ord("F")</code> gives <code>bytearray(b'Fiber')</code>. Domain 2's packets, Domain 25's ciphers and Domain 11's hex dumps are all bytes; you decode to text only at the edge where a human reads it.</p>
<h4>Files with with</h4>
<p>Open a file inside a <code>with</code> block so it closes automatically, even on error:</p>
<pre><code>with open("data.txt") as f:
    for line in f:
        print(line.strip())

with open("out.txt", "w") as f:
    f.write("hello\\n")</code></pre>
<p>Modes: "r" read (default), "w" write (truncates!), "a" append, and add "b" for binary. Iterating the file object yields lines without loading the whole file into memory, which matters for large files (Domain 1's memory hierarchy again). For structured data, the standard library gives you <code>csv</code> and <code>json</code> modules: <code>json.load(f)</code> turns a JSON file into Python dicts and lists, and <code>json.dump(obj, f)</code> writes it back, which is how programs exchange data (Domain 2's HTTP bodies are often JSON).</p>
<p>Three details separate working code from code that breaks on someone else's machine. First, the encoding: text mode decodes bytes for you, and through Python 3.14 the default codec came from the operating system's locale — often cp1252 on Windows — so a UTF-8 file written on Linux turned into mojibake there. Python 3.15 (October 2026) makes UTF-8 the default everywhere (PEP 686; <code>PYTHONUTF8=0</code> opts out), but code that must also run on older versions should still say <code>open(path, encoding="utf-8")</code>. Second, newlines: text mode translates Windows <code>\\r\\n</code> to <code>\\n</code> on reading; the csv module wants <code>newline=""</code> so it can handle quoting itself; binary mode (<code>"rb"</code>) does no translation and no decoding at all. Third, buffering: <code>write()</code> fills a buffer in your process, and the bytes reach the operating system on <code>flush()</code> or close — which <code>with</code> guarantees (Domain 15 follows them on to the disk). <code>with</code> works on any <strong>context manager</strong>, an object with <code>__enter__</code> and <code>__exit__</code> methods; it is shorthand for try/finally with the cleanup in the finally. <code>pathlib</code> wraps the common cases: <code>Path("jobs") / "j17.txt"</code> builds a path portably, and <code>p.read_text(encoding="utf-8")</code> or <code>p.write_text(...)</code> open, read or write and close in one call.</p>
<h4>Errors and exceptions</h4>
<p>When something goes wrong, Python raises an exception and stops, printing a traceback. Common ones, worth recognizing instantly: <code>ValueError</code> (right type, bad value: <code>int("x")</code>), <code>TypeError</code> (wrong type: <code>1 + "a"</code>), <code>KeyError</code> (missing dict key), <code>IndexError</code> (list index out of range), <code>FileNotFoundError</code>, <code>ZeroDivisionError</code>, <code>AttributeError</code> (no such method), <code>NameError</code> (undefined name). You handle the ones you expect:</p>
<pre><code>try:
    age = int(user_input)
except ValueError:
    print("Please enter a number")</code></pre>
<p>Catch specific exceptions, not a bare <code>except:</code> that swallows everything (including your typos). Raise your own with <code>raise ValueError("score must be 0-100")</code> when an input violates your function's contract. The rule of thumb: handle what you can recover from, and let the rest crash loudly so you find it.</p>
<p>The mechanism: <code>raise</code> creates an exception object and the interpreter unwinds the call stack frame by frame (Module 3), checking each enclosing <code>try</code>'s except clauses top to bottom against the object's class. The first clause whose class matches — including any parent class — handles it; if no frame matches, the program ends and prints the traceback. Because matching follows inheritance, the hierarchy matters:</p>
<table><tr><th>Class</th><th>Parent</th><th>Notes</th></tr>
<tr><td><code>BaseException</code></td><td>—</td><td>root; also parent of SystemExit and KeyboardInterrupt</td></tr>
<tr><td><code>Exception</code></td><td>BaseException</td><td>everything you should catch derives from this</td></tr>
<tr><td><code>ArithmeticError</code></td><td>Exception</td><td>ZeroDivisionError, OverflowError</td></tr>
<tr><td><code>LookupError</code></td><td>Exception</td><td>IndexError, KeyError</td></tr>
<tr><td><code>OSError</code></td><td>Exception</td><td>FileNotFoundError, PermissionError, TimeoutError</td></tr>
<tr><td><code>ValueError</code></td><td>Exception</td><td>UnicodeDecodeError is a ValueError</td></tr></table>
<p>So put specific clauses before general ones (an <code>except LookupError</code> placed first would swallow every KeyError), and remember that <code>except Exception</code> deliberately does not catch Ctrl+C. The full statement is <code>try / except / else / finally</code>: <code>else</code> runs only if the try block raised nothing — the place for code that should not be protected by the except — and <code>finally</code> runs no matter what, even after a <code>return</code>. Define your own exceptions as small classes, <code>class ConfigError(Exception): pass</code>, so callers can catch your failures without catching everyone else's. When you translate a low-level error into your own, chain it: <code>raise ConfigError("bad port") from e</code> stores the original as <code>__cause__</code> and the traceback prints both, joined by "The above exception was the direct cause of the following exception". Python's style is <strong>EAFP</strong> — easier to ask forgiveness than permission: try the operation and catch the failure, rather than checking every precondition first, which also avoids the race where a file disappears between your check and your open. Never validate input with <code>assert</code>: <code>python -O</code> strips asserts entirely. Since 3.11, <code>ExceptionGroup</code> and <code>except*</code> handle several simultaneous failures, mostly from concurrent code.</p>
<h4>Reading a traceback</h4>
<p>A traceback reads bottom-up for the what and top-down for the where. The <em>last</em> line names the exception type and message, the real clue. Above it, the stack shows the call chain, most recent at the bottom: find the deepest line that is <em>your</em> code (not a library's) and look there first. Beginners panic at the wall of text; professionals read the last line, then the deepest own-code frame, and usually know the cause in seconds. Since 3.11, each frame also underlines the failing sub-expression with <code>~</code> and <code>^</code> markers, so in <code>return sum(values) / len(values)</code> the carets sit under the <code>/</code> — the division, not the sum, failed. Since 3.13 tracebacks are colorized in a terminal. The same reading discipline applies to the stack traces in Domain 6's Java and to the crash logs you will triage in Domain 21.</p>
<p><em>Certification mapping.</em> PCAP-31-03 Section 3, Strings (18%, 8 items), is this module's first half: ASCII, Unicode and UTF-8, code points and escape sequences, <code>ord()</code> and <code>chr()</code>, indexing, slicing, immutability, comparisons and string methods. Section 2, Exceptions (14%, 5 items), is the second: try/except/else/finally, raise, assert, the built-in hierarchy and defining your own exceptions. Section 5 adds file I/O — <code>open()</code> modes, <code>read()</code>, <code>readline()</code>, <code>readlines()</code>, <code>write()</code> and <code>bytearray</code>. At PCEP level, Block 4 tests the built-in exception hierarchy and propagation through function calls.</p>`,
example:`<p><strong>A real traceback.</strong> You see, at the bottom, <code>KeyError: 'email'</code>, and above it a line in your code <code>user["email"]</code>. The diagnosis is immediate: the dict has no "email" key. The fix depends on intent: <code>user.get("email", "")</code> for a safe default, or validate the data earlier if the key should always exist. The traceback told you the exception type (KeyError), the value ('email'), and the exact line — three facts that point straight at the bug.</p>
<p><strong>Bytes, encodings and a file, as one program (CPython 3.14.6).</strong> Run locally, since it writes a file:</p>
<pre>from pathlib import Path

word = "café"
data = word.encode("utf-8")
print(len(word), len(data), data, data.hex(" "))
for ch in "Aé€🐍":
    print(ch, f"U+{ord(ch):04X}", len(ch.encode("utf-8")), ch.encode("utf-8").hex(" "))

latin = "café".encode("latin-1")
print(latin)
try:
    latin.decode("utf-8")
except UnicodeDecodeError as e:
    print("UnicodeDecodeError:", e)
print(latin.decode("utf-8", errors="replace"))

p = Path("demo.txt")
p.write_text("line one\\nnaïve line two\\n", encoding="utf-8")
print(p.stat().st_size, "bytes on disk")
with p.open(encoding="utf-8") as f:
    for n, line in enumerate(f, start=1):
        print(n, repr(line))
p.unlink()</pre>
<pre>4 5 b'caf\\xc3\\xa9' 63 61 66 c3 a9
A U+0041 1 41
é U+00E9 2 c3 a9
€ U+20AC 3 e2 82 ac
🐍 U+1F40D 4 f0 9f 90 8d
b'caf\\xe9'
UnicodeDecodeError: 'utf-8' codec can't decode byte 0xe9 in position 3: unexpected end of data
caf&#xFFFD;
25 bytes on disk
1 'line one\\n'
2 'naïve line two\\n'</pre>
<p>The file holds 24 characters but 25 bytes, because ï takes two. <strong>Exceptions with else, finally and chaining:</strong></p>
<pre>import json

class ConfigError(Exception):
    """Raised when a settings file is unusable."""

def load_port(text):
    try:
        cfg = json.loads(text)
        port = int(cfg["port"])
    except (KeyError, ValueError) as e:
        raise ConfigError(f"bad config: {e!r}") from e
    else:
        if not 1 &lt;= port &lt;= 65535:
            raise ConfigError(f"port {port} out of range")
        return port
    finally:
        print("  checked:", text)

for text in ['{"port": "8080"}', '{"host": "x"}', '{"port": "http"}', '{"port": 70000}']:
    try:
        print("port =", load_port(text))
    except ConfigError as e:
        print("  ConfigError:", e, "| cause:", type(e.__cause__).__name__)</pre>
<pre>  checked: {"port": "8080"}
port = 8080
  checked: {"host": "x"}
  ConfigError: bad config: KeyError('port') | cause: KeyError
  checked: {"port": "http"}
  ConfigError: bad config: ValueError("invalid literal for int() with base 10: 'http'") | cause: ValueError
  checked: {"port": 70000}
  ConfigError: port 70000 out of range | cause: NoneType</pre>
<p>Note the order: finally printed "checked" before the caller printed the port, because finally runs on the way out of the function; and only the translated errors carry a <code>__cause__</code>.</p>`,
misconceptions:["\"open() without with is fine.\" It works but leaks the file handle if an error occurs before close; with guarantees cleanup.","\"except: catches errors safely.\" A bare except hides bugs (typos become silent); catch the specific exception you expect.","\"A traceback means my whole program is broken.\" It names one exception at one line; read the last line first.","\"A character is a byte.\" Only ASCII characters are one byte in UTF-8; é is two, € three and most emoji four, so len(s) counts code points while len(s.encode()) counts bytes.","\"open() always reads UTF-8.\" Before Python 3.15 the default came from the OS locale (often cp1252 on Windows); pass encoding='utf-8' explicitly for portable code.","\"assert is a fine way to validate user input.\" python -O removes every assert; raise ValueError (or a custom exception) instead."],
problems:[
{q:"Turn the line ' Sam , 95 \\n' into a clean list ['Sam', '95'].", a:"[p.strip() for p in line.split(',')] (after an outer line.strip()) → or line.strip().split(',') then strip each part."},
{q:"Write code that reads numbers.txt (one integer per line) and sums them, skipping blank lines.", a:"total = 0\\nwith open('numbers.txt') as f:\\n    for line in f:\\n        line = line.strip()\\n        if line:\\n            total += int(line)"},
{q:"Which exception does each raise: int('x'), [1,2][5], {}['k'], 1/0?", a:"ValueError, IndexError, KeyError, ZeroDivisionError."},
{q:"Why prefer d.get('k', 0) over d['k'] when a key may be missing?", a:"get returns a default instead of raising KeyError, avoiding a crash on absent keys."},
{q:"In a traceback, which line names the actual error?", a:"The last line (exception type and message); then find the deepest line in your own code."},
{q:"Encode 'ñ' (U+00F1, decimal 241) to UTF-8 by hand, showing the bits, and state len('año') and len('año'.encode()).", a:"241 = 000 1111 0001 (11 bits) → split 00011 | 110001 → 110 00011 10 110001 = 0xC3 0xB1. len('año') = 3 code points; UTF-8 is 1 + 2 + 1 = 4 bytes."},
{q:"A CSV exported from an old Windows tool crashes your script with UnicodeDecodeError: 'utf-8' codec can't decode byte 0x92 in position 1180: invalid start byte. Diagnose and give the fix.", a:"0x92 is the cp1252 right single quote (’); the file is cp1252, not UTF-8, and a lone 0x92 is not a valid UTF-8 start byte. Open it with encoding='cp1252' (or detect/convert once to UTF-8). errors='replace' would hide the data loss, so use it only for logs."},
{q:"Order these except clauses so each can actually fire, and say what happens with the original order: except LookupError, except KeyError, except Exception.", a:"KeyError first, then LookupError, then Exception. In the original order the LookupError clause catches every KeyError (KeyError is a subclass), so the KeyError clause is dead code."},
{q:"What does this print? def f(): try: return 'try' finally: print('finally')  — then print(f()).", a:"'finally' then 'try'. The return value is computed, finally runs on the way out (printing first), and then the caller prints the returned 'try'."}
],
checks:[{q:"What does 'w' mode do to an existing file?",a:"Truncates it (erases contents) before writing."},{q:"Why use with open(...)?",a:"It closes the file automatically, even on error."},{q:"Read a traceback from which end for the error type?",a:"The bottom (last line)."},{q:"How many bytes is € in UTF-8?",a:"Three (e2 82 ac)."},{q:"When does a try statement's else block run?",a:"Only when the try block raised no exception."}],
explain:"Give ADA a made-up traceback ending in TypeError and talk through how you'd locate the bug, step by step."},
{id:"p4m6", title:"Thinking in Algorithms: Search, Sort and Recursion", minutes:60,
outcomes:["Implement and compare linear and binary search, state binary search's loop invariant and count its comparisons.","Explain how selection sort and merge sort work, why sorting is O(n log n) at best, and why stability matters.","Explain recursion with a base case and a recursive case, and draw the call stack it builds.","Use memoization to turn an exponential recursion into a linear one, and measure the difference.","Reason about an algorithm's Big-O and pick the right approach before writing code."],
body:`<p>An algorithm is a precise recipe for solving a class of problems. This module builds the handful every programmer must own, and, more importantly, the habit of asking "how does the cost grow?" from Module 4. Each algorithm here is small enough to write from memory and important enough that Domain 13 will prove it correct; your job now is to run it, count its steps and feel the difference between the cost classes in your own measurements.</p>
<h4>Linear search</h4>
<p>To find a value, look at each element until you find it: O(n). It works on any list, sorted or not, and it is what <code>x in list</code> does. Simple and often good enough. On average a successful search inspects about n/2 elements and a failed one inspects all n, which is the 7 ns per element you measured in Module 4.</p>
<h4>Binary search</h4>
<p>If the list is <em>sorted</em>, you can do far better. Look at the middle: if it is your target, done; if the target is smaller, discard the upper half; if larger, discard the lower half; repeat on what remains. Each step halves the search space, so it is O(log n): a million items take about 20 steps, a billion about 30. This is why sorted data is powerful and why databases keep indexes sorted. The catch: the list must be sorted first, and keeping it sorted has its own cost, a trade-off you will weigh constantly.</p>
<pre><code>def binary_search(items, target):
    lo, hi = 0, len(items) - 1
    while lo &lt;= hi:
        mid = (lo + hi) // 2
        if items[mid] == target:
            return mid
        elif items[mid] &lt; target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1   # not found</code></pre>
<p>Why it is correct: the <strong>loop invariant</strong> is "if the target is anywhere in the list, it is in <code>items[lo..hi]</code>". It holds at the start (the whole list), each branch preserves it (we discard only a half that cannot contain the target), and the range shrinks every pass, so the loop ends — either at the target or with <code>lo &gt; hi</code>, an empty range, meaning absent. The exact worst case is ⌊log₂ n⌋ + 1 comparisons: for n = 1,000,000 that is 19 + 1 = 20, and the example below measures exactly 20 for a value at the end and 20 for a value that is not there. The classic off-by-one bugs all break the invariant: <code>while lo &lt; hi</code> skips the last one-element range, and <code>lo = mid</code> instead of <code>mid + 1</code> can loop forever on two elements. In Java or C, <code>(lo + hi) / 2</code> overflows once the indexes pass about 2^30 — a bug that sat in the JDK's own binarySearch until 2006 (Domain 6, Domain 15); Python's ints cannot overflow, so the line is safe here. In real code use the <code>bisect</code> module: <code>bisect.bisect_left(data, x)</code> returns the leftmost insertion point in O(log n), and <code>bisect.insort</code> inserts while keeping the list sorted (the search is O(log n), the insert still O(n)).</p>
<h4>Sorting</h4>
<p>You will use Python's built-in <code>sorted()</code> (a highly optimized O(n log n) algorithm called Timsort) in real code, never a hand-written sort. But understanding one simple sort builds intuition. Selection sort: repeatedly find the smallest remaining element and move it to the front. It is O(n²), which is why real sorts are cleverer. The lesson is the cost classes: the naive approaches are O(n²), the good ones O(n log n), and that gap is the difference between a second and a day on large data. <code>sorted(items, key=..., reverse=...)</code> sorts by any criterion, e.g. <code>sorted(people, key=lambda p: p["age"])</code>.</p>
<pre>def selection_sort(a):                      # O(n²): n passes, each scans the rest
    a = list(a)
    for i in range(len(a)):
        m = min(range(i, len(a)), key=a.__getitem__)
        a[i], a[m] = a[m], a[i]
    return a

def merge_sort(a):                          # O(n log n): log2 n levels × n work
    if len(a) &lt;= 1:
        return a
    mid = len(a) // 2
    left, right = merge_sort(a[:mid]), merge_sort(a[mid:])
    out, i, j = [], 0, 0
    while i &lt; len(left) and j &lt; len(right):
        if left[i] &lt;= right[j]:            # &lt;= keeps equal items in order: stable
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    return out + left[i:] + right[j:]</pre>
<p>The arithmetic of merge sort: halving n until pieces have one element takes log₂ n levels, and merging all the pieces at one level touches every element once, so the total is n × log₂ n. For a million items that is 10^6 × 20 = 2 × 10^7 element moves, against selection sort's n²/2 = 5 × 10^11 comparisons — 25,000 times more work. No comparison sort can beat n log n in the worst case: there are n! possible orders and each comparison at best halves the candidates, so you need at least log₂(n!) ≈ n log₂ n − 1.44n comparisons. Timsort earns its keep on real data by finding runs that are already in order and merging them, so nearly sorted input sorts in close to O(n); since 3.11 CPython merges those runs using the powersort policy. It is also a <strong>stable sort</strong>: items with equal keys keep their original order. Stability is what makes multi-key sorting work — sort by name, then stably by age, and people of the same age stay alphabetical — and a tuple key does both at once: <code>key=lambda p: (-p[1], p[0])</code> sorts by age descending, then name ascending.</p>
<h4>Recursion</h4>
<p>A recursive function solves a problem by calling itself on a smaller version, until it reaches a case small enough to answer directly. Two parts are mandatory: a <em>base case</em> that stops the recursion, and a <em>recursive case</em> that moves toward it. Factorial: <code>def fact(n): return 1 if n == 0 else n * fact(n - 1)</code>. The base case (n==0 returns 1) prevents infinite recursion; each call shrinks n. Recursion shines on self-similar structures, trees and nested data (a folder containing folders, Domain 3's filesystem), where a loop is awkward. Each call uses a stack frame (Domain 1), so very deep recursion can overflow; Python caps it around 1,000, a safety net against a missing base case.</p>
<p>Watch the <strong>call stack</strong> for <code>fact(3)</code>: the frame for fact(3) pauses at <code>3 * fact(2)</code>; a new frame for fact(2) pauses at <code>2 * fact(1)</code>; fact(1) pauses at <code>1 * fact(0)</code>; fact(0) returns 1. Now the stack unwinds: fact(1) returns 1 × 1 = 1, fact(2) returns 2 × 1 = 2, fact(3) returns 3 × 2 = 6. Four frames were alive at the deepest point. The exact limit is <code>sys.getrecursionlimit()</code>, 1,000 by default, and exceeding it raises <code>RecursionError: maximum recursion depth exceeded</code>. CPython does not eliminate tail calls, so even a "tail-recursive" function uses one frame per level; for linear problems such as summing a list, a loop is the right tool. Watch hidden costs too: <code>sum_list(nums[1:])</code> copies the rest of the list at every level, which makes an O(n) idea O(n²); passing an index (<code>sum_from(nums, i + 1)</code>) avoids the copies.</p>
<h4>Memoization: when recursion repeats itself</h4>
<p>The naive Fibonacci <code>fib(n) = fib(n - 1) + fib(n - 2)</code> is correct and catastrophically slow, because it recomputes the same values over and over. The number of calls is 2·fib(n + 1) − 1: for n = 30 that is 2 × 1,346,269 − 1 = 2,692,537 calls, and the example below counts exactly that. Each +1 in n multiplies the work by about φ ≈ 1.618, so fib(35) took 29,860,703 calls — φ⁵ ≈ 11.1 times more — and 1.71 s instead of 0.13 s on CPython 3.14. <strong>Memoization</strong> stores each result the first time it is computed: decorate the function with <code>@functools.cache</code> and fib(30) makes 31 real computations and 28 cache hits, finishing in 33 µs — exponential to linear with one line. This is the seed of dynamic programming, which Domain 13 develops fully, and the same idea as Domain 1's CPU cache and Domain 5's HTTP cache: never compute twice what you can remember.</p>
<h4>How to think about a new problem</h4>
<p>Four moves: understand the problem with a concrete example by hand; find the smallest piece you can solve; decide what data structure fits (Module 4); and estimate the cost before you code (will this nested loop be O(n²) on real data?). Write the simplest thing that works, confirm it with a test (Modules 7 and 8), then make it faster only if measurement says you must. "Make it work, make it right, make it fast", in that order, is the whole craft.</p>
<table><tr><th>Approach</th><th>Cost</th><th>n = 1,000,000 (worked)</th><th>Use when</th></tr>
<tr><td>binary search</td><td>O(log n)</td><td>20 comparisons</td><td>sorted data, many lookups</td></tr>
<tr><td>linear search, one pass</td><td>O(n)</td><td>10^6 steps ≈ 7 ms</td><td>unsorted data, one lookup</td></tr>
<tr><td>sort (Timsort, merge sort)</td><td>O(n log n)</td><td>≈ 2 × 10^7 steps</td><td>before repeated searching, grouping</td></tr>
<tr><td>all pairs, selection sort</td><td>O(n²)</td><td>5 × 10^11 steps ≈ hours</td><td>only for tiny n</td></tr>
<tr><td>naive recursive Fibonacci</td><td>O(φⁿ)</td><td>never finishes</td><td>never; memoize it</td></tr></table>
<p><em>Certification mapping.</em> PCEP-30-02 Block 4 lists recursion explicitly: expect a short recursive function and a question about what it returns or how many times it calls itself — trace the stack on paper the way the fact(3) walk-through does. PCAP-31-03 Section 5 tests lambdas, which you will mostly meet as sort keys like the ones above. Neither exam asks you to prove an algorithm, but Domain 13 (data structures and algorithms) and every coding interview start exactly where this module ends.</p>`,
example:`<p><strong>Why sorted + binary beats a scan at scale.</strong> Look up 1,000 values in a list of 1,000,000. Linear search: up to a billion comparisons. Sort once (about 20 million operations) then 1,000 binary searches (about 20,000 operations): roughly 20 million total, fifty times less, and the sorted list keeps paying off on every future lookup. When you query the same data many times, the cost of sorting is an investment, which is exactly why databases build indexes.</p>
<p><strong>Count it, don't trust it (CPython 3.14.6).</strong></p>
<pre>import sys, time, bisect, math
from functools import cache

calls = 0
def fib(n):
    global calls
    calls += 1
    return n if n &lt; 2 else fib(n - 1) + fib(n - 2)

t = time.perf_counter()
print(fib(30), "naive calls:", f"{calls:,}", f"{time.perf_counter() - t:.2f} s")

@cache
def fib_m(n):
    return n if n &lt; 2 else fib_m(n - 1) + fib_m(n - 2)
print(fib_m(30), fib_m.cache_info())

def binary_search(items, target):
    lo, hi, steps = 0, len(items) - 1, 0
    while lo &lt;= hi:
        steps += 1
        mid = (lo + hi) // 2
        if items[mid] == target:
            return mid, steps
        elif items[mid] &lt; target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1, steps

data = list(range(0, 2_000_000, 2))          # 1,000,000 sorted even numbers
print(binary_search(data, 1_999_998), binary_search(data, 7), math.floor(math.log2(len(data))) + 1)
print(bisect.bisect_left(data, 1001), data[500])

people = [("ana", 30), ("sam", 25), ("lee", 30), ("kim", 25)]
print(sorted(people, key=lambda p: p[1]))    # stable: ties keep input order
print(sorted(people, key=lambda p: (-p[1], p[0])))
print("limit:", sys.getrecursionlimit())</pre>
<pre>832040 naive calls: 2,692,537 0.13 s
832040 CacheInfo(hits=28, misses=31, maxsize=None, currsize=31)
(999999, 20) (-1, 20) 20
501 1000
[('sam', 25), ('kim', 25), ('ana', 30), ('lee', 30)]
[('ana', 30), ('lee', 30), ('kim', 25), ('sam', 25)]
limit: 1000</pre>
<p>The 0.13 s will vary with your machine and its load; every count will not. Every number matches the theory: 2·fib(31) − 1 naive calls, n + 1 memoized misses, ⌊log₂ 10^6⌋ + 1 = 20 probes whether the value is found or absent, the leftmost insertion point for 1001 at index 501, and a stable sort that keeps sam before kim and ana before lee.</p>`,
misconceptions:["\"Binary search is always faster.\" Only on sorted data; sorting first costs O(n log n), so for a single lookup on unsorted data, a linear scan wins.","\"I should write my own sort.\" Use sorted()/.sort(); hand-rolled sorts are for learning, not production.","\"Recursion is just a fancy loop.\" It can replace loops, but its real power is self-similar/tree-shaped problems, and it needs a base case or it overflows the stack.","\"A clever algorithm could sort by comparisons faster than n log n.\" log₂(n!) ≈ n log₂ n comparisons is a proven lower bound; only non-comparison sorts on special keys (counting, radix) beat it.","\"Python optimizes tail recursion, so deep recursion is fine if the call is last.\" CPython never eliminates tail calls; every level costs a frame and the default limit is 1,000.","\"Memoization is an advanced optimization.\" It is one decorator (@functools.cache) and turns naive Fibonacci from millions of calls into n + 1."],
problems:[
{q:"How many steps does binary search take on 1,000,000 sorted items, roughly?", a:"About 20 (log₂ of a million ≈ 20)."},
{q:"Write a recursive function sum_list(nums) with a base case.", a:"def sum_list(nums):\\n    if not nums: return 0\\n    return nums[0] + sum_list(nums[1:])"},
{q:"Sort a list of dicts people by the 'score' key, highest first.", a:"sorted(people, key=lambda p: p['score'], reverse=True)"},
{q:"What's missing and what happens: def countdown(n): print(n); countdown(n-1)?", a:"No base case → infinite recursion → RecursionError (stack overflow). Add 'if n <= 0: return' first."},
{q:"You need to look up values once in unsorted data. Binary search or linear — and why?", a:"Linear: sorting first costs more than a single O(n) scan. Sort only if you'll query many times."},
{q:"What is the worst-case number of comparisons for binary search on 5,000 items, on 70,000 items and on 2^32 items?", a:"⌊log₂ n⌋ + 1: 5,000 → 12 + 1 = 13; 70,000 → 16 + 1 = 17; 2^32 → 32 + 1 = 33."},
{q:"A colleague's binary search uses while lo < hi and hi = mid - 1 / lo = mid + 1. It returns -1 for a target that is present. Find the input class that fails and fix it.", a:"When lo == hi the loop exits without checking that last element, so any target that ends in a one-element range is missed (e.g. searching [5] for 5). Use while lo <= hi, which keeps the invariant 'target, if present, is in items[lo..hi]' and checks every candidate."},
{q:"Your sum_list(nums[1:]) works on 900 items but raises RecursionError on 5,000 and is slow on 900. Explain both problems with numbers and fix them.", a:"Depth: one frame per item, and 5,000 > the default limit of 1,000. Speed: each nums[1:] copies the rest, so total copying is n + (n-1) + … ≈ n²/2 = 405,000 element copies for 900 items — O(n²). Fix: a loop (total = 0; for x in nums: total += x) or simply sum(nums): O(n), no frames."},
{q:"Naive fib(30) made 2,692,537 calls in 0.13 s. Estimate the calls and time for fib(40), then for the @cache version.", a:"Calls grow by φ ≈ 1.618 per step: φ^10 ≈ 123, so ≈ 331 million calls (exact: 2·fib(41) − 1 = 331,160,281) and ≈ 0.13 × 123 ≈ 16 s. Memoized: 41 misses — microseconds."}
],
checks:[{q:"Big-O of binary search?",a:"O(log n)."},{q:"Two mandatory parts of recursion?",a:"A base case and a recursive case that shrinks the problem."},{q:"What sort does Python's sorted() use and its cost?",a:"Timsort, O(n log n)."},{q:"What does 'stable sort' mean?",a:"Items with equal keys keep their original relative order."},{q:"Default recursion limit in CPython?",a:"1,000 (sys.getrecursionlimit())."}],
explain:"Explain binary search to ADA using the 'guess my number 1–100' game, and connect why it's O(log n)."},
{id:"p4m7", title:"Objects, Modules and the Real Workflow: OOP, Packages, Debugging and Tests", minutes:60,
outcomes:["Define a class with attributes and methods, explain attribute lookup (instance, class, MRO) and when OOP helps.","Use inheritance, super(), dunder methods, properties and dataclasses, and avoid the shared class-attribute trap.","Explain how import works (sys.modules, sys.path, __name__, packages) and install packages into a virtual environment.","Debug methodically with prints, assertions and a debugger.","Write tests that pin behavior and catch regressions, and read unfamiliar code top-down."],
body:`<p>This module turns a beginner who can write functions into someone who can build and maintain real software: organizing code with objects and modules, and the professional habits of debugging and testing. Module 8 then turns those habits into a daily toolchain. The question underneath it all: <em>when you write <code>a.deposit(50)</code> or <code>import json</code>, what exactly does Python go and find?</em></p>
<h4>Objects and classes</h4>
<p>An object bundles data (attributes) with the functions that act on it (methods). You have used objects all along: a string is an object, and <code>s.upper()</code> is a method. A class is a blueprint for making objects:</p>
<pre><code>class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance
    def deposit(self, amount):
        self.balance += amount
    def __repr__(self):
        return f"Account({self.owner}, {self.balance})"

a = Account("Sam", 100)
a.deposit(50)        # a.balance is now 150</code></pre>
<p><code>__init__</code> runs when you create an object and sets up its attributes; <code>self</code> is the object itself, how a method reaches its own data. Use a class when you have data and behavior that belong together and you will make many of them (accounts, players, requests). Do not force everything into classes: a plain function is better when there is no state to carry. Inheritance (one class extending another) and the other pillars of OOP come later; <code>__init__</code>, methods, and <code>self</code> are the 80%.</p>
<h4>How classes really work: lookup, self and the MRO</h4>
<p>A <code>class</code> statement executes its body like a function and packages the resulting names — the methods and any class-level variables — into a class object. Calling the class, <code>Account("Sam", 100)</code>, creates an empty instance and then runs <code>__init__</code> on it. Each instance keeps its own attributes in a dict (<code>vars(a)</code> shows <code>owner</code> and <code>balance</code>). Reading <code>a.x</code> searches in order: the instance's dict, then the class, then its base classes. Methods live once, on the class; <code>a.deposit(50)</code> is exactly <code>Account.deposit(a, 50)</code> — Python finds the function on the class and passes the instance as the first argument, which is all <code>self</code> is. This lookup order explains the classic <strong>class attribute</strong> trap: a list assigned in the class body (<code>history = []</code>) is one object shared by every instance, so <code>self.history.append(x)</code> from any account lands in the same list, while <code>self.log = []</code> inside <code>__init__</code> gives each object its own. The PCAP exam calls these class variables and instance variables. Use class attributes for true constants; anything per-object belongs in <code>__init__</code>.</p>
<h4>Inheritance, dunder methods and properties</h4>
<p><strong>Inheritance</strong> lets a class extend another: <code>class Savings(Account):</code> gets every Account method, can add new ones (<code>add_interest</code>) and can override existing ones; <code>super().__init__(owner, balance)</code> runs the parent's setup so you do not duplicate it. <code>isinstance(s, Account)</code> is True for a Savings. With multiple inheritance, Python linearizes the classes into the <strong>method resolution order</strong> (the C3 algorithm): for <code>class D(B, C)</code> where both inherit from A, <code>D.__mro__</code> is D, B, C, A, object, and the first class in that order that defines a method wins. Polymorphism in Python is mostly duck typing: any object with a <code>deposit</code> method can be passed where an account is expected. Dunder methods ("double underscore") plug your class into the language's protocols: <code>__repr__</code> and <code>__str__</code> control printing, <code>__eq__</code> and <code>__lt__</code> make <code>==</code> and sorting work, <code>__len__</code> answers <code>len()</code>, <code>__iter__</code> makes it loopable (Module 2's protocol), and <code>__enter__</code>/<code>__exit__</code> make it a context manager (Module 5). Python has no private keyword; a leading underscore (<code>_pin</code>) means "internal, hands off", and two underscores (<code>__pin</code>) trigger name mangling to <code>_Account__pin</code>, which prevents accidental clashes in subclasses but is not security. To validate on assignment, use <code>@property</code>: callers still write <code>acct.balance</code>, but your getter and setter run. For classes that are mostly data, <code>@dataclass</code> writes <code>__init__</code>, <code>__repr__</code> and <code>__eq__</code> for you from annotated fields. Introspection functions — <code>type()</code>, <code>isinstance()</code>, <code>issubclass()</code>, <code>hasattr()</code>, <code>getattr()</code>, <code>vars()</code> and <code>dir()</code> — let code ask an object what it is, and appear in PCAP questions.</p>
<h4>Modules and packages</h4>
<p>Any .py file is a module you can <code>import</code>. The standard library is enormous and batteries-included: <code>math</code>, <code>random</code>, <code>datetime</code>, <code>os</code> and <code>pathlib</code> (files and paths), <code>json</code> and <code>csv</code>, <code>collections</code> (Counter, defaultdict), <code>re</code> (regular expressions, the pattern language from Domain 3). Third-party packages install from PyPI with <code>pip</code>: <code>requests</code> (HTTP), <code>pandas</code> (data), and tens of thousands more. Crucial habit: create a <em>virtual environment</em> per project (<code>python -m venv .venv</code> then activate it) so each project has its own isolated package versions and you never pollute the system Python, the mistake that breaks beginners' machines (and the reason Domain 3's PATH lesson mattered). Module 8 opens the venv up and shows exactly what activation changes.</p>
<p>What <code>import json</code> does: Python first checks <code>sys.modules</code>, the cache of already-loaded modules; if json is there, it simply binds the name. Otherwise it searches the directories in <code>sys.path</code> in order — the script's own directory first, then <code>PYTHONPATH</code>, the standard library, then <code>site-packages</code> — compiles or loads the cached <code>.pyc</code> (Module 1), runs the module's top-level code <em>once</em>, stores the module object in <code>sys.modules</code> and binds the name. Two consequences. A file of yours named <code>random.py</code> or <code>json.py</code> in the script's directory shadows the standard module — a common beginner mystery, and a real attack technique when untrusted files sit next to a script (Domain 7). And every module has <code>__name__</code>: it is <code>"__main__"</code> when the file is run directly and the module's own name when imported, so <code>if __name__ == "__main__": main()</code> lets one file be both a script and an importable library. The import forms: <code>import math</code> (use <code>math.sqrt</code>), <code>from math import sqrt</code>, <code>import numpy as np</code>; avoid <code>from x import *</code>, which dumps unknown names into yours. A <strong>package</strong> is a directory of modules with an <code>__init__.py</code>; inside it, relative imports such as <code>from .core import parse_line</code> refer to siblings. <code>dir(math)</code> lists a module's names. Python 3.15 adds explicit <strong>lazy imports</strong> (PEP 810): <code>lazy import json</code> binds the name immediately but loads the module only on first use, cutting start-up time for command-line tools — verified on 3.15: <code>"json" in sys.modules</code> is False until the first <code>json.dumps</code> call.</p>
<h4>Debugging methodically</h4>
<p>When code misbehaves, do not guess. Form a hypothesis, then test it. The cheapest tool is <code>print()</code> to show a value at a point ("is it what I think here?"). Better, <code>assert condition, "message"</code> states what must be true and crashes clearly when it is not. Best, a debugger (<code>breakpoint()</code> in Python, or your editor's) lets you pause and inspect every variable live. The method is binary search applied to bugs: confirm the input is right, confirm the output is wrong, then check the middle, and halve the suspect region until you find the line. Reading the traceback (Module 5) is step one. Write down each hypothesis and its result as you go; ten minutes of notes beats an hour of re-running the same guess. Module 8 covers pdb's commands and replacing debug prints with logging.</p>
<h4>Testing</h4>
<p>A test is code that checks your code. The simplest is an <code>assert</code>: <code>assert area(3, 4) == 12</code>. Real projects use <code>pytest</code>: write functions named <code>test_*</code> containing asserts, run <code>pytest</code>, and it reports what passed and failed. Tests do two things: they prove the function works now, and they catch <em>regressions</em>, the moment a later change silently breaks something that used to work. Write a test for each function's normal case and its edge cases (empty input, zero, negative, the boundary). The discipline that feels slow on day one is what lets you change a large program on day one hundred without fear. This is also how the app you are using checks itself. One test is rarely enough: a wrong formula can agree with the right one at a single point, which is exactly what the worked example below shows.</p>
<h4>Reading other people's code</h4>
<p>Most of a programmer's life is reading code, not writing it. Approach an unfamiliar file top-down: read the names (functions, classes, variables) to get the shape before the details; find the entry point (often <code>if __name__ == "__main__":</code>); and trace one path through. Good names, small functions, and tests, everything this module taught, are what make code readable, which is why you write them for the next person (often future you). Python gives you a reading kit at the REPL: <code>help(obj)</code> shows docstrings and signatures, <code>dir(obj)</code> lists attributes, <code>type(obj).__mro__</code> shows the class chain, <code>inspect.getsource(fn)</code> prints a function's source, and <code>json.__file__</code> tells you where a module lives so you can open the standard library itself — well-written, heavily tested code that is the best free textbook you own.</p>
<table><tr><th>Symptom</th><th>Cause</th><th>Fix</th></tr>
<tr><td><code>TypeError: Account.deposit() takes 1 positional argument but 2 were given</code></td><td>method defined without <code>self</code></td><td><code>def deposit(self, amount):</code></td></tr>
<tr><td><code>AttributeError: 'Account' object has no attribute 'balance'</code></td><td>typo in <code>__init__</code> or attribute set only on one code path</td><td>set every attribute in <code>__init__</code></td></tr>
<tr><td>All objects share one list</td><td>mutable class attribute</td><td>create it in <code>__init__</code></td></tr>
<tr><td><code>AttributeError: module 'random' has no attribute 'randint'</code> — 3.13+ adds "consider renaming …/random.py"</td><td>your own random.py shadows the stdlib</td><td>rename the file; delete its <code>__pycache__</code></td></tr>
<tr><td><code>ModuleNotFoundError: No module named 'requests'</code></td><td>installed into a different interpreter</td><td>activate the venv; <code>python -m pip install</code></td></tr></table>
<p><em>Certification mapping.</em> This module is most of PCAP-31-03. Section 4, Object-Oriented Programming, is the largest on the exam (34%, 12 items): classes, objects, instance versus class variables, methods, introspection, single and multiple inheritance, polymorphism, constructors and <code>__init__</code>, and the MRO. Section 1, Modules and Packages (12%, 6 items), covers import variants, <code>dir()</code>, <code>sys.path</code>, the <code>math</code>, <code>random</code> and <code>platform</code> modules, and writing and using your own modules and packages. PCEP does not test OOP at all, which is why it is the natural first step.</p>`,
example:`<p><strong>A test catches a regression.</strong> You have <code>def discount(price, pct): return price * (1 - pct / 100)</code> and one test, <code>assert discount(100, 10) == 90</code>. Weeks later you "optimize" it to <code>return price - pct</code> by mistake. The single test still passes, because at price 100 the wrong formula happens to agree: 100 - 10 = 90. A second test at a different price exposes it: <code>discount(200, 10)</code> should be 180, but the bad version returns 200 - 10 = 190. Real pytest output for the broken version:</p>
<pre>$ pytest -q
.F                                                                       [100%]
=================================== FAILURES ===================================
______________________________ test_discount_200 _______________________________

    def test_discount_200():
&gt;       assert discount(200, 10) == 180
E       assert 190 == 180
E        +  where 190 = discount(200, 10)

test_pricing.py:7: AssertionError
=========================== short test summary info ============================
FAILED test_pricing.py::test_discount_200 - assert 190 == 180
1 failed, 1 passed in 0.01s</pre>
<p>Restore the formula and it reports <code>2 passed in 0.01s</code>. The regression is caught the moment you introduce it, not in production — and only because the tests sampled more than one point.</p>
<p><strong>Classes, inheritance and the shared-attribute trap (CPython 3.14.6).</strong></p>
<pre>from dataclasses import dataclass

class Account:
    bank = "Example Credit Union"          # class attribute: shared by all
    history = []                           # BUG: one list shared by every account

    def __init__(self, owner, balance=0):
        self.owner = owner                 # instance attributes: one set per object
        self.balance = balance
        self.log = []                      # correct: a fresh list per object

    def deposit(self, amount):
        if amount &lt;= 0:
            raise ValueError("deposit must be positive")
        self.balance += amount
        self.log.append(amount)
        self.history.append(amount)        # finds the class list via lookup

    def __repr__(self):
        return f"{type(self).__name__}({self.owner!r}, {self.balance})"

class Savings(Account):
    def __init__(self, owner, balance=0, rate=0.04):
        super().__init__(owner, balance)
        self.rate = rate

    def add_interest(self):
        self.deposit(round(self.balance * self.rate, 2))

a, s = Account("sam", 100), Savings("ana", 1000)
a.deposit(50)
s.add_interest()
print(a, s, a.log, s.log)
print("shared history:", Account.history, a.history is s.history)
print(sorted(vars(a)), [c.__name__ for c in Savings.__mro__])
Account.deposit(a, 1)                      # what a.deposit(1) really calls
print(a.balance, isinstance(s, Account), hasattr(s, "rate"), hasattr(a, "rate"))

@dataclass
class Splice:
    fiber: int
    loss_db: float
    def ok(self, limit=0.3):
        return self.loss_db &lt;= limit

print(Splice(12, 0.05), Splice(12, 0.05) == Splice(12, 0.05), Splice(3, 0.42).ok())
print(__name__)</pre>
<pre>Account('sam', 150) Savings('ana', 1040.0) [50] [40.0]
shared history: [50, 40.0] True
['balance', 'log', 'owner'] ['Savings', 'Account', 'object']
151 True True False
Splice(fiber=12, loss_db=0.05) True False
__main__</pre>
<p>Each account's own <code>log</code> holds only its deposits, but both deposits landed in the one class-level <code>history</code>. <code>type(self).__name__</code> makes the inherited <code>__repr__</code> print Savings for a Savings, and the dataclass got a readable repr and value equality for free.</p>`,
misconceptions:["\"Everything should be a class.\" Classes are for data+behavior you instantiate many times; a plain function is better when there's no state.","\"pip install globally is fine.\" It causes version conflicts across projects; use a virtual environment per project.","\"Tests are extra work for later.\" They're how you change code safely; the time they cost upfront is repaid the first time they catch a regression.","\"A list defined in the class body belongs to each object.\" It is one class attribute shared by every instance; per-object state must be created in __init__.","\"self is a keyword with special powers.\" It is just the conventional name of the first parameter; a.m(x) is literally Class.m(a, x).","\"import runs the module's code every time it appears.\" The module's top-level code runs once per process; later imports hit the sys.modules cache."],
problems:[
{q:"Add a withdraw method to Account that refuses to overdraw.", a:"def withdraw(self, amount):\\n    if amount > self.balance:\\n        raise ValueError('insufficient funds')\\n    self.balance -= amount"},
{q:"What does self refer to, and why does every method take it?", a:"The specific object the method is called on; it's how the method reads/writes that object's own attributes."},
{q:"Write the commands to create and activate a virtual environment and install requests.", a:"python -m venv .venv ; source .venv/bin/activate (Linux/macOS) ; pip install requests"},
{q:"Write two pytest asserts for is_prime: one true case, one false case.", a:"assert is_prime(7) == True ; assert is_prime(8) == False (and edge: assert is_prime(1) == False)."},
{q:"What is a regression and how do tests catch it?", a:"A change that breaks previously-working behavior; a test that pinned that behavior fails the moment the change lands."},
{q:"Given class A: def who(self): return 'A'; class B(A): def who(self): return 'B'; class C(A): def who(self): return 'C'; class D(B, C): pass — what is D().who(), what is D.__mro__, and what changes if D is declared class D(C, B)?", a:"'B'; the MRO is D, B, C, A, object. With class D(C, B) the MRO becomes D, C, B, A, object and D().who() returns 'C'. The first class in the MRO that defines the method wins."},
{q:"Your script tools.py runs import random; random.randint(1, 6) and fails with AttributeError: module 'random' has no attribute 'randint'. There is a file random.py in the same folder. Explain the mechanism and the full fix.", a:"sys.path[0] is the script's own directory (Python 3.13+ even says so: 'consider renaming …/random.py since it has the same name as the standard library module'), so import random found your random.py before the standard library and cached it in sys.modules. Rename your file (e.g. dice.py), delete the stale __pycache__/random.*.pyc, and rerun; check with print(random.__file__)."},
{q:"Design a Splice class whose loss_db can never be set negative, keeping the attribute syntax s.loss_db = x for callers.", a:"class Splice:\\n    def __init__(self, fiber, loss_db):\\n        self.fiber = fiber\\n        self.loss_db = loss_db\\n    @property\\n    def loss_db(self):\\n        return self._loss_db\\n    @loss_db.setter\\n    def loss_db(self, value):\\n        if value < 0:\\n            raise ValueError('loss cannot be negative')\\n        self._loss_db = value\\n(the assignment in __init__ already goes through the setter)."},
{q:"A colleague's test suite has one test per function, each with a single typical input, and a bug shipped anyway. Using the discount example, explain why, and list three more inputs you would test for discount(price, pct).", a:"A wrong implementation can agree with the right one at one point (price - pct equals price × (1 - pct/100) when price is 100). Test several points and the edges: discount(200, 10) == 180, discount(50, 0) == 50, discount(80, 100) == 0, and a contract test that pct > 100 or < 0 raises ValueError (after adding that check)."}
],
checks:[{q:"What does __init__ do?",a:"Runs when an object is created and sets up its attributes."},{q:"Why a virtual environment?",a:"Isolates each project's package versions from the system and other projects."},{q:"What does a test protect against over time?",a:"Regressions — silent breakage of code that used to work."},{q:"What is __name__ when a file is run directly?",a:"\"__main__\"."},{q:"Where does Python look first when importing a module?",a:"sys.modules (the cache), then each directory on sys.path, starting with the script's own directory."}],
explain:"Explain to ADA when you'd model something as a class versus a function, using 'a bank account' and 'convert Celsius to Fahrenheit' as your two examples."},
{id:"p4m8", title:"The Working Programmer's Toolchain: venv, pip, pyproject, pytest, pdb, logging and Git", minutes:60,
outcomes:["Explain what a virtual environment contains and what activation changes, and fix the externally-managed-environment and wrong-interpreter errors.","Describe a project in pyproject.toml, pin dependencies, and install it in editable mode.","Write pytest tests with assert rewriting, parametrize, pytest.raises and fixtures, and read a failure report.","Debug with pdb (breakpoint, step, inspect, move up the stack, post-mortem) and replace debug prints with leveled logging.","Keep a solo project in Git: working tree, staging area and commits, .gitignore, diff, restore and revert."],
body:`<p>You have a script that works on your laptop. Can someone else — or you, on a new machine in a year — install it in one command, prove it still works, find a bug without guesswork, and roll back last Tuesday's mistake? That is the difference between a script and a project, and it comes down to five tools used every day: a <strong>virtual environment</strong>, <code>pip</code> with <strong>pyproject.toml</strong>, <strong>pytest</strong>, the <strong>pdb</strong> debugger with logging, and Git. Domain 3's shell and PATH are the foundation; Domain 19 automates all of this in CI and containers, and Domain 20 takes Git and testing to team scale. Do every command in this module on a real local install — the browser lab at #py has no project folder, no pip into a venv and no Git.</p>
<h4>What a virtual environment really is</h4>
<p><code>python3 -m venv .venv</code> creates a small directory, not a copy of Python. Inside: <code>pyvenv.cfg</code>, a three-line text file naming the base interpreter (<code>home = …</code>, <code>include-system-site-packages = false</code>, <code>version = 3.14.6</code>); <code>bin/</code> (<code>Scripts\\</code> on Windows) holding symlinks named <code>python</code> and <code>python3</code>, a <code>pip</code>, and the activate scripts (CPython 3.14 even adds a <code>𝜋thon</code> alias); and an almost empty <code>lib/python3.14/site-packages/</code> containing only pip. When that python starts, it finds <code>pyvenv.cfg</code> next to itself and uses the venv's site-packages instead of the system's — that is the whole isolation mechanism. <code>source .venv/bin/activate</code> only prepends <code>.venv/bin</code> to <code>PATH</code>, sets <code>VIRTUAL_ENV</code> and changes the prompt, so <code>python</code> and <code>pip</code> resolve to the venv's copies first; you can skip activation entirely by running <code>.venv/bin/python</code>. Inside Python, <code>sys.prefix != sys.base_prefix</code> is True in a venv. Treat the folder as disposable: never commit it, and rebuild it from pyproject.toml whenever it gets strange.</p>
<p>On Debian 12, Ubuntu 23.04 and later and other distributions, running <code>pip install</code> against the system Python fails with <code>error: externally-managed-environment</code>. That is PEP 668 working as designed: the distribution's own tools depend on packages apt installed, and pip overwriting them could break the operating system. The fix is never <code>sudo pip</code> or <code>--break-system-packages</code>; it is a venv for projects, or <code>pipx</code> for command-line tools you want globally. The other classic failure is the wrong interpreter: <code>pip install requests</code> succeeds, then <code>import requests</code> raises ModuleNotFoundError, because <code>pip</code> belonged to a different Python than the one running the script. Always install with <code>python -m pip</code>, and print <code>sys.executable</code> when in doubt.</p>
<h4>pip, PyPI and pinning</h4>
<p><code>pip install requests</code> asks PyPI for the newest version compatible with your interpreter, resolves its dependencies, downloads <strong>wheels</strong> (prebuilt <code>.whl</code> zip archives; source distributions are built locally when no wheel fits) and unpacks them into site-packages. <code>pip list</code> and <code>pip show requests</code> report what is installed; <code>pip freeze &gt; requirements.txt</code> records exact versions so another machine can reproduce the environment. Version specifiers follow PEP 440: <code>==2.32.3</code> exact, <code>&gt;=2.31</code> a floor, and the compatible-release <code>~=2.31</code>, which means &gt;=2.31 and ==2.*. Packages are code from strangers that runs with your permissions, so check spellings (typosquatted look-alikes of popular package names have repeatedly carried malware on PyPI — Domain 7 and Domain 31) and, for anything deployed, pin with hashes (<code>--require-hashes</code>). <code>uv</code> is a much faster Rust implementation of the same workflow (<code>uv venv</code>, <code>uv pip install</code>, <code>uv sync</code>) that many teams now use; the concepts are identical.</p>
<h4>pyproject.toml: one file describes the project</h4>
<pre>[project]
name = "splicelog"
version = "0.1.0"
description = "Track fusion-splice losses and flag bad splices"
requires-python = "&gt;=3.12"
dependencies = []

[project.optional-dependencies]
dev = ["pytest&gt;=8"]

[project.scripts]
splicelog = "splicelog.cli:main"

[build-system]
requires = ["setuptools&gt;=77"]
build-backend = "setuptools.build_meta"</pre>
<p>The <code>[project]</code> table (PEP 621) is the standard metadata every tool reads: name, version, supported Pythons and runtime dependencies. Optional groups such as <code>dev</code> hold tools only developers need. <code>[project.scripts]</code> creates a real <code>splicelog</code> command on install that calls <code>main()</code> in <code>splicelog/cli.py</code>. <code>[build-system]</code> (PEPs 517 and 518) names the backend that turns the source tree into a wheel — setuptools here; hatchling and others are equally standard. Put the code under <code>src/splicelog/</code> (the "src layout"), so tests import the installed package rather than whatever happens to sit in the current directory. Then <code>python -m pip install -e ".[dev]"</code> installs the project in editable mode — edits take effect without reinstalling — plus pytest.</p>
<h4>pytest in depth</h4>
<p>pytest discovers tests by convention: files named <code>test_*.py</code> or <code>*_test.py</code>, functions starting with <code>test</code>, and classes starting with <code>Test</code>. You write plain <code>assert</code> statements; pytest rewrites them at import time so a failure shows the values on both sides, not just "AssertionError". <code>with pytest.raises(ValueError):</code> asserts that a block raises. <code>@pytest.mark.parametrize</code> runs one test body over a table of inputs — the cheapest way to test a boundary from three sides (0.29, 0.30 and 0.31 dB against a 0.30 limit). A <strong>fixture</strong> is a value pytest builds and injects by parameter name: <code>tmp_path</code> gives each test a fresh temporary directory, <code>capsys</code> captures printed output, <code>monkeypatch</code> swaps environment variables or functions for the duration of one test. Structure each test as arrange, act, assert. Daily flags: <code>-q</code> quiet, <code>-x</code> stop at the first failure, <code>-k splice</code> run tests whose names match, <code>--lf</code> rerun only the last failures. The <code>pytest-cov</code> plugin's <code>--cov</code> reports which lines no test ever executed — not proof of correctness, but a map of what is unproven.</p>
<h4>pdb: stop the program and look</h4>
<p>Put <code>breakpoint()</code> on the line before the mystery and run normally; since 3.13 the debugger stops on the <code>breakpoint()</code> line itself. Or run <code>python -m pdb -c continue script.py</code>: the program runs until an uncaught exception, then you are dropped into the frame that crashed — post-mortem debugging, often the fastest route from a traceback to a cause. <code>PYTHONBREAKPOINT=0</code> disables every breakpoint without editing code. Editor debuggers such as VS Code's drive the same machinery with buttons.</p>
<table><tr><th>Command</th><th>Does</th><th>Use it to</th></tr>
<tr><td><code>p expr</code> / <code>pp expr</code></td><td>print / pretty-print a value</td><td>test a hypothesis about state</td></tr>
<tr><td><code>n</code></td><td>run the next line, stepping over calls</td><td>walk the current function</td></tr>
<tr><td><code>s</code></td><td>step into the call on this line</td><td>follow the data into a helper</td></tr>
<tr><td><code>c</code></td><td>continue to the next breakpoint</td><td>skip ahead</td></tr>
<tr><td><code>l</code> / <code>ll</code></td><td>list source around / the whole function</td><td>see where you are</td></tr>
<tr><td><code>w</code>, <code>u</code>, <code>d</code></td><td>show the stack; move up or down a frame</td><td>inspect the caller's variables</td></tr>
<tr><td><code>b file:line</code>, <code>q</code></td><td>set a breakpoint; quit</td><td>plan the next stop; leave</td></tr></table>
<h4>print versus logging</h4>
<p>Debug prints are fine for five minutes and a liability after that: they mix with real output, they have no off switch, and you forget to delete them. The <code>logging</code> module gives every message a level — DEBUG 10, INFO 20, WARNING 30, ERROR 40, CRITICAL 50 — and you choose at start-up which levels appear and where they go. The root logger defaults to WARNING, which is why a beginner's <code>logging.info("…")</code> prints nothing until <code>logging.basicConfig(level=logging.INFO)</code>. Create one logger per module with <code>log = logging.getLogger(__name__)</code>, pass values as arguments (<code>log.warning("line %d skipped: %r", n, text)</code>) so formatting happens only if the message is emitted, and call <code>log.exception("…")</code> inside an except block to record the full traceback. Logs go to stderr by default, so <code>python tool.py &gt; result.txt</code> captures the results while warnings still reach your screen — Domain 3's stream redirection paying off. The incident responders of Domain 21 live on exactly these records.</p>
<h4>Git for a solo developer</h4>
<p>Git tracks three areas: the <strong>working tree</strong> (your files), the <strong>staging area</strong> (the index: what the next commit will contain) and the repository (<code>.git</code>, every commit ever made). The daily loop is <code>git status</code> → <code>git add file</code> → <code>git commit -m "Explain why, in the imperative"</code>. A <strong>commit</strong> is a snapshot, not a diff: it records a tree of every file's content, each identified by its SHA-1 hash, plus the parent commit's hash, the author and the message; <code>git cat-file -p HEAD</code> shows those fields. Because each commit includes its parent's hash, changing any old commit changes every hash after it, which makes history tamper-evident — the same chaining idea as Domain 25's hash chains. Start with <code>git init -b main</code> and a <code>.gitignore</code> listing <code>.venv/</code>, <code>__pycache__/</code>, <code>.pytest_cache/</code> and any <code>.env</code> secrets file, before the first <code>git add .</code>; a committed secret lives on in history and must be rotated, not just deleted.</p>
<table><tr><th>Situation</th><th>Command</th><th>Effect</th></tr>
<tr><td>What changed and is not staged?</td><td><code>git diff</code> (<code>--staged</code> for staged)</td><td>line-by-line changes</td></tr>
<tr><td>Throw away edits to one file</td><td><code>git restore core.py</code></td><td>working copy back to the last commit</td></tr>
<tr><td>Unstage a file</td><td><code>git restore --staged core.py</code></td><td>keeps your edits, drops them from the next commit</td></tr>
<tr><td>Undo a commit already made</td><td><code>git revert &lt;hash&gt;</code></td><td>a new commit that inverts it; history stays intact</td></tr>
<tr><td>Try an idea safely</td><td><code>git switch -c idea</code> … <code>git switch main</code>; <code>git merge idea</code></td><td>a branch is a movable pointer to a commit</td></tr>
<tr><td>Back up and share</td><td><code>git remote add origin …</code>; <code>git push -u origin main</code></td><td>GitHub over SSH (Domain 20)</td></tr></table>
<p><em>Certification mapping.</em> PCAP-31-03 Section 1 (Modules and Packages, 12%) covers the package half of this module: user-defined modules and packages, <code>__init__.py</code>, <code>__pycache__</code> and <code>sys.path</code> search order. Neither PCEP nor PCAP tests venv, pytest, pdb or Git directly — but every Python job description assumes all four, Lab 4 and the capstone grade them, and Domain 20 (Software Engineering Practice) and Domain 19 (DevOps) build directly on this module.</p>`,
example:`<p><strong>One small project, end to end (CPython 3.14.6, pytest 9.1.1, Git 2.43).</strong> The CLI's <code>main()</code> reads lines from stdin, logs a warning for each unparsable line and prints the fibers to re-splice; it ends with <code>if __name__ == "__main__": main()</code>. Layout: <code>pyproject.toml</code> (above), <code>src/splicelog/core.py</code>, <code>src/splicelog/cli.py</code>, <code>tests/test_core.py</code>. The core and its tests:</p>
<pre># src/splicelog/core.py
def parse_line(line):
    """'12, 0.05' -&gt; (12, 0.05). Raises ValueError on bad input."""
    fiber, loss = line.split(",")
    return int(fiber), float(loss)

def bad_splices(rows, limit=0.30):
    """Fibers whose splice loss in dB exceeds the limit."""
    return [fiber for fiber, loss in rows if loss &gt; limit]

# tests/test_core.py
import pytest
from splicelog.core import parse_line, bad_splices

def test_parse_line():
    assert parse_line("12, 0.05\\n") == (12, 0.05)

def test_parse_line_rejects_garbage():
    with pytest.raises(ValueError):
        parse_line("twelve, 0.05")

@pytest.mark.parametrize("loss, flagged", [(0.29, []), (0.30, []), (0.31, [7])])
def test_bad_splices_boundary(loss, flagged):
    assert bad_splices([(7, loss)]) == flagged</pre>
<p><code>python -m pytest -q</code> prints <code>......</code> and <code>6 passed in 0.01s</code> (six, because parametrize turned one function into three tests, plus a total-loss test). Now change <code>&gt;</code> to <code>&gt;=</code> — the kind of edit that "looks the same" — and rerun:</p>
<pre>...F..                                                                   [100%]
=================================== FAILURES ===================================
___________________ test_bad_splices_boundary[0.3-flagged1] ____________________

loss = 0.3, flagged = []

    @pytest.mark.parametrize("loss, flagged", [(0.29, []), (0.30, []), (0.31, [7])])
    def test_bad_splices_boundary(loss, flagged):
&gt;       assert bad_splices([(7, loss)]) == flagged
E       assert [7] == []
E
E         Left contains one more item: 7
E         Use -v to get more diff

tests/test_core.py:13: AssertionError
=========================== short test summary info ============================
FAILED tests/test_core.py::test_bad_splices_boundary[0.3-flagged1] - assert [...
1 failed, 5 passed in 0.03s</pre>
<p>Only the exact-boundary case fails — the one a single "typical" test would never have sampled. The CLI logs instead of printing diagnostics; feeding it four lines, one of them garbage:</p>
<pre>$ printf '12, 0.05\\n13, 0.41\\nfiber 14 dirty\\n15, 0.31\\n' | python -m splicelog.cli
WARNING __main__: line 3 skipped: 'fiber 14 dirty'
INFO __main__: 3 splices read
re-splice: [13, 15]</pre>
<p>Run as a module with <code>-m</code>, the file's <code>__name__</code> is <code>"__main__"</code>, so that is the logger's name; through the installed <code>splicelog</code> command the module is imported and the lines read <code>WARNING splicelog.cli: …</code> — Module 7's <code>__name__</code> rule, visible in a log.</p>
<p>And the history, after a first commit and one change to the limit:</p>
<pre>$ git log --oneline
f789727 Tighten splice limit to 0.25 dB
9fe741f Parse splice log and flag losses over 0.30 dB
$ git cat-file -p HEAD
tree 41013b9e5c34f374f6ff449fa1041e2e2f30b613
parent 9fe741f12693bff4eadc0bc734496899e0e251c5
author Tyler &lt;tyler@example.com&gt; 1793040254 -0400</pre>
<p>Notice what the boundary test does next: after tightening the limit to 0.25 dB, the 0.29 and 0.30 cases now flag fiber 7 and fail. That failure is the point — the test pinned the old specification, and changing the spec means changing the test on purpose, in the same commit.</p>`,
misconceptions:["\"Activating a venv copies Python into my project.\" A venv holds symlinks, a pyvenv.cfg and its own site-packages; activation only puts .venv/bin first on PATH.","\"sudo pip install fixes the externally-managed-environment error.\" It overwrites packages the OS depends on; use a venv for projects or pipx for tools.","\"Git stores a list of diffs.\" Each commit is a snapshot of the whole tree (stored efficiently by content hash); diffs are computed on demand.","\"Logging is just print with extra steps.\" Levels, per-module loggers, stderr output and a single on/off switch let diagnostics stay in the code without polluting results.","\"One passing test per function proves it works.\" Wrong code can agree with right code at one point; test edges and boundaries, ideally with parametrize."],
problems:[
{q:"On Ubuntu 24.04, pip install requests prints error: externally-managed-environment. Explain why and give the correct fix for a project and for a CLI tool you want everywhere.", a:"PEP 668: the distribution marks the system Python as managed by apt, so pip refuses to overwrite packages the OS relies on. Project: python3 -m venv .venv; source .venv/bin/activate; python -m pip install requests. Global CLI tool: pipx install <tool>. Never sudo pip or --break-system-packages."},
{q:"pip install requests succeeded, but python app.py raises ModuleNotFoundError: No module named 'requests'. Give two commands that diagnose it and the fix.", a:"python -c 'import sys; print(sys.executable)' and pip --version (which prints the Python it belongs to) reveal two different interpreters. Fix: activate the venv (or call .venv/bin/python) and install with python -m pip install requests so pip matches the running interpreter."},
{q:"Write a parametrized pytest test for is_valid_port(n) that checks 0, 1, 65535 and 65536, and a separate test that is_valid_port('80') raises TypeError.", a:"@pytest.mark.parametrize('n, ok', [(0, False), (1, True), (65535, True), (65536, False)])\\ndef test_port_bounds(n, ok):\\n    assert is_valid_port(n) == ok\\n\\ndef test_port_rejects_str():\\n    with pytest.raises(TypeError):\\n        is_valid_port('80')"},
{q:"You are stopped at a breakpoint inside average(values) and values is empty. How do you find which caller passed it, and inspect the caller's variables, without leaving pdb?", a:"w (where) prints the stack with the current frame marked; u moves up one frame into the caller; then p or pp shows its variables (e.g. p rows); d moves back down. ll lists the whole function in the current frame."},
{q:"Your tool calls logging.info('loaded %d rows', n) but nothing appears. Explain and fix, and say why log.info('loaded %d rows', n) beats log.info(f'loaded {n} rows').", a:"The root logger's default level is WARNING, so INFO is filtered out. Call logging.basicConfig(level=logging.INFO) once at start-up (or set a handler level). Passing n as an argument defers formatting until the record is actually emitted, so filtered messages cost almost nothing."},
{q:"You edited core.py, broke it, and have not committed. Separately, yesterday's commit a1b2c3d introduced a bug and is already pushed. Give the command for each and explain why they differ.", a:"Uncommitted edits: git restore core.py (working copy back to the last commit). Pushed bad commit: git revert a1b2c3d, which adds a new commit that inverts it; rewriting pushed history (reset/amend) would change hashes others may have."},
{q:"requirements.txt says requests~=2.31. Which of 2.30.0, 2.31.0, 2.32.3 and 3.0.0 satisfy it?", a:"~=2.31 means >=2.31 and ==2.*: 2.31.0 and 2.32.3 satisfy it; 2.30.0 is too old and 3.0.0 is a different major version."},
{q:"Why does editing a commit from three commits ago change the hash of every later commit, but leave earlier commits unchanged?", a:"Each commit's hash covers its content, including its parent's hash. Changing the old commit changes its hash, so its child (which records that parent hash) changes, and so on down the chain. Earlier commits are not referenced by anything that changed, so their hashes stay the same."}
],
checks:[{q:"What does activating a venv change?",a:"PATH (venv's bin first), VIRTUAL_ENV and the prompt — nothing else."},{q:"Which file standardizes project metadata and dependencies?",a:"pyproject.toml ([project] table, PEP 621)."},{q:"How does pytest find tests?",a:"test_*.py / *_test.py files, functions named test*, classes named Test*."},{q:"Default level of the root logger?",a:"WARNING."},{q:"Name Git's three areas.",a:"Working tree, staging area (index), repository."}],
explain:"Walk ADA through what happens, file by file, when you run python -m venv .venv, activate it, and run python -m pip install -e \".[dev]\" — then explain what pytest does when you type pytest -q."}
],
listening:[],
labs:[
{id:"p4lab1", title:"Code Lab: ten katas", goal:"Write and run real Python in the browser.", steps:["Open the Code Lab simulator.","Solve the ten warm-up katas: FizzBuzz, reverse a string, count vowels, is_prime, word frequency, and five more.","For each, state its Big-O before you run it.","Have ADA review one solution and suggest a cleaner version."], deliverable:"Ten passing katas and your Big-O notes."},
{id:"p4lab2", title:"Trace and fix", goal:"Read tracebacks and debug.", steps:["Ask ADA for a 25-line Python script with three planted bugs (one each: NameError, IndexError, logic error).","Run it, read each traceback, fix the bug, and name the error class.","Explain to ADA how you localized each one."], deliverable:"The fixed script and your diagnosis notes."},
{id:"p4lab3", title:"Build a real tool", goal:"A command-line word-counter with tests.", steps:["Write a program that reads a text file and prints its ten most common words, using functions (read, normalize, count, top_n).","Use a dict/Counter — explain why not a list.","Write pytest tests for normalize and count on small inputs.","Run it on a book from Project Gutenberg."], deliverable:"The program, its tests passing, and output on a real book."},
{id:"p4lab4", title:"Set up the real workflow", goal:"Virtual env, packages, Git.", steps:["Create a project folder, a virtual environment, and install requests.","Write a script that fetches a public JSON API and prints one field (ties to Domain 2).","Initialize a Git repo, commit, and write a README (ties to Domain 3)."], deliverable:"A committed project with a working venv and a README."}
],
capstone:{title:"Ship a small program", brief:"Build a command-line program of real use to you (a habit tracker, a budget splitter, a flashcard quizzer, a file organizer, a splice-loss log) with: functions with docstrings, at least one class, error handling with at least one custom exception, a saved data file (JSON, read and written with an explicit UTF-8 encoding), logging instead of debug prints, pytest tests including a parametrized boundary test, a pyproject.toml, a virtual environment, and a Git repo with a .gitignore and a README. Walk ADA through the design as if in a code review, including one bug you found with pdb or a failing test.", rubric:["Decomposed into small, named functions; at least one class used appropriately.","Handles bad input without crashing; reads/writes a data file safely.","Has tests for the core logic, including an edge case.","Runs from a clean virtual environment per the README; committed to Git.","Uses a custom exception and logging levels deliberately, and the Git history shows small commits with messages that explain why."]},
exam:[
{id:"p4q1", type:"mc", q:"What are the value and type of 7 / 2 in Python 3?", options:["3 (int)","3.5 (float)","3 (float)","4 (int)"], answer:1, why:"/ is true division and always yields a float; // would give 3."},
{id:"p4q2", type:"mc", q:"After a = [1, 2]; b = a; b.append(3), what is a?", options:["[1, 2]","[1, 2, 3]","[3]","Error"], answer:1, why:"a and b name the same list object, so the append is visible through both."},
{id:"p4q3", type:"mc", q:"Which collection gives O(1) lookup by key?", options:["list","tuple","dict","All the same"], answer:2, why:"A dict is a hash table; list/tuple search is O(n)."},
{id:"p4q4", type:"mc", q:"What does a Python function with no return statement return?", options:["0","'' (empty string)","None","It errors"], answer:2, why:"Absent an explicit return, a function yields None."},
{id:"p4q5", type:"mc", q:"Which is the Big-O cliff caused by nested loops over the same large data?", options:["O(1)","O(log n)","O(n)","O(n²)"], answer:3, why:"Comparing every pair is quadratic; it explodes on large n."},
{id:"p4q6", type:"mc", q:"Why avoid def f(items=[]) as a default?", options:["It's a syntax error","The default list is created once and shared across calls","Lists can't be parameters","It's slower"], answer:1, why:"The mutable default persists between calls; use None as a sentinel."},
{id:"p4q7", type:"mc", q:"Binary search requires that the data is:", options:["Unique","Sorted","Numeric","In a set"], answer:1, why:"It halves the range by comparing to the middle, which only works if sorted."},
{id:"p4q8", type:"mc", q:"Which exception does int('hello') raise?", options:["TypeError","KeyError","ValueError","SyntaxError"], answer:2, why:"The type is right (str) but the value can't be converted: ValueError."},
{id:"p4q9", type:"mc", q:"What's the main reason to use a virtual environment?", options:["Faster code","Isolate each project's package versions","Encrypt your code","Required by Python"], answer:1, why:"venvs prevent cross-project dependency conflicts."},
{id:"p4q10", type:"mc", q:"In a traceback, where is the exception type and message?", options:["The first line","A middle line","The last line","It varies randomly"], answer:2, why:"Read the last line for what; the frames above for where."},
{id:"p4q11", type:"sa", q:"Explain the difference between a function that prints a value and one that returns it, and why it matters for composing programs.", answer:"print sends text to output for a human to read and the function still returns None; return hands the value back to the calling code. Only returned values can be stored, passed to other functions, or combined (double(5) + double(5) needs return). Functions that return compose into larger programs; print-only functions are dead ends. Best practice: compute and return, then print at the top level.", rubric:"Must distinguish output-for-human vs value-to-program and note that only returned values compose."},
{id:"p4q12", type:"sa", q:"You must check membership of a million queries against a million known items. Describe the naive approach, its Big-O, and the one-line fix with its Big-O.", answer:"Naive: for each query, 'if q in known_list' — a list search is O(n), done n times, so O(n²) ≈ a trillion checks. Fix: convert once, known = set(known_list), which is O(n); then 'if q in known' is O(1) each, so O(n) overall. Same result, ~a million times faster at this scale, because set membership is a hash lookup, not a scan.", rubric:"Identifies O(n²) nested search, the set conversion, and O(n) total with O(1) lookups."},
{id:"p4q13", type:"sa", q:"Write a recursive factorial function and explain why the base case is essential.", answer:"def fact(n):\\n    if n == 0:\\n        return 1\\n    return n * fact(n - 1)\\nThe base case (n == 0 returns 1) stops the recursion; each call reduces n toward it. Without a base case the function calls itself forever, consuming stack frames until Python raises RecursionError (stack overflow).", rubric:"Correct base + recursive case; explains the base case prevents infinite recursion/stack overflow."},
{id:"p4q14", type:"mc", q:"nums = [2, 4, 5, 6, 8]; then for n in nums: (if n % 2 == 0: nums.remove(n)); then print(nums). What prints?", options:["[5]","[4, 5, 8]","[2, 4, 5, 6, 8]","IndexError"], answer:1, why:"Each removal shifts the later items left, so the loop skips the item after every removal: 4 and 8 survive next to 5. Build a new list with a comprehension instead."},
{id:"p4q15", type:"mc", q:"x = 'G' at module level, and def f(): whose body is print(x) followed by x = 'L'. What happens when you call f()?", options:["Prints G","Prints L","UnboundLocalError","NameError"], answer:2, why:"The assignment anywhere in the body makes x local to f for the whole body (decided at compile time), so reading it before assignment raises UnboundLocalError."},
{id:"p4q16", type:"mc", q:"A script reads two lengths with input() and prints 'Total: 1525' when the user types 15 and 25. What is the cause?", options:["Float rounding error","input() returned strings, and + concatenated them","Integer overflow","The function forgot to return"], answer:1, why:"input() always returns str; '15' + '25' is '1525'. Convert at the boundary with int()."},
{id:"p4q17", type:"mc", q:"A 50,000-item work queue is drained with jobs.pop(0) and the program is slow. Which change fixes the cost?", options:["Sort the list first","Use collections.deque and popleft()","Store the jobs in a tuple","Use a set so pops are O(1)"], answer:1, why:"list.pop(0) shifts every remaining pointer (O(n) per pop, O(n²) to drain); deque.popleft() is O(1). A set has no order, so it cannot act as a FIFO queue."},
{id:"p4q18", type:"mc", q:"What does print(len('café'), len('café'.encode('utf-8'))) print?", options:["4 4","5 5","4 5","5 4"], answer:2, why:"len of a str counts code points (4); é (U+00E9) encodes to two UTF-8 bytes (c3 a9), so the bytes object has 5."},
{id:"p4q19", type:"mc", q:"class Team has members = [] in its class body, __init__(self, name) sets self.name = name, and add(self, m) does self.members.append(m). After a, b = Team('a'), Team('b') and a.add('x'), what is b.members?", options:["[]","['x']","AttributeError","None"], answer:1, why:"members is a class attribute: one list shared by every instance. self.members finds it on the class, so a's append is visible through b. Create per-object lists in __init__."},
{id:"p4q20", type:"mc", q:"Naive recursive fib(30) makes about 2.7 million calls. Which one-line change reduces it to about 31 real computations?", options:["sys.setrecursionlimit(10**6)","Decorate fib with @functools.cache","Convert n to a float","Wrap the calls in try/except"], answer:1, why:"Memoization stores each fib(k) the first time it is computed, so each of the 31 values 0..30 is computed once; the recursion limit is unrelated to the repeated work."},
{id:"p4q21", type:"mc", q:"pip install requests reports success, but python app.py raises ModuleNotFoundError: No module named 'requests'. Most likely cause?", options:["requests is not published on PyPI","pip and python belong to different interpreters or environments","The script must be run with sudo","Python caches failed imports between runs"], answer:1, why:"The pip on PATH installed into another Python. Activate the project's venv and use python -m pip so the installer matches the interpreter; print sys.executable to confirm."},
{id:"p4q22", type:"mc", q:"What is the worst-case number of comparisons for binary search on 70,000 sorted items?", options:["7","17","70","35,000"], answer:1, why:"⌊log₂ 70,000⌋ + 1 = 16 + 1 = 17 (2^16 = 65,536 ≤ 70,000 < 2^17)."},
{id:"p4q23", type:"sa", q:"A script that reads a supplier's CSV crashes with UnicodeDecodeError: 'utf-8' codec can't decode byte 0x92 in position 1180: invalid start byte. Explain what is in the file, why decoding failed at that byte, and how you would fix it properly.", answer:"The file is not UTF-8; it was almost certainly written in Windows-1252 (cp1252), where 0x92 is the right single quotation mark (’). In UTF-8, a byte of the form 10xxxxxx (0x80–0xBF) can only continue a multi-byte sequence, so a lone 0x92 cannot start a character and the decoder stops. Fix: open the file with encoding='cp1252' (confirm by inspecting the bytes, e.g. with a hex dump or by checking that the decoded text reads correctly), or convert the file to UTF-8 once at the boundary and keep everything UTF-8 afterwards. errors='replace' would silently corrupt data, so it is only acceptable for logs.", rubric:"Identifies the encoding mismatch (cp1252/Latin-1 bytes read as UTF-8); explains that 0x92 is a continuation byte and cannot start a UTF-8 character; gives the explicit-encoding fix (and/or one-time conversion); warns that errors='replace' hides data loss."},
{id:"p4q24", type:"sa", q:"bad_splices(rows, limit=0.30) returns the fibers whose loss exceeds the limit, and its only test checks a 0.05 dB splice. Someone changes > to >=. Explain why the existing test still passes, and design a pytest test that catches the change, naming the pytest features you would use.", answer:"A 0.05 dB splice is far from the limit, so > and >= give the same answer there; the change only matters at exactly 0.30. Use @pytest.mark.parametrize to test the boundary from three sides — (0.29, []), (0.30, []), (0.31, [7]) — asserting bad_splices([(7, loss)]) == flagged. With >=, the 0.30 case returns [7] and pytest's assert rewriting reports assert [7] == []. Add a test for parse errors with pytest.raises(ValueError). Run with pytest -q (and -x while fixing).", rubric:"Explains that the single test sits away from the boundary where > and >= differ; tests exactly at the boundary plus one value on each side; uses parametrize (or several asserts) and shows the expected outputs; mentions how the failure is reported or adds a pytest.raises error-path test."}
],
cards:[
{id:"p4c1", front:"Variable (Python)", back:"A name bound to an object, not a box; y = x makes both names refer to the same object."},
{id:"p4c2", front:"/ vs // vs %", back:"/ true division (float), // floor division (int), % remainder. 7/2=3.5, 7//2=3, 7%2=1."},
{id:"p4c3", front:"Falsy values", back:"False, 0, 0.0, '', [], {}, None. Everything else is truthy; 'if items:' = non-empty."},
{id:"p4c4", front:"f-string", back:"f\"{name}: {x:.2f}\" inserts and formats values inline. The modern way to build text."},
{id:"p4c5", front:"if / elif / else chain", back:"Only the first truthy branch runs; order from most specific/highest threshold down."},
{id:"p4c6", front:"for loop vs while loop", back:"for iterates a sequence (range/enumerate/zip); while repeats until a condition is false (unknown count)."},
{id:"p4c7", front:"break and continue", back:"break exits the loop; continue skips to the next iteration. Loop-else runs if no break."},
{id:"p4c8", front:"Function return vs print", back:"return hands a value to the program (composes); print shows text to a human (dead end). Prefer return."},
{id:"p4c9", front:"Parameter vs argument", back:"Parameter = name in the def; argument = value passed at the call. Positional or keyword; defaults allowed."},
{id:"p4c10", front:"Mutable default trap", back:"def f(x=[]) shares one list across calls; use x=None then 'if x is None: x=[]'."},
{id:"p4c11", front:"Scope", back:"Names assigned in a function are local; functions are sealed boxes. Avoid global mutable state."},
{id:"p4c12", front:"list", back:"Ordered, mutable. Index/append O(1); search/insert-middle O(n). Default sequence."},
{id:"p4c13", front:"dict", back:"Key→value hash table; lookup/insert/membership O(1). Use whenever you look things up by a key."},
{id:"p4c14", front:"set", back:"Unique, unordered; O(1) membership; union | intersection & difference -. Deduplicate and fast 'in'."},
{id:"p4c15", front:"tuple", back:"Immutable sequence; usable as a dict key; unpack with x, y = point."},
{id:"p4c16", front:"Comprehension", back:"[x*x for x in xs if x>0] builds a list in one line; also set/dict comprehensions."},
{id:"p4c17", front:"Big-O classes", back:"O(1) constant, O(log n) binary search, O(n) scan, O(n log n) sort, O(n²) nested loops (the cliff)."},
{id:"p4c18", front:"Linear vs binary search", back:"Linear O(n), any list. Binary O(log n) but needs sorted data. ~20 steps for a million."},
{id:"p4c19", front:"Recursion", back:"A function calls itself on a smaller input; needs a base case + a shrinking recursive case, or it overflows the stack."},
{id:"p4c20", front:"String methods", back:".strip() .lower() .split(sep) sep.join(parts) .replace() .startswith(); strings are immutable."},
{id:"p4c21", front:"with open(...)", back:"Opens a file and closes it automatically even on error. Modes: r, w (truncates!), a, +b."},
{id:"p4c22", front:"Common exceptions", back:"ValueError, TypeError, KeyError, IndexError, FileNotFoundError, ZeroDivisionError, NameError, AttributeError."},
{id:"p4c23", front:"try / except", back:"Catch the specific exception you expect; raise ValueError('msg') for contract violations; never bare except."},
{id:"p4c24", front:"Reading a traceback", back:"Last line = exception type + message; then the deepest frame in YOUR code is where to look."},
{id:"p4c25", front:"Class basics", back:"__init__ sets attributes, self is the object, methods act on self. Use for data+behavior you instantiate often."},
{id:"p4c26", front:"import & stdlib", back:"math, random, datetime, os/pathlib, json/csv, collections, re. pip installs third-party from PyPI."},
{id:"p4c27", front:"Virtual environment", back:"python -m venv .venv; one isolated set of package versions per project; never install globally."},
{id:"p4c28", front:"Debugging method", back:"Hypothesis → test it; print/assert/breakpoint; binary-search the suspect region; read the traceback first."},
{id:"p4c29", front:"Testing & regressions", back:"pytest + test_* functions with asserts prove it works now and catch regressions (silent breakage) later."},
{id:"p4c30", front:"Make it work, right, fast", back:"Correctness first, clarity second, speed only when measurement demands it."},
{id:"p4c31", front:"Bytecode", back:"Compact instructions for CPython's stack-based virtual machine, compiled from your source and cached as .pyc; dis.dis(f) shows them. Changes every release."},
{id:"p4c32", front:"Reference counting", back:"CPython counts the references to each object and frees it the moment the count hits zero; a cyclic garbage collector cleans up reference cycles."},
{id:"p4c33", front:"Identity", back:"An object's unchanging id (its address in CPython). 'is' compares identity; '==' compares value. Use 'is' only for None."},
{id:"p4c34", front:"Iterator", back:"An object that hands out items via next() and raises StopIteration when done; for loops call iter() then next(). Single-use."},
{id:"p4c35", front:"LEGB rule", back:"Name lookup order: Local, Enclosing, Global, Built-in. Any assignment in a function makes that name local for the whole body."},
{id:"p4c36", front:"Closure", back:"An inner function plus the enclosing variables it captured (in cells); survives after the outer function returns. Captures variables, not values."},
{id:"p4c37", front:"Call stack", back:"The pile of frames for active calls, each holding locals and the next instruction; a traceback prints it; default limit 1,000 frames."},
{id:"p4c38", front:"Amortized O(1)", back:"Average cost per operation over a long sequence: list.append occasionally resizes (O(n)) but over-allocation keeps the average constant."},
{id:"p4c39", front:"Hashable", back:"Has a hash that never changes and equality consistent with it — ints, strs, tuples of hashables, frozensets. Required for dict keys and set members."},
{id:"p4c40", front:"UTF-8", back:"Variable-length Unicode encoding: 1 byte for ASCII, 2 for é (c3 a9), 3 for € (e2 82 ac), 4 for emoji. Python 3.15's default for open()."},
{id:"p4c41", front:"Code point", back:"The number Unicode assigns a character (é = U+00E9 = 233); ord() and chr() convert. len(str) counts code points, not bytes."},
{id:"p4c42", front:"Context manager", back:"An object with __enter__/__exit__ used by 'with'; guarantees cleanup (closing files, releasing locks) like try/finally."},
{id:"p4c43", front:"EAFP", back:"'Easier to ask forgiveness than permission': try the operation and catch the specific exception, instead of pre-checking every condition."},
{id:"p4c44", front:"Memoization", back:"Caching a function's results by argument (@functools.cache) so repeated subproblems are computed once — naive fib(30): 2.7M calls → 31."},
{id:"p4c45", front:"Stable sort", back:"Equal keys keep their original order (Timsort is stable), which makes multi-key sorting work."},
{id:"p4c46", front:"Method resolution order", back:"The C3-linearized class order Python searches for attributes (Class.__mro__); for class D(B, C): D, B, C, A, object."},
{id:"p4c47", front:"Class attribute", back:"Defined in the class body and shared by all instances; a mutable one (a list) is a shared-state trap. Per-object data goes in __init__."},
{id:"p4c48", front:"Staging area", back:"Git's index: the snapshot the next commit will record. git add stages; git restore --staged unstages; git commit records it."},
{id:"p4c49", front:"Fixture", back:"A value pytest builds and injects by parameter name (tmp_path, capsys, monkeypatch, or your own @pytest.fixture)."},
{id:"p4c50", front:"Loop invariant", back:"A statement true before and after every iteration; binary search's is 'if present, the target is in items[lo..hi]'."}
]
});
