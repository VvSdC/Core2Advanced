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
      <Callout variant="beginner" title="Read this after">
        Complete <em>Fundamentals → Bi-Encoders & Cross-Encoders</em> first. This lesson assumes you understand
        why bi-encoders are fast but imprecise, and why cross-encoders rerank a shortlist. MMR is a separate
        technique that solves redundancy — not ranking imprecision.
      </Callout>

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
        <Callout variant="beginner" title="Two different problems, two different fixes">
          <strong className="text-white">Redundant results</strong> (five copies of the same fact) → fix with{' '}
          <strong className="text-white">MMR</strong>.{' '}
          <strong className="text-white">Wrong ranking</strong> (right chunk exists but at position 8, not 1) →
          fix with <strong className="text-white">cross-encoder reranking</strong>. They solve different problems
          and are often used together.
        </Callout>
      </LessonSection>

      <Definition term="MMR — Maximal Marginal Relevance">
        <p>
          MMR picks chunks that are <strong className="text-white">relevant to the query</strong> but{' '}
          <strong className="text-white">different from each other</strong>. Each new pick is penalised if it is
          too similar to a chunk already selected. The result: diverse evidence instead of five copies of the
          same paragraph.
        </p>
        <p className="mt-3">
          MMR uses the same kind of vector similarity as bi-encoder retrieval — it compares embedding vectors
          to measure how alike two chunks are. It does not use a cross-encoder.
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

      <LessonSection title="The MMR formula — what each part actually means">
        <p className="text-slate-300">
          Researchers write MMR as a formula. It looks intimidating, but every symbol maps to something you
          already understand from the steps above. Here it is — then we unpack it piece by piece.
        </p>

        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-5 font-mono text-sm text-slate-200">
          <div className="text-center text-base">
            MMR(d) = λ · sim(d, q) − (1 − λ) · max<sub>d<sub>j</sub> ∈ S</sub> sim(d, d<sub>j</sub>)
          </div>
        </div>

        <p className="mt-4 text-slate-300">
          In plain English: for each candidate chunk <strong className="text-white">d</strong> that is not yet
          selected, compute a score. Pick the chunk with the highest score. Repeat until you have k chunks.
        </p>

        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">sim(d, q) — "How relevant is this chunk to the question?"</p>
            <p className="mt-2 text-sm text-slate-400">
              Cosine similarity between the chunk's embedding vector and the query's embedding vector. High
              score = chunk probably answers the question. This is the same similarity bi-encoder dense retrieval
              uses. The <strong className="text-white">λ</strong> multiplier in front of this term rewards relevance.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">max sim(d, d<sub>j</sub>) — "How similar is this chunk to something I already picked?"</p>
            <p className="mt-2 text-sm text-slate-400">
              Compare chunk <strong className="text-white">d</strong> against every chunk already in the selected
              set <strong className="text-white">S</strong>. Take the <em>highest</em> similarity — the closest
              match to an existing pick. If chunk d is almost a duplicate of something already selected, this
              number is high and the subtraction <em>hurts</em> the final score. The{' '}
              <strong className="text-white">(1 − λ)</strong> multiplier controls how much this penalty matters.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">λ (lambda) — the relevance vs diversity dial</p>
            <p className="mt-2 text-sm text-slate-400">
              A number between 0 and 1. At <strong className="text-white">λ = 1.0</strong>, the penalty term
              disappears — pure relevance, no diversity (standard top-k). At{' '}
              <strong className="text-white">λ = 0.5</strong>, relevance and diversity are weighted equally — the
              usual RAG default. At <strong className="text-white">λ = 0.0</strong>, only diversity matters —
              results become scattered and usually unhelpful.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">S — the set of chunks already selected</p>
            <p className="mt-2 text-sm text-slate-400">
              Starts empty. After picking chunk #1, S = {'{chunk #1}'}'. After picking chunk #2, S = {'{chunk #1, chunk #2}'}.
              The penalty grows as S grows — each new pick must be different from <em>all</em> previous picks,
              not just the last one.
            </p>
          </div>
        </div>

        <Callout variant="beginner" title="You do not need to compute this by hand">
          Vector databases (Pinecone, Weaviate, Chroma) and frameworks like LangChain expose MMR as a parameter
          — you set λ and k, and the library runs the formula. The value of seeing the formula is understanding{' '}
          <em>why</em> MMR works: it is a tug-of-war between "relevant to the question" and "not a duplicate of
          what I already have."
        </Callout>
      </LessonSection>

      <LessonSection title="Worked example — picking slot #2 by hand">
        <p className="text-slate-300">
          Query: "What is the refund policy?" Chunk #1 is already selected: "Refund within 30 days." λ = 0.5.
          Three candidates remain for slot #2:
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3">sim(d, q)</th>
                <th className="px-4 py-3">sim(d, chunk #1)</th>
                <th className="px-4 py-3">MMR score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 text-slate-400">"30-day refund window"</td>
                <td className="px-4 py-3 text-slate-400">0.92</td>
                <td className="px-4 py-3 text-slate-400">0.95 (near duplicate)</td>
                <td className="px-4 py-3 text-slate-400">0.5×0.92 − 0.5×0.95 = <strong className="text-white">−0.015</strong></td>
              </tr>
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 text-slate-400">"Free shipping over $50"</td>
                <td className="px-4 py-3 text-slate-400">0.71</td>
                <td className="px-4 py-3 text-slate-400">0.18 (different topic)</td>
                <td className="px-4 py-3 text-slate-400">0.5×0.71 − 0.5×0.18 = <strong className="text-genai-400">0.265</strong></td>
              </tr>
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 text-slate-400">"Warranty covers 1 year"</td>
                <td className="px-4 py-3 text-slate-400">0.65</td>
                <td className="px-4 py-3 text-slate-400">0.22 (different topic)</td>
                <td className="px-4 py-3 text-slate-400">0.5×0.65 − 0.5×0.22 = <strong className="text-white">0.215</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-slate-300">
          Without MMR, "30-day refund window" wins slot #2 (highest sim(d, q) = 0.92). With MMR, its near-duplicate
          penalty drags the score below zero. "Free shipping over $50" wins — lower relevance (0.71) but much
          higher novelty. That is the formula doing exactly what we want.
        </p>
      </LessonSection>

      <LessonSection title="Reranking — when bi-encoder ranking is not precise enough">
        <p className="text-slate-300">
          MMR solves redundancy. A separate problem remains: the right chunk exists in your database but ranks at
          position 8 instead of position 1. This is a bi-encoder limitation — as explained in{' '}
          <em>Fundamentals → Bi-Encoders & Cross-Encoders</em>, the query and chunk are encoded separately, so
          subtle relevance signals are missed.
        </p>

        <Definition term="Cross-encoder reranking">
          <p>
            A cross-encoder reads the query and each candidate chunk <strong className="text-white">together</strong>{' '}
            in a single forward pass and outputs a precise relevance score. Too slow for millions of chunks —
            but fast enough on a shortlist of 50 returned by bi-encoder retrieval.
          </p>
        </Definition>

        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-800/50 p-4">
          <p className="text-sm font-semibold text-white">The two-stage pattern (recap from Fundamentals)</p>
          <p className="mt-2 text-sm text-slate-400">
            <strong className="text-white">Stage 1 — Bi-encoder retrieval:</strong> Fast search over the full
            database. Returns top 50 candidates. Some ranking errors are expected.
          </p>
          <p className="mt-1 text-sm text-slate-400">
            <strong className="text-white">Stage 2 — Cross-encoder reranking:</strong> Score each of the 50
            (query, chunk) pairs together. Return the top 5 with much higher precision.
          </p>
          <p className="mt-1 text-sm text-slate-400">
            <strong className="text-white">Stage 3 — MMR (optional):</strong> If the top 5 are still redundant,
            apply MMR to diversify before sending to the LLM.
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
                ['Cohere Rerank', 'Commercial cross-encoder API — strong multilingual support', 'Production apps needing quality without hosting models'],
                ['bge-reranker-large', 'Open-source cross-encoder (BAAI)', 'Self-hosted pipelines, strong English performance'],
                ['ms-marco-MiniLM', 'Lightweight open-source cross-encoder', 'Low-latency setups where speed matters'],
                ['Pinecone rerank', 'Integrated cross-encoder in Pinecone 2.0', 'Pinecone users who want reranking without extra infra'],
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
                  'Chunks overlap from chunking — MMR penalises near-duplicates via the sim(d, dⱼ) term',
                ],
                [
                  'Right chunk is in top 20 but not top 5',
                  'Add cross-encoder reranking',
                  'Bi-encoder ranked imprecisely — cross-encoder reads query+chunk together',
                ],
                [
                  'Both problems at once',
                  'Rerank top 50, then apply MMR on top 10',
                  'Cross-encoder fixes order; MMR fixes redundancy in the final set',
                ],
                [
                  'Retrieval recall is low (< 80%)',
                  'Fix chunking or hybrid search first',
                  'Reranking cannot find chunks that bi-encoder retrieval never returned',
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
          'MMR fixes redundancy — five copies of the same fact. Cross-encoder reranking fixes imprecise bi-encoder ranking. Different problems.',
          'MMR formula: reward sim(d, q) relevance, penalise sim(d, dⱼ) similarity to already-selected chunks. λ controls the balance.',
          'Worked example: near-duplicate "30-day refund window" loses to "Free shipping" because the penalty term drags its MMR score below zero.',
          'Production pipeline: bi-encoder retrieves top 50 → cross-encoder reranks to top 5 → optional MMR for diversity.',
        ]}
      />
    </LessonArticle>
  )
}
