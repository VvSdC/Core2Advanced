import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  StepSequence,
} from '../../../../../components/content'

export function SpecialMethods() {
  return (
    <LessonArticle>
      <Definition term="Special Methods (Dunder Methods)">
        <p>
          Methods with double underscores like <code className="font-mono text-sm">__init__</code>,{' '}
          <code className="font-mono text-sm">__str__</code>, <code className="font-mono text-sm">__len__</code>{' '}
          are <strong className="text-white">special methods</strong>. Python calls them automatically when you use
          built-in syntax — <code className="font-mono text-sm">print(obj)</code>,{' '}
          <code className="font-mono text-sm">len(obj)</code>, <code className="font-mono text-sm">obj + other</code>.
        </p>
        <p>
          "Dunder" = <strong className="text-white">d</strong>ouble <strong className="text-white">under</strong>score.
          They let your objects feel like native Python types.
        </p>
      </Definition>

      <ContentStep number={1} title="Most useful dunder methods">
        <StepSequence
          steps={[
            {
              title: '__init__',
              description: 'Object creation and setup (already covered).',
            },
            {
              title: '__str__',
              description: 'Human-readable string for print() and str().',
            },
            {
              title: '__repr__',
              description: 'Developer-friendly string for debugging; should ideally be unambiguous.',
            },
            {
              title: '__len__',
              description: 'Called by len(obj).',
            },
            {
              title: '__eq__',
              description: 'Called by == comparison.',
            },
          ]}
        />
      </ContentStep>

      <ContentStep number={2} title="In practice">
        <Example
          title="Book with __str__ and __repr__"
          output={`Python Crash Course
Book('Python Crash Course', 400)`}
        >{`class Book:
    def __init__(self, title, pages):
        self.title = title
        self.pages = pages

    def __str__(self):
        return self.title

    def __repr__(self):
        return f"Book({self.title!r}, {self.pages})"

    def __len__(self):
        return self.pages

b = Book("Python Crash Course", 400)
print(b)
print(repr(b))
print(len(b))`}</Example>
      </ContentStep>

      <ContentStep number={3} title="__eq__ and object identity">
        <Example
          title="Equality vs identity"
          output={`True
False`}
          caption="Without __eq__, == uses identity (is) by default for custom classes."
        >{`class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

a = Point(1, 2)
b = Point(1, 2)
print(a == b)
print(a is b)`}</Example>
      </ContentStep>

      <Callout variant="beginner">
        Do not invent dunder names for your own methods — names like <code className="font-mono text-sm">__mine__</code>{' '}
        trigger name mangling. Stick to documented special methods.
      </Callout>

      <KeyTakeaways
        items={[
          'Dunder methods hook into Python syntax (print, len, ==).',
          '__str__ for users; __repr__ for developers.',
          'Define __eq__ when value equality matters.',
          '__init__ is the most common; learn others as needed.',
        ]}
      />
    </LessonArticle>
  )
}
