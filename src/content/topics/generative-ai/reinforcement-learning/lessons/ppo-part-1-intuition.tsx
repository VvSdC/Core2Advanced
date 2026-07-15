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

export function PpoPart1Intuition() {
  return (
    <LessonArticle>
      <Definition term="PPO intuition (no deep math)">
        <p>
          <strong className="text-white">PPO</strong> (Proximal Policy Optimization) is a reinforcement-learning
          method that improves a <strong className="text-white">policy</strong> — here, the LLM being optimized —
          using reward scores, while taking <span className="text-genai-400">small, controlled steps</span> so
          training does not destroy language quality.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a gifted student (SFT model) enters a scoring contest. A coach raises scores carefully. If you only
          scream “maximize points!” the student may invent weird tricks. PPO’s spirit is:{' '}
          <em>improve, but do not wander too far from the good student you already have</em>.
        </p>
      </Definition>

      <Callout variant="beginner" title="Policy = the LLM">
        In this track, <strong className="text-white">policy</strong> almost always means the chat model whose
        weights you are updating during RL. Different jargon, same “brain producing answers.”
      </Callout>

      <LessonSection title="Why pure reward maximization breaks language">
        <p className="text-slate-300">
          The reward model is imperfect. If the only instruction is “get the highest RM score,” the policy can{' '}
          <strong className="text-white">exploit loopholes</strong>: rambling length, repetitive flattery, strange
          phrases the RM likes, or collapsing into nonsense that luckily scores high on a buggy teacher. Humans then
          hate the answers even when the number looks great.
        </p>
        <Flowchart
          title="Greedy reward chasing"
          chart={`flowchart TB
  POL[Policy tries answers] --> RM[Reward model score]
  RM -->|Higher!| GREED[Push harder for score]
  GREED --> HACK[Exploit RM quirks]
  HACK --> BAD[Broken or junk language]
  BAD --> HUM[Humans unhappy]`}
        />
        <Example title="Toy failure mode">{`RM secretly likes very long answers.
Policy learns: pad every reply with filler.
RM score ↑ . User experience ↓ .

That is reward hacking — greedy maximization without anchors.`}</Example>
      </LessonSection>

      <LessonSection title="KL penalty — stay close to the good student">
        <p className="text-slate-300">
          A <strong className="text-white">KL penalty</strong> (KL is short for{' '}
          <strong className="text-white">Kullback–Leibler divergence</strong> — a measure of “how different two
          probability distributions are”) adds a cost when the new policy’s word choices drift far from a{' '}
          <strong className="text-white">reference model</strong>, usually the SFT model.
        </p>
        <p className="mt-3 text-slate-300">
          Plain English: every training step hears two voices — “earn reward” and “don’t sound unlike the trusted SFT
          student.” If you wander too far, the KL term pulls you back.
        </p>
        <Flowchart
          title="Reward vs stay-near-SFT"
          chart={`flowchart LR
  REW[Earn reward] --> MIX[Combined training objective]
  KL[KL: stay near reference / SFT] --> MIX
  MIX --> SAFE[Higher preference without gibberish]`}
        />
        <Callout variant="insight" title="Student leash metaphor">
          Think of a leash on a curious puppy. Reward is the interesting park. The leash (KL) stops a sprint into
          traffic. Too tight a leash → almost no learning. Too loose → chaos. Tuning that balance is much of RLHF
          craft.
        </Callout>
      </LessonSection>

      <LessonSection title="Actor-critic at a high level only">
        <ContentStep number={1} title="Actor">
          <p className="text-slate-300">
            The <strong className="text-white">actor</strong> is the policy — the LLM choosing tokens / answers. It
            acts.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Critic">
          <p className="text-slate-300">
            The <strong className="text-white">critic</strong> is a helper that estimates how good a situation looks
            (often called a value estimate). Intuition: a co-pilot whispering “this prompt is heading for a strong /
            weak outcome,” which stabilizes learning compared to using raw rewards alone.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Why both">
          <p className="text-slate-300">
            Rewards are noisy and delayed. The critic smooths the learning signal so the actor knows whether a
            surprise score was truly impressive relative to expectations. You do not need the equations — remember{' '}
            <span className="text-genai-400">actor acts; critic evaluates</span>.
          </p>
        </ContentStep>
        <Flowchart
          title="Actor-critic cartoon"
          chart={`flowchart TB
  STATE[Conversation state] --> ACTOR[Actor / policy LLM]
  STATE --> CRITIC[Critic / value helper]
  ACTOR --> ANS[Generated answer]
  ANS --> RM[Reward model]
  RM --> LEARN[Learning signal]
  CRITIC --> LEARN
  LEARN --> ACTOR`}
        />
        <Callout variant="tip" title="Optional depth">
          Advanced courses detail advantage estimates and value heads. Skip them until the story of reward + KL +
          careful updates feels solid.
        </Callout>
      </LessonSection>

      <LessonSection title="What PPO is trying to feel like">
        <p className="text-slate-300">
          “Proximal” means <em>nearby</em>. PPO prefers updates that do not teleport the policy to a distant strange
          world. Combined with the KL tether to SFT, you get the ChatGPT-era recipe’s spirit:{' '}
          <strong className="text-white">optimize preferences without forgetting English.</strong>
        </p>
        <Flowchart
          title="Intuition stack"
          chart={`flowchart TB
  SFT[Start from good SFT student] --> SAMPLE[Try new answers]
  SAMPLE --> SCORE[Score with RM]
  SCORE --> UPDATE[PPO-style careful update]
  UPDATE --> KL[Respect KL leash]
  KL --> BETTER[Slightly more preferred student]
  BETTER --> SAMPLE`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'Policy = the LLM being optimized during RL.',
          'Pure reward max can break language via reward hacking of an imperfect RM.',
          'KL penalty = cost for wandering far from the SFT/reference — “leash the student.”',
          'Actor-critic: actor chooses answers; critic helps evaluate — high level only for now.',
        ]}
      />
    </LessonArticle>
  )
}
