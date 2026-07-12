import {
  Callout,
  ContentStep,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2203.02155'

export function InstructGptRLHF() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Training Language Models to Follow Instructions with Human Feedback"
        authors="Ouyang et al. (OpenAI)"
        year="2022"
        venue="InstructGPT"
        url={PAPER_URL}
      >
        Explains how GPT-3 became <strong className="text-white">ChatGPT</strong> — three training stages
        that make models helpful, honest, and safe to talk to.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        GPT-3 could do tasks but was hard to control — verbose, toxic, or unhelpful. This paper explains the
        alignment pipeline behind every chatbot you use. Read after <em>GPT-3</em> and <em>LLMs</em>.
      </Callout>

      <LessonSection title="Background — raw models are not chatbots">
        <p>
          A pre-trained model like GPT-3 predicts the next token on internet text. Internet text includes
          Reddit arguments, spam, and code — so the model may continue a prompt with something unhelpful or
          harmful, even when the user wants a concise answer.
        </p>
        <p className="mt-3">
          InstructGPT asked: <em>how do we train the model to be helpful, truthful, and harmless when
          following user instructions?</em>
        </p>
      </LessonSection>

      <LessonSection title="The three-stage pipeline (RLHF)">
        <Flowchart
          title="From GPT-3 to InstructGPT"
          chart={`flowchart TB
  A["Stage 1: Supervised Fine-Tuning (SFT)"] --> B["Human writes ideal answers to prompts"]
  B --> C["Train model to imitate those answers"]
  C --> D["Stage 2: Reward Model (RM)"]
  D --> E["Humans rank multiple answers best to worst"]
  E --> F["Train a scorer that predicts human preferences"]
  F --> G["Stage 3: PPO Reinforcement Learning"]
  G --> H["Model generates answers, reward model scores them"]
  H --> I["Update model to maximise reward → InstructGPT"]`}
        />

        <ContentStep number={1} title="Stage 1 — Supervised Fine-Tuning (SFT)">
          <p>
            Human labelers write ideal responses to real prompts (questions, instructions, tasks). The model
            is fine-tuned to imitate these demonstrations. This alone makes the model much more helpful —
            but quality is limited by how many examples humans can write.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Stage 2 — Reward Model (RM)">
          <p>
            For the same prompt, the model generates several answers. Humans rank them from best to worst.
            A separate <strong className="text-white">reward model</strong> is trained to predict these
            rankings — it learns a scoring function that approximates human preferences at scale.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Stage 3 — Reinforcement Learning (PPO)">
          <p>
            The language model generates answers, the reward model scores them, and the model is updated via{' '}
            <strong className="text-white">Proximal Policy Optimisation (PPO)</strong> to produce higher-scoring
            outputs. This is <strong className="text-white">RLHF</strong> — Reinforcement Learning from Human
            Feedback. The model improves beyond what imitation alone can achieve.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Key results">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">1.3B InstructGPT preferred over 175B GPT-3</strong> — humans rated the aligned small model as more helpful than the raw large one.</li>
          <li><strong className="text-white">Better truthfulness</strong> — fewer hallucinated facts on closed-book QA.</li>
          <li><strong className="text-white">Less toxic</strong> — reduced biased and offensive outputs.</li>
          <li><strong className="text-white">Slight capability trade-off</strong> — alignment can marginally hurt some benchmarks ("alignment tax").</li>
        </ul>
        <Callout variant="insight">
          This is the direct ancestor of ChatGPT. GPT-3 + this pipeline = a product people actually want to use.
          Every major chatbot (Claude, Gemini, Llama-Chat) uses a variant of this three-stage process.
        </Callout>
      </LessonSection>

      <LessonSection title="Limitations">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Reward hacking</strong> — the model may learn to please the reward model rather than be genuinely helpful.</li>
          <li><strong className="text-white">Labeler bias</strong> — human preferences reflect the labelers' values, not universal truth.</li>
          <li><strong className="text-white">Does not fix hallucination entirely</strong> — models still make up facts; RLHF reduces but does not eliminate it.</li>
          <li><strong className="text-white">Expensive</strong> — human labeling and multi-stage training add significant cost on top of pre-training.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Connection to Fundamentals">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Fundamentals lesson</th>
                <th className="px-4 py-3">How this paper connects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Large Language Models', 'Explains the post-training step that makes LLMs usable as assistants'],
                ['How Language Models Work', 'Still next-token prediction — but now optimised for human preferences'],
                ['GPT-3 Few-Shot', 'GPT-3 is the starting point; InstructGPT is what comes after'],
                ['Small Language Models', 'A well-aligned 1.3B beat raw 175B — alignment can matter more than size'],
              ].map(([lesson, connection]) => (
                <tr key={lesson} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{lesson}</td>
                  <td className="px-4 py-3 text-slate-400">{connection}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Three stages: supervised fine-tuning → reward model → reinforcement learning (RLHF).',
          '1.3B InstructGPT was preferred over 175B GPT-3 — alignment matters more than raw size.',
          'This pipeline is how GPT-3 became ChatGPT; every major chatbot uses a variant.',
          'Trade-offs: labeler bias, reward hacking, alignment tax on some capabilities.',
        ]}
      />
    </LessonArticle>
  )
}
