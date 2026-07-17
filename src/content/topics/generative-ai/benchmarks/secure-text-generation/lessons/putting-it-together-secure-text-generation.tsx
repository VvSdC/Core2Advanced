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

export function PuttingItTogetherSecureTextGeneration() {
  return (
    <LessonArticle>
      <Definition term="Putting it together — secure text generation">
        <p>
          You now have foundations, the top 10 safety benchmarks, and a way to choose a suite. Mastery is{' '}
          <strong className="text-white">pairing safety with helpfulness</strong>, locking eval protocols, and
          reading scores without confusing axes.
        </p>
        <p className="mt-2 text-slate-300">
          This lesson is a checklist, a short mastery recap, and clear next steps.
        </p>
      </Definition>

      <Callout variant="beginner" title="The five-step habit">
        Map risks → pick suites → lock judges/protocol → read ASR vs over-refusal together → always keep a
        private policy pack.
      </Callout>

      <LessonSection title="Checklist">
        <ContentStep number={1} title="Map product risks">
          <p className="text-slate-300">
            Chat jailbreaks? Completion toxicity? Social-group QA bias? Myth-prone advice? Governance
            categories? Write the list before you pick datasets.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Pick a minimal suite">
          <p className="text-slate-300">
            Default chat: Do-Not-Answer + HarmBench/JailbreakBench + XSTest. Add RealToxicityPrompts for
            completion; expand with AIR-Bench, BBQ, TruthfulQA, SafetyBench, AdvBench as needed.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Lock the setup">
          <p className="text-slate-300">
            Same system prompt, temperature, attack set, and judge version for every model you compare.
            Document them next to every ASR or refusal rate.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Interpret the tradeoff">
          <p className="text-slate-300">
            Lower ASR with sky-high over-refusal is not a win. Read XSTest whenever you tighten safety.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Pair with Helpfulness">
          <p className="text-slate-300">
            Run your helpfulness suite (MMLU / code / math as relevant) on the{' '}
            <strong className="text-white">same model build</strong>. Capability and safety can move in
            opposite directions after alignment.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Decision reminder">
        <Flowchart
          title="Ship-ready eval loop"
          chart={`flowchart TB
  A[Helpfulness suite] --> C[Candidate model]
  B[Safety suite] --> C
  C --> D{ASR OK and XSTest OK?}
  D -->|No| E[Adjust alignment / filters]
  E --> C
  D -->|Yes| F[Private policy + red-team pack]
  F --> G{Pass?}
  G -->|Yes| H[Ship with monitoring]
  G -->|No| E`}
        />
        <Example title="One-page scorecard idea">
{`Model build: ...
Helpfulness: MMLU / HumanEval / GSM8K (as relevant)
Safety:
  Do-Not-Answer safe rate: ...
  Jailbreak ASR: ... (judge v...)
  XSTest over-refusal: ...
  (+ RTP / BBQ / TruthfulQA / AIR if in scope)
Private pack: pass/fail
Verdict: ship / hold`}
        </Example>
      </LessonSection>

      <LessonSection title="Mastery recap — one line each">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Secure generation</strong> — refuse harm; do not over-refuse
            benign asks.
          </li>
          <li>
            <strong className="text-white">Completion vs chat</strong> — toxicity continuations vs refusal /
            jailbreak ASR.
          </li>
          <li>
            <strong className="text-white">ASR / refusal / over-refusal / toxicity</strong> — know which
            direction is “good.”
          </li>
          <li>
            <strong className="text-white">AIR-Bench</strong> — policy/regulatory risk categories.
          </li>
          <li>
            <strong className="text-white">HarmBench / AdvBench / JailbreakBench</strong> — red team &amp;
            jailbreak ASR.
          </li>
          <li>
            <strong className="text-white">RealToxicityPrompts</strong> — toxic completions.
          </li>
          <li>
            <strong className="text-white">TruthfulQA / BBQ</strong> — myths and demographic QA bias.
          </li>
          <li>
            <strong className="text-white">XSTest / SafetyBench / Do-Not-Answer</strong> — over-refusal,
            safety MCQ, should-not-answer.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Next steps">
        <ContentStep number={1} title="Revisit the Helpfulness track">
          <p className="text-slate-300">
            Pair every safety report with capability numbers so “safer” is not secretly “dumber” or mute.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Build a private eval pack">
          <p className="text-slate-300">
            Encode your product policy with paraphrased internal cases (never store real harmful exploit
            details in course materials). Re-run on every release.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Monitor after ship">
          <p className="text-slate-300">
            Public benchmarks lag new jailbreaks. Combine offline suites with online abuse monitoring and
            human review queues.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Shipping rule of thumb">
          Public safety benchmarks inform; private policy tests and real abuse monitoring decide. Prefer
          boring, repeated measurements over one leaderboard screenshot.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Workflow: map risks → pick suites → lock protocol → read ASR with XSTest → private pack.',
          'Always pair Secure Text Generation results with the Helpfulness track.',
          'Mastery is choosing and interpreting axes — not memorizing every paper title.',
          'Next: private policy evals, release gates, and post-ship monitoring.',
        ]}
      />
    </LessonArticle>
  )
}
