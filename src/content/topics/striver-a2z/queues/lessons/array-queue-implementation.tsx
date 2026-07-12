import {
  Callout,
  ContentStep,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ArrayQueueImplementation() {
  return (
    <LessonArticle>

      {/* ── Problem Statement ─────────────────────────────────────── */}
      <LessonSection title="Problem Statement">
        <p>
          Implement a First-In, First-Out (FIFO) queue using an array. The implemented queue must
          support the following operations:
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-300">
          <li><code className="font-mono text-sm">push(x)</code> — Add element <code className="font-mono text-sm">x</code> to the end of the queue.</li>
          <li><code className="font-mono text-sm">pop()</code> — Remove and return the front element of the queue.</li>
          <li><code className="font-mono text-sm">peek()</code> — Return the front element without removing it.</li>
          <li><code className="font-mono text-sm">isEmpty()</code> — Return <code className="font-mono text-sm">True</code> if the queue is empty, <code className="font-mono text-sm">False</code> otherwise.</li>
        </ul>

        <div className="mt-4 space-y-4">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Example 1</p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Input:</span>
            </p>
            <pre className="mt-1 font-mono text-sm text-slate-300">{`["ArrayQueue", "push", "push", "peek", "pop", "isEmpty"]
[[], [5], [10], [], [], []]`}</pre>
            <p className="mt-3 text-sm text-slate-300">
              <span className="font-semibold text-white">Output:</span>{' '}
              <code className="font-mono text-sm">[null, null, null, 5, 5, false]</code>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              After pushing 5 and 10, <code className="font-mono text-xs">peek()</code> returns the front (5),{' '}
              <code className="font-mono text-xs">pop()</code> removes and returns 5, and the queue still has 10 so
              it is not empty.
            </p>
          </div>

          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Example 2</p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Input:</span>
            </p>
            <pre className="mt-1 font-mono text-sm text-slate-300">{`["ArrayQueue", "isEmpty"]
[[]]`}</pre>
            <p className="mt-3 text-sm text-slate-300">
              <span className="font-semibold text-white">Output:</span>{' '}
              <code className="font-mono text-sm">[null, true]</code>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              A freshly constructed queue is empty.
            </p>
          </div>

          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Try it yourself</p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Input:</span>
            </p>
            <pre className="mt-1 font-mono text-sm text-slate-300">{`["ArrayQueue", "push", "pop", "isEmpty"]
[[], [1], [], []]`}</pre>
            <p className="mt-3 text-sm text-slate-300">
              <span className="font-semibold text-white">Output:</span>{' '}
              <code className="font-mono text-sm">[null, null, 1, true]</code>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              After pushing 1 and immediately popping it, the queue is empty — so{' '}
              <code className="font-mono text-xs">isEmpty()</code> returns <code className="font-mono text-xs">true</code>.
            </p>
          </div>
        </div>
      </LessonSection>

      {/* ── Constraints ───────────────────────────────────────────── */}
      <LessonSection title="Constraints">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li>At most <strong className="text-white">100</strong> calls will be made in total.</li>
          <li><strong className="text-white">1 ≤ x ≤ 100</strong> for all pushed elements.</li>
          <li><code className="font-mono text-sm">pop()</code> and <code className="font-mono text-sm">peek()</code> are only called on a non-empty queue in valid test cases.</li>
        </ul>
      </LessonSection>

      {/* ── Approach ──────────────────────────────────────────────── */}
      <LessonSection title="Approach">
        <p>
          A queue needs to add at one end and remove from the other. We model this with a pre-allocated array and{' '}
          <strong className="text-white">two index pointers</strong>:
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-300">
          <li><code className="font-mono text-sm">end_index</code> — points to the last element pushed. Starts at <strong className="text-white">−1</strong>.</li>
          <li><code className="font-mono text-sm">start_index</code> — points to the next element to be popped. Starts at <strong className="text-white">0</strong>.</li>
        </ul>
        <Callout variant="insight">
          The queue is <strong className="text-white">empty</strong> when{' '}
          <code className="font-mono text-sm">start_index &gt; end_index</code>. There are no elements between
          the front pointer and the rear pointer.
        </Callout>

        <ContentStep number={1} title="push — enqueue at the rear">
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li>Increment <code className="font-mono text-sm">end_index</code>.</li>
            <li>Write <code className="font-mono text-sm">x</code> at <code className="font-mono text-sm">current_list[end_index]</code>.</li>
          </ul>
          <Flowchart
            title="push(x) flow"
            chart={`flowchart TB
  A([push x]) --> B[end_index += 1]
  B --> C[current_list at end_index = x]
  C --> D([done])`}
          />
        </ContentStep>

        <ContentStep number={2} title="pop — dequeue from the front">
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li>Read <code className="font-mono text-sm">current_list[start_index]</code> into a variable.</li>
            <li>Increment <code className="font-mono text-sm">start_index</code> to slide the front forward.</li>
            <li>Return the saved element.</li>
          </ul>
          <Flowchart
            title="pop() flow"
            chart={`flowchart TB
  A([pop]) --> B{isEmpty?}
  B -- yes --> C([raise IndexError])
  B -- no --> D[element = current_list at start_index]
  D --> E[start_index += 1]
  E --> F([return element])`}
          />
        </ContentStep>

        <ContentStep number={3} title="Two-pointer state after each operation">
          <p>
            Visualising how the pointers move through the array helps build intuition:
          </p>
          <Flowchart
            title="pointer state diagram"
            chart={`flowchart TB
  A["Initial: start=0, end=-1 → empty"] --> B["push(5): start=0, end=0 → [5]"]
  B --> C["push(10): start=0, end=1 → [5,10]"]
  C --> D["pop() → 5: start=1, end=1 → [10]"]
  D --> E["pop() → 10: start=2, end=1 → empty (start > end)"]`}
          />
          <Callout variant="info">
            Elements from index 0 to <code className="font-mono text-sm">start_index − 1</code> are logically gone
            after popping. The array slots are not reused — this is a simple linear queue suitable for up to
            100 operations as per the constraints.
          </Callout>
        </ContentStep>
      </LessonSection>

      {/* ── Implementation ────────────────────────────────────────── */}
      <LessonSection title="Implementation">
        <Example title="ArrayQueue">{`class ArrayQueue:
    def __init__(self):
        self.max_size = 100
        self.current_list = [0] * self.max_size
        self.start_index = 0
        self.end_index = -1

    def push(self, x):
        if self.end_index == self.max_size - 1:
            raise IndexError("Queue overflow")
        self.end_index += 1
        self.current_list[self.end_index] = x

    def pop(self):
        if self.isEmpty():
            raise IndexError("Queue underflow")
        element = self.current_list[self.start_index]
        self.start_index += 1
        return element

    def peek(self):
        if self.isEmpty():
            raise IndexError("Queue is empty")
        return self.current_list[self.start_index]

    def isEmpty(self):
        return self.start_index > self.end_index`}</Example>

        <Example
          title="Usage — Example 1"
          output={`None
None
None
5
5
False`}
        >{`q = ArrayQueue()
print(q.push(5))    # None
print(q.push(10))   # None
print(q.peek())     # 5   — front, not removed
print(q.pop())      # 5   — removed
print(q.isEmpty())  # False — 10 still in queue`}</Example>

        <Example
          title="Usage — Try it yourself"
          output={`None
1
True`}
        >{`q = ArrayQueue()
print(q.push(1))    # None
print(q.pop())      # 1
print(q.isEmpty())  # True — queue is now empty`}</Example>
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
                ['__init__', 'O(m)', 'Pre-allocates m = 100 elements. Effectively O(1) since m is a fixed constant.'],
                ['push', 'O(1)', 'Increment end_index, write one value.'],
                ['pop', 'O(1)', 'Read one value, increment start_index.'],
                ['peek', 'O(1)', 'Read one value at start_index.'],
                ['isEmpty', 'O(1)', 'Single comparison: start_index > end_index.'],
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
          <strong className="text-white">O(m)</strong> where m is <code className="font-mono text-sm">max_size</code>{' '}
          (100) for the pre-allocated backing array. This is a fixed constant overhead regardless of how many elements
          are in the queue at any point. Each individual operation uses O(1) auxiliary space.
        </p>

        <Callout variant="tip">
          This linear queue works perfectly within the given constraints (≤ 100 calls). For unbounded or
          high-throughput scenarios a <strong className="text-white">circular buffer</strong> (modular indexing) would
          reuse freed slots and avoid overflow after many push/pop cycles.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Two pointers: start_index (front) and end_index (rear) — both move only forward.',
          'isEmpty when start_index > end_index — no elements between the two pointers.',
          'push, pop, peek, isEmpty are all O(1) — no shifts or copies needed.',
          'Linear queue exhausts slots after max_size pops; use a circular buffer for reuse.',
        ]}
      />
    </LessonArticle>
  )
}
