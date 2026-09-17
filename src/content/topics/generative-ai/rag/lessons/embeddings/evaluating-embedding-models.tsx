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

export function EvaluatingEmbeddingModels() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Read this after">
        Complete <em>Embeddings → What Are Embeddings</em> and <em>Evaluating RAG → Retrieval Metrics</em> first. This
        lesson ties them together into a repeatable way to pick the <em>right</em> embedding model.
      </Callout>

      <Definition term="Evaluating embeddings">
        <p>
          The embedding model decides <em>what gets retrieved</em>, so it sets the ceiling on your whole RAG system. No
          reranker or clever prompt can rescue answers when the right chunk was never retrieved. Evaluating embeddings
          means <strong className="text-white">measuring, on your own data, whether the model actually places relevant
          chunks near the query</strong> — not trusting a leaderboard.
        </p>
      </Definition>

      <Callout variant="insight">
        A model that tops a public benchmark (like MTEB) can still underperform on <em>your</em> jargon, product names, or
        language. Benchmarks are a shortlist, not a verdict. The only test that matters is on your documents and your
        real queries.
      </Callout>

      <LessonSection title="Step 1 — Build a golden test set">
        <p>
          You cannot measure retrieval without knowing the right answer. Create a{' '}
          <strong className="text-white">golden set</strong>: 30–100 real queries, each labelled with the chunk(s) that
          truly answer it. Draw the queries from real users or subject-matter experts so they match production phrasing.
        </p>
        <Example
          title="A golden set entry"
          output={`{
  "query": "how long to get a refund for store items?",
  "relevant_chunk_ids": ["handbook_p34", "handbook_p35"]
}`}
          caption="Each query is tied to the chunk IDs that should be retrieved. This is your answer key."
        >{`golden = [
    {"query": "how long to get a refund for store items?",
     "relevant_chunk_ids": ["handbook_p34", "handbook_p35"]},
    {"query": "what is the remote work policy?",
     "relevant_chunk_ids": ["handbook_p12"]},
    # ... aim for 30-100 realistic queries
]`}</Example>
      </LessonSection>

      <LessonSection title="Step 2 — The A/B workflow (hold everything else constant)">
        <p>
          To compare embedding models fairly, change <strong className="text-white">only the embedding model</strong>. Use
          the same chunks, same chunk size, same top-k, same golden set. Then compute the same retrieval metrics for each
          and compare side by side.
        </p>
        <Flowchart
          title="Fair embedding A/B test"
          chart={`flowchart TB
  A["Same chunks + same golden set"] --> B["Embed with Model A"]
  A --> C["Embed with Model B"]
  B --> D["Retrieve top-k for each golden query"]
  C --> D
  D --> E["Compute Recall@k, MRR, NDCG"]
  E --> F["Compare scores + cost + latency -> pick"]`}
        />
        <Example
          title="Comparing two embedding models on the golden set"
          output={`Model            Recall@5   MRR    $/1M   dim
--------------------------------------------------
text-embed-3-sm    0.78     0.61   0.02    1536
bge-large-en       0.86     0.71   0.00    1024   <- best recall, free (self-host)

Winner by recall: bge-large-en (+8 pts). Confirm with spot-checks.`}
          caption="Only the embedding model changed. Recall@k tells you what fraction of answers were retrievable at all."
        >{`# Pretend we already ran retrieval for each model on the golden set.
results = {
    "text-embed-3-sm": {"recall@5": 0.78, "mrr": 0.61, "cost": 0.02, "dim": 1536},
    "bge-large-en":    {"recall@5": 0.86, "mrr": 0.71, "cost": 0.00, "dim": 1024},
}

print(f"{'Model':16} {'Recall@5':>8} {'MRR':>6} {'$/1M':>6} {'dim':>5}")
for name, m in results.items():
    print(f"{name:16} {m['recall@5']:>8.2f} {m['mrr']:>6.2f} {m['cost']:>6.2f} {m['dim']:>5}")

best = max(results, key=lambda n: results[n]["recall@5"])
print(f"\\nWinner by recall: {best}")`}</Example>
        <Callout variant="tip">
          <strong className="text-white">Recall@k</strong> answers "was the right chunk retrieved at all?" — the most
          important embedding-quality signal. <strong className="text-white">MRR</strong> answers "how high was it ranked?"
          Low MRR with high recall means you need a reranker, not a new embedding model.
        </Callout>
      </LessonSection>

      <LessonSection title="Step 3 — Spot-check by hand (numbers can lie)">
        <p>
          Metrics summarise; they don't explain. Always <strong className="text-white">read the actual top-k chunks</strong>{' '}
          for a sample of queries — especially the failures. This reveals problems a single number hides.
        </p>
        <ContentStep number={1} title="Inspect the misses">
          <p>
            For every query where the right chunk was <em>not</em> in the top-k, look at what <em>was</em> returned. Is it
            a chunking problem (answer split across two chunks)? A vocabulary mismatch (the query says "PTO", the doc says
            "paid time off")? A domain-term failure (the model doesn't understand your product names)?
          </p>
        </ContentStep>
        <ContentStep number={2} title="Watch for false confidence">
          <p>
            Check the scores of the wrong chunks. If irrelevant chunks score high, semantic similarity is misleading for
            your domain — a sign you may need a domain/specialized embedding model, hybrid search, or a threshold.
          </p>
        </ContentStep>
        <Callout variant="beginner" title="Spot-check checklist">
          For ~10 sampled queries: (1) Is the true chunk in top-k? (2) If not, where is it — rank 20, or missing entirely?
          (3) Do the wrong chunks share vocabulary but not meaning? (4) Would a human agree the top chunk is the best
          match? Trust the metrics only once the spot-checks agree with them.
        </Callout>
      </LessonSection>

      <LessonSection title="Step 4 — Weigh the tradeoffs, not just accuracy">
        <p>The highest-recall model isn't automatically the right choice. Balance:</p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Factor</th>
                <th className="px-4 py-3">Why it matters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Recall@k / MRR', 'Retrieval quality on your golden set — the primary signal'],
                ['Dimensions', 'Higher dims = more storage + slower search + bigger index'],
                ['Cost', 'API $/1M tokens vs free self-hosted (needs a GPU)'],
                ['Latency', 'Embedding call time affects TTFT for every query'],
                ['Max input length', 'Must fit your chunk size without truncation'],
                ['Privacy', 'Can data leave your network? Self-host if not'],
              ].map(([factor, why]) => (
                <tr key={factor} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{factor}</td>
                  <td className="px-4 py-3 text-slate-400">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="info">
          One hard rule: <strong className="text-white">you must use the same embedding model for indexing and querying.</strong>{' '}
          Switching models means re-embedding your entire corpus, because vectors from different models are not comparable.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'The embedding model sets the ceiling on retrieval — evaluate it on your own data, not just public leaderboards.',
          'Build a golden set (30–100 real queries labelled with the chunks that answer them) as your answer key.',
          'A/B fairly: change only the embedding model, keep chunks/top-k/golden set fixed, then compare Recall@k and MRR.',
          'Always spot-check top-k chunks by hand — especially misses — to catch vocabulary/domain issues metrics hide.',
          'Pick on the full tradeoff (recall, dimensions, cost, latency, privacy), and never mix embedding models between indexing and querying.',
        ]}
      />
    </LessonArticle>
  )
}
