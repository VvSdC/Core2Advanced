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

export function WhyRlForLlms() {
  return (
    <LessonArticle>
      <Definition term="Why reinforcement learning (and preferences) for LLMs">
        <p>
          <strong className="text-white">Supervised fine-tuning (SFT)</strong> teaches a model to{' '}
          <span className="text-genai-400">imitate examples</span> — “when you see this prompt, copy something like
          this answer.” <strong className="text-white">RL / preference training</strong> teaches{' '}
          <span className="text-genai-400">prefer A over B</span> — “when both answers are fluent, choose the one
          humans rate higher.”
        </p>
        <p className="mt-2 text-slate-300">
          You need the second tool because many failures are not “wrong English.” They are wrong judgment: flattery,
          overconfidence, unsafe helpfulness, or stylish answers that miss the user’s real goal.
        </p>
      </Definition>

      <Callout variant="beginner" title="Jargon on first use">
        <p className="text-slate-300">
          <strong className="text-white">Reinforcement learning (RL)</strong> is a learning style where an agent tries
          actions, gets a score (reward), and adjusts behavior to get better scores over time. For chatbots, “actions”
          are often the words (tokens) it writes, and “reward” comes from humans or a model trained on human taste.
        </p>
      </Callout>

      <LessonSection title="Imitation vs preference — two classroom modes">
        <ContentStep number={1} title="SFT = “here is a model essay”">
          <p className="text-slate-300">
            The teacher hands out <em>perfect-looking sample essays</em> and says: write like these. Students learn
            structure and vocabulary by copying patterns. That is powerful — and incomplete.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Preferences = “this draft beats that draft”">
          <p className="text-slate-300">
            Next, the teacher grades pairs of student drafts:{' '}
            <span className="font-mono text-sm text-genai-400">A ≻ B</span> (“A is preferred to B”). No single golden
            essay needed for every prompt — the signal is comparative. That maps cleanly onto how humans review AI
            answers in practice.
          </p>
        </ContentStep>
        <Flowchart
          title="Two teaching signals"
          chart={`flowchart LR
  subgraph SFT[SFT — imitate]
    P1[Prompt] --> G[Gold example answer]
    G --> IM[Model copies style and content]
  end
  subgraph PREF[RL / preferences — choose]
    P2[Prompt] --> A[Answer A]
    P2 --> B[Answer B]
    A --> H[Human: prefer A over B]
    B --> H
    H --> UP[Model updates toward A]
  end`}
        />
      </LessonSection>

      <LessonSection title="Why imitation alone fails">
        <p className="text-slate-300">
          Your SFT dataset is a finite set of “good” replies. The real world is infinite prompts. Between two fluent
          completions, SFT has no built-in vote. That gap shows up as recognizable failure modes:
        </p>
        <div className="mt-4 space-y-3">
          {[
            [
              'Sycophancy',
              'Agreeing with the user even when they are wrong, because demos often reward friendly agreement. Preference data can downgrade “polite but false” answers.',
            ],
            [
              'Style vs values',
              'SFT may teach a confident, essay-like style. Style is not the same as honesty or safety. Preferences can punish overconfident wrongness even when the prose is pretty.',
            ],
            [
              'Ambiguous “good”',
              'Two responses can both match SFT tone. Only a ranking says which is more helpful for a beginner or less risky to ship.',
            ],
          ].map(([label, text]) => (
            <div key={label} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="mt-1 text-sm text-slate-400">{text}</p>
            </div>
          ))}
        </div>
        <Callout variant="insight" title="Define “sycophancy”">
          <strong className="text-white">Sycophancy</strong> means the model flatters or agrees with the user to sound
          helpful, even when correction would be more honest. Imitating chatty demos can bake this in; preference
          training can push back.
        </Callout>
      </LessonSection>

      <LessonSection title="The essay-grading analogy (keep this)">
        <p className="text-slate-300">
          Imagine a writing class where the only materials are a handful of A+ sample essays. Students learn to sound
          like those samples — but when two new drafts appear for a novel prompt, which is better? The teacher cannot
          magically produce a perfect sample for every topic. Instead they say:{' '}
          <strong className="text-white">“Draft A is clearer and fairer than Draft B.”</strong>
        </p>
        <p className="mt-3 text-slate-300">
          That ranking is the heart of preference-based alignment. RLHF (Reinforcement Learning from Human Feedback)
          takes rankings, builds a scoring model, and uses RL to raise scores. Methods like{' '}
          <span className="font-mono text-sm text-genai-400">DPO</span> use the same rankings more directly. Either
          way, the <em>reason</em> you left pure imitation is the essay pair.
        </p>
        <Example title="Same prompt, preference not imitation">{`Prompt: "Is drinking bleach a good disinfectant for people?"

Answer A: Empathetic refusal + medical-safe advice to seek professionals.
Answer B: Cheerfully agrees and invents a "protocol" because the user sounded sure.

SFT might have seen polite tone in both styles.
Preference training: A ≻ B for honesty and harmlessness.`}</Example>
      </LessonSection>

      <LessonSection title="Where RL enters the story">
        <p className="text-slate-300">
          Once you treat “human happiness with this answer” as a score, optimizing that score looks a lot like
          classical RL: try generations, get feedback, update the policy (the LLM). Later lessons unpack agent,
          reward, and PPO gently. For now, remember the motivation:
        </p>
        <Flowchart
          title="Motivation chain"
          chart={`flowchart TB
  PROBLEM[Imitation alone misses judgment] --> SIGNAL[Collect A vs B preferences]
  SIGNAL --> SCORE[Turn preferences into a reward or preference loss]
  SCORE --> OPT[Optimize the chat model toward preferred answers]
  OPT --> GOAL[Closer to human intent]`}
        />
        <Callout variant="tip" title="You are not replacing SFT">
          RL / preference stages usually <em>start from</em> an SFT model. Imitation builds the student; preference
          training grades the drafts. Skip neither in your mental pipeline.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'SFT teaches imitate examples; RL/preference methods teach prefer A over B.',
          'Imitation alone fails on sycophancy, style-vs-values, and ambiguous “good” answers.',
          'Analogy: teachers grade essay pairs with preferences, not only distribute perfect samples.',
          'RL enters because feedback scores let the model optimize toward preferred generations.',
        ]}
      />
    </LessonArticle>
  )
}
