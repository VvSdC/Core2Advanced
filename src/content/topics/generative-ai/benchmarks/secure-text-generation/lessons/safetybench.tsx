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

export function Safetybench() {
  return (
    <LessonArticle>
      <Definition term="SafetyBench">
        <p>
          <strong className="text-white">SafetyBench</strong> is a large{' '}
          <strong className="text-white">multi-category safety</strong> benchmark that often uses{' '}
          <strong className="text-white">multiple-choice questions</strong> to test whether a model{' '}
          <em>knows</em> safe choices across categories (ethics, illegal activities awareness, privacy, mental
          health-related safety knowledge, and more — depending on the release).
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a written driver&apos;s handbook test — it checks knowledge of the rules. Passing the written
          test is necessary but not the same as driving safely in a storm (open-ended jailbreaks).
        </p>
      </Definition>

      <Callout variant="beginner" title="What SafetyBench measures">
        Multi-category safety knowledge / preference via MCQ (and related formats): can the model select the
        safer option across many safety topics?
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Many safety categories">
          <p className="text-slate-300">
            Instead of one toxicity number, SafetyBench spreads items across categories so you see where
            “safety knowledge” is weak — e.g. privacy vs offensive content awareness.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Mostly knowledge / MCQ style">
          <p className="text-slate-300">
            The model picks among options. Scoring is accuracy-like:{' '}
            <strong className="text-white">higher accuracy = better</strong> at selecting the labeled safe
            choice under that rubric.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Chinese and English evaluations">
          <p className="text-slate-300">
            SafetyBench is widely cited for bilingual evaluation. If you compare scores, match language and
            subset.
          </p>
        </ContentStep>
        <Flowchart
          title="SafetyBench MCQ flow"
          chart={`flowchart LR
  Q[Safety MCQ item] --> M[Model picks option]
  M --> S[Match gold safe choice]
  S --> R[Overall + per-category accuracy]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Higher</strong> — stronger recognition of safer choices across
            categories in MCQ form.
          </li>
          <li>
            <strong className="text-white">Lower</strong> — gaps in safety knowledge or misaligned preferences
            on those items.
          </li>
          <li>
            High SafetyBench does <strong className="text-white">not</strong> guarantee low jailbreak ASR —
            knowing the rule ≠ resisting an adversarial chat attack.
          </li>
        </ul>
        <Example title="Safe paraphrased MCQ style">
{`Category: [privacy / ethics / other safety topic]
Question: Which response is more appropriate when asked for
[sensitive but non-actionable scenario]?

A) Overshare private data
B) Respect privacy / refuse improper disclosure
C) Invent credentials
Gold: B`}
        </Example>
      </LessonSection>

      <LessonSection title="What SafetyBench does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Open-ended jailbreak success</strong> under attack optimizers.
          </li>
          <li>
            <strong className="text-white">Toxic completion</strong> from web prefixes.
          </li>
          <li>
            <strong className="text-white">Over-refusal</strong> on benign free-form chat (XSTest).
          </li>
          <li>
            Demographic bias under BBQ&apos;s ambiguity design.
          </li>
        </ul>
        <Callout variant="tip" title="How to use it">
          Treat SafetyBench as a broad safety-knowledge smoke test. Still run a chat ASR suite and XSTest
          before shipping an assistant.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'SafetyBench = multi-category safety MCQ / knowledge-style evaluation.',
          'Higher accuracy ≈ better at selecting labeled safe options across categories.',
          'Useful breadth signal — not a substitute for jailbreak ASR or over-refusal tests.',
          'Does not measure toxic completions, BBQ bias, or attack robustness alone.',
        ]}
      />
    </LessonArticle>
  )
}
