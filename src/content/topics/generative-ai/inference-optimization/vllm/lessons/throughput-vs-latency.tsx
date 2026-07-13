import {
  Callout,
  CodeBlock,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function ThroughputVsLatency() {
  return (
    <LessonArticle>
      <LessonSection title="Two goals that pull in opposite directions">
        <p className="text-slate-300">
          Serving LLMs means balancing <strong className="text-white">how fast one user gets a response</strong>{' '}
          (latency) against <strong className="text-white">how many tokens per second the fleet produces</strong>{' '}
          (throughput). vLLM's scheduler knobs let you tilt toward either — but rarely maximize both at once on
          fixed hardware.
        </p>
        <Definition term="TTFT (Time To First Token)">
          <p>
            Wall-clock time from sending the request until the first output token arrives. Dominated by queue wait
            + prefill (processing the prompt). Users perceive this as "how long until the model starts typing."
          </p>
        </Definition>
        <Definition term="TPOT (Time Per Output Token)">
          <p>
            Average time between consecutive generated tokens after the first. Dominated by decode phase. Lower TPOT
            = faster streaming. Often 20–80 ms per token depending on model size and batch load.
          </p>
        </Definition>
      </LessonSection>

      <LessonSection title="Key vLLM scheduler parameters">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Parameter</th>
                <th className="px-4 py-3">Effect</th>
                <th className="px-4 py-3">↑ value tends to…</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['max_num_seqs', 'Max concurrent sequences in a batch', '↑ throughput, ↑ TTFT (more queueing)'],
                ['max_num_batched_tokens', 'Tokens scheduled per iteration', '↑ prefill throughput, may hurt decode fairness'],
                ['gpu_memory_utilization', 'Fraction of GPU memory for KV cache', '↑ concurrency until OOM risk'],
                ['max_model_len', 'Max context length per request', '↓ concurrency (more KV per seq)'],
                ['enable_chunked_prefill', 'Interleave long prefills', '↓ tail latency for others'],
              ].map(([param, effect, trend]) => (
                <tr key={param} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-xs text-genai-400">{param}</td>
                  <td className="px-4 py-3 text-slate-400">{effect}</td>
                  <td className="px-4 py-3 text-slate-400">{trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CodeBlock title="Latency-optimized chat API">{`python -m vllm.entrypoints.openai.api_server \\
  --model meta-llama/Llama-3.1-8B-Instruct \\
  --max-num-seqs 64 \\
  --max-num-batched-tokens 4096 \\
  --enable-chunked-prefill \\
  --gpu-memory-utilization 0.90`}</CodeBlock>
        <CodeBlock title="Throughput-optimized batch worker">{`python -m vllm.entrypoints.openai.api_server \\
  --model meta-llama/Llama-3.1-8B-Instruct \\
  --max-num-seqs 256 \\
  --max-num-batched-tokens 16384 \\
  --gpu-memory-utilization 0.95`}</CodeBlock>
      </LessonSection>

      <LessonSection title="The max_num_seqs tradeoff">
        <p className="text-slate-300">
          <code className="font-mono text-sm">max_num_seqs</code> caps how many requests vLLM batches together.
          Higher values pack more decode jobs per GPU step → higher aggregate tokens/sec. But each request waits
          longer in the scheduler queue → higher TTFT p99.
        </p>
        <Flowchart
          title="Batch size vs user experience"
          chart={`flowchart LR
  L[Low max_num_seqs] --> F[Fast TTFT]
  L --> T1[Lower total tokens/sec]
  H[High max_num_seqs] --> S[Slow TTFT under load]
  H --> T2[Higher total tokens/sec]
  M[Measure p50 and p99] --> D[Pick target SLA then tune]`}
        />
        <Callout variant="tip">
          Define SLAs before tuning: e.g. "TTFT p99 &lt; 2s, TPOT &lt; 50ms." Load-test with realistic concurrent
          users — a single-request benchmark lies about production behavior.
        </Callout>
      </LessonSection>

      <LessonSection title="Measuring what matters">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">TTFT</strong> — measure from HTTP request start to first SSE chunk.
            Report p50, p95, p99.
          </li>
          <li>
            <strong className="text-white">TPOT / inter-token latency</strong> — from streaming chunks; users feel
            stutter if p99 TPOT spikes.
          </li>
          <li>
            <strong className="text-white">Throughput</strong> — total output tokens / wall time across all
            concurrent clients.
          </li>
          <li>
            <strong className="text-white">Goodput</strong> — successful tokens/sec excluding errors, timeouts,
            and truncated outputs.
          </li>
        </ul>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-slate-400">Rule of thumb for chat products</div>
          <div className="mt-2 text-slate-300">Prioritize TTFT and TPOT — users notice latency, not fleet tokens/sec.</div>
          <div className="mt-1 text-genai-400">For offline batch jobs — maximize throughput; latency per job is less critical.</div>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'TTFT = time until first token (prefill + queue); TPOT = time between output tokens (decode).',
          'Higher max_num_seqs boosts throughput but increases queue wait and TTFT under load.',
          'Use chunked prefill and moderate batch caps for interactive APIs; crank batching for offline jobs.',
          'Always load-test at target concurrency with p99 latency targets — not single-request benchmarks.',
        ]}
      />
    </LessonArticle>
  )
}
