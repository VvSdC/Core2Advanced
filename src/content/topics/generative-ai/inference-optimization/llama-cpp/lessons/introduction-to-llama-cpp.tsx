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
} from '../../../../../../components/content'

export function IntroductionToLlamaCpp() {
  return (
    <LessonArticle>
      <Definition term="llama.cpp">
        <p>
          <strong className="text-white">llama.cpp</strong> is an open-source C/C++ project for running large
          language model inference efficiently on everyday hardware. Created by{' '}
          <strong className="text-white">Georgi Gerganov</strong>, it proved that useful LLM chat does not require
          Python, PyTorch, or a datacenter — just a well-optimized native binary and a GGUF model file.
        </p>
        <p>
          It is both a <em>library</em> (embed in apps) and a <em>toolkit</em> (CLI servers and chat binaries most
          users run from the terminal).
        </p>
      </Definition>

      <Callout variant="beginner" title="You are ready if">
        You understand why local inference matters, what RAM/VRAM mean, how prefill/decode work, and what a GGUF
        file is. This lesson ties those pieces into the llama.cpp project itself.
      </Callout>

      <LessonSection title="Georgi Gerganov and the C/C++ bet">
        <p className="text-slate-300">
          In early 2023, Meta released Llama weights and the world rushed to run them in Python. Georgi Gerganov —
          known for audio ML tools like whisper.cpp — asked: what if we rewrote inference in plain C/C++ with
          hand-tuned kernels and minimal dependencies?
        </p>

        <ContentStep number={1} title="Why C/C++ for inference?">
          <p className="text-slate-300">
            Python + PyTorch adds overhead: interpreter, dynamic graphs, large runtime. C/C++ compiles to a small
            binary that talks directly to CPU SIMD instructions, CUDA, or Metal. Less memory overhead, faster
            cold start, easier to ship on edge devices.
          </p>
        </ContentStep>

        <ContentStep number={2} title="whisper.cpp → llama.cpp">
          <p className="text-slate-300">
            The same philosophy that made on-device speech recognition practical was applied to LLMs. The project
            exploded in popularity because anyone could clone, build, and run Llama on a MacBook within minutes.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Community scale">
          <p className="text-slate-300">
            Today llama.cpp supports dozens of architectures (Llama, Mistral, Qwen, Phi, Gemma, and more), multiple
            hardware backends, and ships example servers used by countless downstream tools.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What llama.cpp actually provides">
        <Flowchart
          title="llama.cpp stack (conceptual)"
          chart={`flowchart TB
  GGUF[GGUF model file] --> CORE[llama.cpp core]
  CORE --> GGML[GGML tensor library]
  GGML --> B1[CPU AVX]
  GGML --> B2[CUDA]
  GGML --> B3[Metal]
  GGML --> B4[Vulkan / SYCL]
  CORE --> APPS[CLI tools and server]
  APPS --> U[You / your app]`}
        />

        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <code className="font-mono text-sm">llama-cli</code> — interactive chat and one-shot prompts
          </li>
          <li>
            <code className="font-mono text-sm">llama-server</code> — HTTP API compatible with OpenAI-style clients
          </li>
          <li>
            <strong className="text-white">libllama</strong> — C API for embedding inference in games, mobile apps,
            or custom agents
          </li>
          <li>
            Conversion and quantization tooling — turn HuggingFace checkpoints into GGUF
          </li>
        </ul>

        <Example
          title="Minimal local chat"
          caption="Binary names evolve; check the repo README for your version."
        >{`# Build from source or download a release binary
./llama-cli -m models/mistral-7b-instruct-q4_k_m.gguf \\
  -cnv \\
  -p "You are a helpful assistant."`}</Example>
      </LessonSection>

      <LessonSection title="Relationship to Ollama">
        <p className="text-slate-300">
          <strong className="text-white">Ollama</strong> is a separate product that makes local LLMs feel like Docker
          for models: <code className="font-mono text-sm">ollama pull llama3</code>, then{' '}
          <code className="font-mono text-sm">ollama run llama3</code>. Under the hood, Ollama uses llama.cpp (among
          other engines) to execute the model.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4">
            <div className="text-lg font-semibold text-white">Ollama</div>
            <div className="mt-1 text-xs text-slate-400">Friendly UX layer</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
              <li>Model registry, pull, and versioning</li>
              <li>Simple API on localhost:11434</li>
              <li>Great for Cursor, Continue, quick experiments</li>
              <li>Less control over every compile flag and backend</li>
            </ul>
          </div>
          <div className="rounded-xl border border-genai-500/30 bg-genai-500/5 p-4">
            <div className="text-lg font-semibold text-white">llama.cpp</div>
            <div className="mt-1 text-xs text-slate-400">Engine and building blocks</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
              <li>Build from source with exact backends you need</li>
              <li>Embed in C++, mobile, or custom servers</li>
              <li>Latest features and quant formats first</li>
              <li>Steeper learning curve, maximum flexibility</li>
            </ul>
          </div>
        </div>

        <Callout variant="insight">
          Analogy: Ollama is Spotify — curated, easy playback. llama.cpp is the audio codec and player engine
          underneath. Power users often use both: Ollama daily, llama.cpp when they need fine control.
        </Callout>
      </LessonSection>

      <LessonSection title="llama.cpp vs vLLM — positioning">
        <p className="text-slate-300">
          Both run open-weight models, but they target opposite ends of the deployment spectrum.
        </p>

        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">llama.cpp</th>
                <th className="px-4 py-3">vLLM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Primary home', 'Laptop, desktop, edge, mobile', 'Datacenter GPU servers'],
                ['Hardware', 'CPU, Apple Silicon, consumer GPU', 'NVIDIA A100/H100 clusters'],
                ['Language', 'C/C++ native', 'Python + CUDA kernels'],
                ['Batching', 'Modest concurrent requests', 'Continuous batching, PagedAttention'],
                ['Throughput', 'Tens of tokens/sec per user', 'Thousands aggregate tokens/sec'],
                ['Sweet spot', 'Private local assistant, offline, embedded', 'Production API serving many users'],
              ].map(([dim, llama, vllm]) => (
                <tr key={dim} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{dim}</td>
                  <td className="px-4 py-3 text-genai-400">{llama}</td>
                  <td className="px-4 py-3 text-slate-400">{vllm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Flowchart
          title="Where each engine shines"
          chart={`flowchart LR
  subgraph EDGE[Edge / local]
    L[llama.cpp]
    L --> M[MacBook]
    L --> P[RPi / offline PC]
  end
  subgraph DC[Datacenter]
    V[vLLM]
    V --> G[Multi-GPU node]
    V --> K[Kubernetes fleet]
  end`}
        />

        <p className="mt-4 text-slate-300">
          Companies sometimes use <strong className="text-white">both</strong>: llama.cpp on devices or developer
          laptops, vLLM in the cloud for customer-facing APIs. They are complements, not duplicates.
        </p>
      </LessonSection>

      <LessonSection title="Ecosystem and what comes next">
        <p className="text-slate-300">
          Projects built on or alongside llama.cpp include mobile ports, LM Studio, llamafile (single-file
          executables), and bindings for Rust, Go, and Python. The GGUF ecosystem on HuggingFace exists largely
          because llama.cpp made a portable format the community could standardize on.
        </p>

        <CodeBlock title="OpenAI-compatible local server (llama-server)">{`./llama-server -m models/qwen2.5-7b-instruct-q4_k_m.gguf \\
  --port 8080

# Client points at http://localhost:8080/v1
curl http://localhost:8080/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{"messages":[{"role":"user","content":"Hello!"}]}'`}</CodeBlock>

        <Callout variant="tip" title="Recommended next step">
          Read <strong className="text-white">GGML and Backends</strong> to understand the tensor library and how
          CPU, CUDA, and Metal paths are selected — then move to hands-on build and run lessons.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'llama.cpp is Georgi Gerganov\'s C/C++ inference engine for running GGUF models on everyday hardware.',
          'It prioritizes portability, low overhead, and edge/local use over datacenter throughput.',
          'Ollama wraps llama.cpp for easy model pulls; llama.cpp is the engine for custom and embedded use.',
          'vLLM targets multi-user GPU serving; llama.cpp targets local, offline, and resource-constrained machines.',
          'Next: dive into GGML — the tensor math layer and hardware backends underneath.',
        ]}
      />
    </LessonArticle>
  )
}
