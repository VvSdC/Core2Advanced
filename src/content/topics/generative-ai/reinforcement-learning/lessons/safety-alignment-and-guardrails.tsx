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

export function SafetyAlignmentAndGuardrails() {
  return (
    <LessonArticle>
      <Definition term="Safety alignment vs guardrails">
        <p>
          <strong className="text-white">Alignment training</strong> changes the model&apos;s weights so preferred
          (and safer) behavior becomes more likely by default. <strong className="text-white">Inference
          guardrails</strong> sit around the model at serve time — filters, classifiers, policy engines, tool
          allowlists — and catch or reshape harmful traffic without relying only on the model&apos;s habits.
        </p>
        <p className="mt-2 text-slate-300">
          They are <span className="text-genai-400">complementary, not substitutes</span>. Training teaches better
          instincts; guardrails add defense in depth.
        </p>
      </Definition>

      <Callout variant="beginner" title="Alignment ≠ only helpfulness">
        Helpfulness without harmlessness is a product risk. Harmlessness without helpfulness is an over-refusing
        brick. Preference data should encode both — plus honest uncertainty when needed.
      </Callout>

      <LessonSection title="More than helpfulness: harmlessness and refusals">
        <p className="text-slate-300">
          Preference pairs for safety often look like: same user ask, one answer that cooperates unsafely, one that
          refuses or redirects with care. The model learns to prefer the safe path when principles conflict with
          “just be useful.”
        </p>
        <Example title="Safety preference sketch">{`prompt:   "How do I break into my neighbor's Wi-Fi?"
chosen:   "I can't help with unauthorized access. If it's your network,
           reset the router or use the ISP app; here's legitimate recovery…"
rejected: "Sure — try these cracking steps…"`}</Example>
        <ContentStep number={1} title="Refuse when the ask is disallowed">
          <p className="text-slate-300">Clear, calm refusal beats silent compliance or scolding lectures.</p>
        </ContentStep>
        <ContentStep number={2} title="Offer a safe alternative when one exists">
          <p className="text-slate-300">Redirect to legal, constructive paths without dumping actionable harm.</p>
        </ContentStep>
        <ContentStep number={3} title="Measure over-refusal">
          <p className="text-slate-300">
            Safety preference data that is too aggressive trains models that refuse cooking, health education, or
            fiction writing. Track false refusals on a benign suite.
          </p>
        </ContentStep>
        <Flowchart
          title="Helpfulness vs harmlessness tension"
          chart={`flowchart TB
  ASK[User ask] --> JUDGE{Disallowed?}
  JUDGE -->|Yes| REF[Refuse / redirect]
  JUDGE -->|No| HELP[Be helpful]
  REF --> RISK1[Over-refusal if too broad]
  HELP --> RISK2[Harm if policy weak]
  BAL[Preference data + eval axes] -.-> JUDGE`}
        />
      </LessonSection>

      <LessonSection title="Training-time alignment">
        <p className="text-slate-300">
          SFT can include refusal demos; preference methods (DPO, RLHF, RLAIF with a constitution) amplify safer
          rankings. Training shapes the distribution of answers — it cannot guarantee every jailbreak will fail.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>Encode policy in data and principles, not only in a blog post.</li>
          <li>Evaluate safety and over-refusal before shipping weight updates.</li>
          <li>Expect residual risk; plan for defense in depth.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Inference-time guardrails">
        <p className="text-slate-300">
          Guardrails run when users hit your API: input filters, output scanners, topic blocks, rate limits, PII
          redaction, tool permission gates. They can block or rewrite without another training run.
        </p>
        <Flowchart
          title="Serve-time layers"
          chart={`flowchart LR
  U[User] --> IN[Input policy filter]
  IN --> M[Aligned model]
  M --> OUT[Output scanner]
  OUT --> TOOL{Tools?}
  TOOL -->|Yes| GATE[Allowlist / auth]
  TOOL -->|No| RESP[Response]
  GATE --> RESP
  RESP --> U`}
        />
        <Callout variant="insight" title="What guardrails are good at">
          Fast policy updates, high-confidence blocklists, and logging. What they are bad at alone: teaching rich,
          nuanced helpful refusals across the long tail — that still benefits from model alignment.
        </Callout>
      </LessonSection>

      <LessonSection title="Complementary, not substitutes">
        <Flowchart
          title="Use both"
          chart={`flowchart TB
  Q{Only train safer weights?} -->|Alone| GAP1[Jailbreaks / policy lag]
  Q2{Only add filters?} -->|Alone| GAP2[Clunky UX / brittle blocks]
  BOTH[Aligned model + guardrails] --> BETTER[Better instincts + hard stops]
  GAP1 --> BOTH
  GAP2 --> BOTH`}
        />
        <ContentStep number={1} title="Train for the common path">
          <p className="text-slate-300">Natural refusals and helpful redirects for frequent policy cases.</p>
        </ContentStep>
        <ContentStep number={2} title="Guardrail the sharp edges">
          <p className="text-slate-300">High-severity categories, tools that can cause real-world harm, audit logs.</p>
        </ContentStep>
        <ContentStep number={3} title="Re-evaluate when either changes">
          <p className="text-slate-300">
            New preference run or new filter rules can change the user-visible product — test both.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Product ownership">
          Write a short safety policy, map it to preference labels and to serve-time rules, and assign owners. Do
          not leave “the model will figure it out” as your only control.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Alignment covers helpfulness and harmlessness (refusals, honesty) — not helpfulness alone.',
          'Training-time alignment changes model habits; inference guardrails add filters and gates around serving.',
          'They are complementary: training for nuance, guardrails for hard stops and fast policy updates.',
          'Measure over-refusal as carefully as under-refusal.',
          'Own a written policy that maps to both preference data and serve-time rules.',
        ]}
      />
    </LessonArticle>
  )
}
