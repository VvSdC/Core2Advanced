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

export function RealToxicityPrompts() {
  return (
    <LessonArticle>
      <Definition term="RealToxicityPrompts">
        <p>
          <strong className="text-white">RealToxicityPrompts</strong> is a{' '}
          <strong className="text-white">completion-based</strong> benchmark: the model is given real (or
          real-looking) web-derived prompt prefixes and asked to continue them. Scoring focuses on{' '}
          <strong className="text-white">toxic language</strong> in the continuation — insults, hate, threats,
          and related toxicity categories via a classifier.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: give someone the first half of a noisy internet comment and see whether they finish it in a
          civil way or pour gasoline on the fire.
        </p>
      </Definition>

      <Callout variant="beginner" title="What RealToxicityPrompts measures">
        Tendency to produce toxic continuations when prompted with challenging real-world text prefixes. Lower
        toxicity metrics are safer for open-ended generation.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Prompt prefixes from the wild">
          <p className="text-slate-300">
            Prompts are sentence beginnings that historically correlated with toxic endings. The model must
            generate a continuation (often with sampling).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Toxicity classifiers score outputs">
          <p className="text-slate-300">
            Tools in the Perspective API family (or similar) assign toxicity probabilities. Papers report
            expected maximum toxicity, toxicity probability, or rates above a threshold.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Completion setting matters">
          <p className="text-slate-300">
            This is <strong className="text-white">not</strong> primarily a chat refusal test. It probes what
            unconstrained or lightly constrained generation does when the prefix nudges toward toxicity.
          </p>
        </ContentStep>
        <Flowchart
          title="RealToxicityPrompts flow"
          chart={`flowchart LR
  P[Web-style prompt prefix] --> M[Model continuation]
  M --> C[Toxicity classifier]
  C --> S[Toxicity metrics aggregate]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Lower toxicity</strong> — safer continuations under those prefixes;
            better for public-facing generation APIs.
          </li>
          <li>
            <strong className="text-white">Higher toxicity</strong> — model often completes in toxic ways;
            concerning for open autocomplete and creative completion products.
          </li>
          <li>
            Sampling temperature and number of samples change expected-max toxicity — match protocols when
            comparing.
          </li>
        </ul>
        <Example title="Safe placeholder — continuation style">
{`Prefix (paraphrased): "After the argument online, someone wrote: [heated fragment]..."

Eval: generate N continuations, score each with a toxicity classifier
Safer: low toxicity probability across samples
We never paste real highly toxic source text in this course.`}
        </Example>
      </LessonSection>

      <LessonSection title="What RealToxicityPrompts does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Jailbreak resistance</strong> on chat assistants (HarmBench /
            JailbreakBench / AdvBench).
          </li>
          <li>
            <strong className="text-white">Policy category coverage</strong> like AIR-Bench&apos;s regulatory
            taxonomy.
          </li>
          <li>
            <strong className="text-white">Bias in multiple-choice QA</strong> (BBQ) or{' '}
            <strong className="text-white">truthfulness</strong> (TruthfulQA).
          </li>
          <li>
            Whether the model politely refuses a direct harmful ask — that is a chat metric.
          </li>
        </ul>
        <Callout variant="tip" title="When beginners should run it">
          If you ship completion / autocomplete / story continuation, include RealToxicityPrompts-style checks.
          If you only ship a tightly system-prompted chatbot, prioritize chat ASR suites first — but toxicity
          still helps for free-form answer bodies.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RealToxicityPrompts is completion-based: continue web-style prefixes, score toxicity.',
          'Lower toxicity metrics = safer open-ended generation under those prompts.',
          'Classifier-based scoring — protocol (samples, temperature) must match for fair compares.',
          'Does not measure jailbreaks, over-refusal, bias QA, or full policy taxonomies.',
        ]}
      />
    </LessonArticle>
  )
}
