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

export function PeftOverview() {
  return (
    <LessonArticle>
      <Definition term="Parameter-Efficient Fine-Tuning (PEFT)">
        <p>
          <strong className="text-white">PEFT</strong> is a family of techniques that adapt a large pretrained
          model to a new task by training only a{' '}
          <strong className="text-white">tiny fraction of parameters</strong> — often less than 1% — while
          keeping the original weights frozen. LoRA and QLoRA are the PEFT methods you will use most often.
        </p>
      </Definition>

      <LessonSection title="What fine-tuning means (no ML jargon)">
        <p className="text-slate-300">
          A base model like Llama-3 8B already knows language, reasoning, and a huge amount of general knowledge.
          <strong className="text-white"> Fine-tuning</strong> means continuing training on{' '}
          <em>your</em> examples so it behaves the way you want — answer in a company tone, follow a legal
          template, write SQL in your schema style, or refuse certain topics.
        </p>
        <Callout variant="beginner" title="Analogy: tutoring, not rebuilding the brain">
          Think of the pretrained model as an experienced employee. Full fine-tuning rewires almost everything
          they know. PEFT is like giving them a short job manual and a few practiced habits — the employee
          stays the same person, but now handles your workflow better.
        </Callout>
      </LessonSection>

      <LessonSection title="Why a 7B full fine-tune needs huge VRAM">
        <p className="text-slate-300">
          GPU memory (VRAM) is the scarce resource. During training you need more than just the model weights.
          You must store <strong className="text-white">gradients</strong> (how to update each weight) and{' '}
          <strong className="text-white">optimizer states</strong> (extra numbers Adam keeps per parameter —
          often 2× the weights).
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">What sits in VRAM</th>
                <th className="px-4 py-3">Rough idea for 7B FP16</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Model weights', '~14 GB (7B params × 2 bytes)'],
                ['Gradients (same size as weights)', '~14 GB'],
                ['Optimizer states (Adam ~2×)', '~28 GB'],
                ['Activations / batch overhead', 'Several more GB'],
                ['Total (order of magnitude)', 'Often 60–100+ GB — multi-GPU territory'],
              ].map(([what, size]) => (
                <tr key={what} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{what}</td>
                  <td className="px-4 py-3 text-slate-400">{size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-slate-300">
          So &quot;I have a 24 GB consumer GPU&quot; is usually <em>not</em> enough for full fine-tuning of a
          7B model in FP16 with a serious optimizer — even before batch size. That is the problem PEFT exists
          to solve.
        </p>
      </LessonSection>

      <LessonSection title="The adapter pattern — a plug-in for the model">
        <p className="text-slate-300">
          PEFT borrows an idea engineers already use: <strong className="text-white">adapters</strong>. Keep
          the big system frozen. Attach a small plug-in that learns the new behavior. Swap plug-ins without
          replacing the whole system.
        </p>
        <Flowchart
          title="Full fine-tune vs PEFT adapter"
          chart={`flowchart TB
  subgraph full ["Full fine-tuning"]
    F1[Load 7B weights] --> F2[Train ALL parameters]
    F2 --> F3[Huge VRAM + one new full model copy]
  end
  subgraph peft ["PEFT / adapter pattern"]
    P1[Load 7B weights — FROZEN] --> P2[Train tiny adapter only]
    P2 --> P3[Megabytes of adapter files]
    P3 --> P4[Same base + many adapters]
  end`}
        />
        <ContentStep number={1} title="Freeze the foundation">
          <p>
            Base weights are locked. Training does not move the billions of original parameters — so you do not
            store gradients/optimizer states for them.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Train only the plug-in">
          <p>
            A few million (or less) new parameters learn the task. Memory and time drop dramatically; you can
            keep many specialist adapters for one shared base model.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Compose or swap">
          <p>
            Serve customer A with adapter A, customer B with adapter B — same base in memory. Or merge one
            adapter into the base later for simpler deployment.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Where this lesson series goes next">
        <p className="text-slate-300">
          This page is the landing lesson. The next parts dig into <strong className="text-white">LoRA</strong>{' '}
          (the most popular PEFT method), then <strong className="text-white">QLoRA</strong> (LoRA + 4-bit base
          for consumer GPUs), then related variants and how to avoid catastrophic forgetting.
        </p>
        <Example title="Mental map — what you will learn">{`PEFT overview (you are here)
  → LoRA Part 1: intuition (frozen W + tiny A, B)
  → LoRA Part 2: mechanics (rank, alpha, target modules)
  → LoRA Part 3: practical configs (recipes + HuggingFace peft)
  → QLoRA Part 1: 4-bit base + LoRA training
  → QLoRA Part 2: NF4, double quant, VRAM tables
  → Variants (DoRA, LoRA+, …) — when to care
  → Catastrophic forgetting & healthy training loops`}</Example>
        <Callout variant="insight" title="Start with PEFT, not full fine-tunes">
          For almost every product team starting on 7B–70B open models, the default path is{' '}
          <strong className="text-white">LoRA or QLoRA</strong>, not full fine-tuning. Full FT is reserved for
          research labs, huge budgets, or rare cases where adapters honestly are not enough.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'PEFT adapts huge models by training a tiny fraction of parameters while freezing the base.',
          'Full fine-tuning of 7B needs weights + gradients + optimizer states — often 60–100+ GB VRAM.',
          'Adapters are plug-ins: one shared base, many small task files you can swap or merge.',
          'LoRA / QLoRA (next lessons) are the practical PEFT defaults for beginners and production teams.',
        ]}
      />
    </LessonArticle>
  )
}
