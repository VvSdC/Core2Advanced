import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../../components/content'

export function FloydCycleDetection() {
  return (
    <LessonArticle>
      <Definition term="Floyd's Cycle Detection">
        <p>
          <strong className="text-white">Floyd&apos;s cycle-finding algorithm</strong> (the tortoise and hare)
          detects whether a linked list has a cycle — a node whose <code className="font-mono text-sm">next</code>{' '}
          pointer eventually leads back to a node already visited. It uses two pointers moving at different speeds.
        </p>
        <p>
          This is one of the most common linked-list interview questions. It runs in O(n) time with O(1) extra
          space — no hash set required.
        </p>
      </Definition>

      <ContentStep number={1} title="The flow">
        <Flowchart
          title="Tortoise and hare"
          chart={`
flowchart TB
  A["slow and fast at head"]
  B["Move slow 1 step"]
  C["Move fast 2 steps"]
  D{"fast is None or fast.next is None?"}
  E{"slow == fast?"}
  F["No cycle"]
  G["Cycle detected"]

  A --> B
  B --> C
  C --> D
  D -->|Yes| F
  D -->|No| E
  E -->|No| B
  E -->|Yes| G
        `}
        />
        <p>
          <strong className="text-white">Slow</strong> (tortoise) advances one node per loop.{' '}
          <strong className="text-white">Fast</strong> (hare) advances two. If there is a cycle, fast eventually
          laps slow and they meet inside the loop.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Detect a cycle">
        <Example
          title="has_cycle"
          output={`True
False`}
        >{`class Node:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False


# Build a cycle: 1 -> 2 -> 3 -> back to 2
a, b, c = Node(1), Node(2), Node(3)
a.next, b.next, c.next = b, c, b
print(has_cycle(a))

# No cycle
x, y = Node(1), Node(2)
x.next = y
print(has_cycle(x))`}</Example>
        <Callout variant="info">
          The loop condition <code className="font-mono text-sm">while fast and fast.next</code> prevents{' '}
          <code className="font-mono text-sm">AttributeError</code> when fast reaches the end of a list without a
          cycle.
        </Callout>
      </ContentStep>

      <ContentStep number={3} title="Why slow and fast must meet">
        <p>
          Inside a cycle, fast gains one node on slow every step. The gap shrinks by 1 each iteration. Eventually
          the gap becomes zero — they occupy the same node. If there is no cycle, fast hits{' '}
          <code className="font-mono text-sm">None</code> first and the loop stops.
        </p>
        <p>
          Compare with the hash-set approach: track visited nodes in a <code className="font-mono text-sm">set</code>{' '}
          — O(n) time but O(n) space. Floyd&apos;s is preferred when the interviewer asks for constant extra space.
        </p>
      </ContentStep>

      <ContentStep number={4} title="Find where the cycle starts">
        <p>
          Interview follow-up: return the node where the cycle begins (LeetCode 142). After slow and fast meet,
          reset one pointer to <code className="font-mono text-sm">head</code> and advance both one step at a time.
          The meeting point is the cycle entrance.
        </p>
        <Example
          title="cycle_start"
          output={`Node with val 2`}
        >{`def cycle_start(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            break
    else:
        return None

    slow = head
    while slow is not fast:
        slow = slow.next
        fast = fast.next
    return slow`}</Example>
        <Callout variant="insight">
          The math behind the second phase: let L be distance from head to cycle entry, C be cycle length. When they
          first meet, slow traveled L + m and fast traveled L + m + kC for some integer k. Since fast moves twice as
          far, 2(L + m) = L + m + kC → L + m = kC. So advancing both from head and meeting point by L steps lands
          on the cycle start.
        </Callout>
      </ContentStep>

      <ContentStep number={5} title="Complexity">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-surface-600 bg-surface-800/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Approach</th>
                <th className="px-4 py-3 font-semibold">Time</th>
                <th className="px-4 py-3 font-semibold">Space</th>
              </tr>
            </thead>
            <tbody className="text-slate-400">
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Hash set of visited nodes</td>
                <td className="px-4 py-3 font-mono">O(n)</td>
                <td className="px-4 py-3 font-mono">O(n)</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Floyd (tortoise & hare)</td>
                <td className="px-4 py-3 font-mono">O(n)</td>
                <td className="px-4 py-3 font-mono">O(1)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Slow moves 1 step, fast moves 2 — if they meet, a cycle exists.',
          'Stop when fast or fast.next is None — no cycle.',
          'Follow-up: reset slow to head, move both 1 step to find cycle start.',
          'O(n) time, O(1) space — beats hash-set solutions on space.',
        ]}
      />
    </LessonArticle>
  )
}
