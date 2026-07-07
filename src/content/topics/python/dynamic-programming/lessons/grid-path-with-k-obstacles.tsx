import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function GridPathWithKObstacles() {
  return (
    <LessonArticle>
      <Definition term="Grid Path with K Obstacle Breaks">
        <p>
          Same grid as the 2D lesson — start top-left, end bottom-right, move only right or down — but you may step on
          at most <strong className="text-white">k</strong> obstacle cells (<code className="font-mono text-sm">#</code>
          ). Obstacles yield 0 coins.
        </p>
        <p>
          State: <code className="font-mono text-sm">dp[r][c][b]</code> = maximum coins to reach{' '}
          <code className="font-mono text-sm">(r, c)</code> having used exactly <code className="font-mono text-sm">b</code>{' '}
          obstacle breaks.
        </p>
      </Definition>

      <ContentStep number={1} title="Recurrence">
        <Flowchart
          title="3D transition"
          chart={`
flowchart TB
  A["dp[r][c][b] = max coins at (r,c) with b breaks used"]
  B{"Current cell is #?"}
  C["Need b >= 1; predecessors use b-1"]
  D["Predecessors use same b"]
  E["dp[r][c][b] = cell coins + max(predecessors)"]

  A --> B
  B -->|Yes| C
  B -->|No| D
  C --> E
  D --> E
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Implementation">
        <Example
          title="max_coins_k_breaks"
          output={`12
120`}
          caption="k=0 on first grid = 12 (same as 2D). k=1 on second grid unlocks a better route through #"
        >{`def max_coins_k_breaks(grid, k):
    rows, cols = len(grid), len(grid[0])
    INF = float("-inf")
    dp = [[[INF] * (k + 1) for _ in range(cols)] for _ in range(rows)]

    def coins(r, c):
        return 0 if grid[r][c] == "#" else int(grid[r][c])

    def is_obs(r, c):
        return grid[r][c] == "#"

    for r in range(rows):
        for c in range(cols):
            for b in range(k + 1):
                if is_obs(r, c) and b == 0:
                    continue
                best_prev = INF
                if r == 0 and c == 0:
                    best_prev = 0
                else:
                    if r > 0:
                        prev_b = b - 1 if is_obs(r, c) else b
                        if prev_b >= 0:
                            best_prev = max(best_prev, dp[r - 1][c][prev_b])
                    if c > 0:
                        prev_b = b - 1 if is_obs(r, c) else b
                        if prev_b >= 0:
                            best_prev = max(best_prev, dp[r][c - 1][prev_b])
                if best_prev != INF:
                    dp[r][c][b] = best_prev + coins(r, c)

    end = dp[rows - 1][cols - 1]
    return max(x for x in end if x != INF)


grid = [
    ["1", "3", "1"],
    ["2", "#", "2"],
    ["1", "1", "5"],
]
# k=0: must go around # — same as 2D lesson
print(max_coins_k_breaks(grid, 0))

grid2 = [
    ["1", "1", "1"],
    ["10", "#", "10"],
    ["1", "1", "100"],
]
# k=0 best: around # → 113. k=1: through # → 120
print(max_coins_k_breaks(grid2, 1))`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Reading the state">
        <p>
          The third index <code className="font-mono text-sm">b</code> is the extra information 2D DP could not store:
          how many obstacle breaks are already spent. Without it, two paths to the same cell with different breaks
          left would collide incorrectly.
        </p>
        <Callout variant="insight">
          Time <strong className="text-white">O(rows × cols × k)</strong>, space{' '}
          <strong className="text-white">O(rows × cols × k)</strong>. Final answer:{' '}
          <code className="font-mono text-sm">max(dp[rows-1][cols-1][b])</code> for all valid{' '}
          <code className="font-mono text-sm">b</code>.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'dp[r][c][b] = max coins at (r,c) with b breaks used.',
          'Entering #: increment break count — predecessors use b-1.',
          'Normal cell: predecessors use the same b.',
          '3D state tracks a limited resource alongside position.',
        ]}
      />
    </LessonArticle>
  )
}
