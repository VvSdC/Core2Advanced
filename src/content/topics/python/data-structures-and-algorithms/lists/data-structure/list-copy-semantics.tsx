import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  StepSequence,
} from '../../../../../../components/content'

export function ListCopySemantics() {
  return (
    <LessonArticle>
      <Definition term="List Copy Semantics">
        <p>
          Python offers several ways to duplicate a list — but they are <em>not</em> interchangeable.{' '}
          <strong className="text-white">Assignment</strong> creates an alias.{' '}
          <strong className="text-white">Slicing</strong> and{' '}
          <code className="font-mono text-sm">list.copy()</code> create a{' '}
          <strong className="text-white">shallow copy</strong> — a new outer list that still shares inner
          objects.
        </p>
      </Definition>

      <ContentStep number={1} title="Three levels of &quot;copying&quot;">
        <StepSequence
          steps={[
            {
              title: 'Assignment (b = a)',
              description: 'No copy — b and a reference the same list object.',
            },
            {
              title: 'Shallow copy (a[:], a.copy(), list(a))',
              description: 'New list container; each slot still points to the same objects as the original.',
            },
            {
              title: 'Deep copy (copy.deepcopy(a))',
              description: 'Recursively clones nested objects — covered in the next lesson.',
            },
          ]}
        />
      </ContentStep>

      <ContentStep number={2} title="Assignment is not a copy">
        <Example
          title="b = a shares the list"
          output={`[99, 2, 3]
[99, 2, 3]`}
        >{`original = [1, 2, 3]
alias = original

alias[0] = 99
print(original)
print(alias)
print(original is alias)   # True`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Shallow copy methods">
        <Example
          title="Slice, .copy(), and list() are equivalent shallow copies"
          output={`False
[1, 2, 3]
[99, 2, 3]`}
        >{`a = [1, 2, 3]

by_slice = a[:]
by_method = a.copy()
by_ctor = list(a)

print(a is by_slice)   # False — new list object

by_slice[0] = 99
print(a)               # unchanged — outer list is independent
print(by_slice)`}</Example>
        <p>
          All three produce a new <code className="font-mono text-sm">PyListObject</code> with copied pointer
          slots. For a flat list of immutables, shallow copy is a full logical copy.
        </p>
      </ContentStep>

      <ContentStep number={4} title="Nested lists — shallow is not enough">
        <Example
          title="Inner lists are still shared"
          output={`[[99], [2]]
[[99], [2]]`}
        >{`grid = [[1], [2]]
shallow = grid.copy()

shallow[0].append(99)   # mutates the shared inner list
print(grid)
print(shallow)`}</Example>
        <Callout variant="insight">
          Shallow copy duplicates the <em>outer</em> pointer array. Each inner list object is still shared. This
          is the follow-up question interviewers ask after &quot;how do you copy a list?&quot;
        </Callout>
      </ContentStep>

      <ContentStep number={5} title="Common interview scenarios">
        <Example
          title="Passing a list to a function"
          output={`[1, 2, 3, 99]`}
        >{`def add_item(lst, item):
    lst.append(item)   # mutates caller's list

data = [1, 2, 3]
add_item(data, 99)
print(data)   # [1, 2, 3, 99] — parameter is a reference`}</Example>
        <p>
          To avoid mutating the caller&apos;s data, pass a shallow copy:{' '}
          <code className="font-mono text-sm">add_item(data.copy(), 99)</code> — but for nested structures you
          still need <code className="font-mono text-sm">copy.deepcopy</code>.
        </p>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Assignment (b = a) creates an alias, not a copy.',
          'a[:], a.copy(), and list(a) all produce a shallow copy.',
          'Shallow copy shares nested mutable objects — mutating inner affects both.',
          'For nested data, shallow copy is not enough; use deepcopy when needed.',
        ]}
      />
    </LessonArticle>
  )
}
