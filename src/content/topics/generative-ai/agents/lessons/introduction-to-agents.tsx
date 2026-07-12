import {
  Callout,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function IntroductionToAgents() {
  return (
    <LessonArticle>
      <Definition term="AI Agent">
        <p>
          An <strong className="text-white">AI agent</strong> is an LLM that <em>decides what to do next</em> —
          calling tools, asking questions, delegating to other agents, or finishing — in a loop until the task is
          complete. Unlike a chain (fixed steps), an agent's path is dynamic.
        </p>
      </Definition>

      <LessonSection title="Agent vs chain vs RAG">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Pattern</th>
                <th className="px-4 py-3">Flow</th>
                <th className="px-4 py-3">Best for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Chain (LCEL)', 'Fixed: A → B → C', 'Predictable pipelines, extraction, formatting'],
                ['RAG', 'Fixed: retrieve → generate', 'Document Q&A over static knowledge'],
                ['Single agent', 'Dynamic loop: think → act → observe', 'Tasks needing tools or live data'],
                ['Multi-agent', 'Dynamic + multiple roles', 'Complex tasks needing specialisation'],
              ].map(([pattern, flow, best]) => (
                <tr key={pattern} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{pattern}</td>
                  <td className="px-4 py-3 text-slate-400">{flow}</td>
                  <td className="px-4 py-3 text-slate-400">{best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Architecture landscape">
        <Flowchart
          title="Agent architectures covered in this sub-topic"
          chart={`flowchart TB
  A[Single Agent — ReAct] --> B[Sequential Multi-Agent]
  B --> C[Hierarchical — manager + workers]
  C --> D[Orchestrator — central dispatcher]
  D --> E[Supervisor / Router]
  E --> F[Collaborative — debate]
  F --> G[Plan-and-Execute]`}
        />
      </LessonSection>

      <Callout variant="beginner" title="Read this after">
        Complete <em>LangChain</em> (ReAct Agents, Tools) and <em>LangGraph</em> (graphs, routing, checkpointing).
        Every architecture here is implemented as a LangGraph graph.
      </Callout>

      <KeyTakeaways
        items={[
          'Agents decide dynamically what to do next — unlike fixed chains.',
          'Single agent (ReAct) is the building block; multi-agent adds specialisation.',
          'This sub-topic covers 6+ architecture patterns with flowcharts and LangGraph mapping.',
        ]}
      />
    </LessonArticle>
  )
}
