import {
  Callout,
  ContentStep,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function LinkedListQueueImplementation() {
  return (
    <LessonArticle>

      {/* ── Problem Statement ─────────────────────────────────────── */}
      <LessonSection title="Problem Statement">
        <p>
          Implement a First-In, First-Out (FIFO) queue using a singly linked list. The implemented queue must
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
            <pre className="mt-1 font-mono text-sm text-slate-300">{`["LinkedListQueue", "push", "push", "peek", "pop", "isEmpty"]
[[], [3], [7], [], [], []]`}</pre>
            <p className="mt-3 text-sm text-slate-300">
              <span className="font-semibold text-white">Output:</span>{' '}
              <code className="font-mono text-sm">[null, null, null, 3, 3, false]</code>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              After pushing 3 and 7, <code className="font-mono text-xs">peek()</code> returns the front (3),{' '}
              <code className="font-mono text-xs">pop()</code> removes and returns 3, and 7 remains — so the queue is not empty.
            </p>
          </div>

          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Example 2</p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Input:</span>
            </p>
            <pre className="mt-1 font-mono text-sm text-slate-300">{`["LinkedListQueue", "push", "pop", "isEmpty"]
[[], [2], [], []]`}</pre>
            <p className="mt-3 text-sm text-slate-300">
              <span className="font-semibold text-white">Output:</span>{' '}
              <code className="font-mono text-sm">[null, null, 2, true]</code>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Push 2, pop it immediately, and the queue becomes empty.
            </p>
          </div>

          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Try it yourself</p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Input:</span>
            </p>
            <pre className="mt-1 font-mono text-sm text-slate-300">{`["LinkedListQueue", "isEmpty"]
[[]]`}</pre>
            <p className="mt-3 text-sm text-slate-300">
              <span className="font-semibold text-white">Output:</span>{' '}
              <code className="font-mono text-sm">[null, true]</code>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              A freshly constructed queue has no nodes — <code className="font-mono text-xs">isEmpty()</code> returns{' '}
              <code className="font-mono text-xs">true</code>.
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
          Unlike a stack (which only needs a <code className="font-mono text-sm">head</code>), a queue needs{' '}
          <strong className="text-white">two pointers</strong>: one for the front (dequeue) and one for the rear (enqueue).
          Without a <code className="font-mono text-sm">tail</code> pointer, every <code className="font-mono text-sm">push</code>{' '}
          would require O(n) traversal to find the last node.
        </p>

        <ContentStep number={1} title="ListNode and internal state">
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li><code className="font-mono text-sm">head</code> — points to the front node (next to be popped). Starts as <code className="font-mono text-sm">None</code>.</li>
            <li><code className="font-mono text-sm">tail</code> — points to the last node (most recently pushed). Starts as <code className="font-mono text-sm">None</code>.</li>
          </ul>
        </ContentStep>

        <ContentStep number={2} title="push — enqueue at the tail">
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li>If the queue is empty (<code className="font-mono text-sm">head is None</code>), create the first node and set both <code className="font-mono text-sm">head</code> and <code className="font-mono text-sm">tail</code> to it.</li>
            <li>Otherwise, append a new node at <code className="font-mono text-sm">tail.next</code> and advance <code className="font-mono text-sm">tail</code>.</li>
          </ul>
          <Flowchart
            title="push(x) flow"
            chart={`flowchart TB
  A([push x]) --> B{head is None?}
  B -- yes --> C[head = tail = new ListNode x]
  B -- no --> D[tail.next = new ListNode x]
  D --> E[tail = tail.next]
  C --> F([done])
  E --> F`}
          />
        </ContentStep>

        <ContentStep number={3} title="pop — dequeue from the head">
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li>Save <code className="font-mono text-sm">head.data</code>.</li>
            <li>If <code className="font-mono text-sm">head == tail</code> (only one node), set both to <code className="font-mono text-sm">None</code>.</li>
            <li>Otherwise, move <code className="font-mono text-sm">head</code> to <code className="font-mono text-sm">head.next</code>.</li>
            <li>Return the saved value.</li>
          </ul>
          <Flowchart
            title="pop() flow"
            chart={`flowchart TB
  A([pop]) --> B{isEmpty?}
  B -- yes --> C([raise IndexError])
  B -- no --> D[first = head.data]
  D --> E{head == tail?}
  E -- yes --> F[head = tail = None]
  E -- no --> G[head = head.next]
  F --> H([return first])
  G --> H`}
          />
          <Callout variant="insight">
            The <code className="font-mono text-sm">head == tail</code> check is critical — without it, popping the
            last element leaves <code className="font-mono text-sm">tail</code> pointing to a detached node.
          </Callout>
        </ContentStep>

        <ContentStep number={4} title="Visual state after each operation">
          <Flowchart
            title="head and tail movement"
            chart={`flowchart TB
  A["Initial: head = tail = None"] --> B["push(3): head → [3] ← tail"]
  B --> C["push(7): head → [3] → [7] ← tail"]
  C --> D["peek() → 3: pointers unchanged"]
  D --> E["pop() → 3: head → [7] ← tail"]
  E --> F["isEmpty() → false"]`}
          />
        </ContentStep>
      </LessonSection>

      {/* ── Implementation ────────────────────────────────────────── */}
      <LessonSection title="Implementation">
        <Example title="ListNode + LinkedListQueue">{`class ListNode:
    def __init__(self, data):
        self.data = data
        self.next = None


class LinkedListQueue:
    def __init__(self):
        self.head = None
        self.tail = None

    def push(self, x):
        if self.head is None:
            self.head = ListNode(x)
            self.tail = self.head
        else:
            self.tail.next = ListNode(x)
            self.tail = self.tail.next

    def pop(self):
        if self.isEmpty():
            raise IndexError("Queue underflow")
        first_element = self.head.data
        if self.head == self.tail:
            self.head = None
            self.tail = None
        else:
            self.head = self.head.next
        return first_element

    def peek(self):
        if self.isEmpty():
            raise IndexError("Queue is empty")
        return self.head.data

    def isEmpty(self):
        return self.head is None`}</Example>

        <Example
          title="Usage — Example 1"
          output={`None
None
None
3
3
False`}
        >{`q = LinkedListQueue()
print(q.push(3))    # None
print(q.push(7))    # None
print(q.peek())     # 3   — front, not removed
print(q.pop())      # 3   — removed
print(q.isEmpty())  # False — 7 still in queue`}</Example>

        <Example
          title="Usage — Example 2"
          output={`None
2
True`}
        >{`q = LinkedListQueue()
print(q.push(2))    # None
print(q.pop())      # 2
print(q.isEmpty())  # True`}</Example>
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
                ['__init__', 'O(1)', 'Sets head and tail to None.'],
                ['push', 'O(1)', 'Append at tail — one node creation and one pointer write.'],
                ['pop', 'O(1)', 'Read head.data and advance head (or reset both pointers).'],
                ['peek', 'O(1)', 'Read head.data — no pointer change.'],
                ['isEmpty', 'O(1)', 'Single check: head is None.'],
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
          <strong className="text-white">O(n)</strong> where n is the number of elements currently in the queue.
          Each pushed element creates one <code className="font-mono text-sm">ListNode</code> with constant space.
          Memory grows only with actual usage — no pre-allocation waste.
        </p>

        <Callout variant="tip">
          The <code className="font-mono text-sm">tail</code> pointer is what makes <code className="font-mono text-sm">push</code>{' '}
          O(1). A single-pointer linked-list queue would need O(n) traversal on every enqueue.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Two pointers: head (front) and tail (rear) — both needed for O(1) push and pop.',
          'When popping the last node, reset both head and tail to None.',
          'push, pop, peek, isEmpty are all O(1) — no traversal of the list.',
          'Space is O(n) — one node per element, no fixed capacity limit.',
        ]}
      />
    </LessonArticle>
  )
}
