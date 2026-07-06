import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../../components/content'

export function SortingOverview() {
  return (
    <LessonArticle>
      <Definition term="Sorting Algorithms">
        <p>
          A <strong className="text-white">sorting algorithm</strong> rearranges a collection into a defined order
          — usually ascending. Before diving into individual algorithms, understand three ideas interviewers care
          about: how elements are compared, whether equal elements keep their original order, and how runtime
          scales as input size grows.
        </p>
      </Definition>

      <ContentStep number={1} title="Comparison vs non-comparison sorts">
        <p>
          <strong className="text-white">Comparison sorts</strong> decide order by comparing pairs of elements
          (e.g. <code className="font-mono text-sm">a &lt; b</code>). Bubble sort, merge sort, and quick sort all
          work this way. They can sort any type with a consistent ordering.
        </p>
        <p>
          <strong className="text-white">Non-comparison sorts</strong> use properties of the data itself — digit
          positions, key ranges — without general pairwise comparison. Counting sort and radix sort are examples;
          they are faster when keys fit specific constraints but are not general-purpose.
        </p>
        <Example
          title="Comparison sort in Python"
        >{`nums = [3, 1, 4, 1, 5]
sorted(nums)          # [1, 1, 3, 4, 5] — uses Timsort internally
nums.sort()           # sorts in place`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Stability">
        <p>
          A sort is <strong className="text-white">stable</strong> if elements with equal keys appear in the same
          relative order after sorting as they did before. That matters when you sort records by one field, then
          another — a stable sort preserves the first sort&apos;s ordering among ties.
        </p>
        <Example
          title="Stable vs unstable with ties"
          caption="Stable sort keeps original order among equal keys"
        >{`students = [("Ada", 90), ("Bob", 85), ("Cal", 90)]

# Stable: Ada before Cal (both scored 90)
sorted(students, key=lambda s: s[1])
# [("Bob", 85), ("Ada", 90), ("Cal", 90)]`}</Example>
        <Callout variant="info">
          Merge sort and Timsort are stable. Selection sort and quick sort (typical implementations) are not.
        </Callout>
      </ContentStep>

      <ContentStep number={3} title="Best, average, and worst case">
        <p>
          Big-O describes how runtime grows as <code className="font-mono text-sm">n</code> (input size)
          increases — not exact seconds. Three cases matter:
        </p>
        <ul className="list-disc space-y-2 pl-5 text-slate-400">
          <li>
            <strong className="text-slate-200">Best case</strong> — luckiest input (e.g. already sorted for
            insertion sort).
          </li>
          <li>
            <strong className="text-slate-200">Average case</strong> — typical random input.
          </li>
          <li>
            <strong className="text-slate-200">Worst case</strong> — adversarial input (e.g. reverse-sorted for
            naive quick sort).
          </li>
        </ul>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-surface-600 bg-surface-800/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Algorithm</th>
                <th className="px-4 py-3 font-semibold">Best</th>
                <th className="px-4 py-3 font-semibold">Average</th>
                <th className="px-4 py-3 font-semibold">Worst</th>
                <th className="px-4 py-3 font-semibold">Stable</th>
              </tr>
            </thead>
            <tbody className="text-slate-400">
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Bubble sort</td>
                <td className="px-4 py-3 font-mono">O(n)</td>
                <td className="px-4 py-3 font-mono">O(n²)</td>
                <td className="px-4 py-3 font-mono">O(n²)</td>
                <td className="px-4 py-3">Yes</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Selection sort</td>
                <td className="px-4 py-3 font-mono">O(n²)</td>
                <td className="px-4 py-3 font-mono">O(n²)</td>
                <td className="px-4 py-3 font-mono">O(n²)</td>
                <td className="px-4 py-3">No</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Insertion sort</td>
                <td className="px-4 py-3 font-mono">O(n)</td>
                <td className="px-4 py-3 font-mono">O(n²)</td>
                <td className="px-4 py-3 font-mono">O(n²)</td>
                <td className="px-4 py-3">Yes</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Merge sort</td>
                <td className="px-4 py-3 font-mono">O(n log n)</td>
                <td className="px-4 py-3 font-mono">O(n log n)</td>
                <td className="px-4 py-3 font-mono">O(n log n)</td>
                <td className="px-4 py-3">Yes</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Quick sort</td>
                <td className="px-4 py-3 font-mono">O(n log n)</td>
                <td className="px-4 py-3 font-mono">O(n log n)</td>
                <td className="px-4 py-3 font-mono">O(n²)</td>
                <td className="px-4 py-3">No*</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-slate-500">* Typical in-place quick sort; stable variants exist with extra space.</p>
      </ContentStep>

      <ContentStep number={4} title="Space complexity">
        <p>
          <strong className="text-white">In-place</strong> sorts use O(1) extra memory beyond the input (modulo
          recursion stack). Merge sort needs O(n) auxiliary space to merge halves. Python&apos;s{' '}
          <code className="font-mono text-sm">list.sort()</code> uses Timsort — O(n) worst-case auxiliary space
          in CPython.
        </p>
        <Callout variant="insight">
          Comparison sorts cannot beat O(n log n) average time in the general case — that is a proven lower bound.
          Non-comparison sorts can do better when key constraints allow it.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Comparison sorts use pairwise comparisons; non-comparison sorts exploit key structure.',
          'Stable sorts preserve relative order among equal elements.',
          'Report best, average, and worst case — they differ for many algorithms.',
          'O(n log n) is the comparison-sort lower bound; merge sort always hits it.',
          'In-place vs extra space is a separate axis from time complexity.',
        ]}
      />
    </LessonArticle>
  )
}
