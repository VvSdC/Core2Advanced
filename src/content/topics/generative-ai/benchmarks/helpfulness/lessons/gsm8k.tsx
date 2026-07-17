import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function Gsm8k() {
  return (
    <LessonArticle>
      <Definition term="GSM8K (Grade School Math 8K)">
        <p>
          <strong className="text-white">GSM8K</strong> is a dataset of about eight thousand{' '}
          <span className="text-genai-400">grade-school math word problems</span>. Models must read a short
          story-problem, do multi-step arithmetic reasoning, and produce the final numeric answer.
        </p>
        <p className="mt-2 text-slate-300">
          It is a classic test of <em>linguistic + arithmetic</em> reasoning — not competition olympiad math.
        </p>
      </Definition>

      <Callout variant="beginner" title="What GSM8K measures">
        Can the model follow a word problem through several simple calculation steps and land on the right
        number?
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Multi-step arithmetic in language">
          <p className="text-slate-300">
            Problems usually need 2–8 elementary operations (+ − × ÷) with intermediate quantities. The hard
            part is tracking the story, not calculus.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Exact answer matching">
          <p className="text-slate-300">
            Scoring typically checks whether the final number matches gold (with a consistent extraction
            rule). Pretty explanations that end on the wrong integer still fail.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Chain-of-thought is common">
          <p className="text-slate-300">
            Prompting the model to <strong className="text-white">show steps</strong> (chain-of-thought) often
            boosts GSM8K a lot versus “answer only.” When comparing scores, check whether CoT was used.
          </p>
        </ContentStep>
        <Flowchart
          title="GSM8K + CoT"
          chart={`flowchart LR
  WP[Word problem] --> COT[Step-by-step reasoning]
  COT --> ANS[Final number]
  ANS --> MATCH{Matches gold?}
  MATCH -->|yes| PASS[Correct]
  MATCH -->|no| FAIL[Incorrect]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">High</strong> — strong grade-school word-problem reasoning under
            that prompt (often near ceiling for frontier models with CoT).
          </li>
          <li>
            <strong className="text-white">Low</strong> — loses track of intermediate values, misreads the
            question, or arithmetic slips.
          </li>
          <li>
            Saturation warning: if every candidate is 90%+, switch to harder math (MATH / MATH-500) for
            differentiation.
          </li>
        </ul>
        <Callout variant="insight" title="Calculator tools change the game">
          Models with code/tool executors can offload arithmetic. That is a different system than “pure” next-
          token math — label it clearly.
        </Callout>
      </LessonSection>

      <LessonSection title="Sample question style (paraphrased)">
        <Example title="GSM8K-style word problem">{`Maya has 3 boxes of crayons. Each box has 12 crayons.
She gives 5 crayons to her brother and then buys 1 more box.
How many crayons does she have now?

Reasoning sketch:
  3 × 12 = 36
  36 − 5 = 31
  31 + 12 = 43

Final answer: 43`}</Example>
        <p className="mt-4 text-slate-300">
          Real GSM8K items are fixed published word problems. The sketch above only shows the multi-step
          pattern — paraphrase for teaching; do not dump copyrighted sets into apps.
        </p>
      </LessonSection>

      <LessonSection title="How teams usually run it">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Extract the <strong className="text-white">final number</strong> with a consistent parser (e.g.
            after “####” or the last integer) so grading stays fair.
          </li>
          <li>
            Compare models at the <span className="text-genai-400">same</span> decoding settings — greedy vs
            sampled CoT changes both accuracy and cost.
          </li>
          <li>
            Use GSM8K as a cheap regression gate; promote winners to MATH/MATH-500 when you need headroom.
          </li>
        </ul>
        <Callout variant="tip" title="Product fit">
          Great smoke test for tutoring and “reason about quantities in text.” Weak proxy for olympiad claims
          or spreadsheet agents.
        </Callout>
      </LessonSection>

      <LessonSection title="Limitations — what GSM8K does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Algebra contests, proofs, or symbolic math research.</li>
          <li>Real spreadsheet / finance workflows with messy tables.</li>
          <li>Whether explanations are pedagogically good for students.</li>
          <li>General knowledge (MMLU) or coding (HumanEval).</li>
        </ul>
        <Callout variant="beginner" title="Contamination note">
          Popular math sets appear in training data discussions often. Treat sky-high scores with healthy
          skepticism and complement with held-out private math sets when stakes are high.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'GSM8K measures multi-step grade-school math word-problem accuracy.',
          'High score ≈ reliable elementary reasoning; low ≈ story-tracking or arithmetic failures.',
          'Chain-of-thought prompting is common and must be held constant in comparisons.',
          'It does not measure olympiad math, finance tools, or teaching quality.',
          'When saturated, move to MATH / MATH-500 for harder signal.',
        ]}
      />
    </LessonArticle>
  )
}
