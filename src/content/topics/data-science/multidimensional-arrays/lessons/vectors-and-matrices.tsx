import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function VectorsAndMatrices() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="No scary math required">
        “Vector” and “matrix” sound advanced. Here they just mean:{' '}
        <strong className="text-white">a line of numbers</strong> and{' '}
        <strong className="text-white">a table of numbers</strong>. If you have used a spreadsheet,
        you already have the picture.
      </Callout>

      <Definition term="Vectors and matrices in NumPy">
        <p>
          A <strong className="text-white">1-D array</strong> is like a vector — a single line of
          numbers. A <strong className="text-white">2-D array</strong> is like a matrix — rows and
          columns. Higher dimensions are just more axes (e.g. a stack of matrices).
        </p>
      </Definition>

      <Callout variant="tip" title="Picture first">
        Think spreadsheet: one column of scores → vector. A whole table of numbers → matrix. NumPy
        stores both as <code className="font-mono text-sm text-data-science-400">ndarray</code>{' '}
        objects.
      </Callout>

      <LessonSection title="Dimensions you will meet">
        <ContentStep number={1} title="0-D — scalar">
          <p className="text-slate-300">A single number wrapped as an array (rare in beginners’ code).</p>
        </ContentStep>
        <ContentStep number={2} title="1-D — vector">
          <Example title="Shape (4,)">
{`[10, 20, 30, 40]`}
          </Example>
        </ContentStep>
        <ContentStep number={3} title="2-D — matrix">
          <Example title="Shape (2, 3) — 2 rows, 3 columns">
{`[[1, 2, 3],
 [4, 5, 6]]`}
          </Example>
        </ContentStep>
        <ContentStep number={4} title="3-D and up">
          <p className="text-slate-300">
            Color images often look like (height, width, channels). Videos add a time axis. Same
            NumPy ideas, more axes.
          </p>
        </ContentStep>
        <Flowchart
          title="From data to axes"
          chart={`flowchart TB
  A[List of numbers] --> B[1-D array / vector]
  C[Table of numbers] --> D[2-D array / matrix]
  E[Stack of tables] --> F[3-D+ array]`}
        />
      </LessonSection>

      <LessonSection title="Why this representation matters">
        <p className="text-slate-300">
          Shape tells NumPy how to broadcast, slice, and multiply. Once you see “rows × columns,”
          matrix math and image pixels become the same mental model.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          '1-D arrays ≈ vectors; 2-D arrays ≈ matrices.',
          'Shape (rows, cols) describes how values are laid out.',
          'Higher dimensions reuse the same array rules with more axes.',
        ]}
      />
    </LessonArticle>
  )
}
