import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function Polymorphism() {
  return (
    <LessonArticle>
      <Definition term="Polymorphism">
        <p>
          <strong className="text-white">Polymorphism</strong> means "many forms." In Python, different classes can
          implement the same method name, and code that calls that method works with <em>any</em> of them — without
          caring about the exact type.
        </p>
        <p>
          You already saw a hint in the Object Model lesson: <strong className="text-white">duck typing</strong>. If
          it quacks like a duck, treat it as a duck.
        </p>
      </Definition>

      <ContentStep number={1} title="Polymorphism without inheritance">
        <Example
          title="Same function, different classes"
          output={`Woof!
Meow!
Hiss!`}
        >{`class Dog:
    def speak(self):
        return "Woof!"

class Cat:
    def speak(self):
        return "Meow!"

class Snake:
    def speak(self):
        return "Hiss!"

def announce(animal):
    print(animal.speak())

for pet in [Dog(), Cat(), Snake()]:
    announce(pet)`}</Example>
        <p>
          <code className="font-mono text-sm">announce</code> never checks <code className="font-mono text-sm">type(animal)</code>.
          It only needs <code className="font-mono text-sm">.speak()</code> to exist.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Polymorphism with inheritance">
        <Example
          title="Shared interface via parent class"
          output={`Area: 78.5
Area: 25.0`}
        >{`class Shape:
    def area(self):
        raise NotImplementedError("Subclass must implement")

class Circle(Shape):
    def __init__(self, r):
        self.r = r
    def area(self):
        return 3.14 * self.r ** 2

class Square(Shape):
    def __init__(self, s):
        self.s = s
    def area(self):
        return self.s ** 2

def print_area(shape):
    print(f"Area: {shape.area()}")

print_area(Circle(5))
print_area(Square(5))`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Why polymorphism unlocks flexibility">
        <Callout variant="insight">
          You can add a new Shape subclass tomorrow — Triangle, Hexagon — and{' '}
          <code className="font-mono text-sm">print_area</code> still works without changing. That is the power:
          write code against behavior, not concrete types.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Polymorphism: same method name, different implementations.',
          'Callers depend on behavior (.speak(), .area()), not exact class.',
          'Works with duck typing or inheritance hierarchies.',
          'Makes code open for extension without modifying existing functions.',
        ]}
      />
    </LessonArticle>
  )
}
