import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function LowestCommonAncestor() {
  return (
    <LessonArticle>
      <Definition term="Lowest Common Ancestor (LCA)">
        <p>
          The <strong className="text-white">lowest common ancestor</strong> of nodes p and q is the deepest node
          that has <em>both</em> p and q in its subtree. A node counts as its own ancestor — if q lives under p,
          then p is the LCA.
        </p>
      </Definition>

      <ContentStep number={1} title="One question per node">
        <p>At every node, ask: <strong className="text-white">where are p and q?</strong></p>
        <ul className="list-disc space-y-2 pl-5 text-gray-300">
          <li>
            <strong className="text-white">Both in the left subtree</strong> → answer is on the left; keep searching
            left.
          </li>
          <li>
            <strong className="text-white">Both in the right subtree</strong> → answer is on the right.
          </li>
          <li>
            <strong className="text-white">Split across left and right</strong> (or one <em>is</em> this node) →{' '}
            <strong className="text-white">this node is the LCA</strong>.
          </li>
        </ul>
        <Flowchart
          title="Three outcomes at each node"
          chart={`
flowchart TB
  A["Check left subtree"]
  B["Check right subtree"]
  C{"Found in both?"}
  D["This node is LCA"]
  E["Return the side that found something"]

  A --> B
  B --> C
  C -->|Yes| D
  C -->|No| E
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="The code — 6 lines of logic">
        <Example
          title="lowest_common_ancestor"
          output={`20
3`}
        >{`class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def lowest_common_ancestor(root, p, q):
    # 1. Empty, or we reached p or q — report this node upward
    if not root or root is p or root is q:
        return root

    # 2. Ask each subtree
    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)

    # 3. p and q on different sides → root is where paths meet
    if left and right:
        return root

    # 4. Both on same side — pass that answer up (or None)
    return left or right


#       3
#      / \\
#     9  20
#        / \\
#       15  7
root = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
p, q = root.right.left, root.right.right   # 15 and 7

print(lowest_common_ancestor(root, p, q).val)          # 20
print(lowest_common_ancestor(root, root.left, root.right).val)  # 3`}</Example>
        <p>
          Line 1: if we hit p or q, stop and bubble that node up — the parent will decide if it is the LCA.
          Lines 2–3: if left and right both return a node, p and q split here. Line 4: otherwise return whichever
          side found something.
        </p>
      </ContentStep>

      <ContentStep number={3} title="Walk-through: LCA(15, 7)">
        <Example title="trace" caption="Calls bubble answers upward">{`At node 15:  root is p  → return 15
At node 7:   root is q  → return 7
At node 20:  left=15, right=7  → both found → return 20  ✓ LCA
At node 9:   left=None, right=None → return None
At node 3:   left=None, right=20 → return 20`}</Example>
        <p>
          Node 20 sees a match in <em>both</em> children — that is the split point. Node 3 only gets an answer from
          the right, so it passes 20 up unchanged.
        </p>
      </ContentStep>

      <ContentStep number={4} title="When one node is inside the other">
        <Callout variant="info">
          LCA(15, 20): at node 20, left returns 15 and right returns None. Only one side matches — return 20. Since a
          node is an ancestor of itself, 20 is correct even though 15 is in 20&apos;s subtree.
        </Callout>
      </ContentStep>

      <ContentStep number={5} title="Complexity">
        <p>
          <strong className="text-white">O(n)</strong> time in the worst case (skewed tree visits every node).{' '}
          <strong className="text-white">O(h)</strong> recursion space. On a BST you can do better with a simple
          walk — see the BST section.
        </p>
      </ContentStep>

      <KeyTakeaways
        items={[
          'LCA = deepest node whose subtree contains both p and q.',
          'Recurse left and right; if both return a node, current root is the LCA.',
          'Otherwise return left or right — whichever found something.',
          'Hitting p or q directly just reports that node upward; parent decides.',
        ]}
      />
    </LessonArticle>
  )
}
