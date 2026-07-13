import {
  Callout,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function LlamaCppVsVllm() {
  return (
    <LessonArticle>
      <LessonSection title="Different tools, different jobs">
        <p className="text-slate-300">
          <strong className="text-white">llama.cpp</strong> optimizes for portability — GGUF on CPU, Apple Silicon,
          consumer GPUs, and edge devices. <strong className="text-white">vLLM</strong> optimizes for datacenter
          throughput — continuous batching, PagedAttention, and dozens of concurrent users per GPU. Neither replaces
          the other; they solve different scale problems.
        </p>
      </LessonSection>

      <LessonSection title="Head-to-head comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">llama.cpp</th>
                <th className="px-4 py-3">vLLM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Primary hardware', 'CPU, Apple Silicon, any GPU', 'NVIDIA datacenter GPUs'],
                ['Model format', 'GGUF (native)', 'Safetensors / HF hub (AWQ, GPTQ, FP16)'],
                ['Concurrency', 'Low–medium (-np slots)', 'High (continuous batching, 100+ seqs)'],
                ['Install complexity', 'Single binary or library', 'CUDA stack, Docker, K8s typical'],
                ['Throughput at scale', 'Moderate', 'Very high'],
                ['Offline / air-gapped', 'Excellent — copy .gguf files', 'Heavier — HF cache, larger deps'],
                ['OpenAI API', 'Via llama-server', 'Built-in vllm serve'],
              ].map(([dim, llama, vllm]) => (
                <tr key={dim} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{dim}</td>
                  <td className="px-4 py-3 text-genai-400">{llama}</td>
                  <td className="px-4 py-3 text-slate-400">{vllm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Laptop vs datacenter">
        <p className="text-slate-300">
          On a <strong className="text-white">laptop</strong> (16–32 GB RAM, optional consumer GPU), llama.cpp runs
          a 7B–8B Q4 model comfortably. vLLM expects CUDA, ample VRAM, and is painful to justify on a MacBook or
          CPU-only machine.
        </p>
        <p className="mt-3 text-slate-300">
          In a <strong className="text-white">datacenter</strong> (A100/H100 fleet, Kubernetes), vLLM's scheduler
          and PagedAttention dominate. llama.cpp can serve there too, but you leave batching efficiency on the table
          unless traffic is low.
        </p>
        <Callout variant="tip">
          Rule of thumb: if your GPU costs less than your monthly coffee budget, use llama.cpp or Ollama. If you rent
          A100s by the hour, evaluate vLLM first.
        </Callout>
      </LessonSection>

      <LessonSection title="Single user vs 100 concurrent">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Scenario</th>
                <th className="px-4 py-3">Pick</th>
                <th className="px-4 py-3">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['You + IDE copilot', 'llama.cpp / Ollama', 'Low latency, zero ops, runs offline'],
                ['5-person team internal tool', 'llama.cpp server or Ollama', 'Simple replica or shared VM'],
                ['50–100 concurrent API users', 'vLLM', 'Continuous batching keeps GPUs full'],
                ['Bursty public API', 'vLLM + autoscaling replicas', 'Queue depth and TTFT SLAs need a real scheduler'],
                ['Embedded device (Raspberry Pi, phone)', 'llama.cpp library', 'vLLM does not target edge'],
              ].map(([scenario, pick, why]) => (
                <tr key={scenario} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{scenario}</td>
                  <td className="px-4 py-3 text-genai-400">{pick}</td>
                  <td className="px-4 py-3 text-slate-400">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="CPU vs GPU cluster">
        <p className="text-slate-300">
          llama.cpp's <strong className="text-white">CPU backend</strong> is mature — AVX, AMX, Apple Neural Engine
          paths make 7B models usable without a GPU. vLLM is effectively{' '}
          <strong className="text-white">GPU-first</strong>; CPU inference is not its strength.
        </p>
        <p className="mt-3 text-slate-300">
          For a <strong className="text-white">GPU cluster</strong>, vLLM tensor-parallelizes 70B+ models and serves
          hundreds of requests. llama.cpp supports multi-GPU via tensor split and RPC, but lacks vLLM's production
          scheduler for massive concurrency.
        </p>
      </LessonSection>

      <LessonSection title="Decision flowchart">
        <Flowchart
          title="llama.cpp or vLLM?"
          chart={`flowchart TD
  START[Need local LLM inference?]
  START --> HW{Hardware?}
  HW -->|Laptop / CPU / edge| L[llama.cpp or Ollama]
  HW -->|NVIDIA datacenter GPU| CONC{Concurrent users?}
  CONC -->|1–10| L2[llama.cpp server — maybe enough]
  CONC -->|50–100+| V[vLLM]
  HW -->|Air-gapped / minimal deps| L
  V --> SLA{Need TTFT p99 SLA under load?}
  SLA -->|Yes| VOK[vLLM + load tests]
  SLA -->|No| L2`}
        />
      </LessonSection>

      <Callout variant="beginner">
        Many teams use <strong className="text-white">llama.cpp locally</strong> for development and{' '}
        <strong className="text-white">vLLM in production</strong> — same OpenAI client, different{' '}
        <code className="font-mono text-sm">base_url</code>. The GGUF you tuned on a laptop informs which quant to
        try in vLLM (AWQ/GPTQ equivalent).
      </Callout>

      <KeyTakeaways
        items={[
          'llama.cpp — portable, GGUF-native, great for laptop, edge, CPU, and low-concurrency serving.',
          'vLLM — datacenter GPUs, continuous batching, and 50–100+ concurrent users per fleet.',
          'Single-user and offline → llama.cpp; multi-tenant API at scale → vLLM.',
          'Use the decision flowchart: hardware first, then concurrency, then SLA requirements.',
        ]}
      />
    </LessonArticle>
  )
}
