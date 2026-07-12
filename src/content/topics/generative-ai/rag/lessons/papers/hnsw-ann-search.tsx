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

      <LessonSection title="The problem — exact search is too slow">
        <p>
          Comparing a query vector to 10 million stored vectors takes O(n) time — hundreds of milliseconds per
          query. <strong className="text-white">Approximate Nearest Neighbour (ANN)</strong> trades a tiny
          accuracy loss (~1–2%) for 100× speedup.
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
            Controls exploration breadth — higher ef_search = more accurate but slower. Production default:
            ef_search=100–200 for good recall/speed balance.
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
