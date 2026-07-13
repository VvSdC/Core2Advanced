import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function RetrievalMetrics() {
  return (
    <LessonArticle>
      <Definition term="Retrieval metrics">
        <p>
          Retrieval metrics answer one question: <strong className="text-white">did the search step find the
          right evidence?</strong> You run retrieval on your test questions, compare the returned chunks against
          your hand-labelled correct chunks, and score how often retrieval succeeds.
        </p>
        <p>
          These metrics are measured <em>before</em> the LLM generates anything. If retrieval scores are low, no
          prompt tweak will save you.
        </p>
      </Definition>

      <LessonSection title="Recall@k — the metric that matters most">
        <p className="text-slate-300">
          Recall@k asks: for each test question, is at least one labelled correct chunk somewhere in the top-k
          retrieved results? Aggregate across all questions and you get a percentage.
        </p>

        <ContentStep number={1} title="Set up a concrete example — 10 chunks, 1 test question">
          <p>
            Your vector database has 10 chunks from a refund policy document. You labelled chunk 4 as the correct
            answer for the question "What is the refund window?" You set k=5.
          </p>
          <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div className="text-slate-400">All 10 chunks in the database:</div>
            <div className="mt-2 space-y-0.5">
              <div>Chunk 1 — "Welcome to our store policies"</div>
              <div>Chunk 2 — "Shipping times vary by region"</div>
              <div>Chunk 3 — "Account creation and login help"</div>
              <div className="text-genai-400">Chunk 4 — "Refunds available within 30 days of purchase" ★ correct</div>
              <div>Chunk 5 — "Warranty covers manufacturing defects"</div>
              <div>Chunk 6 — "Exchange policy for wrong sizes"</div>
              <div>Chunk 7 — "Payment methods accepted"</div>
              <div>Chunk 8 — "Contact support via email or chat"</div>
              <div>Chunk 9 — "Holiday sale terms and conditions"</div>
              <div>Chunk 10 — "Privacy policy and data handling"</div>
            </div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Retrieval returns top-5 — did it find chunk 4?">
          <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div className="text-slate-400">Query: "What is the refund window?"</div>
            <div className="mt-3 text-slate-400">Top-5 results:</div>
            <div className="mt-1 space-y-0.5">
              <div>Rank 1 — Chunk 6 "Exchange policy for wrong sizes"</div>
              <div className="text-genai-400">Rank 2 — Chunk 4 "Refunds available within 30 days" ★ HIT</div>
              <div>Rank 3 — Chunk 5 "Warranty covers manufacturing defects"</div>
              <div>Rank 4 — Chunk 9 "Holiday sale terms and conditions"</div>
              <div>Rank 5 — Chunk 1 "Welcome to our store policies"</div>
            </div>
            <div className="mt-3 text-genai-400">
              Recall@5 for this question = 1 (hit) — chunk 4 is in the top 5.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Now imagine chunk 4 ranked at position 7">
          <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div className="text-slate-400">Top-5 results (chunk 4 missing):</div>
            <div className="mt-1 space-y-0.5">
              <div>Rank 1 — Chunk 6 "Exchange policy..."</div>
              <div>Rank 2 — Chunk 5 "Warranty covers..."</div>
              <div>Rank 3 — Chunk 9 "Holiday sale terms..."</div>
              <div>Rank 4 — Chunk 1 "Welcome to our store..."</div>
              <div>Rank 5 — Chunk 7 "Payment methods..."</div>
            </div>
            <div className="mt-3 text-red-400">
              Recall@5 for this question = 0 (miss) — the correct chunk exists but retrieval ranked it too low.
            </div>
            <div className="mt-2 text-slate-400">
              Fix: increase k to 7 (band-aid) or add reranking / hybrid search (real fix).
            </div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Aggregate across your full test set">
          <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>50 test questions, k=5:</div>
            <div className="mt-2">Correct chunk found in top-5 for 41 questions</div>
            <div>Correct chunk missing from top-5 for 9 questions</div>
            <div className="mt-2 text-genai-400">Recall@5 = 41/50 = 82%</div>
            <div className="mt-2 text-slate-400">
              Above 80%? Move on to generation metrics. Below 80%? Fix chunking or retrieval first.
            </div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Other retrieval metrics — when to use each">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Metric</th>
                <th className="px-4 py-3">Plain-language meaning</th>
                <th className="px-4 py-3">When to use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Recall@k',
                  'What % of questions had the correct chunk somewhere in top-k?',
                  'Always — your primary retrieval metric',
                ],
                [
                  'Precision@k',
                  'Of the k chunks returned, how many were actually relevant?',
                  'When noise in top-k is drowning the LLM (too many irrelevant chunks)',
                ],
                [
                  'MRR (Mean Reciprocal Rank)',
                  'On average, how high is the first correct result ranked? Rank 1 = 1.0, rank 5 = 0.2',
                  'When the correct chunk is usually found but ranked too low — signals need for reranking',
                ],
                [
                  'NDCG@k',
                  'Overall ranking quality — rewards having correct chunks near the top, not just present',
                  'Fine-tuning rerankers or comparing ranking algorithms',
                ],
                [
                  'Hit Rate',
                  'Did at least one correct chunk appear? (Binary yes/no per question, no rank info)',
                  'Quick sanity check — simpler than Recall@k but less informative',
                ],
              ].map(([metric, meaning, when]) => (
                <tr key={metric} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{metric}</td>
                  <td className="px-4 py-3 text-slate-400">{meaning}</td>
                  <td className="px-4 py-3 text-slate-400">{when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          For most teams, Recall@5 is the only retrieval metric you need day-to-day. Add MRR if you are tuning
          reranking. Add Precision@k if your top-k is noisy. NDCG is for research-level comparisons.
        </Callout>
      </LessonSection>

      <LessonSection title="Diagnosing low retrieval scores — symptom to fix">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">What you see</th>
                <th className="px-4 py-3">What it means</th>
                <th className="px-4 py-3">What to try</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Low recall, short/vague queries',
                  'Embedding the question directly does not match document wording',
                  'Try HyDE or multi-query retrieval',
                ],
                [
                  'Low recall, exact IDs fail',
                  'Dense search cannot match product codes or error numbers',
                  'Add BM25 / hybrid search with RRF',
                ],
                [
                  'High recall but wrong chunks ranked first',
                  'Right chunk is in top-k but buried below irrelevant ones',
                  'Add cross-encoder reranking',
                ],
                [
                  'Top-k full of near-duplicate chunks',
                  'Chunk overlap creates five copies of the same paragraph',
                  'Use MMR for diversity',
                ],
                [
                  'Low recall across the board',
                  'Chunks may be too large, too small, or split at wrong boundaries',
                  'Revisit chunking strategy first — before any retrieval tuning',
                ],
              ].map(([symptom, meaning, fix]) => (
                <tr key={symptom} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-slate-400">{symptom}</td>
                  <td className="px-4 py-3 text-slate-400">{meaning}</td>
                  <td className="px-4 py-3 font-semibold text-white">{fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Recall@k: is the correct chunk somewhere in the top-k results? The most actionable retrieval metric.',
          'Concrete example: 10 chunks, chunk 4 is correct — if it appears in top-5, Recall@5 = hit for that question.',
          'Target Recall@5 ≥ 80% before optimising generation. Below that, fix chunking or retrieval.',
          'Low recall + exact IDs → hybrid search. High recall + bad ranking → reranking. Duplicates → MMR.',
        ]}
      />
    </LessonArticle>
  )
}
