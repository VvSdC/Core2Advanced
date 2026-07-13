import {
  Callout,
  CodeBlock,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function OllamaVsLlamaCpp() {
  return (
    <LessonArticle>
      <LessonSection title="Two layers of the same stack">
        <p className="text-slate-300">
          <strong className="text-white">llama.cpp</strong> is the low-level C/C++ inference engine — GGUF models,
          quantization kernels, CPU/GPU backends. <strong className="text-white">Ollama</strong> wraps llama.cpp
          (and other runtimes) in a friendly app: model registry, pull UX, Modelfiles, and a local HTTP API. You are
          not choosing rivals — you are choosing abstraction level.
        </p>
        <Flowchart
          title="How Ollama relates to llama.cpp"
          chart={`flowchart TB
  U[You] --> O[Ollama CLI / API]
  O --> R[Runtime layer]
  R --> L[llama.cpp]
  R --> O2[Other backends]
  L --> G[GGUF model on disk]
  U2[Power user] --> L`}
        />
      </LessonSection>

      <LessonSection title="When to use Ollama">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Fast local prototyping</strong> —{' '}
            <code className="font-mono text-sm">ollama run llama3.2</code> in one command.
          </li>
          <li>
            <strong className="text-white">Team-friendly model sharing</strong> — pull by name, no manual GGUF
            paths.
          </li>
          <li>
            <strong className="text-white">Custom system prompts via Modelfiles</strong> — bake templates and
            parameters into a reusable tag.
          </li>
          <li>
            <strong className="text-white">OpenAI-compatible API</strong> — swap into LangChain or OpenAI SDK with
            a different base URL.
          </li>
        </ul>
        <CodeBlock title="Pull and run a model">{`# Download a model from the Ollama library
ollama pull llama3.2

# Interactive chat
ollama run llama3.2

# HTTP API (OpenAI-compatible)
curl http://localhost:11434/api/chat -d '{
  "model": "llama3.2",
  "messages": [{"role": "user", "content": "Hello!"}],
  "stream": false
}'`}</CodeBlock>
      </LessonSection>

      <LessonSection title="When to use llama.cpp directly">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Full control</strong> — every flag: context size, GPU layers, batch size,
            flash attention, RPC.
          </li>
          <li>
            <strong className="text-white">Custom GGUF models</strong> — your own quant, merged LoRA, or
            air-gapped weights Ollama does not host.
          </li>
          <li>
            <strong className="text-white">Embedded / edge</strong> — link llama.cpp as a library with no daemon.
          </li>
          <li>
            <strong className="text-white">Benchmarking and tuning</strong> —{' '}
            <code className="font-mono text-sm">llama-bench</code> and{' '}
            <code className="font-mono text-sm">llama-server</code> without Ollama overhead.
          </li>
        </ul>
        <CodeBlock title="Direct llama.cpp server">{`# Build from source, then serve a local GGUF
./llama-server \\
  -m ./models/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf \\
  -c 8192 \\
  -ngl 35 \\
  --host 0.0.0.0 \\
  --port 8080`}</CodeBlock>
      </LessonSection>

      <LessonSection title="Modelfiles — Ollama's superpower">
        <p className="text-slate-300">
          A <strong className="text-white">Modelfile</strong> is like a Dockerfile for LLMs: base model, system
          prompt, temperature, and template in one reproducible recipe.
        </p>
        <CodeBlock title="Modelfile example">{`FROM llama3.2

PARAMETER temperature 0.7
PARAMETER num_ctx 8192

SYSTEM """
You are a concise coding assistant.
Always show runnable examples.
"""`}</CodeBlock>
        <CodeBlock title="Create and use a custom model">{`ollama create my-coder -f ./Modelfile
ollama run my-coder`}</CodeBlock>
        <Callout variant="tip">
          Modelfiles are Ollama-only. In raw llama.cpp you achieve the same with chat templates, system prompts in
          your app, and server flags — more flexible, more manual.
        </Callout>
      </LessonSection>

      <LessonSection title="Pulling models — Ollama vs manual GGUF">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Task</th>
                <th className="px-4 py-3">Ollama</th>
                <th className="px-4 py-3">llama.cpp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Get Llama 3.2 8B', 'ollama pull llama3.2', 'Download GGUF from Hugging Face'],
                ['Choose quantization', 'Ollama picks bundled quant', 'You pick Q4_K_M, Q8_0, etc.'],
                ['Custom fine-tune', 'Import GGUF + Modelfile', 'Point -m at your .gguf file'],
                ['Offline / air-gapped', 'Copy Ollama blob store', 'Copy .gguf files only'],
                ['Update model', 'ollama pull again', 'Re-download or re-convert GGUF'],
              ].map(([task, ollama, llama]) => (
                <tr key={task} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{task}</td>
                  <td className="px-4 py-3 text-genai-400">{ollama}</td>
                  <td className="px-4 py-3 text-slate-400">{llama}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Callout variant="beginner">
        Start with <strong className="text-white">Ollama</strong> to learn chat flows and APIs. Drop to{' '}
        <strong className="text-white">llama.cpp</strong> when you need a specific quant, custom GGUF, embedded
        deployment, or production tuning Ollama cannot expose.
      </Callout>

      <KeyTakeaways
        items={[
          'Ollama wraps llama.cpp — it is a convenience layer, not a competing engine.',
          'Use Ollama for quick pulls, Modelfiles, and local OpenAI-compatible APIs.',
          'Use llama.cpp directly for custom GGUF, fine-grained flags, edge embed, and benchmarking.',
          'Many teams prototype with Ollama and deploy tuned llama-server for production edge cases.',
        ]}
      />
    </LessonArticle>
  )
}
