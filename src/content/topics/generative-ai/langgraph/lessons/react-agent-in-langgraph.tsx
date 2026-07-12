import {
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ReactAgentInLanggraph() {
  return (
    <LessonArticle>
      <LessonSection title="ReAct as a graph">
        <Flowchart
          title="LangGraph ReAct agent"
          chart={`flowchart TB
  START --> agent[call_model]
  agent --> route{tool_calls?}
  route -- yes --> tools[ToolNode]
  tools --> agent
  route -- no --> END`}
        />
      </LessonSection>

      <LessonSection title="Full implementation">
        <Example
          title="ReAct agent with LangGraph prebuilt + custom"
        >{`from typing import Annotated, TypedDict
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.checkpoint.memory import MemorySaver

@tool
def search(query: str) -> str:
    """Search for information."""
    return f"Results for: {query}"

tools = [search]
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0).bind_tools(tools)

class State(TypedDict):
    messages: Annotated[list, add_messages]

def call_model(state: State):
    return {"messages": [llm.invoke(state["messages"])]}

graph = StateGraph(State)
graph.add_node("agent", call_model)
graph.add_node("tools", ToolNode(tools))

graph.add_edge(START, "agent")
graph.add_conditional_edges("agent", tools_condition)  # built-in router
graph.add_edge("tools", "agent")

app = graph.compile(checkpointer=MemorySaver())

config = {"configurable": {"thread_id": "1"}}
result = app.invoke(
    {"messages": [("human", "Search for LangGraph docs")]},
    config,
)
print(result["messages"][-1].content)`}</Example>
      </LessonSection>

      <LessonSection title="Prebuilt helpers">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">ToolNode</strong> — runs tool calls from the last AI message automatically.</li>
          <li><strong className="text-white">tools_condition</strong> — routes to tools if tool_calls exist, else END.</li>
          <li><strong className="text-white">create_react_agent</strong> — one-liner that builds this entire graph for you.</li>
        </ul>
        <Example
          title="One-liner ReAct agent"
        >{`from langgraph.prebuilt import create_react_agent

app = create_react_agent(llm, tools, checkpointer=MemorySaver())
result = app.invoke({"messages": [("human", "Hello")]}, config)`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'ReAct loop = agent node → tools_condition → ToolNode → agent (cycle).',
          'ToolNode + tools_condition replace manual parsing from AgentExecutor.',
          'create_react_agent is the quick start; custom graphs for production control.',
        ]}
      />
    </LessonArticle>
  )
}
