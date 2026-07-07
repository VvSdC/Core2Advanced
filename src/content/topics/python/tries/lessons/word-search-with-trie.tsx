import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function WordSearchWithTrie() {
  return (
    <LessonArticle>
      <Definition term="Word Search with a Trie">
        <p>
          Given a 2D board of letters and a list of words, find every word that can be formed by adjacent cells
          (horizontally or vertically) without reusing a cell. Building a <strong className="text-white">trie</strong>{' '}
          from the dictionary lets DFS prune paths that are not prefixes of any word — much faster than searching each
          word separately.
        </p>
      </Definition>

      <ContentStep number={1} title="Algorithm">
        <Flowchart
          title="DFS + trie pruning"
          chart={`
flowchart TB
  A["Build trie from word list"]
  B["DFS from each board cell"]
  C["Follow trie child for letter"]
  D{"Trie node is_end?"}
  E["Record word, continue if branch has children"]
  F["Backtrack — unmark cell"]

  A --> B
  B --> C
  C --> D
  D -->|Yes| E
  E --> F
  D -->|No| F
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Trie with word at node">
        <p>
          Store the completed word on end nodes so you do not rebuild it from the path. Remove words from the trie
          after finding to avoid duplicates (optional optimization).
        </p>
        <Example
          title="word_search"
          output={`['eat', 'oath']`}
        >{`class TrieNode:
    def __init__(self):
        self.children = {}
        self.word = None   # full word when this node ends one


def build_trie(words):
    root = TrieNode()
    for w in words:
        node = root
        for ch in w:
            node = node.children.setdefault(ch, TrieNode())
        node.word = w
    return root


def word_search(board, words):
    root = build_trie(words)
    rows, cols = len(board), len(board[0])
    found = []

    def dfs(r, c, node):
        ch = board[r][c]
        if ch not in node.children:
            return
        next_node = node.children[ch]
        if next_node.word:
            found.append(next_node.word)
            next_node.word = None   # avoid duplicate reporting
        board[r][c] = "#"
        for dr, dc in ((0, 1), (0, -1), (1, 0), (-1, 0)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != "#":
                dfs(nr, nc, next_node)
        board[r][c] = ch

    for r in range(rows):
        for c in range(cols):
            dfs(r, c, root)
    return found


board = [
    ["o", "a", "a", "n"],
    ["e", "t", "a", "e"],
    ["i", "h", "k", "r"],
    ["i", "f", "l", "v"],
]
print(sorted(word_search(board, ["oath", "pea", "eat", "rain"])))`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Why trie beats repeated search">
        <Callout variant="insight">
          Searching each word with DFS is O(words × 4<sup>L</sup>). One trie-guided DFS shares prefix exploration —
          when no trie child exists for the next letter, the branch stops immediately. Time is bounded by board cells
          × branching, with heavy pruning from the dictionary structure.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Build trie from dictionary; DFS from every cell.',
          'Follow trie children — no child means prune.',
          'Store word on end node; backtrack by restoring board cell.',
          'Classic Word Search II pattern — trie + backtracking.',
        ]}
      />
    </LessonArticle>
  )
}
