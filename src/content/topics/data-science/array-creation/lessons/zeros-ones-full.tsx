import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  NotebookCell,
} from '../../../../../components/content'

export function ZerosOnesFull() {
  return (
    <LessonArticle>
      <Definition term="zeros, ones, full">
        <p>
          Helpers that build arrays filled with a constant:{' '}
          <strong className="text-white">0</strong>, <strong className="text-white">1</strong>, or{' '}
          <strong className="text-white">any value</strong> you choose — perfect for placeholders and
          masks.
        </p>
      </Definition>

      <Callout variant="beginner">
        Pass a shape as an int (1-D) or a tuple (multi-D), e.g.{' '}
        <code className="font-mono text-xs">(2, 3)</code>.
      </Callout>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="np.zeros"
          code={`import numpy as np
print(np.zeros(4))
print(np.zeros((2, 3)))`}
          output={`[0. 0. 0. 0.]
[[0. 0. 0.]
 [0. 0. 0.]]`}
        />
        <NotebookCell
          cell={2}
          title="np.ones"
          code={`print(np.ones(3))
print(np.ones((2, 2), dtype=int))`}
          output={`[1. 1. 1.]
[[1 1]
 [1 1]]`}
        />
        <NotebookCell
          cell={3}
          title="np.full"
          code={`print(np.full((2, 3), 7))
print(np.full(4, -1.5))`}
          output={`[[7 7 7]
 [7 7 7]]
[-1.5 -1.5 -1.5 -1.5]`}
        />
        <NotebookCell
          cell={4}
          title="Like another array’s shape"
          code={`base = np.arange(6).reshape(2, 3)
print(np.zeros_like(base))
print(np.ones_like(base))`}
          output={`[[0 0 0]
 [0 0 0]]
[[1 1 1]
 [1 1 1]]`}
        />
      </div>

      <KeyTakeaways
        items={[
          'zeros / ones / full create constant-filled arrays of a given shape.',
          'Default dtype is float unless you ask otherwise.',
          'zeros_like / ones_like copy the shape of an existing array.',
        ]}
      />
    </LessonArticle>
  )
}
