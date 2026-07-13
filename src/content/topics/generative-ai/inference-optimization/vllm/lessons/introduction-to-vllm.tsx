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

export function IntroductionToVllm() {
  return (
    <LessonArticle>
      <Definition term="vLLM">
        <p>
          <strong className="text-white">vLLM</strong> is an open-source, high-throughput inference engine for
          large language models. It takes a trained model (Llama, Mistral, Qwen, etc.) and serves it as a fast,
          production-ready server — handling batching, memory management, and an OpenAI-compatible HTTP API out
          of the box.
        </p>
        <p>
          Think of it as the difference between running a single recipe in your kitchen (HuggingFace{' '}
          <code className="font-mono text-sm">generate()</code>) and operating a restaurant kitchen that serves
          hundreds of orders simultaneously (vLLM).
        </p>
      </Definition>

      <Callout variant="beginner" title="You are ready for this lesson if">
        You understand training vs inference, prefill/decode, KV cache, and basic GPU/VRAM concepts from the
        previous three lessons. Those explain <em>why</em> vLLM exists; this lesson explains <em>what</em> it is.
      </Callout>

      <LessonSection title="Origins — UC Berkeley and PagedAttention">
        <p className="text-slate-300">
          vLLM was created at <strong className="text-white">UC Berkeley</strong> and released in 2023. Its
          breakthrough is <strong className="text-white">PagedAttention</strong> — a memory management technique
          inspired by operating-system virtual memory. Instead of reserving one large contiguous KV cache block
          per request (wasting memory to fragmentation), vLLM stores KV cache in fixed-size <em>pages</em> that
          can be allocated and shared flexibly.
        </p>

        <Flowchart
          title="PagedAttention idea (simplified)"
          chart={`flowchart TB
  subgraph NAIVE[Naive serving]
    N1[Request A — reserved max length block]
    N2[Request B — reserved max length block]
    N3[Much memory wasted as holes]
  end
  subgraph PAGED[vLLM PagedAttention]
    P1[Fixed memory pages in a pool]
    P2[Request A uses pages as needed]
    P3[Request B shares the same pool]
    P4[Near-zero fragmentation]
  end`}
        />

        <ContentStep number={1} title="The PagedAttention paper">
          <p>
            The research paper &quot;Efficient Memory Management for Large Language Model Serving with
            PagedAttention&quot; (Kwon et al., 2023) showed 2–4× more concurrent requests on the same GPU
            compared to naive implementations — without changing model accuracy.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Continuous batching">
          <p>
            vLLM also implements <strong className="text-white">continuous batching</strong> (iteration-level
            batching): new requests join the GPU batch mid-generation instead of waiting for the whole batch to
            finish. This keeps GPU utilization high during the decode-heavy phase.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Rapid adoption">
          <p>
            Today vLLM is one of the most widely deployed open-source LLM servers — used by startups, enterprises,
            and cloud providers. It supports 50+ model architectures and active development adds features weekly.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="vLLM vs HuggingFace Transformers generate()">
        <p className="text-slate-300">
          HuggingFace <code className="font-mono text-sm">transformers</code> is the standard library for{' '}
          <em>loading</em> models and prototyping. Its <code className="font-mono text-sm">model.generate()</code>{' '}
          method works beautifully in notebooks — but was not designed for production throughput.
        </p>

        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Capability</th>
                <th className="px-4 py-3">HuggingFace generate()</th>
                <th className="px-4 py-3">vLLM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Primary use', 'Research, notebooks, fine-tuning', 'Production serving at scale'],
                ['Concurrent users', 'One at a time (typical)', 'Dozens to hundreds batched'],
                ['KV cache', 'Static allocation per call', 'PagedAttention — efficient pooling'],
                ['HTTP API', 'Build yourself (FastAPI, etc.)', 'Built-in OpenAI-compatible server'],
                ['Throughput', 'Low aggregate tokens/sec', '10–100× higher on same GPU'],
                ['Setup complexity', 'Minimal for one prompt', 'More config, huge payoff at scale'],
              ].map(([cap, hf, vllm]) => (
                <tr key={cap} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{cap}</td>
                  <td className="px-4 py-3 text-slate-400">{hf}</td>
                  <td className="px-4 py-3 text-genai-400">{vllm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Example
          title="HuggingFace — great for prototyping"
          caption="Fine for one user, one prompt. Does not batch concurrent HTTP requests."
        >{`from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.2-1B")
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3.2-1B")

inputs = tokenizer("Hello!", return_tensors="pt")
outputs = model.generate(**inputs, max_new_tokens=50)
print(tokenizer.decode(outputs[0]))`}</Example>

        <Example
          title="vLLM — production server (conceptual)"
          caption="Start a server; clients call it like OpenAI. Handles batching internally."
          output="Server listening on http://0.0.0.0:8000"
        >{`# Terminal — one command starts the server
vllm serve meta-llama/Llama-3.2-1B --port 8000

# Client — same API shape as OpenAI
curl http://localhost:8000/v1/completions \\
  -H "Content-Type: application/json" \\
  -d '{"model": "meta-llama/Llama-3.2-1B", "prompt": "Hello!", "max_tokens": 50}'`}</Example>
      </LessonSection>

      <LessonSection title="vLLM vs Ollama">
        <p className="text-slate-300">
          Both run models locally, but they target different jobs. Many developers use <strong className="text-white">Ollama</strong>{' '}
          on a laptop and <strong className="text-white">vLLM</strong> in the cloud.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4">
            <div className="text-lg font-semibold text-white">Ollama</div>
            <div className="mt-1 text-xs text-slate-400">Simple local inference</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
              <li>One-command install, pull models like Docker images</li>
              <li>Perfect for personal chat, local dev, trying models</li>
              <li>Low setup friction; modest concurrent throughput</li>
              <li>Great companion to Cursor, Continue, local agents</li>
            </ul>
          </div>
          <div className="rounded-xl border border-genai-500/30 bg-genai-500/5 p-4">
            <div className="text-lg font-semibold text-white">vLLM</div>
            <div className="mt-1 text-xs text-slate-400">Production inference server</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
              <li>Designed for multi-user, high-throughput serving</li>
              <li>PagedAttention, continuous batching, tensor parallel</li>
              <li>Kubernetes, load balancers, SLA-driven deployments</li>
              <li>Used when API cost, privacy, or scale demands self-hosting</li>
            </ul>
          </div>
        </div>

        <Callout variant="insight">
          Use Ollama to <em>try</em> a model on your machine. Use vLLM when that model needs to serve a team,
          a product, or thousands of requests per minute with predictable latency.
        </Callout>
      </LessonSection>

      <LessonSection title="OpenAI-compatible API">
        <p className="text-slate-300">
          vLLM exposes <code className="font-mono text-sm">/v1/completions</code> and{' '}
          <code className="font-mono text-sm">/v1/chat/completions</code> endpoints that match OpenAI&apos;s API
          shape. Existing SDKs and tools often work by changing one line — the base URL.
        </p>

        <CodeBlock title="Point OpenAI SDK at your vLLM server">{`from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="not-needed-for-local",  # vLLM ignores key by default
)

response = client.chat.completions.create(
    model="meta-llama/Llama-3.2-1B",
    messages=[{"role": "user", "content": "Explain PagedAttention in one sentence."}],
    max_tokens=100,
)
print(response.choices[0].message.content)`}</CodeBlock>

        <p className="mt-4 text-slate-300">
          Companies including Replicate, Anyscale, and many internal ML platforms use vLLM (or forks) under the
          hood. The OpenAI-compatible surface means LangChain, LlamaIndex, and custom apps swap providers with
          minimal code changes.
        </p>
      </LessonSection>

      <LessonSection title="What vLLM handles for you">
        <Flowchart
          title="vLLM server internal responsibilities"
          chart={`flowchart TB
  C[Client HTTP requests] --> S[vLLM API server]
  S --> B[Continuous batching scheduler]
  B --> P[PagedAttention KV manager]
  P --> E[Model executor on GPU]
  E --> P
  P --> S
  S --> C[Streamed tokens]`}
        />

        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>Request queueing and fair scheduling across users</li>
          <li>Efficient KV cache allocation and prefix caching (shared prompt prefixes)</li>
          <li>Tensor parallelism and pipeline parallelism for multi-GPU models</li>
          <li>Quantization support (AWQ, GPTQ, FP8) for fitting larger models</li>
          <li>LoRA adapter hot-swapping for many fine-tuned variants on one base model</li>
          <li>Structured output, speculative decoding, and disaggregated prefill (advanced topics later)</li>
        </ul>
      </LessonSection>

      <LessonSection title="Roadmap — remaining lessons in this sub-topic">
        <p className="text-slate-300">
          You have completed the <strong className="text-white">Foundations</strong> block. Here is the full path
          from zero to vLLM mastery:
        </p>

        <Flowchart
          title="Zero to vLLM mastery"
          chart={`flowchart TB
  F[Foundations — inference, GPU, intro] --> A[Architecture — PagedAttention, batching deep dive]
  A --> G[Getting Started — install, first server, API]
  G --> O[Optimization — quantization, parallel, LoRA]
  O --> P[Production — tuning, deploy, monitor]
  P --> M[Mastery — disaggregated serving, engine comparison]`}
        />

        <div className="mt-6 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Section</th>
                <th className="px-4 py-3">Topics you will cover</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Foundations ✓', 'Training vs inference, prefill/decode, GPUs, this intro'],
                ['Architecture', 'PagedAttention internals, continuous batching, prefix caching'],
                ['Getting Started', 'pip install, vllm serve, OpenAI client, first benchmarks'],
                ['Optimization', 'AWQ/GPTQ quant, tensor parallel, multi-LoRA, speculative decode'],
                ['Production', 'K8s deploy, autoscaling, metrics, latency vs throughput tuning'],
                ['Mastery', 'Disaggregated prefill/decode, vLLM vs TGI vs TensorRT-LLM, future trends'],
              ].map(([section, topics]) => (
                <tr key={section} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{section}</td>
                  <td className="px-4 py-3 text-slate-400">{topics}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout variant="tip" title="Recommended next step">
          Continue to <strong className="text-white">Architecture → PagedAttention Deep Dive</strong> to understand
          the core innovation that makes vLLM faster than naive serving — now that you know what KV cache and VRAM
          pressure mean.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'vLLM is an open-source high-throughput LLM inference engine with an OpenAI-compatible API.',
          'Born at UC Berkeley; PagedAttention + continuous batching are its core innovations.',
          'HuggingFace generate() is for prototyping; vLLM is for production multi-user serving.',
          'Ollama = simple local use; vLLM = scalable server deployments in cloud or datacenter.',
          'Foundations complete — next up: Architecture, then install your first vLLM server.',
        ]}
      />
    </LessonArticle>
  )
}
