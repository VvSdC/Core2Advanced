import {
  Callout,
  ContentStep,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2005.14165'

export function Gpt3FewShotLearners() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Language Models are Few-Shot Learners"
        authors="Brown et al. (OpenAI)"
        year="2020"
        venue="GPT-3"
        url={PAPER_URL}
      >
        Showed that at 175B parameters, a model can <strong className="text-white">learn a new task from
        examples in the prompt</strong> — no retraining required.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        You know models predict the next token. This paper reveals a surprising consequence of doing that at
        enormous scale: the model can <em>adapt to tasks just by reading examples in your prompt</em> — the
        foundation of every chatbot you use today.
      </Callout>

      <LessonSection title="Background — the fine-tuning bottleneck">
        <p>
          Before GPT-3, the standard workflow was: pre-train a model on general text, then{' '}
          <strong className="text-white">fine-tune</strong> separately for each task (translation, summarisation,
          question answering). Fine-tuning requires labelled data, GPU time, and engineering per task.
        </p>
        <p className="mt-3">
          Brown et al. asked: <em>what if one model could do everything just by reading instructions and examples
          in the prompt?</em>
        </p>
      </LessonSection>

      <LessonSection title="The three prompting modes the paper defined">
        <ContentStep number={1} title="Zero-shot — just instructions">
          <Example
            title="Zero-shot translation"
            output={`Translate English to French:
cheese → le fromage`}
          >{`prompt = """Translate English to French:
sea otter → loutre de mer
peppermint → menthe poivrée
cheese →"""

# Model completes: "le fromage" (no examples of "cheese" given)`}</Example>
          <p className="mt-2">No examples — only a task description. The model must infer the task from the instruction alone.</p>
        </ContentStep>

        <ContentStep number={2} title="One-shot — a single example">
          <p>One input→output pair is added before the real question. The model uses it as a template for the pattern.</p>
        </ContentStep>

        <ContentStep number={3} title="Few-shot — several examples">
          <Example
            title="Few-shot sentiment classification"
            output={`Review: "I waited an hour for cold food."
Sentiment: Negative`}
          >{`prompt = """Classify the sentiment as Positive or Negative.

Review: "Best pizza I've ever had!"
Sentiment: Positive

Review: "Terrible service, never going back."
Sentiment: Negative

Review: "I waited an hour for cold food."
Sentiment:"""

# Model completes: "Negative"`}</Example>
          <p className="mt-2">
            This is <strong className="text-white">in-context learning</strong> — the model picks up the pattern
            from examples in the prompt. No weights are updated. The "learning" happens through attention over
            the prompt at inference time.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What the paper built">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Architecture</strong> — decoder-only Transformer (from the Attention paper), 96 layers, 12,288-dimensional embeddings.</li>
          <li><strong className="text-white">Sizes tested</strong> — 8 models from 125M to 175B parameters, allowing direct comparison of scale effects.</li>
          <li><strong className="text-white">Training data</strong> — ~300B tokens from Common Crawl, books, and Wikipedia (filtered for quality).</li>
          <li><strong className="text-white">Training cost</strong> — estimated ~$4.6M for the full 175B model on cloud GPUs.</li>
          <li><strong className="text-white">No fine-tuning</strong> — all benchmark results are from prompting alone, not task-specific training.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Key results">
        <ContentStep number={1} title="Few-shot performance scales with model size">
          <p>
            At 175B, few-shot performance on many benchmarks matched or beat fine-tuned models from the previous
            generation. Smaller GPT-3 variants (350M, 1.3B, 6.7B) showed weak few-shot ability — the capability
            <strong className="text-white"> emerges at scale</strong>.
          </p>
        </ContentStep>

        <ContentStep number={2} title="One model, dozens of tasks">
          <p>Tasks tested included (all via prompting only):</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
            <li>Machine translation (multiple language pairs)</li>
            <li>Arithmetic (2–5 digit addition and subtraction)</li>
            <li>Common sense reasoning (StoryCloze, HellaSwag)</li>
            <li>Reading comprehension (SQuAD, TriviaQA)</li>
            <li>Word unscrambling and sentence completion</li>
            <li>Code generation (few-shot Python)</li>
            <li>SAT-style analogy questions</li>
          </ul>
        </ContentStep>

        <ContentStep number={3} title="Launched the foundation model paradigm">
          <p>
            Train one enormous model on general text, then serve it for everything via different prompts. This
            replaced the "one model per task" era and is the business model behind ChatGPT, Claude, Gemini, and
            every LLM API today.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Limitations the paper acknowledged">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Hallucination</strong> — generates plausible but false text, especially on rare facts.</li>
          <li><strong className="text-white">Bias</strong> — reflects biases present in training data (gender, race, stereotypes).</li>
          <li><strong className="text-white">Sample efficiency</strong> — humans learn new tasks from 1–2 examples; GPT-3 often needs 10–100 for reliable performance.</li>
          <li><strong className="text-white">Inference cost</strong> — 175B parameters means every request is expensive and slow.</li>
          <li><strong className="text-white">No persistent learning</strong> — in-context learning resets every conversation; the model does not remember yesterday's chat.</li>
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
                ['How Language Models Work', 'Few-shot learning is still next-token prediction — examples in the prompt shift the probability distribution'],
                ['What Are Model Parameters?', '175B parameters gave enough capacity for in-context learning to emerge'],
                ['Large Language Models', 'GPT-3 is the archetypal LLM — this paper defined what "large" enables in practice'],
                ['Scaling Laws', 'Confirmed that scale delivers not just lower loss but qualitatively new capabilities'],
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
          'Defined zero-shot, one-shot, and few-shot prompting — all without updating model weights.',
          'At 175B, few-shot rivalled fine-tuned models on many benchmarks; smaller models could not.',
          'One foundation model serves many tasks via different prompts — the modern LLM paradigm.',
          'Limitations: hallucination, bias, high inference cost, no memory across conversations.',
        ]}
      />
    </LessonArticle>
  )
}
