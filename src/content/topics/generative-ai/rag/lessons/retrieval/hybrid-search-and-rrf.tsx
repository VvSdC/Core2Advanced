import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function HybridSearchAndRrf() {
  return (
    <LessonArticle>
      <LessonSection title="Why combine dense and keyword search?">
        <p className="text-slate-300">
          Dense retrieval and BM25 each have a blind spot. Dense search understands meaning but misses exact IDs.
          BM25 nails exact words but cannot handle paraphrases. Used alone, each fails on roughly half of real
          user questions.
        </p>
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Dense alone fails on:</p>
            <p className="mt-1 text-sm text-slate-400">
              "SKU-48291 specs" — the embedding model does not treat product IDs as meaningful tokens.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">BM25 alone fails on:</p>
            <p className="mt-1 text-sm text-slate-400">
              "How do I get my money back?" — no shared keywords with "refund policy within 30 days."
            </p>
          </div>
        </div>
        <Callout variant="beginner" title="The core idea">
          Run <em>both</em> searches on every query. Dense catches paraphrases; BM25 catches exact matches.
          Then merge the two result lists into one final ranking. This is hybrid search — the production default
          for serious RAG systems.
        </Callout>
      </LessonSection>

      <Definition term="Hybrid search">
        <p>
          Hybrid search runs dense retrieval and BM25 keyword search <strong className="text-white">in
          parallel</strong> on the same query, then combines their ranked results into a single top-k list. You
          get the paraphrase power of dense search and the exact-match precision of BM25 in one pipeline.
        </p>
        <p>
          Analogy: two librarians search the library independently — one by meaning, one by title keywords —
          then they compare notes and agree on the best books to recommend.
        </p>
      </Definition>

      <LessonSection title="The hybrid pipeline — how it flows">
        <Flowchart
          title="Hybrid retrieval pipeline"
          chart={`flowchart TB
  Q[User question] --> D[Dense search → top 20]
  Q --> B[BM25 search → top 20]
  D --> M[Merge candidate lists]
  B --> M
  M --> RRF[Reciprocal Rank Fusion]
  RRF --> K[Final top-k chunks]`}
        />
        <ContentStep number={1} title="Run both searches in parallel">
          <p>
            The same user question goes to dense retrieval (top 20 by embedding similarity) and BM25 (top 20 by
            keyword score) simultaneously. You cast a wide net — up to 40 unique candidates.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Merge the two ranked lists">
          <p>
            Some chunks appear in both lists; others appear in only one. You now have two separate rankings of
            overlapping documents — but the scores are incompatible. Dense scores range 0–1; BM25 scores can be
            0–15+. You cannot simply add them.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Fuse rankings with RRF">
          <p>
            Reciprocal Rank Fusion (RRF) combines the two lists using <em>rank position</em> instead of raw
            scores. A chunk ranked #2 in dense and #1 in BM25 beats a chunk ranked #1 in dense but #50 in BM25.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="RRF in plain language — voting by rank position">
        <Definition term="Reciprocal Rank Fusion (RRF)">
          <p>
            RRF is a simple voting system. Each search method ranks documents from best to worst. RRF gives
            every document points based on its <em>position</em> in each list — higher rank = more points. A
            document that ranks well in <strong className="text-white">both</strong> lists accumulates the most
            points and wins.
          </p>
          <p>
            The formula for each document: add up <code className="text-accent-400">1 / (60 + rank)</code> from
            every list it appears in. The constant 60 prevents rank-1 from dominating so much that lower ranks
            get zero credit. Documents ranked highly in <em>both</em> lists get the highest combined score.
          </p>
        </Definition>

        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-slate-400 mb-2">Three chunks, two ranked lists:</div>
          <div className="font-mono text-slate-200 space-y-2">
            <div>
              <strong className="text-white">Chunk X:</strong> dense rank 2, BM25 rank 1
              <div className="ml-4 text-slate-400">
                RRF = 1/(60+2) + 1/(60+1) = 0.0161 + 0.0164 = <span className="text-genai-400">0.0325</span>
              </div>
            </div>
            <div>
              <strong className="text-white">Chunk Y:</strong> dense rank 1, BM25 rank 50
              <div className="ml-4 text-slate-400">
                RRF = 1/(60+1) + 1/(60+50) = 0.0164 + 0.0091 = <span className="text-slate-300">0.0255</span>
              </div>
            </div>
            <div>
              <strong className="text-white">Chunk Z:</strong> dense rank 5, BM25 rank 3
              <div className="ml-4 text-slate-400">
                RRF = 1/(60+5) + 1/(60+3) = 0.0154 + 0.0159 = <span className="text-slate-300">0.0312</span>
              </div>
            </div>
          </div>
          <div className="mt-4 text-genai-400 font-semibold">
            Winner: Chunk X — strong in both lists, even though it was not #1 in either alone.
          </div>
        </div>

        <Callout variant="insight">
          Chunk Y was #1 in dense search but BM25 barely noticed it (rank 50). RRF correctly demotes it because
          only one search method agreed it was relevant. Chunk X was top-3 in <em>both</em> — the robust winner.
        </Callout>
      </LessonSection>

      <LessonSection title="Weighted hybrid — an alternative to RRF">
        <p className="text-slate-300">
          Some systems blend scores directly instead of using RRF:{' '}
          <strong className="text-white">final = α × dense_score + (1−α) × bm25_score</strong>. The α parameter
          controls the mix:
        </p>
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">α = 1.0 — pure dense (no keywords)</p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">α = 0.5 — equal blend (Weaviate default)</p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">α = 0.0 — pure BM25 (no semantics)</p>
          </div>
        </div>
        <p className="mt-4 text-slate-300">
          Weighted blending requires normalising scores to the same scale, which is tricky when dense scores are
          0–1 and BM25 scores are 0–15. RRF avoids this problem entirely by using rank positions — that is why it
          is the more robust production default.
        </p>
      </LessonSection>

      <LessonSection title="When to use hybrid search">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Situation</th>
                <th className="px-4 py-3">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Users ask both paraphrased and exact-match questions', 'Hybrid with RRF — the production default'],
                ['Only paraphrased questions (no IDs or codes)', 'Dense alone is fine'],
                ['Only exact-match lookups (catalog, error codes)', 'BM25 alone may suffice'],
                ['Dense misses IDs; BM25 misses paraphrases', 'Hybrid — you need both signals'],
              ].map(([situation, rec]) => (
                <tr key={situation} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-slate-400">{situation}</td>
                  <td className="px-4 py-3 font-semibold text-white">{rec}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          Weaviate has built-in hybrid search with an alpha parameter. Pinecone, Qdrant, and others typically
          run dense and BM25 separately, then apply RRF as a post-processing step. Both approaches work.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Hybrid search combines dense (meaning) and BM25 (keywords) because each alone has a blind spot.',
          'RRF merges ranked lists by position, not score — documents strong in BOTH lists win.',
          'RRF is more robust than weighted blending because dense and BM25 scores use incompatible scales.',
          'Use hybrid as your production default when users mix paraphrases and exact-match queries.',
        ]}
      />
    </LessonArticle>
  )
}
