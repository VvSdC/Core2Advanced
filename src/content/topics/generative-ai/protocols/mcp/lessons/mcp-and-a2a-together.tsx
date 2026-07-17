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

export function McpAndA2aTogether() {
  return (
    <LessonArticle>
      <Definition term="MCP and A2A together">
        <p>
          <strong className="text-white">MCP</strong> connects models/apps to tools and context.{' '}
          <strong className="text-white">A2A</strong> (agent-to-agent) connects agents to other agents. Used
          together, they form a layered architecture: agents collaborate upward; tools plug in sideways.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: coworkers talk to each other on Slack (A2A). Each coworker still uses USB peripherals and
          apps (MCP) to actually fetch files and send emails.
        </p>
      </Definition>

      <Callout variant="beginner" title="Complement, do not conflate">
        MCP is not “agents chatting.” A2A is not “how I call Postgres.” Keep the layers straight.
      </Callout>

      <LessonSection title="Layered architecture">
        <Flowchart
          title="A2A + MCP stack"
          chart={`flowchart TB
  U[User] --> A1[Agent A]
  A1 -->|A2A| A2[Agent B]
  A1 -->|A2A| A3[Agent C]
  A1 --> M1[MCP client]
  A2 --> M2[MCP client]
  A3 --> M3[MCP client]
  M1 --> S1[Tools / data servers]
  M2 --> S2[Tools / data servers]
  M3 --> S3[Tools / data servers]`}
        />
        <ContentStep number={1} title="Horizontal: A2A">
          <p className="text-slate-300">
            Delegate, negotiate, or hand off tasks between specialized agents (research, coding, compliance).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Vertical: MCP">
          <p className="text-slate-300">
            Each agent host reaches files, tickets, browsers, and prompt packs through MCP servers.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Policy spans both">
          <p className="text-slate-300">
            Decide which agents may talk and which tools each may touch — two allowlists, one security story.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Example scenario">
        <Example title="Incident response">
{`Orchestrator agent (A2A) asks:
  - Logs agent → MCP log server
  - Code agent → MCP repo server
  - Comms agent → MCP chat/email server
User gets one coordinated answer; tools stay standardized`}
        </Example>
        <Flowchart
          title="Who talks to whom"
          chart={`flowchart TB
  O[Orchestrator agent] -->|A2A task| L[Logs agent]
  O -->|A2A task| C[Code agent]
  L -->|MCP| LS[Log MCP server]
  C -->|MCP| RS[Repo MCP server]
  LS --> R[Evidence]
  RS --> R
  R --> O
  O --> U[User update]`}
        />
      </LessonSection>

      <LessonSection title="Design pitfalls at the boundary">
        <ContentStep number={1} title="Hiding tools behind fake agents">
          <p className="text-slate-300">
            If “agent” only wraps one API call, you probably wanted an MCP tool, not A2A overhead.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Sharing one mega MCP into every agent">
          <p className="text-slate-300">
            Give each agent the minimum servers. A2A should not become a backdoor to unrestricted tools.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Next track">
          After MCP mastery, the <strong className="text-white">A2A track</strong> goes deeper on agent
          identity, discovery, and collaboration protocols.
        </Callout>
        <Callout variant="insight" title="Jargon: layered architecture">
          <strong className="text-white">Layered</strong> means each layer has one job and talks through clear
          interfaces — collaboration ≠ tool access.
        </Callout>
      </LessonSection>

      <LessonSection title="Quick reference — which protocol when">
        <p className="text-slate-300">
          Use this table mentally when designing systems. Mixing layers creates security holes and debugging
          nightmares.
        </p>
        <Flowchart
          title="MCP vs A2A decision"
          chart={`flowchart TB
  Q[What are you connecting?] --> M[Model/app to tools/data]
  Q --> A[Agent to agent]
  M --> MCP[MCP servers]
  A --> A2A[A2A peers]
  MCP --> X[Never fake as agent]
  A2A --> Y[Never hide raw API as agent]`}
        />
        <ContentStep number={1} title="MCP answers">
          <p className="text-slate-300">
            “How does this host read a file, search docs, or run an approved API action?” — standardized
            Tools, Resources, Prompts over JSON-RPC.
          </p>
        </ContentStep>
        <ContentStep number={2} title="A2A answers">
          <p className="text-slate-300">
            “How does Agent A delegate a subtask to Agent B and get a structured result back?” — identity,
            tasks, and agent cards — not Postgres wire protocol.
          </p>
        </ContentStep>
        <Example title="Both in one product">
{`Coding agent (MCP) → repo + test servers
Orchestrator (A2A) → delegates to coding + review agents
User sees one thread; layers stay separate in your diagram`}
        </Example>
        <Callout variant="tip" title="Specs evolve">
          MCP and A2A specifications both move forward independently. Verify current docs for each before
          shipping cross-protocol products.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'MCP = model/app ↔ tools/context; A2A = agent ↔ agent.',
          'Stack them: A2A for collaboration, MCP for capabilities.',
          'Apply allowlists on both agent peers and MCP tools.',
          'Do not fake agents for what should be a simple MCP tool.',
        ]}
      />
    </LessonArticle>
  )
}
