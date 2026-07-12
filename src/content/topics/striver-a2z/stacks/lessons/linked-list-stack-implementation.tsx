import {
  Callout,
  ContentStep,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function LinkedListStackImplementation() {
  return (
    <LessonArticle>

      {/* ── Problem Statement ─────────────────────────────────────── */}
      <LessonSection title="Problem Statement">
        <p>
          Implement a Last-In, First-Out (LIFO) stack using a singly linked list. The implemented stack must
          support the following operations:
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-300">
          <li><code className="font-mono text-sm">push(x)</code> — Push element <code className="font-mono text-sm">x</code> onto the stack.</li>
          <li><code className="font-mono text-sm">pop()</code> — Remove and return the top element of the stack.</li>
          <li><code className="font-mono text-sm">top()</code> — Return the top element without removing it.</li>
          <li><code className="font-mono text-sm">isEmpty()</code> — Return <code className="font-mono text-sm">True</code> if the stack is empty, <code className="font-mono text-sm">False</code> otherwise.</li>
        </ul>

        <div className="mt-4 space-y-4">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Example 1</p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Input:</span>
            </p>
            <pre className="mt-1 font-mono text-sm text-slate-300">{`["LinkedListStack", "push", "push", "pop", "top", "isEmpty"]
[[], [3], [7], [], [], []]`}</pre>
            <p className="mt-3 text-sm text-slate-300">
              <span className="font-semibold text-white">Output:</span>{' '}
              <code className="font-mono text-sm">[null, null, null, 7, 3, false]</code>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              After pushing 3 and 7, the top is 7. <code className="font-mono text-xs">pop()</code> removes 7,
              leaving 3 on top. The stack is not empty.
            </p>
          </div>

          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Example 2</p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Input:</span>
            </p>
            <pre className="mt-1 font-mono text-sm text-slate-300">{`["LinkedListStack", "isEmpty"]
[[]]`}</pre>
            <p className="mt-3 text-sm text-slate-300">
              <span className="font-semibold text-white">Output:</span>{' '}
              <code className="font-mono text-sm">[null, true]</code>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              A freshly constructed stack has no nodes — it is empty.
            </p>
          </div>

          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Try it yourself</p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Input:</span>
            </p>
            <pre className="mt-1 font-mono text-sm text-slate-300">{`["LinkedListStack", "push", "pop", "isEmpty"]
[[], [2], [], []]`}</pre>
            <p className="mt-3 text-sm text-slate-300">
              <span className="font-semibold text-white">Output:</span>{' '}
              <code className="font-mono text-sm">[null, null, 2, true]</code>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Push 2, pop it immediately, and the stack becomes empty — so{' '}
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
          <li><code className="font-mono text-sm">pop()</code> and <code className="font-mono text-sm">top()</code> are only called on a non-empty stack in valid test cases.</li>
        </ul>
      </LessonSection>

      {/* ── Approach ──────────────────────────────────────────────── */}
      <LessonSection title="Approach">
        <p>
          Use a singly linked list where the <strong className="text-white">head pointer always points to the top</strong>{' '}
          of the stack. Every operation touches only the head node — no traversal needed.
        </p>

        <ContentStep number={1} title="ListNode and internal state">
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li><code className="font-mono text-sm">ListNode</code> — stores <code className="font-mono text-sm">data</code> and a <code className="font-mono text-sm">next</code> pointer.</li>
            <li><code className="font-mono text-sm">head</code> — points to the top node. Starts as <code className="font-mono text-sm">None</code> (empty stack).</li>
          </ul>
        </ContentStep>

        <ContentStep number={2} title="push — insert at the head">
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li>Create a new node with value <code className="font-mono text-sm">x</code>.</li>
            <li>Set <code className="font-mono text-sm">new_node.next = head</code> — link it to the current top.</li>
            <li>Set <code className="font-mono text-sm">head = new_node</code> — the new node becomes the top.</li>
          </ul>
          <Flowchart
            title="push(x) flow"
            chart={`flowchart TB
  A([push x]) --> B[create new_node with data = x]
  B --> C[new_node.next = head]
  C --> D[head = new_node]
  D --> E([done])`}
          />
          <Callout variant="insight">
            Pushing at the head is O(1) — the same reason we never append at the tail for a stack.
          </Callout>
        </ContentStep>

        <ContentStep number={3} title="pop — remove the head">
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li>Save <code className="font-mono text-sm">head.data</code> into a variable.</li>
            <li>Move <code className="font-mono text-sm">head</code> to <code className="font-mono text-sm">head.next</code>.</li>
            <li>Return the saved value. Python's garbage collector reclaims the old node.</li>
          </ul>
          <Flowchart
            title="pop() flow"
            chart={`flowchart TB
  A([pop]) --> B{isEmpty?}
  B -- yes --> C([raise IndexError])
  B -- no --> D[top = head.data]
  D --> E[head = head.next]
  E --> F([return top])`}
          />
        </ContentStep>

        <ContentStep number={4} title="Visual state after each operation">
          <Flowchart
            title="head pointer movement"
            chart={`flowchart TB
  A["Initial: head = None → empty"] --> B["push(3): head → [3]"]
  B --> C["push(7): head → [7] → [3]"]
  C --> D["pop() → 7: head → [3]"]
  D --> E["top() → 3: head still → [3]"]`}
          />
        </ContentStep>
      </LessonSection>

      {/* ── Implementation ────────────────────────────────────────── */}
      <LessonSection title="Implementation">
        <Example title="ListNode + LinkedListStack">{`class ListNode:
    def __init__(self, data):
        self.data = data
        self.next = None


class LinkedListStack:
    def __init__(self):
        self.head = None

    def push(self, x):
        new_node = ListNode(x)
        new_node.next = self.head
        self.head = new_node

    def pop(self):
        if self.isEmpty():
            raise IndexError("Stack underflow")
        top_element = self.head.data
        self.head = self.head.next
        return top_element

    def top(self):
        if self.isEmpty():
            raise IndexError("Stack is empty")
        return self.head.data

    def isEmpty(self):
        return self.head is None`}</Example>

        <Example
          title="Usage — Example 1"
          output={`None
None
None
7
3
False`}
        >{`s = LinkedListStack()
print(s.push(3))    # None
print(s.push(7))    # None
print(s.pop())      # 7   — top removed
print(s.top())      # 3   — peek, not removed
print(s.isEmpty())  # False`}</Example>

        <Example
          title="Usage — Try it yourself"
          output={`None
2
True`}
        >{`s = LinkedListStack()
print(s.push(2))    # None
print(s.pop())      # 2
print(s.isEmpty())  # True`}</Example>
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
                ['__init__', 'O(1)', 'Sets head to None — no nodes created yet.'],
                ['push', 'O(1)', 'Create one node and reassign two pointers.'],
                ['pop', 'O(1)', 'Read head.data and move head to head.next.'],
                ['top', 'O(1)', 'Read head.data — no pointer change.'],
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
          <strong className="text-white">O(n)</strong> where n is the number of elements currently in the stack.
          Each pushed element creates one <code className="font-mono text-sm">ListNode</code> with constant space.
          Unlike an array-based stack, there is no fixed pre-allocation — memory grows only with actual usage.
        </p>

        <Callout variant="tip">
          Linked-list stacks have <strong className="text-white">no overflow limit</strong> (unlike a fixed-size array)
          and never waste pre-allocated slots. The trade-off is extra pointer memory per node and no cache locality.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'head always points to the top — push inserts at head, pop removes head.',
          'All four operations are O(1) — no traversal of the list.',
          'Space is O(n) — one node per element, no wasted pre-allocation.',
          'No overflow limit unlike array stacks; memory grows with each push.',
        ]}
      />
    </LessonArticle>
  )
}
