import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function DictAdvancedPatterns() {
  return (
    <LessonArticle>
      <Definition term="Dictionary Advanced Patterns">
        <p>
          Beyond basic lookups, dicts support insertion-ordered iteration (3.7+ guaranteed), view objects,
          merging, and patterns like counting and grouping — all common in interviews.
        </p>
      </Definition>

      <ContentStep number={1} title="Insertion order and views">
        <Example
          title="keys(), values(), items() are dynamic views"
        >{`d = {"b": 2, "a": 1}
d["c"] = 3
for k in d:
    print(k)   # b, a, c — insertion order

keys = d.keys()
d["d"] = 4
print(list(keys))   # view reflects live dict`}</Example>
      </ContentStep>

      <ContentStep number={2} title="setdefault, get, and merging">
        <Example
          title="Avoid redundant checks"
        >{`words = ["a", "b", "a", "c"]
counts = {}
for w in words:
    counts.setdefault(w, 0)
    counts[w] += 1

d1 = {"a": 1}
d2 = {"b": 2}
merged = d1 | d2          # Python 3.9+
d1.update(d2)             # in-place alternative`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Hashable keys — interview classic">
        <Callout variant="insight">
          Keys must be hashable: str, int, tuple of hashables — yes. list, dict, set — no.{' '}
          <code className="font-mono text-sm">frozenset</code> works as a key; <code className="font-mono text-sm">set</code> does not.
        </Callout>
      </ContentStep>

      <ContentStep number={4} title="dict comprehension patterns">
        <Example
          title="Invert, filter, transform"
        >{`original = {"a": 1, "b": 2, "c": 3}
inverted = {v: k for k, v in original.items()}
evens = {k: v for k, v in original.items() if v % 2 == 0}`}</Example>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Dicts preserve insertion order (3.7+).',
          'setdefault avoids if-key-not-in patterns for counting.',
          'Merge with | (3.9+) or update().',
          'Only hashable keys — lists and dicts cannot be keys.',
        ]}
      />
    </LessonArticle>
  )
}
