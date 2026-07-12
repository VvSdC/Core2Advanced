import {
  Callout,
  ContentStep,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2004.04906'

export function DensePassageRetrieval() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Dense Passage Retrieval for Open-Domain Question Answering"
        authors="Karpukhin et al. (Facebook AI Research)"
        year="2020"
        url={PAPER_URL}
      >
        Showed that <strong className="text-white">embedding-based retrieval</strong> dramatically outperforms
        traditional keyword search (BM25) for finding relevant passages.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read <em>Embeddings</em> and <em>Retrieval Methods</em> first. DPR is the retrieval engine behind the
        original RAG paper and the ancestor of every vector-store retriever you will use.
      </Callout>

      <LessonSection title="Background — BM25 was the standard">
        <p>
          Before DPR, open-domain QA systems used <strong className="text-white">BM25</strong> — a keyword-based
          ranking function counting term frequency. BM25 misses semantic matches: searching "refund policy" would
          not find a passage saying "money-back guarantee."
        </p>
      </LessonSection>

      <LessonSection title="How DPR works">
        <ContentStep number={1} title="Two encoders">
          <p>
            DPR trains two BERT encoders: a <strong className="text-white">question encoder</strong> and a{' '}
            <strong className="text-white">passage encoder</strong>. Each maps text to a 768-dimensional vector.
            Relevance = dot product between question and passage vectors.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Training with contrastive loss">
          <p>
            For each question, one passage is the correct answer (positive) and other passages in the batch are
            negatives. The model learns to maximise similarity for positive pairs and minimise it for negatives.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Offline indexing">
          <p>
            All passages are pre-encoded and stored. At query time, only the question is encoded — then a fast
            nearest-neighbour search finds the top-k passages. This is exactly the vector store pattern from the
            <em> Vector Stores</em> lesson.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Key results">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>DPR outperformed BM25 by 9–19% absolute on top-20 passage retrieval accuracy.</li>
          <li>Top-20 dense retrieval contained the answer 78% of the time on Natural Questions.</li>
          <li>Became the retriever used in the RAG paper (Lewis et al.) and countless production systems.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Connection to Embeddings lessons">
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
                ['What Are Embeddings?', 'DPR encoders are embedding models trained for question-passage matching'],
                ['Dense vs Sparse', 'DPR is the dense approach — compare against BM25 in hybrid search'],
                ['Open-Source Embeddings', 'DPR BERT encoders are ancestors of BGE/E5 retrieval models'],
                ['Vector Databases Overview', 'Pre-encode passages offline; ANN search at query time'],
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
          'DPR uses dual encoders to embed questions and passages into the same vector space.',
          'Outperformed BM25 keyword search by a large margin on open-domain QA.',
          'Offline indexing + online nearest-neighbour search — the modern vector store pattern.',
          'Used as the retriever in the original RAG paper; ancestor of all dense retrieval today.',
        ]}
      />
    </LessonArticle>
  )
}
