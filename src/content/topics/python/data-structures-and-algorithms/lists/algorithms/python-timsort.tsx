import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../../components/content'

export function PythonTimsort() {
  return (
    <LessonArticle>
      <Definition term="Timsort">
        <p>
          <strong className="text-white">Timsort</strong> is the hybrid sorting algorithm behind Python&apos;s{' '}
          <code className="font-mono text-sm">list.sort()</code> and{' '}
          <code className="font-mono text-sm">sorted()</code>. It combines merge sort&apos;s predictable O(n log
          n) performance with insertion sort&apos;s speed on small or nearly sorted runs.
        </p>
      </Definition>

      <ContentStep number={1} title="list.sort() vs sorted()">
        <p>
          Both use Timsort internally. The difference is whether you mutate the original list or get a new one.
        </p>
        <Example
          title="Built-in sorting in Python"
        >{`nums = [3, 1, 4, 1, 5, 9, 2, 6]

# Returns a new sorted list; nums unchanged
copy = sorted(nums)

# Sorts in place; returns None
nums.sort()

# Custom key and reverse
sorted(students, key=lambda s: s["grade"], reverse=True)`}</Example>
      </ContentStep>

      <ContentStep number={2} title="How Timsort works">
        <p>
          Timsort identifies <strong className="text-white">natural runs</strong> — already sorted or
          reverse-sorted stretches — in the data. Short runs are extended to a minimum size (typically 32–64)
          using insertion sort, then runs are merged pairwise like merge sort.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-slate-400">
          <li>Exploits existing order in real-world data (logs, timestamps, partially sorted inputs).</li>
          <li>Stable — equal elements keep their relative order.</li>
          <li>Adaptive — nearly sorted input can approach O(n) time.</li>
        </ul>
        <Callout variant="info">
          Timsort was invented by Tim Peters for Python and is also used in Java (since Java 7) and Android.
        </Callout>
      </ContentStep>

      <ContentStep number={3} title="Why Python uses it">
        <p>
          Pure quick sort is fast on random data but can degrade to O(n²) and is not stable. Merge sort is stable
          and consistent but needs extra space and is slower on small arrays. Timsort gets the best of both:
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-surface-600 bg-surface-800/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Property</th>
                <th className="px-4 py-3 font-semibold">Timsort</th>
              </tr>
            </thead>
            <tbody className="text-slate-400">
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Worst-case time</td>
                <td className="px-4 py-3 font-mono">O(n log n)</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Best case (sorted)</td>
                <td className="px-4 py-3 font-mono">O(n)</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Space</td>
                <td className="px-4 py-3 font-mono">O(n)</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Stable</td>
                <td className="px-4 py-3">Yes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ContentStep>

      <ContentStep number={4} title="When to use built-ins">
        <Example
          title="Prefer sorted() / list.sort() in production"
        >{`# Good — C-optimized Timsort
data.sort(key=str.lower)

# Avoid reimplementing sort unless learning or special constraints
# def my_sort(arr): ...  # almost always slower`}</Example>
        <Callout variant="insight">
          Interview tip: say you would use <code className="font-mono text-sm">sorted()</code> in production, but
          be ready to implement merge sort or quick sort from scratch and explain why Timsort is Python&apos;s
          default.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'sorted() returns new list; list.sort() sorts in place — both use Timsort.',
          'Hybrid: insertion sort on small runs + merge sort on runs.',
          'Stable, O(n log n) worst case, O(n) best on sorted data.',
          'Python chose it for real-world adaptability — use built-ins unless you have a reason not to.',
        ]}
      />
    </LessonArticle>
  )
}
