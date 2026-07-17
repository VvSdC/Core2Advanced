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

export function GpqaAndHardKnowledge() {
  return (
    <LessonArticle>
      <Definition term="GPQA (Graduate-Level Google-Proof Q&A)">
        <p>
          <strong className="text-white">GPQA</strong> is a hard STEM multiple-choice benchmark aimed at{' '}
          <span className="text-genai-400">graduate-level</span> biology, chemistry, and physics. Questions are
          designed so that even skilled non-experts struggle — and so that casual web search does not trivially
          reveal the answer.
        </p>
        <p className="mt-2 text-slate-300">
          Nickname meaning: “Google-proof” ≈ you cannot casually type the question into a search box and paste a
          clear gold answer in seconds.
        </p>
      </Definition>

      <Callout variant="beginner" title="What GPQA measures">
        Deep, specialist STEM knowledge and careful reasoning on difficult MCQs — far above typical school-exam
        MMLU items.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Expert-hard STEM MCQs">
          <p className="text-slate-300">
            Items target PhD-adjacent difficulty. Correct answers usually require domain concepts plus multi-step
            reasoning, not a single memorized factoid.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Why “Google-proof” matters">
          <p className="text-slate-300">
            Many older benchmarks leak into the open web. If a question’s answer is a top search hit, models (and
            humans with browsers) look smarter than they are. GPQA tries to reduce that shortcut.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Accuracy still rules">
          <p className="text-slate-300">
            The score is still <strong className="text-white">% correct</strong> on the chosen letter. Subsets
            like Diamond are even stricter filters for the hardest, best-validated items.
          </p>
        </ContentStep>
        <Flowchart
          title="Where GPQA sits vs MMLU"
          chart={`flowchart TB
  MMLU[MMLU: broad school/college MCQ]
  PRO[MMLU-Pro: harder multitask]
  GPQA[GPQA: graduate STEM, Google-proof intent]
  MMLU --> PRO
  PRO --> GPQA
  GPQA --> USE[Use when you need expert-ceiling signal]`}
        />
      </LessonSection>

      <LessonSection title="Compared to MMLU difficulty">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Aspect</th>
                <th className="px-4 py-3">MMLU</th>
                <th className="px-4 py-3">GPQA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Breadth', 'Many subjects (~57)', 'Narrow STEM focus'],
                ['Difficulty', 'School → college mix', 'Graduate / expert-hard'],
                ['Saturation', 'Top models often high', 'Still separates frontiers'],
                ['Goal', 'General knowledge map', 'Hard knowledge ceiling'],
              ].map(([aspect, mmlu, gpqa]) => (
                <tr key={aspect} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-genai-400">{aspect}</td>
                  <td className="px-4 py-3">{mmlu}</td>
                  <td className="px-4 py-3 text-white">{gpqa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-slate-300">
          A model can crush MMLU and still look average on GPQA. That is useful: it tells you “broad recall”
          versus “expert STEM ceiling.”
        </p>
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">High</strong> — strong graduate-level STEM reasoning on hard MCQs;
            often a frontier-model signal.
          </li>
          <li>
            <strong className="text-white">Low / middling</strong> — expected for smaller or general chat models;
            not automatically “bad at everything.”
          </li>
          <li>
            Random guessing on 4-way MCQ is ~25%. Beating that by a little is not “expert.”
          </li>
        </ul>
        <Callout variant="insight" title="Human baselines matter">
          Papers often contrast expert vs non-expert humans. Use those baselines to interpret whether a model
          score is impressive or merely better than chance.
        </Callout>
      </LessonSection>

      <LessonSection title="Sample question style (paraphrased)">
        <Example title="Graduate chemistry-style item">{`Domain: Physical chemistry (paraphrased, not a real GPQA item)

A reaction's rate increases sharply with temperature in a way that
suggests a high activation energy. Which statement best fits?

A) The equilibrium constant must decrease with temperature
B) A small temperature rise can greatly accelerate the rate
C) The reaction must be endothermic and irreversible
D) Collision frequency is irrelevant compared to solvent color

Gold intent: B — activation energy links strongly to temperature sensitivity of rate.`}</Example>
      </LessonSection>

      <LessonSection title="When teams use GPQA">
        <ContentStep number={1} title="Differentiate saturated MMLU leaders">
          <p className="text-slate-300">When every release claims ~same MMLU, GPQA (and MMLU-Pro) still move.</p>
        </ContentStep>
        <ContentStep number={2} title="Science / research assistants">
          <p className="text-slate-300">Products aiming at expert STEM help need harder knowledge probes.</p>
        </ContentStep>
        <ContentStep number={3} title="Not for everyday chat QA">
          <p className="text-slate-300">Customer-support bots rarely need GPQA; use task-specific evals instead.</p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What GPQA does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Open-ended tutoring quality, diagrams, or lab skills.</li>
          <li>Coding, tool use, or multi-document research agents.</li>
          <li>Non-STEM professional knowledge (law, history) — that is closer to MMLU’s job.</li>
          <li>Live web research skill — “Google-proof” is about the questions, not browser agents.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'GPQA measures hard, graduate-level STEM MCQ accuracy with Google-proof design goals.',
          'High scores signal expert-ceiling STEM ability; low scores are normal for many chat models.',
          'It is much harder and narrower than MMLU — use both for different questions.',
          'Teams use it to separate frontier models and science-assistant candidates.',
          'It does not measure chat helpfulness, coding agents, or broad non-STEM knowledge.',
        ]}
      />
    </LessonArticle>
  )
}
