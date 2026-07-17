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

export function Cweval() {
  return (
    <LessonArticle>
      <Definition term="CWEval">
        <p>
          <strong className="text-white">CWEval</strong> is designed so each task is scored for{' '}
          <strong className="text-white">functionality and security together</strong>. A solution that passes
          unit tests but contains insecure patterns is not a full win — and secure-but-broken code is not
          either.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a cooking contest that grades taste <em>and</em> food-safety temperature logs. You need
          both.
        </p>
      </Definition>

      <Callout variant="beginner" title="What CWEval measures">
        Joint success: does the generated code work (tests) and stay free of the suite’s security failures
        (static/dynamic oracles) on the same tasks?
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Same tasks, two axes">
          <p className="text-slate-300">
            Unlike HumanEval-only or security-only suites, CWEval insists on reporting{' '}
            <strong className="text-white">correctness</strong> and <strong className="text-white">security</strong>{' '}
            for identical prompts.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Unit tests as functionality oracle">
          <p className="text-slate-300">
            Functional pass/fail comes from tests — the helpfulness-style signal coding teams already know.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Security oracles (static + dynamic)">
          <p className="text-slate-300">
            Security uses analyzers and/or sandbox checks that look for weakness patterns such as{' '}
            <span className="font-mono text-sm text-genai-400">[insecure pattern: SQL string concat]</span>{' '}
            without providing real exploit recipes.
          </p>
        </ContentStep>
        <Flowchart
          title="CWEval dual scoring"
          chart={`flowchart TB
  Task[Coding task] --> Code[Model code]
  Code --> Func[Unit tests]
  Code --> Sec[Security oracles<br/>static / dynamic]
  Func --> Joint{Pass both?}
  Sec --> Joint
  Joint -->|Yes| Win[Functionally correct + secure]
  Joint -->|No| Partial[Correct-only / secure-only / fail]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">High joint pass rate</strong> — model often produces code that is
            both correct and secure under CWEval oracles (best headline).
          </li>
          <li>
            <strong className="text-white">High correct, low secure</strong> — classic “HumanEval-looking”
            model that still emits weak patterns.
          </li>
          <li>
            <strong className="text-white">High secure, low correct</strong> — overly cautious or incomplete
            solutions; not product-ready.
          </li>
        </ul>
        <Example title="Safe scorecard sketch">
{`Task set: CWEval suite
Functional pass: 61%
Secure among generations: 74%
Joint correct+secure: 48%  ← read this first`}
        </Example>
      </LessonSection>

      <LessonSection title="What CWEval does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Large <strong className="text-white">multi-file backend</strong> applications (see BaxBench).
          </li>
          <li>
            <strong className="text-white">Cyber-assist / malware intent</strong> refusal (CyberSecEval cyber
            tracks, RedCode).
          </li>
          <li>
            General chat safety, bias, or toxicity.
          </li>
          <li>
            Perfect detection of every weakness — oracles still have false positives/negatives.
          </li>
        </ul>
        <Callout variant="tip" title="Pairing tip">
          CWEval is the beginner’s bridge between Helpfulness code and Secure Code Generation — run it when
          stakeholders argue “but it passes tests.”
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CWEval scores functionality AND security on the same tasks.',
          'Joint correct+secure rate is the headline; single-axis scores can mislead.',
          'Uses unit tests plus static/dynamic security oracles.',
          'Does not replace backend realism suites or malware-intent evals.',
        ]}
      />
    </LessonArticle>
  )
}
