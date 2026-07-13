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

export function OpenaiCompatibleServer() {
  return (
    <LessonArticle>
      <Definition term="OpenAI-compatible API">
        <p>
          vLLM exposes an HTTP server that mimics OpenAI's{' '}
          <code className="font-mono text-sm">/v1/chat/completions</code> and{' '}
          <code className="font-mono text-sm">/v1/completions</code> endpoints. Point any OpenAI SDK or tool at{' '}
          <code className="font-mono text-sm">http://localhost:8000/v1</code> with a dummy API key — your requests
          hit your own GPU instead of OpenAI's cloud.
        </p>
      </Definition>

      <LessonSection title="Start the server">
        <p className="text-slate-300">
          Modern vLLM uses the <code className="font-mono text-sm">vllm serve</code> CLI. Older tutorials reference{' '}
          <code className="font-mono text-sm">python -m vllm.entrypoints.openai.api_server</code> — both start the
          same OpenAI-compatible API.
        </p>
        <Example title="vllm serve (recommended)">{`# Default: http://0.0.0.0:8000
vllm serve mistralai/Mistral-7B-Instruct-v0.3 \\
  --host 0.0.0.0 \\
  --port 8000 \\
  --max-model-len 4096`}</Example>
        <CodeBlock title="Legacy module form (still works)">{`python -m vllm.entrypoints.openai.api_server \\
  --model mistralai/Mistral-7B-Instruct-v0.3 \\
  --host 0.0.0.0 \\
  --port 8000`}</CodeBlock>
        <Callout variant="tip">
          Wait until you see <code className="font-mono text-sm">Uvicorn running on http://0.0.0.0:8000</code> and
          the model finished loading. First startup downloads weights and can take several minutes.
        </Callout>
      </LessonSection>

      <LessonSection title="Test with curl">
        <p className="text-slate-300">
          No SDK required — send JSON to the same shape OpenAI documents. The{' '}
          <code className="font-mono text-sm">model</code> field can match the served model name or be ignored
          depending on vLLM version; using the HF model id is safest.
        </p>
        <Example title="Chat completion via curl">{`curl http://localhost:8000/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer dummy-key" \\
  -d '{
    "model": "mistralai/Mistral-7B-Instruct-v0.3",
    "messages": [
      {"role": "user", "content": "Explain PagedAttention in one paragraph."}
    ],
    "temperature": 0.7,
    "max_tokens": 150
  }'`}</Example>
        <CodeBlock title="List models (sanity check)">{`curl http://localhost:8000/v1/models \\
  -H "Authorization: Bearer dummy-key"`}</CodeBlock>
      </LessonSection>

      <LessonSection title="Test with the OpenAI Python client">
        <p className="text-slate-300">
          Set <code className="font-mono text-sm">base_url</code> to your local server and use any string as{' '}
          <code className="font-mono text-sm">api_key</code>. The rest of the code is identical to calling OpenAI.
        </p>
        <Example
          title="OpenAI SDK → local vLLM"
          output={`PagedAttention stores KV cache in non-contiguous memory pages, like virtual memory in an OS...`}
        >{`from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="not-needed",  # vLLM does not validate by default
)

response = client.chat.completions.create(
    model="mistralai/Mistral-7B-Instruct-v0.3",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is vLLM used for?"},
    ],
    temperature=0.7,
    max_tokens=200,
)

print(response.choices[0].message.content)`}</Example>
        <CodeBlock title="Streaming (same as OpenAI)">{`stream = client.chat.completions.create(
    model="mistralai/Mistral-7B-Instruct-v0.3",
    messages=[{"role": "user", "content": "Count from 1 to 5."}],
    stream=True,
)

for chunk in stream:
    delta = chunk.choices[0].delta.content
    if delta:
        print(delta, end="", flush=True)`}</CodeBlock>
      </LessonSection>

      <LessonSection title="Why this matters for LangChain">
        <Flowchart
          title="Swap cloud for self-hosted in one line"
          chart={`flowchart LR
  A[LangChain app] --> B[ChatOpenAI]
  B --> C{base_url}
  C -->|api.openai.com| D[OpenAI cloud]
  C -->|localhost:8000/v1| E[vLLM on your GPU]`}
        />
        <p className="mt-4 text-slate-300">
          LangChain's <code className="font-mono text-sm">ChatOpenAI</code> (and many other frameworks) speak the
          OpenAI REST format. Self-hosting with vLLM means you change{' '}
          <strong className="text-white">one config block</strong> — not your chains, agents, or RAG pipeline.
        </p>
        <Example title="LangChain pointed at vLLM">{`from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="mistralai/Mistral-7B-Instruct-v0.3",
    openai_api_base="http://localhost:8000/v1",
    openai_api_key="not-needed",
    temperature=0.7,
)

response = llm.invoke("Summarize continuous batching in two sentences.")
print(response.content)`}</Example>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Dev/prod parity</strong> — develop against vLLM locally, ship the same
            LangChain code to staging with a different <code className="font-mono text-sm">base_url</code>.
          </li>
          <li>
            <strong className="text-white">No vendor lock-in</strong> — swap OpenAI, vLLM, or another compatible
            server (TGI, llama.cpp server) by changing the endpoint.
          </li>
          <li>
            <strong className="text-white">Ecosystem compatibility</strong> — tools built for OpenAI (eval
            frameworks, observability, LiteLLM routers) work with minimal changes.
          </li>
        </ul>
        <Callout variant="beginner" title="Model name must match">
          Pass the same model string your server loaded. If serve fails with "model not found" from LangChain,
          check <code className="font-mono text-sm">GET /v1/models</code> for the exact id vLLM advertises.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Start with vllm serve <model> or python -m vllm.entrypoints.openai.api_server.',
          'API lives at http://localhost:8000/v1 — test with curl or OpenAI Python client + base_url.',
          'OpenAI-compatible endpoints let LangChain ChatOpenAI work unchanged against your own GPU.',
          'Streaming, temperature, and max_tokens behave like the real OpenAI API.',
        ]}
      />
    </LessonArticle>
  )
}
