import {
  Callout,
  ContentStep,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ReactAgents() {
  return (
    <LessonArticle>
      <LessonSection title="What is a ReAct agent?">
        <p>
          A <strong className="text-white">ReAct agent</strong> (Reasoning + Acting) loops through: think about
          what to do → call a tool → observe the result → repeat until it can answer. LangChain implements the
          ReAct pattern from the research paper with <code className="font-mono text-sm">create_react_agent</code>{' '}
          and <code className="font-mono text-sm">AgentExecutor</code>.
        </p>
        <Flowchart
          title="ReAct agent loop"
          chart={`flowchart TB
  A[User input] --> B[Agent: Thought]
  B --> C[Agent: Action — pick a tool]
  C --> D[Tool executes]
  D --> E[Observation returned]
  E --> F{Done?}
  F -- no --> B
  F -- yes --> G[Final Answer]`}
        />
      </LessonSection>

      <LessonSection title="Building a ReAct agent">
        <ContentStep number={1} title="Define tools and create the agent">
          <Example
            title="ReAct agent with calculator and search"
          >{`from langchain.agents import create_react_agent, AgentExecutor
from langchain_core.prompts import PromptTemplate
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI

@tool
def calculator(expression: str) -> str:
    """Evaluate a math expression."""
    return str(eval(expression))

@tool
def search(query: str) -> str:
    """Search for current information."""
    return f"Results for '{query}': The population of Tokyo is 14 million."

tools = [calculator, search]
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)`}</Example>
        </ContentStep>

        <ContentStep number={2} title="Agent prompt and executor">
          <Example
            title="Create and run the agent"
            output={`Thought: I need to search for Tokyo's population.
Action: search
Action Input: Tokyo population
Observation: The population of Tokyo is 14 million.
Thought: I now know the answer.
Final Answer: Tokyo has a population of approximately 14 million.`}
          >{`from langchain import hub

# Pull the standard ReAct prompt from LangChain Hub
prompt = hub.pull("hwchase17/react")

agent = create_react_agent(llm, tools, prompt)

executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,          # print Thought/Action/Observation steps
    max_iterations=5,      # safety limit — prevent infinite loops
    handle_parsing_errors=True,
)

result = executor.invoke({
    "input": "What is the population of Tokyo? Use search."
})
print(result["output"])`}</Example>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What happens under the hood">
        <p>
          The agent prompt instructs the model to output in a strict format:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Thought: [reasoning about what to do]</div>
          <div>Action: [tool name]</div>
          <div>Action Input: [tool arguments]</div>
          <div className="text-slate-400">--- tool runs, observation injected ---</div>
          <div>Thought: [reasoning with new info]</div>
          <div>Final Answer: [response to user]</div>
        </div>
        <p className="mt-3">
          <code className="font-mono text-sm">AgentExecutor</code> parses each step, calls the matching tool,
          appends the observation to the prompt, and loops until "Final Answer" appears or{' '}
          <code className="font-mono text-sm">max_iterations</code> is hit.
        </p>
      </LessonSection>

      <LessonSection title="Agent safety settings">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">max_iterations</strong> — cap loops at 5–15 to prevent runaway costs.</li>
          <li><strong className="text-white">early_stopping_method="generate"</strong> — force an answer if max iterations hit.</li>
          <li><strong className="text-white">handle_parsing_errors=True</strong> — recover when the model outputs malformed actions.</li>
          <li><strong className="text-white">temperature=0</strong> — agents need deterministic tool selection, not creativity.</li>
        </ul>
      </LessonSection>

      <Callout variant="tip">
        For production agents with complex state, branching, and human-in-the-loop, use{' '}
        <strong className="text-white">LangGraph</strong> — LangChain's graph-based agent framework with explicit
        state machines instead of string-parsed loops.
      </Callout>

      <KeyTakeaways
        items={[
          'ReAct agents loop: Thought → Action → Observation → repeat → Final Answer.',
          'create_react_agent + AgentExecutor is the standard LangChain agent setup.',
          'Set max_iterations and temperature=0 for safe, deterministic agent behaviour.',
          'LangGraph is the next step for production-grade agents with complex workflows.',
        ]}
      />
    </LessonArticle>
  )
}
