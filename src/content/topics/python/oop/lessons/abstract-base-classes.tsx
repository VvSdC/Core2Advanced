import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function AbstractBaseClasses() {
  return (
    <LessonArticle>
      <Definition term="Abstract Base Classes">
        <p>
          The <strong className="text-white">abc</strong> module defines interfaces that subclasses must implement.
          Use <code className="font-mono text-sm">@abstractmethod</code> to force method implementation — common in
          frameworks and API design interviews.
        </p>
      </Definition>

      <ContentStep number={1} title="Defining an ABC">
        <Example
          title="Cannot instantiate ABC directly"
        >{`from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

class Circle(Shape):
    def __init__(self, r):
        self.r = r
    def area(self):
        return 3.14 * self.r ** 2

# Shape()  # TypeError
c = Circle(5)
print(c.area())`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Multiple abstract methods">
        <Example
          title="All must be implemented"
        >{`class Repository(ABC):
    @abstractmethod
    def get(self, id): ...
    @abstractmethod
    def save(self, obj): ...

class MemoryRepo(Repository):
    def __init__(self):
        self._data = {}
    def get(self, id):
        return self._data.get(id)
    def save(self, obj):
        self._data[obj.id] = obj`}</Example>
      </ContentStep>

      <ContentStep number={3} title="abstractclassmethod">
        <p>
          <code className="font-mono text-sm">@classmethod</code> + <code className="font-mono text-sm">@abstractmethod</code>{' '}
          can define factory interfaces subclasses must provide.
        </p>
      </ContentStep>

      <ContentStep number={4} title="vs Protocol">
        <Callout variant="info">
          ABCs use <em>nominal</em> subtyping — must inherit explicitly. <code className="font-mono text-sm">typing.Protocol</code>{' '}
          uses <em>structural</em> subtyping — duck typing with type checks. Modern Python often prefers Protocol.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Inherit from ABC and mark methods with @abstractmethod.',
          'Cannot instantiate until all abstract methods are implemented.',
          'Use for clear contracts — Shape, Repository, Plugin interfaces.',
          'Protocol is the structural alternative to ABC inheritance.',
        ]}
      />
    </LessonArticle>
  )
}
