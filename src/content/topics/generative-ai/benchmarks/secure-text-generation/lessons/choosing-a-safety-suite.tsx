import {
  Callout,
  CodeBlock,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function ChoosingASafetySuite() {
  return (
    <LessonArticle>
      <Definition term="Safety suite">
        <p>
          A <strong className="text-white">safety suite</strong> is a small, deliberate set of secure-generation
          benchmarks you run together so you see refusal robustness, over-refusal, and (when needed) toxicity,
          bias, and truthfulness — not a single vanity metric.
        </p>
      </Definition>

      <Callout variant="beginner" title="Minimal suite for beginners">
        Start with <span className="text-genai-400">Do-Not-Answer</span> +{' '}
        <span className="text-genai-400">HarmBench</span> (or JailbreakBench) +{' '}
        <span className="text-genai-400">XSTest</span>. Add RealToxicityPrompts if you ship free-form
        completion.
      </Callout>

      <LessonSection title="Decision flowchart by product risk">
        <Flowchart
          title="Choose suites from the product"
          chart={`flowchart TB
  P[What are you shipping?] --> C{Chat assistant?}
  C -->|Yes| DNA[Do-Not-Answer]
  DNA --> JB[HarmBench or JailbreakBench]
  JB --> XS[XSTest]
  C -->|Completion / autocomplete API| RTP[RealToxicityPrompts]
  P --> G{Governance / policy report?}
  G -->|Yes| AIR[Add AIR-Bench]
  P --> SO{Answers about social groups?}
  SO -->|Yes| BBQ[Add BBQ]
  P --> MY{Myth-prone advice domain?}
  MY -->|Yes| TQA[Add TruthfulQA]
  P --> KN{Want MCQ safety breadth?}
  KN -->|Yes| SB[Add SafetyBench]
  XS --> PRIV[Always: private policy pack]
  RTP --> PRIV
  AIR --> PRIV
  BBQ --> PRIV
  TQA --> PRIV
  SB --> PRIV`}
        />
      </LessonSection>

      <LessonSection title="Minimal suite explained">
        <ContentStep number={1} title="Do-Not-Answer — should-not-answer smoke test">
          <p className="text-slate-300">
            Cheap signal: does the model refuse or safely redirect on questions that must not get harmful
            answers?
          </p>
        </ContentStep>
        <ContentStep number={2} title="HarmBench / JailbreakBench — robustness">
          <p className="text-slate-300">
            Direct asks are not enough. Measure <strong className="text-white">ASR</strong> under standardized
            attacks. Pick one framework first; expand later.
          </p>
        </ContentStep>
        <ContentStep number={3} title="XSTest — do not break helpfulness">
          <p className="text-slate-300">
            After you lower ASR, check you did not create exaggerated safety. Over-refusal destroys product
            trust.
          </p>
        </ContentStep>
        <CodeBlock title="Beginner suite (mental checklist)">{`minimal_chat_safety = [
  "Do-Not-Answer",       # should-not-answer refusals
  "HarmBench|JailbreakBench",  # ASR / robust refusal
  "XSTest",              # over-refusal check
]

add_if_completion_api = ["RealToxicityPrompts"]`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="When to expand">
        <div className="mt-2 space-y-3">
          {[
            ['AIR-Bench', 'Stakeholders need policy/regulatory risk category reporting.'],
            ['AdvBench', 'You are reproducing or comparing academic jailbreak attack papers.'],
            ['BBQ', 'Product answers questions about people / social groups.'],
            ['TruthfulQA', 'Health, science, or other myth-heavy domains.'],
            ['SafetyBench', 'You want a broad MCQ safety-knowledge regression signal.'],
          ].map(([label, text]) => (
            <div key={label} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="mt-1 text-sm text-slate-400">{text}</p>
            </div>
          ))}
        </div>
        <Example title="Example packs" caption="Still keep a private policy set.">
{`Open chat bot:
  Do-Not-Answer + JailbreakBench + XSTest + private red-team pack

Autocomplete API:
  RealToxicityPrompts + light chat refusal pack + private prompts

Regulated enterprise assistant:
  Minimal chat suite + AIR-Bench + BBQ + TruthfulQA`}
        </Example>
      </LessonSection>

      <LessonSection title="Lock the protocol">
        <p className="text-slate-300">
          Safety numbers move when you change judges, attack sets, temperature, or system prompts. Document
          the harness the same way you would for HumanEval.
        </p>
        <Callout variant="insight" title="Product first">
          Choose suites from user risk and interaction shape (completion vs chat), not from whichever paper
          trended this week.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Beginner chat safety suite: Do-Not-Answer + HarmBench/JailbreakBench + XSTest.',
          'Add RealToxicityPrompts for completion APIs; add AIR/BBQ/TruthfulQA/SafetyBench by risk.',
          'Use the decision flowchart: product risk → suites → always a private policy pack.',
          'Lock judges and protocols before comparing models.',
        ]}
      />
    </LessonArticle>
  )
}
