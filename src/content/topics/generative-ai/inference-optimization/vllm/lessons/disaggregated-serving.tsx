import {
  Callout,
  CodeBlock,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function DisaggregatedServing() {
  return (
    <LessonArticle>
      <LessonSection title="Prefill and decode want different things">
        <p className="text-slate-300">
          In standard vLLM, the same GPU handles both <strong className="text-white">prefill</strong> (processing
          the prompt — compute-heavy, parallel) and <strong className="text-white">decode</strong> (generating
          tokens one-by-one — memory-bandwidth-heavy). Under mixed load, they interfere: a burst of long prefills
          spikes TTFT for everyone; heavy decode batches starve new prefills.
        </p>
        <Definition term="Disaggregated serving">
          <p>
            Splitting prefill and decode onto separate GPU pools (or nodes). Prefill workers compute KV cache for
            new prompts; decode workers stream tokens using transferred KV state. Each pool sizes hardware for its
            phase — more compute for prefill, more memory bandwidth for decode.
          </p>
        </Definition>
      </LessonSection>

      <LessonSection title="Why disaggregate?">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Phase</th>
                <th className="px-4 py-3">Workload shape</th>
                <th className="px-4 py-3">Ideal hardware</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Prefill', 'Large matmuls over full prompt', 'Compute-rich GPUs (high FLOPS)'],
                ['Decode', 'Small batched steps, KV memory bound', 'High memory bandwidth, large KV pool'],
                ['Coupled (classic vLLM)', 'Both compete in one scheduler', 'Compromise — neither optimal at scale'],
              ].map(([phase, shape, hw]) => (
                <tr key={phase} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{phase}</td>
                  <td className="px-4 py-3 text-slate-400">{shape}</td>
                  <td className="px-4 py-3 text-genai-400">{hw}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Flowchart
          title="Disaggregated request path"
          chart={`flowchart LR
  C[Client request] --> P[Prefill node]
  P --> KV[KV cache computed]
  KV --> X[Transfer KV blocks]
  X --> D[Decode node]
  D --> S[Stream tokens to client]`}
        />
      </LessonSection>

      <LessonSection title="vLLM V1 and disaggregation preview">
        <p className="text-slate-300">
          vLLM's next-generation <strong className="text-white">V1 engine</strong> rewrites the core scheduler and
          memory manager for lower overhead and cleaner separation of concerns.{' '}
          <strong className="text-white">Disaggregated prefill/decode</strong> is a headline V1 feature (preview /
          evolving) — check current docs for stability before production bets.
        </p>
        <CodeBlock title="Conceptual V1 disaggregated launch (flags evolve)">{`# Prefill worker (example — verify against latest vLLM docs)
VLLM_USE_V1=1 python -m vllm.entrypoints.openai.api_server \\
  --model meta-llama/Llama-3.1-70B-Instruct \\
  --port 8100 \\
  --kv-transfer-config '{"kv_connector":"...", "kv_role":"kv_producer"}'

# Decode worker
VLLM_USE_V1=1 python -m vllm.entrypoints.openai.api_server \\
  --model meta-llama/Llama-3.1-70B-Instruct \\
  --port 8200 \\
  --kv-transfer-config '{"kv_connector":"...", "kv_role":"kv_consumer"}'`}</CodeBlock>
        <Callout variant="beginner">
          Disaggregated serving is cutting-edge. API flags and connectors change between vLLM releases. Treat this
          lesson as architectural context; validate exact commands against the version you deploy.
        </Callout>
      </LessonSection>

      <LessonSection title="KV transfer — the hard part">
        <p className="text-slate-300">
          Moving KV cache from prefill to decode nodes must be fast enough that transfer cost is less than the
          interference you eliminate. Approaches include RDMA (InfiniBand), NCCL, or shared storage — latency and
          bandwidth dictate feasibility.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Long prompts</strong> — large KV payloads; transfer cost amortizes over
            many decode tokens.
          </li>
          <li>
            <strong className="text-white">Short prompts</strong> — transfer overhead may dominate; coupled serving
            wins.
          </li>
          <li>
            <strong className="text-white">Same rack / NVLink</strong> — disaggregation works best with low-latency
            interconnects.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="When to adopt — decision guide">
        <Flowchart
          title="Coupled vs disaggregated"
          chart={`flowchart TD
  Q[Traffic mostly short prompts?] -->|Yes| C[Stay coupled — simpler]
  Q -->|No| L[Long RAG prefills hurting decode TTFT?]
  L -->|Yes| D[Evaluate disaggregated prefill]
  L -->|No| C
  D --> I{Fast interconnect between nodes?}
  I -->|No| C
  I -->|Yes| P[Pilot with V1 preview + benchmark]`}
        />
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">High-scale chat + RAG</strong> — prime candidate when p99 TTFT degrades
            under decode-heavy load.
          </li>
          <li>
            <strong className="text-white">Small deployments</strong> — operational complexity rarely justified below
            multi-GPU fleet scale.
          </li>
          <li>
            <strong className="text-white">Chunked prefill + prefix cache first</strong> — try coupled optimizations
            before splitting clusters.
          </li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Disaggregated serving separates prefill (compute) from decode (memory bandwidth) onto dedicated GPU pools.',
          'KV cache must transfer between nodes — only worth it with fast interconnects and long-prompt workloads.',
          'vLLM V1 preview enables this architecture; flags and stability evolve — verify docs for your version.',
          'Try prefix caching and chunked prefill on coupled vLLM before adopting disaggregation complexity.',
        ]}
      />
    </LessonArticle>
  )
}
