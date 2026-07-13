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

      <LessonSection title="What this paper means in plain English">
        <p>
          Most RAG systems today look up documents only when a user asks a question — like a student who
          never opens a textbook until exam day. REALM asks: what if the model practised looking things up
          during its entire education (pre-training), not just at test time?
        </p>
        <p>
          During training, REALM hides important facts in text and forces the model to retrieve Wikipedia
          articles to fill in the blanks. Over millions of practice rounds, the model learns both how to
          search and how to read what it finds. The retriever and the reader improve together.
        </p>
        <p>
          Think of it like teaching a child to use a library from age five, instead of waiting until high
          school. The skill becomes natural. While production systems mostly use inference-time RAG (look up
          at query time), REALM showed that retrieval can be a core ability baked into the model itself.
        </p>
      </LessonSection>

      <LessonSection title="Background — inference-only retrieval">
        <p>
          Lewis et al.'s RAG retrieves documents only at inference time (when a user asks a question) — the
          model itself was not trained to retrieve. REALM proposed integrating retrieval into{' '}
          <strong className="text-white">pre-training</strong> (the initial large-scale training phase where
          the model learns language from scratch) so the model learns to find and use documents as a core skill.
        </p>
      </LessonSection>

      <LessonSection title="How REALM works">
        <ContentStep number={1} title="Retrieve → Read → Predict">
          <p>
            During pre-training on <em>masked language modelling</em> (hiding random words and asking the model
            to predict them), REALM retrieves relevant Wikipedia documents for each input, conditions the model
            on them, and predicts masked tokens. The retriever is updated jointly with the language model.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Asymmetric salient span masking">
          <p>
            Instead of random masking, REALM masks <strong className="text-white">salient spans</strong> — the
            important bits like names, dates, and facts that are likely to benefit from retrieval. This forces
            the model to actually use retrieved documents rather than rely on{' '}
            <strong className="text-white">parametric memory</strong> (facts stored in its trained weights)
            alone.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Maximum inner product search">
          <p>
            Passages are embedded and indexed for fast retrieval during training using{' '}
            <em>maximum inner product search</em> (finding the passage vector most similar to the query vector
            via dot product). The retriever improves over training as the model learns which documents help
            prediction — a feedback loop between retrieval quality and language modelling ability.
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
                ['When retrieval happens', 'During pre-training (while the model is learning)', 'Only when a user asks a question'],
                ['Retriever training', 'Trained together with the language model', 'Usually a separate embedding model you pick or build'],
                ['Update knowledge', 'Re-index documents and optionally retrain', 'Just re-index — no retraining needed'],
                ['Production use today', 'Research foundation that shaped later ideas', 'The standard pattern (LangChain, LlamaIndex, etc.)'],
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

      <Callout variant="beginner" title="Key insight for beginners">
        REALM teaches us that retrieval does not have to be bolted on at the end — a model can learn to search
        as a skill. In practice you will mostly use inference-time RAG, but REALM explains why retrieval-aware
        models matter.
      </Callout>

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
