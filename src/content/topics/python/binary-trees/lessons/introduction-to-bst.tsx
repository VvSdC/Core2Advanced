import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function IntroductionToBst() {
  return (
    <LessonArticle>
      <Definition term="Binary Search Tree (BST)">
        <p>
          A <strong className="text-white">binary search tree</strong> is a binary tree with an ordering rule: every
          node&apos;s left subtree holds <em>smaller</em> values, and every right subtree holds <em>larger</em>{' '}
          values. Typically: <strong className="text-white">left &lt; root &lt; right</strong>.
        </p>
        <p>
          That ordering lets you search, insert, and delete by comparing values — no need to scan every node.
        </p>
      </Definition>

      <ContentStep number={1} title="The ordering rule">
        <Flowchart
          title="BST property at every node"
          chart={`
flowchart TB
  R["Root value = 8"]
  L["All left descendants < 8"]
  G["All right descendants > 8"]

  R --> L
  R --> G
        `}
        />
        <Example
          title="valid_bst"
          caption="Inorder traversal prints sorted values: 2, 5, 8, 12, 15"
        >{`#        8
#       / \\
#      5  12
#     /    \\
#    2     15`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Why BSTs matter">
        <p>
          A balanced BST gives <strong className="text-white">O(log n)</strong> search, insert, and delete. A skewed
          BST (like a linked list) degrades to <strong className="text-white">O(n)</strong>. Python&apos;s{' '}
          <code className="font-mono text-sm">sortedcontainers</code> and many databases use tree-like structures for
          this reason.
        </p>
        <Callout variant="info">
          We assume <strong className="text-white">no duplicate values</strong> in these lessons. Duplicates can go
          left-only or right-only — pick one rule and stay consistent.
        </Callout>
      </ContentStep>

      <ContentStep number={3} title="What comes next">
        <p>Lessons build in order of complexity:</p>
        <ol className="list-decimal space-y-1 pl-5 text-gray-300">
          <li>Basic BST class — structure and construction</li>
          <li>Search — walk left or right by comparison</li>
          <li>Insert — find the empty spot and attach</li>
          <li>Delete — the hardest case (two children)</li>
        </ol>
      </ContentStep>

      <KeyTakeaways
        items={[
          'BST: left < root < right at every node.',
          'Inorder traversal of a BST yields sorted values.',
          'Balanced → O(log n) ops; skewed → O(n).',
          'Search is simplest; delete is the most involved operation.',
        ]}
      />
    </LessonArticle>
  )
}
