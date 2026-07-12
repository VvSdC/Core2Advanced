import {
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function EvaluationFrameworks() {
  return (
    <LessonArticle>
      <LessonSection title="RAGAS">
        <p>
          <strong className="text-white">RAGAS</strong> (Retrieval Augmented Generation Assessment) is the most
          widely used open-source RAG evaluation framework. It computes metrics without requiring ground-truth
          answers for every question.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">RAGAS metric</th>
                <th className="px-4 py-3">Measures</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Context precision', 'Are retrieved chunks relevant to the question?'],
                ['Context recall', 'Did retrieval find all necessary information?'],
                ['Faithfulness', 'Is the answer grounded in the retrieved context?'],
                ['Answer relevancy', 'Does the answer address the question?'],
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

      <LessonSection title="Other frameworks">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Framework</th>
                <th className="px-4 py-3">Strength</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['DeepEval', 'Pytest-style RAG unit tests; CI/CD integration'],
                ['TruLens', 'Tracing + feedback functions; LangChain integration'],
                ['LangSmith', 'LangChain-native eval datasets and tracing'],
                ['Phoenix (Arize)', 'Embedding visualisation and retrieval debugging'],
              ].map(([framework, strength]) => (
                <tr key={framework} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{framework}</td>
                  <td className="px-4 py-3 text-slate-400">{strength}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Recommended eval workflow">
        <ol className="list-decimal space-y-2 pl-5 text-slate-300">
          <li>Build a test set of 30–100 questions with labelled correct chunks.</li>
          <li>Measure Recall@5 manually or with RAGAS context recall.</li>
          <li>If recall ≥ 80%, measure faithfulness and answer relevancy.</li>
          <li>Iterate on the weakest layer (chunking, retrieval, or generation).</li>
          <li>Re-run after each change — track metrics over time.</li>
        </ol>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RAGAS provides context precision/recall, faithfulness, and answer relevancy out of the box.',
          'DeepEval for CI/CD tests; TruLens/LangSmith for tracing; Phoenix for embedding debugging.',
          'Workflow: labelled test set → Recall@k → faithfulness → iterate on weakest layer.',
        ]}
      />
    </LessonArticle>
  )
}
