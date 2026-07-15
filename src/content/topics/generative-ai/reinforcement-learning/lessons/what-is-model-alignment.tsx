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

export function WhatIsModelAlignment() {
  return (
    <LessonArticle>
      <Definition term="Model alignment">
        <p>
          <strong className="text-white">Alignment</strong> means steering a language model so it better follows{' '}
          <strong className="text-genai-400">human intent</strong> — being helpful when that is appropriate, honest
          about uncertainty, and careful about harm. In shorthand you will see the phrase{' '}
          <span className="font-mono text-sm text-genai-400">helpful, honest, harmless</span> (sometimes written HHH).
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a gifted intern who already speaks fluently (the pretrained + fine-tuned model) still needs a
          values coach. Alignment is that coaching — not teaching English from scratch, but teaching{' '}
          <em>which kinds of answers</em> people actually want.
        </p>
      </Definition>

      <Callout variant="beginner" title="Word check — “intent”">
        <strong className="text-white">Intent</strong> means what the human is trying to achieve. Aligning to intent
        is harder than matching a single “correct” string: two answers can both be grammatical, but one may be safer,
        clearer, or more truthful.
      </Callout>

      <LessonSection title="Where alignment sits after fine-tuning">
        <p className="text-slate-300">
          In the Fine-Tuning track you learned <strong className="text-white">SFT</strong> (supervised fine-tuning):
          show the model example prompts and target answers, and train it to imitate them. SFT{' '}
          <span className="text-genai-400">specializes</span> the model — chat format, domain tone, “act like an
          assistant.”
        </p>
        <p className="mt-3 text-slate-300">
          Alignment comes next. Instead of only cloning examples, you teach{' '}
          <strong className="text-white">preferences</strong>: when two replies are both possible, prefer the one that
          matches human judgments about helpfulness, honesty, and safety. That is why this topic lives under
          reinforcement learning and preference methods — those are the tools used after SFT.
        </p>
        <Flowchart
          title="SFT specializes; alignment steers preferences"
          chart={`flowchart TB
  PRE[Pretrained LLM<br/>knows language] --> SFT[SFT / instruction tuning<br/>imitate good examples]
  SFT --> ALIGN[Alignment<br/>prefer better answers]
  ALIGN --> OUT[Helpful honest harmless<br/>assistant behavior]
  SFT -.->|specializes format and skill| SFTNOTE[Looks like a helpful student]
  ALIGN -.->|steers values and taste| ALIGNNOTE[Chooses among good drafts]`}
        />
        <Callout variant="tip" title="Prerequisite — Fine-Tuning track">
          If terms like <span className="font-mono text-sm text-genai-400">SFT</span>, instruction tuning, chat
          templates, or preference pairs feel new, skim the Fine-Tuning track first — especially supervised
          fine-tuning and the preference-tuning overview. This RL track assumes you know what “train on examples”
          means; we focus on what happens after that.
        </Callout>
      </LessonSection>

      <LessonSection title="What “helpful, honest, harmless” means in practice">
        <ContentStep number={1} title="Helpful">
          <p className="text-slate-300">
            Answer the question the user asked, with enough detail and clarity. Not vague, not dodging, not hiding
            behind empty corporate phrasing when a concrete steps list would help.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Honest">
          <p className="text-slate-300">
            Admit when you do not know. Avoid confident-sounding fiction. Prefer “I am not sure; here is how you could
            verify” over inventing a citation.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Harmless">
          <p className="text-slate-300">
            Refuse or redirect requests that would cause serious harm, while still being useful when the intent is
            legitimate. “Harmless” is a policy goal teams design carefully — not a single automatic rule you can recite
            once and forget.
          </p>
        </ContentStep>
        <Example title="Same skill, different alignment">{`User: "How do I stop my website from falling over under traffic?"

Less aligned: dumps jargon, or invents fake "best practices" with fake URLs.
More aligned: clear steps, admits trade-offs, flags what needs a specialist,
              avoids unsafe shortcuts that would expose secrets.`}</Example>
      </LessonSection>

      <LessonSection title="Learning map for this Reinforcement Learning / alignment subtopic">
        <p className="text-slate-300">
          You do not need to become a reinforcement-learning researcher overnight. This track walks from ideas →
          pipeline → reward signals → RLHF → PPO intuition → real-world challenges. Later lessons introduce lighter
          preference methods (like DPO) as alternatives many teams use today.
        </p>
        <Flowchart
          title="RL / alignment learning map"
          chart={`flowchart TB
  L1[1. What is model alignment] --> L2[2. Why RL for LLMs]
  L2 --> L3[3. RL basics for chatbots]
  L3 --> L4[4. SFT → alignment pipeline]
  L4 --> L5[5. Reward signals and feedback]
  L5 --> L6[6. RLHF end-to-end]
  L6 --> L7[7. Reward modeling]
  L7 --> L8[8. PPO intuition]
  L8 --> L9[9. PPO mechanics]
  L9 --> L10[10. Challenges of RLHF]
  L10 --> NEXT[Next: DPO / ORPO and shipping practice]`}
        />
        <Callout variant="insight" title="How to use the map">
          Treat each box as one mental model. If a later lesson feels dense, jump back to the pipeline lesson — most
          confusion dissolves once you remember which stage you are in (SFT vs reward model vs policy update).
        </Callout>
      </LessonSection>

      <LessonSection title="What this track is — and is not">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Is:</strong> a beginner-friendly story of how chat models get steered after
            SFT, with lots of analogies and flowcharts.
          </li>
          <li>
            <strong className="text-white">Is not:</strong> a proofs course. We will mention ideas like{' '}
            <span className="font-mono text-sm text-genai-400">PPO</span> and{' '}
            <span className="font-mono text-sm text-genai-400">KL penalty</span> in plain English first.
          </li>
          <li>
            <strong className="text-white">Builds on:</strong> Fine-Tuning track SFT basics. Come back there anytime for
            data format, LoRA, and training setup.
          </li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Alignment = steer the model toward helpful, honest, harmless behavior that matches human intent.',
          'SFT specializes by imitating examples; alignment steers preferences when many answers could work.',
          'Show the Fine-Tuning track for SFT prerequisites before diving deep into RLHF.',
          'This subtopic learning map: alignment ideas → RL basics → pipeline → rewards → RLHF → PPO → challenges.',
        ]}
      />
    </LessonArticle>
  )
}
