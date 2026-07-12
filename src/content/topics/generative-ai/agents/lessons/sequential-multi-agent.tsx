import {
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function SequentialMultiAgent() {
  return (
    <LessonArticle>
      <LessonSection title="What is sequential multi-agent?">
        <p>
          Tasks pass through a <strong className="text-white">fixed pipeline of specialist agents</strong> —
          each agent transforms the output and hands it to the next. No central router; order is predetermined.
        </p>
        <Flowchart
          title="Sequential pipeline"
          chart={`flowchart LR
  Input --> R[Researcher Agent]
  R --> W[Writer Agent]
  W --> E[Editor Agent]
  E --> Output`}
        />
      </LessonSection>

      <LessonSection title="When to use">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Use</strong> — workflow is always the same steps (research → write → edit).</li>
          <li><strong className="text-white">Use</strong> — each stage needs different tools or prompts.</li>
          <li><strong className="text-white">Skip</strong> — steps vary by query (use orchestrator or router instead).</li>
        </ul>
      </LessonSection>

      <LessonSection title="LangGraph implementation">
        <Example
          title="Linear graph — three agent nodes"
        >{`graph = StateGraph(State)
graph.add_node("researcher", research_node)
graph.add_node("writer", write_node)
graph.add_node("editor", edit_node)

graph.add_edge(START, "researcher")
graph.add_edge("researcher", "writer")
graph.add_edge("writer", "editor")
graph.add_edge("editor", END)

# State passes accumulated context through each node
# Each node reads state["draft"] and updates it`}</Example>
      </LessonSection>

      <LessonSection title="Real-world examples">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Pipeline</th>
                <th className="px-4 py-3">Agents</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Blog post', 'Researcher → Writer → SEO Editor'],
                ['Code feature', 'Architect → Coder → Reviewer'],
                ['Report', 'Data Analyst → Summariser → Formatter'],
              ].map(([pipe, agents]) => (
                <tr key={pipe} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{pipe}</td>
                  <td className="px-4 py-3 text-slate-400">{agents}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Sequential = fixed agent pipeline; each agent refines and passes state forward.',
          'Simple LangGraph: linear edges, no conditional routing.',
          'Best when workflow steps never change; fast to build and debug.',
        ]}
      />
    </LessonArticle>
  )
}
