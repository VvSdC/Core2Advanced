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

export function PreferenceTuningOverview() {
  return (
    <LessonArticle>
      <Definition term="Preference tuning">
        <p>
          <strong className="text-white">Preference tuning</strong> is the stage after supervised fine-tuning (SFT)
          where you teach the model <em>which</em> answers humans prefer — not just how to produce a valid reply.
          SFT shows “here is a good answer.” Preference methods show “this answer is better than that one.”
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: culinary school (SFT) teaches recipes. A tasting panel (preference tuning) ranks two plates from
          the same ingredients and says “this plating feels kinder and clearer.” The chef updates habits toward
          winning plates.
        </p>
      </Definition>

      <Callout variant="beginner" title="Why SFT is not enough">
        SFT clones demonstration answers. When two completions are both fluent, SFT does not say which is safer,
        more honest, or more helpful. Preference data fills that gap.
      </Callout>

      <LessonSection title="The high-level journey">
        <Flowchart
          title="Base → SFT → preference alignment"
          chart={`flowchart TB
  BASE[Base pretrained LLM] --> SFT[SFT / instruction or chat tuning]
  SFT --> PREF[Preference alignment]
  PREF --> OUT[Aligned assistant]
  PREF --> RLHF[Path A: RLHF]
  PREF --> DPO[Path B: DPO / direct methods]
  RLHF --> RM[Reward model from prefs]
  RM --> RL[RL optimize policy]
  DPO --> DIR[Train directly on chosen vs rejected]`}
        />
        <p className="mt-4 text-slate-300">
          Almost every modern chat model you use followed some version of this pipeline. Exact recipes differ
          (RLHF, DPO, ORPO…), but the story is the same:{' '}
          <span className="text-genai-400">imitate first, then align to preferences</span>.
        </p>
      </LessonSection>

      <LessonSection title="RLHF at a glance (big picture only)">
        <p className="text-slate-300">
          <strong className="text-white">RLHF</strong> means Reinforcement Learning from Human Feedback. You do not
          need RL math to understand the roles:
        </p>
        <ContentStep number={1} title="Collect preference comparisons">
          <p className="text-slate-300">
            For the same prompt, humans (or strong judges) pick a <strong className="text-white">chosen</strong>{' '}
            completion over a <strong className="text-white">rejected</strong> one.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Train a reward model">
          <p className="text-slate-300">
            A separate model learns to score answers so that chosen scores higher than rejected. That score becomes
            a stand-in for “human happiness.”
          </p>
        </ContentStep>
        <ContentStep number={3} title="Optimize the policy with RL">
          <p className="text-slate-300">
            The chat model (policy) is updated to produce high-reward answers while staying close to the SFT model
            so it does not drift into gibberish or reward hacking.
          </p>
        </ContentStep>
        <Flowchart
          title="RLHF in three boxes"
          chart={`flowchart LR
  P[Prompt] --> A[Answer A]
  P --> B[Answer B]
  A --> H[Human prefers A over B]
  B --> H
  H --> RM[Reward model]
  RM --> RL[RL training of chat model]
  RL --> BETTER[More preferred answers]`}
        />
        <Callout variant="insight" title="Remember the shape, not the equations">
          RLHF = preference data → reward model → reinforcement learning. Many teams now skip the RL step and use
          direct preference methods (next lesson) for similar goals with simpler tooling.
        </Callout>
      </LessonSection>

      <LessonSection title="Why preference data looks like chosen vs rejected">
        <p className="text-slate-300">
          Absolute scores (“rate 1–7”) are noisy and inconsistent across raters. Pairwise comparisons are easier:
          “Which is better?” That is why datasets are often triples:{' '}
          <span className="text-genai-400">prompt + chosen + rejected</span>.
        </p>
        <Example title="Preference pair (conceptual)">{`prompt:   "Explain recursion to a beginner."
chosen:   "Imagine nested Russian dolls — a function that calls a smaller version of itself..."
rejected: "Recursion is when a procedure invokes itself until a base case terminates the call stack."

# Both can be "correct." Chosen is clearer for beginners — that preference is the training signal.`}</Example>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Helpfulness</strong> — clearer, more complete, on-topic.
          </li>
          <li>
            <strong className="text-white">Harmlessness</strong> — refuses unsafe requests gracefully.
          </li>
          <li>
            <strong className="text-white">Honesty</strong> — admits uncertainty instead of confabulating.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Where DPO fits if you are not an RL expert">
        <p className="text-slate-300">
          <strong className="text-white">DPO (Direct Preference Optimization)</strong> uses the same
          chosen/rejected data but trains the chat model directly — no separate reward model and no RL loop you
          have to babysit. Think of it as preference alignment that looks more like ordinary supervised training
          from a tooling perspective.
        </p>
        <Flowchart
          title="Pick a mental path"
          chart={`flowchart TB
  SFT[You finished SFT] --> Q{Need preference alignment?}
  Q -->|No| SHIP[Ship / evaluate SFT]
  Q -->|Yes| HOW{Comfortable with RL stack?}
  HOW -->|Want simpler pipeline| DPO[Start with DPO / similar]
  HOW -->|Research / classic RLHF| RLHF[Reward model + RL]
  DPO --> EVAL[Human / automated eval]
  RLHF --> EVAL`}
        />
        <Callout variant="tip" title="Beginner roadmap">
          This Fine-Tuning lesson gives the map. For the full beginner-to-advanced path — RL basics, RLHF, PPO,
          DPO (multi-part), ORPO/KTO, RLAIF, and evaluation — continue in{' '}
          <strong className="text-white">Model Alignment → Reinforcement Learning</strong>. You can ship useful
          aligned models without becoming an RL researcher first; start with DPO after solid SFT.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Preference tuning comes after SFT to align with human taste, safety, and honesty.',
          'RLHF (high level): preferences → reward model → reinforce the chat policy.',
          'Preference data is usually chosen vs rejected pairs for the same prompt.',
          'DPO-style methods use the same pairs but skip the separate RL loop for many teams.',
          'Deep dive next: Model Alignment → Reinforcement Learning (RLHF, DPO, and related methods).',
        ]}
      />
    </LessonArticle>
  )
}
