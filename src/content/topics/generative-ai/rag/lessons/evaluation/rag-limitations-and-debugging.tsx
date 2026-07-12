import {
  Callout,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function RagLimitationsAndDebugging() {
  return (
    <LessonArticle>
      <LessonSection title="When RAG fails">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Multi-hop reasoning</strong> — answer requires connecting facts across distant chunks.</li>
          <li><strong className="text-white">Full-corpus summarisation</strong> — "Summarise all complaints this year" needs aggregation, not retrieval.</li>
          <li><strong className="text-white">Contradictory documents</strong> — two chunks say different things; model blends or picks arbitrarily.</li>
          <li><strong className="text-white">Stale index</strong> — documents updated but vector store not re-indexed.</li>
          <li><strong className="text-white">Tabular data</strong> — embeddings poorly capture numbers in tables; SQL may be better.</li>
          <li><strong className="text-white">Very large single documents</strong> — answer spread across 100 pages with no clear chunk boundary.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Debugging checklist">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Symptom</th>
                <th className="px-4 py-3">Check first</th>
                <th className="px-4 py-3">Then try</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Wrong or missing answers', 'Is correct chunk in top-k?', 'Tune chunk size → hybrid search → reranker'],
                ['Retrieves wrong domain', 'Metadata on chunks?', 'Add metadata filters'],
                ['Exact IDs not found', 'BM25 in pipeline?', 'Add hybrid search + RRF'],
                ['Good retrieval, bad answers', 'Temperature and prompt?', 'Lower T; strengthen grounding instruction'],
                ['Slow responses', 'Measure retrieve vs generate latency', 'ANN index; reduce k; cache frequent queries'],
              ].map(([symptom, check, try_]) => (
                <tr key={symptom} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-slate-400">{symptom}</td>
                  <td className="px-4 py-3 font-semibold text-white">{check}</td>
                  <td className="px-4 py-3 text-slate-400">{try_}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Tuning order">
        <ol className="list-decimal space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Chunking</strong> — size, overlap, strategy.</li>
          <li><strong className="text-white">Embeddings</strong> — model choice, query/passage prefixes.</li>
          <li><strong className="text-white">Retrieval</strong> — dense → hybrid → reranking.</li>
          <li><strong className="text-white">Prompt & generation</strong> — grounding instructions, temperature.</li>
        </ol>
      </LessonSection>

      <Callout variant="beginner" title="Next up — LangChain">
        You now understand RAG end to end. The <em>LangChain</em> sub-topic implements this pipeline in Python.
      </Callout>

      <KeyTakeaways
        items={[
          'RAG fails on multi-hop reasoning, summarisation, contradictions, and stale indexes.',
          'Debug in order: chunking → embeddings → retrieval → generation.',
          'Always check if the correct chunk is in top-k before blaming the LLM.',
        ]}
      />
    </LessonArticle>
  )
}
