import {
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function FunctionMistakes() {
  return (
    <LessonArticle>
      <Definition term="Common Function Mistakes">
        <p>
          These traps appear in real code and interviews. Learn them here so closures, decorators, and OOP make
          more sense later.
        </p>
      </Definition>

      <ContentStep number={1} title="Mutable default arguments">
        <Example
          title="Shared list default"
          output={`[1]
[1, 2]`}
        >{`def add_item(item, bucket=[]):
    bucket.append(item)
    return bucket

print(add_item(1))
print(add_item(2))`}</Example>
        <Example title="Fix">{`def add_item(item, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Late-binding closures in loops">
        <Example
          title="All lambdas see final i"
          output={`[4, 4, 4, 4]`}
        >{`funcs = [lambda: i for i in range(4)]
print([f() for f in funcs])`}</Example>
        <Example
          title="Fix — capture i at creation"
          output={`[0, 1, 2, 3]`}
        >{`funcs = [lambda i=i: i for i in range(4)]
print([f() for f in funcs])`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Shadowing built-ins">
        <p>
          Do not name parameters <code className="font-mono text-sm">list</code>,{' '}
          <code className="font-mono text-sm">dict</code>, <code className="font-mono text-sm">id</code>, or{' '}
          <code className="font-mono text-sm">type</code> — you hide Python's built-ins.
        </p>
      </ContentStep>

      <ContentStep number={4} title="Ready for OOP">
        <p>
          You now understand functions deeply: parameters, scope, closures, decorators, generators. OOP methods are
          functions with <code className="font-mono text-sm">self</code>.{' '}
          <code className="font-mono text-sm">@property</code> and{' '}
          <code className="font-mono text-sm">@classmethod</code> are decorators. Move to Object Oriented Programming
          next with this foundation in place.
        </p>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Never use mutable defaults — use None and create inside.',
          'Loop closures capture variables by reference — bind with default args.',
          'Avoid shadowing built-in names.',
          'Functions before OOP — methods build on everything here.',
        ]}
      />
    </LessonArticle>
  )
}
