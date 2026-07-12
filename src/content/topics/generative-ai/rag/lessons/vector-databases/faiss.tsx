import {
  Callout,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function FaissVectorDb() {
  return (
    <LessonArticle>
      <LessonSection title="What is FAISS?">
        <p>
          <strong className="text-white">FAISS</strong> (Facebook AI Similarity Search) is a C++ library with
          Python bindings for efficient similarity search. It is a <em>library</em>, not a database — no REST API,
          no built-in persistence, no metadata filtering out of the box.
        </p>
      </LessonSection>

      <LessonSection title="Basic → Advanced">
        <div className="space-y-4">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Level 1 — Flat index (exact search)</p>
            <p className="mt-2 text-sm text-slate-400">Compare query to every vector. Perfect accuracy. Use for &lt;100k vectors or benchmarking.</p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Level 2 — IVF (Inverted File Index)</p>
            <p className="mt-2 text-sm text-slate-400">Clusters vectors into buckets. Search only the nearest buckets. Good for 100k–10M vectors.</p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Level 3 — HNSW (Hierarchical Navigable Small World)</p>
            <p className="mt-2 text-sm text-slate-400">Graph-based ANN. Fastest queries, excellent recall. Default for most production FAISS setups.</p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Level 4 — Product Quantization (PQ)</p>
            <p className="mt-2 text-sm text-slate-400">Compress vectors to reduce memory. Trade tiny accuracy loss for 4–8× less RAM. Essential for billions of vectors.</p>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="When to use FAISS">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Prototyping</strong> — fastest way to test RAG locally.</li>
          <li><strong className="text-white">Single-machine apps</strong> — embed index in your app process.</li>
          <li><strong className="text-white">Not for</strong> — multi-user production with filtering, cloud scaling, or managed ops.</li>
        </ul>
      </LessonSection>

      <Callout variant="tip">LangChain integrates FAISS via save_local / load_local for persistence between runs.</Callout>

      <KeyTakeaways
        items={[
          'FAISS is a similarity search library — not a full database.',
          'Progression: Flat (exact) → IVF → HNSW → PQ compression.',
          'Best for prototyping and single-machine RAG apps.',
          'Pair with LangChain for the easiest local RAG setup.',
        ]}
      />
    </LessonArticle>
  )
}
