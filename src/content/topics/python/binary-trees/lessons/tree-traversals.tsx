import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function TreeTraversals() {
  return (
    <LessonArticle>
      <Definition term="Tree Traversals">
        <p>
          A <strong className="text-white">traversal</strong> is the order in which you visit every node. All three
          classic orders use DFS — they differ only in <em>when you process the root</em> relative to its subtrees.
        </p>
      </Definition>

      <ContentStep number={1} title="The three orders">
        <Flowchart
          title="Root before, between, or after children"
          chart={`
flowchart TB
  P["Preorder — root, left, right"]
  I["Inorder — left, root, right"]
  O["Postorder — left, right, root"]

  P --> I
  I --> O
        `}
        />
        <p>
          On <code className="font-mono text-sm">3 / 9, 20 / 15, 7</code>:
        </p>
        <ul className="list-disc space-y-1 pl-5 text-gray-300">
          <li>Preorder: <code className="font-mono text-sm">[3, 9, 20, 15, 7]</code></li>
          <li>Inorder: <code className="font-mono text-sm">[9, 3, 15, 20, 7]</code></li>
          <li>Postorder: <code className="font-mono text-sm">[9, 15, 7, 20, 3]</code></li>
        </ul>
      </ContentStep>

      <ContentStep number={2} title="Recursive implementations">
        <Example
          title="traversals"
          output={`[3, 9, 20, 15, 7]
[9, 3, 15, 20, 7]
[9, 15, 7, 20, 3]`}
        >{`class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def preorder(root):
    if not root:
        return []
    return [root.val] + preorder(root.left) + preorder(root.right)


def inorder(root):
    if not root:
        return []
    return inorder(root.left) + [root.val] + inorder(root.right)


def postorder(root):
    if not root:
        return []
    return postorder(root.left) + postorder(root.right) + [root.val]


root = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
print(preorder(root))
print(inorder(root))
print(postorder(root))`}</Example>
        <p>
          Move the <code className="font-mono text-sm">[root.val]</code> line to the start, middle, or end of the
          return — that is the entire difference between the three orders.
        </p>
      </ContentStep>

      <ContentStep number={3} title="When each order helps">
        <Callout variant="insight">
          <strong className="text-white">Preorder</strong> — serialize/copy a tree, prefix expressions.
          <br />
          <strong className="text-white">Inorder</strong> — on a BST, values come out sorted (see BST section).
          <br />
          <strong className="text-white">Postorder</strong> — delete bottom-up, subtree sizes, postfix evaluation.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Preorder: root → left → right.',
          'Inorder: left → root → right (sorted on a BST).',
          'Postorder: left → right → root.',
          'Same DFS skeleton — only the position of root processing changes.',
        ]}
      />
    </LessonArticle>
  )
}
