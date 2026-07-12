import {
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function AdvancedRetrievalStrategies() {
  return (
    <LessonArticle>
      <LessonSection title="HyDE — Hypothetical Document Embeddings">
        <p>
          Instead of embedding the raw question, the LLM first <strong className="text-white">generates a
          hypothetical answer</strong>, then embeds that. The hypothetical answer looks more like a stored
          document — improving retrieval match.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Query: "What is the refund policy?"</div>
          <div className="mt-2 text-slate-400">LLM generates hypothetical:</div>
          <div>"Customers may request a full refund within 30 days of purchase by contacting support..."</div>
          <div className="mt-2 text-genai-400">Embed the hypothetical → better match to actual policy chunks.</div>
        </div>
      </LessonSection>

      <LessonSection title="Multi-query retrieval">
        <p>
          The LLM generates <strong className="text-white">multiple search queries</strong> from one user question,
          retrieves for each, and deduplicates. Captures different phrasings and angles.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>User: "Can I return a broken item?"</div>
          <div className="mt-2">Query 1: "defective product return policy"</div>
          <div>Query 2: "warranty claim broken item"</div>
          <div>Query 3: "refund damaged goods procedure"</div>
        </div>
      </LessonSection>

      <LessonSection title="Parent-document retrieval">
        <p>
          Index <strong className="text-white">small chunks</strong> for precise retrieval, but return the{' '}
          <strong className="text-white">parent document</strong> (or larger window) to the LLM. Small chunks
          find the right spot; parent context gives the model enough surrounding information.
        </p>
      </LessonSection>

      <LessonSection title="Query decomposition">
        <p>
          For complex multi-part questions, an LLM splits the query into sub-questions, retrieves for each
          independently, and merges results. Essential for multi-hop reasoning ("Who managed the team that built
          product X?").
        </p>
      </LessonSection>

      <LessonSection title="When to use advanced strategies">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Strategy</th>
                <th className="px-4 py-3">Use when</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['HyDE', 'Queries are short/vague; chunks are long-form prose'],
                ['Multi-query', 'Users phrase questions very differently from document text'],
                ['Parent-document', 'Small chunks retrieve well but lack context for answers'],
                ['Query decomposition', 'Multi-hop or compound questions'],
              ].map(([strategy, when]) => (
                <tr key={strategy} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{strategy}</td>
                  <td className="px-4 py-3 text-slate-400">{when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'HyDE embeds a hypothetical answer instead of the raw query.',
          'Multi-query generates several search queries per question for broader recall.',
          'Parent-document retrieval: small chunks find, large context answers.',
          'Use advanced strategies only after basic dense/hybrid retrieval is tuned.',
        ]}
      />
    </LessonArticle>
  )
}
