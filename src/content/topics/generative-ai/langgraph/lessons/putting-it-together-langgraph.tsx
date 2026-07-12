import {
  Callout,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherLanggraph() {
  return (
    <LessonArticle>
      <LessonSection title="When to use LangGraph">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Scenario</th>
                <th className="px-4 py-3">Use LangGraph?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Simple Q&A chain', 'No — LCEL prompt | llm is enough'],
                ['Basic ReAct with tools', 'Optional — create_react_agent works; AgentExecutor also fine for prototypes'],
                ['Human approval before actions', 'Yes — interrupt_before'],
                ['Multi-agent supervisor', 'Yes — conditional routing to specialist nodes'],
                ['Retry with reflection', 'Yes — cycle nodes with retry_count in state'],
                ['Long-running conversations', 'Yes — checkpointer + thread_id'],
              ].map(([scenario, use]) => (
                <tr key={scenario} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-slate-400">{scenario}</td>
                  <td className="px-4 py-3 font-semibold text-white">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Production checklist">
        <ol className="list-decimal space-y-2 pl-5 text-slate-300">
          <li>Define state schema with TypedDict and correct reducers.</li>
          <li>Set <code className="font-mono text-sm">max_iterations</code> equivalent — cap conditional edge loops.</li>
          <li>Add PostgresSaver checkpointer for persistence.</li>
          <li>Add <code className="font-mono text-sm">interrupt_before</code> on destructive tool nodes.</li>
          <li>Use LangSmith tracing — every node appears as a span.</li>
          <li>temperature=0 on agent LLM calls.</li>
        </ol>
      </LessonSection>

      <LessonSection title="Path forward — Agents sub-topic">
        <Flowchart
          title="LangGraph → Multi-agent"
          chart={`flowchart TB
  LG[LangGraph single agent] --> SUP[Supervisor node]
  SUP --> R[Researcher subgraph]
  SUP --> C[Coder subgraph]
  SUP --> W[Writer subgraph]`}
        />
        <Callout variant="beginner">
          The <em>Agents</em> sub-topic covers multi-agent, hierarchical, orchestrator, and sequential
          architectures — all implemented as LangGraph graphs.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'LangGraph for production agents needing branching, humans, persistence, or multi-agent.',
          'LCEL chains still fine for simple pipelines without agent loops.',
          'Next: Agents sub-topic — architecture patterns built on LangGraph.',
        ]}
      />
    </LessonArticle>
  )
}
