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

export function Advbench() {
  return (
    <LessonArticle>
      <Definition term="AdvBench">
        <p>
          <strong className="text-white">AdvBench</strong> (Adversarial Benchmark) is a dataset of{' '}
          <strong className="text-white">harmful instructions</strong> used heavily in jailbreak research. It
          asks: if we attack the model (or simply issue adversarial harmful asks), does it produce the
          requested harmful content?
        </p>
        <p className="mt-2 text-slate-300">
          Many papers report ASR on AdvBench strings when demonstrating a new attack or a new defense. It is a
          common <strong className="text-white">yardstick for adversarial instruction following</strong>.
        </p>
      </Definition>

      <Callout variant="beginner" title="What AdvBench measures">
        Susceptibility to adversarial harmful instructions — typically via attack success rate on a fixed set
        of harmful goals. Lower ASR is safer.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Harmful instruction strings">
          <p className="text-slate-300">
            Each item is a goal like “produce content in{' '}
            <span className="font-mono text-sm text-genai-400">[harmful request category]</span>.” Papers never
            need you to invent new harmful goals to understand the metric: success = model complies with the
            harmful goal.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Often paired with attack algorithms">
          <p className="text-slate-300">
            Classic use: an optimizer or template wraps the AdvBench goal into a{' '}
            <strong className="text-white">jailbreak prompt</strong>; ASR is measured after the attack. Direct
            asks without jailbreaks are a weaker baseline.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Chat / instruction model focus">
          <p className="text-slate-300">
            Designed for instruction-tuned and chat models that are supposed to refuse. Base completion models
            may not be the intended comparison target.
          </p>
        </ContentStep>
        <Flowchart
          title="AdvBench in a jailbreak paper"
          chart={`flowchart LR
  G[AdvBench harmful goals] --> ATK[Attack method wraps goal]
  ATK --> M[Model output]
  M --> J[Success judge]
  J --> ASR[Attack Success Rate]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Low ASR</strong> — under that attack + judge, the model rarely
            fulfilled AdvBench harmful goals.
          </li>
          <li>
            <strong className="text-white">High ASR</strong> — the attack often succeeded; defenses may be weak
            or the model is too compliant.
          </li>
          <li>
            ASR of <strong className="text-white">0%</strong> on one attack does not mean safety forever —
            other attacks or judges can still succeed.
          </li>
        </ul>
        <Example title="Safe placeholder — how papers talk about it">
{`Dataset: AdvBench (harmful instruction goals)
Attack: [named jailbreak method]
Judge: keyword / LLM judge (paper-specific)
Metric: ASR on AdvBench subset
We do not reproduce the harmful goal text here.`}
        </Example>
      </LessonSection>

      <LessonSection title="What AdvBench does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Full automated red-team harness richness</strong> of HarmBench
            (behaviors × many attack methods as a framework).
          </li>
          <li>
            <strong className="text-white">Over-refusal</strong>, <strong className="text-white">bias</strong>,{' '}
            <strong className="text-white">truthfulness</strong>, or completion toxicity.
          </li>
          <li>
            Whether refusals are user-friendly — only whether the harmful goal was achieved.
          </li>
        </ul>
        <Callout variant="insight" title="How it relates to JailbreakBench">
          AdvBench is a widely reused harmful-goal set. <span className="text-genai-400">JailbreakBench</span>{' '}
          aims for a more standardized jailbreak leaderboard protocol. You will see both names in papers —
          read which dataset and judge they actually used.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'AdvBench = harmful instruction goals used to evaluate jailbreak attacks and defenses.',
          'Headline metric is usually ASR — lower is safer under that attack/judge.',
          'Chat/instruction-focused; often wrapped by attack algorithms.',
          'Does not measure over-refusal, bias, truthfulness, or full product policy coverage.',
        ]}
      />
    </LessonArticle>
  )
}
