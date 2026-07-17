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

export function AirBench() {
  return (
    <LessonArticle>
      <Definition term="Stanford AIR-Bench (AIR 2024)">
        <p>
          <strong className="text-white">AIR-Bench</strong> (from Stanford&apos;s{' '}
          <strong className="text-white">AI Risk</strong> work, often linked with the{' '}
          <span className="text-genai-400">AIR 2024</span> risk taxonomy) evaluates whether models respect{' '}
          <strong className="text-white">policy- and regulation-aligned risk categories</strong> — not just
          generic “toxicity,” but structured risks that map to how governments and labs think about AI harm.
        </p>
        <p className="mt-2 text-slate-300">
          Think of it as a checklist exam organized by risk types (security, privacy, misinformation-adjacent
          harms, and other policy buckets) rather than a single toxicity score.
        </p>
      </Definition>

      <Callout variant="beginner" title="What AIR-Bench measures">
        Whether the model handles prompts in AIR-style risk categories safely — aligned with regulatory /
        policy risk taxonomies — typically via refusal or safe handling under a fixed evaluation protocol.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Risk categories, not one number in isolation">
          <p className="text-slate-300">
            Items are grouped by <strong className="text-white">AIR risk categories</strong>. You care about
            per-category behavior as much as an overall rate — a model can look fine on average and fail one
            high-stakes bucket.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Policy / regulatory framing">
          <p className="text-slate-300">
            Categories are designed to map toward risks discussed in AI governance (e.g. misuse potential,
            privacy, security-related assistance). That makes AIR-Bench useful when your compliance story must
            go beyond “low toxicity.”
          </p>
        </ContentStep>
        <ContentStep number={3} title="Chat / instruction-style evaluation">
          <p className="text-slate-300">
            Prompts are typically instruction- or chat-style asks about{' '}
            <span className="font-mono text-sm text-genai-400">[harmful request category]</span>, scored for
            unsafe compliance vs safe refusal / handling.
          </p>
        </ContentStep>
        <Flowchart
          title="AIR-Bench evaluation sketch"
          chart={`flowchart LR
  T[AIR risk taxonomy] --> P[Prompts per category]
  P --> M[Model reply]
  M --> J[Safety / policy judge]
  J --> R[Per-category + overall rates]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Higher safety / lower unsafe rate</strong> — the model more often
            refuses or safely handles policy-aligned risky asks across categories.
          </li>
          <li>
            <strong className="text-white">Lower safety / higher unsafe rate</strong> — more unsafe compliance
            in one or more AIR categories; investigate which buckets fail.
          </li>
          <li>
            Always read <strong className="text-white">per-category</strong> results. A single headline number
            can hide a catastrophic gap in one risk type.
          </li>
        </ul>
        <Example title="Safe placeholder item style">
{`Category: [policy-aligned risk bucket]
User ask: paraphrased request in that bucket
  "[harmful request category] — detailed actionable steps?"

Desired: refuse or high-level non-actionable guidance only
Undesired: concrete assistance that enables the risk`}
        </Example>
      </LessonSection>

      <LessonSection title="What AIR-Bench does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Open-ended toxic completion</strong> from web-style prefixes
            (see RealToxicityPrompts).
          </li>
          <li>
            <strong className="text-white">Over-refusal on benign asks</strong> (see XSTest).
          </li>
          <li>
            <strong className="text-white">Demographic bias in QA</strong> (see BBQ) or{' '}
            <strong className="text-white">truthfulness</strong> under misconceptions (see TruthfulQA).
          </li>
          <li>
            Your company&apos;s private policy wording — AIR is a shared taxonomy, not your legal memo.
          </li>
        </ul>
        <Callout variant="insight" title="When to run AIR-Bench">
          Use it when stakeholders ask about governance-aligned risk coverage. Pair with a jailbreak suite and
          XSTest so you do not optimize only for category refusals.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'AIR-Bench evaluates policy/regulatory-aligned AI risk categories (AIR 2024-style taxonomy).',
          'High safety / low unsafe rates are good; always inspect per-category gaps.',
          'It is chat/instruction-oriented — not a completion-toxicity suite.',
          'Does not measure over-refusal, bias QA, or truthfulness by itself.',
        ]}
      />
    </LessonArticle>
  )
}
