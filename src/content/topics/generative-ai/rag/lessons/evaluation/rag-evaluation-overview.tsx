import {
  Callout,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function RagEvaluationOverview() {
  return (
    <LessonArticle>
      <LessonSection title="Two quality dimensions">
        <p>
          RAG quality splits into <strong className="text-white">retrieval quality</strong> (did we find the
          right chunks?) and <strong className="text-white">generation quality</strong> (did the model produce a
          correct, grounded answer?). Evaluate both separately — they fail independently.
        </p>
      </LessonSection>

      <LessonSection title="Evaluation layers">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Layer</th>
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Lesson</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Retrieval', 'Is the right chunk in top-k?', 'Retrieval Metrics'],
                ['Generation', 'Is the answer correct and grounded?', 'Generation & Faithfulness Metrics'],
                ['System', 'When does RAG fail entirely?', 'Limitations & Debugging'],
                ['End-to-end', 'How to run a full eval pipeline?', 'Evaluation Frameworks'],
              ].map(([layer, question, lesson]) => (
                <tr key={layer} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{layer}</td>
                  <td className="px-4 py-3 text-slate-400">{question}</td>
                  <td className="px-4 py-3 text-genai-400">{lesson}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Building a test set">
        <ol className="list-decimal space-y-2 pl-5 text-slate-300">
          <li>Collect 30–100 real user questions (or realistic synthetic ones).</li>
          <li>For each question, label which document chunks contain the answer.</li>
          <li>Write the expected answer (ground truth).</li>
          <li>Run the full RAG pipeline and measure retrieval + generation separately.</li>
        </ol>
      </LessonSection>

      <Callout variant="tip">
        Start evaluating early — even 20 labelled questions reveal whether the problem is chunking, retrieval,
        or generation.
      </Callout>

      <KeyTakeaways
        items={[
          'Evaluate retrieval and generation as separate dimensions.',
          'Build a labelled test set of questions with known correct chunks and answers.',
          '30–100 questions is enough to guide tuning decisions.',
        ]}
      />
    </LessonArticle>
  )
}
