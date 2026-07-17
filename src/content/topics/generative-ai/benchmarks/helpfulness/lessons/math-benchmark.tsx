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

export function MathBenchmark() {
  return (
    <LessonArticle>
      <Definition term="MATH / MATH-500">
        <p>
          The <strong className="text-white">MATH</strong> benchmark collects competition-style problems
          (algebra, geometry, number theory, counting, …) that are much harder than GSM8K.{' '}
          <span className="text-genai-400">MATH-500</span> is a commonly cited 500-problem subset used for
          faster, standardized comparisons.
        </p>
        <p className="mt-2 text-slate-300">
          Scoring still cares about the final answer (often after formal or carefully extracted formats), but
          the reasoning required is closer to contest math than grade-school stories.
        </p>
      </Definition>

      <Callout variant="beginner" title="What MATH measures">
        Competition-level mathematical problem solving — symbolic manipulation and multi-step strategies beyond
        plain arithmetic word problems.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Harder than GSM8K">
          <p className="text-slate-300">
            Expect algebra tricks, geometry configurations, modular arithmetic, and combinatorics. A single
            wrong intermediate step usually sinks the answer.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Subject categories">
          <p className="text-slate-300">
            Results are often broken down by topic. A model might ace algebra yet struggle on geometry —
            averages hide that.
          </p>
        </ContentStep>
        <ContentStep number={3} title="MATH-500 as a practical slice">
          <p className="text-slate-300">
            Full MATH can be expensive to run. MATH-500 gives a shared, smaller yardstick many papers quote.
            Still verify which split and prompt style were used.
          </p>
        </ContentStep>
        <Flowchart
          title="Difficulty ladder"
          chart={`flowchart TB
  GSM[GSM8K: grade-school word problems]
  MATH[MATH / MATH-500: contest problems]
  GPQA[GPQA: graduate STEM MCQ]
  GSM --> MATH
  MATH --> NOTE[Different skill: math contests ≠ GPQA biology]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">High</strong> — strong contest-math reasoning for that difficulty
            band; suggests robust multi-step symbolic skill (under the eval setup).
          </li>
          <li>
            <strong className="text-white">Low</strong> — common for smaller models; even strong chat models
            may land mid-range without tools or specialized training.
          </li>
          <li>
            Large gains from tool use (Python CAS) vs pure CoT are expected — declare the setting.
          </li>
        </ul>
        <Callout variant="insight" title="What a high score suggests">
          Not that the model is a professional mathematician — that it can solve many short contest items
          reliably. Research proofs and open problems remain out of scope.
        </Callout>
      </LessonSection>

      <LessonSection title="Sample question style (paraphrased)">
        <Example title="Contest-flavored item (illustrative)">{`If x + 1/x = 3 and x ≠ 0, what is x² + 1/x²?

Sketch:
  Square both sides: x² + 2 + 1/x² = 9
  So x² + 1/x² = 7

Final answer: 7

(Real MATH items span many topics and difficulties; this only shows the vibe.)`}</Example>
      </LessonSection>

      <LessonSection title="GSM8K vs MATH — when to use which">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Use case</th>
                <th className="px-4 py-3">Prefer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Tutoring apps for elementary word problems', 'GSM8K'],
                ['Differentiating strong models on math', 'MATH / MATH-500'],
                ['Quick regression smoke test', 'GSM8K (cheaper)'],
                ['Claiming “advanced math reasoning”', 'MATH (+ tools disclosure)'],
              ].map(([use, prefer]) => (
                <tr key={use} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-white">{use}</td>
                  <td className="px-4 py-3 font-semibold text-genai-400">{prefer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="What MATH does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Proof writing quality judged by mathematicians (unless you add a separate rubric).</li>
          <li>Applied data science / statistics on messy real datasets.</li>
          <li>Coding ability (except when the agent uses code as a tool — then credit the system).</li>
          <li>Everyday helpfulness or safety.</li>
        </ul>
        <Callout variant="beginner" title="Low score ≠ useless product">
          Many excellent chat models are middling on contest MATH. Judge them on the axes your users need —
          and keep MATH when you specifically claim advanced math reasoning.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'MATH / MATH-500 measure competition-style math problem solving — harder than GSM8K.',
          'High scores suggest strong multi-step symbolic reasoning under a fixed protocol.',
          'MATH-500 is a popular smaller subset for comparable reporting.',
          'Disclose CoT vs tool-augmented setups; they change scores a lot.',
          'Not a measure of research math, applied DS, or chat helpfulness.',
        ]}
      />
    </LessonArticle>
  )
}
