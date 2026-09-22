import {
  Callout,
  ContentStep,
  Definition,
  Example,
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

      <LessonSection title="Precision@k — how much of the top-k is actually useful?">
        <p className="text-slate-300">
          Recall asks &ldquo;did we find <em>any</em> correct chunk?&rdquo; Precision asks the opposite: of
          the k chunks we returned, <strong className="text-white">what fraction was actually relevant?</strong>{' '}
          A retriever with high recall but low precision is drowning the LLM in irrelevant context — which
          costs money, hurts &ldquo;lost in the middle&rdquo;, and adds hallucination risk.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm text-slate-200">
          <div className="font-mono text-genai-400">
            Precision@k = (relevant chunks in top-k) / k
          </div>
        </div>

        <ContentStep number={1} title="Extend the example — question with three correct chunks">
          <p>
            Same 10-chunk store-policy database, new question: <em>&ldquo;What are the refund and exchange
            rules?&rdquo;</em>. This time three chunks are actually correct:
          </p>
          <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div className="text-slate-400">Labelled correct chunks: 4, 5, 6</div>
            <div className="mt-3 text-slate-400">Top-5 results:</div>
            <div className="mt-1 space-y-0.5">
              <div className="text-genai-400">Rank 1 — Chunk 6 &ldquo;Exchange policy&rdquo;         ✓ relevant</div>
              <div className="text-genai-400">Rank 2 — Chunk 4 &ldquo;Refunds within 30 days&rdquo;  ✓ relevant</div>
              <div>Rank 3 — Chunk 9 &ldquo;Holiday sale terms&rdquo;      ✗ not relevant</div>
              <div className="text-genai-400">Rank 4 — Chunk 5 &ldquo;Warranty defects&rdquo;         ✓ relevant</div>
              <div>Rank 5 — Chunk 1 &ldquo;Welcome to policies&rdquo;      ✗ not relevant</div>
            </div>
            <div className="mt-3 text-genai-400">
              Relevant in top-5 = 3 → Precision@5 = 3 / 5 = 0.60 (60%)
            </div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Recall vs Precision on the same result set">
          <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Correct chunks in database  : 3   (chunks 4, 5, 6)</div>
            <div>Correct chunks in top-5     : 3</div>
            <div className="mt-2 text-genai-400">Recall@5    = 3 / 3 = 1.00  (found them all)</div>
            <div className="text-genai-400">Precision@5 = 3 / 5 = 0.60  (2 of the 5 are noise)</div>
          </div>
          <Callout variant="insight" title="Two knobs, one k">
            Raising k almost always raises recall and lowers precision. Lowering k does the opposite. The
            &ldquo;right&rdquo; k is the smallest one that keeps recall acceptable.
          </Callout>
        </ContentStep>

        <ContentStep number={3} title="When to actually care about precision">
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li>You pay per input token — every irrelevant chunk in the prompt is money.</li>
            <li>You use a small context model — noise pushes signal out of the window.</li>
            <li>Users complain of hallucinations that quote the wrong policy — that is a precision problem.</li>
          </ul>
        </ContentStep>
      </LessonSection>

      <LessonSection title="MRR — how high does the first correct chunk rank?">
        <p className="text-slate-300">
          Mean Reciprocal Rank cares about <strong className="text-white">where</strong> the first correct
          chunk lands. Rank 1 is worth 1.0, rank 2 is worth 0.5, rank 3 is worth 0.33, rank 10 is worth 0.1.
          If no correct chunk shows up, the score is 0 for that query. Then average across the test set.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm text-slate-200">
          <div className="font-mono text-genai-400">
            MRR = mean over queries of 1 / rank_of_first_relevant_chunk
          </div>
        </div>

        <ContentStep number={1} title="Worked example — 3 test queries">
          <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Query 1  first correct chunk at rank 2  →  1/2 = 0.500</div>
            <div>Query 2  first correct chunk at rank 1  →  1/1 = 1.000</div>
            <div>Query 3  first correct chunk at rank 5  →  1/5 = 0.200</div>
            <div className="mt-2 text-genai-400">MRR = (0.500 + 1.000 + 0.200) / 3 = 0.567</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Why the shape of the score matters">
          <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
            <table className="w-full text-sm text-slate-300">
              <thead>
                <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">Rank of first correct chunk</th>
                  <th className="px-4 py-3">Reciprocal rank</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-600">
                {[
                  ['1',  '1.000'],
                  ['2',  '0.500'],
                  ['3',  '0.333'],
                  ['5',  '0.200'],
                  ['10', '0.100'],
                  ['not found', '0.000'],
                ].map(([r, rr]) => (
                  <tr key={r}>
                    <td className="px-4 py-3 font-mono text-white">{r}</td>
                    <td className="px-4 py-3 font-mono text-genai-400">{rr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-slate-300">
            The score drops off <em>fast</em>. That is deliberate — MRR punishes retrievers that find the right
            chunk but bury it. It is the metric that most directly signals &ldquo;we need a reranker&rdquo;.
          </p>
        </ContentStep>

        <ContentStep number={3} title="MRR is a single-answer metric">
          <p className="text-slate-300">
            MRR only looks at the <em>first</em> correct chunk. If a question has three correct chunks and
            they show up at ranks 2, 6, and 9, MRR sees 0.5 and ignores the rest. For multi-answer
            questions, use NDCG.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="NDCG@k — quality of the whole ranking">
        <p className="text-slate-300">
          Normalised Discounted Cumulative Gain is the &ldquo;serious&rdquo; ranking metric. Three ideas make
          it up:
        </p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-slate-300">
          <li><strong className="text-white">Gain</strong> — each chunk has a relevance score. Often 0/1 (irrelevant / relevant), sometimes 0-3 (irrelevant / marginal / good / perfect).</li>
          <li><strong className="text-white">Discount</strong> — divide each chunk&rsquo;s gain by <code>log₂(rank + 1)</code>. Higher ranks count for more; deep ranks count for less.</li>
          <li><strong className="text-white">Normalise</strong> — divide by the ideal DCG (what you would get if all correct chunks were at the top). That makes the score fall between 0 and 1 and comparable across queries.</li>
        </ol>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm text-slate-200">
          <div className="font-mono text-genai-400">
            DCG@k  = Σᵢ₌₁ᵏ relᵢ / log₂(i + 1)
          </div>
          <div className="mt-1 font-mono text-genai-400">
            NDCG@k = DCG@k / IDCG@k
          </div>
        </div>

        <ContentStep number={1} title="Worked example — binary relevance, k = 5">
          <p>
            Same 3-correct scenario as Precision. Correct chunks are 4, 5, 6. Retrieval returns them at ranks
            1, 2, and 4:
          </p>
          <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
            <table className="w-full text-sm text-slate-300">
              <thead>
                <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">Rank i</th>
                  <th className="px-4 py-3">Chunk</th>
                  <th className="px-4 py-3">rel</th>
                  <th className="px-4 py-3">log₂(i + 1)</th>
                  <th className="px-4 py-3">Contribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-600">
                {[
                  ['1', '6', '1', '1.000', '1 / 1.000 = 1.000'],
                  ['2', '4', '1', '1.585', '1 / 1.585 = 0.631'],
                  ['3', '9', '0', '2.000', '0'],
                  ['4', '5', '1', '2.322', '1 / 2.322 = 0.431'],
                  ['5', '1', '0', '2.585', '0'],
                ].map(([i, ch, r, l, c]) => (
                  <tr key={i}>
                    <td className="px-4 py-3 font-mono text-white">{i}</td>
                    <td className="px-4 py-3 font-mono">{ch}</td>
                    <td className="px-4 py-3 font-mono">{r}</td>
                    <td className="px-4 py-3 font-mono">{l}</td>
                    <td className="px-4 py-3 font-mono text-slate-400">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>DCG@5  = 1.000 + 0.631 + 0 + 0.431 + 0 = 2.062</div>
            <div className="mt-1">
              Ideal ranking (all 3 relevant at ranks 1, 2, 3):
            </div>
            <div>IDCG@5 = 1 + 1/log₂(3) + 1/log₂(4) = 1.000 + 0.631 + 0.500 = 2.131</div>
            <div className="mt-2 text-genai-400">NDCG@5 = 2.062 / 2.131 = 0.968</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Why not just use Precision or MRR?">
          <p className="text-slate-300">
            Precision ignores order. MRR ignores everything after the first correct chunk. NDCG is the only
            one of the four that reads the <em>whole</em> ranking and rewards putting <em>all</em> relevant
            chunks near the top. That is why rerankers are usually tuned against NDCG.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Graded relevance — where NDCG really shines">
          <p className="text-slate-300">
            If a labeller marks chunks 0 = irrelevant, 1 = marginal, 2 = good, 3 = perfect, the same NDCG
            formula still works — just plug in the graded values as <code>relᵢ</code>. Precision and MRR
            cannot express &ldquo;partial credit&rdquo; without ugly hacks; NDCG handles it naturally.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Compute all four with one function">
        <Example title="All four metrics, no libraries">{`import math

def evaluate(retrieved: list, relevant: set, k: int = 5):
    top_k = retrieved[:k]

    # Precision@k
    hits    = [1 if c in relevant else 0 for c in top_k]
    precision = sum(hits) / k

    # Recall@k
    recall  = sum(hits) / len(relevant) if relevant else 0.0

    # MRR (single query — reciprocal rank of first hit)
    rr = 0.0
    for i, c in enumerate(top_k, start=1):
        if c in relevant:
            rr = 1.0 / i
            break

    # NDCG@k  (binary relevance)
    dcg  = sum(h / math.log2(i + 1) for i, h in enumerate(hits, start=1))
    ideal_hits = [1] * min(len(relevant), k)
    idcg = sum(h / math.log2(i + 1) for i, h in enumerate(ideal_hits, start=1))
    ndcg = dcg / idcg if idcg else 0.0

    return {"P@k": precision, "R@k": recall, "RR": rr, "NDCG@k": ndcg}

# Precision example from this lesson:
print(evaluate(retrieved=[6, 4, 9, 5, 1], relevant={4, 5, 6}, k=5))
# {'P@k': 0.6, 'R@k': 1.0, 'RR': 1.0, 'NDCG@k': 0.968}`}</Example>
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
          'Recall@k — did we find any correct chunk? Your primary retrieval metric. Target ≥ 80% before tuning generation.',
          'Precision@k — of the k returned, how many were relevant? Care about it when noise in the prompt costs money or drowns the model.',
          'MRR — how high does the FIRST correct chunk rank? Ranks fall fast (1.0, 0.5, 0.33, 0.2…). Low MRR + high recall is the classic "need a reranker" signal.',
          'NDCG@k — quality of the whole ranking with position-weighted gains and normalisation to [0, 1]. The only one that handles graded relevance and rewards putting all relevant chunks near the top.',
          'Rule of thumb: track Recall@5 always, add MRR when tuning rerankers, add Precision@k when top-k is noisy, use NDCG for research-grade comparisons and graded labels.',
        ]}
      />
    </LessonArticle>
  )
}
