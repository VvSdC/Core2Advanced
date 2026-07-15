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

export function QloraPart1Basics() {
  return (
    <LessonArticle>
      <Definition term="QLoRA">
        <p>
          <strong className="text-white">QLoRA</strong> (Quantized LoRA) loads the huge base model in{' '}
          <strong className="text-white">4-bit</strong> precision to save VRAM, then trains normal LoRA
          adapters in higher precision (e.g. BF16/FP16). You keep most of LoRA&apos;s quality benefits while
          fitting far larger models on consumer GPUs.
        </p>
      </Definition>

      <LessonSection title="The problem — even LoRA bases are big in FP16">
        <p className="text-slate-300">
          LoRA freezes W, so you avoid gradients and optimizer states for the base. But you still need the{' '}
          <strong className="text-white">base weights in VRAM</strong> for the forward and backward through
          frozen layers. A 7B model in FP16 is still ~14 GB before activations and adapter training overhead.
          A 70B model in FP16 is enormous — far beyond a single 24 GB card.
        </p>
        <Callout variant="beginner" title="Analogy: reading a thick encyclopedia">
          LoRA says you only need a thin notepad of edits. QLoRA says: keep the encyclopedia on a compressed
          shelf (4-bit) while you scribble on the notepad in clear handwriting (higher-precision adapters).
          You still use the books, but they take much less shelf space.
        </Callout>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-slate-400">Rough base-weight footprints (weights only)</div>
          <div className="mt-2 text-slate-300">7B FP16 ≈ 14 GB · 7B 4-bit ≈ 3.5–4 GB</div>
          <div className="mt-1 text-slate-300">13B FP16 ≈ 26 GB · 13B 4-bit ≈ 6.5–7 GB</div>
          <div className="mt-1 text-genai-400">70B FP16 ≈ 140 GB · 70B 4-bit ≈ ~35 GB (+ sharding / bigger GPUs)</div>
        </div>
      </LessonSection>

      <LessonSection title="What QLoRA actually does">
        <ContentStep number={1} title="Load base in 4-bit">
          <p>
            Weights are quantized (often NF4 — details next lesson) so each parameter uses roughly 4 bits
            instead of 16. Storage shrinks ~4× vs FP16.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Keep computation workable">
          <p>
            During the forward/backward, dequantized (or mixed) compute happens so math stays usable. You are
            not training the 4-bit weights themselves as primary trainable params.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Train LoRA in higher precision">
          <p>
            Adapters A/B (and optimizer states for them) stay in BF16/FP16/FP32 as configured. The learning
            happens in the small adapter, just like LoRA — only the frozen base storage is cheaper.
          </p>
        </ContentStep>
        <Example title="One-line mental model">{`QLoRA = (4-bit frozen base) + (normal LoRA adapters)

Not: "train the whole model in 4-bit."
Yes: "store the frozen giant cheaply; train the tiny plug-in carefully."`}</Example>
      </LessonSection>

      <LessonSection title="Why 7B / 13B / 70B become realistic">
        <p className="text-slate-300">
          Consumer GPUs (12–24 GB) can often fine-tune <strong className="text-white">7B and sometimes
          13B</strong> with QLoRA depending on sequence length and batch size. Larger cards or multi-GPU setups
          open <strong className="text-white">34B–70B</strong> QLoRA. That is why QLoRA became the default story
          for open-weight fine-tuning on personal hardware.
        </p>
        <Flowchart
          title="High-level memory saving"
          chart={`flowchart TB
  subgraph before ["LoRA with FP16 base"]
    B1[FP16 base weights — large]
    B2[LoRA adapters — small]
    B3[Activations + opt for adapters]
    B1 --> GPU1[Needs big VRAM]
    B2 --> GPU1
    B3 --> GPU1
  end
  subgraph after ["QLoRA"]
    Q1[4-bit base weights — much smaller]
    Q2[LoRA adapters — small, higher precision]
    Q3[Activations + opt for adapters]
    Q1 --> GPU2[Fits consumer GPUs more often]
    Q2 --> GPU2
    Q3 --> GPU2
  end`}
        />
      </LessonSection>

      <LessonSection title="What still costs VRAM in QLoRA">
        <p className="text-slate-300">
          QLoRA is not &quot;free training.&quot; Long contexts, large micro-batches, and big ranks still inflate{' '}
          <strong className="text-white">activations</strong> and adapter optimizer states. Gradient checkpointing
          and shorter sequences are your friends on 12–16 GB cards.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Sequence length</strong> — 2048 vs 8192 can be the difference between
            training and OOM even with a 4-bit base.
          </li>
          <li>
            <strong className="text-white">Batch size</strong> — start at 1 and use gradient accumulation to
            simulate a larger effective batch.
          </li>
          <li>
            <strong className="text-white">Rank / target modules</strong> — all-linear at r=64 costs more than
            q/v at r=16; scale up only after a successful dry-run.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Quality tradeoff — honest note">
        <p className="text-slate-300">
          4-bit storage is an approximation. In practice, well-tuned QLoRA is often{' '}
          <strong className="text-white">surprisingly close</strong> to 16-bit LoRA on many instruction tasks —
          that was a key claim of the QLoRA paper — but it is not magic. Extremely sensitive tasks, very low
          ranks, aggressive sequence lengths, or poor data can amplify any quality gap. Always compare on{' '}
          <em>your</em> eval set, not vibes alone.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-emerald-400">Usually fine with QLoRA</p>
            <p className="mt-1 text-sm text-slate-400">
              Instruction following, domain tone, FAQ bots, light code style adaptation — given decent data.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-amber-400">Stress-test carefully</p>
            <p className="mt-1 text-sm text-slate-400">
              Hard math, brittle JSON schemas, safety-critical refusal behavior — keep a side-by-side vs base
              and vs 16-bit LoRA if you can afford it.
            </p>
          </div>
        </div>
        <Callout variant="insight" title="When to prefer plain LoRA">
          If the base already fits in VRAM in BF16/FP16 with comfortable headroom for your batch size, plain
          LoRA is simpler (fewer moving parts). Reach for QLoRA when memory is the blocker.
        </Callout>
        <Callout variant="tip" title="What is next">
          Part 2 explains <strong className="text-white">NF4</strong>, double quantization, paged optimizers,
          a <code className="font-mono text-sm">BitsAndBytesConfig</code> example, and a rough VRAM comparison
          table across full FT / LoRA / QLoRA.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Even with LoRA, an FP16/BF16 base can dominate VRAM — 7B ≈ 14 GB for weights alone.',
          'QLoRA stores the frozen base in 4-bit and trains LoRA adapters in higher precision.',
          'That combo enables fine-tuning 7B/13B (and larger) on much smaller GPUs than full FT.',
          'Quality is usually strong vs 16-bit LoRA, but always verify on your own evaluation set.',
        ]}
      />
    </LessonArticle>
  )
}
