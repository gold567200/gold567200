/* Lab guides — Domain 52: Signals, Control Systems & Robotics */
window.LABX=window.LABX||{};
Object.assign(window.LABX,{
  "p52lab1":{
    time:"2–3 h",
    setup:[
      "A computer with a microphone (built-in, USB or headset) and Python 3.11 or newer. On Ubuntu 24.04 or 26.04 system pip is locked (PEP 668), so create a virtual environment: python3 -m venv ~/dsp, then source ~/dsp/bin/activate and pip install numpy scipy matplotlib sounddevice. On Linux also install PortAudio with sudo apt install libportaudio2.",
      "A phone or second device with a free tone-generator app for 1 kHz and 5 kHz test tones, and Audacity (audacityteam.org) as an independent cross-check of levels and spectrograms.",
      "Work in a Jupyter notebook (pip install notebook) or a script that saves every plot to a file, and keep the raw WAV files so every number you report can be reproduced.",
      "On WSL2, record on the Windows side (native Windows Python or Audacity) and load the WAV inside WSL: microphone access from WSL is unreliable."
    ],
    checkpoints:[
      "python -m sounddevice lists your microphone with at least one input channel; the saved WAV plays back your voice and the tone, and loading it gives 240,000 samples at 48,000 Hz (5 s, mono).",
      "Your waveform plot runs from 0 to 5 s on its time axis, and you have three numbers written down: the peak in dBFS (negative, for example −9.5), the silent-segment rms in dBFS (typically −60 to −90) and the SNR in dB (typically 30–55).",
      "The Hann-windowed spectrum shows the test tone as a narrow peak within 1 Hz of 1,000 Hz at about the level you expect; you can point to the noise floor and any 60/120/180 Hz lines, and the unwindowed version shows visibly wider skirts around the tone.",
      "A table lists for 12, 8 and 6 bits the predicted full-scale SQNR (74.0, 49.9 and 37.9 dB), the measured noise floor (near −77, −53 and −41 dBFS) and the resulting SNR of your speech, and the 8-bit file audibly hisses.",
      "The naive x[::6] spectrum has a peak near 3 kHz (|5 − 8| kHz) that is absent from the decimate() version, and the two spectrograms show the difference over time."
    ],
    hints:[
      "Everything in this lab is a ratio. Convert every level to decibels relative to the same reference (full scale = 1.0 for float audio) before you compare anything, and choose your silent segment by looking at the waveform plot, not by guessing times.",
      "Peak dBFS is 20*log10(np.max(np.abs(x))) and rms is np.sqrt(np.mean(seg**2)). For the spectrum, multiply by signal.windows.hann(len(x)) before np.fft.rfft and scale by 2/w.sum(). Requantize to N bits with q = np.round(x * 2**(N-1)) / 2**(N-1), clipped to the range [−1, 1).",
      "For aliasing the arithmetic is the hint: after x[::6] the rate is 8 kHz, its Nyquist frequency is 4 kHz, so a 5 kHz tone must land at |5 − 8| = 3 kHz. If you see nothing, first confirm the tone really is at 5 kHz in the 48 kHz spectrum, then use a spectrogram with segments of about 1,024 samples."
    ],
    trouble:[
      ["OSError: PortAudio library not found when importing sounddevice","The PortAudio shared library is missing on Linux","Install it with sudo apt install libportaudio2 and import again; on Windows and macOS the pip wheel already bundles it."],
      ["The recording is all zeros or a flat line","Wrong input device, a muted microphone, or the operating system denied microphone permission","Run python -m sounddevice, pass device=N to sd.rec for your microphone's index, call sd.wait() before using the array, and check the OS privacy settings for microphone access."],
      ["The spectrum is dominated by one huge spike at 0 Hz","The DC offset (the mean) was not removed, so bin 0 holds the average value","Subtract x.mean() before windowing, and plot from 10 Hz upward on a logarithmic frequency axis."],
      ["Measured SNR is far below what the bit depth predicts","Analog noise from the room, the microphone preamp or a ground loop dominates; quantization is not your limit","Diagnose before fixing: record with the microphone covered or unplugged and measure that floor. If it barely changes the noise is electrical (try another USB port, unplug the charger); if it drops, it is acoustic."],
      ["Peaks read 0 dBFS and the waveform has flat tops","Clipping: the input gain is too high","Lower the input gain in the OS mixer until speech peaks near −12 dBFS and record again; clipped samples cannot be repaired afterwards."]
    ],
    challenge:"Measure your audio interface's real performance instead of trusting its label. Loop its output to its input with a cable (or play a pure 1 kHz tone into the microphone in a quiet room), record 10 s at 48 kHz in 24-bit, and compute SINAD from a flat-top-windowed spectrum: tone power against everything else. Convert it to ENOB = (SINAD − 1.76)/6.02, compare that with the advertised bit depth, then repeat at 44.1 kHz and explain any change in the noise floor.",
    reflect:[
      "Why can no software step remove the 3 kHz alias from the x[::6] signal, while decimate() never lets it in? What exactly does decimate do first?",
      "Your 16-bit recording reached only about 40–50 dB of SNR. Which link in the chain set that limit, and what single change would improve it most?",
      "Why did the unwindowed spectrum show wide skirts around a pure tone, and why did the Hann window make the peak slightly wider rather than taller?"
    ]
  },
  "p52lab2":{
    time:"2–3 h",
    setup:[
      "The Python environment from Lab 1 (numpy, scipy, matplotlib) with a recent SciPy release so the filter functions accept fs= in hertz; check it with python -c 'import scipy; print(scipy.__version__)'.",
      "A notebook with a fixed random seed (rng = np.random.default_rng(1)) so your noise is reproducible and your table matches from run to run.",
      "Optional: the WAV files from Lab 1, so you can repeat the notch and low-pass experiments on real mains hum at 48 kHz."
    ],
    checkpoints:[
      "Your test-signal plot shows the slow sine and the step under visible fuzz and a 60 Hz ripple; its measured noise rms is 25 mV (0.025) and the hum amplitude 40 mV, within a few percent.",
      "For M = 5, 20 and 50 the residual white-noise rms falls roughly as 25/√M mV (about 11.2, 5.6 and 3.5 mV); the freqz plots show nulls at multiples of 50 Hz for M = 20 and of 20 Hz for M = 50, so only M = 50 removes 60 Hz.",
      "One figure shows three magnitude curves in dB: the Butterworth crossing −3 dB at 15 Hz and near −48 dB at 60 Hz, the firwin(131, 15, fs=1000) filter crossing −6 dB at 15 Hz, and the notch dipping sharply at 60 Hz with a bottom about 2 Hz wide (Q = 30).",
      "Your table gives delays close to theory: about 28 ms for the causal 4th-order Butterworth, 65 samples (65 ms) for the 131-tap FIR, 24.5 ms for the 50-point average, and essentially zero for every filtfilt version.",
      "You name one filter for the 100 Hz loop with a reason based on delay, and the 10th-order 5 Hz 'ba' version's output grows to enormous values while the 'sos' version settles at 1.0 as designed."
    ],
    hints:[
      "Separate the three goals before touching code: what must pass (the slow signal, below a few hertz), what must go (60 Hz and broadband noise), and what you can afford (delay inside a 10 ms loop period). Every column in your table should answer one of those.",
      "Use the same tools for every filter so the numbers are comparable: signal.sosfreqz or signal.freqz with worN and fs for responses, signal.group_delay at a low frequency for delay, and the standard deviation of (output − clean signal) after the start-up transient for residual noise.",
      "The control-loop answer hinges on delay, not on the last millivolt of noise. Express each filter's low-frequency delay in loop periods (delay divided by 10 ms); a 60 Hz notch followed by a low-order low-pass set a few times above the needed bandwidth usually wins."
    ],
    trouble:[
      ["ValueError: Digital filter critical frequencies must be 0 < Wn < 1","The cutoff was passed in hertz without fs=, so SciPy read 15 as a normalized frequency","Pass fs=1000 to butter, firwin and iirnotch, or normalize the cutoff yourself by dividing it by fs/2."],
      ["The filtered output starts with a big spike or a slow ramp","Start-up transient: the filter's internal state begins at zero while the signal does not","Exclude the first few time constants from your measurements, or initialize the state with signal.sosfilt_zi(sos) * x[0]; sosfiltfilt pads the ends for you."],
      ["The filtered signal looks perfect but lags the input on the plot","Causal filters delay the signal; you are seeing their group delay","Measure it instead of hiding it: cross-correlate input and output or use signal.group_delay. Only filtfilt removes it, and only offline."],
      ["The notch barely changes the hum","The hum is not exactly at the notch frequency, or Q is so high that the notch is narrower than the hum's frequency error","Measure the hum's true frequency from a long FFT, center the notch on it, and lower Q (for example to 10) to widen the notch."]
    ],
    challenge:"Implement your chosen filter the way a microcontroller would run it: write the biquad (second-order section) difference equations yourself in a plain Python loop, one sample at a time, in float32 only (np.float32), and verify the output matches signal.sosfilt to within 1e-5. Then round the coefficients to 16-bit fixed point (Q15), measure how far the frequency response moves, and find the lowest cutoff at which your 4th-order design still behaves.",
    reflect:[
      "Why is a moving average such a good smoother of steps but such a poor way to separate 60 Hz from 70 Hz?",
      "Why does running a filter forward and then backward cancel its phase shift, and why does that make it unusable inside a live control loop?",
      "The 'ba' and 'sos' versions describe the same mathematical filter. What changed numerically between them, and why does it matter more at low cutoffs and high orders?"
    ]
  },
  "p52lab3":{
    time:"3–4 h, plus 2–3 h for the optional hardware step",
    setup:[
      "The Python environment from Labs 1–2 plus python-control: pip install control, then check it with python -c 'import control; print(control.__version__)'.",
      "A notebook with one function that runs a closed-loop simulation and returns arrays of t, r, y and u, so every experiment is one call with different settings and every plot shows the command u as well as the speed y.",
      "Optional hardware: an Arduino Uno or Nano, or an ESP32 board; a small 6–12 V DC gearmotor with a quadrature encoder; a TB6612FNG or DRV8833 driver board; a separate motor supply (a current-limited bench supply, or a battery pack with an inline fuse); a toggle switch in the motor supply line as an emergency stop; and Arduino IDE 2.x with your board's package installed.",
      "Before any firmware runs, clamp the motor to the bench (vise, or cable ties to a board) with nothing on the shaft except, optionally, a light wheel with no loose parts."
    ],
    checkpoints:[
      "The simulated open-loop step to 1 V reaches 316 rpm (63.2% of 500) at t = 0.12 s and 98% of 500 rpm by about 0.48 s, matching both the formula and control.step_response.",
      "Your metrics table shows P-only with Kp = 0.008 settling 20% short (1,600 rpm for a 2,000 rpm setpoint), PI reaching 2,000 rpm with no steady-state error, and rise time, overshoot and 2% settling time filled in for P, PI and PID.",
      "At T = 1 ms with the 10 ms delay you show a run whose oscillation neither grows nor decays, with Ku near 0.037 V/rpm and Tu near 41 ms for the reference plant; the raw Ziegler–Nichols PID overshoots around 60–65%, and your detuned set stays under 10%.",
      "Three labeled pairs of plots: windup (roughly 15–20% overshoot on the 5,000 rpm step without anti-windup, none with it), kick (a one-sample spike in u with the derivative on the error that disappears with the derivative on the measurement), and noise (a ragged u that smooths when the derivative filter is on).",
      "After the 1 V-equivalent load at t = 1 s the P-only speed drops and stays about 100 rpm lower, while the PI speed dips to roughly 1,920 rpm and returns to 2,000 rpm within about a quarter of a second.",
      "Optional hardware: the plotted serial log shows the real motor following a speed step with a shape close to your simulation once you have re-identified K and τ for that motor, and flipping the e-stop switch cuts motor power while the microcontroller keeps running."
    ],
    hints:[
      "Build and trust the plant before the controller. The exact discrete update y = a·y + (1 − a)·K·u with a = exp(−T/τ) is stable at any sample time, unlike a naive Euler step. Verify the open-loop numbers first, so every later bug is known to be in your controller.",
      "Log the unsaturated command and the clamped command separately at every step: windup and kick are invisible in y until it is too late but obvious in u. For the transport delay, keep the last ten commands in a collections.deque and apply the oldest one.",
      "For Ziegler–Nichols, bracket Ku by halving the interval between a gain whose oscillation decays and one whose oscillation grows, with I and D at zero and a small setpoint step (100 rpm) so saturation never hides the oscillation. Tu is the time between successive peaks; then Kp = 0.6Ku, Ti = Tu/2, Td = Tu/8, and detune by lowering Kp and lengthening Ti toward the plant's τ."
    ],
    trouble:[
      ["The simulated loop explodes to huge numbers within a few steps","A forward-Euler plant update with T too large for τ, or a sign error in e = r − y","Use the exact discrete update with a = exp(−T/τ), and print e, u and y for the first five steps to confirm the controller pushes in the right direction."],
      ["PI never quite reaches the setpoint even though Ki > 0","The integrator is never updated (the anti-windup condition is always false) or Ki·T is so small it needs minutes","Print the integrator every step, test the clamping condition with the actuator unsaturated, and confirm Ki = Kp/Ti in consistent units (V per rpm per second)."],
      ["The Ziegler–Nichols gains make the loop wildly oscillatory","ZN aims for quarter-amplitude decay, and saturation or noise during the test can distort Ku","Detune Kp by 30–50% and lengthen Ti; repeat the Ku test with a smaller step so the actuator never saturates."],
      ["Hardware: the motor runs flat out in one direction whatever the setpoint","Encoder channels or motor leads are swapped, so the feedback is positive","Hit the e-stop first. Command a small open-loop PWM and check that the encoder count increases; if it decreases, swap A and B or invert the sign in software, and retest open loop before closing the loop."],
      ["Hardware: the board resets or USB disconnects when the motor starts","Motor current spikes sag the logic supply or inject noise through a shared ground return","Power the motor from its own supply, join the grounds at one point, add a bulk capacitor (100–470 µF) across the motor supply at the driver, and never power the motor from the USB 5 V pin."]
    ],
    challenge:"Build a cascade on the simulated motor: add an integrator so the plant also has a shaft angle, wrap a P or PD position loop at 100 Hz around your 200 Hz PI speed loop, tune the inner loop first and the outer loop at least five times slower, and compare step responses with and without feedforward of the commanded speed. Then implement relay autotuning on the speed loop — a relay of amplitude d driving the plant — and compare the Ku = 4d/(πa) it produces with the value you found by searching.",
    reflect:[
      "Why does the integral term remove steady-state error and yet make overshoot more likely? Explain it in terms of what the integrator stores.",
      "A first-order plant under pure proportional control cannot oscillate, which is why you needed the 10 ms delay. What does that tell you about where oscillation in real plants comes from?",
      "If your hardware response differs from the simulation, which plant parameters would you re-identify first, and exactly how would you measure them?"
    ],
    safety:"The optional hardware step involves a spinning motor and a power supply. Use a current-limited bench supply or a fused battery pack, never USB power for the motor and never a mains circuit you built yourself. Clamp the motor down, keep fingers, hair, sleeves and cables clear of the shaft, and wear eye protection. Wire a physical switch in the motor supply as an emergency stop and test it before you close the loop; assume the first run will go full speed the wrong way. Lithium packs need their proper charger and a fire-safe bag, and must never charge unattended (Domain 23)."
  },
  "p52lab4":{
    time:"3–4 h",
    setup:[
      "The Python environment from earlier labs (numpy and matplotlib; scipy optional). For the animation use matplotlib.animation.FuncAnimation and save a GIF with Pillow (pip install pillow).",
      "A module file (for example robokit.py) for your functions and a test file you run with pytest (pip install pytest), so the round-trip test reruns every time you change the code.",
      "Paper and pencil: sketch the arm, the angles and the frames before coding. Most kinematics bugs are sign or angle-convention errors that a two-minute sketch catches."
    ],
    checkpoints:[
      "fk(30°, 45°) returns (0.3116, 0.3432) to four decimals; pytest reports the 1,000-pose round-trip test passing for both elbow choices with errors below 1e-9; and ik on (0.6, 0) raises an error or returns None rather than nan.",
      "The animation (or a strip of saved frames) shows the hand moving along a straight line while the joints move nonlinearly, and the joint-speed plot spikes near the start of the line, where θ2 is smallest and the arm is nearly straight.",
      "Your transform helpers pass simple tests — invert(T) @ T is the identity, and the lecture's laser point (1.0, 0) with the robot at (2, 1, 90°) and a 0.2 m mount comes out at (2.0, 2.2) — and the world-frame scan plot shows straight walls staying straight while the robot turns.",
      "The Kalman plot shows the estimate inside its ±2σ band about 95% of the time, the band shrinking at each 1 Hz measurement and widening between them, and the steady-state P just before and after updates matching the hand calculation (for Q = 0.0004 and R = 0.0025: about 0.0057 and 0.0017 m²).",
      "With Q ten times too small the estimate lags and leaves its too-narrow band; with R ten times too small it chases every noisy measurement; and the complementary-filter tilt stays within a degree or two of truth while the integrated gyro alone drifts steadily away."
    ],
    hints:[
      "Fix your conventions on paper first (θ1 from the x-axis, θ2 relative to link 1, radians inside the code) and test the cases you can do in your head: (0, 0) gives (0.5, 0); (90°, 0) gives (0, 0.5); (0, 90°) gives (0.3, 0.2).",
      "Inverse kinematics: c2 = (x² + y² − L1² − L2²)/(2·L1·L2); reject |c2| > 1; s2 = ±√(1 − c2²) for the two elbows; θ2 = atan2(s2, c2); θ1 = atan2(y, x) − atan2(L2·s2, L1 + L2·c2). Compare angles by their wrapped difference, not by plain subtraction.",
      "Keep the Kalman filter scalar: every step predict x += v·dt and P += Q; only when a measurement arrives compute K = P/(P + R), x += K·(z − x), P *= (1 − K). Plot ±2√P, not ±2P. For tilt, θ = α·(θ + ω·dt) + (1 − α)·atan2(ay, az) with α = τ/(τ + dt)."
    ],
    trouble:[
      ["IK returns nan for points that should be reachable","Rounding pushes c2 just above 1 at the edge of the workspace, so the square root of a negative number fails","After the reachability check, clip with np.clip(c2, -1, 1), and use atan2 with s2 rather than arccos alone."],
      ["The round-trip test fails only for some poses, with angles off by 360°","Angle wrapping: the same pose is described by angles that differ by 2π","Compare wrapped differences, for example np.angle(np.exp(1j*(a - b))), or compare forward-kinematics positions instead of raw angles."],
      ["Transformed lidar points smear or rotate the wrong way when the robot turns","The rotation has the wrong sign or the operations are in the wrong order (translating before rotating)","Test one known point with a 90° heading, compose as T_world_base @ T_base_laser, and check that R(θ) has −sin θ in its top-right entry."],
      ["The Kalman estimate is smooth but always behind the truth","Q is too small, so the filter trusts its motion model more than reality and discounts the measurements","Raise Q until the estimate stays inside its band, and check that the normalized innovation (z − x)/√(P + R) has roughly unit variance."]
    ],
    challenge:"Extend the Kalman filter to two states, position and velocity, with F = [[1, dt], [0, 1]] and a process-noise matrix for random acceleration, so the filter estimates a speed it never measures. Inject occasional outliers (1% of readings off by 2 m) and add an innovation gate that rejects any measurement whose normalized innovation exceeds 3. Compare position and velocity errors with and without the gate, and explain why gating is how real robots survive glass and reflections in their lidar data.",
    reflect:[
      "Why does a two-link arm have two inverse-kinematics solutions but only one forward-kinematics answer, and what happens to the two solutions at the edge of the workspace?",
      "What does Q represent physically in your experiment, and why did making it too small make the filter worse rather than smoother?",
      "On an accelerating robot, what goes wrong with tilt from the gyro alone, and what goes wrong with the accelerometer alone? Why does the complementary filter fix both?"
    ]
  },
  "p52lab5":{
    time:"two sessions of 2–3 h",
    setup:[
      "Ubuntu 26.04 for ROS 2 Lyrical Luth (LTS to May 2031), or Ubuntu 24.04 for Jazzy Jalisco (LTS to May 2029) — installed natively, in a VM with 4 or more cores, 8 GB of RAM and 3D acceleration, or under WSL2 on Windows 11, whose WSLg shows GUI windows (wsl --list --online shows which Ubuntu versions are offered). Take a VM snapshot before installing.",
      "Follow the official ROS 2 'Ubuntu (deb packages)' install page for your distribution: enable the Universe repository, install the ros2-apt-source package that configures the ROS apt repository and its key, then sudo apt install ros-lyrical-desktop (or ros-jazzy-desktop) and python3-colcon-common-extensions.",
      "Add source /opt/ros/<distro>/setup.bash to ~/.bashrc, and set export ROS_DOMAIN_ID=42 (any value from 0 to 101) and export ROS_AUTOMATIC_DISCOVERY_RANGE=LOCALHOST so your nodes never mix with anyone else's on the network.",
      "A workspace (mkdir -p ~/ros2_ws/src) with Git initialized in src for your package; later install ros-<distro>-turtle-tf2-py, ros-<distro>-ros-gz and the Gazebo demos with apt."
    ],
    checkpoints:[
      "echo $ROS_DISTRO prints lyrical (or jazzy); ros2 run demo_nodes_cpp talker in one terminal and ros2 run demo_nodes_py listener in another show 'Publishing: Hello World: N' and 'I heard: [Hello World: N]' with matching numbers.",
      "rqt_graph shows /turtlesim and /teleop_turtle joined by /turtle1/cmd_vel; ros2 topic hz /turtle1/pose reports roughly 60 Hz; ros2 service call /spawn creates turtle2; ros2 bag info lists /turtle1/pose with a message count, and ros2 bag play makes ros2 topic echo print poses again.",
      "colcon build ends with a summary of 1 package finished; after sourcing install/setup.bash your node drives the turtle to within 0.1 of the goal (for example x = 8.0, y = 3.0) and stops, instead of circling forever.",
      "tf2_echo turtle2 turtle1 prints a translation that changes as you drive turtle1, and view_frames writes a PDF showing world, turtle1 and turtle2 plus your static sensor frame under turtle1.",
      "Gazebo shows the robot moving when you publish to the bridged velocity topic, ros2 topic echo on the odometry topic shows changing poses, and after a few laps you record how far odometry and Gazebo's ground truth disagree, with a sentence on why that gap is smaller in simulation than on real floors.",
      "Killing your controller with Ctrl+C stops the robot within about 0.5 s, and ros2 topic echo on the command topic shows the watchdog's zero-velocity messages."
    ],
    hints:[
      "Debug the graph before the code: ros2 node list, ros2 topic list -t and ros2 topic info -v tell you who publishes what, with which type and QoS. A node missing from the list is not running; a topic with a publisher and no subscriber means a name or namespace is wrong.",
      "Go-to-goal: distance d = hypot(gx − x, gy − y); desired heading φ = atan2(gy − y, gx − x); heading error e = atan2(sin(φ − θ), cos(φ − θ)) so it wraps correctly. Command angular.z = k_ang·e and linear.x = k_lin·d, drive forward only when |e| is small, clamp both, and publish zero once d < 0.1.",
      "The Gazebo bridge syntax is ros2 run ros_gz_bridge parameter_bridge /topic@ros_type@gz_type, where @ is two-way and ] or [ make it one-way; every ROS node needs -p use_sim_time:=true. For the watchdog, store the time of the last command and run a 10 Hz timer that publishes zero velocity whenever more than 0.5 s has passed."
    ],
    trouble:[
      ["ros2: command not found, or Package 'turtlesim' not found","The ROS setup script was not sourced in this terminal","Run source /opt/ros/<distro>/setup.bash (and source install/setup.bash for your own workspace) in every new terminal, or put the first line in ~/.bashrc."],
      ["Two terminals cannot see each other's nodes, or you see someone else's topics","Different ROS_DOMAIN_ID or discovery settings, or a firewall blocking multicast","Use the same ROS_DOMAIN_ID in every terminal, keep ROS_AUTOMATIC_DISCOVERY_RANGE=LOCALHOST while learning, and run ros2 doctor --report to check the network setup."],
      ["The package builds but ros2 run says No executable found","The node is missing from entry_points in setup.py, or install/setup.bash was not sourced after building","Add the node under console_scripts in setup.py, rebuild with colcon build --symlink-install, and source the workspace overlay again."],
      ["Gazebo opens a black window or crawls, often in a VM or WSL2","No GPU acceleration for OpenGL rendering","Enable 3D acceleration in the VM, run wsl --update and update GPU drivers, or run the server headless with gz sim -s and watch in RViz; simplify the world and sensors."],
      ["The simulated robot ignores your velocity commands","Bridge topic or message-type mismatch, or the robot listens on a different topic than you publish to","ros2 topic info -v on your command topic must list the bridge as a subscriber; compare names with gz topic -l and check the message types on both sides."]
    ],
    challenge:"Replace proportional go-to-goal with your own planner: build an occupancy grid of the turtlesim world with a few rectangular no-go zones, run your A* (octile heuristic) from the turtle's pose to a goal, publish the result as nav_msgs/msg/Path so RViz can draw it, and follow it waypoint by waypoint. Measure planning time and expansions against Dijkstra; as a stretch, bring up Nav2's TurtleBot simulation for your distribution and compare its planned path with yours.",
    reflect:[
      "Why does ROS 2 provide topics, services and actions instead of one mechanism? Name a place in this lab where using the wrong one would have caused a real problem.",
      "Your watchdog lives in a ROS node. Why is that still not a safety device, and what would you add before running the same code on a physical robot?",
      "Why does use_sim_time matter, and what kinds of bugs appear when one node runs on wall-clock time while the others follow the simulator?"
    ],
    safety:"This lab is simulation only, but ROS 2 discovery reaches the whole network by default. Keep ROS_AUTOMATIC_DISCOVERY_RANGE=LOCALHOST (or work on an isolated network) so you can never publish commands to someone else's robot, and connect only to robots and networks you own or are explicitly authorized to use."
  }
});
