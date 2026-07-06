import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../../components/content'

export function QuickSort() {
  return (
    <LessonArticle>
      <Definition term="Quick Sort">
        <p>
          <strong className="text-white">Quick sort</strong> picks a <strong className="text-white">pivot</strong>{' '}
          element, partitions the array so values less than the pivot sit left and greater values sit right, then
          recursively sorts each partition. It is usually the fastest general-purpose in-place comparison sort in
          practice.
        </p>
      </Definition>

      <ContentStep number={1} title="Partitioning in place">
        <p>
          After choosing a pivot (often the last element), scan with two pointers: move smaller items left of the
          pivot and larger items right. The pivot lands in its final sorted position — then recurse on the left
          and right subarrays.
        </p>
        <Example
          title="Quick sort with Lomuto partition"
          output={`[1, 2, 4, 5, 8]`}
        >{`def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    if low < high:
        pivot_idx = partition(arr, low, high)
        quick_sort(arr, low, pivot_idx - 1)
        quick_sort(arr, pivot_idx + 1, high)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

print(quick_sort([5, 1, 4, 2, 8]))`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Pivot choice matters">
        <p>
          A bad pivot — always the smallest or largest remaining element — produces unbalanced partitions and
          O(n²) worst-case time. Common fixes:
        </p>
        <ul className="list-disc space-y-2 pl-5 text-slate-400">
          <li>
            <strong className="text-slate-200">Random pivot</strong> — expected balanced splits.
          </li>
          <li>
            <strong className="text-slate-200">Median-of-three</strong> — pick median of first, middle, last.
          </li>
          <li>
            <strong className="text-slate-200">Switch to insertion sort</strong> for small subarrays (what many
            libraries do).
          </li>
        </ul>
        <Example
          title="Random pivot reduces worst-case risk"
        >{`import random

def partition_random(arr, low, high):
    pivot_idx = random.randint(low, high)
    arr[pivot_idx], arr[high] = arr[high], arr[pivot_idx]
    # ... then standard Lomuto partition on arr[high]`}</Example>
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
                <td className="px-4 py-3 font-mono">O(n log n)</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Average</td>
                <td className="px-4 py-3 font-mono">O(n log n)</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Worst (bad pivot every time)</td>
                <td className="px-4 py-3 font-mono">O(n²)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          <strong className="text-slate-200">Space:</strong> O(log n) average for recursion stack; O(n) worst case
          with unbalanced recursion. Sorting is in-place aside from stack frames.
        </p>
        <p>
          <strong className="text-slate-200">Stable:</strong> No — swapping during partition can reorder equal
          elements.
        </p>
        <Callout variant="insight">
          Python&apos;s <code className="font-mono text-sm">sorted()</code> and{' '}
          <code className="font-mono text-sm">list.sort()</code> use Timsort, not quick sort — Timsort is stable
          and handles real-world data patterns well.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Pick a pivot, partition in place, recurse on left and right.',
          'Average O(n log n); worst O(n²) with consistently bad pivots.',
          'O(log n) average stack space; in-place aside from recursion.',
          'Not stable; pivot strategy (random, median-of-three) is critical.',
        ]}
      />
    </LessonArticle>
  )
}
