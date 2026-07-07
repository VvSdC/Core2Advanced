import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function BasicTrieImplementation() {
  return (
    <LessonArticle>
      <Definition term="Basic Trie">
        <p>
          Each <strong className="text-white">TrieNode</strong> holds a map of children (char → node) and a flag{' '}
          <code className="font-mono text-sm">is_end</code>. Insert walks one character per level; search follows
          the same path and checks <code className="font-mono text-sm">is_end</code> at the last character.
        </p>
      </Definition>

      <ContentStep number={1} title="TrieNode and Trie shell">
        <Example
          title="Trie class"
        >{`class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False


class Trie:
    def __init__(self):
        self.root = TrieNode()`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Insert, search, starts_with">
        <Example
          title="basic_trie"
          output={`True
True
False
True`}
        >{`class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False


class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def search(self, word):
        node = self._find_node(word)
        return node is not None and node.is_end

    def starts_with(self, prefix):
        return self._find_node(prefix) is not None

    def _find_node(self, prefix):
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node


trie = Trie()
for w in ("cat", "car", "card"):
    trie.insert(w)

print(trie.search("car"))        # True
print(trie.search("ca"))         # False — prefix only
print(trie.starts_with("ca"))    # True
print(trie.search("card"))       # True`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Complexity">
        <Callout variant="insight">
          Insert, search, and <code className="font-mono text-sm">starts_with</code> are{' '}
          <strong className="text-white">O(m)</strong> for word length m — one dict lookup per character. Space is
          O(total characters stored), with sharing across common prefixes.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'TrieNode: children dict + is_end flag.',
          'insert: create missing nodes, mark is_end on last char.',
          'search: require is_end; starts_with: any matching path.',
          'O(m) per operation for length m.',
        ]}
      />
    </LessonArticle>
  )
}
