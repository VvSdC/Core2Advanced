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

export function BuildingAnA2aAgent() {
  return (
    <LessonArticle>
      <Definition term="Building an A2A agent">
        <p>
          An <strong className="text-white">A2A agent</strong> is a service that publishes an{' '}
          <strong className="text-white">Agent Card</strong>, accepts <strong className="text-white">tasks</strong>,
          processes <strong className="text-white">messages / parts</strong>, updates lifecycle state, and returns
          artifacts — while optionally using <strong className="text-white">MCP</strong> (or other tool bridges)
          internally.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: opening a shop. You hang a sign (card), take orders (tasks), update status, and hand over
          the goods (artifacts). The kitchen tools are MCP; the counter language is A2A.
        </p>
      </Definition>

      <Callout variant="beginner" title="You do not rewrite your brain">
        Keep your existing agent loop. Add an A2A edge: card + task API + message handling.
      </Callout>

      <LessonSection title="Build steps">
        <ContentStep number={1} title="Define skills honestly">
          <p className="text-slate-300">
            Write the skills you will put on the Agent Card — narrow beats impressive and wrong.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Publish the Agent Card">
          <p className="text-slate-300">
            Host a discoverable card with endpoint, modalities, streaming flag, and auth schemes.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Implement task handlers">
          <p className="text-slate-300">
            Map submitted → working → completed/failed. Persist task ids for async clients.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Wire tools via MCP (or equivalent)">
          <p className="text-slate-300">
            Inside the handler, call tools safely. A2A clients never need to see those tools.
          </p>
        </ContentStep>
        <Flowchart
          title="Inside an A2A agent"
          chart={`flowchart TB
  In[A2A client task] --> Edge[A2A edge: auth + parse parts]
  Edge --> Loop[Your agent loop]
  Loop -->|MCP| Tools[Local tools / data]
  Loop --> Out[Status events + artifacts]
  Out --> Client[A2A client]`}
        />
      </LessonSection>

      <LessonSection title="Minimal conceptual server">
        <CodeBlock title="Sketch only — not a real SDK">
{`class ResearchAgent:
    def agent_card(self):
        return {
            "name": "Research Specialist",
            "skills": [{"id": "summarize"}],
            "capabilities": {"streaming": True},
            "authentication": {"schemes": ["bearer"]},
        }

    def handle_task(self, task, message):
        task.set_state("working")
        docs = extract_files(message.parts)
        summary = self.llm_summarize(docs)      # may call MCP tools
        task.add_artifact({"kind": "text", "text": summary})
        task.set_state("completed")`}
        </CodeBlock>
        <Callout variant="info" title="Use official SDKs when available">
          Prefer maintained A2A libraries and sample servers from the current project docs over hand-rolled
          protocol parsers.
        </Callout>
      </LessonSection>

      <LessonSection title="Quality bar before you publish">
        <Example title="Smoke tests">
{`1. Card fetch returns valid profile
2. Unauthorized call is rejected
3. Text-only message completes
4. Unsupported file part → failed with clear error
5. Long job streams at least one working update
6. Cancel stops work (or documents why not)`}
        </Example>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Version your card</strong> when skills change.
          </li>
          <li>
            <strong className="text-white">Never leak secrets</strong> in streamed messages or artifacts.
          </li>
          <li>
            <strong className="text-white">Document SLAs</strong> — expected latency for &quot;working.&quot;
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Client vs server roles">
        <Flowchart
          title="Same process can be both"
          chart={`flowchart TB
  App[Your product agent] --> AsClient[A2A client: hire peers]
  App --> AsServer[A2A server: publish card]
  AsClient --> Peer[External specialists]
  Ext[External clients] --> AsServer`}
        />
        <p className="mt-3 text-slate-300">
          Many production agents are dual-role: they expose skills to the company and also delegate outward.
          Next lesson focuses on the client side — hiring specialists.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Build A2A by publishing a card and handling tasks/messages/artifacts — keep your agent loop.',
          'Use MCP (or similar) inside for tools; expose only the A2A edge to peers.',
          'Smoke-test auth, modalities, streaming, and cancel before listing in a catalog.',
          'Follow official A2A SDKs/docs; conceptual sketches here are teaching aids.',
        ]}
      />
    </LessonArticle>
  )
}
