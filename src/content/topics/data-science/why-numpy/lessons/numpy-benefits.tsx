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

export function NumpyBenefits() {
  return (
    <LessonArticle>
      <Definition term="Why teams use NumPy">
        <p>
          NumPy gives you <strong className="text-white">fast array math</strong>, a huge set of
          ready-made numeric functions, and the ability to express complex calculations in a few
          clear lines — the foundation under pandas, scikit-learn, and much of scientific Python.
        </p>
      </Definition>

      <LessonSection title="Three big benefits">
        <ContentStep number={1} title="Parallel-friendly, vectorized operations">
          <p className="text-slate-300">
            Writing <code className="font-mono text-sm text-data-science-400">a + b</code> on arrays
            does not mean a slow Python for-loop. NumPy applies the op across the whole array in
            optimized compiled code (and can use CPU SIMD / multi-threaded routines under the hood).
          </p>
          <Example title="One line instead of a loop">
{`import numpy as np

temps_c = np.array([0, 10, 20, 30])
temps_f = temps_c * 9/5 + 32
# array([32., 50., 68., 86.])`}
          </Example>
        </ContentStep>

        <ContentStep number={2} title="Optimized built-in math">
          <p className="text-slate-300">
            Means, medians, trig, linear algebra helpers, random sampling — battle-tested and fast.
            You reuse tools instead of reinventing them.
          </p>
          <Example title="Built-ins you will use constantly">
{`np.mean(x)
np.median(x)
np.sqrt(x)
np.dot(A, B)
np.random.rand(3, 3)`}
          </Example>
        </ContentStep>

        <ContentStep number={3} title="Complex math with minimal code">
          <p className="text-slate-300">
            Filtering, broadcasting, and matrix ops let you write ideas close to the math on paper.
          </p>
          <Example title="Filter + transform in two lines">
{`scores = np.array([55, 72, 91, 40, 88])
passed = scores[scores >= 60]
boosted = passed * 1.05`}
          </Example>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Where NumPy sits in the stack">
        <Flowchart
          title="NumPy as the numeric base"
          chart={`flowchart TB
  A[Your data science code] --> B[pandas / scikit-learn / plots]
  B --> C[NumPy arrays under the hood]
  C --> D[Fast C / Fortran routines]`}
        />
        <Callout variant="insight">
          Learning NumPy early pays rent forever — almost every Python data tool speaks “arrays.”
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Vectorized ops: math on whole arrays without manual Python loops.',
          'Rich, optimized math functions for stats, algebra, and random numbers.',
          'Express complex numeric ideas in short, readable code.',
        ]}
      />
    </LessonArticle>
  )
}
