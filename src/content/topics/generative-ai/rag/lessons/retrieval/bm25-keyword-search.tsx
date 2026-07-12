import {
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function Bm25KeywordSearch() {
  return (
    <LessonArticle>
      <LessonSection title="What is BM25?">
        <p>
          <strong className="text-white">BM25</strong> (Best Matching 25) is a ranking function that scores
          documents by <strong className="text-white">keyword frequency</strong> with length normalisation. It is
          the gold standard for traditional text search — no neural model required.
        </p>
      </LessonSection>

      <LessonSection title="How BM25 scores">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Term frequency (TF)</strong> — more occurrences of a query word → higher score.</li>
          <li><strong className="text-white">Inverse document frequency (IDF)</strong> — rare words weigh more than common words ("the" vs "SKU-48291").</li>
          <li><strong className="text-white">Length normalisation</strong> — penalises very long documents that accumulate incidental term matches.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Example">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div className="text-slate-400">Query: "SKU-48291 specifications"</div>
          <div className="mt-3 space-y-1">
            <div>Chunk with "SKU-48291 specs and dimensions" → BM25: 8.7 ✓</div>
            <div>Chunk with "product specifications guide" → BM25: 2.1</div>
            <div>Chunk with "similar product overview" → BM25: 0.4</div>
          </div>
          <div className="mt-3 text-genai-400">Exact ID match wins — dense search might miss this.</div>
        </div>
      </LessonSection>

      <LessonSection title="Keyword search variants">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">How it works</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['BM25', 'Probabilistic TF-IDF with length normalisation — best general keyword search'],
                ['TF-IDF', 'Simpler frequency × rarity; BM25 is the improved version'],
                ['Exact match', 'Literal string search — fastest for known identifiers'],
                ['Elasticsearch / OpenSearch', 'Production keyword engines with BM25 built in'],
              ].map(([method, how]) => (
                <tr key={method} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{method}</td>
                  <td className="px-4 py-3 text-slate-400">{how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'BM25 ranks by keyword frequency with IDF weighting and length normalisation.',
          'Excels at exact IDs, codes, names, and legal references.',
          'Cannot match paraphrases — "refund" will not find "money back".',
          'Use alongside dense retrieval in hybrid search for best coverage.',
        ]}
      />
    </LessonArticle>
  )
}
