/* Lab guides — Domain 51: Parallel Computing, HPC & GPU Programming */
window.LABX=window.LABX||{};
Object.assign(window.LABX,{
  "p51lab1":{
    time:"2–3 h",
    setup:[
      "Your RTX 5090 laptop on AC power in the Windows best-performance power mode, with WSL2 Ubuntu 24.04 (or native Linux) and the basics installed: sudo apt install build-essential hwloc python3-matplotlib. Close games, browsers and anything else that uses the GPU.",
      "The CUDA 13.x toolkit inside WSL2 as set up in Module 6 (the Windows driver on the Windows side, the toolkit-only package inside WSL). Check nvcc --version and nvidia-smi before you start. No NVIDIA GPU: do the CPU half here and the GPU half in a Google Colab GPU runtime.",
      "STREAM: download stream.c from John McCalpin's official STREAM page into a fresh directory; it is one C file with no dependencies.",
      "A lab notebook file (lab1.md) for every command, number, clock and temperature you record. Theory and measurement go side by side."
    ],
    checkpoints:[
      "A hardware sheet lists P-cores, E-cores and threads from lscpu, the DDR5 speed (for example 5600 MT/s), the GPU power limit and PCIe link from nvidia-smi -q, and three computed numbers: DRAM peak (2 × 8 × 5600 = 89.6 GB/s), GPU FP32 peak (about 45 TFLOP/s at 2.16 GHz) and both ridge points.",
      "STREAM prints 'Solution Validates' for every run, and your table shows Triad bandwidth rising with threads and then flattening, typically at 70–85% of the theoretical DRAM peak, somewhere between 4 and 12 threads.",
      "gpu_bw reports a device-to-device copy bandwidth that is a large fraction of 896 GB/s (roughly 75–90%), pinned host-to-device copies clearly faster than pageable ones, and PCIe numbers consistent with the link generation and width nvidia-smi reported.",
      "The FMA kernel reports tens of TFLOP/s (compare with 10,496 × 2 × your logged SM clock), the CPU loop reports hundreds of GFLOP/s up to about a TFLOP/s, and the nvidia-smi log shows clocks and power during the run.",
      "Two log–log roofline plots exist with four measured kernels each, every point at or below its roof; the Amdahl table shows measured speedups at or below 1/(0.05 + 0.95/N) and a Karp–Flatt column close to 0.05."
    ],
    hints:[
      "Keep theory and measurement next to each other for every number. A measurement that beats its theoretical peak means the theory used the wrong clock or the timer missed work — never that you found free performance.",
      "Make the CPU FMA loop compute-bound: eight or more independent accumulators to hide FMA latency, data small enough to stay in L1, and -O3 -march=native so the compiler emits vfmadd instructions (check with objdump -d | grep vfmadd). On the GPU, keep the accumulators in registers and write one result per thread at the end so the compiler cannot delete the loop.",
      "Attainable = min(peak, bandwidth × I). Compute I by hand for each kernel (SAXPY 2 FLOP per 12 B, dot product 2 per 8, 3×3 filter 18 per 8, naive matmul from its global traffic), plot measured GFLOP/s at that I, and draw the roofs from your measured STREAM and copy bandwidths and your measured FMA peak, not from the datasheet."
    ],
    trouble:[
      ["STREAM reports bandwidth far above the DRAM peak","The arrays fit in cache, so you measured L3 instead of DRAM","Make each array at least four times all caches combined; -DSTREAM_ARRAY_SIZE=200000000 (1.6 GB per array) is safe with 64 GB of RAM."],
      ["nvidia-smi: command not found inside WSL, or CUDA reports no device","The Windows NVIDIA driver is old or missing, or a Linux driver installed inside WSL broke the passthrough","Update the Windows driver, run wsl --update, remove any nvidia-driver packages inside WSL, and check that /usr/lib/wsl/lib contains libcuda.so."],
      ["GPU numbers swing by 20–30% between runs","The laptop changes clocks with temperature and power limits, or Windows is on a battery power plan","Plug in, choose the performance mode, warm up for 10 seconds before timing, log clocks.sm and power.draw, and report the median of 20 runs."],
      ["The FMA microbenchmark reports an impossible or near-zero TFLOP/s","The compiler removed the loop because its result is unused, or a single dependency chain serialized it","Store the accumulators to memory at the end, use several independent accumulators, and inspect the machine code with cuobjdump -sass to confirm the FFMA instructions are present."],
      ["STREAM stops improving at 8–10 threads","That is expected: DRAM bandwidth saturates long before every core is busy","Record the saturation point — it tells you how many threads a memory-bound loop needs. Diagnostic habit: before blaming the code, compare it with the hardware ceiling."]
    ],
    challenge:"Add the cache roofs. Run the GPU copy kernel on working sets from 1 MB to 1 GB, plot bandwidth against size and find where it drops from L2 speed to GDDR7 speed — it should sit near the L2 capacity deviceQuery reports. Repeat on the CPU with STREAM array sizes from 1 MB to 2 GB to expose L2, L3 and DRAM, and draw a hierarchical roofline for each processor.",
    reflect:[
      "Why does a memory-bound kernel gain nothing from more threads once STREAM saturates, and what would you change in the kernel instead?",
      "Your measured GPU peak is below 10,496 × 2 × 2.16 GHz. Which physical limits of a laptop explain the gap, and how would a desktop RTX 5090 differ?",
      "With ridge points near 50 FLOP/B (GPU) and 17 FLOP/B (CPU), which programs from earlier domains would benefit from a GPU port, and which would not?"
    ],
    safety:"Long full-power runs heat a gaming laptop quickly: keep the vents clear, use it on a hard surface rather than a bed or lap, and stop if the GPU temperature stays pinned at its limit."
  },
  "p51lab2":{
    time:"2–3 h",
    setup:[
      "WSL2 Ubuntu 24.04 or native Linux with both compilers and LLVM's OpenMP runtime: sudo apt install build-essential clang libomp-dev. perf is optional — on WSL2 it is often unavailable, so do the perf c2c step on native Linux if you can.",
      "Know your core layout before you start: lscpu and lscpu -e list every logical CPU; the MAXMHZ column usually separates P-cores from E-cores, and the CORE column shows which logical CPUs are Hyper-Threading siblings.",
      "Laptop on AC power, performance mode, nothing else running. Write a tiny harness that runs each configuration once to warm up, then five times, and records the median.",
      "A Git repository for the lab so every variant (racy, reduction, critical, padded, local) is a commit you can return to."
    ],
    checkpoints:[
      "Serial π prints 3.141592653590 to about 12 digits and the Mandelbrot writes an image or checksum; both have a median time from five runs in your notes.",
      "The racy version prints different wrong values on repeated runs; the TSan build prints 'WARNING: ThreadSanitizer: data race' pointing at the sum line; the reduction version is correct and fast; the critical version is correct and far slower than serial.",
      "A schedule-by-threads table for four schedules and six thread counts, with a plot in which dynamic or guided clearly beats static at 16–24 threads, plus a measured E-core to P-core speed ratio from taskset runs.",
      "Three timings for the counter experiment in which the packed array is markedly slower than the padded and local versions; if perf is available, perf c2c report lists the counters' cache line with heavy HITM counts.",
      "Strong- and weak-scaling plots with labeled axes, a Karp–Flatt column for the strong-scaling points, and one paragraph per curve naming its limiting effect."
    ],
    hints:[
      "Run the racy program at least ten times before fixing anything. A value that changes from run to run is the evidence of a race; a single wrong number could be a bug of another kind.",
      "Mandelbrot rows through the middle of the set are expensive and rows at the top and bottom are cheap, so static blocks are unequal even on identical cores. The P/E effect comes on top: with OMP_PLACES=cores and OMP_PROC_BIND=close, threads fill cores in numbering order, so check with lscpu -e which logical CPUs come first.",
      "long count[24] puts eight counters in each 64-byte line. Declare typedef struct { _Alignas(64) long v; } padded; padded count[24]; and confirm sizeof(padded) == 64. The local-variable version should win because the counter stays in a register until one final store. Karp–Flatt: e = (1/S − 1/N)/(1 − 1/N)."
    ],
    trouble:[
      ["clang: 'omp.h' file not found, or the link fails with undefined omp_ symbols","LLVM's OpenMP runtime (libomp) is not installed for your clang","sudo apt install libomp-dev (or the versioned libomp-NN-dev matching clang --version), then rebuild with clang -fopenmp."],
      ["ThreadSanitizer reports races inside libgomp even in correct code, or aborts with 'unexpected memory mapping'","GCC's libgomp is not instrumented for TSan, or TSan's runtime conflicts with the kernel's address-space randomization","Use clang with LLVM's libomp for the TSan step; if it aborts on the memory mapping, run that binary under setarch $(uname -m) -R to disable ASLR for the run."],
      ["Speedup falls beyond 8 threads, even for the compute-bound π loop","Other processes are competing, the laptop is throttling, or threads exceed hardware threads","Watch top during the run, log the clock, keep OMP_NUM_THREADS at or below the logical CPU count and pin with OMP_PLACES=cores. Diagnostic habit: check the machine before the code."],
      ["The padded version is no faster than the packed one","The compiler kept count[i] in a register inside the loop, so memory is written only once","For this experiment only, make the counter volatile or add asm volatile(\"\" ::: \"memory\") inside the loop so every increment really reaches memory; the false sharing then becomes visible."]
    ],
    challenge:"Write a parallel histogram of a 1 GB random byte array four ways — one mutex, atomics on a shared 256-bin array, per-thread private histograms merged at the end, and private histograms padded to separate cache lines — and predict each run time from Module 3's cost table before measuring. Then run the best version on P-cores only, E-cores only and all cores, and explain the three numbers with the roofline.",
    reflect:[
      "Why does reduction(+:sum) produce a slightly different 12th digit than the serial loop, and when would that matter?",
      "On a desktop CPU with 16 identical cores, which of your schedule results would change and which would stay the same? Why?",
      "Your strong- and weak-scaling curves tell different stories about the same code. What does each say about its serial fraction?"
    ]
  },
  "p51lab3":{
    time:"two sessions of 2–3 h",
    setup:[
      "WSL2 Ubuntu 24.04 or native Linux with sudo apt install build-essential openmpi-bin libopenmpi-dev. Check mpicc --showme and mpirun --version.",
      "For the Slurm step: sudo apt install slurm-wlm (slurmctld, slurmd and munge). On WSL2 enable systemd first: add [boot] and systemd=true to /etc/wsl.conf, run wsl --shutdown from Windows, reopen Ubuntu and check systemctl is-system-running.",
      "Back up the distro before installing Slurm (wsl --export Ubuntu ubuntu-backup.tar from Windows) so a broken configuration can be rolled back.",
      "A serial 2D Jacobi solver as the reference: 4096 × 4096 doubles, fixed boundary values, 1,000 steps, and a final checksum equal to the sum of all cells."
    ],
    checkpoints:[
      "mpirun -np 8 ./hello prints eight lines with ranks 0–7 and size 8 (in any order); with --report-bindings, Open MPI shows which cores each rank is bound to.",
      "A ping-pong table from 8 B to 64 MiB and a log–log plot: small messages show a flat latency floor (well under a microsecond to a few microseconds through shared memory) and large ones a bandwidth plateau; fitted α, β and n½ = αβ are written down.",
      "The MPI solver's checksum equals the serial checksum to the last printed digit for 1, 4 and 16 ranks, and a strong-scaling plot shows speedup flattening as the ranks share your laptop's memory bandwidth.",
      "After Ctrl-C and a restart, the program logs 'resuming from step N' and its final checksum matches the uninterrupted run; your notes contain the measured checkpoint time and the Young interval for the hypothetical 1,000-node machine.",
      "sinfo shows your node idle; sbatch prints 'Submitted batch job <id>'; squeue shows the job go from PD to R; sacct -j <id> shows COMPLETED with its elapsed time; and at least one short job starts ahead of a queued long one through backfill."
    ],
    hints:[
      "Get two ranks talking before you write the solver. A ping-pong that is correct at 8 bytes and at 64 MiB flushes out most buffer, count and datatype mistakes you would otherwise debug inside the stencil.",
      "Use MPI_Cart_create with periods {0,0} and MPI_Cart_shift for the up, down, left and right neighbours. Edge ranks receive MPI_PROC_NULL, which makes MPI_Sendrecv a no-op, so no special cases are needed. Rows are contiguous; columns need MPI_Type_vector(ny, 1, nx + 2, MPI_DOUBLE, &col) with MPI_Type_commit.",
      "For restart correctness, save the step number, both grids if you swap pointers, and the rank's coordinates; on restart read the file named after your rank and continue from step + 1, then compare checksums, not pictures. Young: τ ≈ √(2 × C × M) with M = 5 years ÷ 1,000 nodes ≈ 43.8 hours."
    ],
    trouble:[
      ["mpirun: 'There are not enough slots available in the system'","You asked for more ranks than the cores Open MPI detected","Add --oversubscribe for experiments, or --use-hwthread-cpus to count hardware threads; keep timing runs at or below the physical core count."],
      ["The program hangs on large grids but works on small ones","Two ranks both call blocking MPI_Send first; small messages go out eagerly but large ones wait for a matching receive, so both wait forever","Use MPI_Sendrecv, or MPI_Isend and MPI_Irecv with MPI_Waitall. Diagnostic habit: attach gdb -p to two stuck ranks and run bt — both will be sitting in MPI_Send."],
      ["Checksums differ between 1 and 16 ranks","Halos exchanged in the wrong direction, an off-by-one at block edges, or a global sum taken in a different order","Dump a small 64 × 64 run from both versions and diff the grids, and compute the final checksum by gathering to rank 0 in a fixed order."],
      ["slurmd or slurmctld will not start, or sinfo shows the node down or drained","The node line in slurm.conf does not match the machine, munge is not running, or the state directories are missing","Run slurmd -C to print the exact NodeName line for your machine, start munge before slurmctld and slurmd, then scontrol update nodename=<name> state=resume; read the first error in the Slurm logs under /var/log."]
    ],
    challenge:"Overlap communication with computation: post MPI_Irecv and MPI_Isend for the halos, update the interior cells that do not depend on ghost cells while the messages travel, then MPI_Waitall and update the boundary. Measure the gain at 16 ranks on a small grid, where communication matters, and on a large one, and explain both results with the alpha–beta model and surface-to-volume reasoning.",
    reflect:[
      "Your laptop's interconnect is shared memory. Which measured numbers would change most on a real cluster with InfiniBand, and how would that move the point where strong scaling stops?",
      "Why does an accurate --time request start sooner under backfill, and what does that imply about how you write checkpointing code?",
      "If node failures became twice as frequent, how would Young's interval change, and why does halving the checkpoint cost help as much as doubling the MTBF?"
    ]
  },
  "p51lab4":{
    time:"two sessions of 2–3 h",
    setup:[
      "Windows: the latest NVIDIA Game Ready or Studio driver for the RTX 5090 Laptop GPU, then wsl --install and wsl --update. Inside Ubuntu 24.04, add NVIDIA's WSL-Ubuntu CUDA repository from the CUDA downloads page (Linux > x86_64 > WSL-Ubuntu) and install only the toolkit package, cuda-toolkit — never cuda, cuda-drivers or any nvidia-driver package inside WSL.",
      "Native Linux instead: install the NVIDIA driver first (from CUDA 13.4 the Linux toolkit no longer bundles it), then the toolkit. No NVIDIA GPU: Google Colab, Runtime > Change runtime type > GPU, write .cu files with %%writefile and compile with nvcc -arch=sm_75 for a T4.",
      "Clone NVIDIA's cuda-samples repository from GitHub and build deviceQuery with CMake, or write a 20-line cudaGetDeviceProperties program yourself.",
      "Install the Nsight Systems and Nsight Compute GUIs on Windows to open reports; nsys and ncu come with the toolkit. For ncu under WSL2, open the NVIDIA Control Panel, enable developer settings, and allow access to GPU performance counters for all users."
    ],
    checkpoints:[
      "nvcc --version shows a 13.x release; nvidia-smi inside WSL lists the RTX 5090 Laptop GPU; deviceQuery reports 82 multiprocessors, compute capability 12.0, about 24 GB of global memory and 'Result = PASS' (on Colab: a T4, compute capability 7.5).",
      "SAXPY results are verified on the host for sample indices, and your table shows effective bandwidth for each block size, with 128–512 within a few percent of one another and well above half of 896 GB/s.",
      "A bandwidth-versus-stride plot that falls roughly as the sector arithmetic predicts (about half at stride 2, about an eighth from stride 8 on), and a transpose table in which the padded shared-memory tile is fastest.",
      "Every matrix-multiply variant passes the correctness check; the table climbs from naive through tiled to cuBLAS with GFLOP/s and percent of the 45 TFLOP/s roof, and the FP16-input cublasGemmEx row exceeds the FP32 roof because it runs on tensor cores.",
      "An nsys report showing kernels, copies and gaps; an ncu report for the tiled kernel with achieved occupancy and memory throughput; and a timeline screenshot in which uploads of later chunks overlap kernels of earlier ones."
    ],
    hints:[
      "Check errors after every CUDA call and every launch. A kernel that 'runs in 0.001 ms' almost always failed to launch, and only cudaGetLastError will tell you.",
      "Time with cudaEventRecord before and after the launch, cudaEventSynchronize on the stop event, then cudaEventElapsedTime; effective bandwidth = (bytes read + bytes written) ÷ seconds. For the transpose, read a 32 × 32 tile with threadIdx.x running along a row, __syncthreads(), then write it out with the roles of x and y swapped.",
      "In the tiled kernel a thread loads A[row * n + t * T + threadIdx.x] and B[(t * T + threadIdx.y) * n + col], with two __syncthreads() per tile. cuBLAS is column-major: for row-major arrays compute C^T = B^T × A^T, which means passing B as the first matrix and A as the second."
    ],
    trouble:[
      ["nvcc fatal: Unsupported gpu architecture 'compute_120'","A toolkit older than CUDA 12.8, which predates Blackwell, or an old nvcc earlier on your PATH","Install a CUDA 13.x toolkit, put /usr/local/cuda/bin first on PATH, and confirm with which nvcc and nvcc --version."],
      ["'no CUDA-capable device is detected' inside WSL","The Windows driver is missing or old, WSL is not updated, or a Linux NVIDIA driver installed inside WSL is shadowing the WSL library","Update the Windows driver, run wsl --update and wsl --shutdown, remove nvidia-driver packages inside WSL, and confirm /usr/lib/wsl/lib contains libcuda.so."],
      ["ncu prints ERR_NVGPUCTRPERM: the user does not have permission to access NVIDIA GPU Performance Counters","GPU performance counters are restricted to administrators by default","Allow access to the counters for all users in the Windows NVIDIA Control Panel's developer settings and rerun; on native Linux, set the NVreg_RestrictProfilingToAdminUsers=0 driver option or run ncu with sudo."],
      ["The tiled kernel is wrong only for some matrix sizes","n is not a multiple of the tile size so threads read past the edge, or a __syncthreads() is missing","Test n = 4096 first, then add bounds checks that load 0.0f outside the matrix; run compute-sanitizer ./mm for out-of-bounds accesses and compute-sanitizer --tool racecheck for shared-memory races."],
      ["Copies and kernels never overlap in the Nsight Systems timeline","Host buffers come from malloc (pageable), all work is in the default stream, or a cudaDeviceSynchronize sits inside the loop","Allocate host buffers with cudaMallocHost, create streams with cudaStreamCreate, issue copy–kernel–copy for each chunk on its own stream, and synchronize once at the end."]
    ],
    challenge:"Climb one more rung of the matrix-multiply ladder: have each thread compute a 4 × 4 (then 8 × 8) block of C held in registers, load tiles with float4, and double-buffer the shared-memory tiles so the next tile loads while the current one is in use. Plot every version on your measured roofline and use Nsight Compute to name the limit — shared-memory bandwidth, registers and occupancy, or instruction issue — that keeps you short of cuBLAS.",
    reflect:[
      "Why does tiling raise arithmetic intensity, and why does the T = 32 tiled kernel still sit below the ridge point?",
      "The FP16-input cuBLAS run beat the FP32 roof. What hardware made that possible, and what did you trade for it?",
      "Your Nsight Systems timeline showed copies taking longer than kernels. Which design change would remove most of that time in a real application, and why is Amdahl's law the reason?"
    ],
    safety:"Sustained CUDA benchmarks run the laptop at full power: keep the vents clear, work on a hard surface, and watch temperatures in nvidia-smi during long runs."
  },
  "p51lab5":{
    time:"two sessions of 2–3 h, plus an hour on a Mac",
    setup:[
      "WSL2 Ubuntu with the CUDA toolkit from Lab 4 and Python 3.12 or later in a virtual environment: python3 -m venv ~/gpu, then source ~/gpu/bin/activate.",
      "Install PyTorch with CUDA using the exact command from the selector on pytorch.org (Linux, pip, the newest CUDA build offered), then the CuPy package for your CUDA major version as named in CuPy's installation guide, numba-cuda and matplotlib. Triton ships with Linux PyTorch builds; check with python -c \"import triton; print(triton.__version__)\".",
      "For local LLMs: llama.cpp built with CUDA (cmake -B build -DGGML_CUDA=ON, then cmake --build build -j) or Ollama, and one 8B instruct model in GGUF format at Q4_K_M and Q8_0 from a source whose licence you have read. Keep about 20 GB of disk free.",
      "For the Apple step: any Apple Silicon Mac with Python 3.10 or later and pip install mlx mlx-lm. Without a Mac yet, plan step 5 as clearly labeled projections."
    ],
    checkpoints:[
      "python -c \"import torch, cupy; from numba import cuda; print(torch.cuda.get_device_name(0), cupy.cuda.runtime.getDeviceCount(), cuda.is_available())\" prints the RTX 5090 Laptop GPU, 1 and True, and Triton imports without error.",
      "A table of time and effective GB/s for SAXPY and softmax in NumPy, CuPy, Numba and Triton; every GPU version matches NumPy within float32 tolerance, the best reach a large fraction of 896 GB/s, and NumPy is limited by DDR5 bandwidth.",
      "A precision table with TFLOP/s and maximum relative error for FP32, TF32, BF16 and FP16, showing error growing as mantissa bits shrink and throughput jumping once tensor cores are used.",
      "llama-bench output for Q4 and Q8 at two context lengths beside your computed ceilings (896 GB/s ÷ bytes per token): generation below the ceiling, prompt processing (pp) far faster than generation (tg), and VRAM use growing with context in nvidia-smi.",
      "MLX results (or labeled projections) for the matmul and the same model family, ceilings for the M5 Max and M5 Ultra, and a one-page buying memo with a table of models × machines × fits × ceiling."
    ],
    hints:[
      "GPU work is asynchronous in every library. If a timing looks impossibly fast you timed the launch, not the work: synchronize before stopping the clock, and discard the first run, which includes compilation (Numba, Triton) and memory-pool warm-up (CuPy, PyTorch).",
      "A fused softmax reads the matrix once and writes it once, so bytes = 2 × rows × cols × 4. NumPy and a naive CuPy version make several passes (max, exp, sum, divide) and move several times more bytes — which is why a fused Triton kernel wins. For llama.cpp, bytes per token ≈ model file size + the KV cache in use.",
      "Ceiling arithmetic: tokens/s ≤ bandwidth ÷ (weight bytes + KV bytes per token). An 8B model at Q4_K_M is about 4.9 GB, so the laptop ceiling is near 896 ÷ 4.9 ≈ 180 tok/s at short context. In MLX, time around mx.eval(result): without it, lazy evaluation computes nothing."
    ],
    trouble:[
      ["torch.cuda.is_available() returns False","A CPU-only PyTorch wheel was installed, or you are not in the virtual environment you think","pip uninstall torch, reinstall with the exact pytorch.org command for a CUDA build, check that torch.version.cuda is not None, and confirm which python points into ~/gpu."],
      ["ImportError or 'CUDA driver version is insufficient' when importing CuPy","The CuPy package was built for a different CUDA major version, or two cupy packages are installed","Uninstall every cupy-* package, then install only the one named for your CUDA major version in CuPy's installation guide."],
      ["llama.cpp generation is slow and nvidia-smi shows little VRAM in use","The model is running on the CPU: the build lacks CUDA, or no layers were offloaded","Rebuild with -DGGML_CUDA=ON, pass -ngl 99 to offload all layers, and check that the startup log reports layers offloaded to CUDA."],
      ["Out of memory at 32K context","The KV cache grows with context — about 128 KiB per token for an 8B model with an FP16 cache, 4 GiB at 32K — on top of the weights","Use the Q4 model, shorten the context, or enable a quantized KV cache through llama.cpp's cache-type options. Diagnostic habit: compute the expected memory first, so the failure is a prediction, not a surprise."]
    ],
    challenge:"Write fused Triton kernels for softmax and for RMSNorm followed by a scale, autotune their block sizes with triton.autotune, and compare them with PyTorch eager and torch.compile on the same tensors. Then use the bandwidth model to predict, before measuring, the speedup of Q4 over Q8 in llama.cpp at short and at long context, and explain where the prediction breaks.",
    reflect:[
      "Why did going from Q8 to Q4 speed up generation by close to 2× but prompt processing by much less?",
      "For the 70B model you want to run, which constraint decides between the laptop and the M5 Ultra — capacity, bandwidth or compute — and how would the answer change for a mixture-of-experts model?",
      "When would you write a kernel in Triton rather than CUDA C++, and when would you not?"
    ]
  }
});
