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

export function McpVsFunctionCalling() {
  return (
    <LessonArticle>
      <Definition term="MCP vs function calling">
        <p>
          <strong className="text-white">Function calling</strong> (OpenAI-style tools, Claude tool use, etc.)
          is how a <em>model API</em> asks to run a function. <strong className="text-white">MCP</strong> is how
          an <em>app ecosystem</em> plugs many tool/data servers into hosts in a standard way.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: function calling is the model saying “press this button.” MCP is the USB dock that makes
          buttons from many vendors appear on your desk.
        </p>
      </Definition>

      <Callout variant="beginner" title="They are not competitors">
        Most real systems use both: the host gathers MCP tools, then presents them to the model via that
        provider’s function/tool-calling format.
      </Callout>

      <LessonSection title="Side-by-side">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Aspect</th>
                <th className="px-4 py-3">Function calling</th>
                <th className="px-4 py-3">MCP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Layer', 'Model API ↔ your app', 'Host/client ↔ tool servers'],
                ['Who defines tools', 'You, in the API request', 'Servers advertise capabilities'],
                ['Portability', 'Tied to provider format', 'Cross-host if they speak MCP'],
                ['Scope', 'One session’s tool list', 'Ecosystem of servers + resources + prompts'],
              ].map(([aspect, fc, mcp]) => (
                <tr key={aspect} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{aspect}</td>
                  <td className="px-4 py-3 text-slate-400">{fc}</td>
                  <td className="px-4 py-3 text-slate-400">{mcp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="How they fit in one request">
        <Flowchart
          title="MCP feeds the function-calling layer"
          chart={`flowchart TB
  S[MCP servers] --> C[MCP client in host]
  C --> T[Normalized tool list]
  T --> API[Provider tool / function calling]
  API --> M[Model chooses a call]
  M --> C
  C --> S`}
        />
        <ContentStep number={1} title="Discover via MCP">
          <p className="text-slate-300">
            Client connects to servers and lists tools like{' '}
            <span className="font-mono text-sm text-genai-400">get_issue</span>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Expose to the model">
          <p className="text-slate-300">
            Host converts those into the vendor’s tool schema (OpenAI tools, Anthropic tools, etc.).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Execute via MCP">
          <p className="text-slate-300">
            When the model emits a call, the host routes it back to the right MCP server and returns the
            result.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Illustrative shapes">
        <CodeBlock title="Provider function calling (conceptual)">
{`tools: [{
  name: "get_weather",
  parameters: { city: "string" }
}]
// model → tool_call get_weather(city="Austin")
// your code runs it`}
        </CodeBlock>
        <Example title="Same capability via an MCP server (conceptual)">
{`Server advertises tool: get_weather
Host lists it to the model as a function
Model calls get_weather → host → MCP tools/call → server`}
        </Example>
        <Callout variant="insight" title="Jargon: host">
          The <strong className="text-white">host</strong> is the AI application (desktop app, IDE, agent
          runtime) that owns the user session and embeds an MCP client.
        </Callout>
      </LessonSection>

      <LessonSection title="When to use which layer">
        <p className="text-slate-300">
          Use <strong className="text-white">function calling</strong> at the model boundary — it is how
          OpenAI, Anthropic, and others expose “pick a tool” in a single chat turn. Use{' '}
          <strong className="text-white">MCP</strong> when tool definitions and execution should survive across
          hosts and teams.
        </p>
        <Flowchart
          title="Decision guide"
          chart={`flowchart TB
  Q[Where does the tool live?] --> A[Inside your app only]
  Q --> B[Shared server for many hosts]
  A --> FC[Function calling / local code]
  B --> MCP[MCP server + host client]
  MCP --> FC2[Host still uses provider tool format toward model]`}
        />
        <ContentStep number={1} title="Resources and prompts">
          <p className="text-slate-300">
            Provider function calling is mostly about tools. MCP also standardizes{' '}
            <strong className="text-white">resources</strong> and <strong className="text-white">prompts</strong>{' '}
            — harder to replicate with a flat tools array alone.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Security boundary">
          <p className="text-slate-300">
            MCP puts auth, allowlists, and server isolation at the protocol edge. Function calling alone does
            not tell you how to run a subprocess or remote HTTP server safely.
          </p>
        </ContentStep>
        <Example title="Typical stack">
{`MCP filesystem server (portable)
→ Claude Desktop MCP client lists read_file
→ Host maps to Anthropic tool schema
→ Model emits tool_use
→ Host routes tools/call to filesystem server`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Function calling = model API mechanism; MCP = ecosystem protocol for tools/context.',
          'Hosts often bridge: MCP discovery → provider tool schemas → MCP execution.',
          'MCP also covers resources and prompts — broader than a single tools array.',
          'Choose both: provider tools for the model turn; MCP for portable server wiring.',
        ]}
      />
    </LessonArticle>
  )
}
