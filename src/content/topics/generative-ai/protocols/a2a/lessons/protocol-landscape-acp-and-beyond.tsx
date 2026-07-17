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

export function ProtocolLandscapeAcpAndBeyond() {
  return (
    <LessonArticle>
      <Definition term="Protocol landscape around A2A">
        <p>
          Agent systems sit in a stack of protocols. <strong className="text-white">MCP</strong> covers
          agent↔tools. <strong className="text-white">A2A</strong> covers agent↔agent. Historically, IBM&apos;s{' '}
          <strong className="text-white">ACP</strong> (Agent Communication Protocol) efforts{' '}
          <strong className="text-white">merged / aligned with A2A</strong> under the{' '}
          <strong className="text-white">Linux Foundation</strong> landscape — a signal that the industry is
          consolidating on shared agent interop rather than forever-fragmented RPCs.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: competing railroad gauges eventually standardize so cargo crosses regions. ACP→A2A alignment
          is that story for agents — know it as context, then build on current A2A docs.
        </p>
      </Definition>

      <Callout variant="beginner" title="Landscape, not trivia night">
        You do not need every historical acronym. You need to know MCP vs A2A jobs, and that ACP aligned into
        the A2A / LF story.
      </Callout>

      <LessonSection title="Where each protocol sits">
        <Flowchart
          title="Stack view"
          chart={`flowchart TB
  User[Users / apps] --> Agent[Agent runtime]
  Agent -->|MCP| Tools[Tools / data / context]
  Agent -->|A2A| Peers[Other agents]
  Peers -->|MCP| PeerTools[Peer's tools]
  Note[ACP historically aligned into A2A / LF] -.-> Peers`}
        />
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full min-w-[32rem] text-left text-sm text-slate-300">
            <thead className="border-b border-surface-600 bg-surface-900 text-white">
              <tr>
                <th className="px-3 py-2">Protocol</th>
                <th className="px-3 py-2">Rough job</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-surface-700">
                <td className="px-3 py-2 font-mono text-sm text-genai-400">MCP</td>
                <td className="px-3 py-2">Agent ↔ tools / resources</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-3 py-2 font-mono text-sm text-genai-400">A2A</td>
                <td className="px-3 py-2">Agent ↔ agent discovery &amp; tasks</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-mono text-sm text-genai-400">ACP (hist.)</td>
                <td className="px-3 py-2">IBM-originated agent comms; merged/aligned with A2A under LF</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="When to use MCP + A2A together">
        <ContentStep number={1} title="Always MCP for your hands">
          <p className="text-slate-300">
            Databases, search, calendars, internal APIs — expose as tools/context to <em>your</em> agent.
          </p>
        </ContentStep>
        <ContentStep number={2} title="A2A when the peer is an agent">
          <p className="text-slate-300">
            Another autonomous service with its own policy, memory, and toolbelt — hire via card + task.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Do not fake agents as tools forever">
          <p className="text-slate-300">
            Wrapping a full multi-step peer as one giant MCP tool loses lifecycle, streaming, and card discovery
            benefits.
          </p>
        </ContentStep>
        <Example title="Same product, both protocols">
{`Support copilot (you)
  MCP: ticket_db, knowledge_base, refund_api
  A2A: fraud-review agent (risk team), field-ops agent (vendor)
Peer fraud agent
  MCP: case_history, device_signals
  A2A: may call your copilot only if policy allows`}
        </Example>
      </LessonSection>

      <LessonSection title="How to think about evolving specs">
        <CodeBlock title="Engineer habit">
{`# Conceptual dependency pins
mcp_sdk = "check current MCP release notes"
a2a_sdk = "check current A2A / LF project docs"
# Do not freeze learning on a blog post from last quarter
# Teach concepts → verify wire details before production`}
        </CodeBlock>
        <Callout variant="insight" title="Consolidation is good news">
          ACP aligning with A2A under the Linux Foundation reduces &quot;which agent protocol wins&quot; risk for
          enterprises betting on interop. Still read primary sources — secondary blogs lag.
        </Callout>
        <Flowchart
          title="Choose interface for a dependency"
          chart={`flowchart TB
  Dep[Need external capability] --> Q{Is it an agent with autonomy?}
  Q -->|No — API/tool/data| MCP[Prefer MCP or plain API]
  Q -->|Yes — peer agent| A2A[Prefer A2A]
  A2A --> Both[Peer may use MCP internally]
  MCP --> Done[Integrate]
  Both --> Done`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'MCP = tools/context; A2A = agents; use both in real products.',
          'ACP (IBM) historically merged/aligned with A2A under the Linux Foundation — landscape context.',
          'Do not forever wrap rich peer agents as a single opaque tool call.',
          'Specs evolve — concepts here, official docs for production details.',
        ]}
      />
    </LessonArticle>
  )
}
