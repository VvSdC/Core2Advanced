import {
  Callout,
  CodeBlock,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function OpenaiApiAndIntegrations() {
  return (
    <LessonArticle>
      <Definition term="OpenAI-compatible API">
        <p>
          llama-server implements the same REST paths OpenAI documents —{' '}
          <code className="font-mono text-sm">/v1/chat/completions</code>,{' '}
          <code className="font-mono text-sm">/v1/completions</code>, and{' '}
          <code className="font-mono text-sm">/v1/models</code>. Point any tool that speaks OpenAI at{' '}
          <code className="font-mono text-sm">http://localhost:8080/v1</code> and it will talk to your local GGUF
          model instead of OpenAI&apos;s cloud.
        </p>
      </Definition>

      <LessonSection title="Start llama-server for integrations">
        <Example title="Server ready for clients">{`./llama-server \\
  -m models/Mistral-7B-Instruct-v0.2-Q4_K_M.gguf \\
  --host 0.0.0.0 \\
  --port 8080 \\
  -c 8192 \\
  -ngl 99`}</Example>
        <Callout variant="tip">
          The <code className="font-mono text-sm">model</code> field in requests can often be any string — some
          clients require a value even though llama-server serves only the one loaded file. Check{' '}
          <code className="font-mono text-sm">GET /v1/models</code> for the advertised id.
        </Callout>
      </LessonSection>

      <LessonSection title="Test with curl">
        <p className="text-slate-300">
          curl is the fastest way to confirm the API works before wiring up Python or LangChain. No API key is
          required by default — add a dummy <code className="font-mono text-sm">Authorization</code> header only if
          your client insists on one.
        </p>
        <Example title="Chat completion via curl">{`curl http://localhost:8080/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "mistral",
    "messages": [
      {"role": "user", "content": "Explain quantization in two sentences."}
    ],
    "temperature": 0.7,
    "max_tokens": 150
  }'`}</Example>
        <CodeBlock title="List models (sanity check)">{`curl http://localhost:8080/v1/models`}</CodeBlock>
      </LessonSection>

      <LessonSection title="Python OpenAI SDK with base_url">
        <p className="text-slate-300">
          The official <code className="font-mono text-sm">openai</code> Python package works unchanged — set{' '}
          <code className="font-mono text-sm">base_url</code> to your llama-server and use any string as{' '}
          <code className="font-mono text-sm">api_key</code>.
        </p>
        <Example
          title="OpenAI SDK → local llama-server"
          output={`Quantization reduces model weight precision (e.g. 4-bit instead of 16-bit) so the same model fits in less memory with a small quality trade-off.`}
        >{`from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8080/v1",
    api_key="not-needed",
)

response = client.chat.completions.create(
    model="mistral",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is llama.cpp used for?"},
    ],
    temperature=0.7,
    max_tokens=200,
)

print(response.choices[0].message.content)`}</Example>
        <CodeBlock title="Streaming with the same client">{`stream = client.chat.completions.create(
    model="mistral",
    messages=[{"role": "user", "content": "List three benefits of local inference."}],
    stream=True,
)

for chunk in stream:
    delta = chunk.choices[0].delta.content
    if delta:
        print(delta, end="", flush=True)`}</CodeBlock>
      </LessonSection>

      <LessonSection title="LangChain ChatOpenAI">
        <Flowchart
          title="One config change, same chain"
          chart={`flowchart LR
  A[LangChain app] --> B[ChatOpenAI]
  B --> C{openai_api_base}
  C -->|api.openai.com| D[OpenAI cloud]
  C -->|localhost:8080/v1| E[llama-server]`}
        />
        <p className="mt-4 text-slate-300">
          LangChain&apos;s <code className="font-mono text-sm">ChatOpenAI</code> uses the OpenAI REST format under
          the hood. Swap the base URL and your chains, agents, and RAG pipelines keep working.
        </p>
        <Example title="LangChain pointed at llama-server">{`from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="mistral",
    openai_api_base="http://localhost:8080/v1",
    openai_api_key="not-needed",
    temperature=0.7,
)

response = llm.invoke("Summarize GGUF in one paragraph.")
print(response.content)`}</Example>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Dev/prod parity</strong> — develop locally against llama-server, deploy
            the same LangChain code with a different <code className="font-mono text-sm">openai_api_base</code>.
          </li>
          <li>
            <strong className="text-white">Ecosystem compatibility</strong> — LiteLLM, observability tools, and eval
            frameworks that expect OpenAI work with minimal changes.
          </li>
        </ul>
        <Callout variant="beginner" title="Connection errors?">
          Confirm llama-server is running, the port matches, and firewalls allow localhost traffic. Test with curl
          before debugging LangChain.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'llama-server exposes OpenAI-compatible endpoints at http://localhost:8080/v1.',
          'Test with curl first — same JSON shape as OpenAI chat completions.',
          'Point the OpenAI Python SDK at base_url="http://localhost:8080/v1" with any api_key.',
          'LangChain ChatOpenAI works by changing openai_api_base — no chain rewrite needed.',
        ]}
      />
    </LessonArticle>
  )
}
