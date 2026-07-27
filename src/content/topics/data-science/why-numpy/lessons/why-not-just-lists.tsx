import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function WhyNotJustLists() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Take a breath — this is a story, not a lecture">
        Imagine you have a notebook of exam scores and you want to add 5 bonus marks to{' '}
        <em>every</em> student. With ten students, a loop is fine. With a million rows, that loop
        feels like walking across a city. NumPy is the bus.
      </Callout>

      <Callout variant="tip" title="The honest question">
        Python lists already hold numbers. Why install NumPy? Because lists are flexible boxes;
        NumPy arrays are <strong className="text-white">fast number engines</strong>. For data
        science, that difference is huge.
      </Callout>

      <Definition term="Python list vs NumPy array">
        <p>
          A <strong className="text-white">list</strong> can store mixed types and grows easily, but
          math on millions of values is slow. A <strong className="text-white">NumPy array</strong>{' '}
          stores one data type in a tight block of memory and runs vectorized math in optimized C
          code — you write less, it runs faster.
        </p>
      </Definition>

      <LessonSection title="A tiny example you can feel">
        <p className="text-slate-300">
          Adding bonus marks with a list needs a loop. With NumPy it is one line:
        </p>
        <Example title="Same idea, two styles">
{`# lists — clear but slow at huge scale
scores = [70, 80, 90]
boosted = [s + 5 for s in scores]

# NumPy — same meaning, built for scale
import numpy as np
scores = np.array([70, 80, 90])
boosted = scores + 5`}
        </Example>
        <Callout variant="beginner">
          If you only remember one thing: <code className="font-mono text-xs">scores + 5</code> on a
          NumPy array adds 5 to <em>every</em> value. That “do it to all” habit is vectorization.
        </Callout>
      </LessonSection>

      <LessonSection title="What goes wrong with lists at scale">
        <ContentStep number={1} title="Loop tax">
          <p className="text-slate-300">
            Adding two lists of a million numbers needs a Python loop (or comprehension). Every step
            is interpreted — fine for 100 items, painful for 10,000,000.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Scattered memory">
          <p className="text-slate-300">
            List items are pointers to separate Python objects. NumPy stores values contiguously, so
            the CPU can chew through them efficiently.
          </p>
        </ContentStep>
        <ContentStep number={3} title="No built-in “do this to every number”">
          <p className="text-slate-300">
            Want mean, sin, or filter? With lists you write more loops. With NumPy you call one
            function.
          </p>
        </ContentStep>
        <Example
          title="Same job — list vs NumPy (1,000,000 adds)"
          output={`list comprehension ≈ 0.07 s
NumPy vectorized add ≈ 0.004 s
≈ 15–20× faster on a typical laptop (order of magnitude)`}
        >
{`import time
import numpy as np

n = 1_000_000
a = list(range(n))
b = list(range(n))

t0 = time.perf_counter()
c = [x + y for x, y in zip(a, b)]
print("list:", time.perf_counter() - t0)

x = np.arange(n)
y = np.arange(n)
t0 = time.perf_counter()
z = x + y
print("numpy:", time.perf_counter() - t0)`}
        </Example>
        <Callout variant="tip" title="When lists are still fine">
          Small scripts, mixed types, or “a few dozen values” — lists are perfect. Switch to NumPy
          when you do <em>lots</em> of numeric work.
        </Callout>
      </LessonSection>

      <LessonSection title="Efficiency and time tradeoff">
        <Flowchart
          title="Choosing the tool"
          chart={`flowchart TB
  A[Need numeric work?] --> B{How much data / math?}
  B -- Small / mixed types --> C[Python lists are OK]
  B -- Large / repeated math --> D[Use NumPy arrays]
  D --> E[Less Python looping]
  D --> F[Faster runtime]
  D --> G[Shorter code]`}
        />
        <p className="mt-4 text-slate-300">
          Tradeoff in one sentence: you give up “store anything in one list” and gain speed,
          clarity, and scientific tools.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Lists are flexible; NumPy arrays are optimized for homogeneous numbers.',
          'Vectorized NumPy ops avoid slow Python loops on large data.',
          'Use lists for small/mixed data; use NumPy for serious numeric work.',
        ]}
      />
    </LessonArticle>
  )
}
