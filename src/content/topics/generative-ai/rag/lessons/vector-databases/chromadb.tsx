import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function ChromaDb() {
  return (
    <LessonArticle>
      <Definition term="ChromaDB">
        <p>
          <strong className="text-white">Chroma</strong> is a vector database that stores everything in one place:
          chunk text, embedding vectors, and metadata. Unlike FAISS, you do not maintain a separate text lookup —
          query results come back with the actual document text ready to paste into your LLM prompt.
        </p>
      </Definition>

      <LessonSection title="Core concepts in plain terms">
        <div className="space-y-3">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Collection = a named folder of documents</p>
            <p className="mt-1 text-sm text-slate-400">
              Like a table in SQL. You might have a collection called <code className="font-mono text-sm">"company_docs"</code>{' '}
              holding all your handbook chunks, and another called <code className="font-mono text-sm">"support_tickets"</code>{' '}
              for customer data.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Document = one chunk with text + metadata</p>
            <p className="mt-1 text-sm text-slate-400">
              Each document has an id, the chunk text, optional metadata tags, and an embedding (Chroma can embed
              for you or you pass your own vectors).
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Query = search by meaning inside a collection</p>
            <p className="mt-1 text-sm text-slate-400">
              Pass a question text (or a vector). Chroma returns the top-k most similar documents with their text,
              metadata, and similarity distances.
            </p>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="Walkthrough — add 3 chunks, search once">
        <ContentStep number={1} title="Create a collection">
          <p>
            <code className="font-mono text-sm">client.create_collection("policies")</code> — an empty folder ready
            for documents.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Add documents">
          <p>
            Pass ids, texts, and metadata. Chroma embeds the text automatically (or you supply pre-computed vectors).
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-3 font-mono text-xs text-slate-300">
            <div>doc 1: "Returns accepted within 30 days of purchase" → metadata: {'{ source: "returns.pdf" }'}</div>
            <div>doc 2: "Free shipping on orders over $50" → metadata: {'{ source: "shipping.pdf" }'}</div>
            <div>doc 3: "Password reset via email link" → metadata: {'{ source: "account.pdf" }'}</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Query">
          <p>
            <code className="font-mono text-sm">collection.query(query_texts=["How do I return an item?"], n_results=1)</code>
          </p>
          <p className="mt-2 text-slate-400">
            Chroma embeds your question, finds the closest stored vector, and returns doc 1 with its full text —
            even though your question said "return" and the chunk said "Returns accepted".
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Four modes — pick your level">
        <div className="space-y-4">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">In-memory — data disappears when Python exits</p>
            <p className="mt-2 text-sm text-slate-400">Zero setup. Perfect for Jupyter notebooks and quick experiments. Nothing saved to disk.</p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Persistent — data saved to a folder on disk</p>
            <p className="mt-2 text-sm text-slate-400">
              Point Chroma at a directory (e.g. <code className="font-mono text-sm">./chroma_db</code>). Collections
              survive restarts. Your go-to for local development.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Metadata filtering — search inside a subset</p>
            <p className="mt-2 text-sm text-slate-400">
              Add <code className="font-mono text-sm">where={'{"source": "returns.pdf"}'}</code> to your query.
              Chroma only compares vectors from documents matching that filter — then ranks by similarity.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Server mode — shared database over HTTP</p>
            <p className="mt-2 text-sm text-slate-400">
              Run Chroma in Docker. Multiple apps connect via API. Suitable for small-team deployments where
              everyone shares one vector store.
            </p>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="Chroma vs FAISS — the upgrade path">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">FAISS</th>
                <th className="px-4 py-3">Chroma</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Stores vectors only — you manage text separately', 'Stores text + vectors + metadata together'],
                ['No built-in persistence', 'Persistent mode saves to disk automatically'],
                ['No metadata filtering', 'where={...} filters before similarity search'],
                ['Library embedded in your code', 'Can run as a standalone server'],
              ].map(([faiss, chroma], i) => (
                <tr key={i} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-slate-400">{faiss}</td>
                  <td className="px-4 py-3 text-slate-400">{chroma}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Callout variant="insight">
        Chroma is the most common "first real vector DB" in RAG tutorials because it handles everything FAISS
        leaves out — and LangChain integrates with it natively. Start here when your prototype needs to survive
        a restart or filter by document source.
      </Callout>

      <KeyTakeaways
        items={[
          'Collection = named folder. Document = chunk + metadata + vector. Query = search by meaning.',
          'Chroma stores text and vectors together — query results include the actual chunk text.',
          'Progression: in-memory (notebooks) → persistent (local dev) → filtered search → server (team sharing).',
          'Natural upgrade from FAISS when you need persistence, filtering, or less manual plumbing.',
        ]}
      />
    </LessonArticle>
  )
}
