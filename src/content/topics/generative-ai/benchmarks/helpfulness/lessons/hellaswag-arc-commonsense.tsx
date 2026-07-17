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

export function HellaswagArcCommonsense() {
  return (
    <LessonArticle>
      <Definition term="Commonsense benchmarks (HellaSwag, ARC, Winogrande)">
        <p>
          These suites test whether a model can finish everyday situations, answer basic science questions, or
          resolve ambiguous pronouns using <span className="text-genai-400">ordinary world knowledge</span> —
          the kind of “obvious to humans” reasoning that is not a PhD exam.
        </p>
        <p className="mt-2 text-slate-300">
          They sit beside MMLU, not inside it: MMLU is professional/school knowledge; these are everyday and
          grade-school science intuition.
        </p>
      </Definition>

      <Callout variant="beginner" title="What “commonsense” means for LLMs">
        Predicting what usually happens next, what a pronoun refers to, or which science fact fits a simple
        scenario — without needing a specialist degree.
      </Callout>

      <LessonSection title="HellaSwag — sentence completion">
        <ContentStep number={1} title="What it measures">
          <p className="text-slate-300">
            Given a short story setup, pick the most plausible ending among several options. Wrong endings are
            written to look fluent but absurd or unlikely.
          </p>
        </ContentStep>
        <ContentStep number={2} title="High vs low">
          <p className="text-slate-300">
            <strong className="text-white">High</strong> ≈ better at everyday situation prediction.{' '}
            <strong className="text-white">Low</strong> ≈ distracted by fluent nonsense endings.
          </p>
        </ContentStep>
        <Example title="HellaSwag-style item (paraphrased)">{`Context: A person kneels, ties both shoelaces, then stands up holding a backpack.

Most plausible next sentence?
A) They sprout wings and fly through the ceiling tiles.
B) They walk toward the door, ready to leave for school.
C) They dissolve into mist because shoelaces cancel gravity.
D) The backpack files a tax return on their behalf.

Gold intent: B`}</Example>
      </LessonSection>

      <LessonSection title="ARC — AI2 Reasoning Challenge">
        <p className="text-slate-300">
          <strong className="text-white">ARC</strong> is grade-school science QA (often multiple choice). The{' '}
          <span className="text-genai-400">Challenge</span> split is harder than the Easy split — designed to
          need reasoning beyond shallow word matching.
        </p>
        <ContentStep number={1} title="What it measures">
          <p className="text-slate-300">
            Science facts and light causal reasoning at roughly elementary/middle-school level — not GPQA
            graduate physics.
          </p>
        </ContentStep>
        <ContentStep number={2} title="High vs low">
          <p className="text-slate-300">
            High Challenge accuracy suggests solid basic science reasoning; low may mean weak grounding or
            brittle multi-hop reading.
          </p>
        </ContentStep>
        <Example title="ARC-style item (paraphrased)">{`Why does a metal spoon in hot soup become hot?

A) Heat transfers from the soup into the spoon
B) The spoon creates its own heat by thinking
C) Magnets in the kitchen pull warmth into metal
D) Soup reflects light that cools the spoon

Gold: A`}</Example>
      </LessonSection>

      <LessonSection title="Winogrande (brief)">
        <p className="text-slate-300">
          <strong className="text-white">Winogrande</strong> is a large Winograd-schema-style pronoun task: two
          nearly identical sentences; pick which entity a pronoun refers to. It stresses subtle world knowledge
          and linguistic cueing, not encyclopedia recall.
        </p>
        <Example title="Winogrande-style (paraphrased)">{`The trophy does not fit in the suitcase because it is too large.
What is too large?

A) the trophy
B) the suitcase

(Variant flips size adjectives to change the answer.)`}</Example>
        <Callout variant="tip" title="Why it still matters">
          Even strong models can stumble on carefully adversarially filtered pronoun items — a reminder that
          fluency ≠ robust reference resolution.
        </Callout>
      </LessonSection>

      <LessonSection title="How these differ from MMLU">
        <Flowchart
          title="Knowledge vs everyday intuition"
          chart={`flowchart TB
  MMLU[MMLU: exams / professional topics]
  COMM[HellaSwag / Winogrande: everyday situations]
  ARC[ARC: grade-school science QA]
  MMLU --> PRO[Specialist & school knowledge]
  COMM --> LIFE[Daily physical & social intuition]
  ARC --> SCI[Basic science facts + light reasoning]`}
        />
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Ace MMLU law/medicine items and still fail a silly HellaSwag ending if “commonsense” is weak.
          </li>
          <li>
            Ace HellaSwag and still fail GPQA — different ceilings entirely.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="What these do NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Professional depth (that is MMLU / GPQA territory).</li>
          <li>Code correctness, agent planning, or long-document research.</li>
          <li>Politeness, multi-turn helpfulness, or safety refusals.</li>
          <li>Up-to-the-minute world events.</li>
        </ul>
        <Callout variant="insight" title="Saturation note">
          On some older commonsense sets, modern LLMs score very high. Treat them as sanity checks or
          historical baselines unless you use harder filtered variants.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'HellaSwag tests plausible everyday sentence completions.',
          'ARC tests grade-school science QA; Challenge is the harder split.',
          'Winogrande probes pronoun / referential commonsense.',
          'High scores mean stronger everyday intuition — not professional expertise.',
          'These are not substitutes for MMLU, coding, or chat-preference evals.',
        ]}
      />
    </LessonArticle>
  )
}
