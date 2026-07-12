import {
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function VectorDatabasesOverview() {
  return (
    <LessonArticle>
      <LessonSection title="What vector databases do">
        <p>
          A <strong className="text-white">vector database</strong> stores embedding vectors with their text and
          metadata, and answers <strong className="text-white">nearest-neighbour queries</strong> in milliseconds —
          even across millions of chunks.
        </p>
        <Flowchart
          title="Vector DB in the RAG pipeline"
          chart={`flowchart LR
  A[Chunks + embeddings] --> B[(Vector DB)]
  C[Query embedding] --> B
  B --> D[Top-k similar vectors]
  D --> E[Return chunk text + metadata]`}
        />
      </LessonSection>

      <LessonSection title="Core concepts">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Exact search</strong> — compare query to every vector. Accurate but slow at scale.</li>
          <li><strong className="text-white">ANN (approximate)</strong> — HNSW, IVF algorithms. ~99% accuracy, 100× faster.</li>
          <li><strong className="text-white">Metadata filtering</strong> — search only chunks matching source, date, or tags.</li>
          <li><strong className="text-white">Persistence</strong> — in-memory (FAISS) vs disk/cloud (Pinecone, Chroma).</li>
        </ul>
      </LessonSection>

      <LessonSection title="Choosing factors">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Factor</th>
                <th className="px-4 py-3">Question to ask</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Scale', 'Thousands or billions of vectors?'],
                ['Ops', 'Managed cloud or self-hosted?'],
                ['Filtering', 'Need metadata filters or hybrid search?'],
                ['Budget', 'Free/local vs paid managed?'],
                ['Ecosystem', 'Already on Postgres or AWS?'],
              ].map(([factor, question]) => (
                <tr key={factor} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{factor}</td>
                  <td className="px-4 py-3 text-slate-400">{question}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Vector DBs store embeddings and return nearest neighbours fast via ANN algorithms.',
          'Metadata filtering narrows search to relevant document subsets.',
          'Next lessons cover FAISS, Chroma, Pinecone, Weaviate, pgvector, Qdrant, and Milvus individually.',
        ]}
      />
    </LessonArticle>
  )
}
