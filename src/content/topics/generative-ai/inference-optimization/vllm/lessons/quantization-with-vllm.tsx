import {
  Callout,
  CodeBlock,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function QuantizationWithVllm() {
  return (
    <LessonArticle>
      <LessonSection title="Why quantization matters">
        <p className="text-slate-300">
          A Llama-3-8B model in FP16 needs roughly <strong className="text-white">16 GB</strong> of VRAM just to
          load weights — before KV cache, activations, or batching. Quantization stores weights (and sometimes
          activations) in fewer bits per parameter, dramatically shrinking memory use and often increasing
          throughput.
        </p>
        <Definition term="Quantization">
          <p>
            Reducing numeric precision of model weights from 16-bit floats (FP16/BF16) to 8-bit, 4-bit, or lower.
            Fewer bits per weight → smaller model footprint → more room for KV cache and larger batches on the same
            GPU.
          </p>
        </Definition>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-slate-400">Llama-3-8B memory footprint (weights only)</div>
          <div className="mt-2 grid gap-2 text-slate-300 sm:grid-cols-2">
            <div>FP16 / BF16 → ~16 GB</div>
            <div>INT8 → ~8 GB</div>
            <div>INT4 (AWQ/GPTQ) → ~4–5 GB</div>
            <div>FP8 → ~8 GB (often faster on H100)</div>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="AWQ — activation-aware weight quantization">
        <p className="text-slate-300">
          <strong className="text-white">AWQ (Activation-aware Weight Quantization)</strong> identifies the ~1% of
          weights that matter most for output quality and keeps them at higher precision while quantizing the rest
          to 4-bit. Pre-quantized AWQ checkpoints are common on Hugging Face.
        </p>
        <CodeBlock title="Serve an AWQ model with vLLM">{`python -m vllm.entrypoints.openai.api_server \\
  --model TheBloke/Llama-2-7B-AWQ \\
  --quantization awq \\
  --dtype float16 \\
  --max-model-len 4096`}</CodeBlock>
        <Callout variant="tip">
          AWQ models are usually already quantized on disk — pass <code className="font-mono text-sm">--quantization awq</code>{' '}
          so vLLM loads the correct kernels. Do not re-quantize at runtime unless you know you need to.
        </Callout>
      </LessonSection>

      <LessonSection title="GPTQ — post-training quantization">
        <p className="text-slate-300">
          <strong className="text-white">GPTQ</strong> quantizes weights after training using calibration data and
          layer-wise error minimization. It is mature, widely available, and works well for 4-bit serving. vLLM
          supports GPTQ checkpoints with the <code className="font-mono text-sm">gptq</code> backend.
        </p>
        <CodeBlock title="GPTQ serving">{`python -m vllm.entrypoints.openai.api_server \\
  --model huggingface/GPTQ-model-id \\
  --quantization gptq \\
  --max-model-len 8192`}</CodeBlock>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Typical bits</th>
                <th className="px-4 py-3">When to prefer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['AWQ', '4-bit', 'Pre-built HF checkpoints; strong quality at 4-bit'],
                ['GPTQ', '4-bit (also 3/2-bit variants)', 'Large ecosystem; good for older GPUs'],
                ['FP8', '8-bit', 'H100/H200 with native FP8 tensor cores'],
                ['FP16/BF16', '16-bit', 'Maximum quality when VRAM is not a constraint'],
              ].map(([method, bits, when]) => (
                <tr key={method} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{method}</td>
                  <td className="px-4 py-3 text-slate-400">{bits}</td>
                  <td className="px-4 py-3 text-slate-400">{when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="FP8 — hardware-accelerated 8-bit">
        <p className="text-slate-300">
          <strong className="text-white">FP8</strong> uses 8-bit floating point. On NVIDIA H100 and newer datacenter
          GPUs, FP8 tensor cores can deliver higher throughput than FP16 with modest quality loss. vLLM supports FP8
          weight-and-activation quantization for compatible models when you have the right hardware and checkpoints.
        </p>
        <CodeBlock title="FP8 (when model and GPU support it)">{`python -m vllm.entrypoints.openai.api_server \\
  --model meta-llama/Llama-3.1-8B-Instruct \\
  --quantization fp8 \\
  --dtype auto`}</CodeBlock>
        <Callout variant="beginner">
          FP8 is not a free win on consumer GPUs (RTX 4090, etc.). Check your GPU generation and vLLM docs before
          assuming FP8 support — AWQ/GPTQ 4-bit is usually the practical choice on smaller cards.
        </Callout>
      </LessonSection>

      <LessonSection title="Quality tradeoffs — what you give up">
        <Flowchart
          title="Quantization decision flow"
          chart={`flowchart TD
  A[VRAM fits FP16?] -->|Yes, quality critical| B[FP16/BF16]
  A -->|No| C[Try 4-bit AWQ or GPTQ]
  C --> D{Quality acceptable on eval set?}
  D -->|Yes| E[Deploy 4-bit — max throughput per GPU]
  D -->|No| F[Try FP8 on H100 or smaller model]
  D -->|Still no| G[More GPUs / tensor parallel / larger hardware]`}
        />
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Perplexity / benchmark scores</strong> — 4-bit models often score within
            1–3% of FP16 on MMLU-style benchmarks; task-specific eval matters more than aggregate scores.
          </li>
          <li>
            <strong className="text-white">Long-context and math</strong> — sensitive tasks may degrade more at 4-bit;
            always run your own eval set before production.
          </li>
          <li>
            <strong className="text-white">VRAM savings enable batching</strong> — a 4-bit model that frees 10 GB can
            hold more concurrent sequences, often beating FP16 on total throughput even if per-token quality is
            slightly lower.
          </li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Quantization shrinks weight memory so the same GPU serves larger batches or longer context.',
          'AWQ and GPTQ are the workhorses for 4-bit serving — use pre-quantized checkpoints from Hugging Face.',
          'FP8 shines on H100-class hardware; 4-bit AWQ/GPTQ is the default on smaller GPUs.',
          'Always benchmark your actual prompts — aggregate benchmarks do not capture your use case.',
        ]}
      />
    </LessonArticle>
  )
}
