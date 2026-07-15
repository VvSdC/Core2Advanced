import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function EvaluatingAlignedModels() {
  return (
    <LessonArticle>
      <Definition term="Evaluating aligned models">
        <p>
          Alignment is only real if users (or trusted proxies) prefer the new model on the axes you care about —
          helpfulness, harmlessness, honesty — without catastrophic regressions. Training loss and “it looks
          nicer on three prompts” do not count as evaluation.
        </p>
        <p className="mt-2 text-slate-300">
          Prefer <strong className="text-white">pairwise win-rates</strong>, multi-axis checks, and an explicit
          fight against contamination and reward overfitting.
        </p>
      </Definition>

      <Callout variant="beginner" title="Eval before and after every preference run">
        Keep a frozen eval pack. Compare the candidate to the SFT (or previous) baseline with the same prompts and
        judges. Change one thing at a time when interpreting results.
      </Callout>

      <LessonSection title="Win-rate evaluations">
        <p className="text-slate-300">
          A <strong className="text-white">win-rate</strong> asks: for the same prompt, how often do judges prefer
          model A over model B? Humans remain gold; <strong className="text-white">LLM-as-judge</strong> scales
          screening when rubrics are careful and human spot-checks continue.
        </p>
        <Flowchart
          title="Pairwise evaluation"
          chart={`flowchart LR
  P[Held-out prompts] --> A[Model A answer]
  P --> B[Model B answer]
  A --> J[Human or LLM judge]
  B --> J
  J --> W[Win / lose / tie]
  W --> RATE[Win-rate summary]`}
        />
        <Example title="Reporting shape">{`Eval set: 200 product + 50 safety prompts
Candidate vs SFT baseline (blind pairwise)
Overall win-rate: 58% (ties 12%)
Safety subset: candidate preferred on refusals 71%
Honesty probes: no significant drop
→ Ship candidate behind feature flag, keep watching live feedback.`}</Example>
        <ContentStep number={1} title="Blind the judge when possible">
          <p className="text-slate-300">Hide which model wrote which answer to reduce favoritism toward verbosity.</p>
        </ContentStep>
        <ContentStep number={2} title="Separate product vs safety sets">
          <p className="text-slate-300">A model can “win” overall by being chatty while getting worse at refusals.</p>
        </ContentStep>
        <ContentStep number={3} title="Record ties honestly">
          <p className="text-slate-300">Forced winners inflate fake confidence that nothing changed.</p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Safety, refusal, and helpfulness axes">
        <p className="text-slate-300">
          Score (or pairwise-rank) along named axes instead of one vague “better”:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Helpfulness</strong> — task progress, clarity, completeness.
          </li>
          <li>
            <strong className="text-white">Harmlessness</strong> — refuses or safely redirects disallowed asks.
          </li>
          <li>
            <strong className="text-white">Honesty</strong> — uncertainty, no invented facts or fake citations.
          </li>
          <li>
            <strong className="text-white">Over-refusal</strong> — does it refuse harmless asks? Track false
            refusals too.
          </li>
        </ul>
        <Callout variant="insight" title="Tradeoffs are normal">
          Preference training often tightens safety and can increase over-refusal. Your eval must measure both
          directions, or you will celebrate a “safer” model that frustrates legitimate users.
        </Callout>
      </LessonSection>

      <LessonSection title="Contamination and reward overfitting">
        <p className="text-slate-300">
          <strong className="text-white">Contamination</strong> — eval prompts leaked into training preference or
          SFT data make wins look magical and fail in production.
        </p>
        <p className="mt-3 text-slate-300">
          <strong className="text-white">Reward / judge overfitting</strong> — the model learns quirks that impress
          your judge (or reward model) without helping users: excessive hedging, length hacking, keyword stuffing
          that matches the rubric.
        </p>
        <Flowchart
          title="Watch for fake progress"
          chart={`flowchart TB
  TRAIN[Preference train] --> MET[Eval win-rate rises]
  MET --> Q{Eval prompts leak?}
  Q -->|Yes| BAD[Contamination — not real]
  Q -->|No| Q2{Judge / reward quirks?}
  Q2 -->|Yes| HACK[Reward overfitting]
  Q2 -->|No| Q3{Humans agree on holdout?}
  Q3 -->|Yes| OK[More trustworthy gain]
  Q3 -->|No| FIX[Fix rubric / add human gold]`}
        />
      </LessonSection>

      <LessonSection title="Evaluation checklist flowchart">
        <Flowchart
          title="Aligned-model eval checklist"
          chart={`flowchart TB
  START[Candidate checkpoint] --> C1{Golden prompts frozen?}
  C1 -->|No| FIX1[Lock eval set + versions]
  C1 -->|Yes| C2[Pairwise vs baseline]
  C2 --> C3[Safety / refusal suite]
  C3 --> C4[Over-refusal / honesty probes]
  C4 --> C5{Contamination check?}
  C5 -->|Fail| STOP[Do not ship]
  C5 -->|Pass| C6[Human sample audit]
  C6 --> C7{Live canary OK?}
  C7 -->|No| ROLL[Rollback / retrain]
  C7 -->|Yes| SHIP[Promote]`}
        />
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>Version datasets, judges, prompts, and model IDs together.</li>
          <li>Never optimize only on the metric you report without a held-out human slice.</li>
          <li>Regression-test core skills after preference runs (templates, tools, domain facts you still need).</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Use pairwise win-rates (human and/or carefully calibrated LLM judges) against a baseline.',
          'Evaluate named axes: helpfulness, harmlessness, honesty, and over-refusal.',
          'Guard against contamination and reward/judge overfitting that fake progress.',
          'Follow a checklist: frozen evals → pairwise → safety → contamination → human audit → canary.',
          'Training curves are not alignment; user-grounded comparisons are.',
        ]}
      />
    </LessonArticle>
  )
}
