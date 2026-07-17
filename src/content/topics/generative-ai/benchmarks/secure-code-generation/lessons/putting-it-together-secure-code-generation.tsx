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

export function PuttingItTogetherSecureCodeGeneration() {
  return (
    <LessonArticle>
      <Definition term="Putting it together — secure code generation">
        <p>
          You now have foundations, the top 10 secure-code benchmarks, and a way to choose a suite. Mastery is{' '}
          <strong className="text-white">pairing security with helpfulness code</strong>, connecting misuse to{' '}
          <strong className="text-white">Secure Text Generation</strong>, and reading scores without mixing
          axes.
        </p>
        <p className="mt-2 text-slate-300">
          This lesson is a checklist, a short mastery recap, and clear next steps.
        </p>
      </Definition>

      <Callout variant="beginner" title="The five-step habit">
        Map coding surfaces → pick suites → lock oracles → read insecure rates with correctness → add RedCode
        + private pack for misuse.
      </Callout>

      <LessonSection title="Checklist">
        <ContentStep number={1} title="Map product coding surfaces">
          <p className="text-slate-300">
            IDE autocomplete? NL chat codegen? Multi-file backend agents? Vendor API only? Write the list
            before picking datasets.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Pick a minimal suite">
          <p className="text-slate-300">
            Default: CyberSecEval + SecurityEval/Asleep + CWEval. Use BaxBench for backends; add RedCode for
            malicious-code risk.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Lock the setup">
          <p className="text-slate-300">
            Same decoding settings, static rule pack version, and harness for every model you compare. Document
            them next to every insecure rate.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Pair with Helpfulness code">
          <p className="text-slate-300">
            Run HumanEval / MBPP (or your coding helpfulness suite) on the{' '}
            <strong className="text-white">same model build</strong>. Prefer CWEval-style joint views so
            “safer” is not secretly “broken.”
          </p>
        </ContentStep>
        <ContentStep number={5} title="Connect to Secure Text Generation">
          <p className="text-slate-300">
            Jailbreak-to-malware paths are chat-safety problems that land in code. Pair RedCode with HarmBench
            / JailbreakBench-style evals when agents can write and run code.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Decision reminder">
        <Flowchart
          title="Ship-ready secure codegen loop"
          chart={`flowchart TB
  H[Helpfulness code suite] --> C[Candidate model]
  S[Secure code suite] --> C
  T[Secure Text / RedCode misuse] --> C
  C --> D{Insecure rates OK<br/>and joint correct+secure OK?}
  D -->|No| E[Adjust training / filters / decoding]
  E --> C
  D -->|Yes| F[Private CWE-pattern + misuse pack]
  F --> G{Pass?}
  G -->|Yes| H2[Ship with monitoring]
  G -->|No| E`}
        />
        <Example title="One-page scorecard idea">
{`Model build: ...
Helpfulness code: HumanEval / MBPP (as relevant)
Secure code:
  CyberSecEval insecure rates (instruct / autocomplete): ...
  SecurityEval or Asleep: ...
  CWEval joint correct+secure: ...  (or BaxBench)
  RedCode compliance: ... (if in scope)
Private pack: pass/fail
Verdict: ship / hold`}
        </Example>
      </LessonSection>

      <LessonSection title="Mastery recap — one line each">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Secure code gen</strong> — avoid CWE-style weaknesses, not only pass
            tests.
          </li>
          <li>
            <strong className="text-white">Instruct vs autocomplete</strong> — NL codegen vs IDE continuation.
          </li>
          <li>
            <strong className="text-white">Oracles</strong> — static analysis, unit tests, dynamic checks;
            watch false positives.
          </li>
          <li>
            <strong className="text-white">CyberSecEval</strong> — insecure code + cyber assist (Purple Llama).
          </li>
          <li>
            <strong className="text-white">SecurityEval / Asleep / CodeLMSec / LLMSecEval</strong> — CWE-focused
            gen, autocomplete seminal set, black-box propensity, NL Top-25 themes.
          </li>
          <li>
            <strong className="text-white">CWEval / BaxBench</strong> — dual scoring; multi-file backends.
          </li>
          <li>
            <strong className="text-white">SecCodePLT / CodeGuard+</strong> — platform and suite-style security
            evals.
          </li>
          <li>
            <strong className="text-white">RedCode</strong> — malicious/abusive code risk vs insecure-but-benign
            patterns.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Next steps">
        <ContentStep number={1} title="Revisit Helpfulness code">
          <p className="text-slate-300">
            Pair every secure-codegen report with HumanEval/MBPP (or SWE-bench if agents) so security work does
            not silently destroy usefulness.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Build a private pattern pack">
          <p className="text-slate-300">
            Encode your stack’s risky APIs with placeholders like{' '}
            <span className="font-mono text-sm text-genai-400">[insecure pattern: SQL string concat]</span> —
            never store real exploit payloads in course or public docs.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Monitor after ship">
          <p className="text-slate-300">
            Public benchmarks lag new frameworks. Combine offline suites with PR scanners, sandbox execution
            policies, and human review for coding agents.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Shipping rule of thumb">
          Public secure-code benchmarks inform; private pattern packs, correctness gates, and runtime
          guardrails decide. Prefer boring repeated measurements over one leaderboard screenshot.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Workflow: map surfaces → pick suites → lock oracles → pair with helpfulness → RedCode + private pack.',
          'Always pair Secure Code Generation with Helpfulness code; connect misuse to Secure Text Generation.',
          'Mastery is choosing axes (autocomplete, instruct, dual, backend, malice) — not memorizing every paper.',
          'Next: private packs, release gates, and post-ship monitoring for coding products.',
        ]}
      />
    </LessonArticle>
  )
}
