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

export function LimitationsOfHelpfulnessBenchmarks() {
  return (
    <LessonArticle>
      <Definition term="Limitations of helpfulness benchmarks">
        <p>
          Public helpfulness scores are <strong className="text-white">useful signals</strong>, not certificates
          of truth. They can be contaminated, overfit, gamed, and misread — especially when marketing treats
          MMLU as “how helpful the chatbot is.”
        </p>
        <p className="mt-2 text-slate-300">
          This lesson teaches honest reading: what can go wrong, and how to keep your feet on the ground.
        </p>
      </Definition>

      <Callout variant="beginner" title="Core warning">
        A high leaderboard number means “did well on that harness under those rules” — not “will delight every
        user on every task.”
      </Callout>

      <LessonSection title="Contamination and memorization">
        <ContentStep number={1} title="What contamination means">
          <p className="text-slate-300">
            If benchmark items (or near-paraphrases) appeared in training data, the model may{' '}
            <span className="text-genai-400">recall</span> answers instead of generalizing. Scores inflate.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Why popular suites are risky">
          <p className="text-slate-300">
            MMLU, HumanEval, GSM8K, and friends are everywhere online. Exact leakage is hard to prove, but the
            risk grows with dataset fame and model scale.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Mitigations">
          <p className="text-slate-300">
            Prefer newer / harder variants (MMLU-Pro, GPQA, SWE-bench), private held-out sets, and canary
            checks. Distrust miraculous jumps with no method change.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Overfitting to evals and gaming leaderboards">
        <Flowchart
          title="How gaming happens"
          chart={`flowchart TB
  PUB[Public benchmark] --> TUNE[Train / prompt / scaffold to that set]
  TUNE --> UP[Leaderboard goes up]
  UP --> USER{Users happier?}
  USER -->|Maybe not| FAIL[Capability theater]
  USER -->|Yes on that skill| OK[Real gain on that axis only]`}
        />
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Prompt overfitting</strong> — magic few-shot strings that only work
            on one suite.
          </li>
          <li>
            <strong className="text-white">Scaffold overfitting</strong> — agent loops tuned to SWE-bench quirks.
          </li>
          <li>
            <strong className="text-white">Selective reporting</strong> — quote the one metric you win.
          </li>
        </ul>
        <Callout variant="insight" title="Healthy practice">
          Freeze an eval pack before big training runs. Report multiple axes. Include a private set nobody
          optimized against.
        </Callout>
      </LessonSection>

      <LessonSection title="Chat helpfulness ≠ MMLU">
        <p className="text-slate-300">
          Multiple-choice knowledge accuracy does not measure tone, multi-turn goals, tool use, or whether
          users prefer answer A over B. A model can memorize exams and still be a frustrating assistant — or
          vice versa.
        </p>
        <Example title="Mismatch vignette">{`Model A: 85% MMLU, robotic one-line answers, ignores follow-ups
Model B: 78% MMLU, clear steps, asks clarifying questions

Product chat win-rate: B often wins with humans
Blog headline if careless: "A is smarter (higher MMLU)"`}</Example>
      </LessonSection>

      <LessonSection title="Static benchmarks vs live preference (Arena)">
        <ContentStep number={1} title="Static suites">
          <p className="text-slate-300">
            Fixed questions, automatic grading (accuracy, pass@k, % resolved). Great for regression and
            capability tracking.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Live preference arenas">
          <p className="text-slate-300">
            Humans (or careful judges) pick which blind answer they prefer on open prompts. Captures taste,
            style, and usefulness that MCQs miss.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Use both">
          <p className="text-slate-300">
            Arenas can be noisy and vibe-driven; static suites can be stale and gameable. Together they triangulate.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Honest reading of numbers">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Match harness, shots, temperature, tools, and subset names before comparing.</li>
          <li>Ask what the metric <em>cannot</em> see (security, freshness, UX).</li>
          <li>Prefer confidence intervals / multiple seeds when available.</li>
          <li>Translate scores into product risk: “fails 30% of SWE-bench Verified” ≠ “useless,” but ≠ “done.”</li>
        </ul>
        <Example title="Red-flag phrases to challenge">{`"#1 on MMLU ⇒ best assistant"
"We beat HumanEval so our agent is production-ready"
"Arena win-rate up ⇒ knowledge is fine (skipped GPQA)"
"Tiny 0.3% gap with different harnesses ⇒ decisive win"`}</Example>
        <Callout variant="tip" title="One sentence for stakeholders">
          “These benchmarks show capability on public tasks; we ship when private product evals and safety
          checks clear — leaderboards are supporting evidence.”
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Contamination and memorization can inflate famous benchmark scores.',
          'Teams can overfit prompts, scaffolds, and reporting to win leaderboards.',
          'Chat helpfulness is not the same as MMLU (or any single static suite).',
          'Pair static benchmarks with live preference / Arena-style signals.',
          'Read numbers only with protocol context and an eye on what they omit.',
        ]}
      />
    </LessonArticle>
  )
}
