import {
  Callout,
  ContentStep,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/1805.04833'

export function HierarchicalStoryGeneration() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Hierarchical Neural Story Generation"
        authors="Fan, Lewis & Dauphin (Facebook AI Research)"
        year="2018"
        url={PAPER_URL}
      >
        Popularised <strong className="text-white">top-k sampling</strong> for neural text generation — keep only
        the K most likely tokens, discard the rest, then sample.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        The <em>Top-K Sampling</em> lesson walked through K=3 with dummy probabilities. This paper is where top-k
        entered mainstream language-model generation — used to write long, coherent stories without nonsense tokens.
      </Callout>

      <LessonSection title="Background — generating long stories">
        <p>
          Early language models could finish a sentence but fell apart over paragraphs. Fan et al. built a{' '}
          <strong className="text-white">hierarchical model</strong>: a coarse "planner" generates a story
          outline, then a fine "writer" fills in sentences. The architecture is interesting, but the lasting
          contribution for inference is how they <em>sampled</em> tokens during generation.
        </p>
      </LessonSection>

      <LessonSection title="The top-k sampling procedure">
        <ContentStep number={1} title="Filter, then sample">
          <p>
            At each step, the model outputs a probability for every token in the vocabulary (often 50,000+). Instead
            of sampling from all of them:
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-300">
            <li>Sort tokens by probability (highest first).</li>
            <li>Keep only the top <strong className="text-white">K</strong> tokens (they used K = 10 as default).</li>
            <li>Set all other probabilities to zero.</li>
            <li>Renormalise the remaining K so they sum to 1.</li>
            <li>Sample one token from this filtered distribution.</li>
          </ol>
        </ContentStep>

        <ContentStep number={2} title="Why cut the tail?">
          <p>
            The vocabulary tail is full of tokens that are individually unlikely but collectively numerous. Pure
            random sampling occasionally picks a bizarre token and derails the story. Top-k is a simple guardrail:{' '}
            <em>never sample from the bottom 99.98% of the distribution.</em>
          </p>
          <Example
            title="K=3 filter in action"
            output={`Before filter:  mat=35%, floor=22%, couch=18%, roof=8%, … (50k tokens)
After K=3:       mat=44%, floor=28%, couch=28%   (renormalised)
Sampled:         "mat"`}
          >{`probs = {"mat": 0.35, "floor": 0.22, "couch": 0.18, "roof": 0.08}
top3 = {"mat": 0.35, "floor": 0.22, "couch": 0.18}
total = 0.75
renorm = {k: v/total for k, v in top3.items()}
# mat=46.7%, floor=29.3%, couch=24.0%`}</Example>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What the paper found">
        <ContentStep number={1} title="Top-k enabled coherent long-form text">
          <p>
            Combined with their hierarchical architecture, top-k sampling let the model generate multi-paragraph
            stories that human evaluators rated as more coherent than baselines using greedy or unconstrained
            sampling.
          </p>
        </ContentStep>

        <ContentStep number={2} title="K = 10 became a de facto default">
          <p>
            The paper used <strong className="text-white">K = 10</strong> for story generation. This value spread
            through the field — OpenAI's GPT-2 release documentation later recommended top-k as well, cementing
            it as a standard API parameter alongside temperature.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Limitations">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Fixed K does not adapt to context — the Holtzman paper (next in this section) addresses this with top-p.</li>
          <li>Very small K (e.g. 1–3) behaves almost like greedy decoding — repetitive output.</li>
          <li>Very large K (e.g. 500) barely filters anything — approaches pure random sampling.</li>
          <li>The hierarchical model architecture itself is largely superseded by large single-pass Transformers.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Connection to Inference Parameters lessons">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Lesson</th>
                <th className="px-4 py-3">How this paper connects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Top-K Sampling', 'Origin of the top-k procedure — filter to K tokens, renormalise, sample'],
                ['Top-P (Nucleus) Sampling', 'Top-p was proposed as a dynamic alternative to fixed-K filtering'],
                ['Temperature', 'Applied before top-k in practice — temperature reshapes probs, then K filters'],
                ['Introduction to Inference Parameters', 'Shows the full pipeline: logits → softmax → filter → sample'],
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
          'Introduced top-k sampling: keep the K most likely tokens, zero out the rest, renormalise, sample.',
          'Prevents the model from picking bizarre low-probability tokens that derail generation.',
          'K = 10 was the original default — modern APIs typically use K = 40–50 or switch to top-p instead.',
          'Fixed K is simple and effective, but cannot adapt when the model is very confident or very uncertain.',
        ]}
      />
    </LessonArticle>
  )
}
