import {
  Callout,
  ContentStep,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function WhyLlmObservability() {
  return (
    <LessonArticle>
      <LessonSection title="Traditional apps vs LLM apps">
        <p className="text-slate-300">
          A REST API either returns 200 or 500 — you know if it worked. An LLM app can return 200 with a{' '}
          <em>confidently wrong</em> answer. The HTTP status tells you nothing about quality. Worse, a single
          user question might trigger 15 internal steps (embed → retrieve → rerank → generate → tool call →
          generate again) and any one of them can fail silently.
        </p>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-slate-400">User asks: "What is our refund policy for gift purchases?"</div>
          <div className="mt-3 font-mono text-slate-300 space-y-1">
            <div>1. Embed query → 12ms</div>
            <div>2. Vector search top-5 → 45ms (wrong chunks — general policy, not gifts)</div>
            <div>3. Build prompt with 5 chunks → 2ms</div>
            <div>4. GPT-4o generate → 1.2s (hallucinates 60-day window — not in any chunk)</div>
            <div>5. Return answer → user unhappy</div>
          </div>
          <div className="mt-3 text-red-400">
            Without observability, you only see step 5. With Langfuse, you see steps 1–4 and know retrieval failed.
          </div>
        </div>
      </LessonSection>

      <LessonSection title="Five problems observability solves">
        <ContentStep number={1} title="Debugging — which step broke?">
          <p>
            Retrieval returned wrong chunks? Prompt too long? Model ignored context? Tool returned bad data?
            Traces show the exact inputs and outputs at each step — like a flight recorder for your AI app.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Cost tracking — who spent what?">
          <p>
            Every generation logs input tokens, output tokens, and model name. Filter by user, feature, or date.
            Find the endpoint burning $500/day on unnecessary GPT-4 calls.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Latency — where is the slowdown?">
          <p>
            Total response time 3 seconds — but is it embedding (50ms), retrieval (200ms), or generation (2.7s)?
            Span-level timing pinpoints the bottleneck.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Quality over time — is it getting worse?">
          <p>
            Attach scores (human review, user thumbs, LLM-as-judge) to traces. Plot average faithfulness week over
            week. Catch regressions when you deploy prompt v5.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Reproducibility — what prompt actually ran?">
          <p>
            User complains about an answer from Tuesday. Pull that trace: exact prompt version, model, temperature,
            retrieved chunks, and full LLM output. Reproduce in the Playground.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="When to add Langfuse">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Prototype on laptop</strong> — optional; print debugging is fine.</li>
          <li><strong className="text-white">Shared dev/staging</strong> — add tracing early; catches issues before users do.</li>
          <li><strong className="text-white">Production with real users</strong> — required. You cannot operate blind.</li>
          <li><strong className="text-white">RAG or agents</strong> — especially required. Multi-step pipelines need span-level visibility.</li>
        </ul>
      </LessonSection>

      <Callout variant="tip">
        Langfuse connects directly to concepts from <em>Evaluating RAG</em> — faithfulness, retrieval quality,
        and debugging checklists. Tracing makes those evaluations actionable on real production data.
      </Callout>

      <KeyTakeaways
        items={[
          'LLM apps can succeed HTTP-wise but fail on quality — observability closes that gap.',
          'Traces reveal which of many internal steps (retrieve, generate, tool) caused a bad answer.',
          'Cost, latency, quality scores, and prompt versions all need structured logging — not print().',
          'Add Langfuse before production; ideally during staging when the app still changes frequently.',
        ]}
      />
    </LessonArticle>
  )
}
