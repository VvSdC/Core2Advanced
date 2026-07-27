import {
  Callout,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  NotebookCell,
} from '../../../../../components/content'

export function BroadcastingNotebook() {
  return (
    <LessonArticle>
      <Definition term="Broadcasting practice">
        <p>
          Work through the common cases with code and outputs: scalar, row vector, column vector,
          a mismatch error, and a practical “subtract the mean” example.
        </p>
      </Definition>

      <Callout variant="beginner" title="How to read this notebook">
        Goal → code → output. After each cell, say out loud which axis was stretched.
      </Callout>

      <LessonSection title="Flow">
        <Flowchart
          title="What we will try"
          chart={`flowchart TB
  A[Scalar + array] --> B[Row vector + matrix]
  B --> C[Column vector + matrix]
  C --> D[See a shape error]
  D --> E[Practical: demean columns]`}
        />
      </LessonSection>

      <div className="space-y-6">
        <NotebookCell
          cell={1}
          title="Scalar broadcasting"
          code={`import numpy as np

x = np.arange(3)
print(x)
print(x + 5)
print(x * 10)`}
          output={`[0 1 2]
[5 6 7]
[ 0 10 20]`}
        >
          <p>The scalar is stretched to match every element of x.</p>
        </NotebookCell>

        <NotebookCell
          cell={2}
          title="Row vector + matrix (shape (3,) with (2, 3))"
          code={`A = np.array([
    [1, 2, 3],
    [4, 5, 6],
])
b = np.array([10, 20, 30])
print("A shape:", A.shape, " b shape:", b.shape)
print(A + b)`}
          output={`A shape: (2, 3)  b shape: (3,)
[[11 22 33]
 [14 25 36]]`}
        >
          <p>
            b lines up with each row. Same pattern as <code className="font-mono text-xs">prices + tax</code>{' '}
            in the intro lesson.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={3}
          title="Column vector + matrix (shape (2, 1) with (2, 3))"
          code={`col = np.array([[10], [20]])
print("col shape:", col.shape)
print(A + col)`}
          output={`col shape: (2, 1)
[[11 12 13]
 [24 25 26]]`}
        >
          <p>
            Size-1 column axis stretches across all 3 columns — 10 added to row 0, 20 to row 1.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={4}
          title="Make a column with np.newaxis"
          code={`v = np.array([10, 20])
print(v.shape)
print(v[:, np.newaxis].shape)
print(A + v[:, np.newaxis])`}
          output={`(2,)
(2, 1)
[[11 12 13]
 [24 25 26]]`}
        />

        <NotebookCell
          cell={5}
          title="When broadcasting fails"
          code={`try:
    np.array([1, 2, 3]) + np.array([1, 2])
except ValueError as e:
    print(e)`}
          output={`operands could not be broadcast together with shapes (3,) (2,)`}
        >
          <p>
            3 and 2 on the same axis — neither is 1 — so NumPy refuses. Fix by reshaping or using
            matching lengths.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={6}
          title="Practical — subtract column means"
          code={`data = np.array([
    [1., 2., 3.],
    [4., 5., 6.],
    [7., 8., 9.],
])
col_means = data.mean(axis=0)          # shape (3,)
centered = data - col_means            # broadcast over rows
print("means:", col_means)
print(centered)
print("new means:", centered.mean(axis=0))`}
          output={`means: [4. 5. 6.]
[[-3. -3. -3.]
 [ 0.  0.  0.]
 [ 3.  3.  3.]]
new means: [0. 0. 0.]`}
        >
          <p>
            Classic data trick: center each feature. <code className="font-mono text-xs">mean(axis=0)</code>{' '}
            is a row-sized vector; subtracting it from every row uses broadcasting.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={7}
          title="keepdims helps column-wise demean too"
          code={`row_means = data.mean(axis=1, keepdims=True)  # shape (3, 1)
print(row_means.shape)
print(data - row_means)`}
          output={`(3, 1)
[[-1.  0.  1.]
 [-1.  0.  1.]
 [-1.  0.  1.]]`}
        >
          <p>
            <code className="font-mono text-xs">keepdims=True</code> keeps a size-1 axis so the
            column-stretch pattern stays obvious.
          </p>
        </NotebookCell>
      </div>

      <KeyTakeaways
        items={[
          'Scalar, row, and column broadcasts cover most day-to-day needs.',
          'np.newaxis / reshape(..., 1) turns a vector into a column for stretching across columns.',
          'Shape errors mean an axis conflict — check sizes from the right.',
          'Demeaning with mean(axis=…) − data is a real-world broadcasting pattern.',
        ]}
      />
    </LessonArticle>
  )
}
