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

export function SlrEquations() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Goal of this lesson">
        By the end you should be able to look at ŷ = θ₀ + θ₁x and say out loud:{' '}
        <em>“predicted y equals starting value plus slope times x.”</em> That sentence is enough to
        unlock the rest of the chapter.
      </Callout>

      <Definition term="The prediction equation">
        <p>
          Once we have a line, predicting is just plug-and-play arithmetic:
        </p>
        <p className="mt-3 font-mono text-base text-white">predicted score = start + slope × hours</p>
        <p className="mt-3 text-slate-300">
          In ML notation the same sentence looks like:
        </p>
        <p className="mt-2 font-mono text-base text-white">ŷ = θ₀ + θ₁ · x</p>
      </Definition>

      <LessonSection title="Meet the symbols one by one">
        <p className="text-slate-300">
          Do not memorize a wall of Greek. Learn each piece with a plain English buddy:
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Symbol</th>
                <th className="px-4 py-3">Say it like this</th>
                <th className="px-4 py-3">In our story</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['x', 'the input / feature', 'hours studied'],
                ['y', 'the real answer / label', 'actual exam score'],
                ['ŷ (y-hat)', 'our guess / prediction', 'predicted exam score'],
                ['θ₀ (theta-zero)', 'where the line starts', 'score if hours were 0'],
                ['θ₁ (theta-one)', 'how steep the line is', 'extra marks per hour'],
              ].map(([sym, say, story]) => (
                <tr key={sym} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-machine-learning-400">{sym}</td>
                  <td className="px-4 py-3 font-medium text-white">{say}</td>
                  <td className="px-4 py-3">{story}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Why the hat on ŷ?">
          The hat means “estimate.” y is what really happened; ŷ is what the model guessed. Keeping
          them separate avoids confusion.
        </Callout>
      </LessonSection>

      <LessonSection title="A full prediction, slowly">
        <p className="text-slate-300">
          Suppose training already found: θ₀ = 40 and θ₁ = 7. A new student studied 3 hours.
        </p>
        <ContentStep number={1} title="Write the rule">
          <p className="text-slate-300 font-mono text-sm text-white">ŷ = 40 + 7 × x</p>
        </ContentStep>
        <ContentStep number={2} title="Plug in x = 3">
          <p className="text-slate-300 font-mono text-sm text-white">ŷ = 40 + 7 × 3</p>
        </ContentStep>
        <ContentStep number={3} title="Multiply, then add">
          <p className="text-slate-300 font-mono text-sm text-white">ŷ = 40 + 21 = 61</p>
        </ContentStep>
        <Example title="Same steps in code" output={`61`}>
{`theta0 = 40   # start
theta1 = 7    # marks per hour
x = 3         # hours studied

y_hat = theta0 + theta1 * x
print(y_hat)  # 61`}
        </Example>
        <Callout variant="beginner">
          That is prediction. No calculus. No matrix. Multiply and add.
        </Callout>
      </LessonSection>

      <LessonSection title="What slope and intercept feel like">
        <ContentStep number={1} title="Positive slope (common)">
          <p className="text-slate-300">
            θ₁ &gt; 0 means “as x goes up, our guess goes up.” More study → higher predicted score.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Negative slope">
          <p className="text-slate-300">
            θ₁ &lt; 0 means “as x goes up, our guess goes down.” Example: more kilometers driven → less
            fuel left in the tank.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Intercept as a starting point">
          <p className="text-slate-300">
            θ₀ is the guess when x = 0. Sometimes x = 0 is meaningful (zero hours). Sometimes it is
            just a math anchor outside your data range — still useful for drawing the line.
          </p>
        </ContentStep>
        <Example title="Two lines, two personalities">
{`Line A: ŷ = 40 + 7x     → steep upward (study helps a lot)
Line B: ŷ = 55 + 2x     → flatter (study still helps, but less)

For x = 3:
  Line A → 61
  Line B → 61   (same here by chance)
For x = 10:
  Line A → 110
  Line B → 75   (now they disagree a lot)`}
        </Example>
      </LessonSection>

      <LessonSection title="Training vs predicting (keep these separate)">
        <Flowchart
          title="Two different jobs"
          chart={`flowchart TB
  A[Training time] --> B[Look at many past x and y]
  B --> C[Find good θ₀ and θ₁]
  D[Prediction time] --> E[Already have θ₀ and θ₁]
  E --> F["Just compute ŷ = θ₀ + θ₁x"]`}
        />
        <p className="mt-4 text-slate-300">
          Beginners often mix these up. Remember: training is the hard search. Prediction afterward
          is easy arithmetic.
        </p>
      </LessonSection>

      <LessonSection title="Optional names you may see">
        <p className="text-slate-300">
          Some books call the prediction function a <strong className="text-white">hypothesis</strong>{' '}
          and write hθ(x). It is the same as ŷ:
        </p>
        <p className="mt-2 font-mono text-sm text-white">hθ(x) = θ₀ + θ₁ · x</p>
        <Callout variant="info" title="Skip the vector form for now">
          Later, people write this as a tiny vector multiply. You do <em>not</em> need that to
          understand simple linear regression. Stick with ŷ = θ₀ + θ₁x until it feels boringly
          easy — that is the goal.
        </Callout>
      </LessonSection>

      <LessonSection title="Two ways we will find θ₀ and θ₁ later">
        <ContentStep number={1} title="Math shortcut (OLS)">
          <p className="text-slate-300">
            For this small model there is a direct formula. We will compute it by hand on a tiny
            table.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Step-by-step improvement (gradient descent)">
          <p className="text-slate-300">
            Start with a rough line, measure mistakes, nudge the line, repeat. Same destination,
            different path — and this path works for huge models too.
          </p>
        </ContentStep>
        <Callout variant="beginner">
          You do not choose one forever. Learning both builds confidence: “I can get the answer by
          formula, and I understand the walking method too.”
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'ŷ = θ₀ + θ₁x means: prediction = start + slope × input.',
          'x is input, y is truth, ŷ is the guess.',
          'After θ₀ and θ₁ are known, prediction is multiply-and-add.',
          'Training finds θ₀ and θ₁; predicting only uses them.',
        ]}
      />
    </LessonArticle>
  )
}
