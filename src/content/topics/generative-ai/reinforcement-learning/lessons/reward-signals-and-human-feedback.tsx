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

export function RewardSignalsAndHumanFeedback() {
  return (
    <LessonArticle>
      <Definition term="Reward signal for text">
        <p>
          A <strong className="text-white">reward</strong> is a number (or ranking that becomes a number) saying how
          good an answer is for training. For language models, the “goodness” is not a game score on a screen — it is
          a stand-in for <span className="text-genai-400">human preference</span>: helpful, honest, and safe enough
          to reinforce.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a cooking contest does not hand the chef a calorie meter. Judges taste and score. That score is the
          reward signal that coaches future dishes.
        </p>
      </Definition>

      <Callout variant="beginner" title="Why text needs special care">
        Unlike a racer who finishes a lap in 62 seconds, “good answer” is subjective. Your job when designing feedback
        is to make that subjectivity as consistent and useful as possible — knowing it will never be perfect.
      </Callout>

      <LessonSection title="What a reward looks like for text">
        <ContentStep number={1} title="Pairwise preference (most common)">
          <p className="text-slate-300">
            Same prompt, two answers — pick a winner. Later algorithms turn “A beats B” into training pressure. Easier
            for humans than assigning absolute stars.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Scalar score">
          <p className="text-slate-300">
            Rate the answer 1–7 on helpfulness or safety. Powerful but noisy: different people use the scale
            differently.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Rule / automated checks">
          <p className="text-slate-300">
            Format validators, toxicity filters, unit tests for code, citation checkers. These are{' '}
            <strong className="text-white">automated scores</strong> — cheap and scalable, but partial. They catch
            what you can code; they miss nuanced honesty.
          </p>
        </ContentStep>
        <Example title="Three shapes of feedback">{`Pairwise:  Answer A ≻ Answer B for this prompt
Scalar:    Helpfulness = 6 / 7
Automated: JSON parses? yes → +1; leaked secret? → big penalty`}</Example>
      </LessonSection>

      <LessonSection title="Human labels vs automated scores">
        <Flowchart
          title="Two feedback factories"
          chart={`flowchart TB
  PROMPT[Prompt + model answers] --> HUM[Human raters]
  PROMPT --> AUTO[Automated graders]
  HUM --> PREF[Preferences / ratings<br/>rich but expensive]
  AUTO --> RULES[Rules / models / tests<br/>cheap but narrow]
  PREF --> TRAIN[Training signal]
  RULES --> TRAIN`}
        />
        <p className="mt-4 text-slate-300">
          <strong className="text-white">Human feedback</strong> captures subtle taste: tone, honesty under
          uncertainty, graceful refusals. <strong className="text-white">Automated feedback</strong> scales:
          run every night on thousands of prompts. Real pipelines mix both — humans define the gold standard; machines
          amplify cheaper checks.
        </p>
        <Callout variant="insight" title="AI judges are still “raters”">
          Teams sometimes use stronger models as judges. That is still a feedback source with biases — treat it like a
          (faster, cheaper, imperfect) annotator, not magic truth.
        </Callout>
      </LessonSection>

      <LessonSection title="Sparse vs dense feedback — beginner intuition">
        <p className="text-slate-300">
          <strong className="text-white">Sparse</strong> means you get a score rarely — often only at the end of an
          answer. <strong className="text-white">Dense</strong> means frequent, local scores (for example, per
          sentence checks). LLM RLHF is often sparse: generate a long reply, then one preference label for the whole
          thing.
        </p>
        <Flowchart
          title="Sparse vs dense (intuition)"
          chart={`flowchart LR
  subgraph SPARSE[Sparse]
    GEN1[Write whole essay] --> ONE[One final grade]
  end
  subgraph DENSE[Dense]
    S1[Sentence 1] --> C1[Check]
    S2[Sentence 2] --> C2[Check]
    S3[Sentence 3] --> C3[Check]
  end`}
        />
        <p className="mt-4 text-slate-300">
          Sparse feedback is realistic (humans hate labeling every token) but harder for learning: the model must
          figure out <em>which part</em> of a long answer caused the low score. Dense automated checks can help for
          format and safety rails, yet they cannot replace whole-answer human judgment alone.
        </p>
        <Callout variant="tip" title="Remember the cooking contest">
          Sparse: only the final plate is scored. Dense: a mentor tastes the sauce every few minutes. RLHF is mostly
          “final plate,” which is why preference data quality matters so much.
        </Callout>
      </LessonSection>

      <LessonSection title="Bias and disagreement among raters">
        <p className="text-slate-300">
          Two thoughtful humans can disagree — culture, expertise, risk appetite, and instructions all matter. That is
          not a bug you can fully delete; it is a property of preference data.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Instruction bias</strong> — guidelines that push raters toward overly long
            or overly cautious answers.
          </li>
          <li>
            <strong className="text-white">Expertise mismatch</strong> — non-experts rating medical or legal nuance.
          </li>
          <li>
            <strong className="text-white">Position / verbosity bias</strong> — preferring the longer answer or the one
            shown first.
          </li>
          <li>
            <strong className="text-white">Disagreement</strong> — real conflict about which refusal style is better.
          </li>
        </ul>
        <CodeBlock title="Healthy humility about labels">{`# Prefer asking:
# "Which is better for a careful general assistant?"
# over pretending one rater owns Absolute Truth.

# Mitigations teams try:
# - clear rubrics (written grading guides)
# - multiple raters + agreement checks
# - specialist pools for hard domains
# - holding out evals the training labels never saw`}</CodeBlock>
        <Callout variant="beginner" title="Why this lesson matters for later hacking talks">
          If the signal is noisy or systematically biased, the model can “win” the score while losing the spirit —
          that is the doorway to reward hacking in the challenges lesson.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A text reward is a numeric stand-in for human preference (or automated checks approximating it).',
          'Humans give rich but costly labels; automated scores scale narrow rules and tests.',
          'Sparse = score the whole answer; dense = frequent local checks — RLHF is often sparse.',
          'Rater bias and disagreement are normal; good rubrics and mixed evals reduce (not erase) them.',
        ]}
      />
    </LessonArticle>
  )
}
