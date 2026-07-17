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

export function BigBenchHard() {
  return (
    <LessonArticle>
      <Definition term="BIG-bench Hard (BBH)">
        <p>
          <strong className="text-white">BIG-bench Hard (BBH)</strong> is a curated subset of especially
          challenging tasks from the broader <span className="text-genai-400">BIG-bench</span> suite. Instead of
          one skill, BBH packs many different reasoning puzzles into one average score.
        </p>
        <p className="mt-2 text-slate-300">
          It is a stress test for flexible reasoning — logic, linguistics tricks, algorithms-in-language, and
          more — not a pure knowledge exam like MMLU.
        </p>
      </Definition>

      <Callout variant="beginner" title="What BBH measures">
        Performance on a basket of hard, diverse reasoning tasks where earlier models failed — a multipurpose
        “can it think carefully?” suite.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Diverse reasoning types">
          <p className="text-slate-300">
            Individual tasks may involve boolean logic, temporal reasoning, parody of formal languages, tracking
            objects, or other oddball challenges. The suite average summarizes breadth of hard reasoning.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Why “Hard” was carved out">
          <p className="text-slate-300">
            Full BIG-bench is huge. BBH keeps tasks where models historically struggled, so the average remains
            informative longer.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Often reported with CoT">
          <p className="text-slate-300">
            Many BBH tasks benefit from step-by-step prompting. Compare CoT vs direct-answer settings carefully.
          </p>
        </ContentStep>
        <Flowchart
          title="BBH vs MMLU"
          chart={`flowchart TB
  MMLU[MMLU: knowledge MCQ across subjects]
  BBH[BBH: hard reasoning task mix]
  MMLU --> K[What does the model know?]
  BBH --> R[Can it follow tricky procedures / logic?]
  K --> BOTH[Both useful; not interchangeable]
  R --> BOTH`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">High average</strong> — generalizes across several hard reasoning
            formats, not just memorized facts.
          </li>
          <li>
            <strong className="text-white">Low average</strong> — brittle on at least several task types; inspect
            per-task scores before blaming “the model is dumb.”
          </li>
          <li>
            A model can win MMLU and lose BBH (or vice versa) — knowledge ≠ procedural puzzle skill.
          </li>
        </ul>
        <Callout variant="insight" title="Always peek under the average">
          One catastrophic task can drag the mean. Product decisions should look at the tasks closest to your
          use case.
        </Callout>
      </LessonSection>

      <LessonSection title="Sample task style (paraphrased)">
        <Example title="Logic-tracking flavor (illustrative)">{`Task vibe: follow a sequence of state updates.

The light starts OFF.
1) Toggle
2) If ON, leave it; if OFF, toggle
3) Toggle

Is the light ON or OFF at the end?

(Real BBH tasks vary widely — some are linguistic, some algorithmic.
This only shows the “careful multi-step tracking” idea.)`}</Example>
        <p className="mt-4 text-slate-300">
          Other BBH-style challenges might ask for hyperbaton judgments, causal judgment vignettes, or formal
          grammar manipulations — always with a clear gold label for automatic scoring.
        </p>
      </LessonSection>

      <LessonSection title="What BBH evaluates vs MMLU">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">MMLU</th>
                <th className="px-4 py-3">BBH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Primary focus', 'Subject knowledge MCQ', 'Hard reasoning tasks'],
                ['Format', 'Mostly 4-way MCQ exams', 'Mixed task formats'],
                ['Failure mode', 'Missing facts / subjects', 'Losing track / shallow heuristics'],
                ['Product read', 'Domain coverage', 'Careful general reasoning'],
              ].map(([q, mmlu, bbh]) => (
                <tr key={q} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-genai-400">{q}</td>
                  <td className="px-4 py-3">{mmlu}</td>
                  <td className="px-4 py-3 text-white">{bbh}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="What BBH does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Chat tone, multi-turn helpfulness, or user preference (Arena-style).</li>
          <li>Repo-level coding (SWE-bench) or short-function synth alone (HumanEval).</li>
          <li>Safety / jailbreak resistance.</li>
          <li>Every reasoning skill — only the tasks included in the Hard subset.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'BBH is a hard, diverse subset of BIG-bench reasoning tasks averaged into one score.',
          'High scores suggest flexible hard reasoning; dig into per-task results for products.',
          'It evaluates tricky procedures/logic more than MMLU-style textbook knowledge.',
          'CoT settings matter — keep them fixed when comparing models.',
          'BBH is not chat preference, coding agents, or safety.',
        ]}
      />
    </LessonArticle>
  )
}
