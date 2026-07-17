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

export function Harmbench() {
  return (
    <LessonArticle>
      <Definition term="HarmBench">
        <p>
          <strong className="text-white">HarmBench</strong> is a standardized framework for{' '}
          <strong className="text-white">automated red teaming</strong> and measuring{' '}
          <strong className="text-white">robust refusal</strong>: can the model withstand a suite of harmful
          behaviors and attack methods under a shared evaluation pipeline?
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: not one pop quiz, but a gym circuit — many attack machines, same scoring rules, so labs can
          compare defenses fairly.
        </p>
      </Definition>

      <Callout variant="beginner" title="What HarmBench measures">
        How often the model produces harmful compliance under standardized harmful behaviors and (often)
        automated attack methods — typically summarized with attack success rate (ASR). Lower ASR is better.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Harmful behaviors as targets">
          <p className="text-slate-300">
            A catalog of behaviors the model should not assist with (represented here only as{' '}
            <span className="font-mono text-sm text-genai-400">[harmful request category]</span>). Each behavior
            is a target for attacks and for direct asking.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Standardized red teaming">
          <p className="text-slate-300">
            Beyond naive prompts, HarmBench supports <strong className="text-white">attack methods</strong>{' '}
            (algorithmic or template-based jailbreaks) so “we refused the obvious ask” is not enough — you test
            robustness.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Automated judging">
          <p className="text-slate-300">
            Replies are labeled harmful vs not (classifier / LLM judge). Headline metrics include{' '}
            <strong className="text-white">ASR</strong> across behaviors and attacks.
          </p>
        </ContentStep>
        <Flowchart
          title="HarmBench pipeline (conceptual)"
          chart={`flowchart TB
  B[Harmful behavior set] --> A[Direct asks + attack methods]
  A --> M[Model generations]
  M --> J[Harm classifier / judge]
  J --> S[ASR and breakdowns]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Low ASR</strong> — stronger robust refusal under the tested attacks
            and behaviors.
          </li>
          <li>
            <strong className="text-white">High ASR</strong> — the model (or its defenses) are frequently
            bypassed; unsafe for high-risk chat products without extra guardrails.
          </li>
          <li>
            Compare only under the <strong className="text-white">same attack set and judge</strong>. Changing
            either can move ASR a lot.
          </li>
        </ul>
        <Example title="Safe placeholder — reporting style">
{`Behavior family: [harmful request category]
Attacks tried: direct ask + standardized jailbreak methods (names only)
Judge: HarmBench-compatible classifier version X
Result: ASR = 8% (lower is safer)`}
        </Example>
      </LessonSection>

      <LessonSection title="What HarmBench does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Over-refusal</strong> on clearly benign prompts (use XSTest).
          </li>
          <li>
            <strong className="text-white">Demographic stereotype bias</strong> in QA (use BBQ).
          </li>
          <li>
            <strong className="text-white">Truthfulness</strong> under human falsehoods (use TruthfulQA).
          </li>
          <li>
            Guarantees against every future jailbreak — it standardizes a strong test, not an infinite one.
          </li>
        </ul>
        <Callout variant="tip" title="Pairing tip">
          HarmBench for “can attackers succeed?” + XSTest for “did we break helpfulness?” is a solid beginner
          duo for chat safety.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'HarmBench standardizes red teaming and robust refusal evaluation.',
          'Primary signal: ASR — lower means safer under the tested attacks.',
          'Includes behaviors + attack methods + automated judges for fair comparison.',
          'Does not measure over-refusal, bias QA, or truthfulness alone.',
        ]}
      />
    </LessonArticle>
  )
}
