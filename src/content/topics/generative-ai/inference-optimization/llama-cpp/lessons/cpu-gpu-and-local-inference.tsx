import {
  Callout,
  CodeBlock,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function CpuGpuAndLocalInference() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Zero hardware jargon assumed">
        You do not need a datacenter to run useful LLMs. This lesson explains RAM vs VRAM, when CPU inference is
        enough, and how Apple Silicon and NVIDIA GPUs fit in — so you can match hardware to your goals.
      </Callout>

      <Definition term="RAM (system memory)">
        <p>
          <strong className="text-white">RAM</strong> is the main memory your CPU uses for everything — your
          operating system, browser tabs, and (for llama.cpp) the model weights when running on CPU. A 16 GB laptop
          can run small quantized models; 32–64 GB opens up larger models and longer conversations.
        </p>
      </Definition>

      <Definition term="VRAM (GPU memory)">
        <p>
          <strong className="text-white">VRAM</strong> is memory attached to a discrete GPU (like an NVIDIA RTX
          card). When llama.cpp uses CUDA or Metal acceleration, weights and active computation live in VRAM or
          unified memory — much faster than pure CPU for large matrix math.
        </p>
        <p>
          Analogy: RAM is your desk; VRAM is a specialized workbench bolted to a power tool. Both hold materials,
          but the workbench is where the GPU does its fast parallel cutting.
        </p>
      </Definition>

      <LessonSection title="RAM vs VRAM for local LLMs">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Memory</th>
                <th className="px-4 py-3">Used when</th>
                <th className="px-4 py-3">Typical size</th>
                <th className="px-4 py-3">llama.cpp role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['RAM', 'CPU inference, model mmap', '8–128 GB', 'Holds GGUF weights + KV cache on CPU'],
                ['VRAM', 'NVIDIA CUDA, some AMD Vulkan', '8–24 GB consumer', 'Accelerated layers on GPU'],
                ['Unified (Apple)', 'Metal on M1/M2/M3/M4', '8–128 GB shared', 'CPU and GPU share one pool'],
              ].map(([mem, when, size, role]) => (
                <tr key={mem} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{mem}</td>
                  <td className="px-4 py-3 text-slate-400">{when}</td>
                  <td className="px-4 py-3 text-slate-400">{size}</td>
                  <td className="px-4 py-3 text-genai-400">{role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout variant="insight">
          llama.cpp can <strong className="text-white">memory-map (mmap)</strong> GGUF files: the model sits on disk
          and pages into RAM as needed. That means a 4 GB quantized model often runs on a machine with 8 GB RAM —
          slowly, but it runs.
        </Callout>
      </LessonSection>

      <LessonSection title="CPU inference — when it is enough">
        <p className="text-slate-300">
          Running entirely on the CPU means no NVIDIA card required. llama.cpp uses optimized C++ with SIMD
          instructions (AVX2, AVX-512 on Intel/AMD) to squeeze reasonable speed from general-purpose cores.
        </p>

        <ContentStep number={1} title="Good fits for CPU">
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li>Quantized 3B–8B models (Q4_K_M and similar)</li>
            <li>Short prompts, occasional use, scripting and automation</li>
            <li>Servers without GPUs, CI pipelines, embedded Linux</li>
            <li>When privacy matters more than tokens per second</li>
          </ul>
        </ContentStep>

        <ContentStep number={2} title="Expectations">
          <p className="text-slate-300">
            A modern 8-core CPU might produce <strong className="text-white">5–20 tokens/sec</strong> on a 7B Q4
            model — fine for chat, painful for generating 10-page essays. Compare that to 50–100+ tokens/sec on a
            good GPU or Apple Silicon with Metal.
          </p>
        </ContentStep>

        <Example
          title="CPU-only llama.cpp invocation"
          caption="No GPU flags — all layers on CPU. Works on any x86_64 or ARM64 machine."
        >{`./llama-cli -m llama-3.2-3b-instruct-q4_k_m.gguf \\
  -p "Explain RAM vs VRAM in one paragraph." \\
  -n 128 \\
  --threads 8`}</Example>
      </LessonSection>

      <LessonSection title="Apple Silicon and Metal">
        <p className="text-slate-300">
          Macs with M1, M2, M3, or M4 chips use <strong className="text-white">unified memory</strong> — CPU and
          GPU cores share one RAM pool. llama.cpp&apos;s <strong className="text-white">Metal</strong> backend
          offloads matrix work to the GPU cores without copying data to a separate VRAM chip.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">CPU only on Mac</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
              <li>Works but wastes Apple GPU cores</li>
              <li>Useful for debugging or minimal builds</li>
            </ul>
          </div>
          <div className="rounded-xl border border-genai-500/30 bg-genai-500/5 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-genai-400">Metal (default on Mac builds)</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
              <li>Often 3–10× faster than CPU-only</li>
              <li>16 GB MacBook runs 7B–8B Q4 comfortably</li>
              <li>32–64 GB enables 13B–70B quantized models</li>
            </ul>
          </div>
        </div>

        <Flowchart
          title="Apple Silicon inference path"
          chart={`flowchart LR
  M[GGUF model file] --> L[llama.cpp]
  L --> METAL[Metal backend]
  METAL --> GPU[Apple GPU cores]
  METAL --> CPU[Performance cores]
  GPU --> OUT[Generated tokens]`}
        />
      </LessonSection>

      <LessonSection title="NVIDIA CUDA — consumer and datacenter">
        <p className="text-slate-300">
          On Windows and Linux with an NVIDIA GPU, llama.cpp can use <strong className="text-white">CUDA</strong> to
          run layers on the card. You need enough VRAM (or partial offload — more in later lessons) for the model
          slice you assign to GPU.
        </p>

        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Hardware</th>
                <th className="px-4 py-3">VRAM / unified</th>
                <th className="px-4 py-3">Rough model fit (Q4)</th>
                <th className="px-4 py-3">Backend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Laptop 8 GB RAM, no GPU', '8 GB RAM', '1B–3B CPU only', 'CPU'],
                ['MacBook M2 16 GB', '16 GB unified', '7B–8B full GPU', 'Metal'],
                ['RTX 3060 12 GB', '12 GB VRAM', '7B–13B mostly GPU', 'CUDA'],
                ['RTX 4090 24 GB', '24 GB VRAM', '13B–34B or 70B partial', 'CUDA'],
                ['CPU server 64 GB RAM', '64 GB RAM', '13B–34B slow but works', 'CPU'],
                ['A100 80 GB (datacenter)', '80 GB VRAM', '70B+ for serving', 'CUDA — but vLLM more common'],
              ].map(([hw, mem, fit, backend]) => (
                <tr key={hw} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{hw}</td>
                  <td className="px-4 py-3 text-slate-400">{mem}</td>
                  <td className="px-4 py-3 text-genai-400">{fit}</td>
                  <td className="px-4 py-3 text-slate-400">{backend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="When you do NOT need a datacenter GPU">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Personal assistant</strong> — one user, one chat, 7B model on a laptop
          </li>
          <li>
            <strong className="text-white">Local coding helper</strong> — Cursor, Continue, or CLI tools hitting
            localhost
          </li>
          <li>
            <strong className="text-white">Experimentation</strong> — trying prompts and small models before paying
            for cloud GPUs
          </li>
          <li>
            <strong className="text-white">Air-gapped or edge</strong> — factory floor, drone, offline field laptop
          </li>
        </ul>

        <Callout variant="tip" title="When you DO need datacenter GPUs + vLLM">
          Serving dozens of concurrent users, SLA-driven latency, 70B+ models at scale, or continuous batching across
          a cluster — that is vLLM territory, not llama.cpp on a single machine.
        </Callout>

        <CodeBlock title="Quick hardware decision guide">{`Goal                          → Start here
Privacy, offline, one user    → llama.cpp on laptop (Metal/CUDA/CPU)
No GPU at all                 → llama.cpp CPU + small Q4 model
Many users, production API    → vLLM on NVIDIA server GPUs
Just try models easily        → Ollama (uses llama.cpp internally)`}</CodeBlock>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RAM holds models on CPU; VRAM holds them on NVIDIA GPUs; Apple Silicon shares one unified pool.',
          'CPU inference works for small quantized models — no GPU purchase required.',
          'Metal makes MacBooks surprisingly capable for 7B–8B local chat.',
          'CUDA accelerates NVIDIA cards; match VRAM to model size (quantization helps).',
          'Datacenter GPUs are for high-throughput serving — not required for personal local LLMs.',
        ]}
      />
    </LessonArticle>
  )
}
