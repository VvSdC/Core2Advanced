import {
  Callout,
  ContentStep,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2311.09476'

export function AresAutomatedEvaluation() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="ARES: An Automated Evaluation Framework for Retrieval-Augmented Generation Systems"
        authors="Saad-Falcon et al. (Stanford)"
        year="2023"
        url={PAPER_URL}
      >
        <strong className="text-white">ARES</strong> — train lightweight judge models on synthetic data to evaluate
        RAG context relevance, answer faithfulness, and answer relevance at scale without expensive LLM calls.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read <em>RAGAS</em> (previous paper) and <em>Generation & Faithfulness Metrics</em>. ARES improves on
        RAGAS by replacing per-query LLM judge calls with fine-tuned lightweight judges.
      </Callout>

      <LessonSection title="What this paper means in plain English">
        <p>
          RAGAS is great for evaluating your RAG system, but it uses a large LLM (like GPT-4) as a judge for
          every single evaluation call. That gets expensive fast if you want to monitor quality continuously in
          production — like hiring a senior lawyer to review every customer support email.
        </p>
        <p>
          ARES asks: can we train a small, fast judge model that scores just as well as GPT-4 but costs 100×
          less? It uses GPT-4 once to generate synthetic training examples (labelled good/bad answers), then
          fine-tunes a lightweight model (DeBERTa-based) to predict those quality scores. At evaluation time,
          the small judge runs in milliseconds instead of seconds.
        </p>
        <p>
          Think of it as training an intern using examples graded by an expert, then letting the intern handle
          day-to-day reviews. ARES makes continuous RAG monitoring affordable — the kind of thing you would
          run on every production query to catch quality drops early.
        </p>
      </LessonSection>

      <LessonSection title="The cost problem with RAGAS">
        <p>
          RAGAS uses a large LLM (GPT-4) as <em>judge</em> (an evaluator model that scores answer quality) for
          every evaluation call — expensive at scale. ARES asks: can we train a{' '}
          <strong className="text-white">small fine-tuned judge</strong> that correlates with human ratings but
          costs 100× less per evaluation?
        </p>
      </LessonSection>

      <LessonSection title="How ARES works">
        <ContentStep number={1} title="Synthetic training data">
          <p>
            GPT-4 generates labelled examples of good/bad context relevance, faithfulness, and answer
            relevance — creating a <em>synthetic training set</em> (AI-generated labelled data) without human
            annotation.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Fine-tuned judge models">
          <p>
            Small models (DeBERTa-based) are fine-tuned on synthetic labels to predict the three RAG quality
            dimensions. Inference is milliseconds, not seconds.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Prediction-powered inference">
          <p>
            <em>Prediction-powered inference</em> (a statistical method that corrects for imperfect training
            labels) ensures judge predictions align with human preferences — with confidence intervals on
            final scores.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Key results">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>ARES judges correlated with human ratings as well as GPT-4 judges.</li>
          <li>100× cheaper per evaluation — enables continuous monitoring in production.</li>
          <li>Evaluated across KILT, SuperGLUE, and domain-specific RAG benchmarks.</li>
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
                ['RAGAS paper', 'ARES solves the cost problem RAGAS has when you want to evaluate at scale'],
                ['Generation & Faithfulness Metrics', 'ARES judges the same dimensions — faithfulness, relevance, context quality'],
                ['RAG Evaluation Overview', 'Shows how to move from one-off evaluation to continuous production monitoring'],
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
        RAGAS is great for testing, but too expensive for monitoring every production query. ARES shows you
        can train a small, cheap judge that scores just as well — making continuous quality checks realistic.
      </Callout>

      <KeyTakeaways
        items={[
          'ARES trains lightweight judge models on synthetic GPT-4-labelled data.',
          'Scores context relevance, faithfulness, and answer relevance at 100× lower cost than RAGAS.',
          'Enables continuous production RAG monitoring without expensive LLM judge calls.',
        ]}
      />
    </LessonArticle>
  )
}
