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

export function GpuOffloadingAndLayerSplit() {
  return (
    <LessonArticle>
      <Definition term="GPU offloading (-ngl)">
        <p>
          The <code className="font-mono text-sm">-ngl</code> flag (also{' '}
          <code className="font-mono text-sm">--n-gpu-layers</code>) tells llama.cpp how many transformer layers to
          run on the GPU. Remaining layers stay on CPU. This is the main knob for fitting a model on hardware that
          cannot hold the full weights in VRAM.
        </p>
      </Definition>

      <LessonSection title="How layer offloading works">
        <Flowchart
          title="Partial CPU + GPU execution"
          chart={`flowchart TB
  A[Input tokens] --> B[Layers 1–N on GPU]
  B --> C[Layers N+1–L on CPU]
  C --> D[Output logits]
  VRAM[GPU VRAM] -.-> B
  RAM[System RAM] -.-> C`}
        />
        <p className="mt-4 text-slate-300">
          Each transformer layer has weights and activations. Layers on the GPU use VRAM and CUDA/Metal/Vulkan
          kernels — fast. Layers on CPU use system RAM — slower but unlimited compared to a small GPU. Data moves
          between CPU and GPU at each boundary, so partial offload is a trade-off, not free speed.
        </p>
      </LessonSection>

      <LessonSection title="Choosing -ngl values">
        <div className="mt-2 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Flag value</th>
                <th className="px-4 py-3">Meaning</th>
                <th className="px-4 py-3">When to use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['-ngl 0', 'All layers on CPU', 'No GPU, or debugging'],
                ['-ngl 20', 'First 20 layers on GPU', 'Limited VRAM — start here and tune'],
                ['-ngl 99', 'All layers that fit on GPU', 'Enough VRAM for full model'],
              ].map(([flag, meaning, when]) => (
                <tr key={flag} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-xs text-genai-400">{flag}</td>
                  <td className="px-4 py-3 text-slate-400">{meaning}</td>
                  <td className="px-4 py-3 text-slate-400">{when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Example title="Try increasing layers until VRAM is full">{`# Start conservative
./llama-cli -m model-Q4_K_M.gguf -p "Hello" -ngl 10

# Increase until you hit OOM, then back off a few layers
./llama-cli -m model-Q4_K_M.gguf -p "Hello" -ngl 35

# Full offload when VRAM allows
./llama-server -m model-Q4_K_M.gguf --port 8080 -ngl 99`}</Example>
        <Callout variant="tip">
          Use <code className="font-mono text-sm">nvidia-smi</code> (NVIDIA) or Activity Monitor (Apple Silicon) while
          loading. If the process crashes with out-of-memory, lower <code className="font-mono text-sm">-ngl</code> or
          use a smaller quant (Q4 instead of Q8).
        </Callout>
      </LessonSection>

      <LessonSection title="When full offload isn't possible">
        <ContentStep number={1} title="VRAM is smaller than the model">
          <p>
            A 7B Q4 model needs roughly 5–6 GB for weights alone, plus KV cache and scratch space. An 8 GB GPU may
            not fit all layers — use partial <code className="font-mono text-sm">-ngl</code> or a more aggressive
            quant (Q3, Q2).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Context length eats VRAM">
          <p>
            Larger <code className="font-mono text-sm">-c</code> (context) grows the KV cache on GPU. You might fit
            full offload at 4K context but need fewer GPU layers at 32K.
          </p>
        </ContentStep>
        <ContentStep number={3} title="CPU fallback is still useful">
          <p>
            Partial GPU offload is often 2–5× faster than pure CPU. For laptops with integrated graphics or 6 GB
            cards, <code className="font-mono text-sm">-ngl 15</code> can be the sweet spot.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Split mode (multi-GPU)">
        <Definition term="Split mode">
          <p>
            When you have <strong className="text-white">multiple GPUs</strong>, llama.cpp can split layers across
            them with <code className="font-mono text-sm">--split-mode</code> (e.g.{' '}
            <code className="font-mono text-sm">layer</code> or <code className="font-mono text-sm">row</code>).
            Layer split assigns contiguous layer ranges to each GPU — common for running 70B models across two 24 GB
            cards.
          </p>
        </Definition>
        <CodeBlock title="Two-GPU layer split (conceptual)">{`./llama-server \\
  -m Llama-3-70B-Q4_K_M.gguf \\
  --split-mode layer \\
  -ngl 80 \\
  -ts 0.5,0.5    # tensor split ratio per GPU`}</CodeBlock>
        <Callout variant="beginner" title="Start simple">
          Most beginners only need <code className="font-mono text-sm">-ngl</code> on a single GPU. Explore split
          mode when one card cannot hold the model even at minimum quant.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          '-ngl / --n-gpu-layers controls how many transformer layers run on the GPU; the rest run on CPU.',
          'Increase -ngl until VRAM is nearly full, then back off if you get OOM errors.',
          'Partial offload trades CPU↔GPU data movement for fitting larger models on small GPUs.',
          'Split mode spreads layers across multiple GPUs when a single card is not enough.',
        ]}
      />
    </LessonArticle>
  )
}
