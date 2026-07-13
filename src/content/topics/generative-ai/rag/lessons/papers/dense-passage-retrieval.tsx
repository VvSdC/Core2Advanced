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

      <LessonSection title="What this paper means in plain English">
        <p>
          Before this paper, finding relevant documents meant matching keywords — like Ctrl+F through a folder.
          Search for "refund policy" and you miss the page that says "money-back guarantee" because the exact
          words do not match. DPR showed that <em>meaning-based</em> search works much better.
        </p>
        <p>
          The idea is simple: train one model to turn questions into vectors, and another to turn document
          passages into vectors, both living in the same "meaning space." A relevant passage ends up close to
          its question, like pins on a map. At search time, you compare the query vector to all stored passage
          vectors and grab the nearest ones.
        </p>
        <p>
          Think of it as hiring a librarian who understands what you <em>mean</em>, not just what words you
          typed. This bi-encoder pattern — encode query and documents separately, compare later — is exactly
          how Pinecone, Qdrant, and every vector database retrieval pipeline works today.
        </p>
      </LessonSection>

      <LessonSection title="Background — BM25 was the standard">
        <p>
          Before DPR, open-domain QA systems used <strong className="text-white">BM25</strong> — a keyword-based
          ranking function that counts how often query words appear in a document (like a smarter Ctrl+F).
          BM25 misses semantic matches: searching "refund policy" would not find a passage saying "money-back
          guarantee."
        </p>
      </LessonSection>

      <LessonSection title="How DPR works">
        <ContentStep number={1} title="Two encoders">
          <p>
            DPR trains two BERT encoders in a <em>bi-encoder</em> setup (query and passage encoded separately,
            then compared): a <strong className="text-white">question encoder</strong> and a{' '}
            <strong className="text-white">passage encoder</strong>. Each maps text to a 768-dimensional vector.
            Relevance = dot product between question and passage vectors.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Training with contrastive loss">
          <p>
            For each question, one passage is the correct answer (positive) and other passages in the batch are
            negatives. <em>Contrastive loss</em> (a training signal that pulls matching pairs together and
            pushes non-matching pairs apart) teaches the model to maximise similarity for positive pairs.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Offline indexing">
          <p>
            All passages are pre-encoded and stored. At query time, only the question is encoded — then a fast
            <em> nearest-neighbour search</em> (finding the vectors closest to the query) finds the top-k
            passages. This is exactly the vector store pattern from the <em>Vector Stores</em> lesson.
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
                ['What Are Embeddings?', 'DPR showed how to train embedding models specifically for matching questions to passages'],
                ['Dense vs Sparse', 'DPR is the dense (meaning-based) approach — pair it with BM25 keyword search for hybrid retrieval'],
                ['Open-Source Embeddings', 'Modern models like BGE and E5 are descendants of DPR\'s dual-encoder idea'],
                ['Vector Databases Overview', 'The "embed offline, search at query time" workflow started here'],
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
        DPR proved that meaning-based search beats keyword search for finding answers. The pattern — embed
        documents once, embed the query at search time, grab the closest matches — is the core of every RAG
        retriever you will build.
      </Callout>

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
