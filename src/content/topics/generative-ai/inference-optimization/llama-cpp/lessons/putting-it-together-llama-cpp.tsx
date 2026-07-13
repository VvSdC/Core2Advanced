import {
  Callout,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function PuttingItTogetherLlamaCpp() {
  return (
    <LessonArticle>
      <LessonSection title="From first GGUF to llama.cpp mastery">
        <p className="text-slate-300">
          You have covered GGUF fundamentals, quantization, hardware backends, llama-server, Ollama, production
          deploy, benchmarking, engine comparison, and advanced conversion workflows. This lesson ties it together
          with a <strong className="text-white">decision tree</strong>, a{' '}
          <strong className="text-white">mastery checklist</strong>, and clear next steps.
        </p>
        <Flowchart
          title="Full llama.cpp learning path"
          chart={`flowchart TB
  F[Foundations — GGUF, quants, prefill/decode] --> I[Install — build, llama-cli]
  I --> S[llama-server + OpenAI API]
  S --> O[Ollama vs llama.cpp — when each]
  O --> B[Benchmark — llama-bench pp/tg]
  B --> P[Production — Docker, systemd, proxy]
  P --> A[Advanced — convert, LoRA, quantize]
  A --> C[Compare — llama.cpp vs vLLM]
  C --> M[Mastery — this lesson]`}
        />
      </LessonSection>

      <LessonSection title="Configuration decision tree">
        <Flowchart
          title="Start here for any new llama.cpp deployment"
          chart={`flowchart TD
  START[New llama.cpp deployment] --> HW{GPU available?}
  HW -->|No / edge| CPU[CPU backend — Q4 or smaller]
  HW -->|Yes| FIT{Model fits VRAM at Q4?}
  FIT -->|No| Q[Try Q3_K_M or smaller model]
  FIT -->|Yes| NGL[Sweep -ngl with llama-bench]
  CPU --> CTX[Set -c context — watch RAM]
  NGL --> CTX
  Q --> NGL
  CTX --> CONC{Multiple users?}
  CONC -->|1–2| SERVE[llama-server -np 2]
  CONC -->|Many| VLLM[Consider vLLM instead]
  SERVE --> DEP[Deploy + health checks]`}
        />
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Problem</th>
                <th className="px-4 py-3">First knob</th>
                <th className="px-4 py-3">If insufficient</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['OOM at load', 'Smaller quant (Q4 → Q3)', 'Fewer -ngl layers or smaller model'],
                ['Slow streaming (tg)', 'Increase -ngl, try Q4_K_M vs Q8', 'Faster GPU or vLLM'],
                ['Slow RAG prefill (pp)', 'GPU prefill (-ngl), increase -b batch', 'Shorter context or vLLM'],
                ['Too many concurrent users', 'Lower -np per instance', 'Add replicas or switch to vLLM'],
                ['Need custom fine-tune', 'merge LoRA → convert_hf_to_gguf', 'llama-quantize + bench'],
                ['Want easy local UX', 'Ollama + Modelfile', 'Drop to llama.cpp when tuning needed'],
              ].map(([problem, first, next]) => (
                <tr key={problem} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{problem}</td>
                  <td className="px-4 py-3 text-genai-400">{first}</td>
                  <td className="px-4 py-3 text-slate-400">{next}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Mastery checklist">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">GGUF + quants</strong> — explain Q4_K_M vs Q8_0 and when IQ quants are
            worth the quality risk.
          </li>
          <li>
            <strong className="text-white">Build and run</strong> — compile llama.cpp, run llama-cli and llama-server
            with -m, -c, -ngl, -np.
          </li>
          <li>
            <strong className="text-white">Benchmark</strong> — read llama-bench pp and tg separately; sweep quants
            and -ngl on your hardware.
          </li>
          <li>
            <strong className="text-white">Ollama vs raw</strong> — know when Modelfiles beat manual flags and vice
            versa.
          </li>
          <li>
            <strong className="text-white">Production</strong> — systemd or Docker, reverse proxy, health checks,
            resource limits.
          </li>
          <li>
            <strong className="text-white">Advanced pipeline</strong> — convert_hf_to_gguf → llama-quantize → bench →
            deploy.
          </li>
          <li>
            <strong className="text-white">Engine choice</strong> — articulate when llama.cpp beats vLLM (laptop,
            edge, air-gap) and when it does not (100 concurrent API).
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Recommended learning recap">
        <p className="text-slate-300">Work through this track in order, then revisit weak spots:</p>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-slate-300">
          <li>Understand GGUF and quantization — pick a default quant for your RAM/VRAM budget.</li>
          <li>Build llama.cpp and run your first model with llama-cli.</li>
          <li>Start llama-server and hit it with curl or the OpenAI SDK.</li>
          <li>Compare Ollama convenience vs llama.cpp control on the same model.</li>
          <li>Benchmark with llama-bench before changing production flags.</li>
          <li>Deploy with Docker or systemd behind a reverse proxy.</li>
          <li>Convert a Hugging Face model and quantize it yourself.</li>
          <li>Decide llama.cpp vs vLLM for your actual concurrency and hardware.</li>
        </ol>
      </LessonSection>

      <LessonSection title="Next steps">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Build an app</strong> — LangChain or OpenAI SDK pointed at your
            llama-server endpoint.
          </li>
          <li>
            <strong className="text-white">Load test</strong> — simulate your real concurrency; if TTFT queues grow,
            plan a vLLM migration path.
          </li>
          <li>
            <strong className="text-white">Contribute upstream</strong> — llama.cpp moves fast; try a new model arch
            or backend.
          </li>
          <li>
            <strong className="text-white">Explore vLLM track</strong> — if you outgrow llama.cpp concurrency, the
            vLLM lessons in this course pick up where datacenter serving begins.
          </li>
        </ul>
      </LessonSection>

      <Callout variant="beginner">
        You now have end-to-end llama.cpp mastery — from downloading a GGUF to running a production server, merging
        LoRA, and knowing when to reach for vLLM instead. Ship something real, benchmark it on your hardware, and
        let the numbers guide your next optimization.
      </Callout>

      <KeyTakeaways
        items={[
          'Decision tree: hardware → quant fit → -ngl sweep → context → concurrency → deploy or migrate to vLLM.',
          'Mastery = explain quants, bench pp/tg, deploy safely, convert custom models, and justify engine choice.',
          'Prototype with Ollama or llama-cli; production-tune with llama-bench and pinned deploy configs.',
          'When concurrency exceeds a few parallel slots, vLLM is the natural upgrade — same OpenAI client, different server.',
        ]}
      />
    </LessonArticle>
  )
}
