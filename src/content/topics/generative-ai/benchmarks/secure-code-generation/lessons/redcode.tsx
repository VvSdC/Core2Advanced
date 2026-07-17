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

export function Redcode() {
  return (
    <LessonArticle>
      <Definition term="RedCode">
        <p>
          <strong className="text-white">RedCode</strong> focuses on the risk that models will generate{' '}
          <strong className="text-white">malicious or abusive code</strong> — intentional harmful tooling —
          which is different from accidentally emitting an insecure-but-benign vulnerability pattern.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: leaving a door unlocked (insecure pattern) vs handing someone a lockpick kit (malicious
          assistance). Both are bad; they are not the same failure.
        </p>
      </Definition>

      <Callout variant="beginner" title="What RedCode measures">
        How often models comply with requests for malicious / abusive code behaviors under its risk
        categories — a misuse lens, not only CWE static flags on ordinary features.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Malicious / abusive code risk">
          <p className="text-slate-300">
            Prompts target harmful coding intents represented here only as{' '}
            <span className="font-mono text-sm text-genai-400">[malicious code request category]</span>. This
            course never includes working malware or exploit PoCs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Contrast with insecure-but-benign">
          <p className="text-slate-300">
            Suites like SecurityEval / Asleep measure <strong className="text-white">vulnerable patterns in
            otherwise ordinary features</strong> (e.g.{' '}
            <span className="font-mono text-sm text-genai-400">[insecure pattern: SQL string concat]</span>).
            RedCode asks whether the model will help with clearly abusive goals.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Bridge to Secure Text Generation">
          <p className="text-slate-300">
            Scoring often resembles refusal / ASR-style judgments: did the model refuse, sanitize, or comply?
            That connects coding misuse to chat safety culture.
          </p>
        </ContentStep>
        <Flowchart
          title="RedCode vs insecure-pattern suites"
          chart={`flowchart TB
  Ask[Coding-related ask] --> Kind{Intent?}
  Kind -->|Ordinary feature<br/>but risky APIs| Vuln[Insecure-pattern benchmarks<br/>SecurityEval / Asleep / CWEval]
  Kind -->|Clearly abusive / malware-like| Red[RedCode-style misuse eval]
  Vuln --> S1[CWE / static oracles]
  Red --> S2[Refusal vs compliance judges]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Lower compliance / lower attack success</strong> on malicious-code
            asks — safer refusal behavior (interpret using the suite’s official metric names).
          </li>
          <li>
            <strong className="text-white">Higher compliance</strong> — model more often assists abusive coding
            requests; high risk for open coding agents.
          </li>
          <li>
            Do not confuse “low insecure-CWE rate” with “low RedCode compliance” — they can diverge.
          </li>
        </ul>
        <Example title="Safe reporting style">
{`Category: [malicious code request category]
Judge: suite refusal/compliance labeler
Result: compliance rate = 4% (lower is safer)
Note: no malware samples stored in course materials`}
        </Example>
      </LessonSection>

      <LessonSection title="What RedCode does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Everyday <strong className="text-white">CWE insecure-but-benign</strong> coding mistakes alone.
          </li>
          <li>
            <strong className="text-white">Functional correctness</strong> of legitimate programs.
          </li>
          <li>
            Non-code harms (hate speech, etc.) covered by Secure Text Generation suites.
          </li>
          <li>
            Proof that a model is safe against every future jailbreak-to-malware path.
          </li>
        </ul>
        <Callout variant="tip" title="Pairing tip">
          Run RedCode (misuse) next to CyberSecEval / SecurityEval (insecure patterns) and Secure Text
          Generation jailbreak suites for jailbreak-to-malware chains.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RedCode measures malicious/abusive code generation risk — not only accidental CWEs.',
          'Lower compliance with abusive coding asks is the safer direction.',
          'Contrast: insecure-but-benign patterns vs intentional harmful tooling.',
          'Pair with insecure-code suites and Secure Text Generation jailbreak evals.',
        ]}
      />
    </LessonArticle>
  )
}
