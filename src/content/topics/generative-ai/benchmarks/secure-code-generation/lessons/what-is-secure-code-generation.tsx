import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function WhatIsSecureCodeGeneration() {
  return (
    <LessonArticle>
      <Definition term="Secure code generation">
        <p>
          <strong className="text-white">Secure code generation</strong> means an LLM writes (or completes)
          program code that is not only <strong className="text-white">functionally correct</strong>, but also
          free of common <strong className="text-white">security weaknesses</strong> — the kinds of bugs
          attackers look for.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a bridge that “works” (cars cross) can still collapse if the bolts are wrong. Passing a unit
          test is not the same as being safe under attack.
        </p>
      </Definition>

      <Callout variant="beginner" title="One sentence version">
        Secure code gen benchmarks ask: when the model writes code, does it introduce insecure patterns —
        even if the code “runs”?
      </Callout>

      <LessonSection title="Functional correctness ≠ secure code">
        <ContentStep number={1} title="Helpfulness code (e.g. HumanEval, MBPP)">
          <p className="text-slate-300">
            Suites like <span className="text-genai-400">HumanEval</span> and{' '}
            <span className="text-genai-400">MBPP</span> score whether generated functions pass unit tests. A
            high pass rate means “it usually does the job,” not “it is safe.”
          </p>
        </ContentStep>
        <ContentStep number={2} title="The security gap">
          <p className="text-slate-300">
            Code can pass tests and still use{' '}
            <span className="font-mono text-sm text-genai-400">[insecure pattern: SQL string concat]</span>,
            weak crypto placeholders, or unsafe file handling. Tests check behavior on happy paths; they rarely
            simulate attackers.
          </p>
        </ContentStep>
        <ContentStep number={3} title="What this track adds">
          <p className="text-slate-300">
            Secure code generation benchmarks deliberately prompt for risky scenarios and score whether the
            model emits vulnerable patterns — often labeled with{' '}
            <strong className="text-white">CWE</strong> categories.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="CWE in one paragraph">
        <p className="text-slate-300">
          <strong className="text-white">CWE</strong> means <strong className="text-white">Common Weakness
          Enumeration</strong> — a public catalog of weakness types (e.g. injection-style bugs, unsafe
          deserialization ideas). Think of CWEs as labeled buckets for “kinds of insecure coding mistakes.”
          Benchmarks use CWE IDs so labs can say “this model often fails on{' '}
          <span className="font-mono text-sm text-genai-400">[fictional CWE-STYLE-INJECT]</span>” instead of
          vague “bad code.” You do not need to memorize IDs; you need to know that scores are often
          CWE-scoped.
        </p>
        <Callout variant="insight" title="Jargon: static analysis">
          <strong className="text-white">Static analysis</strong> means inspecting source code without fully
          running it (tools like CodeQL-style analyzers). Many secure-code benchmarks use static rules as the{' '}
          <strong className="text-white">oracle</strong> (automatic grader) that flags insecure patterns.
        </Callout>
      </LessonSection>

      <LessonSection title="How this differs from nearby tracks">
        <div className="mt-2 space-y-3">
          {[
            [
              'Secure Text Generation',
              'Chat safety: refuse harmful asks, jailbreaks, toxicity. About what the model says — not whether generated source is vulnerable.',
            ],
            [
              'Helpfulness code (HumanEval / MBPP)',
              'Does the code pass unit tests? Correctness and usefulness, not CWE security.',
            ],
            [
              'Secure Code Generation (this track)',
              'Does generated or completed code introduce insecure patterns under security-focused prompts?',
            ],
          ].map(([label, text]) => (
            <div key={label} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="mt-1 text-sm text-slate-400">{text}</p>
            </div>
          ))}
        </div>
        <Flowchart
          title="Three questions, three tracks"
          chart={`flowchart TB
  Q[What are you measuring?] --> H[Helpfulness code<br/>Does it pass tests?]
  Q --> S[Secure Text Generation<br/>Does it refuse harm?]
  Q --> C[Secure Code Generation<br/>Is the code insecure?]`}
        />
      </LessonSection>

      <LessonSection title="Learning map — Benchmarks → Secure Code Generation">
        <p className="text-slate-300">
          Under <strong className="text-white">Benchmarks → Secure Code Generation</strong> you learn
          foundations, the top 10 most-used secure-code benchmarks, then how to pick a small suite.
        </p>
        <Flowchart
          title="Secure Code Generation track map"
          chart={`flowchart TB
  A[1. Foundations<br/>what / instruct vs autocomplete / CWE oracles] --> B[2. Top 10 benchmarks<br/>CyberSecEval SecurityEval ...]
  B --> C[3. Synthesis<br/>map + choose suite]
  C --> D[4. Put it together<br/>checklist + pair tracks]`}
        />
        <ContentStep number={1} title="Foundations (you are here)">
          <p className="text-slate-300">
            What secure code gen means, instruct vs autocomplete security, and how CWE / static analysis /
            oracles grade insecure outputs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Top 10 benchmarks">
          <p className="text-slate-300">
            CyberSecEval, SecurityEval, Asleep at the Keyboard, CodeLMSec, LLMSecEval, CWEval, BaxBench,
            SecCodePLT, CodeGuard+, and RedCode.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Synthesis">
          <p className="text-slate-300">
            A master map, a decision flowchart for choosing a suite, and a checklist that pairs with
            Helpfulness code and Secure Text Generation.
          </p>
        </ContentStep>
        <Callout variant="beginner" title="Safety note for this course">
          Lessons never include real exploit or malware code. Examples use placeholders like{' '}
          <span className="font-mono text-sm text-genai-400">[insecure pattern: SQL string concat]</span> or
          fictional CWE-style labels only.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Secure code generation = generated code should avoid common security weaknesses, not just pass tests.',
          'HumanEval / MBPP measure helpfulness correctness; they do not certify security.',
          'CWE = catalog of weakness types; static analysis often acts as the automatic grader.',
          'Track path: Foundations → Top 10 → Synthesis → Put it together.',
        ]}
      />
    </LessonArticle>
  )
}
