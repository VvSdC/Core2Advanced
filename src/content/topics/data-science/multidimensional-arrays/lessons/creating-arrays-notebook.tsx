import {
  Callout,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  NotebookCell,
} from '../../../../../components/content'

export function CreatingArraysNotebook() {
  return (
    <LessonArticle>
      <Definition term="ndarray — the NumPy object">
        <p>
          Almost everything in NumPy is an <strong className="text-white">ndarray</strong> (N-dimensional
          array). You create one from lists/tuples, or with helper functions. This notebook builds
          that habit cell by cell.
        </p>
      </Definition>

      <Callout variant="beginner" title="How to read this notebook">
        Each cell: goal in English → code → output. Try the same lines in your own Jupyter/Colab.
        If something fails, check that you ran <code className="font-mono text-xs">import numpy as np</code>{' '}
        first.
      </Callout>

      <Callout variant="tip" title="Where you are in the path">
        You already know <em>why</em> NumPy exists. Now you build your first arrays and peek at
        shape — the skill every later lesson reuses.
      </Callout>

      <LessonSection title="Flow">
        <Flowchart
          title="First NumPy session"
          chart={`flowchart TB
  A[import numpy as np] --> B[np.array from lists]
  B --> C[Check type / ndim / shape]
  C --> D[Build 2-D matrix]
  D --> E[Simple vectorized math]`}
        />
      </LessonSection>

      <div className="space-y-6">
        <NotebookCell
          cell={1}
          title="Import NumPy"
          code={`import numpy as np
print(np.__version__)`}
          output={`2.x.x   # your version may differ`}
        >
          <p>
            The community nickname is <code className="font-mono text-xs">np</code>. Almost every
            tutorial uses it.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={2}
          title="Create a 1-D array from a list"
          code={`scores = np.array([88, 92, 79, 95])
print(scores)
print(type(scores))`}
          output={`[88 92 79 95]
<class 'numpy.ndarray'>`}
        >
          <p>
            <code className="font-mono text-xs">np.array(...)</code> copies your list into a NumPy
            ndarray.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={3}
          title="Inspect: ndim and shape"
          code={`print("ndim :", scores.ndim)
print("shape:", scores.shape)
print("size :", scores.size)`}
          output={`ndim : 1
shape: (4,)
size : 4`}
        >
          <p>
            <code className="font-mono text-xs">ndim</code> = number of axes.{' '}
            <code className="font-mono text-xs">shape</code> = length along each axis.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={4}
          title="Create a 2-D array (matrix)"
          code={`grid = np.array([
    [1, 2, 3],
    [4, 5, 6],
])
print(grid)
print("shape:", grid.shape)  # (rows, columns)`}
          output={`[[1 2 3]
 [4 5 6]]
shape: (2, 3)`}
        >
          <p>Nested lists → rows. Shape (2, 3) means 2 rows and 3 columns.</p>
        </NotebookCell>

        <NotebookCell
          cell={5}
          title="Vectorized math beats a loop"
          code={`print(grid * 10)
print(grid + np.array([100, 200, 300]))`}
          output={`[[10 20 30]
 [40 50 60]]
[[101 202 303]
 [104 205 306]]`}
        >
          <p>
            Multiplication scales every entry. Adding a 1-D array of length 3 broadcasts across
            rows.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={6}
          title="3-D array (stack of matrices)"
          code={`stack = np.array([
    [[1, 2], [3, 4]],
    [[5, 6], [7, 8]],
])
print(stack.shape)`}
          output={`(2, 2, 2)`}
        >
          <p>
            Read shape left to right: 2 blocks, each a 2×2 matrix — a tiny taste of image batches.
          </p>
        </NotebookCell>
      </div>

      <KeyTakeaways
        items={[
          'np.array turns Python sequences into ndarray objects.',
          'ndim / shape / size describe structure at a glance.',
          '2-D arrays are matrices; higher dims stack more axes.',
          'Math on arrays is vectorized — usually no manual loops.',
        ]}
      />
    </LessonArticle>
  )
}
