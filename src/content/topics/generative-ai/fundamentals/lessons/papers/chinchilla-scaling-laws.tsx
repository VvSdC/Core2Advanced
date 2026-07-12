import {
  Callout,
  ContentStep,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2203.15556'

export function ChinchillaScalingLaws() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Training Compute-Optimal Large Language Models"
        authors="Hoffmann et al. (DeepMind)"
        year="2022"
        venue="Known as the Chinchilla paper"
        url={PAPER_URL}
      >
        Proved that most big models are <strong className="text-white">under-trained</strong> — and gave the recipe
        for how much data a model actually needs.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Kaplan's scaling laws (previous paper) said bigger models are better. This paper adds the critical
        caveat: <em>bigger only helps if you also feed the model enough training text</em>. Read this right after
        <em> What Are Model Parameters?</em> and <em>Scaling Laws</em>.
      </Callout>

      <LessonSection title="Background — the under-training problem">
        <p>
          After Kaplan, labs raced to build enormous models. GPT-3 had <strong className="text-white">175 billion
          parameters</strong> but was trained on only <strong className="text-white">~300 billion tokens</strong>{' '}
          — less than 2 tokens per parameter. Gopher pushed to 280B params on a similar amount of data.
        </p>
        <p className="mt-3">
          Hoffmann et al. asked a practical question: <em>if you have a fixed compute budget (say, $10M of GPU
          time), should you build the biggest model possible, or a smaller one trained on more data?</em>
        </p>
      </LessonSection>

      <LessonSection title="What the paper did — methodology">
        <ContentStep number={1} title="Fixed compute, vary size and data">
          <p>
            The team trained over <strong className="text-white">400 language models</strong> across a wide range
            of model sizes and training durations. For each compute budget, they found which combination of
            parameters (N) and training tokens (D) produced the lowest loss.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Derived the optimal ratio">
          <p>
            The result: for compute-optimal training, model size and training data should scale{' '}
            <strong className="text-white">together</strong>. Specifically, use roughly:
          </p>
          <Callout variant="insight">
            <strong className="text-white">~20 training tokens per parameter</strong>
            <br />
            A 70B model → ~1.4 trillion tokens. A 7B model → ~140 billion tokens.
          </Callout>
        </ContentStep>

        <Flowchart
          title="Under-trained vs compute-optimal"
          chart={`flowchart TB
  A["GPT-3: 175B params, 300B tokens (1.7 per param)"] --> B["High capacity, barely filled → wasteful"]
  C["Chinchilla: 70B params, 1.4T tokens (20 per param)"] --> D["Right-sized, fully trained → better results"]
  B --> E["Higher inference cost forever"]
  D --> F["Lower inference cost AND better quality"]`}
        />
      </LessonSection>

      <LessonSection title="Key results">
        <ContentStep number={1} title="Chinchilla beats Gopher — 4× smaller, better on everything">
          <div className="overflow-x-auto rounded-xl border border-surface-600">
            <table className="w-full text-sm text-slate-300">
              <thead>
                <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">Model</th>
                  <th className="px-4 py-3">Params</th>
                  <th className="px-4 py-3">Training tokens</th>
                  <th className="px-4 py-3">Tokens / param</th>
                  <th className="px-4 py-3">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-600">
                {[
                  ['GPT-3', '175B', '~300B', '~1.7', 'Under-trained by Chinchilla standards'],
                  ['Gopher', '280B', '~300B', '~1.1', 'Even more under-trained'],
                  ['Chinchilla', '70B', '~1.4T', '~20', 'Beat Gopher on all major benchmarks'],
                  ['Llama 2 70B', '70B', '~2T', '~28', 'Industry applied the lesson'],
                ].map(([model, params, tokens, ratio, outcome]) => (
                  <tr key={model} className="hover:bg-surface-800/50">
                    <td className="px-4 py-3 font-semibold text-white">{model}</td>
                    <td className="px-4 py-3 font-mono">{params}</td>
                    <td className="px-4 py-3 font-mono">{tokens}</td>
                    <td className="px-4 py-3 font-mono text-genai-400">{ratio}</td>
                    <td className="px-4 py-3 text-slate-400">{outcome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Same compute budget, smarter allocation">
          <p>
            A model 4× smaller but trained on 4× more data beats the large under-trained model — and is{' '}
            <strong className="text-white">cheaper to run forever</strong> because inference cost depends on
            parameter count. You pay the training cost once; you pay inference on every user request.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Revised the scaling recipe for the industry">
          <p>
            Before Chinchilla: "make the biggest model you can." After Chinchilla: "pick the right size and train
            it on as much high-quality data as possible." Llama 2, Mistral, and most modern open models follow
            this recipe.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Does more parameters mean much better?">
        <Callout variant="insight">
          <strong className="text-white">Only if you also scale training data.</strong> Parameters are capacity
          (how much the model <em>can</em> store). Training tokens are what actually fills that capacity. A
          280B-parameter model trained on 300B tokens is like a 280-bedroom hotel with 300 guests — mostly empty
          rooms.
        </Callout>
        <p className="mt-3">
          Analogy from the Fundamentals lessons: parameters are the bookshelf size; training data is the number
          of books you put on it. A bigger shelf with the same 300 books does not make you better read.
        </p>
      </LessonSection>

      <LessonSection title="Limitations">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>The 20:1 ratio is for compute-optimal <em>pre-training</em> — fine-tuning and RLHF have different trade-offs.</li>
          <li>Assumes data quality is uniform — 1.4T tokens of web spam is not equal to 1.4T tokens of curated text.</li>
          <li>Does not account for inference latency requirements — sometimes you need a big model for other reasons.</li>
          <li>The ratio may shift as architectures improve (Mixture of Experts, etc.).</li>
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
                ['What Are Model Parameters?', 'Parameters = capacity; this paper shows capacity is wasted without proportional data'],
                ['Small Language Models', 'Explains why a well-trained 13B can beat an under-trained 175B'],
                ['Large Language Models', 'Reframes what "large" should mean — training tokens matter as much as param count'],
                ['Scaling Laws (previous paper)', 'Directly revises Kaplan\'s recommendation to prioritise model size over data'],
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
          'Most pre-2022 large models were under-trained — too many params, too few tokens.',
          'Optimal ratio: ~20 training tokens per parameter for a given compute budget.',
          'Chinchilla 70B beat Gopher 280B — smaller, better trained, cheaper to serve.',
          'More parameters alone does not mean better — params and data must scale together.',
        ]}
      />
    </LessonArticle>
  )
}
