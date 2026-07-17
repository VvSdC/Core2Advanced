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

export function Truthfulqa() {
  return (
    <LessonArticle>
      <Definition term="TruthfulQA">
        <p>
          <strong className="text-white">TruthfulQA</strong> checks whether a model{' '}
          <strong className="text-white">avoids mimicking common human falsehoods</strong>. Questions are
          designed so that a popular misconception is tempting; a truthful model resists copying that myth and
          gives a correct (or honestly uncertain) answer.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a student who repeats viral TikTok “facts” vs one who checks what is actually true. High
          TruthfulQA is closer to the second student.
        </p>
      </Definition>

      <Callout variant="beginner" title="What TruthfulQA measures">
        Truthfulness under questions that invite imitative falsehoods — not raw encyclopedic coverage like
        MMLU, and not refusal of harmful instructions.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Imitative falsehoods">
          <p className="text-slate-300">
            Many items target beliefs that are widespread but wrong. Models trained on internet text may
            “sound human” by repeating those errors. TruthfulQA penalizes that pattern.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Generation and multiple-choice variants">
          <p className="text-slate-300">
            Papers use free-form answers scored by rules/judges, and/or multiple-choice formulations. Always
            check which setup a leaderboard used.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Truthfulness vs informativeness">
          <p className="text-slate-300">
            Some analyses separate <strong className="text-white">truthful</strong> answers from ones that are
            also <strong className="text-white">informative</strong> (not just “I don&apos;t know” spam). Both
            matter for product quality.
          </p>
        </ContentStep>
        <Flowchart
          title="TruthfulQA idea"
          chart={`flowchart TB
  Q[Question with tempting myth] --> M[Model answer]
  M --> T{Matches truth criteria?}
  T -->|Yes| OK[Truthful credit]
  T -->|No — echoes myth| BAD[False / imitative failure]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Higher</strong> — more often resists popular falsehoods; safer for
            Q&amp;A products where myths cause real-world harm (health, science misconceptions).
          </li>
          <li>
            <strong className="text-white">Lower</strong> — frequently repeats human misconceptions; sounds
            confident while being wrong.
          </li>
          <li>
            A model can be high on MMLU and still middling on TruthfulQA — different failure modes.
          </li>
        </ul>
        <Example title="Safe paraphrased style (not a real item)">
{`Q: "According to a common myth, does [benign misconception topic] work as claimed?"

Imitative-false answer: confidently repeats the myth
Truthful answer: corrects the myth or states evidence-based reality
Scoring: match to truth labels / judge rubric`}
        </Example>
      </LessonSection>

      <LessonSection title="What TruthfulQA does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Refusal of harmful requests</strong> (Do-Not-Answer, HarmBench).
          </li>
          <li>
            <strong className="text-white">Demographic bias</strong> in under-specified QA (BBQ).
          </li>
          <li>
            <strong className="text-white">Toxicity of continuations</strong> (RealToxicityPrompts).
          </li>
          <li>
            Up-to-the-minute news accuracy — items are fixed; freshness needs retrieval evals.
          </li>
        </ul>
        <Callout variant="insight" title="Why it sits in a safety track">
          Spreading confident falsehoods can cause harm even when the user did not ask for “jailbreak”
          content. Truthfulness is a safety-adjacent reliability axis.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'TruthfulQA measures resistance to imitating common human falsehoods.',
          'Higher score ≈ more truthful under myth-bait questions; lower ≈ echoes misconceptions.',
          'Different from MMLU knowledge exams and from refusal/jailbreak suites.',
          'Does not measure toxicity, bias QA, or harmful-instruction ASR.',
        ]}
      />
    </LessonArticle>
  )
}
