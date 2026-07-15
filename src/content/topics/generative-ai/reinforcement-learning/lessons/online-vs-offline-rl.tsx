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

export function OnlineVsOfflineRl() {
  return (
    <LessonArticle>
      <Definition term="Offline vs online preference learning">
        <p>
          <strong className="text-white">Offline</strong> preference learning trains on a{' '}
          <em>fixed</em> dataset of prompts and labels you already collected. The model does not need to generate
          fresh answers during training for labeling.
        </p>
        <p className="mt-2 text-slate-300">
          <strong className="text-white">Online</strong> preference / RL learning means the model{' '}
          <em>generates</em> answers while training: you label (or score) those live samples and update — a loop of
          generate → judge → improve.
        </p>
      </Definition>

      <Callout variant="beginner" title="Everyday analogy">
        Offline is studying with a finished set of graded essays. Online is writing new essays, getting grades,
        rewriting — repeatedly during the course. Online can cover more “what this student would actually write,”
        but it takes more coordination.
      </Callout>

      <LessonSection title="Offline preference (fixed dataset)">
        <p className="text-slate-300">
          Classic DPO workflows are offline: you assemble triples once (or refresh periodically), then run training
          like a supervised job. No live sampler that must stay healthy mid-epoch for labeling.
        </p>
        <Flowchart
          title="Offline preference flow"
          chart={`flowchart LR
  COLLECT[Collect pairs ahead of time] --> STORE[Fixed dataset]
  STORE --> TRAIN[DPO / ORPO / …]
  TRAIN --> EVAL[Evaluate]
  EVAL -->|Maybe later| REFRESH[Refresh dataset]
  REFRESH --> STORE`}
        />
        <ContentStep number={1} title="Pros">
          <p className="text-slate-300">
            Simpler ops, reproducible experiments, easier debugging, great fit for startups and first preference
            runs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Cons">
          <p className="text-slate-300">
            Labels can lag the current model: preferences about old refusal styles may not cover what the new
            model invents.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Online generate → label → update">
        <p className="text-slate-300">
          Online loops keep sampling from the <em>current</em> policy. Humans, a reward model, or an AI judge score
          those samples; the policy updates and the next samples come from the improved model.
        </p>
        <Flowchart
          title="Online preference / RL loop"
          chart={`flowchart TB
  M[Current policy] --> GEN[Generate answers]
  GEN --> LAB[Label or score]
  LAB --> UPD[Update policy]
  UPD --> M
  REF[Stay near reference] -.-> UPD`}
        />
        <Example title="What “online” feels like day to day">{`Round 1: model writes short, blunt answers → judge prefers longer help
Round 2: model overcorrects into essays → judge prefers concise help
Round 3: length stabilizes near the preference frontier

Without live samples, Round 2's new failure modes might never appear in an old fixed set.`}</Example>
      </LessonSection>

      <LessonSection title="Exploration intuition (without heavy RL jargon)">
        <p className="text-slate-300">
          Online methods can try answers the fixed dataset never showed — that is the spirit of{' '}
          <strong className="text-white">exploration</strong>. Too little exploration and you only polish known
          styles; too much and you wander into gibberish or unsafe nonsense before the judge can pull you back.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Offline</strong> — explore mostly when you enlarge the dataset offline.
          </li>
          <li>
            <strong className="text-white">Online</strong> — explore during training via sampling; keep a tether to
            the reference so exploration does not delete fluency.
          </li>
        </ul>
        <Callout variant="insight" title="You already met the tether">
          The same “stay near the SFT/reference” idea from DPO appears as KL-style constraints in online RLHF —
          different machinery, similar product goal: do not ruin the model while chasing scores.
        </Callout>
      </LessonSection>

      <LessonSection title="Why offline DPO dominates practical workflows">
        <Flowchart
          title="Why teams default to offline DPO"
          chart={`flowchart TB
  NEED[Need preference alignment] --> Q{Have eng for online RL?}
  Q -->|No / early| OFF[Offline DPO]
  Q -->|Yes + clear need| ON[Online RLHF]
  OFF --> R1[Reproducible jobs]
  OFF --> R2[TRL DPOTrainer ecosystem]
  OFF --> R3[Cheaper iteration]
  ON --> R4[Fresh on-policy coverage]
  ON --> R5[Higher ops + RM complexity]
  R1 --> WIN[Usually enough after good SFT]
  R2 --> WIN
  R3 --> WIN`}
        />
        <p className="mt-4 text-slate-300">
          Practical domination is about <em>engineering leverage</em>, not a mathematical decree that online is
          useless. Many products refresh offline preference sets every few weeks — a mild hybrid — without running
          continuous online RL.
        </p>
        <Callout variant="tip" title="When to go online">
          Consider online when offline win-rates stall, the model invents new failure modes offline data never saw,
          or you invest in a reward model you will reuse across many refreshes.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Offline = train on a fixed preference dataset; online = generate → label/score → update in a loop.',
          'Online covers fresh model behaviors (exploration) but needs more ops and careful tethers.',
          'Exploration intuition: try new answers without forgetting how to speak — reference constraints help.',
          'Offline DPO dominates practical workflows for simplicity, reproducibility, and tooling.',
          'Refresh offline datasets periodically; escalate to online RL when you have a concrete coverage need.',
        ]}
      />
    </LessonArticle>
  )
}
