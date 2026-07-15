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

export function PpoPart2Mechanics() {
  return (
    <LessonArticle>
      <Definition term="PPO mechanics (beginner loop)">
        <p>
          In LLM RLHF, a PPO-style loop roughly does this:{' '}
          <span className="text-genai-400">sample generations → score with the reward model → update the policy
          carefully</span>
          , using a <strong className="text-white">reference model</strong> so steps stay in a trusted neighborhood.
          Clipping / trust-region ideas mean “do not take update steps that are too large.”
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: practice exams (sample) → grading machine (RM) → coach adjusts study habits a little (clipped
          update) while requiring you to stay recognizable as last week’s competent student (reference).
        </p>
      </Definition>

      <Callout variant="beginner" title="Still no PhD required">
        Read this as an operating manual for intuition. Libraries hide the matrix algebra. Your job is to know what
        each moving part is for when something blows up.
      </Callout>

      <LessonSection title="The training loop in words">
        <ContentStep number={1} title="Sample generations">
          <p className="text-slate-300">
            Take prompts from a dataset. The current policy generates answers (often with some randomness so you
            explore different phrasings).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Score with the RM">
          <p className="text-slate-300">
            The reward model assigns a score to each (prompt, answer). Sometimes you also mix in auxiliary scores
            (safety filters). That number is the reward signal for the batch.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Compare to the reference">
          <p className="text-slate-300">
            Measure how much the new policy’s token choices diverge from the{' '}
            <strong className="text-white">reference model</strong> (usually SFT). That feeds the KL leash from Part
            1.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Update carefully">
          <p className="text-slate-300">
            Adjust policy weights so high-reward answers become more likely — but clamp how big a single step can be (
            <strong className="text-white">clipping</strong>). Then sample again.
          </p>
        </ContentStep>
        <Flowchart
          title="PPO-style LLM training loop"
          chart={`flowchart TB
  PROMPTS[Prompt batch] --> POL[Current policy]
  POL --> GEN[Sample answers]
  GEN --> RM[Reward model scores]
  GEN --> REF[Compare to reference model]
  RM --> ADV[Form learning signal]
  REF --> ADV
  ADV --> CLIP[Clipped / trust-region update]
  CLIP --> POL2[Updated policy]
  POL2 --> POL`}
        />
      </LessonSection>

      <LessonSection title="Clipping and trust region — plain English">
        <p className="text-slate-300">
          A <strong className="text-white">trust region</strong> means “only trust learning updates that stay in a
          neighborhood where your math approximations still make sense.” PPO implements a practical version with{' '}
          <strong className="text-white">clipping</strong>: if an update would change action probabilities too
          dramatically for a token sequence, the algorithm flattens that change — like cutting a too-large salary
          raise down to a safe band.
        </p>
        <Example title="Clip metaphor">{`Without clip: "This word was slightly better — make it 100x more likely overnight."
With clip:    "Nudge it up, but not past a safety rail this step."

Big uncapped jumps → unstable training, language collapse.`}</Example>
        <Callout variant="insight" title="Why beginners should care">
          When people say “PPO is finicky,” they often mean these rails and KL settings. Too aggressive → gibberish.
          Too timid → months of compute for tiny preference gains.
        </Callout>
      </LessonSection>

      <LessonSection title="Role of the reference model">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Anchor</strong> — defines “normal” fluent assistant behavior from SFT.
          </li>
          <li>
            <strong className="text-white">KL baseline</strong> — divergence is measured against it, not against
            random chance.
          </li>
          <li>
            <strong className="text-white">Safety rail for taste</strong> — preference optimization occurs on top of
            a model that already knows chat format.
          </li>
        </ul>
        <Flowchart
          title="Policy and reference side by side"
          chart={`flowchart LR
  REF[Reference / SFT<br/>frozen or slow] --> KL[KL comparison]
  POL[Trainable policy] --> KL
  POL --> GEN[Generations]
  GEN --> RM[RM reward]
  RM --> OBJ[Objective]
  KL --> OBJ
  OBJ --> POL`}
        />
      </LessonSection>

      <LessonSection title="Optional formula box — every symbol in words">
        <p className="text-slate-300">
          You may see an objective that looks like: maximize reward, minus a weighted KL term. Optional reading —
          skip freely.
        </p>
        <CodeBlock title="Symbols spoken aloud">{`# Conceptual objective (not a library-accurate formula):
#
#   maximize   E[ r(x, y) ]  -  β * KL( policy || reference )
#
# x        = the prompt (what the user asked)
# y        = the generated answer (tokens the policy wrote)
# r(x, y)  = reward model score for that prompt+answer
# E[...]   = "on average over the prompts and samples you try"
# KL(...)  = "how far policy's word choices drifted from the reference"
# β (beta) = knob for how hard the KL leash pulls
# policy   = the LLM you are updating
# reference = usually the SFT model you do not want to abandon
#
# PPO adds: don't let any single update change probabilities wildly (clipping).`}</CodeBlock>
        <Callout variant="tip" title="How to use the box">
          If equations stress you, remember only:{' '}
          <span className="font-mono text-sm text-genai-400">average reward ↑</span> and{' '}
          <span className="font-mono text-sm text-genai-400">distance from SFT ↓</span>, with step-size safety rails.
        </Callout>
      </LessonSection>

      <LessonSection title="Beginner debugging checklist">
        <ContentStep number={1} title="Reward goes up, eval quality goes down">
          <p className="text-slate-300">Suspect RM hacking or β too small — inspect samples, not only curves.</p>
        </ContentStep>
        <ContentStep number={2} title="Language collapses">
          <p className="text-slate-300">Updates too large or leash too loose; strengthen KL / quieter step sizes.</p>
        </ContentStep>
        <ContentStep number={3} title="Nothing changes">
          <p className="text-slate-300">Leash too tight or RM too flat; preferences may be weak or β too large.</p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Loop: sample → RM score → careful PPO-style update → repeat.',
          'Clipping / trust region ≈ do not allow oversized probability leaps in one step.',
          'Reference model anchors KL so the student stays near SFT fluency.',
          'Optional formula: average reward minus β×distance-to-reference — each symbol maps to a plain word above.',
        ]}
      />
    </LessonArticle>
  )
}
