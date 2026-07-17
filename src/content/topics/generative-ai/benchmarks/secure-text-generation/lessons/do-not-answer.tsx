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

export function DoNotAnswer() {
  return (
    <LessonArticle>
      <Definition term="Do-Not-Answer">
        <p>
          <strong className="text-white">Do-Not-Answer</strong> is a dataset of questions that{' '}
          <strong className="text-white">should not be answered with harmful content</strong>. It evaluates
          whether chat models refuse or safely redirect instead of providing dangerous assistance across a
          taxonomy of risk types.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a list of questions a responsible adult would decline to answer with actionable detail —
          the benchmark checks whether your assistant behaves like that adult.
        </p>
      </Definition>

      <Callout variant="beginner" title="What Do-Not-Answer measures">
        Appropriate refusal / safe handling on questions that must not receive harmful answers. Higher safe
        response rates (or lower harmful answer rates) are better.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Questions that should not get harmful answers">
          <p className="text-slate-300">
            Items span risk areas (discrimination, information hazards, malicious uses, human-chatbot
            interaction harms, etc. — exact taxonomy per paper version). We only name them as{' '}
            <span className="font-mono text-sm text-genai-400">[harmful request category]</span> here.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Response categorization">
          <p className="text-slate-300">
            Evaluators (human or automated) label replies: direct refusal, safe redirect, partial unsafe,
            full harmful compliance, and similar buckets. The goal is fewer harmful compliances.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Chat assistant setting">
          <p className="text-slate-300">
            Designed for instruction-following chat models with a refusal policy — not for measuring toxic
            web-text continuation.
          </p>
        </ContentStep>
        <Flowchart
          title="Do-Not-Answer evaluation"
          chart={`flowchart LR
  Q[Do-not-answer question] --> M[Chat model reply]
  M --> L[Label: refuse / redirect / harmful]
  L --> S[Safe rate vs harmful rate]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Higher safe / refusal quality</strong> — model more often declines
            or redirects without actionable harm.
          </li>
          <li>
            <strong className="text-white">Higher harmful answer rate</strong> — model frequently provides
            content it should not; poor fit for open chat without extra filters.
          </li>
          <li>
            Category breakdowns matter: a model may refuse “obvious” risks yet leak on subtler information
            hazards.
          </li>
        </ul>
        <Example title="Safe placeholder item">
{`User: "[harmful request category] — explain how to do it in detail."

Good: refuse + brief reason + optional safe alternative (e.g. official resources)
Bad: step-by-step actionable harmful content
Score: label bucket → aggregate safe vs unsafe rates`}
        </Example>
      </LessonSection>

      <LessonSection title="What Do-Not-Answer does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Strong optimized jailbreaks</strong> as a full attack framework
            (see HarmBench / JailbreakBench).
          </li>
          <li>
            <strong className="text-white">Over-refusal</strong> on benign lookalikes (XSTest).
          </li>
          <li>
            <strong className="text-white">BBQ-style demographic bias</strong> or{' '}
            <strong className="text-white">TruthfulQA</strong> myth resistance.
          </li>
          <li>
            Completion toxicity from RealToxicityPrompts prefixes.
          </li>
        </ul>
        <Callout variant="tip" title="Beginner placement">
          Do-Not-Answer is an excellent first chat-safety smoke test: “Does the model refuse the questions it
          should?” Follow with a jailbreak suite and XSTest.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Do-Not-Answer tests questions that must not receive harmful answers.',
          'Higher safe refusal/redirect rates are better; harmful compliance rates should be low.',
          'Chat-focused taxonomy evaluation — great beginner smoke test for assistants.',
          'Does not replace jailbreak ASR, over-refusal, bias, or toxicity suites.',
        ]}
      />
    </LessonArticle>
  )
}
