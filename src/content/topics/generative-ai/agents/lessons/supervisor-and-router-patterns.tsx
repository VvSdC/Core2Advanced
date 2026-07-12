import {
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function SupervisorAndRouterPatterns() {
  return (
    <LessonArticle>
      <LessonSection title="Supervisor pattern">
        <p>
          A <strong className="text-white">supervisor</strong> agent reads the conversation and{' '}
          <strong className="text-white">delegates to one worker at a time</strong>, then reads the worker's
          response and decides the next worker or finishes. LangGraph's official multi-agent pattern.
        </p>
        <Flowchart
          title="Supervisor loop"
          chart={`flowchart TB
  User --> SUP[Supervisor]
  SUP --> R{Delegate to?}
  R --> A1[Research Agent]
  R --> A2[Coding Agent]
  R --> A3[Writing Agent]
  A1 --> SUP
  A2 --> SUP
  A3 --> SUP
  SUP --> FIN{Done?}
  FIN -- yes --> Output`}
        />
      </LessonSection>

      <LessonSection title="Router pattern">
        <p>
          A <strong className="text-white">router</strong> classifies the user intent <em>once</em> at the start
          and sends to exactly one specialist — no back-and-forth with a supervisor. Simpler and cheaper.
        </p>
        <Flowchart
          title="Router — one-shot dispatch"
          chart={`flowchart LR
  User --> RT[Router / Classifier]
  RT --> S[Support Agent]
  RT --> T[Technical Agent]
  RT --> B[Billing Agent]`}
        />
      </LessonSection>

      <LessonSection title="Supervisor vs router">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Pattern</th>
                <th className="px-4 py-3">Routing</th>
                <th className="px-4 py-3">Best for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Router', 'Once at start', 'Clear intent categories — support bots'],
                ['Supervisor', 'Every step', 'Multi-step tasks needing different specialists'],
                ['Orchestrator', 'Every step + non-LLM experts', 'Multimodal + tool pipelines'],
              ].map(([p, routing, best]) => (
                <tr key={p} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{p}</td>
                  <td className="px-4 py-3 text-slate-400">{routing}</td>
                  <td className="px-4 py-3 text-slate-400">{best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="LangGraph supervisor">
        <Example
          title="create_supervisor from langgraph-supervisor"
        >{`from langgraph_supervisor import create_supervisor

supervisor = create_supervisor(
    agents=[research_agent, coding_agent],
    model=ChatOpenAI(model="gpt-4o"),
    prompt="You are a supervisor. Delegate tasks to the right agent.",
).compile()

result = supervisor.invoke({"messages": [("human", "Research and code a sorting algo")]})`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Supervisor delegates repeatedly until task is done — LangGraph native pattern.',
          'Router classifies once — simpler, cheaper, for clear intent categories.',
          'create_supervisor builds the supervisor graph from worker agent subgraphs.',
        ]}
      />
    </LessonArticle>
  )
}
