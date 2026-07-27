import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  NotebookCell,
} from '../../../../../components/content'

export function FilteringArrays() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        “Show me only the students who scored 60 or more.” That sentence is filtering. In NumPy you
        write the condition once, and the array keeps the matching values.
      </Callout>

      <Definition term="Boolean filtering">
        <p>
          Compare an array to a condition to get a <strong className="text-white">boolean mask</strong>{' '}
          (True/False for each value), then use that mask to keep only the values you want — NumPy’s
          clean alternative to writing filter loops.
        </p>
      </Definition>

      <Callout variant="tip">
        Pattern to memorize: <code className="font-mono text-xs">array[array &gt; threshold]</code>
      </Callout>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Build a boolean mask"
          code={`import numpy as np

scores = np.array([55, 72, 91, 40, 88, 60])
mask = scores >= 60
print(mask)
print(scores[mask])`}
          output={`[False  True  True False  True  True]
[72 91 88 60]`}
        />
        <NotebookCell
          cell={2}
          title="One-liner filter"
          code={`print(scores[scores < 60])`}
          output={`[55 40]`}
        />
        <NotebookCell
          cell={3}
          title="Combine conditions"
          code={`# & and | for element-wise and/or — parentheses required
print(scores[(scores >= 60) & (scores < 90)])`}
          output={`[72 88 60]`}
        >
          <p>
            Do not use Python <code className="font-mono text-xs">and</code> /{' '}
            <code className="font-mono text-xs">or</code> on arrays — use{' '}
            <code className="font-mono text-xs">&amp;</code> /{' '}
            <code className="font-mono text-xs">|</code> with parentheses.
          </p>
        </NotebookCell>
        <NotebookCell
          cell={4}
          title="np.where for indexes or choices"
          code={`idx = np.where(scores >= 90)
print(idx)
print(scores[idx])

labels = np.where(scores >= 60, "pass", "fail")
print(labels)`}
          output={`(array([2]),)
[91]
['fail' 'pass' 'pass' 'fail' 'pass' 'pass']`}
        />
        <NotebookCell
          cell={5}
          title="Filter a 2-D array (flattening note)"
          code={`M = np.arange(1, 10).reshape(3, 3)
print(M)
print(M[M % 2 == 1])  # odd numbers → 1-D result`}
          output={`[[1 2 3]
 [4 5 6]
 [7 8 9]]
[1 3 5 7 9]`}
        />
      </div>

      <KeyTakeaways
        items={[
          'Comparisons on arrays produce boolean masks.',
          'array[mask] keeps matching elements.',
          'Combine conditions with & / | and parentheses; use np.where for indexes or if-else arrays.',
        ]}
      />
    </LessonArticle>
  )
}
