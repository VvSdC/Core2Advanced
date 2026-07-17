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

export function PuttingItTogetherA2a() {
  return (
    <LessonArticle>
      <Definition term="Putting it together — A2A mastery">
        <p>
          Mastery is knowing <strong className="text-white">when</strong> to speak A2A,{' '}
          <strong className="text-white">how</strong> to discover and delegate safely, and how A2A{' '}
          <strong className="text-white">complements MCP</strong> inside real products — not memorizing every
          evolving field name.
        </p>
        <p className="mt-2 text-slate-300">
          Recommended order of learning and adoption:{' '}
          <strong className="text-white">MCP first</strong> (give your agent hands), then{' '}
          <strong className="text-white">A2A</strong> (let agents hire each other across teams and vendors).
        </p>
      </Definition>

      <Callout variant="beginner" title="The one-line mastery test">
        Can you explain Agent Cards, task states, message parts, streaming, and auth — and draw MCP vs A2A
        without mixing them up?
      </Callout>

      <LessonSection title="Track recap map">
        <Flowchart
          title="What you covered"
          chart={`flowchart TB
  F[Foundations<br/>what / MCP vs A2A / interop / cards] --> C[Core<br/>tasks / parts / streaming / auth]
  C --> B[Building<br/>agent / hire / orchestrate / frameworks]
  B --> A[Advanced<br/>enterprise / landscape / pitfalls / mastery]`}
        />
        <ContentStep number={1} title="Foundations">
          <p className="text-slate-300">
            A2A is open Agent2Agent interop; MCP is tools; cards enable discovery.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Core">
          <p className="text-slate-300">
            Tasks lifecycle, parts/artifacts, async streaming, enterprise auth boundaries.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Building">
          <p className="text-slate-300">
            Publish an agent, hire specialists, orchestrate joins, bridge LangGraph-style graphs.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Advanced">
          <p className="text-slate-300">
            Registries and HITL, ACP→A2A landscape note, pitfalls, this checklist.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Ship checklist">
        <Example title="Before production A2A">
{`[ ] MCP tools solid for local capabilities
[ ] Agent Card accurate (skills, modalities, auth, streaming)
[ ] Task states observed end-to-end
[ ] Parts typed; artifacts validated
[ ] Cancel + timeouts defined
[ ] Approved catalog + least-privilege tokens
[ ] Trace ids + SLO alerts on stuck working
[ ] Version pin + link to official A2A docs for your release`}
        </Example>
        <CodeBlock title="Decision cheatsheet">
{`need tool/data?        -> MCP (or API)
need peer agent?       -> A2A (card + task)
need both?             -> normal (peer uses MCP inside)
unsure?                -> start MCP; add A2A at team/vendor boundary`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Mastery flash cards">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">A2A</strong> — Google-originated open protocol for agent discovery,
            delegation, collaboration.
          </li>
          <li>
            <strong className="text-white">MCP vs A2A</strong> — tools vs agents; complementary.
          </li>
          <li>
            <strong className="text-white">Agent Card</strong> — machine-readable capability profile.
          </li>
          <li>
            <strong className="text-white">Task states</strong> — submitted, working, completed, failed, …
          </li>
          <li>
            <strong className="text-white">Parts</strong> — text, files, structured data; artifacts endure.
          </li>
          <li>
            <strong className="text-white">Streaming / async</strong> — long work is first-class.
          </li>
          <li>
            <strong className="text-white">Auth</strong> — multi-vendor interop still needs identity &amp; policy.
          </li>
          <li>
            <strong className="text-white">ACP</strong> — historically merged/aligned with A2A under Linux
            Foundation (context).
          </li>
        </ul>
        <Flowchart
          title="Default adoption path"
          chart={`flowchart TB
  M[1. Learn + adopt MCP] --> Local[Agent can use tools]
  Local --> Boundary{Cross team or vendor agents?}
  Boundary -->|Not yet| Wait[Stay on MCP + internal APIs]
  Boundary -->|Yes| A2A[2. Adopt A2A]
  A2A --> Gov[Registry + auth + observe]
  Gov --> Improve[Iterate cards / skills / joins]`}
        />
      </LessonSection>

      <LessonSection title="What to do next">
        <ContentStep number={1} title="Verify against official docs">
          <p className="text-slate-300">
            Specs evolve. Re-read current A2A (and MCP) documentation before locking parsers and security
            reviews.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Build a tiny dual-role demo">
          <p className="text-slate-300">
            One agent with MCP tools that also publishes a card and one client that hires it — then add a second
            peer.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Add governance early">
          <p className="text-slate-300">
            Catalog, scopes, and traces are cheaper on day one than after five vendors are live.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Remember the order">
          <strong className="text-white">MCP first, then A2A.</strong> Hands before hiring. Tools before
          multi-vendor choreography.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Mastery = cards + tasks + parts + streaming + auth, with MCP vs A2A crystal clear.',
          'Adopt MCP first for tools; add A2A when agents cross team or vendor boundaries.',
          'Ship with registry, least privilege, lifecycle observability, and version pins.',
          'Concepts over folklore — always re-check official A2A documentation as specs evolve.',
        ]}
      />
    </LessonArticle>
  )
}
