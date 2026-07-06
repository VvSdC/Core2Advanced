import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../../components/content'

export function KadanesAlgorithm() {
  return (
    <LessonArticle>
      <Definition term="Kadane's Algorithm">
        <p>
          <strong className="text-white">Kadane&apos;s algorithm</strong> finds the maximum sum of any contiguous
          subarray in a single pass. It is the classic greedy / dynamic-programming solution to the maximum
          subarray problem and runs in O(n) time.
        </p>
      </Definition>

      <ContentStep number={1} title="The idea">
        <p>
          Walk through the array while tracking two values: the best sum ending at the current position, and the
          best sum seen anywhere so far. At each element, either extend the previous subarray or start fresh at
          the current element — whichever gives the larger ending-here sum.
        </p>
        <Example
          title="Kadane's algorithm"
          output={`6`}
          caption="Maximum subarray is [4, -1, 2, 1] → sum 6"
        >{`def max_subarray_sum(nums):
    current = best = nums[0]
    for x in nums[1:]:
        current = max(x, current + x)
        best = max(best, current)
    return best

print(max_subarray_sum([-2, 1, -3, 4, -1, 2, 1, -5, 4]))`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Greedy or DP?">
        <p>
          Both descriptions fit. The recurrence{' '}
          <code className="font-mono text-sm">current[i] = max(nums[i], current[i-1] + nums[i])</code> is dynamic
          programming with O(1) state. The decision to extend or restart at each step is greedy — always pick the
          locally better option, and that globally optimizes the answer.
        </p>
        <Example
          title="Return the subarray itself"
          output={`[4, -1, 2, 1]`}
        >{`def max_subarray(nums):
    current_sum = best_sum = nums[0]
    start = end = temp_start = 0

    for i in range(1, len(nums)):
        if nums[i] > current_sum + nums[i]:
            current_sum = nums[i]
            temp_start = i
        else:
            current_sum += nums[i]

        if current_sum > best_sum:
            best_sum = current_sum
            start = temp_start
            end = i

    return nums[start : end + 1]

print(max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Edge cases">
        <Callout variant="info">
          Clarify with the interviewer: if all numbers are negative, should you return the largest single element
          (standard Kadane) or 0 (some variants assume at least one element must be chosen)? The version above
          handles all-negative arrays by returning the least negative value.
        </Callout>
        <Example
          title="All negative numbers"
          output={`-1`}
        >{`def max_subarray_sum(nums):
    current = best = nums[0]
    for x in nums[1:]:
        current = max(x, current + x)
        best = max(best, current)
    return best

print(max_subarray_sum([-5, -2, -8, -1]))  # -1`}</Example>
      </ContentStep>

      <ContentStep number={4} title="Complexity">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-surface-600 bg-surface-800/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Measure</th>
                <th className="px-4 py-3 font-semibold">Complexity</th>
              </tr>
            </thead>
            <tbody className="text-slate-400">
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Time</td>
                <td className="px-4 py-3 font-mono">O(n)</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Space</td>
                <td className="px-4 py-3 font-mono">O(1)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          A brute-force check of every subarray takes O(n²) or O(n³) — Kadane reduces that to one linear scan.
        </p>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Track best sum ending here and best sum overall in one pass.',
          'At each element: extend previous subarray or start new at current.',
          'O(n) time, O(1) space — optimal for the maximum subarray problem.',
          'Clarify all-negative behavior in interviews; standard form returns max single element.',
        ]}
      />
    </LessonArticle>
  )
}
