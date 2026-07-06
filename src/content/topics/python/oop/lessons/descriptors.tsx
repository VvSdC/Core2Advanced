import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function Descriptors() {
  return (
    <LessonArticle>
      <Definition term="Descriptors">
        <p>
          A <strong className="text-white">descriptor</strong> is an object defining{' '}
          <code className="font-mono text-sm">__get__</code>, <code className="font-mono text-sm">__set__</code>, or{' '}
          <code className="font-mono text-sm">__delete__</code>. Python uses descriptors for{' '}
          <code className="font-mono text-sm">@property</code>, <code className="font-mono text-sm">@classmethod</code>, and
          attribute access on instances.
        </p>
      </Definition>

      <ContentStep number={1} title="How attribute lookup uses descriptors">
        <p>
          On <code className="font-mono text-sm">obj.x</code>, Python checks the type's MRO for a descriptor on{' '}
          <code className="font-mono text-sm">x</code>. If found, calls <code className="font-mono text-sm">__get__(self, obj, type)</code>.
          Otherwise falls back to <code className="font-mono text-sm">obj.__dict__['x']</code>.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Custom descriptor">
        <Example
          title="Validated attribute"
        >{`class Positive:
    def __init__(self):
        self.name = None

    def __set_name__(self, owner, name):
        self.name = name

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return obj.__dict__.get(self.name)

    def __set__(self, obj, value):
        if value <= 0:
            raise ValueError("must be positive")
        obj.__dict__[self.name] = value

class Account:
    balance = Positive()

    def __init__(self, balance):
        self.balance = balance`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Data vs non-data descriptors">
        <Callout variant="insight">
          Descriptors with <code className="font-mono text-sm">__set__</code> (data descriptors) take priority over
          instance <code className="font-mono text-sm">__dict__</code>. Non-data descriptors (only{' '}
          <code className="font-mono text-sm">__get__</code>, like classmethod) lose to instance dict. This explains
          some subtle attribute shadowing behavior in interviews.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Descriptors implement __get__, __set__, or __delete__.',
          '@property, classmethod, staticmethod are built on descriptors.',
          'Data descriptors override instance __dict__ entries.',
          'Advanced topic — know the concept; @property covers most cases.',
        ]}
      />
    </LessonArticle>
  )
}
