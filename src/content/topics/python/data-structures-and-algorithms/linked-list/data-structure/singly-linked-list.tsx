import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../../components/content'

export function SinglyLinkedList() {
  return (
    <LessonArticle>
      <Definition term="Singly Linked List">
        <p>
          A <strong className="text-white">singly linked list</strong> is a chain of nodes where each node points
          only to the next. We track the <strong className="text-white">head</strong> (first node) and optionally
          the <strong className="text-white">tail</strong> (last node) inside a{' '}
          <code className="font-mono text-sm">LinkedList</code> wrapper class.
        </p>
      </Definition>

      <ContentStep number={1} title="The Node class">
        <Example
          title="Minimal Node"
          output={`10
None`}
        >{`class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

node = Node(10)
print(node.data)   # 10
print(node.next)   # None — no next node yet`}</Example>
        <p>
          <code className="font-mono text-sm">__init__</code> sets the value and initializes{' '}
          <code className="font-mono text-sm">next</code> to <code className="font-mono text-sm">None</code>.
          Every new node starts as a dead end until we link it into the chain.
        </p>
      </ContentStep>

      <ContentStep number={2} title="The LinkedList class">
        <Example
          title="Full implementation"
          output={`10 -> 20 -> 30 -> None
3`}
        >{`class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None
        self.tail = None
        self.size = 0

    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            self.tail = new_node
        else:
            self.tail.next = new_node
            self.tail = new_node
        self.size += 1

    def display(self):
        parts = []
        current = self.head
        while current:
            parts.append(str(current.data))
            current = current.next
        print(" -> ".join(parts) + " -> None")

    def __len__(self):
        return self.size


ll = LinkedList()
ll.append(10)
ll.append(20)
ll.append(30)
ll.display()
print(len(ll))`}</Example>
        <Callout variant="beginner">
          Keeping a <code className="font-mono text-sm">tail</code> pointer makes append O(1). Without it, every
          append would require walking to the last node — O(n).
        </Callout>
      </ContentStep>

      <ContentStep number={3} title="Building the chain step by step">
        <Example
          title="How append rewires pointers"
          output={`head -> 5 -> None
head -> 5 -> 15 -> None`}
          caption="After the first append, head and tail both point to the same node. The second append links tail.next to the new node."
        >{`class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
        self.tail = None

    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            self.tail = new_node
        else:
            self.tail.next = new_node
            self.tail = new_node

    def display(self):
        current = self.head
        while current:
            print(current.data, end=" -> ")
            current = current.next
        print("None")

ll = LinkedList()
ll.append(5)
ll.display()    # head -> 5 -> None

ll.append(15)
ll.display()    # head -> 5 -> 15 -> None`}</Example>
      </ContentStep>

      <ContentStep number={4} title="Traversing the list">
        <Example
          title="Walk with a current pointer"
          output={`10
20
30`}
        >{`class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node

ll = LinkedList()
for val in [10, 20, 30]:
    ll.append(val)

current = ll.head
while current:
    print(current.data)
    current = current.next`}</Example>
        <Callout variant="insight">
          Never modify <code className="font-mono text-sm">head</code> while traversing — use a separate{' '}
          <code className="font-mono text-sm">current</code> pointer. Losing the head reference means losing
          the entire list.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Node stores data and next; LinkedList stores head (and optionally tail).',
          'Keep a tail pointer for O(1) append at the end.',
          'Traverse with a current pointer — never advance head during iteration.',
          'An empty list has head = None and size = 0.',
        ]}
      />
    </LessonArticle>
  )
}
