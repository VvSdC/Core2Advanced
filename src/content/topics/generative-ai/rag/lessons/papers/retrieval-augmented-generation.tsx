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

      <LessonSection title="What this paper means in plain English">
        <p>
          Imagine you are taking an open-book exam. A plain language model has to answer from memory alone —
          like a closed-book test. If the course material changed last week, the model still quotes what it
          memorised during training. This paper says: let the model look things up first, then write the answer
          using what it found.
        </p>
        <p>
          That lookup step is <strong className="text-white">retrieval</strong>. The model searches a document
          library (Wikipedia passages), pulls the most relevant pages, and feeds them into a text generator that
          writes the final answer. The clever part is that both pieces — the searcher and the writer — can be
          trained together as one system.
        </p>
        <p>
          Lewis et al. also gave this pattern its name: <strong className="text-white">Retrieval-Augmented
          Generation (RAG)</strong>. Think of it as giving an AI a searchable filing cabinet it can open at
          question time, instead of hoping it remembered every fact from its original training.
        </p>
      </LessonSection>

      <LessonSection title="Background — parametric vs non-parametric memory">
        <p>
          A language model's knowledge lives in its <strong className="text-white">parameters</strong> (the
          numerical weights learned during training — this is called{' '}
          <strong className="text-white">parametric memory</strong>, knowledge baked into the model itself).
          Updating a fact requires retraining. Lewis et al. proposed adding a{' '}
          <strong className="text-white">non-parametric memory</strong> — an external, searchable index of
          documents you can update by adding or swapping files, without retraining the model.
        </p>
      </LessonSection>

      <LessonSection title="The RAG architecture">
        <ContentStep number={1} title="Two components">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li><strong className="text-white">Retriever</strong> — <em>dense passage retrieval (DPR)</em> embeds questions and documents as vectors and finds the top-k (best k) relevant Wikipedia passages by similarity.</li>
            <li><strong className="text-white">Generator</strong> — a <em>seq2seq</em> (sequence-to-sequence) model like BART reads the retrieved passages and writes the answer word by word.</li>
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
                ['RAG Architecture', 'This paper turns the retrieve → augment → generate flow into a concrete, trainable system you can build'],
                ['Augmentation & Generation', 'Shows how stuffing retrieved passages into the prompt leads to more factual answers'],
                ['Introduction to RAG', 'Explains why looking things up beats retraining the model every time your data changes'],
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
        RAG works because it separates <em>what the model knows</em> (its trained weights) from{' '}
        <em>what it can look up</em> (your document index). You can update the index anytime without
        retraining — that is the whole point.
      </Callout>

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
