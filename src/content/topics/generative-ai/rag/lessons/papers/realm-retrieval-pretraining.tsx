import {
  Callout,
  ContentStep,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2002.08909'

export function RealmRetrievalPretraining() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="REALM: Retrieval-Augmented Language Model Pre-Training"
        authors="Guu et al. (Google Research)"
        year="2020"
        url={PAPER_URL}
      >
        Trained a language model to <strong className="text-white">retrieve and read documents during
        pre-training</strong> — not just at inference time — teaching the model to use external knowledge from
        the start.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read <em>Introduction to RAG</em> and the <em>RAG (Lewis et al.)</em> paper in Fundamentals first.
      </Callout>

      <LessonSection title="Background — inference-only retrieval">
        <p>
          Lewis et al.'s RAG retrieves documents only at inference time — the model itself was not trained to
          retrieve. REALM proposed integrating retrieval into{' '}
          <strong className="text-white">pre-training</strong> so the model learns to find and use documents as
          a core skill.
        </p>
      </LessonSection>

      <LessonSection title="How REALM works">
        <ContentStep number={1} title="Retrieve → Read → Predict">
          <p>
            During pre-training on masked language modelling, REALM retrieves relevant Wikipedia documents for
            each input, conditions the model on them, and predicts masked tokens. The retriever is updated
            jointly with the language model.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Asymmetric salient span masking">
          <p>
            Instead of random masking, REALM masks <strong className="text-white">salient spans</strong> — names,
            dates, facts — that are likely to benefit from retrieval. This forces the model to actually use
            retrieved documents rather than rely on parametric memory alone.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Maximum inner product search">
          <p>
            Passages are embedded and indexed for fast retrieval during training. The retriever improves over
            training as the model learns which documents help prediction — a feedback loop between retrieval
            quality and language modelling ability.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Key results">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Matched or exceeded BERT on open-domain QA without task-specific fine-tuning.</li>
          <li>Retrieval quality improved throughout pre-training — the model learned better search over time.</li>
          <li>Showed that retrieval-augmented pre-training creates models inherently better at using external knowledge.</li>
        </ul>
      </LessonSection>

      <LessonSection title="REALM vs inference-time RAG">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Aspect</th>
                <th className="px-4 py-3">REALM</th>
                <th className="px-4 py-3">Inference-time RAG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['When retrieval happens', 'During pre-training', 'At query time only'],
                ['Retriever training', 'Jointly with LM', 'Separate embedding model (often pre-built)'],
                ['Update knowledge', 'Re-index + optionally retrain', 'Re-index only — no retraining'],
                ['Production use today', 'Research foundation', 'Standard pattern (LangChain, etc.)'],
              ].map(([aspect, realm, rag]) => (
                <tr key={aspect} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{aspect}</td>
                  <td className="px-4 py-3 text-slate-400">{realm}</td>
                  <td className="px-4 py-3 text-slate-400">{rag}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'REALM integrates retrieval into pre-training — not just inference.',
          'Salient span masking forces the model to use retrieved documents during training.',
          'Retriever and language model improve jointly over training.',
          'Inference-time RAG (Lewis et al.) won in production, but REALM shaped how we think about retrieval-augmented LMs.',
        ]}
      />
    </LessonArticle>
  )
}
