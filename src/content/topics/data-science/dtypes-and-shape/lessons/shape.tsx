import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  NotebookCell,
} from '../../../../../components/content'

export function ShapeLesson() {
  return (
    <LessonArticle>
      <Definition term="shape">
        <p>
          <strong className="text-white">shape</strong> is a tuple giving the size of the array along
          each axis — e.g. <code className="font-mono text-sm">(3, 4)</code> means 3 rows and 4
          columns.
        </p>
      </Definition>

      <Callout variant="beginner">
        Always check <code className="font-mono text-xs">.shape</code> when debugging. Most NumPy
        bugs are “wrong shape” bugs.
      </Callout>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="1-D shape"
          code={`import numpy as np

v = np.array([10, 20, 30, 40])
print(v.shape)`}
          output={`(4,)`}
        >
          <p>A trailing comma marks a 1-tuple in Python — length 4 along one axis.</p>
        </NotebookCell>

        <NotebookCell
          cell={2}
          title="2-D shape"
          code={`M = np.array([[1, 2, 3], [4, 5, 6]])
print(M.shape)
print("rows:", M.shape[0], "cols:", M.shape[1])`}
          output={`(2, 3)
rows: 2 cols: 3`}
        />

        <NotebookCell
          cell={3}
          title="reshape without changing data"
          code={`flat = np.arange(12)
print(flat)
print(flat.reshape(3, 4))
print(flat.reshape(2, 2, 3))`}
          output={`[ 0  1  2  3  4  5  6  7  8  9 10 11]
[[ 0  1  2  3]
 [ 4  5  6  7]
 [ 8  9 10 11]]
[[[ 0  1  2]
  [ 3  4  5]]
 [[ 6  7  8]
  [ 9 10 11]]]`}
        >
          <p>
            Total size must match: 12 = 3×4 = 2×2×3. Use{' '}
            <code className="font-mono text-xs">-1</code> to let NumPy infer one dimension.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={4}
          title="Infer a dimension with -1"
          code={`print(flat.reshape(3, -1))
print(flat.reshape(-1, 1).shape)  # column vector`}
          output={`[[ 0  1  2  3]
 [ 4  5  6  7]
 [ 8  9 10 11]]
(12, 1)`}
        />

        <NotebookCell
          cell={5}
          title="size, ndim, itemsize"
          code={`print("size    :", M.size)
print("ndim    :", M.ndim)
print("itemsize:", M.itemsize, "bytes per element")`}
          output={`size    : 6
ndim    : 2
itemsize: 8 bytes per element`}
        />
      </div>

      <KeyTakeaways
        items={[
          'shape tells lengths along each axis (rows, cols, …).',
          'reshape rearranges the same data into a new shape.',
          'size is the total number of elements; ndim is the number of axes.',
        ]}
      />
    </LessonArticle>
  )
}
