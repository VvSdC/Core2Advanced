import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  StepSequence,
} from '../../../../../components/content'

export function IfElifElse() {
  return (
    <LessonArticle>
      <Definition term="if / elif / else">
        <p>
          Programs need to make decisions. The <code className="font-mono text-sm">if</code> statement runs code
          only when a condition is <strong className="text-white">truthy</strong>. Add{' '}
          <code className="font-mono text-sm">elif</code> for extra branches and{' '}
          <code className="font-mono text-sm">else</code> as the fallback when nothing matched.
        </p>
      </Definition>

      <ContentStep number={1} title="The flow">
        <Flowchart
          title="Decision flow"
          chart={`
flowchart TB
  A["Evaluate condition"]
  B{"Truthy?"}
  C["Run if block"]
  D{"elif condition?"}
  E["Run elif block"]
  F["Run else block"]
  G["Continue after"]

  A --> B
  B -->|Yes| C
  C --> G
  B -->|No| D
  D -->|Match| E
  E --> G
  D -->|No match| F
  F --> G
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Walking through the flow">
        <StepSequence
          steps={[
            {
              title: 'if',
              description: 'Python evaluates the condition. If truthy, runs the indented block and skips the rest.',
            },
            {
              title: 'elif',
              description: 'Checked only if earlier conditions failed. You can have zero or many elif branches.',
            },
            {
              title: 'else',
              description: 'Optional. Runs only when no if/elif condition was true.',
            },
          ]}
        />
        <Example
          title="Grade checker"
          output={`Pass with distinction`}
        >{`score = 85

if score >= 90:
    print("Grade: A")
elif score >= 75:
    print("Pass with distinction")
elif score >= 50:
    print("Pass")
else:
    print("Fail")`}</Example>
      </ContentStep>

      <ContentStep number={3} title="In practice">
        <Example
          title="Nested conditions"
          caption="Indentation defines which lines belong to which block — typically 4 spaces per level."
        >{`age = 20
has_id = True

if age >= 18:
    if has_id:
        print("Entry allowed")
    else:
        print("Need ID")
else:
    print("Too young")`}</Example>
        <Callout variant="beginner">
          Ternary one-liner: <code className="font-mono text-sm">status = "adult" if age &gt;= 18 else "minor"</code>
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'if runs a block when the condition is truthy.',
          'elif adds more branches; else is the final fallback.',
          'Indentation (4 spaces) defines block boundaries.',
          'Keep conditions readable — extract complex logic into variables or functions.',
        ]}
      />
    </LessonArticle>
  )
}
