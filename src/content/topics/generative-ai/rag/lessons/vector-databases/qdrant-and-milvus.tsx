import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function QdrantAndMilvus() {
  return (
    <LessonArticle>
      <Definition term="Qdrant">
        <p>
          <strong className="text-white">Qdrant</strong> is an open-source vector database written in Rust,
          built for production workloads that need <em>rich filtering</em> combined with fast similarity search.
          Self-host with Docker or use Qdrant Cloud. Think of it as Chroma's production-grade sibling with
          stronger filtering and performance.
        </p>
      </Definition>

      <LessonSection title="Qdrant vocabulary">
        <div className="space-y-3">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Collection = a named group of vectors</p>
            <p className="mt-1 text-sm text-slate-400">Same concept as Chroma collections or Pinecone indexes.</p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Point = one vector + payload</p>
            <p className="mt-1 text-sm text-slate-400">
              A point has an id, the embedding vector, and a <strong className="text-white">payload</strong> — a
              JSON object with any metadata you want (text, source, tags, dates, nested objects).
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Payload filter = search inside a JSON subset</p>
            <p className="mt-1 text-sm text-slate-400">
              Qdrant's standout feature. Filter on nested JSON conditions — ranges, arrays, geo coordinates —
              <em> before</em> running vector similarity. More expressive than most vector DBs.
            </p>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="Payload filtering — concrete example">
        <p className="text-slate-300">
          You store support ticket chunks with rich metadata. At query time, you want only tickets from the last
          30 days, tagged "billing", from enterprise customers:
        </p>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-xs text-slate-300">
          <div className="text-slate-400">Filter (applied before vector search)</div>
          <div className="mt-2">must: [</div>
          <div>&nbsp;&nbsp;{'{ key: "category", match: { value: "billing" } }'},</div>
          <div>&nbsp;&nbsp;{'{ key: "tier", match: { value: "enterprise" } }'},</div>
          <div>&nbsp;&nbsp;{'{ key: "date", range: { gte: "2025-06-01" } }'}</div>
          <div>]</div>
          <div className="mt-2 text-slate-400">Then: rank remaining vectors by similarity to query</div>
        </div>
        <p className="mt-4 text-slate-300">
          Qdrant applies the filter first (narrows to matching points), then runs HNSW similarity only on that
          subset. Fast even with millions of total vectors.
        </p>
      </LessonSection>

      <LessonSection title="Qdrant progression">
        <ContentStep number={1} title="Local Docker — collections, upsert, search">
          <p>Run one container. REST and gRPC APIs. Same workflow as Chroma but with richer filters.</p>
        </ContentStep>
        <ContentStep number={2} title="Payload filtering — production queries">
          <p>Complex JSON filters combined with vector search. The reason teams pick Qdrant over Chroma at scale.</p>
        </ContentStep>
        <ContentStep number={3} title="Quantization + cluster — scale out">
          <p>Compress vectors to save RAM. Distribute across nodes for horizontal scaling. Qdrant Cloud handles this for you.</p>
        </ContentStep>
      </LessonSection>

      <Definition term="Milvus">
        <p>
          <strong className="text-white">Milvus</strong> is a distributed vector database designed for{' '}
          <em>massive scale</em> — billions of vectors across multiple machines. It separates storage, indexing,
          and query into independent services that scale horizontally. Use Milvus Lite for local dev; use the
          full cluster (or Zilliz Cloud) for enterprise.
        </p>
      </Definition>

      <LessonSection title="Why Milvus exists — the scale problem">
        <p className="text-slate-300">
          At 10,000 vectors, any database works. At 100 million, you need distributed architecture — data spread
          across machines, queries routed to the right shards, indexes built in parallel. Milvus is built for
          this from the ground up.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Scale</th>
                <th className="px-4 py-3">Typical tool</th>
                <th className="px-4 py-3">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['<100k vectors', 'FAISS or Chroma', 'Single machine, zero ops'],
                ['100k – 10M', 'Qdrant, pgvector, Pinecone', 'One server or managed cloud handles it'],
                ['10M – 1B+', 'Milvus cluster or Pinecone pods', 'Distributed nodes, sharded data, parallel indexing'],
              ].map(([scale, tool, why]) => (
                <tr key={scale} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{scale}</td>
                  <td className="px-4 py-3 text-slate-400">{tool}</td>
                  <td className="px-4 py-3 text-slate-400">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Milvus in three modes">
        <div className="space-y-3">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Milvus Lite — pip install, no server</p>
            <p className="mt-1 text-sm text-slate-400">
              Embedded in your Python process. Like Chroma for local dev, but with Milvus's index types (HNSW,
              IVF, DiskANN). Good for testing before deploying a cluster.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Standalone — single Docker deployment</p>
            <p className="mt-1 text-sm text-slate-400">
              One machine runs all components. Handles millions of vectors. Good for mid-scale production.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Distributed cluster — separate query, data, coordinator nodes</p>
            <p className="mt-1 text-sm text-slate-400">
              Each component scales independently. Built for billion-vector enterprise search. Zilliz Cloud
              offers managed Milvus hosting.
            </p>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="Full comparison — all vector DBs at a glance">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Database</th>
                <th className="px-4 py-3">What it is</th>
                <th className="px-4 py-3">Best for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['FAISS', 'Similarity math library (not a DB)', 'Prototyping on your laptop'],
                ['Chroma', 'Simple local vector DB', 'MVPs and tutorials'],
                ['Pinecone', 'Managed cloud vector DB', 'Production without DevOps'],
                ['Weaviate', 'Vector DB + hybrid keyword search', 'When exact words matter too'],
                ['pgvector', 'Vector column inside Postgres', 'Teams already on Postgres'],
                ['Qdrant', 'Rust vector DB, rich JSON filters', 'Filtered production search'],
                ['Milvus', 'Distributed vector DB', 'Billions of vectors, enterprise scale'],
              ].map(([db, what, best]) => (
                <tr key={db} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{db}</td>
                  <td className="px-4 py-3 text-slate-400">{what}</td>
                  <td className="px-4 py-3 text-slate-400">{best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="The learning path">
        <p className="text-slate-300">
          You do not need to learn all seven. Follow this progression:
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Learn concepts</strong> (Overview lesson) — store vectors, search by similarity, filter by metadata.</li>
          <li><strong className="text-white">Prototype</strong> with FAISS or Chroma on your laptop.</li>
          <li><strong className="text-white">Pick production</strong> based on your stack: Postgres → pgvector, no DevOps → Pinecone, rich filters → Qdrant, hybrid search → Weaviate, massive scale → Milvus.</li>
        </ol>
      </LessonSection>

      <Callout variant="insight">
        Qdrant and Milvus solve problems most RAG apps never hit. If you are building your first RAG system,
        Chroma or pgvector is almost certainly enough. Come back to Qdrant when filtering gets complex, and
        Milvus when you outgrow a single machine.
      </Callout>

      <KeyTakeaways
        items={[
          'Qdrant: production vector DB with rich JSON payload filters applied before similarity search.',
          'Milvus: distributed architecture for billions of vectors. Milvus Lite for local dev, cluster for enterprise.',
          'Learning path: concepts → FAISS/Chroma prototype → one production DB matched to your stack.',
          'Most first RAG apps need Chroma or pgvector — not Qdrant or Milvus.',
        ]}
      />
    </LessonArticle>
  )
}
