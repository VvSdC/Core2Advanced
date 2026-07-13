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

export function SetupAndTracing() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="What you need first">
        A free LangSmith account and a LangChain app (even a one-line chain). No SDK install required for
        basic LangChain tracing — environment variables do the work.
      </Callout>

      <LessonSection title="Step 1 — Sign up and create a project">
        <ContentStep number={1} title="Create an account at smith.langchain.com">
          <p className="text-slate-300">
            Go to <strong className="text-white">smith.langchain.com</strong> and sign up (Google, GitHub, or
            email). The free Developer plan is enough to start tracing.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Create a project">
          <p className="text-slate-300">
            In the sidebar, create a project — e.g. <em>my-rag-bot-dev</em>. Each project has its own trace
            history. Use separate projects for dev vs production.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Copy your API key">
          <p className="text-slate-300">
            Open <strong className="text-white">Settings → API Keys</strong> and create a key. Store it in
            environment variables — never commit it to git.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Step 2 — Set three environment variables">
        <Definition term="LANGSMITH_TRACING / LANGSMITH_API_KEY / LANGSMITH_PROJECT">
          <p>
            These three env vars turn on automatic tracing for LangChain apps. Set them once in your shell,
            <code className="font-mono text-sm">.env</code> file, or deployment config.
          </p>
        </Definition>

        <CodeBlock title=".env file (never commit this)">{`LANGSMITH_TRACING=true
LANGSMITH_API_KEY=lsv2_pt_...
LANGSMITH_PROJECT=my-rag-bot-dev`}</CodeBlock>

        <div className="mt-4 space-y-2 text-sm text-slate-400">
          <p>
            <code className="font-mono text-sm">LANGSMITH_TRACING=true</code> — master switch; must be the string{' '}
            <code className="font-mono text-sm">"true"</code>
          </p>
          <p>
            <code className="font-mono text-sm">LANGSMITH_API_KEY</code> — authenticates your app to LangSmith
          </p>
          <p>
            <code className="font-mono text-sm">LANGSMITH_PROJECT</code> — routes traces to the named project
            (defaults to <code className="font-mono text-sm">default</code> if omitted)
          </p>
        </div>

        <Callout variant="tip">
          On Windows PowerShell:{' '}
          <code className="font-mono text-sm">$env:LANGSMITH_TRACING="true"</code>. On Linux/macOS:{' '}
          <code className="font-mono text-sm">export LANGSMITH_TRACING=true</code>. Use{' '}
          <code className="font-mono text-sm">python-dotenv</code> to load a <code className="font-mono text-sm">.env</code>{' '}
          file in development.
        </Callout>
      </LessonSection>

      <LessonSection title="Step 3 — Run any LangChain chain">
        <p className="text-slate-300">
          With env vars set, <strong className="text-white">every LangChain invoke automatically sends traces</strong>{' '}
          to LangSmith. No CallbackHandler, no decorators — just run your existing code.
        </p>
        <Flowchart
          title="What happens on chain.invoke()"
          chart={`flowchart LR
  A[chain.invoke input] --> B[LangChain runs pipeline]
  B --> C[LangSmith client auto-records runs]
  C --> D[Trace appears in dashboard]`}
        />
        <Example
          title="Minimal chain — first trace in under a minute"
          output="Trace visible at smith.langchain.com within seconds."
        >{`from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

# Env vars already set: LANGSMITH_TRACING, LANGSMITH_API_KEY, LANGSMITH_PROJECT

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    ("human", "{question}"),
])
llm = ChatOpenAI(model="gpt-4o-mini")
chain = prompt | llm

result = chain.invoke({"question": "What is LangSmith?"})
print(result.content)
# → Check smith.langchain.com → your project → Traces`}</Example>
      </LessonSection>

      <LessonSection title="Step 4 — Find your trace in the dashboard">
        <ContentStep number={1} title="Open your project">
          <p>
            Go to <strong className="text-white">smith.langchain.com</strong> → select your project →{' '}
            <strong className="text-white">Traces</strong> (or Runs).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Click the newest trace">
          <p>
            You should see a trace from your <code className="font-mono text-sm">chain.invoke</code> call.
            Expand the tree: prompt formatting → LLM call with full prompt and completion.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Verify inputs and outputs">
          <p>
            Input shows <code className="font-mono text-sm">{'{"question": "What is LangSmith?"}'}</code>. The
            LLM child run shows token usage, latency, and the model response. If nothing appears, double-check
            that <code className="font-mono text-sm">LANGSMITH_TRACING=true</code> (not{' '}
            <code className="font-mono text-sm">1</code> or <code className="font-mono text-sm">True</code>).
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Optional — endpoint for EU or custom deployments">
        <CodeBlock title="Additional env var if needed">{`# Default is https://api.smith.langchain.com
LANGSMITH_ENDPOINT=https://api.smith.langchain.com`}</CodeBlock>
        <p className="mt-2 text-sm text-slate-400">
          Most users never need to set this. Only change it if LangChain docs specify a regional endpoint for
          your account.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Sign up at smith.langchain.com, create a project, and copy an API key.',
          'Set LANGSMITH_TRACING=true, LANGSMITH_API_KEY, and LANGSMITH_PROJECT in your environment.',
          'Run any LangChain chain — traces appear automatically with zero code changes.',
          'Open Traces in the dashboard to inspect the run tree, prompts, tokens, and latency.',
        ]}
      />
    </LessonArticle>
  )
}
