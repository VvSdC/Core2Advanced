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
} from '../../../../../components/content'

export function RewardModeling() {
  return (
    <LessonArticle>
      <Definition term="Reward modeling">
        <p>
          <strong className="text-white">Reward modeling</strong> takes human{' '}
          <strong className="text-white">preference pairs</strong> — for the same prompt, a{' '}
          <span className="text-genai-400">winning</span> response and a{' '}
          <span className="text-genai-400">losing</span> response — and trains a model that outputs a{' '}
          <strong className="text-white">score</strong>. High score should mean “looks like something humans would
          prefer.”
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: you never force the grading machine to write essays. You show it winning vs losing papers until it
          can stamp a number that roughly matches the coaching staff’s taste.
        </p>
      </Definition>

      <Callout variant="beginner" title="Why invent an RM at all?">
        Humans are slow. RL needs many scored samples. A reward model is a fast, imperfect clone of human taste you can
        query during training.
      </Callout>

      <LessonSection title="From preference pairs to a score model">
        <ContentStep number={1} title="Gather pairs">
          <p className="text-slate-300">
            For each prompt, generate or write two (or more) answers. Annotators choose which is better, or rank a
            small set. Store <span className="font-mono text-sm text-genai-400">prompt, chosen, rejected</span>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Train to prefer winners">
          <p className="text-slate-300">
            The RM reads prompt + answer and outputs a number. Training pushes{' '}
            <strong className="text-white">score(chosen) &gt; score(rejected)</strong> on average. After training, freeze
            (or slowly update) the RM and use it as a scorer.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Use scores in RL">
          <p className="text-slate-300">
            The policy generates new answers; the RM scores them; RL updates the policy. Bad RM → bad coaching. Great
            SFT policy cannot fully save a systematically wrong taste model.
          </p>
        </ContentStep>
        <Flowchart
          title="Preference pairs → reward model → scores"
          chart={`flowchart TB
  P[Prompt] --> W[Winning response]
  P --> L[Losing response]
  W --> TRAIN[Train RM: favor winners]
  L --> TRAIN
  TRAIN --> RM[Reward model]
  NEW[New policy answer] --> RM
  RM --> S[Scalar reward score]`}
        />
      </LessonSection>

      <LessonSection title="Winning vs losing — what the data means">
        <Example title="Conceptual preference pair">{`prompt:   "My friend seems depressed. What should I say?"
chosen:   Empathetic, suggests professional help, avoids diagnosing.
rejected: Jokes it off, or gives dangerous DIY medical advice.

The RM should learn: chosen scores higher than rejected.`}</Example>
        <p className="mt-4 text-slate-300">
          Important: <strong className="text-white">losing</strong> is not always “factually wrong.” Often both answers
          are fluent; the loser is less helpful, less honest, or less safe. That is exactly the judgment SFT alone
          struggled to encode.
        </p>
      </LessonSection>

      <LessonSection title="Bradley-Terry intuition (almost no math)">
        <p className="text-slate-300">
          The <strong className="text-white">Bradley-Terry</strong> idea (from sports ranking) says: if two players
          have strength numbers, the probability that A beats B grows when A’s strength is higher than B’s. Reward
          models borrow the same story for answers: treat the RM score as “strength,” and train so that winners beat
          losers more often under that probability story.
        </p>
        <CodeBlock title="Word version — ignore symbols if you want">{`# Idea only:
# If score(A) is much higher than score(B),
# we treat A as very likely to be the human's pick.
#
# Training: nudge the RM so for each labeled pair,
# score(winner) rises relative to score(loser).
#
# You do not need to derive the formula to use libraries.`}</CodeBlock>
        <Callout variant="insight" title="If you see a σ or a difference of scores">
          Read it as: “turn the gap between two scores into a probability that A wins.” Bigger sensible gap → model
          more confidently expects humans to pick A. That is enough for now.
        </Callout>
        <Flowchart
          title="Bradley-Terry mental model"
          chart={`flowchart LR
  SA[Score of A] --> GAP[Compare scores]
  SB[Score of B] --> GAP
  GAP --> PROB[Prob A preferred over B]
  PROB --> FIT[Fit to human labels]`}
        />
      </LessonSection>

      <LessonSection title="Overfitting RMs and reward hacking — teaser">
        <p className="text-slate-300">
          If the RM memorizes quirks of the preference set, or the policy learns tricks that fool the RM without
          pleasing real users, you get <strong className="text-white">reward hacking</strong>: high scores, worse
          product. Classic tells include endless verbosity, sycophantic flattery, or weird phrases that somehow boost
          RM numbers.
        </p>
        <Flowchart
          title="Healthy vs hacked loop"
          chart={`flowchart TB
  GOOD[Good RM] --> ALIGN[Policy improves for users]
  BAD[Overfit / shallow RM] --> HACK[Policy fools the score]
  HACK --> RISK[Looks great on RM, poor in prod]
  ALIGN --> EVAL[Human eval still required]`}
        />
        <Callout variant="tip" title="Preview of the challenges lesson">
          Always keep a human (or trusted offline) evaluation set the training loop did not directly optimize against.
          The RM is a teacher’s assistant — not the principal.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Reward modeling trains a scorer from winning vs losing preference pairs.',
          'At use time the RM maps (prompt, answer) → number for RL.',
          'Bradley-Terry intuition: higher score means more likely to beat the alternative — no deep math required.',
          'Overfit RMs invite reward hacking; hold out real human evals.',
        ]}
      />
    </LessonArticle>
  )
}
