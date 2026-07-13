import {
  Callout,
  ContentStep,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function TracingLangchainApps() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Read this after">
        Complete <em>Chains and LCEL</em>, <em>RAG with LangChain</em>, and <em>ReAct Agents</em>. This lesson
        shows what LangSmith captures automatically when you run those patterns.
      </Callout>

      <LessonSection title="Automatic tracing — no CallbackHandler needed">
        <p className="text-slate-300">
          When <code className="font-mono text-sm">LANGSMITH_TRACING=true</code>, LangChain instruments every{' '}
          <code className="font-mono text-sm">.invoke()</code>, <code className="font-mono text-sm">.stream()</code>,{' '}
          and <code className="font-mono text-sm">.batch()</code> call. Each component in the pipeline becomes a
          run in the trace tree. You do <strong className="text-white">not</strong> need to import or pass a{' '}
          <code className="font-mono text-sm">CallbackHandler</code> for the basic case — that is only required
          for advanced customisation or disabling auto-tracing on specific calls.
        </p>
        <Callout variant="insight">
          Zero extra code is the main LangSmith advantage over framework-agnostic tools. If it is LangChain,
          it is already traced.
        </Callout>
      </LessonSection>

      <LessonSection title="LCEL chains — every pipe step is a run">
        <p className="text-slate-300">
          An LCEL chain like <code className="font-mono text-sm">prompt | llm | parser</code> creates a parent
          chain run with three child runs. You see exactly how long formatting took vs the LLM call vs parsing.
        </p>
        <Flowchart
          title="LCEL trace tree"
          chart={`flowchart TB
  T[Trace: chain.invoke]
  T --> C[Run: chain]
  C --> P[Child: ChatPromptTemplate]
  C --> L[Child: ChatOpenAI — llm]
  C --> O[Child: StrOutputParser]`}
        />
        <Example
          title="LCEL chain — traced automatically"
        >{`from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

prompt = ChatPromptTemplate.from_template("Summarize: {text}")
llm = ChatOpenAI(model="gpt-4o-mini")
parser = StrOutputParser()

chain = prompt | llm | parser
summary = chain.invoke({"text": "Long article about renewable energy..."})
# UI shows: chain → prompt → llm → parser with timings at each step`}</Example>
      </LessonSection>

      <LessonSection title="RAG chains — retriever + LLM visible">
        <p className="text-slate-300">
          RAG pipelines are where tracing pays off. LangSmith shows{' '}
          <strong className="text-white">which documents were retrieved</strong>, the{' '}
          <strong className="text-white">filled prompt</strong> sent to the model, and the{' '}
          <strong className="text-white">final answer</strong> — side by side in one trace.
        </p>
        <Flowchart
          title="RAG trace tree"
          chart={`flowchart TB
  T[Trace: RAG invoke]
  T --> R[Run: chain]
  R --> RET[Child: retriever — docs returned]
  R --> LLM[Child: ChatOpenAI — answer]
  RET --> D1[Document chunks in output]
  LLM --> TOK[Tokens + latency]`}
        />
        <Example
          title="RAG chain with retriever step"
        >{`from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

rag_chain = (
    {
        "context": retriever,
        "question": RunnablePassthrough(),
    }
    | prompt
    | llm
    | StrOutputParser()
)

answer = rag_chain.invoke("What is the refund policy?")
# UI: retriever child shows returned doc chunks
#     LLM child shows full prompt with context + completion`}</Example>
        <ContentStep number={1} title="Check the retriever run">
          <p>
            Expand the retriever child — you see exact chunk text and metadata. This is the first place to look
            when answers cite wrong sources.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Check the LLM run">
          <p>
            The LLM child shows the assembled prompt (system + context + question) and the model's response with
            token counts.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="AgentExecutor — tools and LLM turns">
        <p className="text-slate-300">
          ReAct-style agents loop: LLM decides → tool runs → LLM reads result → repeat. Each iteration appears
          as nested runs — alternating LLM and tool children under the agent root.
        </p>
        <Flowchart
          title="AgentExecutor trace tree"
          chart={`flowchart TB
  T[Trace: AgentExecutor]
  T --> A[Run: AgentExecutor]
  A --> L1[Child: LLM — plan + tool_calls]
  L1 --> T1[Child: tool — search]
  A --> L2[Child: LLM — synthesize]
  L2 --> T2[Child: tool — calculator]
  A --> L3[Child: LLM — final answer]`}
        />
        <Example
          title="AgentExecutor — full agent tree auto-traced"
        >{`from langchain.agents import AgentExecutor, create_tool_calling_agent

agent = create_tool_calling_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

result = executor.invoke({"input": "What is 15% of 240? Use the calculator."})
# UI: see each LLM turn, which tools were called, tool inputs/outputs`}</Example>
        <Callout variant="tip">
          Name your tools clearly (<code className="font-mono text-sm">search_docs</code>,{' '}
          <code className="font-mono text-sm">calculator</code>) — those names appear in the trace tree and
          make multi-step agent debugging much faster.
        </Callout>
      </LessonSection>

      <LessonSection title="What you see in the LangSmith UI">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">UI element</th>
                <th className="px-4 py-3">What it shows</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Trace tree', 'Expandable hierarchy — chain → retriever → LLM → tool'],
                ['Chain steps', 'Each LCEL component as a child run with input/output JSON'],
                ['LLM calls', 'Full prompt, completion, model name, tokens, cost estimate, latency'],
                ['Retriever', 'Returned documents with content and metadata'],
                ['Tool runs', 'Tool name, arguments passed, raw return value'],
                ['Status badge', 'Success, error, or cancelled — errors show stack trace'],
              ].map(([el, shows]) => (
                <tr key={el} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{el}</td>
                  <td className="px-4 py-3 text-slate-400">{shows}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'LANGSMITH_TRACING=true traces LCEL, RAG, and AgentExecutor with no CallbackHandler for basic use.',
          'LCEL: each pipe step (prompt, llm, parser) is a child run with its own timing.',
          'RAG: retriever run shows docs; LLM run shows filled prompt and answer — ideal for debugging bad citations.',
          'Agents: alternating LLM and tool child runs mirror the ReAct Thought → Action → Observation loop.',
        ]}
      />
    </LessonArticle>
  )
}
