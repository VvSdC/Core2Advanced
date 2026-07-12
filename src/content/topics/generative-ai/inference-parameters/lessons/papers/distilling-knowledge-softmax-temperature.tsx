import {
  Callout,
  ContentStep,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/1503.02531'

export function DistillingKnowledgeSoftmaxTemperature() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Distilling the Knowledge in a Neural Network"
        authors="Hinton, Vinyals & Dean (Google)"
        year="2015"
        url={PAPER_URL}
      >
        The classic paper that explains <strong className="text-white">temperature in the softmax</strong> — the
        same T in your API's temperature slider, originally used to extract "dark knowledge" from a teacher model.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        The <em>Temperature</em> lesson showed how T reshapes next-token probabilities with dummy numbers. This
        paper is where the softmax temperature idea entered deep learning — written for model training, but the
        math is identical to inference-time sampling.
      </Callout>

      <LessonSection title="Background — what is knowledge distillation?">
        <p>
          Hinton et al. wanted to compress a large, accurate "teacher" network into a smaller "student" network.
          The student must learn not just the correct answer, but the teacher's{' '}
          <strong className="text-white">full probability distribution</strong> over all possible outputs — the
          subtle hints about which wrong answers are "almost right."
        </p>
        <p className="mt-3">
          They called these hints <strong className="text-white">dark knowledge</strong>: information hidden in
          the soft probabilities that a hard "correct/incorrect" label discards.
        </p>
      </LessonSection>

      <LessonSection title="Temperature in the softmax">
        <ContentStep number={1} title="The formula — same as inference">
          <p>
            Given logits <code className="font-mono text-sm">zᵢ</code>, the softened probability distribution
            uses temperature T:
          </p>
          <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            qᵢ = exp(zᵢ / T) / Σⱼ exp(zⱼ / T)
          </div>
          <p className="mt-3">
            This is <strong className="text-white">exactly the formula</strong> in the Temperature lesson. At
            inference time, APIs apply the same operation to next-token logits before sampling.
          </p>
        </ContentStep>

        <ContentStep number={2} title="What high T reveals">
          <p>
            With <strong className="text-white">T = 1</strong>, the softmax is sharp — the top class dominates.
            With <strong className="text-white">T &gt; 1</strong> (e.g. T = 20), the distribution spreads out.
            Secondary classes that were nearly invisible at T = 1 become visible:
          </p>
          <Example
            title="Teacher logits for an image of '2'"
            output={`T = 1:   "2"=99.9%, "3"=0.05%, "7"=0.03%  → almost all mass on "2"
T = 20:  "2"=60%,  "3"=25%,  "7"=10%  → "3" looks like a 2! useful hint`}
          >{`# Teacher sees a handwritten "2" that looks a bit like "3"
logits = {"2": 10.0, "3": 7.5, "7": 6.0, "1": 2.0}

# T=1  → student only learns "answer is 2"
# T=20 → student also learns "3 and 7 are plausible confusions"`}</Example>
          <Callout variant="insight">
            At inference, the same spreading effect means <strong className="text-white">higher temperature
            gives unlikely tokens a better chance</strong> — more creative, less predictable output.
          </Callout>
        </ContentStep>

        <ContentStep number={3} title="What low T does">
          <p>
            With <strong className="text-white">T &lt; 1</strong>, differences between logits are amplified. The
            top token dominates even more — approaching greedy decoding as T → 0. In distillation, low T was not
            the focus; at inference, low T is how you get deterministic, focused answers.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What the paper found">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Training the student on soft targets (high T) + hard labels outperformed hard labels alone.</li>
          <li>Temperature T = 20 worked well for distillation on image classification — much higher than typical inference values (0.2–1.5).</li>
          <li>The softmax temperature trick is general — it applies wherever you convert logits to a probability distribution.</li>
        </ul>
      </LessonSection>

      <LessonSection title="From training to inference">
        <p>
          Hinton et al. never discussed chatbots or LLMs — the paper predates modern language-model APIs. But when
          OpenAI and others added a <code className="font-mono text-sm">temperature</code> parameter to their
          generation endpoints, they used this exact softmax formula on next-token logits. The purpose shifted from
          extracting dark knowledge to <strong className="text-white">controlling output randomness</strong>, but
          the math is unchanged.
        </p>
      </LessonSection>

      <LessonSection title="Limitations">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Written for image-classification distillation, not text generation — you must make the connection yourself.</li>
          <li>Optimal T for distillation (≈ 20) is very different from optimal T for LLM inference (≈ 0–1.5).</li>
          <li>Does not discuss top-k, top-p, or other filtering — only the softmax rescaling step.</li>
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
                ['Temperature', 'Defines the softmax temperature formula used at inference time'],
                ['Introduction to Inference Parameters', 'Shows the logits → softmax step in the generation pipeline'],
                ['Choosing Settings', 'T = 1 is the model\'s native distribution; deviating from 1 is a deliberate choice'],
                ['Top-K / Top-P', 'Temperature is applied first; top-k and top-p filter the result afterward'],
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
          'Introduced softmax temperature T: qᵢ = exp(zᵢ/T) / Σ exp(zⱼ/T) — the same formula in LLM APIs today.',
          'High T spreads probability mass, revealing relationships between classes ("dark knowledge").',
          'Low T sharpens the distribution, making the top token even more dominant.',
          'Originally for knowledge distillation; repurposed at inference to control creativity vs predictability.',
        ]}
      />
    </LessonArticle>
  )
}
