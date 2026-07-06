import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../../components/content'

export function LinkedListOperations() {
  return (
    <LessonArticle>
      <Definition term="Linked List Operations">
        <p>
          Core operations on a singly linked list: <strong className="text-white">insert</strong> at head or tail,{' '}
          <strong className="text-white">delete</strong> by value, <strong className="text-white">search</strong>{' '}
          for a value, and <strong className="text-white">traverse</strong> to visit every node. Each operation
          has a predictable time complexity based on whether you must walk the chain.
        </p>
      </Definition>

      <ContentStep number={1} title="Insert at head — O(1)">
        <Example
          title="Prepend a new node"
          output={`99 -> 10 -> 20 -> None`}
          caption="New node becomes head; its next points to the old head."
        >{`class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def insert_at_head(self, data):
        new_node = Node(data)
        new_node.next = self.head   # point new node to old head
        self.head = new_node        # update head

    def display(self):
        current = self.head
        while current:
            print(current.data, end=" -> ")
            current = current.next
        print("None")

ll = LinkedList()
ll.insert_at_head(20)
ll.insert_at_head(10)
ll.insert_at_head(99)
ll.display()`}</Example>
        <p>
          Only two pointer updates — no shifting. This is the linked list&apos;s biggest advantage over a
          Python list for front insertion.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Insert at tail — O(n) or O(1)">
        <Example
          title="Append with and without tail pointer"
          output={`10 -> 20 -> 30 -> None`}
        >{`class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
        self.tail = None

    def insert_at_tail(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            self.tail = new_node
        else:
            self.tail.next = new_node  # O(1) with tail pointer
            self.tail = new_node

    def display(self):
        current = self.head
        while current:
            print(current.data, end=" -> ")
            current = current.next
        print("None")

ll = LinkedList()
for val in [10, 20, 30]:
    ll.insert_at_tail(val)
ll.display()`}</Example>
        <Callout variant="beginner">
          Without a <code className="font-mono text-sm">tail</code> pointer, append is O(n) because you must
          walk to the last node every time.
        </Callout>
      </ContentStep>

      <ContentStep number={3} title="Search and traverse — O(n)">
        <Example
          title="Find a value"
          output={`True
False`}
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

    def search(self, target):
        current = self.head
        while current:
            if current.data == target:
                return True
            current = current.next
        return False

ll = LinkedList()
for val in [10, 20, 30]:
    ll.append(val)

print(ll.search(20))   # True
print(ll.search(99))   # False`}</Example>
        <p>
          Traversal visits each node once. Search is O(n) in the worst case — you may walk the entire list.
        </p>
      </ContentStep>

      <ContentStep number={4} title="Delete — O(n)">
        <Example
          title="Delete by value"
          output={`10 -> 30 -> None
False`}
          caption="Handle deleting the head as a special case — update head directly."
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

    def delete(self, target):
        if not self.head:
            return False

        # delete head
        if self.head.data == target:
            self.head = self.head.next
            return True

        current = self.head
        while current.next:
            if current.next.data == target:
                current.next = current.next.next  # skip the target node
                return True
            current = current.next
        return False

    def display(self):
        current = self.head
        while current:
            print(current.data, end=" -> ")
            current = current.next
        print("None")

ll = LinkedList()
for val in [10, 20, 30]:
    ll.append(val)

ll.delete(20)
ll.display()              # 10 -> 30 -> None
print(ll.delete(99))      # False — not found`}</Example>
      </ContentStep>

      <ContentStep number={5} title="Complexity summary">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-surface-600 bg-surface-800/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Operation</th>
                <th className="px-4 py-3 font-semibold">Time</th>
                <th className="px-4 py-3 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="text-slate-400">
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Insert at head</td>
                <td className="px-4 py-3 font-mono">O(1)</td>
                <td className="px-4 py-3">Rewire head pointer only</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Insert at tail</td>
                <td className="px-4 py-3 font-mono">O(1)*</td>
                <td className="px-4 py-3">* with tail pointer; O(n) without</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Search / traverse</td>
                <td className="px-4 py-3 font-mono">O(n)</td>
                <td className="px-4 py-3">Visit up to every node</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Delete by value</td>
                <td className="px-4 py-3 font-mono">O(n)</td>
                <td className="px-4 py-3">Find node + rewire previous .next</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Access index i</td>
                <td className="px-4 py-3 font-mono">O(n)</td>
                <td className="px-4 py-3">No random access</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Interview tip: always state whether you have a tail pointer — it changes append from O(n) to O(1).
          For delete, remember the head-is-target edge case.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Insert at head is O(1) — create node, set next to head, update head.',
          'Insert at tail is O(1) with a tail pointer, O(n) without one.',
          'Search, traverse, and delete are O(n) — you may visit every node.',
          'Delete the head as a special case before the general prev/next loop.',
        ]}
      />
    </LessonArticle>
  )
}
