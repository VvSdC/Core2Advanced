import {
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function HybridSearchAndRrf() {
  return (
    <LessonArticle>
      <LessonSection title="Why hybrid?">
        <p>
          Dense retrieval misses exact keywords; BM25 misses paraphrases.{' '}
          <strong className="text-white">Hybrid search</strong> runs both and merges results — getting the best
          of both signal types.
        </p>
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
      </LessonSection>

      <LessonSection title="Reciprocal Rank Fusion (RRF)">
        <p>
          RRF combines ranked lists without normalising scores (which are incompatible between dense and sparse).
          Formula for each document:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          RRF_score(d) = Σ 1 / (k + rank_i(d))
        </div>
        <p className="mt-3">
          <strong className="text-white">k</strong> is a constant (typically 60). Documents ranked highly in{' '}
          <em>both</em> lists get the highest combined score — even if neither ranked #1 individually.
        </p>
      </LessonSection>

      <LessonSection title="RRF example">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="font-mono text-slate-200 space-y-1">
            <div>Chunk X: dense rank 2, BM25 rank 1 → RRF = 1/(60+2) + 1/(60+1) = 0.0325</div>
            <div>Chunk Y: dense rank 1, BM25 rank 50 → RRF = 1/(60+1) + 1/(60+50) = 0.0255</div>
            <div>Chunk Z: dense rank 5, BM25 rank 3 → RRF = 1/(60+5) + 1/(60+3) = 0.0312</div>
          </div>
          <div className="mt-3 text-genai-400 font-mono">Winner: Chunk X — strong in both lists.</div>
        </div>
      </LessonSection>

      <LessonSection title="Weighted hybrid (alternative)">
        <p>
          Some systems use a weighted score instead of RRF:{' '}
          <strong className="text-white">final = α × dense_score + (1−α) × bm25_score</strong>. Weaviate uses an
          alpha parameter (0 = pure BM25, 1 = pure dense, 0.5 = equal blend). RRF is more robust when score scales differ.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Hybrid search combines dense and BM25 results for broader recall.',
          'RRF merges ranked lists without normalising incompatible scores.',
          'Documents ranked well in BOTH lists win — the robust production default.',
          'Weaviate has built-in hybrid; others use RRF as a post-processing step.',
        ]}
      />
    </LessonArticle>
  )
}
