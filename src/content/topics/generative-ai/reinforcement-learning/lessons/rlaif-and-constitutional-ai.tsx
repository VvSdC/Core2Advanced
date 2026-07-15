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

export function RlaifAndConstitutionalAi() {
  return (
    <LessonArticle>
      <Definition term="RLAIF">
        <p>
          <strong className="text-white">RLAIF</strong> means Reinforcement Learning from{' '}
          <em>AI</em> Feedback. Instead of (or in addition to) humans labeling preference pairs, a strong AI model
          acts as the judge — scoring or ranking completions so you can scale preference data faster.
        </p>
        <p className="mt-2 text-slate-300">
          You still train with the same high-level story (preferences → alignment). The cheap, scalable critic is
          another model, not a room full of annotators for every sample.
        </p>
      </Definition>

      <Callout variant="beginner" title="AI feedback is still a label">
        Whether a human or an LLM picks “chosen,” the learning rule only sees the resulting preference. Bias and
        mistakes in the judge become training signal — scale is a gift and a risk.
      </Callout>

      <LessonSection title="Why teams use AI feedback">
        <ContentStep number={1} title="Human labeling is expensive">
          <p className="text-slate-300">
            Preference collection slows product loops. An LLM judge can draft millions of soft labels overnight.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Humans still calibrate">
          <p className="text-slate-300">
            Best practice: humans write rubrics, spot-check, and adjudicate hard cases; the AI fills volume.
          </p>
        </ContentStep>
        <ContentStep number={3} title="RLAIF pairs with DPO or RLHF">
          <p className="text-slate-300">
            AI feedback can feed DPO triples, reward-model training, or online loops — the feedback source and the
            optimizer are separate choices.
          </p>
        </ContentStep>
        <Flowchart
          title="Human vs AI feedback in the pipeline"
          chart={`flowchart TB
  GEN[Candidate answers] --> WHO{Judge}
  WHO -->|Humans| H[Preference labels]
  WHO -->|AI judge| A[Preference labels]
  WHO -->|Hybrid| HY[AI draft + human audit]
  H --> TRAIN[DPO / RLHF / …]
  A --> TRAIN
  HY --> TRAIN`}
        />
      </LessonSection>

      <LessonSection title="Constitutional AI at a high level">
        <p className="text-slate-300">
          <strong className="text-white">Constitutional AI</strong> (popularized by Anthropic&apos;s work) uses a
          written set of <strong className="text-white">principles</strong> — a “constitution” — to critique and
          revise model answers. Instead of only asking “which is nicer?”, you ask “which better respects these
          rules?” and often rewrite toward compliance.
        </p>
        <Example title="Principle → critique → revise (toy)">{`Principle: Prefer honest uncertainty over false confidence.

Draft: "Your loan is 100% guaranteed approved tomorrow."
Critique: Violates honesty; invents a guarantee.
Revised: "I can't guarantee approval. Here's how to check status
          and what documents usually matter."`}</Example>
        <Flowchart
          title="Constitutional critique loop"
          chart={`flowchart TB
  DRAFT[Model draft answer] --> CRIT[Critique with principles]
  CRIT --> FIX{Violations?}
  FIX -->|Yes| REV[Revise toward constitution]
  REV --> CRIT
  FIX -->|No / enough| KEEP[Keep revised answer]
  KEEP --> PAIR[Use as preferred / training data]
  CONST[Written principles] -.-> CRIT`}
        />
        <Callout variant="insight" title="Principles are product policy">
          A constitution is not magic morality — it is your documented priorities (safety, honesty, privacy,
          inclusivity, legal constraints). Bad principles → systematically wrong revisions.
        </Callout>
      </LessonSection>

      <LessonSection title="Strengths: scale">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Volume</strong> — label coverage across many prompts and edge cases.
          </li>
          <li>
            <strong className="text-white">Speed</strong> — iterate preferences when product policy changes without
            waiting weeks for a human queue.
          </li>
          <li>
            <strong className="text-white">Consistency of rubric</strong> — the same judge prompt applied uniformly
            (though still imperfect).
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Risks: bias inheritance">
        <p className="text-slate-300">
          AI judges inherit training biases, overconfidence, and blind spots. If the judge prefers verbose or
          flattering text, your aligned model will too. If the constitution underspecifies harm, critiques miss it.
        </p>
        <Flowchart
          title="Bias can cascade"
          chart={`flowchart LR
  JUDGE[Biased or weak judge] --> LABELS[Skewed preferences]
  LABELS --> TRAIN[Alignment training]
  TRAIN --> MODEL[Biased aligned model]
  MODEL --> MORE[Generates more like itself]
  MORE -.-> JUDGE`}
        />
        <Callout variant="insight" title="Guardrails for RLAIF">
          Hold out human-labeled gold sets. Measure agreement between AI and humans. Rotate judges. Never treat
          AI-only labels as ground truth for high-stakes safety without human review.
        </Callout>
      </LessonSection>

      <LessonSection title="How RLAIF and Constitutional AI relate">
        <p className="text-slate-300">
          Constitutional AI is one structured way to generate AI feedback (critique/revise with principles). RLAIF
          is the broader idea of using AI labels in RL/preference pipelines. You can do RLAIF with simple
          “which is better?” judges; constitutional critique adds an explicit policy document in the loop.
        </p>
        <ContentStep number={1} title="Write principles the product actually believes">
          <p className="text-slate-300">Short, testable rules beat vague slogans.</p>
        </ContentStep>
        <ContentStep number={2} title="Generate critiques and revisions at scale">
          <p className="text-slate-300">Build preferred answers or preference pairs from the loop.</p>
        </ContentStep>
        <ContentStep number={3} title="Train with DPO/RLHF and evaluate with humans">
          <p className="text-slate-300">Close the loop with reality checks, not only AI self-approval.</p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RLAIF uses AI models to supply preference/reward feedback at scale, often with human calibration.',
          'Constitutional AI critiques and revises answers using written principles — then those revisions can become training data.',
          'Strengths: speed, coverage, uniform rubrics; risks: inherited bias and overconfident judges.',
          'Critique loop: draft → critique with principles → revise → keep preferred / pairs.',
          'Treat AI feedback as scalable labels, not automatic ground truth — hold out human gold evals.',
        ]}
      />
    </LessonArticle>
  )
}
