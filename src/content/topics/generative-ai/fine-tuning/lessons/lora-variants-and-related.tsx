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

export function LoraVariantsAndRelated() {
  return (
    <LessonArticle>
      <Definition term="LoRA variants">
        <p>
          Researchers proposed many cousins of LoRA — <strong className="text-white">DoRA</strong>,{' '}
          <strong className="text-white">LoRA+</strong>, <strong className="text-white">AdaLoRA</strong>,{' '}
          <strong className="text-white">IA³</strong>, and more. They tweak how the adapter is parameterized or
          trained. For beginners and most product work, <strong className="text-white">start with LoRA or
          QLoRA</strong>; treat variants as optional upgrades when you already have a solid baseline.
        </p>
      </Definition>

      <LessonSection title="Why so many variants exist">
        <p className="text-slate-300">
          Classic LoRA already works remarkably well. Variants try to squeeze out a bit more quality, adaptivity,
          or parameter efficiency on research benchmarks. The danger for newcomers is{' '}
          <strong className="text-white">tool paralysis</strong> — changing the method every week instead of
          fixing data, prompts, and evals.
        </p>
        <Callout variant="beginner" title="Team rule of thumb">
          Ship a LoRA/QLoRA baseline with clean data and a real eval set. Only then A/B a variant on the{' '}
          <em>same</em> data. If the gain is within noise, keep LoRA.
        </Callout>
      </LessonSection>

      <LessonSection title="One-sentence map of common names">
        <div className="space-y-3">
          {[
            [
              'DoRA',
              'Decomposes weight updates into magnitude and direction so adapters can scale and rotate more flexibly than plain LoRA — try when LoRA underfits slightly at the same rank.',
            ],
            [
              'LoRA+',
              'Uses different learning rates for matrices A and B (B often larger) because they play asymmetric roles — a training tweak when standard LR schedules stall.',
            ],
            [
              'AdaLoRA',
              'Allocates rank budget dynamically across layers during training — useful if you want automatic capacity where it matters most, at the cost of more complexity.',
            ],
            [
              'IA³',
              'Learns tiny scaling vectors (not low-rank matrices) on activations — even fewer parameters; sometimes enough for light steering, less common as a default than LoRA.',
            ],
          ].map(([name, sentence]) => (
            <div key={name} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-white">{name}</p>
              <p className="mt-1 text-sm text-slate-400">{sentence}</p>
            </div>
          ))}
        </div>
        <Callout variant="insight" title="Start with LoRA / QLoRA">
          HuggingFace peft, TRL, Axolotl, Unsloth, and most tutorials optimize the LoRA/QLoRA path first.
          Documentation, bugs, and community answers are densest there — that alone is a reason to start
          simple.
        </Callout>
      </LessonSection>

      <LessonSection title="Merge adapters vs keep them separate">
        <ContentStep number={1} title="Keep separate (multi-adapter serving)">
          <p>
            Store the base once and many small adapter folders. Great for multi-tenant apps, A/B tests, and
            rollback. Serving stacks (e.g. vLLM multi-LoRA) load the adapter per request.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Merge into base">
          <p>
            Bake <code className="font-mono text-sm">W + scaled BA</code> into a single set of weights. Deploy
            like a normal model — simpler ops, one file/graph — but you lose cheap swapping and may duplicate
            storage per specialist model.
          </p>
        </ContentStep>
        <ContentStep number={3} title="When to choose which">
          <p>
            Prototype and multi-skill platforms → keep separate. Single production personality with maximum
            serving simplicity → merge (after eval). You can always keep a frozen copy of the adapter before
            merging.
          </p>
        </ContentStep>
        <Flowchart
          title="Separate vs merged adapters"
          chart={`flowchart TB
  Base[Shared base model]
  Base --> Sep[Keep adapters separate]
  Base --> Mer[Merge adapter into weights]
  Sep --> S1[Swap per customer / task]
  Sep --> S2[Small files; easy rollback]
  Mer --> M1[Single deployable model]
  Mer --> M2[No runtime adapter plumbing]`}
        />
        <Example title="Conceptual merge checklist">{`1. Eval adapter quality vs base and vs holdout
2. Save adapter checkpoint (never delete yet)
3. merge_and_unload() / equivalent in peft
4. Smoke-test the merged model on the same eval
5. Only then promote to production artifact store`}</Example>
      </LessonSection>

      <LessonSection title="Practical decision guide">
        <Flowchart
          title="Should I switch away from LoRA?"
          chart={`flowchart TD
  A[Have a solid LoRA/QLoRA baseline + eval?] -->|No| B[Stay on LoRA — fix data first]
  A -->|Yes| C{Need multi-skill / multi-tenant?}
  C -->|Yes| D[Keep adapters separate — still LoRA]
  C -->|No| E{Eval plateau with clean data?}
  E -->|No| F[Keep iterating LoRA config]
  E -->|Yes| G[Optional: try DoRA or LoRA+ on SAME data]
  G --> H{Clear win outside noise?}
  H -->|No| I[Keep LoRA]
  H -->|Yes| J[Adopt variant — document why]`}
        />
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Match everything</strong> — same rank budget, epochs, LR band, and
            decode settings when A/B testing a variant.
          </li>
          <li>
            <strong className="text-white">One change at a time</strong> — do not switch to DoRA and raise r and
            rewrite prompts in the same run.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="How much attention should you spend here?">
        <p className="text-slate-300">
          For this curriculum path: <strong className="text-white">know the names, default to LoRA/QLoRA,
          revisit variants when curious</strong>. Your next high-ROI topics are usually better data mixtures,
          eval design, and avoiding catastrophic forgetting — the following lesson.
        </p>
        <Callout variant="tip">
          If a blog post claims a variant &quot;destroys LoRA,&quot; check whether they matched rank, data,
          epochs, and decoding. Method swaps without matched experiments are marketing, not science.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'DoRA, LoRA+, AdaLoRA, IA³ each tweak adapters — memorize one sentence, not every paper.',
          'Default path for learners and most products: LoRA or QLoRA until a matched A/B says otherwise.',
          'Keep adapters separate for flexibility; merge when you want one simple deployable model.',
          'Always save and eval the adapter before merging into the base.',
        ]}
      />
    </LessonArticle>
  )
}
