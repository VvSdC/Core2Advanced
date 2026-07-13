import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function MmrAndReranking() {
  return (
    <LessonArticle>
      <LessonSection title="The redundant results problem">
        <p className="text-slate-300">
          Imagine you ask a librarian for five books about refund policies. Instead of five <em>different</em>{' '}
          books, they hand you five copies of the same pamphlet — each phrased slightly differently. You have
          five results, but only one unique piece of information.
        </p>
        <p className="mt-3 text-slate-300">
          This happens constantly in RAG. Your documents are chunked with overlap, so the same paragraph appears
          in multiple chunks. Standard top-k retrieval returns all of them because they all score high on
          relevance — but the LLM gets five copies of the same fact and zero context about shipping, warranties,
          or anything else.
        </p>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-slate-400">Query: "What is the refund policy?"</div>
          <div className="mt-3 text-slate-400">Standard top-5 results:</div>
          <div className="mt-1 font-mono text-slate-200 space-y-1">
            <div>1. "Refund within 30 days of purchase" — score 0.94</div>
            <div>2. "30-day refund window for all items" — score 0.92</div>
            <div>3. "Returns accepted for 30 days" — score 0.91</div>
            <div>4. "30-day money-back guarantee policy" — score 0.89</div>
            <div>5. "Full refund available within thirty days" — score 0.87</div>
          </div>
          <div className="mt-3 text-red-400">
            Five slots wasted on the same fact. Shipping policy, warranty info, and exchange rules never make
            it to the LLM.
          </div>
        </div>
        <Callout variant="beginner" title="The fix">
          You need two techniques: <strong className="text-white">MMR</strong> to pick diverse chunks, and{' '}
          <strong className="text-white">reranking</strong> to double-check that the best chunks are actually
          ranked first. They solve different problems and are often used together.
        </Callout>
      </LessonSection>

      <Definition term="MMR — Maximal Marginal Relevance">
        <p>
          MMR picks chunks that are <strong className="text-white">relevant to the query</strong> but{' '}
          <strong className="text-white">different from each other</strong>. Each new pick is penalised if it is
          too similar to a chunk already selected. The result: diverse evidence instead of five copies of the
          same paragraph.
        </p>
        <p>
          A knob called <strong className="text-white">λ (lambda)</strong> controls the trade-off. λ=1.0 is pure
          relevance (standard top-k, no diversity). λ=0.5 balances relevance and diversity. λ=0.0 is pure
          diversity (probably too scattered for RAG).
        </p>
      </Definition>

      <LessonSection title="MMR in action — before and after">
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-slate-400">Without MMR (top-3):</div>
          <div className="mt-1 font-mono text-slate-200">
            "Refund within 30 days" / "30-day refund window" / "Returns accepted for 30 days"
          </div>
          <div className="mt-4 text-slate-400">With MMR, λ=0.5 (top-3):</div>
          <div className="mt-1 font-mono text-slate-200">
            "Refund within 30 days" / "Free shipping on orders over $50" / "Warranty covers defects for 1 year"
          </div>
          <div className="mt-3 text-genai-400">
            The LLM now has refund rules, shipping info, and warranty details — three unique facts to synthesise
            a complete answer.
          </div>
        </div>
        <ContentStep number={1} title="Pick the most relevant chunk first">
          <p>Standard relevance ranking — the highest-scoring chunk wins slot #1.</p>
        </ContentStep>
        <ContentStep number={2} title="Penalise similar chunks for slot #2">
          <p>
            The second pick must be relevant to the query <em>and</em> different from chunk #1. "30-day refund
            window" gets penalised because it is nearly identical to "Refund within 30 days." "Free shipping on
            orders over $50" wins because it is relevant and novel.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Repeat until k slots are filled">
          <p>Each new pick penalises similarity to all previously selected chunks. Diversity compounds.</p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Reranking — when relevance ranking is not precise enough">
        <p className="text-slate-300">
          MMR solves redundancy, but another problem remains: the right chunk exists in your database but ranks
          at position 8 instead of position 1. The bi-encoder used for dense retrieval embeds the query and each
          document <em>separately</em> — fast, but less accurate than reading them together.
        </p>
        <Definition term="Cross-encoder reranking">
          <p>
            A cross-encoder reads the query and a candidate chunk <strong className="text-white">together</strong>{' '}
            in a single forward pass, producing a much more accurate relevance score. It is too slow to run on
            every chunk in your database (millions of comparisons), but fast enough on a shortlist of 50.
          </p>
          <p>
            Analogy: bi-encoder is a quick scan of book titles from across the room. Cross-encoder is sitting
            down and reading the first page of each shortlisted book before deciding.
          </p>
        </Definition>

        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-800/50 p-4">
          <p className="text-sm font-semibold text-white">The two-stage pattern</p>
          <p className="mt-2 text-sm text-slate-400">
            <strong className="text-white">Stage 1 — Bi-encoder retrieval:</strong> Fast search returns top 50
            candidates from the full database.
          </p>
          <p className="mt-1 text-sm text-slate-400">
            <strong className="text-white">Stage 2 — Cross-encoder reranking:</strong> The reranker reads each of
            the 50 candidates alongside the query and re-scores them. Return the top 5.
          </p>
          <p className="mt-2 text-sm text-genai-400">
            Best of both worlds: speed of bi-encoder search + precision of cross-encoder scoring.
          </p>
        </div>
      </LessonSection>

      <LessonSection title="Popular rerankers">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Reranker</th>
                <th className="px-4 py-3">What it is</th>
                <th className="px-4 py-3">Best for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Cohere Rerank', 'Commercial API — strong multilingual support', 'Production apps needing quality without hosting models'],
                ['bge-reranker-large', 'Open-source cross-encoder (BAAI)', 'Self-hosted pipelines, strong English performance'],
                ['ms-marco-MiniLM', 'Lightweight open-source reranker', 'Low-latency setups where speed matters'],
                ['Pinecone rerank', 'Integrated reranker in Pinecone 2.0', 'Pinecone users who want reranking without extra infra'],
              ].map(([reranker, what, bestFor]) => (
                <tr key={reranker} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{reranker}</td>
                  <td className="px-4 py-3 text-slate-400">{what}</td>
                  <td className="px-4 py-3 text-slate-400">{bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="When to add MMR vs reranking">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Symptom</th>
                <th className="px-4 py-3">Solution</th>
                <th className="px-4 py-3">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Top-k results all say the same thing',
                  'Add MMR',
                  'Chunks overlap from chunking — MMR forces diversity',
                ],
                [
                  'Right chunk is in top 20 but not top 5',
                  'Add cross-encoder reranking',
                  'Bi-encoder ranking is imprecise — reranker reads query+chunk together',
                ],
                [
                  'Both problems at once',
                  'Rerank top 50, then apply MMR on top 10',
                  'Reranking fixes order; MMR fixes redundancy in the final set',
                ],
                [
                  'Retrieval recall is low (< 80%)',
                  'Fix chunking or hybrid search first',
                  'Reranking cannot find chunks that retrieval never returned',
                ],
              ].map(([symptom, solution, why]) => (
                <tr key={symptom} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-slate-400">{symptom}</td>
                  <td className="px-4 py-3 font-semibold text-white">{solution}</td>
                  <td className="px-4 py-3 text-slate-400">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          Reranking adds 100–500ms of latency per query. Only add it after you have tuned chunking and hybrid
          search. MMR is nearly free — add it any time you see redundant chunks in your top-k.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Standard top-k often returns redundant chunks — five copies of the same fact, zero diversity.',
          'MMR balances relevance with diversity: each pick must be different from previous selections.',
          'Cross-encoder reranking: bi-encoder finds top 50 fast, cross-encoder picks the best 5 precisely.',
          'Add MMR for redundancy; add reranking for imprecise ranking. Fix recall before either.',
        ]}
      />
    </LessonArticle>
  )
}
