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

export function Mbpp() {
  return (
    <LessonArticle>
      <Definition term="MBPP (Mostly Basic Python Problems)">
        <p>
          <strong className="text-white">MBPP</strong> is a coding benchmark of relatively{' '}
          <span className="text-genai-400">basic Python tasks</span> — crowd-sourced problem statements with
          short solutions checked by tests. It asks: can the model write simple, correct Python for everyday
          programming drills?
        </p>
        <p className="mt-2 text-slate-300">
          Compared with HumanEval’s interview-style docstring completions, MBPP feels more like “beginner
          homework / kata” prompts written in plain English.
        </p>
      </Definition>

      <Callout variant="beginner" title="What MBPP measures">
        Correctness on mostly basic Python programming problems under a test-based harness.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Natural-language problem → code">
          <p className="text-slate-300">
            Prompts describe a small task (often with examples). The model writes a function or snippet that
            should satisfy the description.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Tests grade the answer">
          <p className="text-slate-300">
            Like HumanEval, execution against asserts/tests decides success. Partial credit for “almost right”
            is typically not how the headline score works.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Difficulty band">
          <p className="text-slate-300">
            Problems are intentionally <strong className="text-white">mostly basic</strong> — loops, strings,
            lists, simple algorithms — not large system design.
          </p>
        </ContentStep>
        <Flowchart
          title="MBPP evaluation"
          chart={`flowchart LR
  NL[Plain-English problem] --> CODE[Model writes Python]
  CODE --> TESTS[Run provided tests]
  TESTS --> ACC[Accuracy / pass rate]`}
        />
      </LessonSection>

      <LessonSection title="How MBPP differs from HumanEval">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">MBPP</th>
                <th className="px-4 py-3">HumanEval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Origin vibe', 'Crowd-sourced basics', 'Hand-written interview style'],
                ['Prompt shape', 'Often full NL task text', 'Docstring + signature completion'],
                ['Difficulty', 'Mostly beginner–intermediate', 'Short but trickier algorithms'],
                ['Typical use', 'Basic coding ability check', 'Standard code-synthesis headline'],
              ].map(([dim, mbpp, he]) => (
                <tr key={dim} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-genai-400">{dim}</td>
                  <td className="px-4 py-3">{mbpp}</td>
                  <td className="px-4 py-3 text-white">{he}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="When MBPP vs HumanEval">
          Use <strong className="text-white">both</strong> if you can. Prefer MBPP when you care about simple
          instructional coding; prefer HumanEval when comparing to common research leaderboards; use neither alone
          for production coding agents.
        </Callout>
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">High</strong> — reliable on basic Python tasks under your prompt
            template and decoding settings.
          </li>
          <li>
            <strong className="text-white">Low</strong> — may mishandle specs, off-by-ones, or simple data
            structures — a red flag for coding tutors and autocomplete on easy tasks.
          </li>
          <li>
            A model can score well on MBPP and still fail HumanEval’s harder algorithmic items (or the reverse
            less often).
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Sample problem style (paraphrased)">
        <Example title="MBPP-style task">{`Write a function that takes a list of integers and returns
a new list containing only the even numbers, preserving order.

Example:
  keep_evens([1, 2, 3, 4, 5]) -> [2, 4]

(Your solution will be checked with several assert-style tests.)`}</Example>
        <p className="mt-4 text-slate-300">
          Variants may ask for string cleanup, dictionary counts, or simple math helpers — always short and
          self-contained.
        </p>
      </LessonSection>

      <LessonSection title="What MBPP does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Multi-file projects, debugging existing codebases, or PR quality (see SWE-bench).</li>
          <li>Security, performance at scale, or concurrency.</li>
          <li>Non-Python languages (unless you use a ported suite).</li>
          <li>Teaching quality: correct code ≠ good explanations for learners.</li>
        </ul>
        <Callout variant="insight" title="Sanitize your comparisons">
          Different papers use slightly different MBPP splits and few-shot wrappers. Match the harness before
          declaring a winner.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'MBPP measures correctness on mostly basic Python problems with test-based scoring.',
          'It is crowd-sourced / beginner-kata flavored; HumanEval is more interview-docstring style.',
          'High score ≈ solid basic coding; low ≈ weak on simple specs or Python basics.',
          'Pick MBPP for fundamentals, HumanEval for standard synthesis comparisons, both for coverage.',
          'Neither replaces repo-level or security evaluation.',
        ]}
      />
    </LessonArticle>
  )
}
