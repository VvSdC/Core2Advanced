import {
  Callout,
  CodeBlock,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function TensorAndPipelineParallelism() {
  return (
    <LessonArticle>
      <LessonSection title="One GPU is not always enough">
        <p className="text-slate-300">
          Llama-3-70B in FP16 needs roughly <strong className="text-white">140 GB</strong> of weight memory alone —
          more than a single A100 (80 GB). Even when a model fits one GPU, you may want multiple GPUs to increase
          throughput or reduce per-request latency. vLLM splits the model across devices using{' '}
          <strong className="text-white">tensor parallelism (TP)</strong> and{' '}
          <strong className="text-white">pipeline parallelism (PP)</strong>.
        </p>
        <Definition term="Tensor Parallelism (TP)">
          <p>
            Splits individual layers across GPUs — each GPU holds a slice of every weight matrix and participates in
            every forward pass. GPUs communicate frequently (all-reduce) but keep pipeline bubbles small. Best when
            you need low latency and the model fits across GPUs with TP alone.
          </p>
        </Definition>
        <Definition term="Pipeline Parallelism (PP)">
          <p>
            Splits the model <em>by depth</em> — GPU 0 runs early layers, GPU 1 runs middle layers, etc. Less
            communication per step, but micro-batches can leave GPUs idle (pipeline bubbles). Best for very large
            models where TP alone would require too many GPUs or excessive communication.
          </p>
        </Definition>
      </LessonSection>

      <LessonSection title="Tensor parallelism in vLLM">
        <p className="text-slate-300">
          Set <code className="font-mono text-sm">--tensor-parallel-size N</code> to shard the model across{' '}
          <code className="font-mono text-sm">N</code> GPUs on the same node. vLLM uses Megatron-style column/row
          splits for attention and MLP projections.
        </p>
        <CodeBlock title="8B model on 2 GPUs (optional — often unnecessary)">{`python -m vllm.entrypoints.openai.api_server \\
  --model meta-llama/Llama-3.1-8B-Instruct \\
  --tensor-parallel-size 2 \\
  --max-model-len 8192`}</CodeBlock>
        <CodeBlock title="70B model on 4× A100 80GB">{`python -m vllm.entrypoints.openai.api_server \\
  --model meta-llama/Llama-3.1-70B-Instruct \\
  --tensor-parallel-size 4 \\
  --dtype bfloat16 \\
  --max-model-len 8192`}</CodeBlock>
        <Callout variant="tip">
          TP size must divide evenly across GPUs on one machine. All TP GPUs need fast NVLink/PCIe — cross-node TP
          is possible but latency-sensitive; prefer single-node TP for interactive workloads.
        </Callout>
      </LessonSection>

      <LessonSection title="Pipeline parallelism in vLLM">
        <p className="text-slate-300">
          Set <code className="font-mono text-sm">--pipeline-parallel-size P</code> to stack pipeline stages. Total
          GPUs used = <code className="font-mono text-sm">TP × PP</code>. Example: TP=4, PP=2 → 8 GPUs.
        </p>
        <CodeBlock title="Very large model — TP + PP">{`python -m vllm.entrypoints.openai.api_server \\
  --model meta-llama/Llama-3.1-405B-Instruct \\
  --tensor-parallel-size 8 \\
  --pipeline-parallel-size 2 \\
  --dtype bfloat16`}</CodeBlock>
        <p className="mt-4 text-slate-300">
          PP increases throughput for batch-heavy offline jobs but can hurt interactive latency when batch size is
          1. Tune micro-batching and prefer TP-only when the model fits.
        </p>
      </LessonSection>

      <LessonSection title="When to use TP vs PP">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Scenario</th>
                <th className="px-4 py-3">Recommendation</th>
                <th className="px-4 py-3">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Model fits 1 GPU', 'TP=1, PP=1', 'Simplest; best per-GPU efficiency'],
                ['Model too large for 1 GPU, fits 2–8 GPUs', 'TP only', 'Low latency; all GPUs active each step'],
                ['Model needs 16+ GPUs', 'TP + PP', 'Reduce all-reduce overhead; accept pipeline bubbles'],
                ['Chat API, low latency', 'Prefer TP, smaller PP', 'PP idle time hurts TTFT at batch=1'],
                ['Offline batch inference', 'Higher PP acceptable', 'Fill pipeline with large batches'],
              ].map(([scenario, rec, why]) => (
                <tr key={scenario} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{scenario}</td>
                  <td className="px-4 py-3 text-genai-400">{rec}</td>
                  <td className="px-4 py-3 text-slate-400">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Flowchart
          title="Choosing parallelism strategy"
          chart={`flowchart TD
  S[Model too big for 1 GPU?] -->|No| N[Single GPU — no parallel]
  S -->|Yes| T[How many GPUs on one node?]
  T --> U{Fits with TP ≤ GPU count?}
  U -->|Yes| TP[Use tensor parallel only]
  U -->|No| PP[Add pipeline parallel across nodes]
  TP --> L{Latency-sensitive chat?}
  L -->|Yes| TP
  L -->|No| PP2[Consider PP for throughput]`}
        />
      </LessonSection>

      <Callout variant="beginner">
        Start with <code className="font-mono text-sm">--tensor-parallel-size</code> equal to the number of GPUs
        needed to fit the model in memory. Only add pipeline parallelism when TP alone is insufficient or
        communication becomes the bottleneck.
      </Callout>

      <KeyTakeaways
        items={[
          'Tensor parallelism splits layers horizontally — best for low-latency multi-GPU serving on one node.',
          'Pipeline parallelism splits layers vertically — scales to huge models but can add latency at small batch sizes.',
          'Total GPUs = tensor_parallel_size × pipeline_parallel_size.',
          'Prefer TP-only when possible; add PP for 70B+ models or cross-node deployments.',
        ]}
      />
    </LessonArticle>
  )
}
