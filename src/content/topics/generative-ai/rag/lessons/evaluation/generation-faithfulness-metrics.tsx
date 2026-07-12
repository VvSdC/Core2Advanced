import {
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function GenerationFaithfulnessMetrics() {
  return (
    <LessonArticle>
      <LessonSection title="Generation metrics">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Metric</th>
                <th className="px-4 py-3">What it measures</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Answer relevance', 'Does the answer address the question?'],
                ['Faithfulness / groundedness', 'Is every claim supported by retrieved context?'],
                ['Answer correctness', 'Does the answer match ground truth?'],
                ['Citation accuracy', 'Do cited sources actually contain the claimed information?'],
                ['Refusal accuracy', 'Does the model say "I don\'t know" when context lacks the answer?'],
              ].map(([metric, measures]) => (
                <tr key={metric} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{metric}</td>
                  <td className="px-4 py-3 text-slate-400">{measures}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Faithfulness example">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-slate-400">Retrieved context:</div>
          <div className="mt-1 font-mono text-slate-200">"Refunds within 30 days of purchase."</div>
          <div className="mt-3 text-slate-400">Generated answer:</div>
          <div className="mt-1 font-mono text-slate-200">"Refunds are available within 30 days." → <span className="text-genai-400">Faithful ✓</span></div>
          <div className="mt-2 font-mono text-slate-200">"Refunds are available within 60 days." → <span className="text-red-400">Hallucination ✗</span></div>
        </div>
      </LessonSection>

      <LessonSection title="How to measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Human evaluation</strong> — reviewers score faithfulness and relevance. Gold standard but slow.</li>
          <li><strong className="text-white">LLM-as-judge</strong> — a strong LLM scores answers against context. Fast and correlates well with humans.</li>
          <li><strong className="text-white">Automated frameworks</strong> — RAGAS, DeepEval, TruLens compute faithfulness and relevance programmatically.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Faithfulness: is the answer grounded in retrieved context? The key anti-hallucination metric.',
          'Only evaluate generation after retrieval Recall@k is acceptable.',
          'LLM-as-judge and frameworks like RAGAS automate faithfulness scoring.',
        ]}
      />
    </LessonArticle>
  )
}
