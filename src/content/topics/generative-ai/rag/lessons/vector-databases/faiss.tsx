import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function FaissVectorDb() {
  return (
    <LessonArticle>
      <Definition term="FAISS">
        <p>
          <strong className="text-white">FAISS</strong> (Facebook AI Similarity Search) is a{' '}
          <em>similarity search engine</em> — it takes two lists of number-vectors and finds which ones are closest.
          It is <strong className="text-white">not a database</strong>: it does not store your text, does not
          remember data between restarts, and has no API for filtering by metadata.
        </p>
      </Definition>

      <LessonSection title="What FAISS actually does (concrete)">
        <p className="text-slate-300">
          You give FAISS a matrix of vectors and a query vector. It returns row indices ranked by similarity.
          <em> You</em> keep a separate Python dict mapping those indices back to chunk text.
        </p>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div className="text-slate-400">Mental model</div>
          <div className="mt-2 text-slate-300">faiss_index → [vector_0, vector_1, vector_2, ...]  ← just numbers</div>
          <div className="text-slate-300">your_dict → {'{ 0: "Returns accepted...", 1: "Shipping takes..." }'}  ← you manage this</div>
          <div className="mt-2 text-slate-300">query → faiss returns [1, 0] → you look up text from your_dict</div>
        </div>
        <ContentStep number={1} title="Build the index">
          <p>Embed all chunks, stack vectors into a numpy array, pass to FAISS.</p>
        </ContentStep>
        <ContentStep number={2} title="Search">
          <p>Embed the query, call <code className="font-mono text-sm">index.search(query_vector, k=5)</code>, get back indices and distances.</p>
        </ContentStep>
        <ContentStep number={3} title="Map indices to text">
          <p>Use your own lookup table to convert index 42 → the actual chunk text. FAISS does not do this step.</p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Four index types — from simple to fast">
        <p className="mb-4 text-slate-300">
          FAISS offers different search strategies. Think of them as increasing levels of organisation:
        </p>
        <div className="space-y-4">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Flat — check every vector (exact)</p>
            <p className="mt-2 text-sm text-slate-400">
              Compares query against all stored vectors. 100% accurate. Fine for &lt;100k vectors or benchmarking
              "what is the true best answer?" Use this to validate your RAG quality before switching to faster indexes.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">IVF — search only nearby clusters</p>
            <p className="mt-2 text-sm text-slate-400">
              Vectors are grouped into clusters at build time. At query time, FAISS finds the nearest clusters and
              only searches inside them — like checking 3 aisles in a warehouse instead of all 50. Good for 100k–10M vectors.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">HNSW — shortcut graph (most common)</p>
            <p className="mt-2 text-sm text-slate-400">
              Vectors are nodes in a graph with long-range shortcuts. Search hops along edges toward the nearest
              neighbours — like GPS navigation instead of checking every intersection. Fastest queries, ~99% recall.
              This is what most production FAISS setups use.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">PQ — compress vectors to save RAM</p>
            <p className="mt-2 text-sm text-slate-400">
              Each 1536-dimension vector is compressed to a smaller representation. Uses 4–8× less memory with a
              small accuracy trade-off. Essential when you have billions of vectors and RAM is the bottleneck.
              Often combined with HNSW.
            </p>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="What FAISS cannot do">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">No text storage</strong> — you keep chunk text in a separate dict or file.</li>
          <li><strong className="text-white">No metadata filtering</strong> — cannot say "search only policy.pdf". You filter after search or maintain separate indexes per source.</li>
          <li><strong className="text-white">No persistence by default</strong> — index lives in RAM. Save to disk manually with <code className="font-mono text-sm">faiss.write_index</code> or use LangChain's <code className="font-mono text-sm">save_local</code>.</li>
          <li><strong className="text-white">No multi-user API</strong> — runs inside your Python process, not as a shared server.</li>
        </ul>
      </LessonSection>

      <LessonSection title="When FAISS is the right choice">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Use FAISS when</th>
                <th className="px-4 py-3">Move on when</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 text-slate-400">Prototyping RAG on your laptop; benchmarking retrieval quality; single-user app embedded in one process</td>
                <td className="px-4 py-3 text-slate-400">You need metadata filters, a REST API, multi-tenant isolation, or managed cloud scaling → use Chroma, Pinecone, or pgvector</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Callout variant="tip">
        LangChain wraps FAISS so you do not manage the index-to-text mapping manually. It handles{' '}
        <code className="font-mono text-sm">save_local</code> / <code className="font-mono text-sm">load_local</code>{' '}
        for persistence between runs — the easiest way to test RAG locally before picking a real database.
      </Callout>

      <KeyTakeaways
        items={[
          'FAISS = fast similarity math only. You store text and metadata separately.',
          'Flat (exact) → IVF (clusters) → HNSW (graph shortcuts) → PQ (compression). HNSW is the production default.',
          'Best for prototyping and single-machine apps. Graduate to Chroma or Pinecone when you need filtering, persistence, or APIs.',
        ]}
      />
    </LessonArticle>
  )
}
