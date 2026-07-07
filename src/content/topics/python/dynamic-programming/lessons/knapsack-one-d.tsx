import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function KnapsackOneD() {
  return (
    <LessonArticle>
      <Definition term="0/1 Knapsack — 1D DP">
        <p>
          Given item weights and values and a knapsack capacity, pick items (each at most once) to maximize total value
          without exceeding capacity. The classic <strong className="text-white">0/1 knapsack</strong> uses state{' '}
          <code className="font-mono text-sm">dp[w]</code> = best value achievable with capacity w.
        </p>
      </Definition>

      <ContentStep number={1} title="Recurrence">
        <Flowchart
          title="For each item, update capacities right-to-left"
          chart={`
flowchart TB
  A["dp[w] = max value with capacity w, initially 0"]
  B["For each item weight, value"]
  C["For w from capacity down to weight"]
  D["dp[w] = max(dp[w], dp[w-weight] + value)"]
  E["Return dp[capacity]"]

  A --> B
  B --> C
  C --> D
  D --> C
  C --> B
  B --> E
        `}
        />
        <p>
          Loop <strong className="text-white">backwards</strong> on w so each item is used at most once — forward
          would allow reusing the same item in one pass.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Implementation">
        <Example
          title="knapsack_01"
          output={`28`}
          caption="Capacity 7, items (w,v): (1,6), (2,10), (3,12) — take all three"
        >{`def knapsack(weights, values, capacity):
    dp = [0] * (capacity + 1)
    for wt, val in zip(weights, values):
        for w in range(capacity, wt - 1, -1):
            dp[w] = max(dp[w], dp[w - wt] + val)
    return dp[capacity]


weights = [1, 2, 3]
values = [6, 10, 12]
print(knapsack(weights, values, 7))`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Walk-through">
        <p>
          After item (1,6): <code className="font-mono text-sm">dp[1]=6</code>. After (2,10):{' '}
          <code className="font-mono text-sm">dp[2]=10</code>, <code className="font-mono text-sm">dp[3]=16</code>{' '}
          (1+2). After (3,12): <code className="font-mono text-sm">dp[6]=28</code> (1+2+3 fits in capacity 7). Final{' '}
          <code className="font-mono text-sm">dp[7]=28</code>.
        </p>
      </ContentStep>

      <ContentStep number={4} title="Complexity">
        <Callout variant="insight">
          Time <strong className="text-white">O(n × capacity)</strong>, space <strong className="text-white">O(capacity)</strong>{' '}
          with the 1D roll. A full 2D table <code className="font-mono text-sm">dp[i][w]</code> is easier to derive
          but uses O(n × capacity) space.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'dp[w] = max value with exactly capacity w (or at most w).',
          'Process each item once; iterate w backwards.',
          '0/1 constraint: backward loop prevents reusing an item.',
          'O(n × W) pseudo-polynomial in capacity W.',
        ]}
      />
    </LessonArticle>
  )
}
