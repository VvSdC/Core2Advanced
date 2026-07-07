import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function IntroductionToBinaryTrees() {
  return (
    <LessonArticle>
      <Definition term="Binary Tree">
        <p>
          A <strong className="text-white">binary tree</strong> is a tree where each node has at most two children —
          usually called <strong className="text-white">left</strong> and <strong className="text-white">right</strong>.
          Unlike a Python list, nodes are linked by references, not contiguous indices.
        </p>
        <p>
          A <strong className="text-white">binary search tree (BST)</strong> adds an ordering rule (left &lt; root &lt;
          right). See the <strong className="text-white">Binary Search Tree</strong> section in the sidebar for search,
          insert, and delete.
        </p>
      </Definition>

      <ContentStep number={1} title="TreeNode in Python">
        <Example
          title="TreeNode"
        >{`class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right`}</Example>
        <p>
          Each node stores a value and optional pointers to child nodes.{' '}
          <code className="font-mono text-sm">None</code> means no child — a missing branch, not an empty node.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Terminology">
        <Flowchart
          title="Parts of a binary tree"
          chart={`
flowchart TB
  R["Root — top node, no parent"]
  I["Internal node — has at least one child"]
  L["Leaf — no children"]
  D["Depth — edges from root to node"]
  H["Height — longest root-to-leaf path"]

  R --> I
  I --> L
  R --> D
  R --> H
        `}
        />
        <Callout variant="info">
          <strong className="text-white">Depth</strong> counts edges from root (root depth = 0).{' '}
          <strong className="text-white">Height</strong> is the maximum depth of any leaf. A single-node tree has
          height 0.
        </Callout>
      </ContentStep>

      <ContentStep number={3} title="Building a small tree">
        <Example
          title="build_tree"
          caption="Tree: 3 at root, left subtree 9, right subtree 20 → 15, 7"
        >{`#       3
#      / \\
#     9  20
#        / \\
#       15  7

root = TreeNode(3)
root.left = TreeNode(9)
root.right = TreeNode(20)
root.right.left = TreeNode(15)
root.right.right = TreeNode(7)`}</Example>
        <p>
          You can also build trees from level-order arrays (with <code className="font-mono text-sm">None</code>{' '}
          placeholders) — common in LeetCode-style problems. For learning traversals, explicit wiring like above is
          clearest.
        </p>
      </ContentStep>

      <ContentStep number={4} title="Why trees matter">
        <p>
          Binary trees model hierarchies: file systems, DOM trees, expression parsing, decision trees, and heap-backed
          priority queues. Most tree interview questions reduce to{' '}
          <strong className="text-white">BFS</strong> (level by level),{' '}
          <strong className="text-white">DFS</strong> (go deep first), or{' '}
          <strong className="text-white">recursion on subtrees</strong> (like LCA).
        </p>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Each TreeNode has val, left, and right — children are TreeNode or None.',
          'Root has no parent; leaves have no children.',
          'Depth = edges from root; height = max depth of any leaf.',
          'General binary tree ≠ BST — ordering is only required in a BST.',
        ]}
      />
    </LessonArticle>
  )
}
