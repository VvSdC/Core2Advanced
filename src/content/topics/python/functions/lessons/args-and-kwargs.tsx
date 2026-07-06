import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function ArgsAndKwargs() {
  return (
    <LessonArticle>
      <Definition term="*args & **kwargs">
        <p>
          When you do not know how many arguments a function will receive, use{' '}
          <code className="font-mono text-sm">*args</code> to collect extra{' '}
          <strong className="text-white">positional</strong> arguments into a tuple, and{' '}
          <code className="font-mono text-sm">**kwargs</code> to collect extra{' '}
          <strong className="text-white">keyword</strong> arguments into a dict.
        </p>
      </Definition>

      <Callout variant="beginner">
        The names <code className="font-mono text-sm">args</code> and <code className="font-mono text-sm">kwargs</code>{' '}
        are conventions. The magic is in the <code className="font-mono text-sm">*</code> and{' '}
        <code className="font-mono text-sm">**</code> operators.
      </Callout>

      <ContentStep number={1} title="*args — variable positional">
        <Example
          title="Sum any numbers"
          output={`15`}
        >{`def total(*args):
  print(args)   # tuple
  return sum(args)

print(total(1, 2, 3, 4, 5))`}</Example>
      </ContentStep>

      <ContentStep number={2} title="**kwargs — variable keyword">
        <Example
          title="Print config"
          output={`theme: dark
lang: en`}
        >{`def show_config(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

show_config(theme="dark", lang="en")`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Unpacking at call time">
        <Example
          title="Spread a list and dict into a call"
          output={`add(1, 2, 3) → 6`}
        >{`def add(a, b, c):
    return a + b + c

nums = [1, 2, 3]
print(add(*nums))

opts = {"a": 1, "b": 2, "c": 3}
print(add(**opts))`}</Example>
        <p>
          This pattern appears everywhere — decorators, wrappers, forwarding calls to other functions.
        </p>
      </ContentStep>

      <KeyTakeaways
        items={[
          '*args collects extra positional args into a tuple.',
          '**kwargs collects extra keyword args into a dict.',
          '* and ** unpack when calling: func(*list), func(**dict).',
          'Order in def: positional, *args, keyword-only, **kwargs.',
        ]}
      />
    </LessonArticle>
  )
}
