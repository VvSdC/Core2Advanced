import {
  Callout,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ChoosingAgentArchitecture() {
  return (
    <LessonArticle>
      <LessonSection title="Decision flowchart">
        <Flowchart
          title="Which agent architecture?"
          chart={`flowchart TB
  A[Your task] --> B{Single LLM + tools enough?}
  B -- yes --> C[Single ReAct Agent]
  B -- no --> D{Fixed step order?}
  D -- yes --> E[Sequential Multi-Agent]
  D -- no --> F{Need upfront task breakdown?}
  F -- yes --> G[Hierarchical or Plan-and-Execute]
  F -- no --> H{Mix of models/APIs/tools?}
  H -- yes --> I[Orchestrator]
  H -- no --> J{Multi-step delegation?}
  J -- yes --> K[Supervisor]
  J -- no --> L[Router]`}
        />
      </LessonSection>

      <LessonSection title="Architecture comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Architecture</th>
                <th className="px-4 py-3">Complexity</th>
                <th className="px-4 py-3">Cost</th>
                <th className="px-4 py-3">Flexibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Single ReAct', 'Low', 'Low', 'Medium'],
                ['Router', 'Low', 'Low', 'Low'],
                ['Sequential', 'Medium', 'Medium', 'Low'],
                ['Plan-and-Execute', 'Medium', 'Medium', 'Medium'],
                ['Supervisor', 'High', 'High', 'High'],
                ['Hierarchical', 'High', 'High', 'Medium'],
                ['Orchestrator', 'High', 'High', 'Highest'],
                ['Collaborative', 'High', 'Very high', 'High'],
              ].map(([arch, comp, cost, flex]) => (
                <tr key={arch} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{arch}</td>
                  <td className="px-4 py-3 text-slate-400">{comp}</td>
                  <td className="px-4 py-3 text-slate-400">{cost}</td>
                  <td className="px-4 py-3 text-slate-400">{flex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Golden rules">
        <ol className="list-decimal space-y-2 pl-5 text-slate-300">
          <li>Start with a single ReAct agent — add complexity only when it fails.</li>
          <li>Every agent loop needs a max iteration cap.</li>
          <li>temperature=0 for routing and planning; higher only for creative worker agents.</li>
          <li>Use LangSmith to trace which agent/node is slow or failing.</li>
          <li>Implement all patterns as LangGraph graphs with explicit state.</li>
        </ol>
      </LessonSection>

      <Callout variant="insight">
        The most common production pattern in 2025–2026: <strong className="text-white">Supervisor</strong> with
        2–4 specialist worker agents, PostgresSaver checkpointing, and interrupt_before on write tools.
      </Callout>

      <KeyTakeaways
        items={[
          'Start simple (ReAct) → add architecture only when needed.',
          'Sequential for fixed pipelines; supervisor for dynamic delegation; orchestrator for mixed experts.',
          'All patterns implemented as LangGraph graphs with typed state.',
        ]}
      />
    </LessonArticle>
  )
}
