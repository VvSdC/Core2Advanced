import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function BstSearch() {
  return (
    <LessonArticle>
      <Definition term="Searching in a BST">
        <p>
          To find a value, compare it with the current node: go <strong className="text-white">left</strong> if
          smaller, <strong className="text-white">right</strong> if larger. Stop when you find it or hit{' '}
          <code className="font-mono text-sm">None</code>.
        </p>
      </Definition>

      <ContentStep number={1} title="The walk">
        <Flowchart
          title="BST search"
          chart={`
flowchart TB
  A["Start at root"]
  B{"node is None or node.val == target?"}
  C["Found — return node"]
  D{"target < node.val?"}
  E["Go left"]
  F["Go right"]
  G["Not found — return None"]

  A --> B
  B -->|Found| C
  B -->|Empty| G
  B -->|Keep going| D
  D -->|Yes| E
  D -->|No| F
  E --> B
  F --> B
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Recursive search">
        <Example
          title="search"
          output={`True
False`}
        >{`class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None


def search(root, target):
    if not root or root.val == target:
        return root
    if target < root.val:
        return search(root.left, target)
    return search(root.right, target)


root = TreeNode(8, TreeNode(5, TreeNode(2)), TreeNode(12, None, TreeNode(15)))
print(search(root, 12) is not None)   # True
print(search(root, 99) is not None)   # False`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Iterative search">
        <Example
          title="search_iterative"
          output={`5
None`}
        >{`def search_iterative(root, target):
    while root:
        if root.val == target:
            return root
        root = root.left if target < root.val else root.right
    return None

print(search_iterative(root, 5).val)
print(search_iterative(root, 99))`}</Example>
        <Callout variant="insight">
          <strong className="text-white">O(h)</strong> time — one comparison per level. Balanced tree → O(log n);
          skewed → O(n). <strong className="text-white">O(1)</strong> extra space iteratively.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Compare target with node.val — go left if smaller, right if larger.',
          'Base case: None (not found) or val matches (found).',
          'Iterative version uses a while loop — O(1) extra space.',
          'O(h) time per search.',
        ]}
      />
    </LessonArticle>
  )
}
