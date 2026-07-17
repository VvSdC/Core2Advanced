import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function WhatIsLlmBenchmarking() {
  return (
    <LessonArticle>
      <Definition term="LLM benchmarking">
        <p>
          <strong className="text-white">LLM benchmarking</strong> means running a{' '}
          <strong className="text-white">large language model</strong> (LLM) through a fixed set of standardized
          tests — the same questions, the same scoring rules — so you can measure capability in a way that is
          comparable across models. A <strong className="text-white">benchmark</strong> is one of those tests:
          a dataset of problems plus a method for turning answers into a score.
        </p>
      </Definition>

      <LessonSection title="School exams and driver's licenses">
        <p className="text-slate-300">
          Think of benchmarks the way you think about exams. A chemistry final does not prove you are a good
          friend — it proves you know chemistry under a shared rubric. A driver&apos;s license test does not prove
          you are a race-car driver — it proves you meet a minimum bar for safe driving. LLM benchmarks work the
          same way: they ask, &quot;Under this shared test, how capable is this model?&quot;
        </p>
        <div className="mt-4 space-y-3">
          {[
            [
              'School exam',
              'Same questions for every student; a percentage score; useful for ranking and spotting weak subjects.',
            ],
            [
              "Driver's license test",
              'Pass / fail against a checklist; proves minimum competence, not mastery of every road.',
            ],
            [
              'LLM benchmark',
              'Same prompts and scoring for every model; a number (accuracy, pass rate) you can compare fairly.',
            ],
          ].map(([label, text]) => (
            <div key={label} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="mt-1 text-sm text-slate-400">{text}</p>
            </div>
          ))}
        </div>
        <Callout variant="beginner" title="One sentence version">
          Benchmarks are shared exams for models — not a full personality report, but a fair way to compare
          capability on a defined skill.
        </Callout>
      </LessonSection>

      <LessonSection title="Why leaderboards exist">
        <p className="text-slate-300">
          A <strong className="text-white">leaderboard</strong> is a public ranking of models on one or more
          benchmarks. Labs, open-source projects, and product teams publish scores so buyers and researchers can
          compare options without re-running every test themselves.
        </p>
        <ContentStep number={1} title="Shared yardstick">
          <p className="text-slate-300">
            Without a shared test, &quot;our model is smarter&quot; is marketing. With{' '}
            <span className="text-genai-400">MMLU</span> (Massive Multitask Language Understanding),{' '}
            <span className="text-genai-400">HumanEval</span>, or similar suites, everyone can point at the same
            numbers.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Progress tracking">
          <p className="text-slate-300">
            Scores over time show whether new releases actually improve knowledge, code, or math — not just
            marketing copy.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Honest limits">
          <p className="text-slate-300">
            Leaderboards do <em>not</em> replace your own product tests. A high exam score does not guarantee the
            model fits your chatbot tone, latency budget, or safety policy.
          </p>
        </ContentStep>
        <Flowchart
          title="From model claim to comparable score"
          chart={`flowchart TB
  A[Many LLM vendors<br/>each claim "best"] --> B[Shared benchmark<br/>same questions + scoring]
  B --> C[Leaderboard<br/>ranked scores]
  C --> D[You pick candidates<br/>then test on your data]`}
        />
      </LessonSection>

      <LessonSection title="Learning path for this Helpfulness track">
        <p className="text-slate-300">
          Under <strong className="text-white">Benchmarks → Helpfulness</strong>, we cover capability suites —
          knowledge, code, and math. Safety lives next door in{' '}
          <strong className="text-white">Secure Text Generation</strong> (AIR-Bench, HarmBench, and more).
        </p>
        <Flowchart
          title="Helpfulness track map"
          chart={`flowchart TB
  A[1. Foundations<br/>what / how / axes] --> B[2. Helpfulness knowledge<br/>MMLU and friends]
  B --> C[3. Code benchmarks<br/>HumanEval / MBPP]
  C --> D[4. Math benchmarks<br/>GSM8K / MATH]
  D --> E[5. Practice<br/>run and read scores]`}
        />
        <ContentStep number={1} title="Foundations (you are here)">
          <p className="text-slate-300">
            What benchmarking is, how scores are produced, which capability axes exist, how to read leaderboards,
            and how to pick a small helpfulness suite.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Helpfulness knowledge → code → math">
          <p className="text-slate-300">
            Deep dives on <span className="text-genai-400">MMLU</span>-style knowledge tests, coding suites like{' '}
            <span className="text-genai-400">HumanEval</span>, and math sets like{' '}
            <span className="text-genai-400">GSM8K</span> (Grade School Math 8K).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Practice">
          <p className="text-slate-300">
            Run evaluations with a harness, interpret results, and avoid common traps like mismatched setups.
          </p>
        </ContentStep>
        <Callout variant="beginner" title="Prerequisites">
          Comfort with Generative AI fundamentals helps: what an LLM is, what a prompt is, and that models
          predict tokens. You do not need to train a model or know calculus. If you can chat with ChatGPT or a
          local model, you are ready for this track.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'LLM benchmarking = standardized tests (dataset + scoring) to measure model capability fairly.',
          'Analogy: school exams and driver’s license tests — shared rubric, limited but useful signal.',
          'Leaderboards exist so people can compare models on the same yardstick — not as a full product review.',
          'This track path: Foundations → Helpfulness knowledge → Code → Math → Practice.',
        ]}
      />
    </LessonArticle>
  )
}
