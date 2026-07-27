import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  NotebookCell,
} from '../../../../../components/content'

export function DtypesLesson() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="One rule to remember">
        In a NumPy array, <strong className="text-white">every cell is the same kind of value</strong>{' '}
        — all integers, or all floats, or all True/False. That single choice is the{' '}
        <code className="font-mono text-xs">dtype</code>.
      </Callout>

      <Definition term="dtype">
        <p>
          Every NumPy array has a <strong className="text-white">dtype</strong> — the single data
          type of its elements (e.g. int64, float64, bool). Homogeneous types are a big reason NumPy
          is fast.
        </p>
      </Definition>

      <Callout variant="tip">
        Unlike a Python list, one array does not mix ints and strings. NumPy picks (or you specify)
        one dtype for the whole block.
      </Callout>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Default dtype from integers"
          code={`import numpy as np

a = np.array([1, 2, 3])
print(a.dtype)`}
          output={`int64   # or int32 on some platforms`}
        />

        <NotebookCell
          cell={2}
          title="Floats force a float dtype"
          code={`b = np.array([1.0, 2.5, 3])
print(b)
print(b.dtype)`}
          output={`[1.  2.5 3. ]
float64`}
        />

        <NotebookCell
          cell={3}
          title="Ask for a dtype explicitly"
          code={`c = np.array([1, 2, 3], dtype=np.float32)
print(c.dtype)
print(c)`}
          output={`float32
[1. 2. 3.]`}
        >
          <p>Useful when you care about memory (float32 is half of float64) or API requirements.</p>
        </NotebookCell>

        <NotebookCell
          cell={4}
          title="Convert with astype"
          code={`d = a.astype(np.float64)
print(d.dtype)
print(d)`}
          output={`float64
[1. 2. 3.]`}
        />

        <NotebookCell
          cell={5}
          title="Booleans"
          code={`flags = np.array([True, False, True])
print(flags.dtype)`}
          output={`bool`}
        />
      </div>

      <LessonSection title="Common dtypes">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">dtype</th>
                <th className="px-4 py-3">Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['int32 / int64', 'Integers'],
                ['float32 / float64', 'Decimals (default float is float64)'],
                ['bool', 'True / False'],
                ['str_ / U', 'Fixed-width Unicode strings'],
              ].map(([d, m]) => (
                <tr key={d}>
                  <td className="px-4 py-3 font-mono text-data-science-400">{d}</td>
                  <td className="px-4 py-3">{m}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'dtype is the element type for the whole array.',
          'NumPy may upcast (ints → floats) when needed.',
          'Use dtype=… or astype to control precision and memory.',
        ]}
      />
    </LessonArticle>
  )
}
