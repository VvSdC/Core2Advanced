import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function HelpfulnessBenchmarksMap() {
  return (
    <LessonArticle>
      <Definition term="Helpfulness benchmarks map">
        <p>
          “Helpfulness” in LLM evals is not one number. It is a <strong className="text-white">map of axes</strong>{' '}
          — knowledge, code, math, and reasoning — each with standard benchmarks you met in this track.
        </p>
        <p className="mt-2 text-slate-300">
          This lesson is your cheat sheet: which suite answers which question, and what to remember if you
          forget everything else.
        </p>
      </Definition>

      <Callout variant="beginner" title="If you only remember one suite…">
        Pick the suite that matches the <span className="text-genai-400">job your product does</span>. A coding
        copilot lives or dies on HumanEval → SWE-bench. A homework tutor cares about GSM8K / MATH. A general
        assistant needs MMLU <em>plus</em> preference/chat evals — never MMLU alone.
      </Callout>

      <LessonSection title="Master table — what each evaluates">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Axis</th>
                <th className="px-4 py-3">Benchmark</th>
                <th className="px-4 py-3">Measures</th>
                <th className="px-4 py-3">High score means</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Knowledge', 'MMLU / MMLU-Pro', 'Multitask MCQ knowledge', 'Strong exam-style coverage'],
                ['Knowledge', 'GPQA', 'Hard graduate STEM MCQ', 'Expert-ceiling STEM ability'],
                ['Commonsense', 'HellaSwag / ARC / Winogrande', 'Everyday / school science intuition', 'Solid “obvious world” reasoning'],
                ['Code', 'HumanEval', 'Python function synth (pass@k)', 'Correct short functions often'],
                ['Code', 'MBPP', 'Basic Python problems', 'Reliable beginner coding tasks'],
                ['Code', 'SWE-bench', 'Real GitHub issue patches', 'Can resolve real repo bugs (w/ agent)'],
                ['Math', 'GSM8K', 'Grade-school word problems', 'Multi-step arithmetic in language'],
                ['Math', 'MATH / MATH-500', 'Contest math problems', 'Harder symbolic problem solving'],
                ['Reasoning', 'BBH', 'Diverse hard BIG-bench tasks', 'Flexible tricky reasoning'],
              ].map(([axis, bench, measures, high]) => (
                <tr key={`${axis}-${bench}`} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-genai-400">{axis}</td>
                  <td className="px-4 py-3 text-white">{bench}</td>
                  <td className="px-4 py-3">{measures}</td>
                  <td className="px-4 py-3">{high}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Flowchart — pick an axis first">
        <Flowchart
          title="Which helpfulness benchmarks?"
          chart={`flowchart TB
  START[What must the model do well?] --> K{Knowledge / exams?}
  K -->|Yes| MMLU[MMLU ± MMLU-Pro]
  MMLU --> HARD{Need expert STEM ceiling?}
  HARD -->|Yes| GPQA[Add GPQA]
  HARD -->|No| NEXT1[Also check commonsense if relevant]
  START --> C{Write / fix code?}
  C -->|Short functions| HE[HumanEval + MBPP]
  C -->|Real issues| SWE[SWE-bench]
  START --> M{Solve math?}
  M -->|Word problems| GSM[GSM8K]
  M -->|Contest-hard| MATH[MATH / MATH-500]
  START --> R{Tricky general reasoning?}
  R -->|Yes| BBH[BIG-bench Hard]
  START --> CHAT{Chat preference / tone?}
  CHAT -->|Yes| ARENA[Human prefs / Arena — not these static suites]`}
        />
      </LessonSection>

      <LessonSection title="Conceptual links across lessons">
        <ContentStep number={1} title="Knowledge ladder">
          <p className="text-slate-300">
            Commonsense (HellaSwag/ARC) → broad exams (MMLU) → hard STEM (GPQA). Climb only as far as your
            product needs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Code ladder">
          <p className="text-slate-300">
            MBPP basics → HumanEval interview synth → SWE-bench real issues. Skipping to SWE-bench without the
            first two is fine for agents, but the cheap suites still catch regressions fast.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Math ladder">
          <p className="text-slate-300">
            GSM8K → MATH/MATH-500. Use CoT (and tools) consistently when you report either.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Reasoning cross-check">
          <p className="text-slate-300">
            BBH catches “clever procedure” skills that MMLU can miss. Pair them when you claim general
            intelligence-ish progress.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Quick “what does a score mean?” reminders">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Accuracy / % correct</strong> (MMLU, GPQA, ARC, GSM8K, MATH, BBH) —
            share of items with the right final answer under the harness.
          </li>
          <li>
            <strong className="text-white">pass@k</strong> (HumanEval-style) — chance at least one of k code
            samples passes tests.
          </li>
          <li>
            <strong className="text-white">% resolved</strong> (SWE-bench) — share of issues fixed so tests pass.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="What this map does NOT replace">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Your private, product-specific eval set (always higher priority for shipping).</li>
          <li>Safety / harmlessness suites (separate track).</li>
          <li>RAG faithfulness metrics (covered in the RAG track).</li>
          <li>Live user preference (Chatbot Arena–style) for open-ended chat quality.</li>
        </ul>
        <Callout variant="tip" title="One-line memory aid">
          Static helpfulness benchmarks = capability smoke tests. Preference arenas = taste tests. Products need
          both kinds plus private tasks.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Helpfulness spans knowledge, code, math, and reasoning — each with named benchmarks.',
          'If you remember one suite: choose the one that matches your product job.',
          'Ladders: MMLU→GPQA; MBPP→HumanEval→SWE-bench; GSM8K→MATH; add BBH for hard mixed reasoning.',
          'Chat tone and user preference are not settled by MMLU accuracy alone.',
          'Always keep a private product eval beside public leaderboards.',
        ]}
      />
    </LessonArticle>
  )
}
