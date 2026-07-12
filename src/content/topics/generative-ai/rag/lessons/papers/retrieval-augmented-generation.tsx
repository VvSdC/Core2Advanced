import {
  Callout,
  ContentStep,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2005.11401'

export function RetrievalAugmentedGeneration() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks"
        authors="Lewis et al. (Facebook AI Research)"
        year="2020"
        url={PAPER_URL}
      >
        The paper that <strong className="text-white">named and formalised RAG</strong> — retrieve documents,
        condition generation on them, and outperform parametric-only models on knowledge-heavy tasks.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Complete <em>RAG Architecture</em> and <em>Augmentation & Generation</em> in Fundamentals first.
      </Callout>

      <LessonSection title="Background — parametric vs non-parametric memory">
        <p>
          A language model's knowledge lives in its <strong className="text-white">parameters</strong> (weights).
          Updating a fact requires retraining. Lewis et al. proposed adding a{' '}
          <strong className="text-white">non-parametric memory</strong> — a searchable index of documents that
          can be updated without touching model weights.
        </p>
      </LessonSection>

      <LessonSection title="The RAG architecture">
        <ContentStep number={1} title="Two components">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li><strong className="text-white">Retriever</strong> — dense passage retrieval (DPR) finds top-k relevant Wikipedia passages.</li>
            <li><strong className="text-white">Generator</strong> — a seq2seq model (BART) produces the answer conditioned on retrieved passages.</li>
          </ul>
        </ContentStep>
        <ContentStep number={2} title="Two variants">
          <p>
            <strong className="text-white">RAG-Sequence</strong> uses the same retrieved document for the entire
            answer. <strong className="text-white">RAG-Token</strong> can pick a different document per generated
            token — more flexible but more complex.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Key results">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Outperformed parametric-only models on open-domain QA (Natural Questions, TriviaQA).</li>
          <li>Generated answers were more factual and specific than BART alone.</li>
          <li>Retrieved documents could be inspected — making the system more interpretable.</li>
          <li>Index could be hot-swapped to update knowledge without retraining.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Connection to Fundamentals lessons">
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
                ['RAG Architecture', 'Formalises retrieve → augment → generate as a trainable architecture'],
                ['Augmentation & Generation', 'Conditions generation on retrieved passages for factual answers'],
                ['Introduction to RAG', 'Named and justified the RAG pattern over fine-tuning alone'],
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

      <KeyTakeaways
        items={[
          'Named RAG: combine a retriever (non-parametric memory) with a generator (parametric memory).',
          'RAG-Sequence vs RAG-Token: same docs for whole answer vs per-token doc selection.',
          'Outperformed parametric-only models on knowledge-intensive QA benchmarks.',
          'Foundation for every modern RAG system — including LangChain implementations.',
        ]}
      />
    </LessonArticle>
  )
}
