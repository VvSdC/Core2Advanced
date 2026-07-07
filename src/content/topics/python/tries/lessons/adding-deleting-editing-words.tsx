import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function AddingDeletingEditingWords() {
  return (
    <LessonArticle>
      <Definition term="Add, Delete & Edit">
        <p>
          <strong className="text-white">Insert</strong> adds or extends a path. <strong className="text-white">Delete</strong>{' '}
          unmarks <code className="font-mono text-sm">is_end</code> and prunes leaf nodes no longer needed.{' '}
          <strong className="text-white">Edit</strong> (rename a word) is{' '}
          <code className="font-mono text-sm">delete(old) + insert(new)</code> — tries do not store word metadata at
          nodes, only character paths.
        </p>
      </Definition>

      <ContentStep number={1} title="Delete with pruning">
        <Flowchart
          title="Recursive delete"
          chart={`
flowchart TB
  A["Walk to end of word"]
  B["Unmark is_end"]
  C{"Node has other children or is_end of another word?"}
  D["Keep node — return False to parent"]
  E["Prune link — return True"]

  A --> B
  B --> C
  C -->|Yes| D
  C -->|No leaf unused| E
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Full mutable trie">
        <Example
          title="mutable_trie"
          output={`['car', 'card', 'cat']
['car', 'card', 'dog']
['car', 'card', 'dog', 'dot']
['car', 'card', 'dot']`}
          caption="Add cat → delete cat → edit dog to dot"
        >{`class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False


class MutableTrie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            node = node.children.setdefault(ch, TrieNode())
        node.is_end = True

    def search(self, word):
        node = self._find(word)
        return node is not None and node.is_end

    def delete(self, word):
        self._delete(self.root, word, 0)

    def _delete(self, node, word, i):
        if i == len(word):
            if not node.is_end:
                return False
            node.is_end = False
            return len(node.children) == 0
        ch = word[i]
        if ch not in node.children:
            return False
        should_prune = self._delete(node.children[ch], word, i + 1)
        if should_prune:
            del node.children[ch]
        return len(node.children) == 0 and not node.is_end

    def edit(self, old_word, new_word):
        if not self.search(old_word):
            return False
        self.delete(old_word)
        self.insert(new_word)
        return True

    def _find(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node

    def list_words(self):
        words, path = [], []
        def dfs(node):
            if node.is_end:
                words.append("".join(path))
            for ch, child in node.children.items():
                path.append(ch)
                dfs(child)
                path.pop()
        dfs(self.root)
        return sorted(words)


t = MutableTrie()
for w in ("cat", "car", "card"):
    t.insert(w)
print(t.list_words())

t.delete("cat")
print(t.list_words())

t.insert("dog")
t.edit("dog", "dot")
print(t.list_words())

t.delete("dog")   # dot remains — dog was already renamed
print(t.list_words())`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Edit semantics">
        <p>
          <code className="font-mono text-sm">edit(&quot;dog&quot;, &quot;dot&quot;)</code> removes the path for{' '}
          <code className="font-mono text-sm">dog</code> and inserts <code className="font-mono text-sm">dot</code>.
          Shared prefix <code className="font-mono text-sm">do</code> is reused — only the last character branch
          changes. Calling <code className="font-mono text-sm">delete(&quot;dog&quot;)</code> afterward has no effect
          because <code className="font-mono text-sm">dog</code> is no longer in the trie.
        </p>
        <Callout variant="insight">
          Delete must not remove nodes that are still part of other words — e.g. deleting{' '}
          <code className="font-mono text-sm">car</code> when <code className="font-mono text-sm">card</code> exists
          only unmarks the <code className="font-mono text-sm">r</code> node, keeping the <code className="font-mono text-sm">d</code>{' '}
          branch alive.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'insert: extend path, set is_end.',
          'delete: clear is_end; prune only unused leaf chains.',
          'edit(old, new) = delete(old) + insert(new).',
          'Never prune nodes needed by other words sharing a prefix.',
        ]}
      />
    </LessonArticle>
  )
}
