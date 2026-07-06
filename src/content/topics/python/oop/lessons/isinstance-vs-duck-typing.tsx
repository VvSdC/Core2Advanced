import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function IsinstanceVsDuckTyping() {
  return (
    <LessonArticle>
      <Definition term="isinstance vs Duck Typing">
        <p>
          Python favors <strong className="text-white">duck typing</strong> — if it behaves correctly, use it.
          <code className="font-mono text-sm">isinstance()</code> checks the type hierarchy when you need explicit
          type branching.
        </p>
      </Definition>

      <ContentStep number={1} title="Duck typing — Pythonic default">
        <Example
          title="No type check needed"
        >{`def area(shape):
    return shape.area()   # needs .area(), not a specific class

class Circle:
    def __init__(self, r): self.r = r
    def area(self): return 3.14 * self.r ** 2

class Square:
    def __init__(self, s): self.s = s
    def area(self): return self.s ** 2

for s in [Circle(2), Square(3)]:
    print(area(s))`}</Example>
      </ContentStep>

      <ContentStep number={2} title="isinstance for branching">
        <Example
          title="When types genuinely differ"
        >{`def serialize(obj):
    if isinstance(obj, str):
        return f'"{obj}"'
    if isinstance(obj, (int, float)):
        return str(obj)
    if isinstance(obj, list):
        return "[" + ", ".join(serialize(x) for x in obj) + "]"
    raise TypeError(type(obj))`}</Example>
        <p>Use for dispatch, validation, or handling multiple input types — not to replace polymorphism.</p>
      </ContentStep>

      <ContentStep number={3} title="isinstance vs type()">
        <Callout variant="insight">
          <code className="font-mono text-sm">isinstance(obj, Dog)</code> returns True for Dog subclasses.{' '}
          <code className="font-mono text-sm">type(obj) == Dog</code> is exact match only — ignores inheritance.
          Prefer isinstance.
        </Callout>
      </ContentStep>

      <ContentStep number={4} title="ABC + isinstance">
        <p>
          Abstract base classes (next lesson) let you write{' '}
          <code className="font-mono text-sm">isinstance(obj, Drawable)</code> for structural checks via{' '}
          <code className="font-mono text-sm">@abc.register</code> — bridging duck typing and explicit contracts.
        </p>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Duck typing: depend on behavior (methods), not class names.',
          'isinstance checks inheritance — use for type dispatch.',
          'Prefer isinstance over type() == for subclass support.',
          'Over-checking types fights Python idioms — use sparingly.',
        ]}
      />
    </LessonArticle>
  )
}
