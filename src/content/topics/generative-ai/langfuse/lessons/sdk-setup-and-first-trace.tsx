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

export function SdkSetupAndFirstTrace() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="What you need first">
        A free Langfuse Cloud account (or a self-hosted instance). This lesson assumes Python — the most common
        setup path. JavaScript/TypeScript is covered briefly at the end.
      </Callout>

      <LessonSection title="Step 1 — Create a Langfuse project">
        <ContentStep number={1} title="Sign up at cloud.langfuse.com">
          <p className="text-slate-300">
            Create a free account and a new project (e.g. <em>my-support-bot</em>). Each project gets its own API keys
            and dashboard — keep dev and production in separate projects.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Copy your API keys">
          <p className="text-slate-300">
            In <strong className="text-white">Settings → API Keys</strong>, copy the public key and secret key. You
            will never commit these to git — store them in environment variables.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Step 2 — Set environment variables">
        <Definition term="LANGFUSE_PUBLIC_KEY / LANGFUSE_SECRET_KEY / LANGFUSE_HOST">
          <p>
            The SDK reads these automatically. <code className="font-mono text-sm">LANGFUSE_HOST</code> points to your
            Langfuse server — use <code className="font-mono text-sm">https://cloud.langfuse.com</code> for Cloud, or
            your self-hosted URL.
          </p>
        </Definition>
        <CodeBlock title=".env file (never commit this)">{`LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_HOST=https://cloud.langfuse.com`}</CodeBlock>
        <Callout variant="tip">
          On Windows PowerShell: <code className="font-mono text-sm">$env:LANGFUSE_PUBLIC_KEY="pk-lf-..."</code>. On
          Linux/macOS: <code className="font-mono text-sm">export LANGFUSE_PUBLIC_KEY=pk-lf-...</code>. Use{' '}
          <code className="font-mono text-sm">python-dotenv</code> to load a <code className="font-mono text-sm">.env</code>{' '}
          file in development.
        </Callout>
      </LessonSection>

      <LessonSection title="Step 3 — Install and initialize the Python SDK">
        <Example
          title="Install Langfuse and verify the client"
          caption="Run this once after setting env vars. If keys are wrong, you will see an auth error on the first trace flush."
        >{`pip install langfuse

from langfuse import get_client

langfuse = get_client()
# Client reads LANGFUSE_PUBLIC_KEY, LANGFUSE_SECRET_KEY, LANGFUSE_HOST automatically`}</Example>
      </LessonSection>

      <LessonSection title="Step 4 — Your first trace with @observe">
        <p className="text-slate-300">
          The <code className="font-mono text-sm">@observe</code> decorator is the fastest way to start tracing. Wrap
          any function — Langfuse records its name, inputs, outputs, duration, and errors automatically.
        </p>
        <Flowchart
          title="What @observe captures"
          chart={`flowchart LR
  A[Your function runs] --> B[@observe wraps it]
  B --> C[Trace created in Langfuse]
  C --> D[Input / output / timing logged]`}
        />
        <Example
          title="Minimal traced function"
          output="Trace visible in Langfuse dashboard within a few seconds."
        >{`from langfuse import observe, get_client

@observe()
def answer_question(question: str) -> str:
    # Your real LLM call would go here
    return f"Answer to: {question}"

result = answer_question("What is RAG?")
print(result)

# Flush pending traces before the process exits (important in scripts)
get_client().flush()`}</Example>
        <Callout variant="insight">
          One call to <code className="font-mono text-sm">answer_question</code> creates one{' '}
          <strong className="text-white">trace</strong> in Langfuse. Nested function calls decorated with{' '}
          <code className="font-mono text-sm">@observe</code> appear as child spans inside that trace — covered in
          later lessons.
        </Callout>
      </LessonSection>

      <LessonSection title="Step 5 — Find your trace in the dashboard">
        <ContentStep number={1} title="Open Tracing in the sidebar">
          <p>Go to your project → <strong className="text-white">Tracing</strong>. New traces appear within seconds.</p>
        </ContentStep>
        <ContentStep number={2} title="Click the trace row">
          <p>
            You will see the function name (<code className="font-mono text-sm">answer_question</code>), start time,
            duration, and expandable input/output JSON.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Confirm input and output">
          <p>
            Input should show <code className="font-mono text-sm">{'{"question": "What is RAG?"}'}</code> and output
            the returned string. If either is missing, check that you called{' '}
            <code className="font-mono text-sm">flush()</code> before exit.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="JavaScript / TypeScript — brief overview">
        <p className="text-slate-300">
          The JS SDK follows the same env-var pattern. Install with npm, initialize once, and use{' '}
          <code className="font-mono text-sm">observe()</code> or manual spans.
        </p>
        <Example title="Node.js quick start">{`npm install langfuse

import { Langfuse } from "langfuse";

const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  baseUrl: process.env.LANGFUSE_HOST,
});

// Or use observe() wrapper — same idea as Python @observe
await langfuse.flushAsync();`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Sign up at cloud.langfuse.com, create a project, and copy public + secret keys.',
          'Set LANGFUSE_PUBLIC_KEY, LANGFUSE_SECRET_KEY, and LANGFUSE_HOST as environment variables.',
          'pip install langfuse, then @observe() on any function to create your first trace automatically.',
          'Call get_client().flush() in scripts so traces upload before the process exits.',
          'Open Tracing in the dashboard to inspect inputs, outputs, and timing for every run.',
        ]}
      />
    </LessonArticle>
  )
}
