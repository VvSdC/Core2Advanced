import {
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function DenseVsSparseEmbeddings() {
  return (
    <LessonArticle>
      <LessonSection title="Dense embeddings">
        <p>
          <strong className="text-white">Dense embeddings</strong> map text to a vector where{' '}
          <em>every dimension</em> carries meaning — typically 384–3072 floats. Produced by neural models
          (BERT, sentence-transformers, OpenAI). They capture <strong className="text-white">semantic
          similarity</strong>: "refund" matches "money back" even without shared words.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>Best for: natural language questions, paraphrased queries, conceptual search.</li>
          <li>Stored in: vector databases (FAISS, Pinecone, Chroma).</li>
          <li>Weakness: may miss exact IDs, codes, or rare proper nouns.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Sparse embeddings">
        <p>
          <strong className="text-white">Sparse embeddings</strong> are high-dimensional but mostly zeros — only
          a few dimensions are non-zero per text. Classic examples: TF-IDF, BM25 vectors. Each dimension maps to
          a specific term.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>Best for: exact keyword matches, product SKUs, error codes, legal clause numbers.</li>
          <li>No neural model needed — fast and interpretable.</li>
          <li>Weakness: "car" and "automobile" are completely unrelated.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Side by side">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Query</th>
                <th className="px-4 py-3">Dense finds</th>
                <th className="px-4 py-3">Sparse finds</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['"How do I get a refund?"', '"money-back guarantee policy"', '"refund" (exact word match)'],
                ['"SKU-48291 specs"', 'Similar product descriptions', '"SKU-48291" (exact ID)'],
                ['"Section 4.2 liability"', 'Related legal passages', '"Section 4.2" (exact reference)'],
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
      </LessonSection>

      <LessonSection title="Learned sparse embeddings (SPLADE)">
        <p>
          Modern hybrids like <strong className="text-white">SPLADE</strong> learn sparse vectors that combine
          keyword precision with some semantic expansion. They bridge dense and sparse — worth knowing when you
          see them in retrieval benchmarks.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Dense = semantic similarity via neural vectors; sparse = exact keyword matching.',
          'Dense misses exact IDs; sparse misses paraphrases — use hybrid in production.',
          'SPLADE is a learned sparse middle ground.',
          'Covered in depth under Retrieval Strategies → Hybrid Search & RRF.',
        ]}
      />
    </LessonArticle>
  )
}
