import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function VectorDatabasesOverview() {
  return (
    <LessonArticle>
      <Definition term="Vector Database">
        <p>
          A <strong className="text-white">vector database</strong> stores text chunks as numbers (embeddings) and
          finds the chunks whose <em>meaning</em> is closest to your question — even when the exact words do not
          match. A regular database finds rows where a column <em>equals</em> a value; a vector database finds
          rows where meaning is <em>similar</em>.
        </p>
      </Definition>

      <LessonSection title="The one analogy that makes it click">
        <p className="text-slate-300">
          Imagine a library with 10,000 index cards. Each card has the chunk text, metadata (source file, page
          number), and a hidden list of 1,536 numbers (the embedding). When a user asks{' '}
          <em>"How do I get a refund?"</em>, you convert that question into the same kind of number list, then
          ask the database: <strong className="text-white">"Which 5 cards have numbers most similar to mine?"</strong>{' '}
          The database returns those cards — not because they contain the word "refund", but because their meaning
          is close.
        </p>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div className="text-slate-400">One stored record (simplified)</div>
          <div className="mt-2 text-slate-300">id: "chunk_42"</div>
          <div className="text-slate-300">text: "Returns are accepted within 30 days..."</div>
          <div className="text-slate-300">metadata: {'{ source: "policy.pdf", page: 4 }'}</div>
          <div className="text-slate-300">vector: [0.12, -0.34, 0.89, ... 1536 numbers total]</div>
        </div>
      </LessonSection>

      <LessonSection title="What happens on insert and query">
        <Flowchart
          title="Vector DB in the RAG pipeline"
          chart={`flowchart LR
  A[Chunk text + metadata] --> B[Embedding model]
  B --> C[(Vector DB stores all three)]
  D[User question] --> E[Same embedding model]
  E --> C
  C --> F[Top-k closest chunks]
  F --> G[Text sent to LLM]`}
        />
        <ContentStep number={1} title="Index time — you write data in">
          <p>
            You chunk a document, embed each chunk, and <strong className="text-white">upsert</strong> (insert or
            update) into the database. Each row stores three things together: the original text, metadata tags,
            and the embedding vector.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Query time — you search by meaning">
          <p>
            The user's question is embedded with the <em>same model</em>. The database compares that query vector
            against every stored vector and returns the top-k closest matches — ranked by cosine similarity score.
          </p>
        </ContentStep>
        <ContentStep number={3} title="You get text back, not just numbers">
          <p>
            The database returns the actual chunk text and metadata so you can paste them into the LLM prompt.
            You never show raw vectors to the user.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Exact search vs approximate search (ANN)">
        <p className="text-slate-300">
          To find similar vectors, the naive approach compares your query against <em>every</em> stored vector.
          That is <strong className="text-white">exact search</strong> — perfect accuracy, but slow at scale.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Approach</th>
                <th className="px-4 py-3">What it does</th>
                <th className="px-4 py-3">Speed at 1M vectors</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 font-semibold text-white">Exact (brute force)</td>
                <td className="px-4 py-3 text-slate-400">Compare query to all 1,000,000 vectors</td>
                <td className="px-4 py-3 text-slate-400">Seconds — too slow for real-time</td>
              </tr>
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 font-semibold text-white">ANN (approximate)</td>
                <td className="px-4 py-3 text-slate-400">Smart index skips most vectors; checks ~1,000 likely matches</td>
                <td className="px-4 py-3 text-slate-400">Milliseconds — ~99% as accurate</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-slate-300">
          <strong className="text-white">ANN</strong> (Approximate Nearest Neighbour) is how every production vector
          DB works. Algorithms like <strong className="text-white">HNSW</strong> build a graph of shortcuts through
          vector space — like a highway system instead of checking every side street. You trade a tiny bit of
          accuracy for 100× speed. At RAG scale (thousands to millions of chunks), ANN is the default.
        </p>
      </LessonSection>

      <LessonSection title="Metadata filtering — search inside a subset">
        <p className="text-slate-300">
          Sometimes you do not want to search <em>all</em> documents — only chunks from a specific file, date
          range, or user. <strong className="text-white">Metadata filtering</strong> applies regular filters{' '}
          <em>before</em> vector search.
        </p>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div className="text-slate-400">Without filter — searches everything</div>
          <div className="mt-2 text-slate-300">query: "refund policy" → returns chunks from HR, legal, marketing...</div>
          <div className="mt-4 text-slate-400">With filter — searches only matching rows</div>
          <div className="mt-2 text-slate-300">filter: source = "returns-policy.pdf"</div>
          <div className="text-slate-300">query: "refund policy" → returns only chunks from that one file</div>
        </div>
        <p className="mt-4 text-slate-300">
          This is critical in production: a SaaS app with 10,000 customers stores all vectors in one index but
          filters by <code className="font-mono text-sm">customer_id</code> so each user only sees their own data.
        </p>
      </LessonSection>

      <LessonSection title="Library vs database — why so many options exist">
        <p className="text-slate-300">
          Not every tool does the same job. The key distinction:
        </p>
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Search library (FAISS)</p>
            <p className="mt-1 text-sm text-slate-400">
              Only the math — "given these numbers, find the closest ones." You manage text storage, metadata,
              and persistence yourself. Like owning a fast calculator, not a filing cabinet.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Vector database (Chroma, Pinecone, Qdrant, etc.)</p>
            <p className="mt-1 text-sm text-slate-400">
              Stores text + vectors + metadata together. Handles persistence, filtering, and APIs. Like a complete
              filing system with a built-in similarity search engine.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Postgres extension (pgvector)</p>
            <p className="mt-1 text-sm text-slate-400">
              Adds a vector column to your existing SQL database. Vectors live next to user tables, orders, etc.
              One database for everything — no separate system to operate.
            </p>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="How to pick one (30-second decision)">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Your situation</th>
                <th className="px-4 py-3">Start with</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Just learning RAG on my laptop', 'FAISS or Chroma'],
                ['Building an MVP, want zero DevOps', 'Chroma (local) or Pinecone (cloud free tier)'],
                ['Production app, team already uses Postgres', 'pgvector'],
                ['Production app, need managed cloud, no servers', 'Pinecone or Qdrant Cloud'],
                ['Need keyword + meaning search combined', 'Weaviate (hybrid search)'],
                ['Billions of vectors, enterprise scale', 'Milvus or Pinecone pods'],
              ].map(([situation, pick]) => (
                <tr key={situation} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-slate-400">{situation}</td>
                  <td className="px-4 py-3 font-semibold text-white">{pick}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Callout variant="insight">
        You do not need to master every vector DB. Learn the concepts here (store vectors, search by similarity,
        filter by metadata), pick one tool for your stage, and move on. The next lessons explain each option in
        plain terms.
      </Callout>

      <KeyTakeaways
        items={[
          'Vector DB finds chunks by meaning similarity — not exact word match.',
          'Each record = text + metadata + embedding vector. Query embeds the question, returns top-k closest.',
          'ANN (HNSW) makes search fast at scale — checks likely matches, not every vector.',
          'Metadata filtering narrows search to a subset (file, customer, date) before similarity ranking.',
          'FAISS = math library only. Chroma/Pinecone/Qdrant = full databases. pgvector = vectors inside Postgres.',
        ]}
      />
    </LessonArticle>
  )
}
