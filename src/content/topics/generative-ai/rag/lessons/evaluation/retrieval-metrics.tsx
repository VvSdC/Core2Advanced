import {
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function RetrievalMetrics() {
  return (
    <LessonArticle>
      <LessonSection title="Core retrieval metrics">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Metric</th>
                <th className="px-4 py-3">What it measures</th>
                <th className="px-4 py-3">Formula intuition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Recall@k', 'Is the correct chunk in the top-k results?', 'Found / Total relevant'],
                ['Precision@k', 'How many of top-k are actually relevant?', 'Relevant in top-k / k'],
                ['MRR', 'How high is the first correct result ranked?', '1 / rank of first hit'],
                ['NDCG@k', 'Overall ranking quality with position weighting', 'Discounted cumulative gain'],
                ['Hit Rate', 'Did at least one correct chunk appear?', 'Binary: hit or miss per query'],
              ].map(([metric, measures, formula]) => (
                <tr key={metric} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{metric}</td>
                  <td className="px-4 py-3 text-slate-400">{measures}</td>
                  <td className="px-4 py-3 text-slate-400">{formula}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Recall@k — the most actionable">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>50 test questions, k=5:</div>
          <div className="mt-2">Correct chunk found in top-5 for 41 questions</div>
          <div>Recall@5 = 41/50 = 82%</div>
          <div className="mt-2 text-slate-400">Below 80%? Fix chunking or retrieval before touching the LLM.</div>
        </div>
      </LessonSection>

      <LessonSection title="Diagnosing low retrieval scores">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Symptom</th>
                <th className="px-4 py-3">Likely fix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Low recall, short queries', 'Try HyDE or multi-query retrieval'],
                ['Low recall, exact IDs fail', 'Add BM25 / hybrid search'],
                ['High recall but wrong chunks ranked first', 'Add cross-encoder reranking'],
                ['Redundant chunks in top-k', 'Use MMR'],
              ].map(([symptom, fix]) => (
                <tr key={symptom} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-slate-400">{symptom}</td>
                  <td className="px-4 py-3 font-semibold text-white">{fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Recall@k is the most actionable retrieval metric — is the right chunk in top-k?',
          'Target Recall@5 ≥ 80% before optimising generation.',
          'Low recall → fix chunking, embeddings, or retrieval strategy first.',
        ]}
      />
    </LessonArticle>
  )
}
