import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function TracingLanggraphWorkflows() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Read this after">
        Complete <em>State Graphs and Nodes</em>, <em>Supervisor and Router Patterns</em>, and{' '}
        <em>Setup and Tracing</em>. LangGraph apps trace automatically when LangSmith env vars are set.
      </Callout>

      <LessonSection title="Each graph node = a run in the trace tree">
        <p className="text-slate-300">
          LangGraph executes a state machine: data flows through named nodes connected by edges. With LangSmith
          tracing enabled, <strong className="text-white">every node execution becomes a run</strong> in the
          trace tree. You see which nodes ran, in what order, how long each took, and what state changed.
        </p>
        <Flowchart
          title="LangGraph → LangSmith mapping"
          chart={`flowchart TB
  T[Trace: graph.invoke]
  T --> G[Run: LangGraph]
  G --> N1[Child run: supervisor node]
  G --> N2[Child run: research_agent node]
  G --> N3[Child run: writer_agent node]
  N2 --> L1[Child: LLM inside agent]
  N2 --> TOOL[Child: tool call]`}
        />
      </LessonSection>

      <Definition term="Node runs vs inner runs">
        <p>
          The outer <strong className="text-white">graph run</strong> wraps the full invocation. Each{' '}
          <strong className="text-white">node run</strong> is a direct child — named after your node function
          (e.g. <code className="font-mono text-sm">agent</code>,{' '}
          <code className="font-mono text-sm">tools</code>, <code className="font-mono text-sm">supervisor</code>
          ). Inside node runs, LLM calls and tool invocations appear as further nested children.
        </p>
      </Definition>

      <LessonSection title="Debug supervisor routing">
        <p className="text-slate-300">
          Multi-agent systems with a <strong className="text-white">supervisor</strong> node are hard to debug
          from logs alone — which agent actually handled the request? In LangSmith, expand the trace tree: the
          supervisor node run shows the routing decision, and only the chosen agent's node run contains the heavy
          LLM work.
        </p>
        <ContentStep number={1} title="Find the supervisor run">
          <p>
            Look for a child run named after your supervisor node. Its output often contains the next-node
            routing decision or delegated agent name.
          </p>
        </ContentStep>
        <ContentStep number={2} title="See which agent ran">
          <p>
            Only the selected agent node (e.g. <code className="font-mono text-sm">research_agent</code> vs{' '}
            <code className="font-mono text-sm">math_agent</code>) will have substantial children. Skipped
            agents leave no node run for that step.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Spot infinite loops">
          <p>
            If the same node repeats many times (agent → tools → agent → tools…), the tree shows the loop
            clearly — count node runs to see if you hit your recursion limit.
          </p>
        </ContentStep>
        <Flowchart
          title="Supervisor routing in trace tree"
          chart={`flowchart TB
  T[Trace: multi-agent invoke]
  T --> SUP[Run: supervisor — routes to research]
  SUP --> RES[Run: research_agent]
  SUP -.->|skipped| MATH[math_agent — no run]
  RES --> LLM[Child: LLM call]
  RES --> RET[Child: retriever]`}
        />
      </LessonSection>

      <LessonSection title="thread_id in metadata — group conversations">
        <p className="text-slate-300">
          LangGraph uses <code className="font-mono text-sm">thread_id</code> in the config to persist
          conversation state across turns. Pass the same <code className="font-mono text-sm">thread_id</code>{' '}
          on every invoke so LangSmith can filter all traces from one conversation.
        </p>
        <Example
          title="LangGraph invoke with thread_id — traced automatically"
        >{`from langgraph.prebuilt import create_react_agent

app = create_react_agent(llm, tools)

config = {
    "configurable": {"thread_id": "user-42-session-7"},
    # Optional: add tags for filtering
    "metadata": {"thread_id": "user-42-session-7", "user_id": "42"},
}

result = app.invoke(
    {"messages": [("human", "Search for latest LangGraph docs")]},
    config=config,
)
# Trace tree: graph → agent node → tools node → agent node
# Filter dashboard by metadata.thread_id to see full conversation history`}</Example>
        <Callout variant="tip">
          Put <code className="font-mono text-sm">thread_id</code> in both{' '}
          <code className="font-mono text-sm">configurable</code> (for LangGraph checkpointing) and{' '}
          <code className="font-mono text-sm">metadata</code> (for LangSmith filtering). Add{' '}
          <code className="font-mono text-sm">user_id</code> in metadata to debug per-customer issues.
        </Callout>
      </LessonSection>

      <LessonSection title="Custom StateGraph — same rules apply">
        <Example
          title="Custom graph nodes appear by name in traces"
        >{`from langgraph.graph import StateGraph, END

def call_model(state):
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

def call_tools(state):
    # tool execution logic
    ...

workflow = StateGraph(AgentState)
workflow.add_node("agent", call_model)
workflow.add_node("tools", call_tools)
workflow.set_entry_point("agent")
# ... add edges ...

app = workflow.compile()
app.invoke({"messages": [...]}, config={"metadata": {"thread_id": "abc-123"}})
# UI shows: agent node run, tools node run — in execution order`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Each LangGraph node execution = a named child run in the LangSmith trace tree.',
          'Supervisor traces reveal routing decisions and which agent actually ran.',
          'Repeating node runs in the tree expose agent loops before they burn tokens in production.',
          'Pass thread_id in config metadata to filter and group multi-turn conversation traces.',
        ]}
      />
    </LessonArticle>
  )
}
