import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function ClassDecorators() {
  return (
    <LessonArticle>
      <Definition term="Class Decorators">
        <p>
          Decorators work on <strong className="text-white">classes</strong> too — wrapping or modifying class
          creation. You will see this with <code className="font-mono text-sm">@dataclass</code>, framework
          registration, and singleton patterns.
        </p>
      </Definition>

      <ContentStep number={1} title="Decorating a class">
        <Example
          title="Add a class attribute via decorator"
        >{`def add_repr(cls):
    def __repr__(self):
        attrs = ", ".join(f"{k}={v!r}" for k, v in self.__dict__.items())
        return f"{cls.__name__}({attrs})"
    cls.__repr__ = __repr__
    return cls

@add_repr
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

p = Point(1, 2)
print(p)`}</Example>
        <p><code className="font-mono text-sm">@add_repr</code> above class means <code className="font-mono text-sm">Point = add_repr(Point)</code>.</p>
      </ContentStep>

      <ContentStep number={2} title="Singleton via class decorator">
        <Example
          title="One instance only"
        >{`def singleton(cls):
    instances = {}
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return get_instance

@singleton
class Database:
    pass

a = Database()
b = Database()
print(a is b)   # True`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Relation to function decorators">
        <Callout variant="insight">
          Same mechanics: decorator receives callable (class or function), returns replacement. Class decorators
          often run at import time — side effects affect the whole program. Interview link: metaclasses are the
          heavier alternative for class customization.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          '@decorator above class applies decorator to the class object.',
          'Useful for auto-registering, repr, validation, singletons.',
          '@dataclass is a built-in class decorator.',
          'Class decorators run at definition time — mind side effects.',
        ]}
      />
    </LessonArticle>
  )
}
