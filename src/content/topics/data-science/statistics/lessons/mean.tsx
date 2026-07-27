import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  NotebookCell,
} from '../../../../../components/content'

export function MeanLesson() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="You already know this word">
        Mean = average. “Total ÷ how many.” NumPy just does it for whole arrays (or per row/column)
        in one call.
      </Callout>

      <Definition term="np.mean">
        <p>
          <strong className="text-white">Mean</strong> is the average — sum of values divided by
          count. NumPy computes it for the whole array or along a chosen axis.
        </p>
      </Definition>

      <Callout variant="tip">
        For a classroom: mean score = total points ÷ number of students. Same idea for arrays.
      </Callout>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Mean of a 1-D array"
          code={`import numpy as np

scores = np.array([70, 80, 90, 100])
print(np.mean(scores))
print(scores.mean())  # same thing`}
          output={`85.0
85.0`}
        />
        <NotebookCell
          cell={2}
          title="Mean along rows or columns"
          code={`M = np.array([
    [1, 2, 3],
    [4, 5, 6],
])
print("column means:", M.mean(axis=0))
print("row means   :", M.mean(axis=1))
print("overall     :", M.mean())`}
          output={`column means: [2.5 3.5 4.5]
row means   : [2. 5.]
overall     : 3.5`}
        >
          <p>
            <code className="font-mono text-xs">axis=0</code> collapses rows (down columns).{' '}
            <code className="font-mono text-xs">axis=1</code> collapses columns (across each row).
          </p>
        </NotebookCell>
        <NotebookCell
          cell={3}
          title="Keep dimensions with keepdims"
          code={`print(M.mean(axis=1, keepdims=True))`}
          output={`[[2.]
 [5.]]`}
        />
      </div>

      <KeyTakeaways
        items={[
          'np.mean / .mean() average all elements by default.',
          'axis=0 → per-column; axis=1 → per-row for 2-D arrays.',
          'keepdims=True preserves shape for broadcasting.',
        ]}
      />
    </LessonArticle>
  )
}
