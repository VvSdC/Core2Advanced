import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function CollectionsModule() {
  return (
    <LessonArticle>
      <Definition term="collections Module">
        <p>
          The standard library <strong className="text-white">collections</strong> module extends built-in types
          with specialized containers — interview favorites include <code className="font-mono text-sm">defaultdict</code>,{' '}
          <code className="font-mono text-sm">Counter</code>, <code className="font-mono text-sm">deque</code>, and{' '}
          <code className="font-mono text-sm">namedtuple</code>.
        </p>
      </Definition>

      <ContentStep number={1} title="defaultdict">
        <Example
          title="Auto-create missing keys"
          output={`{'a': ['x', 'y']}`}
        >{`from collections import defaultdict

groups = defaultdict(list)
groups["a"].append("x")
groups["a"].append("y")
print(dict(groups))`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Counter">
        <Example
          title="Count and combine"
          output={`Counter({'a': 3, 'b': 2})
Counter({'a': 4, 'b': 2, 'c': 1})`}
        >{`from collections import Counter

counts = Counter("aabba")
print(counts)
print(counts + Counter("aac"))`}</Example>
        <p><code className="font-mono text-sm">most_common(n)</code> returns top n elements — great for frequency problems.</p>
      </ContentStep>

      <ContentStep number={3} title="deque">
        <Example
          title="Fast append/pop from both ends"
        >{`from collections import deque

d = deque([1, 2, 3])
d.appendleft(0)
d.pop()
print(d)`}</Example>
        <p>O(1) at both ends vs O(n) for list.pop(0). Use for BFS queues and sliding windows.</p>
      </ContentStep>

      <ContentStep number={4} title="namedtuple">
        <Example
          title="Lightweight immutable records"
        >{`from collections import namedtuple

Point = namedtuple("Point", ["x", "y"])
p = Point(3, 4)
print(p.x, p.y)`}</Example>
        <Callout variant="info">
          For new code, consider <code className="font-mono text-sm">@dataclass</code> (mutable, more features) or{' '}
          <code className="font-mono text-sm">TypedDict</code>. namedtuple still appears in legacy code and interviews.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'defaultdict(factory) auto-creates missing keys.',
          'Counter counts hashable elements; supports arithmetic.',
          'deque: O(1) append/pop both ends — ideal for queues.',
          'namedtuple: tuple with named fields — lightweight records.',
        ]}
      />
    </LessonArticle>
  )
}
