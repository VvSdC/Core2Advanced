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

export function LoraPart2Mechanics() {
  return (
    <LessonArticle>
      <Definition term="LoRA update rule">
        <p>
          The adapted weight is often written as{' '}
          <strong className="text-white">
            W′ = W + (α / r) · (B @ A)
          </strong>
          . <code className="font-mono text-sm">W</code> stays frozen.{' '}
          <code className="font-mono text-sm">B @ A</code> is the learned low-rank update.{' '}
          <code className="font-mono text-sm">α / r</code> scales how strongly that update applies.
        </p>
      </Definition>

      <LessonSection title="Reading the formula in plain English">
        <ContentStep number={1} title="W — the frozen base">
          <p>
            Pretrained knowledge. Never updated during LoRA training. Same numbers whether you are on epoch 1
            or epoch 10.
          </p>
        </ContentStep>
        <ContentStep number={2} title="B @ A — the correction">
          <p>
            Matrix multiply of the two adapter pieces. Shape matches W, but the correction is forced to live in
            a low-rank &quot;skinny&quot; structure controlled by rank <code className="font-mono text-sm">r</code>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="α / r — the volume knob">
          <p>
            <strong className="text-white">Alpha (α)</strong> scales the adapter contribution.{' '}
            Dividing by <code className="font-mono text-sm">r</code> keeps the update magnitude more stable when
            you change rank — a common design so recipes transfer across r values.
          </p>
        </ContentStep>
        <Example title="Conceptual (shapes, not runnable math)">{`W:  d_out × d_in     (frozen)
A:  r × d_in         (trainable)
B:  d_out × r        (trainable)

delta = B @ A            # same shape as W, but low-rank
W_effective = W + (alpha / r) * delta

# Forward: y = x @ W_effective.T  (or equivalent fused form)`}</Example>
      </LessonSection>

      <LessonSection title="What rank r means practically (capacity)">
        <p className="text-slate-300">
          Rank is not &quot;accuracy magic.&quot; It is <strong className="text-white">how expressive the
          adapter is allowed to be</strong>. Higher r → more trainable parameters → more room to represent
          complex shifts — and slightly more VRAM / training cost.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Rank r</th>
                <th className="px-4 py-3">Capacity vibe</th>
                <th className="px-4 py-3">Typical use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['8', 'Light nudge', 'Style, tone, short instruction formatting'],
                ['16', 'Default mid', 'Many chat / domain adapters'],
                ['32–64', 'Heavier skill shift', 'Harder domains; more diverse datasets'],
                ['128+', 'Rarely needed first', 'Only if lower r clearly underfits'],
              ].map(([r, vibe, use]) => (
                <tr key={r} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{r}</td>
                  <td className="px-4 py-3 text-slate-400">{vibe}</td>
                  <td className="px-4 py-3 text-slate-400">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          If your eval does not improve when you double r, the bottleneck is usually data quality or prompts —
          not rank. Do not climb r blindly.
        </Callout>
      </LessonSection>

      <LessonSection title="What alpha does (scale of the update)">
        <p className="text-slate-300">
          Think of α as how loud the adapter is relative to the frozen base. With the common{' '}
          <code className="font-mono text-sm">(α / r)</code> scaling, a popular recipe is{' '}
          <strong className="text-white">α = 2 × r</strong> (covered more in Part 3). If α is too large relative
          to learning rate, training can become unstable; if too small, the adapter barely moves the model.
        </p>
        <Flowchart
          title="Alpha as a volume knob"
          chart={`flowchart LR
  A[Frozen W path] --> Mix[Combine]
  B[Adapter BA] --> Scale["Scale by α/r"]
  Scale --> Mix
  Mix --> Out[Adapted output]
  Scale -.-> Tip{α too high?}
  Tip -->|Yes| Loud[Overshoots / unstable]
  Tip -->|Too low| Quiet[Barely changes behavior]`}
        />
      </LessonSection>

      <LessonSection title="Target modules — where adapters attach">
        <p className="text-slate-300">
          You do not need adapters on every tensor. In Transformers attention, common targets are projection
          layers named like <code className="font-mono text-sm">q_proj</code>,{' '}
          <code className="font-mono text-sm">k_proj</code>, <code className="font-mono text-sm">v_proj</code>,{' '}
          <code className="font-mono text-sm">o_proj</code>. Many recipes start with{' '}
          <strong className="text-white">q_proj + v_proj</strong> (classic LoRA paper style) or expand to{' '}
          <strong className="text-white">all-linear</strong> (attention + MLP) for more capacity.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">q_proj / v_proj</strong> — minimal, cheap, often strong baseline.
          </li>
          <li>
            <strong className="text-white">all attention projs</strong> — more expressiveness in attention.
          </li>
          <li>
            <strong className="text-white">all-linear</strong> — include feed-forward (MLP) linears; heavier but
            popular for instruction / domain FT.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Dropout on LoRA">
        <p className="text-slate-300">
          <strong className="text-white">LoRA dropout</strong> randomly zeros adapter activations during training
          (not the frozen base). It is a regularizer — helps when your dataset is small and you overfit
          quickly. Typical values are modest (e.g. 0.05–0.1). On large clean datasets, dropout is optional.
        </p>
        <Callout variant="beginner" title="Wrong intuition vs correct">
          <div className="mt-2 grid gap-3 md:grid-cols-2">
            <div>
              <p className="font-semibold text-red-400">Wrong</p>
              <p className="mt-1 text-sm text-slate-400">
                &quot;LoRA replaces W with BA&quot; or &quot;rank 8 means only 8 layers train.&quot;
              </p>
            </div>
            <div>
              <p className="font-semibold text-emerald-400">Correct</p>
              <p className="mt-1 text-sm text-slate-400">
                W stays; you add a scaled low-rank update. Rank is the bottleneck width inside each targeted
                module, across many layers.
              </p>
            </div>
          </div>
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'W′ = W + (α/r)·(B@A): frozen base plus scaled low-rank update.',
          'Rank r = adapter capacity; alpha = how strongly the update is applied.',
          'Target modules (q_proj, v_proj, all-linear) decide where adapters attach.',
          'LoRA dropout regularizes the adapter path; start modest on small datasets.',
        ]}
      />
    </LessonArticle>
  )
}
