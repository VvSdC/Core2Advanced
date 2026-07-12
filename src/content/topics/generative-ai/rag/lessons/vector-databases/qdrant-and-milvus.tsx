import {
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function QdrantAndMilvus() {
  return (
    <LessonArticle>
      <LessonSection title="Qdrant">
        <p>
          <strong className="text-white">Qdrant</strong> is a Rust-based open-source vector database focused on
          performance, filtering, and production reliability. Self-host or use Qdrant Cloud.
        </p>
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Basic — local Docker</p>
            <p className="mt-1 text-sm text-slate-400">Collections, point upsert, vector search. REST and gRPC APIs.</p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Intermediate — payload filtering</p>
            <p className="mt-1 text-sm text-slate-400">Rich JSON payload filters combined with vector search. Nested conditions, ranges, geo filters.</p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Advanced — quantization + distributed</p>
            <p className="mt-1 text-sm text-slate-400">Scalar/binary quantization for memory savings. Cluster mode for horizontal scaling.</p>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="Milvus">
        <p>
          <strong className="text-white">Milvus</strong> is built for massive scale — billions of vectors with
          distributed architecture. Backed by Zilliz Cloud for managed hosting.
        </p>
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Basic — Milvus Lite (embedded)</p>
            <p className="mt-1 text-sm text-slate-400">Python package, no server needed. Good for local dev — like Chroma but more scalable.</p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Intermediate — Standalone server</p>
            <p className="mt-1 text-sm text-slate-400">Docker deployment. Multiple index types (HNSW, IVF, DiskANN). Partitioning by collection.</p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Advanced — Distributed cluster</p>
            <p className="mt-1 text-sm text-slate-400">Separate query, data, and coordinator nodes. Built for billion-vector enterprise search.</p>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="Quick comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Database</th>
                <th className="px-4 py-3">Best for</th>
                <th className="px-4 py-3">Hosting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['FAISS', 'Prototyping', 'In-process library'],
                ['Chroma', 'Local dev / MVP', 'Embedded or server'],
                ['Pinecone', 'Managed production', 'Cloud only'],
                ['Weaviate', 'Hybrid search', 'Self-host or cloud'],
                ['pgvector', 'Postgres teams', 'Your Postgres'],
                ['Qdrant', 'Filtered production search', 'Self-host or cloud'],
                ['Milvus', 'Billion-vector scale', 'Self-host or Zilliz Cloud'],
              ].map(([db, best, hosting]) => (
                <tr key={db} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{db}</td>
                  <td className="px-4 py-3 text-slate-400">{best}</td>
                  <td className="px-4 py-3 text-slate-400">{hosting}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Qdrant: Rust-based, rich payload filtering, strong self-hosted option.',
          'Milvus: built for billion-vector distributed scale; Milvus Lite for local dev.',
          'Start with FAISS/Chroma → move to Pinecone/Qdrant/pgvector for production.',
        ]}
      />
    </LessonArticle>
  )
}
