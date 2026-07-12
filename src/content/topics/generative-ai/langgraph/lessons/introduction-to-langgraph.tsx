import {
  Callout,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function IntroductionToLanggraph() {
  return (
    <LessonArticle>
      <Definition term="LangGraph">
        <p>
          <strong className="text-white">LangGraph</strong> is a library for building{' '}
          <strong className="text-white">stateful, multi-step agent workflows</strong> as graphs. Each step is a
          node; edges control flow. State persists across steps — unlike LangChain's string-parsed AgentExecutor
          loops.
        </p>
      </Definition>

      <LessonSection title="Why LangGraph exists">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">AgentExecutor is a black box</strong> — hard to debug, branch, or pause mid-loop.</li>
          <li><strong className="text-white">Production agents need cycles</strong> — retry, reflect, ask human, branch on tool result.</li>
          <li><strong className="text-white">Explicit state</strong> — every variable (messages, plan, retries) lives in a typed state object.</li>
          <li><strong className="text-white">Checkpointing</strong> — pause, resume, and time-travel through agent execution.</li>
        </ul>
      </LessonSection>

      <LessonSection title="LangChain vs LangGraph">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Aspect</th>
                <th className="px-4 py-3">LangChain AgentExecutor</th>
                <th className="px-4 py-3">LangGraph</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Flow control', 'Fixed ReAct loop', 'Custom graph — any topology'],
                ['State', 'Implicit in message history', 'Explicit TypedDict state'],
                ['Branching', 'Parse errors only', 'Conditional edges on any field'],
                ['Human approval', 'Not built in', 'interrupt_before / interrupt_after'],
                ['Persistence', 'Manual', 'Built-in checkpointing'],
                ['Debugging', 'verbose=True strings', 'Visual graph + state snapshots'],
              ].map(([aspect, lc, lg]) => (
                <tr key={aspect} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{aspect}</td>
                  <td className="px-4 py-3 text-slate-400">{lc}</td>
                  <td className="px-4 py-3 text-slate-400">{lg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Core concepts preview">
        <Flowchart
          title="A minimal LangGraph"
          chart={`flowchart LR
  START --> A[Node: call LLM]
  A --> B{Tool calls?}
  B -- yes --> C[Node: run tools]
  C --> A
  B -- no --> END`}
        />
      </LessonSection>

      <Callout variant="beginner" title="Read this after">
        Complete <em>LangChain</em> — especially <em>ReAct Agents</em>, <em>Tools</em>, and <em>Chains & LCEL</em>.
        LangGraph replaces AgentExecutor with an explicit graph you design.
      </Callout>

      <KeyTakeaways
        items={[
          'LangGraph = stateful agent workflows as explicit graphs (nodes + edges + state).',
          'Replaces AgentExecutor for production — branching, human-in-loop, checkpointing.',
          'Built on LangChain — same models, tools, and prompts; different orchestration.',
        ]}
      />
    </LessonArticle>
  )
}
