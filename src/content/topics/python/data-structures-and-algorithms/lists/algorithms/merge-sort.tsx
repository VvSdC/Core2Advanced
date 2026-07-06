import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../../components/content'

export function MergeSort() {
  return (
    <LessonArticle>
      <Definition term="Merge Sort">
        <p>
          <strong className="text-white">Merge sort</strong> is a divide-and-conquer algorithm: split the list in
          half recursively until each piece has one element, then merge sorted halves back together. It
          guarantees O(n log n) time regardless of input order.
        </p>
      </Definition>

      <ContentStep number={1} title="Divide and conquer">
        <p>
          <strong className="text-white">Divide</strong> — split the array at the midpoint.{' '}
          <strong className="text-white">Conquer</strong> — recursively sort each half.{' '}
          <strong className="text-white">Combine</strong> — merge two sorted halves into one sorted array using
          two pointers.
        </p>
        <Example
          title="Merge sort — top-level structure"
          output={`[1, 2, 4, 5, 8]`}
        >{`def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

print(merge_sort([5, 1, 4, 2, 8]))`}</Example>
      </ContentStep>

      <ContentStep number={2} title="The merge step">
        <p>
          Merging two sorted lists of total length <code className="font-mono text-sm">n</code> takes O(n) time —
          each element is compared and appended once. The recursion tree has O(log n) levels, giving O(n log n)
          overall.
        </p>
        <Callout variant="info">
          Use <code className="font-mono text-sm">&lt;=</code> when comparing (as above) to keep merge sort
          stable — equal elements from the left half are taken first.
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
                <td className="px-4 py-3 font-mono">O(n log n)</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Average</td>
                <td className="px-4 py-3 font-mono">O(n log n)</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Worst</td>
                <td className="px-4 py-3 font-mono">O(n log n)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          <strong className="text-slate-200">Space:</strong> O(n) — the merge step needs auxiliary storage
          (plus O(log n) recursion stack). In-place merge sort exists but is complex and rarely used.
        </p>
        <p>
          <strong className="text-slate-200">Stable:</strong> Yes — left-half elements with equal keys are
          preferred during merge.
        </p>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Divide array in half, sort recursively, merge sorted halves.',
          'Consistent O(n log n) time — best, average, and worst case.',
          'O(n) auxiliary space for merging.',
          'Stable — preferred when predictable performance and stability matter.',
        ]}
      />
    </LessonArticle>
  )
}
