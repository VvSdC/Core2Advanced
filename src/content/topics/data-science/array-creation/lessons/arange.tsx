import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  NotebookCell,
} from '../../../../../components/content'

export function ArangeLesson() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Think of counting">
        Need 0, 1, 2, 3, 4? Or 2, 4, 6, 8? That is{' '}
        <code className="font-mono text-sm text-data-science-400">np.arange</code> — counting with a
        step, returned as an array.
      </Callout>

      <Definition term="np.arange">
        <p>
          <code className="font-mono text-sm text-data-science-400">np.arange</code> builds evenly
          spaced values with a given <strong className="text-white">step</strong> — like Python{' '}
          <code className="font-mono text-sm">range</code>, but returns an array you can do math with.
        </p>
      </Definition>

      <Callout variant="tip">
        Signature to remember: <code className="font-mono text-xs">arange(start, stop, step)</code>.
        Stop is exclusive (just like <code className="font-mono text-xs">range</code>).
      </Callout>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Stop only"
          code={`import numpy as np
print(np.arange(5))`}
          output={`[0 1 2 3 4]`}
        />
        <NotebookCell
          cell={2}
          title="Start, stop, step"
          code={`print(np.arange(2, 10, 2))
print(np.arange(0, 1, 0.25))`}
          output={`[2 4 6 8]
[0.   0.25 0.5  0.75]`}
        />
        <NotebookCell
          cell={3}
          title="Reshape after arange"
          code={`print(np.arange(12).reshape(3, 4))`}
          output={`[[ 0  1  2  3]
 [ 4  5  6  7]
 [ 8  9 10 11]]`}
        />
      </div>

      <KeyTakeaways
        items={[
          'arange uses a step size; stop is not included.',
          'Works with floats too (watch floating-point quirks).',
          'Often paired with reshape to build grids quickly.',
        ]}
      />
    </LessonArticle>
  )
}
