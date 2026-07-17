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

export function MultiAgentOrchestrationA2a() {
  return (
    <LessonArticle>
      <Definition term="Multi-agent orchestration with A2A">
        <p>
          <strong className="text-white">Orchestration</strong> is coordinating several agents toward one goal.
          With A2A, the orchestrator treats peers as <strong className="text-white">protocol collaborators</strong>{' '}
          — each with cards, tasks, and lifecycles — not as hard-coded function calls to one codebase.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a film director. Actors (agents) are independent professionals; the director sequences
          scenes (tasks) and cuts the final film (merged artifacts).
        </p>
      </Definition>

      <Callout variant="beginner" title="Orchestrator vs peer">
        One agent usually plays director. Others play specialists. Directors still may expose their own Agent
        Card to upstream systems.
      </Callout>

      <LessonSection title="Topology choices">
        <ContentStep number={1} title="Hub-and-spoke">
          <p className="text-slate-300">
            Central orchestrator fans out A2A tasks and merges results. Simplest to audit.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Pipeline">
          <p className="text-slate-300">
            Output artifacts of agent N become message parts for agent N+1.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Hierarchy">
          <p className="text-slate-300">
            Mid-level agents both receive tasks and hire sub-peers — nested A2A.
          </p>
        </ContentStep>
        <Flowchart
          title="Hub-and-spoke on A2A"
          chart={`flowchart TB
  User[User goal] --> Orch[Orchestrator agent]
  Orch -->|A2A task| R[Research peer]
  Orch -->|A2A task| C[Coding peer]
  Orch -->|A2A task| V[Review peer]
  R --> Orch
  C --> Orch
  V --> Orch
  Orch --> Answer[Final answer]`}
        />
      </LessonSection>

      <LessonSection title="State you must track">
        <Example title="Orchestrator notebook">
{`goal_id: trip-42
children:
  - task hotel-7   peer=hotels  state=completed
  - task flight-9  peer=flights state=working
  - task budget-3  peer=finance state=submitted
merge_policy: all_success_or_escalate
cancel_policy: cancel_children_on_user_abort`}
        </Example>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Map <strong className="text-white">parent goal → child task ids</strong>.
          </li>
          <li>
            Define <strong className="text-white">join rules</strong> — wait for all, race first success, or
            quorum.
          </li>
          <li>
            Propagate <strong className="text-white">cancel</strong> so peers stop spending money.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Conceptual orchestration loop">
        <CodeBlock title="Director pseudocode">
{`async def run_goal(goal):
    plan = decompose(goal)                 # which skills needed
    tasks = []
    for step in plan:
        peer = select_peer(step.skill)
        tasks.append(a2a.send_task(peer, step.brief))
    results = await join(tasks, policy="all")
    if any_failed(results):
        return repair_or_escalate(results)
    return synthesize(results.artifacts)`}
        </CodeBlock>
        <Callout variant="insight" title="Protocol vs planner">
          A2A moves bytes and states between agents. Your planner (LLM graph, rules, or workflow engine)
          decides <em>whom</em> to call and <em>in what order</em>.
        </Callout>
      </LessonSection>

      <LessonSection title="Failure and partial success">
        <Flowchart
          title="Join policies"
          chart={`flowchart TB
  Children[Child A2A tasks] --> Pol{Join policy}
  Pol -->|all| All[Fail parent if any child fails]
  Pol -->|any| Any[First completed wins; cancel rest]
  Pol -->|best_effort| BE[Merge successes; flag gaps]
  All --> Out[Parent artifact / escalate]
  Any --> Out
  BE --> Out`}
        />
        <ContentStep number={1} title="Avoid infinite agent ping-pong">
          <p className="text-slate-300">
            Cap depth and hops. Nested A2A without budgets becomes a money furnace.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Keep a single customer-facing narrative">
          <p className="text-slate-300">
            Users see one story; internals may be many tasks. Stream orchestrator-level status, not raw peer
            noise, unless debugging.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Orchestration coordinates many A2A peers via tasks, joins, and cancel policies.',
          'Topologies: hub-and-spoke, pipeline, hierarchy — pick for auditability and latency.',
          'Track parent↔child task ids; A2A is the wire, your planner chooses order.',
          'Cap hops, define join/failure policy, and synthesize one user-facing result.',
        ]}
      />
    </LessonArticle>
  )
}
