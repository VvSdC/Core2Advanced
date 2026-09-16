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

export function HowLlmsAreTrained() {
  return (
    <LessonArticle>
      <Definition term="Training an LLM">
        <p>
          Training turns a randomly-initialised Transformer into a useful assistant. It happens in two big phases:{' '}
          <strong className="text-white">pretraining</strong> (learn language and knowledge from the whole internet), then{' '}
          <strong className="text-white">post-training</strong> (learn to follow instructions and behave helpfully and
          safely).
        </p>
        <p>
          A raw pretrained model is a brilliant <em>autocomplete</em>. Post-training is what makes it a{' '}
          <em>chatbot you'd actually want to talk to</em>.
        </p>
      </Definition>

      <Callout variant="beginner">
        Two-phase mental model: <strong className="text-white">pretraining</strong> is like reading every book in the
        world to learn how language and facts work. <strong className="text-white">Post-training</strong> is a short
        finishing school that teaches manners: answer the question, be helpful, refuse harmful requests.
      </Callout>

      <LessonSection title="Phase 1 — Pretraining: predict the next token, a trillion times">
        <p>
          Pretraining uses the exact loop from the primer, at massive scale. Feed the model text, ask it to predict the
          next token, compare to the real next token, nudge the weights. The training data <em>is</em> its own answer key
          — no humans needed to label anything.
        </p>
        <Flowchart
          title="Pretraining objective"
          chart={`flowchart TB
  A["Grab text: 'The cat sat on the ___'"] --> B["Model predicts next token"]
  B --> C["Real answer was 'mat'"]
  C --> D["Loss = how wrong the guess was"]
  D --> E["Adjust billions of weights slightly"]
  E --> F{"Seen enough tokens?"}
  F -- no --> A
  F -- yes --> G([Pretrained base model])`}
        />
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Ingredient</th>
                <th className="px-4 py-3">Rough scale (modern LLM)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Training data', 'Trillions of tokens (web, books, code, wikis)'],
                ['Parameters', 'Billions to trillions of weights'],
                ['Compute', 'Thousands of GPUs for weeks or months'],
                ['Cost', 'Millions to hundreds of millions of dollars'],
              ].map(([k, v]) => (
                <tr key={k} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{k}</td>
                  <td className="px-4 py-3 text-slate-400">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          The result is a <strong className="text-white">base model</strong>: it knows grammar, facts, and reasoning
          patterns, but it just continues text. Ask it a question and it might reply with <em>more questions</em>, because
          that's what often follows a question on the web.
        </Callout>
      </LessonSection>

      <LessonSection title="Phase 2 — Post-training: from autocomplete to assistant">
        <ContentStep number={1} title="Supervised Fine-Tuning (SFT) — show it good examples">
          <p>
            Humans write thousands of high-quality <em>(instruction, ideal answer)</em> pairs. The model is fine-tuned on
            these, learning the <strong className="text-white">format</strong> of being a helpful assistant: read a
            request, produce a direct, well-structured answer.
          </p>
          <Example
            title="An SFT training example"
            output={`Instruction: "Explain photosynthesis to a 10-year-old."
Ideal answer: "Plants make their own food using sunlight..."`}
            caption="Thousands of these teach the model how a good answer looks."
          >{`example = {
    "instruction": "Explain photosynthesis to a 10-year-old.",
    "response": "Plants make their own food using sunlight, "
                "water, and air. Sunlight is their energy...",
}
# The model learns: given an instruction, produce this style of reply.`}</Example>
        </ContentStep>

        <ContentStep number={2} title="Reinforcement Learning from Human Feedback (RLHF) — learn preferences">
          <p>
            SFT teaches one good answer, but "helpful" is fuzzy. In RLHF, the model produces several answers, humans rank
            which they prefer, and a <strong className="text-white">reward model</strong> learns to score answers the way
            humans would. The LLM is then optimised to earn higher reward — becoming more helpful, honest, and harmless.
          </p>
          <Flowchart
            title="RLHF in one picture"
            chart={`flowchart TB
  A["Model writes 2-4 candidate answers"] --> B["Humans rank them best -> worst"]
  B --> C["Train a reward model to mimic those rankings"]
  C --> D["Optimise the LLM to score high on the reward model"]
  D --> E([Aligned, helpful assistant])`}
          />
          <Callout variant="info">
            Variants like <strong className="text-white">DPO</strong> (Direct Preference Optimization) and{' '}
            <strong className="text-white">RLAIF</strong> (feedback from AI instead of humans) reach a similar goal more
            cheaply. You'll meet these in the Model Alignment track.
          </Callout>
        </ContentStep>
      </LessonSection>

      <LessonSection title="The whole pipeline">
        <Flowchart
          title="From random weights to ChatGPT-style assistant"
          chart={`flowchart TB
  A["Random weights"] --> B["PRETRAIN on trillions of tokens"]
  B --> C["Base model (great autocomplete)"]
  C --> D["SFT on instruction-answer pairs"]
  D --> E["RLHF / DPO on human preferences"]
  E --> F([Helpful, aligned chat model])`}
        />
        <Callout variant="tip">
          Knowing this pipeline pays off later: <strong className="text-white">fine-tuning</strong> adds skills/style,{' '}
          <strong className="text-white">RAG</strong> adds fresh knowledge at query time, and{' '}
          <strong className="text-white">prompting</strong> steers a frozen model. Each targets a different phase, which is
          why they solve different problems.
        </Callout>
      </LessonSection>

      <LessonSection title="A crucial consequence: the knowledge cutoff">
        <p>
          Because knowledge is baked into the weights during pretraining, the model only "knows" what existed up to its{' '}
          <strong className="text-white">training cutoff date</strong>. It cannot know yesterday's news or your private
          documents — unless you give that information to it at query time (which is exactly what RAG and tools do).
        </p>
        <Callout variant="insight">
          This single fact motivates a huge part of this track. Retraining is slow and expensive; feeding the model the
          right context at runtime is fast and cheap. That trade-off is why RAG, tools, and agents exist.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Training has two phases: pretraining (learn language + knowledge) and post-training (learn to be a helpful assistant).',
          'Pretraining is next-token prediction at massive scale; the data is its own answer key, so no labelling is needed.',
          'A base model is a great autocomplete but not a chatbot — SFT teaches the assistant format.',
          'RLHF (and DPO/RLAIF) align the model to human preferences: helpful, honest, harmless.',
          'Knowledge is frozen at the training cutoff — RAG, tools, and prompting supply fresh or private information at runtime.',
        ]}
      />
    </LessonArticle>
  )
}
