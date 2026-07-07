import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function TwoDimensionalDp() {
  return (
    <LessonArticle>
      <Definition term="2D DP">
        <p>
          <strong className="text-white">2D DP</strong> uses a table <code className="font-mono text-sm">dp[i][j]</code>{' '}
          where two parameters define each subproblem — two indices, row/column position, or prefix lengths. Common
          when comparing two sequences or moving on a grid.
        </p>
      </Definition>

      <ContentStep number={1} title="When to use 2D">
        <Flowchart
          title="Typical 2D state"
          chart={`
flowchart TB
  G["Grid path — dp[row][col]"]
  S["Two strings — dp[i][j] prefix lengths"]
  K["Knapsack 2D — dp[item][capacity]"]

  G --> S
  S --> K
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Fill order">
        <p>
          Each cell depends on neighbors already computed — usually{' '}
          <strong className="text-white">top</strong> and <strong className="text-white">left</strong> for grid paths,
          or smaller <code className="font-mono text-sm">i</code> and <code className="font-mono text-sm">j</code> for
          string DP. Fill row by row, top to bottom, left to right.
        </p>
      </ContentStep>

      <ContentStep number={3} title="Mini example — LCS length">
        <Example
          title="lcs_length"
          output={`3`}
          caption="Longest common subsequence of abcde and ace"
        >{`def lcs_length(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]

print(lcs_length("abcde", "ace"))`}</Example>
        <Callout variant="insight">
          Grid path problems use the same table mechanics — only the recurrence changes (sum vs max, obstacle checks).
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          '2D state = two independent parameters per subproblem.',
          'Fill in dependency order — often increasing i and j.',
          'Grid paths: usually dp[r][c] from dp[r-1][c] and dp[r][c-1].',
          'Space can sometimes be rolled to 1D if only previous row is needed.',
        ]}
      />
    </LessonArticle>
  )
}
