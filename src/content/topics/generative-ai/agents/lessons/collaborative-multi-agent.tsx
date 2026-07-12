import {
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function CollaborativeMultiAgent() {
  return (
    <LessonArticle>
      <LessonSection title="Agents that discuss">
        <p>
          Instead of a manager assigning tasks, <strong className="text-white">collaborative agents</strong> engage
          in multi-turn dialogue — debating, critiquing, and refining each other's outputs until they converge on
          an answer.
        </p>
        <Flowchart
          title="Debate pattern"
          chart={`flowchart LR
  Q[Question] --> A[Agent A: proposes answer]
  A --> B[Agent B: critiques]
  B --> C[Agent A: revises]
  C --> D{Agree?}
  D -- no --> B
  D -- yes --> Final`}
        />
      </LessonSection>

      <LessonSection title="Collaboration variants">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Variant</th>
                <th className="px-4 py-3">How it works</th>
                <th className="px-4 py-3">Best for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Debate', 'Two agents argue opposing sides; judge picks winner', 'Fact-checking, reducing bias'],
                ['Cooperative', 'Agents build on each other\'s drafts iteratively', 'Creative writing, design'],
                ['Role-play (CAMEL)', 'User + assistant roles explore a task together', 'Open-ended exploration'],
                ['Self-consistency', 'Multiple agents solve independently; majority vote', 'Math, reasoning accuracy'],
              ].map(([v, how, best]) => (
                <tr key={v} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{v}</td>
                  <td className="px-4 py-3 text-slate-400">{how}</td>
                  <td className="px-4 py-3 text-slate-400">{best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Trade-offs">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Pros</strong> — higher quality through critique; catches errors single agents miss.</li>
          <li><strong className="text-white">Cons</strong> — many LLM calls; slow; risk of infinite debate loops without a cap.</li>
          <li>Cap rounds with <code className="font-mono text-sm">debate_round &lt; 3</code> in state and conditional edge.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Collaborative agents debate or co-build through multi-turn dialogue.',
          'Debate reduces hallucination; cooperative builds iteratively.',
          'Expensive — cap rounds and use for high-stakes decisions only.',
        ]}
      />
    </LessonArticle>
  )
}
