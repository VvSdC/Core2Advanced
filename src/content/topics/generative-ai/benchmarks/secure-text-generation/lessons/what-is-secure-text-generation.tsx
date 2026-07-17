import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function WhatIsSecureTextGeneration() {
  return (
    <LessonArticle>
      <Definition term="Secure / safe text generation">
        <p>
          <strong className="text-white">Secure text generation</strong> (also called{' '}
          <strong className="text-white">safe generation</strong>) means an LLM{' '}
          <strong className="text-white">refuses or safely handles</strong> requests that could cause serious
          harm — while still answering <strong className="text-white">benign</strong> (harmless) questions
          helpfully. Safety is not “say no to everything”; it is the right boundary between help and harm.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a good pharmacist will not fill a forged prescription for a controlled substance, but will
          still explain how to take an over-the-counter medicine correctly.
        </p>
      </Definition>

      <Callout variant="beginner" title="One sentence version">
        Safe generation = refuse or redirect harmful asks; do not over-refuse normal, legal, everyday asks.
      </Callout>

      <LessonSection title="Refuse vs over-refuse">
        <ContentStep number={1} title="Refuse (good when the ask is harmful)">
          <p className="text-slate-300">
            The model declines to provide actionable harmful content (e.g. detailed guidance for{' '}
            <span className="font-mono text-sm text-genai-400">[harmful request category]</span>) and may offer
            a high-level refusal or a safe alternative.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Over-refuse (bad when the ask is benign)">
          <p className="text-slate-300">
            The model refuses something that should be allowed — e.g. a fiction writing tip, a chemistry homework
            question about water, or a news summary. That is{' '}
            <strong className="text-white">exaggerated safety</strong>, measured later by suites like{' '}
            <span className="text-genai-400">XSTest</span>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Under-refuse (also bad)">
          <p className="text-slate-300">
            The model complies with a clearly harmful request. Safety benchmarks try to catch this failure mode
            with red-teaming and policy-aligned risk categories.
          </p>
        </ContentStep>
        <Flowchart
          title="Safe generation decision sketch"
          chart={`flowchart TB
  A[User request] --> B{Clearly harmful?}
  B -->|Yes| C[Refuse or safe redirect]
  B -->|No / ambiguous| D{Benign intent?}
  D -->|Yes| E[Answer helpfully]
  D -->|Unclear| F[Clarify / partial safe answer]
  C --> G[Secure generation]
  E --> G
  F --> G`}
        />
      </LessonSection>

      <LessonSection title="Relation to the Helpfulness track">
        <p className="text-slate-300">
          The <strong className="text-white">Helpfulness</strong> (capability) track asks: “Can the model solve
          exams, write code, do math?” This <strong className="text-white">Secure Text Generation</strong> track
          asks a different question: “When asked something harmful, does it stay within policy?”
        </p>
        <div className="mt-4 space-y-3">
          {[
            [
              'Capability ≠ safety',
              'A model can score high on MMLU and still produce toxic or jailbroken answers. Knowledge tests do not measure refusal.',
            ],
            [
              'Both matter in products',
              'Users need correct answers and trust that the system will not assist with serious harm.',
            ],
            [
              'Tradeoff exists',
              'Pushing refusal too hard can hurt helpfulness (over-refusal). Safety evals and helpfulness evals should be read together.',
            ],
          ].map(([label, text]) => (
            <div key={label} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="mt-1 text-sm text-slate-400">{text}</p>
            </div>
          ))}
        </div>
        <Callout variant="insight" title="Jargon: red teaming">
          <strong className="text-white">Red teaming</strong> means deliberately trying to break safety — with
          adversarial or jailbreak-style prompts — so you find failures before attackers do. Benchmarks
          standardize that pressure test.
        </Callout>
      </LessonSection>

      <LessonSection title="Learning map for this subtopic">
        <p className="text-slate-300">
          You will learn foundations (completion vs chat safety, metrics like ASR and refusal), then the{' '}
          <strong className="text-white">top 10 most-used safety benchmarks</strong>, then how to pick a small
          suite for your product.
        </p>
        <Flowchart
          title="Secure Text Generation track map"
          chart={`flowchart TB
  A[1. Foundations<br/>what / completion vs chat / metrics] --> B[2. Top 10 benchmarks<br/>toxicity jailbreak bias truth over-refusal]
  B --> C[3. Synthesis<br/>map + choose suite]
  C --> D[4. Put it together<br/>checklist + next steps]`}
        />
        <ContentStep number={1} title="Foundations (you are here)">
          <p className="text-slate-300">
            What secure generation means, how completion-based vs chat-based safety evals differ, and core
            metrics: attack success rate, refusal, over-refusal, toxicity.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Top 10 benchmarks">
          <p className="text-slate-300">
            Dedicated lessons on AIR-Bench, HarmBench, AdvBench, RealToxicityPrompts, TruthfulQA, BBQ, XSTest,
            SafetyBench, JailbreakBench, and Do-Not-Answer.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Synthesis">
          <p className="text-slate-300">
            A master map, a decision flowchart for choosing a suite, and a checklist that pairs with the
            Helpfulness track.
          </p>
        </ContentStep>
        <Callout variant="beginner" title="Safety note for this course">
          Lessons never include real harmful prompts. When we show styles of evals, we use paraphrased
          placeholders like <span className="font-mono text-sm text-genai-400">[harmful request category]</span>.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Secure text generation = refuse or safely handle harmful requests without over-refusing benign ones.',
          'Capability (Helpfulness track) ≠ safety — you need both kinds of benchmarks for products.',
          'Over-refusal and under-refusal are opposite failure modes; good safety sits in the middle.',
          'Track path: Foundations → Top 10 benchmarks → Synthesis → Put it together.',
        ]}
      />
    </LessonArticle>
  )
}
