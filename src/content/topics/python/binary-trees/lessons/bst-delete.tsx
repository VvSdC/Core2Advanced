import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function BstDelete() {
  return (
    <LessonArticle>
      <Definition term="Deleting from a BST">
        <p>
          Delete is the hardest BST operation. Find the target node, then handle three cases:{' '}
          <strong className="text-white">no children</strong> (leaf),{' '}
          <strong className="text-white">one child</strong>, or <strong className="text-white">two children</strong>.
        </p>
      </Definition>

      <ContentStep number={1} title="Three cases">
        <Flowchart
          title="Delete cases"
          chart={`
flowchart TB
  A["Find node with target val"]
  B{"How many children?"}
  C["0 — remove node, return None"]
  D["1 — return the non-null child"]
  E["2 — replace with inorder successor"]
  F["Delete successor from right subtree"]

  A --> B
  B -->|Leaf| C
  B -->|One child| D
  B -->|Two children| E
  E --> F
        `}
        />
        <p>
          For two children, copy the <strong className="text-white">inorder successor</strong> (smallest value in the
          right subtree) into the node, then delete that successor from the right subtree.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Helper: minimum in subtree">
        <Example
          title="min_value_node"
        >{`def min_value_node(node):
    current = node
    while current.left:
        current = current.left
    return current`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Full delete">
        <Example
          title="delete"
          output={`[2, 5, 12, 15]`}
          caption="Delete 8 (root, two children) — successor 12 replaces it"
        >{`class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None


def min_value_node(node):
    while node.left:
        node = node.left
    return node


def delete(root, val):
    if not root:
        return None

    if val < root.val:
        root.left = delete(root.left, val)
    elif val > root.val:
        root.right = delete(root.right, val)
    else:
        # Found the node to delete
        if not root.left:
            return root.right          # 0 or 1 child (right only)
        if not root.right:
            return root.left           # 1 child (left only)

        # Two children — successor is min of right subtree
        successor = min_value_node(root.right)
        root.val = successor.val
        root.right = delete(root.right, successor.val)

    return root


def inorder(root):
    if not root:
        return []
    return inorder(root.left) + [root.val] + inorder(root.right)


root = TreeNode(8)
root.left = TreeNode(5, TreeNode(2))
root.right = TreeNode(12, None, TreeNode(15))

root = delete(root, 8)
print(inorder(root))`}</Example>
      </ContentStep>

      <ContentStep number={4} title="Why the successor trick works">
        <Callout variant="insight">
          The inorder successor (next larger value) is always in the right subtree with <em>no left children</em> —
          so deleting it reduces to the easy 0-or-1-child case. Copying its value into the target node preserves BST
          order without rewiring both subtrees.
        </Callout>
        <p>
          <strong className="text-white">O(h)</strong> time — search plus at most one extra walk for the successor.
        </p>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Leaf: return None. One child: return that child.',
          'Two children: copy inorder successor value, delete successor from right.',
          'Successor = leftmost node in right subtree.',
          'O(h) time — the most complex BST operation.',
        ]}
      />
    </LessonArticle>
  )
}
