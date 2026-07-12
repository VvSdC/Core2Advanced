import {
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function WeaviateAndPgvector() {
  return (
    <LessonArticle>
      <LessonSection title="Weaviate">
        <p>
          <strong className="text-white">Weaviate</strong> is an open-source vector database with built-in{' '}
          <strong className="text-white">hybrid search</strong> (dense + BM25) and optional vectorisation modules
          that embed text for you.
        </p>
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Basic — Docker local instance</p>
            <p className="mt-1 text-sm text-slate-400">Run locally, create a class (schema), import objects, query.</p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Intermediate — Hybrid search</p>
            <p className="mt-1 text-sm text-slate-400">Combine vector similarity with BM25 keyword search in one query. alpha parameter balances the two.</p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Advanced — Weaviate Cloud + modules</p>
            <p className="mt-1 text-sm text-slate-400">Managed hosting. Auto-embed with text2vec-openai or text2vec-cohere modules. Multi-tenancy.</p>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="pgvector (PostgreSQL extension)">
        <p>
          <strong className="text-white">pgvector</strong> adds vector columns and similarity search to PostgreSQL.
          If your team already runs Postgres, this avoids a separate vector database entirely.
        </p>
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Basic — vector column + cosine search</p>
            <p className="mt-1 text-sm text-slate-400">Store embeddings alongside regular relational data. SQL queries with ORDER BY embedding &lt;=&gt; query.</p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Intermediate — HNSW index</p>
            <p className="mt-1 text-sm text-slate-400">CREATE INDEX using HNSW for fast ANN search. Handles millions of vectors in Postgres.</p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Advanced — SQL + vector joins</p>
            <p className="mt-1 text-sm text-slate-400">Join vector search with relational filters in one SQL query. Ideal when RAG data lives next to user/order tables.</p>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="Weaviate vs pgvector">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Choose Weaviate when</th>
                <th className="px-4 py-3">Choose pgvector when</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 text-slate-400">Need built-in hybrid search; dedicated vector DB features</td>
                <td className="px-4 py-3 text-slate-400">Already on Postgres; want vectors + relational data together</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Weaviate offers built-in hybrid search and optional auto-embedding modules.',
          'pgvector adds vector search to PostgreSQL — no new database to operate.',
          'Weaviate for dedicated vector features; pgvector for Postgres-native teams.',
        ]}
      />
    </LessonArticle>
  )
}
