import {
  Callout,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/1702.08734'

export function FaissBillionScale() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Billion-scale Similarity Search with GPUs"
        authors="Johnson, Douze & Jégou (Facebook AI Research)"
        year="2017"
        venue="FAISS"
        url={PAPER_URL}
      >
        The paper behind <strong className="text-white">FAISS</strong> — indexing and searching billions of
        vectors on GPUs with product quantization and inverted indexes.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read the <em>FAISS</em> and <em>HNSW</em> lessons. This paper explains the indexing techniques FAISS
        implements.
      </Callout>

      <LessonSection title="What FAISS enables">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">GPU-accelerated search</strong> — query billions of vectors in milliseconds.</li>
          <li><strong className="text-white">Product Quantization (PQ)</strong> — compress 768-dim float vectors to 96 bytes with minimal accuracy loss.</li>
          <li><strong className="text-white">IVF (Inverted File Index)</strong> — cluster vectors into Voronoi cells; search only the nearest cells.</li>
          <li><strong className="text-white">Composite indexes</strong> — IVF + PQ + HNSW combined for maximum scale.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Product Quantization — intuition">
        <p>
          Instead of storing 768 floats (3 KB per vector), PQ splits the vector into 96 sub-vectors and replaces
          each with a codebook index (1 byte each) → <strong className="text-white">96 bytes per vector</strong>.
          A billion vectors: 3 TB → 96 GB.
        </p>
      </LessonSection>

      <LessonSection title="Key results">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>First system to search 1 billion vectors on a single GPU in under 50ms.</li>
          <li>PQ compression enabled RAG at web scale — millions of document chunks become feasible.</li>
          <li>Open-sourced as the FAISS library — still the most widely used similarity search tool.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'FAISS paper introduced GPU search, IVF clustering, and Product Quantization.',
          'PQ compresses vectors 32× — essential for billion-vector indexes.',
          'Foundation of the FAISS library used in most RAG prototyping pipelines.',
        ]}
      />
    </LessonArticle>
  )
}
