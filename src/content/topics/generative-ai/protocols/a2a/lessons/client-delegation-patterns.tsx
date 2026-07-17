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

export function ClientDelegationPatterns() {
  return (
    <LessonArticle>
      <Definition term="Client delegation">
        <p>
          As an <strong className="text-white">A2A client</strong>, your agent{' '}
          <strong className="text-white">hires specialist peers</strong>: discover an Agent Card, authenticate,
          create a task with the right message parts, then fold artifacts back into your own plan.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a general contractor. You do not personally pour concrete; you subcontract, check progress,
          and own the final building for the customer.
        </p>
      </Definition>

      <Callout variant="beginner" title="Hire, do not hoard">
        Delegation is a feature. If a peer already masters compliance review, do not rebuild it as a tool soup.
      </Callout>

      <LessonSection title="Core hire loop">
        <Flowchart
          title="Discover → match → task → integrate"
          chart={`flowchart TB
  Goal[User / parent goal] --> Need{Need specialist?}
  Need -->|No| Local[Handle locally + MCP tools]
  Need -->|Yes| Disc[Discover Agent Cards]
  Disc --> Match[Match skills + modalities + auth]
  Match --> Task[Send A2A task]
  Task --> Wait[Stream / poll lifecycle]
  Wait --> Merge[Merge artifacts into answer]`}
        />
        <ContentStep number={1} title="Decide to delegate">
          <p className="text-slate-300">
            Trigger on skill gaps, policy (&quot;legal must review&quot;), or cost (cheap specialist vs giant
            local model).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Select a peer">
          <p className="text-slate-300">
            Filter catalog by skill id, streaming needs, and auth you can satisfy.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Package the brief">
          <p className="text-slate-300">
            Clear text instructions + necessary files + structured constraints (deadlines, formats).
          </p>
        </ContentStep>
        <ContentStep number={4} title="Integrate results">
          <p className="text-slate-300">
            Validate artifacts, cite the peer, continue your local reasoning or next delegation.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Delegation patterns">
        <Example title="Pattern names">
{`1. Single specialist hire
   Planner → Research agent → answer

2. Sequential specialists
   Draft → Legal review → Publish formatter

3. Competitive hire (advanced)
   Ask two peers same brief → pick better artifact

4. Fallback chain
   Preferred peer fails → secondary peer → human`}
        </Example>
        <CodeBlock title="Conceptual router">
{`def hire(goal, catalog):
    peers = [c for c in catalog if matches(goal, c.skills)]
    for peer in rank(peers):
        try:
            task = a2a.send_task(peer, brief(goal))
            return await_success(task)
        except DelegationError:
            continue
    escalate_to_human(goal)`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Brief-writing tips">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">State the output contract</strong> — &quot;return JSON with fields
            X,Y&quot; via a data-oriented ask.
          </li>
          <li>
            <strong className="text-white">Do not overshare</strong> — send least privilege parts; strip secrets.
          </li>
          <li>
            <strong className="text-white">Include success criteria</strong> — peers guess less when constraints
            are explicit.
          </li>
        </ul>
        <Callout variant="tip" title="Keep a specialist map">
          Maintain an internal catalog: skill → preferred Agent Card → backup. Routers should not scrape the
          open web on every request.
        </Callout>
      </LessonSection>

      <LessonSection title="When not to delegate">
        <Flowchart
          title="Keep it local"
          chart={`flowchart TB
  Q[Should I hire via A2A?] --> S{Sensitive data / no approved peer?}
  S -->|Yes| Local[Stay local or human]
  S -->|No| C{Capability already MCP-local?}
  C -->|Yes| MCP[Call tools yourself]
  C -->|No| A2A[Delegate with A2A]`}
        />
        <p className="mt-3 text-slate-300">
          Next: composing many hires into orchestration graphs — still on A2A rails.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Client delegation = discover card, auth, send task, merge artifacts — hire specialists.',
          'Patterns: single hire, sequential chain, competitive hire, fallback chain.',
          'Write tight briefs with output contracts and least-privilege parts.',
          'Do not delegate when policy, privacy, or local MCP tools already suffice.',
        ]}
      />
    </LessonArticle>
  )
}
