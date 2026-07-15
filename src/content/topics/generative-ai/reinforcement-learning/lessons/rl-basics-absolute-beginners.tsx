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

export function RlBasicsAbsoluteBeginners() {
  return (
    <LessonArticle>
      <Definition term="Reinforcement learning (absolute beginner view)">
        <p>
          <strong className="text-white">Reinforcement learning (RL)</strong> is learning by{' '}
          <span className="text-genai-400">trying, scoring, and improving</span>. An{' '}
          <strong className="text-white">agent</strong> chooses <strong className="text-white">actions</strong> in an{' '}
          <strong className="text-white">environment</strong>, observes a{' '}
          <strong className="text-white">state</strong>, receives a <strong className="text-white">reward</strong>, and
          updates its <strong className="text-white">policy</strong> (its strategy) to earn more reward over time.
        </p>
        <p className="mt-2 text-slate-300">
          For chatbots, think: the agent is the LLM, the environment is the conversation + scoring setup, actions are
          the next pieces of text it writes, and reward is “how much humans (or a trained scorer) liked that.”
        </p>
      </Definition>

      <Callout variant="beginner" title="No maze required">
        Textbook RL often shows a robot in a maze. Keep the maze if it helps, then immediately remap every word to
        chat — that remapping is the whole point of this lesson.
      </Callout>

      <LessonSection title="The six words — mapped to chatbots">
        <ContentStep number={1} title="Agent">
          <p className="text-slate-300">
            The decision-maker. In LLM RL, the <strong className="text-white">agent</strong> is usually the language
            model you are training (sometimes called the{' '}
            <span className="font-mono text-sm text-genai-400">policy model</span>).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Environment">
          <p className="text-slate-300">
            Everything outside the agent that reacts to its actions. For chat: the user prompt, chat history, and the
            machinery that scores the reply. The environment “replies” with the next state and a reward signal.
          </p>
        </ContentStep>
        <ContentStep number={3} title="State">
          <p className="text-slate-300">
            What the agent can see right now. Commonly: the current prompt plus conversation so far (the context
            tokens). After each action, the state grows — more words appear in the draft.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Action">
          <p className="text-slate-300">
            What the agent chooses. Classic RL: move left/right. LLM RL: often pick the{' '}
            <strong className="text-white">next token</strong> (a token is a chunk of text the model generates — a word
            or piece of a word). Sometimes people treat “generate the whole answer” as one big action for intuition.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Reward">
          <p className="text-slate-300">
            A number that says “how good was that?” Higher is better. Humans may label answers, or a{' '}
            <strong className="text-white">reward model</strong> (a scorer trained on human preferences) assigns the
            number. Details come in the reward-signals lesson.
          </p>
        </ContentStep>
        <ContentStep number={6} title="Policy">
          <p className="text-slate-300">
            The strategy mapping states → actions. For an LLM, the policy is basically “given this context, which
            next tokens does the model prefer?” Training adjusts those preferences.
          </p>
        </ContentStep>
        <Flowchart
          title="Chatbot RL in one gentle loop"
          chart={`flowchart TB
  STATE[State: prompt + so far] --> POLICY[Policy LLM]
  POLICY --> ACTION[Action: next token / continue text]
  ACTION --> ENV[Environment: conversation + scorer]
  ENV --> REWARD[Reward: liked or not]
  ENV --> STATE2[New state: longer reply]
  REWARD --> UPDATE[Update policy to seek reward]
  STATE2 --> POLICY`}
        />
      </LessonSection>

      <LessonSection title="Episode — a conversation turn or a generation">
        <p className="text-slate-300">
          An <strong className="text-white">episode</strong> is one full “attempt” from start to finish in the
          environment. In games: one playthrough. For LLM alignment, an episode is often:{' '}
          <span className="text-genai-400">one prompt → generate a full answer → receive a score</span>. Sometimes
          people zoom in and call each token step a micro-step inside that episode.
        </p>
        <Example title="Episode mental picture">{`Episode start: user asks "Explain baking soda vs baking powder."
Agent generates tokens until the answer ends (or max length).
Episode end: reward model (or human) scores the whole answer.
Goal of training: make future episodes score higher on average.`}</Example>
        <Callout variant="insight" title="Goal in one sentence">
          Maximize <strong className="text-white">expected reward over time</strong> — not just one lucky good answer,
          but better behavior across many prompts.
        </Callout>
      </LessonSection>

      <LessonSection title="Classical RL vs LLM RL — what feels different">
        <p className="text-slate-300">
          The vocabulary stays the same; the scales explode. In a maze, maybe four actions. In open text, at each step
          the model chooses among tens of thousands of tokens — a{' '}
          <strong className="text-white">huge action space</strong>. Rewards are also weird: often you only score the{' '}
          <em>finished</em> answer (sparse feedback), not every single token.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Idea</th>
                <th className="px-4 py-3">Classic textbook</th>
                <th className="px-4 py-3">LLM chatbot</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Agent', 'Robot / player', 'Language model being optimized'],
                ['Action', 'Move / jump', 'Next token (or whole reply)'],
                ['State', 'Position on map', 'Prompt + partial generation'],
                ['Reward', 'Points / finish', 'Human or reward-model score'],
                ['Difficulty', 'Few discrete moves', 'Huge token vocabulary'],
              ].map(([idea, classic, llm]) => (
                <tr key={idea} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-genai-400">{idea}</td>
                  <td className="px-4 py-3">{classic}</td>
                  <td className="px-4 py-3 text-white">{llm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Flowchart
          title="Same loop, different scale"
          chart={`flowchart LR
  CLASSIC[Classic RL<br/>few actions] --> SAME[Same: try → score → improve]
  LLM[LLM RL<br/>huge token space] --> SAME
  SAME --> CARE[Careful updates<br/>stay fluent]`}
        />
        <Callout variant="tip" title="Why “careful updates” matter">
          If you chase reward too greedily, the model can break fluent language (gibberish that tricks a scorer). Later
          PPO lessons cover the “stay close to the good student” trick. For now: goal = reward, constraint = still
          sound like a coherent assistant.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RL: agent acts in an environment, gets reward, updates a policy to maximize reward over time.',
          'Chatbot map: LLM = agent/policy; context = state; tokens = actions; human/RM score = reward.',
          'An episode is often one prompt → full generation → score.',
          'LLM RL differs mainly by huge token action spaces and often end-of-answer rewards.',
        ]}
      />
    </LessonArticle>
  )
}
