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

export function Codelmsec() {
  return (
    <LessonArticle>
      <Definition term="CodeLMSec">
        <p>
          <strong className="text-white">CodeLMSec</strong> is a benchmark aimed at measuring the{' '}
          <strong className="text-white">black-box vulnerability propensity</strong> of code language models —
          how often they produce insecure programs when you only query the model as an API (no training-data
          peeking required).
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: mystery-shopper testing. You only see the storefront answers, then grade them for unsafe
          coding patterns.
        </p>
      </Definition>

      <Callout variant="beginner" title="What CodeLMSec measures">
        How prone a code LLM is to emit vulnerable code under security-relevant prompts, evaluated in a
        black-box fashion with automated insecurity checks.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Black-box setting">
          <p className="text-slate-300">
            <strong className="text-white">Black-box</strong> means you only send prompts and read outputs —
            you do not need model weights or training logs. That matches how most product teams evaluate vendor
            APIs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Vulnerability propensity">
          <p className="text-slate-300">
            Aggregate how often generations match insecure patterns such as{' '}
            <span className="font-mono text-sm text-genai-400">[insecure pattern: SQL string concat]</span>{' '}
            across a designed prompt set (CWE-linked themes).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Automated grading">
          <p className="text-slate-300">
            Static or rule-based oracles label insecure vs not. Results support comparing models’ security
            posture without white-box access.
          </p>
        </ContentStep>
        <Flowchart
          title="CodeLMSec (conceptual)"
          chart={`flowchart TB
  API[Black-box model API] --> Prompts[Security-relevant prompts]
  Prompts --> Out[Generated code]
  Out --> Check[Vulnerability / CWE-style checks]
  Check --> Prop[Vulnerability propensity score]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Lower vulnerability propensity</strong> — safer generations under
            the tested prompts (desired).
          </li>
          <li>
            <strong className="text-white">Higher propensity</strong> — model frequently produces flagged
            insecure code; risky for coding assistants.
          </li>
          <li>
            Read breakdowns by weakness family when available — one average can hide hotspots.
          </li>
        </ul>
        <Example title="Safe reporting style">
{`Setting: black-box API
Prompt set: CodeLMSec security scenarios
Oracle: static vulnerability checks
Propensity: 27% insecure (lower is better)`}
        </Example>
      </LessonSection>

      <LessonSection title="What CodeLMSec does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">White-box training data audits</strong> (whether insecure code was
            memorized from a specific repo).
          </li>
          <li>
            Guaranteed <strong className="text-white">functional correctness</strong> alongside security.
          </li>
          <li>
            <strong className="text-white">Multi-file backend</strong> realism (BaxBench) or intentional
            malware generation (RedCode).
          </li>
          <li>
            Non-code chat safety (Secure Text Generation).
          </li>
        </ul>
        <Callout variant="tip" title="Pairing tip">
          Use CodeLMSec when you need a black-box “how often insecure?” signal for vendor code models; pair
          with CyberSecEval for broader cyber-assist coverage.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CodeLMSec measures black-box vulnerability propensity of code LLMs.',
          'Lower insecure / vulnerability rates are better.',
          'Fits product teams who only have API access to models.',
          'Does not replace correctness suites, backend realism, or malware-intent evals.',
        ]}
      />
    </LessonArticle>
  )
}
