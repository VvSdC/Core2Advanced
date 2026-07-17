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

export function MultiServerArchitectures() {
  return (
    <LessonArticle>
      <Definition term="Multi-server MCP architectures">
        <p>
          Real hosts rarely use one server. A <strong className="text-white">multi-server</strong> setup
          attaches specialized MCP servers (docs, tickets, browser, DB) and lets the host route tool calls to
          the right process.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a USB hub with a keyboard, drive, and headset — each gadget does one job well.
        </p>
      </Definition>

      <Callout variant="beginner" title="Design rule">
        Prefer many small servers over one mega-server that knows every secret and every API.
      </Callout>

      <LessonSection title="Fan-out topology">
        <Flowchart
          title="One host, many servers"
          chart={`flowchart TB
  H[Host + MCP client] --> D[docs server]
  H --> G[git server]
  H --> T[tickets server]
  H --> B[browser server]
  H --> P[prompt-pack server]`}
        />
        <ContentStep number={1} title="Specialize by domain">
          <p className="text-slate-300">
            Split credentials and blast radius: a docs token should not unlock payroll.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Name tools carefully">
          <p className="text-slate-300">
            Avoid duplicate vague names across servers. Prefer{' '}
            <span className="font-mono text-sm text-genai-400">jira_create_issue</span> over two different{' '}
            <span className="font-mono text-sm text-genai-400">create</span> tools.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Gate per server">
          <p className="text-slate-300">
            Enable servers per workspace or role. Not every chat needs the browser server.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Routing and namespaces">
        <Flowchart
          title="Call routing"
          chart={`flowchart TB
  M[Model tool call] --> C[Client router]
  C --> Q{Which server owns this tool?}
  Q --> S1[Server A]
  Q --> S2[Server B]
  S1 --> R[Result merge]
  S2 --> R
  R --> M2[Back to model]`}
        />
        <Example title="Collision problem">
{`Server A: search
Server B: search
→ host must disambiguate (prefix, rename, or hide one)
→ models get confused by twins`}
        </Example>
      </LessonSection>

      <LessonSection title="Patterns that scale">
        <ContentStep number={1} title="Workspace profiles">
          <p className="text-slate-300">
            “Frontend profile” loads Storybook + repo servers; “Ops profile” loads logs + paging — not both
            by default.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Shared remote + local mix">
          <p className="text-slate-300">
            Local stdio for private files; remote HTTP for company-wide tools with central auth.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Aggregation gateway (advanced)">
          <p className="text-slate-300">
            Some teams put a gateway in front of many backends. Still expose clear tool boundaries to the
            model — do not flatten everything into one opaque RPC.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Observability">
          Tag logs with <strong className="text-white">server name + tool + request id</strong>. Multi-server
          bugs are usually routing or auth, not “the LLM is dumb.”
        </Callout>
        <Callout variant="insight" title="Jargon: blast radius">
          <strong className="text-white">Blast radius</strong> is how much damage a compromise of one
          component can cause. Smaller servers shrink it.
        </Callout>
      </LessonSection>

      <LessonSection title="Failure isolation">
        <p className="text-slate-300">
          In multi-server setups, one crashed browser MCP process should not take down your docs server. Hosts
          should <strong className="text-white">detach failed servers</strong> and keep the session usable.
        </p>
        <Flowchart
          title="Partial outage behavior"
          chart={`flowchart TB
  A[Three servers connected] --> B[Browser server crashes]
  B --> C[Host marks browser offline]
  C --> D[Remove browser tools from model]
  D --> E[Docs + tickets still work]
  E --> F[User sees clear status, not silent failure]`}
        />
        <ContentStep number={1} title="Health checks">
          <p className="text-slate-300">
            Periodically verify initialize still works or that stdio pipes are alive — especially for long IDE
            sessions.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Dependency order">
          <p className="text-slate-300">
            Some tools chain across servers (read file → post summary). Document which server owns each step so
            routers do not send half a workflow to the wrong process.
          </p>
        </ContentStep>
        <Example title="Profile switch">
{`Morning: "Research" profile → docs + web search servers
Afternoon: "Ship" profile → git + CI + tickets only
→ fewer tools in context, fewer collisions, smaller blast radius`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Multi-server is the normal production shape — hub with specialized plugs.',
          'Split by domain to isolate credentials and failures.',
          'Prevent tool-name collisions; route explicitly.',
          'Use profiles and allowlists so chats only load what they need.',
        ]}
      />
    </LessonArticle>
  )
}
