import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  NotebookCell,
} from '../../../../../components/content'

export function AccessingElements() {
  return (
    <LessonArticle>
      <Definition term="Accessing array elements">
        <p>
          Use <strong className="text-white">integer indexes</strong> like lists for 1-D arrays, and{' '}
          <code className="font-mono text-sm">[row, col]</code> for 2-D — NumPy’s natural way to pick
          a single value or a whole row/column.
        </p>
      </Definition>

      <Callout variant="beginner">Indexes start at 0. Negative indexes count from the end.</Callout>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="1-D access"
          code={`import numpy as np

a = np.array([10, 20, 30, 40, 50])
print(a[0])
print(a[-1])
print(a[2])`}
          output={`10
50
30`}
        />

        <NotebookCell
          cell={2}
          title="2-D access with [row, col]"
          code={`M = np.array([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
])
print(M[0, 0])  # first row, first col
print(M[1, 2])  # second row, third col
print(M[-1, -1])`}
          output={`1
6
9`}
        />

        <NotebookCell
          cell={3}
          title="Whole row or column"
          code={`print("row 1   :", M[1])
print("column 0:", M[:, 0])
print("column 2:", M[:, 2])`}
          output={`row 1   : [4 5 6]
column 0: [1 4 7]
column 2: [3 6 9]`}
        >
          <p>
            <code className="font-mono text-xs">:</code> means “all.” So{' '}
            <code className="font-mono text-xs">M[:, 0]</code> is every row, column 0.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={4}
          title="Assign a value"
          code={`M[0, 0] = 99
print(M)`}
          output={`[[99  2  3]
 [ 4  5  6]
 [ 7  8  9]]`}
        />
      </div>

      <KeyTakeaways
        items={[
          '1-D: a[i]. 2-D: M[row, col].',
          'M[r] picks a row; M[:, c] picks a column.',
          'You can assign into positions the same way.',
        ]}
      />
    </LessonArticle>
  )
}
