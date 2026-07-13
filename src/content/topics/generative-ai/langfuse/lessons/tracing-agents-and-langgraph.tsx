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

export function TracingAgentsAndLanggraph() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Read this after">
        Complete <em>ReAct Agents</em> (LangChain) and <em>ReAct Agent in LangGraph</em>. Agent traces are trees —
        this lesson shows how Langfuse represents each step.
      </Callout>

      <LessonSection title="Agent traces are trees, not flat logs">
        <p className="text-slate-300">
          A single user question might trigger: LLM decides to call a tool → tool runs → LLM reads result → LLM calls
          another tool → final answer. Each hop is a node in a tree. Flat logging hides which tool failed or which LLM
          turn hallucinated.
        </p>
        <Flowchart
          title="Multi-step agent trace tree"
          chart={`flowchart TB
  T[Trace: agent_run]
  T --> G1[Generation: plan — turn 1]
  G1 --> S1[Span: tool_search]
  S1 --> G2[Generation: synthesize — turn 2]
  G2 --> S2[Span: tool_calculator]
  S2 --> G3[Generation: final answer — turn 3]`}
        />
      </LessonSection>

      <Definition term="Tracing rule of thumb for agents">
        <p>
          <strong className="text-white">Each LLM turn = generation.</strong>{' '}
          <strong className="text-white">Each tool call = span.</strong> Name them clearly (
          <code className="font-mono text-sm">tool_search</code>,{' '}
          <code className="font-mono text-sm">agent_turn_2</code>) so the dashboard tree is readable at a glance.
        </p>
      </Definition>

      <LessonSection title="Manual agent instrumentation">
        <Example
          title="ReAct-style loop with generations and tool spans"
        >{`from langfuse import observe

@observe(name="tool_search")
def search_tool(query: str) -> str:
    return f"Results for: {query}"

@observe(as_type="generation", name="agent_llm_turn")
def agent_llm_turn(messages: list) -> dict:
    response = llm.invoke(messages)
    return {"content": response.content, "tool_calls": response.tool_calls}

@observe(name="agent_run")
def run_agent(user_query: str) -> str:
    messages = [{"role": "user", "content": user_query}]

    for turn in range(5):  # safety limit
        result = agent_llm_turn(messages)  # generation child

        if not result["tool_calls"]:
            return result["content"]  # final answer

        for call in result["tool_calls"]:
            tool_output = search_tool(call["args"]["query"])  # span child
            messages.append({"role": "tool", "content": tool_output})

    return "Max turns reached"`}</Example>
        <Callout variant="insight">
          Expand the trace tree in the dashboard: you will see alternating generation → span → generation nodes —
          exactly matching the Thought → Action → Observation loop from ReAct.
        </Callout>
      </LessonSection>

      <LessonSection title="LangGraph node visibility">
        <p className="text-slate-300">
          LangGraph runs a state machine with named nodes (<code className="font-mono text-sm">agent</code>,{' '}
          <code className="font-mono text-sm">tools</code>, custom routers). With Langfuse integration, each node
          execution appears as a span — you can see which node ran, how long it took, and what state changed.
        </p>
        <ContentStep number={1} title="Each graph node = a span">
          <p>
            The <code className="font-mono text-sm">call_model</code> node creates generations; the{' '}
            <code className="font-mono text-sm">tools</code> node creates spans per tool invocation.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Conditional edges show routing decisions">
          <p>
            Traces reveal whether the agent looped back to tools or exited — critical when debugging infinite loops
            or premature stops.
          </p>
        </ContentStep>
        <Flowchart
          title="LangGraph trace mapping"
          chart={`flowchart TB
  T[Trace: langgraph_invoke]
  T --> N1[Span: agent node]
  N1 --> G[Generation: LLM + tool_calls]
  T --> N2[Span: tools node]
  N2 --> T1[Span: tool_search]
  N2 --> T2[Span: tool_calculator]
  T --> N3[Span: agent node — final]`}
        />
      </LessonSection>

      <LessonSection title="Langfuse + LangChain / LangGraph integration">
        <p className="text-slate-300">
          Pass <code className="font-mono text-sm">CallbackHandler</code> to LangGraph{' '}
          <code className="font-mono text-sm">.invoke()</code> or <code className="font-mono text-sm">.stream()</code>{' '}
          — Langfuse auto-creates the full agent tree without manual decorators on every node.
        </p>
        <Example
          title="LangGraph agent with Langfuse CallbackHandler"
        >{`from langfuse import observe, get_client, propagate_attributes
from langfuse.langchain import CallbackHandler
from langgraph.prebuilt import create_react_agent

langfuse = get_client()
app = create_react_agent(llm, tools)

@observe(name="langgraph_agent")
def run_langgraph_agent(question: str, thread_id: str):
    handler = CallbackHandler()

    with propagate_attributes(session_id=thread_id):
        result = app.invoke(
            {"messages": [("human", question)]},
            config={
                "configurable": {"thread_id": thread_id},
                "callbacks": [handler],
            },
        )
    return result["messages"][-1].content`}</Example>
        <Callout variant="tip">
          Use <code className="font-mono text-sm">thread_id</code> as <code className="font-mono text-sm">session_id</code>{' '}
          so all turns in one LangGraph conversation group together in the Sessions view.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Agent traces are trees: each LLM turn is a generation, each tool call is a span.',
          'Name observations clearly (tool_search, agent_turn_2) so multi-step runs are readable.',
          'LangGraph nodes (agent, tools) map to spans; generations nest inside agent nodes.',
          'CallbackHandler on .invoke() auto-traces LangChain/LangGraph agents with minimal code.',
        ]}
      />
    </LessonArticle>
  )
}
