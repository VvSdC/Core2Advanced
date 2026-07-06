import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function VariablesAndTypes() {
  return (
    <LessonArticle>
      <Definition term="Variables & Types">
        <p>
          A <strong className="text-white">variable</strong> is a name that points to a value in memory. When you
          write <code className="font-mono text-sm">age = 25</code>, Python creates the integer 25 and binds the
          name <code className="font-mono text-sm">age</code> to it.
        </p>
        <p>
          A <strong className="text-white">type</strong> tells Python what kind of value something is — integer,
          string, boolean, etc. Types determine what operations are allowed.
        </p>
      </Definition>

      <ContentStep number={1} title="Basic types you will use every day">
        <Example
          title="Core built-in types"
          output={`25 <class 'int'>
3.14 <class 'float'>
True <class 'bool'>
Ada <class 'str'>`}
        >{`age = 25
pi = 3.14
active = True
name = "Ada"

print(age, type(age))
print(pi, type(pi))
print(active, type(active))
print(name, type(name))`}</Example>
        <Callout variant="beginner">
          Python figures out the type from the value you assign. You do not declare{' '}
          <code className="font-mono text-sm">int age</code> like in C or Java — just assign and go.
        </Callout>
      </ContentStep>

      <ContentStep number={2} title="Naming rules and rebinding">
        <p>Variable names must start with a letter or underscore, then letters, numbers, or underscores. Names are case-sensitive: <code className="font-mono text-sm">Age</code> and <code className="font-mono text-sm">age</code> are different.</p>
        <Example
          title="Rebinding changes what a name points to"
          output={`30
25`}
          caption="Assigning again does not change the old object — it points the name at a new value."
        >{`age = 25
age = 30
print(age)

x = 10
y = x
x = 99
print(y)   # y still 10`}</Example>
      </ContentStep>

      <ContentStep number={3} title="In practice">
        <Example
          title="Checking and converting types"
          output={`str
25`}
        >{`score = "95"
# score + 5 would raise TypeError — can't add str and int
score = int(score)
print(score + 5)`}</Example>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Variables are names bound to objects in memory.',
          'Common types: int, float, bool, str.',
          'Use type() to inspect; int(), str(), float() to convert.',
          'Rebinding a variable does not affect other names pointing to the old object.',
        ]}
      />
    </LessonArticle>
  )
}
