import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  NotebookCell,
} from '../../../../../components/content'

export function MergingAndJoining() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        You have a table of students and a table of scores. Merging joins them on a shared key —
        like student ID — so each row lines up correctly.
      </Callout>

      <Definition term="merge, join, concat">
        <p>
          <strong className="font-mono text-xs">merge</strong> joins two DataFrames on columns (SQL-style).{' '}
          <strong className="font-mono text-xs">join</strong> joins on the index.{' '}
          <strong className="font-mono text-xs">concat</strong> stacks tables vertically (more rows)
          or horizontally (more columns) without matching keys.
        </p>
      </Definition>

      <LessonSection title="Join types (how=)">
        <Flowchart
          title="Which rows survive?"
          chart={`flowchart LR
  A[Left table] --> M[merge on key]
  B[Right table] --> M
  M --> I[inner — only matching keys]
  M --> L[left — all left + matches]
  M --> R[right — all right + matches]
  M --> O[outer — all keys from both]`}
        />
        <ContentStep number={1} title="inner">
          <p className="text-slate-300">Keep only rows where the key exists in both tables.</p>
        </ContentStep>
        <ContentStep number={2} title="left">
          <p className="text-slate-300">Keep every row from the left table; fill missing right-side values with NaN.</p>
        </ContentStep>
        <ContentStep number={3} title="right / outer">
          <p className="text-slate-300">
            <code className="font-mono text-xs">right</code> mirrors left.{' '}
            <code className="font-mono text-xs">outer</code> keeps all keys from both sides.
          </p>
        </ContentStep>
      </LessonSection>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Two small tables"
          code={`import pandas as pd

students = pd.DataFrame({
    "id": [1, 2, 3],
    "name": ["Ana", "Ben", "Cara"],
})
scores = pd.DataFrame({
    "id": [1, 2, 4],
    "score": [88, 92, 75],
})
print(students)
print()
print(scores)`}
          output={`   id  name
0   1   Ana
1   2   Ben
2   3  Cara

   id  score
0   1     88
1   2     92
2   4     75`}
        />

        <NotebookCell
          cell={2}
          title="merge — inner join (default)"
          code={`print(pd.merge(students, scores, on="id", how="inner"))`}
          output={`   id  name  score
0   1   Ana     88
1   2   Ben     92`}
        />

        <NotebookCell
          cell={3}
          title="left join — keep all students"
          code={`print(pd.merge(students, scores, on="id", how="left"))`}
          output={`   id  name  score
0   1   Ana   88.0
1   2   Ben   92.0
2   3  Cara    NaN`}
        >
          <p>Cara has no score row — Pandas fills with NaN instead of dropping her.</p>
        </NotebookCell>

        <NotebookCell
          cell={4}
          title="outer join — every id from both sides"
          code={`print(pd.merge(students, scores, on="id", how="outer"))`}
          output={`   id  name  score
0   1   Ana   88.0
1   2   Ben   92.0
2   3  Cara    NaN
3   4   NaN   75.0`}
        />

        <NotebookCell
          cell={5}
          title="concat — stack rows (same columns)"
          code={`batch_a = pd.DataFrame({"item": ["apple", "banana"], "qty": [3, 5]})
batch_b = pd.DataFrame({"item": ["cherry"], "qty": [2]})
print(pd.concat([batch_a, batch_b], ignore_index=True))`}
          output={`     item  qty
0   apple    3
1  banana    5
2  cherry    2`}
        />

        <NotebookCell
          cell={6}
          title="join on index (brief)"
          code={`left = students.set_index("id")
right = scores.set_index("id")
print(left.join(right, how="inner"))`}
          output={`     name  score
id
1     Ana     88
2     Ben     92`}
        />
      </div>

      <KeyTakeaways
        items={[
          'merge joins on column keys; join joins on index; concat stacks tables.',
          'how= inner / left / right / outer controls which rows you keep.',
          'Use left when your “main” table must not lose rows.',
        ]}
      />
    </LessonArticle>
  )
}
