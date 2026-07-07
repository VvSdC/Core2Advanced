import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function OneDimensionalDp() {
  return (
    <LessonArticle>
      <Definition term="1D DP">
        <p>
          <strong className="text-white">1D DP</strong> stores answers in a single array (or dict) indexed by one
          parameter — often a position, capacity, or remaining amount. The recurrence reads from earlier or nearby
          indices in the same array.
        </p>
      </Definition>

      <ContentStep number={1} title="Template">
        <Flowchart
          title="1D tabulation"
          chart={`
flowchart TB
  A["Initialize dp[0..n] with base cases"]
  B["For i from 1 to n"]
  C["dp[i] = combine(dp[i-1], dp[i-2], ...)"]
  D["Return dp[n]"]

  A --> B
  B --> C
  C --> B
  B --> D
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Example — climbing stairs">
        <Example
          title="climb_stairs"
          output={`3
5`}
          caption="n steps, can take 1 or 2 at a time — ways to reach top"
        >{`def climb_stairs(n):
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1], dp[2] = 1, 2
    for i in range(3, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]

print(climb_stairs(3))   # 1+2, 2+1, 2 steps = 3
print(climb_stairs(5))`}</Example>
        <p>
          State: <code className="font-mono text-sm">dp[i]</code> = ways to reach step i. Recurrence: come from i−1
          or i−2.
        </p>
      </ContentStep>

      <ContentStep number={3} title="Top-down version">
        <Example
          title="climb_stairs_memo"
        >{`def climb_stairs_memo(n, memo=None):
    if memo is None:
        memo = {}
    if n <= 2:
        return n
    if n not in memo:
        memo[n] = climb_stairs_memo(n - 1, memo) + climb_stairs_memo(n - 2, memo)
    return memo[n]`}</Example>
      </ContentStep>

      <ContentStep number={4} title="Space optimization">
        <Callout variant="insight">
          When <code className="font-mono text-sm">dp[i]</code> only needs the last one or two values, roll the array
          into a few variables — O(1) space instead of O(n). Knapsack uses a similar 1D roll on capacity.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          '1D DP: one array indexed by a single parameter.',
          'Fill left-to-right (or right-to-left) so dependencies exist.',
          'Memoization is the recursive mirror of the same recurrence.',
          'Often compress to O(1) space when only recent cells matter.',
        ]}
      />
    </LessonArticle>
  )
}
