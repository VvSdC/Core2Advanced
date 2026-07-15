import {
  Callout,
  CodeBlock,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function UnslothOptimizationTricks() {
  return (
    <LessonArticle>
      <Definition term="Unsloth optimization tricks">
        <p>
          Practical levers — <strong className="text-white">4-bit loading</strong>, gradient checkpointing,
          packing, RSLoRA, LoftQ, and shorter debug sequences — that shrink VRAM and wall-clock time. Plus common
          CUDA install pitfalls and how you export adapters or merged weights afterward.
        </p>
      </Definition>

      <Callout variant="beginner" title="Optimize after correctness">
        First get a tiny run that produces sane outputs. Then flip efficiency knobs. Tuning packing and LoftQ while
        the chat template is wrong wastes a weekend.
      </Callout>

      <LessonSection title="Memory & speed levers (high level)">
        <ContentStep number={1} title="4-bit loading (QLoRA-style)">
          <p className="text-slate-300">
            Load base weights in 4-bit (often via bitsandbytes) so the frozen backbone fits in less VRAM while LoRA
            trains in higher precision. This is the main reason 7B–8B SFT fits on mid-range GPUs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Gradient checkpointing">
          <p className="text-slate-300">
            Recompute activations during backward instead of storing all of them. Trades compute for memory —
            slower step, larger batch or longer sequences possible. Unsloth often exposes a convenient flag on
            PEFT setup.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Packing">
          <p className="text-slate-300">
            Pack multiple short samples into one sequence to raise tokens-per-second. Great when many examples are
            far shorter than <code className="font-mono text-sm">max_seq_length</code>. Enable once formatting is
            correct.
          </p>
        </ContentStep>
        <ContentStep number={4} title="RSLoRA (rank-stabilized LoRA)">
          <p className="text-slate-300">
            A LoRA scaling variant that behaves more stably across ranks. Helps when you sweep{' '}
            <span className="text-genai-400">r</span> without retuning alpha by hand. Check Unsloth/PEFT docs for
            the current flag name.
          </p>
        </ContentStep>
        <ContentStep number={5} title="LoftQ (high level)">
          <p className="text-slate-300">
            Initializes LoRA adapters with quantization-aware methods so the starting point compensates for 4-bit
            error. Can improve QLoRA quality in some setups; optional, not mandatory for first experiments.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Speed up iteration while debugging">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Drop <strong className="text-white">max_seq_length</strong> to 512 (or less) until loss curves and
            sample generations look sane.
          </li>
          <li>
            Train on <strong className="text-white">100–500 examples</strong> first — prove the pipeline.
          </li>
          <li>
            Use tiny <strong className="text-white">max_steps</strong> (e.g. 20–50) for smoke tests.
          </li>
          <li>
            Only then restore full length, full data, and overnight budgets.
          </li>
        </ul>
        <CodeBlock title="Debug vs full train (concept)">{`# Debug
max_seq_length = 512
max_steps = 30
# subset = dataset.select(range(200))

# Full
max_seq_length = 2048  # or 4096 if VRAM allows
num_train_epochs = 1
# full dataset`}</CodeBlock>
      </LessonSection>

      <LessonSection title="Common Unsloth / CUDA install pitfalls">
        <Flowchart
          title="Install pain → usual causes"
          chart={`flowchart TD
  F[Import / CUDA error] --> V{Version conflict?}
  V -->|Torch vs CUDA mismatch| M[Install matching torch+cuda wheel]
  V -->|bnb / xformers build| B[Pin known-good combo from Unsloth docs]
  F --> G{Wrong GPU visible?}
  G -->|Yes| D[Check drivers, CUDA_VISIBLE_DEVICES]
  F --> W{Windows vs Linux?}
  W -->|WSL / Linux preferred| L[Prefer Linux-like env for CUDA tooling]
  M --> R[Re-test tiny train]
  B --> R
  D --> R
  L --> R`}
        />
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Torch / CUDA mismatch</strong> — most common. Follow Unsloth’s pinned
            install lines for your CUDA version.
          </li>
          <li>
            <strong className="text-white">bitsandbytes issues</strong> — 4-bit path breaks; symptoms look like
            Unsloth failures but are environment.
          </li>
          <li>
            <strong className="text-white">Multiple Python envs</strong> — Jupyter kernel ≠ terminal pip.
          </li>
          <li>
            <strong className="text-white">OOM at load</strong> — wrong model size for VRAM; try smaller instruct
            checkpoint or ensure 4-bit load is actually on.
          </li>
        </ul>
        <Callout variant="tip">
          When stuck, reproduce with Unsloth’s own Colab/notebook for the model class. If it works there and not
          locally, it is almost always environment pinning.
        </Callout>
      </LessonSection>

      <LessonSection title="Export / merged model options">
        <p className="text-slate-300">
          After training you typically choose one of:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Save LoRA adapter only</strong> — smallest artifact; serve with PEFT load
            or vLLM multi-LoRA.
          </li>
          <li>
            <strong className="text-white">Merge into base</strong> — single full-weight model for simple
            deployment or GGUF conversion.
          </li>
          <li>
            <strong className="text-white">Quantized export</strong> — e.g. GGUF / other formats via Unsloth helpers
            or external converters (details evolve — check docs).
          </li>
        </ul>
        <Callout variant="insight">
          Keep the adapter even if you merge. Adapters are cheap to store and easy to A/B; merges are harder to
          “unmerge” for experiments.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          '4-bit + LoRA + checkpointing are the main VRAM wins; packing and RSLoRA/LoftQ are secondary boosts.',
          'Debug with short max_seq_length and tiny steps before full runs.',
          'Most Unsloth installs fail from Torch/CUDA/bnb pinning, not from LoRA math.',
          'Export adapter, merge, and/or quantize depending on how you will serve.',
        ]}
      />
    </LessonArticle>
  )
}
