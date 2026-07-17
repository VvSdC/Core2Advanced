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

export function CweStaticAnalysisAndOracles() {
  return (
    <LessonArticle>
      <Definition term="CWE, static analysis, and oracles">
        <p>
          An <strong className="text-white">oracle</strong> is the automatic grader that decides whether
          generated code is insecure. Secure-code benchmarks usually combine{' '}
          <strong className="text-white">CWE-labeled scenarios</strong> with{' '}
          <strong className="text-white">static analyzers</strong>, unit tests, and sometimes{' '}
          <strong className="text-white">dynamic oracles</strong> that run the code under safe test harnesses.
        </p>
      </Definition>

      <Callout variant="beginner" title="One sentence version">
        Prompt → model writes code → tools/tests grade security (and sometimes correctness) → score.
      </Callout>

      <LessonSection title="Three common grading styles">
        <ContentStep number={1} title="Static analysis (CodeQL-style)">
          <p className="text-slate-300">
            <strong className="text-white">Static analysis</strong> scans source without treating it as a live
            attack. Rules look for patterns like{' '}
            <span className="font-mono text-sm text-genai-400">[insecure pattern: SQL string concat]</span> and
            map hits to CWE-style labels. Fast and scalable — used heavily by SecurityEval, CyberSecEval, and
            related suites.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Unit tests for correctness">
          <p className="text-slate-300">
            Classic helpfulness oracles: does the function return the right answer? Suites like{' '}
            <span className="text-genai-400">CWEval</span> insist on{' '}
            <strong className="text-white">both</strong> passing tests and passing security checks on the same
            task.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Dynamic oracles">
          <p className="text-slate-300">
            <strong className="text-white">Dynamic</strong> means run the program in a sandbox and observe
            behavior (e.g. whether a crafted benign test input triggers a failure class). Still educational —
            never “live hacking.” CWEval-style pipelines popularized combining dynamic checks with security
            labels.
          </p>
        </ContentStep>
        <CodeBlock title="Mental model (not real tooling)">{`prompt  ->  model_code
model_code  ->  static_rules   # CWE-style pattern flags
model_code  ->  unit_tests     # functional pass/fail (if suite has them)
model_code  ->  sandbox_checks # optional dynamic oracle
combine  ->  secure? correct? both?`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Eval pipeline flowchart">
        <Flowchart
          title="Secure code generation eval pipeline"
          chart={`flowchart TB
  P[Security-relevant prompt<br/>instruct or prefix] --> M[Model generates code]
  M --> SA[Static analyzer / rule pack]
  M --> UT[Unit tests optional]
  M --> DY[Dynamic sandbox checks optional]
  SA --> J[Combine oracles]
  UT --> J
  DY --> J
  J --> R[Score: insecure rate<br/>CWE breakdown / dual metrics]
  R --> N[Note: false positives possible]`}
        />
        <Example title="Safe reporting sketch">
{`Scenario family: [fictional CWE-STYLE-INJECT]
Oracle: static rule pack vX (+ unit tests if CWEval-like)
Outcome: flagged insecure | clean | inconclusive
Aggregate: % insecure generations (lower is better for security)`}
        </Example>
      </LessonSection>

      <LessonSection title="False positives caveat">
        <p className="text-slate-300">
          Static rules can cry wolf. A <strong className="text-white">false positive</strong> means the
          analyzer flags code that is actually fine (or fine in context). A{' '}
          <strong className="text-white">false negative</strong> means real weakness slips through. Benchmark
          scores inherit those errors — especially across languages and frameworks the rule pack barely
          covers.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Treat “% insecure” as a <strong className="text-white">comparative signal</strong>, not a court
            verdict.
          </li>
          <li>
            Prefer suites that publish oracle versions so you compare models under the{' '}
            <strong className="text-white">same grader</strong>.
          </li>
          <li>
            Spot-check a sample of flags with humans when stakes are high — still without building real
            exploits.
          </li>
        </ul>
        <Callout variant="insight" title="Jargon: oracle">
          In benchmarking, an <strong className="text-white">oracle</strong> is whatever automatically labels
          success/failure. For math it might be exact answer match; for secure code it is often static rules +
          tests.
        </Callout>
      </LessonSection>

      <LessonSection title="What oracles measure vs miss">
        <ContentStep number={1} title="They measure">
          <p className="text-slate-300">
            Presence of known insecure coding patterns under the suite’s CWE-linked scenarios, and (when
            included) functional pass rates on the same tasks.
          </p>
        </ContentStep>
        <ContentStep number={2} title="They do NOT fully measure">
          <p className="text-slate-300">
            Novel attack classes outside the rule pack, production architecture risk, secrets handling policy,
            or whether the model will generate intentional malware (that is closer to{' '}
            <span className="text-genai-400">RedCode</span> / Secure Text Generation).
          </p>
        </ContentStep>
        <Callout variant="tip" title="Beginner habit">
          When you read a paper score, ask: instruct or autocomplete? which oracle? correctness measured or
          only security flags?
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Oracles grade generated code: static CWE rules, unit tests, and optional dynamic checks.',
          'Typical pipeline: prompt → generate → analyze/test → aggregate insecure rate.',
          'False positives/negatives mean scores are comparative signals, not absolute truth.',
          'Oracles miss novel risks, full system security, and intentional malware intent alone.',
        ]}
      />
    </LessonArticle>
  )
}