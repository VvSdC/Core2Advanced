import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  StepSequence,
} from '../../../../../components/content'

export function GarbageCollection() {
  return (
    <LessonArticle>
      <Definition term="Garbage Collection">
        <p>
          In C or C++, when you allocate memory with <code className="font-mono text-sm">malloc</code>, you must
          later free it with <code className="font-mono text-sm">free</code> — or your program leaks memory. Python
          does this cleanup for you automatically. That automatic cleanup is called{' '}
          <strong className="text-white">garbage collection</strong>.
        </p>
        <p>
          You never write <code className="font-mono text-sm">free(my_list)</code> in Python. When data is no longer
          needed, Python detects it and reclaims the memory so other parts of your program (or other programs) can
          use it.
        </p>
        <p>
          Python uses <strong className="text-white">two strategies</strong> working together: reference counting
          (handles 99% of cleanup, immediately) and a generational garbage collector (catches special cases
          reference counting misses).
        </p>
      </Definition>

      <Callout variant="beginner" title="What is a reference?">
        When you write <code className="font-mono text-sm">x = [1, 2, 3]</code>, two things happen: a list object
        is created in memory, and the name <code className="font-mono text-sm">x</code> is bound to it. We say x{' '}
        <em>references</em> (points to) that list. If you also write{' '}
        <code className="font-mono text-sm">y = x</code>, now <em>two</em> names reference the same list.
      </Callout>

      <ContentStep number={1} title="The flow">
        <p>Here is the lifecycle most objects follow — driven by reference counting:</p>
        <Flowchart
          title="Reference counting lifecycle"
          chart={`
flowchart TB
  A["Object created"]
  B["refcount = 1"]
  C["New reference added"]
  D["refcount increases"]
  E["Reference removed"]
  F["refcount decreases"]
  G["refcount = 0"]
  H["Memory freed"]

  A --> B
  B --> C
  C --> D
  D --> E
  E --> F
  F --> G
  G --> H

  style G fill:#1a2540,stroke:#fbbf24,color:#f8fafc
  style H fill:#1a2540,stroke:#38bdf8,color:#f8fafc
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Walking through the flow">
        <p>Let us trace a concrete example step by step:</p>
        <Example title="Follow along in a Python shell">{`a = [1, 2, 3]   # Step 1
b = a            # Step 2
del b            # Step 3
del a            # Step 4`}</Example>
        <StepSequence
          steps={[
            {
              title: 'Step 1: a = [1, 2, 3]',
              description: (
                <>
                  <p>
                    A list object is created in memory. The name <code className="font-mono text-sm">a</code>{' '}
                    references it. The object's reference count is <strong className="text-white">1</strong> (one
                    variable points to it).
                  </p>
                </>
              ),
            },
            {
              title: 'Step 2: b = a',
              description: (
                <>
                  <p>
                    No new list is created. <code className="font-mono text-sm">b</code> now points to the{' '}
                    <em>same</em> list as <code className="font-mono text-sm">a</code>. Reference count becomes{' '}
                    <strong className="text-white">2</strong>.
                  </p>
                  <p className="mt-2">
                    You can verify: <code className="font-mono text-sm">a is b</code> returns{' '}
                    <code className="font-mono text-sm">True</code> — same object, not a copy.
                  </p>
                </>
              ),
            },
            {
              title: 'Step 3: del b',
              description: (
                <>
                  <p>
                    The name <code className="font-mono text-sm">b</code> is removed. One reference is gone.
                    Reference count drops to <strong className="text-white">1</strong>. The list still exists
                    because <code className="font-mono text-sm">a</code> still points to it.
                  </p>
                </>
              ),
            },
            {
              title: 'Step 4: del a',
              description: (
                <>
                  <p>
                    The last reference is gone. Reference count hits <strong className="text-white">0</strong>.
                    Python immediately calls the list's cleanup function and returns the memory. This is instant —
                    no waiting, no pause.
                  </p>
                </>
              ),
            },
          ]}
        />
        <p className="pt-4">Now the harder case — what reference counting cannot handle alone:</p>
        <Flowchart
          title="Circular references"
          chart={`
flowchart TB
  A["Object A"]
  B["Object B"]

  A --> B
  B --> A
        `}
        />
        <p>
          Imagine two objects that reference each other. Even if your program deletes all variable names pointing
          to them, each object still has a refcount of 1 (from the other object). Reference counting sees them as
          "still in use" forever. This is a <strong className="text-white">memory leak</strong> without the second
          mechanism.
        </p>
        <Callout variant="beginner">
          Python's <strong className="text-white">generational garbage collector</strong> periodically scans for
          groups of objects that reference each other but are unreachable from your program. It finds these cycles
          and cleans them up. It divides objects into three generations (0, 1, 2) — young objects get scanned more
          often because they are more likely to be temporary.
        </Callout>
      </ContentStep>

      <ContentStep number={3} title="In practice">
        <Example
          title="Watching reference counts live"
          output={`2
3
2`}
          caption="getrefcount always reports 1 higher than you expect because the act of calling getrefcount creates a temporary reference."
        >{`import sys

a = [1, 2, 3]
print(sys.getrefcount(a))   # 2

b = a
print(sys.getrefcount(a))   # 3

del b
print(sys.getrefcount(a))   # 2`}</Example>
        <Example
          title="Creating and breaking a cycle"
          caption="After del a, b — neither name exists, but the two Node objects still reference each other. gc.collect() finds and frees them."
        >{`import gc

class Node:
  def __init__(self):
    self.partner = None

a = Node()
b = Node()
a.partner = b
b.partner = a   # A points to B, B points to A

del a, b          # refcount stuck at 1 for each
gc.collect()      # cyclic GC cleans up`}</Example>
        <Example
          title="When variables go out of scope"
          output={`Inside function: refcount = 2
After function returns: object is gone`}
          caption="Local variables inside a function are automatically cleaned up when the function returns — their references are removed."
        >{`import sys

def make_list():
    data = [1, 2, 3]
    print(f"Inside function: refcount = {sys.getrefcount(data)}")
    return data

my_list = make_list()
# 'data' no longer exists, but the list lives on via my_list`}</Example>
      </ContentStep>

      <Callout variant="tip">
        As a beginner, you rarely need to think about garbage collection day-to-day — Python handles it. But if a
        long-running program keeps growing in memory, look for: (1) objects you keep appending to a global list, or
        (2) circular references in complex data structures.
      </Callout>

      <KeyTakeaways
        items={[
          'Python frees memory automatically — you never call free() or delete.',
          'Reference counting tracks how many names point to each object.',
          'When refcount hits 0, memory is freed immediately.',
          'Circular references need the generational GC — it runs periodically in the background.',
        ]}
      />
    </LessonArticle>
  )
}
