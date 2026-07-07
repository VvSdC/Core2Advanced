import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function IntroductionToDynamicProgramming() {
  return (
    <LessonArticle>
      <Definition term="Dynamic Programming (DP)">
        <p>
          <strong className="text-white">Dynamic programming</strong> solves problems by breaking them into overlapping
          subproblems, storing results so each subproblem is solved once. It applies when the problem has{' '}
          <strong className="text-white">optimal substructure</strong> (optimal solution built from optimal
          sub-solutions) and <strong className="text-white">overlapping subproblems</strong> (same subproblem
          appears many times).
        </p>
      </Definition>

      <ContentStep number={1} title="Brute force vs DP">
        <Flowchart
          title="From recursion to DP"
          chart={`
flowchart TB
  A["Recursive solution"]
  B{"Same subproblem twice?"}
  C["Add memoization — top-down DP"]
  D["Fill table bottom-up — tabulation"]
  E["Already efficient"]

  A --> B
  B -->|Yes| C
  C --> D
  B -->|No| E
        `}
        />
        <p>
          Naive recursion on Fibonacci revisits the same values exponentially. Memoization caches{' '}
          <code className="font-mono text-sm">fib(n)</code> after the first compute — O(n) instead of O(2<sup>n</sup>
          ).
        </p>
      </ContentStep>

      <ContentStep number={2} title="Two styles">
        <Callout variant="info">
          <strong className="text-white">Top-down (memoization)</strong> — recursive, cache results in a dict or
          array. Natural when state is sparse.
          <br />
          <strong className="text-white">Bottom-up (tabulation)</strong> — iterative, fill a table in dependency
          order. Often better space control and no recursion limit.
        </Callout>
      </ContentStep>

      <ContentStep number={3} title="The DP checklist">
        <ol className="list-decimal space-y-2 pl-5 text-gray-300">
          <li>
            <strong className="text-white">State</strong> — what parameters define a subproblem? (index, capacity,
            row/col, remaining budget)
          </li>
          <li>
            <strong className="text-white">Recurrence</strong> — how does state depend on smaller states?
          </li>
          <li>
            <strong className="text-white">Base case</strong> — smallest subproblems with known answers
          </li>
          <li>
            <strong className="text-white">Order</strong> — fill table so dependencies are ready
          </li>
          <li>
            <strong className="text-white">Answer</strong> — which cell holds the final result?
          </li>
        </ol>
      </ContentStep>

      <ContentStep number={4} title="What comes next">
        <p>
          Lessons progress by state dimension: <strong className="text-white">1D</strong> (knapsack),{' '}
          <strong className="text-white">2D</strong> (grid paths), <strong className="text-white">3D</strong> (extra
          constraint like limited obstacle breaks).
        </p>
      </ContentStep>

      <KeyTakeaways
        items={[
          'DP needs optimal substructure + overlapping subproblems.',
          'Memoization = top-down; tabulation = bottom-up.',
          'Define state, recurrence, base cases, fill order, and answer.',
          'Dimension of the table = number of independent parameters in state.',
        ]}
      />
    </LessonArticle>
  )
}
