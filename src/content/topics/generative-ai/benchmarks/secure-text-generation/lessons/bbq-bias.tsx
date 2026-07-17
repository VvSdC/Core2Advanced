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

export function BbqBias() {
  return (
    <LessonArticle>
      <Definition term="BBQ (Bias Benchmark for QA)">
        <p>
          <strong className="text-white">BBQ</strong> — the{' '}
          <strong className="text-white">Bias Benchmark for Question Answering</strong> — measures whether a
          model relies on <strong className="text-white">social stereotypes</strong> when answering questions
          about people, especially when context is ambiguous or under-specified.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: two job candidates described with incomplete info — does the model invent a biased
          conclusion, or admit it lacks enough evidence?
        </p>
      </Definition>

      <Callout variant="beginner" title="What BBQ measures">
        Demographic / social bias in QA: stereotypical answers vs correctly using context (or abstaining when
        ambiguous). It is not a jailbreak or toxicity suite.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Ambiguous vs disambiguated contexts">
          <p className="text-slate-300">
            BBQ includes cases where the correct answer should be “not enough information,” and cases where
            extra context makes a non-stereotypical answer correct. Bias shows up when the model fills gaps
            with stereotypes.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Protected / social categories">
          <p className="text-slate-300">
            Items span dimensions such as age, gender identity, nationality, race/ethnicity, religion,
            socioeconomic status, sexual orientation, and related axes (exact set depends on the BBQ release).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Accuracy and bias scores">
          <p className="text-slate-300">
            Metrics track both whether answers are correct and whether errors align with stereotypical
            associations. High accuracy with low bias is the goal.
          </p>
        </ContentStep>
        <Flowchart
          title="BBQ decision sketch"
          chart={`flowchart TB
  C[Context + question] --> A{Enough evidence?}
  A -->|No — ambiguous| U[Prefer uncertain / unknown]
  A -->|Yes — disambiguated| R[Answer from evidence]
  U --> B{Model stereotypes anyway?}
  B -->|Yes| FAIL[Bias failure]
  B -->|No| OK[Good ambiguous handling]
  R --> OK2[Score vs gold]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Better BBQ profile</strong> — answers use evidence; avoids
            stereotype shortcuts on ambiguous items.
          </li>
          <li>
            <strong className="text-white">Worse BBQ profile</strong> — systematically prefers stereotypical
            options when uncertain, or ignores disambiguating context.
          </li>
          <li>
            Read ambiguity vs disambiguated splits separately — they diagnose different failure modes.
          </li>
        </ul>
        <Example title="Safe paraphrased style">
{`Ambiguous: "Two people from different demographic groups are described
with no relevant evidence. Who did [benign event]?"
Gold-leaning: not enough information

Biased model: picks the stereotype-aligned group anyway
Fairer model: refuses to invent a demographic culprit`}
        </Example>
      </LessonSection>

      <LessonSection title="What BBQ does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Toxic word generation</strong> rates (RealToxicityPrompts).
          </li>
          <li>
            <strong className="text-white">Jailbreak ASR</strong> or refusal of harmful how-tos.
          </li>
          <li>
            <strong className="text-white">Over-refusal</strong> of benign medical/history questions (XSTest).
          </li>
          <li>
            All fairness notions (hiring tools, embeddings, vision) — BBQ is QA-specific.
          </li>
        </ul>
        <Callout variant="tip" title="Product tip">
          If your assistant answers questions about people or social groups, BBQ-style checks belong in the
          safety suite even when jailbreak ASR looks great.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'BBQ = Bias Benchmark for QA — stereotype reliance under ambiguous/disambiguated contexts.',
          'Better scores: evidence-based answers and honest uncertainty; worse: stereotype shortcuts.',
          'Axis: demographic bias — complementary to toxicity and jailbreak metrics.',
          'Does not measure ASR, toxicity completion, or over-refusal.',
        ]}
      />
    </LessonArticle>
  )
}
