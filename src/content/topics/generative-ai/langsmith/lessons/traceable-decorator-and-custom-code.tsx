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

export function TraceableDecoratorAndCustomCode() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="When you need this">
        LangChain auto-tracing covers chains and graphs. Use <code className="font-mono text-sm">@traceable</code>{' '}
        when you have <strong className="text-white">plain Python functions</strong> — custom RAG helpers, API
        wrappers, or non-LangChain LLM calls — that still need to appear in LangSmith.
      </Callout>

      <LessonSection title="@traceable — trace any Python function">
        <Definition term="@traceable">
          <p>
            The <code className="font-mono text-sm">@traceable</code> decorator from the{' '}
            <code className="font-mono text-sm">langsmith</code> package wraps any function so LangSmith records
            its name, inputs, outputs, duration, and errors — even outside LangChain.
          </p>
        </Definition>
        <Flowchart
          title="@traceable capture flow"
          chart={`flowchart LR
  A[Your function runs] --> B[@traceable wraps it]
  B --> C[Run created in LangSmith]
  C --> D[Nested calls = child runs]`}
        />
        <Example
          title="Install and apply @traceable"
        >{`pip install langsmith

from langsmith import traceable

@traceable(name="answer_question")
def answer_question(question: str) -> str:
    context = retrieve_docs(question)   # child run if also @traceable
    return generate_answer(context, question)

result = answer_question("What is our refund policy?")
# Trace appears in LangSmith with answer_question as root run`}</Example>
      </LessonSection>

      <LessonSection title="Wrap RAG functions — full pipeline visibility">
        <p className="text-slate-300">
          Split your RAG pipeline into named functions and decorate each one. Nested{' '}
          <code className="font-mono text-sm">@traceable</code> calls automatically become{' '}
          <strong className="text-white">child runs</strong> — you get a tree even without LangChain.
        </p>
        <Example
          title="RAG pipeline with nested @traceable functions"
        >{`from langsmith import traceable
from openai import OpenAI

client = OpenAI()

@traceable(run_type="retriever", name="vector_search")
def retrieve_docs(query: str, k: int = 5) -> list[str]:
    # your vector DB lookup
    return ["Doc chunk 1...", "Doc chunk 2..."]

@traceable(run_type="llm", name="generate_answer")
def generate_answer(context: list[str], question: str) -> str:
    prompt = f"Context:\\n{context}\\n\\nQuestion: {question}"
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content

@traceable(name="rag_pipeline")
def run_rag(question: str) -> str:
    docs = retrieve_docs(question)       # child: vector_search
    return generate_answer(docs, question)  # child: generate_answer

answer = run_rag("How do I cancel my subscription?")
# UI tree: rag_pipeline → vector_search → generate_answer`}</Example>
        <Callout variant="insight">
          Use <code className="font-mono text-sm">run_type</code> on each decorator (
          <code className="font-mono text-sm">retriever</code>, <code className="font-mono text-sm">llm</code>,{' '}
          <code className="font-mono text-sm">tool</code>) so runs get the right icon and filters in the UI.
        </Callout>
      </LessonSection>

      <LessonSection title="Wrap custom tools">
        <p className="text-slate-300">
          Standalone tool functions — database lookups, API calls, calculators — benefit from{' '}
          <code className="font-mono text-sm">@traceable(run_type="tool")</code>. When an agent calls them, you
          see exact arguments and return values in the trace.
        </p>
        <Example
          title="Custom tool with @traceable"
        >{`@traceable(run_type="tool", name="lookup_order")
def lookup_order(order_id: str) -> dict:
    row = db.fetch_one("SELECT * FROM orders WHERE id = %s", order_id)
    return {"status": row["status"], "total": row["total"]}

@traceable(name="handle_support_ticket")
def handle_support_ticket(ticket: str) -> str:
    # parse order_id from ticket, call tool, call LLM...
    order = lookup_order("ORD-12345")
    return f"Order status: {order['status']}"`}</Example>
      </LessonSection>

      <LessonSection title="OpenAI wrapper — automatic LLM tracing">
        <p className="text-slate-300">
          LangSmith provides a drop-in OpenAI client wrapper that traces every completion automatically — no
          manual logging of prompts or tokens.
        </p>
        <ContentStep number={1} title="Wrap the OpenAI client">
          <Example
            title="langsmith.wrappers.wrap_openai"
          >{`from openai import OpenAI
from langsmith import wrappers

client = wrappers.wrap_openai(OpenAI())

# Every chat.completions.create call is traced as an llm run
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Hello!"}],
)
print(response.choices[0].message.content)
# Full prompt, completion, tokens appear in LangSmith`}</Example>
        </ContentStep>
        <ContentStep number={2} title="Combine with @traceable">
          <p>
            Wrap the client for LLM calls, and use <code className="font-mono text-sm">@traceable</code> on
            higher-level functions. The tree shows your business logic as the parent and the OpenAI call as a
            child LLM run.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Environment variables still apply">
        <p className="text-slate-300">
          <code className="font-mono text-sm">@traceable</code> and{' '}
          <code className="font-mono text-sm">wrap_openai</code> use the same{' '}
          <code className="font-mono text-sm">LANGSMITH_API_KEY</code> and{' '}
          <code className="font-mono text-sm">LANGSMITH_PROJECT</code> as LangChain tracing. Set{' '}
          <code className="font-mono text-sm">LANGSMITH_TRACING=true</code> to enable all LangSmith instrumentation.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          '@traceable from langsmith traces any Python function — inputs, outputs, timing, errors.',
          'Nest decorators on RAG steps (retrieve, generate) to build a trace tree without LangChain.',
          'Use run_type="tool" | "retriever" | "llm" for correct UI categorisation.',
          'wrappers.wrap_openai() auto-traces raw OpenAI calls with full prompt and token capture.',
        ]}
      />
    </LessonArticle>
  )
}
