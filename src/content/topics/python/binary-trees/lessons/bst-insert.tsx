import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function BstInsert() {
  return (
    <LessonArticle>
      <Definition term="Inserting into a BST">
        <p>
          Insert is search that <em>does not stop</em> at <code className="font-mono text-sm">None</code> — when you
          fall off the tree, attach the new node there. Same left/right comparisons as search.
        </p>
      </Definition>

      <ContentStep number={1} title="Find the empty slot">
        <Flowchart
          title="BST insert"
          chart={`
flowchart TB
  A["Walk like search"]
  B{"Reached None?"}
  C["Attach new node here"]
  D{"val < parent.val?"}
  E["Go left"]
  F["Go right"]

  A --> B
  B -->|Yes| C
  B -->|No| D
  D -->|Yes| E
  D -->|No| F
  E --> B
  F --> B
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Recursive insert">
        <Example
          title="insert"
          output={`[2, 5, 7, 8, 12, 15]`}
        >{`class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None


def insert(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root


def inorder(root):
    if not root:
        return []
    return inorder(root.left) + [root.val] + inorder(root.right)


root = None
for v in [8, 5, 12, 2, 15, 7]:
    root = insert(root, v)

print(inorder(root))`}</Example>
        <p>
          Each call returns the (possibly new) subtree root — the caller assigns it to{' '}
          <code className="font-mono text-sm">left</code> or <code className="font-mono text-sm">right</code>.
        </p>
      </ContentStep>

      <ContentStep number={3} title="On the BST class">
        <Example
          title="BST.insert"
        >{`class BST:
    def __init__(self):
        self.root = None

    def insert(self, val):
        self.root = insert(self.root, val)`}</Example>
        <Callout variant="insight">
          <strong className="text-white">O(h)</strong> time — same path as search. Inserting sorted input into a plain
          BST creates a skewed tree (O(n) ops) — balancing strategies (AVL, red-black) fix that in production
          structures.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Insert = search until None, then attach a new leaf.',
          'Recursive insert returns the updated subtree root.',
          'Always return root at the end so parent links stay correct.',
          'O(h) time per insert.',
        ]}
      />
    </LessonArticle>
  )
}
