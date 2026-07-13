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

export function LlamaServerBasics() {
  return (
    <LessonArticle>
      <Definition term="llama-server">
        <p>
          <code className="font-mono text-sm">llama-server</code> is the HTTP server built into llama.cpp. It loads a
          GGUF model once, keeps it in memory, and answers requests over REST — so you can call your local model from
          curl, a browser app, or any OpenAI-compatible client instead of typing into the CLI each time.
        </p>
      </Definition>

      <LessonSection title="Start the server">
        <p className="text-slate-300">
          After building llama.cpp, run <code className="font-mono text-sm">llama-server</code> with a GGUF file path.
          Use <code className="font-mono text-sm">--host</code> to choose which network interface to bind and{' '}
          <code className="font-mono text-sm">--port</code> for the TCP port.
        </p>
        <Example title="Basic server startup">{`# Listen on all interfaces, port 8080
./llama-server \\
  -m models/Meta-Llama-3-8B-Instruct-Q4_K_M.gguf \\
  --host 0.0.0.0 \\
  --port 8080 \\
  -c 4096 \\
  -ngl 35`}</Example>
        <CodeBlock title="Common binding choices">{`--host 127.0.0.1   # localhost only — safest for dev
--host 0.0.0.0     # accept connections from other machines on your LAN
--port 8080        # default is often 8080; pick any free port`}</CodeBlock>
        <Callout variant="tip">
          Wait until the log shows the model finished loading and the server is listening. First startup can take a
          minute while weights are read from disk into RAM or VRAM.
        </Callout>
      </LessonSection>

      <LessonSection title="Chat completions endpoint">
        <p className="text-slate-300">
          The main endpoint is{' '}
          <code className="font-mono text-sm">POST /v1/chat/completions</code>. Send a JSON body with a{' '}
          <code className="font-mono text-sm">messages</code> array — same shape as OpenAI&apos;s Chat Completions
          API.
        </p>
        <Example title="Non-streaming chat request">{`curl http://localhost:8080/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is GGUF in one sentence?"}
    ],
    "temperature": 0.7,
    "max_tokens": 128
  }'`}</Example>
        <p className="mt-4 text-slate-300">
          The response is a single JSON object with the full assistant message in{' '}
          <code className="font-mono text-sm">choices[0].message.content</code>. Use this when you want the complete
          answer before doing anything else.
        </p>
      </LessonSection>

      <LessonSection title="Streaming with Server-Sent Events (SSE)">
        <p className="text-slate-300">
          Set <code className="font-mono text-sm">&quot;stream&quot;: true</code> to receive tokens as they are
          generated. The server sends <strong className="text-white">Server-Sent Events</strong> — each line is a
          small JSON chunk with a piece of the reply.
        </p>
        <Flowchart
          title="Streaming response flow"
          chart={`flowchart LR
  A[Client POST /v1/chat/completions] --> B[llama-server]
  B --> C[Prefill prompt]
  C --> D[Generate token 1]
  D --> E[SSE chunk to client]
  E --> F[Generate token 2]
  F --> G[More SSE chunks]
  G --> H[data: [DONE]]`}
        />
        <Example title="Streaming curl request">{`curl http://localhost:8080/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama",
    "messages": [{"role": "user", "content": "Count from 1 to 5."}],
    "stream": true
  }'`}</Example>
        <CodeBlock title="What SSE output looks like">{`data: {"choices":[{"delta":{"content":"1"}}]}

data: {"choices":[{"delta":{"content":","}}]}

data: {"choices":[{"delta":{"content":" 2"}}]}

data: [DONE]`}</CodeBlock>
        <Callout variant="beginner" title="Why stream?">
          Streaming lets UIs show text word-by-word while the model is still thinking. Time to first token feels
          much faster even when total generation time is the same.
        </Callout>
      </LessonSection>

      <LessonSection title="Other useful endpoints">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <code className="font-mono text-sm">GET /health</code> — quick check that the process is alive.
          </li>
          <li>
            <code className="font-mono text-sm">GET /v1/models</code> — lists the loaded model id for clients that
            validate model names.
          </li>
          <li>
            <code className="font-mono text-sm">POST /v1/completions</code> — legacy text completion (single prompt
            string, no chat roles).
          </li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'llama-server exposes an HTTP API so apps can talk to a loaded GGUF model without the CLI.',
          'Use --host and --port to control where the server listens (127.0.0.1 for local-only, 0.0.0.0 for LAN).',
          'POST /v1/chat/completions accepts OpenAI-style messages JSON for chat.',
          'Set stream: true to receive tokens incrementally via Server-Sent Events (SSE).',
        ]}
      />
    </LessonArticle>
  )
}
