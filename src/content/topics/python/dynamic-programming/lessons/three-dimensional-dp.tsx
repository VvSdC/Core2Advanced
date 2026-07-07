import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function ThreeDimensionalDp() {
  return (
    <LessonArticle>
      <Definition term="3D DP">
        <p>
          <strong className="text-white">3D DP</strong> adds a third parameter to the state — a budget, remaining
          moves, count of items used, or how many special actions remain. The table becomes{' '}
          <code className="font-mono text-sm">dp[a][b][c]</code> and each dimension must be iterated in a valid
          order.
        </p>
      </Definition>

      <ContentStep number={1} title="When you need a third dimension">
        <Flowchart
          title="Third parameter examples"
          chart={`
flowchart TB
  A["Grid + limited obstacle breaks — dp[r][c][k]"]
  B["Knapsack + item count limit — dp[i][w][t]"]
  C["Three-sequence alignment — dp[i][j][k]"]

  A --> B
  B --> C
        `}
        />
        <p>
          If the 2D grid problem lets you pass through at most <em>k</em> obstacles, the remaining breaks become part
          of the state — you cannot compress them away.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Complexity tradeoff">
        <Callout variant="insight">
          Adding a dimension multiplies table size. If the grid is R×C and k goes up to K, space is{' '}
          <strong className="text-white">O(R × C × K)</strong>. Only add a dimension when the extra constraint is
          essential — not every problem needs 3D.
        </Callout>
      </ContentStep>

      <ContentStep number={3} title="Fill order">
        <p>
          Extend the 2D grid loop: for each cell <code className="font-mono text-sm">(r, c)</code>, loop{' '}
          <code className="font-mono text-sm">k</code> from 0 to K. Transitions come from the same cell with fewer
          breaks used, or from top/left with appropriate k.
        </p>
      </ContentStep>

      <KeyTakeaways
        items={[
          '3D DP = two spatial/index params + one resource or budget param.',
          'Table size grows multiplicatively — use only when needed.',
          'Next lesson: grid path with at most k obstacle cells — dp[r][c][k].',
          'Same DP checklist: state, recurrence, bases, order, answer.',
        ]}
      />
    </LessonArticle>
  )
}
