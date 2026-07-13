import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function DenseVsSparseEmbeddings() {
  return (
    <LessonArticle>
      <Definition term="Two ways to search text">
        <p>
          When you search a knowledge base, you can match on <strong className="text-white">meaning</strong> or on{' '}
          <strong className="text-white">exact words</strong>. Embeddings come in two flavours that mirror this split:
          <strong className="text-white"> dense</strong> (meaning-based) and <strong className="text-white">sparse</strong>{' '}
          (word-based). Most production RAG systems use both.
        </p>
      </Definition>

      <LessonSection title="Dense embeddings — searching by meaning">
        <p>
          <strong className="text-white">Dense embeddings</strong> are the GPS-coordinate vectors you learned about in
          the previous lesson. A neural model reads your text and produces a list of 384–3,072 numbers where{' '}
          <em>every number carries some meaning</em>. None of them are zero.
        </p>
        <p className="mt-3">
          Dense search is like asking a librarian: <em>"I'm looking for something about getting my money back"</em> —
          and they hand you the refund policy, even though you never said the word "refund."
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Best for:</strong> natural language questions, paraphrased queries,
            conceptual search ("how do I cancel my subscription?" matches "cancellation procedure").
          </li>
          <li>
            <strong className="text-white">Stored in:</strong> vector databases (FAISS, Pinecone, Chroma, Qdrant).
          </li>
          <li>
            <strong className="text-white">Weakness:</strong> may miss exact IDs, product codes, error numbers, or rare
            proper nouns — because it cares about meaning, not spelling.
          </li>
        </ul>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div className="text-slate-400">Dense vector (simplified — 6 of 1,536 dims shown)</div>
          <div className="mt-2">"refund policy" → [0.12, -0.08, 0.31, 0.05, -0.22, 0.17]</div>
          <div className="text-slate-400 mt-2">Every dimension has a value — the vector is "dense"</div>
        </div>
      </LessonSection>

      <LessonSection title="Sparse embeddings — searching by exact words">
        <p>
          <strong className="text-white">Sparse embeddings</strong> flip the approach. Instead of capturing meaning,
          they record <em>which specific words appear</em> in the text. The vector is huge (tens of thousands of
          dimensions) but almost entirely zeros — only a handful of positions light up, one per word.
        </p>
        <p className="mt-3">
          Sparse search is like using Ctrl+F in a document: <em>"Find every page that contains the exact text
          SKU-48291."</em> It will not find a page that says "product number forty-eight thousand two hundred
          ninety-one" — different words, even if they mean the same thing.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Best for:</strong> exact keyword matches, product SKUs, error codes, legal
            clause numbers, API endpoint names.
          </li>
          <li>
            <strong className="text-white">No neural model needed</strong> — algorithms like TF-IDF and BM25 compute
            these vectors with simple math. Fast, free, and easy to debug.
          </li>
          <li>
            <strong className="text-white">Weakness:</strong> "car" and "automobile" are completely unrelated. No
            understanding of synonyms, paraphrases, or context.
          </li>
        </ul>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div className="text-slate-400">Sparse vector (simplified — 10 of 50,000 dims shown)</div>
          <div className="mt-2">"refund policy" → [0, 0, 0.8, 0, 0, 0, 0.6, 0, 0, 0]</div>
          <div className="text-slate-400 mt-2">Only "refund" and "policy" positions are non-zero — the vector is "sparse"</div>
        </div>
      </LessonSection>

      <LessonSection title="Meaning vs exact words — side by side">
        <p className="mb-4 text-slate-300">
          The same query can produce very different results depending on which approach you use. Here is what each
          method finds for three common search scenarios:
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">User asks</th>
                <th className="px-4 py-3">Dense finds (meaning)</th>
                <th className="px-4 py-3">Sparse finds (exact words)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  '"How do I get a refund?"',
                  '"money-back guarantee policy" — matched by meaning, no shared words',
                  '"refund" — matched because the exact word appears',
                ],
                [
                  '"SKU-48291 specs"',
                  'Similar product descriptions — missed the exact ID',
                  '"SKU-48291" — matched the exact product code',
                ],
                [
                  '"Section 4.2 liability"',
                  'Related legal passages about liability — approximate',
                  '"Section 4.2" — matched the exact clause reference',
                ],
              ].map(([query, dense, sparse]) => (
                <tr key={query} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-xs text-genai-400">{query}</td>
                  <td className="px-4 py-3 text-slate-400">{dense}</td>
                  <td className="px-4 py-3 text-slate-400">{sparse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Neither approach is "better" — they solve different problems. Dense is your smart librarian; sparse is your
          Ctrl+F. Real-world documents contain both prose <em>and</em> identifiers, so production RAG systems almost
          always combine both.
        </Callout>
      </LessonSection>

      <LessonSection title="Learned sparse — the best of both worlds (SPLADE)">
        <p>
          What if you could search by exact words <em>and</em> get some semantic expansion? That is what{' '}
          <strong className="text-white">SPLADE</strong> does. It is a neural model that produces sparse vectors —
          mostly zeros, like BM25 — but the non-zero positions are <em>learned</em>, not just raw word counts.
        </p>
        <p className="mt-3">
          SPLADE might see "refund" and also activate dimensions for "return" and "money-back" — adding a touch of
          meaning awareness to keyword search. Think of it as a librarian who still looks up exact terms, but also
          checks a thesaurus. You will see SPLADE mentioned in retrieval benchmarks and hybrid search discussions.
        </p>
      </LessonSection>

      <LessonSection title="Which should you use?">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Dense only</strong> — fine for pure Q&A over prose (help docs, wikis,
            articles). Start here.
          </li>
          <li>
            <strong className="text-white">Sparse only (BM25)</strong> — fine when users search exact codes, IDs, or
            legal references. Rare as a standalone choice in modern RAG.
          </li>
          <li>
            <strong className="text-white">Hybrid (dense + sparse)</strong> — the production default. Run both
            searches, then merge results with a technique called Reciprocal Rank Fusion (RRF). Covered in depth under
            Retrieval Strategies → Hybrid Search &amp; RRF.
          </li>
        </ul>
        <Callout variant="tip">
          A simple rule of thumb: if your documents contain product codes, error numbers, or section references
          alongside regular prose, use hybrid search from day one.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Dense = search by meaning (neural vectors); sparse = search by exact words (mostly zeros).',
          'Dense misses exact IDs and codes; sparse misses paraphrases and synonyms.',
          'Production RAG typically uses hybrid search — both methods combined via RRF.',
          'SPLADE is a learned sparse middle ground that adds some semantic expansion to keyword search.',
        ]}
      />
    </LessonArticle>
  )
}
