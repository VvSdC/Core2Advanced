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

export function McpInAgentFrameworks() {
  return (
    <LessonArticle>
      <Definition term="MCP in agent frameworks">
        <p>
          Frameworks like <strong className="text-white">LangChain</strong> /{' '}
          <strong className="text-white">LangGraph</strong> (and other agent runners) can attach MCP servers so
          graph nodes or ReAct loops call standardized tools instead of only hand-written Python functions.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: the agent framework is the orchestra conductor; MCP servers are rented instrument sections
          that show up already tuned to a common pitch.
        </p>
      </Definition>

      <Callout variant="beginner" title="Where MCP sits">
        MCP supplies tools/context. The framework supplies planning, memory, retries, and multi-step control
        flow.
      </Callout>

      <LessonSection title="Typical integration shape">
        <Flowchart
          title="Agent loop + MCP tools"
          chart={`flowchart TB
  U[User goal] --> G[Agent graph / ReAct loop]
  G --> M[Model]
  M --> T[Choose tool]
  T --> C[MCP client adapter]
  C --> S[MCP servers]
  S --> O[Observation]
  O --> G
  G --> A[Final answer]`}
        />
        <ContentStep number={1} title="Connect servers at startup">
          <p className="text-slate-300">
            Framework adapter initializes MCP clients, lists tools, and wraps them as framework-native tool
            objects.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Bind tools to the agent">
          <p className="text-slate-300">
            Same as binding local tools — the model sees schemas; execution routes through MCP.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Keep graph logic separate">
          <p className="text-slate-300">
            Retries, human-in-the-loop, and routing stay in LangGraph (or similar). MCP should not become your
            entire orchestration layer.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Illustrative adapter idea">
        <CodeBlock title="Conceptual — framework wraps MCP tools">
{`servers = connect_mcp([...])
tools = servers.list_tools()          # MCP discovery
agent = build_agent(model, tools)     # LangChain/LangGraph-style
agent.invoke("Find open P1 bugs")     # may call jira_search via MCP`}
        </CodeBlock>
        <Example title="Why this beats copy-paste connectors">
{`Without MCP: rewrite Jira tool for every framework
With MCP: one Jira server; many agents consume it`}
        </Example>
      </LessonSection>

      <LessonSection title="Design tips for agent builders">
        <Flowchart
          title="Framework vs protocol responsibilities"
          chart={`flowchart TB
  F[Agent framework] --> F1[Planning / state / retries]
  F --> F2[Memory / HITL]
  P[MCP] --> P1[Tool / resource / prompt access]
  P --> P2[Interoperable servers]
  F --> X[Together: production agents]
  P --> X`}
        />
        <Callout variant="insight" title="Jargon: adapter">
          An <strong className="text-white">adapter</strong> translates between two interfaces — here, MCP tool
          descriptors ↔ the framework’s Tool type.
        </Callout>
        <Callout variant="tip" title="Watch tool sprawl">
          Agents with 80 MCP tools often degrade. Curate per graph node: research node gets search; write node
          gets patch tools.
        </Callout>
        <Callout variant="info" title="Ecosystem note">
          Bindings and package names move quickly. Prefer official docs for your framework version; keep this
          mental model when APIs rename.
        </Callout>
      </LessonSection>

      <LessonSection title="Lifecycle in long-running agents">
        <p className="text-slate-300">
          Agent graphs may run for minutes or hours. MCP connections should be{' '}
          <strong className="text-white">opened at startup</strong>,{' '}
          <strong className="text-white">refreshed on list changes</strong>, and{' '}
          <strong className="text-white">closed on shutdown</strong> — not re-initialized every model turn.
        </p>
        <Flowchart
          title="Agent session + MCP"
          chart={`flowchart TB
  A[Graph start] --> B[Connect MCP servers]
  B --> C[List tools once per refresh]
  C --> D[ReAct / graph steps]
  D --> E{Tool needed?}
  E -->|Yes| F[MCP tools/call]
  F --> D
  E -->|No| G[Continue reasoning]
  G --> D
  D --> H[Graph end — disconnect]`}
        />
        <ContentStep number={1} title="Cache invalidation">
          <p className="text-slate-300">
            When a server sends a list-changed notification, rebuild the framework tool registry before the
            next model turn.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Parallelism">
          <p className="text-slate-300">
            Some graphs call tools concurrently. Ensure your adapter serializes or safely parallelizes calls per
            server contract — especially for write tools.
          </p>
        </ContentStep>
        <Example title="LangGraph-style split">
{`research_node → MCP search + docs servers only
coding_node   → MCP repo + patch servers only
→ smaller tool lists, better tool choice accuracy`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Agent frameworks orchestrate; MCP standardizes tool/context plugs.',
          'Adapters discover MCP tools and bind them like local tools.',
          'Keep planning/state in the graph; keep I/O in MCP servers.',
          'Curate tool sets per agent/node to avoid sprawl.',
        ]}
      />
    </LessonArticle>
  )
}
