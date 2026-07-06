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

export function MemoryAllocation() {
  return (
    <LessonArticle>
      <Definition term="Memory Allocation">
        <p>
          When you write <code className="rounded bg-surface-700 px-1.5 py-0.5 font-mono text-sm">x = 42</code> in
          Python, where does the number 42 actually live? It lives in your computer's <strong className="text-white">memory</strong> (RAM) — and Python had to request space for it.
        </p>
        <p>
          <strong className="text-white">Memory allocation</strong> is the process of reserving space in RAM for
          data. In languages like C, programmers call functions like <code className="font-mono text-sm">malloc</code>{' '}
          manually. In Python, allocation happens automatically every time you create a value — but it still
          happens, and understanding it explains memory usage and performance.
        </p>
        <p>
          Every variable you create, every list you append to, every string you concatenate — all of it requires
          memory allocation behind the scenes.
        </p>
      </Definition>

      <Callout variant="beginner" title="What is RAM?">
        RAM (Random Access Memory) is your computer's short-term workspace. When Python "creates an object," it
        asks the operating system for a slice of RAM to store that object's data. When the object is no longer
        needed, that space is returned (garbage collection — covered in the next lesson).
      </Callout>

      <ContentStep number={1} title="The flow">
        <p>When Python needs memory for a new object, it follows this decision process:</p>
        <Flowchart
          title="Allocation decision"
          chart={`
flowchart TB
  A["New object created"]
  B{"Small or large?"}
  C["Pooled allocator"]
  E["Arena 256 KB block"]
  D["System heap"]
  F["OS memory"]

  A --> B
  B -->|Small| C
  C --> E
  B -->|Large| D
  D --> F

  style C fill:#1a2540,stroke:#38bdf8,color:#f8fafc
  style E fill:#1a2540,stroke:#fbbf24,color:#f8fafc
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Walking through the flow">
        <StepSequence
          steps={[
            {
              title: 'Every object has a header',
              description: (
                <>
                  <p>
                    Before storing your actual data (the number 42, the string "hello"), Python attaches a{' '}
                    <strong className="text-white">header</strong> to every object. This header tracks:
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-slate-400">
                    <li>How many variables point to this object (reference count)</li>
                    <li>What type of object it is (int, str, list, etc.)</li>
                  </ul>
                  <p className="mt-2">
                    This header adds overhead. A single integer might use ~28 bytes even though the number itself
                    only needs 4–8 bytes.
                  </p>
                </>
              ),
            },
            {
              title: 'Small objects use memory pools',
              description: (
                <>
                  <p>
                    Python creates millions of small objects (integers, short strings, small lists). Asking the
                    operating system for memory each time would be very slow. Instead, Python pre-allocates large
                    blocks called <strong className="text-white">arenas</strong> (about 256 KB each) and carves
                    out small chunks from them.
                  </p>
                  <p className="mt-2">
                    Analogy: instead of driving to the warehouse for every item, you fill a cart once and pick from
                    it repeatedly.
                  </p>
                </>
              ),
            },
            {
              title: 'Type-specific free lists',
              description: (
                <>
                  <p>
                    When you delete a list, Python does not immediately return its memory to the OS. It may keep
                    the slot in a <strong className="text-white">free list</strong> so the next list you create
                    reuses that space instantly. Same idea for tuples and dicts.
                  </p>
                </>
              ),
            },
            {
              title: 'Large objects go straight to the system',
              description: (
                <>
                  <p>
                    Big objects (large strings, huge lists) bypass the pools and request memory directly from the
                    system heap via <code className="font-mono text-sm">PyMem_Malloc</code>. The OS handles the
                    actual RAM assignment.
                  </p>
                </>
              ),
            },
          ]}
        />
      </ContentStep>

      <ContentStep number={3} title="In practice">
        <p>Let us measure how much memory different objects actually use:</p>
        <Example
          title="Object sizes in bytes"
          output={`28    ← integer 42
54    ← string "hello"
88    ← list [1, 2, 3]`}
          caption="sys.getsizeof() returns the size of the object itself, not everything it references. A list containing a million items will report a small size — it only counts the list container, not the elements."
        >{`import sys

print(sys.getsizeof(42))
print(sys.getsizeof("hello"))
print(sys.getsizeof([1, 2, 3]))`}</Example>
        <Callout variant="beginner">
          Why is an integer 28 bytes? The number 42 is tiny, but the PyObject wrapper around it (reference count,
          type pointer, and storage) adds ~24 bytes of overhead. Python trades memory for a uniform object model.
        </Callout>
        <Example
          title="Lists grow in bursts, not one-by-one"
          output={`After 1 append:  size=1
After 2 appends: size=2
After 3 appends: size=3
After 4 appends: size=4
After 5 appends: size=5  ← internal buffer just grew`}
          caption="When a list runs out of internal space, Python allocates a bigger buffer (roughly 1.125× the current size) and copies elements over. This is why append() is fast on average."
        >{`items = []
for i in range(1, 6):
    items.append(i)
    print(f"After {i} append{'s' if i > 1 else ''}:  size={len(items)}")`}</Example>
        <Example
          title="Many small objects add up"
          caption="Creating 100,000 integers allocates 100,000 separate objects, each with a header. For memory-sensitive apps, this matters."
        >{`# Each iteration creates a new int object in memory
numbers = [i for i in range(100_000)]
print(f"Created {len(numbers)} integer objects")
print(f"One integer: {sys.getsizeof(0)} bytes")
print(f"Rough total: ~{len(numbers) * sys.getsizeof(0) // 1_000_000} MB")`}</Example>
      </ContentStep>

      <Callout variant="insight" title="Why beginners should care">
        If your program uses more RAM than expected, it is usually because Python creates many objects (not because
        "Python is bloated"). Knowing about object headers and pool allocation helps you write more memory-conscious
        code — like reusing lists instead of creating new ones in a loop.
      </Callout>

      <KeyTakeaways
        items={[
          'Every Python value is an object stored in RAM with a header overhead.',
          'Small objects are served from pre-allocated arena pools for speed.',
          'Lists and dicts over-allocate internal space to make append/insert faster.',
          'sys.getsizeof() shows container size — useful but does not count nested objects.',
        ]}
      />
    </LessonArticle>
  )
}
