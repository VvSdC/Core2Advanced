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

export function RlhfOverviewEndToEnd() {
  return (
    <LessonArticle>
      <Definition term="RLHF (Reinforcement Learning from Human Feedback)">
        <p>
          <strong className="text-white">RLHF</strong> is a three-stage recipe:{' '}
          <span className="font-mono text-sm text-genai-400">
            SFT → train a reward model → optimize the policy with RL
          </span>{' '}
          (often <strong className="text-white">PPO</strong> — Proximal Policy Optimization — or a close cousin).
          Human preferences drive the reward model; RL uses that reward to improve the chat model.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: hire writing coaches (annotators), train a grading machine (reward model), then run a carefully
          supervised practice camp (RL) so the student scores higher without forgetting how to write sentences.
        </p>
      </Definition>

      <Callout variant="beginner" title="PPO in one breath">
        <strong className="text-white">PPO</strong> is a popular RL algorithm that updates the policy in small, safe
        steps so training does not leap off a cliff. Details come in the PPO lessons — remember “careful updates”
        for now.
      </Callout>

      <LessonSection title="The three stages end-to-end">
        <ContentStep number={1} title="SFT — get a decent assistant">
          <p className="text-slate-300">
            Start from a pretrained LLM. Fine-tune on instruction or chat demos until answers are basically on-format
            and useful. This is your <strong className="text-white">policy initialization</strong> — the student
            before preference camp.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Reward model — learn from preferences">
          <p className="text-slate-300">
            Collect pairs of answers for the same prompt; annotators pick winners. Train a{' '}
            <strong className="text-white">reward model (RM)</strong> that assigns higher scores to winning answers.
            The RM becomes a frozen-ish taste oracle the RL loop can query millions of times.
          </p>
        </ContentStep>
        <ContentStep number={3} title="RL (PPO or similar) — optimize the policy">
          <p className="text-slate-300">
            Sample new answers from the current policy, score them with the RM, update the policy to raise scores —
            while a penalty keeps the policy near the SFT / reference model so language stays coherent.
          </p>
        </ContentStep>
        <Flowchart
          title="RLHF three stages"
          chart={`flowchart LR
  SFT[Stage 1: SFT policy] --> PREF[Preference labels]
  PREF --> RM[Stage 2: Reward model]
  SFT --> PPO[Stage 3: PPO / RL]
  RM --> PPO
  PPO --> OUT[Preferred chat behavior]`}
        />
      </LessonSection>

      <LessonSection title="Full flowchart with actors">
        <p className="text-slate-300">
          Keep the cast clear when you read papers or blog posts. Confusion usually means two roles got merged in
          your head.
        </p>
        <Flowchart
          title="Annotators, RM, and policy"
          chart={`flowchart TB
  USER[User prompts pool] --> POL[Policy LLM generates answers]
  POL --> ANN[Annotators compare A vs B]
  ANN --> DATA[Preference dataset]
  DATA --> RM[Reward model training]
  RM --> SCORE[RM scores new samples]
  POL --> SAMPLE[RL sampling loop]
  SAMPLE --> SCORE
  SCORE --> TRAIN[PPO update]
  REF[Reference / SFT model] --> TRAIN
  TRAIN --> POL`}
        />
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Annotators</strong> — create the preference truth at human speed.
          </li>
          <li>
            <strong className="text-white">Reward model</strong> — cheap stand-in for annotators during RL.
          </li>
          <li>
            <strong className="text-white">Policy</strong> — the live LLM being improved.
          </li>
          <li>
            <strong className="text-white">Reference</strong> — the “don’t wander too far” anchor, usually rooted in
            SFT.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Why RLHF was a ChatGPT-era breakthrough">
        <p className="text-slate-300">
          Pretrained models could talk but often ignored instructions or wandered. Pure SFT helped a lot, yet products
          still needed judgment: refuse harmful asks, admit uncertainty, stay helpful without sycophancy. RLHF showed
          a scalable path from human comparisons to those product qualities — making assistants feel dramatically more
          “aligned” to everyday users.
        </p>
        <Example title="Before / after intuition">{`Mostly SFT: fluent, sometimes oddly eager or unsafe-adjacent.
After RLHF: same knowledge base, more preference-aware behavior —
            clearer refusals, better trade-offs, more user-shaped style.`}</Example>
        <Callout variant="insight" title="Not the only breakthrough">
          Scaling, data quality, tooling, and product iteration mattered too. RLHF was a <em>key alignment lever</em>,
          not a solitary miracle switch.
        </Callout>
      </LessonSection>

      <LessonSection title="Cost and complexity — honest version">
        <p className="text-slate-300">
          RLHF is powerful and expensive. Annotators need training and management. Running PPO means sampling
          generations, scoring, and carefully tuning stability knobs. Infrastructure, experiment time, and failure
          modes (reward hacking, verbosity bias) all show up in production teams.
        </p>
        <Flowchart
          title="Why teams feel the weight"
          chart={`flowchart TB
  HUM[Human labeling cost] --> HEAVY[Heavy RLHF stack]
  RM[Train + babysit RM] --> HEAVY
  PPO[RL stability engineering] --> HEAVY
  HEAVY --> ALT[Many teams prefer DPO / ORPO later]
  HEAVY --> WIN[RLHF still used when it uniquely helps]`}
        />
        <Callout variant="tip" title="How to study without drowning">
          Learn the end-to-end story here. Dive into reward modeling and PPO next for intuition. Treat production RLHF
          as a systems skill — many beginners ship preference gains with simpler methods after understanding this
          blueprint.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RLHF = SFT → reward model from preferences → RL (often PPO) on the policy.',
          'Actors: annotators label, RM scores at scale, policy improves, reference anchors fluency.',
          'It was a breakthrough lever for ChatGPT-era “actually feels aligned” assistants.',
          'Cost and complexity are real — which is why DPO-family methods became popular alternatives.',
        ]}
      />
    </LessonArticle>
  )
}
