import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  NotebookCell,
} from '../../../../../components/content'

export function RandomLesson() {
  return (
    <LessonArticle>
      <Definition term="NumPy random arrays">
        <p>
          NumPy can fill arrays with <strong className="text-white">random values</strong> — uniform,
          normal, integers — great for simulations, tests, and toy datasets. Prefer the modern{' '}
          <code className="font-mono text-sm">np.random.default_rng()</code> generator.
        </p>
      </Definition>

      <Callout variant="tip">
        Set a seed (or create a Generator with a seed) so experiments are reproducible.
      </Callout>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Create a Generator"
          code={`import numpy as np

rng = np.random.default_rng(42)  # seed for reproducibility
print(rng.random(3))            # uniform [0, 1)`}
          output={`[0.77395605 0.43887844 0.85859792]`}
        />
        <NotebookCell
          cell={2}
          title="Random matrix"
          code={`print(np.round(rng.random((2, 3)), 3))`}
          output={`[[0.697 0.094 0.976]
 [0.761 0.786 0.128]]`}
        />
        <NotebookCell
          cell={3}
          title="Integers and normal distribution"
          code={`print(rng.integers(1, 7, size=8))          # like dice rolls
print(np.round(rng.normal(0, 1, size=5), 3))  # standard normal`}
          output={`[6 3 4 3 2 6 5 4]
[ 1.127  0.468 -0.859  0.369 -0.959]`}
        />
        <NotebookCell
          cell={4}
          title="Shuffle a copy"
          code={`x = np.arange(6)
rng.shuffle(x)
print(x)`}
          output={`[3 2 1 5 4 0]`}
        />
      </div>

      <KeyTakeaways
        items={[
          'Use default_rng(seed) for reproducible randomness.',
          'random / integers / normal cover most beginner needs.',
          'Great for demos, bootstrapping, and synthetic data.',
        ]}
      />
    </LessonArticle>
  )
}
