import {
  Callout,
  CodeBlock,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function GgmlAndBackends() {
  return (
    <LessonArticle>
      <Definition term="GGML">
        <p>
          <strong className="text-white">GGML</strong> (Georgi Gerganov Machine Learning) is the tensor computation
          library inside llama.cpp. It defines how matrices are stored, multiplied, and quantized — and dispatches
          those operations to the right <strong className="text-white">backend</strong> for your hardware (CPU, GPU,
          or accelerator).
        </p>
        <p>
          Analogy: if llama.cpp is the car, GGML is the engine. The <em>backend</em> is which fuel system connects
          that engine to the road — gasoline (CPU), electric (Metal), or diesel (CUDA).
        </p>
      </Definition>

      <Callout variant="beginner" title="You do not write GGML code">
        As a user you choose build flags or prebuilt binaries. This lesson explains what those choices mean so logs
        like &quot;using CUDA backend&quot; or &quot;AVX2 enabled&quot; make sense.
      </Callout>

      <LessonSection title="Tensors — the unit of work">
        <Definition term="Tensor">
          <p>
            A <strong className="text-white">tensor</strong> is a multi-dimensional array of numbers — the basic
            data structure in neural networks. Model weights are tensors. Each inference step multiplies and adds
            tensors through layers. GGML implements these operations efficiently in C.
          </p>
        </Definition>

        <p className="mt-4 text-slate-300">
          GGML also handles <strong className="text-white">quantized tensors</strong> — weights stored as 4-bit or
          8-bit integers with scale factors, so matrix math runs on packed data without converting everything back to
          32-bit floats first.
        </p>
      </LessonSection>

      <LessonSection title="The backend abstraction">
        <p className="text-slate-300">
          A <strong className="text-white">backend</strong> is a hardware-specific implementation of the same math.
          llama.cpp asks GGML to multiply matrices; GGML routes the work to whichever backend was compiled in and
          is available at runtime.
        </p>

        <Flowchart
          title="How a forward pass picks hardware"
          chart={`flowchart TB
  LP[llama.cpp forward pass] --> GG[GGML graph scheduler]
  GG --> Q{Backend available?}
  Q --> CPU[CPU backend — always fallback]
  Q --> CUDA[NVIDIA CUDA]
  Q --> METAL[Apple Metal]
  Q --> VULKAN[Vulkan — AMD / cross-platform GPU]
  Q --> SYCL[Intel SYCL / oneAPI]
  CPU --> OUT[Token logits]
  CUDA --> OUT
  METAL --> OUT
  VULKAN --> OUT
  SYCL --> OUT`}
        />
      </LessonSection>

      <LessonSection title="CPU backend — AVX and friends">
        <p className="text-slate-300">
          The CPU backend is the universal fallback. On x86 processors it uses{' '}
          <strong className="text-white">SIMD</strong> instructions — Single Instruction, Multiple Data — to process
          many numbers per clock cycle.
        </p>

        <ContentStep number={1} title="AVX2 / AVX-512">
          <p className="text-slate-300">
            <strong className="text-white">AVX2</strong> (Advanced Vector Extensions) is on most Intel and AMD chips
            from the last decade. <strong className="text-white">AVX-512</strong> goes wider on some server CPUs.
            llama.cpp auto-detects support at runtime and picks optimized kernels.
          </p>
        </ContentStep>

        <ContentStep number={2} title="ARM CPUs">
          <p className="text-slate-300">
            On Apple Silicon and ARM Linux, NEON instructions play the same role. A Mac running CPU-only still
            benefits from ARM-optimized GGML paths — but Metal is usually faster when enabled.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Threading">
          <p className="text-slate-300">
            CPU inference scales with core count via <code className="font-mono text-sm">--threads</code>. More
            threads help prefill especially; decode is harder to parallelize because it is inherently sequential.
          </p>
        </ContentStep>

        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">CPU feature</th>
                <th className="px-4 py-3">Platform</th>
                <th className="px-4 py-3">Effect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['AVX2', 'Intel/AMD desktop & laptop', 'Default fast path for matrix ops'],
                ['AVX-512', 'Some Xeon / Ryzen Pro', 'Wider vectors — faster when present'],
                ['NEON', 'ARM / Apple (CPU path)', 'ARM SIMD acceleration'],
                ['OpenBLAS (optional)', 'Some builds', 'Accelerated BLAS for certain ops'],
              ].map(([feat, platform, effect]) => (
                <tr key={feat} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{feat}</td>
                  <td className="px-4 py-3 text-slate-400">{platform}</td>
                  <td className="px-4 py-3 text-genai-400">{effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="GPU and accelerator backends">
        <ContentStep number={1} title="CUDA (NVIDIA)">
          <p className="text-slate-300">
            <strong className="text-white">CUDA</strong> runs matrix kernels on NVIDIA GPUs. Build with{' '}
            <code className="font-mono text-sm">GGML_CUDA=1</code>. Supports partial layer offload — some layers on
            GPU, rest on CPU — when VRAM is tight.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Metal (Apple)">
          <p className="text-slate-300">
            <strong className="text-white">Metal</strong> is the default GPU path on macOS builds. Uses Apple GPU
            cores with unified memory — no explicit CPU→GPU copy for weights already in shared RAM.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Vulkan">
          <p className="text-slate-300">
            <strong className="text-white">Vulkan</strong> targets AMD GPUs, Intel Arc, and cross-platform GPU support
            on Linux and Windows when CUDA is unavailable.
          </p>
        </ContentStep>

        <ContentStep number={4} title="SYCL">
          <p className="text-slate-300">
            <strong className="text-white">SYCL</strong> (via Intel oneAPI) accelerates on Intel GPUs and Xe
            graphics — useful for Intel-based laptops without NVIDIA cards.
          </p>
        </ContentStep>

        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Backend</th>
                <th className="px-4 py-3">Hardware</th>
                <th className="px-4 py-3">Typical platform</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['CPU + AVX', 'Any x86_64 processor', 'Windows/Linux fallback'],
                ['Metal', 'Apple M-series GPU', 'macOS, iOS builds'],
                ['CUDA', 'NVIDIA GeForce / RTX / datacenter', 'Windows/Linux with NVIDIA driver'],
                ['Vulkan', 'AMD, Intel GPU', 'Linux/Windows without CUDA'],
                ['SYCL', 'Intel integrated / discrete GPU', 'Intel laptop acceleration'],
              ].map(([backend, hw, platform]) => (
                <tr key={backend} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-genai-400">{backend}</td>
                  <td className="px-4 py-3 text-white">{hw}</td>
                  <td className="px-4 py-3 text-slate-400">{platform}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Hybrid execution — split across devices">
        <p className="text-slate-300">
          GGML can place different layers on different backends. A 13B model might run 20 layers on GPU and the rest
          on CPU if VRAM only fits a slice. The flag{' '}
          <code className="font-mono text-sm">-ngl</code> (number of GPU layers) controls this in CLI tools.
        </p>

        <Flowchart
          title="Partial GPU offload"
          chart={`flowchart TB
  M[Full model in GGUF] --> S[Split layers]
  S --> GPU[First N layers → CUDA / Metal]
  S --> CPU[Remaining layers → CPU AVX]
  GPU --> MERGE[Combined forward pass]
  CPU --> MERGE
  MERGE --> T[Next token]`}
        />

        <Callout variant="insight">
          More GPU layers = faster decode, but needs more VRAM. Tuning <code className="font-mono text-sm">-ngl</code>{' '}
          is a core skill for consumer NVIDIA cards running models slightly too large to fit entirely on GPU.
        </Callout>

        <CodeBlock title="Example — 35 layers on GPU, rest on CPU">{`./llama-cli -m model-q4_k_m.gguf \\
  -p "Hello" \\
  -ngl 35 \\
  --threads 8`}</CodeBlock>
      </LessonSection>

      <LessonSection title="Build-time vs runtime">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Build-time</strong> — CMake flags enable backends (CUDA, Metal, Vulkan).
            A binary without CUDA cannot use NVIDIA acceleration no matter what flags you pass at runtime.
          </li>
          <li>
            <strong className="text-white">Runtime</strong> — Environment variables and CLI flags pick device, layer
            split, and thread count. llama.cpp logs which backend activated on startup.
          </li>
          <li>
            <strong className="text-white">Prebuilt releases</strong> — GitHub releases often ship separate artifacts
            for CUDA 12, Metal macOS, and CPU-only. Download the one matching your machine.
          </li>
        </ul>

        <Callout variant="tip" title="Foundations complete">
          You now understand the full stack: why local inference, hardware, inference phases, GGUF files, llama.cpp
          itself, and GGML backends. The next section of this track covers building, running, and tuning your first
          local model hands-on.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'GGML is the tensor math library inside llama.cpp; backends execute that math on specific hardware.',
          'CPU backend uses AVX/NEON SIMD — works everywhere, slowest for large models.',
          'CUDA (NVIDIA), Metal (Apple), Vulkan (AMD/cross-GPU), and SYCL (Intel) accelerate GPU paths.',
          'Partial GPU offload (-ngl) balances speed vs VRAM when the full model does not fit on GPU.',
          'Backends are chosen at compile time; device and layer split are tuned at runtime.',
        ]}
      />
    </LessonArticle>
  )
}
