import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../../components/content'

export function MiddleElementSlowFast() {
  return (
    <LessonArticle>
      <Definition term="Middle Element — Slow & Fast Pointers">
        <p>
          To find the <strong className="text-white">middle node</strong> of a singly linked list in one pass, use
          two pointers: <strong className="text-white">slow</strong> moves one step per iteration and{' '}
          <strong className="text-white">fast</strong> moves two. When fast reaches the end, slow sits at the middle.
        </p>
        <p>
          Same pointer technique as Floyd&apos;s cycle detection — different stopping condition. Runs in O(n) time
          with O(1) extra space.
        </p>
      </Definition>

      <ContentStep number={1} title="The flow">
        <Flowchart
          title="Slow and fast to the middle"
          chart={`
flowchart TB
  A["slow and fast at head"]
  B["Move slow 1 step"]
  C["Move fast 2 steps"]
  D{"fast is None or fast.next is None?"}
  E["slow is at middle"]
  F["Repeat"]

  A --> B
  B --> C
  C --> D
  D -->|No| F
  F --> B
  D -->|Yes| E
        `}
        />
        <p>
          By the time fast reaches the tail, slow has traveled half the distance — the middle of the list.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Odd vs even length">
        <Callout variant="info">
          <strong className="text-white">Odd length</strong> (e.g. 1→2→3): slow stops at the true middle node (2).
          <br />
          <strong className="text-white">Even length</strong> (e.g. 1→2→3→4): slow stops at the{' '}
          <em>second</em> middle node (3) — the one closer to the tail. This is the usual convention; say so in
          interviews if asked.
        </Callout>
      </ContentStep>

      <ContentStep number={3} title="Implementation">
        <Example
          title="find_middle"
          output={`2
3`}
        >{`class Node:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def find_middle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow


# Odd length: 1 -> 2 -> 3
a, b, c = Node(1), Node(2), Node(3)
a.next, b.next = b, c
print(find_middle(a).val)   # 2

# Even length: 1 -> 2 -> 3 -> 4
d, e, f, g = Node(1), Node(2), Node(3), Node(4)
d.next, e.next, f.next = e, f, g
print(find_middle(d).val)   # 3 (second middle)`}</Example>
      </ContentStep>

      <ContentStep number={4} title="Why it works">
        <p>
          When fast moves 2 steps and slow moves 1, fast reaches the end after roughly n/2 slow steps. Slow has
          covered half the list — the definition of middle for odd lengths.
        </p>
        <p>
          For even n, fast becomes <code className="font-mono text-sm">None</code> one step after passing the last
          node, so slow lands on the second of the two middle nodes.
        </p>
      </ContentStep>

      <ContentStep number={5} title="First middle for even length">
        <Example
          title="Optional variant — first middle when even"
          caption="Start fast at head.next so slow stops one step earlier."
        >{`def find_middle_first(head):
    if not head or not head.next:
        return head
    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow`}</Example>
      </ContentStep>

      <ContentStep number={6} title="Where this appears in interviews">
        <ul className="space-y-2 text-slate-300">
          <li>
            <strong className="text-white">Palindrome linked list</strong> — find middle, reverse second half,
            compare.
          </li>
          <li>
            <strong className="text-white">Merge sort on linked list</strong> — split at middle, recurse on both
            halves.
          </li>
          <li>
            <strong className="text-white">Reorder list</strong> — middle split is the first step.
          </li>
        </ul>
        <Callout variant="insight">
          Naive approach: count nodes (two passes) or convert to array — O(n) time but extra space or two
          traversals. Slow/fast is the one-pass O(1) space answer interviewers want.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Slow +1, fast +2 per loop — when fast hits end, slow is at middle.',
          'Even length: slow lands on second middle node (default).',
          'O(n) time, O(1) space — one pass, no counting.',
          'Building block for palindrome check and merge-sort on lists.',
        ]}
      />
    </LessonArticle>
  )
}
