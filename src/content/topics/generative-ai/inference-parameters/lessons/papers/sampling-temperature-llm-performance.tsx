import {
  Callout,
  ContentStep,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2402.05201'

export function SamplingTemperatureLlmPerformance() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="The Effect of Sampling Temperature on Problem Solving in LLMs"
        authors="Renze & Guven (Arista Networks)"
        year="2024"
        url={PAPER_URL}
      >
        First large-scale empirical study of how <strong className="text-white">temperature affects real LLM
        task performance</strong> — not just text style, but whether the answer is actually correct.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        The <em>Choosing Settings</em> lesson gave practical presets (low T for code, higher T for brainstorming).
        This paper tests those recommendations scientifically across multiple models and problem types.
      </Callout>

      <LessonSection title="Background — temperature advice was anecdotal">
        <p>
          Every LLM tutorial says "use low temperature for factual tasks, high for creative ones." But before
          2024, almost no one had systematically measured <em>how much</em> temperature matters for{' '}
          <strong className="text-white">correctness</strong> on reasoning, math, and coding benchmarks.
        </p>
        <p className="mt-3">
          Renze & Guven ran thousands of evaluations across temperature values from 0.0 to 2.0 on multiple
          open-source and commercial-grade models.
        </p>
      </LessonSection>

      <LessonSection title="What the paper measured">
        <ContentStep number={1} title="Tasks tested">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li><strong className="text-white">Math word problems</strong> — GSM8K-style arithmetic reasoning.</li>
            <li><strong className="text-white">Logic puzzles</strong> — multi-step deduction.</li>
            <li><strong className="text-white">Code generation</strong> — function implementation from specs.</li>
            <li><strong className="text-white">Creative writing</strong> — open-ended story prompts (quality judged differently).</li>
          </ul>
        </ContentStep>

        <ContentStep number={2} title="Temperature range">
          <p>
            Tested T from <strong className="text-white">0.0</strong> (greedy) through{' '}
            <strong className="text-white">2.0</strong> in increments, holding all other parameters (top-p, max
            tokens) fixed. This isolates temperature's effect.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What the paper found">
        <ContentStep number={1} title="Low T wins for problem-solving">
          <p>
            For math, logic, and coding, <strong className="text-white">T = 0.0 to 0.2</strong> consistently
            produced the highest accuracy. Higher temperature introduced errors — the model explored wrong reasoning
            paths and committed to them.
          </p>
          <Example
            title="Illustrative accuracy pattern"
            output={`Math reasoning (GSM8K-style):
  T=0.0 → 78% correct
  T=0.5 → 71% correct
  T=1.0 → 63% correct
  T=1.5 → 52% correct`}
          >{`# Pattern holds across models — exact numbers vary by model size
temps = [0.0, 0.5, 1.0, 1.5]
accuracy = [0.78, 0.71, 0.63, 0.52]
for t, a in zip(temps, accuracy):
    print(f"T={t} → {a:.0%} correct")`}</Example>
        </ContentStep>

        <ContentStep number={2} title="T = 0 is not always identical to T = 0.0 greedy">
          <p>
            Some APIs treat T = 0 as greedy decoding; others use a very small epsilon. The paper confirmed both
            behave similarly for accuracy-focused tasks — pick whichever your API documents.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Higher T helps creative diversity, not correctness">
          <p>
            For open-ended creative prompts, higher temperature (0.8–1.2) produced more varied and interesting
            outputs without a "correctness" metric to degrade. The trade-off is real: you gain diversity, you lose
            reliability on factual tasks.
          </p>
        </ContentStep>

        <ContentStep number={4} title="The effect is model-dependent but directionally consistent">
          <p>
            Larger models were somewhat less sensitive to temperature (flatter accuracy curves), but the trend —
            lower T for reasoning, higher T for creativity — held across all models tested.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Practical recommendations from the paper">
        <Callout variant="insight">
          <strong className="text-white">Reasoning / math / code → T = 0.0–0.2.</strong>{' '}
          Creative writing / brainstorming → T = 0.8–1.2.{' '}
          Mixed tasks → T = 0.5 as a compromise, but expect lower accuracy on the reasoning parts.
        </Callout>
      </LessonSection>

      <LessonSection title="Limitations">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Tested specific benchmarks — your particular prompt and model may behave differently.</li>
          <li>Did not combine temperature sweeps with top-p or top-k variations (held them fixed).</li>
          <li>Models evolve quickly — results from 2024 models may not transfer exactly to 2026 models.</li>
          <li>Creative quality was assessed qualitatively, not with a rigorous human-study protocol.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Connection to Inference Parameters lessons">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Lesson</th>
                <th className="px-4 py-3">How this paper connects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Choosing Settings', 'Validates the preset table — low T for code/reasoning, higher T for creative tasks'],
                ['Temperature', 'Quantifies the accuracy cost of raising T above 0.2 on problem-solving tasks'],
                ['Other Parameters', 'Suggests holding top-p and penalties fixed when tuning temperature'],
                ['Introduction to Inference Parameters', 'Shows that inference knobs have measurable downstream impact, not just stylistic effect'],
              ].map(([lesson, connection]) => (
                <tr key={lesson} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{lesson}</td>
                  <td className="px-4 py-3 text-slate-400">{connection}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'First systematic study of temperature vs task accuracy across math, logic, code, and creative writing.',
          'Low temperature (0.0–0.2) maximises correctness on reasoning and problem-solving tasks.',
          'Higher temperature (0.8–1.2) improves output diversity for creative tasks at the cost of reliability.',
          'Confirms the practical presets from Choosing Settings with empirical evidence across multiple models.',
        ]}
      />
    </LessonArticle>
  )
}
