import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function IntroductionToRag() {
  return (
    <LessonArticle>
      <Definition term="Retrieval-Augmented Generation (RAG)">
        <p>
          <strong className="text-white">RAG</strong> is a pattern where a language model{' '}
          <strong className="text-white">retrieves relevant documents</strong> from an external knowledge base,
          injects them into the prompt as context, and <em>then</em> generates an answer. The model answers
          from your data — not just its training memory.
        </p>
      </Definition>

      <LessonSection title="Why RAG exists">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>LLMs have a <strong className="text-white">knowledge cutoff</strong> — they cannot know about events or documents after training.</li>
          <li>They <strong className="text-white">hallucinate</strong> when asked about proprietary or niche information not in training data.</li>
          <li>Fine-tuning on every new document batch is expensive and slow to update.</li>
          <li>RAG lets you plug in fresh, private data at inference time — no retraining.</li>
        </ul>
      </LessonSection>

      <LessonSection title="RAG vs fine-tuning vs long context">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Approach</th>
                <th className="px-4 py-3">Best for</th>
                <th className="px-4 py-3">Trade-off</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['RAG', 'Q&A over docs, knowledge bases, support bots', 'Retrieval quality matters; adds latency'],
                ['Fine-tuning', 'Changing style, tone, or task format permanently', 'Expensive; hard to update facts'],
                ['Long context', 'Small doc sets that fit in one prompt', 'Costly tokens; model may ignore middle content'],
              ].map(([approach, best, tradeoff]) => (
                <tr key={approach} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{approach}</td>
                  <td className="px-4 py-3 text-slate-400">{best}</td>
                  <td className="px-4 py-3 text-slate-400">{tradeoff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Callout variant="beginner" title="Read this after">
        Complete <em>Fundamentals → How Language Models Work</em> and <em>Prompt Engineering</em> first. RAG is
        prompt engineering with retrieved context.
      </Callout>

      <LessonSection title="How this sub-topic is organised">
        <p className="mb-4 text-slate-300">
          Six topic areas — each with <strong className="text-white">Lessons</strong> and{' '}
          <strong className="text-white">Research Papers</strong> in the sidebar:
        </p>
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Fundamentals</strong> — architecture, augmentation (you are here) + RAG, REALM, FiD papers.</li>
          <li><strong className="text-white">Embeddings</strong> — model types + Sentence-BERT, DPR, E5 papers.</li>
          <li><strong className="text-white">Chunking Strategies</strong> — splitting strategies + Lost in the Middle, Best Practices survey.</li>
          <li><strong className="text-white">Vector Databases</strong> — FAISS, Chroma, Pinecone, etc. + HNSW, FAISS papers.</li>
          <li><strong className="text-white">Retrieval Strategies</strong> — BM25, hybrid, RRF + HyDE, ColBERT, Self-RAG papers.</li>
          <li><strong className="text-white">Evaluating RAG</strong> — metrics and debugging + RAGAS, ARES papers.</li>
        </ul>
        <Callout variant="tip">
          Conceptual only — no code. Implementation lives in the <em>LangChain</em> sub-topic.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RAG retrieves documents and injects them into the prompt before generation.',
          'Solves knowledge cutoff, hallucination on private data, and slow update cycles.',
          'Cheaper and faster to update than fine-tuning for factual Q&A.',
          'This sub-topic is split into six sections — start with Fundamentals, end with Evaluation.',
        ]}
      />
    </LessonArticle>
  )
}
