import {
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function MmrAndReranking() {
  return (
    <LessonArticle>
      <LessonSection title="MMR — Maximal Marginal Relevance">
        <p>
          Standard top-k often returns <strong className="text-white">redundant chunks</strong> — five passages
          saying the same thing. MMR balances <em>relevance</em> with <em>diversity</em>:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          MMR = argmax [ λ × Sim(query, doc) − (1−λ) × max Sim(doc, selected) ]
        </div>
        <p className="mt-3">
          λ controls the trade-off. λ=1 is pure relevance; λ=0.5 balances diversity. Each new pick penalises
          chunks too similar to ones already selected.
        </p>
      </LessonSection>

      <LessonSection title="MMR example">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-slate-400">Without MMR (top-3):</div>
          <div className="mt-1 font-mono text-slate-200">"Refund within 30 days" / "30-day refund window" / "Returns accepted for 30 days"</div>
          <div className="mt-3 text-slate-400">With MMR (top-3):</div>
          <div className="mt-1 font-mono text-slate-200">"Refund within 30 days" / "Shipping policy free over $50" / "Warranty covers defects for 1 year"</div>
          <div className="mt-3 text-genai-400">Diverse context gives the LLM broader evidence.</div>
        </div>
      </LessonSection>

      <LessonSection title="Cross-encoder reranking">
        <p>
          Bi-encoders (dense retrieval) embed query and document <em>separately</em> — fast but less accurate.
          <strong className="text-white"> Cross-encoders</strong> process query + document <em>together</em> —
          much more accurate but too slow for full corpus search.
        </p>
        <p className="mt-3">
          <strong className="text-white">Two-stage pattern:</strong> bi-encoder retrieves top-50 → cross-encoder
          reranks to top-5. Best of speed and precision.
        </p>
      </LessonSection>

      <LessonSection title="Popular rerankers">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Reranker</th>
                <th className="px-4 py-3">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Cohere Rerank', 'Commercial API — strong multilingual'],
                ['bge-reranker-large', 'Open-source cross-encoder'],
                ['ms-marco-MiniLM', 'Lightweight open-source reranker'],
                ['Pinecone rerank', 'Integrated in Pinecone 2.0 inference'],
              ].map(([reranker, type]) => (
                <tr key={reranker} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{reranker}</td>
                  <td className="px-4 py-3 text-slate-400">{type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'MMR reduces redundant chunks by penalising similarity to already-selected results.',
          'Cross-encoder reranking: bi-encoder retrieves top-50, cross-encoder picks top-5.',
          'Add MMR when chunks are repetitive; add reranking when precision is still insufficient.',
          'Reranking adds latency — use only after tuning chunking and hybrid search.',
        ]}
      />
    </LessonArticle>
  )
}
