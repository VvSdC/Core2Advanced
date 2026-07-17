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

export function ChoosingASecureCodeSuite() {
  return (
    <LessonArticle>
      <Definition term="Secure code suite">
        <p>
          A <strong className="text-white">secure code suite</strong> is a small, deliberate set of secure-code
          benchmarks you run together so you see autocomplete risk, NL codegen risk, and (when needed)
          correctness+security or backend realism — not a single vanity insecure-rate.
        </p>
      </Definition>

      <Callout variant="beginner" title="Minimal suite for beginners">
        Start with <span className="text-genai-400">CyberSecEval</span> +{' '}
        <span className="text-genai-400">SecurityEval</span> or{' '}
        <span className="text-genai-400">Asleep at the Keyboard</span> +{' '}
        <span className="text-genai-400">CWEval</span> (swap in{' '}
        <span className="text-genai-400">BaxBench</span> for multi-file backend agents).
      </Callout>

      <LessonSection title="Decision flowchart by product">
        <Flowchart
          title="Choose suites from the product"
          chart={`flowchart TB
  P[What are you shipping?] --> IDE{IDE copilot / autocomplete?}
  IDE -->|Yes| A[Asleep + CyberSecEval completion]
  P --> NL{NL / chat codegen?}
  NL -->|Yes| B[CyberSecEval instruct + LLMSecEval / SecurityEval]
  P --> AG{Backend-building agent?}
  AG -->|Yes| C[BaxBench + CWEval-style dual checks]
  P --> API{Vendor code API black-box?}
  API -->|Yes| D[CodeLMSec + CyberSecEval]
  P --> MIS{Malicious code misuse?}
  MIS -->|Yes| E[Add RedCode]
  A --> PRIV[Always: private insecure-pattern pack]
  B --> PRIV
  C --> PRIV
  D --> PRIV
  E --> PRIV`}
        />
      </LessonSection>

      <LessonSection title="Minimal suite explained">
        <ContentStep number={1} title="CyberSecEval — broad cyber + insecure code">
          <p className="text-slate-300">
            Covers insecure generation and related cyber-assist risks; keeps instruct vs autocomplete in view.
          </p>
        </ContentStep>
        <ContentStep number={2} title="SecurityEval or Asleep — CWE depth">
          <p className="text-slate-300">
            SecurityEval for curated CWE gen/completion; Asleep for the seminal IDE autocomplete story. Pick
            based on product shape (or run both later).
          </p>
        </ContentStep>
        <ContentStep number={3} title="CWEval or BaxBench — dual / realism">
          <p className="text-slate-300">
            CWEval stops “passes tests but insecure” arguments on mid-size tasks. BaxBench when the product is
            multi-file backends.
          </p>
        </ContentStep>
        <CodeBlock title="Beginner suite (mental checklist)">{`minimal_secure_code = [
  "CyberSecEval",              # insecure code + cyber assist
  "SecurityEval|Asleep",       # CWE depth (pick by product shape)
  "CWEval",                    # functionality AND security
]

swap_if_backend_agents = ["BaxBench"]  # instead of / besides CWEval
add_if_misuse_risk = ["RedCode"]`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="When to expand">
        <div className="mt-2 space-y-3">
          {[
            ['LLMSecEval', 'NL chat coding with Top-25 CWE-style theme coverage.'],
            ['CodeLMSec', 'Black-box vendor API vulnerability propensity.'],
            ['SecCodePLT / CodeGuard+', 'Platform or multi-check security suite breadth.'],
            ['RedCode', 'Malicious/abusive code generation refusal — not just accidental CWEs.'],
          ].map(([label, text]) => (
            <div key={label} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="mt-1 text-sm text-slate-400">{text}</p>
            </div>
          ))}
        </div>
        <Example title="Example packs" caption="Keep a private pattern pack too.">
{`IDE copilot:
  Asleep + CyberSecEval completion + SecurityEval sample + private pack

Chat codegen assistant:
  CyberSecEval instruct + LLMSecEval + CWEval + RedCode + private pack

Backend coding agent:
  BaxBench + CWEval + CyberSecEval + RedCode + private pack`}
        </Example>
      </LessonSection>

      <LessonSection title="Lock the protocol">
        <p className="text-slate-300">
          Insecure rates move when you change static rule packs, temperature, or prompt templates. Document
          oracle versions the same way you document HumanEval harness settings.
        </p>
        <Callout variant="insight" title="Product first">
          Choose suites from IDE vs NL vs backend-agent surfaces — not from whichever paper trended this week.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Beginner suite: CyberSecEval + SecurityEval/Asleep + CWEval (BaxBench for backends).',
          'Decision flow: IDE copilot vs NL codegen vs backend agents vs misuse.',
          'Add RedCode, LLMSecEval, CodeLMSec, SecCodePLT/CodeGuard+ by risk.',
          'Lock oracles and protocols before comparing models.',
        ]}
      />
    </LessonArticle>
  )
}
