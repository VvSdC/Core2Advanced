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

export function CodeguardPlus() {
  return (
    <LessonArticle>
      <Definition term="CodeGuard+">
        <p>
          <strong className="text-white">CodeGuard+</strong> is a{' '}
          <strong className="text-white">code security evaluation suite</strong> for assessing how safely
          models generate or handle code with respect to common vulnerability patterns — a bundled set of
          checks and scenarios rather than a single toy dataset.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a home inspection checklist with many rooms — wiring, locks, smoke alarms — summarized into
          a security report for generated code.
        </p>
      </Definition>

      <Callout variant="beginner" title="What CodeGuard+ measures">
        Code security outcomes across its evaluation suite: how often generations hit insecure patterns versus
        safer alternatives under standardized scenarios.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Suite, not one quiz">
          <p className="text-slate-300">
            CodeGuard+ bundles multiple security-oriented coding evaluations so teams get a broader insecurity
            profile than a handful of prompts.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Insecure pattern detection">
          <p className="text-slate-300">
            Outputs are checked for weakness patterns (CWE-linked themes) such as{' '}
            <span className="font-mono text-sm text-genai-400">[insecure pattern: SQL string concat]</span>{' '}
            using automated analysis conventions described by the suite.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Comparative model reporting">
          <p className="text-slate-300">
            Designed so labs can compare coding models on security posture with a shared evaluation package.
          </p>
        </ContentStep>
        <Flowchart
          title="CodeGuard+ (conceptual)"
          chart={`flowchart TB
  Suite[CodeGuard+ scenario pack] --> Model[Code generations]
  Model --> Analyzers[Suite security checks]
  Analyzers --> Report[Security evaluation report<br/>rates + categories]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Better suite scores / lower insecure rates</strong> — safer code
            generation under CodeGuard+ scenarios.
          </li>
          <li>
            <strong className="text-white">Worse scores / higher insecure rates</strong> — frequent weak
            patterns; not ready as an unfiltered coding assistant.
          </li>
          <li>
            Read category breakdowns: suites often hide “average OK, one category terrible.”
          </li>
        </ul>
        <Example title="Safe reporting style">
{`Suite: CodeGuard+
Categories: [fictional CWE-STYLE-INJECT], [fictional CWE-STYLE-PATH], ...
Insecure rate overall: 19% (lower better)
Worst category: ...`}
        </Example>
      </LessonSection>

      <LessonSection title="What CodeGuard+ does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Full <strong className="text-white">product threat modeling</strong> for your architecture.
          </li>
          <li>
            <strong className="text-white">Chat refusal</strong> of non-code harmful asks (Secure Text
            Generation).
          </li>
          <li>
            Necessarily the same coverage as CyberSecEval’s cyber-assist tracks or BaxBench backends.
          </li>
          <li>
            Absolute proof of exploitability — pattern flags ≠ red-team proof.
          </li>
        </ul>
        <Callout variant="tip" title="Pairing tip">
          Use CodeGuard+ as a security evaluation suite pillar alongside CyberSecEval and a dual-scoring suite
          (CWEval) or backend suite (BaxBench) as needed.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CodeGuard+ is a code security evaluation suite for model-generated code.',
          'Lower insecure rates / better suite scores indicate safer generations.',
          'Read category breakdowns, not only averages.',
          'Does not replace chat safety, backend realism, or full threat modeling.',
        ]}
      />
    </LessonArticle>
  )
}
