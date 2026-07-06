import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  StepSequence,
} from '../../../../../components/content'

export function ClassAndStaticMethods() {
  return (
    <LessonArticle>
      <Definition term="Class & Static Methods">
        <p>
          Regular methods take <code className="font-mono text-sm">self</code> — one specific instance. Sometimes you
          need methods that belong to the <strong className="text-white">class itself</strong> or need no instance at
          all. That is where <code className="font-mono text-sm">@classmethod</code> and{' '}
          <code className="font-mono text-sm">@staticmethod</code> come in.
        </p>
      </Definition>

      <ContentStep number={1} title="Three types compared">
        <StepSequence
          steps={[
            {
              title: 'Instance method — def method(self, ...)',
              description: 'Works on one object. Most common. self is the instance.',
            },
            {
              title: 'Class method — @classmethod, def method(cls, ...)',
              description: 'Receives the class as cls. Used for alternative constructors and class-level logic.',
            },
            {
              title: 'Static method — @staticmethod, def method(...)',
              description: 'No self or cls. Just a function namespaced inside the class for organization.',
            },
          ]}
        />
      </ContentStep>

      <ContentStep number={2} title="@classmethod — alternative constructors">
        <Example
          title="from_string factory"
          output={`Ada is 30`}
        >{`class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    @classmethod
    def from_string(cls, text):
        name, age = text.split("-")
        return cls(name, int(age))

ada = Person.from_string("Ada-30")
print(f"{ada.name} is {ada.age}")`}</Example>
        <p>
          <code className="font-mono text-sm">from_string</code> returns{' '}
          <code className="font-mono text-sm">cls(...)</code> — if you subclass Person, the subclass version is
          used automatically.
        </p>
      </ContentStep>

      <ContentStep number={3} title="@staticmethod — utility in the class namespace">
        <Example
          title="Validation helper"
          output={`True
False`}
        >{`class User:
    def __init__(self, email):
        self.email = email

    @staticmethod
    def is_valid_email(email):
        return "@" in email and "." in email.split("@")[-1]

print(User.is_valid_email("ada@example.com"))
print(User.is_valid_email("bad-email"))`}</Example>
        <Callout variant="beginner">
          If a static method does not need cls or self, you could put it outside the class as a plain function.
          Putting it inside documents that it belongs to User conceptually.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Instance methods use self — one object.',
          '@classmethod uses cls — alternative constructors, class logic.',
          '@staticmethod — no instance or class; utility grouped with class.',
          'Reach for instance methods first; add others when needed.',
        ]}
      />
    </LessonArticle>
  )
}
