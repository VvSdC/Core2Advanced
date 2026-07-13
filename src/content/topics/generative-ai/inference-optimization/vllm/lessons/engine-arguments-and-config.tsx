import {
  Callout,
  CodeBlock,
  ContentStep,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function EngineArgumentsAndConfig() {
  return (
    <LessonArticle>
      <LessonSection title="CLI flags = engine configuration">
        <p className="text-slate-300">
          Every argument you pass to <code className="font-mono text-sm">vllm serve</code> configures the{' '}
          <strong className="text-white">inference engine</strong> — which model loads, how GPUs are used, how much
          memory is reserved, and how long contexts can be. Getting these right is the difference between a server
          that starts cleanly and one that OOMs under load.
        </p>
        <p className="mt-4 text-slate-300">
          The same options exist on the <code className="font-mono text-sm">LLM(...)</code> Python class as keyword
          arguments (e.g. <code className="font-mono text-sm">tensor_parallel_size=2</code>).
        </p>
      </LessonSection>

      <LessonSection title="Key arguments explained">
        <div className="space-y-6">
          <ContentStep number={1} title="--model">
            <p className="text-slate-300">
              Hugging Face model id or local path to weights. This is the only required argument. vLLM downloads
              from the Hub unless the path is on disk.
            </p>
            <CodeBlock title="Examples">{`--model meta-llama/Meta-Llama-3-8B-Instruct
--model mistralai/Mistral-7B-Instruct-v0.3
--model /data/models/my-finetuned-llama`}</CodeBlock>
          </ContentStep>

          <ContentStep number={2} title="--tensor-parallel-size">
            <p className="text-slate-300">
              Splits <strong className="text-white">one model</strong> across multiple GPUs (horizontal sharding of
              layers). Use when a single GPU cannot hold the full weights — e.g. 70B on 4× 24 GB cards with{' '}
              <code className="font-mono text-sm">--tensor-parallel-size 4</code>. Must divide evenly across
              visible GPUs.
            </p>
            <Callout variant="tip">
              Do not confuse with <em>data parallel</em> (duplicate models for more throughput) — tensor parallel is
              about fitting one large model.
            </Callout>
          </ContentStep>

          <ContentStep number={3} title="--max-model-len">
            <p className="text-slate-300">
              Maximum sequence length (prompt + completion) in tokens. Higher values need{' '}
              <strong className="text-white">more KV cache VRAM</strong>. Default is often the model's training
              context (e.g. 8192 for Llama 3 8B). Lower it if you hit OOM at startup:
              <code className="font-mono text-sm"> --max-model-len 4096</code>.
            </p>
          </ContentStep>

          <ContentStep number={4} title="--gpu-memory-utilization">
            <p className="text-slate-300">
              Fraction of total GPU VRAM vLLM is allowed to use (0.0–1.0). Default{' '}
              <code className="font-mono text-sm">0.9</code> leaves headroom for CUDA overhead. Lower to{' '}
              <code className="font-mono text-sm">0.85</code> if you share the GPU with other processes; raise
              cautiously only when you need more KV cache for concurrent requests.
            </p>
          </ContentStep>
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Flag</th>
                <th className="px-4 py-3">Plain-language effect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['--model', 'Which weights to load'],
                ['--tensor-parallel-size', 'How many GPUs split one model'],
                ['--max-model-len', 'Longest prompt+answer the server accepts'],
                ['--gpu-memory-utilization', 'How much VRAM vLLM may claim'],
                ['--quantization awq', 'Load 4-bit AWQ weights (smaller VRAM)'],
                ['--dtype auto', 'Pick bf16/fp16 based on GPU support'],
                ['--host / --port', 'Where the HTTP API listens'],
              ].map(([flag, effect]) => (
                <tr key={flag} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-sm text-genai-400">{flag}</td>
                  <td className="px-4 py-3 text-slate-400">{effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Production launch example">
        <p className="text-slate-300">
          A typical production command for a 7B instruct model on one 24 GB GPU: bounded context, high memory
          utilization, explicit host binding, and AWQ quant if you need extra KV cache headroom for concurrent
          users.
        </p>
        <Example title="Production-style vllm serve">{`vllm serve mistralai/Mistral-7B-Instruct-v0.3 \\
  --host 0.0.0.0 \\
  --port 8000 \\
  --tensor-parallel-size 1 \\
  --max-model-len 8192 \\
  --gpu-memory-utilization 0.92 \\
  --dtype auto \\
  --served-model-name mistral-7b-instruct \\
  --trust-remote-code`}</Example>
        <p className="mt-4 text-slate-300">
          <code className="font-mono text-sm">--served-model-name</code> sets the id clients see in{' '}
          <code className="font-mono text-sm">/v1/models</code> — useful when you want a stable alias regardless
          of the Hub path. <code className="font-mono text-sm">--trust-remote-code</code> is required for some
          model architectures with custom Hugging Face code.
        </p>
        <CodeBlock title="Multi-GPU 70B example (4× A100 40GB)">{`vllm serve meta-llama/Meta-Llama-3-70B-Instruct \\
  --tensor-parallel-size 4 \\
  --max-model-len 4096 \\
  --gpu-memory-utilization 0.90 \\
  --host 0.0.0.0 \\
  --port 8000`}</CodeBlock>
      </LessonSection>

      <LessonSection title="Python LLM class — same knobs">
        <p className="text-slate-300">
          Offline scripts use the same parameters as constructor kwargs — helpful when prototyping config before
          switching to <code className="font-mono text-sm">vllm serve</code>.
        </p>
        <Example title="Engine config in Python">{`from vllm import LLM, SamplingParams

llm = LLM(
    model="meta-llama/Meta-Llama-3-8B-Instruct",
    tensor_parallel_size=1,
    max_model_len=8192,
    gpu_memory_utilization=0.92,
    dtype="auto",
    trust_remote_code=True,
)

outputs = llm.generate(
    ["Hello, world!"],
    SamplingParams(max_tokens=32, temperature=0.7),
)`}</Example>
      </LessonSection>

      <LessonSection title="Tuning checklist when something fails">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">OOM at startup</strong> → lower{' '}
            <code className="font-mono text-sm">--max-model-len</code>, use AWQ/GPTQ, or increase{' '}
            <code className="font-mono text-sm">--tensor-parallel-size</code>.
          </li>
          <li>
            <strong className="text-white">OOM under concurrent load</strong> → lower{' '}
            <code className="font-mono text-sm">--gpu-memory-utilization</code> slightly or reduce max context;
            KV cache grows with active requests.
          </li>
          <li>
            <strong className="text-white">Request too long</strong> → client prompt exceeds{' '}
            <code className="font-mono text-sm">max-model-len</code>; truncate input or raise the limit if VRAM
            allows.
          </li>
          <li>
            <strong className="text-white">Wrong GPU count</strong> →{' '}
            <code className="font-mono text-sm">tensor-parallel-size</code> must match available GPUs; use{' '}
            <code className="font-mono text-sm">CUDA_VISIBLE_DEVICES=0,1</code> to pin specific cards.
          </li>
        </ul>
        <Callout variant="beginner" title="Start conservative">
          Begin with <code className="font-mono text-sm">max-model-len 4096</code> and{' '}
          <code className="font-mono text-sm">gpu-memory-utilization 0.9</code>. Increase context only after the
          server stays stable under your expected concurrent load.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          '--model selects weights; --tensor-parallel-size shards one model across GPUs.',
          '--max-model-len caps total tokens per request and drives KV cache size.',
          '--gpu-memory-utilization controls how much VRAM vLLM reserves (default 0.9).',
          'Production: bind host/port, set served-model-name, tune context vs VRAM before scaling traffic.',
        ]}
      />
    </LessonArticle>
  )
}
