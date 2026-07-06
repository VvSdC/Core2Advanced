import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../../components/content'

export function SelectionSort() {
  return (
    <LessonArticle>
      <Definition term="Selection Sort">
        <p>
          <strong className="text-white">Selection sort</strong> builds the sorted portion one element at a time.
          Each pass finds the minimum value in the unsorted region and swaps it into the next open slot at the
          front.
        </p>
      </Definition>

      <ContentStep number={1} title="How it works">
        <p>
          Split the array mentally into a sorted prefix (left) and unsorted suffix (right). Scan the suffix for
          the smallest element, swap it with the first unsorted position, then repeat. After{' '}
          <code className="font-mono text-sm">k</code> passes, the first <code className="font-mono text-sm">k</code>{' '}
          elements are in final sorted order.
        </p>
        <Example
          title="Selection sort"
          output={`[1, 2, 4, 5, 8]`}
        >{`def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

print(selection_sort([5, 1, 4, 2, 8]))`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Minimal swaps">
        <p>
          Selection sort performs at most <code className="font-mono text-sm">n - 1</code> swaps — far fewer than
          bubble sort on the same input. That can matter when writes are expensive (e.g. flash memory), though
          reads still dominate at O(n²).
        </p>
        <Callout variant="info">
          Time is always O(n²) regardless of input order — even a sorted list requires scanning every unsorted
          suffix to confirm the minimum.
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
                <td className="px-4 py-3">Best</td>
                <td className="px-4 py-3 font-mono">O(n²)</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Average</td>
                <td className="px-4 py-3 font-mono">O(n²)</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Worst</td>
                <td className="px-4 py-3 font-mono">O(n²)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          <strong className="text-slate-200">Space:</strong> O(1) — in-place, only index variables.
        </p>
        <p>
          <strong className="text-slate-200">Stable:</strong> No — swapping a distant minimum past equal
          elements can reorder them. Example:{' '}
          <code className="font-mono text-sm">[4a, 4b, 3]</code> may become{' '}
          <code className="font-mono text-sm">[3, 4b, 4a]</code>.
        </p>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Each pass selects the minimum of the unsorted region and swaps it forward.',
          'At most n − 1 swaps — useful when writes cost more than reads.',
          'Always O(n²) time; O(1) extra space.',
          'Not stable — long-distance swaps can reorder equal keys.',
        ]}
      />
    </LessonArticle>
  )
}
