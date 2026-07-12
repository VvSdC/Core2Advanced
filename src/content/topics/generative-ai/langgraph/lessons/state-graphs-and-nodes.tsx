import {
  ContentStep,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function StateGraphsAndNodes() {
  return (
    <LessonArticle>
      <LessonSection title="StateGraph — the foundation">
        <p>
          A <strong className="text-white">StateGraph</strong> is a directed graph where each{' '}
          <strong className="text-white">node</strong> is a Python function that reads state, does work, and
          returns state updates. Edges connect nodes and define execution order.
        </p>
        <Flowchart
          title="Graph anatomy"
          chart={`flowchart TB
  S[State: messages, plan, retries] --> N1[Node: planner]
  N1 --> S2[State updated]
  S2 --> N2[Node: executor]
  N2 --> S3[State updated again]`}
        />
      </LessonSection>

      <LessonSection title="Defining state">
        <Example
          title="TypedDict state schema"
        >{`from typing import Annotated, TypedDict
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]  # auto-append new messages
    retry_count: int`}</Example>
        <p className="mt-3 text-slate-300">
          State is a <code className="font-mono text-sm">TypedDict</code> — every key is a channel. Nodes return
          partial updates (e.g. <code className="font-mono text-sm">{'{"retry_count": 1}'}</code>) that merge
          into the full state.
        </p>
      </LessonSection>

      <LessonSection title="Adding nodes">
        <ContentStep number={1} title="Node = function(state) → partial state">
          <Example
            title="Simple LLM node"
          >{`from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

def call_model(state: AgentState):
    response = llm.invoke(state["messages"])
    return {"messages": [response]}`}</Example>
        </ContentStep>
        <ContentStep number={2} title="Register on the graph">
          <Example
            title="Build the graph"
          >{`from langgraph.graph import StateGraph, START, END

graph = StateGraph(AgentState)
graph.add_node("agent", call_model)
graph.add_edge(START, "agent")
graph.add_edge("agent", END)

app = graph.compile()`}</Example>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Invoking the graph">
        <Example
          title="Run with initial state"
          output="AI message with response content"
        >{`result = app.invoke({
    "messages": [("human", "What is LangGraph?")],
    "retry_count": 0,
})

print(result["messages"][-1].content)`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'StateGraph = nodes (functions) + edges (flow) + typed state (data).',
          'Nodes return partial state updates; reducers merge them (e.g. add_messages).',
          'graph.compile() produces a runnable app — invoke with initial state.',
        ]}
      />
    </LessonArticle>
  )
}
