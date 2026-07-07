import type { SubTopic } from '../../../types'
import { BfsLevelOrder } from './lessons/bfs-level-order'
import { BstBasicImplementation } from './lessons/bst-basic-implementation'
import { BstDelete } from './lessons/bst-delete'
import { BstInsert } from './lessons/bst-insert'
import { BstSearch } from './lessons/bst-search'
import { DfsDepthFirst } from './lessons/dfs-depth-first'
import { IntroductionToBinaryTrees } from './lessons/introduction-to-binary-trees'
import { IntroductionToBst } from './lessons/introduction-to-bst'
import { LowestCommonAncestor } from './lessons/lowest-common-ancestor'
import { TreeTraversals } from './lessons/tree-traversals'

export const binaryTreesSubTopic: SubTopic = {
  id: 'binary-trees',
  title: 'Binary Trees',
  description: 'TreeNode basics, BFS/DFS, traversals, LCA, and binary search trees.',
  lessonSections: [
    {
      id: 'data-structure',
      title: 'Data Structure',
      lessons: [
        {
          id: 'introduction-to-binary-trees',
          title: 'Introduction to Binary Trees',
          description: 'TreeNode, terminology, and building a small tree in Python.',
          readTime: '10 min',
          component: IntroductionToBinaryTrees,
        },
      ],
    },
    {
      id: 'algorithms',
      title: 'Algorithms',
      lessons: [
        {
          id: 'bfs-level-order',
          title: 'BFS — Level Order',
          description: 'Breadth-first traversal with a queue — level by level.',
          readTime: '11 min',
          component: BfsLevelOrder,
        },
        {
          id: 'dfs-depth-first',
          title: 'DFS — Depth-First Search',
          description: 'Go deep before backtracking — recursive and iterative patterns.',
          readTime: '10 min',
          component: DfsDepthFirst,
        },
        {
          id: 'tree-traversals',
          title: 'Tree Traversals',
          description: 'Preorder, inorder, and postorder — when to process the root.',
          readTime: '10 min',
          component: TreeTraversals,
        },
        {
          id: 'lowest-common-ancestor',
          title: 'Lowest Common Ancestor',
          description: 'Find where paths to p and q meet — simple recursive split logic.',
          readTime: '11 min',
          component: LowestCommonAncestor,
        },
      ],
    },
    {
      id: 'binary-search-tree',
      title: 'Binary Search Tree',
      lessons: [
        {
          id: 'introduction-to-bst',
          title: 'Introduction to BST',
          description: 'The left < root < right rule and why it enables fast lookup.',
          readTime: '9 min',
          component: IntroductionToBst,
        },
        {
          id: 'bst-basic-implementation',
          title: 'BST — Basic Implementation',
          description: 'TreeNode, BST wrapper class, and inorder for sorted output.',
          readTime: '9 min',
          component: BstBasicImplementation,
        },
        {
          id: 'bst-search',
          title: 'Searching in a BST',
          description: 'Walk left or right by comparison — O(h) lookup.',
          readTime: '10 min',
          component: BstSearch,
        },
        {
          id: 'bst-insert',
          title: 'Inserting a Node in a BST',
          description: 'Search until None, then attach — same comparisons as search.',
          readTime: '11 min',
          component: BstInsert,
        },
        {
          id: 'bst-delete',
          title: 'Deleting a Node from a BST',
          description: 'Leaf, one child, or two children — successor replacement.',
          readTime: '13 min',
          component: BstDelete,
        },
      ],
    },
  ],
}
