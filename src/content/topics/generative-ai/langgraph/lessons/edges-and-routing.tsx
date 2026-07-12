import {
  ContentStep,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function EdgesAndRouting() {
  return (
    <LessonArticle>
      <LessonSection title="Edge types">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Edge type</th>
                <th className="px-4 py-3">When to use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Normal edge', 'Always go A → B'],
                ['Conditional edge', 'Route based on state — tool call vs done, retry vs succeed'],
                ['START / END', 'Entry and exit points of the graph'],
              ].map(([type, when]) => (
                <tr key={type} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{type}</td>
                  <td className="px-4 py-3 text-slate-400">{when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Conditional edges — the ReAct loop">
        <Flowchart
          title="Route on tool calls"
          chart={`flowchart TB
  START --> agent[agent node]
  agent --> route{should_continue?}
  route -- tools --> tools[tools node]
  tools --> agent
  route -- end --> END`}
        />
        <Example
          title="Routing function + conditional edges"
        >{`def should_continue(state: AgentState) -> str:
    last = state["messages"][-1]
    if last.tool_calls:
        return "tools"
    return END

graph.add_conditional_edges(
    "agent",
    should_continue,
    {"tools": "tools", END: END},
)
graph.add_edge("tools", "agent")`}</Example>
      </LessonSection>

      <LessonSection title="Dynamic routing patterns">
        <ContentStep number={1} title="Retry on failure">
          <p>Route to a retry node if <code className="font-mono text-sm">retry_count &lt; 3</code>, else END.</p>
        </ContentStep>
        <ContentStep number={2} title="Human approval">
          <p>Route to <code className="font-mono text-sm">human_review</code> if action is high-risk, else execute.</p>
        </ContentStep>
        <ContentStep number={3} title="Multi-agent dispatch">
          <p>Route to <code className="font-mono text-sm">researcher</code> or <code className="font-mono text-sm">coder</code> based on classified intent.</p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Normal edges = fixed flow; conditional edges = branch on state.',
          'should_continue routing is the standard ReAct loop pattern.',
          'Conditional edges enable retry, human approval, and multi-agent dispatch.',
        ]}
      />
    </LessonArticle>
  )
}
