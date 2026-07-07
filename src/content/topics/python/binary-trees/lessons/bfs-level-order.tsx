import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function BfsLevelOrder() {
  return (
    <LessonArticle>
      <Definition term="BFS — Breadth-First Search">
        <p>
          <strong className="text-white">BFS</strong> on a tree visits nodes <em>level by level</em> — all nodes at
          depth d before any node at depth d + 1. On a binary tree this is called{' '}
          <strong className="text-white">level-order traversal</strong>.
        </p>
        <p>
          Use a <strong className="text-white">queue</strong> (FIFO): enqueue children left to right, dequeue from
          the front. Same queue pattern as graph BFS, but no visited set — each node has one parent in a tree.
        </p>
      </Definition>

      <ContentStep number={1} title="The flow">
        <Flowchart
          title="Level-order with a queue"
          chart={`
flowchart TB
  A["Enqueue root"]
  B{"Queue empty?"}
  C["Dequeue node"]
  D["Process node value"]
  E["Enqueue left child if present"]
  F["Enqueue right child if present"]
  G["Done"]

  A --> B
  B -->|No| C
  C --> D
  D --> E
  E --> F
  F --> B
  B -->|Yes| G
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Flat level-order">
        <Example
          title="level_order"
          output={`[3, 9, 20, 15, 7]`}
        >{`from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def level_order(root):
    if not root:
        return []
    result = []
    q = deque([root])
    while q:
        node = q.popleft()
        result.append(node.val)
        if node.left:
            q.append(node.left)
        if node.right:
            q.append(node.right)
    return result


#       3
#      / \\
#     9  20
#        / \\
#       15  7
root = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
print(level_order(root))`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Grouped by level">
        <Example
          title="level_order_grouped"
          output={`[[3], [9, 20], [15, 7]]`}
        >{`def level_order_grouped(root):
    if not root:
        return []
    result = []
    q = deque([root])
    while q:
        level_size = len(q)
        level = []
        for _ in range(level_size):
            node = q.popleft()
            level.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
        result.append(level)
    return result

print(level_order_grouped(root))`}</Example>
        <p>
          Snapshot <code className="font-mono text-sm">len(q)</code> at the start of each iteration — that is how
          many nodes belong to the current level before children are enqueued.
        </p>
      </ContentStep>

      <ContentStep number={4} title="Complexity and when to use BFS">
        <Callout variant="insight">
          Time <strong className="text-white">O(n)</strong> — every node enqueued and dequeued once. Space{' '}
          <strong className="text-white">O(w)</strong> where w is maximum width (often the last level). Use BFS when
          the answer depends on <em>depth</em> or <em>shortest path in an unweighted tree</em> (e.g. minimum depth,
          nodes at distance k).
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'BFS on trees = level-order traversal with a deque.',
          'Enqueue left then right; dequeue with popleft — both O(1).',
          'Group levels by processing len(q) nodes per iteration.',
          'O(n) time, O(w) space — w = max level width.',
        ]}
      />
    </LessonArticle>
  )
}
