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
} from '../../../../../components/content'

export function SessionsUsersAndMetadata() {
  return (
    <LessonArticle>
      <LessonSection title="Why user, session, and metadata matter">
        <p className="text-slate-300">
          A trace tells you <em>what</em> happened on one request. But in production you need to ask: which{' '}
          <strong className="text-white">customer</strong> hit this error? Which{' '}
          <strong className="text-white">conversation</strong> led to a bad answer? Which{' '}
          <strong className="text-white">feature flag</strong> or plan was active? That is what correlating attributes
          solve.
        </p>
        <Flowchart
          title="How attributes group traces"
          chart={`flowchart TB
  U[user_id: customer_42]
  U --> S1[session_id: chat_abc]
  S1 --> T1[Trace: turn 1]
  S1 --> T2[Trace: turn 2]
  S1 --> T3[Trace: turn 3]
  M[metadata: plan=enterprise] --> T1
  M --> T2
  M --> T3`}
        />
      </LessonSection>

      <Definition term="propagate_attributes">
        <p>
          A context manager that attaches <code className="font-mono text-sm">user_id</code>,{' '}
          <code className="font-mono text-sm">session_id</code>, and{' '}
          <code className="font-mono text-sm">metadata</code> to the current trace and{' '}
          <strong className="text-white">all child observations</strong> created inside it. Set it once at the top of
          your handler — every nested <code className="font-mono text-sm">@observe</code> call inherits the values.
        </p>
      </Definition>

      <LessonSection title="Setting attributes with propagate_attributes">
        <Example
          title="Attach user, session, and metadata to a chat handler"
        >{`from langfuse import observe, propagate_attributes, get_client

@observe(name="chat_turn")
def handle_chat_turn(
    user_id: str,
    session_id: str,
    message: str,
    plan: str = "free",
) -> str:
    with propagate_attributes(
        user_id=user_id,
        session_id=session_id,
        metadata={"plan": plan, "feature": "support_bot"},
    ):
        response = call_llm(message)  # child observations inherit all attributes
        return response

# Each invoke creates a new trace, all grouped by session_id
handle_chat_turn("user_42", "session_abc", "What is your refund policy?")
handle_chat_turn("user_42", "session_abc", "What about gift purchases?")

get_client().flush()`}</Example>
        <Callout variant="tip">
          Generate <code className="font-mono text-sm">session_id</code> when a user opens a chat window and reuse it
          for every turn until they close the chat. Use your database user id for{' '}
          <code className="font-mono text-sm">user_id</code> — not email addresses (PII).
        </Callout>
      </LessonSection>

      <LessonSection title="Multi-turn chat debugging">
        <ContentStep number={1} title="One trace per turn, one session for the whole chat">
          <p>
            Each user message creates its own trace (with embed, retrieval, generation children). The shared{' '}
            <code className="font-mono text-sm">session_id</code> links them into one conversation view.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Open Sessions in the dashboard">
          <p>
            Go to <strong className="text-white">Tracing → Sessions</strong>. Click a session to see every turn in
            order — spot where context drifted or retrieval quality dropped on turn 4.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Compare turns side by side">
          <p>
            Turn 1 retrieved good chunks; turn 3 retrieved nothing because the rephrased query embedded differently.
            Session view makes this pattern obvious — impossible with isolated traces.
          </p>
        </ContentStep>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-slate-400">Session: chat_abc (user_42)</div>
          <div className="mt-3 font-mono text-slate-300 space-y-1">
            <div>Turn 1 — "Refund policy?" → trace_id: t1 ✓</div>
            <div>Turn 2 — "Gift purchases?" → trace_id: t2 ✓</div>
            <div>Turn 3 — "What about last year?" → trace_id: t3 ✗ (retrieval empty)</div>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="Metadata for filtering and A/B tests">
        <p className="text-slate-300">
          Metadata values are short strings (max 200 characters). Use them for feature flags, prompt versions,
          environment tags, or experiment variants.
        </p>
        <CodeBlock title="Common metadata keys">{`metadata={
    "environment": "production",
    "prompt_version": "v4",
    "experiment": "reranker_b",
    "feature": "support_bot",
}`}</CodeBlock>
        <Callout variant="insight">
          When you deploy prompt v5 and quality drops, filter traces where{' '}
          <code className="font-mono text-sm">metadata.prompt_version = v5</code> — compare against v4 without
          guessing which deployment caused the regression.
        </Callout>
      </LessonSection>

      <LessonSection title="Filtering in the dashboard">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Filter by</th>
                <th className="px-4 py-3">Use case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['user_id', 'All traces for one customer — support ticket investigation'],
                ['session_id', 'Full multi-turn conversation for one chat session'],
                ['metadata.plan', 'Compare error rates between free vs enterprise users'],
                ['metadata.prompt_version', 'Regression check after a prompt deploy'],
                ['metadata.environment', 'Separate staging noise from production issues'],
              ].map(([filter, useCase]) => (
                <tr key={filter} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-genai-400">{filter}</td>
                  <td className="px-4 py-3 text-slate-400">{useCase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'propagate_attributes(user_id, session_id, metadata) applies to the trace and all child observations.',
          'One trace per chat turn; session_id groups turns into a full conversation in the Sessions view.',
          'Use metadata for prompt versions, feature flags, and environment — filter traces after deploys.',
          'Dashboard filters by user_id, session_id, and any metadata key for support and debugging workflows.',
        ]}
      />
    </LessonArticle>
  )
}
