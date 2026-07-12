import {
  Callout,
  ContentStep,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2001.08361'

export function ScalingLawsForLanguageModels() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Scaling Laws for Neural Language Models"
        authors="Kaplan et al. (OpenAI)"
        year="2020"
        url={PAPER_URL}
      >
        The first rigorous answer to: <strong className="text-white">if I make my model bigger, how much better
        will it get?</strong> — with a formula, not just hope.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        In <em>What Are Model Parameters?</em> you learned that 7B means 7 billion learned numbers. This paper
        measures what you actually <em>get back</em> when you scale those numbers up — and whether the improvement
        is predictable.
      </Callout>

      <LessonSection title="Background — why this paper existed">
        <p>
          By 2020, labs were spending millions of dollars training language models from 100M to 1B+ parameters,
          but decisions were gut-driven: "let's try 10× bigger and see." No one had systematically measured the
          return on investment for scale.
        </p>
        <p className="mt-3">
          Kaplan et al. trained <strong className="text-white">over 200 models</strong> of different sizes and
          measured their performance to find a mathematical relationship — a scaling law.
        </p>
      </LessonSection>

      <LessonSection title="What the paper measures">
        <ContentStep number={1} title="Test loss — the core metric">
          <p>
            The paper uses <strong className="text-white">cross-entropy loss</strong> on a held-out test set. In
            plain terms: how surprised is the model by the next token? Lower loss = better predictions.
          </p>
          <Callout variant="beginner">
            Remember from <em>How Language Models Work</em>: the model assigns probabilities to every next token.
            If the real next token had probability 0.9, loss is low (model was confident and correct). If it had
            probability 0.01, loss is high (model was surprised).
          </Callout>
        </ContentStep>

        <ContentStep number={2} title="Three knobs to turn">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li><strong className="text-white">Model size (N)</strong> — number of parameters. More capacity to store patterns.</li>
            <li><strong className="text-white">Dataset size (D)</strong> — number of training tokens. More examples to learn from.</li>
            <li><strong className="text-white">Compute (C)</strong> — total floating-point operations during training. Budget constraint that links N and D.</li>
          </ul>
          <p className="mt-3">
            The paper asks: if I increase any one of these while holding others fixed, how does loss change?
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What the paper found">
        <ContentStep number={1} title="Power-law scaling — the main discovery">
          <p>
            Loss decreases as a smooth <strong className="text-white">power law</strong> in each factor. On a
            log-log plot, it looks like a straight line — no cliffs, no sudden jumps (within the tested range).
          </p>
          <Example
            title="Power-law intuition"
            output={`  0.1B params → loss 3.40
  1.0B params → loss 2.85   (10× params, ~16% lower loss)
 10.0B params → loss 2.40   (10× again, ~16% lower loss)
100.0B params → loss 2.00   (diminishing but still improving)
(illustrative values — real exponents are in the paper)`}
          >{`# Loss follows: L ≈ (1/N)^α for parameters
# Each 10× increase gives predictable, diminishing gains

params_B = [0.1, 1, 10, 100]
loss     = [3.40, 2.85, 2.40, 2.00]

for p, l in zip(params_B, loss):
    print(f"{p:>5.1f}B params → loss {l:.2f}")`}</Example>
        </ContentStep>

        <ContentStep number={2} title="Model size had the biggest impact (at the time)">
          <p>
            Of the three factors, increasing <strong className="text-white">parameters</strong> gave the steepest
            loss reduction per unit of compute — within the range tested (up to ~1.5B parameters). This directly
            motivated the industry push: GPT-3 at 175B, PaLM at 540B, and so on.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Loss predicts downstream task performance">
          <p>
            Lower test loss correlates with better scores on real benchmarks — translation, question answering,
            reading comprehension. This means you can optimise loss during training and expect real-world
            improvements, not just better numbers on a chart.
          </p>
        </ContentStep>

        <ContentStep number={4} title="Optimal allocation under a compute budget">
          <p>
            Given a fixed compute budget, the paper recommended allocating most of it to making the model larger
            rather than training longer on more data — <em>at the scales they tested</em>. This recommendation
            was later overturned by Chinchilla (next paper) at larger scales.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Does more parameters mean much better?">
        <Callout variant="insight">
          <strong className="text-white">Yes — predictably, but with diminishing returns.</strong> Going from 100M
          to 1B parameters gives a large loss drop. Going from 10B to 100B gives a smaller drop for the same
          10× cost. Scaling works; it is just not free or linear.
        </Callout>
        <p className="mt-3">
          Think of it like building a library: the first 1,000 books help a lot. The millionth book still helps,
          but each new book adds less new knowledge than the early ones.
        </p>
      </LessonSection>

      <LessonSection title="How the experiments worked">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Trained Transformer models ranging from ~10M to ~1.5B parameters.</li>
          <li>Varied dataset size independently (from millions to billions of tokens).</li>
          <li>Measured test loss after training and fitted power-law curves to the results.</li>
          <li>Verified that the same laws hold across different model widths, depths, and attention head counts.</li>
          <li>Extended analysis to context length, batch size, and training duration.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Limitations">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Only tested up to ~1.5B parameters — extrapolating to 100B+ was an educated guess at the time.</li>
          <li>Recommended prioritising model size over data — later shown to be wrong at large scale (see Chinchilla).</li>
          <li>Measures loss, not safety, bias, or alignment — a model can have low loss and still hallucinate.</li>
          <li>Smooth power laws do not capture emergent abilities that appear suddenly at scale (see Emergent Abilities paper).</li>
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
                ['What Are Model Parameters?', 'Quantifies the return on adding more parameters — the "why bother scaling?" answer'],
                ['Large Language Models', 'Provided the scientific justification for building GPT-3-scale models'],
                ['Small Language Models', 'Showed that smaller models are predictably worse on loss — but cheaper'],
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
          'Trained 200+ models to find smooth power-law relationships between scale and performance.',
          'Loss decreases predictably as you increase parameters, data, or compute — with diminishing returns.',
          'At the time, bigger models gave the best return per dollar — motivating GPT-3 and beyond.',
          'Later papers (Chinchilla) showed data must scale too — not just parameters alone.',
        ]}
      />
    </LessonArticle>
  )
}
