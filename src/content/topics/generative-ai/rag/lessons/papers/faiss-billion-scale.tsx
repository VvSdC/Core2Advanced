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

      <LessonSection title="What this paper means in plain English">
        <p>
          Storing millions of 768-number vectors (about 3 KB each) adds up fast — a billion vectors would need
          roughly 3 terabytes of RAM. That is too expensive for most teams. FAISS solves the scale problem with
          clever compression and clustering tricks that shrink storage and speed up search.
        </p>
        <p>
          <em>Product Quantization (PQ)</em> is like ZIP-compressing each vector from 3 KB down to 96 bytes —
          you lose a tiny bit of precision, but you can now fit a billion vectors in 96 GB instead of 3 TB.
          <em> IVF (Inverted File Index)</em> clusters vectors into groups and only searches the groups nearest
          to your query, like checking only the library shelves closest to your topic.
        </p>
        <p>
          FAISS combined GPU acceleration, PQ compression, and IVF clustering to search a billion vectors in
          under 50 milliseconds. That is what made web-scale RAG feasible — and the open-source FAISS library
          is still the most common tool for prototyping vector search.
        </p>
      </LessonSection>

      <LessonSection title="What FAISS enables">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">GPU-accelerated search</strong> — query billions of vectors in milliseconds using graphics processors.</li>
          <li><strong className="text-white">Product Quantization (PQ)</strong> — compress 768-dim float vectors to 96 bytes (about 32× smaller) with minimal accuracy loss.</li>
          <li><strong className="text-white">IVF (Inverted File Index)</strong> — cluster vectors into <em>Voronoi cells</em> (geographic regions around cluster centres); search only the nearest cells.</li>
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
                ['FAISS', 'This is the research paper behind the FAISS library you use in the Vector Databases lesson'],
                ['HNSW', 'FAISS can combine IVF + PQ + HNSW for maximum scale — the papers complement each other'],
                ['Vector Databases Overview', 'PQ compression is why storing millions of chunks is affordable'],
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
        FAISS made billion-vector search practical by compressing vectors 32× and searching only relevant
        clusters. You will likely use FAISS (or a database that implements the same ideas) in your first RAG
        prototype.
      </Callout>

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
