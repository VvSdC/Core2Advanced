import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function LangfuseDataModel() {
  return (
    <LessonArticle>
      <LessonSection title="Think of it as a nested receipt">
        <p className="text-slate-300">
          Every user interaction creates a <strong className="text-white">trace</strong> — one complete receipt
          for that request. Inside the trace are <strong className="text-white">observations</strong> (also called
          spans or generations) — line items on the receipt. A RAG trace might contain: embed span → retrieval span
          → generation span. Each line item has inputs, outputs, timing, and cost.
        </p>
        <Flowchart
          title="Trace hierarchy"
          chart={`flowchart TB
  T[Trace — one user request]
  T --> O1[Span: embed_query]
  T --> O2[Span: vector_search]
  T --> O3[Generation: GPT-4o answer]
  O3 --> O4[Span: tool_call — optional]
  O4 --> O5[Generation: GPT-4o follow-up]`}
        />
      </LessonSection>

      <Definition term="Trace">
        <p>
          A <strong className="text-white">trace</strong> is the top-level container for one end-to-end user
          request. It has an id, timestamp, optional <code className="font-mono text-sm">userId</code> and{' '}
          <code className="font-mono text-sm">sessionId</code>, and metadata tags (e.g. environment=production).
        </p>
      </Definition>

      <LessonSection title="Observation types">
        <div className="space-y-3">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Span — any logical step</p>
            <p className="mt-1 text-sm text-slate-400">
              Retrieval, embedding, reranking, parsing, API calls. Has name, input, output, start/end time.
              Spans can nest — a "RAG pipeline" span contains "retrieve" and "generate" child spans.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Generation — an LLM call specifically</p>
            <p className="mt-1 text-sm text-slate-400">
              A special observation type for model completions. Automatically captures model name, prompt,
              completion, input/output tokens, and cost. Use this for every ChatOpenAI or API call.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Event — a point-in-time marker</p>
            <p className="mt-1 text-sm text-slate-400">
              Lightweight log entry — e.g. "user clicked regenerate" or "cache hit". No duration, just a timestamp.
            </p>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="Sessions and users">
        <ContentStep number={1} title="userId — who made the request">
          <p>Pass your app's user id when creating a trace. Filter all traces for one customer in the dashboard.</p>
        </ContentStep>
        <ContentStep number={2} title="sessionId — multi-turn conversation">
          <p>
            Group traces from one chat session. See the full conversation history and how context built across turns.
            Essential for chatbot debugging.
          </p>
        </ContentStep>
        <ContentStep number={3} title="metadata — custom tags">
          <p>
            Key-value pairs: <code className="font-mono text-sm">{'{ "plan": "enterprise", "feature": "support_bot" }'}</code>.
            Filter traces by any tag in the UI.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Scores — quality attached to traces">
        <p className="text-slate-300">
          A <strong className="text-white">score</strong> is a number or boolean attached to a trace or observation:
          user thumbs up (1), human reviewer faithfulness (0.8), LLM-as-judge relevance (0.9). Scores power
          analytics and regression detection — covered in the Evaluation lessons.
        </p>
      </LessonSection>

      <Callout variant="beginner">
        OpenTelemetry users: Langfuse accepts OTel spans and maps them to this data model. You are not locked into
        the Langfuse SDK if your org already standardises on OTel.
      </Callout>

      <KeyTakeaways
        items={[
          'Trace = one user request. Observations = steps inside it (spans, generations, events).',
          'Generation = LLM-specific observation with automatic token and cost capture.',
          'sessionId groups multi-turn chats; userId identifies the customer; metadata adds custom filters.',
          'Scores attach quality ratings to traces for analytics and eval workflows.',
        ]}
      />
    </LessonArticle>
  )
}
