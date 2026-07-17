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

export function Humaneval() {
  return (
    <LessonArticle>
      <Definition term="HumanEval (OpenAI)">
        <p>
          <strong className="text-white">HumanEval</strong> asks a model to write a <span className="text-genai-400">Python
          function</span> from a docstring (and signature), then checks whether the function passes hidden unit
          tests. The famous metric is <strong className="text-white">pass@k</strong>.
        </p>
        <p className="mt-2 text-slate-300">
          It measures <em>functional correctness</em> of short, interview-style coding problems — not “can it
          maintain a monorepo.”
        </p>
      </Definition>

      <Callout variant="beginner" title="What HumanEval measures">
        Can the model synthesize a small correct Python function from a natural-language spec?
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Docstring → code">
          <p className="text-slate-300">
            The prompt includes a function name, parameters, and a description of intended behavior (often with
            examples). The model completes the function body.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Unit tests decide right/wrong">
          <p className="text-slate-300">
            Generated code is executed against tests. If all pass, that sample is a success. Style and comments
            do not matter — only behavior.
          </p>
        </ContentStep>
        <ContentStep number={3} title="pass@k in plain English">
          <p className="text-slate-300">
            Generate <strong className="text-white">k</strong> independent samples. pass@k ≈ probability that{' '}
            <em>at least one</em> of them passes all tests. <span className="text-genai-400">pass@1</span> is the
            strictest common headline: first try (or unbiased estimate of one-sample success).
          </p>
        </ContentStep>
        <Flowchart
          title="HumanEval loop"
          chart={`flowchart LR
  DOC[Docstring + signature] --> GEN[Model writes function]
  GEN --> TEST[Run hidden unit tests]
  TEST -->|pass| OK[Count success]
  TEST -->|fail| BAD[Count failure]
  OK --> PASS[pass@k summary]
  BAD --> PASS`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">High pass@1</strong> — often writes correct short functions on the
            first sample under the eval temperature/settings.
          </li>
          <li>
            <strong className="text-white">High pass@10 / pass@100</strong> with low pass@1 — the model can
            eventually hit a correct solution if you sample many times (useful for “best of n” workflows).
          </li>
          <li>
            <strong className="text-white">Low</strong> — struggles with specification following, edge cases, or
            basic Python idioms on this set.
          </li>
        </ul>
        <Callout variant="insight" title="Temperature and sampling matter">
          pass@k depends on how you sample. Always report temperature, top-p, and k when comparing models.
        </Callout>
      </LessonSection>

      <LessonSection title="Sample problem style (paraphrased)">
        <Example title="HumanEval-style prompt">{`def longest_unique_window(s: str) -> int:
    """Return the length of the longest substring of s
    that contains all unique characters.

    Examples:
      longest_unique_window("abcab") -> 3  # "bca" or "cab"
      longest_unique_window("") -> 0
    """`}</Example>
        <CodeBlock title="What a passing solution might look like">{`def longest_unique_window(s: str) -> int:
    seen = {}
    left = 0
    best = 0
    for right, ch in enumerate(s):
        if ch in seen and seen[ch] >= left:
            left = seen[ch] + 1
        seen[ch] = right
        best = max(best, right - left + 1)
    return best
# Hidden tests check more strings, Unicode edge cases, etc.`}</CodeBlock>
      </LessonSection>

      <LessonSection title="When to quote HumanEval">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Comparing base / instruct models on short function synthesis.</li>
          <li>Catching regressions after fine-tunes that might hurt coding.</li>
          <li>Not as the only evidence that an agent can maintain production repos.</li>
        </ul>
      </LessonSection>

      <LessonSection title="What HumanEval does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Large repos</strong> — multi-file refactors, build systems, flaky CI.
          </li>
          <li>
            <strong className="text-white">Security & robustness</strong> — injection, unsafe APIs, DoS loops.
          </li>
          <li>
            <strong className="text-white">Languages beyond the harness</strong> — classic HumanEval is Python.
          </li>
          <li>
            <strong className="text-white">Code review taste</strong> — readability, design, documentation.
          </li>
        </ul>
        <Callout variant="tip" title="Next step for realism">
          For GitHub-issue realism, look at SWE-bench (later lesson). HumanEval remains a fast coding-smoke test.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'HumanEval: synthesize Python functions from docstrings; score via unit tests.',
          'pass@k = chance at least one of k samples is fully correct; pass@1 is the strict default.',
          'High scores mean strong short-function coding under that sampling setup.',
          'It does not measure repo-scale engineering, security, or multi-language production work.',
          'Always publish temperature and k when you quote HumanEval numbers.',
        ]}
      />
    </LessonArticle>
  )
}
