import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  NotebookCell,
} from '../../../../../components/content'

export function EyeLesson() {
  return (
    <LessonArticle>
      <Definition term="np.eye">
        <p>
          <code className="font-mono text-sm text-data-science-400">np.eye(n)</code> builds the{' '}
          <strong className="text-white">identity matrix</strong> — 1s on the diagonal, 0s elsewhere.
          Common in linear algebra and as a clean example of a structured matrix.
        </p>
      </Definition>

      <Callout variant="beginner">
        “Eye” ≈ “I” for identity. Multiplying by I leaves a vector/matrix unchanged (when shapes
        match).
      </Callout>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="3×3 identity"
          code={`import numpy as np
print(np.eye(3))`}
          output={`[[1. 0. 0.]
 [0. 1. 0.]
 [0. 0. 1.]]`}
        />
        <NotebookCell
          cell={2}
          title="Rectangular eye + integer dtype"
          code={`print(np.eye(3, 4, dtype=int))`}
          output={`[[1 0 0 0]
 [0 1 0 0]
 [0 0 1 0]]`}
        />
        <NotebookCell
          cell={3}
          title="Shift the diagonal with k"
          code={`print(np.eye(4, k=1))   # ones on superdiagonal
print(np.eye(4, k=-1))  # ones on subdiagonal`}
          output={`[[0. 1. 0. 0.]
 [0. 0. 1. 0.]
 [0. 0. 0. 1.]
 [0. 0. 0. 0.]]
[[0. 0. 0. 0.]
 [1. 0. 0. 0.]
 [0. 1. 0. 0.]
 [0. 0. 1. 0.]]`}
        />
      </div>

      <KeyTakeaways
        items={[
          'np.eye(n) → n×n identity matrix.',
          'Can be rectangular; k shifts the diagonal.',
          'Useful building block for linear-algebra style work.',
        ]}
      />
    </LessonArticle>
  )
}
