import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function Decorators() {
  return (
    <LessonArticle>
      <Definition term="Decorators">
        <p>
          A <strong className="text-white">decorator</strong> is a function that takes another function and
          returns a wrapped version — usually adding logging, timing, authentication, or validation. The{' '}
          <code className="font-mono text-sm">@decorator</code> syntax is syntactic sugar for passing the function
          below it to the decorator.
        </p>
      </Definition>

      <ContentStep number={1} title="The flow">
        <Flowchart
          title="@decorator sugar"
          chart={`
flowchart TB
  A["def my_func"]
  B["@decorator"]
  C["my_func = decorator(my_func)"]

  A --> B
  B --> C
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Manual decorator — no @ yet">
        <Example
          title="Wrap to add behavior"
          output={`Calling greet
Hello!
Finished greet`}
        >{`def log_calls(fn):
    def wrapper(*args, **kwargs):
        print(f"Calling {fn.__name__}")
        result = fn(*args, **kwargs)
        print(f"Finished {fn.__name__}")
        return result
    return wrapper

def greet(name):
    print(f"Hello, {name}!")

greet = log_calls(greet)
greet("Ada")`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Using @ syntax">
        <Example
          title="Same thing, cleaner"
          output={`Calling add
Finished add
5`}
        >{`def log_calls(fn):
    def wrapper(*args, **kwargs):
        print(f"Calling {fn.__name__}")
        result = fn(*args, **kwargs)
        print(f"Finished {fn.__name__}")
        return result
    return wrapper

@log_calls
def add(a, b):
    return a + b

print(add(2, 3))`}</Example>
        <p>
          <code className="font-mono text-sm">@log_calls</code> above{' '}
          <code className="font-mono text-sm">def add</code> means{' '}
          <code className="font-mono text-sm">add = log_calls(add)</code>.
        </p>
      </ContentStep>

      <ContentStep number={4} title="functools.wraps — preserve metadata">
        <Example
          title="Keep __name__ and docstring"
        >{`from functools import wraps

def log_calls(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)
    return wrapper`}</Example>
        <Callout variant="beginner">
          Always use <code className="font-mono text-sm">@wraps(fn)</code> on your wrapper so debugging tools see
          the original function name.
        </Callout>
      </ContentStep>

      <ContentStep number={5} title="Decorators with arguments">
        <Example
          title="@repeat(3)"
          output={`hello
hello
hello`}
        >{`from functools import wraps

def repeat(times):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            for _ in range(times):
                fn(*args, **kwargs)
        return wrapper
    return decorator

@repeat(3)
def say_hi():
    print("hello")

say_hi()`}</Example>
        <p>Three levels: outer takes decorator args, middle takes the function, inner is the wrapper.</p>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Decorators wrap functions to add behavior.',
          '@dec def f(): is equivalent to f = dec(f).',
          'Use *args, **kwargs in wrappers to forward any signature.',
          'functools.wraps preserves the original function metadata.',
          'You will use decorators heavily in OOP (@property, @classmethod).',
        ]}
      />
    </LessonArticle>
  )
}
