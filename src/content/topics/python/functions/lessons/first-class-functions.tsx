import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function FirstClassFunctions() {
  return (
    <LessonArticle>
      <Definition term="First-Class Functions">
        <p>
          In Python, functions are <strong className="text-white">first-class objects</strong>. You can assign them
          to variables, store them in lists, pass them as arguments, and return them from other functions — just
          like integers or strings.
        </p>
      </Definition>

      <ContentStep number={1} title="Functions as values">
        <Example
          title="Assign and pass"
          output={`16
25`}
        >{`def square(x):
    return x * x

def apply(fn, value):
    return fn(value)

print(apply(square, 4))

ops = [square, lambda x: x * x]
print(ops[1](5))`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Callbacks">
        <Example
          title="Tell me when done"
          output={`Processing...
Done!`}
        >{`def process(data, on_complete):
    print("Processing...")
    on_complete()

def say_done():
    print("Done!")

process([1, 2, 3], say_done)`}</Example>
        <p>
          Higher-order functions — functions that take or return other functions — are the foundation of closures
          and decorators.
        </p>
      </ContentStep>

      <Callout variant="beginner">
        OOP methods are functions too. When you write <code className="font-mono text-sm">obj.method()</code>,
        Python passes <code className="font-mono text-sm">obj</code> as the first argument. First-class functions
        explain why that works.
      </Callout>

      <KeyTakeaways
        items={[
          'Functions can be assigned, passed, and returned.',
          'A callback is a function passed to run later.',
          'Higher-order functions take or return functions.',
          'This idea leads directly to closures and decorators.',
        ]}
      />
    </LessonArticle>
  )
}
