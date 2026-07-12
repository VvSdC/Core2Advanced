import {
  Callout,
  ContentStep,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/1904.09751'

export function NeuralTextDegeneration() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="The Curious Case of Neural Text Degeneration"
        authors="Holtzman et al. (University of Washington / Allen AI)"
        year="2020"
        url={PAPER_URL}
      >
        Diagnosed why language models produce <strong className="text-white">boring, repetitive text</strong> — and
        introduced <strong className="text-white">nucleus (top-p) sampling</strong> as the fix.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        The <em>Top-P (Nucleus) Sampling</em> lesson showed the algorithm step by step. This paper explains{' '}
        <em>why</em> top-p exists — what goes wrong with greedy decoding, beam search, and naive random sampling.
      </Callout>

      <LessonSection title="Background — the degeneration problem">
        <p>
          By 2019, GPT-2 and similar models could generate fluent sentences, but something felt off. Outputs were
          often <strong className="text-white">generic, repetitive, or oddly incoherent</strong> — even when
          individual sentences looked fine. Holtzman et al. called this{' '}
          <strong className="text-white">neural text degeneration</strong>.
        </p>
        <p className="mt-3">
          The surprising part: the worst offenders were not random sampling — they were{' '}
          <strong className="text-white">beam search</strong> and <strong className="text-white">greedy decoding</strong>,
          the methods everyone assumed were "safer."
        </p>
      </LessonSection>

      <LessonSection title="What the paper measured">
        <ContentStep number={1} title="Perplexity vs quality — they diverge">
          <p>
            Beam search minimises perplexity (how surprised the model is by its own text). Lower perplexity sounds
            good — but human readers rated beam-search outputs as <em>worse</em> than stochastic sampling. Optimising
            for model surprise does not equal writing good prose.
          </p>
        </ContentStep>

        <ContentStep number={2} title="The surprisal (entropy) curve of human text">
          <p>
            Human-written text has a characteristic pattern: mostly predictable words with occasional surprising
            ones. The paper plotted <strong className="text-white">cumulative surprisal distributions</strong> and
            found that good generation should preserve this shape — not collapse to the single safest token every
            time, and not sample from the long tail of nonsense tokens either.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Why existing methods fail">
        <ContentStep number={1} title="Greedy decoding (T → 0)">
          <p>
            Always pick the highest-probability token. Produces repetitive loops ("the the the…") and gets stuck
            in high-probability but boring phrases.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Beam search">
          <p>
            Keeps the top B partial sequences at each step. Sounds smart, but beam search{' '}
            <strong className="text-white">over-selects for high-probability tokens</strong> and under-represents
            the natural variation in human text. Result: bland, template-like output.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Pure random sampling (full distribution)">
          <p>
            Sample from all tokens weighted by probability. The long tail of unlikely tokens injects incoherent
            words. Too much chaos, not enough structure.
          </p>
        </ContentStep>

        <ContentStep number={4} title="Top-k sampling — better, but rigid">
          <p>
            Keep only the K most likely tokens and sample within that set. This helps — but a{' '}
            <strong className="text-white">fixed K</strong> is wrong in both directions: when the model is very
            confident (K=40 keeps 39 junk tokens), and when the distribution is flat (K=40 may cut off valid options).
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="The solution — nucleus (top-p) sampling">
        <ContentStep number={1} title="The core idea">
          <p>
            Instead of a fixed K, keep the <strong className="text-white">smallest set of tokens whose combined
            probability mass is ≥ p</strong> (e.g. p = 0.9). This set is called the <em>nucleus</em>. Sample only
            from inside it, then renormalise.
          </p>
          <Example
            title="Nucleus adapts to confidence"
            output={`Confident step (p=0.9):
  Nucleus = { "the" }           → 1 token covers 92%

Uncertain step (p=0.9):
  Nucleus = { "cat", "dog", "mat", "rat", "bat" }  → 5 tokens to reach 91%`}
          >{`# Same p=0.9, different nucleus sizes — that's the point
confident = {"the": 0.92, "a": 0.05, "an": 0.03}
uncertain = {"cat": 0.22, "dog": 0.20, "mat": 0.18, "rat": 0.17, "bat": 0.14, ...}`}</Example>
        </ContentStep>

        <ContentStep number={2} title="Results">
          <p>
            Nucleus sampling produced text that human evaluators rated as more coherent and diverse than beam
            search, pure sampling, and top-k — across multiple model sizes and domains (news, stories, recipes).
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Limitations">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Evaluated on 2019-era LSTM and Transformer models — modern LLMs behave differently but the core insight holds.</li>
          <li>Top-p alone does not fix factual errors or hallucinations — it only improves <em>fluency and diversity</em>.</li>
          <li>Choosing p still requires tuning; the paper used p = 0.9 as a strong default, which remains common today.</li>
          <li>Does not address API-level knobs like max_tokens or stop sequences — purely about token selection.</li>
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
                ['Top-P (Nucleus) Sampling', 'Origin paper — defines nucleus sampling and the p parameter you use in APIs today'],
                ['Top-K Sampling', 'Compares top-k to nucleus; explains why fixed K is a limitation top-p solves'],
                ['Temperature', 'Often combined with top-p in practice — temperature shapes the distribution before nucleus filtering'],
                ['Choosing Settings', 'Recommends stochastic decoding over beam search for open-ended generation'],
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
          'Neural text degeneration: models produce bland, repetitive text — especially with greedy and beam search.',
          'Human text has a natural surprisal curve; good sampling should preserve variation without chaos.',
          'Top-k helps but uses a fixed K; nucleus (top-p) adapts the candidate set to model confidence.',
          'Nucleus sampling (p ≈ 0.9) became the default decoding strategy in most LLM APIs.',
        ]}
      />
    </LessonArticle>
  )
}
