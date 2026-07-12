import {
  Callout,
  ContentStep,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ChainsAndLcel() {
  return (
    <LessonArticle>
      <LessonSection title="What is LCEL?">
        <p>
          <strong className="text-white">LangChain Expression Language (LCEL)</strong> lets you compose components
          with the pipe operator <code className="font-mono text-sm">|</code>. Output of the left component feeds
          into the right — like Unix pipes, but for LLM pipelines.
        </p>
        <Flowchart
          title="LCEL pipe chain"
          chart={`flowchart LR
  A[Input dict] --> B[Prompt Template]
  B --> C[Chat Model]
  C --> D[Output Parser]
  D --> E[Structured result]`}
        />
      </LessonSection>

      <LessonSection title="Basic chain">
        <Example
          title="prompt | model"
          output="Recursion is when a function calls itself..."
        >{`from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a concise tutor."),
    ("human", "{topic}"),
])

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# The chain: input dict → formatted prompt → model response
chain = prompt | llm

result = chain.invoke({"topic": "Explain recursion in one paragraph"})
print(result.content)`}</Example>
      </LessonSection>

      <LessonSection title="RunnableParallel — fan out">
        <ContentStep number={1} title="Run multiple branches on the same input">
          <Example
            title="Generate summary and keywords in parallel"
          >{`from langchain_core.runnables import RunnableParallel

chain = RunnableParallel(
    summary=prompt | llm,
    keywords=keyword_prompt | llm,
)

result = chain.invoke({"text": "Long article about climate change..."})
print(result["summary"].content)
print(result["keywords"].content)`}</Example>
        </ContentStep>
      </LessonSection>

      <LessonSection title="RunnablePassthrough — pass data through">
        <ContentStep number={1} title="Keep original input alongside transformed data">
          <p>
            Essential for RAG: pass the user's question through while a parallel branch retrieves context.
          </p>
          <Example
            title="Passthrough in a dict chain"
          >{`from langchain_core.runnables import RunnablePassthrough

chain = (
    {
        "context": retriever,           # fetches relevant docs
        "question": RunnablePassthrough(),  # passes input unchanged
    }
    | prompt
    | llm
)

# invoke("What is the refund policy?")
# → {"context": [docs...], "question": "What is the refund policy?"}
# → prompt fills both variables → model generates answer`}</Example>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Why LCEL over plain functions">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Streaming</strong> — every LCEL chain supports .stream() automatically.</li>
          <li><strong className="text-white">Async</strong> — .ainvoke() and .astream() work without extra code.</li>
          <li><strong className="text-white">Batching</strong> — .batch() runs multiple inputs in parallel.</li>
          <li><strong className="text-white">Observability</strong> — LangSmith traces every step in the pipe.</li>
        </ul>
        <Callout variant="insight">
          LCEL replaced the older <code className="font-mono text-sm">LLMChain</code> class. Always use LCEL
          (<code className="font-mono text-sm">prompt | llm</code>) in new code.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'LCEL composes components with the | pipe operator.',
          'RunnableParallel fans out; RunnablePassthrough keeps original input.',
          'Every LCEL chain gets .invoke(), .stream(), .batch(), and .ainvoke() for free.',
          'The RAG chain in the next lessons uses this exact passthrough pattern.',
        ]}
      />
    </LessonArticle>
  )
}
