import {
  Callout,
  ContentStep,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2309.15217'

export function RagasEvaluation() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="RAGAS: Automated Evaluation of Retrieval Augmented Generation"
        authors="Es et al. (Exploding Gradients)"
        year="2023"
        url={PAPER_URL}
      >
        Introduced <strong className="text-white">RAGAS</strong> — a framework that scores RAG pipelines on
        faithfulness, relevance, and context quality without needing ground-truth answers for every question.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read <em>RAG Evaluation Overview</em> and <em>Evaluation Frameworks</em>. RAGAS is the most widely used
        implementation of those concepts.
      </Callout>

      <LessonSection title="The metrics RAGAS defines">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Metric</th>
                <th className="px-4 py-3">Measures</th>
                <th className="px-4 py-3">Needs ground truth?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Faithfulness', 'Are answer claims supported by retrieved context?', 'No'],
                ['Answer relevancy', 'Does the answer address the question?', 'No'],
                ['Context precision', 'Are retrieved chunks relevant to the question?', 'Yes (optional)'],
                ['Context recall', 'Did retrieval find all necessary information?', 'Yes'],
              ].map(([metric, measures, gt]) => (
                <tr key={metric} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{metric}</td>
                  <td className="px-4 py-3 text-slate-400">{measures}</td>
                  <td className="px-4 py-3 text-slate-400">{gt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="How faithfulness works">
        <ContentStep number={1} title="Claim extraction">
          <p>An LLM breaks the generated answer into individual factual claims.</p>
        </ContentStep>
        <ContentStep number={2} title="Verification">
          <p>Each claim is checked against the retrieved context — supported or not supported.</p>
        </ContentStep>
        <ContentStep number={3} title="Score">
          <p>Faithfulness = supported claims / total claims. 1.0 = fully grounded; 0.5 = half hallucinated.</p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Why RAGAS matters">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>First framework to evaluate retrieval and generation <em>together</em> automatically.</li>
          <li>Faithfulness and answer relevancy work without labelled ground-truth answers.</li>
          <li>Open-source Python library — integrates with LangChain and LangSmith.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RAGAS: faithfulness, answer relevancy, context precision, context recall.',
          'Faithfulness uses LLM claim extraction + verification against context.',
          'Standard open-source framework for automated RAG evaluation.',
        ]}
      />
    </LessonArticle>
  )
}
