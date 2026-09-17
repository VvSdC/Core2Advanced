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

export function GuardrailTypesAndPlacement() {
  return (
    <LessonArticle>
      <Definition term="Guardrail taxonomy">
        <p>
          In the last lesson we split guardrails by <em>where</em> they sit (input, output, tool). Here we go one
          level deeper: the concrete <strong className="text-white">categories</strong> of guardrail you will
          actually build, and the architectural decisions — <strong className="text-white">placement</strong>,
          ordering, latency, and fail-open vs fail-closed — that decide whether they protect you or annoy your users.
        </p>
      </Definition>

      <Callout variant="beginner" title="Mental model">
        A guardrail system is a small pipeline of filters wrapped around a big model. Design it like you would a
        firewall: layered rules, cheapest checks first, an explicit decision at the end, and logs for everything.
      </Callout>

      <LessonSection title="The common guardrail categories">
        <p className="text-slate-300">
          Most production systems assemble their protection from this menu. You rarely need all of them on day one —
          pick the ones your threat model and compliance requirements demand.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-200">
                <th className="py-2 pr-4">Guardrail</th>
                <th className="py-2 pr-4">Checkpoint</th>
                <th className="py-2">What it protects against</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-800">
                <td className="py-2 pr-4 font-medium text-white">Prompt-injection / jailbreak</td>
                <td className="py-2 pr-4">Input</td>
                <td className="py-2">Instructions that hijack the system prompt or exfiltrate data</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-2 pr-4 font-medium text-white">Topic / scope control</td>
                <td className="py-2 pr-4">Input + Output</td>
                <td className="py-2">Off-brand, off-topic, or out-of-policy conversations</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-2 pr-4 font-medium text-white">PII / secret redaction</td>
                <td className="py-2 pr-4">Input + Output</td>
                <td className="py-2">Leaking personal data, keys, or credentials into logs or replies</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-2 pr-4 font-medium text-white">Toxicity / safety</td>
                <td className="py-2 pr-4">Output</td>
                <td className="py-2">Hateful, harassing, or unsafe generated content</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-2 pr-4 font-medium text-white">Groundedness / hallucination</td>
                <td className="py-2 pr-4">Output</td>
                <td className="py-2">Claims not supported by the retrieved context (RAG)</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-2 pr-4 font-medium text-white">Format / schema</td>
                <td className="py-2 pr-4">Output</td>
                <td className="py-2">Malformed JSON, broken contracts with downstream code</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-white">Tool / action gating</td>
                <td className="py-2 pr-4">Tool</td>
                <td className="py-2">Dangerous commands, unauthorized APIs, destructive side effects</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Placement: inline vs parallel vs asynchronous">
        <p className="text-slate-300">
          <em>Where</em> a check runs relative to the request decides how much latency the user feels and what the
          guardrail is allowed to do.
        </p>
        <ContentStep number={1} title="Inline (blocking)">
          <p className="text-slate-300">
            The check runs in the critical path and its verdict can stop the request. Required for anything that
            must <em>prevent</em> harm — injection blocks, tool gates, PII redaction. Cost: it adds to latency, so
            keep it fast.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Parallel (racing the model)">
          <p className="text-slate-300">
            Fire the input guardrail and the model call at the same time. If the guardrail returns
            &ldquo;block&rdquo; first, cancel the model. You hide the guardrail&apos;s latency behind the model&apos;s,
            at the cost of occasionally paying for a generation you throw away.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Asynchronous (log-only)">
          <p className="text-slate-300">
            The check runs after the response is already sent — it cannot block, only observe. Perfect for
            analytics, drift detection, and tuning thresholds without hurting latency.
          </p>
        </ContentStep>
        <Flowchart
          title="Streaming makes output guardrails hard"
          chart={`flowchart TB
  GEN[Model streams tokens] --> Q{Guard the stream?}
  Q -->|Buffer then check| SAFE[Safer, but no live typing effect]
  Q -->|Check in chunks| FAST[Live UX, risk of a bad token slipping out]
  SAFE --> SHIP[Send full, vetted answer]
  FAST --> STOP[Kill stream + retract on violation]`}
        />
        <Callout variant="tip" title="Streaming is the classic trap">
          Users love token-by-token streaming, but an output guardrail cannot judge a sentence it has not seen yet.
          Either buffer before showing (safe, slower feel) or scan in windows and be ready to halt and retract the
          stream (fast, more complex). Decide this early — it shapes your whole UX.
        </Callout>
      </LessonSection>

      <LessonSection title="Fail-open or fail-closed?">
        <p className="text-slate-300">
          Your guardrail service <em>will</em> time out or crash eventually. What should happen to the request when
          it does? This single choice is a product and risk decision, not a technical detail.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-200">
                <th className="py-2 pr-4">Mode</th>
                <th className="py-2 pr-4">On guardrail failure</th>
                <th className="py-2">Use when</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-800">
                <td className="py-2 pr-4 font-medium text-white">Fail-closed</td>
                <td className="py-2 pr-4">Reject the request</td>
                <td className="py-2">High-stakes: finance, health, tools with side effects</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-white">Fail-open</td>
                <td className="py-2 pr-4">Let the request through (log it)</td>
                <td className="py-2">Low-risk, availability-critical, non-destructive chat</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Callout variant="insight" title="Default to fail-closed for anything with side effects">
          For tool/action gating, fail-open means an outage becomes an open door. If the guard can&apos;t vote, the
          action doesn&apos;t run. For read-only chat, fail-open may be the right availability trade.
        </Callout>
      </LessonSection>

      <LessonSection title="Putting it together: a layered pipeline">
        <p className="text-slate-300">
          A realistic serving path chains cheap deterministic checks, an optional model classifier, the LLM, a tool
          gate, and an output pass — with logging at every stage.
        </p>
        <Example title="Guardrail pipeline (pseudocode)">{`def handle(request):
    log(request, stage="received")

    # 1) Cheap deterministic input checks (fast, fail-closed)
    if secret_or_pii(request.text):
        request.text = redact(request.text)
    if denylist_hit(request.text):
        return blocked("disallowed content")

    # 2) Model-based input check only on survivors
    if injection_classifier(request.text).score > 0.8:
        return blocked("prompt injection detected")

    # 3) The model
    draft = llm(request)

    # 4) Tool gate (fail-CLOSED: no vote => no action)
    for call in draft.tool_calls:
        if not tool_allowed(call):
            return blocked(f"tool not permitted: {call.name}")

    # 5) Output checks before the user sees anything
    if toxicity(draft.text) > 0.7:
        draft = regenerate_stricter(request)
    draft.text = redact(draft.text)

    log(draft, stage="shipped")
    return draft`}</Example>
        <Callout variant="tip" title="Guardrails are code you version and test">
          Treat every rule and threshold as reviewed, versioned config with its own regression suite of known-good
          and known-bad prompts. A guardrail you can&apos;t test is a guardrail you can&apos;t trust to change.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Build protection from a menu: injection, topic control, PII/secret redaction, toxicity, groundedness, schema, and tool gating.',
          'Placement decides latency and power: inline (can block), parallel (hides latency), asynchronous (observe only).',
          'Streaming output is the classic trap — buffer-then-check or scan-in-windows with the ability to halt and retract.',
          'Fail-closed for side effects and high stakes; fail-open only for low-risk, availability-critical read paths.',
          'A guardrail pipeline runs cheap checks first, models second, and logs every stage — and it is versioned, tested config.',
        ]}
      />
    </LessonArticle>
  )
}
