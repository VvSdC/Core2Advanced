import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../../components/content'

export function WhatIsLinkedList() {
  return (
    <LessonArticle>
      <Definition term="Linked List">
        <p>
          A <strong className="text-white">linked list</strong> is a linear data structure made of{' '}
          <strong className="text-white">nodes</strong>. Each node stores a value (<code className="font-mono text-sm">data</code>)
          and a reference to the next node (<code className="font-mono text-sm">next</code>). Unlike a Python list,
          elements are not stored in one contiguous block of memory — they are chained together by pointers.
        </p>
      </Definition>

      <ContentStep number={1} title="Node structure">
        <p>
          The building block is a node: data plus a pointer to the next node. The last node points to{' '}
          <code className="font-mono text-sm">None</code>.
        </p>
        <Example
          title="Visualizing nodes"
          output={`10 -> 20 -> 30 -> None`}
          caption="Three nodes chained together. The head is the first node; tail is the last."
        >{`# Conceptual representation (not a built-in Python type)
# Node 1: data=10, next -> Node 2
# Node 2: data=20, next -> Node 3
# Node 3: data=30, next -> None

# You traverse by following .next from the head:
# head -> 10 -> 20 -> 30 -> None`}</Example>
        <Callout variant="beginner">
          Think of a linked list as a treasure hunt: each node holds a clue (data) and the location of the next
          clue (next pointer). There is no central index — you must follow the chain.
        </Callout>
      </ContentStep>

      <ContentStep number={2} title="Linked list vs Python list">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-surface-600 bg-surface-800/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Feature</th>
                <th className="px-4 py-3 font-semibold">Python list (array)</th>
                <th className="px-4 py-3 font-semibold">Linked list</th>
              </tr>
            </thead>
            <tbody className="text-slate-400">
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Memory layout</td>
                <td className="px-4 py-3">Contiguous block</td>
                <td className="px-4 py-3">Scattered nodes + pointers</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Random access (index i)</td>
                <td className="px-4 py-3 font-mono">O(1)</td>
                <td className="px-4 py-3 font-mono">O(n) — must walk the chain</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Insert at head</td>
                <td className="px-4 py-3 font-mono">O(n) — shifts elements</td>
                <td className="px-4 py-3 font-mono">O(1) — update one pointer</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Insert at tail</td>
                <td className="px-4 py-3 font-mono">O(1)* amortized</td>
                <td className="px-4 py-3 font-mono">O(n) without tail pointer</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Search by value</td>
                <td className="px-4 py-3 font-mono">O(n)</td>
                <td className="px-4 py-3 font-mono">O(n)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-slate-500">* Python list append is O(1) amortized due to dynamic array resizing.</p>
      </ContentStep>

      <ContentStep number={3} title="When to use which">
        <Example
          title="Random access vs sequential access"
          output={`20
20`}
        >{`# Python list — O(1) index access
arr = [10, 20, 30]
print(arr[1])   # jump directly to index 1

# Linked list — must traverse from head
# To reach index 1, walk: head -> next -> data
# No arr[i] shortcut — you follow .next each step`}</Example>
        <Callout variant="insight">
          Use a Python list when you need frequent indexing or slicing. Use a linked list when you insert or
          delete at the head often, or when you want O(1) insertion without shifting elements — common in
          queues, LRU caches, and interview problems.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'A linked list node holds data and a next pointer; the last node points to None.',
          'No random access — reaching index i requires O(n) traversal from the head.',
          'Insert at head is O(1) because you only rewire one pointer.',
          'Python lists are dynamic arrays; linked lists trade indexing speed for flexible insertion.',
        ]}
      />
    </LessonArticle>
  )
}
