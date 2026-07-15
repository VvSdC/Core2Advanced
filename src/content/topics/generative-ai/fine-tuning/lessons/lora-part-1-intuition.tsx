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

export function LoraPart1Intuition() {
  return (
    <LessonArticle>
      <Definition term="LoRA (Low-Rank Adaptation)">
        <p>
          <strong className="text-white">LoRA</strong> freezes the original weight matrix{' '}
          <strong className="text-white">W</strong> and learns a small &quot;correction&quot; as the product of
          two thin matrices <strong className="text-white">B</strong> and{' '}
          <strong className="text-white">A</strong>. Instead of updating billions of numbers, you train a
          compact adapter that steers the model toward your task.
        </p>
      </Definition>

      <LessonSection title="The core picture — no heavy math yet">
        <p className="text-slate-300">
          Inside a neural network, layers multiply their inputs by big tables of numbers called{' '}
          <strong className="text-white">weight matrices</strong>. Full fine-tuning changes those whole tables.
          LoRA says: leave the table alone; add a small correction made from two skinny matrices.
        </p>
        <Callout variant="beginner" title="Analogy: editing a huge spreadsheet">
          Imagine a 4,096 × 4,096 spreadsheet of preferences the model already learned. Changing every cell is
          expensive. LoRA says: keep the spreadsheet fixed, and learn a thin &quot;delta&quot; that captures
          the <em>direction</em> of the change you care about — like storing a short recipe that reconstructs
          the edit instead of rewriting every cell.
        </Callout>
      </LessonSection>

      <LessonSection title="Frozen W, trainable A and B">
        <ContentStep number={1} title="W stays frozen">
          <p>
            The pretrained weights <code className="font-mono text-sm">W</code> do not receive gradient updates.
            They keep all the general knowledge from pretraining.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Train small A and B">
          <p>
            You introduce matrices <code className="font-mono text-sm">A</code> and{' '}
            <code className="font-mono text-sm">B</code> that are much thinner / shorter than{' '}
            <code className="font-mono text-sm">W</code>. Only these (plus any bias/adapter-side knobs) are
            trainable. Optimizer states and gradients exist mostly for these tiny tensors.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Forward pass uses W + BA">
          <p>
            At inference (and training), the layer behaves like{' '}
            <strong className="text-white">original path + adapter path</strong>. The model output shifts
            toward your domain without replacing W.
          </p>
        </ContentStep>
        <Example title="Toy sizes (intuition only)">{`Suppose W is 4096 × 4096  → millions of numbers
Pick rank r = 8 (a small "width" for the correction)

A is r × 4096   → 8 × 4096
B is 4096 × r   → 4096 × 8

Trainable params ≈ 2 × 4096 × 8  (tiny vs W)
The product B @ A is still 4096 × 4096, but it was
"compressed" through the narrow rank-r bottleneck.`}</Example>
      </LessonSection>

      <LessonSection title="Rank analogy — a thin correction layer">
        <p className="text-slate-300">
          <strong className="text-white">Rank</strong> (usually written <code className="font-mono text-sm">r</code>)
          is how wide that bottleneck is. A tiny rank is like summarizing a movie in one sentence — you capture
          the main plot but miss details. A larger rank is a longer summary — more capacity to represent complex
          behavior changes.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Low rank (e.g. r=8)</p>
            <p className="mt-1 text-sm text-slate-400">
              Very small adapters, fast to train, often enough for style, format, or domain tone shifts.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Higher rank (e.g. r=64)</p>
            <p className="mt-1 text-sm text-slate-400">
              More capacity for complex skills (multi-step tools, new languages of code). Still far smaller than
              full W.
            </p>
          </div>
        </div>
        <Callout variant="tip" title="Why tiny adapters can steer a huge model">
          Pretraining already built most of the capability. Fine-tuning usually needs only a{' '}
          <em>directional nudge</em> in weight space — not a rewrite. Low-rank updates are enough for that nudge
          in a surprising number of real tasks.
        </Callout>
      </LessonSection>

      <LessonSection title="Visual flowchart — the W + BA path">
        <Flowchart
          title="LoRA forward pass (intuition)"
          chart={`flowchart LR
  X[Input x] --> Wpath[Multiply by frozen W]
  X --> Apath[Multiply by A then B]
  Wpath --> Sum[Add outputs]
  Apath --> Sum
  Sum --> Y[Layer output y]
  note1[W never updates]
  note2[Only A and B train]
  note1 -.-> Wpath
  note2 -.-> Apath`}
        />
        <p className="mt-4 text-slate-300">
          You can read this as two parallel lanes: the <strong className="text-white">highway</strong> (frozen
          pretrained behavior) and a <strong className="text-white">service road</strong> (the learned
          correction). Together they form the adapted layer.
        </p>
      </LessonSection>

      <LessonSection title="What you get as files and workflows">
        <p className="text-slate-300">
          After training, you usually save a small adapter checkpoint (megabytes to a few hundred MB), not a
          full 14 GB model duplicate. You can keep adapters separate for multi-tenant serving, or merge them
          into W later for a single file.
        </p>
        <Callout variant="insight" title="Part 1 boundary">
          No formulas with alpha yet, no module names, no HuggingFace configs. Part 2 covers the exact update
          rule and knobs; Part 3 covers practical recipes. If you only remember one sentence from this lesson:{' '}
          <em>LoRA steers a frozen giant model with a thin trainable correction BA.</em>
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'LoRA = Low-Rank Adaptation: freeze W, train small matrices A and B.',
          'The layer path is effectively original W plus a low-rank correction BA.',
          'Rank r is the bottleneck width — tiny adapters often suffice because the model is already capable.',
          'Adapters are small files you can swap, share, or merge later.',
        ]}
      />
    </LessonArticle>
  )
}
