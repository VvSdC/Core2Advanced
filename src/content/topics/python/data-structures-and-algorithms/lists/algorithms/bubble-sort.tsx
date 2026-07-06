import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../../components/content'

export function BubbleSort() {
  return (
    <LessonArticle>
      <Definition term="Bubble Sort">
        <p>
          <strong className="text-white">Bubble sort</strong> repeatedly walks through the list, comparing
          adjacent pairs and swapping them if they are out of order. After each full pass, the largest unsorted
          element &quot;bubbles&quot; to its final position at the end.
        </p>
      </Definition>

      <ContentStep number={1} title="How it works">
        <p>
          Imagine bubbles rising: each pass pushes the next-biggest value toward the right edge. With{' '}
          <code className="font-mono text-sm">n</code> elements you need at most{' '}
          <code className="font-mono text-sm">n - 1</code> passes, and each pass scans a shrinking unsorted
          prefix.
        </p>
        <Example
          title="Bubble sort — basic version"
          output={`[1, 2, 4, 5, 8]`}
        >{`def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

print(bubble_sort([5, 1, 4, 2, 8]))`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Early exit optimization">
        <p>
          If a pass completes with zero swaps, the list is already sorted — stop early. That drops the{' '}
          <strong className="text-white">best case</strong> to O(n) when input is sorted or nearly sorted.
        </p>
        <Example
          title="Optimized bubble sort"
          output={`[1, 2, 3, 4, 5]`}
        >{`def bubble_sort_optimized(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr

print(bubble_sort_optimized([1, 2, 3, 4, 5]))`}</Example>
        <Callout variant="info">
          Even with early exit, average and worst case remain O(n²) — bubble sort is a teaching tool, not a
          production choice for large lists.
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
                <td className="px-4 py-3">Best (sorted + early exit)</td>
                <td className="px-4 py-3 font-mono">O(n)</td>
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
          <strong className="text-slate-200">Space:</strong> O(1) — only a few variables, swaps in place.
        </p>
        <p>
          <strong className="text-slate-200">Stable:</strong> Yes — equal elements are never swapped past each
          other because only adjacent out-of-order pairs move.
        </p>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Repeatedly swap adjacent out-of-order pairs; largest values bubble right.',
          'Early exit when a pass has no swaps → O(n) best case.',
          'Average and worst time: O(n²); space: O(1).',
          'Stable sort — good for learning, poor for large n in practice.',
        ]}
      />
    </LessonArticle>
  )
}
