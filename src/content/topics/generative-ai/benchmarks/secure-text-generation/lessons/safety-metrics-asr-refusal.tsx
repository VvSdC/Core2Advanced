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
} from '../../../../../../components/content'

export function SafetyMetricsAsrRefusal() {
  return (
    <LessonArticle>
      <Definition term="Core safety metrics">
        <p>
          Safety leaderboards rarely use “accuracy” the way MMLU does. Instead you will see{' '}
          <strong className="text-white">attack success rate (ASR)</strong>,{' '}
          <strong className="text-white">refusal rate</strong>,{' '}
          <strong className="text-white">over-refusal</strong>, and{' '}
          <strong className="text-white">toxicity probability</strong>. Understanding these four words lets you
          read almost any secure-generation paper.
        </p>
      </Definition>

      <LessonSection title="Attack Success Rate (ASR)">
        <p className="text-slate-300">
          <strong className="text-white">ASR</strong> = share of adversarial or harmful attempts where the model{' '}
          <em>fails</em> safety — i.e. the attack “succeeds.” On jailbreak benches,{' '}
          <strong className="text-white">lower ASR is better</strong> (the model resisted more often).
        </p>
        <CodeBlock title="ASR intuition">{`ASR = (# harmful successful replies) / (# attack attempts)

Example: 20 successes out of 100 jailbreak tries → ASR = 20%
Safer model: lower ASR.`}
        </CodeBlock>
        <Callout variant="beginner" title="Do not invert this">
          High ASR is bad for safety. High accuracy on MMLU is good for knowledge. Same word “rate,” opposite
          vibes — always check the metric definition.
        </Callout>
      </LessonSection>

      <LessonSection title="Refusal rate and over-refusal">
        <ContentStep number={1} title="Refusal rate">
          <p className="text-slate-300">
            Fraction of prompts where the model declines to answer (or refuses actionable harm). On a set of
            clearly harmful asks, a <strong className="text-white">higher</strong> refusal rate is usually
            better — but only if refusals are appropriate.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Over-refusal">
          <p className="text-slate-300">
            Refusing a <strong className="text-white">benign</strong> prompt that should be answered. Measured
            by suites like <span className="text-genai-400">XSTest</span> (exaggerated safety). High
            over-refusal means the model is “too scared” to help.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Under-refusal">
          <p className="text-slate-300">
            Answering when it should refuse. That shows up as high ASR or low refusal on harmful sets
            (HarmBench, Do-Not-Answer, AdvBench-style attacks).
          </p>
        </ContentStep>
        <Flowchart
          title="Helpfulness vs safety tradeoff"
          chart={`flowchart LR
  A[Push refusal higher] --> B[Lower ASR on harmful asks]
  A --> C[Risk: over-refusal on benign asks]
  D[Push helpfulness higher] --> E[Better XSTest / user satisfaction]
  D --> F[Risk: higher ASR if guardrails weaken]
  B --> G[Balance with XSTest + jailbreak suites]
  E --> G
  C --> G
  F --> G`}
        />
      </LessonSection>

      <LessonSection title="Toxicity probability">
        <p className="text-slate-300">
          A classifier assigns how likely a string is toxic (insults, hate, threats, etc.). Completion suites
          report expected max toxicity or the rate of generations above a threshold.{' '}
          <strong className="text-white">Lower</strong> toxicity probability is safer for open-ended generation.
        </p>
        <Example title="How a score is produced (conceptual)">
{`1. Model continues a prompt
2. Toxicity classifier scores the continuation (0–1)
3. Aggregate: mean toxicity, or % above threshold
No human needed for every sample — but classifiers can err.`}
        </Example>
      </LessonSection>

      <LessonSection title="Judge models and classifiers">
        <p className="text-slate-300">
          Modern safety evals often use an <strong className="text-white">LLM-as-judge</strong> or a dedicated
          <strong className="text-white"> safety classifier</strong> to label whether a reply was a successful
          harmful compliance, a refusal, or something in between.
        </p>
        <div className="mt-4 space-y-3">
          {[
            [
              'Rule / keyword heuristics',
              'Fast but brittle — miss creative jailbreaks; overflag words like “kill” in video-game context.',
            ],
            [
              'Toxicity classifiers',
              'Good for RealToxicityPrompts-style scores; less ideal for nuanced policy categories.',
            ],
            [
              'LLM judges / specialized scorers',
              'Used in HarmBench, JailbreakBench, etc. Must document which judge — judges disagree.',
            ],
          ].map(([label, text]) => (
            <div key={label} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="mt-1 text-sm text-slate-400">{text}</p>
            </div>
          ))}
        </div>
        <Callout variant="insight" title="Always name the judge">
          “ASR = 12%” without the scorer version is hard to compare. Fair comparisons lock the same judge,
          prompts, and decoding settings.
        </Callout>
      </LessonSection>

      <LessonSection title="What these metrics do NOT tell you">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            ASR does not measure <strong className="text-white">truthfulness</strong> or demographic bias
            (those need TruthfulQA / BBQ).
          </li>
          <li>
            Refusal rate alone does not prove the refusal was <strong className="text-white">clear and
            useful</strong> to the user.
          </li>
          <li>
            Toxicity probability does not cover all policy risks (fraud, weapons guidance, self-harm, etc.).
          </li>
        </ul>
        <Callout variant="tip" title="Link to XSTest">
          When you tighten safety to lower ASR, re-check over-refusal with XSTest so helpfulness does not
          collapse.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'ASR: share of successful attacks — lower is safer on jailbreak/harm benches.',
          'Refusal rate: how often the model declines; interpret with whether the ask was harmful.',
          'Over-refusal (XSTest): refusing benign asks — high is bad for helpfulness.',
          'Toxicity probability: classifier score on generated text — lower is safer for completions.',
          'Judges/classifiers drive scores — lock the scorer when comparing models.',
        ]}
      />
    </LessonArticle>
  )
}
