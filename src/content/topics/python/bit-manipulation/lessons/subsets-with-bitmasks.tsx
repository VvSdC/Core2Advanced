import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function SubsetsWithBitmasks() {
  return (
    <LessonArticle>
      <Definition term="Subsets with Bitmasks">
        <p>
          An integer with <code className="font-mono text-sm">n</code> bits can encode every subset of{' '}
          <code className="font-mono text-sm">n</code> items: bit i is 1 if element i is included. Loop mask from{' '}
          <code className="font-mono text-sm">0</code> to <code className="font-mono text-sm">2ⁿ − 1</code> to
          enumerate all 2ⁿ subsets.
        </p>
      </Definition>

      <ContentStep number={1} title="Encode and decode">
        <Flowchart
          title="Mask ↔ subset"
          chart={`
flowchart TB
  A["mask bit i = 1 → include nums[i]"]
  B["mask 0b101 → subset {nums[0], nums[2]}"]
  C["Loop all masks 0 .. 2^n - 1"]

  A --> B
  B --> C
        `}
        />
        <Example
          title="all_subsets"
          output={`[[], ['a'], ['b'], ['a', 'b'], ['c'], ['a', 'c'], ['b', 'c'], ['a', 'b', 'c']]`}
        >{`def all_subsets(nums):
    n = len(nums)
    result = []
    for mask in range(1 << n):
        subset = [nums[i] for i in range(n) if mask & (1 << i)]
        result.append(subset)
    return result

print(all_subsets(["a", "b", "c"]))`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Subsets of fixed size k">
        <Example
          title="subsets_of_size_k"
          output={`[[1, 2], [1, 3], [2, 3]]`}
        >{`from itertools import combinations

def subsets_size_k(nums, k):
    return [list(c) for c in combinations(nums, k)]

# Bitmask version — only masks with exactly k bits set
def subsets_size_k_mask(nums, k):
    n = len(nums)
    result = []
    for mask in range(1 << n):
        if mask.bit_count() == k:
            result.append([nums[i] for i in range(n) if mask & (1 << i)])
    return result

print(subsets_size_k([1, 2, 3], 2))`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Iterate only set bits">
        <Example
          title="iterate_bits"
          caption="Efficient when mask is sparse — skip zero bits"
        >{`def bits_set(mask):
    while mask:
        low = mask & -mask
        i = (low.bit_length() - 1)
        yield i
        mask ^= low

for i in bits_set(0b101100):
    print(i)   # 2, 3, 5`}</Example>
        <Callout variant="insight">
          For <code className="font-mono text-sm">n ≤ 20</code>, full mask enumeration (2ⁿ) is often acceptable. For
          larger n, combine bitmasks with pruning (backtracking) or DP on subsets.{' '}
          <code className="font-mono text-sm">mask.bit_count()</code> filters by subset size in O(1) per mask on
          modern Python.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Mask bit i = 1 means include element i.',
          'Loop mask from 0 to (1 << n) - 1 for all subsets.',
          'mask.bit_count() == k filters subsets of size k.',
          'mask & -mask isolates each set bit when iterating.',
        ]}
      />
    </LessonArticle>
  )
}
