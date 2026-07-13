import {
  Callout,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherAgents() {
  return (
    <LessonArticle>
      <LessonSection title="The full stack">
        <Flowchart
          title="From RAG to multi-agent"
          chart={`flowchart LR
  RAG[RAG — knowledge] --> LC[LangChain — tools + ReAct]
  LC --> LG[LangGraph — state + routing]
  LG --> MA[Agents — architecture patterns]
  MA --> Prod[Production: supervisor + checkpointing]`}
        />
        <p className="mt-4 text-slate-300">
          Each layer adds capability. RAG grounds answers in documents. LangChain adds tools and the ReAct loop.
          LangGraph makes the loop explicit, persistent, and interruptible. The Agents sub-topic maps{' '}
          <em>which graph topology</em> to use for your task.
        </p>
      </LessonSection>

      <LessonSection title="Production supervisor pattern">
        <Example
          title="Minimal supervisor graph (conceptual)"
        >{`# Nodes: supervisor, researcher, coder, writer
# State: messages, next_agent, task_status

def supervisor(state):
    # LLM picks: researcher | coder | writer | FINISH
    ...

def route(state):
    if state["next_agent"] == "FINISH":
        return END
    return state["next_agent"]

graph.add_conditional_edges("supervisor", route)`}</Example>
        <Callout variant="insight">
          This is the most common 2025–2026 production pattern: one supervisor node routing to 2–4 specialist
          subgraphs, PostgresSaver for sessions, and <code className="font-mono text-sm">interrupt_before</code>{' '}
          on write tools.
        </Callout>
      </LessonSection>

      <LessonSection title="Checklist before shipping">
        <ol className="list-decimal space-y-2 pl-5 text-slate-300">
          <li>Start with single ReAct — only add multi-agent when traces show repeated failures.</li>
          <li>Cap every loop: <code className="font-mono text-sm">max_iterations</code> in state + conditional edge.</li>
          <li>temperature=0 for supervisor and router; creative temperature only on writer nodes.</li>
          <li>Langfuse or LangSmith traces per node — identify which agent is slow or hallucinating.</li>
          <li>Human-in-the-loop on destructive actions (delete, send email, charge payment).</li>
          <li>Read the research papers — they explain <em>why</em> each pattern was invented.</li>
        </ol>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RAG → LangChain → LangGraph → Agents is the learning path to production systems.',
          'Supervisor + specialist workers is the default production multi-agent pattern.',
          'Read research papers (AutoGen, MetaGPT, CAMEL, Generative Agents) for design rationale.',
        ]}
      />
    </LessonArticle>
  )
}
