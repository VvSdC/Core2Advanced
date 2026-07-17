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

export function McpVsA2a() {
  return (
    <LessonArticle>
      <Definition term="MCP vs A2A">
        <p>
          <strong className="text-white">MCP</strong> (Model Context Protocol) standardizes how an agent
          connects to <strong className="text-white">tools, data, and context</strong>.{' '}
          <strong className="text-white">A2A</strong> (Agent2Agent) standardizes how an agent connects to{' '}
          <strong className="text-white">other agents</strong>.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: MCP is the drawer of power tools in your garage. A2A is calling a licensed contractor who
          brings their own tools and returns a finished job.
        </p>
      </Definition>

      <Callout variant="beginner" title="Memorize this pair">
        MCP = agent↔tools. A2A = agent↔agent. You often need both, not one instead of the other.
      </Callout>

      <LessonSection title="Side-by-side comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full min-w-[36rem] text-left text-sm text-slate-300">
            <thead className="border-b border-surface-600 bg-surface-900 text-white">
              <tr>
                <th className="px-3 py-2 font-semibold">Dimension</th>
                <th className="px-3 py-2 font-semibold">MCP</th>
                <th className="px-3 py-2 font-semibold">A2A</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-surface-700">
                <td className="px-3 py-2 text-white">Primary peer</td>
                <td className="px-3 py-2">Tools / resources / prompts</td>
                <td className="px-3 py-2">Other agents</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-3 py-2 text-white">Discovery object</td>
                <td className="px-3 py-2">Server capabilities / tools list</td>
                <td className="px-3 py-2">Agent Card (capability profile)</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-3 py-2 text-white">Unit of work</td>
                <td className="px-3 py-2">Tool call / resource read</td>
                <td className="px-3 py-2">Task with lifecycle states</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-3 py-2 text-white">Payload style</td>
                <td className="px-3 py-2">Args + tool results</td>
                <td className="px-3 py-2">Messages with parts (text, files, data)</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-3 py-2 text-white">Long work</td>
                <td className="px-3 py-2">Often sync or short tool runs</td>
                <td className="px-3 py-2">Streaming / async tasks first-class</td>
              </tr>
              <tr>
                <td className="px-3 py-2 text-white">Interop story</td>
                <td className="px-3 py-2">Reuse tool servers across apps</td>
                <td className="px-3 py-2">Multi-vendor agent collaboration</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="How they fit in one product">
        <Flowchart
          title="One user goal, two protocols"
          chart={`flowchart TB
  U[User] --> Agent[Your agent runtime]
  Agent -->|MCP| Tools[Tools / DBs / APIs / files]
  Agent -->|A2A| Peer[Specialist peer agent]
  Peer -->|MCP inside peer| PeerTools[Peer's own tools]
  Tools --> Agent
  Peer --> Agent
  Agent --> Out[Final answer]`}
        />
        <ContentStep number={1} title="Your agent uses MCP">
          <p className="text-slate-300">
            Call <span className="font-mono text-sm text-genai-400">search_crm</span>, read tickets, fetch
            docs — local tool surface.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Your agent uses A2A">
          <p className="text-slate-300">
            Delegate &quot;draft a legal review&quot; to a remote legal agent you do not own — peer agent
            surface.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Peer may also use MCP">
          <p className="text-slate-300">
            The legal agent still needs its own tools. A2A does not erase MCP; it sits one level above.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Wrong mental models to drop">
        <Example title="Do not say">
{`"We use A2A instead of MCP"     → usually wrong
"MCP lets agents talk to agents" → wrong job description
"Pick only one protocol forever" → products often need both`}
        </Example>
        <CodeBlock title="Conceptual routing (not production code)">
{`def handle(goal):
    if needs_local_capability(goal):
        return mcp.call_tool(...)          # agent ↔ tools
    if needs_specialist_peer(goal):
        return a2a.send_task(peer, ...)    # agent ↔ agent
    return reason_locally(goal)`}
        </CodeBlock>
        <Callout variant="tip" title="Learning order">
          Learn MCP first so your agent can act. Then learn A2A so agents can hire each other. Mastery lesson
          at the end of this track repeats that order on purpose.
        </Callout>
      </LessonSection>

      <LessonSection title="Enterprise angle in one glance">
        <p className="text-slate-300">
          MCP helps standardize how <em>your</em> agent reaches <em>your</em> systems. A2A helps standardizes
          how <em>your</em> agent reaches <em>someone else&apos;s</em> agent with auth, discovery, and task
          semantics — the multi-vendor story.
        </p>
        <Flowchart
          title="Buy vs build specialist"
          chart={`flowchart TB
  Need[Need specialist skill] --> Q{Own the tools?}
  Q -->|Yes| MCP[Expose via MCP to your agent]
  Q -->|No / other vendor| A2A[Discover Agent Card + A2A task]
  MCP --> Done[Complete goal]
  A2A --> Done`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'MCP = agent↔tools/context; A2A = agent↔agent — complementary, not rivals.',
          'Compare discovery, unit of work, payloads, and long-running semantics side by side.',
          'A peer A2A agent often uses MCP internally for its own tools.',
          'Default learning path: MCP first, then A2A for multi-agent / multi-vendor collaboration.',
        ]}
      />
    </LessonArticle>
  )
}
