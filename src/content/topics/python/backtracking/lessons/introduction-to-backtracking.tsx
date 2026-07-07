import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function IntroductionToBacktracking() {
  return (
    <LessonArticle>
      <Definition term="Backtracking">
        <p>
          <strong className="text-white">Backtracking</strong> is a systematic way to explore all (or some)
          combinations by building candidates step by step and <em>undoing</em> choices that lead nowhere. It is
          depth-first search on an implicit decision tree.
        </p>
        <p>
          The classic pattern: <strong className="text-white">choose</strong> →{' '}
          <strong className="text-white">explore</strong> → <strong className="text-white">unchoose</strong>{' '}
          (backtrack).
        </p>
      </Definition>

      <ContentStep number={1} title="The flow">
        <Flowchart
          title="Choose — explore — unchoose"
          chart={`
flowchart TB
  A["Start with empty path"]
  B["Make a choice"]
  C["Recurse deeper"]
  D{"Valid / promising?"}
  E["Record solution"]
  F["Undo choice — backtrack"]
  G["Try next option"]

  A --> B
  B --> C
  C --> D
  D -->|Yes| E
  E --> F
  D -->|Dead end| F
  F --> G
  G --> B
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Universal template">
        <Example
          title="Backtracking skeleton"
        >{`def backtrack(path, options):
    if is_complete(path):
        results.append(path[:])   # copy!
        return

    for choice in options:
        if not is_valid(choice, path):
            continue
        path.append(choice)      # choose
        backtrack(path, ...)     # explore
        path.pop()               # unchoose`}</Example>
        <Callout variant="info">
          Always append a <em>copy</em> of <code className="font-mono text-sm">path</code> to results (
          <code className="font-mono text-sm">path[:]</code>), not the list itself — the same list object is
          reused and mutated.
        </Callout>
      </ContentStep>

      <ContentStep number={3} title="When to use backtracking">
        <ul className="space-y-2 text-slate-300">
          <li>Generate all subsets, permutations, or combinations</li>
          <li>Constraint satisfaction — N-Queens, Sudoku</li>
          <li>Decision problems — &quot;does any subset sum to target?&quot;</li>
        </ul>
        <p>
          Subset sum is the next two lessons: one where each number is used at most once, and one where numbers
          can repeat.
        </p>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Backtracking = DFS on choices with undo (path.pop()).',
          'Template: choose → recurse → unchoose.',
          'Copy path when saving results — path[:] not path.',
          'Prune branches early when partial sums exceed target.',
        ]}
      />
    </LessonArticle>
  )
}
