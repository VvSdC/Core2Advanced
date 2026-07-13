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

      <LessonSection title="What this paper means in plain English">
        <p>
          How do you know if your RAG system is working? You could manually check every answer, but that does
          not scale. RAGAS offers automated scores that tell you: Is the answer grounded in the retrieved
          context? Does it actually address the question? Were the right chunks retrieved?
        </p>
        <p>
          The clever part is that some metrics work <em>without</em> pre-written correct answers. For
          <em>faithfulness</em>, an LLM breaks the generated answer into individual claims and checks each one
          against the retrieved context — like a fact-checker verifying every sentence. For{' '}
          <em>answer relevancy</em>, it checks whether the answer actually addresses what was asked.
        </p>
        <p>
          Think of RAGAS as a report card for your RAG pipeline. You run it on a batch of test questions and
          get scores you can track over time as you tune chunk size, retrieval, and prompts. It is the most
          popular open-source tool for this job.
        </p>
      </LessonSection>

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
                ['Context recall', 'Did retrieval find all necessary information?', 'Yes (needs ground truth — pre-written correct answers)'],
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
          <p>Faithfulness = supported claims / total claims. 1.0 = fully grounded in context; 0.5 = half the claims are unsupported (hallucinated).</p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Why RAGAS matters">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>First framework to evaluate retrieval and generation <em>together</em> automatically.</li>
          <li>Faithfulness and answer relevancy work without labelled ground-truth answers.</li>
          <li>Open-source Python library — integrates with LangChain and LangSmith.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Connection to Evaluation lessons">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Lesson</th>
                <th className="px-4 py-3">How this paper connects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['RAG Evaluation Overview', 'RAGAS is the open-source tool that implements the evaluation concepts from that lesson'],
                ['Evaluation Frameworks', 'Faithfulness and answer relevancy are the core metrics you learned to track'],
                ['Generation & Faithfulness Metrics', 'The claim-extraction approach to faithfulness comes directly from this paper'],
              ].map(([lesson, connection]) => (
                <tr key={lesson} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{lesson}</td>
                  <td className="px-4 py-3 text-slate-400">{connection}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Callout variant="beginner" title="Key insight for beginners">
        You cannot improve what you do not measure. RAGAS gives you automated faithfulness and relevancy
        scores without needing a perfect answer key for every question — run it before and after any tuning
        change.
      </Callout>

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
