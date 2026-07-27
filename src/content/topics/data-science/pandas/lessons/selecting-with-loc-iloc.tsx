import {
  Callout,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function SelectingWithLocIloc() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        Spreadsheets let you click a cell by name (column B, row 5) or by position (second column,
        third row). Pandas gives you two tools: <strong className="text-white">loc</strong> for labels
        and <strong className="text-white">iloc</strong> for integer positions.
      </Callout>

      <Definition term="loc vs iloc">
        <p>
          <strong className="text-white">loc</strong> uses row and column <em>labels</em> — names like{' '}
          <code className="font-mono text-xs">"Alice"</code> or <code className="font-mono text-xs">"score"</code>.
          {' '}<strong className="text-white">iloc</strong> uses <em>positions</em> — 0, 1, 2… like
          list indexes. Mixing them up is a common beginner mistake, so keep the words label vs position
          in mind.
        </p>
      </Definition>

      <LessonSection title="Sample table">
        <Example
          title="Our working DataFrame"
          output={`       name  age  score city
0     Alice   28     88  NYC
1       Bob   34     92   LA
2     Carol   22     79  NYC
3      Dave   29     85  NYC
4       Eve   31     90   LA`}
        >{`import pandas as pd

df = pd.read_csv("data/students.csv")
print(df)`}</Example>
      </LessonSection>

      <LessonSection title="Selecting columns">
        <Example
          title="One column — returns a Series"
          output={`0    88
1    92
2    79
3    85
4    90
Name: score, dtype: int64`}
        >{`print(df["score"])          # bracket syntax
print(df.loc[:, "score"])   # same, via loc`}</Example>

        <Example
          title="Multiple columns — returns a DataFrame"
          output={`    name  score
0  Alice     88
1    Bob     92
2  Carol     79
3   Dave     85
4    Eve     90`}
        >{`print(df[["name", "score"]])
print(df.loc[:, ["name", "score"]])`}</Example>

        <Example
          title="Column by position with iloc"
          output={`0    88
1    92
2    79
3    85
4    90
Name: score, dtype: int64`}
        >{`print(df.iloc[:, 2])   # third column (index 2)`}</Example>
      </LessonSection>

      <LessonSection title="Selecting rows">
        <Example
          title="Single row by label (loc)"
          output={`name     Alice
age         28
score       88
city       NYC
Name: 0, dtype: object`}
        >{`print(df.loc[0])   # row with index label 0`}</Example>

        <Example
          title="Single row by position (iloc)"
          output={`name     Bob
age         34
score       92
city        LA
Name: 1, dtype: object`}
        >{`print(df.iloc[1])   # second row (position 1)`}</Example>

        <Example
          title="Row slice — loc includes both ends"
          output={`    name  age  score city
1    Bob   34     92   LA
2  Carol   22     79  NYC
3   Dave   29     85  NYC`}
        >{`print(df.loc[1:3])`}</Example>

        <Example
          title="Row slice — iloc excludes the stop index"
          output={`    name  age  score city
1    Bob   34     92   LA
2  Carol   22     79  NYC`}
        >{`print(df.iloc[1:3])   # rows at positions 1 and 2 only`}</Example>
      </LessonSection>

      <LessonSection title="Rows and columns together">
        <Example
          title="loc[row labels, column labels]"
          output={`    name  score
0  Alice     88
2  Carol     79
4    Eve     90`}
        >{`print(df.loc[[0, 2, 4], ["name", "score"]])`}</Example>

        <Example
          title="iloc[row positions, column positions]"
          output={`  name  city
0  Alice   NYC
2  Carol   NYC`}
        >{`print(df.iloc[[0, 2], [0, 3]])`}</Example>
      </LessonSection>

      <Callout variant="tip">
        Rule of thumb: if you know column <em>names</em>, use{' '}
        <code className="font-mono text-xs">loc</code> or brackets. If you only know{' '}
        <em>positions</em>, use <code className="font-mono text-xs">iloc</code>.
      </Callout>

      <KeyTakeaways
        items={[
          'loc selects by labels; iloc selects by integer position (0-based).',
          'df["col"] or df.loc[:, "col"] for one column; double brackets for several.',
          'Slices differ: loc[1:3] includes row 3; iloc[1:3] stops before position 3.',
        ]}
      />
    </LessonArticle>
  )
}
