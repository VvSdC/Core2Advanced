import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function GridMaxCoins() {
  return (
    <LessonArticle>
      <Definition term="Max Coins in a Grid">
        <p>
          Start at the top-left of a grid, move only <strong className="text-white">right</strong> or{' '}
          <strong className="text-white">down</strong>, reach the bottom-right. Each cell has coins (or 0). Obstacle
          cells block the path — you cannot step on them.
        </p>
      </Definition>

      <ContentStep number={1} title="State and recurrence">
        <Flowchart
          title="2D grid DP"
          chart={`
flowchart TB
  A["dp[r][c] = max coins to reach (r,c)"]
  B{"Cell is obstacle?"}
  C["dp[r][c] = 0 — unreachable"]
  D["dp[r][c] = grid[r][c] + max(top, left)"]
  E["Answer: dp[rows-1][cols-1]"]

  A --> B
  B -->|Yes| C
  B -->|No| D
  D --> E
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Implementation">
        <Example
          title="max_coins_path"
          output={`12`}
          caption="# = obstacle. Path: 1→3→2→1→5 = 12"
        >{`def max_coins_path(grid):
    if not grid or grid[0][0] == "#" or grid[-1][-1] == "#":
        return 0
    rows, cols = len(grid), len(grid[0])
    dp = [[0] * cols for _ in range(rows)]

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "#":
                dp[r][c] = 0
                continue
            coins = int(grid[r][c])
            from_top = dp[r - 1][c] if r > 0 else 0
            from_left = dp[r][c - 1] if c > 0 else 0
            if r == 0 and c == 0:
                dp[r][c] = coins
            else:
                dp[r][c] = coins + max(from_top, from_left)

    return dp[rows - 1][cols - 1]


grid = [
    ["1", "3", "1"],
    ["2", "#", "2"],
    ["1", "1", "5"],
]
print(max_coins_path(grid))`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Base cases and obstacles">
        <p>
          If the start or end is an obstacle, return 0 immediately. For obstacle cells, set{' '}
          <code className="font-mono text-sm">dp[r][c] = 0</code> so no path routes through them. First row/column
          only have one predecessor direction.
        </p>
        <Callout variant="insight">
          Time <strong className="text-white">O(rows × cols)</strong>, space <strong className="text-white">O(rows × cols)</strong>.
          Can compress to one row since each cell only needs the previous row and current row&apos;s left neighbor.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'dp[r][c] = max coins to reach cell (r, c).',
          'Come from top or left; add cell coins if not an obstacle.',
          'Obstacles → dp value 0 (unreachable).',
          'Answer at bottom-right corner.',
        ]}
      />
    </LessonArticle>
  )
}
