import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  NotebookCell,
} from '../../../../../components/content'

export function SlicingArrays() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Same idea as list slices">
        If you know <code className="font-mono text-xs">my_list[2:5]</code>, you already know 90% of
        this lesson. NumPy just adds a second index for tables:{' '}
        <code className="font-mono text-xs">table[rows, cols]</code>.
      </Callout>

      <Definition term="Slicing">
        <p>
          Slicing pulls a <strong className="text-white">window</strong> of values with{' '}
          <code className="font-mono text-sm">start:stop:step</code> — stop is exclusive, just like
          Python lists.
        </p>
      </Definition>

      <Callout variant="tip">
        NumPy slices on arrays often return <em>views</em> (not copies). Changing the slice can
        change the original — handy and dangerous. We show that carefully at the end.
      </Callout>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="1-D slices"
          code={`import numpy as np

a = np.arange(10)  # 0..9
print(a)
print(a[2:7])
print(a[:4])
print(a[::2])   # every second value
print(a[::-1])  # reversed`}
          output={`[0 1 2 3 4 5 6 7 8 9]
[2 3 4 5 6]
[0 1 2 3]
[0 2 4 6 8]
[9 8 7 6 5 4 3 2 1 0]`}
        />

        <NotebookCell
          cell={2}
          title="2-D block slice"
          code={`M = np.arange(1, 13).reshape(3, 4)
print(M)
print()
print(M[0:2, 1:3])  # rows 0–1, cols 1–2`}
          output={`[[ 1  2  3  4]
 [ 5  6  7  8]
 [ 9 10 11 12]]

[[2 3]
 [6 7]]`}
        />

        <NotebookCell
          cell={3}
          title="Slice a row range / column range"
          code={`print(M[1:, :])   # from row 1 to end, all columns
print(M[:, 2:])   # all rows, columns 2 onward`}
          output={`[[ 5  6  7  8]
 [ 9 10 11 12]]
[[ 3  4]
 [ 7  8]
 [11 12]]`}
        />

        <NotebookCell
          cell={4}
          title="Views vs copy (important!)"
          code={`block = M[0:2, 0:2]
block[0, 0] = 999
print(M)  # original changed!

safe = M[0:2, 0:2].copy()
safe[0, 0] = 1
print(M[0, 0])  # still 999`}
          output={`[[999   2   3   4]
 [  5   6   7   8]
 [  9  10  11  12]]
999`}
        >
          <p>
            Use <code className="font-mono text-xs">.copy()</code> when you need an independent
            chunk.
          </p>
        </NotebookCell>
      </div>

      <KeyTakeaways
        items={[
          'Slicing uses start:stop:step; stop is exclusive.',
          '2-D slicing: M[r0:r1, c0:c1].',
          'Slices are often views — .copy() when you need isolation.',
        ]}
      />
    </LessonArticle>
  )
}
