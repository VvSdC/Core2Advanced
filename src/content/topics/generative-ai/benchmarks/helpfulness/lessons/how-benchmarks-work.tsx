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

export function HowBenchmarksWork() {
  return (
    <LessonArticle>
      <Definition term="How a benchmark works">
        <p>
          Every benchmark has two parts: a <strong className="text-white">dataset of questions</strong> (or
          tasks) and a <strong className="text-white">scoring method</strong> that turns model answers into a
          number. Run the model on every item, apply the scorer, and you get a score you can compare across
          models — if you keep the setup identical.
        </p>
      </Definition>

      <LessonSection title="Dataset + scoring method">
        <p className="text-slate-300">
          The dataset is the exam paper. The scoring method is the answer key and grading rubric. Common rubrics:
        </p>
        <div className="mt-4 space-y-3">
          {[
            [
              'Exact match',
              'The answer string must match the gold answer (often after normalizing spaces/case). Used a lot in math and short-form facts.',
            ],
            [
              'Multiple choice',
              'Pick A/B/C/D. Score is accuracy: fraction of correct choices. Classic for knowledge tests like MMLU (Massive Multitask Language Understanding).',
            ],
            [
              'pass@k',
              'Generate k code samples; the task “passes” if any one of them works on the unit tests. Common for coding benchmarks.',
            ],
            [
              'Judge (LLM-as-judge)',
              'Another model (or a human) grades open-ended answers on a rubric. Flexible, but noisier than exact match.',
            ],
          ].map(([label, text]) => (
            <div key={label} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="mt-1 text-sm text-slate-400">{text}</p>
            </div>
          ))}
        </div>
        <Callout variant="beginner" title="Analogy: grading styles">
          Exact match is like fill-in-the-blank with one correct spelling. Multiple choice is a bubble sheet.{' '}
          <code className="font-mono text-sm text-genai-400">pass@k</code> is like allowing k attempts until one
          program runs. A judge is like a teacher reading essays.
        </Callout>
      </LessonSection>

      <LessonSection title="Zero-shot vs few-shot in eval">
        <p className="text-slate-300">
          <strong className="text-white">Zero-shot</strong> prompting means the model sees the question with no
          worked examples in the prompt. <strong className="text-white">Few-shot</strong> means the prompt
          includes a handful of example question–answer pairs before the real question. The same benchmark can
          report different scores under zero-shot vs 5-shot — so always read the setup.
        </p>
        <Example title="Zero-shot vs few-shot sketch" caption="Same question; different prompt packaging.">
{`# Zero-shot
Q: What is 17 × 19?
A: (model answers)

# Few-shot (2 examples shown first)
Q: What is 12 × 11?
A: 132
Q: What is 15 × 15?
A: 225
Q: What is 17 × 19?
A: (model answers)`}
        </Example>
      </LessonSection>

      <LessonSection title="The evaluation pipeline">
        <Flowchart
          title="Model → prompts → answers → score"
          chart={`flowchart TB
  A[Model under test] --> B[Benchmark prompts<br/>zero or few-shot]
  B --> C[Model answers]
  C --> D[Scoring method<br/>exact / MC / pass@k / judge]
  D --> E[Score<br/>accuracy % or pass rate]`}
        />
        <ContentStep number={1} title="Prompt every item">
          <p className="text-slate-300">
            Each dataset row becomes a prompt (plus optional few-shot examples and a fixed system message).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Collect answers">
          <p className="text-slate-300">
            The model generates text or code. For coding, you may run that code against hidden unit tests.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Aggregate">
          <p className="text-slate-300">
            Average correctness across items. That aggregate is the headline score.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What a “score” means">
        <p className="text-slate-300">
          An <strong className="text-white">accuracy %</strong> means: of all graded items, this fraction were
          correct. A <strong className="text-white">pass rate</strong> (or pass@k) means: of all coding tasks,
          this fraction had at least one solution that passed the tests within k tries. Higher is usually better —
          but only when the setup matches.
        </p>
        <CodeBlock title="Tiny score intuition">{`# 80 correct out of 100 multiple-choice items
accuracy = 80 / 100  →  80%

# 37 of 164 HumanEval tasks pass with k=1 sample
pass@1 = 37 / 164  →  ~22.6%`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Teaser: contamination / train-test leakage">
        <p className="text-slate-300">
          <strong className="text-white">Contamination</strong> (also called{' '}
          <strong className="text-white">train-test leakage</strong>) happens when benchmark questions leaked into
          the model&apos;s training data. The model may &quot;remember&quot; answers instead of solving them —
          like a student who saw the exam last night. Later lessons cover how people detect and mitigate this;
          for now, treat suspiciously perfect scores with healthy skepticism.
        </p>
        <Flowchart
          title="Clean eval vs contaminated eval"
          chart={`flowchart TB
  A[Benchmark questions] --> B{Seen in training?}
  B -->|No| C[Fair test<br/>measures skill]
  B -->|Yes| D[Leakage risk<br/>score may be inflated]`}
        />
        <Callout variant="insight" title="Remember">
          A score is only as fair as the dataset, the prompt setup, and the guarantee that the model did not
          memorize the test.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A benchmark = dataset of questions + a scoring method (exact match, multiple choice, pass@k, judge).',
          'Zero-shot vs few-shot changes the prompt and can change the score — compare setups, not just names.',
          'Pipeline: model → prompts → answers → scorer → accuracy % or pass rate.',
          'Contamination / train-test leakage can inflate scores when test items appeared in training.',
        ]}
      />
    </LessonArticle>
  )
}
