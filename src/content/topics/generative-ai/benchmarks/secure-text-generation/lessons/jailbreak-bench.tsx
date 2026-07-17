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

export function JailbreakBench() {
  return (
    <LessonArticle>
      <Definition term="JailbreakBench">
        <p>
          <strong className="text-white">JailbreakBench</strong> is an open effort to{' '}
          <strong className="text-white">standardize jailbreak evaluation</strong>: shared harmful behaviors,
          attack artifacts, judging, and leaderboard-style reporting of{' '}
          <strong className="text-white">attack success rate (ASR)</strong> so results are comparable across
          papers.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: before racing rules, every track timed cars differently. JailbreakBench tries to be the
          shared stopwatch for jailbreak attacks and defenses.
        </p>
      </Definition>

      <Callout variant="beginner" title="What JailbreakBench measures">
        How often jailbreak attacks succeed against a model under a standardized behavior set and judging
        protocol. Lower ASR is safer.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Fixed harmful behaviors">
          <p className="text-slate-300">
            A library of behaviors the model should not assist with (we only refer to them as{' '}
            <span className="font-mono text-sm text-genai-400">[harmful request category]</span>). Attacks try
            to elicit compliance on those behaviors.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Attacks and defenses on one leaderboard">
          <p className="text-slate-300">
            Researchers submit jailbreak methods or defense setups. The point is reproducible comparison —
            not a one-off screenshot of a single clever prompt.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Chat / aligned model focus">
          <p className="text-slate-300">
            Evaluation assumes an assistant that is supposed to refuse. Scoring uses a specified judge so
            “success” means the same thing across entries.
          </p>
        </ContentStep>
        <Flowchart
          title="JailbreakBench loop"
          chart={`flowchart TB
  B[Standard behaviors] --> ATK[Jailbreak attack]
  ATK --> M[Model under test]
  M --> J[Standard judge]
  J --> ASR[ASR on leaderboard]
  DEF[Optional defense layer] --> M`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Low ASR</strong> — fewer successful jailbreaks under the
            standardized protocol; stronger for that attack set.
          </li>
          <li>
            <strong className="text-white">High ASR</strong> — attacks frequently bypass refusals; needs
            stronger alignment, filters, or both.
          </li>
          <li>
            Leaderboard rank for an <em>attack</em> being high means the attack is strong (bad for models);
            for a <em>defense</em>, you want to drive ASR down.
          </li>
        </ul>
        <Example title="Safe reporting template">
{`Benchmark: JailbreakBench
Behaviors: standard set (categories only)
Attack: [named method]
Defense: [none | system filter | ... ]
Judge: official JBB judge version
ASR: 15% (lower is safer for the model)`}
        </Example>
      </LessonSection>

      <LessonSection title="What JailbreakBench does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Over-refusal</strong> (XSTest) — a defense that refuses everything
            can look great on ASR and terrible on UX.
          </li>
          <li>
            <strong className="text-white">Bias</strong>, <strong className="text-white">truthfulness</strong>,
            or <strong className="text-white">completion toxicity</strong>.
          </li>
          <li>
            Every possible future jailbreak — standardization improves fairness; it does not freeze attackers.
          </li>
        </ul>
        <Callout variant="insight" title="vs AdvBench / HarmBench">
          AdvBench is a classic harmful-goal dataset; HarmBench is a broad red-teaming framework;
          JailbreakBench emphasizes a shared jailbreak leaderboard protocol. Papers may use more than one —
          read the methods section.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'JailbreakBench standardizes jailbreak ASR evaluation and reporting.',
          'Lower ASR = more resistant under the shared behaviors, attacks, and judge.',
          'Chat/aligned-model focused; compare only under the same protocol.',
          'Does not measure over-refusal, bias, truthfulness, or completion toxicity.',
        ]}
      />
    </LessonArticle>
  )
}
