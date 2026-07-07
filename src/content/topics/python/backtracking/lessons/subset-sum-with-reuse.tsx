import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function SubsetSumWithReuse() {
  return (
    <LessonArticle>
      <Definition term="Subset Sum — Unlimited Reuse">
        <p>
          Same problem, different rule: each element may be used <strong className="text-white">any number of
          times</strong> (including zero). This is also called the <strong className="text-white">unbounded
          knapsack</strong> or &quot;coin change&quot; style subset sum when you only care if a sum exists.
        </p>
        <p>
          The key difference: after <em>taking</em> nums[i], you stay at index <code className="font-mono text-sm">i</code>{' '}
          — you can pick the same value again.
        </p>
      </Definition>

      <ContentStep number={1} title="Decision tree difference">
        <Flowchart
          title="Take stays at same index"
          chart={`
flowchart TB
  A["nums = [2, 3], target = 7"]
  B["take 2 → stay at i=0"]
  C["take 2 again → sum 4"]
  D["take 3 → sum 7 found"]
  E["or skip and move i+1"]

  A --> B
  B --> C
  C --> D
  D --> E
        `}
        />
        <Callout variant="info">
          Solution for target 7: 2 + 2 + 3. With no-reuse rules, [2, 3] only sums to 5 — repetition is required.
        </Callout>
      </ContentStep>

      <ContentStep number={2} title="Exists? — with reuse">
        <Example
          title="subset_sum_exists_reuse"
          output={`True
False`}
        >{`def subset_sum_exists_reuse(nums, target):
    def backtrack(i, current):
        if current == target:
            return True
        if current > target or i == len(nums):
            return False
        # take nums[i] again — stay at i
        if backtrack(i, current + nums[i]):
            return True
        # skip nums[i] — move to i + 1
        return backtrack(i + 1, current)

    return backtrack(0, 0)

print(subset_sum_exists_reuse([2, 3, 5], 7))   # 2+2+3
print(subset_sum_exists_reuse([2, 4], 7))      # impossible`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Return one combination">
        <Example
          title="subset_sum_path_reuse"
          output={`[2, 2, 3]`}
        >{`def subset_sum_path_reuse(nums, target):
    path = []

    def backtrack(i, current):
        if current == target:
            return True
        if current > target or i == len(nums):
            return False
        # take
        path.append(nums[i])
        if backtrack(i, current + nums[i]):
            return True
        path.pop()
        # skip
        return backtrack(i + 1, current)

    return path if backtrack(0, 0) else []

print(subset_sum_path_reuse([2, 3], 7))`}</Example>
      </ContentStep>

      <ContentStep number={4} title="No reuse vs reuse — side by side">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-surface-600 bg-surface-800/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Rule</th>
                <th className="px-4 py-3 font-semibold">After take</th>
                <th className="px-4 py-3 font-semibold">After skip</th>
              </tr>
            </thead>
            <tbody className="text-slate-400">
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">At most once</td>
                <td className="px-4 py-3 font-mono">backtrack(i + 1, ...)</td>
                <td className="px-4 py-3 font-mono">backtrack(i + 1, ...)</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Unlimited reuse</td>
                <td className="px-4 py-3 font-mono">backtrack(i, ...)</td>
                <td className="px-4 py-3 font-mono">backtrack(i + 1, ...)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ContentStep>

      <ContentStep number={5} title="Sorting helps pruning">
        <Example
          title="Sort ascending, prune early"
        >{`def subset_sum_exists_reuse_sorted(nums, target):
    nums = sorted(nums)

    def backtrack(i, current):
        if current == target:
            return True
        if current > target:
            return False
        for j in range(i, len(nums)):
            if backtrack(j, current + nums[j]):
                return True
        return False

    return backtrack(0, 0)`}</Example>
        <p>
          Alternative style: loop from index <code className="font-mono text-sm">i</code> and always recurse on{' '}
          <code className="font-mono text-sm">j</code> (not j+1) to allow reuse. Sorting lets you break when{' '}
          <code className="font-mono text-sm">current + nums[j] &gt; target</code>.
        </p>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Unlimited reuse: after take, call backtrack(i, ...) — same index.',
          'Skip still advances: backtrack(i + 1, ...).',
          'Positive numbers → prune when sum exceeds target.',
          'Same 2^n-style exploration but deeper branches when values are small.',
        ]}
      />
    </LessonArticle>
  )
}
