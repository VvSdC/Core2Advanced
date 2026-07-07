import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function CountSmallerAfterSelf() {
  return (
    <LessonArticle>
      <Definition term="Count Smaller After Self">
        <p>
          For each index i, count how many values <em>to the right</em> are smaller than{' '}
          <code className="font-mono text-sm">nums[i]</code>. Same BIT machinery as inversion count — but scan{' '}
          <strong className="text-white">right to left</strong> so the tree holds values already seen on the right.
        </p>
      </Definition>

      <ContentStep number={1} title="Right-to-left scan">
        <Flowchart
          title="Query before update"
          chart={`
flowchart TB
  A["Start at last index"]
  B["answer[i] = count of ranks < rank(nums[i]) in BIT"]
  C["update(rank(nums[i]), 1)"]
  D["Move left"]

  A --> B
  B --> C
  C --> D
  D --> B
        `}
        />
        <p>
          <code className="font-mono text-sm">prefix_sum(rank - 1)</code> counts how many stored ranks are strictly
          smaller than the current value — exactly the answer for position i.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Implementation">
        <Example
          title="count_smaller"
          output={`[2, 1, 1, 0]`}
          caption="[5, 2, 6, 1] — smaller to the right of each element"
        >{`def rank_map(nums):
    sorted_unique = sorted(set(nums))
    return {v: i + 1 for i, v in enumerate(sorted_unique)}


class FenwickTree:
    def __init__(self, n):
        self.n = n
        self.tree = [0] * (n + 1)

    def update(self, i, delta):
        while i <= self.n:
            self.tree[i] += delta
            i += i & -i

    def prefix_sum(self, i):
        total = 0
        while i > 0:
            total += self.tree[i]
            i -= i & -i
        return total


def count_smaller(nums):
    ranks = rank_map(nums)
    ft = FenwickTree(len(ranks))
    ans = [0] * len(nums)
    for i in range(len(nums) - 1, -1, -1):
        r = ranks[nums[i]]
        ans[i] = ft.prefix_sum(r - 1)
        ft.update(r, 1)
    return ans

print(count_smaller([5, 2, 6, 1]))`}</Example>
        <p>
          For 5: right side has 2, 6, 1 → two smaller (2, 1). For 2: 6, 1 → one smaller. For 6: 1 → one smaller. For
          1: none → 0.
        </p>
      </ContentStep>

      <ContentStep number={3} title="Same pattern, different direction">
        <Callout variant="insight">
          Inversion count looks <em>left</em> and asks &quot;how many greater?&quot; This problem looks{' '}
          <em>right</em> and asks &quot;how many smaller?&quot; Both are frequency BITs with coordinate compression —
          only scan direction and the prefix query change.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Scan right to left; BIT holds values already on the right.',
          'answer[i] = prefix_sum(rank - 1).',
          'Then update(rank, 1).',
          'Same rank compression as inversion count.',
        ]}
      />
    </LessonArticle>
  )
}
