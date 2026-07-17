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

export function ChoosingAHelpfulnessSuite() {
  return (
    <LessonArticle>
      <Definition term="Helpfulness suite">
        <p>
          A <strong className="text-white">helpfulness suite</strong> is a small, deliberate set of capability
          benchmarks you run together so you see knowledge, code, and math — not just one exam. For beginners, a
          minimal suite is enough to shortlist models before deeper tests.
        </p>
      </Definition>

      <LessonSection title="Minimal suite for beginners">
        <p className="text-slate-300">
          Start with three pillars. Analogy: a school report with language, science lab, and math — enough to
          spot strengths without grading every elective.
        </p>
        <div className="mt-4 space-y-3">
          {[
            [
              'MMLU — knowledge',
              'Massive Multitask Language Understanding: multiple-choice questions across many subjects. Broad “did you study?” signal.',
            ],
            [
              'HumanEval or MBPP — code',
              'HumanEval and MBPP (Mostly Basic Python Problems): generate functions that must pass unit tests. Use pass@k scoring.',
            ],
            [
              'GSM8K — math',
              'Grade School Math 8K: word problems with step-by-step arithmetic. Checks whether reasoning holds for simple math.',
            ],
          ].map(([label, text]) => (
            <div key={label} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="mt-1 text-sm text-slate-400">{text}</p>
            </div>
          ))}
        </div>
        <CodeBlock title="Beginner suite (mental checklist)">{`minimal_suite = [
  "MMLU",           # knowledge
  "HumanEval|MBPP", # code (pick one to start)
  "GSM8K",          # grade-school math
]`}
        </CodeBlock>
        <Callout variant="beginner" title="Why only three?">
          More benchmarks mean more compute, more setup, and more ways to miscompare. Nail a fair run of these
          three first; expand when you know what your product needs.
        </Callout>
      </LessonSection>

      <LessonSection title="When to add harder benchmarks">
        <ContentStep number={1} title="GPQA — graduate-level reasoning">
          <p className="text-slate-300">
            Add <span className="text-genai-400">GPQA</span> (Graduate-Level Google-Proof Q&amp;A) when your use
            case needs hard science/expert questions and MMLU scores look saturated (everyone is high).
          </p>
        </ContentStep>
        <ContentStep number={2} title="MATH — competition math">
          <p className="text-slate-300">
            Add <span className="text-genai-400">MATH</span> when GSM8K is too easy for your candidates or you
            care about competition-style problem solving (tutors, STEM assistants).
          </p>
        </ContentStep>
        <ContentStep number={3} title="SWE-bench — real software engineering">
          <p className="text-slate-300">
            Add <span className="text-genai-400">SWE-bench</span> when the product is a coding agent that must
            edit real repositories — HumanEval alone is necessary but not sufficient.
          </p>
        </ContentStep>
        <Example title="Expand only with a reason" caption="Each add-on maps to a product need.">
{`If chatbot Q&A only     → MMLU (+ maybe GPQA later)
If coding autocomplete  → HumanEval/MBPP → then SWE-bench
If math tutor           → GSM8K → then MATH
If "do everything" pitch → still start minimal, then deepen per axis`}
        </Example>
      </LessonSection>

      <LessonSection title="Decision flowchart by use case">
        <Flowchart
          title="Pick suite from the job"
          chart={`flowchart TB
  A[What are you building?] --> B[Chatbot / general Q&A]
  A --> C[Coding assistant]
  A --> D[Tutor / STEM help]
  B --> E[MMLU first<br/>+ GSM8K optional]
  C --> F[HumanEval or MBPP<br/>then SWE-bench]
  D --> G[GSM8K then MATH<br/>+ MMLU for coverage]
  E --> H[Later lessons: knowledge deep dive]
  F --> I[Later lessons: code deep dive]
  G --> J[Later lessons: math deep dive]`}
        />
        <Callout variant="insight" title="Product first">
          Choose benchmarks from the user job, not from whatever is trendy on social media that week.
        </Callout>
      </LessonSection>

      <LessonSection title="Tie-in to later detailed lessons">
        <p className="text-slate-300">
          Foundations end here. Next in this Helpfulness track you will unpack each pillar: how{' '}
          <strong className="text-white">MMLU</strong>-style knowledge tests are scored, how code{' '}
          <code className="font-mono text-sm text-genai-400">pass@k</code> works in practice, and how math
          benchmarks handle chain-of-thought answers. Treat this suite as your shopping list; later lessons are
          the lab manuals.
        </p>
        <div className="mt-4 space-y-3">
          {[
            ['Knowledge track', 'MMLU / MMLU-Pro mechanics, subject splits, and contamination caveats.'],
            ['Code track', 'HumanEval, MBPP, pass@k, then SWE-bench for repository-level tasks.'],
            ['Math track', 'GSM8K grading, MATH difficulty jump, and when chain-of-thought changes scores.'],
          ].map(([label, text]) => (
            <div key={label} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="mt-1 text-sm text-slate-400">{text}</p>
            </div>
          ))}
        </div>
        <Flowchart
          title="From suite choice to deep dives"
          chart={`flowchart TB
  A[Choose minimal suite] --> B[Knowledge lessons<br/>MMLU family]
  A --> C[Code lessons<br/>HumanEval / MBPP / SWE-bench]
  A --> D[Math lessons<br/>GSM8K / MATH]
  B --> E[Practice: run and interpret]
  C --> E
  D --> E`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'Beginner helpfulness suite: MMLU + HumanEval/MBPP + GSM8K.',
          'Add GPQA, MATH, or SWE-bench when the product needs harder reasoning, competition math, or real repo edits.',
          'Match the suite to the use case: chatbot, coding assistant, or tutor.',
          'Later lessons deep-dive each pillar — this lesson only helps you choose what to run first.',
        ]}
      />
    </LessonArticle>
  )
}
