import {
  Callout,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function PuttingItTogetherVllm() {
  return (
    <LessonArticle>
      <LessonSection title="From first server to production mastery">
        <p className="text-slate-300">
          You have covered the full vLLM optimization arc — quantization, parallelism, LoRA, caching, scheduling,
          speculative decode, monitoring, deployment, disaggregation, and engine comparison. This lesson ties it
          together with a <strong className="text-white">decision tree</strong>, a{' '}
          <strong className="text-white">production checklist</strong>, and the mental model of a senior inference
          engineer.
        </p>
        <Flowchart
          title="Full vLLM mastery path"
          chart={`flowchart TB
  F[Foundations — KV cache, batching] --> A[Architecture — PagedAttention]
  A --> G[Install + OpenAI API]
  G --> O[Optimization — quant, TP, LoRA, cache]
  O --> T[Tuning — TTFT, TPOT, max_num_seqs]
  O --> S[Speculative decode]
  T --> P[Production — Docker, K8s, LB]
  P --> M[Monitor + ShareGPT benchmarks]
  M --> D[Disaggregated V1 — advanced]
  M --> C[Engine comparison — justify vLLM]`}
        />
      </LessonSection>

      <LessonSection title="Configuration decision tree">
        <Flowchart
          title="Start here for any new deployment"
          chart={`flowchart TD
  START[New vLLM deployment] --> FIT{Model fits 1 GPU in target precision?}
  FIT -->|No| Q{Try AWQ/GPTQ 4-bit}
  Q -->|Fits| QOK[Deploy 4-bit]
  Q -->|Still no| TP[Tensor parallel across GPUs]
  FIT -->|Yes| RAG{RAG or shared system prompts?}
  RAG -->|Yes| PC[Enable prefix caching + static prefix first]
  RAG -->|No| LAT{Latency or throughput priority?}
  PC --> LAT
  LAT -->|Latency| LCFG[Lower max_num_seqs + chunked prefill]
  LAT -->|Throughput| HCFG[Higher max_num_seqs + gpu_mem_util 0.95]
  LCFG --> LORA{Multiple fine-tunes?}
  HCFG --> LORA
  LORA -->|Yes| ML[Multi-LoRA on one base]
  LORA -->|No| DEC{Decode-bound 70B+ chat?}
  ML --> DEC
  DEC -->|Yes| SD[Speculative decoding]
  DEC -->|No| DEP[Deploy + benchmark]
  SD --> DEP
  TP --> DEP
  QOK --> DEP`}
        />
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Problem</th>
                <th className="px-4 py-3">First knob to turn</th>
                <th className="px-4 py-3">If insufficient</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['OOM at startup', 'AWQ/GPTQ 4-bit or smaller model', 'Tensor parallel'],
                ['OOM under load', 'Lower max_model_len or max_num_seqs', 'More replicas or GPUs'],
                ['High TTFT p99', 'Chunked prefill, prefix cache, lower max_num_seqs', 'Scale replicas; disaggregated prefill'],
                ['Slow streaming (TPOT)', 'Speculative decoding, check batch contention', 'Dedicated decode pool (V1)'],
                ['10 fine-tuned variants', 'Multi-LoRA serving', 'Separate fleets only if LoRA quality insufficient'],
                ['RAG prefill redundant', 'Prefix caching + prompt structure', '—'],
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

      <LessonSection title="Production readiness checklist">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Model + quant validated</strong> — quality eval on your prompts, not
            just MMLU.
          </li>
          <li>
            <strong className="text-white">Config documented</strong> — model, dtype, TP/PP, max_model_len,
            max_num_seqs, gpu_memory_utilization pinned in version control.
          </li>
          <li>
            <strong className="text-white">ShareGPT benchmark</strong> — TTFT/TPOT p99 at target request rate
            recorded as baseline.
          </li>
          <li>
            <strong className="text-white">Container image pinned</strong> — not <code className="font-mono text-sm">latest</code>;
            HF cache on persistent volume.
          </li>
          <li>
            <strong className="text-white">Health probes</strong> — /health readiness with long initial delay;
            liveness tuned to avoid killing long streams.
          </li>
          <li>
            <strong className="text-white">Load balancer</strong> — streaming enabled (proxy_buffering off); least-conn
            or equivalent.
          </li>
          <li>
            <strong className="text-white">Monitoring</strong> — TTFT, TPOT, queue depth, KV usage, prefix hit rate
            in dashboards; alerts on p99 SLA breach.
          </li>
          <li>
            <strong className="text-white">Auth + rate limits</strong> — at API gateway, not inside vLLM.
          </li>
          <li>
            <strong className="text-white">Rollback plan</strong> — previous image tag and config one command away.
          </li>
          <li>
            <strong className="text-white">Runbook</strong> — what to do when waiting reqs &gt; 0, KV at 100%, or
            preemptions spike.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Mastery self-assessment">
        <p className="text-slate-300">You have reached vLLM mastery when you can:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-300">
          <li>Explain why PagedAttention enables continuous batching and prefix caching.</li>
          <li>Size GPU memory for weights + KV cache given model, quant, context length, and concurrency.</li>
          <li>Choose AWQ vs GPTQ vs FP16 and justify with your eval data.</li>
          <li>Configure TP/PP for a 70B model on a given hardware budget.</li>
          <li>Tune max_num_seqs to hit a TTFT p99 SLA under load.</li>
          <li>Deploy a replicated vLLM fleet behind a load balancer with streaming.</li>
          <li>Benchmark with ShareGPT and interpret p99 metrics, not just averages.</li>
          <li>Articulate when vLLM beats Ollama, TGI, or TensorRT-LLM for your use case.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Common mistakes at the finish line">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Skipping load tests</strong> — single-request demos hide queue collapse at
            50 concurrent users.
          </li>
          <li>
            <strong className="text-white">Maxing every knob</strong> — gpu_memory_utilization 0.99 + max_num_seqs
            512 causes preemptions; tune incrementally.
          </li>
          <li>
            <strong className="text-white">Dynamic content before static in RAG</strong> — breaks prefix cache;
            structure prompts deliberately.
          </li>
          <li>
            <strong className="text-white">No version pins</strong> — vLLM upgrade silently changes scheduler
            behavior.
          </li>
          <li>
            <strong className="text-white">Disaggregation too early</strong> — coupled vLLM + cache + chunked prefill
            solves most problems first.
          </li>
        </ul>
      </LessonSection>

      <Callout variant="beginner">
        You now have end-to-end vLLM mastery — from why inference optimization matters to running a production GPU
        fleet. Build apps with LangChain pointing at your vLLM OpenAI endpoint; operate with the monitoring and
        benchmark discipline from this track.
      </Callout>

      <KeyTakeaways
        items={[
          'Use the decision tree: fit model → quant → TP → cache → latency/throughput tuning → LoRA → spec decode → deploy.',
          'Production readiness = pinned versions, ShareGPT baselines, health checks, streaming LB, and p99 alerts.',
          'Optimize coupled vLLM fully before disaggregated serving — most teams never need V1 disaggregation.',
          'Mastery is explaining tradeoffs and hitting SLAs under load — not just starting a server once.',
        ]}
      />
    </LessonArticle>
  )
}
