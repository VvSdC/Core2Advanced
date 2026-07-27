import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  NotebookCell,
} from '../../../../../components/content'

export function MedianLesson() {
  return (
    <LessonArticle>
      <Definition term="np.median">
        <p>
          The <strong className="text-white">median</strong> is the middle value after sorting. It is
          less sensitive to extreme outliers than the mean — a favorite for messy real-world data.
        </p>
      </Definition>

      <Callout variant="tip">
        Odd count → middle element. Even count → average of the two middle elements.
      </Callout>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Median vs mean with an outlier"
          code={`import numpy as np

pay = np.array([30, 32, 31, 33, 200])  # one huge salary
print("mean  :", np.mean(pay))
print("median:", np.median(pay))`}
          output={`mean  : 65.2
median: 32.0`}
        >
          <p>The mean is pulled up by 200; the median still describes a “typical” pay.</p>
        </NotebookCell>
        <NotebookCell
          cell={2}
          title="Even number of values"
          code={`print(np.median([1, 2, 3, 4]))`}
          output={`2.5`}
        />
        <NotebookCell
          cell={3}
          title="Median along an axis"
          code={`M = np.array([
    [1, 100, 3],
    [4,   5, 6],
])
print(np.median(M, axis=1))`}
          output={`[3. 5.]`}
        />
      </div>

      <KeyTakeaways
        items={[
          'Median = middle of sorted values; robust to outliers.',
          'Compare mean vs median to spot skewed data.',
          'np.median also supports axis= for 2-D arrays.',
        ]}
      />
    </LessonArticle>
  )
}
