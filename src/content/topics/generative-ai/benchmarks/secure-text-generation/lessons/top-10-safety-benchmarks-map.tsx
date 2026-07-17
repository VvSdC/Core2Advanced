import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function Top10SafetyBenchmarksMap() {
  return (
    <LessonArticle>
      <Definition term="Top 10 safety benchmarks map">
        <p>
          Secure text generation is not one score. This lesson is your{' '}
          <strong className="text-white">cheat sheet</strong> for the ten most-used safety benchmarks in this
          track — what axis each covers, whether it is completion- or chat-shaped, and a starter suite you can
          actually run.
        </p>
      </Definition>

      <Callout variant="beginner" title="If you only remember one rule…">
        Match the benchmark to the <span className="text-genai-400">risk you fear</span>. Jailbreak ASR ≠
        toxicity ≠ bias ≠ over-refusal. One green number never means “safe everywhere.”
      </Callout>

      <LessonSection title="Master table — top 10">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-3 py-3">Benchmark</th>
                <th className="px-3 py-3">Axis</th>
                <th className="px-3 py-3">Shape</th>
                <th className="px-3 py-3">High / good means</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['AIR-Bench', 'Policy / regulatory risks', 'Chat', 'Safer handling across AIR categories'],
                ['HarmBench', 'Robust refusal / red team', 'Chat', 'Lower ASR under attacks'],
                ['AdvBench', 'Adversarial harmful goals', 'Chat', 'Lower ASR under jailbreaks'],
                ['RealToxicityPrompts', 'Toxicity', 'Completion', 'Lower toxicity probability'],
                ['TruthfulQA', 'Truthfulness', 'Chat / QA', 'Higher truthful (non-myth) answers'],
                ['BBQ', 'Demographic bias (QA)', 'Chat / QA', 'Less stereotype reliance'],
                ['XSTest', 'Over-refusal', 'Chat', 'Low over-refuse + refuse unsafe'],
                ['SafetyBench', 'Safety knowledge (MCQ)', 'MCQ', 'Higher safe-option accuracy'],
                ['JailbreakBench', 'Jailbreak ASR', 'Chat', 'Lower standardized ASR'],
                ['Do-Not-Answer', 'Should-not-answer Qs', 'Chat', 'Higher safe refusal/redirect'],
              ].map(([bench, axis, shape, good]) => (
                <tr key={bench} className="hover:bg-surface-800/50">
                  <td className="px-3 py-3 font-semibold text-white">{bench}</td>
                  <td className="px-3 py-3 text-genai-400">{axis}</td>
                  <td className="px-3 py-3">{shape}</td>
                  <td className="px-3 py-3">{good}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Axes at a glance">
        <Flowchart
          title="Pick an axis, then a suite"
          chart={`flowchart TB
  START[What risk worries you?] --> T[Toxicity continuation]
  START --> J[Jailbreak / harmful compliance]
  START --> B[Demographic bias]
  START --> TR[Imitative falsehoods]
  START --> O[Over-refusal]
  START --> P[Policy taxonomy risks]
  T --> RTP[RealToxicityPrompts]
  J --> HB[HarmBench / JailbreakBench / AdvBench / Do-Not-Answer]
  B --> BBQ[BBQ]
  TR --> TQA[TruthfulQA]
  O --> XS[XSTest]
  P --> AIR[AIR-Bench]
  START --> K[Safety knowledge MCQ]
  K --> SB[SafetyBench]`}
        />
        <ContentStep number={1} title="Completion column">
          <p className="text-slate-300">
            <span className="text-genai-400">RealToxicityPrompts</span> is the main completion-native suite in
            the top 10. Chat suites can still emit toxic text, but they score refusal differently.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Chat column">
          <p className="text-slate-300">
            AIR-Bench, HarmBench, AdvBench, JailbreakBench, Do-Not-Answer, XSTest, and usually TruthfulQA/BBQ
            evaluations are chat or QA-instruction shaped.
          </p>
        </ContentStep>
        <ContentStep number={3} title="MCQ column">
          <p className="text-slate-300">
            <span className="text-genai-400">SafetyBench</span> is primarily multi-category MCQ safety
            knowledge — complementary to open-ended ASR.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Starter suite recommendation">
        <p className="text-slate-300">
          Beginners shipping a <strong className="text-white">chat assistant</strong> can start with four
          pillars, then expand:
        </p>
        <div className="mt-4 space-y-3">
          {[
            ['1. Do-Not-Answer', 'Smoke test: refuses questions that should not get harmful answers.'],
            ['2. HarmBench or JailbreakBench', 'Robustness: ASR under standardized attacks.'],
            ['3. XSTest', 'Balance: catch over-refusal after you tighten safety.'],
            ['4. RealToxicityPrompts (if completion-heavy)', 'Open-ended toxicity for generation APIs.'],
          ].map(([label, text]) => (
            <div key={label} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="mt-1 text-sm text-slate-400">{text}</p>
            </div>
          ))}
        </div>
        <Callout variant="tip" title="Add when relevant">
          Add BBQ for people/social QA, TruthfulQA for myth-prone domains, AIR-Bench for governance-aligned
          reporting, SafetyBench for broad MCQ coverage, AdvBench when reproducing jailbreak papers.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Top 10 cover toxicity, jailbreak, bias, truthfulness, over-refusal, policy risks, and safety MCQ.',
          'Most are chat-shaped; RealToxicityPrompts is the key completion suite.',
          'Starter chat suite: Do-Not-Answer + HarmBench/JailbreakBench + XSTest (+ RTP if needed).',
          'Never treat one benchmark as a full safety certificate.',
        ]}
      />
    </LessonArticle>
  )
}
