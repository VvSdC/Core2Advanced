import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../../components/content'

export function ShallowDeepCopyLists() {
  return (
    <LessonArticle>
      <Definition term="Shallow & Deep Copy for Lists">
        <p>
          The <code className="font-mono text-sm">copy</code> module provides{' '}
          <code className="font-mono text-sm">copy.copy()</code> (shallow) and{' '}
          <code className="font-mono text-sm">copy.deepcopy()</code> (recursive). For lists, shallow copy is
          equivalent to <code className="font-mono text-sm">lst.copy()</code> or{' '}
          <code className="font-mono text-sm">lst[:]</code> — but neither fixes the{' '}
          <code className="font-mono text-sm">[[1]] * 3</code> trap.
        </p>
      </Definition>

      <ContentStep number={1} title="copy.copy vs list.copy()">
        <Example
          title="Shallow copy via copy module"
          output={`False
[1, 2, 3]`}
        >{`import copy

original = [1, 2, 3]
shallow = copy.copy(original)

print(original is shallow)   # False
shallow.append(4)
print(original)              # [1, 2, 3] — outer list independent`}</Example>
        <p>
          <code className="font-mono text-sm">copy.copy(x)</code> dispatches to{' '}
          <code className="font-mono text-sm">x.__copy__()</code> for lists — same result as{' '}
          <code className="font-mono text-sm">x.copy()</code>.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Shallow copy with nested lists">
        <Example
          title="Inner objects still shared"
          output={`[[1, 99], [2]]
[[1, 99], [2]]`}
        >{`import copy

grid = [[1], [2]]
shallow = copy.copy(grid)

shallow[0].append(99)
print(grid)
print(shallow)`}</Example>
        <Callout variant="insight">
          Shallow copy clones the outer list only. Every slot still references the same inner list objects.
        </Callout>
      </ContentStep>

      <ContentStep number={3} title="copy.deepcopy">
        <Example
          title="Fully independent nested structure"
          output={`[[1], [2]]
[[1, 99], [2]]`}
        >{`import copy

grid = [[1], [2]]
deep = copy.deepcopy(grid)

deep[0].append(99)
print(grid)    # inner list untouched
print(deep)`}</Example>
        <p>
          <code className="font-mono text-sm">deepcopy</code> walks the object graph, cloning each mutable
          container it finds. It handles cycles via a memo dict — safe for circular references.
        </p>
      </ContentStep>

      <ContentStep number={4} title="The [[1]] * 3 interview trap">
        <Example
          title="Multiplication creates references, not copies"
          output={`[[1, 99], [1, 99], [1, 99]]`}
        >{`row = [[1]]
grid = row * 3        # three refs to the SAME inner list

grid[0].append(99)
print(grid)`}</Example>
        <Example
          title="Correct ways to build independent rows"
          output={`[[1, 99], [1], [1]]`}
        >{`# List comprehension — new inner list each time
grid = [[1] for _ in range(3)]
grid[0].append(99)
print(grid)

# Or deepcopy if you already have shared refs
import copy
bad = [[1]] * 3
fixed = copy.deepcopy(bad)`}</Example>
        <Callout variant="insight">
          <code className="font-mono text-sm">[[1]] * 3</code> is equivalent to three slots pointing at one
          list — shallow copy cannot fix this because there is only one inner object to share. Use a
          comprehension or <code className="font-mono text-sm">deepcopy</code>.
        </Callout>
      </ContentStep>

      <ContentStep number={5} title="When to use which">
        <Callout variant="info">
          Flat list of numbers or strings → <code className="font-mono text-sm">lst.copy()</code> or{' '}
          <code className="font-mono text-sm">lst[:]</code> is enough. List of lists, dicts, or custom objects →{' '}
          <code className="font-mono text-sm">copy.deepcopy</code> when you need true independence. When in doubt
          in an interview, state the trade-off: shallow is faster; deep is correct for nested mutables.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'copy.copy() and list.copy() are shallow — outer new, inner shared.',
          'copy.deepcopy() recursively clones all nested mutable objects.',
          '[[1]] * 3 creates N references to one list — not N independent lists.',
          'Fix with [[1] for _ in range(n)] or deepcopy when sharing already exists.',
        ]}
      />
    </LessonArticle>
  )
}
