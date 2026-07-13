import {
  Callout,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function ComparingInferenceEngines() {
  return (
    <LessonArticle>
      <LessonSection title="Many engines, one problem">
        <p className="text-slate-300">
          Open-weight LLM serving has exploded with specialized runtimes. Each optimizes different tradeoffs —
          throughput, latency, ease of use, hardware support, and ecosystem. This lesson compares the engines you
          will encounter after vLLM so you can pick (or justify) the right tool.
        </p>
      </LessonSection>

      <LessonSection title="Head-to-head comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Engine</th>
                <th className="px-4 py-3">Strengths</th>
                <th className="px-4 py-3">Weaknesses</th>
                <th className="px-4 py-3">Best for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'vLLM',
                  'PagedAttention, continuous batching, huge model support, OpenAI API, active community',
                  'Ops complexity at scale; rapid API changes between versions',
                  'Production multi-tenant GPU serving, research clusters',
                ],
                [
                  'TGI (Text Generation Inference)',
                  'Hugging Face native, solid HF model support, production-hardened at HF',
                  'Fewer advanced features vs vLLM; HF-centric workflow',
                  'Teams already on Hugging Face Hub and Inference Endpoints',
                ],
                [
                  'TensorRT-LLM',
                  'NVIDIA-optimized kernels, peak throughput on NVIDIA hardware',
                  'Build complexity, NVIDIA lock-in, slower model coverage for new architectures',
                  'Maximum perf on NVIDIA datacenter GPUs when you can invest in TRT build pipeline',
                ],
                [
                  'Ollama',
                  'Dead-simple local install, model pull UX, cross-platform',
                  'Not designed for high-concurrency production serving',
                  'Developer laptops, prototyping, single-user local apps',
                ],
                [
                  'llama.cpp',
                  'CPU + GPU, GGUF quantizations, runs everywhere including edge',
                  'Lower throughput than GPU servers; manual tuning',
                  'Edge devices, Apple Silicon, offline/air-gapped, minimal dependencies',
                ],
              ].map(([engine, strengths, weaknesses, best]) => (
                <tr key={engine} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{engine}</td>
                  <td className="px-4 py-3 text-genai-400">{strengths}</td>
                  <td className="px-4 py-3 text-slate-400">{weaknesses}</td>
                  <td className="px-4 py-3 text-slate-400">{best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="vLLM vs TGI">
        <p className="text-slate-300">
          Both target <strong className="text-white">production GPU serving</strong> with continuous batching. vLLM
          pioneered PagedAttention and tends to lead on bleeding-edge features (spec decode, disaggregated prefill,
          multi-LoRA). TGI integrates tightly with Hugging Face — if your MLOps stack is Hub-centric, TGI reduces
          friction.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Choose <strong className="text-white">vLLM</strong> for max flexibility, largest community, and newest optimizations.</li>
          <li>Choose <strong className="text-white">TGI</strong> when deploying via HF Inference Endpoints or you want HF-maintained containers.</li>
        </ul>
      </LessonSection>

      <LessonSection title="vLLM vs TensorRT-LLM">
        <p className="text-slate-300">
          TensorRT-LLM compiles models into NVIDIA-optimized engines — often the{' '}
          <strong className="text-white">fastest raw throughput</strong> on H100/A100 when the model is supported.
          The cost is a heavyweight build step per model/quantization/GPU SKU and slower time-to-support for new
          architectures.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Choose <strong className="text-white">TensorRT-LLM</strong> when you have NVIDIA ML engineers and stable model set.</li>
          <li>Choose <strong className="text-white">vLLM</strong> when you need fast iteration, broad model support, and simpler deploys.</li>
        </ul>
      </LessonSection>

      <LessonSection title="vLLM vs Ollama vs llama.cpp">
        <p className="text-slate-300">
          <strong className="text-white">Ollama</strong> and <strong className="text-white">llama.cpp</strong> sit
          in a different tier — optimized for <em>accessibility</em> and <em>local inference</em>, not 100+
          concurrent users on datacenter GPUs.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">vLLM</th>
                <th className="px-4 py-3">Ollama</th>
                <th className="px-4 py-3">llama.cpp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Concurrency', 'Dozens–hundreds of seqs', 'Low', 'Low–medium'],
                ['Hardware', 'NVIDIA datacenter GPUs', 'Consumer GPU / CPU', 'CPU, GPU, Apple Silicon'],
                ['Quant format', 'AWQ, GPTQ, FP8, FP16', 'GGUF via bundled runtime', 'GGUF native'],
                ['Deploy complexity', 'Docker/K8s', 'Single binary', 'Single binary / library'],
                ['OpenAI API', 'Built-in', 'Compatible (limited)', 'Via wrappers'],
              ].map(([dim, vllm, ollama, llama]) => (
                <tr key={dim} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{dim}</td>
                  <td className="px-4 py-3 text-genai-400">{vllm}</td>
                  <td className="px-4 py-3 text-slate-400">{ollama}</td>
                  <td className="px-4 py-3 text-slate-400">{llama}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Decision flowchart">
        <Flowchart
          title="Which engine?"
          chart={`flowchart TD
  S[What is the goal?]
  S --> P[Production API at scale]
  S --> L[Local dev / prototype]
  S --> E[Edge / CPU only]
  P --> N{NVIDIA datacenter GPUs?}
  N -->|Yes, need max perf| T[TensorRT-LLM]
  N -->|Yes, need flexibility| V[vLLM]
  N -->|HF-native stack| H[TGI]
  L --> O[Ollama]
  E --> C[llama.cpp]`}
        />
      </LessonSection>

      <Callout variant="tip">
        Many teams use <strong className="text-white">Ollama locally</strong> for dev and{' '}
        <strong className="text-white">vLLM in production</strong> — same OpenAI client SDK, different base URL.
        LangChain's <code className="font-mono text-sm">ChatOpenAI(base_url=...)</code> makes swapping trivial.
      </Callout>

      <KeyTakeaways
        items={[
          'vLLM — best default for production multi-user GPU serving with cutting-edge batching features.',
          'TGI — strong Hugging Face integration; comparable tier to vLLM for HF-centric teams.',
          'TensorRT-LLM — peak NVIDIA throughput when you can invest in compiled engine pipelines.',
          'Ollama / llama.cpp — local, single-user, edge — not substitutes for datacenter vLLM fleets.',
        ]}
      />
    </LessonArticle>
  )
}
