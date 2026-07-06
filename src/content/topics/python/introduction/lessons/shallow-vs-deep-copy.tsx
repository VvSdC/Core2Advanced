import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function ShallowVsDeepCopy() {
  return (
    <LessonArticle>
      <Definition term="Shallow vs Deep Copy">
        <p>
          Assignment (<code className="font-mono text-sm">b = a</code>) creates another reference to the{' '}
          <em>same</em> object — not a copy. <strong className="text-white">Shallow copy</strong> duplicates the
          outer container but shares nested objects. <strong className="text-white">Deep copy</strong> recursively
          clones everything.
        </p>
        <p>
          This distinction appears constantly in interviews involving lists of lists, dicts, and mutable defaults.
        </p>
      </Definition>

      <ContentStep number={1} title="Assignment vs copy">
        <Example
          title="b = a is not a copy"
          output={`[99, 2, 3]`}
        >{`a = [1, 2, 3]
b = a
b[0] = 99
print(a)   # both point to same list`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Shallow copy">
        <Example
          title="Outer new, inner shared"
          output={`[[99], [2]]
[[99], [2]]`}
        >{`import copy

grid = [[1], [2]]
shallow = copy.copy(grid)      # or grid.copy() for lists
shallow[0][0] = 99

print(grid)
print(shallow)`}</Example>
        <p>
          <code className="font-mono text-sm">list.copy()</code>, <code className="font-mono text-sm">copy.copy()</code>, and
          slicing <code className="font-mono text-sm">a[:]</code> are all shallow.
        </p>
      </ContentStep>

      <ContentStep number={3} title="Deep copy">
        <Example
          title="Fully independent nested data"
          output={`[[1], [2]]
[[99], [2]]`}
        >{`import copy

grid = [[1], [2]]
deep = copy.deepcopy(grid)
deep[0][0] = 99

print(grid)
print(deep)`}</Example>
      </ContentStep>

      <ContentStep number={4} title="When to use which">
        <Callout variant="insight">
          Flat list of numbers → shallow is enough. Nested structures, objects with references → deep copy when
          you need true independence. For performance-sensitive code, avoid copying — pass immutable data instead.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Assignment shares references; copy creates a new container.',
          'Shallow copy shares nested objects — mutating inner affects both.',
          'deepcopy() recursively clones nested mutable data.',
          'Interview trap: [[1]] * 3 and shallow copies of nested lists.',
        ]}
      />
    </LessonArticle>
  )
}
