import {
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function BstBasicImplementation() {
  return (
    <LessonArticle>
      <Definition term="BST — Basic Implementation">
        <p>
          A BST is just a <code className="font-mono text-sm">TreeNode</code> graph with the ordering rule enforced
          on every insert. A small wrapper class keeps the root and exposes methods like{' '}
          <code className="font-mono text-sm">search</code>, <code className="font-mono text-sm">insert</code>, and{' '}
          <code className="font-mono text-sm">delete</code>.
        </p>
      </Definition>

      <ContentStep number={1} title="TreeNode and BST shell">
        <Example
          title="BST class"
        >{`class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None


class BST:
    def __init__(self):
        self.root = None

    def inorder(self):
        """Left → root → right — sorted order on a valid BST."""
        result = []
        def walk(node):
            if not node:
                return
            walk(node.left)
            result.append(node.val)
            walk(node.right)
        walk(self.root)
        return result`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Building a BST by hand">
        <Example
          title="manual_build"
          output={`[2, 5, 8, 12, 15]`}
        >{`tree = BST()
tree.root = TreeNode(8)
tree.root.left = TreeNode(5)
tree.root.right = TreeNode(12)
tree.root.left.left = TreeNode(2)
tree.root.right.right = TreeNode(15)

print(tree.inorder())`}</Example>
        <p>
          Manual wiring is fine for tests. Real BSTs grow via <code className="font-mono text-sm">insert</code> — the
          next lessons add search, insert, and delete on top of this shell.
        </p>
      </ContentStep>

      <KeyTakeaways
        items={[
          'BST wraps a root TreeNode and enforces left < root < right.',
          'inorder() walks left → root → right and prints sorted values.',
          'Methods delegate to recursive helpers on self.root.',
        ]}
      />
    </LessonArticle>
  )
}
