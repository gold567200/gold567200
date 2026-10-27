/* Lab guides — Domain 48: Mathematics Foundations: Arithmetic to Calculus for Computing */
window.LABX=window.LABX||{};
Object.assign(window.LABX,{
  "p48lab1":{
    time:"60–90 min",
    setup:[
      "Python 3.12 or newer on your own machine (python.org installer on Windows or macOS, sudo apt install python3 on Ubuntu or WSL2), or the app's in-browser Python at #py. This lab needs only the standard library (math, fractions), so the in-browser runtime is enough.",
      "A folder named math48 for all five labs of this domain, and a text editor (VS Code, nano or IDLE). Keep every script; later labs import units.py.",
      "Paper and pencil next to the keyboard. The rule for the whole domain: do the calculation by hand first, write the answer down, then run the code. A match proves both; a mismatch is where the learning is.",
      "Module 1 open in another tab for the reference values (931.3 GiB, 22.2 min, $8.10, 5,184 GB)."
    ],
    checkpoints:[
      "python3 --version prints Python 3.12.x or newer (or the #py page prints a version when you run import sys; print(sys.version)), and math48/units.py exists.",
      "transfer_time(50, 300) returns about 22.2, transfer_time(120, 1000, 0.8) returns 20.0, to_binary(10**12) shows 931.3 GiB and 0.909 TiB, and energy_cost(450, 4, 30, 0.15) returns 8.1; each matches the answer you wrote on paper first.",
      "The prefix table prints five rows with gaps of 2.4%, 4.9%, 7.4%, 10.0% and 12.6%, and the TB row agrees with 10**12 / 2**30 = 931.32 GiB.",
      "Fraction(3,8) + Fraction(5,12) == Fraction(19,24) prints True; 1.25 * 0.80 prints 1.0 and 1.5 * 0.5 prints 0.75, confirming that successive percentage changes multiply.",
      "Your estimation log has ten rows (estimate, exact, ratio), the 4K frame row reads about 2.4e7 estimated against 24,883,200 exact, and at least eight of the ten ratios fall between 1/3 and 3."
    ],
    hints:[
      "Write every function so the units are visible in the variable names (size_gb, rate_mbps, seconds). When a result is off by exactly 8 or 1,000 or 1,024, a unit conversion is missing or doubled.",
      "transfer_time is size_gb × 8 × 1000 ÷ (rate_mbps × efficiency) ÷ 60. to_binary divides bytes by 2**30 and 2**40. energy_cost is watts × hours_per_day × days ÷ 1000 × price_per_kwh. Use f-strings like f'{x:,.1f}' so big numbers are readable.",
      "For the prefix table loop k from 1 to 5 and print 2**(10*k) / 10**(3*k) − 1 as a percentage. For estimates, round every input to one significant figure and add exponents in your head: 4 × 10³ × 2 × 10³ × 3 = 2.4 × 10⁷."
    ],
    trouble:[
      ["transfer_time(50, 300) returns 2.78 or 177.8 instead of about 22","The bits-per-byte factor of 8 is missing (2.78) or the minutes conversion is missing and you are looking at a different unit","Print the intermediate value in megabits and in seconds. 50 GB must become 400,000 Mb and 1,333 s before you divide by 60. Check the units first, then the arithmetic."],
      ["Fraction(0.1) prints 3602879701812225/36028797018963968 instead of 1/10","Passing a float into Fraction converts the binary approximation of 0.1 exactly, which is Module 7's floating-point story","Pass integers or strings: Fraction(1, 10) or Fraction('0.1'). Note what you saw; Lab 5 explains it."],
      ["NameError: name 'Fraction' is not defined or name 'math' is not defined","The import line is missing or misspelled","Add from fractions import Fraction and import math at the top of the file. In the #py page, imports must be in the same run as the code that uses them."],
      ["Your estimates are consistently 10× or 1,000× off in the same direction","A habit of dropping a power of ten, usually when converting k, M and G or seconds per day","Write the powers of ten as a separate column before multiplying: a day is about 10⁵ s (86,400), a year about 3 × 10⁷ s, 1 GB is 10⁹ B. Redo the three worst rows and look for the same slip."]
    ],
    challenge:"Extend units.py into a tiny command-line calculator that reads expressions like '50 GB at 300 Mb/s' or '12 kW for 1 year at 0.10/kWh' and prints the result with units, refusing (with an error message) any expression whose units do not cancel. Then add a --estimate flag that rounds every input to one significant figure first, and report how far the estimate lands from the exact answer for ten expressions of your own.",
    reflect:[
      "Why does the gap between SI and binary prefixes grow with each step, and what would the gap be at the yotta/yobi level (10²⁴ versus 2⁸⁰)?",
      "Your estimate and your exact calculation disagree by a factor of 8. Which kinds of mistakes produce a factor of exactly 8, 1,000 or 1,024, and what does that tell you about where to look?",
      "Why do successive percentage changes multiply instead of add, and how would you explain the difference between percent and percentage points to a manager reading a capacity report?"
    ]
  },
  "p48lab2":{
    time:"2–3 h",
    setup:[
      "A browser with Desmos (desmos.com/calculator, free, no account needed) for step 1.",
      "Python 3.12+ on your own machine with a virtual environment: python3 -m venv .venv, then source .venv/bin/activate (Windows: .venv\\Scripts\\activate), then python -m pip install numpy matplotlib. NumPy and Matplotlib are not preloaded in the app's in-browser Python, so do steps 2–5 locally.",
      "If you are on WSL2 or a machine without a display, plan to save figures with plt.savefig('name.png') instead of plt.show().",
      "Module 3 open for the PON example values (0 dBm launch, 20 km at 0.35 dB/km, 4 connectors at 0.5 dB, 1:32 splitter about 17 dB)."
    ],
    checkpoints:[
      "Desmos shows the parabola with sliders a, h and k; dragging h moves the vertex right as h increases; and 2^x, log_2(x) and y = x appear together with the two curves mirror images across the line.",
      "Two PNG files exist: on ordinary axes 2^n dwarfs everything above n ≈ 10; on the semilogy plot 2^n is a straight line and the polynomials bend over.",
      "The log-log timing plot shows insertion sort with a slope near 2 (doubling n multiplies time by about 4) and sorted() with a slope near 1, and sorted() is at least 100× faster at n = 8,000.",
      "loss_budget(0, 20, 0.35, 4, 0.5, 32, 2, -28) returns about −26 dBm received and about 2 dB of margin, matching your hand calculation (10 log₁₀ 32 = 15.05 dB plus the 2 dB excess).",
      "np.polyfit on month against ln(usage) gives a slope near 0.039, so a growth factor e^0.039 ≈ 1.04 per month, and the predicted time to 8 TB is close to 35 months."
    ],
    hints:[
      "In Desmos, typing a letter that is not x or y makes Desmos offer a slider for it. For the mirror picture, set equal x and y scales (the wrench menu) or the symmetry will look wrong.",
      "Use n = np.arange(1, 41) and np.log2(n). For timing, time each sort on a fresh copy of the list (sorted copies are a best case for insertion sort). The slope between two points on a log-log plot is (log t₂ − log t₁) / (log n₂ − log n₁).",
      "Exponential data becomes a straight line after taking logs: ln U = ln U₀ + t ln b. So np.polyfit(months, np.log(usage), 1) returns [ln b, ln U₀]. Solve U₀ b^t = 8 with logarithms, exactly as in Module 3's worked example."
    ],
    trouble:[
      ["error: externally-managed-environment when running pip install","Debian, Ubuntu 23.04+ and other distributions block pip from changing the system Python (PEP 668)","Create and activate a virtual environment first (python3 -m venv .venv; source .venv/bin/activate), then install inside it. Do not use --break-system-packages."],
      ["UserWarning: FigureCanvasAgg is non-interactive, and thus cannot be shown, and no window appears","No GUI backend is available (common on WSL2, SSH or servers)","Call plt.savefig('growth.png', dpi=150) and open the file. Diagnose first: print(matplotlib.get_backend()) shows 'agg' when there is no display."],
      ["ModuleNotFoundError: No module named 'numpy' even though you installed it","The script runs with a different Python than the one pip installed into (venv not activated, or VS Code using another interpreter)","Run python -c \"import sys; print(sys.executable)\" and compare with python -m pip --version. Always install with python -m pip so the same interpreter is used."],
      ["The 2^n curve makes every other curve look flat, or OverflowError appears","2^n at n = 40 is about 10¹², so a linear axis squashes everything; huge integers can overflow when mixed with floats","That squashing is the lesson: switch to plt.semilogy or limit the y-axis with plt.ylim(0, 2000). Use NumPy floats (2.0**n) for plotting."],
      ["Timing results jump around or show slope 0 for small n","Timer resolution, background processes and Python start-up noise dominate tiny inputs","Use time.perf_counter, take the best of 3 or 5 runs, and use n of at least 1,000. Close other heavy programs while timing."]
    ],
    challenge:"Replace insertion sort with three more algorithms of your choice (a quadratic bubble sort, your own merge sort, and Python's bisect-based insertion) and measure their slopes on the same log-log plot up to n = 32,000. Then predict, from the fitted slopes alone, how long each would take at n = 10⁶, run the fastest two to check the prediction, and explain any gap with Module 3's growth table.",
    reflect:[
      "Why do exponential curves become straight lines on a semilog plot, and polynomial curves become straight lines on a log-log plot? What does the slope mean in each case?",
      "Your fitted growth rate predicts 35 months to fill the volume. What would make that prediction wrong, and how would you present the uncertainty to someone ordering hardware?",
      "Why is it legitimate to add decibels for a fiber link when the physical losses multiply?"
    ]
  },
  "p48lab3":{
    time:"2–3 h",
    setup:[
      "The Python virtual environment from Lab 2 with NumPy and Matplotlib installed, or a fresh one (python3 -m venv .venv, activate, python -m pip install numpy matplotlib).",
      "Paper with a unit circle drawn on it (radius about 8 cm) for step 1; you will mark the eight angles by hand before checking them in code.",
      "Four short sentences prepared for step 4, for example: 'splice the fiber at the closure', 'clean and cleave the fiber before the splice', 'simmer the sauce in a pan', 'stir the pan and simmer the soup'. Write down which pairs you expect to be most similar before computing anything.",
      "Remember that NumPy's trig functions take radians: np.radians converts degrees."
    ],
    checkpoints:[
      "Your hand table and NumPy agree for all eight angles to three decimals (for example cos 120° = −0.5, sin 270° = −1), and np.cos(t)**2 + np.sin(t)**2 prints 1.0 for every angle (tiny differences such as 0.9999999999999999 are floating-point rounding).",
      "The plot shows the arrow and three rotated copies around the origin with equal axis scales, and the printed norms of every vertex are identical before and after rotation.",
      "The 1,000 Hz plot shows a smooth two-tone wave; the 20 Hz samples follow its shape, while the 10 Hz samples trace a different, slower wave, which is aliasing because 10 Hz is below the 14 Hz Nyquist rate.",
      "A 4 × 4 cosine-similarity matrix prints with 1.0 on the diagonal, your hand-computed pair matches the matrix entry to three decimals, and the two fiber sentences score higher with each other than with either cooking sentence.",
      "The lighting curve peaks at 1.0 when the normal points at the light (45°), falls like a cosine on either side, and is clamped at 0 for half the circle."
    ],
    hints:[
      "Sine is the y-coordinate and cosine the x-coordinate on the unit circle. Decide the sign from the quadrant before you look up the size from the special triangles (30-60-90 and 45-45-90).",
      "Store the shape as P = np.array([[x1, x2, ...], [y1, y2, ...]]) and build R = np.array([[c, -s], [s, c]]) with c = np.cos(t) and s = np.sin(t); then R @ P rotates every vertex at once. np.linalg.norm(P, axis=0) gives each vertex's distance from the origin.",
      "For similarity, build a vocabulary list, count each word per sentence into a vector, then cos = a @ b / (np.linalg.norm(a) * np.linalg.norm(b)). For the matrix, normalize each row to unit length first; then M @ M.T is the whole similarity matrix."
    ],
    trouble:[
      ["np.sin(90) prints 0.8939966636005579 instead of 1","NumPy and math work in radians, so this is the sine of 90 radians","Use np.sin(np.radians(90)) or np.sin(np.pi / 2). Check every trig call for degrees versus radians first; it is the most common bug in graphics and signal code."],
      ["The rotated arrow looks squashed or skewed, not rotated","Matplotlib's default aspect ratio stretches one axis, so circles and right angles look distorted","Call plt.gca().set_aspect('equal') or plt.axis('equal') before saving. Confirm with the norms: if they are unchanged, the math is right and only the display was distorted."],
      ["ValueError: matmul: Input operand 1 has a mismatch in its core dimension","The shape matrix is N × 2 (one row per point) while R expects 2 × N","Print P.shape. Either transpose with P.T, or rotate with P @ R.T when points are rows. Shape-checking before multiplying is the habit Domain 14 builds."],
      ["Cosine similarity returns nan or a RuntimeWarning: invalid value encountered","A sentence produced an all-zero vector (no vocabulary words), so its length is 0 and you divided by zero","Print the vectors. Add the missing words to the vocabulary or skip empty vectors; a zero vector has no direction, so its cosine similarity is undefined."]
    ],
    challenge:"Build a two-dimensional 'starship' that turns toward the mouse: compute the angle with np.arctan2, rotate the ship's polygon about its own center (subtract the center, rotate, add it back), and limit the turn rate to 5° per frame using the dot product and the sign of the 2-D cross product to decide which way to turn. Animate it with matplotlib.animation.FuncAnimation, or write the frames as PNGs, and explain why the cross product's sign tells you the turn direction.",
    reflect:[
      "Why is the rotation matrix guaranteed to preserve lengths? Show it with sin²θ + cos²θ = 1.",
      "Cosine similarity ignores vector length. When is that exactly what you want for comparing documents, and when could it mislead you?",
      "What would you change to sample the two-tone signal correctly, and what would you hear if an audio system aliased a 30 kHz tone sampled at 44.1 kHz?"
    ]
  },
  "p48lab4":{
    time:"2–3 h (two sessions work well: derivatives, then integrals)",
    setup:[
      "Python 3.12+ in a virtual environment with NumPy 2.x, Matplotlib and SciPy: python -m pip install numpy matplotlib scipy. Check with python -c \"import numpy, scipy; print(numpy.__version__, scipy.__version__)\".",
      "Paper derivatives for the five functions in step 1 written out before you open the editor; keep them beside you as the reference answers.",
      "For step 5, either a plug-in smart plug or energy meter you own that exports readings, or a large download you can monitor (record megabytes received every 5 seconds from your browser's or package manager's progress display). Do not open, rewire or modify any mains-powered device.",
      "A notebook or script file per step so the plots and tables are easy to collect for the deliverable."
    ],
    checkpoints:[
      "For all five functions, analytic and central-difference derivatives at x = 1 agree to at least 8 decimal places, and forward differences agree to about 4–5 (for example the sigmoid derivative σ(1)(1 − σ(1)) ≈ 0.196612).",
      "The log-log error plot shows the forward-difference error falling with slope about 1 and the central with slope about 2, until each turns back up; the smallest errors occur near h ≈ 10⁻⁸ (forward) and h ≈ 10⁻⁵ to 10⁻⁶ (central).",
      "The gradient check prints a relative difference below 10⁻⁷ between your analytic gradient (∂L/∂w, ∂L/∂b) and the central-difference gradient at two different (w, b) points.",
      "The integration table shows trapezoid errors shrinking by about 4× and Simpson errors by about 16× each time n doubles; Simpson on sin x over [0, π] with n = 64 is within about 10⁻⁷ of 2 (the trapezoid rule is still about 4 × 10⁻⁴ off).",
      "np.trapezoid on your real data gives a total in Wh or MB within a few percent of the device's own total or the file size, and you can explain the remaining difference (sampling interval, rounding, start and stop timing)."
    ],
    hints:[
      "Write one helper, central(f, x, h) = (f(x + h) − f(x − h)) / (2h), and one for forward differences, then loop over your functions. For the sigmoid, compute σ once and reuse it: σ′ = σ(1 − σ).",
      "Use hs = 10.0 ** -np.arange(1, 16) and plt.loglog(hs, errors). Two error sources compete: truncation error (shrinks as h shrinks) and rounding error from catastrophic cancellation (grows like ε/h). The minimum sits where they are equal.",
      "For mean squared error L = (1/n)Σ(wxᵢ + b − yᵢ)², the gradient is ∂L/∂w = (2/n)Σ(wxᵢ + b − yᵢ)xᵢ and ∂L/∂b = (2/n)Σ(wxᵢ + b − yᵢ). Relative difference = |g − g_num| / max(|g|, |g_num|). For integration, x = np.linspace(a, b, n + 1) gives n slices."
    ],
    trouble:[
      ["AttributeError: module 'numpy' has no attribute 'trapezoid'","NumPy older than 2.0, where the function was still called trapz","Upgrade with python -m pip install -U numpy, or use np.trapz on old versions. Check the version first: python -c \"import numpy; print(numpy.__version__)\"."],
      ["Simpson's rule gives the wrong answer or a warning about an odd number of intervals","Simpson's rule needs an even number of slices (an odd number of sample points); older SciPy versions also used the removed name simps","Use n = 4, 8, 16 … slices, so np.linspace(a, b, n + 1) points, and call scipy.integrate.simpson(y, x=x)."],
      ["The numerical derivative error gets worse as h gets smaller","Catastrophic cancellation: f(x + h) and f(x) agree in almost every digit, so their difference is mostly rounding noise","This is expected below h ≈ 10⁻⁸. Keep h around 10⁻⁵ to 10⁻⁶ for central differences in double precision, and read the error plot to find the minimum."],
      ["The gradient check fails by a large factor such as exactly 2 or exactly n","A missing factor of 2 from the square, or a sum where the loss uses a mean (or the reverse)","Check the loss and the gradient use the same definition. Test on a single data point by hand first, where you know the answer from Module 5's worked example."],
      ["The integrated energy is far below the meter's total","Missing samples (gaps in the log), wrong time units (minutes versus seconds), or the meter reports watt-hours already accumulated rather than watts","Plot the samples against time first and look for gaps; make sure t is in seconds before dividing joules by 3,600 to get Wh."]
    ],
    challenge:"Implement Richardson extrapolation: combine trapezoid results with spacing h and h/2 as (4T(h/2) − T(h))/3 and show that it reproduces Simpson's rule and its h⁴ error. Then apply the same idea to the central difference, (4D(h/2) − D(h))/3, measure the new error slope on your log-log plot, and explain why the improvement stops at a larger h than before.",
    reflect:[
      "Why does the central difference beat the forward difference for the same h, and why does making h smaller eventually make both worse?",
      "What does a passing gradient check prove about your backpropagation code, and what bugs could it still miss?",
      "Your real data was sampled every few seconds. How would doubling or halving the sampling interval change the trapezoid estimate, and how would you know which is closer to the truth?"
    ],
    safety:"Only measure power with a plug-in meter or smart plug used as designed. Never open, rewire or probe mains-powered equipment; that is a job for a licensed electrician."
  },
  "p48lab5":{
    time:"2–3 h",
    setup:[
      "Python 3.12+ in a virtual environment with NumPy, Matplotlib and SciPy (python -m pip install numpy matplotlib scipy). Steps 1, 3 (without brentq) and 4 (without np.finfo) also run in the app's in-browser Python at #py.",
      "The Lab 4 data points (0, 1), (1, 3), (2, 5.2), (3, 6.8), (4, 9.1) saved in a file or pasted into the script for step 2.",
      "Module 7 open for the reference numbers: the factor 1 − 2η, √2 iterates 1.5, 1.4166667, 1.4142157, the −6.5 encoding 0xC0D00000 and machine epsilon 2.22 × 10⁻¹⁶.",
      "Every loop gets a maximum iteration count from the start (500 for descent, 100 for Newton and bisection) so a divergent run stops by itself."
    ],
    checkpoints:[
      "A table lists the six learning rates: η = 0.01 is still about 1.2 × 10⁻⁴ away after 500 steps (it needs about 740), η = 0.1 needs about 67, η = 0.5 converges in one step, η = 0.9 converges while flipping sides each step, η = 1.0 oscillates between 0 and 6, and η = 1.1 diverges; each matches |1 − 2η| < 1.",
      "Gradient descent ends within 10⁻³ of np.polyfit's w and b for the same data, and the semilogy loss curve falls steadily before flattening at the least-squares minimum.",
      "Newton reaches 10⁻¹² in 4 or 5 iterations for both √a and cos x − x (root ≈ 0.7390851332), bisection needs about 40 iterations from [0, 1], and scipy.optimize.brentq returns the same root.",
      "The bit dump shows 0x3ff0000000000000 for 1.0 and 0x3fb999999999999a for 0.1, and 2.0**53 + 1 == 2.0**53 prints True; np.finfo shows eps of about 9.77e-04, 1.19e-07 and 2.22e-16 for float16, float32 and float64.",
      "The cancellation table shows the naive small root losing digits as b grows (wrong by about 25% at b = 10⁸) while the stable form stays accurate; a plain loop adding 0.1 a million times prints 100000.00000133288 while math.fsum gives 100000.0; and the naive variance of readings near 10⁹ comes out badly wrong (0.0 or even negative) while np.var gives the true small value."
    ],
    hints:[
      "For f(x) = (x − 3)² + 1 the update is x ← x − 2η(x − 3), so the error multiplies by (1 − 2η) every step. Predict each η's behavior from that one number before you run anything.",
      "Newton for √a: x ← (x + a/x)/2. For cos x − x: f′(x) = −sin x − 1. Bisection keeps whichever half-interval still has a sign change; count how many halvings shrink 1 to 10⁻¹² (log₂ 10¹² ≈ 40).",
      "struct.pack('>d', x).hex() shows the 64 bits in hex; float.hex(x) shows the significand and exponent in base 2. For the stable quadratic, compute x₁ = (−b − math.sqrt(b*b − 4*a*c))/(2*a) and then x₂ = c/(a*x₁)."
    ],
    trouble:[
      ["OverflowError: (34, 'Numerical result out of range') or values printing as inf or nan","A divergent learning rate (η = 1.1) or a Newton step from a point where f′ ≈ 0 grows the iterates past the double-precision limit (about 1.8 × 10³⁰⁸)","That is the expected failure. Stop the loop when |x| exceeds 10⁶ and record 'diverged'. For Newton, check f′ before dividing and fall back to bisection."],
      ["Gradient descent on the line fit creeps along or never matches np.polyfit","The learning rate is too small for the x values, or too large and the loss bounces","Plot the loss on a semilogy axis. A flat-but-falling curve means raise η; a jagged or rising one means lower it (start near 0.01 for this data). Diagnose from the curve's shape before changing the code."],
      ["struct.error: required argument is not a float","An integer was passed to struct.pack with format 'd' or 'f' in a context that expects a float, or the format string is wrong","Pass float(x), and use '>d' for doubles and '>f' for singles. The '>' sets big-endian so the hex reads in the same order as the IEEE layout."],
      ["sum([0.1] * 10) prints 1.0, not the 0.9999999999999999 the module describes","Since Python 3.12, the built-in sum uses compensated (Neumaier) summation for floats","Use an explicit loop (t = 0.0; for _ in range(10): t += 0.1) to see the plain rounding error, and compare it with sum and math.fsum. Your Python version changed the result, not the mathematics."]
    ],
    challenge:"Implement gradient descent with momentum (v ← βv + ∇f, x ← x − ηv) and compare it with plain descent on the narrow bowl f(x, y) = x² + 25y², plotting both paths over the contour lines. Then find the largest stable learning rate for plain descent from the bowl's curvature (it is set by the steep direction), show that momentum converges faster at the same η, and explain the zigzag you see in plain descent.",
    reflect:[
      "Why does Newton's method converge quadratically while gradient descent converges only linearly, and what does each one need to know about the function?",
      "Why can't 0.1 be stored exactly in binary, and why can 0.5 and 0.375? State the rule in terms of the denominator.",
      "When the quadratic formula fails in floating point, the algebra is still correct. What exactly goes wrong, and why does rearranging the formula fix it without adding precision?"
    ]
  }
});
