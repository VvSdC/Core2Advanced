import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function PythonObjectModel() {
  return (
    <LessonArticle>
      <Definition term="The Python Object Model">
        <p>
          In many programming languages, numbers are just numbers and functions are special. Python is different:{' '}
          <strong className="text-white">everything is an object</strong>.
        </p>
        <p>
          The number <code className="font-mono text-sm">42</code> is an object. The string{' '}
          <code className="font-mono text-sm">"hello"</code> is an object. A function you define is an object. Even
          the concept of "type" is an object. This unified model is called the{' '}
          <strong className="text-white">Python object model</strong>.
        </p>
        <p>
          For beginners, the practical impact is huge: you can pass functions as arguments, store classes in
          variables, and inspect any value at runtime with{' '}
          <code className="font-mono text-sm">type()</code> and <code className="font-mono text-sm">dir()</code>.
        </p>
      </Definition>

      <Callout variant="beginner" title="What is an object?">
        An object is a bundle of <strong className="text-white">data</strong> (the value) and{' '}
        <strong className="text-white">behavior</strong> (methods you can call on it). A Python list object stores
        elements (data) and provides <code className="font-mono text-sm">.append()</code>,{' '}
        <code className="font-mono text-sm">.pop()</code>, etc. (behavior).
      </Callout>

      <ContentStep number={1} title="The flow">
        <p>Internally, every value you create follows this structure in memory:</p>
        <Flowchart
          title="PyObject anatomy"
          chart={`
flowchart TB
  RC["Reference count"]
  TYPE["Type pointer"]
  DATA["Value data"]
  NAME["Type name"]
  METHODS["Method table"]
  DEALLOC["Cleanup function"]

  RC --> TYPE
  TYPE --> DATA
  DATA --> NAME
  NAME --> METHODS
  METHODS --> DEALLOC
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Walking through the flow">
        <p>Let us decode each part of the diagram with everyday Python:</p>
        <ul className="space-y-4">
          <li className="rounded-lg border border-surface-600 bg-surface-800/40 p-4">
            <p className="font-semibold text-white">Reference count</p>
            <p className="mt-1 text-sm text-slate-400">
              Tracks how many variables point to this object. When it hits zero, the object is destroyed. Covered
              in the Garbage Collection lesson.
            </p>
          </li>
          <li className="rounded-lg border border-surface-600 bg-surface-800/40 p-4">
            <p className="font-semibold text-white">Type pointer</p>
            <p className="mt-1 text-sm text-slate-400">
              A link to the object's type definition. When you call{' '}
              <code className="font-mono text-sm">x.append(1)</code>, Python follows this pointer to find the{' '}
              <code className="font-mono text-sm">append</code> method for lists.
            </p>
          </li>
          <li className="rounded-lg border border-surface-600 bg-surface-800/40 p-4">
            <p className="font-semibold text-white">Value data</p>
            <p className="mt-1 text-sm text-slate-400">
              The actual payload — the integer value, the characters in a string, the elements in a list. This is
              the part unique to each object.
            </p>
          </li>
          <li className="rounded-lg border border-surface-600 bg-surface-800/40 p-4">
            <p className="font-semibold text-white">Method table (on the type)</p>
            <p className="mt-1 text-sm text-slate-400">
              The type object stores a table of all methods and attributes available. This is why{' '}
              <code className="font-mono text-sm">dir([])</code> shows{' '}
              <code className="font-mono text-sm">append</code>, <code className="font-mono text-sm">pop</code>,{' '}
              <code className="font-mono text-sm">sort</code>, and dozens more.
            </p>
          </li>
        </ul>
        <Callout variant="beginner">
          <strong className="text-white">Duck typing:</strong> Python does not check an object's type before
          calling a method. It only checks: "does this object have the method I need?" If it walks like a duck and
          quacks like a duck, treat it as a duck. This is why a custom class with an{' '}
          <code className="font-mono text-sm">.area()</code> method works anywhere a Circle would.
        </Callout>
      </ContentStep>

      <ContentStep number={3} title="In practice">
        <Example
          title="Everything has a type — even types"
          output={`<class 'int'>
<class 'type'>
<class 'function'>
['__abs__', '__add__', ..., 'as_integer_ratio', 'bit_length', ...]`}
          caption="type(42) tells you it's an int. type(type) reveals that types are themselves objects. dir() lists all methods an object supports."
        >{`x = 42
print(type(x))        # <class 'int'>
print(type(type))     # <class 'type'>

def greet():
    pass

print(type(greet))    # <class 'function'>
print(dir(x))         # all methods on integers`}</Example>
        <Example
          title="Functions are objects you can pass around"
          caption="Because greet is a regular object, you can store it in a list, pass it to another function, or assign it to a variable — just like an integer or string."
        >{`def greet(name):
    return f"Hello, {name}!"

def shout(name):
    return f"HELLO, {name}!"

# Store functions in a list
greeters = [greet, shout]

# Call them dynamically
for fn in greeters:
    print(fn("World"))`}</Example>
        <Example
          title="Duck typing in action"
          output={`Area: 78.5
Area: 25.0`}
          caption="area() never checks isinstance(shape, Circle). It just calls .area() — if the object has that method, it works."
        >{`class Circle:
    def __init__(self, r):
        self.r = r
    def area(self):
        return 3.14 * self.r ** 2

class Square:
    def __init__(self, s):
        self.s = s
    def area(self):
        return self.s ** 2

def area(shape):
    return shape.area()

print("Area:", area(Circle(5)))
print("Area:", area(Square(5)))`}</Example>
        <Example
          title="Classes are objects too"
          output={`<class 'type'>
Dog`}
          caption="Dog is a class, and its type is 'type'. type is the metaclass — the class that creates classes. You do not need to master this now, but it shows how deep the object model goes."
        >{`class Dog:
    def bark(self):
        return "Woof!"

print(type(Dog))       # <class 'type'>
print(Dog.__name__)    # 'Dog'`}</Example>
      </ContentStep>

      <ContentStep number={4} title="Identity, copies, and name lookup">
        <p>Three more ideas that connect directly to how objects live in memory:</p>
        <Example
          title="== vs is — equal values vs same object"
          output={`True
False`}
          caption="== compares values. is compares identity (same object in memory). Two identical lists are equal but not the same object."
        >{`a = [1, 2]
b = [1, 2]
print(a == b)   # True
print(a is b)   # False
print(id(a), id(b))`}</Example>
        <Example
          title="type() vs isinstance()"
          output={`True
True
False`}
          caption="isinstance() respects inheritance — it returns True for parent classes too. Prefer isinstance() when checking types."
        >{`class Animal: pass
class Dog(Animal): pass

d = Dog()
print(isinstance(d, Dog))      # True
print(isinstance(d, Animal))  # True — Dog is a subclass
print(type(d) is Animal)       # False — exact type is Dog`}</Example>
        <Example
          title="Shallow copy vs deep copy"
          output={`[[1, 2, 99], [3, 4]]   ← original changed too`}
          caption="Shallow copy shares inner objects. Deep copy duplicates everything recursively."
        >{`import copy
original = [[1, 2], [3, 4]]
shallow = copy.copy(original)
deep = copy.deepcopy(original)

shallow[0].append(99)
print(original)   # inner list shared with shallow`}</Example>
        <Callout variant="beginner" title="Namespaces and the LEGB rule">
          A <strong className="text-white">namespace</strong> is where Python stores names (variables, functions).
          Each module, function, and class has its own. When Python looks up a name, it searches in order:{' '}
          <strong className="text-white">L</strong>ocal → <strong className="text-white">E</strong>nclosing →{' '}
          <strong className="text-white">G</strong>lobal → <strong className="text-white">B</strong>uilt-in. First
          match wins. This is why a variable inside a function can share a name with one outside without conflict.
        </Callout>
      </ContentStep>

      <Callout variant="insight" title="The trade-off for beginners">
        The object model makes Python incredibly flexible and beginner-friendly (everything works the same way).
        The cost is memory: every value carries extra metadata. For most programs this does not matter. For
        performance-critical code processing millions of numbers, it can — which is why libraries like NumPy exist
        (they store raw numbers without per-value object overhead).
      </Callout>

      <KeyTakeaways
        items={[
          'In Python, everything — numbers, functions, classes — is an object.',
          'Each object has a header (refcount + type) and value data.',
          'The type object defines what methods and behavior are available.',
          'Duck typing means Python checks for methods, not specific types.',
          '== compares values; is compares object identity in memory.',
          'Namespaces and LEGB govern where Python finds each variable name.',
        ]}
      />
    </LessonArticle>
  )
}
