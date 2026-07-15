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

export function PreferenceDataCollection() {
  return (
    <LessonArticle>
      <Definition term="Preference data">
        <p>
          <strong className="text-white">Preference data</strong> tells a model which answer is better for the same
          prompt — not just “here is a good answer,” but “prefer{' '}
          <span className="text-genai-400">this</span> over{' '}
          <span className="text-genai-400">that</span>.” Alignment methods (RLHF, DPO, and friends) learn from those
          comparisons.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: two movie trailers for the same film. You are not teaching cinema from scratch; you are saying
          which trailer feels clearer and safer to show beginners.
        </p>
      </Definition>

      <Callout variant="beginner" title="Start here before any loss function">
        If your pairs are inconsistent, noisy, or biased, every fancy trainer still learns the wrong taste. Data
        quality beats method choice for beginners.
      </Callout>

      <LessonSection title="Chosen vs rejected pairs">
        <p className="text-slate-300">
          The workhorse format is a <strong className="text-white">triple</strong>: one prompt, one{' '}
          <strong className="text-white">chosen</strong> completion, one{' '}
          <strong className="text-white">rejected</strong> completion. Both answers can be fluent; the label only
          ranks them.
        </p>
        <Flowchart
          title="What a preference example contains"
          chart={`flowchart LR
  P[Prompt] --> C[Chosen answer]
  P --> R[Rejected answer]
  C --> L[Label: chosen ≻ rejected]
  R --> L
  L --> DS[Preference dataset]`}
        />
        <ContentStep number={1} title="Same prompt for both answers">
          <p className="text-slate-300">
            Comparing answers to different questions teaches almost nothing useful. Keep the prompt fixed.
          </p>
        </ContentStep>
        <ContentStep number={2} title="A clear reason one wins">
          <p className="text-slate-300">
            Prefer differences that matter for your product: clarity, safety, honesty, tone — not trivia.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Avoid trivial wins">
          <p className="text-slate-300">
            If rejected is gibberish, the model already “knows” that from SFT. Prefer close contests where taste or
            policy differs.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="How humans and LLMs label">
        <p className="text-slate-300">
          <strong className="text-white">Human labelers</strong> read guidelines, see two (or more) completions, and
          pick a winner — or mark a tie. <strong className="text-white">LLM-as-judge</strong> does the same with a
          careful rubric prompt. Many teams mix both: LLMs for scale, humans for calibration and hard cases.
        </p>
        <Flowchart
          title="Labeling paths"
          chart={`flowchart TB
  GEN[Generate 2+ candidate answers] --> WHO{Who judges?}
  WHO -->|Humans| H[Annotators + guidelines]
  WHO -->|LLM judge| J[Rubric prompt + model]
  WHO -->|Hybrid| HY[LLM first, human audit]
  H --> PAIR[Store chosen / rejected]
  J --> PAIR
  HY --> PAIR`}
        />
        <Callout variant="insight" title="Judges can disagree">
          Two careful humans may split on tone. Inter-annotator agreement checks and rewrites of guidelines matter
          as much as collecting more raw pairs.
        </Callout>
      </LessonSection>

      <LessonSection title="Annotation guidelines and consistency">
        <p className="text-slate-300">
          Write rules before you label at scale. Vague goals (“be helpful”) produce noisy pairs; concrete axes do
          not.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Priority order</strong> — e.g. safety overrides style; honesty overrides
            polish when they conflict.
          </li>
          <li>
            <strong className="text-white">Tie / skip rules</strong> — when differences are tiny, skip or mark tie
            instead of forcing a winner.
          </li>
          <li>
            <strong className="text-white">Gold spot-checks</strong> — a small set of expert-labeled items every
            labeler sees, to measure drift.
          </li>
          <li>
            <strong className="text-white">Examples of borderline cases</strong> — teach agreement, not just
            definitions.
          </li>
        </ul>
        <Flowchart
          title="Consistency loop"
          chart={`flowchart LR
  G[Write guidelines] --> PILOT[Pilot 50–100 pairs]
  PILOT --> AGREE{Agreement OK?}
  AGREE -->|No| FIX[Clarify rules / examples]
  FIX --> PILOT
  AGREE -->|Yes| SCALE[Scale labeling]
  SCALE --> AUDIT[Periodic audits]`}
        />
      </LessonSection>

      <LessonSection title="Online vs offline preference data">
        <p className="text-slate-300">
          <strong className="text-white">Offline</strong> data is a fixed dataset you train on: you already have
          prompts and labeled pairs. <strong className="text-white">Online</strong> data is collected in a loop —
          the current model generates answers, judges label them, then you update and repeat.
        </p>
        <Flowchart
          title="Offline vs online collection"
          chart={`flowchart TB
  subgraph OFF[Offline]
    OD[Fixed prompts + pairs] --> OT[Train once or few rounds]
  end
  subgraph ON[Online]
    M[Current model] --> GEN[Generate answers]
    GEN --> LAB[Label prefs]
    LAB --> UPD[Update model]
    UPD --> M
  end`}
        />
        <Callout variant="tip" title="Practical default">
          Most beginner and startup workflows start <em>offline</em> (DPO on a curated set). Online loops are
          powerful but operationally heavier.
        </Callout>
      </LessonSection>

      <LessonSection title="Good and bad pair examples">
        <Example title="Good pair — clear preference axis">{`prompt:   "User asks how to reset their password."
chosen:   "Go to Settings → Account → Reset password. You'll get an email link that expires in 15 minutes.
           If you don't see it, check spam or contact support@…"
rejected: "Just try logging in again or reboot your router."

# Axis: helpfulness + correctness. Rejected is fluent but wrong.`}</Example>
        <Example title="Weak / bad pair — not useful signal">{`prompt:   "Summarize photosynthesis."
chosen:   "Plants convert light energy into chemical energy…"
rejected: "asdfjkl qwerty !!!!1"

# Too easy: rejected is trash. Preference training barely learns product taste.`}</Example>
        <Example title="Risky pair — mixed signals">{`prompt:   "Is this product recyclable?"
chosen:   "Yes! Definitely 100% recyclable everywhere."   # sounds confident but may be false
rejected: "I don't have your local rules; check the packaging code or local guide."

# If honesty is higher priority than confidence, labels may need flipping.`}</Example>
        <p className="mt-4 text-slate-300">
          Before you train, skim a random sample of pairs with your guidelines open. If you cannot say why chosen
          wins in one sentence, fix the data.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Preference data is usually prompt + chosen + rejected for the same user request.',
          'Humans, LLM judges, or hybrids can label; guidelines and agreement checks keep labels consistent.',
          'Offline = fixed dataset; online = generate → label → update in a loop.',
          'Prefer close, product-relevant contests over trivial garbage vs gold comparisons.',
          'Noisy or contradictory pairs poison every alignment method that follows.',
        ]}
      />
    </LessonArticle>
  )
}
