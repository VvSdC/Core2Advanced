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

export function PuttingItTogetherBenchmarking() {
  return (
    <LessonArticle>
      <Definition term="Putting it together — helpfulness benchmarking">
        <p>
          You now have a toolkit of public suites. Mastery is knowing{' '}
          <strong className="text-white">how to choose, run, and interpret</strong> them for a real product —
          not memorizing every dataset name.
        </p>
        <p className="mt-2 text-slate-300">
          This lesson is a checklist + decision tree, then a short mastery recap and pointers to what comes
          next.
        </p>
      </Definition>

      <Callout variant="beginner" title="The four-step habit">
        Pick axes → pick benchmarks → fix the eval setup → interpret honestly (with a private set always in the
        mix).
      </Callout>

      <LessonSection title="Checklist: from axes to interpretation">
        <ContentStep number={1} title="Pick axes">
          <p className="text-slate-300">
            Write the skills that matter: knowledge? code? math? tricky reasoning? chat preference? Be
            ruthless — measure what shipping depends on.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Pick benchmarks">
          <p className="text-slate-300">
            Map axes to suites (see the map lesson): MMLU/GPQA, HumanEval/MBPP/SWE-bench, GSM8K/MATH, BBH,
            plus preference evals for open chat.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Fix the eval setup">
          <p className="text-slate-300">
            Lock harness version, prompts, shots, temperature, tools, agent scaffold, and subset. Document them
            next to every number you share.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Interpret">
          <p className="text-slate-300">
            High/low only means something relative to baselines and protocols. Cross-check with private tasks
            and user feedback before celebrating.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Decision tree for product teams">
        <Flowchart
          title="What should we run?"
          chart={`flowchart TB
  P[Product goal] --> Q1{Users need correct facts / exams?}
  Q1 -->|Yes| K[MMLU ± Pro; GPQA if expert STEM]
  Q1 -->|No| Q2
  P --> Q2{Ship coding help?}
  Q2 -->|Autocomplete / synth| HE[HumanEval + MBPP]
  Q2 -->|Issue fixing agent| SWE[SWE-bench + private repos]
  P --> Q3{Math tutoring or quant reasoning?}
  Q3 -->|Yes| M[GSM8K and/or MATH-500]
  P --> Q4{Claim general hard reasoning?}
  Q4 -->|Yes| BBH[Add BBH]
  P --> Q5{Open-ended chat quality?}
  Q5 -->|Yes| PREF[Preference / Arena + rubric judges]
  K --> PRIV[Always: private product eval pack]
  HE --> PRIV
  SWE --> PRIV
  M --> PRIV
  BBH --> PRIV
  PREF --> PRIV`}
        />
        <Example title="Example pack for a coding tutor app">{`Public: MBPP + HumanEval (smoke) + small SWE-bench Lite sample
Private: 100 course homework prompts with unit tests
Chat: 50 pairwise prefs on explanation clarity
Safety: separate refusal pack (later track)
Protocol: temp 0.2 for pass@1; document agent tools if used`}</Example>
      </LessonSection>

      <LessonSection title="Mastery recap — one line each">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">MMLU</strong> — broad MCQ knowledge; not chat quality.
          </li>
          <li>
            <strong className="text-white">GPQA</strong> — hard Google-proof STEM; expert ceiling.
          </li>
          <li>
            <strong className="text-white">HellaSwag / ARC / Winogrande</strong> — everyday commonsense & school
            science.
          </li>
          <li>
            <strong className="text-white">HumanEval / MBPP</strong> — short Python correctness (pass@k).
          </li>
          <li>
            <strong className="text-white">SWE-bench</strong> — real issues → patches; system + model.
          </li>
          <li>
            <strong className="text-white">GSM8K / MATH</strong> — word-problem vs contest math.
          </li>
          <li>
            <strong className="text-white">BBH</strong> — diverse hard reasoning tasks.
          </li>
          <li>
            <strong className="text-white">Limitations</strong> — contamination, gaming, Arena vs static.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Next steps">
        <ContentStep number={1} title="Safety and alignment evals">
          <p className="text-slate-300">
            Helpfulness without harmlessness is incomplete. Expect dedicated safety / refusal / jailbreak
            evaluation in later evaluation tracks.
          </p>
        </ContentStep>
        <ContentStep number={2} title="RAG evaluation (already in RAG track)">
          <p className="text-slate-300">
            Retrieval quality, faithfulness, and groundedness are separate from MMLU-style knowledge. If your
            product is RAG-first, prioritize those metrics alongside this map.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Keep a living eval pack">
          <p className="text-slate-300">
            Revisit axes when the product changes. Retire saturated suites; add harder or private ones.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Shipping rule of thumb">
          Public benchmarks inform; private product evals decide. Prefer boring, repeated measurements over
          one flashy leaderboard screenshot.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Workflow: pick axes → pick benchmarks → lock setup → interpret with private sets.',
          'Use the decision tree to match suites to product jobs (code, math, knowledge, chat).',
          'Mastery is choosing and reading benchmarks — not chasing every leaderboard.',
          'Next: safety/eval tracks; reuse RAG evals if your stack retrieves documents.',
          'Helpfulness numbers are evidence, not a substitute for user outcomes.',
        ]}
      />
    </LessonArticle>
  )
}
