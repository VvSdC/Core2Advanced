import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function Deques() {
  return (
    <LessonArticle>
      <Definition term="Deques (double-ended queues)">
        <p>
          A <strong className="text-white">deque</strong> (pronounced &quot;deck&quot;) supports efficient insert and
          delete at <em>both</em> ends. It generalizes stacks and queues — use it whenever you need O(1) operations
          on the front and back.
        </p>
        <p>
          Python&apos;s <code className="font-mono text-sm">collections.deque</code> is the standard tool. It is
          implemented as a block-linked list of fixed-size arrays — fast at both ends, not designed for random
          access in the middle.
        </p>
      </Definition>

      <ContentStep number={1} title="Operations at both ends">
        <Flowchart
          title="Four core deque operations"
          chart={`
flowchart TB
  A["append — add right"]
  B["appendleft — add left"]
  C["pop — remove right"]
  D["popleft — remove left"]

  A --> B
  B --> C
  C --> D
        `}
        />
        <p>All four are O(1) amortized.</p>
      </ContentStep>

      <ContentStep number={2} title="Stack, queue, and deque — one type">
        <Example
          title="Same deque, different patterns"
        >{`from collections import deque

# As a stack (LIFO) — right end only
stack = deque()
stack.append(1)
stack.append(2)
stack.pop()

# As a queue (FIFO) — append right, popleft left
queue = deque()
queue.append("first")
queue.append("second")
queue.popleft()

# True deque — work both ends
dq = deque([1, 2, 3])
dq.appendleft(0)
dq.append(4)
print(dq)   # deque([0, 1, 2, 3, 4])`}</Example>
      </ContentStep>

      <ContentStep number={3} title="maxlen — bounded deque">
        <Example
          title="Sliding window of last N items"
          output={`deque([3, 4, 5], maxlen=3)`}
        >{`from collections import deque

recent = deque(maxlen=3)
for x in [1, 2, 3, 4, 5]:
    recent.append(x)

print(recent)   # oldest dropped automatically`}</Example>
        <p>
          When full, <code className="font-mono text-sm">append</code> drops the leftmost item. Perfect for &quot;last
          k&quot; problems and fixed-size buffers.
        </p>
      </ContentStep>

      <ContentStep number={4} title="rotate">
        <Example
          title="Circular shift"
          output={`deque([3, 4, 1, 2])`}
        >{`from collections import deque

dq = deque([1, 2, 3, 4])
dq.rotate(2)    # move 2 items from right to left
print(dq)

dq.rotate(-1)   # move 1 item from left to right`}</Example>
      </ContentStep>

      <ContentStep number={5} title="When to use what">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-surface-600 bg-surface-800/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Need</th>
                <th className="px-4 py-3 font-semibold">Use</th>
              </tr>
            </thead>
            <tbody className="text-slate-400">
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">LIFO only (one end)</td>
                <td className="px-4 py-3 font-mono">list or deque + append/pop</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">FIFO (queue)</td>
                <td className="px-4 py-3 font-mono">deque + append/popleft</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Both ends, sliding window</td>
                <td className="px-4 py-3 font-mono">deque</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Thread-safe producer/consumer</td>
                <td className="px-4 py-3 font-mono">queue.Queue</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ContentStep>

      <ContentStep number={6} title="Interview patterns">
        <ul className="space-y-2 text-slate-300">
          <li><strong className="text-white">Sliding window maximum</strong> — deque stores indices, maintain decreasing order</li>
          <li><strong className="text-white">Palindrome checker</strong> — compare deque popleft vs pop</li>
          <li><strong className="text-white">0-1 BFS</strong> — deque with appendleft for priority 0 edges</li>
        </ul>
        <Callout variant="info">
          Indexing <code className="font-mono text-sm">dq[i]</code> works but is O(n) in the middle — deques are for
          ends, not random access. Use a list if you need frequent indexing.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'deque = double-ended queue — O(1) append, appendleft, pop, popleft.',
          'Use deque for queues; list only for stacks (or deque works for both).',
          'maxlen=N auto-drops oldest items — great for sliding windows.',
          'rotate(n) circularly shifts elements in place.',
        ]}
      />
    </LessonArticle>
  )
}
