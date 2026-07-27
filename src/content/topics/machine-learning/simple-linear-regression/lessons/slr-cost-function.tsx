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

export function SlrCostFunction() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="What this lesson is really about">
        We need a fair way to say “this line is better than that line.” The cost function is just a{' '}
        <strong className="text-white">scorecard for mistakes</strong>. Lower score = better line.
        That is it.
      </Callout>

      <Definition term="Cost function (friendly definition)">
        <p>
          A <strong className="text-white">cost function</strong> takes your current line (θ₀ and θ₁)
          and returns one number: how wrong that line is on the training examples. We want that
          number as small as possible.
        </p>
      </Definition>

      <LessonSection title="From ‘feels wrong’ to a number">
        <p className="text-slate-300">
          Suppose your line predicts 70 for a student who scored 80. You are off by 10. Another
          student: predicted 50, actual 52 — off by 2. How do we combine many such misses into one
          clear ranking between lines?
        </p>
        <ContentStep number={1} title="Write down each miss">
          <p className="text-slate-300">
            For every example: error = prediction − actual (or the reverse — stay consistent).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Make misses comparable">
          <p className="text-slate-300">
            A miss of −10 and +10 are both “off by 10.” If we add raw errors, they cancel and look
            perfect. That would be silly. So we square them: (−10)² = 100, (+10)² = 100.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Average across students">
          <p className="text-slate-300">
            Add the squared misses, then average. Now every line gets one score. Smaller is better.
          </p>
        </ContentStep>
        <Flowchart
          title="Building the scorecard"
          chart={`flowchart TB
  A[Current line] --> B[Predict for every student]
  B --> C[Compute each mistake]
  C --> D[Square the mistakes]
  D --> E[Average them]
  E --> F[One cost number J]`}
        />
      </LessonSection>

      <LessonSection title="The formula — without the scare">
        <p className="text-slate-300">
          Here is the common training cost for regression. Read it left to right like a recipe:
        </p>
        <div className="mt-3 space-y-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-white">
          <p>J(θ₀, θ₁) = (1 / 2m) · Σ (prediction − actual)²</p>
        </div>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Piece</th>
                <th className="px-4 py-3">Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['J', 'the cost / “how wrong” score'],
                ['m', 'how many training rows'],
                ['Σ', 'add this up for every row'],
                ['(prediction − actual)²', 'squared mistake for one row'],
                ['1 / 2m', 'average, with a 1/2 that makes later math nicer'],
              ].map(([piece, meaning]) => (
                <tr key={piece} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-machine-learning-400">{piece}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="beginner" title="You can ignore the 1/2 for intuition">
          Mentally think “average of squared mistakes.” The 1/2 is a convenience for calculus later.
          It does not change which line wins.
        </Callout>
      </LessonSection>

      <LessonSection title="Work a tiny example by hand">
        <p className="text-slate-300">
          Three points. Try a rough line ŷ = x (that means θ₀ = 0, θ₁ = 1):
        </p>
        <Example title="Data">
{`x: 1, 2, 3
y: 1, 3, 5`}
        </Example>
        <ContentStep number={1} title="Predictions">
          <p className="text-slate-300">ŷ = 1, 2, 3</p>
        </ContentStep>
        <ContentStep number={2} title="Mistakes">
          <p className="text-slate-300">0, −1, −2</p>
        </ContentStep>
        <ContentStep number={3} title="Squares">
          <p className="text-slate-300">0, 1, 4 → sum = 5</p>
        </ContentStep>
        <ContentStep number={4} title="Cost">
          <p className="text-slate-300">J = 5 / (2 × 3) ≈ 0.833</p>
        </ContentStep>
        <Example
          title="Better line on the same data"
          output={`ŷ = 1, 3, 5 exactly → J = 0`}
        >
{`Try θ₀ = -1, θ₁ = 2
ŷ = -1 + 2x → for x=1,2,3 → 1, 3, 5
All mistakes = 0
J = 0   # perfect on this toy set`}
        </Example>
        <Callout variant="insight">
          Same data, different θ → different J. Training means searching for θ that make J small.
        </Callout>
      </LessonSection>

      <LessonSection title="A picture to keep: the bowl">
        <p className="text-slate-300">
          Imagine standing in a smooth valley. Left-right is θ₀, forward-back is θ₁, and height is
          cost J. A bad line puts you high on the hillside. A good line is down in the valley floor.
        </p>
        <Flowchart
          title="Training = walking downhill"
          chart={`flowchart TB
  A[Start somewhere on the hillside] --> B[Measure height J]
  B --> C[Take a step that goes downhill]
  C --> D{Near the bottom?}
  D -- No --> B
  D -- Yes --> E[Those θ₀, θ₁ are your line]`}
        />
        <Callout variant="tip" title="Good news for beginners">
          For this model the valley has one bottom. You will not get trapped on a random hilltop.
          That is why simple linear regression is such a friendly first optimization problem.
        </Callout>
        <Callout variant="info" title="What comes next">
          Next lesson derives ∂J/∂θ₀ and ∂J/∂θ₁ from this cost, step by step (chain rule). After
          that we set those derivatives to zero for the exact best line, and also use them to walk
          downhill with gradient descent.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Cost is a scorecard: how wrong is this line on the training data?',
          'We square mistakes so big errors count more and positives/negatives do not cancel.',
          'Lower J is better; training means finding θ₀ and θ₁ that shrink J.',
          'Think “valley floor,” not scary math — we are only ranking lines fairly.',
        ]}
      />
    </LessonArticle>
  )
}
