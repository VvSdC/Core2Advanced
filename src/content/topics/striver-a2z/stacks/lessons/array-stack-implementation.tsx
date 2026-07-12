import {
  Callout,
  ContentStep,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ArrayStackImplementation() {
  return (
    <LessonArticle>

      {/* ── Problem Statement ─────────────────────────────────────── */}
      <LessonSection title="Problem Statement">
        <p>
          Design a stack data structure backed by a fixed-size array. The stack must support the following operations:
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-300">
          <li><code className="font-mono text-sm">push(x)</code> — Insert element <code className="font-mono text-sm">x</code> onto the top of the stack.</li>
          <li><code className="font-mono text-sm">pop()</code> — Remove and return the top element.</li>
          <li><code className="font-mono text-sm">top()</code> — Return the top element without removing it.</li>
          <li><code className="font-mono text-sm">isEmpty()</code> — Return <code className="font-mono text-sm">True</code> if the stack has no elements.</li>
          <li><code className="font-mono text-sm">isFull()</code> — Return <code className="font-mono text-sm">True</code> if the stack has reached maximum capacity.</li>
          <li><code className="font-mono text-sm">size()</code> — Return the current number of elements.</li>
          <li><code className="font-mono text-sm">display()</code> — Print all elements from top to bottom.</li>
        </ul>
        <p className="mt-3">
          If <code className="font-mono text-sm">push</code> is called on a full stack, raise an{' '}
          <code className="font-mono text-sm">IndexError</code> (stack overflow). If <code className="font-mono text-sm">pop</code>{' '}
          or <code className="font-mono text-sm">top</code> is called on an empty stack, raise an{' '}
          <code className="font-mono text-sm">IndexError</code> (stack underflow / empty).
        </p>
      </LessonSection>

      {/* ── Constraints ───────────────────────────────────────────── */}
      <LessonSection title="Constraints">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li>Maximum capacity of the stack: <strong className="text-white">100</strong> elements.</li>
          <li>At most <strong className="text-white">10<sup>3</sup></strong> operations in total.</li>
          <li>Elements pushed satisfy <strong className="text-white">−10<sup>9</sup> ≤ x ≤ 10<sup>9</sup></strong>.</li>
          <li><code className="font-mono text-sm">pop()</code> and <code className="font-mono text-sm">top()</code> will only be called on a non-empty stack in valid test cases — but your implementation must still guard against invalid calls.</li>
        </ul>
      </LessonSection>

      {/* ── Approach ──────────────────────────────────────────────── */}
      <LessonSection title="Approach">
        <p>
          The key insight is to simulate a stack using a pre-allocated Python list and a single integer{' '}
          <code className="font-mono text-sm">current_index</code> that always points to the top element.
        </p>

        <ContentStep number={1} title="Internal state">
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li><code className="font-mono text-sm">current_list</code> — a list of length <code className="font-mono text-sm">max_size</code> (100), pre-filled with zeros. Acts as the backing array.</li>
            <li><code className="font-mono text-sm">current_index</code> — starts at <strong className="text-white">−1</strong> (stack empty). After the first push it becomes 0, after the second it becomes 1, and so on.</li>
          </ul>
        </ContentStep>

        <ContentStep number={2} title="push — how it works">
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li>Check if <code className="font-mono text-sm">current_index == max_size − 1</code>. If yes → overflow error.</li>
            <li>Increment <code className="font-mono text-sm">current_index</code>.</li>
            <li>Write <code className="font-mono text-sm">x</code> into <code className="font-mono text-sm">current_list[current_index]</code>.</li>
          </ul>
          <Flowchart
            title="push(x) flow"
            chart={`flowchart TB
  A([push x]) --> B{isFull?}
  B -- yes --> C([raise IndexError overflow])
  B -- no --> D[current_index += 1]
  D --> E[current_list at current_index = x]
  E --> F([done])`}
          />
        </ContentStep>

        <ContentStep number={3} title="pop — how it works">
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li>Check if <code className="font-mono text-sm">current_index == −1</code>. If yes → underflow error.</li>
            <li>Read <code className="font-mono text-sm">current_list[current_index]</code> into a temp variable.</li>
            <li>Decrement <code className="font-mono text-sm">current_index</code>.</li>
            <li>Return the temp variable.</li>
          </ul>
          <Flowchart
            title="pop() flow"
            chart={`flowchart TB
  A([pop]) --> B{isEmpty?}
  B -- yes --> C([raise IndexError underflow])
  B -- no --> D[top = current_list at current_index]
  D --> E[current_index -= 1]
  E --> F([return top])`}
          />
        </ContentStep>

        <ContentStep number={4} title="Why pre-allocate?">
          <p>
            Pre-allocating the list in <code className="font-mono text-sm">__init__</code> means every subsequent{' '}
            <code className="font-mono text-sm">push</code> is a simple index-write — no dynamic resizing, no memory
            allocation at runtime. This guarantees O(1) worst-case (not amortised) for every operation.
          </p>
          <Callout variant="insight">
            Python's built-in <code className="font-mono text-sm">list.append()</code> is amortised O(1) — it occasionally
            doubles the backing array. A pre-allocated array avoids that unpredictability entirely.
          </Callout>
        </ContentStep>
      </LessonSection>

      {/* ── Code ──────────────────────────────────────────────────── */}
      <LessonSection title="Implementation">
        <Example title="ArrayStack">{`class ArrayStack:
    def __init__(self):
        self.max_size = 100
        self.current_list = [0] * self.max_size
        self.current_index = -1

    def push(self, x):
        if self.isFull():
            raise IndexError("Stack overflow")
        self.current_index += 1
        self.current_list[self.current_index] = x

    def pop(self):
        if self.isEmpty():
            raise IndexError("Stack underflow")
        top_element = self.current_list[self.current_index]
        self.current_index -= 1
        return top_element

    def top(self):
        if self.isEmpty():
            raise IndexError("Stack is empty")
        return self.current_list[self.current_index]

    def isEmpty(self):
        return self.current_index == -1

    def isFull(self):
        return self.current_index == self.max_size - 1

    def size(self):
        return self.current_index + 1

    def display(self):
        if self.isEmpty():
            print("Stack is empty")
            return
        print("Stack (top → bottom):", self.current_list[self.current_index::-1])`}</Example>

        <Example
          title="Usage"
          output={`True
False
3
30
30
Stack (top → bottom): [20, 10]`}
        >{`s = ArrayStack()

print(s.isEmpty())   # True
s.push(10)
s.push(20)
s.push(30)
print(s.isEmpty())   # False

print(s.size())      # 3
print(s.top())       # 30   (peek, not removed)
print(s.pop())       # 30   (removed)
s.display()          # Stack (top → bottom): [20, 10]`}</Example>
      </LessonSection>

      {/* ── Complexity ────────────────────────────────────────────── */}
      <LessonSection title="Complexity Analysis">
        <p className="text-sm font-semibold text-white">Time Complexity</p>
        <div className="mt-2 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Operation</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['__init__', 'O(m)', 'Pre-allocates a list of m = 100 elements. Since m is a fixed constant, this is effectively O(1) in practice.'],
                ['push', 'O(1)', 'One bounds check + one index write.'],
                ['pop', 'O(1)', 'One bounds check + one index read + decrement.'],
                ['top', 'O(1)', 'One bounds check + one index read.'],
                ['isEmpty', 'O(1)', 'Single comparison: current_index == −1.'],
                ['isFull', 'O(1)', 'Single comparison: current_index == max_size − 1.'],
                ['size', 'O(1)', 'Returns current_index + 1.'],
                ['display', 'O(n)', 'Slices n current elements and prints them.'],
              ].map(([op, time, reason]) => (
                <tr key={op} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono">{op}</td>
                  <td className="px-4 py-3 font-semibold text-white">{time}</td>
                  <td className="px-4 py-3 text-slate-400">{reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-sm font-semibold text-white">Space Complexity</p>
        <p className="mt-2 text-sm text-slate-300">
          <strong className="text-white">O(m)</strong> where m is <code className="font-mono text-sm">max_size</code> (100)
          for the pre-allocated backing array. This is a fixed, constant overhead regardless of how many elements are
          pushed. No individual method allocates additional heap memory beyond a single temporary variable (O(1) auxiliary).
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'current_index tracks the top — starts at -1 (empty) and increments on push.',
          'Always guard push with isFull() and pop/top with isEmpty() to prevent silent corruption.',
          'All operations except display and __init__ are strict O(1) — no amortised cost.',
          'Pre-allocated array trades a fixed O(m) memory footprint for guaranteed constant-time writes.',
        ]}
      />
    </LessonArticle>
  )
}
