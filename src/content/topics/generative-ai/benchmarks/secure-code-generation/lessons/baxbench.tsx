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

export function Baxbench() {
  return (
    <LessonArticle>
      <Definition term="BaxBench">
        <p>
          <strong className="text-white">BaxBench</strong> evaluates whether models can build{' '}
          <strong className="text-white">secure and correct multi-file backends</strong> — closer to real
          service scaffolding than a single-function puzzle.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: not “write one helper,” but “stand up a small backend that works and is not full of open
          doors.”
        </p>
      </Definition>

      <Callout variant="beginner" title="What BaxBench measures">
        End-to-end backend generation quality: functional behavior plus security properties across multi-file
        projects under a realistic harness.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Multi-file backend realism">
          <p className="text-slate-300">
            Tasks resemble small server apps (routing, data access, config) spanning multiple files — the
            setting where insecurity often hides in wiring, not one line.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Secure + correct">
          <p className="text-slate-300">
            Like CWEval’s dual spirit, BaxBench cares that the backend{' '}
            <strong className="text-white">behaves</strong> and avoids insecure patterns such as{' '}
            <span className="font-mono text-sm text-genai-400">[insecure pattern: SQL string concat]</span> in
            context.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Agent / codegen product fit">
          <p className="text-slate-300">
            Especially relevant for coding agents that scaffold services, not only IDE line completion.
          </p>
        </ContentStep>
        <Flowchart
          title="BaxBench (conceptual)"
          chart={`flowchart TB
  Spec[Backend task spec] --> Gen[Multi-file generation]
  Gen --> Run[Functional harness / tests]
  Gen --> Sec[Security checks on project]
  Run --> Out[Correct + secure outcomes]
  Sec --> Out`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Higher secure+correct project success</strong> — stronger at
            realistic backend scaffolding under the suite.
          </li>
          <li>
            <strong className="text-white">Low scores</strong> — model struggles with multi-file coherence,
            security, or both; risky for agentic backend builders.
          </li>
          <li>
            Compare only under the same harness, language stack, and timeout settings.
          </li>
        </ul>
        <Example title="Safe reporting style">
{`Suite: BaxBench backend tasks
Functional success: ...
Security pass among successes: ...
Joint secure+correct projects: ... (headline)`}
        </Example>
      </LessonSection>

      <LessonSection title="What BaxBench does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Tiny single-function <strong className="text-white">HumanEval-style</strong> puzzles alone.
          </li>
          <li>
            Pure <strong className="text-white">IDE autocomplete</strong> mid-line suggestions.
          </li>
          <li>
            <strong className="text-white">Intentional malware</strong> generation risk (RedCode).
          </li>
          <li>
            Full enterprise compliance (auth product policy, secrets vault design, etc.).
          </li>
        </ul>
        <Callout variant="tip" title="Pairing tip">
          Choose BaxBench when your product is a backend-building agent; choose CWEval for dual scoring on
          smaller tasks; still keep CyberSecEval for broader cyber coverage.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'BaxBench = secure + correct multi-file backend generation.',
          'Higher joint project success is better for agentic backend products.',
          'More realistic than single-function security snippets.',
          'Does not replace autocomplete suites or malware-intent benchmarks.',
        ]}
      />
    </LessonArticle>
  )
}
