import {
  Callout,
  CodeBlock,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function PrefixCachingAndChunkedPrefill() {
  return (
    <LessonArticle>
      <LessonSection title="Repeated prefixes are everywhere">
        <p className="text-slate-300">
          RAG pipelines, system prompts, few-shot examples, and chat histories all share long{' '}
          <strong className="text-white">identical prefixes</strong> across requests. Without optimization, vLLM
          recomputes the KV cache for that prefix on every request — wasting GPU time.{' '}
          <strong className="text-white">Automatic prefix caching</strong> stores and reuses KV blocks for shared
          prefixes.
        </p>
        <Definition term="Prefix caching">
          <p>
            When two requests share the same token prefix (e.g., identical system prompt + document), vLLM reuses
            the already-computed KV cache blocks for that prefix instead of running prefill again. New tokens are
            computed only from the divergence point onward.
          </p>
        </Definition>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-slate-400">RAG example — 8K token document in every request</div>
          <div className="mt-2 text-slate-300">Without prefix cache → full 8K prefill per user question</div>
          <div className="mt-1 text-genai-400">With prefix cache → 8K prefill once; subsequent questions add only the query tokens</div>
        </div>
      </LessonSection>

      <LessonSection title="Enabling prefix caching">
        <p className="text-slate-300">
          In recent vLLM versions, prefix caching is enabled by default or via a simple flag. It works with
          PagedAttention — cached blocks are reference-counted and evicted under memory pressure like normal KV
          pages.
        </p>
        <CodeBlock title="Explicit prefix caching">{`python -m vllm.entrypoints.openai.api_server \\
  --model meta-llama/Llama-3.1-8B-Instruct \\
  --enable-prefix-caching \\
  --max-model-len 32768`}</CodeBlock>
        <Callout variant="tip">
          Prefix caching helps most when prompts are <em>byte-identical</em> through the shared section. Changing
          one token in the system prompt invalidates the cache from that point — version prompts carefully.
        </Callout>
      </LessonSection>

      <LessonSection title="Chunked prefill — long context without blocking">
        <Definition term="Chunked prefill">
          <p>
            Splits a long prefill into smaller chunks and interleaves them with ongoing decode work from other
            requests. Prevents one huge prefill from monopolizing the GPU and starving interactive decode jobs —
            improving tail latency under mixed workloads.
          </p>
        </Definition>
        <p className="mt-4 text-slate-300">
          Long documents (32K+ tokens) can cause noticeable latency spikes for other users if processed in one
          giant prefill kernel. Chunked prefill breaks the work into schedulable pieces.
        </p>
        <CodeBlock title="Chunked prefill settings">{`python -m vllm.entrypoints.openai.api_server \\
  --model meta-llama/Llama-3.1-8B-Instruct \\
  --enable-chunked-prefill \\
  --max-num-batched-tokens 8192`}</CodeBlock>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">max-num-batched-tokens</strong> — caps tokens processed per scheduler
            step; lower values improve fairness, higher values improve prefill throughput.
          </li>
          <li>
            <strong className="text-white">Mixed workloads</strong> — chat + RAG + batch jobs benefit most from
            chunked prefill.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="How they work together">
        <Flowchart
          title="Prefix cache + chunked prefill"
          chart={`flowchart TD
  R1[Request A — full RAG prompt] --> P[Prefill chunks computed]
  P --> C[KV blocks stored — prefix cached]
  R2[Request B — same doc, new question] --> H[Cache hit on shared prefix]
  H --> Q[Prefill only new question tokens]
  Q --> D[Decode alongside other users' requests]
  D --> CH[Chunked scheduler interleaves work]`}
        />
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Technique</th>
                <th className="px-4 py-3">Solves</th>
                <th className="px-4 py-3">Best for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Prefix caching', 'Redundant prefill on identical prefixes', 'RAG, shared system prompts, few-shot templates'],
                ['Chunked prefill', 'Long prefill blocking decode', '32K+ context, multi-tenant chat APIs'],
                ['Both combined', 'Fast RAG + fair scheduling', 'Production RAG at scale'],
              ].map(([tech, solves, best]) => (
                <tr key={tech} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{tech}</td>
                  <td className="px-4 py-3 text-slate-400">{solves}</td>
                  <td className="px-4 py-3 text-genai-400">{best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Callout variant="beginner">
        Structure prompts so static content (system instructions, retrieved documents) comes{' '}
        <strong className="text-white">before</strong> dynamic content (user message). Prefix caching only helps
        on shared leading tokens — not on suffixes that change every request.
      </Callout>

      <KeyTakeaways
        items={[
          'Prefix caching reuses KV blocks for identical prompt prefixes — huge wins for RAG and shared system prompts.',
          'Chunked prefill splits long prefills so decode jobs are not starved — critical for mixed workloads.',
          'Keep static prompt content at the start; one changed token breaks the cache from that point.',
          'Tune max-num-batched-tokens to balance prefill throughput vs interactive latency fairness.',
        ]}
      />
    </LessonArticle>
  )
}
