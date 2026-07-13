import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function WeaviateAndPgvector() {
  return (
    <LessonArticle>
      <Definition term="Weaviate">
        <p>
          <strong className="text-white">Weaviate</strong> is an open-source vector database that can search by{' '}
          <em>meaning</em> (vector similarity) and by <em>exact words</em> (BM25 keyword search) in a single
          query. It can also embed your text for you via plug-in modules — you send raw text, Weaviate handles
          the embedding step.
        </p>
      </Definition>

      <LessonSection title="Hybrid search — why it matters">
        <p className="text-slate-300">
          Pure vector search misses exact matches. If a user searches for error code{' '}
          <code className="font-mono text-sm">"ERR_4521"</code>, vector similarity might return vaguely related
          errors instead of the exact one. <strong className="text-white">Hybrid search</strong> combines both:
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Search type</th>
                <th className="px-4 py-3">Finds</th>
                <th className="px-4 py-3">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 font-semibold text-white">Vector (dense)</td>
                <td className="px-4 py-3 text-slate-400">Similar meaning, different words</td>
                <td className="px-4 py-3 text-slate-400">"refund" matches "return money"</td>
              </tr>
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 font-semibold text-white">BM25 (keyword)</td>
                <td className="px-4 py-3 text-slate-400">Exact word overlap</td>
                <td className="px-4 py-3 text-slate-400">"ERR_4521" matches documents containing that exact string</td>
              </tr>
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 font-semibold text-white">Hybrid (both)</td>
                <td className="px-4 py-3 text-slate-400">Best of both, weighted by alpha</td>
                <td className="px-4 py-3 text-slate-400">alpha=0.5 balances meaning and exact words equally</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-slate-300">
          The <code className="font-mono text-sm">alpha</code> parameter controls the blend:{' '}
          <code className="font-mono text-sm">alpha=1.0</code> is pure vector,{' '}
          <code className="font-mono text-sm">alpha=0.0</code> is pure keyword,{' '}
          <code className="font-mono text-sm">alpha=0.5</code> is equal mix. Tune on your data.
        </p>
      </LessonSection>

      <LessonSection title="Weaviate in three steps">
        <ContentStep number={1} title="Define a class (schema)">
          <p>
            A class is like a collection — specify properties (text fields, metadata) and vector settings.
            Example: a <code className="font-mono text-sm">Document</code> class with{' '}
            <code className="font-mono text-sm">content</code> and <code className="font-mono text-sm">source</code> fields.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Import objects">
          <p>
            Add documents with text and metadata. If using a vectorisation module (e.g. text2vec-openai), Weaviate
            embeds the text automatically — you never call an embedding API yourself.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Query with hybrid search">
          <p>
            One API call searches by vector similarity and BM25 keyword match simultaneously. Results are fused
            and ranked. No need to run two separate searches and merge manually.
          </p>
        </ContentStep>
      </LessonSection>

      <Definition term="pgvector">
        <p>
          <strong className="text-white">pgvector</strong> is a free extension for PostgreSQL that adds a{' '}
          <code className="font-mono text-sm">vector</code> column type and similarity operators. Your embeddings
          live in the same database as your users, orders, and permissions — no separate vector DB to deploy.
        </p>
      </Definition>

      <LessonSection title="What changes in your existing Postgres table">
        <p className="text-slate-300">
          You add one column to a table you already have. Everything else stays normal SQL.
        </p>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div className="text-slate-400">Before pgvector</div>
          <div className="mt-2 text-slate-300">documents (id, text, source, created_at)</div>
          <div className="mt-4 text-slate-400">After pgvector</div>
          <div className="mt-2 text-slate-300">documents (id, text, source, created_at, <span className="text-white">embedding vector(1536)</span>)</div>
        </div>
        <p className="mt-4 text-slate-300">
          At query time, you run SQL that combines regular filters with vector similarity — all in one query:
        </p>
        <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-xs text-slate-300">
          SELECT text, source FROM documents<br />
          WHERE source = 'policy.pdf'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-- regular SQL filter<br />
          ORDER BY embedding &lt;=&gt; query_vector&nbsp;&nbsp;-- similarity (closest first)<br />
          LIMIT 5;
        </div>
        <p className="mt-4 text-slate-300">
          The <code className="font-mono text-sm">&lt;=&gt;</code> operator is cosine distance. Lower = more similar.
          This single query does what would take two systems elsewhere: filter by metadata AND rank by meaning.
        </p>
      </LessonSection>

      <LessonSection title="HNSW index — making pgvector fast">
        <p className="text-slate-300">
          Without an index, Postgres compares your query against every row (slow at scale). Add an HNSW index
          once and queries drop to milliseconds:
        </p>
        <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-xs text-slate-300">
          CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);
        </div>
        <p className="mt-4 text-slate-300">
          This is the same HNSW algorithm used by Pinecone and Qdrant — now running inside your Postgres instance.
          Handles millions of vectors comfortably.
        </p>
      </LessonSection>

      <LessonSection title="The killer feature — SQL joins with vectors">
        <p className="text-slate-300">
          Because vectors live in Postgres, you can join retrieval with relational data in one query. Example:
          return only chunks the current user has permission to see.
        </p>
        <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-xs text-slate-300">
          SELECT d.text FROM documents d<br />
          JOIN user_permissions p ON d.source = p.doc_source<br />
          WHERE p.user_id = 42<br />
          ORDER BY d.embedding &lt;=&gt; query_vector LIMIT 5;
        </div>
        <p className="mt-4 text-slate-300">
          With a separate vector DB, you would query vectors first, then check permissions in a second step.
          pgvector does both atomically.
        </p>
      </LessonSection>

      <LessonSection title="Weaviate vs pgvector — pick one">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Choose Weaviate when</th>
                <th className="px-4 py-3">Choose pgvector when</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['You need hybrid search (vector + keyword) built in', 'Your team already runs PostgreSQL'],
                ['You want auto-embedding modules (send text, not vectors)', 'RAG data lives next to user/order tables'],
                ['You want a dedicated vector DB with its own API', 'You want one database, one backup, one ops stack'],
                ['No existing Postgres infrastructure', 'You need SQL joins between vectors and relational data'],
              ].map(([weaviate, pgvector], i) => (
                <tr key={i} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-slate-400">{weaviate}</td>
                  <td className="px-4 py-3 text-slate-400">{pgvector}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Callout variant="insight">
        pgvector is the fastest path to production RAG for teams already on Postgres — add one column, one index,
        and you are done. Weaviate is the better choice when hybrid search or auto-embedding saves you significant
        engineering effort.
      </Callout>

      <KeyTakeaways
        items={[
          'Weaviate: hybrid search = vector similarity + BM25 keywords in one query. Alpha controls the blend.',
          'pgvector: add a vector column to Postgres. Filter and search by meaning in one SQL statement.',
          'pgvector shines when vectors must join with user permissions or relational data.',
          'Weaviate shines when you need built-in hybrid search without building it yourself.',
        ]}
      />
    </LessonArticle>
  )
}
