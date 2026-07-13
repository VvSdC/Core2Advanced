import {
  Callout,
  CodeBlock,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function MonitoringAndBenchmarking() {
  return (
    <LessonArticle>
      <LessonSection title="You cannot tune what you do not measure">
        <p className="text-slate-300">
          vLLM exposes rich runtime statistics — cache hit rates, batch sizes, queue depths, and token throughput.
          Pair these with external load tests to know whether your config survives real traffic, not just a demo
          request.
        </p>
      </LessonSection>

      <LessonSection title="Metrics that matter in production">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Metric</th>
                <th className="px-4 py-3">What it tells you</th>
                <th className="px-4 py-3">Alert if…</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['TTFT p99', 'User wait before first token', 'Exceeds SLA (e.g. > 3s)'],
                ['TPOT / inter-token latency', 'Streaming smoothness', 'Spikes under load'],
                ['Requests running / waiting', 'Scheduler backlog', 'Waiting queue grows unbounded'],
                ['GPU KV cache usage %', 'Memory pressure', 'Near 100% → preemptions or rejects'],
                ['Prefix cache hit rate', 'RAG optimization working', 'Near 0% with shared prompts → misconfigured'],
                ['Tokens/sec (prompt + generation)', 'Fleet capacity', 'Drops vs baseline after deploy'],
                ['Preemptions', 'Requests evicted from GPU', 'Any sustained preemptions hurt latency'],
              ].map(([metric, tells, alert]) => (
                <tr key={metric} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{metric}</td>
                  <td className="px-4 py-3 text-slate-400">{tells}</td>
                  <td className="px-4 py-3 text-genai-400">{alert}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Reading vLLM logs">
        <p className="text-slate-300">
          vLLM logs periodic stats lines (interval varies by version). Look for running/waiting request counts,
          GPU cache usage, and throughput:
        </p>
        <CodeBlock title="Typical stats log line (abbreviated)">{`INFO: Avg prompt throughput: 1200.5 tokens/s,
  Avg generation throughput: 850.3 tokens/s,
  Running: 32 reqs, Waiting: 8 reqs,
  GPU KV cache usage: 78.2%,
  Prefix cache hit rate: 45.1%`}</CodeBlock>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Waiting &gt; 0 sustained</strong> — you are over capacity; scale replicas
            or reduce max_num_seqs per instance.
          </li>
          <li>
            <strong className="text-white">KV cache near 100%</strong> — risk of preemption; lower max_model_len or
            add GPUs.
          </li>
          <li>
            <strong className="text-white">Low prefix hit rate with RAG</strong> — prompts may not share identical
            prefixes; check prompt templating.
          </li>
        </ul>
        <Callout variant="tip">
          Export vLLM metrics to Prometheus via the built-in metrics endpoint (when enabled) and dashboard in
          Grafana. Correlate GPU util from nvidia-smi with vLLM scheduler stats — 100% GPU with low tokens/sec
          often means memory-bound batching, not compute-bound.
        </Callout>
      </LessonSection>

      <LessonSection title="Benchmarking with ShareGPT-style workloads">
        <p className="text-slate-300">
          The <strong className="text-white">ShareGPT</strong> dataset (real multi-turn chat traces) is the de facto
          standard for benchmarking serving systems. vLLM ships benchmarking scripts that replay conversation lengths
          and request rates similar to production chat.
        </p>
        <CodeBlock title="vLLM benchmark_serving (conceptual)">{`# Install vLLM with bench extras, then:
python benchmarks/benchmark_serving.py \\
  --backend vllm \\
  --model meta-llama/Llama-3.1-8B-Instruct \\
  --dataset-name sharegpt \\
  --dataset-path ./ShareGPT_V3_unfiltered_cleaned_split.json \\
  --num-prompts 1000 \\
  --request-rate 10 \\
  --percentile-metrics ttft,tpot,itl`}</CodeBlock>
        <Example title="Key benchmark flags">{`--request-rate 10     # 10 new requests/sec (Poisson or fixed)
--num-prompts 1000    # total requests in the run
--percentile-metrics  # output p50/p95/p99 for TTFT, TPOT, ITL
--max-concurrency 50  # cap parallel clients`}</Example>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Sweep request rates</strong> — find the knee where TTFT p99 explodes.
          </li>
          <li>
            <strong className="text-white">Use your own traces</strong> — export production prompt length
            distributions for realistic RAG benchmarks.
          </li>
          <li>
            <strong className="text-white">Warm up</strong> — run 50–100 requests before recording; first requests
            include model load and CUDA warmup.
          </li>
          <li>
            <strong className="text-white">Compare configs A/B</strong> — same dataset, same rate; only change one
            knob per experiment.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Benchmark checklist">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Record model, quantization, TP size, max_num_seqs, max_model_len for every run.</li>
          <li>Report TTFT and TPOT at p50, p95, p99 — not just averages.</li>
          <li>Monitor GPU memory and preemptions during the benchmark.</li>
          <li>Re-benchmark after driver, vLLM, or CUDA upgrades.</li>
          <li>Store results in a spreadsheet or MLflow — regressions are subtle.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Watch TTFT, TPOT, queue depth, KV cache usage, and prefix cache hit rate in production.',
          'vLLM logs print throughput and scheduler state — sustained waiting reqs mean you are over capacity.',
          'Benchmark with ShareGPT or your own traces at realistic request rates — not single-request tests.',
          'Change one config knob per experiment and always report latency percentiles, not just throughput.',
        ]}
      />
    </LessonArticle>
  )
}
