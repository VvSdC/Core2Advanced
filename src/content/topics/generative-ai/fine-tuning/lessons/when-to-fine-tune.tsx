import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function WhenToFineTune() {
  return (
    <LessonArticle>
      <Definition term="When to fine-tune">
        <p>
          Fine-tune when you need the model to{' '}
          <strong className="text-white">internalize a stable behavior</strong> — style, structure, domain phrasing —
          and you have enough high-quality examples. Skip fine-tuning when the main problem is{' '}
          <span className="text-genai-400">facts that change daily</span>; use RAG or tools instead.
        </p>
      </Definition>

      <LessonSection title="Decision tree: style vs changing facts">
        <p className="text-slate-300">
          Ask one question first: are you teaching the model{' '}
          <em>how to speak</em>, or teaching it <em>what is true this week</em>?
        </p>
        <Flowchart
          title="Fine-tune or not?"
          chart={`flowchart TD
  A[Problem with LLM answers] --> B{Root cause?}
  B -->|Wrong / stale facts| C[Prefer RAG or tool APIs]
  B -->|Bad format / tone / jargon| D{Prompting failed?}
  D -->|No — prompts work| E[Keep prompting]
  D -->|Yes — still inconsistent| F{Enough clean examples?}
  F -->|Hundreds+ quality pairs| G[Fine-tune is a candidate]
  F -->|Few noisy examples| H[Improve data first]
  G --> I{Budget + risk OK?}
  I -->|Yes| J[Proceed to SFT / LoRA]
  I -->|No| K[Narrow scope or stay with RAG]`}
        />
      </LessonSection>

      <LessonSection title="Good reasons vs bad reasons">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="text-sm font-semibold text-emerald-400">Good reasons</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
              <li>Always emit a specific JSON / XML schema</li>
              <li>Match a brand voice or clinical note style</li>
              <li>Domain slang the base model keeps mangling</li>
              <li>Shorter prompts by baking in instructions</li>
              <li>Teach a multi-step answer pattern reliably</li>
            </ul>
          </div>
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
            <p className="text-sm font-semibold text-red-400">Bad reasons (usually)</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
              <li>“So it knows our wiki” (use RAG)</li>
              <li>Daily price lists or policy updates</li>
              <li>Fixing one weird edge case with 5 examples</li>
              <li>Hoping fine-tuning replaces evaluation</li>
              <li>Skipping prompt engineering entirely</li>
            </ul>
          </div>
        </div>
        <Callout variant="tip">
          If you can fix the issue by putting the rule in the system prompt and it works reliably, you do not need
          fine-tuning yet. Fine-tuning shines when prompts are long, brittle, or still inconsistent at scale.
        </Callout>
      </LessonSection>

      <LessonSection title="Data volume heuristics">
        <ContentStep number={1} title="Tens of examples">
          <p className="text-slate-300">
            Useful for prompt/few-shot design and smoke tests — rarely enough for a stable full fine-tune. You will
            likely overfit (memorize) instead of generalizing.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Hundreds of high-quality pairs">
          <p className="text-slate-300">
            A common sweet spot to <span className="text-genai-400">start experimenting</span> with supervised
            fine-tuning or LoRA, especially for format and style tasks. Quality beats quantity: 300 clean examples
            beat 3,000 noisy ones.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Thousands+ diverse examples">
          <p className="text-slate-300">
            Better for broader behavior shifts, instruction following across many task types, or industry-specific
            dialects. Still audit for duplicates, label errors, and PII.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Heuristics are not laws. A narrow JSON-formatting task may succeed with fewer examples than teaching a whole
          support persona.
        </Callout>
      </LessonSection>

      <LessonSection title="Cost, risk, and catastrophic forgetting">
        <Definition term="Catastrophic forgetting">
          <p>
            When further training on new data makes the model <strong className="text-white">worse</strong> at skills
            it previously had — like a specialist who forgets general practice after too-narrow training. Aggressive
            learning rates or narrow datasets raise this risk.
          </p>
        </Definition>
        <p className="text-slate-300 mt-4">
          Fine-tuning costs GPU time, engineering time, and evaluation effort. You can also{' '}
          <strong className="text-white">regress</strong> general abilities if you overfit or train too hard. Mitigation
          ideas (covered later): LoRA / PEFT (smaller updates), careful learning rates, mixing general data, and holdout
          evals that measure both specialty and general prompts.
        </p>
        <Flowchart
          title="Risk checklist before you train"
          chart={`flowchart LR
  A[Data quality] --> D[Go / No-go]
  B[Eval suite ready] --> D
  C[Rollback plan<br/>keep base model] --> D
  D --> E[Train small run]
  E --> F[Compare to baseline]`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'Fine-tune for stable style/format/domain language; use RAG for changing facts.',
          'Good reasons: consistent schemas, voice, jargon; bad reasons: “know our docs” alone.',
          'Start thinking seriously around hundreds of clean examples; thousands help broader shifts.',
          'Costs include compute and catastrophic forgetting risk — always evaluate against a baseline.',
        ]}
      />
    </LessonArticle>
  )
}
