import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function Queues() {
  return (
    <LessonArticle>
      <Definition term="Queues">
        <p>
          A <strong className="text-white">queue</strong> is First-In, First-Out (FIFO) — the first item enqueued is
          the first dequeued. Like a line at a ticket counter: join at the back, leave from the front.
        </p>
        <p>
          Do <em>not</em> use <code className="font-mono text-sm">list.pop(0)</code> for queues — it is O(n) because
          every remaining element shifts. Use <code className="font-mono text-sm">collections.deque</code> instead.
        </p>
      </Definition>

      <ContentStep number={1} title="The flow">
        <Flowchart
          title="FIFO operations"
          chart={`
flowchart TB
  A["enqueue(item) — add at back"]
  B["queue grows"]
  C["dequeue() — remove from front"]
  D["returns oldest item"]

  A --> B
  B --> C
  C --> D
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="deque as a queue">
        <Example
          title="append + popleft"
          output={`Ada
2`}
        >{`from collections import deque

queue = deque()

queue.append("Ada")      # enqueue at back
queue.append("Grace")
queue.append("Lin")

print(queue.popleft())   # dequeue from front — "Ada"
print(len(queue))`}</Example>
        <p>
          <code className="font-mono text-sm">append</code> and <code className="font-mono text-sm">popleft</code> are
          both <strong className="text-white">O(1)</strong> on a deque.
        </p>
      </ContentStep>

      <ContentStep number={3} title="Why list.pop(0) is slow">
        <Callout variant="insight">
          <code className="font-mono text-sm">list.pop(0)</code> removes index 0 and shifts every other element left
          — O(n) per dequeue. For 100,000 items, each dequeue scans the whole list. A deque uses a doubly-linked
          block structure so both ends are constant time.
        </Callout>
        <Example
          title="Anti-pattern vs correct"
        >{`# Slow — O(n) per dequeue
q = [1, 2, 3]
q.pop(0)

# Fast — O(1) per dequeue
from collections import deque
q = deque([1, 2, 3])
q.popleft()`}</Example>
      </ContentStep>

      <ContentStep number={4} title="queue.Queue for threading">
        <Example
          title="Thread-safe FIFO (I/O-bound workers)"
          caption="For multi-threaded producer/consumer — not needed for single-threaded BFS."
        >{`from queue import Queue

q = Queue()
q.put("job-1")
q.put("job-2")

print(q.get())   # blocks until item available
print(q.get())`}</Example>
        <p>
          <code className="font-mono text-sm">queue.Queue</code> adds locking for thread safety. For algorithms
          (BFS, level-order traversal), <code className="font-mono text-sm">collections.deque</code> is simpler and
          faster on a single thread.
        </p>
      </ContentStep>

      <ContentStep number={5} title="BFS pattern">
        <Example
          title="Breadth-first search skeleton"
        >{`from collections import deque

def bfs(start, neighbors):
    seen = {start}
    queue = deque([start])

    while queue:
        node = queue.popleft()
        for nxt in neighbors(node):
            if nxt not in seen:
                seen.add(nxt)
                queue.append(nxt)`}</Example>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Queue = FIFO — first in, first out.',
          'Use deque: append() to enqueue, popleft() to dequeue — both O(1).',
          'Never use list.pop(0) for queues — O(n) per operation.',
          'queue.Queue is for thread-safe work queues; deque for algorithms like BFS.',
        ]}
      />
    </LessonArticle>
  )
}
