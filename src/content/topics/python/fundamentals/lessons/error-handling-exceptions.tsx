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

export function ErrorHandlingExceptions() {
  return (
    <LessonArticle>
      <Definition term="Error Handling & Exceptions">
        <p>
          When something goes wrong at runtime — dividing by zero, missing dict key, invalid conversion — Python
          raises an <strong className="text-white">exception</strong>. Without handling, your program crashes.{' '}
          <code className="font-mono text-sm">try/except</code> lets you catch errors and respond gracefully.
        </p>
      </Definition>

      <ContentStep number={1} title="The flow">
        <Flowchart
          title="try / except / else / finally"
          chart={`
flowchart TB
  T["try block"]
  E{"Exception raised?"}
  X["except block"]
  L["else block"]
  F["finally block"]

  T --> E
  E -->|Yes| X
  X --> F
  E -->|No| L
  L --> F
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Walking through the flow">
        <StepSequence
          steps={[
            {
              title: 'try',
              description: 'Run code that might fail.',
            },
            {
              title: 'except',
              description: 'Runs if a matching exception was raised. Catch specific types like ValueError, KeyError.',
            },
            {
              title: 'else',
              description: 'Runs only if try completed without any exception.',
            },
            {
              title: 'finally',
              description: 'Always runs — use for cleanup (close files, release resources).',
            },
          ]}
        />
        <Example
          title="Safe integer conversion"
          output={`Please enter a valid number`}
        >{`raw = "abc"

try:
    value = int(raw)
except ValueError:
    print("Please enter a valid number")`}</Example>
      </ContentStep>

      <ContentStep number={3} title="In practice">
        <Example
          title="else and finally"
          output={`Parsed: 42
Cleanup done`}
        >{`raw = "42"
try:
    value = int(raw)
except ValueError:
    print("Invalid")
else:
    print(f"Parsed: {value}")
finally:
    print("Cleanup done")`}</Example>
        <Example
          title="Raising your own exception"
        >{`def withdraw(balance, amount):
    if amount > balance:
        raise ValueError("Insufficient funds")
    return balance - amount`}</Example>
        <Callout variant="beginner">
          Avoid bare <code className="font-mono text-sm">except:</code> — it catches Ctrl+C and hides bugs. Catch{' '}
          <code className="font-mono text-sm">Exception</code> or specific types.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Exceptions stop normal flow unless caught with except.',
          'Catch specific exceptions; use else for success-only code.',
          'finally always runs — ideal for cleanup.',
          'raise creates an exception; raise ... from chains the cause.',
        ]}
      />
    </LessonArticle>
  )
}
