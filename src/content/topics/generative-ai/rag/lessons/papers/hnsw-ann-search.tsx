import {
  Callout,
  ContentStep,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/1603.09320'

export function HnswAnnSearch() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Efficient and Robust Approximate Nearest Neighbor Search Using HNSW Graphs"
        authors="Malkov & Yashunin"
        year="2018"
        url={PAPER_URL}
      >
        Introduced <strong className="text-white">HNSW</strong> — the graph-based ANN algorithm powering
        FAISS, Pinecone, Qdrant, Weaviate, and pgvector at scale.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read <em>Vector Databases Overview</em> and <em>FAISS</em> lessons. HNSW is the algorithm behind Level 3
        FAISS indexing.
      </Callout>

      <LessonSection title="What this paper means in plain English">
        <p>
          Your vector database might hold millions of document embeddings. Finding the closest one to a query
          by checking every single vector is like looking up a word by reading every page of a dictionary —
          correct, but painfully slow. HNSW offers a shortcut that is almost as accurate but dramatically
          faster.
        </p>
        <p>
          The idea is a multi-layer map. The top layer has long-range connections (like highways between cities).
          You start there, jump toward the query, then drop to a denser layer (local streets) and refine your
          search. You never check every vector — just follow the graph hops, which scales to billions of vectors.
        </p>
        <p>
          This is the algorithm inside FAISS, Pinecone, Qdrant, Weaviate, and pgvector. You do not need to
          implement it yourself, but understanding HNSW explains why vector search is fast enough for real-time
          RAG applications.
        </p>
      </LessonSection>

      <LessonSection title="The problem — exact search is too slow">
        <p>
          Comparing a query vector to 10 million stored vectors takes O(n) time (linear — every vector checked)
          — hundreds of milliseconds per query.{' '}
          <strong className="text-white">Approximate Nearest Neighbour (ANN)</strong> search trades a tiny
          accuracy loss (~1–2%) for 100× speedup by skipping most vectors.
        </p>
      </LessonSection>

      <LessonSection title="How HNSW works">
        <ContentStep number={1} title="Hierarchical graph layers">
          <p>
            Vectors are nodes in a multi-layer graph. The top layer is sparse (long jumps); bottom layer is dense
            (fine-grained). Search starts at the top and descends — like skipping highways then local streets.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Greedy graph traversal">
          <p>
            From the entry point, always move to the nearest neighbour. Stop when no closer neighbour exists.
            Then drop to the next layer and repeat. Total hops: O(log n).
          </p>
        </ContentStep>
        <ContentStep number={3} title="ef_search parameter">
          <p>
            Controls exploration breadth — higher <code className="font-mono text-sm">ef_search</code> (the
            "how hard to look" dial) = more accurate but slower. Production default: ef_search=100–200 for
            good recall/speed balance.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Where HNSW is used">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>FAISS IndexHNSWFlat</li>
          <li>Pinecone pod indexes</li>
          <li>Qdrant default index</li>
          <li>Weaviate vector index</li>
          <li>pgvector HNSW extension</li>
        </ul>
      </LessonSection>

      <LessonSection title="Connection to Vector Database lessons">
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
                ['Vector Databases Overview', 'HNSW is the graph-based index that makes million-vector search feel instant'],
                ['FAISS', 'IndexHNSWFlat in FAISS implements this exact algorithm'],
                ['What Are Embeddings?', 'Once you have embeddings, HNSW is how you search them fast at query time'],
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
        HNSW is why vector search feels instant even with millions of documents. You trade ~1% accuracy for
        100× speed — and that trade-off is almost always worth it for RAG.
      </Callout>

      <KeyTakeaways
        items={[
          'HNSW builds a hierarchical graph for O(log n) approximate nearest-neighbour search.',
          'Powers most production vector databases — FAISS, Pinecone, Qdrant, pgvector.',
          'ef_search tunes the accuracy/speed trade-off at query time.',
        ]}
      />
    </LessonArticle>
  )
}
