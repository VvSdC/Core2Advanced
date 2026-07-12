import {
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function DenseRetrieval() {
  return (
    <LessonArticle>
      <LessonSection title="How dense retrieval works">
        <ol className="list-decimal space-y-2 pl-5 text-slate-300">
          <li>Embed the user query with the same model used at index time.</li>
          <li>Compute cosine similarity (or dot product) against all stored chunk vectors.</li>
          <li>Return the top-k highest-scoring chunks.</li>
        </ol>
      </LessonSection>

      <LessonSection title="Example">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div className="text-slate-400">Query: "How do I get my money back?"</div>
          <div className="mt-3 space-y-1">
            <div>Chunk A "refund policy within 30 days" → 0.91 ✓</div>
            <div>Chunk B "shipping costs and delivery" → 0.23</div>
            <div>Chunk C "money-back guarantee for defective items" → 0.87 ✓</div>
          </div>
          <div className="mt-3 text-genai-400">Returns A and C — semantic match without shared keywords.</div>
        </div>
      </LessonSection>

      <LessonSection title="Strengths & weaknesses">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Strengths</th>
                <th className="px-4 py-3">Weaknesses</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 text-slate-400">Paraphrase matching; conceptual similarity; multilingual (with right model)</td>
                <td className="px-4 py-3 text-slate-400">Misses exact IDs, codes, rare proper nouns</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Dense retrieval = embed query, cosine similarity, return top-k.',
          'Handles paraphrases and semantic similarity — the RAG default.',
          'Weak on exact keyword/ID matches — pair with BM25 in hybrid search.',
        ]}
      />
    </LessonArticle>
  )
}
