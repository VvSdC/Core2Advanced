import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function Bm25KeywordSearch() {
  return (
    <LessonArticle>
      <Definition term="BM25 keyword search">
        <p>
          <strong className="text-white">BM25</strong> (Best Matching 25) is the gold standard for traditional
          text search. It ranks documents by how well their <em>words</em> match the query words — no neural
          network, no embeddings, just smart counting.
        </p>
        <p>
          Think of it as <strong className="text-white">Ctrl+F on steroids</strong>. Regular Ctrl+F finds exact
          string matches. BM25 goes further: it understands that seeing "refund" three times in a short paragraph
          matters more than seeing it once in a 50-page document, and that rare words like "SKU-48291" are more
          important than common words like "the."
        </p>
      </Definition>

      <LessonSection title="How BM25 scores documents — three ingredients">
        <ContentStep number={1} title="Term frequency (TF) — how often does the word appear?">
          <p>
            If your query is "refund policy" and a chunk mentions "refund" five times, it scores higher than a
            chunk that mentions it once. More occurrences of a query word → higher score. But BM25 does not count
            linearly — the 10th occurrence matters less than the 1st (diminishing returns).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Inverse document frequency (IDF) — how rare is the word?">
          <p>
            Rare words are strong signals. The word "the" appears in every document — it tells you nothing.
            But "SKU-48291" appears in only one document — a perfect match. IDF gives rare words a much higher
            weight than common ones.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Length normalisation — penalise long documents">
          <p>
            A 50-page manual that mentions "refund" once is less relevant than a 3-sentence policy that mentions
            "refund" three times. BM25 penalises very long documents that accumulate incidental word matches by
            accident.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Concrete example — searching by product ID">
        <p className="text-slate-300">
          A user knows the exact product they need help with. Dense retrieval might struggle because product IDs
          are meaningless to embedding models. BM25 shines here:
        </p>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div className="text-slate-400">Query: "SKU-48291 specifications"</div>
          <div className="mt-3 space-y-1">
            <div>
              Chunk 1 — "SKU-48291 specs and dimensions: 12×8×3 cm, weight 450g…" →{' '}
              <span className="text-genai-400">BM25: 8.7 ✓</span>
            </div>
            <div>Chunk 2 — "General product specifications guide for all models…" → BM25: 2.1</div>
            <div>Chunk 3 — "Similar product overview and comparison chart…" → BM25: 0.4</div>
          </div>
          <div className="mt-3 text-genai-400">
            Exact ID match wins decisively — dense search might rank chunk 2 higher because "specifications" is
            semantically close.
          </div>
        </div>
        <Callout variant="insight">
          BM25 is not "dumber" than dense retrieval — it is <em>specialised</em>. It excels at the exact-match
          tasks that dense retrieval handles poorly. That is why production systems use both.
        </Callout>
      </LessonSection>

      <LessonSection title="Where BM25 fails — the paraphrase problem">
        <p className="text-slate-300">
          Keyword search only works when the query and document share words. Rephrase the question and BM25
          returns nothing:
        </p>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div className="text-slate-400">Document chunk:</div>
          <div className="mt-1">"Customers may request a full refund within 30 days."</div>
          <div className="mt-3 text-slate-400">Query: "How do I get my money back?"</div>
          <div className="mt-1 text-red-400">BM25 score: 0.0 — no shared keywords, no match.</div>
          <div className="mt-3 text-slate-400">Same query with dense retrieval:</div>
          <div className="mt-1 text-genai-400">Cosine similarity: 0.91 — semantic match found.</div>
        </div>
        <p className="mt-4 text-slate-300">
          This is the fundamental trade-off: BM25 is precise with exact words but blind to meaning. Dense
          retrieval understands meaning but misses exact identifiers.
        </p>
      </LessonSection>

      <LessonSection title="Keyword search variants you'll encounter">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Plain-language explanation</th>
                <th className="px-4 py-3">When to use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'BM25',
                  'Smart word counting with rarity weighting and length correction — the best general keyword search',
                  'Default keyword method for RAG',
                ],
                [
                  'TF-IDF',
                  'Simpler version: word frequency × word rarity. BM25 is the improved successor',
                  'Legacy systems; prefer BM25 for new projects',
                ],
                [
                  'Exact match',
                  'Literal string search — finds "SKU-48291" and nothing else',
                  'Known identifiers, error codes, legal citations',
                ],
                [
                  'Elasticsearch / OpenSearch',
                  'Production search engines with BM25 built in, plus filtering, highlighting, and scaling',
                  'Large-scale keyword search infrastructure',
                ],
              ].map(([method, explanation, when]) => (
                <tr key={method} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{method}</td>
                  <td className="px-4 py-3 text-slate-400">{explanation}</td>
                  <td className="px-4 py-3 text-slate-400">{when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="When to add BM25 to your RAG pipeline">
        <Callout variant="beginner" title="You need BM25 when...">
          Your test questions include product IDs, error codes, legal section numbers, person names, or any
          query where the exact string matters more than the meaning. If dense retrieval alone misses these,
          add BM25 alongside it — that is hybrid search, covered in the next lesson.
        </Callout>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Use case</th>
                <th className="px-4 py-3">Why BM25 wins</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Product catalog search', 'Users search by SKU, model number, or part code'],
                ['Error code lookup', '"Error E-4521" must match the exact code in docs'],
                ['Legal / compliance', 'Section numbers like "42 CFR 482.13" need exact matching'],
                ['API documentation', 'Function names like getUserById() are identifiers, not concepts'],
              ].map(([useCase, why]) => (
                <tr key={useCase} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{useCase}</td>
                  <td className="px-4 py-3 text-slate-400">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'BM25 is Ctrl+F on steroids — smart keyword matching with rarity weighting and length correction.',
          'Excels at exact IDs, codes, names, and legal references that dense retrieval misses.',
          'Cannot match paraphrases — "money back" will not find "refund policy."',
          'Use alongside dense retrieval in hybrid search for the best of both worlds.',
        ]}
      />
    </LessonArticle>
  )
}
