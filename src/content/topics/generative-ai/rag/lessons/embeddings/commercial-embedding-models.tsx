import {
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function CommercialEmbeddingModels() {
  return (
    <LessonArticle>
      <LessonSection title="OpenAI embeddings">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Dimensions</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['text-embedding-3-small', '1536 (reducible)', 'Best cost/performance default for most RAG'],
                ['text-embedding-3-large', '3072 (reducible)', 'Highest quality; more storage cost'],
                ['text-embedding-ada-002', '1536', 'Legacy — migrate to v3'],
              ].map(([model, dims, notes]) => (
                <tr key={model} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-xs text-genai-400">{model}</td>
                  <td className="px-4 py-3 text-slate-400">{dims}</td>
                  <td className="px-4 py-3 text-slate-400">{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3">
          v3 models support <strong className="text-white">dimension reduction</strong> — embed at 1536 but store
          at 512 with minimal quality loss, saving vector DB storage.
        </p>
      </LessonSection>

      <LessonSection title="Cohere Embed">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">embed-english-v3.0</strong> — strong English retrieval; supports input types (search_document vs search_query).</li>
          <li><strong className="text-white">embed-multilingual-v3.0</strong> — 100+ languages; good for global knowledge bases.</li>
          <li>Separate query/document embedding modes improve asymmetric retrieval (question ≠ passage style).</li>
        </ul>
      </LessonSection>

      <LessonSection title="Voyage AI & Google">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Voyage-3</strong> — top MTEB benchmark scores; popular for high-stakes RAG.</li>
          <li><strong className="text-white">text-embedding-004</strong> (Google) — strong multilingual; integrates with Vertex AI.</li>
          <li><strong className="text-white">Amazon Titan Embeddings</strong> — AWS-native option for Bedrock pipelines.</li>
        </ul>
      </LessonSection>

      <LessonSection title="When to use commercial APIs">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Use commercial when</th>
                <th className="px-4 py-3">Use open-source when</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 text-slate-400">Fast setup, no GPU ops, strong out-of-box quality</td>
                <td className="px-4 py-3 text-slate-400">Data privacy, offline/air-gapped, high volume cost savings</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'OpenAI text-embedding-3-small is the default starting point for most RAG.',
          'Cohere offers asymmetric query/document modes and strong multilingual support.',
          'Voyage and Google lead benchmarks for highest retrieval quality.',
          'Commercial APIs charge per token — open-source may be cheaper at scale.',
        ]}
      />
    </LessonArticle>
  )
}
