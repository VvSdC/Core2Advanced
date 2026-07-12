import {
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function OrchestratorPattern() {
  return (
    <LessonArticle>
      <LessonSection title="What is an orchestrator?">
        <p>
          An <strong className="text-white">orchestrator</strong> (controller) LLM reads the task, decides which
          expert model or agent to invoke, passes inputs, reads outputs, and decides the next step — dynamically,
          not from a fixed pipeline.
        </p>
        <Flowchart
          title="Orchestrator loop"
          chart={`flowchart TB
  User --> O[Orchestrator LLM]
  O --> D{Which expert?}
  D --> E1[Vision Model]
  D --> E2[Search API]
  D --> E3[Code Executor]
  D --> E4[Summariser LLM]
  E1 --> O
  E2 --> O
  E3 --> O
  E4 --> O
  O --> Done{Task complete?}
  Done -- no --> D
  Done -- yes --> Output`}
        />
      </LessonSection>

      <LessonSection title="Orchestrator vs hierarchical manager">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Aspect</th>
                <th className="px-4 py-3">Orchestrator</th>
                <th className="px-4 py-3">Hierarchical manager</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 text-slate-400">Planning</td>
                <td className="px-4 py-3 text-slate-400">Dynamic — picks next expert each step</td>
                <td className="px-4 py-3 text-slate-400">Upfront decomposition into subtasks</td>
              </tr>
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 text-slate-400">Experts</td>
                <td className="px-4 py-3 text-slate-400">Models, APIs, tools — not just LLM agents</td>
                <td className="px-4 py-3 text-slate-400">LLM agents with roles</td>
              </tr>
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 text-slate-400">Canonical paper</td>
                <td className="px-4 py-3 text-slate-400">HuggingGPT</td>
                <td className="px-4 py-3 text-slate-400">MetaGPT, ChatDev</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="LangGraph orchestrator node">
        <Example
          title="Orchestrator routes to expert nodes"
        >{`def orchestrator(state):
    # LLM decides: which expert next? or are we done?
    decision = llm.with_structured_output(RouteDecision).invoke(
        state["messages"]
    )
    return {"next_expert": decision.expert, "done": decision.done}

def route(state) -> str:
    if state["done"]:
        return END
    return state["next_expert"]  # "search" | "code" | "vision"

graph.add_conditional_edges("orchestrator", route)`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Orchestrator dynamically picks experts (models, tools, agents) each step.',
          'Differs from hierarchical: no upfront plan — adapts after each observation.',
          'HuggingGPT is the canonical example — see Research Papers.',
        ]}
      />
    </LessonArticle>
  )
}
