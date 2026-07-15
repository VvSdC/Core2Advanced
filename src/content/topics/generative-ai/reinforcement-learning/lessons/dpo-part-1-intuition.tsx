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

export function DpoPart1Intuition() {
  return (
    <LessonArticle>
      <Definition term="DPO (Direct Preference Optimization)">
        <p>
          <strong className="text-white">DPO</strong> is a way to align a language model using preference pairs —
          chosen vs rejected answers — <em>without</em> training a separate reward model and{' '}
          <em>without</em> running a classic reinforcement-learning loop (like PPO) on the policy.
        </p>
        <p className="mt-2 text-slate-300">
          You optimize the chat model directly so it assigns higher preference to answers humans (or judges)
          liked more, while staying close to a reference (usually your SFT) model.
        </p>
      </Definition>

      <Callout variant="beginner" title="Explain before jargon">
        Classic RLHF hired a critic (reward model) and then coached the chat model with that critic&apos;s scores.
        DPO skips the critic job: the preference pairs themselves become the training signal for the chat model.
      </Callout>

      <LessonSection title="The flashcard analogy">
        <p className="text-slate-300">
          Imagine studying with flashcards that say: <span className="text-genai-400">“prefer this reply over that
          reply for this question.”</span> Each card is one preference. You practice until your habit is to produce
          the preferred style first — without an external scoreboard running between every practice session.
        </p>
        <Example title="One mental flashcard">{`Front:  Angry customer: "Where is my order?"
Prefer: Empathetic + status + next step
Avoid:  Cold policy dump with no tracking link

You do not invent a numeric "helpfulness score" first —
you update toward Prefer and away from Avoid.`}</Example>
        <ContentStep number={1} title="Start from a capable SFT model">
          <p className="text-slate-300">
            DPO nudges taste and priorities. It is a poor substitute for teaching basic format and skills with SFT.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Show many prefer-this-over-that cards">
          <p className="text-slate-300">
            Coverage matters: safety edge cases, tone, honesty, length — whatever your product cares about.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Stay close to the teacher">
          <p className="text-slate-300">
            The reference model keeps DPO from “memorizing flashcards so hard” that language collapses into
            weird, reward-hacked prose.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="RLHF stack vs DPO simplified stack">
        <p className="text-slate-300">
          Both start from preference data. RLHF adds a reward model and an RL optimization stage. DPO folds the
          preference objective into a single direct training step on the policy.
        </p>
        <Flowchart
          title="Classic RLHF stack"
          chart={`flowchart TB
  SFT[SFT / chat model] --> PREF[Preference pairs]
  PREF --> RM[Train reward model]
  RM --> PPO[RL update policy e.g. PPO]
  SFT --> PPO
  PPO --> ALIGN[Aligned policy]
  REF[KL / stay near SFT] -.-> PPO`}
        />
        <Flowchart
          title="DPO simplified stack"
          chart={`flowchart TB
  SFT[SFT = usually also reference] --> PREF[Preference pairs]
  PREF --> DPO[Direct preference training on policy]
  SFT --> DPO
  DPO --> ALIGN[Aligned policy]
  NOTE[No separate RM + PPO loop] -.-> DPO`}
        />
        <Callout variant="insight" title="Same goal, fewer moving parts">
          For many product teams, “align to pairwise preferences after good SFT” is enough. You still need
          evaluation — simpler training does not mean skip testing.
        </Callout>
      </LessonSection>

      <LessonSection title="What DPO is and is not">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Is</strong> — a practical way to use chosen/rejected data like flashcards
            for the policy itself.
          </li>
          <li>
            <strong className="text-white">Is</strong> — typically offline training on a fixed preference dataset
            (see Online vs Offline lesson).
          </li>
          <li>
            <strong className="text-white">Is not</strong> — a replacement for SFT when the model cannot do the task.
          </li>
          <li>
            <strong className="text-white">Is not</strong> — automatic safety; it only learns what your pairs encode.
          </li>
        </ul>
        <Flowchart
          title="When DPO is often enough"
          chart={`flowchart TB
  Q1{Have solid SFT?} -->|No| SFT[Do / improve SFT first]
  Q1 -->|Yes| Q2{Have good preference pairs?}
  Q2 -->|No| DATA[Collect / clean prefs]
  Q2 -->|Yes| Q3{Need multi-objective RL research stack?}
  Q3 -->|No| DPO[Start with DPO]
  Q3 -->|Yes| RLHF[Consider full RLHF / online RL]
  DPO --> EVAL[Win-rate + safety evals]
  RLHF --> EVAL`}
        />
      </LessonSection>

      <LessonSection title="When DPO is enough (rule of thumb)">
        <p className="text-slate-300">
          Choose DPO as your default preference stage when you want better ranking among already-capable answers,
          you can collect pairwise data, and you want a training pipeline that looks closer to SFT than to a full
          RL lab setup. Reach for classic RLHF when you need online exploration, complex multi-reward setups, or
          research that depends on an explicit reward model you will reuse.
        </p>
        <Callout variant="tip" title="Beginner recommendation">
          Finish SFT quality → collect consistent pairs → run DPO → evaluate — before exploring ORPO/KTO/IPO or
          full PPO RLHF. Complexity is optional; evaluation is not.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'DPO = Direct Preference Optimization: align from preference pairs without a separate reward model + PPO loop.',
          'Mental model: flashcards of “prefer this over that,” with a tether to the SFT/reference model.',
          'RLHF stacks RM + RL; DPO trains the policy on pairs directly — same preference idea, fewer stages.',
          'DPO is often enough after good SFT when pairwise data covers your product axes.',
          'DPO inherits your data’s values; pairing quality and evals remain mandatory.',
        ]}
      />
    </LessonArticle>
  )
}
