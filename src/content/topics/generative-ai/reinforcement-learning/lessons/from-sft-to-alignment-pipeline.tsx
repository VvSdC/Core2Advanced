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

export function FromSftToAlignmentPipeline() {
  return (
    <LessonArticle>
      <Definition term="The classic LLM alignment pipeline">
        <p>
          Modern chat models usually climb a ladder:{' '}
          <span className="font-mono text-sm text-genai-400">Pretrain → SFT → preference / reward → RL or DPO</span>.
          Each stage optimizes a different goal. Understanding the ladder stops later jargon (PPO, reward models,
          KL) from floating in mid-air.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: elementary school (pretrain) → apprenticeships with worked examples (SFT) → coach with scored
          tryouts (reward + RL/DPO) → game day (deployed assistant).
        </p>
      </Definition>

      <Callout variant="beginner" title="Where this RL track starts">
        You arrive <strong className="text-white">after SFT</strong>. We assume a model already answers in a useful
        chat style. This track deepens the preference stages — reward modeling, RLHF, PPO — and why teams sometimes
        swap RL for direct methods like DPO.
      </Callout>

      <LessonSection title="InstructGPT-style flowchart (the big picture)">
        <p className="text-slate-300">
          Papers such as InstructGPT popularized a staged recipe that many “ChatGPT-era” systems still resemble.
          Exact product recipes differ, but the story below is the map you should keep.
        </p>
        <Flowchart
          title="Pretrain → SFT → reward / preference → RL or DPO"
          chart={`flowchart TB
  PRE[1. Pretraining<br/>next-token prediction on huge text] --> SFT[2. SFT / instruction tuning<br/>imitate curated demos]
  SFT --> PREF[3. Collect preferences<br/>humans rank answers]
  PREF --> RM[4a. Train reward model]
  PREF --> DPO[4b. Direct preference methods]
  RM --> RL[5. RL on policy e.g. PPO]
  RL --> ALIGNED[Aligned chat model]
  DPO --> ALIGNED`}
        />
        <Callout variant="insight" title="Two forks after preferences">
          Path A trains a <strong className="text-white">reward model</strong> then runs RL. Path B skips the RL loop
          and updates the chat model directly on chosen vs rejected (DPO-style). Same human rankings; different
          machinery.
        </Callout>
      </LessonSection>

      <LessonSection title="What each stage optimizes">
        <ContentStep number={1} title="Pretraining — predict the next token">
          <p className="text-slate-300">
            Optimize fluency and general knowledge from ocean-scale text. Goal: “guess what word comes next” so well
            that the model absorbs grammar, facts, and patterns. Not yet a careful assistant.
          </p>
        </ContentStep>
        <ContentStep number={2} title="SFT — imitate demonstration answers">
          <p className="text-slate-300">
            Optimize matching curated prompt→response pairs. Goal: look like a helpful instructor following chat
            templates. Still no explicit “A is safer than B” vote between two good drafts.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Preference data — humans (or judges) choose">
          <p className="text-slate-300">
            Collect rankings for the same prompt. Goal: capture human taste on helpfulness, honesty, harmlessness —
            the raw material for alignment.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Reward model or direct preference loss">
          <p className="text-slate-300">
            Either learn a scorer that predicts which answer humans would pick, or fold preferences into a training
            loss on the chat model itself. Goal: turn subjective taste into something a computer can optimize.
          </p>
        </ContentStep>
        <ContentStep number={5} title="RL (optional path) — raise reward carefully">
          <p className="text-slate-300">
            Update the SFT policy so new answers score higher under the reward model, while staying close enough to
            the SFT model that language does not collapse. Goal: maximize preference while preserving fluency.
          </p>
        </ContentStep>
        <Example title="Stage goals at a glance">{`Pretrain:  "Complete the sentence naturally."
SFT:       "Answer like these demo assistants."
Prefs:     "Between A and B, which should we ship?"
Reward:    "Predict that human vote as a number."
RL / DPO:  "Make future answers more like winners."`}</Example>
      </LessonSection>

      <LessonSection title="Zoom: where you stand right now">
        <Flowchart
          title="This track's entrance"
          chart={`flowchart LR
  FT[Fine-Tuning track<br/>SFT skills] --> YOU[You are here]
  YOU --> RLTRACK[RL / alignment lessons]
  RLTRACK --> RM[Reward signals]
  RLTRACK --> RLHF[RLHF overview]
  RLTRACK --> PPO[PPO intuition + mechanics]
  RLTRACK --> HARD[Challenges + why DPO wins often]`}
        />
        <p className="mt-4 text-slate-300">
          If someone asks “Do I need RLHF before I can chat-tune?” — no. You need SFT first. Alignment methods refine
          an already instruction-capable model. Shipping an SFT-only prototype is common; preference stages raise
          product quality and safety bar.
        </p>
        <Callout variant="tip" title="Beginner sequencing">
          Finish Fine-Tuning SFT basics → read this pipeline → then reward signals and RLHF end-to-end. Only then dig
          into PPO internals. Skipping the ladder is how equations feel meaningless.
        </Callout>
      </LessonSection>

      <LessonSection title="Actors you will meet again">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Annotators</strong> — people (or strong AI judges) who compare answers.
          </li>
          <li>
            <strong className="text-white">Policy model</strong> — the LLM being improved (the “student”).
          </li>
          <li>
            <strong className="text-white">Reference / SFT model</strong> — a frozen or slowly moved baseline you do
            not want to wander far from.
          </li>
          <li>
            <strong className="text-white">Reward model (RM)</strong> — scores answers when you take the RLHF path.
          </li>
        </ul>
        <Flowchart
          title="Who talks to whom (simplified)"
          chart={`flowchart TB
  ANN[Annotators] -->|preference labels| DATA[Preference dataset]
  DATA --> RM[Reward model]
  SFT[SFT policy] --> RL[RL trainer]
  RM --> RL
  REF[Reference model] --> RL
  RL --> NEW[Updated policy]`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'Classic pipe: Pretrain → SFT → preferences → reward model + RL, or DPO-style direct methods.',
          'Each stage optimizes a different thing: fluency, imitation, taste encoding, then preference-seeking.',
          'InstructGPT-style flowcharts still map how ChatGPT-era assistants were built at a high level.',
          'This RL track starts after SFT; treat Fine-Tuning as the prerequisite doorway.',
        ]}
      />
    </LessonArticle>
  )
}
