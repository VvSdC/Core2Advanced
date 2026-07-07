import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function SubsetSumNoReuse() {
  return (
    <LessonArticle>
      <Definition term="Subset Sum — Each Element Once">
        <p>
          Given an array of positive integers and a target, find whether <em>some subset</em> sums to the target
          when each element can be used <strong className="text-white">at most once</strong>.
        </p>
        <p>
          At index <code className="font-mono text-sm">i</code>, you have two branches: <strong className="text-white">skip</strong>{' '}
          nums[i] or <strong className="text-white">take</strong> nums[i] and move to i + 1.
        </p>
      </Definition>

      <ContentStep number={1} title="Decision tree">
        <Flowchart
          title="Include or exclude each element"
          chart={`
flowchart TB
  A["nums = [2, 3, 5], target = 8"]
  B["At index 0: skip 2 or take 2"]
  C["At index 1: skip 3 or take 3"]
  D["At index 2: skip 5 or take 5"]
  E["sum == 8 → found 2+3+5"]

  A --> B
  B --> C
  C --> D
  D --> E
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Exists? — decision version">
        <Example
          title="subset_sum_exists"
          output={`True
False`}
        >{`def subset_sum_exists(nums, target):
    def backtrack(i, current):
        if current == target:
            return True
        if current > target or i == len(nums):
            return False
        # take nums[i]
        if backtrack(i + 1, current + nums[i]):
            return True
        # skip nums[i]
        return backtrack(i + 1, current)

    return backtrack(0, 0)

print(subset_sum_exists([2, 3, 5, 7], 8))    # 3 + 5
print(subset_sum_exists([2, 3, 5], 9))       # impossible`}</Example>
        <p>
          Pruning: if <code className="font-mono text-sm">current &gt; target</code>, stop — all numbers are
          positive so the sum cannot decrease.
        </p>
      </ContentStep>

      <ContentStep number={3} title="Return all subsets that sum to target">
        <Example
          title="subset_sum_all"
          output={`[[2, 3, 3], [3, 5]]`}
          caption="Unique subsets summing to 8"
        >{`def subset_sum_all(nums, target):
    results = []

    def backtrack(i, current, path):
        if current == target:
            results.append(path[:])
            return
        if current > target or i == len(nums):
            return
        # take
        path.append(nums[i])
        backtrack(i + 1, current + nums[i], path)
        path.pop()
        # skip
        backtrack(i + 1, current, path)

    backtrack(0, 0, [])
    return results

print(subset_sum_all([2, 3, 5], 8))`}</Example>
      </ContentStep>

      <ContentStep number={4} title="Complexity">
        <Callout variant="insight">
          Worst case explores 2<sup>n</sup> subsets — O(2<sup>n</sup>) time. Space is O(n) for recursion depth
          plus path storage. Sorting + pruning helps in practice; dynamic programming is better when you need
          repeated queries on the same array.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Two choices per index: take (i+1) or skip (i+1).',
          'Prune when current sum exceeds target (positive nums).',
          'Use path[:] when recording complete subsets.',
          'O(2^n) time — each element used at most once.',
        ]}
      />
    </LessonArticle>
  )
}
