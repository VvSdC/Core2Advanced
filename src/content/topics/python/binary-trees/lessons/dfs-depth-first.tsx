import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function DfsDepthFirst() {
  return (
    <LessonArticle>
      <Definition term="DFS — Depth-First Search">
        <p>
          <strong className="text-white">DFS</strong> explores a tree by going as <em>deep</em> as possible along
          one branch before backtracking to try siblings. You fully finish one subtree before moving to the next.
        </p>
        <p>
          BFS spreads level by level; DFS dives down a path first. Most tree recursion — height, path sums, LCA — is
          DFS at heart.
        </p>
      </Definition>

      <ContentStep number={1} title="The pattern">
        <Flowchart
          title="DFS on a tree"
          chart={`
flowchart TB
  A["Start at root"]
  B{"Node is None?"}
  C["Process / decide at this node"]
  D["DFS on left child"]
  E["DFS on right child"]
  F["Return"]

  A --> B
  B -->|Yes| F
  B -->|No| C
  C --> D
  D --> E
  E --> F
        `}
        />
        <p>
          The <em>order</em> you process the root vs its children defines preorder, inorder, and postorder — covered
          in the next lesson. DFS is the strategy; traversals are the naming.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Recursive DFS template">
        <Example
          title="dfs_visit"
          output={`3
9
20
15
7`}
          caption="Preorder-style visit — print value before recursing"
        >{`class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def dfs(node):
    if not node:
        return
    print(node.val)       # work at this node
    dfs(node.left)
    dfs(node.right)


root = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
dfs(root)`}</Example>
        <p>
          Base case: <code className="font-mono text-sm">node is None</code>. The call stack tracks the path — that
          is your implicit backtracking.
        </p>
      </ContentStep>

      <ContentStep number={3} title="Iterative DFS with a stack">
        <Example
          title="dfs_iterative"
          output={`3
9
20
15
7`}
        >{`def dfs_iterative(root):
    if not root:
        return
    stack = [root]
    while stack:
        node = stack.pop()
        print(node.val)
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)

dfs_iterative(root)`}</Example>
        <p>
          Push <strong className="text-white">right before left</strong> so left is popped first (stack is LIFO).
          Same visit order as recursive preorder.
        </p>
      </ContentStep>

      <ContentStep number={4} title="DFS vs BFS">
        <Callout variant="insight">
          Use <strong className="text-white">BFS</strong> when the answer depends on depth or shortest path (level
          order, minimum depth).
          <br />
          Use <strong className="text-white">DFS</strong> when you need full paths, subtree properties, or
          backtracking-style decisions (LCA, diameter, validate tree).
        </Callout>
        <p>
          Time <strong className="text-white">O(n)</strong> — every node visited once. Space{' '}
          <strong className="text-white">O(h)</strong> for stack/recursion depth (h = height).
        </p>
      </ContentStep>

      <KeyTakeaways
        items={[
          'DFS goes deep on one branch before backtracking.',
          'Recursive template: base case None, then work + recurse left + recurse right.',
          'Iterative DFS: explicit stack; push right before left for left-first order.',
          'O(n) time, O(h) space — skewed trees use O(n) stack depth.',
        ]}
      />
    </LessonArticle>
  )
}
