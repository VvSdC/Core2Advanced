import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function ScalingRagInProduction() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Read this after">
        Complete the <em>Vector Databases</em> and <em>Retrieval Strategies</em> tracks first. This lesson is about making
        a working RAG system fast and cheap at real traffic.
      </Callout>

      <Definition term="Scaling RAG">
        <p>
          A RAG prototype that works for one user can fall over at a thousand. Scaling means keeping{' '}
          <strong className="text-white">latency</strong> low and <strong className="text-white">cost</strong> under
          control as documents, queries, and users grow — without hurting answer quality. The main levers are the vector
          database, caching, parallelism, and indexing choices.
        </p>
      </Definition>

      <LessonSection title="First, find where the time and money go">
        <p>
          Every RAG request is a pipeline. Before optimising, measure each stage — you can only fix what you can see.
        </p>
        <Flowchart
          title="The RAG latency budget"
          chart={`flowchart TB
  A["Embed the query (~10-40 ms)"] --> B["Vector search / retrieve (~10-50 ms)"]
  B --> C["Rerank top candidates (~50-150 ms)"]
  C --> D["LLM generation (~500-3000 ms)  <-- usually the biggest"]
  D --> E["Total = sum of stages"]`}
        />
        <Example
          title="A latency budget for one request"
          output={`Embed query :   25 ms
Retrieve    :   30 ms
Rerank      :  120 ms
Generate    : 1800 ms   <- 90% of the wait
------------------------
Total       : 1975 ms

Biggest lever: generation (stream it!) then rerank.`}
          caption="Generation almost always dominates. Optimise the biggest bar first, not the easiest one."
        >{`stages = {"embed": 25, "retrieve": 30, "rerank": 120, "generate": 1800}
total = sum(stages.values())
for name, ms in stages.items():
    print(f"{name:9}: {ms:>4} ms  ({ms/total*100:4.1f}%)")
print(f"{'total':9}: {total:>4} ms")`}</Example>
        <Callout variant="insight">
          Retrieval is rarely the bottleneck — <strong className="text-white">generation is</strong>. That's why{' '}
          <strong className="text-white">streaming</strong> the answer (so users read as it's written) improves perceived
          speed more than shaving milliseconds off vector search.
        </Callout>
      </LessonSection>

      <LessonSection title="Lever 1 — Caching (do less work twice)">
        <p>Caching is the highest-leverage cost/latency win. There are three distinct layers:</p>
        <ContentStep number={1} title="Embedding cache — never re-embed unchanged text">
          <p>
            Hash each chunk's text; if the hash is unchanged, reuse the stored vector instead of paying to embed it again.
            This makes re-indexing cheap: only new or edited documents are embedded.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Query cache — reuse retrieval for repeat questions">
          <p>
            Popular questions repeat constantly. Cache the retrieved chunk IDs keyed by the (normalised) query, so
            identical queries skip the vector search entirely. A <strong className="text-white">semantic cache</strong>{' '}
            goes further: if a new query is very similar (high cosine) to a cached one, reuse its result.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Answer cache — skip generation for FAQs">
          <p>
            For truly common questions, cache the final generated answer (with its citations). This eliminates the biggest
            cost — the LLM call — for repeat traffic. Add a short TTL so answers refresh when documents change.
          </p>
        </ContentStep>
        <Example
          title="How much a 40% cache hit rate saves"
          output={`10,000 queries/day, $0.004 per LLM answer
Without cache: $40.00/day
40% answer-cache hit rate: 6,000 paid calls
With cache:    $24.00/day  (40% cheaper)`}
          caption="Cache hits also return in ~1 ms instead of ~2 s — cheaper AND faster."
        >{`queries = 10_000
cost_per_answer = 0.004
hit_rate = 0.40

without = queries * cost_per_answer
paid = int(queries * (1 - hit_rate))
with_cache = paid * cost_per_answer

print(f"Without cache: \${without:.2f}/day")
print(f"{paid} paid calls")
print(f"With cache:    \${with_cache:.2f}/day  ({hit_rate*100:.0f}% cheaper)")`}</Example>
        <Callout variant="tip">
          Cache invalidation is the catch: when a document changes, its cached answers/retrievals can go stale. Use short
          TTLs, or bust the cache for a document's keys whenever you re-index it.
        </Callout>
      </LessonSection>

      <LessonSection title="Lever 2 — Parallelism (overlap independent work)">
        <p>
          Stages that don't depend on each other should run at the same time. Classic wins:
        </p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Parallel retrieval</strong> — run dense and BM25 (hybrid), or search multiple
            indexes/collections, concurrently and merge — instead of one after another.
          </li>
          <li>
            <strong className="text-white">Multi-query in parallel</strong> — when you expand one question into several,
            fire all the searches at once.
          </li>
          <li>
            <strong className="text-white">Batch embedding</strong> — embed many chunks per API call during indexing;
            batching is dramatically cheaper and faster than one-at-a-time.
          </li>
        </ul>
        <Callout variant="info">
          Parallelism cuts <em>latency</em> for a single request; batching cuts <em>cost and time</em> for bulk indexing.
          Both matter, at different points in the lifecycle.
        </Callout>
      </LessonSection>

      <LessonSection title="Lever 3 — The right index and database">
        <p>
          At small scale, exact (brute-force) search is fine. As vectors grow into the millions, switch to{' '}
          <strong className="text-white">Approximate Nearest Neighbour (ANN)</strong> indexes — you trade a tiny bit of
          recall for a massive speed-up.
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Scale</th>
                <th className="px-4 py-3">Reasonable choice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['< 100k vectors, one machine', 'FAISS / Chroma, exact or HNSW; simplest to run'],
                ['1M–100M vectors', 'HNSW index; managed DB (Pinecone) or Qdrant/Milvus/pgvector'],
                ['> 100M, high QPS, filters', 'Distributed Milvus / Qdrant; IVF+PQ to compress, sharding'],
              ].map(([scale, choice]) => (
                <tr key={scale} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{scale}</td>
                  <td className="px-4 py-3 text-slate-400">{choice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">HNSW</strong> — fast, high-recall graph index; more memory. Great default.
          </li>
          <li>
            <strong className="text-white">IVF + PQ</strong> — clusters + compresses vectors; huge memory savings at
            billion scale, slightly lower recall.
          </li>
          <li>
            <strong className="text-white">Self-host vs managed</strong> — FAISS/pgvector are cheap to start but you run
            them; Pinecone and friends cost more but handle scaling, replication, and ops for you.
          </li>
        </ul>
        <Callout variant="tip">
          Don't reach for billion-scale infrastructure on day one. Start on the simplest option that fits, and move to a
          managed/distributed DB only when metrics (latency, QPS, index size) actually demand it.
        </Callout>
      </LessonSection>

      <LessonSection title="Lever 4 — Cut generation cost (the biggest bill)">
        <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Send fewer/tighter chunks</strong> — reranking to top 3–5 beats dumping 20
            chunks: cheaper prompts, less "lost in the middle", better answers.
          </li>
          <li>
            <strong className="text-white">Right-size the model</strong> — use a smaller/cheaper LLM for easy queries and
            escalate to a bigger one only when needed (a routing pattern).
          </li>
          <li>
            <strong className="text-white">Cap max output tokens</strong> — generation cost scales with tokens produced.
          </li>
          <li>
            <strong className="text-white">Answer cache</strong> — the cheapest LLM call is the one you never make.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="A cost lens — where the dollars actually go">
        <p className="text-slate-300">
          Every RAG bill breaks into four line items. Know the shape before you optimise.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Line item</th>
                <th className="px-4 py-3">Rough share of bill</th>
                <th className="px-4 py-3">Highest-leverage lever</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['LLM generation (input + output tokens)', '60–85%', 'Answer cache; smaller model on easy queries; cap output tokens; prompt caching'],
                ['Embedding calls (indexing + query embed)', '5–20%', 'Content-hash embedding cache; batch API; self-host a small embedding model'],
                ['Vector DB (storage + QPS)', '5–15%', 'Right-size index (IVF+PQ at scale); dimension reduction; drop stale namespaces'],
                ['Reranker', '2–8%', 'Rerank only the top 20–50; use a smaller cross-encoder; skip reranking for high-confidence hits'],
              ].map(([item, share, lever]) => (
                <tr key={item}>
                  <td className="px-4 py-3 font-semibold text-white">{item}</td>
                  <td className="px-4 py-3 text-slate-400">{share}</td>
                  <td className="px-4 py-3 text-slate-400">{lever}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Example
          title="Toy math — five levers stacked"
          output={`Baseline    : 100,000 QPD × $0.010/query = $1,000/day
+ Answer cache (30% hit, free)         -> $700/day  (-30%)
+ Route 60% of misses to a cheap model -> $427/day  (-39%)
+ Rerank top-5 not top-20, prompt cache-> $342/day  (-20%)
+ Cap output at 300 tokens             -> $290/day  (-15%)
+ Embedding cache on reindex           -> $272/day  (-6%)
Final       : $272/day  (73% cheaper than baseline)`}
          caption="Stacked levers compound. Almost none of the savings come from the vector DB — they come from generation."
        >{`baseline = 100_000 * 0.010
after = baseline
for pct in (0.30, 0.39, 0.20, 0.15, 0.06):
    after = after * (1 - pct)
    print(f"-> \${after:.0f}/day")`}</Example>
        <Callout variant="insight" title="Optimise the biggest bar first">
          Vector-DB pricing gets all the attention because it is a line item on a bill. But almost every RAG
          system that runs out of money runs out of money on <em>generation tokens</em>. Cut generation before
          you tune the index.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Measure the latency budget per stage first — generation usually dominates, so stream it and optimise it first.',
          'Caching is the biggest win: embedding cache (skip re-embedding), query/semantic cache (skip retrieval), answer cache (skip generation).',
          'Parallelise independent work (hybrid/multi-query retrieval) for latency; batch embeddings for cheap indexing.',
          'Use ANN indexes (HNSW; IVF+PQ at huge scale) and only move to managed/distributed vector DBs when metrics demand it.',
          '60–85% of a RAG bill is generation tokens — attack that first: answer cache, smaller model on easy queries, capped output, prompt caching.',
        ]}
      />
    </LessonArticle>
  )
}
