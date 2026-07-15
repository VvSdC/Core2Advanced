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
} from '../../../../../components/content'

export function DpoPart2Mechanics() {
  return (
    <LessonArticle>
      <Definition term="DPO mechanics (beginner view)">
        <p>
          Under the hood, DPO updates the <strong className="text-white">policy</strong> (your trainable chat model)
          so that, relative to a frozen <strong className="text-white">reference</strong> model (usually your SFT
          checkpoint), the <span className="text-genai-400">chosen</span> completion becomes more likely than the{' '}
          <span className="text-genai-400">rejected</span> one — while a built-in penalty discourages drifting too
          far from the reference.
        </p>
        <p className="mt-2 text-slate-300">
          You do not need to derive the paper. You do need this mental picture before tuning β or reading TRL docs.
        </p>
      </Definition>

      <Callout variant="beginner" title="Three actors">
        Policy = the model you train. Reference = the frozen “stay close to me” model. Dataset = preference triples
        that provide the direction of the nudge.
      </Callout>

      <LessonSection title="Reference policy and the KL-style tether">
        <p className="text-slate-300">
          Without a tether, “always amplify whatever won once” can collapse language: over-confident fluff,
          over-refusal, or weird repetitions that happened to score well. The reference models a{' '}
          <strong className="text-white">stay recognizable</strong> constraint — often described as a KL-style
          penalty relative to the SFT distribution.
        </p>
        <Flowchart
          title="Raise chosen, lower rejected, stay near reference"
          chart={`flowchart TB
  REF[Frozen reference / SFT] -->|compare| POL[Trainable policy]
  PAIR[prompt + chosen + rejected] --> LOSS[DPO loss]
  POL --> LOSS
  REF --> LOSS
  LOSS --> UPD[Update policy weights]
  UPD --> POL
  NOTE[KL-style: do not wander far from REF] -.-> LOSS`}
        />
        <ContentStep number={1} title="Increase relative preference for chosen">
          <p className="text-slate-300">
            Make the policy like the winning answer more (relative to the reference) than it likes the loser.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Decrease relative preference for rejected">
          <p className="text-slate-300">
            Push down the losing answer on the same prompt so the gap is clear — not only “boost winners.”
          </p>
        </ContentStep>
        <ContentStep number={3} title="Respect the reference">
          <p className="text-slate-300">
            Large moves away from the SFT habits are expensive in the loss, which stabilizes training.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Temperature beta (β) intuition">
        <p className="text-slate-300">
          The hyperparameter <strong className="text-white">β (beta)</strong> controls how hard preference pressure
          pushes against that tether. Think of it as the volume knob on “obey these flashcards” versus “sound like
          the SFT teacher.”
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">β too aggressive</strong> — prefs stick hard; style can get strange,
            verbose, or over-refusey.
          </li>
          <li>
            <strong className="text-white">β too weak</strong> — training seems to “do nothing”; preferences barely
            move metrics.
          </li>
          <li>
            <strong className="text-white">Practical tip</strong> — start from a recipe default, change one setting,
            evaluate win-rate and side effects.
          </li>
        </ul>
        <Callout variant="tip" title="Do not tune β in the dark">
          Always pair β changes with a fixed eval set of preference-style judgments and a few safety probes.
        </Callout>
      </LessonSection>

      <LessonSection title="Loss meaning in words (optional formula)">
        <p className="text-slate-300">
          In prose: the loss is low when the policy’s{' '}
          <strong className="text-white">advantage of chosen over rejected</strong> (measured against the reference)
          is large. It rises when the policy fails to prefer the winner enough.
        </p>
        <CodeBlock title="Optional sketch — each term in words">{`# Conceptual DPO idea (libraries implement the exact math):
#
# L ≈ -log σ( β * (
#        [log πθ(chosen|x)  - log πref(chosen|x)]
#      - [log πθ(rejected|x) - log πref(rejected|x)]
# ) )
#
# πθ   = trainable policy
# πref = frozen reference (usually SFT)
# β    = how strongly preferences push
# σ    = sigmoid — turns “chosen wins by how much” into a soft probability
# x    = prompt
#
# Words: reward the gap (chosen vs rejected) relative to the reference.`}</CodeBlock>
        <Callout variant="insight" title="You can use DPO without deriving this">
          Hugging Face TRL&apos;s DPOTrainer (and similar tools) encode the loss. Your job is data, β caution, and
          evaluation.
        </Callout>
      </LessonSection>

      <LessonSection title="Beginner training mental model">
        <p className="text-slate-300">
          Mentally treat a DPO run like: load SFT → freeze a reference copy → map preference dataset into the
          trainer&apos;s columns → optimize with DPOTrainer-style tooling (often with LoRA for efficiency).
        </p>
        <Flowchart
          title="High-level DPO training flow"
          chart={`flowchart LR
  SFT[SFT checkpoint] --> REF[Freeze reference]
  SFT --> POL[Init policy ± LoRA]
  DS[Preference dataset] --> TRL[DPOTrainer-style loop]
  REF --> TRL
  POL --> TRL
  TRL --> CKPT[Aligned checkpoint]
  CKPT --> EVAL[Win-rate / safety eval]`}
        />
        <Example title="What the dataset row looks like (conceptual)">{`{
  "prompt": "Explain recursion to a beginner.",
  "chosen": "Think of nested Russian dolls…",
  "rejected": "Recursion: a procedure invokes itself until…"
}

# Trainer computes policy vs reference log-probs on chosen and rejected.`}</Example>
        <CodeBlock title="Illustrative shape only — not a pinned API version">{`# Conceptual — names/fields may differ by library version
# from trl import DPOTrainer
# trainer = DPOTrainer(
#   model=policy,                 # trainable (often LoRA)
#   ref_model=reference,          # frozen SFT
#   args=training_args,
#   beta=0.1,                     # preference strength
#   train_dataset=preference_ds,  # prompt / chosen / rejected
# )
# trainer.train()`}</CodeBlock>
        <ContentStep number={1} title="Dataset ready">
          <p className="text-slate-300">Consistent triples; chat template matches how you will serve the model.</p>
        </ContentStep>
        <ContentStep number={2} title="Reference = good SFT">
          <p className="text-slate-300">Garbage reference → DPO tethers you to garbage habits.</p>
        </ContentStep>
        <ContentStep number={3} title="Train, then evaluate like a product">
          <p className="text-slate-300">
            Training loss alone is not alignment. Check pairwise wins, refusals, and regressions.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'DPO trains a policy against a frozen reference (usually SFT) using preference triples.',
          'Intuition: raise chosen, lower rejected, with a KL-style stay-near-reference constraint baked in.',
          'β controls how hard preferences push; too high drifts weirdly, too low barely moves.',
          'Loss prose: enlarge the chosen-vs-rejected advantage relative to the reference.',
          'Mental model: preference dataset → DPOTrainer-style loop → evaluate; often with LoRA.',
        ]}
      />
    </LessonArticle>
  )
}
