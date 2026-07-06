import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function OperatorsAndExpressions() {
  return (
    <LessonArticle>
      <Definition term="Operators & Expressions">
        <p>
          An <strong className="text-white">expression</strong> is code that produces a value — like{' '}
          <code className="font-mono text-sm">2 + 3</code> or <code className="font-mono text-sm">age &gt;= 18</code>.
          <strong className="text-white"> Operators</strong> are the symbols that perform operations on values.
        </p>
      </Definition>

      <ContentStep number={1} title="Arithmetic and comparison">
        <Example
          title="Common operators"
          output={`7
2
1
32
True
False
True`}
        >{`print(3 + 4)      # 7
print(7 // 3)     # floor division → 2
print(7 % 3)      # remainder → 1
print(2 ** 5)     # power → 32

print(10 > 3)     # True
print(10 == 3)    # False
print(10 != 3)    # True`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Logical operators and truthiness">
        <Example
          title="and, or, not"
          output={`False
True
True`}
          caption="Empty strings, 0, None, and empty collections are falsy. Everything else is truthy."
        >{`age = 20
has_ticket = True

print(age < 18 and has_ticket)
print(age >= 18 and has_ticket)
print(not has_ticket)`}</Example>
        <Callout variant="beginner">
          <code className="font-mono text-sm">and</code> and <code className="font-mono text-sm">or</code> short-circuit: if the result is already decided, Python skips the rest.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          '// is floor division; % is modulo; ** is exponentiation.',
          '== checks equality; is checks identity (same object).',
          'and / or / not combine boolean conditions.',
          'Falsy values: None, False, 0, "", [], {}, set().',
        ]}
      />
    </LessonArticle>
  )
}
