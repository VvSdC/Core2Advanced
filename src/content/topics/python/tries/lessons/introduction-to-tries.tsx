import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function IntroductionToTries() {
  return (
    <LessonArticle>
      <Definition term="Trie (Prefix Tree)">
        <p>
          A <strong className="text-white">trie</strong> stores strings character by character along paths from a
          root. Each edge is labeled with a letter; a node marked as <strong className="text-white">end of word</strong>{' '}
          means some inserted string ends there. All descendants of a node share the same prefix.
        </p>
      </Definition>

      <ContentStep number={1} title="Trie vs hash set">
        <Flowchart
          title="Why a trie?"
          chart={`
flowchart TB
  H["Hash set — O(m) lookup per word of length m"]
  T["Trie — share prefixes, prune early in search"]
  A["Autocomplete — list all words with prefix"]
  P["Prefix queries — starts_with in O(m)"]

  H --> T
  T --> A
  T --> P
        `}
        />
        <p>
          A hash set stores whole strings — no shared structure. A trie lets you ask &quot;does any inserted word
          start with <code className="font-mono text-sm">app</code>?&quot; without scanning every key.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Visual structure">
        <Example
          title="words"
          caption="Inserting cat, car, card — shared ca- prefix"
        >{`#        root
#       /
#      c
#     /
#    a
#   / \\
#  t*  r*
#     /
#    d*
# * = end of word`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Tradeoffs">
        <Callout variant="info">
          <strong className="text-white">Pros:</strong> fast prefix search, autocomplete, word games (Boggle), shared
          prefixes save space for similar words.
          <br />
          <strong className="text-white">Cons:</strong> more memory per node than a flat hash table for sparse
          alphabets; pointer-heavy in Python (dict per node).
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Trie = tree of characters; paths from root spell words.',
          'Nodes mark where a complete word ends.',
          'Excellent for prefix queries and dictionary-backed search.',
          'Space trades pointers for shared prefixes.',
        ]}
      />
    </LessonArticle>
  )
}
