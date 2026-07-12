import {
  ContentStep,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function AugmentationAndGeneration() {
  return (
    <LessonArticle>
      <LessonSection title="Building the augmented prompt">
        <p>
          Retrieved chunks are structured into a prompt — not dumped raw. A well-designed template sets rules,
          separates evidence from the question, and tells the model how to behave when context is insufficient.
        </p>
        <Flowchart
          title="Prompt structure for RAG"
          chart={`flowchart TB
  A[System: grounding rules] --> B[Context: retrieved chunks + metadata]
  B --> C[User question]
  C --> D[LLM generates answer]`}
        />
      </LessonSection>

      <LessonSection title="Prompt template anatomy">
        <ContentStep number={1} title="System instruction">
          <p>
            Sets behaviour: cite sources, refuse to guess, use a specific tone. Same pattern as{' '}
            <em>System & Role Prompting</em> in Prompt Engineering.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Context block">
          <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm text-slate-300">
            <div className="text-xs font-medium text-slate-400">Example context block</div>
            <div className="mt-2 space-y-2 font-mono text-slate-200">
              <div>[Source: handbook.pdf, p.12]</div>
              <div>Refunds are available within 30 days of purchase...</div>
              <div className="text-surface-600">---</div>
              <div>[Source: handbook.pdf, p.14]</div>
              <div>To initiate a refund, contact support@company.com...</div>
            </div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="User question">
          <p>Placed after context so the model reads evidence first, then the query.</p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Generation settings">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Temperature 0–0.2</strong> — factual Q&A; creativity causes hallucination.</li>
          <li><strong className="text-white">Top-p 0.9</strong> — standard default.</li>
          <li><strong className="text-white">max_tokens</strong> — sized to expected answer length.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Diagnosing failures">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Symptom</th>
                <th className="px-4 py-3">Likely layer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Right chunk missing from answer context', 'Retrieval — chunking, embeddings, or strategy'],
                ['Chunk present but answer ignores it', 'Generation — prompt or temperature'],
                ['Answer copies chunk verbatim', 'Prompt too restrictive'],
                ['Hallucinated details not in any chunk', 'Temperature too high or too many irrelevant chunks'],
              ].map(([symptom, layer]) => (
                <tr key={symptom} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-slate-400">{symptom}</td>
                  <td className="px-4 py-3 font-semibold text-white">{layer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Structure prompts: system rules → context chunks → user question.',
          'Include source metadata for citations.',
          'Use low temperature (0–0.2) for factual RAG.',
          'Missing context = retrieval problem; ignored context = generation problem.',
        ]}
      />
    </LessonArticle>
  )
}
