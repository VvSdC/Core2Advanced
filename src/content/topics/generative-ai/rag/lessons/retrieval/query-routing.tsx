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

export function QueryRouting() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Read this after">
        You have the <em>Retrieval Strategies</em> track under your belt. This lesson answers a bigger question:
        <em> should we even retrieve, and if so, from where?</em>
      </Callout>

      <Definition term="Query routing">
        <p>
          A real assistant does not just search a vector store. Some questions need{' '}
          <strong className="text-white">the wiki</strong> (semantic search), some need{' '}
          <strong className="text-white">the database</strong> (structured SQL), some need{' '}
          <strong className="text-white">a live API</strong> (current order status, current stock price), and
          some need <strong className="text-white">no retrieval at all</strong> (&ldquo;summarise this text
          I just pasted&rdquo;). <span className="text-genai-400">Query routing</span> is the component that
          reads the question and decides where the answer comes from.
        </p>
      </Definition>

      <LessonSection title="Why one retriever is not enough">
        <p className="text-slate-300">
          Vector search excels at &ldquo;what does our policy say about parental leave?&rdquo; It is useless for
          &ldquo;how many refunds did we issue yesterday?&rdquo; — that answer lives in a row of a database and
          is precisely wrong 100% of the time when reconstructed from prose. A single retriever forces every
          question into the wrong shape.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Question shape</th>
                <th className="px-4 py-3">Correct source</th>
                <th className="px-4 py-3">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['"What does our policy say about X?"', 'Vector store (unstructured docs)', 'Answer is prose, semantically related'],
                ['"How many X did we do last month?"', 'Data warehouse via SQL', 'Answer is a computed aggregate'],
                ['"What is the status of order 12345?"', 'REST API / DB row lookup', 'Live, per-record, must be current'],
                ['"Convert 100 USD to INR at today\'s rate"', 'External API (FX provider)', 'Data is not yours and changes by the second'],
                ['"Summarise this document I pasted"', 'No retrieval', 'The context IS the document'],
                ['"When was WW2?"', 'No retrieval (model knowledge)', 'Time-invariant common knowledge'],
              ].map(([q, s, w]) => (
                <tr key={q}>
                  <td className="px-4 py-3 text-slate-300">{q}</td>
                  <td className="px-4 py-3 font-semibold text-white">{s}</td>
                  <td className="px-4 py-3 text-slate-400">{w}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="The routing decision tree">
        <Flowchart
          title="One question, one route"
          chart={`flowchart TB
  Q[User query] --> C1{Needs current, per-entity data?}
  C1 -- yes --> API[Call external API / webhook]
  C1 -- no --> C2{Numeric / aggregate over structured data?}
  C2 -- yes --> SQL[Text-to-SQL over warehouse]
  C2 -- no --> C3{Answer likely in our docs?}
  C3 -- yes --> VEC[Vector / hybrid retrieval]
  C3 -- no --> C4{Model already knows this?}
  C4 -- yes --> DIRECT[Direct LLM, no retrieval]
  C4 -- no --> REFUSE[Refuse or ask a clarifying question]`}
        />
      </LessonSection>

      <LessonSection title="Three ways to actually build the router">
        <ContentStep number={1} title="Rule-based router — start here">
          <p className="text-slate-300">
            A handful of keyword and regex rules on the query. Fast, deterministic, cheap, and diagnosable.
            Ship this first even if you plan to replace it — it gives you a baseline that you can measure the
            LLM router against.
          </p>
          <Example title="Rule router">{`import re

def route(q: str) -> str:
    q_low = q.lower()
    if re.search(r"\\border\\s+#?\\d+", q_low):   return "orders_api"
    if re.search(r"\\b(how many|count|sum|total)\\b", q_low): return "sql"
    if re.search(r"\\b(policy|handbook|process)\\b", q_low):  return "vector"
    return "vector"   # safe default`}</Example>
        </ContentStep>
        <ContentStep number={2} title="Classifier router — a small embedding model">
          <p className="text-slate-300">
            Embed the query, compare it to embeddings of a few example questions per route, pick the route with
            the highest similarity. Cheap (a few ms), no LLM call, easy to add a new route (add more examples).
            This is the workhorse in production routing.
          </p>
          <Example title="Embedding-similarity router">{`ROUTES = {
  "orders_api": ["what is the status of order 123", "when will my order ship"],
  "sql":        ["how many refunds last week", "total revenue in Q3"],
  "vector":     ["what does our leave policy say", "how do I reset MFA"],
  "direct":     ["explain gravity", "translate hello to french"],
}
CENTROIDS = {r: mean([embed(e) for e in ex]) for r, ex in ROUTES.items()}

def route(q):
    v = embed(q)
    return max(CENTROIDS, key=lambda r: cosine(v, CENTROIDS[r]))`}</Example>
        </ContentStep>
        <ContentStep number={3} title="LLM / tool-calling router — for messy queries">
          <p className="text-slate-300">
            Expose each source as a <strong className="text-white">tool</strong> (schema + description) and let
            the model choose which tools to call. This is how modern agents route. It handles multi-hop
            questions (&ldquo;find the customer&rsquo;s tier from SQL, then look up the SLA policy&rdquo;) that
            a single-shot router cannot. The cost: one extra LLM call before you retrieve.
          </p>
          <Example title="Tool-calling router">{`tools = [
    {"name": "vector_search",  "description": "Semantic search over policies, wikis, handbooks.",
     "parameters": {"query": "string"}},
    {"name": "run_sql",         "description": "Aggregate metrics from the data warehouse.",
     "parameters": {"question": "string"}},
    {"name": "orders_api",      "description": "Live order status by order_id.",
     "parameters": {"order_id": "string"}},
]
response = llm.chat(messages=[system, {"role":"user","content": q}], tools=tools)
# Execute whichever tool(s) the model chose, then feed results back for the final answer`}</Example>
        </ContentStep>
      </LessonSection>

      <LessonSection title="When to call an external API or webhook">
        <p className="text-slate-300">
          Not every fact belongs in the vector store. Prefer an external call when at least one of these is
          true:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
          <li><strong className="text-white">Freshness</strong> — the answer changes faster than your ingestion cadence. Prices, weather, order status, availability.</li>
          <li><strong className="text-white">Per-entity precision</strong> — the answer is about a specific ID. &ldquo;My order&rdquo; not &ldquo;orders in general&rdquo;.</li>
          <li><strong className="text-white">Compliance</strong> — the source of truth cannot be duplicated (health record, payroll, bank balance).</li>
          <li><strong className="text-white">Action</strong> — the query is not a lookup at all: schedule a meeting, refund an order, open a ticket. That is a <em>webhook</em> or a write API, and it must be gated by an approval hook (see <em>AI Security &amp; Guardrails</em>).</li>
        </ul>
        <Callout variant="tip" title="Distinguish retrieve from act">
          Reads are cheap to be wrong about — you retrieve and cite. Writes are expensive to be wrong about —
          you gate them behind a confirmation, a rate limit, and an audit log. Never let a router silently
          promote a read tool to a write tool.
        </Callout>
      </LessonSection>

      <LessonSection title="Combining routes — the multi-source answer">
        <p className="text-slate-300">
          Some questions genuinely need more than one source. &ldquo;What is the refund policy for customer
          12345&rsquo;s order?&rdquo; needs the order (API) plus the policy (vector). Two patterns:
        </p>
        <ContentStep number={1} title="Fanout — call in parallel, merge in the prompt">
          <p className="text-slate-300">
            Router picks &ge; 2 sources; each runs in parallel; results are stitched into a single context
            block for the LLM. Fastest, but you can spend on sources you did not need.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Chain — one source informs the next">
          <p className="text-slate-300">
            Router calls source A first, uses its result to build the call to source B. Cheaper, but adds
            latency because the second call is blocked on the first. This is the natural agent loop.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What to monitor">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Route distribution</strong> — how often each source is chosen. A sudden shift means your traffic changed or your router drifted.</li>
          <li><strong className="text-white">Route accuracy</strong> — on a labelled eval set, did the router pick the right source? Track per-route precision/recall.</li>
          <li><strong className="text-white">Wrong-source failure rate</strong> — the worst outcome. Vector answered a question that needed SQL, or vice versa. Alarm on this.</li>
          <li><strong className="text-white">External-API error budget</strong> — third-party APIs fail; have a fallback route and a cache.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A single retriever is not enough — real assistants route between vector search, SQL, live APIs, webhooks, and "no retrieval at all".',
          'Start with rules, upgrade to an embedding-similarity classifier, adopt tool-calling / agents only when you truly need multi-hop routing.',
          'Choose an external API when the data must be fresh, per-entity, non-duplicable, or when the query is an action rather than a lookup.',
          'Gate write actions (webhooks, mutations) behind approval, rate limits, and audit logs — never let the router promote reads to writes.',
          'Monitor route distribution, per-route accuracy, and wrong-source failures — router drift is a silent quality regression.',
        ]}
      />
    </LessonArticle>
  )
}
