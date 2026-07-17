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

export function A2aWithFrameworks() {
  return (
    <LessonArticle>
      <Definition term="A2A with agent frameworks">
        <p>
          Frameworks like <strong className="text-white">LangGraph</strong> (and similar agent runners) help you
          build <em>graphs of steps</em> inside one product. <strong className="text-white">A2A</strong> helps
          those graphs <em>call agents outside your process</em> — including other frameworks and vendors —
          through a shared protocol.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: LangGraph is the choreography software for your dance troupe. A2A is the phone line to invite
          a guest dancer from another company onto the stage for one number.
        </p>
      </Definition>

      <Callout variant="beginner" title="Bridge, do not replace">
        You do not throw away LangGraph because you adopt A2A. You add A2A nodes / tools that speak Agent Cards
        and tasks.
      </Callout>

      <LessonSection title="Mental model layers">
        <Flowchart
          title="Framework graph + A2A edge"
          chart={`flowchart TB
  UG[User] --> LG[LangGraph / agent graph]
  LG --> N1[Reason node]
  LG --> N2[MCP tool node]
  LG --> N3[A2A delegate node]
  N2 --> Tools[Local MCP servers]
  N3 --> Peer[Remote A2A agent]
  Peer --> N3
  N1 --> Out[Response]
  N2 --> Out
  N3 --> Out`}
        />
        <ContentStep number={1} title="In-graph agents">
          <p className="text-slate-300">
            Nodes and edges inside one runtime — shared memory, tight control, same deploy unit.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Cross-boundary agents">
          <p className="text-slate-300">
            A2A tasks to peers you do not deploy — different trust, SLAs, and auth.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Conceptual LangGraph-style node">
        <CodeBlock title="Teaching sketch — not official API">
{`# Inside a graph node:
def a2a_delegate_node(state):
    card = catalog.lookup(state["needed_skill"])
    task = a2a_client.send_task(
        card,
        message_parts=state["brief_parts"],
    )
    result = a2a_client.wait_or_stream(task)
    return {"peer_artifacts": result.artifacts, "peer_state": result.state}`}
        </CodeBlock>
        <Example title="When to use which">
{`Same repo specialists, shared DB     → graph nodes / local tools
Other team or vendor agent           → A2A
Reusable tools (DB, search, CRM)     → MCP
Other team’s tools without an agent  → MCP server they host`}
        </Example>
      </LessonSection>

      <LessonSection title="Framework benefits that remain">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Checkpointing</strong> — persist graph state while A2A tasks run
            async.
          </li>
          <li>
            <strong className="text-white">Human-in-the-loop</strong> — approve before expensive peer hires.
          </li>
          <li>
            <strong className="text-white">Typed state</strong> — store task ids and artifacts in graph state
            channels.
          </li>
        </ul>
        <Callout variant="insight" title="Two memory scopes">
          Graph state is yours. Peer agents have their own memory. Pass what they need via message parts; do not
          assume shared RAM.
        </Callout>
      </LessonSection>

      <LessonSection title="Migration path">
        <Flowchart
          title="From monolith graph to interop"
          chart={`flowchart TB
  A[All specialists as local nodes] --> B[Extract one specialist service]
  B --> C[Publish Agent Card + A2A]
  C --> D[Replace local node with A2A delegate node]
  D --> E[Repeat for multi-vendor peers]`}
        />
        <ContentStep number={1} title="Start local">
          <p className="text-slate-300">
            Prove the skill in-graph. Then extract when another team must own it.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Keep MCP for tools">
          <p className="text-slate-300">
            Extraction should not force every DB call through A2A — peers keep their own MCP toolbelts.
          </p>
        </ContentStep>
        <p className="mt-3 text-slate-300">
          Specs and framework adapters evolve — check official A2A and framework docs for current integration
          packages.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'LangGraph-style frameworks orchestrate inside a process; A2A reaches outside agents.',
          'Add A2A delegate nodes; keep MCP tool nodes for local capabilities.',
          'Graph checkpointing + human approval pair well with long-running A2A tasks.',
          'Migrate by extracting specialists to cards/tasks when ownership crosses boundaries.',
        ]}
      />
    </LessonArticle>
  )
}
