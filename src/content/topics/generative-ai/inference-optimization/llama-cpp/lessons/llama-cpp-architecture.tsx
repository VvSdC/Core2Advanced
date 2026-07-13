import {
  Callout,
  CodeBlock,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function LlamaCppArchitecture() {
  return (
    <LessonArticle>
      <Definition term="llama.cpp">
        <p>
          <strong className="text-white">llama.cpp</strong> is a C/C++ inference engine for running transformer
          LLMs locally on CPU, GPU (CUDA, Metal, Vulkan), and other backends. It reads{' '}
          <strong className="text-white">GGUF</strong> model files and exposes command-line tools for chat,
          benchmarking, and serving HTTP APIs — no Python runtime required at inference time.
        </p>
      </Definition>

      <LessonSection title="Repository layout — where things live">
        <p className="text-slate-300">
          The <a href="https://github.com/ggerganov/llama.cpp" className="text-genai-400 hover:underline">llama.cpp GitHub repo</a>{' '}
          is organized into a few top-level folders. You do not need to read all the C++ — knowing the map
          helps when debugging builds or choosing the right binary.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Folder / path</th>
                <th className="px-4 py-3">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['src/', 'Core library — model loading, tensor ops, sampling, backends (CPU/CUDA/Metal)'],
                ['common/', 'Shared CLI helpers — argument parsing, chat templates, logging utilities'],
                ['tools/', 'User-facing executables built on top of the library'],
                ['tools/main → llama-cli', 'Interactive chat and one-shot text generation'],
                ['tools/server → llama-server', 'OpenAI-compatible HTTP API server'],
                ['tools/llama-bench', 'Throughput and latency benchmarking'],
                ['ggml/', 'Low-level tensor library (matrix math, quants) used by llama.cpp'],
                ['models/', 'Example prompts and conversion scripts (not model weights)'],
              ].map(([path, purpose]) => (
                <tr key={path} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-xs text-genai-400">{path}</td>
                  <td className="px-4 py-3 text-slate-400">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          Older tutorials reference <code className="font-mono text-sm">main</code> or{' '}
          <code className="font-mono text-sm">server</code> binaries. Current builds rename them to{' '}
          <code className="font-mono text-sm">llama-cli</code> and{' '}
          <code className="font-mono text-sm">llama-server</code> — same tools, new names.
        </Callout>
      </LessonSection>

      <LessonSection title="The three tools you will actually use">
        <p className="text-slate-300">
          Most workflows touch one of three executables. Everything else (quantize, imatrix, perplexity) is
          for model preparation or diagnostics.
        </p>
        <CodeBlock title="Tool roles at a glance">{`llama-cli     # Chat, single prompts, local experimentation
llama-server  # HTTP API — drop-in for OpenAI SDK clients
llama-bench   # Measure tokens/sec across backends and quants`}</CodeBlock>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">llama-cli</strong> — loads a GGUF, tokenizes your prompt, runs the
            inference loop, prints tokens. Best for learning and quick tests.
          </li>
          <li>
            <strong className="text-white">llama-server</strong> — same engine behind a REST/WebSocket API.
            Powers local apps, IDE plugins, and agent frameworks that expect an OpenAI endpoint.
          </li>
          <li>
            <strong className="text-white">llama-bench</strong> — sweeps batch sizes and context lengths to
            compare hardware backends. Use it before and after changing quants or GPU layers.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="How the inference loop works">
        <p className="text-slate-300">
          Whether you use <code className="font-mono text-sm">llama-cli</code> or{' '}
          <code className="font-mono text-sm">llama-server</code>, every generation follows the same core loop
          inside <code className="font-mono text-sm">src/</code>:
        </p>
        <Flowchart
          title="llama.cpp inference loop"
          chart={`flowchart TD
  A[Load GGUF weights into memory] --> B[Tokenize prompt text]
  B --> C[Prefill: process all prompt tokens in parallel]
  C --> D[Fill KV cache with Keys and Values]
  D --> E[Sample next token from logits]
  E --> F{Stop condition?}
  F -->|EOS or max tokens| G[Return completed text]
  F -->|Continue| H[Decode: forward pass for 1 new token]
  H --> I[Append K,V to cache]
  I --> E`}
        />
        <p className="mt-4 text-slate-300">
          <strong className="text-white">Prefill</strong> is fast because prompt tokens run in parallel.
          <strong className="text-white"> Decode</strong> generates one token at a time — this is the
          &quot;typing&quot; phase you see in chat UIs. The KV cache makes decode efficient by avoiding
          recomputation of past tokens.
        </p>
      </LessonSection>

      <LessonSection title="Backends and hardware abstraction">
        <p className="text-slate-300">
          The same GGUF file runs on different hardware by selecting a <strong className="text-white">backend</strong>{' '}
          at build time. CMake flags enable CUDA (NVIDIA), Metal (Apple Silicon), Vulkan, or pure CPU (with
          AVX/ARM NEON optimizations).
        </p>
        <CodeBlock title="Offload layers to GPU">{`# Run with 35 transformer layers on GPU, rest on CPU
llama-cli -m model.gguf -ngl 35 -p "Hello"`}</CodeBlock>
        <Callout variant="beginner" title="ngl = number of GPU layers">
          <code className="font-mono text-sm">-ngl</code> (or <code className="font-mono text-sm">--n-gpu-layers</code>)
          controls how many layers live on the GPU. More layers → faster inference but more VRAM. Set to{' '}
          <code className="font-mono text-sm">99</code> to offload everything that fits.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'llama.cpp is a C/C++ engine: src/ is the core, common/ shares CLI code, tools/ builds executables.',
          'llama-cli for chat, llama-server for HTTP APIs, llama-bench for performance measurement.',
          'Inference = load GGUF → prefill prompt → decode tokens one-by-one using KV cache.',
          'Use -ngl to split work between GPU and CPU; higher ngl is faster when VRAM allows.',
        ]}
      />
    </LessonArticle>
  )
}
