import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ReinforcementLearningIntro() {
  return (
    <LessonArticle>
      <Definition term="Reinforcement Learning">
        <p>
          In <strong className="text-white">reinforcement learning (RL)</strong>, an{' '}
          <strong className="text-white">agent</strong> learns by interacting with an{' '}
          <strong className="text-white">environment</strong>. It chooses{' '}
          <strong className="text-white">actions</strong>, receives{' '}
          <strong className="text-white">rewards</strong> (or penalties), and improves its strategy
          — called a <strong className="text-white">policy</strong> — to earn more reward over time.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: learning to ride a bike by trying, falling, adjusting — not by memorizing a labeled
          spreadsheet of “correct handlebar angles.”
        </p>
      </Definition>

      <LessonSection title="The agent–environment loop">
        <Flowchart
          title="Observe → act → get reward → learn"
          chart={`flowchart TB
  A[Environment state] --> B[Agent]
  B --> C[Action]
  C --> D[Environment]
  D --> E[New state + reward]
  E --> B`}
        />
        <ContentStep number={1} title="State">
          <p className="text-slate-300">
            What the agent can observe right now — board position, robot sensor readings, screen
            pixels.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Action">
          <p className="text-slate-300">
            What the agent can do — move a piece, turn left, recommend a video.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Reward">
          <p className="text-slate-300">
            A number that says how good that step was — +1 for a win, −1 for a crash, small step
            penalties to encourage efficiency.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="How RL differs from supervised learning">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3"></th>
                <th className="px-4 py-3">Supervised</th>
                <th className="px-4 py-3">Reinforcement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Feedback', 'Correct label each example', 'Reward after actions (often delayed)'],
                ['Data', 'Fixed dataset', 'Data gathered by acting'],
                ['Goal', 'Match labels', 'Maximize cumulative reward'],
                ['Exploration', 'Not required', 'Must try new actions to learn'],
              ].map(([row, sup, rl]) => (
                <tr key={row} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{row}</td>
                  <td className="px-4 py-3">{sup}</td>
                  <td className="px-4 py-3">{rl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight" title="Credit assignment">
          Rewards may arrive late (win the game only at the end). The agent must figure out which
          earlier moves deserved credit — a core RL challenge.
        </Callout>
      </LessonSection>

      <LessonSection title="Exploration vs exploitation">
        <p className="text-slate-300">
          Should the agent use what already works (<strong className="text-white">exploit</strong>)
          or try something new (<strong className="text-white">explore</strong>)? Too little
          exploration → stuck in a mediocre strategy. Too much → never cash in on what it learned.
        </p>
        <Flowchart
          title="A constant trade-off"
          chart={`flowchart TB
  A[Current policy] --> B{Explore or exploit?}
  B -- Exploit --> C[Pick best-known action]
  B -- Explore --> D[Try something new]
  C --> E[Update with reward]
  D --> E
  E --> A`}
        />
        <Example title="Where you see RL ideas">
{`Games:     AlphaGo / game AIs learn by self-play
Robotics:  walking, grasping through trial and error
Ads / recs: some systems treat clicks as rewards
Ops:       adjusting resources to maximize uptime`}
        </Example>
        <Callout variant="beginner">
          For this intro track, remember the cast: agent, environment, actions, rewards, policy. Deep
          RL algorithms come later.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RL agents learn by acting in an environment and receiving rewards.',
          'A policy maps states to actions; training improves the policy over time.',
          'Feedback can be delayed — the agent must assign credit to earlier actions.',
          'Exploration vs exploitation is a central trade-off in reinforcement learning.',
        ]}
      />
    </LessonArticle>
  )
}
