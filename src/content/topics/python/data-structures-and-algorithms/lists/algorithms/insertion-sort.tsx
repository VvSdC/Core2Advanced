import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../../components/content'

export function InsertionSort() {
  return (
    <LessonArticle>
      <Definition term="Insertion Sort">
        <p>
          <strong className="text-white">Insertion sort</strong> builds a sorted prefix by taking each next
          element and sliding it left into its correct position — like sorting a hand of playing cards one card
          at a time.
        </p>
      </Definition>

      <ContentStep number={1} title="How it works">
        <p>
          Starting from index 1, pick the current element as a &quot;key,&quot; compare it against sorted
          elements to its left, shift larger values one slot right, then insert the key into the gap.
        </p>
        <Example
          title="Insertion sort"
          output={`[1, 2, 4, 5, 8]`}
        >{`def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

print(insertion_sort([5, 1, 4, 2, 8]))`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Best case: already sorted">
        <p>
          When the list is sorted, the inner <code className="font-mono text-sm">while</code> loop never runs —
          each element is placed immediately. That gives O(n) time: one pass, constant work per element.
        </p>
        <Example
          title="Nearly sorted input is fast"
          output={`[1, 2, 3, 4, 5, 6]`}
        >{`def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

# Only one misplaced element → almost O(n)
print(insertion_sort([1, 2, 3, 6, 4, 5]))`}</Example>
        <Callout variant="insight">
          Timsort (Python&apos;s built-in sort) uses insertion sort on small runs — typically 32–64 elements —
          because it is fast and stable for tiny arrays.
        </Callout>
      </ContentStep>

      <ContentStep number={3} title="Complexity and stability">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-surface-600 bg-surface-800/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Case</th>
                <th className="px-4 py-3 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody className="text-slate-400">
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Best (sorted)</td>
                <td className="px-4 py-3 font-mono">O(n)</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Average</td>
                <td className="px-4 py-3 font-mono">O(n²)</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Worst (reverse sorted)</td>
                <td className="px-4 py-3 font-mono">O(n²)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          <strong className="text-slate-200">Space:</strong> O(1) — in-place; only the key and index variables.
        </p>
        <p>
          <strong className="text-slate-200">Stable:</strong> Yes — equal elements are never shifted past each
          other because the loop condition is <code className="font-mono text-sm">arr[j] &gt; key</code>, not{' '}
          <code className="font-mono text-sm">&gt;=</code>.
        </p>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Insert each element into its correct position in the sorted prefix.',
          'Best case O(n) when input is sorted; worst O(n²) when reverse sorted.',
          'O(1) space; stable.',
          'Excellent for small n or nearly sorted data — used inside Timsort.',
        ]}
      />
    </LessonArticle>
  )
}
