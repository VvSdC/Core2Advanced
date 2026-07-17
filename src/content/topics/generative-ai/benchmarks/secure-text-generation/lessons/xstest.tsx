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

export function Xstest() {
  return (
    <LessonArticle>
      <Definition term="XSTest">
        <p>
          <strong className="text-white">XSTest</strong> evaluates{' '}
          <strong className="text-white">exaggerated safety</strong>: does the model{' '}
          <strong className="text-white">over-refuse</strong> benign prompts that merely look sensitive, while
          still (separately) checking that it does not under-refuse clearly unsafe asks?
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a metal detector that screams at pocket change. You wanted security; you got a queue of
          angry travelers. XSTest measures that “false alarm” problem for LLMs.
        </p>
      </Definition>

      <Callout variant="beginner" title="What XSTest measures">
        Balance between safety and helpfulness: over-refusal on safe prompts vs appropriate refusal on unsafe
        ones. Critical when teams harden models after jailbreak failures.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Safe prompts that look scary">
          <p className="text-slate-300">
            Examples (paraphrased categories only): fiction writing, historical discussion, technical
            explanations without actionable harm, or idioms that contain sensitive words. The correct behavior
            is usually to <strong className="text-white">answer</strong>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Unsafe contrast prompts">
          <p className="text-slate-300">
            A paired set asks for content in{' '}
            <span className="font-mono text-sm text-genai-400">[harmful request category]</span> where refusal
            is appropriate. This keeps you from gaming “always say yes.”
          </p>
        </ContentStep>
        <ContentStep number={3} title="Over-refusal vs under-refusal rates">
          <p className="text-slate-300">
            Headline reading: high refusal on safe set = over-refusal problem; low refusal on unsafe set =
            under-refusal problem. You want low over-refusal and high appropriate refusal.
          </p>
        </ContentStep>
        <Flowchart
          title="XSTest reading guide"
          chart={`flowchart TB
  S[Safe-looking prompt] --> R1{Model refuses?}
  R1 -->|Yes| OR[Over-refusal — bad]
  R1 -->|No — helpful answer| OK1[Good]
  U[Clearly unsafe prompt] --> R2{Model refuses?}
  R2 -->|Yes| OK2[Good safety]
  R2 -->|No — complies| UR[Under-refusal — bad]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">High over-refusal</strong> — model is overly cautious; users get
            pointless “I can&apos;t help with that” on benign tasks.
          </li>
          <li>
            <strong className="text-white">Low over-refusal + solid unsafe refusals</strong> — healthier
            safety–helpfulness balance.
          </li>
          <li>
            Improving HarmBench ASR by blanket refusal often <strong className="text-white">worsens</strong>{' '}
            XSTest — watch both.
          </li>
        </ul>
        <Example title="Safe placeholder contrast">
{`Safe (should answer): "Explain the chemistry of water for homework."
Unsafe (should refuse actionable help): "[harmful request category] detailed steps"

Over-refuse: rejects the homework
Under-refuse: complies with the unsafe ask`}
        </Example>
      </LessonSection>

      <LessonSection title="What XSTest does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Full <strong className="text-white">jailbreak robustness</strong> under strong optimizers
            (HarmBench / JailbreakBench).
          </li>
          <li>
            <strong className="text-white">Toxicity continuation</strong> or <strong className="text-white">BBQ
            bias</strong>.
          </li>
          <li>
            Nuanced legal compliance for every jurisdiction — it is a research probe for exaggerated safety.
          </li>
        </ul>
        <Callout variant="insight" title="Tradeoff lesson">
          Safety metrics without XSTest encourage “refuse everything.” Always pair ASR-focused suites with an
          over-refusal check.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'XSTest measures exaggerated safety: over-refusal on benign prompts vs under-refusal on unsafe ones.',
          'High over-refusal hurts helpfulness; fix safety without blanket refusals.',
          'Pair XSTest with HarmBench/JailbreakBench when hardening chat models.',
          'Does not replace full jailbreak, toxicity, or bias evaluations.',
        ]}
      />
    </LessonArticle>
  )
}
