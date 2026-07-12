import {
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function RetrievalOverview() {
  return (
    <LessonArticle>
      <LessonSection title="What retrieval does">
        <p>
          Retrieval is the step where a query embedding (or keyword query) searches the vector database and
          returns the <strong className="text-white">top-k most relevant chunks</strong>. Everything downstream
          depends on this step.
        </p>
        <Flowchart
          title="Retrieval in context"
          chart={`flowchart LR
  Q[User question] --> R[Retrieval strategy]
  R --> V[(Vector DB)]
  V --> K[Top-k chunks]
  K --> P[Augmented prompt]
  P --> LLM[Generate answer]`}
        />
      </LessonSection>

      <LessonSection title="Strategy landscape">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Strategy</th>
                <th className="px-4 py-3">Matches by</th>
                <th className="px-4 py-3">Lesson</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Dense / semantic', 'Embedding similarity', 'Dense Retrieval'],
                ['BM25 / keyword', 'Term frequency', 'BM25 & Keyword Search'],
                ['Hybrid + RRF', 'Both combined', 'Hybrid Search & RRF'],
                ['MMR', 'Diversity-aware', 'MMR & Reranking'],
                ['Cross-encoder rerank', 'Re-scored precision', 'MMR & Reranking'],
                ['HyDE / multi-query', 'Query transformation', 'Advanced Retrieval'],
              ].map(([strategy, matches, lesson]) => (
                <tr key={strategy} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{strategy}</td>
                  <td className="px-4 py-3 text-slate-400">{matches}</td>
                  <td className="px-4 py-3 text-genai-400">{lesson}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Choosing k">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">k=1–3</strong> — precise but may miss context spread across chunks.</li>
          <li><strong className="text-white">k=5–7</strong> — sweet spot for most RAG applications.</li>
          <li><strong className="text-white">k=15+</strong> — risks flooding the prompt with noise.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Retrieval returns top-k chunks — the bottleneck of every RAG system.',
          'Multiple strategies exist: dense, sparse, hybrid, reranked, and query-transformed.',
          'k=5–7 is a good default; tune with labelled test questions.',
        ]}
      />
    </LessonArticle>
  )
}
