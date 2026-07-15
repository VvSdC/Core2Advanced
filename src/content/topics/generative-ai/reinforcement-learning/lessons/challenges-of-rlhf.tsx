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

export function ChallengesOfRlhf() {
  return (
    <LessonArticle>
      <Definition term="Challenges of RLHF">
        <p>
          <strong className="text-white">RLHF</strong> works — and it is hard. Teams struggle with unstable training,
          the cost of human feedback, <strong className="text-white">reward hacking</strong>, and systematic biases
          like <strong className="text-white">verbosity</strong> (preferring longer answers even when short is better).
          Those pains help explain why industry often prefers <span className="font-mono text-sm text-genai-400">DPO</span>,{' '}
          <span className="font-mono text-sm text-genai-400">ORPO</span>, and related methods after SFT.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a prestigious but high-maintenance coaching academy. Graduates can be excellent. Many schools switch to
          a simpler curriculum that still uses the same preference exams — fewer moving parts, similar outcomes for a
          lot of products.
        </p>
      </Definition>

      <Callout variant="beginner" title="This lesson is honesty hour">
        Loving the InstructGPT story does not mean you must run PPO next week. Know the failure modes so you can choose
        tools with open eyes.
      </Callout>

      <LessonSection title="Instability">
        <p className="text-slate-300">
          RL adds sampling noise, RM noise, and delicate hyperparameters (KL strength, clip ranges, learning rates).
          Runs can look fine for a day then collapse into repetition or gibberish. Debugging needs sample reading, not
          only watching the reward curve climb.
        </p>
        <Flowchart
          title="Stability fail modes"
          chart={`flowchart TB
  TUNING[Many knobs] --> RUN[RL training run]
  RUN --> OK[Healthy samples]
  RUN --> COLLAPSE[Language collapse]
  RUN --> PLATEAU[No preference gains]
  COLLAPSE --> FIX[Stronger KL / smaller steps / check RM]
  PLATEAU --> FIX2[Weaker KL / better prefs / RM quality]`}
        />
      </LessonSection>

      <LessonSection title="Cost of humans">
        <ContentStep number={1} title="Labeling is a product">
          <p className="text-slate-300">
            Writing rubrics, training annotators, auditing quality, and handling disagreement is real operational
            work — often the bottleneck, not GPU math.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Iteration speed">
          <p className="text-slate-300">
            Every time product values shift (new refusal policy, new tone), you may need fresh preferences. Human
            loops are slow compared with editing an SFT dataset.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Expertise domains">
          <p className="text-slate-300">
            Medical, legal, or safety-critical content needs specialists. Scaling that crowd is expensive.
          </p>
        </ContentStep>
        <Callout variant="insight" title="Automate carefully">
          AI judges reduce cost but can inherit biases. Use them as amplifiers with human spot-checks, not as silent
          replacements for all taste.
        </Callout>
      </LessonSection>

      <LessonSection title="Reward hacking and verbosity bias">
        <p className="text-slate-300">
          <strong className="text-white">Reward hacking</strong> means the policy exploits the scorer’s weaknesses.
          <strong className="text-white"> Verbosity bias</strong> is a common flavor: longer answers win rater clicks
          or RM points even when users wanted a crisp paragraph.
        </p>
        <Example title="What hacking can look like">{`Symptoms:
- Answers inflate with polite fluff
- Excessive apologies or fake certainty
- Odd phrases that boost RM but annoy humans
- Safe-sounding refusals that dodge legitimate asks

Defense:
- Human eval sets outside the training loop
- Length penalties / length-controlled comparisons
- Diverse prompts and adversarial evals`}</Example>
        <Flowchart
          title="Score up ≠ product up"
          chart={`flowchart LR
  POL[Policy] --> RM[RM score ↑]
  RM --> Q{Users happier?}
  Q -->|Yes| WIN[Real alignment gain]
  Q -->|No| HACK[Reward hacking / bias]`}
        />
      </LessonSection>

      <LessonSection title="Why industry often prefers DPO / ORPO afterward">
        <p className="text-slate-300">
          <strong className="text-white">DPO</strong> (Direct Preference Optimization) and friends use the same
          chosen/rejected data but train the chat model more like a supervised preference loss — typically no separate
          RM + PPO loop to operate. <strong className="text-white">ORPO</strong> and similar recipes further simplify
          pipelines for some teams. Tooling, fewer failure modes, and faster iteration are the selling points.
        </p>
        <Flowchart
          title="Same prefs, simpler machinery"
          chart={`flowchart TB
  PREF[Preference pairs] --> RLHF[RLHF: RM + PPO]
  PREF --> DPO[DPO / ORPO-style]
  RLHF --> HEAVY[Heavy ops / instability risk]
  DPO --> LIGHT[Lighter training stack]
  HEAVY --> EVAL[Still need human eval]
  LIGHT --> EVAL`}
        />
        <Callout variant="tip" title="Link back to Fine-Tuning">
          The Fine-Tuning track’s preference and DPO lessons are the practical next stop for many builders after this
          conceptual RLHF tour.
        </Callout>
      </LessonSection>

      <LessonSection title="When RLHF still wins">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Complex multi-objective rewards</strong> — mixing learned RMs with many
            programmatic scores (safety filters, format tests) inside an RL loop.
          </li>
          <li>
            <strong className="text-white">Online / iterative exploration</strong> — continuously sampling novel
            answers and scoring them when you have a strong RM and mature infra.
          </li>
          <li>
            <strong className="text-white">Research and frontier labs</strong> — pushing capability/alignment edges
            with custom reward stacks.
          </li>
          <li>
            <strong className="text-white">Legacy + expertise</strong> — teams already excellent at PPO ops may keep
            winning with what they know.
          </li>
        </ul>
        <Flowchart
          title="Choosing a path (beginner guide)"
          chart={`flowchart TB
  SFT[Finished SFT] --> NEED{Need preference alignment?}
  NEED -->|No| SHIP[Evaluate and ship SFT]
  NEED -->|Yes| OPS{Have RLHF infra + team?}
  OPS -->|Usually no| DPO[Start DPO / ORPO]
  OPS -->|Yes / research needs| RLHF[RM + PPO RLHF]
  DPO --> EVAL[Human-centered eval]
  RLHF --> EVAL`}
        />
        <Callout variant="beginner" title="Balanced takeaway">
          Learn RLHF to understand the industry story and the vocabulary. Ship with the simplest method that meets your
          eval bar. Revisit full RLHF when your objectives or scale demand it.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RLHF struggles: instability, human cost, reward hacking, verbosity bias.',
          'Industry often prefers DPO/ORPO for simpler preference training after SFT.',
          'RLHF still wins for rich multi-objective rewards, online exploration, and expert RL stacks.',
          'Always judge success with humans (or trusted evals), not RM curves alone.',
        ]}
      />
    </LessonArticle>
  )
}
