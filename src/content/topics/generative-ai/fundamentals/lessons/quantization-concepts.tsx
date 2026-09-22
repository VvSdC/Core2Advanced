import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function QuantizationConcepts() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Read this after">
        <em>Model Parameters, Weights &amp; Memory</em> and <em>Context Windows &amp; the KV Cache</em>. This
        lesson explains the single most important trick for making those weights and that cache actually fit on
        the hardware you have.
      </Callout>

      <Definition term="Quantization">
        <p>
          A model&rsquo;s weights are numbers. In training, they are stored as{' '}
          <strong className="text-white">16-bit</strong> or <strong className="text-white">32-bit</strong>{' '}
          floating point (FP16 / FP32). <span className="text-genai-400">Quantization</span> is the process of
          representing those same numbers with <strong className="text-white">fewer bits</strong> — commonly
          8-bit (INT8) or 4-bit (INT4). Same model, smaller memory footprint, faster arithmetic. The tradeoff is
          a small loss of precision.
        </p>
      </Definition>

      <LessonSection title="Why anyone bothers — the memory math">
        <p className="text-slate-300">
          The biggest thing on a GPU is not the model doing math — it is the model&rsquo;s weights sitting in
          memory. Halve the bits, halve the memory. That decides whether a model even runs.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Precision</th>
                <th className="px-4 py-3">Bytes / param</th>
                <th className="px-4 py-3">7B model</th>
                <th className="px-4 py-3">70B model</th>
                <th className="px-4 py-3">Fits on…</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['FP32', '4',   '28 GB',  '280 GB', '2× A100 80G or bigger'],
                ['FP16 / BF16', '2', '14 GB', '140 GB', 'One A100 80G / two A100 40G'],
                ['INT8', '1',   '7 GB',   '70 GB',  'One A100 80G'],
                ['INT4', '0.5', '3.5 GB', '35 GB',  'One consumer GPU (RTX 4090) or a laptop'],
              ].map(([p, b, s7, s70, fit]) => (
                <tr key={p}>
                  <td className="px-4 py-3 font-semibold text-white">{p}</td>
                  <td className="px-4 py-3 text-slate-400">{b}</td>
                  <td className="px-4 py-3 text-slate-400">{s7}</td>
                  <td className="px-4 py-3 text-slate-400">{s70}</td>
                  <td className="px-4 py-3 text-slate-400">{fit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Example
          title="One-line rule you can quote in interviews"
          output={`weights_bytes ≈ params × (bits / 8)
7B in FP16  = 7e9  × 2   = 14 GB
7B in INT4  = 7e9  × 0.5 = 3.5 GB
70B in INT4 = 70e9 × 0.5 = 35 GB   <- now fits on a single RTX 4090`}
          caption="Memory scales linearly with bit-width. Quantization is a memory story first, a speed story second."
        >{`for bits in (32, 16, 8, 4):
    for params_b in (7, 70):
        gb = params_b * 1e9 * bits / 8 / 1e9
        print(f"{params_b}B @ INT/FP{bits}: {gb:.1f} GB")`}</Example>
      </LessonSection>

      <LessonSection title="Two ideas behind every scheme">
        <ContentStep number={1} title="Scale — map a wide range into a small one">
          <p className="text-slate-300">
            A tensor of FP16 weights might range from −0.5 to +0.5. INT8 can only hold integers from −128 to
            +127. To use INT8, you multiply every weight by a <em>scale factor</em>, round to the nearest
            integer, and store both the integers and one scale. To do math, you multiply back.
          </p>
          <Example title="Symmetric quantization in four lines">{`scale  = tensor.abs().max() / 127
q_int  = torch.round(tensor / scale).clamp(-128, 127).to(torch.int8)   # store this
# ...
w_hat  = q_int.to(torch.float16) * scale   # dequantize when computing`}</Example>
        </ContentStep>
        <ContentStep number={2} title="Blocks — one scale is not enough">
          <p className="text-slate-300">
            One scale for the whole tensor is a crude fit — a few outlier weights make everyone else round to
            zero. Modern schemes split the tensor into <strong className="text-white">blocks</strong> of 32,
            64, or 128 weights and store a separate scale per block. Extra metadata is tiny; quality recovery
            is huge.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="When quantization happens — three families">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Family</th>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Needs data?</th>
                <th className="px-4 py-3">Popular schemes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Post-training quantization (PTQ)', 'After training, one-shot', 'A small calibration set (~128 samples)', 'GPTQ, AWQ, SmoothQuant, K-quants (GGUF)'],
                ['Weight-only, on-the-fly', 'At load time; no calibration', 'No', 'bitsandbytes (LLM.int8, NF4), llama.cpp Q4/Q5/Q8'],
                ['Quantization-aware training (QAT)', 'During training / fine-tuning', 'Full training data', 'QLoRA (NF4 storage, BF16 compute), QAT recipes'],
              ].map(([fam, when, data, ex]) => (
                <tr key={fam}>
                  <td className="px-4 py-3 font-semibold text-white">{fam}</td>
                  <td className="px-4 py-3 text-slate-400">{when}</td>
                  <td className="px-4 py-3 text-slate-400">{data}</td>
                  <td className="px-4 py-3 text-slate-400">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="The 90% workflow">
          Most teams never train a quantized model — they take an FP16 model someone else trained, run PTQ (AWQ
          or GPTQ) to 4-bit for serving, and that is it. QAT / QLoRA is used when you also want to fine-tune
          under the same tight memory budget.
        </Callout>
      </LessonSection>

      <LessonSection title="Weight-only vs weight+activation">
        <ContentStep number={1} title="Weight-only quantization">
          <p className="text-slate-300">
            Only the model weights are stored in low precision. Activations (the numbers flowing between layers
            at runtime) stay in FP16. This is by far the most common serving setup — GPTQ, AWQ, GGUF Q4/Q5/Q8,
            NF4 all live here. Great memory savings, minimal quality drop.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Weight + activation quantization (W8A8)">
          <p className="text-slate-300">
            Both weights and activations run in low precision. The GPU can use dedicated integer tensor cores,
            which is a real <em>speedup</em>, not just a memory saving. Harder because activations have
            outliers per input, and one bad outlier ruins the block. SmoothQuant, FP8, and INT8-inference
            engines address this.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Popular schemes in one glance">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Scheme</th>
                <th className="px-4 py-3">Bits</th>
                <th className="px-4 py-3">Ecosystem</th>
                <th className="px-4 py-3">Sweet spot</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['GPTQ',        '4',        'HF, vLLM, TGI',            'Highest-quality 4-bit PTQ on GPUs'],
                ['AWQ',         '4',        'HF, vLLM, TGI',            'Activation-aware — often the best 4-bit for chat models'],
                ['GGUF Q4_K_M', '~4.8',     'llama.cpp, Ollama, LM Studio', 'Default for local/CPU/laptop inference'],
                ['NF4 (QLoRA)', '4',        'bitsandbytes',             'Fine-tuning big models on a single GPU'],
                ['LLM.int8()',  '8',        'bitsandbytes',             'Zero-config load-time 8-bit'],
                ['SmoothQuant', '8 (W+A)',  'Vendor stacks',            'True INT8 speedup for serving'],
                ['FP8',         '8',        'H100 / Blackwell, TensorRT-LLM', 'Datacentre inference on modern GPUs'],
              ].map(([s, b, e, sw]) => (
                <tr key={s}>
                  <td className="px-4 py-3 font-semibold text-white">{s}</td>
                  <td className="px-4 py-3 text-slate-400">{b}</td>
                  <td className="px-4 py-3 text-slate-400">{e}</td>
                  <td className="px-4 py-3 text-slate-400">{sw}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-slate-300">
          The <em>llama.cpp Quantization Deep Dive</em> lesson goes deep on the GGUF Q4_K_M family; the{' '}
          <em>vLLM Quantization</em> lesson goes deep on AWQ/GPTQ for GPU serving. This lesson is the
          framework-agnostic mental model that unifies them.
        </p>
      </LessonSection>

      <LessonSection title="Where does the quality actually go?">
        <p className="text-slate-300">
          For a modern PTQ scheme (AWQ, GPTQ, K-quants) on a &gt;=7B model, the typical numbers are:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
          <li><strong className="text-white">INT8</strong> — indistinguishable from FP16 on almost every eval.</li>
          <li><strong className="text-white">4-bit (Q4_K_M / AWQ)</strong> — typically &lt;1% degradation on MMLU-style benchmarks, sometimes 1–3% on hard reasoning tasks.</li>
          <li><strong className="text-white">3-bit and below</strong> — noticeable quality drop, especially for coding and math. Use only when memory forces it.</li>
          <li><strong className="text-white">Smaller models suffer more</strong> — a 1B model at INT4 loses more than a 70B at INT4. Capacity to spare hides quantization error.</li>
        </ul>
        <Callout variant="insight" title="Bigger + more-quantized often beats smaller + full precision">
          A 70B model in INT4 fits the same VRAM as a 13B model in FP16 — and usually wins on quality. When
          you have a memory budget, prefer <em>a bigger quantized model</em> over a smaller full-precision
          one.
        </Callout>
      </LessonSection>

      <LessonSection title="Choosing what to use — a two-minute decision">
        <Flowchart
          title="Which quantization?"
          chart={`flowchart TB
  Q{Where are you running?}
  Q -- Laptop / CPU / edge --> A[GGUF Q4_K_M via llama.cpp / Ollama]
  Q -- One GPU, serving --> B[AWQ 4-bit via vLLM or TGI]
  Q -- Multi-GPU, high throughput --> C[FP8 or INT8 W+A on H100+ via TensorRT-LLM]
  Q -- Fine-tuning a big model --> D[QLoRA with NF4 storage, BF16 compute]
  Q -- Absolute best quality, budget unlimited --> E[FP16 / BF16, no quantization]`}
        />
      </LessonSection>

      <LessonSection title="Pitfalls that catch people out">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Bad calibration set</strong> — PTQ methods use a small sample to fit scales. Calibrate on data that looks like production, or you get worst-case quality drops.</li>
          <li><strong className="text-white">Ignoring the KV cache</strong> — a 4-bit model still runs a 16-bit KV cache by default. For long contexts, the cache dwarfs the weights. Look for KV-cache quantization (FP8 KV in vLLM, Q8_0 KV in llama.cpp).</li>
          <li><strong className="text-white">Tokenizer-only regressions</strong> — sometimes a quantized model looks worse only because the eval prompt template changed. Diff the templates before blaming the bits.</li>
          <li><strong className="text-white">Quantized weights are read-only</strong> — you cannot &ldquo;fine-tune&rdquo; a Q4 GGUF directly. Fine-tune with QLoRA in NF4 or LoRA on top of an FP16 base, then merge and re-quantize.</li>
          <li><strong className="text-white">Not every layer likes quantization</strong> — embedding, LM head, and small layers are usually kept in higher precision. Good schemes do this for you; watch out if you write your own.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Quantization stores model weights in fewer bits (INT8, INT4). It is the difference between "runs on a phone" and "needs a datacentre".',
          'Two mental primitives: a scale that maps floats into a smaller integer range, and per-block scales so a few outliers do not ruin everything.',
          'Weight-only PTQ (GPTQ, AWQ, GGUF K-quants, NF4) is the workhorse: no retraining, small quality hit, huge memory savings.',
          'Weight+activation (SmoothQuant, FP8) also delivers real speedups by using integer tensor cores.',
          'INT8 ≈ lossless; 4-bit typically <1% off on modern schemes; below 3-bit hurts. Bigger-quantized usually beats smaller-full-precision at the same VRAM budget.',
          'Match the scheme to the target: GGUF for laptops, AWQ/GPTQ for GPU serving, FP8 for H100+, QLoRA for fine-tuning under memory pressure.',
        ]}
      />
    </LessonArticle>
  )
}
