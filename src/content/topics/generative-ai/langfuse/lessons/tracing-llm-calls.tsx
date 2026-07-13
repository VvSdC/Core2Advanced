import {
  Callout,
  CodeBlock,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function TracingLlmCalls() {
  return (
    <LessonArticle>
      <LessonSection title="Span vs generation — use the right type">
        <p className="text-slate-300">
          Not every step calls an LLM. Langfuse has two observation types you will use constantly:
        </p>
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Span — any logical step</p>
            <p className="mt-1 text-sm text-slate-400">
              Retrieval, embedding, parsing, database lookups, API calls. Use{' '}
              <code className="font-mono text-sm">@observe()</code> (default) or{' '}
              <code className="font-mono text-sm">as_type=&quot;span&quot;</code>.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Generation — an LLM completion</p>
            <p className="mt-1 text-sm text-slate-400">
              Chat completions, text generation, any model API call. Use{' '}
              <code className="font-mono text-sm">@observe(as_type=&quot;generation&quot;)</code>. Langfuse tracks
              model name, prompt, completion, tokens, and cost automatically.
            </p>
          </div>
        </div>
        <Flowchart
          title="Typical call hierarchy"
          chart={`flowchart TB
  T[Trace: handle_user_query]
  T --> S1[Span: build_context]
  T --> G1[Generation: gpt-4o-mini]
  G1 --> S2[Span: parse_json_response]`}
        />
      </LessonSection>

      <Definition term="What a generation captures">
        <p>
          Model name, full input messages, completion text,{' '}
          <strong className="text-white">input tokens</strong>,{' '}
          <strong className="text-white">output tokens</strong>, latency, and estimated{' '}
          <strong className="text-white">cost</strong>. This is why you always mark LLM calls as generations — not
          generic spans.
        </p>
      </Definition>

      <LessonSection title="Tracing an LLM call with @observe">
        <Example
          title="Generation decorator on an LLM function"
          output="Dashboard shows model, tokens, and cost on the generation row."
        >{`from langfuse import observe
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

@observe(as_type="generation")
def call_llm(prompt: str) -> str:
  response = llm.invoke(prompt)
  return response.content

@observe()
def handle_query(user_message: str) -> str:
  # Span wraps the whole handler; generation is a child observation
  return call_llm(f"Answer concisely: {user_message}")`}</Example>
        <Callout variant="tip">
          The outer <code className="font-mono text-sm">@observe()</code> creates a span for the handler. The inner{' '}
          <code className="font-mono text-sm">@observe(as_type=&quot;generation&quot;)</code> creates a generation
          child — you get a proper tree in the dashboard.
        </Callout>
      </LessonSection>

      <LessonSection title="Manual generation with explicit fields">
        <p className="text-slate-300">
          When you call an API directly (not via a decorator), use the client to start a generation and update it
          with model metadata and token usage.
        </p>
        <Example
          title="OpenAI call with manual token logging"
        >{`from langfuse import get_client, observe
from openai import OpenAI

langfuse = get_client()
openai_client = OpenAI()

@observe()
def summarize(text: str) -> str:
    with langfuse.start_as_current_observation(
        as_type="generation",
        name="summarize-text",
        model="gpt-4o-mini",
        input={"text": text[:200]},
    ) as generation:
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": f"Summarize: {text}"}],
            temperature=0,
        )
        output = response.choices[0].message.content
        usage = response.usage

        generation.update(
            output=output,
            usage_details={
                "input": usage.prompt_tokens,
                "output": usage.completion_tokens,
            },
        )
        return output`}</Example>
      </LessonSection>

      <LessonSection title="Token usage and cost tracking">
        <ContentStep number={1} title="Tokens appear on every generation">
          <p>
            Input tokens (prompt) and output tokens (completion) are logged per call. The dashboard aggregates cost
            by model, user, and time range.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Find expensive endpoints">
          <p>
            Go to <strong className="text-white">Analytics</strong> → filter by model or trace name. A RAG endpoint
            using GPT-4o for simple lookups will stand out immediately.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Log inference parameters">
          <p>
            Temperature, max_tokens, and top_p affect both quality and cost. Attach them as generation metadata so
            you can correlate bad answers with specific settings — see the{' '}
            <em>Inference Parameters</em> lessons for what each knob does.
          </p>
          <CodeBlock title="Attach inference params to a generation">{`generation.update(
    metadata={
        "temperature": 0.7,
        "max_tokens": 500,
        "top_p": 0.9,
    }
)`}</CodeBlock>
        </ContentStep>
      </LessonSection>

      <Callout variant="insight" title="Link to Inference Parameters">
        If a trace shows high output tokens and a truncated answer, check{' '}
        <em>Max Tokens</em> in the Inference Parameters sub-topic. If answers are too random, compare{' '}
        <em>Temperature</em> and <em>Top-p</em> values across traces in Langfuse.
      </Callout>

      <KeyTakeaways
        items={[
          'Use generation for LLM calls, span for everything else (retrieval, parsing, APIs).',
          '@observe(as_type="generation") is the simplest way to trace LangChain or direct API calls.',
          'Log usage_details (input/output tokens) so Langfuse can calculate cost per call.',
          'Attach temperature, max_tokens, and top_p as metadata to debug quality vs cost tradeoffs.',
          'Analytics dashboard aggregates spend — find which endpoints burn the most tokens.',
        ]}
      />
    </LessonArticle>
  )
}
