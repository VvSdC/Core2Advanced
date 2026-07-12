import {
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function OpenSourceEmbeddings() {
  return (
    <LessonArticle>
      <LessonSection title="sentence-transformers ecosystem">
        <p>
          The <strong className="text-white">sentence-transformers</strong> library (Hugging Face) is the standard
          way to run open-source embeddings locally. One line loads a model; you embed on CPU or GPU with no API
          costs.
        </p>
      </LessonSection>

      <LessonSection title="Top open-source models">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Dims</th>
                <th className="px-4 py-3">Strength</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['BGE-large-en-v1.5', '1024', 'Best English retrieval; Beijing Academy'],
                ['E5-large-v2', '1024', 'Microsoft; prefix "query:" / "passage:" for asymmetric search'],
                ['all-MiniLM-L6-v2', '384', 'Tiny and fast; good for prototyping'],
                ['multilingual-e5-large', '1024', '100 languages; strong cross-lingual retrieval'],
                ['nomic-embed-text-v1.5', '768', 'Long context (8192 tokens); open weights'],
              ].map(([model, dims, strength]) => (
                <tr key={model} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-xs text-genai-400">{model}</td>
                  <td className="px-4 py-3 text-slate-400">{dims}</td>
                  <td className="px-4 py-3 text-slate-400">{strength}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="E5 prefix convention">
        <p>
          E5 models expect prefixed input for best results:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Index time:  "passage: Refunds are available within 30 days..."</div>
          <div>Query time:  "query: What is the refund policy?"</div>
        </div>
        <p className="mt-3">
          This asymmetric encoding tells the model whether text is a stored document or a search query — improving
          retrieval accuracy. Cohere's commercial models do the same via input_type parameters.
        </p>
      </LessonSection>

      <LessonSection title="Running locally — trade-offs">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Pros</strong> — no API cost, data stays on your machine, no rate limits.</li>
          <li><strong className="text-white">Cons</strong> — need GPU for speed at scale, model updates are manual, ops overhead.</li>
          <li><strong className="text-white">Sweet spot</strong> — BGE or E5 on a single GPU handles millions of chunks for mid-size deployments.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'BGE and E5 are the top open-source choices for English RAG retrieval.',
          'E5 uses query:/passage: prefixes for asymmetric search — match at index and query time.',
          'all-MiniLM-L6-v2 for fast prototyping; BGE-large for production quality.',
          'Open-source = privacy and cost savings; commercial = convenience and latest benchmarks.',
        ]}
      />
    </LessonArticle>
  )
}
